(function () {
    "use strict";
    angular.module('app.parking')
        .controller('modifyCardController', modifyCardController);
    modifyCardController.$inject = ['$scope', '$timeout', '$location', 'communityFactory', 'inducementService', 'toastr','policeService'];
    function modifyCardController($scope, $timeout, $location, communityFactory, inducementService, toastr,policeService) {
        var vm = this;
        vm.getCard =  getCard;
        vm.getCard();
        function getCard() {
            $timeout(function () {
                vm.CardId = communityFactory.getCommunity().CardId;
                vm.CardNum = communityFactory.getCommunity().CardNum;
            }, 500);
        };
        vm.modifyCard = function () {
            inducementService.modifyCard(vm.CardId,vm.CardNum).then(function (response) {
                if (response.data.status === 0) {
                    toastr.success('修改成功!!', response, {
                        closeButton: true,
                        progressBar: true,
                        positionClass: 'toast-top-center'
                    });
                    $location.path('/app/induCard');
                }
            });
        };
        vm.backToPrevious = function () {
            $location.path('/app/induCard');
        };
    }
})();