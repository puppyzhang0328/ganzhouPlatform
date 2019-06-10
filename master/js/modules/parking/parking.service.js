(function () {
    angular.module('app.parking')
        .factory('ManageParkingService', ManageParkingService);
    ManageParkingService.$inject = ['$http', 'URL_SEED'];
    'use strict';
    function ManageParkingService($http, URL_SEED) {
        var service = {};
        var OPERATION_URL = URL_SEED.API_URL + 'operation/parklots/'; // 增删改查停车场URL
        var QUERY_GATE_URL = URL_SEED.API_URL + 'operation/parkgate/'; // 查询停车场入口坐标url
        var BMAP_PARKING_URL = URL_SEED.API_URL + 'parking/parking_lots/'; // 百度地图上的地图显示
        var PAEKLOTEXPORT = URL_SEED.API_URL + 'operation/parklot_export/';//导出
        var BaiDuSearch=URL_SEED.API_URL+'parking/parklot_search/';//停车场搜索的框
        /*查询百度地图信息*/
        service.queryBaiDuMapParking = function (start_index) {
            return $http({
                method: 'GET',
                url: BMAP_PARKING_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                params:{
                  max_results: 100,
                  start_index:start_index,
                  pagedirect:1
                },
                withCredentials: true
            }).then(function (response) {
               return response.data;
            });
        };
      //  搜索框里面的百度地图查询
        service.querySearchBaiDuMapParking=function (start_index) {
            return $http({
                method: 'GET',
                url: BaiDuSearch,
                headers: {
                    'Content-type': 'application/json'
                },
                params:{
                    max_results: 100,
                    start_index:start_index,
                    pagedirect:1
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });

        };
        //
        
        
        
        /*查询单个停车场上传密钥*/
        service.queryParkingDetail = function (id) {
            return $http({
                method: 'GET',
                url: OPERATION_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                params: {
                    'parklotid': id,
                    'querytype': 'one'
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        /*查询所有停车场数据*/
        service.queryParking = function () {
            return $http({
                method: 'GET',
                url: OPERATION_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                params: {
                    'lot_type':'CP',
                    'querytype': 'all'
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        /*查询停车场入口坐标*/
        service.queryGate = function (parklotid) {
            return $http({
                method: 'GET',
                url: QUERY_GATE_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                params: {
                    parklotid: parklotid
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        /*新增停车场入口*/
        service.addGate = function (gatename, isdefault, gatetype, longitude, latitude, parklotid) {
            var gate_info = angular.toJson({
                gatename: gatename,
                isdefault: isdefault,
                gatetype: gatetype,
                longitude: longitude,
                latitude: latitude,
                parklotid: parklotid
            });
            return $http({
                method: 'POST',
                url: QUERY_GATE_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: gate_info,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        /*修改停车场入口*/
        service.modifyGate = function (parkgateid, gatename, isdefault, latitude, longitude, parklotid) {
            var gate_info = angular.toJson({
                parkgateid: parkgateid,
                gatename: gatename,
                isdefault: isdefault,
                longitude: longitude,
                latitude: latitude,
                parklotid: parklotid
            });
            return $http({
                method: 'PUT',
                url: QUERY_GATE_URL,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: gate_info,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        /*删除停车场入口*/
        service.deleteGate = function (gateid) {
            var gate_info = angular.toJson({parkgateid: gateid});
            return $http({
                method: 'DELETE',
                url: QUERY_GATE_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: gate_info,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        /*新增停车场 录入停车场数据*/
        service.addParking = function (name,address,city_code,price,parking_space_total,owner,acreage,chargetype,has_internet,is_entrusted,is_plate_rec,is3rd,is_active,placetype,zonename,region,manage_company,databasever,osver,hardwarever,softwarever,description,policestationid,bussinessid,community,hardware,software,type,is_show,sign,free_outtime) {
            var parking_info = angular.toJson({
                lot_type:0,
                name:name,
                address:address,
                city_code:city_code,
                price:price,
                parking_space_total:parking_space_total,
                owner:owner,
                acreage:acreage,
                chargetype:chargetype,
                has_internet:has_internet,
                is_entrusted:is_entrusted,
                is_plate_rec:is_plate_rec,
                is3rd:is3rd,
                is_active:is_active,
                towncentreid:placetype,
                zonename:zonename,
                regionid:region,
                manage_company:manage_company,
                databasever:databasever,
                osver:osver,
                hardwarever:hardwarever,
                softwarever:softwarever,
                description:description,
                policestationid:policestationid,
                placetype:bussinessid,
                communityid:community,
                hardware_companyid:hardware,
                software_companyid:software,
                type:type,
                is_show:is_show,
                sign:sign,
                free_outtime:free_outtime
            });

            return $http({
                method: 'POST',
                url: OPERATION_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: parking_info,
                withCredentials: true
            }).success(function (response) {
                return response.data;
            }).error(function (response) {
                return response.data;
            });
        };
        /*修改停车场信息*/
        service.modifyParking = function (id,name,address,city_code,price,parking_space_total,owner,acreage,chargetype,has_internet,is_entrusted,is_plate_rec,is3rd,is_active,placetype,zonename,region,manage_company,databasever,osver,hardwarever,softwarever,description,policestationid,bussinessid,community,hardware,software,type,is_show,sign,free_outtime) {
            var parking_info = angular.toJson({
                parklotid: id,
                name:name,
                address:address,
                city_code:city_code,
                price:price,
                parking_space_total:parking_space_total,
                owner:owner,
                acreage:owner,
                chargetype:chargetype,
                has_internet:has_internet,
                is_entrusted:is_entrusted,
                is_plate_rec:is_plate_rec,
                is3rd:is3rd,
                is_active:is_active,
                towncentreid:placetype,
                zonename:zonename,
                regionid:region,
                manage_company:manage_company,
                databasever:databasever,
                osver:osver,
                hardwarever:hardwarever,
                softwarever:softwarever,
                description:description,
                policestationid:policestationid,
                placetype:bussinessid,
                communityid:community,
                hardware_companyid:hardware,
                software_companyid:software,
                type:type,
                lot_type:0,
                is_show:is_show,
                sign:sign,
                free_outtime:free_outtime
            });
            console.log(parking_info);
            return $http({
                method: 'PUT',
                url: OPERATION_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: parking_info,
                withCredentials: true

            }).then(function (response) {
                return response.data;
            });
        };
        /*删除停车场*/
        service.deleteParking = function (id) {
            var parking_info = angular.toJson({parklotid: id});
            return $http({
                method: 'DELETE',
                url: OPERATION_URL,
                headers: {
                    'Content-type': 'application/json'
                },
                data: parking_info,
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        //分页查询
        service.readRecords =function(start_index,pagedirect,region,business,picture_no,lat_long_no,price_no,other_platform,parkId) {
            var querytype;
            if(parkId || region || business){querytype = "all";}else{querytype = '';}
            return $http({
                method: 'GET',
                url: OPERATION_URL,
                params: {
                    max_results: 50,
                    start_index: start_index,
                    region:region,
                    business:business,
                    pagedirect: pagedirect,
                    picture_no:picture_no,
                    lat_long_no:lat_long_no,
                    price_no:price_no,
                    other_platform:other_platform,
                    parklotid:parkId,
                    querytype:querytype
                
                },
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        service.parklotExport =function() {
            return $http({
                method: 'GET',
                url: PAEKLOTEXPORT,
                data: '',
                withCredentials: true
            }).then(function (response) {
                return response.data;
            });
        };
        return service;
    }
})();
