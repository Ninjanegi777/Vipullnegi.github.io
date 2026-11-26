/* ==========================================================================
   VIPUL 95 — scripts for the 90s version
   - SITE: name, email, links (keep in step with assets/js/main.js)
   - Builds the top menu bar, the yellow "Let's talk!" footer and the taskbar.
   - Pages in 95/work/ set <body data-root="../"> so links resolve.
   - data-page marks the current nav item; data-task is the taskbar label.
   ========================================================================== */

const SITE = {
  name: "Vipul Negi",
  email: "vipul1negi@gmail.com",
  resume: "https://drive.google.com/file/d/1iauAGseeMoaIC74NTz6H7hw4zyhPWUAh/view?usp=sharing",
  linkedin: "https://www.linkedin.com/in/vipul-negi19/",
  instagram: "https://www.instagram.com/",
  nav: [
    { label: "My Work", href: "index.html#work" },
    { label: "About Me", href: "about.html" },
    { label: "Contact", href: "contact.html" },
  ],
};

const ROOT = document.body.dataset.root || "";
const PAGE = document.body.dataset.page || "";
const TASK = document.body.dataset.task || "WELCOME.EXE";

const winLogo = (s = 32) =>
  `<svg width="${s}" height="${s}" viewBox="0 0 32 32" aria-hidden="true" shape-rendering="crispEdges"><rect x="2" y="2" width="13" height="13" fill="#e53935"/><rect x="17" y="2" width="13" height="13" fill="#43a047"/><rect x="2" y="17" width="13" height="13" fill="#1e88e5"/><rect x="17" y="17" width="13" height="13" fill="#fdd835"/></svg>`;

/* ---------- Top menu bar ---------- */
function renderTopbar() {
  const el = document.getElementById("site-header");
  if (!el) return;
  el.className = "topbar";
  const links = SITE.nav
    .map((n) => {
      const cur = !n.href.includes("#") && n.href === PAGE ? ' aria-current="page"' : "";
      return `<a class="btn" href="${ROOT}${n.href}"${cur}>${n.label}</a>`;
    })
    .join("");
  el.innerHTML = `
    <div class="wrap">
      <a class="logo95" href="${ROOT}index.html" aria-label="${SITE.name}, home">${winLogo()}<span>VIPUL.EXE</span></a>
      <nav class="topnav" aria-label="Main">${links}<a class="btn btn--yellow" href="${SITE.resume}" target="_blank" rel="noopener">Resume.pdf</a></nav>
    </div>`;
}

/* ---------- Footer ---------- */
function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  el.innerHTML = `
    <footer class="foot95" id="contact">
      <div class="tape" aria-hidden="true"></div>
      <div class="wrap">
        <p class="prompt">&gt; got a complex product? let's make it enjoyable<span class="blink">_</span></p>
        <h2>Let's<br><span>talk!</span></h2>
        <div class="foot-links">
          <a class="btn" href="mailto:${SITE.email}">✉ ${SITE.email} <span aria-hidden="true">▸</span></a>
          <a class="btn" href="${SITE.linkedin}" target="_blank" rel="noopener">LinkedIn <span aria-hidden="true">▸</span></a>
          <a class="btn" href="${SITE.instagram}" target="_blank" rel="noopener">Instagram <span aria-hidden="true">▸</span></a>
          <a class="btn" href="${ROOT}contact.html">Send a message <span aria-hidden="true">▸</span></a>
        </div>
        <div class="buttons88">
          <span class="b88" style="background:#000080;color:#fff">MADE WITH<br>NOTEPAD</span>
          <span class="b88" style="background:#39ff14">Y2K<br>COMPLIANT</span>
          <span class="b88" style="background:#c2185b;color:#fff">HUMAN<br>CENTRED</span>
          <span class="b88" style="background:#fff">BEST VIEWED<br>ON ANY SCREEN</span>
          <span style="flex:1"></span>
          <a class="btn" href="#top">▲ Back to top</a>
        </div>
        <small>© ${new Date().getFullYear()} ${SITE.name} · Product &amp; UX Designer · Ireland</small>
      </div>
    </footer>`;
}

