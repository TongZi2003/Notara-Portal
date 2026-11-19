import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  esc,
  icons,
  renderClothBookshelf,
  renderHubOverviewShell,
  renderMarketPlaza,
  renderOpenLetters,
  renderPedagogyShowcase,
  renderWorkbenchActs,
  renderWorkspaceShell,
} from './app-replica.mjs';
import {
  extraLessonScenes,
  learningSets,
  lessons,
  pathFor,
  showcaseScenes,
} from './library.mjs';
import { mark, showcaseFigure } from './plates.mjs';
import { buildStaticOpenFeeds, OPEN_LABS_FEED_URL, OPEN_LABS_PACK_DEFS } from './open-feeds.mjs';
import { generateParchmentPngBuffer } from './texture.mjs';

const require = createRequire(import.meta.url);
const rootDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(rootDir, '..', '..');
const vendorAssetsDir = join(rootDir, 'vendor-assets');
const isStandalone = existsSync(vendorAssetsDir);
const distDir = join(rootDir, 'dist');

function pageShell({ title, description, currentPath, body, appPage = false }) {
  const isLibrary = currentPath === '/library/' || currentPath === '/resources/';
  const isGuide = currentPath === '/guide/' || currentPath === '/install/';
  const isLetters = currentPath === '/letters/';

  const headerHtml = appPage
    ? ''
    : `<header class="masthead">
        <div class="wrap masthead-inner">
          <a class="brand" href="/" ${currentPath === '/' ? 'aria-current="page"' : ''}>
            ${mark}
            <span>Notara</span>
          </a>
          <nav class="nav" aria-label="主导航">
            <a href="/#manifesto">理念</a>
            <a class="nav-hide-sm" href="/#pedagogy">教学法</a>
            <a class="nav-hide-sm" href="/#workbench">核心工作流</a>
            <a href="/library/" ${isLibrary ? 'aria-current="page"' : ''}>资源市集</a>
            <a href="/letters/" ${isLetters ? 'aria-current="page"' : ''}>公开信</a>
            <a class="nav-cta" href="/guide/" ${isGuide ? 'aria-current="page"' : ''}>桌面版</a>
          </nav>
        </div>
      </header>`;

  const footerHtml = appPage
    ? ''
    : `<footer class="colophon">
        <div class="wrap colophon-inner">
          <span>Notara · 以“人”为镜，可以明得失。</span>
          <div class="colophon-links">
            <a href="/code-video/">代码视频微课</a>
            <a href="/feeds/open-labs/catalog.json">公开连接器源 JSON</a>
            <a href="/letters/">三封公开信</a>
            <a href="/library/">资源市集与样卷</a>
            <a href="/guide/">本地文件与 BYOK 说明</a>
          </div>
        </div>
      </footer>`;

  return `<!doctype html>
<html lang="zh-CN" data-appearance="techo">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="theme-color" content="#ece7dc">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='none' stroke='%2326211c' stroke-width='1.5'%3E%3Crect x='2.5' y='3' width='15' height='14' rx='2'/%3E%3Cline x1='10' y1='3' x2='10' y2='17' stroke-dasharray='2 1.6'/%3E%3C/svg%3E">
  <link rel="stylesheet" href="/vendor/katex/katex.min.css">
  <link rel="stylesheet" href="/pa-themes.css">
  <link rel="stylesheet" href="/portal.css">
</head>
<body>
  <a class="skip-link" href="#main">跳至正文</a>
  ${headerHtml}
  <main id="main">
    ${body}
  </main>
  ${footerHtml}
  <script src="/study.mjs" defer></script>
</body>
</html>`;
}

function renderPostscriptNote() {
  return `<div class="postscript-inner">
    <p class="section-rubric">跋 · 开发手记</p>
    <h2 class="manifesto-title">走过不少造轮子的弯路，<span class="nowrap">才落定今天这张安稳的书桌。</span></h2>
    <hr class="manifesto-rule">
    <div class="manifesto-prose postscript-prose">
      <p>
        如果现在打开我电脑的桌面，角落里还堆着好几代半途折戟的“前身”。说来惭愧，这一路走得慢，倒不全是因为问题有多深奥，更多是犯了技术人常见的毛病——<strong>每逢撞见一项之前没接触过的新技术或新架构，就忍不住手痒着迷，一头扎进去想自己从零造一套轮子。</strong>
      </p>
      <p>
        于是我给命令行工具硬改过学习模块，也手搓过繁复的专用工具层、状态机与宿主补丁，前前后后折腾掉大量时间。直到把它们真正放进每天高频使用的学习场景里，才不得不咽下苦果：那些凭一时兴起重复造出来的轮子，在复杂的边界情况与生产级稳定性要求面前根本不堪一击。
      </p>
      <p>
        咬牙把这些跑不稳的自造轮子亲手删掉，老老实实退回成熟可靠的运行内核与最朴素的 Markdown、Canvas 文件之后，一切反而一下子顺畅起来。交够这笔学费我才真正明白：<strong>做一件陪人长年读书的器物，最忌讳拿用户的书桌去满足开发者自己的猎奇心</strong>——底座越老实、越稳当，坐在这里看书推演的人才能越安心。
      </p>
      <p>
        这间书房依然年轻，有些功能还在试验与打磨，但它终于褪去了那些脆弱的花架子，长成了我自己每天深夜最放心推门坐进去的样子。如果你也正在自学的路上摸索，欢迎进来坐坐。
      </p>
    </div>
  </div>`;
}

