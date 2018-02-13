/**
 * Created by dummy team
 * 2017-09-01
 */

require('../poem/configuration/constants');
var Enums = require('../constants/enums');
var enums = new Enums();

exports.setupEnvironment = function () {
    var env = process.env.NODE_ENV || 'development';
    ENV = env;
    if (undefined === typeof env || null === env || "" === env || enums.APP_DEVELOPMENT_MODE === env) {
        LISTEN_PORT = "3002";
        APP_SERVER_ADDRESS = "localhost";
        APP_SERVER_PORT = "8080";
        OSS_HOST = "oss-cn-hangzhou";
        OSS_PORT = "80";
        OSS_APP_ID = "T82nbipHSESmHzd8";
        OSS_APP_SECRET = "SOweQ8UVwCwPr2NC8EC89EOeKJc5Um";
        FILE_TEMP_PATH = "E:/Data/Game";
        MONGO_DB_URI = "mongodb://127.0.0.1:27017/festival";
        MONGO_DB_SERVER_ADDRESS = "127.0.0.1";
        MONGO_DB_NAME = "festival";
        MONGO_DB_USER = 'admin';
        MONGO_DB_PASSWORD = '123456';
    } else if (enums.APP_PRODUCTION_MODE === env) {
        LISTEN_PORT = "3002";
        APP_SERVER_ADDRESS = "localhost";
        APP_SERVER_PORT = "8080";
        OSS_HOST = "oss-cn-hangzhou";
        OSS_PORT = "80";
        OSS_APP_ID = "T82nbipHSESmHzd8";
        OSS_APP_SECRET = "SOweQ8UVwCwPr2NC8EC89EOeKJc5Um";
        FILE_TEMP_PATH = "/data/game";
        MONGO_DB_URI = "mongodb://127.0.0.1:27017/festival";
        MONGO_DB_SERVER_ADDRESS = "127.0.0.1";
        MONGO_DB_NAME = "festival";
        MONGO_DB_USER = 'admin';
        MONGO_DB_PASSWORD = '123456';
    } else if (enums.APP_USERDEBUG_MODE === env) {
        LISTEN_PORT = "3002";
        APP_SERVER_ADDRESS = "localhost";
        APP_SERVER_PORT = "8080";
        OSS_HOST = "oss-cn-hangzhou";
        OSS_PORT = "80";
        OSS_APP_ID = "T82nbipHSESmHzd8";
        OSS_APP_SECRET = "SOweQ8UVwCwPr2NC8EC89EOeKJc5Um";
        FILE_TEMP_PATH = "/data/game";
        MONGO_DB_URI = "mongodb://127.0.0.1:27017/festival";
        MONGO_DB_SERVER_ADDRESS = "127.0.0.1";
        MONGO_DB_NAME = "festival";
        MONGO_DB_USER = 'admin';
        MONGO_DB_PASSWORD = '123456';
    }
};
