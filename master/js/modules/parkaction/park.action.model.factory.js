(function () {
    angular.module('app.parking')
        .factory('parkActionFactory', parkActionFactory);
    'use strict';
    function parkActionFactory() {
        var parkAction = {
            id:'',      //数据id
            funcname: '',//功能名
            introduce: ''//功能描述
        };
        return {
            setParkAction: setParkAction,
            getParkAction: getParkAction
        };
        function setParkAction(cParkAction) {
            parkAction.id = cParkAction.id;//id
            parkAction.funcname = cParkAction.funcname;
            parkAction.introduce = cParkAction.introduce;
        }
        function getParkAction() {
            return parkAction;
        }
    }
})();