/*
 * Created by Strawmanbobi
 * 2015-03-02
 */

function randomChar(l) {
    var x = "0123456789qwertyuioplkjhgfdsazxcvbnm";
    var tmp = "";
    for(var i = 0;i < l; i++)  {
        tmp += x.charAt(Math.ceil(Math.random()*100000000)%x.length);
    }
    return  tmp;
}

function randomNumber(l) {
    var x = "0123456789";
    var tmp = "";
    for(var i = 0;i < l; i++)  {
        tmp += x.charAt(Math.ceil(Math.random()*100000000)%x.length);
    }
    return  tmp;
}