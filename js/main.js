document.addEventListener("DOMContentLoaded", () => {
  // ===========================
  // Carousel Slider
  // ===========================
  const carousel = document.getElementById("carouselContainer");
  if (carousel) {
    const totalSlides = carousel.children.length;
    let currentIndex = 0;

    function moveToNextSlide() {
      currentIndex = (currentIndex + 1) % totalSlides;
      carousel.style.transform = `translateX(-${currentIndex * 100}vw)`;
    }

    setInterval(moveToNextSlide, 6000); // Slide every 6 seconds
  }

  // ===========================
  // Update Cart Count (optional badge)
  // ===========================
  const cartCountElement = document.getElementById("cart-count");
  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCountElement) cartCountElement.textContent = totalCount;
  }

  // ===========================
  // Add to Cart Buttons
  // ===========================
  document.querySelectorAll(".add-to-cart").forEach((button) => {
    button.addEventListener("click", () => {
      const card = button.closest(".product-card");
      const name = card.querySelector("h3").textContent.trim();
      const priceText = card.querySelector(".price").textContent.trim();
      const price = parseInt(priceText.replace(/[^\d]/g, "")); // Remove ₹ and commas
      const image = card.querySelector("img").src;
      const category = card.closest("section")?.id || "general";

      const product = {
        name,
        price,
        image,
        category,
        quantity: 1,
      };

      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      const existingIndex = cart.findIndex((item) => item.name === product.name);

      if (existingIndex !== -1) {
        cart[existingIndex].quantity += 1;
      } else {
        cart.push(product);
      }

      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
      alert(`${product.name} added to cart`);
    });
  });

  updateCartCount(); // update on page load

  // ===========================
  // Search Bar (optional feature)
  // ===========================
  const searchInput = document.querySelector(".search-bar");
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        alert(`Searching for "${e.target.value}" (feature not implemented yet)`);
      }
    });
  }

  // ===========================
  // Cart Page Logic (if on cart.html)
  // ===========================
  const cartPageContainer = document.getElementById("cart-items-container");
  if (cartPageContainer) {
    const totalElement = cartPageContainer.querySelector(".cart-total");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function renderCartItems() {
      // Clear previous items
      cartPageContainer.querySelectorAll(".cart-item").forEach(el => el.remove());

      let total = 0;

      cart.forEach((item, index) => {
        const price = Number(button.dataset.price); // Ensures it's stored as a number // Correct
        const quantity = parseInt(item.quantity) || 1;
        const itemTotal = price * quantity;
        total += itemTotal;

        const div = document.createElement("div");
        div.className = "cart-item";
        div.innerHTML = `
          <img src="${item.image}" alt="${item.name}" />
          <div class="item-details">
            <h4>${item.name}</h4>
          </div>
          <div class="item-price">₹${price}</div>
          <div class="item-actions">
            <input type="number" value="${quantity}" min="1" data-index="${index}">
            <button class="remove-btn" data-index="${index}"><i class="fas fa-trash-alt"></i></button>
          </div>
        `;
        cartPageContainer.insertBefore(div, totalElement);
      });

      totalElement.textContent = `Total: ₹${total.toFixed(2)}`;

    }

    cartPageContainer.addEventListener("input", (e) => {
      if (e.target.type === "number") {
        const index = parseInt(e.target.dataset.index);
        const newQty = Math.max(1, parseInt(e.target.value));
        cart[index].quantity = newQty;
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
      }
    });

    cartPageContainer.addEventListener("click", (e) => {
      const btn = e.target.closest(".remove-btn");
      if (btn) {
        const index = parseInt(btn.dataset.index);
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        renderCartItems();
        updateCartCount();
      }
    });

    renderCartItems();
  }
});
function calculateTotal(cartItems) {
  let total = 0;
  cartItems.forEach(item => {
    total += item.price * item.quantity;
  });
  return total;
}

document.addEventListener("DOMContentLoaded", () => {
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  const totalPriceEl = document.getElementById("total-price");
  const total = calculateTotal(cartItems);
  if (totalPriceEl) {
    totalPriceEl.textContent = total.toFixed(2);
  }

  const checkoutButton = document.getElementById("checkout-button");
  if (checkoutButton) {
    checkoutButton.addEventListener("click", () => {
      if (cartItems.length === 0) {
        alert("Your cart is empty!");
      } else {
        window.location.href = "checkout.html";
      }
    });
  }
});
