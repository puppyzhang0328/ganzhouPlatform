/**
 * basic.region.factory.js
 * @author: yumaotao
 * @create 2017/11/6
 */
(function () {
    angular.module('app.basicinfo')
        .factory('townFactory', townFactory);
    'use strict';
    function townFactory(){
        var town = {
            id:'',//序号
            code:'',//
            name:'',//
            region:'',//行政区代码
            rid:'',//行政区域ID
            rname:''//行政区域名字
        };
        return {
            setTown: setTown,
            getTown: getTown
        };
        function setTown(cTown) {
            town.id = cTown.id;
            town.code = cTown.code;
            town.name = cTown.name;
            town.region = cTown.region;
            town.rid = cTown.rid;
            town.rname = cTown.rname;
        }
        function getTown() {
            return town;
        }
    }
})();