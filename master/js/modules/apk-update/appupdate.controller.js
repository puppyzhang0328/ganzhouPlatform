/**
 * Created by huangxiang  on 2016/11/28 0028.
 * @author:
 * Module:
 * feature:
 */
(function () {
    "use strict";
    angular.module('app.appupdate')
        .controller('AppUploadController', AppUploadController);

    AppUploadController.$inject = ['$scope', '$filter', 'Upload', '$timeout', '$location', 'URL_SEED', 'toastr', '$route'];

    function AppUploadController($scope, $filter, Upload, $timeout, $location, URL_SEED, toastr, $route) {
        /*表单样式设置----------------*/
        $(":file").filestyle({buttonName: "btn-primary", buttonText: "选择要上传的APK文件"});
        /*表单样式设置--------------------------*/
        $scope.queryRecords = function () {
            $location.path('app/update-history');
        };

        $scope.currentTime = new Date();

        $scope.apk = {
            version_code: 0,
            version_name: '',
            package_name: '',
            release_date: $filter('date')(new Date(), 'yyyy-MM-dd HH:mm:ss'),
            release_notes: ''
        };

        // APP上传URL
        var UPDATE_APP_URL = URL_SEED.API_URL + "appman/version";

        /*上传apk*/
        $scope.uploadAppPackage = function (file) {
            file.upload = Upload.upload({
                url: UPDATE_APP_URL,
                data: {
                    file_name: file,
                    package_name: $scope.apk.package_name,
                    version_code: $scope.apk.version_code,
                    version_name: $scope.apk.version_name,
                    release_date: $scope.apk.release_date,
                    release_notes: $scope.apk.release_notes
                },
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
                if (response.data.status === 0) {
                    $timeout(function () {
                        toastr.success('操作成功，你已经成功上传该APK！', {
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