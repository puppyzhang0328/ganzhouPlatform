(function(){
    angular.module('app.basicinfo')
        .controller('platfromDeleteController',platfromDeleteController);
    platfromDeleteController.$inject = ['$uibModalInstance','platformService','platformFactory','logger'];
    'use strict';
    function platfromDeleteController($uibModalInstance,platformService,platformFactory,logger) {
        var vm = this;
        vm.deletePlatform = deletePlatform;
        vm.cancel = cancel;
        function deletePlatform() {
            platformService.deletePlatform(platformFactory.getPlatform().id).then(function (response) {
                if(response.status === 0){
                    $uibModalInstance.close('closed');
                    logger.success('成功刪除'+platformFactory.getPlatform().plateformname,response.data,'操作成功！');
                }else {
                    logger.error('删除失败'+platformFactory.getPlatform().plateformname + '失败！！',response.data,'操作失败！');
                }
            });
        }
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();