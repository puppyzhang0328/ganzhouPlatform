(function () {
    angular.module('app.vehicle')
        .controller('VehicleInController', VehicleInController);
    VehicleInController.$inject = ['VehicleInService', '$scope', 'DTColumnDefBuilder', 'ManageParkingService', 'datatablesOptions', '$document','StatusCode','logger','$interval','URL_SEED','$uibModal','vehicleFactory'];
    'use strict';
    function VehicleInController(VehicleInService, $scope, DTColumnDefBuilder, ManageParkingService, datatablesOptions, $document,StatusCode,logger,$interval,URL_SEED,$uibModal,vehicleFactory) {
        var vm = this;
        var selectPark = [];//所选择的停车场
        var queryState;//刷新
        $scope.$on("$destroy", function() {
            vm.stopQueryState();
        });
        vm.queryBaiDuMapParking = queryBaiDuMapParking;
        vm.queryBaiDuMapParking();
        vm.coupon ={
            valid_begintime:'',
            valid_endtime:''
        };
        vm.valid_begintime='';
        vm.valid_endtime='';
        vm.vehicleIn = false;
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
        vm.parkingAsync = [];
        var allParkLots = [];
        var start_index = 0;
        function queryBaiDuMapParking() {
            ManageParkingService.querySearchBaiDuMapParking(start_index).then(function (response) {
                if(response.parking_lots.length !== 0) {
                    start_index =  response.parking_lots[response.parking_lots.length - 1].id;
                    angular.forEach(response.parking_lots, function (value) {
                        vm.parkingAsync.push(value);
                        allParkLots.push(value.id);
                    });
                    queryBaiDuMapParking();
                }
            });
            vehicleFactory.setexportReport(vm.parkingAsync)
        }
        vm.onSelectCallback = function (item) {
            vm.eventResult = {model: item};
            vm.seletParkId = vm.eventResult.model.id;
        };
        vm.seletPark = {
            id: undefined
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
            DTColumnDefBuilder.newColumnDef(6)
        ];
        vm.totalServerItems = 0;
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
            totalItems: null,
            start_index:0,
            now_start_index:0,
        };
        // /*刷新当前页*/
        vm.loadNowPage = function () {
            queryState = $interval(function(){
                if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                    vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                    vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
                }
                VehicleInService.readNowPage(vm.pagination.now_start_index, vm.pagination.pageSize,vm.pagination.new_pagetype, vm.seletParkId, vm.search_plate_number,vm.valid_begintime,vm.valid_endtime).then(function (response) {
                    vm.vehicle = response.records;
                    angular.forEach(response.records, function (value,index) {
                        if(value.in_plateimg){
                            vm.vehicle[index].src =URL_SEED.IMG_URL+'media/'+value.in_vehicleimg;
                        }else {
                            vm.vehicle[index].src = URL_SEED.API_IMGURL+'app/img/no_pic.png';
                        }
                    });
                });
            },10000);
        };
        /*加载上一页*/
        vm.loadPreviousPage = function () {
            $interval.cancel(queryState);
            vm.pagination.now_start_index = vm.pagination.previous_start_index;
            vm.pagination.new_pagetype = vm.pagination.pagetype.pervious_page;
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            if (vm.pagination.previous_start_index >= vm.pagination.maxid) {
                logger.warning('已经到首页！','','没有上一页');
                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
            } else {
                VehicleInService.readRecords(vm.pagination.previous_start_index, vm.pagination.pageSize, vm.pagination.pagetype.pervious_page,  vm.seletParkId, vm.search_plate_number,vm.valid_begintime,vm.valid_endtime).then(function (response) {
                    vm.vehicle = response.records;
                    angular.forEach(response.records, function (value,index) {
                        if(value.in_plateimg){
                            vm.vehicle[index].src =URL_SEED.IMG_URL+'media/'+value.in_vehicleimg;
                        }else {
                            vm.vehicle[index].src = URL_SEED.API_IMGURL+'app/img/no_pic.png';
                        }
                    });
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
                    vm.pagination.maxid = response.maxid;
                    if (vm.vehicle.length < 50) {
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    }
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                });
            }
            vm.loadNowPage();
        };

        /*加载下一页*/
        vm.loadNextPage = function () {
            $interval.cancel(queryState);
            vm.pagination.now_start_index = vm.pagination.previous_start_index;
            vm.pagination.new_pagetype = vm.pagination.pagetype.pervious_page;
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            if (vm.pagination.next_start_index <= vm.pagination.minid) {
                logger.warning('已经到最后一页！','','没有下一页');
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
            } else {
                VehicleInService.readRecords(vm.pagination.next_start_index, vm.pagination.pageSize, vm.pagination.pagetype.next_page,  vm.seletParkId, vm.search_plate_number,vm.valid_begintime,vm.valid_endtime).then(function (response) {
                    vm.vehicle = response.records;
                    angular.forEach(response.records, function (value,index) {
                        if(value.in_plateimg){
                            vm.vehicle[index].src =URL_SEED.IMG_URL+'media/'+value.in_plateimg;
                        }else {
                            vm.vehicle[index].src = URL_SEED.API_IMGURL+'app/img/no_pic.png';
                        }
                    });
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
                    vm.pagination.minid = response.minid;
                    if (vm.vehicle.length < 50) {
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    }
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                });

            }
            vm.loadNowPage();
        };

        /*加载首页*/
        vm.loadFistPage = function () {
            vm.pagination.next_start_index = 0;
            vm.pagination.maxid = 0;
            vm.pagination.minid = 0;
            $interval.cancel(queryState);
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            vm.pagination.now_start_index = vm.pagination.next_start_index;
            vm.pagination.new_pagetype = vm.pagination.pagetype.pervious_page;
            VehicleInService.readHome( vm.seletParkId, vm.search_plate_number,vm.valid_begintime,vm.valid_endtime).then(function (response) {
                if (response.status === StatusCode.SUCCESS && response.records.length !== 0) {
                    vm.vehicle = response.records;
                    angular.forEach(response.records, function (value,index) {
                        if(value.in_plateimg){
                            vm.vehicle[index].src =URL_SEED.IMG_URL+'media/'+value.in_plateimg;
                        }else {
                            vm.vehicle[index].src = URL_SEED.API_IMGURL+'app/img/no_pic.png';
                        }
                    });
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
                    vm.pagination.maxid = response.maxid;
                    vm.pagination.pageNumber = 1;
                    // 如果记录少于20条，则灰掉所有翻页按钮
                    if (vm.vehicle.length < 50) {
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
                    logger.error('数据库发生错误！',response.detail,'查找失败！');
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                } else {
                    logger.warning('没有找到停车记录',response.detail,'没有停车记录');
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                }

            });
            vm.loadNowPage();
        };
        /*加载末页*/
        vm.loadLastPage = function () {
            $interval.cancel(queryState);
            vm.pagination.now_start_index = -1;
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            vm.pagination.new_pagetype = vm.pagination.pagetype.pervious_page;
            VehicleInService.readLastPage( vm.seletParkId, vm.search_plate_number,vm.valid_begintime,vm.valid_endtime).then(function (response) {
                vm.vehicle = response.records;
                angular.forEach(response.records, function (value,index) {
                    if(value.in_plateimg){
                        vm.vehicle[index].src =URL_SEED.IMG_URL+'media/'+value.in_plateimg;
                    }else {
                        vm.vehicle[index].src = URL_SEED.API_IMGURL+'app/img/no_pic.png';
                    }
                });
                vm.pagination.minid = response.minid;
                vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                vm.pagination.previous_start_index = response.records[0].id;
                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
            });
            vm.loadNowPage();
        };
        vm.loadFistPage();
        vm.menuState = {
            show: false
        };
        vm.toggleMenu = function () {
            vm.menuState.show = !vm.menuState.show;
        };
        vm.changeBtn = function () {
            vm.vehicleIn = !vm.vehicleIn;
            $interval.cancel(queryState);
        };
        vm.coupon ={
            valid_begintime:'',
            valid_endtime:''
        };
        vm.valid_begintime='';
        vm.valid_endtime='';
        /*查找指定停车场或者车牌号的数据*/
        vm.searchRecords = function () {
            vm.stopQueryState();
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }
            vm.pagination.next_start_index = 0;
            selectPark.push(vm.seletParkId);
            $interval.cancel(queryState);
            VehicleInService.readRecords(vm.pagination.next_start_index, vm.pagination.pageSize, vm.pagination.pagetype.next_page, vm.seletParkId, vm.search_plate_number,vm.valid_begintime,vm.valid_endtime).then(function (response) {
                if (response.status === StatusCode.SUCCESS && response.records.length !== 0) {
                    vm.vehicle = response.records;
                    angular.forEach(response.records, function (value,index) {
                        if(value.in_plateimg){
                            vm.vehicle[index].src =URL_SEED.IMG_URL+'media/'+value.in_plateimg;
                        }else {
                            vm.vehicle[index].src = URL_SEED.API_IMGURL+'app/img/no_pic.png';
                        }
                    });
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
                    vm.pagination.maxid = response.maxid;
                    if (vm.vehicle.length < 50) {
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    } else {
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                    }
                } else if (response.status === StatusCode.NO_INOUT_RECORD) {
                    logger.warning('没有找到停车记录',response.detail,'没有停车记录');
                } else {
                    logger.error('没有找到停车记录',response.detail,'数据库错误');
                }
            });
        };
        /*清除查找条件*/
        vm.clearAndRefresh = function () {
            vm.seletPark.id = '';
            vm.search_plate_number = '';
            vm.parkingAsync.selected = '';
            vm.seletParkId = '';vm.search_plate_number = '';vm.valid_begintime = '';vm.valid_endtime = '';
            vm.coupon ={
                valid_begintime:'',
                valid_endtime:''
            };
            vm.valid_begintime='';
            vm.valid_endtime='';
            vm.MaxId="";
            vm.loadNowPage();
        };

        vm.stopQueryState = function(){
            if (angular.isDefined(queryState)) {
                $interval.cancel(queryState);
                queryState = undefined;
            }
        };
        //这里是导出
        vm.exportReconcile=exportReconcile;
        function exportReconcile() {
            if(vm.coupon.valid_begintime && vm.coupon.valid_endtime){
                vm.valid_begintime =  moment(new Date(new Date(vm.coupon.valid_begintime))).format('YYYY-MM-DD');
                vm.valid_endtime = moment(new Date(new Date(vm.coupon.valid_endtime))).format('YYYY-MM-DD');
            }

            var exportObj = {
                parklotids: vm.seletParkId,
                plate_number: vm.search_plate_number,
                min_intime:vm.valid_begintime,
                max_intime: vm.valid_endtime,
                MaxId: vm.MaxId
            };
            vehicleFactory.setDayReport(exportObj);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'exportDetail.html',
                size: 'lg',
                controller: 'vehicelExportController',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                vm.readRecords(0);
            });
        }

    }
})();