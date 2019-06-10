/**
 * park.modal.controller.js
 * @author: huangxiang
 * @create 2016-12-23 15:52
 */
(function(){
    angular.module('app.basicinfo')
        .controller('TownDeteleCtr',TownDeteleCtr);
    TownDeteleCtr.$inject = ['$uibModalInstance','townService','townFactory','logger'];
    'use strict';
    function TownDeteleCtr($uibModalInstance,townService,townFactory,logger) {
        var vm = this;
        vm.deleteTown = deleteTown;
        vm.cancel = cancel;
        function deleteTown() {
            townService.deleteTown(townFactory.getTown().id).then(function (response) {
                if(response.status === 0){
                    $uibModalInstance.close('closed');
                    logger.success('成功刪除'+townFactory.name,response.data,'操作成功！');
                }else {
                    logger.error('删除失败'+townFactory.name + '失败！！',response.data,'操作失败！');
                }
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();