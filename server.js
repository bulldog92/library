var express = require('express'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
	cors = require('cors'),
	app = express(),
	autoIncrement = require('mongoose-auto-increment'),
	schedule = require('node-schedule');


// ENVIRONMENT CONFIG
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
	envConfig = require('./server/env')[env];

// DATABASE CONFIG
var connection = mongoose.connect(envConfig.db);
autoIncrement.initialize(connection);
require('./server/models/user');
require('./server/models/servers');
require('./server/models/sites');
require('./server/models/options');

// EXPRESS CONFIG
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

// ROUTES
//var indexRoutes = require('./server/routes');
var sitesRoutes = require('./server/routing/sites');
var authRoutes = require('./server/routing/auth');
var userRoutes = require('./server/routing/user');
var meRoutes = require('./server/routing/me');
var serversRoutes = require('./server/routing/servers');
var allRoutes = require('./server/routing/all');
var apiRoutes = require('./server/routing/api');
var ispManager = require('./server/routing/isp');
var phpMyAdmin = require('./server/routing/php_my_admin');
//app.use('/', indexRoutes);
app.use('/api', apiRoutes);
app.use('/api/ispmr', ispManager);
app.use('/api/php_my_admin', phpMyAdmin);
app.use('/api', userRoutes);
app.use('/api/sites', sitesRoutes);
app.use('/auth', authRoutes);
app.use('/api/me', meRoutes);
app.use('/api/servers', serversRoutes);
app.use('/*', allRoutes);


/*Parse config servers*/
var	parserConfig = require('./server/models/parser_config');

//parserConfig.parserGo();
/*Parse config servers end*/

/*Cron job sync all servers*/
/*
var parserConfig = require('./server/models/parser_config');
var j = schedule.scheduleJob('0 40 08 * * *', function(){
  console.log('The answer to life, the universe, and everything!');
	parserConfig.parserGo();
});
console.log(new Date());
*/
/*Cron job end*/

// Start server
app.listen(envConfig.port, function(){
  console.log('Server listening on port ' + envConfig.port)
});