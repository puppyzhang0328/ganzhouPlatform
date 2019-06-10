/**
 * Created by huangxiang  on 2018/11/19 0019.
 * @author: huangxiang
 * Module:
 * feature:
 */
(function () {
    angular.module('app.vehicle')
        .factory('vehicleFactory',vehicleFactory);
    'use strict';
    function vehicleFactory() {
        var dayReport = {
            parklotids:"",
            plate_number:"",
            min_intime:"",
            max_intime:"",
            MaxId:""
        };
        var exportSelect=[];
        return {
            setDayReport: setDayReport,
            getDayReport: getDayReport,
            setexportReport:setexportReport,
            getexportReport:getexportReport
        };
        function setexportReport(item) {
            exportSelect=item;
        }
        function getexportReport() {
            return exportSelect;

        }
        function setDayReport(item) {
            dayReport.parklotids=item.parklotids;
            dayReport. plate_number=item.plate_number;
            dayReport. min_intime=item.min_intime;
            dayReport. max_intime=item.max_intime;
            dayReport. MaxId=item.MaxId
        }
        function getDayReport() {
            return dayReport;
        }
    }
})();