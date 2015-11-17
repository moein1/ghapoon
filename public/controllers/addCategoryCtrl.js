angular.module('ghapoon').
controller('addCategoryCtrl',['$scope','adminService','$rootScope','alertingService',
	function ($scope,adminService,$rootScope,alertingService) {
	$scope.addCategory =function () {
		console.log('we are in add category');
    function changeCase (input) {
      return input.slice(0,1).toUpperCase() + input.slice(1).toLowerCase();
    }
        /*if(!$rootScope.currentUser){
          $state.go('home.login');
          }*/

        var category={
            category : changeCase($scope.newCategory),
            group : changeCase($scope.newGroup)
        }
       adminService.addCategory(category,function (err,data) {
        if(err){
          alertingService.startAlert('error',err);
            console.log(err);
        }else{
          if(data=='success'){
            alertingService.startAlert('ok','adding group successfully')
            console.log(data);
            $scope.newCategory = '';
            $scope.newGroup = '';
            $scope.addCategoryForm.$setPristine();
          }else{
            console.log(data);
            alertingService.startAlert('error',data);
          }
            
        }
       })
	}
}])