(function() {
    'use strict';
    angular
        .module('app.utils')
        .directive('twobarcharts', twobarcharts);
    twobarcharts.$inject = [];
    function twobarcharts() {
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
                    title: {
                        text: '2018年'
                    },
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    legend: {
                        data:['APP用户','临时停车用户'],
                        y: 'bottom'
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: ['3月20日','21日','22日','23日','24日','25日','26日','27日','28日','29日','30日','31日','4月1日','2日'],
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value'
                        }
                    ],
                    series: [
                        {
                            name:'APP用户',
                            type:'bar',
                            data:[885, 565, 513, 851, 971, 698, 531,500,691,831,582,692,882,847]
                        },
                        {
                            name:'临时停车用户',
                            type:'bar',
                            data:[7771, 9234, 1885, 4958, 6747, 7414, 5903,2926,1175,2550,1013,3424,5326,6490]
                        }
                    ]
                };
                var myChart = echarts.init(document.getElementById($scope.id),'macarons');
                myChart.setOption(option);
            }
        };
    }
})();
