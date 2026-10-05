import fs from 'node:fs';
import path from 'node:path';
import {randomUUID} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const birth=pid=>{const p=spawnSync('ps',['-p',String(pid),'-o','lstart='],{encoding:'utf8',env:{...process.env,LC_ALL:'C'}});return p.status===0?p.stdout.trim():null;};
const live=record=>{try{process.kill(record.pid,0);}catch(e){return e.code!=='ESRCH';}const started=birth(record.pid);return !started||started===record.birth;};
const inode=s=>String(s.dev)+':'+String(s.ino);
// Immutable participant files use an exclusive hard link for the one updater lease.
// Recovery is serialized by the abandoned owner's inode, then rechecks identity and liveness.
// A delayed reaper cannot unlink a replacement live owner with a different inode/token.
export class WatchLease {
 constructor(root){this.dir=path.join(root,'tools/building-reference/.watch-lock');this.owner=path.join(this.dir,'owner.json');this.token=randomUUID();this.candidate='participant-'+this.token+'.json';const started=birth(process.pid);if(!started)throw Error('Cannot verify reference updater process birth; inspect the local ps runtime.');this.record={protocol:1,pid:process.pid,birth:started,token:this.token,candidate:this.candidate};this.warned=new Set();}
 warn(message){if(!this.warned.has(message)){this.warned.add(message);console.error('Reference updater: '+message);}}
 prepare(){fs.mkdirSync(this.dir,{recursive:true});if(fs.lstatSync(this.dir).isSymbolicLink())throw Error('Symbolic watch ownership directory is unsupported');this.file=path.join(this.dir,this.candidate);if(!fs.existsSync(this.file))fs.writeFileSync(this.file,JSON.stringify(this.record),{flag:'wx'});}
 snapshot(){try{const before=fs.statSync(this.owner),record=JSON.parse(fs.readFileSync(this.owner,'utf8')),after=fs.statSync(this.owner);if(inode(before)!==inode(after))return null;if(record.protocol!==1||!Number.isSafeInteger(record.pid)||record.pid<=0||typeof record.birth!=='string'||typeof record.token!=='string'||record.candidate!=='participant-'+record.token+'.json'||!/^participant-[0-9a-f-]+\.json$/.test(record.candidate)){this.warn('Unknown watch-owner record; preserve it and inspect its owner before recovery.');return null;}return {record,id:inode(after)};}catch(e){if(e.code!=='ENOENT')this.warn('Unreadable watch owner; preserve it and inspect before recovery.');return null;}}
 owns(){const s=this.snapshot();return !!s&&s.record.token===this.token&&s.record.pid===process.pid&&fs.existsSync(this.file)&&s.id===inode(fs.statSync(this.file));}
 claim(){this.prepare();if(this.owns())return true;try{fs.linkSync(this.file,this.owner);return true;}catch(e){if(e.code!=='EEXIST')throw e;}const old=this.snapshot();if(!old||live(old.record))return false;const recovery=path.join(this.dir,'recover-'+old.id.replace(':','-'));try{fs.mkdirSync(recovery);}catch(e){if(e.code==='EEXIST'){this.warn('An abandoned-owner recovery is already in progress; inspect an abandoned recovery directory before removing it.');return false;}throw e;}
  try{const current=this.snapshot();if(!current||current.id!==old.id||current.record.token!==old.record.token||live(current.record))return false;fs.unlinkSync(this.owner);const abandoned=path.join(this.dir,old.record.candidate);if(fs.existsSync(abandoned)&&inode(fs.statSync(abandoned))===old.id)fs.unlinkSync(abandoned);try{fs.linkSync(this.file,this.owner);return true;}catch(e){if(e.code!=='EEXIST')throw e;return false;}}
  finally{fs.rmdirSync(recovery);}
 }
 release(){if(this.file){if(this.owns())fs.unlinkSync(this.owner);if(fs.existsSync(this.file))fs.unlinkSync(this.file);try{fs.rmdirSync(this.dir);}catch(e){if(!['ENOENT','ENOTEMPTY','EEXIST'].includes(e.code))throw e;}}}
}
