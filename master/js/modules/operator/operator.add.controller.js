(function(){
    angular.module('app.operator')
        .controller('AddOperatorController',AddOperatorController);
    AddOperatorController.$inject = ['OperatorManageFactory','$location','logger','organService'];
    'use strict';
    function AddOperatorController(OperatorManageFactory,$location,logger,organService) {
        var vm = this;
        vm.OrganAsync = [];
        var allOrgans = [];
        organService.queryOrgan().then(function (response) {
            vm.OrganAsync = response.records;
            angular.forEach(response.records, function (value) {
                allOrgans.push(value.id);
            });
        });
        vm.onSelectCallbackOrgan = function (item) {
            vm.eventResult = {model: item};
            vm.seletOrgan.id = vm.eventResult.model.id;
        };
        vm.seletOrgan = {
            id: undefined
        };
        vm.addOperator = addOperator;
        vm.backToPrevious = backToPrevious;
        function addOperator() {
            OperatorManageFactory.addOperator(vm.operator.name,vm.operator.nick_name, vm.seletOrgan.id,vm.operator.password)
                .success(function (response) {
                    logger.success('你已成功添加用户' + '""' + vm.operator.name + '"!"', '操作成功', response.data);

                    $location.path('/app/operator');
                }).error(function (response) {
                logger.error('未能添加' + '""' + vm.operator.name + '"!"', '添加失败', response.data);
            });
        }

        function backToPrevious() {
            $location.path('app/operator');
        }
    }
})();