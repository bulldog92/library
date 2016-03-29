var express = require('express'),
  path = require('path'),
  mongoose = require('mongoose'),
  Servers = mongoose.model('Servers'),
  Sites = mongoose.model('Sites'),
  Options =  mongoose.model('Options'),
  rootPath = path.normalize(__dirname + '/../'),
  CryptoJS = require("crypto-js"),
  router = express.Router();
var fs = require('fs');
console.log(mongoose);
/* regExp to get config info start*/
function parseConfig(){
	fs.readFile('./servers_files/fornex/apache2.conf', {encoding: 'utf8'}, function (err, data){
		if(err) console.log(err);
		var test = data.match(/\<VirtualHost\s[\d-\.-\:]*\s\>[^]*\<\/VirtualHost\>/);
		console.log('+++++++++++++++');
		var array = test.toString().split('</VirtualHost>');
		console.log('######################');
		console.log(array[2]);
		console.log('$$$$$$$$$$$$$$$$$$$$$');
		console.log(array.length);
		console.log(getDocumentRoot(array[2]));
		var objectArr = [];
		for(var i = 0; i < array.length; i++) {
			var objectSite = {};
			var siteIp = getIpRegex(array[i]);
			var siteDomain = getDomain(array[i]);
			var siteDocumentRoot = getDocumentRoot(array[i]);
			if(siteIp && siteDomain && siteDocumentRoot){
				objectSite['ip'] = siteIp;
				objectSite['domain'] = siteDomain;
				objectSite['documentRoot'] = siteDocumentRoot;
				objectArr.push(objectSite);
			}
		}
		console.log(objectArr);
	})
};

function getIpRegex(siteConfig){
	var regVirtualHost = siteConfig.match(/\<VirtualHost([\d-\.-\:-\s]*)\>/);
	if(regVirtualHost){
		var siteIp = regVirtualHost[0].match(/[\d-\.]+/)[0];
		return siteIp;
	}else{
		return false;
	}
}

function getDomain(siteConfig){
	var regServername = siteConfig.match(/ServerName[^\n\t\r]*/);
	if(regServername){
		var siteDomain = regServername[0].split(' ');
		return siteDomain[1];
	}else{
		return false;
	}
}


function getDocumentRoot(siteConfig){
	var regDocumentRoot = siteConfig.match(/DocumentRoot[^\n\t\r]*/);
	if(regDocumentRoot){
		var siteDocumentRoot = regDocumentRoot[0].split(' ');
		return siteDocumentRoot[1];
	}else{
		return false;
	}
}
/* regExp to get config info end*/

/*Mongodb add sites to sites collection start*/

/*Mongodb add sites to sites collection end*/
module.exports = {
	parseConfig: parseConfig	
}