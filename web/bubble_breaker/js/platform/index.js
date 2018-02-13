/**
 * Created by strawmanbobi
 * 2018-01-28
 */

// game board related
var gameBoard;
var winWidth, winHeight;
var gameWidth, gameHeight;

// customized material
var bgImgPath;

// window.onbeforeunload = function () {
//     return 'Are you sure to leave?';
// };

$(document).ready(function () {
    bgImgPath = 'http://ny2018-game.oss-cn-hangzhou.aliyuncs.com/' + getParameter('game_id');
    // bgImgPath = 'http://brucewar.qiniudn.com/sj-marathon2.jpg';
    initGame();
});

function initGame() {
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