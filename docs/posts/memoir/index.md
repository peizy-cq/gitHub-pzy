---
layout: page
title: 生活回忆录
---

<div id="memoir">
<header class="masthead">
<div class="masthead-inner">
<h1>生活回忆录</h1>
<div class="meta">
<span>共 <span class="num">{{ list.length }}</span> 条记录</span>
<span v-if="yearRange">{{ yearRange }}</span>
<span>最近一条 {{ latestText }}</span>
</div>
</div>
</header>

<div class="shell">
<section class="log">
<div class="timeline" v-html="timelineHTML" @click="onTimelineClick"></div>
</section>

<aside class="composer-wrap">
<div class="composer">
<h2>写一条</h2>
<p class="hint">记录写进 posts/memoir/memory.json，照片存到 public/memoir-images。</p>

<div class="field">
<label for="fDate">日期</label>
<input type="date" id="fDate" v-model="form.date">
</div>

<div class="field">
<label for="fTitle">标题</label>
<input type="text" id="fTitle" maxlength="80" v-model="form.title" placeholder="例如：在南山看了整晚的灯">
</div>

<div class="field">
<label for="fDesc">那天发生了什么</label>
<textarea id="fDesc" v-model="form.desc" placeholder="当时的心情、和谁一起、记住了什么细节……"></textarea>
</div>

<div class="field">
<label for="fImg">照片</label>
<div class="drop" :class="{ 'is-drag': dragging }" @dragover.prevent="dragging = true" @dragleave.prevent="dragging = false" @drop.prevent="onDrop">
<div class="drop-txt"><b>点这里选一张</b><br>也可以直接把图片拖进来</div>
<input ref="fileInput" type="file" id="fImg" accept="image/jpeg,image/png,image/webp,image/gif" @change="onPick">
</div>
<div class="preview" v-if="pending">
<img :src="pending.url" alt="待上传的照片">
<div class="preview-info">
<span class="name">{{ pending.name }} · {{ pending.kb }} KB</span>
<button type="button" class="btn-ghost" @click="clearPending">移除</button>
</div>
</div>
</div>

<button class="btn-save" :disabled="busy || !online" @click="save">{{ busy ? '正在保存…' : '保存这条回忆' }}</button>
<p class="hint offline" v-if="!online">没有连上读写接口。先运行 npm run docs:dev，再在这个端口下打开本页。</p>
</div>
</aside>
</div>

<div class="toast" :class="{ 'is-on': toastMsg }">{{ toastMsg }}</div>
<div class="lightbox" v-if="lightboxSrc" @click="lightboxSrc = ''"><img :src="lightboxSrc" alt=""></div>
</div>

<style>
#memoir {
  --paper: #fbfaf6;
  --paper-2: #f2efe6;
  --ink: #1e2224;
  --ink-soft: #5c646a;
  --ink-body: #373d42;
  --rule: #dbd7ca;
  --accent: #2f6f63;
  --danger: #a8463c;
  --datew: 84px;
  --axlew: 26px;
  background: var(--paper);
  color: var(--ink);
  font-family: system-ui, -apple-system, "Microsoft YaHei", "PingFang SC", "Hiragino Sans GB", sans-serif;
  font-size: 15px;
  line-height: 1.7;
  padding-bottom: 40px;
}

#memoir h1,
#memoir h2,
#memoir h3,
#memoir p {
  margin: 0;
}

#memoir h1,
#memoir h2,
#memoir h3 {
  border: 0;
  letter-spacing: normal;
  color: var(--ink);
}

#memoir .masthead {
  padding: 54px 22px 26px;
  border-bottom: 1px solid var(--rule);
}

#memoir .masthead-inner {
  max-width: 1080px;
  margin: 0 auto;
}

#memoir h1 {
  font-size: clamp(26px, 5vw, 44px);
  font-weight: 600;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

#memoir .meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 18px;
  margin-top: 14px;
  font-size: 14px;
  color: var(--ink-soft);
}

#memoir .meta .num {
  color: var(--ink);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}

#memoir .shell {
  max-width: 1080px;
  margin: 0 auto;
  padding: 34px 22px 60px;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 38px;
}

#memoir .log {
  order: 2;
  min-width: 0;
}

#memoir .composer-wrap {
  order: 1;
  min-width: 0;
}

