
app.controller('ProfileCtrl',['$rootScope','$scope', '$auth', 'Account', '$mdToast', '$document', function($rootScope,$scope, $auth, Account, $mdToast, $document) {
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
        		.textContent('Profile changed!')
        		.position('bottom right')
        		.hideDelay(3000)
    		);
        	$scope.successMessage = 'Profile changed';
        	console.log('Profile has been updated');
        	$scope.user.email = $scope.editProfile.email;
        	$scope.user.displayName = $scope.editProfile.displayName;
        }, function(error){
        	if(error.status == '304'){
        		console.log('not modified');
        		$scope.errorMessage = 'Nothing changed!';	
        	}else{
        		$scope.errorMessage = error.data.message;
        	}
        	$scope.editProfile = {
             displayName : $scope.user.displayName,
             email : $scope.user.email   
            };
        	console.log(error);
        });
    };
}]);