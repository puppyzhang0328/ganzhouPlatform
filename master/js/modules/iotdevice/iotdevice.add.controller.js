(function () {
    angular.module('app.iotdevice')
        .controller('addIotdeviceController', addIotdeviceController);
    addIotdeviceController.$inject = ['$location', 'logger','iotdeviceService','ManageParkingService'];
    'use strict';
    function addIotdeviceController($location, logger,iotdeviceService,ManageParkingService) {
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
        vm.addIotdevice = addIotdevice; // 添加设备
        vm.backToPrevious = backToPrevious; // 返回上一层菜单
        vm.queryBaiDuMapParking();
        function addIotdevice() {
            vm.parklot = vm.seletPark.id;
            iotdeviceService.addIotdevice(vm.iotdevice.devtype,vm.parklot,vm.iotdevice.ipaddr,vm.iotdevice.devname,vm.iotdevice.memo,vm.iotdevice.brand,vm.iotdevice.devfirm,vm.iotdevice.firmcontact,vm.iotdevice.firmphone).then(function (response) {
                if (response.status === 0) {
                    logger.success('添加成功'+'设备：'+vm.iotdevice.devname,'操作成功');
                    $location.path('/app/iotdevice');
                }else if (response.status === 40004) {
                    logger.error('添加失败' + '"' + vm.iotdevice.devname + '"' + '失败!', '该设备已经存在！');
                }else if(response.status === 10002 ){
                    logger.error('添加失败' + '"' + vm.iotdevice.devname + '"' + '失败!', '缺少必填字段！');
                }else {
                    logger.error('添加失败');
                }
            });
        }
        function backToPrevious() {
            $location.path('/app/iotdevice');
        }
    }
})();