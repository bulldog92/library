app.controller('serverDialogCtrl', ['$scope', '$rootScope', '$mdConstant', '$mdDialog', 'locals', 'Servers', '$mdToast', function($scope, $rootScope, $mdConstant, $mdDialog, locals, Servers, $mdToast){
  	$scope.server = locals.currentServer;
    $scope.newServer = {
      ip:[]
    };
    $scope.keys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA];
  	$scope.cancel = function() {
    	$mdDialog.cancel();
      locals.reloadServers();
  	};
  	$scope.update_server = function(){
  		var dataServer = locals.currentServer;
      dataServer.ip = $scope.server.ip;
      dataServer.pass = $scope.server.pass;
      Servers.updateServer(dataServer).then(function(data){
        $mdToast.show(
          $mdToast.simple()
            .textContent('The server is changed')
            .position('bottom right')
            .hideDelay(1500)
          );
        $mdDialog.hide();
      }, function(err){
          $mdToast.show(
            $mdToast.simple()
              .textContent('Error!!!')
              .position('bottom right')
              .hideDelay(1000)
            );
      });
	};
  $scope.addServer = function(){
    var newServer = $scope.newServer;
    Servers.addNew(newServer).then(function(){
      $mdToast.show(
        $mdToast.simple()
          .textContent('The server is created!')
          .position('bottom right')
          .hideDelay(1500)
        );
      $mdDialog.hide();
      locals.reloadServers();
    }, function(){
      $mdToast.show(
        $mdToast.simple()
          .textContent('Error!!!')
          .position('bottom right')
          .hideDelay(1000)
        );
    });
  }
}]);