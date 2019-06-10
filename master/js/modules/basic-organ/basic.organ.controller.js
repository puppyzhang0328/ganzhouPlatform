(function () {
    angular.module('app.basicinfo')
        .controller('OrganController',OrganController);
    OrganController.$inject = ['$location', 'organService', 'DTColumnDefBuilder', 'datatablesOptions','organFactory', '$uibModal','logger','$document'];
    'use strict';
    function OrganController($location,organService,DTColumnDefBuilder,datatablesOptions,organFactory,$uibModal,logger,$document) {
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
        vm.addOrgan = addOrgan;//新增公交车公司
        vm.modifyOrgan = modifyOrgan;//修改组织
        vm.deleteOrgan = deleteOrgan;//删除组织
        vm.backToPrevious = backToPrevious;//返回上一级
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
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6),
            DTColumnDefBuilder.newColumnDef(7),
            DTColumnDefBuilder.newColumnDef(8),
            DTColumnDefBuilder.newColumnDef(9).notSortable()
        ];
        /**
         * 新增组织
         */
        function addOrgan() {
            $location.path('/app/organ/add-new-organ');
        }
        //停车场所有人
        var selectOrganman = [];//所选择的停车场所有人
        vm.OrganmanAsync = [];
        var allOrganmans = [];
        organService.queryOrgan().then(function (response) {
            vm.OrganmanAsync = response.records;
            angular.forEach(response.records, function (value) {
                allOrganmans.push(value.id);
            });
        });
        vm.onSelectCallbackOrganman = function (item) {
            vm.eventResult = {model: item};
            vm.seletOrganmanId = vm.eventResult.model.id;
        };
        /**
         * 修改组织
         */
        function modifyOrgan(organ) {
            organFactory.setOrgan(organ);
            $location.path('/app/organ/modify-organ');
        }
        /**
         * 打开删除组织的modal;
         */
        function deleteOrgan(organ) {
            organFactory.setOrgan(organ);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'deleteOrgan.html',
                size: 'sm',
                controller: 'organDeteleCtr',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                vm.queryOrgan();
            });
        }
        /*
        * 返回上一级
         */
        function backToPrevious() {
            $location.path('/app/organ');
        }

        //查询组织
        function readRecords(start_index){
            if(start_index == 0){//首页index
                organService.readRecords(0,'',vm.seletOrganmanId).then(function (response) {
                    if(response.status == 0){
                        vm.organ = response.records;
                        vm.parkNumber = response.parklot_sum;
                        angular.forEach(response.records, function (value,index) {
                            vm.organ[index].number =index+1;
                        });
                        vm.number.start = vm.organ[0].number;
                        vm.number.next = vm.organ[vm.organ.length - 1].number;
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
                    }else {
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    }
                });
            }else if(start_index == 1){//上一页
                if (vm.pagination.previous_start_index >= vm.pagination.maxid) {
                    logger.warning('已经到首页！','','没有上一页');
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                }else{
                    organService.readRecords(vm.pagination.previous_start_index,0,vm.seletOrganmanId).then(function (response) {
                        if(response.status == 0) {
                            vm.organ = response.records;
                            vm.parkNumber = response.parklot_sum;
                            angular.forEach(response.records, function (value, index) {
                                vm.organ[index].number = vm.number.start + index - response.records.length + 1;
                            });
                            vm.number.start = vm.organ[0].number;
                            vm.number.next = vm.organ[vm.organ.length - 1].number;
                            vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                            vm.pagination.previous_start_index = response.records[0].id;
                            vm.pagination.maxid = response.maxid;
                            if (response.records.length < 50) {
                                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                            } else {
                                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                            }
                        }else {
                            angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                            angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                            angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                            angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                        }
                    });
                }
            }else if(start_index == 2){//下一页
                if (vm.pagination.next_start_index <= vm.pagination.minid) {
                    logger.warning('已经到最后一页！','','没有下一页');
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                }else{
                    organService.readRecords(vm.pagination.next_start_index,1,vm.seletOrganmanId).then(function (response) {
                        if(response.status == 0) {
                            vm.organ = response.records;
                            vm.parkNumber = response.parklot_sum;
                            angular.forEach(response.records, function (value, index) {
                                vm.organ[index].number = vm.number.number + index;
                            });
                            vm.number.start = vm.organ[0].number;
                            vm.number.next = vm.organ[vm.organ.length - 1].number;
                            vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                            vm.pagination.previous_start_index = response.records[0].id;
                            vm.pagination.minid = response.minid;
                            if (response.records.length < 50) {
                                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                            } else {
                                angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                                angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                                angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                                angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                            }
                        }else {
                            angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                            angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                            angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                            angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                        }
                    });
                }
            }else if(start_index == 3){//加载最后一页
                organService.readRecords(-1,'',vm.seletOrganmanId).then(function (response) {
                    if(response.status == 0) {
                        vm.organ = response.records;
                        vm.parkNumber = response.parklot_sum;
                        angular.forEach(response.records, function (value, index) {
                            vm.organ[index].number = response.records[0].id + index;
                        });
                        vm.number.start = vm.organ[0].number;
                        vm.number.next = vm.organ[vm.organ.length - 1].number;
                        vm.pagination.next_start_index = response.records[response.records.length - 1].id;
                        vm.pagination.previous_start_index = response.records[0].id;
                        vm.pagination.minid = response.minid;
                        if (response.records.length < 50) {
                            angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                            angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                        } else {
                            angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                            angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                            angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                        }
                    }else {
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    }
                });
            }
        }
        vm.clearAndRefresh = function () {
            vm.seletOrganmanId = '';
            vm.OrganmanAsync.selected = '';
            vm.readRecords(0);
        };
        vm.queryOne = queryOne;
        function queryOne() {
            organService.queryOne(vm.seletOrganmanId).then(function (response) {
                if(response.status == 0) {
                    vm.organ = response.records;
                    vm.parkNumber = response.parklot_sum;
                    vm.organ[0].number = response.records[0].id;
                }
            });
        }
    }
})();