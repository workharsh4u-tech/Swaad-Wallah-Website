document.addEventListener("DOMContentLoaded", () => {
  renderOrderSummary();
});

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function renderOrderSummary() {
  const cart = getCart();

  const orderItemsDiv = document.getElementById("orderItems");
  const subtotalEl = document.getElementById("subtotal");
  const taxEl = document.getElementById("tax");
  const totalEl = document.getElementById("total");

  if (!orderItemsDiv) return;

  if (cart.length === 0) {
    orderItemsDiv.innerHTML = `<p style="color:#666;">Your cart is empty.</p>`;
    subtotalEl.textContent = "$0.00";
    taxEl.textContent = "$0.00";
    totalEl.textContent = "$3.99";
    return;
  }

  let subtotal = 0;

  orderItemsDiv.innerHTML = cart
    .map((item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.qty) || 1;
      subtotal += price * qty;

      return `
        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
          <div>
            <strong>${item.name}</strong>
            <div style="font-size:13px; color:#777;">Qty: ${qty}</div>
          </div>
          <strong>$${(price * qty).toFixed(2)}</strong>
        </div>
      `;
    })
    .join("");

  const deliveryFee = 3.99;
  const tax = subtotal * 0.08;
  const total = subtotal + deliveryFee + tax;

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  taxEl.textContent = `$${tax.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;
}

// ✅ Place Order button
function placeOrder() {
  const cart = getCart();
  if (cart.length === 0) {
    alert("Cart is empty!");
    return;
  }

  const order = {
    orderId: "SW" + Date.now(),
    items: cart,
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem("currentOrder", JSON.stringify(order));
  localStorage.removeItem("cart");

  alert("Order placed successfully ✅");
  window.location.href = "./tracking.html";
}

// ✅ Promo code (simple demo)
function applyPromo() {
  const promoInput = document.getElementById("promoCode");
  const msg = document.getElementById("promoMessage");
  if (!promoInput || !msg) return;

  const code = promoInput.value.trim().toUpperCase();

  if (code === "SAVE10") {
    msg.innerHTML = `<span style="color:green;">Promo applied ✅ (Demo)</span>`;
  } else {
    msg.innerHTML = `<span style="color:red;">Invalid promo code ❌</span>`;
  }
}
