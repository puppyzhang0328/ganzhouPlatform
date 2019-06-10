(function () {
    angular.module('app.parking')
        .controller('parkBillController', parkBillController);
    parkBillController.$inject = ['$location', 'ManageParkingService', 'datatablesOptions', 'DTColumnDefBuilder','reconcileService','$scope','organReconcileFactory','$uibModal','URL_SEED','logger','reconcileExportFactory'];
    'use strict';
    function parkBillController($location, ManageParkingService, datatablesOptions, DTColumnDefBuilder,reconcileService,$scope,organReconcileFactory,$uibModal,URL_SEED,logger,reconcileExportFactory) {
        var vm = this;
        vm.queryReconcile = queryReconcile;
        vm.coupon ={
            valid_begintime:undefined,
            valid_endtime:undefined
        };
        var obj = organReconcileFactory.getorganReconcile();
        vm.seletParkId = obj.id;vm.coupon.valid_begintime = obj.valid_begintime;vm.coupon.valid_endtime = obj.valid_endtime;vm.parkingAsync.selected = obj.parklotname;
        if(obj.id && obj.valid_begintime && obj.valid_endtime && obj.parklotname){
            vm.queryReconcile();
        }
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
            DTColumnDefBuilder.newColumnDef(10)
        ];
        function queryReconcile() {
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
                var i= 0;
                reconcileService.readRecords(vm.seletParkId,vm.valid_begintime,vm.valid_endtime,vm.plate_number).then(function (response) {
                    angular.forEach(response.data.water_bill, function (value,index) {
                        if(value.paid){
                            response.data.water_bill[index].paidName = '已支付';
                        }else {
                            response.data.water_bill[index].paidName = '未支付';
                        }
                        switch (value.payment_channel){
                            case 'wechatpay': response.data.water_bill[index].payment_channelName ='微信';break;
                            case 'alipay': response.data.water_bill[index].payment_channelName ='支付宝';break;
                            case 'unionpay': response.data.water_bill[index].payment_channelName ='银联';break;
                            case 'dadapay': response.data.water_bill[index].payment_channelName ='账上余额';break;
                        }
                        response.data.water_bill[index].numberId = index+1;
                        i++;
                    });
                    vm.reconcileDate = response.data.water_bill;
                    var countDate= {};
                    var countDateId = i+1;
                    var countDateName = '合计';
                    countDate.id =countDateId;
                    countDate.username = countDateName;
                    countDate.rdpay_trade_no = '--';
                    countDate.out_trade_no = '--';
                    countDate.created_time = '--';
                    countDate.paidName = '--';
                    countDate.payment_channelName = '--';
                    countDate.balance = '';
                    countDate.amount = response.data.general_surplus-response.data.coupon_fee;
                    countDate.coupon_fee = response.data.coupon_fee;
                    countDate.order_desc = '--';
                    vm.reconcileDate[i] = countDate;
                    vm.allData =  response.data;
                });
            }
        }
        vm.exportReconcile = exportReconcile;
        vm.clearAndRefresh = clearAndRefresh;
        function clearAndRefresh() {
            vm.seletParkId = '';vm.valid_begintime = '';vm.valid_endtime = '';
            vm.parkingAsync.selected = undefined;
            vm.coupon.valid_endtime = undefined ;
            vm.coupon.valid_begintime = undefined ;
            vm.plate_number = '';
            queryReconcile();
        }
        function exportReconcile() {
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime) {
                vm.valid_begintime = moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            var obj = {
                valid_begintime:vm.valid_begintime,
                valid_endtime:vm.valid_endtime,
                organId:vm.organId,
                parklotname:vm.seletParkId
            }
            reconcileExportFactory.setorganReconcile(obj);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'exportDetail.html',
                size: 'lg',
                controller: 'reconcileExportController',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                vm.queryOrganReconcile();
            });
        }
    }
})();