(function () {
    angular.module('app.parking')
        .controller('reconcileExportController', reconcileExportController);
    reconcileExportController.$inject = ['reconcileService','reconcileExportFactory','URL_SEED','logger','$uibModalInstance'];
    'use strict';
    function reconcileExportController(reconcileService,reconcileExportFactory,URL_SEED,logger,$uibModalInstance) {
        var vm = this;
        var obj = reconcileExportFactory.getorganReconcile();
        vm.exportReconcile = exportReconcile;
        vm.exportReconcile();
        function exportReconcile() {
            reconcileService.exportReconcile(obj.parklotname,obj.valid_begintime,obj.valid_endtime).then(function (response) {
                if(response.status == 0){
                    vm.detaliName = response.detailfile;
                    vm.sumName = response.summaryfile;
                    vm.detailfile = URL_SEED.IMG_URL +'media/'+response.detailfile;
                    vm.summaryfile = URL_SEED.IMG_URL +'media/'+response.summaryfile;
                }else {
                    logger.warning('导出失败！','','请重现查询导出');
                }
            });
        }
        vm.cancel = cancel;
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();