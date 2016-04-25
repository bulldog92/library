app.factory('Statistic', ['$http', function($http){
	return{
		getServersStatistic: getServersStatistic
	}
	
	function getServersStatistic () {
		return $http({
			method: 'GET',
			url: '/api/statistics/ip_counter'
		})
	}
}]);