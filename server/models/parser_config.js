'use strict';
var path = require('path');
var mongoose = require('mongoose');
var Servers = mongoose.model('Servers');
var Sites = mongoose.model('Sites');
var fs = require('fs');
var Q = require('q');
var date = require('../models/date');
var	ftp = require('../models/files_downloader');
/* regExp to get config info start*/
function parseConfig(data){
	var parseSites = data.match(/\<VirtualHost\s[\d-\.-\:-\s]*>[^]*\<\/VirtualHost\>/);
	var array = parseSites.toString().split('</VirtualHost>');
	var objectArr = [];
	for (var i = 0; i < array.length; i++) {
		var objectSite = {};
		var siteIp = getIpRegex(array[i]);
		var siteDomain = getDomain(array[i]);
		var siteDocumentRoot = getDocumentRoot(array[i]);
		var siteErrorLog = getErrorLog(array[i]); 
		if(siteIp && siteDomain && siteDocumentRoot && siteErrorLog){
			objectSite['ip'] = siteIp;
			objectSite['domain'] = siteDomain;
			objectSite['documentRoot'] = siteDocumentRoot;
			objectSite['errorLog'] = siteErrorLog;
			objectArr.push(objectSite);
		}
	}
	return objectArr;
}
/*gluing together files start*/
function mergerFile(files) {
	var deferred = Q.defer();
	//var files = ['./servers_files/fornex/apache2.conf', './servers_files/fornex2/apache2.conf'];
	var promises = [];

	for (var j = 0; j < files.length; j++) {
		promises.push(readFile(files[j]));
	}

	Promise.all(promises).then(function(results) {
		deferred.resolve(results.join('######'));
	}).catch(function(err){
		//console.log(err);
		deferred.reject(err);
	})

	return deferred.promise;
}
/*gluing together files start*/

/*read files start*/
function readFile(name) {
    return new Promise(function(resolve, reject) {
        var result = '';
        var stream = fs.createReadStream(name, {encoding: 'utf8'}).on(
            'readable',
            function(s) {
                var buf;
                while ((buf = stream.read()) !== null) {
                    result += buf;
                }
            }
        ).once('end', function() {
        	var sitesMatch = cutSites(result);
            resolve(sitesMatch);
        }).once('error', function(error) {
            reject(error);
        });
    });
}
/**/
/*
cut site
*/
function cutSites(file) {
	return file.match(/\<VirtualHost\s[\d-\.-\:-\s]*>[^]*\<\/VirtualHost\>/).toString();
}

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

function getErrorLog(siteConfig){
	var regErrorLog = siteConfig.match(/ErrorLog[^\n\t\r]*/);
	if(regErrorLog){
		var siteErrorLog = regErrorLog[0].split(' ');
		return siteErrorLog[1];
	}else{
		return false;
	}
}
/* regExp to get config info end*/

