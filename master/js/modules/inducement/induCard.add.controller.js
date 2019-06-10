(function () {
    angular.module('app.parking')
        .controller('addCardController', addCardController);
    addCardController.$inject = ['$location', 'inducementService', 'logger','policeService'];
    'use strict';
    function addCardController($location, inducementService, logger,policeService) {
        var vm = this;
        vm.addCard = addCard;
        vm.backToPrevious = backToPrevious;
        function addCard() {
            inducementService.addCard(vm.CardNum).then(function (response) {
                if (response.data.status == 0) {
                    logger.success('添加成功'+'卡号：'+vm.CardNum,'操作成功');
                    $location.path('/app/induCard');
                }else if (response.data.status == 40004) {
                    logger.error('添加失败' + vm.community.name + '"' + '失败!', vm.community.name, '该卡已经存在！');
                }  else {
                    logger.error('添加失败');
                }
            });
        }
        function backToPrevious() {
            $location.path('/app/induCard');
        }
    }
})();