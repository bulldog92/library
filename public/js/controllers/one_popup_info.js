app.controller('onePopupInfo', ['$scope', '$mdDialog', 'locals','$mdToast', 'clipboard', function($scope, $mdDialog, locals, $mdToast, clipboard){
    $scope.info = locals.onePopupInfo;
    $scope.nameInfo = locals.nameTitle;

  	$scope.cancel = function() {
    	$mdDialog.cancel();
  	};
  	
  	$scope.clickHandler = function () {
  	    clipboard.copyText($scope.info);
  	};


}]);