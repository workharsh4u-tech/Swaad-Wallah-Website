// ✅ Checkout Page Script for SwaadWallah
// Works with: orderItems, subtotal, deliveryFee, tax, total

document.addEventListener("DOMContentLoaded", () => {
  const orderItemsDiv = document.getElementById("orderItems");

  const subtotalEl = document.getElementById("subtotal");
  const deliveryFeeEl = document.getElementById("deliveryFee");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");

  const discountRow = document.getElementById("discountRow");
  const discountEl = document.getElementById("discount");

  const promoMessage = document.getElementById("promoMessage");

  let discountAmount = 0;

  // ✅ Get Cart from localStorage
  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  // ✅ Save Cart
  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  // ✅ Calculate subtotal
  function calculateSubtotal(cart) {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  // ✅ Delivery Fee logic
  function getDeliveryFee(subtotal) {
    return subtotal > 25 ? 0 : 3.99;
  }

  // ✅ Render Order Items
  function renderOrderItems() {
    const cart = getCart();

    if (!orderItemsDiv) return;

    if (cart.length === 0) {
      orderItemsDiv.innerHTML = `
        <div style="padding: 20px; text-align:center; color: gray;">
          <i class="fas fa-shopping-cart" style="font-size: 30px;"></i>
          <p style="margin-top:10px;">Your cart is empty</p>
          <a href="restaurant.html" style="color: var(--primary-color); text-decoration: underline;">
            Go back to menu
          </a>
        </div>
      `;

      updateSummary();
      return;
    }

    orderItemsDiv.innerHTML = cart
      .map((item, index) => {
        return `
        <div class="order-item" style="display:flex; justify-content:space-between; align-items:center; padding: 12px 0; border-bottom: 1px solid #eee;">
          
          <div>
            <h4 style="margin:0; font-size:15px;">${item.name}</h4>
            <p style="margin:4px 0; font-size:13px; color:gray;">
              $${item.price.toFixed(2)} × ${item.qty}
            </p>
          </div>

          <div style="display:flex; gap:8px; align-items:center;">
            <button class="qty-btn minus" data-index="${index}" style="padding:4px 10px;">-</button>
            <span style="min-width:20px; text-align:center;">${item.qty}</span>
            <button class="qty-btn plus" data-index="${index}" style="padding:4px 10px;">+</button>
            <button class="remove-btn" data-index="${index}" style="padding:4px 10px;">✖</button>
          </div>

        </div>
      `;
      })
      .join("");

    updateSummary();
  }

  // ✅ Update Summary (subtotal, delivery, tax, total)
  function updateSummary() {
    const cart = getCart();
    const subtotal = calculateSubtotal(cart);

    const deliveryFee = getDeliveryFee(subtotal);
    const tax = subtotal * 0.08;

    // Apply discount (promo)
    const finalSubtotal = Math.max(subtotal - discountAmount, 0);
    const finalTax = finalSubtotal * 0.08;
    const total = finalSubtotal + deliveryFee + finalTax;

    if (subtotalEl) subtotalEl.textContent = `$${finalSubtotal.toFixed(2)}`;
    if (deliveryFeeEl)
      deliveryFeeEl.textContent = deliveryFee === 0 ? "FREE" : `$${deliveryFee.toFixed(2)}`;
    if (taxEl) taxEl.textContent = `$${finalTax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${total.toFixed(2)}`;

    // Discount UI show/hide
    if (discountRow && discountEl) {
      if (discountAmount > 0) {
        discountRow.style.display = "flex";
        discountEl.textContent = `-$${discountAmount.toFixed(2)}`;
      } else {
        discountRow.style.display = "none";
      }
    }
  }

  // ✅ Handle + / - / remove buttons
  document.addEventListener("click", (e) => {
    let cart = getCart();

    if (e.target.classList.contains("plus")) {
      const idx = Number(e.target.dataset.index);
      cart[idx].qty += 1;
      saveCart(cart);
      renderOrderItems();
    }

    if (e.target.classList.contains("minus")) {
      const idx = Number(e.target.dataset.index);
      cart[idx].qty -= 1;

      if (cart[idx].qty <= 0) cart.splice(idx, 1);

      saveCart(cart);
      renderOrderItems();
    }

    if (e.target.classList.contains("remove-btn")) {
      const idx = Number(e.target.dataset.index);
      cart.splice(idx, 1);
      saveCart(cart);
      renderOrderItems();
    }
  });

  // ✅ Promo Code apply function (global for button onclick)
  window.applyPromo = function () {
    const promoInput = document.getElementById("promoCode");
    if (!promoInput) return;

    const code = promoInput.value.trim().toUpperCase();

    // reset
    discountAmount = 0;

    const cart = getCart();
    const subtotal = calculateSubtotal(cart);

    if (code === "") {
      promoMessage.innerHTML = `<p style="color:red;">Enter a promo code</p>`;
      updateSummary();
      return;
    }

    // Example promo codes
    if (code === "PIZZA50") {
      discountAmount = Math.min(subtotal * 0.5, 10); // max $10 off
      promoMessage.innerHTML = `<p style="color:green;">Promo applied ✅ 50% OFF (max $10)</p>`;
    } else if (code === "PASTA20") {
      discountAmount = Math.min(subtotal * 0.2, 8); // max $8 off
      promoMessage.innerHTML = `<p style="color:green;">Promo applied ✅ 20% OFF (max $8)</p>`;
    } else {
      promoMessage.innerHTML = `<p style="color:red;">Invalid promo code ❌</p>`;
    }

    updateSummary();
  };

  // ✅ Place Order function (global for button onclick)
  window.placeOrder = function () {
    const cart = getCart();

    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    // Validate required fields
    const fullName = document.getElementById("fullName")?.value.trim();
    const phone = document.getElementById("phone")?.value.trim();
    const address = document.getElementById("address")?.value.trim();
    const city = document.getElementById("city")?.value.trim();
    const state = document.getElementById("state")?.value.trim();
    const zip = document.getElementById("zip")?.value.trim();

    if (!fullName || !phone || !address || !city || !state || !zip) {
      alert("Please fill all required address details!");
      return;
    }

    // Save order data
    const subtotal = calculateSubtotal(cart);
    const deliveryFee = getDeliveryFee(subtotal);
    const tax = subtotal * 0.08;
    const total = subtotal + deliveryFee + tax;

    const orderData = {
      orderId: "SW" + Date.now(),
      items: cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.qty,
      })),
      deliveryAddress: {
        name: fullName,
        phone: phone,
        address: address,
        city: city,
        state: state,
        zip: zip,
      },
      total: `$${total.toFixed(2)}`,
    };

    localStorage.setItem("currentOrder", JSON.stringify(orderData));

    // Clear cart
    localStorage.removeItem("cart");

    alert("Order placed successfully ✅");

    // Optional redirect
    // window.location.href = "tracking.html";
    renderOrderItems();
  };

  // ✅ Initial render
  renderOrderItems();
});
