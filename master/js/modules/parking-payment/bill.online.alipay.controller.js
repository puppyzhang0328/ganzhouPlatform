(function () {
    angular.module('app.prepayment')
        .controller('OnlinePayAliController',OnlinePayAliController);
    OnlinePayAliController.$inject = ['OnlinePaymentService', '$scope', 'datatablesOptions','DTColumnDefBuilder','$document','billOnlineFactory','$location'];
    'use strict';
    function OnlinePayAliController(OnlinePaymentService, $scope, datatablesOptions,DTColumnDefBuilder,$document,billOnlineFactory,$location) {
        var vm = this;
        $scope.servicetype = 'parkingpay';
        $scope.payment_channel = 'alipay';
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
        $scope.jumputDetail = function (recordsData) {
            billOnlineFactory.setBillOnline(recordsData);
            $location.path('/app/online-detail');
        }
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
                OnlinePaymentService.readRecords($scope.pagination.previous_start_index, $scope.pagination.pageSize, $scope.pagination.pagetype.pervious_page,$scope.servicetype,$scope.payment_channel,$scope.username,$scope.paid,vm.valid_begintime,vm.valid_endtime,vm.plate_number).then(function (response) {
                    $scope.recordsData = response.records;
                    angular.forEach(response.records, function (value,index) {
                        if(value.paid){
                            $scope.recordsData[index].paidName = '已支付';
                        }else {
                            $scope.recordsData[index].paidName = '未支付';
                        }
                        switch (value.payment_channel){
                            case 'wechatpay': $scope.recordsData[index].payment_channelName ='微信';break;
                            case 'alipay': $scope.recordsData[index].payment_channelName ='支付宝';break;
                            case 'unionpay': $scope.recordsData[index].payment_channelName ='银联';break;
                            case 'dadapay': $scope.recordsData[index].payment_channelName ='账上余额';break;
                        }
                        if(value.thirdpay_checkstatus=='103'){
                            $scope.recordsData[index].checkstatus = '第三方支付金额不一致';
                        }else if(value.thirdpay_checkstatus =='102') {
                            $scope.recordsData[index].checkstatus = '第三方支不存在';
                        }else if (value.thirdpay_checkstatus == '0') {
                            $scope.recordsData[index].checkstatus = '对账无误';
                        }else {
                            $scope.recordsData[index].checkstatus = '尚未对账';
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
            if ($scope.pagination.next_start_index <= $scope.pagination.minid) {
                alert('已经到最后一页！');
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
            } else {
                if($scope.coupon.valid_begintime && $scope.coupon.valid_endtime) {
                    vm.valid_begintime = moment(new Date(new Date($scope.coupon.valid_begintime))).format('YYYY-MM-DD');
                    vm.valid_endtime = moment(new Date(new Date($scope.coupon.valid_endtime))).format('YYYY-MM-DD');
                }
                OnlinePaymentService.readRecords($scope.pagination.next_start_index, $scope.pagination.pageSize, $scope.pagination.pagetype.next_page,$scope.servicetype,$scope.payment_channel,$scope.username,$scope.paid,vm.valid_begintime,vm.valid_endtime,vm.plate_number).then(function (response) {
                    $scope.recordsData = response.records;
                    angular.forEach(response.records, function (value,index) {
                        if(value.paid){
                            $scope.recordsData[index].paidName = '已支付';
                        }else {
                            $scope.recordsData[index].paidName = '未支付';
                        }
                        switch (value.payment_channel){
                            case 'wechatpay': $scope.recordsData[index].payment_channelName ='微信';break;
                            case 'alipay': $scope.recordsData[index].payment_channelName ='支付宝';break;
                            case 'unionpay': $scope.recordsData[index].payment_channelName ='银联';break;
                            case 'dadapay': $scope.recordsData[index].payment_channelName ='账上余额';break;
                        }
                        if(value.thirdpay_checkstatus=='103'){
                            $scope.recordsData[index].checkstatus = '第三方支付金额不一致';
                        }else if(value.thirdpay_checkstatus =='102') {
                            $scope.recordsData[index].checkstatus = '第三方支不存在';
                        }else if (value.thirdpay_checkstatus == '0') {
                            $scope.recordsData[index].checkstatus = '对账无误';
                        }else {
                            $scope.recordsData[index].checkstatus = '尚未对账';
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
            OnlinePaymentService.readHome($scope.servicetype,$scope.payment_channel,$scope.username,$scope.paid,vm.valid_begintime,vm.valid_endtime,vm.plate_number).then(function (response) {
                console.log(response);
                if (response.records == null) {
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                } else {
                    $scope.recordsData = response.records;
                    angular.forEach(response.records, function (value,index) {
                        if(value.paid){
                            $scope.recordsData[index].paidName = '已支付';
                        }else {
                            $scope.recordsData[index].paidName = '未支付';
                        }
                        switch (value.payment_channel){
                            case 'wechatpay': $scope.recordsData[index].payment_channelName ='微信';break;
                            case 'alipay': $scope.recordsData[index].payment_channelName ='支付宝';break;
                            case 'unionpay': $scope.recordsData[index].payment_channelName ='银联';break;
                            case 'dadapay': $scope.recordsData[index].payment_channelName ='账上余额';break;
                        }
                        if(value.thirdpay_checkstatus=='103'){
                            $scope.recordsData[index].checkstatus = '第三方支付金额不一致';
                        }else if(value.thirdpay_checkstatus =='102') {
                            $scope.recordsData[index].checkstatus = '第三方支不存在';
                        }else if (value.thirdpay_checkstatus == '0') {
                            $scope.recordsData[index].checkstatus = '对账无误';
                        }else {
                            $scope.recordsData[index].checkstatus = '尚未对账';
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
            });
        };
        /*加载末页*/
        $scope.loadLastPage = function () {
            if($scope.coupon.valid_begintime && $scope.coupon.valid_endtime) {
                vm.valid_begintime = moment(new Date(new Date($scope.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date($scope.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            OnlinePaymentService.readLastPage($scope.servicetype,$scope.payment_channel,$scope.username,$scope.paid,vm.valid_begintime,vm.valid_endtime,vm.plate_number).then(function (response) {
                $scope.recordsData = response.records;
                angular.forEach(response.records, function (value,index) {
                    if(value.paid){
                        $scope.recordsData[index].paidName = '已支付';
                    }else {
                        $scope.recordsData[index].paidName = '未支付';
                    }
                    switch (value.payment_channel){
                        case 'wechatpay': $scope.recordsData[index].payment_channelName ='微信';break;
                        case 'alipay': $scope.recordsData[index].payment_channelName ='支付宝';break;
                        case 'unionpay': $scope.recordsData[index].payment_channelName ='银联';break;
                        case 'dadapay': $scope.recordsData[index].payment_channelName ='账上余额';break;
                    }
                    if(value.thirdpay_checkstatus=='103'){
                        $scope.recordsData[index].checkstatus = '第三方支付金额不一致';
                    }else if(value.thirdpay_checkstatus =='102') {
                        $scope.recordsData[index].checkstatus = '第三方支不存在';
                    }else if (value.thirdpay_checkstatus == '0') {
                        $scope.recordsData[index].checkstatus = '对账无误';
                    }else {
                        $scope.recordsData[index].checkstatus = '尚未对账';
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
        $scope.loadFistPage();
        $scope.menuState = {
            show: false
        };
        $scope.toggleMenu = function () {
            $scope.menuState.show = !$scope.menuState.show;
        };
        /*查找指定停车场或者车牌号的数据*/
        $scope.searchRecords = function () {
            $scope.pagination.next_start_index = 0;
            if($scope.coupon.valid_begintime && $scope.coupon.valid_endtime) {
                vm.valid_begintime = moment(new Date(new Date($scope.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date($scope.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            OnlinePaymentService.readRecords( $scope.pagination.start_index, $scope.pagination.pageSize, $scope.pagination.pagetype.next_page,$scope.servicetype,$scope.payment_channel,$scope.username,$scope.paid,vm.valid_begintime,vm.valid_endtime,vm.plate_number).then(function (response) {
                if (response.status == 0 && response.records !== null) {
                    $scope.recordsData = response.records;
                    angular.forEach(response.records, function (value,index) {
                        if(value.paid){
                            $scope.recordsData[index].paidName = '已支付';
                        }else {
                            $scope.recordsData[index].paidName = '未支付';
                        }
                        switch (value.payment_channel){
                            case 'wechatpay': $scope.recordsData[index].payment_channelName ='微信';break;
                            case 'alipay': $scope.recordsData[index].payment_channelName ='支付宝';break;
                            case 'unionpay': $scope.recordsData[index].payment_channelName ='银联';break;
                            case 'dadapay': $scope.recordsData[index].payment_channelName ='账上余额';break;
                        }
                        if(value.thirdpay_checkstatus=='103'){
                            $scope.recordsData[index].checkstatus = '第三方支付金额不一致';
                        }else if(value.thirdpay_checkstatus =='102') {
                            $scope.recordsData[index].checkstatus = '第三方支不存在';
                        }else if (value.thirdpay_checkstatus == '0') {
                            $scope.recordsData[index].checkstatus = '对账无误';
                        }else {
                            $scope.recordsData[index].checkstatus = '尚未对账';
                        }
                    });
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

        /*清除查找条件*/
        $scope.clearAndRefresh = function () {
            $scope.ctrl.eventResult.model = undefined;
            $scope.ctrl.parkingAsync.selected = undefined;
            $scope.seletPark.id = undefined;
            $scope.search_plate_number = undefined;
            $scope.payment_channel = '';$scope.username = '';$scope.paid = '';vm.valid_begintime = '';vm.valid_endtime = '';
            $scope.loadFistPage();
        };
    }
})();