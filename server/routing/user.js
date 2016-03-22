var express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  rootPath = path.normalize(__dirname + '/../'),
  router = express.Router();

var mailer = require('../mailer');
var validator = require('validator');



/*all api*/
router.all('/*', function(req, res, next){
  console.log('secure');
  next();
});


/*
 |-----------------------
 | POST /api/forgot
 |-----------------------
*/
router.post('/forgot', function(req, res){
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
router.get('/user', function(req, res){
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
router.put('/user', function(req, res){
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
 | POST /api/user DELETE
 |-----------------------
*/

router.post('/user_delete', function(req, res){
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
        res.send({'message': 'Removed'})
      });
    }
  })
});

module.exports = router;