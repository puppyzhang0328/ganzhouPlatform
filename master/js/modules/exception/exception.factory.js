/**
 * Created by huangxiang  on 2016/12/20 0020.
 * @author: huangxiang
 * Module: exception.factory.js
 * feature: 错误捕获
 */
(function () {
    angular.module('app.exception')
        .factory('exception',exception);
    exception.$inject = [];
    
    function exception(logger) {
        return {
            catcher: catcher
        };

        function catcher(message) {
            return function (reason) {
                logger.error(message,reason);
            };
        }
    }
})();