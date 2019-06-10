(function () {
    'use strict';
    angular.module('app.parking')
        .controller('examineGroupController', examineGroupController);
    examineGroupController.$inject = ['$location', 'examineGroupService', 'datatablesOptions', 'DTColumnDefBuilder','examineService','groupBillFactory','examineFactory','$uibModal','logger'];
    function examineGroupController($location, examineGroupService, datatablesOptions, DTColumnDefBuilder,examineService,groupBillFactory,examineFactory,$uibModal,logger) {
        var vm = this;
        vm.findBill = findBill;
        vm.jumpDetail = jumpDetail;
        vm.downloadPDF = downloadPDF;
        vm.clearAndRefresh = clearAndRefresh;
        vm.confirmBill = confirmBill;
        vm.findBill();
        vm.dtOptions = datatablesOptions.getDatatableOption();
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6),
            DTColumnDefBuilder.newColumnDef(7),
            DTColumnDefBuilder.newColumnDef(8),
            DTColumnDefBuilder.newColumnDef(9),
            DTColumnDefBuilder.newColumnDef(10),
            DTColumnDefBuilder.newColumnDef(11),
            DTColumnDefBuilder.newColumnDef(12),
            DTColumnDefBuilder.newColumnDef(13),
            DTColumnDefBuilder.newColumnDef(14),
            DTColumnDefBuilder.newColumnDef(15),
            DTColumnDefBuilder.newColumnDef(16)

        ];
        function findBill() {
            examineService.findBill(vm.status).then(function (response) {
                if(response.status == 0){
                    vm.examine = response.serializer_auditor;
                    angular.forEach(response.serializer_auditor, function (value,index) {
                       if(value.status==0){
                           vm.examine[index].statusName='未发送';
                       }else if(value.status==1){
                           vm.examine[index].statusName='待审核';
                       }else if(value.status==2){
                           vm.examine[index].statusName='已审核,';
                       }else if(value.status==3){
                           vm.examine[index].statusName='已审核';
                       }else if(value.status==4){
                           vm.examine[index].statusName='已结算';
                       }else if(value.status==5){
                           vm.examine[index].statusName='异常确认已处理';
                       }else {
                            vm.examine[index].statusName='未知状态';
                        }
                    });
                }else{
                    logger.warning('查询失败','请重新刷新查询!');
                }
            });
        }
        function confirmBill(examine) {
                examineFactory.setExamine(examine);
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: 'confirmBill.html',
                    size: 'sm',
                    controller: 'confirmBillController',
                    controllerAs: 'vm'
                });
                modalInstance.result.then(function () {
                    vm.findBill();
                });
        }
        function jumpDetail(examine) {
            groupBillFactory.setGroupBill(examine);
            $location.path('/app/groupBill');
        }
        function downloadPDF(examine) {
            examineFactory.setExamine(examine);
            var modalInstance = $uibModal.open({
                backdrop: 'static',
                templateUrl: 'exportDetail.html',
                size: 'sm',
                controller: 'billDetailController',
                controllerAs: 'vm'
            });
            modalInstance.result.then(function () {
                // vm.findBill();
            });
        }
        function clearAndRefresh() {
            vm.status = '';
            vm.findBill();
        }
    }
})();