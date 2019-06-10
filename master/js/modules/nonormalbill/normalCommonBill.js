(function () {
    'use strict';
    angular.module('app.unnormalbill')
        .controller('normalBillCommonController', normalBillCommonController);
    normalBillCommonController.$inject = ['$location', 'unNormalBillServe', 'DTColumnDefBuilder','examineService','$scope','normalBillFactory','$uibModalInstance','logger','$document','$state'];
    function normalBillCommonController($location, unNormalBillServe, DTColumnDefBuilder,examineService,$scope,normalBillFactory,$uibModalInstance,logger,$document,$state) {
        var vm = this;
        vm.confirmBill = confirmBill;
        vm.cancel = cancel;

       var urls= window.location.hash;
        if(urls.indexOf("third-bill") >= 0 ) { //判断url地址中是否包含link字符串
          vm.type="yx";
        }else if(urls.indexOf("unnormal-bill") == 6 ){
            vm.type="xxtx";
            vm.status='106';//异常已被修正
        }else {
            vm.type="app";
            vm.status='106';//异常已被修正
        }
        //确定异常弹出框
        //  if(vm.status==3){
        //         angular.element($document[0].getElementById('examineReasult'))[0].removeClass('opc')
        //  }

        vm.selectAction=function () {
            angular.element(document.querySelector("#examineReasult")).addClass('opc');
            if(vm.status !==""){
                angular.element(document.querySelector("#examineReasult")).removeClass('opc');
            }
            // console.log(vm.status);

        };

        function confirmBill() {
            unNormalBillServe.modifyNormal(vm.type,normalBillFactory.getGroupBill().id,vm.memo,vm.status).then(function (response) {
                if(response.status == 0){
                    $uibModalInstance.close('closed');
                    logger.success('成功', response.data, '操作成功！');
                    // vm.cancel();
                    // $state.reload();
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