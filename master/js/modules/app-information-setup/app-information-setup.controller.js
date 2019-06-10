/**
 * Town.controller.js
 * @author: yumaotao
 * @create 2017/11/6
 * @feather: 区域信息表单初始化配置
 */
(function () {
    angular.module('app.inforsetup')
        .controller('inforController', inforController);
    inforController.$inject = ['$location', 'inforService', 'DTColumnDefBuilder', 'datatablesOptions', 'inforsetupFactory', '$uibModal','$document','logger'];
    'use strict';
    function inforController($location, inforService, DTColumnDefBuilder, datatablesOptions, inforsetupFactory, $uibModal,$document,logger) {
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
        // vm.queryPlatform = queryPlatform;
        vm.addPlatform = addPlatform;
        vm.deletePlatform = deletePlatform;
        vm.modifyPlatform = modifyPlatform;
        vm.readRecords = readRecords;
        vm.researchinfo=researchinfo;//搜索某一条的记录
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
        // function queryPlatform() {
        //     platformService.queryPlatform().then(function (response) {
        //         vm.platfrom = response.records;
        //     });
        // }
        function addPlatform() {
            $location.path('/app/app-setting/app-Information-addsetup');
        }
        function deletePlatform(platfrom) {
            inforsetupFactory.setPlatform(platfrom);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'infosetup.html',
                size: 'sm',
                controller: 'inforsetupDeleteController',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                vm.readRecords(0);
            });
        }
        function modifyPlatform(platfrom) {
            inforsetupFactory.setPlatform(platfrom);
            $location.path('/app/app-setting/app-Information-modifysetup');
        }
        function readRecords(start_index){
            if(start_index == 0){//首页index
                inforService.queryinfo().then(function (response) {
                    vm.seleinfo=response.records;
                    vm.platfrom =  (response.records).reverse();
                    vm.number.start = vm.platfrom[0];
                    vm.number.next = vm.platfrom[vm.platfrom.length - 1].number;
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
                    inforService.queryinfo(vm.pagination.previous_start_index,0).then(function (response) {
                        vm.platfrom =  response.records;
                        vm.number.start = vm.platfrom[0];
                        vm.number.next = vm.platfrom[vm.platfrom.length - 1].number;
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
                    inforService.queryinfo(vm.pagination.next_start_index,1).then(function (response) {
                        vm.platfrom =  response.records;
                        vm.number.start = vm.platfrom[0];
                        vm.number.next = vm.platfrom[vm.platfrom.length - 1].number;
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
                inforService.queryinfo(-1,'').then(function (response) {
                    vm.platfrom =  response.records;
                    vm.number.start = vm.platfrom[0];
                    vm.number.next = vm.platfrom[vm.platfrom.length - 1].number;
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

        //下拉框选中
        vm.onSelectCallbackinfo=function onSelectCallbackinfo(item) {
            vm.eventResult = {model: item};
            vm.seletOrinfoId= vm.eventResult.model.id;



        };
        //搜索列表
        function researchinfo() {
            inforService.queryone(vm.seletOrinfoId).then(function (response) {
                if(response.status == 0) {
                    vm.platfrom = response.records;
                }

            })

        }
        //清楚重置
        vm.clearAndRefresh=function () {
            vm.seleinfo.selected="";
            vm.seletOrinfoId="";
            vm.readRecords(0);
        }
    }
})();