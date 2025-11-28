/* ===== ZAYN 3.0 — Filtered Collection Edition ===== */

const I18N = {
  EN: {
    headlineCycle: ["Luxury doesn’t shout.", "It breathes.", "It pauses.", "It lets you feel."],
    manifesto: ["Not made to impress. Made to express.", "You wear silence, not fabric.", "Designs are geometry; feelings draw the lines.", "Elegance is a pause between two breaths."],
    philosophyH: "Philosophy",
    philosophy: "ZAYN is a house of quiet luxury — a gallery of restraint where geometry meets emotion. We design pauses, spaces, and textures that let you feel more by seeing less.",
    piecesH: "Pieces",
    storyH: "Story",
    story: "Born in Wyoming, carried by silence. ZAYN bridges Eastern sentiment and Western minimalism — crafting pieces that speak softly yet powerfully.",
    enter: "enter zayn",
    etsy: "view on etsy",
    nlH: "Join the world of quiet luxury.",
    nlP: "Be the first to discover new designs, textures, and limited drops.",
    subscribe: "Subscribe",
    thanks: "Thank you — welcome to the world of quiet luxury."
  },
  TR: {
    headlineCycle: ["Lüks bağırmaz.", "Nefes alır.", "Durur.", "Sana hissettirir."],
    manifesto: ["Etkilemek için değil; ifade etmek için üretilir.", "Üzerine sessizliği giyersin, kumaşı değil.", "Tasarım geometridir; çizgileri duygular çizer.", "Zerafet, iki nefes arasındaki duraktır."],
    philosophyH: "Felsefe",
    philosophy: "ZAYN, sessiz lüksün evidir — geometrinin duyguyla buluştuğu bir itidal galerisi. Daha az görerek daha çok hissetmeni sağlayan duraklar, boşluklar ve dokular tasarlarız.",
    piecesH: "Koleksiyon",
    storyH: "Hikâye",
    story: "Wyoming'de doğdu, sessizlikte büyüdü. ZAYN, Doğu'nun hissiyatı ile Batı'nın minimalizmini köprüler — yumuşak ama güçlü konuşan parçalar üretir.",
    enter: "zayn dünyasına gir",
    etsy: "etsy'de gör",
    nlH: "Sessiz lüksün dünyasına katıl.",
    nlP: "Yeni tasarımları, dokuları ve sınırlı serileri ilk keşfeden ol.",
    subscribe: "Abone Ol",
    thanks: "Teşekkürler — sessiz lüks dünyasına hoş geldin."
  }
};

let LANG = "EN";
let allProducts = []; // Ürünleri hafızada tutmak için global değişken
const $ = (q) => document.querySelector(q);

/* --- FILTRELEME MANTIĞI --- */
function filterSelection(category) {
  // 1. Aktif butonun stilini güncelle
  const buttons = document.querySelectorAll('.filter-btn');
  buttons.forEach(btn => {
    btn.classList.remove('text-black', 'border-black');
    btn.classList.add('text-gray-400', 'border-transparent');
  });
  
  // Tıklanan butonu bul ve koyu yap (Basit yöntem: event.target yerine kategoriye göre bulma)
  const clickedBtn = Array.from(buttons).find(b => b.getAttribute('onclick').includes(category));
  if(clickedBtn) {
     clickedBtn.classList.remove('text-gray-400', 'border-transparent');
     clickedBtn.classList.add('text-black', 'border-black');
  }

  // 2. Grid'i temizle ve yeniden çiz
  renderGrid(category);
}

/* --- GRID ÇİZME FONKSİYONU --- */
function renderGrid(filterKey) {
  const grid = $("#grid");
  if (!grid) return;
  grid.innerHTML = "";

  // Kategori kelimeleri (Etsy başlıklarında aranacak kelimeler)
  const keywords = {
    'dress': ['dress', 'gown', 'sundress', 'maxi', 'midi'],
    'top': ['shirt', 'blouse', 'top', 'tunic', 'tee', 'tank'],
    'outerwear': ['coat', 'jacket', 'hoodie', 'sweatshirt', 'cardigan', 'vest', 'bomber'],
    'resort': ['swim', 'bikini', 'beach', 'kaftan', 'kimono', 'cover up', 'cover-up']
  };

  allProducts.forEach(it => {
    const titleEN = (it.titleEN ?? it.title ?? "").toLowerCase();
    
    // Eğer filtre 'all' değilse, kontrol et
    if (filterKey !== 'all') {
       const keys = keywords[filterKey] || [];
       // Ürün başlığında o kategorinin kelimelerinden hiçbiri geçmiyorsa, bu ürünü atla.
       const match = keys.some(k => titleEN.includes(k));
       if (!match) return; 
    }

    // --- BURADAN AŞAĞISI AYNI KART OLUŞTURMA KODU ---
    const title = LANG === "EN" ? (it.titleEN ?? it.title) : (it.titleTR ?? it.title);
    const href = it.href || (it.id ? `https://www.etsy.com/listing/${it.id}` : "https://www.etsy.com/shop/ByZaynCo");
    const img = (it.image && String(it.image).trim()) || (it.images && it.images[0] && (it.images[0].url_fullxfull || it.images[0].url_570xN)) || "data:image/gif;base64,R0lGODlhAQABAAAAACw=";

    const a = document.createElement("a");
    a.href = href;
    a.target = "_blank";
    a.rel = "noopener";
    a.className = "group block mb-12 masonry-item cursor-pointer animate-fade-in"; 

    a.innerHTML = `
      <div class="relative overflow-hidden aspect-[3/4] bg-[#f4f4f4] mb-5 transition-transform duration-700">
          <img src="${img}" alt="${title}" loading="lazy" class="w-full h-full object-cover transition duration-1000 ease-out group-hover:scale-105" />
          <div class="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition duration-500 flex items-center justify-center">
              <span class="bg-white text-black text-[9px] uppercase tracking-[0.2em] px-5 py-3 shadow-xl">
                  ${LANG === 'EN' ? 'View Piece' : 'İncele'}
              </span>
          </div>
      </div>
      <div class="text-center px-2">
          <h3 class="font-serif text-lg leading-snug text-gray-900 group-hover:text-black line-clamp-2" style="text-transform:capitalize;">
              ${title ? title.toLowerCase() : ''} 
          </h3>
          <p class="text-[9px] text-gray-400 uppercase tracking-[0.2em] mt-2">ZAYN Collection</p>
      </div>
    `;
    grid.appendChild(a);
  });
}

