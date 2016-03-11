app.controller('siteDialogCtrl', ['$scope', '$rootScope', '$mdDialog', 'locals', 'Sites', '$mdToast', function($scope, $rootScope, $mdDialog, locals, Sites, $mdToast){
  	$scope.site = locals.currentSite;
    $scope.newSite = {};
    function reloadSites(){
      Sites.getSites().then(function(data){
        $rootScope.arrSites = data;
      }, function(err){
        console.log(err);
      })
    }
  	$scope.cancel = function() {
    	$mdDialog.cancel();
      reloadSites();
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
  $scope.addSite = function(){
    var newSite = $scope.newSite;
    console.log(newSite);
    Sites.addNew(newSite).then(function(){
      $mdToast.show(
        $mdToast.simple()
          .textContent('Сайт создан')
          .position('bottom right')
          .hideDelay(2000)
        );
      $mdDialog.hide();
      reloadSites();
    }, function(){
      $mdToast.show(
        $mdToast.simple()
          .textContent('Ошибка')
          .position('bottom right')
          .hideDelay(1000)
        );
    });
  }
}]);