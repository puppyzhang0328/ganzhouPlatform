/**
 * current-park-gate.factory.js
 * @author: huangxiang
 * @create 2016-12-26 15:11
 * @feather: 当前点击的停车场入口 及 modal通用的退出方法
 */
(function () {
    angular.module('app.parking')
        .factory('currentClickParkGate', currentClickParkGate);

    currentClickParkGate.$inject = ['currentClickPark'];

    'use strict';
    /**
     * 设置/获取当前点击的parkgate以及modal的通用退出方法
     * @returns {{setParkGate: setParkGate, getParkGate: getParkGate, getGateIsDefault: getGateIsDefault, getGateTypes: getGateTypes}}
     * @param currentClickPark 存储当前点击的停车场的参数
     */
    function currentClickParkGate(currentClickPark) {

        /*定义当前停车场入口的对象模型*/
        var parkgate = {
            gateid: 0,
            gatename: '',
            isdefault: false,
            longitude: 0.0000,
            latitude: 0.0000,
            currentGateParkId: 0
        };

        /*定义停车场出入口是否为默认的常量*/
        var GateIsDefault = [{
            value: true,
            text: '是'
        }, {
            value: false,
            text: '否'
        }];

        /*定义出口类型参数:1--> 入口  2--> 出口  3-->出/入口一体*/
        var GateTypes = [
            {
                text: '出口',
                value: 2
            },
            {
                text: '入口',
                value: 1
            },
            {
                text: '出/入口',
                value: 3
            }
        ];

        /*返回相关方法*/
        return {
            setParkGate: setParkGate,
            getParkGate: getParkGate,
            getGateIsDefault: getGateIsDefault,
            getGateTypes: getGateTypes
        };

        /**
         * 设置当前停车场出口数据
         * @param cParkGate 当前点击的停车场
         */
        function setParkGate(cParkGate) {
            parkgate.gateid = cParkGate.gateid;
            parkgate.gatename = cParkGate.gatename;
            parkgate.isdefault = cParkGate.isdefault;
            parkgate.longitude = cParkGate.longitude;
            parkgate.latitude = cParkGate.latitude;
            parkgate.currentGateParkId = currentClickPark.getPark().id;
        }

        /**
         * 获取当前点击选择的停车场出入口详情
         * @returns {{gateid: number, gatename: string, isdefault: boolean, longitude: number, latitude: number, currentGateParkId: number}}
         */
        function getParkGate() {
            return parkgate;
        }

        /**
         * 获取出口是否是默认出口的常量定义
         * @returns {*[]} 返回一个数组
         */
        function getGateIsDefault() {
            return GateIsDefault;
        }

        /**
         * 获取出口类型的常量定义
         * @returns {*[]} 返回一个数组
         */
        function getGateTypes() {
            return GateTypes;
        }
    }
})();
