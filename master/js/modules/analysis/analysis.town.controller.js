(function () {
    angular.module('app.analysis')
        .controller('analysisTownController', analysisTownController);
    analysisTownController.$inject = ['$location', 'ManageParkingService', 'analysisTownService', 'DTColumnDefBuilder','$scope','StatusCode','datatablesOptions','$interval','$document','townService','logger'];
    'use strict';
    function analysisTownController($location, ManageParkingService, analysisTownService, DTColumnDefBuilder,$scope,StatusCode,datatablesOptions,$interval,$document,townService,logger) {
        var vm = this;
        vm.town_chart_time = [];
        vm.town_chart_town_num =[];
        vm.town_chart_town_sum = [];
        vm.town_chart_plsl_num = [];
        vm.town_chart_park_sum = [];
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
        var selectPark = [];//所选择的停车场
        vm.vehicleIn = false;
        var selectTown = [];//所选择的商圈
        vm.TownAsync = [];
        var allTowns = [];
        townService.queryTown().then(function (response) {
            vm.TownAsync = response.data;
            angular.forEach(response.data, function (value) {
                allTowns.push(value.id);
            });
        });
        vm.onSelectCallbackTown = function (item) {
            vm.eventResult = {model: item};
            vm.seletTown.id = vm.eventResult.model.id;
            vm.seletTown.name = vm.eventResult.model.name;
        };
        vm.seletTown = {
            id: undefined
        };
        // i18nService.setCurrentLang('zh-cn');
        // vm.gridOptions = UiGridOptions.getUiGridOption();
        // vm.gridOptions.enablePaginationControls = false;
        // vm.town_data = [];
        // vm.gridOptions.columnDefs = [
        //     {field: 'id', displayName: '序号', width: '10%'},
        //     {field: 'townid', displayName: '商圈ID', width: '10%'},
        //     {field: 'park_sum', displayName: '停车场数', width: '10%'},
        //     {field: 'townname', displayName: '商圈名称'},
        //     {field: 'plsl_num', displayName: '故障次数'},
        //     {field: 'town_num', displayName: '消费次数'},
        //     {field: 'town_sum', displayName: '消费金额'},
        //     {field: 'time', displayName: '时间'}
        // ];
        vm.dtOptions = datatablesOptions.getDatatableOption(); // 获取datatables表格设置
        // 创建表格列
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6)
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
            now_start_index:0
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
                analysisTownService.readRecords(vm.seletTown.id,vm.valid_begintime,vm.valid_endtime,vm.time_type,vm.pagination.pageSize, vm.pagination.previous_start_index,vm.pagination.pagetype.pervious_page).then(function (response) {
                    vm.town_data = response.town_data;
                    angular.forEach(vm.town_data, function (value,index) {
                        vm.town_data[index].id = vm.town_data_id-index-1;
                    });
                    vm.town_data_id = response.town_data[vm.town_data.length-1].id;
                      vm.pagination.previous_start_index   = response.town_data[response.town_data.length - 1].townid;
                      vm.pagination.next_start_index   = response.town_data[0].townid;
                    vm.pagination.maxid = response.maxid;
                    vm.town_data=(vm.town_data).reverse();
                    if (vm.town_data.length < 50) {
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
            if (vm.pagination.next_start_index  <= vm.pagination.minid) {
                logger.warning('已经到最后一页！','','没有下一页');
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
            } else {
                analysisTownService.readRecords(vm.seletTown.id,vm.valid_begintime,vm.valid_endtime,vm.time_type,vm.pagination.pageSize,vm.pagination.next_start_index,vm.pagination.pagetype.next_page).then(function (response) {
                    vm.town_data = response.town_data;
                    angular.forEach(response.town_data, function (value,index) {
                        vm.town_data[index].id = vm.town_data_id+index+1;
                    });
                    vm.town_data_id = vm.town_data[vm.town_data.length-1].id;
                    vm.pagination.next_start_index = response.town_data[response.town_data.length - 1].townid;//这一组数组中最小的数据
                    vm.pagination.previous_start_index = response.town_data[0].townid;//这一组数组中最大的数据
                    vm.pagination.minid = response.minid;
                    if (vm.town_data.length < 50) {
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
            analysisTownService.readRecords(vm.seletTown.id,vm.valid_begintime,vm.valid_endtime,vm.time_type,vm.pagination.pageSize, 0,"").then(function (response) {
                if (response.status === StatusCode.SUCCESS) {
                    vm.town_data = response.town_data;
                    angular.forEach(response.town_data, function (value,index) {
                        vm.town_data[index].id = index+1;
                    });
                    vm.town_data_id = vm.town_data[vm.town_data.length-1].id;
                    vm.pagination.next_start_index = response.town_data[response.town_data.length - 1].townid;
                    vm.pagination.previous_start_index = response.town_data[0].townid;
                    vm.pagination.maxid = response.maxid;
                    vm.pagination.pageNumber = 1;
                    // 如果记录少于20条，则灰掉所有翻页按钮
                    if (vm.town_data.length < 50) {
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
            analysisTownService.readRecords(vm.seletTown.id,vm.valid_begintime,vm.valid_endtime,vm.time_type,vm.pagination.pageSize,-1,vm.pagination.pagetype.pervious_page).then(function (response) {
                vm.town_data = response.town_data;
                angular.forEach(response.town_data, function (value,index) {
                    vm.town_data[index].id = vm.pagination.maxid -index+1;
                });
                vm.town_data_id = vm.town_data[vm.town_data.length-1].id;
                vm.pagination.minid = response.minid;
                  vm.pagination.previous_start_index= response.town_data[response.town_data.length - 1].townid;
                  vm.pagination.next_start_index= response.town_data[0].townid;
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
            selectPark.push(vm.eventResult.model.id);
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
-            analysisTownService.readRecords(vm.seletTown.id,vm.valid_begintime,vm.valid_endtime,vm.time_type,vm.pagination.pageSize,vm.pagination.previous_start_index,vm.pagination.pagetype.pervious_page).then(function (response) {
                if (response.status === StatusCode.SUCCESS) {
                    vm.town_data = response.town_data;
                    angular.forEach(response.town_data, function (value,index) {
                        vm.town_data[index].id = index+1;
                        vm.town_chart_time[index] = vm.town_data[index].time;
                        vm.town_chart_town_num[index] =vm.town_data[index].town_num;
                        vm.town_chart_town_sum[index] =vm.town_data[index].town_sum/100;
                        vm.town_chart_plsl_num[index] =vm.town_data[index].plsl_num;
                        vm.town_chart_park_sum[index] =vm.town_data[index].park_sum;
                    });
                    vm.showTownChart();
                    vm.pagination.next_start_index = response.town_data[response.town_data.length - 1].townid;
                    vm.pagination.previous_start_index = response.town_data[0].townid;
                    vm.pagination.maxid = response.maxid;
                    if (vm.town_data.length < 50) {
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
            vm.eventResult.model = undefined;
            vm.TownAsync.selected = undefined;
            vm.seletTown.id = undefined;
            vm.loadFistPage();
            vm.display = false;
            vm.vehicleIn = false;
            vm.valid_endtime = '';

        };

        //    图标展示区域
        vm.showTownChart = function () {
            $('#townChart').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: vm.seletTown.name
                },
                xAxis: {
                    categories: vm.town_chart_time,
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
                    name: '停车场数',
                    data: vm.town_chart_park_sum
                }, {
                    name: '消费次数',
                    data: vm.town_chart_town_num
                }, {
                    name: '消费金额',
                    data: vm.town_chart_town_sum
                }, {
                    name: '故障次数',
                    data: vm.town_chart_plsl_num
                }]
            });
        };
    }
})();