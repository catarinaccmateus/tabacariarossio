"use strict";

const { Router } = require("express");
const router = new Router();
const User = require("./../models/user");
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer");
const routeGuard = require("./../middleware/route-guard");
const routeGuardAdmin = require("./../middleware/route-guard-for-admin");
const crypto = require("crypto");
//import crypto from 'crypto'; -> Parsing error: 'import' and 'export' may appear only with 'sourceType: module'

//NODEMAILER SET UP
const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: `${process.env.EMAIL_ADDRESS}`,
            pass: `${process.env.EMAIL_PASSWORD}`,
          },
        });
let mailOptions = "";

//SIGN-UP A NEW USER
router.post("/sign-up", (req, res, next) => {
  const { name, username, email, password, role } = req.body;
  bcryptjs
    .hash(password, 10)
    .then((hash) => {
      return User.create({
        name,
        username,
        email,
        role,
        passwordHash: hash,
      });
    })
    .then((user) => {
      if (user.role === "user") {
        //If a user is going to sign up his session is immediately started. Otherwise, if the ADMIN signs up an employee
        //its session won't be started
        req.session.user = user._id;
      }
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

//SIGN-IN ONE USER
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

//SIGN-OUR ONE USER
router.post("/sign-out", (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

//GET INFO ABOUT THE USER THAS IS LOGGED IN
router.get("/user-information", routeGuard, async (req, res, next) => {
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

//EDITING ONE USER DETAILS
router.post("/edit-user", routeGuard, (req, res, next) => {
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

//1. RECOVER PASSWORD OF ONE USER SENDING LINK VIA NODEMAILER
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


        mailOptions = {
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

//2. CHECKING IF PASSWORD RECOVER LINK IS VALID
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

//3. UPDATING PASSWORD VIA EMAIL
router.post("/updatePasswordViaEmail", (req, res, next) => {
  const { email, password, resetPasswordToken } = req.body;

  User.findOne({ email: email, resetPasswordToken: resetPasswordToken })
    .then((user) => {
      if (user !== null) {
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

//UPDATING PASSWORD WHEN LOGGED IN
router.post("/updatePassword", routeGuard, (req, res, next) => {
  const userId = req.session.user;
  const { password, new_password } = req.body;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.json("No user logged in.");
        res.status(403);
        return Promise.reject(new Error("No user logged in."));
      } else {
        return bcryptjs.compare(password, user.passwordHash);
      }
    })
    .then((result) => {
      if (result) {
        bcryptjs.hash(new_password, 10).then((hash) => {
          User.findById(userId)
            .then((user) => {
              user.passwordHash = hash;
              user.save();
              console.log("user updated password", user);
              res.status(200).json("Password updated");
            })
            .catch((err) => {
              console.log("not possible to update password", err);
              res.json("Server error when trying to update password");
              res.status(400);
            });
        });
      } else {
        res.json("Wrong Password.");
        res.status(401);
        return Promise.reject(new Error("Wrong Password."));
      }
    })
    .catch((err) => {
      console.log("error", err);
    });
});

//GET ALL EMPLOYEES
router.get("/get-employees", routeGuardAdmin, async (req, res, next) => {
  User.find({ role: "employee" })
    .then((users) => {
      res.json({ users });
    })
    .catch((err) => {
      res.json(err);
    });
});

//DELETE USER
router.delete("/delete-user/:id", routeGuard, async (req, res, next) => {
  const user_id = req.params.id;
  if (!user_id) {
    res.json({});
  } else {
    try {
      await User.findByIdAndDelete(user_id)
      .then(user => {
        mailOptions = {
          from: "tabacariarossioteste@gmail.com",
          to: `${user.email}`,
          subject: "Confirmação de eliminação de conta.",
          text: `Boa tarde ${user.name}, \n
        Confirmamos que a sua conta eliminada da nossa base de dados a partir deste momento. \n \n
        Esperamos que nos volte a visitar brevemente. \n
        Cumprimentos, \n
        A Equipa \n
        Tabacaria Rossio`,
        };

        transporter.sendMail(mailOptions, (err, response) => {
          if (err) {
            console.log("there was an error", err);
          } else {
            res.status(200).json("User deleted from database.");
          }
        });
      })
    } catch (error) {
      next(error);
    }
  }
});

module.exports = router;
