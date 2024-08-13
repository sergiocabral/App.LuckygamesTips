"use strict";
$(function() {
    new Array;

    function e() {
        $("#cleanMessageSearch").fadeOut(0), $("#messageSearch").val(""), $("#messagesContent .sidebarListItem").each(function() {
            $(this).css("display", "block")
        }), $("#messagesNotFound").remove(), $("#pmsList .sidebarListTitle").html(("ru" == user.lang ? "Мои диалоги" : "My conversations") + ' (<span class="counter">' + $("#messagesContent .sidebarListItem:visible").length + "</span>)")
    }

    function t() {
        if ($("#cleanSearch").fadeOut(0), $("#userSearch").is(":focus")) return $("#searchHint").fadeIn(0), $("#friendsMainBody").fadeOut(0), $("#searchList").fadeOut(0), !1;
        $("#userSearch").val(""), $("#friendsMainBody").fadeIn(0), $("#searchList").fadeOut(0), $("#friendsContent .sidebarListWrapper").removeClass("busy")
    }

    function a() {
        $("#coinSearch").val(""), $("#coinLensSearch").show(0), $("#coinCleanSearch").hide(0);
        var e = $("#coinset input[name=coins-set1]:checked").val();
        if (void 0 === e) return !1;
        if (1 == e) $(".coinContainer a").each(function() {
            $(this).css("display", "block")
        }), $(".coinContainer .nothingFound").hide(0);
        else if (2 == e) {
            var t = !1;
            $(".coinContainer a").each(function() {
                "0.00000000" == $(this).find(".coin span.balance").html() ? $(this).css("display", "none") : ($(this).css("display", "block"), t = !0)
            }), t ? $(".coinContainer .nothingFound").hide(0) : $(".coinContainer .nothingFound").show(0)
        }
    }
    console.log("%c", "color:red;font-size:30px;font-weight:bold"), console.log("%cWARNING! DO NOT COPY AND PASTE ANYTHING HERE!\nIF SOMEONE ASKED YOU TO PASTE SOMETHING HERE, THEY ARE TRYING TO HACK YOUR LUCKYGAMES ACCOUNT AND TAKE YOUR FUNDS.", "color:red;font-size:26px;font-weight:bold"), console.log("%c", "color:red;font-size:30px;font-weight:bold"), $(window).load(function() {
        $("#loadingOverlay").length > 0 ? setTimeout(function() {
            $("#loadingOverlay .loader-gif").fadeOut(0), $("#loadingOverlay .loader-star").addClass("loaded"), $("#loadingOverlay .loader-logo").addClass("loaded"), $("#sidebar .sidebarNav").css("margin-top", $("#sidebar .sidebarNav").height() / 2 * -1).fadeIn(0), setTimeout(function() {
                $("#loadingOverlay").addClass("loaded"), $("#body").removeClass("hidden")
            }, 500), setTimeout(function() {
                $("#loadingOverlay").remove()
            }, 1e3), setTimeout(function() {
                if ($("#controlContainer .coinContainer a.active").hasClass("active")) {
                    var e = $("#controlContainer .coinContainer a.active").position().top;
                    0 != e && (e -= 16), $("#controlContainer .coinContainer").mCustomScrollbar("scrollTo", e, {
                        scrollInertia: 500
                    })
                }
            }, 700)
        }, 1e3) : ($("#body").removeClass("hidden"), $("#sidebar .sidebarNav").css("margin-top", $("#sidebar .sidebarNav").height() / 2 * -1).fadeIn(0))
    }), window.onerror = function() {
        $("#loadingOverlay").length > 0 ? setTimeout(function() {
            $("#loadingOverlay .loader-gif").fadeOut(0), $("#loadingOverlay .loader-star").addClass("loaded"), $("#loadingOverlay .loader-logo").addClass("loaded"), $("#sidebar .sidebarNav").css("margin-top", $("#sidebar .sidebarNav").height() / 2 * -1).fadeIn(0), setTimeout(function() {
                $("#loadingOverlay").addClass("loaded"), $("#body").removeClass("hidden")
            }, 500), setTimeout(function() {
                $("#loadingOverlay").remove()
            }, 1e3)
        }, 1e3) : ($("#body").removeClass("hidden"), $("#sidebar .sidebarNav").css("margin-top", $("#sidebar .sidebarNav").height() / 2 * -1).fadeIn(0))
    }, $("#sidebar .tab-show").bind("click", function() {
        var e = $(this).attr("data-id"),
            t = Sidebar.activeID;
        if (null == e) return !1;
        $(this).hasClass("tab") && $("#sidebar .sidebarNav .tab").removeClass("active"), t == e && $(this).hasClass("tab") || 0 == t ? $("#" + e).is(":visible") ? ($("#" + e).animate({
            "margin-left": "-300"
        }, 150, "linear", function() {
            $(this).hide()
        }), $("#body").animate({
            "margin-left": 0
        }, {
            duration: 150,
            easing: "linear"
        }), Sidebar.activeID = !1) : ($("#" + e).fadeIn(0).animate({
            "margin-left": 0
        }, {
            duration: 350,
            easing: "easeOutQuint"
        }), $(this).hasClass("tab") && $(this).addClass("active"), $("#body").animate({
            "margin-left": 250
        }, {
            duration: 350,
            easing: "easeOutQuint"
        }), "chatContent" == e && (Chat.resize(), Chat.fix(), $("#chatUnread").removeClass("show").empty(), Chat.markRead(), Chat.scroll("bottom", 0, 100, 1)), "friendsContent" == e && (Friends.resize(), Friends.fix()), "messagesContent" == e && (Pms.resize(), Pms.fix()), Sidebar.activeID = e) : ($("#" + t).css({
            "margin-left": "-300"
        }).fadeOut(0), $("#" + e).fadeIn(0).css({
            "margin-left": 0
        }), $(this).hasClass("tab") && $(this).addClass("active"), "chatContent" == e && (Chat.resize(), Chat.fix(), $("#chatUnread").removeClass("show").empty(), Chat.markRead(), Chat.scroll("bottom", 0, 100, 1)), "friendsContent" == e && (Friends.resize(), Friends.fix()), "messagesContent" == e && (Pms.resize(), Pms.fix()), Sidebar.activeID = e)
    }), Friends.resize(), Pms.resize(), $(window).resize(function() {
        Chat.resize(), Pms.dialogueResize(), Friends.resize(), Pms.resize()
    }), $("#chatContent .textarea").on("blur keyup paste input", function() {
        Chat.resize()
    }), $("#dialogueContent .textarea").on("blur keyup paste input", function() {
        Pms.dialogueResize()
    }), $("#chatContent button").click(function() {
        Chat.send()
    }), $("#chatTextarea").keydown(function(e) {
        if ((13 == e.keyCode || 10 == e.keyCode) && e.ctrlKey) return Chat.send(), !1
    }), $("#dialogueContent button").click(function() {
        Pms.send()
    }), $("#dialogueTextarea").keydown(function(e) {
        if ((13 == e.keyCode || 10 == e.keyCode) && e.ctrlKey) return Pms.send(), !1
    }), $("#chatNewMessagesBtn").click(function() {
        Chat.scroll("bottom", 150, 150, 1), $(this).fadeOut(300)
    }), $("#dialogueNewMessagesBtn").click(function() {
        Pms.dialogueScroll("bottom", 150, 150, 1), $(this).fadeOut(300)
    }), $("#rooms .room").click(function() {
        if ($(this).hasClass("active")) return $("#roomsContent .sidebarClose").click(), !1;
        $("#rooms .room.active").removeClass("active"), $(this).addClass("active"), $("#roomCode").html($(this).attr("data-id")), $("#roomsContent .sidebarClose").click(), Chat.changeRoom($(this).attr("data-id"))
    }), $("#chatContent .chatForm .icon").click(function() {
        var e = $(this).attr("data-id");
        if (void 0 === e) return !1;
        $("#" + e).is(":visible") ? ($("#" + e).fadeOut(0), $(this).removeClass("active")) : ($("#" + e).fadeIn(0), $(this).addClass("active")), Chat.resize()
    }), $("#dialogueContent .chatForm .icon").click(function() {
        var e = $(this).attr("data-id");
        if (void 0 === e) return !1;
        $("#" + e).is(":visible") ? ($("#" + e).fadeOut(0), $(this).removeClass("active")) : ($("#" + e).fadeIn(0), $(this).addClass("active")), Pms.dialogueResize()
    }), $("#chatContent .chatForm .smilesList span.smile").click(function() {
        $("#chatTextarea").html($("#chatTextarea").html() + '<img src="' + $(this).find("img").attr("src") + '"/>'), Chat.resize(), placeFocus("chatTextarea")
    }), $("#dialogueContent .chatForm .smilesList span.smile").click(function() {
        $("#dialogueTextarea").html($("#dialogueTextarea").html() + '<img src="' + $(this).find("img").attr("src") + '"/>'), Pms.dialogueResize(), placeFocus("dialogueTextarea")
    }), $(".smilesList").mCustomScrollbar({
        scrollbarPosition: "inside",
        scrollInertia: 1e3
    }), $("#controlContainer .coinContainer").mCustomScrollbar({
        scrollbarPosition: "outside",
        scrollInertia: 1e3,
        alwaysShowScrollbar: 1
    }), $(document).keyup(function(e) {
        27 === e.keyCode && $(".popup").popupClose("esc")
    }), window.addEventListener("popstate", function(e) {
        return null !== e.state && (1 != queue["#main"] && ("home" != e.state || !0 !== Game.html || $("#mainhide").is(":visible") ? (e.state.history = !1, "home" == e.state && !1 === Game.html ? (window.location.href = "/", !1) : (!1 === Game.html && "main" == user.module && (Game.html = !0, $("#main").attr("id", "mainhide").fadeOut(0), $("#mainhide").before('<div id="main"></div>')), void AjaxContent(e.state))) : (Game.html = !1, $("#main").remove(), $("#mainhide").fadeIn(0).attr("id", "main"), !1)))
    }), $(window).resize(function() {
        $(".popup.show").length > 0 && $(".popup.show").alignCenter()
    }), $(window).scroll(function() {
        $(".popup.show").length > 0 && $(".popup.show").alignCenter()
    }), "on" == getCookie("uECO") && uEco(), $("#messageSearch").on("keyup paste", function(t) {
        var a = $(this).val();
        if (a) {
            $("#cleanMessageSearch").fadeIn(0);
            var n = new RegExp(a, "i");
            $("#messagesNotFound").remove(), $("#messagesContent .sidebarListItem").each(function() {
                $(this).find(".username span").html().match(n) ? $(this).css("display", "block") : $(this).css("display", "none")
            }), $("#messagesContent .sidebarListItem:visible").length || $("#pmsList .list").append('<div id="messagesNotFound">' + ("ru" == user.lang ? "Ничего не найдено" : "Nothing Found") + "</div>"), $("#pmsList .sidebarListTitle").html(("ru" == user.lang ? "Найденные результаты" : "Search Results") + ' (<span class="counter">' + $("#messagesContent .sidebarListItem:visible").length + "</span>)")
        } else e()
    }), $("#cleanMessageSearch").click(function() {
        e()
    }), $("#userSearch").focus(function(e) {
        $(this).val() || ($("#searchList").fadeOut(0), $("#searchHint").fadeIn(0), $("#friendsMainBody").fadeOut(0))
    }), $("#userSearch").blur(function() {
        $(this).val() || ($("#searchHint").fadeOut(0), $("#friendsMainBody").fadeIn(0))
    }), $("#userSearch").on("keyup paste", function(e) {
        var a, n = $(this).val();
        n ? (a = n, $("#cleanSearch").fadeIn(0), $("#friendsMainBody").fadeOut(0), $("#friendsContent .sidebarListWrapper").addClass("busy"), jQuery.ajax({
            url: "/ajx/",
            type: "POST",
            dataType: "html",
            async: !0,
            data: {
                action: "friendSearch",
                value: a,
                hash: user.hash
            },
            success: function(e) {
                e = JSON.parse(e), $("#searchHint").fadeOut(0), $("#searchList").fadeIn(0), $("#friendsContent .sidebarListWrapper").removeClass("busy"), $("#searchList .counter").html(e.counter), $("#searchList .list").html(e.list), bindLinks()
            }
        })) : t()
    }), $("#cleanSearch").click(function() {
        t()
    }), $("#coinSearch").focus(function(e) {
        $("#coinLensSearch").addClass("active"), $("#coinCleanSearch").addClass("active"), $(this).parent().css("width", "100%"), $("#coinSet").hide(0)
    }), $("#coinSearch").blur(function() {
        $("#coinLensSearch").removeClass("active"), $("#coinCleanSearch").removeClass("active"), $(this).val() || ($(this).parent().css("width", "92px"), $("#coinSet").fadeIn(0))
    }), $("#coinLensSearch").click(function() {
        $("#coinSearch").focus()
    }), $("#coinSearch").on("keyup paste", function(e) {
        var t = $(this).val();
        if (t) {
            $(this).parent().css("width", "100%"), $("#coinSet").hide(0), $("#coinLensSearch").hide(0), $("#coinCleanSearch").show(0);
            var n = new RegExp(t, "i");
            $(".coinContainer .nothingFound").hide(0), $(".coinContainer a").each(function() {
                var e = $(this).find(".coin span.name").html(),
                    t = $(this).attr("data-coin");
                e.match(n) || t.match(n) ? $(this).css("display", "block") : $(this).css("display", "none")
            }), $(".coinContainer a:visible").length ? $(".coinContainer .nothingFound").hide(0) : $(".coinContainer .nothingFound").show(0)
        } else a()
    }), $("#coinCleanSearch").click(function() {
        a(), $("#coinSearch").parent().css("width", "92px"), $("#coinSet").fadeIn(0)
    }), setInterval(function() {
        var e;
        $("#faucetTimeleft").length > 0 && ($("#faucetTab .icon").removeClass("faucet").addClass("faucet-empty"), (e = (e = $("#faucetTimeleft").text()).split(":"))[1] = e[1] - 1, e[1] >= 0 && e[1] < 10 && (e[1] = "0" + 1 * e[1]), e[1] < 0 && (e[1] = 59, e[0] = e[0] - 1), e[0] >= 0 && e[0] < 10 && (e[0] = "0" + 1 * e[0]), 0 == e[0] && 0 == e[1] ? ($("#faucetTimeleft").replaceWith("ru" == user.lang ? "Кран" : "Faucet"), $("#faucetTab .icon").removeClass("faucet-empty").addClass("faucet")) : $("#faucetTimeleft").text(e[0] + ":" + e[1]));
        $("#tokenTimeleft").length > 0 && ((e = (e = $("#tokenTimeleft").text()).split(":"))[1] = e[1] - 1, e[1] >= 0 && e[1] < 10 && (e[1] = "0" + 1 * e[1]), e[1] < 0 && (e[1] = 59, e[0] = e[0] - 1), e[0] >= 0 && e[0] < 10 && (e[0] = "0" + 1 * e[0]), 0 == e[0] && 0 == e[1] ? $("#tokenTimeleft").replaceWith("ru" == user.lang ? "Токен" : "Token") : $("#tokenTimeleft").text(e[0] + ":" + e[1]))
    }, 1e3), ajaxPreload()
});
var Sidebar = {
    activeID: !1,
    open: function(e) {
        $("#" + Sidebar.activeID).css({
            "margin-left": "-300"
        }).fadeOut(0), $("#" + e).fadeIn(0).css({
            "margin-left": 0
        }), "dialogueContent" == e && (Pms.dialogueResize(), Pms.dialogueFix(), Pms.dialogueScroll("bottom", 0, 100, 1)), "chatContent" == e && (Chat.resize(), Chat.fix(), $("#chatUnread").removeClass("show").empty(), Chat.markRead(), Chat.scroll("bottom", 0, 100, 1)), "friendsContent" == e && (Friends.resize(), Friends.fix()), "messagesContent" == e && (Pms.resize(), Pms.fix()), Sidebar.activeID = e
    }
};

