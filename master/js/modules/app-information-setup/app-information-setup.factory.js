/**
 * basic.police.factory.js
 * @author: yumaotao
 * @create 2017/12/2
 */
(function () {
    angular.module('app.inforsetup')
        .factory('inforsetupFactory', inforsetupFactory);
    'use strict';
    function inforsetupFactory(){
        var platform = {
            menu_id:"",
            menu_name:"",
            menu_url:"",
            title:""
        };
        return {
            setPlatform: setPlatform,
            getPlatform: getPlatform
        };
        function setPlatform(cPlatform) {
            platform.menu_id = cPlatform.id;
            platform.menu_url = cPlatform.menu_url;
            platform.menu_name = cPlatform.menu_name;
            platform.title = cPlatform.title;
        }
        function getPlatform() {
            return platform;
        }
    }
})();