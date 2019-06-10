(function () {
    angular.module('app.parking')
        .controller('AddParkPowerController', AddParkPowerController);
    AddParkPowerController.$inject = ['$location', 'ParkPowerService', 'logger'];
    'use strict';
    function AddParkPowerController($location, ParkPowerService, logger) {
        var vm = this;
        vm.addParkPower = addParkPower; // 新增功能功能
        vm.backToPrevious = backToPrevious; // 返回上一层菜单
        function addParkPower() {
            ParkPowerService.addParkPower(vm.parkPower.funcname,vm.parkPower.introduce).then(function (response) {
                if (response.status === 0) {
                    logger.success('添加成功'+'功能：'+vm.parkPower.funcname,'操作成功');
                    $location.path('/app/parkPower');
                }else if (response.status === 40004) {
                    logger.error('添加失败' + '"' + vm.parkPower.funcname + '"' + '失败!', '该功能已经存在！');
                }else if(response.status === 10002 ){
                    logger.error('添加失败' + '"' + vm.parkPower.funcname + '"' + '失败!', '缺少必填字段！');
                }else {
                    logger.error('添加失败');
                }
            });
        }
        function backToPrevious() {
            $location.path('/app/parkPower');
        }
    }
})();