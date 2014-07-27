'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/* STATUS TYPES:  overdue (pasado de los 30 dias gratis) 
									free (en los 30 dias gratis
									normal (plan pago no tan bueno) 
									premium (mejor plan pago)
*/

var UserSchema = new Schema({
  account: {
  	createdAt: {
			type: Date, 
			default: Date.now
		},
		payments: {
			status: String,
			dueDate: {
				type: Date, 
				default: Date.now
			}
		}
  },
  twitter: {
  	id: String,
  	access_token: String,
  	
  	name: String,
  	picture: String,
  	
  	following: Number,
  	followers: Number,
  	
  	followers_earned: Number,
  	following_earned: Number,
  	unfollowing_earned: Number,
  	messages_earned: Number,
  	tweets_earned: Number,
  	
  	startingFollowing, Number,
  	startingFollowers, Number,
  	
  	followingInTime: [{
  		following: Number,
  		followers: Number,
  		date: {
  			type: Date, 
  			default: Date.now
  		}
  	}],
  }
});

module.exports = mongoose.model('User', UserSchema);


/*

User(id, name, picture, following, followers, access_token);

updateFollowingFollowers(following, followers);

plusFollowers_earned();
plusFollowers_earned(Number);

plusFollowing_earned();
plusFollowing_earned(Number);

plusFollowing_earned(Number);

*/