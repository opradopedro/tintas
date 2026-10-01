/* ============================================================
   Tintas RC
   ============================================================ */
(() => {
  "use strict";

  // Número de WhatsApp (somente dígitos, com DDI e DDD).
  const CONFIG = { whatsapp: "5511977272118" };

  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = matchMedia("(pointer: fine)").matches;
  const DPR = Math.min(window.devicePixelRatio || 1, 2);
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

  /* ---------- loader ---------- */
  const done = () => document.body.classList.add("is-loaded");
  if (reduceMotion) done();
  else window.addEventListener("load", () => setTimeout(done, 1300));
  setTimeout(done, 3500); // segurança

  $("#year").textContent = new Date().getFullYear();

  /* ---------- WhatsApp ---------- */
  $$(".js-whats").forEach((a) => {
    const msg = encodeURIComponent(a.dataset.msg || "Olá, Tintas RC!");
    a.href = `https://wa.me/${CONFIG.whatsapp}?text=${msg}`;
    a.target = "_blank"; a.rel = "noopener";
  });

  /* ---------- nav ---------- */
  const nav = $("#nav"), toggle = $("#toggle");
  const closeMenu = () => {
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menu");
    document.body.style.overflow = "";
  };
  toggle.addEventListener("click", () => {
    if (nav.classList.contains("is-open")) return closeMenu();
    nav.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    toggle.setAttribute("aria-label", "Fechar menu");
    document.body.style.overflow = "hidden";
  });

  /* ---------- transição do menu: um rolo pinta a tela e leva à seção ---------- */
  const wipe = $(".wipe"), wipePaint = $(".wipe__paint"), wipeTool = $(".wipe__tool");
  let wiping = false;
  function jumpTo(target) {
    const html = document.documentElement;
    html.style.scrollBehavior = "auto";
    target.scrollIntoView();
    html.style.scrollBehavior = "";
  }
  function rollTo(target) {
    if (reduceMotion || wiping || !wipe.animate) { target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" }); return; }
    wiping = true;
    const color = target.dataset.bg || getComputedStyle(target).backgroundColor;
    wipe.style.setProperty("--wc", color);
    wipeTool.style.setProperty("--paint", color);
    wipe.classList.add("on");
    const ease = "cubic-bezier(.65,0,.35,1)", D = 650;
    wipeTool.animate([{ left: "-10%" }, { left: "104%" }], { duration: D, easing: ease, fill: "forwards" });
    wipePaint.animate([{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0% 0 0)" }], { duration: D, easing: ease, fill: "forwards" })
      .finished.then(() => {
        jumpTo(target);
        // segunda passada revela a seção
        wipeTool.animate([{ left: "-10%" }, { left: "104%" }], { duration: D, easing: ease, fill: "forwards" });
        return wipePaint.animate([{ clipPath: "inset(0 0 0 0%)" }, { clipPath: "inset(0 0 0 100%)" }], { duration: D, easing: ease, fill: "forwards" }).finished;
      })
      .then(() => { wipe.classList.remove("on"); wiping = false; });
  }
  $$('a[href^="#"]').forEach((a) => a.addEventListener("click", (e) => {
    const id = a.getAttribute("href");
    if (id.length < 2) return;
    const target = $(id);
    if (!target) return;
    e.preventDefault();
    if (nav.classList.contains("is-open")) closeMenu();
    rollTo(target);
    history.replaceState(null, "", id);
  }));

  /* ---------- reveal + contadores ---------- */
  const countUp = (el) => {
    const end = +el.dataset.count, t0 = performance.now(), dur = 1600;
    if (reduceMotion) { el.textContent = end; return; }
    const step = (t) => {
      const p = Math.min(1, (t - t0) / dur);
      el.textContent = Math.round(end * (1 - Math.pow(1 - p, 4)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("is-in");
    $$("[data-count]", e.target).forEach(countUp);
    io.unobserve(e.target);
  }), { threshold: .15, rootMargin: "0px 0px -8% 0px" });
  $$(".reveal, .paint-in").forEach((el) => io.observe(el));

  /* ---------- leque de cores ---------- */
  const fan = $("#fan");
  const FAN = [
    ["#26408b", "Azul RC"], ["#7d9ce0", "Céu"], ["#1f4e5a", "Petróleo"], ["#57a752", "Verde RC"],
    ["#a9bfa0", "Sálvia"], ["#d9a63a", "Mostarda"], ["#e5735c", "Coral Vivo"], ["#c9806a", "Terracota"],
    ["#e8b4a0", "Rosa Argila"], ["#8e5b3e", "Canela"], ["#6e2438", "Vinho"], ["#1c1d24", "Grafite"],
  ];
  if (fan) {
    const n = FAN.length, spread = 150;
    FAN.forEach(([c, name], i) => {
      const b = document.createElement("div");
      b.className = "fan__blade";
      b.style.setProperty("--c", c);
      b.style.setProperty("--a", `${-spread / 2 + (spread / (n - 1)) * i}deg`);
      b.style.zIndex = i + 1;
      b.innerHTML = `<b>${name}</b><i></i><i></i><i></i>`;
      fan.prepend(b);
    });
  }

  /* ---------- rolos entre as seções, elementos de fundo e leque (scroll) ---------- */
  const rolls = $$(".roll");
  const decors = $$(".decor");
  let ticking = false;
  function onScroll() {
    const vh = innerHeight;
    nav.classList.toggle("is-scrolled", scrollY > 30);

    for (const r of rolls) {
      const rect = r.getBoundingClientRect();
      if (rect.bottom < -200 || rect.top > vh + 200) continue;
      // começa quando entra por baixo, termina perto do meio da tela
      const t = reduceMotion ? 1 : clamp((vh * .98 - rect.top) / (vh * .6), 0, 1);
      const x = t * 1.24 - .12;           // o rolo entra e sai da tela
      r.style.setProperty("--p", clamp(x).toFixed(4));
      r.style.setProperty("--x", x.toFixed(4));
      r.style.setProperty("--tilt", `${Math.sin(t * Math.PI * 3) * 3}deg`);
    }

    if (!reduceMotion) for (const d of decors) {
      const rect = d.parentElement.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > vh) continue;
      const c = rect.top + rect.height / 2 - vh / 2;
      d.style.setProperty("--y", `${(c * (+d.dataset.speed || .1)).toFixed(1)}px`);
    }

    if (fan) {
      const rect = fan.getBoundingClientRect();
      const p = reduceMotion ? 1 : clamp((vh - rect.top) / (vh * .75));
      fan.style.setProperty("--p", p.toFixed(3));
      $$(".fan__blade", fan).forEach((b) => b.style.setProperty("--p", p.toFixed(3)));
    }
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  addEventListener("resize", onScroll);
  onScroll();

  /* ---------- rastro de tinta do cursor ---------- */
  const trail = $("#trail");
  if (trail && finePointer && !reduceMotion) {
    const ctx = trail.getContext("2d");
    let w = 0, h = 0, last = null, hue = 0, idle = 0, running = false;
    const resize = () => {
      w = trail.width = Math.round(innerWidth * DPR);
      h = trail.height = Math.round(innerHeight * DPR);
      trail.style.width = innerWidth + "px"; trail.style.height = innerHeight + "px";
    };
    resize(); addEventListener("resize", resize);
    const pts = [];
    const cols = [[38, 64, 139], [87, 167, 82], [201, 128, 106], [217, 166, 58]];
    addEventListener("pointermove", (e) => {
      pts.push({ x: e.clientX * DPR, y: e.clientY * DPR });
      idle = 0;
      if (!running) { running = true; requestAnimationFrame(loop); }
    }, { passive: true });
    function loop() {
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,.07)"; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      while (pts.length) {
        const p = pts.shift();
        if (last) {
          const d = Math.hypot(p.x - last.x, p.y - last.y);
          hue = (hue + d * .002) % cols.length;
          const c = cols[Math.floor(hue)];
          ctx.strokeStyle = `rgba(${c[0]},${c[1]},${c[2]},.18)`;
          ctx.lineWidth = Math.max(2, 14 - d * .1) * DPR * .6;
          ctx.lineCap = "round";
          ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
        }
        last = p;
      }
      if (++idle > 90) { running = false; last = null; ctx.clearRect(0, 0, w, h); return; }
      requestAnimationFrame(loop);
    }
  }

  /* ---------- laboratório de cor ---------- */
  const MOODS = {
    serenidade: [["Azul Profundo RC", "#26408B"], ["Névoa da Manhã", "#C9D3E6"], ["Céu de Inverno", "#7D9CE0"], ["Algodão", "#EFEAE0"], ["Lavanda Seca", "#B8AFCF"], ["Cinza Pérola", "#D6D5D1"], ["Azul Jeans", "#4F6D9A"], ["Gelo", "#E4ECEF"]],
    aconchego: [["Terracota", "#C9806A"], ["Areia Morna", "#E2CDB0"], ["Caramelo", "#B9844F"], ["Rosa Argila", "#E8B4A0"], ["Linho Cru", "#F2E6CF"], ["Canela", "#8E5B3E"], ["Pêssego", "#F0C3A4"], ["Café com Leite", "#C7A88A"]],
    natureza: [["Verde RC", "#57A752"], ["Sálvia", "#A9BFA0"], ["Musgo", "#5E6E45"], ["Eucalipto", "#86A99A"], ["Folha Nova", "#BFE3A5"], ["Mata Atlântica", "#2F5D3A"], ["Oliva", "#8A8B4E"], ["Menta", "#CFE6D6"]],
    terra: [["Barro", "#A0522D"], ["Ocre", "#C8913A"], ["Argila Clara", "#D9B99B"], ["Tijolo", "#9C4A35"], ["Cerâmica", "#B86B4B"], ["Palha", "#E3D3A8"], ["Castanho", "#6B4632"], ["Areia da Praia", "#EADCC3"]],
    ousadia: [["Noite Urbana", "#1C1D24"], ["Cobalto", "#2F4FD1"], ["Mostarda", "#D9A63A"], ["Vinho", "#6E2438"], ["Petróleo", "#1F4E5A"], ["Coral Vivo", "#E5735C"], ["Berinjela", "#4B2C4F"], ["Amarelo Sol", "#F2C230"]],
  };
  const list = $("#swatches"), room = $("#room");
  const nameEl = $("#colorName"), hexEl = $("#colorHex");
  const root = document.documentElement;

  function setColor(name, hex, btn, animate) {
    if (animate && room && !reduceMotion) {
      room.style.setProperty("--wall-next", hex);
      room.classList.remove("splash"); void room.offsetWidth; room.classList.add("splash");
    }
    root.style.setProperty("--wall", hex);
    nameEl.textContent = name; hexEl.textContent = hex;
    $$("button", list).forEach((b) => b.setAttribute("aria-pressed", b === btn));
  }
  function renderMood(mood) {
    list.innerHTML = MOODS[mood].map(([n, h], i) =>
      `<li><button type="button" style="--c:${h};--i:${i};--rot:${((i * 37) % 7 - 3) * .6}deg" data-name="${n}" data-hex="${h}" aria-pressed="false" aria-label="Aplicar ${n}">
        <span class="c"></span><span class="n">${n}</span></button></li>`).join("");
    const first = $("button", list);
    setColor(first.dataset.name, first.dataset.hex, first, false);
  }
  if (list) {
    list.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      setColor(b.dataset.name, b.dataset.hex, b, true);
    });
    $$(".moods button").forEach((t) => t.addEventListener("click", () => {
      $$(".moods button").forEach((x) => x.setAttribute("aria-selected", x === t));
      renderMood(t.dataset.mood);
    }));
    renderMood("serenidade");
  }
})();
