/**
 * Created by huangxiang  on 2018/11/15 0015.
 * @author: huangxiang
 * Module:
 * feature:
 */
(function () {
    angular.module('app.refund')
        .factory('RefundFactory', RefundFactory);
    'use strict';
    function RefundFactory() {
        var organReconcile = {
            out_trade_no:'',
            refundfee:'',
            refund_id:''
        };
        return {
            setorganReconcile: setorganReconcile,
            getorganReconcile: getorganReconcile
        };
        function setorganReconcile(cOrganReconcile) {
            organReconcile.out_trade_no= cOrganReconcile.out_trade_no;
            organReconcile. refundfee = cOrganReconcile.should_refund;
            organReconcile.refund_id = cOrganReconcile.id;

        }
        function getorganReconcile() {
            return organReconcile;
        }
    }
})();