app.controller('statisticsCtrl',['$scope', 'Statistic', function($scope, Statistic){
	$scope.serversStatistics = [];
	Statistic.getServersStatistic().then(function(data){
		console.log(data.data);
		$scope.serversStatistics = data.data;
	}, function(err) {
		console.log(err);
	})
}]);