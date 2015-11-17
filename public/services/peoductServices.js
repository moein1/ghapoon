angular.module('ghapoon').
constant('baseUrl','/api/').
factory('productService',['$http','baseUrl',function ($http,baseUrl) {
	return{
		getProduct:function (pageIndex,productPerPage,orderby,reverse) {
			 //pageindex is page no minus 1
			 var skip=pageIndex*productPerPage;
			 var top=productPerPage;

			 $http.get(baseUrl+'getProduct?$skip='+skip+'&$top='+top+'&$orderby='+reverse+'&$reverse='+reverse).
			 then(function (response) {
			 	return{
			 		data:response.data,
			 	};
			 });
		},
		addProduct:function (name,description,category,price) {
			// body...
		}
	}
}]);