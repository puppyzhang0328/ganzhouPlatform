/**
 * Created by huangxiang  on 2016/11/23 0023.
 * @author:
 * Module:
 * feature:
 */
(function () {
    "use strict";
    angular.module('app.basicinfo')
        .controller('ModifyOrganCtr', ModifyOrganCtr);
    ModifyOrganCtr.$inject = ['$scope', '$timeout', '$location', 'organFactory', 'organService', 'toastr','logger'];
    function ModifyOrganCtr($scope, $timeout, $location, organFactory, organService, toastr,logger) {
        var vm = this;
        vm.getOrgan =  getOrgan;
        vm.getOrgan();
        function getOrgan() {
            $timeout(function () {
                vm.organ = organFactory.getOrgan();
            }, 500);
        };
        vm.number = number;
        //正则验证表示只能是数组
        function number(item) {
            var re = new RegExp(/^[0-9]*$/ );
            if (!re.test(item)) {
                logger.error('只允许填写数字,请重新填写' , '');
                return;

            }
        }
        // 点击确认修改区域的操作
        vm.modifyOrgan = function () {
            organService.modifyOrgan(vm.organ.id,vm.organ.orgname,vm.organ.orgphone,vm.organ.orgleader,vm.organ.leaderphone,vm.organ.address,vm.organ.contactname,vm.organ.contactphone,vm.organ.orgemail,vm.organ.orggrade,vm.organ.registernum,vm.organ.orgtype,vm.organ.paytype,vm.organ.isactive,vm.organ.memo,vm.organ.is_settlement,vm.organ.generation_time,vm.organ.settlement_time,vm.organ.max_settlement).then(function (response) {
                if (response.status == 0) {
                    toastr.success('修改成功!!', response, {
                        closeButton: true,
                        progressBar: true,
                        positionClass: 'toast-top-center'
                    });
                    $location.path('/app/organ');
                }
            });
        };
        //新增自动对账功能
        // vm.generationTime=[];
        // for (var i=1;i<=31;i++) {
        //     vm.generationTime.push(i);
        // }
        // 返回上一层
        vm.backToPrevious = function () {
            $location.path('/app/organ');
        };
    }
})();