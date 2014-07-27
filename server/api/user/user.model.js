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

Create();
crea usuario con el body

updateFollowingFollowers(following, followers);
cambiar los following and followers del usuario en la base de datos, el id del usuario se pasa por los params

plusFollowers_earned();
suma 1 a los followers earned
si hay params que sume la cantidad pasada en los params

plusFollowing_earned();
suma 1 a los following earned
si hay params que sume la cantidad pasada en los params

String findUserById()
devuelve el usuario, el id se pasa por los params

setDestroy()
borra casi todo el usuario de la base de datos

hundleError(response,error)
*/