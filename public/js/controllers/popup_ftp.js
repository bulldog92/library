app.controller('popupFtpCtrl', ['$scope', '$mdDialog', 'locals','$mdToast', 'clipboard', 'Servers', function($scope, $mdDialog, locals, $mdToast, clipboard, Servers){
    $scope.serverName = locals.serverName;
    $scope.ip = locals.ip;
    $scope.login = 'user';
    $scope.user_pass = null;

    $scope.cancel = cancel;
    $scope.copyBufer = copyBufer;


    function getIp(serverName){
      Servers.getServers(serverName).then(function(server){
      	$scope.user_pass = server[0].user_pass;
      }, function(err){
          console.log(err);
      })
    }
    getIp($scope.serverName);

  	function cancel() {
    	$mdDialog.cancel();
  	};
  	
  	function copyBufer(data) {
  	    clipboard.copyText(data);
  	};


}]);