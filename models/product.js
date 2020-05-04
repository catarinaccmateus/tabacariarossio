"use strict";

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  type: {
    enum: ["watch", "pen", "shaver", "lighter", "other"],
    type: String
  },
  model: String,
  brand: String,
  price: Number,
  barCode: String,
  internalCode: String,
  description: String,
  image: {
        type: Array,
        default: ['https://res.cloudinary.com/dgmvfq29c/image/upload/v1586793875/Tabacaria-Rossio-Images-Uploads/default_image_mxkvcj.png'],
      },
  available_quantity: {
    type: Number,
    default: 1
  },
  order_quantity: {
    type: Number,
    default: 1
  }, 
  creationDate: { type: Date, default: Date.now },
  lastUpdate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", schema);
