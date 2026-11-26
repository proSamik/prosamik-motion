/* ProSamik motion storyboard engine, v4.
   Reads window.STORYBOARD (frames.js) and steps frame by frame.
   Camera (unchanged from v3): talking-head frames zoom into the left or right part of the camera
   frame (face off-centre, graphics on the open side, clear of the face and the mic), screen-share
   frames switch to the camera-box-plus-app-window layout, cutaways are a full white plate.
   Nothing is ever placed above the head.
   Motion (new in v4): every frame is a GSAP timeline. Plates slide in from the open side, text lines
   rise through masks, the red key-word box wipes in, hand-written underlines and arrows draw, flow
   nodes cascade, ticks pop, counters count. While a frame holds, the cards drift a few pixels
   (parallax) and the camera pushes 2%. Before the next frame the plates slide back out.
   Without GSAP, or with prefers-reduced-motion, every frame simply lands in its final state.
   Keys: Right/Down next, Left/Up back, Space or P play/pause (loops every frame), R replay, C captions,
   N notes, T table, G guides, F fullscreen, M sound on or off. ?play starts playing on load.
   Audio (v4.5): audio.js lists one voice clip per frame (the spoken line). Each frame plays its clip,
   the caption follows the clip's timing, and during Play the next frame comes when the clip ends.
   ?refs=../refs/ swaps in the local reference stills; the public page shows the illustrated stand-in. */