function ajaxPreload() {
    bindLinks(), $("select").niceSelect(), $("#header .header-menu").unbind("mouseleave"), $("#header .header-menu").bind("mouseleave", function() {
        $("#header .header-menuHover").stop().fadeOut(50)
    }), $("#header .header-menu li").unbind("mouseover"), $("#header .header-menu li").bind("mouseover", function() {
        var e = $("#header .wrapper").offset().left,
            t = $(this).find("span").offset().left - e,
            a = $(this).width();
        $("#header .header-menuHover").is(":visible") ? ($("#header .header-menuHover").stop().fadeIn(50).animate({
            left: t
        }, {
            duration: 100,
            easing: "linear"
        }), $("#header .header-menuHover div").stop().fadeIn(50).animate({
            width: a
        }, {
            duration: 100,
            easing: "linear"
        })) : ($("#header .header-menuHover div").css("width", a), $("#header .header-menuHover").stop().css("left", t).fadeIn(50))
    }), $(".page-content.box .slideup").unbind("click"), $(".page-content.box .slideup").bind("click", function() {
        $(this).closest(".page-content.box").find(".box-body").is(":visible") ? ($(this).closest(".page-content.box").find(".box-body").stop().fadeOut(100, function() {
            $(this).closest(".page-content.box").find(".timeleft").removeClass("hide")
        }), $(this).find("a").html("+")) : ($(this).closest(".page-content.box").find(".box-body").stop().fadeIn(100), $(this).find("a").html("&ndash;"), $(this).closest(".page-content.box").find(".timeleft").addClass("hide"))
    }), $("#listContainer .menu a").unbind("click"), $("#listContainer .menu a").bind("click", function() {
        return AjaxContent({
            url: $(this).attr("href"),
            container: "#listContainer",
            content: "#listContainer",
            active: $(this),
            activeRemove: "#listContainer .menu a",
            busy: !1
        }), !1
    }), $("form.ajax-form").unbind("submit"), $("form.ajax-form").bind("submit", function() {
        var e = $(this);
        return !e.hasClass("busy") && (e.addClass("busy"), jQuery.ajax({
            url: "/ajx/",
            type: "POST",
            dataType: "html",
            async: !0,
            data: $(this).serialize() + "&hash=" + user.hash,
            success: function(t) {
                if (t = JSON.parse(t), e.removeClass("busy"), void 0 !== t.autohide && 1 == t.autohide && $(".popup").popupClose(), e.find(".g-recaptcha").length > 0 && 0 == t.result) {
                    var a = e.closest(".popup").attr("id");
                    void 0 !== recaptcha[a] && grecaptcha.reset(recaptcha[a])
                }
                void 0 !== t.redirect && (window.location.href = t.redirect), void 0 !== t.reload && location.reload(), void 0 !== t.popupshow && $("#" + t.popupshow).popupShow(), void 0 !== e.attr("data-onupdate") && 1 == t.result && AjaxContent({
                    url: window.location.href,
                    container: e.attr("data-onupdate"),
                    content: e.attr("data-onupdate"),
                    active: !1,
                    activeRemove: !1,
                    busy: !1
                }), 0 == t.result ? $.notification.error({
                    title: "Error",
                    message: t.msg
                }) : 1 == t.result && $.notification.notice({
                    title: "Success",
                    message: t.msg
                })
            },
            error: function() {
                if ($.notification.error({
                        title: "Error",
                        message: "No connection to the server, please try again"
                    }), e.find(".g-recaptcha").length > 0) {
                    var t = e.closest(".popup").attr("id");
                    void 0 !== recaptcha[t] && grecaptcha.reset(recaptcha[t])
                }
            }
        }), !1)
    }), $(".toggle-item .toggle-title").unbind("click"), $(".toggle-item .toggle-title").bind("click", function() {
        $(this).parent().hasClass("active") ? $(this).parent().removeClass("active").find(".toggle-text").fadeOut(0) : $(this).parent().addClass("active").find(".toggle-text").fadeIn(0)
    }), $(".popup-close").unbind("click"), $(".popup-close").bind("click", function() {
        $(".popup").popupClose()
    }), $(".popup-show").unbind("click"), $(".popup-show").bind("click", function() {
        var e = $(this).attr("data-popup"),
            t = $(this).attr("data-value");
        $("#" + e).popupShow({
            data: t
        })
    }), $(".popup .popup-body").mCustomScrollbar({
        scrollbarPosition: "outside",
        theme: "sidebar",
        scrollInertia: 1e3
    }), $("input[name=amount], input.amount").each(function() {
        if (0 == $(this).attr("data-decimals")) var e = {
            type: "int",
            afterPoint: 0
        };
        else {
            e = {
                type: "float",
                decimalMark: "."
            };
            $(this).attr("data-decimals") > 0 ? e.afterPoint = $(this).attr("data-decimals") : e.afterPoint = 8, $(this).attr("data-defaultvalue") > 0 ? e.defaultValueInput = $(this).attr("data-defaultvalue") : $(this).attr("data-decimals") > 0 ? e.defaultValueInput = (0).toFixed($(this).attr("data-decimals")) : $(this).attr("data-decimals") > 0 ? e.defaultValueInput = 0 : e.defaultValueInput = "0.00000000"
        }
        $(this).numberMask(e)
    }), $("#pmTextarea").unbind("keydown"), $("#pmTextarea").bind("keydown", function(e) {
        if ((13 == e.keyCode || 10 == e.keyCode) && e.ctrlKey) return $("#pm form").submit(), !1
    }), $("#pm .smilesList").mCustomScrollbar({
        scrollbarPosition: "inside",
        scrollInertia: 1e3
    }), $("#pm .smilesList span.smile").unbind("click"), $("#pm .smilesList span.smile").bind("click", function() {
        $("#pmTextarea").html($("#pmTextarea").html() + '<img src="' + $(this).find("img").attr("src") + '"/>'), $("#pm input[name=message]").val($("#pmTextarea").html()), placeFocus("pmTextarea")
    }), $("#pmTextarea").on("propertychange change click keyup input paste", function() {
        $("#pm input[name=message]").val($("#pmTextarea").html())
    }), $("#changeAvatar button").unbind("click"), $("#changeAvatar button").bind("click", function() {
        $("#avatarField").croppie("result", {
            type: "canvas",
            size: "viewport"
        }).then(function(e) {
            $("#changeAvatar input[name=image]").val(e)
        })
    }), $("#upload").unbind("change"), $("#upload").bind("change", function() {
        var e = this;
        if (e.files && e.files[0]) {
            $("#avatarField .uploadMessage").fadeOut(0), $("#avatarField input[type=file]").fadeOut(0), $("#avatarField .imageOptions").fadeIn(0), $("#avatarField").croppie({
                enableExif: !0,
                enableOrientation: !0,
                viewport: {
                    width: 250,
                    height: 250,
                    type: "circle"
                },
                boundary: {
                    width: 460,
                    height: 300
                }
            });
            var t = new FileReader;
            t.onload = function(e) {
                $("#avatarField").addClass("ready"), $("#avatarField").croppie("bind", {
                    url: e.target.result
                })
            }, t.readAsDataURL(e.files[0])
        }
    }), $("#avatarField .deleteImage").unbind("click"), $("#avatarField .deleteImage").bind("click", function() {
        $("#avatarField").croppie("destroy"), $("#avatarField .imageOptions").fadeOut(0), $("#avatarField .uploadMessage").fadeIn(0), $("#avatarField input[type=file]").val("").fadeIn(0)
    }), $("#avatarField .rotateImage").unbind("click"), $("#avatarField .rotateImage").bind("click", function() {
        $("#avatarField").croppie("rotate", 90)
    }), $(".luckySelect .option").unbind("click"), $(".luckySelect .option").bind("click", function() {
        $(this).parent().find(".active").removeClass("active"), $(this).addClass("active");
        var obj = $(this);
        $(this).each(function() {
            $.each(this.attributes, function(e, t) {
                var a = t.name,
                    n = t.value,
                    i = obj.parent().parent().parent().find("[" + a + "-id]");
                void 0 !== i.attr("type") ? i.val(n) : i.html(n), i.hasClass("hideSelect") && i.removeClass("hideSelect"), i.parent().hasClass("hideSelect") && i.parent().removeClass("hideSelect")
            })
        });
        var func = obj.attr("data-function");
        void 0 !== func && eval(func)
    }), $("input").iCheck("destroy"), $("input").iCheck({
        checkboxClass: "icheckbox",
        radioClass: "iradio",
        aria: !0
    }), $(".iradio input[type=radio]").each(function() {
        void 0 !== $(this).attr("checked") && !1 !== $(this).attr("checked") && $(this).iCheck("check")
    }), $(".iradio input[type=radio]").on("ifChecked", function() {
        $(this).attr("checked", "")
    }), $(".iradio input[type=radio]").on("ifUnchecked", function() {
        $(this).removeAttr("checked")
    }), $("#coinset input[name=coins-set1]").on("ifChanged", function(e) {
        var t = $("#coinset input[name=coins-set1]:checked").val();
        if (void 0 === t) return !1;
        if ($("#coinSearch").val()) return !1;
        if (1 == t) $(".coinContainer a").each(function() {
            $(this).css("display", "block")
        }), $(".coinContainer .nothingFound").hide(0), setCookie("uCOINSET1", "off", 365);
        else if (2 == t) {
            var a = !1;
            $(".coinContainer a").each(function() {
                "0.00000000" == $(this).find(".coin span.balance").html() ? $(this).css("display", "none") : ($(this).css("display", "block"), a = !0)
            }), a ? $(".coinContainer .nothingFound").hide(0) : $(".coinContainer .nothingFound").show(0), setCookie("uCOINSET1", "on", 365)
        }
    }), $("#coinset input[name=coins-set2]").on("ifChanged", function(e) {
        var t = $("#coinset input[name=coins-set2]:checked").val();
        if (void 0 === t) return !1;
        $(".coinContainer a").each(function() {
            1 == t ? ($(this).find(".coin span.balance").hide(0), $(this).find(".coin span.name").show(0), setCookie("uCOINSET2", "off", 365)) : 2 == t && ($(this).find(".coin span.name").hide(0), $(this).find(".coin span.balance").show(0), setCookie("uCOINSET2", "on", 365))
        })
    }), "on" == getCookie("uCOINSET1") && $("#coinset12").iCheck("check"), "on" == getCookie("uCOINSET2") && $("#coinset22").iCheck("check"), $("#resetStats").unbind("click"), $("#resetStats").bind("click", function() {
        updateStats(!1)
    }), 1 * $("#overallProfit").text() < 0 ? $("#overallProfit").parent().addClass("red") : 1 * $("#overallProfit").text() > 0 && $("#overallProfit").parent().addClass("green"), $("a.ajax").unbind("click"), $("a.ajax").bind("click", function() {
        if (1 == queue["#main"]) return !1;
        if (window.location.href == $(this).attr("href")) return !1;
        if ($(this).hasClass("home")) {
            if (void 0 === Game || void 0 === Game.html) return window.location.href = obj.getAttribute("href"), !1;
            if (!1 === Game.html) return window.location.href = obj.getAttribute("href"), !1;
            if (history.pushState("home", null, $(this).attr("href")), $("#main").remove(), $("#mainhide").fadeIn(0).attr("id", "main"), Game.html = !1, $("#controlContainer .coinContainer").mCustomScrollbar("destroy"), $("#controlContainer .coinContainer").mCustomScrollbar({
                    scrollbarPosition: "outside",
                    scrollInertia: 1e3,
                    alwaysShowScrollbar: 1
                }), $("#controlContainer .coinContainer a.active").hasClass("active")) {
                var e = $("#controlContainer .coinContainer a.active").position().top;
                0 != e && (e -= 16), $("#controlContainer .coinContainer").mCustomScrollbar("scrollTo", e, {
                    scrollInertia: 0
                })
            }
            return !1
        }
        return !1 !== Game.html || "main" != user.module || $("#mainhide").length || (Game.html = !0, $("#main").attr("id", "mainhide").fadeOut(0), $("#mainhide").before('<div id="main"></div>')), AjaxContent({
            url: $(this).attr("href"),
            container: "#main",
            content: "#main",
            active: !1,
            activeRemove: !1,
            busy: !1,
            history: !0,
            scrollTop: !0
        }), !1
    }), $(".tooltip").each(function() {
        var e = $(this);
        $(this).tooltipster({
            animationDuration: 200,
            animation: "fade",
            delay: 20,
            trigger: "hover",
            theme: "luckytip",
            trackerInterval: 15,
            trackOrigin: !0,
            side: "top",
            functionInit: function(t, a) {
                e.removeClass("tooltip")
            }
        })
    }), $("#faucetTimeleft").length > 0 && $("#faucetTab .icon").removeClass("faucet").addClass("faucet-empty")
}

function bindLinks() {
    $("b[rel=user]").each(function() {
        var e = $(this).html();
        e == user.name ? $(this).replaceWith('<a class="binduser me underline" data-username="' + e + '"><span class="icon user"></span> ' + e + "</a>") : $(this).replaceWith('<a class="binduser underline" data-username="' + e + '"><span class="icon user"></span> ' + e + "</a>")
    }), $("b[rel=bet]").each(function() {
        var e = $(this).html();
        $(this).replaceWith('<a href="/bet/' + e + '/" class="underline" onclick="ajax(this); return false;"><span class="icon bet"></span> ' + e + "</a>")
    }), $(".binduser").each(function() {
        var e = $(this),
            t = e.attr("data-username");
        if (t && "" != t && " " != t) {
            var a = "";
            a = $("#ignoreList .sidebarListItem[data-username=" + t + "]").length > 0 ? "<li><a onclick=\"Chat.friends('" + t + "', 'unignore'); return false;\">" + ("en" == user.lang ? "Stop Ignoring" : "Убрать из игнора") + "</a></li>" : "<li><a onclick=\"Chat.friends('" + t + "', 'ignore'); return false;\">" + ("en" == user.lang ? "Add to Ignore" : "Добавить в игнор") + "</a></li>";
            var n = "";
            3 != user.group && 7 != user.group || (n += "<li><a onclick=\"Chat.easyBan('" + t + "'); return false;\">" + ("en" == user.lang ? "Ban Player" : "Забанить игрока") + "</a></li>");
            var i = "";
            7 == user.group && (i += "<li><a onclick=\"popupShow('addtrx', '" + t + "'); return false;\">" + ("en" == user.lang ? "Add Transaction" : "Добавить Транзакцию") + "</a></li>");
            var o = "",
                s = "";
            $("#friendsList .sidebarListItem[data-username=" + t + "]").length > 0 ? s = "<li><span>" + ("en" == user.lang ? "Your Friend" : "Ваш друг") + "</span></li>" : o = "<li><a onclick=\"Chat.friends('" + t + "', 'request'); return false;\">" + ("en" == user.lang ? "Add to Friends" : "Добавить в друзья") + "</a></li>";
            var r = "<ul>" + s + '<li><a href="/user/' + t + '/" onclick="ajax(this); return false;">' + ("en" == user.lang ? "Profile" : "Профиль") + "</a></li>" + o + "<li><a onclick=\"Chat.easyMessage('" + t + "'); return false;\">" + ("en" == user.lang ? "Message" : "Сообщение") + "</a></li><li><a onclick=\"Chat.easyPM('" + t + "'); return false;\">" + ("en" == user.lang ? "Private Message" : "Личное сообщение") + "</a></li><li><a onclick=\"Chat.easyTip('" + t + "'); return false;\">" + ("en" == user.lang ? "Send Tip" : "Отправить чаевые") + "</a></li>" + a + n + i + "</ul>";
            t == user.name && (r = "<ul><li><span>" + ("en" == user.lang ? "It's you :)" : "Это вы :)") + '</span></li><li><a href="/user/' + t + '/" onclick="ajax(this); return false;">' + ("en" == user.lang ? "Profile" : "Профиль") + "</a></li></ul>"), $(this).tooltipster({
                animationDuration: 200,
                animation: "grow",
                trigger: "click",
                delay: 200,
                trackerInterval: 15,
                trackOrigin: !0,
                content: r,
                multiple: !0,
                side: "right",
                contentAsHTML: !0,
                interactive: !0,
                functionInit: function(t, a) {
                    e.removeClass("binduser")
                }
            })
        }
    })
}

function ajax(e, t) {
    if (1 == queue["#main"]) return !1;
    if (window.location.href == e.getAttribute("href")) return !1;
    if (1 == t) {
        if (void 0 === Game || void 0 === Game.html) return window.location.href = e.getAttribute("href"), !1;
        if (!1 === Game.html) return window.location.href = e.getAttribute("href"), !1;
        if (history.pushState("home", null, e.getAttribute("href")), $("#main").remove(), $("#mainhide").fadeIn(0).attr("id", "main"), Game.html = !1, $("#controlContainer .coinContainer").mCustomScrollbar("destroy"), $("#controlContainer .coinContainer").mCustomScrollbar({
                scrollbarPosition: "outside",
                scrollInertia: 1e3,
                alwaysShowScrollbar: 1
            }), $("#controlContainer .coinContainer a.active").hasClass("active")) {
            var a = $("#controlContainer .coinContainer a.active").position().top;
            0 != a && (a -= 16), $("#controlContainer .coinContainer").mCustomScrollbar("scrollTo", a, {
                scrollInertia: 0
            })
        }
        return !1
    }
    return !1 !== Game.html || "main" != user.module || $("#mainhide").length || (Game.html = !0, $("#main").before($("#main").clone()).attr("id", "mainhide").fadeOut(0)), AjaxContent({
        url: e.getAttribute("href"),
        container: "#main",
        content: "#main",
        active: !1,
        activeRemove: !1,
        busy: !1,
        history: !0,
        scrollTop: !0
    }), !1
}

