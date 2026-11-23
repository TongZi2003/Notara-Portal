import { createRequire } from 'node:module';
import { railSubjects } from './library.mjs';
import { showcaseFigure } from './plates.mjs';

const require = createRequire(import.meta.url);
const katex = require('katex');

export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderTex(tex, displayMode = false) {
  return katex.renderToString(String(tex || '').trim(), {
    displayMode,
    throwOnError: false,
    strict: false,
  });
}

export function renderMdWithMath(raw = '') {
  const blocks = String(raw || '').trim().split(/\n{2,}/);
  return blocks
    .map((block) => {
      const tokens = [];
      let text = block.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
        const key = `@@TEX_BLOCK_${tokens.length}@@`;
        tokens.push(renderTex(tex, true));
        return key;
      });
      text = text.replace(/\$([^\n$]+?)\$/g, (_, tex) => {
        const key = `@@TEX_INLINE_${tokens.length}@@`;
        tokens.push(renderTex(tex, false));
        return key;
      });
      text = esc(text)
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        .replace(/`([^`]+)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
      text = text.replace(/@@TEX_(?:BLOCK|INLINE)_(\d+)@@/g, (_, idx) => tokens[Number(idx)] || '');
      return `<p>${text}</p>`;
    })
    .join('');
}

export const icons = {
  bookshelf: `<svg width="17" height="17" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2.4" y="3.2" width="3.4" height="10.6" rx="0.8"/><rect x="6.9" y="2.4" width="3.5" height="11.4" rx="0.8"/><path d="M12 3.7l2.9-.7 1.3 10.3-3 .5z"/><path d="M1.6 15.2h14.8"/></svg>`,
  search: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>`,
  split: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/></svg>`,
  techo: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2v8l3-3 3 3V2"/><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/></svg>`,
  sliders: `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/></svg>`,
  plus: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>`,
  close: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`,
  chevDown: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`,
  chevRight: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>`,
  file: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/></svg>`,
  canvas: `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="8" height="8" x="3" y="3" rx="2"/><path d="M7 11v4a2 2 0 0 0 2 2h4"/><rect width="8" height="8" x="13" y="13" rx="2"/></svg>`,
  memBook: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20"/><path d="M8 7h6"/><path d="M8 11h8"/></svg>`,
  paperclip: `<svg width="12.5" height="12.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>`,
  sigma: `<svg width="12.5" height="12.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 7V4H6l6 8-6 8h12v-3"/></svg>`,
  sparkles: `<svg width="12.5" height="12.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/></svg>`,
  quote: `<svg width="12.5" height="12.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 10 20 15 15 20"/><path d="M4 4v7a4 4 0 0 0 4 4h12"/></svg>`,
  send: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.95" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 7-7 7 7"/><path d="M12 19V5"/></svg>`,
  timer: `<svg width="13.5" height="13.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="10" x2="14" y1="2" y2="2"/><line x1="12" x2="15" y1="14" y2="11"/><circle cx="12" cy="14" r="8"/></svg>`,
  history: `<svg width="13.5" height="13.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M12 7v5l4 2"/></svg>`,
  swap: `<svg width="13.5" height="13.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/></svg>`,
  expand: `<svg width="13.5" height="13.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" x2="14" y1="3" y2="10"/><line x1="3" x2="10" y1="21" y2="14"/></svg>`,
  code: `<svg width="13.5" height="13.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`,
  chat: `<svg width="12.5" height="12.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  edit: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>`,
  copy: `<svg width="12.5" height="12.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>`,
  branch: `<svg width="12.5" height="12.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.55" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="6" x2="6" y1="3" y2="15"/><circle cx="18" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M18 9a9 9 0 0 1-9 9"/></svg>`,
  arrowRight: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>`,
};

export function renderPixelAvatar(file, size = 24, extraClass = '') {
  const radius = size <= 19 ? 5 : size <= 24 ? 6 : 7.5;
  const cls = ['pa-pixel-avatar', extraClass].filter(Boolean).join(' ');
  return `<span class="${cls}" aria-hidden="true" style="width:${size}px;height:${size}px;border-radius:${radius}px"><img src="/assets/pixel-avatars/${esc(file)}" alt="" draggable="false" loading="eager" decoding="async"></span>`;
}

export function renderLeftRail({ activeVaultId = '', hubActive = false, embedMode = false }) {
  const hubAttrs = embedMode
    ? `type="button" data-rail-scene="hub-shelf"`
    : `href="/library/"`;
  const hubTag = embedMode ? 'button' : 'a';

  const itemsHtml = railSubjects
    .map((item) => {
      const isActive = !hubActive && item.id === activeVaultId;
      if (embedMode && item.sceneId) {
        return `<button
          type="button"
          class="pa-vault-item"
          data-cloth="${esc(item.cloth)}"
          ${isActive ? 'data-active="true"' : ''}
          data-rail-scene="${esc(item.sceneId)}"
          title="${esc(item.title)}"
        >
          <span class="pa-vault-book-spine" aria-hidden="true"></span>
          <span class="pa-vault-book-monogram">${esc(item.mono)}</span>
        </button>`;
      }
      return `<a
        href="${esc(item.href)}"
        class="pa-vault-item"
        data-cloth="${esc(item.cloth)}"
        ${isActive ? 'data-active="true"' : ''}
        title="${esc(item.title)}"
      >
        <span class="pa-vault-book-spine" aria-hidden="true"></span>
        <span class="pa-vault-book-monogram">${esc(item.mono)}</span>
      </a>`;
    })
    .join('');

  return `<aside class="pa-rail" aria-label="学习集书脊导航栏">
    <${hubTag}
      class="pa-global-hub-btn"
      ${hubActive ? 'data-active="true"' : ''}
      ${hubAttrs}
      title="私人书房 · 跨学科书架总览"
      aria-label="私人书房"
    >
      ${icons.bookshelf}
    </${hubTag}>
    <div class="pa-rail-divider"></div>
    <div class="pa-rail-vaults">
      ${itemsHtml}
      <a href="/library/" class="pa-rail-btn pa-rail-new-vault-btn" title="从公开标杆库添置学习集" aria-label="添置学习集">
        ${icons.plus}
      </a>
    </div>
    <div class="pa-rail-spacer"></div>
    <div class="pa-rail-actions" aria-hidden="true">
      <span class="pa-rail-btn">${icons.search}</span>
      <span class="pa-rail-btn" data-active="true">${icons.split}</span>
      <span class="pa-rail-btn">${icons.techo}</span>
      <span class="pa-rail-btn">${icons.sliders}</span>
    </div>
  </aside>`;
}

export function renderClothBookshelf(sets) {
  return `<div class="pa-bookshelf-case">
    <div class="pa-bookshelf-grid">
      ${sets
        .map(
          (s) => `<div class="pa-book-slot">
            <a
              href="${esc(s.sampleHref)}"
              class="pa-shelf-book pa-global-ws-row"
              data-cloth="${esc(s.cloth)}"
              title="${esc(s.title)} — ${esc(s.sampleAction)}"
            >
              <span class="pa-book-ribbon" aria-hidden="true"></span>
              <span class="pa-book-hinge" aria-hidden="true"></span>
              <span class="pa-book-plate">
                <span class="pa-book-vol">${esc(s.vol)} · ${esc(s.stage)}</span>
                <span class="pa-book-title">${esc(s.bookMain)}</span>
                <span class="pa-book-subtitle">${esc(s.bookSub)}</span>
              </span>
              <span class="pa-book-obi">
                <span class="pa-book-obi-avatars" aria-hidden="true">
                  ${renderPixelAvatar(s.teacherKey, 21)}
                  ${renderPixelAvatar(s.companionKey, 17, 'pa-book-obi-avatar-sub')}
                </span>
                <span class="pa-book-obi-body">
                  <span class="pa-book-obi-pair">${esc(s.pairLabel)}</span>
                  <span class="pa-book-obi-stats">${esc(s.statsLabel)}</span>
                </span>
              </span>
            </a>
          </div>`
        )
        .join('')}
    </div>
  </div>`;
}

function renderCanvasBoard(scene) {
  const [n0, n1, n2] = scene.canvasNodes;
  return `<div class="pa-replica-canvas-surface">
    <div class="wf-canvas-toolbar">
      <span>推演白板（<code>${esc(scene.boardShort)}</code>）</span>
      <span>支持课本区域直接框选上板 · 分支推演并排对照</span>
    </div>
    <div class="wf-canvas-stage">
      <div class="pa-replica-canvas-node wf-canvas-root">
        <div class="pa-replica-canvas-node-head">01 · 原题与起点 · ${esc(n0?.title || '核心命题')}</div>
        <div class="pa-replica-canvas-node-body">${renderMdWithMath(n0?.body || '')}</div>
        <div class="wf-canvas-pdf-tag">${icons.file}<span>${esc(scene.docShort)} · 原文联动锚点</span></div>
      </div>
      <div class="wf-canvas-connector" aria-hidden="true">
        <svg viewBox="0 0 640 36" class="wf-canvas-edge-svg">
          <path d="M 320 2 L 320 14 M 320 14 C 320 22, 160 14, 160 32 M 320 14 C 320 22, 480 14, 480 32" fill="none" stroke="#8b735f" stroke-width="1.6"/>
          <circle cx="160" cy="32" r="2.8" fill="#7d5c46"/>
          <circle cx="480" cy="32" r="2.8" fill="#7d5c46"/>
        </svg>
      </div>
      <div class="wf-canvas-branches">
        <div class="pa-replica-canvas-node">
          <div class="pa-replica-canvas-node-head">02 · 分支推演 · ${esc(n1?.title || '关键变形')}</div>
          <div class="pa-replica-canvas-node-body">${renderMdWithMath(n1?.body || '')}</div>
        </div>
        <div class="pa-replica-canvas-node">
          <div class="pa-replica-canvas-node-head">03 · 边界与反例 · ${esc(n2?.title || '边界核验')}</div>
          <div class="pa-replica-canvas-node-body">${renderMdWithMath(n2?.body || '')}</div>
        </div>
      </div>
      <div class="pa-replica-card-figure" style="margin-top:12px;">${showcaseFigure(scene.figureKind)}</div>
    </div>
    <p class="pa-replica-canvas-caption">原生开放 <code>.canvas</code> 空间推演文件，与课堂对话实时同步，本地任意兼容工具可直接读写。</p>
  </div>`;
}

function renderGuideStages(scene) {
  return `<div class="pa-structured-scroll">
    <div class="pa-structured-container">
      <header class="pa-sdoc-hero pa-sdoc-hero--card">
        <div class="pa-sdoc-hero-top">
          <div class="pa-sdoc-badges">
            <span class="pa-sdoc-genre-pill" data-tone="accent">导读路线</span>
            <span class="pa-sdoc-meta-pill">${esc(scene.setTitle)}</span>
          </div>
        </div>
        <h2 class="pa-sdoc-title">00-导读 · 章节推进清单</h2>
      </header>

      <section class="pa-sdoc-card">
        <div class="pa-sdoc-sec-head">
          <span class="pa-sdoc-sec-label">探索足迹（直接回写原文 [x]）</span>
          <span class="pa-sdoc-progress-label">${esc(scene.guideProgress)}</span>
        </div>
        <div class="pa-sdoc-progressbar">
          <div class="pa-sdoc-progressbar-fill" style="width:${scene.guidePercent}%"></div>
        </div>
      </section>

      <div class="pa-sdoc-stage-stack">
        ${scene.guideItems
          .map(
            (it) => `<section class="pa-sdoc-card">
              <div class="pa-sdoc-stage-head">
                <input type="checkbox" ${it.done ? 'checked' : ''} aria-label="${esc(it.title)}">
                <span class="pa-sdoc-stage-num">${esc(it.stage)}</span>
                <span class="pa-sdoc-stage-phase">${esc(it.phase)}</span>
                <h3 class="pa-sdoc-stage-title">${esc(it.title)}</h3>
              </div>
            </section>`
          )
          .join('')}
      </div>
    </div>
  </div>`;
}

export function renderWorkspaceShell({
  scene,
  embedMode = false,
  customLabHtml = '',
  quizHtml = '',
  customUnderstandingHtml = '',
  primaryHeadingTag = 'h2',
}) {
  const turnsHtml = scene.turns
    .map((t) => {
      if (t.role === 'user') {
        return `<div class="pa-msg-user">
          ${
            t.refChip
              ? `<div class="pa-msg-refs"><span class="pa-doc-chip">${icons.file}<span>${esc(t.refChip)}</span></span></div>`
              : ''
          }
          <div class="pa-msg-user-bubble">${renderMdWithMath(t.md)}</div>
        </div>`;
      }

      const thinkingBlock = t.thinkingSummary
        ? `<div class="pa-tool-group" data-tool-collapsible>
            <div class="pa-tool-bar">
              <button type="button" class="pa-tool-summary" data-tool-toggle aria-expanded="false">
                <span class="pa-tool-status-dot"></span>
                <span>思考过程 · ${esc(t.thinkingSummary)}</span>
                ${icons.chevRight}
              </button>
            </div>
            <div class="pa-tool-detail" data-tool-body hidden>${esc(t.thinkingDetail)}</div>
          </div>`
        : '';

      const toolBlock = t.toolFile
        ? `<div class="pa-tool-group">
            <div class="pa-tool-bar">
              <span class="pa-tool-summary" style="cursor:default">
                <span class="pa-tool-status-dot"></span>
                <span>查阅 ${esc(t.toolFile)}</span>
              </span>
              <button type="button" class="pa-tool-jump-btn" data-focus-card-tab>打开</button>
            </div>
          </div>`
        : '';

      const chipsBlock =
        t.docChips && t.docChips.length
          ? `<div class="pa-doc-links">
              ${t.docChips
                .map((c) => `<span class="pa-doc-chip">${icons.file}<span>${esc(c)}</span></span>`)
                .join('')}
            </div>`
          : '';

      return `<div class="pa-msg-assistant" ${t.isCompanion ? 'data-companion="true"' : ''}>
        <div class="pa-msg-role-line">
          ${renderPixelAvatar(scene.avatarFile, 22)}
          <span>${esc(scene.teacherName)}</span>
          <span class="pa-msg-role-tag">· ${esc(scene.teacherTag)}</span>
        </div>
        ${thinkingBlock}
        ${toolBlock}
        <div class="pa-msg-prose pa-structured-md">
          ${renderMdWithMath(t.md)}
        </div>
        ${chipsBlock}
        <div class="pa-replica-msg-tail" aria-hidden="true">
          <span>${icons.copy}</span>
          <span>${icons.branch}</span>
        </div>
      </div>`;
    })
    .join('');

  const visualBlock = customLabHtml
    ? customLabHtml
    : `<div class="pa-replica-card-figure">${showcaseFigure(scene.figureKind)}</div>`;

  const understandingSection = customUnderstandingHtml
    ? customUnderstandingHtml
    : `<section class="pa-sdoc-card pa-sdoc-card--understanding" data-understanding-card>
        <div class="pa-sdoc-sec-head">
          <span class="pa-sdoc-sec-label">我的理解</span>
          <button type="button" class="pa-sdoc-ghost-btn" data-edit-understanding>
            ${icons.edit}
            <span>修改理解</span>
          </button>
        </div>
        <div class="pa-sdoc-sec-body pa-structured-md" data-understanding-display>
          ${renderMdWithMath(scene.understandingText)}
        </div>
        <div class="pa-sdoc-inline-editor" data-understanding-editor hidden>
          <textarea class="pa-sdoc-textarea" rows="3" aria-label="编辑我的理解">${esc(
            scene.understandingText.replace(/\$/g, '')
          )}</textarea>
          <div class="pa-sdoc-editor-actions">
            <button type="button" class="pa-sdoc-ghost-btn" data-cancel-understanding>取消</button>
            <button type="button" class="pa-sdoc-secondary-btn" data-save-understanding>保存理解留痕</button>
          </div>
        </div>
      </section>`;

  return `<div class="pa-shell" data-replica-workspace="${esc(scene.id)}">
    ${renderLeftRail({ activeVaultId: scene.vaultId, hubActive: false, embedMode })}

    <div class="pa-stage">
      <!-- Left Ruled-Paper Classroom Sheet -->
      <section class="pa-chat-sheet" aria-label="课堂对话纸张">
        <header class="pa-chat-header">
          <span class="pa-vault-trigger">
            <span class="pa-vault-trigger-name" data-window-set-name>Notara 书房 · ${esc(scene.setTitle)}</span>
            ${icons.chevDown}
          </span>
          <span class="pa-header-sep"></span>
          <div class="pa-chat-tabs">
            <span class="pa-chat-tab">
              <span class="pa-chat-tab-dot"></span>
              <span>星野助教</span>
            </span>
            <span class="pa-chat-tab" data-active="true">
              <span class="pa-chat-tab-dot"></span>
              <span>${esc(scene.roomTab)}</span>
              <span class="pa-chat-tab-close" aria-hidden="true">${icons.close}</span>
            </span>
          </div>
          <div class="pa-header-right" aria-hidden="true">
            <span class="pa-chip-btn pa-status-capsule-trigger">
              <span class="pa-replica-avatar-stack">
                ${renderPixelAvatar('worker-problem.png', 16)}
                ${renderPixelAvatar('worker-review.png', 16)}
                ${renderPixelAvatar('companion-deepseek.png', 16)}
              </span>
              <span>3</span>
            </span>
            <span class="pa-icon-btn">${icons.timer}</span>
            <span class="pa-chip-btn">${icons.history}<span>1</span></span>
          </div>
        </header>

        <div class="pa-chat-stage-body">
          <div class="pa-chat-scroll" data-chat-scroll>
            <div class="pa-chat-column" data-chat-stream data-teacher-name="${esc(scene.teacherName)}" data-teacher-tag="${esc(scene.teacherTag)}" data-teacher-avatar="${esc(scene.avatarFile)}">
              ${turnsHtml}
            </div>
          </div>

          <div class="pa-composer-wrap">
            <form class="pa-composer" data-replica-composer>
              <div class="pa-composer-refs">
                <span class="pa-composer-persona-trigger">
                  ${renderPixelAvatar(scene.avatarFile, 18)}
                  <span class="pa-composer-persona-name">${esc(scene.teacherName)}</span>
                  ${icons.chevDown}
                </span>
                <span class="pa-ref-pill">
                  ${icons.file}
                  <span>${esc(scene.docPath)}</span>
                </span>
              </div>
              <textarea
                class="pa-composer-input"
                rows="1"
                placeholder="写下你的推演想法，或点击右侧「去讨论」继续追问…"
                aria-label="在课堂中继续推演提问"
                data-composer-input
              ></textarea>
              <div class="pa-composer-bar">
                <div class="pa-composer-tools">
                  <span class="pa-chip-btn">${icons.paperclip}<span>图片/课件</span></span>
                  <span class="pa-chip-btn">${icons.sigma}<span>公式</span></span>
                  <span class="pa-chip-btn">${icons.sparkles}<span>教法</span></span>
                  <span class="pa-chip-btn">${icons.quote}<span>引用「${esc(scene.docShort.slice(0, 7))}…」</span></span>
                </div>
                <div style="display:inline-flex;align-items:center;gap:6px;flex:none;">
                  ${
                    embedMode
                      ? `<a href="${esc(scene.sampleHref)}" class="pa-chip-btn" style="color:var(--pa-accent-ink);border-color:color-mix(in srgb,var(--pa-accent) 32%,var(--pa-border));">全屏动手试这一课 →</a>`
                      : `<span class="pa-chip-btn">自带密钥 · 导学旗舰 ${icons.chevDown}</span>`
                  }
                  <button type="submit" class="pa-send-btn" aria-label="发送推演消息">${icons.send}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <div class="pa-split-handle" aria-hidden="true"></div>

      <!-- Right Structured Card, Guide & Canvas Sheet -->
      <section class="pa-rightbar" style="flex:1 1 50%" aria-label="资料卡片与白板工作区">
        <header class="pa-rightbar-header">
          <div class="pa-rightbar-tabs" role="tablist" aria-label="切换右侧资料视图">
            <button type="button" role="tab" class="pa-rtab" data-doc-tab="guide" aria-selected="false">
              ${icons.file}
              <span class="pa-rtab-label">${esc(scene.guideShort)}</span>
            </button>
            <button type="button" role="tab" class="pa-rtab" data-doc-tab="card" data-active="true" aria-selected="true">
              ${icons.file}
              <span class="pa-rtab-label">${esc(scene.docShort)}</span>
            </button>
            <button type="button" role="tab" class="pa-rtab" data-doc-tab="board" aria-selected="false">
              ${icons.canvas}
              <span class="pa-rtab-label">${esc(scene.boardShort)}</span>
            </button>
          </div>
          <div class="pa-header-right" aria-hidden="true">
            <span class="pa-icon-btn">${icons.swap}</span>
            <span class="pa-icon-btn">${icons.expand}</span>
          </div>
        </header>

        <div class="pa-rightbar-body">
          <div class="pa-replica-filebar">
            <span class="pa-replica-filepath">${esc(scene.docPath)}</span>
            <div class="pa-replica-fileactions">
              <span class="pa-sdoc-ghost-btn">${icons.sigma}<span>公式</span></span>
              <span class="pa-sdoc-ghost-btn">${icons.code}</span>
              <button type="button" class="pa-sdoc-ghost-btn" data-bring-to-chat="我想围绕「${esc(scene.cardTitle)}」先讲讲我目前的思路，请帮我照一照有没有漏掉的前提。">
                ${icons.chat}<span>带入对话</span>
              </button>
            </div>
          </div>

          <!-- Active Card Reader Panel -->
          <div class="nv-editable-document pa-structured-doc" data-doc-panel="card">
            <div class="pa-structured-scroll">
              <div class="pa-structured-container" style="display:flex;flex-direction:column;gap:12px;padding:16px 20px 24px;">
                <header class="pa-sdoc-hero pa-sdoc-hero--card">
                  <div class="pa-sdoc-hero-top" style="display:flex;align-items:center;justify-content:space-between;gap:8px;flex-wrap:wrap;margin-bottom:6px;">
                    <div class="pa-sdoc-badges" style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                      <span class="pa-sdoc-genre-pill" data-tone="amber">${esc(scene.genreLabel)}</span>
                      ${scene.tags.map((tag) => `<span class="pa-sdoc-tag">${esc(tag)}</span>`).join('')}
                    </div>
                  </div>
                  <${primaryHeadingTag} class="pa-sdoc-title" style="margin:0;font-family:var(--pa-font-reading);font-size:20px;font-weight:600;color:var(--pa-ink);">${esc(scene.cardTitle)}</${primaryHeadingTag}>
                </header>

                <section class="pa-sdoc-card pa-sdoc-card--elevated">
                  <div class="pa-sdoc-sec-head">
                    <span class="pa-sdoc-sec-label">题目与交互推演</span>
                  </div>
                  <div class="pa-sdoc-sec-body pa-structured-md">
                    ${renderMdWithMath(scene.problemMd)}
                  </div>
                  ${visualBlock}
                  <div class="pa-sdoc-source-drawer">
                    <button type="button" class="pa-sdoc-fold-trigger" data-source-toggle aria-expanded="false">
                      ${icons.chevRight}
                      <span>查看原出处</span>
                    </button>
                    <div class="pa-sdoc-fold-panel" data-source-panel hidden>
                      <span style="font-size:12.5px;color:var(--pa-ink-secondary);">${esc(scene.sourceNote)}</span>
                    </div>
                  </div>
                </section>

                ${quizHtml}

                <div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:2px 4px;font-size:12.5px;color:var(--pa-ink-secondary);">
                  <span>延伸探索卡片：</span>
                  <span class="pa-doc-chip">${icons.file}<span>${esc(scene.relatedChip)}</span></span>
                </div>

                <!-- Anti-Spoiler Reference Analysis Card -->
                <section class="pa-sdoc-card" data-spoiler-card>
                  <div class="pa-sdoc-sec-head">
                    <span class="pa-sdoc-sec-label">参考解析</span>
                    <button type="button" class="pa-sdoc-ghost-btn" data-spoiler-reset hidden>收起解析</button>
                  </div>

                  <div class="pa-sdoc-spoiler-gate" data-spoiler-gate>
                    <p class="pa-sdoc-spoiler-prompt">建议先根据题目自己动笔试一试，卡住时可以先看切入提示。</p>
                    <div class="pa-sdoc-spoiler-actions">
                      <button type="button" class="pa-sdoc-secondary-btn" data-spoiler-hint-btn>先看思路提示</button>
                      <button type="button" class="pa-sdoc-ghost-btn pa-sdoc-ghost-btn--bordered" data-spoiler-full-btn>展开完整解析</button>
                    </div>
                  </div>

                  <div class="pa-sdoc-hint-box" data-spoiler-hint hidden>
                    <div class="pa-sdoc-hint-title">思路提示 · ${esc(scene.hintTitle)}</div>
                    <div class="pa-structured-md">${renderMdWithMath(scene.hintMd)}</div>
                    <div class="pa-sdoc-hint-footer">
                      <button type="button" class="pa-sdoc-secondary-btn" data-spoiler-full-btn>继续展开完整解析</button>
                    </div>
                  </div>

                  <div class="pa-sdoc-sec-body pa-structured-md" data-spoiler-full hidden>
                    ${renderMdWithMath(scene.solutionMd)}
                  </div>
                </section>

                <!-- Follow-up Questions Card -->
                <section class="pa-sdoc-card">
                  <div class="pa-sdoc-sec-head">
                    <span class="pa-sdoc-sec-label">待探讨问题</span>
                  </div>
                  <div class="pa-sdoc-question-list">
                    ${scene.nextQuestions
                      .map(
                        (item) => `<div class="pa-sdoc-question-item">
                          <div class="pa-sdoc-question-body pa-structured-md">${renderMdWithMath(item.q)}</div>
                          <button
                            type="button"
                            class="pa-sdoc-secondary-btn pa-sdoc-question-btn"
                            data-discuss-q="${esc(item.q.replace(/\$/g, ''))}"
                            data-discuss-reply="${esc(item.reply.replace(/\$/g, ''))}"
                          >
                            <span>去讨论</span>
                            ${icons.arrowRight}
                          </button>
                        </div>`
                      )
                      .join('')}
                  </div>
                </section>

                ${understandingSection}
              </div>
            </div>
          </div>

          <!-- Guide Checklist Panel -->
          <div class="nv-editable-document pa-structured-doc" data-doc-panel="guide" hidden>
            ${renderGuideStages(scene)}
          </div>

          <!-- JSON Canvas Panel -->
          <div class="nv-editable-document pa-structured-doc" data-doc-panel="board" hidden>
            ${renderCanvasBoard(scene)}
          </div>
        </div>
      </section>
    </div>
  </div>`;
}

export function renderPedagogyShowcase() {
  return `<div class="pedagogy-block">
    <div class="specimen-window pedagogy-contrast-window">
      <div class="specimen-bar pedagogy-prompt-bar">
        <span class="pedagogy-prompt-label">三段式混合教法 · 按火候切换</span>
        <span class="pedagogy-bar-sub">既不迷信纯启发，也不排斥高密度直讲——看清你此刻离目标有多远，再决定怎么教</span>
      </div>

      <div class="pedagogy-stages-grid">
        <article class="pedagogy-col">
          <div class="pedagogy-col-head">
            <span class="pedagogy-stage-idx">第一段 · 高密度直讲铺底</span>
            <span class="pedagogy-fire-pill">踮脚也够不着时</span>
          </div>
          <h3 class="pedagogy-stage-title">痛快把底子讲透，绝不逼人盲猜。</h3>
          <p class="pedagogy-stage-desc">
            遇到全然陌生的定义、公理或前置知识缺口时，“有必要的填鸭”反而最诚实高效。直接调出你库里已懂的旧卡作参照，用一个最小完整正例，把来龙去脉一步不跳地讲清。
          </p>
          <div class="pedagogy-live-box">
            <div class="pedagogy-live-role">
              ${renderPixelAvatar('teacher-shirakawa.png', 20)}
              <span>白川 · 直讲搭桥态</span>
            </div>
            <div class="pedagogy-quote">
              ${renderMdWithMath('“『隐零点』对你还是新词，这里我们不绕弯子：先看一个三行就能走通的最小正例，看清为什么超越方程解不出根时要**设而不求**……”')}
            </div>
          </div>
        </article>

        <article class="pedagogy-col pedagogy-col--highlight">
          <div class="pedagogy-col-head">
            <span class="pedagogy-stage-idx">第二段 · 苏格拉底法搭梯</span>
            <span class="pedagogy-fire-pill pedagogy-fire-pill--warm">踮脚能够到时</span>
          </div>
          <h3 class="pedagogy-stage-title">只搭一级梯子，留给你自己捅破窗户纸。</h3>
          <p class="pedagogy-stage-desc">
            底子打稳后，新题默认只呈现干净的题干；当你动笔卡在够得着的转折处，老师会忍住不直接抛出一整页标准答案，而是顺着你的草稿找到卡点，只点拨半步，引你自己跨过去。
          </p>
          <div class="pedagogy-live-box pedagogy-live-box--warm">
            <div class="pedagogy-live-role">
              ${renderPixelAvatar('teacher-demon.png', 20)}
              <span>夜久 · 苏格拉底追问态</span>
            </div>
            <div class="pedagogy-quote">
              ${renderMdWithMath('“求导 $f\'(x)=e^x-a$ 完全对！卡在符号不定？调出上周做通的 `[[含参二次单调性]]`——要是先看 $a \\le 0$，它还会变号吗？”')}
            </div>
          </div>
        </article>

        <article class="pedagogy-col">
          <div class="pedagogy-col-head">
            <span class="pedagogy-stage-idx">第三段 · 费曼法盲测验真</span>
            <span class="pedagogy-fire-pill">觉得已经掌握时</span>
          </div>
          <h3 class="pedagogy-stage-title">合上解析讲给同桌，验出真懂假熟。</h3>
          <p class="pedagogy-stage-desc">
            听懂推导，只能算看懂了别人走过的路。收尾时切换到完全看不到解析的同桌，用自己的大白话把解题思路与易漏边界从头讲通，才会在图谱里点亮实线；中途借过提示的，则如实记下、次日重验。
          </p>
          <div class="pedagogy-live-box">
            <div class="pedagogy-live-role">
              ${renderPixelAvatar('companion-deepseek.png', 20)}
              <span>同桌大肥鱼 · 屏蔽答案盲测态</span>
            </div>
            <div class="pedagogy-quote">
              ${renderMdWithMath('“我这儿可没答案啊！你刚说 $x_0 e^{x_0} = a$ 能整体消掉指数，到底代回原式哪一项？补一行给我看？”')}
            </div>
          </div>
        </article>
      </div>

      <div class="pedagogy-skill-foot">
        <div>
          <strong>按场景随时切换的学习方法：</strong>
          <span>除三段式主干外，<strong>命题人视角拆条件</strong>、<strong>波利亚解题启发</strong>、<strong>考前 30 分钟盲区快筛</strong>与<strong>代码沙箱排错</strong>等学习方法都整理成可按需调用的专题指南，上课聊到一半也能随时切换，还可以在资源市集按需添置。</span>
        </div>
      </div>
    </div>
  </div>`;
}

export function renderWorkbenchActs() {
  return `<div class="workbench-acts">
    <!-- Core Workflow 01: Living Knowledge Graph with Heterogeneous Material Merge -->
    <article class="act-row" id="wf-graph">
      <div class="act-copy">
        <div class="act-meta-line">
          <span class="act-num">01 · 会生长的知识图谱</span>
          <span class="wf-tag">多份资料并成同一张网</span>
        </div>
        <h3>课本 PDF、错题卷与随堂笔记放在一起，慢慢长成同一张活图谱。</h3>
        <p>
          拖进来的教材 PDF、拍下的月考错题卷和手写笔记，都会先和你的已有笔记逐一比对，再放进同一张网里：考同一个知识点的题并回老卡片并补全出处，换了条件的新变式题保留完整题干、连回母题，全新概念则单独建新卡片，再也不会留下一堆找不着的零散文件和沉底聊天记录。
        </p>
        <p>
          新放进来的资料先用<strong>浅色虚线</strong>摆出骨架；只有等你亲手推通、写下「我的理解」之后，连线与节点才会真正<strong>点亮</strong>接成实线，还能按日期一步步回放图谱亮起来的过程。阶段复盘时，散在各章的零碎技巧也能收束整理成一篇规律总结卡。
        </p>
      </div>
      <div class="act-specimen">
        <div class="specimen-window">
          <div class="specimen-bar">
            <span style="display:inline-flex;align-items:center;gap:6px;font-weight:600;color:var(--pa-ink);">
              ${icons.file}<span>资料 · 知识图谱（多份资料自动整理串联）</span>
            </span>
            <span style="font-size:11.5px;color:var(--pa-ink-muted);">虚线 = 刚添入待巩固 · 实线 = 自己推通</span>
          </div>
          <div class="specimen-body" style="display:flex;flex-direction:column;gap:11px;">
            <div class="wf-merge-feed" aria-label="多份资料并入图谱示例">
              <div class="wf-merge-item">
                <span class="wf-merge-src">${icons.paperclip}<span>一轮导数讲义.pdf · P3 框选</span></span>
                <span class="wf-merge-arrow">→</span>
                <span class="wf-merge-dst">并入老卡片 <code>[[切线放缩核心母题]]</code> 补齐出处</span>
              </div>
              <div class="wf-merge-item">
                <span class="wf-merge-src">${icons.file}<span>十月联考卷.pdf · 第 21 题</span></span>
                <span class="wf-merge-arrow">→</span>
                <span class="wf-merge-dst">新建变式卡并连回 <code>[[极值点偏移]]</code></span>
              </div>
              <div class="wf-merge-item">
                <span class="wf-merge-src">${icons.edit}<span>课堂随笔-泰勒余项.md</span></span>
                <span class="wf-merge-arrow">→</span>
                <span class="wf-merge-dst">阶段复盘整理成总结卡 <code>[[多项式逼近与单侧界]]</code></span>
              </div>
            </div>

            <svg class="canvas-svg" viewBox="0 0 540 176" role="img" aria-label="多份资料串联后的虚实双线知识图谱">
              <rect x="0.5" y="0.5" width="539" height="175" rx="8" fill="#fdfbf7" stroke="#dfd7c8"/>
              <!-- Solid student-verified links -->
              <line x1="258" y1="88" x2="112" y2="44" stroke="#7d5c46" stroke-width="2.1"/>
              <line x1="258" y1="88" x2="108" y2="134" stroke="#7d5c46" stroke-width="2.1"/>
              <line x1="112" y1="44" x2="108" y2="134" stroke="#9b7b63" stroke-width="1.4"/>
              <line x1="258" y1="88" x2="258" y2="144" stroke="#7d5c46" stroke-width="1.9"/>
              <!-- Dashed newly merged material links -->
              <line x1="258" y1="88" x2="424" y2="42" stroke="#b3a99a" stroke-width="1.6" stroke-dasharray="4 4"/>
              <line x1="258" y1="88" x2="436" y2="124" stroke="#b3a99a" stroke-width="1.6" stroke-dasharray="4 4"/>
              <line x1="424" y1="42" x2="436" y2="124" stroke="#c5bcb0" stroke-width="1.3" stroke-dasharray="3 4"/>

              <!-- Hub Node -->
              <g>
                <circle cx="258" cy="88" r="11" fill="#f3ebe1" stroke="#7d5c46" stroke-width="1.8"/>
                <circle cx="258" cy="88" r="5.5" fill="#7d5c46"/>
                <text x="258" y="67" text-anchor="middle" font-size="11" font-weight="600" fill="#26211c">多项式逼近与单侧界 (总结)</text>
              </g>
              <!-- Mastered Solid Nodes -->
              <g>
                <circle cx="112" cy="44" r="6" fill="#7d5c46"/>
                <text x="112" y="27" text-anchor="middle" font-size="10.5" fill="#2c2722">切线放缩 eˣ ≥ x+1</text>
              </g>
              <g>
                <circle cx="108" cy="134" r="6" fill="#524a41"/>
                <text x="108" y="154" text-anchor="middle" font-size="10.5" fill="#2c2722">反例 f(t)=t³ 穿切线</text>
              </g>
              <g>
                <circle cx="258" cy="144" r="5.5" fill="#524a41"/>
                <text x="258" y="164" text-anchor="middle" font-size="10.5" fill="#2c2722">对数上界 ln x ≤ x-1</text>
              </g>
              <!-- Newly Merged Unlit Nodes -->
              <g>
                <circle cx="424" cy="42" r="6" fill="#fdfbf7" stroke="#8b735f" stroke-width="1.7"/>
                <text x="424" y="25" text-anchor="middle" font-size="10.5" fill="#6c6358">联考 T21·极值点偏移 (新加入)</text>
              </g>
              <g>
                <circle cx="436" cy="124" r="6" fill="#fdfbf7" stroke="#8b735f" stroke-width="1.7"/>
                <text x="436" y="146" text-anchor="middle" font-size="10.5" fill="#6c6358">帕德有理近似边界 (待探索)</text>
              </g>
            </svg>
          </div>
        </div>
      </div>
    </article>

    <!-- Core Workflow 02: Home Assistant + Focused Classrooms + Background Helpers -->
    <article class="act-row" id="wf-agents">
      <div class="act-copy">
        <div class="act-meta-line">
          <span class="act-num">02 · 首页管家与专题课堂分工</span>
          <span class="wf-tag">首页看全盘 · 专题课深挖 · 后台跑繁杂活</span>
        </div>
        <h3>平时一个学习管家陪你看全盘，遇到硬骨头再单开专题课与后台帮手。</h3>
        <p>
          不用在十几个零散对话窗口之间来回复制粘贴。每个学习集都住着一位常驻的<strong>首页学习助手</strong>，平时帮你看着整体进度、提醒该复习什么，有临时想问的小问题或新想法，从这一个入口开口就行。
        </p>
        <p>
          遇到要死磕的大题或整份考卷时，首页助手会把重活分出去：一边单开标签页里的<strong>专题课堂</strong>陪你专注推演，一边派最多五位<strong>后台帮手</strong>按不同任务选用省钱或强推理模型去剪卷归档、遮住答案先验算、对比老笔记。下课后只把简洁结论捎回首页，聊天页面永远干干净净。
        </p>
      </div>
      <div class="act-specimen">
        <div class="specimen-window">
          <div class="specimen-bar wf-agent-tabbar">
            <span class="wf-agent-tab wf-agent-tab--active">
              <span class="wf-dot wf-dot--solid"></span>
              <span>首页学习助手 · 总管</span>
            </span>
            <span class="wf-agent-tab">
              <span class="wf-dot wf-dot--pulse"></span>
              <span>专题课：联考 T21 隐零点</span>
            </span>
            <span class="wf-agent-tab">
              <span>帮手记录 (2)</span>
            </span>
          </div>
          <div class="specimen-body" style="display:flex;flex-direction:column;gap:10px;">
            <div class="wf-user-intent">
              <span>我：刚考完十月联考卷，帮我把导数错题合进库里，今晚我想先把第 21 题第二问啃下来。</span>
            </div>

            <div class="wf-coord-box">
              <div class="wf-coord-head">
                ${renderPixelAvatar('notara-coordinator.png', 24)}
                <strong>星野 · 首页学习助手</strong>
                <span>翻看近期导数进度并分派后台任务</span>
              </div>

              <div class="wf-subagent-list">
                <div class="wf-subagent-row">
                  ${renderPixelAvatar('worker-general.png', 24)}
                  <div class="wf-subagent-main">
                    <div class="wf-subagent-title">
                      <strong>后台帮手 · 拆卷归档员</strong>
                      <span class="wf-pill wf-pill--done">轻量模型 · 已并入 2 卡</span>
                    </div>
                    <p>记下 T20、T21 在原卷框选出的页码与位置，对照老卡片完成连线归档。</p>
                  </div>
                </div>

                <div class="wf-subagent-row">
                  ${renderPixelAvatar('worker-problem.png', 24)}
                  <div class="wf-subagent-main">
                    <div class="wf-subagent-title">
                      <strong>后台帮手 · 独立盲算员</strong>
                      <span class="wf-pill wf-pill--done">推理模型 · 独立验算完毕</span>
                    </div>
                    <p>遮住解析先自己算一遍：确认 a &gt; 1 时直接分离参数走不通，需要改用隐零点代换。</p>
                  </div>
                </div>

                <div class="wf-subagent-row wf-subagent-row--classroom">
                  ${renderPixelAvatar('teacher-shirakawa.png', 24)}
                  <div class="wf-subagent-main">
                    <div class="wf-subagent-title">
                      <strong>专题课堂 · 专注拆解这一题</strong>
                      <span class="wf-pill wf-pill--warm">独立标签进行中</span>
                    </div>
                    <p>已为你建好《联考 T21 · 为何不能直接分离参数》专题课；下课后自动把结论捎回首页。</p>
                  </div>
                </div>
              </div>

              <div class="wf-handoff-receipt">
                <span>↩ 课后回报：</span>专题课结束后只把关键突破和后续复习点递回首页助手，不拿满屏中间草稿把主页面刷乱。
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>

    <!-- Core Workflow 03: Visual Spatial Whiteboard -->
    <article class="act-row" id="wf-canvas">
      <div class="act-copy">
        <div class="act-meta-line">
          <span class="act-num">03 · 可视化的空间推演白板</span>
          <span class="wf-tag">原题直接贴上板 · 几路解法并排摆开</span>
        </div>
        <h3>跳出窄窄的聊天框，在白板上把原题、图像与几种证法摆在一起看。</h3>
        <p>
          遇到多步变形、分类讨论和几何辅助线，全挤在单列聊天气泡里，往上翻两屏就容易忘掉前面设的条件。书房内置开放格式的电子白板：你可以<strong>把 PDF 试卷或课本上的那一块直接框出来贴上白板</strong>（点一下就能跳回原书那一页），再把几种思路分支、函数草图和关键步骤自检卡片并排连线。
        </p>
        <p>
          聊到某一步如果想倒回去重开一条新思路、换另一种证法试试，新分出来的课堂既可以和原先那一版共用同一块白板接力修改，也可以另外新建一张空白白板，还能对照前后两次具体增改了哪几个框。
        </p>
      </div>
      <div class="act-specimen">
        <div class="specimen-window">
          <div class="specimen-bar">
            <span style="display:inline-flex;align-items:center;gap:6px;font-weight:600;color:var(--pa-ink);">
              ${icons.canvas}<span>含参零点分类讨论.canvas</span>
            </span>
            <span style="font-size:11.5px;color:var(--pa-ink-muted);">原卷跳链 · 分支共用白板 · 关键步小测</span>
          </div>
          <div class="pa-replica-canvas-surface wf-canvas-demo" data-canvas-flow>
            <div class="wf-spatial-board">
              <div class="wf-spatial-left">
                <div class="pa-replica-canvas-node">
                  <div class="pa-replica-canvas-node-head">原题框选贴板 · 讲义 P4</div>
                  <div class="pa-replica-canvas-node-body">${renderMdWithMath('讨论 $f(x)=e^x - ax - 1$ 的零点个数（$a \\in \\mathbb{R}$）。')}</div>
                  <div class="wf-canvas-pdf-tag">${icons.file}<span>点击直跳 PDF 第 4 页原选区</span></div>
                </div>
                <div class="pa-replica-canvas-node" style="padding:10px;">
                  <svg viewBox="0 0 210 92" class="canvas-svg" role="img" aria-label="白板内嵌指数曲线与含参直线族示意">
                    <line x1="16" y1="76" x2="196" y2="76" stroke="#b9b0a3" stroke-width="1"/>
                    <line x1="78" y1="10" x2="78" y2="84" stroke="#b9b0a3" stroke-width="1"/>
                    <path d="M 20 71 Q 78 66, 118 42 T 182 10" fill="none" stroke="#2c2722" stroke-width="1.8"/>
                    <line x1="26" y1="80" x2="178" y2="24" stroke="#7d5c46" stroke-width="1.5"/>
                    <line x1="34" y1="68" x2="188" y2="38" stroke="#9b8b7a" stroke-width="1.2" stroke-dasharray="3 3"/>
                    <circle cx="78" cy="59" r="3" fill="#7d5c46"/>
                    <text x="128" y="18" font-size="9.5" fill="#2c2722">y = eˣ</text>
                    <text x="142" y="52" font-size="9.5" fill="#7d5c46">切线 a = 1</text>
                  </svg>
                </div>
              </div>

              <div class="wf-spatial-edges" aria-hidden="true">
                <svg viewBox="0 0 44 190" class="wf-spatial-edge-svg">
                  <path d="M 2 52 C 22 52, 20 38, 42 38" fill="none" stroke="#8b735f" stroke-width="1.6"/>
                  <path d="M 2 52 C 22 52, 20 132, 42 132" fill="none" stroke="#7d5c46" stroke-width="1.8"/>
                  <circle cx="42" cy="38" r="2.6" fill="#8b735f"/>
                  <circle cx="42" cy="132" r="2.8" fill="#7d5c46"/>
                </svg>
              </div>

              <div class="wf-spatial-right">
                <div class="pa-replica-canvas-node">
                  <div class="pa-replica-canvas-node-head">分支 A · a ≤ 0</div>
                  <div class="pa-replica-canvas-node-body">${renderMdWithMath('$f\'(x)=e^x-a > 0$ 在 $\\mathbb{R}$ 上恒增，结合 $f(0)=0$ 得**唯一零点**。')}</div>
                </div>

                <div class="pa-replica-canvas-node wf-flow-node">
                  <div class="pa-replica-canvas-node-head">分支 B · a &gt; 0（白板小测自检）</div>
                  <div class="pa-replica-canvas-node-body">
                    ${renderMdWithMath('驻点 $x_0=\\ln a$。当 $a > 1$ 时极小值 $f(\\ln a) = a(1-\\ln a)-1$ 的符号为：')}
                  </div>
                  <div class="wf-flow-btns" role="group" aria-label="检验白板极小值符号">
                    <button type="button" class="pa-sdoc-secondary-btn" data-flow-choice="lt0" aria-pressed="true">&lt; 0（两侧各一零点）</button>
                    <button type="button" class="pa-sdoc-ghost-btn pa-sdoc-ghost-btn--bordered" data-flow-choice="eq0">= 0（仅切点一解）</button>
                  </div>
                  <div class="wf-flow-feedback" data-flow-status>✓ 正确：因 ln t &gt; 1 - 1/t（t &gt; 1），极小值严格小于 0，配合两端趋于 +∞ 共有 2 个零点。</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>

    <!-- Core Workflow 04: Habit-Aware Mentors & Blind-Test Peers -->
    <article class="act-row" id="wf-personas">
      <div class="act-copy">
        <div class="act-meta-line">
          <span class="act-num">04 · 记得习惯的老师与同桌</span>
          <span class="wf-tag wf-tag--beta">同桌盲测过关 + 按你习惯启发点拨</span>
        </div>
        <h3>记得你平时总在哪里顺手跳步的师友，不用每节课从头认识。</h3>
        <p>
          你更习惯先画图像还是先推公式、过去踩过哪些坑、最近哪类变形容易一口气写太快，全都明明白白写在你电脑里自己能打开修改的普通笔记中。新开一节课时，老师只翻看跟当下有关的那几行，既连贯又干净。
        </p>
        <p>
          感觉某一题真想明白了，可以请出<strong>同桌开启「费曼盲测」</strong>：系统会替他完全挡住参考解析与历史聊天，全靠你从头到尾讲到他听懂为止。平时做题卡住或滑向老毛病时，也能切给了解你习惯的<strong>启发老师</strong>，就在你最易漏条件的那一步及时叫住反问。
        </p>
      </div>
      <div class="act-specimen">
        <div class="specimen-window">
          <div class="specimen-bar">
            <span style="display:inline-flex;align-items:center;gap:6px;font-weight:600;color:var(--pa-ink);">
              ${icons.memBook}<span>本地学习习惯笔记 · 同桌盲测与启发老师</span>
            </span>
            <span style="font-size:11.5px;color:var(--pa-ink-muted);">角色档案全以普通笔记存本地，随时可看可改</span>
          </div>
          <div class="specimen-body" style="display:flex;flex-direction:column;gap:10px;">
            <div class="wf-mem-snapshot">
              <div class="wf-mem-head">
                <span>习惯与卡点记录（来自学生档案与导数导读）</span>
                <span>按需参考 · 只读当下需要的内容</span>
              </div>
              <ul class="mem-excerpt-list">
                <li><strong>已跨过的小坑（10-10）：</strong>遇到含参二次项时，现在已经能主动先查 <code>a = 0</code> 退化情况。</li>
                <li><strong>近期常见惯性（10-16）：</strong>看到 <code>ln x</code> 和 <code>eˣ</code> 同时出现时容易硬求反函数，需要提醒先整体代换。</li>
              </ul>
            </div>

            <div class="wf-role-compare">
              <div class="wf-role-card wf-role-card--peer">
                <div class="wf-role-top">
                  ${renderPixelAvatar('companion-deepseek.png', 26)}
                  <div>
                    <div class="persona-roster-name">同桌盲测 · 大肥鱼</div>
                    <span class="wf-badge-inline">完全遮蔽答案 · 你讲透才算过</span>
                  </div>
                </div>
                <p class="wf-role-quote">“我这儿可没答案。你刚说 a &gt; 1 时左边一定有一个负根，可 x 往负无穷走的时候 eˣ 越来越小，你是怎么保证 f(x) 还会变回正数的？补一行给我看？”</p>
              </div>

              <div class="wf-role-card wf-role-card--teacher">
                <div class="wf-role-top">
                  ${renderPixelAvatar('teacher-shirakawa.png', 26)}
                  <div>
                    <div class="persona-roster-name">启发导师 · 白川 / 夜久</div>
                    <span class="wf-badge-inline wf-badge-inline--beta">记得你的习惯 · 在易滑步处先叫停</span>
                  </div>
                </div>
                <p class="wf-role-quote">“先停笔，上周你在例 4 硬解 ln x₀ + x₀ = 0 绕进死胡同了。今天看见 eˣ⁰ = a，别急着反求 x₀，先看看原来式子里的 eˣ⁰ 能不能直接换掉？”</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>

    <!-- Core Workflow 05: Honest Dual-Mode Spaced Review -->
    <article class="act-row" id="wf-review">
      <div class="act-copy">
        <div class="act-meta-line">
          <span class="act-num">05 · 分清真会与看懂的复习节奏</span>
          <span class="wf-tag">自己推通才升档 × 靠提示次日短复查</span>
        </div>
        <h3>“自己推出来”和“看提示才通”分开记账，不用虚假熟练度骗自己。</h3>
        <p>
          用一般背卡软件最容易掉进一个坑：扫过一眼提示才想起来，顺手点下“认识”，卡片一下推到半个月后，可真上闭卷考场照样两眼发白。Notara 确认复习时会如实核对作答方式：只有<strong>不看任何提示、独立走通关键步骤</strong>，复习间隔才会按 <code>1 → 3 → 7 → 16 → 35 天</code> 稳步拉长；只要中途借过提示或讲解，原有间隔一律冻结不虚增，<strong>安排明天做一次 1 天短复查</strong>，确认裸题再战也能直接动手才算数。
        </p>
        <p>
          反复卡壳的老问题不再机械地反复弹出折磨你，而是先暂停常规排期、帮你降难度拆成更小的铺垫步骤练顺；卡片攒多了以后，还能顺着每张卡记下的「下次探讨」线索把同类题放一块比较归类，学透同一条底层方法。
        </p>
      </div>
      <div class="act-specimen">
        <div class="specimen-window" data-review-demo>
          <div class="specimen-bar">
            <span style="font-weight:600;color:var(--pa-ink);">课堂复习确认卡 · 按真实完成方式排下次时间</span>
            <span style="font-size:11.5px;color:var(--pa-ink-muted);">点下面三种真实作答情况看排期变化</span>
          </div>
          <div class="specimen-body" style="display:flex;flex-direction:column;gap:11px;">
            <div class="wf-review-switcher" role="group" aria-label="选择本次复习完成方式">
              <button type="button" class="wf-rev-btn" data-rev-mode="independent" aria-pressed="true">没看提示，自己独立推完</button>
              <button type="button" class="wf-rev-btn" data-rev-mode="hint" aria-pressed="false">看了提示或拆步才想通</button>
              <button type="button" class="wf-rev-btn" data-rev-mode="leech" aria-pressed="false">反复在同一步卡壳，降难重拆</button>
            </div>

            <div class="wf-tracks-diagram">
              <div class="wf-track-lane is-highlighted" data-track-lane="a">
                <div class="wf-track-label">
                  <strong>主通道 · 无提示独立过关</strong>
                  <span>只有自己独自写对关键步才拉长间隔，并记入知识星图真实掌握</span>
                </div>
                <div class="wf-track-steps">
                  <span>1天</span><i>→</i><span>3天</span><i>→</i><strong class="wf-step-active">7天 (本次升档)</strong><i>→</i><span>16天</span><i>→</i><span>35天</span>
                </div>
              </div>

              <div class="wf-track-lane" data-track-lane="b">
                <div class="wf-track-label">
                  <strong>保底通道 · 靠提示走通</strong>
                  <span>看懂提示不等同于自己想得出，先原间隔不动，明天不看提示重试一次</span>
                </div>
                <div class="wf-track-steps">
                  <span>原间隔先冻结不虚增</span><i>→</i><strong class="wf-step-amber">明日 1 天短复查（裸题再试一次）</strong>
                </div>
              </div>
            </div>

            <div class="wf-review-receipt" data-rev-receipt>
              <div class="wf-receipt-head">
                <span data-rev-badge class="wf-pill wf-pill--done">自己走通 · 升至 7 天档</span>
                <code>目标卡片：导数隐零点代换-例4.md</code>
              </div>
              <p data-rev-audit><strong>本次作答核对：</strong>没有借用中途点拨或拆步填空，独立写出了 x₀eˣ⁰ = a 整体消元和单调区间判断。</p>
              <p data-rev-next class="wf-receipt-sub"><strong>下次探讨线索（延伸对比）：</strong>和上周《导数同构-例6》并排对比：同样碰到 ln x 与 eˣ，什么时候设隐零点、什么时候配同构？</p>
            </div>
          </div>
        </div>
      </div>
    </article>
  </div>`;
}

export function renderMarketPlaza({ inLibraryPage = false } = {}) {
  const actionHref = inLibraryPage ? '/guide/#download' : '/library/';
  const actionLabel = inLibraryPage ? '下载桌面版订阅公开源' : '前往市集与选书台';
  return `<div class="specimen-window market-plaza-window" data-market-demo>
    <div class="specimen-bar market-plaza-bar">
      <div class="market-brand-line">
        <span class="market-stamp">集</span>
        <strong>Notara 资源市集与学习社区</strong>
      </div>
      <div class="market-tabs" role="tablist" aria-label="资源市集与社区板块">
        <button type="button" role="tab" class="market-tab" data-market-tab="scout" aria-selected="true">助手替你筛好贴 · 规划</button>
        <button type="button" role="tab" class="market-tab" data-market-tab="connectors" aria-selected="false">公开追更课程源</button>
        <button type="button" role="tab" class="market-tab" data-market-tab="packs" aria-selected="false">跨学科拓展包</button>
        <button type="button" role="tab" class="market-tab" data-market-tab="publish" aria-selected="false">学法与净本分享</button>
      </div>
    </div>

    <div class="specimen-body market-plaza-body">
      <!-- Tab 0 (Default): Assistant Scout & Learning Community (Roadmap) -->
      <div class="market-panel" data-market-panel="scout">
        <div class="market-scout-layout">
          <div class="market-scout-digest">
            <div class="market-scout-head">
              <div class="market-scout-who">
                ${renderPixelAvatar('notara-coordinator.png', 24)}
                <strong>星野 · 社区定时巡站简报</strong>
              </div>
              <span class="wf-pill wf-pill--warm">路线图规划中 · 后台静默收件不打断课堂</span>
            </div>
            <p class="market-scout-intro">
              “昨晚趁你休息，按你的授权看完了 <code>#新高考导数</code> 和 <code>#线性代数微件</code> 讨论区（自动跳过 38 条只顾着焦虑宣泄的水帖），挑出两件正好接上你本周进度的好资料：”
            </p>

            <div class="market-scout-items">
              <div class="market-scout-item">
                <div class="market-scout-item-top">
                  <span class="wf-pill wf-pill--done">互动小教具 · 点开就能摆弄参数</span>
                  <span class="market-cadence">衔接明日导读：特征值与二次型</span>
                </div>
                <h4>学长刚分享了《二次型椭圆主轴旋转探针.html》</h4>
                <p>里面带着直观动手微件和一张反例卡，拖动参数就能看清正交变换是怎么转出主轴的，明天聊这节时可以直接调出来给你直观感受。</p>
              </div>

              <div class="market-scout-item">
                <div class="market-scout-item-top">
                  <span class="wf-pill wf-pill--done">考后 24 小时新题跟踪 · 贴合你的卡点</span>
                  <span class="market-cadence">恰好对应你上周卡住的隐零点</span>
                </div>
                <h4>《函数、导数与放缩》推送 v1.2 十月联考 T21 变式补充包</h4>
                <p>课程源刚加了今年联考压轴第二问的隐零点整体消元变式；对照后发现和上周你卡住的例 4 是同一个套路，可以一键加进本地图谱，而且原封不动留着你自己写过的笔记。</p>
              </div>
            </div>
          </div>

          <div class="market-scout-pillars">
            <div class="market-scout-point">
              <span class="pedagogy-stage-idx">01 · 天然防焦虑滤网</span>
              <h4>挡掉考前吓人的水帖，只留下真能动手算的好题</h4>
              <p>普通论坛一翻全是“今年太难完蛋了”的情绪帖。让带着你当前进度的学习助手去替你筛，标题党不起作用，也不用为了找几道新题平白把心态看崩。</p>
            </div>

            <div class="market-scout-point">
              <span class="pedagogy-stage-idx">02 · 老师与同学们的公开手工作坊</span>
              <h4>别人做好玩的互动图解和解题包，顺手就能收进书桌</h4>
              <p>社区里分享的小互动页、精妙反例或者顺手的讲解包，既适合你自己直接点开看，也能让书房助手读懂后拿来给你讲题用。</p>
            </div>

            <div class="market-scout-point">
              <span class="pedagogy-stage-idx">03 · 严守电脑里的隐私边界</span>
              <h4>悄悄帮你看新帖，要往外发一定先给你把关</h4>
              <p>助手去读公开论坛时碰不到你的私人文件，也不会乱弹窗打断你；如果想把整理好的资料发给别人，一定会在本地先清掉私人笔记，由你逐项看清确认再导出。</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tab 1: Open Curated Feeds -->
      <div class="market-panel" data-market-panel="connectors" hidden>
        <div class="market-feed-grid">
          <article class="market-feed-card" data-tone="indigo">
            <div class="market-feed-top">
              <span class="wf-pill wf-pill--done">高中 · 数学 / 物理 / 化学</span>
              <span class="market-cadence">每月补充新真题与变式</span>
            </div>
            <h4>新高考理科重难点月更源</h4>
            <p>持续收录各地名校联考导数放缩、电磁感应双杆微元、圆锥曲线定比点差与水溶液三大守恒题包；课程包追更时会直接合进本地图谱，原来写过的「我的理解」与复习时间完全不动。</p>
            <div class="market-feed-foot">
              <span>维护：华东重难点教研联盟</span>
              <code>追更新题不盖原笔记</code>
            </div>
          </article>

          <article class="market-feed-card" data-tone="walnut">
            <div class="market-feed-top">
              <span class="wf-pill wf-pill--done">大学 · CS:APP / OS / 算法</span>
              <span class="market-cadence">随实验勘误持续更新</span>
            </div>
            <h4>高校计算机与电子系统实验源</h4>
            <p>配套本地 C11 / Python 动手实验、字节探针、虚拟内存页表和动态规划网格微件，可以一边改代码跑测试，一边讲给看不见答案的盲测同桌听，理清每一步状态转移。</p>
            <div class="market-feed-foot">
              <span>维护：CS Systems Study Club</span>
              <code>含动手小实验</code>
            </div>
          </article>

          <article class="market-feed-card" data-tone="terracotta">
            <div class="market-feed-top">
              <span class="wf-pill wf-pill--done">大学 &amp; 进阶 · 数理 / 经管</span>
              <span class="market-cadence">按期中期末双周补充</span>
            </div>
            <h4>大学基础课与跨专业搭桥工坊</h4>
            <p>涵盖数学分析、线性代数、概率统计与宏微观经济核心模型，用二维小例子和反例库帮严格证明搭好台阶，专治大一高数和专业课“听懂老师板书却还是下不了笔”。</p>
            <div class="market-feed-foot">
              <span>维护：BaseBridge 学长工作坊</span>
              <code>几何直觉 × 反例集</code>
            </div>
          </article>
        </div>

        <div class="market-subscribe-bar">
          <div class="market-sub-copy">
            <strong>公网公开课程源已经可以试用：</strong>
            <span>桌面端已默认自带免费开放地址 <code>https://packs.oh-my-student.com/public/feeds/open-labs/catalog.json</code>，免注册就能先试玩「代码视频」互动微课并添回自己的书桌。</span>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap;flex:none;">
            <a class="pa-sdoc-secondary-btn" href="/code-video/" style="text-decoration:none;flex:none;">
              <span>在线试玩 20 KB 代码视频</span>
              ${icons.arrowRight}
            </a>
            <a class="pa-sdoc-ghost-btn pa-sdoc-ghost-btn--bordered" href="${actionHref}" style="text-decoration:none;flex:none;">
              <span>${actionLabel}</span>
            </a>
          </div>
        </div>
      </div>

      <!-- Tab 2: Cross-Subject Expansion Packs & Micro-Labs -->
      <div class="market-panel" data-market-panel="packs" hidden>
        <div class="market-pack-grid">
          <div class="market-pack-card">
            <div class="market-pack-meta">高中物理 · 力学与电磁综合</div>
            <h4>电磁感应双杆模型与动量守恒边界</h4>
            <p>内置不等距轨道和等距轨道对比白板、安培力冲量微元推导卡，还有能动手拖动的速变曲线小工具。</p>
          </div>
          <div class="market-pack-card">
            <div class="market-pack-meta">化学 · 有机与反应原理</div>
            <h4>有机合成路线倒推与官能团保护</h4>
            <p>用合成路线白板把断键位点判断、反应条件挑剔点和容易搞混的跨步推导连成一串。</p>
          </div>
          <div class="market-pack-card">
            <div class="market-pack-meta">大学数学 · 概率论与数理统计</div>
            <h4>贝叶斯更新、似然直观与两类错误</h4>
            <p>带上动手拖动分布小工具，一口气弄懂条件概率错觉、极大似然想法和假设检验的边界。</p>
          </div>
          <div class="market-pack-card">
            <div class="market-pack-meta">计算机 · 操作系统内核基础</div>
            <h4>虚拟内存多级页表与缺页中断探针</h4>
            <p>能一步步点着看虚拟地址拆段、TLB 命中经过与经典的页面置换反例（Belady 异常演示）。</p>
          </div>
        </div>
      </div>

      <!-- Tab 3: Study Methods Workshop & Clean-Copy Publishing -->
      <div class="market-panel" data-market-panel="publish" hidden>
        <div class="market-publish-grid">
          <div class="market-publish-card">
            <span class="wf-pill wf-pill--done">按需装载 · 权限严格隔开</span>
            <h4>学习方法包与同桌 / 老师角色卡</h4>
            <p>不管需要考后整卷复盘、考前 30 分钟抢救筛漏、跨学科拆题套路，还是合你脾气的同桌与导师档案，都可以从市集按需挑着用。资料包与脚本分开检查管理，下载下来绝对不会自己偷跑外部代码。</p>
          </div>
          <div class="market-publish-card">
            <span class="wf-pill wf-pill--warm">预览确认 · 自动清除私人记录</span>
            <h4>把你打磨好的笔记一键导出成「净本」送给别人</h4>
            <p>期末考完啃下一门硬课后，可以把你整理顺了的知识图谱、章节导读和白板直接打包送给学弟学妹或传到市集。系统会自动抹去你私密的个人理解、日记与复习记录，给你逐项看一眼点同意再生成公开文件包。</p>
          </div>
        </div>
      </div>
    </div>
  </div>`;
}

export function renderHubOverviewShell({ learningSets, embedMode = false, primaryHeadingTag = 'h2' }) {
  const filters = [
    ['all', '全部', learningSets.length],
    ['高中', '高中专题', learningSets.filter((s) => s.stage === '高中').length],
    ['大学', '大学基础课', learningSets.filter((s) => s.stage === '大学').length],
    ['数学', '数学', learningSets.filter((s) => s.subject === '数学').length],
    ['计算机', '计算机', learningSets.filter((s) => s.subject === '计算机').length],
    ['理化与语言', '理化与语言', learningSets.filter((s) => s.subject === '化学' || s.subject === '英语').length],
    ['自学方法', '自学方法', learningSets.filter((s) => s.subject === '自学方法').length],
  ];

  const catalogCardsHtml = learningSets
    .map(
      (item) => `<article
        class="pa-global-cat-card"
        id="set-${esc(item.id)}"
        data-cloth="${esc(item.cloth)}"
        data-catalog-item
        data-stage="${esc(item.stage)}"
        data-subject="${esc(item.subject)}"
        style="padding:16px 18px;border-radius:11px;border:1px solid var(--pa-border);background:var(--pa-bg-surface);display:flex;flex-direction:column;gap:8px;"
      >
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <div style="display:flex;align-items:center;gap:6px;font-size:11.5px;color:var(--pa-accent-ink);font-weight:600;">
            <span>${esc(item.vol)}</span>
            <span>·</span>
            <span>${esc(item.stage)}</span>
            <span>·</span>
            <span>${esc(item.subject)}</span>
          </div>
          <span style="font-size:11.5px;color:var(--pa-ink-muted);">开箱试读样卷</span>
        </div>
        <h3 style="margin:0;font-family:var(--pa-font-reading);font-size:16px;font-weight:600;color:var(--pa-ink);">${esc(item.title)}</h3>
        <p style="margin:0;font-size:13px;line-height:1.68;color:var(--pa-ink-secondary);">${esc(item.summary)}</p>
        <p style="margin:2px 0 0;padding-left:9px;border-left:2px solid color-mix(in srgb,var(--pa-accent) 45%,transparent);font-size:12.5px;line-height:1.6;color:var(--pa-ink);">${esc(item.mirrorPoint)}</p>
        <div style="margin-top:auto;padding-top:8px;border-top:1px solid var(--pa-border);display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:12px;">
          <span style="color:var(--pa-ink-muted);">${esc(item.structure)}</span>
          <a href="${esc(item.sampleHref)}" class="pa-sdoc-secondary-btn" style="text-decoration:none;">
            <span>${esc(item.sampleAction)}</span>
            ${icons.arrowRight}
          </a>
        </div>
      </article>`
    )
    .join('');

  return `<div class="pa-shell" data-rightbar="full" ${embedMode ? '' : 'data-catalog-root'}>
    ${renderLeftRail({ activeVaultId: '', hubActive: true, embedMode })}
    <div class="pa-stage">
      <section class="pa-rightbar pa-global-overview-pane" style="flex:1 1 100%;width:100%;">
        <header class="pa-rightbar-header pa-hub-header" style="justify-content:space-between;">
          <div style="display:flex;align-items:center;gap:10px;min-width:0;">
            <${primaryHeadingTag} class="pa-global-pane-title" style="margin:0;">私人书房 · 资源市集与开箱样卷</${primaryHeadingTag}>
            <span class="pa-hub-header-sub">桌面端支持订阅免费公开课程市集 · 下方随包样卷打开网页免登录就能直接试课</span>
          </div>
          <div style="display:flex;align-items:center;gap:8px;flex:none;">
            <a href="/first-lesson/" class="pa-chip-btn">快速试一课</a>
            <a href="/guide/#download" class="pa-chip-btn">下载桌面版接入完整市集</a>
          </div>
        </header>

        <div class="pa-global-overview-scroll" style="flex:1;overflow-y:auto;padding:18px 22px 32px;">
          <div class="pa-hub-stage-inner" style="max-width:1060px;margin:0 auto;display:flex;flex-direction:column;gap:24px;">
            <div class="pa-hub-concierge-bar" style="display:flex;align-items:center;gap:10px;padding:9px 14px;border-radius:12px;border:1px solid var(--pa-border-strong);background:var(--pa-bg-surface);">
              ${renderPixelAvatar('notara-coordinator.png', 28)}
              <span style="font-size:13.5px;color:var(--pa-ink-secondary);flex:1;">星野助教：书架上是随安装包内置的起步样卷（点击可直接在线试课）；在桌面客户端中，还可一键订阅高校实验源、教研月更包或拖入你自己的教材。</span>
            </div>

            ${embedMode ? '' : renderMarketPlaza({ inLibraryPage: true })}

            <section class="pa-global-section pa-bookshelf-section">
              <div class="pa-global-section-head" style="margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;">
                <span class="pa-hub-sec-heading">随包内置起步样卷 · 网页端即点即试 (${learningSets.length})</span>
                <span style="font-size:12px;color:var(--pa-ink-muted);">点击任意书封直接推门进入实景课堂</span>
              </div>
              ${renderClothBookshelf(learningSets)}
            </section>

            ${
              embedMode
                ? ''
                : `<section class="pa-global-section pa-bookshop-section">
                    <div class="pa-global-section-head" style="margin-bottom:10px;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;">
                      <span class="pa-hub-sec-heading" data-catalog-count>在线实景试读目录 · 开箱内置样卷（共显示 ${learningSets.length} 套）</span>
                    </div>

                    <div class="pa-global-filter-bar" style="margin-bottom:14px;">
                      <div class="pa-global-search-box">
                        ${icons.search}
                        <input
                          type="search"
                          class="pa-global-search-input"
                          placeholder="搜索导数、极限、指针、线性代数、动态规划…"
                          aria-label="搜索在线试读样卷"
                          data-catalog-search
                        >
                      </div>
                      <div class="pa-global-filter-pills" role="group" aria-label="按学段与学科筛选">
                        ${filters
                          .map(
                            ([val, label, count], idx) => `<button
                              type="button"
                              class="pa-global-filter-pill"
                              data-filter="${esc(val)}"
                              ${idx === 0 ? 'data-active="true"' : ''}
                              aria-pressed="${idx === 0 ? 'true' : 'false'}"
                            >
                              <span>${esc(label)}</span>
                              <span class="pa-global-pill-count">${count}</span>
                            </button>`
                          )
                          .join('')}
                      </div>
                    </div>

                    <div class="pa-global-catalog-grid">
                      ${catalogCardsHtml}
                    </div>

                    <div data-catalog-empty hidden style="padding:36px 0;text-align:center;color:var(--pa-ink-secondary);">
                      <p style="margin:0 0 10px;">没有找到匹配的在线试读样卷。</p>
                      <button type="button" class="pa-sdoc-secondary-btn" data-catalog-clear>清除筛选</button>
                    </div>
                  </section>`
            }
          </div>
        </div>
      </section>
    </div>
  </div>`;
}

export function renderOpenLetters({ standalone = false } = {}) {
  const hsLetterHtml = `
    <article class="letter-sheet" id="high-school" ${standalone ? '' : 'data-letter-panel="hs"'}>
      <header class="letter-sheet-head">
        <div class="letter-stamp-line">
          <span class="letter-seal">壹</span>
          <span class="letter-kicker">如果你是中学生</span>
        </div>
        <h3>大考不是一场比拼谁更能忍受痛苦的耐力赛。</h3>
      </header>

      <div class="letter-prose">
        <p class="letter-salutation">展信佳：</p>
        <p>
          如果你每天天没亮就坐进教室，夜深了还在台灯下刷着收上去也未必讲评的卷子；如果你常常困在“上课好像听懂了，一换题又无从下笔”的怪圈里，甚至开始怀疑是不是自己天生不够聪明——这间书房最初动念时，想到的就是此刻坐在桌前的你。
        </p>
        <p>
          我们想先和你把一件事聊透：<strong>升学考试从来不统计你熬了多少个深夜，也不为自我感动的疲惫额外加一分；它只看你坐上考场时，那些知识有没有真正长进你的脑子里。</strong>一间教室坐着五十个人，老师只能按统一进度往前赶。你可能只是在周二那节课的第十五分钟漏掉了一个前置概念，后面听得一知半解，雪球才越滚越大；也可能鼓起勇气想去办公室问一道题，却因为怕听见那句“上课怎么没认真听”而把卷子又默默塞回了书包。跟不上整齐划一的流水线，从来不说明你笨，只说明你缺一张能让你按自己的步调、从容把缺口补齐的书桌。
        </p>
        <p>
          我们从不主张故作清高地否定分数。恰恰相反，正因为那张录取通知书能为未来的你换来更开阔的选择权与试错空间，我们才更不希望你把宝贵的心气耗死在低效的机械刷题里。在这间书房里，你可以问任何“显得很基础”的问题，不必看谁的脸色；没听过的概念就先从头讲透，卡在半路时有人顺着你的草稿点拨半步，觉得学会了，再合上答案讲给同桌听一遍——到底懂没懂，自己心里立刻有数。
        </p>
        <p>
          愿你用更清醒、更少内耗的方式打赢这场仗——<strong>更重要的是，把从无谓消耗里省下来的睡眠、精力与好奇心，还给你热爱的社团、聊得来的挚友，和本该热气腾腾的中学时代。</strong>
        </p>
      </div>

      <footer class="letter-foot">
        <div class="letter-sign">—— Notara 书房开发者（一位走过这段路不久的计算机系学长）</div>
        <div class="letter-actions">
          <a class="pa-sdoc-secondary-btn" href="/lessons/derivative-tangent/" style="text-decoration:none;">
            <span>去试一节高中导数实景课</span>
            ${icons.arrowRight}
          </a>
          ${
            standalone
              ? ''
              : `<a class="btn-quiet" href="/letters/#high-school" style="font-size:12.5px;">独立信笺页全文分享 ↗</a>`
          }
        </div>
      </footer>
    </article>`;

  const uniLetterHtml = `
    <article class="letter-sheet" id="undergrad" ${standalone ? '' : 'data-letter-panel="uni" hidden'}>
      <header class="letter-sheet-head">
        <div class="letter-stamp-line">
          <span class="letter-seal">贰</span>
          <span class="letter-kicker">如果你是大学生</span>
        </div>
        <h3>推开大学校门之后，真正的自学旷野才向你展开。</h3>
      </header>

      <div class="letter-prose">
        <p class="letter-salutation">展信佳：</p>
        <p>
          很多人直到大一深秋的某个傍晚，才第一次尝到大学独有的失重感：曾经以为跨过高考就会走进循循善诱的殿堂，现实却是两节课翻完八十页多年未改的课件，黑板上潦草写下一行“由定义易证”，下课铃一响老师匆匆回实验室，留你一个人对着满纸 ${renderTex('\\varepsilon\\text{-}\\delta')} 的《数学分析》、抽象的矩阵空间，或是满屏段错误的系统实验发呆。没人再按天收你的作业，也没人再替你画重点，直到期末周靠通宵背往年卷惊险过关，考完三天便忘得干干净净。
        </p>
        <p>
          大模型能十秒写完实验代码、秒解标准套路题，另一种更隐蔽的危机也随之而来：<strong>把思考外包出去变得太容易了。</strong>把作业直接丢给 AI 固然换来一时轻松，可一旦跳过亲手推演与踩坑的过程——不懂指针在内存里怎么步进，不懂特征值在几何上究竟拉伸了什么——你就连辨别 AI 是否在胡说八道的标尺也一并交了出去。但机会同样前所未有：名校课堂的围墙正在消融，只要有一套顺手的自学方法，能把原版教材、讲义和代码真正啃进脑子里，你在宿舍书桌前就能获得不输顶尖课堂的训练密度。
        </p>
        <p>
          这正是我们打磨 Notara 的初衷。把晦涩的教材 PDF、公开课讲义和源码拖进书房，让后台工作员替你分担繁琐的拆解与检索；遇到天书般的公理，先用二维几何特例把直觉立住，再在 <code>.canvas</code> 白板上把复杂证明的各条分支摊开比对。期末攒下的每一张卡片都会融进你的个人知识图谱，跨学期持续生长，还能一键剥离个人记录，打包留给下一届学弟学妹。
        </p>
        <p>
          大学四年最珍贵的复利，从来不在绩点排名的毫厘之间，而在于<strong>当你面对任何一个没人教过的陌生领域时，都有底气推门进去，靠自己把它学穿。</strong>
        </p>
      </div>

      <footer class="letter-foot">
        <div class="letter-sign">—— Notara 书房开发者</div>
        <div class="letter-actions">
          <a class="pa-sdoc-secondary-btn" href="/first-lesson/" style="text-decoration:none;">
            <span>去试一节计算机指针与内存实验课</span>
            ${icons.arrowRight}
          </a>
          ${
            standalone
              ? ''
              : `<a class="btn-quiet" href="/letters/#undergrad" style="font-size:12.5px;">独立信笺页全文分享 ↗</a>`
          }
        </div>
      </footer>
    </article>`;

  const lifelongLetterHtml = `
    <article class="letter-sheet" id="lifelong" ${standalone ? '' : 'data-letter-panel="lifelong" hidden'}>
      <header class="letter-sheet-head">
        <div class="letter-stamp-line">
          <span class="letter-seal">叁</span>
          <span class="letter-kicker">如果你是终身学习者</span>
        </div>
        <h3>当算力接管了多数结果，追索 Know-how 仍是人类的自我完满。</h3>
      </header>

      <div class="letter-prose">
        <p class="letter-salutation">展信佳：</p>
        <p>
          坦白讲，写这封信的时候，其实有一个问题我自己也还没完全想透：身处计算机行业的一线，亲眼看着大模型在短短一两年间从只能写几行辅助脚本，走到能接管日常大半工程与研究工作，我也常常在深夜发怔——<strong>在这个时代，倘若不再为了应付一张考卷或换取某种技能溢价，人类费尽心力把一门硬知识学进自己脑子里，究竟还有没有必要？</strong>
        </p>
        <p>
          如果只按“投入产出比”算一笔功利账，苦苦自学的性价比确实在肉眼可见地滑坡。把论文、专著或源码丢进黑盒，十秒钟就能换回一份工整的摘要和现成方案。可每当这样直接拿走结果，心底总会泛起一丝微妙的空落——就像住进一座由神明代建的宫殿，按下开关就有光亮，自己却对墙里的电路与梁柱一无所知。只占有现成的结论（<code>Know-what</code>），我们在奇迹面前终究只是被投喂的局外人；唯有真正摸清一件事物何以如此、亲手在脑海里把因果链条走通（<code>Know-how</code>），原本隔着迷雾的未知才真正化作你生命里的一部分。
        </p>
        <p>
          我越来越觉得，<strong>习得 Know-how 本身，就是一种人类的自我完满。</strong>就像汽车早已普及，人们依然会系紧鞋带去奔跑与登山；AlphaGo 早已不可战胜，棋手们依然会在棋盘前复盘长考。更何况，当 AI 替我们接过了繁重的重复劳作、推平了跨学科的术语高墙，有限的血肉之躯反而第一次有机会在短短一生里，去叩开数学、物理、计算机、历史或哲学这些原本无缘企及的大门，尝到零散念头在脑海里“咔哒”一声严丝合缝咬合时的通透。
        </p>
        <p>
          这间安静的桌面书房，就是留给依然不愿放弃这种“完满”的同路人的。没有排行榜，也没有断签清零的红点；哪怕你工作繁忙、隔了半个月才在深夜推门坐下，上次停笔处留下的那个问题依然等在原处。<strong>愿我们不必再做工具的附庸，永远保有一双看穿黑盒的眼睛。</strong>
        </p>
      </div>

      <footer class="letter-foot">
        <div class="letter-sign">—— Notara 书房开发者</div>
        <div class="letter-actions">
          <a class="pa-sdoc-secondary-btn" href="/lessons/restart-note/" style="text-decoration:none;">
            <span>去试一节跨周五秒续接实景课</span>
            ${icons.arrowRight}
          </a>
          ${
            standalone
              ? ''
              : `<a class="btn-quiet" href="/letters/#lifelong" style="font-size:12.5px;">独立信笺页全文分享 ↗</a>`
          }
        </div>
      </footer>
    </article>`;

  if (standalone) {
    return `<div class="letters-standalone-stack">
      ${hsLetterHtml}
      ${uniLetterHtml}
      ${lifelongLetterHtml}
    </div>`;
  }

  return `<div class="letters-folio" data-letters-demo>
    <div class="letters-tabbar" role="tablist" aria-label="切换三封公开信">
      <button type="button" role="tab" class="letter-tab" data-letter-tab="hs" aria-selected="true">
        <span class="letter-tab-tag">信笺 01</span>
        <strong>如果你是中学生</strong>
      </button>
      <button type="button" role="tab" class="letter-tab" data-letter-tab="uni" aria-selected="false">
        <span class="letter-tab-tag">信笺 02</span>
        <strong>如果你是大学生</strong>
      </button>
      <button type="button" role="tab" class="letter-tab" data-letter-tab="lifelong" aria-selected="false">
        <span class="letter-tab-tag">信笺 03</span>
        <strong>如果你是终身学习者</strong>
      </button>
    </div>
    ${hsLetterHtml}
    ${uniLetterHtml}
    ${lifelongLetterHtml}
  </div>`;
}


