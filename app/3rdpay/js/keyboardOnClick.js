//输入框点击事件
$(".box .input").on("click",function () {
    $(".keyboard").hide();
    var _this = $(this);
    var b = _this.index();
    if(b==0){
        $("#dqxz").show();
    }else {
        $("#ywsz").show();
    }
    _this.addClass("input_on").siblings().removeClass("input_on");
})
//键盘普通按钮事件
$(".keyboard .k").on("click",
    function() {
        var e;
        $(".input").each(function () {
            if($(this).hasClass("input_on")){
                e = $(this).index();
            }
        })
        $("#"+e).html($(this).html()).removeClass("input_on").next().addClass("input_on");
        if (e < 1) {
            $("#dqxz").hide();
            $("#ywsz").show();
        } else {
            if (e < 7) {
                $("#dqxz").hide();
                $("#ywsz").show();
            }else {
                $("#7").addClass("input_on");
            }
        }
    });
//港澳学按钮事件
$(".iphone-keyboard #spec").click(function() {
    $(".blank_zhezhao").show();
    $(".float_kb").show();
});
//港澳学具体按钮事件
$("div.float_kb div").click(function() {
    var e;
    $(".input").each(function () {
        if($(this).hasClass("input_on")){
            e = $(this).index();
        }
    })
    $("#"+e).html($(this).html()).removeClass("input_on").next().addClass("input_on");
    if (e < 1) {
        $("#dqxz").hide();
        $("#ywsz").show();
    } else {
        if (e < 7) {
            $("#dqxz").hide();
            $("#ywsz").show();
        }else {
            $("#7").addClass("input_on");
        }
    }
    $("div.blank_zhezhao").hide();
    $("div.float_kb").hide();
    event.stopPropagation()
});
//删除按钮事件
$(".keyboard #backspace").click(function() {
    var e;
    $(".input").each(function () {
        if($(this).hasClass("input_on")){
            e = $(this).index();
        }
    })
    if (e == 0) {
        $("#"+e).html('');
        $("#dqxz").show();
        $("#ywsz").hide();
    }else if(e>1){
        var b = e-1;
        if($("#"+e).html()){
            $("#"+e).html('');
        }else {
            $("#"+b).html('');
            $("#"+e).removeClass("input_on");
            $("#"+b).addClass("input_on");
        }
    }else if(e==1){
        var b = e-1;
        if($("#"+e).html()){
            $("#"+e).html('');
        }else {
            $("#"+b).html('');
            $("#"+e).removeClass("input_on");
            $("#"+b).addClass("input_on");
            $("#dqxz").show();
            $("#ywsz").hide();
        }
    }
});
//复选框改变事件
$("#checkbox").change(function() {
    if($("input[type='checkbox']").is(':checked')){
        $(".input").addClass("input_change");
        $("#7").show();
    }else {
        $("#7").hide();
        $(".input").removeClass("input_change");
    }
});
//完成按钮
$(".keyboard #search").click(function() {
    $(".keyboard").hide();
});
