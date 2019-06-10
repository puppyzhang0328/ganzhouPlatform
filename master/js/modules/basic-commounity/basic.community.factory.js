(function () {
    angular.module('app.basicinfo')
        .factory('communityFactory', communityFactory);
    'use strict';
    function communityFactory(){
        var community = {
            id:'',//序号
            code:'',//类型代码
            name:'',//类型名称
            policeStationid:'',//所属警局id
            policeStationCode:'',//所属警局代码
            policeStationName:''//所属警局名称
        };
        return {
            setCommunity: setCommunity,
            getCommunity: getCommunity
        };
        function setCommunity(cCommunity) {
            community.id = cCommunity.id;
            community.code = cCommunity.code;
            community.name = cCommunity.name;
            community.policeStationid = cCommunity.policeStationid;
            community.policeStationCode = cCommunity.policeStationCode;
            community.policeStationName = cCommunity.policeStationName;
        }
        function getCommunity() {
            return community;
        }
    }
})();