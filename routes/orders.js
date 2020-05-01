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

// UPLOADING INVOICE WITH MULTER AND AWS S3
const AWS = require("aws-sdk");
const multer = require("multer");
var storage = multer.memoryStorage();
var upload = multer({ storage: storage });
let s3bucket = new AWS.S3({
  accessKeyId: process.env.AWS_API_KEY,
  secretAccessKey: process.env.AWS_API_SECRET,
  region: process.env.AWS_REGION,
});

router.post(
  "/uploadInvoice/:order_id",
  upload.single("file"),
  (req, res, next) => {
    const orderId = req.params.order_id;
    const file = req.file;
    console.log("file", file);
    const s3FileURL = process.env.AWS_Uploaded_File_URL_LINK;

    let params = {
      Bucket: process.env.AWS_API_BUCKET_NAME,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: "public-read",
    };

    s3bucket.upload(params, (err, data) => {
      if (err) {
        console.log("error", err);
        res.status(500).json({ error: true, Message: err });
      } else {
        console.log("success", data);

        let newFileUploaded = {
          fileLink: s3FileURL + file.originalname,
          s3_key: params.Key,
        };
        console.log("new file", newFileUploaded);
        Order.findByIdAndUpdate(
          orderId,
          { $push: { invoice_files: newFileUploaded } },
          (err, result) => {
            if (err) {
              res.send(err);
            } else {
              console.log("file added", result);
              res.send("File added");
            }
          }
        );
      }
    });
  }
);

router.post("/deleteInvoice/:order_id", (req, res, next) => {
  const orderId = req.params.order_id;
  const { key } = req.body;
  Order.findByIdAndUpdate(
    orderId,
    { $pull: { invoice_files: { s3_key: key } } },
    (err, result) => {
      if (err) {
        return next(err);
      }
      let params = {
        Bucket: process.env.AWS_API_BUCKET_NAME,
        Key: key,
      };

      s3bucket.deleteObject(params, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          res.send({
            status: "200",
            responseType: "string",
            response: "success",
          });
        }
      });
    }
  );

  /*)
  DOCUMENT.findByIdAndRemove(req.params.id, (err, result) => {
   
    //Now Delete the file from AWS-S3
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property
    let s3bucket = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION
    });

    let params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: result.s3_key
    };

    s3bucket.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.send({
          status: "200",
          responseType: "string",
          response: "success"
        });
      }
    });
  });*/
});

router.post("/update-order/:order_id", (req, res, next) => {
  const { key, value } = req.body.data;
  const orderId = req.params.order_id;
  Order.findByIdAndUpdate(orderId, { [key]: value })
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
      console.log("ERROR", err);
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
    (err, result) => {
      if (err) {
        res.send(err);
      } else {
        res.send("Comment added");
      }
    }
  );
});

module.exports = router;
