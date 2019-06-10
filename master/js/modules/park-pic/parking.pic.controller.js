(function () {
    angular.module('app.parking')
        .controller('parkPicController', parkPicController);
    parkPicController.$inject = ['$location', 'ManageParkingService', 'currentClickPark', '$uibModal','$document','regionService','URL_SEED','logger','ParkingPicFactory'];
    'use strict';
    function parkPicController($location, ManageParkingService, currentClickPark, $uibModal,$document,regionService,URL_SEED,logger,ParkingPicFactory) {
        var vm = this;
        vm.picture_no='';vm.lat_long_no='';vm.price_no='';vm.placetype_no='';vm.other_platform='';
        vm.queryBaiDuMapParking = queryBaiDuMapParking;
        vm.queryBaiDuMapParking();
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
            vm.selectRegionId = vm.eventResult.model.id;
        };
        vm.parkingAsync = [];
        var allParkLots = [];
        var start_index = 0;
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
        vm.seletPark = {
            id: undefined
        };
        vm.queryParkings = queryParkings; // 查询所有停车场
        vm.queryParkIdentifier = queryParkIdentifier; // 查询停车场密钥
        vm.queryParkingGate = queryParkingGate; // 查询停车场入口
        vm.addParkingLot = addParkingLot; //新增停车场
        vm.UpdateParkingLot=UpdateParkingLot;//修改图片
        vm.queryParkings(0); // 初始化停车场表格数据
        function queryParkingGate(parkId) {
            ManageParkingService.queryGates(parkId).then(function (response) {
               vm.parkgate = response.parkgate;
            });
        }
        /**
         * 新增停车场.跳转至新增停车场界面
         */
        function addParkingLot() {
            $location.path('/app/parkPic/parking-pic-upload');
        }
        //点击图片显示修改和删除
        function UpdateParkingLot($event,parking_lots) {
            ParkingPicFactory.setPark(parking_lots.identifier);
            console.log(parking_lots.identifier);
               $('.opcs').addClass("opc");
            $($event.target).removeClass("opc");

            // $location.path('/app/parkPic/parking-updatapic');
        }
        //点击修改图片
        vm.picupdate=function () {
            $location.path('/app/parkPic/parking-updatapic');
        };


        function queryParkIdentifier(parking) {
            currentClickPark.setPark(parking);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: '/park/app/views/partials/query-park-detail.html',
                size: 'lg',
                controller: 'QueryIdentifierController',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                vm.queryParkings(0);
            });
        }
        //查询停车场
        function queryParkings(start_index){
            if(start_index == 0){//首页index
                ManageParkingService.readRecords(0,'',vm.selectRegionId,'',vm.picture_no,vm.lat_long_no,vm.price_no,vm.other_platform,vm.seletParkId).then(function (response) {
                    vm.parking_lots = response.parking_lots;
                    angular.forEach(response.parking_lots, function (value,index) {
                        if(value.image){
                            vm.parking_lots[index].src =URL_SEED.IMG_URL+'media/'+value.image;
                        }else {
                            vm.parking_lots[index].src = URL_SEED.API_IMGURL+'app/img/no_pic.png';
                        }
                    });
                    vm.number.start = vm.parking_lots[0];
                    vm.number.next = vm.parking_lots[vm.parking_lots.length - 1].number;
                    vm.pagination.next_start_index = response.parking_lots[response.parking_lots.length - 1].id;
                    vm.pagination.previous_start_index = response.parking_lots[0].id;
                    vm.pagination.maxid = response.maxid;
                    if (response.parking_lots.length < 50) {
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
                    ManageParkingService.readRecords(vm.pagination.previous_start_index,0,vm.selectRegionId,'',vm.picture_no,vm.lat_long_no,vm.price_no,vm.other_platform,vm.seletParkId).then(function (response) {
                        vm.parking_lots = response.parking_lots;
                        angular.forEach(response.parking_lots, function (value,index) {
                            if(value.image){
                                vm.parking_lots[index].src =URL_SEED.IMG_URL+'media/'+value.image;
                            }else {
                                vm.parking_lots[index].src = URL_SEED.API_IMGURL+'app/img/no_pic.png';
                            }
                        });
                        vm.number.start = vm.parking_lots[0];
                        vm.number.next = vm.parking_lots[vm.parking_lots.length - 1].number;
                        vm.pagination.next_start_index = response.parking_lots[response.parking_lots.length - 1].id;
                        vm.pagination.previous_start_index = response.parking_lots[0].id;
                        vm.pagination.maxid = response.maxid;
                        if (response.parking_lots.length < 50) {
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
                    ManageParkingService.readRecords(vm.pagination.next_start_index,1,vm.selectRegionId,'',vm.picture_no,vm.lat_long_no,vm.price_no,vm.other_platform,vm.seletParkId).then(function (response) {
                        vm.parking_lots = response.parking_lots;
                        angular.forEach(response.parking_lots, function (value,index) {
                            if(value.image){
                                vm.parking_lots[index].src =URL_SEED.IMG_URL+'media/'+value.image;
                            }else {
                                vm.parking_lots[index].src = URL_SEED.API_IMGURL+'app/img/no_pic.png';
                            }
                        });
                        vm.number.start = vm.parking_lots[0];
                        vm.number.next = vm.parking_lots[vm.parking_lots.length - 1].number;
                        vm.pagination.next_start_index = response.parking_lots[response.parking_lots.length - 1].id;
                        vm.pagination.previous_start_index = response.parking_lots[0].id;
                        vm.pagination.minid = response.minid;
                        if (response.parking_lots.length < 50) {
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
                ManageParkingService.readRecords(-1,'',vm.selectRegionId,'',vm.picture_no,vm.lat_long_no,vm.price_no,vm.other_platform,vm.seletParkId).then(function (response) {
                    vm.parking_lots = response.parking_lots;
                    angular.forEach(response.parking_lots, function (value,index) {
                        if(value.image){
                            vm.parking_lots[index].src =URL_SEED.IMG_URL+'media/'+value.image;
                        }else {
                            vm.parking_lots[index].src = URL_SEED.API_IMGURL+'app/img/no_pic.png';
                        }
                    });
                    vm.number.start = vm.parking_lots[0];
                    vm.number.next = vm.parking_lots[vm.parking_lots.length - 1].number;
                    vm.pagination.next_start_index = response.parking_lots[response.parking_lots.length - 1].id;
                    vm.pagination.previous_start_index = response.parking_lots[0].id;
                    vm.pagination.minid = response.minid;
                    if (response.parking_lots.length < 50) {
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
            vm.parkingAsync.selected = null;vm.picture_no = null;vm.lat_long_no = null;vm.price_no = null;vm.other_platform = null;
            vm.seletParkId = '';
            vm.selectRegionId = '';
            vm.readRecords(0);
        };
    }
})();