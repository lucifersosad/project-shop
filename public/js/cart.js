// Update Cart
const tableCart = document.querySelector("[table-cart]");
if (tableCart) {
  const listInputQuantity = tableCart.querySelectorAll(
    "input[name='quantity']"
  );
  listInputQuantity.forEach((input) => {
    input.addEventListener("change", () => {
      const quantity = input.value;
      const productId = input.getAttribute("item-id");
      const maxQuantity = input.getAttribute("max");
      console.log(maxQuantity);

      if (quantity > 0 && quantity <= maxQuantity) {
        window.location.href = `/cart/update/${productId}/${quantity}`;
      }
    });
  });
}
// End Update Cart