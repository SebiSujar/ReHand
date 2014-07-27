'use strict';

var _ = require('lodash');
var User = require('./user.model');

// Get list of users


exports.UpdateFollowingFollowers = function(req, res) {
  User.find({twitter.id: req.params.id},function(err, user){
    if(err){return handleError(err)}

    var toReplace = {
      following: req.body.following,
      followers: req.body.followers
    };

    var updated = _.merge(user, toReplace);
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.json(updated);
      });
    });
  });
};

exports.plusFollowers_earned = function(req,res){
  User.find({twitter.id: req.params.id},function(err,user){
    if (err) { 
      return handleError(err); 
    }
    if (req.body.followers_earned) {
      User.add({followers_earned: req.body.followers_earned});
    } else {
      User.add({followers_earned: 1});
    }
  });
};

exports.plusFollowings_earned = function(req,res){
  User.find({twitter.id: req.params.id},function(err,user){
    if (err) { 
      return handleError(err); 
    }
    if (req.body.following_earned) {
      User.add({following_earned: req.body.following_earned});
    } else {
      User.add({following_earned: 1});
    }
  });
};

// Get a single user
exports.show = function(req, res) {
  User.find({twitter.id: req.params.id}, function (err, user) {
    if(err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    return res.json(user);
  });
};

// Creates a new user in the DB.
exports.create = function(req, res) {
  User.create(req.body, function(err, user) {
    if(err) { return handleError(res, err); }
    return res.json(200, user);
  });
};

// Updates an existing user in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  User.find({twitter.id: req.params.id}, function (err, user) {
    if (err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    var updated = _.merge(user, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, user);
    });
  });
};

exports.findUserById = function(req,res){
  User.find({twitter.id:req.params.id}, function(err, user){
    if (err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    return res.json(200, user);
  });
};

// Deletes a user from the DB.

exports.destroy = function(req, res) {
  User.find({twitter.id: req.params.id}, function (err, user) {
    if(err) { return handleError(res, err); }
    if(!user) { return res.send(404); }
    var newUser = {
      account: user.account,
      twitter: {
        id: user.twitter.id,
        access_token: user.twitter.access_token
      }
    };
    User.update({twitter.id: req.params.id}, newUser, {upsert: true}, function(err){
      if(err) { return handleError(res, err); }
      return res.send(200);
    });
  });
};


function handleError(res, err) {
  return res.send(500, err);
};
