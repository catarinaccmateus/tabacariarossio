"use strict";

const { Router } = require("express");
const router = new Router();
const Product = require("./../models/product");
const uploader = require("./../middleware/multer-configuration");

router.post("/create", uploader.array("image", 5), async (req, res, next) => {
  const {
    type,
    model,
    brand,
    price,
    barCode,
    internalCode,
    description,
    available_quantity,
  } = req.body;

  let imageUrls = [];
  for (let i = 0; i < req.files.length; i++) {
    imageUrls.push(req.files[i].url);
  }

  if (imageUrls.length === 0) {
    imageUrls = [
      "https://res.cloudinary.com/dgmvfq29c/image/upload/v1586793875/Tabacaria-Rossio-Images-Uploads/default_image_mxkvcj.png",
    ];
  }

  Product.create({
    type,
    model,
    brand,
    image: imageUrls,
    price: price * 100,
    barCode,
    internalCode,
    description,
    available_quantity,
  })
    .then((product) => {
      res.json({ product });
    })
    .catch((error) => {
      console.log("not possible to create due to", error);
      next(error);
    });
});

router.get("/display-all", async (req, res, next) => {
  try {
    const product = await Product.find();
    res.json({ product });
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
      res.json({ product });
    } catch (error) {
      next(error);
    }
  }
});

router.post("/delete/:id", async (req, res, next) => {
  const productId = req.params.id;
  if (!productId) {
    res.json({});
  } else {
    try {
      await Product.findByIdAndDelete(productId);
      res.json({});
    } catch (error) {
      next(error);
    }
  }
});

router.post("/edit/:id", async (req, res, next) => {
  const productId = req.params.id;

  const {
    model,
    brand,
    price,
    barCode,
    internalCode,
    description,
    available_quantity,
  } = req.body;
  Product.findByIdAndUpdate(productId, {
    model,
    brand,
    price: price * 100,
    barCode,
    internalCode,
    description,
    available_quantity,
    lastUpdate: new Date(),
  })
    .then((product) => {
      res.json({ product });
    })
    .catch((error) => {
      console.log("not possible to update due to", error);
      next(error);
    });
});

router.post("/delete-image", (req, res, next) => {
  const { id, index } = req.body;
  Product.findById(id)
    .then((product) => {
      if (product.image.length >= 2) {
        product.image.splice(index, 1);;
        product.markModified("image");
        //since image is an array the db wont know it change, so we need to use markModified before saving.
        product.save();
        res.json("Image deleted");
      } else {
        product.image = undefined;
        product.save();
        res.json("Image deleted");
      }
    })
    .catch((err) => {
      console.log("not possible to delete image due to", err);
      res.json("Not possible to delete image.");
      res.status(403);
    });
});

router.post(
  "/uploadImage/:id",
  uploader.single("image"),
  async (req, res, next) => {
    const productId = req.params.id;
    const imageUrl = req.file.url;
    Product.findByIdAndUpdate(
      productId,
      { $push: { image: imageUrl } },
      function(err, result) {
        if (err) {
          res.send(err);
        } else {
          console.log('this is the result', result);
          res.send("Image added");
        }
      }
    );
  }
);

module.exports = router;
