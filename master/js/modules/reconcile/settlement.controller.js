(function () {
    angular.module('app.parking')
        .controller('settlementController', settlementController);
    settlementController.$inject = ['$location', 'ManageParkingService', 'DTColumnDefBuilder', 'datatablesOptions','settlementService','$scope','settlementFactory','$uibModal','logger'];
    'use strict';
    function settlementController($location, ManageParkingService, DTColumnDefBuilder, datatablesOptions,settlementService,$scope,settlementFactory,$uibModal,logger) {
        var vm = this;
        vm.querySettlement = querySettlement;
        vm.queryBaiDuMapParking = queryBaiDuMapParking;
        vm.queryBaiDuMapParking();
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
        vm.parkingAsync = [];
        var allParkLots = [];
        var start_index = 0;
        function queryBaiDuMapParking() {
            ManageParkingService.queryBaiDuMapParking(start_index).then(function (response) {
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
            vm.seletPark.id = vm.eventResult.model.id;
        };
        vm.seletPark = {
            id: undefined
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
        vm.coupon ={
            valid_begintime:undefined,
            valid_endtime:undefined
        };
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
        // i18nService.setCurrentLang('zh-cn');
        // vm.gridOptions = UiGridOptions.getUiGridOption();
        // vm.gridOptions.enablePaginationControls = false;
        // vm.gridOptions.data = [];
        // vm.gridOptions.columnDefs = [
        //     {field: 'number', displayName: '序号'},
        //     {
        //         field: 'aggregate_amount',
        //         displayName: '总订单金额',
        //         cellTemplate: '<div class="ui-grid-cell-contents"><span>{{COL_FIELD/100}} 元</span></div>'
        //     },
        //     {
        //         field: 'alipay_amount',
        //         displayName: '支付宝总订单金额',
        //         cellTemplate: '<div class="ui-grid-cell-contents"><span>{{COL_FIELD/100}} 元</span></div>'
        //     },
        //     {
        //         field: 'alipay_refund',
        //         displayName: '支付宝总退款金额',
        //         cellTemplate: '<div class="ui-grid-cell-contents"><span>{{COL_FIELD/100}} 元</span></div>'
        //     },
        //     {
        //         field: 'alipay_stroke_count',
        //         displayName: '支付宝总笔数'
        //     },
        //     {
        //         field: 'alipay_surplus',
        //         displayName: '支付宝结余',
        //         cellTemplate: '<div class="ui-grid-cell-contents"><span>{{COL_FIELD/100}} 元</span></div>'
        //     },
        //     {
        //         field: 'general_surplus',
        //         displayName: '总结余',
        //         cellTemplate: '<div class="ui-grid-cell-contents"><span>{{COL_FIELD/100}} 元</span></div>'
        //     },
        //     {
        //         field: 'total_refund',
        //         displayName: '总退款金额',
        //         cellTemplate: '<div class="ui-grid-cell-contents"><span>{{COL_FIELD/100}} 元</span></div>'
        //     },
        //     {
        //         field: 'total_refund_stroke_count',
        //         displayName: '总退款笔数'
        //     },
        //     {
        //         field: 'total_stroke_count',
        //         displayName: '总笔数'
        //     },
        //     {
        //         field: 'wechatpay_amount',
        //         displayName: '微信总订单金额',
        //         cellTemplate: '<div class="ui-grid-cell-contents"><span>{{COL_FIELD/100}} 元</span></div>'
        //     },
        //     {
        //         field: 'wechatpay_refund',
        //         displayName: '微信总退款金额',
        //         cellTemplate: '<div class="ui-grid-cell-contents"><span>{{COL_FIELD/100}} 元</span></div>'
        //     },
        //     {
        //         field: 'wechatpay_stroke_count',
        //         displayName: '微信总笔数'
        //     },
        //     {
        //         field: 'wechatpay_surplus',
        //         displayName: '微信结余',
        //         cellTemplate: '<div class="ui-grid-cell-contents"><span>{{COL_FIELD/100}} 元</span></div>'
        //     },
        //     {
        //         field: 'id',
        //         displayName: '操作',
        //         cellTemplate: '<div class="ui-grid-cell-contents"><a ng-click="grid.appScope.deSelectRow(row)">详情</a></div>'
        //     }
        // ];
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
            DTColumnDefBuilder.newColumnDef(12),
            DTColumnDefBuilder.newColumnDef(13),
            DTColumnDefBuilder.newColumnDef(14)
        ];
        vm.data = [];
        vm.deSelectRow = function(data) {
            settlementFactory.setSettlement(data);
            var modalInstance = $uibModal.open({
                backdrop:'static',
                templateUrl: '../app/views/settlementDetail.html',
                size:'lg',
                controller: 'settlementDetailController',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
            });
        };
        //查询停车场功能
        function querySettlement() {
            logger.warning('暂无可结算停车场！','','查询无效');
            // if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
            //     vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
            //     vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            //     settlementService.readRecords(vm.seletPark.id,vm.valid_begintime,vm.valid_endtime,vm.time_type).then(function (response) {
            //         vm.gridOptions.data = response.data;
            //     });
            // }
        }
    }
})();