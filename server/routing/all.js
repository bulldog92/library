var express = require('express'),
  path = require('path'),
  rootPath = path.normalize(__dirname + '/../../'),
  router = express.Router();

var validator = require('validator');

// angularjs catch all route
router.get('/', function(req, res) {
	res.sendFile(rootPath + 'public/index.html', { user: req.user });
});

module.exports = router;