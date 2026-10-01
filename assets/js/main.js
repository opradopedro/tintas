/* ============================================================
   Tintas RC — Ateliê da Cor
   ============================================================ */
(() => {
  "use strict";

  // Número de WhatsApp (somente dígitos, com DDI e DDD, ex.: "5511999999999").
  // Vazio = o botão "Conversar agora" liga para a loja.
  const CONFIG = { whatsapp: "", phone: "+551127311070" };

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  const BRAND = {
    blue: [38, 64, 139],
    green: [87, 167, 82],
    clay: [201, 128, 106],
    sky: [125, 156, 224],
    sand: [242, 230, 207],
  };

  /* ---------- utilidades ---------- */
  function rng(seed) { // mulberry32
    return () => {
      seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
      let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  const hexToRgb = (h) => { const n = parseInt(h.replace("#", ""), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

  function fitCanvas(cv, scale = DPR) {
    const r = cv.getBoundingClientRect();
    cv.width = Math.max(1, Math.round(r.width * scale));
    cv.height = Math.max(1, Math.round(r.height * scale));
    return { w: cv.width, h: cv.height };
  }

  // executa um loop só enquanto o elemento estiver visível
  function visibleLoop(el, frame) {
    let on = false, raf = 0;
    const tick = (t) => { frame(t); if (on) raf = requestAnimationFrame(tick); };
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !on) { on = true; raf = requestAnimationFrame(tick); }
      else if (!e.isIntersecting) { on = false; cancelAnimationFrame(raf); }
    }).observe(el);
  }

  /* ---------- loader ---------- */
  const done = () => document.body.classList.add("is-loaded");
  if (reduceMotion) done();
  else window.addEventListener("load", () => setTimeout(done, 1100));
  setTimeout(done, 3500); // segurança

  $("#year").textContent = new Date().getFullYear();

  /* ---------- WhatsApp ---------- */
  const whats = $("#whatsBtn");
  if (CONFIG.whatsapp) {
    const msg = encodeURIComponent("Olá, Tintas RC! Gostaria de um orçamento.");
    whats.href = `https://wa.me/${CONFIG.whatsapp}?text=${msg}`;
  } else {
    whats.href = `tel:${CONFIG.phone}`;
    whats.removeAttribute("target");
  }

  /* ---------- nav ---------- */
  const nav = $("#nav"), toggle = $("#toggle");
  const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 30);
  addEventListener("scroll", onScroll, { passive: true }); onScroll();
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", open);
    toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
    document.body.style.overflow = open ? "hidden" : "";
  });
  $$("#menu a").forEach((a) => a.addEventListener("click", () => {
    if (nav.classList.contains("is-open")) toggle.click();
  }));

  /* ---------- botões: luz segue o cursor ---------- */
  $$(".btn--solid").forEach((b) => b.addEventListener("pointermove", (e) => {
    const r = b.getBoundingClientRect();
    b.style.setProperty("--mx", `${e.clientX - r.left}px`);
    b.style.setProperty("--my", `${e.clientY - r.top}px`);
  }));

  /* ---------- reveal + contadores ---------- */
  const countUp = (el) => {
    const end = +el.dataset.count, t0 = performance.now(), dur = 1800;
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = Math.round(end * e).toLocaleString("pt-BR");
      if (p < 1) requestAnimationFrame(step);
    };
    reduceMotion ? (el.textContent = end) : requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in");
    $$("[data-count]", e.target).forEach(countUp);
    io.unobserve(e.target);
  }), { threshold: .15, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal").forEach((el) => io.observe(el));

  /* ---------- manifesto: palavras acendem com o scroll ---------- */
  const split = $(".split");
  if (split) {
    split.innerHTML = split.textContent.trim().split(/\s+/).map((w) => `<span class="w">${w}</span>`).join(" ");
    const words = $$(".w", split);
    const art = $(".manifesto__art");
    const update = () => {
      const r = split.getBoundingClientRect(), vh = innerHeight;
      const p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .35)));
      const n = reduceMotion ? words.length : Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle("on", i < n));
      if (art) art.style.setProperty("--p", p.toFixed(3));
      $$(".swatch-stack span").forEach((s) => s.style.setProperty("--p", p.toFixed(3)));
    };
    addEventListener("scroll", update, { passive: true }); update();
  }

  /* ---------- citação: pincelada desenhada ---------- */
  const strokePath = $("#strokePath");
  if (strokePath) {
    const len = strokePath.getTotalLength();
    strokePath.style.setProperty("--len", len);
    const sec = $(".quote");
    const upd = () => {
      const r = sec.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight + r.height * .4)));
      strokePath.style.setProperty("--draw", reduceMotion ? 1 : p.toFixed(3));
    };
    addEventListener("scroll", upd, { passive: true }); upd();
  }

  /* ============================================================
     Tinta fluida: manchas de tinta que se misturam
     ============================================================ */
  function fluid(cv, opts) {
    const ctx = cv.getContext("2d");
    const R = rng(opts.seed || 7);
    const SCALE = .5; // baixa resolução = suavidade natural e desempenho
    let w = 0, h = 0;
    const mouse = { x: -1e4, y: -1e4, tx: -1e4, ty: -1e4 };
    const blobs = opts.colors.map((c, i) => ({
      c, r: .22 + R() * .2, x: R(), y: R(), ax: R() * 6.28, ay: R() * 6.28,
      sx: .00006 + R() * .00008, sy: .00005 + R() * .00008, amp: .18 + R() * .16, ox: 0, oy: 0, i,
    }));
    const resize = () => ({ w, h } = fitCanvas(cv, SCALE));
    resize(); addEventListener("resize", resize);

    if (finePointer) {
      cv.parentElement.addEventListener("pointermove", (e) => {
        const r = cv.getBoundingClientRect();
        mouse.tx = (e.clientX - r.left) * SCALE; mouse.ty = (e.clientY - r.top) * SCALE;
      });
      cv.parentElement.addEventListener("pointerleave", () => { mouse.tx = mouse.ty = -1e4; });
    }

    const draw = (t) => {
      mouse.x += (mouse.tx - mouse.x) * .06; mouse.y += (mouse.ty - mouse.y) * .06;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = opts.bg; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = opts.blend;
      const m = Math.max(w, h);
      for (const b of blobs) {
        let x = (b.x + Math.sin(t * b.sx + b.ax) * b.amp) * w;
        let y = (b.y + Math.cos(t * b.sy + b.ay) * b.amp) * h;
        // o cursor empurra a tinta suavemente
        const dx = x - mouse.x, dy = y - mouse.y, d = Math.hypot(dx, dy), infl = m * .35;
        if (d < infl) { const f = (1 - d / infl) * 40 * SCALE * 2; b.ox += (dx / (d || 1)) * f * .05; b.oy += (dy / (d || 1)) * f * .05; }
        b.ox *= .965; b.oy *= .965; x += b.ox * 6; y += b.oy * 6;
        const rad = b.r * m * (1 + Math.sin(t * .0004 + b.i) * .08);
        const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
        g.addColorStop(0, rgba(b.c, opts.alpha));
        g.addColorStop(.55, rgba(b.c, opts.alpha * .45));
        g.addColorStop(1, rgba(b.c, 0));
        ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.283); ctx.fill();
      }
    };
    if (reduceMotion) draw(0); else visibleLoop(cv, draw);
  }

  const heroCv = $("#fluid");
  if (heroCv) fluid(heroCv, {
    bg: "#f6f1e8", blend: "multiply", alpha: .55, seed: 11,
    colors: [BRAND.sky, BRAND.green, [232, 180, 160], BRAND.blue, BRAND.sand, [190, 220, 170]],
  });
  const contactCv = $("#fluid2");
  if (contactCv) fluid(contactCv, {
    bg: "#172a63", blend: "screen", alpha: .35, seed: 4,
    colors: [BRAND.green, BRAND.sky, [80, 110, 200], BRAND.clay],
  });

  /* ============================================================
     Rastro de tinta do cursor
     ============================================================ */
  const trail = $("#trail");
  if (trail && finePointer && !reduceMotion) {
    const ctx = trail.getContext("2d");
    let w, h, last = null, hue = 0, idle = 0, running = false;
    const resize = () => { ({ w, h } = fitCanvas(trail)); };
    resize(); addEventListener("resize", resize);
    const pts = [];
    addEventListener("pointermove", (e) => {
      pts.push({ x: e.clientX * DPR, y: e.clientY * DPR });
      idle = 0;
      if (!running) { running = true; requestAnimationFrame(loop); }
    }, { passive: true });
    const cols = [BRAND.blue, BRAND.sky, BRAND.green, BRAND.clay];
    function loop() {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,.06)"; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      while (pts.length) {
        const p = pts.shift();
        if (last) {
          const d = Math.hypot(p.x - last.x, p.y - last.y);
          hue = (hue + d * .002) % cols.length;
          const c = cols[Math.floor(hue)];
          ctx.strokeStyle = rgba(c, .16);
          ctx.lineWidth = Math.max(2, 16 - d * .12) * DPR * .6;
          ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
        }
        last = p;
      }
      if (++idle > 90) { running = false; last = null; ctx.clearRect(0, 0, w, h); return; }
      requestAnimationFrame(loop);
    }
  }

  /* ============================================================
     Marmorizado dos cards (desenhado uma vez)
     ============================================================ */
  function marble(cv, colors, seed) {
    const { w, h } = fitCanvas(cv);
    const ctx = cv.getContext("2d"), R = rng(seed);
    const [a, b, c] = colors.map(hexToRgb);
    const bg = ctx.createLinearGradient(0, 0, w, h);
    bg.addColorStop(0, rgba(b, 1)); bg.addColorStop(1, rgba(a, 1));
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    // veios de tinta: curvas longas sobrepostas
    for (let i = 0; i < 26; i++) {
      const col = [a, b, c, [251, 248, 242]][Math.floor(R() * 4)];
      ctx.strokeStyle = rgba(col, .12 + R() * .35);
      ctx.lineWidth = (2 + R() * 26) * DPR;
      ctx.lineCap = "round";
      ctx.beginPath();
      let x = -20, y = R() * h;
      ctx.moveTo(x, y);
      while (x < w + 20) {
        const nx = x + w * (.15 + R() * .2), ny = y + (R() - .5) * h * .5;
        ctx.quadraticCurveTo(x + (nx - x) / 2, y + (R() - .5) * h * .6, nx, ny);
        x = nx; y = ny;
      }
      ctx.stroke();
    }
    // gotas
    for (let i = 0; i < 18; i++) {
      ctx.fillStyle = rgba([c, [251, 248, 242]][i % 2], .25 + R() * .5);
      ctx.beginPath(); ctx.arc(R() * w, R() * h, (1 + R() * 6) * DPR, 0, 6.283); ctx.fill();
    }
  }
  const drawCards = () => $$("canvas[data-blob]").forEach((cv, i) => marble(cv, cv.dataset.blob.split(","), 101 + i * 17));

  /* ============================================================
     Galeria: foto real ou pintura generativa abstrata
     ============================================================ */
  function painting(cv, seed) {
    const { w, h } = fitCanvas(cv);
    const ctx = cv.getContext("2d"), R = rng(seed * 991);
    const palettes = [
      [BRAND.sand, BRAND.blue, BRAND.green, BRAND.clay],
      [[236, 228, 214], BRAND.green, BRAND.blue, [30, 32, 44]],
      [[246, 232, 220], BRAND.clay, BRAND.blue, BRAND.sky],
      [[226, 234, 222], BRAND.blue, BRAND.green, BRAND.sand],
    ];
    const pal = palettes[(seed - 1) % palettes.length];
    ctx.fillStyle = rgba(pal[0], 1); ctx.fillRect(0, 0, w, h);
    // lavagens (aquarela)
    for (let i = 0; i < 9; i++) {
      const c = pal[1 + Math.floor(R() * 3)], x = R() * w, y = R() * h, r = (.2 + R() * .45) * Math.max(w, h);
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, rgba(c, .28)); g.addColorStop(1, rgba(c, 0));
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }
    // pinceladas largas com cerdas
    for (let s = 0; s < 7; s++) {
      const c = pal[1 + Math.floor(R() * 3)];
      const width = (30 + R() * 90) * DPR, bristles = 18;
      let x0 = R() * w * .3 - w * .1, y0 = R() * h;
      const x1 = w * (.7 + R() * .5), y1 = y0 + (R() - .5) * h * .7;
      const cx = (x0 + x1) / 2 + (R() - .5) * w * .3, cy = (y0 + y1) / 2 + (R() - .5) * h * .5;
      for (let b = 0; b < bristles; b++) {
        const off = (b / bristles - .5) * width;
        ctx.strokeStyle = rgba(c, .05 + R() * .22);
        ctx.lineWidth = (1 + R() * 4) * DPR;
        ctx.beginPath();
        ctx.moveTo(x0, y0 + off);
        ctx.quadraticCurveTo(cx, cy + off, x1 - R() * w * .2, y1 + off);
        ctx.stroke();
      }
    }
    // respingos
    for (let i = 0; i < 60; i++) {
      ctx.fillStyle = rgba(pal[1 + (i % 3)], .2 + R() * .6);
      ctx.beginPath(); ctx.arc(R() * w, R() * h, R() * R() * 7 * DPR, 0, 6.283); ctx.fill();
    }
  }
  const frames = $$(".frame");
  frames.forEach((f) => {
    if (f.dataset.photo) {
      const img = new Image();
      img.src = f.dataset.photo; img.alt = f.querySelector("figcaption")?.textContent.trim() || "";
      img.loading = "lazy"; f.prepend(img);
    } else {
      const cv = document.createElement("canvas");
      cv.setAttribute("aria-hidden", "true"); f.prepend(cv);
    }
  });
  const drawFrames = () => frames.forEach((f) => { const cv = $("canvas", f); if (cv) painting(cv, +f.dataset.seed || 1); });

  let rt;
  const redrawStatic = () => { drawCards(); drawFrames(); };
  redrawStatic();
  addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(redrawStatic, 250); });

  /* ============================================================
     Laboratório de cor
     ============================================================ */
  const MOODS = {
    serenidade: [["Azul Profundo RC", "#26408B"], ["Névoa da Manhã", "#C9D3E6"], ["Céu de Inverno", "#7D9CE0"], ["Algodão", "#EFEAE0"], ["Lavanda Seca", "#B8AFCF"], ["Cinza Pérola", "#D6D5D1"]],
    aconchego: [["Terracota", "#C9806A"], ["Areia Morna", "#E2CDB0"], ["Caramelo", "#B9844F"], ["Rosa Argila", "#E8B4A0"], ["Linho Cru", "#F2E6CF"], ["Canela", "#8E5B3E"]],
    natureza: [["Verde RC", "#57A752"], ["Sálvia", "#A9BFA0"], ["Musgo", "#5E6E45"], ["Eucalipto", "#86A99A"], ["Folha Nova", "#BFE3A5"], ["Mata Atlântica", "#2F5D3A"]],
    ousadia: [["Noite Urbana", "#1B1D29"], ["Cobalto", "#2F4FD1"], ["Mostarda", "#D9A63A"], ["Vinho", "#6E2438"], ["Petróleo", "#1F4E5A"], ["Coral Vivo", "#E5735C"]],
  };
  const list = $("#swatches"), room = $("#room");
  const nameEl = $("#colorName"), hexEl = $("#colorHex");
  const root = document.documentElement;

  function setColor(name, hex, btn, ev) {
    if (ev && room) {
      room.style.setProperty("--ox", `${30 + Math.random() * 40}%`);
      room.style.setProperty("--oy", `${20 + Math.random() * 30}%`);
      room.classList.remove("splash"); void room.offsetWidth; room.classList.add("splash");
    }
    root.style.setProperty("--wall", hex);
    nameEl.textContent = name; hexEl.textContent = hex;
    $$("button", list).forEach((b) => b.setAttribute("aria-pressed", b === btn));
  }

  function renderMood(mood) {
    list.innerHTML = MOODS[mood].map(([n, h], i) =>
      `<li><button type="button" style="--c:${h};--i:${i}" data-name="${n}" data-hex="${h}" aria-pressed="false" aria-label="Aplicar ${n}">
        <span class="c"></span><span class="n">${n}</span></button></li>`).join("");
    const first = $("button", list);
    setColor(first.dataset.name, first.dataset.hex, first, null);
  }
  if (list) {
    list.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      setColor(b.dataset.name, b.dataset.hex, b, e);
    });
    $$(".moods button").forEach((t) => t.addEventListener("click", () => {
      $$(".moods button").forEach((x) => x.setAttribute("aria-selected", x === t));
      renderMood(t.dataset.mood);
    }));
    renderMood("serenidade");
  }
})();
