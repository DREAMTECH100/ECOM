// ===============================
// GLOBAL DOM READY WRAPPER
// ===============================

document.addEventListener("DOMContentLoaded", function () {

  // ===============================
  // SCROLL ANIMATION (Safe)
  // ===============================
  const animatedElements = document.querySelectorAll('.animate');

  if (animatedElements.length) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    });

    animatedElements.forEach(el => observer.observe(el));
  }

  // ===============================
  // SHOP NOW BUTTON (Safe)
  // ===============================
  const shopBtn = document.getElementById("shopNowBtn");
  if (shopBtn) {
    shopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 600, behavior: 'smooth' });
    });
  }

  // ===============================
  // CHECKOUT TOTAL (Safe)
  // ===============================
  const checkoutTotal = document.getElementById("checkoutTotal");
  if (checkoutTotal) {
    checkoutTotal.textContent = "$499.00"; // Dummy value
  }

  // ===============================
  // ADMIN PRODUCT LOAD (Safe)
  // ===============================
  const productsContainer = document.getElementById('productsContainer');

  if (productsContainer) {
    productsContainer.innerHTML = '<p>Loading products...</p>';

    fetch('/api/products')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then(products => {
        if (!products.length) {
          productsContainer.innerHTML = '<p>No products found.</p>';
          return;
        }

        productsContainer.innerHTML = '';

        products.forEach(product => {
          const card = document.createElement('div');
          card.className = 'admin-card';
          card.innerHTML = `
            <h3>${product.name}</h3>
            <p>₦${product.price.toLocaleString()}</p>
            <p>Stock: ${product.stock}</p>
          `;
          productsContainer.appendChild(card);
        });
      })
      .catch(err => {
        productsContainer.innerHTML =
          `<p style="color:red;">Error: ${err.message}</p>`;
      });
  }

  // ===============================
  // SHOP PAGE LOAD PRODUCTS (Safe)
  // ===============================
  const grid = document.getElementById('productGrid');

  if (grid) {
    loadProducts();
  }

});

// ===============================
// PRODUCT PAGE FUNCTIONS
// ===============================

function switchImage(img) {
  const mainImage = document.getElementById('mainImage');
  if (mainImage) {
    mainImage.src = img.src;
  }
}

function updateQty(change) {
  const qtyInput = document.getElementById('qtyInput');
  if (!qtyInput) return;

  let current = parseInt(qtyInput.value);
  current = Math.max(1, current + change);
  qtyInput.value = current;
}

function switchTab(tab) {
  const descTab = document.getElementById('descTab');
  const reviewsTab = document.getElementById('reviewsTab');

  if (!descTab || !reviewsTab) return;

  descTab.style.display = tab === 'desc' ? 'block' : 'none';
  reviewsTab.style.display = tab === 'reviews' ? 'block' : 'none';

  const buttons = document.querySelectorAll('.tab-btn');
  buttons.forEach(btn => btn.classList.remove('active'));

  const activeBtn = document.querySelector(`.tab-btn[onclick*="${tab}"]`);
  if (activeBtn) activeBtn.classList.add('active');
}

function addToCart() {
  alert("Product added to cart (dummy function).");
}

// ===============================
// CART FUNCTIONS
// ===============================

function updateCartQty(btn, change) {
  const input = btn?.parentElement?.querySelector('input');
  if (!input) return;

  let qty = parseInt(input.value);
  qty = Math.max(1, qty + change);
  input.value = qty;
  recalculateCart();
}

function removeCartItem(btn) {
  btn?.parentElement?.remove();
  recalculateCart();
}

function recalculateCart() {
  const items = document.querySelectorAll('.cart-item');
  let subtotal = 0;

  items.forEach(item => {
    const priceEl = item.querySelector('p');
    const qtyEl = item.querySelector('input');

    if (!priceEl || !qtyEl) return;

    const price = parseFloat(priceEl.textContent.replace('$', ''));
    const qty = parseInt(qtyEl.value);

    subtotal += price * qty;
  });

  const subtotalEl = document.getElementById('subtotal');
  const totalEl = document.getElementById('total');

  if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;
}

function checkout() {
  alert("Redirecting to checkout (Paystack soon).");
}

// ===============================
// PAYSTACK
// ===============================

function payWithPaystack() {
  if (typeof PaystackPop === "undefined") {
    alert("Paystack not loaded.");
    return;
  }

  const emailInput = document.querySelector('input[type="email"]');
  if (!emailInput) return;

  const handler = PaystackPop.setup({
    key: 'pk_test_xxxxxxxxxxxxxx',
    email: emailInput.value,
    amount: 49900,
    currency: "NGN",
    callback: function(response){
      alert("Payment successful! Ref: " + response.reference);
      window.location.href = "order-success.html";
    },
    onClose: function(){
      alert('Payment window closed');
    }
  });

  handler.openIframe();
}

// ===============================
// SHOP PRODUCT LOADER
// ===============================

async function loadProducts() {
  try {
    const res = await fetch('/api/products');
    const products = await res.json();

    const grid = document.getElementById('productGrid');
    if (!grid) return;

    products.forEach(p => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `
        <img src="/uploads/${p.image}" alt="${p.name}" />
        <div class="details">
          <h3>${p.name}</h3>
          <p>₦${p.price}</p>
          <p>${p.description}</p>
        </div>
      `;
      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Failed to load products', err);
  }
}

// ===============================
// IMAGE SCROLL EFFECT
// ===============================

const images = document.querySelectorAll("img");

window.addEventListener("scroll", () => {
  images.forEach(img => {
    const rect = img.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      img.style.transform = "scale(1.02)";
      img.style.transition = "transform 2s ease";
    }
  });
});

// ===============================
// HAMBURGER MENU
// ===============================

function toggleMenu(){
  const nav = document.getElementById("navMenu");
  if(nav){
    nav.classList.toggle("active");
  }
}

// HERO SLIDER
document.addEventListener("DOMContentLoaded", function () {

  const slides = document.querySelectorAll(".slide");
  if (!slides.length) return;

  let current = 0;

  function nextSlide() {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
  }

  setInterval(nextSlide, 3000);

});