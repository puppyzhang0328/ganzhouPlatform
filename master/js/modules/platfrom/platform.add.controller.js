/**
 * park.add.controller.js
 * @author: huangxiang
 * @create 2016-12-23 16:43
 */
(function () {
    angular.module('app.basicinfo')
        .controller('addPlatformController', addPlatformController);
    addPlatformController.$inject = ['$location', 'platformService', 'logger'];
    'use strict';
    function addPlatformController($location, platformService, logger) {
        var vm = this;
        vm.addPlatform = addPlatform;
        vm.backToPrevious = backToPrevious;
        function addPlatform() {
            platformService.addPlatform(vm.platform.plateformname,vm.platform.username,vm.platform.loginurl,vm.platform.password,vm.platform.encrypt_passwd,vm.platform.dataurl,vm.platform.param1).then(function (response) {
                if (response.status === 0) {
                    logger.success('添加成功'+'平台：'+vm.platform.plateformname,'操作成功');
                    $location.path('/app/platform');
                }else if (response.status === 40004) {
                    logger.error('添加失败' + '"' + vm.platform.plateformname + '"' + '失败!', vm.platform.plateformname, '该平台已经存在！');
                }  else {
                    logger.error('添加失败');
                }
            });
        }
        function backToPrevious() {
            $location.path('/app/platform');
        }
    }
})();