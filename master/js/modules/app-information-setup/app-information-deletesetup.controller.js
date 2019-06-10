(function(){
    angular.module('app.inforsetup')
        .controller('inforsetupDeleteController',inforsetupDeleteController);
    inforsetupDeleteController.$inject = ['$uibModalInstance','inforService','inforsetupFactory','logger'];
    'use strict';
    function inforsetupDeleteController($uibModalInstance,inforService,inforsetupFactory,logger) {
        var vm = this;
        vm.deletePlatform = deletePlatform;
        vm.cancel = cancel;
        function deletePlatform() {
            inforService.deleteinfo(inforsetupFactory.getPlatform().menu_id).then(function (response) {
                if(response.status === 0){
                    $uibModalInstance.close('closed');
                    logger.success('成功刪除'+inforsetupFactory.getPlatform().menu_name,response.data,'操作成功！');
                }else {
                    logger.error('删除失败'+inforsetupFactory.getPlatform().menu_name + '失败！！',response.data,'操作失败！');
                }
            });
        }
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();