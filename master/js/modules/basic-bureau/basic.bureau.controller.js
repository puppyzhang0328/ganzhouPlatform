/**
 * Town.controller.js
 * @author: yumaotao
 * @create 2017/11/6
 * @feather: 区域信息表单初始化配置
 */
(function () {
    angular.module('app.basicinfo')
        .controller('bureauController', bureauController);
    bureauController.$inject = ['$location', 'bureauService', 'DTColumnDefBuilder', 'datatablesOptions', 'bureauFactory', '$uibModal','$document','logger','regionService'];
    'use strict';
    function bureauController($location, bureauService, DTColumnDefBuilder, datatablesOptions, bureauFactory, $uibModal,$document,logger,regionService) {
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
        /*区域选择-------------------------------------------------*/
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
            vm.selectRegionId= vm.eventResult.model.id;
        };
        vm.bureaugAsync = [];
        var allBureaus = [];
        bureauService.queryBureau().then(function (response) {
            // vm.bureaugAsync = response.records;
            angular.forEach(response.records, function (value,index) {
                vm.bureaugAsync.push(value);
                vm.bureaugAsync[index].name = value.cityproperName;
                allBureaus.push(value.id);
            });
        });
        vm.onSelectCallbackBureau = function (item) {
            vm.eventResult = {model: item};
            vm.selectBureauId = vm.eventResult.model.id;
        };
        vm.queryBureau = queryBureau;
        vm.addBureau = addBureau;
        vm.deleteBureau = deleteBureau;
        vm.modifyBureau = modifyBureau;
        vm.readRecords = readRecords;
        vm.readRecords(0);
        vm.dtOptions = datatablesOptions.getDatatableOption(); // 获取datatables表格设置
        // 创建表格列
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5).notSortable()
        ];
        function queryBureau() {
            bureauService.queryBureau().then(function (response) {
                vm.bureau = response.records;
            });
        }
        function addBureau() {
            $location.path('/app/bureau/add-new-bureau');
        }
        function deleteBureau(bureau) {
            bureauFactory.setBureau(bureau);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'deleteBureau.html',
                size: 'sm',
                controller: 'bureauDeleteController',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                vm.queryBureau();
            });
        }
        function modifyBureau(bureau) {
            bureauFactory.setBureau(bureau);
            $location.path('/app/bureau/modify-bureau');
        }
        function readRecords(start_index){
            if(start_index == 0){//首页index
                bureauService.readRecords(0,'',vm.selectRegionId,vm.selectBureauId).then(function (response) {
                    vm.bureau = response.records;
                    vm.parkNumber = response.parklot_sum;
                    angular.forEach(response.records, function (value,index) {
                        vm.bureau[index].number =index+1;
                    });
                    vm.number.start = vm.bureau[0].number;
                    vm.number.next = vm.bureau[vm.bureau.length - 1].number;
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
                    bureauService.readRecords(vm.pagination.previous_start_index,0,vm.selectRegionId,vm.selectBureauId).then(function (response) {
                        vm.bureau = response.records;
                        vm.parkNumber = response.parklot_sum;
                        angular.forEach(response.records, function (value,index) {
                            vm.bureau[index].number = vm.number.start+index-response.records.length+1;
                        });
                        vm.number.start = vm.bureau[0].number;
                        vm.number.next = vm.bureau[vm.bureau.length - 1].number;
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
                    bureauService.readRecords(vm.pagination.next_start_index,1,vm.selectRegionId,vm.selectBureauId).then(function (response) {
                        vm.bureau = response.records;
                        vm.parkNumber = response.parklot_sum;
                        angular.forEach(response.records, function (value,index) {
                            vm.bureau[index].number = vm.number.number+index;
                        });
                        vm.number.start = vm.bureau[0].number;
                        vm.number.next = vm.bureau[vm.bureau.length - 1].number;
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
                bureauService.readRecords(-1,'',vm.selectRegionId,vm.selectBureauId).then(function (response) {
                    vm.bureau = response.records;
                    vm.parkNumber = response.parklot_sum;
                    angular.forEach(response.records, function (value,index) {
                        vm.bureau[index].number = response.records[0].id+index;
                    });
                    vm.number.start = vm.bureau[0].number;
                    vm.number.next = vm.bureau[vm.bureau.length - 1].number;
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
            vm.regiongAsync.selected = '';
            vm.bureaugAsync.selected = '';
            vm.selectRegionId = '';
            vm.selectBureauId = '';
            vm.readRecords(0);
        };
    }
})();