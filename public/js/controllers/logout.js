app.controller('LogoutCtrl', function($location, $auth, $rootScope) {
	if (!$auth.isAuthenticated()) { return; }

	$auth.logout()
	  .then(function() {
	  	$rootScope.user = {};
	    $location.path('/');
	  });
});