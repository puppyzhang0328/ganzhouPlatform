/**
 * basic.region.factory.js
 * @author: yumaotao
 * @create 2017/11/6
 */
(function () {
    angular.module('app.basicinfo')
        .factory('couponFactory', couponFactory);
    'use strict';
    function couponFactory(){
        var coupon = {
            id:'',//序号
            campaign:'',//促销活动名称
            campaign_displayname:'',//促销活动显示名称
            denomination:'',//面额，单位元
            num_per_user:'',//每用户该券的数额
            total:'',//优惠券总数
            valid_begintime:'',//活动开始时间
            valid_endtime:'',//活动结束时间
            coupon_valid_begintime:'',//券有效开始时间
            coupon_valid_endtime:'',//券有效结束时间
            isvalid:false,//该标志只控制活动，不控制券
            usemode:''//是否能多张一起使用或者和其它的优惠券一起使用
        };
        return {
            setCoupon: setCoupon,
            getCoupon: getCoupon
        };
        function setCoupon(cCoupon) {
            coupon.id = cCoupon.id;
            coupon.campaign = cCoupon.campaign;
            coupon.campaign_displayname = cCoupon.campaign_displayname;
            coupon.denomination = cCoupon.denomination;
            coupon.num_per_user = cCoupon.num_per_user;
            coupon.total = cCoupon.total;
            coupon.valid_begintime = cCoupon.valid_begintime;
            coupon.valid_endtime = cCoupon.valid_endtime;
            coupon.coupon_valid_begintime = cCoupon.coupon_valid_begintime;
            coupon.coupon_valid_endtime = cCoupon.coupon_valid_endtime;
            coupon.isvalid = cCoupon.isvalid;
            coupon.usemode = cCoupon.usemode;
        }
        function getCoupon() {
            return coupon;
        }
    }
})();