(function ($) {
   $('#queryPay').on('click',function(){
        var amount = $('#amount').val();
        if (amount =='' || amount == null) {
            alert('金额不能为空!');
            return false;
        }
        $.get('http://dev.dadapark.com/parkhero/v0.1/billing/onlinepay/',{'amount':amount,'paytype':'alipay','tradetype':'H5'},function(response){
            if(response.status == '0'){
                var url=response.trade_no;
                document.write(url);
            }else{
               alert('支付失败!'); 
            }
        })
   })
})(Zepto);