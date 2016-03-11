app.controller('serverDialogCtrl', ['$scope', '$rootScope', '$mdDialog', 'locals', 'Servers', '$mdToast', function($scope, $rootScope, $mdDialog, locals, Servers, $mdToast){
  	$scope.server = locals.currentServer;
    $scope.newServer = {};
  	$scope.cancel = function() {
    	$mdDialog.cancel();
      locals.reloadServers();
  	};
  	$scope.update_server = function(){
  		var dataServer = locals.currentServer;
      dataServer.name = $scope.server.name;
      dataServer.ip = $scope.server.ip;
      dataServer.pass = $scope.server.pass;
      Servers.updateServer(dataServer).then(function(data){
        $mdToast.show(
          $mdToast.simple()
            .textContent('Сервер изменен')
            .position('bottom right')
            .hideDelay(1500)
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
  $scope.addServer= function(){
    var newServer = $scope.newServer;
    console.log(newServer);
    Servers.addNew(newServer).then(function(){
      $mdToast.show(
        $mdToast.simple()
          .textContent('Сервер создан')
          .position('bottom right')
          .hideDelay(1500)
        );
      $mdDialog.hide();
      locals.reloadServers();
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