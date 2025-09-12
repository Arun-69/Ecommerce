// ----------------------------
// Product List Page
// ----------------------------
const productContainer = document.querySelector(".product-list");

if (productContainer) {
  displayProducts();
}

function displayProducts() {
  product.forEach(prod => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-box");

    productCard.innerHTML = `
      <div class="img-box">
        <img src="${prod.colors[0].mainImage}" alt="${prod.title}"class="image">
      </div>
      <h2 class="product-title">${prod.title}</h2>
      <div class="price-and-cart">
        <span class="price">${prod.price}</span>
        <i class="ri-shopping-cart-fill add-cart"></i>
      </div>
    `;

    productContainer.appendChild(productCard);

    // View product on image click
    const imgBox = productCard.querySelector(".img-box");
    imgBox.addEventListener("click", () => {
      viewProduct(prod);
    });

    // Full card click → go to details
    imgBox.addEventListener("click", () => {
      sessionStorage.setItem("selectProduct", JSON.stringify(prod));
      window.location.href = "product-detail.html";
    });
  });
}

function viewProduct(prod) {
  sessionStorage.setItem("selectProduct", JSON.stringify(prod));
//   window.location.href = "product-detail.html";
}

// ----------------------------
// Product Detail Page
// ----------------------------
document.addEventListener("DOMContentLoaded", () => {
  const productDetail = document.querySelector(".product-detail");
  if (productDetail) {
    displayProductDetail();
  }
});

function displayProductDetail() {
  const productData = JSON.parse(sessionStorage.getItem("selectProduct"));
  if (!productData) return;

  const titleEl = document.querySelector(".title");
  const priceEl = document.querySelector(".price");
  const descriptionEl = document.querySelector(".description");
  const mainImageContainer = document.querySelector(".main-img");
  const thumbnailImageContainer = document.querySelector(".thumbnails-img");
  const colorContainer = document.querySelector(".color-options");
  const sizeContainer = document.querySelector(".size-options");
//   const addToCartBtn = document.querySelector(".add-cart");
  const buyNowBtn = document.querySelector("#buy-cart-btn");

  let selectedColor = productData.colors[0];
  let selectedSize = selectedColor.sizes[0];

  // Update product UI when selecting color/size
  function updateProductDisplay(colorData) {
    if (!colorData.sizes.includes(selectedSize)) {
      selectedSize = colorData.sizes[0];
    }

    // Main image
    mainImageContainer.innerHTML = `<img src="${colorData.mainImage}" alt="${productData.title}" class="image">`;

    // Thumbnails
    thumbnailImageContainer.innerHTML = "";
    colorData.thumbnails.forEach(thumbnail => {
      const img = document.createElement("img");
      img.src = thumbnail;
      thumbnailImageContainer.appendChild(img);
      img.addEventListener("click", () => {
        mainImageContainer.innerHTML = `<img src="${thumbnail}" alt="${productData.title}">`;
      });
    });

    // Color options
    colorContainer.innerHTML = "";
    productData.colors.forEach(color => {
      const img = document.createElement("img");
      img.src = color.mainImage;
      if (color.name === colorData.name) img.classList.add("selected");
      colorContainer.appendChild(img);
      img.addEventListener("click", () => {
        selectedColor = color;
        updateProductDisplay(color);
      });
    });

    // Size options
    sizeContainer.innerHTML = "";
    colorData.sizes.forEach(size => {
      const btn = document.createElement("button");
      btn.textContent = size;
      if (size === selectedSize) btn.classList.add("selected");
      sizeContainer.appendChild(btn);

      btn.addEventListener("click", () => {
        document.querySelectorAll(".size-options button").forEach(el => el.classList.remove("selected"));
        selectedSize = size;
        btn.classList.add("selected");
      });
    });
  }

  // Fill details
  titleEl.textContent = productData.title;
  priceEl.textContent = `${productData.price}`;
  descriptionEl.textContent = productData.description;
  updateProductDisplay(selectedColor);
  // Buy Now button
  buyNowBtn.addEventListener("click", () => {
    // Simulate checkout
    alert("✅ Thank you for your purchase!");
    localStorage.removeItem("cart");
  });
}

// ----------------------------
// Cart Helpers
// ----------------------------
function getCart() {
  const raw = localStorage.getItem("cart");
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

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function addToCart(productData, color, size) {
  let cart = getCart();

  const existing = cart.find(item => item.title === productData.title && item.color === color.name && item.size === size);

  if (existing) {
    existing.quantity++;
  } else {
    cart.push({
      title: productData.title,
      price: productData.price,
      image: color.mainImage,
      color: color.name,
      size: size,
      quantity: 1
    });
  }

  saveCart(cart);
}
