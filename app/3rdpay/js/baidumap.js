var map = new BMap.Map("allmap");    // 创建Map实例
var geolocation = new BMap.Geolocation();
geolocation.getCurrentPosition(function(r){
    if(this.getStatus() == BMAP_STATUS_SUCCESS){
        mk = new BMap.Marker(r.point);
        map.addOverlay(mk);
        map.centerAndZoom(new BMap.Point(r.point.lng, r.point.lat), 18);  // 初始化地图,设置中心点坐标和地图级别
    }else {
        alert('failed'+this.getStatus());
    }
});
map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
map.enableScrollWheelZoom(true);
$(function () {
    window.start_index = 0;
    window.markI = 0;
    window.t1 = window.setInterval("initMarker('')",200);
})
//单击单个苗圃事件
function LoadPartial(id, systemid) {
    initMarker(id);
}
//加载标注点
function initMarker(id) {
    $.ajax({
        type: "Get",
        url: "http://dev.dadapark.com/parkhero/v0.1/parking/parking_lots/",
        dataType: "json",
        async: false,
        data: {
            "city_code": 158,
            "max_results":100,
            "start_index":window.start_index,
            pagedirect:1
        },
        success: function (data) {
            var i = 0;
            var points = [];
            if( data.parking_lots.length !== 0){
                window.start_index =  data.parking_lots[data.parking_lots.length - 1].id;
                for (var item in data.parking_lots) {
                    (function (x) {
                        if(data.parking_lots[item].parkgate.length>0){
                            var pt = new BMap.Point(data.parking_lots[item].parkgate[0].longitude, data.parking_lots[item].parkgate[0].latitude);
                            var ab = data.parking_lots[item].parking_space_available/ data.parking_lots[item].parking_space_total;
                            var greenIcon = new BMap.Icon("img/ic_close_green.png", new BMap.Size(30,30));
                            var yellowIcon = new BMap.Icon("img/ic_close_yellow.png", new BMap.Size(30,30));
                            var redIcon = new BMap.Icon("img/ic_close_red.png", new BMap.Size(30,30));
                            var d = ab.toFixed(2);
                            var c = Math.abs(Number(d)*100);
                            points[i] = pt;
                            if(10 >=c && c>=0){
                                marker = new BMap.Marker(pt,{icon:redIcon});
                            }else if(30>= c&& c>10){
                                marker = new BMap.Marker(pt,{icon:yellowIcon});
                            }else if(100>=c && c>30){
                                marker = new BMap.Marker(pt,{icon:greenIcon});
                            }
                            map.addOverlay(marker);
                            var label = new BMap.Label(data.parking_lots[item].parking_space_available, { offset: new BMap.Size(30, -10) });
                            marker.setLabel(label);
                            label.setStyle({
                                color: "White",
                                fontSize: "14px",
                                border: "0"
                            });
                            //创建信息窗口
                            var opts = {
                                width: 400,     // 信息窗口宽度
                                height: 120,     // 信息窗口高度
                                title: "<strong style=\"font-size:16px;font-weight:bold\">" + data.parking_lots[item].name + "</strong>", // 信息窗口标题
                                enableMessage: true, //设置允许信息窗发送短息
                                message: ""
                            }
                            var showInfo = "地址：" + data.parking_lots[item].address + "<br/>剩余车位数：" + data.parking_lots[item].parking_space_available + "<br/>总车位数:" + data.parking_lots[item].parking_space_total;
                            var infoWindow = new BMap.InfoWindow(showInfo, opts);  // 创建信息窗口对象
                            marker.addEventListener("click", function (e) {
                                map.openInfoWindow(infoWindow,pt); //开启信息窗口
                            });
                            map.addOverlay(marker);
                            i++;
                        }
                    })(i);
                }
            }else{
                window.clearInterval(window.t1);
            }
        },
        error: function (error) {
            alert("加载失败，请检查网络或其他原因");
        }
    });
}


//清除覆盖物
function cleardd() {
    for (var i = 0; i < overlays.length; i++) {
        map.removeOverlay(overlays[i]);
    }
    overlays.length = 0;
}