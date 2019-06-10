/**
 * role.delete.controller.js
 * @author: huangxiang
 * @create 2017-01-11 15:59
 */
(function(){
    angular.module('app.user-group')
        .controller('DeleteRoleController',DeleteRoleController);

    DeleteRoleController.$inject = ['$uibModalInstance','RolesManageService'];
    'use strict';
    function DeleteRoleController($uibModalInstance,RolesManageService) {
        var vm = this;
        vm.deleteRoleConfirm = function () {
            RolesManageService.deleteRole(RolesManageService.getCurrentRole().groupid)
                .then(function (response) {
                    $uibModalInstance.close('closed');
                });
        };
        vm.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }
})();