@media (min-width: 900px) {
  #memoir .shell {
    grid-template-columns: minmax(0, 1fr) 336px;
    gap: 54px;
    align-items: start;
  }

  #memoir .log {
    order: 1;
  }

  #memoir .composer-wrap {
    order: 2;
    position: sticky;
    top: 84px;
  }
}

#memoir .composer {
  border-top: 2px solid var(--ink);
  padding-top: 16px;
}

#memoir .composer h2 {
  font-size: 17px;
  font-weight: 600;
}

#memoir .hint {
  margin: 6px 0 20px;
  font-size: 13px;
  line-height: 1.6;
  color: var(--ink-soft);
}

#memoir .offline {
  margin: 12px 0 0;
  color: var(--danger);
}

#memoir .field {
  margin-bottom: 15px;
}

#memoir .field label {
  display: block;
  margin-bottom: 6px;
  font-size: 13px;
  color: var(--ink-soft);
  font-weight: 400;
}

#memoir input[type="date"],
#memoir input[type="text"],
#memoir textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--rule);
  border-radius: 3px;
  background: #fff;
  color: var(--ink);
  font: inherit;
  font-size: 16px;
  line-height: 1.5;
  transition: border-color .15s ease;
}

#memoir input[type="text"]::placeholder,
#memoir textarea::placeholder {
  color: #a8ada8;
}

#memoir input[type="date"]:focus,
#memoir input[type="text"]:focus,
#memoir textarea:focus {
  border-color: var(--accent);
  outline: none;
}

#memoir textarea {
  min-height: 96px;
  resize: vertical;
}

#memoir .drop {
  position: relative;
  padding: 22px 14px;
  border: 1px dashed var(--rule);
  border-radius: 3px;
  background: #fff;
  text-align: center;
  cursor: pointer;
  transition: border-color .15s ease, background .15s ease;
}

#memoir .drop:hover,
#memoir .drop.is-drag {
  border-color: var(--accent);
  background: var(--paper-2);
}

#memoir .drop-txt {
  font-size: 14px;
  color: var(--ink-soft);
}

#memoir .drop-txt b {
  color: var(--ink);
  font-weight: 600;
}

#memoir .drop input[type="file"] {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

#memoir .preview {
  margin-top: 10px;
}

#memoir .preview img {
  display: block;
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 3px;
  background: var(--paper-2);
}

#memoir .preview-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 6px;
  font-size: 12px;
  color: var(--ink-soft);
}

#memoir .preview-info .name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

#memoir .btn-ghost {
  flex: none;
  background: none;
  border: 0;
  padding: 0;
  color: var(--ink-soft);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}

#memoir .btn-ghost:hover {
  color: var(--danger);
}

#memoir .btn-save {
  width: 100%;
  margin-top: 4px;
  padding: 12px 16px;
  border: 0;
  border-radius: 3px;
  background: var(--accent);
  color: #fff;
  font: inherit;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background .15s ease;
}

#memoir .btn-save:hover {
  background: #275d53;
}

#memoir .btn-save:disabled {
  background: #7f9d95;
  cursor: progress;
}

#memoir .timeline {
  position: relative;
}

#memoir .timeline::before {
  content: "";
  position: absolute;
  left: calc(var(--datew) + var(--axlew) / 2 - 1px);
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--rule);
}

#memoir .tl-year {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: baseline;
  gap: 14px;
  padding: 26px 0 14px;
  background: var(--paper);
}

#memoir .tl-year:first-child {
  padding-top: 0;
}

#memoir .tl-year span {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.06em;
  font-variant-numeric: tabular-nums;
}

#memoir .tl-year small {
  font-size: 12px;
  color: var(--ink-soft);
}

#memoir .tl-year::after {
  content: "";
  flex: 1;
  height: 1px;
  background: var(--rule);
}

#memoir .entry {
  display: grid;
  grid-template-columns: var(--datew) var(--axlew) minmax(0, 1fr);
  align-items: start;
  margin-bottom: 18px;
}

#memoir .date {
  font-size: 12px;
  line-height: 1.4;
  color: var(--ink-soft);
  padding-right: 10px;
}

#memoir .date b {
  display: block;
  font-size: 15px;
  font-weight: 600;
  color: var(--ink);
  font-variant-numeric: tabular-nums;
}

