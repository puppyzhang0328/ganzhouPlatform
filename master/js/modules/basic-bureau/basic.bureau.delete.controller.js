(function(){
    angular.module('app.basicinfo')
        .controller('bureauDeleteController',bureauDeleteController);
    bureauDeleteController.$inject = ['$uibModalInstance','bureauService','bureauFactory','logger'];
    'use strict';
    function bureauDeleteController($uibModalInstance,bureauService,bureauFactory,logger) {
        var vm = this;
        vm.deleteBureau = deleteBureau;
        vm.cancel = cancel;
        function deleteBureau() {
            bureauService.deleteBureau(bureauFactory.getBureau().id).then(function (response) {
                if(response.status === 0){
                    $uibModalInstance.close('closed');
                    logger.success('成功刪除'+bureauFactory.stationName,response.data,'操作成功！');
                }else {
                    logger.error('删除失败'+bureauFactory.stationName + '失败！！',response.data,'操作失败！');
                }
            });
        }
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();