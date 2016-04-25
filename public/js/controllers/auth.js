app.controller('AuthCtrl', ['$scope', '$auth', '$location', 'Account', '$mdToast', function($scope, $auth, $location, Account, $mdToast, $rootScope){
	// register new user
	$scope.newUser = {};
	$scope.errorMessage = false;
	$scope.register = function(){
		// send signup POST request to /auth/signup
		$auth.signup($scope.newUser)
			.then(function(res){
				// set localstorage token
				$auth.setToken(res);
				Account.setUser()
			        .then(function(response) {
			          $location.path('/');
			        });
			})
			.catch(function(res){
				console.log(res);
				$scope.errorMessage = res.data.message;
			});
	};
	$scope.loginUser = {};
	$scope.login = function() {
      $auth.login($scope.loginUser)
        .then(function() {
        	$mdToast.show(
      			$mdToast.simple()
        		.textContent('Enter')
        		.position('bottom right')
        		.hideDelay(1000)
        	);
        	Account.setUser()
		        .then(function(response) {
		          $location.path('/');
		        });
        })
        .catch(function(res) {
        	console.log(res);
			$scope.errorMessage = res.data.message;
        });
    };
}]);