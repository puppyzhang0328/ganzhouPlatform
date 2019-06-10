
var urls="http://xxtx.cszhjt.com";

//查询链接后的字符串
function getOpenId(name){
    var reg  =  new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if(r != null){
        return decodeURI(r[2]);
    }else{
        return null;
    }
}
function GetRequest() {
    var url = location.search; //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
// $('#historyCar').html('湘A123456');
//获取链接后的查询历史记录
function getPlatenums(platenum) {
    var reg = /\'(.*?)\'/;
    var platephonenum = (platenum.split(','))[0];
    var newplatenum=platephonenum.slice(2,9)
    newplatenum=newplatenum.split('');
    // console.log(typeof newplatenum)
    for (var i=0;i<newplatenum.length;i++){
            for(var j = 0;j<8;j++){
                if(i==j){
                    $("#"+i).text(newplatenum[i])
                }
            }
    }

}

// function getPlatenums(湘A123456) {
//     var reg = /\'(.*?)\'/;
//     var len = (platenum.split(',')).length;
//     var tpl ='';
//     for(var i=0;i<len;i++){
//         var platenum = platenum.replace(platenum.match(reg)[0],'');
//         var a = RegExp.$1;
//         tpl += '<div style="border: 1px solid #ededed;border-top: none;border-radius: 0" onclick="addHistryCar(\''+a+'\')">'+a+'</div>';
//     }
//     $('#historyCar').html('湘A123456');
// }


function addHistryCar(a,b) {
    openMask();
    $.get(urls+'/parkhero/v0.1/billing/onlinepay/',{'plate_number':a,'paytype':'wechatpay','servicetype':'parkingpay'},function(response){
        if(response.status == '0'){
            alert(response.trade_no);
            window.open(response.trade_no,'_self');
            sessionStorage.setItem("plate_number",a);
            closeMask();
            $(".keyboard").hide();
            $('.query').hide();
            $('.confirm').show();
            var amount = (response.trade_no.menuinfo.amount/100).toFixed(2);
            var charged_duration = Math.floor(response.trade_no.menuinfo.charged_duration/60)+'小时'+(response.trade_no.menuinfo.charged_duration)%60+'分';
            $('.plate_number').html(response.trade_no.menuinfo.plate_number);
            $('#amount').html(amount);
            $('#charged_duration').html(charged_duration);
            $('#parking_time').html(response.trade_no.menuinfo.parking_time);
            $('#parking_lot').text(response.trade_no.menuinfo.parking_lot);
            $('#parking_card_number').html(response.trade_no.menuinfo.parking_card_number);
            if(response.trade_no.menuinfo.lot_type == "路边"){
                $("#leave_time").html("5分钟")
            }else{
                $("#leave_time").html("15分钟")
            }
            payError();
        }else if(response.status == '30009'){
            sessionStorage.setItem("plate_number",plate_number);
            closeMask();
            $(".keyboard").hide();
            $('.query').hide();
            $('.confirm').show();
            $('#amount').html('0');
            var charged_duration = Math.floor(response.trade_no.charged_duration/60)+'小时'+(response.trade_no.charged_duration)%60+'分';
            $('.plate_number').html(a);
            $('#charged_duration').html(charged_duration);
            $('#parking_time').html(response.trade_no.parking_time);
            $('#parking_lot').text(response.trade_no.parking_lot);
            $('#parking_card_number').html(response.trade_no.parking_card_number);
            if(response.trade_no.lot_type == "路边"){
                $("#leave_time").html("5分钟");
            }else{
                $("#leave_time").html("15分钟");
            }
            $("#pay_btn").hide();
            payError();
        }else if(response.status == '30008'){
            closeMask();
            alert('订单已经支付');
        }else if(response.status == '30011'){
            closeMask();
            alert('已经现金缴费');
        }else if(response.status == '30010'){
            closeMask();
            alert('不支持在线缴费');
        }else{
            closeMask();
            alert('暂无未缴账单！');
        }
    })
}
//获取OpenId和缴费车牌历史记录
var openidNaw  = getOpenId('openid');//获取urlopenid
var platenum  = getOpenId('platenums');//获取缴费车牌历史记录
// var platenum  = "湘A12345";
console.log(platenum);
if (platenum !== '' && platenum !== null){
    getPlatenums(platenum);
}
//初始化键盘变量
(function ($) {
    var attachFastClick = Origami.fastclick;
    attachFastClick(document.body);
    var lpnSelect = $.fn.lpnSelect();

    sessionStorage.clear();
    var req= new Object();
    req = GetRequest();
    var paytype = req.paytype;//请求里面获取支付参数
    var platenum = req.platenum;//请求里面获取platenum
    if(platenum){
        addHistryCar(platenum,paytype);
    }
    //轮播图请求
    $.ajax({
        type:"get",
        url: urls+"/parkhero/v0.1/appman/appimage",
        data:{
            page_type:'wechat_page',
            owner:'xxtx'
        },
        dataType:'json',
        success:function (data) {
            if(data.status==0){
                var inner=""
                for (var i=0;i<data.wechat_page.length;i++){
                     inner +='<div class="swiper-slide">'
                         +'<img src="http://dev.dadapark.com/parkhero/media/' +data.wechat_page[i]
                         + '" style="width: 100%;height: 100%"></div>';

                }
                $(".swiper-container .swiper-wrapper").html(inner);
                //轮播图设置
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    autoplay: 1500
                });

            }else {
                var inner=""
                for (var i=1;i<4;i++){
                    inner +='<div class="swiper-slide">'
                        +'<img src="img/' +i+'.jpg'
                        + '" style="width: 100%;height: 100%"></div>';
                }
                $(".swiper-container .swiper-wrapper").html(inner);
                //轮播图设置
                var swiper = new Swiper('.swiper-container', {
                    pagination: '.swiper-pagination',
                    paginationClickable: true,
                    autoplay: 1500
                });
            }


        }
    });

})(Zepto);
$("#carplatnum").focus(function(){
    document.activeElement.blur();
});
//点击确定
$('#queryBill').on('click',function(){
    var a = "",b="";
    for(var i = 0;i<8;i++){
        a = $("#"+i).text();
        b+=a;
    }
    var plate_number = b;
    if(plate_number == ''){
        alert('车牌号不能为空');
        return false;
    }else if(plate_number.length<7) {
        alert('请输入完整的车牌号');
        return false;
    }else {
        var reg =  /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽港澳贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4,5}[A-Z0-9挂学警港澳]{1,2}$/;
        var r = plate_number.match(reg);
        if(r==null){
            alert('请输入正确的车牌号');
            return false;
        }
    }
    openMask();

    $.get(urls+'/parkhero/v0.1/billing/onlinepay/',{'plate_number':plate_number,'paytype':'wechatpay','servicetype':'parkingpay','openid':openidNaw},function(response){
        if(response.status == '0'){
            sessionStorage.setItem("plate_number",plate_number);
            closeMask();
            $(".keyboard").hide();
            $('.query').hide();
            $('.confirm').show();
            var amount = (response.trade_no.menuinfo.amount/100).toFixed(2);
            var charged_duration = Math.floor(response.trade_no.menuinfo.charged_duration/60)+'小时'+(response.trade_no.menuinfo.charged_duration)%60+'分';
            $('.plate_number').html(response.trade_no.menuinfo.plate_number);
            $('#amount').html(amount);
            $('#charged_duration').html(charged_duration);
            $('#parking_time').html(response.trade_no.menuinfo.parking_time);
            $('#parking_lot').text(response.trade_no.menuinfo.parking_lot);
            $('#parking_card_number').html(response.trade_no.menuinfo.parking_card_number);
            if(response.trade_no.menuinfo.lot_type == "路边"){
                $("#leave_time").html("5分钟");
            }else{
                $("#leave_time").html("15分钟");
            }
            payError();
        }else if(response.status == '30009'){
            sessionStorage.setItem("plate_number",plate_number);
            closeMask();
            $(".keyboard").hide();
            $('.query').hide();
            $('.confirm').show();
            $('#amount').html('0');
            var charged_duration = Math.floor(response.trade_no.charged_duration/60)+'小时'+(response.trade_no.charged_duration)%60+'分';
            $('.plate_number').html(plate_number);
            $('#charged_duration').html(charged_duration);
            $('#parking_time').html(response.trade_no.parking_time);
            $('#parking_lot').text(response.trade_no.parking_lot);
            $('#parking_card_number').html(response.trade_no.parking_card_number);
            if(response.trade_no.lot_type == "路边"){
                $("#leave_time").html("5分钟");
            }else{
                $("#leave_time").html("15分钟");
            }
            $("#pay_btn").hide();
            payError();
        }else if(response.status == '30008'){
            closeMask();
            alert('订单已支付');
        }else if(response.status == '30011'){
            closeMask();
            alert('已经现金缴费');
        }else if(response.status == '30010'){
            closeMask();
            alert('不支持在线缴费');
        }else{
            alert('暂无未缴账单！');
            closeMask();
        }
    })
    var openid =  window.openid;
    console.log(openid);
    var url = urls+'/3rdpay/H5_pay/pay_detailtest.html?openid='+openidNaw+'&paytype=wechatpay&plate_number='+plate_number;
    window.open(url,'_self');
});
//微信支付
$('#pay_btn').on('click',function () {
    openMask();
    onBridgeReady();
});
//微信sdk权限配置和支付配置
function onBridgeReady(){
    var plate_number = sessionStorage.getItem("plate_number");
    //生产地址：dev.dadapark.com xxtx.cszhjt.com  测试地址：dev.dadapark.com
    $.get(urls+'/parkhero/v0.1/billing/onlinepay/',{'plate_number':plate_number,'paytype':'wechatpay','servicetype':'parkingpay','openid':openidNaw},function(response){
        if(response.status == '0'){
            wx.config({
                // debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: response.trade_no.orderinfo.appId, // 必填，公众号的唯一标识
                timestamp: response.trade_no.orderinfo.timeStamp, // 必填，生成签名的时间戳
                nonceStr: response.trade_no.orderinfo.nonceStr, // 必填，生成签名的随机串
                signature: response.trade_no.orderinfo.authSign,// 必填，签名，见附录1
                jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
            wx.ready(function () {
                // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
                wx.chooseWXPay({
                    appId:response.trade_no.orderinfo.appId,     //公众号名称，由商户传入
                    timestamp:response.trade_no.orderinfo.timeStamp,         //时间戳，自1970年以来的秒数
                    nonceStr:response.trade_no.orderinfo.nonceStr, //随机串
                    package:response.trade_no.orderinfo.package,
                    signType:response.trade_no.orderinfo.signType,         //微信签名方式：
                    paySign:response.trade_no.orderinfo.paySign, //微信签名
                    success: function (res) {
                        closeMask();
                        sessionStorage.setItem("lot_type", response.trade_no.menuinfo.lot_type);
                        window.open('pay_success.html','_self')
                    },
                    cancel: function (res) {
                        closeMask();
                        alert('你已取消付款');
                    },
                    error: function (res) {
                        closeMask();
                        alert('支付失败');
                    }
                })
            });
            wx.error(function(res){
                closeMask();
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                alert('身份验证失效，请重新扫码查询');
            });
        }else{
            closeMask();
            alert('请求失败！请重新扫码支付！');
        }
    })
}
//加载遮罩
function openMask(){
    var Mask=document.createElement("div");	//创建第一个div节点
    Mask.id="Mask";     					//赋予这个div一个id
    var height = $(window).height();
    var width = $(window).width();
    $("#Mask").css("height", height);
    var hei = height/2;
    var hei1 = width/2;
    Mask.innerHTML="<div id='' class='Mask'><img src='img/loading.gif' alt='二维码'>" + "</div></div>";   //在div中嵌套一些div
    document.body.appendChild(Mask);		//将节点导入到文档中
};

//关闭注册二维码遮罩
function closeMask(){
    var Mask = document.getElementById("Mask");
    document.body.removeChild(Mask);
}
//5分钟后直行
function payError(){
    window.setTimeout(function(){
        alert("本次账单查询失效，请重新查询！");
        sessionStorage.clear();
        $(".keyboard").hide();
        $('.query').show();
        $('.confirm').hide();
    },300000);
}