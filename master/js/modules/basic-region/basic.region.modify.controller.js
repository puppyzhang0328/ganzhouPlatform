/**
 * Created by huangxiang  on 2016/11/23 0023.
 * @author:
 * Module:
 * feature:
 */
(function () {
    "use strict";
    angular.module('app.basicinfo')
        .controller('ModifyRegionCtr', ModifyRegionCtr);
    ModifyRegionCtr.$inject = ['$scope', '$timeout', '$location', 'regionFactory', 'regionService', 'toastr'];
    function ModifyRegionCtr($scope, $timeout, $location, regionFactory, regionService, toastr) {
        var vm = this;
        var selectPark = [];//所选择的停车场
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
            vm.seletRegion.id = vm.eventResult.model.id;
        };
        vm.seletRegion = {
            id: undefined
        };
        vm.getRegion =  getRegion;
        vm.getRegion();
        function getRegion() {
            $timeout(function () {
                vm.region = regionFactory.getRegion();
                vm.regiongAsync.selected = vm.region.pname;
                vm.seletRegion.id = vm.region.pid;
            }, 500);
        };
        // 点击确认修改区域的操作
        vm.modifyRegion = function () {
            vm.region.pcode = vm.seletRegion.id;
            regionService.modifyRegion(vm.region.id,vm.region.code,vm.region.pcode,vm.region.name,vm.region.suffix,vm.region.fullname,vm.region.pinyin,vm.region.py,vm.region.level).then(function (response) {
                if (response.status == 0) {
                    toastr.success('修改成功!!', response, {
                        closeButton: true,
                        progressBar: true,
                        positionClass: 'toast-top-center'
                    });
                    $location.path('/app/region');
                }
            });
        };
        // 返回上一层
        vm.backToPrevious = function () {
            $location.path('/app/region');
        };
    }
})();