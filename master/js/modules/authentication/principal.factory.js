/**
 * principal.factory.js.js
 * @author: huangxiang
 * @create 2017-03-30 11:08
 */
(function () {

    angular.module('app.auth')
        .factory('principal', principal);

    principal.$inject = ['$q', '$http', '$timeout'];

    'use strict';
    function principal($q, $http, $timeout) {
        var _identity = undefined,
            _authenticated = false;

        return {
            isIdentityResolved: function () {
                return angular.isDefined(_identity);
            },
            isAuthenticated: function () {
                return _authenticated;
            },
            isInRole: function (role) {
                if (!_authenticated || !_identity) {
                    return false;
                }
                return _identity.roles.indexOf(role) !== -1;
            },
            isInAnyRole: function (roles) {
                if (!_authenticated || !_identity.roles) {
                    return false;
                }
                for (var i = 0; i < roles.length; i++) {
                    if (this.isInRole(roles[i])) {
                        return true;
                    }
                }
                return false;
            },
            authenticate: function (identity) {
                _identity = identity;
                _authenticated = identity !== null;

                if(identity){
                    localStorage.setItem('park.identity',angular.toJson(identity));
                }else {
                    localStorage.removeItem('park.identity');
                }
            },
            identity: function (force) {
                var deferred = $q.defer();

                if(force === true){
                    _identity = undefined;
                }

                if(angular.isDefined(_identity)){
                    deferred.resolve(_identity);
                    return deferred.promise;
                }
                var self = this;
                $timeout(function () {
                    _identity = angular.fromJson(localStorage.getItem('park.identity'));
                    self.authenticate(_identity);
                    deferred.resolve(_identity);
                },1000);

                return deferred.promise;
            }
        };
    }
})();