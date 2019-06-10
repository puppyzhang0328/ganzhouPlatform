(function () {
    angular.module('app.basicinfo')
        .controller('AddCommunityCtr', AddCommunityCtr);
    AddCommunityCtr.$inject = ['$location', 'communityService', 'logger','policeService'];
    'use strict';
    function AddCommunityCtr($location, communityService, logger,policeService) {
        var vm = this;
        vm.addCommunity = addCommunity; // 添加停车场
        vm.backToPrevious = backToPrevious; // 返回上一层菜单
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
        function addCommunity() {
            communityService.addCommunity(vm.community.code,vm.community.name,vm.seletPolice.id).then(function (response) {
                if (response.status === 0) {
                    logger.success('添加成功'+'社区：'+vm.community.name,'操作成功');
                    $location.path('/app/community');
                }else if (response.status === 40004) {
                    logger.error('添加失败' + '"' + vm.community.name + '"' + '失败!', vm.community.name, '该商圈已经存在！');
                }  else {
                    logger.error('添加失败');
                }
            });
        }
        function backToPrevious() {
            $location.path('/app/community');
        }
    }
})();