(function(){
    angular.module('app.parking')
        .controller('cardDeteleCtr',cardDeteleCtr);
    cardDeteleCtr.$inject = ['$uibModalInstance','inducementService','induCardFactory','logger'];
    'use strict';
    function cardDeteleCtr($uibModalInstance,inducementService,induCardFactory,logger) {
        var vm = this;
        vm.deleteCard = deleteCard;
        vm.cancel = cancel;
        vm.CardId = induCardFactory.getInduCard().CardId;
        function deleteCard() {
            inducementService.deleteCard(vm.CardId).then(function (response) {
                if(response.data.status === 0){
                    $uibModalInstance.close('closed');
                    logger.success('成功刪除'+induCardFactory.getInduCard().CardNum,response.data,'操作成功！');
                }else {
                    logger.error('删除失败'+induCardFactory.getInduCard().CardNum + '失败！！',response.data,'操作失败！');
                }
            });
        }
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();