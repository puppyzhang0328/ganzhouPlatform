(function () {
    angular.module('app.parking')
        .factory('parkPowerFactory', parkPowerFactory);
    'use strict';
    function parkPowerFactory() {
        var parkPower = {
            id:'',      //数据id
            number:'',//序号
            funcbase: '',//功能id
            funcname: '',//功能名
            funcvalue: true,//功能状态
            parklot: '',//停车场id
            parklot_name: ''//停车场名
        };
        return {
            setParkPower: setParkPower,
            getParkPower: getParkPower
        };
        function setParkPower(cParkPower) {
            parkPower.id = cParkPower.id;//id
            parkPower.number = cParkPower.number;
            parkPower.funcbase = cParkPower.funcbase;
            parkPower.funcname = cParkPower.funcname;
            parkPower.funcvalue = cParkPower.funcvalue;
            parkPower.parklot = cParkPower.parklot;
            parkPower.parklot_name = cParkPower.parklot_name;
        }
        function getParkPower() {
            return parkPower;
        }
    }
})();