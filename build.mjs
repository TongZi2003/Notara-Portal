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
          <h3 class="compare-subhead">分清底层的「事实可靠性」与上层的「媒介表现力」，对比三种学习方式的设计取舍</h3>
          ${renderTeachingComparison({ id: 'pedagogy-compare' })}
        </div>
      </div>
    </section>

    <section class="chapter" id="workbench">
      <div class="wrap">
        <div class="chapter-head chapter-head--wide">
          <p class="section-rubric">核 · 核心工作流</p>
          <h2>围绕输入、加工与存储，<span class="nowrap">把零散资料沉淀为连贯的知识体系。</span></h2>
          <p>
            日常自习里，翻找原卷、誊抄错题、硬猜解析跳步与手动排复习往往耗掉了大半心力。下面五个环节首尾咬合，由 Personal AI 在底层接管窗口分流与文档归档，把理解、验证与思考的主导权完整交还给你。
          </p>
        </div>

        <nav class="wf-overview-rail" aria-label="五大核心学习流程速览">
          <a class="wf-overview-step" href="#wf-graph">
            <span class="wf-overview-idx">01</span>
            <strong>本地知识图谱</strong>
            <small>讲义、错卷与笔记去重串联，按掌握情况点亮</small>
          </a>
          <a class="wf-overview-step" href="#wf-agents">
            <span class="wf-overview-idx">02</span>
            <strong>Personal AI 全程托管</strong>
            <small>自动分流课堂与归档文档，不用手动管窗口</small>
          </a>
          <a class="wf-overview-step" href="#wf-canvas">
            <span class="wf-overview-idx">03</span>
            <strong>空间推演白板</strong>
            <small>PDF 原题框选上板，多路解法分支并排对照</small>
          </a>
          <a class="wf-overview-step" href="#wf-personas">
            <span class="wf-overview-idx">04</span>
            <strong>认知校准与自主验真</strong>
            <small>老师搭梯忠实记录，搞没搞懂由你自己验证</small>
          </a>
          <a class="wf-overview-step" href="#wf-review">
            <span class="wf-overview-idx">05</span>
            <strong>双轨融合复习</strong>
            <small>日常排期并轨专题复习课，深挖并向外拓展联系</small>
          </a>
        </nav>

        ${renderWorkbenchActs()}
      </div>
    </section>

    <section class="chapter" id="sets">
      <div class="wrap">
        <div class="chapter-head chapter-head--wide">
          <p class="section-rubric">源 · 公开课程包与学习社区</p>
          <h2>精选校对的课程包提供扎实底本，<span class="nowrap">日常错题与个人想法也能随时汇入。</span></h2>
          <p>
            单靠大模型临场发挥很难撑起一整门课的严密脉络，自己去公开论坛找题又容易被焦虑帖打乱节奏。资源市集提供经过精心挑选与校对的公开学科包托住教学质量下限，也规划了让 Personal AI 替你刷帖筛选好想法、同时要求自己发出的帖子必须经过大脑思考的社区机制；外部课程包更新时只做去重合并，原有笔记保持不动。
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
            <h3>正在学的专业课暂时没有现成课程包？直接把讲义拖进来整理即可。</h3>
            <p>
              无论是学校印发的 PDF 讲义、期末复习课件、课堂板书照片，还是做了一半卡住的试卷草稿，拖入桌面书房后都能拆解为知识卡片并归入本地图谱，方便随时围绕具体页面展开讨论。
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
          <p class="section-rubric">契 · 数据归属与使用边界</p>
          <h2>笔记存为本地开放文档，模型按需自选，日常使用安静不打扰。</h2>
        </div>
        <div class="pledge-grid">
          <div class="pledge-col">
            <h3>所有笔记均保存为本地开放格式</h3>
            <p>你在书房里写下的所有理解、批注与白板，全部直接存为电脑文件夹里的标准 <code>.md</code> 与 <code>.canvas</code> 开放文档，不绑定私有云端或专有格式。即使日后卸载软件，用 Obsidian 或普通文本编辑器依然可以完整打开。</p>
          </div>
          <div class="pledge-col">
            <h3>免注册直接使用，支持多模型分工配置</h3>
            <p>当前公开测试版免注册即可使用，在电脑本地填入你自己的 DeepSeek、Claude、OpenAI、Gemini 等 API 密钥或已有模型订阅即可本机直连。主讲老师可绑定主力推理模型，后台负责拆分 PDF 与批量建卡的工作员则可单独指定更平价的模型。</p>
          </div>
          <div class="pledge-col">
            <h3>不设打卡清零惩罚，不静默上传私人资料</h3>
            <p>软件内不设社交排行榜，也没有连续打卡中断清零或红点催促；住校或考试中断几天后再打开，首页助手只会安静地帮你接上上次停下的位置。你的私人草稿与课堂对话默认只留在本地电脑中。</p>
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
        <p class="section-rubric">Beta 2 桌面版下载与上手指南</p>
        <h1>将课本、讲义与错题放进本地电脑，搭建长期连贯的自习空间。</h1>
        <p>
          当前版本为公开测试版（Beta 2 · v0.1.0-preview.10）。安装后无需注册账号，在本地填入你自己的模型 API 密钥或已有模型订阅即可开始使用；你可以先体验随包内置的公开学科学习集，也可以直接拖入学校的 PDF 讲义、试卷和随堂笔记进行整理。
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
            <span>围绕学习进度可见性、图谱生长过程与日常上课衔接三项问题完成改进</span>
          </div>
          <div class="install-notes-grid">
            <div class="install-note-item">
              <h4>1. 新增学习统计页与近 12 周书房足迹</h4>
              <p>书房总览顶部与各学习集内新增了「统计」视图，完全依据本地真实的日记日期与卡片复习记录，展示近 12 周活跃天数热力图、卡片巩固阶段分布以及未来 7 天到期题量；点击对应日期柱即可直接筛出待复习卡片。</p>
            </div>
            <div class="install-note-item">
              <h4>2. 新增知识星图按日期回放与后台建卡提示</h4>
              <p>知识星图右上角新增了时间轴「回放」开关，拖动底部日期滑块即可按时间顺序重看已学节点点亮并接通实线的过程；下课后后台工作员整理出新卡片时，资料库标签只显示简短的 <code>+N</code> 数字提示，不打断当前阅读。</p>
            </div>
            <div class="install-note-item">
              <h4>3. 打通备课路线推进与随时自由提问</h4>
              <p>课堂机制同时打通了系统慢学与日常快问：既可以顺着备课路线由老师按实际作答表现动态推进（遇到难点可在导读里原地插入铺垫节），也可以不建课表直接新建对话提问或准备阶段复习课，所有收获都会沉淀回同一套知识库。</p>
            </div>
          </div>
        </div>

        <div class="install-notes-sheet">
          <div class="install-notes-head">
            <h3>安装放行、接模型与省钱配置说明</h3>
            <span>面向 Beta 2 免注册自带模型用户（macOS Apple Silicon / Windows 64 位）</span>
          </div>
          <div class="install-notes-grid">
            <div class="install-note-item">
              <h4>1. 首次打开遇到系统安全提示怎么处理</h4>
              <p><strong>macOS</strong>：将 <code>Notara.app</code> 拖进「应用程序」后，若系统提示未验证开发者而无法打开，在终端运行 <code>xattr -cr /Applications/Notara.app</code>（或到「系统设置 → 隐私与安全性」底部点击「仍要打开」）即可正常启动。<br><strong>Windows</strong>：若弹出 SmartScreen「Windows 已保护你的电脑」提示，核对上方 SHA-256 校验值无误后，点击「更多信息 → 仍要运行」。</p>
            </div>
            <div class="install-note-item">
              <h4>2. 怎么搭配模型更省钱又够用</h4>
              <p>目前官方账号服务仍在建设中，安装后可在引导页填入你自己的 API 密钥（支持 DeepSeek、Claude、OpenAI、Gemini 等）或已有模型订阅。日常建议让讲课老师使用主力推理模型，把后台负责拆分 PDF 与分片建卡的工作员设为价格更低、带「视觉」标识的多模态模型，能省下大半整理开销。</p>
            </div>
            <div class="install-note-item">
              <h4>3. 遇到异常或报错如何导出脱敏诊断</h4>
              <p>如果在使用过程中遇到界面卡顿或任务报错，可在「设置 → 外观与常用连接 → 问题反馈与诊断」中点击<strong>「导出脱敏诊断」</strong>。系统会自动剔除你的 API 密钥与个人笔记正文，只生成包含运行状态摘要的 JSON 文件，方便发送到内测群或 <a href="${DESKTOP_ISSUES_URL}" target="_blank" rel="noopener">桌面版 Issues ↗</a> 协助排查。</p>
            </div>
          </div>
        </div>
      </section>

      <section class="chapter" style="padding-top:12px;border-top:0;">
        <div class="chapter-head" style="margin-bottom:28px;">
          <p class="section-rubric">三步开始第一节课</p>
          <h2>安装完成后，按以下三步<span class="nowrap">即可接入资料开始使用。</span></h2>
        </div>

        <div class="ledger">
          <div class="ledger-row">
            <div class="ledger-num">01</div>
            <h3>选择内置公开学习集，或拖入自己的讲义与错卷</h3>
            <div class="ledger-body">
              <p>首次创建学习集时，可以直接选用随包附带的高中或大学公开示例集（包含导数、离子平衡、高等数学、线性代数等），也可以直接把学校下发的 PDF 讲义、试卷图片和随堂笔记拖入窗口，由后台工作员整理进同一张本地知识图谱。</p>
            </div>
          </div>
          <div class="ledger-row">
            <div class="ledger-num">02</div>
            <h3>在本地填入模型密钥，为讲课与整理角色分配模型</h3>
            <div class="ledger-body">
              <p>无需注册平台账号，填入你现有的 API 密钥或登录支持的模型订阅即可本机直连；首页统筹助手、专题课老师以及后台负责拆书、验算的工作员都可以独立指定适合的模型。</p>
            </div>
          </div>
          <div class="ledger-row" id="access">
            <div class="ledger-num">03</div>
            <h3>结合白板推导与同桌检验，按实际作答情况安排复习</h3>
            <div class="ledger-body">
              <p>上课时可将原题区域贴到电子白板上配合推导，卡住时获取最小切入提示，想通后切换到屏蔽答案的同桌角色完整讲述一遍；下课时系统会根据你是否独立写出关键步，合理安排下一次复习日期。</p>
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
        <p class="section-rubric">功能与使用说明 · Beta 2</p>
        <h1>Notara 桌面端核心功能与日常使用说明。</h1>
        <p>
          下面按照平时导入资料、上课讨论、动笔推导、复习巩固与查看进度的顺序，梳理 Notara 桌面端（Beta 2 · v0.1.0-preview.10）在底层事实可靠性与上层视觉表现力上的具体设计。
        </p>
        <nav class="features-toc" aria-label="功能说明章节导航">
          <a href="#feat-vault">1. 外挂脉络与前序合并</a>
          <a href="#feat-modes">2. Personal AI 托管与双轨上课</a>
          <a href="#feat-tools">3. 认知校准、验真与代码微课</a>
          <a href="#feat-stats">4. 双轨复习与真实统计</a>
          <a href="#feat-graph">5. 知识星图虚实回放</a>
          <a href="#feat-models">6. 模型分工与热更新</a>
          <a href="#feat-compare">7. 事实层与表现层对比</a>
        </nav>
      </header>

      <section class="feature-block feature-block--first" id="feat-vault">
        <div class="feature-block-head">
          <p class="section-rubric">01 · 外挂知识脉络与前序合并</p>
          <h2>精选校对课程包提供高质量底本，个人讲义与错卷拖入即可去重挂接。</h2>
          <p>
            缺少整体脉络支撑的零散问答很难把一门课学扎实，手动裁剪图片、誊抄错题又极其消耗体力。书房一方面内置了经过挑选校对的高数、导数、离子平衡、英语与自学指南公开课程包，另一方面支持随时拖入你自己的讲义、试卷与想法合并进同一个知识库：
          </p>
        </div>
        <div class="feature-two-col">
          <div class="feature-info-card">
            <h3>前序主干挂接、无损合并与原书回跳</h3>
            <p>拖入 PDF 讲义或扫描试卷后，后台工作员会协助按概念方法主干（标明前序后序依赖）与具体例题挂接关系拆成 Markdown 卡片，并与库内已有卡片比对去重、保留原有记录，让你的知识体系能随日常学习持续自生长。每张题卡保留原 PDF 页码与框选坐标，点击出处即可直接跳回原书对应位置核对配图与上下文。</p>
          </div>
          <div class="feature-info-card">
            <h3>默认折叠参考解析，支持先看最小提示</h3>
            <p>打开任意练习题卡片时，右侧默认只呈现题干与你自己的理解记录，标准解析收起在折叠面板内。当你动笔推算卡在某一步时，可以先点击「先看思路提示」获取一步切入线索，尝试自己把后续过程算完；确认需要核对完整步骤时，再展开全部解析。</p>
          </div>
        </div>
        <figure class="feature-shot-card">
          <img src="/assets/features/hub-footprint.png" alt="Notara 私人书房顶部 12 周跨集学习足迹与两册书架腰封实景图" loading="eager">
          <figcaption class="feature-shot-caption">私人书房总览实景：顶部汇总展示所有在学书目的已点亮卡片比例、近期到期复习数与近 12 周实际学习热力图，下方每册学习集腰封同步显示各自的进度与待复查提醒。</figcaption>
        </figure>
      </section>

      <section class="feature-block" id="feat-modes">
        <div class="feature-block-head">
          <p class="section-rubric">02 · Personal AI 托管与双轨上课</p>
          <h2>首页统筹助手与独立专题课堂自动交接，你只管思考而不必手动管窗口与文档。</h2>
          <p>
            自己管理十几个聊天窗口和笔记文件很容易顾此失彼。在同一个学习集里，首页常驻统筹助手会替你看着全局进度，无论是按备课路线系统推进，还是晚自习临时新建对话问一道题，下课后认识变化都会自动写回卡片与日记并交回首页衔接下一步。
          </p>
        </div>
        <div class="feature-two-col">
          <div class="feature-info-card">
            <h3>按备课路线系统推进</h3>
            <ul>
              <li>点击学习路线上的节点开课时，系统会结合知识图谱读取相关前置卡片；老师开讲前先用简短问题确认你的实际基础，已经掌握的部分直接跳过，缺少铺垫的地方先补齐定义。</li>
              <li>课堂中每次只聚焦当前一个小目标；如果某一步反复受阻或当天时间有限，老师会优先帮你把核心保底内容弄清楚，并在课后请首页助手调整后续路线的难度坡度或补充前置练习。</li>
              <li>下课收尾时，只有真正在对话中推导清楚并确认过的任务才会勾选完成，尚未完成的部分如实留到下一课衔接。</li>
            </ul>
          </div>
          <div class="feature-info-card">
            <h3>不预设课表，随时新建对话自由提问</h3>
            <ul>
              <li>平时写卷子遇到卡壳的题目，或者临时想探讨另一种证法，无需提前建立课程路线，直接点击顶部加号新建课堂，或点击输入框下方的「单题快讲」即可开始提问。</li>
              <li>拍照或框选发来写了一半的手写草稿时，老师会顺着你已有的步骤往下核对，保留前面正确的推导，只指出最早出错的那一行属于概念遗漏还是变形失误，把订正的最后一步留给你自己完成。</li>
              <li>自由提问中理清的关键变形方法与易错条件，下课时同样可以写回对应卡片并记入当日学习日记，不会淹没在历史聊天记录里。</li>
            </ul>
          </div>
        </div>
        <figure class="feature-shot-card">
          <img src="/assets/features/classroom-route-cue.png" alt="Notara 左侧课堂对话区（含单题快讲快捷入口）与右侧学习路线画布、资料库标签 +2 微提示实景图" loading="lazy">
          <figcaption class="feature-shot-caption">课堂分屏实景：左侧对话区可随时点击「单题快讲」或发送草稿图片自由提问，右侧同步展示课程路线画布与全集缩略导航；后台工作员整理好新卡片后，顶部「资料库」标签仅显示简短的 <code>+2</code> 数字提示，不会强行切换你的当前界面。</figcaption>
        </figure>
      </section>

      <section class="feature-block" id="feat-tools">
        <div class="feature-block-head">
          <p class="section-rubric">03 · 认知规律校准、自主验真与表现力媒介</p>
          <h2>老师只负责引导与忠实记录，搞没搞懂由你自己验证，辅以白板与代码微课增强表现力。</h2>
        </div>
        <div class="install-notes-grid" style="margin-top:18px;">
          <div class="install-note-item">
            <h4>1. 支持贴入原题与多分支对比的电子白板</h4>
            <p>遇到多步分类讨论、含参函数图像或较长的算法流程时，单列聊天气泡很难把已知条件与几条思路同时展示清楚。你可以把 PDF 原题区域直接钉到 <code>.canvas</code> 白板上，在旁边并排画出函数草图、各分支推导与自检填空；如果从某条消息分叉尝试新解法，还能对比前后两版白板的具体改动。</p>
          </div>
          <div class="install-note-item">
            <h4>2. 按认知火候引导并忠实记录，随时听你纠偏</h4>
            <p>系统在开课时自动调取当前题目图谱两跳范围内的前置卡片与易错线索：遇到陌生新概念先用最小正例讲清楚，遇到熟悉题型则在容易漏掉条件的地方停下来追问，不做琐碎反问。老师只如实记录学习过程，若某处记录与你的真实情况有偏差，随时开口就能让老师改回。</p>
          </div>
          <div class="install-note-item">
            <h4>3. 同桌听讲自主验真与 AI 看得懂画面的互动微课</h4>
            <p>一道题到底算不算搞明白，由你自己通过验证说了算：请同桌「大肥鱼」听题时，他只看原始题面和你的讲解，有跳步就当场追问并复述核对。遇到磁场临界圆、导数切线逼近等动态过程，还可打开用代码实时绘制每一帧的互动微课：你随时暂停拖滑块改参数，AI 老师在后台也能直接看懂当前画面和参数数值，顺着你停下的地方给你讲明白。</p>
          </div>
        </div>
      </section>

      <section class="feature-block" id="feat-stats">
        <div class="feature-block-head">
          <p class="section-rubric">04 · 双轨融合复习与真实统计（Beta 2 新增）</p>
          <h2>日常排期与专题复习课双轨并轨，统计页完全依据本地真实记录汇总。</h2>
          <p>
            学习严肃的硬核知识时，只靠传统闪卡翻看正反面很难复习到位，瞄一眼提示顺手点“认识”还会掩盖薄弱点。我们将日常间隔重复与 AI 导学复习课结合在同一套流程里，并用统计视图如实呈现进展：
          </p>
        </div>
        <div class="feature-two-col">
          <div class="feature-info-card">
            <h3>间隔重复轨与导学轨随时并轨</h3>
            <p>平时在间隔重复轨上由你本人确认完成条件：只有<strong>无提示独立写出关键步</strong>才按 <code>1 → 3 → 7 → 16 → 35 天</code> 拉长间隔，<strong>看过提示或讲解</strong>则保留原间隔并在次日安排 1 天短复查。隔一段时间后，它可直接与 AI 导学轨并轨，由备课老师把近期到期卡片汇拢起来<strong>专门准备一节复习课</strong>，梳透旧卡点并跨章向外发散联系。</p>
          </div>
          <div class="feature-info-card">
            <h3>基于本地文件实时汇总的统计页</h3>
            <p>在「资料库 → 统计」视图中，系统直接读取本地学习日记日期与每张卡片的复习记录，展示近 12 周实际学习天数热力图、卡片所处的不同巩固阶段比例，以及未来 7 天每天到期的待复习题量与多次出错卡片清单。点击未来 7 天中的任意一根柱子，即可直接筛选出当天到期的卡片开始复习。</p>
          </div>
        </div>
        <figure class="feature-shot-card">
          <img src="/assets/features/vault-stats.png" alt="Notara 学习集内诚实统计视图：近 12 周学习热力图、巩固分布条、未来 7 天复习与待重温列表" loading="lazy">
          <figcaption class="feature-shot-caption">单学习集统计视图实景：所有指标均由本地真实日记日期与卡片 <code>last_review</code> 记录实时投影生成，未学习的空白日期保持原样；点击未来 7 天任意日期柱可直接筛出对应到期卡片。</figcaption>
        </figure>
      </section>

      <section class="feature-block" id="feat-graph">
        <div class="feature-block-head">
          <p class="section-rubric">05 · 知识星图按日期点亮回放（Beta 2 新增）</p>
          <h2>用虚线与实线区分“资料原有的关联”和“经你验证想通的联系”，支持按日期回放。</h2>
          <p>
            如果刚导入一份讲义就自动生成整片实线网络，学生其实很难分辨哪些概念自己真正下过功夫。新拆解导入的题目与概念在星图上默认显示为浅色虚线草图；只有当你实际验证想通并在卡片中写下个人理解后，对应的节点与双链关系才会点亮为实线。点击星图右上角的「回放」并拖动底部日期条，即可按时间顺序重看各个知识点一步步连入整张网络的过程。
          </p>
        </div>
        <figure class="feature-shot-card">
          <img src="/assets/features/graph-replay.png" alt="Notara 知识星图按日期时间轴回放视图：已学节点按日期点亮并接通实线，未涉足节点维持浅灰虚线" loading="lazy">
          <figcaption class="feature-shot-caption">星图点亮回放实景：拖动底部日期滑块，已学过的节点与连接关系会按实际完成日期依次点亮接通；右侧尚未开始学习的章节节点继续保持浅灰虚线状态。</figcaption>
        </figure>
      </section>

      <section class="feature-block" id="feat-models">
        <div class="feature-block-head">
          <p class="section-rubric">06 · 模型分工、签名热更新与隐私边界</p>
          <h2>支持按角色分工配置模型、签名校验热更新与纯文本开放存储。</h2>
        </div>
        <div class="install-notes-grid" style="margin-top:18px;">
          <div class="install-note-item">
            <h4>1. 按角色分工配置不同模型，控制日常成本</h4>
            <p>公开测试期间客户端免注册即可使用，在本地填入你自己的 DeepSeek、Claude、OpenAI、Gemini 密钥或已有模型订阅即可连接。你可以为负责启发讲题的老师绑定主力推理模型，同时为后台负责拆分 PDF 与批量建卡的工作员指定价格更低且带「视觉」标识的模型，减少日常整理资料的花费。</p>
          </div>
          <div class="install-note-item">
            <h4>2. 签名校验热更新与异常自动回退</h4>
            <p>日常界面细节或教学资源调整无需每次重下五六百兆的安装包。Beta 2 接入了经过数字签名校验的热更新机制，侧边栏底部出现更新提示时即可按需升级前端界面与教学资源；如果新版本在启动时遇到异常，客户端会自动回退到随安装包分发的稳定版本。</p>
          </div>
          <div class="install-note-item">
            <h4>3. 本地纯文本存储与自动脱敏诊断</h4>
            <p>所有卡片、导读和白板都是保存在本地文件夹中的标准 <code>.md</code> 与 <code>.canvas</code> 纯文本文件，离线或更换软件依然可以直接打开。遇到运行异常点击「导出脱敏诊断」时，系统会自动去除 API 密钥与个人笔记正文，只保留排错所需的运行状态摘要。</p>
          </div>
        </div>
      </section>

      <section class="feature-block" id="feat-compare">
        <div class="feature-block-head">
          <p class="section-rubric">07 · 事实层与表现层全景对比</p>
          <h2>从底层事实可靠性到上层媒介表现力，对比三种学习方式的设计取舍。</h2>
          <p>把事实层的五项根基（人机协作与全程托管、外挂精选脉络、自生长知识库结构、搭梯式认知教法、双轨并轨复习课）与表现层的两项升级（AI 看得懂每一帧的互动微课、平铺推导白板与全局知识星图）分开对照，就能看清这套系统的完整脉络。</p>
        </div>
        <div style="margin-top:20px;">
          ${renderTeachingComparison({ id: 'feat-compare-matrix' })}
        </div>
      </section>

      <section class="feature-cta-band" aria-label="下一步行动">
        <div>
          <h2>可以先在网页端试上一课，或下载客户端放入自己的讲义。</h2>
          <p>下载对应系统的安装包后五分钟内即可完成模型配置开始使用；如果暂时不便安装，也可以先免登录打开网页端 1:1 实景课堂体验完整交互。</p>
        </div>
        <div class="feature-cta-actions">
          <a class="btn-primary" href="/guide/#download">前往下载 Beta 2 安装包</a>
          <a class="btn-quiet" href="/first-lesson/">免登录试一课实景课堂 →</a>
        </div>
      </section>
    </div>
  `;

  return pageShell({
    title: '功能与使用说明 · Notara',
    description: '面向学生的 Notara 桌面端 Beta 2 图文使用指南：事实层与表现层架构、人机协作、自生长知识库、搭梯教法、双轨复习与 AI 看得懂的互动微课。',
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
        <h1>你看得到动态变化、AI 也看得懂每一帧的<span class="nowrap">互动微课。</span></h1>
        <p>
          传统录播网课是录死的一段视频：你看课时没法自己动手改条件试一试，按下暂停问 AI“这里没看懂”时，AI 也很难准确知道视频画面此刻停在什么状态。下面这几节公开微课直接用代码实时画出每一帧动画：对人来说，函数逼近、特征值拉伸与磁场临界圆的变化一目了然，随时可以按暂停、亲手拖动滑块改参数；对桌面书房里的 AI 老师来说，画面背后的公式和当前参数全写在代码里，你在哪一帧停住、把数值调成了多少，它后台看得一清二楚，能直接顺着当前画面给你讲明白。已安装 Notara 桌面端的同学，可将下方公开订阅地址粘贴到「私人书房 → 资料源」免费导入，后续更新不会覆盖原有的个人笔记。
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
    title: 'AI 看得懂每一帧的互动代码微课 · Notara',
    description: '在线体验用代码实时绘制、随时可暂停拖滑块改参数且 AI 老师看得懂每一帧状态的互动微课，并可免费订阅导入 Notara 桌面书房。',
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
