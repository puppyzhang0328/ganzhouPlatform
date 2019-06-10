(function(){
    "use strict";
    angular.module('app.iotdevice')
        .controller('iotdeviceDetailController',iotdeviceDetailController);
    iotdeviceDetailController.$inject = ['iotdeviceService','$uibModalInstance','iotdeviceFactory','logger'];
    'use strict';
    function iotdeviceDetailController(iotdeviceService,$uibModalInstance,iotdeviceFactory,logger) {
        var vm = this;
        vm.queryIdentifier = queryIdentifier;
        vm.cancel = cancel;
        vm.iotdevice_id = iotdeviceFactory.getIotdevice().id;
        vm.queryIdentifier();
        function queryIdentifier() {
            iotdeviceService.queryIotdeviceDetail(vm.iotdevice_id).then(function (response) {
                if(response.status === 0){
                    vm.devidentifier = response.devidentifier;
                    vm.name = response.name;
                    vm.private_key = response.private_key;
                }else {
                    logger.warning('从服务器获取数据失败','','操作失败！');
                }
            });
        }
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();