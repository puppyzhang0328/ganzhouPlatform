(function () {
    angular.module('app.basicinfo')
        .controller('RegionCtr', RegionCtr);
    RegionCtr.$inject = ['$location', 'regionService', 'DTColumnDefBuilder', 'datatablesOptions', 'regionFactory', '$uibModal','$document','logger'];
    'use strict';
    function RegionCtr($location, regionService, DTColumnDefBuilder, datatablesOptions, regionFactory, $uibModal,$document,logger) {
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
        vm.queryRegion = queryRegion;
        vm.addRegion = addRegion;
        vm.deleteRegion = deleteRegion;
        vm.modifyRegion = modifyRegion;
        vm.readRecords = readRecords;
        vm.readRecords(0);
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
            DTColumnDefBuilder.newColumnDef(9).notSortable()
        ];
        function queryRegion() {
            regionService.queryRegion().then(function (response) {
                vm.region = response.records;
            });
        }
        function addRegion() {
            $location.path('/app/region/add-new-region');
        }
        function deleteRegion(region) {
            regionFactory.setRegion(region);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'deleteRegion.html',
                size: 'sm',
                controller: 'RegionDeteleCtr',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                vm.queryRegion();
            });
        }
        function modifyRegion(region) {
            regionFactory.setRegion(region);
            $location.path('/app/region/modify-region');
        }
        function readRecords(start_index){
            if(start_index == 0){
                regionService.readRecords(0,'',vm.selectRegionId).then(function (response) {
                    vm.region = response.records;
                    vm.parkNumber = response.parklot_sum;
                    angular.forEach(response.records, function (value,index) {
                        vm.region[index].number =index+1;
                    });
                    vm.number.start = vm.region[0];
                    vm.number.next = vm.region[vm.region.length - 1].number;
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
            }else if(start_index == 1){
                if (vm.pagination.previous_start_index >= vm.pagination.maxid) {
                    logger.warning('已经到首页！','','没有上一页');
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                }else{
                    regionService.readRecords(vm.pagination.previous_start_index,0,vm.selectRegionId).then(function (response) {
                        vm.region = response.records;
                        vm.parkNumber = response.parklot_sum;
                        angular.forEach(response.records, function (value,index) {
                            vm.region[index].number = vm.number.start+index-response.records.length+1;
                        });
                        vm.number.start = vm.region[0];
                        vm.number.next = vm.region[vm.region.length - 1].number;
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
            }else if(start_index == 2){
                if (vm.pagination.next_start_index <= vm.pagination.minid) {
                    logger.warning('已经到最后一页！','','没有下一页');
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                }else{
                    regionService.readRecords(vm.pagination.next_start_index,1,vm.selectRegionId).then(function (response) {
                        vm.region = response.records;
                        vm.parkNumber = response.parklot_sum;
                        angular.forEach(response.records, function (value,index) {
                            vm.region[index].number = vm.number.next+index+1;
                        });
                        vm.number.start = vm.region[0];
                        vm.number.next = vm.region[vm.region.length - 1].number;
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
            }else if(start_index == 3){
                regionService.readRecords(-1,'',vm.selectRegionId).then(function (response) {
                    vm.region = response.records;
                    vm.parkNumber = response.parklot_sum;
                    angular.forEach(response.records, function (value,index) {
                        vm.region[index].number = vm.pagination.maxid -response.data.length+index+1;
                    });
                    vm.number.start = vm.region[0];
                    vm.number.next = vm.region[vm.region.length - 1].number;
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
                    vm.pagination.minid = response.minid;
                    if (response.records.length < 50) {
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
            vm.regiongAsync.selected = '';
            vm.readRecords(0);
        };
    }
})();