"use strict";

const { Router } = require("express");
const router = new Router();
const User = require("./../models/user");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
//import crypto from 'crypto'; -> Parsing error: 'import' and 'export' may appear only with 'sourceType: module'

router.post("/sign-up", (req, res, next) => {
  const { name, username, email, password } = req.body;
  bcryptjs
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        name,
        username,
        email,
        passwordHash: hash,
      });
    })
    .then((user) => {
      req.session.user = user._id;
      res.json({ user });
    })
    .catch((error) => {
      if (error.code === 11000) {
        res.json({ error: "Duplicated email" });
      }
      console.log("error!", error);
      next(error);
    });
});

router.post("/edit-user", (req, res, next) => {
  const {
    name,
    surname,
    email,
    phoneNumber,
    taxNumber,
    address,
    taxAddress,
  } = req.body;
  const userId = req.session.user;
  User.findByIdAndUpdate(userId, {
    name,
    surname,
    email,
    phoneNumber,
    taxNumber,
    address,
    taxAddress,
  })
    .then((user) => {
      res.json({ user });
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/sign-in", (req, res, next) => {
  let userId;
  const { email, password } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("There's no user with that email."));
      } else {
        userId = user._id;
        return bcryptjs.compare(password, user.passwordHash);
      }
    })
    .then((result) => {
      if (result) {
        req.session.user = userId;
        res.redirect("/private");
      } else {
        return Promise.reject(new Error("Wrong password."));
      }
    })
    .catch((error) => {
      next(error);
    });
});

router.post("/sign-out", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

router.get("/user-information", async (req, res, next) => {
  const userId = req.session.user;
  //console.log('I am in the server, the user id is', req.session.user);
  if (!userId) {
    res.json({});
  } else {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error("Signed in user not found");
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
});

router.post("/password-recovery", (req, res, next) => {
  if (req.body.email === "") {
    res.status(400).send("email required");
  }
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user === null) {
        console.log("user is null", user);
        // res.status(404).render();
        return res.status(403).json( "No user with this email in DB." );
    
      } else {
        const token = crypto.randomBytes(20).toString("hex");

        User.update({
          resetPasswordToken: token,
          resetPasswordExpires: Date.now() + 3600000,
        });

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
          subject: "Link para Reset de Password",
          text: `Boa tarde ${user.name}, \n \n 
        Está a receber este e-mail porque requesitou a recuperação de password. \n \n
        Por favor, aceda ao seguinte link: \n
        http://localhost:3000/reset/${token} \n
        Se não fez esta requesição, por favor ignore o e-mail e a sua password não será alterada. \n
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
      }
    })
    .catch((error) => {
      console.log("this is the error", error);
    });
});

module.exports = router;
