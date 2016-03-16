app.controller('siteDialogCtrl', ['$scope', '$rootScope', '$mdDialog', 'locals', 'Sites', 'Servers', '$mdToast', function($scope, $rootScope, $mdDialog, locals, Sites, Servers, $mdToast){
  	$scope.site = locals.currentSite;
    $scope.newSite = {};
    $scope.servers = null;
    $scope.currentServer = {
      name: $scope.site.server
    };
    $scope.currentIp = $scope.site.ip;
    $scope.choseIp = function(){
      if($scope.currentServer.name !== $scope.site.server || $scope.currentIp !== $scope.site.ip){
        $scope.currentIp = '';
      }  
    }
    $scope.getServs = function(){
     Servers.getServers().then(function(servers){
           $scope.servers = servers;
         }, function(err){
           console.log(err);
      }); 
    }
    $scope.getIp = getIp;
    function getIp(serverName){
      Servers.getServers(serverName).then(function(server){
        $scope.site_ips = server[0].ip;
          console.log($scope.site_ips);
      }, function(err){
          console.log(err);
      })
    }
  	$scope.cancel = function() {
    	$mdDialog.cancel();
      locals.reloadSites();
  	};
  	$scope.update_site = function(){
  		var dataSite = locals.currentSite;
      dataSite.ip = $scope.currentIp;
      dataSite.server = $scope.currentServer.name;
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
    var newSite = {
      server: $scope.newSite.server.name,
      domain: $scope.newSite.domain,
      ip: $scope.newSite.ip
    };
    console.log(newSite);
    Sites.addNew(newSite).then(function(){
      $mdToast.show(
        $mdToast.simple()
          .textContent('Сайт создан')
          .position('bottom right')
          .hideDelay(2000)
        );
      $mdDialog.hide();
      locals.reloadSites();
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