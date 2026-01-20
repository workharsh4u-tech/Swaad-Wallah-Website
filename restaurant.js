document.addEventListener("DOMContentLoaded", () => {

  const addButtons = document.querySelectorAll(".add-to-cart-btn");
  const cartCount = document.getElementById("cartCount");

  function getCart() {
    return JSON.parse(localStorage.getItem("cart")) || [];
  }

  function saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function updateCartCount() {
    if (!cartCount) return; // ✅ safety
    const cart = getCart();
    let total = 0;
    cart.forEach(item => total += item.qty);
    cartCount.textContent = total;
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
    updateCartCount();
  }

  addButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.item;
      const price = btn.dataset.price;
      addToCart(name, price);
    });
  });

  updateCartCount();
});
