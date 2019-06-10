(function () {
    angular.module('app.parking')
        .controller('inducementController', inducementController);
    inducementController.$inject = ['$location', 'ManageParkingService', 'logger','inducementService'];
    'use strict';
    function inducementController($location, ManageParkingService, logger,inducementService) {
        var vm = this;
        vm.card_number = '';vm.handle_type = '';vm.handle_way = '';vm.font_color = '';vm.font_color = '';vm.msg_info='';
        vm.addInducement = addInducement; // 添加停车场
        vm.addInducementOwer = addInducementOwer; // 添加停车场
        function addInducement() {
            var data = '';
            for(var i=0;i<selectParkPower.length;i++){
                if(i==0){
                    data = selectParkPower[i];
                }else {
                    data =data+','+ selectParkPower[i];
                }
            }
            var data1 = data.toString();
            inducementService.addInducement(data1,vm.card_number,vm.handle_type,vm.handle_way,vm.font_color,vm.in_type,vm.msg_info).then(function (response) {
                if (response.data.status === 'success') {
                   vm.addInducementOwer(data1);
                }else if (response.status === 40004) {
                    logger.error('操作失败!', '请核实！');
                }else if(response.data.status === 10002 ){
                    logger.error('操作失败!', '缺少必填字段！');
                }else {
                    logger.error('操作失败');
                }
            });
        }
        function addInducementOwer(data) {
            inducementService.addInducementOwer(data,vm.card_number,vm.handle_type,vm.handle_way,vm.font_color,vm.in_type,vm.msg_info).then(function (response) {
                if (response.data.status === 0) {
                    logger.success('操作成功'+'停车场：','操作成功');
                }else if (response.status === 40004) {
                    logger.error('操作失败!', '请核实！');
                }else if(response.data.status === 10002 ){
                    logger.error('操作失败!', '缺少必填字段！');
                }else {
                    logger.error('操作失败');
                }
            });
        }
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
        vm.queryParking = queryParking;
        vm.queryParking();
        function queryParking() {
            inducementService.queryParking().then(function (response) {
                if(response.parking_lots.length !== 0) {
                    vm.allParkAction = response.parking_lots;
                    angular.copy(vm.allParkAction, vm.ParkAvailableListItems);
                }
            });
        }

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
    }
})();