/* --- API DATA LOAD --- */
async function loadProducts() {
  try {
    const res = await fetch(`products.json?v=${Date.now().toString().slice(0, 10)}`, { cache: "no-store" });
    allProducts = await res.json(); // Veriyi global değişkene kaydet
    renderGrid('all'); // İlk açılışta hepsini göster
  } catch (e) {
    console.error("products.json error", e);
  }
}

/* --- DİĞER FONKSİYONLAR (Aynı) --- */
function runIntroOnce() { /* Intro kodu aynı kalsın... */ 
  const intro=document.getElementById("zaynIntro"),audio=document.getElementById("introSound"),KEY="zaynIntroPlayed";if(!intro){document.body.classList.remove("pre-reveal");document.body.classList.add("reveal");return}if(sessionStorage.getItem(KEY)==="1"){intro.remove();document.body.classList.remove("pre-reveal");document.body.classList.add("reveal");if(audio)audio.remove();return}let v=0.10;if(audio)audio.volume=v;function fadeTo(t,s=0.07,e=80){const i=setInterval(()=>{v=Math.min(t,v+s);if(audio)audio.volume=v;if(v>=t)clearInterval(i)},e)}function fadeOut(s=0.03,e=80){const i=setInterval(()=>{v=Math.max(0,v-s);if(audio)audio.volume=v;if(v<=0){clearInterval(i);audio&&audio.pause()}},e)}function sch(){const d=(audio&&isFinite(audio.duration)&&audio.duration>0)?audio.duration*1000:3000;setTimeout(()=>fadeOut(),Math.max(0,d-450))}function start(){if(!audio||!audio.paused)return;audio.play().then(()=>{sessionStorage.setItem(KEY,"1");fadeTo(0.55,0.07);if(isFinite(audio.duration)&&audio.duration>0)sch();else audio.addEventListener("loadedmetadata",sch,{once:true});rem()}).catch(()=>{})}const evs=["pointerdown","touchstart","wheel","keydown","scroll","mousemove"];function un(){start()}function rem(){evs.forEach(e=>window.removeEventListener(e,un))}evs.forEach(e=>window.addEventListener(e,un,{once:true,passive:true}));start();const fr=('fonts'in document)?document.fonts.ready:Promise.resolve();Promise.all([fr]).then(()=>{setTimeout(()=>{document.body.classList.remove("pre-reveal");document.body.classList.add("reveal")},1600);setTimeout(()=>{intro.classList.add("hide");intro.addEventListener("transitionend",()=>intro.remove(),{once:true})},2600});
}

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
  if (ul) { ul.innerHTML = ""; I18N[LANG].manifesto.forEach(l => { const li=document.createElement("li");li.className="text-gray-500 text-sm mb-2";li.innerHTML=`<span>${l}</span>`;ul.appendChild(li); }); }
}

let tickerId = null;
function startHeadlineTicker() {
  const h = $("#headline"); if (!h) return; const lines = I18N[LANG].headlineCycle.slice(); let i = 0; if (tickerId) clearInterval(tickerId);
  tickerId = setInterval(() => { i = (i + 1) % lines.length; h.style.opacity = 0; h.style.transform = "translateY(10px)"; setTimeout(() => { h.textContent = lines[i]; h.style.opacity = 1; h.style.transform = "translateY(0)"; }, 220); }, 2400);
}

function initLangToggle() {
  const btn = $("#langToggle"); if (!btn) return;
  btn.textContent = LANG === "EN" ? "TR" : "EN";
  btn.addEventListener("click", async () => { LANG = (LANG === "EN") ? "TR" : "EN"; btn.textContent = (LANG === "EN") ? "TR" : "EN"; applyLang(); startHeadlineTicker(); renderGrid('all'); });
}

function initNewsletter() {
  const form=document.querySelector(".nl"),thanks=$("#nlThanks");if(!form||!thanks)return;form.addEventListener("submit",(e)=>{e.preventDefault();thanks.textContent=I18N[LANG].thanks;setTimeout(()=>{thanks.textContent=""},3500);form.reset()});
}

document.addEventListener("DOMContentLoaded", async () => {
  if(document.getElementById("year")) document.getElementById("year").textContent = new Date().getFullYear();
  runIntroOnce(); applyLang(); startHeadlineTicker(); initLangToggle(); initNewsletter(); await loadProducts();
});