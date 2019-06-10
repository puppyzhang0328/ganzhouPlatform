(function () {
    'use strict';
    angular.module('app.unnormalbill')
        .factory('normalBillFactory', normalBillFactory);
    function normalBillFactory() {
        var groupBill = {
           id:'',           //组织id
        };
        return {
            setGroupBill: setGroupBill,
            getGroupBill: getGroupBill,
        };
        function setGroupBill(cGroupBill) {
            groupBill.id = cGroupBill.id;
        }
        function getGroupBill() {
            return groupBill;
        }
    }
})();