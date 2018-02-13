/**
 * Created by strawmanbobi on 14-06-29.
 */

var myID = null;
var moneyPackID = null;
var lc = null;

var g_imgURL = "";
var g_link = "";
var g_title = "";
var g_desc = "";
var g_hideOption = true;

var g_TextContent = null;

$(document).ready(function() {
    var UA = "";
    if('undefined' != typeof navigator && null != navigator) {
        UA = navigator.userAgent;
    }
    if(UA.indexOf("MicroMessenger") < 0) {
        window.location = "./not_weixin_page.html";
        return;
    }
    myID = localStorage.getItem("mp_my_id");
    if(null == myID) {
        myID = randomChar(16);
        localStorage.setItem("mp_my_id", myID);
    }
    lc = getParameter("lc");
    var lang = document.getElementById("lg");
    if(undefined == typeof lc || null == lc || "" == lc) {
        g_TextContent = ["",
            "骗你是因为心里还有你，祝福除了红包，还能用其它方式表达，新年快乐！",
            "约吗约吗？",
            "逗B，我骗你呢！",
            "春节你抢这么多红包，节操还在吗？",
            "你是我的小呀小秀逗，怎么骗你都不嫌多！"];
        lang.innerHTML = "请为您可怜的朋友留一祝福吧：";
    }
    for(var i = 1; i <= 5; i++) {
        var btn = document.getElementById("btn_" + i);
        btn.innerHTML = g_TextContent[i];
    }
});

$(document).on("mobileinit", function() {
    $.mobile.loader.prototype.options.disabled = true;
    $.mobile.loading().hide();
});

function createMP(index) {
    var textContent;
    if(0 == index) {
        textContent = $("#text_content").val();
        if(null == textContent || 0 == textContent.length) {
            return;
        }
        textContent = cleanString(textContent);
        if(textContent.length > 32) {
            $("#content_too_long_dialog").modal();
            return;
        }
        $("#text_content").val(textContent);
    } else {
        textContent = g_TextContent[index];
    }

    $.ajax({
        url: "/web_games/money_pack/create_money_pack",
        type: "POST",
        data: {owner_id : myID, text_content :textContent },
        timeout: 20000,
        success: function (data) {
            if(data) {
                console.log("newly created mp id = " + data.entity._id);
                moneyPackID = data.entity._id;
                $("#thanks_dialog").modal();
            } else {
                $("#failure_hint_dialog").modal();
            }
        },
        error: function (data) {
            $("#failure_hint_dialog").modal();
        }
    });
}

function gotoMP() {
    if(null == moneyPackID) {
        $("#failure_hint_dialog").modal();
    } else {
        var jumpURL = "./show_mp.html?mp_id=" + moneyPackID;
        if(undefined != typeof lc && null != lc && "" != lc) {
            jumpURL += "&lc=" + lc;
        }
        window.location = jumpURL;
    }
}