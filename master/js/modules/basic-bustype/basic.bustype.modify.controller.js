/**
 * Created by huangxiang  on 2016/11/23 0023.
 * @author:
 * Module:
 * feature:
 */
(function () {
    "use strict";
    angular.module('app.basicinfo')
        .controller('ModifyBusTypeCtr', ModifyBusTypeCtr);
    ModifyBusTypeCtr.$inject = ['$scope', '$timeout', '$location', 'busTypeFactory', 'busTypeService', 'toastr'];
    function ModifyBusTypeCtr($scope, $timeout, $location, busTypeFactory, busTypeService, toastr) {
        var vm = this;
        vm.getBusType =  getBusType;
        vm.getBusType();
        function getBusType() {
            $timeout(function () {
                vm.bustype = busTypeFactory.getBusType();
            }, 500);
        };
        // 点击确认修改区域的操作
        vm.modifyBusType = function () {
            busTypeService.modifyBusType(vm.bustype.id,vm.bustype.genrecode,vm.bustype.genrename).then(function (response) {
                if (response.status === 0) {
                    toastr.success('修改成功!!', response, {
                        closeButton: true,
                        progressBar: true,
                        positionClass: 'toast-top-center'
                    });
                    $location.path('/app/bustype');
                }
            });
        };
        // 返回上一层
        vm.backToPrevious = function () {
            $location.path('/app/bustype');
        };
    }
})();