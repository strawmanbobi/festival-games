/**
 * Created by dummy team
 * 2018-02-11
 */

ServiceResponse = require("./service_response");
function GameResponse(status, entity) {
    this.entity = entity;
    ServiceResponse.call(this, status);
}

module.exports = GameResponse;