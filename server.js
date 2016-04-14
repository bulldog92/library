var express = require('express');
var app = require('./server/app');


// ENVIRONMENT CONFIG
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
	envConfig = require('./server/env')[env];
// Start server
app.listen(envConfig.port, function(){
  console.log('Server listening on port ' + envConfig.port)
});