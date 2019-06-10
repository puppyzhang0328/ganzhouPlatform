(function () {
    angular.module('app.parking')
        .controller('confirmBillController', confirmBillController);
    confirmBillController.$inject = ['$location', 'examineGroupService', 'DTColumnDefBuilder','examineService','$scope','examineFactory','$uibModalInstance','logger','$document','$state'];
    'use strict';
    function confirmBillController($location, examineGroupService, DTColumnDefBuilder,examineService,$scope,examineFactory,$uibModalInstance,logger,$document,$state) {
        var vm = this;
        vm.confirmBill = confirmBill;
        vm.cancel = cancel;

        //确定异常弹出框
        //  if(vm.status==3){
        //         angular.element($document[0].getElementById('examineReasult'))[0].removeClass('opc')
        //  }

        vm.selectAction=function () {
            angular.element(document.querySelector("#examineReasult")).addClass('opc');
             if(vm.status==3){
                 angular.element(document.querySelector("#examineReasult")).removeClass('opc');
             }
            // console.log(vm.status);

        };

        function confirmBill() {
            examineGroupService.confirmBill(examineFactory.getExamine().id,vm.status,vm.memo).then(function (response) {
                if(response.status == 0){
                    logger.success('成功', response.data, '操作成功！');
                    vm.cancel();
                    $state.reload();
                    // $state.reload();
                }else {
                    logger.error('失败!', response.data, '操作失败');
                }
            })
        }
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();