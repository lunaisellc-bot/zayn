/* ===== ZAYN 2.0 — Single-file JS (intro + i18n + products + centered auto-rotate gallery) ===== */

const I18N = {
  EN: {
    headlineCycle: ["Luxury doesn’t shout.", "It breathes.", "It pauses.", "It lets you feel."],
    manifesto: [
      "Not made to impress. Made to express.",
      "You wear silence, not fabric.",
      "Designs are geometry; feelings draw the lines.",
      "Elegance is a pause between two breaths."
    ],
    philosophyH: "Philosophy",
    philosophy:
      "ZAYN is a house of quiet luxury — a gallery of restraint where geometry meets emotion. We design pauses, spaces, and textures that let you feel more by seeing less.",
    piecesH: "Pieces",
    storyH: "Story",
    story:
      "Born in Wyoming, carried by silence. ZAYN bridges Eastern sentiment and Western minimalism — crafting pieces that speak softly yet powerfully.",
    enter: "enter zayn",
    etsy: "view on etsy",
    nlH: "Join the world of quiet luxury.",
    nlP: "Be the first to discover new designs, textures, and limited drops.",
    subscribe: "Subscribe",
    thanks: "Thank you — welcome to the world of quiet luxury."
  },
  TR: {
    headlineCycle: ["Lüks bağırmaz.", "Nefes alır.", "Durur.", "Sana hissettirir."],
    manifesto: [
      "Etkilemek için değil; ifade etmek için üretilir.",
      "Üzerine sessizliği giyersin, kumaşı değil.",
      "Tasarım geometridir; çizgileri duygular çizer.",
      "Zerafet, iki nefes arasındaki duraktır."
    ],
    philosophyH: "Felsefe",
    philosophy:
      "ZAYN, sessiz lüksün evidir — geometrinin duyguyla buluştuğu bir itidal galerisi. Daha az görerek daha çok hissetmeni sağlayan duraklar, boşluklar ve dokular tasarlarız.",
    piecesH: "Koleksiyon",
    storyH: "Hikâye",
    story:
      "Wyoming'de doğdu, sessizlikte büyüdü. ZAYN, Doğu'nun hissiyatı ile Batı'nın minimalizmini köprüler — yumuşak ama güçlü konuşan parçalar üretir.",
    enter: "zayn dünyasına gir",
    etsy: "etsy'de gör",
    nlH: "Sessiz lüksün dünyasına katıl.",
    nlP: "Yeni tasarımları, dokuları ve sınırlı serileri ilk keşfeden ol.",
    subscribe: "Abone Ol",
    thanks: "Teşekkürler — sessiz lüks dünyasına hoş geldin."
  }
};

let LANG = "EN";
const $ = (q) => document.querySelector(q);

