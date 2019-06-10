/**
 * Created by huangxiang  on 2016/11/28 0028.
 * @author: huangxiang
 * Module: bill.offline.controller.js
 * feature: 停车场线下缴费账单controller
 */
(function () {
    angular.module('app.bill')
        .controller('OfflineBillDetailController', OfflineBillDetailController);

    OfflineBillDetailController.$inject = ['$scope', 'ManageParkingService', 'i18nService', 'ParkingBill', 'UiGridOptions', 'logger','uiGridConstants','uiGridGroupingConstants','$timeout'];

    'use strict';
    function OfflineBillDetailController($scope, ManageParkingService, i18nService, ParkingBill, UiGridOptions, logger,uiGridConstants,uiGridGroupingConstants,$timeout) {
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
            if (vm.dateRangeEnd) {
                var activeDate = moment(vm.dateRangeEnd);
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
        vm.parkingAsync = {selected: 'wladimir@email.com'};
        vm.parkingAsync = [];

        var allParkLots = [];

        ManageParkingService.queryParking().then(function (response) {
            vm.parkingAsync = response.parking_lots;
            angular.forEach(response.parking_lots, function (value) {
                allParkLots.push(value.id);
            });
        });

        vm.onSelectCallback = function (item) {
            vm.eventResult = {model: item};
        };

        // 搜索框设置
        vm.menuState = {
            show: false
        };
        vm.toggleMenu = function () {
            vm.menuState.show = !vm.menuState.show;
        };

        /*停车场选择-------------------------------------------------*/
        //uiGridConstants.aggregationTypes.sum

        i18nService.setCurrentLang('zh-cn');
        vm.gridOptions = UiGridOptions.getUiGridOption();
        vm.gridOptions.enablePaginationControls = true;
        // vm.gridOptions.useExternalPagination = true;
        vm.paginationPageSizes = [100, 150, 200];
        vm.paginationPageSize = 100;
        vm.gridOptions.data = [];
        vm.gridOptions.columnDefs = [
            {field: 'id', displayName: '停车场编号', headerCellClass: 'grid-align', cellClass: 'grid-align'},
            {field: 'payment_time', displayName: '缴费时间', headerCellClass: 'grid-align', cellClass: 'grid-align'},
            {field: 'plate_number', displayName: '车牌号码', headerCellClass: 'grid-align', cellClass: 'grid-align'},
            {field: 'parklot', displayName: '缴费停车场', headerCellClass: 'grid-align', cellClass: 'grid-align'},
            {
                field: 'amount',
                displayName: '缴费金额',
                cellTemplate: '<div class="ui-grid-cell-contents"><span>{{COL_FIELD/100}} 元</span></div>',
                footerCellTemplate: '<div class="ui-grid-cell-contents" style="background-color: Red;color: White">费用合计：{{ vm.totalfee }}</div>',
                // headerCellClass: 'grid-align', cellClass: 'grid-align',
                aggregationType:uiGridConstants.aggregationTypes.sum/100+'元', treeAggregationType: uiGridGroupingConstants.aggregation.sum/100+'元'
            },
            {
                name: '操作',
                cellTemplate: '<button class="btn btn-link btn-small" ng-click="grid.appScope.showMe()">查看详情</button>',
                headerCellClass: 'grid-align',
                cellClass: 'grid-align'
            }
        ];
        vm.totalServerItems = 0;

        /*初始化停车场详情*/
        vm.InitBillDetail = function () {
            vm.currentDate = new Date();
            vm.weekDayTime = vm.currentDate.getTime() - 604800000;

            ParkingBill.queryOfflineBill(moment(new Date(new Date(vm.currentDate.getTime() - 604800000))).format('YYYY-MM-DD'), moment(new Date()).format('YYYY-MM-DD'), allParkLots).then(function (response) {
                if (response.status === 0) {
                    vm.gridOptions.data = response.records;
                    vm.appBills = response.records;
                    vm.totalfee = response.totalfee;
                } else if (response.status === 10003) {
                    logger.error('查询失败', response.detail, '服务器获取数据失败！请联系相关人员处理！');
                } else if (response.status === 40003) {
                    logger.error('查询失败', response.detail, '没有该停车场');
                } else if (response.status === 40008) {
                    logger.error('查询失败', response.detail, '没有缴费记录');
                }
            });
        };

        /*搜索查询停车场账单详情*/
        vm.SearchBillDetail = function () {
            ParkingBill.queryOfflineBill(moment(vm.dateRangeStart).format('YYYY-MM-DD'), moment(vm.dateRangeEnd).format('YYYY-MM-DD'), vm.eventResult.model.id).then(function (response) {
                if (response.status === 0) {
                    vm.gridOptions.data = response.records;
                } else if (response.status === 10003) {
                    logger.error('查询失败', response.detail, '服务器获取数据失败！请联系相关人员处理！');
                } else if (response.status === 40003) {
                    logger.error('查询失败', response.detail, '没有该停车场');
                } else if (response.status === 40008) {
                    logger.error('查询失败', response.detail, '没有缴费记录');
                }
            });
        };

        $timeout(function () {
            vm.InitBillDetail();
        },1000);
    }
})();