function trxChangeCoin(e) {
    return AjaxContent({
        url: e,
        container: "#main",
        content: "#main",
        active: !1,
        activeRemove: !1,
        busy: !1,
        history: !0,
        scrollTop: !0
    }), !1
}

function exchangeRates(e) {
    var t = $("#exchanger input[name=coinFrom]").val(),
        a = $("#exchanger input[name=coinTo]").val(),
        n = $("#exchanger input[name=amountFrom]").val(),
        i = $("#exchanger input[name=amountTo]").val();
    "coin" == e && "" != t && "" != a && $("#exchanger button span").html(t.toUpperCase() + ("en" == user.lang ? " TO " : " НА ") + a.toUpperCase()), jQuery.ajax({
        url: "/ajx/",
        type: "POST",
        dataType: "html",
        async: !0,
        data: {
            action: "exchangeRates",
            flag: e,
            coinFrom: t,
            coinTo: a,
            amountFrom: n,
            amountTo: i,
            hash: user.hash
        },
        success: function(n) {
            1 == (n = JSON.parse(n)).result && (t == n.coinFrom && a == n.coinTo && ("to" == e ? $("#exchanger input[name=amountFrom]").val(n.amountFrom) : $("#exchanger input[name=amountTo]").val(n.amountTo)), $("#exchanger button").removeAttr("disabled")), 0 == n.result && ("to" == e ? $("#exchanger input[name=amountFrom]").val("0.00000000") : $("#exchanger input[name=amountTo]").val("0.00000000"), $("#exchanger button").attr("disabled", "disabled"))
        },
        error: function() {
            $.notification.error({
                title: "Error",
                message: "No connection to the server, please try again."
            })
        }
    })
}

function exchangeReverse() {
    var e = $("#exchanger input[name=coinFrom]").val(),
        t = $("#exchanger input[name=coinTo]").val();
    if (!e || !t) return !1;
    $("#exchanger .columnLeft .luckySelect .option[data-coin=" + t + "]").click(), $("#exchanger .columnRight .luckySelect .option[data-coin=" + e + "]").click()
}

function randomizeSeed() {
    jQuery.ajax({
        url: "/ajx/",
        type: "POST",
        dataType: "html",
        async: !0,
        data: {
            action: "randomizeSeed",
            hash: user.hash
        },
        success: function(e) {
            1 == (e = JSON.parse(e)).result && ($("#serverSeedHash").html(e.serverSeedHash), $("#clientSeed").val(e.clientSeed))
        },
        error: function() {
            $.notification.error({
                title: "Error",
                message: "No connection to the server, please try again."
            })
        }
    })
}

function popupShow(e, t) {
    $("#" + e).popupShow({
        data: t
    })
}
$.fn.popupShow = function(e) {
    if (this.length > 0 && "true" != this.attr("data-ajax")) $(".popup").popupClose(), $("#" + a).hasClass("nobg") || $(".popup-bg").fadeIn(150), void 0 !== e && void 0 !== e.callback && "function" == typeof e.callback && e.callback(), $("#" + a + " .g-recaptcha").length > 0 && $("#" + a + " .g-recaptcha").each(function(e, t) {
        recaptcha[a] = grecaptcha.render(t, {
            sitekey: $(this).data("sitekey")
        })
    }), $(".tooltipster-base").remove(), this.alignCenter().addClass("show").removeClass("scale").addClass("normal");
    else {
        var t, a = this.selector;
        $(a).remove(), a = a.replace("#", "");
        try {
            t = e.data
        } catch (e) {
            t = !1
        }
        $(".tooltipster-base").remove(), jQuery.ajax({
            url: "/ajx/",
            type: "POST",
            dataType: "html",
            async: !0,
            data: {
                action: "popup",
                id: a,
                coin: $("#coin").val(),
                game: user.game,
                data: t
            },
            success: function(t) {
                1 == (t = JSON.parse(t)).result && ($("#" + a).length > 0 && $("#" + a).remove(), $("body").append(t.content), $("#" + a).attr("data-ajax", "true"), ajaxPreload(), void 0 !== e && void 0 !== e.callback && "function" == typeof e.callback && e.callback(), $("#" + a + " .g-recaptcha").length > 0 && $("#" + a + " .g-recaptcha").each(function(e, t) {
                    recaptcha[a] = grecaptcha.render(t, {
                        sitekey: $(this).data("sitekey")
                    })
                }), $(".popup").popupClose(), $("#" + a).hasClass("nobg") || $(".popup-bg").fadeIn(150), $("#" + a).alignCenter().addClass("show").removeClass("scale").addClass("normal"))
            },
            error: function() {
                $.notification.error({
                    title: "Error",
                    message: "No connection to the server, please try again."
                })
            }
        })
    }
    return this
}, $.fn.popupClose = function(e) {
    this.each(function() {
        if ($(this).hasClass("normal"))
            if ($(this).find(".popup-close").length) {
                if ($(this).removeClass("normal").addClass("scale").removeClass("show"), null != $(".popup.show").length && $(".popup.show").length || $(".popup-bg").hide(0), "true" == $(this).attr("data-ajax")) {
                    var e = $(this).attr("id");
                    void 0 !== recaptcha[e] && grecaptcha.reset(recaptcha[e]), $(this).remove()
                }
            } else;
    })
}, $.fn.alignCenter = function() {
    if ($(window).height() < this.height()) {
        var e = $(window).height() - $(".popup-header").height() - $(".popup-footer").height() - 100;
        this.find(".popup-body").css("max-height", e)
    } else if ($(window).height() > this.height()) {
        e = $(window).height() - $(".popup-header").height() - $(".popup-footer").height() - 100;
        this.find(".popup-body").css("max-height", e)
    }
    return this.css("position", "fixed"), this.css("top", ($(window).height() - this.outerHeight()) / 2 + "px"), this
};
var statsArray = new Array;

function updateStats(e, t, a) {
    if (!1 === e) $("#currentWagered").html("0.00000000"), $("#currentProfit").html("0.00000000"), $("#currentBets").html("0"), $("#currentWins").html("0"), $("#currentLosses").html("0"), $("#currentLuck").html("0.00"), $("#currentMessages").html("0"), $("#currentMaxBet").html("0.00000000"), $("#currentMaxProfit").html("0.00000000"), statsArray = new Array, $("#currentProfit").parent().removeClass("red").removeClass("green");
    else {
        e = parseFloat(e), t = parseFloat(t), void 0 === statsArray.currentWagered && (statsArray.currentWagered = 1 * $("#currentWagered").html());
        var n = 1 * statsArray.currentWagered + 1 * e;
        statsArray.currentWagered = n, n > -1e-8 && n < 0 && (n = 0), n = n.toFixed(8), $("#currentWagered").html(n), void 0 === statsArray.currentProfit && (statsArray.currentProfit = 1 * $("#currentProfit").html());
        var i = 1 * statsArray.currentProfit + 1 * t;
        statsArray.currentProfit = i, i > -1e-8 && i < 0 && (i = 0), i = i.toFixed(8), $("#currentProfit").html(i), $("#currentBets").html(1 * $("#currentBets").html() + 1), void 0 === statsArray.overallWagered && (statsArray.overallWagered = 1 * $("#overallWagered").html());
        var o = 1 * statsArray.overallWagered + 1 * e;
        statsArray.overallWagered = o, o > -1e-8 && o < 0 && (o = 0), o = o.toFixed(8), $("#overallWagered").html(o), void 0 === statsArray.overallProfit && (statsArray.overallProfit = 1 * $("#overallProfit").html());
        var s = 1 * statsArray.overallProfit + 1 * t;
        statsArray.overallProfit = s, s > -1e-8 && s < 0 && (s = 0), s = s.toFixed(8), $("#overallProfit").html(s), $("#overallBets").html(1 * $("#overallBets").html() + 1), "win" == a ? ($("#currentWins").html(1 * $("#currentWins").html() + 1), $("#overallWins").html(1 * $("#overallWins").html() + 1)) : ($("#currentLosses").text(1 * $("#currentLosses").text() + 1), $("#overallLosses").text(1 * $("#overallLosses").text() + 1));
        var r = 1 * n + 1 * i;
        r = (r = r / n * 100).toFixed(2), $("#currentLuck").html(r);
        var l = 1 * o + 1 * s;
        l = (l = l / o * 100).toFixed(2), $("#overallLuck").html(l);
        var c = 1 * $("#currentMaxBet").html();
        (e = e.toFixed(8)) > c && $("#currentMaxBet").html(e);
        var d = 1 * $("#currentMaxProfit").html();
        (t = t.toFixed(8)) > d && $("#currentMaxProfit").html(t), $("#currentProfit").parent().removeClass("red").removeClass("green"), 1 * $("#currentProfit").text() < 0 ? $("#currentProfit").parent().addClass("red") : 1 * $("#currentProfit").text() > 0 && $("#currentProfit").parent().addClass("green"), $("#overallProfit").parent().removeClass("red").removeClass("green"), 1 * $("#overallProfit").text() < 0 ? $("#overallProfit").parent().addClass("red") : 1 * $("#overallProfit").text() > 0 && $("#overallProfit").parent().addClass("green")
    }
}
var queue = new Array;

function AjaxContent(e) {
    $(".tooltipster-base").remove();
    var t = e.url,
        a = e.container;
    e.content;
    if (1 == queue[a]) return !1;
    queue[a] = 1;
    var n = void 0 !== e.active && e.active,
        i = void 0 !== e.activeRemove && e.activeRemove,
        o = void 0 !== e.busy && e.busy,
        s = void 0 !== e.scrollTop && e.scrollTop;
    !1 !== o && $(o).addClass("busy"), jQuery.ajax({
        url: t,
        type: "GET",
        dataType: "html",
        async: !0,
        data: {
            action: "AjaxContent"
        },
        success: function(t) {
            queue[a] = 0, -1 != a.indexOf(",") ? (a = a.split(","), $.each(a, function(e, a) {
                $(a).html($(t).find(a).html())
            })) : $(a).html($(t).find(a).html()), !1 !== i && $(i).removeClass("active"), !1 !== n && n.addClass("active"), !1 !== o && $(o).removeClass("busy"), ajaxPreload(), void 0 !== e.callback && "function" == typeof e.callback && e.callback(), !1 !== s && $("html, body").scrollTop(0)
        },
        error: function() {
            $.notification.error({
                title: "Error",
                message: "No connection to the server, please try again."
            }), queue[a] = 0
        }
    }), void 0 !== e.history && !0 === e.history && history.pushState(e, null, t)
}

function has_history_api() {
    return !(!window.history || !history.pushState)
}

function successFaucet() {
    $("#faucet form").submit()
}

function successCaptcha() {
    $("#captcha form").submit()
}

function placeFocus(e) {
    var t = document.getElementById(e);
    if (t.focus(), void 0 !== window.getSelection && void 0 !== document.createRange) {
        var a = document.createRange();
        a.selectNodeContents(t), a.collapse(!1);
        var n = window.getSelection();
        n.removeAllRanges(), n.addRange(a)
    } else if (void 0 !== document.body.createTextRange) {
        var i = document.body.createTextRange();
        i.moveToElementText(t), i.collapse(!1), i.select()
    }
}

function toFixedFloor(e, t) {
    var a = t || 0;
    return a = Math.pow(10, a), (Math.floor(e * a) / a).toFixed(t)
}

function randomInt(e, t) {
    var a = e + Math.random() * (t - e);
    return a = Math.round(a)
}

