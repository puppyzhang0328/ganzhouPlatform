(function () {
    angular.module('app.iotdevice')
        .controller('iotdeviceController', iotdeviceController);
    iotdeviceController.$inject = ['$location', 'iotdeviceService', 'DTColumnDefBuilder', 'datatablesOptions', 'iotdeviceFactory', '$uibModal','$document','URL_SEED','ManageParkingService','logger'];
    'use strict';
    function iotdeviceController($location, iotdeviceService, DTColumnDefBuilder, datatablesOptions, iotdeviceFactory, $uibModal,$document,URL_SEED,ManageParkingService,logger) {
        var vm = this;
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
        }

        vm.onSelectCallback = function (item) {
            vm.eventResult = {model: item};
            vm.seletPark.id = vm.eventResult.model.id;
        };
        vm.seletPark = {
            id: undefined
        };
        vm.queryBaiDuMapParking = queryBaiDuMapParking;
        vm.queryIotdevice = queryIotdevice;
        vm.addIotdevice = addIotdevice;
        vm.deleteIotdevice = deleteIotdevice;
        vm.modifyIotdevice = modifyIotdevice;
        vm.queryIotdeviceIdentifier = queryIotdeviceIdentifier;
        vm.queryIotdevice(0);
        vm.queryBaiDuMapParking();
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
            DTColumnDefBuilder.newColumnDef(12),
            DTColumnDefBuilder.newColumnDef(13),
            DTColumnDefBuilder.newColumnDef(14).notSortable()
        ];
        function addIotdevice() {
            $location.path('/app/addIotdevice');
        }
        function deleteIotdevice(iotdevice) {
            iotdeviceFactory.setIotdevice(iotdevice);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'deleteIotdevice.html',
                size: 'sm',
                controller: 'deleteIotdeviceController',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                vm.queryIotdevice(0);
            });
        }
        function queryIotdeviceIdentifier(iotdevice) {
            iotdeviceFactory.setIotdevice(iotdevice);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'iotdevice-detail.html',
                size: 'lg',
                controller: 'iotdeviceDetailController',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                vm.queryIotdevice(0);
            });
        }
        function modifyIotdevice(iotdevice) {
            iotdeviceFactory.setIotdevice(iotdevice);
            $location.path('/app/modifyIotdevice');
        }
        function queryIotdevice(start_index){
            if(start_index == 0){
                iotdeviceService.readRecords(0,'',vm.seletPark.id,vm.devtype,vm.devname,vm.devfirm).then(function (response) {
                    vm.iotdevice = response.records;
                    angular.forEach(response.records, function (value,index) {
                        vm.iotdevice[index].number =index+1;
                    });
                    vm.number.start = vm.iotdevice[0];
                    vm.number.next = vm.iotdevice[vm.iotdevice.length - 1].number;
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
                    vm.pagination.maxid = response.maxid;
                    if (response.records.length < 50) {
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    }else{
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                    }
                });
            }else if(start_index == 1){//上一页
                if (vm.pagination.previous_start_index >= vm.pagination.maxid) {
                    logger.warning('已经到首页！','','没有上一页');
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                }else{
                    iotdeviceService.readRecords(vm.pagination.previous_start_index,0,vm.seletPark.id,vm.devtype,vm.devname,vm.devfirm).then(function (response) {
                        vm.iotdevice = response.records;
                        angular.forEach(response.records, function (value,index) {
                            vm.iotdevice[index].number = vm.number.start+index-response.records.length+1;
                        });
                        vm.number.start = vm.iotdevice[0];
                        vm.number.next = vm.iotdevice[vm.iotdevice.length - 1].number;
                        vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                        vm.pagination.previous_start_index = response.records[0].id;
                        vm.pagination.maxid = response.maxid;
                        if (response.records.length < 50) {
                            angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                            angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                        }else{
                            angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                            angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                            angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                            angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                        }
                    });
                }
            }else if(start_index == 2){//下一页
                if (vm.pagination.next_start_index <= vm.pagination.minid) {
                    logger.warning('已经到最后一页！','','没有下一页');
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                }else{
                    iotdeviceService.readRecords(vm.pagination.next_start_index,1,vm.seletPark.id,vm.devtype,vm.devname,vm.devfirm).then(function (response) {
                        vm.iotdevice = response.records;
                        angular.forEach(response.records, function (value,index) {
                            vm.iotdevice[index].number = vm.number.number+index;
                        });
                        vm.number.start = vm.iotdevice[0];
                        vm.number.next = vm.iotdevice[vm.iotdevice.length - 1].number;
                        vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                        vm.pagination.previous_start_index = response.records[0].id;
                        vm.pagination.minid = response.minid;
                        if (response.records.length < 50) {
                            angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                            angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                        }else{
                            angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                        }
                    });
                }
            }else if(start_index == 3){//加载最后一页
                iotdeviceService.readRecords(-1,'',vm.seletPark.id,vm.devtype,vm.devname,vm.devfirm).then(function (response) {
                    vm.iotdevice = response.records;
                    angular.forEach(response.records, function (value,index) {
                        vm.iotdevice[index].number = response.records[0].id+index;
                    });
                    vm.number.start = vm.iotdevice[0];
                    vm.number.next = vm.iotdevice[vm.iotdevice.length - 1].number;
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
                    vm.pagination.minid = response.minid;
                    if (response.records.length < 50) {
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    }else{
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                    }
                });
            }
        }
        vm.clearAndRefresh = function () {
            vm.parkingAsync.selected = null;vm.devtype =null;vm.devname = null; vm.devfirm = null;
            vm.seletPark.id = null;
            vm.queryIotdevice(0);
        };
    }
})();