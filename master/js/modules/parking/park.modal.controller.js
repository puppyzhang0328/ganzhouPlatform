/**
 * park.modal.controller.js
 * @author: huangxiang
 * @create 2016-12-23 15:52
 */
(function(){
    angular.module('app.parking')
        .controller('ParkingModalController',ParkingModalController);

    ParkingModalController.$inject = ['$uibModalInstance','ManageParkingService','currentClickPark','logger'];
    'use strict';
    function ParkingModalController($uibModalInstance,ManageParkingService,currentClickPark,logger) {
        var vm = this;
        vm.deletePark = deletePark;
        vm.cancel = cancel;

        function deletePark() {
            ManageParkingService.deleteParking(currentClickPark.getPark().id).then(function (response) {
                if(response.status === 0){
                    $uibModalInstance.close('closed');
                    logger.success('成功刪除'+currentClickPark.name,response.data,'操作成功！');
                }else {
                    logger.error('删除失败'+currentClickPark.name + '失败！！',response.data,'操作失败！');
                }
            });
        }

        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();