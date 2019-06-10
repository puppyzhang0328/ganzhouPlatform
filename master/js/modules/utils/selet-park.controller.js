/**
 * Created by huangxiang  on 2016/12/16 0016.
 * @author: huangxiang
 * Module: select-park.controller.js
 * feature: 停车场下拉选择设置
 */
(function () {
    angular.module('app.utils')
        .controller('SelectParkController', SelectParkController);

    SelectParkController.$inject = ['$scope', 'ParkList', '$log'];

    function SelectParkController($scope, ParkList, $log) {

        var vm = this;

        /*停车场选择-------------------------------------------------*/
        vm.disabled = undefined;
        vm.searchEnabled = undefined;

        vm.setInputFocus = function () {
            $scope.$broadcast('UiselectDemo1');
        };
        vm.enable = function () {
            vm.disabled = false;
        };

        vm.disabled = function () {
            vm.disabled = true;
        };

        vm.enableSearch = function () {
            vm.searchEnabled = true;
        };

        vm.disableSearch = function () {
            vm.searchEnabled = false;
        };

        vm.someGroupFn = function (item) {

            if (item.name[0] >= 'A' && item.name[0] <= 'M')
                return 'From A - M';

            if (item.name[0] >= 'N' && item.name[0] <= 'Z')
                return 'From N - Z';

        };

        vm.firstLetterGroupFn = function (item) {
            return item.name[0];
        };

        vm.reverseOrderFilterFn = function (groups) {
            return groups.reverse();
        };
        vm.parkingAsync = {selected: 'wladimir@email.com'};
        vm.parkingAsync = ParkList.getParkAsyn();

        $log.warn(ParkList.getParkAsyn());

        var allParkLots = ParkList.getParkId();

        $log.warn(allParkLots);


        vm.onSelectCallback = function (item) {
            vm.eventResult = {model: item};
            vm.seletPark.id = vm.eventResult.model.id;
        };

        vm.seletPark = {
            id: undefined
        };
        /*停车场选择-------------------------------------------------*/

        vm.menuState = {
            show: false
        };
        vm.toggleMenu = function () {
            vm.menuState.show = !vm.menuState.show;
        };

        /*清除查找条件*/
        vm.clearAndRefresh = function () {
            vm.eventResult.model = undefined;
            vm.parkingAsync.selected = undefined;
            vm.seletPark.id = undefined;
            vm.search_plate_number = undefined;
            vm.loadFistPage();
        };
    }
})();
