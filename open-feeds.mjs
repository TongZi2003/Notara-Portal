// Static Open Market Feed builder for Notara Portal & Alibaba Cloud ESA Pages.
// Generates standard `.notara-pack.json` bundles and `catalog.json` feeds that
// Notara Desktop's `remote_json` connector can subscribe to, preview, provision,
// and three-way merge without any backend server.
import { createHash } from 'node:crypto';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';

export const OPEN_LABS_FEED_URL = 'https://packs.oh-my-student.com/public/feeds/open-labs/catalog.json';
export const HS_PHYSICS_FEED_URL = 'https://packs.oh-my-student.com/public/feeds/hs-physics/catalog.json';
export const HS_MATH_FEED_URL = 'https://packs.oh-my-student.com/public/feeds/hs-math/catalog.json';
export const UNI_MATH_FEED_URL = 'https://packs.oh-my-student.com/public/feeds/uni-math/catalog.json';

export const OPEN_LABS_PACK_DEFS = Object.freeze([
  Object.freeze({
    id: 'exam-video-magnetic-dynamic-circle',
    version: '1.0.0',
    updatedAt: '2026-11-19',
    updateCadence: '高考应试示范源 · 含阅卷采分板与押注断点',
    subjectKey: 'hs-physics-magnetic',
    title: '应试代码微课 · 高考物理有界磁场动态圆临界实战',
    stage: '高中',
    subject: '高中物理 · 磁场压轴（放缩圆 × 旋转圆）',
    entryPath: '00-代码微课-磁场动态圆应试导读.md',
    description:
      '硬核应试向 26 KB 矢量代码微课：动态扫屏放缩圆临界相切与旋转圆打击亮带，右侧实时同步高考阅卷 9 分采分板，并在“误写 2R=d”扣分陷阱处自动定格发起红笔押注。',
    prerequisites: ['左手定则判断洛伦兹力方向、圆周运动向心力公式 qvB = mv²/R'],
    chapters: [
      '第 1–2 幕：放缩圆圆心轨线、R(1+sin30°)=d 临界相切与红笔押注排雷',
      '第 3–4 幕：穿界运动时间腰斩跳变（240°→120°）与旋转圆右边界打击亮带',
    ],
    tags: ['高考应试', '代码视频', '高中物理', '磁场动态圆', '阅卷采分点'],
    recommendedClub: {
      defaultTeacherKey: 'teacher-demon',
      defaultCompanionPreset: 'companion-deepseek',
    },
    accessTier: 'free',
    creditCost: 0,
    priceCny: 0,
    requiresAccount: false,
    demoHtmlRelPath: '可视化/磁场动态圆应试代码视频.html',
    demoSlug: 'magnetic-dynamic-circle',
    demoHeight: 472,
    changelog: [
      {
        version: '1.0.0',
        date: '2026-11-19',
        tag: '首个高考硬核应试代码微课',
        highlights: [
          '左侧 60fps 放缩圆 / 旋转圆双模型矢量磁场画布，右侧实时同步高考 4 步阅卷采分板。',
          '内置第 18 秒临界相切强制「阅卷红笔押注」断点：点错 2R=d 当场画出 0.25d 缺口并红笔扣分演示。',
        ],
      },
    ],
  }),
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
  Object.freeze({
    id: 'code-video-elementary-functions',
    version: '1.0.0',
    updatedAt: '2026-11-19',
    updateCadence: '高中数学开放源 · 随专题反例持续增补',
    subjectKey: 'hs-elementary-functions',
    title: '代码微课 · 基本初等函数图像、对称与比大小',
    stage: '高中',
    subject: '高中数学 · 基本初等函数（指对幂 × 比大小）',
    entryPath: '00-导读-基本初等函数图像与比大小导读.md',
    description:
      '48 秒矢量交互代码微课：一镜看穿指对反函数镜像对称、幂函数第一象限“过一翻转”、a=1/16 指对交点裂出 3 根的高考经典反例，以及“0/1 隔断 → 中间桥 → 切线放缩”比大小三阶通法。',
    prerequisites: ['指数与对数的基本运算、一次与二次函数图像常识'],
    chapters: [
      '第 1–2 幕：指对反函数关于 y=x 镜面对称与幂函数 (1,1) 过一翻转',
      '第 3–4 幕：a=1/16 指对分裂 3 交点朱笔排雷与比大小三阶通法',
    ],
    tags: ['免费试用', '代码视频', '高中数学', '基本初等函数', '比大小', '反例'],
    recommendedClub: {
      defaultTeacherKey: 'teacher-shirakawa',
      defaultCompanionPreset: 'companion-deepseek',
    },
    accessTier: 'free',
    creditCost: 0,
    priceCny: 0,
    requiresAccount: false,
    demoHtmlRelPath: '可视化/基本初等函数代码视频.html',
    demoSlug: 'elementary-functions',
    demoHeight: 472,
    changelog: [
      {
        version: '1.0.0',
        date: '2026-11-19',
        tag: '高中数学基础核心试用集',
        highlights: [
          '内置 4 幕 48 秒宣纸交互代码微课，支持随时拖动底数 a（含临界 e^{-e} 与 e^{1/e}）与幂指 α。',
          '第 3 幕自带“a=1/16 指对交点裂为 3 根”朱笔押注断点，并配 4 张精选概念/方法/反例卡与 JSON Canvas 决策树白板。',
        ],
      },
    ],
  }),
  Object.freeze({
    id: 'hs-math-functions-mastery',
    version: '1.0.0',
    updatedAt: '2026-11-20',
    updateCadence: '高一数学开放源 · 按必修第一册专题整理',
    subjectKey: 'hs-math-functions',
    title: '高一数学 · 函数与基本初等函数中难题攻坚',
    stage: '高中',
    subject: '高中数学 · 必修第一册函数综合（19 讲 7 阶）',
    entryPath: '00-导读-高一函数与基本初等函数中难题攻坚导读.md',
    description:
      '面向高一必修第一册的函数中难题公开学习集，按 7 阶 19 讲编排 37 张概念方法与误区卡、16 道配宣纸分步演示的典型例题和 107 道分级练习（含 63 个可拖动参数或逐步构图的内嵌交互图），支持免登录订阅与无损合入本地书房。',
    prerequisites: ['集合与常用逻辑用语、一元二次方程与基本不等式、一次与二次函数基础图像'],
    chapters: [
      '第一至三阶（第 1–10 讲）：定义域值域、分段与动轴二次、单调奇偶对称与周期',
      '第四至七阶（第 11–19 讲）：幂指对运算图像比大小、分段嵌套零点、双量词与含参最值',
    ],
    tags: ['免费试用', '高中数学', '高一函数', '必修第一册', '参数图像', '零覆盖 Merge'],
    recommendedClub: {
      defaultTeacherKey: 'teacher-shirakawa',
      defaultCompanionPreset: 'companion-deepseek',
    },
    accessTier: 'free',
    creditCost: 0,
    priceCny: 0,
    requiresAccount: false,
    demoHtmlRelPath: '可视化/V01-第02讲例1-两个二次根式和与差的几何构造.html',
    demoSlug: 'hs-math-functions-mastery',
    demoHeight: 472,
    changelog: [
      {
        version: '1.0.0',
        date: '2026-11-20',
        tag: '高一函数中难题完整开放学习集',
        highlights: [
          '收录 7 阶分阶导读、37 张概念方法与易错辨析卡、2 张 JSON Canvas 结构白板与 123 道精选题卡。',
          '16 道例题配分步宣纸演示，63 道需借助图像或参数变化的练习内嵌极简参数滑块与构图微件，纯代数题保持干净文字推导。',
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
  const hsPhysicsFeedDir = join(distDir, 'feeds', 'hs-physics');
  const hsFeedDir = join(distDir, 'feeds', 'hs-math');
  const uniFeedDir = join(distDir, 'feeds', 'uni-math');
  await mkdir(hsPhysicsFeedDir, { recursive: true });
  await mkdir(hsFeedDir, { recursive: true });
  await mkdir(uniFeedDir, { recursive: true });

  const hsPhysicsItems = catalogItems
    .filter((it) => it.id === 'exam-video-magnetic-dynamic-circle')
    .map((it) => ({ ...it, bundleUrl: `../open-labs/bundles/${it.id}.notara-pack.json` }));
  const hsItems = catalogItems
    .filter(
      (it) =>
        it.id === 'code-video-secant-to-tangent' ||
        it.id === 'code-video-elementary-functions' ||
        it.id === 'hs-math-functions-mastery'
    )
    .map((it) => ({ ...it, bundleUrl: `../open-labs/bundles/${it.id}.notara-pack.json` }));
  const uniItems = catalogItems
    .filter((it) => it.id === 'code-video-eigen-geometry')
    .map((it) => ({ ...it, bundleUrl: `../open-labs/bundles/${it.id}.notara-pack.json` }));

  await writeFile(
    join(hsPhysicsFeedDir, 'catalog.json'),
    `${JSON.stringify(
      {
        schemaVersion: 'notara-catalog/v1',
        id: 'notara-hs-physics-feed',
        label: '高中物理压轴应试代码微课源',
        author: 'Notara 官方公开教研站',
        description: '聚焦高考物理磁场动态圆（放缩圆/旋转圆）、临界相切与阅卷采分点排雷的硬核应试代码视频微课源。',
        items: hsPhysicsItems,
      },
      null,
      2
    )}\n`,
    'utf8'
  );

  await writeFile(
    join(hsFeedDir, 'catalog.json'),
    `${JSON.stringify(
      {
        schemaVersion: 'notara-catalog/v1',
        id: 'notara-hs-math-feed',
        label: '高中导数与函数代码微课源',
        author: 'Notara 官方公开教研站',
        description: '收录高一函数中难题攻坚学习集、基本初等函数与导数切线公开微课，支持免登录订阅与无损 Merge。',
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
          '真实公网托管的开放连接器总源：内置高中物理《磁场动态圆》、高中数学《高一函数与基本初等函数中难题攻坚》《基本初等函数》《割线逼近切线》与大学线代《特征值几何》学习集与交互代码微课包，支持一键预览、建集与三路哈希无损追更。',
        catalogUrl: OPEN_LABS_FEED_URL,
        packCountHint: catalogItems.length,
        tags: ['真实公网源', '代码视频', '免登录', '零覆盖 Merge'],
      },
      {
        id: 'notara-hs-physics-feed',
        label: '高中物理压轴应试代码微课源',
        author: 'Notara 官方公开教研站',
        stage: '高中',
        subject: '物理 · 磁场动态圆与阅卷采分',
        updateCadence: '按高考高频压轴模型持续增补',
        description:
          '内置放缩圆与旋转圆双模型矢量动画、同步高考 9 分阅卷采分板与“2R=d 红笔押注”排雷断点。',
        catalogUrl: HS_PHYSICS_FEED_URL,
        packCountHint: hsPhysicsItems.length,
        tags: ['高考物理', '应试代码视频', '红笔押注'],
      },
      {
        id: 'notara-hs-math-feed',
        label: '高中数学 · 函数与导数代码微课源',
        author: 'Notara 官方公开教研站',
        stage: '高中',
        subject: '数学 · 基本初等函数 × 导数与放缩',
        updateCadence: '按专题微课持续增补',
        description:
          '收录《高一函数与基本初等函数中难题攻坚》《基本初等函数图像、对称与比大小》与《割线逼近切线》学习集及交互代码视频、题卡与 JSON Canvas 决策白板。',
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
