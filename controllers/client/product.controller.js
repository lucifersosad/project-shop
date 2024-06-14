const productHelper = require("../../helpers/products")
const Product = require("../../models/product.model");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = productHelper.priceNewProducts(products)

  res.render("client/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: newProducts,
  });
};

// [GET] /products/:slug
module.exports.detail = async (req, res) => {
  const slug = req.params.slug;

  try {
    const product = await Product.findOne({
      slug: slug,
      deleted: false,
      status: "active",
    });

    console.log(product);

    res.render("client/pages/products/detail", {
      pageTitle: "Chi tiết sản phẩm",
      product: product,
    });
  } catch {
    res.redirect("/products");
  }
};
