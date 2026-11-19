// Static Open Market Feed builder for Notara Portal & Alibaba Cloud ESA Pages.
// Generates standard `.notara-pack.json` bundles and `catalog.json` feeds that
// Notara Desktop's `remote_json` connector can subscribe to, preview, provision,
// and three-way merge without any backend server.
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

export const OPEN_LABS_FEED_URL = 'https://learn.oh-my-student.com/feeds/open-labs/catalog.json';
export const HS_MATH_FEED_URL = 'https://learn.oh-my-student.com/feeds/hs-math/catalog.json';
export const UNI_MATH_FEED_URL = 'https://learn.oh-my-student.com/feeds/uni-math/catalog.json';

export const OPEN_LABS_PACK_DEFS = Object.freeze([
  Object.freeze({
    id: 'code-video-secant-to-tangent',
    version: '1.0.0',
    updatedAt: '2026-11-19',
    updateCadence: '公开示范源 · 随微课脚本持续迭代',
    subjectKey: 'hs-derivative',
    title: '代码微课 · 割线逼近切线与凹凸失效边界',
    stage: '拓展包',
    subject: '高中 / 大学数学 · 导数与极限',
    entryPath: '00-代码微课-切线与凹凸边界导读.md',
    description:
      '仅约 20 KB 的 60fps 矢量交互代码视频微课：播放割线逼近切线、eˣ 单侧界与 t³ 拐点反例，随时按暂停拖动间距 h 验证并一键带帧向 AI 老师提问。',
    prerequisites: ['基本函数图像与直线斜率公式'],
    chapters: [
      '第 1–2 幕：割线差商与 h 趋近 0 的极限本质',
      '第 3–4 幕：eˣ 凹凸托底与三次函数拐点穿切线反例',
    ],
    tags: ['公开开源', '代码视频', '切线放缩', '交互微课', '零覆盖 Merge'],
    recommendedClub: {
      defaultTeacherKey: 'teacher-shirakawa',
      defaultCompanionPreset: 'companion-deepseek',
    },
    accessTier: 'free',
    creditCost: 0,
    priceCny: 0,
    requiresAccount: false,
    demoHtmlRelPath: '可视化/切线逼近代码视频.html',
    demoSlug: 'secant-to-tangent',
    changelog: [
      {
        version: '1.0.0',
        date: '2026-11-19',
        tag: '首个公开代码视频微课',
        highlights: [
          '内置 4 幕 48 秒矢量代码视频（60fps Canvas 渲染、倍速与分幕跳转、暂停即接管参数）。',
          '附完整文字分镜稿、反例卡片与原生 JSON Canvas 1.0 推演白板，AI 导师可直接读懂每一幕内容。',
        ],
      },
    ],
  }),
  Object.freeze({
    id: 'code-video-eigen-geometry',
    version: '1.0.0',
    updatedAt: '2026-11-19',
    updateCadence: '公开示范源 · 随微课脚本持续迭代',
    subjectKey: 'uni-linalg',
    title: '代码微课 · 特征值拉伸与二次型几何直觉',
    stage: '拓展包',
    subject: '大学数学 · 线性代数',
    entryPath: '00-代码微课-特征值几何导读.md',
    description:
      '矢量代码视频直观演示矩阵把单位圆压成椭圆、实对称正交特征轴，以及非对称矩阵“全正特征值却不定”的反例；暂停即可拖动向量角度 θ 实时观察 vᵀAv。',
    prerequisites: ['2×2 矩阵与向量乘法、向量内积与夹角'],
    chapters: [
      '第 1–2 幕：单位圆变换与方向不变的特征轴',
      '第 3–4 幕：实对称正交正定 vs 非对称上三角不定陷阱',
    ],
    tags: ['公开开源', '代码视频', '线性代数', '特征值', '二次型'],
    recommendedClub: {
      defaultTeacherKey: 'teacher-demon',
      defaultCompanionPreset: 'companion-gpt',
    },
    accessTier: 'free',
    creditCost: 0,
    priceCny: 0,
    requiresAccount: false,
    demoHtmlRelPath: '可视化/特征值几何代码视频.html',
    demoSlug: 'eigen-geometry',
    changelog: [
      {
        version: '1.0.0',
        date: '2026-11-19',
        tag: '首个公开代码视频微课',
        highlights: [
          '内置 4 幕 48 秒线性代数几何代码视频，实时画出单位圆、像椭圆、特征轴与负二次型扇区。',
          '附概念卡、非对称矩阵反例卡与 JSON Canvas 白板，支持一键无损并入现有线代学习集。',
        ],
      },
    ],
  }),
]);

