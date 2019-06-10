(function () {
    "use strict";
    angular.module('app.basicinfo')
        .controller('modifyBureauController', modifyBureauController);
    modifyBureauController.$inject = ['$scope', '$timeout', '$location', 'bureauFactory', 'bureauService', 'toastr','regionService'];
    function modifyBureauController($scope, $timeout, $location, bureauFactory, bureauService, toastr,regionService) {
        var vm = this;
        var selectRegion = [];
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
            vm.selectRegionId = vm.eventResult.model.id;
        };
        vm.getBureau =  getBureau;
        vm.getBureau();
        function getBureau() {
            $timeout(function () {
                vm.bureau = bureauFactory.getBureau();
                vm.selectRegionId = vm.bureau.regionId;
                vm.regiongAsync.selected = vm.bureau.regionName;
            }, 500);
        };
        // 点击确认修改区域的操作
        vm.modifyBureau = function () {
            bureauService.modifyBureau(vm.bureau.id,vm.bureau.cityproperCode,vm.bureau.cityproperName,vm.selectRegionId).then(function (response) {
                if (response.status == 0) {
                    toastr.success('修改成功!!', response, {
                        closeButton: true,
                        progressBar: true,
                        positionClass: 'toast-top-center'
                    });
                    $location.path('/app/bureau');
                }
            });
        };
        // 返回上一层
        vm.backToPrevious = function () {
            $location.path('/app/bureau');
        };
    }
})();