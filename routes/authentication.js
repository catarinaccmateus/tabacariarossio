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
        return res.status(403).json("No user with this email in DB.");
      } else {
        const token = crypto.randomBytes(20).toString("hex");

        user.resetPasswordExpires = Date.now() + 3600000;
        user.resetPasswordToken = token;
        user.save();

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

router.post("/reset", (req, res, next) => {
  User.findOne({
    resetPasswordToken: req.body.params,
    resetPasswordExpires: {
      $gt: Date.now(),
    },
  })
    .then((user) => {
      if (user === null) {
        res.json("Password reset link is invalid or has expired");
      } else {
        res.status(200).send({
          email: user.email,
          message: "Password Reset Link ok",
        });
      }
    })
    .catch((error) => {
      console.log("Couldnt find user due to", error);
    });
});

router.post("/updatePasswordViaEmail", (req, res, next) => {
  const { email, password, resetPasswordToken } = req.body;

  User.findOne({ email: email, resetPasswordToken: resetPasswordToken })
    .then((user) => {
      if (user !== null) {
        console.log("user is no null", user);
        bcryptjs.hash(password, 10).then((hash) => {
          user.password = hash;
          user.resetPasswordToken = null;
          user.resetPasswordExpires = null;
          user.save();
          res.status(200).send({ message: "Password updated" });
        });
      } else {
        console.log("the user is null, not found", user);
        res.status(404).json("No user exist in DB to update");
      }
    })
    .catch((err) => {
      console.log("there was an error", err);
    });
});

router.post("/updatePassword", (req, res, next) => {
  const userId = req.session.user;
  const { password, new_password } = req.body;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        console.log("user is null");
        res.json("No user logged in.");
        res.status(403);
        return Promise.reject(new Error("No user logged in."));
      } else {
        console.log("this is the user i am going to update", user);
        return bcryptjs.compare(password, user.passwordHash);
      }
    })
    .then((result) => {
      console.log("este e o resultado da comparacao", result);
      if (result) {
        bcryptjs.hash(new_password, 10).then((hash) => {
          User.findById(userId)
          .then(user => {
            user.passwordHash = hash;
            user.save();
            console.log('user updated password', user);
            res.status(200).json("Password updated");
          })
          .catch(err => {
            console.log('not possible to update password', err);
            res.json("Server error when trying to update password");
            res.status(400);
          })
        });
      } else {
        console.log("we found the user but the password is wrong");
        res.json("Wrong Password.");
        res.status(401);
        return Promise.reject(new Error("Wrong Password."));
      }
    })
    .catch((err) => {
      console.log("error", err);
    });
});

module.exports = router;
