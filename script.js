/* ===== ZAYN 2.0 — Minimal interactions (no build) ===== */

// i18n strings
const I18N = {
  EN: {
    headlineCycle: ["Luxury doesn’t shout.","It breathes.","It pauses.","It lets you feel."],
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
    headlineCycle: ["Lüks bağırmaz.","Nefes alır.","Durur.","Sana hissettirir."],
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
const $  = (q) => document.querySelector(q);

function setText(el, key){ if (el) el.textContent = I18N[LANG][key]; }

function applyLang(){
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
    I18N[LANG].manifesto.forEach(line=>{
      const li = document.createElement("li");
      li.className = "muted";
      li.innerHTML = `<span class="dot"></span><span>${line}</span>`;
      ul.appendChild(li);
    });
  }
}

let tickerId = null;
function startHeadlineTicker(){
  const h = $("#headline"); if (!h) return;
  const lines = I18N[LANG].headlineCycle.slice(); let i = 0;
  if (tickerId) clearInterval(tickerId);
  tickerId = setInterval(()=>{
    i = (i + 1) % lines.length;
    h.style.opacity = 0; h.style.transform = "translateY(10px)";
    setTimeout(()=>{ h.textContent = lines[i]; h.style.opacity = 1; h.style.transform = "translateY(0)"; }, 220);
  }, 2400);
}

/* ---------- Products render (with real <img>) ---------- */
async function loadProducts(){
  try{
    const res = await fetch(`products.json?v=${Date.now().toString().slice(0,10)}`, { cache:"no-store" });
    const items = await res.json();
    const grid = $("#grid");
    if (!grid) return;
    grid.innerHTML = "";

    items.forEach(it=>{
      const title = (LANG === "EN" ? (it.titleEN ?? it.title) : (it.titleTR ?? it.title)) ?? "";
      const line  = (LANG === "EN" ? (it.lineEN ?? it.line) : (it.lineTR ?? it.line)) ?? "";
      const href  = it.href || (it.id ? `https://www.etsy.com/listing/${it.id}` : "#");

      // güvenli resim kaynağı
      const img = (it.image && String(it.image).trim())
               || (it.images && it.images[0] && (it.images[0].url_fullxfull || it.images[0].url_570xN))
               || "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

      const a = document.createElement("a");
      a.href = href; a.target = "_blank"; a.rel = "noopener"; a.className = "card-tile";
      a.innerHTML = `
        <img src="${img}" alt="${title.replace(/"/g,'&quot;')}" loading="lazy"
             style="width:100%;height:auto;display:block;border-radius:12px;margin-bottom:8px">
        <div class="tile-meta">
          <div><span class="dot"></span>${title}</div>
          <div class="muted" style="font-size:.85rem;margin-top:4px">${line}</div>
        </div>`;
      grid.appendChild(a);
    });
  }catch(e){
    console.error("products.json error", e);
  }
}

/* ---------- UI bits ---------- */
function initLangToggle(){
  const btn = $("#langToggle"); if (!btn) return;
  btn.textContent = LANG === "EN" ? "TR" : "EN";
  btn.addEventListener("click", async ()=>{
    LANG = (LANG === "EN") ? "TR" : "EN";
    btn.textContent = (LANG === "EN") ? "TR" : "EN";
    applyLang(); startHeadlineTicker(); await loadProducts();
  });
}

function initNewsletter(){
  const form = document.querySelector(".nl"); const thanks = $("#nlThanks"); if (!form || !thanks) return;
  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    thanks.textContent = I18N[LANG].thanks;
    setTimeout(()=>{ thanks.textContent = ""; }, 3500);
    form.reset();
  });
}

function setYear(){ const y = $("#year"); if (y) y.textContent = new Date().getFullYear(); }

/* ---------- boot ---------- */
document.addEventListener("DOMContentLoaded", async ()=>{
  setYear(); applyLang(); startHeadlineTicker(); initLangToggle(); initNewsletter();
  await loadProducts();
});