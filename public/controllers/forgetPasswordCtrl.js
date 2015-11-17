angular.module('ghapoon').
controller('forgetPasswordCtrl',['$scope','authService',function ($scope,authService) {
	$scope.forgetPass=function () {
		var email={
			email:$scope.email
		};
		authService.forgetPassword(email);
	}
}]);