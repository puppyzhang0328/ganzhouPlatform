   // var _rootPath = 'http://dev.dadapark.com/parkhero/v0.1/';//测试地址
var _rootPath = 'http://xxtx.cszhjt.com/parkhero/v0.1/';//生产地址
var wait=60;
//获取验证码
function getVerification(e) {
   $.ajax({
       type : "GET",
       async: false,
       url: _rootPath+'account/verify/',
       dataType: 'json',
       data:{
           phone_number:e
       },
       success : function(data) {
           if(data.status==0){
               var verify = $('#verify')[0];
               time(verify)
           }
       },
       error : function(msg) {
           alert('请求失败');
       }
   });
}
function time(o) {
   if (wait == 0) {
       o.removeAttribute("disabled");
       o.value="获取验证码";
       wait = 60;
   } else {
       o.setAttribute("disabled", true);
       o.value="重新发送(" + wait + ")";
       wait--;
       setTimeout(function() {
               time(o)
           },
           1000)
   }
}
//查询链接后的字符串
function GetRequest() {
   var url = decodeURI(location.search); //获取url中"?"符后的字串
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
//获取用户信息
function queryUseDetailInfo(e){
   $.ajax({
       type : "GET",
       async: false,
       url: _rootPath+'user/',
       dataType: 'json',
       headers:{
           'Authorization': 'Basic ' + e
       },
       success : function(data) {
           if(data.status==0){
               localStorage.setItem('userInfo',JSON.stringify(data));
           }
       },
       error : function(msg) {
           alert('请求失败');
       }
   });
}

