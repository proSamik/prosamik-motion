/* ProSamik motion storyboard engine, v3.
   Reads window.STORYBOARD (frames.js) and steps frame by frame.
   v3 follows the real camera: talking-head frames zoom into the left or right part of the
   camera frame (face off-centre, animation on the free side), screen-share frames switch to the
   browser-plus-camera-box layout, cutaways are full-screen white. Captions are burned in
   2-3 words at a time. Nothing is ever placed above the head.
   Keys: Right/Down/Space next, Left/Up back, R replay, C captions, N notes, T table, G guides, F fullscreen.
   ?refs=../refs/ swaps in the local reference stills; the public page shows the illustrated stand-in.
   The same frame data can later drive a Remotion composition (one <Sequence> per frame). */
(function () {
  const SB = window.STORYBOARD;
  const frames = SB.frames;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  if (SB.accent) {
    document.documentElement.style.setProperty("--c1", SB.accent[0]);
    document.documentElement.style.setProperty("--c2", SB.accent[1]);
  }
  document.title = SB.title + " · storyboard";
  $(".title").textContent = SB.title;

  const q = new URLSearchParams(location.search);
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
  /* the public page uses one approved still of Samik (photo.jpg, taken from look 2) for every look */
  const PHOTO = null; // set to "photo.jpg" once his still is cleared for the public page
  const lookFor = (ref) => (REFS ? LOOKS[ref] || LOOKS[1] : PHOTO ? LOOKS[2] : STAND);
  const TARGET_X = { right: 1330, left: 590, center: 960 };

  function camFor(f) {
    const c = f.cam || { shot: "head", ref: 1, zoom: 1, face: "center" };
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
    return { shot: "head", c, look, s, tx, ty, side, face: [fl, ft, fr, fb], mic: [ml, mt, mr, Math.min(1080, mb)], pl, pw: pr - pl, fx: tx + s * look.fx, fy: ty + s * look.fy, colR: fr + 50 };
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
  const UNDER = '<svg viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M2 14 C 25 6, 60 4, 98 10"/></svg>';
  const rich = (s, light) =>
    esc(s).replace(/\[(.+?)\]/g, '<span class="mark">$1</span>').replace(/\*(.+?)\*/g, (_, w) => `<span class="hand${light ? " light" : ""}">${w}${UNDER}</span>`).replace(/\n/g, "<br>");

  const lines = (ws) => ws.map((w) => `<div class="l" style="width:${w}%"></div>`).join("");
  const DEMO = {
    serp: (l) =>
      `<div class="d-serp"><div class="d-q ${l.hl === "query" ? "hl" : ""}"><svg viewBox="0 0 24 24"><circle cx="10" cy="10" r="7" fill="none" stroke="#6b6b6b" stroke-width="2.4"/><path d="M15.5 15.5 22 22" stroke="#6b6b6b" stroke-width="2.4" stroke-linecap="round"/></svg>${esc(l.query)}</div>
       <div class="d-tabs"><b>All</b><span>Images</span><span>Videos</span><span>News</span></div>
       ${l.rows.map((r, i) => `<div class="d-row ${r.me ? "me" : ""}" style="--i:${i}"><div class="u">${esc(r.url)}</div><div class="t">${esc(r.t)}</div>${lines([88, 64])}</div>`).join("")}</div>`,
    page: (l) =>
      `<div class="d-page"><div class="nav"><b>${esc((l.url || "yoursite.com").split("/")[0])}</b><span>Blog</span><span>Pricing</span><span>About</span></div>
       <div class="art"><h1 class="${l.hl === "title" ? "hl" : ""}">${esc(l.title || "Page title")}</h1>
       <p>${lines([96, 90])}</p><p class="row">Start with <a class="${l.hl === "links" ? "hl" : ""}">this guide</a> and then read <a class="${l.hl === "links" ? "hl" : ""}">the next step</a>.</p>
       <p>${lines([94, 86, 70])}</p><p class="row">Related: <a class="${l.hl === "links" ? "hl" : ""}">another post on your site</a></p><p>${lines([92, 60])}</p></div></div>`,
    console: (l) =>
      `<div class="d-con"><aside><b>Search Console</b><span>Overview</span><span>Performance</span><span>URL inspection</span><span class="on">Sitemaps</span><span>Pages</span></aside>
       <main><h2>Sitemaps</h2><div class="box"><div class="lbl">Add a new sitemap</div><div class="inrow"><div class="in"><i>https://${esc(l.site)}/</i>${esc(l.sitemap)}</div><div class="btn hl">Submit</div></div></div>
       <div class="box"><div class="lbl">Submitted sitemaps</div><div class="tr th"><span>Sitemap</span><span>Status</span><span>Pages found</span></div><div class="tr ok"><span>/${esc(l.sitemap)}</span><span class="good">Success</span><span>24</span></div></div></main></div>`,
  };

  const R = {
    kicker: (l) => `<div class="kicker"><i></i>${esc(l.text)}</div>`,
    headline: (l) => `<div class="headline ${l.size || ""} ${l.dark ? "dark" : ""}">${rich(l.text)}</div>`,
    card: (l) =>
      `<div class="card ${l.ink ? "ink" : ""}">${l.eyebrow ? `<div class="eyebrow">${esc(l.eyebrow)}</div>` : ""}${
        l.title ? `<h3>${rich(l.title)}</h3>` : ""
      }${l.body ? `<p>${rich(l.body)}</p>` : ""}${l.items ? R.list(l) : ""}</div>`,
    list: (l) =>
      `<ul class="list">${l.items
        .map((it, i) => {
          const o = typeof it === "string" ? { t: it } : it;
          return `<li style="--i:${i}"><span class="n ${o.ok ? "ok" : ""}">${o.ok ? "✓" : i + 1}</span><span>${esc(o.t)}${o.s ? `<small>${esc(o.s)}</small>` : ""}</span></li>`;
        })
        .join("")}</ul>`,
    lowerthird: (l) => `<div class="lt"><div class="bar"></div><div class="txt"><div class="name">${esc(l.name)}</div><div class="role">${esc(l.role)}</div></div></div>`,
    search: (l) =>
      `<div class="search" style="--chars:${l.query.length}"><svg class="mag" viewBox="0 0 24 24"><circle cx="10" cy="10" r="7" fill="none" stroke="#6b6b6b" stroke-width="2.4"/><path d="M15.5 15.5 22 22" stroke="#6b6b6b" stroke-width="2.4" stroke-linecap="round"/></svg><div class="q">${esc(l.query)}</div></div>`,
    flow: (l) =>
      `<div class="flow">${l.steps
        .map((s, i) => {
          const o = typeof s === "string" ? { t: s } : s;
          return `${i ? `<span class="arr" style="--i:${i}"></span>` : ""}<div class="node ${o.hi ? "hi" : ""}" style="--i:${i}">${esc(o.t)}${o.s ? `<small>${esc(o.s)}</small>` : ""}</div>`;
        })
        .join("")}</div>`,
    chips: (l) => `<div class="chips">${l.items.map((c, i) => `<span class="${c.startsWith("!") ? "hi" : ""}" style="--i:${i}">${esc(c.replace(/^!/, ""))}</span>`).join("")}</div>`,
    note: (l) =>
      `<div class="note">${esc(l.text)}<svg viewBox="0 0 180 90" style="${l.down ? "transform:rotate(60deg) translate(10px,-30px)" : l.flip ? "transform:scaleX(-1)" : ""}"><path d="M10 10 C 60 20, 120 30, 160 75 M160 75 l-26 -4 M160 75 l-2 -26"/></svg></div>`,
    full: (l) => `<div class="full">${l.kicker ? `<div class="kicker flat"><i></i>${esc(l.kicker)}</div>` : ""}<div class="headline">${rich(l.text)}</div>${l.sub ? `<div class="sub">${esc(l.sub)}</div>` : ""}</div>`,
    endtiles: () => `<div class="endtile" style="left:150px">Next video</div><div class="endtile" style="left:1250px">Subscribe</div>`,
    demo: (l) => (DEMO[l.kind] ? DEMO[l.kind](l) : ""),
  };
  const DEFAULT_ANIM = { kicker: "a-up", lowerthird: "a-wipe", search: "a-up", full: "a-fade", note: "a-fade", flow: "a-fade", chips: "a-fade", endtiles: "a-fade", demo: "a-cut" };

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
    $(".tag").textContent = "Your reference stills · local only";
  } else if (PHOTO) {
    document.body.classList.add("refs", "photo");
    [1, 2, 3].forEach((n) => stage.style.setProperty("--ref" + n, `url("${PHOTO}")`));
  }
  const capEl = $(".caption");
  let idx = 0, current = null, prevCam = null, capTimers = [];

  function fit() {
    stage.style.transform = `scale(${$(".viewport").clientWidth / 1920})`;
  }
  window.addEventListener("resize", fit);

  function build(f) {
    const box = document.createElement("div");
    box.className = "layers";
    (f.layers || []).forEach((l) => {
      const el = document.createElement("div");
      el.className = `L t-${l.type} ${l.anim || DEFAULT_ANIM[l.type] || "a-in"} s-${l.slot || "side"}`;
      el.style.setProperty("--d", (l.delay || 0) + "s");
      if (l.style) el.setAttribute("style", el.getAttribute("style") + ";" + l.style);
      el.innerHTML = R[l.type] ? R[l.type](l) : `<div class="card"><p>Unknown layer: ${esc(l.type)}</p></div>`;
      box.appendChild(el);
    });
    return box;
  }

  /* captions: the cue, 3 words or fewer and 18 characters or fewer at a time */
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
  function runCaptions(f, g) {
    capTimers.forEach(clearTimeout);
    capTimers = [];
    capEl.textContent = "";
    if (g.shot === "cut") { capEl.style.display = "none"; return; }
    capEl.style.display = "";
    if (g.shot === "head") {
      const cx = clamp(g.fx, 520, 1400);
      capEl.style.left = cx - 500 + "px";
      capEl.style.top = clamp(g.face[3] + 30, 830, 930) + "px";
    } else {
      capEl.style.left = 700 + "px";
      capEl.style.top = 905 + "px";
    }
    let t = 150;
    chunks(f.cue).forEach((c) => {
      capTimers.push(setTimeout(() => { capEl.innerHTML = `<span>${esc(c.join(" "))}</span>`; capEl.classList.remove("pop"); void capEl.offsetWidth; capEl.classList.add("pop"); }, t));
      t += (0.32 * c.length + 0.1) * 1000;
    });
  }

  const box = (el, r) => { el.style.left = r[0] + "px"; el.style.top = r[1] + "px"; el.style.width = r[2] - r[0] + "px"; el.style.height = r[3] - r[1] + "px"; };

  function setCamera(g, f) {
    stage.classList.remove("shot-head", "shot-screen", "shot-cut", "face-left", "face-right", "face-center");
    stage.classList.add("shot-" + g.shot);
    if (g.shot !== "head") { prevCam = g; return; }
    stage.classList.add("face-" + g.side);
    const sameTake = prevCam && prevCam.shot === "head" && prevCam.c.ref === g.c.ref;
    camwrap.style.transition = sameTake ? "transform .6s var(--inout)" : "none";
    camwrap.style.transform = `translate(${g.tx}px,${g.ty}px) scale(${g.s})`;
    camwrap.dataset.ref = g.c.ref;
    // slow 2% push toward the face so the frame never sits dead still
    const look = lookFor(g.c.ref);
    drift.style.transformOrigin = `${look.fx}px ${look.fy}px`;
    drift.classList.remove("on"); void drift.offsetWidth; drift.classList.add("on");
    stage.style.setProperty("--pl", g.pl + "px");
    stage.style.setProperty("--pw", g.pw + "px");
    stage.style.setProperty("--cr", g.colR + "px");
    box($(".g-face"), g.face);
    box($(".g-mic"), g.mic);
    box($(".g-panel"), [g.pl, 110, g.pl + g.pw, 830]);
    prevCam = g;
  }

  function framingLabel(f) {
    const c = f.cam || {};
    if (c.shot === "screen") return "Screen share";
    if (c.shot === "cut") return "Cutaway · full screen";
    const side = c.face === "center" ? "face centred" : `face ${c.face} · graphics ${c.face === "right" ? "left" : "right"}`;
    return `Talking head · ${side} · zoom ${Math.round((c.zoom || 1) * 100)}% · look ${c.ref}`;
  }

  function show(i, replay) {
    idx = clamp(i, 0, frames.length - 1);
    const f = frames[idx];
    const g = camFor(f);
    if (replay) prevCam = null;
    if (current) {
      const old = current;
      old.classList.add("leaving");
      setTimeout(() => old.remove(), 240);
    }
    setCamera(g, f);
    const urlLayer = (f.layers || []).find((l) => l.type === "demo");
    if (urlLayer) $(".ss-url").textContent = urlLayer.kind === "serp" ? "search?q=" + urlLayer.query : urlLayer.kind === "console" ? "search.google.com/search-console" : urlLayer.url || "yoursite.com";
    const b = build(f);
    stage.insertBefore(b, capEl);
    current = b;
    requestAnimationFrame(() => requestAnimationFrame(() => b.classList.add("go")));
    runCaptions(f, g);

    $("#n-num").textContent = `Frame ${idx + 1}`;
    $("#n-sec").textContent = f.section || "";
    $("#n-time").textContent = f.time || "";
    $("#n-shot").textContent = framingLabel(f);
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
    .map(
      (f, i) =>
        `<tr data-i="${i}"><td class="n">${i + 1}<small>${esc(f.time || "")}</small></td><td class="cue">“${esc(f.cue)}”</td><td class="fr">${esc(framingLabel(f))}</td><td class="an">${esc(f.onscreen || "")}</td></tr>`
    )
    .join("");
  function syncTable(instant) {
    let row = null;
    document.querySelectorAll(".overview tr[data-i]").forEach((tr) => {
      const on = +tr.dataset.i === idx;
      tr.classList.toggle("cur", on);
      if (on) row = tr;
    });
    if (!row || !ovScroll) return;
    const top = row.offsetTop - ovScroll.clientHeight / 2 + row.offsetHeight / 2;
    ovScroll.scrollTo({ top: Math.max(0, top), behavior: instant ? "auto" : "smooth" });
  }
  $(".overview tbody").addEventListener("click", (e) => {
    const tr = e.target.closest("tr[data-i]");
    if (tr) show(+tr.dataset.i);
  });

  const toggle = (cls, btn) => { document.body.classList.toggle(cls); if (btn) $(btn).classList.toggle("on"); fit(); };
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (k === "ArrowRight" || k === "ArrowDown" || k === "PageDown" || k === " ") { e.preventDefault(); show(idx + 1); }
    else if (k === "ArrowLeft" || k === "ArrowUp" || k === "PageUp") { e.preventDefault(); show(idx - 1); }
    else if (k === "r" || k === "R") { e.preventDefault(); show(idx, true); }
    else if (k === "Home") { e.preventDefault(); show(0); }
    else if (k === "End") { e.preventDefault(); show(frames.length - 1); }
    else if (k === "c" || k === "C") toggle("nocap", "#b-cap");
    else if (k === "n" || k === "N") toggle("clean", "#b-notes");
    else if (k === "t" || k === "T") toggle("table-off", "#b-table");
    else if (k === "g" || k === "G") toggle("guides", "#b-guides");
    else if (k === "f" || k === "F") { const vp = $(".viewport"); document.fullscreenElement ? document.exitFullscreen() : vp.requestFullscreen && vp.requestFullscreen(); }
  });
  document.addEventListener("fullscreenchange", () => setTimeout(fit, 50));
  $("#b-prev").onclick = () => show(idx - 1);
  $("#b-next").onclick = () => show(idx + 1);
  $("#b-table").onclick = () => toggle("table-off", "#b-table");
  $("#b-guides").onclick = () => toggle("guides", "#b-guides");
  $("#b-cap").onclick = () => toggle("nocap", "#b-cap");
  $("#b-notes").onclick = () => toggle("clean", "#b-notes");
  $(".viewport").addEventListener("click", (e) => { const r = e.currentTarget.getBoundingClientRect(); show(e.clientX - r.left < r.width / 3 ? idx - 1 : idx + 1); });

  if (q.get("bg") === "green") document.body.classList.add("green", "clean");
  if (q.has("clean")) document.body.classList.add("clean");
  fit();
  const m = location.hash.match(/^#f(\d+)$/);
  show(m ? +m[1] - 1 : 0);
  window.addEventListener("hashchange", () => { const h = location.hash.match(/^#f(\d+)$/); if (h && +h[1] - 1 !== idx) show(+h[1] - 1); });
  window.__storyboard = { show, get index() { return idx; }, count: frames.length, camFor: (i) => camFor(frames[i]) };
})();
