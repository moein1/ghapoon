angular.module('ghapoon').
directive('imagePreload',['alertingService',function (alertingService) {
	return{
		restrict:'A',
		require:'ngSrc',
		link:function (scope,element,attrs) {
			element.on('load',function () {
				element.addClass('in').
				on('error',function () {
					alertingService.startAlert('error','error loading image');
				})
			})
			//in changing src we should fadeout
			scope.$watch('ngSrc',function (newVal) {
				element.removeClass('in');
			})
		}
	}
}]);