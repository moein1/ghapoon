angular.module('ghapoon')
.directive('zoomContainer', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            scope.$on('$routeChangeSuccess', function() {

                var target = element.children('div.zoomContainer').remove();
            })
        }
    }

});