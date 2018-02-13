/**
 * Created by strawmanbobi
 * 2018-02-10
 */

var ResultLayer = cc.Layer.extend({
    // sprites
    resultSprite: null,

    // labels
    resultText: null,
    scoreText: null,

    init: function() {
        this._super();
    },

    displayScore: function () {
        // TODO:
    },

    update: function() {
        switch(gameState) {
            case STATE_FINISHED:
                this.displayScore();
                break;

            default:
                break;
        }
    }

});