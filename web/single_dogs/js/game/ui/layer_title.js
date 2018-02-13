/**
 * Created by strawmanbobi
 * 2018-02-10
 */

var TitleLayer = cc.Layer.extend({
    // constants
    titleFont: 'Arial',
    titleTextSize: 64,

    // game model variables
    size: null,
    validWidth: 0,
    validHeight: 0,

    // scales
    gameScale: 1.0,
    bgWScale: 1.0,
    bgHScale: 1.0,

    // sprites
    bgSprite: null,
    titleSprite: null,

    // labels
    visitLabel: null,
    noteLabel: null,

    // buttons
    startButton: null,
    createButton: null,

    // menus

    // layers

    // design specs
    screenWidthMax: 720,
    bgRealWidth: 1080,
    bgRealHeight: 1920,
    logoRealWidth: 906,
    logoRealHeight: 605,
    buttonRealWidth: 448,
    noteWidth: 960,
    noteHeight: 320,
    visitWidth: 960,
    visitHeight: 40,

    // event managers
    eventListener: null,

    // constructor
    ctor: function (gameScale) {
        this._super();
        this.gameScale = gameScale;
    },

    // game initializer
    init: function () {
        this._super(cc.color(0, 0, 0, 239));

        // initiate layout on DealerLayer
        this.validWidth = gameWidth;
        this.validHeight = gameHeight;

        this.size = cc.size(this.validWidth, this.validHeight);

        // initialize background
        this.bgWScale = size.width / this.bgRealWidth;
        this.bgHScale = size.height / this.bgRealHeight;
        this.bgSprite = new cc.Sprite(s_bg);
        this.bgSprite.setAnchorPoint(0, 0);
        this.bgSprite.setScaleX(this.bgWScale);
        this.bgSprite.setScaleY(this.bgHScale);
        this.bgSprite.setPosition(0, 0);
        this.addChild(this.bgSprite, 0);

        // initialize title
        this.titleSprite = new cc.Sprite(s_logo);
        this.titleSprite.setAnchorPoint(0.5, 0);
        var titleScale = this.gameScale * 0.8;
        this.titleSprite.setScale(titleScale);
        this.titleSprite.setPosition(this.validWidth / 2, this.validHeight / 16 * 10);
        this.addChild(this.titleSprite, 20);
        // add animation to title
        var action = cc.Sequence.create(
            cc.RotateBy.create(0.25, 5),
            cc.CallFunc.create(this.onTitleRotatedPlus, this));
        this.titleSprite.runAction(action);

        // initialize note
        this.noteLabel = new cc.LabelTTF("", this.FONT_TYPE, 48);
        this.noteLabel.setColor(cc.color(255, 255, 255, 255));
        this.noteLabel.setAnchorPoint(0, 0);
        this.noteLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.noteLabel.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this.noteLabel.boundingWidth = this.noteWidth;
        this.noteLabel.boundingHeight = this.noteHeight;
        this.noteLabel.setScale(this.gameScale);
        this.noteLabel
            .setPosition((this.bgSprite.getContentSize().width - this.noteLabel.getContentSize().width) / 2
                * this.gameScale, this.validHeight / 16 * 6);
        this.addChild(this.noteLabel, 2);

        // initialize buttons
        this.startButton = new ccui.Button(s_button_start, s_button_start_pressed);
        this.startButton.setAnchorPoint(0, 0);
        var buttonScale = this.gameScale;
        this.startButton.setScale(buttonScale);
        this.startButton.setPosition((this.validWidth -
            this.buttonRealWidth * buttonScale) / 2,
            this.validHeight / 16 * 4);
        this.addChild(this.startButton, 10);
        this.startButton.addTouchEventListener(function (sender, type) {
            if (ccui.Widget.TOUCH_ENDED === type) {
                gameState = STATE_RUNNING;
            }
        }, this);

        this.createButton = new ccui.Button(s_button_create, s_button_create_pressed);
        this.createButton.setAnchorPoint(0, 0);
        this.createButton.setScale(buttonScale);
        this.createButton.setPosition((this.validWidth -
            this.buttonRealWidth * buttonScale) / 2,
            this.validHeight / 16 * 2);
        this.addChild(this.createButton, 10);
        this.createButton.addTouchEventListener(function (sender, type) {
            if (ccui.Widget.TOUCH_ENDED === type) {
                gotoCreate();
            }
        }, this);

        // initialize visit
        var shadowColor;
        this.visitLabel = new cc.LabelTTF("0人玩过你的游戏", this.FONT_TYPE, 48);
        this.visitLabel.setColor(cc.color(255, 255, 255, 255));
        this.visitLabel.setAnchorPoint(0, 0);
        this.visitLabel.setHorizontalAlignment(cc.TEXT_ALIGNMENT_CENTER);
        this.visitLabel.setVerticalAlignment(cc.VERTICAL_TEXT_ALIGNMENT_CENTER);
        this.visitLabel.boundingWidth = this.visitWidth;
        this.visitLabel.boundingHeight = this.visitHeight;
        shadowColor = cc.color(128, 128, 128);
        this.visitLabel.enableShadow(shadowColor, cc.size(0, -4), 0);
        this.visitLabel.setScale(this.gameScale);
        this.visitLabel
            .setPosition((this.bgSprite.getContentSize().width - this.visitLabel.getContentSize().width) / 2
                * this.gameScale, this.validHeight / 16);
        this.addChild(this.visitLabel, 2);

        // event management
        this.eventListener = new cc.EventListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: function (/*touch, event*/) {
                return true;
            },
            // trigger when moving touch
            onTouchMoved: function (/*touch, event*/) {
                return true;
            },
            // process the touch end event
            onTouchEnded: function (/*touch, event*/) {
                return true;
            }
        });
        cc.eventManager.addListener(this.eventListener, this);
    },

    onTitleRotatedPlus: function() {
        var action = cc.Sequence.create(
            cc.RotateBy.create(0.5, -10),
            cc.CallFunc.create(this.onTitleRotatedMinus, this));
        this.titleSprite.runAction(action);
    },

    onTitleRotatedMinus: function() {
        var action = cc.Sequence.create(
            cc.RotateBy.create(0.5, 10),
            cc.CallFunc.create(this.onTitleRotatedPlus, this));
        this.titleSprite.runAction(action);
    },

    // game operations
    update: function () {
        this.doUpdate();
    },

    reset: function () {
    },

    removeAll: function () {
        this.reset();
    },

    doUpdate: function () {
        // update visit label
        this.noteLabel.setString(word);
        if (null === visited) {
            visited = 1;
        }
        this.visitLabel.setString(visited + "人玩过你的游戏");
    }
});