async function collectFilesRecursive(rootDir, currentDir = rootDir, acc = []) {
  const entries = await readdir(currentDir, { withFileTypes: true });
  entries.sort((a, b) => a.name.localeCompare(b.name));
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue;
    const abs = join(currentDir, entry.name);
    if (entry.isDirectory()) {
      await collectFilesRecursive(rootDir, abs, acc);
    } else if (entry.isFile()) {
      const relPath = relative(rootDir, abs).replace(/\\/g, '/');
      const buf = await readFile(abs);
      const ext = extname(entry.name).toLowerCase();
      const isText = ['.md', '.canvas', '.html', '.svg', '.json', '.txt', '.css', '.js', '.mjs'].includes(ext);
      acc.push({
        path: relPath,
        encoding: isText ? 'utf8' : 'base64',
        content: isText ? buf.toString('utf8') : buf.toString('base64'),
        sha256: createHash('sha256').update(buf).digest('hex'),
      });
    }
  }
  return acc;
}

export async function buildStaticOpenFeeds({ rootDir, distDir }) {
  const feedsSrcDir = join(rootDir, 'feeds-src', 'open-labs');
  const feedOutDir = join(distDir, 'feeds', 'open-labs');
  const bundlesOutDir = join(feedOutDir, 'bundles');
  const demosOutDir = join(distDir, 'code-video', 'demos');

  await mkdir(bundlesOutDir, { recursive: true });
  await mkdir(demosOutDir, { recursive: true });

  const catalogItems = [];

  for (const def of OPEN_LABS_PACK_DEFS) {
    const packDir = join(feedsSrcDir, def.id);
    const files = await collectFilesRecursive(packDir);

    let markdownCount = 0;
    let cardCount = 0;
    let codeCount = 0;
    for (const f of files) {
      if (f.path.endsWith('.md')) {
        markdownCount += 1;
        if (f.path.startsWith('卡片/') || f.path.includes('/卡片/')) cardCount += 1;
      } else if (f.path.endsWith('.html')) {
        codeCount += 1;
      }
    }

    const bundle = {
      format: 'notara-course-pack/v1',
      id: def.id,
      version: def.version,
      subjectKey: def.subjectKey,
      entryPath: def.entryPath,
      title: def.title,
      description: def.description,
      subject: def.subject,
      stage: def.stage,
      prerequisites: def.prerequisites,
      chapters: def.chapters,
      tags: def.tags,
      recommendedClub: def.recommendedClub,
      updatedAt: def.updatedAt,
      updateCadence: def.updateCadence,
      changelog: def.changelog,
      files,
    };

    const bundleFileName = `${def.id}.notara-pack.json`;
    const bundleJsonText = `${JSON.stringify(bundle, null, 2)}\n`;
    await writeFile(join(bundlesOutDir, bundleFileName), bundleJsonText, 'utf8');

    const demoFile = files.find((f) => f.path === def.demoHtmlRelPath);
    if (demoFile && demoFile.encoding === 'utf8') {
      await writeFile(join(demosOutDir, `${def.demoSlug}.html`), demoFile.content, 'utf8');
    }

    catalogItems.push({
      id: def.id,
      version: def.version,
      subjectKey: def.subjectKey,
      entryPath: def.entryPath,
      title: def.title,
      description: def.description,
      subject: def.subject,
      stage: def.stage,
      prerequisites: def.prerequisites,
      chapters: def.chapters,
      tags: def.tags,
      recommendedClub: def.recommendedClub,
      accessTier: def.accessTier,
      creditCost: def.creditCost,
      priceCny: def.priceCny,
      requiresAccount: def.requiresAccount,
      updatedAt: def.updatedAt,
      updateCadence: def.updateCadence,
      changelog: def.changelog,
      markdownCount,
      cardCount,
      codeCount,
      bundleUrl: `./bundles/${bundleFileName}`,
      bundleBytes: Buffer.byteLength(bundleJsonText, 'utf8'),
    });
  }

  const catalogPayload = {
    schemaVersion: 'notara-catalog/v1',
    id: 'notara-open-labs-feed',
    label: 'Notara 公开代码微课总源',
    author: 'Notara 官方公开教研站',
    description:
      '由阿里云 ESA Pages 公开托管的真实开放连接器总源：内置可随时暂停改参数的矢量「代码视频」微课包，免账号直接订阅、试读与无损合入桌面书房。',
    items: catalogItems,
  };
  await writeFile(join(feedOutDir, 'catalog.json'), `${JSON.stringify(catalogPayload, null, 2)}\n`, 'utf8');

  // Subject-focused static feeds pointing to the same canonical bundles via relative URLs
  const hsFeedDir = join(distDir, 'feeds', 'hs-math');
  const uniFeedDir = join(distDir, 'feeds', 'uni-math');
  await mkdir(hsFeedDir, { recursive: true });
  await mkdir(uniFeedDir, { recursive: true });

  const hsItems = catalogItems
    .filter((it) => it.id === 'code-video-secant-to-tangent')
    .map((it) => ({ ...it, bundleUrl: `../open-labs/bundles/${it.id}.notara-pack.json` }));
  const uniItems = catalogItems
    .filter((it) => it.id === 'code-video-eigen-geometry')
    .map((it) => ({ ...it, bundleUrl: `../open-labs/bundles/${it.id}.notara-pack.json` }));

  await writeFile(
    join(hsFeedDir, 'catalog.json'),
    `${JSON.stringify(
      {
        schemaVersion: 'notara-catalog/v1',
        id: 'notara-hs-math-feed',
        label: '高中导数与函数代码微课源',
        author: 'Notara 官方公开教研站',
        description: '聚焦高中导数极限、切线放缩与凹凸失效边界的公开代码视频微课源，支持免登录订阅与无损 Merge。',
        items: hsItems,
      },
      null,
      2
    )}\n`,
    'utf8'
  );
  await writeFile(
    join(uniFeedDir, 'catalog.json'),
    `${JSON.stringify(
      {
        schemaVersion: 'notara-catalog/v1',
        id: 'notara-uni-math-feed',
        label: '大学数理几何直观代码微课源',
        author: 'Notara 官方公开教研站',
        description: '用矢量交互代码视频与反例白板打通线性代数特征值与二次型正定边界，支持免登录订阅与无损 Merge。',
        items: uniItems,
      },
      null,
      2
    )}\n`,
    'utf8'
  );

  const communityDirectory = {
    ok: true,
    sources: [
      {
        id: 'notara-open-labs-feed',
        label: 'Notara 公开代码微课总源',
        author: 'Notara 官方公开教研站',
        stage: '高中 / 大学 · 拓展包',
        subject: '数学 / 线性代数 · 代码视频微课',
        updateCadence: '随公开微课脚本持续追更（免登录直连）',
        description:
          '真实公网托管的开放连接器总源：含《割线逼近切线与凹凸失效边界》《特征值拉伸与二次型几何直觉》两套矢量交互代码视频微课包，支持一键预览、建集与三路哈希无损追更。',
        catalogUrl: OPEN_LABS_FEED_URL,
        packCountHint: catalogItems.length,
        tags: ['真实公网源', '代码视频', '免登录', '零覆盖 Merge'],
      },
      {
        id: 'notara-hs-math-feed',
        label: '高中导数与函数代码微课源',
        author: 'Notara 官方公开教研站',
        stage: '高中',
        subject: '数学 · 导数与放缩边界',
        updateCadence: '按专题微课持续增补',
        description:
          '收录可随时暂停拖动间距 h 的割线逼近切线代码视频、三次函数拐点反例卡与 JSON Canvas 推演白板。',
        catalogUrl: HS_MATH_FEED_URL,
        packCountHint: hsItems.length,
        tags: ['高中数学', '代码视频', '切线放缩'],
      },
      {
        id: 'notara-uni-math-feed',
        label: '大学数理几何直观代码微课源',
        author: 'Notara 官方公开教研站',
        stage: '大学',
        subject: '线性代数 · 特征值与二次型',
        updateCadence: '按大学核心硬课专题增补',
        description:
          '收录单位圆压缩椭圆与非对称正定陷阱代码视频、对称化矩阵反例卡与白板，专治“只会算行列式却没有几何直觉”。',
        catalogUrl: UNI_MATH_FEED_URL,
        packCountHint: uniItems.length,
        tags: ['大学数学', '代码视频', '几何直观'],
      },
    ],
  };
  await writeFile(
    join(distDir, 'feeds', 'community-sources.json'),
    `${JSON.stringify(communityDirectory, null, 2)}\n`,
    'utf8'
  );

  return { catalogPayload, catalogItems, communityDirectory };
}
