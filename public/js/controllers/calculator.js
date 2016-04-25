app.controller('calculatorCtrl',['$scope', function($scope){
	
	/* Defaults */
	$scope.showResults = false;
	$scope.showResultsEUR = false;
	$scope.showResultsTP = false;

	$scope.data = {
		salary: 1000,
		plan: 100,
		cross: .9,
		rate: 28.5,
		transfer: 5000,
	};

	/* Basic values to count */
	$scope.bonus = function() {
		return (Number($scope.data.salary) * ( Number($scope.data.plan) * 0.003 ));
	}
	$scope.summ = function() {
		return $scope.data.salary + $scope.bonus();
	}
	$scope.totalTP = function() {
		return (($scope.data.salary + $scope.bonus()) * $scope.data.cross) - ($scope.data.transfer/$scope.data.rate);
	}
	/* Switcher for tax payers' block */
	$scope.message = "€";
	$scope.changeCurrency = function(cbState) {
  		$scope.message = cbState ? "$" : "€";
  	};


  	/* Primary count */
	$scope.count = function() {
		$scope.showResults = true;
	};
	$scope.showEUR = function() {
		$scope.showResultsEUR = !$scope.showResultsEUR;
	};


	/* Count for tax payers */
	$scope.showTP = function() {
		$scope.showBlockTP = !$scope.showBlockTP;
	};
	$scope.countTP = function() {
		$scope.showResultsTP = true;
	};
}]);