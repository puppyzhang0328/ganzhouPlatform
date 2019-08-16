(function(){
    angular.module('app.collector')
        .controller('AddCollectorController',AddCollectorController);
    AddCollectorController.$inject = ['CollectorManageFactory','$location','logger'];
    'use strict';
    function AddCollectorController(CollectorManageFactory,$location,logger) {
        var vm = this;
       
        vm.addCollector = addCollector;
        vm.backToPrevious = backToPrevious;
        vm.hasBindPhone = hasBindPhone;
        vm.hasBind = false
        vm.collector = {}
        function hasBindPhone(){
            CollectorManageFactory.hasBindPhone(vm.collector.name).then(function(response){
                if(response.status == 20003){
                    vm.hasBind = true
                }else{
                    vm.hasBind = false
                }
            })
        }

        function addCollector() {
            let params = {
                username: vm.collector.name, 
                is_exist: vm.hasBind ? '1': '0'
            }
            if(!vm.hasBind){
                params.password = vm.collector.password
            }
            CollectorManageFactory.addCollector(params).then(function (response) {
                if(response.status == 0){
                    logger.success('你已成功添加用户' + '""' + vm.collector.name + '"!"', '操作成功', response.data);
                    $location.path('/app/collector');
                }else{
                    logger.error('未能添加' + '""' + vm.collector.name + '"!"', '添加失败', response.detail);
                }
            })
        }

        function backToPrevious() {
            $location.path('app/collector');
        }
    }
})();