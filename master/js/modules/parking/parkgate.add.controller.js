/**
 * parkgate.add.controller.js
 * @author: huangxiang
 * @create 2016-12-23 20:13
 */
(function () {
    angular.module('app.parking')
        .controller('AddParkGateController', AddParkGateController);

    AddParkGateController.$inject = ['$uibModalInstance', 'ManageParkingService', 'logger', 'currentClickParkGate','currentClickPark'];
    'use strict';
    function AddParkGateController($uibModalInstance, ManageParkingService, logger, currentClickParkGate,currentClickPark) {
        var vm = this;
        /*获取出口是否默认的常量数组*/
        vm.ParkGateItems = currentClickParkGate.getGateIsDefault();
        /*获取出口类型数组*/
        vm.ParkGateType = currentClickParkGate.getGateTypes();
        vm.ParkGate = []; // 获取当前停车场入口的信息
        vm.ParkGate.currentGateParkId = currentClickPark.getPark().id; // 获取当前停车场的id
        vm.confirmAddGate = confirmAddGate; // 确定添加停车场入口function
        vm.cancel = cancel; // 关闭modal function
        /**
         * 确认添加停车场入口
         */
        function confirmAddGate() {
            ManageParkingService.addGate(vm.ParkGate.gatename, vm.ParkGate.isdefault.value, vm.ParkGate.gatetype.value, vm.ParkGate.longitude, vm.ParkGate.latitude, vm.ParkGate.currentGateParkId).then(function (response) {

                if (response.status === 0) {
                    logger.success('成功添加入口' + '"' + vm.ParkGate.gatename + '"' + '!', response.data, '操作成功！');
                    vm.cancel();
                    $state.reload();
                } else if (response.status === 400012) {
                    logger.error('添加入口' + '"' + vm.ParkGate.gatename + '"' + '失败!', response.data, '操作失败！');
                }else if (response.status === 400014) {
                    logger.error('添加入口' + '"' + vm.ParkGate.gatename + '"' + '失败!', response.data, '重复的入口坐标！');
                }  else if (response.status === 10003 || response.status === 500) {
                    logger.error('添加入口' + '"' + vm.ParkGate.gatename + '"' + '失败!数据库错误', response.data, '操作失败！');
                } else if(response.status ===10002){
                    logger.error('添加入口' + '"' + vm.ParkGate.gatename + '"' + '失败!请提供一个有效的停车场ID', response.data, '操作失败！');
                }
            });
        }

        /**
         * 关闭modal
         */
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();