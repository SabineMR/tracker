import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {config,identity,nativeParser,digest} from './core.mjs';
import {WatchLease} from './watch.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'), c=config(root), key=process.argv[2], entry=c.commands?.[key];
if(!entry){console.error('Unknown reviewed native command');process.exit(1);}
const nested=process.env.BUILDING_REFERENCE_PARENT===root, nativeOnly=process.env.BUILDING_REFERENCE_NATIVE_PHASE==='1';
let stopping=false,timer,referenceChild,app,lease,previous,lastCode=0,busy=false;
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
const mark=()=>{try{return digest(JSON.stringify(identity(root,config(root),nativeParser(root,config(root)).info)));}catch(e){return digest(e.message);}};
const reference=async()=>{const writer=path.join(root,'tools/building-reference/.writer-lock');for(let n=0;fs.existsSync(writer)&&n<100;n++)await delay(100);return new Promise(resolve=>{referenceChild=spawn(process.execPath,[path.join(root,'tools/building-reference/cli.mjs'),'generate'],{cwd:root,stdio:'inherit'});referenceChild.once('exit',code=>{lastCode=code??1;referenceChild=null;resolve(lastCode);});});};
const poll=async()=>{if(stopping||busy)return;busy=true;try{if(!lease.claim()){previous=undefined;return;}const now=mark();if(now!==previous){await reference();previous=now;}}catch(e){console.error('Reference updater: '+e.message);}finally{busy=false;}};
const shutdown=signal=>{if(stopping)return;stopping=true;clearInterval(timer);if(app){try{process.kill(-app.pid,signal)}catch{}}};
for(const sig of ['SIGINT','SIGTERM'])process.on(sig,()=>shutdown(sig));
try{
 if(!nested&&!nativeOnly&&entry.watch){try{lease=new WatchLease(root);if(lease.claim()){await reference();previous=mark();}}catch(e){console.error('Reference updater: '+e.message);}}
 if(!nested&&!nativeOnly&&!entry.watch&&entry.startup){await reference();previous=mark();}
 if(stopping)throw Error('Stopped before native startup');
 app=spawn('/bin/sh',['-c',entry.command+' "$@"','reference-owned-child',...process.argv.slice(3)],{cwd:path.resolve(root,entry.cwd),stdio:'inherit',detached:true,env:{...process.env,BUILDING_REFERENCE_PARENT:root}});
 if(lease)timer=setInterval(poll,750);
 const result=await new Promise(resolve=>{app.once('exit',(code,signal)=>resolve({code,signal}));app.once('error',e=>{console.error(e.message);resolve({code:1,signal:null});});});clearInterval(timer);
 // Only this launcher's owned group is stopped; independent sibling apps keep running.
 try{process.kill(-app.pid,'SIGTERM')}catch{}app=null;
 while(busy||referenceChild)await delay(20);
 if(!nested&&!nativeOnly){if(entry.watch){if(lease?.owns()&&mark()!==previous)await reference();}else if(!entry.startup||mark()!==previous)await reference();}
 process.exitCode=result.code??(result.signal==='SIGINT'?130:result.signal==='SIGTERM'?143:1);if(!entry.watch&&lastCode!==0)process.exitCode=lastCode;
}catch(e){console.error('Reference lifecycle: '+e.message);process.exitCode=1;}finally{clearInterval(timer);lease?.release();}
