// Interactive behaviors for Notara's real-app showcase & public pages.

(() => {
  function escHtml(s) {
    return String(s ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // 1. Homepage 4-Scene App Stage Switcher (+ internal left-rail spine buttons)
  const studyWin = document.querySelector('[data-study-window]');
  if (studyWin) {
    const tabs = Array.from(studyWin.querySelectorAll('[data-scene-target]'));
    const panels = Array.from(studyWin.querySelectorAll('[data-scene-panel]'));

    const activateScene = (targetId, focusTab = false) => {
      for (const tab of tabs) {
        const selected = tab.dataset.sceneTarget === targetId;
        tab.setAttribute('aria-selected', selected ? 'true' : 'false');
        tab.tabIndex = selected ? 0 : -1;
        if (selected && focusTab) tab.focus();
      }
      for (const panel of panels) {
        panel.hidden = panel.dataset.scenePanel !== targetId;
      }
    };

    for (const tab of tabs) {
      tab.addEventListener('click', () => activateScene(tab.dataset.sceneTarget));
      tab.addEventListener('keydown', (ev) => {
        const idx = tabs.indexOf(tab);
        if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
          ev.preventDefault();
          const delta = ev.key === 'ArrowRight' ? 1 : -1;
          const next = tabs[(idx + delta + tabs.length) % tabs.length];
          activateScene(next.dataset.sceneTarget, true);
        }
      });
    }

    studyWin.addEventListener('click', (ev) => {
      const railBtn = ev.target.closest('[data-rail-scene]');
      if (railBtn) {
        ev.preventDefault();
        activateScene(railBtn.dataset.railScene);
      }
    });
  }

  // 2. Wire every Real-App Workspace Shell (Homepage & Lesson Pages)
  for (const shell of document.querySelectorAll('[data-replica-workspace]')) {
    const docTabs = Array.from(shell.querySelectorAll('[data-doc-tab]'));
    const docPanels = Array.from(shell.querySelectorAll('[data-doc-panel]'));
    const chatStream = shell.querySelector('[data-chat-stream]');
    const chatScroll = shell.querySelector('[data-chat-scroll]');
    const composerForm = shell.querySelector('[data-replica-composer]');
    const composerInput = shell.querySelector('[data-composer-input]');

    const activateDocTab = (tabKey) => {
      for (const btn of docTabs) {
        const active = btn.dataset.docTab === tabKey;
        if (active) btn.setAttribute('data-active', 'true');
        else btn.removeAttribute('data-active');
        btn.setAttribute('aria-selected', active ? 'true' : 'false');
      }
      for (const p of docPanels) {
        p.hidden = p.dataset.docPanel !== tabKey;
      }
    };

    for (const btn of docTabs) {
      btn.addEventListener('click', () => activateDocTab(btn.dataset.docTab));
    }

    for (const jumpBtn of shell.querySelectorAll('[data-focus-card-tab]')) {
      jumpBtn.addEventListener('click', () => activateDocTab('card'));
    }

    // Collapsible Thinking Trace
    for (const group of shell.querySelectorAll('[data-tool-collapsible]')) {
      const toggle = group.querySelector('[data-tool-toggle]');
      const body = group.querySelector('[data-tool-body]');
      if (toggle && body) {
        toggle.addEventListener('click', () => {
          const open = !body.hidden;
          body.hidden = open;
          toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
        });
      }
    }

    // Collapsible Source Drawer
    const srcToggle = shell.querySelector('[data-source-toggle]');
    const srcPanel = shell.querySelector('[data-source-panel]');
    if (srcToggle && srcPanel) {
      srcToggle.addEventListener('click', () => {
        const open = !srcPanel.hidden;
        srcPanel.hidden = open;
        srcToggle.setAttribute('aria-expanded', open ? 'false' : 'true');
      });
    }

    // Anti-Spoiler Gate (`先看思路提示` / `展开完整解析` / `收起解析`)
    const spoilerCard = shell.querySelector('[data-spoiler-card]');
    if (spoilerCard) {
      const gate = spoilerCard.querySelector('[data-spoiler-gate]');
      const hintBox = spoilerCard.querySelector('[data-spoiler-hint]');
      const fullBox = spoilerCard.querySelector('[data-spoiler-full]');
      const resetBtn = spoilerCard.querySelector('[data-spoiler-reset]');
      const hintBtn = spoilerCard.querySelector('[data-spoiler-hint-btn]');
      const fullBtns = Array.from(spoilerCard.querySelectorAll('[data-spoiler-full-btn]'));

      const setReveal = (state) => {
        if (gate) gate.hidden = state !== 'hidden';
        if (hintBox) hintBox.hidden = state !== 'hint';
        if (fullBox) fullBox.hidden = state !== 'full';
        if (resetBtn) resetBtn.hidden = state === 'hidden';
      };

      if (hintBtn) hintBtn.addEventListener('click', () => setReveal('hint'));
      for (const b of fullBtns) b.addEventListener('click', () => setReveal('full'));
      if (resetBtn) resetBtn.addEventListener('click', () => setReveal('hidden'));
    }

    // Append Socratic Dialogue Turn helper
    const appendExchange = (userText, replyText) => {
      if (!chatStream || !userText.trim()) return;
      const tName = chatStream.dataset.teacherName || '白川老师';
      const tTag = chatStream.dataset.teacherTag || '沉稳启发';
      const tAvatar = chatStream.dataset.teacherAvatar || 'teacher-shirakawa.png';

      const wrap = document.createElement('div');
      wrap.style.display = 'flex';
      wrap.style.flexDirection = 'column';
      wrap.style.gap = '18px';
      wrap.innerHTML = `
        <div class="pa-msg-user">
          <div class="pa-msg-user-bubble"><p>${escHtml(userText)}</p></div>
        </div>
        <div class="pa-msg-assistant">
          <div class="pa-msg-role-line">
            <span class="pa-pixel-avatar" style="width:22px;height:22px;border-radius:6px"><img src="/assets/pixel-avatars/${escHtml(tAvatar)}" alt=""></span>
            <span>${escHtml(tName)}</span>
            <span class="pa-msg-role-tag">· ${escHtml(tTag)}</span>
          </div>
          <div class="pa-msg-prose pa-structured-md">
            <p>${escHtml(replyText)}</p>
          </div>
        </div>
      `;
      chatStream.appendChild(wrap);
      if (chatScroll) {
        chatScroll.scrollTop = chatScroll.scrollHeight;
      }
    };

    for (const qBtn of shell.querySelectorAll('[data-discuss-q]')) {
      qBtn.addEventListener('click', () => {
        appendExchange(qBtn.dataset.discussQ || '', qBtn.dataset.discussReply || '');
      });
    }

    for (const bringBtn of shell.querySelectorAll('[data-bring-to-chat]')) {
      bringBtn.addEventListener('click', () => {
        if (composerInput) {
          composerInput.value = bringBtn.dataset.bringToChat || '';
          composerInput.focus();
        }
      });
    }

    if (composerForm && composerInput) {
      composerForm.addEventListener('submit', (ev) => {
        ev.preventDefault();
        const val = composerInput.value.trim();
        if (!val) return;
        composerInput.value = '';
        appendExchange(
          val,
          '收到你的思路。这是在线公开体验页；在桌面版 Notara 中，本课老师会基于你本机的完整卡片上下文与草稿继续逐行深挖这个追问。'
        );
      });
    }

    // Inline Understanding Editor (for default understanding cards)
    const uCard = shell.querySelector('[data-understanding-card]');
    if (uCard) {
      const editBtn = uCard.querySelector('[data-edit-understanding]');
      const cancelBtn = uCard.querySelector('[data-cancel-understanding]');
      const saveBtn = uCard.querySelector('[data-save-understanding]');
      const display = uCard.querySelector('[data-understanding-display]');
      const editor = uCard.querySelector('[data-understanding-editor]');
      const textarea = uCard.querySelector('textarea');

      if (editBtn && editor && display) {
        editBtn.addEventListener('click', () => {
          display.hidden = true;
          editor.hidden = false;
          textarea?.focus();
        });
      }
      if (cancelBtn && editor && display) {
        cancelBtn.addEventListener('click', () => {
          editor.hidden = true;
          display.hidden = false;
        });
      }
      if (saveBtn && editor && display && textarea) {
        saveBtn.addEventListener('click', () => {
          display.innerHTML = `<p>${escHtml(textarea.value.trim())}</p>`;
          editor.hidden = true;
          display.hidden = false;
        });
      }
    }
  }

  // 3. Public Learning Sets Hub Catalog (`/library/` & `/resources/`)
  const catalogRoot = document.querySelector('[data-catalog-root]');
  if (catalogRoot) {
    const filterBtns = Array.from(catalogRoot.querySelectorAll('[data-filter]'));
    const searchInput = catalogRoot.querySelector('[data-catalog-search]');
    const items = Array.from(catalogRoot.querySelectorAll('[data-catalog-item]'));
    const emptyBox = catalogRoot.querySelector('[data-catalog-empty]');
    const clearBtn = catalogRoot.querySelector('[data-catalog-clear]');
    const countEl = catalogRoot.querySelector('[data-catalog-count]');

    const params = new URLSearchParams(window.location.search);
    let activeFilter = params.get('filter') || 'all';
    if (searchInput && params.get('q')) {
      searchInput.value = params.get('q');
    }

    const applyCatalog = (syncUrl = true) => {
      const q = (searchInput ? searchInput.value : '').trim().toLowerCase();
      let visibleCount = 0;

      for (const btn of filterBtns) {
        const active = btn.dataset.filter === activeFilter;
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
        if (active) btn.setAttribute('data-active', 'true');
        else btn.removeAttribute('data-active');
      }

      for (const item of items) {
        const stage = item.dataset.stage || '';
        const subject = item.dataset.subject || '';
        const hay = (item.textContent || '').toLowerCase();
        const matchFilter =
          activeFilter === 'all' ||
          stage === activeFilter ||
          subject === activeFilter ||
          (activeFilter === '理化与语言' && (subject === '化学' || subject === '英语'));
        const matchQuery = !q || hay.includes(q);
        const show = matchFilter && matchQuery;
        item.hidden = !show;
        item.style.display = show ? 'flex' : 'none';
        if (show) visibleCount += 1;
      }

      if (emptyBox) emptyBox.hidden = visibleCount > 0;
      if (countEl) countEl.textContent = `在线实景试读目录 · 开箱内置样卷（共显示 ${visibleCount} 套）`;

      if (syncUrl) {
        const next = new URL(window.location.href);
        if (activeFilter && activeFilter !== 'all') next.searchParams.set('filter', activeFilter);
        else next.searchParams.delete('filter');
        if (q) next.searchParams.set('q', searchInput.value.trim());
        else next.searchParams.delete('q');
        window.history.replaceState(null, '', next.pathname + next.search + next.hash);
      }
    };

    for (const btn of filterBtns) {
      btn.addEventListener('click', () => {
        activeFilter = btn.dataset.filter || 'all';
        applyCatalog(true);
      });
    }
    if (searchInput) {
      searchInput.addEventListener('input', () => applyCatalog(true));
    }
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        activeFilter = 'all';
        if (searchInput) searchInput.value = '';
        applyCatalog(true);
      });
    }
    applyCatalog(false);
  }

  // 4. Interactive Lab: 16-Byte Memory Pointer Stepper
  const memLab = document.querySelector('[data-lab="memory"]');
  if (memLab) {
    let width = 4;
    let index = 0;
    const cells = Array.from(memLab.querySelectorAll('[data-byte-index]'));
    const widthBtns = Array.from(memLab.querySelectorAll('[data-byte-width]'));
    const nextBtn = memLab.querySelector('[data-step-next]');
    const resetBtn = memLab.querySelector('[data-step-reset]');
    const addrEl = memLab.querySelector('#address');
    const descEl = memLab.querySelector('#memory-desc');

    const renderMem = () => {
      const maxIndex = Math.floor(16 / width) - 1;
      if (index > maxIndex) index = 0;
      const startByte = index * width;
      const addrHex = `0x${(0x1000 + startByte).toString(16).toUpperCase()}`;
      if (addrEl) addrEl.textContent = addrHex;
      if (descEl) {
        descEl.textContent = `当前下标 ${index} · 每步跨过 ${width} 字节（偏移 ${index} × ${width} = ${startByte} 字节）`;
      }
      for (const btn of widthBtns) {
        btn.setAttribute('aria-pressed', Number(btn.dataset.byteWidth) === width ? 'true' : 'false');
      }
      for (const cell of cells) {
        const idx = Number(cell.dataset.byteIndex);
        cell.classList.toggle('is-active', idx >= startByte && idx < startByte + width);
      }
    };

    for (const btn of widthBtns) {
      btn.addEventListener('click', () => {
        width = Number(btn.dataset.byteWidth) || 4;
        renderMem();
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        const maxIndex = Math.floor(16 / width) - 1;
        index = index >= maxIndex ? 0 : index + 1;
        renderMem();
      });
    }
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        index = 0;
        renderMem();
      });
    }
    renderMem();
  }

  // 5. Interactive Lab: Secant Approaching Tangent
  const curveLab = document.querySelector('[data-lab="curve"]');
  if (curveLab) {
    const slider = curveLab.querySelector('[data-h-slider]');
    const resultEl = curveLab.querySelector('#experiment-result');
    const ptB = curveLab.querySelector('[data-point-b]');
    const secantLine = curveLab.querySelector('[data-secant-line]');

    const mapX = (x) => 56 + x * 135;
    const mapY = (y) => 176 - y * 30;

    const renderCurve = () => {
      const h = Number(slider ? slider.value : 0.6);
      const slope = 2 + h;
      const bx = 1 + h;
      const by = bx * bx;
      if (ptB) {
        ptB.setAttribute('cx', mapX(bx).toFixed(1));
        ptB.setAttribute('cy', mapY(by).toFixed(1));
      }
      if (secantLine) {
        const x0 = 0.25;
        const y0 = 1 + slope * (x0 - 1);
        const x1 = 2.35;
        const y1 = 1 + slope * (x1 - 1);
        secantLine.setAttribute('x1', mapX(x0).toFixed(1));
        secantLine.setAttribute('y1', mapY(y0).toFixed(1));
        secantLine.setAttribute('x2', mapX(x1).toFixed(1));
        secantLine.setAttribute('y2', mapY(y1).toFixed(1));
      }
      if (resultEl) {
        resultEl.textContent = `当间隔 h = ${h.toFixed(2)} 时，割线斜率是 ${slope.toFixed(2)}（切线斜率为 2.00）`;
      }
    };

    if (slider) {
      slider.addEventListener('input', renderCurve);
      renderCurve();
    }
  }

  // 6. Interactive Lab: Infinitesimal Scale Comparison
  const scaleLab = document.querySelector('[data-lab="scale"]');
  if (scaleLab) {
    const modeBtns = Array.from(scaleLab.querySelectorAll('[data-scale-mode]'));
    const detailEl = scaleLab.querySelector('#scale-detail');
    const messages = {
      add: '主项保留：((x + x²) + x) / x = (2x + x²) / x = 2 + x → 2。把 α 直接换成 x 得到 2x / x = 2，结果完全一致，因为一阶主项 2x 没有抵消。',
      sub: '主项抵消：((x + x²) − x) / x² = x² / x² = 1。若在相减前盲目把 α 替换成 x，分子变成 x − x = 0，错算成 0——被丢掉的余项 x² 才是唯一有效信息。',
    };
    const setMode = (mode) => {
      for (const btn of modeBtns) {
        btn.setAttribute('aria-pressed', btn.dataset.scaleMode === mode ? 'true' : 'false');
      }
      if (detailEl) detailEl.textContent = messages[mode] || messages.add;
    };
    for (const btn of modeBtns) {
      btn.addEventListener('click', () => setMode(btn.dataset.scaleMode));
    }
    setMode('add');
  }

  // 7. Interactive Lab: Restart Note Comparison & Local Browser Draft
  const noteLab = document.querySelector('[data-lab="notes"]');
  if (noteLab) {
    const noteBtns = Array.from(noteLab.querySelectorAll('[data-note-sample]'));
    const exampleEl = noteLab.querySelector('#note-example');
    const ownInput = document.querySelector('#own-note');
    const saveBtn = document.querySelector('[data-save-note]');
    const copyBtn = document.querySelector('[data-copy-note]');
    const statusEl = document.querySelector('#note-status');
    const fallbackWrap = document.querySelector('[data-copy-fallback-wrap]');
    const fallbackInput = document.querySelector('[data-copy-fallback]');
    const storageKey = 'notara.public.restartNote';

    const samples = {
      a: '便签 A：「今天把导数切线和极限看了一遍，感觉挺有收获，周末再花时间整章好好复习。」——三天后坐回桌前，依然不知道第一笔往哪写。',
      b: '便签 B：「今天弄清了割线斜率靠两个不同的点逼近切线；下次打开先不看讲义，亲手画 f(t)=t³ 在 t=0 的切线，检验能否讲清它为何穿过切线。」——五分钟即可动笔自检。',
    };

    const setSample = (key) => {
      for (const btn of noteBtns) {
        btn.setAttribute('aria-pressed', btn.dataset.noteSample === key ? 'true' : 'false');
      }
      if (exampleEl) exampleEl.textContent = samples[key] || samples.a;
    };
    for (const btn of noteBtns) {
      btn.addEventListener('click', () => setSample(btn.dataset.noteSample));
    }
    setSample('a');

    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved && ownInput) ownInput.value = saved;
    } catch {
      // Ignore restricted storage mode
    }

    if (saveBtn && ownInput) {
      saveBtn.addEventListener('click', () => {
        try {
          window.localStorage.setItem(storageKey, ownInput.value);
          if (statusEl) statusEl.textContent = '已保存在当前浏览器本地（不上传服务器）。';
        } catch {
          if (statusEl) statusEl.textContent = '当前隐私模式限制了本地存储，可直接复制保留。';
        }
      });
    }

    if (copyBtn && ownInput) {
      copyBtn.addEventListener('click', async () => {
        const text = `【我的理解与下次线索】${ownInput.value.trim() || '先不看笔记，画图检验今天学到的反例边界。'}`;
        try {
          if (!navigator.clipboard?.writeText) throw new Error('unavailable');
          await navigator.clipboard.writeText(text);
          if (statusEl) statusEl.textContent = '已复制到剪贴板，可粘贴进你的本地 Markdown 笔记。';
        } catch {
          if (fallbackWrap && fallbackInput) {
            fallbackWrap.hidden = false;
            fallbackInput.value = text;
            fallbackInput.select();
          }
          if (statusEl) statusEl.textContent = '浏览器限制了自动剪贴板写入，已在下方展开供你直接选中复制。';
        }
      });
    }
  }

  // 8. Self-Check Mirror Quiz
  const quizBox = document.querySelector('[data-quiz]');
  if (quizBox) {
    const correctIdx = Number(quizBox.dataset.correctIndex);
    const explanation = quizBox.dataset.explanation || '';
    const hint = quizBox.dataset.hint || '';
    const btns = Array.from(quizBox.querySelectorAll('[data-answer-index]'));
    const feedback = quizBox.querySelector('.answer-feedback');

    for (const btn of btns) {
      btn.addEventListener('click', () => {
        const idx = Number(btn.dataset.answerIndex);
        for (const other of btns) {
          other.classList.remove('is-correct', 'is-wrong');
        }
        if (idx === correctIdx) {
          btn.classList.add('is-correct');
          if (feedback) feedback.textContent = `答对了。${explanation}`;
        } else {
          btn.classList.add('is-wrong');
          if (feedback) feedback.textContent = `再想一步：${hint}`;
        }
      });
    }
  }

  // 9. Core Workflow 03: Interactive Spatial .canvas `flow` Blank Check
  const canvasFlow = document.querySelector('[data-canvas-flow]');
  if (canvasFlow) {
    const btns = Array.from(canvasFlow.querySelectorAll('[data-flow-choice]'));
    const status = canvasFlow.querySelector('[data-flow-status]');
    for (const btn of btns) {
      btn.addEventListener('click', () => {
        const choice = btn.dataset.flowChoice;
        for (const b of btns) {
          const active = b === btn;
          b.setAttribute('aria-pressed', active ? 'true' : 'false');
          b.className = active
            ? 'pa-sdoc-secondary-btn'
            : 'pa-sdoc-ghost-btn pa-sdoc-ghost-btn--bordered';
        }
        if (status) {
          status.textContent =
            choice === 'lt0'
              ? '✓ 正确：因 ln t > 1 - 1/t（t > 1），极小值严格小于 0，配合两端趋于 +∞ 共有 2 个零点。'
              : '再验一步：= 0 仅在 a = 1（切线恰好相切于 (0,1)）时成立；当 a > 1 时 a(1 - ln a) - 1 < 0。';
        }
      });
    }
  }

  // 10. Core Workflow 05: Interactive Dual-Track Spaced Repetition Demo
  const revDemo = document.querySelector('[data-review-demo]');
  if (revDemo) {
    const btns = Array.from(revDemo.querySelectorAll('[data-rev-mode]'));
    const laneA = revDemo.querySelector('[data-track-lane="a"]');
    const laneB = revDemo.querySelector('[data-track-lane="b"]');
    const badge = revDemo.querySelector('[data-rev-badge]');
    const audit = revDemo.querySelector('[data-rev-audit]');
    const next = revDemo.querySelector('[data-rev-next]');

    const modes = {
      independent: {
        lane: 'a',
        badgeClass: 'wf-pill wf-pill--done',
        badgeText: '独立完成 · 升至 7 天档',
        auditHtml:
          '<strong>本次作答记录：</strong>未借用中途提示或拆步填空，独立写出了 x₀eˣ⁰ = a 整体消元与单调区间判断过程。',
        nextHtml:
          '<strong>下次探讨问题（延伸对比）：</strong>与上周《导数同构-例6》放在一起比较：同样同时出现 ln x 与 eˣ，什么条件下适合设隐零点，什么条件下适合构造同构函数？',
      },
      hint: {
        lane: 'b',
        badgeClass: 'wf-pill wf-pill--warm',
        badgeText: '借提示完成 · 原间隔不变 + 明日 1 天短复查',
        auditHtml:
          '<strong>本次作答记录：</strong>中途查看了一次「观察 x₀ + ln x₀ = ln a 能否化为乘积形式」的切入提示；为避免虚增熟练度，保持原有间隔不变，明天安排一次无提示复查。',
        nextHtml:
          '<strong>明日复查要求：</strong>合上今天的演算草稿，只看原题干，检验能否在两分钟内独立写出隐零点整体代换这一步。',
      },
      leech: {
        lane: 'none',
        badgeClass: 'wf-pill wf-pill--detox',
        badgeText: '暂停机械抽考 · 拆出前置步骤重练',
        auditHtml:
          '<strong>历史记录核对：</strong>这道题已连续两次卡在“试图直接求解超越方程”这一步，继续原题硬刷容易反复受挫，系统先暂停常规抽考循环。',
        nextHtml:
          '<strong>前置补强安排：</strong>先退半步练习一张基础方法卡《超越方程求不出显式根时如何寻找整体代换支点》，掌握稳固后再回到原题。',
      },
    };

    for (const btn of btns) {
      btn.addEventListener('click', () => {
        const modeKey = btn.dataset.revMode || 'independent';
        const cfg = modes[modeKey] || modes.independent;
        for (const b of btns) {
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
        }
        if (laneA) laneA.classList.toggle('is-highlighted', cfg.lane === 'a');
        if (laneB) laneB.classList.toggle('is-highlighted', cfg.lane === 'b');
        if (badge) {
          badge.className = cfg.badgeClass;
          badge.textContent = cfg.badgeText;
        }
        if (audit) audit.innerHTML = cfg.auditHtml;
        if (next) next.innerHTML = cfg.nextHtml;
      });
    }
  }

  // 11. Notara Market Plaza Tabs (`scout` / `connectors` / `packs` / `publish`)
  for (const market of document.querySelectorAll('[data-market-demo]')) {
    const tabs = Array.from(market.querySelectorAll('[data-market-tab]'));
    const panels = Array.from(market.querySelectorAll('[data-market-panel]'));
    for (const tab of tabs) {
      tab.addEventListener('click', () => {
        const key = tab.dataset.marketTab;
        for (const t of tabs) {
          t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
        }
        for (const p of panels) {
          p.hidden = p.dataset.marketPanel !== key;
        }
      });
    }
  }

  // 12. Open Letters Stationery Switcher (`hs` / `uni`)
  for (const folio of document.querySelectorAll('[data-letters-demo]')) {
    const tabs = Array.from(folio.querySelectorAll('[data-letter-tab]'));
    const panels = Array.from(folio.querySelectorAll('[data-letter-panel]'));
    for (const tab of tabs) {
      tab.addEventListener('click', () => {
        const key = tab.dataset.letterTab;
        for (const t of tabs) {
          t.setAttribute('aria-selected', t === tab ? 'true' : 'false');
        }
        for (const p of panels) {
          p.hidden = p.dataset.letterPanel !== key;
        }
      });
    }
  }

})();
