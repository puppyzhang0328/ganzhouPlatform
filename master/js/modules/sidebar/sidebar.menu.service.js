/**
 * Created by huangxiang  on 2016/11/23 0023.
 * @author: huangxiang
 * Module:
 * feature:
 */
(function () {
    'use strict';
    angular.module('app.sidebar')
        .service('loadSidebarMenu',loadSidebarMenu);

    loadSidebarMenu.$inject = ['$cookies'];

    // 根据不同的用户加载不同的菜单

    function loadSidebarMenu($cookies) {
        return {
            getMenuJson: function () {
                console.log('getMenuJson执行了');
                var userPermission = $cookies.get('userPermission');
                console.log(userPermission);
                var userName=$cookies.get('userName');
                console.log(userName);
                var menuJson = null;
                if(userPermission === 'operator_parkinglot'){
                    menuJson = 'server/operator-parkinglot-sidebar.json';
                }
                else if (userPermission === 'operator_group_user') { // 用户管理员
                    menuJson = 'server/operator-group-user-sidebar.json';
                }
                else if (userPermission === 'operator_bill') { // 账单管理员
                    menuJson = 'server/operator-bill-sidebar.json';
                }
                else if (userPermission === 'operator_end_user') { // 客服服务（APP用户）
                    menuJson = 'server/operator-end-user-sidebar.json';
                }
                else if (userPermission === 'operator_app') { // APP管理员
                    menuJson = 'server/operator-app-sidebar.json';
                }
                // else if(userPermission === 'group_user'&& userName==='liuyang_bill'){
                //     menuJson = 'server/liuyang_bill.json';
                // }
                else if (userPermission === 'group_user') { // 集团用户
                    menuJson = 'server/group-user-sidebar.json';
                }
                else if (userPermission === 'sysadmin' || userPermission === 'administrator') {
                    menuJson = 'server/sysadmin-sidebar.json';
                }
                else if(userPermission == 'manage_charge_app'){
                    menuJson = 'server/manage_app_collector.json';
                }
                return menuJson;
            }
        };
    }
})();