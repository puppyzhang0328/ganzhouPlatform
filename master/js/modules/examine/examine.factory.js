(function () {

    angular.module('app.parking')
        .factory('examineFactorys', examineFactorys);
    'use strict';
    function examineFactorys() {
        var examine = {
            serializer_auditor:'',           //审核者信息
            serializer_initiator:'',         //发起者信息
            id:'',                     //数据id
            created_time:'',            //创建时间
            partnername:'',             //商户结算人员名字
            initiator:'',              //发起者id
            auditor:'',                //审核者id
            initiator_name:'',         //发起者账户名
            auditor_name:'',           //审核者账户名
            name:'',                  //账单名称
            status:'',                 //账单状态（ 0：未审核     1：已查阅，审核中    2：已审核      3：已结算 ）
            organization:'',          //账单所属组织id
            organization_name:'',      //账单所属组织名称
            stroke_count:'',            //数据结算笔数
            aggregate_amount:'',        //数据结算金额
            refund_stroke_count:'',    //退款笔数
            refund_amount:'',           //退款金额
            startime:'',                //查询开始时间（用于请求订单详情）
            endtime:'',                 //查询结束时间（用于请求订单详情）
            amount:'',                   //应缴
            netreceipts:'',               //实缴
            memo:""                      //异常备注
        };
        return {
            setExamine: setExamine,
            getExamine: getExamine
        };
        function setExamine(cExamine) {
            examine.serializer_auditor = cExamine.serializer_auditor;
            examine.serializer_initiator = cExamine.serializer_initiator;
            examine.id = cExamine.id;
            examine.created_time = cExamine.created_time;
            examine.partnername = cExamine.partnername;
            examine.initiator = cExamine.initiator;
            examine.auditor = cExamine.auditor;
            examine.initiator_name = cExamine.initiator_name;
            examine.auditor_name = cExamine.auditor_name;
            examine.name = cExamine.name;
            examine.status = cExamine.status;
            examine.memo = cExamine.memo;
            examine.organization = cExamine.organization;
            examine.organization_name = cExamine.organization_name;
            examine.stroke_count = cExamine.stroke_count;
            examine.aggregate_amount = cExamine.aggregate_amount;
            examine.refund_stroke_count = cExamine.refund_stroke_count;
            examine.refund_amount = cExamine.refund_amount;
            examine.startime = cExamine.startime;
            examine.endtime = cExamine.endtime;
            examine.amount = cExamine.amount;
            examine.netreceipts = cExamine.netreceipts;


        }
        function getExamine() {
            return examine;
        }
    }
})();