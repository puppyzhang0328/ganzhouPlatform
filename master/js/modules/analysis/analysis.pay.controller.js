(function () {
    angular.module('app.analysis')
        .controller('analysisPayController', analysisPayController);
    analysisPayController.$inject = ['ManageParkingService', 'analysisPayService','$scope','StatusCode','$document','logger','DTColumnDefBuilder', 'datatablesOptions'];
    'use strict';
    function analysisPayController(ManageParkingService, analysisPayService,$scope,StatusCode,$document,logger,DTColumnDefBuilder, datatablesOptions) {
        var vm = this;
        vm.park_chart_time = [];
        vm.park_chart_park_num =[];
        vm.park_chart_park_sum = [];
        vm.park_chart_plsl_num = [];
        vm.queryBaiDuMapParking = queryBaiDuMapParking;
        vm.queryBaiDuMapParking();
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
            ManageParkingService.querySearchBaiDuMapParking(start_index).then(function (response) {
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
            vm.seletPark.id = vm.eventResult.model.id;
            vm.seletPark.name = vm.eventResult.model.name;
        };
        vm.seletPark = {
            id: undefined
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
            valid_begintime:'',
            valid_endtime:''
        };
        vm.parking={
            time_type:''
        };
        vm.valid_begintime='';
        vm.valid_endtime='';
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
                analysisPayService.readRecords(vm.seletPark.id,vm.valid_begintime,vm.valid_endtime,vm.parking.time_type,vm.pagination.pageSize,vm.pagination.previous_start_index,vm.pagination.pagetype.pervious_page).then(function (response) {
                    vm.park_data = response.park_data;
                    angular.forEach(response.park_data, function (value,index) {
                        vm.park_data[index].id = vm.park_data_id-index+1;
                    });
                    vm.park_data_id = vm.park_data[vm.park_data.length-1].id;
                    vm.pagination.previous_start_index = response.park_data[response.park_data.length - 1].parkid;
                     vm.pagination.next_start_index  = response.park_data[0].parkid;
                    vm.pagination.maxid = response.maxid;
                    vm.park_data=vm.park_data.reverse()
                    if (vm.park_data.length < 50) {
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
                analysisPayService.readRecords(vm.seletPark.id,vm.valid_begintime,vm.valid_endtime,vm.parking.time_type,vm.pagination.pageSize, vm.pagination.next_start_index ,vm.pagination.pagetype.next_page).then(function (response) {
                    vm.park_data = response.park_data;
                    angular.forEach(response.park_data, function (value,index) {
                        vm.park_data[index].id = vm.park_data_id+index+1;
                    });
                    vm.park_data_id = vm.park_data[vm.park_data.length-1].id;
                    vm.pagination.next_start_index = response.park_data[response.park_data.length - 1].parkid;
                    vm.pagination.previous_start_index = response.park_data[0].parkid;
                    vm.pagination.minid = response.minid;
                    if (vm.park_data.length < 50) {
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
            vm.pagination.previous_start_index = 0;
            vm.pagination.pagetype.pervious_page = '';
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            analysisPayService.readRecords(vm.seletPark.id,vm.valid_begintime,vm.valid_endtime,vm.parking.time_type,vm.pagination.pageSize,0,vm.pagination.pagetype.pervious_page).then(function (response) {
                if (response.status === StatusCode.SUCCESS) {
                    vm.park_data = response.park_data;
                    angular.forEach(response.park_data, function (value,index) {
                        vm.park_data[index].id = index+1;
                    });
                    vm.park_data_id = vm.park_data[vm.park_data.length-1].id;
                    vm.pagination.next_start_index = response.park_data[response.park_data.length - 1].parkid;
                    vm.pagination.previous_start_index = response.park_data[0].parkid;
                    vm.pagination.maxid = response.maxid;
                    vm.pagination.pageNumber = 1;
                    // 如果记录少于20条，则灰掉所有翻页按钮
                    if (vm.park_data.length < 50) {
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
            vm.pagination.now_start_index = -1;
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            analysisPayService.readRecords(vm.seletPark.id,vm.valid_begintime,vm.valid_endtime,vm.parking.time_type,vm.pagination.pageSize,-1,vm.pagination.pagetype.pervious_page).then(function (response) {
                vm.park_data = response.park_data;
                angular.forEach(response.park_data, function (value,index) {
                    vm.park_data[index].id = vm.pagination.maxid -index+1;
                });
                vm.park_data_id = vm.park_data[vm.park_data.length-1].id;
                vm.pagination.minid = response.minid;
                 vm.pagination.previous_start_index = response.park_data[response.park_data.length - 1].parkid;
                vm.pagination.next_start_index = response.park_data[0].parkid;
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
            vm.pagination.next_start_index = 0
            vm.park_chart_time = [];
            vm.park_chart_park_num =[];
            vm.park_chart_park_sum = [];
            vm.park_chart_plsl_num = [];
            vm.display = true;
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
-            analysisPayService.readRecords(vm.seletPark.id,vm.valid_begintime,vm.valid_endtime,vm.time_type,vm.pagination.pageSize,vm.pagination.previous_start_index,vm.pagination.pagetype.pervious_page).then(function (response) {
                if (response.status === 0) {
                    vm.park_data = response.park_data
                    angular.forEach(response.park_data, function (value,index) {
                        vm.park_data[index].id = index+1;
                        vm.park_chart_time[index] = vm.park_data[index].time;
                        vm.park_chart_park_num[index] =vm.park_data[index].park_num;
                        vm.park_chart_park_sum[index] =vm.park_data[index].park_sum/100;
                        vm.park_chart_plsl_num[index] =vm.park_data[index].plsl_num;
                    });
                    vm.showChart();
                    vm.pagination.next_start_index = response.park_data[response.park_data.length - 1].id;
                    vm.pagination.previous_start_index = response.park_data[0].id;
                    vm.pagination.maxid = response.maxid;
                    if (vm.park_data.length < 50) {
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
            vm.parkingAsync.selected = undefined;
            vm.seletPark.id = undefined;
            vm.loadFistPage();
            vm.display = false;
            vm.vehicleIn = false;
            vm.valid_begintime = '';
            vm.valid_endtime = '';
            vm.time_type = '';
        };
      vm.showChart = function () {
          $('#parkchart').highcharts({
              chart: {
                  type: 'column'
              },
              title: {
                  text: vm.seletPark.name
              },
              xAxis: {
                  categories: vm.park_chart_time,
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
                  name: '消费次数',
                  data: vm.park_chart_park_num
              }, {
                  name: '消费金额',
                  data: vm.park_chart_park_sum
              }, {
                  name: '故障次数',
                  data: vm.park_chart_plsl_num
              }]
          });
      };
    }
})();