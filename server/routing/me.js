var express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  rootPath = path.normalize(__dirname + '/../'),
  router = express.Router();

var utils = require('../utils');
var validator = require('validator');

/*
 |--------------------------------------------------------------------------
 | GET /api/me
 |--------------------------------------------------------------------------
 */
router.get('/', utils.ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    res.send(user);
  });
});

/*
 |--------------------------------------------------------------------------
 | PUT /api/me
 |--------------------------------------------------------------------------
 */
router.put('/', utils.ensureAuthenticated, function(req, res) {
	if(req.body.email != '' && validator.isEmail(req.body.email) && req.body.displayName != '' && validator.isLength(req.body.displayName, {min:4, max:20}) ){
		User.findById(req.user, function(err, user) {
  			if (!user) {
    			return res.status(400).send({ message: 'User not found' });
  			}
  			if(user.email != req.body.email ){
  				User.findOne({ email: req.body.email}, function(err, res_user){
  					if(!res_user){
  						user.email = req.body.email;
              if(user.displayName != req.body.displayName ){
                user.displayName = req.body.displayName;
                user.save(function(err) {
                  if(err){
                    res.status(500);
                    return res.send({message: 'db save error'});
                  }
                  return res.status(200).end();
                });
              }else{
                user.save(function(err) {
                  if(err){
                    res.status(500);
                    return res.send({message: 'db save error'});
                  }
                  return res.status(200).end();
                });
              }
  					}else{
  						res.status(409);
						return res.send({ message: 'Email is already taken' });
  					}
  				})
  			}else{
              if(user.displayName != req.body.displayName ){
                user.displayName = req.body.displayName;
                user.save(function(err) {
                  if(err){
                    res.status(500);
                    return res.send({message: 'db save error'});
                  }
                  return res.status(200).end();
                });
              }else{
                return res.status(304).end();
              }
        }
		});
	}else{
    res.status(422);
    res.send({message: 'Unprocessable Entity'});
  }
});

module.exports = router;