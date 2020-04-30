const { Router } = require("express");
const router = new Router();
const Order = require("./../models/order");
const nodemailer = require("nodemailer");

router.post("/create-order", (req, res, next) => {
  const { basket, user, total } = req.body;
  Order.create({
    user_id: user,
    products_basket: basket,
    total,
  })
    .then((order) => {
      res.json(order);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.post("/payment-method-selected", (req, res, next) => {
  const { order_id, payment_option } = req.body;
  Order.findByIdAndUpdate(order_id, {
    payment_method: payment_option,
  })
    .populate("user_id")
    .then((order) => {
      const user = order.user_id;
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: `${process.env.EMAIL_ADDRESS}`,
          pass: `${process.env.EMAIL_PASSWORD}`,
        },
      });

      const mailOptions = {
        from: "tabacariarossioteste@gmail.com",
        to: `${user.email}`,
        subject: "Confirmação de encomenda",
        text: `Boa tarde ${user.name}, \n \n 
        Confirmamos a receção da encomenda com o código ${order._id} \n
        O valor total é de ${order.total}.
        Poderá consultar os detalhes da encomenda em  http://localhost:3000/my-orders/${order._id}. \n
        O pagamento encontra-se pendente.
        Por favor realize a transferência do valor total para o IBAN XXXXXXXXXXXXXX e envie o comprovativo de pagamento para xxxx@xxx com o número de encomenda em assunto. Tem 3 dias úteis para finalizar o seu pagamento, sendo que a encomenda será cancelada automáticamente caso não proceda ao pagamento do seu valor. \n
        Cumprimentos, \n
        A Equipa \n
        Tabacaria Rossio`,
      };

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) {
          console.log("there was an error", err);
        } else {
          res.status(200).json("Recovery email sent.");
        }
      });
      res.json(order);
    })
    .catch((err) => {
      res.json(err);
      next(err);
    });
});

router.post("/get-order-details/:order_id", (req, res, next) => {
  const orderId = req.params.order_id;
  console.log(orderId);
  Order.findById(orderId)
    .populate("user_id")
    .then((order) => {
      res.json({ order });
    })
    .catch((err) => {
      res.json(err);
      next(err);
    });
});

router.get("/get-all-orders/:user_id", (req, res, next) => {
  const user = req.params.user_id;
  Order.find({
    user_id: user,
  })
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => {
      res.json(err);
    });
});

router.get("/get-all-orders", (req, res, next) => {
  Order.find()
    .populate("user_id")
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