/*Mongodb add sites to sites collection start*/
function addServerForSite(files){
	var deferred = Q.defer(); 
	mergerFile(files).then(function(data){
		var sitesArr = parseConfig(data);
		//console.log(sitesArr);
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
	var deferred = Q.defer();
	var count = 0;
	var arrAdd = [];
	Sites.find({}).then(function(sitesDb){
		var arrDominsDb = genArrDomains(sitesDb);
		for (var j = 0; j < sites.length; j++) {
			if (!~arrDominsDb.indexOf(sites[j].domain)) {
				arrAdd.push(sites[j]);
			}
		}
		if(arrAdd.length){
			for (var i = 0; i < arrAdd.length; i++){
				var site = arrAdd[i];
				var newSite = new Sites({
					domain: site.domain,
					ip: site.ip,
					date: date(),
					server: site.server,
					documentRoot: site.documentRoot,
					errorLog: site.errorLog
				});
				newSite.save(function(err){
					count++;
					if(count == arrAdd.length){
						deferred.resolve(arrAdd);
					}
					if (err) {
						//console.error('site already exists');
						deferred.reject(err);
						return;
					}
					console.log('save');
				})
			}
		}else{
			deferred.resolve('сайты существуют');
		}
	}, function(err){
			deferred.reject(err);
	})
	return deferred.promise;
}

function checkServer(siteIp, servers){
	for (var i = 0; i < servers.length; i++) {
		if(servers[i].ip.indexOf(siteIp) > -1){
			return servers[i].name;
		}
	}
}


function sitesEqual(sites){
	var deferredIn = Q.defer();
	var servers = Servers.find({});
	servers.then(function(serversArr){
		var servers = serversArr;
		var promiseArr = [];
		/*cycle start
			*
		*/
		for (var i = 0; i < sites.length; i++){
			var site = sites[i];
			Sites.findOne({domain: site.domain}, function(err, result){
				var sitesForUpdate = [];
				if(err){
					console.log(err);
					return;
				}
				if(result){
					//console.log(result);
					for (var j = 0; j < sites.length; j++){
						if (result.domain == sites[j].domain) {
							//console.log(result);
							//console.log( result.domain +' уже есть в базе');
							if (result.documentRoot == sites[j].documentRoot && result.errorLog == sites[j].errorLog && result.ip == sites[j].ip){
								console.log('Сайты совпадают');
								continue;
							}
								var objectSet = {
									domain: sites[j].domain,
									documentRoot: sites[j].documentRoot,
									errorLog: sites[j].errorLog,
									ip: sites[j].ip,
									server: checkServer(sites[j].ip, servers)
								}
								sitesForUpdate.push(objectSet);
						}
					}
					/*Update sites function start*/
					for (var k = 0; k < sitesForUpdate.length; k++) {
						promiseArr.push(updaterSites(sitesForUpdate[k]));
					}



					Promise.all(promiseArr).then(function(results) {
						deferredIn.resolve('сайты обновлены');
					}).catch(function(err){
						deferredIn.reject(err);
					})




					function updaterSites(siteUpdate) {
						return new Promise(function(resolve, reject) {
							Sites.update({domain: siteUpdate.domain}, {$set:{
								documentRoot: siteUpdate.documentRoot,
								errorLog: siteUpdate.errorLog,
								ip: siteUpdate.ip,
								server: siteUpdate.server
							}}, function(err) {
								if(err) {
									reject();
									return;
								}
								console.log('update');
								resolve();
							})
						})
					}
					/*Update sites function end*/
				}
			});
		}
		/*cycle end*/
	}, function(err){
		if(err){
			deferredIn.reject(err);
		}
	});
return deferredIn.promise;
}

/*
 removes the site if it is not in the database
*/

function removeSites(sitesParse){
	var sitesOnDbPromise = Sites.find({});
	sitesOnDbPromise.then(function(sitesOnDb){
		var sitesDomainsArr = genArrDomains(sitesParse);
		for (var i = 0; i < sitesOnDb.length; i++) {
				if( !~(sitesDomainsArr.indexOf(sitesOnDb[i].domain)) ) {
					Sites.remove({domain: sitesOnDb[i].domain}, function(err){
						if(err){
							console.log(err);
							return;
						}
						console.log('delete');
					});
				}
		}
	}, function(err){
		console.log(err);
	})
}

/*an array of domains generator start*/
function genArrDomains(sitesArr){
	var arrResult = [];
	for (var i = 0; i < sitesArr.length; i++) {
		arrResult.push(sitesArr[i].domain);
	}
	return arrResult;
}

function parserGo(){
	ftp.configServer().then(function(dataUrl){
		addServerForSite(dataUrl).then(function(data){
			writeSites(data).then(function(sitesAdded){
				sitesEqual(data).then(function(){
					removeSites(data);
				}, function(err){
					console.log(err);
				})
			})
		});
	}, function(err){
		console.log(err);
	})
}
/*an array of domains generator end*/
/*Mongodb add sites to sites collection end*/
module.exports = {
	parserGo: parserGo
}