"use strict";

const { Router } = require("express");
const router = new Router();
const Product = require("./../models/product");

router.post("/create", (req, res, next) => {
  const {
    type,
    model,
    brand,
    price,
    barCode,
    internalCode,
    description
  } = req.body;
  Product.create({
    type,
    model,
    brand,
    price,
    barCode,
    internalCode,
    description
  })
    .then(product => {
      res.json({ product });
    })
    .catch(error => {
      next(error);
    });
});

router.get("/display-all", async (req, res, next) => {
  console.log('in backend');
    try {
      const product = await Product.find();
      res.json({product });
    } catch (error) {
      next(error);
    }
});

router.get("/info/:id", async (req, res, next) => {
  const productId = req.params.id;
  if (!productId) {
    res.json({});
  } else {
    try {
      const product = await Product.findById(productId);
      if (!product) throw new Error("Product not found");
      res.json({product });
    } catch (error) {
      next(error);
    }
  }
});

router.get("/delete/:id", async (req, res, next) => {
  const productId = req.params.id;
  if (!productId) {
    res.json({});
  } else {
    try {
      await Product.findByIdAndDelete(productId);
    } catch (error) {
      next(error);
    }
  }
});

module.exports = router;
