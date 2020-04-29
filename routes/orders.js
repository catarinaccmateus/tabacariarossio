const { Router } = require("express");
const router = new Router();
const Order = require("./../models/order");

router.post("/create-order", (req, res, next) => {
  console.log("Im in the backend", req.body);
  const { basket, user, total } = req.body;
  console.log('bsket', basket);
  Order.create({
    user_id: user,
    products_basket: basket,
    total,
  })
    .then((order) => {
      res.json(order)
    })
    .catch((err) => {
      res.json(err)
    });
});

module.exports = router;
