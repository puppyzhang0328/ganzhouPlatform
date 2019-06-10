/**
 * park.modal.controller.js
 * @author: huangxiang
 * @create 2016-12-23 15:52
 */
(function(){
    angular.module('app.basicinfo')
        .controller('busTypeDeteleCtr',busTypeDeteleCtr);
    busTypeDeteleCtr.$inject = ['$uibModalInstance','busTypeService','busTypeFactory','logger'];
    'use strict';
    function busTypeDeteleCtr($uibModalInstance,busTypeService,busTypeFactory,logger) {
        var vm = this;
        vm.deleteBusType = deleteBusType;
        vm.cancel = cancel;
        function deleteBusType() {
            busTypeService.deleteBusType(busTypeFactory.getBusType().id).then(function (response) {
                if(response.status === 0){
                    $uibModalInstance.close('closed');
                    logger.success('成功刪除'+busTypeFactory.name,response.data,'操作成功！');
                }else {
                    logger.error('删除失败'+busTypeFactory.name + '失败！！',response.data,'操作失败！');
                }
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();