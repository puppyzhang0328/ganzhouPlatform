/**
 * Created by huangxiang  on 2016/12/15 0015.
 * @author: huangxiang
 * Module: park-select.directive.js
 * feature: 停车场选择自定义通用模块
 */
(function () {

    angular.module('app.utils')
        .directive('parkSelect', parkSelect);

    parkSelect.$inject = [];

    function parkSelect() {
        return {
            restrict: 'EAC',
            templateUrl: '../park/app/views/partials/park-select.html',
            controller: 'SelectParkController',
            controllerAs: 'ctrl',
            bindToController: true
        };
    }

})();   