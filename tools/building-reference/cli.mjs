import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {inspect,generate,check,encode} from './core.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
try{const command=process.argv[2];if(command==='inspect')process.stdout.write(encode(inspect(root)));else if(command==='generate'){generate(root);console.log('Reference generated and input identity reconciled');}else if(command==='check'){check(root);console.log('Reference current for exact bounded input snapshot');}else throw Error('Use inspect, generate or check');}catch(e){console.error(e.message);process.exitCode=1;}
