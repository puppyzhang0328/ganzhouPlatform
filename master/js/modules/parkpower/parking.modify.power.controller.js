(function () {
    "use strict";
    angular.module('app.parking')
        .controller('ModifyParkPowerController', ModifyParkPowerController);

    ModifyParkPowerController.$inject = ['$scope', '$timeout', '$location', 'parkPowerFactory', 'logger','ParkPowerService'];

    function ModifyParkPowerController($scope, $timeout, $location, parkPowerFactory, logger,ParkPowerService) {
        var vm = this;
        vm.getParkPower =  getParkPower;
        vm.getParkPower();
        function getParkPower() {
            $timeout(function () {
                vm.parkPower = parkPowerFactory.getParkPower();
                console.log(vm.parkPower);
            }, 500);
        };
        // 点击确认修改功能的操作
        vm.modifyParkPower = function () {
            console.log('------');
            ParkPowerService.modifyParkPower(vm.platform.id,vm.platform.plateformname,vm.platform.loginurl,vm.platform.username,vm.platform.password,vm.platform.dataurl,vm.platform.param1).then(function (response) {
                if (response.status === 0) {
                    logger.success('修改成功'+vm.parkPower.funcname+'功能：','操作成功');
                    $location.path('/app/parkPower');
                }else if(response.status === 10002 ){
                    logger.error('添加失败' + '"' + vm.parkPower.funcname + '"' + '失败!', '缺少必填字段！');
                }else {
                    logger.error('添加失败');
                }
            });
        };
        // 返回上一层
        vm.backToPrevious = function () {
            $location.path('/app/parkPower');
        };
    }
})();