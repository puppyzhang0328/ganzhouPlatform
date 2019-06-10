/**
 * Created by huangxiang  on 2016/11/23 0023.
 * @author:
 * Module:
 * feature:
 */
(function () {

    angular.module('app.collector')
        .controller('ModifyCollectorController', ModifyCollectorController);

    ModifyCollectorController.$inject = ['$location', 'logger', 'CollectorManageFactory','$cookies'];

    'use strict';
    function ModifyCollectorController($location, logger, CollectorManageFactory,$cookies) {

        var vm = this;

        vm.parkSearchText = ''; // 停车场搜索关键字

        vm.ParkSelectedAvailItems = [];
        vm.ParkSelectedSelectedListItems = [];
        vm.ParkSelectedListItems = [];
        vm.ParkAvailableListItems = [];

        // 已选择群组
        // var selectGroup = [];

        // 已选择停车场
        var selectPark = [];
        var currenUserStaffid = $cookies.get('currentClickUserStaffid');
        /*获取用户信息*/
        CollectorManageFactory.readOneCollector(currenUserStaffid).then(function (response) {
            if(response.status == 0){
                vm.currentCollector = response.operators[0];
            }else{
                logger.error('未能查询到用户信息！' , '查询失败', response.data);
            }
             
            getAvailableParks();       
        });

        function getAvailableParks(){
            CollectorManageFactory.queryAvailableParks(currenUserStaffid).then(function (response) {
                if(response.status == 0){
                    // var parkLots = response.data.unusable.concat(response.data.usable);
                    vm.ParkAvailableListItems = response.data.unusable; // 可选择的停车场
                    vm.ParkSelectedListItems =  response.data.usable;  // 当前所能操作停车场
                    
                    angular.forEach(vm.ParkSelectedListItems, function (data) {
                        selectPark.push(data.staffid);
                    });
                    // console.log(vm.ParkAvailableListItems)
                }else{
                    logger.error('未能查询到停车场信息！' , '查询失败', response.data);
                }
                
            });
        }


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
                    if (vm.ParkAvailableListItems[i].parking_name == value.parking_name) {
                        vm.ParkAvailableListItems.splice(i, 1);
                        selectPark.push(value.staffid);
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
                selectPark.push(value.staffid);
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
                    if (vm.ParkSelectedListItems[i].parking_name == value.parking_name) {
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
        ///////////////////////////////////////////////////////////////////////////////////////////

        vm.BaoCunCollector = function () {
            vm.currentCollector.parklots = selectPark;
            console.log(vm.currentCollector)
            CollectorManageFactory.modifyCollector( vm.currentCollector)
            .then(function (response) {
                if (response.status == 0) {
                    logger.success('操作成功', response.detail, '你已成功修改用户' + '‘' + CollectorManageFactory.getUsername() + '’！');
                    $location.path('/app/collector');
                } else {
                    alert('修改失败！！' + response.detail);
                }
            });
        };

        // vm.deleteUser = function () {
        //     CollectorManageFactory.deleteCollector(currenUserStaffid).then(function (response) {
        //         if (response.status == 0) {
        //             logger.success('操作成功', response.detail, '你已成功删除用户' + '‘' + vm.currentCollector.username + '’！');
        //             $location.path('/app/collector');
        //         } else {
        //             alert('修改失败！！' + response.detail);
        //         }
        //     });
        // };
    }
})();