/* ---------- Intro (logo + ses) ve sayfayı görünür yap ---------- */
function runIntroOnce() {
  const intro = document.getElementById("zaynIntro");
  const audio = document.getElementById("introSound");
  const KEY = "zaynIntroPlayed";

  if (!intro) {
    document.body.classList.remove("pre-reveal");
    document.body.classList.add("reveal");
    return;
  }

  if (sessionStorage.getItem(KEY) === "1") {
    intro.remove();
    document.body.classList.remove("pre-reveal");
    document.body.classList.add("reveal");
    if (audio) audio.remove();
    return;
  }

  let v = 0.10;
  if (audio) audio.volume = v;

  function fadeTo(target, step = 0.07, every = 80) {
    const id = setInterval(() => {
      v = Math.min(target, v + step);
      if (audio) audio.volume = v;
      if (v >= target) clearInterval(id);
    }, every);
  }
  function fadeOut(step = 0.03, every = 80) {
    const id = setInterval(() => {
      v = Math.max(0, v - step);
      if (audio) audio.volume = v;
      if (v <= 0) {
        clearInterval(id);
        audio && audio.pause();
      }
    }, every);
  }
  function scheduleFadeOut() {
    const dur = (audio && isFinite(audio.duration) && audio.duration > 0)
      ? audio.duration * 1000 : 3000;
    setTimeout(() => fadeOut(), Math.max(0, dur - 450));
  }
  function startAudio() {
    if (!audio || !audio.paused) return;
    audio.play().then(() => {
      sessionStorage.setItem(KEY, "1");
      fadeTo(0.55, 0.07);
      if (isFinite(audio.duration) && audio.duration > 0) scheduleFadeOut();
      else audio.addEventListener("loadedmetadata", scheduleFadeOut, { once: true });
      removeUnlockers();
    }).catch(() => { });
  }

  const events = ["pointerdown", "touchstart", "wheel", "keydown", "scroll", "mousemove"];
  function unlock() { startAudio(); }
  function removeUnlockers() { events.forEach(ev => window.removeEventListener(ev, unlock)); }
  events.forEach(ev => window.addEventListener(ev, unlock, { once: true, passive: true }));
  startAudio();

  const fontsReady = ('fonts' in document) ? document.fonts.ready : Promise.resolve();
  Promise.all([fontsReady]).then(() => {
    setTimeout(() => {
      document.body.classList.remove("pre-reveal");
      document.body.classList.add("reveal");
    }, 1600);
    setTimeout(() => {
      intro.classList.add("hide");
      intro.addEventListener("transitionend", () => intro.remove(), { once: true });
    }, 2600);
  });
}

/* ---------- i18n ---------- */
function setText(el, key) { if (el) el.textContent = I18N[LANG][key]; }

function applyLang() {
  setText($('[data-i18n="philosophy-h"]'), "philosophyH");
  setText($('[data-i18n="philosophy"]'), "philosophy");
  setText($('[data-i18n="pieces-h"]'), "piecesH");
  setText($('[data-i18n="story-h"]'), "storyH");
  setText($('[data-i18n="story"]'), "story");
  setText($('[data-i18n="enter"]'), "enter");
  setText($('[data-i18n="etsy"]'), "etsy");
  setText($('[data-i18n="nl-h"]'), "nlH");
  setText($('[data-i18n="nl-p"]'), "nlP");
  setText($('[data-i18n="subscribe"]'), "subscribe");

  const ul = $("#manifesto");
  if (ul) {
    ul.innerHTML = "";
    I18N[LANG].manifesto.forEach(line => {
      const li = document.createElement("li");
      li.className = "muted";
      li.innerHTML = `<span class="dot"></span><span>${line}</span>`;
      ul.appendChild(li);
    });
  }
}

/* ---------- headline ticker ---------- */
let tickerId = null;
function startHeadlineTicker() {
  const h = $("#headline");
  if (!h) return;
  const lines = I18N[LANG].headlineCycle.slice();
  let i = 0;
  if (tickerId) clearInterval(tickerId);
  tickerId = setInterval(() => {
    i = (i + 1) % lines.length;
    h.style.opacity = 0;
    h.style.transform = "translateY(10px)";
    setTimeout(() => {
      h.textContent = lines[i];
      h.style.opacity = 1;
      h.style.transform = "translateY(0)";
    }, 220);
  }, 2400);
}

/* ---------- products ---------- */
async function loadProducts() {
  try {
    const res = await fetch(`products.json?v=${Date.now().toString().slice(0, 10)}`, { cache: "no-store" });
    const items = await res.json();
    const grid = $("#grid");
    if (!grid) return;

    grid.innerHTML = "";
    items.forEach(it => {
      const title = LANG === "EN" ? (it.titleEN ?? it.title) : (it.titleTR ?? it.title);
      const line = LANG === "EN" ? (it.lineEN ?? it.line ?? "") : (it.lineTR ?? it.line ?? "");
      const href = it.href || (it.id ? `https://www.etsy.com/listing/${it.id}` : "https://www.etsy.com/shop/ByZaynCo");
      const img = (it.image && String(it.image).trim())
        || (it.images && it.images[0] && (it.images[0].url_fullxfull || it.images[0].url_570xN))
        || "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

      const a = document.createElement("a");
      a.href = href; a.target = "_blank"; a.rel = "noopener"; a.className = "card-tile";
      a.innerHTML = `
        <img src="${img}" alt="${title ?? ''}" loading="lazy"
             style="width:100%; height:auto; display:block; border-radius:12px; margin-bottom:8px">
        <div class="tile-meta">
          <div><span class="dot"></span>${title ?? ""}</div>
          <div class="muted" style="font-size:.85rem; margin-top:4px">${line}</div>
        </div>`;
      grid.appendChild(a);
    });
  } catch (e) { console.error("products.json error", e); }
}

