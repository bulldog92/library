app.controller('SitesListCtrl',['$scope','$timeout', '$rootScope', 'Sites', 'Servers', '$mdDialog', '$mdToast', function($scope, $timeout, $rootScope, Sites, Servers, $mdDialog, $mdToast){
	'use strict'
	$scope.query = {
		filter: '',
		order: 'site_id',
		limit: '15',
		page: 1,
		selected: []
	};
	$scope.date = {
		datePicker: false 	
	}
	$scope.properties = ['Domain', 'Ip', 'Server'];
	$scope.site = {};
	$scope.query.selected = ['Domain', 'Ip', 'Server'];
	$scope.toggle = toggle;
	$scope.exists = exists;
	$scope.checkDate = checkDate;
	$scope.changeDate = changeDate;
	function toggle(item) {
		var idx = $scope.query.selected.indexOf(item);
		if (idx > -1) {
			$scope.query.selected.splice(idx, 1)
		}
		else {
			$scope.query.selected.push(item)
		}
		console.log($scope.query.selected);			
	};
	function exists(item) {
		return $scope.query.selected.indexOf(item) > -1;
	};
	function checkDate(item) {
		$scope.query.filter = '';
		var idx = $scope.query.selected.indexOf(item);
		if (idx > -1) {
			$scope.query.selected.splice(idx, 1);
			$scope.date.datePicker = false;
			$scope.query.selected = ['Domain', 'Ip', 'Server'];
		}else {
			$scope.query.selected = [];
			$scope.query.selected.push(item);
			$scope.date.datePicker = true;
		}
		dateQuery();
	}
	function changeDate(){
		console.log($scope.date.value.getTime());
		console.log($scope.query.selected);
		dateQuery();
	}
	function dateQuery(){
		var data = null;
		if($scope.date.value){
			data = $scope.date.value.setHours(3);
		}else{
			data = $scope.date.value
		}
		var query = {
			filter: data || '',
			selected: $scope.query.selected
		};
		console.log(query);
		getSitesFilter(query);
	}
	$scope.getSitesFilter = getSitesFilter;
	function getSitesFilter(query){
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
	  getSitesFilter();
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
}]);