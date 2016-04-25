var express = require('express'),
  path = require('path'),
  rootPath = path.normalize(__dirname + '/../../'),
  mongoose = require('mongoose'),
  Servers = mongoose.model('Servers'),
  router = express.Router();

router.get('/:server_name', function(req, res) {
	Servers.findOne({name: req.params.server_name}, function(err, server){
		if(err) {
			res.status('500');
			return res.send('error 500');
		}
		if(server) {
			return res.redirect(server.isp_link + '?out=html&func=auth&username=root&password=' + server.root_pass + '&checkcookie=no');
		}
		res.status('500');
		return res.send('error 500');
	})
});

module.exports = router;