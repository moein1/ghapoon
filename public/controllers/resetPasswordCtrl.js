angular.module('ghapoon').
controller('resetPasswordCtrl',['$scope','$location','authService',function ($scope,$location,authService) {
	//retrive account from query string and the we can try to get the old password and new password from 
    //and change password
	$scope.changePassword=function () {
		authService.resetPassword($scope.password,$location.search().account);
	}
}])