function renderHomeStage() {
  const allTabs = [
    ...showcaseScenes.map((s) => ({ id: s.id, label: s.tabLabel })),
    { id: 'hub-shelf', label: '私人书房 · 跨学科布面书架' },
  ];

  const tabsHtml = allTabs
    .map(
      (t, idx) => `<button
        type="button"
        class="scene-tab"
        role="tab"
        id="tab-${esc(t.id)}"
        aria-controls="panel-${esc(t.id)}"
        aria-selected="${idx === 0 ? 'true' : 'false'}"
        tabindex="${idx === 0 ? '0' : '-1'}"
        data-scene-target="${esc(t.id)}"
      >${esc(t.label)}</button>`
    )
    .join('');

  const scenePanelsHtml = showcaseScenes
    .map(
      (scene, idx) => `<div
        class="scene-panel"
        role="tabpanel"
        id="panel-${esc(scene.id)}"
        aria-labelledby="tab-${esc(scene.id)}"
        data-scene-panel="${esc(scene.id)}"
        ${idx === 0 ? '' : 'hidden'}
      >
        ${renderWorkspaceShell({ scene, embedMode: true, primaryHeadingTag: 'h2' })}
      </div>`
    )
    .join('');

  const hubPanelHtml = `<div
    class="scene-panel"
    role="tabpanel"
    id="panel-hub-shelf"
    aria-labelledby="tab-hub-shelf"
    data-scene-panel="hub-shelf"
    hidden
  >
    ${renderHubOverviewShell({ learningSets, embedMode: true, primaryHeadingTag: 'h2' })}
  </div>`;

  return `<div data-study-window>
    <div class="stage-switcher-bar">
      <div class="scene-tabs" role="tablist" aria-label="切换真实桌面书房场景">
        ${tabsHtml}
      </div>
      <span class="stage-switcher-hint">1:1 还原桌面端手帐界面 · 可直接点开右侧「先看思路提示」「去讨论」，或切换导读与白板试玩</span>
    </div>
    <div class="pa-app-window pa-app-window--embed">
      ${scenePanelsHtml}
      ${hubPanelHtml}
    </div>
  </div>`;
}

