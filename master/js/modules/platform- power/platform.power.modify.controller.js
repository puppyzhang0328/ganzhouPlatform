(function () {
    "use strict";
    angular.module('app.basicinfo')
        .controller('modifyPlatformPowerController', modifyPlatformPowerController);
    modifyPlatformPowerController.$inject = ['$scope', '$timeout', '$location','platformService', 'toastr','platformFactory','ManageParkingService','logger'];
    function modifyPlatformPowerController($scope, $timeout, $location, platformService, toastr,platformFactory,ManageParkingService,logger) {
        var vm = this;
        vm.parkSearchText = ''; // 停车场搜索关键字
        vm.GroupSelectedAvailItems = [];
        vm.GroupSelectedSelectedListItems = [];
        vm.GroupSelectedListItems = [];
        vm.GroupAvailableListItems = [];
        vm.ParkSelectedAvailItems = [];
        vm.ParkSelectedSelectedListItems = [];
        vm.ParkSelectedListItems = [];
        vm.ParkAvailableListItems = [];
        vm.currentParkSelect=[];
        var selectGroup = [];
        var selectPark = [];
        /*获取停车场列表*/
        ManageParkingService.queryParking().then(function (response) {
            vm.allParking = response.parking_lots;
            angular.copy(vm.allParking, vm.ParkAvailableListItems);
        });
        /*获取平台信息*/
        platformService.queryPlatformPower(platformFactory.getPlatform().id).then(function (response) {
            vm.currentOperator = response;
            angular.copy(vm.currentOperator.records, vm.ParkSelectedListItems); // 获取用户当前所能操作停车场
            angular.forEach(vm.ParkSelectedListItems, function (value) {
                for (var i = vm.ParkSelectedListItems.length - 1; i >= 0; i--) {
                    vm.ParkSelectedListItems[i].name = vm.ParkSelectedListItems[i].parkname;
                }
            });
            // 用户已有的停车场从可用停车场删除
            angular.forEach(vm.ParkSelectedListItems, function (value) {
                for (var i = vm.ParkAvailableListItems.length - 1; i >= 0; i--) {
                    if (vm.ParkAvailableListItems[i].name == value.name) {
                        vm.ParkAvailableListItems.splice(i, 1);
                    }
                }
            });
            // 将用户已有停车场的id存入一个数组
            angular.forEach(vm.currentOperator.records, function (data) {
                selectPark.push(data.parkid);
            });
        });

        vm.OnAvailableChange = function () {
            vm.AvailLength = vm.SelectedAvailItems.length;
        };
        // 停车场操作
        /*从左边等select移动至右边的select*/
        vm.ParkBtnRight = function () {
            //move selected.
            angular.forEach(vm.ParkSelectedAvailItems, function (value) {
                this.push(value);
            }, vm.ParkSelectedListItems);

            //remove the ones that were moved.
            angular.forEach(vm.ParkSelectedAvailItems, function (value) {
                for (var i = vm.ParkAvailableListItems.length - 1; i >= 0; i--) {
                    if (vm.ParkAvailableListItems[i].name == value.name) {
                        vm.ParkAvailableListItems.splice(i, 1);
                        selectPark.push(value.id);
                    }
                }
            });
            vm.ParkSelectedAvailItems = [];
        };
        /*把左边select中等所有option移动至右边等select内*/
        vm.ParkBtnAllRight = function () {
            //move all.
            angular.forEach(vm.ParkAvailableListItems, function (value) {
                this.push(value);
                selectPark.push(value.id);
            }, vm.ParkSelectedListItems);
            //remove the ones that were moved from the source.
            for (var i = vm.ParkAvailableListItems.length - 1; i >= 0; i--) {
                vm.ParkAvailableListItems.splice(i, 1);
            }
        };
        /*把右边select中选中的option移动至左边等select中*/
        vm.ParkBtnLeft = function () {
            //move selected.
            angular.forEach(vm.ParkSelectedSelectedListItems, function (value) {
                this.push(value);
            }, vm.ParkAvailableListItems);

            //remove the ones that were moved from the source container.
            angular.forEach(vm.ParkSelectedSelectedListItems, function (value) {
                for (var i = vm.ParkSelectedListItems.length - 1; i >= 0; i--) {
                    if (vm.ParkSelectedListItems[i].name == value.name) {
                        vm.ParkSelectedListItems.splice(i, 1);
                        selectPark.splice(i, 1);
                    }
                }
            });
            vm.ParkSelectedSelectedListItems = [];
        };
        /*把左边select中的全部option移动至右边等select中*/
        vm.ParkBtnAllLeft = function () {
            //move over all items
            angular.forEach(vm.ParkSelectedListItems, function (value) {
                this.push(value);
            }, vm.ParkAvailableListItems);

            //remove the ones that were moved from the source.
            for (var i = vm.ParkSelectedListItems.length - 1; i >= 0; i--) {
                vm.ParkSelectedListItems.splice(i, 1);
            }
            selectPark = [];
            vm.ParkSelectedSelectedListItems = [];
        };
        vm.BaoCunOperator = function () {
            platformService.modifyPlatformPower(platformFactory.getPlatform().id,selectPark).then(function (response) {
                if (response.status == 0) {
                    logger.success('操作成功', response.detail, '你已成功修改平台' + '‘' + platformFactory.getPlatform().id + '’！');
                    $location.path('/app/platform-power');
                } else {
                    alert('修改失败！！' + response.detail);
                }
            });
        };
        vm.backToPrevious = function () {
            $location.path('/app/platform-power');
        };
    }
})();