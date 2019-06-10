/**
 * Created by huangxiang  on 2018/11/15 0015.
 * @author: huangxiang
 * Module:
 * feature:
 */
(function () {
    angular.module('app.refund')
        .controller('OnlineRefundController',OnlineRefundController);
    OnlineRefundController.$inject = ['OnlineRefundService', '$scope', 'datatablesOptions','DTColumnDefBuilder','$document','RefundFactory','$location','$uibModal'];
    'use strict';
    function OnlineRefundController(OnlineRefundService, $scope, datatablesOptions,DTColumnDefBuilder,$document,RefundFactory,$location,$uibModal) {
        var vm = this;
        $scope.servicetype = 'parkingpay';
        $scope.payment_channel = 'bcspay';
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
        $scope.coupon ={
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

        vm.dtOptions = datatablesOptions.getDatatableOption();
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
            DTColumnDefBuilder.newColumnDef(11),
            DTColumnDefBuilder.newColumnDef(12)
        ];
        //退款的按钮
        $scope.deSelectRow = function(row) {
            billOnlineFactory.setBillOnline(row.entity);
            $location.path('/app/online-detail');
        };
        $scope.totalServerItems = 0;
        $scope.pagination = {
            pagetype: {
                next_page: 1,
                pervious_page: 0
            },
            maxid: 0,
            minid: 0,
            pageSize: 50,
            pageNumber: 0,
            next_start_index: 0,
            previous_start_index: 0,
            totalItems: null,
            getTotalPages: function () {
                return Math.ceil(this.totalItems / this.pageSize);
            },
            nextPage: function () {
                $scope.loadNextPage();
                this.pageNumber++;
            },
            previousPage: function () {
                this.pageNumber--;
                $scope.loadPreviousPage();
            }
        };
        /*加载上一页*/
        $scope.loadPreviousPage = function () {
            if ($scope.pagination.previous_start_index >= $scope.pagination.maxid) {
                alert('已经到第一页！');
                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
            } else {
                if($scope.coupon.valid_begintime && $scope.coupon.valid_endtime) {
                    vm.valid_begintime = moment(new Date(new Date($scope.coupon.valid_begintime))).format('YYYY-MM-DD');
                    vm.valid_endtime = moment(new Date(new Date($scope.coupon.valid_endtime))).format('YYYY-MM-DD');
                }
                OnlineRefundService.readHome("",$scope.paid,vm.valid_begintime,vm.valid_endtime,$scope.pagination.previous_start_index,0).then(function (response) {
                    var response = response.records;
                    $scope.recordsData = response.records;
                    angular.forEach(response.records, function (value, index) {
                        if(value.state || value.should_refund == 0){
                            // angular.element($document[0].getElementById('refundMoney'))[0].disabled = true;
                            vm.refundMoney="true";
                            vm.refundsMoney="false"
                        }else {
                            vm.refundMoney="false";
                            vm.refundsMoney="true";
                        }

                        if (value.state) {
                            $scope.recordsData[index].paidName = '已处理';
                        } else {
                            $scope.recordsData[index].paidName = '未处理';
                        }

                    });
                    $scope.pagination.next_start_index = response.records[response.records.length - 1].id;
                    $scope.pagination.previous_start_index = response.records[0].id;
                    $scope.pagination.maxid = response.maxid;
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                });
            }
        };
        /*加载下一页*/
        $scope.loadNextPage = function () {
            if ($scope.pagination.previous_start_index <= $scope.pagination.maxid) {
                alert('已经到最后一页！');
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
            } else {
                if($scope.coupon.valid_begintime && $scope.coupon.valid_endtime) {
                    vm.valid_begintime = moment(new Date(new Date($scope.coupon.valid_begintime))).format('YYYY-MM-DD');
                    vm.valid_endtime = moment(new Date(new Date($scope.coupon.valid_endtime))).format('YYYY-MM-DD');
                }
                OnlineRefundService.readHome("",$scope.paid,vm.valid_begintime,vm.valid_endtime,$scope.pagination.next_start_index,1).then(function (response) {
                    var response = response.records;
                    $scope.recordsData = response.records;
                    angular.forEach(response.records, function (value, index) {
                        if(value.state || value.should_refund == 0){
                            // angular.element($document[0].getElementById('refundMoney'))[0].disabled = true;
                            vm.refundMoney="true";
                            vm.refundsMoney="false"
                        }else {
                            vm.refundMoney="false";
                            vm.refundsMoney="true";
                        }

                        if (value.state) {
                            $scope.recordsData[index].paidName = '已处理';
                        } else {
                            $scope.recordsData[index].paidName = '未处理';
                        }
                    });
                    $scope.pagination.next_start_index = response.records[response.records.length - 1].id;
                    $scope.pagination.previous_start_index = response.records[0].id;
                    $scope.pagination.minid = response.minid;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                });

            }
        };

        /*加载首页*/
        $scope.loadFistPage = function () {
            $scope.pagination.start_index = 0;
            $scope.pagination.maxid = 0;
            $scope.pagination.minid = 0;
            if($scope.coupon.valid_begintime && $scope.coupon.valid_endtime) {
                vm.valid_begintime = moment(new Date(new Date($scope.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date($scope.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            OnlineRefundService.readHome(vm.seletOrinfoId,$scope.paid,vm.valid_begintime,vm.valid_endtime,0,"",vm.inputInphone).then(function (response) {
                if (response.status == 0) {
                // console.log(response);
                var response = response.records;

                if (response.records == null) {
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                } else {
                    $scope.recordsData = response.records;

                    angular.forEach(response.records, function (value, index) {
                        if(value.state || value.should_refund == 0){
                            // angular.element($document[0].getElementById('refundMoney'))[0].disabled = true;
                            vm.refundMoney="true";
                            vm.refundsMoney="false"
                        }else {
                            vm.refundMoney="false";
                            vm.refundsMoney="true";
                        }

                        if (value.state) {
                            $scope.recordsData[index].paidName = '已处理';
                        } else {
                            $scope.recordsData[index].paidName = '未处理';
                        }





                    });
                    $scope.pagination.next_start_index = response.records[response.records.length - 1].id;
                    $scope.pagination.previous_start_index = response.records[0].id;
                    $scope.pagination.maxid = response.maxid;
                    $scope.pagination.pageNumber = 1;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                }
            }
            });
        };
        /*加载末页*/
        $scope.loadLastPage = function () {
            if($scope.coupon.valid_begintime && $scope.coupon.valid_endtime) {
                vm.valid_begintime = moment(new Date(new Date($scope.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date($scope.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            OnlineRefundService.readHome("",$scope.paid,vm.valid_begintime,vm.valid_endtime,-1,"").then(function (response) {
                var response = response.records;
                $scope.recordsData = response.records;
                angular.forEach(response.records, function (value, index) {
                    if(value.state || value.should_refund == 0){
                        // angular.element($document[0].getElementById('refundMoney'))[0].disabled = true;
                        vm.refundMoney="true";
                        vm.refundsMoney="false"
                    }else {
                        vm.refundMoney="false";
                        vm.refundsMoney="true";
                    }

                    if (value.state) {
                        $scope.recordsData[index].paidName = '已处理';
                    } else {
                        $scope.recordsData[index].paidName = '未处理';
                    }
                });

                $scope.pagination.minid = response.minid;
                $scope.pagination.next_start_index = response.records[response.records.length - 1].id;
                $scope.pagination.previous_start_index = response.records[0].id;
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
            });
        };
        // vm.loadfirst=$scope.loadFistPage();
        $scope.loadFistPage();
       //下拉框的数据渲染
            vm.selectRufund=function () {
                OnlineRefundService.allrefund().then(function (response) {
                    if(response.status == 0){
                        vm.refundselect=response.records.records;
                    }
                })
            };
        vm.selectRufund();
         //下拉框
        vm.onSelectCallbackinfo=function (item) {
            vm.eventResult = {model: item};
            vm.seletOrinfoId= vm.eventResult.model.id;

        };

        /*清除查找条件*/
         vm.clearAndRefresh=function () {
             vm.refundselect.selected="";
             $scope.coupon.valid_begintime="";
             $scope.coupon.valid_endtime="";
             vm.seletOrinfoId="";
             $scope.loadFistPage();

         };
        //弹出提示框
        $scope.jumputDetail = function (recordsData) {
            RefundFactory. setorganReconcile(recordsData);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'deleteRegion.html',
                size: 'sm',
                controller: 'refundDeteleCtrs',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                $scope.loadFistPage();
            });

        };

       //点击搜索
        vm.researchrefund=function(){
            $scope.loadFistPage();
        }

    }
})();