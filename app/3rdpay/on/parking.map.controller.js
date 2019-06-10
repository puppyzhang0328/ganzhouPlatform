(function () {
    angular.module('app.parking')
        .controller('BMapController', BMapController);
    BMapController.$inject = ['ManageParkingService', '$timeout', '$log','$scope','$interval'];
    'use strict';
    function BMapController(ManageParkingService, $timeout, $log,$scope,$interval) {
        var vm = this;
        // 112.985002,28.199722
        var longitude = 112.985002;
        var latitude = 28.199722;
        var marksArray = []; // mark集合
        var queryState;
        // 定义Marker实体类
        function Marker(longitude, latitude, icon, width, height, title, content,label) {
            this.longitude = longitude;
            this.latitude = latitude;
            this.icon = icon;
            this.width = width;
            this.height = height;
            this.title = title;
            this.content = content;
            this.label = label;
        }
        var markObj = null;
        var queryMap = $interval(function() {
            var start_index = 0;
            queryState = $interval(function() {
                ManageParkingService.queryBaiDuMapParking(start_index).then(function (res) {
                    if(res.parking_lots.length !== 0){
                        start_index =  res.parking_lots[res.parking_lots.length - 1].id;
                        angular.forEach(res.parking_lots, function (data) {
                            if (data.parkgate.length > 0 && data.parking_space_available <= 20) {
                                markObj = new Marker(data.parkgate[0].longitude, data.parkgate[0].latitude, '/park/app/img/ic_close_red.png', 32, 45, data.name,
                                    '总车位:' + data.parking_space_total + '  ' + '剩余车位:' + data.parking_space_available,data.parking_space_available);
                                marksArray.push(markObj);
                            }else if(data.parkgate.length > 0 && data.parking_space_available <= 50){
                                markObj = new Marker(data.parkgate[0].longitude, data.parkgate[0].latitude, '/park/app/img/ic_close_yellow.png', 32, 45, data.name,
                                    '总车位:' + data.parking_space_total + '  ' + '剩余车位:' + data.parking_space_available,data.parking_space_available);
                                marksArray.push(markObj);
                            }else if(data.parkgate.length > 0 && data.parking_space_available > 50){
                                markObj = new Marker(data.parkgate[0].longitude, data.parkgate[0].latitude, '/park/app/img/ic_close_green.png', 32, 45, data.name,
                                    '总车位:' + data.parking_space_total + '  ' + '剩余车位:' + data.parking_space_available,data.parking_space_available);
                                marksArray.push(markObj)
                            }
                        });
                        vm.mapOptions.markers = marksArray;
                    }else{
                        $interval.cancel(queryState);
                    }
                });
            },500);
        },5000);
        vm.mapOptions = {
            //113.01346,28.210291
            center: {
                longitude: longitude,
                latitude: latitude
            },
            zoom: 15,
            city: '长沙市',
            scaleCtrl: true,
            navCtrl: true,
            overViewCtrl: true,
            enableScrollWheelZoom: true,
            markers: marksArray
        };

        $timeout(function () {
            vm.mapOptions.markers = marksArray;
            // vm.mapOptions.center.longitude = 113.95168;
            // vm.mapOptions.center.latitude = 22.539713;
        });
        $scope.$on("$destroy", function() {
            $interval.cancel(queryMap);
        });
    }
})();