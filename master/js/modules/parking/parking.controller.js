(function () {
    angular.module('app.parking')
        .controller('ParkManageController', ParkManageController);
    ParkManageController.$inject = ['$location', 'ManageParkingService', 'DTColumnDefBuilder', 'datatablesOptions', 'currentClickPark', '$uibModal','$document','regionService','busTypeService','URL_SEED'];
    'use strict';
    function ParkManageController($location, ManageParkingService, DTColumnDefBuilder, datatablesOptions, currentClickPark, $uibModal,$document,regionService,busTypeService,URL_SEED) {
        var vm = this;
        vm.picture_no='';vm.lat_long_no='';vm.price_no='';vm.placetype_no='';vm.other_platform='';
        vm.queryBaiDuMapParking = queryBaiDuMapParking;
        vm.queryBaiDuMapParking();
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
        vm.regiongAsync = [];
        var allRegions = [];

        regionService.queryRegion().then(function (response) {
            vm.regiongAsync = response.records;
            angular.forEach(response.records, function (value) {
                allRegions.push(value.id);
            });
        });
        vm.onSelectCallbackRegion = function (item) {
            vm.eventResult = {model: item};
            vm.selectRegionId = vm.eventResult.model.id;
        };
        vm.selectRegion = {
            id: undefined
        };
        vm.BusTypeAsync = [];
        var allBusTypes = [];
        busTypeService.queryBusType().then(function (response) {
            vm.BusTypeAsync = response.records;
            angular.forEach(response.records, function (value,index) {
                vm.BusTypeAsync[index].name = value.genrename;
                allBusTypes.push(value.id);
            });
        });
        vm.onSelectCallbackBusType = function (item) {
            vm.eventResult = {model: item};
            vm.selectBusTypeId = vm.eventResult.model.id;
        };
        vm.parkingAsync = [];
        var allParkLots = [];
        var start_index = 0;

        //搜索框的停车场的
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
        }
        vm.onSelectCallback = function (item) {
            vm.eventResult = {model: item};
            vm.seletParkId= vm.eventResult.model.id;
        };
        vm.queryParkings = queryParkings; // 查询所有停车场
        vm.queryParkIdentifier = queryParkIdentifier; // 查询停车场密钥
        vm.queryParkingGate = queryParkingGate; // 查询停车场入口
        vm.queryGates = queryGates; //查询停车入口坐标
        vm.addParkingLot = addParkingLot; //新增停车场
        vm.deleteParking = deleteParking; //删除停车场
        vm.modifyParking = modifyParking; //修改停车场
        vm.parklotExport = parklotExport;
        vm.queryParkings(0); // 初始化停车场表格数据
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
            DTColumnDefBuilder.newColumnDef(10)
        ];
        function queryParkingGate(parkId) {
            ManageParkingService.queryGates(parkId).then(function (response) {
               vm.parkgate = response.parkgate;
            });
        }
        /*打开停车场入口modal*/
        function queryGates(parking) {
            currentClickPark.setPark(parking);
            var modalInstance = $uibModal.open({
                backdrop:'static',
                templateUrl: '/park/app/views/partials/park-gate-modal.html',
                size:'lg',
                controller: 'GateModalController',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                // todo do something after modal closed
            });
        }
        /**
         * 新增停车场.跳转至新增停车场界面
         */
        function addParkingLot() {
            $location.path('/app/parking/add-new-parking');
        }

        /**
         * 打开删除停车场的modal;
         * @param parking
         */
        function deleteParking(parking) {
            currentClickPark.setPark(parking);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'deleteParking.html',
                size: 'sm',
                controller: 'ParkingModalController',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                vm.queryParkings(0);
            });
        }

        /**
         * 修改停车场，跳转至修改停车场界面
         * @param parking 当前要修改的停车场
         */
        function modifyParking(parking) {
            currentClickPark.setPark(parking);
            $location.path('/app/parking/modify-parking');
        }
        
        function queryParkIdentifier(parking) {
            currentClickPark.setPark(parking);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: '/park/app/views/partials/query-park-detail.html',
                size: 'lg',
                controller: 'QueryIdentifierController',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                vm.queryParkings(0);
            });
        }
        function queryParkings(start_index){
            $('.loading').removeClass('loadmask');
            if(start_index == 0){
                ManageParkingService.readRecords(0,'',vm.selectRegionId,vm.selectBusTypeId,vm.picture_no,vm.lat_long_no,vm.price_no,vm.other_platform,vm.seletParkId).then(function (response) {
                    $('.loading').addClass('loadmask');
                    vm.parking_lots = response.parking_lots;
                    vm.parkNumber = response.parklot_sum;
                    angular.forEach(response.parking_lots, function (value,index) {
                        vm.parking_lots[index].number =index+1;
                    });
                    vm.number.start = vm.parking_lots[0].number;
                    vm.number.next = vm.parking_lots[vm.parking_lots.length - 1].number;
                    vm.pagination.next_start_index = response.parking_lots[0].id;
                    vm.pagination.previous_start_index =response.parking_lots[response.parking_lots.length - 1].id;
                    vm.pagination.maxid = response.maxid;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                });
            }else if(start_index == 1){
                if (vm.pagination.previous_start_index >= vm.pagination.maxid) {
                    logger.warning('已经到首页！','','没有上一页');
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                }else{
                    ManageParkingService.readRecords(vm.pagination.next_start_index,0,vm.selectRegionId,vm.selectBusTypeId,vm.picture_no,vm.lat_long_no,vm.price_no,vm.other_platform,vm.seletParkId).then(function (response) {
                        vm.parking_lots = response.parking_lots;
                        vm.parkNumber = response.parklot_sum;
                        angular.forEach(response.parking_lots, function (value,index) {
                            vm.parking_lots[index].number = vm.number.start+index-response.parking_lots.length+1;
                        });
                        vm.number.start = vm.parking_lots[0].number;
                        vm.number.next = vm.parking_lots[vm.parking_lots.length - 1].number;
                        vm.pagination.next_start_index = response.parking_lots[0].id;
                        vm.pagination.previous_start_index =response.parking_lots[response.parking_lots.length - 1].id;
                        vm.pagination.maxid = response.maxid;
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                    });
                }
            }else if(start_index == 2){
                if (vm.pagination.next_start_index <= vm.pagination.minid) {
                    logger.warning('已经到最后一页！','','没有下一页');
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                }else{
                    ManageParkingService.readRecords(vm.pagination.previous_start_index,1,vm.selectRegionId,vm.selectBusTypeId,vm.picture_no,vm.lat_long_no,vm.price_no,vm.other_platform,vm.seletParkId).then(function (response) {
                        vm.parking_lots = response.parking_lots;
                        vm.parkNumber = response.parklot_sum;
                        angular.forEach(response.parking_lots, function (value,index) {
                            vm.parking_lots[index].number = vm.number.number+index;
                        });
                        vm.number.start = vm.parking_lots[0].number;
                        vm.number.next = vm.parking_lots[vm.parking_lots.length - 1].number;
                        vm.pagination.next_start_index = response.parking_lots[0].id;
                        vm.pagination.previous_start_index =response.parking_lots[response.parking_lots.length - 1].id;
                        vm.pagination.minid = response.minid;
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                    });
                }
            }else if(start_index == 3){
                ManageParkingService.readRecords(-1,'',vm.selectRegionId,vm.selectBusTypeId,vm.picture_no,vm.lat_long_no,vm.price_no,vm.other_platform,vm.seletParkId).then(function (response) {
                    vm.parking_lots = response.parking_lots;
                    vm.parkNumber = response.parklot_sum;
                    angular.forEach(response.parking_lots, function (value,index) {
                        vm.parking_lots[index].number = response.parklot_sum-index;
                    });
                    vm.number.start = vm.parking_lots[0].number;
                    vm.number.next = vm.parking_lots[vm.parking_lots.length - 1].number;
                    vm.pagination.next_start_index = response.parking_lots[0].id;
                    vm.pagination.previous_start_index =response.parking_lots[response.parking_lots.length - 1].id;
                    vm.pagination.minid = response.minid;
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                });
            }
        }
        
        function parklotExport() {
            ManageParkingService.parklotExport().then(function (response) {
                 vm.url  = response.data.file_name;
                 window.open(URL_SEED.IMG_URL+'media/reconcile/'+vm.url,'_self');
            });
        }
        vm.clearAndRefresh = function () {
            vm.parkingAsync.selected = '';
            vm.display = false;
            vm.vehicleIn = false;
            vm.valid_begintime = '';
            vm.seletParkId = '';
            vm.selectRegionId = '';
            vm.selectBusTypeId = '';
            vm.regiongAsync.selected = '';
            vm.BusTypeAsync.selected = '';
            vm.valid_endtime = '';
            vm.time_type = '';
            vm.queryParkings(0);
        };
    }
})();