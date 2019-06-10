(function () {
    angular.module('app.mobile-user')
        .controller('MobileUserController', MobileUserController);
    MobileUserController.$inject = ['Mobile_User', 'logger', '$document', 'datatablesOptions','DTColumnDefBuilder','$location','userPayFactory','$scope'];
    'use strict';
    function MobileUserController(Mobile_User, logger, $document, datatablesOptions,DTColumnDefBuilder,$location,userPayFactory,$scope) {
        var vm = this;
        vm.vehicles= '';
        vm.dtOptions = datatablesOptions.getDatatableOption();
        //设置时间的插件
        //日历设置
        vm.coupon ={
            valid_begintime:undefined,
            valid_endtime:undefined
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
        // /*时间日历设置-----------------------------------------------*/
        vm.endDateBeforeRender = endDateBeforeRender;
        vm.endDateOnSetTime = endDateOnSetTime;
        vm.startDateBeforeRender = startDateBeforeRender;
        vm.startDateOnSetTime = startDateOnSetTime;






        // $scope.isDisabledDate = function(currentDate, mode) {
        //     currentDate.selectable = false;
        //     // return mode === 'day' && (currentDate.getDay() === 0 || currentDate.getDay() === 6);
        // };
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



        // 创建表格列
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6)
        ];
        vm.totalServerItems = 0;
        // 表格分页设置
        vm.pagination = {
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
            totalItems: null
        };

        vm.loadFistPage = loadFistPage;  // 加载首页function
        vm.loadPreviousPage = loadPreviousPage; // 加载上一页function
        vm.loadNextPage = loadNextPage; // 加载下一页function
        vm.loadLastPage = loadLastPage; // 加载尾页 function
        vm.loadFistPage(); // 初始化表格数据，默认加载首页
        function loadPreviousPage() {
            if (vm.pagination.previous_start_index >= vm.pagination.maxid) {
                alert('已经到第一页！');
                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
            } else {
                if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                    vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                    vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
                }
                Mobile_User.queryMobileUser(vm.pagination.previous_start_index, vm.pagination.pageSize, vm.pagination.pagetype.pervious_page,vm.valid_begintime,vm.valid_endtime).then(function (response) {
                    vm.mobileUserDate = response.records;
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
                    vm.pagination.maxid = response.maxid;
                    if (vm.mobileUserDate.length < 50) {
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    }
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                });
            }

        }
        function loadNextPage() {
            if (vm.pagination.next_start_index <= vm.pagination.minid || vm.mobileUserDate.length < 50) {
                alert('已经到最后一页！');
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
            } else {
                if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                    vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                    vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
                }
                Mobile_User.queryMobileUser(vm.pagination.next_start_index, vm.pagination.pageSize, vm.pagination.pagetype.next_page,vm.valid_begintime,vm.valid_endtime).then(function (response) {
                    vm.mobileUserDate = response.records;
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
                    vm.pagination.minid = response.minid;
                    if (vm.mobileUserDate.length < 50) {
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    }
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                });

            }
        }

        function loadFistPage() {
            vm.pagination.next_start_index = 0;
            vm.pagination.maxid = 0;
            vm.pagination.minid = 0;
            // if(vm.phone_number){
            //     $scope.open = function($event) {
            //         console.log('-------------');
            //         $event.preventDefault();
            //         $event.stopPropagation();
            //
            //     };
            // }else {
            //         vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
            //         vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            //         angular.element($document[0].getElementById('phone_number'))[0].disabled = true;
            // }
            if(vm.phone_number  && (vm.coupon.valid_begintime || vm.coupon.valid_endtime)){
                logger.warning('手机号码和时间区域只能选择一个','','请重新查询');
                vm.phone_number = '';
                vm.coupon.valid_begintime = '';
                vm.coupon.valid_endtime ='';
                    return false;
            }
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            Mobile_User.queryHome(vm.phone_number,vm.vehicles,vm.valid_begintime,vm.valid_endtime).then(function (response) {
                if (response.status === 0 && response.records.length !== 0) {
                    vm.mobileUserDate = response.records;
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
                    vm.pagination.maxid = response.maxid;
                    vm.pagination.pageNumber = 1;
                    // 如果记录少于20条，则灰掉所有翻页按钮
                    if (vm.mobileUserDate.length < 50) {
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    } else {
                        // 否则只灰掉上一页按钮，首页留作刷新用
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                    }
                } else if (response.status === 10003) {
                    alert('查找停车记录错误！！！请检查服务器数据库！');
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                } else {
                    alert('暂时没有app用户记录！！');
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                }

            });
        }
        function loadLastPage() {
            Mobile_User.queryLast().then(function (response) {
                vm.mobileUserDate = response.records;
                vm.pagination.minid = response.minid;
                vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                vm.pagination.previous_start_index = response.records[0].id;
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
            });
        }
        //重置
        vm.clearAndRefresh = clearAndRefresh;
        function clearAndRefresh() {
            vm.phone_number = '';
            vm.vehicles = '';
            vm.coupon.valid_begintime = '';
            vm.coupon.valid_endtime ='';
            vm.valid_begintime="";
            vm.valid_endtime="";
            vm.loadFistPage();
            angular.element($document[0].getElementById('phone_number'))[0].disabled = false;
        }
        vm.detailDate = detailDate;
        function detailDate(mobileUserDate) {
            userPayFactory.setUserPay(mobileUserDate);
            $location.path('/app/user-pay');
        }

        //点击搜索的时候

        // vm.blurinput=function () {
        //      if(vm.phone_number){
        //          console.log('有值');
        //
        //                  $scope.open = function ($event) {
        //                      // logger.warning('手机号码和时间区域只能选择一个','','请重新查询');
        //                      console.log('-------------');
        //                      $event.preventDefault();
        //                      $event.stopPropagation();
        //
        //                  };
        //
        //
        //      }else {
        //          console.log('空格');
        //          $scope.open = function ($event) {
        //              console.log('------77777888-------');
        //              if(vm.coupon.valid_begintime || vm.coupon.valid_endtime){
        //                  console.log('日历游资');
        //                  vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
        //                  vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
        //                  angular.element($document[0].getElementById('phone_number'))[0].disabled = true;
        //              }
        //
        //          };
        //
        //
        //
        //      }
        // };
        // $scope.open = function ($event) {
        //     console.log('------77777-------');
        //     // angular.element($document[0].getElementById('phone_number'))[0].disabled = true;
        //     if(vm.coupon.valid_begintime || vm.coupon.valid_endtime){
        //         console.log('日历游资');
        //         vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
        //         vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
        //         angular.element($document[0].getElementById('phone_number'))[0].disabled = true;
        //     }
        //
        // };






    }
})();