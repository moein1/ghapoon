angular.module('ghapoon').
directive('uniqueEmail',['$http',function ($http) {
	return{
		restrict:'A',
		require:'ngModel',
		link:function (scope,element,attrs,ctrl) {
			element.bind('blur',function () {
				if(ctrl.$modelValue){
					$http.get('/api/user',{params:{email:ctrl.$modelValue}}).success(function (data) {
						console.log('available is '+data.available);
						ctrl.$setValidity('unique',!data.available);
					})
				}
			})
		}
	}
}])