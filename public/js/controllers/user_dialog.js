app.controller('userDialogCtrl', ['$scope', '$mdDialog', 'locals', 'usersList', '$mdToast', function($scope, $mdDialog, locals, usersList, $mdToast){
  	$scope.role = locals.currentUser.role;
    $scope.roles = ['admin', 'user'];
  	$scope.cancel = function() {
    	$mdDialog.cancel();
  	};
  	$scope.update_user = function(){
  		var dataUser = locals.currentUser;
  		dataUser.role = $scope.role;
  		usersList.changeRole(dataUser).then(function(data){
			$mdToast.show(
      			$mdToast.simple()
        		.textContent('Пользователь изменен')
        		.position('bottom right')
        		.hideDelay(1000)
        	);
			$mdDialog.hide();
		}, function(error){
			$mdToast.show(
      			$mdToast.simple()
        		.textContent('Ошибка')
        		.position('bottom right')
        		.hideDelay(1000)
        	);
			console.log(error);
		});
	};
}]);