/**
 * basic.region.factory.js
 * @author: yumaotao
 * 停车场性质信息表
 * @create 2017/11/6
 */
(function () {
    angular.module('app.basicinfo')
        .factory('busTypeFactory', busTypeFactory);
    'use strict';
    function busTypeFactory(){
        var busType = {
            id:'',//序号
            genrecode:'',//类型代码
            genrename:'',//类型名称
        };
        return {
            setBusType: setBusType,
            getBusType: getBusType
        };
        function setBusType(cBusType) {
            busType.id = cBusType.id;
            busType.genrecode = cBusType.genrecode;
            busType.genrename = cBusType.genrename;
        }
        function getBusType() {
            return busType;
        }
    }
})();