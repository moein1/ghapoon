//we use angular-ui-bootstrap for model
angular.module('ghapoon').
service('modalService', ['$modal', function ($modal) {
    var modalDefault = {
        backdrop: true,
        keyboard: true,
        modalFade: true,
        templateUrl: '../partials/modal.html'
    };

    var modalOptions = {
        closeButtonText: 'Close',
        actionButtonText: 'Ok',
        headerText: 'Procced?',
        bodyText:'Perform this actions?'
    }

    this.showModal = function (customModalDefault,customModalOptions) {
        if (!customModalDefault) customModalDefault = {};
        customModalDefault.backdrop = 'static';

        return this.show(customModalDefault, customModalOptions);
    }

    this.show = function (customModalDefault, customModalOptions) {
        var tempModalDefault = {};
        var tempModalOptions = {};

        //map angular-ui modal custom to modal define service
        angular.extend(tempModalDefault, modalDefault, customModalDefault);
        angular.extend(tempModalOptions, modalOptions, customModalOptions);

        if (!tempModalDefault.controller) {
            tempModalDefault.controller = function ($scope, $modalInstance) {
                $scope.modalOptions = tempModalOptions;

                $scope.modalOptions.ok = function (result1) {
                    $modalInstance.close('ok');
                }

                $scope.modalOptions.close = function (result1) {
                    $modalInstance.close('cancel');
                }
            }
            tempModalDefault.controller.$inject = ['$scope', '$modalInstance'];
        }
        return $modal.open(tempModalDefault).result;

    }

   

}]);