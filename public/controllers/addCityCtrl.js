angular.module('ghapoon').
controller('addCityCtrl',['$scope','$rootScope','adminService','alertingService',
	function ($scope,$rootScope,adminService,alertingService) {
		function changeCase (input) {
			return input.slice(0,1).toUpperCase() + input.slice(1).toLowerCase();
		}

	$scope.addCity=function () {
		 var provinceCity={
		        province:changeCase($scope.newProvince),
		        city:changeCase($scope.newCity)
		      }
		      console.log('add city');
		      changeCase($scope.newProvince);
		     adminService.addCity(provinceCity,function (err,result) {
		        if(err){
		        	alertingService.startAlert('error',err);
		          console.log('some error adding city '+err);
		        }else{
		        	if(result =='success'){
		        		console.log('adding province successfully ');
		        		alertingService.startAlert('ok','Adding new city successfully');
		        		$scope.newProvince ='';
		        		$scope.newCity ='';
		        		$scope.addCityForm.$setPristine();
		        	}else{
		        		console.log(result);
		        		alertingService.startAlert('error',result);
		        	}
		          
		        }
		      })
			}
}])