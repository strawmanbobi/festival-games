/**
 * Created by strawmanbobi on 14-06-29.
 */

var imageDisplayWidth = null;
var imageDisplayHeight = null;
var signTop = null;
var signLeft = null;
var mpID = null;
var myID = null;
var playerName = null;
var ownerGame = 0;
var lc = null;

// WeiXin share associated variables
var g_imgURL = "";
var g_link = location.href;
var g_title = "";
var g_desc = "";
var g_hideOption = false;

var mpInfoGot = false;

var textContent = "";
var textSeries = null;
var textLooperID = null;
var currentText = 0;

var newDidi = 0;
var jokingShown = false;
var loadSendconTime = false;

$(document).ready(function() {
    var UA = "";
    if('undefined' != typeof navigator && null != navigator) {
        UA = navigator.userAgent;
    }
    if(UA.indexOf("MicroMessenger") < 0) {
        window.location = "../../not_weixin_page.html";
        return;
    }
    var icon = "";
    var title = "";
    var description = "";
    icon = createWeiXinShareImageURL("/web/games/money_pack/res/images/didi_icon_20141124.png");
    description = "";
    newDidi = 0;

    // for new weixin jsAPI
    g_imgURL = icon;
    g_link = location.href;
    g_title = title;
    g_desc = description;
    g_hideOption = false;

    myID = localStorage.getItem("mp_my_id");
    if(null == myID) {
        myID = randomChar(16);
        localStorage.setItem("mp_my_id", myID);
    }
    playerName = myID;

    mpID = getParameter("mp_id");
    lc = getParameter("lc");
    // getMPInfo();
});

$(document).on("mobileinit", function() {
    $.mobile.loader.prototype.options.disabled = true;
    $.mobile.loading().hide();
});

function getMPInfo() {
    if(mpInfoGot == true) {
        return;
    }
    mpInfoGot = true;
    $.ajax({
        url: "/web_games-ii/money_pack/get_money_pack?money_pack_id=" + mpID,
        type: "GET",
        timeout: 20000,
        success: function (data) {
            if(data) {
                if(null == myID || myID != data.entity.owner_id) {
                    ownerGame = 0;
                    textContent = data.entity.text_content;
                    uploadRecord(null);
                } else {
                    ownerGame = 1;
                    textContent = data.entity.text_content;
                }
            } else {
                ownerGame = 0;
                textContent = "就知道你会抢！这下被耍了吧。";
                uploadRecord(null);
            }
            setTimeout(function() {
                showShakeIcon();
            }, 1500);
        },
        error: function () {
            ownerGame = 0;
            textContent = "就知道你会抢！这下被耍了吧。";
            uploadRecord(null);
            setTimeout(function() {
                showShakeIcon();
            }, 1500);
        }
    });
}

function showShakeIcon() {
    var shakeSign = document.createElement("img");
    shakeSign.onload = function() {
        if(true == loadSendconTime) {
            return;
        }
        var primaryBg = document.getElementById("prim_bg");
        var shakeWidth = 160;
        var shakeHeight = 160;
        imageDisplayWidth = primaryBg.width;
        imageDisplayHeight = primaryBg.height;
        signTop = Math.floor((imageDisplayHeight - shakeHeight) / 2) - 80;
        signLeft = Math.floor((imageDisplayWidth - shakeWidth) / 2);

        shakeSign.id = "shake_sign";
        shakeSign.style.position = "absolute";
        shakeSign.style.top = signTop + "px";
        shakeSign.style.left = signLeft + "px";
        shakeSign.style.width = "160px";
        shakeSign.style.heigth = "160px";

        var textDiv = document.createElement("div");
        textDiv.id = "sign_text";
        textDiv.style.position = "absolute";
        var absoluteLeft = Math.floor(imageDisplayWidth / 6);
        var absoluteTop = signTop + 160;
        var width = Math.floor(imageDisplayWidth / 6 * 4);
        var height = Math.floor(imageDisplayHeight / 5);
        textDiv.style.top = parseInt(absoluteTop) + "px";
        textDiv.style.left = parseInt(absoluteLeft) + "px";
        textDiv.style.fontSize = "18px";
        textDiv.style.color = "#EEEEEE";
        textDiv.style.fontFamily = "微软雅黑, 黑体, Arial";
        textDiv.style.textAlign = "center";
        textDiv.style.width = width + "px";
        textDiv.style.height = height + "px";
        textDiv.innerHTML = "摇一摇领取朋友圈红包";
        document.body.appendChild(shakeSign);
        document.body.appendChild(textDiv);

        hideLoading();
        if(window.DeviceMotionEvent) {
            var speed = 20;
            var i = 0;
            var x = y = z = lastX = lastY = lastZ = 0;
            window.addEventListener('devicemotion', function(){
                var acceleration = event.accelerationIncludingGravity;
                x = acceleration.x;
                y = acceleration.y;
                if(Math.abs(x - lastX) > speed || Math.abs(y - lastY) > speed) {
                    i += parseInt(1);
                    if(i >= 2) {
                        if(false == jokingShown) {
                            var weixinMP3 = document.getElementById("weixinmp3");
                            weixinMP3.play();
                            prepareJoking();
                            jokingShown = true;
                        }
                    }
                }
                lastX = x;
                lastY = y;
            }, false);
        } else {
        }
        //
        //var weixinMP3 = document.getElementById("weixinmp3");
        //weixinMP3.play();
        //prepareJoking();
        //jokingShown = true;
    };
    shakeSign.src = "./res/images/shake_icon.png";
}

