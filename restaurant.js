document.addEventListener("DOMContentLoaded", () => {

  const addButtons = document.querySelectorAll(".add-to-cart-btn");
  const cartCount = document.getElementById("cartCount");

  const cartItemsDiv = document.getElementById("cartItems");
  const cartFooter = document.getElementById("cartFooter");
  const cartTotal = document.getElementById("cartTotal");

  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartCount() {
    if (!cartCount) return;
    const cart = getCart();
    let total = 0;
    cart.forEach(item => total += item.qty);
    cartCount.textContent = total;
  }

  // ✅ CART UI Render Function
  function renderCart() {
    const cart = getCart();

    if (!cartItemsDiv) return;

    // Empty cart
    if (cart.length === 0) {
      cartItemsDiv.innerHTML = `
        <div class="empty-cart">
          <i class="fas fa-shopping-cart"></i>
          <p>Your cart is empty</p>
        </div>
      `;
      if (cartFooter) cartFooter.style.display = "none";
      updateCartCount();
      return;
    }

    // Show items
    let totalPrice = 0;

    cartItemsDiv.innerHTML = cart.map((item, index) => {
      totalPrice += item.price * item.qty;

      return `
        <div class="cart-item" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
          <div>
            <h4 style="margin:0;font-size:14px;">${item.name}</h4>
            <p style="margin:4px 0;color:gray;font-size:13px;">
              $${item.price} × ${item.qty}
            </p>
          </div>

          <div style="display:flex;gap:8px;align-items:center;">
            <button class="qty-btn minus" data-index="${index}" style="padding:4px 10px;">-</button>
            <span>${item.qty}</span>
            <button class="qty-btn plus" data-index="${index}" style="padding:4px 10px;">+</button>
          </div>
        </div>
      `;
    }).join("");

    if (cartTotal) cartTotal.textContent = `$${totalPrice.toFixed(2)}`;
    if (cartFooter) cartFooter.style.display = "block";

    updateCartCount();
  }

  function addToCart(name, price) {
    let cart = getCart();
    const existing = cart.find(i => i.name === name);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        name,
        price: Number(price),
        qty: 1
      });
    }

    saveCart(cart);
    renderCart(); // ✅ update UI
  }

  // ✅ Add button click
  addButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.item;
      const price = btn.dataset.price;
      addToCart(name, price);
    });
  });

  // ✅ + / - inside cart
  document.addEventListener("click", (e) => {
    const cart = getCart();

    if (e.target.classList.contains("plus")) {
      const idx = Number(e.target.dataset.index);
      cart[idx].qty += 1;
      saveCart(cart);
      renderCart();
    }

    if (e.target.classList.contains("minus")) {
      const idx = Number(e.target.dataset.index);
      cart[idx].qty -= 1;

      if (cart[idx].qty <= 0) cart.splice(idx, 1);

      saveCart(cart);
      renderCart();
    }
  });

  // ✅ Initial render
  renderCart();
});
