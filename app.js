"use strict";

const { join } = require("path");
const express = require("express");
const createError = require("http-errors");
const connectMongo = require("connect-mongo");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");
const logger = require("morgan");
const mongoose = require("mongoose");
const sassMiddleware = require("node-sass-middleware");
//const serveFavicon = require("serve-favicon");
const basicAuthenticationDeserializer = require("./middleware/basic-authentication-deserializer.js");
const bindUserToViewLocals = require("./middleware/bind-user-to-view-locals.js");
const indexRouter = require("./routes/index");
const authenticationRouter = require("./routes/authentication");
const productsRouter = require("./routes/products");
const ordersRouter = require("./routes/orders");

const app = express();

//app.use(express.static(join(__dirname, "public")));
app.use(express.static(join(__dirname, "client/build")));
app.use(logger("dev"));

app.set("views", join(__dirname, "views"));
app.set("view engine", "hbs");

//app.use(serveFavicon(join(__dirname, "public/images", "favicon.ico")));
/*app.use(
  sassMiddleware({
    src: join(__dirname, "public"),
    dest: join(__dirname, "public"),
    outputStyle:
      process.env.NODE_ENV === "development" ? "nested" : "compressed",
    force: process.env.NODE_ENV === "development",
    sourceMap: true,
  })
);*/

//app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 4, //equivalent to 4 hours
      sameSite: "lax",
      httpOnly: true,
      //secure: process.env.NODE_ENV === "production",
    },
    store: new (connectMongo(expressSession))({
      mongooseConnection: mongoose.connection,
      ttl: 60 * 60 * 24, // Keeps session open for 1 day
    }),
  })
);
app.use(basicAuthenticationDeserializer);
app.use(bindUserToViewLocals);

app.use("/api/authentication", authenticationRouter);
app.use("/api/products", productsRouter);
app.use("/api/orders", ordersRouter);
app.get("*", (req, res, next) => {
  res.sendFile(join(__dirname, "client/build/index.html"));
});

// Catch missing routes and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Catch all error handler
app.use((error, req, res, next) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get("env") === "development" ? error : {};

  res.status(error.status || 500);
  res.json({ type: "error", error: { message: error.message } });
  //res.render("error");
});

module.exports = app;
