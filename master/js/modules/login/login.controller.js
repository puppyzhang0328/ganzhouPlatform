/**
 * Created by huangxiang on 2016/11/21 0021.
 */
(function () {
    'use strict';
    angular.module('app.login')
        .controller('LoginController', LoginController);
    LoginController.$inject = ['$rootScope', '$location', 'AuthorizationFactory', '$cookies','LogoutFactory'];

    /**
     *
     * @param $rootScope
     * @param $location
     * @param AuthorizationFactory
     * @param $cookies
     * @param LogoutFactory
 * @constructor
     */
    function LoginController($rootScope, $location, AuthorizationFactory, $cookies,LogoutFactory) {
        var vm = this;
        vm.login = login;
        // 重置登录状态,清除csrftoken
        AuthorizationFactory.ClearCredentials();
        LogoutFactory.logout(function (response) {
            if(response.data.status === 0){
                console.log('重定向到登录界面之后清除csrftoken');
            }else {
                console.log('清除csrftoken失败');
            }
        });
        // 登录服务器
        function login() {
            AuthorizationFactory.login(vm.username, vm.password, function (response) {
                vm.dataLoading = true;
                if (response.status === 0) {
                    AuthorizationFactory.SetCredentials(vm.username, vm.password);
                    $rootScope.user.name = response.user;
                    $cookies.put('userName', response.user);
                    $cookies.put('nick_name', response.data.user_data.nick_name);
                    $cookies.put('organization_name', response.data.user_data.organization_name);
                    $cookies.put('userPermission', response.groupnames[1]);
                    $cookies.put('organization_id', response.data.user_data.organization_id);
                    $location.path('/app/console');
                } else {
                    vm.error = response.message;
                    vm.dataLoading = false;
                }
            });
        }
    }
})();