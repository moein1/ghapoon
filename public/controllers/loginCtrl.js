angular.module('ghapoon').
controller('loginCtrl',['$scope','authService','$rootScope','$location','$state','alertingService',
	function ($scope,authService,$rootScope,$location,$state,alertingService) {
		$scope.email="";
		$scope.password="";
		//$scope.loginForm.$setPristine();
        $rootScope.currentUser="";
	$scope.login=function () {
		
		var user={
			email:$scope.email,
			password:$scope.password
		}
		authService.login(user,function (err,data) {
			if(err){
				//$scope.email="";
				//$scope.password="";
				alertingService.startAlert('error',err);

			}else{
				alertingService.startAlert('ok','Login successfully');
				$state.go('home');
			}
		});
	}

	
}])