#memoir .axis {
  display: grid;
  justify-items: center;
}

#memoir .dot {
  width: 9px;
  height: 9px;
  margin-top: 8px;
  border-radius: 50%;
  background: var(--accent);
}

#memoir .card {
  min-width: 0;
  padding: 16px 18px;
  border: 1px solid var(--rule);
  border-radius: 3px;
  background: #fff;
}

#memoir .card-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

#memoir .card-head h3 {
  font-size: 17px;
  font-weight: 600;
  line-height: 1.5;
  overflow-wrap: anywhere;
}

#memoir .btn-del {
  flex: none;
  background: none;
  border: 0;
  padding: 0;
  color: var(--ink-soft);
  font: inherit;
  font-size: 12px;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
  transition: color .15s ease;
}

#memoir .btn-del:hover {
  color: var(--danger);
}

#memoir .desc {
  margin: 8px 0 0;
  color: var(--ink-body);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

#memoir .photo {
  display: block;
  width: 100%;
  max-height: 360px;
  margin-top: 14px;
  object-fit: cover;
  border-radius: 2px;
  background: var(--paper-2);
  cursor: zoom-in;
}

#memoir .empty {
  padding: 46px 22px;
  border: 1px dashed var(--rule);
  border-radius: 3px;
  background: #fff;
  text-align: center;
  color: var(--ink-soft);
  font-size: 14px;
}

#memoir .toast {
  position: fixed;
  left: 50%;
  bottom: 26px;
  transform: translate(-50%, 10px);
  max-width: calc(100% - 32px);
  padding: 10px 16px;
  border-radius: 4px;
  background: var(--ink);
  color: #fff;
  font-size: 14px;
  opacity: 0;
  pointer-events: none;
  transition: opacity .2s ease, transform .2s ease;
  z-index: 40;
}

#memoir .toast.is-on {
  opacity: 1;
  transform: translate(-50%, 0);
}

#memoir .lightbox {
  position: fixed;
  inset: 0;
  z-index: 60;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(20, 24, 24, .92);
  cursor: zoom-out;
}

#memoir .lightbox img {
  max-width: 94vw;
  max-height: 88vh;
  border-radius: 2px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, .35);
}

@media (max-width: 560px) {
  #memoir {
    --datew: 64px;
    --axlew: 20px;
  }

  #memoir .card {
    padding: 14px;
  }

  #memoir .card-head h3 {
    font-size: 16px;
  }

  #memoir .masthead {
    padding: 40px 18px 20px;
  }

  #memoir .shell {
    padding: 26px 18px 50px;
    gap: 30px;
  }
}

@media (prefers-reduced-motion: reduce) {
  #memoir * {
    transition: none !important;
    animation: none !important;
  }
}
</style>

<script setup>
import { computed, onMounted, onUnmounted, reactive, ref } from 'vue'
import { withBase } from 'vitepress'

const API = withBase('/api/memoir/')
const IMG = withBase('/memoir-images/')
const MAX_IMAGE = 10 * 1024 * 1024
const ALLOWED = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const WEEK = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

const list = ref([])
const form = reactive({ date: todayStr(), title: '', desc: '' })
const pending = ref(null)
const busy = ref(false)
const dragging = ref(false)
const online = ref(true)
const toastMsg = ref('')
const lightboxSrc = ref('')
const fileInput = ref(null)
let toastTimer = null

function pad(n) {
  return n < 10 ? '0' + n : '' + n
}

function todayStr() {
  const d = new Date()
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
}

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function parseDate(str) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str || '')
  if (!m) return { y: '', m: '', d: '', w: '' }
  const dt = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]))
  return { y: m[1], m: +m[2], d: +m[3], w: WEEK[dt.getUTCDay()] }
}

