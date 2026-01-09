// ZAYN V3 JS - Aynen kalabilir, sadece review render kısmını güncelledim

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
    
  const linkIds = ['navEtsyLink', 'shopEtsyLinkTop', 'shopEtsyLinkBottom', 'finalEtsyLink', 'customEtsyLink'];
  linkIds.forEach(id => {
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
        <a href="${p.url}" target="_blank" class="product-card-vintage group reveal active block">
          <div class="relative aspect-[3/4] overflow-hidden bg-[#1a1a1a] mb-4 border border-white/5">
            <img src="${p.image1}" alt="${p.title}" class="w-full h-full object-cover"
                 onmouseenter="this.src='${p.image2 || p.image1}'" 
                 onmouseleave="this.src='${p.image1}'">
            ${p.state !== 'active' ? '<div class="absolute top-2 right-2 bg-rose text-white text-[9px] px-2 py-1 uppercase tracking-widest">Sold</div>' : ''}
          </div>
          <div>
            <div class="text-[10px] text-white/40 uppercase tracking-[0.2em] mb-1">${p.category || 'Art'}</div>
            <h3 class="font-serif text-xl italic text-paper group-hover:text-gold transition leading-tight mb-2">${p.title}</h3>
            <div class="text-gold font-sans text-sm tracking-widest">${formatPrice(p.price, p.currency)}</div>
          </div>
        </a>
      `).join('');
    }
  }

  search.addEventListener('input', draw);
  catSelect.addEventListener('change', draw);
  draw();
}

// --- Reviews Logic (Daha sade, alt alta liste) ---
async function renderReviews(container) {
  try {
    const res = await fetch(DATA_REVIEWS);
    const reviews = await res.json();
    
    // Sadece ilk 3 yorumu gösterelim, çok kalabalık olmasın
    container.innerHTML = reviews.slice(0, 3).map(r => `
      <div class="review-card-vintage reveal">
        <p class="font-serif italic text-xl text-white/80 mb-4 leading-relaxed">${r.text}</p>
        <div class="flex items-center gap-3">
            <div class="h-px w-8 bg-gold/50"></div>
            <p class="text-xs uppercase tracking-widest text-gold">${r.buyer || 'Art Lover'}</p>
        </div>
      </div>
    `).join('');

  } catch(e) {
    container.innerHTML = '<p class="text-white/30 text-sm italic">Reviews loading...</p>';
  }
}

// Init
document.addEventListener('DOMContentLoaded', loadApp);
