const md5 = require("md5");
const generateHelper = require("../../helpers/generate");
const User = require("../../models/users.model");
const ForgotPassword = require("../../models/forgot-password.model");
const sendMail = require("../../helpers/sendMail");
// [GET] /user/register
module.exports.register = async (req, res) => {
  res.render("client/pages/user/register", {
    pageTitle: "Đăng ký tài khoản",
  });
};

// [POST] /user/register
module.exports.registerPost = async (req, res) => {
  req.body.password = md5(req.body.password);

  const user = new User(req.body);
  await user.save();

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/");
};

// [GET] /user/login
module.exports.login = async (req, res) => {
  res.render("client/pages/user/login", {
    pageTitle: "Đăng nhập tài khoản",
  });
};

// [POST] /user/login
module.exports.loginPost = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const user = await User.findOne({
    email: email,
    deleted: false,
  });

  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect("back");
    return;
  }

  if (md5(password) != user.password) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect("back");
    return;
  }

  if (user.status == "inactive") {
    req.flash("error", "Tài khoản đã bị khóa");
    res.redirect("back");
    return;
  }

  res.cookie("tokenUser", user.tokenUser);
  res.redirect("/");
};

// [GET] /user/logout
module.exports.logout = (req, res) => {
  res.clearCookie("tokenUser");
  res.redirect("/user/login");
};

// [GET] /user/password/forgot
module.exports.forgotPassword = (req, res) => {
  res.render("client/pages/user/forgot-password", {
    pageTitle: "Quên mật khẩu",
  });
};

// [POST] /user/password/forgot
module.exports.forgotPasswordPost = async (req, res) => {
  const email = req.body.email;

  const user = await User.findOne({ email: email });

  if (!user) {
    req.flash("error", "Email không tồn tại");
    res.redirect("back");
    return;
  }

  const otp = generateHelper.generateRandomNumber(8);

  const objectForgotPassword = {
    email: email,
    otp: otp,
    expireAt: new Date(Date.now() + 2 * 60 * 1000),
  };

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  const subject = `Mã OTP xác minh mấy lại mật khẩu`;
  const html = `Mã OTP xác minh lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng 1 phút. Lưu ý không được để lộ mã OTP`;

  sendMail(email, subject, html);

  res.redirect(`/user/password/otp?email=${email}`);
};

// [GET] /user/password/otp
module.exports.otpPassword = (req, res) => {
  const email = req.query.email;

  res.render("client/pages/user/otp-password", {
    pageTitle: "Nhập mã OTP xác thực",
    email: email,
  });
};

// [POST] /user/password/otp
module.exports.otpPasswordPost = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp,
  });

  if (!result) {
    req.flash("error", "OTP không hợp lệ");
    res.redirect("back");
    return;
  }

  const user = await User.findOne({ email: email });

  res.cookie("tokenUser", user.tokenUser);

  res.redirect("/user/password/reset");
};

// [GET] /user/password/reset
module.exports.resetPassword = async (req, res) => {
  res.render("client/pages/user/reset-password", {
    pageTitle: "Đổi mật khẩu",
  });
};

// [POST] /user/password/reset
module.exports.resetPasswordPost = async (req, res) => {
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const tokenUser = req.cookies.tokenUser;

  if (password != confirmPassword) {
    req.flash("error", " Xác nhận mật khẩu không trùng khớp");
    res.redirect("back");
    return;
  }

  await User.updateOne(
    {
      tokenUser: tokenUser,
    },
    {
      password: md5(password),
    }
  );

  res.redirect("/");
};
