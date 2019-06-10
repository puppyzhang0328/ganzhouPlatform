(function(){
    angular.module('app.iotdevice')
        .controller('deleteIotdeviceController',deleteIotdeviceController);
    deleteIotdeviceController.$inject = ['$uibModalInstance','iotdeviceService','iotdeviceFactory','logger'];
    'use strict';
    function deleteIotdeviceController($uibModalInstance,iotdeviceService,iotdeviceFactory,logger) {
        var vm = this;
        vm.deleteIotdevice = deleteIotdevice;
        vm.cancel = cancel;
        function deleteIotdevice() {
            iotdeviceService.deleteIotdevice(iotdeviceFactory.getIotdevice().id).then(function (response) {
                if(response.status === 0){
                    $uibModalInstance.close('closed');
                    logger.success('成功刪除',response.data,'操作成功！');
                }else {
                    logger.error('删除失败失败!',response.data,'操作失败！');
                }
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();