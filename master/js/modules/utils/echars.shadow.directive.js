(function() {
    'use strict';
    angular
        .module('app.utils')
        .directive('shadowcharts', shadowcharts);
    shadowcharts.$inject = [];
    function shadowcharts() {
        return {
            scope: {
                id: "@",
                legend: "=",
                //item: "=",
                data: "="
            },
            restrict: 'ECA',
            template: '<div></div>',
            replace: true,
            link: function($scope, element, attrs, controller) {
                var a = [];
                var option = {
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis:  {
                        type: 'value'
                    },
                    yAxis: {
                        type: 'category',
                        data: ['体育建筑','观览建筑','园林建筑','科研建筑','路边泊位','文教建筑','医疗建筑','交通建筑','行政办公建筑','旅馆建筑','商业建筑','居住建筑']
                    },
                    series: [
                        {
                            type: 'bar',
                            barMaxWidth: '100',
                            stack: '总量',
                            label: {
                                normal: {
                                    show: true,
                                    position: 'insideRight'
                                }
                            },
                            data: [2,4,6,6,8,10,16,19,38,53,158,269],
                            itemStyle: {
                                normal: {
                                    color: function(params) {
                                        // build a color map as your need.
                                        var colorList = [
                                            '#519faa','#7d8682','#ff766e','#c39008','#ffa578','#000','#088796','#8b0956','#443f3f','3305aa','#05d2eb','#9871ff'
                                        ];
                                        return colorList[params.dataIndex];
                                    }
                                }
                            }
                        }

                    ]
                };
                var myChart = echarts.init(document.getElementById($scope.id),'macarons');
                myChart.setOption(option);
            }
        };
    }
})();
