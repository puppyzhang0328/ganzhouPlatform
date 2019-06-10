/**
 * error.modal.controller.js
 * @author: huangxiang
 * @create 2017-04-01 16:47
 */

(function(){

    angular.module('app.auth')
        .controller('ModalResultInstanceController',ModalResultInstanceController);

    ModalResultInstanceController.$inject = ['$uibModalInstance','PermissionErrorModal','$state'];

    'use strict';

    function ModalResultInstanceController($uibModalInstance,PermissionErrorModal,$state) {
        var vm = this;

        vm.alertWarn = function () {
            var modalInstance = PermissionErrorModal.open('lg','/park/app/views/no-auth.html','');

            modalInstance.result.then(function (result) {
                console.log(result);
            },function (reason) {
                console.log(reason);
            });
        };

        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        vm.backToHome = function () {
            $uibModalInstance.dismiss('cancel');
            $state.go('app.welcome');
        };
    }
})();