function prepareJoking() {
    document.getElementById("sign_text").innerHTML = "";
    document.getElementById("loading").innerHTML = "目前抢红包的人数较多，请稍作等待...";
    showLoading();
    setTimeout(function() {
        hideLoading();
        showJoking();
    }, 1500);
}

function showJoking() {
    var shakeSign = document.getElementById("shake_sign");
    var signText = document.getElementById("sign_text");
    loadSendconTime = true;
    shakeSign.src = "./res/images/dog.jpg";
    signText.innerHTML = textContent;

    var playedCountTable = document.getElementById("who_played");
    playedCountTable.style.display = "block";
    countPlayRecords();
    document.getElementById("img_who_played").style.display = "block";
    showButton();
    setTimeout(function() {
        // $("#hint_dialog").modal();
    }, 1500);
}

function showButton() {
    var createButtonPanel = document.getElementById("create_button_panel");
    var createButton = document.getElementById("create_button");
    createButton.innerHTML = "被耍了吧，点这里创建一个耍你朋友去~";
    createButtonPanel.style.display = "block";

    var buttons = document.getElementById("buttons");
    buttons.style.top = (signTop + Math.floor(imageDisplayHeight / 5) + 140) + "px";
}

function createRoutes() {
    gotoCreate();
}

function share(show) {
    var shareLayer = document.getElementById("share_layer");
    if(1 == show) {
        shareLayer.style.display = "block";
    } else {
        shareLayer.style.display = "none";
    }
}

function showLoading() {
    var loadingLayer = document.getElementById("loading_layer");
    loadingLayer.style.display = "block";
}

function hideLoading() {
    var loadingLayer = document.getElementById("loading_layer");
    loadingLayer.style.display = "none";
}

function closeAdv() {
    $("#adv_dialog").modal('hide');
    var jokingText = document.getElementById("joking_text");
    jokingText.innerHTML = textContent;

    var whoPlayedImage = document.getElementById("img_who_played");
    var playedCountTable = document.getElementById("who_played");
    whoPlayedImage.style.display = "block";
    playedCountTable.style.display = "block";
    hideLoading();
}

function gotoCreate() {
    var jumpURL = "./create_mp.html";
    if(undefined != typeof lc && null != lc && "" != lc) {
        jumpURL += "?lc=" + lc;
    }
    window.location = jumpURL;
}

function uploadRecord(callback) {
    $.ajax({
        url: "/web_games-ii/play_record/create_play_record",
        type: "POST",
        data: { money_pack_id: mpID, player_id: myID, player_name: playerName },
        timeout: 20000,
        success: function (data) {
            if(callback) {
                callback();
            }
        },
        error: function () {
            if(callback) {
                callback();
            }
        }
    });
}

function countPlayRecords() {
    $.ajax({
        url: "/web_games-ii/play_record/count_play_record?money_pack_id="+mpID,
        type: "GET",
        timeout: 20000,
        success: function (data) {
            if(null != data) {
                fillCountRecords(data.entity);
            }
        },
        error: function () {
            fillCountRecords(0);
        }
    });
}

function fillRecords(records) {
    var whoPlayed = document.getElementById("who_played");
    var listContent = "";
    whoPlayed.innerHTML = "";
    for(var i = 0; i < records.length; i++) {
        listContent += "<tr>" +
            "<td style='width: 20%; text-align: center;'><img src='./res/images/who_is_joked.png' style='width: 40px; height: 40px;'></td>" +
            "<td style='width: 80%; text-align: left; font-family: 黑体, 微软雅黑, Arial'>" +
            records[i].player_name +
            "<br>"+
            "我是秀逗，我被耍了，Yeah~" +
            "</td>" +
            "</tr>";
    }
    whoPlayed.innerHTML = listContent;
}

function fillCountRecords(count) {
    var whoPlayed = document.getElementById("who_played");
    var listContent = "";
    whoPlayed.innerHTML = "";
    var innerText = count + "只";
    if(0 == ownerGame) {
        innerText += "<br>你就是其中之一！";
    }
    listContent = "<tr><td style='width:100%; font-size: 20px; color: #FF2200; text-align: center;'>" +
        innerText +
        "</td></tr>";
    whoPlayed.innerHTML = listContent;
}