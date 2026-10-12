import { spawn } from 'node:child_process'
import { createInterface } from 'node:readline'
import { resolve } from 'node:path'
import { root, environment } from './runtime.mjs'
export async function connect(mode) {
 const child=spawn(process.execPath,[resolve(root,'scripts/run-mcp.mjs'),mode],{env:environment(),stdio:['pipe','pipe','inherit']})
 let id=0;const pending=new Map()
 createInterface({input:child.stdout}).on('line',line=>{let msg;try{msg=JSON.parse(line)}catch{return};const p=pending.get(msg.id);if(p){clearTimeout(p.timer);pending.delete(msg.id);msg.error?p.reject(new Error(msg.error.message)):p.resolve(msg.result)}})
 child.on('error',fail);child.on('exit',()=>fail(new Error('MCP server exited')))
 function fail(e){for(const p of pending.values()){clearTimeout(p.timer);p.reject(e)}pending.clear()}
 function request(method,params){return new Promise((resolve,reject)=>{const n=++id;const timer=setTimeout(()=>{pending.delete(n);reject(new Error('MCP request timed out: '+method))},90000);pending.set(n,{resolve,reject,timer});child.stdin.write(JSON.stringify({jsonrpc:'2.0',id:n,method,params})+'\n')})}
 await request('initialize',{protocolVersion:'2025-06-18',capabilities:{},clientInfo:{name:'figure-studio',version:'0.1.0'}})
 child.stdin.write(JSON.stringify({jsonrpc:'2.0',method:'notifications/initialized'})+'\n')
 const tools=(await request('tools/list',{})).tools
 return {tools,async call(name,args={}){if(!tools.some(t=>t.name===name))throw new Error('Unknown tool: '+name);const result=await request('tools/call',{name,arguments:args});if(result.isError)throw new Error(JSON.stringify(result.structuredContent??result.content));return result},close(){child.stdin.end();child.kill()}}
}
export function value(result){if(result.structuredContent)return result.structuredContent;const t=result.content?.find(x=>x.type==='text')?.text;try{return JSON.parse(t)}catch{return t}}
