app.controller('LogoutCtrl', ['$location', '$auth', '$rootScope', '$mdToast', function($location, $auth, $rootScope, $mdToast) {
	if (!$auth.isAuthenticated()) { return; }

	$auth.logout()
	  .then(function() {
	  	$mdToast.show(
      			$mdToast.simple()
        		.textContent('Пока')
        		.position('top right')
        		.hideDelay(2000)
        	);
	  	$rootScope.user = {};
	    $location.path('/');
	  });
}]);