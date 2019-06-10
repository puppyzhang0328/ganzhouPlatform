/**
 * bill.online.controller.js
 * @author: huangxiang
 * @create 2016-12-29 10:43
 */
(function () {
    angular.module('app.bill')
        .controller('OnlineBillController', OnlineBillController);

    OnlineBillController.$inject = ['OnlineBill', '$scope', 'i18nService', 'ManageParkingService', 'UiGridOptions', '$document'];
    'use strict';
    function OnlineBillController(OnlineBill, $scope, i18nService, ManageParkingService, UiGridOptions, $document) {

        var vm = this;

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
            vm.seletPark.id = vm.eventResult.model.id;
        };

        vm.seletPark = {
            id: undefined
        };
        /*停车场选择-------------------------------------------------*/

        i18nService.setCurrentLang('zh-cn');
        vm.gridOptions = UiGridOptions.getUiGridOption();
        vm.gridOptions.enablePaginationControls = false;
        vm.gridOptions.data = [];
        vm.gridOptions.columnDefs = [
            {field: 'id', displayName: '序号'},
            {field: 'user', displayName: '用户编号'},
            {field: 'out_trade_no', displayName: '流水号'},
            {
                field: 'created_time',
                displayName: '创建时间'
            },
            {field: 'paid', displayName: '支付状态'},
            {field: 'payment_channel', displayName: '支付方式'},
            {
                field: 'amount',
                displayName: '缴费金额',
                cellTemplate: '<div class="ui-grid-cell-contents"><span>{{COL_FIELD/100}} 元</span></div>'
            },
            {
                field: 'balance',
                displayName: '账户余额',
                cellTemplate: '<div class="ui-grid-cell-contents"><span>{{COL_FIELD/100}} 元</span></div>'
            },
            {field: 'order_desc', displayName: '备注'}
        ];
        vm.totalServerItems = 0;
        vm.pagination = {
            pagetype: {
                next_page: 1,
                pervious_page: 0
            },
            maxid: 0,
            minid: 0,
            pageSize: 50,
            pageNumber: 0,
            next_start_index: 0,
            previous_start_index: 0,
            totalItems: null
        };
        /*加载上一页*/
        vm.loadPreviousPage = function () {
            if (vm.pagination.previous_start_index >= vm.pagination.maxid) {
                alert('已经到第一页！');
                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
            } else {
                OnlineBill.queryOnlineBill(vm.pagination.previous_start_index, vm.pagination.pageSize, vm.pagination.pagetype.pervious_page, vm.seletPark.id, vm.search_plate_number).then(function (response) {
                    vm.gridOptions.data = response.records;
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
                    vm.pagination.maxid = response.maxid;
                    if (vm.gridOptions.data.length < 50) {
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    }
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                });
            }

        };

        /*加载下一页*/
        vm.loadNextPage = function () {
            if (vm.pagination.next_start_index <= vm.pagination.minid || vm.gridOptions.data.length < 50) {
                alert('已经到最后一页！');
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
            } else {
                OnlineBill.queryOnlineBill(vm.pagination.next_start_index, vm.pagination.pageSize, vm.pagination.pagetype.next_page, vm.seletPark.id, vm.search_plate_number).then(function (response) {
                    vm.gridOptions.data = response.records;
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
                    vm.pagination.minid = response.minid;
                    if (vm.gridOptions.data.length < 50) {
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    }
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                });

            }
        };

        /*加载首页*/
        vm.loadFistPage = function () {
            vm.pagination.next_start_index = 0;
            vm.pagination.maxid = 0;
            vm.pagination.minid = 0;
            OnlineBill.readHome(vm.seletPark.id, vm.search_plate_number).then(function (response) {
                if (response.status == 0 && response.records.length != 0) {
                    vm.gridOptions.data = response.records;
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
                    vm.pagination.maxid = response.maxid;
                    vm.pagination.pageNumber = 1;
                    // 如果记录少于20条，则灰掉所有翻页按钮
                    if (vm.gridOptions.data.length < 50) {
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    } else {
                        // 否则只灰掉上一页按钮，首页留作刷新用
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                    }
                } else if (response.status == 10003) {
                    alert('查找停车记录错误！！！请检查服务器数据库！');
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                } else {
                    alert('暂时没有停车入场记录！！');
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                }

            });
        };
        /*加载末页*/
        vm.loadLastPage = function () {
            OnlineBill.readLastPage(vm.seletPark.id, vm.search_plate_number).then(function (response) {
                vm.gridOptions.data = response.records;
                vm.pagination.minid = response.minid;
                vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                vm.pagination.previous_start_index = response.records[0].id;
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
            });
        };
        vm.loadFistPage();
        vm.menuState = {
            show: false
        };
        vm.toggleMenu = function () {
            vm.menuState.show = !vm.menuState.show;
        };

        /*查找指定停车场或者车牌号的数据*/
        vm.searchRecords = function () {
            vm.pagination.next_start_index = 0;
            OnlineBill.queryOnlineBill(vm.pagination.start_index, vm.pagination.pageSize, vm.pagination.pagetype.next_page, vm.eventResult.model.id, vm.search_plate_number).then(function (response) {
                if (response.status == 0 && response.records.length != 0) {
                    vm.gridOptions.data = response.records;
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
                    vm.pagination.maxid = response.maxid;
                    if (vm.gridOptions.data.length < 50) {
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    } else {
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                    }
                } else if (response.status == 40006) {
                    alert('没有找到相关入场记录！');
                } else {
                    alert('没有找到相关入场记录！');
                }
            });
        };
        /*清除查找条件*/
        vm.clearAndRefresh = function () {
            vm.eventResult.model = undefined;
            vm.parkingAsync.selected = undefined;
            vm.seletPark.id = undefined;
            vm.search_plate_number = undefined;
            vm.loadFistPage();
        };
    }
})();