/**
 * basic.region.factory.js
 * @author: yumaotao
 * @create 2017/11/6
 */
(function () {
    angular.module('app.basicinfo')
        .factory('regionFactory', regionFactory);
    'use strict';
    function regionFactory(){
        var region = {
            id:'',//序号
            code:'',//区域代码
            pcode:'',//父区域代码，父区域的id
            name:'',//区域名称
            suffix:'',//行政单位
            fullname:'',//行政全名
            pinyin:'',//区域名字拼音全称
            py:'',//区域名字拼音简称
            level:'',//区域级别：1-省级，2-地市级，3-区县级，4-乡镇级
            pname:'',//父区域名称
            pid:''//父区域id
        };
        return {
            setRegion: setRegion,
            getRegion: getRegion
        };
        function setRegion(cRegion) {
            region.id = cRegion.id;
            region.code = cRegion.code;
            region.pcode = cRegion.pcode;
            region.name = cRegion.name;
            region.suffix = cRegion.suffix;
            region.fullname = cRegion.fullname;
            region.pinyin = cRegion.pinyin;
            region.pinyin = cRegion.pinyin;
            region.py = cRegion.py;
            region.level = cRegion.level;
            region.pname = cRegion.pname;
            region.pid = cRegion.pid;
        }
        function getRegion() {
            return region;
        }
    }
})();