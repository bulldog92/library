'use strict';
var fs = require('fs');
var PromiseFtps = require('promise-sftp');
var mkdirp = require('mkdirp');
var mongoose = require('mongoose');
var Servers = mongoose.model('Servers');
var directoryUri = 'servers_files/';


/*ftp connections start*/
function uploadFile(config) {
	return new Promise(function(resolve, reject){
		if(config.host){
			var sftp = new PromiseFtps();
			sftp.connect({
				host: config.host,
				user: config.user.login,
				password: config.user.pass
			}).then(function(serverMess){
				mkdirp(directoryUri + config.name, function(err){
					if(err){
						console.log(err);
						reject(err);
						return;
					}
					sftp.fastGet(config.fileUrl, directoryUri + config.name + '/apache2.conf').then(function(){
						resolve('записано');
						sftp.end()
					});
				})
			})
		}
	})
}

function configServer() {
	return new Promise(function(resolve, reject){
		Servers.find({}).then(function(servers){
			var promises = [];
			for (var i = 0; i < servers.length; i++) {
				promises.push(uploadFile(servers[i]));
			}


			Promise.all(promises).then(function(results) {
				resolve(results);
			}).catch(function(err){
				//console.log(err);
				reject(err);
			})
		}, function(err){
			reject(err);
		})	
	})
}
 
/*ftp connections end*/

module.exports = {
	uploadFile: uploadFile,
	configServer: configServer
}