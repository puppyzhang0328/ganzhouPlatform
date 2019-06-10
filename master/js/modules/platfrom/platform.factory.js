/**
 * basic.police.factory.js
 * @author: yumaotao
 * @create 2017/12/2
 */
(function () {
    angular.module('app.basicinfo')
        .factory('platformFactory', platformFactory);
    'use strict';
    function platformFactory(){
        var platform = {
            id:'',//平台数据id
            plateformname:'',//平台名字
            loginurl:'',//平台登录url
            username:'',//平台用户名
            password:'',//平台密码
            encrypt_passwd:'',//平台加密密码
            dataurl:'',//数据上传接口
            param1:''//可以用来保存密钥文件的路径
        };
        return {
            setPlatform: setPlatform,
            getPlatform: getPlatform
        };
        function setPlatform(cPlatform) {
            platform.id = cPlatform.id;
            platform.plateformname = cPlatform.plateformname;
            platform.loginurl = cPlatform.loginurl;
            platform.username = cPlatform.username;
            platform.password = cPlatform.password;
            platform.encrypt_passwd = cPlatform.encrypt_passwd;
            platform.dataurl = cPlatform.dataurl;
            platform.param1 = cPlatform.param1;
        }
        function getPlatform() {
            return platform;
        }
    }
})();