/**
 * parkgate.modify.controller.js
 * @author: huangxiang
 * @create 2016-12-23 20:14
 */
(function () {
    angular.module('app.parking')
        .controller('ModifyParkGateController', ModifyParkGateController);

    ModifyParkGateController.$inject = ['ManageParkingService', 'logger', '$state', '$uibModalInstance', 'currentClickParkGate'];
    'use strict';
    /**
     * 修改停车场入口
     * @param ManageParkingService 与服务器交互的service
     * @param logger $toastr 和 $log 的合并25447\
     * @param $state
     * @param $uibModalInstance
     * @param currentClickParkGate
     * @constructor
     */
    function ModifyParkGateController(ManageParkingService, logger, $state, $uibModalInstance, currentClickParkGate) {
        var vm = this;
        vm.confirmModifyGate = confirmModifyGate; // 确认修改停车场
        vm.cancel = cancel; // 退出modal
        vm.currentParkGate = currentClickParkGate.getParkGate(); // 获取当前停车场入口的信息

        /*获取出口是否默认的常量数组*/
        vm.ParkGateItems = currentClickParkGate.getGateIsDefault();

        /*获取出口类型数组*/
        vm.ParkGateType = currentClickParkGate.getGateTypes();

        function confirmModifyGate() {
            ManageParkingService.modifyGate(vm.currentParkGate.gateid, vm.currentParkGate.gatename, vm.currentParkGate.isdefault.value, vm.currentParkGate.latitude, vm.currentParkGate.longitude, vm.currentParkGate.currentGateParkId).then(function (response) {
                if (response.status === 0) {
                    logger.success('你已成功修改停车场入口' + '"' + vm.currentParkGate.gatename + '"!', response.data, '操作成功');
                    vm.cancel();
                    $state.reload();
                } else if (response.status === 400012) {
                    logger.error('修改入口' + '"' + vm.currentParkGate.gatename + '失败"!', response.data, '操作失败');
                } else if (response.status === 10003 || response.status === 500) {
                    logger.error('修改停车场入口' + '"' + vm.currentParkGate.gatename + '失败"!', response.data, '操作失败');
                } else if (response.status === 10002) {
                    logger.error('修改停车场入口' + '"' + vm.currentParkGate.gatename + '失败"!', response.detail, '操作失败');
                }
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();