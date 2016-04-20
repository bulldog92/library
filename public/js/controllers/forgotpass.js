app.controller('forgotpassCtrl',['$scope', 'Account', '$location', '$timeout', function($scope, Account, $location, $timeout){
	$scope.forgotAccount = {};
	$scope.forgotSubmit = function(){
		var promise = Account.forgotPass($scope.forgotAccount);
		promise.then(function(data){
			if(data.status == '200'){
				$scope.successMessage = 'A new password has been sent to the email';
				$timeout(function(){
					$location.path('/login');
				}, 2500);
			}else{
				$scope.errorMessage = 'When you send an error occurred';
			}
		},function(error){
			$scope.errorMessage = 'When you send an error occurred';
		});	
	}
}] );