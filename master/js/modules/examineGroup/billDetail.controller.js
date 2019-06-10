(function () {
    'use strict';
    angular.module('app.parking')
        .controller('billDetailController', billDetailController);
    billDetailController.$inject = ['$uibModalInstance', 'examineGroupService', 'URL_SEED', 'DTColumnDefBuilder','examineService','$scope','examineFactory','$uibModal','logger'];
    function billDetailController($uibModalInstance, examineGroupService, URL_SEED, DTColumnDefBuilder,examineService,$scope,examineFactory,$uibModal,logger) {
        var vm = this;
        vm.billInfo = examineFactory.getExamine();
        vm.billDetail = billDetail;
        vm.downloadPDF = downloadPDF;
        vm.cancel = cancel;
        vm.billDetail();
        function billDetail() {
            examineGroupService.downloadPDF(vm.billInfo.name,vm.billInfo.organization_name,vm.billInfo.stroke_count,vm.billInfo.aggregate_amount,vm.billInfo.aggregate_netreceipts,vm.billInfo.startime,vm.billInfo.endtime,vm.billInfo.coupon_fee).then(function (response) {
                if(response.status == 0){
                    vm.sumName = response.address;
                    vm.url = URL_SEED.IMG_URL+response.address;
                }else {
                    logger.error('审核失败!', response, '操作失败');
                }
            })
        }
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
        function downloadPDF() {
            window.open(vm.url,'_blank');
        }
    }
})();