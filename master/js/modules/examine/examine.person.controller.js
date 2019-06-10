(function () {
    'use strict';
    angular.module('app.parking')
        .controller('examinePersonController', examinePersonController);
    examinePersonController.$inject = ['$uibModalInstance', 'examineFactorys', '$state', 'examineGroupService','examineService','$scope','$uibModal','logger'];
    function examinePersonController($uibModalInstance, examineFactorys, $state, examineGroupService,examineService,$scope,$uibModal,logger) {
        var vm = this;
        var allOrgans = [];
        //下拉框
        vm.queryPerson = queryPerson;
        //确定按钮
        vm.putInfo = putInfo;
        vm.cancel = cancel;
        vm.confirmBill = confirmBill;
        vm.queryPerson();
        function queryPerson() {
            examineService.queryPerson().then(function (response) {
                vm.personAsync = response.records;
                angular.forEach(response.records, function (value) {
                    allOrgans.push(value.id);
                });
            })
        }
        vm.onSelectCallbackPerson = function (item) {
            vm.eventResult = {model: item};
            vm.userid = vm.eventResult.model.user;
            vm.organName = vm.eventResult.model.nick_name;
        };
        function cancel() {
            $uibModalInstance.dismiss('cancel');
        }
        // //获取异常备注的参数
        //  vm.billReason=function () {
        //      examineService.findBill("").then(function (response) {
        //          if(response.status==0){
        //              vm.memo=response.serializer_initiator
        //          }
        //      })
        //
        //
        //
        //  };






        //获取参数
        vm.examin_status=examineFactorys.getExamine().status;
        //确定显示页面
        if(vm.examin_status==0){
            vm.Initiate_audit=0;

        }else if(vm.examin_status==2) {
            vm.Initiate_audit=2;
        }else if(vm.examin_status==3) {
            vm.Initiate_audit=3;
            vm.memo=examineFactorys.getExamine().memo;

        }else {
            vm.Initiate_audit=5;
        }

        //点击确定按钮
        function putInfo() {
            if(vm.examin_status==0){
                examineService.putInfo(examineFactorys.getExamine().id,vm.userid).then(function (response) {
                    if(response.status == 0){
                        vm.confirmBill();
                    }else {
                        logger.error('发送' + vm.organName + '失败"!', response.data, '操作失败');
                    }
                });
            }else if(vm.examin_status==2){
                examineGroupService.confirmBill(examineFactorys.getExamine().id,4).then(function (response) {
                    if(response.status == 0){
                        logger.success('成功审核' + '成功', response.data, '操作成功！');
                        vm.cancel();
                        $state.reload();
                    }else {
                        logger.error('发送'  + '失败"!', response.data, '操作失败');
                    }
                });
            }else if(vm.examin_status==3){
                examineGroupService.confirmBill(examineFactorys.getExamine().id,5).then(function (response) {
                    if(response.status == 0){
                        logger.success('成功审核' + '成功', response.data, '操作成功！');
                        vm.cancel();
                        $state.reload();
                    }else {
                        logger.error('发送'  + '失败"!', response.data, '操作失败');
                    }
                });
            }else {
                examineService.NoHandlingBill(examineFactorys.getExamine().organization,examineFactorys.getExamine().endtime).then(function (response) {
                    if(response.status == 0){
                        logger.success('成功审核'  + '成功', response.data, '操作成功！');
                        vm.cancel();
                        $state.reload();
                    }else {
                        logger.error('发送'  + '失败"!', response.data, '操作失败');
                    }
                });

            }


        }
        function confirmBill() {
            examineGroupService.confirmBill(examineFactorys.getExamine().id,1).then(function (response) {
                if(response.status == 0){
                    logger.success('成功审核'  + '成功', response.data, '操作成功！');
                    vm.cancel();
                    $state.reload();
                }else {
                    logger.error('发送'  + '失败"!', response.data, '操作失败');
                }
            });
        }
    }
})();