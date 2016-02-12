app.factory('usersList', ['$http', function($http){
	var users = null;
	return {
		getUsers : function(cb){
		if(users){
			cb(users);
			return;
		}else{
			$http({
				method : 'GET',
				url : '/api/user'
			}).then(function(data){
				users = data.data;
				cb(users);
				return;
			}, function(error){
				console.log(error);
			});
		}
	}
	};
}]);