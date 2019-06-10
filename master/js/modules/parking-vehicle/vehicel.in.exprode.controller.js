/**
 * Created by huangxiang  on 2018/11/19 0019.
 * @author: huangxiang
 * Module:
 * feature:
 */
(function () {
    angular.module('app.vehicle')
        .controller('vehicelExportController', vehicelExportController);
    vehicelExportController.$inject = ['VehicleInService', 'vehicleFactory', 'URL_SEED', 'logger', '$uibModalInstance', '$scope'];
    'use strict';
    function vehicelExportController(VehicleInService, vehicleFactory, URL_SEED, logger, $uibModalInstance, $scope) {
       var vm=this;

        var exportHistory = vehicleFactory.getDayReport();
        vm.exportParkingHistory=exportParkingHistory;
        function exportParkingHistory() {
            VehicleInService.vehicleExplede(exportHistory.parklotids, exportHistory.plate_number, exportHistory.min_intime, exportHistory.max_intime, exportHistory.MaxId).then(function (response) {
                if (response.status == 0) {
                    vm.urlName = response.data.file_name;
                    vm.url = URL_SEED.IMG_URL + 'media/reconcile/' + response.data.file_name;

                } else {
                    var content_detail=response.detail;
                    logger.warning('查询失败！', content_detail,content_detail+'请重现查询导出');
                }

            });
        }
        //发送请求
        vm.exportParkingHistory();
            vm.cancel = cancel;
            function cancel() {
                $uibModalInstance.dismiss('cancel');
            }




    }



    
    
    
    
    
    
    
    // function vehicelExportController(VehicleInService,vehicleFactory,URL_SEED,logger,$uibModalInstance,$scope) {
    //     var vm = this;
    //     //日历设置
    //     moment.locale('zh-cn', {
    //         longDateFormat: {
    //             LT: 'HH:mm',
    //             LTS: 'HH:mm:ss',
    //             L: 'DD/MM/YYYY',
    //             LL: 'D MMMM YYYY',
    //             LLL: 'D MMMM YYYY LT',
    //             LLLL: 'dddd D MMMM YYYY LT'
    //         }
    //     });
    //
    //     // /*时间日历设置-----------------------------------------------*/
    //     vm.endDateBeforeRender = endDateBeforeRender;
    //     vm.endDateOnSetTime = endDateOnSetTime;
    //     vm.startDateBeforeRender = startDateBeforeRender;
    //     vm.startDateOnSetTime = startDateOnSetTime;
    //     function startDateOnSetTime() {
    //         $scope.$broadcast('start-date-changed');
    //     }
    //     function endDateOnSetTime() {
    //         $scope.$broadcast('end-date-changed');
    //     }
    //     function startDateBeforeRender($dates) {
    //         if (vm.dateRangeStart) {
    //             var activeDate = moment(vm.dateRangeStart);
    //             $dates.filter(function (date) {
    //                 return date.localDateValue() >= activeDate.valueOf();
    //             }).forEach(function (date) {
    //                 date.selectable = false;
    //             });
    //         }
    //     }
    //     function endDateBeforeRender($view, $dates) {
    //         if (vm.dateRangeStart) {
    //             var activeDate = moment(vm.dateRangeStart).subtract(1, $view).add(1, 'minute');
    //             $dates.filter(function (date) {
    //                 return date.localDateValue() <= activeDate.valueOf();
    //             }).forEach(function (date) {
    //                 date.selectable = false;
    //             });
    //         }
    //     }
    //     vm.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
    //         var index = Math.floor(Math.random() * $dates.length);
    //         $dates[index].selectable = false;
    //     };
    //     //日历的选择
    //     $scope.coupon ={
    //         valid_begintime:undefined,
    //         valid_endtime:undefined
    //     };
    //
    //
    //
    //     // var obj = vehicleFactory.getDayReport();
    //     vm.exportReconcile = exportReconcile;
    //
    //     vm.parkingAsyncExport = [];
    //     //下拉框
    //      vm.exportSelectVehicle=exportSelectVehicle;
    //     vm.exportSelectVehicle();
    //     //数据下拉框的渲染
    //       function exportSelectVehicle() {
    //           vm.parkingAsyncExport=vehicleFactory.getexportReport()
    //
    //       }
    //       //下拉框选中
    //     vm.onExportCallback=function (item,$event) {
    //         if($scope.stopPropagation){
    //             $event.stopPropagation();
    //         }
    //         vm.eventResults = {model: item};
    //         vm.seletParkIds = vm.eventResults.model.id;
    //
    //     };
    //
    //
    //
    //
    //     function exportReconcile() {
    //         if($scope.coupon.valid_begintime && $scope.coupon.valid_endtime) {
    //             vm.valid_begintime = moment(new Date(new Date($scope.coupon.valid_begintime))).format('YYYY-MM-DD');
    //             vm.valid_endtime = moment(new Date(new Date($scope.coupon.valid_endtime))).format('YYYY-MM-DD');
    //         }
    //         VehicleInService.vehicleExplede(vm.seletParkIds,$scope.export_plate_number,vm.valid_begintime,vm.valid_endtime,vm.history_max).then(function (response) {
    //             if(response.status == 0){
    //                 vm.urlName = response.data.file_name;
    //                 vm.url = URL_SEED.IMG_URL +'media/'+response.data.file_name;
    //
    //             }else {
    //                 logger.warning('查询失败！','','请重现查询导出');
    //             }
    //         });
    //     }
    //     vm.cancel = cancel;
    //     function cancel() {
    //         $uibModalInstance.dismiss('cancel');
    //     }
    //
    //     //发送请求
    //     vm.exportReconcile();
    // }
})();