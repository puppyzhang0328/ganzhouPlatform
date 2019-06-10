/**
 * basic.bureau.factory.js
 * @author: yumaotao
 * @create 2017/12/2
 */
(function () {
    angular.module('app.basicinfo')
        .factory('bureauFactory', bureauFactory);
    'use strict';
    function bureauFactory(){
        var bureau = {
            id:'',//派出所id
            cityproperCode:'',//分县市局代码
            cityproperName:'',//分县市局名称
            region:'',//所属区域
            regionName:'',//所属区域名称
            regionCode:'',//所属区域代码
            regionId:''//所属区域id
        };
        return {
            setBureau: setBureau,
            getBureau: getBureau
        };
        function setBureau(cBureau) {
            bureau.id = cBureau.id;
            bureau.cityproperCode = cBureau.cityproperCode;
            bureau.cityproperName = cBureau.cityproperName;
            bureau.region = cBureau.region;
            bureau.regionName = cBureau.regionName;
            bureau.regionCode = cBureau.regionCode;
            bureau.regionId = cBureau.regionId;
        }
        function getBureau() {
            return bureau;
        }
    }
})();