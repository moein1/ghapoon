angular.module('ghapoon').
controller('shoppingBasket',['$scope','$rootScope',function ($scope,$rootScope) {
	$scope.overlayClass = "white_content";
	
        $scope.displayBlock = { "display":"block" };
        $scope.displayNone = { "display":"none" };    
    
        $scope.lightStyle = $scope.displayNone;
        $scope.fadeStyle = $scope.displayNone;  
}])

//http://www.sitepoint.com/creating-stateful-modals-angularjs-angular-ui-router/

//http://tympanus.net/codrops/2014/02/06/fullscreen-overlay-effects/