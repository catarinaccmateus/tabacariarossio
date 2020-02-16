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
  barcode: String,
  internalcodel: String,
  description: String,
  image: {
    type: String,
    default: "https://www.google.pt/url?sa=i&url=https%3A%2F%2Fwww.imore.com%2Fhow-set-default-weather-stock-world-clock-apple-watch&psig=AOvVaw3-L8obzFa1iGBOnWFRBLtt&ust=1581925554247000&source=images&cd=vfe&ved=0CAIQjRxqFwoTCODnhIzK1ecCFQAAAAAdAAAAABAD"
  },
  creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Product", schema);
