/**
 * error.modal.factory.js
 * @author: huangxiang
 * @create 2017-04-01 16:41
 */
(function(){

    angular.module('app.auth')
        .factory('PermissionErrorModal',PermissionErrorModal);

    PermissionErrorModal.$inject = ['$uibModal'];

    'use strict';
    function PermissionErrorModal($uibModal) {
        return{
          open: function (size, template, params) {
              return $uibModal.open(({
                  animation: true,
                  backdrop:'static',
                  templateUrl: template || '/park/app/views/myModalContent.html',
                  controller: 'ModalResultInstanceController',
                  controllerAs: 'vm',
                  size: size,
                  resolve: {
                      params: function () {
                          return params || '';
                      }
                  }
              }));
          }
        };
    }
})();
