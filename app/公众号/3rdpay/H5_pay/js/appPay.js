(function ($) {
   $('#queryPay').on('click',function(){
        var amount = $('#amount').val();
        var a = test.hello();
       // var a = '9u2aqvggtifij0de0o3j5u8hnwajv673';
        if (amount =='' || amount == null) {
            alert('金额不能为空!');
            return false;
        }
        else {
            $.get('http://xxtx.cszhjt.com/parkhero/v0.1/billing/onlinepay/',{'amount':amount,'paytype':'wechatpay','tradetype':'H5','sessionid':a},function(response){
                if(response.status == '0'){
                  var url=response.trade_no.menuinfo.code_url;
                    var c = document.getElementById("winxinName");
                    c.href = response.trade_no.menuinfo.code_url;
                    c.setAttribute("onclick",'');
                    c.click("return false");
                    // window.open(response.trade_no.menuinfo.code_url,'_self');
             }else{
                alert('支付失败!'); 
             }
            })
        }
   })
    $('#zhifubaoPay').on('click',function(){
        var amount = $('#amount').val();
        var a = test.hello();
        // var a = '9u2aqvggtifij0de0o3j5u8hnwajv673';
        if (amount =='' || amount == null) {
            alert('金额不能为空!');
            return false;
        }
        else {

            $.get('http://xxtx.cszhjt.com/parkhero/v0.1/billing/onlinepay/',{'amount':amount,'paytype':'alipay','tradetype':'H5','sessionid':a},function(response){
                if(response.status == '0'){
                    var url=response.trade_no;
                    document.write(url);
                }else{
                    alert('支付失败!');
                }
            })
        }
    })
})(Zepto);
