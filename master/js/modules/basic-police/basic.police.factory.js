/**
 * basic.police.factory.js
 * @author: yumaotao
 * @create 2017/12/2
 */
(function () {
    angular.module('app.basicinfo')
        .factory('policeFactory', policeFactory);
    'use strict';
    function policeFactory(){
        var police = {
            id:'',//派出所id
            stationCode:'',//派出所代码
            stationName:'',//派出所名称
            bureauid:'',//所属市局id
            bureauName:''
        };
        return {
            setPolice: setPolice,
            getPolice: getPolice
        };
        function setPolice(cPolice) {
            police.id = cPolice.id;
            police.stationCode = cPolice.stationCode;
            police.stationName = cPolice.stationName;
            police.bureauid = cPolice.bureauid;
            police.bureauName = cPolice.bureauName;
        }
        function getPolice() {
            return police;
        }
    }
})();