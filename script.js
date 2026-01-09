/* ZAYN - Botanical Ivory Editorial
   Reads:
   - assets/data/products.json
   - assets/data/reviews.json
*/

const DATA_PRODUCTS = "assets/data/products.json";
const DATA_REVIEWS  = "assets/data/reviews.json";

// Set your Etsy shop URL here (optional). If products.json has url per product, we use that.
// If you want a general shop link, put it here:
const ETSY_SHOP_URL_FALLBACK = ""; // e.g. "https://www.etsy.com/shop/ByZaynCo"

function qs(sel, root=document){ return root.querySelector(sel); }
function qsa(sel, root=document){ return Array.from(root.querySelectorAll(sel)); }

function formatPrice(amount, currency){
  // Etsy API price amount might be in minor units; your workflow uses "amount" directly.
  // If amount looks too large, you can normalize. We'll do a safe heuristic:
  const n = Number(amount);
  if (!Number.isFinite(n)) return "";
  const normalized = n > 999 ? (n / 100.0) : n; // heuristic
  return new Intl.NumberFormat(undefined, { style: "currency", currency: currency || "USD" }).format(normalized);
}

function safeText(s){
  return String(s || "").replace(/\s+/g, " ").trim();
}

async function fetchJSON(url){
  const r = await fetch(url, { cache: "no-store" });
  if (!r.ok) throw new Error(`Failed to fetch ${url} (${r.status})`);
  return await r.json();
}

