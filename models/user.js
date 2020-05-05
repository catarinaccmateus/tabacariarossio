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
  resetPasswordToken: String,
  resetPasswordExpires: Date,
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
  commercial_agreement:{
    type: Boolean,
    default: "false"
  },
  role: {
    type: String,
    enum: ["user", "admin", "employee"],
    default: "user"
  },
  orders: {
      type: mongoose.Types.ObjectId,
      ref: 'Order'
  },
  creationDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", schema);
