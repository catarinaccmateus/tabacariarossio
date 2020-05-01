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

router.get("/get-order-details/:order_id", (req, res, next) => {
  const orderId = req.params.order_id;
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

router.post("/update-order/:order_id", (req, res, next) => {
  const { key, value } = req.body.data;
  const orderId = req.params.order_id;
  Order.findByIdAndUpdate(orderId, { [key]: value })
    .populate("user_id")
    .then((order) => {
      const user = order.user_id;
      console.log("user", user);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: `${process.env.EMAIL_ADDRESS}`,
          pass: `${process.env.EMAIL_PASSWORD}`,
        },
      });

      let mailOptions = "";
      console.log("value", value);
      if (key === "status") {
        mailOptions = {
          from: "tabacariarossioteste@gmail.com",
          to: `${user.email}`,
          subject: "Alteração do estado de encomenda",
          text: `Boa tarde ${user.name}, \n \n 
        Confirmamos que o estado da encomenda com o código ${order._id} foi alterado para ${value}. \n
        Poderá consultar os detalhes da encomenda em  http://localhost:3000/my-orders/${order._id}. \n
        Cumprimentos, \n
        A Equipa \n
        Tabacaria Rossio`,
        };
      } else if (key === "invoice") {
        mailOptions = {
          from: "tabacariarossioteste@gmail.com",
          to: `${user.email}`,
          subject: `Fatura-recibo da encomenda ${order._id}`,
          text: `Boa tarde ${user.name}, \n \n 
        Confirmamos que a fatura-recibo da sua encomenda com o código ${order._id} foi emitida. \n
        Poderá consultar os detalhes da encomenda em  http://localhost:3000/my-orders/${order._id}. \n
        Cumprimentos, \n
        A Equipa \n
        Tabacaria Rossio`,
        };
      }
      console.log("mail options", mailOptions);
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
    });
});

router.post("/add-comment-order/:order_id", (req, res, next) => {
  const { text, user } = req.body.data;
  console.log(req.body);
  const orderId = req.params.order_id;
  Order.findByIdAndUpdate(
    orderId,
    {
      $push: {
        comments: {
          text,
          user,
          creationDate: new Date(),
        },
      },
    },
    function(err, result) {
      if (err) {
        res.send(err);
      } else {
        res.send("Comment added");
      }
    }
  );
});

module.exports = router;
