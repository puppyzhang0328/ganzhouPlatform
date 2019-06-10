/**
 * Created by huangxiang  on 2016/11/23 0023.
 * @author:
 * Module:
 * feature:
 */
(function () {
    "use strict";
    angular.module('app.basicinfo')
        .controller('ModifyCouponCtr', ModifyCouponCtr);
    ModifyCouponCtr.$inject = ['$scope', '$timeout', '$location', 'couponFactory', 'couponService', 'toastr'];
    function ModifyCouponCtr($scope, $timeout, $location, couponFactory, couponService, toastr) {
        var vm = this;
        vm.getCoupon =  getCoupon;
        vm.getCoupon();
        function getCoupon() {
            $timeout(function () {
                vm.coupon = couponFactory.getCoupon();
            }, 500);
        };
        // 点击确认修改区域的操作
        vm.modifyRegion = function () {
            couponService.modifyCoupon(vm.coupon.id,vm.coupon.isvalid).then(function (response) {
                if (response.status ==  0) {
                    toastr.success('修改成功!!', response, {
                        closeButton: true,
                        progressBar: true,
                        positionClass: 'toast-top-center'
                    });
                    $location.path('/app/coupon');
                }
            });
        };
        // 返回上一层
        vm.backToPrevious = function () {
            $location.path('/app/coupon');
        };
    }
})();