(function () {
  const SB = window.STORYBOARD;
  const frames = SB.frames;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const RM = window.matchMedia ? matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  const q = new URLSearchParams(location.search);
  // ?still: every frame lands in its final state (stills / review). ?seek=0.4: freeze each frame at 0.4s.
  const STILL = q.has("still");
  const SEEK = q.has("seek") ? Math.max(0, parseFloat(q.get("seek")) || 0) : null;
  const motion = () => !!window.gsap && !RM.matches && !STILL;

  if (SB.accent) {
    document.documentElement.style.setProperty("--c1", SB.accent[0]);
    document.documentElement.style.setProperty("--c2", SB.accent[1]);
  }
  document.title = "Storyboard v" + (SB.version || 4) + ": " + SB.title;
  $(".title").textContent = SB.title;

  const refsRaw = q.get("refs");
  const REFS = refsRaw && /^[\w.\-/]+\/$/.test(refsRaw) && !refsRaw.includes("//") ? refsRaw : null;

  /* ---------- camera geometry (1920x1080 source) ----------
     face: centre and half size of the face zone; mic: the mic and boom head. Measured on the
     reference stills; the illustrated stand-in is drawn to match look 1. */
  const LOOKS = {
    1: { fx: 970, fy: 370, hw: 190, hh: 300, mic: [620, 720, 1040, 1080] },
    2: { fx: 1078, fy: 500, hw: 178, hh: 268, mic: [680, 780, 1120, 1080] },
    3: { fx: 970, fy: 370, hw: 190, hh: 300, mic: [620, 720, 1040, 1080] },
  };
  const STAND = { fx: 960, fy: 370, hw: 190, hh: 300, mic: [620, 720, 1040, 1080] };
  /* the public page uses one approved still of Samik (photo.jpg, taken from look 1) for every look */
  const PHOTO = "photo.jpg?v=4.4"; // his edited blue hoodie still (look 1), picked by Samik Nov 26
  const lookFor = (ref) => (REFS ? LOOKS[ref] || LOOKS[1] : PHOTO ? LOOKS[1] : STAND);
  const TARGET_X = { right: 1330, left: 590, center: 960 };
  const CAP_TOP = 862; // caption pill top on talking-head frames (lower middle of the frame)

  function camFor(f) {
    const c = f.cam || { shot: "head", ref: 1, zoom: 1, face: "center" };
    if (c.shot === "screen") return { shot: "screen", capTop: 912 };
    if (c.shot !== "head") return { shot: c.shot };
    const look = lookFor(c.ref);
    let s = c.zoom || 1;
    // the stand-in has one framing, so the slightly wider look 2 is shown with a little less zoom
    if (!REFS && !PHOTO && c.ref === 2) s = Math.max(1, s - 0.1);
    const side = c.face || "center";
    const tx = clamp(TARGET_X[side] - s * look.fx, 1920 - 1920 * s, 0);
    const ty = clamp((look === LOOKS[2] ? 430 : 400) - s * look.fy, 1080 - 1080 * s, 0);
    const P = (x, y) => [tx + s * x, ty + s * y];
    const [fl, ft] = P(look.fx - look.hw, look.fy - look.hh);
    const [fr, fb] = P(look.fx + look.hw, look.fy + look.hh);
    const [ml, mt] = P(look.mic[0], look.mic[1]);
    const [mr, mb] = P(look.mic[2], look.mic[3]);
    let pl, pr;
    if (side === "right") { pl = 100; pr = fl - 60; }
    else if (side === "left") { pl = fr + 60; pr = 1820; }
    else { pl = 100; pr = fl - 50; }
    // graphics column: from the safe top down to the caption band, and never into the mic
    const pt = 110;
    let pb = 800;
    if (ml < pr && mr > pl) pb = Math.min(pb, mt - 24);
    return { shot: "head", c, look, s, tx, ty, side, face: [fl, ft, fr, fb], mic: [ml, mt, mr, Math.min(1080, mb)], pl, pw: pr - pl, pt, ph: pb - pt, capTop: CAP_TOP, fx: tx + s * look.fx, fy: ty + s * look.fy };
  }

  /* ---------- illustrated stand-in (neutral, no real photos) ---------- */
  const SCENE = `<svg class="scene" viewBox="0 0 1920 1080" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="sWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d7590"/><stop offset="1" stop-color="#22465a"/></linearGradient>
      <pattern id="sFold" width="86" height="1080" patternUnits="userSpaceOnUse"><rect width="86" height="1080" fill="#b4883f"/><rect x="0" width="22" height="1080" fill="#9a7234"/><rect x="40" width="16" height="1080" fill="#c9a058"/></pattern>
      <linearGradient id="sShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>
      <radialGradient id="sHead" cx=".45" cy=".4" r=".7"><stop offset="0" stop-color="#8c7a70"/><stop offset="1" stop-color="#5f5049"/></radialGradient>
      <linearGradient id="sHood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2d36"/><stop offset="1" stop-color="#15171c"/></linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#sWall)"/>
    <rect x="560" width="720" height="1080" fill="url(#sFold)"/>
    <g>
      <rect x="1250" y="0" width="670" height="1080" fill="#3a2418"/>
      <rect x="1250" y="0" width="22" height="1080" fill="#5a3320"/><rect x="1880" y="0" width="40" height="1080" fill="#5a3320"/>
      <rect x="1250" y="250" width="670" height="22" fill="#6a3d26"/>
      <rect x="1250" y="560" width="670" height="22" fill="#6a3d26"/>
      <rect x="1250" y="860" width="670" height="22" fill="#6a3d26"/>
      <path d="M1310 250 l-14 -120 h120 l-14 120z" fill="#c8652d"/><path d="M1356 132 c-30 -60 -10 -110 4 -120 c10 30 30 70 -4 120z M1360 132 c30 -50 70 -60 90 -60 c-20 30 -50 60 -90 60z" fill="#5f7a3a"/>
      <rect x="1500" y="120" width="30" height="130" fill="#e9e4da"/><rect x="1545" y="150" width="90" height="100" fill="#d9d2c4"/><rect x="1660" y="100" width="34" height="150" fill="#ece8df"/>
      <g fill-opacity=".92"><rect x="1300" y="400" width="34" height="160" fill="#c94f3d"/><rect x="1336" y="420" width="30" height="140" fill="#e1b43c"/><rect x="1368" y="390" width="38" height="170" fill="#3f6fa0"/><rect x="1408" y="430" width="26" height="130" fill="#e8e1d3"/><rect x="1436" y="405" width="36" height="155" fill="#5c8a4e"/><rect x="1474" y="415" width="30" height="145" fill="#b7472c"/><rect x="1506" y="395" width="40" height="165" fill="#d98a3a"/><rect x="1548" y="425" width="28" height="135" fill="#2f4f7a"/><rect x="1610" y="430" width="34" height="130" fill="#8b3a4a"/><rect x="1646" y="410" width="30" height="150" fill="#e6d8b8"/></g>
      <rect x="1310" y="720" width="260" height="140" fill="#2b1a12"/>
    </g>
    <rect width="1920" height="1080" fill="url(#sShade)"/>
    <rect x="590" y="470" width="740" height="560" rx="90" fill="#24262b"/>
    <path d="M420 1080 C 440 820, 600 700, 820 676 L 1100 676 C 1320 700, 1480 820, 1500 1080 Z" fill="url(#sHood)"/>
    <path d="M820 676 C 860 760, 1060 760, 1100 676" fill="none" stroke="#0f1014" stroke-width="10"/>
    <rect x="900" y="560" width="120" height="120" rx="40" fill="#6a5850"/>
    <ellipse cx="960" cy="385" rx="150" ry="185" fill="url(#sHead)"/>
    <path d="M800 360 C 780 200, 880 150, 960 150 C 1060 150, 1150 210, 1120 360 C 1100 280, 1040 250, 960 255 C 880 255, 820 290, 800 360 Z" fill="#17181b"/>
    <path d="M-40 1010 L 700 760" stroke="#1e2a40" stroke-width="30" stroke-linecap="round"/>
    <path d="M-40 940 L 640 790" stroke="#253552" stroke-width="12" stroke-linecap="round"/>
    <circle cx="700" cy="760" r="26" fill="#2e3e5e"/>
    <g transform="rotate(-14 830 880)">
      <rect x="755" y="740" width="150" height="250" rx="70" fill="#111"/>
      <g stroke="#2a2a2a" stroke-width="4"><path d="M770 800 h120 M770 830 h120 M770 860 h120 M770 890 h120 M770 920 h120"/></g>
      <ellipse cx="830" cy="900" rx="110" ry="36" fill="none" stroke="#1a1a1a" stroke-width="14"/>
    </g>
  </svg>`;

  /* ---------- text helpers ---------- */
  const UNDER = '<svg viewBox="0 0 100 20" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M2 14 C 25 6, 60 4, 98 10"/></svg>';
  const inline = (s) => esc(s).replace(/\[(.+?)\]/g, '<span class="mark">$1</span>').replace(/\*(.+?)\*/g, (_, w) => `<span class="hand">${w}${UNDER}</span>`);
  const rich = (s) => String(s ?? "").split("\n").map((ln) => `<span class="ln"><span class="li">${inline(ln)}</span></span>`).join("");
  const lines = (ws) => ws.map((w) => `<div class="l" style="width:${w}%"></div>`).join("");
  const MAG = '<svg class="mag" viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="7" fill="none" stroke="#6b6b6b" stroke-width="2.4"/><path d="M15.5 15.5 22 22" stroke="#6b6b6b" stroke-width="2.4" stroke-linecap="round"/></svg>';
  const TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path pathLength="1" d="M6 12.5l4 4 8-9"/></svg>';
  const ARR = '<svg class="arr" viewBox="0 0 44 22" aria-hidden="true"><path pathLength="1" d="M3 11 H39 M30 3 L40 11 L30 19"/></svg>';
  const NOTE_ARROWS = {
    up: { vb: "0 0 90 80", d: "M84 70 C 50 68, 24 52, 20 10 M20 10 L 8 26 M20 10 L 34 22" },
    down: { vb: "0 0 70 110", d: "M22 6 C 18 40, 28 70, 40 100 M40 100 L 22 90 M40 100 L 46 80" },
    upr: { vb: "0 0 90 80", d: "M6 70 C 40 68, 66 52, 70 10 M70 10 L 82 26 M70 10 L 56 22" },
    left: { vb: "0 0 130 70", d: "M124 44 C 92 58, 50 52, 12 20 M12 20 L 34 20 M12 20 L 18 42" },
  };

  const DEMO = {
    serp: (l) =>
      `<div class="d-serp"><div class="d-q ${l.hl === "query" ? "hl" : ""}">${MAG}${esc(l.query)}</div>
       <div class="d-tabs"><b>All</b><span>Images</span><span>Videos</span><span>News</span></div>
       ${l.rows.map((r, i) => `<div class="d-row ${r.me ? "me hl" : ""}">${r.me ? `<span class="pos">#${i + 1}</span>` : ""}<div class="u">${esc(r.url)}</div><div class="t">${esc(r.t)}</div>${lines([88, 64])}</div>`).join("")}</div>`,
    page: (l) =>
      `<div class="d-page"><div class="nav"><b>${esc((l.url || "yoursite.com").split("/")[0])}</b><span>Blog</span><span>Pricing</span><span>About</span></div>
       <div class="art"><h1 class="${l.hl === "title" ? "hl" : ""}">${esc(l.title || "Page title")}</h1>
       <p>${lines([96, 90])}</p><p class="row">Start with <a class="${l.hl === "links" ? "hl" : ""}">this guide</a> and then read <a class="${l.hl === "links" ? "hl" : ""}">the next step</a>.</p>
       <p>${lines([94, 86, 70])}</p><p class="row">Related: <a class="${l.hl === "links" ? "hl" : ""}">another post on your site</a></p><p>${lines([92, 60])}</p></div></div>`,
    console: (l) =>
      `<div class="d-con"><aside><b>Search Console</b><span>Overview</span><span>Performance</span><span>URL inspection</span><span class="on">Sitemaps</span><span>Pages</span></aside>
       <main><h2>Sitemaps</h2><div class="box"><div class="lbl">Add a new sitemap</div><div class="inrow"><div class="in"><i>https://${esc(l.site)}/</i>${esc(l.sitemap)}</div><div class="btn hl">Submit</div></div></div>
       <div class="box"><div class="lbl">Submitted sitemaps</div><div class="tr th"><span>Sitemap</span><span>Status</span><span>Pages found</span></div><div class="tr ok"><span>/${esc(l.sitemap)}</span><span class="good">Success</span><span class="cnt" data-n="24">24</span></div></div></main></div>`,
  };

  const R = {
    kicker: (l) => `<div class="kicker">${l.num != null ? `<span class="num">${esc(l.num)}</span>` : ""}<span class="kt">${esc(l.text)}</span></div>`,
    headline: (l) => `<div class="plate ${l.size === "sm" ? "sm" : ""}"><div class="headline">${rich(l.text)}</div></div>`,
    card: (l) =>
      `<div class="card ${l.ink ? "ink" : ""} ${l.items ? "has-list" : ""}">${l.title ? `<div class="ttl">${l.num != null ? `<span class="cnum">${esc(l.num)}</span>` : ""}<h3>${rich(l.title)}</h3></div>` : ""}${l.body ? `<p>${inline(l.body)}</p>` : ""}${l.items ? R.list(l) : ""}</div>`,
    list: (l) =>
      `<ul class="list">${l.items
        .map((it, i) => {
          const o = typeof it === "string" ? { t: it } : it;
          return `<li><span class="n ${o.ok ? "ok" : ""}">${o.ok ? TICK : i + 1}</span><span class="t">${esc(o.t)}${o.s ? `<small>${esc(o.s)}</small>` : ""}</span></li>`;
        })
        .join("")}</ul>`,
    lowerthird: (l) => `<div class="lt"><div class="bar"></div><div class="txt"><div class="name">${rich(l.name)}</div><div class="role">${esc(l.role)}</div></div></div>`,
    search: (l) => `<div class="search">${MAG}<span class="q">${esc(l.query)}</span><span class="caret"></span></div>`,
    flow: (l) =>
      `<div class="flow">${l.steps
        .map((s, i) => {
          const o = typeof s === "string" ? { t: s } : s;
          return `${i ? ARR : ""}<div class="node ${o.hi ? "hi" : ""}">${esc(o.t)}${o.s ? `<small>${esc(o.s)}</small>` : ""}</div>`;
        })
        .join("")}</div>`,
    chips: (l) => `<div class="chips">${l.items.map((c) => `<span class="${c.startsWith("!") ? "hi" : ""}">${esc(c.replace(/^!/, ""))}</span>`).join("")}</div>`,
    note: (l) => {
      const dir = l.arrow || (l.down ? "down" : l.flip ? "left" : "up");
      const a = NOTE_ARROWS[dir] || NOTE_ARROWS.up;
      const svg = `<svg viewBox="${a.vb}" aria-hidden="true"><path class="k" pathLength="1" d="${a.d}"/><path class="r" pathLength="1" d="${a.d}"/></svg>`;
      const after = dir === "down" || dir === "upr";
      return `<div class="note ${dir}">${after ? "" : svg}<span class="txt">${esc(l.text)}</span>${after ? svg : ""}</div>`;
    },
    full: (l) =>
      `<div class="full"><div class="bg"></div><div class="ruler"><i></i></div><div class="headline">${rich(l.text)}</div>${l.sub ? `<div class="sub">${esc(l.sub)}</div>` : ""}</div>`,
    endtiles: (l) => (l.tiles || [{ t: "Next video" }, { t: "Subscribe" }]).slice(0, 2).map((o, i) => `<div class="endtile" style="left:${i ? 1250 : 150}px">${esc(o.t)}${o.s ? `<small>${esc(o.s)}</small>` : ""}</div>`).join(""),
    demo: (l) => (DEMO[l.kind] ? DEMO[l.kind](l) : ""),
  };

  /* ---------- choreography ----------
     One timeline per frame. Arrivals: expo/power3 ease-out, 0.35-0.62s each, no overshoot. */
  const EX = "expo.out", P3 = "power3.out";
  const draw = (tl, paths, at, dur = 0.5, stagger = 0) => paths.length && tl.fromTo(paths, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: dur, ease: "power2.out", stagger }, at);

  function textIn(c, tl, at, l) {
    const li = $$(".li", c);
    if (li.length) tl.from(li, { yPercent: 112, duration: 0.62, ease: EX, stagger: 0.08 }, at);
    const end = at + 0.08 * Math.max(0, li.length - 1);
    $$(".mark", c).forEach((m, i) => {
      tl.fromTo(m, { clipPath: "inset(0% 100% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 0.5, ease: P3 }, end + 0.25 + i * 0.12);
      const target = m.textContent.match(/^#(\d+)$/);
      if (l && l.count && target) {
        const o = { n: l.count };
        m.textContent = "#" + l.count;
        tl.to(o, { n: +target[1], duration: 0.9, ease: "power2.out", onUpdate: () => (m.textContent = "#" + Math.round(o.n)) }, end + 0.3);
      }
    });
    draw(tl, $$(".hand path", c), end + 0.38, 0.55);
  }
  function listIn(c, tl, at) {
    const rows = $$(".list li", c);
    if (!rows.length) return;
    tl.from(rows, { opacity: 0, y: 18, duration: 0.45, ease: P3, stagger: 0.07 }, at);
    rows.forEach((r, i) => {
      const ok = $(".n.ok", r);
      if (!ok) return;
      tl.from(ok, { scale: 0.55, opacity: 0, duration: 0.35, ease: P3 }, at + 0.12 + i * 0.07);
      draw(tl, $$("path", ok), at + 0.2 + i * 0.07, 0.3);
    });
  }
  const slideIn = (c, tl, at, dir, extra = {}) => tl.from(c, { opacity: 0, x: dir * 64, duration: 0.6, ease: EX, ...extra }, at);

  const ENTER = {
    headline(c, l, tl, at, dir) { slideIn(c, tl, at, dir); textIn(c, tl, at + 0.1, l); },
    card(c, l, tl, at, dir) {
      slideIn(c, tl, at, dir);
      const cn = $(".cnum", c);
      if (cn) tl.from(cn, { scale: 0.5, opacity: 0, duration: 0.4, ease: P3 }, at + 0.1);
      textIn(c, tl, at + 0.14, l);
      const p = $(".card > p", c);
      if (p) tl.from(p, { opacity: 0, y: 16, duration: 0.5, ease: P3 }, at + 0.3);
      listIn(c, tl, at + 0.22);
    },
    lowerthird(c, l, tl, at, dir) {
      slideIn(c, tl, at, dir);
      tl.from($(".bar", c), { scaleY: 0, duration: 0.5, ease: EX }, at + 0.08);
      textIn(c, tl, at + 0.14, l);
      tl.from($(".role", c), { opacity: 0, y: 14, duration: 0.45, ease: P3 }, at + 0.28);
    },
    search(c, l, tl, at) {
      tl.from(c, { opacity: 0, y: 28, duration: 0.55, ease: EX }, at);
      const qEl = $(".q", c), text = l.query, o = { n: 0 };
      qEl.textContent = "";
      tl.to(o, { n: text.length, duration: text.length * 0.05, ease: "none", onUpdate: () => (qEl.textContent = text.slice(0, Math.round(o.n))) }, at + 0.35);
    },
    flow(c, l, tl, at, dir, g) {
      const gap = l.gap || 0.22;
      const vertical = g.shot === "cut";
      tl.from(c, { opacity: 0, [vertical ? "y" : "x"]: vertical ? 30 : dir * 48, duration: 0.55, ease: EX }, at);
      $$(".node", c).forEach((n, i) => tl.from(n, { opacity: 0, y: 18, duration: 0.45, ease: P3 }, at + 0.08 + i * gap));
      $$(".arr path", c).forEach((p, i) => draw(tl, [p], at + 0.08 + (i + 1) * gap - 0.14, 0.32));
    },
    chips(c, l, tl, at) {
      tl.from($$("span", c), { opacity: 0, y: 18, scale: 0.96, duration: 0.45, ease: P3, stagger: 0.07 }, at);
    },
    note(c, l, tl, at) {
      tl.from($(".txt", c), { opacity: 0, y: 12, rotation: -7, duration: 0.45, ease: P3 }, at);
      draw(tl, $$("path", c), at + 0.12, 0.5);
    },
    kicker(c, l, tl, at) {
      tl.from(c, { opacity: 0, y: 22, duration: 0.5, ease: EX }, at);
      const n = $(".num", c);
      if (n) tl.from(n, { scale: 0.5, opacity: 0, duration: 0.4, ease: P3 }, at + 0.1);
    },
    full(c, l, tl, at) {
      tl.from(c, { opacity: 0, duration: 0.3, ease: "power1.out" }, at);
      tl.from($(".bg", c), { opacity: 0, scale: 1.04, duration: 0.9, ease: "power2.out" }, at);
      tl.fromTo($(".ruler i", c), { xPercent: -100 }, { xPercent: 0, duration: 9, ease: "none" }, at);
      textIn($(".headline", c), tl, at + 0.2, l);
      const sub = $(".sub", c);
      if (sub) tl.from(sub, { opacity: 0, y: 16, duration: 0.5, ease: P3 }, at + 0.45);
    },
    endtiles(c, l, tl, at) {
      tl.from($$(".endtile", c), { opacity: 0, y: 24, scale: 0.98, duration: 0.55, ease: EX, stagger: 0.12 }, at);
    },
    demo(c, l, tl, at) {
      const rows = $$(".d-row, .d-page .art > *, .d-con .box", c);
      if (rows.length) tl.from(rows, { opacity: 0, y: 16, duration: 0.45, ease: P3, stagger: 0.07 }, at + 0.05);
      const rings = $$(".hl", c);
      if (rings.length)
        tl.fromTo(rings, { boxShadow: "0 0 0 6px rgba(255,255,255,0), 0 0 0 6px rgba(230,33,23,0)" }, { boxShadow: "0 0 0 6px rgba(255,255,255,1), 0 0 0 10px rgba(230,33,23,1)", duration: 0.4, ease: P3, stagger: 0.08 }, at + 0.7);
      const pos = $(".pos", c);
      if (pos) tl.from(pos, { opacity: 0, scale: 0.6, duration: 0.35, ease: P3 }, at + 0.8);
      const ok = $(".tr.ok", c);
      if (ok) {
        tl.from(ok, { opacity: 0, y: 10, duration: 0.45, ease: P3 }, at + 1.6);
        const cnt = $(".cnt", ok), o = { n: 0 }, N = +cnt.dataset.n;
        tl.to(o, { n: N, duration: 0.8, ease: "power2.out", onUpdate: () => (cnt.textContent = Math.round(o.n)) }, at + 1.7);
      }
    },
  };

  /* ---------- stage setup ---------- */
  const stage = $(".stage");
  const camwrap = $(".camwrap");
  const drift = $(".drift");
  drift.insertAdjacentHTML("afterbegin", SCENE + '<div class="refimg"></div>');
  $(".ss-cam .mini").insertAdjacentHTML("afterbegin", SCENE);
  if (REFS) {
    document.body.classList.add("refs");
    stage.style.setProperty("--ref1", `url("${REFS}avatar-1.png")`);
    stage.style.setProperty("--ref2", `url("${REFS}avatar-2.png")`);
    stage.style.setProperty("--ref3", `url("${REFS}avatar-3.png")`);
  } else if (PHOTO) {
    document.body.classList.add("refs", "photo");
    [1, 2, 3].forEach((n) => stage.style.setProperty("--ref" + n, `url("${PHOTO}")`));
  }
  const capEl = $(".caption");
  let idx = 0, current = null, prevCam = null, capTimers = [], tl = null, ambient = [], pending = null, curDir = 1;

  function fit() {
    stage.style.transform = `scale(${$(".viewport").clientWidth / 1920})`;
  }
  window.addEventListener("resize", fit);

  const SLOT_ORDER = { "side-top": 0, side: 1, "side-low": 2 };
  function build(f, g) {
    const box = document.createElement("div");
    box.className = "layers";
    let grp = null;
    if (g.shot === "head") {
      const st = document.createElement("div");
      st.className = "stack";
      st.innerHTML = '<div class="grp"></div>';
      box.appendChild(st);
      grp = st.firstChild;
    }
    const ls = (f.layers || []).map((l, i) => ({ l, i }));
    ls.sort((a, b) => (SLOT_ORDER[a.l.slot || "side"] ?? 9) - (SLOT_ORDER[b.l.slot || "side"] ?? 9) || a.i - b.i);
    ls.forEach(({ l }) => {
      const slot = l.slot || "side";
      const inStack = grp && slot in SLOT_ORDER;
      const el = document.createElement("div");
      el.className = `L t-${l.type}` + (inStack ? "" : ` s-${slot}`);
      if (l.style && !inStack) el.setAttribute("style", l.style);
      el.innerHTML = `<div class="c">${R[l.type] ? R[l.type](l) : `<div class="card"><p>Unknown layer: ${esc(l.type)}</p></div>`}</div>`;
      el._l = l;
      (inStack ? grp : box).appendChild(el);
    });
    return box;
  }

  function choreograph(box, g, fromShot) {
    const t = gsap.timeline();
    const dir = g.shot === "head" ? (g.side === "right" ? -1 : 1) : 1;
    if (g.shot === "screen" && fromShot !== "screen") {
      t.from(".ss-window", { y: 40, opacity: 0, duration: 0.6, ease: EX, clearProps: "transform,opacity" }, 0);
      t.from(".ss-cam", { x: -56, opacity: 0, duration: 0.6, ease: EX, clearProps: "transform,opacity" }, 0.06);
    }
    const base = g.shot === "screen" && fromShot !== "screen" ? 0.25 : 0.08;
    $$(".L", box).forEach((L) => {
      const l = L._l;
      if (ENTER[l.type]) ENTER[l.type](L.firstChild, l, t, base + (l.delay || 0), dir, g);
    });
    // after the masks finish, let hand-written words breathe outside their line boxes
    t.call(() => $$(".ln", box).forEach((n) => (n.style.overflow = "visible")));
    return t;
  }

  // gentle parallax while the frame holds: each plate floats a few pixels, nearer plates a bit more
  function startAmbient(box, g) {
    if (g.shot !== "head") return;
    $$(".stack .L", box).forEach((L, i) => {
      const amp = 5 + i * 3;
      ambient.push(gsap.to(L, { y: amp, x: (g.side === "right" ? 1 : -1) * (2 + i), duration: 4.6 + i * 1.3, ease: "sine.inOut", yoyo: true, repeat: -1 }));
    });
  }
  function stopMotion() {
    if (tl) { tl.progress(1).kill(); tl = null; }
    ambient.forEach((a) => a.kill());
    ambient = [];
  }

  /* captions: the cue, 3 words or fewer and 18 characters or fewer at a time, on a white pill */
  function chunks(cue) {
    const words = cue.replace(/[“”"]/g, "").replace(/[.,?!:;]+(\s|$)/g, "$1").split(/\s+/).filter(Boolean);
    const out = [];
    let cur = [];
    words.forEach((w) => {
      const next = [...cur, w];
      if (cur.length && (next.length > 3 || next.join(" ").length > 18)) { out.push(cur); cur = [w]; }
      else cur = next;
    });
    if (cur.length) out.push(cur);
    return out;
  }
  /* captions sit in the lower middle of the frame (his reference style). If the pill would touch the
     face or the mic, it slides sideways only as far as it needs to; if no position fits, it shrinks. */
  function placeCaption(g) {
    const sp = capEl.firstChild;
    const top = g.capTop;
    const obs = g.shot === "head" ? [g.face, g.mic] : [];
    const M = 24;
    for (let fs = 60; fs >= 40; fs -= 4) {
      capEl.style.fontSize = fs + "px";
      const w = sp.offsetWidth, h = sp.offsetHeight;
      const hit = obs.filter((r) => r[1] < top + h + M && r[3] > top - M);
      const clear = (x) => x >= 96 && x + w <= 1824 && hit.every((r) => x + w <= r[0] - M || x >= r[2] + M);
      const cands = [960 - w / 2];
      hit.forEach((r) => cands.push(r[0] - M - w, r[2] + M));
      const ok = cands.filter(clear).sort((a, b) => Math.abs(a + w / 2 - 960) - Math.abs(b + w / 2 - 960));
      if (ok.length) {
        const x = Math.round(ok[0]);
        Object.assign(capEl.style, { left: x + "px", top: top + "px" });
        boxEl($(".g-cap"), [x, top, x + w, top + h]);
        return;
      }
    }
  }
  let capG = null;
  // Montserrat may arrive after the first caption is measured: measure again once fonts are ready
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (capG && capEl.firstChild) placeCaption(capG); });
  /* ---------- voice: one clip per frame from audio.js ---------- */
  const AU = window.STORYBOARD_AUDIO || null;
  const voice = new Audio();
  voice.preload = "auto";
  const warm = new Audio();
  warm.preload = "auto";
  let muted = false;
  try { muted = localStorage.getItem("sb-muted") === "1"; } catch (e) {}
  const clipFor = (i) => (AU && AU.clips ? AU.clips[i] : null);
  const soundOK = () => !!AU && !muted && !STILL && SEEK === null;
  function stopVoice() { voice.onended = null; voice.pause(); }
  // starts the frame's clip; true when a clip is playing (or about to)
  function playVoice(i) {
    stopVoice();
    const c = clipFor(i);
    if (!c || !soundOK()) return false;
    voice.src = (AU.base || "") + c.src;
    try { voice.currentTime = 0; } catch (e) {}
    const p = voice.play();
    if (p && p.catch) p.catch(() => { if (playing && idx === i) schedule(frames[i], false); });
    const n = clipFor((i + 1) % frames.length);
    if (n) warm.src = (AU.base || "") + n.src;
    return true;
  }

  function runCaptions(f, g, withVoice) {
    capG = g;
    capTimers.forEach(clearTimeout);
    capTimers = [];
    capEl.textContent = "";
    if (g.capTop == null) { capEl.style.display = "none"; return; }
    capEl.style.display = "";
    let t = STILL || SEEK !== null ? 0 : 150;
    const cs = chunks(f.cue);
    const clip = withVoice ? clipFor(idx) : null;
    const words = cs.reduce((a, c) => a + c.length, 0) || 1;
    // with a voice clip, each chunk shows for its share of the clip, so the caption follows the audio
    const perWord = clip ? (clip.dur * 1000 - 120) / words : 0;
    if (clip) t = 60;
    cs.forEach((c) => {
      const put = () => {
        capEl.innerHTML = `<span>${esc(c.join(" "))}</span>`;
        placeCaption(g);
        if (!(STILL || SEEK !== null)) { capEl.classList.remove("pop"); void capEl.offsetWidth; capEl.classList.add("pop"); }
      };
      if (t === 0 && !capEl.textContent) put();
      else if (!(STILL || SEEK !== null)) capTimers.push(setTimeout(put, t));
      t += clip ? perWord * c.length : (0.32 * c.length + 0.1) * 1000;
    });
  }

  const boxEl = (el, r) => { el.style.left = r[0] + "px"; el.style.top = r[1] + "px"; el.style.width = r[2] - r[0] + "px"; el.style.height = r[3] - r[1] + "px"; };

  function setCamera(g) {
    stage.classList.remove("shot-head", "shot-screen", "shot-cut", "face-left", "face-right", "face-center");
    stage.classList.add("shot-" + g.shot);
    if (g.shot !== "head") { prevCam = g; return; }
    stage.classList.add("face-" + g.side);
    const sameTake = prevCam && prevCam.shot === "head" && prevCam.c.ref === g.c.ref;
    camwrap.style.transition = sameTake && !RM.matches ? "transform .6s var(--inout)" : "none";
    camwrap.style.transform = `translate(${g.tx}px,${g.ty}px) scale(${g.s})`;
    camwrap.dataset.ref = g.c.ref;
    // slow 2% push toward the face so the frame never sits dead still
    const look = lookFor(g.c.ref);
    drift.style.transformOrigin = `${look.fx}px ${look.fy}px`;
    drift.classList.remove("on"); void drift.offsetWidth; drift.classList.add("on");
    ["pl", "pw", "pt", "ph"].forEach((k) => stage.style.setProperty("--" + k, g[k] + "px"));
    boxEl($(".g-face"), g.face);
    boxEl($(".g-mic"), g.mic);
    boxEl($(".g-panel"), [g.pl, g.pt, g.pl + g.pw, g.pt + g.ph]);
    prevCam = g;
  }

  // framing as short stacked lines (no separators): shot, face and zoom, graphics side and look
  function framingLines(f) {
    const c = f.cam || {};
    if (c.shot === "screen") return ["Screen share", "Camera box left, app right"];
    if (c.shot === "cut") return ["Cutaway", "Full white screen"];
    const z = Math.round((c.zoom || 1) * 100);
    if (c.face === "center") return ["Talking head", `Face centred, zoom ${z}%`, `Look ${c.ref}`];
    return ["Talking head", `Face ${c.face}, zoom ${z}%`, `Graphics ${c.face === "right" ? "left" : "right"}, look ${c.ref}`];
  }
  const framingHTML = (f) => framingLines(f).map((t) => `<span class="fl">${esc(t)}</span>`).join("");

  function enter(i, replay) {
    const f = frames[i];
    const g = camFor(f);
    const fromShot = replay ? null : prevCam && prevCam.shot;
    if (replay) prevCam = null;
    setCamera(g);
    const urlLayer = (f.layers || []).find((l) => l.type === "demo");
    if (urlLayer) $(".ss-url").textContent = urlLayer.kind === "serp" ? "search?q=" + urlLayer.query : urlLayer.kind === "console" ? "search.google.com/search-console" : urlLayer.url || "yoursite.com";
    const b = build(f, g);
    stage.insertBefore(b, capEl);
    current = b;
    curDir = g.shot === "head" ? (g.side === "right" ? -1 : 1) : 1;
    if (motion()) {
      tl = choreograph(b, g, fromShot);
      if (SEEK !== null) tl.pause().seek(SEEK);
      else startAmbient(b, g);
    }
    const withVoice = playVoice(i);
    runCaptions(f, g, withVoice);
    if (playing) schedule(f, withVoice);
  }

  /* ---------- autoplay: loops all frames for a bird's-eye view ----------
     Each frame plays its entrance, then holds long enough to read the spoken line
     (about 0.32s a word, at least 3.5s and at most 8s), then moves on. Any manual step pauses it. */
  let playing = false, playTimer = null;
  function holdFor(f) {
    const words = (f.cue || "").trim().split(/\s+/).length;
    const read = Math.min(8, Math.max(3.5, 1.2 + words * 0.32));
    const anim = tl ? Math.min(tl.duration(), 6) + 1.2 : 0;
    return Math.max(read, anim);
  }
  const advance = () => { if (playing) show((idx + 1) % frames.length); };
  function schedule(f, withVoice) {
    clearTimeout(playTimer);
    if (withVoice) {
      // move on a beat after the voice ends (and never before the frame's entrance has played)
      const minHold = tl ? Math.min(tl.duration(), 3) : 0;
      const start = Date.now();
      voice.onended = () => {
        const wait = Math.max(700, minHold * 1000 - (Date.now() - start));
        clearTimeout(playTimer);
        playTimer = setTimeout(advance, wait);
      };
      return;
    }
    playTimer = setTimeout(advance, holdFor(f) * 1000);
  }
  function setPlaying(on) {
    playing = on;
    clearTimeout(playTimer);
    if (!on) stopVoice();
    document.body.classList.toggle("playing", on);
    const b = $("#b-play");
    if (b) { b.classList.toggle("on", on); b.setAttribute("aria-pressed", on ? "true" : "false"); $(".lbl", b).textContent = on ? "Pause" : "Play"; }
    if (on) show(idx, true);
  }
  const togglePlay = () => setPlaying(!playing);
  function setMuted(on) {
    muted = on;
    try { localStorage.setItem("sb-muted", on ? "1" : "0"); } catch (e) {}
    const b = $("#b-sound");
    if (b) { b.classList.toggle("muted", on); b.setAttribute("aria-pressed", on ? "false" : "true"); $(".lbl", b).textContent = on ? "Sound off" : "Sound on"; }
    if (on) { stopVoice(); if (playing) schedule(frames[idx], false); }
  }
  // manual navigation: stop autoplay first, then step
  const go = (i, replay) => { if (playing) setPlaying(false); show(i, replay); };

  function show(i, replay) {
    idx = clamp(i, 0, frames.length - 1);
    const f = frames[idx];
    if (pending) { pending.kill(); pending = null; }
    stopVoice();
    stopMotion();
    const old = current;
    current = null;
    if (old && motion() && !replay) {
      // exit: plates slide back toward the side they came from, quickly, ease-in
      const cs = $$(".L > .c", old).reverse();
      capTimers.forEach(clearTimeout);
      gsap.to(capEl, { opacity: 0, duration: 0.15, onComplete: () => { capEl.textContent = ""; gsap.set(capEl, { opacity: 1 }); } });
      gsap.to(cs, { opacity: 0, x: curDir * 40, duration: 0.24, ease: "power2.in", stagger: 0.03 });
      const target = idx;
      pending = gsap.delayedCall(0.24 + 0.03 * Math.max(0, cs.length - 1), () => { pending = null; old.remove(); enter(target, false); });
    } else {
      if (old) old.remove();
      if (window.gsap) gsap.set(capEl, { opacity: 1 });
      enter(idx, replay);
    }

    $("#n-num").textContent = `Frame ${idx + 1}`;
    $("#n-sec").textContent = f.section || "";
    $("#n-time").textContent = f.time || "";
    $("#n-shot").innerHTML = framingHTML(f);
    $("#n-cue").textContent = f.cue;
    $("#n-screen").textContent = f.onscreen || "";
    $("#n-motion").textContent = f.motion || "";
    $("#n-deliver").textContent = f.deliver || "";
    $(".count").textContent = `${idx + 1} / ${frames.length}`;
    $(".progress i").style.width = ((idx + 1) / frames.length) * 100 + "%";
    if (!replay) history.replaceState(null, "", location.search + "#f" + (idx + 1));
    syncTable(replay);
  }

  // script table on the right: one row per frame, the current one highlighted and kept in view
  const ovScroll = $(".ov-scroll");
  $(".overview tbody").innerHTML = frames
    .map((f, i) => `<tr data-i="${i}"><td class="n">${i + 1}<small>${esc(f.time || "")}</small></td><td class="cue">“${esc(f.cue)}”</td><td class="fr">${framingHTML(f)}</td><td class="an">${esc(f.onscreen || "")}</td></tr>`)
    .join("");
  function syncTable(instant) {
    let row = null;
    $$(".overview tr[data-i]").forEach((tr) => {
      const on = +tr.dataset.i === idx;
      tr.classList.toggle("cur", on);
      if (on) row = tr;
    });
    if (!row || !ovScroll) return;
    const top = row.offsetTop - ovScroll.clientHeight / 2 + row.offsetHeight / 2;
    ovScroll.scrollTo({ top: Math.max(0, top), behavior: instant || RM.matches ? "auto" : "smooth" });
  }
  $(".overview tbody").addEventListener("click", (e) => {
    const tr = e.target.closest("tr[data-i]");
    if (tr) go(+tr.dataset.i);
  });

  const toggle = (cls, btn) => { document.body.classList.toggle(cls); if (btn) $(btn).classList.toggle("on"); fit(); };
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (k === " " || k === "p" || k === "P") { e.preventDefault(); togglePlay(); }
    else if (k === "ArrowRight" || k === "ArrowDown" || k === "PageDown") { e.preventDefault(); go(idx + 1); }
    else if (k === "ArrowLeft" || k === "ArrowUp" || k === "PageUp") { e.preventDefault(); go(idx - 1); }
    else if (k === "r" || k === "R") { e.preventDefault(); go(idx, true); }
    else if (k === "Home") { e.preventDefault(); go(0); }
    else if (k === "End") { e.preventDefault(); go(frames.length - 1); }
    else if ((k === "m" || k === "M") && AU) setMuted(!muted);
    else if (k === "c" || k === "C") toggle("nocap", "#b-cap");
    else if (k === "n" || k === "N") toggle("clean", "#b-notes");
    else if (k === "t" || k === "T") toggle("table-off", "#b-table");
    else if (k === "g" || k === "G") toggle("guides", "#b-guides");
    else if (k === "f" || k === "F") { const vp = $(".viewport"); document.fullscreenElement ? document.exitFullscreen() : vp.requestFullscreen && vp.requestFullscreen(); }
  });
  document.addEventListener("fullscreenchange", () => setTimeout(fit, 50));
  $("#b-play").onclick = togglePlay;
  if (AU) { $("#b-sound").onclick = () => setMuted(!muted); setMuted(muted); } else if ($("#b-sound")) $("#b-sound").hidden = true;
  $("#b-prev").onclick = () => go(idx - 1);
  $("#b-next").onclick = () => go(idx + 1);
  $("#b-replay").onclick = () => go(idx, true);
  $("#b-table").onclick = () => toggle("table-off", "#b-table");
  $("#b-guides").onclick = () => toggle("guides", "#b-guides");
  $("#b-cap").onclick = () => toggle("nocap", "#b-cap");
  $("#b-notes").onclick = () => toggle("clean", "#b-notes");
  $(".viewport").addEventListener("click", (e) => { const r = e.currentTarget.getBoundingClientRect(); go(e.clientX - r.left < r.width / 3 ? idx - 1 : idx + 1); });

  if (q.get("bg") === "green") document.body.classList.add("green", "clean");
  if (q.has("clean")) document.body.classList.add("clean");
  if (q.has("guides")) document.body.classList.add("guides");
  if (q.has("solo")) document.body.classList.add("solo", "clean");
  fit();
  const m = location.hash.match(/^#f(\d+)$/);
  show(m ? +m[1] - 1 : 0);
  window.addEventListener("hashchange", () => { const h = location.hash.match(/^#f(\d+)$/); if (h && +h[1] - 1 !== idx) go(+h[1] - 1); });
  if (q.has("play")) setPlaying(true);
  window.__storyboard = { show, play: setPlaying, get playing() { return playing; }, get index() { return idx; }, count: frames.length, camFor: (i) => camFor(frames[i]), settle: () => tl && tl.progress(1) };
})();
