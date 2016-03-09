app.controller('MainCtrl',['$scope', 'Sites', 'Servers', '$mdDialog', '$mdToast', function($scope, Sites, Servers, $mdDialog, $mdToast){
	'use strict'
	Sites.getSites(cb);
	function cb(data){
		$scope.arrSites = data;
	};
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
	/*site end*/
}]);