(function() {
    'use strict';
    angular
        .module('app.utils')
        .directive('twocatcharts', twocatcharts);
    twocatcharts.$inject = [];
    function twocatcharts() {
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
                    color: ['#e54b4d', '#0181c8'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        }
                    },
                    legend: {
                        data:['公用停车场','专用停车场'],
                        x: 'center', // 'center' | 'left' | {number},
                        y: 'top',
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis:  {
                        type: 'category',
                        data: ['芙蓉区','开福区','天心区','雨花区','岳麓区','其他区域']
                    },
                    yAxis: {
                        type: 'value',
                    },
                    series: [
                        {
                            name:'公用停车场',
                            type:'bar',
                            data:[144, 140, 100, 159, 136,136]
                        },
                        {
                            name:'专用停车场',
                            type:'bar',
                            data:[245, 114, 210, 315, 270,270]
                        }
                    ]
                };
                var myChart = echarts.init(document.getElementById($scope.id),'macarons');
                myChart.setOption(option);
            }
        };
    }
})();
