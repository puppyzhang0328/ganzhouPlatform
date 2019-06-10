(function() {
    'use strict';
    angular
        .module('app.utils')
        .directive('piecharts', piecharts);
    piecharts.$inject = [];
    function piecharts() {
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
                        trigger: 'item',
                        formatter: "{b}: {c} ({d}%)"
                    },
                    series: [
                        {
                            type:'pie',
                            radius: [25, 55],
                            center:['45%','60%'],
                            label: {
                                normal: {
                                    formatter: '{b|{b}}',
                                    rich: {
                                        a: {
                                            color: '#999',
                                            lineHeight: 18,
                                            align: 'center'
                                        },
                                        hr: {
                                            borderColor: '#aaa',
                                            width: '100%',
                                            borderWidth: 0.5,
                                            height: 0
                                        },
                                        b: {
                                            fontSize: 12,
                                            lineHeight: 18
                                        },
                                        per: {
                                            color: '#eee',
                                            backgroundColor: '#334455',
                                            padding: [2, 4],
                                            borderRadius: 2
                                        }
                                    }
                                }
                            },
                            data:$scope.data
                        }
                    ]
                };
                var myChart = echarts.init(document.getElementById($scope.id),'macarons');
                myChart.setOption(option);
            }
        };
    }
})();
