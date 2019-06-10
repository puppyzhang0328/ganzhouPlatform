/**
 * basic.region.factory.js
 * @author: yumaotao
 * @create 2017/11/21
 */
(function () {
    'use strict';
    angular.module('app.basicinfo')
        .factory('organFactory', organFactory);

    function organFactory(){
        var organ = {
            id:'',//序号
            orgname:'',         // 组织名称
            orglogo : '',         // 组织logo
            orgphone : '',         // 组织电话
            orgleader : '',       // 组织领导者
            leaderphone : '',      // 领导电话
            address : '',         // 组织地址
            contactname : '',      // 联系人姓名
            contactphone : '',     // 联系人电话
            orgemail : '',        // 联系人邮箱
            businesslicence : '', // 组织营业执照
            orggrade : '',         // 组织等级
            registernum : '',     // 组织注册码
            orgtype : '',          // 组织类型
            paytype : '',          // 组织支付类型(预付费/后付费)
            isactive : '',         // 是否激活
            memo : '',          // 备注
            is_settlement :'',   //是否开通自动对账
            generation_time :'',
            settlement_time : '',
            max_settlement :''
        };
        return {
            setOrgan: setOrgan,
            getOrgan: getOrgan
        };
        function setOrgan(cOrgan) {
            organ.id = cOrgan.id;
            organ.orgname = cOrgan.orgname,         // 组织名称
            organ.orglogo = cOrgan.orglogo,         // 组织logo
            organ.orgphone = cOrgan.orgphone,         // 组织电话
            organ.orgleader = cOrgan.orgleader,       // 组织领导者
            organ.leaderphone = cOrgan.leaderphone,      // 领导电话
            organ.address = cOrgan.address,         // 组织地址
            organ.contactname = cOrgan.contactname,      // 联系人姓名
            organ.contactphone = cOrgan.contactphone,     // 联系人电话
            organ.orgemail = cOrgan.orgemail,        // 联系人邮箱
            organ.businesslicence = cOrgan.businesslicence, // 组织营业执照
            organ.orggrade = cOrgan.orggrade,         // 组织等级
            organ.registernum = cOrgan.registernum,     // 组织注册码
            organ.orgtype = cOrgan.orgtype,          // 组织类型
            organ.paytype = cOrgan.paytype,          // 组织支付类型(预付费/后付费)
            organ.isactive = cOrgan.isactive,         // 是否激活
            organ.memo = cOrgan.memo,          // 备注
            organ.is_settlement =  cOrgan.is_settlement ,         // 是否开通对账
            organ.generation_time = cOrgan.generation_time ,             //账单自动生成日期（每月）
            organ.settlement_time = cOrgan.settlement_time ,            //自动对账日期（每月）
            organ.max_settlement = cOrgan.max_settlement             //最大审核日期
        }
        function getOrgan() {
            return organ;
        }
    }
})();