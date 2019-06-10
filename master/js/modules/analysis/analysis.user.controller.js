(function () {
    angular.module('app.analysis')
        .controller('analysisUserController', analysisUserController);
    analysisUserController.$inject = [ 'analysisUserService','$scope','StatusCode','datatablesOptions','DTColumnDefBuilder','$document','townService','logger'];
    'use strict';
    function analysisUserController(analysisUserService,$scope,StatusCode,datatablesOptions,DTColumnDefBuilder,$document,townService,logger) {
        var vm = this;
        vm.chart_time =[];
        vm.add_user = [];
        vm.pay_num =[];
        vm.pay_sum = [];
        vm.recharge_num = [];
        vm.recharge_sum = [];
        vm.active_user = [];
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
        // i18nService.setCurrentLang('zh-cn');
        // vm.gridOptions = UiGridOptions.getUiGridOption();
        // vm.gridOptions.enablePaginationControls = false;
        // vm.user_data = [];
        // vm.gridOptions.columnDefs = [
        //     {field: 'id', displayName: '序号', width: '10%'},
        //     {field: 'user_all', displayName: '总用户数'},
        //     {field: 'add_user', displayName: '新增用户数'},
        //     {field: 'active_user', displayName: '活跃用户数'},
        //     {field: 'recharge_num', displayName: '充值次数'},
        //     {field: 'recharge_sum', displayName: '充值金额'},
        //     {field: 'pay_num', displayName: '消费次数'},
        //     {field: 'pay_sum', displayName: '消费金额'},
        //     {field: 'time', displayName: '时间'}
        // ];
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
        /*加载上一页*/
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
                analysisUserService.readRecords(vm.valid_begintime,vm.valid_endtime,vm.time_type,vm.pagination.pageSize,vm.pagination.previous_start_index,vm.pagination.pagetype.pervious_page).then(function (response) {
                    vm.user_data = response.user_data;
                    angular.forEach(response.user_data, function (value,index) {
                        vm.user_data[index].id = vm.user_data_id-index+1;
                    });
                    vm.user_data_id = vm.user_data[vm.user_data.length-1].id;
                    vm.pagination.next_start_index = response.user_data[response.user_data.length - 1].townid;
                    vm.pagination.previous_start_index = response.user_data[0].townid;
                    vm.pagination.maxid = response.maxid;
                    if (vm.user_data.length < 50) {
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    }
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                });
            }
        };
        /*加载下一页*/
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
                analysisUserService.readRecords(vm.valid_begintime,vm.valid_endtime,vm.time_type,vm.pagination.pageSize,vm.pagination.previous_start_index,vm.pagination.pagetype.next_page).then(function (response) {
                    vm.user_data = response.user_data;
                    angular.forEach(response.user_data, function (value,index) {
                        vm.user_data[index].id = vm.user_data_id+index+1;
                    });
                    vm.user_data_id = vm.user_data[vm.user_data.length-1].id;
                    vm.pagination.next_start_index = response.user_data[response.user_data.length - 1].townid;
                    vm.pagination.previous_start_index = response.user_data[0].townid;
                    vm.pagination.minid = response.minid;
                    if (vm.user_data.length < 50) {
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
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            analysisUserService.readRecords(vm.valid_begintime,vm.valid_endtime,vm.time_type,vm.pagination.pageSize,vm.pagination.previous_start_index,vm.pagination.pagetype.pervious_page).then(function (response) {
                if (response.status === StatusCode.SUCCESS) {
                    vm.user_data = response.user_data;
                    angular.forEach(response.user_data, function (value,index) {
                        vm.user_data[index].id = index+1;
                    });
                    vm.user_data_id = vm.user_data[vm.user_data.length-1].id;
                    vm.pagination.next_start_index = response.user_data[response.user_data.length - 1].townid;
                    vm.pagination.previous_start_index = response.user_data[0].townid;
                    vm.pagination.maxid = response.maxid;
                    vm.pagination.pageNumber = 1;
                    // 如果记录少于20条，则灰掉所有翻页按钮
                    if (vm.user_data.length < 50) {
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
                    logger.warning('没有找到停车记录',response.detail,'没有停车记录');
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
            analysisUserService.readRecords(vm.valid_begintime,vm.valid_endtime,vm.time_type,vm.pagination.pageSize,vm.pagination.previous_start_index,vm.pagination.pagetype.pervious_page).then(function (response) {
                vm.user_data = response.user_data;
                angular.forEach(response.user_data, function (value,index) {
                    vm.user_data[index].id = vm.pagination.maxid -index+1;
                });
                vm.user_data_id = vm.user_data[vm.user_data.length-1].id;
                vm.pagination.minid = response.minid;
                vm.pagination.next_start_index = response.user_data[response.user_data.length - 1].townid;
                vm.pagination.previous_start_index = response.user_data[0].townid;
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
-            analysisUserService.readRecords(vm.valid_begintime,vm.valid_endtime,vm.time_type,vm.pagination.pageSize,vm.pagination.previous_start_index,vm.pagination.pagetype.pervious_page).then(function (response) {
                if (response.status === StatusCode.SUCCESS) {
                    vm.user_data = response.user_data;
                    angular.forEach(response.user_data, function (value,index) {
                        vm.user_data[index].id = index+1;
                        vm.chart_time[index] = vm.user_data[index].time;
                        vm.active_user[index] =vm.user_data[index].active_user;
                        vm.add_user[index] =vm.user_data[index].add_user;
                        vm.pay_num[index] =vm.user_data[index].pay_num;
                        vm.pay_sum[index] =vm.user_data[index].pay_sum/100;
                        vm.recharge_num[index] =vm.user_data[index].recharge_num;
                        vm.recharge_sum[index] =vm.user_data[index].recharge_sum/100;
                    });
                    vm.showUserChart();
                    vm.pagination.next_start_index = response.user_data[response.user_data.length - 1].townid;
                    vm.pagination.previous_start_index = response.user_data[0].townid;
                    vm.pagination.maxid = response.maxid;
                    if (vm.user_data.length < 50) {
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
                    logger.warning('没有找到停车记录',response.detail,'没有停车记录');
                } else {
                    logger.error('没有找到停车记录',response.detail,'数据库错误');
                }
            });
        };
        /*清除查找条件*/
        vm.clearAndRefresh = function () {
            vm.loadFistPage();
            vm.display = false;
            vm.vehicleIn = false;
            vm.valid_endtime = '';
            vm.valid_begintime ='';
            vm.time_type = '';
        };
        //    图标展示区域
        vm.showUserChart = function () {
            $('#userChart').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: '用户统计表'
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
                    name: '新增用户',
                    data: vm.add_user
                },{
                    name: '活跃用户',
                    data: vm.active_user
                }, {
                    name: '消费次数',
                    data: vm.pay_num
                }, {
                    name: '消费金额',
                    data: vm.pay_sum
                }, {
                    name: '充值次数',
                    data: vm.recharge_num
                }, {
                    name: '充值金额',
                    data: vm.recharge_sum
                }]
            });
        };
    }
})();