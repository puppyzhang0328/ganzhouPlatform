(function() {
    'use strict';
    angular
        .module('app.utils')
        .directive('axischarts', axischarts);
    axischarts.$inject = [];
    function axischarts() {
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
                    tooltip : {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            label: {
                                backgroundColor: '#6a7985'
                            }
                        }
                    },
                    legend: {
                        data:['新增用户','活跃用户','临时停车用户'],
                        y: 'bottom'
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '7%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            boundaryGap : false,
                            data : ['1日','3日','6日','9日','12日','15日','18日','21日','24日','27日','30日']
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        {
                            name:'新增用户',
                            type:'line',
                            stack: '总量',
                            areaStyle: {normal: {}},
                            data:[585, 455, 123, 444, 236, 578, 160,452,157,467,352]
                        },
                        {
                            name:'活跃用户',
                            type:'line',
                            stack: '总量',
                            areaStyle: {normal: {}},
                            data:[585, 455, 123, 444, 236, 578, 160,452,157,467,352]
                        },
                        {
                            name:'临时停车用户',
                            type:'line',
                            stack: '总量',
                            areaStyle: {normal: {}},
                            data:[1585,3455,2123,1444,2236,1578,3160,5452,1157,3467,2352]
                        }
                    ]
                };

                myChart.setOption(option);
                $scope.$watch('data',function(newValue, oldValue, scope){
                    var data = $scope.data;$scope.active_user = [];$scope.add_user =[];$scope.user_all = [];$scope.time = [];
                    angular.forEach(data, function (value,index) {
                        $scope.active_user.push(value.active_user);
                        $scope.add_user.push(value.add_user);
                        $scope.user_all.push(value.user_all);
                        $scope.time.push(value.time);
                    });
                    var option = {
                        tooltip : {
                            trigger: 'axis',
                            axisPointer: {
                                type: 'cross',
                                label: {
                                    backgroundColor: '#6a7985'
                                }
                            }
                        },
                        legend: {
                            data:['新增用户','活跃用户','临时停车用户'],
                            y: 'bottom'
                        },
                        grid: {
                            left: '3%',
                            right: '4%',
                            bottom: '7%',
                            containLabel: true
                        },
                        xAxis : [
                            {
                                type : 'category',
                                boundaryGap : false,
                                data : $scope.time
                            }
                        ],
                        yAxis : [
                            {
                                type : 'value'
                            }
                        ],
                        series : [
                            {
                                name:'新增用户',
                                type:'line',
                                stack: '总量',
                                areaStyle: {normal: {}},
                                data:$scope.add_user
                            },
                            {
                                name:'活跃用户',
                                type:'line',
                                stack: '总量',
                                areaStyle: {normal: {}},
                                data:$scope.active_user
                            },
                            {
                                name:'临时停车用户',
                                type:'line',
                                stack: '总量',
                                areaStyle: {normal: {}},
                                data:$scope.temporary_user
                            }
                        ]
                    };
                    myChart.setOption(option);
                }, true);
            }
        };
    }
})();
