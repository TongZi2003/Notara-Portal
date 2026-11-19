// Architectural ink plates & mathematical diagrams for Notara's public pages.
// Palette strictly adheres to warm cotton paper & sepia/umber ink (zero green).

export const mark = `<svg class="brand-mark" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" fill="none">
  <rect x="2.25" y="2.75" width="15.5" height="14.5" rx="2" stroke="currentColor" stroke-width="1.3"/>
  <line x1="10" y1="2.75" x2="10" y2="17.25" stroke="currentColor" stroke-width="1.1" stroke-dasharray="1.8 1.6"/>
  <circle cx="6.3" cy="10" r="1.45" stroke="currentColor" stroke-width="1.2"/>
  <circle cx="13.7" cy="10" r="1.45" fill="currentColor"/>
</svg>`;

export function showcaseFigure(kind) {
  if (kind === 'tangent-boundary') {
    return `<svg class="canvas-svg" viewBox="0 0 520 176" role="img" aria-label="切线单侧成立与三次函数穿越切线反例对比图">
      <rect x="0.5" y="0.5" width="248" height="175" rx="6" fill="#fdfbf7" stroke="#dfd7c8"/>
      <text x="14" y="22" font-size="11" fill="#6c6358" font-family="ui-sans-serif, -apple-system, sans-serif">凸函数：y = eᵗ 与原点切线 y = 1 + t</text>
      <line x1="22" y1="142" x2="230" y2="142" stroke="#d8cfc0" stroke-width="1"/>
      <line x1="112" y1="34" x2="112" y2="158" stroke="#d8cfc0" stroke-width="1"/>
      <line x1="42" y1="150" x2="216" y2="54" stroke="#8c5a3c" stroke-width="1.5" stroke-dasharray="4 3"/>
      <path d="M 36 135 Q 88 128 112 111 T 206 34" fill="none" stroke="#2c2722" stroke-width="2"/>
      <circle cx="112" cy="111" r="3.6" fill="#8c5a3c"/>
      <text x="120" y="116" font-size="10.5" fill="#5c5349" font-family="Georgia, serif">(0, 1)</text>
      <text x="14" y="164" font-size="10.5" fill="#7d5c46">导数单调递增 · 曲线始终在切线上方</text>

      <rect x="271.5" y="0.5" width="248" height="175" rx="6" fill="#fdfbf7" stroke="#dfd7c8"/>
      <text x="285" y="22" font-size="11" fill="#6c6358" font-family="ui-sans-serif, -apple-system, sans-serif">反例：f(t) = t³ 与原点切线 y = 0</text>
      <line x1="292" y1="98" x2="500" y2="98" stroke="#8c5a3c" stroke-width="1.6" stroke-dasharray="4 3"/>
      <line x1="396" y1="34" x2="396" y2="156" stroke="#d8cfc0" stroke-width="1"/>
      <path d="M 316 146 C 352 99, 374 98, 396 98 C 418 98, 440 97, 476 48" fill="none" stroke="#2c2722" stroke-width="2"/>
      <circle cx="396" cy="98" r="3.8" fill="#8c5a3c"/>
      <text x="302" y="116" font-size="10" fill="#6c6358">t &lt; 0 低于切线</text>
      <text x="414" y="84" font-size="10" fill="#6c6358">t &gt; 0 高于切线</text>
      <text x="285" y="164" font-size="10.5" fill="#7d5c46">拐点处二阶导变号 · 图像直接穿过切线</text>
    </svg>`;
  }

  if (kind === 'limit-scale') {
    return `<svg class="canvas-svg" viewBox="0 0 520 172" role="img" aria-label="无穷小主项保留与主项抵消的尺度对比">
      <rect x="0.5" y="0.5" width="519" height="171" rx="6" fill="#fdfbf7" stroke="#dfd7c8"/>
      <text x="16" y="24" font-size="11" fill="#6c6358">设 α = x + x²，β = x（x → 0 时 α ∼ β）</text>
      <text x="16" y="56" font-size="11.5" font-weight="600" fill="#2c2722">1. 相加（主项保留）：(α + β) / x</text>
      <rect x="16" y="66" width="164" height="24" rx="3" fill="#e9dfd0" stroke="#c8b9a4"/>
      <text x="64" y="82" font-size="11" fill="#2c2722" font-family="Georgia, serif">主项 2x</text>
      <rect x="184" y="66" width="52" height="24" rx="3" fill="#f7f3ea" stroke="#dfd7c8"/>
      <text x="195" y="82" font-size="10.5" fill="#7d5c46" font-family="Georgia, serif">+ x²</text>
      <text x="252" y="82" font-size="11" fill="#5c5349">÷ x  →  2 + x → 2（余项可略，替换无损）</text>
      <line x1="16" y1="104" x2="504" y2="104" stroke="#ebe4d7"/>
      <text x="16" y="126" font-size="11.5" font-weight="600" fill="#2c2722">2. 相减（主项抵消）：(α − β) / x²</text>
      <rect x="16" y="136" width="164" height="24" rx="3" fill="none" stroke="#cfc5b4" stroke-dasharray="3 3"/>
      <text x="48" y="152" font-size="10.5" fill="#8f8477">一阶项 x − x 已抵消为 0</text>
      <rect x="184" y="136" width="68" height="24" rx="3" fill="#efe3d3" stroke="#8c5a3c"/>
      <text x="194" y="152" font-size="11" font-weight="600" fill="#7d5c46" font-family="Georgia, serif">余项 x²</text>
      <text x="266" y="152" font-size="11" fill="#2c2722">÷ x² = 1（若提前扔掉 x² 会错算成 0）</text>
    </svg>`;
  }

  if (kind === 'ion-curve') {
    return `<svg class="canvas-svg" viewBox="0 0 520 168" role="img" aria-label="二元弱酸分布系数曲线交点与第三型体份额">
      <rect x="0.5" y="0.5" width="519" height="167" rx="6" fill="#fdfbf7" stroke="#dfd7c8"/>
      <text x="16" y="22" font-size="11" fill="#6c6358">二元弱酸分布曲线 δ(pH)：当 ΔpKa 较小时，交点处第三型体 δ₂ 不可忽略</text>
      <line x1="42" y1="138" x2="486" y2="138" stroke="#cfc5b4"/>
      <line x1="42" y1="36" x2="486" y2="36" stroke="#ebe4d7" stroke-dasharray="3 3"/>
      <line x1="42" y1="87" x2="486" y2="87" stroke="#dfd7c8" stroke-dasharray="3 3"/>
      <text x="14" y="90" font-size="10" fill="#8b8072">0.50</text>
      <path d="M 48 38 C 130 40, 175 74, 212 92 C 258 116, 320 135, 476 138" fill="none" stroke="#2c2722" stroke-width="1.9"/>
      <path d="M 48 138 C 135 135, 178 106, 212 92 C 254 74, 282 74, 322 92 C 368 112, 412 135, 476 138" fill="none" stroke="#7d5c46" stroke-width="1.9"/>
      <path d="M 48 138 C 168 138, 196 134, 212 131 C 266 120, 300 102, 322 92 C 368 68, 418 40, 476 38" fill="none" stroke="#6c6358" stroke-width="1.6" stroke-dasharray="5 3"/>
      <line x1="212" y1="36" x2="212" y2="138" stroke="#8c5a3c" stroke-dasharray="2 2"/>
      <circle cx="212" cy="92" r="3.8" fill="#8c5a3c"/>
      <circle cx="212" cy="131" r="3.2" fill="#5c5349"/>
      <text x="220" y="95" font-size="10.5" fill="#7d5c46">δ₀ = δ₁ ≈ 0.476 (&lt; 0.50)</text>
      <text x="220" y="131" font-size="10" fill="#5c5349">δ₂ ≈ 0.048 分走份额</text>
      <text x="184" y="154" font-size="10.5" fill="#3d3832">pH = pKa₁（三线纵坐标之和恒为 1）</text>
    </svg>`;
  }

  if (kind === 'english-clues') {
    return `<svg class="canvas-svg" viewBox="0 0 520 154" role="img" aria-label="英语微语境客观线索链">
      <rect x="0.5" y="0.5" width="519" height="153" rx="6" fill="#fdfbf7" stroke="#dfd7c8"/>
      <rect x="18" y="28" width="144" height="68" rx="6" fill="#f7f3ea" stroke="#d8cfc0"/>
      <text x="30" y="48" font-size="10.5" font-weight="600" fill="#7d5c46">1. 客观问题</text>
      <text x="30" y="67" font-size="11" fill="#2c2722">no internet</text>
      <text x="30" y="83" font-size="10.5" fill="#6c6358">部分家庭无联网条件</text>

      <line x1="162" y1="62" x2="188" y2="62" stroke="#7d5c46" stroke-width="1.5"/>
      <rect x="188" y="28" width="152" height="68" rx="6" fill="#f3eae0" stroke="#7d5c46"/>
      <text x="200" y="48" font-size="10.5" font-weight="600" fill="#7d5c46">2. 应对行动</text>
      <text x="200" y="67" font-size="11" fill="#2c2722">printed timetable</text>
      <text x="200" y="83" font-size="10.5" fill="#6c6358">门口张贴纸质时刻表</text>

      <line x1="340" y1="62" x2="366" y2="62" stroke="#7d5c46" stroke-width="1.5"/>
      <rect x="366" y="28" width="136" height="68" rx="6" fill="#f7f3ea" stroke="#d8cfc0"/>
      <text x="378" y="48" font-size="10.5" font-weight="600" fill="#2c2722">3. 锁定动词</text>
      <text x="378" y="67" font-size="11.5" font-weight="600" fill="#7d5c46">address concern</text>
      <text x="378" y="83" font-size="10.5" fill="#6c6358">正面回应并处理顾虑</text>

      <text x="18" y="126" font-size="10.5" fill="#5c5349">推断红线：第三句 app would remain available → 排除“app 损坏或已停用”的一切脑补选项</text>
    </svg>`;
  }

  if (kind === 'linalg-quad') {
    return `<svg class="canvas-svg" viewBox="0 0 520 156" role="img" aria-label="非对称矩阵与其对称部分的二次型等价">
      <rect x="0.5" y="0.5" width="519" height="155" rx="6" fill="#fdfbf7" stroke="#dfd7c8"/>
      <rect x="18" y="24" width="218" height="86" rx="6" fill="#f7f3ea" stroke="#d8cfc0"/>
      <text x="30" y="45" font-size="11" font-weight="600" fill="#6c6358">原非对称矩阵 C = [[1, 4], [0, 1]]</text>
      <text x="30" y="67" font-size="11" fill="#2c2722">特征值 λ₁ = λ₂ = 1 &gt; 0（表面全正）</text>
      <text x="30" y="88" font-size="10.5" fill="#7d5c46">但取 x = (1, −1)ᵀ 得 xᵀCx = −2 &lt; 0！</text>

      <text x="249" y="70" font-size="14" fill="#7d5c46">⇒</text>

      <rect x="274" y="24" width="228" height="86" rx="6" fill="#f3eae0" stroke="#7d5c46"/>
      <text x="286" y="45" font-size="11" font-weight="600" fill="#7d5c46">对称部分 S = (C + Cᵀ)/2 = [[1, 2], [2, 1]]</text>
      <text x="286" y="67" font-size="11" fill="#2c2722">恒有 xᵀCx ≡ xᵀSx = x₁² + 4x₁x₂ + x₂²</text>
      <text x="286" y="88" font-size="10.5" font-weight="600" fill="#2c2722">真实主轴特征值：λ = 3 与 λ = −1（不定）</text>

      <text x="18" y="134" font-size="10.5" fill="#5c5349">核心判据：“特征值全正 ⇔ 正定”仅对实对称矩阵成立；反对称部分在二次型中恒抵消为 0</text>
    </svg>`;
  }

  if (kind === 'integral-shell') {
    return `<svg class="canvas-svg" viewBox="0 0 520 162" role="img" aria-label="柱壳法与垫片法几何微元对照">
      <rect x="0.5" y="0.5" width="248" height="161" rx="6" fill="#fdfbf7" stroke="#dfd7c8"/>
      <text x="14" y="22" font-size="11" font-weight="600" fill="#2c2722">竖切 dx（平行于旋转轴 y）→ 薄柱壳</text>
      <line x1="42" y1="132" x2="218" y2="132" stroke="#cfc5b4"/>
      <line x1="42" y1="34" x2="42" y2="140" stroke="#7d5c46" stroke-width="1.5"/>
      <line x1="42" y1="132" x2="192" y2="42" stroke="#2c2722" stroke-width="1.5"/>
      <path d="M 42 132 Q 118 132 192 42" fill="none" stroke="#2c2722" stroke-width="1.5"/>
      <rect x="116" y="88" width="9" height="27" fill="#e8dac7" stroke="#7d5c46"/>
      <text x="14" y="150" font-size="10.5" fill="#7d5c46">dV = 2πx(x − x²)dx · 无需反解函数</text>

      <rect x="271.5" y="0.5" width="248" height="161" rx="6" fill="#fdfbf7" stroke="#dfd7c8"/>
      <text x="285" y="22" font-size="11" font-weight="600" fill="#2c2722">横切 dy（垂直于旋转轴 y）→ 圆环垫片</text>
      <line x1="312" y1="132" x2="488" y2="132" stroke="#cfc5b4"/>
      <line x1="312" y1="34" x2="312" y2="140" stroke="#7d5c46" stroke-width="1.5"/>
      <line x1="312" y1="132" x2="462" y2="42" stroke="#2c2722" stroke-width="1.5"/>
      <path d="M 312 132 Q 388 132 462 42" fill="none" stroke="#2c2722" stroke-width="1.5"/>
      <rect x="378" y="88" width="32" height="8" fill="#efe3d3" stroke="#7d5c46"/>
      <text x="285" y="150" font-size="10.5" fill="#5c5349">dV = π((√y)² − y²)dy = π/6（同体印证）</text>
    </svg>`;
  }

  if (kind === 'dp-dag') {
    return `<svg class="canvas-svg" viewBox="0 0 520 162" role="img" aria-label="0/1背包倒序与正序更新依赖对比">
      <rect x="0.5" y="0.5" width="519" height="161" rx="6" fill="#fdfbf7" stroke="#dfd7c8"/>
      <text x="16" y="23" font-size="11" fill="#6c6358">第一件物品 w₁ = 2, v₁ = 4（仅有一件）在一维数组 dp[0..6] 上的更新顺序对比：</text>
      <text x="16" y="52" font-size="11" font-weight="600" fill="#2c2722">倒序 j = 6 → 2（正确保留 0/1 约束）：</text>
      <rect x="16" y="60" width="228" height="26" rx="4" fill="#f3eae0" stroke="#7d5c46"/>
      <text x="26" y="77" font-size="10.5" fill="#2c2722" font-family="ui-monospace, Menlo, monospace">dp[6] ← dp[4]旧(0) + 4 = 4</text>
      <text x="256" y="77" font-size="10.5" fill="#6c6358">左侧较小容量仍存上一层旧值，只拿 1 次</text>

      <text x="16" y="110" font-size="11" font-weight="600" fill="#7d5c46">正序 j = 2 → 6（误变为完全背包）：</text>
      <rect x="16" y="118" width="290" height="26" rx="4" fill="#f7f3ea" stroke="#c8b9a4"/>
      <text x="26" y="135" font-size="10.5" fill="#7d5c46" font-family="ui-monospace, Menlo, monospace">dp[2]=4 → dp[4]=8 → dp[6]=12 (×3!)</text>
      <text x="316" y="135" font-size="10.5" fill="#5c5349">读到本轮刚改写的新值，同一孤品连塞三次</text>
    </svg>`;
  }

  return `<svg class="canvas-svg" viewBox="0 0 520 168" role="img" aria-label="连续16字节内存条上的指针步长对比">
    <rect x="0.5" y="0.5" width="519" height="167" rx="6" fill="#fdfbf7" stroke="#dfd7c8"/>
    <text x="16" y="23" font-size="11" fill="#6c6358">连续字节地址 0x1000 – 0x100B（每小格 = 1 字节）</text>
    ${Array.from({ length: 12 }, (_, idx) => {
      const x = 16 + idx * 40;
      const inFirstInt = idx < 4;
      const isNextIntStart = idx === 4;
      const isNextCharStart = idx === 1;
      const fill = isNextIntStart ? '#e8dac7' : inFirstInt ? '#f4efe4' : '#fdfbf7';
      const stroke = isNextIntStart ? '#7d5c46' : isNextCharStart ? '#9a6b4c' : '#d8cfc0';
      const hex = `0${idx.toString(16).toUpperCase()}`;
      return `<g>
        <rect x="${x}" y="38" width="36" height="36" rx="3" fill="${fill}" stroke="${stroke}" stroke-width="${isNextIntStart || isNextCharStart ? '1.5' : '1'}"/>
        <text x="${x + 18}" y="60" text-anchor="middle" font-size="10" fill="#3d3832" font-family="ui-monospace, SFMono-Regular, Menlo, monospace">${hex}</text>
      </g>`;
    }).join('')}
    <path d="M 34 86 C 34 104, 194 104, 194 86" fill="none" stroke="#7d5c46" stroke-width="1.5"/>
    <text x="114" y="116" text-anchor="middle" font-size="11" font-weight="600" fill="#7d5c46" font-family="ui-monospace, SFMono-Regular, Menlo, monospace">int *p + 1 → 0x1004（跨 4 字节）</text>
    <path d="M 34 128 L 74 128" fill="none" stroke="#5c5349" stroke-width="1.4"/>
    <circle cx="74" cy="128" r="2.5" fill="#5c5349"/>
    <text x="86" y="132" font-size="10.5" fill="#5c5349" font-family="ui-monospace, SFMono-Regular, Menlo, monospace">(char *)p + 1 → 0x1001（跨 1 字节，内存数据未变）</text>
    <text x="16" y="155" font-size="10.5" fill="#8a7f72">类型决定“一步跨几格”，而非改变底层字节内容</text>
  </svg>`;
}
