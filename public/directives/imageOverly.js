angular.module('ghapoon').
directive('overlayImage',function () {
	return{
		restrict:'E',
		replace:true,
		scope:{
			images:'=images'
		},
		link:function (scope,element,attrs) {
			scope.selectedImage =  '';
           console.log()
            scope.selectImage1=function (image) {
            	console.log('select image '+image);
            	scope.selectedImage=image;
            }
		},
		templateUrl:'./views/SelectImage.html'
	}
})