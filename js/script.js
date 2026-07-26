let isLoggedIn = localStorage.getItem("loggedIn") === "true"; 
let currentUser = localStorage.getItem("firstName"); 

const products = [
  {
    id: 1,
    name: "Leather Watch",
    price: 400,
    category: "Watches",
    image: "../images/golden-watch.avif"
  },
  {
    id: 2,
    name: "Golden necklace",
    price: 150,
    category: "Necklace",
    image: "../images/golden-neck.avif"
  },
  {
    id: 3,
    name: "Golden Earrings",
    price: 200,
    category: "Earrings",
    image: "../images/golden-ear.avif"
  },
  {
    id: 4,
    name: "Brown Watch",
    price: 350,
    category: "Watches",
    image: "../images/brown-watch.avif"
  },
  {
    id: 5,
    name: "Silver Set Rings",
    price: 580,
    category: "Rings",
    image: "../images/silver-ring.avif"
  },
  {
    id: 6,
    name: "Golden bracelet",
    price: 100,
    category: "Bracelet",
    image: "../images/golden-brace.avif"
  },
  {
    id: 7,
    name: "Set Necklace",
    price: 500,
    category: "Necklace",
    image: "../images/set.avif"
  },
  {
    id: 8,
    name: "Silver Earrings",
    price: 300,
    category: "Earrings",
    image: "../images/silver-ear.avif"
  },
  {
    id: 9,
    name: "Golden set necklace",
    price: 300,
    category: "Necklace",
    image: "../images/golden-neck.avif"
  }
];


let rawCart = JSON.parse(localStorage.getItem("cart")) || [];
let cart = rawCart.filter(cartItem => {
  return products.some(prod => prod.id === cartItem.id);
});
localStorage.setItem("cart", JSON.stringify(cart));

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const navActions = document.getElementById('nav-actions');
const productGrid = document.getElementById('product-grid');
const searchType = document.getElementById('search-type');
const searchInput = document.getElementById('search-input');
const searchForm = document.getElementById('search-form');

let isCartOpen = false;

