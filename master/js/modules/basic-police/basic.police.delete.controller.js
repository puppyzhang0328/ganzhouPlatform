(function(){
    angular.module('app.basicinfo')
        .controller('policeDeleteController',policeDeleteController);
    policeDeleteController.$inject = ['$uibModalInstance','policeService','policeFactory','logger'];
    'use strict';
    function policeDeleteController($uibModalInstance,policeService,policeFactory,logger) {
        var vm = this;
        vm.deletePolice = deletePolice;
        vm.cancel = cancel;
        function deletePolice() {
            policeService.deletePolice(policeFactory.getPolice().id).then(function (response) {
                if(response.status === 0){
                    $uibModalInstance.close('closed');
                    logger.success('成功刪除'+policeFactory.stationName,response.data,'操作成功！');
                }else {
                    logger.error('删除失败'+policeFactory.stationName + '失败！！',response.data,'操作失败！');
                }
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();