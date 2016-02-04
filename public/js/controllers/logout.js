app.controller('LogoutCtrl', ['$location', '$auth', '$rootScope', function($location, $auth, $rootScope) {
	if (!$auth.isAuthenticated()) { return; }

	$auth.logout()
	  .then(function() {
	  	$rootScope.user = {};
	    $location.path('/');
	  });
}]);