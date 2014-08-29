//
//  Bot
//  class for performing various twitter actions
//

var Twit    = require('../lib/twitter'),
    fs      = require('fs');
    
var Bot = module.exports = function() { 
  this.twit = new Twit(fbConfig);
};

Bot.prototype.getUsersToAddFollowing = function(callback) {
	
};

Bot.prototype.getFollowingFollowers = function(callback) {
  var self = this;
  getFollowersIds(self, -1, [], function(err, followers){
    if (err) {
      return callback(err);
    }
    getFollowingIds(self, -1, [], function(err, following){
      if (err) {
        return callback(err);
      } 
      callback(null, following, followers);
    });
  });
};