function renderHome() {
  const body = `
    <section class="hero">
      <div class="wrap">
        <h1>一间记得你每一步思考的<span class="nowrap">自习书房。</span></h1>
        <p class="hero-lead">
          <span class="nowrap">在这张书桌上摊开讲义和白板，</span><span class="nowrap">与知悉你来时路的导师、同学发问交手，</span><br class="desktop-br">
          <span class="nowrap">在不经意间对知识产生真正的洞察。</span>
        </p>
        <div class="hero-actions">
          <a class="btn-primary" href="/guide/#download">下载桌面书房</a>
          <a class="btn-quiet" href="/library/">进入公开书房试读 →</a>
        </div>
      </div>
    </section>

    <section class="stage-section" aria-label="Notara 真实桌面书房界面演示">
      <div class="wrap-wide">
        ${renderHomeStage()}
      </div>
    </section>

    <section class="manifesto" id="manifesto">
      <div class="wrap">
        <div class="manifesto-inner">
          <p class="section-rubric">序 · 心智之镜</p>
          <h2 class="manifesto-title">以“人”为镜，<span class="nowrap">可以明得失。</span></h2>
          <p class="manifesto-epigraph">
            《师说》叹解惑之难，伯牙惜知音之稀。<br class="desktop-br">
            当人类千年的文字与推演凝入硅片，愿这方电路化作明镜，照见血肉苦弱的我们。
          </p>
          <hr class="manifesto-rule">
          <div class="manifesto-prose">
            <p>
              人非生而知之者。独自面对书本苦读时，最难破的局往往是“当局者迷”——囿于血肉之躯的疲惫、遗忘与思维惯性，我们很难分辨自己哪里只是似懂非懂、哪里还藏着盲区，也难以验证心头一闪而过的直觉究竟站不站得住脚。
            </p>
            <p>
              古人说“以人为镜，可以明得失”。唯有在真诚、敏锐的师友或对手面前往复辩难、彼此印证，我们才能分清认知里的<strong>「得」</strong>与<strong>「失」</strong>——哪些是真正融会贯通的本领，哪些是习焉不察的漏洞与偏见。只是在过去，能随时遇到这样一位耐心切磋的良师益友，终究是极少数人的幸运。
            </p>
            <p>
              今天，人类数千年积淀的文字与推演在硅片上重新汇聚。我们想借这份不知疲倦的算力，筑起一间人人皆可推门而入的安静书房——在这里，每一次回看与追问，都指向同一件事：让<strong>提问的眼力、辨析的本领与独立面对未知的底气</strong>，真正长在自己身上。
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="chapter" id="pedagogy">
      <div class="wrap">
        <div class="chapter-head chapter-head--wide">
          <p class="section-rubric">法 · 三段式混合教法</p>
          <h2>取百家教法之长，<span class="nowrap">不拘泥于单一教条。</span></h2>
          <p>
            世上没有哪一种教法能包打天下。面对全然陌生的新概念，痛快直接地把来龙去脉讲透，比硬搞“启发”高效得多；面对踮起脚刚好能够到的卡点，才最适合用苏格拉底法搭一级梯子；等到觉得真掌握了，再请出费曼学习法做一次盲测检验——让每种经典教法都用在它最该发力的火候上。
          </p>
        </div>

        ${renderPedagogyShowcase()}
      </div>
    </section>

    <section class="chapter" id="workbench">
      <div class="wrap">
        <div class="chapter-head chapter-head--wide">
          <p class="section-rubric">核 · 核心工作流</p>
          <h2>让读过的每一份资料，<span class="nowrap">真正长成你自己的知识体系。</span></h2>
          <p>
            下面五个环节首尾相接，替你接过拆卷、归档与排期的琐碎活儿，让手头的讲义和错题在白板推演、师友切磋与间隔复盘里，一步步沉淀成真正带得走的能力。
          </p>
        </div>

        <nav class="wf-overview-rail" aria-label="五大核心工作流速览">
          <a class="wf-overview-step" href="#wf-graph">
            <span class="wf-overview-idx">01</span>
            <strong>会生长的知识图谱</strong>
            <small>PDF / 错卷 / 笔记持续 Merge</small>
          </a>
          <a class="wf-overview-step" href="#wf-agents">
            <span class="wf-overview-idx">02</span>
            <strong>个人 Agent 协同编排</strong>
            <small>主 Agent 统筹 · 专题课与后台工作员</small>
          </a>
          <a class="wf-overview-step" href="#wf-canvas">
            <span class="wf-overview-idx">03</span>
            <strong>可视化推演白板</strong>
            <small>原生 .canvas 空间连线与框选</small>
          </a>
          <a class="wf-overview-step" href="#wf-personas">
            <span class="wf-overview-idx">04</span>
            <strong>记得习惯的老师与同学</strong>
            <small>同桌盲测 + 导师启发（试验功能）</small>
          </a>
          <a class="wf-overview-step" href="#wf-review">
            <span class="wf-overview-idx">05</span>
            <strong>双轨制间隔复习</strong>
            <small>独立升档轨 × 辅助短复查轨</small>
          </a>
        </nav>

        ${renderWorkbenchActs()}
      </div>
    </section>

    <section class="chapter" id="sets">
      <div class="wrap">
        <div class="chapter-head chapter-head--wide">
          <p class="section-rubric">源 · 资源市集与 AI 原生社区</p>
          <h2>你只管安心看书，<span class="nowrap">让私人 Agent 替你去市集与论坛淘干货。</span></h2>
          <p>
            备考时最怕自己泡进论坛找资料——干货还没捞着，先被满屏贩卖焦虑的水帖乱了阵脚。除了支持无损追更的课程包市集，我们正把社区从底层打造成面向个人 Agent 原生开放的知识网络：经你授权后，书房助教可以定时替你去刷论坛、盯紧大考后的真题变式，帮你挡在情绪噪音之外，只把契合当前进度的好题与微实验悄悄带回书桌。
          </p>
        </div>

        ${renderMarketPlaza()}

        <div class="starter-shelf-block">
          <div class="starter-shelf-intro">
            <h3>随包内置开箱样卷 · 网页端免登录即点即试</h3>
            <span>以下为客户端默认附赠的起步样本，点击任意书封可直接推门进入对应科目的全屏实景课堂</span>
          </div>

          <div class="shelf-tier shelf-4col">
            <div class="shelf-tier-head">
              <h4>上层 · 高中核心专题样卷</h4>
              <span>点击书封在线试学</span>
            </div>
            ${renderClothBookshelf(learningSets.filter((s) => s.stage === '高中'))}
          </div>

          <div class="shelf-tier shelf-5col">
            <div class="shelf-tier-head">
              <h4>下层 · 大学基础硬课样卷</h4>
              <span>点击书封在线试学</span>
            </div>
            ${renderClothBookshelf(learningSets.filter((s) => s.stage === '大学'))}
          </div>
        </div>

        <div class="byo-material-card">
          <div>
            <h3>市集里暂时还没有你在修的冷门专业课？直接把讲义拖进来。</h3>
            <p>
              无论是学校内部印发的高数讲义 PDF、期末复习 PPT、课堂板书照片，还是做了一半卡住的试卷草稿，拖入桌面书房即可拆解并入你的本地图谱，现拆现学。
            </p>
          </div>
          <a class="btn-quiet" href="/library/">进入「私人书房 · 资源市集」完整预览 →</a>
        </div>
      </div>
    </section>

    <section class="chapter" id="letters">
      <div class="wrap">
        <div class="chapter-head chapter-head--wide">
          <p class="section-rubric">信 · 写给不同阶段的你</p>
          <h2>无论你正坐在教室、宿舍，<span class="nowrap">还是下班后的台灯前。</span></h2>
          <p>
            从中学的题海突围、大学的硬课开荒，到走出校门后纯粹为求知而读的深夜——我们把打磨这间书房的本心，写进了下面这三封信里。
          </p>
        </div>

        ${renderOpenLetters({ standalone: false })}
      </div>
    </section>

    <section class="chapter" id="contract">
      <div class="wrap">
        <div class="chapter-head">
          <p class="section-rubric">契 · 纯粹与坦荡</p>
          <h2>笔记归你，接入自由，安静不打扰。</h2>
        </div>
        <div class="pledge-grid">
          <div class="pledge-col">
            <h3>笔记永远留在你自己电脑里</h3>
            <p>你写下的所有理解、批注与白板，都是电脑文件夹里普通的 <code>.md</code> 与 <code>.canvas</code> 开放文档，不锁死在任何封闭云端——哪怕有一天卸载软件，用 Obsidian 或记事本照样完整打开。</p>
          </div>
          <div class="pledge-col">
            <h3>开箱即用，也可自由接自己的模型</h3>
            <p>既可以直接使用官方配置好的导学服务开箱即学，也支持免注册填入你自己的模型密钥（DeepSeek、Claude、OpenAI 等本机直连，不经中转，不赚一分差价）。</p>
          </div>
          <div class="pledge-col">
            <h3>安静克制，绝不制造焦虑</h3>
            <p>没有社交排行榜，没有断签清零的红点催促，也不会静默上传你的任何私人草稿与课堂对话。书房只在你推门进来思考时亮灯。</p>
          </div>
        </div>
      </div>
    </section>

    <section class="manifesto postscript-section" id="postscript">
      <div class="wrap">
        ${renderPostscriptNote()}

        <div class="closing-sheet" id="download">
          <div class="closing-copy">
            <h2>推门进书房，<span class="nowrap">先从一个具体问题开始。</span></h2>
            <p>你可以现在就在浏览器里任选一门实景课堂动手试上几分钟，也可以前往桌面版页面了解 macOS 与 Windows 客户端的获取方式。</p>
          </div>
          <div class="closing-actions">
            <a class="btn-primary" href="/first-lesson/">进入实景课堂试一课</a>
            <a class="btn-quiet" href="/guide/#download">查看桌面版客户端与上手说明 →</a>
            <span class="closing-spec">支持 macOS（Apple Silicon / Intel）与 Windows 10/11 · 本地开放文档</span>
          </div>
        </div>
      </div>
    </section>
  `;

  return pageShell({
    title: 'Notara — 一间记得你每一步思考的自习书房',
    description:
      '在这张书桌上摊开讲义和白板，与知悉你来时路的导师、同学发问交手，在不经意间对知识产生真正的洞察。',
    currentPath: '/',
    body,
  });
}

