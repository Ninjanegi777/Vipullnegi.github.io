/* ==========================================================================
   VIPUL 95 <-> Modern switch (shared by both versions)

   How it works
   - The 90s site lives in /95/, the modern site at the root. Every page has a
     twin at the same path:  about.html  <->  95/about.html
   - The visitor's choice is saved in localStorage ("siteMode") and kept until
     they press the switch again. First-time visitors get the 90s version.
   - Load this file in the <head> of every page, WITHOUT defer/async, so a
     visitor who chose the other version is redirected before the page paints.
   - The button goes into an element with id="mode-switch-slot" if the page
     has one (taskbar / header). Otherwise it floats bottom-right.
   ========================================================================== */
(function () {
  var KEY = "siteMode";
  var DEFAULT_MODE = "95"; // change to "modern" to make the modern site the default

  var script = document.currentScript;
  var src = script ? script.src : "";
  var ROOT = src.replace(/assets\/js\/switch\.js(\?.*)?$/, "");
  var here = location.href.split("#")[0].split("?")[0];
  var hash = location.hash || "";
  var rel = here.indexOf(ROOT) === 0 ? here.slice(ROOT.length) : "";
  if (rel === "" || /\/$/.test(rel)) rel += "index.html";

  var mode = /^95\//.test(rel) ? "95" : "modern";
  var twin = mode === "95" ? rel.replace(/^95\//, "") : "95/" + rel;
  var twinUrl = ROOT + twin + hash;

  function getSaved() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function save(m) {
    try { localStorage.setItem(KEY, m); } catch (e) {}
  }

  // 1) Keep visitors in the version they picked.
  var wanted = getSaved() || DEFAULT_MODE;
  if (wanted !== mode && ROOT) {
    location.replace(twinUrl);
    return;
  }

  // 2) The switch button + transition.
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var css =
    ".ms-btn{display:inline-flex;align-items:center;gap:8px;cursor:pointer;font:inherit;white-space:nowrap}" +
    ".ms-btn .ms-knob{position:relative;width:38px;height:20px;flex:0 0 38px}" +
    ".ms-float{position:fixed;right:16px;bottom:16px;z-index:9000}" +
    /* modern look */
    ".ms-modern{min-height:40px;padding:0 14px 0 10px;border-radius:999px;border:1px solid rgba(127,127,127,.35);background:#111;color:#fff;font-family:'Space Grotesk',system-ui,sans-serif;font-weight:600;font-size:14px;box-shadow:0 4px 14px rgba(0,0,0,.18)}" +
    ".ms-modern:hover{background:#1e4b9a}" +
    ".ms-modern .ms-knob{border-radius:999px;background:#c0c0c0;border:2px solid;border-color:#fff #404040 #404040 #fff;box-sizing:border-box}" +
    ".ms-modern .ms-knob::after{content:'';position:absolute;top:2px;left:2px;width:12px;height:12px;background:#000080}" +
    /* 95 look */
    ".ms-95{min-height:40px;padding:0 10px;background:#c0c0c0;color:#000;font-family:'Space Mono',monospace;font-weight:700;font-size:13px;border:2px solid;border-color:#fff #404040 #404040 #fff;box-shadow:inset -1px -1px #808080,inset 1px 1px #dfdfdf}" +
    ".ms-95:active{border-color:#404040 #fff #fff #404040}" +
    ".ms-95 .ms-knob{background:#fff;border:2px solid;border-color:#808080 #fff #fff #808080;box-sizing:border-box}" +
    ".ms-95 .ms-knob::after{content:'';position:absolute;top:2px;right:2px;width:13px;height:12px;border-radius:50%;background:#1e4b9a}" +
    ".ms-btn:focus-visible{outline:3px solid #ffeb3b;outline-offset:2px}" +
    /* overlay */
    ".ms-overlay{position:fixed;inset:0;z-index:99999;display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .25s ease}" +
    ".ms-overlay.on{opacity:1}" +
    ".ms-up{background:#008080}" +
    ".ms-down{background:#000;color:#39ff14;font-family:'VT323',monospace}" +
    ".ms-dialog{width:min(420px,88vw);background:#c0c0c0;border:2px solid;border-color:#fff #404040 #404040 #fff;box-shadow:inset -1px -1px #808080,inset 1px 1px #dfdfdf;font-family:'Space Mono',monospace;color:#000}" +
    ".ms-dialog .ms-t{background:linear-gradient(90deg,#000080,#1084d0);color:#fff;padding:4px 8px;font-family:'VT323',monospace;font-size:20px}" +
    ".ms-dialog .ms-b{padding:20px;font-size:14px;line-height:1.5}" +
    ".ms-bar{margin-top:14px;height:22px;background:#fff;border:2px solid;border-color:#808080 #fff #fff #808080;padding:2px;box-sizing:border-box}" +
    ".ms-bar i{display:block;height:100%;width:0;background:repeating-linear-gradient(90deg,#000080 0 12px,transparent 12px 15px);transition:width 1s steps(14)}" +
    ".ms-crt{font-size:clamp(22px,4vw,34px);line-height:1.4;padding:24px;max-width:640px;width:100%}" +
    ".ms-crt .c{animation:msb 1s steps(2,start) infinite}" +
    "@keyframes msb{to{visibility:hidden}}" +
    "@media (max-width:480px){.ms-modern{padding:0 10px}.ms-modern .ms-label{display:none}}" +
    ".ms-flash{position:fixed;inset:0;background:#fff;z-index:99998;animation:msf .6s ease-out forwards;pointer-events:none}" +
    "@keyframes msf{from{opacity:1}to{opacity:0}}";

  function addStyles() {
    var s = document.createElement("style");
    s.textContent = css;
    document.head.appendChild(s);
  }

  function makeButton(inSlot) {
    var b = document.createElement("button");
    b.type = "button";
    var target = mode === "95" ? "modern" : "95";
    b.className = "ms-btn " + (mode === "95" ? "ms-95" : "ms-modern") + (inSlot ? "" : " ms-float");
    b.setAttribute("aria-label", mode === "95" ? "Switch to the modern website" : "Switch to the 90s website");
    b.title = b.getAttribute("aria-label");
    b.innerHTML =
      '<span class="ms-knob" aria-hidden="true"></span>' +
      "<span class=\"ms-label\">" + (mode === "95" ? "Go modern" : "Go 95") + "</span>";
    b.addEventListener("click", function () { go(target); });
    return b;
  }

  function go(target) {
    save(target);
    try { sessionStorage.setItem("msSwitched", "1"); } catch (e) {}
    if (reduce) { location.href = twinUrl; return; }

    var o = document.createElement("div");
    o.setAttribute("role", "status");
    o.setAttribute("aria-live", "polite");
    if (target === "modern") {
      o.className = "ms-overlay ms-up";
      o.innerHTML =
        '<div class="ms-dialog"><div class="ms-t">Setup Wizard</div><div class="ms-b">' +
        "Upgrading VIPUL 95 to VIPUL 2026…<br>Please do not turn off your computer." +
        '<div class="ms-bar"><i></i></div></div></div>';
    } else {
      o.className = "ms-overlay ms-down";
      o.innerHTML =
        '<div class="ms-crt">C:\\&gt; REBOOT /YEAR=1995<br>Loading VIPUL 95…<br>' +
        'Memory test: 640K OK<span class="c">_</span></div>';
    }
    document.body.appendChild(o);
    requestAnimationFrame(function () {
      o.classList.add("on");
      var bar = o.querySelector(".ms-bar i");
      if (bar) setTimeout(function () { bar.style.width = "100%"; }, 120);
    });
    setTimeout(function () { location.href = twinUrl; }, 1300);
  }

  function arrive() {
    // A quick flash when you land after switching, then restore scroll.
    var came = null;
    try { came = sessionStorage.getItem("msSwitched"); sessionStorage.removeItem("msSwitched"); } catch (e) {}
    if (came && !reduce) {
      var f = document.createElement("div");
      f.className = "ms-flash";
      document.body.appendChild(f);
      setTimeout(function () { f.remove(); }, 700);
    }
  }

  function mount() {
    addStyles();
    var slot = document.getElementById("mode-switch-slot");
    var btn = makeButton(!!slot);
    (slot || document.body).appendChild(btn);
    arrive();
  }

  // Header/taskbar slots are rendered by the page scripts, so wait for them.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { setTimeout(mount, 0); });
  } else {
    setTimeout(mount, 0);
  }

  // When the browser restores a page from its back/forward cache, re-check the choice.
  window.addEventListener("pageshow", function (e) {
    if (e.persisted && (getSaved() || DEFAULT_MODE) !== mode) location.replace(twinUrl);
  });
})();
