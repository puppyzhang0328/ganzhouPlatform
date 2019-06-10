/**
 * park-gate-query.controller.js
 * @author huangxiang
 * @create 2016-12-23 17:47
 * @feather 停车场入口controller,表格初始化设置及相关方法
 */
(function () {
    angular.module('app.parking')
        .controller('GateModalController', GateModalController);

    GateModalController.$inject = ['$uibModalInstance', 'ManageParkingService', '$uibModal', 'currentClickPark', 'currentClickParkGate'];

    'use strict';
    /**
     * @jsdoc controller
     * @param $uibModalInstance
     * @param ManageParkingService
     * @param $uibModal
     * @param currentClickPark
     * @param currentClickParkGate
     * @constructor
     */
    function GateModalController($uibModalInstance, ManageParkingService, $uibModal, currentClickPark, currentClickParkGate) {
        var vm = this;
        var modalInstance = undefined;
        vm.queryParkGate = queryParkGate; // 查询停车场入口
        vm.cancel = cancel; // 退出modal
        vm.addParkGate = addParkGate;  // 添加停车场入口
        vm.modifyParkGate = modifyParkGate; // 修改停车场入口
        vm.deleteParkGate = deleteParkGate; // 删除停车场入口

        vm.queryParkGate(); // 进入modal后初始化停车场入口数据

        /**
         * @jsdoc function 查询停车场入口数据
         */
        function queryParkGate() {
            ManageParkingService.queryGate(currentClickPark.getPark().id).then(function (response) {
                vm.parkgate = response.parkgate;
            });
        }

        /**
         * @jsdoc function 关闭modal
         */
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }

        /**
         * @jsdoc function 打开添加停车场入口的modal
         */
        function addParkGate() {
            modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: '/park/app/views/partials/add-park-gate-modal.html',
                controller: 'AddParkGateController',
                controllerAs: 'vm'
            });

            modalInstance.result.then(function () {
                vm.queryParkGate();
            });
        }

        /**
         * @jsdoc function 打开修改停车场入口的modal
         * @param cParkGate
         */
        function modifyParkGate(cParkGate) {
            currentClickParkGate.setParkGate(cParkGate);
            modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: '/park/app/views/partials/modify-park-gate-modal.html',
                controller: 'ModifyParkGateController',
                controllerAs: 'vm'
            });

            modalInstance.result.then(function () {
                vm.queryParkGate();
            });
        }

        /**
         * @jsdoc function 打开删除停车场的modal
         */
        function deleteParkGate(cParkGate) {
            currentClickParkGate.setParkGate(cParkGate);
            modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: '/park/app/views/partials/delete-park-gate-modal.html',
                controller: 'DeleteParkGateController',
                controllerAs: 'vm'
            });

            modalInstance.result.then(function () {
                vm.queryParkGate();
            });
        }
    }
})();