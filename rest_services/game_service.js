/**
 * Created by dummy team
 * 2018-01-28
 */

var gameLogic = require('../work_units/game_logic');
var constants = require('../poem/configuration/constants.js');
var logger = require('../poem/logging/logger4js.js').helper;

var formidable = require('formidable');
var fs = require('fs');

var stringUtils = require("../poem/utils/string_utils.js");

var ErrorCode = require('../constants/error_code');
var errorCode = new ErrorCode();

var GameResponse = require('../responses/game_response.js');
var ServiceResponse = require('../responses/service_response.js');

/*
 * function :   create bubble game with customized picture
 * parameter :  game body parameters
 * return :     none
 */
exports.createGame = function (req, res) {
    var form = new formidable.IncomingForm({
        uploadDir: FILE_TEMP_PATH
    });

    var gameObj;
    var useDefaultBG;
    var contentType;
    var playerID;
    var fileName;
    var filePath;

    /*
    form.on('file', function(field, file) {
        // rename the incoming file to the file's name
        logger.info("on file in formidable, change file name : " + file.name + " to random");
        fileName = stringUtils.randomChar(16);
        filePath = form.uploadDir + "/" + fileName;
        fs.rename(file.path, filePath);
    }).on('error', function(err) {
        logger.error("formidable parse form error : " + err);
    });
    */

    form.parse(req, function(err, fields, files) {
        if(err) {
            logger.error("failed to submit remote index form");
            res.redirect("/error.html");
        } else {
            gameObj = fields;
            playerID = gameObj.player_id;
            useDefaultBG = gameObj.use_default_bg;
            filePath = files.my_picture.path;
            var find = "\\\\";
            var re = new RegExp(find, "g");
            var unixFilePath = filePath.replace(re, "/");
            fileName = unixFilePath.substring(unixFilePath.lastIndexOf("/") + 1);
            // set MIME to octet-stream as there might not be any contentType passed from the front-end form
            contentType = files.my_picture.type || "application/octet-stream";
            logger.info("create game form submitted successfully : " + playerID + ", " + filePath + ", " + fileName + ", " + contentType);
            gameLogic.createGameWorkUnit(fileName, filePath, playerID, useDefaultBG, contentType, function(createGameErr) {
                if (errorCode.SUCCESS.code === createGameErr.code) {
                    var url = "/single_dogs?player_id="+playerID+"&game_id="+fileName;
                    logger.info("create game successfully, redirect to " + url);
                    res.redirect(url);
                    res.end();
                } else {
                    res.redirect("/error.html");
                    res.end();
                }
            });
        }
    });
};

/*
 * function :   count on the visit of game
 * parameter :  gameID
 * return :     service response
 */
exports.visitGame = function (req, res) {
    var gameID = req.body.game_id;

    var gameResponse = new GameResponse();
    gameLogic.visitGameWorkUnit(gameID, function(getGameErr, game) {
        gameResponse.status = getGameErr;
        gameResponse.entity = game;
        res.send(gameResponse);
        res.end();
    });
};
