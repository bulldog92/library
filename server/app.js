var express = require('express'),
	mongoose = require('mongoose'),
	path = require('path'),
	rootPath = path.normalize(__dirname + '/../'),
	bodyParser = require('body-parser'),
	cookieParser = require('cookie-parser'),
    methodOverride = require('method-override'),
	cors = require('cors'),
	app = express(),
	autoIncrement = require('mongoose-auto-increment'),
	schedule = require('node-schedule');


// ENVIRONMENT CONFIG
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development',
	envConfig = require('./env')[env];

// DATABASE CONFIG
var connection = mongoose.connect(envConfig.db);
autoIncrement.initialize(connection);
require('./models/user');
require('./models/servers');
require('./models/sites');
require('./models/options');

// EXPRESS CONFIG
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(methodOverride());
app.use(cookieParser());
app.use(express.static(rootPath + 'public'));
// ROUTES
//var indexRoutes = require('./server/routes');
var sitesRoutes = require('./routing/sites');
var authRoutes = require('./routing/auth');
var userRoutes = require('./routing/user');
var meRoutes = require('./routing/me');
var serversRoutes = require('./routing/servers');
var allRoutes = require('./routing/all');
var apiRoutes = require('./routing/api');
var ispManager = require('./routing/isp');
var phpMyAdmin = require('./routing/php_my_admin');
var statisticsRoutes = require('./routing/statistics');
//app.use('/', indexRoutes);

app.use('/api', apiRoutes);
app.use('/api/ispmr', ispManager);
app.use('/api/php_my_admin', phpMyAdmin);
app.use('/api', userRoutes);
app.use('/api/sites', sitesRoutes);
app.use('/auth', authRoutes);
app.use('/api/me', meRoutes);
app.use('/api/servers', serversRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/*', allRoutes);


/*Parse config servers*/
//var	parserConfig = require('./server/models/parser_config');
//parserConfig.parserGo();
/*Parse config servers end*/

/*Cron job sync all servers*/

var parserConfig = require('./models/parser_config');
var j = schedule.scheduleJob('00 00 07 * * *', function(){
	parserConfig.parserGo();
});
var test = schedule.scheduleJob('00 00 12 * * *', function(){
	parserConfig.parserGo();
});

/*Cron job end*/
module.exports = app;