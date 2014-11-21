var myApp = angular.module('myApp', []);

myApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/pg1', {
	templateUrl: 'page1.html',
	controller: 'pg1ctrl'
      }).
      when('/pg2', {
	templateUrl: 'page2.html',
	controller: 'pg2ctrl'
      }).
      otherwise({
	redirectTo: '/pg1'
      });
}]);

myApp.controller('pg1ctrl', function($scope) {

});

myApp.controller('pg2ctrl', function($scope) {

});
