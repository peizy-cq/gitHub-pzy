---
layout: home 

hero:
  name: "github-pzy"
  text: "前端搬砖人"
  tagline: "用代码构建世界，用技术记录成长。"
  image:
    src: /images/4.jpg # 如果你没有 logo 可以随便放张图，或者删掉这行
    alt: Logo
  actions:
    - theme: brand
      text: 开始阅读
      link: /posts/javascript/closure
    - theme: alt
      text: GitHub
      link: https://github.com/peizy-cq/github-pzy
    - theme: sponsor
      text: 我的作品
      link: /posts/memoir/

features:
  - title: "⚡ 极速体验"
    details: "基于 VitePress 和 Vite 驱动，秒级冷启动，热更新极致丝滑。"
  - title: "🎨 原生前端"
    details: "支持 Markdown 中无缝嵌入 HTML、CSS 和 Vue 组件，自由定制展示效果。"
  - title: "💡 技术沉淀"
    details: "记录日常开发中的踩坑经验与源码解析，持续学习，不断进化。"
---

<!-- 下面是我们用原生 HTML + CSS 手写的炫酷区域 -->

<div class="cyber-container">
  <div class="glow-text">SYSTEM ONLINE...</div>
  
  <div class="grid-demo">
    <div class="demo-card">
      <div class="card-icon">🚀</div>
      <h3>性能优化</h3>
      <p>首屏加载 1s 内完成</p>
    </div>
    <div class="demo-card">
      <div class="card-icon">💻</div>
      <h3>前端工程化</h3>
      <p>Vite / Webpack 深度定制</p>
    </div>
    <div class="demo-card">
      <div class="card-icon">🔥</div>
      <h3>交互体验</h3>
      <p>丝滑的 CSS3 动画与 Canvas</p>
    </div>
  </div>

  <div class="marquee-wrapper">
    <div class="marquee-text">
      Coding the future.  Coding the future.  Coding the future.  Coding the future.  Coding the future.
    </div>
  </div>
</div>

<!-- 核心 CSS 样式 -->
<style>

/* 修改图片本身的样式 */
.VPHero .image-src {
  width: 120px !important;
  height: 120px !important;
  /* 2. 裁剪成圆形 */
  border-radius: 100% !important;
   /* 3. 关键：如果图片不是正方形，用 cover 让图片居中填满，不拉伸变形 */
  object-fit: cover !important;
  
  /* 如果你想给整个 Logo 加个发光特效（赛博朋克风） */
  filter: drop-shadow(0 0 20px #42d392); 
}
/* 稍微美化一下 VitePress 自带的首页主标题 */
.VPHero .name {
  background: -webkit-linear-gradient(315deg, #42d392 25%, #647eff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 900;
  text-shadow: 0 0 20px rgba(100, 126, 255, 0.3);
}

</style>
<style scoped>

/* 自定义页面的容器 */
.cyber-container {
  max-width: 100%;
  margin: 40px auto;
  padding: 0 24px;
}

/* 发光的文字 */
.glow-text {
  text-align: center;
  font-family: monospace;
  font-size: 1.2rem;
  color: #42d392;
  text-shadow: 0 0 10px #42d392, 0 0 20px #42d392;
  letter-spacing: 2px;/*文字间距*/
  margin-bottom: 40px;
  animation: pulse 2s infinite;/*明暗交替*/
}

/* 卡片网格布局 */
.grid-demo {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));/*自动创建尽可能多的列，每列最小 250px，最大平分剩余空间。*/
  gap: 20px;
  margin-bottom: 60px;
}

/* 单个卡片样式 */
.demo-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(100, 126, 255, 0.2);
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  transition: all 0.3s ease;/*当任何可过渡属性发生变化时，用 0.3 秒、以 ease 缓动曲线平滑过渡。*/
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

/* 卡片悬浮效果：发光+向上浮动 */
.demo-card:hover {
  transform: translateY(-8px);
  border-color: #42d392;
  box-shadow: 0 10px 30px -10px rgba(66, 211, 146, 0.4);
}

.card-icon {
  font-size: 2.5rem;
  margin-bottom: 12px;
}

.demo-card h3 {
  font-size: 1.2rem;
  margin: 0 0 8px 0;
  color: var(--vp-c-text-1);
}

.demo-card p {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin: 0;
}

/* 跑马灯效果 */
.marquee-wrapper {
  width: 100%;
  overflow: hidden;
  background: rgba(66, 211, 146, 0.1);
  border-radius: 8px;
  padding: 15px 0;
  border-left: 4px solid #42d392;
}

.marquee-text {
  font-family: monospace;
  color: #42d392;
  white-space: nowrap;
  animation: scroll 20s linear infinite;/* 应用名为 scroll 的动画，持续 20 秒，匀速播放，无限循环。 */
}

/* 动画定义 */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes scroll {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-100%); }
}
</style>