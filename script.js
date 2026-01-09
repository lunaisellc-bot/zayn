// ZAYN V4 - BOHEMIAN JS
// (Mantık aynı, sadece sınıflar ve render fonksiyonları yeni tasarıma uyarlandı)

const DATA_PRODUCTS = "assets/data/products.json";
const DATA_REVIEWS  = "assets/data/reviews.json";
const ETSY_FALLBACK = "https://www.etsy.com/shop/ZaynCollective"; 

const qs = (s) => document.querySelector(s);

// Format Price
function formatPrice(amount, currency) {
  const n = Number(amount);
  if (!Number.isFinite(n)) return "";
  const normalized = n > 999 ? (n / 100.0) : n; 
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency || 'USD' }).format(normalized);
}

// Bind Links
function bindLinks(products) {
  const url = (products && products[0] && products[0].url) 
    ? products[0].url.split("/listing/")[0] 
    : ETSY_FALLBACK;
  ['navEtsyLink', 'shopEtsyLinkTop', 'shopEtsyLinkBottom', 'customEtsyLink'].forEach(id => {
    const el = qs(`#${id}`);
    if(el) el.href = url;
  });
}

async function loadApp() {
  let products = [];
  try {
    const res = await fetch(DATA_PRODUCTS);
    products = await res.json();
  } catch(e) { console.log('Products unavailable'); }
  bindLinks(products);

  const grid = qs('#productsGrid');
  if(grid) renderShop(products, grid);

  // Reviews (Ana sayfada varsa)
  const reviewsContainer = qs('#reviewsStrip');
  if(reviewsContainer) renderReviews(reviewsContainer);
}

// --- Shop Render (Yeni Boho Kartlar) ---
function renderShop(products, grid) {
  // (Filtreleme mantığı öncekiyle aynı, sadece HTML çıktısı değişti)
  const search = qs('#searchInput');
  const catSelect = qs('#categorySelect');
  
  const cats = [...new Set(products.map(p => p.category || 'Art'))].sort();
  cats.forEach(c => {
    const opt = document.createElement('option');
    opt.value = c; opt.innerText = c; catSelect.appendChild(opt);
  });

  function draw() {
    const q = search.value.toLowerCase();
    const c = catSelect.value;
    const filtered = products.filter(p => {
      const matchText = (p.title + ' ' + (p.tags||[]).join(' ')).toLowerCase().includes(q);
      const matchCat = c === '__all__' || p.category === c;
      return matchText && matchCat;
    });

    grid.innerHTML = filtered.map(p => `
      <a href="${p.url}" target="_blank" class="product-card-boho group block relative">
        <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-4 bg-rose/60 rotate-[-2deg] z-20" style="clip-path: polygon(0% 0%, 100% 2%, 98% 100%, 2% 98%);"></div>

        <div class="relative aspect-[3/4] overflow-hidden mb-4">
          <img src="${p.image1}" alt="${p.title}" class="w-full h-full object-cover"
               onmouseenter="this.src='${p.image2 || p.image1}'" 
               onmouseleave="this.src='${p.image1}'">
          ${p.state !== 'active' ? '<div class="absolute top-2 right-2 bg-ink text-paper text-[9px] px-2 py-1 uppercase tracking-widest font-bold">Tükendi</div>' : ''}
        </div>
        <div class="text-center">
          <div class="text-[10px] text-ink/50 uppercase tracking-[0.2em] mb-1 font-sans">${p.category || 'Koleksiyon'}</div>
          <h3 class="font-serif text-xl italic text-ink group-hover:text-rose transition leading-tight mb-2">${p.title}</h3>
          <div class="text-rose font-sans text-sm font-bold tracking-widest">${formatPrice(p.price, p.currency)}</div>
        </div>
      </a>
    `).join('');
    
    if(filtered.length === 0) grid.innerHTML = '<p class="col-span-full text-center text-ink/50 italic font-serif text-xl">Aradığınız parça şu an sandıkta yok...</p>';
  }

  search.addEventListener('input', draw);
  catSelect.addEventListener('change', draw);
  draw();
}

// --- Reviews Render (El Yazısı Notlar) ---
async function renderReviews(container) {
  try {
    const res = await fetch(DATA_REVIEWS);
    const reviews = await res.json();
    container.innerHTML = reviews.slice(0, 3).map(r => `
      <div class="bg-paper p-6 shadow-md border border-ink/5 relative rotate-[-1deg] md:rotate-[${Math.random() > 0.5 ? 1 : -1}deg]">
        <i class="fa-solid fa-thumbtack absolute -top-2 left-1/2 -translate-x-1/2 text-ink/30 text-xl"></i>
        <p class="font-serif italic text-xl text-ink mb-4 leading-relaxed relative z-10">
          <span class="font-script text-4xl text-rose/40 absolute -top-4 -left-2">"</span>
          ${r.text}
        </p>
        <p class="font-script text-xl text-rose text-right">- ${r.buyer || 'Bir Sanatsever'}</p>
      </div>
    `).join('');
  } catch(e) { container.innerHTML = '...'; }
}

document.addEventListener('DOMContentLoaded', loadApp);
