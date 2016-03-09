var express = require('express'),
	path = require('path'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
  Servers = mongoose.model('Servers'),
  Sites = mongoose.model('Sites'),
	rootPath = path.normalize(__dirname + '/../'),
	router = express.Router();

var utils = require('./utils');
var mailer = require('./mailer');
var date = require('./models/date');
var validator = require('validator');

/*
 |--------------------------------------------------------------------------
 | Create Email and Password Account
 |--------------------------------------------------------------------------
 */
router.post('/auth/signup', function(req, res) {
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
router.post('/auth/login', function(req, res) {
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

/*
 |--------------------------------------------------------------------------
 | GET /api/me
 |--------------------------------------------------------------------------
 */
router.get('/api/me', utils.ensureAuthenticated, function(req, res) {
  User.findById(req.user, function(err, user) {
    res.send(user);
  });
});

/*
 |--------------------------------------------------------------------------
 | PUT /api/me
 |--------------------------------------------------------------------------
 */
router.put('/api/me', utils.ensureAuthenticated, function(req, res) {
	if(req.body.email != '' && validator.isEmail(req.body.email) && req.body.displayName != '' && validator.isLength(req.body.displayName, {min:4, max:20}) ){
		User.findById(req.user, function(err, user) {
  			if (!user) {
    			return res.status(400).send({ message: 'User not found' });
  			}
  			if(user.email != req.body.email ){
          console.log(user.email);
          console.log(req.body.email);
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

/*
 |-----------------------
 | POST /api/forgot
 |-----------------------
*/
router.post('/api/forgot', function(req, res){
	User.findOne({email: req.body.email}, function(err, user){
		var rand_val = str_rand();
		if (!user) {
      		return res.status(400).send({ message: 'User not found' });
    	}
    	function str_rand() {
        var result = '';
        var words = '0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
        var max_position = words.length - 1;
            for( i = 0; i < 5; ++i ) {
                position = Math.floor ( Math.random() * max_position );
                result = result + words.substring(position, position + 1);
            }
       		return result;
    	}
    	user.password = rand_val;
    	user.save(function(err) {
    		if(err){
    			res.status(400).end();
    		}
    		mailer.sendMail(req.body.email, req.body.email, rand_val);
      		res.status(200).end();
    	});
	})
});

/*
 |-----------------------
 | GET /api/user
 |-----------------------
*/
router.get('/api/user', function(req, res){
  User.find({}, function(err, result){
    if(err){
      res.status(500).end();
    }
    if(result){
      res.status(200);
      res.json(result);
    }
  })
});
/*
 |-----------------------
 | PUT /api/user
 |-----------------------
*/
router.put('/api/user', function(req, res){
  User.findOne({email: req.body.email}, function(err, result){
    if(err){
      res.status(500);
      res.send({'message': 'db error'});
    }
    if(result){
      if(result.role != req.body.role){
        result.role = req.body.role;
        result.save(function(err){
          if(err){
            res.status(500);
            res.send({'message': 'db error'});
          }
          res.status(200);
          res.send({'message': 'role changed'});
        });
      }else{
        res.status(200);
        res.send({'message': 'role not changed'});
      }
    }
  })
});

/*
 |-----------------------
 | POST /api/user
 |-----------------------
*/

router.post('/api/user_delete', function(req, res){
  User.findOne({email: req.body.email}, function(err, result){
    if(err){
      res.status(500);
      res.send({'message': 'db error'});
    }
    if(result){
      result.remove(function(error){
        if(error){
          res.status(500);
        }
        res.status(200);
        res.send({'message': 'Remove'})
      });
    }
  })
});

/*
 |-----------------------
 | GET /api/sites
 |-----------------------
*/
router.get('/api/sites', function(req, res){
  Sites.find({}, function(err, result){
    if(err){
      res.status(500).end();
    }
    if(result){
      res.status(200);
      res.json(result);
    }
  })
});
/*
 |-----------------------
 | PUT /api/sites
 |-----------------------
*/
router.put('/api/sites', function(req, res){
  Sites.findOne({_id: req.body._id}, function(err, site){
    if(err){
      res.status(500).end();
    }
    if(site){
      site.domain = req.body.domain;
      site.ip = req.body.ip;
      site.server = req.body.server;
      site.date = req.body.date;
      site.save(function(err){
        if(err){
          res.status(500);
          return res.send({message: 'db save error'});
        }
        res.status(200);
        res.json({message: 'site updated'});
      });
    }
  })
});
/*
 |-----------------------
 | GET /api/servers
 |-----------------------
*/
router.get('/api/servers', function(req, res){
  Servers.find({}, function(err, result){
    if(err){
      res.status(500).end();
    }
    if(result){
      res.status(200);
      res.json(result);
    }
  })
});

// angularjs catch all route
router.get('/*', function(req, res) {
	res.sendFile(rootPath + 'public/index.html', { user: req.user });
});

module.exports = router;
