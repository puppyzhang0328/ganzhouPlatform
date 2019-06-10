/**
 * park.modal.controller.js
 * @author: huangxiang
 * @create 2016-12-23 15:52
 */
(function(){
    angular.module('app.basicinfo')
        .controller('CouponDeteleCtr',CouponDeteleCtr);
    CouponDeteleCtr.$inject = ['$uibModalInstance','couponService','couponFactory','logger'];
    'use strict';
    function CouponDeteleCtr($uibModalInstance,couponService,couponFactory,logger) {
        var vm = this;
        vm.deleteCoupon = deleteCoupon;
        vm.cancel = cancel;
        function deleteCoupon() {
            couponService.deleteRegion(couponFactory.getCoupon().id).then(function (response) {
                if(response.status === 0){
                    $uibModalInstance.close('closed');
                    logger.success('成功刪除'+couponFactory.name,response.data,'操作成功！');
                }else {
                    logger.error('删除失败'+couponFactory.name + '失败！！',response.data,'操作失败！');
                }
            });
        }
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();