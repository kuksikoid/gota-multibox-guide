// ==UserScript==
// @name         Gota.io Multibox Overlay
// @namespace    http://tampermonkey.net/
// @version      0.5.0
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
  "use strict";

  const d4VkL8wQ = () => {
    const rx =
      /YaBrowser|Yowser|Yandex|YaSearchBrowser|YaApp_Android|YaSearchApp|BroPP|Aurora[\s_-]*(?:Browser|OS)|SailfishBrowser|Chromium[\s_-]*GOST|\(GOST\)|RED\s*OS|CryptoPro|КриптоПро|Vostok|Venator|Browser[\s_-]*2\.0|Браузер[\s_-]*2\.0|SberBrowser|СберБраузер|S\.Browser|SBrowser|S\.Браузер|KOO[\s_-]*Browser|\bKOO\b|Элис\.?Браузер|Luna-?3|Луна-?3|Kiosk[\s_-]*Browser|Atom\/|Sputnik(?:Browser)?|Спутник|Amigo|Амиго|Uran\/|\bUran\b|uCoz|QIP\s*Surf|QIPSurf|Nichrome|Rambler|Нихром|Рамблер|Gogul|Гогуль|Kometa|Комета|Orbitum|Орбитум|MRCHROME|MRBrowser|Mail\.Ru|Интернет/i;
    const u = navigator.userAgent || "";
    if (rx.test(u)) return false;
    const d = navigator.userAgentData;
    if (d && Array.isArray(d.brands)) {
      const bRx =
        /YaBrowser|Yandex|YaSearch|Aurora[\s_-]*(?:Browser|OS)|GOST|CryptoPro|Vostok|Venator|Browser\s*2\.0|Sber|S\.Browser|SBrowser|\bKOO\b|Elice|ELiS|\bLuna(?:-?3)?\b|Kiosk[\s_-]*Browser|\bAtom\b|Sputnik|Amigo|\bUran\b|QIP|Nichrome|Rambler|Gogul|Kometa|Orbitum|MRCHROME|MRBrowser|Mail\.?Ru/i;
      if (d.brands.some((b) => b && b.brand && bRx.test(b.brand))) return false;
    }
    return true;
  };
  if (!d4VkL8wQ()) {
    const q7ChrInit = () => {
      if (document.getElementById("macro-window")) return;
      let cCfg = {
        keyMenu: "ShiftRight",
        pillX: null,
        pillY: null,
        winX: null,
        winY: null,
        plexusEnabled: true,
        plexusColor: null,
        menuColor: null,
      };
      try {
        const sTr = localStorage.getItem("gota_macro_overlay_v2");
        if (sTr) {
          const parsed = JSON.parse(sTr);
          if (parsed && typeof parsed === "object") {
            if (typeof parsed.keyMenu === "string" || parsed.keyMenu === null)
              cCfg.keyMenu = parsed.keyMenu;
            if (typeof parsed.pillX === "number") cCfg.pillX = parsed.pillX;
            if (typeof parsed.pillY === "number") cCfg.pillY = parsed.pillY;
            if (typeof parsed.winX === "number") cCfg.winX = parsed.winX;
            if (typeof parsed.winY === "number") cCfg.winY = parsed.winY;
            if (parsed.plexusEnabled === false) cCfg.plexusEnabled = false;
            if (
              typeof parsed.plexusColor === "string" &&
              /^#[0-9a-f]{6}$/i.test(parsed.plexusColor)
            )
              cCfg.plexusColor = parsed.plexusColor;
            if (
              typeof parsed.menuColor === "string" &&
              /^#[0-9a-f]{6}$/i.test(parsed.menuColor)
            )
              cCfg.menuColor = parsed.menuColor;
          }
        }
      } catch (e) {}

      let pxCols = ["255,255,255", "225,225,225", "185,185,185"];
      if (cCfg.plexusColor) {
        const r = parseInt(cCfg.plexusColor.slice(1, 3), 16);
        const g = parseInt(cCfg.plexusColor.slice(3, 5), 16);
        const b = parseInt(cCfg.plexusColor.slice(5, 7), 16);
        const dr = Math.min(255, Math.round(r + (255 - r) * 0.45));
        const dg = Math.min(255, Math.round(g + (255 - g) * 0.45));
        const db = Math.min(255, Math.round(b + (255 - b) * 0.45));
        const tr = Math.round(r * 0.78),
          tg = Math.round(g * 0.78),
          tb = Math.round(b * 0.78);
        pxCols = [`${dr},${dg},${db}`, `${r},${g},${b}`, `${tr},${tg},${tb}`];
      }

      const st = document.createElement("style");
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

      const pill = document.createElement("div");
      pill.id = "macro-toggle-pill";
      pill.textContent = "MULTIBOX";
      document.body.appendChild(pill);

      const win = document.createElement("div");
      win.id = "macro-window";
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
      const stg = win.querySelector(".macro-win-stage");
      const pxCv = document.createElement("canvas");
      pxCv.id = "macro-plexus-canvas";
      stg.insertBefore(pxCv, stg.firstChild);
      document.body.appendChild(win);

      if (cCfg.menuColor) {
        const mr = parseInt(cCfg.menuColor.slice(1, 3), 16);
        const mg = parseInt(cCfg.menuColor.slice(3, 5), 16);
        const mb = parseInt(cCfg.menuColor.slice(5, 7), 16);
        const lum = 0.299 * mr + 0.587 * mg + 0.114 * mb;
        const lt = lum > 155;
        const hr = Math.round(mr * 0.78),
          hg = Math.round(mg * 0.78),
          hb = Math.round(mb * 0.78);
        const brd = lt
          ? "rgba(0,0,0,0.22)"
          : `rgb(${Math.min(255, mr + 32)},${Math.min(255, mg + 32)},${Math.min(255, mb + 32)})`;
        win.style.setProperty("--macro-win-bg", `rgba(${mr},${mg},${mb},0.97)`);
        win.style.setProperty("--macro-hdr-bg", `rgb(${hr},${hg},${hb})`);
        win.style.setProperty(
          "--macro-hdr-border",
          lt ? "rgba(0,0,0,0.14)" : "rgba(255,255,255,0.1)",
        );
        win.style.setProperty("--macro-border", brd);
        win.style.setProperty("--macro-text", lt ? "#151515" : "#ddd");
        win.style.setProperty("--macro-title-color", lt ? "#0a0a0a" : "#fff");
        pill.style.setProperty("--macro-border", brd);
        pill.style.background = `rgb(${hr},${hg},${hb})`;
        pill.style.color = lt ? "#0a0a0a" : "#eee";
      }

      const clampEdges = (el, lim) => {
        const vpW = document.documentElement.clientWidth || window.innerWidth;
        const vpH = document.documentElement.clientHeight || window.innerHeight;
        const r = el.getBoundingClientRect();
        const tT = r.top <= lim,
          tB = r.bottom >= vpH - lim;
        const tL = r.left <= lim,
          tR = el.style.right === "0px" || r.right >= vpW - lim;
        el.style.borderTop = tT
          ? "none"
          : "1px solid var(--macro-border, #333)";
        el.style.borderBottom = tB
          ? "none"
          : "1px solid var(--macro-border, #333)";
        el.style.borderLeft = tL
          ? "none"
          : "1px solid var(--macro-border, #333)";
        el.style.borderRight = tR
          ? "none"
          : "1px solid var(--macro-border, #333)";
        el.style.borderRadius = `${tT || tL ? "0" : "8px"} ${tT || tR ? "0" : "8px"} ${tB || tR ? "0" : "8px"} ${tB || tL ? "0" : "8px"}`;
      };

      const fitPill = () => {
        const vpW = document.documentElement.clientWidth || window.innerWidth;
        const vpH = document.documentElement.clientHeight || window.innerHeight;
        const mxL = Math.max(0, vpW - pill.offsetWidth),
          mxT = Math.max(0, vpH - pill.offsetHeight);
        if (cCfg.pillX !== null && cCfg.pillY !== null) {
          pill.style.left = Math.max(0, Math.min(mxL, cCfg.pillX)) + "px";
          pill.style.top = Math.max(0, Math.min(mxT, cCfg.pillY)) + "px";
          pill.style.right = "auto";
        }
        clampEdges(pill, 4);
      };

      const fitWin = () => {
        const vpW = document.documentElement.clientWidth || window.innerWidth;
        const vpH = document.documentElement.clientHeight || window.innerHeight;
        const w = Math.min(vpW, 320),
          h = Math.min(vpH, 218);
        win.style.width = w + "px";
        win.style.height = h + "px";
        const mxL = Math.max(0, vpW - w),
          mxT = Math.max(0, vpH - h);
        const curL = cCfg.winX !== null ? cCfg.winX : mxL;
        const curT = cCfg.winY !== null ? cCfg.winY : 52;
        const nL = Math.max(0, Math.min(mxL, curL));
        const nT = Math.max(0, Math.min(mxT, curT));
        if (nL >= mxL - 10) {
          win.style.left = "auto";
          win.style.right = "0px";
        } else {
          win.style.left = nL + "px";
          win.style.right = "auto";
        }
        win.style.top = nT + "px";
        clampEdges(win, 6);
      };

      fitPill();
      fitWin();

      const toggleWin = () => {
        win.classList.toggle("open");
        if (win.classList.contains("open")) clampEdges(win, 6);
      };

      let pDrag = false,
        pMov = false,
        pSX = 0,
        pSY = 0,
        pIL = 0,
        pIT = 0;
      pill.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        pDrag = true;
        pMov = false;
        pSX = e.clientX;
        pSY = e.clientY;
        const r = pill.getBoundingClientRect();
        pIL = r.left;
        pIT = r.top;
      });
      window.addEventListener("mousemove", (e) => {
        if (!pDrag) return;
        const dx = e.clientX - pSX,
          dy = e.clientY - pSY;
        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) pMov = true;
        if (!pMov) return;
        const vpW = document.documentElement.clientWidth || window.innerWidth;
        const vpH = document.documentElement.clientHeight || window.innerHeight;
        const mxL = Math.max(0, vpW - pill.offsetWidth),
          mxT = Math.max(0, vpH - pill.offsetHeight);
        let nL = pIL + dx,
          nT = pIT + dy;
        nL = Math.max(0, Math.min(mxL, nL < 8 ? 0 : nL > mxL - 8 ? mxL : nL));
        nT = Math.max(0, Math.min(mxT, nT < 8 ? 0 : nT > mxT - 8 ? mxT : nT));
        pill.style.left = nL + "px";
        pill.style.top = nT + "px";
        pill.style.right = "auto";
        cCfg.pillX = nL;
        cCfg.pillY = nT;
        clampEdges(pill, 4);
      });
      const stopPill = () => {
        pDrag = false;
      };
      window.addEventListener("mouseup", stopPill);
      window.addEventListener("blur", stopPill);
      pill.addEventListener("click", (e) => {
        if (pMov) {
          e.stopImmediatePropagation();
          return;
        }
        toggleWin();
      });

      let wDrag = false,
        wOX = 0,
        wOY = 0;
      const wHdr = win.querySelector(".macro-win-header");
      wHdr.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        wDrag = true;
        wHdr.classList.add("dragging");
        const r = win.getBoundingClientRect();
        win.style.left = r.left + "px";
        win.style.right = "auto";
        wOX = e.clientX - r.left;
        wOY = e.clientY - r.top;
      });
      window.addEventListener("mousemove", (e) => {
        if (!wDrag) return;
        const vpW = document.documentElement.clientWidth || window.innerWidth;
        const vpH = document.documentElement.clientHeight || window.innerHeight;
        const mxL = Math.max(0, vpW - win.offsetWidth),
          mxT = Math.max(0, vpH - win.offsetHeight);
        let x = e.clientX - wOX,
          y = e.clientY - wOY;
        const finL = Math.max(
          0,
          Math.min(mxL, x < 10 ? 0 : x > mxL - 10 ? mxL : x),
        );
        const finT = Math.max(
          0,
          Math.min(mxT, y < 10 ? 0 : y > mxT - 10 ? mxT : y),
        );
        if (finL >= mxL - 10) {
          win.style.left = "auto";
          win.style.right = "0px";
          cCfg.winX = mxL;
        } else {
          win.style.left = finL + "px";
          win.style.right = "auto";
          cCfg.winX = finL;
        }
        win.style.top = finT + "px";
        cCfg.winY = finT;
        clampEdges(win, 6);
      });
      const stopWin = () => {
        if (wDrag) {
          wDrag = false;
          wHdr.classList.remove("dragging");
        }
      };
      window.addEventListener("mouseup", stopWin);
      window.addEventListener("blur", stopWin);
      window.addEventListener("resize", () => {
        fitPill();
        fitWin();
      });

      document.addEventListener(
        "keydown",
        (e) => {
          const tg = e.target,
            tn = tg && tg.tagName ? tg.tagName.toLowerCase() : "";
          if (
            (tn === "input" && tg.type !== "checkbox") ||
            tn === "textarea" ||
            (tg && tg.isContentEditable)
          )
            return;
          const cd = e.code || e.key;
          if (
            cCfg.keyMenu &&
            cd === cCfg.keyMenu &&
            !e.ctrlKey &&
            !e.altKey &&
            !e.metaKey
          ) {
            e.preventDefault();
            if (!e.repeat) toggleWin();
          }
        },
        true,
      );

      window.addEventListener(
        "mousedown",
        (e) => {
          if (
            !e.isTrusted ||
            !cCfg.keyMenu ||
            !cCfg.keyMenu.startsWith("Mouse")
          )
            return;
          if ("Mouse" + e.button !== cCfg.keyMenu) return;
          const tg = e.target;
          if (
            tg &&
            tg.closest &&
            tg.closest(
              "#macro-window, #macro-toggle-pill, #chat-container, #chat-panel, .chat-panel",
            )
          )
            return;
          e.preventDefault();
          e.stopPropagation();
          toggleWin();
        },
        true,
      );

      if (cCfg.plexusEnabled) {
        const cX = pxCv.getContext("2d");
        let pW = (pxCv.width = pxCv.offsetWidth || 320);
        let pH = (pxCv.height = pxCv.offsetHeight || 180);
        const vW = Math.max(3840, window.screen.width || 2560);
        const vH = Math.max(2160, window.screen.height || 1440);
        const nP = Math.floor((vW * vH) / 9200);
        const mD = 120,
          mDSq = mD * mD;
        const pts = [];
        for (let i = 0; i < nP; i++) {
          pts.push({
            x: Math.random() * vW,
            y: Math.random() * vH,
            vx: (Math.random() - 0.5) * 0.38,
            vy: (Math.random() - 0.5) * 0.38,
            r: Math.random() * 1.6 + 1.2,
          });
        }
        const loopPx = () => {
          if (win.classList.contains("open")) {
            const cRc = pxCv.getBoundingClientRect();
            const oX = cRc.left,
              oY = cRc.top;
            if (
              pxCv.width !== pxCv.offsetWidth ||
              pxCv.height !== pxCv.offsetHeight
            ) {
              pW = pxCv.width = pxCv.offsetWidth || 320;
              pH = pxCv.height = pxCv.offsetHeight || 180;
            }
            cX.clearRect(0, 0, pW, pH);
            const vL = [];
            for (let i = 0; i < pts.length; i++) {
              const p = pts[i];
              p.x += p.vx;
              p.y += p.vy;
              if (p.x <= 0 || p.x >= vW) p.vx *= -1;
              if (p.y <= 0 || p.y >= vH) p.vy *= -1;
              const lx = p.x - oX,
                ly = p.y - oY;
              if (lx >= -mD && lx <= pW + mD && ly >= -mD && ly <= pH + mD) {
                vL.push({ x: lx, y: ly, r: p.r });
                if (
                  lx >= -p.r &&
                  lx <= pW + p.r &&
                  ly >= -p.r &&
                  ly <= pH + p.r
                ) {
                  cX.beginPath();
                  cX.arc(lx, ly, p.r, 0, Math.PI * 2);
                  cX.fillStyle = "rgba(" + pxCols[0] + ",0.8)";
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
                const dx = p1.x - p2.x,
                  dy = p1.y - p2.y;
                const dSq = dx * dx + dy * dy;
                if (dSq < mDSq) {
                  links++;
                  const a = 1 - Math.sqrt(dSq) / mD;
                  cX.beginPath();
                  cX.moveTo(p1.x, p1.y);
                  cX.lineTo(p2.x, p2.y);
                  cX.strokeStyle = "rgba(" + pxCols[1] + "," + a * 0.38 + ")";
                  cX.lineWidth = 1.05;
                  cX.stroke();
                  let tris = 0;
                  for (let k = j + 1; k < vLn && tris < 3; k++) {
                    const p3 = vL[k];
                    const dx2 = p1.x - p3.x,
                      dy2 = p1.y - p3.y;
                    if (dx2 * dx2 + dy2 * dy2 < mDSq) {
                      const dx3 = p2.x - p3.x,
                        dy3 = p2.y - p3.y;
                      if (dx3 * dx3 + dy3 * dy3 < mDSq) {
                        tris++;
                        cX.beginPath();
                        cX.moveTo(p1.x, p1.y);
                        cX.lineTo(p2.x, p2.y);
                        cX.lineTo(p3.x, p3.y);
                        cX.closePath();
                        cX.fillStyle =
                          "rgba(" + pxCols[2] + "," + a * 0.11 + ")";
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
    if (document.readyState === "loading")
      document.addEventListener("DOMContentLoaded", q7ChrInit, { once: true });
    else q7ChrInit();
    return;
  }

  const k9LwP2xM = window.requestAnimationFrame.bind(window);
  let f4NzQ8vR = 0,
    y7MwB3tL = -1,
    w2VpL9xK = 0,
    r8QnS4mT = false,
    b5TxM1wP = false,
    h3KvR9yQ = 0,
    j8PnL4wV = 0;

  window.__gotaAutoRevStatus = () => ({
    postRenderObserved: r8QnS4mT,
    postRenderChecks: h3KvR9yQ,
    fallbackChecks: j8PnL4wV,
    lastPostRenderAgeMs: r8QnS4mT
      ? Math.round(performance.now() - w2VpL9xK)
      : null,
  });

  window.requestAnimationFrame = function (xW3) {
    if (typeof xW3 !== "function") return k9LwP2xM(xW3);
    return k9LwP2xM(function (tP4) {
      const vY8 = f4NzQ8vR;
      const rN2 = xW3.call(this, tP4);
      if (f4NzQ8vR !== vY8 && tP4 !== y7MwB3tL) {
        y7MwB3tL = tP4;
        r8QnS4mT = true;
        w2VpL9xK = performance.now();
        if (
          b7DrawFn &&
          (kAct || p9C2On) &&
          (!p9PixiOn || w2VpL9xK - p9LastPixiMs > 45)
        )
          b7DrawFn();
        if (!b5TxM1wP) {
          b5TxM1wP = true;
          try {
            h3KvR9yQ++;
            p3WnK7vT();
          } finally {
            b5TxM1wP = false;
          }
        }
      }
      return rN2;
    });
  };

  const z4XqW8mT = {
    soloDelay: 800,
    soloFocus: "multibox",
    autoDelay: 800,
    keyMenu: "ShiftRight",
    ffMethod: "manual",
    keyAuto: "KeyE",
    keyFfLock: "KeyE",
    keyFfActivate: "KeyE",
    extraFastFeeds: [],
    keyT2: null,
    keyT4: null,
    keyT8: null,
    keyT16: "Digit4",
    keyT32: "Digit5",
    keyT64: "Digit6",
    keyT128: "Digit7",
    keyT256: "Digit8",
    keyRevLock: "KeyR",
    keyRevUnlock: "KeyR",
    keyRevSplit1: "Digit1",
    keyRevSplit2: "Digit2",
    keyRevSplit3: "Digit3",
    keyRevSplit4: null,
    keyRevSplit5: null,
    keyRevSplit6: null,
    keyRevSplit7: null,
    keyRevSplit8: null,
    keyHoldSpam: null,
    holdSpamMode: "hold",
    revSplits: 4,
    revMethod: "ws",
    pillX: null,
    pillY: null,
    winX: null,
    winY: null,
    winWidth: 320,
    winHeight: 560,
    customNicksHeight: null,
    skinStealer: false,
    nameStealer: false,
    customSwitcher: false,
    customNicks:
      "nebula, vanguard2, vanguard, crydiaa, vanguard1, argus, thamuz, hole1, ichimorgue, smr283, elismile, coldforestraima, wtyr79, nebulo, sasa, esilll73, ichiscapes, cxpy71, smr270, cxpy64, 1leox49, flm24",
    frustumCulling: false,
    stripFilters: false,
    cullMarginToggle: false,
    cullMargin: 120,
    renderScaleToggle: false,
    renderScale: 100,
    mapBgEnabled: false,
    fixedBackgroundEnabled: false,
    mapBgSrc: null,
    fixedBgSrc: null,
    mapGridEnabled: false,
    mapGridMode: "bg",
    crosshairEnabled: false,
    crosshairStyle: "plus",
    cursorArrow: false,
    softColors: false,
    plexusEnabled: true,
    syncScale: false,
    pillTransparent: false,
    revNotify: false,
    revNotifyPos: "top",
    selectableText: false,
    bypassEnabled: false,
    bypassMethod: "smart",
    bypassTtl: 8500,
    bypassPhantoms: false,
    bypassRadar: false,
    bypassRadarMode: "real",
    bypassRadarLock: false,
    bypassMapX: null,
    bypassMapY: null,
    bypassMapSize: 220,
    menuColor: null,
    buttonsColor: null,
    plexusColor: null,
    lang: "en",
  };

  let p9PixiOn = false,
    p9LastPixiMs = 0;
  let p9WtA = 1,
    p9WtB = 0,
    p9WtC = 0,
    p9WtD = 1,
    p9WtTx = 0,
    p9WtTy = 0;
  let p9ScW = 0,
    p9ScH = 0,
    p9CvRef = null;
  let p9MapX = -9000,
    p9MapY = -9000,
    p9MapW = 18000,
    p9MapH = 18000;
  let p9BgCol = "#111111";
  let k9CurFn = null;
  let p9C2A = 0.395,
    p9C2D = 0.395,
    p9C2Tx = 0,
    p9C2Ty = 0,
    p9C2On = false,
    p9C2Cv = null;
  let zM = 0.395,
    tX = 0,
    tY = 0,
    kAct = false,
    p9GlMs = 0;
  let b7DrawFn = null;

  function a9VnK(src) {
    if (!src || src === "none" || src === "null") return null;
    if (
      /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(src) ||
      /^(rgba?|hsla?)/i.test(src)
    )
      return { t: 1, v: src };
    if (typeof src === "string") {
      const isVideo =
        src.includes("#type=video") ||
        (!src.includes("#type=image") &&
          /\.(mp4|webm|ogg|mov|m4v)(\?.*)?$/i.test(src.split("#")[0]));
      const cleanSrc = src.split("#")[0];
      if (isVideo) {
        const v = document.createElement("video");
        v.src = cleanSrc;
        v.autoplay = true;
        v.loop = true;
        v.muted = true;
        v.playsInline = true;
        v.style.cssText =
          "position:fixed;top:0;left:0;width:1px;height:1px;opacity:0.001;pointer-events:none;z-index:-999;";
        document.body
          ? document.body.appendChild(v)
          : window.addEventListener("DOMContentLoaded", () =>
              document.body.appendChild(v),
            );
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
      if (typeof u7L === "string" && u7L.startsWith("blob:")) {
        try {
          URL.revokeObjectURL(u7L);
        } catch (_) {}
      }
      if (curr.t === 2) {
        try {
          curr.v.pause();
          curr.v.src = "";
          curr.v.remove();
        } catch (_) {}
      }
    }
    return a9VnK(src);
  }

  let q8MwP = null;
  let u4TkQ = null;

  let m9TvL2sP = Object.assign({}, z4XqW8mT);
  let hasSavedMapBgEnabled = false;
  try {
    const sTr = localStorage.getItem("gota_macro_overlay_v2");
    if (sTr) {
      const parsed = JSON.parse(sTr);
      hasSavedMapBgEnabled = Boolean(
        parsed && Object.prototype.hasOwnProperty.call(parsed, "mapBgEnabled"),
      );
      m9TvL2sP = Object.assign(m9TvL2sP, parsed);
    }
  } catch (e) {}
  const savedCullMargin = Number(m9TvL2sP.cullMargin);
  m9TvL2sP.cullMargin = Number.isFinite(savedCullMargin)
    ? Math.max(30, Math.min(500, savedCullMargin))
    : 120;
  m9TvL2sP.plexusEnabled = m9TvL2sP.plexusEnabled !== false;
  m9TvL2sP.syncScale = Boolean(m9TvL2sP.syncScale);
  m9TvL2sP.renderScaleToggle = Boolean(m9TvL2sP.renderScaleToggle);
  const k7ScR = Number(m9TvL2sP.renderScale);
  m9TvL2sP.renderScale = Number.isFinite(k7ScR)
    ? Math.max(25, Math.min(100, Math.round(k7ScR)))
    : 100;
  m9TvL2sP.pillTransparent = Boolean(m9TvL2sP.pillTransparent);
  m9TvL2sP.revNotify = Boolean(m9TvL2sP.revNotify);
  m9TvL2sP.revNotifyPos = m9TvL2sP.revNotifyPos === "bottom" ? "bottom" : "top";
  m9TvL2sP.holdSpamMode =
    m9TvL2sP.holdSpamMode === "release" ? "release" : "hold";
  m9TvL2sP.soloFocus = m9TvL2sP.soloFocus === "window" ? "window" : "multibox";
  m9TvL2sP.mapGridEnabled = Boolean(m9TvL2sP.mapGridEnabled);
  m9TvL2sP.mapGridMode = m9TvL2sP.mapGridMode === "over" ? "over" : "bg";
  m9TvL2sP.crosshairEnabled = Boolean(m9TvL2sP.crosshairEnabled);
  m9TvL2sP.crosshairStyle =
    m9TvL2sP.crosshairStyle === "cross" ? "cross" : "plus";
  m9TvL2sP.cursorArrow = Boolean(m9TvL2sP.cursorArrow);
  m9TvL2sP.softColors = Boolean(m9TvL2sP.softColors);
  m9TvL2sP.extraFastFeeds = Array.isArray(m9TvL2sP.extraFastFeeds)
    ? m9TvL2sP.extraFastFeeds
        .filter((x) => x && typeof x === "object")
        .map((x) => ({
          delay: Math.max(50, Math.min(3000, Number(x.delay) || 800)),
          key: typeof x.key === "string" ? x.key : null,
        }))
    : [];
  m9TvL2sP.menuColor =
    typeof m9TvL2sP.menuColor === "string" &&
    /^#[0-9a-f]{6}$/i.test(m9TvL2sP.menuColor)
      ? m9TvL2sP.menuColor
      : null;
  m9TvL2sP.buttonsColor =
    typeof m9TvL2sP.buttonsColor === "string" &&
    /^#[0-9a-f]{6}$/i.test(m9TvL2sP.buttonsColor)
      ? m9TvL2sP.buttonsColor
      : null;
  m9TvL2sP.plexusColor =
    typeof m9TvL2sP.plexusColor === "string" &&
    /^#[0-9a-f]{6}$/i.test(m9TvL2sP.plexusColor)
      ? m9TvL2sP.plexusColor
      : null;
  m9TvL2sP.bypassEnabled = Boolean(m9TvL2sP.bypassEnabled);
  m9TvL2sP.bypassMethod = [
    "smart",
    "nearme",
    "cursor",
    "biggest",
    "lb",
  ].includes(m9TvL2sP.bypassMethod)
    ? m9TvL2sP.bypassMethod
    : "smart";
  const bpTtlVal = Number(m9TvL2sP.bypassTtl);
  m9TvL2sP.bypassTtl = Number.isFinite(bpTtlVal)
    ? Math.max(1500, Math.min(25000, Math.round(bpTtlVal)))
    : 8500;
  m9TvL2sP.bypassPhantoms = Boolean(m9TvL2sP.bypassPhantoms);
  m9TvL2sP.bypassRadar = Boolean(m9TvL2sP.bypassRadar);
  m9TvL2sP.bypassRadarMode =
    m9TvL2sP.bypassRadarMode === "fixed" ? "fixed" : "real";
  m9TvL2sP.bypassRadarLock = Boolean(m9TvL2sP.bypassRadarLock);
  m9TvL2sP.bypassMapX =
    typeof m9TvL2sP.bypassMapX === "number" &&
    Number.isFinite(m9TvL2sP.bypassMapX)
      ? m9TvL2sP.bypassMapX
      : null;
  m9TvL2sP.bypassMapY =
    typeof m9TvL2sP.bypassMapY === "number" &&
    Number.isFinite(m9TvL2sP.bypassMapY)
      ? m9TvL2sP.bypassMapY
      : null;
  const bpMapSzVal = Number(m9TvL2sP.bypassMapSize);
  m9TvL2sP.bypassMapSize = Number.isFinite(bpMapSzVal)
    ? Math.max(140, Math.min(440, Math.round(bpMapSzVal)))
    : 220;

  const t3LangList = [
    { code: "en", name: "English" },
    { code: "ru", name: "Русский" },
  ];

  const t3LangDict = {
    en: {
      cfg: "Settings",
      soloDel: "Solo-Trick Delay",
      ffDel: "Fast-Feed Delay",
      ffDelN: "Fast-Feed {n} Delay",
      ff: "Fast-Feed",
      ffAdd: "Add Fast-Feed",
      ffRem: "Remove",
      trick: "Trick",
      secRev: "AUTO-REV",
      tipRev:
        "The target cell must be fully visible and not hidden behind other cells or the screen edges. You MUST disable mass display, skins, and enemy nicknames; otherwise, the script will instantly fail and cause false triggers. Keep your camera completely static and avoid zooming during use. Note: There is a ~10ms processing delay with a slight margin of error, BUT it is built to work consistently across all future game updates",
      lock: "Lock Target",
      unlock: "Cancel Lock",
      revSp: "Rev Splits",
      revNot: "Select Rev Notify",
      posTop: "Top",
      posBot: "Bottom",
      selRev: "Select Rev",
      secOpt: "OPTIMIZATION",
      tipOpt:
        '"Frustum Culling" is the main switch that stops rendering off-screen entities to boost FPS. "Cull Margin" sets an extra pre-render buffer zone so cells appear smoothly. If "Frustum Culling" is OFF, margin settings will have no effect.',
      cull: "Frustum Culling",
      filt: "Strip Heavy Filters",
      marg: "Cull Margin",
      rScale: "Render Scale (%)",
      secBg: "MAP & BACKGROUND",

      mapBg: "Map Background",
      fixBg: "Fixed Background",
      fFile: "File",
      fUrl: "URL",
      promptUrl: "Enter image, video or color:",
      secMisc: "MISC",
      fixFeed: "Fix Feed Button",
      selTxt: "Selectable Text",
      secName: "NAME CHANGER",
      skinSt: "Skin Stealer",
      nameSt: "Name / Skin Stealer",
      custSw: "Custom Nick / Skin Switcher",
      menuBind: "Menu Bind",
      rst: "Reset",
      none: "None",
      rstAll: "Reset to Default",
      tut: "Tutorial & Guide",
      secIf: "INTERFACE",
      geo: "Geometric Effect",
      syncSz: "Sync Content with Menu Size",
      pillTr: "Transparent MULTIBOX Pill",
      secCol: "COLORS",
      mCol: "Menu Color",
      bCol: "Buttons & Scrollbar",
      secLang: "LANGUAGE",
      lang: "Language",
      secCfg: "CONFIG",
      cfgPh: "Paste config JSON here...",
      cfgCopy: "Copy Config",
      cfgApply: "Apply Config",
      cfgCopied: "Copied!",
      cfgApplied: "Applied!",
      cfgInvalid: "Invalid JSON",
      xhair: "Crosshair Cursor",
      xhPlus: "Plus (+)",
      xhCross: "Cross (×)",
      curArr: "Cursor Arrow",
      mapGrid: "Map Sector Grid",
      gridOver: "Over Canvas",
      gridBg: "Background",
      updRec: "Update available: v{n} (recommended)",
      softCol: "Soft Colors",
      revMtd: "Method",
      secFf: "FAST-FEED",
      secSolo: "SOLO-TRICK",
      soloFoc: "Focus",
      sfMb: "Multibox",
      sfWin: "Second Window",
      ffLock: "Lock / Unlock",
      ffAct: "Activate",
      ffMan: "Manual",
      ffAuto: "Auto",
      secBypass: "BYPASS VIEW DISTANCE",
      tipBypass:
        'First enable "Radar Map", adjust its position and size as you like, and then turn on "Lock Radar" so it does not get in the way during gameplay. If you are used to playing with two windows, you will need to switch to the built-in multibox because the second window is used to scout the map. Enabling "Enable" automatically opens an extra window, unless another Gota tab is already open. Once enabled, everything is already active, so in the second window you just join the same server and enter spectate manually, and the script handles the rest on its own.',
      bpEnable: "Enable",
      bpMethod: "Method",
      bpTtl: "Phantom Lifetime",
      bpPhantoms: "Phantoms",
      bpRadar: "Radar Map",
      bpRadReal: "Real",
      bpRadFixed: "Fixed",
      bpLockRadar: "Lock Radar",
      splitsLbl: "Splits",
      hmHold: "Hold Alt-Tab",
      hmDrop: "Stop Alt-Tab",
    },
    ru: {
      cfg: "Настройки",
      soloDel: "Задержка Соло-Трика",
      ffDel: "Задержка Fast-Feed",
      ffDelN: "Задержка Fast-Feed {n}",
      ff: "Fast-Feed",
      ffAdd: "Добавить Fast-Feed",
      ffRem: "Удалить",
      trick: "Трюк",
      secRev: "АВТО-РЕВ",
      tipRev:
        "Шар цели должен быть полностью виден, не закрыт другими шарами или краями экрана. Вы ОБЯЗАНЫ выключить показ массы, скины и ники врагов в настройках игры, иначе будут ложные срабатывания. Камера должна быть неподвижной, не зумите во время лока. Примечания: Есть задержка в ~10ms, но благодаря интересной реализации механики авто-рева, он не сломается при будущих обновлениях игры; больше двух сплитов (4 части) ставить не рекомендовано, так как вы тупо не успеете долететь до цели.",
      lock: "Захват цели",
      unlock: "Снять захват",
      revSp: "Сплиты рева",
      revNot: "Уведомление рева",
      posTop: "Верх",
      posBot: "Низ",
      selRev: "Выбор рева",
      secOpt: "ОПТИМИЗАЦИЯ",
      tipOpt:
        '"Отсечение за экраном" - главный переключатель, отключающий отрисовку объектов вне видимости для повышения FPS. "Отступ отсечения" задаёт запасную буферную зону предзагрузки, чтобы шары появлялись плавно. Если "Отсечение за экраном" выключено, настройки отступа не действуют.',
      cull: "Отсечение за экраном",
      filt: "Убрать тяжёлые фильтры",
      marg: "Отступ отсечения",
      rScale: "Масштаб рендера (%)",
      secBg: "КАРТА И ФОН",

      mapBg: "Фон карты",
      fixBg: "Статичный фон",
      fFile: "Файл",
      fUrl: "URL",
      promptUrl: "Введите ссылку на картинку, видео или цвет:",
      secMisc: "ПРОЧЕЕ",
      fixFeed: "Фикс кнопки фида",
      selTxt: "Выделение текста",
      secName: "СМЕНА НИКА",
      skinSt: "Стиллер скина",
      nameSt: "Стиллер ника / скина",
      custSw: "Свои ники / скины",
      menuBind: "Бинд меню",
      rst: "Сброс",
      none: "Нет",
      rstAll: "Сбросить всё",
      tut: "Гайд и обучение",
      secIf: "ИНТЕРФЕЙС",
      geo: "Геометрический эффект",
      syncSz: "Масштаб под размер меню",
      pillTr: "Прозрачная кнопка MULTIBOX",
      secCol: "ЦВЕТА",
      mCol: "Цвет меню",
      bCol: "Кнопки и скроллбар",
      secLang: "ЯЗЫК",
      lang: "Язык",
      secCfg: "КОНФИГ",
      cfgPh: "Вставьте JSON конфига сюда...",
      cfgCopy: "Копировать",
      cfgApply: "Применить",
      cfgCopied: "Скопировано!",
      cfgApplied: "Применено!",
      cfgInvalid: "Неверный JSON",
      xhair: "Курсор-прицел",
      xhPlus: "Плюсик (+)",
      xhCross: "Крестик (×)",
      curArr: "Стрелка к курсору",
      mapGrid: "Сетка секторов",
      gridOver: "Поверх канваса",
      gridBg: "Задний фон",
      updRec: "Доступно обновление: v{n} (рекомендуется)",
      softCol: "Мягкие цвета",
      revMtd: "Метод",
      secFf: "FAST-FEED",
      secSolo: "SOLO-TRICK",
      soloFoc: "Фокус",
      sfMb: "Мультибокс",
      sfWin: "Второе окно",
      ffLock: "Лок / Анлок",
      ffAct: "Активация",
      ffMan: "Ручной",
      ffAuto: "Авто",
      secBypass: "ОБХОД ДАЛЬНОСТИ ОБЗОРА",
      tipBypass:
        'Сначала включите "Радар-карта", настройте его положение и размер как вам удобно, и после этого включите "Зафиксировать радар", чтобы он не мешал при геймплее. Если вы привыкли играть через два окна, придётся переучиться на внутренний мультибокс, потому что второе окно здесь занято обзором карты. При включении главного тогла автоматически открывается дополнительное окно, но если другая вкладка готы уже запущена, новое окно не откроется. После включения всё уже работает, так что во втором окне остаётся только зайти на тот же сервер и вручную зайти в наблюдатели, а дальше скрипт сделает всё сам.',
      bpEnable: "Включить",
      bpMethod: "Метод",
      bpTtl: "Время жизни фантомов",
      bpPhantoms: "Фантомы",
      bpRadar: "Радар-карта",
      bpRadReal: "Реальный",
      bpRadFixed: "Фикс.",
      bpLockRadar: "Зафиксировать радар",
      splitsLbl: "Сплиты",
      hmHold: "Фон: Держать",
      hmDrop: "Фон: Сброс",
    },
  };

  if (typeof m9TvL2sP.lang !== "string" || !t3LangDict[m9TvL2sP.lang])
    m9TvL2sP.lang = "en";

  function k3Tr(k, n) {
    const d = t3LangDict[m9TvL2sP.lang] || t3LangDict.en;
    let s = d[k] !== undefined ? d[k] : t3LangDict.en[k] || k;
    if (n !== undefined) s = s.replace("{n}", String(n));
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

  let e7CfgBoxSync = null;
  let b6BcSyncFn = null;
  let b6RebuildFfFn = null;
  let b6ApplyLangFn = null;
  let b6ClearPalHistFn = null;
  let b6NormCfgFn = null;
  let b6BpWinEl = null;
  const b6SyncKeys = [
    "soloDelay",
    "soloFocus",
    "autoDelay",
    "keyMenu",
    "ffMethod",
    "keyAuto",
    "keyFfLock",
    "keyFfActivate",
    "extraFastFeeds",
    "keyT2",
    "keyT4",
    "keyT8",
    "keyT16",
    "keyT32",
    "keyT64",
    "keyT128",
    "keyT256",
    "keyRevLock",
    "keyRevUnlock",
    "keyRevSplit1",
    "keyRevSplit2",
    "keyRevSplit3",
    "keyRevSplit4",
    "keyRevSplit5",
    "keyRevSplit6",
    "keyRevSplit7",
    "keyRevSplit8",
    "keyHoldSpam",
    "holdSpamMode",
    "revSplits",
    "revMethod",
    "skinStealer",
    "nameStealer",
    "customSwitcher",
    "customNicks",
    "frustumCulling",
    "stripFilters",
    "cullMarginToggle",
    "cullMargin",
    "renderScaleToggle",
    "renderScale",
    "mapBgEnabled",
    "fixedBackgroundEnabled",
    "mapBgSrc",
    "fixedBgSrc",
    "mapGridEnabled",
    "mapGridMode",
    "crosshairEnabled",
    "crosshairStyle",
    "cursorArrow",
    "softColors",
    "plexusEnabled",
    "syncScale",
    "pillTransparent",
    "revNotify",
    "revNotifyPos",
    "selectableText",
    "bypassEnabled",
    "bypassMethod",
    "bypassTtl",
    "bypassPhantoms",
    "bypassRadar",
    "bypassRadarMode",
    "bypassRadarLock",
    "bypassMapX",
    "bypassMapY",
    "bypassMapSize",
    "menuColor",
    "buttonsColor",
    "plexusColor",
    "lang",
  ];

  function e7BuildCfgJson() {
    const out = {};
    const ks = Object.keys(z4XqW8mT);
    for (let i = 0; i < ks.length; i++) out[ks[i]] = m9TvL2sP[ks[i]];
    return JSON.stringify(out, null, 2);
  }

  function x3QnK8wR() {
    try {
      localStorage.setItem("gota_macro_overlay_v2", JSON.stringify(m9TvL2sP));
    } catch (e) {}
    if (e7CfgBoxSync) e7CfgBoxSync(false);
    if (b6BcSyncFn) b6BcSyncFn();
  }

  function k2DbOp() {
    return new Promise((res, rej) => {
      if (!window.indexedDB) {
        rej();
        return;
      }
      const rq = indexedDB.open("gota_macro_bg_db", 1);
      rq.onupgradeneeded = () => {
        const db = rq.result;
        if (!db.objectStoreNames.contains("bg")) db.createObjectStore("bg");
      };
      rq.onsuccess = () => res(rq.result);
      rq.onerror = () => rej(rq.error);
    });
  }

  function k2DbPut(k, file, isVid) {
    return k2DbOp()
      .then(
        (db) =>
          new Promise((res, rej) => {
            const tx = db.transaction("bg", "readwrite");
            tx.objectStore("bg").put({ file, isVid }, k);
            tx.oncomplete = () => {
              db.close();
              res();
            };
            tx.onerror = () => {
              db.close();
              rej(tx.error);
            };
          }),
      )
      .catch(() => {});
  }

  function k2DbGet(k) {
    return k2DbOp()
      .then(
        (db) =>
          new Promise((res, rej) => {
            const tx = db.transaction("bg", "readonly");
            const rq = tx.objectStore("bg").get(k);
            rq.onsuccess = () => {
              db.close();
              res(rq.result || null);
            };
            rq.onerror = () => {
              db.close();
              rej(rq.error);
            };
          }),
      )
      .catch(() => null);
  }

  function k2DbDel(k) {
    return k2DbOp()
      .then(
        (db) =>
          new Promise((res, rej) => {
            const tx = db.transaction("bg", "readwrite");
            tx.objectStore("bg").delete(k);
            tx.oncomplete = () => {
              db.close();
              res();
            };
            tx.onerror = () => {
              db.close();
              rej(tx.error);
            };
          }),
      )
      .catch(() => {});
  }

  function k2DbClr() {
    return k2DbOp()
      .then(
        (db) =>
          new Promise((res, rej) => {
            const tx = db.transaction("bg", "readwrite");
            tx.objectStore("bg").clear();
            tx.oncomplete = () => {
              db.close();
              res();
            };
            tx.onerror = () => {
              db.close();
              rej(tx.error);
            };
          }),
      )
      .catch(() => {});
  }

  function k2DataToBlob(uri) {
    try {
      const clean = uri.split("#")[0];
      const sp = clean.indexOf(",");
      if (sp < 0) return null;
      const meta = clean.slice(5, sp);
      const mime = meta.split(";")[0] || "application/octet-stream";
      const raw = meta.includes(";base64")
        ? atob(clean.slice(sp + 1))
        : decodeURIComponent(clean.slice(sp + 1));
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
    const idbKey = "idb:" + dbKey;
    if (val === idbKey || val.startsWith(idbKey + ":")) {
      k2DbGet(dbKey).then((rec) => {
        if (rec && rec.file && m9TvL2sP[srcKey] === val) {
          setFn(
            URL.createObjectURL(rec.file) +
              (rec.isVid ? "#type=video" : "#type=image"),
          );
        } else if (m9TvL2sP[srcKey] === val) {
          m9TvL2sP[srcKey] = null;
          m9TvL2sP[enKey] = false;
          x3QnK8wR();
          if (document.getElementById("macro-window")) r8QnM4tL();
        }
      });
      return;
    }
    if (
      typeof val === "string" &&
      val.startsWith("data:") &&
      val.length > 4096
    ) {
      const bl = k2DataToBlob(val);
      if (bl) {
        const isVid =
          val.includes("#type=video") || bl.type.startsWith("video/");
        m9TvL2sP[srcKey] = "idb:" + dbKey;
        x3QnK8wR();
        k2DbPut(dbKey, bl, isVid);
        setFn(
          URL.createObjectURL(bl) + (isVid ? "#type=video" : "#type=image"),
        );
        return;
      }
    }
    setFn(val);
  }

  k2LoadBg("mapBgSrc", "map", window.setMapBackground, "mapBgEnabled");
  k2LoadBg(
    "fixedBgSrc",
    "fixed",
    window.setFixedBackground,
    "fixedBackgroundEnabled",
  );

  const v8WpM2tL = Math.random().toString(36).substring(2);
  const q5RzL9wK = new BroadcastChannel("gota_multibox_overlay_v2_sync");

  let c7TnW1xP = null,
    b3SilBuf = null,
    g8KeepOn = false;
  function p2LxQ8vM() {
    try {
      if (!c7TnW1xP) {
        const aCls = window.AudioContext || window.webkitAudioContext;
        if (!aCls) return;
        try {
          c7TnW1xP = new aCls({ latencyHint: "interactive" });
        } catch (_) {
          c7TnW1xP = new aCls();
        }
        const osc = c7TnW1xP.createOscillator(),
          gn = c7TnW1xP.createGain();
        osc.type = "sine";
        osc.frequency.value = 25;
        gn.gain.value = 0.002;
        osc.connect(gn);
        gn.connect(c7TnW1xP.destination);
        osc.start();
        b3SilBuf = c7TnW1xP.createBuffer(1, 128, c7TnW1xP.sampleRate);
        c7TnW1xP.onstatechange = () => {
          if (c7TnW1xP && c7TnW1xP.state === "suspended" && g8KeepOn) {
            c7TnW1xP.resume().catch(() => {});
          }
        };
      }
      g8KeepOn = true;
      if (c7TnW1xP.state === "suspended") c7TnW1xP.resume().catch(() => {});
    } catch (e) {}
  }
  ["keydown", "pointerdown", "mousedown", "touchstart", "focus"].forEach((ev) =>
    window.addEventListener(ev, p2LxQ8vM, { passive: true, capture: true }),
  );
  document.addEventListener(
    "visibilitychange",
    () => {
      if (g8KeepOn) p2LxQ8vM();
    },
    { passive: true },
  );

  const g6VwN3tK = new Worker(
    URL.createObjectURL(
      new Blob(
        [
          `
      let hB=null;
      self.onmessage=e=>{
        const m=e.data;
        if(m.type==='startHeartbeat'&&!hB)hB=setInterval(()=>self.postMessage({type:'pulse'}),m.interval||30);
      };
    `,
        ],
        { type: "application/javascript" },
      ),
    ),
  );

  g6VwN3tK.onmessage = function (e) {
    const m = e.data;
    if (m.type === "pulse") {
      if (
        m9TvL2sP.holdSpamMode !== "release" &&
        !k4FeedLock &&
        hSt2xK9m &&
        (!document.hasFocus() || document.hidden)
      ) {
        hEv2xK9m(hSt2xK9m, hSt2xK9m.kind === "key" ? "keydown" : "mousedown");
      }
      if ((!document.hasFocus() || document.hidden) && f5TxL9wK && !b5TxM1wP) {
        b5TxM1wP = true;
        try {
          j8PnL4wV++;
          p3WnK7vT();
        } finally {
          b5TxM1wP = false;
        }
      }
      if (b6TickScan) b6TickScan();
    }
  };
  g6VwN3tK.postMessage({ type: "startHeartbeat", interval: 20 });

  const f2QpL8xN = new Worker(
    URL.createObjectURL(
      new Blob(
        [
          `
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
    `,
        ],
        { type: "application/javascript" },
      ),
    ),
  );

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
        try {
          s.onended = null;
          s.stop(0);
          s.disconnect();
        } catch (_) {}
      }
    }

    function armAudio(remMs) {
      if (
        done ||
        aSrc ||
        !c7TnW1xP ||
        c7TnW1xP.state !== "running" ||
        !b3SilBuf
      )
        return;
      try {
        const s = c7TnW1xP.createBufferSource();
        s.buffer = b3SilBuf;
        s.loop = true;
        s.connect(c7TnW1xP.destination);
        aSrc = s;
        s.onended = () => {
          if (aSrc === s) aSrc = null;
          try {
            s.disconnect();
          } catch (_) {}
          if (!done) chk();
        };
        s.start(0);
        s.stop(c7TnW1xP.currentTime + Math.max(0.001, (remMs + 2.5) / 1000));
      } catch (_) {
        aSrc = null;
      }
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
    if (c7TnW1xP && c7TnW1xP.state === "suspended") {
      c7TnW1xP
        .resume()
        .then(() => {
          if (!done && !aSrc) {
            const r = tgt - performance.now();
            if (r <= 2.0) chk();
            else armAudio(r);
          }
        })
        .catch(() => {});
    }
    return () => {
      if (!done) {
        done = true;
        cln();
      }
    };
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

  const v4OrigU8 = window.Uint8Array;
  const v4WsCells = new Map();
  const v4PtyOids = new Set();
  const v4SelfOids = new Set();
  const v4SeenBuf = new WeakSet();
  let v4MyOid = 0;
  let v4ActOid = 0;
  let v4OwnSeen = false;
  const nFfMinMassPct = 15;
  const nFfSurgeMs = 805;
  const nFfSurgeLeadMs = 55;
  const nFfSurgeReach = 950;
  const v4WsCam = {
    x: 0,
    y: 0,
    z: 0.3333,
    dx: 0,
    dy: 0,
    dz: 0.3333,
    at: 0,
    init: false,
  };
  let v4InterpAt = 0;
  let v4WsLock = null;
  let v4FfLock = null;
  let v4FfAuto = null;
  let v4FfRadMul = 1;
  const v4FfVis = { active: false, cx: 0, cy: 0, r: 0, alpha: 0, pop: 1.0 };
  let v4InU8 = false;
  let v4U8ProxyRef = null;
  const b6ModeList = ["smart", "nearme", "cursor", "biggest", "lb"];
  const b6ScanIntMs = 520;
  const b6BpSt = {
    scanning: false,
    inMatch: false,
    specEntered: false,
    wasAlive: false,
    bounds: [-9000, -9000, 9000, 9000],
    camX: 0,
    camY: 0,
    camZoom: 0.1,
    camAt: 0,
    liveAoi: null,
    safeAoi: null,
    mainAoi: null,
    mainSelf: null,
    mainCursor: null,
    lb: [],
    curSpecNick: "",
    curSpecOid: 0,
    got46At: 0,
    got02After46: false,
    hopFlushSent: false,
    lastAggAt: 0,
    bestSpecOid: 0,
    bestSpecNick: "",
    bestSpecArea: 0,
    bestSpecAt: 0,
    bestSpecAoi: null,
    curHoldMs: 0,
    aoiHalfW: 700,
    aoiHalfH: 450,
    safeHalfW: 700,
    safeHalfH: 450,
    avgSpecHW: 2600,
    avgSpecHH: 2600,
    menuHid: false,
    menuChkAt: 0,
    rcCache: null,
    rcChkAt: 0,
    lastPruneAt: 0,
    lastRxAt: 0,
    bcAt: 0,
    mainBcAt: 0,
    lastOvAt: 0,
    lastRdAt: 0,
    bcPending: false,
    phase: "idle",
    phaseUntil: 0,
    sentAt: 0,
    lastClickAt: 0,
    landedAt: 0,
    holdUntil: 0,
    needPeek: false,
    wasPeek: false,
    nextIsPeek: false,
    returnToBest: false,
    pendKind: "lb",
    pendCid: 0,
    pendOid: 0,
    pendNick: "",
    rrIdx: 0,
    cvsMiss: 0,
    cancelTm: null,
    curRole: "menu",
    menuHidAt: 0,
    lastPlayAt: 0,
    lastPingAt: 0,
    enableGraceUntil: m9TvL2sP.bypassEnabled ? performance.now() + 5000 : 0,
  };

  const b6Plrs = new Map();
  const b6DelTs = new Map();
  const b6SeenOid = new Map();
  const b6OidAgg = new Map();
  const b6OidAoi = new Map();
  const b6SpecOid = new Map();
  const b6SpecNick = new Map();
  const b6BadOid = new Map();
  const b6Claims = new Map();
  const b6GridTs = new Float64Array(36);
  const b6NearTs = new Float64Array(8);
  const b6SentPlr = new Map();
  const b6Phantoms = new Map();
  const b6RemPlrs = new Map();
  const b6LblCache = new Map();
  let b6BpOvCv = null;
  let b6BpOvCtx = null;
  let b6BpRdCv = null;
  let b6BpRdCtx = null;
  let b6BpMapWin = null;
  let b6BpOvDirty = false;
  let b6TickScan = null;
  let b6FitMapWin = null;
  let b6SyncRadarLock = null;

  function q9ReadSelfOid() {
    if (b6BpSt.specEntered) return 0;
    const el = document.getElementById("playerId");
    const id = el ? parseInt((el.textContent || "").trim(), 10) : 0;
    if (Number.isSafeInteger(id) && id > 0) {
      v4SelfOids.add(id);
      return id;
    }
    if (v4ActOid > 0) {
      v4SelfOids.add(v4ActOid);
      return v4ActOid;
    }
    return 0;
  }

  function q9CntParts(oid) {
    if (!oid) return 0;
    let c = 0;
    for (const v of v4WsCells.values()) {
      if (v.tag === 2 && v.oid === oid) c++;
    }
    return c;
  }

  function k2WsDead() {
    if (b6BpSt.specEntered) return true;
    const mp = document.getElementById("main-panel");
    if (mp && window.getComputedStyle(mp).display !== "none") return true;
    let own = 0;
    if (v4SelfOids.size > 0) {
      for (const oid of v4SelfOids) own += q9CntParts(oid);
    }
    if (own > 0) return false;
    const sp =
      s8XnL3wP && document.contains(s8XnL3wP)
        ? s8XnL3wP
        : (s8XnL3wP =
            document.getElementById("score-panel") ||
            document.getElementById("stats") ||
            document.querySelector('[id*="score"]') ||
            document.querySelector(".main-bottom-stats"));
    if (sp) {
      const m = (sp.textContent || "").match(/Mass\s*:\s*([0-9\s,]+)/i);
      if (m) {
        const val = parseInt(m[1].replace(/[\s,]/g, ""), 10);
        if (val <= 0 || isNaN(val)) return true;
      }
    }
    if (v4OwnSeen && v4SelfOids.size > 0) return true;
    return false;
  }

  function q9SkU16(vw, p, len) {
    while (true) {
      if (p + 2 > len) return -1;
      const ch = vw.getUint16(p, true);
      p += 2;
      if (ch === 0) return p;
    }
  }

  function q9SkU8(vw, p, len) {
    while (true) {
      if (p + 1 > len) return -1;
      if (vw.getUint8(p++) === 0) return p;
    }
  }

  function b6RdU16Str(vw, p, len, eofOk) {
    let s = "";
    while (p + 2 <= len) {
      const ch = vw.getUint16(p, true);
      p += 2;
      if (ch === 0) return { s, p };
      s += String.fromCharCode(ch);
    }
    return eofOk && s.length > 0 ? { s, p } : null;
  }

  function p9WsWorld(u8, vw, len) {
    let p = 1;
    if (p + 2 > len) return false;
    const remN = vw.getUint16(p, true);
    p += 2;
    if (p + remN * 2 > len) return false;
    const remPlrs = [];
    for (let i = 0; i < remN; i++) {
      remPlrs.push(vw.getUint16(p, true));
      p += 2;
    }

    if (p + 2 > len) return false;
    const delN = vw.getUint16(p, true);
    p += 2;
    if (p + delN * 2 > len) return false;
    const dels = [];
    for (let i = 0; i < delN; i++) {
      dels.push(vw.getUint16(p, true));
      p += 2;
    }

    const newPlrs = [];
    while (true) {
      if (p + 2 > len) return false;
      const oid = vw.getUint16(p, true);
      p += 2;
      if (oid === 0) break;
      if (p + 3 > len) return false;
      const rgb = [vw.getUint8(p), vw.getUint8(p + 1), vw.getUint8(p + 2)];
      p += 3;
      const nm = b6RdU16Str(vw, p, len);
      if (!nm) return false;
      p = nm.p;
      p = q9SkU8(vw, p, len);
      if (p < 0 || p + 1 > len) return false;
      const pEx = vw.getUint8(p++);
      if (pEx === 0x02) {
        if (p + 5 > len) return false;
        p += 5;
      } else if (pEx !== 0x00) {
        return false;
      }
      newPlrs.push({ oid, name: nm.s, rgb });
    }

    let pMinX = Infinity,
      pMinY = Infinity,
      pMaxX = -Infinity,
      pMaxY = -Infinity;
    let fMinX = Infinity,
      fMinY = Infinity,
      fMaxX = -Infinity,
      fMaxY = -Infinity;
    const adds = [];
    while (true) {
      if (p + 1 > len) return false;
      const tag = vw.getUint8(p++);
      if (tag === 0) break;
      if (tag === 6) {
        while (true) {
          if (p + 2 > len) return false;
          const cid = vw.getUint16(p, true);
          p += 2;
          if (cid === 0) break;
          if (p + 4 > len) return false;
          const px = vw.getInt16(p, true),
            py = vw.getInt16(p + 2, true);
          if (px < pMinX) pMinX = px;
          if (px > pMaxX) pMaxX = px;
          if (py < pMinY) pMinY = py;
          if (py > pMaxY) pMaxY = py;
          if (px < fMinX) fMinX = px;
          if (px > fMaxX) fMaxX = px;
          if (py < fMinY) fMinY = py;
          if (py > fMaxY) fMaxY = py;
          p += 4;
        }
      } else if (tag === 1) {
        while (true) {
          if (p + 2 > len) return false;
          const cid = vw.getUint16(p, true);
          p += 2;
          if (cid === 0) break;
          if (p + 10 > len) return false;
          adds.push({
            cid,
            tag: 1,
            oid: 0,
            x: vw.getInt16(p, true),
            y: vw.getInt16(p + 2, true),
            r: vw.getUint16(p + 4, true),
          });
          p += 10;
        }
      } else if (tag === 3 || tag === 4) {
        while (true) {
          if (p + 2 > len) return false;
          const cid = vw.getUint16(p, true);
          p += 2;
          if (cid === 0) break;
          if (p + 6 > len) return false;
          const px = vw.getInt16(p, true),
            py = vw.getInt16(p + 2, true),
            pr = vw.getUint16(p + 4, true);
          if (px < pMinX) pMinX = px;
          if (px > pMaxX) pMaxX = px;
          if (py < pMinY) pMinY = py;
          if (py > pMaxY) pMaxY = py;
          adds.push({ cid, tag, oid: 0, x: px, y: py, r: pr });
          p += 6;
        }
      } else if (tag === 2) {
        while (true) {
          if (p + 2 > len) return false;
          const oid = vw.getUint16(p, true);
          p += 2;
          if (oid === 0) break;
          while (true) {
            if (p + 2 > len) return false;
            const cid = vw.getUint16(p, true);
            p += 2;
            if (cid === 0) break;
            if (p + 6 > len) return false;
            const px = vw.getInt16(p, true),
              py = vw.getInt16(p + 2, true),
              pr = vw.getUint16(p + 4, true);
            if (px < pMinX) pMinX = px;
            if (px > pMaxX) pMaxX = px;
            if (py < pMinY) pMinY = py;
            if (py > pMaxY) pMaxY = py;
            adds.push({ cid, tag: 2, oid, x: px, y: py, r: pr });
            p += 6;
          }
        }
      } else {
        return false;
      }
    }

    const upds = [];
    while (true) {
      if (p + 1 > len) return false;
      const uTag = vw.getUint8(p++);
      if (uTag === 0) break;
      if (uTag === 2 || uTag === 3 || uTag === 4) {
        while (true) {
          if (p + 2 > len) return false;
          const cid = vw.getUint16(p, true);
          p += 2;
          if (cid === 0) break;
          if (p + 6 > len) return false;
          const px = vw.getInt16(p, true),
            py = vw.getInt16(p + 2, true),
            pr = vw.getUint16(p + 4, true);
          if (px < pMinX) pMinX = px;
          if (px > pMaxX) pMaxX = px;
          if (py < pMinY) pMinY = py;
          if (py > pMaxY) pMaxY = py;
          upds.push({ cid, tag: uTag, x: px, y: py, r: pr });
          p += 6;
        }
      } else if (uTag === 1) {
        while (true) {
          if (p + 2 > len) return false;
          const cid = vw.getUint16(p, true);
          p += 2;
          if (cid === 0) break;
          if (p + 4 > len) return false;
          p += 4;
        }
      } else if (uTag === 6) {
        while (true) {
          if (p + 2 > len) return false;
          const cid = vw.getUint16(p, true);
          p += 2;
          if (cid === 0) break;
          if (p + 4 > len) return false;
          const px = vw.getInt16(p, true),
            py = vw.getInt16(p + 2, true);
          if (px < pMinX) pMinX = px;
          if (px > pMaxX) pMaxX = px;
          if (py < pMinY) pMinY = py;
          if (py > pMaxY) pMaxY = py;
          if (px < fMinX) fMinX = px;
          if (px > fMaxX) fMaxX = px;
          if (py < fMinY) fMinY = py;
          if (py > fMaxY) fMaxY = py;
          p += 4;
        }
      } else {
        return false;
      }
    }

    if (len - p !== 2 || (vw.getUint8(p) | vw.getUint8(p + 1)) !== 0)
      return false;

    if (v4WsLock && !v4WsLock.ownerId) {
      const c = v4WsCells.get(v4WsLock.cellId);
      if (c && c.tag === 2 && c.oid) v4WsLock.ownerId = c.oid;
    }
    if (v4FfLock && !v4FfLock.ownerId) {
      const c = v4WsCells.get(v4FfLock.cellId);
      if (c && c.tag === 2 && c.oid) v4FfLock.ownerId = c.oid;
    }

    const delSet = new Set(dels);
    const remSet = new Set(remPlrs);
    const prevFfLk = v4FfLock ? v4WsCells.get(v4FfLock.cellId) : null;
    let newFfCid = 0;
    if (
      v4FfLock &&
      v4FfLock.ownerId &&
      !delSet.has(v4FfLock.cellId) &&
      !remSet.has(v4FfLock.ownerId) &&
      prevFfLk &&
      prevFfLk.tag === 2 &&
      prevFfLk.r > 0
    ) {
      let lkUpd = null;
      for (let i = 0; i < upds.length; i++) {
        if (upds[i].tag === 2 && upds[i].cid === v4FfLock.cellId) {
          lkUpd = upds[i];
          break;
        }
      }
      if (
        lkUpd &&
        lkUpd.r < prevFfLk.r &&
        1 - (lkUpd.r * lkUpd.r) / (prevFfLk.r * prevFfLk.r) >= 0.25
      ) {
        const maxD = Math.max(
          prevFfLk.r * v4FfRadMul * 1.6,
          prevFfLk.r * v4FfRadMul + 180,
        );
        let bestScore = Infinity;
        for (let i = 0; i < adds.length; i++) {
          const a = adds[i];
          if (a.tag !== 2 || a.oid !== v4FfLock.ownerId || v4WsCells.has(a.cid))
            continue;
          const d = Math.hypot(a.x - lkUpd.x, a.y - lkUpd.y);
          if (d > maxD) continue;
          const score = d + Math.abs(a.r - lkUpd.r) * 3;
          if (score < bestScore) {
            bestScore = score;
            newFfCid = a.cid;
          }
        }
      }
    }
    let triggered = false;

    if (m9TvL2sP.revMethod === "ws" && v4WsLock && v4WsLock.ownerId) {
      if (k2WsDead() || remSet.has(v4WsLock.ownerId)) {
        q2WnS7xM(true);
      } else {
        const newCells = [];
        for (let i = 0; i < adds.length; i++) {
          const a = adds[i];
          if (
            a.tag === 2 &&
            a.oid === v4WsLock.ownerId &&
            !v4WsCells.has(a.cid)
          ) {
            newCells.push(a);
          }
        }
        if (newCells.length > 0) {
          let hit = false;
          for (let i = 0; i < upds.length; i++) {
            const u = upds[i];
            if (u.tag !== 2) continue;
            const prev = v4WsCells.get(u.cid);
            if (!prev || prev.tag !== 2 || prev.oid !== v4WsLock.ownerId)
              continue;
            if (delSet.has(u.cid) || prev.r <= 0 || u.r >= prev.r) continue;
            if (1 - (u.r * u.r) / (prev.r * prev.r) < 0.25) continue;
            const maxD = Math.max(prev.r * 6, prev.r + 900);
            if (
              newCells.some((a) => Math.hypot(a.x - u.x, a.y - u.y) <= maxD)
            ) {
              hit = true;
              break;
            }
          }
          if (hit) {
            h8WpM2vQ();
            triggered = true;
          }
        }
      }
    }

    const nw02 = performance.now();
    const nowWall = Date.now();
    for (let i = 0; i < newPlrs.length; i++) {
      const pl = newPlrs[i];
      b6Plrs.set(pl.oid, { oid: pl.oid, name: pl.name, rgb: pl.rgb, at: nw02 });
      b6SentPlr.delete(pl.oid);
    }
    const locBox = b6SafeBox();
    const hasLocBox = Boolean(
      locBox &&
      locBox.maxX - locBox.minX > 900 &&
      locBox.maxY - locBox.minY > 900,
    );
    const keepLocPh =
      !b6BpSt.scanning &&
      !b6BpSt.specEntered &&
      (m9TvL2sP.bypassPhantoms || m9TvL2sP.bypassRadar) &&
      hasLocBox &&
      b6IsMenuHidden() &&
      (adds.length > 0 ||
        dels.length + remPlrs.length < Math.max(4, v4WsCells.size));
    const pushLocPh = (c) => {
      if (
        !keepLocPh ||
        !c ||
        v4SelfOids.has(c.oid) ||
        !(c.tag === 3 || c.tag === 4 || (c.tag === 2 && c.r >= 10)) ||
        b6InBox(c.x, c.y, locBox, 180)
      )
        return;
      b6BpSt.lastRxAt = nw02;
      b6Phantoms.set(c.cid, {
        cid: c.cid,
        tag: c.tag,
        oid: c.oid,
        dx: c.x,
        dy: c.y,
        dr: c.r,
        tx: c.x,
        ty: c.y,
        tr: c.r,
        vx: c.vx || 0,
        vy: c.vy || 0,
        vInit: Boolean(c.vx || c.vy),
        ts: nowWall,
        rxAt: nw02,
      });
    };
    for (let i = 0; i < dels.length; i++) {
      const cid = dels[i];
      const dc = v4WsCells.get(cid);
      if (dc) {
        pushLocPh(dc);
        v4WsCells.delete(cid);
      }
      b6DelTs.set(cid, nowWall);
    }
    if (remSet.size > 0) {
      for (const [cid, c] of v4WsCells) {
        if (c.tag === 2 && remSet.has(c.oid)) {
          pushLocPh(c);
          v4WsCells.delete(cid);
          b6DelTs.set(cid, nowWall);
        }
      }
    }
    let gotFfSplit = false;
    for (let i = 0; i < adds.length; i++) {
      const a = adds[i];
      if (
        v4FfAuto &&
        a.tag === 2 &&
        a.oid === v4FfAuto.initOid &&
        !v4FfAuto.preCids.has(a.cid) &&
        !v4FfAuto.splitConfirmed
      ) {
        v4FfAuto.splitConfirmed = true;
        gotFfSplit = true;
      }
      a.dx = a.x;
      a.dy = a.y;
      a.dr = a.r;
      a.vx = 0;
      a.vy = 0;
      a.at = nw02;
      v4WsCells.set(a.cid, a);
      b6Phantoms.delete(a.cid);
      if (a.tag === 2 && a.oid) b6SeenOid.set(a.oid, nw02);
    }
    for (let i = 0; i < upds.length; i++) {
      const u = upds[i];
      const ex = v4WsCells.get(u.cid);
      if (ex) {
        const dtS = ex.at ? (nw02 - ex.at) * 0.001 : 0;
        if (dtS >= 0.015 && dtS <= 0.6) {
          const nvx = (u.x - ex.x) / dtS;
          const nvy = (u.y - ex.y) / dtS;
          if (Math.hypot(nvx, nvy) < 4200) {
            ex.vx = ex.at ? (ex.vx || 0) * 0.45 + nvx * 0.55 : nvx;
            ex.vy = ex.at ? (ex.vy || 0) * 0.45 + nvy * 0.55 : nvy;
          }
        }
        if (ex.dx === undefined) {
          ex.dx = ex.x;
          ex.dy = ex.y;
          ex.dr = ex.r;
        }
        ex.at = nw02;
        ex.x = u.x;
        ex.y = u.y;
        ex.r = u.r;
        if (ex.tag === 2 && ex.oid) b6SeenOid.set(ex.oid, nw02);
      }
    }

    if (newFfCid && v4FfLock) {
      v4FfLock.cellId = newFfCid;
      if (v4FfAuto) v4FfAuto.targetCid = newFfCid;
    } else if (
      v4FfLock &&
      !remSet.has(v4FfLock.ownerId) &&
      !v4WsCells.has(v4FfLock.cellId) &&
      prevFfLk
    ) {
      let mCid = 0;
      let mBestD = Infinity;
      const prevR = prevFfLk.r * v4FfRadMul;
      for (const c of v4WsCells.values()) {
        if (c.tag !== 2 || c.oid !== v4FfLock.ownerId) continue;
        const d = Math.hypot(c.x - prevFfLk.x, c.y - prevFfLk.y);
        if (d <= prevR + c.r * v4FfRadMul + 300 && d < mBestD) {
          mBestD = d;
          mCid = c.cid;
        }
      }
      if (mCid) {
        v4FfLock.cellId = mCid;
        if (v4FfAuto) v4FfAuto.targetCid = mCid;
      }
    }

    const sOid = q9ReadSelfOid() || v4MyOid;
    if (sOid && q9CntParts(sOid) > 0) {
      v4OwnSeen = true;
      if (!b6BpSt.specEntered) b6BpSt.wasAlive = true;
    }

    b6OnWorldTick(
      adds.length,
      dels.length,
      remPlrs.length,
      pMinX,
      pMinY,
      pMaxX,
      pMaxY,
      fMinX,
      fMinY,
      fMaxX,
      fMaxY,
      nw02,
      nowWall,
    );

    if (!triggered && m9TvL2sP.revMethod === "ws" && v4WsLock) {
      if (
        k2WsDead() ||
        (v4WsLock.ownerId && q9CntParts(v4WsLock.ownerId) === 0) ||
        !v4WsCells.has(v4WsLock.cellId)
      ) {
        q2WnS7xM(true);
      }
    }

    if (v4FfLock) {
      if (k2WsDead() || !v4WsCells.has(v4FfLock.cellId)) {
        k4FfCancel(true);
      }
    }

    if (v4FfAuto && gotFfSplit) {
      if (v4FfAuto.cancelFire) v4FfAuto.cancelFire();
      const hudPing = g5ReadPingMs();
      const rttEst = performance.now() - v4FfAuto.t0;
      const pingEst = hudPing > 0 ? hudPing : Math.max(30, rttEst - 20);
      const delayFromAdd1 = Math.max(
        360,
        nFfSurgeMs - pingEst - nFfSurgeLeadMs + v4FfAuto.radBoost,
      );
      const genSnap = v4FfAuto.gen;
      v4FfAuto.cancelFire = k7RunDelay(
        delayFromAdd1,
        () => k4FfOnTimer(genSnap),
        50,
      );
    }

    if (v4FfAuto && v4FfAuto.waitReach) {
      if (k2WsDead() || !v4FfLock) {
        k4FfCancel(true);
      } else {
        const dtNow = performance.now() - v4FfAuto.t0;
        const minGap = w4FfMinGap(v4FfAuto.initOid, v4FfAuto.targetCid);
        const reachLim =
          dtNow > 1200
            ? 300
            : Math.max(nFfSurgeReach, v4FfAuto.preMaxR * 0.72 + 250);
        if (Number.isFinite(minGap) && minGap <= reachLim) {
          k4FfFire2(v4FfAuto.gen);
        }
      }
    }
    return true;
  }

  function p9WsPkt(u8, keyObj = null) {
    if (!u8 || u8.length === 0) return false;
    const k = keyObj || u8.buffer;
    if (k && typeof k === "object" && v4SeenBuf.has(k)) return true;
    const len = u8.length;
    const vw = new DataView(u8.buffer, u8.byteOffset, len);
    const op = vw.getUint8(0);
    let ok = false;

    if (op === 0xf0) {
      if (len < 3 || vw.getUint8(1) !== 0x00) return false;
      const cnt = vw.getUint8(2);
      let p = 3;
      for (let i = 0; i < cnt; i++) {
        if (p + 4 > len) return false;
        const sLen = vw.getUint32(p, true);
        p += 4;
        if (sLen === 0 || p + sLen > len) return false;
        p9WsPkt(u8.subarray(p, p + sLen), {});
        p += sLen;
      }
      ok = true;
    } else if (op === 0x02) {
      ok = p9WsWorld(u8, vw, len);
    } else if (op === 0x0a || op === 0xd2) {
      if (op === 0x0a && len !== 13) return false;
      if (op === 0xd2) {
        if (len < 19) return false;
        const st = vw.getUint8(16);
        const c1 = vw.getUint8(17);
        if (
          (st !== 0x01 && st !== 0x40 && st !== 0x00) ||
          (len !== 19 + c1 * 2 && len !== 20 + c1 * 2)
        ) {
          return false;
        }
      }
      const cx = vw.getFloat32(1, true);
      const cy = vw.getFloat32(5, true);
      const cz = vw.getFloat32(9, true);
      if (
        !Number.isFinite(cx) ||
        !Number.isFinite(cy) ||
        !Number.isFinite(cz) ||
        Math.abs(cx) > 30000 ||
        Math.abs(cy) > 30000 ||
        cz <= 0.005 ||
        cz >= 20
      ) {
        return false;
      }
      b6BpSt.inMatch = true;
      b6BpSt.camX = cx;
      b6BpSt.camY = cy;
      b6BpSt.camZoom = cz;
      b6BpSt.camAt = performance.now();
      if (
        !v4WsCam.init ||
        Math.hypot(cx - v4WsCam.dx, cy - v4WsCam.dy) > 3500
      ) {
        v4WsCam.dx = cx;
        v4WsCam.dy = cy;
        v4WsCam.dz = cz;
        v4WsCam.init = true;
      }
      v4WsCam.x = cx;
      v4WsCam.y = cy;
      v4WsCam.z = cz;
      v4WsCam.at = b6BpSt.camAt;
      if (op === 0xd2) {
        const act = vw.getUint8(13);
        const actOid = vw.getUint16(14, true);
        if (act !== 0 && actOid > 0 && !b6BpSt.specEntered) {
          v4ActOid = actOid;
          v4SelfOids.add(actOid);
        } else if (act === 0) {
          v4ActOid = 0;
        }
      }
      ok = true;
    } else if (op === 0x40 && len === 16 && vw.getUint8(3) === 0x00) {
      v4WsCam.init = false;
      v4WsCam.at = 0;
      v4MyOid = vw.getUint16(1, true);
      v4ActOid = 0;
      v4SelfOids.clear();
      if (v4MyOid) v4SelfOids.add(v4MyOid);
      v4OwnSeen = false;
      v4WsCells.clear();
      v4PtyOids.clear();
      m9MbSt.box1Id = v4MyOid ? String(v4MyOid) : "";
      m9MbSt.box2Id = "";
      m9MbSt.activeId = "";
      m9MbSt.activeBox = 0;
      m9MbSt.matchGen++;
      if (m9TvL2sP.revMethod === "ws") q2WnS7xM(false);
      else v4WsLock = null;
      k4FfCancel(false);
      b6ResetWorld(true, [
        vw.getInt16(4, true),
        vw.getInt16(6, true),
        vw.getInt16(8, true),
        vw.getInt16(10, true),
      ]);
      ok = true;
    } else if (op === 0x29 && len >= 3) {
      const cnt = vw.getUint16(1, true);
      let p = 3;
      v4PtyOids.clear();
      for (let i = 0; i < cnt; i++) {
        if (p + 3 > len) break;
        p += 1;
        const oid = vw.getUint16(p, true);
        p += 2;
        p = q9SkU16(vw, p, len);
        if (p < 0) break;
        v4PtyOids.add(oid);
      }
      ok = true;
    } else if (op === 0x31 && len >= 5) {
      const cnt = vw.getUint32(1, true);
      if (cnt <= 50) {
        let p = 5;
        const arr = [];
        for (let i = 0; i < cnt; i++) {
          if (p + 2 > len) return false;
          const oid = vw.getUint16(p, true);
          p += 2;
          const nm = b6RdU16Str(vw, p, len);
          if (!nm) return false;
          p = nm.p;
          arr.push({ oid, nick: nm.s });
        }
        if (p === len) {
          b6BpSt.lb = arr;
          if (arr.length > 0) b6BpSt.inMatch = true;
          if (arr.length === 0) {
            b6ResetWorld(false);
            if (b6BpSt.scanning) {
              try {
                q5RzL9wK.postMessage({
                  type: "BYPASS_WORLD_RESET",
                  senderId: v8WpM2tL,
                });
              } catch (_) {}
            }
          }
        }
      }
      ok = true;
    } else if (op === 0x46 && len >= 3) {
      const nm = b6RdU16Str(vw, 1, len, true);
      if (nm && nm.s.startsWith("Spectating: ")) {
        const nick = nm.s.slice(12).trim();
        b6BpSt.curSpecNick = nick;
        const match = b6BpSt.lb.find((x) => x.nick === nick);
        let oid = match ? match.oid : 0;
        if (!oid) {
          for (const pl of b6Plrs.values()) {
            if (pl.name === nick) {
              oid = pl.oid;
              break;
            }
          }
        }
        b6BpSt.curSpecOid = oid;
        b6BpSt.got46At = performance.now();
        b6BpSt.got02After46 = false;
        b6BpSt.liveAoi = null;
        let ownLive = false;
        for (const sid of v4SelfOids) {
          if (q9CntParts(sid) > 0) {
            ownLive = true;
            break;
          }
        }
        if (
          !b6BpSt.wasAlive ||
          (b6IsMenuHidden() && !ownLive && !b6HasLiveMassHud())
        ) {
          b6BpSt.specEntered = true;
          b6BpSt.wasAlive = false;
          v4ActOid = 0;
          v4SelfOids.clear();
          if (v4MyOid) v4SelfOids.add(v4MyOid);
        }
      }
      ok = true;
    }
    if (ok && k && typeof k === "object") v4SeenBuf.add(k);
    return ok;
  }

  v4U8ProxyRef = new Proxy(v4OrigU8, {
    construct(t, a, nt) {
      const inst = Reflect.construct(t, a, nt === window.Uint8Array ? t : nt);
      if (!v4InU8) {
        v4InU8 = true;
        try {
          const b0 = a[0];
          const bTag =
            b0 && typeof b0 === "object"
              ? Object.prototype.toString.call(b0)
              : "";
          if (
            a.length === 1 &&
            (bTag === "[object ArrayBuffer]" ||
              bTag === "[object SharedArrayBuffer]") &&
            !v4SeenBuf.has(b0)
          ) {
            const len = inst.length;
            if (len > 0 && len < 524288) {
              const op = inst[0];
              if (
                op === 0x02 ||
                op === 0x40 ||
                op === 0xf0 ||
                op === 0x29 ||
                op === 0x0a ||
                op === 0xd2 ||
                op === 0x31 ||
                op === 0x46
              ) {
                p9WsPkt(inst, b0);
              }
            }
          }
        } catch (_) {
        } finally {
          v4InU8 = false;
        }
      }
      return inst;
    },
  });
  window.Uint8Array = v4U8ProxyRef;

  function v4StepInterp(nw) {
    if (!v4InterpAt) {
      v4InterpAt = nw;
      return;
    }
    const dt = nw - v4InterpAt;
    if (dt < 4) return;
    v4InterpAt = nw;
    const dtS = Math.min(0.05, dt * 0.001);
    const smC = 1 - Math.exp(-20 * dtS);
    const smK = 1 - Math.exp(-14 * dtS);
    for (const c of v4WsCells.values()) {
      if (c.dx === undefined) {
        c.dx = c.x;
        c.dy = c.y;
        c.dr = c.r;
      } else {
        c.dx += (c.x - c.dx) * smC;
        c.dy += (c.y - c.dy) * smC;
        c.dr += (c.r - c.dr) * smC;
      }
    }
    if (v4WsCam.init) {
      v4WsCam.dx += (v4WsCam.x - v4WsCam.dx) * smK;
      v4WsCam.dy += (v4WsCam.y - v4WsCam.dy) * smK;
      v4WsCam.dz += (v4WsCam.z - v4WsCam.dz) * smK;
    }
  }

  function v4GetCam() {
    const cv = p9CvRef || p9C2Cv || b6GameCanvas();
    if (!cv) return null;
    const rc = cv.getBoundingClientRect();
    if (!rc || rc.width <= 0 || rc.height <= 0) return null;
    const nw = performance.now();
    if (p9PixiOn && nw - p9LastPixiMs <= 500 && p9ScW > 0 && p9ScH > 0) {
      const sx = rc.width / p9ScW;
      const sy = rc.height / p9ScH;
      const a = p9WtA * sx;
      const b = p9WtB * sy;
      const c = p9WtC * sx;
      const d = p9WtD * sy;
      const tx = rc.left + p9WtTx * sx;
      const ty = rc.top + p9WtTy * sy;
      const det = a * d - b * c;
      if (Math.abs(det) > 1e-8) {
        let ok = true;
        if (v4WsCam.init && nw - v4WsCam.at <= 1200) {
          const mx = rc.left + rc.width * 0.5;
          const my = rc.top + rc.height * 0.5;
          const wx = (d * (mx - tx) - c * (my - ty)) / det;
          const wy = (-b * (mx - tx) + a * (my - ty)) / det;
          if (Math.hypot(wx - v4WsCam.x, wy - v4WsCam.y) > 2200) ok = false;
        }
        if (ok) return { cv, rc, a, b, c, d, tx, ty, scale: Math.hypot(a, b) };
      }
    }
    if (kAct && nw - p9GlMs <= 500 && zM > 0.002) {
      const tx = rc.left + tX;
      const ty = rc.top + tY;
      let ok = true;
      if (v4WsCam.init && nw - v4WsCam.at <= 1200) {
        const wx = (rc.left + rc.width * 0.5 - tx) / zM;
        const wy = (rc.top + rc.height * 0.5 - ty) / zM;
        if (Math.hypot(wx - v4WsCam.x, wy - v4WsCam.y) > 2200) ok = false;
      }
      if (ok) return { cv, rc, a: zM, b: 0, c: 0, d: zM, tx, ty, scale: zM };
    }
    if (p9C2On && p9C2Cv === cv && cv.width > 0 && cv.height > 0) {
      const sx = rc.width / cv.width;
      const sy = rc.height / cv.height;
      const a = p9C2A * sx;
      const d = p9C2D * sy;
      const tx = rc.left + p9C2Tx * sx;
      const ty = rc.top + p9C2Ty * sy;
      let ok = true;
      if (v4WsCam.init && nw - v4WsCam.at <= 1200 && a > 1e-5 && d > 1e-5) {
        const wx = (rc.left + rc.width * 0.5 - tx) / a;
        const wy = (rc.top + rc.height * 0.5 - ty) / d;
        if (Math.hypot(wx - v4WsCam.x, wy - v4WsCam.y) > 2200) ok = false;
      }
      if (ok) return { cv, rc, a, b: 0, c: 0, d, tx, ty, scale: (a + d) * 0.5 };
    }
    if (v4WsCam.init || b6BpSt.camAt > 0) {
      const cx = v4WsCam.init ? v4WsCam.dx : b6BpSt.camX;
      const cy = v4WsCam.init ? v4WsCam.dy : b6BpSt.camY;
      const cz = v4WsCam.init ? v4WsCam.dz : b6BpSt.camZoom;
      const sc = cz * Math.max(rc.width / 1920, rc.height / 1080);
      if (sc > 0.002) {
        return {
          cv,
          rc,
          a: sc,
          b: 0,
          c: 0,
          d: sc,
          tx: rc.left + rc.width * 0.5 - cx * sc,
          ty: rc.top + rc.height * 0.5 - cy * sc,
          scale: sc,
        };
      }
    }
    return null;
  }

  function b6ModeLabel(m) {
    if (m === "nearme") return "Near Me";
    if (m === "cursor") return "Cursor";
    if (m === "biggest") return "Biggest";
    if (m === "lb") return "Leaderboard";
    return "Smart";
  }

  function b6IsMenuHidden() {
    const nw = performance.now();
    if (nw - b6BpSt.menuChkAt < 180) return b6BpSt.menuHid;
    b6BpSt.menuChkAt = nw;
    const mp =
      document.getElementById("main-panel") ||
      document.getElementById("login-panel");
    if (!mp) {
      b6BpSt.menuHid = b6BpSt.inMatch;
      return b6BpSt.menuHid;
    }
    const cs = window.getComputedStyle(mp);
    b6BpSt.menuHid =
      cs.display === "none" ||
      cs.visibility === "hidden" ||
      parseFloat(cs.opacity) <= 0.02 ||
      mp.getClientRects().length === 0;
    return b6BpSt.menuHid;
  }

  function b6HasLiveMassHud() {
    const sp =
      s8XnL3wP && document.contains(s8XnL3wP)
        ? s8XnL3wP
        : (s8XnL3wP =
            document.getElementById("score-panel") ||
            document.getElementById("stats") ||
            document.querySelector('[id*="score"]') ||
            document.querySelector(".main-bottom-stats"));
    if (!sp) return false;
    const cs = window.getComputedStyle(sp);
    if (
      cs.display === "none" ||
      cs.visibility === "hidden" ||
      sp.getClientRects().length === 0
    ) {
      return false;
    }
    const m = (sp.textContent || "").match(/Mass\s*:\s*([0-9\s,]+)/i);
    if (!m) return false;
    const val = parseInt(m[1].replace(/[\s,]/g, ""), 10);
    return Number.isFinite(val) && val > 0;
  }

  function b6UpdateRole(nw) {
    const hid = b6IsMenuHidden();
    let nxt = "menu";
    if (!hid) {
      b6BpSt.menuHidAt = 0;
      nxt = "menu";
    } else {
      if (!b6BpSt.menuHidAt) b6BpSt.menuHidAt = nw;
      let ownLive = false;
      for (const sid of v4SelfOids) {
        if (q9CntParts(sid) > 0) {
          ownLive = true;
          break;
        }
      }
      const hudLive = !b6BpSt.specEntered && b6HasLiveMassHud();
      if (ownLive || hudLive || nw - b6BpSt.lastPlayAt < 1800) {
        b6BpSt.wasAlive = true;
        b6BpSt.specEntered = false;
        nxt = "play";
      } else if (
        b6BpSt.specEntered ||
        (!b6BpSt.wasAlive &&
          nw - b6BpSt.menuHidAt >= 350 &&
          nw - b6BpSt.lastPlayAt > 2500)
      ) {
        if (!b6BpSt.specEntered) {
          b6BpSt.specEntered = true;
          v4SelfOids.clear();
          if (v4MyOid) v4SelfOids.add(v4MyOid);
        }
        nxt = "spec";
      } else {
        nxt = b6BpSt.wasAlive ? "play" : "menu";
      }
    }
    if (b6BpSt.curRole !== nxt) {
      b6BpSt.curRole = nxt;
      v5PingPeers();
    }
    return nxt;
  }

  function b6CheckPeerAlive(nw) {
    if (!m9TvL2sP.bypassEnabled) return;
    if (nw < b6BpSt.enableGraceUntil) return;
    if (!h4HasPeerTab()) {
      m9TvL2sP.bypassEnabled = false;
      b6BpSt.enableGraceUntil = 0;
      b6ScanStop();
      if (!m9TvL2sP.bypassPhantoms && !m9TvL2sP.bypassRadar)
        b6ResetWorld(false);
      x3QnK8wR();
      if (document.getElementById("macro-window")) r8QnM4tL();
    }
  }

  function b6GetCamCtr() {
    const cam = v4GetCam();
    if (cam) {
      const det = cam.a * cam.d - cam.b * cam.c;
      if (Math.abs(det) > 1e-8) {
        const mx = cam.rc.left + cam.rc.width * 0.5;
        const my = cam.rc.top + cam.rc.height * 0.5;
        return {
          x: (cam.d * (mx - cam.tx) - cam.c * (my - cam.ty)) / det,
          y: (-cam.b * (mx - cam.tx) + cam.a * (my - cam.ty)) / det,
        };
      }
    }
    return b6BpSt.camAt > 0 ? { x: b6BpSt.camX, y: b6BpSt.camY } : null;
  }

  function b6InBox(x, y, box, pad = 0) {
    return Boolean(
      box &&
      x >= box.minX + pad &&
      x <= box.maxX - pad &&
      y >= box.minY + pad &&
      y <= box.maxY - pad,
    );
  }

  function b6InMainAoi(x, y, pad = 0) {
    const m = b6BpSt.mainAoi;
    return Boolean(
      m && performance.now() - m.at <= 2200 && b6InBox(x, y, m, pad),
    );
  }

  function b6LiveBox() {
    const cam = b6GetCamCtr();
    if (!cam) return b6BpSt.liveAoi;
    const x0 = cam.x - b6BpSt.aoiHalfW,
      y0 = cam.y - b6BpSt.aoiHalfH;
    const x1 = cam.x + b6BpSt.aoiHalfW,
      y1 = cam.y + b6BpSt.aoiHalfH;
    const a = b6BpSt.liveAoi;
    if (a && a.maxX > a.minX) {
      return {
        minX: Math.min(x0, a.minX),
        minY: Math.min(y0, a.minY),
        maxX: Math.max(x1, a.maxX),
        maxY: Math.max(y1, a.maxY),
      };
    }
    return { minX: x0, minY: y0, maxX: x1, maxY: y1 };
  }

  function b6SafeBox() {
    const cam = b6GetCamCtr();
    if (!cam) return b6BpSt.safeAoi;
    const b = b6BpSt.bounds;
    const hw = Math.max(550, b6BpSt.safeHalfW || 550);
    const hh = Math.max(380, b6BpSt.safeHalfH || 380);
    let minX = cam.x - hw,
      maxX = cam.x + hw;
    let minY = cam.y - hh,
      maxY = cam.y + hh;
    if (minX <= b[0] + 220) minX = b[0] - 500;
    if (maxX >= b[2] - 220) maxX = b[2] + 500;
    if (minY <= b[1] + 220) minY = b[1] - 500;
    if (maxY >= b[3] - 220) maxY = b[3] + 500;
    return { minX, minY, maxX, maxY };
  }

  function b6OverlapArea(ax0, ay0, ax1, ay1, bx0, by0, bx1, by1) {
    const ox = Math.min(ax1, bx1) - Math.max(ax0, bx0);
    if (ox <= 0) return 0;
    const oy = Math.min(ay1, by1) - Math.max(ay0, by0);
    return oy > 0 ? ox * oy : 0;
  }

  function b6NearSlots() {
    const m = b6BpSt.mainAoi;
    if (!m || performance.now() - m.at > 3500) return [];
    const b = b6BpSt.bounds;
    const cx = (m.minX + m.maxX) * 0.5;
    const cy = (m.minY + m.maxY) * 0.5;
    const hw = Math.max(1800, Math.min(6000, b6BpSt.avgSpecHW || 2600));
    const hh = Math.max(1800, Math.min(6000, b6BpSt.avgSpecHH || 2600));
    const seam = 180;
    const raw = [
      [cx, m.minY - hh + seam],
      [m.maxX + hw - seam, m.minY - hh + seam],
      [m.maxX + hw - seam, cy],
      [m.maxX + hw - seam, m.maxY + hh - seam],
      [cx, m.maxY + hh - seam],
      [m.minX - hw + seam, m.maxY + hh - seam],
      [m.minX - hw + seam, cy],
      [m.minX - hw + seam, m.minY - hh + seam],
    ];
    return raw.map(([sx, sy]) =>
      sx < b[0] - hw * 0.35 ||
      sx > b[2] + hw * 0.35 ||
      sy < b[1] - hh * 0.35 ||
      sy > b[3] + hh * 0.35
        ? null
        : [
            Math.max(b[0] + 400, Math.min(b[2] - 400, sx)),
            Math.max(b[1] + 400, Math.min(b[3] - 400, sy)),
          ],
    );
  }

  function b6MarkCov(aoi, nw) {
    if (!aoi || aoi.maxX <= aoi.minX || aoi.maxY <= aoi.minY) return;
    const b = b6BpSt.bounds;
    const sw = Math.max(500, (b[2] - b[0]) / 6);
    const sh = Math.max(500, (b[3] - b[1]) / 6);
    for (let gy = 0; gy < 6; gy++) {
      const cy = b[1] + (gy + 0.5) * sh;
      if (cy < aoi.minY || cy > aoi.maxY) continue;
      for (let gx = 0; gx < 6; gx++) {
        const cx = b[0] + (gx + 0.5) * sw;
        if (cx >= aoi.minX && cx <= aoi.maxX) b6GridTs[gy * 6 + gx] = nw;
      }
    }
    const slots = b6NearSlots();
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      if (
        s &&
        s[0] >= aoi.minX + 120 &&
        s[0] <= aoi.maxX - 120 &&
        s[1] >= aoi.minY + 120 &&
        s[1] <= aoi.maxY - 120
      ) {
        b6NearTs[i] = nw;
      }
    }
  }

  function b6CountGain(aoi, nw) {
    if (!aoi || aoi.maxX <= aoi.minX || aoi.maxY <= aoi.minY) return 0;
    const b = b6BpSt.bounds;
    const sw = Math.max(500, (b[2] - b[0]) / 6);
    const sh = Math.max(500, (b[3] - b[1]) / 6);
    let gain = 0;
    for (let gy = 0; gy < 6; gy++) {
      const cy = b[1] + (gy + 0.5) * sh;
      if (cy < aoi.minY || cy > aoi.maxY) continue;
      for (let gx = 0; gx < 6; gx++) {
        const cx = b[0] + (gx + 0.5) * sw;
        if (cx < aoi.minX || cx > aoi.maxX || b6InMainAoi(cx, cy)) continue;
        const age = nw - b6GridTs[gy * 6 + gx];
        if (age > 1100) gain += Math.min(10000, age);
      }
    }
    return gain;
  }

  function b6BlindPt(nw) {
    const b = b6BpSt.bounds;
    const sw = Math.max(500, (b[2] - b[0]) / 6);
    const sh = Math.max(500, (b[3] - b[1]) / 6);
    let bestAge = -1,
      bx = 0,
      by = 0,
      found = false;
    for (let gy = 0; gy < 6; gy++) {
      const cy = b[1] + (gy + 0.5) * sh;
      for (let gx = 0; gx < 6; gx++) {
        const cx = b[0] + (gx + 0.5) * sw;
        if (b6InMainAoi(cx, cy)) continue;
        const age = nw - b6GridTs[gy * 6 + gx];
        if (age > bestAge) {
          bestAge = age;
          bx = cx;
          by = cy;
          found = true;
        }
      }
    }
    return found ? { x: bx, y: by, age: bestAge } : null;
  }

  function b6ScoreNear(cx, cy, oid, rHint, nw, m, slots) {
    const b = b6BpSt.bounds;
    const stats = oid ? b6OidAoi.get(oid) : null;
    let hw = b6BpSt.avgSpecHW || 2600;
    let hh = b6BpSt.avgSpecHH || 2600;
    if (stats && nw - stats.at < 20000) {
      hw = Math.max(1600, Math.min(7500, (stats.maxX - stats.minX) * 0.5));
      hh = Math.max(1600, Math.min(7500, (stats.maxY - stats.minY) * 0.5));
    } else if (rHint > 0) {
      hw = hh = Math.max(2000, Math.min(6000, rHint * 13));
    }
    const x0 = Math.max(b[0], cx - hw),
      y0 = Math.max(b[1], cy - hh);
    const x1 = Math.min(b[2], cx + hw),
      y1 = Math.min(b[3], cy + hh);
    const inMapArea = Math.max(0, x1 - x0) * Math.max(0, y1 - y0);
    const ovArea = b6OverlapArea(
      x0,
      y0,
      x1,
      y1,
      m.minX,
      m.minY,
      m.maxX,
      m.maxY,
    );
    const usefulFrac =
      Math.max(0, inMapArea - ovArea) / Math.max(1, hw * 2 * (hh * 2));
    const gx = Math.max(0, Math.max(cx - hw - m.maxX, m.minX - (cx + hw)));
    const gy = Math.max(0, Math.max(cy - hh - m.maxY, m.minY - (cy + hh)));
    const boxGap = Math.hypot(gx, gy);

    let slotGain = 0,
      bestSlotDist = Infinity;
    for (let i = 0; i < slots.length; i++) {
      const s = slots[i];
      if (!s) continue;
      const age = nw - b6NearTs[i];
      if (s[0] >= x0 && s[0] <= x1 && s[1] >= y0 && s[1] <= y1)
        slotGain += Math.min(9000, age);
      if (age > 900)
        bestSlotDist = Math.min(bestSlotDist, Math.hypot(cx - s[0], cy - s[1]));
    }
    if (!Number.isFinite(bestSlotDist)) {
      bestSlotDist = Math.hypot(
        cx - (m.minX + m.maxX) * 0.5,
        cy - (m.minY + m.maxY) * 0.5,
      );
    }
    const seenAge = oid ? nw - (b6SeenOid.get(oid) || 0) : 5000;
    return (
      usefulFrac * 180000 +
      slotGain * 14 +
      Math.min(5000, seenAge) * 4 -
      boxGap * 38 -
      bestSlotDist * 8 +
      (usefulFrac < 0.2 ? -220000 : 0)
    );
  }

  function b6RebuildAgg(nw) {
    const tmp = new Map();
    for (const c of v4WsCells.values()) {
      if (c.tag !== 2 || !c.oid) continue;
      const r2 = c.r * c.r;
      let rec = tmp.get(c.oid);
      if (!rec) tmp.set(c.oid, { totalR2: r2, wx: c.x * r2, wy: c.y * r2 });
      else {
        rec.totalR2 += r2;
        rec.wx += c.x * r2;
        rec.wy += c.y * r2;
      }
    }
    for (const [oid, rec] of tmp) {
      const d = Math.max(1, rec.totalR2);
      b6OidAgg.set(oid, {
        totalR2: rec.totalR2,
        cx: rec.wx / d,
        cy: rec.wy / d,
        at: nw,
      });
    }
  }

  function b6ResetWorld(full, newBounds) {
    if (full) {
      b6BpSt.inMatch = true;
      if (!b6IsMenuHidden()) b6BpSt.specEntered = false;
      b6BpSt.wasAlive = false;
      if (b6BpSt.scanning) {
        b6ScanStop();
        try {
          q5RzL9wK.postMessage({
            type: "BYPASS_WORLD_RESET",
            senderId: v8WpM2tL,
          });
        } catch (_) {}
      }
      if (Array.isArray(newBounds) && newBounds.length === 4) {
        b6BpSt.bounds = newBounds;
      }
      b6Plrs.clear();
      b6DelTs.clear();
      b6SeenOid.clear();
      b6OidAgg.clear();
      b6OidAoi.clear();
      b6SpecOid.clear();
      b6SpecNick.clear();
      b6BadOid.clear();
      b6Claims.clear();
      b6SentPlr.clear();
      b6Phantoms.clear();
      b6RemPlrs.clear();
      b6LblCache.clear();
      b6GridTs.fill(0);
      b6NearTs.fill(0);
      b6BpSt.liveAoi = null;
      b6BpSt.safeAoi = null;
      b6BpSt.lb = [];
      b6BpSt.curSpecNick = "";
      b6BpSt.curSpecOid = 0;
      b6BpSt.bestSpecOid = 0;
      b6BpSt.bestSpecNick = "";
      b6BpSt.bestSpecArea = 0;
      b6BpSt.bestSpecAt = 0;
      b6BpSt.bestSpecAoi = null;
      b6BpSt.curHoldMs = 0;
      b6BpSt.aoiHalfW = 700;
      b6BpSt.aoiHalfH = 450;
      b6BpSt.safeHalfW = 700;
      b6BpSt.safeHalfH = 450;
      return;
    }
    b6Phantoms.clear();
    b6RemPlrs.clear();
    b6LblCache.clear();
  }

  function b6PruneMem(nw, nowWall) {
    if (nw - b6BpSt.lastPruneAt <= 15000) return;
    b6BpSt.lastPruneAt = nw;
    for (const [k, ts] of b6DelTs) if (nowWall - ts > 3000) b6DelTs.delete(k);
    for (const [k, ts] of b6SeenOid) if (nw - ts > 45000) b6SeenOid.delete(k);
    for (const [k, v] of b6OidAgg) if (nw - v.at > 45000) b6OidAgg.delete(k);
    for (const [k, v] of b6OidAoi) if (nw - v.at > 45000) b6OidAoi.delete(k);
    for (const [k, ts] of b6SpecOid) if (nw - ts > 45000) b6SpecOid.delete(k);
    for (const [k, ts] of b6SpecNick) if (nw - ts > 45000) b6SpecNick.delete(k);
    for (const [k, ts] of b6BadOid) if (nw - ts > 10000) b6BadOid.delete(k);
    for (const [k, cl] of b6Claims) if (nw - cl.ts > 2000) b6Claims.delete(k);
    for (const [k, ts] of b6SentPlr) if (nw - ts > 30000) b6SentPlr.delete(k);
    const activeOids = new Set();
    for (const c of v4WsCells.values()) {
      if (c.tag === 2 && c.oid) activeOids.add(c.oid);
    }
    for (const p of b6Phantoms.values()) {
      if (p.tag === 2 && p.oid) activeOids.add(p.oid);
    }
    for (const [k, v] of b6Plrs) {
      if (!activeOids.has(k) && nw - v.at > 60000) b6Plrs.delete(k);
    }
    for (const [k, v] of b6RemPlrs) {
      if (!activeOids.has(k) && nw - v.at > 60000) b6RemPlrs.delete(k);
    }
  }

  function b6FlushBc(force) {
    if (!b6BpSt.scanning || !b6BpSt.inMatch) return;
    const nw = performance.now();
    if (!force && nw - b6BpSt.bcAt < 70) {
      b6BpSt.bcPending = true;
      return;
    }
    b6BpSt.bcPending = false;
    b6BpSt.bcAt = nw;

    const cells = [];
    const plrs = [];
    const seenPlr = new Set();
    for (const c of v4WsCells.values()) {
      if (c.tag === 2) {
        if (c.r < 10) continue;
        cells.push([c.cid, 2, c.oid, c.x, c.y, c.r]);
        if (c.oid && !seenPlr.has(c.oid)) {
          seenPlr.add(c.oid);
          if (nw - (b6SentPlr.get(c.oid) || 0) > 2000) {
            const pl = b6Plrs.get(c.oid);
            if (pl) {
              b6SentPlr.set(c.oid, nw);
              plrs.push([pl.oid, pl.name, pl.rgb]);
            }
          }
        }
      } else if (c.tag === 3 || c.tag === 4) {
        cells.push([c.cid, c.tag, 0, c.x, c.y, c.r]);
      }
    }
    const a = b6BpSt.liveAoi;
    try {
      q5RzL9wK.postMessage({
        type: "BYPASS_FRAME",
        senderId: v8WpM2tL,
        ts: Date.now(),
        bounds: b6BpSt.bounds,
        aoi: a && a.maxX > a.minX ? [a.minX, a.minY, a.maxX, a.maxY] : null,
        cells,
        plrs,
      });
    } catch (_) {}
  }

  function b6GetSelfPt() {
    const sOid = w4GetCurSelfOid();
    if (sOid) {
      let sx = 0,
        sy = 0,
        sw = 0;
      for (const c of v4WsCells.values()) {
        if (c.tag === 2 && c.oid === sOid) {
          const w = c.r * c.r;
          sx += c.x * w;
          sy += c.y * w;
          sw += w;
        }
      }
      if (sw > 0) return [Math.round(sx / sw), Math.round(sy / sw), sOid];
    }
    const cam = b6GetCamCtr();
    return cam ? [Math.round(cam.x), Math.round(cam.y), sOid || 0] : null;
  }

  function b6CurBeamPt(liveBox, selfPt) {
    const cam = v4GetCam();
    if (!cam) return null;
    const det = cam.a * cam.d - cam.b * cam.c;
    if (Math.abs(det) < 1e-8) return null;
    let ax = (cam.d * (t2QnL9wP - cam.tx) - cam.c * (b8VmK3xT - cam.ty)) / det;
    let ay = (-cam.b * (t2QnL9wP - cam.tx) + cam.a * (b8VmK3xT - cam.ty)) / det;
    if (!Number.isFinite(ax) || !Number.isFinite(ay)) return null;
    if (liveBox && b6InBox(ax, ay, liveBox, 120)) {
      const ox = selfPt ? selfPt[0] : (liveBox.minX + liveBox.maxX) * 0.5;
      const oy = selfPt ? selfPt[1] : (liveBox.minY + liveBox.maxY) * 0.5;
      const dx = ax - ox,
        dy = ay - oy,
        len = Math.hypot(dx, dy);
      if (len > 25) {
        const push = Math.max(2200, (liveBox.maxX - liveBox.minX) * 0.55);
        ax += (dx / len) * push;
        ay += (dy / len) * push;
      }
    }
    const b = b6BpSt.bounds;
    return [
      Math.round(Math.max(b[0] + 400, Math.min(b[2] - 400, ax))),
      Math.round(Math.max(b[1] + 400, Math.min(b[3] - 400, ay))),
    ];
  }

  function b6SendMainAoi(nw) {
    if (
      !m9TvL2sP.bypassEnabled ||
      b6BpSt.scanning ||
      b6BpSt.specEntered ||
      !b6BpSt.inMatch ||
      !b6IsMenuHidden() ||
      nw - b6BpSt.mainBcAt < 100
    ) {
      return;
    }
    const a = b6LiveBox();
    if (!a || a.maxX - a.minX < 800 || a.maxY - a.minY < 800) return;
    b6BpSt.mainBcAt = nw;
    const selfPt = b6GetSelfPt();
    try {
      q5RzL9wK.postMessage({
        type: "BYPASS_MAIN_AOI",
        senderId: v8WpM2tL,
        aoi: [a.minX, a.minY, a.maxX, a.maxY],
        self: selfPt,
        cur: b6CurBeamPt(a, selfPt),
      });
    } catch (_) {}
  }

  function b6OnWorldTick(
    addN,
    delN,
    remN,
    pMinX,
    pMinY,
    pMaxX,
    pMaxY,
    fMinX,
    fMinY,
    fMaxX,
    fMaxY,
    nw,
    nowWall,
  ) {
    b6BpSt.inMatch = true;
    if (b6BpSt.scanning && b6BpSt.curSpecNick && !b6BpSt.curSpecOid) {
      for (const pl of b6Plrs.values()) {
        if (pl.name === b6BpSt.curSpecNick) {
          b6BpSt.curSpecOid = pl.oid;
          break;
        }
      }
    }
    if (
      b6BpSt.scanning &&
      (addN > 0 || delN > 0 || remN > 0 || nw - b6BpSt.lastAggAt > 250)
    ) {
      b6BpSt.lastAggAt = nw;
      b6RebuildAgg(nw);
    }
    b6PruneMem(nw, nowWall);

    const camNow = b6GetCamCtr();
    let sMinX = Infinity,
      sMinY = Infinity,
      sMaxX = -Infinity,
      sMaxY = -Infinity;
    for (const lc of v4WsCells.values()) {
      if (lc.x < pMinX) pMinX = lc.x;
      if (lc.x > pMaxX) pMaxX = lc.x;
      if (lc.y < pMinY) pMinY = lc.y;
      if (lc.y > pMaxY) pMaxY = lc.y;
      const ix = camNow
        ? lc.x < camNow.x
          ? Math.min(camNow.x, lc.x + lc.r)
          : Math.max(camNow.x, lc.x - lc.r)
        : lc.x;
      const iy = camNow
        ? lc.y < camNow.y
          ? Math.min(camNow.y, lc.y + lc.r)
          : Math.max(camNow.y, lc.y - lc.r)
        : lc.y;
      if (ix < sMinX) sMinX = ix;
      if (ix > sMaxX) sMaxX = ix;
      if (iy < sMinY) sMinY = iy;
      if (iy > sMaxY) sMaxY = iy;
    }
    if (Number.isFinite(sMinX) && sMaxX > sMinX && sMaxY > sMinY) {
      b6BpSt.safeAoi = { minX: sMinX, minY: sMinY, maxX: sMaxX, maxY: sMaxY };
    }
    if (!b6BpSt.scanning) {
      const cam = camNow;
      if (cam) {
        let obsW = 0,
          obsH = 0;
        if (Number.isFinite(sMinX)) {
          obsW = Math.max(obsW, cam.x - sMinX, sMaxX - cam.x);
          obsH = Math.max(obsH, cam.y - sMinY, sMaxY - cam.y);
        }
        if (Number.isFinite(fMinX)) {
          obsW = Math.max(obsW, cam.x - (fMinX + 15), fMaxX - 15 - cam.x);
          obsH = Math.max(obsH, cam.y - (fMinY + 15), fMaxY - 15 - cam.y);
        }
        if (obsW > 300) {
          const wC = Math.min(9500, obsW);
          b6BpSt.safeHalfW =
            wC >= b6BpSt.safeHalfW
              ? b6BpSt.safeHalfW * 0.35 + wC * 0.65
              : b6BpSt.safeHalfW * 0.994 + wC * 0.006;
        }
        if (obsH > 250) {
          const hC = Math.min(9500, obsH);
          b6BpSt.safeHalfH =
            hC >= b6BpSt.safeHalfH
              ? b6BpSt.safeHalfH * 0.35 + hC * 0.65
              : b6BpSt.safeHalfH * 0.994 + hC * 0.006;
        }
      }
    }
    if (Number.isFinite(pMinX) && pMaxX > pMinX && pMaxY > pMinY) {
      if (!b6BpSt.scanning) {
        const cam = camNow;
        const uMinX = Number.isFinite(sMinX) ? sMinX : pMinX;
        const uMaxX = Number.isFinite(sMaxX) ? sMaxX : pMaxX;
        const uMinY = Number.isFinite(sMinY) ? sMinY : pMinY;
        const uMaxY = Number.isFinite(sMaxY) ? sMaxY : pMaxY;
        if (cam && uMaxX > uMinX && uMaxY > uMinY) {
          b6BpSt.aoiHalfW =
            b6BpSt.aoiHalfW * 0.65 +
            Math.max(
              550,
              Math.min(9500, Math.max(uMaxX - cam.x, cam.x - uMinX)),
            ) *
              0.35;
          b6BpSt.aoiHalfH =
            b6BpSt.aoiHalfH * 0.65 +
            Math.max(
              380,
              Math.min(9500, Math.max(uMaxY - cam.y, cam.y - uMinY)),
            ) *
              0.35;
        }
      }
      b6BpSt.liveAoi = {
        minX: pMinX,
        minY: pMinY,
        maxX: pMaxX,
        maxY: pMaxY,
        ts: nw,
      };
      if (b6BpSt.scanning) {
        b6MarkCov(b6BpSt.liveAoi, nw);
        const spHW = (pMaxX - pMinX) * 0.5,
          spHH = (pMaxY - pMinY) * 0.5;
        if (spHW > 900 && spHH > 900) {
          b6BpSt.avgSpecHW = b6BpSt.avgSpecHW * 0.7 + spHW * 0.3;
          b6BpSt.avgSpecHH = b6BpSt.avgSpecHH * 0.7 + spHH * 0.3;
        }
        const area = (pMaxX - pMinX) * (pMaxY - pMinY);
        const cov =
          area /
          Math.max(
            1e6,
            (b6BpSt.bounds[2] - b6BpSt.bounds[0]) *
              (b6BpSt.bounds[3] - b6BpSt.bounds[1]),
          );
        if (b6BpSt.curSpecOid) {
          b6OidAoi.set(b6BpSt.curSpecOid, {
            minX: pMinX,
            minY: pMinY,
            maxX: pMaxX,
            maxY: pMaxY,
            area,
            cov,
            at: nw,
          });
          if (
            cov >= 0.16 &&
            (b6BpSt.curSpecOid === b6BpSt.bestSpecOid ||
              area >= b6BpSt.bestSpecArea * 0.85 ||
              nw - b6BpSt.bestSpecAt > 12000)
          ) {
            b6BpSt.bestSpecOid = b6BpSt.curSpecOid;
            b6BpSt.bestSpecNick = b6BpSt.curSpecNick;
            b6BpSt.bestSpecArea = area;
            b6BpSt.bestSpecAt = nw;
            b6BpSt.bestSpecAoi = {
              minX: pMinX,
              minY: pMinY,
              maxX: pMaxX,
              maxY: pMaxY,
            };
          }
          b6BpSt.curHoldMs =
            cov > 0.14 ? Math.min(2000, Math.round((cov - 0.13) * 4500)) : 0;
        }
      }
    }

    if (b6BpSt.scanning && remN >= 2 && v4WsCells.size === 0 && addN === 0) {
      b6ResetWorld(false);
      try {
        q5RzL9wK.postMessage({
          type: "BYPASS_WORLD_RESET",
          senderId: v8WpM2tL,
        });
      } catch (_) {}
    }
    if (b6BpSt.got46At > 0 && !b6BpSt.got02After46 && nw >= b6BpSt.got46At) {
      b6BpSt.got02After46 = true;
    }
    if (b6BpSt.scanning && b6BpSt.inMatch) {
      const forceBc = b6BpSt.got02After46 && !b6BpSt.hopFlushSent;
      if (forceBc) b6BpSt.hopFlushSent = true;
      b6FlushBc(forceBc);
    } else if (!b6BpSt.scanning && b6BpSt.inMatch) {
      b6SendMainAoi(nw);
    }
  }

  function b6DispMouse(el, tp, btn, x, y, usePtr) {
    if (usePtr && typeof PointerEvent === "function") {
      const pTp =
        tp === "mousedown"
          ? "pointerdown"
          : tp === "mouseup"
            ? "pointerup"
            : "pointermove";
      el.dispatchEvent(
        new PointerEvent(pTp, {
          button: btn,
          buttons: tp === "mouseup" ? 0 : btn === 2 ? 2 : 1,
          clientX: x,
          clientY: y,
          pointerId: 1,
          pointerType: "mouse",
          isPrimary: true,
          bubbles: true,
          cancelable: true,
        }),
      );
    }
    const ev = new MouseEvent(tp, {
      button: btn,
      buttons: tp === "mouseup" ? 0 : btn === 2 ? 2 : 1,
      clientX: x,
      clientY: y,
      view: window,
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(ev, "which", { value: btn + 1, writable: false });
    el.dispatchEvent(ev);
  }

  function b6CloseCtx() {
    const cm = document.getElementById("context-menu");
    if (cm && window.getComputedStyle(cm).display !== "none") {
      cm.style.display = "none";
    }
  }

  function b6GameCanvas() {
    return p9CvRef && p9CvRef.isConnected
      ? p9CvRef
      : p9C2Cv && p9C2Cv.isConnected
        ? p9C2Cv
        : t8VwM4xK();
  }

  function b6ScreenClear(px, py) {
    if (
      px < 65 ||
      px > window.innerWidth - 65 ||
      py < 65 ||
      py > window.innerHeight - 65
    ) {
      return false;
    }
    const wn = document.getElementById("macro-window");
    if (wn && wn.classList.contains("open")) {
      const r = wn.getBoundingClientRect();
      if (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom)
        return false;
    }
    const pl = document.getElementById("macro-toggle-pill");
    if (pl) {
      const r = pl.getBoundingClientRect();
      if (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom)
        return false;
    }
    if (
      b6BpMapWin &&
      b6BpMapWin.style.display !== "none" &&
      !m9TvL2sP.bypassRadarLock
    ) {
      const r = b6BpMapWin.getBoundingClientRect();
      if (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom)
        return false;
    }
    return true;
  }

  function b6WorldToScr(wx, wy, wr) {
    const cam = v4GetCam();
    if (!cam) return null;
    return {
      px: cam.a * wx + cam.c * wy + cam.tx,
      py: cam.b * wx + cam.d * wy + cam.ty,
      pr: wr * cam.scale,
    };
  }

  function b6ClaimedElsewhere(oid, agg, nw) {
    if (!oid) return false;
    const cl = b6Claims.get(oid);
    if (cl && nw - cl.ts < 1800) return true;
    if (agg) {
      for (const [k, c] of b6Claims) {
        if (
          k !== oid &&
          nw - c.ts < 1500 &&
          Math.hypot(agg.cx - c.cx, agg.cy - c.cy) < 2200
        ) {
          return true;
        }
      }
    }
    return false;
  }

  function b6PickLb(nw, avoidAoi, smartDedupe) {
    const rows = Array.from(
      document.querySelectorAll("#leaderboard-list > div"),
    );
    if (rows.length < 1) return null;
    const lb = b6BpSt.lb,
      n = rows.length;
    let realCnt = 0;
    for (let i = 0; i < n; i++) {
      if (
        !((lb[i] && lb[i].nick) || rows[i].textContent || "").includes(
          "\uD83E\uDD16",
        )
      )
        realCnt++;
    }
    let best = null;
    for (let k = 0; k < n; k++) {
      const i = (b6BpSt.rrIdx + k) % n;
      const row = rows[i];
      const dNick = (row.textContent || "").trim().replace(/^\d+\.\s*/, "");
      const rec =
        lb[i] && (!dNick || lb[i].nick === dNick)
          ? lb[i]
          : dNick
            ? lb.find((x) => x.nick === dNick)
            : lb[i];
      const oid = rec ? rec.oid : 0;
      const nick = dNick || (rec ? rec.nick : "");
      if (
        (!nick && !oid) ||
        (oid && oid === b6BpSt.curSpecOid) ||
        (nick && nick === b6BpSt.curSpecNick)
      )
        continue;
      if (oid && nw - (b6BadOid.get(oid) || 0) < 1500) continue;
      if (realCnt >= 2 && nick.includes("\uD83E\uDD16")) continue;
      const agg = oid ? b6OidAgg.get(oid) : null;
      const inMain =
        agg && nw - agg.at < 8000 && b6InMainAoi(agg.cx, agg.cy, 200) ? 1 : 0;
      const inAvoid =
        avoidAoi &&
        agg &&
        nw - agg.at < 8000 &&
        b6InBox(agg.cx, agg.cy, avoidAoi, 200)
          ? 1
          : 0;
      const specAge = oid
        ? nw - (b6SpecOid.get(oid) || 0)
        : nw - (b6SpecNick.get(nick) || 0);
      if (specAge < 950 && n > 2) continue;
      const seenAge = oid ? nw - (b6SeenOid.get(oid) || 0) : Infinity;

      let score =
        (1 - inMain) * 1e9 +
        (1 - inAvoid) * 1e7 +
        (seenAge > 900 ? 1e6 + seenAge : specAge);
      if (smartDedupe) {
        if (b6ClaimedElsewhere(oid, agg, nw)) score -= 5e6;
        const aoiInfo = oid ? b6OidAoi.get(oid) : null;
        if (aoiInfo) score += b6CountGain(aoiInfo, nw) * 15;
        if (
          agg &&
          b6BpSt.liveAoi &&
          nw - agg.at < 2000 &&
          b6InBox(agg.cx, agg.cy, b6BpSt.liveAoi, -400)
        ) {
          score -= 2e6;
        }
      }
      if (!best || score > best.score)
        best = { kind: "lb", idx: i, row, oid, nick, score };
    }
    if (best) b6BpSt.rrIdx = (best.idx + 1) % n;
    return best;
  }

  function b6PickBlind(nw, avoidAoi) {
    if (b6BpSt.camAt === 0 || v4WsCells.size === 0) return null;
    const blind = b6BlindPt(nw);
    if (!blind) return null;
    const camDist = Math.hypot(b6BpSt.camX - blind.x, b6BpSt.camY - blind.y);
    let maxR2 = 1;
    for (const a of b6OidAgg.values()) {
      if (nw - a.at < 1500 && a.totalR2 > maxR2) maxR2 = a.totalR2;
    }
    let best = null,
      bestScore = -Infinity;
    for (const c of v4WsCells.values()) {
      if (
        c.tag !== 2 ||
        !c.oid ||
        c.oid === b6BpSt.curSpecOid ||
        nw - (b6BadOid.get(c.oid) || 0) < 1500 ||
        nw - (b6SpecOid.get(c.oid) || 0) < 4000
      )
        continue;
      const pl = b6Plrs.get(c.oid),
        nm = pl ? pl.name : "";
      if (
        nm.includes("\uD83E\uDD16") ||
        (nm && nm === b6BpSt.curSpecNick) ||
        b6InMainAoi(c.x, c.y, 180)
      )
        continue;
      const sc = b6WorldToScr(c.x, c.y, c.r);
      if (!sc || sc.pr < 11 || !b6ScreenClear(sc.px, sc.py)) continue;
      const d = Math.hypot(c.x - blind.x, c.y - blind.y);
      if (d >= camDist - 600) continue;
      const agg = b6OidAgg.get(c.oid);
      const ratio = (agg ? agg.totalR2 : c.r * c.r) / maxR2;
      const score =
        ((camDist - d) / Math.max(1000, camDist)) * 10 +
        ratio * 4 +
        (avoidAoi && !b6InBox(c.x, c.y, avoidAoi, 150) ? 5 : 0);
      if (score > bestScore) {
        bestScore = score;
        best = {
          kind: "cvs",
          cid: c.cid,
          oid: c.oid,
          nick: nm,
          px: Math.round(sc.px),
          py: Math.round(sc.py),
        };
      }
    }
    return best;
  }

  function b6PickToward(nw, tx, ty, minDistGain) {
    if (b6BpSt.camAt === 0 || v4WsCells.size === 0) return null;
    const camDist = Math.hypot(b6BpSt.camX - tx, b6BpSt.camY - ty);
    let best = null,
      bestScore = -Infinity;
    for (const c of v4WsCells.values()) {
      if (
        c.tag !== 2 ||
        !c.oid ||
        c.oid === b6BpSt.curSpecOid ||
        v4SelfOids.has(c.oid)
      )
        continue;
      if (
        nw - (b6BadOid.get(c.oid) || 0) < 1500 ||
        nw - (b6SpecOid.get(c.oid) || 0) < 2400
      )
        continue;
      const pl = b6Plrs.get(c.oid),
        nm = pl ? pl.name : "";
      if (nm.includes("\uD83E\uDD16") || (nm && nm === b6BpSt.curSpecNick))
        continue;
      const sc = b6WorldToScr(c.x, c.y, c.r);
      if (!sc || sc.pr < 10 || !b6ScreenClear(sc.px, sc.py)) continue;
      const d = Math.hypot(c.x - tx, c.y - ty);
      if (minDistGain > 0 && d >= camDist - minDistGain) continue;
      const score =
        (b6InMainAoi(c.x, c.y, 120) ? 0 : 100000) -
        d +
        Math.min(4000, nw - (b6SeenOid.get(c.oid) || 0)) * 0.5;
      if (score > bestScore) {
        bestScore = score;
        best = {
          kind: "cvs",
          cid: c.cid,
          oid: c.oid,
          nick: nm,
          px: Math.round(sc.px),
          py: Math.round(sc.py),
          dist: d,
        };
      }
    }
    return best;
  }

  function b6PickNear(nw) {
    const m = b6BpSt.mainAoi,
      ms = b6BpSt.mainSelf;
    if ((!m || nw - m.at > 3500) && (!ms || nw - ms.at > 3500))
      return b6PickLb(nw, null, false);
    const aoi =
      m && nw - m.at <= 3500
        ? m
        : {
            minX: ms.x - 1900,
            minY: ms.y - 1900,
            maxX: ms.x + 1900,
            maxY: ms.y + 1900,
          };
    const mCX = (aoi.minX + aoi.maxX) * 0.5,
      mCY = (aoi.minY + aoi.maxY) * 0.5;
    const slots = b6NearSlots();

    let bestCvs = null;
    if (b6BpSt.cvsMiss < 2 && b6BpSt.camAt > 0 && v4WsCells.size > 0) {
      let bestScore = -Infinity;
      for (const c of v4WsCells.values()) {
        if (
          c.tag !== 2 ||
          !c.oid ||
          c.oid === b6BpSt.curSpecOid ||
          v4SelfOids.has(c.oid)
        )
          continue;
        if (
          nw - (b6BadOid.get(c.oid) || 0) < 1500 ||
          nw - (b6SpecOid.get(c.oid) || 0) < 2000
        )
          continue;
        const pl = b6Plrs.get(c.oid),
          nm = pl ? pl.name : "";
        if (nm.includes("\uD83E\uDD16") || (nm && nm === b6BpSt.curSpecNick))
          continue;
        const sc = b6WorldToScr(c.x, c.y, c.r);
        if (!sc || sc.pr < 10 || !b6ScreenClear(sc.px, sc.py)) continue;
        const score = b6ScoreNear(c.x, c.y, c.oid, c.r, nw, aoi, slots);
        if (score > bestScore) {
          bestScore = score;
          bestCvs = {
            kind: "cvs",
            cid: c.cid,
            oid: c.oid,
            nick: nm,
            px: Math.round(sc.px),
            py: Math.round(sc.py),
            score,
          };
        }
      }
    }

    let bestLb = null,
      bestLbScore = -Infinity;
    const rows = Array.from(
      document.querySelectorAll("#leaderboard-list > div"),
    );
    const lb = b6BpSt.lb,
      n = rows.length;
    let realCnt = 0;
    for (let i = 0; i < n; i++) {
      if (
        !((lb[i] && lb[i].nick) || rows[i].textContent || "").includes(
          "\uD83E\uDD16",
        )
      )
        realCnt++;
    }

    for (let k = 0; k < n; k++) {
      const i = (b6BpSt.rrIdx + k) % n,
        row = rows[i];
      const dNick = (row.textContent || "").trim().replace(/^\d+\.\s*/, "");
      const rec =
        lb[i] && (!dNick || lb[i].nick === dNick)
          ? lb[i]
          : dNick
            ? lb.find((x) => x.nick === dNick)
            : lb[i];
      const oid = rec ? rec.oid : 0;
      const nick = dNick || (rec ? rec.nick : "");
      if (
        (!nick && !oid) ||
        (oid && oid === b6BpSt.curSpecOid) ||
        (nick && nick === b6BpSt.curSpecNick)
      )
        continue;
      if (
        (oid && nw - (b6BadOid.get(oid) || 0) < 1500) ||
        (realCnt >= 2 && nick.includes("\uD83E\uDD16"))
      )
        continue;
      const isSelf = Boolean(oid && v4SelfOids.has(oid));
      const specAge = oid
        ? nw - (b6SpecOid.get(oid) || 0)
        : nw - (b6SpecNick.get(nick) || 0);
      if (specAge < (isSelf ? 6000 : 1000) && n > 2) continue;
      const agg = oid ? b6OidAgg.get(oid) : null;
      const score = isSelf
        ? b6BpSt.camAt > 0 &&
          Math.hypot(b6BpSt.camX - mCX, b6BpSt.camY - mCY) > 6500
          ? 60000
          : -400000
        : agg && nw - agg.at < 20000
          ? b6ScoreNear(
              agg.cx,
              agg.cy,
              oid,
              Math.sqrt(agg.totalR2),
              nw,
              aoi,
              slots,
            )
          : 45000 + Math.min(8000, specAge);
      if (score > bestLbScore) {
        bestLbScore = score;
        bestLb = { kind: "lb", idx: i, row, oid, nick, score };
      }
    }
    if (bestLb) b6BpSt.rrIdx = (bestLb.idx + 1) % n;
    if (
      bestCvs &&
      bestCvs.score >= 20000 &&
      (!bestLb || bestCvs.score >= bestLb.score)
    )
      return bestCvs;
    if (bestLb && bestLb.score >= 20000) {
      b6BpSt.cvsMiss = 0;
      return bestLb;
    }

    if (b6BpSt.cvsMiss < 2 && slots.length > 0) {
      let oldestIdx = -1,
        maxAge = -1;
      for (let i = 0; i < slots.length; i++) {
        if (slots[i] && nw - b6NearTs[i] > maxAge) {
          maxAge = nw - b6NearTs[i];
          oldestIdx = i;
        }
      }
      if (oldestIdx >= 0) {
        const stp = b6PickToward(
          nw,
          slots[oldestIdx][0],
          slots[oldestIdx][1],
          350,
        );
        if (stp) return stp;
      }
    }
    b6BpSt.cvsMiss = 0;
    return bestCvs || bestLb || b6PickLb(nw, null, false);
  }

  function b6PickCur(nw) {
    const mc = b6BpSt.mainCursor;
    if (!mc || nw - mc.at > 4000) return b6PickLb(nw, null, false);
    if (b6BpSt.liveAoi && b6InBox(mc.x, mc.y, b6BpSt.liveAoi, 350)) return null;
    const camDist =
      b6BpSt.camAt > 0
        ? Math.hypot(b6BpSt.camX - mc.x, b6BpSt.camY - mc.y)
        : Infinity;
    if (b6BpSt.cvsMiss < 2) {
      const cTgt = b6PickToward(nw, mc.x, mc.y, camDist > 2600 ? 350 : 0);
      if (cTgt && (cTgt.dist < 2400 || cTgt.dist < camDist - 350)) return cTgt;
    }
    b6BpSt.cvsMiss = 0;
    const rows = Array.from(
      document.querySelectorAll("#leaderboard-list > div"),
    );
    let best = null;
    for (let i = 0; i < rows.length; i++) {
      const dNick = (rows[i].textContent || "").trim().replace(/^\d+\.\s*/, "");
      const rec =
        b6BpSt.lb[i] && (!dNick || b6BpSt.lb[i].nick === dNick)
          ? b6BpSt.lb[i]
          : dNick
            ? b6BpSt.lb.find((x) => x.nick === dNick)
            : b6BpSt.lb[i];
      const oid = rec ? rec.oid : 0;
      const nick = dNick || (rec ? rec.nick : "");
      if (
        (!nick && !oid) ||
        (oid && oid === b6BpSt.curSpecOid) ||
        (nick && nick === b6BpSt.curSpecNick) ||
        (oid && v4SelfOids.has(oid))
      )
        continue;
      if (
        nick.includes("\uD83E\uDD16") ||
        (oid && nw - (b6BadOid.get(oid) || 0) < 1500)
      )
        continue;
      const specAge = oid
        ? nw - (b6SpecOid.get(oid) || 0)
        : nw - (b6SpecNick.get(nick) || 0);
      if (specAge < 1000 && rows.length > 2) continue;
      const agg = oid ? b6OidAgg.get(oid) : null;
      const aoiInfo = oid ? b6OidAoi.get(oid) : null;
      const score =
        aoiInfo && nw - aoiInfo.at < 15000 && b6InBox(mc.x, mc.y, aoiInfo, 250)
          ? 500000 + specAge
          : agg && nw - agg.at < 15000
            ? 300000 - Math.hypot(agg.cx - mc.x, agg.cy - mc.y)
            : 100000 + Math.min(8000, specAge);
      if (!best || score > best.score) {
        best = { kind: "lb", idx: i, row: rows[i], oid, nick, score };
      }
    }
    return best || b6PickLb(nw, null, false);
  }

  function b6PickBig(nw) {
    const rows = Array.from(
      document.querySelectorAll("#leaderboard-list > div"),
    );
    let firstValid = null,
      firstFallback = null;
    for (let i = 0; i < rows.length; i++) {
      const dNick = (rows[i].textContent || "").trim().replace(/^\d+\.\s*/, "");
      const rec =
        b6BpSt.lb[i] && (!dNick || b6BpSt.lb[i].nick === dNick)
          ? b6BpSt.lb[i]
          : dNick
            ? b6BpSt.lb.find((x) => x.nick === dNick)
            : b6BpSt.lb[i];
      const oid = rec ? rec.oid : 0;
      const nick = dNick || (rec ? rec.nick : "");
      if ((!nick && !oid) || (oid && nw - (b6BadOid.get(oid) || 0) < 1500))
        continue;
      if (!firstFallback)
        firstFallback = { kind: "lb", idx: i, row: rows[i], oid, nick };
      if (!nick.includes("\uD83E\uDD16")) {
        firstValid = { kind: "lb", idx: i, row: rows[i], oid, nick };
        break;
      }
    }
    const tgt = firstValid || firstFallback;
    if (
      !tgt ||
      (tgt.oid && tgt.oid === b6BpSt.curSpecOid) ||
      (tgt.nick && tgt.nick === b6BpSt.curSpecNick)
    )
      return null;
    return tgt;
  }

  function b6PickBest(nw) {
    const oid = b6BpSt.bestSpecOid,
      nick = b6BpSt.bestSpecNick;
    if (!oid || nw - (b6BadOid.get(oid) || 0) < 1500) return null;
    const rows = Array.from(
      document.querySelectorAll("#leaderboard-list > div"),
    );
    for (let i = 0; i < rows.length; i++) {
      const dNick = (rows[i].textContent || "").trim().replace(/^\d+\.\s*/, "");
      const rec =
        b6BpSt.lb[i] && (!dNick || b6BpSt.lb[i].nick === dNick)
          ? b6BpSt.lb[i]
          : dNick
            ? b6BpSt.lb.find((x) => x.nick === dNick)
            : b6BpSt.lb[i];
      const rNick = dNick || (rec ? rec.nick : "");
      if ((rec && rec.oid === oid) || (nick && rNick === nick)) {
        return { kind: "lb", idx: i, row: rows[i], oid, nick: rNick };
      }
    }
    return null;
  }

  function b6ScanStop() {
    b6BpSt.scanning = false;
    b6BpSt.phase = "idle";
    b6BpSt.holdUntil = 0;
    b6BpSt.needPeek = false;
    b6BpSt.wasPeek = false;
    b6BpSt.nextIsPeek = false;
    b6BpSt.returnToBest = false;
    b6BpSt.landedAt = 0;
    if (b6BpSt.cancelTm) {
      b6BpSt.cancelTm();
      b6BpSt.cancelTm = null;
    }
    b6CloseCtx();
  }

  function b6ScanStart() {
    p2LxQ8vM();
    b6BpSt.scanning = true;
    b6BpSt.phase = "idle";
    b6BpSt.phaseUntil = 0;
    b6BpSt.holdUntil = 0;
    b6BpSt.needPeek = false;
    b6BpSt.wasPeek = false;
    b6BpSt.nextIsPeek = false;
    b6BpSt.returnToBest = false;
    b6BpSt.cvsMiss = 0;
    b6ScanStep();
  }

  function b6ScanStep() {
    if (
      !b6BpSt.scanning ||
      !m9TvL2sP.bypassEnabled ||
      !b6BpSt.specEntered ||
      b6BpSt.wasAlive ||
      !b6IsMenuHidden()
    ) {
      b6ScanStop();
      return;
    }
    const nw = performance.now();

    if (b6BpSt.phase === "cvs_rmb") {
      if (nw < b6BpSt.phaseUntil) return;
      const cv = b6GameCanvas();
      const c = b6BpSt.pendCid ? v4WsCells.get(b6BpSt.pendCid) : null;
      const sc = cv && c ? b6WorldToScr(c.x, c.y, c.r) : null;
      if (!sc || sc.pr < 8 || !b6ScreenClear(sc.px, sc.py)) {
        b6BpSt.phase = "idle";
        b6BpSt.cvsMiss++;
        return;
      }
      const px = Math.round(sc.px),
        py = Math.round(sc.py);
      b6CloseCtx();
      b6DispMouse(window, "mousemove", 0, px, py, true);
      b6DispMouse(cv, "mousemove", 0, px, py, true);
      b6DispMouse(cv, "mousedown", 2, px, py, true);
      b6DispMouse(cv, "mouseup", 2, px, py, true);
      b6DispMouse(cv, "contextmenu", 2, px, py, false);
      b6BpSt.phase = "menu";
      b6BpSt.phaseUntil = nw + 130;
      if (b6BpSt.cancelTm) b6BpSt.cancelTm();
      b6BpSt.cancelTm = k7RunDelay(
        12,
        () => {
          b6BpSt.cancelTm = null;
          if (b6BpSt.scanning && b6BpSt.phase === "menu") b6ScanStep();
        },
        1,
      );
      return;
    }

    if (b6BpSt.phase === "menu") {
      const cm = document.getElementById("context-menu");
      const ms = document.getElementById("menu-spectate");
      const cn = document.getElementById("context-name");
      if (
        cm &&
        window.getComputedStyle(cm).display === "block" &&
        ms &&
        window.getComputedStyle(ms).display !== "none"
      ) {
        const menuNick = (cn && cn.textContent ? cn.textContent : "").trim();
        if (menuNick && menuNick === b6BpSt.curSpecNick) {
          b6CloseCtx();
          if (b6BpSt.pendKind === "cvs") b6BpSt.cvsMiss++;
          b6BpSt.nextIsPeek = false;
          b6BpSt.phase = "idle";
          return;
        }
        const mr = ms.getBoundingClientRect();
        const cx = Math.round(mr.left + mr.width * 0.5);
        const cy = Math.round(mr.top + mr.height * 0.5);
        b6BpSt.sentAt = nw;
        b6BpSt.lastClickAt = nw;
        b6BpSt.got46At = 0;
        b6BpSt.got02After46 = false;
        b6BpSt.hopFlushSent = false;
        b6BpSt.curHoldMs = 0;
        b6BpSt.wasPeek = b6BpSt.nextIsPeek;
        b6BpSt.nextIsPeek = false;
        if (b6BpSt.pendOid) {
          b6SpecOid.set(b6BpSt.pendOid, nw);
          const ag = b6OidAgg.get(b6BpSt.pendOid);
          try {
            q5RzL9wK.postMessage({
              type: "BYPASS_SCOUT_CLAIM",
              senderId: v8WpM2tL,
              oid: b6BpSt.pendOid,
              cx: ag ? ag.cx : 0,
              cy: ag ? ag.cy : 0,
            });
          } catch (_) {}
        }
        if (b6BpSt.pendNick) b6SpecNick.set(b6BpSt.pendNick, nw);
        b6DispMouse(ms, "mousedown", 0, cx, cy, true);
        b6DispMouse(ms, "mouseup", 0, cx, cy, true);
        b6DispMouse(ms, "click", 0, cx, cy, false);
        if (typeof ms.click === "function") ms.click();
        b6BpSt.phase = "confirm";
        b6BpSt.phaseUntil = nw + 780;
        return;
      }
      if (nw >= b6BpSt.phaseUntil) {
        b6CloseCtx();
        if (b6BpSt.pendKind === "cvs") b6BpSt.cvsMiss++;
        b6BpSt.nextIsPeek = false;
        b6BpSt.phase = "idle";
      } else {
        if (b6BpSt.cancelTm) b6BpSt.cancelTm();
        b6BpSt.cancelTm = k7RunDelay(
          12,
          () => {
            b6BpSt.cancelTm = null;
            if (b6BpSt.scanning && b6BpSt.phase === "menu") b6ScanStep();
          },
          1,
        );
      }
      return;
    }

    if (b6BpSt.phase === "confirm") {
      if (b6BpSt.got46At > b6BpSt.sentAt && b6BpSt.got02After46) {
        b6BpSt.cvsMiss = 0;
        b6BpSt.landedAt = nw;
        if (m9TvL2sP.bypassMethod !== "smart") {
          b6BpSt.wasPeek = false;
          b6BpSt.returnToBest = false;
          b6BpSt.needPeek = false;
          b6BpSt.holdUntil = 0;
        } else if (b6BpSt.wasPeek) {
          b6BpSt.wasPeek = false;
          b6BpSt.returnToBest = true;
          b6BpSt.holdUntil = 0;
        } else if (b6BpSt.curHoldMs > 0) {
          b6BpSt.holdUntil = nw + b6BpSt.curHoldMs;
          b6BpSt.needPeek = true;
        } else {
          b6BpSt.holdUntil = 0;
        }
        b6BpSt.phase = "idle";
      } else if (nw >= b6BpSt.phaseUntil) {
        if (b6BpSt.pendOid) b6BadOid.set(b6BpSt.pendOid, nw);
        b6BpSt.lastClickAt = nw + 220;
        if (b6BpSt.pendKind === "cvs") b6BpSt.cvsMiss++;
        b6BpSt.wasPeek = false;
        b6BpSt.phase = "idle";
      } else {
        return;
      }
    }

    if (b6BpSt.phase === "idle") {
      const useAnchor = m9TvL2sP.bypassMethod === "smart";
      if (
        useAnchor &&
        !b6BpSt.returnToBest &&
        b6BpSt.landedAt > 0 &&
        b6BpSt.curHoldMs > 0
      ) {
        const dyn = b6BpSt.landedAt + b6BpSt.curHoldMs;
        if (dyn > b6BpSt.holdUntil) {
          b6BpSt.holdUntil = dyn;
          if (b6BpSt.curHoldMs >= 350) b6BpSt.needPeek = true;
        }
      }
      if (
        (useAnchor && nw < b6BpSt.holdUntil) ||
        nw - b6BpSt.lastClickAt < b6ScanIntMs
      )
        return;

      let tgt = null;
      if (
        useAnchor &&
        b6BpSt.returnToBest &&
        b6BpSt.bestSpecOid &&
        nw - b6BpSt.bestSpecAt < 15000 &&
        b6BpSt.bestSpecOid !== b6BpSt.curSpecOid
      ) {
        tgt = b6PickBest(nw);
        b6BpSt.returnToBest = false;
      }
      if (useAnchor && !tgt && b6BpSt.needPeek) {
        b6BpSt.needPeek = false;
        const avAoi =
          b6BpSt.curSpecOid === b6BpSt.bestSpecOid
            ? b6BpSt.liveAoi
            : b6BpSt.bestSpecAoi;
        const lbP = b6PickLb(nw, avAoi, true);
        if (lbP && lbP.oid && nw - (b6SeenOid.get(lbP.oid) || 0) > 1300) {
          tgt = lbP;
        } else {
          tgt = (b6BpSt.cvsMiss < 2 ? b6PickBlind(nw, avAoi) : null) || lbP;
        }
        if (tgt && tgt.oid !== b6BpSt.bestSpecOid) b6BpSt.nextIsPeek = true;
      }

      if (!tgt) {
        if (m9TvL2sP.bypassMethod === "biggest") tgt = b6PickBig(nw);
        else if (m9TvL2sP.bypassMethod === "nearme") tgt = b6PickNear(nw);
        else if (m9TvL2sP.bypassMethod === "cursor") tgt = b6PickCur(nw);
        else if (m9TvL2sP.bypassMethod === "smart") {
          const lbT = b6PickLb(nw, null, true);
          if (lbT && lbT.oid && nw - (b6SeenOid.get(lbT.oid) || 0) > 1300) {
            tgt = lbT;
            b6BpSt.cvsMiss = 0;
          } else if (b6BpSt.cvsMiss < 2) {
            tgt = b6PickBlind(nw, null) || lbT;
          } else {
            tgt = lbT;
            b6BpSt.cvsMiss = 0;
          }
        } else {
          tgt = b6PickLb(nw, null, false);
        }
      }
      if (!tgt) return;

      b6BpSt.pendKind = tgt.kind;
      b6BpSt.pendOid = tgt.oid;
      b6BpSt.pendNick = tgt.nick;
      if (tgt.kind === "cvs") {
        const cv = b6GameCanvas();
        if (!cv) return;
        b6BpSt.pendCid = tgt.cid;
        b6DispMouse(window, "mousemove", 0, tgt.px, tgt.py, true);
        b6DispMouse(cv, "mousemove", 0, tgt.px, tgt.py, true);
        b6BpSt.phase = "cvs_rmb";
        b6BpSt.phaseUntil = nw + 20;
        if (b6BpSt.cancelTm) b6BpSt.cancelTm();
        b6BpSt.cancelTm = k7RunDelay(
          22,
          () => {
            b6BpSt.cancelTm = null;
            if (b6BpSt.scanning && b6BpSt.phase === "cvs_rmb") b6ScanStep();
          },
          1,
        );
        return;
      }

      const lr = tgt.row.getBoundingClientRect();
      if (lr.width < 5 || lr.height < 5) return;
      const lx = Math.round(lr.left + lr.width * 0.5);
      const ly = Math.round(lr.top + lr.height * 0.5);
      b6BpSt.pendCid = 0;
      b6CloseCtx();
      b6DispMouse(tgt.row, "mousemove", 0, lx, ly, true);
      b6DispMouse(tgt.row, "mousedown", 2, lx, ly, true);
      b6DispMouse(tgt.row, "mouseup", 2, lx, ly, true);
      b6DispMouse(tgt.row, "contextmenu", 2, lx, ly, false);
      b6BpSt.phase = "menu";
      b6BpSt.phaseUntil = nw + 130;
      if (b6BpSt.cancelTm) b6BpSt.cancelTm();
      b6BpSt.cancelTm = k7RunDelay(
        12,
        () => {
          b6BpSt.cancelTm = null;
          if (b6BpSt.scanning && b6BpSt.phase === "menu") b6ScanStep();
        },
        1,
      );
    }
  }

  b6TickScan = function () {
    const nw = performance.now();
    if (nw - b6BpSt.lastPingAt >= 480) {
      b6BpSt.lastPingAt = nw;
      v5PingPeers();
    }
    b6CheckPeerAlive(nw);
    const role = b6UpdateRole(nw);
    const canScan = Boolean(m9TvL2sP.bypassEnabled && role === "spec");
    if (canScan) {
      if (!b6BpSt.scanning) b6ScanStart();
      else {
        if (b6BpSt.bcPending) b6FlushBc(false);
        b6ScanStep();
      }
    } else if (b6BpSt.scanning) {
      b6ScanStop();
    }
  };

  function b6LblSprite(oid, name, mass, fz) {
    const mStr = mass > 0 ? String(mass) : "";
    const key = `${oid}|${name}|${mStr}|${fz}`;
    let sp = b6LblCache.get(key);
    if (sp) return sp;
    if (b6LblCache.size > 140)
      b6LblCache.delete(b6LblCache.keys().next().value);
    const c = document.createElement("canvas");
    const cx = c.getContext("2d");
    const fzM = Math.max(8, Math.round(fz * 0.78));
    cx.font = `700 ${fz}px Ubuntu,Arial,sans-serif`;
    const w1 = cx.measureText(name).width;
    let w2 = 0;
    if (mStr) {
      cx.font = `700 ${fzM}px Ubuntu,Arial,sans-serif`;
      w2 = cx.measureText(mStr).width;
    }
    const pad = Math.ceil(fz * 0.45);
    const w = Math.max(8, Math.ceil(Math.max(w1, w2)) + pad * 2);
    const h = mStr
      ? Math.ceil(fz + fzM + pad * 1.4)
      : Math.ceil(fz + pad * 1.4);
    c.width = w;
    c.height = h;
    cx.textAlign = "center";
    cx.textBaseline = "middle";
    cx.lineJoin = "round";
    const midX = w * 0.5;
    const drawTxt = (txt, sz, y) => {
      cx.font = `700 ${sz}px Ubuntu,Arial,sans-serif`;
      cx.lineWidth = Math.max(2, sz * 0.22);
      cx.strokeStyle = "rgba(0,0,0,0.82)";
      cx.fillStyle = "#ffffff";
      cx.strokeText(txt, midX, y);
      cx.fillText(txt, midX, y);
    };
    if (mStr) {
      drawTxt(name, fz, h * 0.34);
      drawTxt(mStr, fzM, h * 0.73);
    } else {
      drawTxt(name, fz, h * 0.5);
    }
    sp = { c, w, h };
    b6LblCache.set(key, sp);
    return sp;
  }

  function b6EnsureOv(gameCv) {
    if (!b6BpOvCv) {
      b6BpOvCv = document.createElement("canvas");
      b6BpOvCv.id = "macro-bypass-field";
      b6BpOvCv.style.cssText =
        "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:1;";
      b6BpOvCtx = b6BpOvCv.getContext("2d");
    }
    if (gameCv && gameCv.parentNode) {
      if (
        b6BpOvCv.parentNode !== gameCv.parentNode ||
        b6BpOvCv.previousSibling !== gameCv
      ) {
        gameCv.parentNode.insertBefore(b6BpOvCv, gameCv.nextSibling);
      }
    } else if (!b6BpOvCv.isConnected && document.body) {
      document.body.appendChild(b6BpOvCv);
    }
  }

  function b6StepPhantoms(nw, sm, aoi, hasAoi) {
    const b = b6BpSt.bounds;
    const virusTTL = Math.max(m9TvL2sP.bypassTtl, 35000);
    for (const [cid, p] of b6Phantoms) {
      const ttl = p.tag === 3 || p.tag === 4 ? virusTTL : m9TvL2sP.bypassTtl;
      if (!b6BpSt.scanning && nw - p.rxAt > ttl) {
        b6Phantoms.delete(cid);
        continue;
      }
      if (v4WsCells.has(cid)) {
        b6Phantoms.delete(cid);
        continue;
      }
      if (
        hasAoi &&
        nw - p.rxAt > 250 &&
        b6InBox(p.tx, p.ty, aoi, 90) &&
        b6InBox(p.dx, p.dy, aoi, 90)
      ) {
        b6Phantoms.delete(cid);
        continue;
      }
      let gx = p.tx,
        gy = p.ty;
      if (p.tag === 2 && (p.vx !== 0 || p.vy !== 0)) {
        const ageSec = Math.max(0, (nw - p.rxAt) * 0.001);
        const spd = Math.hypot(p.vx, p.vy);
        const tau = spd > 650 ? 0.48 : 0.85;
        const tEff = Math.min(ageSec, spd > 650 ? 1.8 : 2.2);
        const disp = tau * (1 - Math.exp(-tEff / tau));
        gx = Math.max(b[0], Math.min(b[2], p.tx + p.vx * disp));
        gy = Math.max(b[1], Math.min(b[3], p.ty + p.vy * disp));
      }
      p.dx += (gx - p.dx) * sm;
      p.dy += (gy - p.dy) * sm;
      p.dr += (p.tr - p.dr) * sm;
    }
  }

  function b6RenderFrame() {
    try {
      const nw = performance.now();
      v4StepInterp(nw);
      b6CheckPeerAlive(nw);
      const menuHid = b6IsMenuHidden();
      const cam = v4GetCam();

      const dlt = Math.min(50, Math.max(8, nw - b6BpSt.lastOvAt));
      const sm = 1 - Math.exp(-14 * dlt * 0.001);

      if (
        (m9TvL2sP.bypassPhantoms || m9TvL2sP.bypassRadar) &&
        !b6BpSt.scanning &&
        b6Phantoms.size > 0
      ) {
        const aoi = b6SafeBox();
        const hasAoi = Boolean(
          aoi && aoi.maxX - aoi.minX > 600 && aoi.maxY - aoi.minY > 600,
        );
        b6StepPhantoms(nw, sm, aoi, hasAoi);
      }

      const hasCam = Boolean(cam);
      const active = Boolean(
        m9TvL2sP.bypassPhantoms &&
        !b6BpSt.scanning &&
        hasCam &&
        b6Phantoms.size > 0 &&
        nw - b6BpSt.lastRxAt < Math.max(m9TvL2sP.bypassTtl, 35000) + 500 &&
        menuHid,
      );

      if (
        b6BpOvCv &&
        (!active || !m9TvL2sP.bypassPhantoms || b6Phantoms.size === 0)
      ) {
        if (b6BpOvDirty) {
          b6BpOvCtx.setTransform(1, 0, 0, 1, 0, 0);
          b6BpOvCtx.clearRect(0, 0, b6BpOvCv.width, b6BpOvCv.height);
          b6BpOvDirty = false;
        }
      } else if (
        active &&
        m9TvL2sP.bypassPhantoms &&
        b6Phantoms.size > 0 &&
        nw - b6BpSt.lastOvAt >= 13
      ) {
        b6BpSt.lastOvAt = nw;
        const gameCv = cam.cv || b6GameCanvas();
        b6EnsureOv(gameCv);
        const vw = window.innerWidth,
          vh = window.innerHeight;
        if (b6BpOvCv.width !== vw || b6BpOvCv.height !== vh) {
          b6BpOvCv.width = vw;
          b6BpOvCv.height = vh;
        }
        const rc = cam.rc;

        if (rc && rc.width > 0 && rc.height > 0) {
          const visReal = [];
          for (const wc of v4WsCells.values()) {
            if (wc.tag !== 2) continue;
            const wr = wc.dr !== undefined ? wc.dr : wc.r;
            if (wr <= 0) continue;
            const pr = wr * cam.scale;
            if (pr < 8) continue;
            const wx = wc.dx !== undefined ? wc.dx : wc.x;
            const wy = wc.dy !== undefined ? wc.dy : wc.y;
            const px = cam.a * wx + cam.c * wy + cam.tx;
            const py = cam.b * wx + cam.d * wy + cam.ty;
            if (
              px + pr >= rc.left &&
              px - pr <= rc.right &&
              py + pr >= rc.top &&
              py - pr <= rc.bottom
            ) {
              visReal.push({ isMask: true, px, py, pr });
            }
          }

          const visPh = [];
          const virusTTL = Math.max(m9TvL2sP.bypassTtl, 35000);
          for (const [cid, p] of b6Phantoms) {
            if (
              v4WsCells.has(cid) ||
              (p.tag === 2 && !b6BpSt.specEntered && v4SelfOids.has(p.oid))
            )
              continue;
            const ttl =
              p.tag === 3 || p.tag === 4 ? virusTTL : m9TvL2sP.bypassTtl;
            const age = nw - p.rxAt;
            const fade = age > ttl - 900 ? Math.max(0, (ttl - age) / 900) : 1;
            if (fade <= 0.02) continue;

            const px = cam.a * p.dx + cam.c * p.dy + cam.tx;
            const py = cam.b * p.dx + cam.d * p.dy + cam.ty;
            const pr = p.dr * cam.scale;
            if (
              pr < 2 ||
              px + pr < rc.left ||
              px - pr > rc.right ||
              py + pr < rc.top ||
              py - pr > rc.bottom
            )
              continue;

            let hidden = false;
            for (let j = 0; j < visReal.length; j++) {
              const m = visReal[j],
                lim = m.pr + 1.5 - pr;
              if (
                m.pr >= pr * 0.96 &&
                lim >= 0 &&
                (px - m.px) ** 2 + (py - m.py) ** 2 <= lim * lim
              ) {
                hidden = true;
                break;
              }
            }
            if (!hidden) visPh.push({ isMask: false, p, px, py, pr, fade });
          }

          visPh.sort((a, b) => a.pr - b.pr);
          const drawList = [];
          for (let i = 0; i < visPh.length; i++) {
            const it = visPh[i];
            let covered = false;
            for (let j = i + 1; j < visPh.length; j++) {
              const big = visPh[j],
                lim = big.pr + 1.5 - it.pr;
              if (
                lim >= 0 &&
                (it.px - big.px) ** 2 + (it.py - big.py) ** 2 <= lim * lim
              ) {
                covered = true;
                break;
              }
            }
            if (!covered) drawList.push(it);
          }
          for (let i = 0; i < visReal.length; i++) drawList.push(visReal[i]);
          drawList.sort((a, b) =>
            a.pr !== b.pr ? a.pr - b.pr : a.isMask ? 1 : -1,
          );

          b6BpOvCtx.setTransform(1, 0, 0, 1, 0, 0);
          b6BpOvCtx.clearRect(0, 0, vw, vh);
          const needClip =
            rc.left > 1 ||
            rc.top > 1 ||
            rc.right < vw - 1 ||
            rc.bottom < vh - 1;
          if (needClip) {
            b6BpOvCtx.save();
            b6BpOvCtx.beginPath();
            b6BpOvCtx.rect(rc.left, rc.top, rc.width, rc.height);
            b6BpOvCtx.clip();
          }

          const drawnPh = [];
          let curComp = "source-over";
          b6BpOvCtx.globalCompositeOperation = "source-over";

          for (let i = 0; i < drawList.length; i++) {
            const it = drawList[i];
            let ov = false;
            if (it.pr >= 8) {
              for (let k = drawnPh.length - 1; k >= 0; k--) {
                const dp = drawnPh[k],
                  lim = it.pr + dp.pr + 3;
                if (
                  Math.abs(it.px - dp.px) <= lim &&
                  Math.abs(it.py - dp.py) <= lim &&
                  (it.px - dp.px) ** 2 + (it.py - dp.py) ** 2 < lim * lim
                ) {
                  ov = true;
                  break;
                }
              }
            }
            if (it.isMask) {
              if (!ov) continue;
              if (curComp !== "destination-out") {
                b6BpOvCtx.globalCompositeOperation = "destination-out";
                curComp = "destination-out";
              }
              b6BpOvCtx.fillStyle = "#000";
              b6BpOvCtx.globalAlpha = 1;
              b6BpOvCtx.beginPath();
              b6BpOvCtx.arc(it.px, it.py, it.pr + 1.2, 0, Math.PI * 2);
              b6BpOvCtx.fill();
              continue;
            }
            const { p, px, py, pr, fade } = it;
            const lw = Math.max(1.3, Math.min(2.6, pr * 0.035));
            if (ov) {
              if (curComp !== "destination-out") {
                b6BpOvCtx.globalCompositeOperation = "destination-out";
                curComp = "destination-out";
              }
              b6BpOvCtx.fillStyle = "#000";
              b6BpOvCtx.globalAlpha = 1;
              b6BpOvCtx.beginPath();
              b6BpOvCtx.arc(px, py, pr + Math.max(1, lw * 0.6), 0, Math.PI * 2);
              b6BpOvCtx.fill();
            }
            if (curComp !== "source-over") {
              b6BpOvCtx.globalCompositeOperation = "source-over";
              curComp = "source-over";
            }

            if (p.tag === 3 || p.tag === 4) {
              const col = p.tag === 4 ? "245,158,11" : "52,211,153";
              b6BpOvCtx.beginPath();
              b6BpOvCtx.arc(px, py, pr, 0, Math.PI * 2);
              b6BpOvCtx.fillStyle = `rgba(${col},${0.16 * fade})`;
              b6BpOvCtx.fill();
              b6BpOvCtx.strokeStyle = `rgba(${col},${0.8 * fade})`;
              b6BpOvCtx.lineWidth = 1.4;
              b6BpOvCtx.stroke();
              drawnPh.push(it);
              continue;
            }

            const pl = b6Plrs.get(p.oid) || b6RemPlrs.get(p.oid);
            if (pl) pl.at = nw;
            const col =
              pl && pl.rgb
                ? `${pl.rgb[0]},${pl.rgb[1]},${pl.rgb[2]}`
                : "120,190,255";
            b6BpOvCtx.beginPath();
            b6BpOvCtx.arc(px, py, pr, 0, Math.PI * 2);
            b6BpOvCtx.fillStyle = `rgba(${col},${0.24 * fade})`;
            b6BpOvCtx.fill();
            b6BpOvCtx.strokeStyle = `rgba(${col},${0.94 * fade})`;
            b6BpOvCtx.lineWidth = lw;
            b6BpOvCtx.stroke();

            if (pr >= 15) {
              const fzB = Math.max(
                10,
                Math.round(
                  Math.max(10, Math.min(26, Math.round(pr * 0.27))) / 4,
                ) * 4,
              );
              const nm = pl && pl.name ? pl.name : `#${p.oid}`;
              const massB =
                pr >= 26
                  ? Math.round((((p.dr * p.dr) / 25) | 0) / 100) * 100
                  : 0;
              const sp = b6LblSprite(p.oid, nm, massB, fzB);
              b6BpOvCtx.globalAlpha = 0.94 * fade;
              b6BpOvCtx.drawImage(
                sp.c,
                Math.round(px - sp.w * 0.5),
                Math.round(py - sp.h * 0.5),
              );
              b6BpOvCtx.globalAlpha = 1;
            }
            if (pr >= 8) drawnPh.push(it);
          }
          b6BpOvCtx.globalCompositeOperation = "source-over";
          b6BpOvCtx.globalAlpha = 1;
          if (needClip) b6BpOvCtx.restore();
          b6BpOvDirty = true;
        }
      }

      if (b6BpRdCv && b6BpRdCtx && b6BpMapWin) {
        const winOpen = Boolean(
          b6BpWinEl && b6BpWinEl.classList.contains("open"),
        );
        const showR = Boolean(
          m9TvL2sP.bypassRadar && !b6BpSt.scanning && (menuHid || winOpen),
        );
        if (b6BpMapWin.style.display !== (showR ? "block" : "none")) {
          b6BpMapWin.style.display = showR ? "block" : "none";
        }
        if (showR && nw - b6BpSt.lastRdAt >= 14) {
          b6BpSt.lastRdAt = nw;
          const S = b6BpMapWin.clientWidth || m9TvL2sP.bypassMapSize;
          const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
          const tS = Math.round(S * dpr);
          if (b6BpRdCv.width !== tS || b6BpRdCv.height !== tS) {
            b6BpRdCv.width = tS;
            b6BpRdCv.height = tS;
          }
          b6BpRdCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
          b6BpRdCtx.clearRect(0, 0, S, S);

          const b = b6BpSt.bounds;
          const mw = Math.max(1000, b[2] - b[0]);
          const mh = Math.max(1000, b[3] - b[1]);
          const toX = (wx) => ((wx - b[0]) / mw) * S;
          const toY = (wy) => ((wy - b[1]) / mh) * S;

          b6BpRdCtx.strokeStyle = "rgba(255,255,255,0.06)";
          b6BpRdCtx.lineWidth = 1;
          b6BpRdCtx.beginPath();
          for (let g = 1; g < 5; g++) {
            const p = (S * g) / 5;
            b6BpRdCtx.moveTo(p, 0);
            b6BpRdCtx.lineTo(p, S);
            b6BpRdCtx.moveTo(0, p);
            b6BpRdCtx.lineTo(S, p);
          }
          b6BpRdCtx.stroke();

          if (menuHid) {
            const isFixedRad = m9TvL2sP.bypassRadarMode === "fixed";
            const fixEnemyR = Math.max(2.4, Math.round(S * 0.013 * 10) / 10);
            const fixSelfR = Math.max(3.2, Math.round(S * 0.017 * 10) / 10);
            const rList = [];

            for (const [cid, p] of b6Phantoms) {
              if (
                p.tag !== 2 ||
                v4WsCells.has(cid) ||
                (!b6BpSt.specEntered && v4SelfOids.has(p.oid))
              )
                continue;
              const age = nw - p.rxAt;
              const fade =
                age > m9TvL2sP.bypassTtl - 900
                  ? Math.max(0.12, (m9TvL2sP.bypassTtl - age) / 900)
                  : 1;
              const pl = b6Plrs.get(p.oid) || b6RemPlrs.get(p.oid);
              if (pl) pl.at = nw;
              const rawR = (p.dr * S) / mw;
              rList.push({
                x: toX(p.dx),
                y: toY(p.dy),
                rawR,
                r: isFixedRad ? fixEnemyR : Math.max(1.8, rawR),
                rgb: pl && pl.rgb ? pl.rgb : [120, 190, 255],
                fade,
                live: false,
                me: false,
              });
            }

            for (const c of v4WsCells.values()) {
              if (c.tag !== 2) continue;
              const cx = c.dx !== undefined ? c.dx : c.x;
              const cy = c.dy !== undefined ? c.dy : c.y;
              const cr = c.dr !== undefined ? c.dr : c.r;
              const rawR = (cr * S) / mw;
              const isMe = !b6BpSt.specEntered && v4SelfOids.has(c.oid);
              const pl = b6Plrs.get(c.oid);
              if (pl) pl.at = nw;
              rList.push({
                x: toX(cx),
                y: toY(cy),
                rawR,
                r: isFixedRad
                  ? isMe
                    ? fixSelfR
                    : fixEnemyR
                  : Math.max(isMe ? 2.5 : 2, rawR),
                rgb: isMe
                  ? [255, 255, 255]
                  : pl && pl.rgb
                    ? pl.rgb
                    : [250, 204, 21],
                fade: 1,
                live: true,
                me: isMe,
              });
            }

            rList.sort((a, b) => {
              if (isFixedRad && a.me !== b.me) return a.me ? 1 : -1;
              return a.rawR !== b.rawR ? a.rawR - b.rawR : a.live ? 1 : -1;
            });
            for (let i = 0; i < rList.length; i++) {
              const d = rList[i];
              if (d.me) {
                b6BpRdCtx.fillStyle = "#ffffff";
                b6BpRdCtx.beginPath();
                b6BpRdCtx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                b6BpRdCtx.fill();
                continue;
              }
              const k = d.fade * (d.live ? 0.94 : 0.86);
              const cr = Math.round(14 + (d.rgb[0] - 14) * k);
              const cg = Math.round(15 + (d.rgb[1] - 15) * k);
              const cb = Math.round(19 + (d.rgb[2] - 19) * k);
              b6BpRdCtx.beginPath();
              b6BpRdCtx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
              b6BpRdCtx.fillStyle = `rgb(${cr},${cg},${cb})`;
              b6BpRdCtx.fill();
              if (d.r >= 3) {
                b6BpRdCtx.strokeStyle = `rgba(255,255,255,${0.18 * d.fade})`;
                b6BpRdCtx.lineWidth = 0.8;
                b6BpRdCtx.stroke();
              }
            }
          }
        }
      }

      if (!b6BpSt.scanning && b6BpSt.inMatch && nw - b6BpSt.mainBcAt >= 110) {
        b6SendMainAoi(nw);
      }
    } catch (_) {}
  }

  let b6InPeerSync = false;
  let b6LastSyncStr = "";

  function b6PickSyncCfg(src) {
    const out = {};
    for (let i = 0; i < b6SyncKeys.length; i++) {
      const k = b6SyncKeys[i];
      if (Object.prototype.hasOwnProperty.call(src, k)) out[k] = src[k];
    }
    return out;
  }

  b6LastSyncStr = JSON.stringify(b6PickSyncCfg(m9TvL2sP));

  b6BcSyncFn = function (force) {
    if (b6InPeerSync) return;
    const snap = b6PickSyncCfg(m9TvL2sP);
    const str = JSON.stringify(snap);
    if (!force && str === b6LastSyncStr) return;
    b6LastSyncStr = str;
    try {
      q5RzL9wK.postMessage({
        type: "MACRO_FULL_CFG_SYNC",
        senderId: v8WpM2tL,
        cfg: snap,
      });
    } catch (_) {}
  };

  function b6ApplyPeerCfg(src) {
    if (!src || typeof src !== "object") return;
    const data = b6NormCfgFn
      ? b6NormCfgFn(Object.assign({}, m9TvL2sP, src))
      : src;
    let chg = false;
    let ffChg = false;
    let langChg = false;
    let palChg = false;
    let mapBgChg = false;
    let fixBgChg = false;
    let rScaleChg = false;
    let plexusChg = false;
    let syncScaleChg = false;
    let mapPosChg = false;
    for (let i = 0; i < b6SyncKeys.length; i++) {
      const k = b6SyncKeys[i];
      if (!Object.prototype.hasOwnProperty.call(data, k)) continue;
      const nv = data[k];
      const ov = m9TvL2sP[k];
      const eq =
        k === "extraFastFeeds"
          ? JSON.stringify(ov) === JSON.stringify(nv)
          : ov === nv;
      if (eq) continue;
      chg = true;
      if (k === "extraFastFeeds") {
        m9TvL2sP[k] = Array.isArray(nv)
          ? nv.map((x) => ({ delay: x.delay, key: x.key }))
          : [];
        c6RmP3xW.clear();
        ffChg = true;
        continue;
      }
      m9TvL2sP[k] = nv;
      if (k === "bypassEnabled") {
        b6BpSt.enableGraceUntil = 0;
        if (!nv) {
          b6ScanStop();
          if (!m9TvL2sP.bypassPhantoms && !m9TvL2sP.bypassRadar)
            b6ResetWorld(false);
        }
      } else if (k === "bypassMethod") {
        b6BpSt.cvsMiss = 0;
        b6BpSt.holdUntil = 0;
        b6BpSt.needPeek = false;
        b6BpSt.wasPeek = false;
        b6BpSt.nextIsPeek = false;
        b6BpSt.returnToBest = false;
      } else if (k === "revMethod") {
        q2WnS7xM(false);
      } else if (k === "ffMethod") {
        k4FfCancel(false);
      } else if (k === "keyHoldSpam" && !nv) {
        hCl2xK9m();
      } else if (
        k === "holdSpamMode" &&
        nv === "release" &&
        (!document.hasFocus() || document.hidden)
      ) {
        hCl2xK9m();
      } else if (k === "softColors" && !nv) {
        j2RstSoft();
      } else if (k === "revNotify" && !nv) {
        if (r9RevNotClr) r9RevNotClr();
      } else if (k === "mapBgSrc") {
        mapBgChg = true;
      } else if (k === "fixedBgSrc") {
        fixBgChg = true;
      } else if (k === "renderScaleToggle" || k === "renderScale") {
        rScaleChg = true;
      } else if (k === "plexusEnabled") {
        plexusChg = true;
      } else if (k === "syncScale") {
        syncScaleChg = true;
      } else if (
        k === "bypassMapX" ||
        k === "bypassMapY" ||
        k === "bypassMapSize"
      ) {
        mapPosChg = true;
      } else if (
        k === "menuColor" ||
        k === "buttonsColor" ||
        k === "plexusColor"
      ) {
        palChg = true;
      } else if (k === "lang") {
        langChg = true;
      }
    }
    if (!chg) return;
    b6InPeerSync = true;
    try {
      b6LastSyncStr = JSON.stringify(b6PickSyncCfg(m9TvL2sP));
      if (palChg && b6ClearPalHistFn) b6ClearPalHistFn();
      if (mapBgChg) {
        if (!m9TvL2sP.mapBgSrc) window.setMapBackground(null);
        else
          k2LoadBg("mapBgSrc", "map", window.setMapBackground, "mapBgEnabled");
      }
      if (fixBgChg) {
        if (!m9TvL2sP.fixedBgSrc) window.setFixedBackground(null);
        else
          k2LoadBg(
            "fixedBgSrc",
            "fixed",
            window.setFixedBackground,
            "fixedBackgroundEnabled",
          );
      }
      if (rScaleChg && p9RndRef) p9ApplyRes(p9RndRef);
      if (plexusChg && s2NpK7wL) s2NpK7wL();
      if (syncScaleChg && b6BpWinEl) q6VxM4tN(b6BpWinEl);
      if (mapPosChg && b6FitMapWin) b6FitMapWin();
      if (ffChg && b6RebuildFfFn) b6RebuildFfFn();
      if (langChg && b6ApplyLangFn) b6ApplyLangFn();
      else if (document.getElementById("macro-window")) r8QnM4tL();
      if (e7CfgBoxSync) e7CfgBoxSync(false);
    } finally {
      b6InPeerSync = false;
    }
  }

  function w4ProjCell(c, cam) {
    if (!c || !cam || c.tag !== 2) return null;
    const wx = c.dx !== undefined ? c.dx : c.x;
    const wy = c.dy !== undefined ? c.dy : c.y;
    const wr = c.dr !== undefined ? c.dr : c.r;
    if (
      !Number.isFinite(wx) ||
      !Number.isFinite(wy) ||
      !Number.isFinite(wr) ||
      wr <= 0
    ) {
      return null;
    }
    const cx = cam.a * wx + cam.c * wy + cam.tx;
    const cy = cam.b * wx + cam.d * wy + cam.ty;
    const r = wr * cam.scale;
    if (r < 4) return null;
    return { cellId: c.cid, cx, cy, r };
  }

  function w4ReadLocked() {
    const lk = v4WsLock;
    if (!lk) return null;
    const c = v4WsCells.get(lk.cellId);
    if (!c || c.tag !== 2) return null;
    const cam = v4GetCam();
    if (!cam) return null;
    return w4ProjCell(c, cam);
  }

  function w4GetCurSelfOid() {
    const id = parseInt(g5ReadPid(), 10);
    if (Number.isSafeInteger(id) && id > 0) return id;
    if (v4ActOid > 0) return v4ActOid;
    return v4MyOid;
  }

  function w4ReadFfLocked() {
    const lk = v4FfLock;
    if (!lk) return null;
    const c = v4WsCells.get(lk.cellId);
    if (!c || c.tag !== 2) return null;
    const cam = v4GetCam();
    if (!cam) return null;
    return w4ProjCell(c, cam);
  }

  function w4FindFfTarget(x, y) {
    const cam = v4GetCam();
    if (!cam) return null;
    const curSelf = w4GetCurSelfOid();
    if (!curSelf) return null;
    let best = null;
    for (const c of v4WsCells.values()) {
      if (c.tag !== 2 || !c.oid || c.oid === curSelf) continue;
      const p = w4ProjCell(c, cam);
      if (!p || Math.hypot(x - p.cx, y - p.cy) > p.r) continue;
      if (!best || p.r >= best.r) {
        best = {
          cellId: p.cellId,
          cx: p.cx,
          cy: p.cy,
          r: p.r,
          oid: c.oid,
          node: null,
          model: null,
        };
      }
    }
    return best;
  }

  function w4FindEnemy(x, y) {
    const cam = v4GetCam();
    if (!cam) return null;
    q9ReadSelfOid();
    let best = null;
    for (const c of v4WsCells.values()) {
      if (c.tag !== 2 || !c.oid) continue;
      if (v4SelfOids.has(c.oid) || v4PtyOids.has(c.oid)) continue;
      const p = w4ProjCell(c, cam);
      if (!p || Math.hypot(x - p.cx, y - p.cy) > p.r) continue;
      if (!best || p.r >= best.r) {
        best = {
          cellId: p.cellId,
          cx: p.cx,
          cy: p.cy,
          r: p.r,
          oid: c.oid,
          node: null,
          model: null,
        };
      }
    }
    return best;
  }

  const u9PxL2wT = new Set();
  window.addEventListener(
    "keydown",
    (e) => {
      const tg = e.target,
        tn = tg && tg.tagName ? tg.tagName.toLowerCase() : "";
      if (
        (tn === "input" && tg.type !== "checkbox") ||
        tn === "textarea" ||
        (tg && tg.isContentEditable)
      )
        return;
      if (
        e.isTrusted &&
        !d5TxL2wV(e.code) &&
        e.code !== m9TvL2sP.keyMenu &&
        e.code !== m9TvL2sP.keyHoldSpam
      ) {
        u9PxL2wT.add(e.keyCode);
      }
    },
    true,
  );
  window.addEventListener(
    "keyup",
    (e) => {
      if (e.isTrusted) u9PxL2wT.delete(e.keyCode);
    },
    true,
  );
  window.addEventListener("blur", () => u9PxL2wT.clear());

  const g2BindTbl = {
    sw: 9,
    ej: 1,
    sp: 32,
    arr: [0, 32, -1, -1, -1, -1, -1, -1, -1],
    plans: [null],
    rev: { kc: 32, n: 2 },
  };

  const m9MbSt = {
    on: false,
    box1Id: "",
    box2Id: "",
    activeId: "",
    activeBox: 0,
    matchGen: 0,
    swSeq: 0,
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
      8: ["Backspace", "Backspace"],
      9: ["Tab", "Tab"],
      13: ["Enter", "Enter"],
      16: ["ShiftLeft", "Shift"],
      17: ["ControlLeft", "Control"],
      18: ["AltLeft", "Alt"],
      19: ["Pause", "Pause"],
      20: ["CapsLock", "CapsLock"],
      27: ["Escape", "Escape"],
      32: ["Space", " "],
      33: ["PageUp", "PageUp"],
      34: ["PageDown", "PageDown"],
      35: ["End", "End"],
      36: ["Home", "Home"],
      37: ["ArrowLeft", "ArrowLeft"],
      38: ["ArrowUp", "ArrowUp"],
      39: ["ArrowRight", "ArrowRight"],
      40: ["ArrowDown", "ArrowDown"],
      45: ["Insert", "Insert"],
      46: ["Delete", "Delete"],
      106: ["NumpadMultiply", "*"],
      107: ["NumpadAdd", "+"],
      109: ["NumpadSubtract", "-"],
      110: ["NumpadDecimal", "."],
      111: ["NumpadDivide", "/"],
      186: ["Semicolon", ";"],
      187: ["Equal", "="],
      188: ["Comma", ","],
      189: ["Minus", "-"],
      190: ["Period", "."],
      191: ["Slash", "/"],
      192: ["Backquote", "`"],
      219: ["BracketLeft", "["],
      220: ["Backslash", "\\"],
      221: ["BracketRight", "]"],
      222: ["Quote", "'"],
    };
    if (spMap[kc])
      return { isMouse: false, code: spMap[kc][0], key: spMap[kc][1], kc: kc };
    if (kc >= 65 && kc <= 90) {
      const ch = String.fromCharCode(kc);
      return {
        isMouse: false,
        code: "Key" + ch,
        key: ch.toLowerCase(),
        kc: kc,
      };
    }
    if (kc >= 48 && kc <= 57) {
      const ch = String.fromCharCode(kc);
      return { isMouse: false, code: "Digit" + ch, key: ch, kc: kc };
    }
    if (kc >= 96 && kc <= 105) {
      const d = String(kc - 96);
      return { isMouse: false, code: "Numpad" + d, key: d, kc: kc };
    }
    if (kc >= 112 && kc <= 123) {
      const f = "F" + (kc - 111);
      return { isMouse: false, code: f, key: f, kc: kc };
    }
    return { isMouse: false, code: "", key: "", kc: kc };
  }

  function n4TxtToKc(tx) {
    const s = String(tx || "")
      .trim()
      .toUpperCase();
    if (!s) return -1;
    const mp = {
      NONE: -1,
      UNBOUND: -1,
      NULL: -1,
      SPACE: 32,
      SPACEBAR: 32,
      TAB: 9,
      ENTER: 13,
      RETURN: 13,
      BACKSPACE: 8,
      SHIFT: 16,
      LSHIFT: 16,
      RSHIFT: 16,
      CTRL: 17,
      LCTRL: 17,
      CONTROL: 17,
      ALT: 18,
      LALT: 18,
      RALT: 18,
      "LEFT SHIFT": 16,
      "RIGHT SHIFT": 16,
      "LEFT CTRL": 17,
      "RIGHT CTRL": 17,
      "LEFT ALT": 18,
      "RIGHT ALT": 18,
      "CAPS LOCK": 20,
      "PAGE UP": 33,
      "PAGE DOWN": 34,
      CAPS: 20,
      CAPSLOCK: 20,
      ESC: 27,
      ESCAPE: 27,
      INS: 45,
      INSERT: 45,
      DEL: 46,
      DELETE: 46,
      HOME: 36,
      END: 35,
      PGUP: 33,
      PAGEUP: 33,
      PGDN: 34,
      PAGEDOWN: 34,
      LEFT: 37,
      ARROWLEFT: 37,
      UP: 38,
      ARROWUP: 38,
      RIGHT: 39,
      ARROWRIGHT: 39,
      DOWN: 40,
      ARROWDOWN: 40,
      MOUSE1: 1,
      LMB: 1,
      MOUSE2: 2,
      MMB: 2,
      MOUSE3: 3,
      RMB: 3,
      MOUSE4: 4,
      MOUSE5: 5,
      ";": 186,
      "=": 187,
      ",": 188,
      "-": 189,
      ".": 190,
      "/": 191,
      "`": 192,
      "[": 219,
      "\\": 220,
      "]": 221,
      "'": 222,
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
    const ks = [
      "kSplit",
      "kDoubleSplit",
      "kTripleSplit",
      "kQuadSplit",
      "kPentaSplit",
      "kHexaSplit",
      "kSeptiSplit",
      "kOctoSplit",
    ];
    try {
      const raw = localStorage.getItem("keybinds");
      if (raw) {
        const kb = JSON.parse(raw);
        if (kb && typeof kb === "object") {
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
      const pr =
        document.getElementById("kContextMenu") ||
        document.getElementById("kEjectMass") ||
        document.getElementById("kSplit");
      if (pr && pr.textContent && pr.textContent.trim()) {
        for (let i = 0; i < ks.length; i++) {
          const b = document.getElementById(ks[i]);
          if (b) {
            const kc = n4TxtToKc(b.textContent);
            if (kc === -1 || kc > 0) g2BindTbl.arr[i + 1] = kc;
          }
        }
        const sb = document.getElementById("kMultiboxSwitch");
        if (sb) {
          const skc = n4TxtToKc(sb.textContent);
          if (skc === -1 || skc > 0) g2BindTbl.sw = skc;
        }
        const eb = document.getElementById("kEjectMass");
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
      if (!k4CbEl || !document.contains(k4CbEl))
        k4CbEl = document.getElementById("cMultibox");
      if (k4CbEl) {
        m9MbSt.on = Boolean(k4CbEl.checked);
        return;
      }
    }
    try {
      const raw = localStorage.getItem("options");
      if (raw) {
        const op = JSON.parse(raw);
        if (op && typeof op === "object") m9MbSt.on = Boolean(op.cMultibox);
      }
    } catch (_) {}
  }

  function m4IsMbOn() {
    if (!k4CbEl || !document.contains(k4CbEl))
      k4CbEl = document.getElementById("cMultibox");
    if (k4CbEl) m9MbSt.on = Boolean(k4CbEl.checked);
    return m9MbSt.on;
  }

  function g4PidEl() {
    if (k4PidEl && document.contains(k4PidEl)) return k4PidEl;
    k4PidEl = document.getElementById("playerId");
    return k4PidEl;
  }

  function g5ReadPid() {
    const el = g4PidEl();
    if (!el) return "";
    return String(el.textContent || "").trim();
  }

  function u2SyncPidState() {
    if (b6BpSt.specEntered) return;
    const id = g5ReadPid();
    m9MbSt.activeId = id;
    const nId = parseInt(id, 10);
    if (Number.isSafeInteger(nId) && nId > 0) v4SelfOids.add(nId);
    if (!id || id === "0") {
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
    const fin = (ok) => {
      if (done) return;
      done = true;
      if (ob) ob.disconnect();
      u2SyncPidState();
      cb(ok, m9MbSt.activeId);
    };
    if (el && typeof MutationObserver === "function") {
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
      if (nw - ts > 6500) {
        v5PeerMap.delete(id);
      } else {
        alive = true;
      }
    });
    return alive;
  }

  function v5PingPeers() {
    try {
      q5RzL9wK.postMessage({
        type: "MB_PING",
        senderId: v8WpM2tL,
      });
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
        const md = new MouseEvent("mousedown", {
          button: mt.btn,
          buttons: btns,
          clientX: t2QnL9wP,
          clientY: b8VmK3xT,
          bubbles: true,
          cancelable: true,
        });
        Object.defineProperty(md, "which", { value: wh, writable: false });
        if (typeof hSP2xK9m !== "undefined") hSP2xK9m.add(md);
        tg.dispatchEvent(md);
        const mu = new MouseEvent("mouseup", {
          button: mt.btn,
          buttons: 0,
          clientX: t2QnL9wP,
          clientY: b8VmK3xT,
          bubbles: true,
          cancelable: true,
        });
        Object.defineProperty(mu, "which", { value: wh, writable: false });
        if (typeof hSP2xK9m !== "undefined") hSP2xK9m.add(mu);
        tg.dispatchEvent(mu);
      }
      return;
    }
    const actEl = document.activeElement;
    if (
      actEl &&
      (actEl.tagName === "BUTTON" ||
        (actEl.tagName === "INPUT" && actEl.type === "checkbox")) &&
      actEl.blur
    )
      actEl.blur();
    const tg = document;
    for (let i = 0; i < times; i++) {
      const kd = new KeyboardEvent("keydown", {
        code: mt.code,
        key: mt.key,
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(kd, "keyCode", { value: kc, writable: false });
      Object.defineProperty(kd, "which", { value: kc, writable: false });
      if (typeof hSP2xK9m !== "undefined") hSP2xK9m.add(kd);
      tg.dispatchEvent(kd);
      const ku = new KeyboardEvent("keyup", {
        code: mt.code,
        key: mt.key,
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(ku, "keyCode", { value: kc, writable: false });
      Object.defineProperty(ku, "which", { value: kc, writable: false });
      if (typeof hSP2xK9m !== "undefined") hSP2xK9m.add(ku);
      tg.dispatchEvent(ku);
    }
    if (u9PxL2wT.has(kc)) {
      const kh = new KeyboardEvent("keydown", {
        code: mt.code,
        key: mt.key,
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(kh, "keyCode", { value: kc, writable: false });
      Object.defineProperty(kh, "which", { value: kc, writable: false });
      if (typeof hSP2xK9m !== "undefined") hSP2xK9m.add(kh);
      tg.dispatchEvent(kh);
    }
  }

  let t2QnL9wP = window.innerWidth / 2,
    b8VmK3xT = window.innerHeight / 2;
  window.addEventListener(
    "mousemove",
    (e) => {
      t2QnL9wP = e.clientX;
      b8VmK3xT = e.clientY;
    },
    true,
  );

  let curOverUi = false;
  function k9ChkCurUi(e) {
    const tg = e && e.target;
    const gCv = cachedGameCanvas || t8VwM4xK();
    if (tg && tg === gCv) {
      curOverUi = false;
      return;
    }
    const el = tg && tg.nodeType === 1 ? tg : tg && tg.parentElement;
    if (!el) {
      curOverUi = true;
      return;
    }
    if (
      el.closest(
        '#macro-window, #macro-toggle-pill, #macro-bypass-map, #main-panel, #login-panel, #party-panel, #chat-container, #chat-panel, .chat-panel, button, a, input, textarea, select, [role="button"], .macro-cvs-txt, .macro-pe-txt',
      )
    ) {
      curOverUi = true;
      return;
    }
    const cs = getComputedStyle(el).cursor;
    curOverUi = Boolean(cs && cs !== "none");
  }
  window.addEventListener(
    "pointerrawupdate",
    (e) => {
      if (
        (e.pointerType === "mouse" || e.isPrimary) &&
        Number.isFinite(e.clientX) &&
        Number.isFinite(e.clientY)
      ) {
        t2QnL9wP = e.clientX;
        b8VmK3xT = e.clientY;
      }
    },
    { capture: true, passive: true },
  );
  window.addEventListener(
    "pointermove",
    (e) => {
      if (e.pointerType === "mouse" || e.isPrimary) {
        t2QnL9wP = e.clientX;
        b8VmK3xT = e.clientY;
        k9ChkCurUi(e);
      }
    },
    { capture: true, passive: true },
  );
  window.addEventListener(
    "pointerover",
    (e) => {
      if (e.pointerType === "mouse" || e.isPrimary) k9ChkCurUi(e);
    },
    { capture: true, passive: true },
  );
  window.addEventListener("blur", () => {
    curOverUi = true;
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) curOverUi = true;
  });
  document.addEventListener("mouseleave", () => {
    curOverUi = true;
  });

  q5RzL9wK.onmessage = function (ev) {
    const dt = ev.data;
    if (!dt || dt.senderId === v8WpM2tL) return;
    if (dt.senderId && dt.type !== "MB_BYE") {
      v5PeerMap.set(dt.senderId, performance.now());
    }
    if (dt.type === "MB_PING") {
      b6BpSt.enableGraceUntil = 0;
      try {
        q5RzL9wK.postMessage({
          type: "MB_PONG",
          senderId: v8WpM2tL,
        });
      } catch (_) {}
      return;
    }
    if (dt.type === "MB_PONG") {
      b6BpSt.enableGraceUntil = 0;
      return;
    }
    if (dt.type === "MB_BYE") {
      v5PeerMap.delete(dt.senderId);
      b6BpSt.enableGraceUntil = 0;
      b6CheckPeerAlive(performance.now());
      return;
    }
    if (dt.type === "MACRO_FULL_CFG_SYNC") {
      b6ApplyPeerCfg(dt.cfg);
      return;
    }
    if (dt.type === "BYPASS_WORLD_RESET") {
      b6ResetWorld(false);
      return;
    }
    if (dt.type === "BYPASS_SCOUT_CLAIM") {
      if (dt.oid) {
        b6Claims.set(dt.oid, {
          cx: dt.cx || 0,
          cy: dt.cy || 0,
          ts: performance.now(),
        });
      }
      return;
    }
    if (dt.type === "BYPASS_MAIN_AOI") {
      const nw = performance.now();
      if (Array.isArray(dt.aoi) && dt.aoi.length === 4) {
        b6BpSt.mainAoi = {
          minX: dt.aoi[0],
          minY: dt.aoi[1],
          maxX: dt.aoi[2],
          maxY: dt.aoi[3],
          at: nw,
        };
      }
      if (Array.isArray(dt.self) && dt.self.length >= 2) {
        const prev = b6BpSt.mainSelf;
        const nx = dt.self[0],
          ny = dt.self[1],
          noid = dt.self[2] || 0;
        if (
          !prev ||
          (noid && prev.oid && noid !== prev.oid) ||
          Math.hypot(nx - prev.x, ny - prev.y) > 1600
        ) {
          b6NearTs.fill(0);
        }
        b6BpSt.mainSelf = { x: nx, y: ny, oid: noid, at: nw };
      }
      if (Array.isArray(dt.cur) && dt.cur.length === 2) {
        b6BpSt.mainCursor = { x: dt.cur[0], y: dt.cur[1], at: nw };
      }
      return;
    }
    if (dt.type === "BYPASS_FRAME") {
      if (
        (!m9TvL2sP.bypassEnabled &&
          !m9TvL2sP.bypassPhantoms &&
          !m9TvL2sP.bypassRadar) ||
        b6BpSt.scanning ||
        Date.now() - dt.ts > 950
      )
        return;
      const nw = performance.now();
      b6BpSt.lastRxAt = nw;
      if (Array.isArray(dt.bounds) && dt.bounds.length === 4) {
        b6BpSt.bounds = dt.bounds;
      }
      if (Array.isArray(dt.plrs)) {
        for (let i = 0; i < dt.plrs.length; i++) {
          const p = dt.plrs[i];
          if (p && p[0]) {
            b6RemPlrs.set(p[0], {
              oid: p[0],
              name: p[1] || "",
              rgb: p[2] || [140, 200, 255],
              at: nw,
            });
          }
        }
      }
      const liveBox = b6SafeBox();
      const hasLive = Boolean(
        liveBox &&
        liveBox.maxX - liveBox.minX > 600 &&
        liveBox.maxY - liveBox.minY > 600,
      );
      const seenNow = new Set();
      if (Array.isArray(dt.cells)) {
        for (let i = 0; i < dt.cells.length; i++) {
          const [cid, tag, oid, x, y, r] = dt.cells[i];
          if (v4WsCells.has(cid) || (tag === 2 && v4SelfOids.has(oid)))
            continue;
          const lDel = b6DelTs.get(cid);
          if (lDel && dt.ts - lDel < 180) continue;
          if (hasLive && b6InBox(x, y, liveBox, 90)) {
            b6Phantoms.delete(cid);
            continue;
          }
          seenNow.add(cid);
          const ex = b6Phantoms.get(cid);
          if (ex) {
            if (dt.ts > ex.ts) {
              const dtSec = (dt.ts - ex.ts) * 0.001;
              if (dtSec >= 0.015 && dtSec <= 1.2) {
                const nvx = (x - ex.tx) / dtSec,
                  nvy = (y - ex.ty) / dtSec;
                if (Math.hypot(nvx, nvy) < 4200) {
                  if (!ex.vInit) {
                    ex.vx = nvx;
                    ex.vy = nvy;
                    ex.vInit = true;
                  } else {
                    ex.vx = ex.vx * 0.45 + nvx * 0.55;
                    ex.vy = ex.vy * 0.45 + nvy * 0.55;
                  }
                }
              }
              ex.tag = tag;
              ex.oid = oid;
              ex.tx = x;
              ex.ty = y;
              ex.tr = r;
              ex.ts = dt.ts;
              ex.rxAt = nw;
            }
          } else {
            b6Phantoms.set(cid, {
              cid,
              tag,
              oid,
              dx: x,
              dy: y,
              dr: r,
              tx: x,
              ty: y,
              tr: r,
              vx: 0,
              vy: 0,
              vInit: false,
              ts: dt.ts,
              rxAt: nw,
            });
          }
        }
      }
      if (Array.isArray(dt.aoi) && dt.aoi.length === 4) {
        const [ax0, ay0, ax1, ay1] = dt.aoi;
        if (ax1 - ax0 > 1500 && ay1 - ay0 > 1500) {
          const box = {
            minX: ax0 + 480,
            minY: ay0 + 480,
            maxX: ax1 - 480,
            maxY: ay1 - 480,
          };
          for (const [cid, p] of b6Phantoms) {
            if (
              !seenNow.has(cid) &&
              p.ts < dt.ts - 240 &&
              b6InBox(p.tx, p.ty, box)
            ) {
              b6Phantoms.delete(cid);
            }
          }
        }
      }
      return;
    }
    if (document.hasFocus() && !document.hidden) return;

    if (dt.type === "EXECUTE_BACKGROUND_SPLIT_STEP") {
      p2LxQ8vM();
      const pl = g2BindTbl.plans[5] || {
        kc: g2BindTbl.sp > 0 ? g2BindTbl.sp : 32,
        n: 5,
      };
      w5PzR8tM(pl.kc, pl.n);
    }
  };

  setInterval(v5PingPeers, 1000);
  window.addEventListener("focus", v5PingPeers, { passive: true });
  document.addEventListener("visibilitychange", v5PingPeers, { passive: true });
  const f4ByePeer = () => {
    try {
      q5RzL9wK.postMessage({ type: "MB_BYE", senderId: v8WpM2tL });
    } catch (_) {}
  };
  window.addEventListener("pagehide", f4ByePeer);
  window.addEventListener("beforeunload", f4ByePeer);
  v5PingPeers();

  let k4FeedLock = false;
  const m4EjPhys = { down: false, kc: 0 };

  window.addEventListener(
    "keydown",
    (e) => {
      if (!e.isTrusted) return;
      const tg = e.target,
        tn = tg && tg.tagName ? tg.tagName.toLowerCase() : "";
      if (
        (tn === "input" && tg.type !== "checkbox") ||
        tn === "textarea" ||
        (tg && tg.isContentEditable)
      )
        return;
      const kc = e.keyCode || e.which || 0;
      if (!e.repeat && g2BindTbl.sw > 5 && kc === g2BindTbl.sw) m9MbSt.swSeq++;
      if (g2BindTbl.ej > 5 && kc === g2BindTbl.ej) {
        m4EjPhys.down = true;
        m4EjPhys.kc = kc;
      }
    },
    true,
  );

  window.addEventListener(
    "keyup",
    (e) => {
      if (!e.isTrusted) return;
      const kc = e.keyCode || e.which || 0;
      if (m4EjPhys.down && kc === m4EjPhys.kc) m4EjPhys.down = false;
    },
    true,
  );

  window.addEventListener(
    "mousedown",
    (e) => {
      if (!e.isTrusted) return;
      const tg = e.target;
      if (
        tg &&
        tg.closest &&
        tg.closest(
          "#macro-window, #macro-toggle-pill, #chat-container, #chat-panel, .chat-panel, button, a, select, #main-panel, #login-panel, #party-panel",
        )
      )
        return;
      if (
        g2BindTbl.sw >= 1 &&
        g2BindTbl.sw <= 5 &&
        e.button === g4KcMeta(g2BindTbl.sw).btn
      )
        m9MbSt.swSeq++;
      if (
        g2BindTbl.ej >= 1 &&
        g2BindTbl.ej <= 5 &&
        e.button === g4KcMeta(g2BindTbl.ej).btn
      ) {
        m4EjPhys.down = true;
        m4EjPhys.kc = g2BindTbl.ej;
      }
    },
    true,
  );

  window.addEventListener(
    "mouseup",
    (e) => {
      if (!e.isTrusted) return;
      if (
        m4EjPhys.down &&
        m4EjPhys.kc >= 1 &&
        m4EjPhys.kc <= 5 &&
        e.button === g4KcMeta(m4EjPhys.kc).btn
      ) {
        m4EjPhys.down = false;
      }
    },
    true,
  );

  window.addEventListener("blur", () => {
    m4EjPhys.down = false;
  });

  function w5EjDisp(kc, isDown) {
    if (!kc || kc <= 0) return;
    const mt = g4KcMeta(kc);
    const cv = t8VwM4xK();
    if (mt.isMouse) {
      const tg = cv || document;
      const wh = mt.btn + 1;
      const btns = isDown ? [1, 4, 2, 8, 16][mt.btn] || 1 : 0;
      const pTp = isDown ? "pointerdown" : "pointerup";
      const mTp = isDown ? "mousedown" : "mouseup";
      if (typeof PointerEvent === "function") {
        const pe = new PointerEvent(pTp, {
          button: mt.btn,
          buttons: btns,
          clientX: t2QnL9wP,
          clientY: b8VmK3xT,
          pointerId: 1,
          pointerType: "mouse",
          isPrimary: true,
          bubbles: true,
          cancelable: true,
        });
        if (typeof hSP2xK9m !== "undefined") hSP2xK9m.add(pe);
        tg.dispatchEvent(pe);
      }
      const me = new MouseEvent(mTp, {
        button: mt.btn,
        buttons: btns,
        clientX: t2QnL9wP,
        clientY: b8VmK3xT,
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(me, "which", { value: wh, writable: false });
      if (typeof hSP2xK9m !== "undefined") hSP2xK9m.add(me);
      tg.dispatchEvent(me);
      return;
    }
    const ke = new KeyboardEvent(isDown ? "keydown" : "keyup", {
      code: mt.code,
      key: mt.key,
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(ke, "keyCode", { value: kc, writable: false });
    Object.defineProperty(ke, "which", { value: kc, writable: false });
    if (typeof hSP2xK9m !== "undefined") hSP2xK9m.add(ke);
    document.dispatchEvent(ke);
  }

  function m4SendEj(isDown) {
    let sentKc = 0;
    if (typeof hSt2xK9m !== "undefined" && hSt2xK9m) {
      if (hSt2xK9m.kind === "mouse") {
        sentKc =
          hSt2xK9m.button === 0
            ? 1
            : hSt2xK9m.button === 1
              ? 2
              : hSt2xK9m.button === 2
                ? 3
                : hSt2xK9m.button + 1;
        w5EjDisp(sentKc, isDown);
      } else if (hSt2xK9m.kind === "key") {
        sentKc =
          hSt2xK9m.keyCode ||
          n4TxtToKc(
            String(hSt2xK9m.code || "")
              .replace(/^Key/, "")
              .replace(/^Digit/, ""),
          ) ||
          87;
        w5EjDisp(sentKc, isDown);
      }
      if (typeof hEv2xK9m === "function") {
        hEv2xK9m(
          hSt2xK9m,
          isDown
            ? hSt2xK9m.kind === "key"
              ? "keydown"
              : "mousedown"
            : hSt2xK9m.kind === "key"
              ? "keyup"
              : "mouseup",
        );
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
    const el = document.getElementById("cHideStatusPanel");
    return Boolean(el && el.checked);
  }

  function g5ReadPingMs() {
    const el = g4PidEl();
    const box =
      el && el.parentElement && el.parentElement.parentElement
        ? el.parentElement.parentElement
        : null;
    if (!box) return 0;
    const m = (box.textContent || "").match(/Ping\s*:\s*(\d+)/i);
    return m ? parseInt(m[1], 10) || 0 : 0;
  }

  function k4ExecSecondSplit(startId, startSw, runGen, onDone) {
    function runSecond(tries) {
      if (m9MbSt.matchGen !== runGen) {
        if (onDone) onDone();
        return;
      }
      if (!h4HasPeerTab() && m4IsMbOn() && g2BindTbl.sw > 0) {
        const curId = g5ReadPid();
        const swDelta = (m9MbSt.swSeq - startSw) & 1;
        const pidSwitched = Boolean(
          startId &&
          startId !== "0" &&
          curId &&
          curId !== "0" &&
          curId !== startId &&
          m9MbSt.swSeq !== startSw,
        );
        if (swDelta === 1 || pidSwitched) {
          if (k4MbBusy && tries < 16) {
            d2TinyWait(15, () => runSecond(tries + 1));
            return;
          }
          const hudHid = m4HudHidden();
          const hadFeed = Boolean(hSt2xK9m) || m4EjPhys.down;
          w5SetMbBusy(true);
          if (hadFeed) {
            k4FeedLock = true;
            m4SendEj(false);
          }
          w5PzR8tM(g2BindTbl.sw, 1);
          w3WaitPidFlip(curId, hudHid ? 35 : 45, () => {
            if (m9MbSt.matchGen !== runGen) {
              k4FeedLock = false;
              w5SetMbBusy(false);
              if (onDone) onDone();
              return;
            }
            if (Boolean(hSt2xK9m) || m4EjPhys.down) {
              k4FeedLock = true;
              m4SendEj(false);
            }
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
                if (
                  m9MbSt.matchGen === runGen &&
                  (Boolean(hSt2xK9m) || m4EjPhys.down)
                )
                  m4SendEj(true);
                if (onDone) onDone();
              });
            });
          });
          return;
        }
      }
      try {
        s7PzR(5);
      } finally {
        if (onDone) onDone();
      }
    }
    runSecond(0);
  }

  function k4MbFastFeed(delayMs, onDone) {
    const mbInit = !h4HasPeerTab() && m4IsMbOn();
    const startId = mbInit ? g5ReadPid() : "";
    const startSw = m9MbSt.swSeq;
    const runGen = m9MbSt.matchGen;
    s7PzR(5);
    z7PxM4wK(delayMs, () => {
      k4ExecSecondSplit(startId, startSw, runGen, onDone);
    });
  }

  function k4FfStopAutoOnly() {
    if (!v4FfAuto) return;
    if (v4FfAuto.cancelTm) v4FfAuto.cancelTm();
    if (v4FfAuto.cancelFire) v4FfAuto.cancelFire();
    v4FfAuto = null;
  }

  function k4FfCancel(keepVisFade) {
    k4FfStopAutoOnly();
    v4FfLock = null;
    if (!keepVisFade) {
      v4FfVis.active = false;
      v4FfVis.alpha = 0;
    }
  }

  function w4FfMinGap(initOid, targetCid) {
    const tc = v4WsCells.get(targetCid);
    if (!tc) return Infinity;
    const owns = [];
    let curMaxR = 0;
    for (const c of v4WsCells.values()) {
      if (c.tag !== 2 || c.oid !== initOid) continue;
      const cr = c.r * v4FfRadMul;
      if (cr > curMaxR) curMaxR = cr;
      owns.push(c);
    }
    if (!owns.length) return Infinity;
    const minR2 = curMaxR * curMaxR * (nFfMinMassPct / 100);
    const tr = tc.r * v4FfRadMul;
    let minGap = Infinity;
    for (let i = 0; i < owns.length; i++) {
      const c = owns[i];
      const cr = c.r * v4FfRadMul;
      if (cr * cr < minR2) continue;
      const g = Math.hypot(tc.x - c.x, tc.y - c.y) - (cr + tr);
      if (g < minGap) minGap = g;
    }
    return minGap;
  }

  function k4FfFire2(genSnap) {
    const act = v4FfAuto;
    if (!act || act.gen !== genSnap) return;
    if (act.clrLock) k4FfCancel(true);
    else k4FfStopAutoOnly();
    if (k2WsDead()) return;
    k4ExecSecondSplit(act.startId, act.startSw, genSnap, null);
  }

  function k4FfOnTimer(genSnap) {
    if (!v4FfAuto || v4FfAuto.gen !== genSnap) return;
    v4FfAuto.cancelFire = null;
    if (k2WsDead() || !v4FfLock || !v4WsCells.has(v4FfAuto.targetCid)) {
      k4FfCancel(true);
      return;
    }
    const minGap = w4FfMinGap(v4FfAuto.initOid, v4FfAuto.targetCid);
    const dynReach = Math.max(nFfSurgeReach, v4FfAuto.preMaxR * 0.72 + 250);
    if (Number.isFinite(minGap) && minGap <= dynReach) {
      k4FfFire2(genSnap);
    } else {
      v4FfAuto.waitReach = true;
    }
  }

  function k4FfStart(clearLockOnFinish) {
    if (v4FfAuto || b9TxK4mP || k4MbBusy || k2WsDead() || !v4FfLock) return;
    const tWs = v4WsCells.get(v4FfLock.cellId);
    const selfOid = w4GetCurSelfOid();
    if (!tWs || !selfOid || tWs.oid === selfOid) return;

    const px = w4ReadFfLocked();
    if (px && tWs.r > 0 && px.model && px.model.G > 0) {
      const raw = px.model.G / tWs.r;
      v4FfRadMul = Math.abs(raw - 1) < 0.12 ? 1 : raw;
    }

    const preCids = new Set();
    let preMaxR = 0;
    for (const c of v4WsCells.values()) {
      if (c.tag !== 2 || c.oid !== selfOid) continue;
      preCids.add(c.cid);
      const r = c.r * v4FfRadMul;
      if (r > preMaxR) preMaxR = r;
    }

    const mbInit = !h4HasPeerTab() && m4IsMbOn();
    const startId = mbInit ? g5ReadPid() : "";
    const startSw = m9MbSt.swSeq;
    const runGen = m9MbSt.matchGen;
    const hudPing = g5ReadPingMs();
    const pingEst = hudPing > 0 ? hudPing : 50;
    const radBoost = Math.min(50, Math.max(0, (preMaxR - 1400) * 0.06));
    const fbDelay = Math.max(
      380,
      nFfSurgeMs - pingEst * 0.5 - nFfSurgeLeadMs + radBoost,
    );

    const cancelTm = k7RunDelay(
      3000,
      () => {
        if (v4FfAuto && v4FfAuto.gen === runGen) {
          if (v4FfAuto.clrLock) k4FfCancel(true);
          else k4FfStopAutoOnly();
        }
      },
      50,
    );
    const cancelFire = k7RunDelay(fbDelay, () => k4FfOnTimer(runGen), 50);

    v4FfAuto = {
      initOid: selfOid,
      targetCid: v4FfLock.cellId,
      targetOid: v4FfLock.ownerId,
      t0: performance.now(),
      splitConfirmed: false,
      waitReach: false,
      preMaxR,
      radBoost,
      preCids,
      startId,
      startSw,
      gen: runGen,
      clrLock: clearLockOnFinish,
      cancelTm,
      cancelFire,
    };

    s7PzR(5);
  }

  function k4MbTrick(spCnt) {
    if (k4MbBusy) return;
    if (g2BindTbl.sw <= 0) {
      m9MbSt.lastTrace = "noSw:" + g2BindTbl.sw;
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
    if (hadFeed1) {
      k4FeedLock = true;
      m4SendEj(false);
    }
    w5PzR8tM(g2BindTbl.sw, 1);
    w3WaitPidFlip(stId, hudHid ? 35 : 45, (ok1, curId) => {
      m9MbSt.lastTrace =
        "st=" + stId + " cur=" + curId + " ok1=" + ok1 + " sw=" + g2BindTbl.sw;
      if (
        m9MbSt.matchGen !== runGen ||
        (!ok1 && !allowNoAck && stId && stId !== "0")
      ) {
        k4FeedLock = false;
        w5SetMbBusy(false);
        if (m9MbSt.matchGen === runGen) {
          if (Boolean(hSt2xK9m) || m4EjPhys.down) m4SendEj(true);
          s7PzR(spCnt);
        }
        return;
      }
      if (Boolean(hSt2xK9m) || m4EjPhys.down) {
        k4FeedLock = true;
        m4SendEj(false);
      }
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
          if (
            m9MbSt.matchGen !== runGen ||
            !m4IsMbOn() ||
            m9TvL2sP.soloFocus !== "multibox"
          )
            return;
          if (k4MbBusy) {
            if (tries < 16) d2TinyWait(15, () => runStep2(tries + 1));
            return;
          }
          u2SyncPidState();
          const nowId = m9MbSt.activeId;
          if (!nowId || nowId === "0") return;
          if (nowId === stId) {
            const hudHid2 = m4HudHidden();
            const allowNoAck2 =
              hudHid2 || Boolean(m9MbSt.box2Id) || g5ReadPingMs() >= 45;
            const hadFeed2 = Boolean(hSt2xK9m) || m4EjPhys.down;
            w5SetMbBusy(true);
            if (hadFeed2) {
              k4FeedLock = true;
              m4SendEj(false);
            }
            w5PzR8tM(g2BindTbl.sw, 1);
            w3WaitPidFlip(nowId, hudHid2 ? 35 : 45, (ok2) => {
              if (m9MbSt.matchGen !== runGen || (!ok2 && !allowNoAck2)) {
                k4FeedLock = false;
                w5SetMbBusy(false);
                if (
                  m9MbSt.matchGen === runGen &&
                  (Boolean(hSt2xK9m) || m4EjPhys.down)
                )
                  m4SendEj(true);
                return;
              }
              if (Boolean(hSt2xK9m) || m4EjPhys.down) {
                k4FeedLock = true;
                m4SendEj(false);
              }
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
                  if (
                    m9MbSt.matchGen === runGen &&
                    (Boolean(hSt2xK9m) || m4EjPhys.down)
                  )
                    m4SendEj(true);
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
        revPlan: g2BindTbl.rev,
      });
    };

    const pidEl = g4PidEl();
    if (pidEl && !pidEl.__mbObsOn && typeof MutationObserver === "function") {
      pidEl.__mbObsOn = true;
      const ob = new MutationObserver(() => u2SyncPidState());
      ob.observe(pidEl, {
        childList: true,
        characterData: true,
        subtree: true,
      });
    }

    const cb = document.getElementById("cMultibox");
    if (cb && !cb.__mbChgOn) {
      cb.__mbChgOn = true;
      cb.addEventListener("change", () => {
        m4SyncMbOpt(true);
        m9MbSt.matchGen++;
      });
    }

    const hk = document.getElementById("main-hotkeys");
    if (hk && !hk.__mbHkOn) {
      hk.__mbHkOn = true;
      const u7Hk = () => setTimeout(() => b6SyncKb(true), 40);
      hk.addEventListener("click", u7Hk, true);
      hk.addEventListener("mousedown", u7Hk, true);
      hk.addEventListener("keyup", u7Hk, true);
    }

    if (!document.__mbBpClkOn) {
      document.__mbBpClkOn = true;
      const onMatchBtn = (e) => {
        const tg = e.target;
        const btn =
          tg && tg.closest
            ? tg.closest("#btn-play, #btn-spec, #btn-leave-match, button")
            : null;
        if (!btn) return;
        const bid = btn.id || "";
        const txt = (btn.textContent || "").trim().toLowerCase();
        const inMenu = Boolean(btn.closest("#main-panel, #login-panel"));
        const isSpec =
          bid === "btn-spec" ||
          (bid.includes("spec") && inMenu) ||
          (txt === "spectate" && inMenu);
        const isPlay = bid === "btn-play";
        const isLeave = bid === "btn-leave-match";
        if (!isSpec && !isPlay && !isLeave) return;
        if (
          e.type === "click" &&
          (!isPlay || b6BpSt.specEntered || k2WsDead())
        ) {
          m9MbSt.box1Id = "";
          m9MbSt.box2Id = "";
          m9MbSt.activeBox = 0;
          m9MbSt.matchGen++;
          v4OwnSeen = false;
          k4FfCancel(false);
        }
        if (isSpec) {
          p2LxQ8vM();
          b6BpSt.specEntered = true;
          b6BpSt.wasAlive = false;
          b6BpSt.lastPlayAt = 0;
          v4ActOid = 0;
          v4SelfOids.clear();
          if (v4MyOid) v4SelfOids.add(v4MyOid);
          b6UpdateRole(performance.now());
        } else if (isPlay) {
          b6BpSt.specEntered = false;
          b6BpSt.wasAlive = true;
          b6BpSt.lastPlayAt = performance.now();
          b6ScanStop();
          b6UpdateRole(performance.now());
        } else {
          b6BpSt.specEntered = false;
          b6BpSt.wasAlive = false;
          b6BpSt.lastPlayAt = 0;
          v4ActOid = 0;
          b6ScanStop();
          b6UpdateRole(performance.now());
        }
      };
      document.addEventListener("pointerdown", onMatchBtn, true);
      document.addEventListener("click", onMatchBtn, true);
      document.addEventListener(
        "keydown",
        (e) => {
          if (
            e.key === "Enter" &&
            e.target &&
            e.target.id === "name-box" &&
            !b6IsMenuHidden()
          ) {
            if (b6BpSt.specEntered || k2WsDead()) {
              m9MbSt.box1Id = "";
              m9MbSt.box2Id = "";
              m9MbSt.activeBox = 0;
              m9MbSt.matchGen++;
              v4OwnSeen = false;
              k4FfCancel(false);
            }
            b6BpSt.specEntered = false;
            b6BpSt.wasAlive = true;
            b6BpSt.lastPlayAt = performance.now();
            b6ScanStop();
            b6UpdateRole(performance.now());
          }
        },
        true,
      );
    }

    window.addEventListener("storage", (e) => {
      if (!e || e.key === "keybinds") b6SyncKb(false);
      if (!e || e.key === "options") m4SyncMbOpt(false);
      if (e && e.key === "gota_macro_overlay_v2" && e.newValue) {
        try {
          b6ApplyPeerCfg(JSON.parse(e.newValue));
        } catch (_) {}
      }
    });
  }

  let k6XpL1vQ = 1.0,
    r3WnS8mT = null,
    m8QzV2tL = 1.0;
  let f5TxL9wK = false,
    j2VnL8sT = false;
  let v4QnK9wL = 0,
    z8PxL2sT = null,
    d3VwN8mT = null,
    h9TnK4xL = 0,
    p6XvQ2wM = 0;
  let b9VxL3sQ = 0,
    r4QnM8tL = 0,
    m2WpT7vX = false,
    s8XnL3wP = null,
    v5QzR9mL = 0;
  let lockBaseZm = 1.0;

  let cachedGameCanvas = null;
  const gCtxMap = new WeakMap();

  function t8VwM4xK() {
    const r4CvOk = (c) =>
      Boolean(
        c &&
        c.width > 0 &&
        c.height > 0 &&
        (c.clientWidth || c.width) >= 300 &&
        (c.clientHeight || c.height) >= 200,
      );
    if (
      cachedGameCanvas &&
      cachedGameCanvas.isConnected &&
      r4CvOk(cachedGameCanvas)
    )
      return cachedGameCanvas;
    const byId = document.getElementById("canvas");
    if (r4CvOk(byId)) {
      cachedGameCanvas = byId;
      return byId;
    }
    const list = document.querySelectorAll("canvas");
    for (let i = 0; i < list.length; i++) {
      const c = list[i];
      if (
        c.id === "autorev-overlay" ||
        c.id === "macro-bg-canvas" ||
        c.id === "macro-plexus-canvas" ||
        c.id === "macro-grid-canvas" ||
        c.id === "macro-curline-canvas" ||
        c.id === "macro-bypass-field" ||
        c.id === "macro-bypass-radar"
      )
        continue;
      if (r4CvOk(c)) {
        cachedGameCanvas = c;
        return c;
      }
    }
    return null;
  }

  function x4TvL8wP(cv) {
    let rec = gCtxMap.get(cv);
    if (!rec) {
      let gl = null,
        ctx2d = null;
      try {
        const o = {
          preserveDrawingBuffer: true,
          powerPreference: "high-performance",
        };
        gl = cv.getContext("webgl2", o) || cv.getContext("webgl", o);
        if (!gl) ctx2d = cv.getContext("2d");
      } catch (_) {}
      rec = { gl, ctx2d };
      gCtxMap.set(cv, rec);
    }
    return rec;
  }

  function q2WnS7xM(keepVisualFade) {
    f5TxL9wK = false;
    f8WnK3xL.locked = false;
    v4WsLock = null;
    j2VnL8sT = false;
    v4QnK9wL = 0;
    z8PxL2sT = null;
    p6XvQ2wM = 0;
    m2WpT7vX = false;
    f8WnK3xL.misses = 0;
    f8WnK3xL.worldR = 0;
    f8WnK3xL.color = null;
    if (!keepVisualFade) {
      x5QzL2wT.active = false;
      x5QzL2wT.isVp = false;
      x5QzL2wT.alpha = 0;
    }
  }

  function g9PxL3vT() {
    if (m9TvL2sP.revMethod === "ws") {
      if (k2WsDead()) return;
      const t = w4FindEnemy(t2QnL9wP, b8VmK3xT);
      if (!t) return;
      v4WsLock = {
        cellId: t.cellId,
        ownerId: t.oid,
        model: t.model,
        node: t.node,
      };
      j2VnL8sT = false;
      x5QzL2wT.active = true;
      x5QzL2wT.isVp = true;
      x5QzL2wT.cx = t.cx;
      x5QzL2wT.cy = t.cy;
      x5QzL2wT.r = t.r;
      x5QzL2wT.alpha = 0;
      x5QzL2wT.pop = 1.22;
      return;
    }
    if (!f8WnK3xL.locked) p3WnK7vT(true);
    if (f8WnK3xL.locked) {
      f5TxL9wK = true;
      j2VnL8sT = false;
      const zm = k3WnL8vR();
      lockBaseZm = zm;
      const wRad = f8WnK3xL.worldR || f8WnK3xL.r / Math.max(0.01, zm);
      v4QnK9wL = wRad;
      x5QzL2wT.active = false;
      x5QzL2wT.isVp = false;
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
    (m9TvL2sP.revMethod === "ws" ? v4WsLock : f5TxL9wK)
      ? q2WnS7xM(true)
      : g9PxL3vT();
  }

  function h8WpM2vQ() {
    if (j2VnL8sT) return;
    j2VnL8sT = true;
    try {
      const pl = g2BindTbl.rev;
      w5PzR8tM(pl.kc, pl.n);
    } finally {
      q2WnS7xM(true);
    }
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

  const w3MeasCvs = document.createElement("canvas");
  const w3MeasCtx = w3MeasCvs.getContext("2d");
  const w3WCache = new Map();
  if (document.fonts && document.fonts.addEventListener) {
    document.fonts.addEventListener("loadingdone", () => w3WCache.clear());
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
    const el = tg && tg.nodeType === 1 ? tg : tg && tg.parentElement;
    return Boolean(
      el &&
      el.closest &&
      el.closest("#macro-window, #macro-toggle-pill, #macro-bypass-map"),
    );
  }

  function w3IsEd(tg) {
    const el = tg && tg.nodeType === 1 ? tg : tg && tg.parentElement;
    if (!el) return false;
    const tn = (el.tagName || "").toLowerCase();
    return (
      (tn === "input" &&
        !/^(checkbox|radio|range|color|button|submit|reset|file|image)$/i.test(
          el.type || "text",
        )) ||
      tn === "textarea" ||
      Boolean(el.isContentEditable)
    );
  }

  function w3NormFont(raw) {
    if (!raw || typeof raw !== "string")
      return "700 20px/20px Ubuntu,sans-serif";
    let s = raw.replace(
      /(\d+(?:\.\d+)?)px(?:\s*\/\s*[\d.]+(?:px|em|%)?)?/i,
      "20px/20px",
    );
    if (!/20px\/20px/.test(s)) s = "700 20px/20px " + s;
    return s;
  }

  function w3MeasW(txt, nf) {
    const k = nf + "\0" + txt;
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
    if (
      cv.id === "autorev-overlay" ||
      cv.id === "macro-bg-canvas" ||
      cv.id === "macro-plexus-canvas" ||
      cv.id === "macro-grid-canvas" ||
      cv.id === "macro-curline-canvas" ||
      cv.id === "macro-bypass-field" ||
      cv.id === "macro-bypass-radar"
    )
      return;
    const isConn = Boolean(cv.isConnected);
    if (isConn && !v9TxtOn()) return;
    if (ctx.globalAlpha !== undefined && ctx.globalAlpha <= 0.03) return;
    const s = String(rawTxt);
    if (!/\S/.test(s)) return;
    const trm = s.trim();
    const m = ctx.measureText(s);
    const mw =
      typeof maxW === "number" && maxW > 0 && m.width > maxW ? maxW : m.width;
    const sx = m.width > 0 ? mw / m.width : 1;
    let lx0, lx1;
    if (
      typeof m.actualBoundingBoxLeft === "number" &&
      typeof m.actualBoundingBoxRight === "number" &&
      (m.actualBoundingBoxLeft !== 0 || m.actualBoundingBoxRight !== 0)
    ) {
      lx0 = x - m.actualBoundingBoxLeft * sx;
      lx1 = x + m.actualBoundingBoxRight * sx;
    } else {
      const al = ctx.textAlign || "start";
      if (al === "center") {
        lx0 = x - mw * 0.5;
        lx1 = x + mw * 0.5;
      } else if (al === "right" || al === "end") {
        lx0 = x - mw;
        lx1 = x;
      } else {
        lx0 = x;
        lx1 = x + mw;
      }
    }
    const fm = String(ctx.font || "").match(/(\d+(?:\.\d+)?)px/i);
    const fs = fm ? parseFloat(fm[1]) : 16;
    let ly0, ly1;
    if (
      typeof m.actualBoundingBoxAscent === "number" &&
      typeof m.actualBoundingBoxDescent === "number" &&
      (m.actualBoundingBoxAscent !== 0 || m.actualBoundingBoxDescent !== 0)
    ) {
      ly0 = y - m.actualBoundingBoxAscent;
      ly1 = y + m.actualBoundingBoxDescent;
    } else {
      const bl = ctx.textBaseline || "alphabetic";
      if (bl === "top" || bl === "hanging") {
        ly0 = y;
        ly1 = y + fs * 1.15;
      } else if (bl === "middle") {
        ly0 = y - fs * 0.55;
        ly1 = y + fs * 0.55;
      } else if (bl === "bottom" || bl === "ideographic") {
        ly0 = y - fs * 1.05;
        ly1 = y + fs * 0.1;
      } else {
        ly0 = y - fs * 0.85;
        ly1 = y + fs * 0.25;
      }
    }
    if (isStrk) {
      const pad = Math.min(4, (ctx.lineWidth || 0) * 0.5);
      lx0 -= pad;
      lx1 += pad;
      ly0 -= pad;
      ly1 += pad;
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
      if (
        it.t === trm &&
        Math.abs(it.x0 - x0) < 6 &&
        Math.abs(it.y0 - y0) < 6 &&
        Math.abs(it.x1 - x1) < 8 &&
        Math.abs(it.y1 - y1) < 8
      ) {
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
    arr.push({
      t: trm,
      x0,
      y0,
      x1,
      y1,
      px: p0x,
      py: p0y,
      w,
      h,
      a: ang,
      f: ctx.font || "",
      s: performance.now(),
    });
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
    const cx0 = Math.min(xA, xB),
      cy0 = Math.min(yA, yB);
    const cx1 = Math.max(xA, xB),
      cy1 = Math.max(yA, yB);
    const full =
      cx0 <= cv.width * 0.12 &&
      cy0 <= cv.height * 0.12 &&
      cx1 >= cv.width * 0.88 &&
      cy1 >= cv.height * 0.88;
    if (full) {
      rec.items.length = 0;
      if (isConn) w3DirtyCv.add(cv);
      return;
    }
    if (fullOnly) return;
    const kept = [];
    for (let i = 0; i < rec.items.length; i++) {
      const it = rec.items[i];
      const mx = (it.x0 + it.x1) * 0.5,
        my = (it.y0 + it.y1) * 0.5;
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
      const root = document.createElement("div");
      root.className = "macro-txt-layer";
      lr = {
        root,
        slots: [],
        pool: [],
        stamp: 0,
        l: -999,
        t: -999,
        w: -1,
        h: -1,
        z: "",
      };
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
      const el = document.createElement("span");
      el.className = "macro-cvs-txt";
      lr.root.appendChild(el);
      sl = {
        el,
        lr,
        txt: "",
        nf: "",
        tr: "",
        x: 0,
        y: 0,
        st: 0,
        nd: null,
        ki: -1,
        vis: false,
      };
    }
    lr.slots.push(sl);
    return sl;
  }

  function w3UpdSlot(sl, it) {
    const el = sl.el;
    if (!sl.vis) {
      el.style.display = "block";
      sl.vis = true;
    }
    if (sl.txt !== it.t) {
      const sel = window.getSelection();
      if (!(
        w3DragSel &&
        sel &&
        !sel.isCollapsed &&
        sel.containsNode(el, true)
      )) {
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
    const rot = Math.abs(it.a) > 0.002 ? ` rotate(${it.a.toFixed(4)}rad)` : "";
    const tr = `translate3d(${it.x.toFixed(1)}px,${it.y.toFixed(1)}px,0)${rot} scale(${sx.toFixed(4)},${sy.toFixed(4)})`;
    if (sl.tr !== tr) {
      el.style.transform = tr;
      sl.tr = tr;
    }
  }

  function w3SyncLayer(cv, cRc, items) {
    if (!cv || !cv.isConnected) return;
    const lr = w3GetLayer(cv);
    const rl = Math.round(cRc.left),
      rt = Math.round(cRc.top),
      rw = Math.round(cRc.width),
      rh = Math.round(cRc.height);
    const cz = getComputedStyle(cv).zIndex;
    const rz = cz && cz !== "auto" ? cz : "";
    if (lr.l !== rl) {
      lr.l = rl;
      lr.root.style.left = rl + "px";
    }
    if (lr.t !== rt) {
      lr.t = rt;
      lr.root.style.top = rt + "px";
    }
    if (lr.w !== rw) {
      lr.w = rw;
      lr.root.style.width = rw + "px";
    }
    if (lr.h !== rh) {
      lr.h = rh;
      lr.root.style.height = rh + "px";
    }
    if (lr.z !== rz) {
      lr.z = rz;
      lr.root.style.zIndex = rz;
    }
    if (lr.root.style.display === "none") lr.root.style.display = "block";

    const st = ++lr.stamp;
    const used = new Set();
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      let sl = null;
      if (it.nd) {
        let arr = w3NodeSlots.get(it.nd);
        if (!arr) {
          arr = [];
          w3NodeSlots.set(it.nd, arr);
        }
        sl = arr[it.ki];
        if (
          !sl ||
          sl.lr !== lr ||
          sl.nd !== it.nd ||
          sl.ki !== it.ki ||
          used.has(sl)
        ) {
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
          if (d < bestD) {
            bestD = d;
            sl = cand;
          }
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
      } else if (
        w3DragSel &&
        sel &&
        !sel.isCollapsed &&
        sel.containsNode(sl.el, true)
      ) {
        lr.slots[k++] = sl;
      } else {
        sl.el.style.display = "none";
        sl.el.textContent = "";
        sl.txt = "";
        sl.tr = "";
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
      if (
        prev &&
        prev.at &&
        cur.at &&
        prev.pr &&
        prev.pr === cur.pr &&
        cur.t.length <= 2 &&
        prev.t.length < 28 &&
        Math.abs(cur.a - prev.a) < 0.08 &&
        Math.abs(cur.h - prev.h) < prev.h * 0.38 &&
        Math.abs(cur.y - prev.y) < prev.h * 0.45 &&
        cur.x >= prev.x + prev.w * 0.3 &&
        cur.x <= prev.x + prev.w + prev.h * 0.75
      ) {
        const gap = cur.x - (prev.x + prev.w);
        prev.t += (gap > prev.h * 0.25 ? " " : "") + cur.t;
        const nx = Math.min(prev.x, cur.x),
          ny = Math.min(prev.y, cur.y);
        const nr = Math.max(prev.x + prev.w, cur.x + cur.w),
          nb = Math.max(prev.y + prev.h, cur.y + cur.h);
        prev.x = nx;
        prev.y = ny;
        prev.w = nr - nx;
        prev.h = nb - ny;
      } else {
        out.push(cur);
      }
    }
    return out;
  }

  function w3PushConnItems(cv, cRc, out) {
    const rec = w3ConnTxt.get(cv);
    if (!rec || !rec.items.length || cv.width <= 0 || cv.height <= 0) return;
    const sx = cRc.width / cv.width,
      sy = cRc.height / cv.height;
    for (let i = 0; i < rec.items.length; i++) {
      const it = rec.items[i];
      const x = it.px * sx,
        y = it.py * sy,
        w = it.w * sx,
        h = it.h * sy;
      if (w < 4 || h < 5) continue;
      if (x + w < -4 || x > cRc.width + 4 || y + h < -4 || y > cRc.height + 4)
        continue;
      out.push({
        nd: null,
        ki: -1,
        pr: null,
        at: false,
        t: it.t,
        f: it.f,
        x,
        y,
        w,
        h,
        a: it.a,
      });
    }
  }

  function w3PixiScan(st, scn, rnd) {
    if (!v9TxtOn() || !st) return;
    const cv = rnd.canvas || rnd.view || t8VwM4xK();
    if (!cv || !cv.isConnected || !scn || scn.width <= 0 || scn.height <= 0)
      return;
    const cRc = cv.getBoundingClientRect();
    if (cRc.width < 10 || cRc.height < 10) return;
    w3PixiCv = cv;
    w3PixiMs = performance.now();
    const sx = cRc.width / scn.width,
      sy = cRc.height / scn.height;
    const cw = cRc.width,
      ch = cRc.height;
    const items = [];

    function proj(nd, pr, ki, at, t, f, lx0, ly0, lx1, ly1) {
      const wt = nd.worldTransform;
      if (!wt) return;
      const px0 = lx0 * wt.a + ly0 * wt.c + wt.tx;
      const py0 = lx0 * wt.b + ly0 * wt.d + wt.ty;
      const vxX = (lx1 - lx0) * wt.a,
        vxY = (lx1 - lx0) * wt.b;
      const vyX = (ly1 - ly0) * wt.c,
        vyY = (ly1 - ly0) * wt.d;
      const x = px0 * sx,
        y = py0 * sy;
      const w = Math.hypot(vxX * sx, vxY * sy);
      const h = Math.hypot(vyX * sx, vyY * sy);
      if (w < 4 || h < 5) return;
      const ang = Math.atan2(vxY * sy, vxX * sx);
      const bnd = Math.max(w, h);
      if (x + bnd < -4 || x - bnd > cw + 4 || y + bnd < -4 || y - bnd > ch + 4)
        return;
      items.push({ nd, ki, pr, at, t, f, x, y, w, h, a: ang });
    }

    function walk(nd) {
      if (
        !nd ||
        nd.visible === false ||
        nd.renderable === false ||
        nd.destroyed
      )
        return;
      if (nd.worldAlpha !== undefined && nd.worldAlpha <= 0.05) return;
      if (nd.isParticleContainer) return;
      const hasTxt = typeof nd.text === "string" && /\S/.test(nd.text);
      const tex = nd.texture;
      const src = tex ? w3TexSrc(tex) : nd.canvas || null;
      const rec = src ? w3CvsTxt.get(src) : null;
      if (rec && rec.items.length && tex) {
        const fr = tex.frame;
        const orig = tex.orig || fr;
        const trm = tex.trim;
        const ax = nd.anchor ? nd.anchor.x : 0;
        const ay = nd.anchor ? nd.anchor.y : 0;
        const bw =
          (tex.source && tex.source.width) ||
          (tex.baseTexture && tex.baseTexture.width) ||
          (fr ? fr.width : 0);
        const bh =
          (tex.source && tex.source.height) ||
          (tex.baseTexture && tex.baseTexture.height) ||
          (fr ? fr.height : 0);
        const res =
          (tex.source && tex.source.resolution) ||
          (tex.baseTexture && tex.baseTexture.resolution) ||
          tex.resolution ||
          1;
        const sw = src.width || rec.w || 1,
          sh = src.height || rec.h || 1;
        const rx = bw > 0 ? sw / bw : res;
        const ry = bh > 0 ? sh / bh : res;
        const fx0 = fr ? fr.x * rx : 0,
          fy0 = fr ? fr.y * ry : 0;
        const fx1 = fr ? (fr.x + fr.width) * rx : sw,
          fy1 = fr ? (fr.y + fr.height) * ry : sh;
        const isAtl = Boolean(
          fr && (fr.width * rx < sw * 0.92 || fr.height * ry < sh * 0.92),
        );
        const ow = orig ? orig.width : sw / rx,
          oh = orig ? orig.height : sh / ry;
        const tx0 = trm ? trm.x : 0,
          ty0 = trm ? trm.y : 0;
        let ki = 0;
        for (let i = 0; i < rec.items.length; i++) {
          const it = rec.items[i];
          if (isAtl) {
            const mx = (it.x0 + it.x1) * 0.5,
              my = (it.y0 + it.y1) * 0.5;
            if (mx < fx0 - 2 || mx > fx1 + 2 || my < fy0 - 2 || my > fy1 + 2)
              continue;
          }
          const lx0 = -ax * ow + tx0 + (it.x0 - fx0) / rx;
          const ly0 = -ay * oh + ty0 + (it.y0 - fy0) / ry;
          const lx1 = -ax * ow + tx0 + (it.x1 - fx0) / rx;
          const ly1 = -ay * oh + ty0 + (it.y1 - fy0) / ry;
          proj(nd, nd.parent, ki++, isAtl, it.t, it.f, lx0, ly0, lx1, ly1);
        }
        if (hasTxt) return;
      } else if (hasTxt) {
        const lb =
          typeof nd.getLocalBounds === "function"
            ? m7Box(nd.getLocalBounds())
            : null;
        if (lb && lb.w > 0 && lb.h > 0) {
          const lns = nd.text.split(/\r?\n/);
          const lh = lb.h / lns.length;
          const stF =
            nd.style && nd.style.fontFamily
              ? "700 20px/20px " + nd.style.fontFamily
              : "";
          let ki = 0;
          for (let i = 0; i < lns.length; i++) {
            const ln = lns[i].trim();
            if (!ln) continue;
            proj(
              nd,
              nd.parent,
              ki++,
              false,
              ln,
              stF,
              lb.x,
              lb.y + i * lh,
              lb.x + lb.w,
              lb.y + (i + 1) * lh,
            );
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
      w3DirtyCv.forEach((cv) => {
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
    w3AllLayers.forEach((lr) => {
      if (lr.root.parentNode && !lr.root.parentNode.isConnected) {
        lr.root.style.display = "none";
      }
    });
  }

  function w3ScanPeNone() {
    w3PeDirty = false;
    w3PeLastScan = performance.now();
    const out = [];
    if (!document.body) {
      w3PeList = out;
      return;
    }
    const seen = new Set();
    const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = tw.nextNode())) {
      if (!n.nodeValue || !/\S/.test(n.nodeValue)) continue;
      const el = n.parentElement;
      if (!el || seen.has(el)) continue;
      if (w3IsUi(el) || el.closest(".macro-txt-layer")) continue;
      const tn = (el.tagName || "").toUpperCase();
      if (
        tn === "SCRIPT" ||
        tn === "STYLE" ||
        tn === "NOSCRIPT" ||
        tn === "CANVAS" ||
        tn === "SVG"
      )
        continue;
      seen.add(el);
      const cs = getComputedStyle(el);
      if (
        cs.display === "none" ||
        cs.visibility === "hidden" ||
        parseFloat(cs.opacity) <= 0.02
      )
        continue;
      if (
        cs.pointerEvents === "none" ||
        el.classList.contains("macro-pe-txt")
      ) {
        if (el.offsetParent !== null || cs.position === "fixed") out.push(el);
      }
    }
    w3PeList = out;
  }

  function w3ElTxtHit(el, x, y) {
    if (!el || !el.isConnected) return false;
    const cs = getComputedStyle(el);
    if (
      cs.display === "none" ||
      cs.visibility === "hidden" ||
      parseFloat(cs.opacity) <= 0.02
    )
      return false;
    const er = el.getBoundingClientRect();
    if (
      er.width <= 0 ||
      er.height <= 0 ||
      x < er.left - 2 ||
      x > er.right + 2 ||
      y < er.top - 1 ||
      y > er.bottom + 1
    )
      return false;
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
          if (
            r.width > 0 &&
            r.height > 0 &&
            x >= r.left - 2 &&
            x <= r.right + 2 &&
            y >= r.top - 1 &&
            y <= r.bottom + 1
          )
            return true;
        }
      } catch (_) {}
    }
    return false;
  }

  function w3IsOccluded(el, topEl) {
    if (
      !topEl ||
      topEl === document.body ||
      topEl === document.documentElement ||
      topEl.tagName === "CANVAS" ||
      topEl.classList.contains("macro-txt-layer") ||
      topEl.classList.contains("macro-cvs-txt")
    )
      return false;
    if (el.contains(topEl) || topEl.contains(el)) return false;
    const tCs = getComputedStyle(topEl);
    const bg = tCs.backgroundColor;
    const opaque = bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)";
    if (
      !opaque &&
      !topEl.closest("#main-panel, #login-panel, #context-menu, .modal")
    )
      return false;
    const tz = parseInt(tCs.zIndex, 10) || 0;
    const ez = parseInt(getComputedStyle(el).zIndex, 10) || 0;
    return tz >= ez;
  }

  function w3HitText(x, y, tg) {
    if (!v9TxtOn()) return false;
    if (w3IsUi(tg)) return false;
    const topEl = document.elementFromPoint(x, y);
    if (w3IsUi(topEl)) return false;

    const tgEl = tg && tg.nodeType === 1 ? tg : tg && tg.parentElement;
    if (tgEl && tgEl.classList && tgEl.classList.contains("macro-cvs-txt")) {
      const r = tgEl.getBoundingClientRect();
      if (
        r.width > 0 &&
        r.height > 0 &&
        x >= r.left - 2 &&
        x <= r.right + 2 &&
        y >= r.top - 1 &&
        y <= r.bottom + 1
      )
        return true;
    }

    const sel = window.getSelection();
    if (sel && !sel.isCollapsed) {
      for (let i = 0; i < sel.rangeCount; i++) {
        const rg = sel.getRangeAt(i);
        const ac = rg.commonAncestorContainer;
        const ae = ac && ac.nodeType === 1 ? ac : ac && ac.parentElement;
        if (ae && w3IsUi(ae)) continue;
        const rcs = rg.getClientRects();
        for (let j = 0; j < rcs.length; j++) {
          const r = rcs[j];
          if (
            r.width > 0 &&
            r.height > 0 &&
            x >= r.left - 2 &&
            x <= r.right + 2 &&
            y >= r.top - 1 &&
            y <= r.bottom + 1
          )
            return true;
        }
      }
    }

    const els = document.elementsFromPoint(x, y);
    for (let i = 0; i < els.length; i++) {
      const el = els[i];
      if (w3IsUi(el)) return false;
      if (
        el === document.body ||
        el === document.documentElement ||
        el.tagName === "CANVAS" ||
        el.classList.contains("macro-txt-layer")
      )
        continue;
      if (el.classList.contains("macro-cvs-txt")) return true;
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
    if (w3BypTm) {
      clearTimeout(w3BypTm);
      w3BypTm = 0;
    }
    if (document.body)
      document.body.classList.toggle("macro-txt-bypass", Boolean(on));
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
      cancelable: true,
    };
    const ev =
      e.type === "pointerdown" && typeof PointerEvent === "function"
        ? new PointerEvent(
            "pointerdown",
            Object.assign(init, {
              pointerId: e.pointerId || 1,
              pointerType: e.pointerType || "mouse",
              isPrimary: true,
            }),
          )
        : new MouseEvent(e.type, init);
    Object.defineProperty(ev, "which", { value: 3, writable: false });
    w3Fwded.add(ev);
    under.dispatchEvent(ev);
  }

  function w3HitSel(x, y, tg) {
    if (!v9TxtOn() || w3IsUi(tg)) return false;
    const topEl = document.elementFromPoint(x, y);
    if (w3IsUi(topEl)) return false;

    const tgEl = tg && tg.nodeType === 1 ? tg : tg && tg.parentElement;
    const ed =
      (tgEl && w3IsEd(tgEl) && tgEl) || (topEl && w3IsEd(topEl) && topEl);
    if (
      ed &&
      typeof ed.selectionStart === "number" &&
      typeof ed.selectionEnd === "number" &&
      ed.selectionStart !== ed.selectionEnd
    ) {
      const r = ed.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom)
        return true;
    }

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) return false;
    for (let i = 0; i < sel.rangeCount; i++) {
      const rg = sel.getRangeAt(i);
      const ac = rg.commonAncestorContainer;
      const ae = ac && ac.nodeType === 1 ? ac : ac && ac.parentElement;
      if (ae && w3IsUi(ae)) continue;
      const rcs = rg.getClientRects();
      for (let j = 0; j < rcs.length; j++) {
        const r = rcs[j];
        if (
          r.width > 0 &&
          r.height > 0 &&
          x >= r.left - 2 &&
          x <= r.right + 2 &&
          y >= r.top - 1 &&
          y <= r.bottom + 1
        )
          return true;
      }
    }
    return false;
  }

  function w3ClearPe() {
    if (w3PeHovered) {
      w3PeHovered.classList.remove("macro-pe-txt");
      w3PeHovered = null;
    }
    for (let i = 0; i < w3PeDragGrp.length; i++)
      w3PeDragGrp[i].classList.remove("macro-pe-txt");
    w3PeDragGrp = [];
  }

  function w3HoverTick(x, y) {
    if (!v9TxtOn() || w3DragSel) return;
    if (w3PeDirty || performance.now() - w3PeLastScan > 350) w3ScanPeNone();
    const topEl = document.elementFromPoint(x, y);
    if (w3IsUi(topEl)) {
      w3ClearPe();
      return;
    }
    let found = null;
    for (let i = 0; i < w3PeList.length; i++) {
      const el = w3PeList[i];
      if (!el.isConnected || w3IsOccluded(el, topEl)) continue;
      if (w3ElTxtHit(el, x, y)) {
        found = el;
        break;
      }
    }
    if (w3PeHovered && w3PeHovered !== found) {
      const sel = window.getSelection();
      if (!(sel && !sel.isCollapsed && sel.containsNode(w3PeHovered, true))) {
        w3PeHovered.classList.remove("macro-pe-txt");
      }
      w3PeHovered = null;
    }
    if (found) {
      found.classList.add("macro-pe-txt");
      w3PeHovered = found;
    }
  }

  function k9SyncTxtMode() {
    const on = v9TxtOn();
    if (document.body) {
      document.body.classList.toggle("macro-txt-sel-on", on);
      if (on && !w3PeObs && typeof MutationObserver === "function") {
        w3PeObs = new MutationObserver(() => {
          w3PeDirty = true;
        });
        w3PeObs.observe(document.body, {
          childList: true,
          subtree: true,
          characterData: true,
        });
      }
    }
    if (!on) {
      if (w3PeObs) {
        w3PeObs.disconnect();
        w3PeObs = null;
      }
      w3ClearPe();
      w3SetBypass(false);
      w3DragSel = false;
      w3DragCvs = false;
      w3RmbHit = false;
      document
        .querySelectorAll(".macro-pe-txt")
        .forEach((el) => el.classList.remove("macro-pe-txt"));
      w3AllLayers.forEach((lr) => {
        lr.root.style.display = "none";
        for (let i = 0; i < lr.slots.length; i++) {
          const sl = lr.slots[i];
          sl.el.style.display = "none";
          sl.el.textContent = "";
          sl.txt = "";
          sl.tr = "";
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
      document.querySelectorAll("canvas").forEach((cv) => {
        if (w3ConnTxt.has(cv)) w3DirtyCv.add(cv);
      });
      w3TickTxt();
    }
  }

  const n5SoftCache = new Map();
  const g7SoftTint = new WeakMap();
  const g7SoftSet = new Set();
  const g7SoftGfx = new WeakMap();
  const g7SoftGfxSet = new Set();
  const g7SoftPrt = new WeakMap();
  const g7SoftPrtSet = new Set();

  let p9GlSoftAct = false;

  function n5SoftNum(col) {
    if (typeof col !== "number" || !Number.isFinite(col)) return col;
    const ci = col & 0xffffff;
    if (ci === 0 || ci === 0xffffff) return ci;
    const hit = n5SoftCache.get(ci);
    if (hit !== undefined) return hit;
    const rn = ((ci >> 16) & 255) / 255;
    const gn = ((ci >> 8) & 255) / 255;
    const bn = (ci & 255) / 255;
    const mx = Math.max(rn, gn, bn);
    const mn = Math.min(rn, gn, bn);
    const d = mx - mn;
    const l = (mx + mn) * 0.5;
    const sV = mx > 0 ? d / mx : 0;
    const sL = d > 0 ? d / (1 - Math.abs(2 * l - 1)) : 0;
    let out = ci;
    if (
      d >= 0.14 &&
      (sV >= 0.2 || sL >= 0.22) &&
      !(mx > 0.9 && mn > 0.78) &&
      mx >= 0.63 &&
      l >= 0.34
    ) {
      const ns = sV * 0.54;
      const nv = mx + (1 - mx) * 0.35;
      const nr = Math.max(
        0,
        Math.min(255, Math.round((1 - ns + ns * ((rn - mn) / d)) * nv * 255)),
      );
      const ng = Math.max(
        0,
        Math.min(255, Math.round((1 - ns + ns * ((gn - mn) / d)) * nv * 255)),
      );
      const nb = Math.max(
        0,
        Math.min(255, Math.round((1 - ns + ns * ((bn - mn) / d)) * nv * 255)),
      );
      out = (nr << 16) | (ng << 8) | nb;
    }
    if (n5SoftCache.size > 1024) n5SoftCache.clear();
    n5SoftCache.set(ci, out);
    return out;
  }

  function k2ReadTint(nd) {
    const t = nd.tint;
    if (typeof t === "number") return t & 0xffffff;
    if (t && typeof t.toNumber === "function") return t.toNumber() & 0xffffff;
    return -1;
  }

  function k2IsBorder(nd) {
    if (!nd || typeof nd.getLocalBounds !== "function") return false;
    const b = m7Box(nd.getLocalBounds());
    return Boolean(b && (b.w >= 3800 || b.h >= 3800));
  }

  function k2SoftStyle(st, owner, kind) {
    if (!st || typeof st.color !== "number") return false;
    const cc = st.color & 0xffffff;
    let rec = g7SoftGfx.get(st);
    if (!rec) {
      const sc = n5SoftNum(cc);
      if (sc !== cc) {
        rec = { raw: cc, soft: sc, owner, kind };
        g7SoftGfx.set(st, rec);
        g7SoftGfxSet.add(st);
        st.color = sc;
        return true;
      }
      return false;
    }
    if (cc !== rec.soft) {
      rec.raw = cc;
      rec.soft = n5SoftNum(cc);
    }
    if (rec.soft !== cc) {
      st.color = rec.soft;
      return true;
    }
    return false;
  }

  function k2SoftNode(nd) {
    const tc = k2ReadTint(nd);
    if (tc >= 0) {
      let rec = g7SoftTint.get(nd);
      if (!rec) {
        const sc = n5SoftNum(tc);
        if (sc !== tc) {
          rec = { raw: tc, soft: sc };
          g7SoftTint.set(nd, rec);
          g7SoftSet.add(nd);
          nd.tint = sc;
        }
      } else {
        if (tc !== rec.soft) {
          rec.raw = tc;
          rec.soft = n5SoftNum(tc);
        }
        if (rec.soft !== tc) nd.tint = rec.soft;
      }
    }
    if (
      nd.context &&
      Array.isArray(nd.context.instructions) &&
      !k2IsBorder(nd)
    ) {
      const ins = nd.context.instructions;
      let chg = false;
      for (let i = 0; i < ins.length; i++) {
        const it = ins[i];
        if (
          it &&
          (it.action === "fill" || it.action === "stroke") &&
          it.data &&
          it.data.style
        ) {
          if (k2SoftStyle(it.data.style, nd.context, 1)) chg = true;
        }
      }
      if (chg && typeof nd.context.onUpdate === "function")
        nd.context.onUpdate();
    } else if (
      nd.geometry &&
      Array.isArray(nd.geometry.graphicsData) &&
      !k2IsBorder(nd)
    ) {
      const gd = nd.geometry.graphicsData;
      let chg = false;
      for (let i = 0; i < gd.length; i++) {
        const g = gd[i];
        if (!g) continue;
        if (g.fillStyle && k2SoftStyle(g.fillStyle, nd.geometry, 2)) chg = true;
        if (g.lineStyle && k2SoftStyle(g.lineStyle, nd.geometry, 2)) chg = true;
      }
      if (chg && typeof nd.geometry.invalidate === "function")
        nd.geometry.invalidate();
    }
  }

  function k2SoftWalk(nd, dp) {
    if (
      !nd ||
      nd.destroyed ||
      nd.visible === false ||
      nd.isMask ||
      typeof nd.text === "string"
    )
      return;
    if (dp > 3) return;
    if (nd.isParticleContainer && Array.isArray(nd.particleChildren)) {
      const ps = nd.particleChildren;
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        if (!p || typeof p.color !== "number") continue;
        const pc = p.color & 0xffffff;
        const pa = p.color & 0xff000000;
        let rec = g7SoftPrt.get(p);
        if (!rec) {
          const sc = n5SoftNum(pc);
          if (sc !== pc) {
            rec = { raw: pc, soft: sc };
            g7SoftPrt.set(p, rec);
            g7SoftPrtSet.add(p);
            p.color = (pa | sc) >>> 0;
          }
        } else {
          if (pc !== rec.soft) {
            rec.raw = pc;
            rec.soft = n5SoftNum(pc);
          }
          if (rec.soft !== pc) p.color = (pa | rec.soft) >>> 0;
        }
      }
      return;
    }
    k2SoftNode(nd);
    const ch = nd.children;
    if (ch && ch.length) {
      for (let i = 0; i < ch.length; i++) k2SoftWalk(ch[i], dp + 1);
    }
  }

  function k2SoftFrame(wld) {
    if (!m9TvL2sP.softColors || p9GlSoftAct) {
      if (g7SoftSet.size || g7SoftGfxSet.size || g7SoftPrtSet.size) j2RstSoft();
      return;
    }
    if (!wld || !wld.children) return;
    let cam = wld;
    const wt = wld.worldTransform;
    if (
      wt &&
      Math.abs(wt.a - 1) < 1e-4 &&
      Math.abs(wt.d - 1) < 1e-4 &&
      Math.abs(wt.tx) < 0.5 &&
      Math.abs(wt.ty) < 0.5
    ) {
      for (let i = 0; i < wld.children.length; i++) {
        const c = wld.children[i];
        const cwt = c && c.worldTransform;
        if (
          c &&
          c.children &&
          c.children.length &&
          cwt &&
          cwt.a > 0.002 &&
          cwt.a < 25 &&
          (Math.abs(cwt.a - 1) > 1e-4 ||
            Math.abs(cwt.tx) > 0.5 ||
            Math.abs(cwt.ty) > 0.5)
        ) {
          cam = c;
          break;
        }
      }
    }
    const ch = cam.children;
    if (!ch || !ch.length) return;
    for (let i = 0; i < ch.length; i++) {
      const c = ch[i];
      if (
        !c ||
        c.destroyed ||
        c.visible === false ||
        typeof c.text === "string"
      )
        continue;
      if (c.isParticleContainer) {
        k2SoftWalk(c, 0);
        continue;
      }
      const sub = c.children;
      if (sub && sub.length) {
        if (
          sub.length <= 16 &&
          !sub.some((k) => k && k.children && k.children.length > 0) &&
          k2IsBorder(c)
        )
          continue;
        for (let j = 0; j < sub.length; j++) k2SoftWalk(sub[j], 0);
      } else if (!k2IsBorder(c)) {
        k2SoftWalk(c, 0);
      }
    }
  }

  function j2RstSoft() {
    g7SoftSet.forEach((nd) => {
      const rec = g7SoftTint.get(nd);
      if (rec && nd && !nd.destroyed && k2ReadTint(nd) === rec.soft) {
        nd.tint = rec.raw;
      }
      g7SoftTint.delete(nd);
    });
    g7SoftSet.clear();

    const upd = new Set();
    g7SoftGfxSet.forEach((st) => {
      const rec = g7SoftGfx.get(st);
      if (
        rec &&
        typeof st.color === "number" &&
        (st.color & 0xffffff) === rec.soft
      ) {
        st.color = rec.raw;
        if (rec.owner) upd.add(rec);
      }
      g7SoftGfx.delete(st);
    });
    g7SoftGfxSet.clear();
    upd.forEach((r) => {
      try {
        if (r.kind === 1 && typeof r.owner.onUpdate === "function")
          r.owner.onUpdate();
        else if (r.kind === 2 && typeof r.owner.invalidate === "function")
          r.owner.invalidate();
      } catch (_) {}
    });

    g7SoftPrtSet.forEach((p) => {
      const rec = g7SoftPrt.get(p);
      if (
        rec &&
        typeof p.color === "number" &&
        (p.color & 0xffffff) === rec.soft
      ) {
        p.color = ((p.color & 0xff000000) | rec.raw) >>> 0;
      }
      g7SoftPrt.delete(p);
    });
    g7SoftPrtSet.clear();
  }

  const c9LmW2xR = new Set();
  let r7DpK4vM = 0;

  function u5KnP8sT(st, scn) {
    if (!st || !st.children || !st.children.length) return;
    let wld = st.children[0];
    if (
      wld &&
      (!wld.children || !wld.children.length) &&
      st.children.length > 1
    ) {
      for (let i = 1; i < st.children.length; i++) {
        if (
          st.children[i] &&
          st.children[i].children &&
          st.children[i].children.length
        ) {
          wld = st.children[i];
          break;
        }
      }
    }
    if (!wld) return;
    k2SoftFrame(wld);
    if (m9TvL2sP.stripFilters) {
      if (wld.filters && wld.filters.length > 0) wld.filters = null;
      if (st.filters && st.filters.length > 0) st.filters = null;
    }
    if (!m9TvL2sP.frustumCulling) {
      if (c9LmW2xR.size > 0) {
        c9LmW2xR.forEach((c) => {
          if (c && !c.destroyed) c.renderable = true;
        });
        c9LmW2xR.clear();
      }
      return;
    }
    let cam = wld;
    const wt = wld.worldTransform;
    if (
      wt &&
      Math.abs(wt.a - 1) < 1e-4 &&
      Math.abs(wt.d - 1) < 1e-4 &&
      Math.abs(wt.tx) < 0.5 &&
      Math.abs(wt.ty) < 0.5 &&
      wld.children
    ) {
      for (let i = 0; i < wld.children.length; i++) {
        const c = wld.children[i];
        const cwt = c && c.worldTransform;
        if (
          c &&
          c.children &&
          c.children.length &&
          cwt &&
          cwt.a > 0.002 &&
          cwt.a < 25 &&
          (Math.abs(cwt.a - 1) > 1e-4 ||
            Math.abs(cwt.tx) > 0.5 ||
            Math.abs(cwt.ty) > 0.5)
        ) {
          cam = c;
          break;
        }
      }
    }
    if (!cam.children) return;
    let cc = null,
      mx = 0;
    for (let i = 0; i < cam.children.length; i++) {
      const c = cam.children[i],
        n = c.children ? c.children.length : 0;
      if (n > mx) {
        mx = n;
        cc = c;
      }
    }
    if (!cc || !cc.children) return;
    if (m9TvL2sP.stripFilters && cc.filters && cc.filters.length > 0)
      cc.filters = null;
    const cl = cc.children;
    if (c9LmW2xR.size > 0) {
      c9LmW2xR.forEach((c) => {
        if (!c || c.destroyed || c.parent !== cc) {
          if (c && !c.destroyed) c.renderable = true;
          c9LmW2xR.delete(c);
        }
      });
    }
    const sw = scn && scn.width ? scn.width : window.innerWidth;
    const sh = scn && scn.height ? scn.height : window.innerHeight;
    const mg = m9TvL2sP.cullMarginToggle ? m9TvL2sP.cullMargin || 120 : 0;
    const mnX = -mg,
      mxX = sw + mg,
      mnY = -mg,
      mxY = sh + mg;
    for (let i = 0; i < cl.length; i++) {
      const c = cl[i];
      if (!c || c.destroyed) continue;
      if (!c.renderable && !c9LmW2xR.has(c)) continue;
      const b = c.getBounds ? m7Box(c.getBounds()) : null;
      if (!b) continue;
      const out = b.x + b.w < mnX || b.x > mxX || b.y + b.h < mnY || b.y > mxY;
      if (out) {
        if (c.renderable) {
          c.renderable = false;
          c9LmW2xR.add(c);
        }
      } else if (c9LmW2xR.has(c)) {
        c.renderable = true;
        c9LmW2xR.delete(c);
      }
    }
  }

  function m7Box(lb) {
    if (!lb) return null;
    const x = lb.x !== undefined ? lb.x : lb.minX;
    const y = lb.y !== undefined ? lb.y : lb.minY;
    const w = lb.width !== undefined ? lb.width : lb.maxX - x;
    const h = lb.height !== undefined ? lb.height : lb.maxY - y;
    return Number.isFinite(x) &&
      Number.isFinite(y) &&
      Number.isFinite(w) &&
      Number.isFinite(h)
      ? { x, y, w, h }
      : null;
  }

  function m7SyncPixi(st, scn, rnd) {
    if (!st || !st.children || !st.children.length) return;
    let wld = st.children[0];
    if (
      wld &&
      (!wld.children || !wld.children.length) &&
      st.children.length > 1
    ) {
      for (let i = 1; i < st.children.length; i++) {
        if (
          st.children[i] &&
          st.children[i].children &&
          st.children[i].children.length
        ) {
          wld = st.children[i];
          break;
        }
      }
    }
    if (!wld) return;
    let cam = wld,
      wt = wld.worldTransform;
    if (
      wt &&
      Math.abs(wt.a - 1) < 1e-4 &&
      Math.abs(wt.d - 1) < 1e-4 &&
      Math.abs(wt.tx) < 0.5 &&
      Math.abs(wt.ty) < 0.5 &&
      wld.children
    ) {
      for (let i = 0; i < wld.children.length; i++) {
        const c = wld.children[i];
        const cwt = c && c.worldTransform;
        if (
          c &&
          c.children &&
          c.children.length &&
          cwt &&
          cwt.a > 0.002 &&
          cwt.a < 25 &&
          (Math.abs(cwt.a - 1) > 1e-4 ||
            Math.abs(cwt.tx) > 0.5 ||
            Math.abs(cwt.ty) > 0.5)
        ) {
          cam = c;
          wt = cwt;
          break;
        }
      }
    }
    if (!wt || !Number.isFinite(wt.a) || wt.a <= 1e-4) return;
    p9WtA = wt.a;
    p9WtB = wt.b;
    p9WtC = wt.c;
    p9WtD = wt.d;
    p9WtTx = wt.tx;
    p9WtTy = wt.ty;
    p9ScW = scn && scn.width ? scn.width : 0;
    p9ScH = scn && scn.height ? scn.height : 0;
    p9CvRef = rnd.canvas || rnd.view || t8VwM4xK();
    if (p9CvRef && !p9CvRef.hasAttribute("data-macro-game-bg"))
      p9CvRef.setAttribute("data-macro-game-bg", "1");
    p9PixiOn = true;
    p9LastPixiMs = performance.now();

    if (
      ((m9TvL2sP.mapBgEnabled && q8MwP) || m9TvL2sP.mapGridEnabled) &&
      cam.children
    ) {
      let ccNode = null,
        maxCh = 0;
      const chs = cam.children;
      for (let i = 0; i < chs.length; i++) {
        const n = chs[i] && chs[i].children ? chs[i].children.length : 0;
        if (n > maxCh) {
          maxCh = n;
          ccNode = chs[i];
        }
      }
      let best = null,
        bestScore = -1;
      for (let i = 0; i < chs.length; i++) {
        const ch = chs[i];
        if (!ch || ch === ccNode || ch.visible === false || ch.destroyed)
          continue;
        const subN = ch.children ? ch.children.length : 0;
        if (subN > 16) continue;
        if (
          subN > 0 &&
          ch.children.some((k) => k && k.children && k.children.length > 0)
        )
          continue;
        if (typeof ch.getLocalBounds !== "function") continue;
        const b = m7Box(ch.getLocalBounds());
        if (!b || b.w < 3000 || b.h < 3000 || b.w > 80000 || b.h > 80000)
          continue;
        const lt = ch.localTransform;
        const lx = lt ? b.x * lt.a + b.y * lt.c + lt.tx : b.x;
        const ly = lt ? b.x * lt.b + b.y * lt.d + lt.ty : b.y;
        const lw = lt ? Math.abs(b.w * lt.a) : b.w;
        const lh = lt ? Math.abs(b.h * lt.d) : b.h;
        if (lw < 3000 || lh < 3000 || lw > 80000 || lh > 80000) continue;
        if (Math.abs(lw - lh) > Math.max(lw, lh) * 0.03) continue;
        const cOff = Math.hypot(lx + lw * 0.5, ly + lh * 0.5);
        const zOff = Math.hypot(lx, ly);
        if (cOff > lw * 0.05 && zOff > lw * 0.05) continue;
        const sc = (subN === 0 ? 100000 : 0) + lw;
        if (sc > bestScore) {
          bestScore = sc;
          best = { x: lx, y: ly, w: lw, h: lh };
        }
      }
      if (best) {
        p9MapX = best.x;
        p9MapY = best.y;
        p9MapW = best.w;
        p9MapH = best.h;
      }
    }

    if (b7DrawFn) b7DrawFn();
  }

  let p9RndRef = null;

  function p9ApplyRes(rnd) {
    if (!rnd || rnd._mResLock) return;
    const on = Boolean(m9TvL2sP.renderScaleToggle);
    if (!on && !rnd._mScaleOn) {
      rnd._mBaseRes = Number(rnd.resolution) || 1;
      return;
    }
    if (rnd._mBaseRes === undefined)
      rnd._mBaseRes = Number(rnd.resolution) || 1;
    const pct = on
      ? Math.max(25, Math.min(100, Number(m9TvL2sP.renderScale) || 100))
      : 100;
    const tr = Math.round(rnd._mBaseRes * pct * 100) / 10000;
    const cur = Number(rnd.resolution) || 1;
    const cv =
      rnd.canvas ||
      (rnd.view && rnd.view.tagName === "CANVAS"
        ? rnd.view
        : rnd.view && rnd.view.canvas) ||
      null;
    let sw = rnd.screen && rnd.screen.width > 0 ? rnd.screen.width : 0;
    let sh = rnd.screen && rnd.screen.height > 0 ? rnd.screen.height : 0;
    if ((sw <= 0 || sh <= 0) && cv) {
      const rc = cv.getBoundingClientRect();
      sw = Math.round(rc.width) || cv.clientWidth || window.innerWidth;
      sh = Math.round(rc.height) || cv.clientHeight || window.innerHeight;
    }
    const ew = cv && sw > 0 ? Math.max(1, Math.round(sw * tr)) : 0;
    const eh = cv && sh > 0 ? Math.max(1, Math.round(sh * tr)) : 0;
    if (
      Math.abs(cur - tr) > 1e-4 ||
      (cv &&
        ew > 0 &&
        eh > 0 &&
        (Math.abs(cv.width - ew) > 2 || Math.abs(cv.height - eh) > 2))
    ) {
      rnd._mResLock = true;
      try {
        const oldW = cv ? cv.width : 0;
        const oldH = cv ? cv.height : 0;
        const rcB = cv ? cv.getBoundingClientRect() : null;
        if (
          rnd.rootRenderTarget &&
          typeof rnd.rootRenderTarget.resolution === "number"
        )
          rnd.rootRenderTarget.resolution = tr;
        if (typeof rnd.resize === "function" && sw > 0 && sh > 0) {
          rnd.resolution = tr;
          rnd.resize(sw, sh, tr);
        } else {
          rnd.resolution = tr;
        }
        if (cv && cv.style && sw > 0 && sh > 0) {
          if (pct < 100) {
            const rcA = cv.getBoundingClientRect();
            if (
              rnd._mCssFit ||
              (rcA.width > 0 &&
                Math.abs(rcA.width - sw * tr) <= 2 &&
                Math.abs(sw - sw * tr) > 4 &&
                (!rcB || Math.abs(rcB.width - sw) <= 4))
            ) {
              rnd._mCssFit = true;
              cv.style.width = sw + "px";
              cv.style.height = sh + "px";
            }
          } else if (rnd._mCssFit) {
            rnd._mCssFit = false;
            cv.style.width = "";
            cv.style.height = "";
          }
        }
        if (
          cv &&
          oldW > 0 &&
          oldH > 0 &&
          cv.width > 0 &&
          cv.height > 0 &&
          (cv.width !== oldW || cv.height !== oldH)
        ) {
          const kx = cv.width / oldW,
            ky = cv.height / oldH,
            kr = (kx + ky) * 0.5;
          if (f8WnK3xL.locked) {
            f8WnK3xL.cx *= kx;
            f8WnK3xL.cy *= ky;
            f8WnK3xL.r *= kr;
            f8WnK3xL.rawCx *= kx;
            f8WnK3xL.rawCy *= ky;
            f8WnK3xL.rawR *= kr;
            z8PxL2sT = null;
          }
          if (x5QzL2wT.active && !x5QzL2wT.isVp) {
            x5QzL2wT.cx *= kx;
            x5QzL2wT.cy *= ky;
          }
        }
      } finally {
        rnd._mResLock = false;
      }
    }
    rnd._mScaleOn = on;
  }

  const i4TnL9wP = setInterval(() => {
    if (!window.PIXI) return;
    const P = window.PIXI;
    const rn = [
      ...new Set(
        [
          P.WebGLRenderer,
          P.WebGPURenderer,
          P.CanvasRenderer,
          P.Renderer,
        ].filter(Boolean),
      ),
    ];
    if (!rn.length) return;
    for (let i = 0; i < rn.length; i++) {
      const R = rn[i];
      if (R.prototype && R.prototype.resize && !R.prototype.resize.__mRsHook) {
        const rsOg = R.prototype.resize;
        const rsWr = function (w, h, res) {
          if (!this._mResLock) {
            const on = Boolean(m9TvL2sP.renderScaleToggle);
            if (!on && !this._mScaleOn) {
              if (typeof res === "number" && Number.isFinite(res) && res > 0)
                this._mBaseRes = res;
              else this._mBaseRes = Number(this.resolution) || 1;
            } else {
              if (this._mBaseRes === undefined)
                this._mBaseRes = Number(this.resolution) || 1;
              if (typeof res === "number" && Number.isFinite(res) && res > 0)
                this._mBaseRes = res;
              const pct = on
                ? Math.max(
                    25,
                    Math.min(100, Number(m9TvL2sP.renderScale) || 100),
                  )
                : 100;
              const tr = Math.round(this._mBaseRes * pct * 100) / 10000;
              if (
                this.rootRenderTarget &&
                typeof this.rootRenderTarget.resolution === "number"
              )
                this.rootRenderTarget.resolution = tr;
              if (
                pct !== 100 ||
                Math.abs((Number(this.resolution) || 1) - tr) > 1e-4
              ) {
                this.resolution = tr;
                if (pct !== 100 || res !== undefined) res = tr;
              }
              this._mScaleOn = on;
            }
          }
          const cv =
            this.canvas ||
            (this.view && this.view.tagName === "CANVAS"
              ? this.view
              : this.view && this.view.canvas) ||
            null;
          const rcB = !this._mResLock && cv ? cv.getBoundingClientRect() : null;
          const rVal = rsOg.call(this, w, h, res);
          if (!this._mResLock && cv && cv.style && w > 0 && h > 0) {
            const on = Boolean(m9TvL2sP.renderScaleToggle);
            const pct = on
              ? Math.max(25, Math.min(100, Number(m9TvL2sP.renderScale) || 100))
              : 100;
            const tr = Math.round((this._mBaseRes || 1) * pct * 100) / 10000;
            if (pct < 100) {
              const rcA = cv.getBoundingClientRect();
              if (
                this._mCssFit ||
                (rcA.width > 0 &&
                  Math.abs(rcA.width - w * tr) <= 2 &&
                  Math.abs(w - w * tr) > 4 &&
                  (!rcB || Math.abs(rcB.width - w) <= 4))
              ) {
                this._mCssFit = true;
                cv.style.width = w + "px";
                cv.style.height = h + "px";
              }
            } else if (this._mCssFit) {
              this._mCssFit = false;
              cv.style.width = "";
              cv.style.height = "";
            }
          }
          return rVal;
        };
        rsWr.__mRsHook = true;
        R.prototype.resize = rsWr;
      }
      if (R.prototype && R.prototype.render && !R.prototype.render.__mRnHook) {
        const ro = R.prototype.render;
        const rnWr = function (op) {
          r7DpK4vM++;
          const isRoot = r7DpK4vM === 1;
          const st = isRoot
            ? op && (op.container || op.target)
              ? op.container || op.target
              : op
            : null;
          if (isRoot) {
            p9RndRef = this;
            p9ApplyRes(this);
          }
          if (
            isRoot &&
            this.background &&
            typeof this.background.alpha === "number"
          ) {
            const cBg = this.background.color;
            if (typeof cBg === "number")
              p9BgCol = "#" + (cBg & 0xffffff).toString(16).padStart(6, "0");
            else if (cBg && typeof cBg.toNumber === "function")
              p9BgCol =
                "#" + (cBg.toNumber() & 0xffffff).toString(16).padStart(6, "0");
            else if (cBg && typeof cBg.toHex === "function")
              p9BgCol = cBg.toHex().slice(0, 7);
            else if (typeof cBg === "string" && cBg) p9BgCol = cBg;
            const gBgOn = Boolean(
              m9TvL2sP.mapGridEnabled && m9TvL2sP.mapGridMode !== "over",
            );
            const bgAct = Boolean(
              (m9TvL2sP.fixedBackgroundEnabled && u4TkQ) ||
              (m9TvL2sP.mapBgEnabled && q8MwP) ||
              gBgOn,
            );
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
        rnWr.__mRnHook = true;
        R.prototype.render = rnWr;
      }
    }
    clearInterval(i4TnL9wP);
  }, 50);

  const p5QzL9sT = (pt) => {
    if (!pt || !pt.uniformMatrix4fv) return;
    const og = pt.uniformMatrix4fv;
    pt.uniformMatrix4fv = function (lc, tr, dt) {
      if (dt && dt.length >= 16) {
        const cv = cachedGameCanvas || t8VwM4xK();
        if (cv && cv.width > 0 && this.canvas === cv) {
          f4NzQ8vR++;
          const m0 = Math.abs(dt[0]),
            m5 = Math.abs(dt[5]);
          if (
            m0 > 1e-6 &&
            m5 > 1e-6 &&
            m0 < 80.0 &&
            m5 < 80.0 &&
            Math.abs(dt[1]) < 1e-4 &&
            Math.abs(dt[4]) < 1e-4
          ) {
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

  const h6LocHook = (pt) => {
    if (!pt || !pt.getUniformLocation) return;
    const og = pt.getUniformLocation;
    pt.getUniformLocation = function (pr, nm) {
      const loc = og.apply(this, arguments);
      if (
        loc &&
        typeof nm === "string" &&
        /proj|tex|uv|color|sampler|filter/i.test(nm)
      ) {
        uLocMap.set(loc, 2);
      }
      return loc;
    };
  };

  const y2TvN7wM = (pt) => {
    if (!pt || !pt.uniformMatrix3fv) return;
    const og = pt.uniformMatrix3fv;
    pt.uniformMatrix3fv = function (lc, tr, dt) {
      if (dt && dt.length >= 9) {
        const cv = cachedGameCanvas || t8VwM4xK();
        if (cv && cv.width > 0 && this.canvas === cv) {
          f4NzQ8vR++;
          const z = dt[0];
          const uk = lc ? uLocMap.get(lc) || 0 : 0;
          if (
            !tr &&
            uk !== 2 &&
            z > 0.003 &&
            z < 15.0 &&
            dt[4] > 0.003 &&
            Math.abs(z - dt[4]) < Math.max(z, dt[4]) * 0.01 &&
            Math.abs(dt[1]) < 1e-4 &&
            Math.abs(dt[3]) < 1e-4 &&
            (Math.abs(z - 1.0) > 0.01 || (kAct && Math.abs(zM - 1.0) < 0.1)) &&
            (Math.abs(dt[6]) > 5 || Math.abs(dt[7]) > 5)
          ) {
            zM = z;
            tX = dt[6];
            tY = dt[7];
            kAct = true;
            p9GlMs = performance.now();
          }
          const m0 = Math.abs(dt[0]),
            m4 = Math.abs(dt[4]);
          if (
            m0 > 1e-6 &&
            m4 > 1e-6 &&
            m0 < 80.0 &&
            m4 < 80.0 &&
            Math.abs(dt[1]) < 1e-4 &&
            Math.abs(dt[3]) < 1e-4
          ) {
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

  const glShType = new WeakMap();
  const glOrigSrc = new WeakMap();
  const glPatchedSh = new WeakSet();
  const glCurProg = new WeakMap();
  const glSoftLoc = new WeakMap();
  const glSoftVal = new WeakMap();

  const k2GlslFn = `
uniform float _uMSoft;
vec4 _mSoft(vec4 raw) {
  if (_uMSoft < 0.5 || raw.a <= 0.001) return raw;
  float rMx = max(raw.r, max(raw.g, raw.b));
  float pre = (rMx <= raw.a + 0.004 && raw.a < 0.999) ? 1.0 : 0.0;
  vec3 c = pre > 0.5 ? clamp(raw.rgb / raw.a, 0.0, 1.0) : clamp(raw.rgb, 0.0, 1.0);
  float mx = max(c.r, max(c.g, c.b));
  float mn = min(c.r, min(c.g, c.b));
  float d = mx - mn;
  float l = (mx + mn) * 0.5;
  float sV = mx > 0.0001 ? d / mx : 0.0;
  float sL = (d > 0.0001 && l > 0.0001 && l < 0.9999) ? d / (1.0 - abs(2.0 * l - 1.0)) : 0.0;
  if (d < 0.14 || (sV < 0.20 && sL < 0.22) || (mx > 0.90 && mn > 0.78) || mx < 0.63 || l < 0.34) return raw;
  float ns = sV * 0.54;
  float nv = mx + (1.0 - mx) * 0.35;
  vec3 nh = (c - vec3(mn)) / d;
  vec3 sc = mix(vec3(1.0), nh, ns) * nv;
  return vec4(pre > 0.5 ? sc * raw.a : sc, raw.a);
}
`;

  function k2PatchFrag(src) {
    if (typeof src !== "string" || src.includes("_mSoft")) return null;
    const mMain = src.match(/\bvoid\s+main\s*\(\s*(?:void\s*)?\)\s*\{/);
    if (!mMain) return null;
    const is300 = /^\s*#version\s+300\s+es\b/m.test(src);
    if (is300) {
      const mOut = src.match(
        /(?:layout\s*\([^)]*\)\s*)?\bout\s+(?:(?:highp|mediump|lowp)\s+)?vec4\s+([A-Za-z_]\w*)\s*;/,
      );
      if (!mOut) return null;
      const outN = mOut[1];
      const idx = mMain.index;
      const head = src.slice(0, idx);
      const tail = src.slice(idx).replace(/\bmain\b/, "_mOrigMain");
      return (
        head +
        k2GlslFn +
        tail +
        `\nvoid main(){_mOrigMain();${outN}=_mSoft(${outN});}`
      );
    }
    if (!/\bgl_FragColor\b/.test(src) || /\bgl_FragData\b/.test(src))
      return null;
    const idx = mMain.index;
    const head = src.slice(0, idx).replace(/\bgl_FragColor\b/g, "_mFc0");
    const tail = src
      .slice(idx)
      .replace(/\bmain\b/, "_mOrigMain")
      .replace(/\bgl_FragColor\b/g, "_mFc0");
    return (
      head +
      "\nvec4 _mFc0 = vec4(0.0);\n" +
      k2GlslFn +
      tail +
      "\nvoid main(){_mOrigMain();gl_FragColor=_mSoft(_mFc0);}"
    );
  }

  function k2SyncGlSoft(gl) {
    if (gl.canvas !== (cachedGameCanvas || t8VwM4xK())) return;
    f4NzQ8vR++;
    const prog = glCurProg.get(gl);
    if (!prog) return;
    const loc = glSoftLoc.get(prog);
    if (!loc) return;
    p9GlSoftAct = true;
    const want = m9TvL2sP.softColors ? 1 : 0;
    if (glSoftVal.get(prog) !== want) {
      glSoftVal.set(prog, want);
      gl.uniform1f(loc, want);
    }
  }

  const k2HookGlSoft = (pt) => {
    if (!pt || pt.__mGlSoft) return;
    pt.__mGlSoft = true;
    const ogCrSh = pt.createShader;
    const ogShSrc = pt.shaderSource;
    const ogComp = pt.compileShader;
    const ogUse = pt.useProgram;
    const ogLink = pt.linkProgram;
    const ogUnifLoc = pt.getUniformLocation;
    const ogExt = pt.getExtension;

    if (ogCrSh) {
      pt.createShader = function (tp) {
        const sh = ogCrSh.apply(this, arguments);
        if (sh && tp === 0x8b30) glShType.set(sh, 1);
        return sh;
      };
    }
    if (ogShSrc) {
      pt.shaderSource = function (sh, src) {
        const isFrag =
          glShType.has(sh) ||
          (typeof src === "string" &&
            !/\bgl_Position\b/.test(src) &&
            (/\bgl_FragColor\b/.test(src) ||
              /\bout\s+(?:(?:highp|mediump|lowp)\s+)?vec4\b/.test(src)));
        if (isFrag && typeof src === "string") {
          const p = k2PatchFrag(src);
          if (p) {
            glOrigSrc.set(sh, src);
            glPatchedSh.add(sh);
            return ogShSrc.call(this, sh, p);
          }
        }
        glPatchedSh.delete(sh);
        return ogShSrc.apply(this, arguments);
      };
    }
    if (ogComp) {
      pt.compileShader = function (sh) {
        ogComp.apply(this, arguments);
        if (
          glPatchedSh.has(sh) &&
          !this.getShaderParameter(sh, 0x8b81) &&
          ogShSrc
        ) {
          const orig = glOrigSrc.get(sh);
          glPatchedSh.delete(sh);
          if (orig) {
            ogShSrc.call(this, sh, orig);
            ogComp.call(this, sh);
          }
        }
      };
    }
    if (ogUse) {
      pt.useProgram = function (prog) {
        glCurProg.set(this, prog || null);
        return ogUse.apply(this, arguments);
      };
    }
    if (ogLink) {
      pt.linkProgram = function (prog) {
        ogLink.apply(this, arguments);
        if (prog && this.getProgramParameter(prog, 0x8b82) && ogUnifLoc) {
          const loc = ogUnifLoc.call(this, prog, "_uMSoft");
          if (loc) {
            glSoftLoc.set(prog, loc);
            glSoftVal.set(prog, -1);
          }
        }
      };
    }
    if (ogExt) {
      pt.getExtension = function (nm) {
        const ext = ogExt.apply(this, arguments);
        if (
          ext &&
          typeof nm === "string" &&
          nm === "ANGLE_instanced_arrays" &&
          !ext.__mGlInst
        ) {
          ext.__mGlInst = true;
          const glRef = this;
          ["drawArraysInstancedANGLE", "drawElementsInstancedANGLE"].forEach(
            (fn) => {
              if (!ext[fn]) return;
              const ogF = ext[fn];
              ext[fn] = function () {
                k2SyncGlSoft(glRef);
                return ogF.apply(this, arguments);
              };
            },
          );
        }
        return ext;
      };
    }
  };

  const n4GlDrw = (pt) => {
    if (!pt) return;
    [
      "drawArrays",
      "drawElements",
      "drawArraysInstanced",
      "drawElementsInstanced",
    ].forEach((fn) => {
      if (!pt[fn]) return;
      const og = pt[fn];
      pt[fn] = function () {
        k2SyncGlSoft(this);
        return og.apply(this, arguments);
      };
    });
  };

  k2HookGlSoft(WebGLRenderingContext.prototype);
  h6LocHook(WebGLRenderingContext.prototype);
  p5QzL9sT(WebGLRenderingContext.prototype);
  y2TvN7wM(WebGLRenderingContext.prototype);
  n4GlDrw(WebGLRenderingContext.prototype);
  if (typeof WebGL2RenderingContext !== "undefined") {
    k2HookGlSoft(WebGL2RenderingContext.prototype);
    h6LocHook(WebGL2RenderingContext.prototype);
    p5QzL9sT(WebGL2RenderingContext.prototype);
    y2TvN7wM(WebGL2RenderingContext.prototype);
    n4GlDrw(WebGL2RenderingContext.prototype);
  }

  const w7PxM3tL = CanvasRenderingContext2D.prototype.setTransform;
  CanvasRenderingContext2D.prototype.setTransform = function (
    a,
    b,
    c,
    d,
    e,
    f,
  ) {
    if (typeof a === "number") {
      const s = Math.hypot(a, b);
      if (s > 0.005 && s < 50.0) {
        const cv = this.canvas;
        if (
          cv &&
          (cv.id === "canvas" || cv === (cachedGameCanvas || t8VwM4xK()))
        ) {
          f4NzQ8vR++;
          const z0 =
            Math.abs(a - 1) < 1e-4 &&
            Math.abs(b) < 1e-4 &&
            Math.abs(e || 0) < 1 &&
            Math.abs(f || 0) < 1;
          if (!z0) {
            k6XpL1vQ = s;
            if (r3WnS8mT === null) r3WnS8mT = s;
          }
          if (
            (!p9PixiOn || performance.now() - p9LastPixiMs > 500) &&
            typeof d === "number" &&
            typeof e === "number" &&
            typeof f === "number"
          ) {
            if (
              Math.abs(b) < 1e-4 &&
              Math.abs(c) < 1e-4 &&
              Math.abs(a - d) < 1e-3 &&
              Math.abs(a - 1) > 1e-3 &&
              (Math.abs(e) > 1 || Math.abs(f) > 1)
            ) {
              p9C2A = a;
              p9C2D = d;
              p9C2Tx = e;
              p9C2Ty = f;
              p9C2Cv = cv;
              p9C2On = true;
            }
          }
        }
      }
    }
    return w7PxM3tL.apply(this, arguments);
  };

  window.addEventListener(
    "wheel",
    (e) => {
      m8QzV2tL = Math.max(
        0.04,
        Math.min(25.0, m8QzV2tL * (e.deltaY < 0 ? 1.08 : 0.925)),
      );
    },
    { passive: true },
  );

  function k3WnL8vR() {
    const nw = performance.now();
    if (p9PixiOn && nw - p9LastPixiMs <= 500 && p9ScW > 0) {
      const cv = cachedGameCanvas || t8VwM4xK();
      if (cv && cv.width > 0) {
        const pz = Math.hypot(p9WtA, p9WtB) * (cv.width / p9ScW);
        if (pz > 0.002 && pz < 50.0) return pz;
      }
    }
    if (
      p9C2On &&
      p9C2A > 0.002 &&
      p9C2A < 50.0 &&
      (!p9PixiOn || nw - p9LastPixiMs > 500)
    )
      return p9C2A;
    return r3WnS8mT && Math.abs(k6XpL1vQ - r3WnS8mT) > 1e-5
      ? k6XpL1vQ / r3WnS8mT
      : m8QzV2tL;
  }

  const b8QzT4mL = HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.getContext = function (t, o) {
    if (t === "webgl" || t === "webgl2") {
      o = Object.assign({}, o, {
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
      });
    }
    const ctx = b8QzT4mL.call(this, t, o);
    if (
      ctx &&
      this.id !== "autorev-overlay" &&
      this.id !== "macro-bg-canvas" &&
      this.id !== "macro-plexus-canvas" &&
      this.id !== "macro-grid-canvas" &&
      this.id !== "macro-curline-canvas" &&
      this.id !== "macro-bypass-field" &&
      this.id !== "macro-bypass-radar"
    ) {
      if (t === "webgl" || t === "webgl2")
        gCtxMap.set(this, { gl: ctx, ctx2d: null });
      else if (t === "2d" && !gCtxMap.has(this))
        gCtxMap.set(this, { gl: null, ctx2d: ctx });
    }
    return ctx;
  };

  let r5TxL1wQ = null,
    m3WpS8xT = 0,
    v9QnL4vM = 0;

  function z2TvM8sP() {
    if (b6BpSt.specEntered) return true;
    const mp = document.getElementById("main-panel");
    if (mp && window.getComputedStyle(mp).display !== "none") return true;
    const nw = performance.now();
    if (nw - v5QzR9mL < 350) return false;
    v5QzR9mL = nw;
    const p =
      s8XnL3wP && document.contains(s8XnL3wP)
        ? s8XnL3wP
        : (s8XnL3wP =
            document.getElementById("score-panel") ||
            document.getElementById("stats") ||
            document.querySelector('[id*="score"]') ||
            document.querySelector(".main-bottom-stats"));
    if (p) {
      const m = (p.textContent || "").match(/Mass\s*:\s*([0-9\s,]+)/i);
      if (m) {
        const val = parseInt(m[1].replace(/[\s,]/g, ""), 10);
        return val <= 0 || isNaN(val);
      }
    }
    return false;
  }

  const f8WnK3xL = {
    locked: false,
    cx: 0,
    cy: 0,
    r: 0,
    rawCx: 0,
    rawCy: 0,
    rawR: 0,
    worldR: 0,
    vx: 0,
    vy: 0,
    misses: 0,
    lastTimestamp: performance.now(),
    color: null,
  };
  const x5QzL2wT = {
    active: false,
    cx: 0,
    cy: 0,
    worldR: 0,
    r: 0,
    isVp: false,
    alpha: 0,
    pop: 1.0,
  };

  function p9TvM4sL(w, h) {
    if (!r5TxL1wQ || m3WpS8xT !== w || v9QnL4vM !== h) {
      m3WpS8xT = w;
      v9QnL4vM = h;
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
  const b4WpL9sT = (r1, g1, b1, r2, g2, b2, tol) =>
    Math.abs(r1 - r2) <= tol &&
    Math.abs(g1 - g2) <= tol &&
    Math.abs(b1 - b2) <= tol;

  function r7QnM3vL(p1, p2, p3) {
    const d =
      2 * (p1.x * (p2.y - p3.y) + p2.x * (p3.y - p1.y) + p3.x * (p1.y - p2.y));
    if (Math.abs(d) < 1e-6) return null;
    const a2 = p1.x * p1.x + p1.y * p1.y,
      b2 = p2.x * p2.x + p2.y * p2.y,
      c2 = p3.x * p3.x + p3.y * p3.y;
    const cx =
      (a2 * (p2.y - p3.y) + b2 * (p3.y - p1.y) + c2 * (p1.y - p2.y)) / d;
    const cy =
      (a2 * (p3.x - p2.x) + b2 * (p1.x - p3.x) + c2 * (p2.x - p1.x)) / d;
    return { cx, cy, r: Math.hypot(p1.x - cx, p1.y - cy) };
  }

  function m5TxK8wP(pts, fb) {
    function fit(arr, seed) {
      const n = arr.length;
      if (n < 4) return seed;
      let sX = 0,
        sY = 0;
      for (let i = 0; i < n; i++) {
        sX += arr[i].x;
        sY += arr[i].y;
      }
      const mx = sX / n,
        my = sY / n;
      let mxx = 0,
        myy = 0,
        mxy = 0,
        mxz = 0,
        myz = 0;
      for (let i = 0; i < n; i++) {
        const u = arr[i].x - mx,
          v = arr[i].y - my;
        mxx += u * u;
        myy += v * v;
        mxy += u * v;
        mxz += u * (u * u + v * v);
        myz += v * (u * u + v * v);
      }
      const det = mxx * myy - mxy * mxy;
      let cx = seed.cx,
        cy = seed.cy,
        r = seed.r;
      if (Math.abs(det) > 1e-5) {
        const uc = (myy * mxz - mxy * myz) / (2 * det),
          vc = (mxx * myz - mxy * mxz) / (2 * det);
        cx = mx + uc;
        cy = my + vc;
        r = Math.sqrt(uc * uc + vc * vc + (mxx + myy) / n);
      }
      for (let it = 0; it < 2; it++) {
        let j11 = 0,
          j12 = 0,
          j22 = 0,
          b1 = 0,
          b2 = 0,
          tD = 0;
        for (let i = 0; i < n; i++) {
          const dx = arr[i].x - cx,
            dy = arr[i].y - cy,
            d = Math.hypot(dx, dy);
          if (d < 1e-5) continue;
          tD += d;
          const ux = dx / d,
            uy = dy / d,
            res = d - r;
          j11 += ux * ux;
          j12 += ux * uy;
          j22 += uy * uy;
          b1 += ux * res;
          b2 += uy * res;
        }
        const jDet = j11 * j22 - j12 * j12;
        if (Math.abs(jDet) < 1e-5) break;
        const dCx = (j22 * b1 - j12 * b2) / jDet,
          dCy = (j11 * b2 - j12 * b1) / jDet;
        cx += dCx;
        cy += dCy;
        r = tD / n;
        if (dCx * dCx + dCy * dCy < 0.01) break;
      }
      return { cx, cy, r };
    }
    const first = fit(pts, fb);
    if (pts.length < 8) return first;
    const tol = Math.max(1.5, first.r * 0.025);
    const trimmed = [];
    for (let i = 0; i < pts.length; i++) {
      if (
        Math.abs(
          Math.hypot(pts[i].x - first.cx, pts[i].y - first.cy) - first.r,
        ) <= tol
      )
        trimmed.push(pts[i]);
    }
    return trimmed.length >= 6 ? fit(trimmed, first) : first;
  }

  function v2WzL7tM(b, w, h, isGl, sx, sy, tc, mr) {
    const rx = Math.round(Math.max(0, Math.min(w - 1, sx)));
    const ry = Math.round(Math.max(0, Math.min(h - 1, sy)));
    const p0 = y4WnS8tM(b, w, h, isGl, rx, ry);
    if (tc) {
      if (b4WpL9sT(p0.r, p0.g, p0.b, tc.r, tc.g, tc.b, 40))
        return { x: rx, y: ry, color: tc };
      const lim = Math.min(Math.max(w, h), Math.max(20, mr));
      for (let rad = 3; rad <= lim; rad += rad < 16 ? 3 : 6) {
        for (let k = 0; k < 16; k++) {
          const ang = (k * Math.PI) / 8,
            x = Math.round(rx + rad * Math.cos(ang)),
            y = Math.round(ry + rad * Math.sin(ang));
          if (x < 0 || x >= w || y < 0 || y >= h) continue;
          const p = y4WnS8tM(b, w, h, isGl, x, y);
          if (b4WpL9sT(p.r, p.g, p.b, tc.r, tc.g, tc.b, 40))
            return { x, y, color: tc };
        }
      }
      return null;
    }
    if (!k8TvN2xP(p0.r, p0.g, p0.b) && !x7TxP4nM(p0.r, p0.g, p0.b))
      return { x: rx, y: ry, color: p0 };
    const rings = [2, 4, 7, 10, 14];
    for (let ri = 0; ri < rings.length; ri++) {
      const rad = rings[ri];
      for (let k = 0; k < 12; k++) {
        const ang = (k * Math.PI) / 6;
        const x = Math.round(rx + rad * Math.cos(ang)),
          y = Math.round(ry + rad * Math.sin(ang));
        if (x < 0 || x >= w || y < 0 || y >= h) continue;
        const p = y4WnS8tM(b, w, h, isGl, x, y);
        if (!k8TvN2xP(p.r, p.g, p.b) && !x7TxP4nM(p.r, p.g, p.b))
          return { x, y, color: p };
      }
    }
    if (!k8TvN2xP(p0.r, p0.g, p0.b)) return { x: rx, y: ry, color: p0 };
    return null;
  }

  function z9TvS4xL(b, w, h, isGl, ox, oy, cos, sin, bc, maxD, sm) {
    let cD = 0,
      cT = 0,
      cO = 0,
      lD = 0,
      t = 0;
    const mS = Math.min(maxD, 2400);
    const minD = sm ? 1.5 : 2.5;
    const cCut = sm ? 3 : 8;
    const wCell = x7TxP4nM(bc.r, bc.g, bc.b);

    while (t < mS) {
      const sInc = t < 16 ? 1.0 : t < 90 ? 2.0 : 2.8;
      t += sInc;
      const px = Math.round(ox + t * cos),
        py = Math.round(oy + t * sin);
      if (px <= 0 || px >= w - 1 || py <= 0 || py >= h - 1)
        return lD >= minD
          ? { x: ox + lD * cos, y: oy + lD * sin, hitType: "edge" }
          : null;
      const p = y4WnS8tM(b, w, h, isGl, px, py);
      if (b4WpL9sT(p.r, p.g, p.b, bc.r, bc.g, bc.b, 40)) {
        cD = 0;
        cT = 0;
        cO = 0;
        lD = t;
      } else if (k8TvN2xP(p.r, p.g, p.b)) {
        cT = 0;
        cO = 0;
        if (++cD >= 2) {
          let eT = lD;
          if (sInc > 1) {
            const mx = Math.round(ox + (t - 1) * cos),
              my = Math.round(oy + (t - 1) * sin);
            if (mx > 0 && mx < w - 1 && my > 0 && my < h - 1) {
              const mp = y4WnS8tM(b, w, h, isGl, mx, my);
              if (!k8TvN2xP(mp.r, mp.g, mp.b)) eT = t - 1;
            }
          }
          const prev = y4WnS8tM(
            b,
            w,
            h,
            isGl,
            Math.round(ox + eT * cos),
            Math.round(oy + eT * sin),
          );
          const cur = y4WnS8tM(
            b,
            w,
            h,
            isGl,
            Math.round(ox + (eT + 1) * cos),
            Math.round(oy + (eT + 1) * sin),
          );
          const pl = w3QzL7vK(prev.r, prev.g, prev.b),
            cl = w3QzL7vK(cur.r, cur.g, cur.b);
          const sub = Math.max(
            0,
            Math.min(1, Math.abs(pl - 35) / (Math.abs(pl - cl) + 1e-4)),
          );
          const d = eT + sub * 0.5;
          return d >= minD
            ? { x: ox + d * cos, y: oy + d * sin, hitType: "bg" }
            : null;
        }
      } else if (!wCell && x7TxP4nM(p.r, p.g, p.b)) {
        cD = 0;
        cO = 0;
        if (++cT > 24)
          return lD >= minD
            ? { x: ox + lD * cos, y: oy + lD * sin, hitType: "cell" }
            : null;
      } else {
        cD = 0;
        cT = 0;
        if (++cO >= 2 && t > cCut)
          return lD >= minD
            ? { x: ox + lD * cos, y: oy + lD * sin, hitType: "cell" }
            : null;
      }
    }
    return lD >= minD
      ? { x: ox + lD * cos, y: oy + lD * sin, hitType: "edge" }
      : null;
  }

  function c6RmN8kL(b, w, h, isGl, sx, sy, bc, maxD, sm) {
    const rR = z9TvS4xL(b, w, h, isGl, sx, sy, 1, 0, bc, maxD, sm);
    const rL = z9TvS4xL(b, w, h, isGl, sx, sy, -1, 0, bc, maxD, sm);
    const rD = z9TvS4xL(b, w, h, isGl, sx, sy, 0, 1, bc, maxD, sm);
    const rU = z9TvS4xL(b, w, h, isGl, sx, sy, 0, -1, bc, maxD, sm);
    const mx =
      rR && rL && rR.hitType !== "edge" && rL.hitType !== "edge"
        ? Math.round((rR.x + rL.x) * 0.5)
        : sx;
    const my =
      rD && rU && rD.hitType !== "edge" && rU.hitType !== "edge"
        ? Math.round((rD.y + rU.y) * 0.5)
        : sy;
    if (mx >= 0 && mx < w && my >= 0 && my < h) {
      const p = y4WnS8tM(b, w, h, isGl, mx, my);
      if (
        b4WpL9sT(p.r, p.g, p.b, bc.r, bc.g, bc.b, 40) ||
        x7TxP4nM(p.r, p.g, p.b)
      )
        return { x: mx, y: my };
    }
    return { x: sx, y: sy };
  }

  const n8Rc = new Float64Array(64),
    n8Rs = new Float64Array(64);
  for (let i = 0; i < 64; i++) {
    const a = (i * Math.PI) / 32;
    n8Rc[i] = Math.cos(a);
    n8Rs[i] = Math.sin(a);
  }
  function f9FrW(rays) {
    let minH = Infinity,
      maxH = 0,
      vA = 0;
    for (let a = 0; a < 32; a++) {
      const ux = n8Rc[a],
        uy = n8Rs[a];
      if (
        rays.some(
          (r) => r.hitType !== "bg" && Math.abs(r.dx * ux + r.dy * uy) > 0.96,
        )
      )
        continue;
      let minP = Infinity,
        maxP = -Infinity,
        minT = "",
        maxT = "";
      for (const r of rays) {
        const p = r.x * ux + r.y * uy;
        if (p < minP) {
          minP = p;
          minT = r.hitType;
        }
        if (p > maxP) {
          maxP = p;
          maxT = r.hitType;
        }
      }
      if (minT === "bg" && maxT === "bg" && maxP > minP) {
        const hw = (maxP - minP) * 0.5;
        minH = Math.min(minH, hw);
        maxH = Math.max(maxH, hw);
        vA++;
      }
    }
    return { minHalf: vA ? minH : 0, maxHalf: maxH, validAxes: vA };
  }

  function q4WnM8sT(b, w, h, isGl, cx, cy, r, bc, zm, oX, oY) {
    if (r < 26 || !Number.isFinite(r)) return null;
    const pts = [],
      wCell = x7TxP4nM(bc.r, bc.g, bc.b);
    let minX = Infinity,
      minY = Infinity,
      maxX = -1,
      maxY = -1;
    for (let ray = 0; ray < 32; ray++) {
      const ang = (ray * Math.PI) / 16;
      for (const [ring, fr] of [
        [0, 0.965],
        [1, 0.985],
      ]) {
        const x = Math.round(cx + r * fr * Math.cos(ang)),
          y = Math.round(cy + r * fr * Math.sin(ang));
        if (x < 1 || x >= w - 1 || y < 1 || y >= h - 1) continue;
        const p = y4WnS8tM(b, w, h, isGl, x, y);
        if (
          !k8TvN2xP(p.r, p.g, p.b) &&
          (wCell || !x7TxP4nM(p.r, p.g, p.b)) &&
          b4WpL9sT(p.r, p.g, p.b, bc.r, bc.g, bc.b, 50)
        ) {
          const gx = x + oX,
            gy = y + oY;
          pts.push({ x: gx, y: gy, octant: ray >> 2, ring });
          minX = Math.min(minX, gx);
          minY = Math.min(minY, gy);
          maxX = Math.max(maxX, gx);
          maxY = Math.max(maxY, gy);
        }
      }
    }
    if (pts.length < 22) return null;
    const cr = [];
    for (const [dx, dy] of [
      [0, 0],
      [0.35, 0],
      [-0.35, 0],
      [0, 0.35],
      [0, -0.35],
    ]) {
      const x = Math.round(cx + dx * r),
        y = Math.round(cy + dy * r);
      if (x >= 0 && x < w && y >= 0 && y < h) {
        const gx = x + oX,
          gy = y + oY;
        cr.push({ x: gx, y: gy });
        minX = Math.min(minX, gx);
        minY = Math.min(minY, gy);
        maxX = Math.max(maxX, gx);
        maxY = Math.max(maxY, gy);
      }
    }
    if (cr.length < 3) return null;
    return { points: pts, core: cr, zoom: zm, minX, minY, maxX, maxY };
  }

  function d8QzL2vP(b, w, h, isGl, zm, oX, oY) {
    const pb = z8PxL2sT;
    if (!pb || pb.points.length < 22 || Math.abs(zm / pb.zoom - 1) > 0.008)
      return false;
    let elIn = 0,
      elOut = 0,
      rvIn = 0,
      rvOut = 0,
      octs = 0;
    for (const q of pb.points) {
      if (q.ring === 0) elIn++;
      else elOut++;
      const p = y4WnS8tM(b, w, h, isGl, q.x - oX, q.y - oY);
      if (k8TvN2xP(p.r, p.g, p.b)) {
        if (q.ring === 0) rvIn++;
        else rvOut++;
        octs |= 1 << q.octant;
      }
    }
    if (
      elIn < 10 ||
      elOut < 10 ||
      rvIn < Math.max(4, Math.ceil(elIn * 0.25)) ||
      rvOut < Math.max(7, Math.ceil(elOut * 0.45))
    )
      return false;
    let sp = 0,
      opp = 0;
    for (let i = 0; i < 8; i++) sp += (octs >> i) & 1;
    for (let i = 0; i < 4; i++)
      if ((octs >> i) & 1 && (octs >> (i + 4)) & 1) opp++;
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
    if (!q || q.minX < 0 || q.minY < 0 || q.maxX >= cW || q.maxY >= cH)
      return null;
    let minX = q.minX,
      minY = q.minY,
      maxX = q.maxX,
      maxY = q.maxY;
    if (exp) {
      const rc = Math.ceil(f8WnK3xL.rawR * 1.24 + 20);
      minX = Math.max(0, Math.min(minX, Math.floor(f8WnK3xL.rawCx - rc)));
      minY = Math.max(0, Math.min(minY, Math.floor(f8WnK3xL.rawCy - rc)));
      maxX = Math.min(cW - 1, Math.max(maxX, Math.ceil(f8WnK3xL.rawCx + rc)));
      maxY = Math.min(cH - 1, Math.max(maxY, Math.ceil(f8WnK3xL.rawCy + rc)));
    }
    const width = maxX - minX + 1,
      height = maxY - minY + 1;
    if (width < 4 || height < 4) return null;
    if (gl) {
      const by = width * height * 4;
      if (!d3VwN8mT || h9TnK4xL < by) {
        d3VwN8mT = new Uint8Array(by);
        h9TnK4xL = by;
      }
      gl.readPixels(
        minX,
        cH - minY - height,
        width,
        height,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        d3VwN8mT,
      );
      return { data: d3VwN8mT, x: minX, y: minY, width, height };
    }
    return ctx2d
      ? {
          data: ctx2d.getImageData(minX, minY, width, height).data,
          x: minX,
          y: minY,
          width,
          height,
        }
      : null;
  }

  function p3WnK7vT(force) {
    if (!q9EnvOk || m9TvL2sP.revMethod === "ws") return;
    if (!f5TxL9wK && !force) return;
    const cv = t8VwM4xK();
    if (!cv || cv.width === 0 || cv.height === 0) {
      if (!f5TxL9wK) f8WnK3xL.locked = false;
      return;
    }
    const cw = cv.width,
      ch = cv.height;
    const { gl, ctx2d } = x4TvL8wP(cv);
    const isGl = Boolean(gl),
      rawZm = k3WnL8vR();
    const fZ =
      f5TxL9wK && lockBaseZm > 0 && Math.abs(rawZm / lockBaseZm - 1) < 0.008
        ? lockBaseZm
        : rawZm;
    const zSt = z8PxL2sT && Math.abs(fZ / z8PxL2sT.zoom - 1) <= 0.015;
    const nw = performance.now();
    const spSh = f8WnK3xL.locked
      ? Math.hypot(f8WnK3xL.vx || 0, f8WnK3xL.vy || 0) *
        (nw - f8WnK3xL.lastTimestamp)
      : 0;
    let fDue =
      Boolean(force) ||
      !f5TxL9wK ||
      !zSt ||
      nw - p6XvQ2wM >= 35 ||
      (f8WnK3xL.locked && spSh >= Math.max(3, f8WnK3xL.rawR * 0.03));
    let lReg = null;

    if (f5TxL9wK && f8WnK3xL.locked && zSt) {
      lReg = h5TxM9wL(gl, ctx2d, cw, ch, fDue);
      if (
        lReg &&
        d8QzL2vP(lReg.data, lReg.width, lReg.height, isGl, fZ, lReg.x, lReg.y)
      ) {
        h8WpM2vQ();
        return;
      }
    }

    if (f5TxL9wK && z2TvM8sP()) {
      q2WnS7xM(true);
      return;
    }
    if (!fDue) return;
    p6XvQ2wM = nw;

    const rc = cv.getBoundingClientRect();
    const cxX = (t2QnL9wP - rc.left) * (cw / rc.width),
      cxY = (b8VmK3xT - rc.top) * (ch / rc.height);
    let oX = cxX,
      oY = cxY;

    if (f5TxL9wK && f8WnK3xL.locked) {
      const predDt = Math.min(35, Math.max(0, nw - f8WnK3xL.lastTimestamp));
      const maxShift = Math.max(4, f8WnK3xL.rawR * 0.45);
      oX =
        f8WnK3xL.cx +
        Math.max(-maxShift, Math.min(maxShift, (f8WnK3xL.vx || 0) * predDt));
      oY =
        f8WnK3xL.cy +
        Math.max(-maxShift, Math.min(maxShift, (f8WnK3xL.vy || 0) * predDt));
    }

    let scX = 0,
      scY = 0,
      scW = cw,
      scH = ch,
      buf;
    if (lReg && lReg.width >= 32) {
      scX = lReg.x;
      scY = lReg.y;
      scW = lReg.width;
      scH = lReg.height;
      buf = lReg.data;
    } else {
      const roiR = f8WnK3xL.locked
        ? Math.max(80, Math.ceil(f8WnK3xL.rawR * 1.24 + 24))
        : 420;
      scX = Math.max(0, Math.min(cw - 1, Math.floor(oX - roiR)));
      scY = Math.max(0, Math.min(ch - 1, Math.floor(oY - roiR)));
      scW = Math.max(1, Math.min(cw - scX, Math.ceil(roiR * 2)));
      scH = Math.max(1, Math.min(ch - scY, Math.ceil(roiR * 2)));
      buf = p9TvM4sL(scW, scH);

      if (gl)
        gl.readPixels(
          scX,
          ch - scY - scH,
          scW,
          scH,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          buf,
        );
      else if (ctx2d) buf.set(ctx2d.getImageData(scX, scY, scW, scH).data);
      else {
        if (!f5TxL9wK) f8WnK3xL.locked = false;
        return;
      }
    }

    const lOX = oX - scX,
      lOY = oY - scY;
    if (lOX < 0 || lOX >= scW || lOY < 0 || lOY >= scH) {
      if (f5TxL9wK) q2WnS7xM(true);
      return;
    }
    const sd = v2WzL7tM(
      buf,
      scW,
      scH,
      isGl,
      lOX,
      lOY,
      f5TxL9wK ? f8WnK3xL.color : null,
      f8WnK3xL.locked ? f8WnK3xL.rawR * 0.85 : 14,
    );
    if (!sd) {
      if (f8WnK3xL.locked && f8WnK3xL.misses < (f5TxL9wK ? 8 : 2))
        f8WnK3xL.misses++;
      else q2WnS7xM(true);
      return;
    }

    const bC = sd.color;
    const mDist = Math.hypot(scW, scH);
    const smMode = !f5TxL9wK || f8WnK3xL.rawR < 20;
    const ctr = f5TxL9wK
      ? c6RmN8kL(buf, scW, scH, isGl, sd.x, sd.y, bC, mDist, smMode)
      : { x: sd.x, y: sd.y };
    const rays = [],
      bgPts = [],
      cirPts = [];
    let octMask = 0;
    for (let i = 0; i < 64; i++) {
      const pt = z9TvS4xL(
        buf,
        scW,
        scH,
        isGl,
        ctr.x,
        ctr.y,
        n8Rc[i],
        n8Rs[i],
        bC,
        mDist,
        smMode,
      );
      if (pt) {
        const q = {
          x: pt.x,
          y: pt.y,
          dx: n8Rc[i],
          dy: n8Rs[i],
          hitType: pt.hitType,
        };
        rays.push(q);
        if (pt.hitType !== "edge") cirPts.push(q);
        if (pt.hitType === "bg") {
          bgPts.push(q);
          octMask |= 1 << (i >> 3);
        }
      }
    }
    let octCount = 0;
    for (let i = 0; i < 8; i++) octCount += (octMask >> i) & 1;
    const fitPts = bgPts.length >= 12 && octCount >= 3 ? bgPts : cirPts;
    const cnt = fitPts.length;
    if (cnt < 5) {
      if (f8WnK3xL.locked && f8WnK3xL.misses < (f5TxL9wK ? 8 : 2))
        f8WnK3xL.misses++;
      else q2WnS7xM(true);
      return;
    }

    let bCirc = null,
      bSc = -1;
    for (let it = 0; it < 36; it++) {
      const i1 = (Math.random() * cnt) | 0,
        i2 = (Math.random() * cnt) | 0,
        i3 = (Math.random() * cnt) | 0;
      if (i1 === i2 || i1 === i3 || i2 === i3) continue;
      const p1 = fitPts[i1],
        p2 = fitPts[i2],
        p3 = fitPts[i3];
      if (
        Math.hypot(p1.x - p2.x, p1.y - p2.y) < 1.5 ||
        Math.hypot(p2.x - p3.x, p2.y - p3.y) < 1.5 ||
        Math.hypot(p3.x - p1.x, p3.y - p1.y) < 1.5
      )
        continue;
      const cd = r7QnM3vL(p1, p2, p3);
      if (!cd || cd.r < 2.0 || cd.r > 3200) continue;
      const tl = Math.max(1.5, cd.r * 0.045);
      let inls = 0;
      for (let j = 0; j < cnt; j++) {
        if (
          Math.abs(
            Math.hypot(fitPts[j].x - cd.cx, fitPts[j].y - cd.cy) - cd.r,
          ) <= tl
        )
          inls++;
      }
      let cSc = inls;
      if (f5TxL9wK && f8WnK3xL.locked) {
        const pR = f8WnK3xL.rawR,
          rD = (cd.r - pR) / Math.max(1.0, pR);
        const pO =
          Math.hypot(
            cd.cx + scX - f8WnK3xL.rawCx,
            cd.cy + scY - f8WnK3xL.rawCy,
          ) / Math.max(1.0, pR);
        cSc =
          rD > 0.65 || pO > 1.4
            ? cSc * 0.12
            : cSc * (1.0 - Math.max(0, rD) * 0.3);
      }
      if (cSc > bSc) {
        bSc = cSc;
        bCirc = cd;
      }
    }
    if (!bCirc || bSc < Math.max(4, Math.floor(cnt * 0.18))) {
      if (f8WnK3xL.locked && f8WnK3xL.misses < (f5TxL9wK ? 8 : 2))
        f8WnK3xL.misses++;
      else q2WnS7xM(true);
      return;
    }
    const cns = [],
      fTl = Math.max(1.5, bCirc.r * 0.045);
    for (let j = 0; j < cnt; j++) {
      if (
        Math.abs(
          Math.hypot(fitPts[j].x - bCirc.cx, fitPts[j].y - bCirc.cy) - bCirc.r,
        ) <= fTl
      )
        cns.push(fitPts[j]);
    }
    const ref = m5TxK8wP(cns, bCirc);
    ref.cx += scX;
    ref.cy += scY;
    if (
      !f5TxL9wK &&
      Math.hypot(cxX - ref.cx, cxY - ref.cy) > ref.r * 1.12 + 10
    ) {
      f8WnK3xL.locked = false;
      return;
    }
    const cZm = fZ;
    const cWR = ref.r / Math.max(0.01, cZm);
    let errSum = 0;
    for (const p of cns)
      errSum += Math.abs(
        Math.hypot(p.x - (ref.cx - scX), p.y - (ref.cy - scY)) - ref.r,
      );
    const meanErr = cns.length ? errSum / cns.length : 999;
    const cleanArc =
      bgPts.length >= 10 &&
      (octCount >= 4 ||
        (octCount >= 3 &&
          cns.length >= 10 &&
          meanErr <= Math.max(2, ref.r * 0.025)));
    f8WnK3xL.worldR = cWR;
    if (f5TxL9wK) {
      const dtSec = Math.min(
        0.1,
        Math.max(0.001, (nw - f8WnK3xL.lastTimestamp) * 0.001),
      );
      const relX = (ref.cx - cw * 0.5) / Math.max(0.01, cZm),
        relY = (ref.cy - ch * 0.5) / Math.max(0.01, cZm);
      const feret = f9FrW(rays),
        minHW = feret.minHalf / Math.max(0.01, cZm),
        maxHW = feret.maxHalf / Math.max(0.01, cZm);
      const aspect = feret.validAxes >= 4 && minHW > 0 ? maxHW / minHW : 1;
      const pxTol = 3 / Math.max(0.01, cZm);
      if (cleanArc && cWR <= v4QnK9wL * 0.8 && cWR <= v4QnK9wL - pxTol) {
        h8WpM2vQ();
        return;
      }
      if (
        ((feret.validAxes >= 2 && minHW <= v4QnK9wL * 0.77) ||
          (feret.validAxes >= 1 &&
            minHW <= v4QnK9wL * 0.75 &&
            cWR <= v4QnK9wL * 0.82)) &&
        minHW <= v4QnK9wL - pxTol
      ) {
        h8WpM2vQ();
        return;
      }
      if (
        feret.validAxes >= 5 &&
        aspect >= 1.24 &&
        minHW <= v4QnK9wL * 0.84 &&
        minHW <= v4QnK9wL - pxTol
      ) {
        h8WpM2vQ();
        return;
      }
      if (
        cleanArc &&
        aspect < 1.15 &&
        cWR > v4QnK9wL &&
        cWR <= v4QnK9wL * 1.45
      ) {
        v4QnK9wL = cWR;
      }
      if (m2WpT7vX) {
        if (
          Math.hypot(relX - b9VxL3sQ, relY - r4QnM8tL) >=
            Math.max(12.0, v4QnK9wL * 0.22) &&
          cWR <= v4QnK9wL * 0.9
        ) {
          h8WpM2vQ();
          return;
        }
      }
      b9VxL3sQ = relX;
      r4QnM8tL = relY;
      m2WpT7vX = true;
      if (
        cleanArc &&
        aspect < 1.15 &&
        cWR > v4QnK9wL * 0.9 &&
        cWR <= v4QnK9wL
      ) {
        const maxDecay = v4QnK9wL * Math.min(0.02, dtSec * 0.12);
        v4QnK9wL = Math.max(cWR, v4QnK9wL - maxDecay);
      }
    }
    const dt = Math.max(1, nw - f8WnK3xL.lastTimestamp);
    f8WnK3xL.lastTimestamp = nw;
    if (f8WnK3xL.locked) {
      f8WnK3xL.cx = ref.cx;
      f8WnK3xL.cy = ref.cy;
      f8WnK3xL.r = ref.r;
      if (dt >= 6) {
        f8WnK3xL.vx =
          ((ref.cx - f8WnK3xL.rawCx) / dt) * 0.65 + (f8WnK3xL.vx || 0) * 0.35;
        f8WnK3xL.vy =
          ((ref.cy - f8WnK3xL.rawCy) / dt) * 0.65 + (f8WnK3xL.vy || 0) * 0.35;
      }
    } else {
      f8WnK3xL.locked = true;
      f8WnK3xL.cx = ref.cx;
      f8WnK3xL.cy = ref.cy;
      f8WnK3xL.r = ref.r;
      f8WnK3xL.vx = 0;
      f8WnK3xL.vy = 0;
    }
    f8WnK3xL.rawCx = ref.cx;
    f8WnK3xL.rawCy = ref.cy;
    f8WnK3xL.rawR = ref.r;
    f8WnK3xL.misses = 0;
    f8WnK3xL.color = bC;
    z8PxL2sT = q4WnM8sT(
      buf,
      scW,
      scH,
      isGl,
      ref.cx - scX,
      ref.cy - scY,
      ref.r,
      bC,
      cZm,
      scX,
      scY,
    );
  }

  const y8QzL4sM = document.createElement("canvas");
  y8QzL4sM.id = "autorev-overlay";
  const w4TvN8wL = y8QzL4sM.getContext("2d");
  y8QzL4sM.style.cssText =
    "position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:2147483647;";

  function k7WpL2vT() {
    y8QzL4sM.width = window.innerWidth;
    y8QzL4sM.height = window.innerHeight;
  }
  window.addEventListener("resize", k7WpL2vT, { passive: true });
  k7WpL2vT();
  document.body
    ? document.body.appendChild(y8QzL4sM)
    : window.addEventListener("DOMContentLoaded", () =>
        document.body.appendChild(y8QzL4sM),
      );

  let b3QnS9xM = performance.now();
  let o4Drty = false;

  function m4WnL7sT() {
    const nw = performance.now();
    v4StepInterp(nw);
    if (v9TxtOn()) w3TickTxt();
    b6RenderFrame();
    if ((!r8QnS4mT || nw - w2VpL9xK > 40) && !b5TxM1wP) {
      b5TxM1wP = true;
      try {
        j8PnL4wV++;
        p3WnK7vT();
      } finally {
        b5TxM1wP = false;
      }
    }
    if (o4Drty) {
      w4TvN8wL.clearRect(0, 0, y8QzL4sM.width, y8QzL4sM.height);
      o4Drty = false;
    }
    const dlt = Math.min(50, Math.max(1, nw - b3QnS9xM));
    b3QnS9xM = nw;
    const dtSec = dlt * 0.001;
    const sm = 1 - Math.exp(-26 * dtSec);
    const midX = y8QzL4sM.width * 0.5,
      midY = y8QzL4sM.height * 0.5;

    if (m9TvL2sP.revMethod === "ws" && v4WsLock) {
      if (k2WsDead()) {
        q2WnS7xM(true);
      } else {
        const cur = w4ReadLocked();
        if (!cur) {
          q2WnS7xM(true);
        } else {
          x5QzL2wT.alpha +=
            (1.0 - x5QzL2wT.alpha) * (1 - Math.exp(-18 * dtSec));
          x5QzL2wT.pop += (1.0 - x5QzL2wT.pop) * (1 - Math.exp(-14 * dtSec));
          x5QzL2wT.active = true;
          x5QzL2wT.isVp = true;
          x5QzL2wT.cx = cur.cx;
          x5QzL2wT.cy = cur.cy;
          x5QzL2wT.r = cur.r;
        }
      }
    }

    if (f5TxL9wK && f8WnK3xL.locked) {
      x5QzL2wT.isVp = false;
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
    } else if (!(m9TvL2sP.revMethod === "ws" && v4WsLock) && x5QzL2wT.active) {
      x5QzL2wT.alpha *= Math.exp(-15 * dtSec);
      x5QzL2wT.pop += (1.06 - x5QzL2wT.pop) * (1 - Math.exp(-10 * dtSec));
      if (x5QzL2wT.alpha < 0.01) {
        x5QzL2wT.active = false;
        x5QzL2wT.isVp = false;
        x5QzL2wT.alpha = 0;
      }
    }

    if (v4FfLock) {
      if (k2WsDead() || !v4WsCells.has(v4FfLock.cellId)) {
        k4FfCancel(true);
      } else {
        const curFf = w4ReadFfLocked();
        if (curFf) {
          v4FfVis.alpha += (1.0 - v4FfVis.alpha) * (1 - Math.exp(-18 * dtSec));
          v4FfVis.pop += (1.0 - v4FfVis.pop) * (1 - Math.exp(-14 * dtSec));
          v4FfVis.active = true;
          v4FfVis.cx = curFf.cx;
          v4FfVis.cy = curFf.cy;
          v4FfVis.r = curFf.r;
        }
      }
    } else if (v4FfVis.active) {
      v4FfVis.alpha *= Math.exp(-15 * dtSec);
      v4FfVis.pop += (1.06 - v4FfVis.pop) * (1 - Math.exp(-10 * dtSec));
      if (v4FfVis.alpha < 0.01) {
        v4FfVis.active = false;
        v4FfVis.alpha = 0;
      }
    }

    const revOn = x5QzL2wT.active && x5QzL2wT.alpha > 0.01;
    const ffOn = v4FfVis.active && v4FfVis.alpha > 0.01;
    if (!revOn && !ffOn) {
      k9LwP2xM(m4WnL7sT);
      return;
    }

    const pulse = 0.5 + 0.5 * Math.sin(nw * 0.006);

    function d4DrawTargetFx(gCv, tX, tY, tRad, a, isYellow) {
      const cRc = gCv.getBoundingClientRect();
      const grad = w4TvN8wL.createLinearGradient(midX, midY, tX, tY);
      if (isYellow) {
        grad.addColorStop(0, `rgba(255, 195, 20, ${0.18 * a})`);
        grad.addColorStop(0.6, `rgba(255, 215, 45, ${0.68 * a})`);
        grad.addColorStop(1, `rgba(255, 242, 130, ${0.98 * a})`);
      } else {
        grad.addColorStop(0, `rgba(0, 165, 255, ${0.14 * a})`);
        grad.addColorStop(0.6, `rgba(0, 215, 255, ${0.58 * a})`);
        grad.addColorStop(1, `rgba(130, 242, 255, ${0.95 * a})`);
      }

      o4Drty = true;
      w4TvN8wL.save();
      w4TvN8wL.beginPath();
      w4TvN8wL.moveTo(midX, midY);
      w4TvN8wL.lineTo(tX, tY);
      w4TvN8wL.strokeStyle = grad;
      w4TvN8wL.lineWidth = (isYellow ? 2.2 : 2.0) + 0.6 * a;
      w4TvN8wL.shadowColor = isYellow
        ? "rgba(255, 195, 25, 0.85)"
        : "rgba(0, 215, 255, 0.85)";
      w4TvN8wL.shadowBlur = 8 + 4 * pulse;
      w4TvN8wL.stroke();

      w4TvN8wL.beginPath();
      w4TvN8wL.arc(tX, tY, 6.2, 0, Math.PI * 2);
      w4TvN8wL.strokeStyle = isYellow
        ? `rgba(255, 215, 40, ${0.72 * a})`
        : `rgba(0, 225, 255, ${0.65 * a})`;
      w4TvN8wL.lineWidth = 1.4;
      w4TvN8wL.stroke();

      w4TvN8wL.beginPath();
      w4TvN8wL.arc(tX, tY, 2.8, 0, Math.PI * 2);
      w4TvN8wL.fillStyle = isYellow
        ? `rgba(255, 246, 175, ${0.96 * a})`
        : `rgba(180, 250, 255, ${0.95 * a})`;
      w4TvN8wL.fill();

      w4TvN8wL.beginPath();
      w4TvN8wL.rect(cRc.left, cRc.top, cRc.width, cRc.height);
      w4TvN8wL.clip();

      w4TvN8wL.beginPath();
      w4TvN8wL.arc(tX, tY, tRad, 0, Math.PI * 2);
      w4TvN8wL.strokeStyle = isYellow
        ? `rgba(255, 185, 20, ${0.3 * a})`
        : `rgba(0, 200, 255, ${0.28 * a})`;
      w4TvN8wL.lineWidth = 5.0;
      w4TvN8wL.shadowColor = isYellow ? "#FFC414" : "#00DCFF";
      w4TvN8wL.shadowBlur = 12 + 4 * pulse;
      w4TvN8wL.stroke();

      w4TvN8wL.shadowBlur = 0;
      w4TvN8wL.shadowColor = "transparent";

      w4TvN8wL.beginPath();
      w4TvN8wL.arc(tX, tY, tRad, 0, Math.PI * 2);
      w4TvN8wL.strokeStyle = isYellow
        ? `rgba(255, 224, 75, ${0.94 * a})`
        : `rgba(110, 240, 255, ${0.92 * a})`;
      w4TvN8wL.lineWidth = 1.8;
      w4TvN8wL.stroke();

      const outerR = tRad + Math.max(4, Math.min(12, tRad * 0.055));
      const rot1 = nw * (isYellow ? -0.0014 : 0.0014);
      const arcSpan = 0.72;
      w4TvN8wL.lineCap = "round";
      w4TvN8wL.lineWidth = 2.4;
      w4TvN8wL.strokeStyle = isYellow
        ? `rgba(255, 212, 45, ${(0.76 + 0.2 * pulse) * a})`
        : `rgba(0, 225, 255, ${(0.72 + 0.2 * pulse) * a})`;
      for (let i = 0; i < 4; i++) {
        const a0 = rot1 + i * Math.PI * 0.5 - arcSpan * 0.5;
        w4TvN8wL.beginPath();
        w4TvN8wL.arc(tX, tY, outerR, a0, a0 + arcSpan);
        w4TvN8wL.stroke();
      }

      if (tRad > 18) {
        const innerR = Math.max(
          6,
          tRad - Math.max(4, Math.min(10, tRad * 0.05)),
        );
        w4TvN8wL.save();
        w4TvN8wL.translate(tX, tY);
        w4TvN8wL.rotate(nw * (isYellow ? 0.0009 : -0.0009));
        w4TvN8wL.setLineDash([6, 8]);
        w4TvN8wL.beginPath();
        w4TvN8wL.arc(0, 0, innerR, 0, Math.PI * 2);
        w4TvN8wL.strokeStyle = isYellow
          ? `rgba(255, 240, 150, ${0.42 * a})`
          : `rgba(155, 245, 255, ${0.38 * a})`;
        w4TvN8wL.lineWidth = 1.2;
        w4TvN8wL.stroke();
        w4TvN8wL.restore();
      }

      w4TvN8wL.restore();
    }

    if (revOn) {
      const gCv = (x5QzL2wT.isVp && b6GameCanvas()) || t8VwM4xK();
      if (gCv) {
        let tX, tY, tRad;
        if (x5QzL2wT.isVp) {
          tX = x5QzL2wT.cx;
          tY = x5QzL2wT.cy;
          tRad = Math.max(6, x5QzL2wT.r * x5QzL2wT.pop);
        } else {
          const cRc = gCv.getBoundingClientRect();
          const scX = cRc.width / gCv.width,
            scY = cRc.height / gCv.height;
          const zm = k3WnL8vR();
          tX = cRc.left + x5QzL2wT.cx * scX;
          tY = cRc.top + x5QzL2wT.cy * scY;
          tRad = Math.max(
            6,
            x5QzL2wT.worldR * zm * ((scX + scY) * 0.5) * x5QzL2wT.pop,
          );
        }
        d4DrawTargetFx(gCv, tX, tY, tRad, x5QzL2wT.alpha, false);
      }
    }

    if (ffOn) {
      const gCv = b6GameCanvas();
      if (gCv) {
        d4DrawTargetFx(
          gCv,
          v4FfVis.cx,
          v4FfVis.cy,
          Math.max(6, v4FfVis.r * v4FfVis.pop),
          v4FfVis.alpha,
          true,
        );
      }
    }

    k9LwP2xM(m4WnL7sT);
  }
  k9LwP2xM(m4WnL7sT);

  let v7QzP2wM = null,
    z3TvL8xP = 0;

  function s7PzR(n) {
    const pl = g2BindTbl.plans[n] || {
      kc: g2BindTbl.sp > 0 ? g2BindTbl.sp : 32,
      n: n,
    };
    w5PzR8tM(pl.kc, pl.n);
  }

  let b9TxK4mP = false;
  const c6RmP3xW = new Set();
  let q9EnvOk = 0;

  let r9RevNotFn = null,
    r9RevNotClr = null;

  function q8WnM4tL(c) {
    if (!q9EnvOk) return;
    if (!c) return;
    if (
      m9TvL2sP.keyRevLock === m9TvL2sP.keyRevUnlock &&
      c === m9TvL2sP.keyRevLock
    ) {
      d4TxN8wL();
      return;
    }
    if (c === m9TvL2sP.keyRevLock) {
      if (f5TxL9wK || f8WnK3xL.locked || v4WsLock) q2WnS7xM(true);
      g9PxL3vT();
      return;
    }
    if (c === m9TvL2sP.keyRevUnlock) {
      q2WnS7xM(true);
      return;
    }
    if (m9TvL2sP.ffMethod === "auto") {
      if (
        m9TvL2sP.keyFfLock &&
        m9TvL2sP.keyFfLock === m9TvL2sP.keyFfActivate &&
        c === m9TvL2sP.keyFfLock
      ) {
        if (v4FfAuto || b9TxK4mP || k4MbBusy || k2WsDead()) return;
        const t = w4FindFfTarget(t2QnL9wP, b8VmK3xT);
        if (!t) return;
        v4FfLock = {
          cellId: t.cellId,
          ownerId: t.oid,
          model: t.model,
          node: t.node,
        };
        v4FfVis.active = true;
        v4FfVis.cx = t.cx;
        v4FfVis.cy = t.cy;
        v4FfVis.r = t.r;
        v4FfVis.alpha = 0;
        v4FfVis.pop = 1.22;
        k4FfStart(true);
        return;
      }
      if (m9TvL2sP.keyFfLock && c === m9TvL2sP.keyFfLock) {
        if (v4FfLock) {
          k4FfCancel(true);
        } else if (!k2WsDead()) {
          const t = w4FindFfTarget(t2QnL9wP, b8VmK3xT);
          if (t) {
            v4FfLock = {
              cellId: t.cellId,
              ownerId: t.oid,
              model: t.model,
              node: t.node,
            };
            v4FfVis.active = true;
            v4FfVis.cx = t.cx;
            v4FfVis.cy = t.cy;
            v4FfVis.r = t.r;
            v4FfVis.alpha = 0;
            v4FfVis.pop = 1.22;
          }
        }
        return;
      }
      if (m9TvL2sP.keyFfActivate && c === m9TvL2sP.keyFfActivate) {
        if (v4FfLock && v4WsCells.has(v4FfLock.cellId)) k4FfStart(false);
        return;
      }
    } else {
      if (c === m9TvL2sP.keyAuto) {
        if (b9TxK4mP || k4MbBusy) return;
        b9TxK4mP = true;
        k4MbFastFeed(m9TvL2sP.autoDelay, () => {
          b9TxK4mP = false;
        });
        return;
      }
      if (Array.isArray(m9TvL2sP.extraFastFeeds)) {
        for (let i = 0; i < m9TvL2sP.extraFastFeeds.length; i++) {
          const ff = m9TvL2sP.extraFastFeeds[i];
          if (ff && ff.key === c) {
            if (c6RmP3xW.has(ff) || k4MbBusy) return;
            c6RmP3xW.add(ff);
            k4MbFastFeed(ff.delay, () => {
              c6RmP3xW.delete(ff);
            });
            return;
          }
        }
      }
    }
    const rB = [2, 4, 8, 16, 32, 64, 128, 256];
    for (let i = 1; i <= 8; i++) {
      if (m9TvL2sP["keyRevSplit" + i] === c) {
        m9TvL2sP.revSplits = rB[i - 1];
        k6RebuildPlans();
        x3QnK8wR();
        r8QnM4tL();
        if (r9RevNotFn) r9RevNotFn(m9TvL2sP.revSplits);
        return;
      }
    }
    const tK = [
      "keyT2",
      "keyT4",
      "keyT8",
      "keyT16",
      "keyT32",
      "keyT64",
      "keyT128",
      "keyT256",
    ];
    for (let i = 0; i < tK.length; i++) {
      if (m9TvL2sP[tK[i]] === c) {
        if (m9TvL2sP.soloFocus === "multibox") {
          if (m4IsMbOn()) k4MbTrick(i + 1);
          else s7PzR(i + 1);
          return;
        }
        q5RzL9wK.postMessage({
          type: "EXECUTE_BACKGROUND_SPLIT_STEP",
          senderId: v8WpM2tL,
        });
        s7PzR(i + 1);
        n7KwQ2vL(m9TvL2sP.soloDelay, () => {
          if (m9TvL2sP.soloFocus !== "window") return;
          q5RzL9wK.postMessage({
            type: "EXECUTE_BACKGROUND_SPLIT_STEP",
            senderId: v8WpM2tL,
          });
        });
        return;
      }
    }
  }

  function d5TxL2wV(c) {
    if (!c) return false;
    if (m9TvL2sP.ffMethod === "auto") {
      if (c === m9TvL2sP.keyFfLock || c === m9TvL2sP.keyFfActivate) return true;
    } else {
      if (c === m9TvL2sP.keyAuto) return true;
      if (
        Array.isArray(m9TvL2sP.extraFastFeeds) &&
        m9TvL2sP.extraFastFeeds.some((f) => f && f.key === c)
      )
        return true;
    }
    return (
      c === m9TvL2sP.keyT2 ||
      c === m9TvL2sP.keyT4 ||
      c === m9TvL2sP.keyT8 ||
      c === m9TvL2sP.keyT16 ||
      c === m9TvL2sP.keyT32 ||
      c === m9TvL2sP.keyT64 ||
      c === m9TvL2sP.keyT128 ||
      c === m9TvL2sP.keyT256 ||
      c === m9TvL2sP.keyRevLock ||
      c === m9TvL2sP.keyRevUnlock ||
      c === m9TvL2sP.keyRevSplit1 ||
      c === m9TvL2sP.keyRevSplit2 ||
      c === m9TvL2sP.keyRevSplit3 ||
      c === m9TvL2sP.keyRevSplit4 ||
      c === m9TvL2sP.keyRevSplit5 ||
      c === m9TvL2sP.keyRevSplit6 ||
      c === m9TvL2sP.keyRevSplit7 ||
      c === m9TvL2sP.keyRevSplit8
    );
  }

  function qM7wK2vP(el) {
    const vpW = document.documentElement.clientWidth || window.innerWidth;
    const vpH = document.documentElement.clientHeight || window.innerHeight;
    const r = el.getBoundingClientRect();
    const tT = r.top <= 6,
      tB = r.bottom >= vpH - 6;
    const tL = r.left <= 6,
      tR = el.style.right === "0px" || r.right >= vpW - 6;
    el.style.borderTop = tT ? "none" : "1px solid var(--macro-border, #333)";
    el.style.borderBottom = tB ? "none" : "1px solid var(--macro-border, #333)";
    el.style.borderLeft = tL ? "none" : "1px solid var(--macro-border, #333)";
    el.style.borderRight = tR ? "none" : "1px solid var(--macro-border, #333)";
    el.style.borderRadius = `${tT || tL ? "0" : "8px"} ${tT || tR ? "0" : "8px"} ${tB || tR ? "0" : "8px"} ${tB || tL ? "0" : "8px"}`;
  }

  let k4RnP9wT = 1;
  let b7QmX2vN = "";
  let s2NpK7wL = null;
  let g3VxL8mQ = ["255,255,255", "225,225,225", "185,185,185"];

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
    const fz = m9TvL2sP.syncScale ? (12 * sc).toFixed(2) + "px" : "";
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
    const mnW = Math.min(280, vpW),
      mnH = Math.min(320, vpH);
    const w = Math.max(mnW, Math.min(vpW, tW));
    const h = Math.max(mnH, Math.min(vpH, tH));
    el.style.minWidth = mnW + "px";
    el.style.minHeight = mnH + "px";
    el.style.width = w + "px";
    el.style.height = h + "px";
    q6VxM4tN(el, w, h);
    const mxL = Math.max(0, vpW - w),
      mxT = Math.max(0, vpH - h);
    const r = el.getBoundingClientRect();
    const curL = Number.parseFloat(el.style.left),
      curT = Number.parseFloat(el.style.top);
    const baseL =
      el.style.right === "0px" ? mxL : Number.isFinite(curL) ? curL : r.left;
    const nL = Math.max(0, Math.min(mxL, baseL));
    const nT = Math.max(0, Math.min(mxT, Number.isFinite(curT) ? curT : r.top));
    if (nL >= mxL - 10) {
      el.style.left = "auto";
      el.style.right = "0px";
      if (vpW >= 280) m9TvL2sP.winX = mxL;
    } else {
      el.style.left = nL + "px";
      el.style.right = "auto";
      if (vpW >= 280) m9TvL2sP.winX = nL;
    }
    el.style.top = nT + "px";
    el.style.bottom = "auto";
    if (vpH >= 320) m9TvL2sP.winY = nT;
    qM7wK2vP(el);
    if (vpW >= 280 && vpH >= 320) x3QnK8wR();
  }

  function h2QzP8sT() {
    const wn = document.getElementById("macro-window");
    if (wn) {
      wn.classList.toggle("open");
      if (wn.classList.contains("open")) f4KzP9wL(wn);
      else {
        if (g4PopClsFn) g4PopClsFn();
        if (
          document.activeElement &&
          wn.contains(document.activeElement) &&
          document.activeElement.blur
        )
          document.activeElement.blur();
        const cv = t8VwM4xK();
        if (cv && cv.focus) cv.focus();
      }
    }
  }

  function m6BwL4sK(e) {
    const cd = e.code || e.key || "";
    if (!cd) return false;
    if (e.ctrlKey && !cd.startsWith("Control")) return false;
    if (e.altKey && !cd.startsWith("Alt")) return false;
    if (e.metaKey && !cd.startsWith("Meta")) return false;
    return true;
  }

  window.addEventListener(
    "mousemove",
    (e) => {
      if (!v9TxtOn() || w3DragSel) return;
      const nw = performance.now();
      if (
        nw - w3HoverMs < 24 &&
        Math.abs(e.clientX - w3HoverX) < 3 &&
        Math.abs(e.clientY - w3HoverY) < 3
      )
        return;
      w3HoverMs = nw;
      w3HoverX = e.clientX;
      w3HoverY = e.clientY;
      w3HoverTick(e.clientX, e.clientY);
    },
    true,
  );

  window.addEventListener(
    "selectstart",
    (e) => {
      if (!v9TxtOn() || w3IsUi(e.target)) return;
      b4AllowDef.add(e);
      e.stopImmediatePropagation();
    },
    true,
  );

  window.addEventListener(
    "copy",
    (e) => {
      if (!v9TxtOn() || w3IsUi(e.target) || w3IsEd(e.target)) return;
      const s = window.getSelection();
      if (s && !s.isCollapsed) {
        b4AllowDef.add(e);
        e.stopImmediatePropagation();
      }
    },
    true,
  );

  window.addEventListener(
    "keydown",
    (e) => {
      if (!v9TxtOn() || !e.isTrusted || w3IsUi(e.target) || w3IsEd(e.target))
        return;
      if (
        (e.ctrlKey || e.metaKey) &&
        !e.altKey &&
        (e.code === "KeyC" || (e.key || "").toLowerCase() === "c")
      ) {
        const s = window.getSelection();
        if (s && !s.isCollapsed) e.stopImmediatePropagation();
      }
    },
    true,
  );

  const w3PtrDown = (e) => {
    if (!v9TxtOn() || w3Fwded.has(e) || !e.isTrusted || w3IsUi(e.target))
      return;
    if (e.button === 2) {
      if (w3RmbTm) {
        clearTimeout(w3RmbTm);
        w3RmbTm = 0;
      }
      const hit = w3HitSel(e.clientX, e.clientY, e.target);
      w3RmbHit = hit;
      w3RmbTs = performance.now();
      if (hit) {
        w3SetBypass(false);
        b4AllowDef.add(e);
        e.stopImmediatePropagation();
        return;
      }
      const tg =
        e.target && e.target.nodeType === 1
          ? e.target
          : e.target && e.target.parentElement;
      if (
        tg &&
        tg.classList &&
        (tg.classList.contains("macro-cvs-txt") ||
          tg.classList.contains("macro-pe-txt"))
      ) {
        w3SetBypass(true);
        e.stopImmediatePropagation();
        w3FwdRmb(e);
      }
      return;
    }
    if (e.button === 0) {
      w3SetBypass(false);
      const tg =
        e.target && e.target.nodeType === 1
          ? e.target
          : e.target && e.target.parentElement;
      const isCvs = Boolean(
        tg && tg.classList && tg.classList.contains("macro-cvs-txt"),
      );
      const isCtrl = Boolean(
        tg &&
        tg.closest &&
        tg.closest(
          'button, a, select, input, textarea, [role="button"], .macro-resizer',
        ),
      );
      if (isCvs) {
        if (e.type === "mousedown") {
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
            if (
              p.parentElement === pr &&
              !p.classList.contains("macro-pe-txt")
            ) {
              p.classList.add("macro-pe-txt");
              w3PeDragGrp.push(p);
            }
          }
        }
        return;
      }
      if (e.type === "mousedown" && !isCtrl && !e.shiftKey) {
        const s = window.getSelection();
        if (s && !s.isCollapsed) s.removeAllRanges();
        w3ClearPe();
      }
    }
  };

  const w3PtrUp = (e) => {
    if (!v9TxtOn() || w3Fwded.has(e) || !e.isTrusted || w3IsUi(e.target))
      return;
    if (e.button === 2) {
      if (
        (w3RmbHit && performance.now() - w3RmbTs < 1500) ||
        w3HitSel(e.clientX, e.clientY, e.target)
      ) {
        b4AllowDef.add(e);
        e.stopImmediatePropagation();
      } else {
        if (w3BypTm) clearTimeout(w3BypTm);
        w3BypTm = setTimeout(() => w3SetBypass(false), 120);
      }
      return;
    }
    if (e.button === 0 && w3DragSel) {
      const tg =
        e.target && e.target.nodeType === 1
          ? e.target
          : e.target && e.target.parentElement;
      const isCvs = Boolean(
        tg && tg.classList && tg.classList.contains("macro-cvs-txt"),
      );
      if (w3DragCvs || isCvs) e.stopImmediatePropagation();
      if (e.type === "mouseup") {
        setTimeout(() => {
          w3DragSel = false;
          w3DragCvs = false;
          for (let i = 0; i < w3PeDragGrp.length; i++)
            w3PeDragGrp[i].classList.remove("macro-pe-txt");
          w3PeDragGrp = [];
        }, 25);
      }
    }
  };

  window.addEventListener("pointerdown", w3PtrDown, true);
  window.addEventListener("mousedown", w3PtrDown, true);
  window.addEventListener("pointerup", w3PtrUp, true);
  window.addEventListener("mouseup", w3PtrUp, true);

  window.addEventListener(
    "click",
    (e) => {
      if (!v9TxtOn() || !e.isTrusted || w3IsUi(e.target)) return;
      if (w3DragSel) {
        const tg =
          e.target && e.target.nodeType === 1
            ? e.target
            : e.target && e.target.parentElement;
        const s = window.getSelection();
        if (
          w3DragCvs ||
          (tg && tg.classList && tg.classList.contains("macro-cvs-txt")) ||
          (s && !s.isCollapsed)
        ) {
          e.stopImmediatePropagation();
        }
        w3DragSel = false;
        w3DragCvs = false;
      }
    },
    true,
  );

  window.addEventListener(
    "contextmenu",
    (e) => {
      if (!v9TxtOn() || w3IsUi(e.target)) return;
      const hit =
        (w3RmbHit && performance.now() - w3RmbTs < 1500) ||
        w3HitSel(e.clientX, e.clientY, e.target);
      if (w3RmbTm) clearTimeout(w3RmbTm);
      w3RmbTm = setTimeout(() => {
        w3RmbHit = false;
        w3RmbTm = 0;
      }, 120);
      if (hit) {
        w3SetBypass(false);
        b4AllowDef.add(e);
        e.stopImmediatePropagation();
      }
    },
    true,
  );

  window.addEventListener(
    "contextmenu",
    (e) => {
      if (!v9TxtOn() || w3IsUi(e.target)) return;
      if (w3BypTm) clearTimeout(w3BypTm);
      w3BypTm = setTimeout(() => w3SetBypass(false), 0);
      if (!w3HitSel(e.clientX, e.clientY, e.target)) e.preventDefault();
    },
    false,
  );

  window.addEventListener("blur", () => {
    w3SetBypass(false);
    w3DragSel = false;
    w3DragCvs = false;
    w3RmbHit = false;
    w3ClearPe();
  });

  document.addEventListener(
    "keydown",
    (e) => {
      if (v7QzP2wM) return;
      if (hSP2xK9m.has(e)) return;
      p2LxQ8vM();
      const tg = e.target,
        tn = tg && tg.tagName ? tg.tagName.toLowerCase() : "";
      if (
        (tn === "input" && tg.type !== "checkbox") ||
        tn === "textarea" ||
        (tg && tg.isContentEditable)
      )
        return;
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
    },
    true,
  );

  window.addEventListener(
    "mousedown",
    (e) => {
      if (!e.isTrusted || v7QzP2wM) return;
      const tg = e.target;
      const tn = tg && tg.tagName ? tg.tagName.toLowerCase() : "";
      const hasClosest = tg && typeof tg.closest === "function";
      const act = document.activeElement;
      const isInputFocused =
        act &&
        ((act.tagName === "INPUT" && act.type !== "checkbox") ||
          act.tagName === "TEXTAREA" ||
          act.isContentEditable);
      const isClickOnScriptOrChat =
        (tn === "input" && tg.type !== "checkbox") ||
        tn === "textarea" ||
        (tg && tg.isContentEditable) ||
        (hasClosest &&
          Boolean(
            tg.closest(
              "#macro-window, #macro-toggle-pill, #macro-bypass-map, #chat-container, #chat-panel, .chat-panel",
            ),
          ));

      const isGameUiClick =
        hasClosest &&
        Boolean(
          tg.closest(
            "button, a, select, #main-panel, #login-panel, #party-panel",
          ),
        );
      const mCd = "Mouse" + e.button;
      if (mCd === m9TvL2sP.keyMenu) {
        const onBindCtrl =
          hasClosest &&
          Boolean(
            tg.closest(
              ".macro-bind-btn, .macro-menu-bind-btn, .macro-rst-btn, .macro-menu-rst-btn, input, textarea",
            ),
          );
        if (
          !onBindCtrl &&
          !(isGameUiClick && e.button === 0) &&
          (!isClickOnScriptOrChat || e.button >= 3)
        ) {
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
        hGo2xK9m({ kind: "mouse", button: e.button });
        return;
      }
      if (d5TxL2wV(mCd)) {
        e.preventDefault();
        e.stopPropagation();
        q8WnM4tL(mCd);
      }
    },
    true,
  );

  window.addEventListener(
    "mouseup",
    (e) => {
      const mCd = "Mouse" + e.button;
      if (
        e.button >= 3 &&
        (v7QzP2wM ||
          Date.now() < z3TvL8xP ||
          mCd === m9TvL2sP.keyMenu ||
          mCd === m9TvL2sP.keyHoldSpam ||
          d5TxL2wV(mCd))
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!e.isTrusted) return;
      if (
        hSt2xK9m &&
        hSt2xK9m.kind === "mouse" &&
        e.button === hSt2xK9m.button
      ) {
        hCl2xK9m();
      }
    },
    true,
  );

  window.addEventListener(
    "auxclick",
    (e) => {
      const mCd = "Mouse" + e.button;
      if (
        v7QzP2wM ||
        Date.now() < z3TvL8xP ||
        mCd === m9TvL2sP.keyMenu ||
        mCd === m9TvL2sP.keyHoldSpam ||
        d5TxL2wV(mCd)
      ) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    },
    true,
  );

  const hSP2xK9m = new WeakSet();
  let hSt2xK9m = null,
    hTm2xK9m = null;

  function hCl2xK9m() {
    if (hTm2xK9m !== null) {
      clearInterval(hTm2xK9m);
      hTm2xK9m = null;
    }
    if (hSt2xK9m) {
      const p = hSt2xK9m;
      hSt2xK9m = null;
      hEv2xK9m(p, p.kind === "key" ? "keyup" : "mouseup");
    }
  }

  function hEv2xK9m(st, type) {
    if (st.kind === "key") {
      let kc = st.keyCode;
      if (!kc && st.code) {
        if (st.code.startsWith("Key")) kc = st.code.charCodeAt(3);
        else if (st.code.startsWith("Digit"))
          kc = 48 + parseInt(st.code.slice(5), 10);
        else if (st.code === "Space") kc = 32;
      }
      if (!kc) kc = st.key ? st.key.toUpperCase().charCodeAt(0) : 87;
      const ev = new KeyboardEvent(type, {
        key: st.key,
        code: st.code,
        location: st.location || 0,
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(ev, "keyCode", { value: kc, writable: false });
      Object.defineProperty(ev, "which", { value: kc, writable: false });
      hSP2xK9m.add(ev);
      document.dispatchEvent(ev);
    } else {
      const tg = t8VwM4xK() || document;
      const btn = st.button !== undefined ? st.button : 0;
      const wh = btn + 1;
      const btns = type === "mouseup" ? 0 : [1, 4, 2, 8, 16][btn] || 1;
      const mEv = new MouseEvent(type, {
        button: btn,
        buttons: btns,
        clientX: t2QnL9wP,
        clientY: b8VmK3xT,
        bubbles: true,
        cancelable: true,
      });
      Object.defineProperty(mEv, "which", { value: wh, writable: false });
      hSP2xK9m.add(mEv);
      tg.dispatchEvent(mEv);
    }
  }

  function hGo2xK9m(st) {
    if (hSt2xK9m || v7QzP2wM || !m9TvL2sP.keyHoldSpam) return;
    hSt2xK9m = st;
    hEv2xK9m(st, st.kind === "key" ? "keydown" : "mousedown");
    hTm2xK9m = setInterval(() => {
      if (hSt2xK9m === st && !k4FeedLock) {
        hEv2xK9m(st, st.kind === "key" ? "keydown" : "mousedown");
      }
    }, 60);
  }

  window.addEventListener(
    "keydown",
    (e) => {
      if (!e.isTrusted || v7QzP2wM) return;
      const cd = e.code || e.key;
      if (!cd || cd !== m9TvL2sP.keyHoldSpam || !m6BwL4sK(e)) return;
      const tg = e.target,
        tn = tg && tg.tagName ? tg.tagName.toLowerCase() : "";
      if (
        (tn === "input" && tg.type !== "checkbox") ||
        tn === "textarea" ||
        (tg && tg.isContentEditable)
      )
        return;
      e.preventDefault();
      e.stopPropagation();
      if (e.repeat) return;
      hGo2xK9m({
        kind: "key",
        key: e.key,
        code: cd,
        location: e.location,
        keyCode: e.keyCode,
      });
    },
    true,
  );

  window.addEventListener(
    "keyup",
    (e) => {
      if (!e.isTrusted) return;
      const cd = e.code || e.key;
      if (hSt2xK9m && hSt2xK9m.kind === "key" && cd === hSt2xK9m.code) {
        hCl2xK9m();
      }
    },
    true,
  );

  window.addEventListener(
    "contextmenu",
    (e) => {
      if (hSP2xK9m.has(e)) return;
      const tg = e.target,
        tn = tg && tg.tagName ? tg.tagName.toLowerCase() : "";
      const isEd =
        (tn === "input" && tg.type !== "checkbox") ||
        tn === "textarea" ||
        (tg && tg.isContentEditable);
      if (
        !isEd &&
        (m9TvL2sP.keyHoldSpam === "Mouse2" ||
          m9TvL2sP.keyMenu === "Mouse2" ||
          d5TxL2wV("Mouse2"))
      )
        e.preventDefault();
      if (hSt2xK9m && hSt2xK9m.kind === "mouse" && hSt2xK9m.button === 2)
        hCl2xK9m();
    },
    true,
  );

  window.addEventListener("focusin", (e) => {
    const tg = e.target,
      tn = tg && tg.tagName ? tg.tagName.toLowerCase() : "";
    if (
      (tn === "input" && tg.type !== "checkbox") ||
      tn === "textarea" ||
      (tg && tg.isContentEditable)
    )
      hCl2xK9m();
  });

  window.addEventListener("blur", () => {
    if (m9TvL2sP.holdSpamMode === "release") hCl2xK9m();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && m9TvL2sP.holdSpamMode === "release") hCl2xK9m();
  });

  window.addEventListener(
    "click",
    (e) => {
      if (Date.now() < z3TvL8xP) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
      }
    },
    true,
  );

  function p7TvM3wL(c) {
    if (!c) return k3Tr("none");
    if (c === "Mouse0") return "LMB";
    if (c === "Mouse1") return "MMB";
    if (c === "Mouse2") return "RMB";
    if (c.startsWith("Mouse")) return "M" + c.replace("Mouse", "");
    return c
      .replace(/^Key/, "")
      .replace(/^Digit/, "")
      .replace(/^Numpad/, "Num ");
  }

  const y4WpS9vT = [
    { id: "keyT2", label: "Trick 1x (2c)" },
    { id: "keyT4", label: "Trick 2x (4c)" },
    { id: "keyT8", label: "Trick 3x (8c)" },
    { id: "keyT16", label: "Trick 4x (16c)" },
    { id: "keyT32", label: "Trick 5x (32c)" },
    { id: "keyT64", label: "Trick 6x (64c)" },
    { id: "keyT128", label: "Trick 7x (128c)" },
    { id: "keyT256", label: "Trick 8x (256c)" },
  ];

  const w9QnL2xM = [
    { id: "keyRevLock", label: "Lock Target" },
    { id: "keyRevUnlock", label: "Cancel Lock" },
  ];

  const k5TxM8wL = [
    { id: "keyRevSplit1", label: "Select Rev 1x (2c)" },
    { id: "keyRevSplit2", label: "Select Rev 2x (4c)" },
    { id: "keyRevSplit3", label: "Select Rev 3x (8c)" },
    { id: "keyRevSplit4", label: "Select Rev 4x (16c)" },
    { id: "keyRevSplit5", label: "Select Rev 5x (32c)" },
    { id: "keyRevSplit6", label: "Select Rev 6x (64c)" },
    { id: "keyRevSplit7", label: "Select Rev 7x (128c)" },
    { id: "keyRevSplit8", label: "Select Rev 8x (256c)" },
  ];

  function b2WzL7vP(tk, val) {
    if (!tk) return;
    const f = tk.querySelector(".macro-slider-fill");
    if (f)
      f.style.width =
        Math.max(0, Math.min(100, ((val - 50) / 2950) * 100)) + "%";
  }

  function a2LnQ8vM() {
    const act = Boolean(m9TvL2sP.frustumCulling && m9TvL2sP.cullMarginToggle);
    const tr = document.getElementById("macro-track-margin");
    const nw = document.querySelector("#macro-row-margin .macro-num-wrap");
    if (tr) {
      tr.style.opacity = act ? "1" : "0.35";
      tr.style.pointerEvents = act ? "auto" : "none";
    }
    if (nw) {
      nw.style.opacity = act ? "1" : "0.35";
      nw.style.pointerEvents = act ? "auto" : "none";
    }
    const rAct = Boolean(m9TvL2sP.renderScaleToggle);
    const rTr = document.getElementById("macro-track-rscale");
    const rNw = document.querySelector("#macro-row-rscale .macro-num-wrap");
    if (rTr) {
      rTr.style.opacity = rAct ? "1" : "0.35";
      rTr.style.pointerEvents = rAct ? "auto" : "none";
    }
    if (rNw) {
      rNw.style.opacity = rAct ? "1" : "0.35";
      rNw.style.pointerEvents = rAct ? "auto" : "none";
    }
  }

  const k9EdMap = new WeakMap();

  function q5IsEdit(el) {
    if (!el || !el.tagName) return false;
    const t = el.tagName.toLowerCase();
    return (t === "input" && el.type !== "checkbox") || t === "textarea";
  }

  function g7SnapObj(el) {
    let s = 0,
      e = 0,
      d = "none";
    try {
      if (typeof el.selectionStart === "number") {
        s = el.selectionStart;
        e = el.selectionEnd;
        d = el.selectionDirection || "none";
      }
    } catch (_) {}
    return {
      v: String(el.value || ""),
      s,
      e,
      d,
      t: el.tagName === "TEXTAREA" ? el.scrollTop : 0,
    };
  }

  function g8MkEdSt(el) {
    return {
      stk: [g7SnapObj(el)],
      idx: 0,
      ts: 0,
      kind: "",
      caret: 0,
      busy: false,
      comp: false,
      pre: null,
    };
  }

  function m4SyncSel(el, st, brk) {
    if (!st || st.busy || el.value !== st.stk[st.idx].v) return;
    try {
      if (typeof el.selectionStart === "number") {
        const cur = st.stk[st.idx];
        const ns = el.selectionStart,
          ne = el.selectionEnd,
          nd = el.selectionDirection || "none";
        if (ns !== cur.s || ne !== cur.e || nd !== cur.d) {
          cur.s = ns;
          cur.e = ne;
          cur.d = nd;
          if (brk) st.kind = "";
        }
        if (el.tagName === "TEXTAREA") cur.t = el.scrollTop;
      }
    } catch (_) {}
  }

  function f6PushSnap(el, st, kind) {
    const sn = g7SnapObj(el);
    const cur = st.stk[st.idx];
    if (cur && sn.v === cur.v) {
      cur.s = sn.s;
      cur.e = sn.e;
      cur.d = sn.d;
      cur.t = sn.t;
      return;
    }
    const nw = performance.now();
    const canGrp =
      (kind === "ins" ||
        kind === "del" ||
        kind === "delf" ||
        kind === "step") &&
      st.idx > 0 &&
      st.idx === st.stk.length - 1 &&
      kind === st.kind &&
      nw - st.ts < 450 &&
      (kind === "step" ||
        (st.pre && st.pre.s === st.pre.e && st.pre.s === st.caret));

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
      if (typeof el.setSelectionRange === "function") {
        const len = sn.v.length;
        const s = Math.max(0, Math.min(len, sn.s));
        const e = Math.max(0, Math.min(len, sn.e));
        el.setSelectionRange(s, e, sn.d || "none");
      }
      if (el.tagName === "TEXTAREA" && typeof sn.t === "number")
        el.scrollTop = sn.t;
      st.kind = "";
      st.caret = sn.s;
      el.dispatchEvent(new Event("input", { bubbles: true }));
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
    if (commit) f6PushSnap(el, st, "ext");
  }

  function q6CommitVal(el, kind = "ext") {
    if (!el) return;
    const st = k9EdMap.get(el);
    if (st) f6PushSnap(el, st, kind);
  }

  function j5KeyCmd(e) {
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return "";
    const k = (e.key || "").toLowerCase();
    const c = e.code || "";
    const lat = /^[a-z]$/.test(k);
    if (e.shiftKey) {
      if ((lat && k === "z") || (!lat && c === "KeyZ")) return "redo";
      return "";
    }
    if ((lat && k === "z") || (!lat && c === "KeyZ")) return "undo";
    if ((lat && k === "y") || (!lat && c === "KeyY")) return "redo";
    if ((lat && k === "a") || (!lat && c === "KeyA")) return "all";
    return "";
  }

  function b3EdBind(el) {
    if (!el || k9EdMap.has(el)) return;
    k9EdMap.set(el, g8MkEdSt(el));

    el.addEventListener("focus", () => m4SyncSel(el, k9EdMap.get(el), false));
    el.addEventListener("mousedown", () => {
      const st = k9EdMap.get(el);
      if (st) st.kind = "";
    });
    el.addEventListener("mouseup", () => m4SyncSel(el, k9EdMap.get(el), true));
    el.addEventListener("select", () => m4SyncSel(el, k9EdMap.get(el), true));
    el.addEventListener("compositionstart", () => {
      const st = k9EdMap.get(el);
      if (!st) return;
      st.comp = true;
      m4SyncSel(el, st, false);
    });
    el.addEventListener("compositionend", () => {
      const st = k9EdMap.get(el);
      if (!st) return;
      st.comp = false;
      if (!st.busy) f6PushSnap(el, st, "other");
    });
    el.addEventListener("beforeinput", (e) => {
      const st = k9EdMap.get(el);
      if (!st || st.busy) return;
      if (e.inputType === "historyUndo") {
        e.preventDefault();
        h3DoUndo(el);
        return;
      }
      if (e.inputType === "historyRedo") {
        e.preventDefault();
        h3DoRedo(el);
        return;
      }
      m4SyncSel(el, st, false);
      st.pre = g7SnapObj(el);
    });
    el.addEventListener("input", (e) => {
      const st = k9EdMap.get(el);
      if (!st || st.busy || st.comp || e.isComposing) return;
      const it = e.inputType || "";
      let k = "other";
      if (
        it === "insertText" &&
        (!e.data || (e.data.length === 1 && !/\s/.test(e.data)))
      )
        k = "ins";
      else if (it === "deleteContentBackward") k = "del";
      else if (it === "deleteContentForward") k = "delf";
      f6PushSnap(el, st, k);
      st.pre = null;
    });
    el.addEventListener("keyup", (e) => {
      if (
        e.key &&
        (e.key.startsWith("Arrow") || e.key === "Home" || e.key === "End")
      )
        m4SyncSel(el, k9EdMap.get(el), true);
    });
    el.addEventListener("keydown", (e) => {
      const st = k9EdMap.get(el);
      if (!st) return;
      const cmd = j5KeyCmd(e);
      if (cmd === "undo") {
        e.preventDefault();
        e.stopPropagation();
        h3DoUndo(el);
        return;
      }
      if (cmd === "redo") {
        e.preventDefault();
        e.stopPropagation();
        h3DoRedo(el);
        return;
      }
      if (cmd === "all") {
        e.preventDefault();
        e.stopPropagation();
        el.select();
        m4SyncSel(el, st, true);
        return;
      }
      if (e.key === "Escape") {
        el.blur();
        return;
      }
      if (el.tagName !== "TEXTAREA" && e.key === "Enter") {
        el.blur();
        return;
      }
      if (
        el.classList.contains("macro-num-input") &&
        (e.key === "ArrowUp" || e.key === "ArrowDown") &&
        !e.shiftKey &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        e.preventDefault();
        const mn = parseInt(el.dataset.min || "50", 10);
        const mx = parseInt(el.dataset.max || "3000", 10);
        const sp = parseInt(el.dataset.step || "10", 10);
        const cur = parseInt(el.value, 10);
        const base = isNaN(cur) ? mn : cur;
        const nxt = Math.max(
          mn,
          Math.min(mx, base + (e.key === "ArrowUp" ? sp : -sp)),
        );
        el.value = String(nxt);
        try {
          el.setSelectionRange(el.value.length, el.value.length);
        } catch (_) {}
        f6PushSnap(el, st, "step");
        st.busy = true;
        try {
          el.dispatchEvent(new Event("input", { bubbles: true }));
        } finally {
          st.busy = false;
        }
      }
    });
  }

  let w9LpT5vN = null;
  let g4PopClsFn = null;

  let x3CrsStEl = null,
    x3CrsKey = "";

  function m8XhairUri(xs, sc) {
    const c = 10.5,
      r0 = 2.55 * sc,
      r1 = 4.55 * sc;
    const bw = (2.3 * sc).toFixed(2),
      ww = (1.18 * sc).toFixed(2);
    let ln = "";
    if (xs === "cross") {
      const k = Math.SQRT1_2;
      const a0 = (c - r1 * k).toFixed(2),
        a1 = (c - r0 * k).toFixed(2);
      const b0 = (c + r0 * k).toFixed(2),
        b1 = (c + r1 * k).toFixed(2);
      ln = `M${a0} ${a0}L${a1} ${a1}M${b0} ${b0}L${b1} ${b1}M${b1} ${a0}L${b0} ${a1}M${a1} ${b0}L${a0} ${b1}`;
    } else {
      const a0 = (c - r1).toFixed(2),
        a1 = (c - r0).toFixed(2);
      const b0 = (c + r0).toFixed(2),
        b1 = (c + r1).toFixed(2);
      ln = `M${a0} ${c}H${a1}M${b0} ${c}H${b1}M${c} ${a0}V${a1}M${c} ${b0}V${b1}`;
    }
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21"><path d="${ln}" fill="none" stroke="rgba(0,0,0,0.68)" stroke-width="${bw}" stroke-linecap="round"/><path d="${ln}" fill="none" stroke="rgba(255,255,255,0.92)" stroke-width="${ww}" stroke-linecap="round"/></svg>`;
    return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  }

  function k9SyncXhair() {
    const on = Boolean(m9TvL2sP.crosshairEnabled);
    document.documentElement.classList.toggle("macro-xhair-on", on);
    if (!x3CrsStEl) {
      x3CrsStEl = document.createElement("style");
      x3CrsStEl.id = "macro-xhair-style";
      (document.head || document.documentElement).appendChild(x3CrsStEl);
    }
    if (!on) {
      x3CrsKey = "";
      if (x3CrsStEl.textContent) x3CrsStEl.textContent = "";
    } else {
      const xs = m9TvL2sP.crosshairStyle === "cross" ? "cross" : "plus";
      const dpr = window.devicePixelRatio || 1;
      const sc = dpr < 1 ? Math.max(0.65, Math.round(dpr * 20) / 20) : 1;
      const nk = xs + "|" + sc;
      if (x3CrsKey !== nk) {
        x3CrsKey = nk;
        const u = m8XhairUri(xs, sc);
        x3CrsStEl.textContent = `html.macro-xhair-on #canvas, html.macro-xhair-on canvas:not(#macro-plexus-canvas):not(#autorev-overlay):not(#macro-bg-canvas):not(#macro-grid-canvas):not(#macro-curline-canvas):not(#macro-bypass-field):not(#macro-bypass-radar) { cursor: url("${u}") 10 10, crosshair !important; }`;
      }
    }
    if (k9CurFn) k9CurFn();
  }

  function r8QnM4tL() {
    ["solo", "auto"].forEach((k) => {
      const prop = k === "solo" ? "soloDelay" : "autoDelay";
      const trk = document.getElementById("macro-track-" + k),
        inp = document.getElementById("macro-num-" + k);
      if (trk) b2WzL7vP(trk, m9TvL2sP[prop]);
      if (inp && document.activeElement !== inp)
        q2SetVal(inp, m9TvL2sP[prop], true);
    });

    if (Array.isArray(m9TvL2sP.extraFastFeeds)) {
      m9TvL2sP.extraFastFeeds.forEach((ff, idx) => {
        const trk = document.getElementById("macro-track-extraFF_" + idx);
        const inp = document.getElementById("macro-num-extraFF_" + idx);
        const btn = document.getElementById("macro-btn-extraFF_" + idx);
        if (trk) b2WzL7vP(trk, ff.delay);
        if (inp && document.activeElement !== inp)
          q2SetVal(inp, ff.delay, true);
        if (btn) btn.textContent = p7TvM3wL(ff.key);
      });
    }

    const ffAutoOn = m9TvL2sP.ffMethod === "auto";
    const ffManWrap = document.getElementById("macro-ff-manual-wrap");
    const ffAutoWrap = document.getElementById("macro-ff-auto-wrap");
    if (ffManWrap) ffManWrap.style.display = ffAutoOn ? "none" : "block";
    if (ffAutoWrap) ffAutoWrap.style.display = ffAutoOn ? "block" : "none";
    const cFm = document.getElementById("macro-ffmtd-cur");
    const pFm = document.getElementById("macro-ffmtd-pop");
    if (cFm) cFm.textContent = k3Tr(ffAutoOn ? "ffAuto" : "ffMan");
    if (pFm) {
      pFm.querySelectorAll(".macro-pos-opt").forEach((o) => {
        o.classList.toggle(
          "active",
          o.getAttribute("data-ffmtd") === (ffAutoOn ? "auto" : "manual"),
        );
      });
    }
    const fLBtn = document.getElementById("macro-btn-keyFfLock");
    if (fLBtn) fLBtn.textContent = p7TvM3wL(m9TvL2sP.keyFfLock);
    const fABtn = document.getElementById("macro-btn-keyFfActivate");
    if (fABtn) fABtn.textContent = p7TvM3wL(m9TvL2sP.keyFfActivate);
    const sfKey = m9TvL2sP.soloFocus === "window" ? "window" : "multibox";
    const cSf = document.getElementById("macro-solofocus-cur");
    const pSf = document.getElementById("macro-solofocus-pop");
    if (cSf) cSf.textContent = k3Tr(sfKey === "window" ? "sfWin" : "sfMb");
    if (pSf) {
      pSf.querySelectorAll(".macro-pos-opt").forEach((o) => {
        o.classList.toggle(
          "active",
          o.getAttribute("data-solofocus") === sfKey,
        );
      });
    }
    const aBtn = document.getElementById("macro-btn-keyAuto");
    if (aBtn) aBtn.textContent = p7TvM3wL(m9TvL2sP.keyAuto);
    const mBtn = document.getElementById("macro-btn-keyMenu");
    if (mBtn)
      mBtn.textContent = k3Tr("menuBind") + ": " + p7TvM3wL(m9TvL2sP.keyMenu);
    const hBtn = document.getElementById("macro-btn-keyHoldSpam");
    if (hBtn) hBtn.textContent = p7TvM3wL(m9TvL2sP.keyHoldSpam);
    const hmKey = m9TvL2sP.holdSpamMode === "release" ? "hmDrop" : "hmHold";
    const cHm = document.getElementById("macro-holdmode-cur");
    const pHm = document.getElementById("macro-holdmode-pop");
    if (cHm) cHm.textContent = k3Tr(hmKey);
    if (pHm) {
      pHm.querySelectorAll(".macro-pos-opt").forEach((o) => {
        o.classList.toggle(
          "active",
          o.getAttribute("data-holdmode") ===
            (m9TvL2sP.holdSpamMode === "release" ? "release" : "hold"),
        );
      });
    }

    [y4WpS9vT, w9QnL2xM, k5TxM8wL].forEach((arr) => {
      arr.forEach((r) => {
        const b = document.getElementById("macro-btn-" + r.id);
        if (b) b.textContent = p7TvM3wL(m9TvL2sP[r.id]);
      });
    });

    document.querySelectorAll(".macro-split-chip").forEach((ch) => {
      ch.classList.toggle(
        "active",
        parseInt(ch.getAttribute("data-split"), 10) === m9TvL2sP.revSplits,
      );
    });

    const tSk = document.getElementById("macro-toggle-skin");
    const tNm = document.getElementById("macro-toggle-name");
    const tCs = document.getElementById("macro-toggle-custom");
    const tAr = document.getElementById("macro-custom-nicks");
    const tMap = document.getElementById("macro-toggle-map-bg");
    const tFix = document.getElementById("macro-toggle-fixed-bg");

    if (tSk) tSk.checked = Boolean(m9TvL2sP.skinStealer);
    if (tNm) tNm.checked = Boolean(m9TvL2sP.nameStealer);
    if (tCs) tCs.checked = Boolean(m9TvL2sP.customSwitcher);
    if (tMap) tMap.checked = Boolean(m9TvL2sP.mapBgEnabled);
    if (tFix) tFix.checked = Boolean(m9TvL2sP.fixedBackgroundEnabled);
    if (tAr && document.activeElement !== tAr)
      q2SetVal(tAr, m9TvL2sP.customNicks || "", true);

    const bMapRst = document.getElementById("macro-btn-map-rst");
    const bFixRst = document.getElementById("macro-btn-fixed-rst");
    if (bMapRst) bMapRst.classList.toggle("has-bg", Boolean(m9TvL2sP.mapBgSrc));
    if (bFixRst)
      bFixRst.classList.toggle("has-bg", Boolean(m9TvL2sP.fixedBgSrc));

    const tCl = document.getElementById("macro-toggle-culling");
    const tFl = document.getElementById("macro-toggle-filters");
    const tMg = document.getElementById("macro-toggle-margin");
    const mTrk = document.getElementById("macro-track-margin");
    const mInp = document.getElementById("macro-num-margin");
    const margin = Math.max(
      30,
      Math.min(500, Number(m9TvL2sP.cullMargin) || 120),
    );

    if (tCl) tCl.checked = Boolean(m9TvL2sP.frustumCulling);
    if (tFl) tFl.checked = Boolean(m9TvL2sP.stripFilters);
    if (tMg) tMg.checked = Boolean(m9TvL2sP.cullMarginToggle);
    if (mTrk) {
      const f = mTrk.querySelector(".macro-slider-fill");
      if (f) f.style.width = ((margin - 30) / 470) * 100 + "%";
    }
    if (mInp && document.activeElement !== mInp) q2SetVal(mInp, margin, true);
    const tRs = document.getElementById("macro-toggle-rscale");
    if (tRs) tRs.checked = Boolean(m9TvL2sP.renderScaleToggle);
    const rsTrk = document.getElementById("macro-track-rscale");
    const rsInp = document.getElementById("macro-num-rscale");
    const rScale = Math.max(
      25,
      Math.min(100, Math.round(Number(m9TvL2sP.renderScale) || 100)),
    );
    if (rsTrk) {
      const f = rsTrk.querySelector(".macro-slider-fill");
      if (f) f.style.width = ((rScale - 25) / 75) * 100 + "%";
    }
    if (rsInp && document.activeElement !== rsInp)
      q2SetVal(rsInp, rScale, true);

    const tPx = document.getElementById("macro-toggle-plexus");
    const tSc = document.getElementById("macro-toggle-sync-scale");
    const tPt = document.getElementById("macro-toggle-pill-trans");
    const pEl = document.getElementById("macro-toggle-pill");
    if (tPx) tPx.checked = Boolean(m9TvL2sP.plexusEnabled);
    if (tSc) tSc.checked = Boolean(m9TvL2sP.syncScale);
    if (tPt) tPt.checked = Boolean(m9TvL2sP.pillTransparent);
    if (pEl)
      pEl.classList.toggle(
        "macro-pill-trans",
        Boolean(m9TvL2sP.pillTransparent),
      );
    const rmKey = m9TvL2sP.revMethod === "pixi" ? "pixi" : "ws";
    const cRm = document.getElementById("macro-revmtd-cur");
    const pRm = document.getElementById("macro-revmtd-pop");
    const iRm = document.getElementById("macro-rev-info");
    if (cRm) cRm.textContent = rmKey === "pixi" ? "Pixi" : "WebSocket";
    if (pRm) {
      pRm.querySelectorAll(".macro-pos-opt").forEach((o) => {
        o.classList.toggle("active", o.getAttribute("data-revmtd") === rmKey);
      });
    }
    if (iRm) iRm.style.display = rmKey === "pixi" ? "inline-flex" : "none";
    const tRn = document.getElementById("macro-toggle-revnot");
    const cRn = document.getElementById("macro-revnot-cur");
    const pRn = document.getElementById("macro-revnot-pop");
    const nEl = document.getElementById("macro-revnot-toast");
    if (tRn) tRn.checked = Boolean(m9TvL2sP.revNotify);
    const pKey = m9TvL2sP.revNotifyPos === "bottom" ? "bottom" : "top";
    if (cRn) cRn.textContent = k3Tr(pKey === "bottom" ? "posBot" : "posTop");
    if (pRn) {
      pRn.querySelectorAll(".macro-pos-opt").forEach((o) => {
        o.classList.toggle("active", o.getAttribute("data-pos") === pKey);
      });
    }
    if (nEl) nEl.classList.toggle("pos-bottom", pKey === "bottom");
    const tSt = document.getElementById("macro-toggle-seltxt");
    if (tSt) tSt.checked = Boolean(m9TvL2sP.selectableText);
    k9SyncTxtMode();
    const tXh = document.getElementById("macro-toggle-xhair");
    const cXh = document.getElementById("macro-xhair-cur");
    const pXh = document.getElementById("macro-xhair-pop");
    if (tXh) tXh.checked = Boolean(m9TvL2sP.crosshairEnabled);
    const xhKey = m9TvL2sP.crosshairStyle === "cross" ? "cross" : "plus";
    if (cXh) cXh.textContent = k3Tr(xhKey === "cross" ? "xhCross" : "xhPlus");
    if (pXh) {
      pXh.querySelectorAll(".macro-pos-opt").forEach((o) => {
        o.classList.toggle("active", o.getAttribute("data-xhair") === xhKey);
      });
    }
    const tCa = document.getElementById("macro-toggle-curarrow");
    if (tCa) tCa.checked = Boolean(m9TvL2sP.cursorArrow);
    const tSc2 = document.getElementById("macro-toggle-softcol");
    if (tSc2) tSc2.checked = Boolean(m9TvL2sP.softColors);
    if (!m9TvL2sP.softColors) j2RstSoft();
    const tGr = document.getElementById("macro-toggle-map-grid");
    const cGr = document.getElementById("macro-grid-cur");
    const pGr = document.getElementById("macro-grid-pop");
    if (tGr) tGr.checked = Boolean(m9TvL2sP.mapGridEnabled);
    const grKey = m9TvL2sP.mapGridMode === "over" ? "over" : "bg";
    if (cGr) cGr.textContent = k3Tr(grKey === "over" ? "gridOver" : "gridBg");
    if (pGr) {
      pGr.querySelectorAll(".macro-pos-opt").forEach((o) => {
        o.classList.toggle("active", o.getAttribute("data-grid") === grKey);
      });
    }
    const tBp = document.getElementById("macro-toggle-bypass");
    if (tBp) tBp.checked = Boolean(m9TvL2sP.bypassEnabled);
    const bpM = b6ModeList.includes(m9TvL2sP.bypassMethod)
      ? m9TvL2sP.bypassMethod
      : "smart";
    const cBm = document.getElementById("macro-bpmtd-cur");
    const pBm = document.getElementById("macro-bpmtd-pop");
    if (cBm) cBm.textContent = b6ModeLabel(bpM);
    if (pBm) {
      pBm.querySelectorAll(".macro-pos-opt").forEach((o) => {
        o.classList.toggle("active", o.getAttribute("data-bpmtd") === bpM);
      });
    }
    const bpTtl = Math.max(
      1500,
      Math.min(25000, Math.round(Number(m9TvL2sP.bypassTtl) || 8500)),
    );
    const bpTrk = document.getElementById("macro-track-bpttl");
    const bpInp = document.getElementById("macro-num-bpttl");
    if (bpTrk) {
      const f = bpTrk.querySelector(".macro-slider-fill");
      if (f) f.style.width = ((bpTtl - 1500) / 23500) * 100 + "%";
    }
    if (bpInp && document.activeElement !== bpInp) q2SetVal(bpInp, bpTtl, true);
    const tBpPh = document.getElementById("macro-toggle-bpphantoms");
    if (tBpPh) tBpPh.checked = Boolean(m9TvL2sP.bypassPhantoms);
    const tBpRd = document.getElementById("macro-toggle-bpradar");
    if (tBpRd) tBpRd.checked = Boolean(m9TvL2sP.bypassRadar);
    const cBr = document.getElementById("macro-bpradar-cur");
    const pBr = document.getElementById("macro-bpradar-pop");
    const brKey = m9TvL2sP.bypassRadarMode === "fixed" ? "fixed" : "real";
    if (cBr)
      cBr.textContent = k3Tr(brKey === "fixed" ? "bpRadFixed" : "bpRadReal");
    if (pBr) {
      pBr.querySelectorAll(".macro-pos-opt").forEach((o) => {
        o.classList.toggle("active", o.getAttribute("data-bprad") === brKey);
      });
    }
    const tBpLk = document.getElementById("macro-toggle-bpradarlock");
    if (tBpLk) tBpLk.checked = Boolean(m9TvL2sP.bypassRadarLock);
    if (b6SyncRadarLock) b6SyncRadarLock();
    k9SyncXhair();
    if (k9CurFn) k9CurFn();
    if (b7DrawFn) b7DrawFn();
    if (w9LpT5vN) w9LpT5vN();
    a2LnQ8vM();
    k6RebuildPlans();
  }

  function m3TvL9xW(id) {
    hCl2xK9m();
    v7QzP2wM = id;
    const btn = document.getElementById("macro-btn-" + id);
    if (btn) {
      btn.classList.add("recording");
      btn.textContent = "...";
      btn.blur();
    }
    let fin = false;

    function cl(cd) {
      if (fin) return;
      fin = true;
      window.removeEventListener("keydown", onK, true);
      window.removeEventListener("mousedown", onM, true);
      window.removeEventListener("contextmenu", onC, true);
      window.removeEventListener("blur", onB, true);
      z3TvL8xP = Date.now() + 350;
      if (cd !== undefined) {
        if (v7QzP2wM.startsWith("extraFF_")) {
          const idx = parseInt(v7QzP2wM.slice(8), 10);
          if (m9TvL2sP.extraFastFeeds[idx])
            m9TvL2sP.extraFastFeeds[idx].key = cd;
        } else {
          m9TvL2sP[v7QzP2wM] = cd;
        }
        x3QnK8wR();
      }
      v7QzP2wM = null;
      document
        .querySelectorAll(".macro-bind-btn, .macro-menu-bind-btn")
        .forEach((b) => b.classList.remove("recording"));
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
      const onMu = () => {
        z3TvL8xP = Date.now() + 120;
      };
      window.addEventListener("mouseup", onMu, { once: true, capture: true });
      setTimeout(() => window.removeEventListener("mouseup", onMu, true), 5000);
      cl("Mouse" + e.button);
    }
    function onC(e) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
    function onB() {
      cl();
    }

    window.addEventListener("keydown", onK, true);
    window.addEventListener("mousedown", onM, true);
    window.addEventListener("contextmenu", onC, true);
    window.addEventListener("blur", onB, true);
  }

  function v6WpL2sT(p) {
    const vpW = document.documentElement.clientWidth || window.innerWidth;
    const vpH = document.documentElement.clientHeight || window.innerHeight;
    const mxL = Math.max(0, vpW - p.offsetWidth),
      mxT = Math.max(0, vpH - p.offsetHeight);
    if (m9TvL2sP.pillX !== null && m9TvL2sP.pillY !== null) {
      const cL = Math.max(0, Math.min(mxL, m9TvL2sP.pillX));
      const cT = Math.max(0, Math.min(mxT, m9TvL2sP.pillY));
      p.style.left = cL + "px";
      p.style.top = cT + "px";
      p.style.right = "auto";
    }
    const r = p.getBoundingClientRect();
    const tT = r.top <= 4,
      tB = r.bottom >= vpH - 4;
    const tL = r.left <= 4,
      tR = r.right >= vpW - 4;
    p.style.borderTop = tT ? "none" : "1px solid var(--macro-border, #333)";
    p.style.borderBottom = tB ? "none" : "1px solid var(--macro-border, #333)";
    p.style.borderLeft = tL ? "none" : "1px solid var(--macro-border, #333)";
    p.style.borderRight = tR ? "none" : "1px solid var(--macro-border, #333)";
    p.style.borderRadius = `${tT || tL ? "0" : "8px"} ${tT || tR ? "0" : "8px"} ${tB || tR ? "0" : "8px"} ${tB || tL ? "0" : "8px"}`;
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
    if (
      m9TvL2sP.skinStealer ||
      m9TvL2sP.nameStealer ||
      m9TvL2sP.customSwitcher
    ) {
      if (
        this.canvas &&
        (this.canvas.id === "leaderboard-canvas" ||
          (this.canvas.parentElement &&
            this.canvas.parentElement.id === "leaderboard-panel"))
      ) {
        if (typeof txt === "string") {
          const str = txt.trim();
          if (/^1[\.\)]\s*/.test(str)) q9TxL3wP.clear();
          const cln = str.replace(/^\d+[\.\)]\s*/, "").trim();
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
    if (this.canvas && this.canvas.isConnected && v9TxtOn())
      w3ClrArea(this, x, y, w, h, true);
    return p4FillOg.apply(this, arguments);
  };

  function k2SoftCss(sv) {
    if (typeof sv !== "string") return null;
    const s = sv.trim();
    let num = -1;
    let a = 1;
    if (s[0] === "#") {
      if (s.length === 4) {
        const r = parseInt(s[1] + s[1], 16);
        const g = parseInt(s[2] + s[2], 16);
        const b = parseInt(s[3] + s[3], 16);
        if (!isNaN(r + g + b)) num = (r << 16) | (g << 8) | b;
      } else if (s.length === 7) {
        const v = parseInt(s.slice(1), 16);
        if (!isNaN(v)) num = v & 0xffffff;
      }
    } else if (s.startsWith("rgb")) {
      const m = s.match(
        /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*([\d.]+))?\s*\)$/i,
      );
      if (m) {
        if (m[4] !== undefined) a = parseFloat(m[4]);
        if (a >= 0.85) {
          const r = Math.max(0, Math.min(255, parseInt(m[1], 10)));
          const g = Math.max(0, Math.min(255, parseInt(m[2], 10)));
          const b = Math.max(0, Math.min(255, parseInt(m[3], 10)));
          num = (r << 16) | (g << 8) | b;
        }
      }
    }
    if (num < 0) return null;
    const sn = n5SoftNum(num);
    if (sn === num) return null;
    return a < 1
      ? `rgba(${(sn >> 16) & 255},${(sn >> 8) & 255},${sn & 255},${a})`
      : "#" + sn.toString(16).padStart(6, "0");
  }

  const p4C2Fill = CanvasRenderingContext2D.prototype.fill;
  CanvasRenderingContext2D.prototype.fill = function () {
    if (
      m9TvL2sP.softColors &&
      (!p9PixiOn || performance.now() - p9LastPixiMs > 500) &&
      this.canvas &&
      this.canvas === (cachedGameCanvas || t8VwM4xK())
    ) {
      const og = this.fillStyle;
      const sc = k2SoftCss(og);
      if (sc) {
        this.fillStyle = sc;
        try {
          return p4C2Fill.apply(this, arguments);
        } finally {
          this.fillStyle = og;
        }
      }
    }
    return p4C2Fill.apply(this, arguments);
  };

  const p4C2Strk = CanvasRenderingContext2D.prototype.stroke;
  CanvasRenderingContext2D.prototype.stroke = function () {
    if (
      m9TvL2sP.softColors &&
      (!p9PixiOn || performance.now() - p9LastPixiMs > 500) &&
      this.canvas &&
      this.canvas === (cachedGameCanvas || t8VwM4xK())
    ) {
      const og = this.strokeStyle;
      const sc = k2SoftCss(og);
      if (sc) {
        this.strokeStyle = sc;
        try {
          return p4C2Strk.apply(this, arguments);
        } finally {
          this.strokeStyle = og;
        }
      }
    }
    return p4C2Strk.apply(this, arguments);
  };

  if (typeof OffscreenCanvasRenderingContext2D !== "undefined") {
    const o4Ft = OffscreenCanvasRenderingContext2D.prototype.fillText;
    OffscreenCanvasRenderingContext2D.prototype.fillText = function (
      txt,
      x,
      y,
      maxW,
    ) {
      w3RecTxt(this, txt, x, y, maxW, false);
      return o4Ft.apply(this, arguments);
    };
    const o4St = OffscreenCanvasRenderingContext2D.prototype.strokeText;
    OffscreenCanvasRenderingContext2D.prototype.strokeText = function (
      txt,
      x,
      y,
      maxW,
    ) {
      w3RecTxt(this, txt, x, y, maxW, true);
      return o4St.apply(this, arguments);
    };
    const o4Cl = OffscreenCanvasRenderingContext2D.prototype.clearRect;
    OffscreenCanvasRenderingContext2D.prototype.clearRect = function (
      x,
      y,
      w,
      h,
    ) {
      w3ClrArea(this, x, y, w, h, false);
      return o4Cl.apply(this, arguments);
    };
  }

  ["width", "height"].forEach((prop) => {
    const d = Object.getOwnPropertyDescriptor(
      HTMLCanvasElement.prototype,
      prop,
    );
    if (d && d.set) {
      Object.defineProperty(HTMLCanvasElement.prototype, prop, {
        configurable: true,
        enumerable: d.enumerable,
        get: d.get,
        set(val) {
          w3CvsTxt.delete(this);
          w3ConnTxt.delete(this);
          return d.set.call(this, val);
        },
      });
    }
    if (typeof OffscreenCanvas !== "undefined") {
      const od = Object.getOwnPropertyDescriptor(
        OffscreenCanvas.prototype,
        prop,
      );
      if (od && od.set) {
        Object.defineProperty(OffscreenCanvas.prototype, prop, {
          configurable: true,
          enumerable: od.enumerable,
          get: od.get,
          set(val) {
            w3CvsTxt.delete(this);
            return od.set.call(this, val);
          },
        });
      }
    }
  });

  if (typeof window.createImageBitmap === "function") {
    const o4Cib = window.createImageBitmap;
    window.createImageBitmap = function (src) {
      return o4Cib.apply(this, arguments).then((bmp) => {
        w3CopyCvsRec(src, bmp);
        return bmp;
      });
    };
  }

  if (
    typeof OffscreenCanvas !== "undefined" &&
    OffscreenCanvas.prototype.transferToImageBitmap
  ) {
    const o4Tib = OffscreenCanvas.prototype.transferToImageBitmap;
    OffscreenCanvas.prototype.transferToImageBitmap = function () {
      const bmp = o4Tib.apply(this, arguments);
      w3CopyCvsRec(this, bmp);
      return bmp;
    };
  }

  setInterval(() => {
    if (
      !m9TvL2sP.skinStealer &&
      !m9TvL2sP.nameStealer &&
      !m9TvL2sP.customSwitcher
    )
      return;
    const mp =
      document.getElementById("main-panel") ||
      document.getElementById("login-panel");
    if (mp && window.getComputedStyle(mp).display === "none") return;

    z4QzM8vL = Array.from(q9TxL3wP);
    if (!d2WnS7tM || !document.contains(d2WnS7tM))
      d2WnS7tM = document.getElementById("name-box");
    if (!d2WnS7tM || document.activeElement === d2WnS7tM) return;
    let sel = null;
    if (m9TvL2sP.customSwitcher) {
      const pl = (m9TvL2sP.customNicks || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (pl.length) sel = pl[(Math.random() * pl.length) | 0];
    } else {
      let pl = z4QzM8vL;
      if (!pl.length) {
        const p = document.getElementById("leaderboard-panel");
        if (p && p.innerText)
          pl = p.innerText
            .split("\n")
            .map((l) => l.replace(/^\d+[\.\)]\s*/, "").trim())
            .filter(
              (l) =>
                l &&
                !/^(leaderboard|leave|refresh|visibility|timer|\d{1,2}:\d{2}|\d+)$/i.test(
                  l,
                ),
            );
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
      d2WnS7tM.dispatchEvent(new Event("input", { bubbles: true }));
      d2WnS7tM.dispatchEvent(new Event("change", { bubbles: true }));
    }
  }, 1000);

  function y9WnK2vT() {
    if (document.getElementById("macro-window")) return;

    const st = document.createElement("style");
    st.textContent = `
      #macro-toggle-pill{position:fixed;top:0;right:0;background:#181818;color:#bbb;padding:9px 16px;font-family:'Ubuntu',sans-serif,Arial;font-size:11px;font-weight:700;letter-spacing:0.6px;cursor:grab;z-index:9999999;user-select:none;transition:background 0.12s,color 0.12s,opacity 0.18s ease;box-shadow:0 4px 14px rgba(0,0,0,0.45)}
      #macro-toggle-pill:hover{background:#252525;color:#fff}#macro-toggle-pill:active{cursor:grabbing}
      #macro-toggle-pill.macro-pill-trans{opacity:0.25}
      #macro-toggle-pill.macro-pill-trans:hover,#macro-toggle-pill.macro-pill-trans:active,#macro-toggle-pill.macro-pill-trans.dragging{opacity:1}
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

      .macro-controls-group{display:flex;align-items:center;gap:0.6em}
      .macro-slider-track{width:7.5em;height:0.85em;background:var(--macro-btn-bg-sub,#141414);border:1px solid var(--macro-btn-border,#2d2d2d);border-radius:0.45em;position:relative;cursor:pointer;overflow:hidden}
      .macro-icon-btn{background:var(--macro-btn-bg,#242424);border:1px solid var(--macro-btn-border,#383838);color:var(--macro-btn-text,#eee);border-radius:0.35em;padding:0.35em 0.5em;font-size:1em;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;line-height:0;transition:background 0.12s,border-color 0.12s,color 0.28s ease}
      .macro-icon-btn:hover{filter:brightness(1.15)}
      .macro-icon-btn svg{width:1.17em;height:1.17em;fill:currentColor}
      .macro-trash-btn{transition:background 0.12s,border-color 0.12s,color 0.2s ease}
      .macro-trash-btn.has-bg{background:var(--macro-btn-bg,#251616);border-color:var(--macro-btn-border,#4a2222);color:var(--macro-btn-reset-text,#ff4d4d)}
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
      #macro-row-margin>span,#macro-row-rscale>span,#macro-row-bpttl>span{flex:1 1 auto;min-width:0;line-height:1.2}
      #macro-row-margin .macro-controls-group,#macro-row-rscale .macro-controls-group{min-width:0;flex:0 0 auto;justify-content:flex-end;gap:0.45em}
      #macro-row-margin .macro-slider-track,#macro-row-rscale .macro-slider-track{width:5.4em;max-width:5.4em;min-width:3em;flex:0 1 5.4em}
      #macro-row-margin .macro-num-wrap,#macro-row-margin .macro-switch,#macro-row-rscale .macro-num-wrap,#macro-row-rscale .macro-switch{flex-shrink:0}
      #macro-row-margin .macro-num-input,#macro-row-rscale .macro-num-input{width:2.6em}
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
      #macro-ff-delays .macro-ff-anim-inner>.macro-row{margin-bottom:0;padding-top:0;padding-bottom:0.7em}
      .macro-settings-body .macro-row,.macro-settings-body .macro-section-header,.macro-settings-body .macro-sep{transition:opacity 0.18s ease,color 0.18s ease,text-shadow 0.18s ease}
      .macro-settings-body.macro-pal-dim .macro-row,.macro-settings-body.macro-pal-dim .macro-section-header,.macro-settings-body.macro-pal-dim .macro-sep,.macro-settings-body.macro-pal-dim .macro-textarea,.macro-settings-body.macro-pal-dim .macro-cfg-btns{opacity:0.32;pointer-events:none}
      .macro-settings-body.macro-pal-dim .macro-row.macro-pal-active{opacity:1;pointer-events:auto}
      .macro-cfg-json{min-height:6em;font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:0.8em;line-height:1.35;margin-top:0;white-space:pre-wrap;overflow-wrap:anywhere}
      .macro-cfg-btns{display:flex;gap:0.45em;margin-top:0.45em}
      .macro-cfg-btn{flex:1 1 0;background:var(--macro-btn-bg,#242424);border:1px solid var(--macro-btn-border,#383838);color:var(--macro-btn-text,#eee);border-radius:0.35em;padding:0.55em 0.5em;font-family:inherit;font-size:0.92em;font-weight:700;cursor:pointer;text-align:center;transition:background 0.14s,border-color 0.14s,filter 0.14s,color 0.28s ease}
      .macro-cfg-btn:hover{filter:brightness(1.15)}
      .macro-cfg-btn.macro-cfg-err{background:var(--macro-btn-bg,#251616);border-color:var(--macro-btn-border,#4a2222);color:var(--macro-btn-reset-text,#ff7575)}
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
      .macro-win-body .macro-row,.macro-win-body .macro-section-header,.macro-win-body .macro-sep,.macro-win-body .macro-textarea,.macro-win-body .macro-menu-bind-wrap,.macro-win-body .macro-reset-all-btn,.macro-win-body .macro-tutorial-btn,.macro-win-body .macro-upd-banner{transition:opacity 0.18s ease,color 0.18s ease,text-shadow 0.18s ease}
      .macro-win-body.macro-pal-dim .macro-row,.macro-win-body.macro-pal-dim .macro-section-header,.macro-win-body.macro-pal-dim .macro-sep,.macro-win-body.macro-pal-dim .macro-textarea,.macro-win-body.macro-pal-dim .macro-menu-bind-wrap,.macro-win-body.macro-pal-dim .macro-reset-all-btn,.macro-win-body.macro-pal-dim .macro-tutorial-btn,.macro-win-body.macro-pal-dim .macro-upd-banner{opacity:0.24;pointer-events:none}
      .macro-win-body.macro-pal-dim .macro-row.macro-pal-active{opacity:1;pointer-events:auto;position:relative;z-index:49}
      .macro-win-body.macro-pal-dim .macro-row.macro-pal-active>span{color:var(--macro-title-color,#fff);text-shadow:var(--macro-pal-glow,0 0 8px rgba(255,255,255,0.28))}
      .macro-rev-hdr-r{display:inline-flex;align-items:center;gap:0.45em}
      .macro-rev-mtd-lbl{font-size:1em;font-weight:500;color:var(--macro-muted-text,#9aa0a6);text-transform:none;letter-spacing:0;white-space:nowrap;transition:color 0.28s ease}
      .macro-section-header .macro-pos-btn{width:auto;min-width:0;font-size:0.95em;padding:0.26em 0.52em;text-transform:none;letter-spacing:0;white-space:nowrap}
      #macro-revmtd-pop,#macro-ffmtd-pop,#macro-solofocus-pop{width:max-content;min-width:7.2em;max-width:13.5em}
            .macro-win-body.macro-pal-dim .macro-section-header.macro-pal-active{opacity:1;pointer-events:auto;position:relative;z-index:49}
            .macro-win-body.macro-pal-dim .macro-section-header.macro-pal-active>span{color:var(--macro-title-color,#fff);text-shadow:var(--macro-pal-glow,0 0 8px rgba(255,255,255,0.28))}
      .macro-pos-btn{display:inline-flex;align-items:center;justify-content:space-between;gap:0.35em;width:6.2em;box-sizing:border-box;background:var(--macro-btn-bg,#242424);border:1px solid var(--macro-btn-border,#383838);color:var(--macro-btn-text,#eee);border-radius:0.35em;padding:0.36em 0.55em;font-family:inherit;font-size:0.9em;font-weight:600;cursor:pointer;transition:border-color 0.16s,filter 0.14s,color 0.28s ease}
      .macro-pos-btn:hover{filter:brightness(1.14)}
      .macro-pos-btn.open{border-color:var(--macro-accent-muted,rgba(255,255,255,0.48))}
      .macro-pos-btn .macro-lang-chev{width:0.9em;height:0.9em}
      #macro-xhair-btn{width:auto;min-width:6.2em;max-width:9.2em}
            #macro-grid-btn{width:auto;min-width:6.2em;max-width:9.8em}
            #macro-xhair-pop,#macro-grid-pop{width:max-content;min-width:6.2em;max-width:13.5em}
      .macro-pos-pop{display:none;position:absolute;left:auto;top:auto;box-sizing:border-box;padding:0.22em;background:var(--macro-lang-bg,rgba(24,24,24,0.98));border:1px solid var(--macro-border,#2e2e2e);border-radius:0.5em;box-shadow:0 14px 36px rgba(0,0,0,0.88);z-index:52;opacity:0;visibility:hidden;pointer-events:none;transform-origin:top center;transform:scale(0.95) translateY(-4px);transition:opacity 0.18s cubic-bezier(0.22,1,0.36,1),transform 0.2s cubic-bezier(0.22,1,0.36,1),visibility 0s linear 0.2s}
      .macro-pos-pop.drop-up{transform-origin:bottom center;transform:scale(0.95) translateY(4px)}
      #macro-window.open:not(.settings-open) .macro-pos-pop.open{opacity:1;visibility:visible;pointer-events:auto;transform:scale(1) translateY(0);transition:opacity 0.18s cubic-bezier(0.22,1,0.36,1),transform 0.2s cubic-bezier(0.22,1,0.36,1),visibility 0s linear 0s}
      .macro-pos-opt{width:100%;display:flex;align-items:center;gap:0.4em;padding:0.36em 0.44em;border:none;border-radius:0.34em;background:transparent;color:var(--macro-text,#d2d2d2);font-family:inherit;font-size:0.88em;cursor:pointer;text-align:left;transition:background 0.14s,color 0.14s}
      .macro-pos-opt:hover{background:rgba(128,128,128,0.14);color:var(--macro-title-color,#fff)}
      .macro-pos-opt.active{background:var(--macro-opt-act-bg,rgba(255,255,255,0.1));color:var(--macro-title-color,#fff);font-weight:700}
      .macro-pos-opt.active .macro-lang-bar{opacity:1;transform:scaleY(1)}
      #macro-revnot-toast{position:fixed;top:6px;bottom:auto;left:0;opacity:0;pointer-events:none !important;user-select:none !important;-webkit-user-select:none !important;z-index:999998;font-family:'Ubuntu',sans-serif,Arial;line-height:1.25;letter-spacing:normal;text-shadow:none;-webkit-font-smoothing:antialiased;transition:opacity 0.16s ease,top 0.2s cubic-bezier(0.22,1,0.36,1),bottom 0.2s cubic-bezier(0.22,1,0.36,1)}
      #macro-revnot-toast,#macro-revnot-toast *{box-sizing:border-box;text-shadow:none}
      #macro-revnot-toast.pos-bottom{top:auto;bottom:6px}
      #macro-revnot-toast.open{top:14px;opacity:1}
      #macro-revnot-toast.pos-bottom.open{top:auto;bottom:14px}
      .macro-revnot-box{position:relative;display:inline-flex;align-items:center;gap:10px;padding:7px 12px;background:var(--macro-win-bg,rgba(20,20,20,0.94));backdrop-filter:blur(8px);border:1px solid var(--macro-border,#333);border-radius:8px;box-shadow:0 10px 28px rgba(0,0,0,0.72);overflow:hidden}
      .macro-revnot-tag{font-size:10px;font-weight:700;line-height:1.2;letter-spacing:0.8px;text-transform:uppercase;color:var(--macro-muted-text,#9aa0a6)}
      .macro-revnot-sep{width:1px;height:14px;background:var(--macro-sep,rgba(255,255,255,0.12))}
      .macro-revnot-lbl{font-size:12px;font-weight:500;line-height:1.2;color:var(--macro-text,#ddd)}
      .macro-revnot-val{display:inline-flex;align-items:center;justify-content:center;min-width:28px;padding:3px 8px;border-radius:4px;background:var(--macro-accent,#f2f2f4);color:var(--macro-accent-text,#111114);font-size:12px;font-weight:700;line-height:1;font-variant-numeric:tabular-nums}
      .macro-revnot-mult{font-size:11px;font-weight:700;line-height:1.2;color:var(--macro-muted-text,#8e949c);font-variant-numeric:tabular-nums}
      .macro-revnot-bar{position:absolute;left:0;bottom:0;height:2px;width:100%;background:var(--macro-accent,rgba(242,242,244,0.8));opacity:0.75;transform-origin:left center}
      .macro-revnot-bar.run{animation:macroRevNotShrink 1.6s linear forwards}
      @keyframes macroRevNotShrink{from{transform:scaleX(1)}to{transform:scaleX(0)}}
      #macro-window:not(.open),#macro-window:not(.open) *{pointer-events:none !important}
      #macro-window *:not(input):not(textarea)::selection{background:transparent}
      #macro-window input,#macro-window textarea{user-select:text !important;-webkit-user-select:text !important;cursor:text}
      #macro-window input::selection,#macro-window textarea::selection{background:var(--macro-sel-bg,rgba(56,152,236,0.48));color:var(--macro-sel-fg,#ffffff)}
      body.macro-txt-sel-on *:not(#macro-window):not(#macro-window *):not(#macro-toggle-pill):not(#macro-bypass-map):not(#macro-bypass-map *):not(#autorev-overlay):not(#macro-bg-canvas):not(#macro-grid-canvas):not(#macro-curline-canvas):not(canvas):not(input[type="range"]):not(input[type="checkbox"]):not(input[type="radio"]):not(input[type="color"]):not(.macro-txt-layer){user-select:text !important;-webkit-user-select:text !important}
      body.macro-txt-sel-on *:not(#macro-window):not(#macro-window *):not(#macro-toggle-pill):not(#macro-bypass-map):not(#macro-bypass-map *):not(#autorev-overlay):not(#macro-bg-canvas):not(#macro-grid-canvas):not(#macro-curline-canvas):not(canvas):not(button):not(a):not(select):not(input):not(textarea):not(.macro-txt-layer){cursor:auto}

      body.macro-txt-sel-on .macro-pe-txt{pointer-events:auto !important;cursor:text !important}
      .macro-txt-layer{position:fixed;left:0;top:0;width:0;height:0;pointer-events:none !important;overflow:hidden;margin:0;padding:0;border:0;user-select:none !important;-webkit-user-select:none !important}
      .macro-cvs-txt{position:absolute;left:0;top:0;margin:0;padding:0;border:0;white-space:pre;display:block;width:max-content;transform-origin:0 0;color:transparent !important;background:transparent !important;font-family:'Ubuntu',sans-serif,Arial;font-size:20px;font-weight:700;line-height:20px;height:20px;user-select:text !important;-webkit-user-select:text !important;pointer-events:auto !important;cursor:text !important;box-sizing:border-box}
      .macro-cvs-txt::selection{background:rgba(51,153,255,0.45) !important;color:transparent !important}
      body.macro-txt-bypass .macro-cvs-txt,body.macro-txt-bypass .macro-pe-txt{pointer-events:none !important}
      #macro-row-bpttl .macro-controls-group{min-width:0;flex:0 0 auto;justify-content:flex-end;gap:0.45em}
      #macro-row-bpttl .macro-slider-track{width:5.5em;max-width:5.5em;min-width:3em;flex:0 1 5.5em}
      #macro-row-bpttl .macro-num-wrap{flex-shrink:0}
      #macro-row-bpttl .macro-num-input{width:3.5em}
      #macro-bpmtd-btn{width:auto;min-width:6.2em;max-width:10.5em}
      #macro-bpradar-btn{width:auto;min-width:6.2em;max-width:9.2em}
      #macro-bpmtd-pop,#macro-bpradar-pop,#macro-holdmode-pop{width:max-content;min-width:6.2em;max-width:13.5em}
      #macro-row-holdspam>span{flex:1 1 auto;min-width:4.8em;line-height:1.2}
      #macro-row-holdspam .macro-controls-group{flex:0 1 auto;min-width:0;flex-wrap:wrap;justify-content:flex-end;gap:0.4em}
      #macro-row-holdspam .macro-bind-btn{min-width:4em;padding:0.4em 0.6em}
      #macro-holdmode-btn{width:auto;min-width:5.4em;max-width:9.8em}
      #macro-bypass-map{position:fixed;right:12px;bottom:225px;width:220px;height:220px;box-sizing:border-box;background:rgba(14,15,19,0.88);border:1px solid #323540;border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,0.65);z-index:999994;overflow:hidden;cursor:grab;display:none;touch-action:none;user-select:none}
      #macro-bypass-map:active{cursor:grabbing}
      #macro-bypass-map canvas{display:block;width:100%;height:100%;pointer-events:none}
      #macro-bypass-map.macro-bp-locked,#macro-bypass-map.macro-bp-locked *{pointer-events:none !important}
      .macro-bp-rsz{position:absolute;background:transparent;z-index:2;touch-action:none}
      .macro-bp-rsz-n{top:0;left:10px;right:10px;height:6px;cursor:ns-resize}
      .macro-bp-rsz-s{bottom:0;left:10px;right:10px;height:6px;cursor:ns-resize}
      .macro-bp-rsz-w{left:0;top:10px;bottom:10px;width:6px;cursor:ew-resize}
      .macro-bp-rsz-e{right:0;top:10px;bottom:10px;width:6px;cursor:ew-resize}
      .macro-bp-rsz-nw{top:0;left:0;width:10px;height:10px;cursor:nwse-resize}
      .macro-bp-rsz-ne{top:0;right:0;width:10px;height:10px;cursor:nesw-resize}
      .macro-bp-rsz-sw{bottom:0;left:0;width:10px;height:10px;cursor:nesw-resize}
      .macro-bp-rsz-se{bottom:0;right:0;width:10px;height:10px;cursor:nwse-resize}
    `;
    document.head.appendChild(st);

    const pill = document.createElement("div");
    pill.id = "macro-toggle-pill";
    pill.textContent = "MULTIBOX";
    document.body.appendChild(pill);
    v6WpL2sT(pill);

    const win = document.createElement("div");
    win.id = "macro-window";
    const vpW0 = document.documentElement.clientWidth || window.innerWidth;
    const initW = Math.max(280, m9TvL2sP.winWidth || 320);
    const initH = Math.max(320, m9TvL2sP.winHeight || 560);
    win.style.width = initW + "px";
    win.style.height = initH + "px";
    win.style.minWidth = "280px";
    win.style.minHeight = "320px";
    const initT = m9TvL2sP.winY !== null ? Math.max(0, m9TvL2sP.winY) : 52;
    if (m9TvL2sP.winX === null || m9TvL2sP.winX >= vpW0 - initW - 10) {
      win.style.left = "auto";
      win.style.right = "0px";
    } else {
      win.style.left = Math.max(0, m9TvL2sP.winX) + "px";
      win.style.right = "auto";
    }
    win.style.top = initT + "px";
    win.style.bottom = "auto";

    const mkR = (arr) =>
      arr
        .map((r, idx) => {
          let sp = "";
          if (r.id.startsWith("keyT")) sp = `data-i18n-trick="${idx + 1}"`;
          else if (r.id === "keyRevLock") sp = 'data-i18n="lock"';
          else if (r.id === "keyRevUnlock") sp = 'data-i18n="unlock"';
          else if (r.id.startsWith("keyRevSplit"))
            sp = `data-i18n-selrev="${idx + 1}"`;
          return `
      <div class="macro-row">
        <span ${sp}>${r.label}</span>
        <div class="macro-btn-group">
          <button class="macro-bind-btn" id="macro-btn-${r.id}" data-id="${r.id}">${p7TvM3wL(m9TvL2sP[r.id])}</button>
          <button class="macro-rst-btn" data-reset="${r.id}" data-i18n="rst">${k3Tr("rst")}</button>
        </div>
      </div>`;
        })
        .join("");

    const curLangObj =
      t3LangList.find((l) => l.code === m9TvL2sP.lang) || t3LangList[0];

    win.innerHTML = `
      <div class="macro-win-header">
        <div role="button" tabindex="0" class="macro-gear-btn" id="macro-settings-btn" title="${k3Tr("cfg")}" aria-label="${k3Tr("cfg")}" data-i18n-title="cfg" data-i18n-aria="cfg"><svg viewBox="0 0 24 24" fill-rule="evenodd"><path d="M10.36 4.89L10.81 2.27Q10.95 1.45 12 1.45Q13.05 1.45 13.19 2.27L13.64 4.89A7.3 7.3 0 0 1 15.87 5.81L18.04 4.28Q18.72 3.8 19.46 4.54Q20.2 5.28 19.72 5.96L18.19 8.13A7.3 7.3 0 0 1 19.11 10.36L21.73 10.81Q22.55 10.95 22.55 12Q22.55 13.05 21.73 13.19L19.11 13.64A7.3 7.3 0 0 1 18.19 15.87L19.72 18.04Q20.2 18.72 19.46 19.46Q18.72 20.2 18.04 19.72L15.87 18.19A7.3 7.3 0 0 1 13.64 19.11L13.19 21.73Q13.05 22.55 12 22.55Q10.95 22.55 10.81 21.73L10.36 19.11A7.3 7.3 0 0 1 8.13 18.19L5.96 19.72Q5.28 20.2 4.54 19.46Q3.8 18.72 4.28 18.04L5.81 15.87A7.3 7.3 0 0 1 4.89 13.64L2.27 13.19Q1.45 13.05 1.45 12Q1.45 10.95 2.27 10.81L4.89 10.36A7.3 7.3 0 0 1 5.81 8.13L4.28 5.96Q3.8 5.28 4.54 4.54Q5.28 3.8 5.96 4.28L8.13 5.81A7.3 7.3 0 0 1 10.36 4.89ZM12 15.4A3.4 3.4 0 0 0 12 8.6A3.4 3.4 0 0 0 12 15.4Z"/></svg></div>
        <span class="macro-header-title-wrap">
          <span class="macro-header-title macro-title-main">Multibox by Kuksik &amp; Judex</span>
          <span class="macro-header-title macro-title-cfg" data-i18n="cfg">${k3Tr("cfg")}</span>
        </span>
      </div>
      <div class="macro-win-stage">
        <div class="macro-pane-main">
          <div class="macro-win-body">
        <a id="macro-ver-banner" class="macro-upd-banner" href="https://raw.githubusercontent.com/kuksikoid/gota-multibox-guide/main/MultiBox.user.js" target="_blank" rel="noopener noreferrer"></a>
        <div class="macro-section-header" id="macro-hdr-ff">
          <span data-i18n="secFf">${k3Tr("secFf")}</span>
          <div class="macro-rev-hdr-r">
            <span class="macro-rev-mtd-lbl" data-i18n="revMtd">${k3Tr("revMtd")}</span>
            <button type="button" class="macro-pos-btn" id="macro-ffmtd-btn">
              <span class="macro-lang-cur" id="macro-ffmtd-cur">${k3Tr(m9TvL2sP.ffMethod === "auto" ? "ffAuto" : "ffMan")}</span>
              <svg class="macro-lang-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
            </button>
          </div>
        </div>
        <div id="macro-ff-manual-wrap">
          <div class="macro-row">
            <span data-i18n="ffDel">${k3Tr("ffDel")}</span>
            <div class="macro-controls-group">
              <div class="macro-slider-track" id="macro-track-auto" data-key="autoDelay"><div class="macro-slider-fill"></div></div>
              <div class="macro-num-wrap">
                <button type="button" class="macro-step-btn" id="macro-dec-auto"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>
                <input type="text" inputmode="numeric" class="macro-num-input" id="macro-num-auto" data-min="50" data-max="3000" data-step="10" value="${m9TvL2sP.autoDelay}" spellcheck="false">
                <button type="button" class="macro-step-btn" id="macro-inc-auto"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></button>
              </div>
            </div>
          </div>
          <div id="macro-ff-delays"></div>
          <div class="macro-row">
            <div class="macro-ff-label-wrap">
              <span data-i18n="ff">${k3Tr("ff")}</span>
              <div role="button" tabindex="0" class="macro-ff-add-btn" id="macro-ff-add-btn" title="${k3Tr("ffAdd")}" aria-label="${k3Tr("ffAdd")}" data-i18n-title="ffAdd" data-i18n-aria="ffAdd"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 3.5v9M3.5 8h9"/></svg></div>
            </div>
            <div class="macro-btn-group">
              <button class="macro-bind-btn" id="macro-btn-keyAuto" data-id="keyAuto">${p7TvM3wL(m9TvL2sP.keyAuto)}</button>
              <button class="macro-rst-btn" data-reset="keyAuto" data-i18n="rst">${k3Tr("rst")}</button>
            </div>
          </div>
          <div id="macro-ff-binds"></div>
        </div>
        <div id="macro-ff-auto-wrap">
          <div class="macro-row">
            <span data-i18n="ffLock">${k3Tr("ffLock")}</span>
            <div class="macro-btn-group">
              <button class="macro-bind-btn" id="macro-btn-keyFfLock" data-id="keyFfLock">${p7TvM3wL(m9TvL2sP.keyFfLock)}</button>
              <button class="macro-rst-btn" data-reset="keyFfLock" data-i18n="rst">${k3Tr("rst")}</button>
            </div>
          </div>
          <div class="macro-row">
            <span data-i18n="ffAct">${k3Tr("ffAct")}</span>
            <div class="macro-btn-group">
              <button class="macro-bind-btn" id="macro-btn-keyFfActivate" data-id="keyFfActivate">${p7TvM3wL(m9TvL2sP.keyFfActivate)}</button>
              <button class="macro-rst-btn" data-reset="keyFfActivate" data-i18n="rst">${k3Tr("rst")}</button>
            </div>
          </div>
        </div>
        <div class="macro-sep"></div>
        <div class="macro-section-header" id="macro-hdr-solo">
          <span data-i18n="secSolo">${k3Tr("secSolo")}</span>
          <div class="macro-rev-hdr-r">
            <span class="macro-rev-mtd-lbl" data-i18n="soloFoc">${k3Tr("soloFoc")}</span>
            <button type="button" class="macro-pos-btn" id="macro-solofocus-btn">
              <span class="macro-lang-cur" id="macro-solofocus-cur">${k3Tr(m9TvL2sP.soloFocus === "window" ? "sfWin" : "sfMb")}</span>
              <svg class="macro-lang-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
            </button>
          </div>
        </div>
        <div class="macro-row">
          <span data-i18n="soloDel">${k3Tr("soloDel")}</span>
          <div class="macro-controls-group">
            <div class="macro-slider-track" id="macro-track-solo" data-key="soloDelay"><div class="macro-slider-fill"></div></div>
            <div class="macro-num-wrap">
              <button type="button" class="macro-step-btn" id="macro-dec-solo"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>
              <input type="text" inputmode="numeric" class="macro-num-input" id="macro-num-solo" data-min="50" data-max="3000" data-step="10" value="${m9TvL2sP.soloDelay}" spellcheck="false">
              <button type="button" class="macro-step-btn" id="macro-inc-solo"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></button>
            </div>
          </div>
        </div>
        ${mkR(y4WpS9vT)}
        <div class="macro-sep"></div>
        <div class="macro-section-header" id="macro-hdr-rev">
                  <span data-i18n="secRev">${k3Tr("secRev")}</span>
                  <div class="macro-rev-hdr-r">
                    <span class="macro-rev-mtd-lbl" data-i18n="revMtd">${k3Tr("revMtd")}</span>
                    <button type="button" class="macro-pos-btn" id="macro-revmtd-btn">
              <span class="macro-lang-cur" id="macro-revmtd-cur">${m9TvL2sP.revMethod === "pixi" ? "Pixi" : "WebSocket"}</span>
              <svg class="macro-lang-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <div class="macro-info-wrap" id="macro-rev-info" style="display:${m9TvL2sP.revMethod === "pixi" ? "inline-flex" : "none"}"><span class="macro-info-icon"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.6a1 1 0 0 1 1 1v5.1a1 1 0 1 1-2 0V3.6a1 1 0 0 1 1-1Zm0 8.55a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z"/></svg></span><div class="macro-info-tooltip" data-i18n="tipRev">${k3Tr("tipRev")}</div></div>
          </div>
        </div>
        ${mkR(w9QnL2xM)}
        <div class="macro-row" id="macro-row-revnot">
          <span data-i18n="revNot">${k3Tr("revNot")}</span>
          <div class="macro-controls-group">
            <button type="button" class="macro-pos-btn" id="macro-revnot-btn">
              <span class="macro-lang-cur" id="macro-revnot-cur">${k3Tr(m9TvL2sP.revNotifyPos === "bottom" ? "posBot" : "posTop")}</span>
              <svg class="macro-lang-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <label class="macro-switch">
              <input type="checkbox" id="macro-toggle-revnot">
              <span class="macro-switch-slider"></span>
            </label>
          </div>
        </div>
        <div class="macro-row">
          <span data-i18n="revSp">${k3Tr("revSp")}</span>
          <div class="macro-chips-container">
            ${[2, 4, 8, 16, 32, 64, 128, 256].map((s, i) => `<button type="button" class="macro-split-chip" data-split="${s}">${i + 1}x</button>`).join("")}
          </div>
        </div>
        ${mkR(k5TxM8wL)}
        <div class="macro-sep"></div>
        <div class="macro-section-header">
          <span data-i18n="secOpt">${k3Tr("secOpt")}</span>
          <div class="macro-info-wrap"><span class="macro-info-icon"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.6a1 1 0 0 1 1 1v5.1a1 1 0 1 1-2 0V3.6a1 1 0 0 1 1-1Zm0 8.55a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z"/></svg></span><div class="macro-info-tooltip" data-i18n="tipOpt">${k3Tr("tipOpt")}</div></div>
        </div>
        <div class="macro-row">
          <span data-i18n="cull">${k3Tr("cull")}</span>
          <label class="macro-switch">
            <input type="checkbox" id="macro-toggle-culling">
            <span class="macro-switch-slider"></span>
          </label>
        </div>
        <div class="macro-row">
          <span data-i18n="filt">${k3Tr("filt")}</span>
          <label class="macro-switch">
            <input type="checkbox" id="macro-toggle-filters">
            <span class="macro-switch-slider"></span>
          </label>
        </div>
        <div class="macro-row" id="macro-row-margin">
          <span data-i18n="marg">${k3Tr("marg")}</span>
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
        <div class="macro-row" id="macro-row-rscale">
          <span data-i18n="rScale">${k3Tr("rScale")}</span>
          <div class="macro-controls-group">
            <div class="macro-num-wrap">
              <button type="button" class="macro-step-btn" id="macro-dec-rscale"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>
              <input type="text" inputmode="numeric" class="macro-num-input" id="macro-num-rscale" data-min="25" data-max="100" data-step="5" value="${m9TvL2sP.renderScale}" spellcheck="false">
              <button type="button" class="macro-step-btn" id="macro-inc-rscale"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></button>
            </div>
            <div class="macro-slider-track" id="macro-track-rscale" data-key="renderScale"><div class="macro-slider-fill"></div></div>
            <label class="macro-switch">
              <input type="checkbox" id="macro-toggle-rscale">
              <span class="macro-switch-slider"></span>
            </label>
          </div>
        </div>
        <div class="macro-sep"></div>
        <div class="macro-section-header"><span data-i18n="secBg">${k3Tr("secBg")}</span></div>
        <div class="macro-row" id="macro-row-map-grid">
                  <span data-i18n="mapGrid">${k3Tr("mapGrid")}</span>
                  <div class="macro-controls-group">
                    <button type="button" class="macro-pos-btn" id="macro-grid-btn">
                      <span class="macro-lang-cur" id="macro-grid-cur">${k3Tr(m9TvL2sP.mapGridMode === "over" ? "gridOver" : "gridBg")}</span>
                      <svg class="macro-lang-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
                    </button>
                    <label class="macro-switch">
                      <input type="checkbox" id="macro-toggle-map-grid">
                      <span class="macro-switch-slider"></span>
                    </label>
                  </div>
                </div>
        <div class="macro-row" id="macro-row-map-bg">
          <span data-i18n="mapBg">${k3Tr("mapBg")}</span>
          <div class="macro-btn-group">
            <button type="button" class="macro-icon-btn" id="macro-btn-map-file" title="${k3Tr("fFile")}" data-i18n-title="fFile"><svg viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg></button>
            <button type="button" class="macro-icon-btn" id="macro-btn-map-url" title="${k3Tr("fUrl")}" data-i18n-title="fUrl"><svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg></button>
            <button type="button" class="macro-icon-btn macro-trash-btn" id="macro-btn-map-rst" title="${k3Tr("rst")}" data-i18n-title="rst"><svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></button>
            <label class="macro-switch">
              <input type="checkbox" id="macro-toggle-map-bg">
              <span class="macro-switch-slider"></span>
            </label>
          </div>
        </div>
        <div class="macro-row" id="macro-row-fixed-bg">
          <span data-i18n="fixBg">${k3Tr("fixBg")}</span>
          <div class="macro-btn-group">
            <button type="button" class="macro-icon-btn" id="macro-btn-fixed-file" title="${k3Tr("fFile")}" data-i18n-title="fFile"><svg viewBox="0 0 24 24"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg></button>
            <button type="button" class="macro-icon-btn" id="macro-btn-fixed-url" title="${k3Tr("fUrl")}" data-i18n-title="fUrl"><svg viewBox="0 0 24 24"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg></button>
            <button type="button" class="macro-icon-btn macro-trash-btn" id="macro-btn-fixed-rst" title="${k3Tr("rst")}" data-i18n-title="rst"><svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg></button>
            <label class="macro-switch">
              <input type="checkbox" id="macro-toggle-fixed-bg">
              <span class="macro-switch-slider"></span>
            </label>
          </div>
        </div>
        <div class="macro-sep"></div>
        <div class="macro-section-header">
          <span data-i18n="secBypass">${k3Tr("secBypass")}</span>
          <div class="macro-info-wrap"><span class="macro-info-icon"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2.6a1 1 0 0 1 1 1v5.1a1 1 0 1 1-2 0V3.6a1 1 0 0 1 1-1Zm0 8.55a1.15 1.15 0 1 1 0 2.3 1.15 1.15 0 0 1 0-2.3Z"/></svg></span><div class="macro-info-tooltip" data-i18n="tipBypass">${k3Tr("tipBypass")}</div></div>
        </div>
        <div class="macro-row">
          <span data-i18n="bpEnable">${k3Tr("bpEnable")}</span>
          <label class="macro-switch">
            <input type="checkbox" id="macro-toggle-bypass">
            <span class="macro-switch-slider"></span>
          </label>
        </div>
        <div class="macro-row" id="macro-row-bpmethod">
          <span data-i18n="bpMethod">${k3Tr("bpMethod")}</span>
          <button type="button" class="macro-pos-btn" id="macro-bpmtd-btn">
            <span class="macro-lang-cur" id="macro-bpmtd-cur">${b6ModeLabel(m9TvL2sP.bypassMethod)}</span>
            <svg class="macro-lang-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
          </button>
        </div>
        <div class="macro-row" id="macro-row-bpttl">
          <span data-i18n="bpTtl">${k3Tr("bpTtl")}</span>
          <div class="macro-controls-group">
            <div class="macro-slider-track" id="macro-track-bpttl" data-key="bypassTtl"><div class="macro-slider-fill"></div></div>
            <div class="macro-num-wrap">
              <button type="button" class="macro-step-btn" id="macro-dec-bpttl"><svg viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg></button>
              <input type="text" inputmode="numeric" class="macro-num-input" id="macro-num-bpttl" data-min="1500" data-max="25000" data-step="250" value="${m9TvL2sP.bypassTtl}" spellcheck="false">
              <button type="button" class="macro-step-btn" id="macro-inc-bpttl"><svg viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg></button>
            </div>
          </div>
        </div>
        <div class="macro-row">
          <span data-i18n="bpPhantoms">${k3Tr("bpPhantoms")}</span>
          <label class="macro-switch">
            <input type="checkbox" id="macro-toggle-bpphantoms">
            <span class="macro-switch-slider"></span>
          </label>
        </div>
        <div class="macro-row" id="macro-row-bpradar">
          <span data-i18n="bpRadar">${k3Tr("bpRadar")}</span>
          <div class="macro-controls-group">
            <button type="button" class="macro-pos-btn" id="macro-bpradar-btn">
              <span class="macro-lang-cur" id="macro-bpradar-cur">${k3Tr(m9TvL2sP.bypassRadarMode === "fixed" ? "bpRadFixed" : "bpRadReal")}</span>
              <svg class="macro-lang-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <label class="macro-switch">
              <input type="checkbox" id="macro-toggle-bpradar">
              <span class="macro-switch-slider"></span>
            </label>
          </div>
        </div>
        <div class="macro-row">
          <span data-i18n="bpLockRadar">${k3Tr("bpLockRadar")}</span>
          <label class="macro-switch">
            <input type="checkbox" id="macro-toggle-bpradarlock">
            <span class="macro-switch-slider"></span>
          </label>
        </div>
        <div class="macro-pos-pop" id="macro-bpmtd-pop">
          <div class="macro-lang-list">
            <button type="button" class="macro-pos-opt${m9TvL2sP.bypassMethod === "smart" ? " active" : ""}" data-bpmtd="smart"><span class="macro-lang-bar"></span><span class="macro-lang-name">Smart</span></button>
            <button type="button" class="macro-pos-opt${m9TvL2sP.bypassMethod === "nearme" ? " active" : ""}" data-bpmtd="nearme"><span class="macro-lang-bar"></span><span class="macro-lang-name">Near Me</span></button>
            <button type="button" class="macro-pos-opt${m9TvL2sP.bypassMethod === "cursor" ? " active" : ""}" data-bpmtd="cursor"><span class="macro-lang-bar"></span><span class="macro-lang-name">Cursor</span></button>
            <button type="button" class="macro-pos-opt${m9TvL2sP.bypassMethod === "biggest" ? " active" : ""}" data-bpmtd="biggest"><span class="macro-lang-bar"></span><span class="macro-lang-name">Biggest</span></button>
            <button type="button" class="macro-pos-opt${m9TvL2sP.bypassMethod === "lb" ? " active" : ""}" data-bpmtd="lb"><span class="macro-lang-bar"></span><span class="macro-lang-name">Leaderboard</span></button>
          </div>
        </div>
        <div class="macro-pos-pop" id="macro-bpradar-pop">
          <div class="macro-lang-list">
            <button type="button" class="macro-pos-opt${m9TvL2sP.bypassRadarMode !== "fixed" ? " active" : ""}" data-bprad="real"><span class="macro-lang-bar"></span><span class="macro-lang-name" data-i18n="bpRadReal">${k3Tr("bpRadReal")}</span></button>
            <button type="button" class="macro-pos-opt${m9TvL2sP.bypassRadarMode === "fixed" ? " active" : ""}" data-bprad="fixed"><span class="macro-lang-bar"></span><span class="macro-lang-name" data-i18n="bpRadFixed">${k3Tr("bpRadFixed")}</span></button>
          </div>
        </div>
        <div class="macro-sep"></div>
        <div class="macro-section-header"><span data-i18n="secMisc">${k3Tr("secMisc")}</span></div>
        <div class="macro-row" id="macro-row-holdspam">
          <span data-i18n="fixFeed">${k3Tr("fixFeed")}</span>
          <div class="macro-controls-group">
            <button type="button" class="macro-pos-btn" id="macro-holdmode-btn">
              <span class="macro-lang-cur" id="macro-holdmode-cur">${k3Tr(m9TvL2sP.holdSpamMode === "release" ? "hmDrop" : "hmHold")}</span>
              <svg class="macro-lang-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <div class="macro-btn-group">
              <button class="macro-bind-btn" id="macro-btn-keyHoldSpam" data-id="keyHoldSpam">${p7TvM3wL(m9TvL2sP.keyHoldSpam)}</button>
              <button class="macro-rst-btn" data-reset="keyHoldSpam" data-i18n="rst">${k3Tr("rst")}</button>
            </div>
          </div>
        </div>
        <div class="macro-row">
          <span data-i18n="selTxt">${k3Tr("selTxt")}</span>
          <label class="macro-switch">
            <input type="checkbox" id="macro-toggle-seltxt">
            <span class="macro-switch-slider"></span>
          </label>
        </div>
        <div class="macro-row" id="macro-row-xhair">
          <span data-i18n="xhair">${k3Tr("xhair")}</span>
          <div class="macro-controls-group">
            <button type="button" class="macro-pos-btn" id="macro-xhair-btn">
              <span class="macro-lang-cur" id="macro-xhair-cur">${k3Tr(m9TvL2sP.crosshairStyle === "cross" ? "xhCross" : "xhPlus")}</span>
              <svg class="macro-lang-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
            </button>
            <label class="macro-switch">
              <input type="checkbox" id="macro-toggle-xhair">
              <span class="macro-switch-slider"></span>
            </label>
          </div>
        </div>
        <div class="macro-row">
          <span data-i18n="curArr">${k3Tr("curArr")}</span>
          <label class="macro-switch">
            <input type="checkbox" id="macro-toggle-curarrow">
            <span class="macro-switch-slider"></span>
          </label>
        </div>
        <div class="macro-row">
          <span data-i18n="softCol">${k3Tr("softCol")}</span>
          <label class="macro-switch">
            <input type="checkbox" id="macro-toggle-softcol">
            <span class="macro-switch-slider"></span>
          </label>
        </div>
        <div class="macro-sep"></div>
        <div class="macro-section-header"><span data-i18n="secName">${k3Tr("secName")}</span></div>
        ${[
          { id: "skin", k: "skinSt" },
          { id: "name", k: "nameSt" },
          { id: "custom", k: "custSw" },
        ]
          .map(
            (r) => `
          <div class="macro-row">
            <span data-i18n="${r.k}">${k3Tr(r.k)}</span>
            <label class="macro-switch">
              <input type="checkbox" id="macro-toggle-${r.id}">
              <span class="macro-switch-slider"></span>
            </label>
          </div>`,
          )
          .join("")}
        <textarea class="macro-textarea" id="macro-custom-nicks" spellcheck="false"></textarea>
        <div class="macro-menu-bind-wrap">
          <button class="macro-menu-bind-btn" id="macro-btn-keyMenu" data-id="keyMenu">${k3Tr("menuBind")}: ${p7TvM3wL(m9TvL2sP.keyMenu)}</button>
          <button class="macro-menu-rst-btn" id="macro-btn-rst-keyMenu" data-i18n="rst">${k3Tr("rst")}</button>
        </div>
        <button class="macro-reset-all-btn" id="macro-btn-all-reset" data-i18n="rstAll">${k3Tr("rstAll")}</button>
        <a href="https://kuksikoid.github.io/gota-multibox-guide/" target="_blank" class="macro-tutorial-btn" data-i18n="tut">${k3Tr("tut")}</a>
        <div class="macro-pos-pop" id="macro-revnot-pop">
          <div class="macro-lang-list">
            <button type="button" class="macro-pos-opt${m9TvL2sP.revNotifyPos !== "bottom" ? " active" : ""}" data-pos="top"><span class="macro-lang-bar"></span><span class="macro-lang-name" data-i18n="posTop">${k3Tr("posTop")}</span></button>
            <button type="button" class="macro-pos-opt${m9TvL2sP.revNotifyPos === "bottom" ? " active" : ""}" data-pos="bottom"><span class="macro-lang-bar"></span><span class="macro-lang-name" data-i18n="posBot">${k3Tr("posBot")}</span></button>
          </div>
        </div>
        <div class="macro-pos-pop" id="macro-xhair-pop">
                  <div class="macro-lang-list">
                    <button type="button" class="macro-pos-opt${m9TvL2sP.crosshairStyle !== "cross" ? " active" : ""}" data-xhair="plus"><span class="macro-lang-bar"></span><span class="macro-lang-name" data-i18n="xhPlus">${k3Tr("xhPlus")}</span></button>
                    <button type="button" class="macro-pos-opt${m9TvL2sP.crosshairStyle === "cross" ? " active" : ""}" data-xhair="cross"><span class="macro-lang-bar"></span><span class="macro-lang-name" data-i18n="xhCross">${k3Tr("xhCross")}</span></button>
                  </div>
                </div>
                <div class="macro-pos-pop" id="macro-grid-pop">
                  <div class="macro-lang-list">
                    <button type="button" class="macro-pos-opt${m9TvL2sP.mapGridMode !== "over" ? " active" : ""}" data-grid="bg"><span class="macro-lang-bar"></span><span class="macro-lang-name" data-i18n="gridBg">${k3Tr("gridBg")}</span></button>
                    <button type="button" class="macro-pos-opt${m9TvL2sP.mapGridMode === "over" ? " active" : ""}" data-grid="over"><span class="macro-lang-bar"></span><span class="macro-lang-name" data-i18n="gridOver">${k3Tr("gridOver")}</span></button>
                  </div>
                </div>
        <div class="macro-pos-pop" id="macro-solofocus-pop">
          <div class="macro-lang-list">
            <button type="button" class="macro-pos-opt${m9TvL2sP.soloFocus !== "window" ? " active" : ""}" data-solofocus="multibox"><span class="macro-lang-bar"></span><span class="macro-lang-name" data-i18n="sfMb">${k3Tr("sfMb")}</span></button>
            <button type="button" class="macro-pos-opt${m9TvL2sP.soloFocus === "window" ? " active" : ""}" data-solofocus="window"><span class="macro-lang-bar"></span><span class="macro-lang-name" data-i18n="sfWin">${k3Tr("sfWin")}</span></button>
          </div>
        </div>
        <div class="macro-pos-pop" id="macro-revmtd-pop">
          <div class="macro-lang-list">
            <button type="button" class="macro-pos-opt${m9TvL2sP.revMethod !== "pixi" ? " active" : ""}" data-revmtd="ws"><span class="macro-lang-bar"></span><span class="macro-lang-name">WebSocket</span></button>
            <button type="button" class="macro-pos-opt${m9TvL2sP.revMethod === "pixi" ? " active" : ""}" data-revmtd="pixi"><span class="macro-lang-bar"></span><span class="macro-lang-name">Pixi</span></button>
          </div>
        </div>
        <div class="macro-pos-pop" id="macro-holdmode-pop">
          <div class="macro-lang-list">
            <button type="button" class="macro-pos-opt${m9TvL2sP.holdSpamMode !== "release" ? " active" : ""}" data-holdmode="hold"><span class="macro-lang-bar"></span><span class="macro-lang-name" data-i18n="hmHold">${k3Tr("hmHold")}</span></button>
            <button type="button" class="macro-pos-opt${m9TvL2sP.holdSpamMode === "release" ? " active" : ""}" data-holdmode="release"><span class="macro-lang-bar"></span><span class="macro-lang-name" data-i18n="hmDrop">${k3Tr("hmDrop")}</span></button>
          </div>
        </div>
          </div>
        </div>
        <div class="macro-pane-settings">
          <div class="macro-settings-body">
          <div class="macro-section-header"><span data-i18n="secIf">${k3Tr("secIf")}</span></div>
          <div class="macro-row">
            <span data-i18n="geo">${k3Tr("geo")}</span>
            <label class="macro-switch">
              <input type="checkbox" id="macro-toggle-plexus">
              <span class="macro-switch-slider"></span>
            </label>
          </div>
          <div class="macro-row">
            <span data-i18n="syncSz">${k3Tr("syncSz")}</span>
            <label class="macro-switch">
              <input type="checkbox" id="macro-toggle-sync-scale">
              <span class="macro-switch-slider"></span>
            </label>
          </div>
          <div class="macro-row">
                      <span data-i18n="pillTr">${k3Tr("pillTr")}</span>
                      <label class="macro-switch">
                        <input type="checkbox" id="macro-toggle-pill-trans">
                        <span class="macro-switch-slider"></span>
                      </label>
                    </div>
          <div class="macro-sep"></div>
          <div class="macro-section-header"><span data-i18n="secCol">${k3Tr("secCol")}</span></div>
          <div class="macro-row">
            <span data-i18n="mCol">${k3Tr("mCol")}</span>
            <button type="button" class="macro-mini-pal" id="macro-pal-menu" data-target="menu" aria-label="Choose menu color"></button>
          </div>
          <div class="macro-row">
            <span data-i18n="bCol">${k3Tr("bCol")}</span>
            <button type="button" class="macro-mini-pal" id="macro-pal-buttons" data-target="buttons" aria-label="Choose buttons and scrollbar color"></button>
          </div>
          <div class="macro-row">
            <span data-i18n="geo">${k3Tr("geo")}</span>
            <button type="button" class="macro-mini-pal" id="macro-pal-plexus" data-target="plexus" aria-label="Choose geometric effect color"></button>
          </div>
          <div class="macro-sep"></div>
          <div class="macro-section-header"><span data-i18n="secLang">${k3Tr("secLang")}</span></div>
          <div class="macro-row macro-lang-row">
              <span data-i18n="lang">${k3Tr("lang")}</span>
              <button type="button" class="macro-lang-btn" id="macro-lang-btn">
                <span class="macro-lang-cur" id="macro-lang-cur">${curLangObj.name} (${curLangObj.code.toUpperCase()})</span>
                <svg class="macro-lang-chev" viewBox="0 0 24 24"><path d="M6 9l6 6 6-6"/></svg>
              </button>
          </div>
          <div class="macro-sep"></div>
                    <div class="macro-section-header"><span data-i18n="secCfg">${k3Tr("secCfg")}</span></div>
                    <textarea class="macro-textarea macro-cfg-json" id="macro-cfg-json" spellcheck="false" data-i18n-ph="cfgPh" placeholder="${k3Tr("cfgPh")}"></textarea>
                    <div class="macro-cfg-btns">
                      <button type="button" class="macro-cfg-btn" id="macro-btn-cfg-copy" data-i18n="cfgCopy">${k3Tr("cfgCopy")}</button>
                      <button type="button" class="macro-cfg-btn" id="macro-btn-cfg-apply" data-i18n="cfgApply">${k3Tr("cfgApply")}</button>
                    </div>
          <div class="macro-lang-pop" id="macro-lang-pop">
            <div class="macro-lang-list" id="macro-lang-list">
              ${t3LangList.map((l) => `<button type="button" class="macro-lang-opt${l.code === m9TvL2sP.lang ? " active" : ""}" data-lang="${l.code}"><span class="macro-lang-bar"></span><span class="macro-lang-name">${l.name}</span><span class="macro-lang-code">${l.code.toUpperCase()}</span></button>`).join("")}
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
              <button type="button" class="macro-rgb-rst" id="macro-rgb-rst" data-i18n="rst">${k3Tr("rst")}</button>
            </div>
          </div>
          </div>
        </div>
      </div>
      ${["nw", "ne", "sw", "se"].map((d) => `<div class="macro-resizer macro-resizer-${d}" data-dir="${d}"></div>`).join("")}
    `;
    const g9QmV3xR = win.querySelector(".macro-win-stage");
    const c1XnL4vP = document.createElement("canvas");
    c1XnL4vP.id = "macro-plexus-canvas";
    g9QmV3xR.insertBefore(c1XnL4vP, g9QmV3xR.firstChild);
    document.body.appendChild(win);
    b6BpWinEl = win;
    const rnToast = document.createElement("div");
    rnToast.id = "macro-revnot-toast";
    if (m9TvL2sP.revNotifyPos === "bottom") rnToast.classList.add("pos-bottom");
    rnToast.innerHTML = `
      <div class="macro-revnot-box">
        <span class="macro-revnot-tag">Auto-Rev</span>
        <span class="macro-revnot-sep"></span>
        <span class="macro-revnot-lbl" id="macro-revnot-lbl">${k3Tr("splitsLbl")}</span>
        <span class="macro-revnot-val" id="macro-revnot-val">2x</span>
        <span class="macro-revnot-mult" id="macro-revnot-mult">(4c)</span>
        <div class="macro-revnot-bar" id="macro-revnot-bar"></div>
      </div>
    `;
    document.body.appendChild(rnToast);
    const rnLblEl = document.getElementById("macro-revnot-lbl");
    const rnValEl = document.getElementById("macro-revnot-val");
    const rnMultEl = document.getElementById("macro-revnot-mult");
    const rnBarEl = document.getElementById("macro-revnot-bar");
    let rnHideTm = 0;

    function r9CenterToast() {
      const vpW = document.documentElement.clientWidth || window.innerWidth;
      const w = rnToast.offsetWidth;
      if (w > 0) rnToast.style.left = Math.round((vpW - w) * 0.5) + "px";
    }
    window.addEventListener("resize", () => {
      if (rnToast.classList.contains("open")) r9CenterToast();
    });

    r9RevNotClr = () => {
      clearTimeout(rnHideTm);
      rnToast.classList.remove("open");
      if (rnBarEl) rnBarEl.classList.remove("run");
    };

    r9RevNotFn = (sp) => {
      if (!m9TvL2sP.revNotify) return;
      const val = parseInt(sp, 10) || 4;
      const pw = Math.max(1, Math.min(8, Math.round(Math.log2(val))));
      rnToast.classList.toggle(
        "pos-bottom",
        m9TvL2sP.revNotifyPos === "bottom",
      );
      if (rnLblEl) rnLblEl.textContent = k3Tr("splitsLbl");
      if (rnValEl) rnValEl.textContent = pw + "x";
      if (rnMultEl) rnMultEl.textContent = "(" + val + "c)";
      r9CenterToast();
      if (rnBarEl) {
        rnBarEl.classList.remove("run");
        void rnBarEl.offsetWidth;
        rnBarEl.classList.add("run");
      }
      rnToast.classList.add("open");
      clearTimeout(rnHideTm);
      rnHideTm = setTimeout(() => rnToast.classList.remove("open"), 1600);
    };

    const mapWin = document.createElement("div");
    mapWin.id = "macro-bypass-map";
    const rdCvEl = document.createElement("canvas");
    rdCvEl.id = "macro-bypass-radar";
    mapWin.appendChild(rdCvEl);
    ["n", "s", "w", "e", "nw", "ne", "sw", "se"].forEach((dir) => {
      const h = document.createElement("div");
      h.className = "macro-bp-rsz macro-bp-rsz-" + dir;
      h.setAttribute("data-bp-dir", dir);
      mapWin.appendChild(h);
    });
    document.body.appendChild(mapWin);
    b6BpMapWin = mapWin;
    b6BpRdCv = rdCvEl;
    b6BpRdCtx = rdCvEl.getContext("2d");

    b6FitMapWin = () => {
      const vpW = document.documentElement.clientWidth || window.innerWidth;
      const vpH = document.documentElement.clientHeight || window.innerHeight;
      const maxS = Math.max(140, Math.min(440, vpW, vpH));
      const sz = Math.max(
        140,
        Math.min(maxS, Math.round(Number(m9TvL2sP.bypassMapSize) || 220)),
      );
      mapWin.style.width = sz + "px";
      mapWin.style.height = sz + "px";
      if (m9TvL2sP.bypassMapX !== null && m9TvL2sP.bypassMapY !== null) {
        const mxL = Math.max(0, vpW - sz);
        const mxT = Math.max(0, vpH - sz);
        const nx = Math.round(Math.max(0, Math.min(mxL, m9TvL2sP.bypassMapX)));
        const ny = Math.round(Math.max(0, Math.min(mxT, m9TvL2sP.bypassMapY)));
        mapWin.style.left = nx + "px";
        mapWin.style.top = ny + "px";
        mapWin.style.right = "auto";
        mapWin.style.bottom = "auto";
      } else {
        mapWin.style.left = "auto";
        mapWin.style.top = "auto";
        mapWin.style.right = "12px";
        mapWin.style.bottom = "225px";
      }
    };

    let bpMapDrag = null;
    let bpMapRsz = null;
    let bpMapSyncAt = 0;

    b6SyncRadarLock = () => {
      const lk = Boolean(m9TvL2sP.bypassRadarLock);
      mapWin.classList.toggle("macro-bp-locked", lk);
      if (lk) {
        bpMapDrag = null;
        bpMapRsz = null;
      }
    };

    b6FitMapWin();
    b6SyncRadarLock();
    window.addEventListener("resize", b6FitMapWin, { passive: true });

    mapWin.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
    [
      "pointerdown",
      "pointermove",
      "pointerup",
      "mousedown",
      "mousemove",
      "mouseup",
      "click",
      "wheel",
      "keydown",
      "keyup",
    ].forEach((ev) => {
      mapWin.addEventListener(ev, (e) => {
        if (e.isTrusted && !m9TvL2sP.bypassRadarLock) e.stopPropagation();
      });
    });

    mapWin.addEventListener("pointerdown", (e) => {
      if (
        !e.isTrusted ||
        e.button !== 0 ||
        m9TvL2sP.bypassRadarLock ||
        (e.target && e.target.closest && e.target.closest(".macro-bp-rsz"))
      ) {
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      const rc = mapWin.getBoundingClientRect();
      mapWin.style.left = rc.left + "px";
      mapWin.style.top = rc.top + "px";
      mapWin.style.right = "auto";
      mapWin.style.bottom = "auto";
      bpMapDrag = {
        id: e.pointerId,
        ox: e.clientX - rc.left,
        oy: e.clientY - rc.top,
      };
      try {
        mapWin.setPointerCapture(e.pointerId);
      } catch (_) {}
    });

    mapWin.addEventListener("pointermove", (e) => {
      if (!bpMapDrag || e.pointerId !== bpMapDrag.id) return;
      e.preventDefault();
      e.stopPropagation();
      const vpW = document.documentElement.clientWidth || window.innerWidth;
      const vpH = document.documentElement.clientHeight || window.innerHeight;
      const sz = mapWin.clientWidth || m9TvL2sP.bypassMapSize;
      const nx = Math.max(0, Math.min(vpW - sz, e.clientX - bpMapDrag.ox));
      const ny = Math.max(0, Math.min(vpH - sz, e.clientY - bpMapDrag.oy));
      mapWin.style.left = Math.round(nx) + "px";
      mapWin.style.top = Math.round(ny) + "px";
      m9TvL2sP.bypassMapX = Math.round(nx);
      m9TvL2sP.bypassMapY = Math.round(ny);
      if (b6BcSyncFn && performance.now() - bpMapSyncAt > 45) {
        bpMapSyncAt = performance.now();
        b6BcSyncFn();
      }
    });

    const endMapDrag = (e) => {
      if (
        !bpMapDrag ||
        (e && e.pointerId !== undefined && e.pointerId !== bpMapDrag.id)
      ) {
        return;
      }
      try {
        mapWin.releasePointerCapture(bpMapDrag.id);
      } catch (_) {}
      bpMapDrag = null;
      x3QnK8wR();
    };
    mapWin.addEventListener("pointerup", endMapDrag);
    mapWin.addEventListener("pointercancel", endMapDrag);

    mapWin.querySelectorAll(".macro-bp-rsz").forEach((hb) => {
      hb.addEventListener("pointerdown", (e) => {
        if (!e.isTrusted || e.button !== 0 || m9TvL2sP.bypassRadarLock) return;
        e.preventDefault();
        e.stopPropagation();
        const rc = mapWin.getBoundingClientRect();
        const s0 = rc.width || m9TvL2sP.bypassMapSize;
        mapWin.style.left = rc.left + "px";
        mapWin.style.top = rc.top + "px";
        mapWin.style.right = "auto";
        mapWin.style.bottom = "auto";
        bpMapRsz = {
          id: e.pointerId,
          dir: hb.getAttribute("data-bp-dir") || "se",
          sx: e.clientX,
          sy: e.clientY,
          s0,
          l0: rc.left,
          t0: rc.top,
          r0: rc.left + s0,
          b0: rc.top + s0,
        };
        try {
          hb.setPointerCapture(e.pointerId);
        } catch (_) {}
      });

      hb.addEventListener("pointermove", (e) => {
        if (!bpMapRsz || e.pointerId !== bpMapRsz.id) return;
        e.preventDefault();
        e.stopPropagation();
        const vpW = document.documentElement.clientWidth || window.innerWidth;
        const vpH = document.documentElement.clientHeight || window.innerHeight;
        const dx = e.clientX - bpMapRsz.sx;
        const dy = e.clientY - bpMapRsz.sy;
        const dir = bpMapRsz.dir;
        let ds = 0;
        if (dir === "e") ds = dx;
        else if (dir === "w") ds = -dx;
        else if (dir === "s") ds = dy;
        else if (dir === "n") ds = -dy;
        else if (dir === "se") ds = (dx + dy) * 0.5;
        else if (dir === "nw") ds = (-dx - dy) * 0.5;
        else if (dir === "ne") ds = (dx - dy) * 0.5;
        else if (dir === "sw") ds = (-dx + dy) * 0.5;
        const maxW = dir.includes("w") ? bpMapRsz.r0 : vpW - bpMapRsz.l0;
        const maxH = dir.includes("n") ? bpMapRsz.b0 : vpH - bpMapRsz.t0;
        const maxS = Math.max(140, Math.min(440, maxW, maxH));
        const ns = Math.max(140, Math.min(maxS, Math.round(bpMapRsz.s0 + ds)));
        const nl = Math.max(
          0,
          dir.includes("w") ? bpMapRsz.r0 - ns : bpMapRsz.l0,
        );
        const nt = Math.max(
          0,
          dir.includes("n") ? bpMapRsz.b0 - ns : bpMapRsz.t0,
        );
        m9TvL2sP.bypassMapSize = ns;
        m9TvL2sP.bypassMapX = Math.round(nl);
        m9TvL2sP.bypassMapY = Math.round(nt);
        mapWin.style.left = m9TvL2sP.bypassMapX + "px";
        mapWin.style.top = m9TvL2sP.bypassMapY + "px";
        mapWin.style.right = "auto";
        mapWin.style.bottom = "auto";
        mapWin.style.width = ns + "px";
        mapWin.style.height = ns + "px";
        if (b6BcSyncFn && performance.now() - bpMapSyncAt > 45) {
          bpMapSyncAt = performance.now();
          b6BcSyncFn();
        }
      });

      const endRsz = (e) => {
        if (
          !bpMapRsz ||
          (e && e.pointerId !== undefined && e.pointerId !== bpMapRsz.id)
        ) {
          return;
        }
        try {
          hb.releasePointerCapture(bpMapRsz.id);
        } catch (_) {}
        bpMapRsz = null;
        x3QnK8wR();
      };
      hb.addEventListener("pointerup", endRsz);
      hb.addEventListener("pointercancel", endRsz);
    });

    f4KzP9wL(win);
    const c6InitJson = win.querySelector("#macro-cfg-json");
    if (c6InitJson) c6InitJson.value = e7BuildCfgJson();
    win
      .querySelectorAll('input:not([type="checkbox"]), textarea')
      .forEach(b3EdBind);
    [
      "keydown",
      "keyup",
      "keypress",
      "copy",
      "cut",
      "paste",
      "selectstart",
      "contextmenu",
    ].forEach((ev) => {
      win.addEventListener(
        ev,
        (e) => {
          if (!v7QzP2wM && q5IsEdit(e.target)) e.stopPropagation();
        },
        false,
      );
    });
    win.addEventListener("click", (e) => {
      const t =
        e.target && e.target.nodeType === 1
          ? e.target
          : e.target && e.target.parentElement;
      const b = t && t.closest ? t.closest('button, [role="button"], a') : null;
      if (b) b.blur();
    });

    const tMap = document.getElementById("macro-toggle-map-bg");
    const tFix = document.getElementById("macro-toggle-fixed-bg");

    function f4RefocusGame() {
      const cv = t8VwM4xK();
      if (cv && cv.focus) cv.focus();
    }

    if (tMap) {
      tMap.addEventListener("change", (e) => {
        m9TvL2sP.mapBgEnabled = e.target.checked;
        x3QnK8wR();
        e.target.blur();
        f4RefocusGame();
        if (b7DrawFn) b7DrawFn();
      });
    }
    if (tFix) {
      tFix.addEventListener("change", (e) => {
        m9TvL2sP.fixedBackgroundEnabled = e.target.checked;
        x3QnK8wR();
        e.target.blur();
        f4RefocusGame();
        if (b7DrawFn) b7DrawFn();
      });
    }

    function w4XnK(pfx, sFn, kToggle, kSrc, dbKey) {
      const bF = document.getElementById("macro-btn-" + pfx + "-file");
      const bU = document.getElementById("macro-btn-" + pfx + "-url");
      const bR = document.getElementById("macro-btn-" + pfx + "-rst");
      const fIn = document.createElement("input");
      fIn.type = "file";
      fIn.accept = "image/*,video/*";
      fIn.style.display = "none";
      win.appendChild(fIn);
      let pUrl = null;
      if (bF) {
        bF.addEventListener("click", (e) => {
          e.stopPropagation();
          bF.blur();
          fIn.value = "";
          fIn.click();
        });
      }
      fIn.addEventListener("change", () => {
        fIn.blur();
        if (!fIn.files || !fIn.files[0]) {
          f4RefocusGame();
          return;
        }
        const fl = fIn.files[0];
        if (pUrl) {
          try {
            URL.revokeObjectURL(pUrl.split("#")[0]);
          } catch (_) {}
          pUrl = null;
        }
        const isVid =
          fl.type.startsWith("video/") ||
          /\.(mp4|webm|ogg|mov|m4v)$/i.test(fl.name);
        pUrl =
          URL.createObjectURL(fl) + (isVid ? "#type=video" : "#type=image");
        const idbTag = "idb:" + dbKey + ":" + Date.now();
        m9TvL2sP[kSrc] = idbTag;
        m9TvL2sP[kToggle] = true;
        if (typeof sFn === "function") sFn(pUrl);
        r8QnM4tL();
        k2DbPut(dbKey, fl, isVid).then(() => {
          if (m9TvL2sP[kSrc] === idbTag) x3QnK8wR();
        });
        f4RefocusGame();
      });
      if (bU) {
        bU.addEventListener("click", (e) => {
          e.stopPropagation();
          bU.blur();
          const u = prompt(k3Tr("promptUrl"));
          if (u && u.trim()) {
            const val = u.trim();
            if (pUrl) {
              try {
                URL.revokeObjectURL(pUrl.split("#")[0]);
                pUrl = null;
              } catch (_) {}
            }
            k2DbDel(dbKey);
            m9TvL2sP[kSrc] = val;
            m9TvL2sP[kToggle] = true;
            x3QnK8wR();
            if (typeof sFn === "function") sFn(val);
            r8QnM4tL();
          }
          f4RefocusGame();
        });
      }
      if (bR) {
        bR.addEventListener("click", (e) => {
          e.stopPropagation();
          bR.blur();
          if (pUrl) {
            try {
              URL.revokeObjectURL(pUrl.split("#")[0]);
              pUrl = null;
            } catch (_) {}
          }
          k2DbDel(dbKey);
          m9TvL2sP[kSrc] = null;
          m9TvL2sP[kToggle] = false;
          x3QnK8wR();
          if (typeof sFn === "function") sFn(null);
          r8QnM4tL();
          f4RefocusGame();
        });
      }
    }
    w4XnK("map", window.setMapBackground, "mapBgEnabled", "mapBgSrc", "map");
    w4XnK(
      "fixed",
      window.setFixedBackground,
      "fixedBackgroundEnabled",
      "fixedBgSrc",
      "fixed",
    );

    function k7MkScroll(pn, bd, tw) {
      if (!pn || !bd) return () => {};
      const trk = document.createElement("div");
      trk.className = "macro-custom-scroll-track";
      if (tw) trk.style.width = tw;
      const thm = document.createElement("div");
      thm.className = "macro-custom-scroll-thumb";
      trk.appendChild(thm);
      pn.appendChild(trk);

      function upd() {
        const cH = bd.clientHeight,
          sH = bd.scrollHeight;
        if (sH - cH <= 4) {
          trk.style.display = "none";
          bd.scrollTop = 0;
          return;
        }
        trk.style.display = "block";
        const tH = trk.offsetHeight,
          thH = Math.max(22, Math.round((cH / sH) * tH));
        const mSt = sH - cH,
          mTp = tH - thH;
        if (mTp <= 0 || mSt <= 0) {
          trk.style.display = "none";
          return;
        }
        thm.style.height = thH + "px";
        thm.style.top = Math.round((bd.scrollTop / mSt) * mTp) + "px";
      }

      bd.addEventListener("scroll", upd, { passive: true });
      if (window.ResizeObserver) new ResizeObserver(upd).observe(bd);

      let drg = false,
        sY = 0,
        sT = 0;
      trk.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        if (e.target !== thm) {
          const r = trk.getBoundingClientRect(),
            tH = trk.offsetHeight,
            thH = thm.offsetHeight;
          const mTp = tH - thH,
            mSt = bd.scrollHeight - bd.clientHeight;
          if (mTp > 0)
            bd.scrollTop = ((e.clientY - r.top - thH * 0.5) / mTp) * mSt;
        }
        drg = true;
        sY = e.clientY;
        sT = bd.scrollTop;
        thm.classList.add("dragging");
        try {
          trk.setPointerCapture(e.pointerId);
        } catch (_) {}
      });
      trk.addEventListener("pointermove", (e) => {
        if (!drg) return;
        e.preventDefault();
        e.stopPropagation();
        const tH = trk.offsetHeight,
          thH = thm.offsetHeight;
        const mTp = tH - thH,
          mSt = bd.scrollHeight - bd.clientHeight;
        if (mTp <= 0) return;
        bd.scrollTop = sT + ((e.clientY - sY) / mTp) * mSt;
      });
      const end = (e) => {
        if (drg) {
          drg = false;
          thm.classList.remove("dragging");
          if (e && e.pointerId !== undefined) {
            try {
              trk.releasePointerCapture(e.pointerId);
            } catch (_) {}
          }
        }
      };
      trk.addEventListener("pointerup", end);
      trk.addEventListener("pointercancel", end);
      window.addEventListener("blur", end);
      return upd;
    }

    const b7NmQ2xL = win.querySelector(".macro-win-body");
    const u4PwM8xQ = k7MkScroll(
      win.querySelector(".macro-pane-main"),
      b7NmQ2xL,
      "",
    );
    const s7BodyQ = win.querySelector(".macro-settings-body");
    const u4PwS8mQ = k7MkScroll(
      win.querySelector(".macro-pane-settings"),
      s7BodyQ,
      "1.15em",
    );

    win.addEventListener(
      "wheel",
      (e) => {
        if (win.classList.contains("open")) e.stopPropagation();
      },
      { passive: true },
    );

    b2WzL7vP(document.getElementById("macro-track-solo"), m9TvL2sP.soloDelay);
    b2WzL7vP(document.getElementById("macro-track-auto"), m9TvL2sP.autoDelay);
    r8QnM4tL();

    let pDrag = false,
      pMov = false,
      pSX = 0,
      pSY = 0,
      pIL = 0,
      pIT = 0;
    pill.addEventListener("mousedown", (e) => {
      if (e.button !== 0) return;
      pDrag = true;
      pMov = false;
      pSX = e.clientX;
      pSY = e.clientY;
      const r = pill.getBoundingClientRect();
      pIL = r.left;
      pIT = r.top;
    });

    window.addEventListener("mousemove", (e) => {
      if (!pDrag) return;
      const dx = e.clientX - pSX,
        dy = e.clientY - pSY;
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
        pMov = true;
        pill.classList.add("dragging");
      }
      if (!pMov) return;
      const vpW = document.documentElement.clientWidth || window.innerWidth;
      const vpH = document.documentElement.clientHeight || window.innerHeight;
      let nL = pIL + dx,
        nT = pIT + dy;
      const mxL = Math.max(0, vpW - pill.offsetWidth),
        mxT = Math.max(0, vpH - pill.offsetHeight);
      const finL = Math.max(
        0,
        Math.min(mxL, nL < 8 ? 0 : nL > mxL - 8 ? mxL : nL),
      );
      const finT = Math.max(
        0,
        Math.min(mxT, nT < 8 ? 0 : nT > mxT - 8 ? mxT : nT),
      );
      pill.style.left = finL + "px";
      pill.style.top = finT + "px";
      pill.style.right = "auto";
      pill.style.bottom = "auto";
      m9TvL2sP.pillX = finL;
      m9TvL2sP.pillY = finT;
      v6WpL2sT(pill);
    });

    const endPillDrag = () => {
      if (pDrag) {
        pDrag = false;
        pill.classList.remove("dragging");
        if (pMov) {
          m9TvL2sP.pillX = pill.offsetLeft;
          m9TvL2sP.pillY = pill.offsetTop;
          x3QnK8wR();
        }
      }
    };
    window.addEventListener("mouseup", endPillDrag);
    window.addEventListener("blur", endPillDrag);

    pill.addEventListener("click", (e) => {
      if (pMov) {
        e.stopImmediatePropagation();
        return;
      }
      h2QzP8sT();
    });
    window.addEventListener("resize", () => {
      v6WpL2sT(pill);
      f4KzP9wL(win);
    });

    let wDrag = false,
      wOX = 0,
      wOY = 0;
    const wHdr = win.querySelector(".macro-win-header");
    wHdr.addEventListener("mousedown", (e) => {
      if (
        e.button !== 0 ||
        (e.target &&
          e.target.closest &&
          e.target.closest("#macro-settings-btn"))
      )
        return;
      wDrag = true;
      wHdr.classList.add("dragging");
      const r = win.getBoundingClientRect();
      win.style.left = r.left + "px";
      win.style.right = "auto";
      wOX = e.clientX - r.left;
      wOY = e.clientY - r.top;
    });

    window.addEventListener("mousemove", (e) => {
      if (!wDrag) return;
      const vpW = document.documentElement.clientWidth || window.innerWidth;
      const vpH = document.documentElement.clientHeight || window.innerHeight;
      let x = e.clientX - wOX,
        y = e.clientY - wOY;
      const mxL = Math.max(0, vpW - win.offsetWidth),
        mxT = Math.max(0, vpH - win.offsetHeight);
      const finL = Math.max(
        0,
        Math.min(mxL, x < 10 ? 0 : x > mxL - 10 ? mxL : x),
      );
      const finT = Math.max(
        0,
        Math.min(mxT, y < 10 ? 0 : y > mxT - 10 ? mxT : y),
      );
      if (finL >= mxL - 10) {
        win.style.left = "auto";
        win.style.right = "0px";
      } else {
        win.style.left = finL + "px";
        win.style.right = "auto";
      }
      win.style.top = finT + "px";
      win.style.bottom = "auto";
      qM7wK2vP(win);
    });

    const endWinDrag = () => {
      if (wDrag) {
        wDrag = false;
        wHdr.classList.remove("dragging");
        const vpW = document.documentElement.clientWidth || window.innerWidth;
        m9TvL2sP.winX =
          win.style.right === "0px"
            ? Math.max(0, vpW - win.offsetWidth)
            : win.offsetLeft;
        m9TvL2sP.winY = win.offsetTop;
        x3QnK8wR();
      }
    };
    window.addEventListener("mouseup", endWinDrag);
    window.addEventListener("blur", endWinDrag);

    let aRsz = null,
      rSX = 0,
      rSY = 0,
      rSW = 0,
      rSH = 0,
      rSL = 0,
      rST = 0;
    win.querySelectorAll(".macro-resizer").forEach((el) => {
      el.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();
        const r = win.getBoundingClientRect();
        win.style.left = r.left + "px";
        win.style.top = r.top + "px";
        win.style.right = "auto";
        win.style.bottom = "auto";
        aRsz = el.getAttribute("data-dir");
        rSX = e.clientX;
        rSY = e.clientY;
        rSW = r.width;
        rSH = r.height;
        rSL = r.left;
        rST = r.top;
      });
    });

    window.addEventListener("mousemove", (e) => {
      if (!aRsz) return;
      const vpW = document.documentElement.clientWidth || window.innerWidth;
      const vpH = document.documentElement.clientHeight || window.innerHeight;
      const dx = e.clientX - rSX,
        dy = e.clientY - rSY;
      let nW = rSW,
        nH = rSH,
        nL = rSL,
        nT = rST;
      if (aRsz.includes("e")) {
        nW = Math.max(Math.min(280, vpW), Math.min(vpW - rSL, rSW + dx));
      }
      if (aRsz.includes("s")) {
        nH = Math.max(Math.min(320, vpH), Math.min(vpH - rST, rSH + dy));
      }
      if (aRsz.includes("w")) {
        const minW = Math.min(280, vpW);
        const mxW = Math.min(rSL + rSW, vpW);
        nW = Math.max(minW, Math.min(mxW, rSW - dx));
        nL = Math.max(0, rSL + (rSW - nW));
      }
      if (aRsz.includes("n")) {
        const minH = Math.min(320, vpH);
        const mxH = Math.min(rST + rSH, vpH);
        nH = Math.max(minH, Math.min(mxH, rSH - dy));
        nT = Math.max(0, rST + (rSH - nH));
      }
      nW = Math.min(vpW, nW);
      nH = Math.min(vpH, nH);
      nL = Math.max(0, Math.min(vpW - nW, nL));
      nT = Math.max(0, Math.min(vpH - nH, nT));
      win.style.minWidth = Math.min(280, vpW) + "px";
      win.style.minHeight = Math.min(320, vpH) + "px";
      if (nL >= vpW - nW - 6) {
        win.style.left = "auto";
        win.style.right = "0px";
      } else {
        win.style.left = nL + "px";
        win.style.right = "auto";
      }
      win.style.top = nT + "px";
      win.style.width = nW + "px";
      win.style.height = nH + "px";
      q6VxM4tN(win, nW, nH);
      qM7wK2vP(win);
      u4PwM8xQ();
    });

    const endResize = () => {
      if (aRsz) {
        aRsz = null;
        const vpW = document.documentElement.clientWidth || window.innerWidth;
        m9TvL2sP.winWidth = win.offsetWidth;
        m9TvL2sP.winHeight = win.offsetHeight;
        m9TvL2sP.winX =
          win.style.right === "0px"
            ? Math.max(0, vpW - win.offsetWidth)
            : win.offsetLeft;
        m9TvL2sP.winY = win.offsetTop;
        x3QnK8wR();
        u4PwM8xQ();
      }
    };
    window.addEventListener("mouseup", endResize);
    window.addEventListener("blur", endResize);

    function k4BindRange(tk, inp, bDec, bInc, sFn, mn, mx, stp, fb, onChg) {
      if (!tk || !inp) return;
      const fl = tk.querySelector(".macro-slider-fill");
      const sp = mx - mn;
      function app(v, cmt) {
        v = Math.max(mn, Math.min(mx, Math.round(v)));
        sFn(v);
        if (fl) fl.style.width = ((v - mn) / sp) * 100 + "%";
        q2SetVal(inp, v, Boolean(cmt));
        x3QnK8wR();
        if (onChg) onChg(v);
      }
      function hM(e) {
        const r = tk.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
        app(mn + Math.round((p * sp) / stp) * stp, false);
      }
      tk.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        if (document.activeElement && document.activeElement.blur)
          document.activeElement.blur();
        e.preventDefault();
        e.stopPropagation();
        hM(e);
        function onMv(ev) {
          hM(ev);
        }
        function onUp() {
          window.removeEventListener("mousemove", onMv);
          window.removeEventListener("mouseup", onUp);
          window.removeEventListener("blur", onUp);
          q6CommitVal(inp);
        }
        window.addEventListener("mousemove", onMv);
        window.addEventListener("mouseup", onUp);
        window.addEventListener("blur", onUp);
      });
      inp.addEventListener("input", () => {
        const v = parseInt(inp.value, 10);
        if (!isNaN(v)) {
          const nv = Math.max(mn, Math.min(mx, v));
          sFn(nv);
          if (fl) fl.style.width = ((nv - mn) / sp) * 100 + "%";
          x3QnK8wR();
          if (onChg) onChg(nv);
        }
      });
      inp.addEventListener("blur", () => {
        const v = parseInt(inp.value, 10);
        app(isNaN(v) ? fb : v, true);
      });
      function step(d) {
        const v = parseInt(inp.value, 10);
        const nv = Math.max(mn, Math.min(mx, (isNaN(v) ? fb : v) + d));
        sFn(nv);
        q2SetVal(inp, nv, false);
        if (fl) fl.style.width = ((nv - mn) / sp) * 100 + "%";
        x3QnK8wR();
        if (onChg) onChg(nv);
      }
      function bStp(btn, d) {
        let hT = null,
          rT = null,
          act = false;
        function clr() {
          if (hT) clearTimeout(hT);
          if (rT) clearInterval(rT);
          hT = null;
          rT = null;
          if (act) {
            act = false;
            window.removeEventListener("mouseup", clr);
            window.removeEventListener("blur", clr);
            q6CommitVal(inp, "step");
          }
        }
        btn.addEventListener("mousedown", (e) => {
          if (e.button !== 0) return;
          e.preventDefault();
          e.stopPropagation();
          clr();
          act = true;
          window.addEventListener("mouseup", clr);
          window.addEventListener("blur", clr);
          step(d);
          hT = setTimeout(() => {
            rT = setInterval(() => step(d), 40);
          }, 500);
        });
        ["mouseup", "mouseleave"].forEach((ev) =>
          btn.addEventListener(ev, clr),
        );
      }
      if (bDec) bStp(bDec, -stp);
      if (bInc) bStp(bInc, stp);
    }

    ["solo", "auto"].forEach((k) => {
      const prop = k === "solo" ? "soloDelay" : "autoDelay";
      k4BindRange(
        document.getElementById("macro-track-" + k),
        document.getElementById("macro-num-" + k),
        document.getElementById(`macro-dec-${k}`),
        document.getElementById(`macro-inc-${k}`),
        (v) => {
          m9TvL2sP[prop] = v;
        },
        50,
        3000,
        10,
        800,
        null,
      );
    });

    k4BindRange(
      document.getElementById("macro-track-margin"),
      document.getElementById("macro-num-margin"),
      document.getElementById("macro-dec-margin"),
      document.getElementById("macro-inc-margin"),
      (v) => {
        m9TvL2sP.cullMargin = v;
      },
      30,
      500,
      10,
      120,
      null,
    );

    k4BindRange(
      document.getElementById("macro-track-rscale"),
      document.getElementById("macro-num-rscale"),
      document.getElementById("macro-dec-rscale"),
      document.getElementById("macro-inc-rscale"),
      (v) => {
        m9TvL2sP.renderScale = v;
      },
      25,
      100,
      5,
      100,
      () => {
        if (p9RndRef) p9ApplyRes(p9RndRef);
      },
    );
    const tRs = document.getElementById("macro-toggle-rscale");
    if (tRs) {
      tRs.addEventListener("change", (e) => {
        m9TvL2sP.renderScaleToggle = e.target.checked;
        x3QnK8wR();
        a2LnQ8vM();
        if (p9RndRef) p9ApplyRes(p9RndRef);
        e.target.blur();
      });
    }
    k4BindRange(
      document.getElementById("macro-track-bpttl"),
      document.getElementById("macro-num-bpttl"),
      document.getElementById("macro-dec-bpttl"),
      document.getElementById("macro-inc-bpttl"),
      (v) => {
        m9TvL2sP.bypassTtl = v;
      },
      1500,
      25000,
      250,
      8500,
      null,
    );
    const tBp = document.getElementById("macro-toggle-bypass");
    if (tBp) {
      tBp.addEventListener("change", (e) => {
        m9TvL2sP.bypassEnabled = e.target.checked;
        if (m9TvL2sP.bypassEnabled) {
          if (!h4HasPeerTab()) {
            const pop = window.open(
              location.href,
              "_blank",
              "popup=yes,width=560,height=440",
            );
            b6BpSt.enableGraceUntil = performance.now() + (pop ? 12000 : 1200);
          } else {
            b6BpSt.enableGraceUntil = performance.now() + 1500;
          }
        } else {
          b6BpSt.enableGraceUntil = 0;
          b6ScanStop();
          if (!m9TvL2sP.bypassPhantoms && !m9TvL2sP.bypassRadar)
            b6ResetWorld(false);
        }
        x3QnK8wR();
        e.target.blur();
        f4RefocusGame();
      });
    }
    const tBpPh = document.getElementById("macro-toggle-bpphantoms");
    if (tBpPh) {
      tBpPh.addEventListener("change", (e) => {
        m9TvL2sP.bypassPhantoms = e.target.checked;
        x3QnK8wR();
        e.target.blur();
        f4RefocusGame();
      });
    }
    const tBpRd = document.getElementById("macro-toggle-bpradar");
    if (tBpRd) {
      tBpRd.addEventListener("change", (e) => {
        m9TvL2sP.bypassRadar = e.target.checked;
        x3QnK8wR();
        e.target.blur();
        f4RefocusGame();
      });
    }
    const tBpLk = document.getElementById("macro-toggle-bpradarlock");
    if (tBpLk) {
      tBpLk.addEventListener("change", (e) => {
        m9TvL2sP.bypassRadarLock = e.target.checked;
        x3QnK8wR();
        if (b6SyncRadarLock) b6SyncRadarLock();
        e.target.blur();
        f4RefocusGame();
      });
    }

    win.querySelectorAll(".macro-split-chip").forEach((ch) => {
      ch.addEventListener("click", (e) => {
        e.stopPropagation();
        m9TvL2sP.revSplits = parseInt(ch.getAttribute("data-split"), 10);
        x3QnK8wR();
        r8QnM4tL();
        if (r9RevNotFn) r9RevNotFn(m9TvL2sP.revSplits);
      });
    });

    win
      .querySelectorAll(".macro-bind-btn, .macro-menu-bind-btn")
      .forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          if (Date.now() < z3TvL8xP || v7QzP2wM) return;
          m3TvL9xW(btn.getAttribute("data-id"));
        });
      });

    const mRst = document.getElementById("macro-btn-rst-keyMenu");
    if (mRst) {
      mRst.addEventListener("click", (e) => {
        e.stopPropagation();
        m9TvL2sP.keyMenu = null;
        x3QnK8wR();
        r8QnM4tL();
      });
    }

    win.querySelectorAll(".macro-rst-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const key = btn.getAttribute("data-reset");
        m9TvL2sP[key] = null;
        if (key === "keyHoldSpam") hCl2xK9m();
        x3QnK8wR();
        r8QnM4tL();
      });
    });

    function zN8vR4wL(m, st) {
      m9TvL2sP.skinStealer = false;
      m9TvL2sP.nameStealer = false;
      m9TvL2sP.customSwitcher = false;
      if (st) m9TvL2sP[m] = true;
      x3QnK8wR();
      r8QnM4tL();
    }

    const tSk = document.getElementById("macro-toggle-skin");
    const tNm = document.getElementById("macro-toggle-name");
    const tCs = document.getElementById("macro-toggle-custom");
    const aNk = document.getElementById("macro-custom-nicks");

    if (tSk)
      tSk.addEventListener("change", (e) => {
        zN8vR4wL("skinStealer", e.target.checked);
        e.target.blur();
      });
    if (tNm)
      tNm.addEventListener("change", (e) => {
        zN8vR4wL("nameStealer", e.target.checked);
        e.target.blur();
      });
    if (tCs)
      tCs.addEventListener("change", (e) => {
        zN8vR4wL("customSwitcher", e.target.checked);
        e.target.blur();
      });

    const tCl = document.getElementById("macro-toggle-culling");
    const tFl = document.getElementById("macro-toggle-filters");
    const tMg = document.getElementById("macro-toggle-margin");

    if (tCl)
      tCl.addEventListener("change", (e) => {
        m9TvL2sP.frustumCulling = e.target.checked;
        x3QnK8wR();
        a2LnQ8vM();
        e.target.blur();
      });
    if (tFl)
      tFl.addEventListener("change", (e) => {
        m9TvL2sP.stripFilters = e.target.checked;
        x3QnK8wR();
        e.target.blur();
      });
    if (tMg)
      tMg.addEventListener("change", (e) => {
        m9TvL2sP.cullMarginToggle = e.target.checked;
        x3QnK8wR();
        a2LnQ8vM();
        e.target.blur();
      });
    const tSt = document.getElementById("macro-toggle-seltxt");
    if (tSt)
      tSt.addEventListener("change", (e) => {
        m9TvL2sP.selectableText = e.target.checked;
        x3QnK8wR();
        k9SyncTxtMode();
        e.target.blur();
      });
    const g5LkW8nP = document.getElementById("macro-settings-btn");
    if (g5LkW8nP) {
      g5LkW8nP.addEventListener("mousedown", (e) => {
        if (e.button === 0) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
      g5LkW8nP.addEventListener("click", (e) => {
        e.stopPropagation();
        c7CloseMainPop(true);
        win.classList.toggle("settings-open");
        if (!win.classList.contains("settings-open")) {
          c7ClosePal();
          c7CloseLang();
        } else {
          if (e7CfgBoxSync) e7CfgBoxSync(false);
          u4PwS8mQ();
        }
      });
      g5LkW8nP.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          g5LkW8nP.click();
        }
      });
    }
    const t8HzR3mK = document.getElementById("macro-toggle-plexus");
    const v3XpN6qL = document.getElementById("macro-toggle-sync-scale");
    if (t8HzR3mK) {
      t8HzR3mK.addEventListener("change", (e) => {
        m9TvL2sP.plexusEnabled = e.target.checked;
        x3QnK8wR();
        if (s2NpK7wL) s2NpK7wL();
        e.target.blur();
      });
    }
    if (v3XpN6qL) {
      v3XpN6qL.addEventListener("change", (e) => {
        m9TvL2sP.syncScale = e.target.checked;
        x3QnK8wR();
        q6VxM4tN(win);
        u4PwM8xQ();
        u4PwS8mQ();
        if (rPop && rPop.classList.contains("open") && z5QpL8wH)
          j4PosPal(z5QpL8wH);
        if (lPop && lPop.classList.contains("open")) j4PosLang();
        e.target.blur();
      });
    }
    const v3PtN6qL = document.getElementById("macro-toggle-pill-trans");
    if (v3PtN6qL) {
      v3PtN6qL.addEventListener("change", (e) => {
        m9TvL2sP.pillTransparent = e.target.checked;
        x3QnK8wR();
        pill.classList.toggle(
          "macro-pill-trans",
          Boolean(m9TvL2sP.pillTransparent),
        );
        e.target.blur();
      });
    }

    const d5VrP8nK = win.querySelector("#macro-ff-delays");
    const b8MtQ2wL = win.querySelector("#macro-ff-binds");

    function v4NpQ8mL(ff, idx, animate) {
      if (!d5VrP8nK || !b8MtQ2wL) return;
      const num = idx + 2;
      const dWrap = document.createElement("div");
      dWrap.className = "macro-ff-anim" + (animate ? " macro-ff-entering" : "");
      dWrap.setAttribute("data-ff-d", idx);
      dWrap.innerHTML = `
        <div class="macro-ff-anim-inner">
          <div class="macro-row">
            <span data-ff-del-lbl="${num}">${k3Tr("ffDelN", num)}</span>
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
      const tr = dWrap.querySelector("#macro-track-extraFF_" + idx);
      const inp = dWrap.querySelector("#macro-num-extraFF_" + idx);
      const bDec = dWrap.querySelector("#macro-dec-extraFF_" + idx);
      const bInc = dWrap.querySelector("#macro-inc-extraFF_" + idx);
      b2WzL7vP(tr, ff.delay);
      b3EdBind(inp);
      k4BindRange(
        tr,
        inp,
        bDec,
        bInc,
        (v) => {
          ff.delay = v;
        },
        50,
        3000,
        10,
        800,
        null,
      );

      const bWrap = document.createElement("div");
      bWrap.className = "macro-ff-anim" + (animate ? " macro-ff-entering" : "");
      bWrap.setAttribute("data-ff-b", idx);
      bWrap.innerHTML = `
        <div class="macro-ff-anim-inner">
          <div class="macro-row">
            <div class="macro-ff-label-wrap">
              <span data-ff-lbl="${num}">${k3Tr("ff")} ${num}</span>
              <div role="button" tabindex="0" class="macro-ff-del-btn" data-ff-del="${idx}" title="${k3Tr("ffRem")}" aria-label="${k3Tr("ffRem")}" data-i18n-title="ffRem" data-i18n-aria="ffRem"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3.5 8h9"/></svg></div>
            </div>
            <div class="macro-btn-group">
              <button class="macro-bind-btn" id="macro-btn-extraFF_${idx}" data-id="extraFF_${idx}">${p7TvM3wL(ff.key)}</button>
              <button class="macro-rst-btn" data-reset="extraFF_${idx}" data-i18n="rst">${k3Tr("rst")}</button>
            </div>
          </div>
        </div>`;
      b8MtQ2wL.appendChild(bWrap);

      if (animate) {
        dWrap.addEventListener("transitionend", u4PwM8xQ, { once: true });
        k9LwP2xM(() => {
          k9LwP2xM(() => {
            dWrap.classList.remove("macro-ff-entering");
            bWrap.classList.remove("macro-ff-entering");
          });
        });
      }
    }

    function k8QmN3vR() {
      if (!d5VrP8nK || !b8MtQ2wL) return;
      d5VrP8nK.innerHTML = "";
      b8MtQ2wL.innerHTML = "";
      const arr = Array.isArray(m9TvL2sP.extraFastFeeds)
        ? m9TvL2sP.extraFastFeeds
        : [];
      for (let i = 0; i < arr.length; i++) v4NpQ8mL(arr[i], i, false);
      u4PwM8xQ();
    }

    const n3RwQ8vT = (e) => {
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

    const h6XmP4vK = win.querySelector("#macro-ff-add-btn");
    if (h6XmP4vK && !h6XmP4vK.dataset.ffBound) {
      h6XmP4vK.dataset.ffBound = "1";
      h6XmP4vK.addEventListener("mousedown", (e) => {
        if (e.button === 0) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
      h6XmP4vK.addEventListener("click", (e) => {
        n3RwQ8vT(e);
        h6XmP4vK.blur();
      });
      h6XmP4vK.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
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
      const idx = parseInt(del.getAttribute("data-ff-del"), 10);
      if (isNaN(idx) || !m9TvL2sP.extraFastFeeds[idx]) return;
      const ffToRemove = m9TvL2sP.extraFastFeeds[idx];
      const dEl = d5VrP8nK.querySelector(`[data-ff-d="${idx}"]`);
      const bEl = b8MtQ2wL.querySelector(`[data-ff-b="${idx}"]`);
      if (dEl && dEl.dataset.del) return;
      if (dEl) {
        dEl.dataset.del = "1";
        dEl.classList.add("macro-ff-leaving");
      }
      if (bEl) bEl.classList.add("macro-ff-leaving");
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
        dEl.addEventListener("transitionend", (ev) => {
          if (ev.target === dEl && ev.propertyName === "grid-template-rows")
            wFin();
        });
      }
      setTimeout(wFin, 230);
    };

    if (b7NmQ2xL && !b7NmQ2xL.dataset.ffBound) {
      b7NmQ2xL.dataset.ffBound = "1";
      const k2XpM7vR = (t) =>
        t && t.nodeType === 1 ? t : t && t.parentElement;
      b7NmQ2xL.addEventListener("mousedown", (e) => {
        const el = k2XpM7vR(e.target);
        if (
          e.button === 0 &&
          el &&
          el.closest &&
          el.closest(".macro-ff-del-btn")
        ) {
          e.preventDefault();
          e.stopPropagation();
        }
      });
      b7NmQ2xL.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        const el = k2XpM7vR(e.target);
        const del = el && el.closest ? el.closest(".macro-ff-del-btn") : null;
        if (del) p9QnV3xL(del, e);
      });
      b7NmQ2xL.addEventListener("click", (e) => {
        const el = k2XpM7vR(e.target);
        if (!el || !el.closest) return;
        const del = el.closest(".macro-ff-del-btn");
        if (del) {
          p9QnV3xL(del, e);
          return;
        }
        const bBtn = el.closest("#macro-ff-binds .macro-bind-btn");
        if (bBtn) {
          e.stopPropagation();
          if (Date.now() < z3TvL8xP || v7QzP2wM) return;
          m3TvL9xW(bBtn.getAttribute("data-id"));
          return;
        }
        const rBtn = el.closest("#macro-ff-binds .macro-rst-btn");
        if (rBtn) {
          e.stopPropagation();
          const key = rBtn.getAttribute("data-reset");
          if (key && key.startsWith("extraFF_")) {
            const idx = parseInt(key.slice(8), 10);
            if (m9TvL2sP.extraFastFeeds[idx])
              m9TvL2sP.extraFastFeeds[idx].key = null;
            x3QnK8wR();
            r8QnM4tL();
          }
        }
      });
    }

    k8QmN3vR();
    b6RebuildFfFn = k8QmN3vR;

    function q3XmR7kB(hex) {
      if (typeof hex !== "string" || !/^#[0-9a-f]{6}$/i.test(hex)) return null;
      return [
        parseInt(hex.slice(1, 3), 16),
        parseInt(hex.slice(3, 5), 16),
        parseInt(hex.slice(5, 7), 16),
      ];
    }

    function u7NxV4mK(r, g, b) {
      const h = (n) =>
        Math.max(0, Math.min(255, Math.round(n)))
          .toString(16)
          .padStart(2, "0");
      return "#" + h(r) + h(g) + h(b);
    }

    function h4KmN2vP(h, s, v) {
      const c = v * s;
      const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
      const m = v - c;
      let r = 0,
        g = 0,
        b = 0;
      if (h < 60) {
        r = c;
        g = x;
      } else if (h < 120) {
        r = x;
        g = c;
      } else if (h < 180) {
        g = c;
        b = x;
      } else if (h < 240) {
        g = x;
        b = c;
      } else if (h < 300) {
        r = x;
        b = c;
      } else {
        r = c;
        b = x;
      }
      return [
        Math.round((r + m) * 255),
        Math.round((g + m) * 255),
        Math.round((b + m) * 255),
      ];
    }

    function r6TxL9wN(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;
      const mx = Math.max(r, g, b),
        mn = Math.min(r, g, b),
        d = mx - mn;
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

    const pSet = win.querySelector(".macro-settings-body");
    const rPop = document.getElementById("macro-color-pop");

    const rSv = document.getElementById("macro-rgb-sv");
    const rCur = document.getElementById("macro-rgb-cursor");
    const rHue = document.getElementById("macro-rgb-hue");
    const rHThumb = document.getElementById("macro-rgb-hue-thumb");
    const rHex = document.getElementById("macro-rgb-hex");
    const rRgb = document.getElementById("macro-rgb-val");
    const rRst = document.getElementById("macro-rgb-rst");
    if (rRst) rRst.setAttribute("data-i18n", "rst");
    const palMenu = document.getElementById("macro-pal-menu");
    const palBtns = document.getElementById("macro-pal-buttons");
    const palPlex = document.getElementById("macro-pal-plexus");
    const dMap = { menu: "#141414", buttons: "#242424", plexus: "#ffffff" };

    function d8KpW4mR() {
      const mc = q3XmR7kB(m9TvL2sP.menuColor);
      if (mc) {
        const [r, g, b] = mc;
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const lt = lum > 155;
        const hr = Math.round(r * 0.78),
          hg = Math.round(g * 0.78),
          hb = Math.round(b * 0.78);
        const brd = lt
          ? "rgba(0,0,0,0.22)"
          : `rgb(${Math.min(255, r + 32)},${Math.min(255, g + 32)},${Math.min(255, b + 32)})`;
        win.style.setProperty("--macro-win-bg", `rgba(${r},${g},${b},0.97)`);
        win.style.setProperty("--macro-hdr-bg", `rgb(${hr},${hg},${hb})`);
        win.style.setProperty(
          "--macro-hdr-border",
          lt ? "rgba(0,0,0,0.14)" : "rgba(255,255,255,0.1)",
        );
        win.style.setProperty("--macro-border", brd);
        win.style.setProperty("--macro-text", lt ? "#151515" : "#ddd");
        win.style.setProperty("--macro-title-color", lt ? "#0a0a0a" : "#fff");
        win.style.setProperty("--macro-muted-text", lt ? "#3a3f45" : "#9aa0a6");
        win.style.setProperty(
          "--macro-sep",
          lt ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.08)",
        );
        win.style.setProperty(
          "--macro-pal-glow",
          lt ? "none" : "0 0 8px rgba(255,255,255,0.28)",
        );
        win.style.setProperty("--macro-accent", lt ? "#18181b" : "#f2f2f4");
        win.style.setProperty(
          "--macro-accent-text",
          lt ? "#ffffff" : "#111114",
        );
        win.style.setProperty(
          "--macro-accent-muted",
          lt ? "rgba(0,0,0,0.42)" : "rgba(255,255,255,0.48)",
        );
        win.style.setProperty("--macro-sw-on-bg", lt ? "#27272c" : "#3c3c42");
        win.style.setProperty("--macro-sw-on-brd", lt ? "#121216" : "#787882");
        win.style.setProperty("--macro-sw-on-knob", "#ffffff");
        win.style.setProperty(
          "--macro-opt-act-bg",
          lt ? "rgba(0,0,0,0.09)" : "rgba(255,255,255,0.1)",
        );
        const lr = lt
          ? Math.round(r * 0.94)
          : lum < 35
            ? Math.min(255, r + 5)
            : Math.round(r * 0.91);
        const lg = lt
          ? Math.round(g * 0.94)
          : lum < 35
            ? Math.min(255, g + 5)
            : Math.round(g * 0.91);
        const lb = lt
          ? Math.round(b * 0.94)
          : lum < 35
            ? Math.min(255, b + 5)
            : Math.round(b * 0.91);
        win.style.setProperty(
          "--macro-lang-bg",
          `rgba(${lr},${lg},${lb},0.98)`,
        );
        pill.style.setProperty("--macro-border", brd);
        pill.style.background = `rgb(${hr},${hg},${hb})`;
        pill.style.color = lt ? "#0a0a0a" : "#eee";
        [
          "--macro-win-bg",
          "--macro-border",
          "--macro-text",
          "--macro-muted-text",
          "--macro-sep",
          "--macro-accent",
          "--macro-accent-text",
        ].forEach((p) => {
          rnToast.style.setProperty(p, win.style.getPropertyValue(p));
        });
      } else {
        [
          "--macro-win-bg",
          "--macro-hdr-bg",
          "--macro-hdr-border",
          "--macro-border",
          "--macro-text",
          "--macro-title-color",
          "--macro-muted-text",
          "--macro-sep",
          "--macro-pal-glow",
          "--macro-accent",
          "--macro-accent-text",
          "--macro-accent-muted",
          "--macro-sw-on-bg",
          "--macro-sw-on-brd",
          "--macro-sw-on-knob",
          "--macro-opt-act-bg",
          "--macro-lang-bg",
        ].forEach((p) => win.style.removeProperty(p));
        pill.style.removeProperty("--macro-border");
        pill.style.background = "";
        pill.style.color = "";
        [
          "--macro-win-bg",
          "--macro-border",
          "--macro-text",
          "--macro-muted-text",
          "--macro-sep",
          "--macro-accent",
          "--macro-accent-text",
        ].forEach((p) => rnToast.style.removeProperty(p));
      }
      qM7wK2vP(win);
      v6WpL2sT(pill);

      const bc = q3XmR7kB(m9TvL2sP.buttonsColor);
      if (bc) {
        const [r, g, b] = bc;
        const lum = 0.299 * r + 0.587 * g + 0.114 * b;
        const lt = lum > 155;
        const sr = Math.round(r * 0.78),
          sg = Math.round(g * 0.78),
          sb = Math.round(b * 0.78);
        const hvr = lt ? Math.round(r * 0.85) : Math.min(255, r + 28);
        const hvg = lt ? Math.round(g * 0.85) : Math.min(255, g + 28);
        const hvb = lt ? Math.round(b * 0.85) : Math.min(255, b + 28);
        const bBrd = lt
          ? "rgba(0,0,0,0.24)"
          : `rgb(${Math.min(255, r + 28)},${Math.min(255, g + 28)},${Math.min(255, b + 28)})`;
        win.style.setProperty("--macro-btn-bg", `rgb(${r},${g},${b})`);
        win.style.setProperty("--macro-btn-bg-sub", `rgb(${sr},${sg},${sb})`);
        win.style.setProperty("--macro-btn-border", bBrd);
        win.style.setProperty("--macro-btn-text", lt ? "#141414" : "#eeeeee");
        win.style.setProperty("--macro-btn-muted", lt ? "#2e3338" : "#c0c6cc");
        win.style.setProperty(
          "--macro-btn-reset-text",
          lt ? "#7f1d1d" : "#ff9898",
        );
        win.style.setProperty(
          "--macro-btn-tut-text",
          lt ? "#0f172a" : "#8ac6ff",
        );
        win.style.setProperty(
          "--macro-slider-fill",
          lt ? "rgba(0,0,0,0.28)" : "rgba(255,255,255,0.28)",
        );
        win.style.setProperty("--macro-scroll-thumb", `rgb(${r},${g},${b})`);
        win.style.setProperty(
          "--macro-scroll-hover",
          `rgb(${hvr},${hvg},${hvb})`,
        );
        const isBluish = b > r + 40 && b > g + 30;
        win.style.setProperty(
          "--macro-sel-bg",
          isBluish
            ? "rgba(255,255,255,0.36)"
            : lt
              ? "rgba(37,99,235,0.36)"
              : "rgba(56,152,236,0.52)",
        );
        win.style.setProperty("--macro-sel-fg", lt ? "#0a0a0a" : "#ffffff");
      } else {
        [
          "--macro-btn-bg",
          "--macro-btn-bg-sub",
          "--macro-btn-border",
          "--macro-btn-text",
          "--macro-btn-muted",
          "--macro-btn-reset-text",
          "--macro-btn-tut-text",
          "--macro-slider-fill",
          "--macro-scroll-thumb",
          "--macro-scroll-hover",
          "--macro-sel-bg",
          "--macro-sel-fg",
        ].forEach((p) => win.style.removeProperty(p));
      }

      const pc = q3XmR7kB(m9TvL2sP.plexusColor);
      if (pc) {
        const [r, g, b] = pc;
        const dr = Math.min(255, Math.round(r + (255 - r) * 0.45));
        const dg = Math.min(255, Math.round(g + (255 - g) * 0.45));
        const db = Math.min(255, Math.round(b + (255 - b) * 0.45));
        const tr = Math.round(r * 0.78),
          tg = Math.round(g * 0.78),
          tb = Math.round(b * 0.78);
        g3VxL8mQ = [`${dr},${dg},${db}`, `${r},${g},${b}`, `${tr},${tg},${tb}`];
      } else {
        g3VxL8mQ = ["255,255,255", "225,225,225", "185,185,185"];
      }
    }

    function g2CurrentHex(t) {
      if (t === "menu") return m9TvL2sP.menuColor || dMap.menu;
      if (t === "buttons") return m9TvL2sP.buttonsColor || dMap.buttons;
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
      const left = Math.max(
        6,
        Math.round(bRect.left - pRect.left - popW - gap),
      );
      const rawTop = Math.round(
        bRect.top - pRect.top + pSet.scrollTop - Math.round(0.25 * fz),
      );
      const minTop = pSet.scrollTop + 6;
      const maxTop = pSet.scrollTop + Math.max(6, pSet.clientHeight - popH - 6);
      const top = Math.max(minTop, Math.min(maxTop, rawTop));
      rPop.style.left = left + "px";
      rPop.style.top = top + "px";
      rPop.style.right = "auto";
      rPop.style.bottom = "auto";
    }

    const v8PalHist = { menu: {}, buttons: {}, plexus: {} };
    b6ClearPalHistFn = () => {
      v8PalHist.menu = {};
      v8PalHist.buttons = {};
      v8PalHist.plexus = {};
    };

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
        if (m9TvL2sP.menuColor)
          palMenu.style.setProperty(
            "background",
            m9TvL2sP.menuColor,
            "important",
          );
        else palMenu.style.removeProperty("background");
      }
      if (palBtns) {
        if (m9TvL2sP.buttonsColor)
          palBtns.style.setProperty(
            "background",
            m9TvL2sP.buttonsColor,
            "important",
          );
        else palBtns.style.removeProperty("background");
      }
      if (palPlex) {
        if (m9TvL2sP.plexusColor)
          palPlex.style.setProperty(
            "background",
            m9TvL2sP.plexusColor,
            "important",
          );
        else palPlex.style.removeProperty("background");
      }

      const tgt = z5QpL8wH || "menu";
      const activeHex = g2CurrentHex(tgt);
      const rgb = q3XmR7kB(activeHex) || [20, 20, 20];
      if (rHex && document.activeElement !== rHex)
        q2SetVal(rHex, activeHex.toUpperCase(), cmt);
      if (rRgb && document.activeElement !== rRgb)
        q2SetVal(rRgb, `${rgb[0]}, ${rgb[1]}, ${rgb[2]}`, cmt);
      if (rSv) rSv.style.backgroundColor = `hsl(${f8TmK2sV[0]},100%,50%)`;
      if (rCur) {
        rCur.style.left = f8TmK2sV[1] * 100 + "%";
        rCur.style.top = (1 - f8TmK2sV[2]) * 100 + "%";
      }
      if (rHThumb) rHThumb.style.left = (f8TmK2sV[0] / 360) * 100 + "%";
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
      if (z5QpL8wH === "menu") m9TvL2sP.menuColor = hex;
      else if (z5QpL8wH === "buttons") m9TvL2sP.buttonsColor = hex;
      else m9TvL2sP.plexusColor = hex;
      d8KpW4mR();
      p2NmQ6xK(save);
      if (save) x3QnK8wR();
    }

    let palHideT = 0;

    function c7OpenPal(tgt) {
      if (palHideT) {
        clearTimeout(palHideT);
        palHideT = 0;
      }
      c7CloseLang(true);
      z5QpL8wH = tgt;
      const rgb = q3XmR7kB(g2CurrentHex(tgt));
      if (rgb) f8TmK2sV = r6TxL9wN(rgb[0], rgb[1], rgb[2]);
      y2SwapPalEd(tgt);
      if (pSet) pSet.classList.add("macro-pal-dim");
      win
        .querySelectorAll(".macro-settings-body .macro-row")
        .forEach((rw) => rw.classList.remove("macro-pal-active"));
      win.querySelectorAll(".macro-mini-pal").forEach((b) => {
        const on = b.getAttribute("data-target") === tgt;
        const rw = b.closest(".macro-row");
        if (rw) rw.classList.toggle("macro-pal-active", on);
      });
      if (rPop) {
        rPop.style.display = "flex";
        j4PosPal(tgt);
        void rPop.offsetWidth;
      }
      p2NmQ6xK(true);
      if (rPop) rPop.classList.add("open");
      u4PwS8mQ();
    }

    function c7ClosePal(instant) {
      if (palHideT) {
        clearTimeout(palHideT);
        palHideT = 0;
      }
      z5QpL8wH = null;
      if (pSet && !(lPop && lPop.classList.contains("open")))
        pSet.classList.remove("macro-pal-dim");
      win.querySelectorAll(".macro-mini-pal").forEach((b) => {
        const rw = b.closest(".macro-row");
        if (rw) rw.classList.remove("macro-pal-active");
      });
      if (rPop) {
        rPop.classList.remove("open");
        if (instant) {
          rPop.style.display = "none";
          u4PwS8mQ();
        } else {
          palHideT = setTimeout(() => {
            palHideT = 0;
            if (rPop && !rPop.classList.contains("open")) {
              rPop.style.display = "none";
              u4PwS8mQ();
            }
          }, 210);
        }
      }
      p2NmQ6xK();
    }

    win.querySelectorAll(".macro-mini-pal").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const tgt = btn.getAttribute("data-target");
        if (rPop && rPop.classList.contains("open") && z5QpL8wH === tgt)
          c7ClosePal();
        else c7OpenPal(tgt);
      });
    });

    if (window.ResizeObserver && pSet) {
      new ResizeObserver(() => {
        if (rPop && rPop.classList.contains("open") && z5QpL8wH)
          j4PosPal(z5QpL8wH);
        if (lPop && lPop.classList.contains("open")) j4PosLang();
      }).observe(pSet);
    }
    window.addEventListener("resize", () => {
      if (rPop && rPop.classList.contains("open") && z5QpL8wH)
        j4PosPal(z5QpL8wH);
      if (lPop && lPop.classList.contains("open")) j4PosLang();
    });
    if (pSet)
      pSet.addEventListener("scroll", () => {
        if (rPop && rPop.classList.contains("open") && z5QpL8wH)
          j4PosPal(z5QpL8wH);
      });

    window.addEventListener(
      "mousedown",
      (e) => {
        if (!win.classList.contains("open")) return;
        if (!rPop || !rPop.classList.contains("open")) return;
        const target = e.target;
        if (
          target &&
          target.closest &&
          target.closest(
            "#macro-color-pop, .macro-mini-pal, #macro-toggle-pill",
          )
        )
          return;
        c7ClosePal();
      },
      true,
    );

    if (rSv) {
      function updSv(e, save) {
        const rc = rSv.getBoundingClientRect();
        f8TmK2sV[1] = Math.max(
          0,
          Math.min(1, (e.clientX - rc.left) / rc.width),
        );
        f8TmK2sV[2] =
          1 - Math.max(0, Math.min(1, (e.clientY - rc.top) / rc.height));
        l3WvN9xR(save);
      }
      rSv.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        if (document.activeElement && document.activeElement.blur)
          document.activeElement.blur();
        e.preventDefault();
        e.stopPropagation();
        updSv(e, false);
        function mv(ev) {
          updSv(ev, false);
        }
        function up() {
          window.removeEventListener("mousemove", mv);
          window.removeEventListener("mouseup", up);
          window.removeEventListener("blur", up);
          q6CommitVal(rHex);
          q6CommitVal(rRgb);
          x3QnK8wR();
        }
        window.addEventListener("mousemove", mv);
        window.addEventListener("mouseup", up);
        window.addEventListener("blur", up);
      });
    }

    if (rHue) {
      function updHue(e, save) {
        const rc = rHue.getBoundingClientRect();
        f8TmK2sV[0] = Math.max(
          0,
          Math.min(359.9, ((e.clientX - rc.left) / rc.width) * 360),
        );
        l3WvN9xR(save);
      }
      rHue.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        if (document.activeElement && document.activeElement.blur)
          document.activeElement.blur();
        e.preventDefault();
        e.stopPropagation();
        updHue(e, false);
        function mv(ev) {
          updHue(ev, false);
        }
        function up() {
          window.removeEventListener("mousemove", mv);
          window.removeEventListener("mouseup", up);
          window.removeEventListener("blur", up);
          q6CommitVal(rHex);
          q6CommitVal(rRgb);
          x3QnK8wR();
        }
        window.addEventListener("mousemove", mv);
        window.addEventListener("mouseup", up);
        window.addEventListener("blur", up);
      });
    }

    if (rHex) {
      rHex.addEventListener("input", () => {
        if (!z5QpL8wH) return;
        let val = rHex.value.trim();
        if (!val.startsWith("#")) val = "#" + val;
        const rgb = q3XmR7kB(val);
        if (rgb) {
          f8TmK2sV = r6TxL9wN(rgb[0], rgb[1], rgb[2]);
          const hex = val.toLowerCase();
          if (z5QpL8wH === "menu") m9TvL2sP.menuColor = hex;
          else if (z5QpL8wH === "buttons") m9TvL2sP.buttonsColor = hex;
          else m9TvL2sP.plexusColor = hex;
          d8KpW4mR();
          p2NmQ6xK();
          x3QnK8wR();
        }
      });
      rHex.addEventListener("blur", () => p2NmQ6xK(true));
      rHex.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === "Escape") rHex.blur();
      });
    }

    if (rRgb) {
      rRgb.addEventListener("input", () => {
        if (!z5QpL8wH) return;
        const match = rRgb.value
          .trim()
          .match(
            /^(?:rgb\s*\(\s*)?(\d{1,3})(?:\s*,\s*|\s+)(\d{1,3})(?:\s*,\s*|\s+)(\d{1,3})\s*\)?$/i,
          );
        if (!match) return;
        const r = Math.max(0, Math.min(255, parseInt(match[1], 10)));
        const g = Math.max(0, Math.min(255, parseInt(match[2], 10)));
        const b = Math.max(0, Math.min(255, parseInt(match[3], 10)));
        const hex = u7NxV4mK(r, g, b);
        f8TmK2sV = r6TxL9wN(r, g, b);
        if (z5QpL8wH === "menu") m9TvL2sP.menuColor = hex;
        else if (z5QpL8wH === "buttons") m9TvL2sP.buttonsColor = hex;
        else m9TvL2sP.plexusColor = hex;
        d8KpW4mR();
        p2NmQ6xK();
        x3QnK8wR();
      });
      rRgb.addEventListener("blur", () => p2NmQ6xK(true));
      rRgb.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === "Escape") rRgb.blur();
      });
    }

    if (rRst) {
      rRst.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!z5QpL8wH) return;
        if (z5QpL8wH === "menu") m9TvL2sP.menuColor = null;
        else if (z5QpL8wH === "buttons") m9TvL2sP.buttonsColor = null;
        else m9TvL2sP.plexusColor = null;
        w9LpT5vN();
        x3QnK8wR();
      });
    }

    w9LpT5vN();

    const lBtn = document.getElementById("macro-lang-btn");
    const lCur = document.getElementById("macro-lang-cur");
    const lPop = document.getElementById("macro-lang-pop");
    const lList = document.getElementById("macro-lang-list");
    const lRow = lBtn ? lBtn.closest(".macro-lang-row") : null;

    function j4PosLang() {
      if (!lPop || !lBtn || !pSet) return;
      const pRect = pSet.getBoundingClientRect();
      const bRect = lBtn.getBoundingClientRect();
      const fz = parseFloat(getComputedStyle(win).fontSize) || 12;
      const gap = Math.max(3, Math.round(0.28 * fz));
      lPop.style.width = Math.round(bRect.width) + "px";
      lPop.style.left = Math.round(bRect.left - pRect.left) + "px";
      lPop.style.top =
        Math.round(bRect.bottom - pRect.top + pSet.scrollTop + gap) + "px";
      lPop.style.right = "auto";
      lPop.style.bottom = "auto";
    }

    let lHideT = 0;

    function c7CloseLang(keepDim) {
      if (lHideT) {
        clearTimeout(lHideT);
        lHideT = 0;
      }
      if (lBtn) lBtn.classList.remove("open");
      if (lPop) {
        lPop.classList.remove("open");
        if (keepDim) {
          lPop.style.display = "none";
          u4PwS8mQ();
        } else {
          lHideT = setTimeout(() => {
            lHideT = 0;
            if (lPop && !lPop.classList.contains("open")) {
              lPop.style.display = "none";
              u4PwS8mQ();
            }
          }, 210);
        }
      }
      if (lRow) lRow.classList.remove("macro-pal-active");
      if (pSet && !keepDim && !z5QpL8wH) pSet.classList.remove("macro-pal-dim");
    }

    const m4MainPops = [
      {
        id: "revnot",
        row: document.getElementById("macro-row-revnot"),
        btn: document.getElementById("macro-revnot-btn"),
        pop: document.getElementById("macro-revnot-pop"),
        t: 0,
        fixW: true,
      },
      {
        id: "xhair",
        row: document.getElementById("macro-row-xhair"),
        btn: document.getElementById("macro-xhair-btn"),
        pop: document.getElementById("macro-xhair-pop"),
        t: 0,
        fixW: false,
      },
      {
        id: "grid",
        row: document.getElementById("macro-row-map-grid"),
        btn: document.getElementById("macro-grid-btn"),
        pop: document.getElementById("macro-grid-pop"),
        t: 0,
        fixW: false,
      },
      {
        id: "ffmtd",
        row: document.getElementById("macro-hdr-ff"),
        btn: document.getElementById("macro-ffmtd-btn"),
        pop: document.getElementById("macro-ffmtd-pop"),
        t: 0,
        fixW: false,
      },
      {
        id: "solofocus",
        row: document.getElementById("macro-hdr-solo"),
        btn: document.getElementById("macro-solofocus-btn"),
        pop: document.getElementById("macro-solofocus-pop"),
        t: 0,
        fixW: false,
      },
      {
        id: "revmtd",
        row: document.getElementById("macro-hdr-rev"),
        btn: document.getElementById("macro-revmtd-btn"),
        pop: document.getElementById("macro-revmtd-pop"),
        t: 0,
        fixW: false,
      },
      {
        id: "bpmtd",
        row: document.getElementById("macro-row-bpmethod"),
        btn: document.getElementById("macro-bpmtd-btn"),
        pop: document.getElementById("macro-bpmtd-pop"),
        t: 0,
        fixW: false,
      },
      {
        id: "bpradar",
        row: document.getElementById("macro-row-bpradar"),
        btn: document.getElementById("macro-bpradar-btn"),
        pop: document.getElementById("macro-bpradar-pop"),
        t: 0,
        fixW: false,
      },
      {
        id: "holdmode",
        row: document.getElementById("macro-row-holdspam"),
        btn: document.getElementById("macro-holdmode-btn"),
        pop: document.getElementById("macro-holdmode-pop"),
        t: 0,
        fixW: false,
      },
    ];

    function j4PosMainPop(it) {
      if (!it || !it.pop || !it.btn || !b7NmQ2xL) return;
      const pRect = b7NmQ2xL.getBoundingClientRect();
      const bRect = it.btn.getBoundingClientRect();
      const fz = parseFloat(getComputedStyle(win).fontSize) || 12;
      const gap = Math.max(3, Math.round(0.28 * fz));
      if (it.fixW) {
        it.pop.style.width = Math.round(bRect.width) + "px";
        it.pop.style.left = Math.round(bRect.left - pRect.left) + "px";
      } else {
        it.pop.style.minWidth = Math.round(bRect.width) + "px";
        const popW = it.pop.offsetWidth || Math.round(bRect.width);
        const maxL = Math.max(6, Math.round(b7NmQ2xL.clientWidth - popW - 6));
        it.pop.style.left =
          Math.max(6, Math.min(maxL, Math.round(bRect.left - pRect.left))) +
          "px";
      }
      const popH = it.pop.offsetHeight || Math.round(4.6 * fz);
      const up =
        pRect.bottom - bRect.bottom < popH + gap + 6 &&
        bRect.top - pRect.top > popH + gap + 6;
      it.pop.classList.toggle("drop-up", up);
      it.pop.style.top = up
        ? Math.round(bRect.top - pRect.top + b7NmQ2xL.scrollTop - popH - gap) +
          "px"
        : Math.round(bRect.bottom - pRect.top + b7NmQ2xL.scrollTop + gap) +
          "px";
      it.pop.style.right = "auto";
      it.pop.style.bottom = "auto";
    }

    function c7CloseMainPop(instant, exceptId) {
      let anyOpen = false;
      m4MainPops.forEach((it) => {
        if (exceptId && it.id === exceptId) {
          if (it.pop && it.pop.classList.contains("open")) anyOpen = true;
          return;
        }
        if (it.t) {
          clearTimeout(it.t);
          it.t = 0;
        }
        if (it.btn) it.btn.classList.remove("open");
        if (it.pop) {
          it.pop.classList.remove("open");
          if (instant) {
            it.pop.style.display = "none";
          } else {
            it.t = setTimeout(() => {
              it.t = 0;
              if (it.pop && !it.pop.classList.contains("open"))
                it.pop.style.display = "none";
            }, 210);
          }
        }
        if (it.row) it.row.classList.remove("macro-pal-active");
      });
      if (!anyOpen && b7NmQ2xL) b7NmQ2xL.classList.remove("macro-pal-dim");
    }

    function b4BindMainPop(id, onPick) {
      const it = m4MainPops.find((x) => x.id === id);
      if (!it || !it.btn || !it.pop) return;
      it.btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const op = !it.pop.classList.contains("open");
        if (op) {
          c7CloseMainPop(true, id);
          if (it.t) {
            clearTimeout(it.t);
            it.t = 0;
          }
          it.pop.style.display = "block";
          j4PosMainPop(it);
          void it.pop.offsetWidth;
          if (b7NmQ2xL) b7NmQ2xL.classList.add("macro-pal-dim");
          if (it.row) it.row.classList.add("macro-pal-active");
          it.btn.classList.add("open");
          it.pop.classList.add("open");
        } else {
          c7CloseMainPop(false);
        }
      });
      it.pop.addEventListener("click", (e) => {
        const opt =
          e.target && e.target.closest
            ? e.target.closest(".macro-pos-opt")
            : null;
        if (!opt) return;
        e.stopPropagation();
        onPick(opt);
        c7CloseMainPop(false);
      });
    }

    const rnTgl = document.getElementById("macro-toggle-revnot");
    if (rnTgl) {
      rnTgl.addEventListener("change", (e) => {
        m9TvL2sP.revNotify = e.target.checked;
        x3QnK8wR();
        if (m9TvL2sP.revNotify) {
          if (r9RevNotFn) r9RevNotFn(m9TvL2sP.revSplits);
        } else if (r9RevNotClr) {
          r9RevNotClr();
        }
        e.target.blur();
      });
    }
    b4BindMainPop("revnot", (opt) => {
      m9TvL2sP.revNotifyPos =
        opt.getAttribute("data-pos") === "bottom" ? "bottom" : "top";
      x3QnK8wR();
      r8QnM4tL();
      if (m9TvL2sP.revNotify && r9RevNotFn) r9RevNotFn(m9TvL2sP.revSplits);
    });

    const xhTgl = document.getElementById("macro-toggle-xhair");
    if (xhTgl) {
      xhTgl.addEventListener("change", (e) => {
        m9TvL2sP.crosshairEnabled = e.target.checked;
        x3QnK8wR();
        k9SyncXhair();
        e.target.blur();
        f4RefocusGame();
      });
    }
    b4BindMainPop("xhair", (opt) => {
      m9TvL2sP.crosshairStyle =
        opt.getAttribute("data-xhair") === "cross" ? "cross" : "plus";
      x3QnK8wR();
      r8QnM4tL();
      f4RefocusGame();
    });

    const caTgl = document.getElementById("macro-toggle-curarrow");
    if (caTgl) {
      caTgl.addEventListener("change", (e) => {
        m9TvL2sP.cursorArrow = e.target.checked;
        x3QnK8wR();
        if (k9CurFn) k9CurFn();
        e.target.blur();
        f4RefocusGame();
      });
    }

    const scTgl = document.getElementById("macro-toggle-softcol");
    if (scTgl) {
      scTgl.addEventListener("change", (e) => {
        m9TvL2sP.softColors = e.target.checked;
        x3QnK8wR();
        if (!m9TvL2sP.softColors) j2RstSoft();
        e.target.blur();
        f4RefocusGame();
      });
    }

    const grTgl = document.getElementById("macro-toggle-map-grid");
    if (grTgl) {
      grTgl.addEventListener("change", (e) => {
        m9TvL2sP.mapGridEnabled = e.target.checked;
        x3QnK8wR();
        e.target.blur();
        f4RefocusGame();
        if (b7DrawFn) b7DrawFn();
      });
    }
    b4BindMainPop("grid", (opt) => {
      m9TvL2sP.mapGridMode =
        opt.getAttribute("data-grid") === "over" ? "over" : "bg";
      x3QnK8wR();
      r8QnM4tL();
      f4RefocusGame();
    });

    b4BindMainPop("ffmtd", (opt) => {
      const nxt = opt.getAttribute("data-ffmtd") === "auto" ? "auto" : "manual";
      if (m9TvL2sP.ffMethod !== nxt) k4FfCancel(false);
      m9TvL2sP.ffMethod = nxt;
      x3QnK8wR();
      r8QnM4tL();
      u4PwM8xQ();
      f4RefocusGame();
    });

    b4BindMainPop("solofocus", (opt) => {
      m9TvL2sP.soloFocus =
        opt.getAttribute("data-solofocus") === "window" ? "window" : "multibox";
      x3QnK8wR();
      r8QnM4tL();
      f4RefocusGame();
    });

    b4BindMainPop("revmtd", (opt) => {
      const nxt = opt.getAttribute("data-revmtd") === "pixi" ? "pixi" : "ws";
      if (m9TvL2sP.revMethod !== nxt) q2WnS7xM(false);
      m9TvL2sP.revMethod = nxt;
      x3QnK8wR();
      r8QnM4tL();
      f4RefocusGame();
    });

    b4BindMainPop("bpmtd", (opt) => {
      const val = opt.getAttribute("data-bpmtd");
      m9TvL2sP.bypassMethod = b6ModeList.includes(val) ? val : "smart";
      b6BpSt.cvsMiss = 0;
      b6BpSt.holdUntil = 0;
      b6BpSt.needPeek = false;
      b6BpSt.wasPeek = false;
      b6BpSt.nextIsPeek = false;
      b6BpSt.returnToBest = false;
      x3QnK8wR();
      r8QnM4tL();

      f4RefocusGame();
    });

    b4BindMainPop("bpradar", (opt) => {
      m9TvL2sP.bypassRadarMode =
        opt.getAttribute("data-bprad") === "fixed" ? "fixed" : "real";
      x3QnK8wR();
      r8QnM4tL();

      f4RefocusGame();
    });

    b4BindMainPop("holdmode", (opt) => {
      m9TvL2sP.holdSpamMode =
        opt.getAttribute("data-holdmode") === "release" ? "release" : "hold";
      if (
        m9TvL2sP.holdSpamMode === "release" &&
        (!document.hasFocus() || document.hidden)
      ) {
        hCl2xK9m();
      }
      x3QnK8wR();
      r8QnM4tL();
      f4RefocusGame();
    });

    if (window.ResizeObserver && b7NmQ2xL) {
      new ResizeObserver(() => {
        m4MainPops.forEach((it) => {
          if (it.pop && it.pop.classList.contains("open")) j4PosMainPop(it);
        });
      }).observe(b7NmQ2xL);
    }
    window.addEventListener("resize", () => {
      m4MainPops.forEach((it) => {
        if (it.pop && it.pop.classList.contains("open")) j4PosMainPop(it);
      });
    });
    window.addEventListener(
      "mousedown",
      (e) => {
        if (!win.classList.contains("open")) return;
        const op = m4MainPops.some(
          (it) => it.pop && it.pop.classList.contains("open"),
        );
        if (!op) return;
        const t = e.target;
        if (
          t &&
          t.closest &&
          t.closest(
            "#macro-revnot-pop, #macro-revnot-btn, #macro-xhair-pop, #macro-xhair-btn, #macro-grid-pop, #macro-grid-btn, #macro-revmtd-pop, #macro-revmtd-btn, #macro-ffmtd-pop, #macro-ffmtd-btn, #macro-solofocus-pop, #macro-solofocus-btn, #macro-bpmtd-pop, #macro-bpmtd-btn, #macro-bpradar-pop, #macro-bpradar-btn, #macro-holdmode-pop, #macro-holdmode-btn, .macro-custom-scroll-track, #macro-toggle-pill",
          )
        )
          return;
        c7CloseMainPop(false);
      },
      true,
    );

    g4PopClsFn = () => {
      c7ClosePal(true);
      c7CloseLang(true);
      c7CloseMainPop(true);
      if (pSet) pSet.classList.remove("macro-pal-dim");
    };

    const m4CurVer = "0.5.0";
    let m4LastVer = "";
    const v8UpdEl = document.getElementById("macro-ver-banner");
    function c3CmpVer(a, b) {
      const pa = String(a || "")
        .replace(/^v/i, "")
        .split(".")
        .map((n) => parseInt(n, 10) || 0);
      const pb = String(b || "")
        .replace(/^v/i, "")
        .split(".")
        .map((n) => parseInt(n, 10) || 0);
      const ln = Math.max(pa.length, pb.length);
      for (let i = 0; i < ln; i++) {
        const da = pa[i] || 0,
          db = pb[i] || 0;
        if (da !== db) return da > db ? 1 : -1;
      }
      return 0;
    }
    function r5UpdBanner() {
      if (v8UpdEl && m4LastVer) v8UpdEl.textContent = k3Tr("updRec", m4LastVer);
    }
    function a8ApplyVer(d) {
      if (!v8UpdEl || !d) return;
      const vStr = d.latest || d.version;
      if (!vStr || c3CmpVer(vStr, m4CurVer) <= 0) return;
      m4LastVer = String(vStr);
      if (typeof d.url === "string" && /^https:\/\//i.test(d.url))
        v8UpdEl.href = d.url;
      v8UpdEl.style.display = "block";
      r5UpdBanner();
      u4PwM8xQ();
    }

    function q4ApplyLang() {
      win.querySelectorAll("[data-i18n]").forEach((el) => {
        el.textContent = k3Tr(el.getAttribute("data-i18n"));
      });
      win.querySelectorAll("[data-i18n-title]").forEach((el) => {
        el.setAttribute("title", k3Tr(el.getAttribute("data-i18n-title")));
      });
      win.querySelectorAll("[data-i18n-aria]").forEach((el) => {
        el.setAttribute("aria-label", k3Tr(el.getAttribute("data-i18n-aria")));
      });
      win.querySelectorAll("[data-i18n-trick]").forEach((el) => {
        const idx = parseInt(el.getAttribute("data-i18n-trick"), 10);
        el.textContent = `${k3Tr("trick")} ${idx}x (${1 << idx}c)`;
      });
      win.querySelectorAll("[data-i18n-selrev]").forEach((el) => {
        const idx = parseInt(el.getAttribute("data-i18n-selrev"), 10);
        el.textContent = `${k3Tr("selRev")} ${idx}x (${1 << idx}c)`;
      });
      win.querySelectorAll("[data-i18n-ph]").forEach((el) => {
        el.setAttribute("placeholder", k3Tr(el.getAttribute("data-i18n-ph")));
      });
      win.querySelectorAll("[data-ff-del-lbl]").forEach((el) => {
        el.textContent = k3Tr("ffDelN", el.getAttribute("data-ff-del-lbl"));
      });
      win.querySelectorAll("[data-ff-lbl]").forEach((el) => {
        el.textContent = `${k3Tr("ff")} ${el.getAttribute("data-ff-lbl")}`;
      });
      const actL =
        t3LangList.find((l) => l.code === m9TvL2sP.lang) || t3LangList[0];
      if (lCur) lCur.textContent = `${actL.name} (${actL.code.toUpperCase()})`;
      if (lList) {
        lList.querySelectorAll(".macro-lang-opt").forEach((opt) => {
          opt.classList.toggle(
            "active",
            opt.getAttribute("data-lang") === actL.code,
          );
        });
      }
      if (rnLblEl) rnLblEl.textContent = k3Tr("splitsLbl");
      r8QnM4tL();
      if (typeof r5UpdBanner === "function") r5UpdBanner();
      u4PwM8xQ();
      u4PwS8mQ();
    }
    b6ApplyLangFn = q4ApplyLang;

    if (lBtn && lPop) {
      lBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const op = !lPop.classList.contains("open");
        if (op) {
          if (lHideT) {
            clearTimeout(lHideT);
            lHideT = 0;
          }
          c7ClosePal(true);
          lPop.style.display = "block";
          j4PosLang();
          void lPop.offsetWidth;
          if (pSet) pSet.classList.add("macro-pal-dim");
          if (lRow) lRow.classList.add("macro-pal-active");
          lBtn.classList.add("open");
          lPop.classList.add("open");
          u4PwS8mQ();
        } else {
          c7CloseLang();
        }
      });
    }

    if (lList) {
      lList.addEventListener("click", (e) => {
        const opt =
          e.target && e.target.closest
            ? e.target.closest(".macro-lang-opt")
            : null;
        if (!opt) return;
        e.stopPropagation();
        const cd = opt.getAttribute("data-lang");
        if (!cd || !t3LangDict[cd]) return;
        m9TvL2sP.lang = cd;
        x3QnK8wR();
        q4ApplyLang();
        c7CloseLang();
      });
    }

    window.addEventListener(
      "mousedown",
      (e) => {
        if (!win.classList.contains("open")) return;
        if (!lPop || !lPop.classList.contains("open")) return;
        const t = e.target;
        if (
          t &&
          t.closest &&
          t.closest(
            "#macro-lang-pop, #macro-lang-btn, .macro-custom-scroll-track, #macro-toggle-pill",
          )
        )
          return;
        c7CloseLang();
      },
      true,
    );

    q4ApplyLang();

    fetch(
      "https://kuksikoid.github.io/gota-multibox-guide/version.json?t=" +
        Math.floor(Date.now() / 60000),
    )
      .then((r) => (r.ok ? r.json() : null))
      .then(a8ApplyVer)
      .catch(() => {});

    if (aNk) {
      if (m9TvL2sP.customNicksHeight)
        aNk.style.height = m9TvL2sP.customNicksHeight + "px";
      aNk.addEventListener("mouseup", () => {
        if (
          aNk.offsetHeight &&
          aNk.offsetHeight !== m9TvL2sP.customNicksHeight
        ) {
          m9TvL2sP.customNicksHeight = aNk.offsetHeight;
          x3QnK8wR();
        }
      });
      aNk.addEventListener("input", (e) => {
        m9TvL2sP.customNicks = e.target.value;
        x3QnK8wR();
      });
      aNk.addEventListener("keydown", (e) => {
        if (e.key === "Escape") aNk.blur();
      });
    }

    const cfgBox = document.getElementById("macro-cfg-json");
    const cfgCopyBtn = document.getElementById("macro-btn-cfg-copy");
    const cfgApplyBtn = document.getElementById("macro-btn-cfg-apply");
    let cfgDirty = false,
      cfgCopyTm = 0,
      cfgApplyTm = 0;

    e7CfgBoxSync = (force) => {
      if (!cfgBox) return;
      if (!force && (cfgDirty || document.activeElement === cfgBox)) return;
      q2SetVal(cfgBox, e7BuildCfgJson(), true);
      cfgDirty = false;
    };

    if (cfgBox) {
      cfgBox.addEventListener("input", () => {
        cfgDirty = cfgBox.value.trim().length > 0;
      });
      cfgBox.addEventListener("keydown", (e) => {
        if (e.key === "Escape") cfgBox.blur();
      });
      if (window.ResizeObserver) new ResizeObserver(u4PwS8mQ).observe(cfgBox);
    }

    function n6NormCfg(src) {
      const cfg = {};
      const ks = Object.keys(z4XqW8mT);
      for (let i = 0; i < ks.length; i++) {
        const k = ks[i];
        cfg[k] = Object.prototype.hasOwnProperty.call(src, k)
          ? src[k]
          : z4XqW8mT[k];
      }
      cfg.soloDelay = Math.max(
        50,
        Math.min(3000, Number(cfg.soloDelay) || 800),
      );
      cfg.autoDelay = Math.max(
        50,
        Math.min(3000, Number(cfg.autoDelay) || 800),
      );
      const cM = Number(cfg.cullMargin);
      cfg.cullMargin = Number.isFinite(cM)
        ? Math.max(30, Math.min(500, Math.round(cM)))
        : 120;
      const rS = Number(cfg.renderScale);
      cfg.renderScale = Number.isFinite(rS)
        ? Math.max(25, Math.min(100, Math.round(rS)))
        : 100;
      cfg.revSplits = [2, 4, 8, 16, 32, 64, 128, 256].includes(
        Number(cfg.revSplits),
      )
        ? Number(cfg.revSplits)
        : 4;
      const wW = Number(cfg.winWidth),
        wH = Number(cfg.winHeight);
      cfg.winWidth = Number.isFinite(wW) ? Math.max(280, Math.round(wW)) : 320;
      cfg.winHeight = Number.isFinite(wH) ? Math.max(320, Math.round(wH)) : 560;
      ["pillX", "pillY", "winX", "winY", "customNicksHeight"].forEach((k) => {
        cfg[k] =
          typeof cfg[k] === "number" && Number.isFinite(cfg[k]) ? cfg[k] : null;
      });
      [
        "keyMenu",
        "keyAuto",
        "keyFfLock",
        "keyFfActivate",
        "keyT2",
        "keyT4",
        "keyT8",
        "keyT16",
        "keyT32",
        "keyT64",
        "keyT128",
        "keyT256",
        "keyRevLock",
        "keyRevUnlock",
        "keyRevSplit1",
        "keyRevSplit2",
        "keyRevSplit3",
        "keyRevSplit4",
        "keyRevSplit5",
        "keyRevSplit6",
        "keyRevSplit7",
        "keyRevSplit8",
        "keyHoldSpam",
      ].forEach((k) => {
        cfg[k] =
          typeof cfg[k] === "string" && cfg[k].trim() ? cfg[k].trim() : null;
      });
      cfg.extraFastFeeds = Array.isArray(cfg.extraFastFeeds)
        ? cfg.extraFastFeeds
            .filter((x) => x && typeof x === "object")
            .map((x) => ({
              delay: Math.max(50, Math.min(3000, Number(x.delay) || 800)),
              key:
                typeof x.key === "string" && x.key.trim() ? x.key.trim() : null,
            }))
        : [];
      cfg.customNicks =
        typeof cfg.customNicks === "string"
          ? cfg.customNicks
          : z4XqW8mT.customNicks;
      [
        "skinStealer",
        "nameStealer",
        "customSwitcher",
        "frustumCulling",
        "stripFilters",
        "cullMarginToggle",
        "renderScaleToggle",
        "mapBgEnabled",
        "fixedBackgroundEnabled",
        "mapGridEnabled",
        "crosshairEnabled",
        "cursorArrow",
        "softColors",
        "plexusEnabled",
        "syncScale",
        "revNotify",
        "selectableText",
        "pillTransparent",
      ].forEach((k) => {
        cfg[k] = Boolean(cfg[k]);
      });
      if (cfg.customSwitcher) {
        cfg.skinStealer = false;
        cfg.nameStealer = false;
      } else if (cfg.nameStealer) {
        cfg.skinStealer = false;
      }
      cfg.mapBgSrc =
        typeof cfg.mapBgSrc === "string" && cfg.mapBgSrc.trim()
          ? cfg.mapBgSrc.trim()
          : null;
      cfg.fixedBgSrc =
        typeof cfg.fixedBgSrc === "string" && cfg.fixedBgSrc.trim()
          ? cfg.fixedBgSrc.trim()
          : null;
      cfg.mapGridMode = cfg.mapGridMode === "over" ? "over" : "bg";
      cfg.crosshairStyle = cfg.crosshairStyle === "cross" ? "cross" : "plus";
      cfg.revNotifyPos = cfg.revNotifyPos === "bottom" ? "bottom" : "top";
      cfg.revMethod = cfg.revMethod === "pixi" ? "pixi" : "ws";
      cfg.holdSpamMode = cfg.holdSpamMode === "release" ? "release" : "hold";
      cfg.ffMethod = cfg.ffMethod === "auto" ? "auto" : "manual";
      cfg.soloFocus = cfg.soloFocus === "window" ? "window" : "multibox";
      ["menuColor", "buttonsColor", "plexusColor"].forEach((k) => {
        cfg[k] =
          typeof cfg[k] === "string" && /^#[0-9a-f]{6}$/i.test(cfg[k])
            ? cfg[k].toLowerCase()
            : null;
      });
      cfg.bypassEnabled = Boolean(cfg.bypassEnabled);
      cfg.bypassMethod = b6ModeList.includes(cfg.bypassMethod)
        ? cfg.bypassMethod
        : "smart";
      const bpT = Number(cfg.bypassTtl);
      cfg.bypassTtl = Number.isFinite(bpT)
        ? Math.max(1500, Math.min(25000, Math.round(bpT)))
        : 8500;
      cfg.bypassPhantoms = Boolean(cfg.bypassPhantoms);
      cfg.bypassRadar = Boolean(cfg.bypassRadar);
      cfg.bypassRadarMode = cfg.bypassRadarMode === "fixed" ? "fixed" : "real";
      cfg.bypassRadarLock = Boolean(cfg.bypassRadarLock);
      cfg.bypassMapX =
        typeof cfg.bypassMapX === "number" && Number.isFinite(cfg.bypassMapX)
          ? cfg.bypassMapX
          : null;
      cfg.bypassMapY =
        typeof cfg.bypassMapY === "number" && Number.isFinite(cfg.bypassMapY)
          ? cfg.bypassMapY
          : null;
      const bpS = Number(cfg.bypassMapSize);
      cfg.bypassMapSize = Number.isFinite(bpS)
        ? Math.max(140, Math.min(440, Math.round(bpS)))
        : 220;
      cfg.lang =
        typeof cfg.lang === "string" && t3LangDict[cfg.lang] ? cfg.lang : "en";
      return cfg;
    }
    b6NormCfgFn = n6NormCfg;

    if (cfgCopyBtn) {
      cfgCopyBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const txt = e7BuildCfgJson();
        cfgDirty = false;
        e7CfgBoxSync(true);
        const done = () => {
          clearTimeout(cfgCopyTm);
          cfgCopyBtn.textContent = k3Tr("cfgCopied");
          cfgCopyTm = setTimeout(() => {
            cfgCopyBtn.textContent = k3Tr("cfgCopy");
          }, 1100);
        };
        const fbCopy = () => {
          try {
            const ta = document.createElement("textarea");
            ta.value = txt;
            ta.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0;";
            document.body.appendChild(ta);
            ta.select();
            document.execCommand("copy");
            ta.remove();
            done();
          } catch (_) {}
        };
        if (
          navigator.clipboard &&
          typeof navigator.clipboard.writeText === "function"
        ) {
          navigator.clipboard.writeText(txt).then(done).catch(fbCopy);
        } else {
          fbCopy();
        }
      });
    }

    if (cfgApplyBtn) {
      cfgApplyBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        const raw = cfgBox ? cfgBox.value.trim() : "";
        let parsed = null;
        try {
          parsed = raw ? JSON.parse(raw) : null;
        } catch (_) {
          parsed = null;
        }
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          clearTimeout(cfgApplyTm);
          cfgApplyBtn.classList.add("macro-cfg-err");
          cfgApplyBtn.textContent = k3Tr("cfgInvalid");
          cfgApplyTm = setTimeout(() => {
            cfgApplyBtn.classList.remove("macro-cfg-err");
            cfgApplyBtn.textContent = k3Tr("cfgApply");
          }, 1300);
          return;
        }
        hCl2xK9m();
        q2WnS7xM(false);
        k4FfCancel(false);
        c6RmP3xW.clear();
        m9TvL2sP = n6NormCfg(parsed);
        cfgDirty = false;
        if (m9TvL2sP.pillX === null || m9TvL2sP.pillY === null) {
          pill.style.left = "auto";
          pill.style.right = "0px";
          pill.style.top = "0px";
          pill.style.bottom = "auto";
        }
        v6WpL2sT(pill);
        const vpWc = document.documentElement.clientWidth || window.innerWidth;
        const cW = Math.max(280, m9TvL2sP.winWidth || 320);
        const cH = Math.max(320, m9TvL2sP.winHeight || 560);
        win.style.width = cW + "px";
        win.style.height = cH + "px";
        if (m9TvL2sP.winX === null || m9TvL2sP.winX >= vpWc - cW - 10) {
          win.style.left = "auto";
          win.style.right = "0px";
        } else {
          win.style.left = Math.max(0, m9TvL2sP.winX) + "px";
          win.style.right = "auto";
        }
        win.style.top =
          (m9TvL2sP.winY !== null ? Math.max(0, m9TvL2sP.winY) : 52) + "px";
        win.style.bottom = "auto";
        if (aNk)
          aNk.style.height = m9TvL2sP.customNicksHeight
            ? m9TvL2sP.customNicksHeight + "px"
            : "";
        v8PalHist.menu = {};
        v8PalHist.buttons = {};
        v8PalHist.plexus = {};
        c7ClosePal(true);
        c7CloseLang(true);
        c7CloseMainPop(true);
        if (r9RevNotClr) r9RevNotClr();
        if (!m9TvL2sP.mapBgSrc) window.setMapBackground(null);
        else
          k2LoadBg("mapBgSrc", "map", window.setMapBackground, "mapBgEnabled");
        if (!m9TvL2sP.fixedBgSrc) window.setFixedBackground(null);
        else
          k2LoadBg(
            "fixedBgSrc",
            "fixed",
            window.setFixedBackground,
            "fixedBackgroundEnabled",
          );
        k8QmN3vR();
        f4KzP9wL(win);
        x3QnK8wR();
        q4ApplyLang();
        if (s2NpK7wL) s2NpK7wL();
        if (p9RndRef) p9ApplyRes(p9RndRef);
        if (!m9TvL2sP.bypassEnabled) {
          b6ScanStop();
          b6ResetWorld(false);
        }
        if (b6FitMapWin) b6FitMapWin();
        if (b6SyncRadarLock) b6SyncRadarLock();

        e7CfgBoxSync(true);
        clearTimeout(cfgApplyTm);
        cfgApplyBtn.classList.remove("macro-cfg-err");
        cfgApplyBtn.textContent = k3Tr("cfgApplied");
        cfgApplyTm = setTimeout(() => {
          cfgApplyBtn.textContent = k3Tr("cfgApply");
        }, 1100);
      });
    }

    document
      .getElementById("macro-btn-all-reset")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        hCl2xK9m();
        q2WnS7xM(false);
        k4FfCancel(false);
        b6ScanStop();
        b6ResetWorld(false);
        b6BpSt.cvsMiss = 0;
        b6BpSt.holdUntil = 0;
        b6BpSt.needPeek = false;
        b6BpSt.wasPeek = false;
        b6BpSt.nextIsPeek = false;
        b6BpSt.returnToBest = false;
        window.setMapBackground(null);
        window.setFixedBackground(null);
        k2DbClr();
        m9TvL2sP = Object.assign({}, z4XqW8mT);
        pill.style.left = "auto";
        pill.style.right = "0px";
        pill.style.top = "0px";
        pill.style.bottom = "auto";
        v6WpL2sT(pill);
        win.style.width = m9TvL2sP.winWidth + "px";
        win.style.height = m9TvL2sP.winHeight + "px";
        win.style.left = "auto";
        win.style.right = "0px";
        win.style.top = "52px";
        win.style.bottom = "auto";
        if (aNk) aNk.style.height = "";
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
        c7CloseMainPop(true);
        if (r9RevNotClr) r9RevNotClr();
        cfgDirty = false;
        k8QmN3vR();
        f4KzP9wL(win);
        x3QnK8wR();
        q4ApplyLang();
        if (b6FitMapWin) b6FitMapWin();
        if (b6SyncRadarLock) b6SyncRadarLock();

        if (s2NpK7wL) s2NpK7wL();
        if (p9RndRef) p9ApplyRes(p9RndRef);
        e7CfgBoxSync(true);
      });

    function j5TwM9xK(wEl, cEl) {
      const cX = cEl.getContext("2d");
      let pW = (cEl.width = cEl.offsetWidth || 320);
      let pH = (cEl.height = cEl.offsetHeight || 520);

      const vW = Math.max(3840, window.screen.width || 2560);
      const vH = Math.max(2160, window.screen.height || 1440);
      const nP = Math.floor((vW * vH) / 9200);
      const mD = 120,
        mDSq = mD * mD;
      const pts = [];

      for (let i = 0; i < nP; i++) {
        pts.push({
          x: Math.random() * vW,
          y: Math.random() * vH,
          vx: (Math.random() - 0.5) * 0.38,
          vy: (Math.random() - 0.5) * 0.38,
          r: Math.random() * 1.6 + 1.2,
        });
      }

      let p5RnK8wL = false;
      let p2VmQ4xT = 0;

      function rF() {
        if (!m9TvL2sP.plexusEnabled) {
          if (
            !wEl.classList.contains("open") ||
            (p2VmQ4xT && performance.now() - p2VmQ4xT > 240)
          ) {
            cX.setTransform(1, 0, 0, 1, 0, 0);
            cX.clearRect(0, 0, pW, pH);
            p5RnK8wL = false;
            return;
          }
        }
        if (wEl.classList.contains("open")) {
          const cRc = cEl.getBoundingClientRect();
          const oX = cRc.left,
            oY = cRc.top;

          if (
            cEl.width !== cEl.offsetWidth ||
            cEl.height !== cEl.offsetHeight
          ) {
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

            const lx = p.x - oX,
              ly = p.y - oY;
            if (lx >= -mD && lx <= vPW + mD && ly >= -mD && ly <= vPH + mD) {
              vL.push({ x: lx, y: ly, r: p.r });
              if (
                lx >= -p.r &&
                lx <= vPW + p.r &&
                ly >= -p.r &&
                ly <= vPH + p.r
              ) {
                cX.beginPath();
                cX.arc(lx, ly, p.r, 0, Math.PI * 2);
                cX.fillStyle = "rgba(" + g3VxL8mQ[0] + ",0.8)";
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
              const dx = p1.x - p2.x,
                dy = p1.y - p2.y;
              const dSq = dx * dx + dy * dy;

              if (dSq < mDSq) {
                links++;
                const d = Math.sqrt(dSq);
                const a = 1 - d / mD;

                cX.beginPath();
                cX.moveTo(p1.x, p1.y);
                cX.lineTo(p2.x, p2.y);
                cX.strokeStyle = "rgba(" + g3VxL8mQ[1] + "," + a * 0.38 + ")";
                cX.lineWidth = 1.05;
                cX.stroke();

                let tris = 0;
                for (let k = j + 1; k < vLn && tris < 3; k++) {
                  const p3 = vL[k];
                  const dx2 = p1.x - p3.x,
                    dy2 = p1.y - p3.y;
                  const dSq2 = dx2 * dx2 + dy2 * dy2;

                  if (dSq2 < mDSq) {
                    const dx3 = p2.x - p3.x,
                      dy3 = p2.y - p3.y;
                    const dSq3 = dx3 * dx3 + dy3 * dy3;

                    if (dSq3 < mDSq) {
                      tris++;
                      cX.beginPath();
                      cX.moveTo(p1.x, p1.y);
                      cX.lineTo(p2.x, p2.y);
                      cX.lineTo(p3.x, p3.y);
                      cX.closePath();
                      cX.fillStyle =
                        "rgba(" + g3VxL8mQ[2] + "," + a * 0.11 + ")";
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
        cEl.style.opacity = on ? "1" : "0";
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
    q9EnvOk = 1;
  }

  function initGfx() {
    if (document.getElementById("macro-bg-canvas")) return;
    const bCv = document.createElement("canvas");
    bCv.id = "macro-bg-canvas";
    const vW0 = document.documentElement.clientWidth || window.innerWidth;
    const vH0 = document.documentElement.clientHeight || window.innerHeight;
    bCv.width = vW0;
    bCv.height = vH0;
    bCv.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;z-index:-1;pointer-events:none;";
    document.body.appendChild(bCv);
    const c2D = bCv.getContext("2d", { alpha: true });

    const gCvOv = document.createElement("canvas");
    gCvOv.id = "macro-grid-canvas";
    gCvOv.width = vW0;
    gCvOv.height = vH0;
    gCvOv.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;z-index:999995;pointer-events:none;";
    document.body.appendChild(gCvOv);
    const g2D = gCvOv.getContext("2d", { alpha: true });

    const lCv = document.createElement("canvas");
    lCv.id = "macro-curline-canvas";
    lCv.width = vW0;
    lCv.height = vH0;
    lCv.style.cssText =
      "position:fixed;top:0;left:0;width:100%;height:100%;z-index:999996;pointer-events:none;";
    document.body.appendChild(lCv);
    const l2D = lCv.getContext("2d", { alpha: true });

    const stEl = document.createElement("style");
    (document.head || document.documentElement).appendChild(stEl);

    let bgDrty = false;
    let gridDrty = false;
    let lDrty = false,
      lRun = false,
      lBox = null;
    let lPx = NaN,
      lPy = NaN,
      lOx = NaN,
      lOy = NaN,
      lRl = NaN,
      lRt = NaN,
      lRw = NaN,
      lRh = NaN,
      lDp = 0,
      lLn = false,
      lXh = false;

    function g4CamMtx(gCv, rL, rT, rW, rH, nw) {
      if (p9PixiOn && nw - p9LastPixiMs <= 500) {
        const sw = p9ScW > 0 ? p9ScW : rW;
        const sh = p9ScH > 0 ? p9ScH : rH;
        const sx = rW / sw,
          sy = rH / sh;
        return {
          a: p9WtA * sx,
          b: p9WtB * sy,
          c: p9WtC * sx,
          d: p9WtD * sy,
          tx: rL + p9WtTx * sx,
          ty: rT + p9WtTy * sy,
        };
      }
      if (kAct && nw - p9GlMs <= 500) {
        return { a: zM, b: 0, c: 0, d: zM, tx: rL + tX, ty: rT + tY };
      }
      if (p9C2On && gCv && gCv.width > 0 && gCv.height > 0) {
        const sx = rW / gCv.width,
          sy = rH / gCv.height;
        return {
          a: p9C2A * sx,
          b: 0,
          c: 0,
          d: p9C2D * sy,
          tx: rL + p9C2Tx * sx,
          ty: rT + p9C2Ty * sy,
        };
      }
      if (v4WsCam.init || b6BpSt.camAt > 0) {
        const cx = v4WsCam.init ? v4WsCam.dx : b6BpSt.camX;
        const cy = v4WsCam.init ? v4WsCam.dy : b6BpSt.camY;
        const cz = v4WsCam.init ? v4WsCam.dz : b6BpSt.camZoom;
        const sc = cz * Math.max(rW / 1920, rH / 1080);
        if (sc > 0.002) {
          return {
            a: sc,
            b: 0,
            c: 0,
            d: sc,
            tx: rL + rW * 0.5 - cx * sc,
            ty: rT + rH * 0.5 - cy * sc,
          };
        }
      }
      const curZ = k3WnL8vR() || 0.395;
      return {
        a: curZ,
        b: 0,
        c: 0,
        d: curZ,
        tx: rL + rW * 0.5,
        ty: rT + rH * 0.5,
      };
    }

    function d4Grid(ctx, dpr, rL, rT, rW, rH, mtx) {
      const mX = p9MapX,
        mY = p9MapY,
        mW = p9MapW,
        mH = p9MapH;
      if (mW <= 0 || mH <= 0 || Math.hypot(mtx.a, mtx.b) < 1e-6) return;
      const x0 = mX * mtx.a + mY * mtx.c + mtx.tx,
        y0 = mX * mtx.b + mY * mtx.d + mtx.ty;
      const x1 = (mX + mW) * mtx.a + mY * mtx.c + mtx.tx,
        y1 = (mX + mW) * mtx.b + mY * mtx.d + mtx.ty;
      const x2 = (mX + mW) * mtx.a + (mY + mH) * mtx.c + mtx.tx,
        y2 = (mX + mW) * mtx.b + (mY + mH) * mtx.d + mtx.ty;
      const x3 = mX * mtx.a + (mY + mH) * mtx.c + mtx.tx,
        y3 = mX * mtx.b + (mY + mH) * mtx.d + mtx.ty;
      if (
        Math.max(x0, x1, x2, x3) < rL ||
        Math.min(x0, x1, x2, x3) > rL + rW ||
        Math.max(y0, y1, y2, y3) < rT ||
        Math.min(y0, y1, y2, y3) > rT + rH
      )
        return;

      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.beginPath();
      ctx.rect(rL, rT, rW, rH);
      ctx.clip();

      ctx.beginPath();
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.closePath();
      ctx.clip();

      ctx.beginPath();
      for (let i = 0; i <= 5; i++) {
        const t = i / 5;
        const wx = mX + mW * t;
        ctx.moveTo(
          wx * mtx.a + mY * mtx.c + mtx.tx,
          wx * mtx.b + mY * mtx.d + mtx.ty,
        );
        ctx.lineTo(
          wx * mtx.a + (mY + mH) * mtx.c + mtx.tx,
          wx * mtx.b + (mY + mH) * mtx.d + mtx.ty,
        );
        const wy = mY + mH * t;
        ctx.moveTo(
          mX * mtx.a + wy * mtx.c + mtx.tx,
          mX * mtx.b + wy * mtx.d + mtx.ty,
        );
        ctx.lineTo(
          (mX + mW) * mtx.a + wy * mtx.c + mtx.tx,
          (mX + mW) * mtx.b + wy * mtx.d + mtx.ty,
        );
      }
      ctx.strokeStyle = "rgba(220, 225, 235, 0.11)";
      ctx.lineWidth = 1.25;
      ctx.stroke();

      const cw = mW / 5,
        ch = mH / 5;
      const cellSW = Math.hypot(cw * mtx.a, cw * mtx.b);
      const cellSH = Math.hypot(ch * mtx.c, ch * mtx.d);
      const fs = Math.min(cellSW, cellSH) * 0.21;
      if (fs >= 5) {
        const rows = "ABCDE";
        const ang = Math.atan2(mtx.b, mtx.a);
        const scT = fs / 48;
        const pad = Math.max(cellSW, cellSH) * 0.65;
        ctx.font = '700 48px "Ubuntu", sans-serif, Arial';
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "rgba(220, 225, 235, 0.085)";
        for (let r = 0; r < 5; r++) {
          const wy = mY + (r + 0.5) * ch;
          for (let cl = 0; cl < 5; cl++) {
            const wx = mX + (cl + 0.5) * cw;
            const lx = wx * mtx.a + wy * mtx.c + mtx.tx;
            const ly = wx * mtx.b + wy * mtx.d + mtx.ty;
            if (
              lx + pad < rL ||
              lx - pad > rL + rW ||
              ly + pad < rT ||
              ly - pad > rT + rH
            )
              continue;
            ctx.save();
            ctx.translate(lx, ly);
            if (Math.abs(ang) > 0.001) ctx.rotate(ang);
            ctx.scale(scT, scT);
            ctx.fillText(rows[r] + (cl + 1), 0, 0);
            ctx.restore();
          }
        }
      }
      ctx.restore();
    }

    function drawBg() {
      const isFix = Boolean(m9TvL2sP.fixedBackgroundEnabled && u4TkQ);
      const isMap = Boolean(m9TvL2sP.mapBgEnabled && q8MwP);
      const isBgGrid = Boolean(
        m9TvL2sP.mapGridEnabled && m9TvL2sP.mapGridMode !== "over",
      );
      const isOverGrid = Boolean(
        m9TvL2sP.mapGridEnabled && m9TvL2sP.mapGridMode === "over",
      );

      if (!isFix && u4TkQ && u4TkQ.t === 2 && !u4TkQ.v.paused) {
        try {
          u4TkQ.v.pause();
        } catch (_) {}
      }
      if (!isMap && q8MwP && q8MwP.t === 2 && !q8MwP.v.paused) {
        try {
          q8MwP.v.pause();
        } catch (_) {}
      }

      const bW = document.documentElement.clientWidth || window.innerWidth;
      const bH = document.documentElement.clientHeight || window.innerHeight;
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const tgW = Math.round(bW * dpr),
        tgH = Math.round(bH * dpr);

      let gCv = null,
        rL = 0,
        rT = 0,
        rW = bW,
        rH = bH,
        mtx = null;
      if (isMap || isBgGrid || isOverGrid) {
        gCv = p9CvRef || p9C2Cv || t8VwM4xK();
        if (gCv && !gCv.hasAttribute("data-macro-game-bg"))
          gCv.setAttribute("data-macro-game-bg", "1");
        const cRc = gCv ? gCv.getBoundingClientRect() : null;
        rL = cRc && cRc.width > 0 ? cRc.left : 0;
        rT = cRc && cRc.height > 0 ? cRc.top : 0;
        rW = cRc && cRc.width > 0 ? cRc.width : bW;
        rH = cRc && cRc.height > 0 ? cRc.height : bH;
        mtx = g4CamMtx(gCv, rL, rT, rW, rH, performance.now());
      }

      if (!isFix && !isMap && !isBgGrid) {
        if (stEl.textContent) stEl.textContent = "";
        if (bgDrty) {
          c2D.setTransform(1, 0, 0, 1, 0, 0);
          c2D.clearRect(0, 0, bCv.width, bCv.height);
          bgDrty = false;
        }
      } else {
        if (bCv.width !== tgW || bCv.height !== tgH) {
          bCv.width = tgW;
          bCv.height = tgH;
        }
        c2D.setTransform(dpr, 0, 0, dpr, 0, 0);
        c2D.clearRect(0, 0, bW, bH);
        bgDrty = true;

        if (!stEl.textContent) {
          stEl.textContent =
            "html, body, #canvas, canvas[data-macro-game-bg] { background: transparent !important; background-color: transparent !important; }";
        }
        c2D.imageSmoothingEnabled = true;
        c2D.imageSmoothingQuality = "high";

        if (isFix || isMap) {
          c2D.fillStyle = "#050508";
          c2D.fillRect(0, 0, bW, bH);
          if (isFix) {
            if (u4TkQ.t === 1) {
              c2D.fillStyle = u4TkQ.v;
              c2D.fillRect(0, 0, bW, bH);
            } else if (u4TkQ.t === 2) {
              const v = u4TkQ.v;
              if (v.paused && !document.hidden) v.play().catch(() => {});
              if (v.readyState >= 2 && v.videoWidth && v.videoHeight)
                c2D.drawImage(v, 0, 0, bW, bH);
            } else if (u4TkQ.t === 3) {
              const im = u4TkQ.v;
              if (im.complete && im.naturalWidth)
                c2D.drawImage(im, 0, 0, bW, bH);
            }
          }
          if (isMap) {
            c2D.save();
            c2D.beginPath();
            c2D.rect(rL, rT, rW, rH);
            c2D.clip();
            c2D.setTransform(
              mtx.a * dpr,
              mtx.b * dpr,
              mtx.c * dpr,
              mtx.d * dpr,
              mtx.tx * dpr,
              mtx.ty * dpr,
            );
            const mX = p9MapX,
              mY = p9MapY,
              mW = p9MapW,
              mH = p9MapH;
            if (q8MwP.t === 1) {
              c2D.fillStyle = q8MwP.v;
              c2D.fillRect(mX, mY, mW, mH);
            } else if (q8MwP.t === 2) {
              const v = q8MwP.v;
              if (v.paused && !document.hidden) v.play().catch(() => {});
              if (v.readyState >= 2 && v.videoWidth && v.videoHeight) {
                const sDim = Math.min(v.videoWidth, v.videoHeight);
                const sx = (v.videoWidth - sDim) * 0.5,
                  sy = (v.videoHeight - sDim) * 0.5;
                c2D.drawImage(v, sx, sy, sDim, sDim, mX, mY, mW, mH);
              }
            } else if (q8MwP.t === 3) {
              const im = q8MwP.v;
              if (im.complete && im.naturalWidth)
                c2D.drawImage(im, mX, mY, mW, mH);
            }
            c2D.restore();
          }
        } else {
          c2D.fillStyle = p9BgCol || "#111111";
          c2D.fillRect(0, 0, bW, bH);
        }

        if (isBgGrid && mtx) {
          d4Grid(c2D, dpr, rL, rT, rW, rH, mtx);
        }
        c2D.setTransform(1, 0, 0, 1, 0, 0);
      }

      if (!isOverGrid) {
        if (gridDrty) {
          g2D.setTransform(1, 0, 0, 1, 0, 0);
          g2D.clearRect(0, 0, gCvOv.width, gCvOv.height);
          gridDrty = false;
        }
      } else {
        if (gCvOv.width !== tgW || gCvOv.height !== tgH) {
          gCvOv.width = tgW;
          gCvOv.height = tgH;
        }
        g2D.setTransform(dpr, 0, 0, dpr, 0, 0);
        g2D.clearRect(0, 0, bW, bH);
        if (mtx) d4Grid(g2D, dpr, rL, rT, rW, rH, mtx);
        g2D.setTransform(1, 0, 0, 1, 0, 0);
        gridDrty = true;
      }
    }

    function k9DrawLine() {
      const lnOn = Boolean(m9TvL2sP.cursorArrow);
      if (!lnOn) {
        if (lDrty) {
          l2D.setTransform(1, 0, 0, 1, 0, 0);
          l2D.clearRect(0, 0, lCv.width, lCv.height);
          lBox = null;
          lDrty = false;
        }
        lRun = false;
        return;
      }
      const vW = document.documentElement.clientWidth || window.innerWidth;
      const vH = document.documentElement.clientHeight || window.innerHeight;
      const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
      const tgW = Math.round(vW * dpr),
        tgH = Math.round(vH * dpr);
      const rsz = lCv.width !== tgW || lCv.height !== tgH;
      if (rsz) {
        lCv.width = tgW;
        lCv.height = tgH;
        lBox = null;
      }
      const gCv = p9CvRef || p9C2Cv || t8VwM4xK();
      const cRc = gCv ? gCv.getBoundingClientRect() : null;
      const rL = cRc && cRc.width > 0 ? cRc.left : 0;
      const rT = cRc && cRc.height > 0 ? cRc.top : 0;
      const rW = cRc && cRc.width > 0 ? cRc.width : vW;
      const rH = cRc && cRc.height > 0 ? cRc.height : vH;
      const ox = rL + rW * 0.5,
        oy = rT + rH * 0.5;
      const tx = t2QnL9wP,
        ty = b8VmK3xT;
      const inCv = Boolean(
        gCv && tx >= rL && tx <= rL + rW && ty >= rT && ty <= rT + rH,
      );
      const xhVis = Boolean(m9TvL2sP.crosshairEnabled) && inCv && !curOverUi;
      if (
        rsz ||
        !lDrty ||
        tx !== lPx ||
        ty !== lPy ||
        ox !== lOx ||
        oy !== lOy ||
        rL !== lRl ||
        rT !== lRt ||
        rW !== lRw ||
        rH !== lRh ||
        dpr !== lDp ||
        lnOn !== lLn ||
        xhVis !== lXh
      ) {
        lPx = tx;
        lPy = ty;
        lOx = ox;
        lOy = oy;
        lRl = rL;
        lRt = rT;
        lRw = rW;
        lRh = rH;
        lDp = dpr;
        lLn = lnOn;
        lXh = xhVis;
        l2D.setTransform(dpr, 0, 0, dpr, 0, 0);
        if (lBox) l2D.clearRect(lBox.x, lBox.y, lBox.w, lBox.h);
        else if (!rsz) l2D.clearRect(0, 0, vW, vH);
        const dx = tx - ox,
          dy = ty - oy;
        const dist = Math.hypot(dx, dy);
        const gap = xhVis ? 8 : 0;
        if (dist > gap + 0.5) {
          const kEnd = (dist - gap) / dist;
          const ex = ox + dx * kEnd,
            ey = oy + dy * kEnd;
          l2D.save();
          l2D.beginPath();
          l2D.rect(rL, rT, rW, rH);
          l2D.clip();
          const gr = l2D.createLinearGradient(ox, oy, ex, ey);
          gr.addColorStop(0, "rgba(255, 255, 255, 0)");
          gr.addColorStop(0.3, "rgba(255, 255, 255, 0.06)");
          gr.addColorStop(0.72, "rgba(255, 255, 255, 0.24)");
          gr.addColorStop(1, "rgba(255, 255, 255, 0.52)");
          l2D.beginPath();
          l2D.moveTo(ox, oy);
          l2D.lineTo(ex, ey);
          l2D.strokeStyle = gr;
          l2D.lineWidth = 1.15;
          l2D.lineCap = "round";
          l2D.stroke();
          l2D.restore();
          const pad = 4;
          const bx = Math.max(0, Math.floor(Math.min(ox, ex) - pad));
          const by = Math.max(0, Math.floor(Math.min(oy, ey) - pad));
          const bx2 = Math.min(vW, Math.ceil(Math.max(ox, ex) + pad));
          const by2 = Math.min(vH, Math.ceil(Math.max(oy, ey) + pad));
          lBox = {
            x: bx,
            y: by,
            w: Math.max(0, bx2 - bx),
            h: Math.max(0, by2 - by),
          };
        } else {
          lBox = null;
        }
        lDrty = true;
      }
      k9LwP2xM(k9DrawLine);
    }

    k9CurFn = function () {
      if (m9TvL2sP.cursorArrow) {
        lPx = NaN;
        if (!lRun) {
          lRun = true;
          k9LwP2xM(k9DrawLine);
        }
      } else if (lDrty) {
        l2D.setTransform(1, 0, 0, 1, 0, 0);
        l2D.clearRect(0, 0, lCv.width, lCv.height);
        lBox = null;
        lDrty = false;
      }
    };

    b7DrawFn = drawBg;
    k9CurFn();

    window.addEventListener(
      "resize",
      () => {
        drawBg();
        if (m9TvL2sP.crosshairEnabled) k9SyncXhair();
      },
      { passive: true },
    );

    function loop() {
      const nw = performance.now();
      if (
        (!p9PixiOn || nw - p9LastPixiMs > 45) &&
        (!kAct || nw - p9GlMs > 45 || nw - w2VpL9xK > 45)
      )
        drawBg();
      window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(loop);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initGfx, { once: true });
  } else {
    initGfx();
  }

  window.addEventListener(
    "focus",
    () => {
      const act = document.activeElement,
        tn = act ? (act.tagName || "").toLowerCase() : "";
      if (
        (tn === "input" && act.type !== "checkbox") ||
        tn === "textarea" ||
        (act && act.isContentEditable)
      )
        return;
      if (
        act &&
        (act.tagName === "BUTTON" || act.tagName === "A") &&
        act.closest &&
        act.closest("#macro-window")
      )
        act.blur();
      const cv = t8VwM4xK();
      if (cv && cv.focus) cv.focus();
    },
    { passive: true },
  );

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", y9WnK2vT);
  } else {
    y9WnK2vT();
  }
})();
