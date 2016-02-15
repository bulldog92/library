app.factory('usersList', ['$http', function($http){
	var users = null;
	return {
		getUsers : getUsers,
		changeRole : changeRole,
		deleteUser : deleteUser
	};
	function getUsers(cb){
		$http({
			method : 'GET',
			url : '/api/user'
		}).then(function(data){
			users = data.data;
			cb(users);
			return;
		}, function(error){
			console.log(error);
		})
	};
	function changeRole(data){
		return $http({
			method : 'PUT',
			url : '/api/user',
			data: data
		});	
	};
	function deleteUser(data){
		return $http({
			method : 'POST',
			url : '/api/user_delete',
			data: data
		});
	};
}]);