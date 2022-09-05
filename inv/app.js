// import mongoose from "mongoose";
// import dotenv from "dotenv";

const dotenv = require('dotenv');
const mongoose = require('mongoose');

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const hbs = require('hbs');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var accountsRouter = require('./routes/accounts');
var productsRouter = require('./routes/products');
var categoryRouter = require('./routes/category');

var app = express();

dotenv.config();

//Database Connectivity
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://vedant:vedant@inventorymangement.aculpi8.mongodb.net/?retryWrites=true&w=majority";
async function main() {
  const client = new MongoClient(uri);

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make the appropriate DB calls
    // await listDatabases(client);
    console.log("database connected..........");
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
main().catch(console.error);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/accounts', accountsRouter);
app.use('/products', productsRouter);
app.use('/categories', categoryRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
