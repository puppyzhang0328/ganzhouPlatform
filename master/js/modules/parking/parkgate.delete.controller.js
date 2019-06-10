(function () {
    angular.module('app.parking')
        .controller('DeleteParkGateController', DeleteParkGateController);

    DeleteParkGateController.$inject = ['ManageParkingService', 'logger', '$state','$uibModalInstance','currentClickParkGate'];
    'use strict';
    function DeleteParkGateController(ManageParkingService, logger, $state,$uibModalInstance,currentClickParkGate) {
        var vm = this;
        vm.confirmDeleteGate = confirmDeleteGate;
        vm.cancel = cancel;
        var currentGateId =currentClickParkGate.getParkGate().gateid;
        function confirmDeleteGate() {
            ManageParkingService.deleteGate(currentGateId).then(function (response) {
                if (response.status === 0) {
                    logger.success('你已成功删除停车场入口!!', response.data, '操作成功');
                    vm.cancel();
                    $state.reload();
                } else if (response.status === 400010 || response.status === 40011) {
                    logger.error('删除停车场入口失败！', response.data, '操作失败');
                } else if (response.status === 10003 || response.status === 500) {
                    logger.error('删除停车场入口失败！ ', response.data, '操作失败');
                }
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();