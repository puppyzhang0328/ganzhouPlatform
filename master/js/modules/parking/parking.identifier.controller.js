/**
 * parking.identifier.controller.js
 * @author huangxiang
 * @create 2017-01-03 10:57
 * @feather 初始化停车密钥详情及modal控制的controller
 */
(function(){
    angular.module('app.parking')
        .controller('QueryIdentifierController',QueryIdentifierController);

    QueryIdentifierController.$inject = ['ManageParkingService','$uibModalInstance','currentClickPark'];
    'use strict';
    /**
     * @jsdoc function 查询停车场上传密钥controller
     * @param ManageParkingService 与后台交互的dataservice
     * @param $uibModalInstance
     * @param currentClickPark 当前点击的park  factory
     * @constructor
     */
    function QueryIdentifierController(ManageParkingService,$uibModalInstance,currentClickPark) {
        var vm = this;
        vm.queryIdentifier = queryIdentifier;  //查询停车场上传密钥
        vm.cancel = cancel; // 关闭modal
        vm.parklotid = currentClickPark.getPark().id; // 当前点击的停车场的id,查询停车场密钥的必需参数

        vm.queryIdentifier(); // modal打开后自动初始化当前停车场的密钥数据

        /**
         * @jsdoc function 查询停车场上传密钥的方法
         */
        function queryIdentifier() {
            ManageParkingService.queryParkingDetail(vm.parklotid).then(function (response) {
                if(response.status === 0){
                    vm.identifier = response.identifier;
                    vm.parklotName = response.name;
                    vm.private_key = response.private_key;
                }else {
                    alert('从服务器获取数据失败！');
                }
            });
        }

        /**
         * @jsdoc function 关闭modal的方法
         */
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();