$('#close_img').on('click',function() {
   $('#mask').hide();
});
$('#con_map').on('click',function() {
   $('#mask').show();
});
$('#phone_number').focus();
$(".container input[type='button']").on('click',function(){
    localStorage.phone ='';
    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(17[0-9]{1})|(15[0-3]{1})|(15[5-9]{1})|(18[0-9]{1}))+\d{8})$/;
    var phone = $("#phone_number").val();
    localStorage.phone =phone;
    if(phone == ''){
       alert("手机号码不能为空！");
        return false;
    }else if(phone.length !=11){
       alert("请输入有效的手机号码!");
        return false;
    }else if(!myreg.test(phone)){
         alert("请输入有效的手机号码!");
        return false;
    }
   if($("#myCheck").prop("checked")==true){
      insetPhone(phone);
   }else{
      alert('请勾选同意');
   }
})


//请求
function insetPhone (phone_number){
    $.ajax({
        type : "POST",
        url: 'http://120.24.249.69/parkhero/v0.1/account/paregister/',
        data : {
            phone_number:phone_number
        },
        dataType: 'json',
        success : function(data) {
            if(data.status=='0'){
                window.open("http://120.24.249.69/3rdpay/envelope_next.html","_self");
            }else if (data.status=='20003'){
                window.open("http://120.24.249.69/3rdpay/envelope_two.html","_self");
            }
        },
        error : function(msg) {
            alert('请求失败');
        }
    });
}