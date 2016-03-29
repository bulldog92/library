var path = require('path');
var mongoose = require('mongoose');
var Servers = mongoose.model('Servers');
var Sites = mongoose.model('Sites');
var fs = require('fs');
var Q = require('q');
var date = require('../models/date');
/* regExp to get config info start*/
function parseConfig(){
	var deferred = Q.defer();
	fs.readFile('./servers_files/fornex/apache2.conf', {encoding: 'utf8'}, function (err, data){
		if(err) console.log(err);
		var test = data.match(/\<VirtualHost\s[\d-\.-\:]*\s\>[^]*\<\/VirtualHost\>/);
		var array = test.toString().split('</VirtualHost>');
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
		deferred.resolve(objectArr);
	})
	return deferred.promise;
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
function addServerForSite(sitesArr){
	var deferred = Q.defer(); 
	parseConfig().then(function(data){
		var sitesArr = data;
		var sitesWithServer = [];
		var serverPromise = Servers.find({});
		serverPromise.then(function(servers){
			var servers = servers;
			for (var i = 0; i < sitesArr.length; i++){
				var site = sitesArr[i];
				for (var j = 0; j < servers.length; j++) {
					if (servers[j].ip.indexOf(site.ip) > -1){
					  site.server = servers[j].name;
					  sitesWithServer.push(site);
					}
				}
			}
			deferred.resolve(sitesWithServer);
		}, function(err){
			deferred.reject(err);
		});
	});
	return deferred.promise;
};

function writeSites(sites){
	for (var i = 0; i < sites.length; i++){
		var site = sites[i];
		var newSite = new Sites({
			domain: site.domain,
			ip: site.ip,
			date: date(),
			server: site.server,
			documentRoot: site.documentRoot
		});
		newSite.save(function(err){
			if (err) {
				console.log(err);
				return;
			}
			console.log('save');
		})			
	}
}
/*Mongodb add sites to sites collection end*/
module.exports = {
	parseConfig: parseConfig,
	writeSites:	writeSites,
	addServerForSite : addServerForSite
}