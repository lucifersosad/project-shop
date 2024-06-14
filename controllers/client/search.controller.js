const searchHelper = require("../../helpers/search");
const productHelper = require("../../helpers/products")
const Product = require("../../models/product.model");
// [GET] /search
module.exports.index = async (req, res) => {
  const find = {
    status: "active",
    deleted: false,
  };

  const objectSearch = searchHelper(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }

  const products = await Product.find(find)
  const newProducts = productHelper.priceNewProducts(products)

  res.render("client/pages/search/index", {
    pageTitle: "Kết quả tìm kiếm",
    keyword: objectSearch.keyword,
    products: newProducts
  });
};
