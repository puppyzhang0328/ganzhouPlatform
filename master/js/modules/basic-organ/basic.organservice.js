/**
 * bill.online.service.js.js
 * @author: huangxiang
 * @create 2016-12-29 16:01
 */
(function () {
    'use strict';
    angular.module('app.basicinfo')
        .factory('organService', organService);
    organService.$inject = ['$http', 'URL_SEED'];

    function organService($http, URL_SEED) {
        var ORGAN_URL = URL_SEED.API_URL + 'operation/organman/';//组织机构的增删改查
        return {
            queryOrgan:queryOrgan,//查询区域信息
            addOrgan: addOrgan,//新增区域信息
            deleteOrgan:deleteOrgan,//删除区域信息
            modifyOrgan:modifyOrgan,//修改区域信息
            readRecords:readRecords,//分页查询
            queryOne:queryOne
        };
        //查询组织信息
        function queryOrgan() {
            return $http({
                method: 'GET',
                url: ORGAN_URL,
                params: {
                    querytype: 'all',
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        //新增组织信息
        function addOrgan(orgname,orgphone,orgleader,leaderphone,address,contactname,contactphone,orgemail,orggrade,registernum,orgtype,paytype,isactive,memo,is_settlement,generation_time,settlement_time,max_settlement) {
            var region = angular.toJson({
                orgname : orgname,         // 组织名称
                orgphone : orgphone,         // 组织电话
                orgleader : orgleader,       // 组织领导者
                leaderphone : leaderphone,      // 领导电话
                address : address,         // 组织地址
                contactname : contactname,      // 联系人姓名
                contactphone : contactphone,     // 联系人电话
                orgemail : orgemail,        // 联系人邮箱
                orggrade : orggrade,         // 组织等级
                registernum : registernum,     // 组织注册码
                orgtype : orgtype,          // 组织类型
                paytype : paytype,          // 组织支付类型(预付费/后付费)
                isactive : isactive,         // 是否激活
                memo : memo,          // 备注
                is_settlement : is_settlement,               //是否开通自动对账
                generation_time:generation_time,              //账单自动生成日期（每月）
                settlement_time:settlement_time,             //自动对账日期（每月）
                max_settlement : max_settlement         //最大审核日期
        });
            return $http({
                method: 'POST',
                url: ORGAN_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: region,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        //删除组织信息
        function deleteOrgan(id) {
            var organ = angular.toJson({orgid: id});
            return $http({
                method: 'DELETE',
                url: ORGAN_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: organ,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        //修改区域信息
        function modifyOrgan(id,orgname,orgphone,orgleader,leaderphone,address,contactname,contactphone,orgemail,orggrade,registernum,orgtype,paytype,isactive,memo,is_settlement,generation_time,settlement_time,max_settlement  ) {
            var organ = angular.toJson({
                orgid:id,
                orgname : orgname,         // 组织名称
                orgphone : orgphone,         // 组织电话
                orgleader : orgleader,       // 组织领导者
                leaderphone : leaderphone,      // 领导电话
                address : address,         // 组织地址
                contactname : contactname,      // 联系人姓名
                contactphone : contactphone,     // 联系人电话
                orgemail : orgemail,        // 联系人邮箱
                orggrade : orggrade,         // 组织等级
                registernum : registernum,     // 组织注册码
                orgtype : orgtype,          // 组织类型
                paytype : paytype,          // 组织支付类型(预付费/后付费)
                isactive : isactive,         // 是否激活
                memo : memo,          // 备注
                is_settlement:is_settlement,               //自动对账
                generation_time:generation_time,              //账单自动生成日期（每月）
                settlement_time:settlement_time,              //自动对账日期（每月）
                max_settlement : max_settlement         //最大审核日期
            });
            return $http({
                method: 'PUT',
                url: ORGAN_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: organ,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function readRecords(start_index,pagedirect,id) {
            return $http({
                method: 'GET',
                url: ORGAN_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    start_index:start_index,
                    pagedirect : pagedirect,
                    orgid:id,
                    max_results: 50
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function queryOne(id) {
            return $http({
                method: 'GET',
                url: ORGAN_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                params: {
                    orgid:id,
                    querytype:'one'
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }

    }
})();