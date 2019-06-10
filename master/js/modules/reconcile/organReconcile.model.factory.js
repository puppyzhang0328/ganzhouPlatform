(function () {
    angular.module('app.parking')
        .factory('organReconcileFactory', organReconcileFactory);
    'use strict';
    function organReconcileFactory() {
        var organReconcile = {
            id:'',
            organId:'',
            valid_begintime:'',
            valid_endtime:'',
            parklotname:'',
            lottype:''
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
            organReconcile.lottype = cOrganReconcile.lottype;
        }
        function getorganReconcile() {
            return organReconcile;
        }
    }
})();