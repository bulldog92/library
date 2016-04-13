var express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  Servers = mongoose.model('Servers'),
  Sites = mongoose.model('Sites'),
  Options =  mongoose.model('Options'),
  rootPath = path.normalize(__dirname + '/../'),
  CryptoJS = require("crypto-js"),
  router = express.Router();

/* api for service get /api/?domain=domain.com*/
router.get('/', function(req, res, next){
	console.log(req.query.domain);
  	if(req.query.domain){
  		Sites.findOne({domain: req.query.domain}, function(err, site){
  			if(err){
  			    res.status(500);
      			res.send({'message': 'db error'});
  			}
  			if(site){
  				Servers.findOne({name: site.server}, function(err, server){
  					if(err){
  						res.status(500);
  					    res.send({'message': 'db error'});
  					}
  					var resObj = {
  						ip: site.ip,
  						login: 'user',
  						pass: server.user_pass
  					}
  					console.log(resObj);
  					Options.findOne({name: 'aes'}, function(err, options){
  						if(err){
  							res.status(500);
  							res.send({'message': 'db error'});
  						}
  						var optionsKey = options.keyApi;
  						console.log(optionsKey);
  						var encrypt = CryptoJS.AES.encrypt(JSON.stringify(resObj), optionsKey);
  						console.log(encrypt.toString());
  						//var bytes  = CryptoJS.AES.decrypt(encrypt.toString(), 'Super secret key');
  						//var plaintext = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  						//console.log(plaintext);
  						res.send(encrypt.toString());
  					});
  				})
  			}else{
  				res.status(500);
  				res.send({'message': 'site not found'});
  			}
  		})
  	}else{
    	res.status(422);
    	res.send({message: 'Unprocessable Entity'});
  }
})

/*end*/
module.exports = router;