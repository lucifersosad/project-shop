const productHelper = require("../../helpers/products");
const productCategoryHelper = require("../../helpers/products-category");
const Product = require("../../models/product.model");
const ProductCategory = require("../../models/product-category.model");

// [GET] /products
module.exports.index = async (req, res) => {
  const products = await Product.find({
    status: "active",
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = productHelper.priceNewProducts(products);

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

// [GET] /products/:slugCategory
module.exports.category = async (req, res) => {
  const slug = req.params.slugCategory;
  const category = await ProductCategory.findOne({
    slug: slug,
    deleted: false,
  });

  const subCategories = await productCategoryHelper.getSubCategory(category.id);

  const subCategoryIds = subCategories.map((item) => item.id);

  const products = await Product.find({
    product_category_id: { $in: [category.id, ...subCategoryIds] },
    deleted: false,
  }).sort({ position: "desc" });

  const newProducts = productHelper.priceNewProducts(products);

  res.render("client/pages/products/index", {
    pageTitle: category.title,
    products: newProducts,
  });
};