function renderLibraryPage(currentPath = '/library/') {
  const body = `
    <div class="app-showcase-topbar">
      <div class="app-showcase-topbar-inner">
        <div style="display:flex;align-items:center;gap:14px;">
          <a href="/">← 返回 Notara 首页</a>
          <span style="opacity:0.4;">|</span>
          <span>真实客户端「私人书房 · 全局总管」在线预览（免登录）</span>
        </div>
        <div style="display:flex;align-items:center;gap:16px;">
          <a href="/first-lesson/">进入指针交互课堂</a>
          <a href="/guide/#download">获取桌面版 →</a>
        </div>
      </div>
    </div>
    <div class="pa-app-window pa-app-window--page">
      ${renderHubOverviewShell({ learningSets, embedMode: false, primaryHeadingTag: 'h1' })}
    </div>
  `;

  return pageShell({
    title: '资源市集与私人书房 · Notara',
    description: '1:1 真实复刻 Notara 资源市集（Market）、多源连接器广场与随包内置开箱试读样卷。',
    currentPath,
    body,
    appPage: true,
  });
}

function renderInteractiveLabForLesson(lesson) {
  if (lesson.figure === 'memory') {
    const cells = Array.from({ length: 16 }, (_, idx) => {
      const hex = `0x100${idx.toString(16).toUpperCase()}`;
      return `<div class="byte-cell" data-byte-index="${idx}">${hex}</div>`;
    }).join('');
    return `<div class="lab-embed-box" data-lab="memory" aria-label="连续十六字节指针步进实验">
      <div class="lab-controls">
        <div class="seg-group" role="group" aria-label="选择元素字节宽度">
          <button type="button" class="seg-btn" data-byte-width="1" aria-pressed="false">1 字节</button>
          <button type="button" class="seg-btn" data-byte-width="2" aria-pressed="false">2 字节</button>
          <button type="button" class="seg-btn" data-byte-width="4" aria-pressed="true">4 字节</button>
        </div>
        <div style="display:flex;gap:6px;flex-wrap:wrap;">
          <button type="button" class="pa-sdoc-secondary-btn" data-step-next>下一个元素</button>
          <button type="button" class="pa-sdoc-ghost-btn pa-sdoc-ghost-btn--bordered" data-step-reset>回到起点</button>
        </div>
      </div>
      <div class="byte-grid">${cells}</div>
      <div class="lab-readout">
        <span id="memory-desc">当前下标 0 · 每步跨过 4 字节</span>
        <span>当前指针地址：<strong id="address">0x1000</strong></span>
      </div>
    </div>`;
  }

  if (lesson.figure === 'curve') {
    return `<div class="lab-embed-box" data-lab="curve" aria-label="割线逼近切线交互实验">
      <div class="range-row">
        <label for="h-slider" style="font-size:12.5px;font-weight:500;">拖动两点间隔 <em>h</em>：</label>
        <input id="h-slider" type="range" min="0.05" max="1.20" step="0.05" value="0.60" aria-label="两点间隔 h" data-h-slider>
      </div>
      <svg class="canvas-svg" viewBox="0 0 420 200" role="img" aria-label="抛物线 y = x² 上的割线与切线逼近">
        <rect x="0.5" y="0.5" width="419" height="199" rx="6" fill="#fdfbf7" stroke="#dfd7c8"/>
        <line x1="36" y1="176" x2="392" y2="176" stroke="#cfc5b4"/>
        <line x1="56" y1="18" x2="56" y2="188" stroke="#cfc5b4"/>
        <path d="M 56 176 Q 191 176 326 56" fill="none" stroke="#2c2722" stroke-width="2"/>
        <line x1="90" y1="191" x2="373" y2="65" stroke="#cfc5b4" stroke-width="1.3" stroke-dasharray="4 3"/>
        <line data-secant-line x1="90" y1="191" x2="373" y2="45" stroke="#7d5c46" stroke-width="1.8"/>
        <circle cx="191" cy="146" r="4.2" fill="#2c2722"/>
        <text x="198" y="156" font-size="11" fill="#2c2722" font-family="Georgia, serif">A(1, 1)</text>
        <circle data-point-b cx="272" cy="99" r="4.5" fill="#7d5c46"/>
      </svg>
      <div class="lab-readout">
        <span id="experiment-result">当间隔 h = 0.60 时，割线斜率是 2.60（切线斜率为 2.00）</span>
      </div>
    </div>`;
  }

  if (lesson.figure === 'scale') {
    return `<div class="lab-embed-box" data-lab="scale" aria-label="无穷小相加与相减尺度对比">
      <div class="lab-controls">
        <div class="seg-group" role="group" aria-label="切换运算情形">
          <button type="button" class="seg-btn" data-scale-mode="add" aria-pressed="true">情形一：相加 ((x + x²) + x) / x</button>
          <button type="button" class="seg-btn" data-scale-mode="sub" aria-pressed="false">情形二：相减 ((x + x²) − x) / x²</button>
        </div>
      </div>
      ${showcaseFigure('limit-scale')}
      <div class="lab-readout" id="scale-detail"></div>
    </div>`;
  }

  if (lesson.figure === 'notes') {
    return `<div class="lab-embed-box" data-lab="notes" aria-label="跨天续接便签对比">
      <div class="lab-controls">
        <div class="seg-group" role="group" aria-label="切换便签样例">
          <button type="button" class="seg-btn" data-note-sample="a" aria-pressed="true">便签 A</button>
          <button type="button" class="seg-btn" data-note-sample="b" aria-pressed="false">便签 B</button>
        </div>
      </div>
      <div class="lab-readout" id="note-example" style="margin-top:0;"></div>
    </div>`;
  }

  return '';
}

