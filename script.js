/* ===== ZAYN 2.0 — Minimal interactions (no build) ===== */

// i18n strings
const I18N = {
  EN: {
    headlineCycle: [
      "Luxury doesn’t shout.",
      "It breathes.",
      "It pauses.",
      "It lets you feel."
    ],
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
    headlineCycle: [
      "Lüks bağırmaz.",
      "Nefes alır.",
      "Durur.",
      "Sana hissettirir."
    ],
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
const $$ = (q) => document.querySelectorAll(q);

function setText(el, key){ if(!el) return; el.textContent = I18N[LANG][key]; }

function applyLang(){
  // Headline cycle will be handled by ticker
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

  // manifesto list
  const ul = $("#manifesto");
  ul.innerHTML = "";
  I18N[LANG].manifesto.forEach(line=>{
    const li = document.createElement("li");
    li.className = "muted";
    li.innerHTML = `<span class="dot"></span><span>${line}</span>`;
    ul.appendChild(li);
  });
}

function startHeadlineTicker(){
  const h = $("#headline");
  const lines = I18N[LANG].headlineCycle;
  let i = 0;
  function tick(){
    i = (i+1) % lines.length;
    h.style.opacity = 0;
    h.style.transform = "translateY(10px)";
    setTimeout(()=>{
      h.textContent = lines[i];
      h.style.opacity = 1;
      h.style.transform = "translateY(0)";
    }, 220);
  }
  setInterval(tick, 2400);
}

// load products.json and render tiles
async function loadProducts(){
  try{
    const res = await fetch("products.json", {cache:"no-store"});
    const items = await res.json();
    const grid = $("#grid");
    grid.innerHTML = "";
    items.forEach(it=>{
      const title = LANG === "EN" ? (it.titleEN||it.title) : (it.titleTR||it.title);
      const line  = LANG === "EN" ? (it.lineEN||it.line||"") : (it.lineTR||it.line||"");
      const a = document.createElement("a");
      a.href = it.href || "https://www.etsy.com/shop/ByZaynCo";
      a.target = "_blank";
      a.className = "card-tile";
      a.innerHTML = `
        <div class="tile-doku"></div>
        <div class="tile-meta">
          <div><span class="dot"></span>${title||""}</div>
          <div class="muted" style="font-size:.85rem; margin-top:4px">${line||""}</div>
        </div>`;
      grid.appendChild(a);
    });
  }catch(e){
    console.error("products.json error", e);
  }
}

function initLangToggle(){
  const btn = $("#langToggle");
  btn.addEventListener("click", async ()=>{
    LANG = LANG === "EN" ? "TR" : "EN";
    btn.textContent = LANG === "EN" ? "TR" : "EN";
    applyLang();
    await loadProducts();
  });
}

function initNewsletter(){
  const form = document.querySelector(".nl");
  const thanks = $("#nlThanks");
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    thanks.textContent = I18N[LANG].thanks;
    setTimeout(()=>thanks.textContent="", 3500);
    form.reset();
  });
}

function initAmbient(){
  const btn = $("#ambientBtn");
  const audio = $("#ambientAudio");
  btn.addEventListener("click", ()=>{
    const on = btn.getAttribute("aria-pressed") === "true";
    if(on){
      btn.setAttribute("aria-pressed","false");
      audio.pause();
    }else{
      btn.setAttribute("aria-pressed","true");
      audio.volume = 0.25;
      audio.play().catch(()=>{/* user gesture required until click */});
    }
  });
}

function setYear(){ $("#year").textContent = new Date().getFullYear(); }

document.addEventListener("DOMContentLoaded", async ()=>{
  setYear();
  applyLang();
  startHeadlineTicker();
  initLangToggle();
  initNewsletter();
  initAmbient();
  await loadProducts();
});
