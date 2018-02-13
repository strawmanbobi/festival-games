/**
 * Created by strawmanbobi on 2014-11-10.
 */

// logic
var PLAY_TIME = 0;
var MAX_OPPO_GET = 2;
var MAX_OPPO_COUNT = 20;
var OPPO_GEN_DELTA_TIME = 0.9;
var MS_GEN_DELTA_TIME = 2.2;
var GENDER_BOY = 0;
var GENDER_GIRL = 1;
var CONDITION_WIN = 1;
var CONDITION_LOSE = -1;

// visualization related
var ROW = 12;
var BG_WIDTH = 960;
var GROUND_HEIGHT = 20;
var TITLE_WIDTH = 640;
var TITLE_TEXT_WIDTH = 400;
var RESULT_WIDTH = 320;
var LS_WIDTH = 43;
var LS_HEIGHT = 160;
var MS_WIDTH = 64;
var OVER_BUTTON_WIDTH = 128;
var FUN_HEIGHT_GAP = 48;
var FUN_WIDTH = 80;
var LS_INIT_POS_X = 0;
var LS_INIT_POS_Y = 0;

// animation related
var LS_SPEED_X = 0;
var BG_SCROLL_SPEED = -150;
var OBJ_SPEED_X = -30;

var GameLayer = cc.Layer.extend({
    FONT_TYPE: '微软雅黑',
    // generic var
    size: null,
    validHeight: 0,
    oppoGenDt: 0,
    msGenDt: 0,
    oppoLiving: 0,
    currentOppoIndex: 0,
    stickScale: 0,
    msWidth: 0,
    msScale: 0,
    msMoving: true,
    gender: 0,
    currentAge: 0,
    moveCbCalled: false,

    // sprites
    /* for game */
    bgSprite1: null,
    bgSprite2: null,
    groundSprite: null,
    titleSprite: null,
    titleTextSprite: null,
    lsSprite: null,
    oppoSprite: null,
    lsOppoSprites: [],
    mileStoneSprite: null,
    /* for result */
    resultLsSprite: null,
    resultOppoSprite: null,
    resultSprite: null,
    resultText: null,
    funSprite: null,

    // buttons
    selectionBoyButton: null,
    selectionGirlButton: null,
    finishButton: null,
    overButton: null,

    // texts
    ages: ["2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025", "2026",
        "2027", "2028", "2029", "2030", "2031", "2032", "2033"],
    msText: null,

    // menus
    selectionMenu: null,
    replayMenu: null,

    // layers
    resultLayer: null,

    // constructor
    ctor: function (requireScore, score) {
        this._super();
        this.listener = cc.EventListener.create(
        {
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var target = event.getCurrentTarget();
                if(gameStatus == STATE_RUNNING) {
                    if(target.lsSprite) {
                        target.lsSprite.setDropping(false);
                        target.lsSprite.setAscend();
                    }
                }
                return true;
            },
            onTouchEnded: function (touch, event) {
                var target = event.getCurrentTarget();
                if(gameStatus == STATE_RUNNING) {
                    if(target.lsSprite) {
                        target.lsSprite.setDropping(true);
                    }
                }
            }
        });
        cc.eventManager.addListener(this.listener, this);
    },

    // game initializer
    init: function () {
        var bgScale = 0;
        var titleScale = 0;
        var titleTextScale = 0;
        var buttonScale = 0;

        var titleHeight = 0;
        var titleTextHeight = 0;
        var buttonHeight = 0;

        var frame = null;

        this._super();

        // prepare texture cache
        frame = cc.SpriteFrame.create(s_lsBoy, cc.rect(0, 0, LS_WIDTH, LS_HEIGHT));
        cc.spriteFrameCache.addSpriteFrame(frame, s_lsBoy);
        frame = cc.SpriteFrame.create(s_lsBoyb, cc.rect(0, 0, LS_WIDTH, LS_HEIGHT));
        cc.spriteFrameCache.addSpriteFrame(frame, s_lsBoyb);
        frame = cc.SpriteFrame.create(s_lsGirl, cc.rect(0, 0, LS_WIDTH, LS_HEIGHT));
        cc.spriteFrameCache.addSpriteFrame(frame, s_lsGirl);
        frame = cc.SpriteFrame.create(s_lsGirlb, cc.rect(0, 0, LS_WIDTH, LS_HEIGHT));
        cc.spriteFrameCache.addSpriteFrame(frame, s_lsGirlb);

        var width = document.documentElement.clientWidth;
        if (document.documentElement.clientWidth >= 800) {
            width = 800;
        }
        this.size = cc.size(width, document.documentElement.clientHeight);

        this.validHeight = this.size.height - GROUND_HEIGHT;

        // draw background image
        bgScale = this.size.height / TITLE_WIDTH;
        this.bgSprite1 = cc.Sprite.create(s_backgournd);
        this.bgSprite1.setScaleY(bgScale);
        this.bgSprite1.setAnchorPoint(0, 0);
        this.bgSprite1.setPosition(cc.p(0, GROUND_HEIGHT));
        this.addChild(this.bgSprite1, 0);
        this.bgSprite2 = cc.Sprite.create(s_backgournd);
        this.bgSprite2.setScaleY(bgScale);
        this.bgSprite2.setAnchorPoint(0, 0);
        this.bgSprite2.setPosition(cc.p(BG_WIDTH, GROUND_HEIGHT));
        this.addChild(this.bgSprite2, 0);

        this.groundSprite = cc.Sprite.create(s_ground, cc.rect(0, 0, this.size.width, GROUND_HEIGHT));
        this.groundSprite.setAnchorPoint(0, 0);
        this.groundSprite.setPosition(cc.p(0, 0));
        this.addChild(this.groundSprite, 0);

        // initialize title
        this.titleSprite = cc.Sprite.create(s_lsTitle);
        titleScale = this.size.width / TITLE_WIDTH;
        this.titleSprite.setScale(titleScale);
        this.titleSprite.setAnchorPoint(0, 0);
        titleHeight = this.titleSprite.getContentSize().height * titleScale;
        this.titleSprite.setPosition(cc.p(0, this.size.height - titleHeight));
        this.addChild(this.titleSprite, 10);

        // initialize selection text
        this.titleTextSprite = cc.Sprite.create(s_ls_TitleText);
        titleTextScale = this.size.width / TITLE_TEXT_WIDTH;
        this.titleTextSprite.setScale(titleTextScale);
        this.titleTextSprite.setAnchorPoint(0, 0);
        titleTextHeight = this.titleTextSprite.getContentSize().height * titleTextScale;
        this.titleTextSprite.setPosition(cc.p(0,
            this.titleSprite.getPositionY() - titleTextHeight));
        this.addChild(this.titleTextSprite, 10);

        // initialize selection button
        this.selectionBoyButton = cc.MenuItemImage.create(
            s_boy,
            s_boySelected,
            function () {
                this.reset(GENDER_BOY);
            },this);
        this.selectionGirlButton = cc.MenuItemImage.create(
            s_girl,
            s_girlSelected,
            function () {
                this.reset(GENDER_GIRL);
            },this);

        this.selectionMenu = cc.Menu.create(this.selectionBoyButton, this.selectionGirlButton);
        this.selectionMenu.setPosition(cc.p(0, 0));
        buttonScale = this.size.width / 7 / 64;
        buttonHeight = this.selectionBoyButton.getContentSize().height * buttonScale;
        // set position of boy button
        this.selectionBoyButton.setScale(buttonScale);
        this.selectionBoyButton.setAnchorPoint(0, 0);
        this.selectionBoyButton.setPosition(cc.p(this.size.width / 7,
            this.titleTextSprite.getPositionY() - 20 - buttonHeight));
        // set position of girl button
        this.selectionGirlButton.setScale(buttonScale);
        this.selectionGirlButton.setAnchorPoint(0, 0);
        this.selectionGirlButton.setPosition(cc.p(this.size.width / 7 * 4,
            this.titleTextSprite.getPositionY() - 20 - buttonHeight));
        this.addChild(this.selectionMenu);

        // this.setTouchEnabled(true);
        this.scheduleUpdate();
        gameStatus = STATE_PREPARE;
    },

    // update callback function
    update: function (dt) {
        this.doUpdate(dt);
    },

    /****** game logic ******/
    reset: function(gender) {
        var stickScale = 0;
        var stickWidth = 0;
        var stickHeight = 0;
        var heterosexualIndex = 0;
        this.gender = gender;
        gameGender = gender;
        var heterosexual = gender == 0 ? 1 : 0;
        this.removeAll();
        this.currentOppoIndex = 0;
        this.currentAge = 0;

        // create player ls sprite
        stickHeight = this.validHeight / 5;
        stickScale = stickHeight / LS_HEIGHT;
        this.stickScale = stickScale;
        stickWidth = LS_WIDTH * stickScale;
        this.lsSprite = new LightingStick(gender, LS_WIDTH, LS_HEIGHT, stickScale, this.validHeight, GROUND_HEIGHT);
        this.lsSprite.setAnchorPoint(0, 0);
        this.lsSprite.setPosition(cc.p(this.size.width / 8, this.validHeight / 2));
        this.lsSprite.setScale(stickScale);
        this.addChild(this.lsSprite, 40);

        // create mile stone sprite
        this.msWidth = this.validHeight / 8;
        this.msScale = this.msWidth / MS_WIDTH;
        this.mileStoneSprite = cc.Sprite.create(s_mileStone);
        this.mileStoneSprite.setAnchorPoint(0, 0);
        this.mileStoneSprite.setPosition(cc.p(this.size.width + this.msWidth, GROUND_HEIGHT));
        this.mileStoneSprite.setScale(this.msScale);
        this.addChild(this.mileStoneSprite, 5);

        // this.msText = cc.LabelTTF.create(this.ages[this.currentAge], this.FONT_TYPE, 12);
        this.msText = new cc.LabelTTF(this.ages[this.currentAge], this.FONT_TYPE, 14,
            cc.size(this.msWidth * this.msScale, this.msWidth / 3), cc.TEXT_ALIGNMENT_CENTER);
        this.msText.setColor(cc.color(0, 0, 0, 255));

        this.msText.setAnchorPoint(0, 0);
        this.msText.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.msText.boundingWidth = this.msWidth;
        this.msText.setPosition(cc.p(this.mileStoneSprite.getPositionX() + 4,
            GROUND_HEIGHT + this.msWidth / 3));
        this.addChild(this.msText, 6);

        // generate different gender of sticks according to gender you selected
        heterosexualIndex = Math.floor(Math.random() * (MAX_OPPO_COUNT - 13) + 7);
        // heterosexualIndex = 0;
        for(var oi = 0; oi < MAX_OPPO_COUNT; oi++) {
            if(oi != heterosexualIndex) {
                this.lsOppoSprites[oi] =
                    new OppositeStick(gender, LS_WIDTH, LS_HEIGHT, stickScale, this.validHeight, GROUND_HEIGHT, this.size.width);
                this.lsOppoSprites[oi].setScale(stickScale);
                this.addChild(this.lsOppoSprites[oi], 20);
            } else {
                this.lsOppoSprites[oi] =
                    new OppositeStick(heterosexual, LS_WIDTH, LS_HEIGHT, stickScale, this.validHeight, GROUND_HEIGHT, this.size.width);
                this.lsOppoSprites[oi].setScale(stickScale);
                this.addChild(this.lsOppoSprites[oi], 20);
            }
        }
        this.moveCbCalled = false;
        gameStatus = STATE_RUNNING;
    },

    removeAll: function() {
        this.removeChild(this.titleSprite);
        this.removeChild(this.titleTextSprite);
        this.removeChild(this.selectionMenu);
        this.removeChild(this.lsSprite);
        this.removeChild(this.resultLsSprite);
        this.removeChild(this.mileStoneSprite);
        this.removeChild(this.msText);
        this.removeChild(this.resultText);
        this.removeChild(this.resultLayer);
        for(var or = 0; or < MAX_OPPO_COUNT; or++) {
            this.removeChild(this.lsOppoSprites[or]);
        }
    },

    gameFinished: function(oppoObject) {
        if(0 == this.gender) {
            g_imgURL = createWeiXinShareImageURL("/web/games/lighting_stick/res/wx_b.png");
        } else {
            g_imgURL = createWeiXinShareImageURL("/web/games/lighting_stick/res/wx_g.png");
        }
        g_desc = "哦耶~ 我会在" + this.ages[this.currentAge] + "年顺利脱光，你会比我更早“脱光”吗？";
        this.resultLayer = cc.LayerColor.create(cc.color(64, 64, 64, 160), this.size.width, this.size.height);

        // create a result sprite indicating WIN!
        this.resultSprite = cc.Sprite.create(s_success);
        this.funSprite = cc.Sprite.create(s_popLove);
        resultScale = this.size.width / RESULT_WIDTH;
        this.resultSprite.setScale(resultScale);
        this.resultSprite.setAnchorPoint(0, 0);
        resultHeight = this.resultSprite.getContentSize().height * resultScale;
        this.resultSprite.setPosition(cc.p(0, this.size.height - resultHeight));
        this.resultLayer.addChild(this.resultSprite, 40);
        this.addChild(this.resultLayer, 100);

        // add extra text for game finished
        this.resultText = new cc.LabelTTF("你的单身生涯将在 " + this.ages[this.currentAge] + " 年结束！",
            this.FONT_TYPE, 20);
        this.resultText.setColor(cc.color(255, 255, 255, 255));
        this.resultText.setAnchorPoint(0.5, 0);
        this.resultText.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.resultText.setPosition(cc.p(this.size.width / 2,
            this.resultSprite.getPositionY() - this.resultText.getContentSize().height));
        this.addChild(this.resultText, 110);

        // move lsSprite and oppoSprite to forground
        // create a static ls sprite at the position of the player sprite
        if(this.gender == GENDER_BOY) {
            this.resultLsSprite = cc.Sprite.create(s_lsBoy);
        } else {
            this.resultLsSprite = cc.Sprite.create(s_lsGirl);
        }
        this.resultLsSprite.setScale(this.stickScale);
        this.resultLsSprite.setAnchorPoint(0, 0);
        this.resultLsSprite.setPosition(cc.p(this.lsSprite.getPositionX(), this.lsSprite.getPositionY()));
        this.addChild(this.resultLsSprite, 110);
        this.removeChild(this.lsSprite);
        oppoObject.setZOrder(110);

        centerOfScreen = this.size.width / 2;
        leftStickX = centerOfScreen - this.lsSprite.getContentSize().width - 10;
        rightStickX = centerOfScreen + 10;
        stickY = this.resultText.getPositionY() - this.lsSprite.getContentSize().height * this.stickScale - FUN_HEIGHT_GAP;
        this.moveSprite(this.resultLsSprite, cc.p(leftStickX, stickY), cc.CallFunc.create(this.cbSpriteMovingFinished, this));
        this.moveSprite(oppoObject, cc.p(rightStickX, stickY), cc.CallFunc.create(this.cbSpriteMovingFinished, this));
    },

    gameOver: function(oppoObject, failureType) {
        var resultHeight;
        var resultScale;
        var centerOfScreen;
        var leftStickX;
        var rightStickX;
        var singleStickX;
        var stickY;

        if(0 == this.gender) {
            g_imgURL = createWeiXinShareImageURL("/web/games/lighting_stick/res/wx_bf.png");
        } else {
            g_imgURL = createWeiXinShareImageURL("/web/games/lighting_stick/res/wx_gf.png");
        }
        // show background
        this.resultLayer = new cc.LayerColor(cc.color(64, 64, 64, 160), this.size.width, this.size.height);
        // create result sprite according to different bad endings
        switch(failureType) {
            case "gay" :
                this.resultSprite = cc.Sprite.create(s_gay);
                this.funSprite = cc.Sprite.create(s_popSoap);
                g_desc = "我注定和基友捡一辈子肥皂，快来帮我“脱光”吧";
                break;
            case "lesbian" :
                this.resultSprite = cc.Sprite.create(s_lesbian);
                this.funSprite = cc.Sprite.create(s_popLala);
                g_desc = "我要脱光，不要做百合，快来帮我“脱光”吧";
                break;
            case "timeout" :
                this.resultSprite = cc.Sprite.create(s_timeout);
                this.funSprite = cc.Sprite.create(s_popHalo);
                g_desc = "我注定将孤独一生，快来帮我“脱光”吧";
                break;
            case "death" :
                this.resultSprite = cc.Sprite.create(s_death);
                this.funSprite = cc.Sprite.create(s_popHalo);
                g_desc = "脱光之前不幸英年早逝！快来帮我“脱光”吧";
                break;
        }
        //this.resultSprite = cc.Sprite.create(s_gay);
        resultScale = this.size.width / RESULT_WIDTH;
        this.resultSprite.setScale(resultScale);
        this.resultSprite.setAnchorPoint(0, 0);
        resultHeight = this.resultSprite.getContentSize().height * resultScale;
        this.resultSprite.setPosition(cc.p(0, this.size.height - resultHeight));
        this.resultLayer.addChild(this.resultSprite, 40);
        this.addChild(this.resultLayer, 100);

        // move lsSprite and oppoSprite to forground
        // create a static ls sprite at the position of the player sprite
        if(this.gender == GENDER_BOY) {
            this.resultLsSprite = cc.Sprite.create(s_lsBoy);
        } else {
            this.resultLsSprite = cc.Sprite.create(s_lsGirl);
        }
        this.resultLsSprite.setScale(this.stickScale);
        this.resultLsSprite.setAnchorPoint(0, 0);
        this.resultLsSprite.setPosition(cc.p(this.lsSprite.getPositionX(), this.lsSprite.getPositionY()));
        this.addChild(this.resultLsSprite, 110);
        this.removeChild(this.lsSprite);
        if(oppoObject) {
            oppoObject.setZOrder(110);
        }

        centerOfScreen = this.size.width / 2;
        stickY = this.resultSprite.getPositionY() - this.lsSprite.getContentSize().height * this.stickScale - FUN_HEIGHT_GAP;
        if(oppoObject) {
            leftStickX = centerOfScreen - this.lsSprite.getContentSize().width / 2 - 10;
            rightStickX = centerOfScreen + 10;
            this.moveSprite(this.resultLsSprite, cc.p(leftStickX, stickY), cc.CallFunc.create(this.cbSpriteMovingFinished, this));
            this.moveSprite(oppoObject, cc.p(rightStickX, stickY), cc.CallFunc.create(this.cbSpriteMovingFinished, this));
        } else {
            singleStickX = centerOfScreen - this.lsSprite.getContentSize().width * this.stickScale / 2;
            this.moveSprite(this.resultLsSprite, cc.p(singleStickX, stickY), cc.CallFunc.create(this.cbSpriteMovingFinished, this));
        }
    },

    moveSprite: function (sprite, toPos, callback) {
        var tmpPosition = sprite.getPosition();
        var spriteMoveTo = cc.MoveTo.create(1.0, toPos);

        var moveSequence = cc.Sequence.create(spriteMoveTo, callback);
        sprite.runAction(moveSequence);
    },

    cbSpriteMovingFinished: function(nodeExecutingAction, data) {
        var funHeight,
            funScale = 0.6,
            funY;
        var centerOfScreen;
        var buttonScale;
        var buttonWidth;

        if(this.moveCbCalled) {
            return;
        }
        this.moveCbCalled = true;
        // add fun icon
        centerOfScreen = this.size.width / 2;
        this.funSprite.setScale(funScale);
        this.funSprite.setAnchorPoint(0, 0);
        funHeight = this.funSprite.getContentSize().height * funScale;
        funY = this.resultLsSprite.getPositionY() + this.resultLsSprite.getContentSize().height * this.stickScale;
        this.funSprite.setPosition(cc.p(centerOfScreen - funHeight / 2, funY));
        this.resultLayer.removeChild(this.funSprite);
        this.resultLayer.addChild(this.funSprite, 40);

        // add retry button
        if(gameStatus == STATE_OVER) {
            this.overButton = cc.MenuItemImage.create(
                s_failureNAgain,
                s_failureNAgainPressed,
                function () {
                    gameStatus = STATE_PREPARE;
                    this.reset(this.gender);
                }, this);
        } else if(gameStatus == STATE_FINISHED) {
            this.overButton = cc.MenuItemImage.create(
                s_successNAgain,
                s_successNAgainPressed,
                function () {
                    gameStatus = STATE_PREPARE;
                    this.reset(this.gender);
                }, this);
        }

        this.replayMenu = cc.Menu.create(this.overButton);
        this.replayMenu.setPosition(cc.p(0, 0));
        buttonScale = this.size.width / 7 * 3 / OVER_BUTTON_WIDTH;
        // the width = the height of the button
        buttonWidth = this.overButton.getContentSize().width * buttonScale;
        // set position of replay button
        this.overButton.setScale(buttonScale);
        this.overButton.setAnchorPoint(0, 0);
        this.overButton.setPosition(cc.p(this.size.width / 7 * 2,
            this.resultLsSprite.getPositionY() - 10 - buttonWidth));
        this.resultLayer.addChild(this.replayMenu, 40);
    },

    doUpdate: function(dt) {
        var oppoCollision = 0;
        var failureType = "";
        switch(gameStatus) {
            case STATE_PREPARE:
            {
                // do nothing
                break;
            }
            case STATE_RUNNING:
            {
                // generate new oppos if pool is not full
                this.spawnOppos(dt);
                if(this.lsSprite.collideWithGround(GROUND_HEIGHT)) {
                    gameStatus = STATE_OVER;
                    this.lsSprite.setAlive(false);
                    failureType = "death";
                    this.gameOver(null, failureType);
                }
                for(var ou = 0; ou < MAX_OPPO_COUNT; ou++) {
                    oppoCollision = this.lsSprite.collideWithOppo(this.lsOppoSprites[ou]);
                    if(oppoCollision) {
                        if(CONDITION_WIN == oppoCollision.result) {
                            // improve lighting stick status
                            gameStatus = STATE_FINISHED;
                            this.gameFinished(oppoCollision.oppo);
                        } else if(CONDITION_LOSE == oppoCollision.result) {
                            this.lsSprite.setAlive(false);
                            gameStatus = STATE_OVER;
                            if(this.lsSprite.gender == GENDER_BOY) {
                                failureType = "gay";
                            } else {
                                failureType = "lesbian";
                            }
                            this.gameOver(oppoCollision.oppo, failureType);
                        }
                    }
                }
                for(var op = 0; op < MAX_OPPO_COUNT; op++) {
                    this.lsOppoSprites[op].update(dt);
                }
                this.updateBg(dt);
                this.lsSprite.update(dt);
                break;
            }
            case STATE_FINISHED:
            {
                break;
            }
            case STATE_OVER:
            {
                break;
            }
            default:
            {
                break;
            }
        }
    },

    updateBg: function(dt) {
        // scroll background
        this.bgSprite1.setPositionX(this.bgSprite1.getPositionX() + dt * BG_SCROLL_SPEED);
        this.bgSprite2.setPositionX(this.bgSprite2.getPositionX() + dt * BG_SCROLL_SPEED);

        if(this.bgSprite2.getPositionX() < 0) {
            this.bgSprite1.setPositionX(0);
            this.bgSprite2.setPositionX(this.bgSprite1.getPositionX() + BG_WIDTH);
        }

        if(true == this.msMoving) {
            // move the mile stone
            this.mileStoneSprite.setPositionX(this.mileStoneSprite.getPositionX() + dt * BG_SCROLL_SPEED);
            this.msText.setPositionX(this.msText.getPositionX() + dt * BG_SCROLL_SPEED);
            if(this.mileStoneSprite.getPositionX() < - this.msWidth) {
                this.msMoving = false;
            }
        }

        // scroll mile stone
        if(this.msGenDt < MS_GEN_DELTA_TIME) {
            // 毛毛说: "还没到时间!"
            this.msGenDt += dt;
            return;
        }
        // reset milestone back to the right end of the screen
        if(false == this.msMoving) {
            this.msGenDt = 0;
            this.currentAge ++;
            if(this.currentAge >= this.ages.length) {
                // you are dying
                this.lsSprite.setAlive(false);
                gameStatus = STATE_OVER;
                failureType = "timeout";
                this.gameOver(null, failureType);
            }
            this.msText.setString(this.ages[this.currentAge]);
            this.mileStoneSprite.setPosition(cc.p(this.size.width + this.msWidth, GROUND_HEIGHT));
            this.msText.setPosition(cc.p(this.mileStoneSprite.getPositionX() + 4,
                GROUND_HEIGHT + this.msWidth / 3));
            this.msMoving = true;
        }
    },

    spawnOppos: function(dt) {
        if(this.oppoGenDt < OPPO_GEN_DELTA_TIME) {
            // 毛毛说: "还没到时间!"
            this.oppoGenDt += dt;
            return;
        }
        while(this.currentOppoIndex < MAX_OPPO_COUNT) {
            if(this.lsOppoSprites[this.currentOppoIndex].getStatus() != OPPO_VALID) {
                this.lsOppoSprites[this.currentOppoIndex].respawn();
                // this.lsOppoSprites[this.currentOppoIndex].setPosition(cc.p(100, 100));
                this.lsOppoSprites[this.currentOppoIndex].setStatus(OPPO_VALID);
                this.currentOppoIndex ++;
                if(this.currentOppoIndex == MAX_OPPO_COUNT) {
                    this.currentOppoIndex = 0;
                }
                break;
            } else {
                this.currentOppoIndex ++;
                if(this.currentOppoIndex == MAX_OPPO_COUNT) {
                    this.currentOppoIndex = 0;
                }
            }
        }
        this.oppoGenDt = 0;
    }
});