/**
 * operator.delete.controller.js
 * @author: huangxiang
 * @create 2017-01-05 10:53
 */
(function () {
    angular.module('app.operator')
        .controller('DeleteOperatorController', DeleteOperatorController);

    DeleteOperatorController.$inject = ['$uibModalInstance', 'OperatorManageFactory','$cookies'];
    'use strict';
    function DeleteOperatorController($uibModalInstance, OperatorManageFactory,$cookies) {
        var vm = this;
        vm.deleteOperatorConfirm = deleteOperatorConfirm;
        vm.cancel = cancel;

        function deleteOperatorConfirm() {
            OperatorManageFactory.deleteOperator($cookies.get('currentClickUserStaffid'))
                .then(function (response) {
                    if (response.status == 0) {
                        $uibModalInstance.close('closed');
                    } else {
                        alert('删除失败：' + response.detail);
                    }

                });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();