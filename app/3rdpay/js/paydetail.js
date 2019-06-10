(function ($) {
    var req= new Object();
    req = GetRequest();
    addHistryCar(req);
    $('#pay_btn').on('click',function () {
        openMask();
        onBridgeReady(req);
    });
})(Zepto);
//查询链接后的字符串
function GetRequest() {
    var url = encodeURI(location.search); //获取url中"?"符后的字串
    var theRequest = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for(var i = 0; i < strs.length; i ++) {
            theRequest[strs[i].split("=")[0]]=encodeURI(strs[i].split("=")[1]);
        }
    }
    return theRequest;
}
function addHistryCar(req) {
    var base = new Base64();var plate_number;
    if(req.plate_number){
        plate_number = base.decode(req.plate_number);
    }
    openMask();
    $.get('http://xxtx.cszhjt.com/parkhero/v0.1/billing/onlinepay/',{'plate_number':plate_number,'paytype':'wechatpay','servicetype':'parkingpay','openid':req.openid,'identifier':req.parkingid,'location':req.location,toller_tel:req.phone_number},function(response){
        window.response = '';
        if(response.status == '0'){
            closeMask();
            window.response = '';
            window.response = response;
            var amount = (response.trade_no.menuinfo.amount/100).toFixed(2);
            var charged_duration = Math.floor(response.trade_no.menuinfo.charged_duration/60)+'小时'+(response.trade_no.menuinfo.charged_duration)%60+'分';
            $('#plate_number').html(response.trade_no.menuinfo.plate_number);
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
            closeMask();
            alert('尚未产生费用！');
        }else if(response.status == '30008'){
            closeMask();
            alert('订单已支付');
        }else if(response.status == '30011'){
            closeMask();
            alert('已经现金缴费');
        }else{
            closeMask();
            alert('暂无未缴账单！');
        }
    })
}
//微信sdk权限配置和支付配置
function onBridgeReady(req){
    //生产地址：xxtx.cszhjt.com  测试地址：dev.dadapark.com
        var response =  window.response;
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
    },300000);
}