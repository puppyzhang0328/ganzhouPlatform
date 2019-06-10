/**
 * park.modal.controller.js
 * @author: huangxiang
 * @create 2016-12-23 15:52
 */
(function(){
    angular.module('app.basicinfo')
        .controller('organDeteleCtr',organDeteleCtr);
    organDeteleCtr.$inject = ['$uibModalInstance','organService','organFactory','logger'];
    'use strict';
    function organDeteleCtr($uibModalInstance,organService,organFactory,logger) {
        var vm = this;
        vm.deleteOrgan = deleteOrgan;
        vm.cancel = cancel;
        function deleteOrgan() {
            organService.deleteOrgan(organFactory.getOrgan().id).then(function (response) {
                if(response.status === 0){
                    $uibModalInstance.close('closed');
                    logger.success('成功刪除'+organFactory.name,response.data,'操作成功！');
                }else {
                    logger.error('删除失败'+organFactory.name + '失败！！',response.data,'操作失败！');
                }
            });
        }
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();