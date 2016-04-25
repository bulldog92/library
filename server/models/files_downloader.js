'use strict';
var fs = require('fs');
var PromiseFtps = require('promise-sftp');
var mkdirp = require('mkdirp');
var mongoose = require('mongoose');
var Servers = mongoose.model('Servers');
var directoryUri = 'servers_files/';
var Q = require('q');


/*ftp connections start*/
function downloadFile(config) {
	var deffered = Q.defer();
	var sftp = new PromiseFtps();
		if(config.root_pass){
			sftp.connect({
				host: config.ip[0],
				user: 'root',
				password: config.root_pass
			}).then(function(serverMess){
				var dirName = directoryUri + config.name + '/apache2.conf';
				mkdirp(directoryUri + config.name, function(){
					sftp.fastGet(config.path_config, dirName).then(function(){
						deffered.resolve(dirName);
						sftp.end();
					}, function(err){
						deffered.reject(err);
					});
				})
			}, function(err){
				deffered.reject(err);
			})
		return deffered.promise;
		}
}
function filterArr(arr){
	var resultArr = [];
	for(var i = 0; i < arr.length; i++) {
		if(arr[i] === undefined || arr[i] === null) continue;
		resultArr.push(arr[i]);
	}
	return resultArr;
}
function configServer() {
	var deffered = Q.defer();
		Servers.find({}).then(function(servers){
			var promises = [];
			for (var i = 0; i < servers.length; i++) {
				promises.push(downloadFile(servers[i]));
			}

			Promise.all(promises).then(function(results) {
				deffered.resolve(filterArr(results));
			}).catch(function(err){
				console.log(err);
				deffered.reject(err);
			})
		}, function(err){
			deffered.reject(err);
		})
	return deffered.promise;
}
 
/*ftp connections end*/

module.exports = {
	configServer: configServer
}