function renderLessonPage(lesson, currentPath) {
  const letters = ['A', 'B', 'C'];
  const idx = lessons.findIndex((l) => l.slug === lesson.slug);
  const nextLesson = lessons[(idx + 1) % lessons.length];
  const baseScene =
    showcaseScenes.find((s) => s.id === lesson.sceneId) ||
    extraLessonScenes[lesson.sceneId] ||
    showcaseScenes[0];
  const sceneForLesson = {
    ...baseScene,
    cardTitle: lesson.title,
  };

  const quizHtml = `<section class="pa-sdoc-card" data-quiz data-correct-index="${lesson.correct}" data-explanation="${esc(lesson.explanation)}" data-hint="${esc(lesson.hint)}">
    <div class="pa-sdoc-sec-head">
      <span class="pa-sdoc-sec-label">动手核对一步</span>
    </div>
    <p style="margin:0;font-size:13.5px;line-height:1.7;color:var(--pa-ink);">${esc(lesson.question)}</p>
    <div class="answer-list">
      ${lesson.answers
        .map(
          (ans, i) => `<button type="button" class="answer-btn" data-answer-index="${i}">${letters[i]} ${esc(ans)}</button>`
        )
        .join('')}
    </div>
    <div class="answer-feedback" role="status" aria-live="polite"></div>
  </section>`;

  const customUnderstandingHtml =
    lesson.slug === 'restart-note'
      ? `<section class="pa-sdoc-card pa-sdoc-card--understanding">
          <div class="pa-sdoc-sec-head">
            <span class="pa-sdoc-sec-label">我的理解 · 写下明天的第一步线索</span>
            <span style="font-size:11.5px;color:var(--pa-ink-muted);">${icons.edit} 本地浏览器暂存</span>
          </div>
          <label for="own-note" style="font-size:12.5px;color:var(--pa-ink-secondary);">
            试着为你正在学的一门课留下一句“下次坐回桌前五分钟就能动笔检验”的具体问题：
          </label>
          <textarea id="own-note" class="pa-sdoc-textarea" rows="3" placeholder="例如：明天先不看笔记，画出 f(t)=t³ 在 t=0 的切线…"></textarea>
          <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">
            <button type="button" class="pa-sdoc-secondary-btn" data-save-note>保存在本浏览器</button>
            <button type="button" class="pa-sdoc-ghost-btn pa-sdoc-ghost-btn--bordered" data-copy-note>复制学习小结</button>
            <span id="note-status" style="font-size:12px;color:var(--pa-ink-muted);"></span>
          </div>
          <div data-copy-fallback-wrap hidden style="margin-top:6px;">
            <label for="copy-fallback-input" style="font-size:11.5px;color:var(--pa-ink-muted);">可手动复制的学习小结</label>
            <input id="copy-fallback-input" type="text" class="pa-sdoc-textarea" style="margin-top:4px;padding:6px 10px;" aria-label="可手动复制的学习小结" data-copy-fallback readonly>
          </div>
        </section>`
      : '';

  const body = `
    <div class="app-showcase-topbar">
      <div class="app-showcase-topbar-inner">
        <div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;">
          <a href="/">← 首页</a>
          <span style="opacity:0.4;">·</span>
          <a href="/library/">回到公开学习集目录</a>
          <span style="opacity:0.4;">|</span>
          <span>真实书房样课：${esc(lesson.title)}</span>
        </div>
        <div style="display:flex;align-items:center;gap:16px;">
          <a href="${esc(pathFor(nextLesson))}">下一课：${esc(nextLesson.title)} →</a>
        </div>
      </div>
    </div>
    <div class="pa-app-window pa-app-window--page">
      ${renderWorkspaceShell({
        scene: sceneForLesson,
        embedMode: false,
        customLabHtml: renderInteractiveLabForLesson(lesson),
        quizHtml,
        customUnderstandingHtml,
        primaryHeadingTag: 'h1',
      })}
    </div>
  `;

  return pageShell({
    title: `${lesson.title} · Notara 公开样课`,
    description: lesson.intro,
    currentPath,
    body,
    appPage: true,
  });
}

