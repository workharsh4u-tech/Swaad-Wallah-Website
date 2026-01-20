document.addEventListener("DOMContentLoaded", () => {
  const addButtons = document.querySelectorAll(".add-to-cart-btn");

  const cartCount = document.getElementById("cartCount");
  const cartItemsDiv = document.getElementById("cartItems");
  const cartFooter = document.getElementById("cartFooter");
  const cartTotal = document.getElementById("cartTotal");

  // ✅ Get / Save Cart
  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // ✅ Update cart count badge
  function updateCartCount() {
    const cart = getCart();
    let total = 0;
    cart.forEach((item) => (total += item.qty));
    if (cartCount) cartCount.innerText = total;
  }

  // ✅ Render Cart Sidebar Items
  function renderCart() {
    const cart = getCart();

    // Empty cart UI
    if (!cartItemsDiv) return;

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

    let subtotal = 0;

    cartItemsDiv.innerHTML = cart
      .map((item, index) => {
        subtotal += item.price * item.qty;

        return `
          <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; padding:10px 0; border-bottom:1px solid #eee;">
            
            <div>
              <h4 style="margin:0; font-size:15px;">${item.name}</h4>
              <p style="margin:5px 0; font-size:14px; color: #ff6b35;">
                $${item.price.toFixed(2)}
              </p>

              <div style="display:flex; align-items:center; gap:10px;">
                <button class="cart-minus" data-index="${index}" style="padding:4px 12px; border-radius:8px;">-</button>
                <span style="font-weight:600;">${item.qty}</span>
                <button class="cart-plus" data-index="${index}" style="padding:4px 12px; border-radius:8px;">+</button>

                <span style="margin-left:15px; color:gray;">
                  Subtotal: <b>$${(item.price * item.qty).toFixed(2)}</b>
                </span>
              </div>
            </div>

            <button class="cart-remove" data-index="${index}" style="border:none; background:transparent; color:red; font-size:18px;">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        `;
      })
      .join("");

    if (cartTotal) cartTotal.innerText = `$${subtotal.toFixed(2)}`;
    if (cartFooter) cartFooter.style.display = "block";

    updateCartCount();
  }

  // ✅ Add item to cart
  function addToCart(name, price) {
    let cart = getCart();
    const existing = cart.find((item) => item.name === name);

    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        name: name,
        price: Number(price),
        qty: 1,
      });
    }

    saveCart(cart);
    renderCart(); // ✅ show immediately
  }

  // ✅ + button click (food cards)
  addButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.item;
      const price = btn.dataset.price;
      addToCart(name, price);
    });
  });

  // ✅ Cart Sidebar + / - / remove click
  document.addEventListener("click", (e) => {
    let cart = getCart();

    // plus
    if (e.target.closest(".cart-plus")) {
      const idx = Number(e.target.closest(".cart-plus").dataset.index);
      cart[idx].qty += 1;
      saveCart(cart);
      renderCart();
    }

    // minus
    if (e.target.closest(".cart-minus")) {
      const idx = Number(e.target.closest(".cart-minus").dataset.index);
      cart[idx].qty -= 1;

      if (cart[idx].qty <= 0) cart.splice(idx, 1);

      saveCart(cart);
      renderCart();
    }

    // remove
    if (e.target.closest(".cart-remove")) {
      const idx = Number(e.target.closest(".cart-remove").dataset.index);
      cart.splice(idx, 1);
      saveCart(cart);
      renderCart();
    }
  });

  // ✅ Initial render
  renderCart();
});
