app.controller('usersListCtrl', ['$scope', 'usersList', '$mdDialog', '$mdToast', function($scope, usersList, $mdDialog, $mdToast){
	$scope.query = {
		order: 'displayName',
		limit: '15',
		page: 1
	}

	usersList.getUsers(cb);
	function cb(users){
		$scope.users = users;
	};
	$scope.editUser = function(ev, user){
		$scope.popup_user = user;
		showUserPopup(ev);		
	};
	function showUserPopup(ev) {
	    $mdDialog.show({
	      controller: 'userDialogCtrl',
	      templateUrl: '../templates/user_popup.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      bindToController: true,
	      locals: {
	      	currentUser: $scope.popup_user
	      }
	    })
	  };
	$scope.deleteUser = function(ev, user) {
	    // Appending dialog to document.body to cover sidenav in docs app
	    var confirm = $mdDialog.confirm()
	          .title('Вы уверенны?')
	          .textContent('Пользователь удалится безвозвратно')
	          .ariaLabel('Delete user')
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
