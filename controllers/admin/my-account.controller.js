const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");
const md5 = require("md5");

// [GET] /admin/my-account
module.exports.index = (req, res) => {
  res.render("admin/pages/my-account/index", {
    pageTitle: "Thông tin cá nhân",
  });
};

// [GET] /admin/my-account/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    let find = {
      _id: id,
      deleted: false,
    };

    const data = await Account.findOne(find);

    res.render("admin/pages/my-account/edit", {
      pageTitle: "Chỉnh sửa thông tin cá nhân",
      data: data,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/my-account`);
  }
};

// [PATCH] /admin/my-account/edit/:id
module.exports.editPatch = async (req, res) => {
  const id = req.params.id;

  const emailExists = await Account.findOne({
    _id: { $ne: id },
    email: req.body.email,
    deleted: false,
  });

  if (emailExists) {
    req.flash("error", "Email đã tồn tại");
  } else {
    if (req.body.password) {
      req.body.password = md5(req.body.password);
    } else {
      delete req.body.password;
    }
    try {
      await Account.updateOne({ _id: id }, req.body);
      req.flash("success", "Cập nhật tài khoản thành công");
    } catch (error) {
      req.flash("error", "Cập nhật tài khoản thất bại");
    }
  }
  res.redirect("back");
};

