(function () {
    'use strict';

    angular
        .module('app.sidebar')
        .controller('UserBlockController', UserBlockController);

    UserBlockController.$inject = ['$scope','$rootScope','$cookies'];
    function UserBlockController($scope,$rootScope,$cookies) {

        activate();
        $scope.user = $rootScope.user;
        $scope.user.nick_name =  $cookies.get('nick_name');
        $scope.user.organization_name =  $cookies.get('organization_name');
        ////////////////

        function activate() {

            $scope.userBlockVisible = false;

            var detach = $scope.$on('toggleUserBlock', function (/*event, args*/) {

                $scope.userBlockVisible = !$scope.userBlockVisible;

            });

            $scope.$on('$destroy', detach);
        }
    }
})();
