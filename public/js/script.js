// show-alert
const showAlert = document.querySelector("[show-alert]");
if (showAlert) {
  let time = showAlert.getAttribute("data-time");
  time = parseInt(time);

  // Sau time giây sẽ đóng thông báo
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time);

  // Khi click vào nút close-alert sẽ đóng luôn
  const closeAlert = showAlert.querySelector("[close-alert]");
  closeAlert.addEventListener("click", () => {
    showAlert.classList.add("alert-hidden");
  });
}
// End show-alert

//Button Go Back
const goBackButtons = document.querySelectorAll("[button-go-back");
if (goBackButtons.length > 0) {
  goBackButtons.forEach((button) => {
    button.addEventListener("click", () => {
      history.back();
    });
  });
}
//End Button Go Back
