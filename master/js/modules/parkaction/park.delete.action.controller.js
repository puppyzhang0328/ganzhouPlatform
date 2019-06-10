(function () {
    angular.module('app.parking')
        .controller('DeleteParkActionController', DeleteParkActionController);
    DeleteParkActionController.$inject = ['$location', 'ParkActionService', 'logger','parkActionFactory','$uibModalInstance','$state'];
    'use strict';
    function DeleteParkActionController($location, ParkActionService, logger,parkActionFactory,$uibModalInstance,$state) {
        var vm = this;
        vm.deleteParkAction = deleteParkAction; // 新增停车场功能
        vm.cancel = cancel;
        var parkActionId =parkActionFactory.getParkAction().parklot_id;
        var parkActionName =parkActionFactory.getParkAction().funcname;
        function deleteParkAction() {
            ParkActionService.deleteParkAction(parkActionId).then(function (response) {
                if (response.status === 0) {
                    logger.success('删除成功'+'停车场功能：'+parkActionName,'操作成功');
                    vm.cancel();
                    $state.reload();
                }else {
                    logger.error('删除失败');
                }
            });
        }
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
    }
})();