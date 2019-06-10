/**
 * Created by huangxiang  on 2016/11/23 0023.
 * @author:
 * Module:
 * feature:
 */
(function () {
    'use strict';
    angular.module('app.operator')
        .controller('ModifyOperatorController', ModifyOperatorController);

    ModifyOperatorController.$inject = ['$location', 'logger', 'OperatorManageFactory', 'ManageParkingService','$cookies'];


    function ModifyOperatorController($location, logger, OperatorManageFactory, ManageParkingService,$cookies) {

        var vm = this;

        vm.groupSearchText = ''; // 群组搜索关键字
        vm.parkSearchText = ''; // 停车场搜索关键字

        vm.GroupSelectedAvailItems = [];       //用户组可用组的选中的值
        vm.GroupSelectedSelectedListItems = [];
        vm.GroupSelectedListItems = [];
        vm.GroupAvailableListItems = [];  //可用组

        vm.ParkSelectedAvailItems = [];
        vm.ParkSelectedSelectedListItems = [];
        vm.ParkSelectedListItems = [];
        vm.ParkAvailableListItems = [];

        // 已选择群组
        var selectGroup = [];

        // 已选择停车场
        var selectPark = [];

        /*获取用户信息*/
        OperatorManageFactory.readOneOperator($cookies.get('currentClickUserStaffid')).then(function (response) {
            vm.currentOperator = response;
            // console.log( vm.currentOperator)
            angular.copy(vm.currentOperator.groups, vm.GroupSelectedListItems); // 获取用户已有组，将返回的groups的数组，复制给新的空的数组
            angular.copy(vm.currentOperator.authparklot, vm.ParkSelectedListItems); // 获取用户当前所能操作停车场
             //angular.copy  是深度拷贝
            // 用户已有的群组从可用群组中删除
            angular.forEach(vm.GroupSelectedListItems, function (value) {
                // console.log(value);
                value.chineseName = translateToCh(value.groupId);
                for (var i = vm.GroupAvailableListItems.length - 1; i >= 0; i--) {
                    if (vm.GroupAvailableListItems[i].groupname == value.groupname) {
                        vm.GroupAvailableListItems.splice(i, 1);
                    }
                }
            });
            console.log(vm.GroupSelectedListItems);

            // 用户已有的停车场从可用停车场删除
            angular.forEach(vm.ParkSelectedListItems, function (value) {
                for (var i = vm.ParkAvailableListItems.length - 1; i >= 0; i--) {
                    if (vm.ParkAvailableListItems[i].name == value.name) {
                        vm.ParkAvailableListItems.splice(i, 1);
                    }
                }
            });

            // 将用户已有群组的id存入一个数组
            angular.forEach(vm.currentOperator.groups, function (data) {
                //noinspection JSUnresolvedVariable
                selectGroup.push(data.groupId);
            });

            // 将用户已有停车场的id存入一个数组
            angular.forEach(vm.currentOperator.authparklot, function (data) {
                selectPark.push(data.id);
            });

        });







        /*获取群组列表*/
        OperatorManageFactory.queryRoleList().then(function (response) {
            vm.allRole = response.groupinfo;
            angular.forEach(vm.allRole,function(role){
                role.chineseName = translateToCh(role.groupId);
            });
            angular.copy(vm.allRole, vm.GroupAvailableListItems);//深度拷贝，获取用户组，可用组的数据
            // console.log(vm.GroupAvailableListItems)
        });

        function translateToCh(id){
            var str = ''
            switch (id){
                case 1:
                    str = '系统默认';
                    break;
                case 2:
                    str = '集团用户';
                    break;
                case 3:
                    str = 'APP管理员';
                    break;
                case 4:
                    str = '账单管理员';
                    break;
                case 5:
                    str = '客服服务（APP用户）';
                    break;
                case 6:
                    str = '用户管理员';
                    break;
                case 7:
                    str = '停车场管理员';
                    break;
                case 8:
                    str = '管理app操作权限';
                    break;
            }
            return str;
        }

        /*获取停车场列表*/
        ManageParkingService.queryParking().then(function (response) {
            vm.allParking = response.parking_lots;
            angular.copy(vm.allParking, vm.ParkAvailableListItems);
        });


        vm.OnAvailableChange = function () {
            vm.AvailLength = vm.SelectedAvailItems.length;
        };

        /////////////////////////////////////////////////////////////////////////////////////////
        // 群组操作
        /*从左边等select移动至右边的select*/
        vm.GroupBtnRight = function () {
            //move selected.
            console.log(vm.GroupSelectedAvailItems);
            angular.forEach(vm.GroupSelectedAvailItems, function (value) {
                console.log(value);
                this.push(value);
                console.log(this);
                selectGroup.push(value.groupId);
            }, vm.GroupSelectedListItems);

            //remove the ones that were moved.
            angular.forEach(vm.GroupSelectedAvailItems, function (value) {
                for (var i = vm.GroupAvailableListItems.length - 1; i >= 0; i--) {
                    if (vm.GroupAvailableListItems[i].groupname == value.groupname) {
                        vm.GroupAvailableListItems.splice(i, 1);
                    }
                }
            });
            vm.GroupSelectedAvailItems = [];
        };


        /*把左边select中等所有option移动至右边等select内*/
        vm.GroupBtnAllRight = function () {
            //move all.
            angular.forEach(vm.GroupAvailableListItems, function (value) {
                this.push(value);
                selectGroup.push(value.groupId);
            }, vm.GroupSelectedListItems);

            //remove the ones that were moved from the source.
            for (var i = vm.GroupAvailableListItems.length - 1; i >= 0; i--) {
                vm.GroupAvailableListItems.splice(i, 1);
            }

        };

        /*把右边select中选中的option移动至左边等select中*/
        vm.GroupBtnLeft = function () {
            //move selected.
            angular.forEach(vm.GroupSelectedSelectedListItems, function (value) {
                this.push(value);
            }, vm.GroupAvailableListItems);

            //remove the ones that were moved from the source container.
            angular.forEach(vm.GroupSelectedSelectedListItems, function (value) {
                for (var i = vm.GroupSelectedListItems.length - 1; i >= 0; i--) {
                    if (vm.GroupSelectedListItems[i].groupname == value.groupname) {
                        vm.GroupSelectedListItems.splice(i, 1);
                        selectGroup.splice(i, 1);
                    }
                }
            });
            vm.GroupSelectedSelectedListItems = [];
        };

        /*把左边select中的全部option移动至右边等select中*/
        vm.GroupBtnAllLeft = function () {

            //move over all items
            angular.forEach(vm.GroupSelectedListItems, function (value) {
                this.push(value);
            }, vm.GroupAvailableListItems);

            //remove the ones that were moved from the source.
            for (var i = vm.GroupSelectedListItems.length - 1; i >= 0; i--) {
                vm.GroupSelectedListItems.splice(i, 1);
            }
            selectGroup = [];
            vm.GroupSelectedSelectedListItems = [];
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
        ///////////////////////////////////////////////////////////////////////////////////////////

        vm.BaoCunOperator = function () {
            // console.log(vm.currentOperator.email)
            OperatorManageFactory.modifyOperator($cookies.get('currentClickUserStaffid'), selectGroup, null, selectPark, vm.currentOperator.last_name, vm.currentOperator.first_name, vm.currentOperator.email)
            .then(function (response) {
                if (response.status == 0) {
                    logger.success('操作成功', response.detail, '你已成功修改用户' + '‘' + OperatorManageFactory.getUsername() + '’！');
                    $location.path('/app/operator');
                } else {
                    alert('修改失败！！' + response.detail);
                }
            });
        };

        vm.deleteUser = function () {
            OperatorManageFactory.deleteOperator($cookies.get('currentClickUserStaffid')).then(function (response) {
                if (response.status == 0) {
                    logger.success('操作成功', response.detail, '你已成功删除用户' + '‘' + vm.currentOperator.username + '’！');
                    $location.path('/app/operator');
                } else {
                    alert('修改失败！！' + response.detail);
                }
            });
        };
    }
})();
