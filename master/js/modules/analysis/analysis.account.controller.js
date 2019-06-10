(function () {
    angular.module('app.analysis')
        .controller('analysisAccountController', analysisAccountController);
    analysisAccountController.$inject = [ 'analysisAccountService', 'DTColumnDefBuilder','$scope','StatusCode','datatablesOptions','$document','logger'];
    'use strict';
    function analysisAccountController(analysisAccountService, DTColumnDefBuilder,$scope,StatusCode,datatablesOptions,$document,logger) {
        var vm = this;
        vm.chart_time = [];
        vm.wechat_actual_sum =[];
        vm.ali_actual_sum = [];
        vm.app_actual_sum = [];
        vm.actual_sum = [];
        vm.should_sum = [];
        vm.coupon_sum = [];
        vm.arrears_sum = [];
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
            totalItems: null,
            start_index:0,
            now_start_index:0,
        };
        vm.coupon ={
            valid_begintime:undefined,
            valid_endtime:undefined
        };
        vm.loadPreviousPage = function () {
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            if (vm.pagination.previous_start_index >= vm.pagination.maxid) {
                logger.warning('已经到首页！','','没有上一页');
                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
            } else {
                analysisAccountService.readRecords(vm.valid_begintime,vm.valid_endtime,vm.time_type,vm.pagination.pageSize,vm.pagination.previous_start_index,vm.pagination.pagetype.pervious_page).then(function (response) {
                    vm.account_data = response.account_data;
                    angular.forEach(response.account_data, function (value,index) {
                        vm.account_data[index].id = vm.account_data_id-index+1;
                    });
                    vm.account_data_id = vm.account_data[vm.account_data.length-1].id;
                    vm.pagination.next_start_index = response.account_data[response.account_data.length - 1].townid;
                    vm.pagination.previous_start_index = response.account_data[0].townid;
                    vm.pagination.maxid = response.maxid;
                    if (vm.account_data.length < 50) {
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    }
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                });
            }
        };
        vm.loadNextPage = function () {
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            if (vm.pagination.next_start_index <= vm.pagination.minid) {
                logger.warning('已经到最后一页！','','没有下一页');
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
            } else {
                analysisAccountService.readRecords(vm.valid_begintime,vm.valid_endtime,vm.time_type,vm.pagination.pageSize,vm.pagination.previous_start_index,vm.pagination.pagetype.next_page).then(function (response) {
                    vm.account_data = response.account_data;
                    angular.forEach(response.account_data, function (value,index) {
                        vm.account_data[index].id = vm.account_data_id+index+1;
                    });
                    vm.account_data_id = vm.account_data[vm.account_data.length-1].id;
                    vm.pagination.next_start_index = response.account_data[response.account_data.length - 1].townid;
                    vm.pagination.previous_start_index = response.account_data[0].townid;
                    vm.pagination.minid = response.minid;
                    if (vm.account_data.length < 50) {
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    }
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                });

            }
        };
        vm.loadFistPage = function () {
            vm.pagination.next_start_index = 0;
            vm.pagination.maxid = 0;
            vm.pagination.minid = 0;
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            analysisAccountService.readRecords(vm.valid_begintime,vm.valid_endtime,vm.time_type,vm.pagination.pageSize,vm.pagination.previous_start_index,vm.pagination.pagetype.pervious_page).then(function (response) {
                if (response.status === StatusCode.SUCCESS) {
                    vm.account_data = response.account_data;
                    angular.forEach(response.account_data, function (value,index) {
                        vm.account_data[index].id = index+1;
                    });
                    vm.account_data_id = vm.account_data[vm.account_data.length-1].id;
                    vm.pagination.next_start_index = response.account_data[response.account_data.length - 1].townid;
                    vm.pagination.previous_start_index = response.account_data[0].townid;
                    vm.pagination.maxid = response.maxid;
                    vm.pagination.pageNumber = 1;
                    // 如果记录少于20条，则灰掉所有翻页按钮
                    if (vm.account_data.length < 50) {
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
                    logger.warning('没有找到财务记录',response.detail,'没有财务记录');
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                }

            });
        };
        /*加载末页*/
        vm.loadLastPage = function () {
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            vm.pagination.now_start_index = -1;
            analysisAccountService.readRecords(vm.valid_begintime,vm.valid_endtime,vm.time_type,vm.pagination.pageSize,vm.pagination.previous_start_index,vm.pagination.pagetype.pervious_page).then(function (response) {
                vm.account_data = response.account_data;
                angular.forEach(response.account_data, function (value,index) {
                    vm.account_data[index].id = vm.pagination.maxid -index+1;
                });
                vm.account_data_id = vm.account_data[vm.account_data.length-1].id;
                vm.pagination.minid = response.minid;
                vm.pagination.next_start_index = response.account_data[response.account_data.length - 1].townid;
                vm.pagination.previous_start_index = response.account_data[0].townid;
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
        vm.changeBtn = function () {
            vm.vehicleIn = !vm.vehicleIn;
        };
        vm.searchRecords = function () {
            vm.pagination.next_start_index = 0;
            vm.display = true;
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
-            analysisAccountService.readRecords(vm.valid_begintime,vm.valid_endtime,vm.time_type,vm.pagination.pageSize,vm.pagination.previous_start_index,vm.pagination.pagetype.pervious_page).then(function (response) {
                if (response.status === StatusCode.SUCCESS) {
                    vm.account_data = response.account_data;
                    angular.forEach(response.account_data, function (value,index) {
                        vm.account_data[index].id = index+1;
                        vm.chart_time[index] = vm.account_data[index].time;
                        vm.actual_sum[index] =vm.account_data[index].actual_sum/100;
                        vm.coupon_sum[index] =vm.account_data[index].coupon_sum/100;
                        vm.arrears_sum[index] =vm.account_data[index].arrears_sum/100;
                        vm.wechat_actual_sum[index] =vm.account_data[index].wechat_actual_sum/100;
                        vm.ali_actual_sum[index] =vm.account_data[index].ali_actual_sum/100;
                        vm.app_actual_sum[index] =vm.account_data[index].app_actual_sum/100;
                    });
                    vm.showAccountChart();
                    vm.pagination.next_start_index = response.account_data[response.account_data.length - 1].townid;
                    vm.pagination.previous_start_index = response.account_data[0].townid;
                    vm.pagination.maxid = response.maxid;
                    if (vm.account_data.length < 50) {
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
                    logger.warning('没有找到财务记录',response.detail,'没有财务记录');
                } else {
                    logger.error('没有找到财务记录',response.detail,'数据库错误');
                }
            });
        };
        /*清除查找条件*/
        vm.clearAndRefresh = function () {
            vm.eventResult.model = undefined;
            vm.TownAsync.selected = undefined;
            vm.seletTown.id = undefined;
            vm.loadFistPage();
            vm.display = false;
            vm.vehicleIn = false;
            vm.valid_endtime = '';

        };

        //    图标展示区域
        vm.showAccountChart = function () {
            $('#accountChart').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: '财务报表'
                },
                xAxis: {
                    categories: vm.chart_time,
                    crosshair: true
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: '数量 (次/元/次)'
                    }
                },
                tooltip: {
                    headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                    pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.0f}</b></td></tr>',
                    footerFormat: '</table>',
                    shared: true,
                    useHTML: true
                },
                plotOptions: {
                    column: {
                        borderWidth: 0
                    }
                },
                series: [{
                    name: '账户实际收入',
                    data: vm.actual_sum
                }, {
                    name: '账户应收入',
                    data: vm.should_sum
                }, {
                    name: '优惠金额',
                    data: vm.coupon_sum
                }, {
                    name: '欠费金额',
                    data: vm.arrears_sum
                },{
                    name: '微信实际收入金额',
                    data: vm.wechat_actual_sum
                }, {
                    name: '支付宝实际收入金额',
                    data: vm.ali_actual_sum
                }, {
                    name: 'APP实际收入金额',
                    data: vm.app_actual_sum
                }]
            });
        };
    }
})();