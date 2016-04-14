
var app = angular.module('libraryApp', [
	'ui.router',
	'satellizer',
	'ngAnimate',
	'ngMaterial',
	'ngMessages',
	'ngMdIcons',
	'md.data.table',
	'angular-clipboard',
	'cfp.hotkeys'
]);

app.config(['$stateProvider', '$urlRouterProvider', '$authProvider', function($stateProvider, $urlRouterProvider, $authProvider){
// Resolve functions
	var skipIfLoggedIn = ['$q', '$auth', function ($q, $auth) {
      var dfd = $q.defer();
      if ($auth.isAuthenticated()) {
        dfd.reject();
      } else {
        dfd.resolve();
      }
      return dfd.promise;
    }];
    var loginRequired = ['$q', '$location', '$auth', function ($q, $location, $auth) {
      var deferred = $q.defer();
      if ($auth.isAuthenticated()) {
        deferred.resolve();
      } else {
        $location.path('/login');
      }
      return deferred.promise;
    }];
    var loginRequiredAdmin = ['$q', '$location', '$auth', 'Account', '$rootScope', function ($q, $location, $auth, Account, $rootScope) {
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
    }];


	
	$stateProvider
		.state('home', {
			url: "/",
			templateUrl: "templates/main.html",
			controller: 'MainCtrl',
			resolve: {
				loginRequired: loginRequired
			}
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
			controller: 'AuthCtrl',
			resolve: {
	          skipIfLoggedIn: skipIfLoggedIn
	        }
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
		.state('only_admin', {
			url: '/only_admin',
			templateUrl: 'templates/only_admin.html',
			controller: 'onlyAdminCtrl',
			resolve:{
				adminLogin: loginRequiredAdmin
			}
		})
		.state('only_admin.users_list', {
			url: '/users_list',
			templateUrl: 'templates/users_list.html',
			controller: 'usersListCtrl',
			resolve:{
				adminLogin: loginRequiredAdmin
			}
		})
		.state('only_admin.servers', {
			url: '/servers',
			templateUrl: 'templates/servers_list.html',
			controller: 'ServersListCtrl',
			resolve:{
				adminLogin: loginRequiredAdmin
			}
		})
		.state('sites', {
			url: '/sites',
			templateUrl: 'templates/sites_list.html',
			controller: 'SitesListCtrl',
			resolve:{
				loginRequired: loginRequired
			}
		})
		.state('calculator', {
			url: '/calculator',
			templateUrl: 'templates/calculator.html',
			controller: 'calculatorCtrl',
			resolve:{
				loginRequired: loginRequired
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

	
}]);
app.run(['$rootScope', '$state', '$stateParams', function($rootScope, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
        // to be used for back button //won't work when page is reloaded.
        $rootScope.previousState_name = fromState.name || 'home';
        $rootScope.previousState_params = fromParams;
    });
    //back button function called from back button's ng-click="back()"
    $rootScope.back = function() {
        $state.go($rootScope.previousState_name,$rootScope.previousState_params);
    };
}]);