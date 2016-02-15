app.controller('usersListCtrl', ['$scope', 'usersList', '$mdDialog', '$mdToast', function($scope, usersList, $mdDialog, $mdToast){
	usersList.getUsers(cb);
	function cb(users){
		$scope.users = users;
		console.log($scope.users);
	};
	$scope.editUser = function(ev, user){
		$scope.popap_user = user;
		showUserPopap(ev);
		console.log($scope.popap_user);
	};
	function showUserPopap(ev) {
	    $mdDialog.show({
	      controller: 'userDialogCtrl',
	      templateUrl: '../templates/user_popap.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      bindToController: true,
	      locals: {
	      	currentUser: $scope.popap_user
	      }
	    })
	  };
	$scope.deleteUser = function(ev, user) {
		console.log(user);
	    // Appending dialog to document.body to cover sidenav in docs app
	    var confirm = $mdDialog.confirm()
	          .title('Вы уверенны?')
	          .textContent('Пользователь удалится безвозвратно')
	          .ariaLabel('Lucky day')
	          .targetEvent(ev)
	          .ok('Удалить!')
	          .cancel('Отмена');
	    $mdDialog.show(confirm).then(function() {
	      usersList.deleteUser(user).then(function(data){
	      	$mdToast.show(
      			$mdToast.simple()
        		.textContent('Пользователь удален')
        		.position('bottom right')
        		.hideDelay(1000)
        	);
					usersList.getUsers(cb);
	      }, function(error){
	      	console.log(error);
	      		$mdToast.show(
      				$mdToast.simple()
        			.textContent('Ошибка при удалении')
        			.position('bottom right')
        			.hideDelay(1000)
        		);
	      });
	    }, function() {
	    	$mdDialog.hide();
	    });
  	};
}]);
