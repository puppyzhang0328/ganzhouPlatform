/**
 * groupuser.controller.js
 * @author: huangxiang
 * @create 2017-04-11 16:39
 */
(function(){

    angular.module('app.operator')
        .controller('GroupUserManageController',GroupUserManageController);

    GroupUserManageController.$inject = ['DTColumnDefBuilder', '$location', 'OperatorManageFactory', '$cookies', 'datatablesOptions', 'logger','StatusCode'];

    'use strict';
    function GroupUserManageController(DTColumnDefBuilder,$location,OperatorManageFactory,$cookies,datatablesOptions,logger,StatusCode) {

        var vm = this;

        vm.modifyGroupUser = modifyGroupUser;  // 修改集团用户
        vm.queryGroupUser = queryGroupUser; // 查询集团用户
        vm.queryGroupUserDetail = queryGroupUserDetail;

        vm.queryGroupUser(); // 初始化集团用户列表，从服务器请求数据

        vm.dtOptions = datatablesOptions.getDatatableOption(); // 获取表格配置

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

        /**
         * @jsdoc function
         * 修改groupuser 可操作停车场
         */
        function modifyGroupUser() {

        }

        /**
         * @jsdoc function
         * 查询所有group user
         */
        function queryGroupUser() {
            OperatorManageFactory.readAll().then(function (response) {
                if (response.status === StatusCode.SUCCESS) {
                    vm.users = response.operators;
                } else {
                    logger.error('获取用户失败',response.detail,'获取用户数据失败！！！');
                }
            });
        }

        /**
         * @jsdoc function,
         * 查询单个group user 详情
         */
        function queryGroupUserDetail() {

        }

    }
})();