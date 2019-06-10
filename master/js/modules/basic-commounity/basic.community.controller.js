(function () {
    angular.module('app.basicinfo')
        .controller('communityCtr', communityCtr);
    communityCtr.$inject = ['$location', 'communityService', 'DTColumnDefBuilder', 'datatablesOptions', 'communityFactory', '$uibModal','$document','logger'];
    'use strict';
    function communityCtr($location, communityService, DTColumnDefBuilder, datatablesOptions, communityFactory, $uibModal,$document,logger) {
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
        vm.queryCommunity = queryCommunity;
        vm.addCommunity = addCommunity;
        vm.deleteCommunity = deleteCommunity;
        vm.modifyCommunity = modifyCommunity;
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
            DTColumnDefBuilder.newColumnDef(6).notSortable()
        ];
        function queryCommunity() {
            communityService.queryCommunity().then(function (response) {
                vm.community = response.records;
            });
        }
        function addCommunity() {
            $location.path('/app/community/add-new-community');
        }
        function deleteCommunity(Community) {
            communityFactory.setCommunity(Community);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'deleteCommunity.html',
                size: 'sm',
                controller: 'CommunityDeteleCtr',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                vm.queryCommunity();
            });
        }
        function modifyCommunity(Community) {
            communityFactory.setCommunity(Community);
            $location.path('/app/community/modify-community');
        }
        function readRecords(start_index){
            if(start_index == 0){//首页index
                communityService.readRecords(0,'').then(function (response) {
                    vm.community = response.records;
                    vm.parkNumber = response.parklot_sum;
                    angular.forEach(response.records, function (value,index) {
                        vm.community[index].number =index+1;
                    });
                    vm.number.start = vm.community[0];
                    vm.number.next = vm.community[vm.community.length - 1].number;
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
                    communityService.readRecords(vm.pagination.previous_start_index,0).then(function (response) {
                        vm.community = response.records;
                        vm.parkNumber = response.parklot_sum;
                        angular.forEach(response.records, function (value,index) {
                            vm.community[index].number = vm.number.start+index-response.records.length+1;
                        });
                        vm.number.start = vm.community[0];
                        vm.number.next = vm.community[vm.community.length - 1].number;
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
                    communityService.readRecords(vm.pagination.next_start_index,1).then(function (response) {
                        vm.community = response.records;
                        vm.parkNumber = response.parklot_sum;
                        angular.forEach(response.records, function (value,index) {
                            vm.community[index].number = vm.number.number+index;
                        });
                        vm.number.start = vm.community[0];
                        vm.number.next = vm.community[vm.community.length - 1].number;
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
                communityService.readRecords(-1,'').then(function (response) {
                    vm.community = response.records;
                    vm.parkNumber = response.parklot_sum;
                    angular.forEach(response.records, function (value,index) {
                        vm.community[index].number = response.records[0].id+index;
                    });
                    vm.number.start = vm.community[0];
                    vm.number.next = vm.community[vm.community.length - 1].number;
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
    }
})();