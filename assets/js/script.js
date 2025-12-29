document.addEventListener("DOMContentLoaded", () => {
    
    // --- 1. SMOOTH SCROLL (LENIS) ---
    // Sayfanın yağ gibi kaymasını sağlayan teknoloji
    const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smooth: true });
    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // --- 2. PRELOADER & GİRİŞ ANİMASYONLARI ---
    const preloader = document.getElementById('preloader');
    if(preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.style.opacity = '0';
                setTimeout(() => { 
                    preloader.remove(); 
                    
                    // GSAP Animasyonları Başlasın
                    gsap.to(".anim-hero", { y: 0, opacity: 1, duration: 1.5, stagger: 0.2, ease: "power3.out" });
                    gsap.to("#hero-img", { scale: 1, duration: 2.5, ease: "power2.out" });
                    
                    // ScrollTrigger ile "Philosophy" bölümü animasyonu
                    gsap.registerPlugin(ScrollTrigger);
                    gsap.from(".reveal-text", {
                        scrollTrigger: { trigger: "#philosophy", start: "top 70%" },
                        y: 50, opacity: 0, duration: 1.5, ease: "power3.out"
                    });
                    gsap.from(".reveal-image", {
                        scrollTrigger: { trigger: "#philosophy", start: "top 70%" },
                        y: 50, opacity: 0, duration: 1.5, delay: 0.2, ease: "power3.out"
                    });

                }, 800);
            }, 1000);
        });
    }

    // --- 3. CUSTOM CURSOR HAREKETİ ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorCircle = document.querySelector('.cursor-circle');
    if (window.matchMedia("(min-width: 768px)").matches && cursorDot) {
        window.addEventListener('mousemove', (e) => {
            cursorDot.style.left = `${e.clientX}px`;
            cursorDot.style.top = `${e.clientY}px`;
            // Daire biraz geriden gelsin (Akıcılık hissi)
            cursorCircle.animate({ left: `${e.clientX}px`, top: `${e.clientY}px` }, { duration: 500, fill: "forwards" });
        });
    }

    // --- 4. ETSY VERİLERİNİ ÇEKME & İŞLEME ---
    const productsUrl = "assets/data/products.json";
    const reviewsUrl = "assets/data/reviews.json";
    const grid = document.getElementById("product-grid");
    const filterContainer = document.getElementById("category-filters");
    const reviewsMarquee = document.getElementById("reviews-marquee");

    // ÜRÜNLERİ GETİR
    fetch(productsUrl)
        .then(res => res.json())
        .then(products => {
            grid.innerHTML = ""; // Yükleniyor yazısını kaldır
            const categories = new Set();

            products.forEach(item => {
                // Kategori temizliği
                let cat = item.category || "Collection";
                categories.add(cat);

                // Ürün Kartı (Tailwind Tasarımı)
                const card = document.createElement("div");
                card.className = "product-card group cursor-pointer relative";
                card.dataset.category = cat;

                // Görsel Mantığı (Hover'da 2. resim)
                let imgHTML = `<img src="${item.image1}" class="w-full h-full object-cover transition duration-700 group-hover:scale-105 filter grayscale group-hover:grayscale-0">`; // Varsayılan Siyah Beyaz -> Renkli
                if(item.image2) {
                    imgHTML = `
                        <img src="${item.image1}" class="absolute inset-0 w-full h-full object-cover transition duration-700 opacity-100 group-hover:opacity-0 filter grayscale">
                        <img src="${item.image2}" class="absolute inset-0 w-full h-full object-cover transition duration-700 opacity-0 scale-105 group-hover:opacity-100 group-hover:scale-100">
                    `;
                }

                card.innerHTML = `
                    <a href="${item.url}" target="_blank" class="block">
                        <div class="relative w-full aspect-[3/4] overflow-hidden bg-gray-100 mb-6">
                            ${imgHTML}
                            <div class="absolute bottom-4 right-4 bg-white/90 px-3 py-1 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition duration-500">
                                View
                            </div>
                        </div>
                        <div class="flex flex-col text-center">
                            <p class="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2">${cat}</p>
                            <h3 class="font-display text-lg leading-tight mb-2 group-hover:text-gray-600 transition">${shorten(item.title, 25)}</h3>
                            <span class="font-serif italic text-lg text-gray-500">${item.price} ${item.currency}</span>
                        </div>
                    </a>
                `;
                grid.appendChild(card);
            });

            // GSAP ile ürünlerin geliş animasyonu
            gsap.from(".product-card", {
                scrollTrigger: { trigger: "#collection", start: "top 80%" },
                y: 50, opacity: 0, duration: 1, stagger: 0.1, ease: "power3.out"
            });

            // Kategori Butonları
            categories.forEach(cat => {
                const btn = document.createElement("button");
                btn.className = "filter-btn text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:text-black transition pb-1";
                btn.textContent = cat;
                btn.onclick = () => filterSelection(cat, btn);
                filterContainer.appendChild(btn);
            });
        })
        .catch(err => {
            console.error(err);
            grid.innerHTML = "<p class='col-span-full text-center'>Collection updating...</p>";
        });

    // YORUMLARI GETİR (MARQUEE SLIDER)
    fetch(reviewsUrl)
        .then(res => res.json())
        .then(reviews => {
            if(!reviewsMarquee || reviews.length === 0) return;
            
            // Sonsuz döngü için diziyi 2-3 kere kopyalayalım
            const loopReviews = [...reviews, ...reviews, ...reviews];

            loopReviews.forEach(rev => {
                const div = document.createElement("div");
                div.className = "inline-block w-[350px] bg-white p-8 border border-gray-100 mx-4 whitespace-normal";
                div.innerHTML = `
                    <div class="text-yellow-500 text-[10px] mb-4 flex gap-1"><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i></div>
                    <p class="font-serif italic text-gray-600 text-lg mb-6 leading-relaxed">"${shorten(rev.text, 100)}..."</p>
                    <p class="font-sans text-[9px] uppercase tracking-widest font-bold text-gray-400">- ${rev.buyer}</p>
                `;
                reviewsMarquee.appendChild(div);
            });
        });

    // --- FONKSİYONLAR ---
    function shorten(str, max) {
        return str && str.length > max ? str.slice(0, max) : str;
    }

    window.filterSelection = function(category, btn) {
        document.querySelectorAll('.filter-btn').forEach(b => {
            b.classList.remove('text-black', 'border-b', 'border-black');
            b.classList.add('text-gray-400');
        });
        if(btn) {
            btn.classList.remove('text-gray-400');
            btn.classList.add('text-black', 'border-b', 'border-black');
        } else {
            document.querySelector('.filter-btn[data-category="all"]').classList.add('text-black', 'border-b', 'border-black');
        }

        const cards = document.getElementsByClassName("product-card");
        for (let i = 0; i < cards.length; i++) {
            if (category === "all" || cards[i].dataset.category === category) {
                gsap.to(cards[i], { opacity: 1, scale: 1, duration: 0.5, display: "block" });
            } else {
                gsap.to(cards[i], { opacity: 0, scale: 0.9, duration: 0.3, onComplete: () => cards[i].style.display = "none" });
            }
        }
    }
});
