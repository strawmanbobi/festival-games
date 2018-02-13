/**
 * Created by Strawmanbobi
 * 2014-10-23
 */

function createWeiXinShareImageURL(_iconImgPath) {
    var currentHost = window.location.host;
    return "http://" + currentHost + _iconImgPath;
}

document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
    WeixinJSBridge.call('hideToolbar');

    WeixinJSBridge.on('menu:share:appmessage', function(argv) {
        WeixinJSBridge.invoke('sendAppMessage', {
            "img_url": g_imgURL,
            "link": g_link,
            "desc": g_desc,
            "title": g_title
        }, function(res) {
        })
    });

    WeixinJSBridge.on('menu:share:timeline', function(argv) {
        WeixinJSBridge.invoke('shareTimeline', {
            "img_url": g_imgURL,
            "img_width": "128",
            "img_height": "128",
            "link": g_link,
            "desc": g_desc,
            "title": g_title + " - " + g_desc
        }, function(res) {
        });
    });
}, false);