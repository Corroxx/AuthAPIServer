const passport = require('passport');
const User = require ('../models/user');
const config = require ('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

//Create local Strategy
const localOptions = {usernameField: 'email'}
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
	//verify this username and password, call done() with user
	//If it is the correct email and password 
	//Otherwise call done() with false
	User.findOne({email: email}, function(err, user) {
		if(err) {return done(err);}
		if(!user) { return done(null, false);}

		//compare password- is 'password' equal to user.password?(attention encrypted)
		user.comparePassword(password, function (err, isMatch) {
			if(err) {return done(err);}
			if(!isMatch) {return done(null, false);}

			return done(null, user);
		});

	});
});

//setup options fot JWT Strategy
const jwtOptions = {
	secretOrKey: config.secret,
	jwtFromRequest: ExtractJwt.fromHeader('authorization')
};

//Create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
	//See if user Id in the payload exist in out database 
	// If it does, call done() without that
	//		otherwise
	//call done without a user object
	User.findById(payload.sub, function(err, user) {
		if (err) {return done(err, false);}

		if(user) {
			done(null, user);
		} else {
			done(null, false);
		}
	})
});

//tell passport to use this Strategy
passport.use(jwtLogin);
passport.use(localLogin);