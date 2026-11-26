/* ProSamik motion storyboard engine.
   Reads window.STORYBOARD (frames.js) and steps frame by frame.
   Keys: Right/Down next, Left/Up back, R or Space replay, N notes, T table, G guides, F fullscreen.
   The same frame data can later drive a Remotion composition (one <Sequence> per frame). */
(function () {
  const SB = window.STORYBOARD;
  const frames = SB.frames;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // accent
  if (SB.accent) {
    document.documentElement.style.setProperty("--c1", SB.accent[0]);
    document.documentElement.style.setProperty("--c2", SB.accent[1]);
  }
  document.title = SB.title + " · storyboard";
  $(".title").textContent = SB.title;

  // *text* -> hand-written gradient word with drawn underline
  const UNDER = '<svg viewBox="0 0 100 20" preserveAspectRatio="none"><path d="M2 14 C 25 6, 60 4, 98 10"/></svg>';
  const rich = (s, light) =>
    esc(s).replace(/\[(.+?)\]/g, '<span class="mark">$1</span>').replace(/\*(.+?)\*/g, (_, w) => `<span class="hand${light ? " light" : ""}">${w}${UNDER}</span>`).replace(/\n/g, "<br>");

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
          return `<li style="--i:${i}"><span class="n ${o.ok ? "ok" : ""}">${o.ok ? "✓" : i + 1}</span><span>${esc(o.t)}${
            o.s ? `<small>${esc(o.s)}</small>` : ""
          }</span></li>`;
        })
        .join("")}</ul>`,
    lowerthird: (l) => `<div class="lt"><div class="bar"></div><div class="txt"><div class="name">${esc(l.name)}</div><div class="role">${esc(l.role)}</div></div></div>`,
    search: (l) =>
      `<div class="search" style="--chars:${l.query.length}"><svg class="mag" viewBox="0 0 24 24"><circle cx="10" cy="10" r="7" fill="none" stroke="#6b6b6b" stroke-width="2.4"/><path d="M15.5 15.5 22 22" stroke="#6b6b6b" stroke-width="2.4" stroke-linecap="round"/></svg><div class="q">${esc(l.query)}</div></div>`,
    serp: (l) =>
      `<div class="serp">${l.rows
        .map(
          (r, i) =>
            `<div class="row ${r.me ? "me" : ""}" style="--i:${i}"><span class="rank">#${r.rank ?? i + 1}</span><div class="url">${esc(r.url)}</div><div class="t">${esc(r.t)}</div></div>`
        )
        .join("")}</div>`,
    stat: (l) =>
      `<div class="stat"><div class="num ${l.grad ? "grad" : ""}" data-count="${esc(l.value)}">${esc(l.value)}</div><div class="lbl">${rich(l.label)}</div>${
        l.source ? `<div class="src">${esc(l.source)}</div>` : ""
      }</div>`,
    flow: (l) =>
      `<div class="flow">${l.steps
        .map((s, i) => {
          const o = typeof s === "string" ? { t: s } : s;
          return `${i ? `<span class="arr" style="--i:${i}"></span>` : ""}<div class="node ${o.hi ? "hi" : ""}" style="--i:${i}">${esc(o.t)}${o.s ? `<small>${esc(o.s)}</small>` : ""}</div>`;
        })
        .join("")}</div>`,
    chips: (l) => `<div class="chips">${l.items.map((c, i) => `<span class="${c.startsWith("!") ? "hi" : ""}" style="--i:${i}">${esc(c.replace(/^!/, ""))}</span>`).join("")}</div>`,
    note: (l) =>
      `<div class="note ${l.grad ? "grad" : ""}">${esc(l.text)}<svg viewBox="0 0 180 90" style="${l.flip ? "transform:scaleX(-1)" : ""}"><path d="M10 10 C 60 20, 120 30, 160 75 M160 75 l-26 -4 M160 75 l-2 -26"/></svg></div>`,
    screen: (l) =>
      `<div class="screen"><div class="chrome"><i></i><i></i><i></i><div class="url">${esc(l.url || "yoursite.com")}</div></div><div class="body">${
        l.caption ? `<p class="tagline">${esc(l.caption)}</p>` : ""
      }<div class="h ${l.hl === "title" ? "hl" : ""}"></div><div class="l ${l.hl === "text" ? "hl" : ""}" style="width:92%"></div><div class="l" style="width:84%"></div><div class="l" style="width:88%"></div><div class="l ${l.hl === "link" ? "hl" : ""}" style="width:40%;background:var(--c1)"></div></div></div>`,
    full: (l) => `<div class="full">${l.kicker ? `<div class="kicker" style="box-shadow:none;border:1px solid #e2e2e2"><i></i>${esc(l.kicker)}</div>` : ""}<div class="headline">${rich(l.text)}</div>${l.sub ? `<div class="sub">${esc(l.sub)}</div>` : ""}</div>`,
    endtiles: () => `<div style="display:flex;gap:640px"><div class="endtile">Next video</div><div class="endtile">Subscribe</div></div>`,
  };
  const DEFAULT_ANIM = { kicker: "a-up", lowerthird: "a-wipe", search: "a-up", full: "a-fade", note: "a-fade", stat: "a-in", flow: "a-fade", chips: "a-fade", endtiles: "a-fade" };

  const stage = $(".stage");
  const cam = $(".cam");
  const person = $(".person");
  let idx = 0;
  let current = null;

  function fit() {
    const vp = $(".viewport");
    stage.style.transform = `scale(${vp.clientWidth / 1920})`;
  }
  window.addEventListener("resize", fit);

  function countUp(root) {
    root.querySelectorAll("[data-count]").forEach((el) => {
      const raw = el.dataset.count;
      const m = raw.match(/^([^\d]*)([\d.,]+)(.*)$/);
      if (!m) return;
      const target = parseFloat(m[2].replace(/,/g, ""));
      const dec = (m[2].split(".")[1] || "").length;
      const t0 = performance.now() + 250, dur = 1300;
      const tick = (t) => {
        const p = Math.min(1, Math.max(0, (t - t0) / dur));
        const e = 1 - Math.pow(1 - p, 4);
        const v = (target * e).toFixed(dec);
        el.textContent = m[1] + Number(v).toLocaleString("en-US", { minimumFractionDigits: dec }) + m[3];
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }

  function build(f) {
    const box = document.createElement("div");
    box.className = "layers";
    let hidePerson = false;
    (f.layers || []).forEach((l) => {
      if (l.type === "full") hidePerson = true;
      const el = document.createElement("div");
      el.className = `L ${l.anim || DEFAULT_ANIM[l.type] || "a-in"} s-${l.slot || "left"}`;
      el.style.setProperty("--d", (l.delay || 0) + "s");
      if (l.style) el.setAttribute("style", el.getAttribute("style") + ";" + l.style);
      el.innerHTML = R[l.type] ? R[l.type](l) : `<div class="card"><p>Unknown layer: ${esc(l.type)}</p></div>`;
      box.appendChild(el);
    });
    return { box, hidePerson };
  }

  function show(i, replay) {
    idx = Math.max(0, Math.min(frames.length - 1, i));
    const f = frames[idx];
    if (current) {
      const old = current;
      old.classList.add("leaving");
      setTimeout(() => old.remove(), 240);
    }
    const { box, hidePerson } = build(f);
    stage.appendChild(box);
    current = box;
    cam.className = "cam " + (f.shot === "punch" ? "punch" : f.shot === "wide" ? "wide" : "");
    person.style.opacity = hidePerson ? 0 : 1;
    person.style.transition = "opacity .3s";
    requestAnimationFrame(() => requestAnimationFrame(() => { box.classList.add("go"); countUp(box); }));

    // notes
    $("#n-num").textContent = `Frame ${f.n ?? idx + 1}`;
    $("#n-sec").textContent = f.section || "";
    $("#n-time").textContent = f.time || "";
    $("#n-shot").textContent = f.shot === "punch" ? "Punch-in 112%" : f.shot === "wide" ? "Wide" : "Mid shot";
    $("#n-cue").textContent = f.cue;
    $("#n-screen").textContent = f.onscreen || "";
    $("#n-motion").textContent = f.motion || "";
    $("#n-deliver").textContent = f.deliver || "";
    $(".count").textContent = `${idx + 1} / ${frames.length}`;
    $(".progress i").style.width = ((idx + 1) / frames.length) * 100 + "%";
    if (!replay) history.replaceState(null, "", "#f" + (idx + 1));
    document.querySelectorAll(".overview tr[data-i]").forEach((tr) => tr.style.background = +tr.dataset.i === idx ? "#f6f6f6" : "");
  }

  // overview table
  $(".overview tbody").innerHTML = frames
    .map(
      (f, i) =>
        `<tr data-i="${i}"><td class="n">${f.n ?? i + 1}</td><td>${esc(f.time || "")}</td><td class="cue">“${esc(f.cue)}”</td><td>${esc(f.onscreen || "")}</td><td>${esc(f.motion || "")}</td><td>${esc(f.deliver || "")}</td></tr>`
    )
    .join("");
  $(".overview tbody").addEventListener("click", (e) => {
    const tr = e.target.closest("tr[data-i]");
    if (!tr) return;
    document.body.classList.remove("table");
    $("#b-table").classList.remove("on");
    fit();
    show(+tr.dataset.i);
  });

  const toggle = (cls, btn) => { document.body.classList.toggle(cls); if (btn) $(btn).classList.toggle("on"); fit(); };
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key;
    if (k === "ArrowRight" || k === "ArrowDown" || k === "PageDown") { e.preventDefault(); show(idx + 1); }
    else if (k === "ArrowLeft" || k === "ArrowUp" || k === "PageUp") { e.preventDefault(); show(idx - 1); }
    else if (k === " ") { e.preventDefault(); show(idx + 1); }
    else if (k === "r" || k === "R") { e.preventDefault(); show(idx, true); }
    else if (k === "Home") { e.preventDefault(); show(0); }
    else if (k === "End") { e.preventDefault(); show(frames.length - 1); }
    else if (k === "n" || k === "N") toggle("clean", "#b-notes");
    else if (k === "t" || k === "T") toggle("table", "#b-table");
    else if (k === "g" || k === "G") toggle("guides", "#b-guides");
    else if (k === "f" || k === "F") { const vp = $(".viewport"); document.fullscreenElement ? document.exitFullscreen() : vp.requestFullscreen && vp.requestFullscreen(); }
  });
  document.addEventListener("fullscreenchange", () => setTimeout(fit, 50));
  $("#b-prev").onclick = () => show(idx - 1);
  $("#b-next").onclick = () => show(idx + 1);
  $("#b-table").onclick = () => toggle("table", "#b-table");
  $("#b-guides").onclick = () => toggle("guides", "#b-guides");
  $("#b-notes").onclick = () => toggle("clean", "#b-notes");
  $(".viewport").addEventListener("click", (e) => { const r = e.currentTarget.getBoundingClientRect(); show(e.clientX - r.left < r.width / 3 ? idx - 1 : idx + 1); });

  const q = new URLSearchParams(location.search);
  if (q.get("bg") === "green") document.body.classList.add("green", "clean");
  if (q.has("clean")) document.body.classList.add("clean");
  fit();
  const m = location.hash.match(/^#f(\d+)$/);
  show(m ? +m[1] - 1 : 0);
  window.addEventListener("hashchange", () => { const h = location.hash.match(/^#f(\d+)$/); if (h && +h[1] - 1 !== idx) show(+h[1] - 1); });
  window.__storyboard = { show, get index() { return idx; }, count: frames.length };
})();
