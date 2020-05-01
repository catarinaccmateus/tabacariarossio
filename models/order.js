"use strict";

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
  products_basket: Array,
  total: Number,
  status: {
    type: String,
    enum: ["ordered", "paid", "shipped", "canceled"],
    default: "ordered",
  },
  invoice: {
    enum: ["issued", "not issued"],
    default: "not issued",
    type: String,
  },
  payment_method: {
    type: String,
    enum: ["bank_transfer", "credit_card", "mbway"],
  },
  comments: {
    type: Array,
    default: [{text: "", date: "", user: ""}]
  },
  creationDate: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", schema);
