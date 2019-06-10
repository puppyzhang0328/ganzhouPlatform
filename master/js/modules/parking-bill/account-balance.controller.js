/**
 * account-balance.controller.js
 * @author: huangxiang
 * @create 2017-03-20 11:17
 * @description: 对账模块配置及初始化
 */
(function(){


    angular.module('app.bill')
        .controller('AccountBalanceController',AccountBalanceController);
    
    AccountBalanceController.$inject = ['OnlineBill','ManageParkingService','$scope','DTColumnDefBuilder','datatablesOptions','logger'];
    'use strict';
    function AccountBalanceController(OnlineBill,ManageParkingService,$scope,DTColumnDefBuilder,datatablesOptions,logger) {
        var vm = this;
        vm.queryAccountBalances = queryAccountBalances;
        moment.locale('zh-cn', {
            longDateFormat: {
                LT: 'HH:mm',
                LTS: 'HH:mm:ss',
                L: 'DD/MM/YYYY',
                LL: 'D MMMM YYYY',
                LLL: 'D MMMM YYYY LT',
                LLLL: 'dddd D MMMM YYYY LT'
            }
        });
        // /*时间日历设置-----------------------------------------------*/
        vm.endDateBeforeRender = endDateBeforeRender;
        vm.endDateOnSetTime = endDateOnSetTime;
        vm.startDateBeforeRender = startDateBeforeRender;
        vm.startDateOnSetTime = startDateOnSetTime;

        function startDateOnSetTime() {
            $scope.$broadcast('start-date-changed');
        }

        function endDateOnSetTime() {
            $scope.$broadcast('end-date-changed');
        }

        function startDateBeforeRender($dates) {
            if (vm.dateRangeEnd) {
                var activeDate = moment(vm.dateRangeEnd);
                $dates.filter(function (date) {
                    return date.localDateValue() >= activeDate.valueOf();
                }).forEach(function (date) {
                    date.selectable = false;
                });
            }
        }

        function endDateBeforeRender($view, $dates) {
            if (vm.dateRangeStart) {
                var activeDate = moment(vm.dateRangeStart).subtract(1, $view).add(1, 'minute');
                $dates.filter(function (date) {
                    return date.localDateValue() <= activeDate.valueOf();
                }).forEach(function (date) {
                    date.selectable = false;
                });
            }
        }

        vm.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
            var index = Math.floor(Math.random() * $dates.length);
            $dates[index].selectable = false;
        };
        /*时间日历设置------------------------------------------------*/

        /*停车场选择-------------------------------------------------*/
        vm.disabled = undefined;
        vm.searchEnabled = undefined;

        vm.setInputFocus = function () {
            $scope.$broadcast('UiselectDemo1');
        };
        vm.enable = function () {
            vm.disabled = false;
        };

        vm.disabled = function () {
            vm.disabled = true;
        };

        vm.enableSearch = function () {
            vm.searchEnabled = true;
        };

        vm.disableSearch = function () {
            vm.searchEnabled = false;
        };

        vm.someGroupFn = function (item) {

            if (item.name[0] >= 'A' && item.name[0] <= 'M')
                return 'From A - M';

            if (item.name[0] >= 'N' && item.name[0] <= 'Z')
                return 'From N - Z';

        };

        vm.firstLetterGroupFn = function (item) {
            return item.name[0];
        };

        vm.reverseOrderFilterFn = function (groups) {
            return groups.reverse();
        };
        vm.parkingAsync = {selected: 'wladimir@email.com'};
        vm.parkingAsync = [];

        var allParkLots = [];

        ManageParkingService.queryParking().then(function (response) {
            vm.parkingAsync = response.parking_lots;
            angular.forEach(response.parking_lots, function (value) {
                allParkLots.push(value.id);
            });
        });

        vm.onSelectCallback = function (item) {
            vm.eventResult = {model: item};
        };

        // 搜索框设置
        vm.menuState = {
            show: false
        };
        vm.toggleMenu = function () {
            vm.menuState.show = !vm.menuState.show;
        };


        // 获取表格设置
        vm.dtOptions = datatablesOptions.getDatatableOption();
        // 表格列设置
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5).withClass('text-danger'),
            DTColumnDefBuilder.newColumnDef(6),
            DTColumnDefBuilder.newColumnDef(7),
            DTColumnDefBuilder.newColumnDef(8),
            DTColumnDefBuilder.newColumnDef(9),
            DTColumnDefBuilder.newColumnDef(10),
            DTColumnDefBuilder.newColumnDef(11)
        ];

        vm.dtColumnDefs2 = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1).withClass('text-danger'),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4)
        ];

        /*停车场选择-------------------------------------------------*/
        // 设置选择时间下拉属性
        vm.timeSlot = [
            {name: '一周',time:604800000},
            {name: '一个月',time:2592000000}
        ];
        
        function queryAccountBalances() {
            vm.currentDate = new Date();
            vm.weekDayTime = vm.currentDate.getTime() - vm.selectTime.time;
            OnlineBill.queryAccountBalance(moment(new Date(new Date(vm.weekDayTime))).format('YYYY-MM-DD'), moment(new Date(new Date().getTime()+86400000)).format('YYYY-MM-DD'),vm.eventResult.model.id).then(function (response) {
                console.log(response.status);
                if(response.status === 0){
                    vm.journalaccount = response.journalaccount;
                    vm.abreconcile = response.abreconcile;
                } else if(response.status === 40009){
                    logger.info('当前查询条件下没有账单数据!!请重新选择条件查询！',response.detail,'查找失败');
                } else if(response.status === 10003 || response.status === 500){
                    logger.error('服务器或数据库发生异常！请联系管理员！',response.detail,'查找失败');
                }

            });
        }
    }
})();