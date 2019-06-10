(function () {
    angular.module('app.parking')
        .controller('BMapController', BMapController);
    BMapController.$inject = ['ManageParkingService','regionService','URL_SEED','logger','$timeout'];
    'use strict';
    function BMapController(ManageParkingService,regionService,URL_SEED,logger,$timeout) {
        var vm = this;
        // 112.985002,28.199722
        vm.redNumber = 0;
        vm.yellowNumber = 0;
        vm.greenNumber = 0;
        var longitude = 112.985002;
        var latitude = 28.199722;
         vm.marksArray = []; // mark集合
        var contentData ="";
        var imgData ="";
        var proportion = "";
        vm.loadLocation = loadLocation; // 加载停车场数据
        vm.location = location;//定位
        vm.loadLocation();
        // 定义Marker实体类
        function Marker(longitude, latitude, icon, width, height, title, content,img,label,color,proportion) {
            this.longitude = longitude;
            this.latitude = latitude;
            this.icon = icon;
            this.width = width;
            this.height = height;
            this.title = title;
            this.content = content;
            this.label = label;
            this.img = img;
            this.color = color;
            this.proportion = proportion;
        }
        var markObj = null;
        vm.parkAsync = [];
        var allPark = [];
        var start_index = 0;
    //搜索框里面
        vm.queryBaiDuMapParking = queryBaiDuMapParking;
        function queryBaiDuMapParking() {
            ManageParkingService.querySearchBaiDuMapParking(start_index).then(function (response) {
                if(response.parking_lots.length !== 0) {
                    start_index =  response.parking_lots[response.parking_lots.length - 1].id;
                    angular.forEach(response.parking_lots, function (value) {
                        vm.parkAsync.push(value);
                        // vm.parkingAsync.push(value);
                        // allParkLots.push(value.id);
                    });
                    queryBaiDuMapParking();
                }
            });
        }
        vm.queryBaiDuMapParking();


        function loadLocation() {
            ManageParkingService.queryBaiDuMapParking(start_index).then(function (res) {
                if(res.parking_lots.length !== 0){
                    start_index =  res.parking_lots[res.parking_lots.length - 1].id;
                    angular.forEach(res.parking_lots, function (data) {
                        contentData = '总车位:' + data.parking_space_total + '  ' + '剩余车位:' + data.parking_space_available;
                        allPark.push(data.id);
                        // vm.parkAsync.push(data);
                        if(data.image){
                            imgData = URL_SEED.IMG_URL+"media/"+data.image;
                        }else{
                            imgData = URL_SEED.API_IMGURL+"app/img/no_pic.png";
                        }
                        proportion = (((data.parking_space_available)/(data.parking_space_total))*100).toFixed(2);


                        function IconBap() {
                            if (data.parkgate.length > 0 && data.parking_space_available <= 20) {
                                markObj = new Marker(data.parkgate[0].longitude, data.parkgate[0].latitude, '/park/app/img/ic_close_red.png', 50, 45, data.name,
                                    contentData,imgData,data.parking_space_available,'progress-bar-danger',proportion);
                                vm.redNumber=vm.redNumber+1;
                                vm.marksArray.push(markObj);
                            }else if(data.parkgate.length > 0 && data.parking_space_available <= 50){
                                markObj = new Marker(data.parkgate[0].longitude, data.parkgate[0].latitude, '/park/app/img/ic_close_yellow.png', 50, 45, data.name,
                                    contentData,imgData,data.parking_space_available,'progress-bar-warning',proportion);
                                vm.yellowNumber=vm.yellowNumber+1;
                                vm.marksArray.push(markObj);
                            }else if(data.parkgate.length > 0 && data.parking_space_available > 50){
                                markObj = new Marker(data.parkgate[0].longitude, data.parkgate[0].latitude, '/park/app/img/ic_close_green.png', 50, 45, data.name,
                                    contentData,imgData,data.parking_space_available,'progress-bar-success',proportion);
                                vm.greenNumber=vm.greenNumber+1;
                                vm.marksArray.push(markObj);
                            }
                        }
                        //新增签约不签约的图标
                        if (data.sign){
                                 if (data.mqttstatus==1 && data.httpstatus==1){
                                     IconBap()
                                 }else {
                                  if (data.parkgate.length>0){
                                      markObj = new Marker(data.parkgate[0].longitude, data.parkgate[0].latitude, '/park/app/img/qianyuebuzaixian.png', 50, 45, data.name,
                                          contentData, imgData, data.parking_space_available, 'progress-bar-danger', proportion);
                                      vm.marksArray.push(markObj);
                                  }
                                 }
                        }else {
                               if(data.parkgate.length>0){
                                   markObj = new Marker(data.parkgate[0].longitude, data.parkgate[0].latitude, '/park/app/img/nosign.png', 50, 45, data.name,
                                       contentData, imgData, data.parking_space_available, 'progress-bar-danger', proportion);
                                   vm.marksArray.push(markObj);
                               }

                        }


                    });
                    loadLocation();
                }
            });
        }
        vm.mapOptions = {
            center: {
                longitude: longitude,
                latitude: latitude
            },
            zoom: 16,
            city: '长沙市',
            scaleCtrl: true,
            navCtrl: true,
            overViewCtrl: true,
            enableScrollWheelZoom: true,
            markers: vm.marksArray
        };
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
        vm.onSelectCallbackPark = function (item) {
            vm.eventResult = {model: item};
            vm.selectRegion.id = vm.eventResult.model.id;
            if(vm.eventResult.model.parkgate[0]){
                vm.lat= vm.eventResult.model.parkgate[0].latitude;
                vm.lng= vm.eventResult.model.parkgate[0].longitude;
            };
            vm.disable = true;
        };
        vm.selectRegion = {
            id: undefined
        };
        vm.selectPark = {
            id: undefined
        };
        vm.disable = false;
        function location() {
            $timeout(function () {
                if (vm.lat && vm.lng) {
                    vm.mapOptions.center = {
                        latitude: vm.lat,
                        longitude: vm.lng
                    };
                    vm.mapOptions.zoom = 18;
                    vm.disable = false;
                } else {
                    logger.warning('停车场查找失败！', '', '经纬度为空');
                }
            },500);
        }

    }
})();