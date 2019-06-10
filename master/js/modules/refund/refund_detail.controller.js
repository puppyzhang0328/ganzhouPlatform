/**
 * Created by huangxiang  on 2018/11/16 0016.
 * @author: huangxiang
 * Module:
 * feature:
 */
(function(){
    angular.module('app.refund')
        .controller('refundDeteleCtrs',refundDeteleCtrs);
    refundDeteleCtrs.$inject = ['$uibModalInstance','RefundFactory','OnlineRefundService','logger'];
    'use strict';
    function refundDeteleCtrs($uibModalInstance,RefundFactory,OnlineRefundService,logger) {
        var vm = this;
        vm.deleterefund = deleterefund;
        vm.cancel = cancel;
             vm.getrefund=RefundFactory.getorganReconcile();
          console.log(vm.getrefund);
            function deleterefund() {
                OnlineRefundService.refundSure(vm.getrefund.out_trade_no,vm.getrefund.refundfee,vm.getrefund.refund_id).then(function (response) {
                        if(response.status==0) {
                            $uibModalInstance.close('closed');
                            logger.success('退款成功');
                        }else {
                            $uibModalInstance.close('closed');
                            logger.success('退款失败');

                        }

                })

            };

            //取消按钮
        function cancel() {
            $uibModalInstance.dismiss('cancel');

        }

    }
})();