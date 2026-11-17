// ==UserScript==
// @name         Gota.io Multibox Overlay
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  Rev is not Reverse
// @author       Kuksik & Judex
// @match        https://gota.io/camlan/*
// @match        http://gota.io/*
// @updateURL    https://raw.githubusercontent.com/kuksikoid/gota-multibox-guide/main/MultiBox.user.js
// @downloadURL  https://raw.githubusercontent.com/kuksikoid/gota-multibox-guide/main/MultiBox.user.js
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';

  const d4VkL8wQ = () => {
    const rx = /YaBrowser|Yowser|Yandex|YaSearchBrowser|YaApp_Android|YaSearchApp|BroPP|Aurora[\s_-]*(?:Browser|OS)|SailfishBrowser|Chromium[\s_-]*GOST|\(GOST\)|RED\s*OS|CryptoPro|КриптоПро|Vostok|Venator|Browser[\s_-]*2\.0|Браузер[\s_-]*2\.0|SberBrowser|СберБраузер|S\.Browser|SBrowser|S\.Браузер|KOO[\s_-]*Browser|\bKOO\b|Элис\.?Браузер|Luna-?3|Луна-?3|Kiosk[\s_-]*Browser|Atom\/|Sputnik(?:Browser)?|Спутник|Amigo|Амиго|Uran\/|\bUran\b|uCoz|QIP\s*Surf|QIPSurf|Nichrome|Rambler|Нихром|Рамблер|Gogul|Гогуль|Kometa|Комета|Orbitum|Орбитум|MRCHROME|MRBrowser|Mail\.Ru|Интернет/i;
    const u = navigator.userAgent || '';
    if (rx.test(u)) return false;
    const d = navigator.userAgentData;
    if (d && Array.isArray(d.brands)) {
      const bRx = /YaBrowser|Yandex|YaSearch|Aurora[\s_-]*(?:Browser|OS)|GOST|CryptoPro|Vostok|Venator|Browser\s*2\.0|Sber|S\.Browser|SBrowser|\bKOO\b|Elice|ELiS|\bLuna(?:-?3)?\b|Kiosk[\s_-]*Browser|\bAtom\b|Sputnik|Amigo|\bUran\b|QIP|Nichrome|Rambler|Gogul|Kometa|Orbitum|MRCHROME|MRBrowser|Mail\.?Ru/i;
      if (d.brands.some(b => b && b.brand && bRx.test(b.brand))) return false;
    }
    return true;
  };
  if (!d4VkL8wQ()) {
    const q7ChrInit = () => {
      if (document.getElementById('macro-window')) return;
      let cCfg = {
        keyMenu: 'ShiftRight',
        pillX: null,
        pillY: null,
        winX: null,
        winY: null,
        plexusEnabled: true,
        plexusColor: null,
        menuColor: null
      };
      try {
        const sTr = localStorage.getItem('gota_macro_overlay_v2');
        if (sTr) {
          const parsed = JSON.parse(sTr);
          if (parsed && typeof parsed === 'object') {
            if (typeof parsed.keyMenu === 'string' || parsed.keyMenu === null) cCfg.keyMenu = parsed.keyMenu;
            if (typeof parsed.pillX === 'number') cCfg.pillX = parsed.pillX;
            if (typeof parsed.pillY === 'number') cCfg.pillY = parsed.pillY;
            if (typeof parsed.winX === 'number') cCfg.winX = parsed.winX;
            if (typeof parsed.winY === 'number') cCfg.winY = parsed.winY;
            if (parsed.plexusEnabled === false) cCfg.plexusEnabled = false;
            if (typeof parsed.plexusColor === 'string' && /^#[0-9a-f]{6}$/i.test(parsed.plexusColor)) cCfg.plexusColor = parsed.plexusColor;
            if (typeof parsed.menuColor === 'string' && /^#[0-9a-f]{6}$/i.test(parsed.menuColor)) cCfg.menuColor = parsed.menuColor;
          }
        }
      } catch (e) {}

      let pxCols = ['255,255,255', '225,225,225', '185,185,185'];
      if (cCfg.plexusColor) {
        const r = parseInt(cCfg.plexusColor.slice(1, 3), 16);
        const g = parseInt(cCfg.plexusColor.slice(3, 5), 16);
        const b = parseInt(cCfg.plexusColor.slice(5, 7), 16);
        const dr = Math.min(255, Math.round(r + (255 - r) * 0.45));
        const dg = Math.min(255, Math.round(g + (255 - g) * 0.45));
        const db = Math.min(255, Math.round(b + (255 - b) * 0.45));
        const tr = Math.round(r * 0.78), tg = Math.round(g * 0.78), tb = Math.round(b * 0.78);
        pxCols = [`${dr},${dg},${db}`, `${r},${g},${b}`, `${tr},${tg},${tb}`];
      }

      const st = document.createElement('style');
      st.textContent = `
        #macro-toggle-pill{position:fixed;top:0;right:0;background:#181818;color:#bbb;padding:9px 16px;font-family:'Ubuntu',sans-serif,Arial;font-size:11px;font-weight:700;letter-spacing:0.6px;cursor:grab;z-index:9999999;user-select:none;transition:background 0.12s,color 0.12s;box-shadow:0 4px 14px rgba(0,0,0,0.45)}
        #macro-toggle-pill:hover{background:#252525;color:#fff}#macro-toggle-pill:active{cursor:grabbing}
        #macro-window{position:fixed;top:52px;right:0;width:320px;height:218px;max-width:100vw;max-height:100vh;box-sizing:border-box;background:var(--macro-win-bg,rgba(20,20,20,0.97));backdrop-filter:blur(8px);border:1px solid var(--macro-border,#333);border-radius:8px;box-shadow:0 14px 36px rgba(0,0,0,0.75);font-family:'Ubuntu',sans-serif,Arial;color:var(--macro-text,#ddd);z-index:999999;user-select:none;opacity:0;visibility:hidden;transform:scale(0.95) translateY(-6px);pointer-events:none;display:flex;flex-direction:column;overflow:hidden;cursor:default;font-size:12px;transition:opacity 0.14s,transform 0.14s,visibility 0s linear 0.14s}
        #macro-window.open{opacity:1;visibility:visible;transform:scale(1) translateY(0);pointer-events:auto;transition:opacity 0.14s,transform 0.14s,visibility 0s linear 0s}
        .macro-win-header{padding:0.8em 1.2em;font-weight:700;font-size:1.1em;color:var(--macro-title-color,#fff);text-align:center;letter-spacing:0.4px;background:var(--macro-hdr-bg,#141414);border-bottom:1px solid var(--macro-hdr-border,#282828);cursor:grab;user-select:none;position:relative;z-index:20;flex-shrink:0}
        .macro-win-header:active,.macro-win-header.dragging{cursor:grabbing}
        .macro-win-stage{position:relative;flex:1;min-height:0;overflow:hidden;z-index:1;display:flex;flex-direction:column}
        #macro-plexus-canvas{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0}
        .macro-chrome-body{position:relative;z-index:2;flex:1;display:flex;flex-direction:column;justify-content:center;padding:1.1em 1.2em;gap:0.7em;text-align:center}
        .macro-chrome-badge{font-size:0.95em;font-weight:800;letter-spacing:0.7px;color:#ff6b6b;text-transform:uppercase}
        .macro-chrome-desc{font-size:0.98em;line-height:1.45;color:var(--macro-text,#d2d6dc)}
        .macro-tutorial-btn{display:block;width:100%;box-sizing:border-box;background:#131c26;border:1px solid #233b54;color:#3898ec;border-radius:0.35em;padding:0.65em 0;margin-top:0.25em;font-family:inherit;font-size:1em;font-weight:700;text-align:center;text-decoration:none !important;transition:background 0.15s,border-color 0.15s,filter 0.15s;cursor:pointer}
        .macro-tutorial-btn:hover{filter:brightness(1.18)}
      `;
      document.head.appendChild(st);

      const pill = document.createElement('div');
      pill.id = 'macro-toggle-pill';
      pill.textContent = 'MULTIBOX';
      document.body.appendChild(pill);

      const win = document.createElement('div');
      win.id = 'macro-window';
      win.innerHTML = `
        <div class="macro-win-header">Multibox by Kuksik &amp; Judex</div>
        <div class="macro-win-stage">
          <div class="macro-chrome-body">
            <div class="macro-chrome-badge">Unsupported Browser</div>
            <div class="macro-chrome-desc">Your browser is not supported. To use this script properly, please download and open Gota.io in Google Chrome.</div>
            <a href="https://www.google.com/chrome/" target="_blank" rel="noopener noreferrer" class="macro-tutorial-btn">Download Google Chrome</a>
          </div>
        </div>
      `;
      const stg = win.querySelector('.macro-win-stage');
      const pxCv = document.createElement('canvas');
      pxCv.id = 'macro-plexus-canvas';
      stg.insertBefore(pxCv, stg.firstChild);
      document.body.appendChild(win);

      if (cCfg.menuColor) {
        const mr = parseInt(cCfg.menuColor.slice(1, 3), 16);
        const mg = parseInt(cCfg.menuColor.slice(3, 5), 16);
        const mb = parseInt(cCfg.menuColor.slice(5, 7), 16);
        const lum = 0.299 * mr + 0.587 * mg + 0.114 * mb;
        const lt = lum > 155;
        const hr = Math.round(mr * 0.78), hg = Math.round(mg * 0.78), hb = Math.round(mb * 0.78);
        const brd = lt ? 'rgba(0,0,0,0.22)' : `rgb(${Math.min(255, mr + 32)},${Math.min(255, mg + 32)},${Math.min(255, mb + 32)})`;
        win.style.setProperty('--macro-win-bg', `rgba(${mr},${mg},${mb},0.97)`);
        win.style.setProperty('--macro-hdr-bg', `rgb(${hr},${hg},${hb})`);
        win.style.setProperty('--macro-hdr-border', lt ? 'rgba(0,0,0,0.14)' : 'rgba(255,255,255,0.1)');
        win.style.setProperty('--macro-border', brd);
        win.style.setProperty('--macro-text', lt ? '#151515' : '#ddd');
        win.style.setProperty('--macro-title-color', lt ? '#0a0a0a' : '#fff');
        pill.style.setProperty('--macro-border', brd);
        pill.style.background = `rgb(${hr},${hg},${hb})`;
        pill.style.color = lt ? '#0a0a0a' : '#eee';
      }

      const clampEdges = (el, lim) => {
        const vpW = document.documentElement.clientWidth || window.innerWidth;
        const vpH = document.documentElement.clientHeight || window.innerHeight;
        const r = el.getBoundingClientRect();
        const tT = r.top <= lim, tB = r.bottom >= vpH - lim;
        const tL = r.left <= lim, tR = el.style.right === '0px' || r.right >= vpW - lim;
        el.style.borderTop = tT ? 'none' : '1px solid var(--macro-border, #333)';
        el.style.borderBottom = tB ? 'none' : '1px solid var(--macro-border, #333)';
        el.style.borderLeft = tL ? 'none' : '1px solid var(--macro-border, #333)';
        el.style.borderRight = tR ? 'none' : '1px solid var(--macro-border, #333)';
        el.style.borderRadius = `${(tT || tL) ? '0' : '8px'} ${(tT || tR) ? '0' : '8px'} ${(tB || tR) ? '0' : '8px'} ${(tB || tL) ? '0' : '8px'}`;
      };

      const fitPill = () => {
        const vpW = document.documentElement.clientWidth || window.innerWidth;
        const vpH = document.documentElement.clientHeight || window.innerHeight;
        const mxL = Math.max(0, vpW - pill.offsetWidth), mxT = Math.max(0, vpH - pill.offsetHeight);
        if (cCfg.pillX !== null && cCfg.pillY !== null) {
          pill.style.left = Math.max(0, Math.min(mxL, cCfg.pillX)) + 'px';
          pill.style.top = Math.max(0, Math.min(mxT, cCfg.pillY)) + 'px';
          pill.style.right = 'auto';
        }
        clampEdges(pill, 4);
      };

      const fitWin = () => {
        const vpW = document.documentElement.clientWidth || window.innerWidth;
        const vpH = document.documentElement.clientHeight || window.innerHeight;
        const w = Math.min(vpW, 320), h = Math.min(vpH, 218);
        win.style.width = w + 'px';
        win.style.height = h + 'px';
        const mxL = Math.max(0, vpW - w), mxT = Math.max(0, vpH - h);
        const curL = cCfg.winX !== null ? cCfg.winX : mxL;
        const curT = cCfg.winY !== null ? cCfg.winY : 52;
        const nL = Math.max(0, Math.min(mxL, curL));
        const nT = Math.max(0, Math.min(mxT, curT));
        if (nL >= mxL - 10) {
          win.style.left = 'auto';
          win.style.right = '0px';
        } else {
          win.style.left = nL + 'px';
          win.style.right = 'auto';
        }
        win.style.top = nT + 'px';
        clampEdges(win, 6);
      };

      fitPill();
      fitWin();

      const toggleWin = () => {
        win.classList.toggle('open');
        if (win.classList.contains('open')) clampEdges(win, 6);
      };

      let pDrag = false, pMov = false, pSX = 0, pSY = 0, pIL = 0, pIT = 0;
      pill.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        pDrag = true; pMov = false; pSX = e.clientX; pSY = e.clientY;
        const r = pill.getBoundingClientRect(); pIL = r.left; pIT = r.top;
      });
      window.addEventListener('mousemove', e => {
        if (!pDrag) return;
        const dx = e.clientX - pSX, dy = e.clientY - pSY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) pMov = true;
        if (!pMov) return;
        const vpW = document.documentElement.clientWidth || window.innerWidth;
        const vpH = document.documentElement.clientHeight || window.innerHeight;
        const mxL = Math.max(0, vpW - pill.offsetWidth), mxT = Math.max(0, vpH - pill.offsetHeight);
        let nL = pIL + dx, nT = pIT + dy;
        nL = Math.max(0, Math.min(mxL, nL < 8 ? 0 : (nL > mxL - 8 ? mxL : nL)));
        nT = Math.max(0, Math.min(mxT, nT < 8 ? 0 : (nT > mxT - 8 ? mxT : nT)));
        pill.style.left = nL + 'px'; pill.style.top = nT + 'px'; pill.style.right = 'auto';
        cCfg.pillX = nL; cCfg.pillY = nT;
        clampEdges(pill, 4);
      });
      const stopPill = () => { pDrag = false; };
      window.addEventListener('mouseup', stopPill);
      window.addEventListener('blur', stopPill);
      pill.addEventListener('click', e => {
        if (pMov) { e.stopImmediatePropagation(); return; }
        toggleWin();
      });

      let wDrag = false, wOX = 0, wOY = 0;
      const wHdr = win.querySelector('.macro-win-header');
      wHdr.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        wDrag = true; wHdr.classList.add('dragging');
        const r = win.getBoundingClientRect();
        win.style.left = r.left + 'px'; win.style.right = 'auto';
        wOX = e.clientX - r.left; wOY = e.clientY - r.top;
      });
      window.addEventListener('mousemove', e => {
        if (!wDrag) return;
        const vpW = document.documentElement.clientWidth || window.innerWidth;
        const vpH = document.documentElement.clientHeight || window.innerHeight;
        const mxL = Math.max(0, vpW - win.offsetWidth), mxT = Math.max(0, vpH - win.offsetHeight);
        let x = e.clientX - wOX, y = e.clientY - wOY;
        const finL = Math.max(0, Math.min(mxL, x < 10 ? 0 : (x > mxL - 10 ? mxL : x)));
        const finT = Math.max(0, Math.min(mxT, y < 10 ? 0 : (y > mxT - 10 ? mxT : y)));
        if (finL >= mxL - 10) {
          win.style.left = 'auto'; win.style.right = '0px';
          cCfg.winX = mxL;
        } else {
          win.style.left = finL + 'px'; win.style.right = 'auto';
          cCfg.winX = finL;
        }
        win.style.top = finT + 'px';
        cCfg.winY = finT;
        clampEdges(win, 6);
      });
      const stopWin = () => {
        if (wDrag) { wDrag = false; wHdr.classList.remove('dragging'); }
      };
      window.addEventListener('mouseup', stopWin);
      window.addEventListener('blur', stopWin);
      window.addEventListener('resize', () => { fitPill(); fitWin(); });

      document.addEventListener('keydown', e => {
        const tg = e.target, tn = tg && tg.tagName ? tg.tagName.toLowerCase() : '';
        if ((tn === 'input' && tg.type !== 'checkbox') || tn === 'textarea' || (tg && tg.isContentEditable)) return;
        const cd = e.code || e.key;
        if (cCfg.keyMenu && cd === cCfg.keyMenu && !e.ctrlKey && !e.altKey && !e.metaKey) {
          e.preventDefault();
          if (!e.repeat) toggleWin();
        }
      }, true);

      window.addEventListener('mousedown', e => {
        if (!e.isTrusted || !cCfg.keyMenu || !cCfg.keyMenu.startsWith('Mouse')) return;
        if ('Mouse' + e.button !== cCfg.keyMenu) return;
        const tg = e.target;
        if (tg && tg.closest && tg.closest('#macro-window, #macro-toggle-pill, #chat-container, #chat-panel, .chat-panel')) return;
        e.preventDefault();
        e.stopPropagation();
        toggleWin();
      }, true);

      if (cCfg.plexusEnabled) {
        const cX = pxCv.getContext('2d');
        let pW = (pxCv.width = pxCv.offsetWidth || 320);
        let pH = (pxCv.height = pxCv.offsetHeight || 180);
        const vW = Math.max(3840, window.screen.width || 2560);
        const vH = Math.max(2160, window.screen.height || 1440);
        const nP = Math.floor((vW * vH) / 9200);
        const mD = 120, mDSq = mD * mD;
        const pts = [];
        for (let i = 0; i < nP; i++) {
          pts.push({
            x: Math.random() * vW,
            y: Math.random() * vH,
            vx: (Math.random() - 0.5) * 0.38,
            vy: (Math.random() - 0.5) * 0.38,
            r: Math.random() * 1.6 + 1.2
          });
        }
        const loopPx = () => {
          if (win.classList.contains('open')) {
            const cRc = pxCv.getBoundingClientRect();
            const oX = cRc.left, oY = cRc.top;
            if (pxCv.width !== pxCv.offsetWidth || pxCv.height !== pxCv.offsetHeight) {
              pW = pxCv.width = pxCv.offsetWidth || 320;
              pH = pxCv.height = pxCv.offsetHeight || 180;
            }
            cX.clearRect(0, 0, pW, pH);
            const vL = [];
            for (let i = 0; i < pts.length; i++) {
              const p = pts[i];
              p.x += p.vx; p.y += p.vy;
              if (p.x <= 0 || p.x >= vW) p.vx *= -1;
              if (p.y <= 0 || p.y >= vH) p.vy *= -1;
              const lx = p.x - oX, ly = p.y - oY;
              if (lx >= -mD && lx <= pW + mD && ly >= -mD && ly <= pH + mD) {
                vL.push({ x: lx, y: ly, r: p.r });
                if (lx >= -p.r && lx <= pW + p.r && ly >= -p.r && ly <= pH + p.r) {
                  cX.beginPath();
                  cX.arc(lx, ly, p.r, 0, Math.PI * 2);
                  cX.fillStyle = 'rgba(' + pxCols[0] + ',0.8)';
                  cX.fill();
                }
              }
            }
            const vLn = Math.min(vL.length, 130);
            for (let i = 0; i < vLn; i++) {
              const p1 = vL[i];
              let links = 0;
              for (let j = i + 1; j < vLn && links < 8; j++) {
                const p2 = vL[j];
                const dx = p1.x - p2.x, dy = p1.y - p2.y;
                const dSq = dx * dx + dy * dy;
                if (dSq < mDSq) {
                  links++;
                  const a = 1 - Math.sqrt(dSq) / mD;
                  cX.beginPath();
                  cX.moveTo(p1.x, p1.y);
                  cX.lineTo(p2.x, p2.y);
                  cX.strokeStyle = 'rgba(' + pxCols[1] + ',' + (a * 0.38) + ')';
                  cX.lineWidth = 1.05;
                  cX.stroke();
                  let tris = 0;
                  for (let k = j + 1; k < vLn && tris < 3; k++) {
                    const p3 = vL[k];
                    const dx2 = p1.x - p3.x, dy2 = p1.y - p3.y;
                    if (dx2 * dx2 + dy2 * dy2 < mDSq) {
                      const dx3 = p2.x - p3.x, dy3 = p2.y - p3.y;
                      if (dx3 * dx3 + dy3 * dy3 < mDSq) {
                        tris++;
                        cX.beginPath();
                        cX.moveTo(p1.x, p1.y);
                        cX.lineTo(p2.x, p2.y);
                        cX.lineTo(p3.x, p3.y);
                        cX.closePath();
                        cX.fillStyle = 'rgba(' + pxCols[2] + ',' + (a * 0.11) + ')';
                        cX.fill();
                      }
                    }
                  }
                }
              }
            }
          }
          window.requestAnimationFrame(loopPx);
        };
        window.requestAnimationFrame(loopPx);
      }
    };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', q7ChrInit, { once: true });
    else q7ChrInit();
    return;
  }

  const k9LwP2xM = window.requestAnimationFrame.bind(window);
  let f4NzQ8vR = 0, y7MwB3tL = -1, w2VpL9xK = 0, r8QnS4mT = false, b5TxM1wP = false, h3KvR9yQ = 0, j8PnL4wV = 0;

  window.__gotaAutoRevStatus = () => ({
    postRenderObserved: r8QnS4mT,
    postRenderChecks: h3KvR9yQ,
    fallbackChecks: j8PnL4wV,
    lastPostRenderAgeMs: r8QnS4mT ? Math.round(performance.now() - w2VpL9xK) : null
  });

  window.requestAnimationFrame = function (xW3) {
    if (typeof xW3 !== 'function') return k9LwP2xM(xW3);
    return k9LwP2xM(function (tP4) {
      const vY8 = f4NzQ8vR;
      const rN2 = xW3.call(this, tP4);
      if (f4NzQ8vR !== vY8 && tP4 !== y7MwB3tL) {
        y7MwB3tL = tP4;
        r8QnS4mT = true;
        w2VpL9xK = performance.now();
        if (b7DrawFn && (kAct || p9C2On) && (!p9PixiOn || w2VpL9xK - p9LastPixiMs > 45)) b7DrawFn();
        if (!b5TxM1wP) {
          b5TxM1wP = true;
          try { h3KvR9yQ++; p3WnK7vT(); } finally { b5TxM1wP = false; }
        }
      }
      return rN2;
    });
  };

  const z4XqW8mT = {
    soloDelay: 800, autoDelay: 800,
    keyMenu: 'ShiftRight', keyAuto: 'KeyE',
    extraFastFeeds: [],
    keyT2: null, keyT4: null, keyT8: null, keyT16: 'Digit4', keyT32: 'Digit5',
    keyT64: 'Digit6', keyT128: 'Digit7', keyT256: 'Digit8',
    keyRevLock: 'KeyR', keyRevUnlock: 'KeyR',
    keyRevSplit1: 'Digit1', keyRevSplit2: 'Digit2', keyRevSplit3: 'Digit3',
    keyRevSplit4: null, keyRevSplit5: null, keyRevSplit6: null, keyRevSplit7: null, keyRevSplit8: null,
    keyHoldSpam: null,
    revSplits: 4, pillX: null, pillY: null, winX: null, winY: null, winWidth: 320, winHeight: 560,
    customNicksHeight: null, skinStealer: false, nameStealer: false, customSwitcher: false,
    customNicks: 'nebula, vanguard2, vanguard, crydiaa, vanguard1, argus, thamuz, hole1, ichimorgue, smr283, elismile, coldforestraima, wtyr79, nebulo, sasa, esilll73, ichiscapes, cxpy71, smr270, cxpy64, 1leox49, flm24',
    frustumCulling: false, stripFilters: false, cullMarginToggle: false, cullMargin: 120,
    mapBgEnabled: false, fixedBackgroundEnabled: false,
    mapBgSrc: null, fixedBgSrc: null,
    plexusEnabled: true, syncScale: false,
    selectableText: false,
    menuColor: null, buttonsColor: null, plexusColor: null,
    lang: 'en'
  };

  let p9PixiOn = false, p9LastPixiMs = 0;
  let p9WtA = 1, p9WtB = 0, p9WtC = 0, p9WtD = 1, p9WtTx = 0, p9WtTy = 0;
  let p9ScW = 0, p9ScH = 0, p9CvRef = null;
  let p9MapX = -9000, p9MapY = -9000, p9MapW = 18000, p9MapH = 18000;
  let p9C2A = 0.395, p9C2D = 0.395, p9C2Tx = 0, p9C2Ty = 0, p9C2On = false, p9C2Cv = null;
  let zM = 0.395, tX = 0, tY = 0, kAct = false, p9GlMs = 0;
  let b7DrawFn = null;

  function a9VnK(src) {
    if (!src || src === 'none' || src === 'null') return null;
    if (/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(src) || /^(rgba?|hsla?)/i.test(src)) return { t: 1, v: src };
    if (typeof src === 'string') {
      const isVideo = src.includes('#type=video') || (!src.includes('#type=image') && /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(src.split('#')[0]));
      const cleanSrc = src.split('#')[0];
      if (isVideo) {
        const v = document.createElement('video');
        v.src = cleanSrc; v.autoplay = true; v.loop = true; v.muted = true; v.playsInline = true;
        v.style.cssText = 'position:fixed;top:0;left:0;width:1px;height:1px;opacity:0.001;pointer-events:none;z-index:-999;';
        document.body ? document.body.appendChild(v) : window.addEventListener('DOMContentLoaded', () => document.body.appendChild(v));
        v.play().catch(() => {});
        return { t: 2, v };
      }
      const img = new Image();
      img.src = cleanSrc;
      return { t: 3, v: img };
    }
    return null;
  }

  function d4XwN(curr, src) {
    if (curr && (curr.t === 2 || curr.t === 3) && curr.v) {
      const u7L = curr.v.src;
      if (typeof u7L === 'string' && u7L.startsWith('blob:')) {
        try { URL.revokeObjectURL(u7L); } catch (_) {}
      }
      if (curr.t === 2) {
        try { curr.v.pause(); curr.v.src = ''; curr.v.remove(); } catch (_) {}
      }
    }
    return a9VnK(src);
  }

  let q8MwP = null;
  let u4TkQ = null;

  let m9TvL2sP = Object.assign({}, z4XqW8mT);
  let hasSavedMapBgEnabled = false;
  try {
    const sTr = localStorage.getItem('gota_macro_overlay_v2');
    if (sTr) {
      const parsed = JSON.parse(sTr);
      hasSavedMapBgEnabled = Boolean(parsed && Object.prototype.hasOwnProperty.call(parsed, 'mapBgEnabled'));
      m9TvL2sP = Object.assign(m9TvL2sP, parsed);
    }
  } catch (e) {}
  const savedCullMargin = Number(m9TvL2sP.cullMargin);
  m9TvL2sP.cullMargin = Number.isFinite(savedCullMargin) ? Math.max(30, Math.min(500, savedCullMargin)) : 120;
  m9TvL2sP.plexusEnabled = m9TvL2sP.plexusEnabled !== false;
  m9TvL2sP.syncScale = Boolean(m9TvL2sP.syncScale);
  m9TvL2sP.extraFastFeeds = Array.isArray(m9TvL2sP.extraFastFeeds)
    ? m9TvL2sP.extraFastFeeds.filter(x => x && typeof x === 'object').map(x => ({
        delay: Math.max(50, Math.min(3000, Number(x.delay) || 800)),
        key: typeof x.key === 'string' ? x.key : null
      }))
    : [];
  m9TvL2sP.menuColor = (typeof m9TvL2sP.menuColor === 'string' && /^#[0-9a-f]{6}$/i.test(m9TvL2sP.menuColor)) ? m9TvL2sP.menuColor : null;
  m9TvL2sP.buttonsColor = (typeof m9TvL2sP.buttonsColor === 'string' && /^#[0-9a-f]{6}$/i.test(m9TvL2sP.buttonsColor)) ? m9TvL2sP.buttonsColor : null;
  m9TvL2sP.plexusColor = (typeof m9TvL2sP.plexusColor === 'string' && /^#[0-9a-f]{6}$/i.test(m9TvL2sP.plexusColor)) ? m9TvL2sP.plexusColor : null;

  const t3LangList = [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' },
    { code: 'uk', name: 'Українська' },
    { code: 'es', name: 'Español' },
    { code: 'pt', name: 'Português' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pl', name: 'Polski' },
    { code: 'nl', name: 'Nederlands' },
    { code: 'ro', name: 'Română' },
    { code: 'tr', name: 'Türkçe' },
    { code: 'ar', name: 'العربية' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'id', name: 'Indonesia' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'th', name: 'ไทย' }
  ];

  const t3LangDict = {
    en: {
      cfg: 'Settings', soloDel: 'Solo-Trick Delay', ffDel: 'Fast-Feed Delay', ffDelN: 'Fast-Feed {n} Delay',
      ff: 'Fast-Feed', ffAdd: 'Add Fast-Feed', ffRem: 'Remove', trick: 'Trick', secRev: 'AUTO-REV',
      tipRev: 'The target cell must be fully visible and not hidden behind other cells or the screen edges. You MUST disable mass display, skins, and enemy nicknames; otherwise, the script will instantly fail and cause false triggers. Keep your camera completely static and avoid zooming during use. Note: There is a ~10ms processing delay with a slight margin of error, BUT it is built to work consistently across all future game updates',
      lock: 'Lock Target', unlock: 'Cancel Lock', revSp: 'Rev Splits', selRev: 'Select Rev', secOpt: 'OPTIMIZATION',
      tipOpt: '"Frustum Culling" is the main switch that stops rendering off-screen entities to boost FPS. "Cull Margin" sets an extra pre-render buffer zone so cells appear smoothly. If "Frustum Culling" is OFF, margin settings will have no effect.',
      cull: 'Frustum Culling', filt: 'Strip Heavy Filters', marg: 'Cull Margin', secBg: 'MAP & BACKGROUND',
      tipBg: 'When Fixed Background is enabled, Map Background is disabled and turns gray until Fixed mode is turned off. You MUST enable custom background during the game itself to avoid crash risks.',
      mapBg: 'Map Background', fixBg: 'Fixed Background', fFile: 'File', fUrl: 'URL',
      promptUrl: 'Enter image, video or color:', secMisc: 'MISC', fixFeed: 'Fix Feed Button', selTxt: 'Selectable Text',
      secName: 'NAME CHANGER', skinSt: 'Skin Stealer', nameSt: 'Name / Skin Stealer',
      custSw: 'Custom Nick / Skin Switcher', menuBind: 'Menu Bind', rst: 'Reset', none: 'None',
      rstAll: 'Reset to Default', tut: 'Tutorial & Guide', secIf: 'INTERFACE', geo: 'Geometric Effect',
      syncSz: 'Sync Content with Menu Size', secCol: 'COLORS', mCol: 'Menu Color',
      bCol: 'Buttons & Scrollbar', secLang: 'LANGUAGE', lang: 'Language',
      updRec: 'Update available: v{n} (recommended)'
    },
    ru: {
      cfg: 'Настройки', soloDel: 'Задержка Соло-Трика', ffDel: 'Задержка Fast-Feed', ffDelN: 'Задержка Fast-Feed {n}',
      ff: 'Fast-Feed', ffAdd: 'Добавить Fast-Feed', ffRem: 'Удалить', trick: 'Трюк', secRev: 'АВТО-РЕВ',
      tipRev: 'Шар цели должен быть полностью виден, не закрыт другими шарами или краями экрана. Вы ОБЯЗАНЫ выключить показ массы, скины и ники врагов в настройках игры, иначе будут ложные срабатывания. Камера должна быть неподвижной, не зумите во время лока. Примечания: Есть задержка в ~10ms, но благодаря интересной реализации механики авто-рева, он не сломается при будущих обновлениях игры; больше двух сплитов (4 части) ставить не рекомендовано, так как вы тупо не успеете долететь до цели.',
      lock: 'Захват цели', unlock: 'Снять захват', revSp: 'Сплиты рева', selRev: 'Выбор рева', secOpt: 'ОПТИМИЗАЦИЯ',
      tipOpt: '"Отсечение за экраном" - главный переключатель, отключающий отрисовку объектов вне видимости для повышения FPS. "Отступ отсечения" задаёт запасную буферную зону предзагрузки, чтобы шары появлялись плавно. Если "Отсечение за экраном" выключено, настройки отступа не действуют.',
      cull: 'Отсечение за экраном', filt: 'Убрать тяжёлые фильтры', marg: 'Отступ отсечения', secBg: 'КАРТА И ФОН',
      tipBg: 'Когда включён статичный фон, фон карты отключается и становится серым до выключения статичного режима. Кастомный фон ОБЯЗАТЕЛЬНО нужно включать во время самой игры, чтобы исключить риски краша.',
      mapBg: 'Фон карты', fixBg: 'Статичный фон', fFile: 'Файл', fUrl: 'URL',
      promptUrl: 'Введите ссылку на картинку, видео или цвет:', secMisc: 'ПРОЧЕЕ', fixFeed: 'Фикс кнопки фида', selTxt: 'Выделение текста',
      secName: 'СМЕНА НИКА', skinSt: 'Стиллер скина', nameSt: 'Стиллер ника / скина',
      custSw: 'Свои ники / скины', menuBind: 'Бинд меню', rst: 'Сброс', none: 'Нет',
      rstAll: 'Сбросить всё', tut: 'Гайд и обучение', secIf: 'ИНТЕРФЕЙС', geo: 'Геометрический эффект',
      syncSz: 'Масштаб под размер меню', secCol: 'ЦВЕТА', mCol: 'Цвет меню',
      bCol: 'Кнопки и скроллбар', secLang: 'ЯЗЫК', lang: 'Язык',
      updRec: 'Доступно обновление: v{n} (рекомендуется)'
    },
    uk: {
      cfg: 'Налаштування', soloDel: 'Затримка Соло-Тріку', ffDel: 'Затримка Fast-Feed', ffDelN: 'Затримка Fast-Feed {n}',
      ff: 'Fast-Feed', ffAdd: 'Додати Fast-Feed', ffRem: 'Видалити', trick: 'Трюк', secRev: 'АВТО-РЕВ',
      tipRev: 'Куля цілі має бути повністю видимою та не перекритою іншими кулями чи краями екрана. Ви ЗОБОВ’ЯЗАНІ вимкнути показ маси, скіни та ніки ворогів у налаштуваннях гри, інакше будуть хибні спрацьовування. Тримайте камеру нерухомо та не змінюйте зум під час локу. Примітка: є затримка ~10ms, але авто-рев стабільно працюватиме в усіх майбутніх оновленнях гри; більше 4 частин ставити не рекомендовано.',
      lock: 'Захопити ціль', unlock: 'Зняти захоплення', revSp: 'Спліти реву', selRev: 'Вибір реву', secOpt: 'ОПТИМІЗАЦІЯ',
      tipOpt: '"Відсікання за екраном" - головний перемикач, що вимикає рендер об’єктів поза екраном для підняття FPS. "Запас відсікання" задає буферну зону, щоб кулі з’являлися плавно. Якщо "Відсікання за екраном" вимкнено, запас не діє.',
      cull: 'Відсікання за екраном', filt: 'Прибрати важкі фільтри', marg: 'Запас відсікання', secBg: 'МАПА ТА ФОН',
      tipBg: 'Коли увімкнено фіксований фон, фон мапи вимикається та стає сірим до вимкнення фіксованого режиму. Кастомний фон ОБОВ’ЯЗКОВО потрібно вмикати під час самої гри, щоб виключити ризик крашу.',
      mapBg: 'Фон мапи', fixBg: 'Фіксований фон', fFile: 'Файл', fUrl: 'URL',
      promptUrl: 'Введіть посилання на зображення, відео або колір:', secMisc: 'ІНШЕ', fixFeed: 'Фікс кнопки фіду', selTxt: 'Виділення тексту',
      secName: 'ЗМІНА НІКУ', skinSt: 'Стілер скіна', nameSt: 'Стілер ніку / скіна',
      custSw: 'Свої ніки / скіни', menuBind: 'Бінд меню', rst: 'Скинути', none: 'Немає',
      rstAll: 'Скинути все', tut: 'Гайд та навчання', secIf: 'ІНТЕРФЕЙС', geo: 'Геометричний ефект',
      syncSz: 'Масштаб під розмір меню', secCol: 'КОЛЬОРИ', mCol: 'Колір меню',
      bCol: 'Кнопки та скролбар', secLang: 'МОВА', lang: 'Мова'
    },
    es: {
      cfg: 'Ajustes', soloDel: 'Retardo Solo-Trick', ffDel: 'Retardo Fast-Feed', ffDelN: 'Retardo Fast-Feed {n}',
      ff: 'Fast-Feed', ffAdd: 'Añadir Fast-Feed', ffRem: 'Eliminar', trick: 'Truco', secRev: 'AUTO-REV',
      tipRev: 'La célula objetivo debe estar totalmente visible y sin ser tapada por otras células o bordes. Debes desactivar masa, skins y nombres enemigos o fallará. Mantén la cámara quieta y sin hacer zoom. Tiene ~10ms de retardo de proceso con mínimo margen de error, estable en futuras actualizaciones.',
      lock: 'Fijar objetivo', unlock: 'Soltar objetivo', revSp: 'Divisiones Rev', selRev: 'Elegir Rev', secOpt: 'OPTIMIZACIÓN',
      tipOpt: '"Recorte fuera de pantalla" oculta entidades fuera de vista para mejorar los FPS. "Margen de recorte" añade una zona extra para que las células aparezcan suavemente. Si "Recorte fuera de pantalla" está apagado, el margen no tiene efecto.',
      cull: 'Recorte fuera de pantalla', filt: 'Quitar filtros pesados', marg: 'Margen de recorte', secBg: 'MAPA Y FONDO',
      tipBg: 'Cuando el fondo fijo está activo, el fondo del mapa se desactiva y se vuelve gris hasta apagar el modo fijo. Es OBLIGATORIO activar el fondo personalizado durante la partida para evitar riesgos de cierre.',
      mapBg: 'Fondo del mapa', fixBg: 'Fondo fijo', fFile: 'Archivo', fUrl: 'URL',
      promptUrl: 'Introduce imagen, vídeo o color:', secMisc: 'VARIOS', fixFeed: 'Fix botón de feed', selTxt: 'Texto seleccionable',
      secName: 'CAMBIO DE NOMBRE', skinSt: 'Robar skin', nameSt: 'Robar nombre / skin',
      custSw: 'Nombres / skins propios', menuBind: 'Tecla menú', rst: 'Reset', none: 'Ninguno',
      rstAll: 'Restablecer todo', tut: 'Tutorial y guía', secIf: 'INTERFAZ', geo: 'Efecto geométrico',
      syncSz: 'Escalar contenido al menú', secCol: 'COLORES', mCol: 'Color del menú',
      bCol: 'Botones y barra', secLang: 'IDIOMA', lang: 'Idioma'
    },
    pt: {
      cfg: 'Configurações', soloDel: 'Atraso Solo-Trick', ffDel: 'Atraso Fast-Feed', ffDelN: 'Atraso Fast-Feed {n}',
      ff: 'Fast-Feed', ffAdd: 'Adicionar Fast-Feed', ffRem: 'Remover', trick: 'Truque', secRev: 'AUTO-REV',
      tipRev: 'A célula alvo deve estar totalmente visível e sem obstruções ou bordas da tela. Desative massa, skins e nomes inimigos ou causará falsos disparos. Mantenha a câmera parada e não dê zoom. Há ~10ms de atraso de processamento, funcionando de forma estável em futuras atualizações.',
      lock: 'Travar alvo', unlock: 'Cancelar trava', revSp: 'Divisões Rev', selRev: 'Selecionar Rev', secOpt: 'OTIMIZAÇÃO',
      tipOpt: '"Recorte fora da tela" deixa de renderizar entidades fora da tela para aumentar o FPS. "Margem de recorte" define uma zona extra de pré-carregamento. Se "Recorte fora da tela" estiver desligado, a margem não tem efeito.',
      cull: 'Recorte fora da tela', filt: 'Remover filtros pesados', marg: 'Margem de recorte', secBg: 'MAPA E FUNDO',
      tipBg: 'Quando o fundo fixo está ativado, o fundo do mapa é desativado e fica cinza até desligar o modo fixo. É OBRIGATÓRIO ativar o fundo personalizado durante a partida para evitar riscos de crash.',
      mapBg: 'Fundo do mapa', fixBg: 'Fundo fixo', fFile: 'Arquivo', fUrl: 'URL',
      promptUrl: 'Insira imagem, vídeo ou cor:', secMisc: 'OUTROS', fixFeed: 'Corrigir botão feed', selTxt: 'Texto selecionável',
      secName: 'TROCA DE NOME', skinSt: 'Roubar skin', nameSt: 'Roubar nome / skin',
      custSw: 'Nomes / skins próprios', menuBind: 'Tecla do menu', rst: 'Reset', none: 'Nenhum',
      rstAll: 'Restaurar padrão', tut: 'Tutorial e guia', secIf: 'INTERFACE', geo: 'Efeito geométrico',
      syncSz: 'Ajustar conteúdo ao menu', secCol: 'CORES', mCol: 'Cor do menu',
      bCol: 'Botões e barra', secLang: 'IDIOMA', lang: 'Idioma'
    },
    fr: {
      cfg: 'Paramètres', soloDel: 'Délai Solo-Trick', ffDel: 'Délai Fast-Feed', ffDelN: 'Délai Fast-Feed {n}',
      ff: 'Fast-Feed', ffAdd: 'Ajouter Fast-Feed', ffRem: 'Supprimer', trick: 'Trick', secRev: 'AUTO-REV',
      tipRev: 'La cellule cible doit être entièrement visible et non cachée par d\'autres cellules ou les bords. Désactivez la masse, les skins et les pseudos ennemis sous peine de faux déclenchements. Gardez la caméra fixe sans zoomer. Délai de traitement ~10ms avec faible marge d\'erreur.',
      lock: 'Verrouiller cible', unlock: 'Annuler verrou', revSp: 'Divisions Rev', selRev: 'Choisir Rev', secOpt: 'OPTIMISATION',
      tipOpt: '"Masquage hors écran" arrête le rendu hors écran pour gagner des FPS. "Marge de rendu" crée une zone tampon pour un affichage fluide. Si "Masquage hors écran" est désactivé, la marge est sans effet.',
      cull: 'Masquage hors écran', filt: 'Retirer filtres lourds', marg: 'Marge de rendu', secBg: 'CARTE & FOND',
      tipBg: 'Lorsque le fond fixe est activé, le fond de carte est désactivé et grisé jusqu’à la désactivation du mode fixe. Vous DEVEZ activer le fond personnalisé pendant la partie pour éviter tout risque de crash.',
      mapBg: 'Fond de carte', fixBg: 'Fond fixe', fFile: 'Fichier', fUrl: 'URL',
      promptUrl: 'Entrez une image, vidéo ou couleur :', secMisc: 'DIVERS', fixFeed: 'Fix bouton feed', selTxt: 'Texte sélectionnable',
      secName: 'CHANGEUR DE PSEUDO', skinSt: 'Voleur de skin', nameSt: 'Voleur pseudo / skin',
      custSw: 'Pseudos / skins perso', menuBind: 'Touche menu', rst: 'Reset', none: 'Aucun',
      rstAll: 'Réinitialiser', tut: 'Tutoriel & guide', secIf: 'INTERFACE', geo: 'Effet géométrique',
      syncSz: 'Adapter contenu au menu', secCol: 'COULEURS', mCol: 'Couleur du menu',
      bCol: 'Boutons & barre', secLang: 'LANGUE', lang: 'Langue'
    },
    de: {
      cfg: 'Einstellungen', soloDel: 'Solo-Trick Delay', ffDel: 'Fast-Feed Delay', ffDelN: 'Fast-Feed {n} Delay',
      ff: 'Fast-Feed', ffAdd: 'Fast-Feed hinzufügen', ffRem: 'Entfernen', trick: 'Trick', secRev: 'AUTO-REV',
      tipRev: 'Die Zielzelle muss vollständig sichtbar sein und darf nicht verdeckt werden. Masseanzeige, Skins und gegnerische Namen MÜSSEN deaktiviert sein, sonst kommt es zu Fehlauslösungen. Kamera ruhig halten und nicht zoomen. ~10ms Verarbeitungsverzögerung, funktioniert zuverlässig in zukünftigen Updates.',
      lock: 'Ziel fixieren', unlock: 'Fixierung lösen', revSp: 'Rev Splits', selRev: 'Rev wählen', secOpt: 'OPTIMIERUNG',
      tipOpt: '"Ausblendung außerhalb" deaktiviert das Rendering außerhalb des Bildschirms für mehr FPS. "Sicht-Puffer" erstellt eine Pufferzone für flüssiges Erscheinen. Wenn "Ausblendung außerhalb" aus ist, hat der Sicht-Puffer keine Wirkung.',
      cull: 'Ausblendung außerhalb', filt: 'Schwere Filter entfernen', marg: 'Sicht-Puffer', secBg: 'KARTE & HINTERGRUND',
      tipBg: 'Wenn der feste Hintergrund aktiv ist, wird der Kartenhintergrund deaktiviert und ausgegraut, bis der feste Modus aus ist. Der eigene Hintergrund MUSS zwingend während des Spiels eingeschaltet werden, um Abstürze zu vermeiden.',
      mapBg: 'Kartenhintergrund', fixBg: 'Fester Hintergrund', fFile: 'Datei', fUrl: 'URL',
      promptUrl: 'Bild, Video oder Farbe eingeben:', secMisc: 'SONSTIGES', fixFeed: 'Feed-Taste fixen', selTxt: 'Wählbarer Text',
      secName: 'NAMENSWECHSLER', skinSt: 'Skin-Stealer', nameSt: 'Name / Skin Stealer',
      custSw: 'Eigene Namen / Skins', menuBind: 'Menü-Taste', rst: 'Reset', none: 'Keine',
      rstAll: 'Zurücksetzen', tut: 'Anleitung & Guide', secIf: 'OBERFLÄCHE', geo: 'Geometrie-Effekt',
      syncSz: 'Inhalt an Menügröße', secCol: 'FARBEN', mCol: 'Menüfarbe',
      bCol: 'Tasten & Scrollbar', secLang: 'SPRACHE', lang: 'Sprache'
    },
    it: {
      cfg: 'Impostazioni', soloDel: 'Ritardo Solo-Trick', ffDel: 'Ritardo Fast-Feed', ffDelN: 'Ritardo Fast-Feed {n}',
      ff: 'Fast-Feed', ffAdd: 'Aggiungi Fast-Feed', ffRem: 'Rimuovi', trick: 'Trick', secRev: 'AUTO-REV',
      tipRev: 'La cella bersaglio deve essere visibile per intero e non coperta da altre celle o dai bordi. Disattiva massa, skin e nomi nemici o si attiverà per errore. Tieni la visuale ferma senza zoomare. Ritardo di ~10ms con minimo margine di errore, compatibile con futuri aggiornamenti.',
      lock: 'Blocca bersaglio', unlock: 'Annulla blocco', revSp: 'Split Rev', selRev: 'Seleziona Rev', secOpt: 'OTTIMIZZAZIONE',
      tipOpt: '"Taglio fuori schermo" interrompe il rendering fuori schermo per aumentare gli FPS. "Margine di taglio" imposta una zona cuscinetto per far apparire le celle senza scatti. Se "Taglio fuori schermo" è spento, il margine non ha effetto.',
      cull: 'Taglio fuori schermo', filt: 'Rimuovi filtri pesanti', marg: 'Margine di taglio', secBg: 'MAPPA E SFONDO',
      tipBg: 'Quando lo sfondo fisso è attivo, lo sfondo della mappa si disattiva e diventa grigio finché non disattivi la modalità fissa. Lo sfondo personalizzato va attivato OBBLIGATORIAMENTE durante la partita per evitare crash.',
      mapBg: 'Sfondo mappa', fixBg: 'Sfondo fisso', fFile: 'File', fUrl: 'URL',
      promptUrl: 'Inserisci immagine, video o colore:', secMisc: 'VARIE', fixFeed: 'Fix tasto feed', selTxt: 'Testo selezionabile',
      secName: 'CAMBIO NOME', skinSt: 'Ruba skin', nameSt: 'Ruba nome / skin',
      custSw: 'Nomi / skin personalizzati', menuBind: 'Tasto menu', rst: 'Reset', none: 'Nessuno',
      rstAll: 'Ripristina tutto', tut: 'Tutorial e guida', secIf: 'INTERFACCIA', geo: 'Effetto geometrico',
      syncSz: 'Scala contenuto col menu', secCol: 'COLORI', mCol: 'Colore menu',
      bCol: 'Tasti e scrollbar', secLang: 'LINGUA', lang: 'Lingua'
    },
    pl: {
      cfg: 'Ustawienia', soloDel: 'Opóźnienie Solo-Trick', ffDel: 'Opóźnienie Fast-Feed', ffDelN: 'Opóźnienie Fast-Feed {n}',
      ff: 'Fast-Feed', ffAdd: 'Dodaj Fast-Feed', ffRem: 'Usuń', trick: 'Trick', secRev: 'AUTO-REV',
      tipRev: 'Komórka docelowa musi być w pełni widoczna i niezasłonięta przez inne komórki ani krawędzie ekranu. WYŁĄCZ masę, skiny i nicki wrogów, inaczej skrypt będzie działać błędnie. Nie ruszaj kamerą ani zoomem podczas użycia. Opóźnienie ~10ms z małym marginesem błędu.',
      lock: 'Zablokuj cel', unlock: 'Anuluj cel', revSp: 'Podziały Rev', selRev: 'Wybierz Rev', secOpt: 'OPTYMALIZACJA',
      tipOpt: '"Odcinanie poza ekranem" wyłącza renderowanie obiektów poza widokiem dla większego FPS. "Margines odcinania" tworzy bufor dla płynnego pojawiania się komórek. Gdy "Odcinanie poza ekranem" jest wyłączone, margines nie działa.',
      cull: 'Odcinanie poza ekranem', filt: 'Usuń ciężkie filtry', marg: 'Margines odcinania', secBg: 'MAPA I TŁO',
      tipBg: 'Gdy stałe tło jest włączone, tło mapy jest wyłączone i wyszarzone do czasu wyłączenia trybu stałego. Własne tło NALEŻY włączać podczas samej gry, aby uniknąć ryzyka crasha.',
      mapBg: 'Tło mapy', fixBg: 'Stałe tło', fFile: 'Plik', fUrl: 'URL',
      promptUrl: 'Podaj link do obrazu, wideo lub kolor:', secMisc: 'RÓŻNE', fixFeed: 'Fix przycisku feed', selTxt: 'Zaznaczanie tekstu',
      secName: 'ZMIANA NICKU', skinSt: 'Kradzież skina', nameSt: 'Kradzież nicku / skina',
      custSw: 'Własne nicki / skiny', menuBind: 'Klawisz menu', rst: 'Reset', none: 'Brak',
      rstAll: 'Przywróć domyślne', tut: 'Poradnik i instrukcja', secIf: 'INTERFEJS', geo: 'Efekt geometryczny',
      syncSz: 'Skaluj treść do menu', secCol: 'KOLORY', mCol: 'Kolor menu',
      bCol: 'Przyciski i pasek', secLang: 'JĘZYK', lang: 'Język'
    },
    nl: {
      cfg: 'Instellingen', soloDel: 'Solo-Trick Vertraging', ffDel: 'Fast-Feed Vertraging', ffDelN: 'Fast-Feed {n} Vertraging',
      ff: 'Fast-Feed', ffAdd: 'Fast-Feed toevoegen', ffRem: 'Verwijderen', trick: 'Trick', secRev: 'AUTO-REV',
      tipRev: 'De doelcel moet volledig zichtbaar zijn zonder bedekking door andere cellen of schermranden. Schakel massaweergave, skins en vijandelijke namen UIT, anders faalt het script direct. Houd de camera stil en zoom niet. ~10ms vertraging met stabiele werking.',
      lock: 'Doel vergrendelen', unlock: 'Vergrendeling opheffen', revSp: 'Rev Splits', selRev: 'Kies Rev', secOpt: 'OPTIMALISATIE',
      tipOpt: '"Buiten scherm verbergen" stopt het renderen buiten het scherm voor hogere FPS. "Verberg-marge" voegt een bufferzone toe zodat cellen soepel verschijnen. Als "Buiten scherm verbergen" UIT staat, heeft de marge geen effect.',
      cull: 'Buiten scherm verbergen', filt: 'Zware filters strippen', marg: 'Verberg-marge', secBg: 'KAART & ACHTERGROND',
      tipBg: 'Wanneer vaste achtergrond is ingeschakeld, is de kaartachtergrond uitgeschakeld en grijs totdat vaste modus wordt uitgezet. Aangepaste achtergrond MOET tijdens het spelen worden ingeschakeld om crashrisico te voorkomen.',
      mapBg: 'Kaartachtergrond', fixBg: 'Vaste achtergrond', fFile: 'Bestand', fUrl: 'URL',
      promptUrl: 'Voer afbeelding, video of kleur in:', secMisc: 'OVERIG', fixFeed: 'Fix feed-knop', selTxt: 'Selecteerbare tekst',
      secName: 'NAAMWISSELAAR', skinSt: 'Skin steler', nameSt: 'Naam / Skin steler',
      custSw: 'Eigen namen / skins', menuBind: 'Menu toets', rst: 'Reset', none: 'Geen',
      rstAll: 'Standaard herstellen', tut: 'Handleiding & gids', secIf: 'INTERFACE', geo: 'Geometrisch effect',
      syncSz: 'Inhoud meeschalen', secCol: 'KLEUREN', mCol: 'Menukleur',
      bCol: 'Knoppen & schuifbalk', secLang: 'TAAL', lang: 'Taal'
    },
    ro: {
      cfg: 'Setări', soloDel: 'Întârziere Solo-Trick', ffDel: 'Întârziere Fast-Feed', ffDelN: 'Întârziere Fast-Feed {n}',
      ff: 'Fast-Feed', ffAdd: 'Adaugă Fast-Feed', ffRem: 'Elimină', trick: 'Trick', secRev: 'AUTO-REV',
      tipRev: 'Celula țintă trebuie să fie complet vizibilă și neacoperită de alte celule sau de marginile ecranului. Dezactivează masa, skin-urile și numele inamicilor pentru a evita declanșările false. Ține camera nemișcată fără zoom. Întârziere ~10ms cu funcționare stabilă.',
      lock: 'Blochează ținta', unlock: 'Anulează blocarea', revSp: 'Splitări Rev', selRev: 'Alege Rev', secOpt: 'OPTIMIZARE',
      tipOpt: '"Ascundere în afara ecranului" oprește randarea entităților din afara ecranului pentru FPS mai mare. "Marjă randare" adaugă o zonă tampon pentru apariție lină. Dacă "Ascundere în afara ecranului" este oprită, marja nu are efect.',
      cull: 'Ascundere în afara ecranului', filt: 'Elimină filtrele grele', marg: 'Marjă randare', secBg: 'HARTĂ ȘI FUNDAL',
      tipBg: 'Când fundalul fix este activ, fundalul hărții este dezactivat și devine gri până la oprirea modului fix. Fundalul personalizat TREBUIE activat în timpul jocului pentru a evita riscul de crash.',
      mapBg: 'Fundal hartă', fixBg: 'Fundal fix', fFile: 'Fișier', fUrl: 'URL',
      promptUrl: 'Introdu imagine, video sau culoare:', secMisc: 'DIVERSE', fixFeed: 'Fix buton feed', selTxt: 'Text selectabil',
      secName: 'SCHIMBARE NUME', skinSt: 'Furt skin', nameSt: 'Furt nume / skin',
      custSw: 'Nume / skin-uri proprii', menuBind: 'Tastă meniu', rst: 'Reset', none: 'Nimic',
      rstAll: 'Resetează tot', tut: 'Tutorial și ghid', secIf: 'INTERFAȚĂ', geo: 'Efect geometric',
      syncSz: 'Scalare cu meniul', secCol: 'CULORI', mCol: 'Culoare meniu',
      bCol: 'Butoane și bară', secLang: 'LIMBĂ', lang: 'Limbă'
    },
    tr: {
      cfg: 'Ayarlar', soloDel: 'Solo-Trick Gecikmesi', ffDel: 'Fast-Feed Gecikmesi', ffDelN: 'Fast-Feed {n} Gecikmesi',
      ff: 'Fast-Feed', ffAdd: 'Fast-Feed Ekle', ffRem: 'Kaldır', trick: 'Trick', secRev: 'AUTO-REV',
      tipRev: 'Hedef hücre tamamen görünür olmalı ve diğer hücreler veya ekran kenarları tarafından gizlenmemelidir. Kütle gösterimini, skinleri ve rakip isimlerini KAPATMALISINIZ, aksi halde hatalı tetiklenir. Kamerayı sabit tutun ve yakınlaştırmayın. ~10ms işlem gecikmesi vardır.',
      lock: 'Hedefi Kilitle', unlock: 'Kilidi İptal Et', revSp: 'Rev Bölme', selRev: 'Rev Seç', secOpt: 'OPTİMİZASYON',
      tipOpt: '"Ekran Dışı Gizleme", FPS artırmak için ekran dışındaki nesneleri çizmeyi durdurur. "Görüş Payı" hücrelerin akıcı görünmesi için ön yükleme alanı ekler. "Ekran Dışı Gizleme" kapalıysa payın etkisi olmaz.',
      cull: 'Ekran Dışı Gizleme', filt: 'Ağır Filtreleri Kaldır', marg: 'Görüş Payı', secBg: 'HARİTA VE ARKA PLAN',
      tipBg: 'Sabit Arka Plan etkinken Harita Arka Planı devre dışı kalır ve sabit mod kapatılana kadar gri görünür. Çökme riskini önlemek için özel arka planı MUTLAKA oyun içindeyken açın.',
      mapBg: 'Harita Arka Planı', fixBg: 'Sabit Arka Plan', fFile: 'Dosya', fUrl: 'URL',
      promptUrl: 'Resim, video veya renk girin:', secMisc: 'DİĞER', fixFeed: 'Feed Tuşu Düzeltme', selTxt: 'Seçilebilir Metin',
      secName: 'İSİM DEĞİŞTİRİCİ', skinSt: 'Skin Çalıcı', nameSt: 'İsim / Skin Çalıcı',
      custSw: 'Özel İsim / Skin', menuBind: 'Menü Tuşu', rst: 'Sıfırla', none: 'Yok',
      rstAll: 'Varsayılana Sıfırla', tut: 'Rehber ve Öğretici', secIf: 'ARAYÜZ', geo: 'Geometrik Efekt',
      syncSz: 'İçeriği Menüye Ölçekle', secCol: 'RENKLER', mCol: 'Menü Rengi',
      bCol: 'Butonlar ve Kaydırma', secLang: 'DİL', lang: 'Dil'
    },
    ar: {
      cfg: 'الإعدادات', soloDel: 'تأخير Solo-Trick', ffDel: 'تأخير Fast-Feed', ffDelN: 'تأخير Fast-Feed {n}',
      ff: 'Fast-Feed', ffAdd: 'إضافة Fast-Feed', ffRem: 'إزالة', trick: 'تريك', secRev: 'AUTO-REV',
      tipRev: 'يجب أن تكون الخلية المستهدفة مرئية بالكامل وغير مغطاة بخلايا أخرى أو حواف الشاشة. يجب تعطيل عرض الكتلة والسكينات وأسماء الخصوم وإلا سيفشل السكربت. ثبت الكاميرا ولا تقم بالتكبير أثناء الاستخدام. يوجد تأخير معالجة ~10ms ويعمل بثبات في التحديثات القادمة.',
      lock: 'تثبيت الهدف', unlock: 'إلغاء التثبيت', revSp: 'تقسيمات Rev', selRev: 'اختيار Rev', secOpt: 'التحسين',
      tipOpt: '"إخفاء خارج الشاشة" يوقف رسم الكائنات خارج الشاشة لرفع FPS. "هامش الإخفاء" يضيف منطقة إضافية لظهور الخلايا بسلاسة. إذا كان "إخفاء خارج الشاشة" مغلقًا فلن يؤثر الهامش.',
      cull: 'إخفاء خارج الشاشة', filt: 'إزالة الفلاتر الثقيلة', marg: 'هامش الإخفاء', secBg: 'الخريطة والخلفية',
      tipBg: 'عند تفعيل الخلفية الثابتة يتم تعطيل خلفية الخريطة وتتحول للرمادي حتى إيقاف الوضع الثابت. يجب تفعيل الخلفية المخصصة أثناء اللعب الفعلي داخل الخريطة فقط لتجنب خطر الانهيار.',
      mapBg: 'خلفية الخريطة', fixBg: 'خلفية ثابتة', fFile: 'ملف', fUrl: 'رابط',
      promptUrl: 'أدخل رابط صورة أو فيديو أو لون:', secMisc: 'متنوع', fixFeed: 'إصلاح زر الإطعام', selTxt: 'تحديد النص',
      secName: 'تغيير الاسم', skinSt: 'سارق السكن', nameSt: 'سارق الاسم / السكن',
      custSw: 'تبديل أسماء / سكينات', menuBind: 'زر القائمة', rst: 'إعادة', none: 'لا شيء',
      rstAll: 'استعادة الافتراضي', tut: 'الشرح والدليل', secIf: 'الواجهة', geo: 'تأثير هندسي',
      syncSz: 'مزامنة الحجم مع القائمة', secCol: 'الألوان', mCol: 'لون القائمة',
      bCol: 'الأزرار وشريط التمرير', secLang: 'اللغة', lang: 'اللغة'
    },
    hi: {
      cfg: 'सेटिंग्स', soloDel: 'Solo-Trick देरी', ffDel: 'Fast-Feed देरी', ffDelN: 'Fast-Feed {n} देरी',
      ff: 'Fast-Feed', ffAdd: 'Fast-Feed जोड़ें', ffRem: 'हटाएँ', trick: 'ट्रिक', secRev: 'AUTO-REV',
      tipRev: 'लक्ष्य सेल पूरी तरह दिखनी चाहिए और दूसरी सेल या स्क्रीन के किनारों से ढकी नहीं होनी चाहिए। मास डिस्प्ले, स्किन और दुश्मन के नाम बंद करना ज़रूरी है, वरना गलत ट्रिगर होगा। कैमरा स्थिर रखें और ज़ूम न करें। ~10ms प्रोसेसिंग देरी के साथ सभी अपडेट में स्थिर काम करता है।',
      lock: 'लक्ष्य लॉक करें', unlock: 'लॉक रद्द करें', revSp: 'Rev स्प्लिट्स', selRev: 'Rev चुनें', secOpt: 'ऑप्टिमाइज़ेशन',
      tipOpt: '"स्क्रीन के बाहर छिपाएँ" FPS बढ़ाने के लिए स्क्रीन के बाहर के ऑब्जेक्ट रेंडर करना रोकता है। "छिपाने की सीमा" सेल को स्मूथ दिखाने के लिए अतिरिक्त बफ़र देती है। अगर "स्क्रीन के बाहर छिपाएँ" बंद है तो सीमा काम नहीं करेगी।',
      cull: 'स्क्रीन के बाहर छिपाएँ', filt: 'भारी फ़िल्टर हटाएँ', marg: 'छिपाने की सीमा', secBg: 'मैप और बैकग्राउंड',
      tipBg: 'फिक्स्ड बैकग्राउंड चालू होने पर मैप बैकग्राउंड बंद और ग्रे हो जाता है, और बंद करने पर फिर काम करता है। क्रैश से बचने के लिए कस्टम बैकग्राउंड को केवल गेम के दौरान ही चालू करना अनिवार्य है।',
      mapBg: 'मैप बैकग्राउंड', fixBg: 'फिक्स्ड बैकग्राउंड', fFile: 'फ़ाइल', fUrl: 'URL',
      promptUrl: 'इमेज, वीडियो या रंग दर्ज करें:', secMisc: 'अन्य', fixFeed: 'फ़ीड बटन फ़िक्स', selTxt: 'चयन योग्य टेक्स्ट',
      secName: 'नेम चेंजर', skinSt: 'स्किन स्टीलर', nameSt: 'नेम / स्किन स्टीलर',
      custSw: 'कस्टम नाम / स्किन स्विचर', menuBind: 'मेनू कुंजी', rst: 'रीसेट', none: 'कोई नहीं',
      rstAll: 'डिफ़ॉल्ट पर रीसेट', tut: 'ट्यूटोरियल और गाइड', secIf: 'इंटरफ़ेस', geo: 'जियोमेट्रिक इफ़ेक्ट',
      syncSz: 'मेनू आकार से स्केल करें', secCol: 'रंग', mCol: 'मेनू रंग',
      bCol: 'बटन और स्क्रॉलबार', secLang: 'भाषा', lang: 'भाषा'
    },
    zh: {
      cfg: '设置', soloDel: '单人 Trick 延迟', ffDel: 'Fast-Feed 延迟', ffDelN: 'Fast-Feed {n} 延迟',
      ff: 'Fast-Feed', ffAdd: '添加 Fast-Feed', ffRem: '移除', trick: 'Trick', secRev: 'AUTO-REV',
      tipRev: '目标细胞必须完全可见，不能被其他细胞或屏幕边缘遮挡。必须关闭质量显示、皮肤和敌方昵称，否则脚本会立刻误判触发。保持镜头静止且不要缩放。约有 ~10ms 处理延迟及轻微误差，但在后续更新中保持稳定。',
      lock: '锁定目标', unlock: '取消锁定', revSp: 'Rev 分身数', selRev: '选择 Rev', secOpt: '性能优化',
      tipOpt: '"视锥剔除"会停止渲染屏幕外的实体以提升 FPS。"剔除边距"用于设置预加载缓冲区，使细胞平滑出现。关闭"视锥剔除"后，"剔除边距"不会生效。',
      cull: '视锥剔除', filt: '移除高耗滤镜', marg: '剔除边距', secBg: '地图与背景',
      tipBg: '开启固定背景时，地图背景会被禁用并变灰，关闭固定模式后恢复。为避免崩溃风险，必须在游戏过程中开启自定义背景。',
      mapBg: '地图背景', fixBg: '固定背景', fFile: '文件', fUrl: 'URL',
      promptUrl: '输入图片、视频或颜色：', secMisc: '杂项', fixFeed: '修复喂球按键', selTxt: '可选中文本',
      secName: '改名器', skinSt: '皮肤窃取', nameSt: '昵称 / 皮肤窃取',
      custSw: '自定义昵称 / 皮肤轮换', menuBind: '菜单热键', rst: '重置', none: '无',
      rstAll: '恢复默认', tut: '教程与指南', secIf: '界面', geo: '几何粒子效果',
      syncSz: '内容随菜单缩放', secCol: '颜色', mCol: '菜单颜色',
      bCol: '按钮与滚动条', secLang: '语言', lang: '语言'
    },
    ja: {
      cfg: '設定', soloDel: 'Solo-Trick 遅延', ffDel: 'Fast-Feed 遅延', ffDelN: 'Fast-Feed {n} 遅延',
      ff: 'Fast-Feed', ffAdd: 'Fast-Feed 追加', ffRem: '削除', trick: 'Trick', secRev: 'AUTO-REV',
      tipRev: '対象セルは画面端や他のセルに隠れず全体が見える必要があります。質量表示・スキン・敵ニックネームを必ず無効にしてください。カメラを静止させズームも控えてください。約10msの処理遅延はありますが今後のアップデートでも安定動作します。',
      lock: 'ターゲット固定', unlock: '固定解除', revSp: 'Rev 分裂数', selRev: 'Rev 選択', secOpt: '最適化',
      tipOpt: '"画面外カリング"は画面外の描画を止めてFPSを向上させます。"カリング余白"はセルが滑らかに表示される予備領域です。"画面外カリング"がOFFの場合、余白は無効になります。',
      cull: '画面外カリング', filt: '重いフィルター削除', marg: 'カリング余白', secBg: 'マップ＆背景',
      tipBg: '固定背景を有効にするとマップ背景は無効になり、固定モードを解除するまで灰色になります。クラッシュを避けるため、カスタム背景はゲーム中に必ず有効にしてください。',
      mapBg: 'マップ背景', fixBg: '固定背景', fFile: 'ファイル', fUrl: 'URL',
      promptUrl: '画像、動画、または色を入力：', secMisc: 'その他', fixFeed: 'フィードキー修正', selTxt: 'テキスト選択',
      secName: '名前変更', skinSt: 'スキンスティーラー', nameSt: '名前 / スキン盗用',
      custSw: 'カスタム名 / スキン切替', menuBind: 'メニューキー', rst: 'リセット', none: 'なし',
      rstAll: '初期設定に戻す', tut: 'チュートリアル', secIf: 'インターフェース', geo: '幾何学エフェクト',
      syncSz: 'メニューサイズに連動', secCol: 'カラー', mCol: 'メニュー色',
      bCol: 'ボタン＆スクロールバー', secLang: '言語', lang: '言語'
    },
    ko: {
      cfg: '설정', soloDel: 'Solo-Trick 지연', ffDel: 'Fast-Feed 지연', ffDelN: 'Fast-Feed {n} 지연',
      ff: 'Fast-Feed', ffAdd: 'Fast-Feed 추가', ffRem: '삭제', trick: 'Trick', secRev: 'AUTO-REV',
      tipRev: '대상 세포가 다른 세포나 화면 가장자리에 가리지 않고 완전히 보여야 합니다. 질량 표시, 스킨, 상대 닉네임을 반드시 끄세요. 카메라를 고정하고 줌을 변경하지 마세요. ~10ms 처리 지연이 있지만 업데이트와 무관하게 안정적으로 작동합니다.',
      lock: '대상 고정', unlock: '고정 해제', revSp: 'Rev 분열', selRev: 'Rev 선택', secOpt: '최적화',
      tipOpt: '"화면 밖 컬링"은 화면 밖 엔티티 렌더링을 꺼서 FPS를 높입니다. "컬링 여백"은 세포가 부드럽게 나타나도록 여유 버퍼를 줍니다. "화면 밖 컬링"이 꺼져 있으면 여백이 적용되지 않습니다.',
      cull: '화면 밖 컬링', filt: '무거운 필터 제거', marg: '컬링 여백', secBg: '맵 및 배경',
      tipBg: '고정 배경이 활성화되면 맵 배경이 비활성화되어 회색으로 표시됩니다. 충돌 위험을 방지하려면 게임 중에 커스텀 배경을 반드시 활성화하세요.',
      mapBg: '맵 배경', fixBg: '고정 배경', fFile: '파일', fUrl: 'URL',
      promptUrl: '이미지, 동영상 또는 색상 입력:', secMisc: '기타', fixFeed: '피드 버튼 수정', selTxt: '텍스트 선택',
      secName: '닉네임 변경', skinSt: '스킨 스틸러', nameSt: '닉네임 / 스킨 스틸러',
      custSw: '커스텀 닉 / 스킨 전환', menuBind: '메뉴 단축키', rst: '초기화', none: '없음',
      rstAll: '기본값으로 초기화', tut: '튜토리얼 및 가이드', secIf: '인터페이스', geo: '기하학 효과',
      syncSz: '메뉴 크기에 콘텐츠 맞춤', secCol: '색상', mCol: '메뉴 색상',
      bCol: '버튼 및 스크롤바', secLang: '언어', lang: '언어'
    },
    id: {
      cfg: 'Pengaturan', soloDel: 'Jeda Solo-Trick', ffDel: 'Jeda Fast-Feed', ffDelN: 'Jeda Fast-Feed {n}',
      ff: 'Fast-Feed', ffAdd: 'Tambah Fast-Feed', ffRem: 'Hapus', trick: 'Trik', secRev: 'AUTO-REV',
      tipRev: 'Sel target harus terlihat penuh dan tidak tertutup sel lain atau tepi layar. WAJIB matikan tampilan massa, skin, dan nama musuh agar tidak salah pemicu. Jaga kamera tetap diam dan jangan zoom. Ada jeda proses ~10ms dengan sedikit toleransi, tetap stabil di update mendatang.',
      lock: 'Kunci Target', unlock: 'Batal Kunci', revSp: 'Split Rev', selRev: 'Pilih Rev', secOpt: 'OPTIMASI',
      tipOpt: '"Sembunyikan Luar Layar" menghentikan render objek di luar layar untuk menaikkan FPS. "Batas Jarak" menambah zona penyangga agar sel muncul mulus. Jika "Sembunyikan Luar Layar" mati, batas jarak tidak berpengaruh.',
      cull: 'Sembunyikan Luar Layar', filt: 'Hapus Filter Berat', marg: 'Batas Jarak', secBg: 'PETA & LATAR',
      tipBg: 'Saat latar tetap aktif, latar peta dinonaktifkan dan menjadi abu-abu hingga mode tetap dimatikan. Latar kustom WAJIB diaktifkan selama permainan untuk menghindari risiko crash.',
      mapBg: 'Latar Peta', fixBg: 'Latar Tetap', fFile: 'Berkas', fUrl: 'URL',
      promptUrl: 'Masukkan gambar, video, atau warna:', secMisc: 'LAINNYA', fixFeed: 'Perbaiki Tombol Feed', selTxt: 'Teks Dapat Dipilih',
      secName: 'PENGUBAH NAMA', skinSt: 'Pencuri Skin', nameSt: 'Pencuri Nama / Skin',
      custSw: 'Nama / Skin Kustom', menuBind: 'Tombol Menu', rst: 'Reset', none: 'Tidak Ada',
      rstAll: 'Reset ke Default', tut: 'Tutorial & Panduan', secIf: 'ANTARMUKA', geo: 'Efek Geometris',
      syncSz: 'Sesuaikan Ukuran Konten', secCol: 'WARNA', mCol: 'Warna Menu',
      bCol: 'Tombol & Scrollbar', secLang: 'BAHASA', lang: 'Bahasa'
    },
    vi: {
      cfg: 'Cài đặt', soloDel: 'Độ trễ Solo-Trick', ffDel: 'Độ trễ Fast-Feed', ffDelN: 'Độ trễ Fast-Feed {n}',
      ff: 'Fast-Feed', ffAdd: 'Thêm Fast-Feed', ffRem: 'Xóa', trick: 'Trick', secRev: 'AUTO-REV',
      tipRev: 'Tế bào mục tiêu phải hiển thị đầy đủ, không bị che bởi tế bào khác hay mép màn hình. BẮT BUỘC tắt hiển thị khối lượng, skin và tên địch để tránh kích hoạt nhầm. Giữ camera đứng yên và không zoom. Có độ trễ xử lý ~10ms nhưng hoạt động ổn định qua các bản cập nhật.',
      lock: 'Khóa mục tiêu', unlock: 'Hủy khóa', revSp: 'Số lần Rev', selRev: 'Chọn Rev', secOpt: 'TỐI ƯU HÓA',
      tipOpt: '"Ẩn ngoài màn hình" ngừng vẽ các vật thể ngoài màn hình để tăng FPS. "Vùng đệm" giúp tế bào xuất hiện mượt mà hơn. Nếu tắt "Ẩn ngoài màn hình", vùng đệm sẽ không có tác dụng.',
      cull: 'Ẩn ngoài màn hình', filt: 'Bỏ bộ lọc nặng', marg: 'Vùng đệm', secBg: 'BẢN ĐỒ & NỀN',
      tipBg: 'Khi bật Nền cố định, Nền bản đồ sẽ tạm tắt và chuyển màu xám cho đến khi tắt chế độ cố định. BẮT BUỘC bật nền tùy chỉnh trong trận đấu để tránh nguy cơ văng game.',
      mapBg: 'Nền bản đồ', fixBg: 'Nền cố định', fFile: 'Tệp', fUrl: 'URL',
      promptUrl: 'Nhập ảnh, video hoặc màu sắc:', secMisc: 'KHÁC', fixFeed: 'Sửa nút Feed', selTxt: 'Chọn văn bản',
      secName: 'ĐỔI TÊN', skinSt: 'Sao chép Skin', nameSt: 'Sao chép Tên / Skin',
      custSw: 'Đổi Tên / Skin tùy chỉnh', menuBind: 'Phím mở Menu', rst: 'Đặt lại', none: 'Không',
      rstAll: 'Khôi phục mặc định', tut: 'Hướng dẫn sử dụng', secIf: 'GIAO DIỆN', geo: 'Hiệu ứng hình học',
      syncSz: 'Co giãn theo cỡ Menu', secCol: 'MÀU SẮC', mCol: 'Màu Menu',
      bCol: 'Nút & Thanh cuộn', secLang: 'NGÔN NGỮ', lang: 'Ngôn ngữ'
    },
    th: {
      cfg: 'การตั้งค่า', soloDel: 'หน่วงเวลา Solo-Trick', ffDel: 'หน่วงเวลา Fast-Feed', ffDelN: 'หน่วงเวลา Fast-Feed {n}',
      ff: 'Fast-Feed', ffAdd: 'เพิ่ม Fast-Feed', ffRem: 'ลบ', trick: 'ทริก', secRev: 'AUTO-REV',
      tipRev: 'เซลล์เป้าหมายต้องมองเห็นได้เต็มวง ไม่ถูกบังด้วยเซลล์อื่นหรือขอบจอ ต้องปิดการแสดงมวล สกิน และชื่อศัตรู มิฉะนั้นจะทำงานผิดพลาด ให้นิ่งกล้องไว้และอย่าซูมระหว่างใช้งาน มีดีเลย์ประมวลผล ~10ms แต่เสถียรกับทุกอัปเดต',
      lock: 'ล็อกเป้าหมาย', unlock: 'ยกเลิกล็อก', revSp: 'จำนวนแบ่ง Rev', selRev: 'เลือก Rev', secOpt: 'ปรับแต่งประสิทธิภาพ',
      tipOpt: '"ซ่อนนอกหน้าจอ" จะหยุดเรนเดอร์วัตถุนอกจอเพื่อเพิ่ม FPS "ขอบเขตเผื่อ" ช่วยให้เซลล์ปรากฏอย่างลื่นไหล หากปิด "ซ่อนนอกหน้าจอ" ค่าขอบเขตจะไม่มีผล',
      cull: 'ซ่อนนอกหน้าจอ', filt: 'ปิดฟิลเตอร์หนัก', marg: 'ขอบเขตเผื่อ', secBg: 'แผนที่และพื้นหลัง',
      tipBg: 'เมื่อเปิดพื้นหลังคงที่ พื้นหลังแผนที่จะถูกปิดและเป็นสีเทาจนกว่าจะปิดโหมดพื้นหลังคงที่ ต้องเปิดพื้นหลังแบบกำหนดเองระหว่างเล่นเกม เพื่อป้องกันความเสี่ยงเกมแครช',
      mapBg: 'พื้นหลังแผนที่', fixBg: 'พื้นหลังคงที่', fFile: 'ไฟล์', fUrl: 'URL',
      promptUrl: 'ใส่ลิงก์รูป วิดีโอ หรือสี:', secMisc: 'เบ็ดเตล็ด', fixFeed: 'แก้ปุ่มฟีดค้าง', selTxt: 'เลือกข้อความได้',
      secName: 'เปลี่ยนชื่อ', skinSt: 'ขโมยสกิน', nameSt: 'ขโมยชื่อ / สกิน',
      custSw: 'สลับชื่อ / สกินที่ตั้งเอง', menuBind: 'ปุ่มเปิดเมนู', rst: 'รีเซ็ต', none: 'ไม่มี',
      rstAll: 'รีเซ็ตเป็นค่าเริ่มต้น', tut: 'คู่มือและวิธีใช้', secIf: 'อินเทอร์เฟซ', geo: 'เอฟเฟกต์เรขาคณิต',
      syncSz: 'ปรับขนาดเนื้อหาตามเมนู', secCol: 'สี', mCol: 'สีเมนู',
      bCol: 'ปุ่มและแถบเลื่อน', secLang: 'ภาษา', lang: 'ภาษา'
    }
  };

  if (typeof m9TvL2sP.lang !== 'string' || !t3LangDict[m9TvL2sP.lang]) m9TvL2sP.lang = 'en';

  function k3Tr(k, n) {
    const d = t3LangDict[m9TvL2sP.lang] || t3LangDict.en;
    let s = d[k] !== undefined ? d[k] : (t3LangDict.en[k] || k);
    if (n !== undefined) s = s.replace('{n}', String(n));
    return s;
  }
  delete m9TvL2sP.autoDelay2;
  delete m9TvL2sP.keyAuto2;
  delete m9TvL2sP.partyLeaveBtn;
  if (m9TvL2sP.innerBgEnabled !== undefined && !hasSavedMapBgEnabled) {
    m9TvL2sP.mapBgEnabled = Boolean(m9TvL2sP.innerBgEnabled);
  }
  if (m9TvL2sP.innerBgSrc && !m9TvL2sP.mapBgSrc) {
    m9TvL2sP.mapBgSrc = m9TvL2sP.innerBgSrc;
  }
  delete m9TvL2sP.innerBgEnabled;
  delete m9TvL2sP.innerBgSrc;
  delete m9TvL2sP.outerBgEnabled;
  delete m9TvL2sP.outerBgSrc;

  function x3QnK8wR() {
    try { localStorage.setItem('gota_macro_overlay_v2', JSON.stringify(m9TvL2sP)); } catch (e) {}
  }

  function k2DbOp() {
    return new Promise((res, rej) => {
      if (!window.indexedDB) { rej(); return; }
      const rq = indexedDB.open('gota_macro_bg_db', 1);
      rq.onupgradeneeded = () => {
        const db = rq.result;
        if (!db.objectStoreNames.contains('bg')) db.createObjectStore('bg');
      };
      rq.onsuccess = () => res(rq.result);
      rq.onerror = () => rej(rq.error);
    });
  }

  function k2DbPut(k, file, isVid) {
    return k2DbOp().then(db => new Promise((res, rej) => {
      const tx = db.transaction('bg', 'readwrite');
      tx.objectStore('bg').put({ file, isVid }, k);
      tx.oncomplete = () => { db.close(); res(); };
      tx.onerror = () => { db.close(); rej(tx.error); };
    })).catch(() => {});
  }

  function k2DbGet(k) {
    return k2DbOp().then(db => new Promise((res, rej) => {
      const tx = db.transaction('bg', 'readonly');
      const rq = tx.objectStore('bg').get(k);
      rq.onsuccess = () => { db.close(); res(rq.result || null); };
      rq.onerror = () => { db.close(); rej(rq.error); };
    })).catch(() => null);
  }

  function k2DbDel(k) {
    return k2DbOp().then(db => new Promise((res, rej) => {
      const tx = db.transaction('bg', 'readwrite');
      tx.objectStore('bg').delete(k);
      tx.oncomplete = () => { db.close(); res(); };
      tx.onerror = () => { db.close(); rej(tx.error); };
    })).catch(() => {});
  }

  function k2DbClr() {
    return k2DbOp().then(db => new Promise((res, rej) => {
      const tx = db.transaction('bg', 'readwrite');
      tx.objectStore('bg').clear();
      tx.oncomplete = () => { db.close(); res(); };
      tx.onerror = () => { db.close(); rej(tx.error); };
    })).catch(() => {});
  }

  function k2DataToBlob(uri) {
    try {
      const clean = uri.split('#')[0];
      const sp = clean.indexOf(',');
      if (sp < 0) return null;
      const meta = clean.slice(5, sp);
      const mime = meta.split(';')[0] || 'application/octet-stream';
      const raw = meta.includes(';base64') ? atob(clean.slice(sp + 1)) : decodeURIComponent(clean.slice(sp + 1));
      const u8 = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) u8[i] = raw.charCodeAt(i);
      return new Blob([u8], { type: mime });
    } catch (_) {
      return null;
    }
  }

  window.setFixedBackground = function (src) {
    u4TkQ = d4XwN(u4TkQ, src);
    if (b7DrawFn) b7DrawFn();
  };
  window.toggleFixedBackground = function (st) {
    m9TvL2sP.fixedBackgroundEnabled = Boolean(st);
    x3QnK8wR();
    if (document.getElementById('macro-window')) r8QnM4tL();
    if (b7DrawFn) b7DrawFn();
  };

  window.setMapBackground = function (src) {
    q8MwP = d4XwN(q8MwP, src);
    if (b7DrawFn) b7DrawFn();
  };

  function k2LoadBg(srcKey, dbKey, setFn, enKey) {
    const val = m9TvL2sP[srcKey];
    if (!val) {
      m9TvL2sP[enKey] = false;
      return;
    }
    if (val === 'idb:' + dbKey) {
      k2DbGet(dbKey).then(rec => {
        if (rec && rec.file && m9TvL2sP[srcKey] === 'idb:' + dbKey) {
          setFn(URL.createObjectURL(rec.file) + (rec.isVid ? '#type=video' : '#type=image'));
        } else if (m9TvL2sP[srcKey] === 'idb:' + dbKey) {
          m9TvL2sP[srcKey] = null;
          m9TvL2sP[enKey] = false;
          x3QnK8wR();
          if (document.getElementById('macro-window')) r8QnM4tL();
        }
      });
      return;
    }
    if (typeof val === 'string' && val.startsWith('data:') && val.length > 4096) {
      const bl = k2DataToBlob(val);
      if (bl) {
        const isVid = val.includes('#type=video') || bl.type.startsWith('video/');
        m9TvL2sP[srcKey] = 'idb:' + dbKey;
        x3QnK8wR();
        k2DbPut(dbKey, bl, isVid);
        setFn(URL.createObjectURL(bl) + (isVid ? '#type=video' : '#type=image'));
        return;
      }
    }
    setFn(val);
  }

  k2LoadBg('mapBgSrc', 'map', window.setMapBackground, 'mapBgEnabled');
  k2LoadBg('fixedBgSrc', 'fixed', window.setFixedBackground, 'fixedBackgroundEnabled');

  const v8WpM2tL = Math.random().toString(36).substring(2);
  const q5RzL9wK = new BroadcastChannel('gota_multibox_overlay_v2_sync');

  let c7TnW1xP = null, b3SilBuf = null, g8KeepOn = false;
  function p2LxQ8vM() {
    try {
      if (!c7TnW1xP) {
        const aCls = window.AudioContext || window.webkitAudioContext;
        if (!aCls) return;
        try { c7TnW1xP = new aCls({ latencyHint: 'interactive' }); } catch (_) { c7TnW1xP = new aCls(); }
        const osc = c7TnW1xP.createOscillator(), gn = c7TnW1xP.createGain();
        osc.type = 'sine';
        osc.frequency.value = 25;
        gn.gain.value = 0.002;
        osc.connect(gn); gn.connect(c7TnW1xP.destination); osc.start();
        b3SilBuf = c7TnW1xP.createBuffer(1, 128, c7TnW1xP.sampleRate);
        c7TnW1xP.onstatechange = () => {
          if (c7TnW1xP && c7TnW1xP.state === 'suspended' && g8KeepOn) {
            c7TnW1xP.resume().catch(() => {});
          }
        };
      }
      g8KeepOn = true;
      if (c7TnW1xP.state === 'suspended') c7TnW1xP.resume().catch(() => {});
    } catch (e) {}
  }
  ['keydown', 'pointerdown', 'mousedown', 'touchstart', 'focus'].forEach(ev => window.addEventListener(ev, p2LxQ8vM, { passive: true, capture: true }));
  document.addEventListener('visibilitychange', () => { if (g8KeepOn) p2LxQ8vM(); }, { passive: true });

  const g6VwN3tK = new Worker(URL.createObjectURL(new Blob([`
      let hB=null;
      self.onmessage=e=>{
        const m=e.data;
        if(m.type==='startHeartbeat'){ if(!hB) hB=setInterval(()=>self.postMessage({type:'pulse'}),m.interval||30); }
        else if(m.type==='stopHeartbeat'){ if(hB){ clearInterval(hB); hB=null; } }
      };
    `], { type: 'application/javascript' })));

  g6VwN3tK.onmessage = function (e) {
    const m = e.data;
    if (m.type === 'pulse') {
      if (!k4FeedLock && hSt2xK9m && (!document.hasFocus() || document.hidden)) {
        hEv2xK9m(hSt2xK9m, hSt2xK9m.kind === 'key' ? 'keydown' : 'mousedown');
      }
      if ((!document.hasFocus() || document.hidden) && f5TxL9wK && !b5TxM1wP) {
        b5TxM1wP = true;
        try { j8PnL4wV++; p3WnK7vT(); } finally { b5TxM1wP = false; }
      }
    }
  };
  g6VwN3tK.postMessage({ type: 'startHeartbeat', interval: 30 });

  const f2QpL8xN = new Worker(URL.createObjectURL(new Blob([`
      const q=new Map();
      let t=null;
      function p(){
        t=null;
        const n=performance.now();
        let m=Infinity;
        q.forEach((e,i)=>{
          const r=e-n;
          if(r<=2.5){ q.delete(i); self.postMessage(i); }
          else if(r<m) m=r;
        });
        if(q.size) t=setTimeout(p,Math.max(1,Math.ceil(m)));
      }
      self.onmessage=e=>{
        const d=e.data;
        if(d.c){ q.delete(d.c); }
        else { q.set(d.i,performance.now()+d.w); }
        if(t!==null){ clearTimeout(t); t=null; }
        if(q.size) p();
      };
    `], { type: 'application/javascript' })));

  let x6RnL3wM = 0;
  const k8VpT4sQ = new Map();

  f2QpL8xN.onmessage = function (e) {
    const cb = k8VpT4sQ.get(e.data);
    if (cb) cb();
  };

  function k7RunDelay(ms, cb, minMs) {
    p2LxQ8vM();
    const w = Math.max(minMs || 1, Number(ms) || 0);
    const i = ++x6RnL3wM;
    const tgt = performance.now() + w;
    let done = false;
    let aSrc = null;

    function cln() {
      k8VpT4sQ.delete(i);
      f2QpL8xN.postMessage({ c: i });
      if (aSrc) {
        const s = aSrc;
        aSrc = null;
        try { s.onended = null; s.stop(0); s.disconnect(); } catch (_) {}
      }
    }

    function armAudio(remMs) {
      if (done || aSrc || !c7TnW1xP || c7TnW1xP.state !== 'running' || !b3SilBuf) return;
      try {
        const s = c7TnW1xP.createBufferSource();
        s.buffer = b3SilBuf;
        s.loop = true;
        s.connect(c7TnW1xP.destination);
        aSrc = s;
        s.onended = () => {
          if (aSrc === s) aSrc = null;
          try { s.disconnect(); } catch (_) {}
          if (!done) chk();
        };
        s.start(0);
        s.stop(c7TnW1xP.currentTime + Math.max(0.001, (remMs + 2.5) / 1000));
      } catch (_) { aSrc = null; }
    }

    function chk() {
      if (done) return;
      const rem = tgt - performance.now();
      if (rem <= 2.0) {
        done = true;
        cln();
        cb();
        return;
      }
      f2QpL8xN.postMessage({ i, w: rem });
      armAudio(rem);
    }

    k8VpT4sQ.set(i, chk);
    f2QpL8xN.postMessage({ i, w });
    armAudio(w);
    if (c7TnW1xP && c7TnW1xP.state === 'suspended') {
      c7TnW1xP.resume().then(() => {
        if (!done && !aSrc) {
          const r = tgt - performance.now();
          if (r <= 2.0) chk();
          else armAudio(r);
        }
      }).catch(() => {});
    }
  }

  function n7KwQ2vL(ms, cb) {
    k7RunDelay(Math.max(50, Number(ms) || 800), cb, 50);
  }

  function z7PxM4wK(ms, cb) {
    k7RunDelay(Math.max(50, Number(ms) || 800), cb, 50);
  }

  function d2TinyWait(ms, cb) {
    k7RunDelay(Math.max(1, Number(ms) || 1), cb, 1);
  }

  const u9PxL2wT = new Set();
  window.addEventListener('keydown', e => {
    const tg = e.target, tn = tg && tg.tagName ? tg.tagName.toLowerCase() : '';
    if ((tn === 'input' && tg.type !== 'checkbox') || tn === 'textarea' || (tg && tg.isContentEditable)) return;
    if (e.isTrusted && !d5TxL2wV(e.code) && e.code !== m9TvL2sP.keyMenu && e.code !== m9TvL2sP.keyHoldSpam) {
      u9PxL2wT.add(e.keyCode);
    }
  }, true);
  window.addEventListener('keyup', e => { if (e.isTrusted) u9PxL2wT.delete(e.keyCode); }, true);
  window.addEventListener('blur', () => u9PxL2wT.clear());

  const g2BindTbl = {
    sw: 9,
    ej: 1,
    sp: 32,
    arr: [0, 32, -1, -1, -1, -1, -1, -1, -1],
    plans: [null],
    rev: { kc: 32, n: 2 }
  };

  const m9MbSt = {
    on: false,
    box1Id: '',
    box2Id: '',
    activeId: '',
    activeBox: 0,
    matchGen: 0,
    swSeq: 0
  };

  const v5PeerMap = new Map();
  let k4MbBusy = false;
  let k4PidEl = null;
  let k4CbEl = null;

  function g4KcMeta(kc) {
    if (kc >= 1 && kc <= 5) {
      const bm = { 1: 0, 2: 1, 3: 2, 4: 3, 5: 4 };
      return { isMouse: true, btn: bm[kc] !== undefined ? bm[kc] : 0, kc: kc };
    }
    const spMap = {
      8: ['Backspace', 'Backspace'],
      9: ['Tab', 'Tab'],
      13: ['Enter', 'Enter'],
      16: ['ShiftLeft', 'Shift'],
      17: ['ControlLeft', 'Control'],
      18: ['AltLeft', 'Alt'],
      19: ['Pause', 'Pause'],
      20: ['CapsLock', 'CapsLock'],
      27: ['Escape', 'Escape'],
      32: ['Space', ' '],
      33: ['PageUp', 'PageUp'],
      34: ['PageDown', 'PageDown'],
      35: ['End', 'End'],
      36: ['Home', 'Home'],
      37: ['ArrowLeft', 'ArrowLeft'],
      38: ['ArrowUp', 'ArrowUp'],
      39: ['ArrowRight', 'ArrowRight'],
      40: ['ArrowDown', 'ArrowDown'],
      45: ['Insert', 'Insert'],
      46: ['Delete', 'Delete'],
      106: ['NumpadMultiply', '*'],
      107: ['NumpadAdd', '+'],
      109: ['NumpadSubtract', '-'],
      110: ['NumpadDecimal', '.'],
      111: ['NumpadDivide', '/'],
      186: ['Semicolon', ';'],
      187: ['Equal', '='],
      188: ['Comma', ','],
      189: ['Minus', '-'],
      190: ['Period', '.'],
      191: ['Slash', '/'],
      192: ['Backquote', '`'],
      219: ['BracketLeft', '['],
      220: ['Backslash', '\\'],
      221: ['BracketRight', ']'],
      222: ['Quote', "'"]
    };
    if (spMap[kc]) return { isMouse: false, code: spMap[kc][0], key: spMap[kc][1], kc: kc };
    if (kc >= 65 && kc <= 90) {
      const ch = String.fromCharCode(kc);
      return { isMouse: false, code: 'Key' + ch, key: ch.toLowerCase(), kc: kc };
    }
    if (kc >= 48 && kc <= 57) {
      const ch = String.fromCharCode(kc);
      return { isMouse: false, code: 'Digit' + ch, key: ch, kc: kc };
    }
    if (kc >= 96 && kc <= 105) {
      const d = String(kc - 96);
      return { isMouse: false, code: 'Numpad' + d, key: d, kc: kc };
    }
    if (kc >= 112 && kc <= 123) {
      const f = 'F' + (kc - 111);
      return { isMouse: false, code: f, key: f, kc: kc };
    }
    return { isMouse: false, code: '', key: '', kc: kc };
  }

  function n4TxtToKc(tx) {
    const s = String(tx || '').trim().toUpperCase();
    if (!s) return -1;
    const mp = {
      NONE: -1, UNBOUND: -1, NULL: -1,
      SPACE: 32, SPACEBAR: 32, TAB: 9, ENTER: 13, RETURN: 13, BACKSPACE: 8,
      SHIFT: 16, LSHIFT: 16, RSHIFT: 16, CTRL: 17, LCTRL: 17, CONTROL: 17,
      ALT: 18, LALT: 18, CAPS: 20, CAPSLOCK: 20, ESC: 27, ESCAPE: 27,
      INS: 45, INSERT: 45, DEL: 46, DELETE: 46, HOME: 36, END: 35,
      PGUP: 33, PAGEUP: 33, PGDN: 34, PAGEDOWN: 34,
      LEFT: 37, ARROWLEFT: 37, UP: 38, ARROWUP: 38,
      RIGHT: 39, ARROWRIGHT: 39, DOWN: 40, ARROWDOWN: 40,
      MOUSE1: 1, LMB: 1, MOUSE2: 2, MMB: 2, MOUSE3: 3, RMB: 3, MOUSE4: 4, MOUSE5: 5,
      ';': 186, '=': 187, ',': 188, '-': 189, '.': 190, '/': 191,
      '`': 192, '[': 219, '\\': 220, ']': 221, "'": 222
    };
    if (mp[s] !== undefined) return mp[s];
    if (s.length === 1) {
      const c = s.charCodeAt(0);
      if ((c >= 65 && c <= 90) || (c >= 48 && c <= 57)) return c;
    }
    const mm = s.match(/^MOUSE\s*([1-5])$/);
    if (mm) return parseInt(mm[1], 10);
    const fm = s.match(/^F(\d{1,2})$/);
    if (fm) {
      const fn = parseInt(fm[1], 10);
      if (fn >= 1 && fn <= 12) return 111 + fn;
    }
    const nm = s.match(/^NUM(?:PAD)?\s*(\d)$/);
    if (nm) return 96 + parseInt(nm[1], 10);
    return 0;
  }

  function k6RebuildPlans() {
    const fb = g2BindTbl.sp > 0 ? g2BindTbl.sp : 32;
    for (let p = 1; p <= 8; p++) {
      const bk = g2BindTbl.arr[p];
      g2BindTbl.plans[p] = bk > 0 ? { kc: bk, n: 1 } : { kc: fb, n: p };
    }
    const bl = parseInt(m9TvL2sP.revSplits, 10) || 4;
    const rp = Math.max(1, Math.min(8, Math.round(Math.log2(bl))));
    g2BindTbl.rev = g2BindTbl.plans[rp];
  }

  function b6SyncKb(useDom) {
    const ks = ['kSplit', 'kDoubleSplit', 'kTripleSplit', 'kQuadSplit', 'kPentaSplit', 'kHexaSplit', 'kSeptiSplit', 'kOctoSplit'];
    try {
      const raw = localStorage.getItem('keybinds');
      if (raw) {
        const kb = JSON.parse(raw);
        if (kb && typeof kb === 'object') {
          for (let i = 0; i < ks.length; i++) {
            const v = Number(kb[ks[i]]);
            if (Number.isFinite(v)) g2BindTbl.arr[i + 1] = v;
          }
          const sw = Number(kb.kMultiboxSwitch);
          if (Number.isFinite(sw)) g2BindTbl.sw = sw;
          const ej = Number(kb.kEjectMass);
          if (Number.isFinite(ej)) g2BindTbl.ej = ej;
        }
      }
    } catch (_) {}
    if (useDom) {
      const pr = document.getElementById('kContextMenu') || document.getElementById('kEjectMass') || document.getElementById('kSplit');
      if (pr && pr.textContent && pr.textContent.trim()) {
        for (let i = 0; i < ks.length; i++) {
          const b = document.getElementById(ks[i]);
          if (b) {
            const kc = n4TxtToKc(b.textContent);
            if (kc === -1 || kc > 0) g2BindTbl.arr[i + 1] = kc;
          }
        }
        const sb = document.getElementById('kMultiboxSwitch');
        if (sb) {
          const skc = n4TxtToKc(sb.textContent);
          if (skc === -1 || skc > 0) g2BindTbl.sw = skc;
        }
        const eb = document.getElementById('kEjectMass');
        if (eb) {
          const ekc = n4TxtToKc(eb.textContent);
          if (ekc === -1 || ekc > 0) g2BindTbl.ej = ekc;
        }
      }
    }
    g2BindTbl.sp = g2BindTbl.arr[1] > 0 ? g2BindTbl.arr[1] : 32;
    k6RebuildPlans();
  }

  function m4SyncMbOpt(useDom) {
    if (useDom) {
      if (!k4CbEl || !document.contains(k4CbEl)) k4CbEl = document.getElementById('cMultibox');
      if (k4CbEl) {
        m9MbSt.on = Boolean(k4CbEl.checked);
        return;
      }
    }
    try {
      const raw = localStorage.getItem('options');
      if (raw) {
        const op = JSON.parse(raw);
        if (op && typeof op === 'object') m9MbSt.on = Boolean(op.cMultibox);
      }
    } catch (_) {}
  }

  function m4IsMbOn() {
    if (!k4CbEl || !document.contains(k4CbEl)) k4CbEl = document.getElementById('cMultibox');
    if (k4CbEl) m9MbSt.on = Boolean(k4CbEl.checked);
    return m9MbSt.on;
  }

  function g4PidEl() {
    if (k4PidEl && document.contains(k4PidEl)) return k4PidEl;
    k4PidEl = document.getElementById('playerId');
    return k4PidEl;
  }

  function g5ReadPid() {
    const el = g4PidEl();
    if (!el) return '';
    return String(el.textContent || '').trim();
  }

  function u2SyncPidState() {
    const id = g5ReadPid();
    m9MbSt.activeId = id;
    if (!id || id === '0') {
      m9MbSt.activeBox = 0;
      return;
    }
    if (!m9MbSt.box1Id) {
      m9MbSt.box1Id = id;
      m9MbSt.activeBox = 1;
      return;
    }
    if (id !== m9MbSt.box1Id && !m9MbSt.box2Id) {
      const n1 = parseInt(m9MbSt.box1Id, 10);
      const n2 = parseInt(id, 10);
      if (Number.isFinite(n1) && Number.isFinite(n2) && n2 < n1) {
        m9MbSt.box2Id = m9MbSt.box1Id;
        m9MbSt.box1Id = id;
      } else {
        m9MbSt.box2Id = id;
      }
    }
    if (id === m9MbSt.box1Id) m9MbSt.activeBox = 1;
    else if (id === m9MbSt.box2Id) m9MbSt.activeBox = 2;
    else m9MbSt.activeBox = 0;
  }

  function w3WaitPidFlip(prevId, maxMs, cb) {
    u2SyncPidState();
    const cur = m9MbSt.activeId;
    if (cur !== prevId) {
      cb(true, cur);
      return;
    }
    const el = g4PidEl();
    let done = false;
    let ob = null;
    const fin = ok => {
      if (done) return;
      done = true;
      if (ob) ob.disconnect();
      u2SyncPidState();
      cb(ok, m9MbSt.activeId);
    };
    if (el && typeof MutationObserver === 'function') {
      ob = new MutationObserver(() => {
        if (g5ReadPid() !== prevId) fin(true);
      });
      ob.observe(el, { childList: true, characterData: true, subtree: true });
    }
    d2TinyWait(maxMs, () => fin(g5ReadPid() !== prevId));
  }

  function h4HasPeerTab() {
    const nw = performance.now();
    let alive = false;
    v5PeerMap.forEach((ts, id) => {
      if (nw - ts > 10000) v5PeerMap.delete(id);
      else alive = true;
    });
    return alive;
  }

  function v5PingPeers() {
    try {
      q5RzL9wK.postMessage({ type: 'MB_PING', senderId: v8WpM2tL });
    } catch (_) {}
  }

  b6SyncKb(false);
  m4SyncMbOpt(false);

  function w5PzR8tM(key, times) {
    const kc = Number(key) || 32;
    const mt = g4KcMeta(kc);
    const cv = t8VwM4xK();
    if (mt.isMouse) {
      const tg = cv || document;
      const wh = mt.btn + 1;
      const btns = [1, 4, 2, 8, 16][mt.btn] || 1;
      for (let i = 0; i < times; i++) {
        const md = new MouseEvent('mousedown', { button: mt.btn, buttons: btns, clientX: t2QnL9wP, clientY: b8VmK3xT, bubbles: true, cancelable: true });
        Object.defineProperty(md, 'which', { value: wh, writable: false });
        if (typeof hSP2xK9m !== 'undefined') hSP2xK9m.add(md);
        tg.dispatchEvent(md);
        const mu = new MouseEvent('mouseup', { button: mt.btn, buttons: 0, clientX: t2QnL9wP, clientY: b8VmK3xT, bubbles: true, cancelable: true });
        Object.defineProperty(mu, 'which', { value: wh, writable: false });
        if (typeof hSP2xK9m !== 'undefined') hSP2xK9m.add(mu);
        tg.dispatchEvent(mu);
      }
      return;
    }
    const actEl = document.activeElement;
    if (actEl && actEl.tagName === 'BUTTON' && actEl.blur) actEl.blur();
    const tg = document;
    for (let i = 0; i < times; i++) {
      const kd = new KeyboardEvent('keydown', { code: mt.code, key: mt.key, bubbles: true, cancelable: true });
      Object.defineProperty(kd, 'keyCode', { value: kc, writable: false });
      Object.defineProperty(kd, 'which', { value: kc, writable: false });
      if (typeof hSP2xK9m !== 'undefined') hSP2xK9m.add(kd);
      tg.dispatchEvent(kd);
      const ku = new KeyboardEvent('keyup', { code: mt.code, key: mt.key, bubbles: true, cancelable: true });
      Object.defineProperty(ku, 'keyCode', { value: kc, writable: false });
      Object.defineProperty(ku, 'which', { value: kc, writable: false });
      if (typeof hSP2xK9m !== 'undefined') hSP2xK9m.add(ku);
      tg.dispatchEvent(ku);
    }
    if (u9PxL2wT.has(kc)) {
      const kh = new KeyboardEvent('keydown', { code: mt.code, key: mt.key, bubbles: true, cancelable: true });
      Object.defineProperty(kh, 'keyCode', { value: kc, writable: false });
      Object.defineProperty(kh, 'which', { value: kc, writable: false });
      if (typeof hSP2xK9m !== 'undefined') hSP2xK9m.add(kh);
      tg.dispatchEvent(kh);
    }
  }

  let t2QnL9wP = window.innerWidth / 2, b8VmK3xT = window.innerHeight / 2;
  window.addEventListener('mousemove', e => { t2QnL9wP = e.clientX; b8VmK3xT = e.clientY; }, true);

  q5RzL9wK.onmessage = function (ev) {
    const dt = ev.data;
    if (!dt || dt.senderId === v8WpM2tL) return;
    if (dt.type === 'MB_PING') {
      v5PeerMap.set(dt.senderId, performance.now());
      try { q5RzL9wK.postMessage({ type: 'MB_PONG', senderId: v8WpM2tL }); } catch (_) {}
      return;
    }
    if (dt.type === 'MB_PONG') {
      v5PeerMap.set(dt.senderId, performance.now());
      return;
    }
    if (dt.type === 'MB_BYE') {
      v5PeerMap.delete(dt.senderId);
      return;
    }
    if (document.hasFocus() && !document.hidden) return;

    if (dt.type === 'EXECUTE_BACKGROUND_SPLIT_STEP') {
      p2LxQ8vM();
      const pl = g2BindTbl.plans[5] || { kc: g2BindTbl.sp > 0 ? g2BindTbl.sp : 32, n: 5 };
      w5PzR8tM(pl.kc, pl.n);
    }
  };

  setInterval(v5PingPeers, 1000);
  window.addEventListener('focus', v5PingPeers, { passive: true });
  document.addEventListener('visibilitychange', v5PingPeers, { passive: true });
  const f4ByePeer = () => {
    try { q5RzL9wK.postMessage({ type: 'MB_BYE', senderId: v8WpM2tL }); } catch (_) {}
  };
  window.addEventListener('pagehide', f4ByePeer);
  window.addEventListener('beforeunload', f4ByePeer);
  v5PingPeers();

  let k4FeedLock = false;
  const m4EjPhys = { down: false, kc: 0 };

  window.addEventListener('keydown', e => {
    if (!e.isTrusted) return;
    const tg = e.target, tn = tg && tg.tagName ? tg.tagName.toLowerCase() : '';
    if ((tn === 'input' && tg.type !== 'checkbox') || tn === 'textarea' || (tg && tg.isContentEditable)) return;
    const kc = e.keyCode || e.which || 0;
    if (!e.repeat && g2BindTbl.sw > 5 && kc === g2BindTbl.sw) m9MbSt.swSeq++;
    if (g2BindTbl.ej > 5 && kc === g2BindTbl.ej) {
      m4EjPhys.down = true;
      m4EjPhys.kc = kc;
    }
  }, true);

  window.addEventListener('keyup', e => {
    if (!e.isTrusted) return;
    const kc = e.keyCode || e.which || 0;
    if (m4EjPhys.down && kc === m4EjPhys.kc) m4EjPhys.down = false;
  }, true);

  window.addEventListener('mousedown', e => {
    if (!e.isTrusted) return;
    const tg = e.target;
    if (tg && tg.closest && tg.closest('#macro-window, #macro-toggle-pill, #chat-container, #chat-panel, .chat-panel, button, a, select, #main-panel, #login-panel, #party-panel')) return;
    if (g2BindTbl.sw >= 1 && g2BindTbl.sw <= 5 && e.button === g4KcMeta(g2BindTbl.sw).btn) m9MbSt.swSeq++;
    if (g2BindTbl.ej >= 1 && g2BindTbl.ej <= 5 && e.button === g4KcMeta(g2BindTbl.ej).btn) {
      m4EjPhys.down = true;
      m4EjPhys.kc = g2BindTbl.ej;
    }
  }, true);

  window.addEventListener('mouseup', e => {
    if (!e.isTrusted) return;
    if (m4EjPhys.down && m4EjPhys.kc >= 1 && m4EjPhys.kc <= 5 && e.button === g4KcMeta(m4EjPhys.kc).btn) {
      m4EjPhys.down = false;
    }
  }, true);

  window.addEventListener('blur', () => {
    m4EjPhys.down = false;
  });

  function w5EjDisp(kc, isDown) {
    if (!kc || kc <= 0) return;
    const mt = g4KcMeta(kc);
    const cv = t8VwM4xK();
    if (mt.isMouse) {
      const tg = cv || document;
      const wh = mt.btn + 1;
      const btns = isDown ? ([1, 4, 2, 8, 16][mt.btn] || 1) : 0;
      const pTp = isDown ? 'pointerdown' : 'pointerup';
      const mTp = isDown ? 'mousedown' : 'mouseup';
      if (typeof PointerEvent === 'function') {
        const pe = new PointerEvent(pTp, { button: mt.btn, buttons: btns, clientX: t2QnL9wP, clientY: b8VmK3xT, pointerId: 1, pointerType: 'mouse', isPrimary: true, bubbles: true, cancelable: true });
        if (typeof hSP2xK9m !== 'undefined') hSP2xK9m.add(pe);
        tg.dispatchEvent(pe);
      }
      const me = new MouseEvent(mTp, { button: mt.btn, buttons: btns, clientX: t2QnL9wP, clientY: b8VmK3xT, bubbles: true, cancelable: true });
      Object.defineProperty(me, 'which', { value: wh, writable: false });
      if (typeof hSP2xK9m !== 'undefined') hSP2xK9m.add(me);
      tg.dispatchEvent(me);
      return;
    }
    const ke = new KeyboardEvent(isDown ? 'keydown' : 'keyup', { code: mt.code, key: mt.key, bubbles: true, cancelable: true });
    Object.defineProperty(ke, 'keyCode', { value: kc, writable: false });
    Object.defineProperty(ke, 'which', { value: kc, writable: false });
    if (typeof hSP2xK9m !== 'undefined') hSP2xK9m.add(ke);
    document.dispatchEvent(ke);
  }

  function m4SendEj(isDown) {
    let sentKc = 0;
    if (typeof hSt2xK9m !== 'undefined' && hSt2xK9m) {
      if (hSt2xK9m.kind === 'mouse') {
        sentKc = hSt2xK9m.button === 0 ? 1 : (hSt2xK9m.button === 1 ? 2 : (hSt2xK9m.button === 2 ? 3 : hSt2xK9m.button + 1));
        w5EjDisp(sentKc, isDown);
      } else if (hSt2xK9m.kind === 'key') {
        sentKc = hSt2xK9m.keyCode || n4TxtToKc(String(hSt2xK9m.code || '').replace(/^Key/, '').replace(/^Digit/, '')) || 87;
        w5EjDisp(sentKc, isDown);
      }
      if (typeof hEv2xK9m === 'function') {
        hEv2xK9m(hSt2xK9m, isDown ? (hSt2xK9m.kind === 'key' ? 'keydown' : 'mousedown') : (hSt2xK9m.kind === 'key' ? 'keyup' : 'mouseup'));
      }
    }
    if (m4EjPhys.down && g2BindTbl.ej > 0 && g2BindTbl.ej !== sentKc) {
      w5EjDisp(g2BindTbl.ej, isDown);
    }
  }

  let k4BusyWatch = null;

  function w5SetMbBusy(on) {
    k4MbBusy = on;
    if (k4BusyWatch) {
      clearTimeout(k4BusyWatch);
      k4BusyWatch = null;
    }
    if (on) {
      k4BusyWatch = setTimeout(() => {
        k4MbBusy = false;
        k4FeedLock = false;
        k4BusyWatch = null;
      }, 450);
    }
  }

  function m4HudHidden() {
    const el = document.getElementById('cHideStatusPanel');
    return Boolean(el && el.checked);
  }

  function g5ReadPingMs() {
    const el = g4PidEl();
    const box = el && el.parentElement && el.parentElement.parentElement ? el.parentElement.parentElement : null;
    if (!box) return 0;
    const m = (box.textContent || '').match(/Ping\s*:\s*(\d+)/i);
    return m ? (parseInt(m[1], 10) || 0) : 0;
  }

  function k4MbFastFeed(delayMs, onDone) {
    const mbInit = !h4HasPeerTab() && m4IsMbOn();
    const startId = mbInit ? g5ReadPid() : '';
    const startSw = m9MbSt.swSeq;
    const runGen = m9MbSt.matchGen;
    s7PzR(5);
    z7PxM4wK(delayMs, () => {
      function runSecond(tries) {
        if (m9MbSt.matchGen !== runGen) {
          if (onDone) onDone();
          return;
        }
        if (!h4HasPeerTab() && m4IsMbOn() && g2BindTbl.sw > 0) {
          const curId = g5ReadPid();
          const swDelta = (m9MbSt.swSeq - startSw) & 1;
          const pidSwitched = Boolean(startId && startId !== '0' && curId && curId !== '0' && curId !== startId && m9MbSt.swSeq !== startSw);
          if (swDelta === 1 || pidSwitched) {
            if (k4MbBusy && tries < 16) {
              d2TinyWait(15, () => runSecond(tries + 1));
              return;
            }
            const hudHid = m4HudHidden();
            const hadFeed = Boolean(hSt2xK9m) || m4EjPhys.down;
            w5SetMbBusy(true);
            if (hadFeed) { k4FeedLock = true; m4SendEj(false); }
            w5PzR8tM(g2BindTbl.sw, 1);
            w3WaitPidFlip(curId, hudHid ? 35 : 45, () => {
              if (m9MbSt.matchGen !== runGen) {
                k4FeedLock = false;
                w5SetMbBusy(false);
                if (onDone) onDone();
                return;
              }
              if (Boolean(hSt2xK9m) || m4EjPhys.down) { k4FeedLock = true; m4SendEj(false); }
              s7PzR(5);
              const backFrom = g5ReadPid();
              d2TinyWait(25, () => {
                if (m9MbSt.matchGen !== runGen) {
                  k4FeedLock = false;
                  w5SetMbBusy(false);
                  if (onDone) onDone();
                  return;
                }
                w5PzR8tM(g2BindTbl.sw, 1);
                w3WaitPidFlip(backFrom, hudHid ? 35 : 45, () => {
                  k4FeedLock = false;
                  w5SetMbBusy(false);
                  if (m9MbSt.matchGen === runGen && (Boolean(hSt2xK9m) || m4EjPhys.down)) m4SendEj(true);
                  if (onDone) onDone();
                });
              });
            });
            return;
          }
        }
        try { s7PzR(5); } finally { if (onDone) onDone(); }
      }
      runSecond(0);
    });
  }

  function k4MbTrick(spCnt) {
    if (k4MbBusy) return;
    if (g2BindTbl.sw <= 0) {
      m9MbSt.lastTrace = 'noSw:' + g2BindTbl.sw;
      s7PzR(spCnt);
      return;
    }
    const runGen = m9MbSt.matchGen;
    const hudHid = m4HudHidden();
    const allowNoAck = hudHid || Boolean(m9MbSt.box2Id) || g5ReadPingMs() >= 45;
    w5SetMbBusy(true);
    u2SyncPidState();
    const stId = m9MbSt.activeId;
    const hadFeed1 = Boolean(hSt2xK9m) || m4EjPhys.down;
    if (hadFeed1) { k4FeedLock = true; m4SendEj(false); }
    w5PzR8tM(g2BindTbl.sw, 1);
    w3WaitPidFlip(stId, hudHid ? 35 : 45, (ok1, curId) => {
      m9MbSt.lastTrace = 'st=' + stId + ' cur=' + curId + ' ok1=' + ok1 + ' sw=' + g2BindTbl.sw;
      if (m9MbSt.matchGen !== runGen || (!ok1 && !allowNoAck && stId && stId !== '0')) {
        k4FeedLock = false;
        w5SetMbBusy(false);
        if (m9MbSt.matchGen === runGen) {
          if (Boolean(hSt2xK9m) || m4EjPhys.down) m4SendEj(true);
          s7PzR(spCnt);
        }
        return;
      }
      if (Boolean(hSt2xK9m) || m4EjPhys.down) { k4FeedLock = true; m4SendEj(false); }
      s7PzR(5);
      d2TinyWait(25, () => {
        if (m9MbSt.matchGen !== runGen) {
          k4FeedLock = false;
          w5SetMbBusy(false);
          return;
        }
        w5PzR8tM(g2BindTbl.sw, 1);
        w3WaitPidFlip(curId, hudHid ? 35 : 45, () => {
          k4FeedLock = false;
          w5SetMbBusy(false);
          if (m9MbSt.matchGen !== runGen) return;
          if (Boolean(hSt2xK9m) || m4EjPhys.down) m4SendEj(true);
          s7PzR(spCnt);
        });
      });
      n7KwQ2vL(m9TvL2sP.soloDelay, () => {
        function runStep2(tries) {
          if (m9MbSt.matchGen !== runGen || !m4IsMbOn() || h4HasPeerTab()) return;
          if (k4MbBusy) {
            if (tries < 16) d2TinyWait(15, () => runStep2(tries + 1));
            return;
          }
          u2SyncPidState();
          const nowId = m9MbSt.activeId;
          if (!nowId || nowId === '0') return;
          if (nowId === stId) {
            const hudHid2 = m4HudHidden();
            const allowNoAck2 = hudHid2 || Boolean(m9MbSt.box2Id) || g5ReadPingMs() >= 45;
            const hadFeed2 = Boolean(hSt2xK9m) || m4EjPhys.down;
            w5SetMbBusy(true);
            if (hadFeed2) { k4FeedLock = true; m4SendEj(false); }
            w5PzR8tM(g2BindTbl.sw, 1);
            w3WaitPidFlip(nowId, hudHid2 ? 35 : 45, ok2 => {
              if (m9MbSt.matchGen !== runGen || (!ok2 && !allowNoAck2)) {
                k4FeedLock = false;
                w5SetMbBusy(false);
                if (m9MbSt.matchGen === runGen && (Boolean(hSt2xK9m) || m4EjPhys.down)) m4SendEj(true);
                return;
              }
              if (Boolean(hSt2xK9m) || m4EjPhys.down) { k4FeedLock = true; m4SendEj(false); }
              s7PzR(5);
              const b2Id = g5ReadPid();
              d2TinyWait(25, () => {
                if (m9MbSt.matchGen !== runGen) {
                  k4FeedLock = false;
                  w5SetMbBusy(false);
                  return;
                }
                w5PzR8tM(g2BindTbl.sw, 1);
                w3WaitPidFlip(b2Id, hudHid2 ? 35 : 45, () => {
                  k4FeedLock = false;
                  w5SetMbBusy(false);
                  if (m9MbSt.matchGen === runGen && (Boolean(hSt2xK9m) || m4EjPhys.down)) m4SendEj(true);
                });
              });
            });
          } else if (nowId !== stId) {
            s7PzR(5);
          }
        }
        runStep2(0);
      });
    });
  }

  function r4BindHooks() {
    b6SyncKb(true);
    m4SyncMbOpt(true);
    u2SyncPidState();

    window.__gotaMultiboxState = () => {
      u2SyncPidState();
      return Object.assign({}, m9MbSt, {
        hasSecondWindow: h4HasPeerTab(),
        splitKey: g2BindTbl.sp,
        switchKey: g2BindTbl.sw,
        ejectKey: g2BindTbl.ej,
        revPlan: g2BindTbl.rev
      });
    };

    const pidEl = g4PidEl();
    if (pidEl && !pidEl.__mbObsOn && typeof MutationObserver === 'function') {
      pidEl.__mbObsOn = true;
      const ob = new MutationObserver(() => u2SyncPidState());
      ob.observe(pidEl, { childList: true, characterData: true, subtree: true });
    }

    const cb = document.getElementById('cMultibox');
    if (cb && !cb.__mbChgOn) {
      cb.__mbChgOn = true;
      cb.addEventListener('change', () => {
        m4SyncMbOpt(true);
        m9MbSt.matchGen++;
      });
    }

    const hk = document.getElementById('main-hotkeys');
    if (hk && !hk.__mbHkOn) {
      hk.__mbHkOn = true;
      const u7Hk = () => setTimeout(() => b6SyncKb(true), 40);
      hk.addEventListener('click', u7Hk, true);
      hk.addEventListener('mousedown', u7Hk, true);
      hk.addEventListener('keyup', u7Hk, true);
    }

    ['btn-play', 'btn-spec', 'btn-leave-match'].forEach(bid => {
      const b = document.getElementById(bid);
      if (b && !b.__mbRstOn) {
        b.__mbRstOn = true;
        b.addEventListener('click', () => {
          m9MbSt.box1Id = '';
          m9MbSt.box2Id = '';
          m9MbSt.activeBox = 0;
          m9MbSt.matchGen++;
        }, true);
      }
    });

    window.addEventListener('storage', e => {
      if (!e || e.key === 'keybinds') b6SyncKb(false);
      if (!e || e.key === 'options') m4SyncMbOpt(false);
    });
  }

  let k6XpL1vQ = 1.0, r3WnS8mT = null, m8QzV2tL = 1.0;
  let f5TxL9wK = false, j2VnL8sT = false;
  let q7TwM3xP = 0, v4QnK9wL = 0, z8PxL2sT = null, d3VwN8mT = null, h9TnK4xL = 0, p6XvQ2wM = 0;
  let b9VxL3sQ = 0, r4QnM8tL = 0, m2WpT7vX = false, s8XnL3wP = null, v5QzR9mL = 0;
  let lockBaseZm = 1.0;

  let cachedGameCanvas = null;
  const gCtxMap = new WeakMap();

  function t8VwM4xK() {
    if (cachedGameCanvas && cachedGameCanvas.isConnected && cachedGameCanvas.width >= 300 && cachedGameCanvas.height >= 200) return cachedGameCanvas;
    const byId = document.getElementById('canvas');
    if (byId && byId.width >= 300 && byId.height >= 200) {
      cachedGameCanvas = byId;
      return byId;
    }
    const list = document.querySelectorAll('canvas');
    for (let i = 0; i < list.length; i++) {
      const c = list[i];
      if (c.id === 'autorev-overlay' || c.id === 'macro-bg-canvas' || c.id === 'macro-plexus-canvas') continue;
      if (c.width >= 300 && c.height >= 200) {
        cachedGameCanvas = c;
        return c;
      }
    }
    return null;
  }

  function x4TvL8wP(cv) {
    let rec = gCtxMap.get(cv);
    if (!rec) {
      let gl = null, ctx2d = null;
      try {
        const o = { preserveDrawingBuffer: true, powerPreference: 'high-performance' };
        gl = cv.getContext('webgl2', o) || cv.getContext('webgl', o);
        if (!gl) ctx2d = cv.getContext('2d');
      } catch (_) {}
      rec = { gl, ctx2d };
      gCtxMap.set(cv, rec);
    }
    return rec;
  }

  function q2WnS7xM(keepVisualFade) {
    f5TxL9wK = false;
    f8WnK3xL.locked = false;
    j2VnL8sT = false;
    q7TwM3xP = 0;
    v4QnK9wL = 0;
    z8PxL2sT = null;
    p6XvQ2wM = 0;
    m2WpT7vX = false;
    f8WnK3xL.misses = 0;
    f8WnK3xL.worldR = 0;
    f8WnK3xL.displayMass = 0;
    f8WnK3xL.color = null;
    if (!keepVisualFade) {
      x5QzL2wT.active = false;
      x5QzL2wT.alpha = 0;
    }
  }

  function g9PxL3vT() {
    if (!f8WnK3xL.locked) p3WnK7vT(true);
    if (f8WnK3xL.locked) {
      f5TxL9wK = true;
      j2VnL8sT = false;
      const zm = k3WnL8vR();
      lockBaseZm = zm;
      const wRad = f8WnK3xL.worldR || (f8WnK3xL.r / Math.max(0.01, zm));
      v4QnK9wL = wRad;
      q7TwM3xP = Math.max(1, Math.round(Math.pow(wRad / 10, 2)));
      x5QzL2wT.active = false;
      x5QzL2wT.alpha = 0;
      x5QzL2wT.pop = 1.22;
      const cv = t8VwM4xK();
      if (cv && cv.width > 0) {
        b9VxL3sQ = (f8WnK3xL.cx - cv.width * 0.5) / Math.max(0.01, zm);
        r4QnM8tL = (f8WnK3xL.cy - cv.height * 0.5) / Math.max(0.01, zm);
        m2WpT7vX = true;
      }
    }
  }

  function d4TxN8wL() {
    f5TxL9wK ? q2WnS7xM(true) : g9PxL3vT();
  }

  function h8WpM2vQ() {
    if (j2VnL8sT) return;
    j2VnL8sT = true;
    const pl = g2BindTbl.rev;
    w5PzR8tM(pl.kc, pl.n);
    q2WnS7xM(true);
  }

  const v9TxtOn = () => Boolean(m9TvL2sP.selectableText);
  const b4AllowDef = new WeakSet();
  const q6OgPrevDef = Event.prototype.preventDefault;
  Event.prototype.preventDefault = function () {
    if (v9TxtOn() && b4AllowDef.has(this)) return;
    return q6OgPrevDef.apply(this, arguments);
  };

  const w3CvsTxt = new WeakMap();
  const w3ConnTxt = new WeakMap();
  const w3DirtyCv = new Set();
  const w3TxtLayers = new WeakMap();
  const w3AllLayers = new Set();
  const w3NodeSlots = new WeakMap();

  const w3MeasCvs = document.createElement('canvas');
  const w3MeasCtx = w3MeasCvs.getContext('2d');
  const w3WCache = new Map();
  if (document.fonts && document.fonts.addEventListener) {
    document.fonts.addEventListener('loadingdone', () => w3WCache.clear());
  }

  const w3Rng = document.createRange();
  let w3PeList = [];
  let w3PeDirty = true;
  let w3PeLastScan = 0;
  let w3PeObs = null;
  let w3PeHovered = null;
  let w3PeDragGrp = [];
  let w3DragSel = false;
  let w3DragCvs = false;
  let w3RmbHit = false;
  let w3RmbTs = 0;
  let w3PixiCv = null;
  let w3PixiMs = 0;
  let w3HoverMs = 0;
  let w3HoverX = -1;
  let w3HoverY = -1;
  const w3Fwded = new WeakSet();
  let w3BypTm = 0;
  let w3RmbTm = 0;

  function w3IsUi(tg) {
    const el = tg && tg.nodeType === 1 ? tg : (tg && tg.parentElement);
    return Boolean(el && el.closest && el.closest('#macro-window, #macro-toggle-pill'));
  }

  function w3IsEd(tg) {
    const el = tg && tg.nodeType === 1 ? tg : (tg && tg.parentElement);
    if (!el) return false;
    const tn = (el.tagName || '').toLowerCase();
    return (tn === 'input' && !/^(checkbox|radio|range|color|button|submit|reset|file|image)$/i.test(el.type || 'text')) || tn === 'textarea' || Boolean(el.isContentEditable);
  }

  function w3NormFont(raw) {
    if (!raw || typeof raw !== 'string') return '700 20px/20px Ubuntu,sans-serif';
    let s = raw.replace(/(\d+(?:\.\d+)?)px(?:\s*\/\s*[\d.]+(?:px|em|%)?)?/i, '20px/20px');
    if (!/20px\/20px/.test(s)) s = '700 20px/20px ' + s;
    return s;
  }

  function w3MeasW(txt, nf) {
    const k = nf + '\0' + txt;
    let w = w3WCache.get(k);
    if (w !== undefined) return w;
    w3MeasCtx.font = nf;
    w = Math.max(1, w3MeasCtx.measureText(txt).width);
    if (w3WCache.size > 600) w3WCache.clear();
    w3WCache.set(k, w);
    return w;
  }

  function w3RecTxt(ctx, rawTxt, x, y, maxW, isStrk) {
    if (!ctx || !ctx.canvas || ctx.canvas === w3MeasCvs) return;
    const cv = ctx.canvas;
    if (cv.id === 'autorev-overlay' || cv.id === 'macro-bg-canvas' || cv.id === 'macro-plexus-canvas') return;
    const isConn = Boolean(cv.isConnected);
    if (isConn && !v9TxtOn()) return;
    if (ctx.globalAlpha !== undefined && ctx.globalAlpha <= 0.03) return;
    const s = String(rawTxt);
    if (!/\S/.test(s)) return;
    const trm = s.trim();
    const m = ctx.measureText(s);
    const mw = (typeof maxW === 'number' && maxW > 0 && m.width > maxW) ? maxW : m.width;
    const sx = m.width > 0 ? mw / m.width : 1;
    let lx0, lx1;
    if (typeof m.actualBoundingBoxLeft === 'number' && typeof m.actualBoundingBoxRight === 'number' && (m.actualBoundingBoxLeft !== 0 || m.actualBoundingBoxRight !== 0)) {
      lx0 = x - m.actualBoundingBoxLeft * sx;
      lx1 = x + m.actualBoundingBoxRight * sx;
    } else {
      const al = ctx.textAlign || 'start';
      if (al === 'center') { lx0 = x - mw * 0.5; lx1 = x + mw * 0.5; }
      else if (al === 'right' || al === 'end') { lx0 = x - mw; lx1 = x; }
      else { lx0 = x; lx1 = x + mw; }
    }
    const fm = String(ctx.font || '').match(/(\d+(?:\.\d+)?)px/i);
    const fs = fm ? parseFloat(fm[1]) : 16;
    let ly0, ly1;
    if (typeof m.actualBoundingBoxAscent === 'number' && typeof m.actualBoundingBoxDescent === 'number' && (m.actualBoundingBoxAscent !== 0 || m.actualBoundingBoxDescent !== 0)) {
      ly0 = y - m.actualBoundingBoxAscent;
      ly1 = y + m.actualBoundingBoxDescent;
    } else {
      const bl = ctx.textBaseline || 'alphabetic';
      if (bl === 'top' || bl === 'hanging') { ly0 = y; ly1 = y + fs * 1.15; }
      else if (bl === 'middle') { ly0 = y - fs * 0.55; ly1 = y + fs * 0.55; }
      else if (bl === 'bottom' || bl === 'ideographic') { ly0 = y - fs * 1.05; ly1 = y + fs * 0.1; }
      else { ly0 = y - fs * 0.85; ly1 = y + fs * 0.25; }
    }
    if (isStrk) {
      const pad = Math.min(4, (ctx.lineWidth || 0) * 0.5);
      lx0 -= pad; lx1 += pad; ly0 -= pad; ly1 += pad;
    }
    const mt = ctx.getTransform();
    const p0x = lx0 * mt.a + ly0 * mt.c + mt.e;
    const p0y = lx0 * mt.b + ly0 * mt.d + mt.f;
    const p1x = lx1 * mt.a + ly0 * mt.c + mt.e;
    const p1y = lx1 * mt.b + ly0 * mt.d + mt.f;
    const p2x = lx0 * mt.a + ly1 * mt.c + mt.e;
    const p2y = lx0 * mt.b + ly1 * mt.d + mt.f;
    const p3x = lx1 * mt.a + ly1 * mt.c + mt.e;
    const p3y = lx1 * mt.b + ly1 * mt.d + mt.f;
    const x0 = Math.min(p0x, p1x, p2x, p3x);
    const y0 = Math.min(p0y, p1y, p2y, p3y);
    const x1 = Math.max(p0x, p1x, p2x, p3x);
    const y1 = Math.max(p0y, p1y, p2y, p3y);
    const w = Math.hypot(p1x - p0x, p1y - p0y);
    const h = Math.hypot(p2x - p0x, p2y - p0y);
    if (w < 2 || h < 2) return;
    const ang = Math.atan2(p1y - p0y, p1x - p0x);
    const store = isConn ? w3ConnTxt : w3CvsTxt;
    let rec = store.get(cv);
    if (!rec || rec.w !== cv.width || rec.h !== cv.height) {
      rec = { w: cv.width, h: cv.height, items: [] };
      store.set(cv, rec);
    }
    const arr = rec.items;
    const nLim = Math.max(0, arr.length - 8);
    for (let i = arr.length - 1; i >= nLim; i--) {
      const it = arr[i];
      if (it.t === trm && Math.abs(it.x0 - x0) < 6 && Math.abs(it.y0 - y0) < 6 && Math.abs(it.x1 - x1) < 8 && Math.abs(it.y1 - y1) < 8) {
        it.x0 = Math.min(it.x0, x0);
        it.y0 = Math.min(it.y0, y0);
        it.x1 = Math.max(it.x1, x1);
        it.y1 = Math.max(it.y1, y1);
        it.w = Math.max(it.w, w);
        it.h = Math.max(it.h, h);
        it.s = performance.now();
        if (isConn) w3DirtyCv.add(cv);
        return;
      }
    }
    if (arr.length > 800) arr.shift();
    arr.push({ t: trm, x0, y0, x1, y1, px: p0x, py: p0y, w, h, a: ang, f: ctx.font || '', s: performance.now() });
    if (isConn) w3DirtyCv.add(cv);
  }

  function w3ClrArea(ctx, x, y, w, h, fullOnly) {
    if (!ctx || !ctx.canvas) return;
    const cv = ctx.canvas;
    const isConn = Boolean(cv.isConnected);
    if (isConn && !v9TxtOn()) return;
    const store = isConn ? w3ConnTxt : w3CvsTxt;
    const rec = store.get(cv);
    if (!rec || !rec.items.length) return;
    const mt = ctx.getTransform();
    const xA = x * mt.a + y * mt.c + mt.e;
    const yA = x * mt.b + y * mt.d + mt.f;
    const xB = (x + w) * mt.a + (y + h) * mt.c + mt.e;
    const yB = (x + w) * mt.b + (y + h) * mt.d + mt.f;
    const cx0 = Math.min(xA, xB), cy0 = Math.min(yA, yB);
    const cx1 = Math.max(xA, xB), cy1 = Math.max(yA, yB);
    const full = cx0 <= cv.width * 0.12 && cy0 <= cv.height * 0.12 && cx1 >= cv.width * 0.88 && cy1 >= cv.height * 0.88;
    if (full) {
      rec.items.length = 0;
      if (isConn) w3DirtyCv.add(cv);
      return;
    }
    if (fullOnly) return;
    const kept = [];
    for (let i = 0; i < rec.items.length; i++) {
      const it = rec.items[i];
      const mx = (it.x0 + it.x1) * 0.5, my = (it.y0 + it.y1) * 0.5;
      if (mx < cx0 || mx > cx1 || my < cy0 || my > cy1) kept.push(it);
    }
    if (kept.length !== rec.items.length) {
      rec.items = kept;
      if (isConn) w3DirtyCv.add(cv);
    }
  }

  function w3CopyCvsRec(src, dst) {
    if (!src || !dst) return;
    const r = w3CvsTxt.get(src);
    if (r && r.items && r.items.length) {
      w3CvsTxt.set(dst, { w: r.w, h: r.h, items: r.items.slice() });
    }
  }

  function w3TexSrc(tex) {
    if (!tex) return null;
    if (tex.source && tex.source.resource) return tex.source.resource;
    if (tex._source && tex._source.resource) return tex._source.resource;
    const bt = tex.baseTexture;
    if (bt) {
      if (bt.resource && bt.resource.source) return bt.resource.source;
      if (bt.source) return bt.source;
    }
    return null;
  }

  function w3GetLayer(cv) {
    let lr = w3TxtLayers.get(cv);
    if (!lr) {
      const root = document.createElement('div');
      root.className = 'macro-txt-layer';
      lr = { root, slots: [], pool: [], stamp: 0, l: -999, t: -999, w: -1, h: -1, z: '' };
      w3TxtLayers.set(cv, lr);
      w3AllLayers.add(lr);
    }
    if (cv.parentNode && lr.root.parentNode !== cv.parentNode) {
      cv.parentNode.insertBefore(lr.root, cv.nextSibling);
    }
    return lr;
  }

  function w3AllocSlot(lr) {
    let sl = lr.pool.pop();
    if (!sl) {
      const el = document.createElement('span');
      el.className = 'macro-cvs-txt';
      lr.root.appendChild(el);
      sl = { el, lr, txt: '', nf: '', tr: '', x: 0, y: 0, st: 0, nd: null, ki: -1, vis: false };
    }
    lr.slots.push(sl);
    return sl;
  }

  function w3UpdSlot(sl, it) {
    const el = sl.el;
    if (!sl.vis) {
      el.style.display = 'block';
      sl.vis = true;
    }
    if (sl.txt !== it.t) {
      const sel = window.getSelection();
      if (!(w3DragSel && sel && !sel.isCollapsed && sel.containsNode(el, true))) {
        el.textContent = it.t;
        sl.txt = it.t;
      }
    }
    const nf = w3NormFont(it.f);
    if (sl.nf !== nf) {
      el.style.font = nf;
      sl.nf = nf;
    }
    const mw = w3MeasW(sl.txt || it.t, nf);
    const sx = it.w / Math.max(1, mw);
    const sy = it.h / 20;
    sl.x = it.x;
    sl.y = it.y;
    const rot = Math.abs(it.a) > 0.002 ? ` rotate(${it.a.toFixed(4)}rad)` : '';
    const tr = `translate3d(${it.x.toFixed(1)}px,${it.y.toFixed(1)}px,0)${rot} scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
    if (sl.tr !== tr) {
      el.style.transform = tr;
      sl.tr = tr;
    }
  }

  function w3SyncLayer(cv, cRc, items) {
    if (!cv || !cv.isConnected) return;
    const lr = w3GetLayer(cv);
    const rl = Math.round(cRc.left), rt = Math.round(cRc.top), rw = Math.round(cRc.width), rh = Math.round(cRc.height);
    const cz = getComputedStyle(cv).zIndex;
    const rz = cz && cz !== 'auto' ? cz : '';
    if (lr.l !== rl) { lr.l = rl; lr.root.style.left = rl + 'px'; }
    if (lr.t !== rt) { lr.t = rt; lr.root.style.top = rt + 'px'; }
    if (lr.w !== rw) { lr.w = rw; lr.root.style.width = rw + 'px'; }
    if (lr.h !== rh) { lr.h = rh; lr.root.style.height = rh + 'px'; }
    if (lr.z !== rz) { lr.z = rz; lr.root.style.zIndex = rz; }
    if (lr.root.style.display === 'none') lr.root.style.display = 'block';

    const st = ++lr.stamp;
    const used = new Set();
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      let sl = null;
      if (it.nd) {
        let arr = w3NodeSlots.get(it.nd);
        if (!arr) { arr = []; w3NodeSlots.set(it.nd, arr); }
        sl = arr[it.ki];
        if (!sl || sl.lr !== lr || sl.nd !== it.nd || sl.ki !== it.ki || used.has(sl)) {
          sl = w3AllocSlot(lr);
          sl.nd = it.nd;
          sl.ki = it.ki;
          arr[it.ki] = sl;
        }
      } else {
        let bestD = 110;
        for (let j = 0; j < lr.slots.length; j++) {
          const cand = lr.slots[j];
          if (used.has(cand) || cand.nd !== null || cand.txt !== it.t) continue;
          const d = Math.hypot(cand.x - it.x, cand.y - it.y);
          if (d < bestD) { bestD = d; sl = cand; }
        }
        if (!sl) {
          sl = w3AllocSlot(lr);
          sl.nd = null;
          sl.ki = -1;
        }
      }
      used.add(sl);
      sl.st = st;
      w3UpdSlot(sl, it);
    }

    const sel = window.getSelection();
    let k = 0;
    for (let i = 0; i < lr.slots.length; i++) {
      const sl = lr.slots[i];
      if (sl.st === st) {
        lr.slots[k++] = sl;
      } else if (w3DragSel && sel && !sel.isCollapsed && sel.containsNode(sl.el, true)) {
        lr.slots[k++] = sl;
      } else {
        sl.el.style.display = 'none';
        sl.el.textContent = '';
        sl.txt = '';
        sl.tr = '';
        sl.vis = false;
        sl.nd = null;
        sl.ki = -1;
        lr.pool.push(sl);
      }
    }
    lr.slots.length = k;
  }

  function w3MergeAtlas(items) {
    if (items.length < 2) return items;
    const out = [];
    for (let i = 0; i < items.length; i++) {
      const cur = items[i];
      const prev = out.length ? out[out.length - 1] : null;
      if (prev && prev.at && cur.at && prev.pr && prev.pr === cur.pr && cur.t.length <= 2 && prev.t.length < 28 &&
          Math.abs(cur.a - prev.a) < 0.08 && Math.abs(cur.h - prev.h) < prev.h * 0.38 &&
          Math.abs(cur.y - prev.y) < prev.h * 0.45 &&
          cur.x >= prev.x + prev.w * 0.3 && cur.x <= prev.x + prev.w + prev.h * 0.75) {
        const gap = cur.x - (prev.x + prev.w);
        prev.t += (gap > prev.h * 0.25 ? ' ' : '') + cur.t;
        const nx = Math.min(prev.x, cur.x), ny = Math.min(prev.y, cur.y);
        const nr = Math.max(prev.x + prev.w, cur.x + cur.w), nb = Math.max(prev.y + prev.h, cur.y + cur.h);
        prev.x = nx; prev.y = ny; prev.w = nr - nx; prev.h = nb - ny;
      } else {
        out.push(cur);
      }
    }
    return out;
  }

  function w3PushConnItems(cv, cRc, out) {
    const rec = w3ConnTxt.get(cv);
    if (!rec || !rec.items.length || cv.width <= 0 || cv.height <= 0) return;
    const sx = cRc.width / cv.width, sy = cRc.height / cv.height;
    for (let i = 0; i < rec.items.length; i++) {
      const it = rec.items[i];
      const x = it.px * sx, y = it.py * sy, w = it.w * sx, h = it.h * sy;
      if (w < 4 || h < 5) continue;
      if (x + w < -4 || x > cRc.width + 4 || y + h < -4 || y > cRc.height + 4) continue;
      out.push({ nd: null, ki: -1, pr: null, at: false, t: it.t, f: it.f, x, y, w, h, a: it.a });
    }
  }

  function w3PixiScan(st, scn, rnd) {
    if (!v9TxtOn() || !st) return;
    const cv = rnd.canvas || rnd.view || t8VwM4xK();
    if (!cv || !cv.isConnected || !scn || scn.width <= 0 || scn.height <= 0) return;
    const cRc = cv.getBoundingClientRect();
    if (cRc.width < 10 || cRc.height < 10) return;
    w3PixiCv = cv;
    w3PixiMs = performance.now();
    const sx = cRc.width / scn.width, sy = cRc.height / scn.height;
    const cw = cRc.width, ch = cRc.height;
    const items = [];

    function proj(nd, pr, ki, at, t, f, lx0, ly0, lx1, ly1) {
      const wt = nd.worldTransform;
      if (!wt) return;
      const px0 = lx0 * wt.a + ly0 * wt.c + wt.tx;
      const py0 = lx0 * wt.b + ly0 * wt.d + wt.ty;
      const vxX = (lx1 - lx0) * wt.a, vxY = (lx1 - lx0) * wt.b;
      const vyX = (ly1 - ly0) * wt.c, vyY = (ly1 - ly0) * wt.d;
      const x = px0 * sx, y = py0 * sy;
      const w = Math.hypot(vxX * sx, vxY * sy);
      const h = Math.hypot(vyX * sx, vyY * sy);
      if (w < 4 || h < 5) return;
      const ang = Math.atan2(vxY * sy, vxX * sx);
      const bnd = Math.max(w, h);
      if (x + bnd < -4 || x - bnd > cw + 4 || y + bnd < -4 || y - bnd > ch + 4) return;
      items.push({ nd, ki, pr, at, t, f, x, y, w, h, a: ang });
    }

    function walk(nd) {
      if (!nd || nd.visible === false || nd.renderable === false || nd.destroyed) return;
      if (nd.worldAlpha !== undefined && nd.worldAlpha <= 0.05) return;
      if (nd.isParticleContainer) return;
      const hasTxt = typeof nd.text === 'string' && /\S/.test(nd.text);
      const tex = nd.texture;
      const src = tex ? w3TexSrc(tex) : (nd.canvas || null);
      const rec = src ? w3CvsTxt.get(src) : null;
      if (rec && rec.items.length && tex) {
        const fr = tex.frame;
        const orig = tex.orig || fr;
        const trm = tex.trim;
        const ax = nd.anchor ? nd.anchor.x : 0;
        const ay = nd.anchor ? nd.anchor.y : 0;
        const bw = (tex.source && tex.source.width) || (tex.baseTexture && tex.baseTexture.width) || (fr ? fr.width : 0);
        const bh = (tex.source && tex.source.height) || (tex.baseTexture && tex.baseTexture.height) || (fr ? fr.height : 0);
        const res = (tex.source && tex.source.resolution) || (tex.baseTexture && tex.baseTexture.resolution) || tex.resolution || 1;
        const sw = src.width || rec.w || 1, sh = src.height || rec.h || 1;
        const rx = bw > 0 ? sw / bw : res;
        const ry = bh > 0 ? sh / bh : res;
        const fx0 = fr ? fr.x * rx : 0, fy0 = fr ? fr.y * ry : 0;
        const fx1 = fr ? (fr.x + fr.width) * rx : sw, fy1 = fr ? (fr.y + fr.height) * ry : sh;
        const isAtl = Boolean(fr && (fr.width * rx < sw * 0.92 || fr.height * ry < sh * 0.92));
        const ow = orig ? orig.width : sw / rx, oh = orig ? orig.height : sh / ry;
        const tx0 = trm ? trm.x : 0, ty0 = trm ? trm.y : 0;
        let ki = 0;
        for (let i = 0; i < rec.items.length; i++) {
          const it = rec.items[i];
          if (isAtl) {
            const mx = (it.x0 + it.x1) * 0.5, my = (it.y0 + it.y1) * 0.5;
            if (mx < fx0 - 2 || mx > fx1 + 2 || my < fy0 - 2 || my > fy1 + 2) continue;
          }
          const lx0 = -ax * ow + tx0 + (it.x0 - fx0) / rx;
          const ly0 = -ay * oh + ty0 + (it.y0 - fy0) / ry;
          const lx1 = -ax * ow + tx0 + (it.x1 - fx0) / rx;
          const ly1 = -ay * oh + ty0 + (it.y1 - fy0) / ry;
          proj(nd, nd.parent, ki++, isAtl, it.t, it.f, lx0, ly0, lx1, ly1);
        }
        if (hasTxt) return;
      } else if (hasTxt) {
        const lb = typeof nd.getLocalBounds === 'function' ? m7Box(nd.getLocalBounds()) : null;
        if (lb && lb.w > 0 && lb.h > 0) {
          const lns = nd.text.split(/\r?\n/);
          const lh = lb.h / lns.length;
          const stF = nd.style && nd.style.fontFamily ? ('700 20px/20px ' + nd.style.fontFamily) : '';
          let ki = 0;
          for (let i = 0; i < lns.length; i++) {
            const ln = lns[i].trim();
            if (!ln) continue;
            proj(nd, nd.parent, ki++, false, ln, stF, lb.x, lb.y + i * lh, lb.x + lb.w, lb.y + (i + 1) * lh);
          }
          return;
        }
      }
      const ch = nd.children;
      if (ch && ch.length) {
        for (let i = 0; i < ch.length; i++) walk(ch[i]);
      }
    }

    walk(st);
    const merged = w3MergeAtlas(items);
    w3PushConnItems(cv, cRc, merged);
    w3DirtyCv.delete(cv);
    w3SyncLayer(cv, cRc, merged);
  }

  function w3TickTxt() {
    if (!v9TxtOn()) return;
    if (w3DirtyCv.size > 0) {
      const nw = performance.now();
      w3DirtyCv.forEach(cv => {
        w3DirtyCv.delete(cv);
        if (!cv || !cv.isConnected) return;
        if (cv === w3PixiCv && nw - w3PixiMs < 250) return;
        const cRc = cv.getBoundingClientRect();
        if (cRc.width < 10 || cRc.height < 10) return;
        const arr = [];
        w3PushConnItems(cv, cRc, arr);
        w3SyncLayer(cv, cRc, arr);
      });
    }
    w3AllLayers.forEach(lr => {
      if (lr.root.parentNode && !lr.root.parentNode.isConnected) {
        lr.root.style.display = 'none';
      }
    });
  }

  function w3ScanPeNone() {
    w3PeDirty = false;
    w3PeLastScan = performance.now();
    const out = [];
    if (!document.body) { w3PeList = out; return; }
    const seen = new Set();
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = tw.nextNode())) {
      if (!n.nodeValue || !/\S/.test(n.nodeValue)) continue;
      const el = n.parentElement;
      if (!el || seen.has(el)) continue;
      if (w3IsUi(el) || el.closest('.macro-txt-layer')) continue;
      const tn = (el.tagName || '').toUpperCase();
      if (tn === 'SCRIPT' || tn === 'STYLE' || tn === 'NOSCRIPT' || tn === 'CANVAS' || tn === 'SVG') continue;
      seen.add(el);
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) <= 0.02) continue;
      if (cs.pointerEvents === 'none' || el.classList.contains('macro-pe-txt')) {
        if (el.offsetParent !== null || cs.position === 'fixed') out.push(el);
      }
    }
    w3PeList = out;
  }

  function w3ElTxtHit(el, x, y) {
    if (!el || !el.isConnected) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || parseFloat(cs.opacity) <= 0.02) return false;
    const er = el.getBoundingClientRect();
    if (er.width <= 0 || er.height <= 0 || x < er.left - 2 || x > er.right + 2 || y < er.top - 1 || y > er.bottom + 1) return false;
    for (let n = el.firstChild; n; n = n.nextSibling) {
      if (n.nodeType !== 3) continue;
      const v = n.nodeValue;
      if (!v || !/\S/.test(v)) continue;
      const s = v.search(/\S/);
      let e = v.length - 1;
      while (e > s && /\s/.test(v[e])) e--;
      try {
        w3Rng.setStart(n, s);
        w3Rng.setEnd(n, e + 1);
        const rcs = w3Rng.getClientRects();
        for (let i = 0; i < rcs.length; i++) {
          const r = rcs[i];
          if (r.width > 0 && r.height > 0 && x >= r.left - 2 && x <= r.right + 2 && y >= r.top - 1 && y <= r.bottom + 1) return true;
        }
      } catch (_) {}
    }
    return false;
  }

  function w3IsOccluded(el, topEl) {
    if (!topEl || topEl === document.body || topEl === document.documentElement || topEl.tagName === 'CANVAS' || topEl.classList.contains('macro-txt-layer') || topEl.classList.contains('macro-cvs-txt')) return false;
    if (el.contains(topEl) || topEl.contains(el)) return false;
    const tCs = getComputedStyle(topEl);
    const bg = tCs.backgroundColor;
    const opaque = bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)';
    if (!opaque && !topEl.closest('#main-panel, #login-panel, #context-menu, .modal')) return false;
    const tz = parseInt(tCs.zIndex, 10) || 0;
    const ez = parseInt(getComputedStyle(el).zIndex, 10) || 0;
    return tz >= ez;
  }

  function w3HitText(x, y, tg) {
    if (!v9TxtOn()) return false;
    if (w3IsUi(tg)) return false;
    const topEl = document.elementFromPoint(x, y);
    if (w3IsUi(topEl)) return false;

    const tgEl = tg && tg.nodeType === 1 ? tg : (tg && tg.parentElement);
    if (tgEl && tgEl.classList && tgEl.classList.contains('macro-cvs-txt')) {
      const r = tgEl.getBoundingClientRect();
      if (r.width > 0 && r.height > 0 && x >= r.left - 2 && x <= r.right + 2 && y >= r.top - 1 && y <= r.bottom + 1) return true;
    }

    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) {
      for (let i = 0; i < sel.rangeCount; i++) {
        const rg = sel.getRangeAt(i);
        const ac = rg.commonAncestorContainer;
        const ae = ac && ac.nodeType === 1 ? ac : (ac && ac.parentElement);
        if (ae && w3IsUi(ae)) continue;
        const rcs = rg.getClientRects();
        for (let j = 0; j < rcs.length; j++) {
          const r = rcs[j];
          if (r.width > 0 && r.height > 0 && x >= r.left - 2 && x <= r.right + 2 && y >= r.top - 1 && y <= r.bottom + 1) return true;
        }
      }
    }

    const els = document.elementsFromPoint(x, y);
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      if (w3IsUi(el)) return false;
      if (el === document.body || el === document.documentElement || el.tagName === 'CANVAS' || el.classList.contains('macro-txt-layer')) continue;
      if (el.classList.contains('macro-cvs-txt')) return true;
      if (w3IsEd(el)) return true;
      if (w3ElTxtHit(el, x, y)) return true;
    }

    if (w3PeDirty || performance.now() - w3PeLastScan > 350) w3ScanPeNone();
    for (let i = 0; i < w3PeList.length; i++) {
      const el = w3PeList[i];
      if (!el.isConnected || w3IsOccluded(el, topEl)) continue;
      if (w3ElTxtHit(el, x, y)) return true;
    }
    return false;
  }

  function w3SetBypass(on) {
    if (w3BypTm) { clearTimeout(w3BypTm); w3BypTm = 0; }
    if (document.body) document.body.classList.toggle('macro-txt-bypass', Boolean(on));
  }

  function w3FwdRmb(e) {
    const under = document.elementFromPoint(e.clientX, e.clientY);
    if (!under || under === e.target || w3IsUi(under)) return;
    const init = {
      button: 2,
      buttons: e.buttons,
      clientX: e.clientX,
      clientY: e.clientY,
      screenX: e.screenX,
      screenY: e.screenY,
      ctrlKey: e.ctrlKey,
      shiftKey: e.shiftKey,
      altKey: e.altKey,
      metaKey: e.metaKey,
      bubbles: true,
      cancelable: true
    };
    const ev = e.type === 'pointerdown' && typeof PointerEvent === 'function'
      ? new PointerEvent('pointerdown', Object.assign(init, {
          pointerId: e.pointerId || 1,
          pointerType: e.pointerType || 'mouse',
          isPrimary: true
        }))
      : new MouseEvent(e.type, init);
    Object.defineProperty(ev, 'which', { value: 3, writable: false });
    w3Fwded.add(ev);
    under.dispatchEvent(ev);
  }

  function w3HitSel(x, y, tg) {
    if (!v9TxtOn() || w3IsUi(tg)) return false;
    const topEl = document.elementFromPoint(x, y);
    if (w3IsUi(topEl)) return false;

    const tgEl = tg && tg.nodeType === 1 ? tg : (tg && tg.parentElement);
    const ed = (tgEl && w3IsEd(tgEl) && tgEl) || (topEl && w3IsEd(topEl) && topEl);
    if (ed && typeof ed.selectionStart === 'number' && typeof ed.selectionEnd === 'number' && ed.selectionStart !== ed.selectionEnd) {
      const r = ed.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return true;
    }

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return false;
    for (let i = 0; i < sel.rangeCount; i++) {
      const rg = sel.getRangeAt(i);
      const ac = rg.commonAncestorContainer;
      const ae = ac && ac.nodeType === 1 ? ac : (ac && ac.parentElement);
      if (ae && w3IsUi(ae)) continue;
      const rcs = rg.getClientRects();
      for (let j = 0; j < rcs.length; j++) {
        const r = rcs[j];
        if (r.width > 0 && r.height > 0 && x >= r.left - 2 && x <= r.right + 2 && y >= r.top - 1 && y <= r.bottom + 1) return true;
      }
    }
    return false;
  }

  function w3ClearPe() {
    if (w3PeHovered) { w3PeHovered.classList.remove('macro-pe-txt'); w3PeHovered = null; }
    for (let i = 0; i < w3PeDragGrp.length; i++) w3PeDragGrp[i].classList.remove('macro-pe-txt');
    w3PeDragGrp = [];
  }

  function w3HoverTick(x, y) {
    if (!v9TxtOn() || w3DragSel) return;
    if (w3PeDirty || performance.now() - w3PeLastScan > 350) w3ScanPeNone();
    const topEl = document.elementFromPoint(x, y);
    if (w3IsUi(topEl)) { w3ClearPe(); return; }
    let found = null;
    for (let i = 0; i < w3PeList.length; i++) {
      const el = w3PeList[i];
      if (!el.isConnected || w3IsOccluded(el, topEl)) continue;
      if (w3ElTxtHit(el, x, y)) { found = el; break; }
    }
    if (w3PeHovered && w3PeHovered !== found) {
      const sel = window.getSelection();
      if (!(sel && !sel.isCollapsed && sel.containsNode(w3PeHovered, true))) {
        w3PeHovered.classList.remove('macro-pe-txt');
      }
      w3PeHovered = null;
    }
    if (found) {
      found.classList.add('macro-pe-txt');
      w3PeHovered = found;
    }
  }

  function k9SyncTxtMode() {
    const on = v9TxtOn();
    if (document.body) {
      document.body.classList.toggle('macro-txt-sel-on', on);
      if (on && !w3PeObs && typeof MutationObserver === 'function') {
        w3PeObs = new MutationObserver(() => { w3PeDirty = true; });
        w3PeObs.observe(document.body, { childList: true, subtree: true, characterData: true });
      }
    }
    if (!on) {
      if (w3PeObs) { w3PeObs.disconnect(); w3PeObs = null; }
      w3ClearPe();
      w3SetBypass(false);
      w3DragSel = false;
      w3DragCvs = false;
      w3RmbHit = false;
      document.querySelectorAll('.macro-pe-txt').forEach(el => el.classList.remove('macro-pe-txt'));
      w3AllLayers.forEach(lr => {
        lr.root.style.display = 'none';
        for (let i = 0; i < lr.slots.length; i++) {
          const sl = lr.slots[i];
          sl.el.style.display = 'none';
          sl.el.textContent = '';
          sl.txt = '';
          sl.tr = '';
          sl.vis = false;
          sl.nd = null;
          sl.ki = -1;
          lr.pool.push(sl);
        }
        lr.slots.length = 0;
      });
      w3DirtyCv.clear();
    } else {
      w3PeDirty = true;
      w3PixiMs = 0;
      document.querySelectorAll('canvas').forEach(cv => {
        if (w3ConnTxt.has(cv)) w3DirtyCv.add(cv);
      });
      w3TickTxt();
    }
  }

  const c9LmW2xR = new Set();
  let r7DpK4vM = 0;

  function u5KnP8sT(st, scn) {
    if (!st || !st.children || !st.children.length) return;
    let wld = st.children[0];
    if (wld && (!wld.children || !wld.children.length) && st.children.length > 1) {
      for (let i = 1; i < st.children.length; i++) {
        if (st.children[i] && st.children[i].children && st.children[i].children.length) {
          wld = st.children[i];
          break;
        }
      }
    }
    if (!wld) return;
    if (m9TvL2sP.stripFilters) {
      if (wld.filters && wld.filters.length > 0) wld.filters = null;
      if (st.filters && st.filters.length > 0) st.filters = null;
    }
    if (!m9TvL2sP.frustumCulling) {
      if (c9LmW2xR.size > 0) {
        c9LmW2xR.forEach(c => {
          if (c && !c.destroyed) c.renderable = true;
        });
        c9LmW2xR.clear();
      }
      return;
    }
    if (!wld.children) return;
    let cc = null, mx = 0;
    for (let i = 0; i < wld.children.length; i++) {
      const c = wld.children[i], n = c.children ? c.children.length : 0;
      if (n > mx) { mx = n; cc = c; }
    }
    if (!cc || !cc.children) return;
    if (m9TvL2sP.stripFilters && cc.filters && cc.filters.length > 0) cc.filters = null;
    const cl = cc.children;
    if (c9LmW2xR.size > 0) {
      c9LmW2xR.forEach(c => {
        if (!c || c.destroyed || c.parent !== cc) {
          if (c && !c.destroyed) c.renderable = true;
          c9LmW2xR.delete(c);
        }
      });
    }
    const sw = (scn && scn.width) ? scn.width : window.innerWidth;
    const sh = (scn && scn.height) ? scn.height : window.innerHeight;
    const mg = m9TvL2sP.cullMarginToggle ? (m9TvL2sP.cullMargin || 120) : 0;
    const mnX = -mg, mxX = sw + mg, mnY = -mg, mxY = sh + mg;
    for (let i = 0; i < cl.length; i++) {
      const c = cl[i];
      if (!c || c.destroyed) continue;
      const b = c.getBounds ? m7Box(c.getBounds()) : null;
      if (!b) continue;
      const out = (b.x + b.w < mnX) || (b.x > mxX) || (b.y + b.h < mnY) || (b.y > mxY);
      if (out) {
        if (c.renderable) {
          c.renderable = false;
          c9LmW2xR.add(c);
        }
      } else if (!c.renderable) {
        c.renderable = true;
        c9LmW2xR.delete(c);
      }
    }
  }

  function m7Box(lb) {
    if (!lb) return null;
    const x = lb.x !== undefined ? lb.x : lb.minX;
    const y = lb.y !== undefined ? lb.y : lb.minY;
    const w = lb.width !== undefined ? lb.width : (lb.maxX - x);
    const h = lb.height !== undefined ? lb.height : (lb.maxY - y);
    return (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(w) && Number.isFinite(h)) ? { x, y, w, h } : null;
  }

  function m7SyncPixi(st, scn, rnd) {
    if (!st || !st.children || !st.children.length) return;
    let wld = st.children[0];
    if (wld && (!wld.children || !wld.children.length) && st.children.length > 1) {
      for (let i = 1; i < st.children.length; i++) {
        if (st.children[i] && st.children[i].children && st.children[i].children.length) {
          wld = st.children[i];
          break;
        }
      }
    }
    if (!wld) return;
    let cam = wld, wt = wld.worldTransform;
    if (wt && Math.abs(wt.a - 1) < 1e-4 && Math.abs(wt.d - 1) < 1e-4 && Math.abs(wt.tx) < 0.5 && Math.abs(wt.ty) < 0.5 && wld.children) {
      for (let i = 0; i < wld.children.length; i++) {
        const c = wld.children[i];
        const cwt = c && c.worldTransform;
        if (c && c.children && c.children.length && cwt && cwt.a > 0.002 && cwt.a < 25 && (Math.abs(cwt.a - 1) > 1e-4 || Math.abs(cwt.tx) > 0.5 || Math.abs(cwt.ty) > 0.5)) {
          cam = c;
          wt = cwt;
          break;
        }
      }
    }
    if (!wt || !Number.isFinite(wt.a) || wt.a <= 1e-4) return;
    p9WtA = wt.a; p9WtB = wt.b; p9WtC = wt.c; p9WtD = wt.d; p9WtTx = wt.tx; p9WtTy = wt.ty;
    p9ScW = scn && scn.width ? scn.width : 0;
    p9ScH = scn && scn.height ? scn.height : 0;
    p9CvRef = rnd.canvas || rnd.view || t8VwM4xK();
    if (p9CvRef && !p9CvRef.hasAttribute('data-macro-game-bg')) p9CvRef.setAttribute('data-macro-game-bg', '1');
    p9PixiOn = true;
    p9LastPixiMs = performance.now();

    if (!m9TvL2sP.fixedBackgroundEnabled && m9TvL2sP.mapBgEnabled && q8MwP && cam.children) {
      let ccNode = null, maxCh = 0;
      const chs = cam.children;
      for (let i = 0; i < chs.length; i++) {
        const n = chs[i] && chs[i].children ? chs[i].children.length : 0;
        if (n > maxCh) { maxCh = n; ccNode = chs[i]; }
      }
      let best = null, bestScore = -1;
      for (let i = 0; i < chs.length; i++) {
        const ch = chs[i];
        if (!ch || ch === ccNode || ch.visible === false || ch.destroyed) continue;
        const subN = ch.children ? ch.children.length : 0;
        if (subN > 16) continue;
        if (subN > 0 && ch.children.some(k => k && k.children && k.children.length > 0)) continue;
        if (typeof ch.getLocalBounds !== 'function') continue;
        const b = m7Box(ch.getLocalBounds());
        if (!b || b.w < 3000 || b.h < 3000 || b.w > 80000 || b.h > 80000) continue;
        const lt = ch.localTransform;
        const lx = lt ? (b.x * lt.a + b.y * lt.c + lt.tx) : b.x;
        const ly = lt ? (b.x * lt.b + b.y * lt.d + lt.ty) : b.y;
        const lw = lt ? Math.abs(b.w * lt.a) : b.w;
        const lh = lt ? Math.abs(b.h * lt.d) : b.h;
        if (lw < 3000 || lh < 3000 || lw > 80000 || lh > 80000) continue;
        if (Math.abs(lw - lh) > Math.max(lw, lh) * 0.03) continue;
        const cOff = Math.hypot(lx + lw * 0.5, ly + lh * 0.5);
        const zOff = Math.hypot(lx, ly);
        if (cOff > lw * 0.05 && zOff > lw * 0.05) continue;
        const sc = (subN === 0 ? 100000 : 0) + lw;
        if (sc > bestScore) { bestScore = sc; best = { x: lx, y: ly, w: lw, h: lh }; }
      }
      if (best) {
        p9MapX = best.x; p9MapY = best.y; p9MapW = best.w; p9MapH = best.h;
      }
    }

    if (b7DrawFn) b7DrawFn();
  }

  const i4TnL9wP = setInterval(() => {
    if (!window.PIXI) return;
    const P = window.PIXI;
    const rn = [...new Set([P.WebGLRenderer, P.WebGPURenderer, P.CanvasRenderer, P.Renderer].filter(Boolean))];
    for (let i = 0; i < rn.length; i++) {
      const R = rn[i];
      if (R.prototype && R.prototype.render) {
        const ro = R.prototype.render;
        R.prototype.render = function (op) {
          r7DpK4vM++;
          const isRoot = r7DpK4vM === 1;
          const st = isRoot ? (op && (op.container || op.target) ? (op.container || op.target) : op) : null;
          if (isRoot && this.background && typeof this.background.alpha === 'number') {
            const bgAct = Boolean((m9TvL2sP.fixedBackgroundEnabled && u4TkQ) || (!m9TvL2sP.fixedBackgroundEnabled && m9TvL2sP.mapBgEnabled && q8MwP));
            if (bgAct) {
              if (this._mBgA === undefined) this._mBgA = this.background.alpha;
              if (this.background.alpha !== 0) this.background.alpha = 0;
            } else if (this._mBgA !== undefined) {
              this.background.alpha = this._mBgA;
              delete this._mBgA;
            }
          }
          try {
            if (isRoot && st && st.children) u5KnP8sT(st, this.screen);
            const res = ro.apply(this, arguments);
            if (isRoot && st && st.children) m7SyncPixi(st, this.screen, this);
            if (isRoot && st && v9TxtOn()) w3PixiScan(st, this.screen, this);
            return res;
          } finally {
            r7DpK4vM--;
          }
        };
      }
    }
    clearInterval(i4TnL9wP);
  }, 50);

  const p5QzL9sT = pt => {
    if (!pt || !pt.uniformMatrix4fv) return;
    const og = pt.uniformMatrix4fv;
    pt.uniformMatrix4fv = function (lc, tr, dt) {
      if (dt && dt.length >= 16) {
        const cv = cachedGameCanvas || t8VwM4xK();
        if (cv && cv.width > 0 && this.canvas === cv) {
          f4NzQ8vR++;
          const m0 = Math.abs(dt[0]), m5 = Math.abs(dt[5]);
          if (m0 > 1e-6 && m5 > 1e-6 && m0 < 80.0 && m5 < 80.0 && Math.abs(dt[1]) < 1e-4 && Math.abs(dt[4]) < 1e-4) {
            if (Math.abs((m0 * (cv.width / cv.height)) / m5 - 1.0) < 0.18) {
              const dtc = m0 * cv.width * 0.5;
              if (dtc > 0.005 && dtc < 50.0) {
                k6XpL1vQ = dtc;
                if (r3WnS8mT === null) r3WnS8mT = dtc;
              }
            }
          }
        }
      }
      return og.apply(this, arguments);
    };
  };

  const uLocMap = new WeakMap();

  const h6LocHook = pt => {
    if (!pt || !pt.getUniformLocation) return;
    const og = pt.getUniformLocation;
    pt.getUniformLocation = function (pr, nm) {
      const loc = og.apply(this, arguments);
      if (loc && typeof nm === 'string') {
        if (/proj|tex|uv|color|sampler|filter/i.test(nm)) uLocMap.set(loc, 2);
        else if (/translation|worldtransform|uworldmatrix/i.test(nm)) uLocMap.set(loc, 1);
      }
      return loc;
    };
  };

  const y2TvN7wM = pt => {
    if (!pt || !pt.uniformMatrix3fv) return;
    const og = pt.uniformMatrix3fv;
    pt.uniformMatrix3fv = function (lc, tr, dt) {
      if (dt && dt.length >= 9) {
        const cv = cachedGameCanvas || t8VwM4xK();
        if (cv && cv.width > 0 && this.canvas === cv) {
          f4NzQ8vR++;
          const z = dt[0];
          const uk = lc ? (uLocMap.get(lc) || 0) : 0;
          if (!tr && uk !== 2 && z > 0.003 && z < 15.0 && dt[4] > 0.003 &&
              Math.abs(z - dt[4]) < Math.max(z, dt[4]) * 0.01 &&
              Math.abs(dt[1]) < 1e-4 && Math.abs(dt[3]) < 1e-4 &&
              (Math.abs(z - 1.0) > 0.01 || (kAct && Math.abs(zM - 1.0) < 0.1)) &&
              (Math.abs(dt[6]) > 5 || Math.abs(dt[7]) > 5)) {
            zM = z; tX = dt[6]; tY = dt[7]; kAct = true; p9GlMs = performance.now();
          }
          const m0 = Math.abs(dt[0]), m4 = Math.abs(dt[4]);
          if (m0 > 1e-6 && m4 > 1e-6 && m0 < 80.0 && m4 < 80.0 && Math.abs(dt[1]) < 1e-4 && Math.abs(dt[3]) < 1e-4) {
            if (Math.abs((m0 * (cv.width / cv.height)) / m4 - 1.0) < 0.18) {
              const dtc = m0 * cv.width * 0.5;
              if (dtc > 0.005 && dtc < 50.0) {
                k6XpL1vQ = dtc;
                if (r3WnS8mT === null) r3WnS8mT = dtc;
              }
            }
          }
        }
      }
      return og.apply(this, arguments);
    };
  };

  const n4GlDrw = pt => {
    if (!pt) return;
    ['drawArrays', 'drawElements'].forEach(fn => {
      if (!pt[fn]) return;
      const og = pt[fn];
      pt[fn] = function () {
        if (this.canvas === (cachedGameCanvas || t8VwM4xK())) f4NzQ8vR++;
        return og.apply(this, arguments);
      };
    });
  };

  h6LocHook(WebGLRenderingContext.prototype);
  p5QzL9sT(WebGLRenderingContext.prototype);
  y2TvN7wM(WebGLRenderingContext.prototype);
  n4GlDrw(WebGLRenderingContext.prototype);
  if (typeof WebGL2RenderingContext !== 'undefined') {
    h6LocHook(WebGL2RenderingContext.prototype);
    p5QzL9sT(WebGL2RenderingContext.prototype);
    y2TvN7wM(WebGL2RenderingContext.prototype);
    n4GlDrw(WebGL2RenderingContext.prototype);
  }

  const w7PxM3tL = CanvasRenderingContext2D.prototype.setTransform;
  CanvasRenderingContext2D.prototype.setTransform = function (a, b, c, d, e, f) {
    if (typeof a === 'number') {
      const s = Math.hypot(a, b);
      if (s > 0.005 && s < 50.0) {
        const cv = this.canvas;
        if (cv && (cv.id === 'canvas' || cv === (cachedGameCanvas || t8VwM4xK()))) {
          f4NzQ8vR++;
          const z0 = Math.abs(a - 1) < 1e-4 && Math.abs(b) < 1e-4 && Math.abs(e || 0) < 1 && Math.abs(f || 0) < 1;
          if (!z0) {
            k6XpL1vQ = s;
            if (r3WnS8mT === null) r3WnS8mT = s;
          }
          if ((!p9PixiOn || performance.now() - p9LastPixiMs > 500) && typeof d === 'number' && typeof e === 'number' && typeof f === 'number') {
            if (Math.abs(b) < 1e-4 && Math.abs(c) < 1e-4 && Math.abs(a - d) < 1e-3 && Math.abs(a - 1) > 1e-3 && (Math.abs(e) > 1 || Math.abs(f) > 1)) {
              p9C2A = a; p9C2D = d; p9C2Tx = e; p9C2Ty = f; p9C2Cv = cv; p9C2On = true;
            }
          }
        }
      }
    }
    return w7PxM3tL.apply(this, arguments);
  };

  window.addEventListener('wheel', e => {
    m8QzV2tL = Math.max(0.04, Math.min(25.0, m8QzV2tL * (e.deltaY < 0 ? 1.08 : 0.925)));
  }, { passive: true });

  function k3WnL8vR() {
    const nw = performance.now();
    if (p9PixiOn && nw - p9LastPixiMs <= 500 && p9ScW > 0) {
      const cv = cachedGameCanvas || t8VwM4xK();
      if (cv && cv.width > 0) {
        const pz = Math.hypot(p9WtA, p9WtB) * (cv.width / p9ScW);
        if (pz > 0.002 && pz < 50.0) return pz;
      }
    }
    if (p9C2On && p9C2A > 0.002 && p9C2A < 50.0 && (!p9PixiOn || nw - p9LastPixiMs > 500)) return p9C2A;
    return (r3WnS8mT && Math.abs(k6XpL1vQ - r3WnS8mT) > 1e-5) ? (k6XpL1vQ / r3WnS8mT) : m8QzV2tL;
  }

  const b8QzT4mL = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (t, o) {
    if (t === 'webgl' || t === 'webgl2') {
      o = Object.assign({}, o, { preserveDrawingBuffer: true, powerPreference: 'high-performance' });
    }
    const ctx = b8QzT4mL.call(this, t, o);
    if (ctx && this.id !== 'autorev-overlay' && this.id !== 'macro-bg-canvas' && this.id !== 'macro-plexus-canvas') {
      if (t === 'webgl' || t === 'webgl2') gCtxMap.set(this, { gl: ctx, ctx2d: null });
      else if (t === '2d' && !gCtxMap.has(this)) gCtxMap.set(this, { gl: null, ctx2d: ctx });
    }
    return ctx;
  };

  let r5TxL1wQ = null, m3WpS8xT = 0, v9QnL4vM = 0;

  function z2TvM8sP() {
    const nw = performance.now();
    if (nw - v5QzR9mL < 350) return false;
    v5QzR9mL = nw;
    const mp = document.getElementById('main-panel');
    if (mp && window.getComputedStyle(mp).display !== 'none') return true;
    const p = s8XnL3wP && document.contains(s8XnL3wP) ? s8XnL3wP : (s8XnL3wP = document.getElementById('score-panel') || document.getElementById('stats') || document.querySelector('[id*="score"]') || document.querySelector('.main-bottom-stats'));
    if (p) {
      const m = (p.textContent || '').match(/Mass\s*:\s*([0-9\s,]+)/i);
      if (m) {
        const val = parseInt(m[1].replace(/[\s,]/g, ''), 10);
        return val <= 0 || isNaN(val);
      }
    }
    return false;
  }

  const f8WnK3xL = {
    locked: false, cx: 0, cy: 0, r: 0, rawCx: 0, rawCy: 0, rawR: 0, worldR: 0,
    vx: 0, vy: 0, vr: 0, misses: 0, displayMass: 0, lastTimestamp: performance.now(),
    color: null
  };
  const x5QzL2wT = { active: false, cx: 0, cy: 0, worldR: 0, alpha: 0, pop: 1.0 };

  function p9TvM4sL(w, h) {
    if (!r5TxL1wQ || m3WpS8xT !== w || v9QnL4vM !== h) {
      m3WpS8xT = w; v9QnL4vM = h;
      r5TxL1wQ = new Uint8Array(w * h * 4);
    }
    return r5TxL1wQ;
  }

  function y4WnS8tM(b, w, h, isGl, x, y) {
    const idx = ((isGl ? h - 1 - y : y) * w + x) * 4;
    return { r: b[idx], g: b[idx + 1], b: b[idx + 2], a: b[idx + 3] };
  }

  const w3QzL7vK = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const k8TvN2xP = (r, g, b) => r < 30 && g < 30 && b < 30;
  const x7TxP4nM = (r, g, b) => r > 210 && g > 210 && b > 210;
  const b4WpL9sT = (r1, g1, b1, r2, g2, b2, tol) => Math.abs(r1 - r2) <= tol && Math.abs(g1 - g2) <= tol && Math.abs(b1 - b2) <= tol;

  function r7QnM3vL(p1, p2, p3) {
    const d = 2 * (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));
    if (Math.abs(d) < 1e-6) return null;
    const a2 = p1.x * p1.x + p1.y * p1.y, b2 = p2.x * p2.x + p2.y * p2.y, c2 = p3.x * p3.x + p3.y * p3.y;
    const cx = (a2 * (p2.y - p3.y) + b2 * (p3.y - p1.y) + c2 * (p1.y - p2.y)) / d;
    const cy = (a2 * (p3.x - p2.x) + b2 * (p1.x - p3.x) + c2 * (p2.x - p1.x)) / d;
    return { cx, cy, r: Math.hypot(p1.x - cx, p1.y - cy) };
  }

  function m5TxK8wP(pts, fb) {
    function fit(arr, seed) {
      const n = arr.length;
      if (n < 4) return seed;
      let sX = 0, sY = 0;
      for (let i = 0; i < n; i++) { sX += arr[i].x; sY += arr[i].y; }
      const mx = sX / n, my = sY / n;
      let mxx = 0, myy = 0, mxy = 0, mxz = 0, myz = 0;
      for (let i = 0; i < n; i++) {
        const u = arr[i].x - mx, v = arr[i].y - my;
        mxx += u * u; myy += v * v; mxy += u * v; mxz += u * (u * u + v * v); myz += v * (u * u + v * v);
      }
      const det = mxx * myy - mxy * mxy;
      let cx = seed.cx, cy = seed.cy, r = seed.r;
      if (Math.abs(det) > 1e-5) {
        const uc = (myy * mxz - mxy * myz) / (2 * det), vc = (mxx * myz - mxy * mxz) / (2 * det);
        cx = mx + uc; cy = my + vc;
        r = Math.sqrt(uc * uc + vc * vc + (mxx + myy) / n);
      }
      for (let it = 0; it < 2; it++) {
        let j11 = 0, j12 = 0, j22 = 0, b1 = 0, b2 = 0, tD = 0;
        for (let i = 0; i < n; i++) {
          const dx = arr[i].x - cx, dy = arr[i].y - cy, d = Math.hypot(dx, dy);
          if (d < 1e-5) continue;
          tD += d;
          const ux = dx / d, uy = dy / d, res = d - r;
          j11 += ux * ux; j12 += ux * uy; j22 += uy * uy;
          b1 += ux * res; b2 += uy * res;
        }
        const jDet = j11 * j22 - j12 * j12;
        if (Math.abs(jDet) < 1e-5) break;
        const dCx = (j22 * b1 - j12 * b2) / jDet, dCy = (j11 * b2 - j12 * b1) / jDet;
        cx += dCx; cy += dCy; r = tD / n;
        if (dCx * dCx + dCy * dCy < 0.01) break;
      }
      return { cx, cy, r };
    }
    const first = fit(pts, fb);
    if (pts.length < 8) return first;
    const tol = Math.max(1.5, first.r * 0.025);
    const trimmed = [];
    for (let i = 0; i < pts.length; i++) {
      if (Math.abs(Math.hypot(pts[i].x - first.cx, pts[i].y - first.cy) - first.r) <= tol) trimmed.push(pts[i]);
    }
    return trimmed.length >= 6 ? fit(trimmed, first) : first;
  }

  function v2WzL7tM(b, w, h, isGl, sx, sy, tc, mr) {
    const rx = Math.round(Math.max(0, Math.min(w - 1, sx)));
    const ry = Math.round(Math.max(0, Math.min(h - 1, sy)));
    const p0 = y4WnS8tM(b, w, h, isGl, rx, ry);
    if (tc) {
      if (b4WpL9sT(p0.r, p0.g, p0.b, tc.r, tc.g, tc.b, 40)) return { x: rx, y: ry, color: tc };
      const lim = Math.min(Math.max(w, h), Math.max(20, mr));
      for (let rad = 3; rad <= lim; rad += rad < 16 ? 3 : 6) {
        for (let k = 0; k < 16; k++) {
          const ang = k * Math.PI / 8, x = Math.round(rx + rad * Math.cos(ang)), y = Math.round(ry + rad * Math.sin(ang));
          if (x < 0 || x >= w || y < 0 || y >= h) continue;
          const p = y4WnS8tM(b, w, h, isGl, x, y);
          if (b4WpL9sT(p.r, p.g, p.b, tc.r, tc.g, tc.b, 40)) return { x, y, color: tc };
        }
      }
      return null;
    }
    if (!k8TvN2xP(p0.r, p0.g, p0.b) && !x7TxP4nM(p0.r, p0.g, p0.b)) return { x: rx, y: ry, color: p0 };
    const rings = [2, 4, 7, 10, 14];
    for (let ri = 0; ri < rings.length; ri++) {
      const rad = rings[ri];
      for (let k = 0; k < 12; k++) {
        const ang = (k * Math.PI) / 6;
        const x = Math.round(rx + rad * Math.cos(ang)), y = Math.round(ry + rad * Math.sin(ang));
        if (x < 0 || x >= w || y < 0 || y >= h) continue;
        const p = y4WnS8tM(b, w, h, isGl, x, y);
        if (!k8TvN2xP(p.r, p.g, p.b) && !x7TxP4nM(p.r, p.g, p.b)) return { x, y, color: p };
      }
    }
    if (!k8TvN2xP(p0.r, p0.g, p0.b)) return { x: rx, y: ry, color: p0 };
    return null;
  }

  function z9TvS4xL(b, w, h, isGl, ox, oy, cos, sin, bc, maxD, sm) {
    let cD = 0, cT = 0, cO = 0, lD = 0, t = 0;
    const mS = Math.min(maxD, 2400);
    const minD = sm ? 1.5 : 2.5;
    const cCut = sm ? 3 : 8;
    const wCell = x7TxP4nM(bc.r, bc.g, bc.b);

    while (t < mS) {
      const sInc = t < 16 ? 1.0 : (t < 90 ? 2.0 : 2.8);
      t += sInc;
      const px = Math.round(ox + t * cos), py = Math.round(oy + t * sin);
      if (px <= 0 || px >= w - 1 || py <= 0 || py >= h - 1) return lD >= minD ? { x: ox + lD * cos, y: oy + lD * sin, hitType: 'edge' } : null;
      const p = y4WnS8tM(b, w, h, isGl, px, py);
      if (b4WpL9sT(p.r, p.g, p.b, bc.r, bc.g, bc.b, 40)) {
        cD = 0; cT = 0; cO = 0; lD = t;
      } else if (k8TvN2xP(p.r, p.g, p.b)) {
        cT = 0; cO = 0;
        if (++cD >= 2) {
          let eT = lD;
          if (sInc > 1) {
            const mx = Math.round(ox + (t - 1) * cos), my = Math.round(oy + (t - 1) * sin);
            if (mx > 0 && mx < w - 1 && my > 0 && my < h - 1) {
              const mp = y4WnS8tM(b, w, h, isGl, mx, my);
              if (!k8TvN2xP(mp.r, mp.g, mp.b)) eT = t - 1;
            }
          }
          const prev = y4WnS8tM(b, w, h, isGl, Math.round(ox + eT * cos), Math.round(oy + eT * sin));
          const cur = y4WnS8tM(b, w, h, isGl, Math.round(ox + (eT + 1) * cos), Math.round(oy + (eT + 1) * sin));
          const pl = w3QzL7vK(prev.r, prev.g, prev.b), cl = w3QzL7vK(cur.r, cur.g, cur.b);
          const sub = Math.max(0, Math.min(1, Math.abs(pl - 35) / (Math.abs(pl - cl) + 1e-4)));
          const d = eT + sub * 0.5;
          return d >= minD ? { x: ox + d * cos, y: oy + d * sin, hitType: 'bg' } : null;
        }
      } else if (!wCell && x7TxP4nM(p.r, p.g, p.b)) {
        cD = 0; cO = 0;
        if (++cT > 24) return lD >= minD ? { x: ox + lD * cos, y: oy + lD * sin, hitType: 'cell' } : null;
      } else {
        cD = 0; cT = 0;
        if (++cO >= 2 && t > cCut) return lD >= minD ? { x: ox + lD * cos, y: oy + lD * sin, hitType: 'cell' } : null;
      }
    }
    return lD >= minD ? { x: ox + lD * cos, y: oy + lD * sin, hitType: 'edge' } : null;
  }

  function c6RmN8kL(b, w, h, isGl, sx, sy, bc, maxD, sm) {
    const rR = z9TvS4xL(b, w, h, isGl, sx, sy, 1, 0, bc, maxD, sm);
    const rL = z9TvS4xL(b, w, h, isGl, sx, sy, -1, 0, bc, maxD, sm);
    const rD = z9TvS4xL(b, w, h, isGl, sx, sy, 0, 1, bc, maxD, sm);
    const rU = z9TvS4xL(b, w, h, isGl, sx, sy, 0, -1, bc, maxD, sm);
    const mx = (rR && rL && rR.hitType !== 'edge' && rL.hitType !== 'edge') ? Math.round((rR.x + rL.x) * 0.5) : sx;
    const my = (rD && rU && rD.hitType !== 'edge' && rU.hitType !== 'edge') ? Math.round((rD.y + rU.y) * 0.5) : sy;
    if (mx >= 0 && mx < w && my >= 0 && my < h) {
      const p = y4WnS8tM(b, w, h, isGl, mx, my);
      if (b4WpL9sT(p.r, p.g, p.b, bc.r, bc.g, bc.b, 40) || x7TxP4nM(p.r, p.g, p.b)) return { x: mx, y: my };
    }
    return { x: sx, y: sy };
  }

  const n8Rc = new Float64Array(64), n8Rs = new Float64Array(64);
  for (let i = 0; i < 64; i++) { const a = i * Math.PI / 32; n8Rc[i] = Math.cos(a); n8Rs[i] = Math.sin(a); }
  function f9FrW(rays) {
    let minH = Infinity, maxH = 0, vA = 0;
    for (let a = 0; a < 32; a++) {
      const ux = n8Rc[a], uy = n8Rs[a];
      if (rays.some(r => r.hitType !== 'bg' && Math.abs(r.dx * ux + r.dy * uy) > 0.96)) continue;
      let minP = Infinity, maxP = -Infinity, minT = '', maxT = '';
      for (const r of rays) { const p = r.x * ux + r.y * uy; if (p < minP) { minP = p; minT = r.hitType; } if (p > maxP) { maxP = p; maxT = r.hitType; } }
      if (minT === 'bg' && maxT === 'bg' && maxP > minP) { const hw = (maxP - minP) * 0.5; minH = Math.min(minH, hw); maxH = Math.max(maxH, hw); vA++; }
    }
    return { minHalf: vA ? minH : 0, maxHalf: maxH, validAxes: vA };
  }

  function q4WnM8sT(b, w, h, isGl, cx, cy, r, bc, zm, oX, oY) {
    if (r < 26 || !Number.isFinite(r)) return null;
    const pts = [], wCell = x7TxP4nM(bc.r, bc.g, bc.b);
    let minX = Infinity, minY = Infinity, maxX = -1, maxY = -1;
    for (let ray = 0; ray < 32; ray++) {
      const ang = (ray * Math.PI) / 16;
      for (const [ring, fr] of [[0, 0.965], [1, 0.985]]) {
        const x = Math.round(cx + r * fr * Math.cos(ang)), y = Math.round(cy + r * fr * Math.sin(ang));
        if (x < 1 || x >= w - 1 || y < 1 || y >= h - 1) continue;
        const p = y4WnS8tM(b, w, h, isGl, x, y);
        if (!k8TvN2xP(p.r, p.g, p.b) && (wCell || !x7TxP4nM(p.r, p.g, p.b)) && b4WpL9sT(p.r, p.g, p.b, bc.r, bc.g, bc.b, 50)) {
          const gx = x + oX, gy = y + oY;
          pts.push({ x: gx, y: gy, octant: ray >> 2, ring });
          minX = Math.min(minX, gx); minY = Math.min(minY, gy);
          maxX = Math.max(maxX, gx); maxY = Math.max(maxY, gy);
        }
      }
    }
    if (pts.length < 22) return null;
    const cr = [];
    for (const [dx, dy] of [[0, 0], [0.35, 0], [-0.35, 0], [0, 0.35], [0, -0.35]]) {
      const x = Math.round(cx + dx * r), y = Math.round(cy + dy * r);
      if (x >= 0 && x < w && y >= 0 && y < h) {
        const gx = x + oX, gy = y + oY;
        cr.push({ x: gx, y: gy });
        minX = Math.min(minX, gx); minY = Math.min(minY, gy);
        maxX = Math.max(maxX, gx); maxY = Math.max(maxY, gy);
      }
    }
    if (cr.length < 3) return null;
    return { points: pts, core: cr, zoom: zm, minX, minY, maxX, maxY };
  }

  function d8QzL2vP(b, w, h, isGl, zm, oX, oY) {
    const pb = z8PxL2sT;
    if (!pb || pb.points.length < 22 || Math.abs(zm / pb.zoom - 1) > 0.008) return false;
    let elIn = 0, elOut = 0, rvIn = 0, rvOut = 0, octs = 0;
    for (const q of pb.points) {
      if (q.ring === 0) elIn++; else elOut++;
      const p = y4WnS8tM(b, w, h, isGl, q.x - oX, q.y - oY);
      if (k8TvN2xP(p.r, p.g, p.b)) {
        if (q.ring === 0) rvIn++; else rvOut++;
        octs |= 1 << q.octant;
      }
    }
    if (elIn < 10 || elOut < 10 || rvIn < Math.max(4, Math.ceil(elIn * 0.25)) || rvOut < Math.max(7, Math.ceil(elOut * 0.45))) return false;
    let sp = 0, opp = 0;
    for (let i = 0; i < 8; i++) sp += (octs >> i) & 1;
    for (let i = 0; i < 4; i++) if (((octs >> i) & 1) && ((octs >> (i + 4)) & 1)) opp++;
    if (sp < 6 && !(sp >= 4 && opp >= 2)) return false;
    let cOcc = 0;
    for (const q of pb.core) {
      const p = y4WnS8tM(b, w, h, isGl, q.x - oX, q.y - oY);
      if (!k8TvN2xP(p.r, p.g, p.b)) cOcc++;
    }
    return cOcc >= 3;
  }

  function h5TxM9wL(gl, ctx2d, cW, cH, exp) {
    const q = z8PxL2sT;
    if (!q || q.minX < 0 || q.minY < 0 || q.maxX >= cW || q.maxY >= cH) return null;
    let minX = q.minX, minY = q.minY, maxX = q.maxX, maxY = q.maxY;
    if (exp) {
      const rc = Math.ceil(f8WnK3xL.rawR * 1.24 + 20);
      minX = Math.max(0, Math.min(minX, Math.floor(f8WnK3xL.rawCx - rc)));
      minY = Math.max(0, Math.min(minY, Math.floor(f8WnK3xL.rawCy - rc)));
      maxX = Math.min(cW - 1, Math.max(maxX, Math.ceil(f8WnK3xL.rawCx + rc)));
      maxY = Math.min(cH - 1, Math.max(maxY, Math.ceil(f8WnK3xL.rawCy + rc)));
    }
    const width = maxX - minX + 1, height = maxY - minY + 1;
    if (width < 4 || height < 4) return null;
    if (gl) {
      const by = width * height * 4;
      if (!d3VwN8mT || h9TnK4xL < by) { d3VwN8mT = new Uint8Array(by); h9TnK4xL = by; }
      gl.readPixels(minX, cH - minY - height, width, height, gl.RGBA, gl.UNSIGNED_BYTE, d3VwN8mT);
      return { data: d3VwN8mT, x: minX, y: minY, width, height };
    }
    return ctx2d ? { data: ctx2d.getImageData(minX, minY, width, height).data, x: minX, y: minY, width, height } : null;
  }

  function p3WnK7vT(force) {
    if (!q9EnvOk) return;
    if (!f5TxL9wK && !force) return;
    const cv = t8VwM4xK();
    if (!cv || cv.width === 0 || cv.height === 0) {
      if (!f5TxL9wK) f8WnK3xL.locked = false;
      return;
    }
    const cw = cv.width, ch = cv.height;
    const { gl, ctx2d } = x4TvL8wP(cv);
    const isGl = Boolean(gl), rawZm = k3WnL8vR();
    const fZ = (f5TxL9wK && lockBaseZm > 0 && Math.abs(rawZm / lockBaseZm - 1) < 0.008) ? lockBaseZm : rawZm;
    const zSt = z8PxL2sT && Math.abs(fZ / z8PxL2sT.zoom - 1) <= 0.015;
    const nw = performance.now();
    const spSh = f8WnK3xL.locked ? Math.hypot(f8WnK3xL.vx || 0, f8WnK3xL.vy || 0) * (nw - f8WnK3xL.lastTimestamp) : 0;
    let fDue = Boolean(force) || !f5TxL9wK || !zSt || (nw - p6XvQ2wM >= 35) || (f8WnK3xL.locked && spSh >= Math.max(3, f8WnK3xL.rawR * 0.03));
    let lReg = null;

    if (f5TxL9wK && f8WnK3xL.locked && zSt) {
      lReg = h5TxM9wL(gl, ctx2d, cw, ch, fDue);
      if (lReg && d8QzL2vP(lReg.data, lReg.width, lReg.height, isGl, fZ, lReg.x, lReg.y)) {
        h8WpM2vQ();
        return;
      }
    }

    if (f5TxL9wK && z2TvM8sP()) { q2WnS7xM(true); return; }
    if (!fDue) return;
    p6XvQ2wM = nw;

    const rc = cv.getBoundingClientRect();
    const cxX = (t2QnL9wP - rc.left) * (cw / rc.width), cxY = (b8VmK3xT - rc.top) * (ch / rc.height);
    let oX = cxX, oY = cxY;

    if (f5TxL9wK && f8WnK3xL.locked) {
      const predDt = Math.min(35, Math.max(0, nw - f8WnK3xL.lastTimestamp));
      const maxShift = Math.max(4, f8WnK3xL.rawR * 0.45);
      oX = f8WnK3xL.cx + Math.max(-maxShift, Math.min(maxShift, (f8WnK3xL.vx || 0) * predDt));
      oY = f8WnK3xL.cy + Math.max(-maxShift, Math.min(maxShift, (f8WnK3xL.vy || 0) * predDt));
    }

    let scX = 0, scY = 0, scW = cw, scH = ch, buf;
    if (lReg && lReg.width >= 32) {
      scX = lReg.x; scY = lReg.y; scW = lReg.width; scH = lReg.height; buf = lReg.data;
    } else {
      const roiR = f8WnK3xL.locked ? Math.max(80, Math.ceil(f8WnK3xL.rawR * 1.24 + 24)) : 420;
      scX = Math.max(0, Math.min(cw - 1, Math.floor(oX - roiR)));
      scY = Math.max(0, Math.min(ch - 1, Math.floor(oY - roiR)));
      scW = Math.max(1, Math.min(cw - scX, Math.ceil(roiR * 2)));
      scH = Math.max(1, Math.min(ch - scY, Math.ceil(roiR * 2)));
      buf = p9TvM4sL(scW, scH);

      if (gl) gl.readPixels(scX, ch - scY - scH, scW, scH, gl.RGBA, gl.UNSIGNED_BYTE, buf);
      else if (ctx2d) buf.set(ctx2d.getImageData(scX, scY, scW, scH).data);
      else {
        if (!f5TxL9wK) f8WnK3xL.locked = false;
        return;
      }
    }

    const lOX = oX - scX, lOY = oY - scY;
    if (lOX < 0 || lOX >= scW || lOY < 0 || lOY >= scH) {
      if (f5TxL9wK) q2WnS7xM(true);
      return;
    }
    const sd = v2WzL7tM(buf, scW, scH, isGl, lOX, lOY, f5TxL9wK ? f8WnK3xL.color : null, f8WnK3xL.locked ? f8WnK3xL.rawR * 0.85 : 14);
    if (!sd) {
      if (f8WnK3xL.locked && f8WnK3xL.misses < (f5TxL9wK ? 8 : 2)) f8WnK3xL.misses++;
      else q2WnS7xM(true);
      return;
    }

    const bC = sd.color;
    const mDist = Math.hypot(scW, scH);
    const smMode = !f5TxL9wK || f8WnK3xL.rawR < 20;
    const ctr = f5TxL9wK ? c6RmN8kL(buf, scW, scH, isGl, sd.x, sd.y, bC, mDist, smMode) : { x: sd.x, y: sd.y };
    const rays = [], bgPts = [], cirPts = [];
    let octMask = 0;
    for (let i = 0; i < 64; i++) {
      const pt = z9TvS4xL(buf, scW, scH, isGl, ctr.x, ctr.y, n8Rc[i], n8Rs[i], bC, mDist, smMode);
      if (pt) {
        const q = { x: pt.x, y: pt.y, dx: n8Rc[i], dy: n8Rs[i], hitType: pt.hitType };
        rays.push(q);
        if (pt.hitType !== 'edge') cirPts.push(q);
        if (pt.hitType === 'bg') { bgPts.push(q); octMask |= 1 << (i >> 3); }
      }
    }
    let octCount = 0;
    for (let i = 0; i < 8; i++) octCount += (octMask >> i) & 1;
    const fitPts = (bgPts.length >= 12 && octCount >= 3) ? bgPts : cirPts;
    const cnt = fitPts.length;
    if (cnt < 5) {
      if (f8WnK3xL.locked && f8WnK3xL.misses < (f5TxL9wK ? 8 : 2)) f8WnK3xL.misses++;
      else q2WnS7xM(true);
      return;
    }

    let bCirc = null, bSc = -1;
    for (let it = 0; it < 36; it++) {
      const i1 = (Math.random() * cnt) | 0, i2 = (Math.random() * cnt) | 0, i3 = (Math.random() * cnt) | 0;
      if (i1 === i2 || i1 === i3 || i2 === i3) continue;
      const p1 = fitPts[i1], p2 = fitPts[i2], p3 = fitPts[i3];
      if (Math.hypot(p1.x - p2.x, p1.y - p2.y) < 1.5 || Math.hypot(p2.x - p3.x, p2.y - p3.y) < 1.5 || Math.hypot(p3.x - p1.x, p3.y - p1.y) < 1.5) continue;
      const cd = r7QnM3vL(p1, p2, p3);
      if (!cd || cd.r < 2.0 || cd.r > 3200) continue;
      const tl = Math.max(1.5, cd.r * 0.045);
      let inls = 0;
      for (let j = 0; j < cnt; j++) {
        if (Math.abs(Math.hypot(fitPts[j].x - cd.cx, fitPts[j].y - cd.cy) - cd.r) <= tl) inls++;
      }
      let cSc = inls;
      if (f5TxL9wK && f8WnK3xL.locked) {
        const pR = f8WnK3xL.rawR, rD = (cd.r - pR) / Math.max(1.0, pR);
        const pO = Math.hypot(cd.cx + scX - f8WnK3xL.rawCx, cd.cy + scY - f8WnK3xL.rawCy) / Math.max(1.0, pR);
        cSc = (rD > 0.65 || pO > 1.4) ? cSc * 0.12 : cSc * (1.0 - Math.max(0, rD) * 0.3);
      }
      if (cSc > bSc) { bSc = cSc; bCirc = cd; }
    }
    if (!bCirc || bSc < Math.max(4, Math.floor(cnt * 0.18))) {
      if (f8WnK3xL.locked && f8WnK3xL.misses < (f5TxL9wK ? 8 : 2)) f8WnK3xL.misses++;
      else q2WnS7xM(true);
      return;
    }
    const cns = [], fTl = Math.max(1.5, bCirc.r * 0.045);
    for (let j = 0; j < cnt; j++) {
      if (Math.abs(Math.hypot(fitPts[j].x - bCirc.cx, fitPts[j].y - bCirc.cy) - bCirc.r) <= fTl) cns.push(fitPts[j]);
    }
    const ref = m5TxK8wP(cns, bCirc);
    ref.cx += scX; ref.cy += scY;
    if (!f5TxL9wK && Math.hypot(cxX - ref.cx, cxY - ref.cy) > ref.r * 1.12 + 10) {
      f8WnK3xL.locked = false;
      return;
    }
    const cZm = fZ;
    const cWR = ref.r / Math.max(0.01, cZm);
    let errSum = 0;
    for (const p of cns) errSum += Math.abs(Math.hypot(p.x - (ref.cx - scX), p.y - (ref.cy - scY)) - ref.r);
    const meanErr = cns.length ? errSum / cns.length : 999;
    const cleanArc = bgPts.length >= 10 && (octCount >= 4 || (octCount >= 3 && cns.length >= 10 && meanErr <= Math.max(2, ref.r * 0.025)));
    const cMass = Math.max(1, Math.round(Math.pow(cWR / 10, 2)));
    f8WnK3xL.displayMass = cMass;
    f8WnK3xL.worldR = cWR;
    if (f5TxL9wK) {
      const dtSec = Math.min(0.1, Math.max(0.001, (nw - f8WnK3xL.lastTimestamp) * 0.001));
      const relX = (ref.cx - cw * 0.5) / Math.max(0.01, cZm), relY = (ref.cy - ch * 0.5) / Math.max(0.01, cZm);
      const feret = f9FrW(rays), minHW = feret.minHalf / Math.max(0.01, cZm), maxHW = feret.maxHalf / Math.max(0.01, cZm);
      const aspect = feret.validAxes >= 4 && minHW > 0 ? maxHW / minHW : 1;
      const pxTol = 3 / Math.max(0.01, cZm);
      if (cleanArc && cWR <= v4QnK9wL * 0.80 && cWR <= v4QnK9wL - pxTol) { h8WpM2vQ(); return; }
      if (((feret.validAxes >= 2 && minHW <= v4QnK9wL * 0.77) ||
           (feret.validAxes >= 1 && minHW <= v4QnK9wL * 0.75 && cWR <= v4QnK9wL * 0.82)) &&
          minHW <= v4QnK9wL - pxTol) { h8WpM2vQ(); return; }
      if (feret.validAxes >= 5 && aspect >= 1.24 && minHW <= v4QnK9wL * 0.84 && minHW <= v4QnK9wL - pxTol) { h8WpM2vQ(); return; }
      if (cleanArc && aspect < 1.15 && cWR > v4QnK9wL && cWR <= v4QnK9wL * 1.45) { v4QnK9wL = cWR; q7TwM3xP = cMass; }
      if (m2WpT7vX) {
        if (Math.hypot(relX - b9VxL3sQ, relY - r4QnM8tL) >= Math.max(12.0, v4QnK9wL * 0.22) && cWR <= v4QnK9wL * 0.90) {
          h8WpM2vQ(); return;
        }
      }
      b9VxL3sQ = relX; r4QnM8tL = relY; m2WpT7vX = true;
      if (cleanArc && aspect < 1.15 && cWR > v4QnK9wL * 0.90 && cWR <= v4QnK9wL) {
        const maxDecay = v4QnK9wL * Math.min(0.02, dtSec * 0.12);
        v4QnK9wL = Math.max(cWR, v4QnK9wL - maxDecay);
        q7TwM3xP = Math.max(1, Math.round(Math.pow(v4QnK9wL / 10, 2)));
      }
    }
    const dt = Math.max(1, nw - f8WnK3xL.lastTimestamp);
    f8WnK3xL.lastTimestamp = nw;
    if (f8WnK3xL.locked) {
      f8WnK3xL.cx = ref.cx;
      f8WnK3xL.cy = ref.cy;
      f8WnK3xL.r = ref.r;
      if (dt >= 6) {
        f8WnK3xL.vx = ((ref.cx - f8WnK3xL.rawCx) / dt) * 0.65 + (f8WnK3xL.vx || 0) * 0.35;
        f8WnK3xL.vy = ((ref.cy - f8WnK3xL.rawCy) / dt) * 0.65 + (f8WnK3xL.vy || 0) * 0.35;
        f8WnK3xL.vr = (ref.r - f8WnK3xL.rawR) / dt;
      }
    } else {
      f8WnK3xL.locked = true; f8WnK3xL.cx = ref.cx; f8WnK3xL.cy = ref.cy; f8WnK3xL.r = ref.r;
      f8WnK3xL.vx = 0; f8WnK3xL.vy = 0; f8WnK3xL.vr = 0;
    }
    f8WnK3xL.rawCx = ref.cx; f8WnK3xL.rawCy = ref.cy; f8WnK3xL.rawR = ref.r; f8WnK3xL.misses = 0;
    f8WnK3xL.color = bC;
    z8PxL2sT = q4WnM8sT(buf, scW, scH, isGl, ref.cx - scX, ref.cy - scY, ref.r, bC, cZm, scX, scY);
  }

  const y8QzL4sM = document.createElement('canvas');
  y8QzL4sM.id = 'autorev-overlay';
  const w4TvN8wL = y8QzL4sM.getContext('2d');
  y8QzL4sM.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:2147483647;';

  function k7WpL2vT() { y8QzL4sM.width = window.innerWidth; y8QzL4sM.height = window.innerHeight; }
  window.addEventListener('resize', k7WpL2vT, { passive: true });
  k7WpL2vT();
  document.body ? document.body.appendChild(y8QzL4sM) : window.addEventListener('DOMContentLoaded', () => document.body.appendChild(y8QzL4sM));

  let b3QnS9xM = performance.now();
  let o4Drty = false;

  function m4WnL7sT() {
    const nw = performance.now();
    if (v9TxtOn()) w3TickTxt();
    if ((!r8QnS4mT || nw - w2VpL9xK > 40) && !b5TxM1wP) {
      b5TxM1wP = true;
      try { j8PnL4wV++; p3WnK7vT(); } finally { b5TxM1wP = false; }
    }
    if (o4Drty) {
      w4TvN8wL.clearRect(0, 0, y8QzL4sM.width, y8QzL4sM.height);
      o4Drty = false;
    }
    const dlt = Math.min(50, Math.max(1, nw - b3QnS9xM));
    b3QnS9xM = nw;
    const dtSec = dlt * 0.001;
    const sm = 1 - Math.exp(-26 * dtSec);
    const midX = y8QzL4sM.width * 0.5, midY = y8QzL4sM.height * 0.5;

    if (f5TxL9wK && f8WnK3xL.locked) {
      x5QzL2wT.alpha += (1.0 - x5QzL2wT.alpha) * (1 - Math.exp(-18 * dtSec));
      x5QzL2wT.pop += (1.0 - x5QzL2wT.pop) * (1 - Math.exp(-14 * dtSec));
      const pCx = f8WnK3xL.cx + (f8WnK3xL.vx || 0) * Math.min(20, dlt * 0.35);
      const pCy = f8WnK3xL.cy + (f8WnK3xL.vy || 0) * Math.min(20, dlt * 0.35);
      if (!x5QzL2wT.active) {
        x5QzL2wT.active = true;
        x5QzL2wT.cx = pCx;
        x5QzL2wT.cy = pCy;
        x5QzL2wT.worldR = f8WnK3xL.worldR;
      } else {
        x5QzL2wT.cx += (pCx - x5QzL2wT.cx) * sm;
        x5QzL2wT.cy += (pCy - x5QzL2wT.cy) * sm;
        x5QzL2wT.worldR += (f8WnK3xL.worldR - x5QzL2wT.worldR) * sm;
      }
    } else if (x5QzL2wT.active) {
      x5QzL2wT.alpha *= Math.exp(-15 * dtSec);
      x5QzL2wT.pop += (1.06 - x5QzL2wT.pop) * (1 - Math.exp(-10 * dtSec));
      if (x5QzL2wT.alpha < 0.01) {
        x5QzL2wT.active = false;
        x5QzL2wT.alpha = 0;
      }
    }

    if (!x5QzL2wT.active || x5QzL2wT.alpha <= 0.01) {
      k9LwP2xM(m4WnL7sT); return;
    }

    const gCv = t8VwM4xK();
    if (!gCv) { k9LwP2xM(m4WnL7sT); return; }
    const cRc = gCv.getBoundingClientRect();
    const scX = cRc.width / gCv.width, scY = cRc.height / gCv.height;
    const zm = k3WnL8vR();
    const tX = cRc.left + x5QzL2wT.cx * scX, tY = cRc.top + x5QzL2wT.cy * scY;
    const tRad = Math.max(6, (x5QzL2wT.worldR * zm) * ((scX + scY) * 0.5) * x5QzL2wT.pop);
    const a = x5QzL2wT.alpha;
    const pulse = 0.5 + 0.5 * Math.sin(nw * 0.006);

    const grad = w4TvN8wL.createLinearGradient(midX, midY, tX, tY);
    grad.addColorStop(0, `rgba(0, 165, 255, ${0.14 * a})`);
    grad.addColorStop(0.6, `rgba(0, 215, 255, ${0.58 * a})`);
    grad.addColorStop(1, `rgba(130, 242, 255, ${0.95 * a})`);

    o4Drty = true;
    w4TvN8wL.save();
    w4TvN8wL.beginPath();
    w4TvN8wL.moveTo(midX, midY);
    w4TvN8wL.lineTo(tX, tY);
    w4TvN8wL.strokeStyle = grad;
    w4TvN8wL.lineWidth = 2.0 + 0.6 * a;
    w4TvN8wL.shadowColor = 'rgba(0, 215, 255, 0.85)';
    w4TvN8wL.shadowBlur = 8 + 4 * pulse;
    w4TvN8wL.stroke();

    w4TvN8wL.beginPath();
    w4TvN8wL.arc(tX, tY, 6.2, 0, Math.PI * 2);
    w4TvN8wL.strokeStyle = `rgba(0, 225, 255, ${0.65 * a})`;
    w4TvN8wL.lineWidth = 1.4;
    w4TvN8wL.stroke();

    w4TvN8wL.beginPath();
    w4TvN8wL.arc(tX, tY, 2.8, 0, Math.PI * 2);
    w4TvN8wL.fillStyle = `rgba(180, 250, 255, ${0.95 * a})`;
    w4TvN8wL.fill();

    w4TvN8wL.beginPath();
    w4TvN8wL.rect(cRc.left, cRc.top, cRc.width, cRc.height);
    w4TvN8wL.clip();

    w4TvN8wL.beginPath();
    w4TvN8wL.arc(tX, tY, tRad, 0, Math.PI * 2);
    w4TvN8wL.strokeStyle = `rgba(0, 200, 255, ${0.28 * a})`;
    w4TvN8wL.lineWidth = 5.0;
    w4TvN8wL.shadowColor = '#00DCFF';
    w4TvN8wL.shadowBlur = 12 + 4 * pulse;
    w4TvN8wL.stroke();

    w4TvN8wL.shadowBlur = 0;
    w4TvN8wL.shadowColor = 'transparent';

    w4TvN8wL.beginPath();
    w4TvN8wL.arc(tX, tY, tRad, 0, Math.PI * 2);
    w4TvN8wL.strokeStyle = `rgba(110, 240, 255, ${0.92 * a})`;
    w4TvN8wL.lineWidth = 1.8;
    w4TvN8wL.stroke();

    const outerR = tRad + Math.max(4, Math.min(12, tRad * 0.055));
    const rot1 = nw * 0.0014;
    const arcSpan = 0.72;
    w4TvN8wL.lineCap = 'round';
    w4TvN8wL.lineWidth = 2.4;
    w4TvN8wL.strokeStyle = `rgba(0, 225, 255, ${(0.72 + 0.2 * pulse) * a})`;
    for (let i = 0; i < 4; i++) {
      const a0 = rot1 + (i * Math.PI) * 0.5 - arcSpan * 0.5;
      w4TvN8wL.beginPath();
      w4TvN8wL.arc(tX, tY, outerR, a0, a0 + arcSpan);
      w4TvN8wL.stroke();
    }

    if (tRad > 18) {
      const innerR = Math.max(6, tRad - Math.max(4, Math.min(10, tRad * 0.05)));
      w4TvN8wL.save();
      w4TvN8wL.translate(tX, tY);
      w4TvN8wL.rotate(-nw * 0.0009);
      w4TvN8wL.setLineDash([6, 8]);
      w4TvN8wL.beginPath();
      w4TvN8wL.arc(0, 0, innerR, 0, Math.PI * 2);
      w4TvN8wL.strokeStyle = `rgba(155, 245, 255, ${0.38 * a})`;
      w4TvN8wL.lineWidth = 1.2;
      w4TvN8wL.stroke();
      w4TvN8wL.restore();
    }

    w4TvN8wL.restore();

    k9LwP2xM(m4WnL7sT);
  }
  k9LwP2xM(m4WnL7sT);

  let v7QzP2wM = null, z3TvL8xP = 0;

  function s7PzR(n) {
    const pl = g2BindTbl.plans[n] || { kc: g2BindTbl.sp > 0 ? g2BindTbl.sp : 32, n: n };
    w5PzR8tM(pl.kc, pl.n);
  }

  let b9TxK4mP = false;
  const c6RmP3xW = new Set();
  let q9EnvOk = 0;

  function q8WnM4tL(c) {
    if (!q9EnvOk) return;
    if (!c) return;
    if (m9TvL2sP.keyRevLock === m9TvL2sP.keyRevUnlock && c === m9TvL2sP.keyRevLock) { d4TxN8wL(); return; }
    if (c === m9TvL2sP.keyRevLock) {
      if (f5TxL9wK || f8WnK3xL.locked) q2WnS7xM(true);
      g9PxL3vT();
      return;
    }
    if (c === m9TvL2sP.keyRevUnlock) { q2WnS7xM(true); return; }
    if (c === m9TvL2sP.keyAuto) {
      if (b9TxK4mP || k4MbBusy) return;
      b9TxK4mP = true;
      k4MbFastFeed(m9TvL2sP.autoDelay, () => { b9TxK4mP = false; });
      return;
    }
    if (Array.isArray(m9TvL2sP.extraFastFeeds)) {
      for (let i = 0; i < m9TvL2sP.extraFastFeeds.length; i++) {
        const ff = m9TvL2sP.extraFastFeeds[i];
        if (ff && ff.key === c) {
          if (c6RmP3xW.has(ff) || k4MbBusy) return;
          c6RmP3xW.add(ff);
          k4MbFastFeed(ff.delay, () => { c6RmP3xW.delete(ff); });
          return;
        }
      }
    }
    const rB = [2, 4, 8, 16, 32, 64, 128, 256];
    for (let i = 1; i <= 8; i++) {
      if (m9TvL2sP['keyRevSplit' + i] === c) {
        m9TvL2sP.revSplits = rB[i - 1];
        k6RebuildPlans();
        x3QnK8wR();
        r8QnM4tL();
        return;
      }
    }
    const tK = ['keyT2', 'keyT4', 'keyT8', 'keyT16', 'keyT32', 'keyT64', 'keyT128', 'keyT256'];
    for (let i = 0; i < tK.length; i++) {
      if (m9TvL2sP[tK[i]] === c) {
        if (!h4HasPeerTab() && m4IsMbOn()) {
          k4MbTrick(i + 1);
          return;
        }
        q5RzL9wK.postMessage({
          type: 'EXECUTE_BACKGROUND_SPLIT_STEP',
          senderId: v8WpM2tL
        });
        s7PzR(i + 1);
        n7KwQ2vL(m9TvL2sP.soloDelay, () => {
          q5RzL9wK.postMessage({
            type: 'EXECUTE_BACKGROUND_SPLIT_STEP',
            senderId: v8WpM2tL
          });
        });
        return;
      }
    }
  }

  function d5TxL2wV(c) {
    if (!c) return false;
    if (Array.isArray(m9TvL2sP.extraFastFeeds) && m9TvL2sP.extraFastFeeds.some(f => f && f.key === c)) return true;
    return c === m9TvL2sP.keyAuto ||
      c === m9TvL2sP.keyT2 || c === m9TvL2sP.keyT4 || c === m9TvL2sP.keyT8 || c === m9TvL2sP.keyT16 ||
      c === m9TvL2sP.keyT32 || c === m9TvL2sP.keyT64 || c === m9TvL2sP.keyT128 || c === m9TvL2sP.keyT256 ||
      c === m9TvL2sP.keyRevLock || c === m9TvL2sP.keyRevUnlock ||
      c === m9TvL2sP.keyRevSplit1 || c === m9TvL2sP.keyRevSplit2 || c === m9TvL2sP.keyRevSplit3 ||
      c === m9TvL2sP.keyRevSplit4 || c === m9TvL2sP.keyRevSplit5 || c === m9TvL2sP.keyRevSplit6 ||
      c === m9TvL2sP.keyRevSplit7 || c === m9TvL2sP.keyRevSplit8;
  }

  function qM7wK2vP(el) {
    const vpW = document.documentElement.clientWidth || window.innerWidth;
    const vpH = document.documentElement.clientHeight || window.innerHeight;
    const r = el.getBoundingClientRect();
    const tT = r.top <= 6, tB = r.bottom >= vpH - 6;
    const tL = r.left <= 6, tR = el.style.right === '0px' || r.right >= vpW - 6;
    el.style.borderTop = tT ? 'none' : '1px solid var(--macro-border, #333)';
    el.style.borderBottom = tB ? 'none' : '1px solid var(--macro-border, #333)';
    el.style.borderLeft = tL ? 'none' : '1px solid var(--macro-border, #333)';
    el.style.borderRight = tR ? 'none' : '1px solid var(--macro-border, #333)';
    el.style.borderRadius = `${(tT || tL) ? '0' : '8px'} ${(tT || tR) ? '0' : '8px'} ${(tB || tR) ? '0' : '8px'} ${(tB || tL) ? '0' : '8px'}`;
  }

  let k4RnP9wT = 1;
  let b7QmX2vN = '';
  let s2NpK7wL = null;
  let g3VxL8mQ = ['255,255,255', '225,225,225', '185,185,185'];

  function q6VxM4tN(el, wArg, hArg) {
    if (!el) return;
    let sc = 1;
    if (m9TvL2sP.syncScale) {
      const w = wArg || el.offsetWidth || m9TvL2sP.winWidth || 320;
      const h = hArg || el.offsetHeight || m9TvL2sP.winHeight || 560;
      const rW = w / 320;
      const rH = h / 560;
      const raw = Math.min(w / 298, Math.sqrt(rW * rH));
      sc = Math.max(0.65, Math.min(3.0, Math.round(raw * 200) / 200));
    }
    k4RnP9wT = sc;
    const fz = m9TvL2sP.syncScale ? (12 * sc).toFixed(2) + 'px' : '';
    if (b7QmX2vN !== fz) {
      b7QmX2vN = fz;
      el.style.fontSize = fz;
    }
  }

  function f4KzP9wL(el) {
    if (!el) return;
    const vpW = document.documentElement.clientWidth || window.innerWidth;
    const vpH = document.documentElement.clientHeight || window.innerHeight;
    const tW = m9TvL2sP.winWidth || el.offsetWidth || 320;
    const tH = m9TvL2sP.winHeight || el.offsetHeight || 560;
    const mnW = Math.min(280, vpW), mnH = Math.min(320, vpH);
    const w = Math.max(mnW, Math.min(vpW, tW));
    const h = Math.max(mnH, Math.min(vpH, tH));
    el.style.minWidth = mnW + 'px';
    el.style.minHeight = mnH + 'px';
    el.style.width = w + 'px';
    el.style.height = h + 'px';
    q6VxM4tN(el, w, h);
    const mxL = Math.max(0, vpW - w), mxT = Math.max(0, vpH - h);
    const r = el.getBoundingClientRect();
    const curL = Number.parseFloat(el.style.left), curT = Number.parseFloat(el.style.top);
    const baseL = el.style.right === '0px' ? mxL : (Number.isFinite(curL) ? curL : r.left);
    const nL = Math.max(0, Math.min(mxL, baseL));
    const nT = Math.max(0, Math.min(mxT, Number.isFinite(curT) ? curT : r.top));
    if (nL >= mxL - 10) {
      el.style.left = 'auto';
      el.style.right = '0px';
      if (vpW >= 280) m9TvL2sP.winX = mxL;
    } else {
      el.style.left = nL + 'px';
      el.style.right = 'auto';
      if (vpW >= 280) m9TvL2sP.winX = nL;
    }
    el.style.top = nT + 'px';
    el.style.bottom = 'auto';
    if (vpH >= 320) m9TvL2sP.winY = nT;
    qM7wK2vP(el);
    if (vpW >= 280 && vpH >= 320) x3QnK8wR();
  }

  function h2QzP8sT() {
    const wn = document.getElementById('macro-window');
    if (wn) {
      wn.classList.toggle('open');
      if (wn.classList.contains('open')) f4KzP9wL(wn);
      else {
        if (g4PopClsFn) g4PopClsFn();
        if (document.activeElement && wn.contains(document.activeElement) && document.activeElement.blur) document.activeElement.blur();
        const cv = t8VwM4xK();
        if (cv && cv.focus) cv.focus();
      }
    }
  }

  function m6BwL4sK(e) {
    const cd = e.code || e.key || '';
    if (!cd) return false;
    if (e.ctrlKey && !cd.startsWith('Control')) return false;
    if (e.altKey && !cd.startsWith('Alt')) return false;
    if (e.metaKey && !cd.startsWith('Meta')) return false;
    return true;
  }

  window.addEventListener('mousemove', e => {
    if (!v9TxtOn() || w3DragSel) return;
    const nw = performance.now();
    if (nw - w3HoverMs < 24 && Math.abs(e.clientX - w3HoverX) < 3 && Math.abs(e.clientY - w3HoverY) < 3) return;
    w3HoverMs = nw;
    w3HoverX = e.clientX;
    w3HoverY = e.clientY;
    w3HoverTick(e.clientX, e.clientY);
  }, true);

  window.addEventListener('selectstart', e => {
    if (!v9TxtOn() || w3IsUi(e.target)) return;
    b4AllowDef.add(e);
    e.stopImmediatePropagation();
  }, true);

  window.addEventListener('copy', e => {
    if (!v9TxtOn() || w3IsUi(e.target) || w3IsEd(e.target)) return;
    const s = window.getSelection();
    if (s && !s.isCollapsed) {
      b4AllowDef.add(e);
      e.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('keydown', e => {
    if (!v9TxtOn() || !e.isTrusted || w3IsUi(e.target) || w3IsEd(e.target)) return;
    if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.code === 'KeyC' || (e.key || '').toLowerCase() === 'c')) {
      const s = window.getSelection();
      if (s && !s.isCollapsed) e.stopImmediatePropagation();
    }
  }, true);

  const w3PtrDown = e => {
    if (!v9TxtOn() || w3Fwded.has(e) || !e.isTrusted || w3IsUi(e.target)) return;
    if (e.button === 2) {
      if (w3RmbTm) { clearTimeout(w3RmbTm); w3RmbTm = 0; }
      const hit = w3HitSel(e.clientX, e.clientY, e.target);
      w3RmbHit = hit;
      w3RmbTs = performance.now();
      if (hit) {
        w3SetBypass(false);
        b4AllowDef.add(e);
        e.stopImmediatePropagation();
        return;
      }
      const tg = e.target && e.target.nodeType === 1 ? e.target : (e.target && e.target.parentElement);
      if (tg && tg.classList && (tg.classList.contains('macro-cvs-txt') || tg.classList.contains('macro-pe-txt'))) {
        w3SetBypass(true);
        e.stopImmediatePropagation();
        w3FwdRmb(e);
      }
      return;
    }
    if (e.button === 0) {
      w3SetBypass(false);
      const tg = e.target && e.target.nodeType === 1 ? e.target : (e.target && e.target.parentElement);
      const isCvs = Boolean(tg && tg.classList && tg.classList.contains('macro-cvs-txt'));
      const isCtrl = Boolean(tg && tg.closest && tg.closest('button, a, select, input, textarea, [role="button"], .macro-resizer'));
      if (isCvs) {
        if (e.type === 'mousedown') {
          const act = document.activeElement;
          if (act && w3IsEd(act)) act.blur();
        }
        w3DragSel = true;
        w3DragCvs = true;
        b4AllowDef.add(e);
        e.stopImmediatePropagation();
        return;
      }
      if (!isCtrl && w3HitText(e.clientX, e.clientY, e.target)) {
        w3DragSel = true;
        w3DragCvs = false;
        b4AllowDef.add(e);
        if (w3PeHovered && w3PeHovered.parentElement) {
          const pr = w3PeHovered.parentElement;
          for (let i = 0; i < w3PeList.length; i++) {
            const p = w3PeList[i];
            if (p.parentElement === pr && !p.classList.contains('macro-pe-txt')) {
              p.classList.add('macro-pe-txt');
              w3PeDragGrp.push(p);
            }
          }
        }
        return;
      }
      if (e.type === 'mousedown' && !isCtrl && !e.shiftKey) {
        const s = window.getSelection();
        if (s && !s.isCollapsed) s.removeAllRanges();
        w3ClearPe();
      }
    }
  };

  const w3PtrUp = e => {
    if (!v9TxtOn() || w3Fwded.has(e) || !e.isTrusted || w3IsUi(e.target)) return;
    if (e.button === 2) {
      if ((w3RmbHit && performance.now() - w3RmbTs < 1500) || w3HitSel(e.clientX, e.clientY, e.target)) {
        b4AllowDef.add(e);
        e.stopImmediatePropagation();
      } else {
        if (w3BypTm) clearTimeout(w3BypTm);
        w3BypTm = setTimeout(() => w3SetBypass(false), 120);
      }
      return;
    }
    if (e.button === 0 && w3DragSel) {
      const tg = e.target && e.target.nodeType === 1 ? e.target : (e.target && e.target.parentElement);
      const isCvs = Boolean(tg && tg.classList && tg.classList.contains('macro-cvs-txt'));
      if (w3DragCvs || isCvs) e.stopImmediatePropagation();
      if (e.type === 'mouseup') {
        setTimeout(() => {
          w3DragSel = false;
          w3DragCvs = false;
          for (let i = 0; i < w3PeDragGrp.length; i++) w3PeDragGrp[i].classList.remove('macro-pe-txt');
          w3PeDragGrp = [];
        }, 25);
      }
    }
  };

  window.addEventListener('pointerdown', w3PtrDown, true);
  window.addEventListener('mousedown', w3PtrDown, true);
  window.addEventListener('pointerup', w3PtrUp, true);
  window.addEventListener('mouseup', w3PtrUp, true);

  window.addEventListener('click', e => {
    if (!v9TxtOn() || !e.isTrusted || w3IsUi(e.target)) return;
    if (w3DragSel) {
      const tg = e.target && e.target.nodeType === 1 ? e.target : (e.target && e.target.parentElement);
      const s = window.getSelection();
      if (w3DragCvs || (tg && tg.classList && tg.classList.contains('macro-cvs-txt')) || (s && !s.isCollapsed)) {
        e.stopImmediatePropagation();
      }
      w3DragSel = false;
      w3DragCvs = false;
    }
  }, true);

  window.addEventListener('contextmenu', e => {
    if (!v9TxtOn() || w3IsUi(e.target)) return;
    const hit = (w3RmbHit && performance.now() - w3RmbTs < 1500) || w3HitSel(e.clientX, e.clientY, e.target);
    if (w3RmbTm) clearTimeout(w3RmbTm);
    w3RmbTm = setTimeout(() => { w3RmbHit = false; w3RmbTm = 0; }, 120);
    if (hit) {
      w3SetBypass(false);
      b4AllowDef.add(e);
      e.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('contextmenu', e => {
    if (!v9TxtOn() || w3IsUi(e.target)) return;
    if (w3BypTm) clearTimeout(w3BypTm);
    w3BypTm = setTimeout(() => w3SetBypass(false), 0);
    if (!w3HitSel(e.clientX, e.clientY, e.target)) e.preventDefault();
  }, false);

  window.addEventListener('blur', () => {
    w3SetBypass(false);
    w3DragSel = false;
    w3DragCvs = false;
    w3RmbHit = false;
    w3ClearPe();
  });

  document.addEventListener('keydown', e => {
    if (v7QzP2wM) return;
    if (hSP2xK9m.has(e)) return;
    p2LxQ8vM();
    const tg = e.target, tn = tg && tg.tagName ? tg.tagName.toLowerCase() : '';
    if ((tn === 'input' && tg.type !== 'checkbox') || tn === 'textarea' || (tg && tg.isContentEditable)) return;
    const cd = e.code || e.key;
    if (!cd || !m6BwL4sK(e)) return;
    if (m9TvL2sP.keyMenu && cd === m9TvL2sP.keyMenu) {
      e.preventDefault();
      if (!e.repeat) h2QzP8sT();
      return;
    }
    if (d5TxL2wV(cd)) {
      e.preventDefault();
      if (e.repeat) return;
      q8WnM4tL(cd);
    }
  }, true);

  window.addEventListener('mousedown', e => {
    if (!e.isTrusted || v7QzP2wM) return;
    const tg = e.target;
    const tn = tg && tg.tagName ? tg.tagName.toLowerCase() : '';
    const hasClosest = tg && typeof tg.closest === 'function';
    const act = document.activeElement;
    const isInputFocused = act && ((act.tagName === 'INPUT' && act.type !== 'checkbox') || act.tagName === 'TEXTAREA' || act.isContentEditable);
    const isClickOnScriptOrChat = (tn === 'input' && tg.type !== 'checkbox') || tn === 'textarea' || (tg && tg.isContentEditable) || (hasClosest && Boolean(tg.closest('#macro-window, #macro-toggle-pill, #chat-container, #chat-panel, .chat-panel')));

    const isGameUiClick = hasClosest && Boolean(tg.closest('button, a, select, #main-panel, #login-panel, #party-panel'));
    const mCd = 'Mouse' + e.button;
    if (mCd === m9TvL2sP.keyMenu) {
      const onBindCtrl = hasClosest && Boolean(tg.closest('.macro-bind-btn, .macro-menu-bind-btn, .macro-rst-btn, .macro-menu-rst-btn, input, textarea'));
      if (!onBindCtrl && !(isGameUiClick && e.button === 0) && (!isClickOnScriptOrChat || e.button >= 3)) {
        e.preventDefault();
        e.stopPropagation();
        h2QzP8sT();
        return;
      }
    }

    if (isInputFocused) {
      if (!isClickOnScriptOrChat) {
        act.blur();
        const cv = t8VwM4xK();
        if (cv && cv.focus) cv.focus();
        hCl2xK9m();
      }
      return;
    }
    if (isClickOnScriptOrChat) return;

    if (isGameUiClick && e.button === 0) return;

    if (mCd === m9TvL2sP.keyHoldSpam) {
      e.preventDefault();
      e.stopPropagation();
      if (hSt2xK9m) {
        hCl2xK9m();
        return;
      }
      hGo2xK9m({ kind: 'mouse', button: e.button });
      return;
    }
    if (d5TxL2wV(mCd)) {
      e.preventDefault();
      e.stopPropagation();
      q8WnM4tL(mCd);
    }
  }, true);

  window.addEventListener('mouseup', e => {
    const mCd = 'Mouse' + e.button;
    if (e.button >= 3 && (v7QzP2wM || Date.now() < z3TvL8xP || mCd === m9TvL2sP.keyMenu || mCd === m9TvL2sP.keyHoldSpam || d5TxL2wV(mCd))) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!e.isTrusted) return;
    if (hSt2xK9m && hSt2xK9m.kind === 'mouse' && e.button === hSt2xK9m.button) {
      hCl2xK9m();
    }
  }, true);

  window.addEventListener('auxclick', e => {
    const mCd = 'Mouse' + e.button;
    if (v7QzP2wM || Date.now() < z3TvL8xP || mCd === m9TvL2sP.keyMenu || mCd === m9TvL2sP.keyHoldSpam || d5TxL2wV(mCd)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);

  const hSP2xK9m = new WeakSet();
  let hSt2xK9m = null, hTm2xK9m = null;

  function hCl2xK9m() {
    if (hTm2xK9m !== null) { clearInterval(hTm2xK9m); hTm2xK9m = null; }
    if (hSt2xK9m) {
      const p = hSt2xK9m;
      hSt2xK9m = null;
      hEv2xK9m(p, p.kind === 'key' ? 'keyup' : 'mouseup');
    }
  }

  function hEv2xK9m(st, type) {
    const cv = t8VwM4xK() || window;
    const tg = cv !== window ? cv : window;
    const jq = window.$;
    if (st.kind === 'key') {
      let kc = st.keyCode;
      if (!kc && st.code) {
        if (st.code.startsWith('Key')) kc = st.code.charCodeAt(3);
        else if (st.code.startsWith('Digit')) kc = 48 + parseInt(st.code.slice(5), 10);
      }
      if (!kc) kc = st.key ? st.key.toUpperCase().charCodeAt(0) : 87;

      if (jq) {
        const jEv = jq.Event(type, { keyCode: kc, which: kc, code: st.code, key: st.key });
        jq(tg).trigger(jEv);
      } else {
        const ev = new KeyboardEvent(type, {
          key: st.key,
          code: st.code,
          location: st.location || 0,
          bubbles: true,
          cancelable: true
        });
        Object.defineProperty(ev, 'keyCode', { value: kc, writable: false });
        Object.defineProperty(ev, 'which', { value: kc, writable: false });
        hSP2xK9m.add(ev);
        tg.dispatchEvent(ev);
      }
    } else {
      const btn = st.button !== undefined ? st.button : 0;
      const wh = btn + 1;
      const btns = type === 'mouseup' ? 0 : ([1, 4, 2, 8, 16][btn] || 1);
      const mx = t2QnL9wP, my = b8VmK3xT;
      if (jq) {
        const jEv = jq.Event(type, {
          button: btn,
          which: wh,
          buttons: btns,
          clientX: mx,
          clientY: my,
          pageX: mx + window.scrollX,
          pageY: my + window.scrollY
        });
        jq(tg).trigger(jEv);
      } else {
        const mEv = new MouseEvent(type, {
          button: btn,
          buttons: btns,
          clientX: mx,
          clientY: my,
          bubbles: true,
          cancelable: true
        });
        Object.defineProperty(mEv, 'which', { value: wh, writable: false });
        hSP2xK9m.add(mEv);
        tg.dispatchEvent(mEv);
      }
    }
  }

  function hGo2xK9m(st) {
    if (hSt2xK9m || v7QzP2wM || !m9TvL2sP.keyHoldSpam) return;
    hSt2xK9m = st;
    hEv2xK9m(st, st.kind === 'key' ? 'keydown' : 'mousedown');
    hTm2xK9m = setInterval(() => {
      if (hSt2xK9m === st && !k4FeedLock) {
        hEv2xK9m(st, st.kind === 'key' ? 'keydown' : 'mousedown');
      }
    }, 60);
  }

  window.addEventListener('keydown', e => {
    if (!e.isTrusted || v7QzP2wM) return;
    const cd = e.code || e.key;
    if (!cd || cd !== m9TvL2sP.keyHoldSpam || !m6BwL4sK(e)) return;
    const tg = e.target, tn = tg && tg.tagName ? tg.tagName.toLowerCase() : '';
    if ((tn === 'input' && tg.type !== 'checkbox') || tn === 'textarea' || (tg && tg.isContentEditable)) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.repeat) return;
    hGo2xK9m({
      kind: 'key', key: e.key, code: cd, location: e.location,
      keyCode: e.keyCode
    });
  }, true);

  window.addEventListener('keyup', e => {
    if (!e.isTrusted) return;
    const cd = e.code || e.key;
    if (hSt2xK9m && hSt2xK9m.kind === 'key' && cd === hSt2xK9m.code) {
      hCl2xK9m();
    }
  }, true);

  window.addEventListener('contextmenu', e => {
    if (hSP2xK9m.has(e)) return;
    const tg = e.target, tn = tg && tg.tagName ? tg.tagName.toLowerCase() : '';
    const isEd = (tn === 'input' && tg.type !== 'checkbox') || tn === 'textarea' || (tg && tg.isContentEditable);
    if (!isEd && (m9TvL2sP.keyHoldSpam === 'Mouse2' || m9TvL2sP.keyMenu === 'Mouse2' || d5TxL2wV('Mouse2'))) e.preventDefault();
    if (hSt2xK9m && hSt2xK9m.kind === 'mouse' && hSt2xK9m.button === 2) hCl2xK9m();
  }, true);

  window.addEventListener('focusin', e => {
    const tg = e.target, tn = tg && tg.tagName ? tg.tagName.toLowerCase() : '';
    if ((tn === 'input' && tg.type !== 'checkbox') || tn === 'textarea' || (tg && tg.isContentEditable)) hCl2xK9m();
  });

  window.addEventListener('click', e => {
    if (Date.now() < z3TvL8xP) {
      e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
    }
  }, true);

  function p7TvM3wL(c) {
    if (!c) return k3Tr('none');
    if (c === 'Mouse0') return 'LMB';
    if (c === 'Mouse1') return 'MMB';
    if (c === 'Mouse2') return 'RMB';
    if (c.startsWith('Mouse')) return 'M' + c.replace('Mouse', '');
    return c.replace(/^Key/, '').replace(/^Digit/, '').replace(/^Numpad/, 'Num ');
  }

  const y4WpS9vT = [
    { id: 'keyT2', label: 'Trick 2 (1x)' }, { id: 'keyT4', label: 'Trick 4 (2x)' },
    { id: 'keyT8', label: 'Trick 8 (3x)' }, { id: 'keyT16', label: 'Trick 16 (4x)' },
    { id: 'keyT32', label: 'Trick 32 (5x)' }, { id: 'keyT64', label: 'Trick 64 (6x)' },
    { id: 'keyT128', label: 'Trick 128 (7x)' }, { id: 'keyT256', label: 'Trick 256 (8x)' }
  ];

  const w9QnL2xM = [
    { id: 'keyRevLock', label: 'Lock Target' }, { id: 'keyRevUnlock', label: 'Cancel Lock' }
  ];

  const k5TxM8wL = [
    { id: 'keyRevSplit1', label: 'Select Rev 2 (1x)' }, { id: 'keyRevSplit2', label: 'Select Rev 4 (2x)' },
    { id: 'keyRevSplit3', label: 'Select Rev 8 (3x)' }, { id: 'keyRevSplit4', label: 'Select Rev 16 (4x)' },
    { id: 'keyRevSplit5', label: 'Select Rev 32 (5x)' }, { id: 'keyRevSplit6', label: 'Select Rev 64 (6x)' },
    { id: 'keyRevSplit7', label: 'Select Rev 128 (7x)' }, { id: 'keyRevSplit8', label: 'Select Rev 256 (8x)' }
  ];

  function b2WzL7vP(tk, val) {
    if (!tk) return;
    const f = tk.querySelector('.macro-slider-fill');
    if (f) f.style.width = Math.max(0, Math.min(100, ((val - 50) / 2950) * 100)) + '%';
  }

  function a2LnQ8vM() {
    const act = Boolean(m9TvL2sP.frustumCulling && m9TvL2sP.cullMarginToggle);
    const tr = document.getElementById('macro-track-margin');
    const nw = document.querySelector('#macro-row-margin .macro-num-wrap');
    if (tr) {
      tr.style.opacity = act ? '1' : '0.35';
      tr.style.pointerEvents = act ? 'auto' : 'none';
    }
    if (nw) {
      nw.style.opacity = act ? '1' : '0.35';
      nw.style.pointerEvents = act ? 'auto' : 'none';
    }
  }

  const k9EdMap = new WeakMap();

  function q5IsEdit(el) {
    if (!el || !el.tagName) return false;
    const t = el.tagName.toLowerCase();
    return (t === 'input' && el.type !== 'checkbox') || t === 'textarea';
  }

  function g7SnapObj(el) {
    let s = 0, e = 0, d = 'none';
    try {
      if (typeof el.selectionStart === 'number') {
        s = el.selectionStart;
        e = el.selectionEnd;
        d = el.selectionDirection || 'none';
      }
    } catch (_) {}
    return {
      v: String(el.value || ''),
      s,
      e,
      d,
      t: el.tagName === 'TEXTAREA' ? el.scrollTop : 0
    };
  }

  function g8MkEdSt(el) {
    return {
      stk: [g7SnapObj(el)],
      idx: 0,
      ts: 0,
      kind: '',
      caret: 0,
      busy: false,
      comp: false,
      pre: null
    };
  }

  function m4SyncSel(el, st, brk) {
    if (!st || st.busy || el.value !== st.stk[st.idx].v) return;
    try {
      if (typeof el.selectionStart === 'number') {
        const cur = st.stk[st.idx];
        const ns = el.selectionStart, ne = el.selectionEnd, nd = el.selectionDirection || 'none';
        if (ns !== cur.s || ne !== cur.e || nd !== cur.d) {
          cur.s = ns; cur.e = ne; cur.d = nd;
          if (brk) st.kind = '';
        }
        if (el.tagName === 'TEXTAREA') cur.t = el.scrollTop;
      }
    } catch (_) {}
  }

  function f6PushSnap(el, st, kind) {
    const sn = g7SnapObj(el);
    const cur = st.stk[st.idx];
    if (cur && sn.v === cur.v) {
      cur.s = sn.s; cur.e = sn.e; cur.d = sn.d; cur.t = sn.t;
      return;
    }
    const nw = performance.now();
    const canGrp = (kind === 'ins' || kind === 'del' || kind === 'delf' || kind === 'step') &&
      st.idx > 0 &&
      st.idx === st.stk.length - 1 &&
      kind === st.kind &&
      nw - st.ts < 450 &&
      (kind === 'step' || (st.pre && st.pre.s === st.pre.e && st.pre.s === st.caret));

    if (canGrp) {
      st.stk[st.idx] = sn;
    } else {
      if (st.idx < st.stk.length - 1) st.stk.length = st.idx + 1;
      st.stk.push(sn);
      if (st.stk.length > 150) st.stk.shift();
      st.idx = st.stk.length - 1;
    }
    st.ts = nw;
    st.kind = kind;
    st.caret = sn.s;
  }

  function x8ApplySnap(el, st, sn) {
    st.busy = true;
    try {
      el.value = sn.v;
      if (typeof el.setSelectionRange === 'function') {
        const len = sn.v.length;
        const s = Math.max(0, Math.min(len, sn.s));
        const e = Math.max(0, Math.min(len, sn.e));
        el.setSelectionRange(s, e, sn.d || 'none');
      }
      if (el.tagName === 'TEXTAREA' && typeof sn.t === 'number') el.scrollTop = sn.t;
      st.kind = '';
      st.caret = sn.s;
      el.dispatchEvent(new Event('input', { bubbles: true }));
    } finally {
      st.busy = false;
    }
  }

  function h3DoUndo(el) {
    const st = k9EdMap.get(el);
    if (!st || st.idx <= 0) return false;
    st.idx--;
    x8ApplySnap(el, st, st.stk[st.idx]);
    return true;
  }

  function h3DoRedo(el) {
    const st = k9EdMap.get(el);
    if (!st || st.idx >= st.stk.length - 1) return false;
    st.idx++;
    x8ApplySnap(el, st, st.stk[st.idx]);
    return true;
  }

  function q2SetVal(el, val, commit) {
    if (!el) return;
    const sVal = String(val);
    const st = k9EdMap.get(el);
    if (!st) {
      if (el.value !== sVal) el.value = sVal;
      return;
    }
    if (el.value !== sVal) {
      st.busy = true;
      el.value = sVal;
      st.busy = false;
    }
    if (commit) f6PushSnap(el, st, 'ext');
  }

  function q6CommitVal(el, kind = 'ext') {
    if (!el) return;
    const st = k9EdMap.get(el);
    if (st) f6PushSnap(el, st, kind);
  }

  function j5KeyCmd(e) {
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return '';
    const k = (e.key || '').toLowerCase();
    const c = e.code || '';
    const lat = /^[a-z]$/.test(k);
    if (e.shiftKey) {
      if ((lat && k === 'z') || (!lat && c === 'KeyZ')) return 'redo';
      return '';
    }
    if ((lat && k === 'z') || (!lat && c === 'KeyZ')) return 'undo';
    if ((lat && k === 'y') || (!lat && c === 'KeyY')) return 'redo';
    if ((lat && k === 'a') || (!lat && c === 'KeyA')) return 'all';
    return '';
  }

  function b3EdBind(el) {
    if (!el || k9EdMap.has(el)) return;
    k9EdMap.set(el, g8MkEdSt(el));

    el.addEventListener('focus', () => m4SyncSel(el, k9EdMap.get(el), false));
    el.addEventListener('mousedown', () => {
      const st = k9EdMap.get(el);
      if (st) st.kind = '';
    });
    el.addEventListener('mouseup', () => m4SyncSel(el, k9EdMap.get(el), true));
    el.addEventListener('select', () => m4SyncSel(el, k9EdMap.get(el), true));
    el.addEventListener('compositionstart', () => {
      const st = k9EdMap.get(el);
      if (!st) return;
      st.comp = true;
      m4SyncSel(el, st, false);
    });
    el.addEventListener('compositionend', () => {
      const st = k9EdMap.get(el);
      if (!st) return;
      st.comp = false;
      if (!st.busy) f6PushSnap(el, st, 'other');
    });
    el.addEventListener('beforeinput', e => {
      const st = k9EdMap.get(el);
      if (!st || st.busy) return;
      if (e.inputType === 'historyUndo') {
        e.preventDefault();
        h3DoUndo(el);
        return;
      }
      if (e.inputType === 'historyRedo') {
        e.preventDefault();
        h3DoRedo(el);
        return;
      }
      m4SyncSel(el, st, false);
      st.pre = g7SnapObj(el);
    });
    el.addEventListener('input', e => {
      const st = k9EdMap.get(el);
      if (!st || st.busy || st.comp || e.isComposing) return;
      const it = e.inputType || '';
      let k = 'other';
      if (it === 'insertText' && (!e.data || (e.data.length === 1 && !/\s/.test(e.data)))) k = 'ins';
      else if (it === 'deleteContentBackward') k = 'del';
      else if (it === 'deleteContentForward') k = 'delf';
      f6PushSnap(el, st, k);
      st.pre = null;
    });
    el.addEventListener('keyup', e => {
      if (e.key && (e.key.startsWith('Arrow') || e.key === 'Home' || e.key === 'End')) m4SyncSel(el, k9EdMap.get(el), true);
    });
    el.addEventListener('keydown', e => {
      const st = k9EdMap.get(el);
      if (!st) return;
      const cmd = j5KeyCmd(e);
      if (cmd === 'undo') {
        e.preventDefault();
        e.stopPropagation();
        h3DoUndo(el);
        return;
      }
      if (cmd === 'redo') {
        e.preventDefault();
        e.stopPropagation();
        h3DoRedo(el);
        return;
      }
      if (cmd === 'all') {
        e.preventDefault();
        e.stopPropagation();
        el.select();
        m4SyncSel(el, st, true);
        return;
      }
      if (e.key === 'Escape') {
        el.blur();
        return;
      }
      if (el.tagName !== 'TEXTAREA' && e.key === 'Enter') {
        el.blur();
        return;
      }
      if (el.classList.contains('macro-num-input') && (e.key === 'ArrowUp' || e.key === 'ArrowDown') && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        const mn = parseInt(el.dataset.min || '50', 10);
        const mx = parseInt(el.dataset.max || '3000', 10);
        const sp = parseInt(el.dataset.step || '10', 10);
        const cur = parseInt(el.value, 10);
        const base = isNaN(cur) ? mn : cur;
        const nxt = Math.max(mn, Math.min(mx, base + (e.key === 'ArrowUp' ? sp : -sp)));
        el.value = String(nxt);
        try { el.setSelectionRange(el.value.length, el.value.length); } catch (_) {}
        f6PushSnap(el, st, 'step');
        st.busy = true;
        try { el.dispatchEvent(new Event('input', { bubbles: true })); } finally { st.busy = false; }
      }
    });
  }

  let w9LpT5vN = null;
  let g4PopClsFn = null;

  function r8QnM4tL() {
    ['solo', 'auto'].forEach(k => {
      const prop = k === 'solo' ? 'soloDelay' : 'autoDelay';
      const trk = document.getElementById('macro-track-' + k), inp = document.getElementById('macro-num-' + k);
      if (trk) b2WzL7vP(trk, m9TvL2sP[prop]);
      if (inp && document.activeElement !== inp) q2SetVal(inp, m9TvL2sP[prop], true);
    });

    if (Array.isArray(m9TvL2sP.extraFastFeeds)) {
      m9TvL2sP.extraFastFeeds.forEach((ff, idx) => {
        const trk = document.getElementById('macro-track-extraFF_' + idx);
        const inp = document.getElementById('macro-num-extraFF_' + idx);
        const btn = document.getElementById('macro-btn-extraFF_' + idx);
        if (trk) b2WzL7vP(trk, ff.delay);
        if (inp && document.activeElement !== inp) q2SetVal(inp, ff.delay, true);
        if (btn) btn.textContent = p7TvM3wL(ff.key);
      });
    }

    const aBtn = document.getElementById('macro-btn-keyAuto');
    if (aBtn) aBtn.textContent = p7TvM3wL(m9TvL2sP.keyAuto);
    const mBtn = document.getElementById('macro-btn-keyMenu');
    if (mBtn) mBtn.textContent = k3Tr('menuBind') + ': ' + p7TvM3wL(m9TvL2sP.keyMenu);
    const hBtn = document.getElementById('macro-btn-keyHoldSpam');
    if (hBtn) hBtn.textContent = p7TvM3wL(m9TvL2sP.keyHoldSpam);

    [y4WpS9vT, w9QnL2xM, k5TxM8wL].forEach(arr => {
      arr.forEach(r => {
        const b = document.getElementById('macro-btn-' + r.id);
        if (b) b.textContent = p7TvM3wL(m9TvL2sP[r.id]);
      });
    });

    document.querySelectorAll('.macro-split-chip').forEach(ch => {
      ch.classList.toggle('active', parseInt(ch.getAttribute('data-split'), 10) === m9TvL2sP.revSplits);
    });

    const tSk = document.getElementById('macro-toggle-skin');
    const tNm = document.getElementById('macro-toggle-name');
    const tCs = document.getElementById('macro-toggle-custom');
    const tAr = document.getElementById('macro-custom-nicks');
    const tMap = document.getElementById('macro-toggle-map-bg');
    const tFix = document.getElementById('macro-toggle-fixed-bg');
    const rMap = document.getElementById('macro-row-map-bg');

    if (tSk) tSk.checked = Boolean(m9TvL2sP.skinStealer);
    if (tNm) tNm.checked = Boolean(m9TvL2sP.nameStealer);
    if (tCs) tCs.checked = Boolean(m9TvL2sP.customSwitcher);
    if (tMap) tMap.checked = Boolean(m9TvL2sP.mapBgEnabled);
    if (tFix) tFix.checked = Boolean(m9TvL2sP.fixedBackgroundEnabled);
    const isFixed = Boolean(m9TvL2sP.fixedBackgroundEnabled);
    if (rMap) rMap.classList.toggle('macro-row-disabled', isFixed);
    if (tAr && document.activeElement !== tAr) q2SetVal(tAr, m9TvL2sP.customNicks || '', true);

    const tCl = document.getElementById('macro-toggle-culling');
    const tFl = document.getElementById('macro-toggle-filters');
    const tMg = document.getElementById('macro-toggle-margin');
    const mTrk = document.getElementById('macro-track-margin');
    const mInp = document.getElementById('macro-num-margin');
    const margin = Math.max(30, Math.min(500, Number(m9TvL2sP.cullMargin) || 120));

    if (tCl) tCl.checked = Boolean(m9TvL2sP.frustumCulling);
    if (tFl) tFl.checked = Boolean(m9TvL2sP.stripFilters);
    if (tMg) tMg.checked = Boolean(m9TvL2sP.cullMarginToggle);
    if (mTrk) {
      const f = mTrk.querySelector('.macro-slider-fill');
      if (f) f.style.width = ((margin - 30) / 470) * 100 + '%';
    }
    if (mInp && document.activeElement !== mInp) q2SetVal(mInp, margin, true);
    const tPx = document.getElementById('macro-toggle-plexus');
    const tSc = document.getElementById('macro-toggle-sync-scale');
    if (tPx) tPx.checked = Boolean(m9TvL2sP.plexusEnabled);
    if (tSc) tSc.checked = Boolean(m9TvL2sP.syncScale);
    const tSt = document.getElementById('macro-toggle-seltxt');
    if (tSt) tSt.checked = Boolean(m9TvL2sP.selectableText);
    k9SyncTxtMode();
    if (w9LpT5vN) w9LpT5vN();
    a2LnQ8vM();
    k6RebuildPlans();
  }

  function m3TvL9xW(id) {
    hCl2xK9m();
    v7QzP2wM = id;
    const btn = document.getElementById('macro-btn-' + id);
    if (btn) { btn.classList.add('recording'); btn.textContent = '...'; btn.blur(); }
    let fin = false;

    function cl(cd) {
      if (fin) return;
      fin = true;
      window.removeEventListener('keydown', onK, true);
      window.removeEventListener('mousedown', onM, true);
      window.removeEventListener('contextmenu', onC, true);
      window.removeEventListener('blur', onB, true);
      z3TvL8xP = Date.now() + 350;
      if (cd !== undefined) {
        if (v7QzP2wM.startsWith('extraFF_')) {
          const idx = parseInt(v7QzP2wM.slice(8), 10);
          if (m9TvL2sP.extraFastFeeds[idx]) m9TvL2sP.extraFastFeeds[idx].key = cd;
        } else {
          m9TvL2sP[v7QzP2wM] = cd;
        }
        x3QnK8wR();
      }
      v7QzP2wM = null;
      document.querySelectorAll('.macro-bind-btn, .macro-menu-bind-btn').forEach(b => b.classList.remove('recording'));
      r8QnM4tL();
    }

    function onK(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      cl(e.code || e.key || undefined);
    }
    function onM(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
      const onMu = () => { z3TvL8xP = Date.now() + 120; };
      window.addEventListener('mouseup', onMu, { once: true, capture: true });
      setTimeout(() => window.removeEventListener('mouseup', onMu, true), 5000);
      cl('Mouse' + e.button);
    }
    function onC(e) { e.preventDefault(); e.stopImmediatePropagation(); }
    function onB() { cl(); }

    window.addEventListener('keydown', onK, true);
    window.addEventListener('mousedown', onM, true);
    window.addEventListener('contextmenu', onC, true);
    window.addEventListener('blur', onB, true);
  }

  function v6WpL2sT(p) {
    const vpW = document.documentElement.clientWidth || window.innerWidth;
    const vpH = document.documentElement.clientHeight || window.innerHeight;
    const mxL = Math.max(0, vpW - p.offsetWidth), mxT = Math.max(0, vpH - p.offsetHeight);
    if (m9TvL2sP.pillX !== null && m9TvL2sP.pillY !== null) {
      const cL = Math.max(0, Math.min(mxL, m9TvL2sP.pillX));
      const cT = Math.max(0, Math.min(mxT, m9TvL2sP.pillY));
      p.style.left = cL + 'px'; p.style.top = cT + 'px'; p.style.right = 'auto';
    }
    const r = p.getBoundingClientRect();
    const tT = r.top <= 4, tB = r.bottom >= vpH - 4;
    const tL = r.left <= 4, tR = r.right >= vpW - 4;
    p.style.borderTop = tT ? 'none' : '1px solid var(--macro-border, #333)';
    p.style.borderBottom = tB ? 'none' : '1px solid var(--macro-border, #333)';
    p.style.borderLeft = tL ? 'none' : '1px solid var(--macro-border, #333)';
    p.style.borderRight = tR ? 'none' : '1px solid var(--macro-border, #333)';
    p.style.borderRadius = `${(tT || tL) ? '0' : '8px'} ${(tT || tR) ? '0' : '8px'} ${(tB || tR) ? '0' : '8px'} ${(tB || tL) ? '0' : '8px'}`;
  }

  let z4QzM8vL = [];
  const q9TxL3wP = new Set();
  let d2WnS7tM = null;

  function h7QzM4vL(r) {
    if (!r) return null;
    const b = r.match(/\[([^\]]+)\]/);
    if (b && b[1].trim().length >= 2) return b[1].trim();
    const c = r.trim();
    return c.length >= 2 && c.length <= 20 ? c : null;
  }

  const p4TxL8wS = CanvasRenderingContext2D.prototype.fillText;
  CanvasRenderingContext2D.prototype.fillText = function (txt, x, y, maxW) {
    if (m9TvL2sP.skinStealer || m9TvL2sP.nameStealer || m9TvL2sP.customSwitcher) {
      if (this.canvas && (this.canvas.id === 'leaderboard-canvas' || (this.canvas.parentElement && this.canvas.parentElement.id === 'leaderboard-panel'))) {
        if (typeof txt === 'string') {
          const str = txt.trim();
          if (/^1[\.\)]\s*/.test(str)) q9TxL3wP.clear();
          const cln = str.replace(/^\d+[\.\)]\s*/, '').trim();
          if (cln && !/^leaderboard$/i.test(cln)) q9TxL3wP.add(cln);
        }
      }
    }
    w3RecTxt(this, txt, x, y, maxW, false);
    return p4TxL8wS.apply(this, arguments);
  };

  const p4StrkOg = CanvasRenderingContext2D.prototype.strokeText;
  CanvasRenderingContext2D.prototype.strokeText = function (txt, x, y, maxW) {
    w3RecTxt(this, txt, x, y, maxW, true);
    return p4StrkOg.apply(this, arguments);
  };

  const p4ClrOg = CanvasRenderingContext2D.prototype.clearRect;
  CanvasRenderingContext2D.prototype.clearRect = function (x, y, w, h) {
    w3ClrArea(this, x, y, w, h, false);
    return p4ClrOg.apply(this, arguments);
  };

  const p4FillOg = CanvasRenderingContext2D.prototype.fillRect;
  CanvasRenderingContext2D.prototype.fillRect = function (x, y, w, h) {
    if (this.canvas && this.canvas.isConnected && v9TxtOn()) w3ClrArea(this, x, y, w, h, true);
    return p4FillOg.apply(this, arguments);
  };

  if (typeof OffscreenCanvasRenderingContext2D !== 'undefined') {
    const o4Ft = OffscreenCanvasRenderingContext2D.prototype.fillText;
    OffscreenCanvasRenderingContext2D.prototype.fillText = function (txt, x, y, maxW) {
      w3RecTxt(this, txt, x, y, maxW, false);
      return o4Ft.apply(this, arguments);
    };
    const o4St = OffscreenCanvasRenderingContext2D.prototype.strokeText;
    OffscreenCanvasRenderingContext2D.prototype.strokeText = function (txt, x, y, maxW) {
      w3RecTxt(this, txt, x, y, maxW, true);
      return o4St.apply(this, arguments);
    };
    const o4Cl = OffscreenCanvasRenderingContext2D.prototype.clearRect;
    OffscreenCanvasRenderingContext2D.prototype.clearRect = function (x, y, w, h) {
      w3ClrArea(this, x, y, w, h, false);
      return o4Cl.apply(this, arguments);
    };
  }

  ['width', 'height'].forEach(prop => {
    const d = Object.getOwnPropertyDescriptor(HTMLCanvasElement.prototype, prop);
    if (d && d.set) {
      Object.defineProperty(HTMLCanvasElement.prototype, prop, {
        configurable: true,
        enumerable: d.enumerable,
        get: d.get,
        set(val) {
          w3CvsTxt.delete(this);
          w3ConnTxt.delete(this);
          return d.set.call(this, val);
        }
      });
    }
    if (typeof OffscreenCanvas !== 'undefined') {
      const od = Object.getOwnPropertyDescriptor(OffscreenCanvas.prototype, prop);
      if (od && od.set) {
        Object.defineProperty(OffscreenCanvas.prototype, prop, {
          configurable: true,
          enumerable: od.enumerable,
          get: od.get,
          set(val) {
            w3CvsTxt.delete(this);
            return od.set.call(this, val);
          }
        });
      }
    }
  });

  if (typeof window.createImageBitmap === 'function') {
    const o4Cib = window.createImageBitmap;
    window.createImageBitmap = function (src) {
      return o4Cib.apply(this, arguments).then(bmp => {
        w3CopyCvsRec(src, bmp);
        return bmp;
      });
    };
  }

  if (typeof OffscreenCanvas !== 'undefined' && OffscreenCanvas.prototype.transferToImageBitmap) {
    const o4Tib = OffscreenCanvas.prototype.transferToImageBitmap;
    OffscreenCanvas.prototype.transferToImageBitmap = function () {
      const bmp = o4Tib.apply(this, arguments);
      w3CopyCvsRec(this, bmp);
      return bmp;
    };
  }

  setInterval(() => {
    if (!m9TvL2sP.skinStealer && !m9TvL2sP.nameStealer && !m9TvL2sP.customSwitcher) return;
    const mp = document.getElementById('main-panel') || document.getElementById('login-panel');
    if (mp && window.getComputedStyle(mp).display === 'none') return;

    z4QzM8vL = Array.from(q9TxL3wP);
    if (!d2WnS7tM || !document.contains(d2WnS7tM)) d2WnS7tM = document.getElementById('name-box');
    if (!d2WnS7tM || document.activeElement === d2WnS7tM) return;
    let sel = null;
    if (m9TvL2sP.customSwitcher) {
      const pl = (m9TvL2sP.customNicks || '').split(',').map(s => s.trim()).filter(Boolean);
      if (pl.length) sel = pl[(Math.random() * pl.length) | 0];
    } else {
      let pl = z4QzM8vL;
      if (!pl.length) {
        const p = document.getElementById('leaderboard-panel');
        if (p && p.innerText) pl = p.innerText.split('\n').map(l => l.replace(/^\d+[\.\)]\s*/, '').trim()).filter(l => l && !/^(leaderboard|leave|refresh|visibility|timer|\d{1,2}:\d{2}|\d+)$/i.test(l));
      }
      if (m9TvL2sP.skinStealer) {
        const sks = pl.map(h7QzM4vL).filter(Boolean);
        if (sks.length) sel = sks[(Math.random() * sks.length) | 0];
      } else if (m9TvL2sP.nameStealer && pl.length) {
        sel = pl[(Math.random() * pl.length) | 0];
      }
    }
    if (sel && d2WnS7tM.value !== sel) {
      d2WnS7tM.value = sel;
      d2WnS7tM.dispatchEvent(new Event('input', { bubbles: true }));
      d2WnS7tM.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, 1000);

  function y9WnK2vT() {
    if (document.getElementById('macro-window')) return;

    const st = document.createElement('style');
    st.textContent = `
      #macro-toggle-pill{position:fixed;top:0;right:0;background:#181818;color:#bbb;padding:9px 16px;font-family:'Ubuntu',sans-serif,Arial;font-size:11px;font-weight:700;letter-spacing:0.6px;cursor:grab;z-index:9999999;user-select:none;transition:background 0.12s,color 0.12s;box-shadow:0 4px 14px rgba(0,0,0,0.45)}
      #macro-toggle-pill:hover{background:#252525;color:#fff}#macro-toggle-pill:active{cursor:grabbing}
      #macro-window{position:fixed;top:52px;right:0;width:320px;min-width:280px;min-height:320px;max-width:100vw;max-height:100vh;box-sizing:border-box;background:var(--macro-win-bg,rgba(20,20,20,0.97));backdrop-filter:blur(8px);border:1px solid var(--macro-border,#333);border-radius:8px;box-shadow:0 14px 36px rgba(0,0,0,0.75);font-family:'Ubuntu',sans-serif,Arial;color:var(--macro-text,#ddd);z-index:999999;user-select:none;opacity:0;visibility:hidden;transform:scale(0.95) translateY(-6px);pointer-events:none;display:flex;flex-direction:column;overflow:hidden;cursor:default;font-size:12px;transition:opacity 0.14s,transform 0.14s,color 0.28s ease,visibility 0s linear 0.14s}
      #macro-window.open{opacity:1;visibility:visible;transform:scale(1) translateY(0);pointer-events:auto;transition:opacity 0.14s,transform 0.14s,color 0.28s ease,visibility 0s linear 0s}
      .macro-win-header{padding:0.8em 2.8em;font-weight:700;font-size:1.1em;color:var(--macro-title-color,#fff);text-align:center;letter-spacing:0.4px;background:var(--macro-hdr-bg,#141414);border-bottom:1px solid var(--macro-hdr-border,#282828);cursor:grab;user-select:none;position:relative;z-index:20;flex-shrink:0;transition:color 0.28s ease,border-color 0.28s ease}
      .macro-win-header:active,.macro-win-header.dragging{cursor:grabbing}
      .macro-gear-btn{position:absolute !important;left:0.55em !important;top:0 !important;bottom:0 !important;right:auto !important;margin:auto 0 !important;transform:none !important;width:2.15em !important;height:2.15em !important;padding:0 !important;border:none !important;box-shadow:none !important;outline:none !important;background:transparent !important;color:var(--macro-title-color,#fff) !important;font-family:inherit;font-size:1em;display:inline-flex !important;align-items:center !important;justify-content:center !important;cursor:pointer !important;z-index:25;transition:color 0.28s ease}
      .macro-gear-btn:hover,.macro-gear-btn:active,.macro-gear-btn:focus{position:absolute !important;left:0.55em !important;top:0 !important;bottom:0 !important;right:auto !important;margin:auto 0 !important;padding:0 !important;transform:none !important;background:transparent !important;border:none !important;box-shadow:none !important;outline:none !important;color:var(--macro-title-color,#fff) !important}
      .macro-gear-btn svg{width:1.65em;height:1.65em;fill:currentColor;display:block;pointer-events:none;transition:transform 0.34s cubic-bezier(0.22,1,0.36,1)}
      #macro-window.settings-open .macro-gear-btn svg{transform:rotate(90deg)}
      .macro-header-title-wrap{position:relative;display:block;width:100%}
      .macro-header-title{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:opacity 0.2s ease,transform 0.24s cubic-bezier(0.22,1,0.36,1),color 0.28s ease}
      .macro-title-cfg{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:0;transform:scale(1.06);pointer-events:none}
      #macro-window.settings-open .macro-title-main{opacity:0;transform:scale(0.94)}
      #macro-window.settings-open .macro-title-cfg{opacity:1;transform:scale(1)}
      .macro-win-stage{position:relative;flex:1;min-height:0;overflow:hidden;z-index:1}
      .macro-pane-main,.macro-pane-settings{position:absolute;inset:0;contain:layout style;will-change:opacity,transform}
      .macro-pane-main{opacity:1;transform:scale(1);visibility:visible;pointer-events:auto;z-index:2;transition:opacity 0.2s cubic-bezier(0.22,1,0.36,1),transform 0.24s cubic-bezier(0.22,1,0.36,1),visibility 0s linear 0s}
      #macro-window.settings-open .macro-pane-main{opacity:0;transform:scale(0.955);visibility:hidden;pointer-events:none;z-index:1;transition:opacity 0.18s cubic-bezier(0.22,1,0.36,1),transform 0.22s cubic-bezier(0.22,1,0.36,1),visibility 0s linear 0.22s}
      .macro-pane-settings{overflow:hidden;opacity:0;transform:scale(1.045);visibility:hidden;pointer-events:none;z-index:1;transition:opacity 0.18s cubic-bezier(0.22,1,0.36,1),transform 0.22s cubic-bezier(0.22,1,0.36,1),visibility 0s linear 0.22s}
      .macro-settings-body{position:absolute;inset:0;padding:0.9em 1.1em 1.1em;overflow-y:scroll;scrollbar-width:none;-ms-overflow-style:none}
      .macro-settings-body::-webkit-scrollbar{display:none;width:0;height:0}
      #macro-window.settings-open .macro-pane-settings{opacity:1;transform:scale(1);visibility:visible;pointer-events:auto;z-index:3;transition:opacity 0.22s cubic-bezier(0.22,1,0.36,1) 0.03s,transform 0.24s cubic-bezier(0.22,1,0.36,1) 0.03s,visibility 0s linear 0s}
      .macro-win-body{position:absolute;inset:0;padding:0.9em 1.1em 1.1em;overflow-y:scroll;scrollbar-width:none;-ms-overflow-style:none}
      .macro-win-body::-webkit-scrollbar{display:none;width:0;height:0}
      .macro-custom-scroll-track{position:absolute;top:0.35em;bottom:0.9em;right:0;width:1em;z-index:90;cursor:pointer;background:transparent;touch-action:none}
      .macro-custom-scroll-thumb{position:absolute;right:0;width:0.5em;background:var(--macro-scroll-thumb,#2d2d2d);border-radius:0.25em 0 0 0.25em;cursor:pointer;touch-action:none;transition:background 0.12s,width 0.12s}
      .macro-custom-scroll-track:hover .macro-custom-scroll-thumb,.macro-custom-scroll-thumb.dragging{background:var(--macro-scroll-hover,#4f4f4f);width:0.75em}
      .macro-section-header{display:flex;align-items:center;justify-content:space-between;font-size:0.95em;font-weight:700;color:var(--macro-muted-text,#9aa0a6);text-transform:uppercase;letter-spacing:0.5px;margin:0.4em 0 0.8em;transition:color 0.28s ease}
      .macro-info-wrap{position:relative;display:inline-flex;align-items:center}
      .macro-info-icon{box-sizing:border-box;display:inline-flex;align-items:center;justify-content:center;width:1.4em;height:1.4em;padding:0;border-radius:50%;background:var(--macro-btn-bg,#282828);border:1px solid var(--macro-btn-border,#555);color:var(--macro-title-color,#fff);font-size:1em;cursor:help;line-height:0;transition:color 0.28s ease,border-color 0.2s ease}
      .macro-info-icon svg{width:1.22em !important;height:1.22em !important;display:block !important;fill:currentColor !important;stroke:none !important;border:none !important;background:transparent !important;box-shadow:none !important;pointer-events:none}
      .macro-info-tooltip{position:absolute;bottom:calc(100% + 0.65em);right:0;width:21em;max-width:calc(100vw - 24px);background:rgba(14,14,14,0.98);border:1px solid #484848;border-radius:0.5em;padding:0.75em 0.9em;color:#e0e0e0;font-size:0.88em;line-height:1.4;text-transform:none;letter-spacing:0;font-weight:500;pointer-events:none;opacity:0;visibility:hidden;transform:translateY(4px);transition:opacity 0.18s ease,transform 0.18s ease,visibility 0s linear 0.18s;box-shadow:0 8px 24px rgba(0,0,0,0.85);z-index:100000}
      .macro-info-wrap:hover .macro-info-tooltip{opacity:1;visibility:visible;transform:translateY(0);transition:opacity 0.18s ease,transform 0.18s ease,visibility 0s linear 0s}
      .macro-row{display:flex;justify-content:space-between;align-items:center;margin-bottom:0.7em;font-size:1em;gap:0.8em;transition:color 0.28s ease}
      .macro-row-disabled{opacity:0.42;filter:grayscale(0.85);transition:opacity 0.2s,filter 0.2s}
      .macro-controls-group{display:flex;align-items:center;gap:0.6em}
      .macro-slider-track{width:7.5em;height:0.85em;background:var(--macro-btn-bg-sub,#141414);border:1px solid var(--macro-btn-border,#2d2d2d);border-radius:0.45em;position:relative;cursor:pointer;overflow:hidden}
      .macro-icon-btn{background:var(--macro-btn-bg,#242424);border:1px solid var(--macro-btn-border,#383838);color:var(--macro-btn-text,#eee);border-radius:0.35em;padding:0.35em 0.5em;font-size:1em;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;line-height:0;transition:background 0.12s,border-color 0.12s,color 0.28s ease}
      .macro-icon-btn:hover{filter:brightness(1.15)}
      .macro-icon-btn svg{width:1.17em;height:1.17em;fill:currentColor}
      .macro-trash-btn{background:var(--macro-btn-bg,#251616);border-color:var(--macro-btn-border,#4a2222);color:var(--macro-btn-reset-text,#ff4d4d)}
      .macro-trash-btn:hover{filter:brightness(1.15)}
      .macro-slider-fill{height:100%;background:var(--macro-slider-fill,#444450);border-radius:0.4em;pointer-events:none}
      .macro-num-wrap{display:flex;align-items:center;background:var(--macro-btn-bg-sub,#171717);border:1px solid var(--macro-btn-border,#303030);border-radius:0.35em;padding:0.15em 0.25em}
      .macro-step-btn{background:transparent;border:none;color:var(--macro-btn-muted,#777);font-size:1em;cursor:pointer;padding:0.15em 0.25em;line-height:0;display:inline-flex;transition:color 0.28s ease}
      .macro-step-btn svg{width:0.85em;height:0.85em;stroke:currentColor;stroke-width:2.2;fill:none}
      .macro-num-input{width:3.2em;background:transparent;border:none;outline:none;color:var(--macro-btn-text,#fff);font-family:inherit;font-size:0.95em;font-weight:600;text-align:center;-moz-appearance:textfield;transition:color 0.28s ease}
      .macro-num-input::-webkit-outer-spin-button,.macro-num-input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}
      .macro-btn-group{display:flex;gap:0.4em;align-items:center}
      .macro-bind-btn{min-width:5.5em;background:var(--macro-btn-bg,#242424);border:1px solid var(--macro-btn-border,#383838);color:var(--macro-btn-text,#eee);border-radius:0.35em;padding:0.4em 0.8em;font-size:0.92em;font-family:inherit;cursor:pointer;text-align:center;transition:color 0.28s ease}
      .macro-bind-btn.recording,.macro-menu-bind-btn.recording{background:var(--macro-accent,#f2f2f4) !important;border-color:var(--macro-accent,#ffffff) !important;color:var(--macro-accent-text,#111114) !important;box-shadow:0 0 8px var(--macro-accent-muted,rgba(255,255,255,0.28))}
      .macro-rst-btn{background:var(--macro-btn-bg-sub,#1c1c1c);border:1px solid var(--macro-btn-border,#303030);color:var(--macro-btn-muted,#777);border-radius:0.35em;padding:0.4em 0.6em;font-family:inherit;font-size:0.85em;cursor:pointer;transition:color 0.28s ease}
      .macro-sep{height:1px;background:var(--macro-sep,rgba(255,255,255,0.08));margin:0.85em 0;transition:background-color 0.28s ease}
      .macro-chips-container{display:flex;background:var(--macro-btn-bg-sub,#141414);border:1px solid var(--macro-btn-border,#2d2d2d);border-radius:0.35em;padding:0.17em;gap:0.17em;flex:1;max-width:20.8em}
      .macro-split-chip{background:transparent;border:none;color:var(--macro-btn-muted,#888);font-family:inherit;font-size:1em;font-weight:700;padding:0.33em 0.08em;border-radius:0.25em;cursor:pointer;flex:1;min-width:0;text-align:center;transition:color 0.28s ease}
      .macro-split-chip.active{background:var(--macro-accent,#f2f2f4);color:var(--macro-accent-text,#111114)}
      .macro-menu-bind-wrap{display:flex;width:100%;margin-top:0.6em;gap:0.42em}
      .macro-menu-bind-btn{flex:0 0 calc(70% - 0.21em);background:var(--macro-btn-bg,#222);border:1px solid var(--macro-btn-border,#383838);color:var(--macro-btn-text,#ddd);border-radius:0.35em;padding:0.65em 0;font-family:inherit;font-size:1em;font-weight:700;cursor:pointer;text-align:center;transition:color 0.28s ease}
      .macro-menu-rst-btn{flex:0 0 calc(30% - 0.21em);background:var(--macro-btn-bg-sub,#1c1c1c);border:1px solid var(--macro-btn-border,#303030);color:var(--macro-btn-muted,#777);border-radius:0.35em;padding:0.65em 0;font-family:inherit;font-size:1em;font-weight:700;cursor:pointer;text-align:center;transition:color 0.28s ease}
      .macro-reset-all-btn{width:100%;background:var(--macro-btn-bg,#211c1c);border:1px solid var(--macro-btn-border,#4a2828);color:var(--macro-btn-reset-text,#ff7575);border-radius:0.35em;padding:0.65em 0;margin-top:0.5em;font-family:inherit;font-size:1em;font-weight:700;cursor:pointer;transition:color 0.28s ease}
      .macro-tutorial-btn{display:block;width:100%;box-sizing:border-box;background:var(--macro-btn-bg-sub,#131c26);border:1px solid var(--macro-btn-border,#233b54);color:var(--macro-btn-tut-text,#3898ec);border-radius:0.35em;padding:0.65em 0;margin-top:0.5em;font-family:inherit;font-size:1em;font-weight:700;text-align:center;text-decoration:none;transition:background 0.15s,border-color 0.15s,color 0.28s ease;cursor:pointer}
      .macro-tutorial-btn:hover{filter:brightness(1.18)}
      .macro-upd-banner{display:none;width:100%;box-sizing:border-box;background:rgba(56,152,236,0.14);border:1px solid rgba(56,152,236,0.45);color:var(--macro-btn-tut-text,#62b2f5);border-radius:0.35em;padding:0.52em 0.7em;margin-bottom:0.75em;font-family:inherit;font-size:0.92em;font-weight:700;text-align:center;text-decoration:none;transition:background 0.15s,border-color 0.15s,filter 0.15s}
      .macro-upd-banner:hover{filter:brightness(1.18)}
      .macro-resizer{position:absolute;z-index:120}.macro-resizer-nw{top:0;left:0;width:12px;height:12px;cursor:nwse-resize}.macro-resizer-ne{top:0;right:0;width:12px;height:12px;cursor:nesw-resize}.macro-resizer-sw{bottom:0;left:0;width:12px;height:12px;cursor:nesw-resize}.macro-resizer-se{bottom:0;right:0;width:12px;height:12px;cursor:nwse-resize}
      .macro-switch{position:relative;display:inline-block;width:3.17em;height:1.67em;flex-shrink:0;cursor:pointer}
      .macro-switch input{opacity:0;width:0;height:0}
      .macro-switch-slider{position:absolute;cursor:pointer;top:0;left:0;right:0;bottom:0;background-color:var(--macro-btn-bg-sub,#2b2b2b);border:1px solid var(--macro-btn-border,#3c3c3c);border-radius:1.67em;transition:0.2s}
      .macro-switch-slider:before{position:absolute;content:"";height:1.17em;width:1.17em;left:0.17em;top:50%;transform:translate(0,-50%);background-color:var(--macro-btn-muted,#888);border-radius:50%;transition:0.2s}
      .macro-switch input:checked + .macro-switch-slider{background-color:var(--macro-sw-on-bg,#3c3c42);border-color:var(--macro-sw-on-brd,#787882)}
      .macro-switch input:checked + .macro-switch-slider:before{transform:translate(1.5em,-50%);background-color:var(--macro-sw-on-knob,#f4f4f6)}
      .macro-textarea{width:100%;box-sizing:border-box;background:var(--macro-btn-bg-sub,#151515);border:1px solid var(--macro-btn-border,#303030);border-radius:0.5em;color:var(--macro-btn-text,#ccc);font-family:inherit;font-size:0.9em;padding:0.67em;resize:vertical;min-height:4.8em;outline:none;margin:0.4em 0;overflow-y:auto;scrollbar-width:none;-ms-overflow-style:none;transition:color 0.28s ease}
      .macro-textarea::-webkit-scrollbar{display:none;width:0;height:0}
      #macro-row-margin>span{white-space:nowrap;flex-shrink:0}
      #macro-row-margin .macro-controls-group{min-width:0;flex:1;justify-content:flex-end;gap:0.5em}
      #macro-row-margin .macro-slider-track{width:7.5em;max-width:7.5em;min-width:3.6em;flex:0 1 7.5em}
      #macro-row-margin .macro-num-wrap,#macro-row-margin .macro-switch{flex-shrink:0}
      #macro-row-margin .macro-num-input{width:2.6em}
      #macro-plexus-canvas{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;transition:opacity 0.22s ease}
      .macro-ff-label-wrap{display:inline-flex !important;align-items:center !important;gap:0.45em;min-width:0}
      .macro-ff-add-btn,.macro-ff-del-btn{box-sizing:border-box !important;width:1.45em !important;height:1.45em !important;min-width:0 !important;min-height:0 !important;flex:0 0 auto !important;padding:0 !important;margin:0 !important;transform:none !important;box-shadow:none !important;outline:none !important;border-radius:0.3em !important;background:var(--macro-btn-bg,#242424) !important;border:1px solid var(--macro-btn-border,#383838) !important;color:var(--macro-btn-text,#ccc) !important;font-family:inherit;font-size:0.95em !important;line-height:0 !important;display:inline-flex !important;align-items:center !important;justify-content:center !important;cursor:pointer !important;position:relative !important;z-index:20 !important;user-select:none !important;transition:background 0.14s,border-color 0.14s,filter 0.14s,color 0.28s ease}
      .macro-ff-add-btn svg,.macro-ff-del-btn svg{width:0.92em !important;height:0.92em !important;stroke:currentColor !important;stroke-width:2 !important;stroke-linecap:round !important;fill:none !important;display:block !important;pointer-events:none !important;flex-shrink:0 !important}
      .macro-ff-add-btn:hover{border-color:var(--macro-btn-muted,#666) !important;color:var(--macro-title-color,#fff) !important;filter:brightness(1.15);transform:none !important}
      .macro-ff-del-btn{background:var(--macro-btn-bg,#251616) !important;border-color:var(--macro-btn-border,#4a2222) !important;color:var(--macro-btn-reset-text,#ff6b6b) !important}
      .macro-ff-del-btn:hover{border-color:#ff4d4d !important;filter:brightness(1.15);transform:none !important}
      .macro-ff-add-btn:active,.macro-ff-add-btn:focus,.macro-ff-del-btn:active,.macro-ff-del-btn:focus{transform:none !important;box-shadow:none !important;outline:none !important}
      #macro-window button,#macro-window [role="button"],#macro-window a{outline:none !important}
      .macro-ff-anim{display:grid;grid-template-rows:1fr;opacity:1;transition:grid-template-rows 0.18s cubic-bezier(0.22,1,0.36,1),opacity 0.15s ease}
      .macro-ff-anim.macro-ff-entering,.macro-ff-anim.macro-ff-leaving{grid-template-rows:0fr;opacity:0;pointer-events:none}
      .macro-ff-anim-inner{overflow:hidden;min-height:0}
      .macro-ff-anim-inner>.macro-row{margin-bottom:0;padding-bottom:0.7em}
      #macro-ff-delays .macro-ff-anim-inner>.macro-row{margin-bottom:0;padding-top:0.7em;padding-bottom:0}
      .macro-settings-body .macro-row,.macro-settings-body .macro-section-header,.macro-settings-body .macro-sep{transition:opacity 0.18s ease,color 0.18s ease,text-shadow 0.18s ease}
      .macro-settings-body.macro-pal-dim .macro-row,.macro-settings-body.macro-pal-dim .macro-section-header,.macro-settings-body.macro-pal-dim .macro-sep{opacity:0.32}
      .macro-settings-body.macro-pal-dim .macro-row.macro-pal-active{opacity:1}
      .macro-settings-body.macro-pal-dim .macro-row.macro-pal-active>span{color:var(--macro-title-color,#fff);text-shadow:var(--macro-pal-glow,0 0 8px rgba(255,255,255,0.28))}
      .macro-mini-pal{font-family:inherit;font-size:1em;width:1.5em;height:1.5em;padding:0 !important;margin:0 !important;border-radius:0.38em;border:1px solid rgba(255,255,255,0.28) !important;background:radial-gradient(circle,rgba(255,255,255,0.88) 0%,rgba(255,255,255,0) 68%),conic-gradient(#ff2a2a,#ffea00,#00ff44,#00e5ff,#2244ff,#ee00ff,#ff2a2a) !important;cursor:pointer !important;flex-shrink:0;position:relative;overflow:hidden;box-shadow:0 2px 6px rgba(0,0,0,0.45) !important;transform:none !important;transition:border-color 0.16s ease,box-shadow 0.16s ease}
      .macro-mini-pal:hover{border-color:#fff !important;transform:none !important}
      .macro-color-pop{display:none;position:absolute;left:auto;top:auto;width:19.2em;height:16.2em;max-width:calc(100% - 1.2em);max-height:calc(100% - 1.2em);box-sizing:border-box;padding:0.65em;background:var(--macro-hdr-bg,rgba(20,20,24,0.98));backdrop-filter:blur(10px);border:1px solid var(--macro-border,rgba(255,255,255,0.16));border-radius:0.75em;box-shadow:0 14px 36px rgba(0,0,0,0.88);flex-direction:column;gap:0.55em;z-index:50;color:var(--macro-text,#eee);opacity:0;visibility:hidden;pointer-events:none;transform-origin:right top;transform:scale(0.92);transition:opacity 0.18s cubic-bezier(0.22,1,0.36,1),transform 0.2s cubic-bezier(0.22,1,0.36,1),visibility 0s linear 0.2s,color 0.28s ease}
      #macro-window.open.settings-open .macro-color-pop.open{opacity:1;visibility:visible;pointer-events:auto;transform:scale(1);transition:opacity 0.18s cubic-bezier(0.22,1,0.36,1),transform 0.2s cubic-bezier(0.22,1,0.36,1),visibility 0s linear 0s,color 0.28s ease}
      .macro-rgb-sv{position:relative;width:100%;flex:1;min-height:0;border-radius:0.45em;border:1px solid var(--macro-border,#353535);cursor:default !important;overflow:hidden;background-color:#f00;background-image:linear-gradient(to top,#000,rgba(0,0,0,0)),linear-gradient(to right,#fff,rgba(255,255,255,0))}
      .macro-rgb-cursor{position:absolute;width:0.8em;height:0.8em;border-radius:50%;border:1.5px solid #fff;box-shadow:0 0 0 1px rgba(0,0,0,0.85),inset 0 0 2px rgba(0,0,0,0.65);transform:translate(-50%,-50%);pointer-events:none}
      .macro-rgb-hue{position:relative;width:100%;height:0.85em;border-radius:0.45em;border:1px solid var(--macro-border,#353535);cursor:default !important;flex-shrink:0;background:linear-gradient(to right,#f00 0%,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,#f00 100%)}
      .macro-rgb-hue-thumb{position:absolute;top:50%;width:0.55em;height:1.12em;border-radius:0.24em;background:#fff;border:1px solid #111;box-shadow:0 1px 4px rgba(0,0,0,0.75);transform:translate(-50%,-50%);pointer-events:none}
      .macro-rgb-footer{display:flex;align-items:stretch;gap:0.38em;flex-shrink:0}
      .macro-rgb-hex,.macro-rgb-val{flex:1 1 0;width:0;min-width:0;height:auto !important;min-height:0 !important;box-sizing:border-box;margin:0 !important;padding:0.44em 0.3em !important;background:var(--macro-btn-bg-sub,#141414) !important;border:1px solid var(--macro-btn-border,#323232) !important;border-radius:0.42em;box-shadow:inset 0 1px 0 rgba(255,255,255,0.04) !important;color:var(--macro-btn-text,#eee) !important;font-family:inherit;font-size:0.76em;font-weight:700;font-variant-numeric:tabular-nums;line-height:1.2;outline:none;text-align:center;transition:border-color 0.16s ease,box-shadow 0.16s ease,filter 0.14s ease,color 0.28s ease}
      .macro-rgb-hex{text-transform:uppercase}
      .macro-rgb-hex:hover,.macro-rgb-val:hover{filter:brightness(1.12)}
      .macro-rgb-hex:focus,.macro-rgb-val:focus{border-color:var(--macro-accent,#f2f2f4) !important;box-shadow:0 0 0 1px rgba(255,255,255,0.22) !important}
      .macro-rgb-rst{flex:0 0 auto;display:inline-flex;align-items:center;justify-content:center;margin:0 !important;height:auto !important;background:var(--macro-btn-bg,#222) !important;border:1px solid var(--macro-btn-border,#383838) !important;color:var(--macro-btn-text,#d4d4d4) !important;border-radius:0.42em;padding:0 0.68em;font-family:inherit;font-size:0.76em;font-weight:700;line-height:1.2;cursor:pointer;transform:none !important;box-shadow:inset 0 1px 0 rgba(255,255,255,0.05) !important;transition:color 0.28s ease,filter 0.14s,border-color 0.16s}
      .macro-rgb-rst:hover{filter:brightness(1.16);border-color:var(--macro-btn-muted,#5a5a64) !important;transform:none !important}
      .macro-rgb-rst:active{filter:brightness(0.95);transform:none !important}
      .macro-lang-btn{display:inline-flex;align-items:center;justify-content:space-between;gap:0.45em;width:11.6em;box-sizing:border-box;background:var(--macro-btn-bg,#242424);border:1px solid var(--macro-btn-border,#383838);color:var(--macro-btn-text,#eee);border-radius:0.35em;padding:0.38em 0.62em;font-family:inherit;font-size:0.92em;font-weight:600;cursor:pointer;transition:border-color 0.16s,filter 0.14s,color 0.28s ease}
      .macro-lang-btn:hover{filter:brightness(1.14)}
      .macro-lang-btn.open{border-color:var(--macro-accent-muted,rgba(255,255,255,0.48))}
      .macro-lang-cur{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
      .macro-lang-chev{width:0.95em;height:0.95em;flex-shrink:0;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;fill:none;transition:transform 0.22s cubic-bezier(0.22,1,0.36,1)}
      .macro-lang-btn.open .macro-lang-chev{transform:rotate(180deg)}
      .macro-lang-pop{display:none;position:absolute;left:auto;top:auto;box-sizing:border-box;padding:0.24em;margin-bottom:0.9em;background:var(--macro-lang-bg,rgba(24,24,24,0.98));border:1px solid var(--macro-border,#2e2e2e);border-radius:0.5em;box-shadow:0 14px 36px rgba(0,0,0,0.88);z-index:48;max-height:none !important;height:auto !important;overflow:visible !important;scrollbar-width:none !important;opacity:0;visibility:hidden;pointer-events:none;transform-origin:top center;transform:scale(0.95) translateY(-4px);transition:opacity 0.18s cubic-bezier(0.22,1,0.36,1),transform 0.2s cubic-bezier(0.22,1,0.36,1),visibility 0s linear 0.2s}
      #macro-window.open.settings-open .macro-lang-pop.open{opacity:1;visibility:visible;pointer-events:auto;transform:scale(1) translateY(0);transition:opacity 0.18s cubic-bezier(0.22,1,0.36,1),transform 0.2s cubic-bezier(0.22,1,0.36,1),visibility 0s linear 0s}
      .macro-lang-list{display:flex;flex-direction:column;gap:0.12em;max-height:none !important;height:auto !important;overflow:visible !important;scrollbar-width:none !important}
      .macro-lang-pop::-webkit-scrollbar,.macro-lang-list::-webkit-scrollbar{display:none !important;width:0 !important;height:0 !important}
      .macro-lang-opt{width:100%;display:flex;align-items:center;gap:0.42em;padding:0.36em 0.44em;border:none;border-radius:0.34em;background:transparent;color:var(--macro-text,#d2d2d2);font-family:inherit;font-size:0.9em;cursor:pointer;text-align:left;transition:background 0.14s,color 0.14s}
      .macro-lang-opt:hover{background:rgba(128,128,128,0.14);color:var(--macro-title-color,#fff)}
      .macro-lang-opt:hover .macro-lang-name{transform:translateX(2px)}
      .macro-lang-opt.active{background:var(--macro-opt-act-bg,rgba(255,255,255,0.1));color:var(--macro-title-color,#fff)}
      .macro-lang-bar{width:0.2em;height:0.95em;border-radius:0.12em;background:var(--macro-accent,#f2f2f4);flex-shrink:0;opacity:0;transform:scaleY(0.35);transition:opacity 0.18s,transform 0.2s cubic-bezier(0.22,1,0.36,1)}
      .macro-lang-opt.active .macro-lang-bar{opacity:1;transform:scaleY(1)}
      .macro-lang-name{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;transition:transform 0.16s cubic-bezier(0.22,1,0.36,1)}
      .macro-lang-opt.active .macro-lang-name{font-weight:700}
      .macro-lang-code{flex-shrink:0;font-size:0.78em;font-weight:700;letter-spacing:0.04em;padding:0.14em 0.42em;border-radius:0.26em;background:var(--macro-btn-bg,#242424);border:1px solid var(--macro-btn-border,#363636);color:var(--macro-btn-muted,#888);transition:background 0.14s,border-color 0.14s,color 0.14s}
      .macro-lang-opt.active .macro-lang-code{background:var(--macro-accent,#f2f2f4);border-color:var(--macro-accent,#f2f2f4);color:var(--macro-accent-text,#111114)}
      #macro-window:not(.open),#macro-window:not(.open) *{pointer-events:none !important}
      #macro-window *:not(input):not(textarea)::selection{background:transparent}
      #macro-window input,#macro-window textarea{user-select:text !important;-webkit-user-select:text !important;cursor:text}
      #macro-window input::selection,#macro-window textarea::selection{background:var(--macro-sel-bg,rgba(56,152,236,0.48));color:var(--macro-sel-fg,#ffffff)}
      body.macro-txt-sel-on *:not(#macro-window):not(#macro-window *):not(#macro-toggle-pill):not(#autorev-overlay):not(#macro-bg-canvas):not(canvas):not(input[type="range"]):not(input[type="checkbox"]):not(input[type="radio"]):not(input[type="color"]):not(.macro-txt-layer){user-select:text !important;-webkit-user-select:text !important}
      body.macro-txt-sel-on *:not(#macro-window):not(#macro-window *):not(#macro-toggle-pill):not(#autorev-overlay):not(#macro-bg-canvas):not(canvas):not(button):not(a):not(select):not(input):not(textarea):not(.macro-txt-layer){cursor:auto}
      body.macro-txt-sel-on .macro-pe-txt{pointer-events:auto !important;cursor:text !important}
      .macro-txt-layer{position:fixed;left:0;top:0;width:0;height:0;pointer-events:none !important;overflow:hidden;margin:0;padding:0;border:0;user-select:none !important;-webkit-user-select:none !important}
      .macro-cvs-txt{position:absolute;left:0;top:0;margin:0;padding:0;border:0;white-space:pre;display:block;width:max-content;transform-origin:0 0;color:transparent !important;background:transparent !important;font-family:'Ubuntu',sans-serif,Arial;font-size:20px;font-weight:700;line-height:20px;height:20px;user-select:text !important;-webkit-user-select:text !important;pointer-events:auto !important;cursor:text !important;box-sizing:border-box}
      .macro-cvs-txt::selection{background:rgba(51,153,255,0.45) !important;color:transparent !important}
      body.macro-txt-bypass .macro-cvs-txt,body.macro-txt-bypass .macro-pe-txt{pointer-events:none !important}
    `;
    document.head.appendChild(st);

    const pill = document.createElement('div');
    pill.id = 'macro-toggle-pill';
    pill.textContent = 'MULTIBOX';
    document.body.appendChild(pill);
    v6WpL2sT(pill);

    const win = document.createElement('div');
    win.id = 'macro-window';
    const vpW0 = document.documentElement.clientWidth || window.innerWidth;
    const initW = Math.max(280, m9TvL2sP.winWidth || 320);
    const initH = Math.max(320, m9TvL2sP.winHeight || 560);
    win.style.width = initW + 'px';
    win.style.height = initH + 'px';
    win.style.minWidth = '280px';
    win.style.minHeight = '320px';
    const initT = m9TvL2sP.winY !== null ? Math.max(0, m9TvL2sP.winY) : 52;
    if (m9TvL2sP.winX === null || m9TvL2sP.winX >= vpW0 - initW - 10) {
      win.style.left = 'auto';
      win.style.right = '0px';
    } else {
      win.style.left = Math.max(0, m9TvL2sP.winX) + 'px';
      win.style.right = 'auto';
    }
    win.style.top = initT + 'px';
    win.style.bottom = 'auto';

    const mkR = arr => arr.map((r, idx) => {
      let sp = '';
      if (r.id.startsWith('keyT')) sp = `data-i18n-trick="${idx + 1}"`;
      else if (r.id === 'keyRevLock') sp = 'data-i18n="lock"';
      else if (r.id === 'keyRevUnlock') sp = 'data-i18n="unlock"';
      else if (r.id.startsWith('keyRevSplit')) sp = `data-i18n-selrev="${idx + 1}"`;
      return `
      <div class="macro-row">
        <span ${sp}>${r.label}</span>
        <div class="macro-btn-group">
          <button class="macro-bind-btn" id="macro-btn-${r.id}" data-id="${r.id}">${p7TvM3wL(m9TvL2sP[r.id])}</button>
          <button class="macro-rst-btn" data-reset="${r.id}" data-i18n="rst">${k3Tr('rst')}</button>
        </div>
      </div>`;
    }).join('');

    const curLangObj = t3LangList.find(l => l.code === m9TvL2sP.lang) || t3LangList[0];

    win.innerHTML = `
      <div class="macro-win-header">
        <div role="button" tabindex="0" class="macro-gear-btn" id="macro-settings-btn" title="${k3Tr('cfg')}" aria-label="${k3Tr('cfg')}" data-i18n-title="cfg" data-i18n-aria="cfg"><svg viewBox="0 0 24 24" fill-rule="evenodd"><path d="M10.36 4.89L10.81 2.27Q10.95 1.45 12 1.45Q13.05 1.45 13.19 2.27L13.64 4.89A7.3 7.3 0 0 1 15.87 5.81L18.04 4.28Q18.72 3.8 19.46 4.54Q20.2 5.28 19.72 5.96L18.19 8.13A7.3 7.3 0 0 1 19.11 10.36L21.73 10.81Q22.55 10.95 22.55 12Q22.55 13.05 21.73 13.19L19.11 13.64A7.3 7.3 0 0 1 18.19 15.87L19.72 18.04Q20.2 18.72 19.46 19.46Q18.72 20.2 18.04 19.72L15.87 18.19A7.3 7.3 0 0 1 13.64 19.11L13.19 21.73Q13.05 22.55 12 22.55Q10.95 22.55 10.81 21.73L10.36 19.11A7.3 7.3 0 0 1 8.13 18.19L5.96 19.72Q5.28 20.2 4.54 19.46Q3.8 18.72 4.28 18.04L5.81 15.87A7.3 7.3 0 0 1 4.89 13.64L2.27 13.19Q1.45 13.05 1.45 12Q1.45 10.95 2.27 10.81L4.89 10.36A7.3 7.3 0 0 1 5.81 8.13L4.28 5.96Q3.8 5.28 4.54 4.54Q5.28 3.8 5.96 4.28L8.13 5.81A7.3 7.3 0 0 1 10.36 4.89ZM12 15.4A3.4 3.4 0 0 0 12 8.6A3.4 3.4 0 0 0 12 15.4Z"/></svg></div>
        <span class="macro-header-title-wrap">
          <span class="macro-header-title macro-title-main">Multibox by Kuksik &amp; Judex</span>
          <span class="macro-header-title macro-title-cfg" data-i18n="cfg">${k3Tr('cfg')}</span>
        </span>
      </div>
      <div class="macro-win-stage">
        <div class="macro-pane-main">
          <div class="macro-win-body">
        <a id="macro-ver-banner" class="macro-upd-banner" href="https://raw.githubusercontent.com/kuksikoid/gota-multibox-guide/main/MultiBox.user.js" target="_blank" rel="noopener noreferrer"></a>
        ${['soloDelay', 'autoDelay'].map(k => {
          const p = k === 'soloDelay' ? 'solo' : 'auto';
          const dk = k === 'soloDelay' ? 'soloDel' : 'ffDel';
          return `
          <div class="macro-row"${k === 'autoDelay' ? ' style="margin-bottom:0"' : ''}>
            <span data-i18n="${dk}">${k3Tr(dk)}</span>
            <div class="macro-controls-group">
              <div class="macro-slider-track" id="macro-track-${p}" data-key="${k}"><div class="macro-slider-fill"></div></div>
              <div class="macro-num-wrap">
                <button type="button" class="macro-step-btn" id="macro-dec-${p}"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>
                <input type="text" inputmode="numeric" class="macro-num-input" id="macro-num-${p}" data-min="50" data-max="3000" data-step="10" value="${m9TvL2sP[k]}" spellcheck="false">
                <button type="button" class="macro-step-btn" id="macro-inc-${p}"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></button>
              </div>
            </div>
          </div>`;
        }).join('')}
        <div id="macro-ff-delays"></div>
        <div class="macro-sep"></div>
        <div class="macro-row">
          <div class="macro-ff-label-wrap">
            <span data-i18n="ff">${k3Tr('ff')}</span>
            <div role="button" tabindex="0" class="macro-ff-add-btn" id="macro-ff-add-btn" title="${k3Tr('ffAdd')}" aria-label="${k3Tr('ffAdd')}" data-i18n-title="ffAdd" data-i18n-aria="ffAdd"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.5v9M3.5 8h9"/></svg></div>
          </div>
          <div class="macro-btn-group">
            <button class="macro-bind-btn" id="macro-btn-keyAuto" data-id="keyAuto">${p7TvM3wL(m9TvL2sP.keyAuto)}</button>
            <button class="macro-rst-btn" data-reset="keyAuto" data-i18n="rst">${k3Tr('rst')}</button>
          </div>
        </div>
        <div id="macro-ff-binds"></div>
        ${mkR(y4WpS9vT)}
        <div class="macro-sep"></div>
        <div class="macro-section-header">
          <span data-i18n="secRev">${k3Tr('secRev')}</span>
          <div class="macro-info-wrap"><span class="macro-info-icon"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.6a1 1 0 0 1 1 1v5.1a1 1 0 1 1-2 0V3.6a1 1 0 0 1 1-1Zm0 8.55a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z"/></svg></span><div class="macro-info-tooltip" data-i18n="tipRev">${k3Tr('tipRev')}</div></div>
        </div>
        ${mkR(w9QnL2xM)}
        <div class="macro-row">
          <span data-i18n="revSp">${k3Tr('revSp')}</span>
          <div class="macro-chips-container">
            ${[2, 4, 8, 16, 32, 64, 128, 256].map(s => `<button type="button" class="macro-split-chip" data-split="${s}">${s}</button>`).join('')}
          </div>
        </div>
        ${mkR(k5TxM8wL)}
        <div class="macro-sep"></div>
        <div class="macro-section-header">
          <span data-i18n="secOpt">${k3Tr('secOpt')}</span>
          <div class="macro-info-wrap"><span class="macro-info-icon"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.6a1 1 0 0 1 1 1v5.1a1 1 0 1 1-2 0V3.6a1 1 0 0 1 1-1Zm0 8.55a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z"/></svg></span><div class="macro-info-tooltip" data-i18n="tipOpt">${k3Tr('tipOpt')}</div></div>
        </div>
        <div class="macro-row">
          <span data-i18n="cull">${k3Tr('cull')}</span>
          <label class="macro-switch">
            <input type="checkbox" id="macro-toggle-culling">
            <span class="macro-switch-slider"></span>
          </label>
        </div>
        <div class="macro-row">
          <span data-i18n="filt">${k3Tr('filt')}</span>
          <label class="macro-switch">
            <input type="checkbox" id="macro-toggle-filters">
            <span class="macro-switch-slider"></span>
          </label>
        </div>
        <div class="macro-row" id="macro-row-margin">
          <span data-i18n="marg">${k3Tr('marg')}</span>
          <div class="macro-controls-group">
            <div class="macro-slider-track" id="macro-track-margin" data-key="cullMargin"><div class="macro-slider-fill"></div></div>
            <div class="macro-num-wrap">
              <button type="button" class="macro-step-btn" id="macro-dec-margin"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>
              <input type="text" inputmode="numeric" class="macro-num-input" id="macro-num-margin" data-min="30" data-max="500" data-step="10" value="${m9TvL2sP.cullMargin}" spellcheck="false">
              <button type="button" class="macro-step-btn" id="macro-inc-margin"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></button>
            </div>
            <label class="macro-switch">
              <input type="checkbox" id="macro-toggle-margin">
              <span class="macro-switch-slider"></span>
            </label>
          </div>
        </div>
        <div class="macro-sep"></div>
        <div class="macro-section-header">
          <span data-i18n="secBg">${k3Tr('secBg')}</span>
          <div class="macro-info-wrap">
            <span class="macro-info-icon"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.6a1 1 0 0 1 1 1v5.1a1 1 0 1 1-2 0V3.6a1 1 0 0 1 1-1Zm0 8.55a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z"/></svg></span>
            <div class="macro-info-tooltip" data-i18n="tipBg">${k3Tr('tipBg')}</div>
          </div>
        </div>
        <div class="macro-row" id="macro-row-map-bg">
          <span data-i18n="mapBg">${k3Tr('mapBg')}</span>
          <div class="macro-btn-group">
            <button type="button" class="macro-icon-btn" id="macro-btn-map-file" title="${k3Tr('fFile')}" data-i18n-title="fFile"><svg viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg></button>
            <button type="button" class="macro-icon-btn" id="macro-btn-map-url" title="${k3Tr('fUrl')}" data-i18n-title="fUrl"><svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg></button>
            <button type="button" class="macro-icon-btn macro-trash-btn" id="macro-btn-map-rst" title="${k3Tr('rst')}" data-i18n-title="rst"><svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></button>
            <label class="macro-switch">
              <input type="checkbox" id="macro-toggle-map-bg">
              <span class="macro-switch-slider"></span>
            </label>
          </div>
        </div>
        <div class="macro-row" id="macro-row-fixed-bg">
          <span data-i18n="fixBg">${k3Tr('fixBg')}</span>
          <div class="macro-btn-group">
            <button type="button" class="macro-icon-btn" id="macro-btn-fixed-file" title="${k3Tr('fFile')}" data-i18n-title="fFile"><svg viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg></button>
            <button type="button" class="macro-icon-btn" id="macro-btn-fixed-url" title="${k3Tr('fUrl')}" data-i18n-title="fUrl"><svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg></button>
            <button type="button" class="macro-icon-btn macro-trash-btn" id="macro-btn-fixed-rst" title="${k3Tr('rst')}" data-i18n-title="rst"><svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></button>
            <label class="macro-switch">
              <input type="checkbox" id="macro-toggle-fixed-bg">
              <span class="macro-switch-slider"></span>
            </label>
          </div>
        </div>
        <div class="macro-sep"></div>
        <div class="macro-section-header"><span data-i18n="secMisc">${k3Tr('secMisc')}</span></div>
        <div class="macro-row">
          <span data-i18n="fixFeed">${k3Tr('fixFeed')}</span>
          <div class="macro-btn-group">
            <button class="macro-bind-btn" id="macro-btn-keyHoldSpam" data-id="keyHoldSpam">${p7TvM3wL(m9TvL2sP.keyHoldSpam)}</button>
            <button class="macro-rst-btn" data-reset="keyHoldSpam" data-i18n="rst">${k3Tr('rst')}</button>
          </div>
        </div>
        <div class="macro-row">
          <span data-i18n="selTxt">${k3Tr('selTxt')}</span>
          <label class="macro-switch">
            <input type="checkbox" id="macro-toggle-seltxt">
            <span class="macro-switch-slider"></span>
          </label>
        </div>
        <div class="macro-sep"></div>
        <div class="macro-section-header"><span data-i18n="secName">${k3Tr('secName')}</span></div>
        ${[
          { id: 'skin', k: 'skinSt' },
          { id: 'name', k: 'nameSt' },
          { id: 'custom', k: 'custSw' }
        ].map(r => `
          <div class="macro-row">
            <span data-i18n="${r.k}">${k3Tr(r.k)}</span>
            <label class="macro-switch">
              <input type="checkbox" id="macro-toggle-${r.id}">
              <span class="macro-switch-slider"></span>
            </label>
          </div>`).join('')}
        <textarea class="macro-textarea" id="macro-custom-nicks" spellcheck="false"></textarea>
        <div class="macro-menu-bind-wrap">
          <button class="macro-menu-bind-btn" id="macro-btn-keyMenu" data-id="keyMenu">${k3Tr('menuBind')}: ${p7TvM3wL(m9TvL2sP.keyMenu)}</button>
          <button class="macro-menu-rst-btn" id="macro-btn-rst-keyMenu" data-i18n="rst">${k3Tr('rst')}</button>
        </div>
        <button class="macro-reset-all-btn" id="macro-btn-all-reset" data-i18n="rstAll">${k3Tr('rstAll')}</button>
        <a href="https://kuksikoid.github.io/gota-multibox-guide/" target="_blank" class="macro-tutorial-btn" data-i18n="tut">${k3Tr('tut')}</a>
          </div>
        </div>
        <div class="macro-pane-settings">
          <div class="macro-settings-body">
          <div class="macro-section-header"><span data-i18n="secIf">${k3Tr('secIf')}</span></div>
          <div class="macro-row">
            <span data-i18n="geo">${k3Tr('geo')}</span>
            <label class="macro-switch">
              <input type="checkbox" id="macro-toggle-plexus">
              <span class="macro-switch-slider"></span>
            </label>
          </div>
          <div class="macro-row">
            <span data-i18n="syncSz">${k3Tr('syncSz')}</span>
            <label class="macro-switch">
              <input type="checkbox" id="macro-toggle-sync-scale">
              <span class="macro-switch-slider"></span>
            </label>
          </div>
          <div class="macro-sep"></div>
          <div class="macro-section-header"><span data-i18n="secCol">${k3Tr('secCol')}</span></div>
          <div class="macro-row">
            <span data-i18n="mCol">${k3Tr('mCol')}</span>
            <button type="button" class="macro-mini-pal" id="macro-pal-menu" data-target="menu" aria-label="Choose menu color"></button>
          </div>
          <div class="macro-row">
            <span data-i18n="bCol">${k3Tr('bCol')}</span>
            <button type="button" class="macro-mini-pal" id="macro-pal-buttons" data-target="buttons" aria-label="Choose buttons and scrollbar color"></button>
          </div>
          <div class="macro-row">
            <span data-i18n="geo">${k3Tr('geo')}</span>
            <button type="button" class="macro-mini-pal" id="macro-pal-plexus" data-target="plexus" aria-label="Choose geometric effect color"></button>
          </div>
          <div class="macro-sep"></div>
          <div class="macro-section-header"><span data-i18n="secLang">${k3Tr('secLang')}</span></div>
          <div class="macro-row macro-lang-row">
              <span data-i18n="lang">${k3Tr('lang')}</span>
              <button type="button" class="macro-lang-btn" id="macro-lang-btn">
                <span class="macro-lang-cur" id="macro-lang-cur">${curLangObj.name} (${curLangObj.code.toUpperCase()})</span>
                <svg class="macro-lang-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
              </button>
          </div>
          <div class="macro-lang-pop" id="macro-lang-pop">
            <div class="macro-lang-list" id="macro-lang-list">
              ${t3LangList.map(l => `<button type="button" class="macro-lang-opt${l.code === m9TvL2sP.lang ? ' active' : ''}" data-lang="${l.code}"><span class="macro-lang-bar"></span><span class="macro-lang-name">${l.name}</span><span class="macro-lang-code">${l.code.toUpperCase()}</span></button>`).join('')}
            </div>
          </div>
          <div class="macro-color-pop" id="macro-color-pop">
            <div class="macro-rgb-sv" id="macro-rgb-sv">
              <div class="macro-rgb-cursor" id="macro-rgb-cursor"></div>
            </div>
            <div class="macro-rgb-hue" id="macro-rgb-hue">
              <div class="macro-rgb-hue-thumb" id="macro-rgb-hue-thumb"></div>
            </div>
            <div class="macro-rgb-footer">
              <input type="text" class="macro-rgb-hex" id="macro-rgb-hex" maxlength="7" spellcheck="false">
              <input type="text" class="macro-rgb-val" id="macro-rgb-val" maxlength="22" spellcheck="false">
              <button type="button" class="macro-rgb-rst" id="macro-rgb-rst" data-i18n="rst">${k3Tr('rst')}</button>
            </div>
          </div>
          </div>
        </div>
      </div>
      ${['nw', 'ne', 'sw', 'se'].map(d => `<div class="macro-resizer macro-resizer-${d}" data-dir="${d}"></div>`).join('')}
    `;
    const g9QmV3xR = win.querySelector('.macro-win-stage');
    const c1XnL4vP = document.createElement('canvas');
    c1XnL4vP.id = 'macro-plexus-canvas';
    g9QmV3xR.insertBefore(c1XnL4vP, g9QmV3xR.firstChild);
    document.body.appendChild(win);
    f4KzP9wL(win);
    win.querySelectorAll('input:not([type="checkbox"]), textarea').forEach(b3EdBind);
    ['keydown', 'keyup', 'keypress', 'copy', 'cut', 'paste', 'selectstart', 'contextmenu'].forEach(ev => {
      win.addEventListener(ev, e => {
        if (!v7QzP2wM && q5IsEdit(e.target)) e.stopPropagation();
      }, false);
    });
    win.addEventListener('click', e => {
      const t = e.target && e.target.nodeType === 1 ? e.target : (e.target && e.target.parentElement);
      const b = t && t.closest ? t.closest('button, [role="button"], a') : null;
      if (b) b.blur();
    });

    const tMap = document.getElementById('macro-toggle-map-bg');
    const tFix = document.getElementById('macro-toggle-fixed-bg');
    const rMap = document.getElementById('macro-row-map-bg');

    function f4RefocusGame() {
      const cv = t8VwM4xK();
      if (cv && cv.focus) cv.focus();
    }

    if (tMap) {
      tMap.addEventListener('change', e => {
        m9TvL2sP.mapBgEnabled = e.target.checked;
        x3QnK8wR();
        e.target.blur();
        f4RefocusGame();
        if (b7DrawFn) b7DrawFn();
      });
    }
    if (tFix) {
      tFix.addEventListener('change', e => {
        const on = e.target.checked;
        m9TvL2sP.fixedBackgroundEnabled = on;
        if (rMap) rMap.classList.toggle('macro-row-disabled', on);
        x3QnK8wR();
        e.target.blur();
        f4RefocusGame();
        if (b7DrawFn) b7DrawFn();
      });
    }

    function w4XnK(pfx, sFn, kToggle, kSrc, dbKey) {
      const bF = document.getElementById('macro-btn-' + pfx + '-file');
      const bU = document.getElementById('macro-btn-' + pfx + '-url');
      const bR = document.getElementById('macro-btn-' + pfx + '-rst');
      const fIn = document.createElement('input');
      fIn.type = 'file'; fIn.accept = 'image/*,video/*'; fIn.style.display = 'none';
      win.appendChild(fIn);
      let pUrl = null;
      if (bF) {
        bF.addEventListener('click', e => {
          e.stopPropagation();
          bF.blur();
          fIn.value = '';
          fIn.click();
        });
      }
      fIn.addEventListener('change', () => {
        fIn.blur();
        if (!fIn.files || !fIn.files[0]) { f4RefocusGame(); return; }
        const fl = fIn.files[0];
        if (pUrl) { try { URL.revokeObjectURL(pUrl.split('#')[0]); } catch (_) {} pUrl = null; }
        const isVid = fl.type.startsWith('video/') || /\.(mp4|webm|ogg|mov|m4v)$/i.test(fl.name);
        pUrl = URL.createObjectURL(fl) + (isVid ? '#type=video' : '#type=image');
        m9TvL2sP[kSrc] = 'idb:' + dbKey;
        m9TvL2sP[kToggle] = true;
        x3QnK8wR();
        k2DbPut(dbKey, fl, isVid);
        if (typeof sFn === 'function') sFn(pUrl);
        r8QnM4tL();
        f4RefocusGame();
      });
      if (bU) {
        bU.addEventListener('click', e => {
          e.stopPropagation();
          bU.blur();
          const u = prompt(k3Tr('promptUrl'));
          if (u && u.trim()) {
            const val = u.trim();
            if (pUrl) { try { URL.revokeObjectURL(pUrl.split('#')[0]); pUrl = null; } catch (_) {} }
            k2DbDel(dbKey);
            m9TvL2sP[kSrc] = val;
            m9TvL2sP[kToggle] = true;
            x3QnK8wR();
            if (typeof sFn === 'function') sFn(val);
            r8QnM4tL();
          }
          f4RefocusGame();
        });
      }
      if (bR) {
        bR.addEventListener('click', e => {
          e.stopPropagation();
          bR.blur();
          if (pUrl) { try { URL.revokeObjectURL(pUrl.split('#')[0]); pUrl = null; } catch (_) {} }
          k2DbDel(dbKey);
          m9TvL2sP[kSrc] = null;
          m9TvL2sP[kToggle] = false;
          x3QnK8wR();
          if (typeof sFn === 'function') sFn(null);
          r8QnM4tL();
          f4RefocusGame();
        });
      }
    }
    w4XnK('map', window.setMapBackground, 'mapBgEnabled', 'mapBgSrc', 'map');
    w4XnK('fixed', window.setFixedBackground, 'fixedBackgroundEnabled', 'fixedBgSrc', 'fixed');

    const b7NmQ2xL = win.querySelector('.macro-win-body');
    const t9VpL4wK = document.createElement('div');
    t9VpL4wK.className = 'macro-custom-scroll-track';
    const d3XnK8vP = document.createElement('div');
    d3XnK8vP.className = 'macro-custom-scroll-thumb';
    t9VpL4wK.appendChild(d3XnK8vP);
    win.querySelector('.macro-pane-main').appendChild(t9VpL4wK);

    function u4PwM8xQ() {
      const cH = b7NmQ2xL.clientHeight, sH = b7NmQ2xL.scrollHeight;
      if (sH - cH <= 4) {
        t9VpL4wK.style.display = 'none';
        b7NmQ2xL.scrollTop = 0;
        return;
      }
      t9VpL4wK.style.display = 'block';
      const tH = t9VpL4wK.offsetHeight;
      const thH = Math.max(22, Math.round((cH / sH) * tH));
      const mSt = sH - cH, mTp = tH - thH;
      if (mTp <= 0 || mSt <= 0) {
        t9VpL4wK.style.display = 'none';
        return;
      }
      d3XnK8vP.style.height = thH + 'px';
      d3XnK8vP.style.top = Math.round((b7NmQ2xL.scrollTop / mSt) * mTp) + 'px';
    }

    b7NmQ2xL.addEventListener('scroll', u4PwM8xQ, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(u4PwM8xQ).observe(b7NmQ2xL);

    let g8WpT3xN = false, k1LvQ5xM = 0, z6NtP9wR = 0;
    function startScrollDrag(e) {
      g8WpT3xN = true;
      k1LvQ5xM = e.clientY;
      z6NtP9wR = b7NmQ2xL.scrollTop;
      d3XnK8vP.classList.add('dragging');
      try { t9VpL4wK.setPointerCapture(e.pointerId); } catch (_) {}
    }

    t9VpL4wK.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      if (e.target !== d3XnK8vP) {
        const r = t9VpL4wK.getBoundingClientRect(), tH = t9VpL4wK.offsetHeight, thH = d3XnK8vP.offsetHeight;
        const mTp = tH - thH, mSt = b7NmQ2xL.scrollHeight - b7NmQ2xL.clientHeight;
        if (mTp > 0) b7NmQ2xL.scrollTop = (((e.clientY - r.top) - thH * 0.5) / mTp) * mSt;
      }
      startScrollDrag(e);
    });

    t9VpL4wK.addEventListener('pointermove', e => {
      if (!g8WpT3xN) return;
      e.preventDefault();
      e.stopPropagation();
      const tH = t9VpL4wK.offsetHeight, thH = d3XnK8vP.offsetHeight;
      const mTp = tH - thH, mSt = b7NmQ2xL.scrollHeight - b7NmQ2xL.clientHeight;
      if (mTp <= 0) return;
      b7NmQ2xL.scrollTop = z6NtP9wR + ((e.clientY - k1LvQ5xM) / mTp) * mSt;
    });

    const s4KzM7vW = e => {
      if (g8WpT3xN) {
        g8WpT3xN = false;
        d3XnK8vP.classList.remove('dragging');
        if (e && e.pointerId !== undefined) {
          try { t9VpL4wK.releasePointerCapture(e.pointerId); } catch (_) {}
        }
      }
    };
    t9VpL4wK.addEventListener('pointerup', s4KzM7vW);
    t9VpL4wK.addEventListener('pointercancel', s4KzM7vW);
    window.addEventListener('blur', s4KzM7vW);

    const s7BodyQ = win.querySelector('.macro-settings-body');
    const s7PaneQ = win.querySelector('.macro-pane-settings');
    const s7Trk = document.createElement('div');
    s7Trk.className = 'macro-custom-scroll-track';
    s7Trk.style.width = '1.15em';
    const s7Thm = document.createElement('div');
    s7Thm.className = 'macro-custom-scroll-thumb';
    s7Trk.appendChild(s7Thm);
    if (s7PaneQ) s7PaneQ.appendChild(s7Trk);

    function u4PwS8mQ() {
      if (!s7BodyQ) return;
      const cH = s7BodyQ.clientHeight, sH = s7BodyQ.scrollHeight;
      if (sH - cH <= 4) {
        s7Trk.style.display = 'none';
        s7BodyQ.scrollTop = 0;
        return;
      }
      s7Trk.style.display = 'block';
      const tH = s7Trk.offsetHeight;
      const thH = Math.max(22, Math.round((cH / sH) * tH));
      const mSt = sH - cH, mTp = tH - thH;
      if (mTp <= 0 || mSt <= 0) {
        s7Trk.style.display = 'none';
        return;
      }
      s7Thm.style.height = thH + 'px';
      s7Thm.style.top = Math.round((s7BodyQ.scrollTop / mSt) * mTp) + 'px';
    }

    if (s7BodyQ) {
      s7BodyQ.addEventListener('scroll', u4PwS8mQ, { passive: true });
      if (window.ResizeObserver) new ResizeObserver(u4PwS8mQ).observe(s7BodyQ);
      let s7Drg = false, s7SY = 0, s7ST = 0;
      s7Trk.addEventListener('pointerdown', e => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        if (e.target !== s7Thm) {
          const r = s7Trk.getBoundingClientRect(), tH = s7Trk.offsetHeight, thH = s7Thm.offsetHeight;
          const mTp = tH - thH, mSt = s7BodyQ.scrollHeight - s7BodyQ.clientHeight;
          if (mTp > 0) s7BodyQ.scrollTop = (((e.clientY - r.top) - thH * 0.5) / mTp) * mSt;
        }
        s7Drg = true; s7SY = e.clientY; s7ST = s7BodyQ.scrollTop;
        s7Thm.classList.add('dragging');
        try { s7Trk.setPointerCapture(e.pointerId); } catch (_) {}
      });
      s7Trk.addEventListener('pointermove', e => {
        if (!s7Drg) return;
        e.preventDefault();
        e.stopPropagation();
        const tH = s7Trk.offsetHeight, thH = s7Thm.offsetHeight;
        const mTp = tH - thH, mSt = s7BodyQ.scrollHeight - s7BodyQ.clientHeight;
        if (mTp <= 0) return;
        s7BodyQ.scrollTop = s7ST + ((e.clientY - s7SY) / mTp) * mSt;
      });
      const s7End = e => {
        if (s7Drg) {
          s7Drg = false;
          s7Thm.classList.remove('dragging');
          if (e && e.pointerId !== undefined) {
            try { s7Trk.releasePointerCapture(e.pointerId); } catch (_) {}
          }
        }
      };
      s7Trk.addEventListener('pointerup', s7End);
      s7Trk.addEventListener('pointercancel', s7End);
      window.addEventListener('blur', s7End);
    }

    win.addEventListener('wheel', e => { if (win.classList.contains('open')) e.stopPropagation(); }, { passive: true });

    b2WzL7vP(document.getElementById('macro-track-solo'), m9TvL2sP.soloDelay);
    b2WzL7vP(document.getElementById('macro-track-auto'), m9TvL2sP.autoDelay);
    r8QnM4tL();

    let pDrag = false, pMov = false, pSX = 0, pSY = 0, pIL = 0, pIT = 0;
    pill.addEventListener('mousedown', e => {
      if (e.button !== 0) return;
      pDrag = true; pMov = false; pSX = e.clientX; pSY = e.clientY;
      const r = pill.getBoundingClientRect(); pIL = r.left; pIT = r.top;
    });

    window.addEventListener('mousemove', e => {
      if (!pDrag) return;
      const dx = e.clientX - pSX, dy = e.clientY - pSY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) pMov = true;
      if (!pMov) return;
      const vpW = document.documentElement.clientWidth || window.innerWidth;
      const vpH = document.documentElement.clientHeight || window.innerHeight;
      let nL = pIL + dx, nT = pIT + dy;
      const mxL = Math.max(0, vpW - pill.offsetWidth), mxT = Math.max(0, vpH - pill.offsetHeight);
      const finL = Math.max(0, Math.min(mxL, nL < 8 ? 0 : (nL > mxL - 8 ? mxL : nL)));
      const finT = Math.max(0, Math.min(mxT, nT < 8 ? 0 : (nT > mxT - 8 ? mxT : nT)));
      pill.style.left = finL + 'px';
      pill.style.top = finT + 'px';
      pill.style.right = 'auto'; pill.style.bottom = 'auto';
      m9TvL2sP.pillX = finL; m9TvL2sP.pillY = finT;
      v6WpL2sT(pill);
    });

    const endPillDrag = () => {
      if (pDrag) {
        pDrag = false;
        if (pMov) { m9TvL2sP.pillX = pill.offsetLeft; m9TvL2sP.pillY = pill.offsetTop; x3QnK8wR(); }
      }
    };
    window.addEventListener('mouseup', endPillDrag);
    window.addEventListener('blur', endPillDrag);

    pill.addEventListener('click', e => { if (pMov) { e.stopImmediatePropagation(); return; } h2QzP8sT(); });
    window.addEventListener('resize', () => { v6WpL2sT(pill); f4KzP9wL(win); });

    let wDrag = false, wOX = 0, wOY = 0;
    const wHdr = win.querySelector('.macro-win-header');
    wHdr.addEventListener('mousedown', e => {
      if (e.button !== 0 || (e.target && e.target.closest && e.target.closest('#macro-settings-btn'))) return;
      wDrag = true; wHdr.classList.add('dragging');
      const r = win.getBoundingClientRect();
      win.style.left = r.left + 'px';
      win.style.right = 'auto';
      wOX = e.clientX - r.left; wOY = e.clientY - r.top;
    });

    window.addEventListener('mousemove', e => {
      if (!wDrag) return;
      const vpW = document.documentElement.clientWidth || window.innerWidth;
      const vpH = document.documentElement.clientHeight || window.innerHeight;
      let x = e.clientX - wOX, y = e.clientY - wOY;
      const mxL = Math.max(0, vpW - win.offsetWidth), mxT = Math.max(0, vpH - win.offsetHeight);
      const finL = Math.max(0, Math.min(mxL, x < 10 ? 0 : (x > mxL - 10 ? mxL : x)));
      const finT = Math.max(0, Math.min(mxT, y < 10 ? 0 : (y > mxT - 10 ? mxT : y)));
      if (finL >= mxL - 10) {
        win.style.left = 'auto';
        win.style.right = '0px';
      } else {
        win.style.left = finL + 'px';
        win.style.right = 'auto';
      }
      win.style.top = finT + 'px';
      win.style.bottom = 'auto';
      qM7wK2vP(win);
    });

    const endWinDrag = () => {
      if (wDrag) {
        wDrag = false; wHdr.classList.remove('dragging');
        const vpW = document.documentElement.clientWidth || window.innerWidth;
        m9TvL2sP.winX = win.style.right === '0px' ? Math.max(0, vpW - win.offsetWidth) : win.offsetLeft;
        m9TvL2sP.winY = win.offsetTop;
        x3QnK8wR();
      }
    };
    window.addEventListener('mouseup', endWinDrag);
    window.addEventListener('blur', endWinDrag);

    let aRsz = null, rSX = 0, rSY = 0, rSW = 0, rSH = 0, rSL = 0, rST = 0;
    win.querySelectorAll('.macro-resizer').forEach(el => {
      el.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        e.preventDefault(); e.stopPropagation();
        const r = win.getBoundingClientRect();
        win.style.left = r.left + 'px'; win.style.top = r.top + 'px'; win.style.right = 'auto'; win.style.bottom = 'auto';
        aRsz = el.getAttribute('data-dir');
        rSX = e.clientX; rSY = e.clientY; rSW = r.width; rSH = r.height; rSL = r.left; rST = r.top;
      });
    });

    window.addEventListener('mousemove', e => {
      if (!aRsz) return;
      const vpW = document.documentElement.clientWidth || window.innerWidth;
      const vpH = document.documentElement.clientHeight || window.innerHeight;
      const dx = e.clientX - rSX, dy = e.clientY - rSY;
      let nW = rSW, nH = rSH, nL = rSL, nT = rST;
      if (aRsz.includes('e')) {
        nW = Math.max(Math.min(280, vpW), Math.min(vpW - rSL, rSW + dx));
      }
      if (aRsz.includes('s')) {
        nH = Math.max(Math.min(320, vpH), Math.min(vpH - rST, rSH + dy));
      }
      if (aRsz.includes('w')) {
        const minW = Math.min(280, vpW);
        const mxW = Math.min(rSL + rSW, vpW);
        nW = Math.max(minW, Math.min(mxW, rSW - dx));
        nL = Math.max(0, rSL + (rSW - nW));
      }
      if (aRsz.includes('n')) {
        const minH = Math.min(320, vpH);
        const mxH = Math.min(rST + rSH, vpH);
        nH = Math.max(minH, Math.min(mxH, rSH - dy));
        nT = Math.max(0, rST + (rSH - nH));
      }
      nW = Math.min(vpW, nW);
      nH = Math.min(vpH, nH);
      nL = Math.max(0, Math.min(vpW - nW, nL));
      nT = Math.max(0, Math.min(vpH - nH, nT));
      win.style.minWidth = Math.min(280, vpW) + 'px';
      win.style.minHeight = Math.min(320, vpH) + 'px';
      if (nL >= vpW - nW - 6) {
        win.style.left = 'auto';
        win.style.right = '0px';
      } else {
        win.style.left = nL + 'px';
        win.style.right = 'auto';
      }
      win.style.top = nT + 'px'; win.style.width = nW + 'px'; win.style.height = nH + 'px';
      q6VxM4tN(win, nW, nH);
      qM7wK2vP(win);
      u4PwM8xQ();
    });

    const endResize = () => {
      if (aRsz) {
        aRsz = null;
        const vpW = document.documentElement.clientWidth || window.innerWidth;
        m9TvL2sP.winWidth = win.offsetWidth; m9TvL2sP.winHeight = win.offsetHeight;
        m9TvL2sP.winX = win.style.right === '0px' ? Math.max(0, vpW - win.offsetWidth) : win.offsetLeft;
        m9TvL2sP.winY = win.offsetTop;
        x3QnK8wR();
        u4PwM8xQ();
      }
    };
    window.addEventListener('mouseup', endResize);
    window.addEventListener('blur', endResize);

    function rL3vT8mK(tk, inp, key) {
      const fl = tk.querySelector('.macro-slider-fill');
      function app(v, cmt) {
        v = Math.max(50, Math.min(3000, v));
        m9TvL2sP[key] = v; fl.style.width = ((v - 50) / 2950) * 100 + '%'; q2SetVal(inp, v, Boolean(cmt)); x3QnK8wR();
      }
      let sld = false;
      function hM(e) {
        const r = tk.getBoundingClientRect();
        let p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
        app(Math.round(((50 + p * 2950) - 50) / 10) * 10 + 50, false);
      }
      tk.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
        e.preventDefault(); e.stopPropagation();
        sld = true; fl.classList.add('active'); hM(e);
        function onMv(ev) { if (sld) hM(ev); }
        function onUp() {
          sld = false; fl.classList.remove('active');
          window.removeEventListener('mousemove', onMv);
          window.removeEventListener('mouseup', onUp);
          window.removeEventListener('blur', onUp);
          q6CommitVal(inp);
        }
        window.addEventListener('mousemove', onMv);
        window.addEventListener('mouseup', onUp);
        window.addEventListener('blur', onUp);
      });
      inp.addEventListener('input', () => {
        let v = parseInt(inp.value, 10);
        if (!isNaN(v)) { m9TvL2sP[key] = Math.max(50, Math.min(3000, v)); fl.style.width = ((m9TvL2sP[key] - 50) / 2950) * 100 + '%'; x3QnK8wR(); }
      });
      inp.addEventListener('blur', () => {
        let v = parseInt(inp.value, 10);
        app(isNaN(v) ? 800 : v, true);
      });
    }

    function wP2kM7wV(bDec, bInc, inp, tk, key, min = 50, max = 3000, fallback = 800) {
      function step(d) {
        let v = parseInt(inp.value, 10);
        v = Math.max(min, Math.min(max, (isNaN(v) ? fallback : v) + d));
        m9TvL2sP[key] = v; q2SetVal(inp, v, false);
        const fl = tk.querySelector('.macro-slider-fill');
        if (fl) fl.style.width = ((v - min) / (max - min)) * 100 + '%';
        x3QnK8wR();
      }
      function bind(btn, delta) {
        let hT = null, rT = null, act = false;
        function clr() {
          if (hT) clearTimeout(hT);
          if (rT) clearInterval(rT);
          hT = null; rT = null;
          if (act) {
            act = false;
            window.removeEventListener('mouseup', clr);
            window.removeEventListener('blur', clr);
            q6CommitVal(inp, 'step');
          }
        }
        btn.addEventListener('mousedown', e => {
          if (e.button !== 0) return;
          e.preventDefault(); e.stopPropagation();
          clr();
          act = true;
          window.addEventListener('mouseup', clr);
          window.addEventListener('blur', clr);
          step(delta);
          hT = setTimeout(() => { rT = setInterval(() => step(delta), 40); }, 500);
        });
        ['mouseup', 'mouseleave'].forEach(ev => btn.addEventListener(ev, clr));
      }
      if (bDec) bind(bDec, -10);
      if (bInc) bind(bInc, 10);
    }

    ['solo', 'auto'].forEach(k => {
      const prop = k === 'solo' ? 'soloDelay' : 'autoDelay';
      const sNum = document.getElementById('macro-num-' + k), sTrk = document.getElementById('macro-track-' + k);
      rL3vT8mK(sTrk, sNum, prop);
      wP2kM7wV(document.getElementById(`macro-dec-${k}`), document.getElementById(`macro-inc-${k}`), sNum, sTrk, prop);
    });

    const sTrkM = document.getElementById('macro-track-margin'), sNumM = document.getElementById('macro-num-margin');
    if (sTrkM && sNumM) {
      const flM = sTrkM.querySelector('.macro-slider-fill');
      function appM(v, cmt) {
        v = Math.max(30, Math.min(500, v));
        m9TvL2sP.cullMargin = v; flM.style.width = ((v - 30) / 470) * 100 + '%'; q2SetVal(sNumM, v, Boolean(cmt)); x3QnK8wR();
      }
      sTrkM.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        e.preventDefault(); e.stopPropagation();
        function hMM(ev) {
          const r = sTrkM.getBoundingClientRect();
          let p = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width));
          appM(Math.round(((30 + p * 470) - 30) / 10) * 10 + 30, false);
        }
        hMM(e);
        function onMvM(ev) { hMM(ev); }
        function onUpM() {
          window.removeEventListener('mousemove', onMvM);
          window.removeEventListener('mouseup', onUpM);
          window.removeEventListener('blur', onUpM);
          q6CommitVal(sNumM);
        }
        window.addEventListener('mousemove', onMvM);
        window.addEventListener('mouseup', onUpM);
        window.addEventListener('blur', onUpM);
      });
      sNumM.addEventListener('input', () => {
        let v = parseInt(sNumM.value, 10);
        if (!isNaN(v)) { m9TvL2sP.cullMargin = Math.max(30, Math.min(500, v)); flM.style.width = ((m9TvL2sP.cullMargin - 30) / 470) * 100 + '%'; x3QnK8wR(); }
      });
      sNumM.addEventListener('blur', () => {
        let v = parseInt(sNumM.value, 10);
        appM(isNaN(v) ? 120 : v, true);
      });
      wP2kM7wV(document.getElementById('macro-dec-margin'), document.getElementById('macro-inc-margin'), sNumM, sTrkM, 'cullMargin', 30, 500, 120);
    }

    win.querySelectorAll('.macro-split-chip').forEach(ch => {
      ch.addEventListener('click', e => {
        e.stopPropagation(); m9TvL2sP.revSplits = parseInt(ch.getAttribute('data-split'), 10); x3QnK8wR(); r8QnM4tL();
      });
    });

    win.querySelectorAll('.macro-bind-btn, .macro-menu-bind-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        if (Date.now() < z3TvL8xP || v7QzP2wM) return;
        m3TvL9xW(btn.getAttribute('data-id'));
      });
    });

    const mRst = document.getElementById('macro-btn-rst-keyMenu');
    if (mRst) {
      mRst.addEventListener('click', e => {
        e.stopPropagation(); m9TvL2sP.keyMenu = null; x3QnK8wR(); r8QnM4tL();
      });
    }

    win.querySelectorAll('.macro-rst-btn').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const key = btn.getAttribute('data-reset');
        m9TvL2sP[key] = null;
        if (key === 'keyHoldSpam') hCl2xK9m();
        x3QnK8wR(); r8QnM4tL();
      });
    });

    function zN8vR4wL(m, st) {
      m9TvL2sP.skinStealer = false; m9TvL2sP.nameStealer = false; m9TvL2sP.customSwitcher = false;
      if (st) m9TvL2sP[m] = true;
      x3QnK8wR(); r8QnM4tL();
    }

    const tSk = document.getElementById('macro-toggle-skin');
    const tNm = document.getElementById('macro-toggle-name');
    const tCs = document.getElementById('macro-toggle-custom');
    const aNk = document.getElementById('macro-custom-nicks');

    if (tSk) tSk.addEventListener('change', e => { zN8vR4wL('skinStealer', e.target.checked); e.target.blur(); });
    if (tNm) tNm.addEventListener('change', e => { zN8vR4wL('nameStealer', e.target.checked); e.target.blur(); });
    if (tCs) tCs.addEventListener('change', e => { zN8vR4wL('customSwitcher', e.target.checked); e.target.blur(); });

    const tCl = document.getElementById('macro-toggle-culling');
    const tFl = document.getElementById('macro-toggle-filters');
    const tMg = document.getElementById('macro-toggle-margin');

    if (tCl) tCl.addEventListener('change', e => { m9TvL2sP.frustumCulling = e.target.checked; x3QnK8wR(); a2LnQ8vM(); e.target.blur(); });
    if (tFl) tFl.addEventListener('change', e => { m9TvL2sP.stripFilters = e.target.checked; x3QnK8wR(); e.target.blur(); });
    if (tMg) tMg.addEventListener('change', e => { m9TvL2sP.cullMarginToggle = e.target.checked; x3QnK8wR(); a2LnQ8vM(); e.target.blur(); });
    const tSt = document.getElementById('macro-toggle-seltxt');
    if (tSt) tSt.addEventListener('change', e => { m9TvL2sP.selectableText = e.target.checked; x3QnK8wR(); k9SyncTxtMode(); e.target.blur(); });
    const g5LkW8nP = document.getElementById('macro-settings-btn');
    if (g5LkW8nP) {
      g5LkW8nP.addEventListener('mousedown', e => {
        if (e.button === 0) { e.preventDefault(); e.stopPropagation(); }
      });
      g5LkW8nP.addEventListener('click', e => {
        e.stopPropagation();
        win.classList.toggle('settings-open');
        if (!win.classList.contains('settings-open')) {
          c7ClosePal();
          c7CloseLang();
        }
      });
      g5LkW8nP.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          g5LkW8nP.click();
        }
      });
    }
    const t8HzR3mK = document.getElementById('macro-toggle-plexus');
    const v3XpN6qL = document.getElementById('macro-toggle-sync-scale');
    if (t8HzR3mK) {
      t8HzR3mK.addEventListener('change', e => {
        m9TvL2sP.plexusEnabled = e.target.checked;
        x3QnK8wR();
        if (s2NpK7wL) s2NpK7wL();
        e.target.blur();
      });
    }
    if (v3XpN6qL) {
      v3XpN6qL.addEventListener('change', e => {
        m9TvL2sP.syncScale = e.target.checked;
        x3QnK8wR();
        q6VxM4tN(win);
        u4PwM8xQ();
        u4PwS8mQ();
        if (rPop && rPop.classList.contains('open') && z5QpL8wH) j4PosPal(z5QpL8wH);
        if (lPop && lPop.classList.contains('open')) j4PosLang();
        e.target.blur();
      });
    }

    const d5VrP8nK = win.querySelector('#macro-ff-delays');
    const b8MtQ2wL = win.querySelector('#macro-ff-binds');

    function b6VzM2xT(tr, inp, bDec, bInc, ff) {
      const fl = tr.querySelector('.macro-slider-fill');
      function app(v, cmt) {
        v = Math.max(50, Math.min(3000, v));
        ff.delay = v;
        if (fl) fl.style.width = ((v - 50) / 2950) * 100 + '%';
        q2SetVal(inp, v, Boolean(cmt));
        x3QnK8wR();
      }
      function hM(e) {
        const r = tr.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
        app(Math.round(((50 + p * 2950) - 50) / 10) * 10 + 50, false);
      }
      tr.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
        e.preventDefault(); e.stopPropagation();
        hM(e);
        function onMv(ev) { hM(ev); }
        function onUp() {
          window.removeEventListener('mousemove', onMv);
          window.removeEventListener('mouseup', onUp);
          window.removeEventListener('blur', onUp);
          q6CommitVal(inp);
        }
        window.addEventListener('mousemove', onMv);
        window.addEventListener('mouseup', onUp);
        window.addEventListener('blur', onUp);
      });
      inp.addEventListener('input', () => {
        const v = parseInt(inp.value, 10);
        if (!isNaN(v)) {
          ff.delay = Math.max(50, Math.min(3000, v));
          if (fl) fl.style.width = ((ff.delay - 50) / 2950) * 100 + '%';
          x3QnK8wR();
        }
      });
      inp.addEventListener('blur', () => {
        const v = parseInt(inp.value, 10);
        app(isNaN(v) ? 800 : v, true);
      });
      function step(d) {
        const v = parseInt(inp.value, 10);
        app((isNaN(v) ? 800 : v) + d, false);
      }
      function bindStep(btn, delta) {
        let hT = null, rT = null, act = false;
        function clr() {
          if (hT) clearTimeout(hT);
          if (rT) clearInterval(rT);
          hT = null; rT = null;
          if (act) {
            act = false;
            window.removeEventListener('mouseup', clr);
            window.removeEventListener('blur', clr);
            q6CommitVal(inp, 'step');
          }
        }
        btn.addEventListener('mousedown', e => {
          if (e.button !== 0) return;
          e.preventDefault(); e.stopPropagation();
          clr();
          act = true;
          window.addEventListener('mouseup', clr);
          window.addEventListener('blur', clr);
          step(delta);
          hT = setTimeout(() => { rT = setInterval(() => step(delta), 40); }, 500);
        });
        ['mouseup', 'mouseleave'].forEach(ev => btn.addEventListener(ev, clr));
      }
      if (bDec) bindStep(bDec, -10);
      if (bInc) bindStep(bInc, 10);
    }

    function v4NpQ8mL(ff, idx, animate) {
      if (!d5VrP8nK || !b8MtQ2wL) return;
      const num = idx + 2;
      const dWrap = document.createElement('div');
      dWrap.className = 'macro-ff-anim' + (animate ? ' macro-ff-entering' : '');
      dWrap.setAttribute('data-ff-d', idx);
      dWrap.innerHTML = `
        <div class="macro-ff-anim-inner">
          <div class="macro-row">
            <span data-ff-del-lbl="${num}">${k3Tr('ffDelN', num)}</span>
            <div class="macro-controls-group">
              <div class="macro-slider-track" id="macro-track-extraFF_${idx}"><div class="macro-slider-fill"></div></div>
              <div class="macro-num-wrap">
                <button type="button" class="macro-step-btn" id="macro-dec-extraFF_${idx}"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>
                <input type="text" inputmode="numeric" class="macro-num-input" id="macro-num-extraFF_${idx}" data-min="50" data-max="3000" data-step="10" value="${ff.delay}" spellcheck="false">
                <button type="button" class="macro-step-btn" id="macro-inc-extraFF_${idx}"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></button>
              </div>
            </div>
          </div>
        </div>`;
      d5VrP8nK.appendChild(dWrap);
      const tr = dWrap.querySelector('#macro-track-extraFF_' + idx);
      const inp = dWrap.querySelector('#macro-num-extraFF_' + idx);
      const bDec = dWrap.querySelector('#macro-dec-extraFF_' + idx);
      const bInc = dWrap.querySelector('#macro-inc-extraFF_' + idx);
      b2WzL7vP(tr, ff.delay);
      b3EdBind(inp);
      b6VzM2xT(tr, inp, bDec, bInc, ff);

      const bWrap = document.createElement('div');
      bWrap.className = 'macro-ff-anim' + (animate ? ' macro-ff-entering' : '');
      bWrap.setAttribute('data-ff-b', idx);
      bWrap.innerHTML = `
        <div class="macro-ff-anim-inner">
          <div class="macro-row">
            <div class="macro-ff-label-wrap">
              <span data-ff-lbl="${num}">${k3Tr('ff')} ${num}</span>
              <div role="button" tabindex="0" class="macro-ff-del-btn" data-ff-del="${idx}" title="${k3Tr('ffRem')}" aria-label="${k3Tr('ffRem')}" data-i18n-title="ffRem" data-i18n-aria="ffRem"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9"/></svg></div>
            </div>
            <div class="macro-btn-group">
              <button class="macro-bind-btn" id="macro-btn-extraFF_${idx}" data-id="extraFF_${idx}">${p7TvM3wL(ff.key)}</button>
              <button class="macro-rst-btn" data-reset="extraFF_${idx}" data-i18n="rst">${k3Tr('rst')}</button>
            </div>
          </div>
        </div>`;
      b8MtQ2wL.appendChild(bWrap);

      if (animate) {
        dWrap.addEventListener('transitionend', u4PwM8xQ, { once: true });
        k9LwP2xM(() => {
          k9LwP2xM(() => {
            dWrap.classList.remove('macro-ff-entering');
            bWrap.classList.remove('macro-ff-entering');
          });
        });
      }
    }

    function k8QmN3vR() {
      if (!d5VrP8nK || !b8MtQ2wL) return;
      d5VrP8nK.innerHTML = '';
      b8MtQ2wL.innerHTML = '';
      const arr = Array.isArray(m9TvL2sP.extraFastFeeds) ? m9TvL2sP.extraFastFeeds : [];
      for (let i = 0; i < arr.length; i++) v4NpQ8mL(arr[i], i, false);
      u4PwM8xQ();
    }

    const n3RwQ8vT = e => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!d5VrP8nK || !b8MtQ2wL) return;
      if (!Array.isArray(m9TvL2sP.extraFastFeeds)) m9TvL2sP.extraFastFeeds = [];
      const ff = { delay: 800, key: null };
      const idx = m9TvL2sP.extraFastFeeds.length;
      m9TvL2sP.extraFastFeeds.push(ff);
      x3QnK8wR();
      v4NpQ8mL(ff, idx, true);
      u4PwM8xQ();
    };

    const h6XmP4vK = win.querySelector('#macro-ff-add-btn');
    if (h6XmP4vK && !h6XmP4vK.dataset.ffBound) {
      h6XmP4vK.dataset.ffBound = '1';
      h6XmP4vK.addEventListener('mousedown', e => {
        if (e.button === 0) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
      h6XmP4vK.addEventListener('click', e => {
        n3RwQ8vT(e);
        h6XmP4vK.blur();
      });
      h6XmP4vK.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          n3RwQ8vT(e);
        }
      });
    }

    const p9QnV3xL = (del, e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!d5VrP8nK || !b8MtQ2wL) return;
      const idx = parseInt(del.getAttribute('data-ff-del'), 10);
      if (isNaN(idx) || !m9TvL2sP.extraFastFeeds[idx]) return;
      const ffToRemove = m9TvL2sP.extraFastFeeds[idx];
      const dEl = d5VrP8nK.querySelector(`[data-ff-d="${idx}"]`);
      const bEl = b8MtQ2wL.querySelector(`[data-ff-b="${idx}"]`);
      if (dEl && dEl.dataset.del) return;
      if (dEl) { dEl.dataset.del = '1'; dEl.classList.add('macro-ff-leaving'); }
      if (bEl) bEl.classList.add('macro-ff-leaving');
      let zDone = false;
      const wFin = () => {
        if (zDone) return;
        zDone = true;
        const currentIdx = m9TvL2sP.extraFastFeeds.indexOf(ffToRemove);
        if (currentIdx < 0) return;
        const removed = m9TvL2sP.extraFastFeeds.splice(currentIdx, 1);
        if (removed[0]) c6RmP3xW.delete(removed[0]);
        x3QnK8wR();
        k8QmN3vR();
      };
      if (dEl) {
        dEl.addEventListener('transitionend', ev => {
          if (ev.target === dEl && ev.propertyName === 'grid-template-rows') wFin();
        });
      }
      setTimeout(wFin, 230);
    };

    if (b7NmQ2xL && !b7NmQ2xL.dataset.ffBound) {
      b7NmQ2xL.dataset.ffBound = '1';
      const k2XpM7vR = t => (t && t.nodeType === 1 ? t : (t && t.parentElement));
      b7NmQ2xL.addEventListener('mousedown', e => {
        const el = k2XpM7vR(e.target);
        if (e.button === 0 && el && el.closest && el.closest('.macro-ff-del-btn')) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
      b7NmQ2xL.addEventListener('keydown', e => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const el = k2XpM7vR(e.target);
        const del = el && el.closest ? el.closest('.macro-ff-del-btn') : null;
        if (del) p9QnV3xL(del, e);
      });
      b7NmQ2xL.addEventListener('click', e => {
        const el = k2XpM7vR(e.target);
        if (!el || !el.closest) return;
        const del = el.closest('.macro-ff-del-btn');
        if (del) {
          p9QnV3xL(del, e);
          return;
        }
        const bBtn = el.closest('#macro-ff-binds .macro-bind-btn');
        if (bBtn) {
          e.stopPropagation();
          if (Date.now() < z3TvL8xP || v7QzP2wM) return;
          m3TvL9xW(bBtn.getAttribute('data-id'));
          return;
        }
        const rBtn = el.closest('#macro-ff-binds .macro-rst-btn');
        if (rBtn) {
          e.stopPropagation();
          const key = rBtn.getAttribute('data-reset');
          if (key && key.startsWith('extraFF_')) {
            const idx = parseInt(key.slice(8), 10);
            if (m9TvL2sP.extraFastFeeds[idx]) m9TvL2sP.extraFastFeeds[idx].key = null;
            x3QnK8wR();
            r8QnM4tL();
          }
        }
      });
    }

    k8QmN3vR();

    function q3XmR7kB(hex) {
      if (typeof hex !== 'string' || !/^#[0-9a-f]{6}$/i.test(hex)) return null;
      return [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];
    }

    function u7NxV4mK(r, g, b) {
      const h = n => Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, '0');
      return '#' + h(r) + h(g) + h(b);
    }

    function h4KmN2vP(h, s, v) {
      const c = v * s;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = v - c;
      let r = 0, g = 0, b = 0;
      if (h < 60) { r = c; g = x; }
      else if (h < 120) { r = x; g = c; }
      else if (h < 180) { g = c; b = x; }
      else if (h < 240) { g = x; b = c; }
      else if (h < 300) { r = x; b = c; }
      else { r = c; b = x; }
      return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
    }

    function r6TxL9wN(r, g, b) {
      r /= 255; g /= 255; b /= 255;
      const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
      let h = 0;
      if (d > 1e-6) {
        if (mx === r) h = 60 * (((g - b) / d) % 6);
        else if (mx === g) h = 60 * ((b - r) / d + 2);
        else h = 60 * ((r - g) / d + 4);
      }
      if (h < 0) h += 360;
      return [h, mx === 0 ? 0 : d / mx, mx];
    }

    let z5QpL8wH = null;
    let f8TmK2sV = [0, 0, 0.08];

    const pSet = win.querySelector('.macro-settings-body');
    const rPop = document.getElementById('macro-color-pop');

    const rSv = document.getElementById('macro-rgb-sv');
    const rCur = document.getElementById('macro-rgb-cursor');
    const rHue = document.getElementById('macro-rgb-hue');
    const rHThumb = document.getElementById('macro-rgb-hue-thumb');
    const rHex = document.getElementById('macro-rgb-hex');
    const rRgb = document.getElementById('macro-rgb-val');
    const rRst = document.getElementById('macro-rgb-rst');
    if (rRst) rRst.setAttribute('data-i18n', 'rst');
    const palMenu = document.getElementById('macro-pal-menu');
    const palBtns = document.getElementById('macro-pal-buttons');
    const palPlex = document.getElementById('macro-pal-plexus');
    const dMap = { menu: '#141414', buttons: '#242424', plexus: '#ffffff' };

    function d8KpW4mR() {
      const mc = q3XmR7kB(m9TvL2sP.menuColor);
      if (mc) {
        const [r, g, b] = mc;
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const lt = lum > 155;
        const hr = Math.round(r * 0.78), hg = Math.round(g * 0.78), hb = Math.round(b * 0.78);
        const brd = lt ? 'rgba(0,0,0,0.22)' : `rgb(${Math.min(255, r + 32)},${Math.min(255, g + 32)},${Math.min(255, b + 32)})`;
        win.style.setProperty('--macro-win-bg', `rgba(${r},${g},${b},0.97)`);
        win.style.setProperty('--macro-hdr-bg', `rgb(${hr},${hg},${hb})`);
        win.style.setProperty('--macro-hdr-border', lt ? 'rgba(0,0,0,0.14)' : 'rgba(255,255,255,0.1)');
        win.style.setProperty('--macro-border', brd);
        win.style.setProperty('--macro-text', lt ? '#151515' : '#ddd');
        win.style.setProperty('--macro-title-color', lt ? '#0a0a0a' : '#fff');
        win.style.setProperty('--macro-muted-text', lt ? '#3a3f45' : '#9aa0a6');
        win.style.setProperty('--macro-sep', lt ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)');
        win.style.setProperty('--macro-pal-glow', lt ? 'none' : '0 0 8px rgba(255,255,255,0.28)');
        win.style.setProperty('--macro-accent', lt ? '#18181b' : '#f2f2f4');
        win.style.setProperty('--macro-accent-text', lt ? '#ffffff' : '#111114');
        win.style.setProperty('--macro-accent-muted', lt ? 'rgba(0,0,0,0.42)' : 'rgba(255,255,255,0.48)');
        win.style.setProperty('--macro-sw-on-bg', lt ? '#27272c' : '#3c3c42');
        win.style.setProperty('--macro-sw-on-brd', lt ? '#121216' : '#787882');
        win.style.setProperty('--macro-sw-on-knob', '#ffffff');
        win.style.setProperty('--macro-opt-act-bg', lt ? 'rgba(0,0,0,0.09)' : 'rgba(255,255,255,0.1)');
        const lr = lt ? Math.round(r * 0.94) : (lum < 35 ? Math.min(255, r + 5) : Math.round(r * 0.91));
        const lg = lt ? Math.round(g * 0.94) : (lum < 35 ? Math.min(255, g + 5) : Math.round(g * 0.91));
        const lb = lt ? Math.round(b * 0.94) : (lum < 35 ? Math.min(255, b + 5) : Math.round(b * 0.91));
        win.style.setProperty('--macro-lang-bg', `rgba(${lr},${lg},${lb},0.98)`);
        pill.style.setProperty('--macro-border', brd);
        pill.style.background = `rgb(${hr},${hg},${hb})`;
        pill.style.color = lt ? '#0a0a0a' : '#eee';
      } else {
        ['--macro-win-bg', '--macro-hdr-bg', '--macro-hdr-border', '--macro-border', '--macro-text', '--macro-title-color', '--macro-muted-text', '--macro-sep', '--macro-pal-glow', '--macro-accent', '--macro-accent-text', '--macro-accent-muted', '--macro-sw-on-bg', '--macro-sw-on-brd', '--macro-sw-on-knob', '--macro-opt-act-bg', '--macro-lang-bg'].forEach(p => win.style.removeProperty(p));
        pill.style.removeProperty('--macro-border');
        pill.style.background = '';
        pill.style.color = '';
      }
      qM7wK2vP(win);
      v6WpL2sT(pill);

      const bc = q3XmR7kB(m9TvL2sP.buttonsColor);
      if (bc) {
        const [r, g, b] = bc;
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const lt = lum > 155;
        const sr = Math.round(r * 0.78), sg = Math.round(g * 0.78), sb = Math.round(b * 0.78);
        const hvr = lt ? Math.round(r * 0.85) : Math.min(255, r + 28);
        const hvg = lt ? Math.round(g * 0.85) : Math.min(255, g + 28);
        const hvb = lt ? Math.round(b * 0.85) : Math.min(255, b + 28);
        const bBrd = lt ? 'rgba(0,0,0,0.24)' : `rgb(${Math.min(255, r + 28)},${Math.min(255, g + 28)},${Math.min(255, b + 28)})`;
        win.style.setProperty('--macro-btn-bg', `rgb(${r},${g},${b})`);
        win.style.setProperty('--macro-btn-bg-sub', `rgb(${sr},${sg},${sb})`);
        win.style.setProperty('--macro-btn-border', bBrd);
        win.style.setProperty('--macro-btn-text', lt ? '#141414' : '#eeeeee');
        win.style.setProperty('--macro-btn-muted', lt ? '#2e3338' : '#c0c6cc');
        win.style.setProperty('--macro-btn-reset-text', lt ? '#7f1d1d' : '#ff9898');
        win.style.setProperty('--macro-btn-tut-text', lt ? '#0f172a' : '#8ac6ff');
        win.style.setProperty('--macro-slider-fill', lt ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.28)');
        win.style.setProperty('--macro-scroll-thumb', `rgb(${r},${g},${b})`);
        win.style.setProperty('--macro-scroll-hover', `rgb(${hvr},${hvg},${hvb})`);
        const isBluish = b > r + 40 && b > g + 30;
        win.style.setProperty('--macro-sel-bg', isBluish ? 'rgba(255,255,255,0.36)' : (lt ? 'rgba(37,99,235,0.36)' : 'rgba(56,152,236,0.52)'));
        win.style.setProperty('--macro-sel-fg', lt ? '#0a0a0a' : '#ffffff');
      } else {
        ['--macro-btn-bg', '--macro-btn-bg-sub', '--macro-btn-border', '--macro-btn-text', '--macro-btn-muted', '--macro-btn-reset-text', '--macro-btn-tut-text', '--macro-slider-fill', '--macro-scroll-thumb', '--macro-scroll-hover', '--macro-sel-bg', '--macro-sel-fg'].forEach(p => win.style.removeProperty(p));
      }

      const pc = q3XmR7kB(m9TvL2sP.plexusColor);
      if (pc) {
        const [r, g, b] = pc;
        const dr = Math.min(255, Math.round(r + (255 - r) * 0.45));
        const dg = Math.min(255, Math.round(g + (255 - g) * 0.45));
        const db = Math.min(255, Math.round(b + (255 - b) * 0.45));
        const tr = Math.round(r * 0.78), tg = Math.round(g * 0.78), tb = Math.round(b * 0.78);
        g3VxL8mQ = [`${dr},${dg},${db}`, `${r},${g},${b}`, `${tr},${tg},${tb}`];
      } else {
        g3VxL8mQ = ['255,255,255', '225,225,225', '185,185,185'];
      }
    }

    function g2CurrentHex(t) {
      if (t === 'menu') return m9TvL2sP.menuColor || dMap.menu;
      if (t === 'buttons') return m9TvL2sP.buttonsColor || dMap.buttons;
      return m9TvL2sP.plexusColor || dMap.plexus;
    }

    function j4PosPal(tgt) {
      if (!rPop || !pSet) return;
      const btn = win.querySelector(`.macro-mini-pal[data-target="${tgt}"]`);
      if (!btn) return;
      const pRect = pSet.getBoundingClientRect();
      const bRect = btn.getBoundingClientRect();
      const fz = parseFloat(getComputedStyle(win).fontSize) || 12;
      const popW = rPop.offsetWidth || Math.round(19.2 * fz);
      const popH = rPop.offsetHeight || Math.round(16.2 * fz);
      const gap = Math.max(6, Math.round(0.55 * fz));
      const left = Math.max(6, Math.round((bRect.left - pRect.left) - popW - gap));
      const rawTop = Math.round((bRect.top - pRect.top) + pSet.scrollTop - Math.round(0.25 * fz));
      const minTop = pSet.scrollTop + 6;
      const maxTop = pSet.scrollTop + Math.max(6, pSet.clientHeight - popH - 6);
      const top = Math.max(minTop, Math.min(maxTop, rawTop));
      rPop.style.left = left + 'px';
      rPop.style.top = top + 'px';
      rPop.style.right = 'auto';
      rPop.style.bottom = 'auto';
    }

    const v8PalHist = { menu: {}, buttons: {}, plexus: {} };

    function y2SwapPalEd(tgt) {
      const sl = v8PalHist[tgt] || (v8PalHist[tgt] = {});
      const hex = g2CurrentHex(tgt).toUpperCase();
      const rgb = q3XmR7kB(hex) || [20, 20, 20];
      const rStr = `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`;
      if (rHex) {
        if (!sl.hex) {
          rHex.value = hex;
          sl.hex = g8MkEdSt(rHex);
        }
        k9EdMap.set(rHex, sl.hex);
        rHex.value = sl.hex.stk[sl.hex.idx].v;
      }
      if (rRgb) {
        if (!sl.rgb) {
          rRgb.value = rStr;
          sl.rgb = g8MkEdSt(rRgb);
        }
        k9EdMap.set(rRgb, sl.rgb);
        rRgb.value = sl.rgb.stk[sl.rgb.idx].v;
      }
    }

    function p2NmQ6xK(cmt = true) {
      if (palMenu) {
        if (m9TvL2sP.menuColor) palMenu.style.setProperty('background', m9TvL2sP.menuColor, 'important');
        else palMenu.style.removeProperty('background');
      }
      if (palBtns) {
        if (m9TvL2sP.buttonsColor) palBtns.style.setProperty('background', m9TvL2sP.buttonsColor, 'important');
        else palBtns.style.removeProperty('background');
      }
      if (palPlex) {
        if (m9TvL2sP.plexusColor) palPlex.style.setProperty('background', m9TvL2sP.plexusColor, 'important');
        else palPlex.style.removeProperty('background');
      }

      const tgt = z5QpL8wH || 'menu';
      const activeHex = g2CurrentHex(tgt);
      const rgb = q3XmR7kB(activeHex) || [20, 20, 20];
      if (rHex && document.activeElement !== rHex) q2SetVal(rHex, activeHex.toUpperCase(), cmt);
      if (rRgb && document.activeElement !== rRgb) q2SetVal(rRgb, `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`, cmt);
      if (rSv) rSv.style.backgroundColor = `hsl(${f8TmK2sV[0]},100%,50%)`;
      if (rCur) {
        rCur.style.left = (f8TmK2sV[1] * 100) + '%';
        rCur.style.top = ((1 - f8TmK2sV[2]) * 100) + '%';
      }
      if (rHThumb) rHThumb.style.left = ((f8TmK2sV[0] / 360) * 100) + '%';
    }

    w9LpT5vN = function () {
      if (z5QpL8wH) {
        const rgb = q3XmR7kB(g2CurrentHex(z5QpL8wH));
        if (rgb) f8TmK2sV = r6TxL9wN(rgb[0], rgb[1], rgb[2]);
      }
      d8KpW4mR();
      p2NmQ6xK(true);
    };

    function l3WvN9xR(save) {
      if (!z5QpL8wH) return;
      const [r, g, b] = h4KmN2vP(f8TmK2sV[0], f8TmK2sV[1], f8TmK2sV[2]);
      const hex = u7NxV4mK(r, g, b);
      if (z5QpL8wH === 'menu') m9TvL2sP.menuColor = hex;
      else if (z5QpL8wH === 'buttons') m9TvL2sP.buttonsColor = hex;
      else m9TvL2sP.plexusColor = hex;
      d8KpW4mR();
      p2NmQ6xK(save);
      if (save) x3QnK8wR();
    }

    let palHideT = 0;

    function c7OpenPal(tgt) {
      if (palHideT) { clearTimeout(palHideT); palHideT = 0; }
      c7CloseLang(true);
      z5QpL8wH = tgt;
      const rgb = q3XmR7kB(g2CurrentHex(tgt));
      if (rgb) f8TmK2sV = r6TxL9wN(rgb[0], rgb[1], rgb[2]);
      y2SwapPalEd(tgt);
      if (pSet) pSet.classList.add('macro-pal-dim');
      win.querySelectorAll('.macro-settings-body .macro-row').forEach(rw => rw.classList.remove('macro-pal-active'));
      win.querySelectorAll('.macro-mini-pal').forEach(b => {
        const on = b.getAttribute('data-target') === tgt;
        b.classList.toggle('active', on);
        const rw = b.closest('.macro-row');
        if (rw) rw.classList.toggle('macro-pal-active', on);
      });
      if (rPop) {
        rPop.style.display = 'flex';
        j4PosPal(tgt);
        void rPop.offsetWidth;
      }
      p2NmQ6xK(true);
      if (rPop) rPop.classList.add('open');
      u4PwS8mQ();
    }

    function c7ClosePal(instant) {
      if (palHideT) { clearTimeout(palHideT); palHideT = 0; }
      z5QpL8wH = null;
      if (pSet && !(lPop && lPop.classList.contains('open'))) pSet.classList.remove('macro-pal-dim');
      win.querySelectorAll('.macro-mini-pal').forEach(b => {
        b.classList.remove('active');
        const rw = b.closest('.macro-row');
        if (rw) rw.classList.remove('macro-pal-active');
      });
      if (rPop) {
        rPop.classList.remove('open');
        if (instant) {
          rPop.style.display = 'none';
          u4PwS8mQ();
        } else {
          palHideT = setTimeout(() => {
            palHideT = 0;
            if (rPop && !rPop.classList.contains('open')) {
              rPop.style.display = 'none';
              u4PwS8mQ();
            }
          }, 210);
        }
      }
      p2NmQ6xK();
    }

    win.querySelectorAll('.macro-mini-pal').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const tgt = btn.getAttribute('data-target');
        if (rPop && rPop.classList.contains('open') && z5QpL8wH === tgt) c7ClosePal();
        else c7OpenPal(tgt);
      });
    });

    if (window.ResizeObserver && pSet) {
      new ResizeObserver(() => {
        if (rPop && rPop.classList.contains('open') && z5QpL8wH) j4PosPal(z5QpL8wH);
        if (lPop && lPop.classList.contains('open')) j4PosLang();
      }).observe(pSet);
    }
    window.addEventListener('resize', () => {
      if (rPop && rPop.classList.contains('open') && z5QpL8wH) j4PosPal(z5QpL8wH);
      if (lPop && lPop.classList.contains('open')) j4PosLang();
    });
    if (pSet) pSet.addEventListener('scroll', () => {
      if (rPop && rPop.classList.contains('open') && z5QpL8wH) j4PosPal(z5QpL8wH);
    });

    window.addEventListener('mousedown', e => {
      if (!win.classList.contains('open')) return;
      if (!rPop || !rPop.classList.contains('open')) return;
      const target = e.target;
      if (target && target.closest && target.closest('#macro-color-pop, .macro-mini-pal, #macro-toggle-pill')) return;
      c7ClosePal();
    }, true);

    if (rSv) {
      function updSv(e, save) {
        const rc = rSv.getBoundingClientRect();
        f8TmK2sV[1] = Math.max(0, Math.min(1, (e.clientX - rc.left) / rc.width));
        f8TmK2sV[2] = 1 - Math.max(0, Math.min(1, (e.clientY - rc.top) / rc.height));
        l3WvN9xR(save);
      }
      rSv.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
        e.preventDefault(); e.stopPropagation();
        updSv(e, false);
        function mv(ev) { updSv(ev, false); }
        function up() {
          window.removeEventListener('mousemove', mv);
          window.removeEventListener('mouseup', up);
          window.removeEventListener('blur', up);
          q6CommitVal(rHex);
          q6CommitVal(rRgb);
          x3QnK8wR();
        }
        window.addEventListener('mousemove', mv);
        window.addEventListener('mouseup', up);
        window.addEventListener('blur', up);
      });
    }

    if (rHue) {
      function updHue(e, save) {
        const rc = rHue.getBoundingClientRect();
        f8TmK2sV[0] = Math.max(0, Math.min(359.9, ((e.clientX - rc.left) / rc.width) * 360));
        l3WvN9xR(save);
      }
      rHue.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        if (document.activeElement && document.activeElement.blur) document.activeElement.blur();
        e.preventDefault(); e.stopPropagation();
        updHue(e, false);
        function mv(ev) { updHue(ev, false); }
        function up() {
          window.removeEventListener('mousemove', mv);
          window.removeEventListener('mouseup', up);
          window.removeEventListener('blur', up);
          q6CommitVal(rHex);
          q6CommitVal(rRgb);
          x3QnK8wR();
        }
        window.addEventListener('mousemove', mv);
        window.addEventListener('mouseup', up);
        window.addEventListener('blur', up);
      });
    }

    if (rHex) {
      rHex.addEventListener('input', () => {
        if (!z5QpL8wH) return;
        let val = rHex.value.trim();
        if (!val.startsWith('#')) val = '#' + val;
        const rgb = q3XmR7kB(val);
        if (rgb) {
          f8TmK2sV = r6TxL9wN(rgb[0], rgb[1], rgb[2]);
          const hex = val.toLowerCase();
          if (z5QpL8wH === 'menu') m9TvL2sP.menuColor = hex;
          else if (z5QpL8wH === 'buttons') m9TvL2sP.buttonsColor = hex;
          else m9TvL2sP.plexusColor = hex;
          d8KpW4mR();
          p2NmQ6xK();
          x3QnK8wR();
        }
      });
      rHex.addEventListener('blur', () => p2NmQ6xK(true));
      rHex.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === 'Escape') rHex.blur(); });
    }

    if (rRgb) {
      rRgb.addEventListener('input', () => {
        if (!z5QpL8wH) return;
        const match = rRgb.value.trim().match(/^(?:rgb\s*\(\s*)?(\d{1,3})(?:\s*,\s*|\s+)(\d{1,3})(?:\s*,\s*|\s+)(\d{1,3})\s*\)?$/i);
        if (!match) return;
        const r = Math.max(0, Math.min(255, parseInt(match[1], 10)));
        const g = Math.max(0, Math.min(255, parseInt(match[2], 10)));
        const b = Math.max(0, Math.min(255, parseInt(match[3], 10)));
        const hex = u7NxV4mK(r, g, b);
        f8TmK2sV = r6TxL9wN(r, g, b);
        if (z5QpL8wH === 'menu') m9TvL2sP.menuColor = hex;
        else if (z5QpL8wH === 'buttons') m9TvL2sP.buttonsColor = hex;
        else m9TvL2sP.plexusColor = hex;
        d8KpW4mR();
        p2NmQ6xK();
        x3QnK8wR();
      });
      rRgb.addEventListener('blur', () => p2NmQ6xK(true));
      rRgb.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === 'Escape') rRgb.blur(); });
    }

    if (rRst) {
      rRst.addEventListener('click', e => {
        e.stopPropagation();
        if (!z5QpL8wH) return;
        if (z5QpL8wH === 'menu') m9TvL2sP.menuColor = null;
        else if (z5QpL8wH === 'buttons') m9TvL2sP.buttonsColor = null;
        else m9TvL2sP.plexusColor = null;
        w9LpT5vN();
        x3QnK8wR();
      });
    }

    w9LpT5vN();

    const lBtn = document.getElementById('macro-lang-btn');
    const lCur = document.getElementById('macro-lang-cur');
    const lPop = document.getElementById('macro-lang-pop');
    const lList = document.getElementById('macro-lang-list');
    const lRow = lBtn ? lBtn.closest('.macro-lang-row') : null;

    function j4PosLang() {
      if (!lPop || !lBtn || !pSet) return;
      const pRect = pSet.getBoundingClientRect();
      const bRect = lBtn.getBoundingClientRect();
      const fz = parseFloat(getComputedStyle(win).fontSize) || 12;
      const gap = Math.max(3, Math.round(0.28 * fz));
      lPop.style.width = Math.round(bRect.width) + 'px';
      lPop.style.left = Math.round(bRect.left - pRect.left) + 'px';
      lPop.style.top = Math.round((bRect.bottom - pRect.top) + pSet.scrollTop + gap) + 'px';
      lPop.style.right = 'auto';
      lPop.style.bottom = 'auto';
    }

    let lHideT = 0;

    function c7CloseLang(keepDim) {
      if (lHideT) { clearTimeout(lHideT); lHideT = 0; }
      if (lBtn) lBtn.classList.remove('open');
      if (lPop) {
        lPop.classList.remove('open');
        if (keepDim) {
          lPop.style.display = 'none';
          u4PwS8mQ();
        } else {
          lHideT = setTimeout(() => {
            lHideT = 0;
            if (lPop && !lPop.classList.contains('open')) {
              lPop.style.display = 'none';
              u4PwS8mQ();
            }
          }, 210);
        }
      }
      if (lRow) lRow.classList.remove('macro-pal-active');
      if (pSet && !keepDim && !z5QpL8wH) pSet.classList.remove('macro-pal-dim');
    }

    g4PopClsFn = () => {
      c7ClosePal(true);
      c7CloseLang(true);
      if (pSet) pSet.classList.remove('macro-pal-dim');
    };

    const m4CurVer = '0.4.0';
    let m4LastVer = '';
    const v8UpdEl = document.getElementById('macro-ver-banner');
    function c3CmpVer(a, b) {
      const pa = String(a || '').replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);
      const pb = String(b || '').replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);
      const ln = Math.max(pa.length, pb.length);
      for (let i = 0; i < ln; i++) {
        const da = pa[i] || 0, db = pb[i] || 0;
        if (da !== db) return da > db ? 1 : -1;
      }
      return 0;
    }
    function r5UpdBanner() {
      if (v8UpdEl && m4LastVer) v8UpdEl.textContent = k3Tr('updRec', m4LastVer);
    }
    function a8ApplyVer(d) {
      if (!v8UpdEl || !d) return;
      const vStr = d.latest || d.version;
      if (!vStr || c3CmpVer(vStr, m4CurVer) <= 0) return;
      m4LastVer = String(vStr);
      if (typeof d.url === 'string' && /^https:\/\//i.test(d.url)) v8UpdEl.href = d.url;
      v8UpdEl.style.display = 'block';
      r5UpdBanner();
      u4PwM8xQ();
    }

    function q4ApplyLang() {
      win.querySelectorAll('[data-i18n]').forEach(el => {
        el.textContent = k3Tr(el.getAttribute('data-i18n'));
      });
      win.querySelectorAll('[data-i18n-title]').forEach(el => {
        el.setAttribute('title', k3Tr(el.getAttribute('data-i18n-title')));
      });
      win.querySelectorAll('[data-i18n-aria]').forEach(el => {
        el.setAttribute('aria-label', k3Tr(el.getAttribute('data-i18n-aria')));
      });
      win.querySelectorAll('[data-i18n-trick]').forEach(el => {
        const idx = parseInt(el.getAttribute('data-i18n-trick'), 10);
        el.textContent = `${k3Tr('trick')} ${1 << idx} (${idx}x)`;
      });
      win.querySelectorAll('[data-i18n-selrev]').forEach(el => {
        const idx = parseInt(el.getAttribute('data-i18n-selrev'), 10);
        el.textContent = `${k3Tr('selRev')} ${1 << idx} (${idx}x)`;
      });
      win.querySelectorAll('[data-ff-del-lbl]').forEach(el => {
        el.textContent = k3Tr('ffDelN', el.getAttribute('data-ff-del-lbl'));
      });
      win.querySelectorAll('[data-ff-lbl]').forEach(el => {
        el.textContent = `${k3Tr('ff')} ${el.getAttribute('data-ff-lbl')}`;
      });
      const actL = t3LangList.find(l => l.code === m9TvL2sP.lang) || t3LangList[0];
      if (lCur) lCur.textContent = `${actL.name} (${actL.code.toUpperCase()})`;
      if (lList) {
        lList.querySelectorAll('.macro-lang-opt').forEach(opt => {
          opt.classList.toggle('active', opt.getAttribute('data-lang') === actL.code);
        });
      }
      r8QnM4tL();
      if (typeof r5UpdBanner === 'function') r5UpdBanner();
      u4PwM8xQ();
      u4PwS8mQ();
    }

    if (lBtn && lPop) {
      lBtn.addEventListener('click', e => {
        e.stopPropagation();
        const op = !lPop.classList.contains('open');
        if (op) {
          if (lHideT) { clearTimeout(lHideT); lHideT = 0; }
          c7ClosePal(true);
          lPop.style.display = 'block';
          j4PosLang();
          void lPop.offsetWidth;
          if (pSet) pSet.classList.add('macro-pal-dim');
          if (lRow) lRow.classList.add('macro-pal-active');
          lBtn.classList.add('open');
          lPop.classList.add('open');
          u4PwS8mQ();
        } else {
          c7CloseLang();
        }
      });
    }

    if (lList) {
      lList.addEventListener('click', e => {
        const opt = e.target && e.target.closest ? e.target.closest('.macro-lang-opt') : null;
        if (!opt) return;
        e.stopPropagation();
        const cd = opt.getAttribute('data-lang');
        if (!cd || !t3LangDict[cd]) return;
        m9TvL2sP.lang = cd;
        x3QnK8wR();
        q4ApplyLang();
        c7CloseLang();
      });
    }

    window.addEventListener('mousedown', e => {
      if (!win.classList.contains('open')) return;
      if (!lPop || !lPop.classList.contains('open')) return;
      const t = e.target;
      if (t && t.closest && t.closest('#macro-lang-pop, #macro-lang-btn, .macro-custom-scroll-track, #macro-toggle-pill')) return;
      c7CloseLang();
    }, true);

    q4ApplyLang();

    fetch('https://kuksikoid.github.io/gota-multibox-guide/version.json?t=' + Math.floor(Date.now() / 60000))
      .then(r => r.ok ? r.json() : null)
      .then(a8ApplyVer)
      .catch(() => {});

    if (aNk) {
      if (m9TvL2sP.customNicksHeight) aNk.style.height = m9TvL2sP.customNicksHeight + 'px';
      aNk.addEventListener('mouseup', () => {
        if (aNk.offsetHeight && aNk.offsetHeight !== m9TvL2sP.customNicksHeight) {
          m9TvL2sP.customNicksHeight = aNk.offsetHeight; x3QnK8wR();
        }
      });
      aNk.addEventListener('input', e => { m9TvL2sP.customNicks = e.target.value; x3QnK8wR(); });
      aNk.addEventListener('keydown', e => { if (e.key === 'Escape') aNk.blur(); });
    }

    document.getElementById('macro-btn-all-reset').addEventListener('click', e => {
      e.stopPropagation();
      hCl2xK9m();
      window.setMapBackground(null);
      window.setFixedBackground(null);
      k2DbClr();
      m9TvL2sP = Object.assign({}, z4XqW8mT);
      pill.style.left = 'auto';
      pill.style.right = '0px';
      pill.style.top = '0px';
      pill.style.bottom = 'auto';
      v6WpL2sT(pill);
      win.style.width = m9TvL2sP.winWidth + 'px';
      win.style.height = m9TvL2sP.winHeight + 'px';
      win.style.left = 'auto';
      win.style.right = '0px';
      win.style.top = '52px';
      win.style.bottom = 'auto';
      if (aNk) aNk.style.height = '';
      m9TvL2sP.extraFastFeeds = [];
      m9TvL2sP.menuColor = null;
      m9TvL2sP.buttonsColor = null;
      m9TvL2sP.plexusColor = null;
      c6RmP3xW.clear();
      v8PalHist.menu = {};
      v8PalHist.buttons = {};
      v8PalHist.plexus = {};
      c7ClosePal();
      c7CloseLang();
      k8QmN3vR();
      f4KzP9wL(win);
      x3QnK8wR();
      q4ApplyLang();
      if (s2NpK7wL) s2NpK7wL();
    });

    function j5TwM9xK(wEl, cEl) {
      const cX = cEl.getContext('2d');
      let pW = (cEl.width = cEl.offsetWidth || 320);
      let pH = (cEl.height = cEl.offsetHeight || 520);

      const vW = Math.max(3840, window.screen.width || 2560);
      const vH = Math.max(2160, window.screen.height || 1440);
      const nP = Math.floor((vW * vH) / 9200);
      const mD = 120, mDSq = mD * mD;
      const pts = [];

      for (let i = 0; i < nP; i++) {
        pts.push({
          x: Math.random() * vW,
          y: Math.random() * vH,
          vx: (Math.random() - 0.5) * 0.38,
          vy: (Math.random() - 0.5) * 0.38,
          r: Math.random() * 1.6 + 1.2
        });
      }

      let p5RnK8wL = false;
      let p2VmQ4xT = 0;

      function rF() {
        if (!m9TvL2sP.plexusEnabled) {
          if (!wEl.classList.contains('open') || (p2VmQ4xT && performance.now() - p2VmQ4xT > 240)) {
            cX.setTransform(1, 0, 0, 1, 0, 0);
            cX.clearRect(0, 0, pW, pH);
            p5RnK8wL = false;
            return;
          }
        }
        if (wEl.classList.contains('open')) {
          const cRc = cEl.getBoundingClientRect();
          const oX = cRc.left, oY = cRc.top;

          if (cEl.width !== cEl.offsetWidth || cEl.height !== cEl.offsetHeight) {
            pW = cEl.width = cEl.offsetWidth || 320;
            pH = cEl.height = cEl.offsetHeight || 520;
          }

          const sc = m9TvL2sP.syncScale ? k4RnP9wT : 1;
          const vPW = pW / sc;
          const vPH = pH / sc;

          cX.setTransform(1, 0, 0, 1, 0, 0);
          cX.clearRect(0, 0, pW, pH);
          if (sc !== 1) cX.setTransform(sc, 0, 0, sc, 0, 0);

          const vL = [];
          const ln = pts.length;

          for (let i = 0; i < ln; i++) {
            const p = pts[i];
            p.x += p.vx;
            p.y += p.vy;

            if (p.x <= 0 || p.x >= vW) p.vx *= -1;
            if (p.y <= 0 || p.y >= vH) p.vy *= -1;

            const lx = p.x - oX, ly = p.y - oY;
            if (lx >= -mD && lx <= vPW + mD && ly >= -mD && ly <= vPH + mD) {
              vL.push({ x: lx, y: ly, r: p.r });
              if (lx >= -p.r && lx <= vPW + p.r && ly >= -p.r && ly <= vPH + p.r) {
                cX.beginPath();
                cX.arc(lx, ly, p.r, 0, Math.PI * 2);
                cX.fillStyle = 'rgba(' + g3VxL8mQ[0] + ',0.8)';
                cX.fill();
              }
            }
          }

          const vLn = Math.min(vL.length, 130);
          for (let i = 0; i < vLn; i++) {
            const p1 = vL[i];
            let links = 0;
            for (let j = i + 1; j < vLn && links < 8; j++) {
              const p2 = vL[j];
              const dx = p1.x - p2.x, dy = p1.y - p2.y;
              const dSq = dx * dx + dy * dy;

              if (dSq < mDSq) {
                links++;
                const d = Math.sqrt(dSq);
                const a = 1 - d / mD;

                cX.beginPath();
                cX.moveTo(p1.x, p1.y);
                cX.lineTo(p2.x, p2.y);
                cX.strokeStyle = 'rgba(' + g3VxL8mQ[1] + ',' + (a * 0.38) + ')';
                cX.lineWidth = 1.05;
                cX.stroke();

                let tris = 0;
                for (let k = j + 1; k < vLn && tris < 3; k++) {
                  const p3 = vL[k];
                  const dx2 = p1.x - p3.x, dy2 = p1.y - p3.y;
                  const dSq2 = dx2 * dx2 + dy2 * dy2;

                  if (dSq2 < mDSq) {
                    const dx3 = p2.x - p3.x, dy3 = p2.y - p3.y;
                    const dSq3 = dx3 * dx3 + dy3 * dy3;

                    if (dSq3 < mDSq) {
                      tris++;
                      cX.beginPath();
                      cX.moveTo(p1.x, p1.y);
                      cX.lineTo(p2.x, p2.y);
                      cX.lineTo(p3.x, p3.y);
                      cX.closePath();
                      cX.fillStyle = 'rgba(' + g3VxL8mQ[2] + ',' + (a * 0.11) + ')';
                      cX.fill();
                    }
                  }
                }
              }
            }
          }
        }
        k9LwP2xM(rF);
      }

      s2NpK7wL = function () {
        const on = Boolean(m9TvL2sP.plexusEnabled);
        cEl.style.opacity = on ? '1' : '0';
        if (on) {
          p2VmQ4xT = 0;
          if (!p5RnK8wL) {
            p5RnK8wL = true;
            k9LwP2xM(rF);
          }
        } else {
          p2VmQ4xT = performance.now();
        }
      };

      s2NpK7wL();
    }

    j5TwM9xK(win, c1XnL4vP);
    r4BindHooks();
    q9EnvOk = d4VkL8wQ() ? 1 : 0;
  }

  function initGfx() {
    if (document.getElementById('macro-bg-canvas')) return;
    const bCv = document.createElement('canvas');
    bCv.id = 'macro-bg-canvas';
    const vW0 = document.documentElement.clientWidth || window.innerWidth;
    const vH0 = document.documentElement.clientHeight || window.innerHeight;
    bCv.width = vW0; bCv.height = vH0;
    bCv.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;';
    document.body.appendChild(bCv);
    const c2D = bCv.getContext('2d', { alpha: true });

    const stEl = document.createElement('style');
    (document.head || document.documentElement).appendChild(stEl);

    let bgDrty = false;

    function drawBg() {
      const isFix = Boolean(m9TvL2sP.fixedBackgroundEnabled && u4TkQ);
      const isMap = Boolean(!m9TvL2sP.fixedBackgroundEnabled && m9TvL2sP.mapBgEnabled && q8MwP);
      if (!isFix && u4TkQ && u4TkQ.t === 2 && !u4TkQ.v.paused) {
        try { u4TkQ.v.pause(); } catch (_) {}
      }
      if (!isMap && q8MwP && q8MwP.t === 2 && !q8MwP.v.paused) {
        try { q8MwP.v.pause(); } catch (_) {}
      }
      if (!isFix && !isMap) {
        if (stEl.textContent) stEl.textContent = '';
        if (bgDrty) {
          c2D.setTransform(1, 0, 0, 1, 0, 0);
          c2D.clearRect(0, 0, bCv.width, bCv.height);
          bgDrty = false;
        }
        return;
      }

      const bW = document.documentElement.clientWidth || window.innerWidth;
      const bH = document.documentElement.clientHeight || window.innerHeight;
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const tgW = Math.round(bW * dpr), tgH = Math.round(bH * dpr);
      if (bCv.width !== tgW || bCv.height !== tgH) { bCv.width = tgW; bCv.height = tgH; }
      c2D.setTransform(dpr, 0, 0, dpr, 0, 0);
      c2D.clearRect(0, 0, bW, bH);
      bgDrty = true;

      if (!stEl.textContent) {
        stEl.textContent = 'html, body, #canvas, canvas[data-macro-game-bg] { background: transparent !important; background-color: transparent !important; }';
      }
      c2D.imageSmoothingEnabled = true;
      c2D.imageSmoothingQuality = 'high';
      c2D.fillStyle = '#050508';
      c2D.fillRect(0, 0, bW, bH);

      if (isFix) {
        if (u4TkQ.t === 1) {
          c2D.fillStyle = u4TkQ.v; c2D.fillRect(0, 0, bW, bH);
        } else if (u4TkQ.t === 2) {
          const v = u4TkQ.v;
          if (v.paused && !document.hidden) v.play().catch(() => {});
          if (v.readyState >= 2 && v.videoWidth && v.videoHeight) c2D.drawImage(v, 0, 0, bW, bH);
        } else if (u4TkQ.t === 3) {
          const im = u4TkQ.v;
          if (im.complete && im.naturalWidth) c2D.drawImage(im, 0, 0, bW, bH);
        }
        return;
      }

      if (isMap) {
        const gCv = p9CvRef || p9C2Cv || t8VwM4xK();
        if (gCv && !gCv.hasAttribute('data-macro-game-bg')) gCv.setAttribute('data-macro-game-bg', '1');
        const cRc = gCv ? gCv.getBoundingClientRect() : null;
        const rL = cRc && cRc.width > 0 ? cRc.left : 0;
        const rT = cRc && cRc.height > 0 ? cRc.top : 0;
        const rW = cRc && cRc.width > 0 ? cRc.width : bW;
        const rH = cRc && cRc.height > 0 ? cRc.height : bH;
        const nw = performance.now();

        if (p9PixiOn && nw - p9LastPixiMs <= 500) {
          const sw = p9ScW > 0 ? p9ScW : rW;
          const sh = p9ScH > 0 ? p9ScH : rH;
          const sx = rW / sw, sy = rH / sh;
          c2D.setTransform(p9WtA * sx * dpr, p9WtB * sy * dpr, p9WtC * sx * dpr, p9WtD * sy * dpr, (rL + p9WtTx * sx) * dpr, (rT + p9WtTy * sy) * dpr);
        } else if (kAct && nw - p9GlMs <= 500) {
          c2D.setTransform(zM * dpr, 0, 0, zM * dpr, (rL + tX) * dpr, (rT + tY) * dpr);
        } else if (p9C2On && gCv && gCv.width > 0 && gCv.height > 0) {
          const sx = rW / gCv.width, sy = rH / gCv.height;
          c2D.setTransform(p9C2A * sx * dpr, 0, 0, p9C2D * sy * dpr, (rL + p9C2Tx * sx) * dpr, (rT + p9C2Ty * sy) * dpr);
        } else {
          const curZ = k3WnL8vR() || 0.395;
          c2D.setTransform(curZ * dpr, 0, 0, curZ * dpr, (rL + rW * 0.5) * dpr, (rT + rH * 0.5) * dpr);
        }

        const mX = p9MapX, mY = p9MapY, mW = p9MapW, mH = p9MapH;
        if (q8MwP.t === 1) {
          c2D.fillStyle = q8MwP.v; c2D.fillRect(mX, mY, mW, mH);
        } else if (q8MwP.t === 2) {
          const v = q8MwP.v;
          if (v.paused && !document.hidden) v.play().catch(() => {});
          if (v.readyState >= 2 && v.videoWidth && v.videoHeight) {
            const sDim = Math.min(v.videoWidth, v.videoHeight);
            const sx = (v.videoWidth - sDim) * 0.5, sy = (v.videoHeight - sDim) * 0.5;
            c2D.drawImage(v, sx, sy, sDim, sDim, mX, mY, mW, mH);
          }
        } else if (q8MwP.t === 3) {
          const im = q8MwP.v;
          if (im.complete && im.naturalWidth) c2D.drawImage(im, mX, mY, mW, mH);
        }
        c2D.setTransform(1, 0, 0, 1, 0, 0);
      }
    }

    b7DrawFn = drawBg;

    window.addEventListener('resize', () => {
      drawBg();
    }, { passive: true });

    function loop() {
      const nw = performance.now();
      if ((!p9PixiOn || nw - p9LastPixiMs > 45) && (!kAct || nw - p9GlMs > 45 || nw - w2VpL9xK > 45)) drawBg();
      window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGfx, { once: true });
  } else {
    initGfx();
  }

  window.addEventListener('focus', () => {
    const act = document.activeElement, tn = act ? (act.tagName || '').toLowerCase() : '';
    if ((tn === 'input' && act.type !== 'checkbox') || tn === 'textarea' || (act && act.isContentEditable)) return;
    if (act && (act.tagName === 'BUTTON' || act.tagName === 'A') && act.closest && act.closest('#macro-window')) act.blur();
    const cv = t8VwM4xK();
    if (cv && cv.focus) cv.focus();
  }, { passive: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', y9WnK2vT);
  } else {
    y9WnK2vT();
  }
})();
