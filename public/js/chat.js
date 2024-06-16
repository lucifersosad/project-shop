// CLIENT_SEND_MESSAGE
const formSendData = document.querySelector(".chat .inner-form");
if (formSendData) {
  formSendData.addEventListener("submit", (event) => {
    event.preventDefault();
    const content = formSendData.content.value || "";

    if (content) {
      socket.emit("CLIENT_SEND_MESSAGE", content);
      formSendData.content.value = "";
    }
  });
}
// End CLIENT_SEND_MESSAGE

// SERVER_RETURN_MESSAGE
socket.on("SERVER_RETURN_MESSAGE", (data) => {
  const body = document.querySelector(".chat .inner-body");
  const myId = document.querySelector("[my-id]").getAttribute("my-id");
  const div = document.createElement("div");

  let htmlFullName = "";
  let htmlContent = "";

  if (myId == data.userId) {
    div.classList.add("inner-outgoing");
  } else {
    div.classList.add("inner-incoming");
    htmlFullName = `<div class="inner-name">${data.fullName}</div>`;
  }

  if (data.content) {
    htmlContent = `<div class="inner-content">${data.content}</div>`;
  }

  //   if(data.images.length > 0) {
  //     htmlImages += `<div class="inner-images">`;

  //     data.images.forEach(image => {
  //       htmlImages += `
  //         <img src="${image}">
  //       `;
  //     })

  //     htmlImages += `</div>`;
  //   }

  div.innerHTML = `
    ${htmlFullName}
    ${htmlContent}
  `;

  body.appendChild(div);

  body.scrollTop = body.scrollHeight;

  //   const elementListTyping = body.querySelector(".inner-list-typing");

  //   body.insertBefore(div, elementListTyping);

  //   new Viewer(div);
});
// End SERVER_RETURN_MESSAGE

// Scroll Chat To Bottom
const chatBody = document.querySelector(".chat .inner-body");
if (chatBody) {
  chatBody.scrollTop = chatBody.scrollHeight;
}
// End Scroll Chat To Bottom

// Show Tooltip emoji
const buttonIcon = document.querySelector(".button-icon");
if (buttonIcon) {
  const tooltip = document.querySelector(".tooltip");
  Popper.createPopper(buttonIcon, tooltip);
  buttonIcon.addEventListener("click", () => {
    tooltip.classList.toggle("shown");
  });
}
// End Show Tooltip emoji

// emoji-picker
const emojiPicker = document.querySelector("emoji-picker");
if (emojiPicker) {
  emojiPicker.addEventListener("emoji-click", (event) => {
    const icon = event.detail.unicode;
    const inputChat = document.querySelector(
      ".chat .inner-form input[name='content']"
    );
    inputChat.value = inputChat.value + icon;
  });
}
// End emoji-picker
