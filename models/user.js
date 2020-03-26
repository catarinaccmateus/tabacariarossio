"use strict";

const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  surname: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true
  },
  passwordHash: {
    type: String
  },
  phoneNumber: {
    type: Number
  },
  taxNumber: {
    type: Number
  },
  address: {
    line1: String,
    line2: String,
    zipcode: String,
    city: String,
    country: {
      type: String,
      default: "Portugal"
    }
  },
  taxAddress: {
    line1: String,
    line2: String,
    zipcode: String,
    city: String,
    country: {
      type: String,
      default: "Portugal"
    }
  },
  role: {
    type: String,
    enum: ["user", "admin", "employee"],
    default: "user"
  },
  creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", schema);
