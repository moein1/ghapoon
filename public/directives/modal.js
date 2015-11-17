angular.module('ghapoon').
directive('modal',['$rootScope','$timeout',function ($rootScope,$timeout) {
	return{
		restrict:'E',
		transclude:true,
		templateUrl:'./views/modal.html'
	}
}]);