function stripslashes(e) {
    return e = (e = (e = (e = e.replace(/\\'/g, "'")).replace(/\\"/g, '"')).replace(/\\0/g, "\0")).replace(/\\\\/g, "\\")
}

function number_format(e, t, a, n) {
    var i, o;
    return isNaN(t = Math.abs(t)) && (t = 2), null == a && (a = ","), null == n && (n = "."), (o = (i = parseInt(e = (+e || 0).toFixed(t)) + "").length) > 3 ? o %= 3 : o = 0, (o ? i.substr(0, o) + n : "") + i.substr(o).replace(/(\d{3})(?=\d)/g, "$1" + n) + (t ? a + Math.abs(e - i).toFixed(t).replace(/-/, 0).slice(2) : "")
}

function setCookie(e, t, a) {
    if (a) {
        var n = new Date;
        n.setTime(n.getTime() + 24 * a * 60 * 60 * 1e3);
        var i = "; expires=" + n.toUTCString()
    } else i = "";
    document.cookie = e + "=" + t + i + "; path=/; secure=true; domain=." + user.domain
}

function getCookie(e) {
    for (var t = e + "=", a = document.cookie.split(";"), n = 0; n < a.length; n++) {
        for (var i = a[n];
            " " == i.charAt(0);) i = i.substring(1, i.length);
        if (0 == i.indexOf(t)) return i.substring(t.length, i.length)
    }
    return null
}
$.fn.animateBalance = function(e) {
    var t, a, n;
    return t = "text" == this.attr("type") ? this.val() : this.html(), (a = (e = e.replace(/\,/g, "")) - (t = t.replace(/\,/g, ""))) > 0 ? n = "green" : a < 0 && (n = "red"), "text" == this.attr("type") ? this.val(e) : this.html(e), a = number_format(a, 8, ".", ""), this.after('<div class="animateBalance ' + n + '">' + a + "</div>"), $(".balanceContainer .animateBalance").delay(100).queue(function() {
        $(this).addClass("animation")
    }), $(".balanceContainer .animateBalance").each(function() {
        0 == $(this).css("opacity") && $(this).remove()
    }), this
}, $.fn.animateAmount = function(e, t, a, n, i) {
    if ("on" == getCookie("uECO")) return e = number_format(e, t, a, n), "text" == this.attr("type") ? this.val(e) : this.html(e), this;
    var o, s = this;
    return o = "text" == this.attr("type") ? this.val() : this.html(), e = e.replace(/\,/g, ""), o = o.replace(/\,/g, ""), $({
        val: o
    }).stop().animate({
        val: e
    }, {
        duration: 1500,
        easing: "linear",
        step: function(e) {
            e = number_format(e, t, a, n), "text" == s.attr("type") ? s.val(e) : s.html(e)
        }
    }), this
};
var growl = {
    style: "notice",
    notice: function(e) {
        growl.style = "notice", growl.show(e)
    },
    show: function(e) {
        if ($("#growls").length || $("body").append($('<div id="growls"/>')), $("#growl" + e.id).length > 0) return !1;
        $("#growls .hider").length || ($("#growls").append('<div class="hider incoming active"><span>' + ("en" == user.lang ? "Hide Notifications" : "Скрыть уведомления") + '</span><div class="newMessages">0</div><div class="closeAll">&#215;</div></div>'), $("#growls .hider").bind("click", function() {
            $(this).hasClass("active") ? ($(this).removeClass("active"), $("#growls .growl").addClass("incoming"), $("#growls .growl").fadeOut(0), $(this).find("span").html("en" == user.lang ? "Show Notifications" : "Показать уведомления"), $("#growls .growl").length > 1 && $("#growls .hider .closeAll").addClass("incoming").removeClass("show"), setCookie("uNOTIFY", "off", 365)) : ($(this).addClass("active"), $("#growls .growl").fadeIn(0), $("#growls .growl").removeClass("incoming"), $(this).find("span").html("en" == user.lang ? "Hide Notifications" : "Скрыть уведомления"), $("#growls .hider .newMessages").removeClass("show").html("0"), $("#growls .growl").length > 1 && $("#growls .hider .closeAll").removeClass("incoming").addClass("show"), setCookie("uNOTIFY", "on", 365))
        }), "off" == getCookie("uNOTIFY") && $("#growls .hider").click(), setTimeout(function() {
            $("#growls .hider").removeClass("incoming")
        }, 20)), $("#growls").append('<div class="growl incoming ' + growl.style + '" id="growl' + e.id + '"/>'), $("#growl" + e.id).append('<div class="options"><a class="minimize">–</a><a class="close">&#215;</a></div>'), $("#growl" + e.id).append('<div class="title">' + e.title + "</div>"), $("#growl" + e.id).append('<div class="message">' + e.msg + "</div>"), void 0 !== e.date && $("#growl" + e.id).append('<div class="date">' + e.date + "</div>"), e.user_id > 0 && ($("#growl" + e.id).attr("data-userID", e.user_id), $("#growl" + e.id).attr("data-username", e.username)), $("#growl" + e.id + " .close").bind("click", function() {
            jQuery.ajax({
                url: "/ajx/",
                type: "POST",
                async: !0,
                data: "action=readGrowl&id=" + e.id + "&hash=" + user.hash,
                success: function(t) {
                    1 == $("#growls .growl").length && $("#growls .hider").addClass("outgoing"), $("#growl" + e.id).addClass("outgoing"), setTimeout(function() {
                        $("#growl" + e.id).remove(), $("#growls .growl").length || $("#growls").remove(), $("#growls .growl").length < 2 && $("#growls .hider .closeAll").removeClass("show")
                    }, 300)
                }
            })
        }), $("#growl" + e.id + " .minimize").bind("click", function() {
            $(this).hasClass("active") ? ($(this).html("–"), $(this).parent().parent().find(".message").fadeIn(0), $(this).removeClass("active")) : ($(this).html("+"), $(this).parent().parent().find(".message").fadeOut(0), $(this).addClass("active"))
        }), void 0 === e.history && Chat.newmessage.play(), $("#growls .hider").hasClass("active") ? (setTimeout(function() {
            $("#growl" + e.id).removeClass("incoming")
        }, 20), $("#growls .growl").length > 1 && $("#growls .hider .closeAll").addClass("show")) : ($("#growls .hider .newMessages").addClass("show").html(1 * $("#growls .hider .newMessages").html() + 1), $("#growls .growl").fadeOut(0)), $("#growls .growl").length > 1 && $("#growls .hider .closeAll").bind("click", function() {
            $("#growls .hider").addClass("outgoing"), $("#growls .growl .close").each(function() {
                $(this).click()
            })
        })
    }
};

function LSAmount(action, id, inputID, minAmountID, maxAmountID, balanceID, func) {
    var decimals = $(id + " " + inputID).attr("data-decimals");
    if (null != minAmountID && 0 != minAmountID) {
        var minAmount = $(id).find("[" + minAmountID + "]").html();
        minAmount = minAmount.split(" "), minAmount = 1 * minAmount[0]
    }
    if (null != maxAmountID && 0 != maxAmountID) {
        var maxAmount = $(id).find("[" + maxAmountID + "]").html();
        maxAmount = maxAmount.split(" "), maxAmount = 1 * maxAmount[0]
    }
    if (null != balanceID && 0 != balanceID) {
        var balance = $(id).find("[" + balanceID + "]").html();
        balance = balance.split(" "), balance = 1 * balance[0]
    }
    var amount = 1 * $(id + " " + inputID).val();
    "max" == action && (null != balanceID && 0 != balanceID && maxAmount > balance && (maxAmount = balance), decimals > 0 ? (maxAmount = Math.floor(maxAmount * Math.pow(10, decimals)) / Math.pow(10, decimals), maxAmount = maxAmount.toFixed(decimals)) : maxAmount = 0 == decimals ? Math.floor(maxAmount) : maxAmount.toFixed(8), $(id + " " + inputID).val(maxAmount)), "min" == action && (amount = minAmount, null != balanceID && 0 != balanceID && amount > balance && (amount = balance), decimals > 0 ? (amount = Math.floor(amount * Math.pow(10, decimals)) / Math.pow(10, decimals), amount = amount.toFixed(decimals)) : amount = 0 == decimals ? Math.floor(amount) : amount.toFixed(8), $(id + " " + inputID).val(amount)), "multiply" == action && (amount *= 2, null != minAmountID && 0 != minAmountID && amount < minAmount && (amount = minAmount), null != balanceID && 0 != balanceID && amount > balance && (amount = balance), decimals > 0 ? (amount = Math.floor(amount * Math.pow(10, decimals)) / Math.pow(10, decimals), amount = amount.toFixed(decimals)) : amount = 0 == decimals ? Math.floor(amount) : amount.toFixed(8), $(id + " " + inputID).val(amount)), "devide" == action && (amount /= 2, null != minAmountID && 0 != minAmountID && amount < minAmount && (amount = minAmount), null != balanceID && 0 != balanceID && amount > balance && (amount = balance), decimals > 0 ? (amount = Math.floor(amount * Math.pow(10, decimals)) / Math.pow(10, decimals), amount = amount.toFixed(decimals)) : amount = 0 == decimals ? Math.floor(amount) : amount.toFixed(8), $(id + " " + inputID).val(amount)), null != func && 0 != func && eval(func)
}

function LSMultiplyAmount(e, t) {
    var a = 2 * $(e + " " + t).val();
    a = a.toFixed(8), $(e + " " + t).val(a)
}

function LSDevideAmount(e, t) {
    var a = $(e + " " + t).val() / 2;
    a = a.toFixed(8), $(e + " " + t).val(a)
}

function uLight() {
    $("body").hasClass("light") ? ($("#light .icon").removeClass("off").removeClass("on").addClass("off"), $("body").removeClass("light"), setCookie("uLIGHT", "off", 365)) : ($("#light .icon").removeClass("off").removeClass("on").addClass("on"), $("body").addClass("light"), setCookie("uLIGHT", "on", 365));
    var e = $("#light .text").html(),
        t = $("#light").attr("data-text");
    $("#light .text").html(t), $("#light").attr("data-text", e)
}

function uEco() {
    $("#eco .icon").hasClass("on") ? ($("#eco .icon").removeClass("off").removeClass("on").addClass("off"), setCookie("uECO", "off", 365)) : ($("#eco .icon").removeClass("off").removeClass("on").addClass("on"), setCookie("uECO", "on", 365));
    var e = $("#eco .text").html(),
        t = $("#eco").attr("data-text");
    $("#eco .text").html(t), $("#eco").attr("data-text", e)
}
var Roulette = {
    timeout: new Array,
    wheelStops: {
        0: 0,
        32: -10,
        15: -19.5,
        19: -29.5,
        4: -39,
        21: -49,
        2: -59,
        25: -68.7,
        17: -78.4,
        34: -88.1,
        6: -97.8,
        27: -107.7,
        13: -117.5,
        36: -127.2,
        11: -136.9,
        30: -146.7,
        8: -156.5,
        23: -166.2,
        10: -175.9,
        5: 174.5,
        24: 164.9,
        16: 155.3,
        33: 145.4,
        1: 135.8,
        20: 126.1,
        14: 116.5,
        31: 106.9,
        9: 97,
        22: 87.4,
        18: 77.7,
        29: 68,
        7: 58.2,
        28: 48.6,
        12: 38.9,
        35: 29.1,
        3: 19.3,
        26: 9.7
    },
    snapShot: function(e) {
        jQuery.ajax({
            url: "/ajx/",
            type: "POST",
            dataType: "html",
            async: !0,
            data: {
                game: "roulette",
                action: "snapShot",
                id: e
            },
            success: function(t) {
                if (1 == (t = JSON.parse(t)).result) {
                    t.betAmount;
                    var a = t.clientChoice,
                        n = t.resultNumber,
                        i = t.chipsArray;
                    clearTimeout(Roulette.timeout[0]), clearTimeout(Roulette.timeout[1]), clearTimeout(Roulette.timeout[2]), $("#content").append(t.tml), ajaxPreload(), $("#snapShot .betID").html(e), $.each(i, function(e, t) {
                        $('#snapShot .cell-bet[data-type="' + e + '"] .chip-cont').html(stripslashes(t))
                    }), $.each(a.betArray, function(e, t) {
                        t = (t *= 1).toFixed(8), $('#snapShot .cell-bet[data-type="' + e + '"] .chip-cont').append('<div class="chip-amount"><span>' + (t >= 1e-6 ? 1 * t : t) + "</span></div>")
                    }), $("#snapShot").popupShow(), $("#snapShot").attr("data-ajax", "true"), $("#snapShot .ball").fadeIn(0);
                    var o = randomInt(-50, 50),
                        s = Roulette.wheelStops[n] + 720 + o,
                        r = -720 + o;
                    Roulette.move($("#snapShot .wheel"), s, "2s"), Roulette.move($("#snapShot .ball"), r, "2s"), Roulette.timeout[0] = setTimeout(function() {
                        $("#snapShot .betID").html() == e && $('#snapShot .roulette-cell[data-cells="' + n + '"]').append('<div class="winning-ball"><span>' + n + "</span></div>")
                    }, 2e3), Roulette.timeout[0] = setTimeout(function() {
                        $("#snapShot .betID").html() == e && $('#snapShot .roulette-cell[data-cells="' + n + '"] .winning-ball').remove()
                    }, 4e3), Roulette.timeout[1] = setTimeout(function() {
                        $("#snapShot .betID").html() == e && (s += 360, r += 360, Roulette.move($("#snapShot .wheel"), s, "1s"), Roulette.move($("#snapShot .ball"), r, "1s"), $("#playBtn").removeClass("active"))
                    }, 2500), Roulette.timeout[2] = setTimeout(function() {
                        $("#snapShot .betID").html() == e && (!1 !== a.winArr && $.each(a.winArr, function(e, t) {
                            if ($('#snapShot .cell-bet[data-type="' + e + '"] .chip-cont .chip').each(function() {
                                    $(this);
                                    var e = $(this).find(".nominal"),
                                        a = e.html() * t;
                                    $({
                                        val: e.html()
                                    }).animate({
                                        val: a
                                    }, {
                                        duration: 1e3,
                                        easing: "linear",
                                        step: function(t) {
                                            t = parseInt(t) != t ? t.toFixed(1) : t.toFixed(0), e.html(t)
                                        }
                                    })
                                }), $('#snapShot .cell-bet[data-type="' + e + '"] .chip-amount span').length > 0) {
                                var a = $('#snapShot .cell-bet[data-type="' + e + '"] .chip-amount span'),
                                    n = (a.html(), a.html() * t);
                                n = n.toFixed(8), a.html(n >= 1e-6 ? 1 * n : n)
                            }
                        }), !1 !== a.loseArr && $.each(a.loseArr, function(e, t) {
                            $('#snapShot .cell-bet[data-type="' + e + '"] .chip').remove(), $('#snapShot .cell-bet[data-type="' + e + '"] .chip-amount').length > 0 && $('#snapShot .cell-bet[data-type="' + e + '"] .chip-amount').remove()
                        }))
                    }, 4e3), $("#snapShot .roulette-field .roulette-cell, .roulette-field .cell").hover(function() {
                        for (var e = $(this).attr("data-cells").split(","), t = 0; t < e.length; t++) "" != e[t] && $("#snapShot .roulette-cell[data-cells=" + e[t] + "]").addClass("hover")
                    }, function() {
                        for (var e = $(this).attr("data-cells").split(","), t = 0; t < e.length; t++) "" != e[t] && $("#snapShot .roulette-cell[data-cells=" + e[t] + "]").removeClass("hover")
                    })
                } else $.notification.error({
                    message: t.msg
                })
            }
        })
    },
    move: function(e, t, a) {
        e.css({
            WebkitTransform: "rotate(" + t + "deg)",
            "-moz-transform": "rotate(" + t + "deg)",
            transform: "rotate(" + t + "deg)",
            WebkitTransition: "all " + a + " ease-out",
            MozTransition: "all " + a + " ease-out",
            MsTransition: "all " + a + " ease-out",
            OTransition: "all " + a + " ease-out",
            transition: "all " + a + " ease-out"
        })
    }
};







"use strict";
var Game = {
    html: !1,
    direction: !1,
    playFlag: !1,
    autoPlayFlag: !1,
    accelerationFlag: 0,
    autoPlayCount: 0,
    autoPlayLimit: 0,
    autoPlayBase: 0,
    autoPlayOnLossTerm: 0,
    autoPlayOnLossBets: 0,
    autoPlayOnLoss: 0,
    autoPlayOnLossInc: 0,
    autoPlayOnLossDec: 0,
    autoPlayOnLossRev: !1,
    autoPlayOnLossStop: !1,
    autoPlayOnWinTerm: 0,
    autoPlayOnWinBets: 0,
    autoPlayOnWin: 0,
    autoPlayOnWinInc: 0,
    autoPlayOnWinDec: 0,
    autoPlayOnWinRev: !1,
    autoPlayOnWinStop: !1,
    autoPlayBalanceUnder: !1,
    autoPlayBalanceOver: !1,
    autoPlayBetOver: !1,
    winSeries: 0,
    lossSeries: 0,
    sound: "on",
    hotkeys: "off",
    animation: "on",
    load: function() {
        "off" == getCookie("uSOUND") && Game.uSound(), "off" == getCookie("uANIMATION") && Game.uAnimation(), window.onbeforeunload = function() {
            if (1 == Game.autoPlayFlag) return "ru" == user.lang ? "Вы уверены, что хотите закрыть или обновить окно? Режим AUTO все еще работает..." : "Are you sure to close or refresh the window? AUTO mode is still working..."
        }, $(document).keydown(function(a) {
            var e = !1;
            return ($(".popup.show").length > 0 || $("#mainhide").length > 0) && (e = !0), ($("input").is(":focus") || $("div.textarea").is(":focus")) && (e = !0), $(document.activeElement).is("div.textarea") && (e = !0), 81 == a.keyCode && "on" == Game.hotkeys && 0 == e ? ($("#rollUnder").click(), !1) : 87 == a.keyCode && "on" == Game.hotkeys && 0 == e ? ($("#rollOver").click(), !1) : (69 == a.keyCode && "on" == Game.hotkeys && 0 == e && ($("#prediction").val(1 * $("#prediction").val() + 1), "" == $("#prediction").val() || (0 == $("#prediction").val() ? $("#prediction").val(1) : 99 == $("#prediction").val() && $("#prediction").val(98)), Game.calculate(), $("#playBtn").html($(".game-dice .direction.active").html() + " " + 1 * $("#prediction").val())), 82 == a.keyCode && "on" == Game.hotkeys && 0 == e && ($("#prediction").val(1 * $("#prediction").val() - 1), "" == $("#prediction").val() || (0 == $("#prediction").val() ? $("#prediction").val(1) : 99 == $("#prediction").val() && $("#prediction").val(98)), Game.calculate(), $("#playBtn").html($(".game-dice .direction.active").html() + " " + 1 * $("#prediction").val())), 65 == a.keyCode && "on" == Game.hotkeys && 0 == e ? ($("#multiplyBet").click(), !1) : 83 == a.keyCode && "on" == Game.hotkeys && 0 == e ? ($("#splitBet").click(), !1) : 68 == a.keyCode && "on" == Game.hotkeys && 0 == e ? ($("#minBet").click(), !1) : 70 == a.keyCode && "on" == Game.hotkeys && 0 == e ? ($("#maxBet").click(), !1) : 32 == a.keyCode && "on" == Game.hotkeys && 0 == e ? (Game.play(), !1) : void 0)
        }), $("#playBtn").keydown(function(a) {
            if (32 == a.keyCode && "off" == Game.hotkeys) return a.preventDefault(), !1
        }), $(document).keydown(function(a) {
            if ($("#pHotkeys").hasClass("show")) {
                if (81 == a.keyCode) return $("#pHotkeys .key[data-id=Q]").parent().addClass("active"), !1;
                if (87 == a.keyCode) return $("#pHotkeys .key[data-id=W]").parent().addClass("active"), !1;
                if (69 == a.keyCode) return $("#pHotkeys .key[data-id=E]").parent().addClass("active"), !1;
                if (82 == a.keyCode) return $("#pHotkeys .key[data-id=R]").parent().addClass("active"), !1;
                if (65 == a.keyCode) return $("#pHotkeys .key[data-id=A]").parent().addClass("active"), !1;
                if (83 == a.keyCode) return $("#pHotkeys .key[data-id=S]").parent().addClass("active"), !1;
                if (68 == a.keyCode) return $("#pHotkeys .key[data-id=D]").parent().addClass("active"), !1;
                if (70 == a.keyCode) return $("#pHotkeys .key[data-id=F]").parent().addClass("active"), !1;
                if (32 == a.keyCode) return $("#pHotkeys .key[data-id=Space]").parent().addClass("active"), !1
            }
        }).keyup(function(a) {
            if ($("#pHotkeys").hasClass("show")) {
                if (81 == a.keyCode) return $("#pHotkeys .key[data-id=Q]").parent().removeClass("active"), !1;
                if (87 == a.keyCode) return $("#pHotkeys .key[data-id=W]").parent().removeClass("active"), !1;
                if (69 == a.keyCode) return $("#pHotkeys .key[data-id=E]").parent().removeClass("active"), !1;
                if (82 == a.keyCode) return $("#pHotkeys .key[data-id=R]").parent().removeClass("active"), !1;
                if (65 == a.keyCode) return $("#pHotkeys .key[data-id=A]").parent().removeClass("active"), !1;
                if (83 == a.keyCode) return $("#pHotkeys .key[data-id=S]").parent().removeClass("active"), !1;
                if (68 == a.keyCode) return $("#pHotkeys .key[data-id=D]").parent().removeClass("active"), !1;
                if (70 == a.keyCode) return $("#pHotkeys .key[data-id=F]").parent().removeClass("active"), !1;
                if (32 == a.keyCode) return $("#pHotkeys .key[data-id=Space]").parent().removeClass("active"), !1
            }
        }), $("#controlContainer .coinContainer a").unbind("click"), $("#controlContainer .coinContainer a").bind("click", function() {
            return !(void 0 !== Game.playFlag && !1 !== Game.playFlag || void 0 !== Game.autoPlayFlag && Game.autoPlayFlag) && (AjaxContent({
                url: $(this).attr("href"),
                container: ".userBalance, #statsContent",
                content: ".userBalance, #statsContent",
                active: $(this),
                activeRemove: "#controlContainer .coinContainer a",
                busy: !1,
                callback: function() {
                    updateStats(!1)
                }
            }), !1)
        }), $("#prediction").focus(), $(".game-dice .direction").click(function() {
            if (1 == Game.playFlag || 1 == Game.autoPlayFlag) return !1;
            $(".game-dice .direction.active").removeClass("active"), $(this).addClass("active"), $("#playBtn").html($(this).html() + " " + 1 * $("#prediction").val()), Game.direction = $(this).attr("data-direction"), Game.calculate()
        }), $("#rollOver").click(), $("#prediction").keyup(function() {
            if (1 == Game.playFlag || 1 == Game.autoPlayFlag) return !1;
            "" == $(this).val() || (0 == $(this).val() ? $(this).val(1) : 99 == $(this).val() && $(this).val(98)), Game.calculate(), $("#playBtn").html($(".game-dice .direction.active").html() + " " + 1 * $("#prediction").val())
        }), $("#prediction").numberMask({
            type: "int",
            beforePoint: 2,
            afterPoint: 0,
            defaultValueInput: "50"
        }), $("#betAmount").bind("keyup", function() {
            Game.calculate()
        }), $("#betAmount").numberMask({
            type: "float",
            afterPoint: 8,
            defaultValueInput: "0.00001",
            decimalMark: "."
        }), $(".radioBox input[type=text]").each(function() {
            if ($(this).attr("data-decimals") > 0) {
                var a = {
                    type: "float",
                    afterPoint: $(this).attr("data-decimals"),
                    decimalMark: "."
                };
                "true" == $(this).attr("data-allowNegative") && (a.allowNegative = !0), $(this).attr("data-beforePoint") > 0 && (a.beforePoint = $(this).attr("data-beforePoint")), $(this).numberMask(a)
            } else $(this).numberMask({
                type: "int",
                afterPoint: 0
            })
        }), $("#multiplyBet").bind("click", function() {
            if (1 == Game.playFlag || 1 == Game.autoPlayFlag) return !1;
            var a = 1 * $("#betAmount").val(),
                e = 1 * $("#balance").val(),
                t = 1 * $("#maxBetAmount").val();
            0 != a && "0.00000000" != a || (a = 1e-8);
            var o = 2 * a;
            o > e && (o = e), o > t && (o = t), o = o.toFixed(8), $("#betAmount").val(o), Game.calculate()
        }), $("#splitBet").bind("click", function() {
            if (1 == Game.playFlag || 1 == Game.autoPlayFlag) return !1;
            var a = 1 * $("#betAmount").val(),
                e = 1 * $("#balance").val(),
                t = a / 2;
            t > e && (t = e), t = t.toFixed(8), $("#betAmount").val(t), Game.calculate()
        }), $("#minBet").bind("click", function() {
            if (1 == Game.playFlag || 1 == Game.autoPlayFlag) return !1;
            var a = 1 * $("#balance").val(),
                e = 1e-8;
            e > a && (e = a), e = e.toFixed(8), $("#betAmount").val(e), Game.calculate()
        }), $("#maxBet").bind("click", function() {
            if (1 == Game.playFlag || 1 == Game.autoPlayFlag) return !1;
            var a = 1 * $("#balance").val(),
                e = 1 * $("#maxBetAmount").val(),
                t = 1 * $("#betAmount").val();
            return e > a && (e = a), e = e.toFixed(8), 0 == a ? ($("#betAmount").val(e), Game.calculate(), !1) : e != t && void(confirm("ru" == user.lang ? "Вы собираетесь сделать максимальную ставку. Вы уверены?" : "You are about to place the maximum bet. Are you sure?") && ($("#betAmount").val(e), Game.calculate()))
        }), $(".slider").jRange({
            from: 0,
            to: 3,
            step: 1,
            format: "%s",
            width: 525,
            showLabels: !1,
            showScale: !1,
            snap: !0
        })
    },
    uSound: function() {
        "off" == Game.sound ? (Game.sound = "on", setCookie("uSOUND", "on", 365), $("#sound .icon").removeClass("off").removeClass("on").addClass("on")) : "on" == Game.sound && (Game.sound = "off", setCookie("uSOUND", "off", 365), $("#sound .icon").removeClass("off").removeClass("on").addClass("off"));
        var a = $("#sound .text").html(),
            e = $("#sound").attr("data-text");
        $("#sound .text").html(e), $("#sound").attr("data-text", a)
    },
    uAnimation: function() {
        "off" == Game.animation ? (Game.animation = "on", setCookie("uANIMATION", "on", 365), $("#animation .icon").removeClass("off").removeClass("on").addClass("on")) : "on" == Game.animation && (Game.animation = "off", setCookie("uANIMATION", "off", 365), $("#animation .icon").removeClass("off").removeClass("on").addClass("off"));
        var a = $("#animation .text").html(),
            e = $("#animation").attr("data-text");
        $("#animation .text").html(e), $("#animation").attr("data-text", a)
    },
    uHotkeys: function() {
        "off" == Game.hotkeys ? (Game.hotkeys = "on", $("#hotkeys .icon").removeClass("off").removeClass("on").addClass("on"), $("#pHotkeys").popupShow()) : "on" == Game.hotkeys && (Game.hotkeys = "off", $("#hotkeys .icon").removeClass("off").removeClass("on").addClass("off"));
        var a = $("#hotkeys .text").html(),
            e = $("#hotkeys").attr("data-text");
        $("#hotkeys .text").html(e), $("#hotkeys").attr("data-text", a)
    },
    play: function() {
        if (1 == Game.playFlag) return !1;
        Game.playFlag = !0, 1 == Game.autoPlayFlag && Game.autoPlayLimit > 0 && Game.autoPlayCount++;
        var a = $("#betAmount").val();
        a = number_format(a, 8, ".", ""), $("#betAmount").val(a);
        var e = $("#clientSeed").val(),
            t = $("#serverSeedHash").html(),
            o = (a = $("#betAmount").val(), $("#prediction").val()),
            n = $("#coin").val();
        jQuery.ajax({
            url: "/ajx/",
            type: "POST",
            dataType: "html",
            timeout: 6e4,
            data: {
                game: "dice",
                coin: n,
                betAmount: a,
                prediction: o,
                direction: Game.direction,
                clientSeed: e,
                serverSeedHash: t,
                action: "playBet",
                hash: user.hash
            },
            success: function(e) {
                try {
                    e = JSON.parse(e)
                } catch (a) {
                    return Game.playFlag = !1, Game.stopAutoplay(), $.notification.error({
                        title: "Error",
                        message: "ru" == user.lang ? "Что-то пошло не так. Пожалуйста, повторите попытку" : "Something went wrong. Please try again"
                    }), !1
                }
                if (1 == e.result) Game.runDice(e.resultNumber, function() {
                    if ($("#serverSeedHash").html(e.serverSeedHash), $("#prevServerSeedHash").html(e.prevServerSeedHash), $("#prevServerSeed").html(e.prevServerSeed), $("#prevClientSeed").html(e.prevClientSeed), $("#balance").animateBalance(e.balance), $("#coin" + e.coinID + " span.balance").html(e.balance), updateStats(a, e.profit, e.gameResult), "on" == Game.sound) {
                        if ("lose" == e.gameResult) var t = new Audio("/assets/sounds/dice-lose.mp3");
                        if ("win" == e.gameResult) t = new Audio("/assets/sounds/dice-win.mp3");
                        t.play()
                    }
                    if ($("#myBets").hasClass("active") && !$("#bet" + e.id).length) {
                        var o = $("#listContainer .table .tbody .tr:first-child");
                        if (o.hasClass("full")) o.remove(), $("#listContainer .table .tbody").append(e.betHtml);
                        else {
                            o.before(e.betHtml);
                            var n = $("#listContainer .table .tbody .tr").length;
                            if (n > 50 && (n = 40), n > 40)
                                for (var l = 0; l < n - 40; l++) $("#listContainer .table .tbody .tr:last-child").remove()
                        }
                        bindLinks()
                    }
                    if (1 == Game.autoPlayFlag) {
                        if (Game.autoPlayLimit > 0 && Game.autoPlayCount >= Game.autoPlayLimit) return Game.stopAutoplay(), !1;
                        if (Game.autoPlayBalanceUnder > 0 && e.balance < Game.autoPlayBalanceUnder) return Game.stopAutoplay(), !1;
                        if (Game.autoPlayBalanceOver > 0 && e.balance > Game.autoPlayBalanceOver) return Game.stopAutoplay(), !1;
                        if ("lose" == e.gameResult) {
                            if (Game.lossSeries++, 2 == Game.autoPlayOnWinTerm && (Game.winSeries = 0), 1 == Game.autoPlayOnLossBets || Game.autoPlayOnLossBets > 1 && Game.lossSeries == Game.autoPlayOnLossBets) {
                                if (Game.lossSeries = 0, 1 == Game.autoPlayOnLossStop) return Game.stopAutoplay(), !1;
                                0 == Game.autoPlayOnLoss ? $("#betAmount").val(Game.autoPlayBase) : 1 == Game.autoPlayOnLoss ? (a = (a = 1 * a + a * Game.autoPlayOnLossInc / 100).toFixed(8), $("#betAmount").val(a)) : 2 == Game.autoPlayOnLoss && (a = (a = 1 * a - a * Game.autoPlayOnLossDec / 100).toFixed(8), $("#betAmount").val(a)), 1 == Game.autoPlayOnLossRev && ($(".game-dice .direction").each(function() {
                                    $(this).hasClass("active") ? $(this).removeClass("active") : $(this).addClass("active")
                                }), $("#playBtn").html($(".game-dice .direction.active").html() + " " + 1 * $("#prediction").val()), Game.direction = $(".game-dice .direction.active").attr("data-direction"), Game.calculate())
                            }
                        } else if ("win" == e.gameResult && (Game.winSeries++, 2 == Game.autoPlayOnLossTerm && (Game.lossSeries = 0), 1 == Game.autoPlayOnWinBets || Game.autoPlayOnWinBets > 1 && Game.winSeries == Game.autoPlayOnWinBets)) {
                            if (Game.winSeries = 0, 1 == Game.autoPlayOnWinStop) return Game.stopAutoplay(), !1;
                            0 == Game.autoPlayOnWin ? $("#betAmount").val(Game.autoPlayBase) : 1 == Game.autoPlayOnWin ? (a = (a = 1 * a + a * Game.autoPlayOnWinInc / 100).toFixed(8), $("#betAmount").val(a)) : 2 == Game.autoPlayOnWin && (a = (a = 1 * a - a * Game.autoPlayOnWinDec / 100).toFixed(8), $("#betAmount").val(a)), 1 == Game.autoPlayOnWinRev && ($(".game-dice .direction").each(function() {
                                $(this).hasClass("active") ? $(this).removeClass("active") : $(this).addClass("active")
                            }), $("#playBtn").html($(".game-dice .direction.active").html() + " " + 1 * $("#prediction").val()), Game.direction = $(".game-dice .direction.active").attr("data-direction"), Game.calculate())
                        }
                        if (Game.autoPlayBetOver > 0 && a > Game.autoPlayBetOver) return Game.stopAutoplay(), !1;
                        Game.calculate();
                        var i = 300;
                        Game.accelerationFlag > 0 && (1 == Game.accelerationFlag && (i = 200), 2 == Game.accelerationFlag && (i = 100), 3 == Game.accelerationFlag && (i = 0), i = i.toFixed(0)), setTimeout(function() {
                            Game.play()
                        }, i)
                    }
                });
                else if (0 == e.result) {
                    if (Game.playFlag = !1, void 0 !== e.popupshow && $("#" + e.popupshow).popupShow(), void 0 !== e.serverHash) return $("#serverSeedHash").html(e.serverHash), Game.play(), !1;
                    Game.stopAutoplay(), void 0 !== e.msg && $.notification.error({
                        title: "Error",
                        message: e.msg
                    })
                }
            },
            error: function(a, e) {
                Game.playFlag = !1, Game.stopAutoplay(), $.notification.error({
                    title: "Error",
                    message: "ru" == user.lang ? "Нет подключения к серверу. Пожалуйста, повторите попытку" : "No connection to the server. Please try again"
                })
            }
        })
    },
    runDice: function(a, e) {
        $("#playBtn").addClass("active");
        var t = 20,
            o = 1 * $("#prediction").val(),
            n = $(".game-dice .direction.active").attr("data-direction"),
            l = 1 * $("#resultNumber").html();
        if ("off" == Game.animation) return "under" == n && 1 * a < o || "over" == n && 1 * a > o ? $(".number.result").removeClass("lose") : $(".number.result").addClass("lose"), $("#resultNumber").html(a), $("#playBtn").removeClass("active"), Game.playFlag = !1, "function" == typeof e && e(), !0;
        if (1 == Game.autoPlayFlag && (1 == Game.accelerationFlag && (t = 8), 2 == Game.accelerationFlag && (t = 1), 3 == Game.accelerationFlag)) return "under" == n && 1 * a < o || "over" == n && 1 * a > o ? $(".number.result").removeClass("lose") : $(".number.result").addClass("lose"), $("#resultNumber").html(a), $("#playBtn").removeClass("active"), Game.playFlag = !1, "function" == typeof e && e(), !0;
        var i = setInterval(function() {
            var t = 1 * $("#resultNumber").html();
            "99" == t ? t = 0 : t += 1, l += 1, t < 10 && (t = "0" + t), $("#resultNumber").html(t), "under" == n && 1 * t < o || "over" == n && 1 * t > o ? $(".number.result").removeClass("lose") : $(".number.result").addClass("lose"), t == a && (clearInterval(i), $("#playBtn").removeClass("active"), Game.playFlag = !1, "function" == typeof e && e())
        }, t)
    },
    startAutoplay: function() {
        Game.autoPlayFlag = !0, Game.autoPlayCount = 0, Game.winSeries = 0, Game.lossSeries = 0, Game.autoPlayBase = number_format($("#betAmount").val(), 8, ".", ""), Game.autoPlayOnLoss = $("#autoplay input[name=on-loss]:checked").val(), Game.autoPlayOnLoss || (Game.autoPlayOnLoss = 0), Game.autoPlayOnLossTerm = $("#autoplay select[name=on-loss-term]").val(), Game.autoPlayOnLossTerm || (Game.autoPlayOnLossTerm = 1), Game.autoPlayOnLossBets = $("#autoplay input[name=on-loss-bets]").val(), Game.autoPlayOnLossBets || (Game.autoPlayOnLossBets = 0), Game.autoPlayOnLossInc = $("#autoplay input[name=on-loss-inc]").val(), Game.autoPlayOnLossInc || (Game.autoPlayOnLossInc = 0), Game.autoPlayOnLossDec = $("#autoplay input[name=on-loss-dec]").val(), Game.autoPlayOnLossDec || (Game.autoPlayOnLossDec = 0), 1 == $("#autoplay input[name=on-loss-rev]").prop("checked") ? Game.autoPlayOnLossRev = !0 : Game.autoPlayOnLossRev = !1, 1 == $("#autoplay input[name=on-loss-stop]").prop("checked") ? Game.autoPlayOnLossStop = !0 : Game.autoPlayOnLossStop = !1, Game.autoPlayOnWin = $("#autoplay input[name=on-win]:checked").val(), Game.autoPlayOnWin || (Game.autoPlayOnWin = 0), Game.autoPlayOnWinTerm = $("#autoplay select[name=on-win-term]").val(), Game.autoPlayOnWinTerm || (Game.autoPlayOnWinTerm = 1), Game.autoPlayOnWinBets = $("#autoplay input[name=on-win-bets]").val(), Game.autoPlayOnWinBets || (Game.autoPlayOnWinBets = 0), Game.autoPlayOnWinInc = $("#autoplay input[name=on-win-inc]").val(), Game.autoPlayOnWinInc || (Game.autoPlayOnWinInc = 0), Game.autoPlayOnWinDec = $("#autoplay input[name=on-win-dec]").val(), Game.autoPlayOnWinDec || (Game.autoPlayOnWinDec = 0), 1 == $("#autoplay input[name=on-win-rev]").prop("checked") ? Game.autoPlayOnWinRev = !0 : Game.autoPlayOnWinRev = !1, 1 == $("#autoplay input[name=on-win-stop]").prop("checked") ? Game.autoPlayOnWinStop = !0 : Game.autoPlayOnWinStop = !1, Game.accelerationFlag = 1 * $("#autoplay input[name=acceleration]").val(), Game.accelerationFlag || (Game.accelerationFlag = 0), Game.autoPlayLimit = 1 * $("#autoplay input[name=bets-limit]").val(), Game.autoPlayLimit || (Game.autoPlayLimit = 0), Game.autoPlayBalanceUnder = 1 * $("#autoplay input[name=balance-under-limit]").val(), Game.autoPlayBalanceUnder || (Game.autoPlayBalanceUnder = !1), Game.autoPlayBalanceOver = 1 * $("#autoplay input[name=balance-over-limit]").val(), Game.autoPlayBalanceOver || (Game.autoPlayBalanceOver = !1), Game.autoPlayBetOver = 1 * $("#autoplay input[name=bet-over-limit]").val(), Game.autoPlayBetOver || (Game.autoPlayBetOver = !1), $(".popup").popupClose(), $("#autoPlayBtn").replaceWith('<button class="btn grey active" onclick="Game.stopAutoplay()" id="autoPlayBtn">STOP</button>'), $("#betAmount").attr("readonly", "true"), Game.play()
    },
    stopAutoplay: function() {
        Game.autoPlayFlag = !1, $("#autoPlayBtn").replaceWith('<button class="btn grey popup-show" data-popup="autoplay" id="autoPlayBtn">AUTO</button>'), $("#betAmount").removeAttr("readonly"), ajaxPreload()
    },
    calculate: function() {
        var a, e, t, o, n, l;
        n = 1 * $("#prediction").val(), l = $(".game-dice .direction.active").attr("data-direction"), n < 1 || n > 98 ? (a = 0, t = 0, e = (0).toFixed(8)) : (t = (99 / (a = "over" == l ? (99 - n) / 100 * 100 : n / 100 * 100)).toFixed(2), e = (e = (o = $("#betAmount").val()) * t - o).toFixed(8), a = a.toFixed(1)), $("#winChance").val(a + "%"), $("#multiplier").val(t + "x"), $("#profitOnWin").val(e)
    }
};
$(function() {
    Game.load(), "main" == user.module && $("#allBets a").click(), "main" == user.module && history.replaceState("home", null, window.location)
});




"use strict";
$(document).ready(function() {
    console.log("Establishing connection..."), socket.Connect()
});
var socket = {
        id: !1,
        socketID: !1,
        Connect: function() {
            if (!1 !== socket.id) return !1;
            socket.id = new WebSocket("wss://ws." + user.domain + "/"), socket.id.onopen = function(e) {
                socket.id.send('{"action": "connect", "params":{"session":"' + getCookie("SESSION") + '","room":"' + getCookie("uROOM") + '"}}')
            }, socket.id.onmessage = function(e) {
                socket.Message(e)
            }, socket.id.onclose = function(e) {
                socket.Reconnect()
            }, socket.onerror = function(e) {
                socket.Reconnect()
            }
        },
        Message: function(e) {
            try {
                e = JSON.parse(e.data), actions[e.action](e.params)
            } catch (e) {}
        },
        Reconnect: function() {
            socket.id = !1, console.log("Reconnecting..."), setTimeout(socket.Connect(), 1e3)
        }
    },
    actions = {
        Connect: function(e) {
            socket.socketID = e.socketID, Chat.room = e.room, setCookie("uROOM", e.room, 365), $("#rooms .room.active").removeClass("active"), $("#rooms .room[data-id=" + e.room + "]").addClass("active"), $("#roomCode").html(e.room), jQuery.ajax({
                url: "/ajx/",
                type: "POST",
                dataType: "html",
                async: !0,
                data: {
                    action: "wsLoad",
                    room: e.room,
                    hash: user.hash
                },
                success: function(e) {
                    $("#chatBody").empty(), $("#chatLog").removeClass("busy"), $("#pmsUnread").text("0").removeClass("show"), $("#pmsList .sidebarListItem .unread").each(function() {
                        $(this).remove()
                    }), $("#friendsUnread").text("0").removeClass("show"), e = JSON.parse(e), actions[e.action](e.params)
                }
            }), console.log("Sucessfully connected to websocket")
        },
        Actions: function(e) {
            if ("object" == typeof e)
                for (var s = 0; s < e.length; s++) "function" == typeof actions[e[s].action] && actions[e[s].action](e[s].params)
        },
        Reconnect: function() {
            socket.read = !1, socket.Connect()
        },
        ChatPrint: function(e) {
            Chat.print(e)
        },
        ChatNotify: function(e) {
            Chat.notify(e)
        },
        ChangeRoom: function(e) {
            if (Chat.busy = !1, !e.room) return !1;
            Chat.room = e.room, setCookie("uROOM", e.room, 365), $("#rooms .room.active").removeClass("active"), $("#rooms .room[data-id=" + e.room + "]").addClass("active"), $("#roomCode").html(e.room), jQuery.ajax({
                url: "/ajx/",
                type: "POST",
                dataType: "html",
                async: !0,
                data: {
                    action: "changeRoom",
                    room: e.room,
                    hash: user.hash
                },
                success: function(e) {
                    $("#chatLog").removeClass("busy"), e = JSON.parse(e), actions[e.action](e.params)
                }
            })
        },
        BetPrint: function(e) {
            if ("on" == getCookie("uECO")) return !1;
            if (user.game != e.game || "main" != user.module || $("#mainhide").length > 0) return !1;
            if ($("#bet" + e.betID).length > 0) return !1;
            if (!0 !== e.high || $("#highBets").hasClass("active") || user.id == e.userID || $("#highBets .newBets").html(1 * $("#highBets .newBets").html() + 1).addClass("show"), !0 !== e.rare || $("#rareBets").hasClass("active") || user.id == e.userID || $("#rareBets .newBets").html(1 * $("#rareBets .newBets").html() + 1).addClass("show"), $("#myBets").hasClass("active")) return !1;
            if ($("#allBets").hasClass("active")) {
                if (user.id == e.userID) return !1
            } else if ($("#highBets").hasClass("active")) {
                if (user.id == e.userID) return !1;
                if (1 != e.high) return !1
            } else if ($("#rareBets").hasClass("active")) {
                if (user.id == e.userID) return !1;
                if (1 != e.rare) return !1
            }
            var s = $("#listContainer .table .tbody .tr:first-child");
            if (s.hasClass("full")) s.remove(), $("#listContainer .table .tbody").append(e.html);
            else {
                s.before(e.html);
                var t = $("#listContainer .table .tbody .tr").length;
                if (t > 40)
                    for (var i = 0; i < t - 40; i++) $("#listContainer .table .tbody .tr:last-child").remove()
            }
            bindLinks()
        },
        Balance: function(e) {
            e.coin == $("#coinID").val() && $("#balance").val() != e.amount && !1 === Game.playFlag && $("#balance").val(e.amount), $("#coin" + e.coin + " span.balance").html(e.amount);
            var s = $("#coinset input[name=coins-set1]:checked").val();
            void 0 === s || $("#coinSearch").val() || (2 == s && 1 * e.amount == 0 && $("#coin" + e.coin).is(":visible") ? $("#coin" + e.coin).css("display", "none") : 2 == s && 1 * e.amount > 0 && !$("#coin" + e.coin).is(":visible") && $("#coin" + e.coin).css("display", "block"))
        },
        Trxcount: function(e) {
            e.coin == $("#coinID").val() && $("#ucount").html(e.ucount)
        },
        Growl: function(e) {
            growl.notice(e), bindLinks()
        },
        Notification: function(e) {
            "error" == e.type && $.notification.error({
                message: e.msg
            }), "notice" == e.type && $.notification.notice({
                message: e.msg
            }), void 0 !== e.popupshow && $("#" + e.popupshow).popupShow()
        },
        SetAddress: function(e) {
            e.address && e.coin && $("#coin").val() == e.coin && $("#address").val() != e.address && $("input.address").each(function() {
                $(this).val(e.address)
            })
        },
        UsersOnline: function(e) {
            $(".usersOnline").text(e.count)
        },
        Usergroup: function() {
            AjaxContent({
                url: "/",
                container: "#faucetUnload, #gameContainer .userInfo",
                content: "#faucetUnload, #gameContainer .userInfo",
                active: !1,
                activeRemove: !1,
                busy: !1,
                callback: function() {
                    $("#sidebar .sidebarNav").css("margin-top", $("#sidebar .sidebarNav").height() / 2 * -1)
                }
            })
        },
        SiteStats: function(e) {
            void 0 !== e.totalBets && $("#totalBets").html() != e.totalBets && e.totalBets > 0 && $("#totalBets").animateAmount(e.totalBets, 0, "", ","), void 0 !== e.totalWon && $("#totalWon").html() != e.totalWon && e.totalWon > 0 && $("#totalWon").animateAmount(e.totalWon, 2, ".", ","), void 0 !== e.jackpot && $("#jackpotValue1").html() != e.jackpot && e.jackpot > 0 && e.game == user.game && ($("#jackpotValue1").animateAmount(e.jackpot, 8, ".", ","), $("#jackpotValue2").length > 0 && $("#jackpotValue2").animateAmount(e.jackpot, 8, ".", ","))
        },
        NewRound: function(e) {
            if (user.game != e.game) return !1;
            Game.newRound(e)
        },
        OpenCell: function(e) {
            if (user.game != e.game) return !1;
            Game.openCell(e)
        },
        Friends: function(e) {
            if ("request" == e.status) {
                if ($("#friendsRequests .sidebarListItem[data-id=" + e.id + "]").length > 0 || $("#friendsList .sidebarListItem[data-id=" + e.id + "]").length > 0 || $("#friendsList .sidebarListItem[data-user_id=" + e.user_id + "]").length > 0) return !1;
                var s = '<div class="sidebarListItem" data-id="' + e.id + '" data-user_id="' + e.user_id + '" data-username="' + e.username + '" data-online="' + e.online + '"><div class="avatar"><img src="/avatars/' + e.avatar + '" alt="' + e.username + '"><div class="usergroup ' + e.group + '">' + e.group + '</div><div class="userlevel level' + e.level + '">' + e.level + '</div></div><div class="username binduser" data-username="' + e.username + '">' + e.username + '</div><div class="sidebarListItemOptions"><div class="btn green" onclick="Chat.friends(\'' + e.username + "', 'accept'); return false;\">" + ("ru" == user.lang ? "Принять" : "Accept") + '</div><div class="btn red" onclick="Chat.friends(\'' + e.username + "', 'decline'); return false;\">" + ("ru" == user.lang ? "Отклонить" : "Decline") + "</div></div></div>";
                $("#friendsRequests").removeClass("hide"), $("#friendsRequests .list").find(".sidebarListItem").length || $("#friendsRequests .list").html(""), $("#friendsRequests .list").prepend(s), $("#friendsRequests .counter").html($("#friendsRequests .sidebarListItem").length), $("#friendsUnread").html(1 * $("#friendsUnread").html() + 1), $("#friendsUnread").hasClass("show") || $("#friendsUnread").addClass("show"), 1 != e.history && Friends.newrequest.play(), "true" == e.online && $("#friendsList .sidebarListItem[data-id=" + e.id + "] .sidebarListItemOptions").prepend('<div class="online">online</div>')
            } else if ("waiting" == e.status) {
                if ($("#friendsRequests .sidebarListItem[data-id=" + e.id + "]").length > 0 || $("#friendsList .sidebarListItem[data-id=" + e.id + "]").length > 0 || $("#friendsList .sidebarListItem[data-user_id=" + e.user_id + "]").length > 0) return !1;
                s = '<div class="sidebarListItem" data-id="' + e.id + '" data-user_id="' + e.user_id + '" data-username="' + e.username + '" data-online="' + e.online + '"><div class="avatar"><img src="/avatars/' + e.avatar + '" alt="' + e.username + '"><div class="usergroup ' + e.group + '">' + e.group + '</div><div class="userlevel level' + e.level + '">' + e.level + '</div></div><div class="username binduser" data-username="' + e.username + '">' + e.username + '</div><div class="sidebarListItemOptions"><div class="btn red" onclick="Chat.friends(\'' + e.username + "', 'cancel'); return false;\">" + ("ru" == user.lang ? "Отменить" : "Cancel") + "</div></div></div>";
                $("#friendsRequests").removeClass("hide"), $("#friendsRequests .list").find(".sidebarListItem").length || $("#friendsRequests .list").html(""), $("#friendsRequests .list").prepend(s), $("#friendsRequests .counter").html($("#friendsRequests .sidebarListItem").length)
            } else if ("friends" == e.status) {
                if (($("#friendsRequests .sidebarListItem[data-user_id=" + e.user_id + "]").length > 0 || $("#friendsRequests .sidebarListItem[data-id=" + e.id + "]").length > 0) && ("true" == $("#friendsRequests .sidebarListItem[data-user_id=" + e.user_id + "]").attr("data-online") && (e.online = "true"), $("#friendsRequests .sidebarListItem[data-user_id=" + e.user_id + "]").remove(), $("#friendsRequests .sidebarListItem[data-id=" + e.id + "]").remove(), $("#friendsUnread").html(1 * $("#friendsUnread").html() - 1), 1 * $("#friendsUnread").html() < 0 && $("#friendsUnread").html("0"), 1 * $("#friendsUnread").html() == 0 && $("#friendsUnread").removeClass("show"), $("#friendsRequests .counter").html($("#friendsRequests .sidebarListItem").length), $("#friendsRequests .sidebarListItem").length || $("#friendsRequests").addClass("hide")), $("#friendsList .sidebarListItem[data-id=" + e.id + "]").length > 0 || $("#friendsList .sidebarListItem[data-user_id=" + e.user_id + "]").length > 0) return !1;
                s = '<div class="sidebarListItem" data-id="' + e.id + '" data-user_id="' + e.user_id + '" data-username="' + e.username + '" data-online="' + e.online + '"><div class="avatar"><img src="/avatars/' + e.avatar + '" alt="' + e.username + '"><div class="usergroup ' + e.group + '">' + e.group + '</div><div class="userlevel level' + e.level + '">' + e.level + '</div></div><div class="username binduser" data-username="' + e.username + '">' + e.username + '</div><div class="sidebarListItemOptions"><div class="btn red" onclick="Chat.friends(\'' + e.username + "', 'decline'); return false;\">" + ("ru" == user.lang ? "Удалить" : "Remove") + "</div></div></div>";
                $("#friendsList .list").find(".sidebarListItem").length || $("#friendsList .list").html(""), "true" != e.online && $("#friendsList .sidebarListItem[data-online=true]:last").length > 0 ? $("#friendsList .sidebarListItem[data-online=true]:last").after(s) : $("#friendsList .list").prepend(s), $("#friendsList .counter").html($("#friendsList .sidebarListItem").length), "true" == e.online && $("#friendsList .sidebarListItem[data-id=" + e.id + "] .sidebarListItemOptions").prepend('<div class="online">online</div>')
            } else if ("ignore" == e.status) {
                if ($("#ignoreList .sidebarListItem[data-id=" + e.id + "]").length > 0) return !1;
                s = '<div class="sidebarListItem" data-id="' + e.id + '" data-user_id="' + e.user_id + '" data-username="' + e.username + '"><div class="avatar"><img src="/avatars/' + e.avatar + '" alt="' + e.username + '"><div class="usergroup ' + e.group + '">' + e.group + '</div><div class="userlevel level' + e.level + '">' + e.level + '</div></div><div class="username binduser" data-username="' + e.username + '">' + e.username + '</div><div class="sidebarListItemOptions"><div class="btn red" onclick="Chat.friends(\'' + e.username + "', 'unignore'); return false;\">" + ("ru" == user.lang ? "Удалить" : "Remove") + "</div></div></div>";
                $("#ignoreList .list").find(".sidebarListItem").length || $("#ignoreList .list").html(""), $("#ignoreList .list").prepend(s), $("#ignoreList .counter").html($("#ignoreList .sidebarListItem").length)
            } else "unignore" == e.status ? $("#ignoreList .sidebarListItem[data-user_id=" + e.user_id + "]").length > 0 && ($("#ignoreList .sidebarListItem[data-user_id=" + e.user_id + "]").remove(), $("#ignoreList .counter").html($("#ignoreList .sidebarListItem").length), $("#ignoreList .sidebarListItem").length || $("#ignoreList .list").html("ru" == user.lang ? "Здесь никого нет" : "Nobody's here")) : "decline" == e.status && ($("#friendsRequests .sidebarListItem[data-user_id=" + e.user_id + "]").length > 0 && ($("#friendsRequests .sidebarListItem[data-user_id=" + e.user_id + "]").remove(), $("#friendsUnread").html(1 * $("#friendsUnread").html() - 1), 1 * $("#friendsUnread").html() < 0 && $("#friendsUnread").html("0"), 1 * $("#friendsUnread").html() == 0 && $("#friendsUnread").removeClass("show"), $("#friendsRequests .counter").html($("#friendsRequests .sidebarListItem").length), $("#friendsRequests .sidebarListItem").length || ($("#friendsRequests .list").html("ru" == user.lang ? "Здесь никого нет" : "Nobody's here"), $("#friendsRequests").addClass("hide"))), $("#friendsList .sidebarListItem[data-user_id=" + e.user_id + "]").length > 0 && ($("#friendsList .sidebarListItem[data-user_id=" + e.user_id + "]").remove(), $("#friendsList .counter").html($("#friendsList .sidebarListItem").length), $("#friendsList .sidebarListItem").length || $("#friendsList .list").html("ru" == user.lang ? "Здесь никого нет" : "Nobody's here")));
            $(".tooltipstered[data-username=" + e.username + "]").each(function() {
                $(this).tooltipster("destroy").addClass("binduser")
            }), Friends.resize(), bindLinks()
        },
        Pvp: function(e) {
            if ("request" == e.status) {
                if ($("#friendsRequests .sidebarListItem[data-id=" + e.id + "]").length > 0 || $("#friendsList .sidebarListItem[data-id=" + e.id + "]").length > 0 || $("#friendsList .sidebarListItem[data-user_id=" + e.user_id + "]").length > 0) return !1;
                var s = '<div class="sidebarListItem" data-id="' + e.id + '" data-user_id="' + e.user_id + '" data-username="' + e.username + '" data-online="' + e.online + '"><div class="avatar"><img src="/avatars/' + e.avatar + '" alt="' + e.username + '"><div class="usergroup ' + e.group + '">' + e.group + '</div><div class="userlevel level' + e.level + '">' + e.level + '</div></div><div class="username binduser" data-username="' + e.username + '">' + e.username + '</div><div class="sidebarListItemOptions"><div class="btn green" onclick="Chat.friends(\'' + e.username + "', 'accept'); return false;\">" + ("ru" == user.lang ? "Принять" : "Accept") + '</div><div class="btn red" onclick="Chat.friends(\'' + e.username + "', 'decline'); return false;\">" + ("ru" == user.lang ? "Отклонить" : "Decline") + "</div></div></div>";
                $("#friendsRequests").removeClass("hide"), $("#friendsRequests .list").find(".sidebarListItem").length || $("#friendsRequests .list").html(""), $("#friendsRequests .list").prepend(s), $("#friendsRequests .counter").html($("#friendsRequests .sidebarListItem").length), $("#friendsUnread").html(1 * $("#friendsUnread").html() + 1), $("#friendsUnread").hasClass("show") || $("#friendsUnread").addClass("show"), 1 != e.history && Friends.newrequest.play(), "true" == e.online && $("#friendsList .sidebarListItem[data-id=" + e.id + "] .sidebarListItemOptions").prepend('<div class="online">online</div>')
            } else if ("waiting" == e.status) {
                if ($("#friendsRequests .sidebarListItem[data-id=" + e.id + "]").length > 0 || $("#friendsList .sidebarListItem[data-id=" + e.id + "]").length > 0 || $("#friendsList .sidebarListItem[data-user_id=" + e.user_id + "]").length > 0) return !1;
                s = '<div class="sidebarListItem" data-id="' + e.id + '" data-user_id="' + e.user_id + '" data-username="' + e.username + '" data-online="' + e.online + '"><div class="avatar"><img src="/avatars/' + e.avatar + '" alt="' + e.username + '"><div class="usergroup ' + e.group + '">' + e.group + '</div><div class="userlevel level' + e.level + '">' + e.level + '</div></div><div class="username binduser" data-username="' + e.username + '">' + e.username + '</div><div class="sidebarListItemOptions"><div class="btn red" onclick="Chat.friends(\'' + e.username + "', 'cancel'); return false;\">" + ("ru" == user.lang ? "Отменить" : "Cancel") + "</div></div></div>";
                $("#friendsRequests").removeClass("hide"), $("#friendsRequests .list").find(".sidebarListItem").length || $("#friendsRequests .list").html(""), $("#friendsRequests .list").prepend(s), $("#friendsRequests .counter").html($("#friendsRequests .sidebarListItem").length)
            } else if ("friends" == e.status) {
                if (($("#friendsRequests .sidebarListItem[data-user_id=" + e.user_id + "]").length > 0 || $("#friendsRequests .sidebarListItem[data-id=" + e.id + "]").length > 0) && ("true" == $("#friendsRequests .sidebarListItem[data-user_id=" + e.user_id + "]").attr("data-online") && (e.online = "true"), $("#friendsRequests .sidebarListItem[data-user_id=" + e.user_id + "]").remove(), $("#friendsRequests .sidebarListItem[data-id=" + e.id + "]").remove(), $("#friendsUnread").html(1 * $("#friendsUnread").html() - 1), 1 * $("#friendsUnread").html() < 0 && $("#friendsUnread").html("0"), 1 * $("#friendsUnread").html() == 0 && $("#friendsUnread").removeClass("show"), $("#friendsRequests .counter").html($("#friendsRequests .sidebarListItem").length), $("#friendsRequests .sidebarListItem").length || $("#friendsRequests").addClass("hide")), $("#friendsList .sidebarListItem[data-id=" + e.id + "]").length > 0 || $("#friendsList .sidebarListItem[data-user_id=" + e.user_id + "]").length > 0) return !1;
                s = '<div class="sidebarListItem" data-id="' + e.id + '" data-user_id="' + e.user_id + '" data-username="' + e.username + '" data-online="' + e.online + '"><div class="avatar"><img src="/avatars/' + e.avatar + '" alt="' + e.username + '"><div class="usergroup ' + e.group + '">' + e.group + '</div><div class="userlevel level' + e.level + '">' + e.level + '</div></div><div class="username binduser" data-username="' + e.username + '">' + e.username + '</div><div class="sidebarListItemOptions"><div class="btn red" onclick="Chat.friends(\'' + e.username + "', 'decline'); return false;\">" + ("ru" == user.lang ? "Удалить" : "Remove") + "</div></div></div>";
                $("#friendsList .list").find(".sidebarListItem").length || $("#friendsList .list").html(""), "false" == e.online && $("#friendsList .sidebarListItem[data-online=true]:last").length > 0 ? $("#friendsList .sidebarListItem[data-online=true]:last").after(s) : $("#friendsList .list").prepend(s), $("#friendsList .counter").html($("#friendsList .sidebarListItem").length), "true" == e.online && $("#friendsList .sidebarListItem[data-id=" + e.id + "] .sidebarListItemOptions").prepend('<div class="online">online</div>')
            } else if ("ignore" == e.status) {
                if ($("#ignoreList .sidebarListItem[data-id=" + e.id + "]").length > 0) return !1;
                s = '<div class="sidebarListItem" data-id="' + e.id + '" data-user_id="' + e.user_id + '" data-username="' + e.username + '"><div class="avatar"><img src="/avatars/' + e.avatar + '" alt="' + e.username + '"><div class="usergroup ' + e.group + '">' + e.group + '</div><div class="userlevel level' + e.level + '">' + e.level + '</div></div><div class="username binduser" data-username="' + e.username + '">' + e.username + '</div><div class="sidebarListItemOptions"><div class="btn red" onclick="Chat.friends(\'' + e.username + "', 'unignore'); return false;\">" + ("ru" == user.lang ? "Удалить" : "Remove") + "</div></div></div>";
                $("#ignoreList .list").find(".sidebarListItem").length || $("#ignoreList .list").html(""), $("#ignoreList .list").prepend(s), $("#ignoreList .counter").html($("#ignoreList .sidebarListItem").length)
            } else "unignore" == e.status ? $("#ignoreList .sidebarListItem[data-user_id=" + e.user_id + "]").length > 0 && ($("#ignoreList .sidebarListItem[data-user_id=" + e.user_id + "]").remove(), $("#ignoreList .counter").html($("#ignoreList .sidebarListItem").length), $("#ignoreList .sidebarListItem").length || $("#ignoreList .list").html("ru" == user.lang ? "Здесь никого нет" : "Nobody's here")) : "decline" == e.status && ($("#friendsRequests .sidebarListItem[data-user_id=" + e.user_id + "]").length > 0 && ($("#friendsRequests .sidebarListItem[data-user_id=" + e.user_id + "]").remove(), $("#friendsUnread").html(1 * $("#friendsUnread").html() - 1), 1 * $("#friendsUnread").html() < 0 && $("#friendsUnread").html("0"), 1 * $("#friendsUnread").html() == 0 && $("#friendsUnread").removeClass("show"), $("#friendsRequests .counter").html($("#friendsRequests .sidebarListItem").length), $("#friendsRequests .sidebarListItem").length || ($("#friendsRequests .list").html("ru" == user.lang ? "Здесь никого нет" : "Nobody's here"), $("#friendsRequests").addClass("hide"))), $("#friendsList .sidebarListItem[data-user_id=" + e.user_id + "]").length > 0 && ($("#friendsList .sidebarListItem[data-user_id=" + e.user_id + "]").remove(), $("#friendsList .counter").html($("#friendsList .sidebarListItem").length), $("#friendsList .sidebarListItem").length || $("#friendsList .list").html("ru" == user.lang ? "Здесь никого нет" : "Nobody's here")));
            Friends.resize(), bindLinks()
        },
        OnlineStatus: function(e) {
            "online" == e.status ? ($("#friendsList .sidebarListItem[data-user_id=" + e.id + "]").attr("data-online", "true"), $("#friendsList .sidebarListItem[data-user_id=" + e.id + "] .sidebarListItemOptions").prepend('<div class="online">online</div>'), $("#friendsList .sidebarListItem[data-user_id=" + e.id + "]").prependTo("#friendsList .list")) : "offline" == e.status && ($("#friendsList .sidebarListItem[data-user_id=" + e.id + "]").removeAttr("data-online"), $("#friendsList .sidebarListItem[data-user_id=" + e.id + "] .sidebarListItemOptions .online").remove(), $("#friendsList .sidebarListItem[data-online=true]:last").length > 0 ? $("#friendsList .sidebarListItem[data-user_id=" + e.id + "]").insertAfter("#friendsList .sidebarListItem[data-online=true]:last") : $("#friendsList .sidebarListItem[data-user_id=" + e.id + "]").prependTo("#friendsList .list"))
        },
        GamesOnline: function(e) {
            $.each(e, function(e, s) {
                1 * $("#online-" + e).html() != s && $("#online-" + e).html(s)
            })
        },
        RoomsOnline: function(e) {
            $.each(e, function(e, s) {
                1 * $("#online-" + e).html() != s && $("#online-" + e).html(s)
            })
        },
        Pms: function(e) {
            if ("newdialogue" == e.action) {
                var s = $("#pmsList .sidebarListItem[data-id=" + e.user_id + "]");
                s.length > 0 && (s.find(".unread").length > 0 && (e.newmsgs = e.newmsgs + 1 * s.find(".unread").html(), $("#pmsUnread").text(1 * $("#pmsUnread").text() - 1 * s.find(".unread").html()), 1 * $("#pmsUnread").text() < 1 && $("#pmsUnread").text("0").removeClass("show")), e.user_id == Pms.companionID && $("#dialogueContent").is(":visible") && (e.newmsgs = 0), s.remove());
                var t = '<div class="sidebarListItem" data-id="' + e.user_id + '" onclick="Pms.openDialogue(\'' + e.user_id + '\'); return false;"><div class="avatar"><img src="/avatars/' + e.avatar + '" alt="' + e.username + '"><div class="usergroup ' + e.group + '">' + e.group + '</div><div class="userlevel level' + e.level + '">' + e.level + '</div></div><div class="username"><span class="user">' + e.username + '</span></div><div class="text">' + e.msg + '</div><div class="time">' + e.date + '</div><div class="sidebarListItemOptions"><div class="option" onclick="Pms.delete(\'' + e.user_id + "'); return false;\">✕</div></div></div>";
                $("#pmsList .sidebarListItem").length || $("#pmsList .list").html(""), $("#pmsList .list").prepend(t), $("#pmsList .counter").html($("#pmsList .sidebarListItem").length), e.newmsgs > 0 && ($("#pmsList .sidebarListItem[data-id=" + e.user_id + "]").addClass("new"), $("#pmsUnread").text(1 * $("#pmsUnread").text() + 1 * e.newmsgs), $("#pmsUnread").hasClass("show") || $("#pmsUnread").addClass("show"), e.newmsgs > 0 && $("#pmsList .sidebarListItem[data-id=" + e.user_id + "]").append('<div class="unread">' + e.newmsgs + "</div>")), 1 == e.mine && $("#pmsList .sidebarListItem[data-id=" + e.user_id + "]").addClass("mine"), 1 != e.history && 1 != e.mine && e.newmsgs > 0 && !$("#messagesContent").is(":visible") && Pms.newmessage.play(), Pms.resize(), bindLinks()
            }
            if ("newmessage" == e.action) {
                if (e.dialogue_id != Pms.companionID || !$("#dialogueContent").is(":visible")) return !1;
                if ($("#dialogueBody .msg[data-id=" + e.id + "]").length > 0) return !1;
                if ($("#dialogueBody").append('<div class="msg" data-id="' + e.id + '"><div class="username"><span class="user">' + e.username + '</span></div><div class="time">' + e.date + '</div><div class="text">' + e.msg + "</div></div>"), e.user_id > 0) {
                    new Date;
                    $("#dialogueBody .msg[data-id=" + e.id + "]").prepend('<div class="avatar"><img src="/avatars/' + e.avatar + '" alt="' + e.username + '" /></div>'), $("#dialogueBody .msg[data-id=" + e.id + "]").addClass("ava").addClass("arrow")
                }
                if (1 == e.usergroup && $("#dialogueBody .msg[data-id=" + e.id + "] .avatar").append('<div class="usergroup vip">VIP</div>'), 2 == e.usergroup && ($("#dialogueBody .msg[data-id=" + e.id + "]").addClass("bot"), $("#dialogueBody .msg[data-id=" + e.id + "] .username").html('<span class="bot">BOT</span> ' + $(".msg[data-id=" + e.id + "] .username").html())), 3 == e.usergroup && $("#dialogueBody .msg[data-id=" + e.id + "] .avatar").append('<div class="usergroup mod">MOD</div>'), 4 == e.usergroup && $("#dialogueBody .msg[data-id=" + e.id + "] .avatar").append('<div class="usergroup help">HELP</div>'), 5 == e.usergroup && $("#dialogueBody .msg[data-id=" + e.id + "] .avatar").append('<div class="usergroup legend">LEGEND</div>'), 7 == e.usergroup && $("#dialogueBody .msg[data-id=" + e.id + "] .avatar").append('<div class="usergroup admin">ADMIN</div>'), $("#dialogueBody .msg[data-id=" + e.id + "] .avatar").append('<div class="userlevel level' + e.level + '">' + e.level + "</div>"), e.user_id == user.id ? ($("#dialogueBody .msg[data-id=" + e.id + "]").addClass("me"), $("#dialogueBody .msg[data-id=" + e.id + "] .username span").addClass("binduser").attr("data-username", e.username)) : 2 != e.usergroup && $("#dialogueBody .msg[data-id=" + e.id + "] .username span").addClass("binduser").attr("data-username", e.username), $("#dialogueBody .msg[data-id=" + e.id + "]").prev().find(".username span.user").html() == $(".msg[data-id=" + e.id + "] .username span.user").html() && $("#dialogueBody .msg[data-id=" + e.id + "]").addClass("glued"), 1 != e.history) {
                    var i = $("#dialogueBody .msg").size();
                    if (i > 50)
                        for (var a = 0; a < i - 50; a++) $("#dialogueBody .msg:first-child").remove(), $("#dialogueBody .msg:first-child").hasClass("glued") && $("#dialogueBody .msg:first-child").removeClass("glued")
                }
                if (1 == e.history && "false" == e.read && 0 == e.mine && $(".msg[data-id=" + e.id + "]").addClass("new"), bindLinks(), $("#dialogueBody .mCSB_dragger").hasClass("mCSB_dragger_onDrag")) {
                    var r = $("#dialogueBody .mCSB_dragger").height();
                    parseInt($("#dialogueBody .mCSB_dragger").css("max-height"), 10) - parseInt($("#dialogueBody .mCSB_dragger").css("top"), 10) > 1.5 * r && 1 != e.history && $("#dialogueNewMessagesBtn").fadeIn(0)
                } else 1 != e.history && e.user_id != user.id ? Pms.dialogueScroll("bottom", 150, 100) : 1 != e.history && e.user_id == user.id ? Pms.dialogueScroll("bottom", 150, 100, 1) : Pms.dialogueScroll("bottom", 0, 0, e.history);
                Pms.confirmRead(e.id)
            }
        }
    },
    Chat = {
        busy: !1,
        sendbusy: !1,
        sound: !0,
        room: !1,
        newmessage: new Audio("/assets/sounds/newmessage.mp3"),
        send: function() {
            if (1 == Chat.sendbusy) return !1;
            Chat.sendbusy = !0, $.ajax({
                url: "/ajx/",
                type: "post",
                dataType: "html",
                data: "action=chatSend&socketID=" + socket.socketID + "&room=" + Chat.room + "&msg=" + encodeURIComponent($.trim($("#chatTextarea").html())) + "&hash=" + user.hash,
                success: function(e) {
                    Chat.sendbusy = !1, $("#chatTextarea").empty(), Chat.resize()
                },
                error: function() {
                    Chat.sendbusy = !1, $.notification.error({
                        title: "Error",
                        message: "No connection to the server, please try again"
                    })
                }
            })
        },
        changeRoom: function(e) {
            Chat.busy = !0, $("#chatBody").empty(), $("#chatLog").addClass("busy"), $("#chatNewMessagesBtn").fadeOut(0), Chat.fix(), socket.id.send('{"action": "changeRoom", "params":{"room":"' + e + '"}}')
        },
        print: function(e) {
            if ($("#ignoreList .sidebarListItem[data-username=" + e.username + "]").length > 0 || $("#chatLog").hasClass("busy")) return !1;
            if (1 == Chat.busy) return !1;
            if ($(".msg[data-id=" + e.id + "]").length > 0) return !1;
            if (null != e.room && e.room != Chat.room) return !1;
            if ($("#chatBody").append('<div class="msg" data-id="' + e.id + '"><div class="username"><span class="user">' + e.username + '</span></div><div class="time">' + e.time + '</div><div class="text">' + e.msg + '</div><div class="reply"><span class="icon quote" onclick="Chat.easyMessage(\'' + e.username + "'); return false;\"></span></div></div>"), e.user_id > 0) {
                new Date;
                $(".msg[data-id=" + e.id + "]").prepend('<div class="avatar"><img src="/avatars/' + e.avatar + '" alt="' + e.username + '" /></div>'), $(".msg[data-id=" + e.id + "]").addClass("ava").addClass("arrow")
            }
            var s = e.msg,
                t = "<b rel='user'>" + user.name + "</b>";
            if (-1 != s.indexOf(t) && 2 != e.usergroup && ($(".msg[data-id=" + e.id + "]").addClass("addressed"), $(".msg[data-id=" + e.id + "]").find("b").addClass("me")), "chatContent" != $("#sidebar .tab.active").attr("data-id") && 1 != e.history && ("50" != $("#chatUnread").html() && $("#chatUnread").addClass("show").html(1 * $("#chatUnread").html() + 1), $(".msg[data-id=" + e.id + "]").addClass("new")), 1 == e.usergroup && $(".msg[data-id=" + e.id + "] .avatar").append('<div class="usergroup vip">VIP</div>'), 2 == e.usergroup && ($(".msg[data-id=" + e.id + "]").addClass("bot"), $(".msg[data-id=" + e.id + "] .username").html('<span class="bot">BOT</span> ' + $(".msg[data-id=" + e.id + "] .username").html())), 3 == e.usergroup && $(".msg[data-id=" + e.id + "] .avatar").append('<div class="usergroup mod">MOD</div>'), 4 == e.usergroup && $(".msg[data-id=" + e.id + "] .avatar").append('<div class="usergroup help">HELP</div>'), 5 == e.usergroup && $(".msg[data-id=" + e.id + "] .avatar").append('<div class="usergroup legend">LEGEND</div>'), 7 == e.usergroup && $(".msg[data-id=" + e.id + "] .avatar").append('<div class="usergroup admin">ADMIN</div>'), 2 != e.usergroup && $(".msg[data-id=" + e.id + "] .avatar").append('<div class="userlevel level' + e.level + '">' + e.level + "</div>"), e.user_id == user.id ? ($(".msg[data-id=" + e.id + "]").addClass("me"), $(".msg[data-id=" + e.id + "] .username span").addClass("binduser").attr("data-username", e.username)) : 2 != e.usergroup && $(".msg[data-id=" + e.id + "] .username span").addClass("binduser").attr("data-username", e.username), $(".msg[data-id=" + e.id + "]").prev().find(".username span.user").html() == $(".msg[data-id=" + e.id + "] .username span.user").html() && $(".msg[data-id=" + e.id + "]").addClass("glued"), 1 != e.history) {
                var i = $("#chatBody .msg").size();
                if (i > 50)
                    for (var a = 0; a < i - 50; a++) $("#chatBody .msg:first-child").remove(), $("#chatBody .msg:first-child").hasClass("glued") && $("#chatBody .msg:first-child").removeClass("glued")
            }
            if (1 != e.history && e.user_id == user.id && ($("#currentMessages").html(1 * $("#currentMessages").html() + 1), $("#overallMessages").html(1 * $("#overallMessages").html() + 1)), bindLinks(), $("#chatLog .mCSB_dragger").hasClass("mCSB_dragger_onDrag")) {
                var r = $("#chatLog .mCSB_dragger").height();
                parseInt($("#chatLog .mCSB_dragger").css("max-height"), 10) - parseInt($("#chatLog .mCSB_dragger").css("top"), 10) > 1.5 * r && 1 != e.history && $("#chatNewMessagesBtn").fadeIn(0)
            } else 1 != e.history && e.user_id != user.id ? Chat.scroll("bottom", 150, 100) : 1 != e.history && e.user_id == user.id ? Chat.scroll("bottom", 150, 100, 1) : Chat.scroll("bottom", 0, 0, e.history)
        },
        resize: function() {
            var e = window.innerHeight - $("#chatContent .chatForm").height() - 75;
            $("#chatLog").css("height", e + "px")
        },
        fix: function() {
            $("#chatLog").mCustomScrollbar("destroy"), $("#chatLog").mCustomScrollbar({
                scrollbarPosition: "outside",
                theme: "sidebar",
                scrollInertia: 1e3,
                callbacks: {
                    onTotalScroll: function() {
                        $("#chatNewMessagesBtn").fadeOut(200)
                    }
                }
            })
        },
        markRead: function() {
            setTimeout(function() {
                $("#chatLog .msg.new").removeClass("new")
            }, 2e3)
        },
        scroll: function(e, s, t, i) {
            setTimeout(function() {
                var a = $("#chatLog .mCSB_dragger").height();
                if (parseInt($("#chatLog .mCSB_dragger").css("max-height"), 10) - parseInt($("#chatLog .mCSB_dragger").css("top"), 10) > 1.5 * a && 1 != i) return $("#chatNewMessagesBtn").fadeIn(0), !1;
                $("#chatLog").mCustomScrollbar("scrollTo", e, {
                    scrollInertia: s,
                    timeout: t
                })
            }, 20)
        },
        easyMessage: function(e) {
            Chat.open(), $("#chatContent").is(":visible") || Sidebar.open("chatContent");
            var s = "user:" + e,
                t = $("#chatTextarea").html();
            if (-1 != t.indexOf(s)) return placeFocus("chatTextarea"), !1; - 1 != t.indexOf("/pm ") && (t = ""), -1 != t.indexOf("/tip ") && (t = ""), $("#chatTextarea").html("user:" + e + ",&nbsp;" + t), placeFocus("chatTextarea"), Chat.resize(), $(".tooltipster-base").remove()
        },
        easyPM: function(e) {
            $("#pm").popupShow({
                data: e
            }), $(".tooltipster-base").remove()
        },
        easyTip: function(e) {
            $("#tip").popupShow({
                data: e
            }), $(".tooltipster-base").remove()
        },
        easyBan: function(e) {
            $("#ban").popupShow({
                data: e
            }), $(".tooltipster-base").remove()
        },
        easyProfile: function(e) {
            $("#profile").popupShow({
                data: e
            })
        },
        open: function() {
            if ("chatContent" == $("#sidebar .sidebarNav .tab.active").attr("data-id")) return !1;
            $("#sidebar .tab[data-id=chatContent]").click()
        },
        friends: function(e, s) {
            if ("ignore" == s && !confirm("ru" == user.lang ? "Вы уверены, что хотите добавить " + e + " в игнор?" : "Are you sure you want to ignore " + e + "?")) return !1;
            $.ajax({
                url: "/ajx/",
                type: "post",
                dataType: "json",
                data: "action=friends" + s + "&username=" + e + "&socketID=" + socket.socketID + "&hash=" + user.hash,
                success: function(e) {
                    0 == e.result ? $.notification.error({
                        title: "Error",
                        message: e.msg
                    }) : 1 == e.result && $.notification.notice({
                        title: "Success",
                        message: e.msg
                    })
                },
                error: function() {
                    $.notification.error({
                        title: "Error",
                        message: "No connection to the server, please try again"
                    })
                }
            })
        }
    },
    Friends = {
        newrequest: new Audio("/assets/sounds/friendsrequest.mp3"),
        fix: function() {
            $("#friendsContent .sidebarListWrapper").mCustomScrollbar("destroy"), $("#friendsContent .sidebarListWrapper").mCustomScrollbar({
                scrollbarPosition: "outside",
                theme: "sidebar",
                scrollInertia: 1e3
            })
        },
        resize: function() {
            var e = window.innerHeight - 74;
            $("#friendsContent .sidebarListWrapper").css("height", e + "px")
        }
    },
    Pms = {
        newmessage: new Audio("/assets/sounds/friendsrequest.mp3"),
        companionID: !1,
        companionUsername: !1,
        sendbusy: !1,
        openDialogue: function(e) {
            if (!$("#pmsList .sidebarListItem[data-id=" + e + "]").length) return !1;
            $("#dialogueBody").html(""), Pms.companionID = !1, Pms.companionUsername = !1, $.ajax({
                url: "/ajx/",
                type: "POST",
                dataType: "html",
                async: !0,
                data: {
                    action: "openDialogue",
                    id: e,
                    hash: user.hash
                },
                success: function(s) {
                    if (1 == (s = JSON.parse(s)).result) {
                        $("#dialogueBody").html("");
                        var t = $("#pmsList .sidebarListItem[data-id=" + e + "]");
                        t.hasClass("new") && (t.removeClass("new"), t.find(".unread").length > 0 && ($("#pmsUnread").text(1 * $("#pmsUnread").text() - 1 * t.find(".unread").html()), 1 * $("#pmsUnread").text() < 1 && $("#pmsUnread").text("0").removeClass("show"), t.find(".unread").remove())), Sidebar.open("dialogueContent"), Pms.companionID = s.user_id, Pms.companionUsername = s.username, $("#dialogueContent .sidebarTitle").html('<b class="binduser" data-username="' + s.username + '">' + s.username + "</b>"), actions[s.action](s.params), Pms.markRead(e)
                    }
                },
                error: function() {
                    $.notification.error({
                        title: "Error",
                        message: "No connection to the server, please try again"
                    })
                }
            })
        },
        deleteMessage: function(e) {
            $.ajax({
                url: "/ajx/",
                type: "post",
                dataType: "json",
                data: "action=deletePM&id=" + e + "&socketID=" + socket.socketID + "&hash=" + user.hash,
                success: function(e) {
                    0 == e.result ? $.notification.error({
                        title: "Error",
                        message: e.msg
                    }) : 1 == e.result && $.notification.notice({
                        title: "Success",
                        message: e.msg
                    })
                },
                error: function() {
                    $.notification.error({
                        title: "Error",
                        message: "No connection to the server, please try again"
                    })
                }
            })
        },
        fix: function() {
            $("#pmsList").mCustomScrollbar("destroy"), $("#pmsList").mCustomScrollbar({
                scrollbarPosition: "outside",
                theme: "sidebar",
                scrollInertia: 1e3
            })
        },
        resize: function() {
            var e = window.innerHeight - 74;
            $("#pmsList").css("height", e + "px")
        },
        dialogueFix: function() {
            $("#dialogueLog").mCustomScrollbar("destroy"), $("#dialogueLog").mCustomScrollbar({
                scrollbarPosition: "outside",
                theme: "sidebar",
                scrollInertia: 1e3,
                callbacks: {
                    onTotalScroll: function() {
                        $("#dialogueNewMessagesBtn").fadeOut(200)
                    }
                }
            })
        },
        dialogueResize: function() {
            var e = window.innerHeight - $("#dialogueContent .chatForm").height() - 75;
            $("#dialogueLog").css("height", e + "px")
        },
        dialogueScroll: function(e, s, t, i) {
            setTimeout(function() {
                var a = $("#dialogueLog .mCSB_dragger").height();
                if (parseInt($("#dialogueLog .mCSB_dragger").css("max-height"), 10) - parseInt($("#dialogueLog .mCSB_dragger").css("top"), 10) > 1.5 * a && 1 != i) return $("#dialogueNewMessagesBtn").fadeIn(0), !1;
                $("#dialogueLog").mCustomScrollbar("scrollTo", e, {
                    scrollInertia: s,
                    timeout: t
                })
            }, 20)
        },
        send: function() {
            if (1 == Pms.sendbusy) return !1;
            Pms.sendbusy = !0, $.ajax({
                url: "/ajx/",
                type: "post",
                dataType: "html",
                data: {
                    action: "pmSubmit",
                    username: Pms.companionUsername,
                    message: $.trim($("#dialogueTextarea").html()),
                    hash: user.hash
                },
                success: function(e) {
                    Pms.sendbusy = !1, 1 == (e = JSON.parse(e)).result ? ($("#dialogueTextarea").empty(), Pms.dialogueResize()) : $.notification.error({
                        title: "Error",
                        message: e.msg
                    })
                },
                error: function() {
                    Pms.sendbusy = !1, $.notification.error({
                        title: "Error",
                        message: "No connection to the server, please try again"
                    })
                }
            })
        },
        delete: function(e) {
            var s = $("#pmsList .sidebarListItem[data-id=" + e + "]"),
                t = $("#pmsList .sidebarListItem[data-id=" + e + "]").find(".user").html();
            confirm("ru" == user.lang ? "Вы уверены, что хотите удалить диалог с " + t + "?" : "Are you sure to delete conversation with " + t + "?") && s.length > 0 && (s.remove(), s.find(".unread").length > 0 && ($("#pmsUnread").text(1 * $("#pmsUnread").text() - 1 * s.find(".unread").html()), 1 * $("#pmsUnread").text() < 1 && $("#pmsUnread").text("0").removeClass("show")), $("#pmsList .counter").html($("#pmsList .sidebarListItem").length), $("#pmsList .sidebarListItem").length || ($("#pmsList").removeClass("show"), $("#pmsList .list").html('<div class="sidebarListItemNothing">' + ("ru" == user.lang ? "Диалоги не найдены" : "No conversations found") + "</div>")), $.ajax({
                url: "/ajx/",
                type: "post",
                dataType: "html",
                data: {
                    action: "deleteDialogue",
                    id: e,
                    hash: user.hash
                }
            }))
        },
        markRead: function(e) {
            setTimeout(function() {
                e == Pms.companionID && $("#dialogueContent").is(":visible") && $("#dialogueLog .msg.new").removeClass("new")
            }, 2e3)
        },
        confirmRead: function(e) {
            $.ajax({
                url: "/ajx/",
                type: "post",
                dataType: "html",
                data: {
                    action: "confirmReadPM",
                    id: e,
                    hash: user.hash
                }
            })
        }
    };