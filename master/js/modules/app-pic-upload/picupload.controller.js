/**
 * Created by huangxiang  on 2016/11/28 0028.
 * @author:
 * Module:
 * feature:
 */
(function () {
    angular.module('app.picupload')
        .controller('AdSettingController', AdSettingController);

    AdSettingController.$inject = ['$scope', 'Upload', '$timeout', 'URL_SEED', 'toastr', '$route'];

    'use strict';
    function AdSettingController($scope, Upload, $timeout, URL_SEED, toastr, $route) {
        /*表单样式设置----------------*/
        angular.element(':file').filestyle({buttonName: 'btn-primary', buttonText: '请选择图片'});
        /*表单样式设置--------------------------*/

        $scope.mySelectVal = 'app_start_page';

        var IMAGE_UPLOAD_URL = URL_SEED.API_URL + 'appman/appimage';
        /*
         *filename:文件
         * index:key
         */
        /*上传启动页图片*/
        $scope.uploadStartupPic = function (file) {
            file.upload = Upload.upload({
                url: IMAGE_UPLOAD_URL,
                data: {filename: file, index: 1, page_type: 'startup_page',owner:$scope.owner},
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

        /*上传APP轮播页图片*/

        $scope.uploadCoverPic = function (file) {
            file.upload = Upload.upload({
                url: IMAGE_UPLOAD_URL,
                data: {filename: file, index: $scope.ad_index, page_type: 'cover_page',owner:$scope.owner},
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
                    });
                    // 上传成功刷新页面。
                    $route.reload();
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
                if (response.status > 0) {
                    $scope.errorMsg = response.status + ': ' + response.data;
                }
            }, function (evt) {
                // Math.min is to fix IE which reports 200% sometimes
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        };

        /*上传APP引导图*/
        $scope.uploadIndexPic = function (file) {
            file.upload = Upload.upload({
                url: IMAGE_UPLOAD_URL,
                data: {index: $scope.car_pic_index, filename: file, page_type: 'index_page',owner:$scope.owner},
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
                    });
                    // 上传成功刷新页面。
                    $route.reload();
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
                if (response.status > 0) {
                    $scope.errorMsg = response.status + ': ' + response.data;
                }
            }, function (evt) {
                // Math.min is to fix IE which reports 200% sometimes
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        };
    }
})();