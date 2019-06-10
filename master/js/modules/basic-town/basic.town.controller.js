(function () {
    angular.module('app.basicinfo')
        .controller('TownCtr', TownCtr);
    TownCtr.$inject = ['$location', 'townService', 'DTColumnDefBuilder', 'datatablesOptions', 'townFactory', '$uibModal','$document','logger','regionService'];
    'use strict';
    function TownCtr($location, townService, DTColumnDefBuilder, datatablesOptions, townFactory, $uibModal,$document,logger,regionService) {
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
        vm.regiongAsync = [];
        var allRegions = [];
        regionService.queryRegion().then(function (response) {
            vm.regiongAsync = response.records;
            angular.forEach(response.records, function (value) {
                allRegions.push(value.id);
            });
        });
        vm.onSelectCallback = function (item) {
            vm.eventResult = {model: item};
            vm.selectRegionId = vm.eventResult.model.id;
        };
        vm.TownAsync = [];
        var allTowns = [];
        townService.queryTown().then(function (response) {
            vm.TownAsync = response.data;
            angular.forEach(response.data, function (value) {
                allTowns.push(value.id);
            });
        });
        vm.onSelectCallbackTown = function (item) {
            vm.eventResult = {model: item};
            vm.seletTownId = vm.eventResult.model.id;
        };
        vm.queryTown = queryTown;
        vm.addTown = addTown;
        vm.deleteTown = deleteTown;
        vm.modifyTown = modifyTown;
        vm.readRecords = readRecords;
        vm.readRecords(0);
        vm.dtOptions = datatablesOptions.getDatatableOption();
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4).notSortable()
        ];
        function queryTown() {
            townService.queryTown().then(function (response) {
                vm.town = response.data;
            });
        }
        function addTown() {
            $location.path('/app/town/add-new-town');
        }
        function deleteTown(town) {
            townFactory.setTown(town);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'deleteTown.html',
                size: 'sm',
                controller: 'TownDeteleCtr',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                vm.queryTown();
            });
        }
        function modifyTown(town) {
            townFactory.setTown(town);
            $location.path('/app/town/modify-town');
        }
        function readRecords(start_index){
            if(start_index == 0){
                townService.readRecords(0,'',vm.selectRegionId,vm.seletTownId).then(function (response) {
                    vm.town = response.data;
                    vm.parkNumber = response.parklot_sum;
                    angular.forEach(response.data, function (value,index) {
                        vm.town[index].number =index+1;
                    });
                    vm.number.start = vm.town[0].number;
                    vm.number.next = vm.town[vm.town.length - 1].number;
                    vm.pagination.next_start_index = response.data[response.data.length - 1].id;
                    vm.pagination.previous_start_index = response.data[0].id;
                    vm.pagination.maxid = response.maxid;
                    if (response.data.length < 50) {
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
            }else if(start_index == 1){
                if (vm.pagination.previous_start_index >= vm.pagination.maxid || vm.number.start == 0) {
                    logger.warning('已经到首页！','','没有上一页');
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                }else{
                    townService.readRecords(vm.pagination.previous_start_index,0,vm.selectRegionId,vm.seletTownId).then(function (response) {
                        vm.town = response.data;
                        vm.parkNumber = response.parklot_sum;
                        angular.forEach(response.data, function (value,index) {
                            vm.town[index].number = vm.number.start+index-response.data.length+1;
                        });
                        vm.number.start = vm.town[0].number-1;
                        vm.number.next = vm.town[vm.town.length - 1].number;
                        vm.pagination.next_start_index = response.data[response.data.length - 1].id;
                        vm.pagination.previous_start_index = response.data[0].id;
                        vm.pagination.maxid = response.maxid;
                        if (response.data.length < 50) {
                            angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                            angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                        }else{
                            angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                        }
                    });
                }
            }else if(start_index == 2){
                if (vm.pagination.next_start_index <= vm.pagination.minid) {
                    logger.warning('已经到最后一页！','','没有下一页');
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                }else{
                    townService.readRecords(vm.pagination.next_start_index,1,vm.selectRegionId,vm.seletTownId).then(function (response) {
                        vm.town = response.data;
                        vm.parkNumber = response.parklot_sum;
                        angular.forEach(response.data, function (value,index) {
                            vm.town[index].number = vm.number.next+index+1;
                        });
                        vm.number.start = vm.town[0].number-1;
                        vm.number.next = vm.town[vm.town.length - 1].number;
                        vm.pagination.next_start_index = response.data[response.data.length - 1].id;
                        vm.pagination.previous_start_index = response.data[0].id;
                        vm.pagination.minid = response.minid;
                        if (response.data.length < 50) {
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
            }else if(start_index == 3){
                townService.readRecords(-1,'',vm.selectRegionId,vm.seletTownId).then(function (response) {
                    vm.town = response.data;
                    vm.parkNumber = response.parklot_sum;
                    angular.forEach(response.data, function (value,index) {
                        vm.town[index].number = vm.pagination.maxid -response.data.length+index+1;
                    });
                    vm.number.start = vm.town[0].number-1;
                    vm.number.next = vm.town[vm.town.length - 1].number;
                    vm.pagination.next_start_index = response.data[response.data.length - 1].id;
                    vm.pagination.previous_start_index = response.data[0].id;
                    vm.pagination.minid = response.minid;
                    if (response.data.length < 50) {
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                    }else{
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                    }
                });
            }
        }
        vm.clearAndRefresh = function () {
            vm.selectRegionId = '';
            vm.seletTownId = '';
            vm.regiongAsync.selected = '';
            vm.TownAsync.selected = '';
            vm.readRecords(0);
        };
    }
})();