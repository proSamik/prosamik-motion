// Plays the scenes in window.VIDEO. Keys: Space or Right = next, Left = back, R = restart, P = pause autoplay,
// H = hide this hint. Add ?bg=green to the address for a green background you can key out, ?scene=steps to start there.
(function () {
  var V = window.VIDEO, stage = document.getElementById('stage');
  var q = new URLSearchParams(location.search);
  if (q.get('bg') === 'green') document.body.classList.add('green');

  function fit() {
    var s = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.transform = 'scale(' + s + ') translate(-50%, -50%)';
    stage.style.transformOrigin = '0 0';
    stage.style.left = '50%'; stage.style.top = '50%';
  }
  addEventListener('resize', fit); fit();

  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function words(parent, text, cls, step, start, highlight) {
    text.split(/\s+/).forEach(function (w, i) {
      var s = el('span', cls, w);
      if (highlight && highlight.test(w)) s.className += ' hl';
      s.style.animationDelay = (start + i * step) + 's';
      parent.appendChild(s);
    });
    return start + text.split(/\s+/).length * step;
  }

  var scenes = [], timers = [];
  function scene(name, ms, build) { var s = el('div', 'scene'); s.dataset.name = name; stage.appendChild(s); scenes.push({ el: s, ms: ms, build: build }); }

  scene('title', 4200, function (s) {
    s.appendChild(el('div', 'tag', V.channel));
    var t = el('h1', 'title'); words(t, V.title, 'w', 0.12, 0.4); s.appendChild(t);
    var b = el('div', 'bar'); b.style.animationDelay = (0.6 + V.title.split(/\s+/).length * 0.12) + 's'; s.appendChild(b);
  });
  scene('hook', 4500, function (s) {
    s.appendChild(el('div', 'label', 'Hook'));
    var t = el('div', 'big'); words(t, V.hook, 'w', 0.18, 0.4, /^(free|zero|one|1|never|every|only|fast|first)[,.!?]*$/i); s.appendChild(t);
  });
  scene('why', 4000, function (s) {
    s.appendChild(el('div', 'label', 'Why it matters'));
    s.appendChild(el('div', 'card', V.why));
  });
  scene('steps', 2200 + V.steps.length * 1600, function (s) {
    s.appendChild(el('div', 'label', 'Steps'));
    var row = el('div', 'steps'); s.appendChild(row);
    var boxes = [];
    V.steps.forEach(function (t, i) {
      if (i) row.appendChild(el('div', 'arrow'));
      var b = el('div', 'step'); b.appendChild(el('b', null, 'Step ' + (i + 1))); b.appendChild(document.createTextNode(t));
      row.appendChild(b); boxes.push(b);
    });
    var kids = row.children;
    for (var i = 0; i < kids.length; i++) (function (k, d) {
      timers.push(setTimeout(function () {
        k.classList.add('in');
        if (k.classList.contains('step')) { boxes.forEach(function (b) { b.classList.remove('now'); }); k.classList.add('now'); }
      }, d));
    })(kids[i], 500 + Math.ceil(i / 2) * 1600 + (i % 2 ? -400 : 0));
  });
  scene('giveaway', 4500, function (s) {
    var g = el('div', 'gift'); g.appendChild(el('div', 'box')); g.appendChild(el('div', 'lid')); g.appendChild(el('div', 'rib')); s.appendChild(g);
    s.appendChild(el('div', 'label', 'Free give-away'));
    var t = el('div', 'big'); words(t, V.giveaway, 'w', 0.15, 0.5); s.appendChild(t);
    if (V.cta) s.appendChild(el('div', 'cta', V.cta));
  });
  scene('next', 4000, function (s) {
    var n = el('div', 'next'); n.appendChild(el('div', 'box2', 'Next video')); n.appendChild(el('div', 'sub', 'Watch it next')); s.appendChild(n);
  });

  var cur = -1, auto = true, autoT;
  function show(i) {
    timers.forEach(clearTimeout); timers = []; clearTimeout(autoT);
    cur = Math.max(0, Math.min(scenes.length - 1, i));
    scenes.forEach(function (sc, j) { sc.el.classList.toggle('on', j === cur); sc.el.innerHTML = ''; });
    scenes[cur].build(scenes[cur].el);
    if (auto && cur < scenes.length - 1) autoT = setTimeout(function () { show(cur + 1); }, scenes[cur].ms);
  }
  addEventListener('keydown', function (e) {
    if (e.key === ' ' || e.key === 'ArrowRight') { e.preventDefault(); show(cur + 1); }
    else if (e.key === 'ArrowLeft') show(cur - 1);
    else if (e.key === 'r' || e.key === 'R') show(0);
    else if (e.key === 'p' || e.key === 'P') { auto = !auto; show(cur); }
    else if (e.key === 'h' || e.key === 'H') hint.classList.toggle('hide');
  });
  addEventListener('click', function () { show(cur + 1); });

  var hint = el('div', null, 'Space next · Left back · R restart · P pause · H hide · ?bg=green'); hint.id = 'hint'; document.body.appendChild(hint);
  setTimeout(function () { hint.classList.add('hide'); }, 2500);

  var start = scenes.findIndex(function (s) { return s.el.dataset.name === q.get('scene'); });
  show(start < 0 ? 0 : start);
})();
