angular.module('ghapoon').
directive('repeatPassword',function () {
	return{
		require:'ngModel',
		link:function (scope,element,attrs,ctrl) {
			var otherInput=element.inheritedData('$formController')[attrs.repeatPassword];

			ctrl.$parsers.push(function (value) {
				ctrl.$setValidity('repeat',value==otherInput.$viewValue);
				return value;
			});

			otherInput.$parsers.push(function (value) {
				ctrl.$setValidity('repeat',value==ctrl.$viewValue);
				return value;
			})
		}
	}
})