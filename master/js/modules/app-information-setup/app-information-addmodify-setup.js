(function () {
    "use strict";
    angular.module('app.inforsetup')
        .controller('inforsetupamodifyController', inforsetupamodifyController);
    inforsetupamodifyController.$inject = ['$scope', '$timeout', '$location','inforService', 'toastr','inforsetupFactory'];
    function inforsetupamodifyController($scope, $timeout, $location, inforService, toastr,inforsetupFactory) {
        var vm = this;
        vm.getPlatform =  getPlatform;
        vm.getPlatform();
        function getPlatform() {
            $timeout(function () {
                vm.platform = inforsetupFactory.getPlatform();
            }, 500);
        };
        vm.modifyPlatform = function () {
            inforService.modifyinfo(vm.platform.menu_id,vm.platform.menu_url,vm.platform.title).then(function (response) {
                if (response.status == 0) {
                    toastr.success('修改成功!!', response, {
                        closeButton: true,
                        progressBar: true,
                        positionClass: 'toast-top-center'
                    });
                    $location.path('/app/app-setting/app-Information-setup');
                }
            });
        };
        vm.backToPrevious = function () {
            $location.path('/app/app-setting/app-Information-setup');
        };
    }
})();