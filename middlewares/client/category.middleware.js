const createTreeHelper = require("../../helpers/createTree");
const ProductCategory = require("../../models/product-category.model");
module.exports.category = async (req, res, next) => {
  const productCategories = await ProductCategory.find({
    deleted: false,
  });

  const newproductCategories = createTreeHelper(productCategories);
  res.locals.layoutProductCategories = newproductCategories
  next();
};
