app.factory('Sites', ['$http', '$q', function($http, $q){
	return {
		getSites: getSites,
		updateSite: updateSite,
		addNew: addNew,
		delSite: delSite
	}
	function getSites(req){
		var defer = $q.defer();
		if(req){
			$http({
				method: 'GET',
				url: '/api/sites',
				params: {
					filter: req.filter || '',
					selected: req.selected || []
				} 
			}).then(function(data){
				defer.resolve(data.data);
			}, function(err){
				defer.reject(err);
			})
			return defer.promise;
		}else{
			$http({
				method: 'GET',
				url: '/api/sites'
			}).then(function(data){
				defer.resolve(data.data);
			}, function(err){
				defer.reject(err);
			})
			return defer.promise;
		}
	}
	function updateSite(site){
		return $http({
			method: 'PUT',
			data: site,
			url: '/api/sites'
		});
	}
	function addNew(newSite){
		return $http({
			method: 'POST',
			data: newSite,
			url: '/api/sites'
		});
	}
	function delSite(site){
		return $http({
			method: 'DELETE',
			url: '/api/sites/'+site._id
		})
	}
}]);