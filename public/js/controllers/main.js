app.controller('MainCtrl',['$scope','$timeout', '$rootScope', 'Sites', 'Servers', '$mdDialog', '$mdToast', function($scope, $timeout, $rootScope, Sites, Servers, $mdDialog, $mdToast){
	'use strict'
	$scope.query = {
		order: 'domain'
	};
	$scope.logOrder = function (order) {
    	console.log('order: ', order);
  	};
	$scope.removeFilter = function(){
		$scope.filter.show = false;
		if($scope.filter.form.$dirty){
			$scope.query.filter = '';
			$scope.filter.form.$setPristine();
		}
	}
	$scope.loadStuff = function () {
    	$scope.promise = Sites.getSites();
    	console.log($scope.promise);
  	}
	function reloadSites(){
		$scope.promiseSites = Sites.getSites();
		$scope.promiseSites.then(function(data){
			$rootScope.arrSites = data;
		}, function(err){
			console.log(err);
		});
	};
	reloadSites();

	/*site start*/
	$scope.editSite = function(ev, site){
		$scope.popup_site = site;
		showSitePopup(ev);		
	};
	function showSitePopup(ev) {
	    $mdDialog.show({
	      controller: 'siteDialogCtrl',
	      templateUrl: '../templates/site_edit_popup.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      bindToController: true,
	      locals: {
	      	currentSite: $scope.popup_site
	      }
	    })
	  };

	  $scope.addSite =  function(ev){
	  	showSitePopupAdd(ev);
	  }
	  function showSitePopupAdd(ev) {
	    $mdDialog.show({
	      controller: 'siteDialogCtrl',
	      templateUrl: '../templates/site_add_popup.html',
	      parent: angular.element(document.body),
	      targetEvent: ev,
	      clickOutsideToClose:true,
	      bindToController: true,
	      locals: {
	      	currentSite: {}
	      }
	    })
	  };
	  $scope.delSite = function(ev, site){
	  	console.log(site);
	  	var confirm = $mdDialog.confirm()
	          .title('Вы уверенны?')
	          .textContent('Сайт удалится безвозвратно')
	          .ariaLabel('Delete Site')
	          .targetEvent(ev)
	          .ok('Удалить!')
	          .cancel('Отмена');
	    $mdDialog.show(confirm).then(function() {
	    	Sites.delSite(site).then(function(data){
	    		$mdToast.show(
	    		      $mdToast.simple()
	    		       .textContent('Сайт удален')
	    		       .position('bottom right')
	    		       .hideDelay(2000)
	    		      );
	    		$mdDialog.hide();	  		
	    		console.log(data.data.message);
	    		reloadSites();
	    	}, function(err){
	    		$mdToast.show(
	    		$mdToast.simple()
	    			.textContent('Ошибка')
	    			.position('bottom right')
	    			.hideDelay(1000)
	    		);
	    		console.log(err);
	    	})
	    }, function(){
	    	$mdDialog.hide();	
	    });      

	  }
	/*site end*/
	/*Servers start*/
	$scope.editServer = function(ev, server){
		$scope.popup_server = server;
		showServerPopup(ev);		
	};
	function showServerPopup(ev) {
	  $mdDialog.show({
	    controller: 'serverDialogCtrl',
	    templateUrl: '../templates/server_edit_popup.html',
	    parent: angular.element(document.body),
	    targetEvent: ev,
	    clickOutsideToClose:true,
	    bindToController: true,
	    locals: {
	    	currentServer: $scope.popup_server,
	    	reloadServers: reloadServers
	    }
	  })
	};
	$scope.addServer =  function(ev){
		showServerPopupAdd(ev);
	}
	function showServerPopupAdd(ev) {
	  $mdDialog.show({
	    controller: 'serverDialogCtrl',
	    templateUrl: '../templates/server_add_popup.html',
	    parent: angular.element(document.body),
	    targetEvent: ev,
	    clickOutsideToClose:true,
	    bindToController: true,
	    locals: {
	    	currentSite: {},
	    	reloadServers: reloadServers
	    }
	  })
	};
	$scope.deleteServer = function(ev, server){
		console.log(server);
		var confirm = $mdDialog.confirm()
	        .title('Вы уверенны?')
	        .textContent('Cервер "' + server.name + '" удалится безвозвратно')
	        .ariaLabel('Delete Server')
	        .targetEvent(ev)
	        .ok('Удалить!')
	        .cancel('Отмена');
	  $mdDialog.show(confirm).then(function() {
	  	Servers.deleteServer(server).then(function(data){
	  		$mdToast.show(
	  		      $mdToast.simple()
	  		       .textContent('Сервер удален')
	  		       .position('bottom right')
	  		       .hideDelay(1000)
	  		      );
	  		$mdDialog.hide();	  		
	  		console.log(data.data.message);
	  		reloadServers();
	  	}, function(err){
	  		$mdToast.show(
	  		$mdToast.simple()
	  			.textContent('Ошибка')
	  			.position('bottom right')
	  			.hideDelay(1000)
	  		);
	  		console.log(err);
	  	})
	  }, function(){
	  	$mdDialog.hide();	
	  });      
	}
	reloadServers();
	function reloadServers(){
		var promiseServers = Servers.getServers();
		$scope.promiseServers = promiseServers;
		promiseServers.then(function(servers){
			$rootScope.arrServers = servers;
		}, function(err){
			console.log(err);
		})
	}
	/*Server end*/
}]);