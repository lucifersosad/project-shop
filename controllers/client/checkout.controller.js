const productHelper = require("../../helpers/products");
const Cart = require("../../models/cart.model");
const Order = require("../../models/order.model");
const Product = require("../../models/product.model");

// [GET] /checkout
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

  res.render("client/pages/checkout/index", {
    pageTitle: "Đặt hàng",
    cartDetail: cart,
  });
};

// [POST] /checkout/order
module.exports.order = async (req, res) => {
  const cart = res.locals.miniCart;

  userInfo = req.body;

  let products = [];

  for (const product of cart.products) {
    const objectProduct = {
      product_id: product.product_id,
      quantity: product.quantity,
    };

    const productInfo = await Product.findOne({
      _id: product.product_id,
    });

    objectProduct.price = productInfo.price;
    objectProduct.discountPercentage = productInfo.discountPercentage;

    products.push(objectProduct);
  }

  const objectOrder = {
    cart_id: cart.id,
    userInfo: userInfo,
    products: products,
  };

  const order = new Order(objectOrder);
  await order.save();

  await Cart.updateOne(
    {
      _id: cart.id,
    },
    {
      products: [],
    }
  );

  res.redirect(`/checkout/success/${order.id}`);
};

// [GET] /checkout/success/:orderId
module.exports.success = async (req, res) => {
  const orderId = req.params.orderId;

  let totalPrice = 0;

  const order = await Order.findOne({ _id: orderId });

  for (const product of order.products) {
    const productInfo = await Product.findOne({
      _id: product.product_id,
    }).select("title thumbnail");

    product.productInfo = productInfo;

    product.priceNew = productHelper.getNewPrice(product);
    product.totalPrice = product.priceNew * product.quantity;

    totalPrice += product.totalPrice;
  }

  order.totalPrice = totalPrice;

  res.render("client/pages/checkout/success", {
    pageTitle: "Đặt hàng thành công",
    order: order,
  });
};
