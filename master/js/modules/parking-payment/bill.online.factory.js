(function () {
    angular.module('app.prepayment')
        .factory('billOnlineFactory', billOnlineFactory);
    'use strict';
    function billOnlineFactory() {
        var billOnline = {
            amount: '',
            balance: '',
            created_time: '',
            id: '',
            netreceipts: '',
            order_desc: '',
            out_trade_no: '',
            paid: true,
            payment_channel: '',
            paytime: '',
            serviceid: '',
            servicetype:'',
            status:'',
            updated_time:'',
            user:'',
            username:'',
            rdpay_trade_no:''
        };
        return {
            setBillOnline:setBillOnline,
            getBillOnline:getBillOnline
        };
        function setBillOnline(cBillOnline) {
            billOnline.amount = cBillOnline.amount;
            billOnline.balance = cBillOnline.balance;
            billOnline.created_time = cBillOnline.created_time;
            billOnline.id = cBillOnline.id;
            billOnline.netreceipts = cBillOnline.netreceipts;
            billOnline.order_desc = cBillOnline.order_desc;
            billOnline.out_trade_no = cBillOnline.out_trade_no;
            billOnline.paid = cBillOnline.paid;
            billOnline.payment_channel = cBillOnline.payment_channel;
            billOnline.paytime = cBillOnline.paytime;
            billOnline.serviceid = cBillOnline.serviceid;
            billOnline.servicetype = cBillOnline.servicetype;
            billOnline.status = cBillOnline.status;
            billOnline.updated_time = cBillOnline.updated_time;
            billOnline.user = cBillOnline.user;
            billOnline.username = cBillOnline.username;
            billOnline.rdpay_trade_no = cBillOnline.rdpay_trade_no;
        }
        function getBillOnline() {
            return billOnline;
        }
    }
})();