(function () {
    angular.module('app.parking')
        .controller('induCardController', induCardController);
    induCardController.$inject = ['$location', 'induCardFactory', 'logger','inducementService','datatablesOptions','DTColumnDefBuilder','$uibModal','$document'];
    'use strict';
    function induCardController($location, induCardFactory, logger,inducementService,datatablesOptions,DTColumnDefBuilder,$uibModal,$document) {
        var vm = this;
        vm.queryCard = queryCard;
        vm.clearAndRefresh = clearAndRefresh;
        vm.addCard = addCard;
        vm.deleteCard = deleteCard;
        vm.modifyCard = modifyCard;
        vm.queryCard();
        vm.dtOptions = datatablesOptions.getDatatableOption();
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3).notSortable()
        ];
        function queryCard() {
            inducementService.queryCard(vm.CardNum,vm.IsOnline).then(function (response) {
                vm.card = response.records;
            });
        }
        function addCard() {
            $location.path('/app/induCardAdd');
        }
        function deleteCard(card) {
            induCardFactory.setInduCard(card);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'deleteCard.html',
                size: 'sm',
                controller: 'cardDeteleCtr',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                vm.queryCard();
            });
        }
        function modifyCard(card) {
            induCardFactory.setInduCard(card);
            $location.path('/app/induCardModify');
        }
        function clearAndRefresh() {
            vm.CardNum='';vm.IsOnline='';
        }

    }
})();