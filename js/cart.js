// ==========================
// CART FUNCTIONS
// ==========================

// Get cart from localStorage safely
function getCart() {
  const raw = localStorage.getItem("cart");
  if (!raw || raw === "undefined" || raw === "null") return [];
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem("cart");
    return [];
  }
}

// Save cart and update UI
function saveCart(cart) {
  if (!Array.isArray(cart)) cart = [];
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  updateCartBadge();
}

// ==========================
// ADD TO CART
// ==========================
function addToCart(productElement) {
  // Determine image, title, price
  const imgEl = productElement.querySelector(".main-img img") || productElement.querySelector("img");
  const mainImage = imgEl ? imgEl.src : "";
  const titleEl = productElement.querySelector(".product-info .title") || productElement.querySelector(".product-title");
  const title = titleEl ? titleEl.textContent : "";
  const priceEl = productElement.querySelector(".price");
  const price = priceEl ? parseFloat(priceEl.textContent.replace("$", "")) : 0;
  const sizeEl = productElement.querySelector(".size-options .selected")
  const size = sizeEl ? sizeEl.textContent : "";

  if (!title) return;

  let cart = getCart();
  const existing = cart.find(item => item.title === title && item.size === size);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      image: mainImage,
      title: title,
      price: price,
      size: size,
      quantity: 1,
      color:"",
      colors:[
        // {name:"Red", mainImage:"image/product1_red_1.jpg"},
        // {name:"Yellow", mainImage:"image/product1_yellow_1.jpg"},
        // {name:"Green", mainImage:"image/product1_green_1.jpg"},
        // {name:"Maroon", mainImage:"image/product1_maroon_1.jpg"},
        // {name:"White", mainImage:"image/product1_white_1.jpg"}
      ]
    });
  }

  saveCart(cart);
  alert("Added to cart!");
}

// ==========================
// RENDER CART CONTENT
// ==========================
function renderCart() {
  const cartContent = document.querySelector(".cart-content");
  if (!cartContent) return;

  const cart = getCart();
  cartContent.innerHTML = "";
  let total = 0;
  // const btn2 = document.querySelector(".btn2")
  // btn2.addEventListener("click",(e)=>{

  // })
  cart.forEach((item, index) => {
    const cartBox = document.createElement("div");
    cartBox.classList.add("cart-box");

    // Build color options dynamically
  let colorHTML = "";
if (item.colors && item.colors.length > 0) {
  colorHTML = `
    <div class="color-options">
      ${item.colors
        .map(
          (c) => `
        <img 
          src="${c.mainImage}" 
          class="color-choice ${item.color === c.name ? "active" : ""}" 
          data-color="${c.name}" 
          data-img="${c.mainImage}">
      `
        )
        .join("")}
    </div>
  `;
}
    cartBox.innerHTML = `
      <img src="${item.image}" class="cart-img">
      <div class="cart-detail">
        <h2 class="cart-product-title">${item.title}</h2>
        <span class="cart-price">$${item.price}</span>
         <div class="size-options">
        <button class="btn2">${item.size || "Select Size"}</button>
        <div class="dropdown hidden">
          <button class="size-choice">S</button>
          <button class="size-choice">M</button>
          <button class="size-choice">L</button>
          <button class="size-choice">XL</button>
          <button class="size-choice">XXL</button>
        </div>
      </div>

      <!-- Dynamic Color Selector -->
      ${colorHTML}


        <div class="cart-quantity">
          <button class="decrement">-</button>
          <span class="number">${item.quantity}</span>
          <button class="increment">+</button>
        </div>
      </div>
      <i class="ri-delete-bin-line cart-remove"></i>
    `;

    cartContent.appendChild(cartBox);

     const btn2 = cartBox.querySelector(".btn2");
  const dropdown = cartBox.querySelector(".dropdown");

  btn2?.addEventListener("click", (e) => {
    e.stopPropagation();
    document.querySelectorAll(".dropdown").forEach(d => d.classList.add("hidden"));
    dropdown.classList.toggle("hidden");
  });

  dropdown?.querySelectorAll(".size-choice").forEach(sizeBtn => {
    sizeBtn.addEventListener("click", e => {
      const newSize = e.target.textContent;
      item.size = newSize;
      btn2.textContent = newSize;
      saveCart(cart);
      dropdown.classList.add("hidden");
    });
  });

  document.addEventListener("click", (e) => {
    if (!cartBox.contains(e.target)) {
      dropdown?.classList.add("hidden");
    }
  });

  // ================= COLOR SELECTION =================
  // const mainImg = cartBox.querySelector(".cart-img");
  // const colorChoices = cartBox.querySelectorAll(".color-choice");

  // colorChoices.forEach(colorEl => {
  //   colorEl.addEventListener("click", () => {
  //     const newColor = colorEl.dataset.color;
  //     const newImg = colorEl.dataset.img;

  //     item.color = newColor;
  //     item.image = newImg;

  //     mainImg.src = newImg;
  //     colorChoices.forEach(c => c.classList.remove("active"));
  //     colorEl.classList.add("active");

  //     saveCart(cart);
  //   });
  // });


    // Remove item
    cartBox.querySelector(".cart-remove").addEventListener("click", () => {
      cart.splice(index, 1);
      saveCart(cart);
    });


    // Quantity change
    cartBox.querySelector(".cart-quantity").addEventListener("click", e => {
      if (e.target.classList.contains("decrement") && item.quantity > 1) item.quantity--;
      else if (e.target.classList.contains("increment")) item.quantity++;
      saveCart(cart);
    });

    total += item.price * item.quantity;
  });

  const totalPrice = document.querySelector(".totel-price");
  if (totalPrice) totalPrice.textContent = `$${total}`;
}

// ==========================
// UPDATE CART BADGE
// ==========================
function updateCartBadge() {
    const badge = document.querySelector(".cart-item-count");
    if (!badge) {
        console.warn("Cart badge element not found!");
        return;
    }

    const cart = getCart();
    const totalQty = cart.reduce((sum, item) => sum + (item.quantity || 0), 0);

    if (totalQty > 0) {
        badge.style.visibility = "visible";
        badge.textContent = totalQty;
    } else {
        badge.style.visibility = "hidden";
        badge.textContent = "";
    }
}

// ==========================
// BUY NOW BUTTON
// ==========================
function setupBuyBtn() {
  const buyBtn = document.querySelector(".btn-buy");
  if (!buyBtn) return;
  buyBtn.addEventListener("click", () => {
    const cart = getCart();
    if (cart.length === 0) return alert("Your cart is empty.");
    localStorage.removeItem("cart");
    renderCart();
    updateCartBadge();
    alert("✅ Thank you for your purchase!");
    window.location.href = "index.html"; // redirect after purchase
  });
}

// ==========================
// INITIALIZE
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  updateCartBadge();
  renderCart();
  setupBuyBtn();

  // Attach "Add to Cart" buttons on product listing and product detail
  const addCartButtons = document.querySelectorAll(".add-cart, .add-cart1");
  addCartButtons.forEach(button => {
    button.addEventListener("click", event => {
      const productElement = event.target.closest(".product-box, .product-detail");
      if (productElement) addToCart(productElement);
    });
  });
});


function getCart() {
  const raw = localStorage.getItem("cart");

  // If nothing saved, or bad values, return empty array
  if (!raw || raw === "undefined" || raw === "null") {
    return [];
  }

  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("Cart data corrupted. Resetting cart...", err);
    localStorage.removeItem("cart");
    return [];
  }
}
