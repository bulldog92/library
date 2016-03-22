var app=angular.module("libraryApp",["ui.router","satellizer","ngAnimate","ngMaterial","ngMessages","ngMdIcons","md.data.table"]);app.config(["$stateProvider","$urlRouterProvider","$authProvider",function(e,t,o){var r=["$q","$auth",function(e,t){var o=e.defer();return t.isAuthenticated()?o.reject():o.resolve(),o.promise}],n=["$q","$location","$auth",function(e,t,o){var r=e.defer();return o.isAuthenticated()?r.resolve():t.path("/login"),r.promise}],i=["$q","$location","$auth","Account","$rootScope",function(e,t,o,r,n){var i=e.defer();if(n.user)"admin"==n.user.role?i.resolve():t.path("/login");else{var l=r.getProfile();l.then(function(e){"admin"==e.data.role?i.resolve():t.path("/login")},function(e){t.path("/login"),console.log(e)})}return i.promise}];e.state("home",{url:"/",templateUrl:"templates/main.html",controller:"MainCtrl",resolve:{loginRequired:n}}).state("register",{url:"/register",templateUrl:"templates/register.html",controller:"AuthCtrl",resolve:{skipIfLoggedIn:r}}).state("login",{url:"/login",templateUrl:"templates/login.html",controller:"AuthCtrl",resolve:{skipIfLoggedIn:r}}).state("logout",{url:"/logout",template:null,controller:"LogoutCtrl"}).state("profile",{url:"/profile",templateUrl:"templates/profile.html",controller:"ProfileCtrl",resolve:{loginRequired:n}}).state("only_admin",{url:"/only_admin",templateUrl:"templates/only_admin.html",controller:"onlyAdminCtrl",resolve:{adminLogin:i}}).state("only_admin.users_list",{url:"/users_list",templateUrl:"templates/users_list.html",controller:"usersListCtrl",resolve:{adminLogin:i}}).state("only_admin.servers",{url:"/servers",templateUrl:"templates/servers_list.html",controller:"ServersListCtrl",resolve:{adminLogin:i}}).state("sites",{url:"/sites",templateUrl:"templates/sites_list.html",controller:"SitesListCtrl",resolve:{loginRequired:n}}).state("calculator",{url:"/servers",templateUrl:"templates/calculator.html",controller:"calculatorCtrl",resolve:{loginRequired:n}}).state("forgot_pass",{url:"/forgot_pass",templateUrl:"templates/forgot_pass.html",controller:"forgotpassCtrl",resolve:{skipIfLoggedIn:r}}),t.otherwise("/")}]),app.run(["$rootScope","$state","$stateParams",function(e,t,o){e.$state=t,e.$stateParams=o,e.$on("$stateChangeSuccess",function(t,o,r,n,i){e.previousState_name=n.name||"home",e.previousState_params=i}),e.back=function(){t.go(e.previousState_name,e.previousState_params)}}]),app.controller("AuthCtrl",["$scope","$auth","$location","Account","$mdToast",function(e,t,o,r,n,i){e.newUser={},e.errorMessage=!1,e.register=function(){t.signup(e.newUser).then(function(e){t.setToken(e),r.setUser().then(function(e){o.path("/")})})["catch"](function(t){console.log(t),e.errorMessage=t.data.message})},e.loginUser={},e.login=function(){t.login(e.loginUser).then(function(){n.show(n.simple().textContent("Вход").position("bottom right").hideDelay(1e3)),r.setUser().then(function(e){o.path("/")})})["catch"](function(t){console.log(t),e.errorMessage=t.data.message})}}]),app.controller("calculatorCtrl",["$scope",function(e){e.test="It is work"}]),app.controller("forgotpassCtrl",["$scope","Account","$location","$timeout",function(e,t,o,r){e.forgotAccount={},e.forgotSubmit=function(){var n=t.forgotPass(e.forgotAccount);n.then(function(t){"200"==t.status?(e.successMessage="Новый пароль отправлен на почту",r(function(){o.path("/login")},2500)):e.errorMessage="При отправке произошла ошибка"},function(t){e.errorMessage="При отправке произошла ошибка"})}}]),app.controller("leftCtrl",["$scope","$timeout","$mdSidenav","$log",function(e,t,o,r){e.close=function(){o("left").close().then(function(){r.debug("close Left is done")})}}]),app.controller("AppCtrl",["$scope","$timeout","$mdSidenav","$log",function(e,t,o,r){function n(e){return function(){o(e).toggle().then(function(){r.debug("toggle "+e+" is done")})}}e.toggleLeft=n("left"),e.isOpenLeft=function(){return o("left").isOpen()}}]),app.controller("LogoutCtrl",["$location","$auth","$rootScope","$mdToast",function(e,t,o,r){t.isAuthenticated()&&t.logout().then(function(){r.show(r.simple().textContent("Пока").position("bottom right").hideDelay(1e3)),o.user={},e.path("/login")})}]),app.controller("MainCtrl",["$scope","$mdDialog","$mdToast",function(e,t,o){"use strict";e.title="Welcome to Library Sites"}]),app.controller("NavCtrl",["$scope","$auth","$rootScope","Account",function(e,t,o,r){r.setUser(),e.isAuthenticated=function(){return t.isAuthenticated()},e.isAdmin=function(){return t.isAuthenticated()?o.user&&"admin"==o.user.role?!0:void 0:!1}}]),app.controller("onlyAdminCtrl",function(e){e.hi="Hi admin "}),app.controller("onlyAdminCtrl",["$scope",function(e){e.hi="Hi admin "}]),app.controller("ProfileCtrl",["$rootScope","$scope","$auth","Account","$mdToast","$document",function(e,t,o,r,n,i){t.editProfile={displayName:t.user.displayName,email:t.user.email},t.updateProfile=function(){t.successMessage="",t.errorMessage="",r.updateProfile(t.editProfile).then(function(e){n.show(n.simple().textContent("Профиль изменен!").position("bottom right").hideDelay(3e3)),t.successMessage="Профиль изменен",console.log("Profile has been updated"),console.log(e.data.message),t.user.email=t.editProfile.email,t.user.displayName=t.editProfile.displayName},function(e){"304"==e.status?(console.log("not modified"),t.errorMessage="Ничего не изменилось"):t.errorMessage=e.data.message,t.editProfile={displayName:t.user.displayName,email:t.user.email},console.log(e)})}}]),app.controller("serverDialogCtrl",["$scope","$rootScope","$mdConstant","$mdDialog","locals","Servers","$mdToast",function(e,t,o,r,n,i,l){e.server=n.currentServer,e.newServer={ip:[]},e.keys=[o.KEY_CODE.ENTER,o.KEY_CODE.COMMA],e.cancel=function(){r.cancel(),n.reloadServers()},e.update_server=function(){var t=n.currentServer;t.ip=e.server.ip,t.pass=e.server.pass,i.updateServer(t).then(function(e){l.show(l.simple().textContent("Сервер изменен").position("bottom right").hideDelay(1500)),r.hide()},function(e){l.show(l.simple().textContent("Ошибка").position("bottom right").hideDelay(1e3))})},e.addServer=function(){var t=e.newServer;console.log(t),i.addNew(t).then(function(){l.show(l.simple().textContent("Сервер создан").position("bottom right").hideDelay(1500)),r.hide(),n.reloadServers()},function(){l.show(l.simple().textContent("Ошибка").position("bottom right").hideDelay(1e3))})}}]),app.controller("ServersListCtrl",["$scope","Servers","$mdDialog","$mdToast",function(e,t,o,r){"use strict";function n(t){o.show({controller:"serverDialogCtrl",templateUrl:"../templates/server_edit_popup.html",parent:angular.element(document.body),targetEvent:t,clickOutsideToClose:!0,bindToController:!0,locals:{currentServer:e.popup_server,reloadServers:l}})}function i(e){o.show({controller:"serverDialogCtrl",templateUrl:"../templates/server_add_popup.html",parent:angular.element(document.body),targetEvent:e,clickOutsideToClose:!0,bindToController:!0,locals:{currentSite:{},reloadServers:l}})}function l(){var o=t.getServers();e.promiseServers=o,o.then(function(t){e.arrServers=t},function(e){console.log(e)})}e.editServer=function(t,o){e.popup_server=o,n(t)},e.addServer=function(e){i(e)},e.deleteServer=function(e,n){console.log(n);var i=o.confirm().title("Вы уверенны?").textContent('Cервер "'+n.name+'" удалится безвозвратно').ariaLabel("Delete Server").targetEvent(e).ok("Удалить!").cancel("Отмена");o.show(i).then(function(){t.deleteServer(n).then(function(e){r.show(r.simple().textContent("Сервер удален").position("bottom right").hideDelay(1e3)),o.hide(),console.log(e.data.message),l()},function(e){r.show(r.simple().textContent("Ошибка").position("bottom right").hideDelay(1e3)),console.log(e)})},function(){o.hide()})},l()}]),app.controller("siteDialogCtrl",["$scope","$mdDialog","locals","Sites","Servers","$mdToast",function(e,t,o,r,n,i){function l(t){n.getServers(t).then(function(t){e.site_ips=t[0].ip,console.log(e.site_ips)},function(e){console.log(e)})}e.site=o.currentSite,e.newSite={},e.servers=null,e.currentServer={name:e.site.server},e.currentIp=e.site.ip,e.choseIp=function(){(e.currentServer.name!==e.site.server||e.currentIp!==e.site.ip)&&(e.currentIp="")},e.getServs=function(){n.getServers().then(function(t){e.servers=t},function(e){console.log(e)})},e.getIp=l,e.cancel=function(){t.cancel(),o.reloadSites()},e.update_site=function(){var n=o.currentSite;n.ip=e.currentIp,n.server=e.currentServer.name,r.updateSite(n).then(function(e){i.show(i.simple().textContent("Сайт изменен").position("bottom right").hideDelay(2e3)),t.hide()},function(e){i.show(i.simple().textContent("Ошибка").position("bottom right").hideDelay(1e3))})},e.addSite=function(){var n={server:e.newSite.server.name,domain:e.newSite.domain,ip:e.newSite.ip};console.log(n),r.addNew(n).then(function(){i.show(i.simple().textContent("Сайт создан").position("bottom right").hideDelay(2e3)),t.hide(),o.reloadSites()},function(){i.show(i.simple().textContent("Ошибка").position("bottom right").hideDelay(1e3))})}}]),app.controller("SitesListCtrl",["$scope","Sites","Servers","$mdDialog","$mdToast",function(e,t,o,r,n){"use strict";function i(t){var o=e.query.selected.indexOf(t);o>-1?e.query.selected.splice(o,1):e.query.selected.push(t),console.log(e.query.selected),u()}function l(t){return e.query.selected.indexOf(t)>-1}function s(t){e.query.filter="";var o=e.query.selected.indexOf(t);o>-1?(e.query.selected.splice(o,1),e.date.datePicker=!1,e.query.selected=["Domain","Ip","Server"],e.date.value=""):(e.query.selected=[],e.query.selected.push(t),e.date.datePicker=!0),c()}function a(){console.log(e.date.value.getTime()),console.log(e.date.value.getTime()-60*e.date.value.getTimezoneOffset()*1e3),console.log(e.query.selected),c()}function c(){var t=null;if(e.date.value){t=e.date.value.getTime()-60*e.date.value.getTimezoneOffset()*1e3;var o={filter:t||"",selected:e.query.selected};console.log(o),e.query.page=1,u(o)}else t=null,u()}function u(o){o=o||e.query,e.promiseSites=t.getSites(o),e.promiseSites.then(function(t){e.arrSites=t.sites,e.site.count=t.count},function(e){console.error(e)})}function p(){e.query.filter?u():e.date.value?c():(e.promiseSites=t.getSites(),e.promiseSites.then(function(t){console.log(t),e.arrSites=t.sites,e.site.count=t.count},function(e){console.log(e)}))}function d(t){r.show({controller:"siteDialogCtrl",templateUrl:"../templates/site_edit_popup.html",parent:angular.element(document.body),targetEvent:t,clickOutsideToClose:!0,bindToController:!0,locals:{currentSite:e.popup_site,reloadSites:p}})}function m(e){r.show({controller:"siteDialogCtrl",templateUrl:"../templates/site_add_popup.html",parent:angular.element(document.body),targetEvent:e,clickOutsideToClose:!0,bindToController:!0,locals:{currentSite:{},reloadSites:p}})}e.query={filter:"",order:"site_id",limit:"15",page:1,selected:[]},e.date={datePicker:!1},e.properties=["Domain","Ip","Server"],e.site={},e.query.selected=["Domain","Ip","Server"],e.toggle=i,e.exists=l,e.checkDate=s,e.changeDate=a,e.getSitesFilter=u,e.$watch("query.filter",function(t,o){t!==o&&(e.query.page=1),u()}),e.logPagination=function(e,t){console.log("page: ",e),console.log("limit: ",t)},e.logOrder=function(e){console.log("order: ",e)},e.removeFilter=function(){e.filter.show=!1,e.query={filter:"",order:"site_id",page:1,limit:"15",selected:["Domain","Ip","Server"]},e.date.value="",e.date.datePicker=!1,e.filter.form.$dirty&&(e.query.filter="",e.filter.form.$setPristine()),p()},p(),e.editSite=function(t,o){e.popup_site=o,d(t)},e.addSite=function(e){m(e)},e.delSite=function(e,o){console.log(o);var i=r.confirm().title("Вы уверенны?").textContent("Сайт удалится безвозвратно").ariaLabel("Delete Site").targetEvent(e).ok("Удалить!").cancel("Отмена");r.show(i).then(function(){t.delSite(o).then(function(e){n.show(n.simple().textContent("Сайт удален").position("bottom right").hideDelay(2e3)),r.hide(),console.log(e.data.message),p()},function(e){n.show(n.simple().textContent("Ошибка").position("bottom right").hideDelay(1e3)),console.log(e)})},function(){r.hide()})}}]),app.controller("userDialogCtrl",["$scope","$mdDialog","locals","usersList","$mdToast",function(e,t,o,r,n){e.role=o.currentUser.role,e.roles=["admin","user"],e.cancel=function(){t.cancel()},e.update_user=function(){var i=o.currentUser;i.role=e.role,r.changeRole(i).then(function(e){n.show(n.simple().textContent("Пользователь изменен").position("bottom right").hideDelay(1e3)),console.log(e),t.hide()},function(e){n.show(n.simple().textContent("Ошибка").position("bottom right").hideDelay(1e3)),console.log(e)})}}]),app.controller("usersListCtrl",["$scope","usersList","$mdDialog","$mdToast",function(e,t,o,r){function n(t){e.users=t,console.log(e.users)}function i(t){o.show({controller:"userDialogCtrl",templateUrl:"../templates/user_popup.html",parent:angular.element(document.body),targetEvent:t,clickOutsideToClose:!0,bindToController:!0,locals:{currentUser:e.popup_user}})}t.getUsers(n),e.editUser=function(t,o){e.popup_user=o,i(t)},e.deleteUser=function(e,i){console.log(i);var l=o.confirm().title("Вы уверенны?").textContent("Пользователь удалится безвозвратно").ariaLabel("Delete user").targetEvent(e).ok("Удалить!").cancel("Отмена");o.show(l).then(function(){console.log(i),t.deleteUser(i).then(function(e){console.log(e),r.show(r.simple().textContent("Пользователь удален").position("bottom right").hideDelay(1e3)),t.getUsers(n)},function(e){console.log(e),r.show(r.simple().textContent("Ошибка при удалении").position("bottom right").hideDelay(1e3))})},function(){o.hide()})}}]);var compareTo=function(){return{require:"ngModel",scope:{otherModelValue:"=compareTo"},link:function(e,t,o,r){r.$validators.compareTo=function(t){return t==e.otherModelValue},e.$watch("otherModelValue",function(){r.$validate()})}}};app.directive("compareTo",compareTo),app.factory("Account",["$http","$rootScope",function(e,t){return{setUser:function(){return e.get("/api/me").then(function(e){t.user=e.data,console.log("data: ",t.user)})},getProfile:function(){return e.get("/api/me")},updateProfile:function(t){return e.put("/api/me",t)},forgotPass:function(t){return e.post("/api/forgot",t)}}}]),app.factory("Servers",["$http","$q",function(e,t){function o(o){var r=t.defer();return o?(e({method:"GET",url:"/api/servers/"+o}).then(function(e){l=e.data,r.resolve(l)},function(e){r.reject(e)}),r.promise):(e({method:"GET",url:"/api/servers"}).then(function(e){l=e.data,r.resolve(l)},function(e){r.reject(e)}),r.promise)}function r(t){return e({method:"PUT",url:"/api/servers",data:t})}function n(t){return e({method:"POST",data:t,url:"/api/servers"})}function i(t){return e({method:"DELETE",url:"/api/servers/"+t._id})}var l=null;return{getServers:o,updateServer:r,addNew:n,deleteServer:i}}]),app.factory("Sites",["$http","$q",function(e,t){function o(o){var r=t.defer();return o?(e({method:"GET",url:"/api/sites",params:{filter:o.filter||"",selected:o.selected||[]}}).then(function(e){r.resolve(e.data)},function(e){r.reject(e)}),r.promise):(e({method:"GET",url:"/api/sites"}).then(function(e){r.resolve(e.data)},function(e){r.reject(e)}),r.promise)}function r(t){return e({method:"PUT",data:t,url:"/api/sites"})}function n(t){return e({method:"POST",data:t,url:"/api/sites"})}function i(t){return e({method:"DELETE",url:"/api/sites/"+t._id})}return{getSites:o,updateSite:r,addNew:n,delSite:i}}]),app.factory("usersList",["$http",function(e){function t(t){e({method:"GET",url:"/api/user"}).then(function(e){n=e.data,t(n)},function(e){console.log(e)})}function o(t){return e({method:"PUT",url:"/api/user",data:t})}function r(t){return e({method:"POST",url:"/api/user_delete",data:t})}var n=null;return{getUsers:t,changeRole:o,deleteUser:r}}]);