/**
 * collector.delete.controller.js
 * @author: huangxiang
 * @create 2017-01-05 10:53
 */
(function () {
    angular.module('app.collector')
        .controller('DeleteCollectorController', DeleteCollectorController);

    DeleteCollectorController.$inject = ['$uibModalInstance', 'CollectorManageFactory','$cookies'];
    'use strict';
    function DeleteCollectorController($uibModalInstance, CollectorManageFactory,$cookies) {
        var vm = this;
        vm.username = $cookies.get('currentClickUsername');
        vm.deleteCollectorConfirm = deleteCollectorConfirm;
        vm.cancel = cancel;

        function deleteCollectorConfirm() {
            CollectorManageFactory.deleteCollector($cookies.get('currentClickUserStaffid'))
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