/* ---------- Taskbar + Start menu + clock ---------- */
function renderTaskbar() {
  const bar = document.createElement("div");
  bar.className = "taskbar";
  bar.innerHTML = `
    <button type="button" class="btn start" id="start-btn" aria-expanded="false" aria-controls="start-menu">${winLogo(20)} Start</button>
    <span class="sunken task-tab">${TASK}</span>
    <span class="task-spacer"></span>
    <span id="mode-switch-slot"></span>
    <span class="sunken clock" id="clock" aria-label="Current time"></span>`;
  const menu = document.createElement("div");
  menu.className = "win startmenu";
  menu.id = "start-menu";
  menu.hidden = true;
  menu.innerHTML = `
    <div class="side"><span>VIPUL 95</span></div>
    <ul>
      <li><a href="${ROOT}index.html">🏠 Home</a></li>
      <li><a href="${ROOT}index.html#work">📁 My Work</a></li>
      <li><a href="${ROOT}about.html">🖥️ About Me</a></li>
      <li><a href="${ROOT}contact.html">✉️ Contact</a></li>
      <li><a href="${SITE.resume}" target="_blank" rel="noopener">📄 Resume.pdf</a></li>
      <li><hr></li>
      <li><a href="#top">⏻ Shut Down…</a></li>
    </ul>`;
  document.body.append(menu, bar);

  const btn = bar.querySelector("#start-btn");
  const setOpen = (open) => {
    menu.hidden = !open;
    btn.setAttribute("aria-expanded", open);
    if (open) menu.querySelector("a").focus();
  };
  btn.addEventListener("click", (e) => { e.stopPropagation(); setOpen(menu.hidden); });
  document.addEventListener("click", (e) => { if (!menu.hidden && !menu.contains(e.target)) setOpen(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { setOpen(false); btn.focus(); } });
  menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setOpen(false)));

  const clock = bar.querySelector("#clock");
  const tick = () => {
    const d = new Date();
    let h = d.getHours();
    const ap = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    clock.textContent = `${h}:${String(d.getMinutes()).padStart(2, "0")} ${ap}`;
  };
  tick();
  setInterval(tick, 15000);
}

/* ---------- Rotating phrases ---------- */
function initRotators() {
  document.querySelectorAll("[data-rotate]").forEach((el, i) => {
    const words = el.dataset.rotate.split("|").map((s) => s.trim());
    let n = 0;
    el.textContent = words[0];
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setTimeout(() => {
      setInterval(() => {
        el.classList.add("is-out");
        setTimeout(() => { n = (n + 1) % words.length; el.textContent = words[n]; el.classList.remove("is-out"); }, 300);
      }, 2800);
    }, i * 500);
  });
}

/* ---------- Tabs (testimonials) ---------- */
function initTabs() {
  document.querySelectorAll("[data-tabs]").forEach((group) => {
    const tabs = [...group.querySelectorAll('[role="tab"]')];
    const select = (tab) => tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute("aria-selected", on);
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute("aria-controls")).hidden = !on;
    });
    tabs.forEach((t, i) => {
      t.addEventListener("click", () => select(t));
      t.addEventListener("keydown", (e) => {
        const dir = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!dir) return;
        e.preventDefault();
        const next = tabs[(i + dir + tabs.length) % tabs.length];
        select(next);
        next.focus();
      });
    });
  });
}

/* ---------- Case studies: table of contents highlight ---------- */
function initToc() {
  const links = [...document.querySelectorAll(".toc a")];
  if (!links.length || !("IntersectionObserver" in window)) return;
  const map = new Map(links.map((a) => [a.getAttribute("href").slice(1), a]));
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => a.classList.remove("is-active"));
    map.get(e.target.id)?.classList.add("is-active");
  }), { rootMargin: "-30% 0px -60% 0px" });
  map.forEach((_, id) => { const s = document.getElementById(id); if (s) io.observe(s); });
}

/* ---------- Image lightbox ---------- */
function initLightbox() {
  const imgs = document.querySelectorAll(".gallery img, .cs-cover img");
  if (!imgs.length) return;
  const box = document.createElement("div");
  box.className = "lightbox";
  box.hidden = true;
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", "Image preview");
  box.innerHTML = "<img alt=''>";
  document.body.appendChild(box);
  const big = box.querySelector("img");
  const close = () => { box.hidden = true; document.body.style.overflow = ""; };
  imgs.forEach((img) => img.addEventListener("click", () => {
    big.src = img.currentSrc || img.src;
    big.alt = img.alt;
    box.hidden = false;
    document.body.style.overflow = "hidden";
  }));
  box.addEventListener("click", close);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !box.hidden) close(); });
}

/* ---------- Contact form (mailto by default, or data-endpoint for Formspree) ---------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  const status = form.querySelector("[data-status]");
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    const endpoint = form.dataset.endpoint;
    if (endpoint) {
      status.textContent = "Sending… please wait";
      try {
        const res = await fetch(endpoint, { method: "POST", headers: { Accept: "application/json" }, body: new FormData(form) });
        if (!res.ok) throw new Error();
        form.reset();
        status.textContent = "Message sent! I'll get back to you soon.";
      } catch {
        status.textContent = `Error: something went wrong. Please email me at ${SITE.email}.`;
      }
      return;
    }
    const subject = encodeURIComponent(`Hello from ${data.name}`);
    const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
    status.textContent = "Your email app should open with the message ready to send.";
  });
}

renderTopbar();
renderFooter();
renderTaskbar();
initRotators();
initTabs();
initToc();
initLightbox();
initContactForm();
