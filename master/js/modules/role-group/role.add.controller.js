/**
 * Created by huangxiang  on 2016/11/28 0028.
 * @author:
 * Module:
 * feature:
 */
(function () {
    angular.module('app.user-group')
        .controller('AddGroupController', AddGroupController);

    AddGroupController.$inject = ['$scope', '$location', '$timeout', 'logger', 'OperatorManageFactory', 'RolesManageService'];

    'use strict';
    function AddGroupController($scope, $location, $timeout, logger, OperatorManageFactory, RolesManageService) {

        var vm = this;

        vm.searchText = '';

        vm.SelectedAvailItems = [];
        vm.SelectedSelectedListItems = [];

        vm.SelectedListItems = [];
        vm.AvailableListItems = [];

        vm.queryAllPermissions = queryAllPermissions;
        vm.OnAvailableChange = OnAvailableChange;
        vm.btnRight = btnRight;
        vm.btnAllRight = btnAllRight;
        vm.btnLeft = btnLeft;
        vm.btnAllLeft = btnAllLeft;
        vm.addRoleGroup = addRoleGroup;

        vm.queryAllPermissions(); // 初始化获取所有权限

       /* ========================================================================================*/

        function queryAllPermissions() {
            OperatorManageFactory.queryPermissions().then(function (response) {
                vm.allPermission = response.groupinfo;
                angular.copy(vm.allPermission, vm.AvailableListItems);

            });
        }


        function OnAvailableChange() {
            vm.AvailLength = vm.SelectedAvailItems.length;
        }


        function btnRight() {
            //move selected.
            angular.forEach(vm.SelectedAvailItems, function (value) {
                this.push(value);
            }, $scope.SelectedListItems);

            //remove the ones that were moved.
            angular.forEach(vm.SelectedAvailItems, function (value) {
                for (var i = vm.AvailableListItems.length - 1; i >= 0; i--) {
                    if (vm.AvailableListItems[i].permname == value.permname) {
                        vm.AvailableListItems.splice(i, 1);
                    }
                }
            });
            vm.SelectedAvailItems = [];
        }

        function btnAllRight() {
            //move all.
            angular.forEach(vm.AvailableListItems, function (value) {
                this.push(value);
            }, vm.SelectedListItems);

            //remove the ones that were moved from the source.
            for (var i = vm.AvailableListItems.length - 1; i >= 0; i--) {
                vm.AvailableListItems.splice(i, 1);
            }

        }

        function btnLeft() {
            //move selected.
            angular.forEach(vm.SelectedSelectedListItems, function (value) {
                this.push(value);
            }, vm.AvailableListItems);

            //remove the ones that were moved from the source container.
            angular.forEach(vm.SelectedSelectedListItems, function (value) {
                for (var i = vm.SelectedListItems.length - 1; i >= 0; i--) {
                    if (vm.SelectedListItems[i].permname == value.permname) {
                        vm.SelectedListItems.splice(i, 1);
                    }
                }
            });
            vm.SelectedSelectedListItems = [];

        }

        function btnAllLeft() {

            //move over all items
            angular.forEach(vm.SelectedListItems, function (value) {
                this.push(value);
            }, vm.AvailableListItems);

            //remove the ones that were moved from the source.
            for (var i = vm.SelectedListItems.length - 1; i >= 0; i--) {
                vm.SelectedListItems.splice(i, 1);
            }
            vm.SelectedSelectedListItems = [];

        }

        // 添加群组
        function addRoleGroup() {
            RolesManageService.addRole(vm.name).then(function (response) {
                if (response.data.status == 0) {
                    logger.success('操作成功', response.detail, '你已成功添加群组' + '"' + vm.name + '!');

                    $location.path('/app/user-group');
                } else {
                    alert('添加失败' + response.data.detail);
                }
            });
        }

    }
})();