(function () {
    angular.module('app.parking')
        .controller('organReconcileController', organReconcileController);
    organReconcileController.$inject = ['$location', 'organService', 'datatablesOptions', 'DTColumnDefBuilder','organReconcileService','$scope','organReconcileFactory','$uibModal','URL_SEED','logger'];
    'use strict';
    function organReconcileController($location, organService, datatablesOptions, DTColumnDefBuilder,organReconcileService,$scope,organReconcileFactory,$uibModal,URL_SEED,logger) {
        var vm = this;
        vm.queryOrganReconcile = queryOrganReconcile;
        vm.queryOrgan = queryOrgan;
        vm.queryOrgan();
        var selectOrgan = [];//所选择运营单位
        vm.OrganAsync = [];
        var allOrgans = [];
        function queryOrgan() {
            organService.queryOrgan().then(function (response) {
                vm.OrganAsync = response.records;
                angular.forEach(response.records, function (value) {
                    allOrgans.push(value.id);
                });
            });
        }
        vm.onSelectCallbackOrgan = function (item) {
            vm.eventResult = {model: item};
            vm.organId = vm.eventResult.model.id;
        };
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
        vm.coupon ={
            valid_begintime:undefined,
            valid_endtime:undefined
        };
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
            if (vm.dateRangeStart) {
                var activeDate = moment(vm.dateRangeStart);
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
        vm.pagination = {
            pagetype: {
                next_page: 1,
                pervious_page: 0
            },
            next_start_index:0,
            previous_start_index:0,
            maxid: 0,
            minid: 0
        };
        vm.number={
            start:0,
            next:0
        };
        /*停车场选择-------------------------------------------------*/
        vm.dtOptions = datatablesOptions.getDatatableOption(); // 获取datatables表格设置
        // 创建表格列
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6),
            DTColumnDefBuilder.newColumnDef(7),
            DTColumnDefBuilder.newColumnDef(8),
            DTColumnDefBuilder.newColumnDef(9),
            DTColumnDefBuilder.newColumnDef(10),
            DTColumnDefBuilder.newColumnDef(10),
            DTColumnDefBuilder.newColumnDef(11),
            DTColumnDefBuilder.newColumnDef(12),
            DTColumnDefBuilder.newColumnDef(13),
            DTColumnDefBuilder.newColumnDef(14),
            DTColumnDefBuilder.newColumnDef(15),
            DTColumnDefBuilder.newColumnDef(16),
            DTColumnDefBuilder.newColumnDef(17),
            DTColumnDefBuilder.newColumnDef(18),
            DTColumnDefBuilder.newColumnDef(19),
            DTColumnDefBuilder.newColumnDef(20)
        ];
        vm.show = false;
        //查询停车场功能
        function queryOrganReconcile() {
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
                organReconcileService.readRecords(vm.organId,vm.valid_begintime,vm.valid_endtime,vm.lottype).then(function (response) {
                    var i = 0;
                    vm.reconcileDate = [];
                    angular.forEach(response.data.parklot_summary, function (value,index) {
                        vm.reconcileDate[i] = value;
                        vm.reconcileDate[i].numberId = index;
                        vm.reconcileDate[i].id = i+1;
                        i++;
                    });
                    var countDate= {};
                    var countDateId = i+1;
                    var countDateName = '合计';
                    countDate.id =countDateId;
                    countDate.parklotname = countDateName;
                    countDate.aggregate_amount = response.data.aggregate_amount;
                    countDate.alipay_amount = response.data.alipay_amount;
                    countDate.alipay_refund = response.data.alipay_refund;
                    countDate.alipay_stroke_count = response.data.alipay_stroke_count;
                    countDate.alipay_surplus = response.data.alipay_surplus;
                    countDate.general_surplus = response.data.general_surplus;
                    countDate.total_refund = response.data.total_refund;
                    countDate.total_refund_stroke_count = response.data.total_refund_stroke_count;
                    countDate.total_stroke_count = response.data.total_stroke_count;
                    countDate.wechatpay_refund = response.data.wechatpay_refund;
                    countDate.wechatpay_stroke_count = response.data.wechatpay_stroke_count;
                    countDate.wechatpay_surplus = response.data.wechatpay_surplus;
                    countDate.wechatpay_amount = response.data.wechatpay_amount;
                    countDate.coupon_fee = response.data.coupon_fee;
                    countDate.apppay_amount = response.data.apppay_amount;
                    countDate.apppay_surplus = response.data.apppay_surplus;
                    countDate.apppay_refund = response.data.apppay_refund;
                    countDate.apppay_stroke_count = response.data.apppay_stroke_count;
                    vm.reconcileDate[i] = countDate;
                    vm.allData =  response.data;
                    vm.show = true;
                });
            }
        }
        vm.exportReconcile = exportReconcile;
        vm.clearAndRefresh = clearAndRefresh;
        function clearAndRefresh() {
            vm.OrganAsync.selected = undefined;
            vm.coupon.valid_endtime = undefined ;
            vm.coupon.valid_begintime = undefined ;
            vm.reconcileDate = '';
            vm.show = false;
            vm.allData = '';
            vm.lottype = '';
        }
        vm.parkReconcile = parkReconcile;
        function parkReconcile(reconcileDate,b) {
            var obj = {
                id:reconcileDate,
                parklotname:b,
                valid_begintime:vm.valid_begintime,
                valid_endtime:vm.valid_endtime,
                organId:vm.organId,
                lottype:vm.lottype
            }
            organReconcileFactory.setorganReconcile(obj);
            $location.path('/app/reconcile');
        }
        function exportReconcile() {
            vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
            vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            var obj = {
                valid_begintime:vm.valid_begintime,
                valid_endtime:vm.valid_endtime,
                organId:vm.organId,
                lottype:vm.lottype
            }
            organReconcileFactory.setorganReconcile(obj);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'exportDetail.html',
                size: 'lg',
                controller: 'organReconcileExportController',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                vm.queryOrganReconcile();
            });
        }
    }

})();