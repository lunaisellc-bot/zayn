/* ZAYN ARTIST SYSTEM */

const DATA_PRODUCTS = "assets/data/products.json";
const DATA_REVIEWS  = "assets/data/reviews.json";
const ETSY_FALLBACK = "https://www.etsy.com/shop/ZaynCollective"; 

// --- Helper Functions ---
const qs = (s) => document.querySelector(s);
const qsa = (s) => document.querySelectorAll(s);

// Reveal Animation on Scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.classList.add('active');
    }
  });
}, { threshold: 0.1 });

function initReveal() {
  qsa('.reveal').forEach(el => observer.observe(el));
}

// Format Price
function formatPrice(amount, currency) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "";
  const normalized = n > 999 ? (n / 100.0) : n; 
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(normalized);
}

// Bind Global Links
function bindLinks(products) {
  const url = (products && products[0] && products[0].url) 
    ? products[0].url.split("/listing/")[0] 
    : ETSY_FALLBACK;
    
  ['navEtsyLink', 'shopEtsyLinkTop', 'shopEtsyLinkBottom', 'finalEtsyLink', 'customEtsyLink'].forEach(id => {
    const el = qs(`#${id}`);
    if(el) el.href = url;
  });
}

// --- Render Logic ---

async function loadApp() {
  initReveal();
  
  // 1. Load Products
  let products = [];
  try {
    const res = await fetch(DATA_PRODUCTS);
    products = await res.json();
  } catch(e) { console.log('Products unavailable'); }

  bindLinks(products);

  // 2. Render Shop if on Shop Page
  const grid = qs('#productsGrid');
  if(grid) {
    renderShop(products, grid);
  }

  // 3. Render Reviews if on Home Page
  const reviewsStrip = qs('#reviewsStrip');
  if(reviewsStrip) {
    renderReviews(reviewsStrip);
  }
}

// --- Shop Page Logic ---
function renderShop(products, grid) {
  const search = qs('#searchInput');
  const catSelect = qs('#categorySelect');
  const empty = qs('#emptyState');

  // Populate Categories
  const cats = [...new Set(products.map(p => p.category || 'Art'))].sort();
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c;
    opt.innerText = c;
    catSelect.appendChild(opt);
  });

  // Check URL Params
  const urlParams = new URLSearchParams(window.location.search);
  const initialCat = urlParams.get('cat');
  if(initialCat && cats.includes(initialCat)) catSelect.value = initialCat;

  function draw() {
    const q = search.value.toLowerCase();
    const c = catSelect.value;
    
    const filtered = products.filter(p => {
      const matchText = (p.title + ' ' + (p.tags||[]).join(' ')).toLowerCase().includes(q);
      const matchCat = c === '__all__' || p.category === c;
      return matchText && matchCat;
    });

    if(filtered.length === 0) {
      grid.innerHTML = '';
      empty.classList.remove('hidden');
    } else {
      empty.classList.add('hidden');
      grid.innerHTML = filtered.map(p => `
        <a href="${p.url}" target="_blank" class="art-card group reveal active">
          <div class="image-frame">
            <img src="${p.image1}" alt="${p.title}" 
                 onmouseenter="this.src='${p.image2 || p.image1}'" 
                 onmouseleave="this.src='${p.image1}'">
            
            ${p.state === 'active' ? '' : '<div class="absolute top-2 right-2 bg-red-900/80 text-white text-[9px] px-2 py-1 uppercase tracking-widest">Sold Out</div>'}
          </div>
          <div class="p-5">
            <div class="text-[10px] text-gold uppercase tracking-[0.2em] mb-2">${p.category || 'Art'}</div>
            <h3 class="font-serif italic text-white text-lg leading-tight mb-2 group-hover:text-gold transition">${p.title}</h3>
            <div class="flex justify-between items-end border-t border-white/10 pt-3 mt-3">
              <span class="text-white/60 text-sm font-light">${formatPrice(p.price, p.currency)}</span>
              <span class="text-[10px] text-white/40 uppercase tracking-widest group-hover:text-white transition">View on Etsy &rarr;</span>
            </div>
          </div>
        </a>
      `).join('');
    }
  }

  search.addEventListener('input', draw);
  catSelect.addEventListener('change', draw);
  draw();
}

// --- Reviews Logic ---
async function renderReviews(container) {
  try {
    const res = await fetch(DATA_REVIEWS);
    const reviews = await res.json();
    
    container.innerHTML = reviews.slice(0, 8).map(r => `
      <div class="review-card flex-shrink-0 w-[350px]">
        <div class="flex text-gold text-[10px] gap-1 mb-3">
          <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
        </div>
        <p class="text-white/80 font-serif italic leading-relaxed text-sm mb-4">"${r.text.substring(0, 120)}..."</p>
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white/50 text-xs font-serif italic">
            ${r.buyer ? r.buyer.charAt(0) : 'G'}
          </div>
          <div>
            <p class="text-xs text-white uppercase tracking-widest">${r.buyer || 'Guest'}</p>
            <p class="text-[10px] text-white/30">verified buyer</p>
          </div>
        </div>
      </div>
    `).join('');

  } catch(e) {
    container.innerHTML = '<p class="text-white/30 text-sm italic">Reviews loading from Etsy...</p>';
  }
}

// Init
document.addEventListener('DOMContentLoaded', loadApp);
