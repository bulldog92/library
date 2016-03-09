app.controller('LogoutCtrl', ['$location', '$auth', '$rootScope', '$mdToast', function($location, $auth, $rootScope, $mdToast) {
	if (!$auth.isAuthenticated()) { return; }
	$auth.logout()
	  .then(function() {
	  	$mdToast.show(
      			$mdToast.simple()
        		.textContent('Пока')
        		.position('bottom right')
        		.hideDelay(1000)
        	);
	  	$rootScope.user = {};
	    $location.path('/');
	  });
}]);