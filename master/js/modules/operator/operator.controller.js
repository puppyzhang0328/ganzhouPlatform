/**
 * Created by huangxiang  on 2016/11/22 0022.
 * @author: huangxiang
 * Module:operator.controller.js
 * feature: operatormanage settings
 */
(function () {
    angular.module('app.operator')
        .controller('OperatorManageController', OperatorManageController);

    OperatorManageController.$inject = ['$scope', 'DTColumnDefBuilder', '$location', 'OperatorManageFactory', '$uibModal', '$cookies', 'datatablesOptions', 'logger'];

    'use strict';
    function OperatorManageController($scope, DTColumnDefBuilder, $location, OperatorManageFactory, $uibModal, $cookies, datatablesOptions, logger) {

        var vm = this;

        vm.addNewUser = addNewUser; // 跳转至新增用户页面的方法
        vm.queryOperators = queryOperators; // 查询所有用户的方法
        vm.searchUsers = searchUsers; // 按群组名查找用户
        vm.queryOperatorDetail = queryOperatorDetail; // 查询用户详情/跳转至修改用户页面的方法
        vm.deleteOperator = deleteOperator;  // 打开删除用户的modal
        vm.queryParams = {
            start_index:1,
            pagedirect:'',
            staffid:''
        }

        vm.queryOperators(); // 初始化用户列表


        /*群组选择-------------------------------------------------*/
        vm.disabled = undefined;
        vm.searchEnabled = undefined;

        vm.setInputFocus = function () {
            $scope.$broadcast('UiselectDemo1');
        };
        vm.enable = function () {
            vm.disabled = false;
        };

        vm.disabled = function () {
            vm.disabled = true;
        };

        vm.enableSearch = function () {
            vm.searchEnabled = true;
        };

        vm.disableSearch = function () {
            vm.searchEnabled = false;
        };

        vm.someGroupFn = function (item) {

            if (item.name[0] >= 'A' && item.name[0] <= 'M')
                return 'From A - M';

            if (item.name[0] >= 'N' && item.name[0] <= 'Z')
                return 'From N - Z';

        };

        vm.firstLetterGroupFn = function (item) {
            return item.groupname[0];
        };

        vm.reverseOrderFilterFn = function (groups) {
            return groups.reverse();
        };
        vm.roleAsync = {selected: 'wladimir@email.com'};
        vm.roleAsync = [];

        var allRoles = [];
        OperatorManageFactory.queryRoleList().then(function (response) {
            vm.roleAsync = response.groupinfo;
            angular.forEach(response.groupinfo, function (value) {
                allRoles.push(value.groupId);
            });
        });

        vm.onSelectCallback = function (item) {
            vm.eventResult = {model: item};
        };
        /*群组选择-------------------------------------------------*/

        vm.dynamicPopover = 'Hello, World!';
        vm.dynamicPopoverTitle = 'Title';

        // 获取表格设置
        vm.dtOptions = datatablesOptions.getDatatableOption();
        // 表格列设置
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6).notSortable()
        ];

        function addNewUser() {
            $location.path('app/add-operator');
        }

        function queryOperators() {
            OperatorManageFactory.readAll().then(function (response) {
                if (response.status === 0) {
                    vm.users = response.operators;
                } else {
                    logger.error('获取用户失败',response.detail,'获取用户数据失败！！！');
                }
            });
        }

        function searchUsers() {
            OperatorManageFactory.readAllWithGroup(vm.eventResult.model.groupname).then(function (response) {
                if (response.status === 0) {
                    vm.users = response.operators;
                } else {
                    logger.error('查找失败',response.detail,'查找用户失败');
                }
            });
        }

        function queryOperatorDetail(user) {
            OperatorManageFactory.setUserId(user.staffid);
            OperatorManageFactory.setUsername(user.username);
            $cookies.put('currentClickUserStaffid',user.staffid);
            $cookies.put('currentClickUsername',user.username);
            $location.path('/app/modify-operator');
        }

        // 删除用户
        function deleteOperator(user) {
            OperatorManageFactory.setUserId(user.staffid);
            OperatorManageFactory.setUsername(user.username);
            $cookies.put('currentClickUserStaffid',user.staffid);
            $cookies.put('currentClickUsername',user.username);
            var uibModalInstance = $uibModal.open({
                backdrop: 'static',  // 点击空白处不隐藏并保持黑色模态背景，默认是true，false为不隐藏也没有模态背景
                templateUrl: '/park/app/views/partials/delete-operator-modal.html',
                controller: 'DeleteOperatorController',
                controllerAs: 'vm'
            });
            uibModalInstance.result.then(function (response) {
                logger.success('操作成功', '你已成功删除用户' + '‘' + user.username + '’！', response.data);
                vm.queryOperators();
            });
        }
    }
})();
