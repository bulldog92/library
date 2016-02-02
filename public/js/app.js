
var app = angular.module('libraryApp', [
	'ui.router',
	'satellizer',
	'ngAnimate',
	'ngMaterial',
	'ngMessages'
]);

app.config(function($stateProvider, $urlRouterProvider, $authProvider){
	// satellizer config
	// $authProvider.facebook({
	// 	clientId: 'Facebook App ID'
	// });

    // define routes
	$stateProvider
		.state('home', {
			url: "/",
			templateUrl: "templates/main.html",
			controller: 'MainCtrl'
		})
		.state('register', {
			url: "/register",
			templateUrl: "templates/register.html",
			controller: 'AuthCtrl',
			resolve: {
	          skipIfLoggedIn: skipIfLoggedIn
	        }
		})
		.state('login', {
			url: "/login",
			templateUrl: "templates/login.html",
			controller: 'AuthCtrl'
		})
		.state('logout', {
			url: '/logout',
			template: null,
			controller: 'LogoutCtrl'
		})
		.state('profile', {
			url: '/profile',
			templateUrl: 'templates/profile.html',
			controller: 'ProfileCtrl',
			resolve: {
				loginRequired: loginRequired
			}
		})
		.state('onlyAdmin', {
			url: '/onlyAdmin',
			templateUrl: 'templates/only_admin.html',
			controller: 'onlyAdminCtrl',
			resolve:{
				adminLogin: loginRequiredAdmin
			}
		})
		.state('forgot_pass', {
			url: '/forgot_pass',
			templateUrl: 'templates/forgot_pass.html',
			controller: 'forgotpassCtrl',
			resolve: {
	          skipIfLoggedIn: skipIfLoggedIn
	        }
		});

	$urlRouterProvider.otherwise("/");

	// Resolve functions
	function skipIfLoggedIn($q, $auth) {
      var dfd = $q.defer();
      if ($auth.isAuthenticated()) {
        dfd.reject();
      } else {
        dfd.resolve();
      }
      return dfd.promise;
    };
    function loginRequired($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    };
    function loginRequiredAdmin($q, $location, $auth, Account, $rootScope) {
      var deferred = $q.defer();
      if($rootScope.user){
      	if($rootScope.user.role == 'admin'){
      		deferred.resolve();	
      	}else{
      		$location.path('/login');
      	}
      }else{
      	var promise = Account.getProfile();
      	promise.then(function(data){
      		if(data.data.role == 'admin'){
      			deferred.resolve();	
      		}else{
      			$location.path('/login');	
      		} 
      	}, function(error){
      		$location.path('/login');
      		console.log(error);
      	});
      }
      return deferred.promise;
    };
});