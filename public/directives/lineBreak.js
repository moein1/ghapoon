angular.module('ghapoon').
directive('lineBreak',function () {
	return{ 
		restrict:'EA',
		replace:true,
		scope:{
			list:'='
		},
		link:function (scope,element,attrs) {
			
		},
		templateUrl:'views/lineBreak.html'
	}})