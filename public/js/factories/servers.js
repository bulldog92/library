app.factory('Servers', ['$http', '$q', function($http, $q){
	var servers = null;
	return{
		getServers: getServers,
		updateServer: updateServer,
		addNew: addNew,
		deleteServer: deleteServer
	}
	function getServers(){
		var defer = $q.defer();
		$http({
			method: 'GET',
			url: '/api/servers'
		}).then(function(data){
			servers = data.data;
			defer.resolve(servers);
		}, function(err){
			defer.reject(err);
		})
		return defer.promise;
	}
	function updateServer(server){
		return $http({
			method: 'PUT',
			url: '/api/servers',
			data: server
		})
	}
	function addNew(newServer){
		return $http({
			method: 'POST',
			data: newServer,
			url: '/api/servers'
		});
	}
	function deleteServer(server){
		return $http({
			method: 'DELETE',
			url: '/api/servers/'+server._id
		})
	}
}]);