/**
 * Created by huangxiang  on 2016/11/28 0028.
 * @author:
 * Module:
 * feature:
 */
(function () {
    angular.module('app.user-group')
        .controller('GroupManageController', GroupManageController);

    GroupManageController.$inject = ['$location', 'DTColumnDefBuilder', '$uibModal', 'RolesManageService', 'logger', 'datatablesOptions'];

    'use strict';
    /**
     * @jsdoc function
     * @param $location
     * @param DTColumnDefBuilder
     * @param $uibModal
     * @param RolesManageService
     * @param logger
     * @param datatablesOptions
     * @constructor
     */
    function GroupManageController($location, DTColumnDefBuilder, $uibModal, RolesManageService, logger, datatablesOptions) {

        var vm = this;
        vm.addNewRole = addNewRole;
        vm.modifyRole = modifyRole;
        vm.deleteRole = deleteRole;
        vm.queryAllRole = queryAllRole;

        vm.dtOptions = datatablesOptions.getDatatableOption();
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2).notSortable()
        ];

        /**
         * 跳转至添加群组页面
         */
        function addNewRole() {
            $location.path('/app/user-group/add-group');
        }

        /**
         * 跳转至修改群组页面
         */
        function modifyRole() {
            $location.path('/app/user-group/modify-group');
        }

        /**
         * 删除群组
         * @param role 群组id
         */
        function deleteRole(role) {
            RolesManageService.setCurrentRole(role);
            var modalInstance = $uibModal.open({
                backdrop: 'static',  // 点击空白处不隐藏并保持黑色模态背景，默认是true，false为不隐藏也没有模态背景
                templateUrl: 'delete_modal.html',
                controller: 'DeleteRoleController',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                logger.success('操作成功', '你已成功删除用户' + '‘' + role.groupname + '’！');
                vm.queryAllRole();
            });
        }

        /**
         * 查询所有群组
         */
        function queryAllRole() {
            RolesManageService.queryAllRole().then(function (response) {
                var rolesArray = response.groupinfo;
                angular.forEach(rolesArray,function(role){
                    role.chineseName = translateToCh(role.groupId);
                });
                vm.roles = response.groupinfo;
            });
        }
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
                case 8:
                    str = '管理收费员APP';
                    break;
            }
            return str;
        }
        vm.queryAllRole();
        // 查询群组结束
        vm.animationsEnabled = true;
    }
})();