app.controller('usersListCtrl', ['$scope', '$http', 'usersList', function($scope, $http, usersList){
	usersList.getUsers(cb);
	function cb(users){
		$scope.users = users;
		console.log($scope.users);
	};
}]);