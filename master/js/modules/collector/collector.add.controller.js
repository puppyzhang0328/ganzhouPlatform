(function(){
    angular.module('app.collector')
        .controller('AddCollectorController',AddCollectorController);
    AddCollectorController.$inject = ['CollectorManageFactory','$location','logger'];
    'use strict';
    function AddCollectorController(CollectorManageFactory,$location,logger) {
        var vm = this;
       
        vm.addCollector = addCollector;
        vm.backToPrevious = backToPrevious;
        function addCollector() {
            CollectorManageFactory.addCollector(vm.collector.name,vm.collector.password)
                .success(function (response) {
                    if(response.status == 0){
                        logger.success('你已成功添加用户' + '""' + vm.collector.name + '"!"', '操作成功', response.data);
                        $location.path('/app/collector');
                    }else{
                        logger.error('未能添加' + '""' + vm.collector.name + '"!"', '添加失败', response.data);
                    }
                    
                }).error(function (response) {
                logger.error('未能添加' + '""' + vm.collector.name + '"!"', '添加失败', response.data);
            });
        }

        function backToPrevious() {
            $location.path('app/collector');
        }
    }
})();