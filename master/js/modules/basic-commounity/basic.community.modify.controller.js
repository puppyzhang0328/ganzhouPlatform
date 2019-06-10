(function () {
    "use strict";
    angular.module('app.basicinfo')
        .controller('ModifyCommunityCtr', ModifyCommunityCtr);
    ModifyCommunityCtr.$inject = ['$scope', '$timeout', '$location', 'communityFactory', 'communityService', 'toastr','policeService'];
    function ModifyCommunityCtr($scope, $timeout, $location, communityFactory, communityService, toastr,policeService) {
        var vm = this;
        vm.getCommunity =  getCommunity;
        vm.getCommunity();
        function getCommunity() {
            $timeout(function () {
                vm.community = communityFactory.getCommunity();
            }, 500);
        };
        //派出所信息
        var selectPolice = [];//派出所信息
        vm.policeAsync = [];
        var allPolices = [];
        policeService.queryPolice().then(function (response) {
            angular.forEach(response.records, function (value,index) {
                vm.policeAsync.push(value);
                vm.policeAsync[index].name = value.stationName;
                allPolices.push(value.id);
            });
        });
        vm.onSelectCallbackPolice = function (item) {
            vm.eventResult = {model: item};
            vm.seletPolice.id = vm.eventResult.model.id;
        };
        vm.seletPolice = {
            id: undefined
        };
        // 点击确认修改区域的操作
        vm.modifyCommunity = function () {
            communityService.modifyCommunity(vm.community.id,vm.community.code,vm.community.name,vm.seletPolice.id).then(function (response) {
                if (response.status === 0) {
                    toastr.success('修改成功!!', response, {
                        closeButton: true,
                        progressBar: true,
                        positionClass: 'toast-top-center'
                    });
                    $location.path('/app/community');
                }
            });
        };
        // 返回上一层
        vm.backToPrevious = function () {
            $location.path('/app/community');
        };
    }
})();