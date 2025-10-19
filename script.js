const translations = {
  tr: {
    hero_title: 'Modern · Zamansız · ZAYN',
    hero_sub: 'Zara / COS estetiğinde minimal, yüksek moda silüetleri. Baskı sanatı ile birleşen zamansız şıklık.',
    cta_shop: 'Etsy’de İncele',
    cta_contact: 'İletişim',
    sec_new: 'Yeni Koleksiyon',
    sec_new_sub: 'Sezonun vazgeçilmezleri: grafik baskılar, heykelsi drapeler, zamansız silüetler.',
    sec_about: 'Hakkımızda',
    about_p: 'ZAYN, siyah-beyaz geometrik dil ve modern hatlarla, sınırlı üretim parçaları etik tedarikçilerle çalışarak sunar. Satın alımlar Etsy mağazamıza yönlendirilir.',
    sec_contact: 'İletişim',
    contact_p: 'Sorularınız için: hello@yourdomain.com • Instagram: @byzaynco',
    view_piece: 'Parçayı Gör',
    product: {
      0: {
        title: 'Monokrom Drapeli Elbise',
        desc: 'Minimal omuz detayı ve yumuşak drapeli etek ile geceye hazır.'
      },
      1: {
        title: 'Grafik Kimono Ceket',
        desc: 'Elde basılmış desenlerle hafif, oversize silüet.'
      },
      2: {
        title: 'Heykelsi Midi Etek',
        desc: 'Asimetrik panellerle hareket eden heykelsi form.'
      },
      3: {
        title: 'Minimalist Tül Bluz',
        desc: 'Katmanlı tül ve zarif kol detaylarıyla şeffaf zarafet.'
      }
    }
  },
  en: {
    hero_title: 'Modern · Timeless · ZAYN',
    hero_sub: 'Minimal, high-fashion silhouettes inspired by Zara / COS. Timeless elegance meets the art of printmaking.',
    cta_shop: 'Explore on Etsy',
    cta_contact: 'Contact',
    sec_new: 'New Collection',
    sec_new_sub: 'Seasonal essentials: graphic prints, sculptural draping, timeless silhouettes.',
    sec_about: 'About',
    about_p: 'ZAYN delivers limited-run pieces through ethical partners, defined by monochrome geometry and modern lines. Purchases are routed to our Etsy storefront.',
    sec_contact: 'Contact',
    contact_p: 'For inquiries: hello@yourdomain.com • Instagram: @byzaynco',
    view_piece: 'View Piece',
    product: {
      0: {
        title: 'Monochrome Draped Dress',
        desc: 'Minimal shoulders and a fluid draped skirt for night silhouettes.'
      },
      1: {
        title: 'Graphic Kimono Jacket',
        desc: 'Lightweight oversized profile with hand-pressed motifs.'
      },
      2: {
        title: 'Sculptural Midi Skirt',
        desc: 'Asymmetric panels move with sculptural precision.'
      },
      3: {
        title: 'Minimalist Tulle Blouse',
        desc: 'Layered tulle and delicate sleeve details for sheer ease.'
      }
    }
  }
};

const collection = [
  {
    image: 'https://images.unsplash.com/photo-1551360021-0ff81fe67c0d?q=80&w=1600&auto=format&fit=crop',
    alt: 'Black and white draped dress on a model',
    link: 'https://www.etsy.com/shop/ByZaynCo'
  },
  {
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1600&auto=format&fit=crop',
    alt: 'Kimono jacket with graphic prints',
    link: 'https://www.etsy.com/shop/ByZaynCo'
  },
  {
    image: 'https://images.unsplash.com/photo-1612336307429-8a898d44bfa1?q=80&w=1600&auto=format&fit=crop',
    alt: 'Sculptural midi skirt detail',
    link: 'https://www.etsy.com/shop/ByZaynCo'
  },
  {
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1600&auto=format&fit=crop',
    alt: 'Sheer tulle blouse styling',
    link: 'https://www.etsy.com/shop/ByZaynCo'
  }
];

const grid = document.querySelector('.grid');
const langButtons = document.querySelectorAll('.lang-toggle button');
let activeLang = 'tr';

function renderCollection(lang) {
  grid.innerHTML = '';
  collection.forEach((item, index) => {
    const card = document.createElement('article');
    card.className = 'card';
    card.setAttribute('role', 'listitem');

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.alt;

    const title = document.createElement('h3');
    title.textContent = translations[lang].product[index].title;

    const desc = document.createElement('p');
    desc.textContent = translations[lang].product[index].desc;

    const link = document.createElement('a');
    link.href = item.link;
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = translations[lang].view_piece;

    card.append(img, title, desc, link);
    grid.append(card);
  });
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  activeLang = lang;
  document.documentElement.lang = lang;

  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });

  langButtons.forEach((button) => {
    const isActive = button.dataset.lang === lang;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });

  renderCollection(lang);
}

langButtons.forEach((button) => {
  button.addEventListener('click', () => setLanguage(button.dataset.lang));
});

// initial render
document.addEventListener('DOMContentLoaded', () => {
  renderCollection(activeLang);
});
