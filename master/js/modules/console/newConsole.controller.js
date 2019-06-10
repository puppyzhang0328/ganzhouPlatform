(function () {
    angular.module('app.console')
        .controller('newConsoleController',newConsoleController);
    newConsoleController.$inject = ['$scope','ConsoleService'];
    'use strict';
    function newConsoleController($scope,ConsoleService) {
        $scope.data = [
            {value:74, name:'芙蓉分局'},
            {value:72, name:'开福分局'},
            {value:62, name:'天心分局'},
            {value:69, name:'雨花分局'},
            {value:93, name:'岳麓分局'}
        ];
        $scope.LinedataNew = [
            {value:'2:00:00', name:3455},
            {value:'4:00:00', name:3455},
            {value:'6:00:00', name:2123},
            {value:'8:00:00', name:1444},
            {value:'10:00:00', name:2236},
            {value:'12:00:00', name:1578},
            {value:'14:00:00', name:3160},
            {value:'16:00:00', name:5452},
            {value:'18:00:00', name:1157},
            {value:'20:00:00', name:3467},
            {value:'22:00:00', name:2352},
            {value:'24:00:00', name:2625}
        ];
        $scope.Linedata = [151692, 154207, 154379, 154321, 154264, 154093, 151692,143690,121514,49612,94651,197646,200618,129516,114655,136603,183871,221765,185929,146091,159980,215135,171525,156265,151692];
        $scope.radarData = [
            {value:11061, name:'雨花区'},
            {value:10368, name:'芙蓉区'},
            {value:9904, name:'岳麓区'},
            {value:9719, name:'天心区'},
            {value:7342, name:'开福区'}
            ];
        $scope.pieData = [
            {value:4, name:'观览建筑'},
            {value:38, name:'行政办公建筑'},
            {value:19, name:'交通建筑'},
            {value:269, name:'居住建筑'},
            {value:6, name:'科研建筑'},
            {value:8, name:'路边泊位'},
            {value:53, name:'旅馆建筑'},
            {value:158, name:'商业建筑'},
            {value:2, name:'体育建筑'},
            {value:10, name:'文教建筑'},
            {value:16, name:'医疗建筑'},
            {value:6, name:'园林建筑'}
        ];
        $scope.categoryData = [
            {value:136, name:'雨花区'},
            {value:117, name:'芙蓉区'},
            {value:119, name:'岳麓区'},
            {value:116, name:'天心区'},
            {value:81, name:'开福区'},
            {value:4, name:'望城区'},
            {value:9, name:'长沙县'},
            {value:1, name:'浏阳市'},
            {value:3, name:'宁乡县'}
        ];
        $scope.axisData = [
            {id:'3月1日',value:585, name:1585},
            {id:'3月3日',value:455, name:3455},
            {id:'3月6日',value:123, name:2123},
            {id:'3月9日',value:444, name:1444},
            {id:'3月12日',value:236, name:2236},
            {id:'3月15日',value:578, name:1578},
            {id:'3月18日',value:160, name:3160},
            {id:'3月21日',value:452, name:5452},
            {id:'3月24日',value:157, name:1157},
            {id:'3月27日',value:467, name:3467},
            {id:'3月30日',value:352, name:2352}
        ];
        $scope.radarName= $scope.radarData[0].name;
        $scope.radarValue= $scope.radarData[0].value;
        $scope.x = $scope.Linedata.x;
        $scope.y = $scope.Linedata.y;
        var vm = this;
        vm.queryConsoleCount = queryConsoleCount;
        vm.queryConsoleCount();
        //查询头部统计
        vm.otherRegion =0;
        function queryConsoleCount() {
            ConsoleService.queryConsoleCount().then(function (response) {
                vm.consoleCount = response;
                vm.should_sum = vm.consoleCount.day_sum/100;
                vm.plsl_num = parseInt(vm.consoleCount.plsl_num/1000);
                vm.region_park_sum = response.region_park_sum;
                angular.forEach(response.region_park_sum, function (value,index) {
                    switch(value.region_name)
                    {
                        case '芙蓉区':
                            vm.region_one = 209;
                            vm.region_one_no = value.parklot_sum-vm.region_one;
                            break;
                        case '开福区':
                            vm.region_two =103;
                            vm.region_two_no =  value.parklot_sum-vm.region_two;
                            break;
                        case '天心区':
                            vm.region_thr =152;
                            vm.region_thr_no = 319 -  vm.region_thr;
                            break;
                        case '雨花区':
                            vm.region_fou =288;
                            vm.region_fou_no =value.parklot_sum-vm.region_fou;
                            break;
                        case '岳麓区':
                            vm.region_fif =134;
                            vm.region_fif_no =value.parklot_sum-vm.region_fif;
                            break;
                        default:
                            // vm.otherRegion = vm.otherRegion+value.parklot_sum;
                            vm.otherRegion = 172;
                    }
                });
                vm.otherRegion_no = 1842 - vm.otherRegion;
                vm.region_one_pro = (vm.region_one/389)*100;
                vm.region_two_pro = (vm.region_two/254)*100;
                vm.region_thr_pro = (vm.region_thr/319)*100;
                vm.region_fou_pro = (vm.region_fou/474)*100;
                vm.region_fif_pro = (vm.region_fif/406)*100;
                vm.otherRegion_pro = (vm.otherRegion/1842)*100;
                vm.regionpiecharts1 = {
                    value:vm.region_one_pro,//百分比,必填
                    name:'芙蓉区',//必填
                    title:'',
                    color:['#e54b4d','#f7c9c9'],
                    fontSize:16
                };
                vm.regionpiecharts2 = {
                    value:vm.region_two_pro,//百分比,必填
                    name:'开福区',//必填
                    title:'',
                    color:['#cb5b41','#efcdc6'],
                    fontSize:16
                };
                vm.regionpiecharts3 = {
                    value:vm.region_thr_pro,//百分比,必填
                    name:'天心区',//必填
                    title:'',
                    color:['#ae9946','#e7e0c7'],
                    fontSize:16
                };
                vm.regionpiecharts4 = {
                    value:vm.region_fou_pro,//百分比,必填
                    name:'雨花区',//必填
                    title:'',
                    color:['#53998e','#cbe0dd'],
                    fontSize:16
                };
                vm.regionpiecharts5 = {
                    value:vm.region_fif_pro,//百分比,必填
                    name:'岳麓区',//必填
                    title:'',
                    color:['#29d0ca','#bef1ef'],
                    fontSize:16
                };
                vm.regionpiecharts6 = {
                    value:vm.otherRegion_pro,//百分比,必填
                    name:'其他区域',//必填
                    title:'',
                    color:['#0181c8','#b2d9ee'],
                    fontSize:16
                };
            });
        }
        vm.regionpiecharts1 = {
            value:vm.region_one_pro,//百分比,必填
            name:'芙蓉区',//必填
            title:'',
            color:['#e54b4d','#f7c9c9'],
            fontSize:16
        };
        vm.regionpiecharts2 = {
            value:vm.region_two_pro,//百分比,必填
            name:'开福区',//必填
            title:'',
            color:['#cb5b41','#efcdc6'],
            fontSize:16
        };
        vm.regionpiecharts3 = {
            value:vm.region_thr_pro,//百分比,必填
            name:'天心区',//必填
            title:'',
            color:['#ae9946','#e7e0c7'],
            fontSize:16
        };
        vm.regionpiecharts4 = {
            value:vm.region_fou_pro,//百分比,必填
            name:'雨花区',//必填
            title:'',
            color:['#53998e','#cbe0dd'],
            fontSize:16
        };
        vm.regionpiecharts5 = {
            value:vm.region_fif_pro,//百分比,必填
            name:'岳麓区',//必填
            title:'',
            color:['#29d0ca','#bef1ef'],
            fontSize:16
        };
        vm.regionpiecharts6 = {
            value:vm.otherRegion_pro,//百分比,必填
            name:'其他区域',//必填
            title:'',
            color:['#0181c8','#b2d9ee'],
            fontSize:16
        };
        //区域消费查询
        vm.nowYear = new Date().getFullYear();
        vm.nowMoth = new Date().getMonth()+1;
        vm.nowDay = new Date().getDate();
        vm.doyear = doyear;
        vm.doyear();
        function doyear() {
            vm.year = [];
            var thisYear = new Date().getFullYear();
            for(var i = 2010;i<=thisYear;i++){
                vm.year.push(i);
            }
        }
        vm.domoth = domoth;
        vm.domoth();
        function domoth() {
            vm.moth = [];
            for(var i = 1;i<=12;i++){
                vm.moth.push(i);
            }
        }
        vm.doday = doday;
        vm.doday();
        vm.queryRegionPay = queryRegionPay;
        vm.queryRegionPay();
        function doday() {
            vm.day = [];
            var date = new Date(vm.nowYear,vm.nowMoth,0);
            for(var i=1;i<=date.getDate();i++){
               vm.day.push(i);
            }
        }

        function queryRegionPay() {
            vm.regionPayName =[];
            vm.regionPayValue = [];
            if(vm.nowYear && vm.nowMoth && vm.nowDay) {
                var startime = vm.nowYear + '-' + vm.nowMoth + '-' + vm.nowDay;
                ConsoleService.queryRegionPay(startime).then(function (response) {
                    vm.regionPay = response.data;
                    angular.forEach(response.data, function (value,index) {
                        vm.regionPayName.push(value.region_name);
                        vm.regionPayValue.push(value.pay_sum);
                    });

                });
            }
        }
        //用户增长
        vm.userDayYear = userDayYear;
        vm.userDayMonth = userDayMonth;
        vm.userNowYear = new Date().getFullYear();
        vm.userNowMoth = new Date().getMonth()+1;
        vm.queryUserStatistics = queryUserStatistics;
        vm.queryUserStatistics();
        vm.userDayYear();
        vm.userDayMonth();
        function userDayYear() {
            vm.userYear = [];
            var thisYear = new Date().getFullYear();
            for(var i = 2010;i<=thisYear;i++){
                vm.userYear.push(i);
            }
        }
        function userDayMonth() {
            vm.userMoth = [];
            for(var i = 1;i<=12;i++){
                vm.userMoth.push(i);
            }
        }
        function queryUserStatistics() {
            var date = new Date(vm.userNowYear,vm.userNowMoth,0).getDate();
            if(vm.userNowYear && vm.userNowMoth) {
                var startime = vm.userNowYear + '-' + vm.userNowMoth+'-1';
                var endtime = vm.userNowYear + '-' + vm.userNowMoth+'-'+date;
                ConsoleService.queryUserStatistics(startime,endtime).then(function (response) {
                    vm.userStatistics = response.user_data;
                });
            }
        }
    }
})();