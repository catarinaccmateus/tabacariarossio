'use strict';

const { Router } = require('express');
const router = new Router();
const User = require('./../models/user');
const bcryptjs = require('bcryptjs');

router.post('/sign-up', (req, res, next) => {
  const { name, username, email, password } = req.body;
  bcryptjs
    .hash(password, 10)
    .then(hash => {
      return User.create({
        name,
        username,
        email,
        passwordHash: hash
      });
    })
    .then(user => {
      req.session.user = user._id;
      res.json({ user });
    })
    .catch(error => {
      next(error);
    });
});

router.post('/edit-user', (req, res, next) => {
  const { name, surname, email, phoneNumber, taxNumber, address, taxAddress } = req.body;
  const userId = req.session.user;
   User.findByIdAndUpdate(userId, {
        name,
        surname,
        email,
        phoneNumber,
        taxNumber,
        address,
        taxAddress
      })
    .then(user => {
      res.json({ user });
    })
    .catch(error => {
      next(error);
    });
});

router.post('/sign-in', (req, res, next) => {
  let userId;
  const { email, password } = req.body;
  User.findOne({ email })
    .then(user => {
      if (!user) {
        return Promise.reject(new Error("There's no user with that email."));
      } else {
        userId = user._id;
        return bcryptjs.compare(password, user.passwordHash);
      }
    })
    .then(result => {
      if (result) {
        req.session.user = userId;
        res.redirect('/private');
      } else {
        return Promise.reject(new Error('Wrong password.'));
      }
    })
    .catch(error => {
      next(error);
    });
});

router.post('/sign-out', (req, res, next) => {
  req.session.destroy();
  res.redirect('/');
});

router.get("/user-information", async (req, res, next) => {
  const userId = req.session.user;
  //console.log('I am in the server, the user id is', req.session.user);
  if (!userId) {
    res.json({});
  } else {
    try {
      const user = await User.findById(userId);
      if (!user) throw new Error('Signed in user not found');
      res.json({ user });
    } catch (error) {
      next(error);
    }
  }
});

module.exports = router;
