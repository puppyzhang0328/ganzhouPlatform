(function () {
    angular.module('app.iotdevice')
        .factory('iotdeviceFactory', iotdeviceFactory);
    'use strict';
    function iotdeviceFactory() {
        var iotdevice = {
            id:'',//id
            devidentifier:'',//设备唯一标示
            devtype: '',//设备类型（如果是数据网关，类型为 1 ）
            parklot:'',//停车场id
            ipaddr:'',//设备网络ip
            devname:'',//设备名
            memo:'',//备忘录
            brand:'',//设备品牌
            devfirm:'',//设备厂商
            created_time:'',//录入时间
            updated_time:'',//修改时间
            firmcontact:'',//设备厂商联系人
            firmphone:'',//设备厂商电话
            parklot_name:''//停车场名称
        };
        return {
            setIotdevice: setIotdevice,
            getIotdevice: getIotdevice
        };
        function setIotdevice(cIotdevice) {
            iotdevice.id = cIotdevice.id;
            iotdevice.devidentifier = cIotdevice.devidentifier;
            iotdevice.devtype = cIotdevice.devtype;
            iotdevice.parklot = cIotdevice.parklot;
            iotdevice.ipaddr = cIotdevice.ipaddr;
            iotdevice.devname = cIotdevice.devname;
            iotdevice.memo = cIotdevice.memo;
            iotdevice.brand = cIotdevice.brand;
            iotdevice.devfirm = cIotdevice.devfirm;
            iotdevice.created_time = cIotdevice.created_time;
            iotdevice.updated_time = cIotdevice.updated_time;
            iotdevice.firmcontact = cIotdevice.firmcontact;
            iotdevice.firmphone = cIotdevice.firmphone;
            iotdevice.parklot_name = cIotdevice.parklot_name;
        }
        function getIotdevice() {
            return iotdevice;
        }
    }
})();