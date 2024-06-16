const productHelper = require("../../helpers/products");
const Product = require("../../models/product.model");
// [GET] /
module.exports.index = async (req, res) => {
  const featuredProducts = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  });

  const newProductsFeatured = productHelper.priceNewProducts(featuredProducts);

  const newProducts = await Product.find({
    deleted: false,
    status: "active",
  })
    .sort({ position: "desc" })
    .limit(6);

  const newProductsNew = productHelper.priceNewProducts(newProducts);

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    featuredProducts: newProductsFeatured,
    newProducts: newProductsNew,
  });
};
