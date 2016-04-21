app.controller('SitesListCtrl',['$scope', 'Sites', 'Servers', '$mdDialog', '$mdToast', 'hotkeys', function($scope, Sites, Servers, $mdDialog, $mdToast, hotkeys){
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
	$scope.getSitesFilter = getSitesFilter;
	$scope.showPopupOne = showPopupOne;
	$scope.showPopupFtp = showPopupFtp;


	hotkeys.bindTo($scope)
	  .add({
	    combo: 'ctrl+f',
	    description: 'search',
	    callback: function() {
	    	event.preventDefault();
			$scope.filter.show = true;
	    }
	  })

	function toggle(item) {
		var idx = $scope.query.selected.indexOf(item);
		if (idx > -1) {
			$scope.query.selected.splice(idx, 1)
		}
		else {
			$scope.query.selected.push(item)
		}
		getSitesFilter();			
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
			$scope.date.value = '';
		}else {
			$scope.query.selected = [];
			$scope.query.selected.push(item);
			$scope.date.datePicker = true;
		}
		dateQuery();
	}


	function changeDate(){
		dateQuery();
	}


	function dateQuery(){
		var data = null;
		if($scope.date.value){
			data = $scope.date.value.getTime() - $scope.date.value.getTimezoneOffset()*60*1000;
			var query = {
				filter: data || '',
				selected: $scope.query.selected,
				limit: $scope.query.limit,
				page: $scope.query.page,
				order: $scope.query.order
			};
			$scope.query.page = 1;
			getSitesFilter(query);
		}else{
			data = null;
			getSitesFilter();
		}	
	}



	function getSitesFilter(query){
		query = query || $scope.query;
		$scope.promiseSites = Sites.getSites(query);
		$scope.promiseSites.then(function(data){
			console.log(data);
			$scope.arrSites = data.sites;
			$scope.site.count = data.count;
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
	  $scope.query.page = page;
	  $scope.query.limit = limit;
	  if($scope.date.value){
	  	dateQuery();
	  }else{
	  	getSitesFilter();
	  }
	}
	$scope.logOrder = function (order) {
    	$scope.query.order = order;
    	dateQuery();
  	};
	$scope.removeFilter = function(){
		$scope.filter.show = false;
		$scope.query = {
			filter: '',
			order: 'site_id',
			page: 1,
			limit: $scope.query.limit,
			selected: ['Domain', 'Ip', 'Server']
		};
		$scope.date.value = '';
		$scope.date.datePicker = false;
		if($scope.filter.form.$dirty){
			$scope.query.filter = '';
			$scope.filter.form.$setPristine();
		}
		reloadSites();
	}
	function reloadSites(){
		if($scope.query.filter){
			getSitesFilter();
		}else if($scope.date.value){
			dateQuery();
		}else{
			getSitesFilter();
		}
	};
	reloadSites();

	/*Document popup one prop start*/
	function showPopupOne(ev, onePopupInfo, nameTitle) {
		$mdDialog.show({
		  controller: 'onePopupInfo',
		  templateUrl: '../templates/site_popup_one.html',
		  parent: angular.element(document.body),
		  targetEvent: ev,
		  clickOutsideToClose:true,
		  bindToController: true,
		  locals: {
		  	onePopupInfo: onePopupInfo,
		  	nameTitle: nameTitle
		  }
		})
	}
	/*Document popup one prop end*/
	/*
		popup ftp start
	*/

	function showPopupFtp(ev, serverName, ip) {
		$mdDialog.show({
		  controller: 'popupFtpCtrl',
		  templateUrl: '../templates/site_popup_ftp.html',
		  parent: angular.element(document.body),
		  targetEvent: ev,
		  clickOutsideToClose:true,
		  bindToController: true,
		  locals: {
		  	serverName: serverName,
		  	ip: ip
		  }
		})
	}



	/*
		popup ftp start
	*/

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
	          .title('Are you sure?')
	          .textContent('The site is deleted permanently!!!')
	          .ariaLabel('Delete Site')
	          .targetEvent(ev)
	          .ok('Delete!')
	          .cancel('Cancel');
	    $mdDialog.show(confirm).then(function() {
	    	Sites.delSite(site).then(function(data){
	    		$mdToast.show(
	    		      $mdToast.simple()
	    		       .textContent('Site removed!')
	    		       .position('bottom right')
	    		       .hideDelay(2000)
	    		      );
	    		$mdDialog.hide();	  		
	    		console.log(data.data.message);
	    		reloadSites();
	    	}, function(err){
	    		$mdToast.show(
	    		$mdToast.simple()
	    			.textContent('Error!!!')
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