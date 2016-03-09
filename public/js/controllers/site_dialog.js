app.controller('siteDialogCtrl', ['$scope', '$mdDialog', 'locals', 'Sites', '$mdToast', function($scope, $mdDialog, locals, Sites, $mdToast){
  	$scope.site = locals.currentSite;
  	$scope.cancel = function() {
    	$mdDialog.cancel();
  	};
  	$scope.update_site = function(){
  		var dataSite = locals.currentSite;
      dataSite.domain = $scope.site.domain;
      dataSite.date = $scope.site.date;
      dataSite.ip = $scope.site.ip;
      dataSite.server = $scope.site.server;
      Sites.updateSite(dataSite).then(function(data){
        $mdToast.show(
          $mdToast.simple()
            .textContent('Сайт изменен')
            .position('bottom right')
            .hideDelay(2000)
          );
        $mdDialog.hide();
      }, function(err){
          $mdToast.show(
            $mdToast.simple()
              .textContent('Ошибка')
              .position('bottom right')
              .hideDelay(1000)
            );
      });
	};
}]);