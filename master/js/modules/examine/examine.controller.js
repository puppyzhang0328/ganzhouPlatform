(function () {
    'use strict';
    angular.module('app.parking')
        .controller('examineController', examineController);
    examineController.$inject = ['$location', 'organService', 'datatablesOptions', 'DTColumnDefBuilder','examineService','$scope','examineFactorys','$uibModal','logger','groupBillFactory'];
    function examineController($location, organService, datatablesOptions, DTColumnDefBuilder,examineService,$scope,examineFactorys,$uibModal,logger,groupBillFactory) {
        var vm = this;
        vm.findBill = findBill;
        vm.generateBill = generate;
        vm.queryOrgan = queryOrgan;
        vm.jumpPerson = jumpPerson;
        vm.queryOrgan();
        vm.findBill();
        vm.OrganAsync = [];
        var allOrgans = [];
        function queryOrgan() {
            organService.queryOrgan().then(function (response) {
                vm.OrganAsync = response.records;
                angular.forEach(response.records, function (value) {
                    allOrgans.push(value.id);
                });
            });
        }
        vm.onSelectCallbackOrgan = function (item) {
            vm.eventResult = {model: item};
            vm.organId = vm.eventResult.model.id;
            vm.organName = vm.eventResult.model.name;
        };
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
            DTColumnDefBuilder.newColumnDef(13)

        ];
        function findBill() {
            examineService.findBill(vm.status).then(function (response) {
                if(response.status == 0){
                    vm.examine = response.serializer_initiator;
                    angular.forEach(response.serializer_initiator, function (value,index) {
                        vm.examine[index].number=index+1;
                       if(value.status==0){
                           vm.examine[index].statusName='未发送';
                       }else if(value.status==1){
                           vm.examine[index].statusName='待核对';
                       }else if(value.status==2){
                           vm.examine[index].statusName='已审核,账目准确';
                       }else if(value.status==3){
                           vm.examine[index].statusName='已审核,账目异常';
                       }else if(value.status==4){
                           vm.examine[index].statusName='已结算';
                       }else if(value.status==5) {
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
        function generate() {
            examineService.generateBill(vm.organId).then(function (response) {
                if(response.status == 0){
                    logger.success('生产'+'组织账单成功','操作成功!');
                    vm.findBill();
                    $route.reload();
                }else{
                    logger.warning('生产'+'组织账单失败','操作失败!');
                }
            });
        }
        //点击查看
        vm.jumpDetail=function (examine) {
            groupBillFactory.setBillDetail(examine);
            $location.path('/app/groupBill');
        };

        function jumpPerson(examine) {
                examineFactorys.setExamine(examine);
                var modalInstance = $uibModal.open({
                    backdrop: 'static',
                    templateUrl: 'personSelect.html',
                    size: 'sm',
                    controller: 'examinePersonController',
                    controllerAs: 'vm'
                });
                modalInstance.result.then(function () {
                    vm.findBill();
                });
        }
        //点击搜索按钮
        vm.findBillSearch=function(){
            examineService.findBillSearch(vm.status,vm.organId).then(function (response) {
                if(response.status == 0){
                    vm.examine = response.serializer_initiator;
                    angular.forEach(response.serializer_initiator, function (value,index) {
                        vm.examine[index].number=index+1;
                        if(value.status==0){
                            vm.examine[index].statusName='未发送';
                        }else if(value.status==1){
                            vm.examine[index].statusName='待核对';
                        }else if(value.status==2){
                            vm.examine[index].statusName='已审核,账目准确';
                        }else if(value.status==3){
                            vm.examine[index].statusName='已审核,账目异常';
                        }else if(value.status==4){
                            vm.examine[index].statusName='已结算';
                        }else if(value.status==5) {
                            vm.examine[index].statusName='异常确认已处理';
                        }else {
                            vm.examine[index].statusName='未知状态';
                        }
                    });
                }else{
                    logger.warning('查询失败','请重新刷新查询!');
                }
            });






        };








        //重置按钮
        vm.clearAndRefresh=function () {
            vm.OrganAsync.selected="";
            vm.status="";
            vm.findBill();
        }
        
    }
})();