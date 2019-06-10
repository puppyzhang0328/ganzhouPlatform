(function () {
    angular.module('app.parking')
        .factory('parkActionFactory', parkActionFactory);
    'use strict';
    function parkActionFactory() {
        var parkAction = {
            id:'',      //数据id
            number:'',  //序号
            parklot_id:'',//停车场ID
            parkActionNaem: '',//功能名
            parkActionId:'',//功能id
            parkName:''//停车场名称
        };
        return {
            setParkAction: setParkAction,
            getParkAction: getParkAction
        };
        function setParkAction(cparkAction) {
            parkAction.id = cparkAction.id;
            parkAction.parklot_id = cparkAction.parklot_id;
            parkAction.number = cparkAction.number;
            parkAction.parkActionNaem = cparkAction.parkActionNaem;
            parkAction.parkActionId = cparkAction.parkActionId;
            parkAction.parkName = cparkAction.parkName;
        }
        function getParkAction() {
            return parkAction;
        }
    }
})();