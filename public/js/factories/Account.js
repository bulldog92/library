app.factory('Account', function($http, $rootScope) {
	return {
		setUser: function(){
			return $http.get('/api/me')
		        .then(function(response) {
		        	$rootScope.user = response.data;
		        	console.log('data: ', $rootScope.user);
		        });
		},
		getProfile: function() {
			return $http.get('/api/me');
		},
		updateProfile: function(profileData) {
			return $http.put('/api/me', profileData);
		},
		forgotPass: function(data){
			return $http.post('/api/forgot', data);
		}
	};
});
