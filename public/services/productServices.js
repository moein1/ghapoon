angular.module('ghapoon').
//if we use constant in minify and uglfy by gulp has problem
//constant('baseUrl','/api/product').
factory('productService',['$http',function ($http) {
	return{
		getProduct:function (pageIndex,productPerPage,orderby,reverse,category,group,callback) {
			 //pageindex is page no minus 1
			 var skip=pageIndex*productPerPage;
			 var top=productPerPage;
			 $http.get('/api/product'+'?$skip='+skip+'&$top='+top+'&$orderby='+
			 	orderby+'&$reverse='+reverse+'&$category='+category+'&$group='+group).
			 then(function (response) {
			 	return callback(null,{
			 		products:response.data.products,
			 		counts:response.data.counts,
			 		category_count:response.data.category_count,
			 		group_count : response.data.group_count
			 	});
			 });
			}
		,
		addProduct:function (newProduct,callback) {
          
			$http.post('/api/product',newProduct).
			then(function (response) {
				if(response.data=='success'){
					return callback(null,response.data);
				}
			})

		},
		searchProduct:function (search,whole,category,group,province,callback) {
			$http.get('/api/searchProduct'+'?$words='+search+'&$whole='+whole+'&$category='+
				category+'&$group='+group+'&$province='+province)
			.then(function (response) {
				return callback(null,
					{products:response.data.searchresult,counts:response.data.counts});
			})
	},
	selectProduct:function (productId,callback) {
		$http.get('/api/product'+'/'+productId).
		then(function (response) {
			return callback(null,response.data.product);
		})
	},
	AddToBasket:function (newFavourite,callback) {
		$http.post('/api/AddToBasket',newFavourite).then(function (response) {
			if(response.data=='success'){
				//adding to basket of session
				return callback(null,response.data);
			}
		})
	},
	sendMessage:function (newMessage,callback) {
		$http.post('/api/sendMessage',newMessage).
		then(function (response) {
			if(response.data == 'success'){
				return callback(null,response.data);
			}
		})
	}
}
}]);