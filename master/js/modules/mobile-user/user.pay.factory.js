/**
 * basic.police.factory.js
 * @author: yumaotao
 * @create 2017/12/2
 */
(function () {
    angular.module('app.mobile-user')
        .factory('userPayFactory', userPayFactory);
    'use strict';
    function userPayFactory(){
        var userPay = {
            id:'',
            phone_number:'',
            nick_name:'',
            account_balance:''
        };
        return {
            setUserPay: setUserPay,
            getUserPay: getUserPay
        };
        function setUserPay(cUserPay) {
            userPay.comid = cUserPay.comid;
            userPay.phone_number = cUserPay.phone_number;
            userPay.nick_name = cUserPay.nick_name;
            userPay.account_balance = cUserPay.account_balance;
        }
        function getUserPay() {
            return userPay;
        }
    }
})();