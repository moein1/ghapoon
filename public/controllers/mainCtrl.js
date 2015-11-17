angular.module('ghapoon').
controller('mainCtrl',['$scope','$location','productService','$rootScope',
  'alertingService','$state','authService','adminService',
  function ($scope,$location,productService,$rootScope,alertingService,$state,authService,adminService) {
	//for limiting product we should use some prameter tthrough querystring
 if(!$rootScope.currentUser){
        $state.go('home.login');
    }
  	$scope.productPerPage=30;
  	$scope.pageIndex=0;
  	$scope.reverse=-1;
  
    $scope.category="all";

    $scope.orderby='AddDate';
    $scope.words=[];

    $scope.categorySelected= false;
    $scope.group = "all";

    adminService.getCategory(function (err,result) {
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
      $scope.catOptions = CategoryGroup;
    })
    
    adminService.getCity(function (err,result) {
      if(err){
        console.log('some error occured '+err);
      }else{
        
        $scope.proOptions = result.cities;
      }

    })

    $scope.AddToBasket=function (product) {
      //we must check if the product has been added to your shopping basket
    var productId=product._id;
    var alreadyHas= false;
    for (var i = 0; i < $rootScope.shoppingBasket.length; i++) {
     if ($rootScope.shoppingBasket[i]._id == productId){
      alreadyHas = true;
      alertingService.startAlert('error','You have already added this product to your shoppingBasket');
      break;
     }
    };
    if(!alreadyHas){

    var newFavour={
      Product:product,
      userId:$rootScope.currentUser._id
    }

    productService.AddToBasket(newFavour,function (err,result) {
      if(result=="success"){
        alertingService.startAlert('ok','Add new product to your basket successfully');
        //we should add this product to basket of
        $rootScope.shoppingBasket.push(product);
      }
    });
   }

  }

    $scope.searchProduct=function () {
       var selCat=document.getElementById('category');
        var selProvince=document.getElementById('province');
        var selCity=document.getElementById('city');
        var searchCategory = selCat[selCat.selectedIndex].parentElement.label;
        var searchGroup = selCat[selCat.selectedIndex].label;
        var searchProvince=selProvince[selProvince.selectedIndex].label;
        if (searchGroup == 'All Category'){
          searchGroup = 'all';
          searchCategory = 'all';
        }

        if(searchProvince == 'All Province'){
          searchProvince = 'all';
        }

        $scope.words=$scope.search.split(' ');
     //we must search the words in name and description
     productService.searchProduct($scope.search,$scope.whole,searchCategory,searchGroup,searchProvince,function (err,data) {
       if(err){
        console.log('some error in search '+err);
       }else{
        $scope.search='';
        $scope.products=data.products;
        $scope.counts=data.counts;
        $scope.pageIndex=0;
        $scope.category='all';
        createPager(data.counts);
       }
     });
    }


    $scope.sortproduct=function () {
        switch($scope.sort){
            case 'Name':
               $scope.orderby='name';
               $scope.reverse=1;  
               break;
            case 'Cheapest':
               $scope.reverse=1;
               $scope.orderby="price";
               break;
            case 'Most Expensive':
               $scope.reverse=-1;
               $scope.orderby="price";
               break; 
            case 'Oldest':
               $scope.reverse=1;
               $scope.orderby="AddDate";
               break; 
            case 'Newest':
               $scope.reverse=-1;
               $scope.orderby="AddDate";
               break; 
        }

        $scope.pageIndex = 0;
        getLimitProduct();
    }

    getLimitProduct();
   

    $scope.selectProduct=function (id) {
       $location.path('/selectProduct/1');
    }
    
    $scope.Category_product=function (category) {
        $scope.pageIndex=0;
        $scope.group='all';
        $scope.category=category;
        $scope.categorySelected = true;
        getLimitProduct();
    }

    $scope.group_category =function (group) {
      $scope.pageIndex=0;
      $scope.group=group;
      getLimitProduct();
    }

    $scope.setPage=function (page) {
        $scope.pageIndex = page - 1;
        getLimitProduct();
    }

    function getLimitProduct () {
    	productService.getProduct($scope.pageIndex,$scope.productPerPage,$scope.orderby,
        $scope.reverse,$scope.category,$scope.group,
            function (err,data) {
            $scope.category_count=data.category_count;
            $scope.group_count = data.group_count;
            if(data.group_count){
            }
            
            createPager(data.counts);
            $scope.products=data.products;
        })
    }

    function  createPager(counts) {
      $scope.counts=counts;
            $scope.pages=[];
            $scope.noOfPages=Math.ceil($scope.counts / $scope.productPerPage);
           for (var i = ($scope.pageIndex -5 < 0 ? 0 : $scope.pageIndex -5) ; 
            i < Math.min( $scope.noOfPages , $scope.pageIndex + 5 ) ; i++) {
              $scope.pages.push(i+1);  
            };
    }

    $scope.addProduct=function () {
    	$location.path('/addProduct');
    }
}
])