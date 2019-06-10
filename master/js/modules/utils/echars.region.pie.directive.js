(function() {
    'use strict';
    angular
        .module('app.utils')
        .directive('regionpiecharts', regionpiecharts);
    regionpiecharts.$inject = [];
    function regionpiecharts() {
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
                    backgroundColor:null,
                    color:$scope.data.color,
                    title: {
                        text: '',
                        top:'3%',
                        left:'1%',
                        textStyle:{
                            color: '#333',
                            fontStyle: 'normal',
                            fontWeight: 'normal',
                            fontFamily: 'sans-serif',
                            fontSize: 16
                        }
                    },
                    series: [{
                        name: '来源',
                        type: 'pie',
                        radius: ['60%', '85%'],
                        avoidLabelOverlap: false,
                        hoverAnimation:false,
                        label: {
                            normal: {
                                show: false,
                                position: 'center',
                                textStyle: {
                                    fontSize: $scope.data.fontSize,
                                    fontWeight: 'bold',
                                    color: '#333'
                                }
                                // formatter:'{b}\n{c}%'
                            }
                        },
                        data:[{
                            value: $scope.data.value,
                            name: $scope.data.name,
                            label:{
                                normal:{
                                    show:true
                                }
                            }
                            },
                            {
                                value:100-$scope.data.value,
                                name: ''
                            }
                        ]
                    }]
                };
                myChart.setOption(option);
                $scope.$watch('data',function(newValue, oldValue, scope){
                    var option = {
                        backgroundColor:null,
                        color:$scope.data.color,
                        title: {
                            text: '',
                            top:'3%',
                            left:'1%',
                            textStyle:{
                                color: '#333',
                                fontStyle: 'normal',
                                fontWeight: 'normal',
                                fontFamily: 'sans-serif',
                                fontSize: 16
                            }
                        },
                        series: [{
                            name: '来源',
                            type: 'pie',
                            radius: ['60%', '85%'],
                            avoidLabelOverlap: false,
                            hoverAnimation:false,
                            label: {
                                normal: {
                                    show: false,
                                    position: 'center',
                                    textStyle: {
                                        fontSize: $scope.data.fontSize,
                                        fontWeight: 'bold',
                                        color: '#333'
                                    }
                                    // formatter:'{b}\n{c}%'
                                }
                            },
                            data:[{
                                value: $scope.data.value,
                                name: $scope.data.name,
                                label:{
                                    normal:{
                                        show:true
                                    }
                                }
                            },
                                {
                                    value:100-$scope.data.value,
                                    name: ''
                                }
                            ]
                        }]
                    };
                    myChart.setOption(option);
                }, true);;
            }
        };
    }

})();
