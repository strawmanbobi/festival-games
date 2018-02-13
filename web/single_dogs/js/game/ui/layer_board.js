/**
 * Created by strawmanbobi
 * 2018-02-04
 */

var ROW = 8;
var COL = 8;
var SCOPE = 5;
var size = null;
var blank = 2;
var FONT_TYPE = 'Arial';

var STATE_PREPARE = 0;
var STATE_RUNNING = 1;
var STATE_FINISHED = 2;

var INIT_SCORE = 1000;
var SCORE_STEP = 2000;

var gameState = STATE_PREPARE;

var GameLayer = cc.Layer.extend({

    // game status
    isMouseDown: false,
    score: null,
    scoreInitiated: false,
    requireScore: null,
    level: null,
    nextLevelDelayTime: null,

    // layers
    titleLayer: null,
    resultLayer: null,

    // models
    background: null,
    bubbleModel: null,
    firstWidth: null,
    firstHeight: null,
    bubbleWidth: null,
    connected: null,
    connectedBack: null,

    // sprites
    bubbleSprites: null,
    bubbleBatchNodes: [],
    floorBatchNode: null,

    // labels
    lblScore: null,
    lblGold: null,
    lblReset: null,
    lblLevel: null,

    // controls

    // scale
    gameScale: 1.0,
    bgWScale: 1.0,
    bgHScale: 1.0,

    // events
    eventListener: null,

    // customizations
    backgroundImg: null,

    // design specs
    screenWidthMax: 720,
    bubbleTypeMax: 5,
    floorBlockRealWidth: 230,
    bgRealWidth: 1080,
    bgRealHeight: 1920,

    rest: ROW * COL,

    ctor: function (requireScore, score) {
        this._super();
        this.requireScore = requireScore;
        this.score = score;
        this.level = 1;
    },

    init: function() {
        this._super();
        var that = this;
        var width = document.documentElement.clientWidth;
        if (document.documentElement.clientWidth >= this.screenWidthMax) {
            width = this.screenWidthMax;
        }
        var height = document.documentElement.clientHeight;
        size = cc.size(width, height);
        this.gameScale = Math.max(height / this.bgRealHeight, width / this.bgRealWidth);

        this.firstHeight = size.height / (ROW + 2);
        if (size.height / (ROW + 2) * ROW > size.width) {
            this.bubbleWidth = (size.width - blank * (COL + 1)) / COL;
            this.firstWidth = blank;
        } else {
            this.bubbleWidth = (size.height / (ROW + 2) * ROW - blank * (ROW + 1)) / ROW;
            this.firstWidth = (size.width - COL * this.bubbleWidth - blank * (COL + 1)) / 2;
        }

        for (var i = 0; i < this.bubbleTypeMax; i++) {
            var path;
            path = "./res/images/" + i + ".png";
            var batchNode = cc.SpriteBatchNode.create(path);
            this.addChild(batchNode, 2);
            this.bubbleBatchNodes.push(batchNode);
        }
        this.addBubbles();

        // draw the floor
        var floorHeight = this.firstHeight;
        var floorWidth = floorHeight;
        var floorBlockCount = Math.ceil(size.width / floorWidth) + 1;
        var floorBlockScale = floorWidth / this.floorBlockRealWidth;
        this.floorBatchNode = cc.SpriteBatchNode.create(s_floor);
        this.addChild(this.floorBatchNode, 100);
        for (var floorIndex = 0; floorIndex < floorBlockCount; floorIndex++) {
            var floorBlock = cc.Sprite.createWithTexture(this.floorBatchNode.getTexture());
            floorBlock.setAnchorPoint(cc.p(0, 0.5));
            floorBlock.setPosition(cc.p(floorIndex * floorWidth, this.firstHeight - floorHeight / 2));
            // a work around to remove the tiny white spaces between floor blocks
            floorBlock.setScale(floorBlockScale);
            this.addChild(floorBlock, 4);
        }

        // custom background image
        this.downloadImg();

        // this.maskLayer = LayerBlur.create(LayerBlur.defaultBlurRadius, cc.color(0, 0, 0, 255 * 0.6));
        // this.addChild(this.maskLayer, 1);
        this.updateMaskLayer();

        var positionY = size.height - size.height / (ROW + 2) / 2;
        /*
        // draw level and score label
        this.lblLevel = cc.LabelTTF.create("LEVEL " + this.level, FONT_TYPE, 32);
        this.lblLevel.setPosition(cc.p(size.width - blank * 2, positionY));
        this.lblLevel.setAnchorPoint(cc.p(1, 0.5));
        this.lblLevel.setScale(1);
        this.lblLevel.setColor(cc.color(255, 255, 255, 255));
        this.addChild(this.lblLevel, 2);
        */

        var lblScorePosition = cc.p(size.width / 2 - blank * 4, positionY);
        // initialize to 0/1000
        this.score = 0;
        this.requireScore = 1000;
        this.lblScore = cc.LabelTTF.create(this.score + "/" + this.requireScore, FONT_TYPE, 40);
        this.lblScore.setAnchorPoint(cc.p(0.5, 0.5));
        this.lblScore.setPosition(lblScorePosition);
        this.lblScore.setScale(size.height / (ROW + 2) / 4 * 2 / this.lblScore.getContentSize().height);
        this.lblScore.setColor(cc.color(255, 255, 255, 255));
        this.addChild(this.lblScore, 2);

        // add event management
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (touch, event) {
                var loc = touch.getLocation();
                var x = ROW - 1 - Math.floor((loc.y - that.firstHeight + blank / 2) / (that.bubbleWidth + blank));
                var y = Math.floor((loc.x - that.firstWidth + blank / 2) / (that.bubbleWidth + blank));
                var t_connected = that.bubbleModel.findConnnectedBubbles(x, y);
                if (x < 0 || x > ROW - 1 || y < 0 || y > COL - 1 ||
                        that.bubbleSprites[x][y] == null || t_connected.length < 2) {
                    that.removeConnectedBackground();
                    that.connected = null;
                    return;
                }
                if (t_connected.length >= 2) {
                    if (that.connected != null && that.inConnected(x, y)) {
                        that.removeConnectedSprite(that.connected);
                        that.checkGameStatus();
                        that.removeConnectedBackground();
                        that.connected = null;
                    } else {
                        that.removeConnectedBackground();
                        that.connected = t_connected;
                        that.sortConnected(that.connected);
                        that.setConnectedBackground();
                    }
                }
                that.isMouseDown = true;
                return false;
            },

            onTouchMoved: function (touch, event) {
                return false;
            },

            onTouchEnded: function (touch, event) {
                var loc = touch.getLocation();
                that.isMouseDown = false;
                return false;
            }
        }, this);

        // add title layer
        this.titleLayer = new TitleLayer(this.gameScale);
        this.titleLayer.init();
        this.titleLayer.setAnchorPoint(0, 0);
        this.titleLayer.setPosition(0, 0);
        this.titleLayer.setVisible(true);
        this.addChild(this.titleLayer, 10);

        // add result layer
        this.resultLayer = new ResultLayer(this.gameScale);
        this.resultLayer.init();
        this.resultLayer.setAnchorPoint(0, 0);
        this.resultLayer.setPosition(0, 0);
        this.resultLayer.setVisible(false);
        this.addChild(this.resultLayer, 100);

        gameState = STATE_PREPARE;
        this.scheduleUpdate();
    },
    
    addBubbles: function() {
        this.bubbleModel = new BubbleModel(ROW, COL, SCOPE);
        this.bubbleSprites = [];
        var sprite;
        for (var i = this.bubbleModel.bubbleArray.length - 1; i >= 0; i--) {
            var spriteRow = [];
            for (var j = 0; j < this.bubbleModel.bubbleArray[i].length; j++) {
                var positionX = size.width + this.firstWidth + j * (this.bubbleWidth + blank);
                var positionY = this.firstHeight + (ROW - 1 - i) * (this.bubbleWidth + blank);
                sprite = this.createSprite(this.bubbleModel.bubbleArray[i][j], positionX, positionY);
                spriteRow.push(sprite);
                if (i === 0 && j === COL - 1) {
                    var showFun = cc.CallFunc.create(function() {
                        var time = 0.5;
                        for (var j = 0; j < COL; j++) {
                            for (var i = 0; i < ROW; i++) {
                                var t_positionX = this.firstWidth + j * (this.bubbleWidth + blank);
                                var t_positionY = this.firstHeight + (ROW - 1 - i) * (this.bubbleWidth + blank);
                                var moveLeft = cc.MoveTo.create(time, cc.p(t_positionX, t_positionY));
                                //var sequence = cc.Sequence.create(delay,moveLeft);
                                this.bubbleSprites[i][j].runAction(moveLeft);
                            }
                            time += 0.1;
                        }
                    }, this);
                    this.bubbleSprites[i][j].runAction(showFun);
                }
            }
            this.bubbleSprites.push(spriteRow);
        }
        for (var k = 0; k < this.bubbleSprites.length / 2; k++) {
            spriteRow = this.bubbleSprites[k];
            this.bubbleSprites[k] = this.bubbleSprites[this.bubbleSprites.length - k - 1];
            this.bubbleSprites[this.bubbleSprites.length - k - 1] = spriteRow;
        }
    },
    
    /* if we need to apply customized image to bubble map - begin */
    downloadImg: function() {
        cc.textureCache.addImage(bgImgPath, this.downloadCallback, this);
    },
    
    downloadCallback: function(texture) {
        if (texture instanceof cc.Texture2D) {
            // draw background image
            this.bgWScale = size.width / texture.width;
            this.bgHScale = size.height / texture.height;
            this.backgroundImg = cc.Sprite.create(texture);
            this.backgroundImg.setScaleX(this.bgWScale);
            this.backgroundImg.setScaleY(this.bgHScale);
            this.backgroundImg.setAnchorPoint(0, 0);
            this.backgroundImg.setPosition(cc.p(0, 0));
            // this.blurSprite(this.backgroundImg);
            this.addChild(this.backgroundImg, 0);
        }
    },

    /* if we need to apply customized image to bubble map - end */
    resetGame: function (event) {
        this.resultLayer.setVisible(false);
        this.level = 1;
        this.rest = ROW * COL;
        this.requireScore = INIT_SCORE;
        this.score = 0;
        this.lblLevel.setString("LEVEL " + this.level);
        this.lblScore.setString(this.score + "/" + this.requireScore);
        this.index = 0;
        this.bubbleSprites.length = 0;

        for (var i = 0; i < SCOPE; i++) {
            this.bubbleBatchNodes[i].removeAllChildren(true);
        }
        this.removeConnectedBackground();
        this.connected = null;
        this.addBubbles();
        this.updateMaskLayer();
    },
    
    sortConnected: function (connected) {
        var temp;
        //sort by col
        for (var i = 1; i < connected.length; i++) {
            for (var j = 0; j < connected.length - i; j++) {
                if (connected[j].y > connected[j + 1].y) {
                    temp = connected[j + 1];
                    connected[j + 1] = connected[j];
                    connected[j] = temp;
                }
            }
        }
        //sort of same col by row
        for (var i = 1; i < connected.length; i++) {
            for (var j = 0; j < connected.length - i; j++) {
                if (connected[j].y === connected[j + 1].y && connected[j].x > connected[j + 1].x) {
                    temp = connected[j + 1];
                    connected[j + 1] = connected[j];
                    connected[j] = temp;
                }
            }
        }
    },
    
    removeConnectedSprite: function (connected) {
        if (connected.length >= 2) {
            // update rest count and maskLayer
            this.rest -= connected.length;
            this.updateMaskLayer();

            var currentScore;
            currentScore = connected.length * connected.length * 5;
            this.score += currentScore;

            //removed score action
            var tlblScore = cc.LabelTTF.create(currentScore, FONT_TYPE, 20);
            tlblScore.setPosition(this.bubbleSprites[connected[0].x][connected[0].y].getPosition());
            tlblScore.setColor(cc.color(255, 255, 255, 255));
            tlblScore.setAnchorPoint(cc.p(0.5, 1));
            this.addChild(tlblScore, 6);

            var moveAction = cc.MoveTo.create(1.5, cc.p(size.width / 2, size.height / (ROW + 2) * (ROW + 1)));
            var fadeAction = cc.FadeOut.create(0.2);
            var callFunc = cc.CallFunc.create(function() {
                this.removeChild(tlblScore);
                this.lblScore.setString(this.score + "/" + this.requireScore);
            }, this);
            var actionSequence = cc.Sequence.create(moveAction, fadeAction, callFunc);
            tlblScore.runAction(actionSequence);
            var bubbleType = this.bubbleModel.bubbleArray[connected[0].x][connected[0].y];

            cc.audioEngine.playEffect(s_remove_sound);

            for (var i = 0; i < connected.length; i++) {
                var y = connected[i].y;

                //remove bubbles effect
                var particle = cc.ParticleSystem.create(s_bubble_remove);
                var positionX = this.bubbleSprites[connected[i].x][y].getPosition().x + this.bubbleWidth / 2;
                var positionY = this.bubbleSprites[connected[i].x][y].getPosition().y + this.bubbleWidth / 2;
                particle.setPosition(cc.p(positionX, positionY));
                particle.setAutoRemoveOnFinish(true);
                this.addChild(particle, 5);

                this.bubbleModel.removeConnectedBubble(connected[i].x, y);
                this.bubbleBatchNodes[bubbleType].removeChild(this.bubbleSprites[connected[i].x][y]);

                if (connected[i].x === ROW - 1 && this.bubbleSprites[connected[i].x - 1][y] == null) {
                    this.updateUI(y);
                } else {
                    var time = 0.1;
                    for (var j = connected[i].x; j > 0; j--) {
                        if (this.bubbleSprites[j - 1][y] == null) break;
                        var moveDown = cc.MoveTo.create(time, cc.p(this.bubbleSprites[j - 1][y].getPosition().x,
                            this.bubbleSprites[j - 1][y].getPosition().y - this.bubbleWidth - blank));
                        this.bubbleSprites[j - 1][y].runAction(moveDown);
                        time += 0.1;
                    }
                    for (var j = connected[i].x; j > 0; j--) {
                        this.bubbleSprites[j][y] = this.bubbleSprites[j - 1][y];
                    }
                    this.bubbleSprites[j][y] = null;
                }
            }
        }
    },
    
    createSprite: function (bubbleType, positionX, positionY) {
        var sprite;
        var batchNode = this.bubbleBatchNodes[bubbleType];
        sprite = cc.Sprite.createWithTexture(batchNode.getTexture());
        sprite.setPosition(cc.p(positionX, positionY));
        sprite.setScale(this.bubbleWidth / sprite.getContentSize().width);
        sprite.setAnchorPoint(cc.p(0, 0));
        batchNode.addChild(sprite);
        return sprite;
    },
    
    updateUI: function (nullCol) {
        if (nullCol != null) {
            this.bubbleModel.updateAndMove(nullCol);
            var time = 0.02;
            for (var j = nullCol; j > 0; j--) {
                for (var i = ROW - 1; i >= 0; i--) {
                    if (this.bubbleSprites[i][j - 1] == null) break;
                    var moveRight = cc.MoveTo.create(time, cc.p(this.bubbleSprites[i][j - 1].getPosition().x +
                        this.bubbleWidth + blank, this.bubbleSprites[i][j - 1].getPosition().y));
                    this.bubbleSprites[i][j - 1].runAction(moveRight);
                    time += 0.02;
                }
                for (var i = ROW - 1; i >= 0; i--) {
                    this.bubbleSprites[i][j] = this.bubbleSprites[i][j - 1];
                }
            }
            for (var i = 0; i < ROW; i++) {
                this.bubbleSprites[i][j] = null;
            }
        }
    },
    
    setConnectedBackground: function() {
        var bgSprite;
        this.connectedBack = [];
        for (var i = 0; i < this.connected.length; i++) {
            bgSprite = cc.LayerColor.create(cc.color(255, 255, 255, 100), this.bubbleWidth + blank,
                this.bubbleWidth + blank);
            var position = this.bubbleSprites[this.connected[i].x][this.connected[i].y].getPosition();
            bgSprite.setPosition(cc.p(position.x - blank / 2, position.y - blank / 2));
            bgSprite.setAnchorPoint(0, 0);
            this.addChild(bgSprite, 2);
            this.connectedBack.push(bgSprite);
        }
    },
    
    removeConnectedBackground: function() {
        if (this.connectedBack != null) {
            for (var i = 0; i < this.connectedBack.length; i++) {
                this.removeChild(this.connectedBack[i]);
            }
        }
        this.connectedBack = null;
    },
    
    inConnected: function (x, y) {
        var i;
        for (i = 0; i < this.connected.length; i++) {
            if (x === this.connected[i].x && y === this.connected[i].y) {
                return true;
            }
        }
        return false;
    },

    checkGameStatus: function() {
        if (!this.bubbleModel.checkHasConnected()) {
            if (this.score >= this.requireScore) {
                this.removeRestBubbles();
                return;
                this.level++;
                this.removeRestBubbles();

                var lblDelay = cc.DelayTime.create(this.nextLevelDelayTime);
                var fadeOut1 = cc.FadeOut.create(0.2);
                var fadeOut2 = cc.FadeOut.create(0.2);
                var fadeOut3 = cc.FadeOut.create(0.2);
                var fadeCallFun = cc.CallFunc.create(function() {
                    if (this.level < 6) {
                        this.requireScore += SCORE_STEP;
                    } else {
                        this.requireScore += SCORE_STEP + 500 * (this.level - 5);
                    }
                    var nextLblLevel = cc.LabelTTF.create("LEVEL " + this.level, FONT_TYPE, 32);
                    nextLblLevel.setPosition(cc.p(size.width + nextLblLevel.getContentSize().width / 2,
                        size.height / 2 + 20));
                    nextLblLevel.setColor(cc.color(255, 255, 255, 255));
                    var nextLblScore = cc.LabelTTF.create("Target: " + this.requireScore);
                    nextLblScore.setPosition(cc.p(size.width + nextLblScore.getContentSize().width / 2,
                        size.height / 2));
                    nextLblScore.setColor(cc.color(255, 255, 255, 255));

                    this.addChild(nextLblLevel);
                    this.addChild(nextLblScore);
                    var moveLeft = cc.MoveTo.create(2, cc.p(0, size.height / 2 + 20));
                    var moveLeft1 = cc.MoveTo.create(2, cc.p(0, size.height / 2));
                    var moveEase = cc.EaseOut.create(moveLeft, 3);
                    var moveEase1 = cc.EaseOut.create(moveLeft1, 3);
                    var callFun = cc.CallFunc.create(function() {
                        this.removeChild(nextLblLevel);
                        this.removeChild(nextLblScore);
                        this.addBubbles();
                        this.lblScore.setString(this.score + "/" + this.requireScore);
                        this.lblLevel.setString("LEVEL " + this.level);
                        var fadeIn1 = cc.FadeIn.create(0.5);
                        var fadeIn2 = cc.FadeIn.create(0.5);
                        var fadeIn3 = cc.FadeIn.create(0.5);
                        this.lblScore.runAction(fadeIn1);
                        this.lblLevel.runAction(fadeIn2);
                    }, this);
                    var actionSeq = cc.Sequence.create(moveEase1, callFun);
                    nextLblLevel.runAction(moveEase);
                    nextLblScore.runAction(actionSeq);
                }, this);
                var sequence1 = cc.Sequence.create(lblDelay, fadeOut1);
                var sequence2 = cc.Sequence.create(lblDelay, fadeOut2);
                var sequence3 = cc.Sequence.create(lblDelay, fadeOut3, fadeCallFun);
                this.lblScore.runAction(sequence1);
                this.lblLevel.runAction(sequence2);
            } else {
                // this.removeRestBubbles();
                this.gameOver();
            }
        }
    },

    removeRestBubbles: function() {
        this.nextLevelDelayTime = 1;
        for (var i = 0; i < ROW; i++) {
            for (var j = 0; j < COL; j++) {
                if (this.bubbleSprites[i][j] != null) {
                    //var fadeOut = cc.FadeOut.create(delayTime);
                    var delay = cc.DelayTime.create(this.nextLevelDelayTime);
                    var callFun = cc.CallFunc.create(function (sprite) {
                        this.rest -= 1;
                        this.updateMaskLayer();
                        sprite.setVisible(false);
                        cc.audioEngine.playEffect(s_remove_sound);
                        var particle = cc.ParticleSystem.create(s_bubble_remove);
                        var positionX = sprite.getPosition().x + this.bubbleWidth / 2;
                        var positionY = sprite.getPosition().y + this.bubbleWidth / 2;
                        particle.setPosition(cc.p(positionX, positionY));
                        particle.setAutoRemoveOnFinish(true);
                        this.addChild(particle, 5);
                    }, this, this.bubbleSprites[i][j]);
                    var sequence;
                    if (i === ROW - 1 && j === COL - 1) {
                        var callFun1 = cc.CallFunc.create(function() {
                            for (var i = 0; i < SCOPE; i++) {
                                this.bubbleBatchNodes[i].removeAllChildren(true);
                            }
                            this.bubbleSprites.length = 0;
                        }, this);
                        sequence = cc.Sequence.create(delay, callFun, callFun1);
                    } else {
                        sequence = cc.Sequence.create(delay, callFun);
                    }
                    this.bubbleSprites[i][j].runAction(sequence);
                    this.nextLevelDelayTime += 0.2;
                }
            }
        }
    },

    blurSprite: function(sprite) {
        var blurSize = cc.size(40, 40);
        if('opengl' in cc.sys.capabilities){
            cc.log('support opengl shader');
            var shader = new cc.GLProgram(s_gassian_blur_vsh, s_gassian_blur_fsh);
            shader.retain();
            shader.addAttribute(cc.ATTRIBUTE_NAME_POSITION, cc.VERTEX_ATTRIB_POSITION);
            shader.addAttribute(cc.ATTRIBUTE_NAME_COLOR, cc.VERTEX_ATTRIB_COLOR);
            shader.addAttribute(cc.ATTRIBUTE_NAME_TEX_COORD, cc.VERTEX_ATTRIB_TEX_COORDS);
            shader.link();
            shader.updateUniforms();
            shader.use();
            shader.setUniformLocationWith2f(shader.getUniformLocationForName('blurSize'), blurSize.width, blurSize.height);
            sprite.shaderProgram = shader;
        }else{
            cc.log('no support opengl shader');
        }
    },

    updateMaskLayer: function(){
        if(this.maskLayer) this.removeChild(this.maskLayer);
        this.maskLayer = cc.LayerColor.create(cc.color(0, 0, 0, 250 * this.rest / 100 ), size.width, size.height);
        this.maskLayer.setAnchorPoint(cc.p(0, 0));
        this.maskLayer.setPosition(cc.p(0, 0));
        this.addChild(this.maskLayer, 1);
    },

    gameOver: function () {
        this.setTouchEnabled(false);
        this.resultLayer.setVisible(true);
        gameState = STATE_FINISHED;
    },

    update: function() {
        this.setVisibleLayers();
        switch(gameState) {
            case STATE_PREPARE:
                this.titleLayer.update();
                break;

            case STATE_RUNNING:
                // do nothing
                break;

            case STATE_FINISHED:
                this.resultLayer.update();
                break;
        }
    },
    
    setVisibleLayers: function() {
        switch(gameState) {
            case STATE_PREPARE:
                this.titleLayer.setVisible(true);
                this.resultLayer.setVisible(false);
                break;

            case STATE_RUNNING:
                this.titleLayer.setVisible(false);
                this.resultLayer.setVisible(false);
                break;

            case STATE_FINISHED:
                this.titleLayer.setVisible(false);
                this.resultLayer.setVisible(true);
                break;
        }
    }
});
