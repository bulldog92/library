app.controller('NavCtrl',['$scope', '$auth', '$rootScope','Account', '$http', function($scope, $auth, $rootScope, Account, $http){
	Account.setUser();
	$scope.isAuthenticated = function() {
      return $auth.isAuthenticated();
    };
  $scope.isAdmin = function() {
      if($auth.isAuthenticated()){
      	if($rootScope.user){
      		if($rootScope.user.role == 'admin'){
      		return true;
      		}
      	}
      }else{
      	return false;
      }
    };
}]);