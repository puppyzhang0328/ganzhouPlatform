/**
 * Created by huangxiang  on 2016/11/23 0023.
 * @author:
 * Module:
 * feature:
 */
(function () {
    angular.module('app.parking')
        .controller('ParkingPicUploadController',ParkingPicUploadController);

    ParkingPicUploadController.$inject = ['$scope','toastr','$timeout','ManageParkingService','URL_SEED','Upload','$location','$route','ParkingPicFactory'];

    'use strict';
    function ParkingPicUploadController($scope,toastr, $timeout,ManageParkingService,URL_SEED,Upload,$location,$route,ParkingPicFactory) {
        var vm = this;
        var UPLOAD_PARKING_PIC_URL = URL_SEED.API_URL + 'parking/parklots_image/';

        vm.disabled = undefined;
        vm.searchEnabled = undefined;

        vm.setInputFocus = function () {
            $scope.$broadcast('UiselectDemo1');
        };
        vm.enable = function () {
            vm.disabled = false;
        };

        vm.disabled = function () {
            vm.disabled = true;
        };

        vm.enableSearch = function() {
            vm.searchEnabled = true;
        };

        vm.disableSearch = function() {
            vm.searchEnabled = false;
        };

        vm.someGroupFn = function (item){

            if (item.name[0] >= 'A' && item.name[0] <= 'M')
                return 'From A - M';

            if (item.name[0] >= 'N' && item.name[0] <= 'Z')
                return 'From N - Z';

        };

        vm.firstLetterGroupFn = function (item){
            return item.name[0];
        };

        vm.reverseOrderFilterFn = function(groups) {
            return groups.reverse();
        };
        vm.parkingAsync = {selected : 'wladimir@email.com'};
        vm.parkingAsync = [];

        $timeout(function(){
            ManageParkingService.queryParking().then(function (response) {
                console.log(response.parking_lots);
                vm.parkingAsync = response.parking_lots;
            });
        },3000);

        vm.onSelectCallback = function (item) {
            vm.eventResult = {model: item};
        };
          //点击返回拿到id发送
                   vm.identifier=ParkingPicFactory.getPark().identifier;
        $scope.uploadParkingPic = function (file) {
            file.upload = Upload.upload({
                url: UPLOAD_PARKING_PIC_URL,
                data: {filename: file, identifier:vm.identifier},
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
                if (response.data.status == '0') {
                    $timeout(function () {
                        toastr.success('操作成功，你已经成功上传该图片！', {
                            closeButton: true,
                            progressBar: true,
                            positionClass: 'toast-top-center'
                        });
                        // 上传成功刷新页面。
                        $route.reload();
                    });

                } else {
                    $timeout(function () {
                        toastr.error('上传失败！！请尝试重新上传!', {
                            closeButton: true,
                            progressBar: true,
                            positionClass: 'toast-top-center'
                        });
                    });
                }

            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                // Math.min is to fix IE which reports 200% sometimes
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        };
        $scope.backToPrevious = function () {
            $location.path('/app/parkPic/parking-pic');
        };
    }
})();
