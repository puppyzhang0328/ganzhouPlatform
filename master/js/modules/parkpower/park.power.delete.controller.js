(function(){
    angular.module('app.parking')
        .controller('ParkPowerDeleteController',ParkPowerDeleteController);

    ParkPowerDeleteController.$inject = ['$uibModalInstance','ParkPowerService','parkPowerFactory','logger'];
    'use strict';
    function ParkPowerDeleteController($uibModalInstance,ParkPowerService,parkPowerFactory,logger) {
        var vm = this;
        vm.deleteParkPower = deleteParkPower;
        vm.cancel = cancel;
        function deleteParkPower() {
            ParkPowerService.deleteParkPower(parkPowerFactory.getParkPower().id).then(function (response) {
                if(response.status === 0){
                    $uibModalInstance.close('closed');
                    logger.success('成功刪除'+parkPowerFactory.getParkPower().name,response.data,'操作成功！');
                }else {
                    logger.error('删除失败'+parkPowerFactory.getParkPower().name + '失败！！',response.data,'操作失败！');
                }
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();