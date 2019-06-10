(function () {
    angular.module('app.prepayment')
        .controller('billOnlineDetailController',billOnlineDetailController);
    billOnlineDetailController.$inject = ['OnlinePaymentService','$document','billOnlineFactory','$location'];
    'use strict';
    function billOnlineDetailController(OnlinePaymentService, document,billOnlineFactory,$location) {
        var vm = this;
        vm.bill = billOnlineFactory.getBillOnline();
        vm.wechatpay = false;
        vm.alipay = false;
        vm.dadapay = false;
        switch (vm.bill.payment_channel){
            case 'wechatpay': vm.wechatpay = true;break;
            case 'alipay': vm.alipay = true;break;
            case 'dadapay': vm.dadapay = true;break;
        };
        vm.queryDetail = queryDetail;
        vm.queryDetail();
        function queryDetail() {
            OnlinePaymentService.queryDetail(vm.bill.id).then(function (response) {
                vm.billDetail = response.billdetail[0];
                // angular.forEach(){
                //
                // }
            });
        }
        // 返回上一层
        vm.backToPrevious = function () {
            switch (vm.bill.payment_channel){
                case 'wechatpay': $location.path('/app/bill/online-wechatpay');break;
                case 'alipay': $location.path('/app/bill/online-alipay');break;
                case 'dadapay': $location.path('/app/bill/online-dadapay');break;
            };
        };
    }
})();