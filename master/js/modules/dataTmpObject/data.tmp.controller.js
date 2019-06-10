(function () {
    angular.module('app.parking')
        .controller('dataTmpController', dataTmpController);
    dataTmpController.$inject = ['logger', '$document','inducementService','dataTmpService','datatablesOptions','DTColumnDefBuilder'];
    'use strict';
    function dataTmpController(logger, $document,inducementService,dataTmpService,datatablesOptions,DTColumnDefBuilder) {
        var vm = this;
        vm.parkAsync = [];
        var allParks = [];
        vm.coupon ={
            valid_begintime:undefined,
            valid_endtime:undefined
        };
        vm.number = {
            start:'',
            next:''
        }
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
        vm.queryParking = queryParking;
        vm.queryParking();
        vm.readRecords = readRecords;
        vm.readRecords(0);
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
        function queryParking() {
            inducementService.queryParking().then(function (response) {
                vm.parkAsync = response.parking_lots;
                angular.forEach(response.parking_lots, function (value) {
                    vm.parkAsync = response.parking_lots;
                    allParks.push(value.id);
                });
            });
        }
        vm.onSelectCallback = function (item) {
            vm.eventResult = {model: item};
            vm.selectParkName = vm.eventResult.model.id;
            vm.selectParkName = vm.eventResult.model.name;
        };
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
        function readRecords(start_index) {
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            if(start_index == 0){
                dataTmpService.queryDataTmp(0,'',vm.plateform,vm.selectParkName,vm.status,vm.valid_begintime,vm.valid_endtime).then(function (response) {
                    vm.dataTmp = response.records;
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
                    vm.pagination.maxid = response.maxid;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                });
            }else if(start_index == 1){
                if (vm.pagination.previous_start_index >= vm.pagination.maxid) {
                    logger.warning('已经到首页！','','没有上一页');
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                }else{
                    dataTmpService.queryDataTmp(vm.pagination.previous_start_index,0,vm.plateform,vm.selectParkName,vm.status,vm.valid_begintime,vm.valid_endtime).then(function (response) {
                        vm.dataTmp = response.records;
                        vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                        vm.pagination.previous_start_index = response.records[0].id;
                        vm.pagination.maxid = response.maxid;
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                    });
                }
            }else if(start_index == 2){
                if (vm.pagination.next_start_index <= vm.pagination.minid) {
                    logger.warning('已经到最后一页！','','没有下一页');
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                }else{
                    dataTmpService.queryDataTmp(vm.pagination.next_start_index,1,vm.plateform,vm.selectParkName,vm.status,vm.valid_begintime,vm.valid_endtime).then(function (response) {
                        vm.dataTmp = response.records;
                        vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                        vm.pagination.previous_start_index = response.records[0].id;
                        vm.pagination.minid = response.minid;
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                    });
                }
            }else if(start_index == 3){
                dataTmpService.queryDataTmp(-1,'',vm.plateform,vm.selectParkName,vm.status,vm.valid_begintime,vm.valid_endtime).then(function (response) {
                    vm.dataTmp = response.records;
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
                    vm.pagination.minid = response.minid;
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                });
            }
        }
        vm.clearAndRefresh = function () {
            vm.plateform = null;vm.selectParkName = null;vm.status = null;vm.valid_begintime = null;vm.valid_endtime = null;
            vm.coupon ={
                valid_begintime:undefined,
                valid_endtime:undefined
            };
            vm.readRecords(0);
        };
    }
})();