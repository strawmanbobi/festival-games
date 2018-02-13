/**
 * Created by strawmanbobi
 * 2018-02-10
 */

var useDefaultBG = false;

function createGame() {
    var playerID = localStorage.getItem("player_id");
    detectPicture();

    if (null === playerID || "" === playerID) {
        // generate a new player ID and save to local storage
        playerID = randomChar(32);
        if (null !== playerID) {
            localStorage.setItem("player_id", playerID);
        }
    }

    var form = $("#create_game_form");
    form.attr("action", "/api/game/create_game");

    // set multipart-form parameters
    $("#player_id").val(playerID);
    if (useDefaultBG) {
        $("#use_default_bg").val(1);
    } else {
        $("#use_default_bg").val(0);
    }

    form.submit();
}

function detectPicture() {
    if(typeof FileReader !== "undefined") {
        var file = document.getElementById("my_picture").files[0];
        if (undefined === file || null === file) {
            useDefaultBG = true;
        } else {
            if (-1 === (file.type).indexOf("image/")) {
                useDefaultBG = true;
            }
        }
    } else {
        var fileName = document.getElementById("my_picture").value;
        if (null === fileName || "" === fileName) {
            useDefaultBG = true;
        } else {
            var suffixIndex = fileName.lastIndexOf(".");
            var suffix = fileName.substring(suffixIndex + 1).toUpperCase();
            if(suffix !== "BMP" && suffix !== "JPG" && suffix !== "JPEG" && suffix !== "PNG" && suffix !== "GIF") {
                useDefaultBG = true;
            }
        }
    }
    return true;
}

$(function() {
    $("#my_picture").fileinput({showUpload: false, previewFileType: "image"});
});