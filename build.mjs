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
  renderTeachingComparison,
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

const WIN_INSTALLER_VERSION = 'v0.1.0-preview.10';
const WIN_INSTALLER_FILENAME = 'Notara-PersonalAgent-0.1.0-preview.10-x64-Setup.exe';
const WIN_INSTALLER_SIZE_LABEL = '690 MB';
const WIN_INSTALLER_SHA256 = 'd1b4a394318dd7e95dfb3f047d0ace88c9cbb023a43f9f8a71c5b6ce91b3527d';
const WIN_INSTALLER_URL =
  'https://github.com/TongZi2003/Notara-Desktop-Releases/releases/download/v0.1.0-preview.10/Notara-PersonalAgent-0.1.0-preview.10-x64-Setup.exe';
const WIN_SHA256SUMS_URL =
  'https://github.com/TongZi2003/Notara-Desktop-Releases/releases/download/v0.1.0-preview.10/SHA256SUMS.txt';
const WIN_RELEASE_PAGE_URL =
  'https://github.com/TongZi2003/Notara-Desktop-Releases/releases/tag/v0.1.0-preview.10';
const DESKTOP_ISSUES_URL = 'https://github.com/TongZi2003/Notara-Desktop-Releases/issues';
const MAC_INSTALLER_VERSION = 'v0.1.0-preview.10';
const MAC_INSTALLER_FILENAME = 'Notara-PersonalAgent-0.1.0-preview.10-arm64.dmg';
const MAC_INSTALLER_SIZE_LABEL = '562 MB';
const MAC_INSTALLER_SHA256 = 'e497eeb43179773dfe141e32699239b764a5848f70b9237387644c1f32d56afd';
const MAC_INSTALLER_URL =
  'https://github.com/TongZi2003/Notara-Desktop-Releases/releases/download/v0.1.0-preview.10/Notara-PersonalAgent-0.1.0-preview.10-arm64.dmg';

