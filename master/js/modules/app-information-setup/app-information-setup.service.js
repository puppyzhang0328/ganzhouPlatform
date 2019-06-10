/**
 * basic.Platform.factory.js
 * @author: yumaotao
 * @create 2017/12/2
 */
(function () {
    angular.module('app.inforsetup')
        .factory('inforService', inforService);
    inforService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function inforService($http, URL_SEED) {
        var PLATFORM_URL = URL_SEED.API_URL + 'appman/appnews';//查询
        var urlimgs=URL_SEED.API_URL+"appman/appimage";//轮播图查询
        return {
            queryinfo:queryinfo,
            addinfo: addinfo,
            deleteinfo:deleteinfo,
            modifyinfo:modifyinfo,
            queryone:queryone,
            imgsurl:imgsurl
        };
        function queryinfo() {
            return $http({
                method: 'GET',
                url: PLATFORM_URL,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function queryone(menu_id) {
            // var platform = angular.toJson({
            //     menu_id:menu_id
            // });
            return $http({
                method: 'GET',
                url: PLATFORM_URL,
                params:{
                    menu_id:menu_id
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
            
        }
        function addinfo(menu_name,menu_url,menu_type,title) {
            var platform = angular.toJson({
                menu_name:menu_name,
                menu_url:menu_url,
                menu_type:menu_type,
                title:title
            });
            return $http({
                method: 'POST',
                url: PLATFORM_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: platform,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function deleteinfo(id) {
            var platform = angular.toJson({menu_id: id});
            return $http({
                method: 'DELETE',
                url: PLATFORM_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: platform,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function modifyinfo(menu_id,menu_url,title) {
            var platform = angular.toJson({
                menu_id:menu_id,
                menu_url:menu_url,
                title:title
            });
            return $http({
                method: 'PUT',
                url: PLATFORM_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: platform,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        }
        function imgsurl() {
            return $http({
                method: 'GET',
                url: urlimgs,
                params: {
                    page_type:'cover_page',
                    owner:'xxtx'
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
          }
    }
})();