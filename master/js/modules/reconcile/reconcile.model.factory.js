(function () {
    angular.module('app.parking')
        .factory('reconcileFactory', reconcileFactory);
    'use strict';
    function reconcileFactory() {
        var reconcile = {
            id:'',
            username:'',
            out_trade_no: '',
            created_time: '',
            paidName: '',
            payment_channelName: '',
            amount: '',
            balance:'',
            order_desc:'',
            water_bill:''
        };
        return {
            setReconcile: setReconcile,
            getReconcile: getReconcile
        };
        function setReconcile(cReconcile) {
            reconcile.id = cReconcile.id;//id
            reconcile.username = cReconcile.username;
            reconcile.out_trade_no = cReconcile.out_trade_no;
            reconcile.created_time = cReconcile.created_time;
            reconcile.paidName = cReconcile.paidName;
            reconcile.payment_channelName = cReconcile.payment_channelName;
            reconcile.amount = cReconcile.amount;
            reconcile.balance = cReconcile.balance;
            reconcile.order_desc = cReconcile.order_desc;
            reconcile.water_bill = cReconcile.water_bill;
        }
        function getReconcile() {
            return reconcile;
        }
    }
})();