function renderGuide(currentPath = '/guide/') {
  const body = `
    <div class="wrap">
      <header class="page-header">
        <p class="section-rubric">桌面书房获取与上手</p>
        <h1>一间安放在你电脑里的长期书房。</h1>
        <p>
          安装后既可在「资源市集」订阅各学科课程包与开源实验源，也可随时拖入你自己的课本讲义与错题，自由选择官方导学连接或自带模型密钥。
        </p>
      </header>

      <section id="download">
        <div class="download-grid">
          <div class="download-card">
            <span class="download-card-tag">macOS · Apple Silicon (M1–M4) &amp; Intel</span>
            <h2>Notara 桌面端 for macOS</h2>
            <p>支持 macOS 13 及以上系统。内置高中与大学起步样卷、多源资源市集连接器、原生 JSON Canvas 白板与本地沙箱环境。</p>
            <div class="download-card-actions">
              <a class="btn-primary" href="/first-lesson/">内测分发中 · 先在线试读实景</a>
              <span style="font-size:0.78rem;color:var(--ink-muted);">v0.1.0-preview · DMG 安装包</span>
            </div>
          </div>

          <div class="download-card">
            <span class="download-card-tag">Windows · 10 / 11 (64-bit)</span>
            <h2>Notara 桌面端 for Windows</h2>
            <p>支持 Windows 10 / 11（x64）。本地文件夹直接存储标准 Markdown 卡片与手帐记忆，订阅市集追更或软件升级绝不触碰已有个人笔记。</p>
            <div class="download-card-actions">
              <a class="btn-primary" href="/library/">进入资源市集与在线试读样卷</a>
              <span style="font-size:0.78rem;color:var(--ink-muted);">v0.1.0-preview · 安装程序</span>
            </div>
          </div>
        </div>
      </section>

      <section class="chapter" style="padding-top:12px;border-top:0;">
        <div class="chapter-head" style="margin-bottom:28px;">
          <p class="section-rubric">三步跑通核心工作流</p>
          <h2>无需折腾复杂配置，五分钟开启<span class="nowrap">第一节推演课。</span></h2>
        </div>

        <div class="ledger">
          <div class="ledger-row">
            <div class="ledger-num">01</div>
            <h3>挑一卷公开标杆，或把异构资料 Merge 入图谱</h3>
            <div class="ledger-body">
              <p>首次打开空学习集时，可从书架一键铺开高中导数、离子平衡或大学高数、线代等公开标杆；也可以直接把学校的 PDF 讲义、错题卷或随堂笔记拖进来，持续融合进同一张会生长的知识图谱。</p>
            </div>
          </div>
          <div class="ledger-row">
            <div class="ledger-num">02</div>
            <h3>为统一主 Agent 与后台工作员接好模型</h3>
            <div class="ledger-body">
              <p>想省心可直接登录使用官方导学连接；已有 DeepSeek、Claude、OpenAI 等 API Key 或原生订阅的同学，无需注册账号即可本机直连——首页统筹主 Agent、专题课堂与五类后台工作员还能分别指定最合适的模型。</p>
            </div>
          </div>
          <div class="ledger-row" id="access">
            <div class="ledger-num">03</div>
            <h3>白板推演、师友交手，再按双轨排期沉淀</h3>
            <div class="ledger-body">
              <p>在 <code>.canvas</code> 白板上摊开原卷切片与分支推导，卡壳时体验记得你习惯的导师启发（试验功能），学通后切换「同桌盲测」讲给看不见解析的同学听；收尾按独立提取与提示辅助双轨排布间隔复习，稳扎稳打内化。</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  `;

  return pageShell({
    title: '桌面版获取与上手指南 · Notara',
    description: 'Notara macOS 与 Windows 桌面端说明、自带模型连接方式与三步开启第一节推演课指南。',
    currentPath,
    body,
  });
}

