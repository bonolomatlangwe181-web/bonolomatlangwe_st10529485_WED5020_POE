let cart = [];

function toggleCart() {
  document.getElementById('cartSidebar').classList.toggle('active');
  document.getElementById('cartOverlay').classList.toggle('active');
}

function checkoutWhatsApp() {
  let message = "Hi FITHER, I want to order:\n";
  cart.forEach(item => message += `- ${item.name} R${item.price}\n`);
  let total = cart.reduce((sum, item) => sum + item.price, 0);
  message += `Total: R${total}`;
  window.open(`https://wa.me/27814798447?text=${encodeURIComponent(message)}`);
}

// Demo products - you can add more here
const products = [
  {id:1, name:"Luxe Yoga Set", price:899, category:"yoga", img:""},
  {id:2, name:"Run Crop Top", price:499, category:"run", img:""},
  {id:3, name:"Pilates Leggings", price:799, category:"pilates", img:""}
];

function loadProducts() {
  const grid = document.getElementById('productGrid');
  grid.innerHTML = '';
  products.forEach(p => {
    grid.innerHTML += `
      <div class="product">
        <img src="${p.img}" alt="${p.name}">
        <h4>${p.name}</h4>
        <p>R${p.price}</p>
        <button class="btn" onclick="addToCart({name:'${p.name}', price:${p.price}})">Add to Cart</button>
      </div>
    `;
  });
}

function addToCart(product) {
  cart.push(product);
  document.getElementById('cart-count').textContent = cart.length;
  alert(`${product.name} added to cart`);
}

loadProducts();