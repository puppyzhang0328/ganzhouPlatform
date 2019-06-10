(function() {
    'use strict';
    angular
        .module('app.utils')
        .directive('linecharts', linecharts);
    linecharts.$inject = [];
    function linecharts() {
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
                    tooltip: {
                        show: true,
                        formatter: "{b} : {c}"
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['0:00:00', '1:00:00', '2:00:00', '3:00:00', '4:00:00', '5:00:00', '6:00:00','7:00:00','8:00:00','9:00:00','10:00:00','11:00:00','12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00', '18:00:00','19:00:00','20:00:00','21:00:00','22:00:00','23:00:00']
                    },
                    yAxis: {
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}'
                        }
                    },
                    series: [{
                        data: $scope.data,
                        type: 'line',
                        center: ['50%','50%'],
                        areaStyle: {
                            normal:{color:"#c6f2e4"}
                        },
                        itemStyle:{
                            normal:{color:'#71dfbc'}
                        }
                    }]
                };
                var myChart = echarts.init(document.getElementById($scope.id),'macarons');
                myChart.setOption(option);
            }
        };
    }

})();
