/*
 * Created by Strawmanbobi
 * 2014-11-04
 */

var ASCEND_SPEED = 0;
var OPPO_SPAWN = 0;
var OPPO_VALID = 1;
var OPPO_INVALID = 2;
var OPPO_CAPTURED = 3;

var OppositeStick = cc.Sprite.extend({
    // game related
    gender: 0,
    stickWidth: 0,
    stickHeight: 0,
    gameStickWidth: 0,
    gameStickHeight: 0,
    stickScale: 0,
    validHeight: 0,
    oppoRandomPosY: 0,
    groundHeight : 0,
    screenWidth: 0,
    speedX: -140,
    speedY: 0,
    speedG: 0,
    radiusPlus: 32,
    isDropping: true,
    textureStyle: "",
    status: OPPO_SPAWN,

    // animation related
    lsNormalFrame: null, // apply normal frame to have test
    normalAnimation: null,
    normalAnimate: null,
    normalAnimationFrames: [],

    oppoBoyRes: [s_lsBoyOp1, s_lsBoyOp2, s_lsBoyOp3],
    oppoGirlRes: [s_lsGirlOp1, s_lsGirlOp2, s_lsGirlOp3],

    ctor: function (gender, stickWidth, stickHeight, stickScale, validHeight, groundHeight, screenWidth) {
        var randomStyle = 0;
        this._super();

        this.groundHeight = groundHeight;
        this.validHeight = validHeight;
        this.screenWidth = screenWidth;
        this.stickWidth = stickWidth;
        this.stickHeight = stickHeight;

        this.gameStickWidth = stickWidth * stickScale;
        this.gameStickHeight = stickHeight * stickScale;
        this.stickScale = stickScale;
        // recalculate speedX randomly as opposite stick appears
        this.speedX = -200;
        this.speedY = 0;

        this.gender = gender;
        //console.log("gender of oppo = " + this.gender);

        randomStyle = Math.floor(Math.random() * 3);
        if(GENDER_BOY == this.gender) {
            this.lsNormalFrame = cc.SpriteFrame.create(this.oppoBoyRes[randomStyle],
                cc.rect(0, 0, stickWidth, stickHeight));
            this.textureStyle = this.oppoBoyRes[randomStyle];
        } else {
            this.lsNormalFrame = cc.SpriteFrame.create(this.oppoGirlRes[randomStyle],
                cc.rect(0, 0, stickWidth, stickHeight));
            this.textureStyle = this.oppoGirlRes[randomStyle];
        }
        this.normalAnimationFrames.length = 0;
        this.normalAnimationFrames.push(this.lsNormalFrame);
        this.normalAnimation = cc.Animation.create(this.normalAnimationFrames, 0.5);
        this.normalAnimate = cc.Animate.create(this.normalAnimation);
        this.initWithSpriteFrame(this.lsNormalFrame);
        this.runAction(cc.RepeatForever.create(this.normalAnimate));
        this.setPositionX(this.screenWidth + 20);
        this.status = OPPO_SPAWN;
    },

    update: function (dt) {
        // only change position of this oppo object when it is valid
        if(this.status == OPPO_VALID) {
            var pos = this.getPosition();
            // keep static in x axis
            // pos.x = pos.x;
            pos.x = pos.x + this.speedX * dt;
            this.setPosition(pos);
            if(pos.x < 0 - (this.gameStickWidth * 2)) {
                this.setStatus(OPPO_INVALID);
            }
        } else {
            // do nothing
        }
    },

    getGender: function() {
        return this.gender;
    },

    getStatus: function() {
        return this.status;
    },

    setStatus: function(status) {
        this.status = status;
    },

    getTextureStyle: function() {
        return this.textureStyle;
    },

    respawn: function() {
        var oppoRandomPosY = Math.floor(Math.random() * (this.validHeight - this.gameStickHeight) + this.groundHeight);
        this.setAnchorPoint(0, 0);
        this.setPosition(cc.p(this.screenWidth + 20, oppoRandomPosY));
        this.status = OPPO_VALID;
    }
});