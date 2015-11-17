angular.module('ghapoon').
controller('signupCtrl',['$scope','authService',function ($scope,authService) {
	$scope.signup=function () {
		var newUser={
			name:$scope.name,
			email:$scope.email,
			password:$scope.password
		};

		authService.signup(newUser);
	}
}]);