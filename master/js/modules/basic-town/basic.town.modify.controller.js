/**
 * Created by huangxiang  on 2016/11/23 0023.
 * @author:
 * Module:
 * feature:
 */
(function () {
    "use strict";
    angular.module('app.basicinfo')
        .controller('ModifyTownCtr', ModifyTownCtr);
    ModifyTownCtr.$inject = ['$scope', '$timeout', '$location', 'townFactory', 'townService', 'toastr','regionService'];
    function ModifyTownCtr($scope, $timeout, $location, townFactory, townService, toastr,regionService) {
        var vm = this;
        var selectPark = [];//所选择的商圈
        /*停车场选择-------------------------------------------------*/
        vm.regiongAsync = [];
        var allRegions = [];
        regionService.queryRegion().then(function (response) {
            vm.regiongAsync = response.records;
            angular.forEach(response.records, function (value) {
                allRegions.push(value.id);
            });
        });
        vm.onSelectCallback = function (item) {
            vm.eventResult = {model: item};
            vm.seletParkId = vm.eventResult.model.id;
        };
        vm.getTown =  getTown;
        vm.getTown();
        function getTown() {
            $timeout(function () {
                vm.town = townFactory.getTown();
                vm.regiongAsync.selected = vm.town.rname;
                vm.seletParkId=  vm.town.rid;
            }, 500);
        };
        // 点击确认修改区域的操作
        vm.modifyTown = function () {
            townService.modifyTown(vm.town.id,vm.town.code,vm.town.name,vm.seletParkId).then(function (response) {
                if (response.status == 0) {
                    toastr.success('修改成功!!', response, {
                        closeButton: true,
                        progressBar: true,
                        positionClass: 'toast-top-center'
                    });
                    $location.path('/app/town');
                }
            });
        };
        // 返回上一层
        vm.backToPrevious = function () {
            $location.path('/app/town');
        };
    }
})();