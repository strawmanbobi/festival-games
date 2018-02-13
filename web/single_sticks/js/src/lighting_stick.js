/*
 * Created by Strawmanbobi
 * 2014-11-04
 */

var LightingStick = cc.Sprite.extend({
    ASCEND_SPEED: 200,

    // game related
    gender: 0,
    gameStickWidth: 0,
    gameStickHeight: 0,
    stickScale: 0,
    validHeight: 0,
    groundHeight : 0,
    speedX: 0,
    speedY: 0,
    speedG: 300,
    isDropping: true,
    isAlive: true,

    // animation related
    lsAscendFrame0: null,
    lsAscendFrame1: null,
    lsDescendFrame: null,
    ascendAnimation: null,
    ascendAction: null,
    descendAnimation: null,
    descendAction: null,
    ascendAnimationFrames: [],
    descendAnimationFrames: [],

    ctor: function (gender, stickWidth, stickHeight, stickScale, validHeight, groundHeight) {
        this._super();

        this.groundHeight = groundHeight;
        this.validHeight = validHeight + this.groundHeight;

        this.gameStickWidth = stickWidth * stickScale;
        this.gameStickHeight = stickHeight * stickScale;
        this.stickScale = stickScale;
        this.speedX = 0;
        this.speedY = 0;

        this.gender = gender;

        if(0 == gender) {
            this.lsAscendFrame0 = cc.spriteFrameCache.getSpriteFrame(s_lsBoyb);
            this.lsAscendFrame1 = cc.spriteFrameCache.getSpriteFrame(s_lsBoy);
            //this.lsDescendFrame = cc.spriteFrameCache.getSpriteFrame(s_lsBoy);
        } else {
            this.lsAscendFrame0 = cc.spriteFrameCache.getSpriteFrame(s_lsGirlb);
            this.lsAscendFrame1 = cc.spriteFrameCache.getSpriteFrame(s_lsGirl);
            //this.lsDescendFrame = cc.spriteFrameCache.getSpriteFrame(s_lsGirl);
        }
        this.initWithSpriteFrame(this.lsAscendFrame0);

        this.ascendAnimationFrames = [];
        this.ascendAnimationFrames.push(this.lsAscendFrame0);
        this.ascendAnimationFrames.push(this.lsAscendFrame1);

        //this.descendAnimationFrames = [];
        //this.descendAnimationFrames.push(this.lsDescendFrame);

        // stick animate
        this.ascendAnimation = cc.Animation.create(this.ascendAnimationFrames, 0.3);
        this.ascendAction = cc.Animate.create(this.ascendAnimation);

        //this.descendAnimation = cc.Animation.create(this.descendAnimationFrames, 0.2);
        //this.descendAction = cc.Animate.create(this.descendAnimation);

        this.runAction(cc.RepeatForever.create(this.ascendAction));
    },

    update: function (dt) {
        // keep static in x axis
        // pos.x = pos.x;
        if(this.isAlive) {
            var pos = this.getPosition();
            if(this.isDropping) {
                pos.y += this.speedY * dt - this.speedG * dt * dt / 2;
                this.speedY -= this.speedG * dt;
            } else {
                pos.y += this.ASCEND_SPEED * dt;
            }
            if(pos.y + this.gameStickHeight > this.validHeight) {
                pos.y = this.validHeight - this.gameStickHeight;
            }
            this.setPosition(pos);
        }
    },

    collideWithOppo: function (oppo) {
        var lsRect = cc.rect(this.getPositionX(),
            this.getPositionY(),
            this.gameStickWidth,
            this.gameStickHeight);
        var oppoRect = cc.rect(oppo.getPositionX(),
            oppo.getPositionY(),
            oppo.gameStickWidth,
            oppo.gameStickHeight);

        if(cc.rectIntersectsRect(lsRect, oppoRect) &&
            oppo.getStatus() == OPPO_VALID) {
            if(oppo.getGender() != this.getGender()) {
                return { result: 1, oppo: oppo };
            } else {
                return { result: -1, oppo: oppo };
            }
        }
        return null;
    },

    collideWithGround: function(groundHeight) {
        return this.getPositionY() < groundHeight;
    },

    setDropping: function(dropping) {
        this.isDropping = dropping;
    },

    getGender: function() {
        return this.gender;
    },

    setAlive: function(alive) {
        this.isAlive = alive;
    },

    setAscend: function() {
        this.speedY = this.ASCEND_SPEED;
    }
});