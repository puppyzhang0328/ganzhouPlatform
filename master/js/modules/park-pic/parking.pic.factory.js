(function () {
    angular.module('app.parking')
        .factory('ParkingPicFactory', ParkingPicFactory);
      function ParkingPicFactory() {

          var parkingpic={
              identifier:""
          };

          return {
              setPark: setPark,
              getPark: getPark
          };
          function setPark(item) {
              parkingpic.identifier=item;

          }
        function getPark() {
            return parkingpic
        }

      }


})();