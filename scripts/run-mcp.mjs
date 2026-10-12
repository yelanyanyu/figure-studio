import { spawn } from 'node:child_process'
import { resolve } from 'node:path'
import { plugin, environment } from './runtime.mjs'
const mode=process.argv[2]
if (!['live','files'].includes(mode)) throw new Error('Expected live or files')
const child=spawn(process.execPath,[resolve(plugin,'scripts',mode==='live'?'live-server.mjs':'server.mjs')],{env:environment(),stdio:'inherit',cwd:plugin})
for (const signal of ['SIGINT','SIGTERM']) process.on(signal,()=>child.kill(signal))
child.on('error',e=>{console.error(e.message);process.exit(1)})
child.on('exit',code=>process.exit(code??1))
