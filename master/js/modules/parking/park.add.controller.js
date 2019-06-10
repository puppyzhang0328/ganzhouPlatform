/**
 * park.add.controller.js
 * @author: huangxiang
 * @create 2016-12-23 16:43
 */
(function () {
    angular.module('app.parking')
        .controller('AddParkController', AddParkController);
    AddParkController.$inject = ['$location', 'ManageParkingService', 'logger','regionService','townService','organService','policeService','busTypeService','communityService'];
    'use strict';
    function AddParkController($location, ManageParkingService, logger,regionService,townService,organService,policeService,busTypeService,communityService) {
        var vm = this;
        // vm.coupon ={
        //     valid_begintime:undefined,
        //     valid_endtime:undefined
        // };
        // moment.locale('zh-cn', {
        //     longDateFormat: {
        //         LT: 'HH:mm',
        //         LTS: 'HH:mm:ss',
        //         L: 'DD/MM/YYYY',
        //         LL: 'D MMMM YYYY',
        //         LLL: 'D MMMM YYYY LT',
        //         LLLL: 'dddd D MMMM YYYY LT'
        //     }
        // });
        // // /*时间日历设置-----------------------------------------------*/
        // vm.endDateBeforeRender = endDateBeforeRender;
        // vm.endDateOnSetTime = endDateOnSetTime;
        // vm.startDateBeforeRender = startDateBeforeRender;
        // vm.startDateOnSetTime = startDateOnSetTime;
        //
        // // $scope.isDisabledDate = function(currentDate, mode) {
        // //     currentDate.selectable = false;
        // //     // return mode === 'day' && (currentDate.getDay() === 0 || currentDate.getDay() === 6);
        // // };
        // function startDateOnSetTime() {
        //     $scope.$broadcast('start-date-changed');
        // }
        // function endDateOnSetTime() {
        //     $scope.$broadcast('end-date-changed');
        // }
        // function startDateBeforeRender($dates) {
        //     if (vm.dateRangeStart) {
        //         var activeDate = moment(vm.dateRangeStart);
        //         $dates.filter(function (date) {
        //             return date.localDateValue() >= activeDate.valueOf();
        //         }).forEach(function (date) {
        //             date.selectable = false;
        //         });
        //     }
        // }
        // function endDateBeforeRender($view, $dates) {
        //     if (vm.dateRangeStart) {
        //         var activeDate = moment(vm.dateRangeStart).subtract(1, $view).add(1, 'minute');
        //         $dates.filter(function (date) {
        //             return date.localDateValue() <= activeDate.valueOf();
        //         }).forEach(function (date) {
        //             date.selectable = false;
        //         });
        //     }
        // }
        // vm.beforeRender = function ($view, $dates, $leftDate, $upDate, $rightDate) {
        //     var index = Math.floor(Math.random() * $dates.length);
        //     $dates[index].selectable = false;
        // };

        vm.number = number;
        //正则验证表示只能是数组
        function number(item) {
            var re = new RegExp(/^[0-9]*$/ );
            if (!re.test(item)) {
                logger.error('只允许填写数字,请重新填写' , '');
                return;

            }
        }
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
                vm.selectRegion.id = vm.eventResult.model.id;
            };
            vm.selectRegion = {
                id: undefined
            };
            /*商圈选择-------------------------------------------------*/
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
                vm.seletTown.id = vm.eventResult.model.id;
            };
            vm.seletTown = {
                id: undefined
            };
            //停车场所有人
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
                vm.seletOrganman.id = vm.eventResult.model.id;
            };
            vm.seletOrganman = {
                id: undefined
            };
            //运营单位
            vm.OrganAsync = [];
            var allOrgans = [];
            organService.queryOrgan().then(function (response) {
                vm.OrganAsync = response.records;
                angular.forEach(response.records, function (value) {
                    allOrgans.push(value.id);
                });
            });
            vm.onSelectCallbackOrgan = function (item) {
                vm.eventResult = {model: item};
                vm.seletOrgan.id = vm.eventResult.model.id;
            };
            vm.seletOrgan = {
                id: undefined
            };
            //派出所信息
            vm.policeAsync = [];
            var allPolices = [];
            policeService.queryPolice().then(function (response) {
                angular.forEach(response.records, function (value, index) {
                    vm.policeAsync.push(value);
                    vm.policeAsync[index].name = value.stationName;
                    allPolices.push(value.id);
                });
            });
            vm.onSelectCallbackPolice = function (item) {
                vm.eventResult = {model: item};
                vm.seletPolice.id = vm.eventResult.model.id;
            };
            vm.seletPolice = {
                id: undefined
            };
            /*业态类型选择-------------------------------------------------*/
            vm.BusTypeAsync = [];
            var allBusTypes = [];
            busTypeService.queryBusType().then(function (response) {
                vm.BusTypeAsync = response.records;
                angular.forEach(response.records, function (value, index) {
                    vm.BusTypeAsync[index].name = value.genrename;
                    allBusTypes.push(value.id);
                });
            });
            vm.onSelectCallbackBusType = function (item) {
                vm.eventResult = {model: item};
                vm.selectBusType.id = vm.eventResult.model.id;
                vm.selectBusType.name = vm.eventResult.model.name;
            };
            vm.selectBusType = {
                id: undefined
            };
            /*社区信息-------------------------------------------------*/
            vm.CommunityAsync = [];
            var allCommunityes = [];
            communityService.queryCommunity().then(function (response) {
                vm.CommunityAsync = response.records;
                angular.forEach(response.records, function (value, index) {
                    vm.CommunityAsync[index].name = value.name;
                    allCommunityes.push(value.id);
                });
            });
            vm.onSelectCallbackCommunity = function (item) {
                vm.eventResult = {model: item};
                vm.selectCommunity.id = vm.eventResult.model.id;
                vm.selectCommunity.name = vm.eventResult.model.name;
            };
            vm.selectCommunity = {
                id: undefined
            };
            /*硬件厂商-------------------------------------------------*/
            vm.HardwareyAsync = [];
            var allhardwares = [];
            organService.queryOrgan().then(function (response) {
                vm.HardwareyAsync = response.records;
                angular.forEach(response.records, function (value) {
                    allhardwares.push(value.id);
                });
            });
            vm.onSelectCallbackHardware = function (item) {
                vm.eventResult = {model: item};
                vm.seletHardware.id = vm.eventResult.model.id;
            };
            vm.seletHardware = {
                id: undefined
            };
            /*软件厂商-------------------------------------------------*/
            vm.SoftwareAsync = [];
            var allsoftwares = [];
            organService.queryOrgan().then(function (response) {
                vm.SoftwareAsync = response.records;
                angular.forEach(response.records, function (value) {
                    allsoftwares.push(value.id);
                });
            });
            vm.onSelectCallbackSoftware = function (item) {
                vm.eventResult = {model: item};
                vm.seletSoftware.id = vm.eventResult.model.id;
            };
            vm.seletSoftware = {
                id: undefined
            };
            vm.addParking = addParking; // 添加停车场
            vm.backToPrevious = backToPrevious; // 返回上一层菜单
            function addParking() {

                vm.parking.region = vm.selectRegion.id;
                vm.parking.placetype = vm.seletTown.id;
                vm.parking.manage_company = vm.seletOrgan.id;
                vm.parking.owner = vm.seletOrganman.id;
                vm.parking.policestationid = vm.seletPolice.id;
                vm.parking.businessid = vm.selectBusType.id;
                vm.parking.community = vm.selectCommunity.id;
                vm.parking.hardware = vm.seletHardware.id;
                vm.parking.software = vm.seletSoftware.id;
                vm.parking.sign = vm.parking.sign || "True";
                ManageParkingService.addParking(vm.parking.name, vm.parking.address, vm.parking.city_code, vm.parking.price, vm.parking.parking_space_total, vm.parking.owner, vm.parking.acreage, vm.parking.chargetype, vm.parking.has_internet, vm.parking.is_entrusted, vm.parking.is_plate_rec, vm.parking.is3rd, vm.parking.is_active, vm.parking.placetype, vm.parking.zonename, vm.parking.region, vm.parking.manage_company, vm.parking.databasever, vm.parking.osver, vm.parking.hardwarever, vm.parking.softwarever, vm.parking.description, vm.parking.policestationid, vm.parking.businessid, vm.parking.community, vm.parking.hardware, vm.parking.software, vm.parking.type, vm.parking.is_show, vm.parking.sign, vm.freeouttime).then(function (response) {
                    if (response.data.status === 0) {
                        logger.success('添加成功' + '停车场：' + vm.parking.name, '操作成功');
                        $location.path('/app/parking');
                    } else if (response.status === 40004) {
                        logger.error('添加失败' + '"' + vm.parking.name + '"' + '失败!', '该停车场已经存在！');
                    } else if (response.data.status === 10002) {
                        logger.error('添加失败' + '"' + vm.parking.name + '"' + '失败!', '缺少必填字段！');
                    } else {
                        logger.error('添加失败');
                    }
                });
            }

            function backToPrevious() {
                $location.path('/app/parking');
            }
        }

})();