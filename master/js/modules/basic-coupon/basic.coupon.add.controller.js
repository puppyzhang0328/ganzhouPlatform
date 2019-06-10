/**
 * park.add.controller.js
 * @author: huangxiang
 * @create 2016-12-23 16:43
 */
(function () {
    angular.module('app.basicinfo')
        .controller('AddCouponCtr', AddCouponCtr);
    AddCouponCtr.$inject = ['$location', 'couponService', 'logger','$scope'];
    'use strict';
    function AddCouponCtr($location, couponService, logger,$scope) {
        var vm = this;
        moment.locale('zh-cn', {
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'HH:mm:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd D MMMM YYYY LT'
            }
        });
        // /*时间日历设置-----------------------------------------------*/
        vm.endDateBeforeRender = endDateBeforeRender;
        vm.endDateOnSetTime = endDateOnSetTime;
        vm.startDateBeforeRender = startDateBeforeRender;
        vm.startDateOnSetTime = startDateOnSetTime;
        function startDateOnSetTime() {
            $scope.$broadcast('start-date-changed');
        }
        function endDateOnSetTime() {
            $scope.$broadcast('end-date-changed');
        }
        function startDateBeforeRender($dates) {
            if (vm.dateRangeStart) {
                var activeDate = moment(vm.dateRangeStart);
                $dates.filter(function (date) {
                    return date.localDateValue() >= activeDate.valueOf();
                }).forEach(function (date) {
                    date.selectable = false;
                });
            }
        }
        function endDateBeforeRender($view, $dates) {
            if (vm.dateRangeStart) {
                var activeDate = moment(vm.dateRangeStart).subtract(1, $view).add(1, 'minute');
                $dates.filter(function (date) {
                    return date.localDateValue() <= activeDate.valueOf();
                }).forEach(function (date) {
                    date.selectable = false;
                });
            }
        }
        vm.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
            var index = Math.floor(Math.random() * $dates.length);
            $dates[index].selectable = false;
        };
        /*时间日历设置------------------------------------------------*/
        vm.addCoupon = addCoupon; // 添加停车场
        vm.backToPrevious = backToPrevious; // 返回上一层菜单
        function addCoupon() {
            moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD')
            vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
            vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            vm.coupon_valid_begintime = moment(new Date(new Date(vm.coupon.coupon_valid_begintime))).format('YYYY-MM-DD');
            vm.coupon_valid_endtime = moment(new Date(new Date(vm.coupon.coupon_valid_endtime))).format('YYYY-MM-DD');
            couponService.addCoupon(vm.coupon.campaign,vm.coupon.campaign_displayname,vm.coupon.denomination*100,vm.coupon.num_per_user,vm.coupon.total,vm.valid_begintime,vm.valid_endtime,vm.coupon_valid_begintime,vm.coupon_valid_endtime,vm.coupon.isvalid,vm.coupon.usemode).then(function (response) {
                if (response.status === 0) {
                    logger.success('添加成功'+'优惠券：'+vm.coupon.campaign,'操作成功');
                    $location.path('/app/coupon');
                }else if (response.status === 40004) {
                    logger.error('添加失败' + '"' + vm.coupon.campaign + '"' + '失败!', response.data, '该区域已经存在！');
                }  else {
                    logger.error('添加失败');
                }
            });
        }
        function backToPrevious() {
            $location.path('/app/coupon');
        }
    }
})();