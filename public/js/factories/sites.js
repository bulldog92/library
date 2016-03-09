app.factory('Sites', ['$http', function($http){
	var sites = null;
	return {
		getSites: getSites,
		updateSite: updateSite 
	};
	function getSites(cb){
		$http({
			method: 'GET',
			url: '/api/sites'
		}).then(function(data){
			sites = data.data;
			cb(sites);
			return;
		}, function(err){
			console.log(error);
		})
	}
	function updateSite(site){
		return $http({
			method: 'PUT',
			data: site,
			url: '/api/sites'
		});
	}
}]);