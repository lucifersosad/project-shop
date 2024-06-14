const productHelper = require("../../helpers/products")
const Product = require("../../models/product.model");
// [GET] /
module.exports.index = async (req, res) => {
  const featuredProducts = await Product.find({
    featured: "1",
    deleted: false,
    status: "active",
  });
  
  const newFeaturedProducts = productHelper.priceNewProducts(featuredProducts)

  res.render("client/pages/home/index", {
    pageTitle: "Trang chủ",
    featuredProducts: newFeaturedProducts,
  });
};
