app.controller('forgotpassCtrl',['$scope', 'Account', '$location', '$timeout', function($scope, Account, $location, $timeout){
	$scope.forgotAccount = {};
	$scope.forgotSubmit = function(){
		var promise = Account.forgotPass($scope.forgotAccount);
		promise.then(function(data){
			if(data.status == '200'){
				$scope.successMessage = 'Новый пароль отправлен на почту';
				$timeout(function(){
					$location.path('/login');
				}, 1500);
			}else{
				$scope.errorMessage = 'При отправке произошла ошибка';
			}
		},function(error){
			$scope.errorMessage = 'При отправке произошла ошибка';
		});	
	}
}] );