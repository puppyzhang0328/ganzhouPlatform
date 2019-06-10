var app = angular.module('app', []);
app.controller('cityCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.error = {};
    $scope.list = [];
    $http.get('http://xxtx.cszhjt.com/3rdpay/test/list.json').success(function (data) {
        $scope.list = data;
    });


    $scope.c = function () {
        $scope.error.province = false;
        $scope.error.city = false;
        $scope.error.area = false;
        $scope.selected2 = "";
        $scope.selected3 = "";
    };

    $scope.c2 = function () {
        $scope.error.city = false;
        $scope.error.area = false;
        $scope.selected3 = "";
    };

    $scope.c3 = function () {
        $scope.error.area = false;
    };

    $scope.submit = function () {
        $scope.error.province = $scope.selected ? false : true;
        $scope.error.city = $scope.selected2 ? false : true;
        $scope.error.area = $scope.selected3 ? false : true;
    };


}]);


//
angular.bootstrap(document, ['app']);