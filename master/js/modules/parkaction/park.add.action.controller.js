(function () {
    angular.module('app.parking')
        .controller('AddParkActionController', AddParkActionController);
    AddParkActionController.$inject = ['$location', 'ParkActionService', 'logger','ManageParkingService'];
    'use strict';
    function AddParkActionController($location, ParkActionService, logger,ManageParkingService) {
        var vm = this;
        //停车场选择
        vm.parkAsync = [];
        var allParkLots = [];
        var start_index = 0;
        vm.queryBaiDuMapParking = queryBaiDuMapParking;
        vm.queryBaiDuMapParking();
        function queryBaiDuMapParking() {
            ManageParkingService.queryBaiDuMapParking(start_index).then(function (response) {
                if(response.parking_lots.length !== 0) {
                    start_index =  response.parking_lots[response.parking_lots.length - 1].id;
                    angular.forEach(response.parking_lots, function (value) {
                        vm.parkAsync.push(value);
                        allParkLots.push(value.id);
                    });
                    queryBaiDuMapParking();
                }
            });
        }
        vm.onSelectCallbackPark = function (item) {
            vm.eventResult = {model: item};
            vm.seletPark.id = vm.eventResult.model.id;
        };
        vm.seletPark = {
            id: undefined
        };
        //功能选择
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
        var selectParkPower = [];
        /*获取功能列表*/
        ParkActionService.qeuryAllPower().then(function (response) {
            vm.allParkAction = response.records;
            angular.forEach(response.records, function (value,index) {
                vm.allParkAction[index].name =value.introduce;
            });
            angular.copy(vm.allParkAction, vm.ParkAvailableListItems);
        });
        vm.OnAvailableChange = function () {
            vm.AvailLength = vm.SelectedAvailItems.length;
        };
        /*从左边等select移动至右边的select*/
        vm.ParkBtnRight = function () {
            //move selected.
            angular.forEach(vm.ParkSelectedAvailItems, function (value) {
                this.push(value);
            }, vm.ParkSelectedListItems);
            angular.forEach(vm.ParkSelectedAvailItems, function (value) {
                for (var i = vm.ParkAvailableListItems.length - 1; i >= 0; i--) {
                    if (vm.ParkAvailableListItems[i].name == value.name) {
                        vm.ParkAvailableListItems.splice(i, 1);
                        selectParkPower.push(value.id);
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
                selectParkPower.push(value.id);
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
                        selectParkPower.splice(i, 1);
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
            selectParkPower = [];
            vm.ParkSelectedSelectedListItems = [];
        };
        //新增操作
        vm.addParkAction = addParkAction; // 新增停车场功能
        vm.backToPrevious = backToPrevious; // 返回上一层菜单
        function addParkAction() {
            ParkActionService.addParkAction(vm.seletPark.id,selectParkPower).then(function (response) {
                if (response.status === 0) {
                    logger.success('添加成功'+'停车场功能','操作成功');
                    $location.path('/app/parkAction');
                }else if (response.status === 40004) {
                    logger.error('添加失败', '该功能已经存在！');
                }else if(response.status === 10002 ){
                    logger.error('添加失败' + '"' +'' + '"' + '失败!', '缺少必填字段！');
                }else {
                    logger.error('添加失败');
                }
            });
        }
        function backToPrevious() {
            $location.path('/app/parkAction');
        }
    }
})();