async function api(path, body) {
  const res = await fetch(API + path, body
    ? { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    : undefined)
  let data = {}
  try { data = await res.json() } catch { data = {} }
  if (!res.ok) throw new Error(data.msg || '请求失败')
  return data
}

const sorted = computed(() =>
  list.value.slice().sort((a, b) => String(b.date).localeCompare(String(a.date)))
)
const yearRange = computed(() => {
  const years = sorted.value.map((it) => parseDate(it.date).y).filter(Boolean)
  if (!years.length) return ''
  const min = years[years.length - 1]
  const max = years[0]
  return min === max ? min + ' 年' : min + ' — ' + max + ' 年'
})

const latestText = computed(() => {
  const d = parseDate(sorted.value.length ? sorted.value[0].date : '')
  return d.y ? d.y + '.' + pad(d.m) + '.' + pad(d.d) : '—'
})

const timelineHTML = computed(() => {
  if (!sorted.value.length) {
    return '<div class="empty">这里还是空的。写下第一件事，照片可以一起存进来。</div>'
  }
  const counts = {}
  sorted.value.forEach((it) => {
    const y = parseDate(it.date).y
    counts[y] = (counts[y] || 0) + 1
  })

  let html = ''
  let curYear = ''
  sorted.value.forEach((it) => {
    const d = parseDate(it.date)
    if (d.y !== curYear) {
      curYear = d.y
      html += '<div class="tl-year"><span>' + esc(d.y) + '</span><small>' + counts[d.y] + ' 条</small></div>'
    }
    html += '<div class="entry">'
      + '<div class="date"><b>' + pad(d.m) + '.' + pad(d.d) + '</b><span>' + d.w + '</span></div>'
      + '<div class="axis"><i class="dot"></i></div>'
      + '<article class="card">'
      + '<div class="card-head"><h3>' + esc(it.title) + '</h3>'
      + '<button type="button" class="btn-del" data-id="' + esc(it.id) + '">删除</button></div>'
      + (it.desc ? '<p class="desc">' + esc(it.desc) + '</p>' : '')
      + (it.img ? '<img class="photo" loading="lazy" src="' + IMG + esc(it.img) + '" alt="' + esc(it.title) + ' 的照片">' : '')
      + '</article></div>'
  })
  return html
})

function toast(msg) {
  toastMsg.value = msg
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { toastMsg.value = '' }, 2400)
}

async function load() {
  try {
    const data = await api('list')
    list.value = Array.isArray(data) ? data : []
    online.value = true
  } catch {
    online.value = false
  }
}

function pick(file) {
  if (!file) return
  if (!ALLOWED.includes(file.type)) {
    toast('只支持 JPG、PNG、WEBP、GIF 图片')
    return
  }
  if (file.size > MAX_IMAGE) {
    toast('照片超过 10MB，先压缩一下再传')
    return
  }
  const reader = new FileReader()
  reader.onload = (ev) => {
    pending.value = {
      name: file.name,
      kb: Math.round(file.size / 1024),
      data: ev.target.result,
      url: ev.target.result
    }
  }
  reader.onerror = () => toast('这张图片读不出来')
  reader.readAsDataURL(file)
}

function onPick(e) {
  pick(e.target.files && e.target.files[0])
}

function onDrop(e) {
  dragging.value = false
  pick(e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0])
}

function clearPending() {
  pending.value = null
  if (fileInput.value) fileInput.value.value = ''
}

async function save() {
  if (busy.value) return
  const date = form.date
  const title = form.title.trim()
  const desc = form.desc.trim()

  if (!date) { toast('先选一个日期'); return }
  if (!title) { toast('给这段回忆起个标题'); return }

  busy.value = true
  try {
    let img = ''
    if (pending.value) {
      const up = await api('upload', { fileName: pending.value.name, data: pending.value.data })
      img = up.file
    }
    await api('add', { date, title, desc, img })
    list.value = await api('list')

    form.title = ''
    form.desc = ''
    form.date = todayStr()
    clearPending()
    toast(img ? '已保存，照片也存进去了' : '已保存')
  } catch (err) {
    toast(err.message || '保存失败')
  } finally {
    busy.value = false
  }
}

async function onTimelineClick(e) {
  const delBtn = e.target.closest('.btn-del')
  if (delBtn) {
    const id = delBtn.getAttribute('data-id')
    if (!window.confirm('删除这条记录？照片文件会留在 memoir-images 里。')) return
    try {
      await api('delete', { id })
      list.value = list.value.filter((it) => it.id !== id)
      toast('已删除')
    } catch (err) {
      toast(err.message || '删除失败')
    }
    return
  }
  const photo = e.target.closest('.photo')
  if (photo) lightboxSrc.value = photo.getAttribute('src')
}

function onKeydown(e) {
  if (e.key === 'Escape') lightboxSrc.value = ''
}

onMounted(() => {
  load()
  document.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
})
</script>
