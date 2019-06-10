(function () {
    "use strict";
    angular.module('app.basicinfo')
        .controller('modifyPoliceController', modifyPoliceController);
    modifyPoliceController.$inject = ['$scope', '$timeout', '$location', 'policeFactory', 'policeService', 'toastr','bureauService'];
    function modifyPoliceController($scope, $timeout, $location, policeFactory, policeService, toastr,bureauService) {
        var vm = this;
        var selectRegion = [];
        vm.bureaugAsync = [];
        var allBureaus = [];
        bureauService.queryBureau().then(function (response) {
            // vm.bureaugAsync = response.records;
            angular.forEach(response.records, function (value,index) {
                vm.bureaugAsync.push(value);
                vm.bureaugAsync[index].name = value.cityproperName;
                allBureaus.push(value.id);
            });
        });
        vm.onSelectCallback = function (item) {
            vm.eventResult = {model: item};
            vm.selectBureauId = vm.eventResult.model.id;
        };
        vm.getPolice =  getPolice;
        vm.getPolice();
        function getPolice() {
            $timeout(function () {
                vm.police = policeFactory.getPolice();
                vm.selectBureauId = vm.police.bureauid;
                vm.bureaugAsync.selected = vm.police.bureauName;
            }, 500);
        };
        // 点击确认修改区域的操作
        vm.modifyPolice = function () {
            policeService.modifyPolice(vm.police.id,vm.police.stationCode,vm.police.stationName,vm.selectBureauId).then(function (response) {
                if (response.status == 0) {
                    toastr.success('修改成功!!', response, {
                        closeButton: true,
                        progressBar: true,
                        positionClass: 'toast-top-center'
                    });
                    $location.path('/app/police');
                }
            });
        };
        // 返回上一层
        vm.backToPrevious = function () {
            $location.path('/app/police');
        };
    }
})();