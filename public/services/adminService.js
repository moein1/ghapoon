angular.module('ghapoon').
factory('adminService',['$http',function ($http) {
	return{
		getCategory:function (callback) {
			$http.get('/api/getCategory').
			then(function (response) {
				return callback(null,response.data)
			},function (error) {
				return callback(error);
			})
		},
		addCategory:function  (category,callback) {
			 $http.post('/api/addCategory',category).success(function (response) {
		           //console.log('add new category success');
		           callback(null,response);
		        }).error(function (error) {
		            console.log('add new categry failed');
		            callback(error);
		        })
		},
		addCity:function (cityProvince,callback) {
			$http.post('/api/addCity',cityProvince).success(function (response) {
				//console.log('add new province success');
				callback(null,response);
			}).error(function (error) {
				console.log('add city error');
				callback(error);
			})
			
		},
		getCity:function (callback) {
			$http.get('/api/getCity').
			then(function (response) {
				callback(null,response.data)
			},function (error) {
				callback(error);
			})
		}
	}
}])