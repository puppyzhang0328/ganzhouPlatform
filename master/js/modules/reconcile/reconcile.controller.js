(function () {
    'use strict';
    angular.module('app.parking')
        .controller('reconcileController', reconcileController);
    reconcileController.$inject = ['$location', 'ManageParkingService', 'datatablesOptions', 'DTColumnDefBuilder','reconcileService','$scope','organReconcileFactory','$uibModal','URL_SEED','logger','reconcileExportFactory'];
    function reconcileController($location, ManageParkingService, datatablesOptions, DTColumnDefBuilder,reconcileService,$scope,organReconcileFactory,$uibModal,URL_SEED,logger,reconcileExportFactory) {
        var vm = this;
        vm.queryReconcile = queryReconcile;
        vm.coupon ={
            valid_begintime:undefined,
            valid_endtime:undefined
        };
        vm.parkingAsync = [];
        var obj = organReconcileFactory.getorganReconcile();
        vm.seletParkId = obj.id;vm.coupon.valid_begintime = obj.valid_begintime;vm.coupon.valid_endtime = obj.valid_endtime;vm.parkingAsync.selected = obj.parklotname;
        if(obj.id && obj.valid_begintime && obj.valid_endtime && obj.parklotname){
            vm.queryReconcile();
        }
        vm.queryBaiDuMapParking = queryBaiDuMapParking;
        vm.queryBaiDuMapParking();
        var selectPark = [];//所选择的停车场
        /*停车场选择-------------------------------------------------*/
        vm.disabled = undefined;
        vm.searchEnabled = undefined;
        vm.setInputFocus = function () {
            $scope.$broadcast('UiselectDemo1');
        };
        vm.enable = function () {
            vm.disabled = false;
        };
        vm.disabled = function () {
            vm.disabled = true;
        };
        vm.enableSearch = function () {
            vm.searchEnabled = true;
        };
        vm.disableSearch = function () {
            vm.searchEnabled = false;
        };
        vm.someGroupFn = function (item) {
            if (item.name[0] >= 'A' && item.name[0] <= 'M')
                return 'From A - M';
            if (item.name[0] >= 'N' && item.name[0] <= 'Z')
                return 'From N - Z';
        };
        vm.firstLetterGroupFn = function (item) {
            return item.name[0];
        };
        vm.reverseOrderFilterFn = function (groups) {
            return groups.reverse();
        };

        var allParkLots = [];
        var start_index = 0;
        function queryBaiDuMapParking() {
            ManageParkingService.querySearchBaiDuMapParking(start_index).then(function (response) {
                if(response.parking_lots.length !== 0) {
                    start_index =  response.parking_lots[response.parking_lots.length - 1].id;
                    angular.forEach(response.parking_lots, function (value) {
                        vm.parkingAsync.push(value);
                        allParkLots.push(value.id);
                    });
                    queryBaiDuMapParking();
                }
            });
        }

        vm.onSelectCallback = function (item) {
            vm.eventResult = {model: item};
            vm.seletParkId = vm.eventResult.model.id;
        };
        /*停车场选择-------------------------------------------------*/
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
        vm.pagination = {
            pagetype: {
                next_page: 1,
                pervious_page: 0
            },
            next_start_index:0,
            previous_start_index:0,
            maxid: 0,
            minid: 0
        };
        vm.number={
            start:0,
            next:0
        };
        /*停车场选择-------------------------------------------------*/
        vm.dtOptions = datatablesOptions.getDatatableOption(); // 获取datatables表格设置
        // 创建表格列
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
            DTColumnDefBuilder.newColumnDef(11)
        ];
        vm.show = false;
        //查询停车场功能
        function queryReconcile() {
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
                var i= 0;
                reconcileService.readRecords(vm.seletParkId,vm.valid_begintime,vm.valid_endtime,vm.plate_number).then(function (response) {
                    if(response.status==30007){
                          alert('此时间内没有数据，请重新查询');
                    }

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
                        if(value.thirdpay_checkstatus == '103'){
                            response.data.water_bill[index].checkstatus = '第三方支付金额不一致';
                        }else if(value.thirdpay_checkstatus == '102') {
                            response.data.water_bill[index].checkstatus = '第三方支付不存在';
                        }else if (value.thirdpay_checkstatus == '105') {
                            response.data.water_bill[index].checkstatus = '数据存于湘行测试服务器';
                        }else if(value.thirdpay_checkstatus == '0'){
                            response.data.water_bill[index].checkstatus = '对账无误';
                        }else if(value.thirdpay_checkstatus == '104'){
                            response.data.water_bill[index].checkstatus = '第三方支付时间不一致';
                        }else if(value.thirdpay_checkstatus == '106'){
                            response.data.water_bill[index].checkstatus = '异常已处理';
                        }else {
                            response.data.water_bill[index].checkstatus = '尚未对账';


                        }
                        response.data.water_bill[index].numberId = index+1;
                        i++;
                    });
                    vm.reconcileDate = response.data.water_bill;
                    console.log( vm.reconcileDate )
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
                    vm.show = true;
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