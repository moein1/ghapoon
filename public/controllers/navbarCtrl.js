angular.module('ghapoon').
controller('navbarCtrl',['$scope','$rootScope','adminService','authService','$state','alertingService',
	function ($scope,$rootScope,adminService,authService,$state,alertingService) {
  
  $scope.isAdmin = function () {
    if($rootScope.currentUser){
   return $rootScope.currentUser.name.indexOf('ghapoon') > -1
   }else{
    return false;
   } 
}
	if(!$rootScope.currentUser){
        $state.go('home.login');
    }
    
    //use this part for refreshnig the page 
    if($rootScope.currentUser){
      var user={
        email:$rootScope.currentUser.email,
        password:'!same!'
      }
      authService.login(user,function (err,data) {
        if(err){
          alertingService.startAlert('error','error in retrive your personal information from server please login again')
        }else{
          alertingService.startAlert('ok','Referesh your persoanl information successfully')
        }
      })
    }

	//for adding category we should create an admin panel and a user with name contains ghapoon
    $scope.AddCategory=function () {
        
        var category={
            category:'Computer',
            group:'Hard Disk'
        }
       adminService.addCategory(category,function (err,data) {
        if(err){
            console.log(err);
        }else{
        }
       })
    }

    $scope.AddCity = function () {
      var provinceCity={
        province:'Esfahan',
        city:['Esfahan','Khomeinshar','Shahinshar','Kashan','Aran','Aliabad katol']
      }
      console.log('add city');

     adminService.addCity(provinceCity,function (err,result) {
        if(err){
          console.log('some error adding city '+err);
        }else{
        }
      })
    }

    $scope.logout=function () {
		authService.logout();
	}

}])