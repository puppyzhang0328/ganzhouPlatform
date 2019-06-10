(function () {
    'use strict';
    angular.module('app.parking')
        .factory('groupBillFactory', groupBillFactory);

    function groupBillFactory() {
        var groupBill = {
            organization:'',           //组织id
            startime:'',         //起始时间
            endtime:''                    //结束时间
        };
        return {
            setGroupBill: setGroupBill,
            getGroupBill: getGroupBill,
            setBillDetail:setBillDetail  //bill 跳转
            // getBillDetail:getBillDetail  //bill 跳转
        };
        function setGroupBill(cGroupBill) {
            groupBill.organization = cGroupBill.organization;
            groupBill.startime = cGroupBill.startime;
            groupBill.endtime = cGroupBill.endtime;
        }
        function  setBillDetail(cGroupBill) {
            groupBill.organization = cGroupBill.organization;
            groupBill.startime = cGroupBill.dateclosing;
            groupBill.endtime = cGroupBill.endtime;
        }
        function getGroupBill() {
            return groupBill;
        }
        // function getBillDetail() {
        //     return groupBill;
        // }
    }
})();