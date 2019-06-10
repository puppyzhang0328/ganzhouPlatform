(function () {
    angular.module('app.mobile-user')
        .controller('UserPayController', UserPayController);
    UserPayController.$inject = ['userPay', 'logger', '$document', 'datatablesOptions','DTColumnDefBuilder','userPayFactory','$location'];
    'use strict';
    function UserPayController(userPay, logger, $document, datatablesOptions,DTColumnDefBuilder,userPayFactory,$location) {
        var vm = this;
        vm.usrPayDate = userPayFactory.getUserPay();
        vm.dtOptions = datatablesOptions.getDatatableOption();
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6),
            DTColumnDefBuilder.newColumnDef(7),
            DTColumnDefBuilder.newColumnDef(8),
            DTColumnDefBuilder.newColumnDef(9),
            DTColumnDefBuilder.newColumnDef(10),
            DTColumnDefBuilder.newColumnDef(11),
            DTColumnDefBuilder.newColumnDef(12)
        ];
        vm.loadFistPage = loadFistPage;
        if(vm.usrPayDate){
            vm.loadFistPage();
        }
        function loadFistPage() {
            userPay.queryHome(vm.usrPayDate.phone_number).then(function (response) {
                if (response.status === 0) {
                    vm.mobileUserDate = response.records;
                    angular.forEach(response.records, function (value,index) {
                        switch (value.payment_channel) {
                            case 'wechatpay':
                                vm.mobileUserDate[index].payment_channelName = '微信';
                                break;
                            case 'alipay':
                                vm.mobileUserDate[index].payment_channelName = '支付宝';
                                break;
                            case 'unionpay':
                                vm.mobileUserDate[index].payment_channelName = '银联';
                                break;
                            case 'dadapay':
                                vm.mobileUserDate[index].payment_channelName = '账上余额';
                                break;
                        }
                    });
                }
            });
        }
        vm.clearAndRefresh = clearAndRefresh;
        function clearAndRefresh() {
            vm.phone_number = '';
            vm.vehicles = '';
            vm.loadFistPage();
        }
        vm.backToPrevious = backToPrevious;
        function backToPrevious() {
            $location.path('/app/mobile-user');
        };
    }
})();