/* Scroll reveal */
function initReveal(){
  const els = qsa(".reveal");
  if (!els.length) return;

  const io = new IntersectionObserver((entries)=>{
    for (const e of entries){
      if (e.isIntersecting){
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.12 });

  els.forEach(el => io.observe(el));
}

/* Bind Etsy links (nav + final) */
function bindEtsyLinks(products){
  const shopUrl = ETSY_SHOP_URL_FALLBACK || (products && products[0] && products[0].url ? products[0].url.split("/listing/")[0] : "#");
  const ids = ["navEtsyLink", "finalEtsyLink", "shopEtsyLinkTop", "shopEtsyLinkBottom"];
  ids.forEach(id => {
    const a = qs(`#${id}`);
    if (!a) return;
    a.href = shopUrl || "#";
  });
}

/* Reviews strip (home) */
async function renderReviews(){
  const strip = qs("#reviewsStrip");
  if (!strip) return;

  try{
    const data = await fetchJSON(DATA_REVIEWS);
    if (!Array.isArray(data) || data.length === 0){
      const fb = qs("#reviewsFallback");
      if (fb) fb.classList.remove("hidden");
      return;
    }

    strip.innerHTML = data.slice(0, 10).map(r => {
      const text = safeText(r.text);
      const buyer = safeText(r.buyer || "Guest");
      const rating = Number(r.rating || 5);
      const stars = "★★★★★".slice(0, Math.max(0, Math.min(5, rating)));

      return `
        <div class="review-pill">
          <div class="text-xs uppercase tracking-[0.22em] text-[rgba(22,22,22,0.55)]">${stars}</div>
          <div class="review-text mt-3">${escapeHtml(text || "Amazing experience!")}</div>
          <div class="review-meta">
            <span>${escapeHtml(buyer)}</span>
            <span>via Etsy</span>
          </div>
        </div>
      `;
    }).join("");

  }catch(err){
    const fb = qs("#reviewsFallback");
    if (fb) fb.classList.remove("hidden");
  }
}

/* Shop grid */
function escapeHtml(str){
  return String(str || "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

function getQueryParam(name){
  const u = new URL(window.location.href);
  return u.searchParams.get(name);
}

function normalizeCategory(cat){
  const c = safeText(cat);
  if (!c) return "General";
  return c;
}

function productMatches(p, q, category){
  const title = safeText(p.title).toLowerCase();
  const tags  = Array.isArray(p.tags) ? p.tags.join(" ").toLowerCase() : "";
  const cat   = normalizeCategory(p.category);

  const okCat = category === "__all__" || cat === category;
  if (!okCat) return false;

  if (!q) return true;
  const qq = q.toLowerCase();
  return title.includes(qq) || tags.includes(qq);
}

function buildProductCard(p){
  const title = safeText(p.title);
  const price = formatPrice(p.price, p.currency);
  const cat   = normalizeCategory(p.category);
  const url   = safeText(p.url) || "#";
  const img1  = p.image1 || "";
  const img2  = p.image2 || "";

  // hover image swap (if second exists)
  const imgAttr = img2 ? `data-alt="${escapeHtml(img2)}"` : "";
  return `
    <a class="product-card" href="${escapeHtml(url)}" target="_blank" rel="noopener">
      <div class="product-media">
        ${img1 ? `<img src="${escapeHtml(img1)}" alt="${escapeHtml(title)}" ${imgAttr} />` : `<div style="width:100%;height:100%"></div>`}
      </div>
      <div class="product-body">
        <div class="product-title">${escapeHtml(title)}</div>
        <div class="product-meta">
          <span>${escapeHtml(cat)}</span>
          <span>${escapeHtml(price)}</span>
        </div>
        <div class="product-cta link-underline">View on Etsy</div>
      </div>
    </a>
  `;
}

function initHoverSwap(){
  const imgs = qsa(".product-media img[data-alt]");
  imgs.forEach(img => {
    const alt = img.getAttribute("data-alt");
    if (!alt) return;

    const original = img.src;
    const parent = img.closest(".product-card");
    if (!parent) return;

    parent.addEventListener("mouseenter", ()=>{ img.style.opacity = "0.0"; setTimeout(()=>{ img.src = alt; img.style.opacity = "1"; }, 140); });
    parent.addEventListener("mouseleave", ()=>{ img.style.opacity = "0.0"; setTimeout(()=>{ img.src = original; img.style.opacity = "1"; }, 140); });
  });
}

async function renderShop(){
  const grid = qs("#productsGrid");
  if (!grid) return; // not on shop page

  const searchInput = qs("#searchInput");
  const categorySelect = qs("#categorySelect");
  const resultCount = qs("#resultCount");
  const emptyState = qs("#emptyState");
  const clearBtn = qs("#clearFilters");

  let products = [];
  try{
    products = await fetchJSON(DATA_PRODUCTS);
    if (!Array.isArray(products)) products = [];
  }catch(e){
    products = [];
  }

  bindEtsyLinks(products);

  // Build categories
  const cats = Array.from(new Set(products.map(p => normalizeCategory(p.category)))).sort((a,b)=> a.localeCompare(b));
  cats.forEach(c => {
    const opt = document.createElement("option");
    opt.value = c;
    opt.textContent = c;
    categorySelect.appendChild(opt);
  });

  // Apply ?cat=... from url (optional)
  const catParam = getQueryParam("cat");
  if (catParam){
    const decoded = decodeURIComponent(catParam);
    const exists = cats.includes(decoded);
    if (exists) categorySelect.value = decoded;
  }

  function apply(){
    const q = safeText(searchInput.value);
    const cat = categorySelect.value;

    const filtered = products.filter(p => productMatches(p, q, cat));
    resultCount.textContent = `${filtered.length} items`;

    grid.innerHTML = filtered.map(buildProductCard).join("");

    if (filtered.length === 0){
      emptyState.classList.remove("hidden");
    }else{
      emptyState.classList.add("hidden");
    }

    initHoverSwap();
  }

  searchInput.addEventListener("input", apply);
  categorySelect.addEventListener("change", apply);
  clearBtn.addEventListener("click", ()=>{
    searchInput.value = "";
    categorySelect.value = "__all__";
    apply();
  });

  apply();
}

async function initHome(){
  // Home: still bind Etsy links and reviews
  try{
    const products = await fetchJSON(DATA_PRODUCTS);
    bindEtsyLinks(Array.isArray(products) ? products : []);
  }catch(e){
    bindEtsyLinks([]);
  }
  await renderReviews();
}

document.addEventListener("DOMContentLoaded", async ()=>{
  initReveal();

  // Determine page type by existence of shop grid
  const isShop = !!qs("#productsGrid");
  if (isShop){
    await renderShop();
  } else {
    await initHome();
  }
});
