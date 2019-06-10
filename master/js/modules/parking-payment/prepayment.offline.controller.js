(function () {
    angular.module('app.prepayment')
        .controller('OfflinePaymentController',OfflinePaymentController);
    OfflinePaymentController.$inject = ['OfflinePaymentService', '$scope', 'DTColumnDefBuilder','ManageParkingService','datatablesOptions','$document'];
    'use strict';
    function OfflinePaymentController(OfflinePaymentService, $scope, DTColumnDefBuilder, ManageParkingService,datatablesOptions,$document) {
        var vm = this;
        vm.queryBaiDuMapParking = queryBaiDuMapParking;
        vm.queryBaiDuMapParking();
        vm.coupon ={
            valid_begintime:undefined,
            valid_endtime:undefined
        };
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
        /*停车场选择-------------------------------------------------*/
        vm.disabled = undefined;
        vm.searchEnabled = undefined;
        vm.setInputFocus = function () {
            $scope.$broadcast('UiselectDemo1');
        };
        vm.enable = function () {
            vm.disabled = false;
        };
        vm.display = false;
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
            $scope.seletParkId = vm.eventResult.model.id;
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
            DTColumnDefBuilder.newColumnDef(5)
        ];
        $scope.totalServerItems = 0;
        $scope.pagination = {
            pagetype: {
                next_page: 1,
                pervious_page: 0
            },
            maxid: 0,
            minid: 0,
            next_start_index: 0,
            previous_start_index: 0,
            pageSize: 50,
            pageNumber: 0,
            totalItems: null,
            getTotalPages: function () {
                return Math.ceil(this.totalItems / this.pageSize);
            },
            nextPage: function () {
                $scope.loadNextPage();
                this.pageNumber++;
            },
            previousPage: function () {
                this.pageNumber--;
                $scope.loadPreviousPage();
            }
        };
        /*加载上一页*/
        $scope.loadPreviousPage = function () {
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            if ($scope.pagination.previous_start_index >= $scope.pagination.maxid) {
                alert('已经到第一页！');
                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
            } else {
                OfflinePaymentService.readRecords($scope.pagination.previous_start_index, $scope.pagination.pageSize, $scope.pagination.pagetype.pervious_page,$scope.seletParkId,$scope.search_plate_number,vm.valid_begintime,vm.valid_endtime).then(function (response) {
                    $scope.park_data = response.records;
                    $scope.pagination.next_start_index = response.records[response.records.length - 1].id;
                    $scope.pagination.previous_start_index = response.records[0].id;
                    $scope.pagination.maxid = response.maxid;
                    if($scope.park_data.length < 50){
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    }
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                });
            }

        };
        /*加载下一页*/
        $scope.loadNextPage = function () {
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            if ($scope.pagination.next_start_index <= $scope.pagination.minid || $scope.park_data.length < 50) {
                alert('已经到最后一页！');
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
            } else {
                OfflinePaymentService.readRecords($scope.pagination.next_start_index, $scope.pagination.pageSize, $scope.pagination.pagetype.next_page,$scope.seletParkId,$scope.search_plate_number,vm.valid_begintime,vm.valid_endtime).then(function (response) {
                    $scope.park_data = response.records;
                    $scope.pagination.next_start_index = response.records[response.records.length - 1].id;
                    $scope.pagination.previous_start_index = response.records[0].id;
                    $scope.pagination.minid = response.minid;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                });

            }
        };
        /*加载首页*/
        $scope.loadFistPage = function () {
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            $scope.pagination.start_index = 0;
            $scope.pagination.maxid = 0;
            $scope.pagination.minid = 0;
            OfflinePaymentService.readHome($scope.seletParkId,$scope.search_plate_number).then(function (response) {
                if (response.records.length == 0) {
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                } else {
                    $scope.park_data = response.records;
                    $scope.pagination.next_start_index = response.records[response.records.length - 1].id;
                    $scope.pagination.previous_start_index = response.records[0].id;
                    $scope.pagination.maxid = response.maxid;
                    $scope.pagination.pageNumber = 1;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                }
            });

        };
        /*加载末页*/
        $scope.loadLastPage = function () {
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            OfflinePaymentService.readLastPage($scope.seletParkId,$scope.search_plate_number,vm.valid_begintime,vm.valid_endtime).then(function (response) {
                $scope.park_data = response.records;
                $scope.pagination.minid = response.minid;
                $scope.pagination.next_start_index = response.records[response.records.length - 1].id;
                $scope.pagination.previous_start_index = response.records[0].id;
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
            })
        };
        $scope.loadFistPage();
        $scope.menuState = {
            show: false
        };
        $scope.toggleMenu = function () {
            $scope.menuState.show = !$scope.menuState.show;
        };
        /*查找指定停车场或者车牌号的数据*/
        $scope.searchRecords = function () {
            $scope.pagination.start_index = 0;
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            OfflinePaymentService.readRecords( $scope.pagination.start_index, $scope.pagination.pageSize, $scope.pagination.pagetype.next_page,$scope.seletParkId,$scope.search_plate_number,vm.valid_begintime,vm.valid_endtime).then(function (response) {
                if (response.status == 0 && response.records.length != 0) {
                    $scope.park_data = response.records;
                    $scope.pagination.next_start_index = response.records[response.records.length - 1].id;
                    $scope.pagination.previous_start_index = response.records[0].id;
                    $scope.pagination.maxid = response.maxid;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                }
            });
        };
        /*清除查找条件*/
        $scope.clearAndRefresh = function () {
            vm.parkingAsync.selecte = undefined;
            vm.seletParkId = undefined;
            $scope.search_plate_number = undefined;
            $scope.payment_channel = '',$scope.username = '',$scope.paid = '',vm.valid_begintime = '',vm.valid_endtime = '';
            $scope.loadFistPage();
        };
    }
})();