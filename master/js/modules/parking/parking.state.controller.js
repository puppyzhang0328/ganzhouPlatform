(function () {
    angular.module('app.parking')
        .controller('ParkingStateController', ParkingStateController);
    ParkingStateController.$inject = ['ParkingStateService', '$scope', 'i18nService', 'ManageParkingService', 'UiGridOptions', '$document','StatusCode','logger', '$interval'];
    'use strict';
    /**
     * @ngdoc function
     * @param ParkingStateService
     * @param $scope
     * @param i18nService
     * @param ManageParkingService
     * @param UiGridOptions
     * @param $document
     * @param StatusCode
     * @param logger
     * @constructor
     */
    function ParkingStateController(ParkingStateService, $scope, i18nService, ManageParkingService, UiGridOptions, $document,StatusCode,logger,$interval) {
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
        vm.rowTemplate = function(){
            return '<div ng-class="{ \'my-css-class\': grid.appScope.rowFormatter( row ) }">' +
                '  <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
                '</div>';
        }
        $scope.rowFormatter = function( row ) {
            return row.entity.httpstatus == '1';
        };
        i18nService.setCurrentLang('zh-cn');
        vm.gridOptions = UiGridOptions.getUiGridOption();
        vm.gridOptions.enablePaginationControls = false;
        vm.gridOptions.rowTemplate =vm.rowTemplate();
        vm.gridOptions.data = [];
        vm.gridOptions.columnDefs = [
            {field: 'id', displayName: '序号', width: '10%',
                headerCellFilter: 'translate',
                headerCellClass: 'grid-align',
                cellClass: 'grid-align'
            },
            {field: 'name', displayName: '停车场名称',
                headerCellFilter: 'translate',
                headerCellClass: 'grid-align',
                cellClass: 'grid-align'
            },
            {field: 'address', displayName: '停车场地址',
                headerCellFilter: 'translate',
                headerCellClass: 'grid-align',
                cellClass: 'grid-align'
            },
            {field: 'mqttstatus', displayName: '是否接入',
                headerCellFilter: 'translate',
                headerCellClass: 'grid-align',
                cellClass: 'grid-align',
                cellTemplate: '<div class="ui-grid-cell-contents">{{row.entity.mqttstatus==2?"否":"是"}}</div>'
            },
            {field: 'httpstatus', displayName: '上传工具在线与否',
                headerCellFilter: 'translate',
                headerCellClass: 'grid-align',
                cellClass: 'grid-align',
                cellTemplate: '<div class="ui-grid-cell-contents"><span ng-if="row.entity.httpstatus !== 2">{{row.entity.httpstatus==0?"在线":"不在线"}}</span></div>'
            },
            {field: 'httpheartbeat',displayName: '最后传输时间',
                headerCellFilter: 'translate',
                headerCellClass: 'grid-align',
                cellClass: 'grid-align'
            },
            {field: 'type',displayName: '停车场类型',
                headerCellFilter: 'translate',
                headerCellClass: 'grid-align',
                cellClass: 'grid-align'
            }
        ];
        vm.totalServerItems = 0;
        vm.pagination = {
            pagetype: {
                next_page: 1,
                pervious_page: 0
            },
            maxid: 0,
            minid: 0,
            pageSize: 100,
            pageNumber: 0,
            next_start_index: 0,
            previous_start_index: 0,
            totalItems: null,
            now_start_index:0
        };

        /*加载上一页*/
        vm.loadPreviousPage = function () {
            $interval.cancel(queryState);
            vm.pagination.now_start_index = vm.pagination.previous_start_index;
            vm.pagination.new_pagetype = vm.pagination.pagetype.pervious_page;
            if (vm.pagination.previous_start_index >= vm.pagination.maxid) {
                logger.warning('已经到首页！','','没有上一页');
                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
            } else {
                ParkingStateService.readRecords(vm.pagination.previous_start_index, vm.pagination.pageSize, vm.pagination.pagetype.pervious_page, vm.seletPark.id, vm.search_plate_number).then(function (response) {
                    vm.gridOptions.data = response.parking_lots;
                    vm.pagination.next_start_index = response.parking_lots[response.parking_lots.length - 1].id;
                    vm.pagination.previous_start_index = response.parking_lots[0].id;
                    vm.pagination.maxid = response.maxid;
                    if (vm.gridOptions.data.length < 50) {
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    }
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                });
            }
            vm.loadNowPage();
        };

        /*加载下一页*/
        vm.loadNextPage = function () {
            $interval.cancel(queryState);
            vm.pagination.now_start_index = vm.pagination.next_start_index;
            vm.pagination.new_pagetype = vm.pagination.pagetype.next_page;
            if (vm.pagination.next_start_index <= vm.pagination.minid || vm.gridOptions.data.length < 50) {
                logger.warning('已经到最后一页！','','没有下一页');
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
            } else {
                ParkingStateService.readRecords(vm.pagination.next_start_index, vm.pagination.pageSize, vm.pagination.pagetype.next_page, vm.seletPark.id, vm.search_plate_number).then(function (response) {
                    vm.gridOptions.data = response.parking_lots;
                    vm.pagination.next_start_index = response.parking_lots[response.parking_lots.length - 1].id;
                    vm.pagination.previous_start_index = response.parking_lots[0].id;
                    vm.pagination.minid = response.minid;
                    if (vm.gridOptions.data.length < 50) {
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    }
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                });
                vm.loadNowPage();
            }
        };

        /*加载首页*/
        vm.loadFistPage = function () {
            $interval.cancel(queryState);
            vm.pagination.next_start_index = 0;
            vm.pagination.maxid = 0;
            vm.pagination.minid = 0;
            vm.pagination.now_start_index = vm.pagination.next_start_index;
            vm.pagination.new_pagetype = vm.pagination.pagetype.pervious_page;
            ParkingStateService.readHome(vm.seletPark.id, vm.search_plate_number).then(function (response) {
                if (response.status === StatusCode.SUCCESS && response.parking_lots.length !== 0) {
                    vm.gridOptions.data = response.parking_lots;
                    vm.pagination.next_start_index = response.parking_lots[response.parking_lots.length - 1].id;
                    vm.pagination.previous_start_index = response.parking_lots[0].id;
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
                } else if (response.status === 10003) {
                    logger.error('数据库发生错误！',response.detail,'查找失败！');
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                } else {
                    logger.warning('没有找到停车状态情况',response.detail,'没有停车记录');
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                }
                vm.loadNowPage();
            });
        };
        /*加载末页*/
        vm.loadLastPage = function () {
            $interval.cancel(queryState);
            vm.pagination.now_start_index = -1;
            vm.pagination.new_pagetype = vm.pagination.pagetype.next_page;
            ParkingStateService.readLastPage(vm.seletPark.id, vm.search_plate_number).then(function (response) {
                vm.gridOptions.data = response.parking_lots;
                vm.pagination.minid = response.minid;
                vm.pagination.next_start_index = response.parking_lots[response.parking_lots.length - 1].id;
                vm.pagination.previous_start_index = response.parking_lots[0].id;
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
            });
            vm.loadNowPage();
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
            ParkingStateService.readRecords(vm.pagination.start_index, vm.pagination.pageSize, vm.pagination.pagetype.next_page, vm.eventResult.model.id, vm.search_plate_number).then(function (response) {
                if (response.status === StatusCode.SUCCESS && response.parking_lots.length !== 0) {
                    vm.gridOptions.data = response.parking_lots;
                    vm.pagination.next_start_index = response.parking_lots[response.parking_lots.length - 1].id;
                    vm.pagination.previous_start_index = response.parking_lots[0].id;
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
                } else if (response.status === StatusCode.NO_INOUT_RECORD) {
                    logger.warning('没有找到停车状态情况',response.detail,'没有找到停车状态情况');
                } else {
                    logger.error('没有找到停车状态情况',response.detail,'数据库错误');
                }
            });
            vm.loadNowPage();
        };
        /*清除查找条件*/
        vm.clearAndRefresh = function () {
            vm.eventResult.model = undefined;
            vm.parkingAsync.selected = undefined;
            vm.seletPark.id = undefined;
            vm.search_plate_number = undefined;
            vm.loadFistPage();
        };
        // /*刷新当前页*/
        vm.loadNowPage = function () {
            queryState = $interval(function(){
                ParkingStateService.readNowPage(vm.pagination.now_start_index, vm.pagination.pageSize, vm.seletPark.id, vm.search_plate_number,vm.pagination.new_pagetype).then(function (response) {
                vm.gridOptions.data = response.parking_lots;
                });
            },5000);
        };
        vm.stopQueryState = function(){
            if (angular.isDefined(queryState)) {
                $interval.cancel(queryState);
                queryState = undefined;
            }
        }
        var queryState;
        $scope.$on("$destroy", function() {
            vm.stopQueryState();
        });
    }
})();