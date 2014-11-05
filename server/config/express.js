/**
 * Express configuration
 */

'use strict';

var express         = require('express');
var favicon         = require('static-favicon');
var morgan          = require('morgan');
var compression     = require('compression');
var bodyParser      = require('body-parser');
var methodOverride  = require('method-override');
var cookieParser    = require('cookie-parser');
var errorHandler    = require('errorhandler');
var path            = require('path');
var config          = require('./environment');
var uuid            = require('node-uuid');

module.exports = function(app) {
  var env = app.get('env');
  app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
   });

  app.set('views', config.root + '/server/views');
  app.engine('html', require('ejs').renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(methodOverride());
  app.use(cookieParser('superEmprendimiento2014'));

  app.use(function(req, res, next){
    console.log("cookie");
    if (!req.cookies.JSESSIONID || req.cookies.JSESSIONID == "undefined") {
      console.log("dont have cookie");
      var theUuid = uuid.v4();
      console.log("there is not, asigning cookie " + theUuid);
      // Guardo en las sesions con el nombre uuid con el value de un numero aleatorio y expira en una semana
      console.log("created: " + theUuid);
      res.cookie('JSESSIONID', theUuid, {maxAge: 604800000});
    }
    //console.log("there is a cookie, " + req.cookies.uuid);
    next();
  });

  if ('production' === env) {
    app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
    app.use(express.static(path.join(config.root, 'public')));
    app.set('appPath', config.root + '/public');
    app.use(morgan('dev'));
  }

  if ('development' === env || 'test' === env) {
    app.use(express.static(path.join(config.root, '.tmp')));
    app.use(express.static(path.join(config.root, 'client')));
    app.set('appPath', 'client');
    app.use(morgan('dev'));
    app.use(errorHandler()); // Error handler - has to be last
  }
};