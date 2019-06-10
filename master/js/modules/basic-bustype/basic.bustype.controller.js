(function () {
    angular.module('app.basicinfo')
        .controller('BusTypeCtr', BusTypeCtr);
    BusTypeCtr.$inject = ['$location', 'busTypeService', 'DTColumnDefBuilder', 'datatablesOptions', 'busTypeFactory', '$uibModal','$document','logger'];
    'use strict';
    function BusTypeCtr($location, busTypeService, DTColumnDefBuilder, datatablesOptions, busTypeFactory, $uibModal,$document,logger) {
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
        vm.queryBusType = queryBusType;
        vm.addBusType = addBusType;
        vm.deleteBusType = deleteBusType;
        vm.modifyBusType = modifyBusType;
        vm.readRecords = readRecords;
        vm.readRecords(0);
        vm.dtOptions = datatablesOptions.getDatatableOption();
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3).notSortable()
        ];
        function queryBusType() {
            busTypeService.queryBusType().then(function (response) {
                vm.bustype= response.records;
            });
        }
        function addBusType() {
            $location.path('/app/bustype/add-new-bustype');
        }
        function deleteBusType(busType) {
            busTypeFactory.setBusType(busType);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'deleteBusType.html',
                size: 'sm',
                controller: 'busTypeDeteleCtr',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                vm.queryBusType();
            });
        }
        function modifyBusType(busType) {
            busTypeFactory.setBusType(busType);
            $location.path('/app/bustype/modify-bustype');
        }
        function readRecords(start_index){
            if(start_index == 0){
                busTypeService.readRecords(0,'',vm.selectBusTypeId).then(function (response) {
                    vm.bustype= response.records;
                    angular.forEach(response.records, function (value,index) {
                        vm.bustype[index].number =index+1;
                    });
                    vm.number.start = vm.bustype[0].number;
                    vm.number.next = vm.bustype[vm.bustype.length - 1].number;
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
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
                    busTypeService.readRecords(vm.pagination.previous_start_index,0,vm.selectBusTypeId).then(function (response) {
                        vm.bustype= response.records;
                        angular.forEach(response.records, function (value,index) {
                            vm.bustype[index].number = vm.number.start+index-response.records.length+1;
                        });
                        vm.number.start = vm.bustype[0].number;
                        vm.number.next = vm.bustype[vm.bustype.length - 1].number;
                        vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                        vm.pagination.previous_start_index = response.records[0].id;
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
                    busTypeService.readRecords(vm.pagination.next_start_index,1,vm.selectBusTypeId).then(function (response) {
                        vm.bustype= response.records;
                        angular.forEach(response.records, function (value,index) {
                            vm.bustype[index].number = vm.number.number+index;
                        });
                        vm.number.start = vm.bustype[0].number;
                        vm.number.next = vm.bustype[vm.bustype.length - 1].number;
                        vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                        vm.pagination.previous_start_index = response.records[0].id;
                        vm.pagination.minid = response.minid;
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                    });
                }
            }else if(start_index == 3){
                busTypeService.readRecords(-1,'',vm.selectBusTypeId).then(function (response) {
                    vm.bustype= response.records;
                    angular.forEach(response.records, function (value,index) {
                        vm.bustype[index].number = response.records[0].id+index;
                    });
                    vm.number.start = vm.bustype[0].number;
                    vm.number.next = vm.bustype[vm.bustype.length - 1].number;
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
                    vm.pagination.minid = response.minid;
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                });
            }
        }
        vm.clearAndRefresh = function () {
            vm.BusTypeAsync.selected = '';
            vm.selectBusTypeId = '';
            vm.readRecords(0);
        };
    }
})();