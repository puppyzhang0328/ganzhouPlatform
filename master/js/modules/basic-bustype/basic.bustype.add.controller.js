/**
 * park.add.controller.js
 * @author: huangxiang
 * @create 2016-12-23 16:43
 */
(function () {
    angular.module('app.basicinfo')
        .controller('AddBusTypeCtr', AddBusTypeCtr);
    AddBusTypeCtr.$inject = ['$location', 'busTypeService', 'logger'];
    'use strict';
    function AddBusTypeCtr($location, busTypeService, logger) {
        var vm = this;
        vm.addBusType = addBusType; // 添加停车场
        vm.backToPrevious = backToPrevious; // 返回上一层菜单
        function addBusType() {
            busTypeService.addBusType(vm.bustype.genrecode,vm.bustype.genrename).then(function (response) {
                if (response.status === 0) {
                    logger.success('添加成功'+'商圈：'+vm.bustype.genrename,'操作成功');
                    $location.path('/app/bustype');
                }else if (response.status === 40004) {
                    logger.error('添加失败' + '"' + vm.bustype.genrename + '"' + '失败!', bustype.genrename, '该商圈已经存在！');
                }  else {
                    logger.error('添加失败');
                }
            });
        }
        function backToPrevious() {
            $location.path('/app/bustype');
        }
    }
})();