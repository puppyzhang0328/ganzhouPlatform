(function() {
    'use strict';
    angular
        .module('app.utils')
        .directive('time', time);
    time.$inject = [];
    function time() {
        return {
            scope: {
                id: "@",
                legend: "=",
                //item: "=",
                data: "="
            },
            restrict: 'ECA',
            template: '<div></div>',
            replace: true,
            link: function($scope, element, attrs, controller) {
                var select = document.getElementById($scope.id);
                var thisYear = new Date().getFullYear();
                for(var i=1900;i<=thisYear;i++){
                    var option = document.createElement("option");
                    option.value = i;
                    option.innerText = i;
                    select.appendChild(option);
                }
            }
        };
    }

})();
