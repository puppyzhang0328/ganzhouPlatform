/**
 * park.modal.controller.js
 * @author: huangxiang
 * @create 2016-12-23 15:52
 */
(function(){
    angular.module('app.basicinfo')
        .controller('RegionDeteleCtr',RegionDeteleCtr);
    RegionDeteleCtr.$inject = ['$uibModalInstance','regionService','regionFactory','logger'];
    'use strict';
    function RegionDeteleCtr($uibModalInstance,regionService,regionFactory,logger) {
        var vm = this;
        vm.deleteRegion = deleteRegion;
        vm.cancel = cancel;
        function deleteRegion() {
            regionService.deleteRegion(regionFactory.getRegion().id).then(function (response) {
                if(response.status === 0){
                    $uibModalInstance.close('closed');
                    logger.success('成功刪除'+regionFactory.name,response.data,'操作成功！');
                }else {
                    logger.error('删除失败'+regionFactory.name + '失败！！',response.data,'操作失败！');
                }
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();