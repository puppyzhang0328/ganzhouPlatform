(function() {
    'use strict';
    angular
        .module('app.utils')
        .directive('radarcharts', radarcharts);
    radarcharts.$inject = [];
    function radarcharts() {
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
                var myChart = echarts.init(document.getElementById($scope.id),'macarons');
                var a = [];
                var option = {
                    tooltip: {
                        trigger: 'axis'
                    },
                    radar: [
                        {
                            indicator: [
                                {text: '雨花区', max: 12000},
                                {text: '芙蓉区', max: 12000},
                                {text: '岳麓区', max: 12000},
                                {text: '天心区', max: 12000},
                                {text: '开福区', max: 12000},
                                {text: '其他区', max: 12000}
                            ],
                            center: ['30%','50%'],
                            radius: 80
                        }
                    ],
                    series: [
                        {
                            type: 'radar',
                            tooltip: {
                                trigger: 'item'
                            },
                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                            data: [
                                {
                                    value: [11061,10368, 9904,9719, 7342,14962]
                                }
                            ]
                        },

                    ]
                };
                myChart.setOption(option);
                $scope.$watch('data',function(newValue, oldValue, scope){
                    var maxNum = Math.max.apply(null,$scope.data);
                    var option = {
                        tooltip: {
                            trigger: 'axis'
                        },
                        radar: [
                            {
                                indicator: [
                                    {text: '雨花区', max: maxNum},
                                    {text: '芙蓉区', max: maxNum},
                                    {text: '岳麓区', max: maxNum},
                                    {text: '天心区', max: maxNum},
                                    {text: '开福区', max: maxNum},
                                    {text: '其他区', max: maxNum}
                                ],
                                center: ['30%','50%'],
                                radius: 80
                            }
                        ],
                        series: [
                            {
                                type: 'radar',
                                tooltip: {
                                    trigger: 'item'
                                },
                                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                                data: [
                                    {
                                        value: $scope.data
                                    }
                                ]
                            },

                        ]
                    };
                    myChart.setOption(option);
                }, true);
            }
        };
    }
})();
