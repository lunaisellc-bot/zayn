document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. PRELOADER (Açılış Ekranını Kapat) ---
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => { preloader.style.display = 'none'; }, 800);
        }, 1500); // 1.5 saniye bekle (Sanatsal duruş için)
    });

    // --- 2. VERİLERİ ÇEKME İŞLEMİ ---
    const productGrid = document.getElementById('product-grid');
    const filterContainer = document.getElementById('filters');
    const reviewsSlider = document.getElementById('reviews-slider');

    // JSON Yolları (GitHub Actions'ın oluşturduğu dosyalar)
    const productsUrl = 'assets/data/products.json';
    const reviewsUrl = 'assets/data/reviews.json';

    // ÜRÜNLERİ GETİR
    fetch(productsUrl)
        .then(res => res.json())
        .then(products => {
            productGrid.innerHTML = ''; // Yükleniyor yazısını sil
            const categories = new Set();

            products.forEach(item => {
                // Kategori topla
                let cat = item.category || "Collection";
                categories.add(cat);

                // Ürün Kartı HTML'i
                const card = document.createElement('div');
                card.className = 'product-card';
                card.dataset.category = cat;

                // 2. Resim Kontrolü
                let imagesHTML = `<img src="${item.image1}" alt="${item.title}" class="img-main">`;
                if(item.image2) {
                    imagesHTML += `<img src="${item.image2}" alt="${item.title}" class="img-hover">`;
                }

                card.innerHTML = `
                    <a href="${item.url}" target="_blank">
                        <div class="img-container">
                            ${imagesHTML}
                        </div>
                        <div class="info">
                            <span class="cat-tag">${cat}</span>
                            <h3 class="title">${shorten(item.title, 35)}</h3>
                            <div class="price">${item.price} ${item.currency}</div>
                        </div>
                    </a>
                `;
                productGrid.appendChild(card);
            });

            // Filtre Butonlarını Oluştur
            categories.forEach(catName => {
                const btn = document.createElement('button');
                btn.className = 'filter-btn';
                btn.innerText = catName;
                btn.dataset.cat = catName;
                btn.onclick = () => filterProducts(catName, btn);
                filterContainer.appendChild(btn);
            });
        })
        .catch(error => {
            console.error('Hata:', error);
            productGrid.innerHTML = '<p style="text-align:center; width:100%;">Collection is loading via Etsy...</p>';
        });

    // YORUMLARI GETİR
    fetch(reviewsUrl)
        .then(res => res.json())
        .then(reviews => {
            if(!reviewsSlider) return;
            reviews.forEach(rev => {
                const div = document.createElement('div');
                div.className = 'review-card';
                div.innerHTML = `
                    <div class="stars">★★★★★</div>
                    <p class="review-text">"${shorten(rev.text, 120)}"</p>
                    <p class="author">- ${rev.buyer}</p>
                `;
                reviewsSlider.appendChild(div);
            });
        });

    // --- YARDIMCI FONKSİYONLAR ---

    // Filtreleme
    function filterProducts(category, btnElement) {
        // Aktif butonu değiştir
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btnElement.classList.add('active');

        // Ürünleri gizle/göster
        const cards = document.querySelectorAll('.product-card');
        cards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    // "All" butonunu tanımla
    const allBtn = document.querySelector('.filter-btn[data-cat="all"]');
    if(allBtn) {
        allBtn.onclick = () => filterProducts('all', allBtn);
    }

    // Metin Kısaltma
    function shorten(text, max) {
        return text && text.length > max ? text.substring(0, max) + '...' : text;
    }
});
