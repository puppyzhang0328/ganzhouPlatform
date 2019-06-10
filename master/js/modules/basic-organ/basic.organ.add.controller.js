/**
 * park.add.controller.js
 * @author: huangxiang
 * @create 2016-12-23 16:43
 */
(function () {
    'use strict';
    angular.module('app.basicinfo')
        .controller('AddOrganCtr', AddOrganCtr);
    AddOrganCtr.$inject = ['$location', 'organService', 'logger'];
    function AddOrganCtr($location, organService, logger) {
        var vm = this;
        vm.addOrgan = addOrgan; // 添加停车场
        vm.backToPrevious = backToPrevious; // 返回上一层菜单
        vm.number = number;
        //正则验证表示只能是数组
        function number(item) {
            var re = new RegExp(/^[0-9]*$/ );
            if (!re.test(item)) {
                logger.error('只允许填写数字,请重新填写' , '');
                return;

            }
        }
        function addOrgan() {
            organService.addOrgan(vm.organ.orgname,vm.organ.orgphone,vm.organ.orgleader,vm.organ.leaderphone,vm.organ.address,vm.organ.contactname,vm.organ.contactphone,vm.organ.orgemail,vm.organ.orggrade,vm.organ.registernum,vm.organ.orgtype,vm.organ.paytype,vm.organ.isactive,vm.organ.memo,vm.organ.is_settlement, vm.organ.generation_time,vm.organ.settlement_time,vm.organ.max_settlement).then(function (response) {
                if (response.status === 0) {
                    logger.success('添加成功'+'操作成功');
                    $location.path('/app/organ');
                }else if (response.status === 40004) {
                    logger.error('添加失败' + vm.organ.name + '"' + '失败!', vm.organ.status, '该组织已经存在！');
                }else if(response.status === 10002) {
                    logger.error('添加失败' + vm.organ.name + '"' + '失败!', vm.organ.status, '请输入带*的必填字段！');
                }else{
                    logger.error('添加失败');
                }
            });
        }
        // //新增自动对账功能
        // vm.generationTime=[];
        // for (var i=1;i<=31;i++) {
        //     vm.generationTime.push(i);
        // }

        function backToPrevious() {
            $location.path('/app/organ');
        }
    }
})();