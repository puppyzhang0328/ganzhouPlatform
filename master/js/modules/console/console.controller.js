/**
 * craete by yumaotao 2017/11/18 0022
 *
 * */
(function () {
    angular.module('app.console')
        .controller('ConsoleController',ConsoleController);
    ConsoleController.$inject = ["ConsoleService",'ManageParkingService','analysisRegionService','analysisBusTypeService','analysisUserService','$scope'];
    'use strict';
    function ConsoleController(ConsoleService,ManageParkingService,analysisRegionService,analysisBusTypeService,analysisUserService,$scope) {
        $scope.legend = ["男", "女"];
        $scope.data = [
            {value:78, name:'男'},{value:56,name:'女'} //Berlin
        ];
        var vm = this;
        vm.all_region = [];
        vm.parkAsync = [];
        var allParks = [];
        vm.bustype_chart_time = [];
        vm.bustype_chart_bustype_num =[];
        vm.bustype_chart_bustype_sum = [];
        vm.bustype_chart_plsl_num = [];
        vm.bustype_chart_park_sum = [];
        vm.add_user = [];
        vm.pay_num =[];
        vm.pay_sum = [];
        vm.recharge_num = [];
        vm.recharge_sum = [];
        vm.active_user = [];
        vm.userAccountTime = [];
        vm.pieRegionChart = pieRegionChart;//查询区域
        vm.columnBusinessChart = columnBusinessChart;
        vm.pieRegionChart();
        vm.columnBusinessChart();
        vm.queryUserAccount = queryUserAccount;//用户信息查询统计
        vm.getNowFormatDate = getNowFormatDate;//查询当前日期
        vm.nowTime = vm.getNowFormatDate();
        vm.queryParkingState = queryParkingState;
        vm.queryParkingState('','2017-01-01',vm.nowTime,'month');
        vm.queryUserAccount('2017-01-01',vm.nowTime,'month',10,-1,'');
        /*选择停车场-------------------------------------------------*/
        ManageParkingService.queryParking().then(function (response) {
            vm.parkAsync = response.parking_lots;
            angular.forEach(response.parking_lots, function (value) {
                allParks.push(value.id);
            });
        });
        vm.onSelectCallback = function (item) {
            vm.eventResult = {model: item};
            vm.selectPark.id = vm.eventResult.model.id;
            var timetwo = setInterval(function () {
                vm.queryParking(vm.selectPark.id);
            }, 1000);
        };
        vm.selectPark = {
            id: undefined
        };
        Highcharts.setOptions({
            chart: {
                plotBackgroundColor: 'rgba(255, 255, 255, .9)',
                plotShadow: true,
                plotBorderWidth: 1
            },
            global: {
                useUTC: false
            }
        });
        function pieRegionChart() {
            analysisRegionService.readRecords('','','','','','','').then(function (response) {
                vm.region_data = response.region_data;
                vm.region_park_num = 0;
                angular.forEach(response.region_data, function (value,index) {
                    vm.region_park_num = vm.region_park_num + vm.region_data[index].park_sum;
                });
                angular.forEach(response.region_data, function (value,index) {
                    vm.pie_region = [];
                    vm.pie_region[0] =vm.region_data[index].regionname+"："+vm.region_data[index].park_sum+"个";
                    vm.pie_region[1] =vm.region_data[index].park_sum/vm.region_park_num;
                    vm.all_region[index] =vm.pie_region;
                });
                $('#con-pie').highcharts({
                    chart: {
                        type: 'pie',
                        options3d: {
                            enabled: true,
                            alpha: 45,
                            beta: 0
                        }
                    },
                    title: {
                        text: null
                    },
                    tooltip: {
                        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                    },
                    plotOptions: {
                        pie: {
                            allowPointSelect: true,
                            cursor: 'pointer',
                            depth: 35,
                            dataLabels: {
                                enabled: true,
                                format: '{point.name}'
                            }
                        }
                    },
                    series: [{
                        type: 'pie',
                        name: '区域占比',
                        data:  vm.all_region
                    }]
                });
            });

        }
        //实时帅新数据
        function activeLastPointToolip(chart) {
            var points = chart.series[0].points;
            chart.tooltip.refresh(points[points.length -1]);
        }
        $('#container4').highcharts({
            chart: {
                type: 'spline',
                animation: Highcharts.svg, // don't animate in old IE
                marginRight: 10,
                events: {
                    load: function () {
                        var series = this.series[0],
                            chart = this;
                        setInterval(function () {
                            var x = (new Date()).getTime(), // current
                                y = vm.parking;
                            series.addPoint([x, y], true, true);
                            activeLastPointToolip(chart)
                        }, 5000);
                    }
                }
            },
            title: {
                text: null
            },
            xAxis: {
                type: 'datetime',
                tickPixelInterval: 150
            },
            yAxis: {
                title: {
                    text: null
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                formatter: function () {
                    return '<b>' + this.series.name + '</b><br/>' +
                        Highcharts.dateFormat('%Y-%m-%d %H:%M:%S', this.x) + '<br/>' +
                        Highcharts.numberFormat(this.y, 2);
                }
            },
            legend: {
                enabled: false
            },
            exporting: {
                enabled: false
            },
            series: [{
                name: '剩余车位数',
                data: (function () {
                    var data = [],
                        time = (new Date()).getTime(),
                        i;
                    for (i = -19; i <= 0; i += 1) {
                        data.push({
                            x: time + i * 1000,
                            y: vm.parking
                        });
                    }
                    return data;
                }())
            }]
        }, function(c) {
            activeLastPointToolip(c)
        });
        // 查询停车场剩余车位数
        vm.queryParking = queryParking;
        function queryParking(parkId) {
            ConsoleService.queryParking(parkId).then(function (response) {
                vm.parking = response.parking_lots[0].parking_space_available;
            });
        }

        function queryParkingState(parkid,statime,endtime,time_type) {
            ConsoleService.queryConsole(parkid,statime,endtime,time_type).then(function (response) {
                vm.parkingStateData = response;
                vm.day_money_sum = vm.parkingStateData.day_money_sum/100;
            });
        }
        function queryUserAccount(statime,endtime,time_type,max_results,start_index,pagedirect) {
            analysisUserService.readRecords(statime,endtime,time_type,max_results,start_index,pagedirect).then(function (response) {
                angular.forEach(response.user_data, function (value,index) {
                    vm.add_user[index] = value.add_user;
                    vm.pay_num[index] =value.pay_num;
                    vm.pay_sum[index] = Math.abs(value.pay_sum)/100;
                    vm.recharge_num[index] = value.recharge_num;
                    vm.recharge_sum[index] = Math.abs(value.recharge_sum)/100;
                    vm.active_user[index] = value.active_user;
                });
                $('#container3').highcharts({
                    title: {
                        text: null,
                    },
                    yAxis: {
                        title: {
                            text: '人/人/次/元/次/元'
                        }
                    },
                    height:300,
                    width:240,
                    legend: {
                        align: 'center', //水平方向位置
                        verticalAlign: 'bottom', //垂直方向位置
                        x: 0, //距离x轴的距离
                        y: 0 //距离Y轴的距离
                    },
                    plotOptions: {
                        series: {
                            label: {
                                connectorAllowed: false
                            },
                            pointStart: 1
                        }
                    },
                    series: [{
                        name: '新增用户',
                        data: vm.add_user
                    }, {
                        name: '活跃用户',
                        data: vm.active_user
                    }, {
                        name: '充值金额',
                        data: vm.recharge_sum
                    },{
                        name: '消费金额',
                        data: vm.pay_sum
                    }],
                    responsive: {
                        rules: [{
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                legend: {
                                    layout: 'horizontal',
                                    align: 'center',
                                    verticalAlign: 'bottom'
                                }
                            }
                        }]
                    }
                });
            });
        }
        function getNowFormatDate() {
            var date = new Date();
            var seperator1 = "-";
            var year = date.getFullYear();
            var month = date.getMonth() + 1;
            var strDate = date.getDate();
            if (month >= 1 && month <= 9) {
                month = "0" + month;
            }
            if (strDate >= 0 && strDate <= 9) {
                strDate = "0" + strDate;
            }
            var currentdate = year + seperator1 + month + seperator1 + strDate;
            return currentdate;
        }
        function columnBusinessChart() {
            analysisBusTypeService.readRecords('','','','','','','').then(function (response) {
                vm.busines_data = response.busines_data;
                angular.forEach(response.busines_data, function (value,index) {
                    vm.busines_data[index].id = index+1;
                    vm.bustype_chart_time[index] = vm.busines_data[index].businesname;
                    vm.bustype_chart_bustype_num[index] =vm.busines_data[index].busines_num;
                    vm.bustype_chart_bustype_sum[index] =vm.busines_data[index].busines_sum;
                    vm.bustype_chart_plsl_num[index] =vm.busines_data[index].plsl_num;
                    vm.bustype_chart_park_sum[index] =vm.busines_data[index].park_sum;
                });
                $('#busTypeChart').highcharts({
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: null
                    },
                    xAxis: {
                        categories: vm.bustype_chart_time,
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
                        data: vm.bustype_chart_park_sum
                    }, {
                        name: '消费金额',
                        data: vm.bustype_chart_bustype_num
                    }, {
                        name: '消费金额',
                        data: vm.bustype_chart_bustype_sum
                    },{
                        name: '故障次数',
                        data: vm.bustype_chart_plsl_num
                    }]
                });
            });
        }

    }
})();