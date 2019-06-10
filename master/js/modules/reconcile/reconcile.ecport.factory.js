(function () {
    angular.module('app.parking')
        .factory('reconcileExportFactory', reconcileExportFactory);
    'use strict';
    function reconcileExportFactory() {
        var organReconcile = {
            id:'',
            organId:'',
            valid_begintime:'',
            valid_endtime:'',
            parklotname:''
        };
        return {
            setorganReconcile: setorganReconcile,
            getorganReconcile: getorganReconcile
        };
        function setorganReconcile(cOrganReconcile,b) {
            organReconcile.id = cOrganReconcile.id;
            organReconcile.organId = cOrganReconcile.organId;
            organReconcile.valid_begintime = cOrganReconcile.valid_begintime;
            organReconcile.valid_endtime = cOrganReconcile.valid_endtime;
            organReconcile.parklotname = cOrganReconcile.parklotname;
        }
        function getorganReconcile() {
            return organReconcile;
        }
    }
})();