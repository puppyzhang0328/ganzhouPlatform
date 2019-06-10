(function() {
    'use strict';
    angular
        .module('app.utils')
        .directive('manylinecharts', manylinecharts);
    manylinecharts.$inject = [];
    function manylinecharts() {
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
                        trigger: 'axis'
                    },
                    legend: {
                        data:['芙蓉区','天心区','岳麓区','开福区','雨花区']
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: ['0:00:00', '1:00:00', '2:00:00', '3:00:00', '4:00:00', '5:00:00', '6:00:00','7:00:00','8:00:00','9:00:00','10:00:00','11:00:00','12:00:00', '13:00:00', '14:00:00', '15:00:00', '16:00:00', '17:00:00', '18:00:00','19:00:00','20:00:00','21:00:00','22:00:00','23:00:00']
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [
                        {
                            name:'芙蓉区',
                            type:'line',
                            data:[121, 29, 2, 105, 167, 1080, 2555,2643,3192,3613,3042,2762,3713,3889,4136,5148,2621,2174,1855,1653,636,324,121]
                        },
                        {
                            name:'天心区',
                            type:'line',
                            data:[134, 38, 3, 105, 117, 864, 3577,2115,2873,2891,3955,3315,4456,2723,4964,4634,2097,1305,1855,1984,700,227,134]
                        },
                        {
                            name:'岳麓区',
                            type:'line',
                            data:[170, 21, 2, 105, 134, 864, 3833,2908,4150,5420,1826,1934,3713,5445,4136,7722,3670,3261,2597,2480,700,422,170]
                        },
                        {
                            name:'开福区',
                            type:'line',
                            data:[85, 29, 3, 63, 151, 648, 3833,2115,3192,2168,3347,4143,3713,2334,6204,5148,3146,2392,1484,1653,954,195,85]
                        },
                        {
                            name:'雨花区',
                            type:'line',
                            data:[158, 24, 2, 137, 134, 1188, 3577,3436,3512,3613,4259,3315,4085,4278,3309,3604,3146,3044,2597,2315,764,292,158]
                        }
                    ]
                };
                var myChart = echarts.init(document.getElementById($scope.id),'macarons');
                myChart.setOption(option);
            }
        };
    }
})();
