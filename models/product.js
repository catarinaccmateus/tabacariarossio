"use strict";

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  type: {
    enum: ["watch", "pen"],
    type: String
  },
  model: String,
  brand: String,
  price: Number,
  barCode: String,
  internalCode: String,
  description: String,
  image: {
    type: String,
    default: "https://www.imore.com/sites/imore.com/files/styles/larger_wm_brw/public/field/image/2015/04/apple-watch-world-clock-hero.jpg?itok=AkNT8iYB"
  },
  available_quantity: {
    type: Number,
    default: 1
  },
  order_quantity: {
    type: Number,
    default: 1
  },
  creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", schema);
