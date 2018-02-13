/**
 * Created by dummy team
 * 2018-02-11
 */

fs = require('fs');
var OSS = require('../poem/data_set/ali_oss.js');

var gameDao = require('../model/game_dao.js');

var Enums = require('../constants/enums.js');
var ErrorCode = require('../constants/error_code.js');
var logger = require('../poem/logging/logger4js').helper;

var enums = new Enums();
var errorCode = new ErrorCode();

var NY2018_BUCKET_NAME = "ny2018-game";

exports.createGameWorkUnit = function(fileName, filePath, playerID, useDefaultBG, contentType, callback) {
    // upload file to AliOSS
    var aliOss = new OSS(OSS_HOST, NY2018_BUCKET_NAME, OSS_APP_ID, OSS_APP_SECRET);

    if (1 === parseInt(useDefaultBG)) {
        logger.info("use default bg");
        var game = {
            playerID: playerID,
            gameID: fileName,
            useDefaultBG: 1,
            visit: 0
        };
        gameDao.createGame(game, function(createGameErr) {
            callback(createGameErr);
        });
    } else {
        // read picture data
        fs.readFile(filePath, function(readFileErr, fileData) {
            if (readFileErr) {
                logger.error("read picture file error : " + readFileErr);
                callback(errorCode.FAILED, null);
            } else {
                // upload picture to aliOSS
                logger.info("read picture file successfully, file size = " + fileData.length);
                aliOss.saveObjectFromBinary(fileName, fileData, contentType,
                    function (createObjectErr, objectID) {
                        logger.info("create object to aliOSS result = " + JSON.stringify(createObjectErr));
                        if (errorCode.SUCCESS.code === createObjectErr) {
                            // save game to db
                            var game = {
                                playerID: playerID,
                                gameID: fileName,
                                useDefaultBG: 0,
                                visit: 0
                            };
                            gameDao.createGame(game, function(createGameErr) {
                                callback(createGameErr);
                            });
                        } else {
                            callback(errorCode.FAILED);
                        }
                    });
            }
        });
    }
};

exports.getGameWorkUnit = function(gameID, callback) {
    var conditions = {
        gameID: gameID
    };

    gameDao.getGames(conditions, function(getGamesErr, games) {
        if (errorCode.SUCCESS.code === getGamesErr.code && null != games && games.length > 0) {
            callback(errorCode.SUCCESS, games[0]);
        } else {
            callback(errorCode.FAILED, null);
        }
    });
};

exports.visitGameWorkUnit = function(gameID, callback) {
    var conditions = {
        gameID: gameID
    };

    gameDao.getGames(conditions, function(getGamesErr, games) {
        if (errorCode.SUCCESS.code === getGamesErr.code && null != games && games.length > 0) {
            var visitedGame = games[0];
            visitedGame.visit = visitedGame.visit + randomNum(1, 5);
            gameDao.updateGame(conditions, visitedGame, function(updateGameErr, updatedGame) {
                callback(errorCode.SUCCESS, updatedGame);
            })
        } else {
            callback(errorCode.FAILED, null);
        }
    });
};

function randomNum(minNum, maxNum) {
    switch(arguments.length){
        case 1:
            return parseInt(Math.random() * minNum + 1, 10);
            break;
        case 2:
            return parseInt(Math.random() * (maxNum - minNum + 1) + minNum, 10);
            break;
        default:
            return 0;
            break;
    }
}