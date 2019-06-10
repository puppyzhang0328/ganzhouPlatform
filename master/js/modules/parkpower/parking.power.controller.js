(function () {
    angular.module('app.parking')
        .controller('ParkPowerController', ParkPowerController);
    ParkPowerController.$inject = ['$location', 'ParkPowerService', 'DTColumnDefBuilder', 'datatablesOptions', 'parkPowerFactory', '$uibModal','$document'];
    'use strict';
    function ParkPowerController($location, ParkPowerService, DTColumnDefBuilder, datatablesOptions, parkPowerFactory, $uibModal,$document) {
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
        vm.queryParkPower = queryParkPower; // 查询停车场功能
        vm.addParkPower = addParkPower; //新增停车场功能
        vm.deleteParkPower = deleteParkPower; //删除停车场功能
        vm.modifyParkPower = modifyParkPower; //修改停车场功能
        vm.queryParkPower(0); // 初始化停车场功能表格
        vm.dtOptions = datatablesOptions.getDatatableOption().withOption('paging', false); // 获取datatables表格设置
        // 创建表格列
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2).notSortable()
        ];
        //查询停车场功能
        function queryParkPower(start_index) {
            if(start_index == 0){//首页index
                ParkPowerService.readRecords(0,'').then(function (response) {
                    vm.parkPower = response.records;
                    angular.forEach(response.records, function (value,index) {
                        vm.parkPower[index].number =index+1;
                    });
                    vm.number.start = vm.parkPower[0];
                    vm.number.next = vm.parkPower[vm.parkPower.length - 1].number;
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
                    ParkPowerService.readRecords(vm.pagination.previous_start_index,0).then(function (response) {
                        vm.parkPower = response.records;
                        angular.forEach(response.records, function (value,index) {
                            vm.parkPower[index].number = vm.number.start+index-response.records.length+1;
                        });
                        vm.number.start = vm.parkPower[0];
                        vm.number.next = vm.parkPower[vm.parkPower.length - 1].number;
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
                    ParkPowerService.readRecords(vm.pagination.next_start_index,1).then(function (response) {
                        vm.parkPower = response.records;
                        angular.forEach(response.records, function (value,index) {
                            vm.parkPower[index].number = vm.number.number+index;
                        });
                        vm.number.start = vm.parkPower[0];
                        vm.number.next = vm.parkPower[vm.parkPower.length - 1].number;
                        vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                        vm.pagination.previous_start_index = response.records[0].id;
                        vm.pagination.minid = response.minid;
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
            }else if(start_index == 3){//加载最后一页
                ParkPowerService.readRecords(-1,'').then(function (response) {
                    vm.parkPower = response.records;
                    angular.forEach(response.records, function (value,index) {
                        vm.parkPower[index].number = response.records[0].id+index;
                    });
                    vm.number.start = vm.parkPower[0];
                    vm.number.next = vm.parkPower[vm.parkPower.length - 1].number;
                    vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                    vm.pagination.previous_start_index = response.records[0].id;
                    vm.pagination.minid = response.minid;
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
        }
        //新增停车场功能
        function addParkPower() {
            $location.path('/app/parkPowerAdd');
        }
        //打开删除model
        function deleteParkPower(parkPower) {
            parkPowerFactory.setParkPower(parkPower);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'deleteParkPower.html',
                size: 'sm',
                controller: 'ParkPowerDeleteController',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                vm.queryParkPower(0);
            });
        }
        //修改停车场功能
        function modifyParkPower(parkPower) {
            console.log(parkPower);
            parkPowerFactory.setParkPower(parkPower);
            $location.path('/app/parkPowerModify');
        }
    }
})();