const productHelper = require("../../helpers/products");
const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

// [GET] /cart
module.exports.index = async (req, res) => {
  const cart = res.locals.miniCart;

  let totalPrice = 0;

  if (cart.products.length > 0) {
    for (const item of cart.products) {
      const productId = item.product_id;

      const infoProduct = await Product.findOne({
        _id: productId,
      });

      infoProduct.priceNew = productHelper.getNewPrice(infoProduct);

      item.infoProduct = infoProduct;

      item.totalPrice = infoProduct.priceNew * item.quantity;

      totalPrice += item.totalPrice;
    }
  }

  cart.totalPrice = totalPrice;

  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart,
  });
};

// [POST] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);

  const cart = await Cart.findOne({
    _id: cartId,
  });

  const existProductInCart = cart.products.find(
    (item) => item.product_id == productId
  );

  if (existProductInCart) {
    console.log("update quantity");
    const newQuanity = existProductInCart.quantity + quantity;

    await Cart.updateOne(
      {
        _id: cartId,
        "products.product_id": productId,
      },
      {
        "products.$.quantity": newQuanity,
      }
    );
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    };

    await Cart.updateOne({ _id: cartId }, { $push: { products: objectCart } });
  }

  res.redirect("back");
};

// [GET] /cart/update/:productId/:quantity
module.exports.update = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = req.params.quantity;

  await Cart.updateOne(
    {
      _id: cartId,
      "products.product_id": productId,
    },
    {
      "products.$.quantity": quantity,
    }
  );

  req.flash("success", "Đã cập nhật số lượng!");

  res.redirect("back");
};

// [GET] /cart/delete/:productId
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;

  await Cart.updateOne(
    {
      _id: cartId,
    },
    {
      $pull: { products: { product_id: productId } },
    }
  );

  req.flash("success", "Đã xóa sản phẩm khỏi giỏ hàng!");

  res.redirect("back");
};
