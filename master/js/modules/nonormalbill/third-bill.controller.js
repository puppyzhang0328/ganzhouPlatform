
/**
 * Created by huangxiang  on 2018/12/13 0013.
 * @author: huangxiang
 * Module:
 * feature:
 */
(function () {
    'use strict';
    angular.module('app.unnormalbill')
        .controller('thirdBillController',thirdBillController);
    thirdBillController.$inject = ['unNormalBillServe', '$scope', 'datatablesOptions','DTColumnDefBuilder','$document','$location','$uibModal','normalBillFactory'];

    function thirdBillController(unNormalBillServe, $scope, datatablesOptions,DTColumnDefBuilder,$document,$location,$uibModal,normalBillFactory) {
        var vm = this;
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
        var nowDay =  new Date();
        var day1 = new Date();
        day1.setTime(day1.getTime()-24*60*60*1000);
        var s1 = new Date(day1.getFullYear()+"-" + (day1.getMonth()+1) + "-" + day1.getDate());
        $scope.coupon ={
            valid_begintime: s1,
            valid_endtime:nowDay
        };
        /*时间日历设置------------------------------------------------*/
        // $scope.jumputDetail = function (recordsData) {
        //     billOnlineFactory.setBillOnline(recordsData);
        //     $location.path('/app/online-detail');
        // }
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
            DTColumnDefBuilder.newColumnDef(9)

        ];
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
                unNormalBillServe.readRecords($scope.pagination.previous_start_index,0,'yx',vm.valid_begintime,vm.valid_endtime).then(function (response) {
                    $scope.recordsData = response.records;
                    if(vm.next_number-100<=0){
                        angular.forEach(response.records, function (value,index) {
                            $scope.recordsData[index].number=index+1;
                            if(value.check_state =='0'){
                                $scope.recordsData[index].paidName = '平台无此订单';
                            }else if(value.check_state=='2') {
                                $scope.recordsData[index].paidName = '订单金额异常';
                            }else if(value.check_state=='1'){
                                $scope.recordsData[index].paidName = '对账一致 ';
                            }else if(value.check_state=='3'){
                                $scope.recordsData[index].paidName = '数据存于湘行测试服务器';
                            }else {
                                $scope.recordsData[index].paidName = value.check_state;
                            }
                            if(value.owner=='wechat'){
                                $scope.recordsData[index].ownerName='微信';
                            }else if(value.owner=='ali'){
                                $scope.recordsData[index].ownerName='支付宝';
                            }else {
                                $scope.recordsData[index].ownerName=value.owner;
                            }

                        });
                    }else {
                        angular.forEach(response.records, function (value,index) {
                            $scope.recordsData[index].number=(vm.next_number-100)+index;
                            if(value.check_state =='0'){
                                $scope.recordsData[index].paidName = '平台无此订单';
                            }else if(value.check_state=='2') {
                                $scope.recordsData[index].paidName = '订单金额异常';
                            }else if(value.check_state=='1'){
                                $scope.recordsData[index].paidName = '对账一致 ';
                            }else if(value.check_state=='3'){
                                $scope.recordsData[index].paidName = '数据存于湘行测试服务器';
                            }else {
                                $scope.recordsData[index].paidName = value.check_state;
                            }
                            if(value.owner=='wechat'){
                                $scope.recordsData[index].ownerName='微信';
                            }else if(value.owner=='ali'){
                                $scope.recordsData[index].ownerName='支付宝';
                            }else {
                                $scope.recordsData[index].ownerName=value.owner;
                            }

                        });
                    }
                    //排序
                    vm.next_number= $scope.recordsData[0].number;
                    vm.start_number= $scope.recordsData[ $scope.recordsData.length-1].number;
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
            if ($scope.pagination.next_start_index <= $scope.pagination.minid) {
                alert('已经到最后一页！');
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
            } else {
                if($scope.coupon.valid_begintime && $scope.coupon.valid_endtime) {
                    vm.valid_begintime = moment(new Date(new Date($scope.coupon.valid_begintime))).format('YYYY-MM-DD');
                    vm.valid_endtime = moment(new Date(new Date($scope.coupon.valid_endtime))).format('YYYY-MM-DD');
                }
                unNormalBillServe.readRecords($scope.pagination.next_start_index,1,'yx',vm.valid_begintime,vm.valid_endtime).then(function (response) {
                    $scope.recordsData = response.records;
                    angular.forEach(response.records, function (value,index) {
                        $scope.recordsData[index].number=vm.start_number+(index+1);;
                        if(value.check_state =='0'){
                            $scope.recordsData[index].paidName = '平台无此订单';
                        }else if(value.check_state=='2') {
                            $scope.recordsData[index].paidName = '订单金额异常';
                        }else if(value.check_state=='1'){
                            $scope.recordsData[index].paidName = '对账一致 ';
                        }else if(value.check_state=='3'){
                            $scope.recordsData[index].paidName = '数据存于湘行测试服务器';
                        }else {
                            $scope.recordsData[index].paidName = value.check_state;
                        }
                        if(value.owner=='wechat'){
                            $scope.recordsData[index].ownerName='微信';
                        }else if(value.owner=='ali'){
                            $scope.recordsData[index].ownerName='支付宝';
                        }else {
                            $scope.recordsData[index].ownerName=value.owner;
                        }
                    });
                    //排序索引
                    vm.start_number= $scope.recordsData[ $scope.recordsData.length-1].number;
                    vm.next_number= $scope.recordsData[0].number;
                    $scope.pagination.next_start_index = response.records[response.records.length - 1].id;
                    $scope.pagination.previous_start_index = response.records[0].id;
                    $scope.pagination.minid = response.minid;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
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
            unNormalBillServe.readRecords(0,"",'yx',vm.valid_begintime,vm.valid_endtime).then(function (response) {
                console.log(response);
                if (response.records == null) {
                    alert('此时间内暂无数据');
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                } else {
                    $scope.recordsData = response.records;
                    angular.forEach(response.records, function (value,index) {
                        $scope.recordsData[index].number=index+1;
                        if(value.check_state =='0'){
                            $scope.recordsData[index].paidName = '平台无此订单';
                        }else if(value.check_state=='2') {
                            $scope.recordsData[index].paidName = '订单金额异常';
                        }else if(value.check_state=='1'){
                            $scope.recordsData[index].paidName = '对账一致 ';
                        }else if(value.check_state=='3'){
                            $scope.recordsData[index].paidName = '数据存于湘行测试服务器';
                        }else {
                            $scope.recordsData[index].paidName = value.check_state;
                        }
                        if(value.owner=='wechat'){
                            $scope.recordsData[index].ownerName='微信';
                        }else if(value.owner=='ali'){
                            $scope.recordsData[index].ownerName='支付宝';
                        }else {
                            $scope.recordsData[index].ownerName=value.owner;
                        }
                    });
                    //排序索引
                    vm.start_number= $scope.recordsData[$scope.recordsData.length-1].number;
                    $scope.pagination.next_start_index = response.records[response.records.length - 1].id;
                    $scope.pagination.previous_start_index = response.records[0].id;
                    $scope.pagination.maxid = response.maxid;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                }
            });

        };
        /*加载末页*/
        $scope.loadLastPage = function () {
            if($scope.coupon.valid_begintime && $scope.coupon.valid_endtime) {
                vm.valid_begintime = moment(new Date(new Date($scope.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date($scope.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            unNormalBillServe.readRecords(-1,"",'yx',vm.valid_begintime,vm.valid_endtime).then(function (response) {
                $scope.recordsData = response.records;
                angular.forEach(response.records, function (value,index) {
                    $scope.recordsData[index].number=2000+(index+1);
                    if(value.check_state =='0'){
                        $scope.recordsData[index].paidName = '平台无此订单';
                    }else if(value.check_state=='2') {
                        $scope.recordsData[index].paidName = '订单金额异常';
                    }else if(value.check_state=='1'){
                        $scope.recordsData[index].paidName = '对账一致 ';
                    }else if(value.check_state=='3'){
                        $scope.recordsData[index].paidName = '数据存于湘行测试服务器';
                    }else {
                        $scope.recordsData[index].paidName = value.check_state;
                    }
                    if(value.owner=='wechat'){
                        $scope.recordsData[index].ownerName='微信';
                    }else if(value.owner=='ali'){
                        $scope.recordsData[index].ownerName='支付宝';
                    }else {
                        $scope.recordsData[index].ownerName=value.owner;
                    }

                });
                //排序
                vm.next_number= $scope.recordsData[0].number;
                $scope.pagination.minid = response.minid;
                $scope.pagination.next_start_index = response.records[response.records.length - 1].id;
                $scope.pagination.previous_start_index = response.records[0].id;
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
            });
        };
        $scope.loadFistPage();

        //搜索
        $scope.searchRecords=function () {
            $scope.loadFistPage();

        };
        //点击弹出修改
        vm.modifyThiebill =function modifyThiebill(examine) {
            normalBillFactory.setGroupBill(examine);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'normalBill.html',
                size: 'sm',
                controller: 'normalBillCommonController',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                $scope.loadFistPage();
            });
        };
        /*清除查找条件*/
        $scope.clearAndRefresh = function () {
            // $scope.coupon.valid_begintime="";
            // $scope.coupon.valid_endtime="";
            // vm.valid_begintime="";
            // vm.valid_endtime="";
            vm.iphone_user="";
            $scope.loadFistPage();
        };
    }
})();
