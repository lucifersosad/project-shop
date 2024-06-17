const Chat = require("../../models/chat.model");
const User = require("../../models/users.model");

// [GET] /chat
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id;
  const fullName = res.locals.user.fullName;

  //SocketIO
  _io.once("connection", (socket) => {
    console.log("a user connected", socket.id);

    socket.on("CLIENT_SEND_MESSAGE", async (content) => {
      const chat = new Chat({
        user_id: userId,
        content: content,
      });
      console.log(chat)
      await chat.save();

      //Trả data về client
      _io.emit("SERVER_RETURN_MESSAGE", {
        userId: userId,
        fullName: fullName,
        content: content,
      });
    });

    socket.on("CLIENT_SEND_TYPING", async (type) => {
      //Trả data về client
      socket.broadcast.emit("SERVER_RETURN_TYPING", {
        userId: userId,
        fullName: fullName,
        type: type,
      });
    });
  });
  //End SocketIO

  const chats = await Chat.find({
    deleted: false,
  });

  for (const chat of chats) {
    const infoUser = await User.findOne({
      _id: chat.user_id,
    }).select("fullName");

    chat.infoUser = infoUser;
  }

  res.render("client/pages/chat/index", {
    pageTitle: "Chat",
    chats: chats,
  });
};
