/**
 * authorization.factory.js
 * @author: huangxiang
 * @create 2017-03-30 11:28
 */
(function () {

    angular.module('app.auth')
        .factory('authorization', authorization);

    authorization.$inject = ['$rootScope', '$state', 'principal','PermissionErrorModal'];

    'use strict';
    function authorization($rootScope, $state, principal,PermissionErrorModal) {
        return {
            authorize: function () {
                return principal.identity()
                    .then(function () {
                        var isAuthenticated = principal.isAuthenticated();

                        if ($rootScope.toState.data.roles && $rootScope.toState.data.roles.length > 0 && !principal.isInAnyRole($rootScope.toState.data.roles)) {
                            console.log('data.roles == ' + $rootScope.toState.data.roles);
                            if (isAuthenticated) {
                                $state.go('app.no-auth');
                                var modalInstance = PermissionErrorModal.open('sm','/park/app/views/no-auth.html','');

                                modalInstance.result.then(function (result) {
                                    console.log(result);
                                },function (reason) {
                                    console.log(reason);
                                });
                            } // user is signed in but not authorized for desired state
                            else {
                                // user is not authenticated. stow the state they wanted before you
                                // send them to the signin state, so you can return them when you're done
                                $rootScope.returnToState = $rootScope.toState;
                                $rootScope.returnToStateParams = $rootScope.toStateParams;

                                // now, send them to the signin state so they can log in
                                $state.go('page.login');
                            }
                        }
                    });
            }
        };
    }
})();
