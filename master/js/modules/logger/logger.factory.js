/**
 * Created by huangxiang  on 2016/12/20 0020.
 * @author: huangxiang
 * Module: logger.js
 * feature: $log $toastr 封装
 */
(function () {
    angular.module('app.logger')
        .factory('logger', logger);

    logger.$inject = ['$log', 'toastr'];

    'use strict';
    /**
     * @jsdoc function 自定义封装$log和toastr.
     * @param $log
     * @param toastr
     * @returns {{showToasts: boolean, error: error, info: info, success: success, warning: warning, log: $log.log}}
     */
    function logger($log, toastr) {
        return {
            showToasts: true,

            error: error,
            info: info,
            success: success,
            warning: warning,
            log: $log.log
        };

        /**
         * @jsdoc function $log.error $toastr.error
         * @param message
         * @param data
         * @param title
         */
        function error(message, data, title) {
            toastr.error(message, title);
            $log.error('Error:' + message, data);
        }

        /**
         * @jsdoc function $log.info $toastr.info
         * @param message 提示信息
         * @param data server返回的响应详情
         * @param title 标题
         */
        function info(message, data, title) {
            toastr.info(message, title);
            $log.info('Info:' + message, data);
        }

        /**
         * @jsdoc function $log.error $toastr.error
         * @param message 提示信息
         * @param data server返回的响应详情
         * @param title 标题
         */
        function success(message, data, title) {
            toastr.success(message, title);
            $log.info('Success:' + message, data);
        }

        /**
         * @jsdoc function $log.warning  $toastr.warning
         * @param message 提示信息
         * @param data server返回的响应详情
         * @param title 标题
         */
        function warning(message, data, title) {
            toastr.warning(message, title);
            $log.warning('Warning:' + message, data);
        }
    }
})();
