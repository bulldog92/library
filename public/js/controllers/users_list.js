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
	          .title('Are you sure?')
	          .textContent('The user is deleted permanently!!!')
	          .ariaLabel('Delete user')
	          .targetEvent(ev)
	          .ok('Delete!')
	          .cancel('Cancel');
	    $mdDialog.show(confirm).then(function() {
	      usersList.deleteUser(user).then(function(data){
	      	$mdToast.show(
      			$mdToast.simple()
        		.textContent('User deleted!')
        		.position('bottom right')
        		.hideDelay(1000)
        	);
        	usersList.getUsers(cb);
	      }, function(error){
	      	console.log(error);
	      		$mdToast.show(
      				$mdToast.simple()
        			.textContent('Error deleting!!!')
        			.position('bottom right')
        			.hideDelay(1000)
        		);
	      });
	    }, function() {
	    	$mdDialog.hide();
	    });
  	};
}]);
