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
		$scope.promise = Sites.getSites();
		$scope.promise.then(function(data){
			$rootScope.arrSites = data;
		}, function(err){
			console.log(err);
		});
	};
	reloadSites();
	Servers.getServers(servCb);
	function servCb(data){
		$scope.arrServers = data;
	}
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
	    		console.log(error);
	    	})
	    }, function(){
	    	$mdDialog.hide();	
	    });      

	  }
	/*site end*/
}]);