(function () {
    "use strict";
    angular.module('app.iotdevice')
        .controller('modifyIotedviceController', modifyIotedviceController);
    modifyIotedviceController.$inject = ['$scope', '$timeout', '$location', 'iotdeviceFactory', 'ManageParkingService','logger','iotdeviceService'];
    function modifyIotedviceController($scope, $timeout, $location, iotdeviceFactory, ManageParkingService,logger,iotdeviceService) {
        var vm = this;
        vm.parkingAsync = [];
        var allParkLots = [];
        var start_index = 0;
        function queryBaiDuMapParking() {
            ManageParkingService.queryBaiDuMapParking(start_index).then(function (response) {
                if(response.parking_lots.length !== 0) {
                    start_index =  response.parking_lots[response.parking_lots.length - 1].id;
                    angular.forEach(response.parking_lots, function (value) {
                        vm.parkingAsync.push(value);
                        allParkLots.push(value.id);
                    });
                    queryBaiDuMapParking();
                }
            });
        }

        vm.onSelectCallback = function (item) {
            vm.eventResult = {model: item};
            vm.seletPark.id = vm.eventResult.model.id;
        };
        vm.seletPark = {
            id: undefined
        };
        vm.queryBaiDuMapParking = queryBaiDuMapParking;
        vm.queryBaiDuMapParking();
        vm.getIotdevice =  getIotdevice;
        vm.getIotdevice();
        function getIotdevice() {
            $timeout(function () {
                vm.iotdevice = iotdeviceFactory.getIotdevice();
                vm.parkingAsync.selected = vm.iotdevice.parklot_name;
                vm.parklot = vm.iotdevice.parklot;
            }, 500);
        };
        vm.modifyIotdevice = function () {
            vm.parklot = vm.seletPark.id;
            iotdeviceService.modifyIotdevice(vm.iotdevice.id,vm.iotdevice.devtype,vm.parklot,vm.iotdevice.ipaddr,vm.iotdevice.devname,vm.iotdevice.memo,vm.iotdevice.brand,vm.iotdevice.devfirm,vm.iotdevice.firmcontact,vm.iotdevice.firmphone).then(function (response) {
                if (response.status === 0) {
                    logger.success('修改成功'+'设备：'+vm.iotdevice.devname,'操作成功');
                    $location.path('/app/iotdevice');
                }else if (response.status === 40004) {
                    logger.error('修改失败' + '"' + vm.iotdevice.devname + '"' + '失败!', '该设备已经存在！');
                }else if(response.status === 10002 ){
                    logger.error('修改失败' + '"' + vm.iotdevice.devname + '"' + '失败!', '缺少必填字段！');
                }else {
                    logger.error('修改失败');
                }
            });
        };
        // 返回上一层
        vm.backToPrevious = function () {
            $location.path('/app/iotdevice');
        };
    }
})();