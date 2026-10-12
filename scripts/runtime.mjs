import { existsSync, readdirSync } from 'node:fs'
import { homedir } from 'node:os'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
export const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
export const plugin = resolve(root,'vendor/scientific-illustrator/plugins/scientific-illustrator')
export function drawioPath() {
  const explicit = process.env.DRAWIO_PATH
  if (explicit) { if (!existsSync(explicit)) throw new Error('DRAWIO_PATH 不存在：'+explicit); return explicit }
  const candidates = ['/Applications/draw.io.app/Contents/MacOS/draw.io',resolve(homedir(),'Applications/draw.io.app/Contents/MacOS/draw.io')]
  if (existsSync('/Volumes')) for (const d of readdirSync('/Volumes')) candidates.push(resolve('/Volumes',d,'draw.io.app/Contents/MacOS/draw.io'))
  const found=candidates.find(existsSync)
  if (!found) throw new Error('未找到 draw.io Desktop，请设置 DRAWIO_PATH')
  return found
}
export function environment() { return {...process.env,DRAWIO_PATH:drawioPath(),DRAWIO_LIVE_PORT:'9344',DRAWIO_LIVE_PROFILE:resolve(root,'.runtime/drawio')} }
