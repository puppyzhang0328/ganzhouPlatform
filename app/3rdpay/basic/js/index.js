$(function() {
    //添加新的Tab页
    var url = 'http://120.25.76.96:9088/';
    $("#navmenu").on("click", "a[data-url]", function(e) {
        console.log(12);
        e.preventDefault();
        var tabTitle = $(this).text();
        var tabUrl = $(this).data("url");
        if($("#tt").tabs("exists", tabTitle)) { //判断该Tab页是否已经存在
            $("#tt").tabs("select", tabTitle);
        }else {
            $("#tt").tabs("add", {
                title: tabTitle,
                href: tabUrl,
                closable: true
            });
        }
        $("#navmenu .active").removeClass("active");
        $(this).parent().addClass("active");
    });
    //解决闪屏的问题
    window.setTimeout(function() {
        $("#layout").css("visibility", "visible");
    }, 800);
});
function deleteFun() {
    var url = 'http://120.25.76.96:9088/';
    var data = {
        "token": 1435434
    };
    $.ajax({
        type:"POST",
        url:url+'tickets/getOrderNo',
        async:true,
        data:JSON.stringify(data),
        success:function(res){
            if(res.status == 0){
                sessionStorage.setItem("orderNo",res.orderNo)
                luckOrder(res.orderNo);
            }else{
                alert(res.detail);
            }
        },
        error:function(res){
            alert('服务器错误！');
        }
    });
}
function luckOrder(a) {
    var car_no = $('#car_no').val();
    var url = 'http://120.25.76.96:9088/';
    var data = {
        "orderMobile":"13900000011",
        "requestType":"1",
        "scheduleId":74,
        "scheduleCode":"001",
        "orderNo":a,
        "scope":"1",
        "vehicleCount":1,
        "passengerCount":2,
        "operCode":"10001",
        "operId":1,
        "operator_shift":1,
        "operName":"小明",
        "computerMac": "",
        "vehicles":[{
            "car_no":"粤"+car_no,
            "vehiclePassengers":2,
            "plateColor":"1",
            "passengers":[
                {
                    "passengerAttribute": "1",
                    "ticketType":"1"
                },
                {
                    "passengerAttribute": "1",
                    "ticketType":"1"
                }
            ]
        }],
        "token":1435434
    };
    $.ajax({
        type:"POST",
        url:url+'tickets_sell_ticket/luck',
        async:true,
        data:JSON.stringify(data),
        success:function(res){
            if(res.status==0){
//                            sessionStorage.setItem("totalMoney",res.data[0].totalMoney);
                $("#dlg-test").dialog("open");
                $("#totalMoney").val(res.data[0].totalMoney);
            }else {
//                            $("#dlg-test").dialog("open");
                alert(res.detail);
            }
        },
        error:function(res){
            alert('服务器错误！');
        }
    });
}