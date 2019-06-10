(function () {
    'use strict';
    angular.module('app.parking')
        .controller('netStateController', netStateController);
    netStateController.$inject = ['ManageParkingService', 'ParkingStateService', 'DTColumnDefBuilder', 'datatablesOptions','$document','logger','URL_SEED','$scope','$timeout'];
    function netStateController(ManageParkingService, ParkingStateService, DTColumnDefBuilder, datatablesOptions,$document,logger,URL_SEED,$scope,$timeout) {
        var vm = this;
        vm.queryBaiDuMapParking = queryBaiDuMapParking;
        vm.queryBaiDuMapParking();

        vm.dtOptions = datatablesOptions.getDatatableOption();
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3)
        ];
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

        /*时间日历设置------------------------------------------------*/
        //网络与上传工具的设置的参数

        vm.pagination = {
            querytype: {
                parklot:'parklot',
                uptool: 'uptool'
            },
            next_start_index:0,
            previous_start_index:0,
            maxid: 0,
            minid: 0,
            state:{
                online:'online',
                offline:'offline'
            }

        };


//不在线的上传工具
        vm.readRecords=readRecords;
        function readRecords(start_index){
            if(start_index == 0){//首页index
                ParkingStateService.readRecords(vm.pagination.querytype.parklot,0,"").then(function (response) {
                    vm.network_offline_num = [];
                    angular.forEach(response.records, function (value,index) {
                        value.number=index+1;
                        value.htttpName = '已接入';
                        vm.network_offline_num.push(value);
                    });
                    //确定索引
                    vm.start_number=vm.network_offline_num[vm.network_offline_num.length-1].number;
                    vm.pagination.next_start_index =  response.records[ response.records.length - 1].parklot_id;
                    vm.pagination.previous_start_index =  response.records[0].parklot_id;
                    vm.pagination.maxid = response.maxid;
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                });
            }else if(start_index == 1){//上一页
                if (vm.pagination.previous_start_index >= vm.pagination.maxid) {
                    logger.warning('已经到首页！','','没有上一页');
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = true;
                }else{
                    ParkingStateService.readRecords(vm.pagination.querytype.parklot,vm.pagination.previous_start_index,0).then(function (response) {
                        vm.network_offline_num = [];
                        if(vm.next_number-100<=0){
                            angular.forEach(response.records, function (value,index) {
                                value.number=index+1;
                                value.htttpName = '已接入';
                                vm.network_offline_num.push(value);

                            });
                        }else {
                            angular.forEach(response.records, function (value,index) {
                                value.number=(vm.next_number-100)+index;
                                value.htttpName = '已接入';
                                vm.network_offline_num.push(value);

                            });
                        }

                        vm.next_number=vm.network_offline_num[0].number;
                        vm.start_number=vm.network_offline_num[vm.network_offline_num.length-1].number;
                        //测试服务器排序
                        vm.pagination.next_start_index =  response.records[0].parklot_id ;
                        vm.pagination.previous_start_index = response.records[ response.records.length - 1].parklot_id ;
                        //正式服务器排序
                        // vm.pagination.next_start_index = response.records[ response.records.length - 1].parklot_id;
                        // vm.pagination.previous_start_index =response.records[0].parklot_id;
                        vm.pagination.maxid = response.maxid;
                        angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                        angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                    });
                }
            }else if(start_index == 2){//下一页
                if (vm.pagination.next_start_index <= vm.pagination.minid) {
                    logger.warning('已经到最后一页！','','没有下一页');
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                }else{
                    ParkingStateService.readRecords(vm.pagination.querytype.parklot,vm.pagination.next_start_index,1).then(function (response) {
                        vm.network_offline_num = [];
                        angular.forEach(response.records, function (value,index) {
                            value.number=vm.start_number+(index+1);
                            value.htttpName = '已接入';
                            vm.network_offline_num.push(value);
                        });
                        vm.start_number=vm.network_offline_num[vm.network_offline_num.length-1].number;
                        vm.next_number=vm.network_offline_num[0].number;
                        vm.pagination.next_start_index =  response.records[ response.records.length - 1].parklot_id;
                        vm.pagination.previous_start_index =  response.records[0].parklot_id;
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
                ParkingStateService.readRecords(vm.pagination.querytype.parklot,-1,"").then(function (response) {
                    vm.network_offline_num = [];
                    angular.forEach(response.records, function (value,index) {
                        value.number=2000+(index+1);
                        value.htttpName = '已接入';
                        vm.network_offline_num.push(value);
                    });
                    //索引
                    vm.next_number=vm.network_offline_num[0].number;
                    // //测试服务器排序
                    vm.pagination.next_start_index =  response.records[0].parklot_id ;
                    vm.pagination.previous_start_index = response.records[ response.records.length - 1].parklot_id ;
                    //正式服务器排序
                    // vm.pagination.next_start_index = response.records[ response.records.length - 1].parklot_id  ;
                    // vm.pagination.previous_start_index =  response.records[0].parklot_id;
                    vm.pagination.minid = response.minid;
                    angular.element($document[0].getElementById('nextPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('lastPageBtn'))[0].disabled = true;
                    angular.element($document[0].getElementById('firstPageBtn'))[0].disabled = false;
                    angular.element($document[0].getElementById('previousPageBtn'))[0].disabled = false;
                });
            }
        }
        vm.readRecords(0);

        //在线的上传工具
        vm.onlineupload=onlineupload;
        function onlineupload() {
            ParkingStateService.onlineRecords(vm.pagination.querytype.parklot,vm.pagination.state.online).then(function (response) {
                vm.sum=response.data_sum;
                vm.network_online_num = [];
                angular.forEach(response.records, function (value,index) {
                    // value[index].number=index+1;

                    value.htttpName = '已接入';
                    vm.network_online_num.push(value);

                });

            })
        }
        vm.onlineupload();

        //点击搜索按钮
        vm.reseach=function () {
            ParkingStateService.queryOneRecords(vm.pagination.querytype.parklot,vm.seletParkId).then(function (response) {
                if(response.status==0){
                    //1为不在线 0位为在线
                    if(response.records[0].httpstatus==1 ||response.records[0].mqttstatus==1){
                        vm.network_offline_num=[];
                        angular.forEach(response.records, function (value,index) {
                            value.number=index+1;
                            value.htttpName = '已接入';
                            vm.network_offline_num.push(value);

                        });
                    }else {
                        vm.network_online_num = [];
                        angular.forEach(response.records, function (value,index) {
                            value.number=index+1;
                            value.htttpName = '已接入';
                            vm.network_online_num.push(value);

                        });
                    }
                }

            })



        };

        //重置
        vm.clearAndRefresh = function () {
            vm.seletParkId = '';
            vm.parkingAsync.selected = '';
            vm.readRecords(0);
            vm.onlineupload();
        };
        //鼠标移入事件
        vm.mouseeters=function ($event) {
            // alert('222222');
            // console.log($event);
            $($event.target).addClass("tbd");



        }
    }

})();