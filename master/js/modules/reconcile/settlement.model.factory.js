(function () {
    angular.module('app.parking')
        .factory('settlementFactory', settlementFactory);
    'use strict';
    function settlementFactory() {
        var settlement = {
            id:'',      //数据id
            number:'',//序号
            funcbase: '',//功能id
            funcname: '',//功能名
            funcvalue: true,//功能状态
            parklot: '',//停车场id
            parklot_name: ''//停车场名
        };
        return {
            setSettlement: setSettlement,
            getSettlement: getSettlement
        };
        function setSettlement(cSettlement) {
            settlement.id = cSettlement.id;//id
            settlement.number = cSettlement.number;
            settlement.funcbase = cSettlement.funcbase;
            settlement.funcname = cSettlement.funcname;
            settlement.funcvalue = cSettlement.funcvalue;
            settlement.parklot = cSettlement.parklot;
            settlement.parklot_name = cSettlement.parklot_name;
        }
        function getSettlement() {
            return settlement;
        }
    }
})();