function renderCodeVideoPage(catalogItems = []) {
  const itemsHtml = OPEN_LABS_PACK_DEFS.map((def, idx) => {
    const meta = catalogItems.find((c) => c.id === def.id);
    const kb = meta ? `${Math.max(1, Math.round(meta.bundleBytes / 1024))} KB` : '~24 KB';
    return `<section class="chapter" style="padding-top:${idx === 0 ? '24px' : '44px'};border-top:${idx === 0 ? '0' : '1px solid var(--rule)'};">
      <div class="chapter-head chapter-head--wide" style="margin-bottom:20px;">
        <p class="section-rubric">代码视频样板 0${idx + 1} · ${esc(def.subject)}</p>
        <h2>${esc(def.title)}</h2>
        <p>${esc(def.description)}</p>
        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:12px;font-size:12.5px;color:var(--ink-muted);">
          <span>整包大小（含导读 + 双卡 + 白板 + 动画脚本）：<strong>${esc(kb)}</strong></span>
          <span>·</span>
          <a href="/feeds/open-labs/bundles/${esc(def.id)}.notara-pack.json" style="color:var(--accent);text-decoration:underline;">查看真实 .notara-pack.json ↗</a>
        </div>
      </div>
      <div style="border:1px solid rgba(92,76,58,0.22);border-radius:8px;overflow:hidden;background:#f6f1e6;box-shadow:0 8px 26px rgba(44,39,34,0.06);">
        <iframe
          src="/code-video/demos/${esc(def.demoSlug)}.html"
          title="${esc(def.title)}"
          sandbox="allow-scripts"
          style="display:block;width:100%;height:${Number(def.demoHeight) || 472}px;border:0;background:#f6f1e6;"
          loading="eager"
        ></iframe>
      </div>
    </section>`;
  }).join('');

  const body = `
    <div class="wrap">
      <header class="page-header">
        <p class="section-rubric">L1 真实公开连接器源 · 交互式代码视频</p>
        <h1>随时按下暂停就能改参数的<span class="nowrap"> 20 KB 矢量代码微课。</span></h1>
        <p>
          下面三套开放微课包已直接打包为标准 <code>.notara-pack.json</code> 并挂载至公网开放连接器源。你可以在网页里直接点击播放、拖动时间轴、随时暂停伸手改参数；也可以把下方 <code>catalog.json</code> 地址贴进 Notara 桌面端「私人书房 → 连接器」，一键免登录订阅并无损合入你的本地学习集。
        </p>
        <div style="margin-top:18px;padding:12px 16px;border-radius:10px;border:1px solid var(--rule-strong);background:var(--paper-sheet);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
          <div style="min-width:0;font-size:13px;">
            <strong style="display:block;margin-bottom:3px;color:var(--ink);">公网开放连接器地址（免登录直连）：</strong>
            <code style="word-break:break-all;color:var(--accent);">${esc(OPEN_LABS_FEED_URL)}</code>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <a class="btn-quiet" href="/feeds/open-labs/catalog.json">查看原始 catalog.json ↗</a>
            <a class="btn-primary" href="/library/">返回资源市集与样卷</a>
          </div>
        </div>
      </header>

      ${itemsHtml}
    </div>
  `;

  return pageShell({
    title: '交互式代码视频微课与公开连接器源 · Notara',
    description: '体验 20 KB 60fps 矢量交互代码视频微课，并获取 Notara 真实公网开放连接器源 catalog.json。',
    currentPath: '/code-video/',
    body,
  });
}

function render404Page() {
  const body = `
    <section class="hero" style="padding-top:96px;padding-bottom:96px;">
      <div class="wrap">
        <p class="section-rubric">404 · 页面未找到</p>
        <h1>这一页暂时不在书房里。</h1>
        <p class="hero-lead">
          你访问的地址可能已移动或输入有误。可以直接回到首页，或进资源市集挑一节实景课开始试读。
        </p>
        <div class="hero-actions">
          <a class="btn-primary" href="/">回到 Notara 首页</a>
          <a class="btn-quiet" href="/library/">进入公开书房试读 →</a>
        </div>
      </div>
    </section>
  `;

  return pageShell({
    title: '页面未找到 · Notara',
    description: '你访问的 Notara 页面不存在，请返回首页或公开书房试读目录。',
    currentPath: '/404.html',
    body,
  });
}

function renderLettersPage() {
  const body = `
    <div class="wrap">
      <header class="page-header">
        <p class="section-rubric">公开信 · 致不同阶段的自学者</p>
        <h1>无论你正坐在教室、宿舍，还是下班后的台灯前。</h1>
        <p>
          写给正在题海里寻找出路的中学生、独自直面硬核专业课的大学生，以及离开考场后依然不愿放弃深度思考的终身学习者。
        </p>
      </header>

      <section style="padding: 40px 0 48px;">
        ${renderOpenLetters({ standalone: true })}
      </section>

      <section class="manifesto postscript-section" style="padding-bottom: 72px;">
        ${renderPostscriptNote()}
      </section>
    </div>
  `;

  return pageShell({
    title: '给中学生、大学生与终身学习者的三封公开信 · Notara',
    description: '写给中学生、大学生与终身学习者的三封公开信。',
    currentPath: '/letters/',
    body,
  });
}

