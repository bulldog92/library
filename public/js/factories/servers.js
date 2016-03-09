app.factory('Servers', ['$http', function($http){
	var servers = null;
	return{
		getServers: getServers
	}
	function getServers(cb){
		$http({
			method: 'GET',
			url: '/api/servers'
		}).then(function(data){
			servers = data.data;
			cb(servers);
		}, function(err){

		})
	}
}]);