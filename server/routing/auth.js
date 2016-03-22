var express = require('express'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	rootPath = path.normalize(__dirname + '/../'),
	router = express.Router();

var utils = require('../utils');
var mailer = require('../mailer');
var date = require('../models/date');
var validator = require('validator');

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
router.post('/signup', function(req, res) {
	if(req.body.email != '' && validator.isEmail(req.body.email) && req.body.password != '' && validator.equals(req.body.password, req.body.passwordConfirm)){
		User.findOne({ email: req.body.email }, function(err, existingUser) {
			if (existingUser) {
				console.error('User exists already!');
				res.status(409);
				return res.send({ message: 'Email is already taken' });
			}
			var user = new User({
				  displayName: req.body.displayName,
		  		email: req.body.email,
		  		password: req.body.password,
		  		role: 'user',
          date_born: date()
			});
			user.save(function(err, result) {
		  	if (err) {
		  		console.error('Error saving the user!');
		    	res.status(500).send({ message: err.message });
		  	}
		  	res.send({ token: utils.createJWT(result) });
			});
		});
		var subject = req.body.displayName || req.body.email;
		mailer.sendMail(req.body.email, subject, req.body.password);
	}else{
		res.status(422);
		res.send({message: 'Unprocessable Entity'});
	}
});

/*
 |--------------------------------------------------------------------------
 | Log in with Email
 |--------------------------------------------------------------------------
 */
router.post('/login', function(req, res) {
	if(req.body.email != '' && validator.isEmail(req.body.email) && req.body.password != ''){

		User.findOne({ email: req.body.email }, '+password', function(err, user) {
			if (!user) {
    			console.log('user not found');
    			return res.status(401).send({ message: 'Invalid email and/or password' });
    		}
    		user.comparePassword(req.body.password, function(err, isMatch) {
      		if (!isMatch) {
      			console.log('wrong password');
        		return res.status(401).send({ message: 'Invalid email and/or password' });
      		}
     	 	res.send({ token: utils.createJWT(user) });
    		});
  		});

	}else{
		res.status(422);
		res.send({message: 'Unprocessable Entity'});
	}
});

module.exports = router;