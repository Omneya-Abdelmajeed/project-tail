let isLoggedIn = localStorage.getItem("loggedIn") === "true"; 
let currentUser = localStorage.getItem("firstName"); 


let cart = JSON.parse(localStorage.getItem("cart")) ;
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];


const products = [
  { id: 1, name: "Leather Watch", price: 400, category: "Watches", image: "images/golden-watch.avif" },
  { id: 2, name: "Golden necklace", price: 150, category: "Necklace", image: "images/golden-neck.avif" },
  { id: 3, name: "Golden Earrings", price: 200, category: "Earrings", image: "images/golden-ear.avif" },
  { id: 4, name: "Brown Watch", price: 350, category: "Watches", image: "images/brown-watch.avif" },
  { id: 5, name: "Silver Set Rings", price: 580, category: "Rings", image: "images/silver-ring.avif" },
  { id: 6, name: "Golden bracelet", price: 100, category: "Bracelet", image: "images/golden-brace.avif" },
  { id: 7, name: "Set Necklace", price: 500, category: "Necklace", image: "images/set.avif" },
  { id: 8, name: "Silver Earrings", price: 300, category: "Earrings", image: "images/silver-ear.avif" },
  { id: 9, name: "Golden necklace", price: 150, category: "Necklace", image: "images/golden-neck.avif" }
];

const navActions = document.getElementById('nav-actions');
const cartContainer = document.getElementById('cart-container');
const totalPriceElement = document.getElementById('total-price');
const favoritesContainer = document.getElementById('favorites-container');

function renderHeader() {
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  if (isLoggedIn) {
    navActions.innerHTML = `
      <div class="flex items-center gap-6 text-gray-700">
        <span class="text-sm">Hello, <span class="font-semibold text-black">${currentUser}</span></span>
        
        <a href="cart.html" class="flex items-center gap-1.5 hover:text-black transition text-sm">
          <i class="fa-solid fa-cart-shopping text-blue-500"></i>
          <span class="text-blue-500 font-bold">${cartCount}</span>
        </a>

        <button id="logout-btn" class="border border-red-500 text-red-500 hover:bg-red-50 px-4 py-1.5 rounded transition text-sm">
          Logout
        </button>
      </div>
    `;

   
    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem("loggedIn");
      window.location.href = "index.html";
    });
  } else {
    navActions.innerHTML = `
      <div class="flex items-center gap-2">
        <a href="login.html" class="border border-blue-500 text-blue-500 hover:bg-blue-50 px-4 py-1.5 rounded transition font-medium text-sm">Login</a>
        <a href="register.html" class="border border-green-500 text-green-500 hover:bg-green-50 px-4 py-1.5 rounded transition font-medium text-sm">Register</a>
      </div>
    `;
  }
}


function renderCartPage() {
  if (!cartContainer) return;
  
  if (cart.length === 0) {
    cartContainer.innerHTML = `<p class="col-span-full text-center text-gray-400 py-12">Your cart is empty.</p>`;
    totalPriceElement.textContent = "Total Price: $0.00";
    return;
  }

 
  cartContainer.innerHTML = cart.map(item => `
    <div class="bg-white border border-gray-200 rounded-md p-6 flex items-center gap-6 shadow-sm hover:shadow-md transition relative">
      <div class="w-32 h-32 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
        <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover">
      </div>

      <div class="flex-grow flex flex-col justify-between h-32">
        <div>
          <h3 class="text-xl font-medium text-gray-900">${item.name}</h3>
          <p class="text-sm text-gray-500 mt-1">Category: ${item.category}</p>
          <p class="text-sm text-gray-700 mt-1">Price: $${item.price}</p>
        </div>

        <div class="flex items-center gap-4 mt-2">
          <div class="flex items-center border border-gray-400 rounded bg-white overflow-hidden">
            <button onclick="updateCartQuantity(${item.id}, -1)" class="px-2.5 py-1 hover:bg-gray-100 text-gray-500 font-semibold focus:outline-none">-</button>
            <span class="px-3 text-sm font-semibold text-gray-800">${item.quantity}</span>
            <button onclick="updateCartQuantity(${item.id}, 1)" class="px-2.5 py-1 hover:bg-gray-100 text-gray-500 font-semibold focus:outline-none">+</button>
          </div>

          <button onclick="removeCartItem(${item.id})" class="bg-[#DC3545] hover:bg-red-700 text-white px-5 py-1.5 rounded text-sm font-medium transition">
            Remove from Cart
          </button>
        </div>
      </div>
    </div>
  `).join('');


  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  totalPriceElement.textContent = `Total Price: $${total.toFixed(2)}`;
}

function renderFavorites() {
  if (!favoritesContainer) return;

  if (favorites.length === 0) {
    favoritesContainer.innerHTML = `<p class="col-span-full text-center text-gray-400 py-8">No favorite items selected yet.</p>`;
    return;
  }

  const favoritedProducts = products.filter(p => favorites.includes(p.id));

  favoritesContainer.innerHTML = favoritedProducts.map(product => `
    <div class="bg-white border border-gray-250 rounded-md p-5 flex flex-col items-center hover:shadow-sm transition">
      <div class="w-full h-56 bg-gray-50 rounded overflow-hidden mb-4">
        <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
      </div>
      <h4 class="text-lg font-medium text-gray-800">${product.name}</h4>
      <p class="text-xs text-gray-500 mt-1">Category: ${product.category}</p>
      
      <button onclick="removeFavorite(${product.id})" class="mt-4 text-red-500 hover:scale-110 transition text-lg focus:outline-none">
        <i class="fa-solid fa-heart"></i>
      </button>
    </div>
  `).join('');
}

window.updateCartQuantity = function(productId, amount) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;

  item.quantity += amount;
  if (item.quantity < 1) {
    item.quantity = 1;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderHeader();
  renderCartPage();
};

window.removeCartItem = function(productId) {
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderHeader();
  renderCartPage();
};

window.removeFavorite = function(productId) {
  favorites = favorites.filter(id => id !== productId);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  renderFavorites();
};

renderHeader();
renderCartPage();
renderFavorites();
