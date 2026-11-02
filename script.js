(function () {
  'use strict';

  let cart = JSON.parse(localStorage.getItem('hf_cart') || '[]');
  let wishlist = JSON.parse(localStorage.getItem('hf_wish') || '[]');

  const products = [
    { id: 1, name: "Luxe Yoga Set", price: 899, badge: "New", category: "womens", img: "pictures/product-1.jpg" },
    { id: 2, name: "Run Crop Top", price: 499, badge: "Sale", category: "new", img: "pictures/product-2.jpg" },
    { id: 3, name: "Pilates Leggings", price: 799, badge: "", category: "best", img: "pictures/product-3.jpg" },
    { id: 4, name: "Tennis Skort", price: 649, badge: "New", category: "tennis", img: "pictures/product-4.jpg" },
    { id: 5, name: "Seamless Sports Bra", price: 399, badge: "", category: "best", img: "pictures/product-5.jpg" },
    { id: 6, name: "Studio Hoodie", price: 1099, badge: "Best Seller", category: "sweatshirts", img: "pictures/product-6.jpg" },
    { id: 7, name: "Training Shorts", price: 449, badge: "", category: "new", img: "pictures/product-7.jpg" },
    { id: 8, name: "Ribbed Tank", price: 349, badge: "Sale", category: "sweatshirts", img: "pictures/product-8.jpg" },
    { id: 9, name: "High-Waist Leggings", price: 699, badge: "New", category: "womens", img: "pictures/product-9.jpg" },
    { id: 10, name: "Court Dress", price: 1199, badge: "", category: "tennis", img: "pictures/product-10.jpg" },
    { id: 11, name: "Oversized Crewneck", price: 899, badge: "Best Seller", category: "sweatshirts", img: "pictures/product-11.jpg" },
    { id: 12, name: "Performance Tank", price: 549, badge: "", category: "best", img: "pictures/product-12.jpg" }
  ];

  function renderProducts(filter, category) {
    const grid = document.getElementById('productGrid');
    const noResults = document.getElementById('noResults');
    if (!grid) return;

    let filtered = products;
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }
    const term = (filter || '').toLowerCase().trim();
    if (term) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(term));
    }

    grid.innerHTML = filtered.map(p => `
      <article class="product" data-id="${p.id}">
        <div class="product-img-wrap">
          <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.style.display='none'">
          ${p.badge ? `<span class="product-badge">${p.badge}</span>` : ''}
          <button class="wish-btn ${wishlist.includes(p.id) ? 'active' : ''}" onclick="toggleWish(${p.id})" aria-label="Add to wishlist">&#9829;</button>
        </div>
        <div class="product-info">
          <h4>${p.name}</h4>
          <p class="price">R${p.price}</p>
          <button class="btn" onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
      </article>
    `).join('');

    if (noResults) noResults.hidden = filtered.length !== 0;
  }

  window.searchProducts = function (value) {
    const cat = document.body.getAttribute('data-category') || '';
    renderProducts(value, cat);
  };

  window.addToCart = function (id) {
    const product = products.find(p => p.id === id);
    if (!product) return;
    const existing = cart.find(i => i.id === id);
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ id: product.id, name: product.name, price: product.price, img: product.img, qty: 1 });
    }
    saveCart();
    updateCart();
    flashCart();
  };

  window.changeQty = function (id, delta) {
    const item = cart.find(i => i.id === id);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) {
      cart = cart.filter(i => i.id !== id);
    }
    saveCart();
    updateCart();
  };

  window.removeItem = function (id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCart();
  };

  function saveCart() {
    localStorage.setItem('hf_cart', JSON.stringify(cart));
  }

  function updateCart() {
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

    const countEl = document.getElementById('cart-count');
    if (countEl) {
      countEl.textContent = count;
      countEl.setAttribute('data-count', count);
    }

    const totalEl = document.getElementById('cartTotal');
    if (totalEl) totalEl.textContent = total.toLocaleString('en-ZA');

    const itemsEl = document.getElementById('cartItems');
    if (!itemsEl) return;

    if (cart.length === 0) {
      itemsEl.innerHTML = '<p class="cart-empty">Your cart is empty.</p>';
      return;
    }

    itemsEl.innerHTML = cart.map(i => `
      <div class="cart-item">
        <div class="cart-item-img"><img src="${i.img}" alt="${i.name}" onerror="this.style.display='none'"></div>
        <div class="cart-item-detail">
          <h4>${i.name}</h4>
          <p class="price">R${(i.price * i.qty).toLocaleString('en-ZA')}</p>
          <div class="qty-controls">
            <button onclick="changeQty(${i.id}, -1)" aria-label="Decrease">&minus;</button>
            <span>${i.qty}</span>
            <button onclick="changeQty(${i.id}, 1)" aria-label="Increase">+</button>
          </div>
          <button class="remove-item" onclick="removeItem(${i.id})">Remove</button>
        </div>
      </div>
    `).join('');
  }

  function flashCart() {
    const btn = document.querySelector('.cart-toggle');
    if (!btn) return;
    btn.style.transform = 'scale(1.25)';
    setTimeout(() => { btn.style.transform = ''; }, 200);
  }

  window.toggleCart = function () {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (!sidebar || !overlay) return;
    const active = sidebar.classList.toggle('active');
    overlay.classList.toggle('active', active);
    sidebar.setAttribute('aria-hidden', !active);
    document.body.style.overflow = active ? 'hidden' : '';
  };

  window.toggleWish = function (id) {
    const idx = wishlist.indexOf(id);
    if (idx > -1) {
      wishlist.splice(idx, 1);
    } else {
      wishlist.push(id);
    }
    localStorage.setItem('hf_wish', JSON.stringify(wishlist));
    const el = document.getElementById('wishCount');
    if (el) {
      el.textContent = wishlist.length;
      el.setAttribute('data-count', wishlist.length);
    }
    const cat = document.body.getAttribute('data-category') || '';
    renderProducts('', cat);
  };

  window.toggleMobileMenu = function () {
    const nav = document.getElementById('mobileNav');
    const overlay = document.getElementById('navOverlay');
    const toggle = document.querySelector('.menu-toggle');
    if (!nav || !overlay) return;
    const active = nav.classList.toggle('active');
    overlay.classList.toggle('active', active);
    nav.setAttribute('aria-hidden', !active);
    if (toggle) toggle.setAttribute('aria-expanded', active);
    document.body.style.overflow = active ? 'hidden' : '';
  };

  window.toggleSearch = function () {
    const bar = document.getElementById('searchBar');
    if (!bar) return;
    bar.classList.toggle('active');
    const input = document.getElementById('searchInput');
    if (bar.classList.contains('active') && input) {
      setTimeout(() => input.focus(), 100);
    } else if (input) {
      input.value = '';
      const cat = document.body.getAttribute('data-category') || '';
      renderProducts('', cat);
    }
  };

  window.checkoutWhatsApp = function () {
    if (cart.length === 0) {
      alert('Your cart is empty. Add some products first!');
      return;
    }
    let message = "Hi Her Fitness, I'd like to order:\n\n";
    cart.forEach(item => {
      message += `\u2022 ${item.name} (x${item.qty}) \u2014 R${(item.price * item.qty).toLocaleString('en-ZA')}\n`;
    });
    const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
    message += `\nTotal: R${total.toLocaleString('en-ZA')}`;
    window.open(`https://wa.me/27814798447?text=${encodeURIComponent(message)}`, '_blank');
  };

  window.submitContactForm = function (e) {
    e.preventDefault();
    const form = e.target;
    const name = form.querySelector('[name="name"]').value;
    const email = form.querySelector('[name="email"]').value;
    const msg = form.querySelector('[name="message"]').value;
    const text = `Hi Her Fitness,\n\nName: ${name}\nEmail: ${email}\n\n${msg}`;
    window.open(`https://wa.me/27814798447?text=${encodeURIComponent(text)}`, '_blank');
    form.reset();
    return false;
  };

  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });
  }

  function initPage() {
    const cat = document.body.getAttribute('data-category') || '';
    renderProducts('', cat);
    updateCart();
    initBackToTop();

    const wishEl = document.getElementById('wishCount');
    if (wishEl) {
      wishEl.textContent = wishlist.length;
      wishEl.setAttribute('data-count', wishlist.length);
    }
  }

  document.addEventListener('DOMContentLoaded', initPage);
})();
