/**
 * Created by strawmanbobi on 2014-11-10.
 */

(function () {
    var d = document;
    var container = document.getElementById('gameContainer');
    var winWidth, winHeight;
    winWidth = document.documentElement.clientWidth;
    winHeight = document.documentElement.clientHeight;
    container.innerHTML = '<canvas id="gameCanvas" width="' + winWidth + '" height="' + winHeight + '"></canvas>';
    if (!d.createElement('canvas').getContext) {
        var s = d.createElement('div');
        s.innerHTML = '<h2>您的浏览器不支持HTML5 !</h2>' +
        '<p>Google Chrome is a browser that combines a minimal design with sophisticated technology to make the web faster, safer, and easier.Click the logo to download.</p>' +
        '<a href="http://www.google.com/chrome" target="_blank">' +
        '<img src="http://www.google.com/intl/zh-CN/chrome/assets/common/images/chrome_logo_2x.png" border="0"/></a>';
        var p = d.getElementById(c.tag).parentNode;
        p.style.background = 'none';
        p.style.border = 'none';
        p.insertBefore(s);

        d.body.style.background = '#ffffff';
        return;
    }
    window.addEventListener('DOMContentLoaded', function () {
        if(0 == gameGender) {
            g_imgURL = createWeiXinShareImageURL("/web/games/lighting_stick/res/wx_b.png");
        } else {
            g_imgURL = createWeiXinShareImageURL("/web/games/lighting_stick/res/wx_g.png");
        }
        ccLoad();
    });
})();

function ccLoad() {
    cc.game.onStart = function() {
        // cc.view.adjustViewPort(true);
        // var framesize = cc.view.getFrameSize();
        // cc.view.resizeWithBrowserSize(true);
        //load resources
        cc.LoaderScene.preload(g_resources, function () {
            var LSScene = cc.Scene.extend({
                onEnter: function () {
                    this._super();
                    var layer = new GameLayer();
                    layer.init();
                    this.addChild(layer);
                }
            });
            cc.director.runScene(new LSScene());
        }, this);
    };
    cc.game.run("gameCanvas");
}
