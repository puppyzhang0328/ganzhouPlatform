(function () {
    angular.module('app.basicinfo')
        .controller('CouponManController', CouponManController);
    CouponManController.$inject = ['CouponManService', '$scope', 'DTColumnDefBuilder', '$document','StatusCode','logger', 'datatablesOptions'];
    'use strict';
    function CouponManController(CouponManService, $scope, DTColumnDefBuilder, $document,StatusCode,logger,datatablesOptions) {
        var vm = this;
        // i18nService.setCurrentLang('zh-cn');
        // vm.gridOptions = UiGridOptions.getUiGridOption();
        // vm.gridOptions.enablePaginationControls = false;
        // vm.coupon = [];
        // vm.gridOptions.columnDefs = [
        //     {field: 'id', displayName: '序号', width: '10%',
        //         headerCellFilter: 'translate',
        //         headerCellClass: 'grid-align',
        //         cellClass: 'grid-align'
        //     },
        //     {field: 'meta', displayName: '活动id',
        //         headerCellFilter: 'translate',
        //         headerCellClass: 'grid-align',
        //         cellClass: 'grid-align'
        //     },
        //     {field: 'user', displayName: '用户ID',
        //         headerCellFilter: 'translate',
        //         headerCellClass: 'grid-align',
        //         cellClass: 'grid-align'
        //     },
        //     {field: 'campaign', displayName: '活动名称',
        //         headerCellFilter: 'translate',
        //         headerCellClass: 'grid-align',
        //         cellClass: 'grid-align'
        //     },
        //     {field: 'campaign_displayname', displayName: '活动显示名称',
        //         headerCellFilter: 'translate',
        //         headerCellClass: 'grid-align',
        //         cellClass: 'grid-align'
        //     },
        //     {field: 'valid_begintime', displayName: '有效起始时间',
        //         headerCellFilter: 'translate',
        //         headerCellClass: 'grid-align',
        //         cellClass: 'grid-align',
        //     },
        //     {field: 'valid_endtime', displayName: '终止时间',
        //         headerCellFilter: 'translate',
        //         headerCellClass: 'grid-align',
        //         cellClass: 'grid-align',
        //     },
        //     {field: 'createdtime', displayName: '创建时间',
        //         headerCellFilter: 'translate',
        //         headerCellClass: 'grid-align',
        //         cellClass: 'grid-align',
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
            DTColumnDefBuilder.newColumnDef(8)
        ];
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
            if (vm.pagination.previous_start_index >= vm.pagination.maxid) {
                logger.warning('已经到首页！','','没有上一页');
                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
            } else {
                CouponManService.readRecords(vm.pagination.previous_start_index, vm.pagination.pageSize, vm.pagination.pagetype.pervious_page).then(function (response) {
                    vm.coupon = response.records;
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
                    vm.pagination.maxid = response.maxid;
                    if (vm.coupon.length < 50) {
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    }
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                });
            }
        };
        /*加载下一页*/
        vm.loadNextPage = function () {
            if (vm.pagination.next_start_index <= vm.pagination.minid || vm.coupon.length < 50) {
                logger.warning('已经到最后一页！','','没有下一页');
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
            } else {
                CouponManService.readRecords(vm.pagination.next_start_index, vm.pagination.pageSize, vm.pagination.pagetype.next_page).then(function (response) {
                    vm.coupon = response.records;
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
                    vm.pagination.minid = response.minid;
                    if (vm.coupon.length < 50) {
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
            CouponManService.readHome().then(function (response) {
                if (response.status === StatusCode.SUCCESS && response.records.length !== 0) {
                    vm.coupon = response.records;
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
                    vm.pagination.maxid = response.maxid;
                    vm.pagination.pageNumber = 1;
                    // 如果记录少于20条，则灰掉所有翻页按钮
                    if (vm.coupon.length < 50) {
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
            });
        };
        /*加载末页*/
        vm.loadLastPage = function () {
            ParkingStateService.readLastPage().then(function (response) {
                vm.coupon = response.records;
                vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                vm.pagination.previous_start_index = response.records[0].id;
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
            });
        };
        vm.loadFistPage();
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