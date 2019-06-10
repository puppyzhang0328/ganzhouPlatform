/**
 * Town.controller.js
 * @author: yumaotao
 * @create 2017/11/6
 * @feather: 区域信息表单初始化配置
 */
(function () {
    angular.module('app.basicinfo')
        .controller('platfromPowerController', platfromPowerController);
    platfromPowerController.$inject = ['$location', 'platformService', 'DTColumnDefBuilder', 'datatablesOptions', 'platformFactory', '$uibModal','$document','logger'];
    'use strict';
    function platfromPowerController($location, platformService, DTColumnDefBuilder, datatablesOptions, platformFactory, $uibModal,$document,logger) {
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
        vm.queryPlatformPower = queryPlatformPower;
        vm.modifyPlatformPower = modifyPlatformPower;
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
            DTColumnDefBuilder.newColumnDef(7).notSortable()
        ];
        function queryPlatformPower() {
            platformService.queryPlatform().then(function (response) {
                vm.platfromPowerPower = response.records;
            });
        }
        function modifyPlatformPower(platfrom) {
            platformFactory.setPlatform(platfrom);
            $location.path('/app/platform/modify-platform-power');
        }
        function readRecords(start_index){
            if(start_index == 0){//首页index
                platformService.readRecords(0,'').then(function (response) {
                    vm.platfromPower =  response.records;
                    vm.number.start = vm.platfromPower[0];
                    vm.number.next = vm.platfromPower[vm.platfromPower.length - 1].number;
                    vm.pagination.next_start_index =  response.records[ response.records.length - 1].id;
                    vm.pagination.previous_start_index =  response.records[0].id;
                    vm.pagination.maxid = response.maxid;
                    if ( response.records.length < 50) {
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
                    platformService.readRecords(vm.pagination.previous_start_index,0).then(function (response) {
                        vm.platfromPower =  response.records;
                        vm.number.start = vm.platfromPower[0];
                        vm.number.next = vm.platfromPower[vm.platfromPower.length - 1].number;
                        vm.pagination.next_start_index =  response.records[ response.records.length - 1].id;
                        vm.pagination.previous_start_index =  response.records[0].id;
                        vm.pagination.maxid = response.maxid;
                        if ( response.records.length < 50) {
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
                    platformService.readRecords(vm.pagination.next_start_index,1).then(function (response) {
                        vm.platfromPower =  response.records;
                        vm.number.start = vm.platfromPower[0];
                        vm.number.next = vm.platfromPower[vm.platfromPower.length - 1].number;
                        vm.pagination.next_start_index =  response.records[ response.records.length - 1].id;
                        vm.pagination.previous_start_index =  response.records[0].id;
                        vm.pagination.minid = response.minid;
                        if ( response.records.length < 50) {
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
                platformService.readRecords(-1,'').then(function (response) {
                    vm.platfromPower =  response.records;
                    vm.number.start = vm.platfromPower[0];
                    vm.number.next = vm.platfromPower[vm.platfromPower.length - 1].number;
                    vm.pagination.next_start_index =  response.records[ response.records.length - 1].id;
                    vm.pagination.previous_start_index =  response.records[0].id;
                    vm.pagination.minid = response.minid;
                    if ( response.records.length < 50) {
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
    }
})();