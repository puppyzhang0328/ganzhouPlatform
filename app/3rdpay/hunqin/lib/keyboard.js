(function(e, d) {
    var f = e.documentElement,
        b = "orientationchange" in window ? "orientationchange": "resize",
        a = function() {
            var g = f.clientWidth;
            if (!g) {
                return
            }
            f.style.fontSize = 10 * (g / 320) + "px";
            $(".keyboard #dqxz .k").width((((g - 4) / 8) - 5) + "px");
            $(".keyboard #ywsz .k").width((((g - 4) /10) - 5) + "px");
        };
    if (!e.addEventListener) {
        return
    }
    d.addEventListener(b, a, false);
    e.addEventListener("DOMContentLoaded", a, false);
    if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
        c()
    } else {
        if (document.addEventListener) {
            document.addEventListener("WeixinJSBridgeReady", c, false)
        } else {
            if (document.attachEvent) {
                document.attachEvent("WeixinJSBridgeReady", c);
                document.attachEvent("onWeixinJSBridgeReady", c)
            }
        }
    }
    function c() {
        WeixinJSBridge.invoke("setFontSizeCallback", {
            fontSize: 0
        });
        WeixinJSBridge.on("menu:setfont",
            function() {
                WeixinJSBridge.invoke("setFontSizeCallback", {
                    fontSize: 0
                })
            })
    }
})(document, window); (function(a) {
    a.fn.lpnSelect = function(b) {
        b = a.extend({},
            {
                keyFouse: null
            },
            b);
        var d = function() {
            var i = a(".searchbar").attr("offsetTop");
            var h = a(".searchbar").height();
            var e = 0;
            a(".keyboard").each(function() {
                if (a(this).css("display") == "block") {
                    e = a(this).height()
                }
            });
            var f = document.body.clientHeight;
            var g = (i + h) - (f - e);
            if (g > 0 && a(".adjust_box").length > 0) {
                a(".adjust_box").css({
                    webkitTransform: "translateY(-" + (g + 10) + "px)",
                    transform: "translateY(-" + (g + 10) + "px)"
                })
            }
        };
        var c = function() {
            if (a(".adjust_box").length > 0) {
                a(".adjust_box").css({
                    webkitTransform: "translateY(0px)",
                    transform: "translateY(0px)"
                })
            }
        };
        return {
            initSelect: function(e) {
                a("#carplatnum").text(e);
                if (e != undefined && e.length > 0) {
                    a("#placeholder").hide();
                }
                if (e != undefined && e.length == 8) {
                    a("#icon_energy").show();
                }
            },
            getCarPlateNumberValue: function() {
                return a("#carplatnum").text();
            }
        }
    }
})(Zepto);

