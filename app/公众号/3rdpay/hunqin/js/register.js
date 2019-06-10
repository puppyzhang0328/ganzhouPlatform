(function($) {
    $.init();
    var result = $('#birthday')[0];
    var btns = $('.btn');
    btns.each(function(i, btn) {
        btn.addEventListener('tap', function() {
            var optionsJson = this.getAttribute('data-options') || '{}';
            var options = JSON.parse(optionsJson);
            var id = this.getAttribute('id');
           
            var picker = new $.DtPicker(options);
            picker.show(function(rs) {
                result.value =  rs.text;
                picker.dispose();
            });
        }, false);
    });
})(mui);
document.getElementById('register').addEventListener('tap', function() {
    register();
});
document.getElementById('verify').addEventListener('tap', function() {
    var phoneNumber = $('#phoneNumber').val();
    getVerification(phoneNumber);
});
//注册
function register(e){
    var phoneNumber = $('#phoneNumber').val();
    var gender = $("input[name='radio']:checked").val();
    var birthday = $('#birthday').val();
    var real_name = $('#real_name').val();
    var yzm = $('#yzm').val();
    $.ajax({
        type : "POST",
        async: false,
        url: _rootPath+'account/register/',
        dataType: 'json',
        data:{
            phone_number:phoneNumber,
            verification_code:yzm,
            gender:gender,
            birthday:birthday,
            real_name:real_name,
            company:'浏阳婚庆'
        },
        success : function(data) {
            if(data.status == 0 || data.status == 20003){
                var url = 'http://lyh.chankor.cc/mobile_user/login/Register?account=' +phoneNumber+'&NickName='+real_name+'&Sex='+gender+'&Brithday='+birthday;
                loginpasswd();
                window.open(url,'_self');
            }else{
                alert('注册失败！');
            }
        },
        error : function(msg) {
            alert('请求失败');
        }
    });
}
//设置密码
function loginpasswd(){
    var phoneNumber = $('#phoneNumber').val();
    var password = $('#password').val();
    var yzm = $('#yzm').val();
    $.ajax({
        type : "POST",
        async: false,
        url: _rootPath+'account/loginpasswd/',
        dataType: 'json',
        data:{
            phone_number:phoneNumber,
            verification_code:yzm,
            password:password,
        },
        success : function(data) {
        },
        error : function(msg) {
        }
    });
}
