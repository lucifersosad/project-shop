const Role = require("../../models/role.model");
const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");

// [GET] /admin/roles
module.exports.index = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Role.find(find);

  for (const record of records) {
    const userCreate = await Account.findOne({
      _id: record.createdBy.account_id,
    });
    if (userCreate) {
      record.userCreate = userCreate.fullName;
    }

    const updatedBy = record.updatedBy.slice(-1)[0];
    
    if (updatedBy) {
      const userUpdate = await Account.findOne({
        _id: updatedBy.account_id,
      });
      if (userUpdate) {
        record.userUpdate = userUpdate.fullName;
      }
    }
  }

  res.render("admin/pages/roles/index", {
    pageTitle: "Nhóm quyền",
    records: records,
  });
};

// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo nhóm quyền",
  });
};

// [POST] /admin/roles/create
module.exports.createPost = async (req, res) => {
  req.body.createdBy = {
    account_id: res.locals.user.id,
  };
  const record = new Role(req.body);
  await record.save();

  res.redirect(`${systemConfig.prefixAdmin}/roles`);
};

// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    let find = {
      _id: id,
      deleted: false,
    };

    const data = await Role.findOne(find);

    res.render("admin/pages/roles/edit", {
      pageTitle: "Sửa nhóm quyền",
      data: data,
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};

// [PATCH] /admin/roles/edit/:id
module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedBy = {
      account_id: res.locals.user.id,
      updatedBy: new Date(),
    };

    await Role.updateOne(
      { _id: id },
      {
        ...req.body,
        $push: { updatedBy: updatedBy },
      }
    );

    req.flash("success", "Cập nhật nhóm quyền thành công");
  } catch (error) {
    req.flash("error", "Cập nhật nhóm quyền thất bại");
  }
  res.redirect("back");
};

// [GET] /admin/roles/permissions
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false,
  };

  const records = await Role.find(find);

  res.render("admin/pages/roles/permissions", {
    pageTitle: "Phân quyền",
    records: records,
  });
};

// [PATCH] /admin/roles/permissions
module.exports.permissionsPatch = async (req, res) => {
  try {
    const roles = JSON.parse(req.body.roles);
    for (const role of roles) {
      const id = role.id;
      const permissions = role.permissions;
      await Role.updateOne({ _id: id }, { permissions: permissions });
    }
    req.flash("success", "Cập nhật phân quyền thành công");
  } catch (error) {
    req.flash("error", "Cập nhật phân quyền thất bại");
  }

  res.redirect("back");
};

// [DELETE] /admin/roles/:id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  await Role.updateOne(
    { _id: id },
    {
      deleted: true,
      deletedBy: {
        account_id: res.locals.user.id,
        deletedAt: new Date(),
      },
    }
  );

  req.flash("success", "Xóa nhóm quyền thành công");

  res.redirect("back");
};
