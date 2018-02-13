/**
 * Created by strawmanbobi
 * 2018-01-28
 */

// game board related
var gameBoard;
var winWidth, winHeight;
var gameWidth, gameHeight;

// customized material
var bgImgPath = null;
var visited = null;
var useDefaultBG = null;
var word = "";
var shared = 0;

var words = [
    "今年情人节，单身狗们出大事了",
    "情人节撞上狗年，生存还是毁灭？",
    "好好的情人节，你皮这一下好玩嘛？",
    "单身狗翻身做主人的秘诀是…"
];

$(document).ready(function () {
    // compare playerID
    var playerIDURL = getParameter('player_id');
    var playerID = localStorage.getItem("player_id");
    if (null === playerID || "" === playerID) {
        // generate a new player ID and save to local storage
        playerID = randomChar(32);
        if (null !== playerID) {
            localStorage.setItem("player_id", playerID);
        }
    }
    shared = localStorage.getItem("shared");
    if (playerID === playerIDURL) {
        if (null === shared || "" === shared || "0" === shared) {
            showShare(1);
            localStorage.setItem("shared", "1");
        }
    }

    initGame();
    getGameInfo();
});

function getGameInfo() {
    word = words[randomNum(0, 3)];
    word += "\n\n同时消掉更多连在一起的狗子, 分数会更高";
    var gameID = getParameter('game_id');
    if (null === gameID || "" === gameID) {
        bgImgPath = "./res/images/bg_default.jpg";
    } else {
        $.ajax({
            url: '/api/game/visit_game',
            type: 'POST',
            dataType: 'json',
            data: {
                game_id: gameID
            },
            timeout: 20000,
            success: function (response) {
                if (response.status.code === 0) {
                    var game = response.entity;
                    visited = game.visit;
                    useDefaultBG = game.useDefaultBG;
                    if (0 === parseInt(useDefaultBG)) {
                        bgImgPath = 'http://ny2018-game.oss-cn-hangzhou.aliyuncs.com/' + gameID;
                        word += "\n\n达到1000分之后会有好事情发生"
                    } else {
                        bgImgPath = "./res/images/bg_default.jpg";
                    }
                } else {
                    bgImgPath = "./res/images/bg_default.jpg";
                }
            },
            error: function () {
                bgImgPath = "./res/images/bg_default.jpg";
            }
        });
    }
}

function initGame() {
    // init game
    var d = document;
    var container = document.getElementById('gameContainer');
    gameHeight = winHeight = document.documentElement.clientHeight;
    winWidth = document.documentElement.clientWidth;
    if (winWidth > 720) {
        gameWidth = 720;
    } else {
        gameWidth = winWidth;
    }

    container.innerHTML = '<canvas id="gameCanvas" width="' + gameWidth + '" height="' + gameHeight + '"></canvas>';
    if (!d.createElement('canvas').getContext) {
        var s = d.createElement('div');
        s.innerHTML = '<h2>Your browser does not support HTML5 !</h2>' +
            '<p>Google Chrome is a browser that combines a minimal design with sophisticated technology ' +
            'to make the web faster, safer, and easier.Click the logo to download.</p>' +
            '<a href="http://www.google.com/chrome" target="_blank">' +
            '<img src="http://www.google.com/intl/zh-CN/chrome/assets/common/images/chrome_logo_2x.png" ' +
            'border="0"/></a>';
        var p = d.getElementById(c.tag).parentNode;
        p.style.background = 'none';
        p.style.border = 'none';
        p.insertBefore(s, null);

        d.body.style.background = '#000000';
        return;
    }
    window.addEventListener('DOMContentLoaded', function () {
        ccLoad();
    });
}

function ccLoad() {
    cc.renderMode = 1;
    cc.game.onStart = function () {
        //load resources
        cc.LoaderScene.preload(resources, function () {
            var bbScene = cc.Scene.extend({
                onEnter: function () {
                    this._super();
                    gameBoard = new GameLayer();
                    gameBoard.init();
                    this.addChild(gameBoard);
                }
            });
            cc.director.runScene(new bbScene());
        }, this);
    };
    cc.game.run('gameCanvas');
}

function showResult() {
    if (winGame && 0 === useDefaultBG) {
        $("#result_pic").attr("src", bgImgPath);
        $("#pic_download").attr("href", bgImgPath);
        $("#pic_download").attr("download", bgImgPath + ".jpg");
        $("#result_text").html("情侣狗已死光，单身狗万岁！");
    } else {
        $("#pic_download").attr("href", bgImgPath);
        $("#pic_download").attr("download", bgImgPath + ".jpg");
        $("#result_pic").attr("src", "./res/images/single_dog.png");
        $("#result_text").html("分数不够哦<br>狗年大吉, 万事如意<br>过年多吃狗粮");
    }
    $("#result_layer").show();
}

function showShare(show) {
    if (1 === show) {
        $("#share_layer").show();
    } else {
        $("#share_layer").hide();
    }
}

function gotoCreate() {
    window.location = "./create.html";
}

function replay() {
    $("#result_layer").hide();
    gameBoard.resetGame();
}