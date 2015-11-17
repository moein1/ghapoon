
angular.module('ghapoon').
controller('addProductCtrl',['$scope','productService','$http','alertingService','modalService',
  '$location','$rootScope','$state','adminService',
    function ($scope,productService,$http,alertingService,modalService,$location,$rootScope,$state,adminService) {

	$scope.newProduct={};
    $scope.currentImages = [];
   // $scope.catOptions =[];
   $scope.proOptions = [];
    if(!$rootScope.currentUser){
        $state.go('home.login');
    }

    adminService.getCategory(function (err,result) {
      //console.log('retrive categories success'+result.categories);
      var CategoryGroup =[];
      var id =1;
      angular.forEach(result.categories,function (item) {
        //console.log('category is '+item);
        angular.forEach(item.group,function (group) {
          //console.log('category is '+item[0] +'gropu is '+group);
          CategoryGroup.push({id:id, category:item.category,group:group});
          id ++;
        })
      })
      console.log('categry group '+CategoryGroup);
      $scope.catOptions = CategoryGroup;
    })
    
    adminService.getCity(function (err,result) {
      if(err){
        console.log('some error occured '+err);
      }else{
        
        $scope.proOptions = result.cities;
        console.log('retrive cities success proOptions'+$scope.proOptions);
      }

    })

    $scope.changeCat=function () {
      /* var categoryList=document.getElementById('category');
        var optionsel_category=categoryList.options[categoryList.selectedIndex].parentElement.label;
        var optionsel_group = categoryList.options[categoryList.selectedIndex].label;
        
        console.log('select option id: '+optionsel_category);
        console.log('select group is ' + optionsel_group);*/
        
    }

    //$scope.catOptions=categoryOptinos;

    var provinceOptions=[{'id':1,'label':'Yazd','city':['Yazd','Ardakan','Meybod','Taft']},
                         {'id':2,'label':'Tehran','city':['Eslashahr','Karaj','Damavand','Hadshtgerd']}];

    //$scope.proOptions=provinceOptions;

     $scope.changeCityList= function  () {

        var ProvinceList=document.getElementById('province');
        var CityList=document.getElementById('city');

        var selProvince=ProvinceList.options[ProvinceList.selectedIndex].label;

        var selGroup=
        console.log('you have slelect '+selProvince);

        //remove all the items from list
        while(CityList.options.length){
            CityList.remove(0);
        }

        //var cities=provinceOptions[selProvince];
        var cities=[];

       for (var i = 0; i < $scope.proOptions.length; i++) {
            if($scope.proOptions[i].province==selProvince){
                cities.push($scope.proOptions[i].city);
            }
        };

        if(cities){
            for (var i = 0; i < cities[0].length; i++) {
                var city=new Option(cities[0][i],i);
                CityList.options.add(city); 
            };
        }

      }

    
      $scope.deleteImage=function (image) {
       for (var i = 0; i < $scope.currentImages.length; i++) {
          if($scope.currentImages[i] == image){
            console.log('imge is '+image + i);
            //we should delete from array
            $scope.currentImages.splice(i,1);
            //we should delete from had disk too
           $http.post('/api/deleteFile',{ file : image })
           .success(function (result) {
               if(result.status)
                 alertingService.startAlert('ok','deleting image successfuly');
           }).error(function (error) {
               alertingService.startAlert('error','deleting image failed');
           })
         };   
      }
    }

	$scope.uploadFile = function (files) {
            $scope.uploadMessage = '';
            
            var fd = new FormData();
            //Take the first selected file
            //firstly we must check the file for forbid the latge one
            if (files[0].size > 60000) {
                 alertingService.startAlert('error', 'File size must be less than 30k');
                 console.log('the file is too big');
             } else if (files[0].type != 'image/jpeg') {
                      alertingService.startAlert('error', 'File type must be image/jpeg only');
                     console.log('file type is wrong');
                 } else {

            fd.append("file", files[0]);
            $http.post('/api/uploadFile', fd, {
                withCredentials: true,
                headers: { 'Content-Type': undefined },
                transformRequest: angular.identity
            }).success(function (result) {
                console.log(result);
                if (result.status) {
                    alertingService.startAlert('ok', 'Your image has been uploaded successfully please Press Save');
                    $scope.uploadMessage = 'Your image has been uploaded successfully please Press Save button for change your profile picture';
                    $scope.currentImages.push(files[0].name) ;
                } else {
                    alertingService.startAlert('error', result.message);
                }


            }).error(function (error) {
                alertingService.startAlert('error', 'Upload image failed');
            });
        };
        };


      $scope.insertProduct=function () {
		//for adding product picture 
		console.log(document.getElementById('uploadFile').files[0]);
            if (document.getElementById('uploadFile').files[0]) {
                //var uploadfile = document.getElementById('uploadFile').files[0].name;
                $scope.newProduct.image = $scope.currentImages;
            }
            
            var selCat=document.getElementById('category');
            var selProvince=document.getElementById('province');
            var selCity=document.getElementById('city');
            $scope.newProduct.category = selCat[selCat.selectedIndex].parentElement.label;
            $scope.newProduct.group=selCat[selCat.selectedIndex].label;
            $scope.newProduct.province=selProvince[selProvince.selectedIndex].label;
            $scope.newProduct.city=selCity[selCity.selectedIndex].label;
            $scope.newProduct.email=$rootScope.currentUser.email;
           
		productService.addProduct($scope.newProduct,function (err,data) {
			if(err==null){
				$scope.newProduct={};
                $scope.currentImages=[];
                $scope.addProduct.$setPristine();
                alertingService.startAlert('ok','New product add successfully');
			}else{
                alertingService.startAlert('error','Adding new product failed');
            }
		});
	}


    var modalOptions={
            closeButtonText:'Cancel',
            actionButtonText:'Leave Now',
            headerText:'Cancel Insert/Edit',
            bodyText:'Are you sure to cancel Inserting New Product?'
        }

    $scope.cancel=function () {
         //showing modal for suring to cancel editing or updating product
            modalService.showModal({}, modalOptions).then(function (result) {
                if (result == 'ok') {
                    $location.path('/');
                }
            });
    }

    
	
}])