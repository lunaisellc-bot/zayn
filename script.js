const state = {
  lang: 'tr', // default TR per user preference
  products: []
};

function $(sel){ return document.querySelector(sel); }
function $all(sel){ return Array.from(document.querySelectorAll(sel)); }

async function loadProducts(){
  const res = await fetch('products.json');
  state.products = await res.json();
  renderProducts();
}

function setLang(lang){
  state.lang = lang;
  // toggle active button
  $all('.lang-toggle button').forEach(b=>b.classList.remove('active'));
  document.querySelector(`[data-lang="${lang}"]`).classList.add('active');
  // swap text
  const tr = lang === 'tr';
  $('[data-i18n="hero_title"]').textContent = tr ?
    'Modern · Zamansız · ZAYN' :
    'Modern · Timeless · ZAYN';
  $('[data-i18n="hero_sub"]').textContent = tr ?
    'Zara / COS estetiğinde minimal, yüksek moda silüetleri. Baskı sanatı ile birleşen zamansız şıklık.' :
    'Minimal, high‑fashion silhouettes with a Zara / COS aesthetic. Timeless elegance meets print artistry.';
  $('[data-i18n="cta_shop"]').textContent = tr ? 'Etsy’de İncele' : 'Shop on Etsy';
  $('[data-i18n="cta_contact"]').textContent = tr ? 'İletişim' : 'Contact';
  $('[data-i18n="sec_new"]').textContent = tr ? 'Yeni Koleksiyon' : 'New Collection';
  $('[data-i18n="sec_about"]').textContent = tr ? 'Hakkımızda' : 'About';
  $('[data-i18n="about_p"]').textContent = tr ?
    'ZAYN, siyah-beyaz geometrik dil ve modern hatlarla, sınırlı üretim parçaları etik tedarikçilerle çalışarak sunar. Satın alımlar Etsy mağazamıza yönlendirilir.' :
    'ZAYN blends monochrome geometry and modern lines into limited drops, crafted with ethical suppliers. Purchases are routed to our Etsy store.';
  $('[data-i18n="sec_contact"]').textContent = tr ? 'İletişim' : 'Contact';
  $('[data-i18n="contact_p"]').textContent = tr ?
    'Sorularınız için: hello@yourdomain.com • Instagram: @byzaynco' :
    'For inquiries: hello@yourdomain.com • Instagram: @byzaynco';
  renderProducts();
}

function renderProducts(){
  const wrapper = $('.grid');
  if(!wrapper || !state.products.length) return;
  wrapper.innerHTML = '';
  state.products.forEach(p=>{
    const title = state.lang === 'tr' ? p.title_tr : p.title_en;
    const card = document.createElement('article');
    card.className = 'card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.alt || title}" loading="lazy">
      <div class="info">
        <div style="display:flex;justify-content:space-between;gap:12px;align-items:center">
          <h3 style="margin:0;font-weight:600">${title}</h3>
          <span class="price">${p.price || ''}</span>
        </div>
      </div>
      <div class="etsy">
        <span class="badge">${state.lang==='tr' ? 'Satın alma Etsy’de' : 'Purchases on Etsy'}</span>
        <a href="${p.etsy_url}" target="_blank" rel="noopener">${state.lang==='tr' ? 'Etsy’de Aç' : 'Open Etsy'}</a>
      </div>
    `;
    wrapper.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadProducts();
  setLang('tr');
  $all('.lang-toggle button').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
});