
app.controller('ProfileCtrl',['$scope', '$auth', 'Account', '$mdToast', '$document', function($scope, $auth, Account, $mdToast, $document) {
	$scope.editProfile = {
		displayName : $scope.user.displayName,
		email : $scope.user.email
	};
    $scope.updateProfile = function() {
    	$scope.successMessage = '';
    	$scope.errorMessage = '';
    	Account.updateProfile($scope.editProfile)
        .then(function(data) {
        	$mdToast.show(
      			$mdToast.simple()
        		.textContent('Профиль изменен!')
        		.position('top right')
        		.hideDelay(3000)
    		);
        	$scope.successMessage = 'Профиль изменен';
        	console.log('Profile has been updated');
        	console.log(data.data.message);
        	$scope.user.email = $scope.editProfile.email;
        	$scope.user.displayName = $scope.editProfile.displayName;
        }, function(error){
        	if(error.status == '304'){
        		console.log('not modified');
        		$scope.errorMessage = 'Ничего не изменилось';	
        	}else{
        		$scope.errorMessage = error.data.message;
        	}
        	$scope.editProfile = $scope.user;
        	console.log(error);
        });
    };
}]);