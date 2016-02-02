app.controller('forgotpassCtrl',['$scope', 'Account', function($scope, Account){
	$scope.forgotAccount = {};
	$scope.forgotSubmit = function(){
		var promise = Account.forgotPass($scope.forgotAccount);
		promise.then(function(data){
			if(data.status == '200'){
				$scope.successMessage = 'Новый пароль отправлен на почту';
			}else{
				$scope.errorMessage = 'При отправке произошла ошибка';
			}
		},function(error){
			$scope.errorMessage = 'При отправке произошла ошибка';
		});	
	}
	
}] );