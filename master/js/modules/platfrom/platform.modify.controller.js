(function () {
    "use strict";
    angular.module('app.basicinfo')
        .controller('modifyPlatformController', modifyPlatformController);
    modifyPlatformController.$inject = ['$scope', '$timeout', '$location','platformService', 'toastr','platformFactory'];
    function modifyPlatformController($scope, $timeout, $location, platformService, toastr,platformFactory) {
        var vm = this;
        vm.getPlatform =  getPlatform;
        vm.getPlatform();
        function getPlatform() {
            $timeout(function () {
                vm.platform = platformFactory.getPlatform();
            }, 500);
        };
        vm.modifyPlatform = function () {
            platformService.modifyPlatform(vm.platform.id,vm.platform.plateformname,vm.platform.username,vm.platform.loginurl,vm.platform.password,vm.platform.encrypt_passwd,vm.platform.dataurl,vm.platform.param1).then(function (response) {
                if (response.status == 0) {
                    toastr.success('修改成功!!', response, {
                        closeButton: true,
                        progressBar: true,
                        positionClass: 'toast-top-center'
                    });
                    $location.path('/app/platform');
                }
            });
        };
        vm.backToPrevious = function () {
            $location.path('/app/platform');
        };
    }
})();