app.controller('MainCtrl',['$scope','$timeout', '$rootScope', 'Sites', 'Servers', '$mdDialog', '$mdToast', function($scope, $timeout, $rootScope, Sites, Servers, $mdDialog, $mdToast){
	'use strict'
	$scope.query = {
		filter: '',
		order: 'site_id',
		limit: '15',
		page: 1
	};
	$scope.site = {};
	$scope.items = [1,2,3,4,5];
	$scope.selected = [];
	$scope.toggle = function (item, list) {
		var idx = list.indexOf(item);
		if (idx > -1) list.splice(idx, 1);
		else list.push(item);
	};
	$scope.exists = function (item, list) {
		return list.indexOf(item) > -1;
	};
	$scope.getSitesFilter = function(query){
		query = query || $scope.query;
		$scope.promiseSites = Sites.getSites(query);
		$scope.promiseSites.then(function(data){
			$rootScope.arrSites = data.sites;
			$scope.site.count = data.count;
			console.log($rootScope.arrSites);
		}, function(err){
			console.error(err);
		})
	}
	$scope.$watch('query.filter', function (newValue, oldValue) {
	  if(newValue !== oldValue) {
	    $scope.query.page = 1;
	  }
	  $scope.getSitesFilter();
	});
	$scope.logPagination = function (page, limit) {
	  console.log('page: ', page);
	  console.log('limit: ', limit);
	}
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
	function reloadSites(){
		$scope.promiseSites = Sites.getSites();
		$scope.promiseSites.then(function(data){
			console.log(data);
			$rootScope.arrSites = data.sites;
			$scope.site.count = data.count;
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
	      	currentSite: $scope.popup_site,
	      	reloadSites: reloadSites
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
	      	currentSite: {},
	      	reloadSites: reloadSites
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