function renderHeader() {
  if (isLoggedIn) {
  
    const cartCount = cart && cart.length > 0 
      ? cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0) 
      : 0;

    
    const totalPrice = cart && cart.length > 0 
      ? cart.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0) 
      : 0;

    let cartDropdownContentHTML = '';
    
    if (!cart || cart.length === 0) {
      cartDropdownContentHTML = `
        <p class="text-xs text-gray-500 text-left py-2 px-1">Your cart is empty.</p>
        <hr class="my-2 border-gray-100">
        <a href="cart.html" class="block text-left text-xs text-gray-700 hover:text-black font-medium py-1 px-1">
          View All Products
        </a>
      `;
    } else {
      cartDropdownContentHTML = `
        <div class="max-h-64 overflow-y-auto space-y-2 mb-2 pr-1">
          ${cart.map(item => {
            const itemQty = Number(item.quantity) || 1;
            const itemPrice = Number(item.price) || 0;
            return `
              <div class="bg-[#F3F4F6] rounded p-3 flex justify-between items-center text-xs">
                <div class="flex flex-col gap-2">
                  <span class="font-medium text-gray-800 truncate w-24 block">${item.name || 'Unknown Item'}</span>
                  <div class="flex items-center border border-gray-300 rounded bg-white overflow-hidden w-20">
                    <button data-dec-id="${item.id}" class="px-2 py-0.5 hover:bg-gray-100 text-gray-500 focus:outline-none font-bold">-</button>
                    <span class="flex-grow text-center text-xs font-semibold text-gray-800">${itemQty}</span>
                    <button data-inc-id="${item.id}" class="px-2 py-0.5 hover:bg-gray-100 text-gray-500 focus:outline-none font-bold">+</button>
                  </div>
                </div>
                <div class="text-right">
                  <span class="text-[10px] text-gray-400 block">Price:</span>
                  <span class="font-semibold text-gray-800 block">$${itemPrice * itemQty}</span>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <hr class="my-2 border-gray-100">
        <a href="cart.html" class="block text-center text-xs text-blue-500 hover:text-blue-700 font-semibold py-1">View Cart</a>
      `;
    }

    navActions.innerHTML = `
      <div class="flex items-center gap-2 text-gray-600">
        <span>Hello, <span class="font-medium text-black">${currentUser}</span></span>
        
        <div class="relative">
          <button id="cart-btn" class="flex items-center gap-1 hover:text-black transition focus:outline-none">
            <i class="fa-solid fa-cart-shopping text-blue-500"></i>
            <span id="cart-count" class="text-blue-500 font-semibold">${cartCount}</span>
          </button>
          
          <div id="cart-dropdown" class="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow p-3 ${isCartOpen ? '' : 'hidden'} z-50">
            ${cartDropdownContentHTML}
          </div>
        </div>

        <button id="logout-btn" class="border border-red-500 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded transition">
          Logout
        </button>
      </div>
    `;

    const cartBtn = document.getElementById('cart-btn');
    const cartDropdown = document.getElementById('cart-dropdown');
    
    cartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      isCartOpen = !isCartOpen;
      cartDropdown.classList.toggle('hidden');
    });

    document.addEventListener('click', (e) => {
      if (cartDropdown && !cartDropdown.classList.contains('hidden') && !cartBtn.contains(e.target)) {
        isCartOpen = false;
        cartDropdown.classList.add('hidden');
      }
    });

    cartDropdown.addEventListener('click', (e) => {
      e.stopPropagation();
      const incBtn = e.target.closest('[data-inc-id]');
      const decBtn = e.target.closest('[data-dec-id]');
      
      if (incBtn) {
        const id = parseInt(incBtn.getAttribute('data-inc-id'));
        adjustQuantity(id, 1);
      } else if (decBtn) {
        const id = parseInt(decBtn.getAttribute('data-dec-id'));
        adjustQuantity(id, -1);
      }
    });

    document.getElementById('logout-btn').addEventListener('click', () => {
      localStorage.removeItem("loggedIn");
      isLoggedIn = false;
      isCartOpen = false;
      renderHeader();
      renderProducts(products);
    });

  } else {

    navActions.innerHTML = `
      <div class="flex items-center gap-2">
        <a href="login.html" class="border border-blue-500 text-blue-500 hover:bg-blue-50 px-4 py-1.5 rounded transition font-medium inline-block text-sm">
          Login
        </a>
        <a href="register.html" class="border border-green-500 text-green-500 hover:bg-green-50 px-4 py-1.5 rounded transition font-medium inline-block text-sm">
          Register
        </a>
      </div>
    `;
  }
}

function renderProducts(productsToRender) {
  if (!productGrid) return;
  productGrid.innerHTML = '';

  if (productsToRender.length === 0) {
    productGrid.innerHTML = `
      <div class="col-span-full text-center py-12">
        <p class="text-gray-500 text-lg">No products match your search query.</p>
      </div>
    `;
    return;
  }

  productsToRender.forEach(product => {
    const isFavorited = isLoggedIn && favorites.includes(product.id);
    const inCart = isLoggedIn && cart.some(item => item.id === product.id);

    const heartColorClass = isFavorited ? 'text-red-500' : 'text-black';

    const cartButtonHTML = inCart
  ? `<button data-cart-id="${product.id}" class="bg-[#DC3545] hover:bg-red-700 text-white font-medium px-4 py-2 rounded text-sm transition">Remove from Cart</button>`
  : `<button data-cart-id="${product.id}" class="bg-[#007BFF] hover:bg-blue-600 text-white font-medium px-4 py-2 rounded text-sm transition">Add to Cart</button>`;
    const actionButtons = `
      <div class="flex items-center justify-center gap-4 mt-4 w-full">
        <button data-fav-id="${product.id}" class="transition text-lg py-1 px-2 focus:outline-none">
          <i class="fa-solid fa-heart ${heartColorClass}"></i>
        </button>
        ${cartButtonHTML}
      </div>
    `;

    const productCard = `
      <div class="bg-white border border-gray-150 rounded shadow-sm p-6 flex flex-col items-center w-full hover:border-blue-500 transition-colors duration-200 cursor-pointer">
        <div class="w-full h-64 bg-gray-50 mb-4 overflow-hidden rounded">
          <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover">
        </div>
        
        <h3 class="text-lg font-medium text-gray-900">${product.name}</h3>
        <p class="text-gray-500 text-sm mt-1">Price: $${product.price}</p>
        <p class="text-gray-400 text-xs mt-1">Category: ${product.category}</p>
        
        ${actionButtons}
      </div>
    `;
    productGrid.insertAdjacentHTML('beforeend', productCard);
  });
}


function toggleCartItem(productId) {
  const existingIndex = cart.findIndex(item => item.id === productId);

  if (existingIndex > -1) {
    cart.splice(existingIndex, 1);
  } else {
    const product = products.find(p => p.id === productId);
    if (product) {
      cart.push({ ...product, quantity: 1 });
    }
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  renderHeader();
  handleSearch(); 
}

function adjustQuantity(productId, amount) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;

  item.quantity += amount;
  if (item.quantity < 1) {
    item.quantity = 1;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  isCartOpen = true; 
  renderHeader();
  handleSearch(); 
}

function toggleFavorite(productId, heartIconElement) {
  const index = favorites.indexOf(productId);
  if (index > -1) {
    favorites.splice(index, 1);
    heartIconElement.classList.remove('text-red-500');
    heartIconElement.classList.add('text-black');
  } else {
    favorites.push(productId);
    heartIconElement.classList.add('text-red-500');
    heartIconElement.classList.remove('text-black');
  }
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

document.addEventListener('click', function(e) {
  const cartBtn = e.target.closest('[data-cart-id]');
  const favBtn = e.target.closest('[data-fav-id]');

  if (cartBtn || favBtn) {
    if (!isLoggedIn) {
      window.location.href = "login.html";
      return;
    }

    if (cartBtn) {
      const productId = parseInt(cartBtn.getAttribute('data-cart-id'));
      toggleCartItem(productId);
    } else if (favBtn) {
      const productId = parseInt(favBtn.getAttribute('data-fav-id'));
      const heartIcon = favBtn.querySelector('i');
      toggleFavorite(productId, heartIcon);
    }
  }
});

function handleSearch() {
  const filterType = searchType.value;
  const query = searchInput.value.toLowerCase().trim();

  const filtered = products.filter(product => {
    if (filterType === 'name') {
      return product.name.toLowerCase().includes(query);
    } else if (filterType === 'category') {
      return product.category.toLowerCase().includes(query);
    }
    return true;
  });

  renderProducts(filtered);
}

if (searchForm) {
  searchForm.addEventListener('submit', function(e) {
    e.preventDefault();
    handleSearch();
  });
}

if (searchInput) searchInput.addEventListener('input', handleSearch);
if (searchType) searchType.addEventListener('change', handleSearch);

renderHeader();
renderProducts(products);