/**
 * Created by the-engine-team
 * 2017-10-18
 */

var db = require('../database/msession');

// local inclusion
var logger = require('../poem/logging/logger4js').helper;

var ErrorCode = require('../constants/error_code');
var errorCode = new ErrorCode();

var dateUtils = require('../poem/utils/date_utils.js');

exports.createGame = function (game, callback) {
    db.collection('ny2018_game', function (err, collection) {
        if (!err) {
            game.updateTime = dateUtils.formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss');
            collection.insert(game, function (err, docs) {
                if (!err) {
                    callback(errorCode.SUCCESS);
                } else {
                    logger.error('create game ' + game.gameID + ', failed : ' + err);
                    callback(errorCode.FAILED);
                }
            });
        } else {
            logger.error('create game failed : ' + err);
            callback(errorCode.FAILED);
        }
    });
};

exports.getGames = function (conditions, callback) {
    db.collection('ny2018_game', function (err, collection) {
        if (!err) {
            collection.find(conditions).toArray(function (err, results) {
                if (!err) {
                    callback(errorCode.SUCCESS, results);
                } else {
                    logger.error('get games error : ' + err);
                    callback(errorCode.FAILED, null);
                }
            });
        } else {
            logger.error('get collection game failed : ' + err);
            callback(errorCode.FAILED, null);
        }
    });
};

exports.updateGame = function (conditions, newGame, callback) {
    db.collection('ny2018_game', function (err, collection) {
        if (!err) {
            collection.update(conditions, {
                $set: {
                    visit: newGame.visit
                }
            }, function (err, result) {
                if (!err) {
                    callback(errorCode.SUCCESS);
                } else {
                    logger.error('update game ' + newGame.gameID + ' failed: ' + err);
                    callback(errorCode.FAILED);
                }
            });
        } else {
            logger.error('get collection game failed : ' + err);
            callback(errorCode.FAILED);
        }
    });
};