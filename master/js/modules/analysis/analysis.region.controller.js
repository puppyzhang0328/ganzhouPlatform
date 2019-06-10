(function () {
    angular.module('app.analysis')
        .controller('analysisRegionController', analysisRegionController);
    analysisRegionController.$inject = ['$location', 'ManageParkingService', 'analysisRegionService', 'DTColumnDefBuilder','$scope','StatusCode','datatablesOptions','$interval','$document','regionService','logger'];
    'use strict';
    function analysisRegionController($location, ManageParkingService, analysisRegionService, DTColumnDefBuilder,$scope,StatusCode,datatablesOptions,$interval,$document,regionService,logger) {
        var vm = this;
        vm.region_chart_time = [];
        vm.region_chart_park_num =[];
        vm.region_chart_park_sum = [];
        vm.region_chart_plsl_num = [];
        vm.region_chart_park_sum = [];
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
        /*区域选择-------------------------------------------------*/
        var selectRegion = [];//所选择的区域
        vm.regiongAsync = [];
        var allRegions = [];
        regionService.queryRegion().then(function (response) {
            vm.regiongAsync = response.records;
            angular.forEach(response.records, function (value) {
                allRegions.push(value.id);
            });
        });
        vm.onSelectCallback = function (item) {
            vm.eventResult = {model: item};
            vm.selectRegion.id = vm.eventResult.model.id;
            vm.selectRegion.name = vm.eventResult.model.name;
        };
        vm.selectRegion = {
            id: undefined
        };
        // i18nService.setCurrentLang('zh-cn');
        // vm.gridOptions = UiGridOptions.getUiGridOption();
        // vm.gridOptions.enablePaginationControls = false;
        // vm.region_data = [];
        // vm.gridOptions.columnDefs = [
        //     {field: 'id', displayName: '序号', width: '10%'},
        //     {field: 'regionid', displayName: '区域ID', width: '10%'},
        //     {field: 'park_sum', displayName: '停车场数', width: '10%'},
        //     {field: 'regionname', displayName: '区域名称'},
        //     {field: 'plsl_num', displayName: '故障次数'},
        //     {field: 'reg_num', displayName: '消费次数'},
        //     {field: 'reg_sum', displayName: '消费金额'},
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
                analysisRegionService.readRecords(vm.selectRegion.id,vm.valid_begintime,vm.valid_endtime,vm.time_type,vm.pagination.pageSize,vm.pagination.previous_start_index,vm.pagination.pagetype.pervious_page).then(function (response) {
                    vm.region_data = response.region_data;
                    angular.forEach(response.region_data, function (value,index) {
                        vm.region_data[index].id = vm.region_data_id-index+1;
                    });
                    vm.region_data_id = vm.region_data[vm.region_data.length-1].id;
                    vm.pagination.previous_start_index= response.region_data[response.region_data.length - 1].regionid;
                    vm.pagination.next_start_index = response.region_data[0].regionid;
                    vm.pagination.maxid = response.maxid;
                    if (vm.region_data.length < 50) {
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
                alert('已经到最后一页！','','没有下一页');
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
            } else {
                analysisRegionService.readRecords(vm.selectRegion.id,vm.valid_begintime,vm.valid_endtime,vm.time_type,vm.pagination.pageSize,vm.pagination.next_start_index,vm.pagination.pagetype.next_page).then(function (response) {
                    vm.region_data = response.region_data;
                    angular.forEach(response.region_data, function (value,index) {
                        vm.region_data[index].id = vm.region_data_id+index+1;
                    });
                    vm.region_data_id = vm.park_data[vm.region_data.length-1].id;
                    vm.pagination.next_start_index = response.region_data[response.region_data.length - 1].regionid;
                    vm.pagination.previous_start_index = response.region_data[0].regionid;
                    vm.pagination.minid = response.minid;
                    if (vm.region_data.length < 50) {
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
            analysisRegionService.readRecords(vm.selectRegion.id,vm.valid_begintime,vm.valid_endtime,vm.time_type,vm.pagination.pageSize,vm.pagination.previous_start_index,vm.pagination.pagetype.pervious_page).then(function (response) {
                if (response.status === StatusCode.SUCCESS) {
                    vm.region_data = response.region_data;
                    angular.forEach(response.region_data, function (value,index) {
                        vm.region_data[index].id = index+1;
                    });
                    vm.region_data_id = vm.region_data[vm.region_data.length-1].id;
                    vm.pagination.next_start_index = response.region_data[response.region_data.length - 1].regionid;
                    vm.pagination.previous_start_index = response.region_data[0].regionid;
                    vm.pagination.maxid = response.maxid;
                    vm.pagination.pageNumber = 1;
                    // 如果记录少于20条，则灰掉所有翻页按钮
                    if (vm.region_data.length < 50) {
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
                    alert('数据库发生错误！',response.detail,'查找失败！');
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                } else {
                    alert('没有找到停车记录',response.detail,'没有停车记录');
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
            analysisRegionService.readRecords(vm.selectRegion.id,vm.valid_begintime,vm.valid_endtime,vm.time_type,vm.pagination.pageSize,vm.pagination.previous_start_index,vm.pagination.pagetype.pervious_page).then(function (response) {
                vm.region_data = response.region_data;
                angular.forEach(response.region_data, function (value,index) {
                    vm.region_data[index].id = vm.pagination.maxid -index+1;
                });
                vm.region_data_id = vm.region_data[vm.region_data.length-1].id;
                vm.pagination.minid = response.minid;
                vm.pagination.next_start_index = response.region_data[response.region_data.length - 1].regionid;
                vm.pagination.previous_start_index = response.region_data[0].regionid;
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
            vm.region_chart_time = [];
            vm.region_chart_reg_num =[];
            vm.region_chart_reg_sum = [];
            vm.region_chart_plsl_num = [];
            vm.display = true;
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
-            analysisRegionService.readRecords(vm.selectRegion.id,vm.valid_begintime,vm.valid_endtime,vm.time_type,vm.pagination.pageSize,vm.pagination.previous_start_index,vm.pagination.pagetype.pervious_page).then(function (response) {
                if (response.status === StatusCode.SUCCESS) {
                    vm.region_data = response.region_data;
                    angular.forEach(response.region_data, function (value,index) {
                        vm.region_data[index].id = index+1;
                        vm.region_chart_time[index] = vm.region_data[index].time;
                        vm.region_chart_reg_num[index] =vm.region_data[index].reg_num;
                        vm.region_chart_reg_sum[index] =vm.region_data[index].reg_sum/100;
                        vm.region_chart_plsl_num[index] =vm.region_data[index].plsl_num;
                        vm.region_chart_park_sum[index] =vm.region_data[index].park_sum;
                    });
                    vm.showRegionChart();
                    vm.pagination.next_start_index = response.region_data[response.region_data.length - 1].regionid;
                    vm.pagination.previous_start_index = response.region_data[0].regionid;
                    vm.pagination.maxid = response.maxid;
                    if (vm.region_data.length < 50) {
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
                    alert('没有找到区域记录',response.detail,'没有找到区域记录');
                } else {
                    alert('没有找到区域记录',response.detail,'数据库错误');
                }
            });
        };
        /*清除查找条件*/
        vm.clearAndRefresh = function () {
            vm.eventResult.model = undefined;
            vm.regiongAsync.selected = undefined;
            vm.selectRegion.id = undefined;
            vm.loadFistPage();
            vm.display = false;
            vm.vehicleIn = false;
            vm.valid_begintime = '';
            vm.valid_endtime = '';
            vm.time_type = '';
        };

        //    图标展示区域
        vm.showRegionChart = function () {
            $('#regionChart').highcharts({
                chart: {
                    type: 'column'
                },
                title: {
                    text: vm.selectRegion.name
                },
                xAxis: {
                    categories: vm.region_chart_time,
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
                    data: vm.region_chart_park_sum
                },{
                    name: '消费次数',
                    data: vm.region_chart_reg_num
                }, {
                    name: '消费金额',
                    data: vm.region_chart_reg_sum
                }, {
                    name: '故障次数',
                    data: vm.region_chart_plsl_num
                }]
            });
        };
    }
})();