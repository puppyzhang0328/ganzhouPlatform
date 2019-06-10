(function() {
    'use strict';
    angular
        .module('app.utils')
        .directive('sexbar', sexbar);
    sexbar.$inject = [];
    function sexbar() {
        return {
            scope: {
                id: "@",
                legend: "=",
                //item: "=",
                data: "="
            },
            restrict: 'E',
            template: '<div></div>',
            replace: true,
            link: function($scope, element, attrs, controller) {
                var a = [];
                var option = {
                    tooltip: {
                        show: true,
                        formatter: "{b} : {c} ({d}%)"
                    },
                    // 数据内容数组
                    series: [
                        {
                            name:'',
                            type: 'pie',
                            radius :[50, 100],
                            center:['45%','60%'],
                            roseType : 'radius',
                            label: {
                                normal: {
                                    show: true
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            labelLine: {
                                normal: {
                                    show: true
                                },
                                emphasis: {
                                    show: true
                                }
                            },
                            data:$scope.data,
                            itemStyle : {
                                normal: {
                                    label: {
                                        show: false
                                    },
                                    labelLine: {
                                        show: false
                                    }
                                } ,
                                emphasis: {
                                    label: {
                                        show: true,
                                        position: 'outer'
                                    },
                                    labelLine: {
                                        show: true,
                                        lineStyle: {
                                            color: 'red'
                                        },
                                    },
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
