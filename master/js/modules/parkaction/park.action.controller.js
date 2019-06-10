(function () {
    angular.module('app.parking')
        .controller('ParkActionController', ParkActionController);
    ParkActionController.$inject = ['$location', 'ParkActionService', 'DTColumnDefBuilder', 'datatablesOptions', 'parkActionFactory', '$uibModal','$document','ManageParkingService'];
    'use strict';
    function ParkActionController($location, ParkActionService, DTColumnDefBuilder, datatablesOptions, parkActionFactory, $uibModal,$document,ManageParkingService) {
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
        vm.queryBaiDuMapParking = queryBaiDuMapParking;
        vm.queryBaiDuMapParking();
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
            vm.seletParkId = vm.eventResult.model.id;
        };
        vm.queryParkAction = queryParkAction; // 查询停车场功能表
        vm.addParkAction = addParkAction; //新增停车场功能
        vm.deleteParkAction = deleteParkAction; //删除停车场功能
        vm.modifyParkAction = modifyParkAction; //修改停车场功能
        vm.queryParkAction(0); // 初始化停车场功能表格
        vm.dtOptions = datatablesOptions.getDatatableOption().withOption('paging', false); // 获取datatables表格设置
        // 创建表格列
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2).notSortable()
        ];
        //查询停车场功能
        function queryParkAction(start_index) {
            if(start_index == 0){//首页
                ParkActionService.readRecords(0,'',vm.seletParkId).then(function (response) {
                    vm.parkAction = response.data;
                    angular.forEach(response.data, function (value,index) {
                        vm.parkAction[index].number =index+1;
                    });
                    vm.number.start = vm.parkAction[0].number;
                    vm.number.next = vm.parkAction[vm.parkAction.length - 1].number;
                    vm.pagination.next_start_index = response.data[response.data.length - 1].parklot_id;
                    vm.pagination.previous_start_index = response.data[0].parklot_id;
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
            }else if(start_index == 1){//上一页
                if (vm.pagination.previous_start_index >= vm.pagination.maxid) {
                    logger.warning('已经到首页！','','没有上一页');
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                }else{
                    ParkActionService.readRecords(vm.pagination.previous_start_index,0,vm.seletParkId).then(function (response) {
                        vm.parkAction = response.data;
                        angular.forEach(response.data, function (value,index) {
                            vm.parkAction[index].number = vm.number.start+index-response.data.length+1;
                        });
                        vm.pagination.next_start_index = response.data[response.data.length - 1].parklot_id;
                        vm.pagination.previous_start_index = response.data[0].parklot_id;
                        vm.pagination.maxid = response.maxid;
                        vm.number.start = vm.parkAction[0].number;
                        if (response.data.length < 50) {
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
                    ParkActionService.readRecords(vm.pagination.next_start_index,1,vm.seletParkId).then(function (response) {
                        vm.parkAction = response.data;
                        angular.forEach(response.data, function (value,index) {
                            vm.parkAction[index].number = vm.number.number+index;
                        });
                        vm.number.start = vm.parkAction[0].number;
                        vm.number.next = vm.parkAction[vm.parkAction.length - 1].number;
                        vm.pagination.next_start_index = response.data[response.data.length - 1].parklot_id;
                        vm.pagination.previous_start_index = response.data[0].parklot_id;
                        vm.pagination.minid = response.minid;
                        if (response.data.length < 50) {
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
                ParkActionService.readRecords(-1,'',vm.seletParkId).then(function (response) {
                    vm.parkAction = response.data;
                    angular.forEach(response.data, function (value,index) {
                        vm.parkAction[index].number = response.data[0].id+index;
                    });
                    vm.number.start = vm.parkAction[0].number;
                    vm.number.next = vm.parkAction[vm.parkAction.length - 1].number;
                    vm.pagination.next_start_index = response.data[response.data.length - 1].parklot_id;
                    vm.pagination.previous_start_index = response.data[0].parklot_id;
                    vm.pagination.minid = response.minid;
                    if (response.data.length < 50) {
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
        function addParkAction() {
            $location.path('/app/parkActionAdd');
        }
        //打开删除model
        function deleteParkAction(ParkAction) {
            parkActionFactory.setParkAction(ParkAction);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'deleteParkAction.html',
                size: 'sm',
                controller: 'DeleteParkActionController',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                vm.queryParkAction(0);
            });
        }
        //修改停车场功能
        function modifyParkAction(ParkAction) {
            parkActionFactory.setParkAction(ParkAction);
            $location.path('/app/park-power-modify');
        }
        vm.clearAndRefresh = function () {
            vm.parkingAsync.selected = null;
            vm.seletParkId = null;
            vm.queryParkAction(0);
        };
    }
})();