/* ---------- Language / Newsletter / Year ---------- */
function initLangToggle() {
  const btn = $("#langToggle"); if (!btn) return;
  btn.textContent = LANG === "EN" ? "TR" : "EN";
  btn.addEventListener("click", async () => {
    LANG = (LANG === "EN") ? "TR" : "EN";
    btn.textContent = (LANG === "EN") ? "TR" : "EN";
    applyLang(); startHeadlineTicker(); await loadProducts();
  });
}
function initNewsletter() {
  const form = document.querySelector(".nl");
  const thanks = $("#nlThanks");
  if (!form || !thanks) return;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    thanks.textContent = I18N[LANG].thanks;
    setTimeout(() => { thanks.textContent = ""; }, 3500);
    form.reset();
  });
}
function setYear() {
  const y = $("#year");
  if (y) y.textContent = new Date().getFullYear();
}

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", async () => {
  setYear();
  runIntroOnce();
  applyLang();
  startHeadlineTicker();
  initLangToggle();
  initNewsletter();
  await loadProducts();
});

/* ---------- ZAYN — Coverflow Gallery (Final Single) ---------- */
(function () {
  if (window.ZAYN_GALLERY_INIT) return;
  window.ZAYN_GALLERY_INIT = true;
  console.log("[ZAYN] gallery init");

  const deck = document.getElementById("zaynDeck");
  if (!deck) return;

  const slots = [...deck.querySelectorAll(".slot")];
  const prevBtn = document.querySelector(".zayn-hero .prev");
  const nextBtn = document.querySelector(".zayn-hero .next");

  let index = Math.floor(slots.length / 2);
  let timer = null;
  const INTERVAL = 3800;

  function applyClasses() {
    const n = slots.length;
    slots.forEach(s => (s.className = "slot"));
    for (let i = 0; i < n; i++) {
      let d = i - index;
      if (d > n / 2) d -= n;
      if (d < -n / 2) d += n;

      if (d === 0) slots[i].classList.add("is-center");
      else if (d === -1) slots[i].classList.add("is-near-left");
      else if (d === 1) slots[i].classList.add("is-near-right");
      else if (d < -1) slots[i].classList.add("is-far-left");
      else if (d > 1) slots[i].classList.add("is-far-right");
    }
  }

  const goTo = (i) => { index = (i + slots.length) % slots.length; applyClasses(); };
  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);
  const start = () => { stop(); timer = setInterval(next, INTERVAL); };
  const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

  applyClasses(); start();

  nextBtn?.addEventListener("click", () => { stop(); next(); start(); });
  prevBtn?.addEventListener("click", () => { stop(); prev(); start(); });

  deck.addEventListener("mouseenter", stop);
  deck.addEventListener("mouseleave", start);

  let x0 = null;
  deck.addEventListener("pointerdown", (e) => { x0 = e.clientX; stop(); deck.setPointerCapture?.(e.pointerId); });
  deck.addEventListener("pointerup", (e) => {
    if (x0 === null) return;
    const dx = e.clientX - x0;
    if (Math.abs(dx) > 40) (dx < 0 ? next() : prev());
    x0 = null; start();
  });

  document.addEventListener("visibilitychange", () => document.hidden ? stop() : start());
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) stop();
})();