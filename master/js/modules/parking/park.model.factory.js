/**
 * park.model.factory.js
 * @author: huangxiang
 * @create 2016-12-23 11:32
 */
(function () {

    angular.module('app.parking')
        .factory('currentClickPark', currentClickPark);
    'use strict';
    function currentClickPark() {
        var park = {
            name: '',
            address: '',
            city_code: 0,
            longitude: 0.0000,
            latitude: 0.0000,
            price: 0,
            parking_space_total: '',
            type: '',
            identifier: 0,
            id: 0,
            image: '',
            owner:'',//停车场所有人，下拉
            acreage:'',//面积
            placetype:'',//所属商圈，下拉
            lot_type:0,//0是停车场，1充电桩
            chargetype:'',//停车收费类型，true是收费。false:免费
            has_internet:'',//是否有网络，true是有网，false：无网络
            is_entrusted:'',//True -- 委托经营, False -- 非委托经营
            is_plate_rec:'',//是否车牌识别，true:有,false:无
            is3rd:'',//是否第三方场所
            is_active:'',//是否激活
            description:'',//描述
            zonename:'',//街道名称
            region:'',//所在区编号，下拉选择
            manage_company:'',//运营单位，下拉选择
            databasever:'',//数据库版本信息
            osver:'',//操作系统版本号
            hardwarever:'',//硬件系统版本
            softwarever:'',//收费软件版本
            pol_name:'',//派出所名称
            owner_name:'',//所有人名称
            reg_name:'',//区域名称
            town_name:'',//商圈名称
            bus_name:'',
            is_show:'', //是否再App上显示图片
            sign:"" ,//停车场签约是否,
            free_outtime:""//免费离场时间
        };
        return {
            setPark: setPark,
            getPark: getPark
        };
        function setPark(cPark) {
            console.log(cPark);
            park.owner = cPark.owner;//停车场所有人，下拉
            park.acreage = cPark.acreage;//面积
            park.placetype = cPark.placetype;//所属商圈，下拉
            park.lot_type = cPark.lot_type;//0是停车场，1充电桩
            park.chargetype = cPark.chargetype;//停车收费类型，true是收费。false:免费
            park.has_internet = cPark.has_internet;//是否有网络，true是有网，false：无网络
            park.is_entrusted = cPark.is_entrusted;//True -- 委托经营, False -- 非委托经营
            park.is_plate_rec = cPark.is_plate_rec;//是否车牌识别，true:有,false:无
            park.is3rd = cPark.is3rd;//是否第三方场所
            park.is_active = cPark.is_active;//是否激活
            park.description = cPark.description;//描述
            park.zonename = cPark.zonename;//街道名称
            park.region = cPark.region;//所在区编号，下拉选择
            park.manage_company = cPark.manage_company;//运营单位，下拉选择
            park.databasever = cPark.databasever;//数据库版本信息
            park.osver = cPark.osver;//操作系统版本号
            park.hardwarever = cPark.hardwarever;//硬件系统版本
            park.softwarever = cPark.softwarever;//收费软件版本
            park.name = cPark.name;
            park.address = cPark.address;
            park.city_code = cPark.city_code;
            park.longitude = cPark.longitude;
            park.latitude = cPark.latitude;
            park.price = cPark.price;
            park.parking_space_total = cPark.parking_space_total;
            park.type = cPark.type;
            park.identifier = cPark.identifier;
            park.id = cPark.id;
            park.image = cPark.image;
            park.pol_name = cPark.pol_name;
            park.owner_name = cPark.owner_name;
            park.reg_name = cPark.reg_name;
            park.town_name = cPark.town_name;
            park.bus_name = cPark.bus_name;
            park.is_show= cPark.is_show;
            park.sign=cPark.sign;
            park.free_outtime=cPark.free_outtime;
        }
        function getPark() {
            return park;
        }
    }
})();