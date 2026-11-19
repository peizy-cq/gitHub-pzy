/**
 * 回忆录接口（仅开发期生效）
 * 挂到 VitePress 自带的 dev server 上，`npm run docs:dev` 时即可读写：
 *   GET  /api/memoir/list
 *   POST /api/memoir/add     {date,title,desc,img}
 *   POST /api/memoir/upload  {fileName,data}   data 为 dataURL
 *   POST /api/memoir/delete  {id}
 *
 * 记忆数据：docs/posts/memoir/memory.json
 * 照片目录：docs/public/memoir-images
 */
import fs from 'node:fs'
import fsp from 'node:fs/promises'
import path from 'node:path'
import crypto from 'node:crypto'

const API_PREFIX = '/api/memoir/'
const MAX_IMAGE = 10 * 1024 * 1024
const MAX_BODY = 14 * 1024 * 1024
const MAX_TITLE = 80
const MAX_DESC = 6000

const EXT_BY_MIME: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif'
}

const MIME_BY_EXT: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif'
}

function sendJson(res: any, data: unknown, status = 200) {
  const body = JSON.stringify(data)
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(body)
}

function readJson(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let raw = ''
    let size = 0
    req.on('data', (chunk: any) => {
      size += chunk.length
      if (size > MAX_BODY) {
        reject(new Error('数据过大，照片请控制在 10MB 以内'))
        req.destroy()
        return
      }
      raw += chunk
    })
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch {
        reject(new Error('请求数据不是合法 JSON'))
      }
    })
    req.on('error', reject)
  })
}

function readList(jsonPath: string) {
  try {
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'))
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function writeList(jsonPath: string, list: unknown[]) {
  const tmp = jsonPath + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(list, null, 2), 'utf8')
  fs.renameSync(tmp, jsonPath)
}

export function memoirApiPlugin() {
  const cwd = process.cwd()
  const docsDir = fs.existsSync(path.join(cwd, 'docs', 'posts'))
    ? path.join(cwd, 'docs')
    : cwd
  const jsonPath = path.join(docsDir, 'posts', 'memoir', 'memory.json')
  const imgDir = path.join(docsDir, 'public', 'memoir-images')

  async function handleUpload(fileName: string, dataUrl: string) {
    const m = /^data:(image\/[a-z+]+);base64,(.+)$/i.exec(String(dataUrl || ''))
    if (!m) throw new Error('照片格式无法识别')
    const ext = EXT_BY_MIME[m[1].toLowerCase()]
    if (!ext) throw new Error('只支持 JPG、PNG、WEBP、GIF 照片')

    const buf = Buffer.from(m[2], 'base64')
    if (buf.length > MAX_IMAGE) throw new Error('照片超过 10MB，请先压缩')
    if (buf.length < 16) throw new Error('照片内容为空')

    const stamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, '')
    const salt = crypto.randomBytes(3).toString('hex')
    const file = `${stamp}-${salt}${ext}`

    await fsp.mkdir(imgDir, { recursive: true })
    await fsp.writeFile(path.join(imgDir, file), buf)
    return { file, url: '/memoir-images/' + file }
  }

  async function handle(action: string, req: any, res: any) {
    if (action === 'list') {
      sendJson(res, readList(jsonPath))
      return
    }

    if (req.method !== 'POST') throw new Error('该接口需要 POST')
    const body = await readJson(req)

    if (action === 'add') {
      const date = String(body.date || '').trim()
      const title = String(body.title || '').trim()
      const desc = String(body.desc || '').trim()
      const img = String(body.img || '').trim()

      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('日期格式应为 2026-11-19')
      if (!title) throw new Error('标题不能为空')
      if (title.length > MAX_TITLE) throw new Error('标题不要超过 80 个字')
      if (desc.length > MAX_DESC) throw new Error('描述太长了')
      if (img && !MIME_BY_EXT[path.extname(img).toLowerCase()]) throw new Error('照片路径不合法')

      const list = readList(jsonPath)
      const item = {
        id: crypto.randomUUID(),
        date,
        title,
        desc,
        img,
        createdAt: new Date().toISOString()
      }
      list.push(item)
      writeList(jsonPath, list)
      sendJson(res, { ok: true, item })
      return
    }

    if (action === 'upload') {
      const saved = await handleUpload(String(body.fileName || ''), String(body.data || ''))
      sendJson(res, { ok: true, ...saved })
      return
    }

    if (action === 'delete') {
      const list = readList(jsonPath)
      const next = list.filter((it: any) => it.id !== body.id)
      if (next.length === list.length) throw new Error('这条记录不存在')
      writeList(jsonPath, next)
      sendJson(res, { ok: true })
      return
    }

    throw new Error('接口不存在')
  }

  return {
    name: 'memoir-api',
    apply: 'serve' as const,
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: () => void) => {
        const url: string = req.url || '/'
        const at = url.indexOf(API_PREFIX)
        if (at === -1) return next()

        const action = url.slice(at + API_PREFIX.length).split('?')[0]
        Promise.resolve()
          .then(() => handle(action, req, res))
          .catch((err: any) => sendJson(res, { ok: false, msg: err?.message || '服务端出错' }, 400))
      })
    }
  }
}
