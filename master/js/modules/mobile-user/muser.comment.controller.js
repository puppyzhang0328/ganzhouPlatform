/**
 * Created by yumaotao  on 2017/11/27 0014.
 * @author: yumaotao
 * Module: muser.comment.controller.js
 * feature: 用户反馈建议初始化及设置
 */
(function () {
    'use strict';
    angular.module('app.mobile-user')
        .controller('UserAdviceController',UserAdviceController);
    UserAdviceController.$inject = ['commentUser', 'datatablesOptions', 'logger', '$document', 'DTColumnDefBuilder','$uibModal','$location','userCommentFactory'];
    function UserAdviceController(commentUser, datatablesOptions, logger, $document, DTColumnDefBuilder,$uibModal,$location,userCommentFactory) {
        var vm = this;
        vm.dtOptions = datatablesOptions.getDatatableOption(); // 获取datatables表格设置
        vm.dtOptions.withOption('paging', false);
        vm.dtOptions.withOption('deferRender', false);
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
        // 创建表格列
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4).notSortable()
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
            pageSize: 10,
            pageNumber: 0,
            next_start_index: 0,
            previous_start_index: 0,
            totalItems: null
        };
        vm.valid_begintime='';
        vm.valid_endtime='';
        vm.coupon ={
            valid_begintime:'',
            valid_endtime:''
        };
        vm.phone_number = '',
        vm.loadFistPage = loadFistPage;  // 加载首页function
        vm.loadPreviousPage = loadPreviousPage; // 加载上一页function
        vm.loadNextPage = loadNextPage; // 加载下一页function
        vm.loadLastPage = loadLastPage; // 加载尾页 function
        vm.loadFistPage(); // 初始化表格数据，默认加载首页
        vm.replayUser = replayUser;//回复投诉建议
        /**
         * 加载上一页
         */
        function loadPreviousPage() {
            if (vm.pagination.previous_start_index >= vm.pagination.maxid) {
                alert('已经到第一页！');
                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
            } else {
                commentUser.queryComentUser(vm.pagination.previous_start_index, vm.pagination.pageSize, vm.pagination.pagetype.pervious_page).then(function (response) {
                    vm.advice = response.records;
                    vm.pagination.next_start_index = response.records[response.records.length - 1].comid;
                    vm.pagination.previous_start_index = response.records[0].comid;
                    vm.pagination.maxid = response.maxid;
                    if (vm.advice.length < 10) {
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    }
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                });
            }

        }
        /**
         * 加载下一页
         */
        function loadNextPage() {
            if (vm.pagination.next_start_index <= vm.pagination.minid || vm.advice.length < 10) {
                alert('已经到最后一页！');
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
            } else {
                commentUser.queryComentUser(vm.pagination.next_start_index, vm.pagination.pageSize, vm.pagination.pagetype.next_page).then(function (response) {
                    vm.advice = response.records;
                    vm.pagination.next_start_index = response.records[response.records.length - 1].comid;
                    vm.pagination.previous_start_index = response.records[0].comid;
                    vm.pagination.minid = response.minid;
                    if (vm.advice.length < 10) {
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    }
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                });

            }
        }
        /**
         * 加载首页
         */
        function loadFistPage() {
            vm.pagination.next_start_index = 0;
            vm.pagination.maxid = 0;
            vm.pagination.minid = 0;
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            commentUser.queryHome(vm.phone_number,vm.valid_begintime,vm.valid_endtime).then(function (response) {
                if (response.status === 0 && response.records.length !== 0) {
                    vm.advice = response.records;
                    vm.pagination.next_start_index = response.records[response.records.length - 1].comid;
                    vm.pagination.previous_start_index = response.records[0].comid;
                    vm.pagination.maxid = response.maxid;
                    vm.pagination.pageNumber = 1;
                    // 如果记录少于20条，则灰掉所有翻页按钮
                    if (vm.advice.length < 10) {
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
        /**
         * 加载尾页
         */
        function loadLastPage() {
            commentUser.queryLast().then(function (response) {
                vm.advice = response.records;
                vm.pagination.minid = response.minid;
                vm.pagination.next_start_index = response.records[response.records.length - 1].comid;
                vm.pagination.previous_start_index = response.records[0].comid;
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
            });
        }
        //回复投诉建议
        function replayUser(userComment){
            userCommentFactory.setUserComment(userComment);
            $location.path('/app/replay-comment');
        }
        vm.clearAndRefresh = clearAndRefresh;
        function clearAndRefresh() {
            vm.phone_number = '';
            vm.coupon ={
                valid_begintime:'',
                valid_endtime:''
            };
            vm.loadFistPage();
        }
    }
})();
