'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/* JOB TYPES:  pacient, doctor */
var UserSchema = new Schema({
  creation: { type: Number, default: Date.now },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },   
  password: { type: String, required: true },   
  job: { type: String, default: 'patient' },
  performanceTest: [{
    id: { type: Schema.ObjectId, default: mongoose.Types.ObjectId(), unique: true },
    rotationsLeft: { type: Number, default: 0 },
    rotationsRight: { type: Number, default: 0 }, 
    closedHands: { type: Number, default: 0 },
    elbowFlexions: { type: Number, default: 0 }
  }],
  games: [{
    id: { type: Schema.ObjectId, default: mongoose.Types.ObjectId(), unique: true },
    timestamp: { type: Number, default: new Date().getTime() },
    duration: { type: Number, default: 0 }, 
    rotationsLeft: { type: Number, default: 0 },
    rotationsRight: { type: Number, default: 0 }, 
    closedHands: { type: Number, default: 0 },
    elbowFlexions: { type: Number, default: 0 },
    percentageInTrack: { type: Number, default: 0 }
  }]
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