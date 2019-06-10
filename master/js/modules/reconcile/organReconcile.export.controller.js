(function () {
    angular.module('app.parking')
        .controller('organReconcileExportController', organReconcileExportController);
    organReconcileExportController.$inject = ['organReconcileService','organReconcileFactory','URL_SEED','logger','$uibModalInstance'];
    'use strict';
    function organReconcileExportController(organReconcileService,organReconcileFactory,URL_SEED,logger,$uibModalInstance) {
        var vm = this;
        var obj = organReconcileFactory.getorganReconcile();
        vm.exportReconcile = exportReconcile;
        vm.exportReconcile();
        function exportReconcile() {
            organReconcileService.exportReconcile(obj.organId,obj.valid_begintime,obj.valid_endtime,obj.lottype).then(function (response) {
                if(response.status == 0){
                    vm.detaliName = response.detailfile;
                    vm.sumName = response.summaryfile;
                     vm.detailfile = URL_SEED.IMG_URL +'media/'+response.detailfile;
                     vm.summaryfile = URL_SEED.IMG_URL +'media/'+response.summaryfile;
                }else {
                    logger.warning('查询失败！','','请重现查询导出');
                }
            });
        }
        vm.cancel = cancel;
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();