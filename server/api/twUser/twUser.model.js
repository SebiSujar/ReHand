'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TwUserSchema = new Schema({
  id: String, 
  followers: Number, 
  following: Number
});

module.exports = mongoose.model('TwUser', TwUserSchema);