async function writeRoute(relPath, html) {
  const outFile = join(distDir, relPath, 'index.html');
  await mkdir(dirname(outFile), { recursive: true });
  await writeFile(outFile, html, 'utf8');
}

await rm(distDir, { recursive: true, force: true });
await mkdir(distDir, { recursive: true });

// 1. Copy & scope real Personal Agent `themes.css` + genuine `Notara WenKai` font
if (isStandalone) {
  await writeFile(
    join(distDir, 'pa-themes.css'),
    await readFile(join(vendorAssetsDir, 'pa-themes.css'), 'utf8'),
    'utf8'
  );
} else {
  const rawPaThemes = await readFile(
    join(repoRoot, 'notara-core/plugins/personal-agent/src/themes.css'),
    'utf8'
  );
  const scopedPaThemes = rawPaThemes
    .replace(/html,\s*body,\s*#root\s*\{/, '.pa-fullscreen-app-lock {')
    .replaceAll('/notara/personal-agent/fonts/wenkai.woff2', '/assets/fonts/wenkai.woff2');
  await writeFile(join(distDir, 'pa-themes.css'), scopedPaThemes, 'utf8');
}

const fontSrcDir = isStandalone
  ? join(vendorAssetsDir, 'fonts')
  : join(repoRoot, 'packages/vault-core/assets');
await mkdir(join(distDir, 'assets/fonts'), { recursive: true });
await writeFile(
  join(distDir, 'assets/fonts/wenkai.woff2'),
  await readFile(join(fontSrcDir, 'wenkai.woff2'))
);
await writeFile(
  join(distDir, 'assets/fonts/wenkai-license.txt'),
  await readFile(join(fontSrcDir, 'wenkai-license.txt'))
);

// 2. Copy real KaTeX CSS & woff2 fonts so math renders identically offline/self-hosted
const katexDist = join(dirname(require.resolve('katex/package.json')), 'dist');
await mkdir(join(distDir, 'vendor/katex/fonts'), { recursive: true });
await writeFile(
  join(distDir, 'vendor/katex/katex.min.css'),
  await readFile(join(katexDist, 'katex.min.css'), 'utf8'),
  'utf8'
);
for (const fontFile of await readdir(join(katexDist, 'fonts'))) {
  if (fontFile.endsWith('.woff2')) {
    await writeFile(
      join(distDir, 'vendor/katex/fonts', fontFile),
      await readFile(join(katexDist, 'fonts', fontFile))
    );
  }
}

// 3. Copy real pixel-avatar PNGs
const avatarSrcDir = isStandalone
  ? join(vendorAssetsDir, 'pixel-avatars')
  : join(repoRoot, 'notara-core/plugins/personal-agent/src/assets/pixel-avatars');
await mkdir(join(distDir, 'assets/pixel-avatars'), { recursive: true });
for (const png of await readdir(avatarSrcDir)) {
  if (png.endsWith('.png')) {
    await writeFile(join(distDir, 'assets/pixel-avatars', png), await readFile(join(avatarSrcDir, png)));
  }
}

// 4. Generate seamless 640x640 Retina raking-light parchment relief texture (#ece7dc base)
await writeFile(join(distDir, 'assets/parchment-tile.png'), generateParchmentPngBuffer(640));

// 4b. Build real static Open Market Feeds (`/feeds/open-labs/catalog.json` + `.notara-pack.json` + interactive code-video demos)
const { catalogItems: openFeedItems } = await buildStaticOpenFeeds({ rootDir, distDir });

// 5. Write portal CSS, study JS & all static HTML routes
await writeFile(join(distDir, 'portal.css'), await readFile(join(rootDir, 'portal.css'), 'utf8'), 'utf8');
await writeFile(join(distDir, 'study.mjs'), await readFile(join(rootDir, 'study.mjs'), 'utf8'), 'utf8');
await writeFile(join(distDir, 'index.html'), renderHome(), 'utf8');
await writeFile(join(distDir, '404.html'), render404Page(), 'utf8');

await writeRoute('library', renderLibraryPage('/library/'));
await writeRoute('resources', renderLibraryPage('/resources/'));
await writeRoute('letters', renderLettersPage());
await writeRoute('guide', renderGuide('/guide/'));
await writeRoute('install', renderGuide('/install/'));
await writeRoute('code-video', renderCodeVideoPage(openFeedItems));

const canonicalPaths = ['/', '/library/', '/resources/', '/code-video/', '/letters/', '/guide/', '/install/'];
for (const lesson of lessons) {
  const lessonPath = `/lessons/${lesson.slug}/`;
  await writeRoute(join('lessons', lesson.slug), renderLessonPage(lesson, lessonPath));
  canonicalPaths.push(lessonPath);
  for (const alias of lesson.aliases || []) {
    await writeRoute(alias, renderLessonPage(lesson, `/${alias}/`));
    canonicalPaths.push(`/${alias}/`);
  }
}

const siteOrigin = 'https://oh-my-student.com';
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${Array.from(
  new Set(canonicalPaths)
)
  .map((p) => `  <url><loc>${siteOrigin}${p}</loc></url>`)
  .join('\n')}\n</urlset>\n`;
await writeFile(join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
await writeFile(join(distDir, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${siteOrigin}/sitemap.xml\n`, 'utf8');

console.log(`Built 1:1 real-app showcase Notara website into ${distDir}`);