function pageShell({ title, description, currentPath, body, appPage = false }) {
  const isFeatures = currentPath === '/features/' || currentPath.startsWith('/features');
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
            <a class="nav-hide-sm" href="/#manifesto">理念</a>
            <a class="nav-hide-sm" href="/#pedagogy">教学法</a>
            <a class="nav-hide-sm" href="/#workbench">核心工作流</a>
            <a href="/features/" ${isFeatures ? 'aria-current="page"' : ''}>功能说明</a>
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
            <a href="/features/">功能与使用说明</a>
            <a href="/code-video/">代码视频微课</a>
            <a href="/feeds/open-labs/catalog.json">公开课程包目录</a>
            <a href="/letters/">三封公开信</a>
            <a href="/library/">资源市集与样卷</a>
            <a href="/guide/">下载与接模型说明</a>
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

        <div class="compare-section-wrap">
          <h3 class="compare-subhead">和常规大班课、普通搜题 AI 到底差在哪</h3>
          ${renderTeachingComparison({ id: 'pedagogy-compare' })}
        </div>
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

        <nav class="wf-overview-rail" aria-label="五大核心学习流程速览">
          <a class="wf-overview-step" href="#wf-graph">
            <span class="wf-overview-idx">01</span>
            <strong>会生长的知识图谱</strong>
            <small>课本、错卷与笔记连点成网，还能点亮回放</small>
          </a>
          <a class="wf-overview-step" href="#wf-agents">
            <span class="wf-overview-idx">02</span>
            <strong>首页管家与专题课堂</strong>
            <small>平时看全局节奏，专题课专注深挖一道题</small>
          </a>
          <a class="wf-overview-step" href="#wf-canvas">
            <span class="wf-overview-idx">03</span>
            <strong>可视化推演白板</strong>
            <small>课本原图直接摆上桌，分步草稿并排对照</small>
          </a>
          <a class="wf-overview-step" href="#wf-personas">
            <span class="wf-overview-idx">04</span>
            <strong>记得习惯的老师与同桌</strong>
            <small>同桌盲听检验你会没会，老师按你的节奏点拨</small>
          </a>
          <a class="wf-overview-step" href="#wf-review">
            <span class="wf-overview-idx">05</span>
            <strong>分清真会与看懂的复习</strong>
            <small>自己做对才拉长间隔，靠提示过关次日短查</small>
          </a>
        </nav>

        ${renderWorkbenchActs()}
      </div>
    </section>

    <section class="chapter" id="sets">
      <div class="wrap">
        <div class="chapter-head chapter-head--wide">
          <p class="section-rubric">源 · 公开课程包与学习社区</p>
          <h2>你只管安心看书，<span class="nowrap">让学习助手替你筛选真正有用的好题。</span></h2>
          <p>
            备考时最怕自己泡进论坛找资料，干货还没捞着，先被满屏焦虑帖打乱节奏。书房内置可继续追更的学科课程包，也支持在你授权后让助手定时浏览公开讨论和考后新题，把情绪噪音挡在外面，只把贴合当前进度的好题与讲义摆回你的书桌。
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
            <h3>自带模型密钥，免注册直接开课</h3>
            <p>现阶段安装包免注册即可使用，在电脑本地填入你自己的 DeepSeek、Claude、OpenAI、Gemini 等 API 密钥或已有模型订阅即可开讲，请求由本机直连模型商，不经中转，也支持把拆分资料的日常任务交给更省费用的模型。</p>
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
            <a class="btn-quiet" href="/guide/#download">前往下载 macOS / Windows 内测版 →</a>
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
    description: '1:1 还原 Notara 私人书房、公开课程市集与随包内置免费试读样卷。',
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
        <p class="section-rubric">Beta 2 桌面书房获取与上手</p>
        <h1>把课本、笔记与错题，放进一间安在电脑里的长期书房。</h1>
        <p>
          现阶段为公开测试期（Beta 2 · v0.1.0-preview.10），下载后无需注册账号，填入你自己的模型密钥即可开课。你可以先从免费公开学科包起步，也可以随时拖入学校讲义、试卷和随堂笔记慢慢整理。
        </p>
        <div style="margin-top:16px;">
          <a class="btn-quiet" href="/features/">先看图文功能与上手说明 →</a>
        </div>
      </header>

      <section id="download">
        <div class="download-grid">
          <div class="download-card download-card--featured">
            <span class="download-card-tag">Windows · 10 / 11 (64-bit) · Beta 2 开放下载</span>
            <h2>Notara 桌面端 for Windows</h2>
            <p>支持 Windows 10 / 11（64 位）。安装包自带运行环境、高清看卷与离线公式排版；你建的所有卡片、白板与学习进度全保存在本机文件夹里，版本升级绝不覆盖个人笔记。</p>
            <div class="download-card-actions">
              <a class="btn-primary" href="${WIN_INSTALLER_URL}" rel="noopener" data-download-win>下载 Windows 安装包（.exe · ${WIN_INSTALLER_SIZE_LABEL}）</a>
              <a class="btn-quiet" href="${WIN_RELEASE_PAGE_URL}" target="_blank" rel="noopener">Beta 2 更新清单与附件 ↗</a>
            </div>
            <div class="download-meta-box">
              <div class="download-meta-file">
                <span>当前测试版本：<strong>${WIN_INSTALLER_VERSION}（Beta 2）</strong></span>
                <code>${WIN_INSTALLER_FILENAME}</code>
              </div>
              <div class="download-sha-row">
                <span class="download-sha-label">SHA-256</span>
                <code class="download-sha-code">${WIN_INSTALLER_SHA256}</code>
                <button type="button" class="download-copy-btn" data-copy-sha="${WIN_INSTALLER_SHA256}">复制 SHA-256</button>
                <a class="download-sha-link" href="${WIN_SHA256SUMS_URL}" target="_blank" rel="noopener">SHA256SUMS.txt ↗</a>
              </div>
            </div>
          </div>

          <div class="download-card download-card--featured">
            <span class="download-card-tag">macOS · Apple Silicon (M1–M4) · Beta 2 开放下载</span>
            <h2>Notara 桌面端 for macOS</h2>
            <p>支持 macOS 13 及以上（Apple Silicon M1–M4 芯片）。内置全套看卷渲染与离线字体；暂时使用 Intel Mac 或还没准备下载的同学，可先免登录体验 <a href="/first-lesson/" style="color:var(--umber-deep);text-decoration:underline;">1:1 在线实景课堂</a>。</p>
            <div class="download-card-actions">
              <a class="btn-primary" href="${MAC_INSTALLER_URL}" rel="noopener" data-download-mac>下载 macOS 安装包（.dmg · ${MAC_INSTALLER_SIZE_LABEL}）</a>
              <a class="btn-quiet" href="${WIN_RELEASE_PAGE_URL}" target="_blank" rel="noopener">Beta 2 更新清单与附件 ↗</a>
            </div>
            <div class="download-meta-box">
              <div class="download-meta-file">
                <span>当前测试版本：<strong>${MAC_INSTALLER_VERSION}（Beta 2）</strong></span>
                <code>${MAC_INSTALLER_FILENAME}</code>
              </div>
              <div class="download-sha-row">
                <span class="download-sha-label">SHA-256</span>
                <code class="download-sha-code">${MAC_INSTALLER_SHA256}</code>
                <button type="button" class="download-copy-btn" data-copy-sha="${MAC_INSTALLER_SHA256}">复制 SHA-256</button>
                <a class="download-sha-link" href="${WIN_SHA256SUMS_URL}" target="_blank" rel="noopener">SHA256SUMS.txt ↗</a>
              </div>
            </div>
          </div>
        </div>

        <div class="install-notes-sheet" style="margin-bottom:24px;">
          <div class="install-notes-head">
            <h3>Beta 2（v0.1.0-preview.10）新变化一览</h3>
            <span>看得见的真实学习进步，再加上更清晰的师生协同</span>
          </div>
          <div class="install-notes-grid">
            <div class="install-note-item">
              <h4>1. 统计页、12 周热力图与书房足迹</h4>
              <p>书房首页与每科的「统计」视图只认真实笔记与复习日期：一眼看清近 12 周实际学了几天、哪些卡片已稳步拉长间隔、哪些容易卡壳需要重温，以及未来 7 天即将到期的复习量。</p>
            </div>
            <div class="install-note-item">
              <h4>2. 知识星图按日期点亮回放</h4>
              <p>打开星图点击「回放」并拖动日期滑块，能亲眼看见学过的知识点按时间一个个亮起来、卡片间的联系从虚线接成实线；下课后在后台刚整理出的新卡片，也会在标签上轻轻亮出 <code>+N</code> 提示。</p>
            </div>
            <div class="install-note-item">
              <h4>3. 一套备课课表、自由旁听与轻量上手</h4>
              <p>不管按导入的课程讲义一步步推进，还是突然想自由问一道题、临时换个方向拆解，课堂都会顺着你的思路记下真实理解变化，再接回长期学习轨迹，不用担心切来切去把记录搞散。</p>
            </div>
          </div>
        </div>

        <div class="install-notes-sheet">
          <div class="install-notes-head">
            <h3>安装放行、接模型与省钱攻略</h3>
            <span>面向 Beta 2 免注册自带模型用户（macOS Apple Silicon / Windows 64 位）</span>
          </div>
          <div class="install-notes-grid">
            <div class="install-note-item">
              <h4>1. 首次打开遇到系统拦截怎么放行</h4>
              <p><strong>macOS</strong>：把 <code>Notara.app</code> 拖进「应用程序」后，若提示“未打开 / 无法验证开发者”，在终端粘贴运行 <code>xattr -cr /Applications/Notara.app</code>（或到「系统设置 → 隐私与安全性」底部点「仍要打开」）即可启动。<br><strong>Windows</strong>：若出现 SmartScreen「Windows 已保护你的电脑」，核对 SHA-256 后点「更多信息 → 仍要运行」。</p>
            </div>
            <div class="install-note-item">
              <h4>2. 怎么接模型更省钱又够用</h4>
              <p>现阶段官方账号体系还在完善中，打开客户端后在引导页填入你自己的 API 密钥（如 DeepSeek、Claude、OpenAI、Gemini 等）或已有模型订阅就能直接学。建议日常讲课选顺手的主力模型，而批量整理 PDF 与建卡的「拆书整理师 / 分片建卡员」可换用更平价、带「视觉」标识的多模态模型，成本能省下大半。</p>
            </div>
            <div class="install-note-item">
              <h4>3. 遇到卡顿或报错如何一键反馈</h4>
              <p>若界面偶发卡住或识别出错，请在「设置 → 外观与常用连接 → 问题反馈与诊断」点<strong>「导出脱敏诊断」</strong>（会自动去掉 API 密钥和你的笔记原文），把生成的 JSON 文件发到内测群或 <a href="${DESKTOP_ISSUES_URL}" target="_blank" rel="noopener">桌面版 Issues ↗</a>。</p>
            </div>
          </div>
        </div>
      </section>

      <section class="chapter" style="padding-top:12px;border-top:0;">
        <div class="chapter-head" style="margin-bottom:28px;">
          <p class="section-rubric">三步跑通第一节课</p>
          <h2>不用复杂折腾，五分钟搭好你的<span class="nowrap">专属电子书房。</span></h2>
        </div>

        <div class="ledger">
          <div class="ledger-row">
            <div class="ledger-num">01</div>
            <h3>选一套免费起步学习集，或拖进自己的讲义和错卷</h3>
            <div class="ledger-body">
              <p>第一次建空学习集时，可以直接从书架挑高中或大学公开示例目录（导数、离子平衡、高数、线代等），也可以直接把学校 PDF 讲义、试卷截图和随堂笔记拖进桌面，系统会自动把它们串联进同一张星图里。</p>
            </div>
          </div>
          <div class="ledger-row">
            <div class="ledger-num">02</div>
            <h3>填入自己的模型密钥，为讲课与整理分工选模型</h3>
            <div class="ledger-body">
              <p>免注册打开即用，输入你现有的 DeepSeek、Claude、OpenAI 或 Gemini 密钥，或者使用支持的模型订阅账号就能本机直连；首页管全局的助手、专题课堂和后台负责拆书、核对的帮手，可以各自绑定最划算的模型。</p>
            </div>
          </div>
          <div class="ledger-row" id="access">
            <div class="ledger-num">03</div>
            <h3>摆上白板边画边聊，练完再按真实水平排复习</h3>
            <div class="ledger-body">
              <p>在推演白板上并排贴出课本截图与解题草稿，思路卡壳时让熟悉你习惯的老师点拨一两句，讲顺了换到看不见答案的「同桌盲测」里讲给她听；最后系统会看你是否真靠自己做出来，合理安排下次复查时间。</p>
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

function renderFeaturesPage() {
  const body = `
    <div class="wrap">
      <header class="page-header">
        <p class="section-rubric">学生功能与使用说明 · Beta 2</p>
        <h1>装好 Notara 之后，一间书房能怎么用。</h1>
        <p>
          不看复杂术语，直接按你平时看书、写题、问老师和复习的顺序，带你认识 Notara 桌面端（Beta 2 · v0.1.0-preview.10）里最常顺手用到的功能与画面。
        </p>
        <nav class="features-toc" aria-label="功能说明章节导航">
          <a href="#feat-vault">1. 建书架与导资料</a>
          <a href="#feat-modes">2. 跟着课表学 / 随时快问</a>
          <a href="#feat-tools">3. 白板、老师与盲测同桌</a>
          <a href="#feat-stats">4. 统计页与诚实复习</a>
          <a href="#feat-graph">5. 知识星图点亮回放</a>
          <a href="#feat-models">6. 接模型省钱与热更新</a>
          <a href="#feat-compare">7. 和常规学习对比</a>
        </nav>
      </header>

      <section class="feature-block feature-block--first" id="feat-vault">
        <div class="feature-block-head">
          <p class="section-rubric">01 · 起步与导入资料</p>
          <h2>选一门免费起步课，或把自己的讲义、试卷直接摆进书架。</h2>
          <p>
            第一次打开时不必空手发愁：书架自带高数、导数、离子平衡、英语语块和自救破冰指南等公开示例课；如果你自己电脑里本来就存了一堆讲义和笔记文件夹，也可以直接挂进书房，原地整理而不移动或改坏你的原文件。
          </p>
        </div>
        <div class="feature-two-col">
          <div class="feature-info-card">
            <h3>拖入 PDF 自动拆成题卡，随时点回原书</h3>
            <p>把学校发的新讲义、扫描卷拖进资料区，后台整理帮手会把它们按知识点和题号拆成一张张卡片与导读大纲。题卡正文里保留了原卷页码与框选区域锚点，点击即可原地跳转回到 PDF 原页核对题目配图与上下文。</p>
          </div>
          <div class="feature-info-card">
            <h3>默认遮住参考答案，先动笔不被剧透</h3>
            <p>打开一道练习题时，右侧卡片默认只显示干净题面与你自己的理解笔记，标准解析自动折叠收在按钮后面。真卡壳时可以先点一下「先看思路提示」要半句指路，确定要核对再展开完整推导，保护自己的独立思考过程。</p>
          </div>
        </div>
        <figure class="feature-shot-card">
          <img src="/assets/features/hub-footprint.png" alt="Notara 私人书房顶部 12 周跨集学习足迹与两册书架腰封实景图" loading="eager">
          <figcaption class="feature-shot-caption">私人书房实景：顶部横向展示全部在学书目的点亮卡片比例、待复查数与近 12 周活跃热力图，下方每册学习集腰封同步显示当前已亮进度和待复查提醒。</figcaption>
        </figure>
      </section>

      <section class="feature-block" id="feat-modes">
        <div class="feature-block-head">
          <p class="section-rubric">02 · 两种上课节奏自由切换</p>
          <h2>想系统打底子时按课表一步步学，平时写作业卡壳就随时单题快问。</h2>
          <p>
            不同科目、不同夜晚的精神状态不一样，Notara 把有准备的系统课程和随手提问放进同一张书桌里。不管从哪一头聊起，你的真实理解与错题都会安稳留在同一个学习集里，不会散落成互相打架的两套记录。
          </p>
        </div>
        <div class="feature-two-col">
          <div class="feature-info-card">
            <h3>跟着课表系统推进（备课单当活教案）</h3>
            <ul>
              <li>点击学习路线上的站点即可按备好讲义与白板的节奏开课，老师会先顺手探一探你的真实底子，会的地方自然跳过，不照本宣科拖泥带水。</li>
              <li>每次只推进眼下一小步；万一时间不够或觉得太难，老师会优先守住核心保底线，并在课尾请首页助手帮你原地补一节铺垫或调缓后面难度。</li>
              <li>只有确实聊过并做通的小任务，老师才会替你打上完成勾并写好下一课接续点，未完成部分诚实留白。</li>
            </ul>
          </div>
          <div class="feature-info-card">
            <h3>随时自由即兴提问（不预设课表照样学）</h3>
            <ul>
              <li>写卷子突发奇想、临时搜到好题想换种证法，点一下顶部加号新建课堂，或点输入框下面的「单题快讲」就能直接开口问。</li>
              <li>拍照或框选发来你写了一半的纸面草稿时，老师会先肯定走对的前面几行，只点出最早滑掉的那一行属于哪类失误，留给你亲自改顺。</li>
              <li>即兴聊出来的重要收获同样可以顺手写回卡片、贴回今天的学习日记，不需要非得先建课程路线才能开始提问。</li>
            </ul>
          </div>
        </div>
        <figure class="feature-shot-card">
          <img src="/assets/features/classroom-route-cue.png" alt="Notara 左侧课堂对话区（含单题快讲快捷入口）与右侧学习路线画布、资料库标签 +2 微提示实景图" loading="lazy">
          <figcaption class="feature-shot-caption">课堂分屏实景：左侧可随时点击「单题快讲」或发送图片草稿自由发问，右侧跟随展示完整课程路线图与全集位置缩略窗；后台整理好新卡片后，顶部「资料库」标签只以克制的 <code>+2</code> 提醒而不抢占焦点。</figcaption>
        </figure>
      </section>

      <section class="feature-block" id="feat-tools">
        <div class="feature-block-head">
          <p class="section-rubric">03 · 课堂里的三样趁手工具</p>
          <h2>原题摆上白板对照、师友按火候切换，还能自己动手改参数看变化。</h2>
        </div>
        <div class="install-notes-grid" style="margin-top:18px;">
          <div class="install-note-item">
            <h4>1. 原卷直接贴墙的可视化白板</h4>
            <p>碰到长分类讨论、辅助线或大段程序流程，聊几屏往往记不住条件。把 PDF 原题框出来钉到白板上，旁边放函数曲线、分步草图和自检填空；就算退回去尝试第二种解法，也能和原来那版并排对照或另开一张白板。</p>
          </div>
          <div class="install-note-item">
            <h4>2. 记得你习惯且懂火候的老师</h4>
            <p>新概念刚起步先痛快讲透最小例子；卡在够得着的一步时，老师翻看你本地档案里记下的易漏惯性，只给半步提示搭梯子。所有笔记按需翻阅，只看和眼前题目相关的旧经历。</p>
          </div>
          <div class="install-note-item">
            <h4>3. 不看答案的同桌与动手微实验</h4>
            <p>觉得题目顺了，把「大肥鱼」等同桌召出来开启费曼听讲：系统替他挡住解析与过往聊天，你要把前因后果讲到他点头才过关。理化和算法难题还可点开内置交互微课拖动滑块，一眼看懂临界变化。</p>
          </div>
        </div>
      </section>

      <section class="feature-block" id="feat-stats">
        <div class="feature-block-head">
          <p class="section-rubric">04 · 诚实统计与复习节奏（Beta 2 新增）</p>
          <h2>真会做和看提示才做出来分开记账，用真实日历看到稳步巩固。</h2>
          <p>
            很多刷题软件最容易哄人开心：瞟一眼提示点下“认识”，下回上考场照样下不了笔。Notara 在确认复习时会如实核对完成条件，同时在资料库「统计」页老老实实摆出近 12 周的实际轨迹，不靠连续打卡惩罚或虚构积分来催焦虑。
          </p>
        </div>
        <div class="feature-two-col">
          <div class="feature-info-card">
            <h3>复习排期规则一眼看明白</h3>
            <p><strong>靠自己不看提示做通关键步</strong>，间隔才会按 <code>1 → 3 → 7 → 16 → 35 天</code> 稳步拉长；<strong>看了提示或跟着讲解走通</strong>，原有间隔保持不变，自动安排明天做一次 1 天裸题短复查；连续卡壳的老问题则暂停机械抽考，先拆成小铺垫练顺。</p>
          </div>
          <div class="feature-info-card">
            <h3>统计页每一格都来自真实文件</h3>
            <p>「资料库 → 统计」集中呈现四项关键指标、近 12 周真实学习天数热力图、区分「稳步长间隔 / 已点亮巩固中 / 到期卡壳 / 尚未点亮」的分布条，以及可点击直接筛出待查卡片的未来 7 天复习潮汐与高遗忘队列。</p>
          </div>
        </div>
        <figure class="feature-shot-card">
          <img src="/assets/features/vault-stats.png" alt="Notara 学习集内诚实统计视图：近 12 周学习热力图、巩固分布条、未来 7 天复习潮汐与高遗忘队列" loading="lazy">
          <figcaption class="feature-shot-caption">单学习集统计实景：只根据真实日记日期与卡片 <code>last_review</code> 投影，空白日绝不补造数据；点击未来 7 天任意一根柱子即可直接筛出那批到期卡片开课复习。</figcaption>
        </figure>
      </section>

      <section class="feature-block" id="feat-graph">
        <div class="feature-block-head">
          <p class="section-rubric">05 · 知识星图按日期点亮回放（Beta 2 新增）</p>
          <h2>亲手证过的联系才连成实线，拖动滑块回放图谱一天天长亮起来。</h2>
          <p>
            刚导进来的讲义和题库，在星图上只是一片安静的浅色虚线草图；只有当你亲自推通这道题、把想法写进「我的理解」卡片后，对应的节点和双链联系才会在星图里真正点亮，从虚线变成实线。
          </p>
        </div>
        <figure class="feature-shot-card">
          <img src="/assets/features/graph-replay.png" alt="Notara 知识星图按日期时间轴回放视图：已学节点按日期点亮并接通实线，未涉足节点维持浅灰虚线" loading="lazy">
          <figcaption class="feature-shot-caption">星图点亮回放实景：点击图谱右上角「回放」并拖动底部日期条，就能按先后顺序重看每个知识点是哪一天被真正啃下来并连进整张网络里的；右半侧未开始探索的部分继续保持浅灰虚线暗态。</figcaption>
        </figure>
      </section>

      <section class="feature-block" id="feat-models">
        <div class="feature-block-head">
          <p class="section-rubric">06 · 接模型省钱、热更新与隐私边界</p>
          <h2>笔记全部留在你的硬盘上，接什么模型、哪一科花多少钱都自己做主。</h2>
        </div>
        <div class="install-notes-grid" style="margin-top:18px;">
          <div class="install-note-item">
            <h4>1. 分角色选模型更划算</h4>
            <p>现阶段安装包免注册即可使用，在本地填入自己的 DeepSeek、Claude、OpenAI、Gemini 密钥或已有订阅就能开课。平时讲题、启发可配主力模型；大批拆 PDF 和整理建卡的后台帮手可换用平价带「视觉」标识的模型，省下不少额度。</p>
          </div>
          <div class="install-note-item">
            <h4>2. 小修热更新与出错自动回退</h4>
            <p>从 Beta 2 起已接入签名校验热更新通道，侧边栏底部有新微调提醒时再升级前端或教学资源即可，启动如有异常会自动退回随包稳定版本，不必每次遇到小改动都重下五六百兆大安装包。</p>
          </div>
          <div class="install-note-item">
            <h4>3. 纯文本存本地，诊断自动脱敏</h4>
            <p>所有卡片、导读和白板都是电脑里普通的 <code>.md</code> 和 <code>.canvas</code> 文档，换软件或离线照样打开。遇到界面卡住点击「导出脱敏诊断」，会自动剔除 API 密钥与个人笔记正文，只保留排错摘要。</p>
          </div>
        </div>
      </section>

      <section class="feature-block" id="feat-compare">
        <div class="feature-block-head">
          <p class="section-rubric">07 · 核心优势对比</p>
          <h2>一张表看清：Notara 和常规大班课、普通搜题 AI 差在哪。</h2>
          <p>把日常卡题、记忆连贯、检验真假、白板草稿和进步统计六件事放在一起对照，就知道顺手的长期书房是怎么回事。</p>
        </div>
        <div style="margin-top:20px;">
          ${renderTeachingComparison({ id: 'feat-compare-matrix' })}
        </div>
      </section>

      <section class="feature-cta-band" aria-label="下一步行动">
        <div>
          <h2>准备好搭建自己的这间电子书房了吗</h2>
          <p>下载对应系统的安装包 5 分钟内即可开讲，也可以先免安装打开 1:1 网页实景课堂体验一题。</p>
        </div>
        <div class="feature-cta-actions">
          <a class="btn-primary" href="/guide/#download">前往下载 Beta 2 安装包</a>
          <a class="btn-quiet" href="/first-lesson/">免登录试一课实景课堂 →</a>
        </div>
      </section>
    </div>
  `;

  return pageShell({
    title: '学生功能与使用说明 · Notara',
    description: '面向学生的 Notara 桌面端 Beta 2 图文使用指南：导资料、课表推进与自由提问、白板盲测、12 周诚实统计与星图点亮回放。',
    currentPath: '/features/',
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
          <a href="/feeds/open-labs/bundles/${esc(def.id)}.notara-pack.json" style="color:var(--accent);text-decoration:underline;">查看课程包原始文件 ↗</a>
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
        <p class="section-rubric">公开免费微课源 · 可动手调参的代码视频</p>
        <h1>随时按下暂停就能改参数的<span class="nowrap"> 20 KB 矢量代码微课。</span></h1>
        <p>
          下面这几节公开微课已经打好包放上网页。你可以直接在下面点播放、拖时间轴、随时暂停伸手改参数；如果已经在电脑上装好了 Notara，也可以把下方订阅地址粘贴到「私人书房 → 资料源」，免注册添进自己的学习集，更新时不覆盖原有笔记。
        </p>
        <div style="margin-top:18px;padding:12px 16px;border-radius:10px;border:1px solid var(--rule-strong);background:var(--paper-sheet);display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
          <div style="min-width:0;font-size:13px;">
            <strong style="display:block;margin-bottom:3px;color:var(--ink);">免费公开订阅地址（复制进桌面端即可使用）：</strong>
            <code style="word-break:break-all;color:var(--accent);">${esc(OPEN_LABS_FEED_URL)}</code>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <a class="btn-quiet" href="/feeds/open-labs/catalog.json">查看课程目录清单 ↗</a>
            <a class="btn-primary" href="/library/">返回资源市集与样卷</a>
          </div>
        </div>
      </header>

      ${itemsHtml}
    </div>
  `;

  return pageShell({
    title: '可动手调参的代码视频微课 · Notara',
    description: '在线试玩 20 KB 矢量交互代码视频微课，并获取免费公开订阅地址导入 Notara 桌面书房。',
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

// 3b. Copy Beta 2 showcase screenshots for /features/
const featuresMediaSrcDir = join(rootDir, 'showcase-media');
await mkdir(join(distDir, 'assets/features'), { recursive: true });
for (const imgFile of await readdir(featuresMediaSrcDir)) {
  if (imgFile.endsWith('.png')) {
    await writeFile(
      join(distDir, 'assets/features', imgFile),
      await readFile(join(featuresMediaSrcDir, imgFile))
    );
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

await writeRoute('features', renderFeaturesPage());
await writeRoute('library', renderLibraryPage('/library/'));
await writeRoute('resources', renderLibraryPage('/resources/'));
await writeRoute('letters', renderLettersPage());
await writeRoute('guide', renderGuide('/guide/'));
await writeRoute('install', renderGuide('/install/'));
await writeRoute('code-video', renderCodeVideoPage(openFeedItems));

const canonicalPaths = ['/', '/features/', '/library/', '/resources/', '/code-video/', '/letters/', '/guide/', '/install/'];
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
