"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const cookieSession = require('cookie-session')

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// // Twilio Credentials
// var accountSid = 'ACa16f1d16fc3ba8da7ba9d8ec18aa690b'
// var authToken = 'a1c13cc4655406b94a8d34c2f8deaa65'
//
// //require the Twilio module and create a REST client
// var client = require('twilio')(accountSid, authToken);
// client.messages.create({
//   to: '<ToNumber>',
//     from: '<FromNumber>',
//       body: '<BodyText>',
//       }, function (err, message) {
//         console.log(message.sid);
//       });
//


// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key']
}))
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("registration");
})

app.post("/register", (req, res) => {
 // TO DO: SEED DATA & EMAIL & REDIRECT TO HOME
})

app.get("/login", (req, res) => {
  console.log('REQ PARAMS', req.query);
  if (req.query.loginFailed) {
    console.log('LOGIN FAILED TRUE')
    res.render('login', {loginFailed: true});
  } else {
    console.log('LOGIN FAILED FALSE')
    res.render('login', {loginFailed: false});
  }
})


app.post("/login", (req, res) => {
    knex
    .select('email', 'password')
    .from('customers')
    .then((results) => {
      console.log('results:',results);
      if (req.body.email === results[0].email && req.body.password === results[0].password) {
        req.session.email = results[0].email;
        res.redirect('/')
      } else {
        res.redirect('/login?loginFailed=true')
      }
    })

  console.log('email:', req.body.email);
  console.log('password:', req.body.password);
})

app.get('/logout', (req, res) => {
  req.session = null
})


app.get("/menu", (req, res) => {
  res.render('menu');
})

app.get("/menu/cart", (req, res) => {
  res.render('menu/cart');
})

// app.post("/menu", (req, res) => {
//
// })

app.get("/menu/cart/cart", (req, res) => {
  console.log("71")

  knex("dishes")
  .join("order_dishes", "dishes.id" , "=" , "order_dishes.dishes_id")
  .join("orders","orders.id", "=", "order_dishes.order_id")
  .select('*')
    .then((results) => {
      res.json(results)

    })
  })



  // router.get('/menu/cart', (req, res) => {
  //   knex('orders')
  //   .join('order_dishes', 'orders.id', '=', 'order_dishes.order_id')
  //   .join('dishes', 'dishes.id', '=', 'order_dishes.dishes_id')
  //   .select('*')
  //   .then((results) => {
  //     console.log(results)
  //     // res.render('menu', {results});
  //   })
  // });

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
