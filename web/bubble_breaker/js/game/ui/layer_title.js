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

    // sprites
    bgSprite: null,
    titleSprite: null,
    noteSprite: null,

    // labels

    // buttons
    startButton: null,
    gen4MeButton: null,

    // menus

    // layers

    // design specs
    screenWidthMax: 720,
    bgRealWidth: 1080,
    bgRealHeight: 1920,
    logoRealWidth: 906,
    buttonRealWidth: 448,

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
        this.bgSprite = new cc.Sprite(s_bg);
        this.bgSprite.setAnchorPoint(0, 0);
        this.bgSprite.setScale(this.gameScale);
        this.bgSprite.setPosition(0, 0);
        this.addChild(this.bgSprite, 0);

        // initialize title
        this.titleSprite = new cc.Sprite(s_logo);
        this.titleSprite.setAnchorPoint(0.5, 0);
        var titleScale = this.gameScale;
        this.titleSprite.setScale(titleScale);
        this.titleSprite.setPosition(this.validWidth / 2, this.validHeight / 8 * 4);
        this.addChild(this.titleSprite, 20);
        // add animation to title
        var action = cc.Sequence.create(
            cc.RotateBy.create(0.25, 5),
            cc.CallFunc.create(this.onTitleRotatedPlus, this));
        this.titleSprite.runAction(action);

        /*
        // initialize note
        this.noteSprite = new cc.Sprite(s_note);
        this.noteSprite.setAnchorPoint(0.5, 0);
        this.noteSprite.setScale(this.titleScale * 0.75);
        this.noteSprite.setPosition(this.validWidth / 2, this.validHeight / 8 * 5);
        this.addChild(this.noteSprite, 10);
        */

        // initialize buttons
        this.startButton = new ccui.Button(s_button_start, s_button_start_pressed);
        this.startButton.setAnchorPoint(0, 0);
        var buttonScale = this.gameScale;
        this.startButton.setScale(buttonScale);
        this.startButton.setPosition((this.validWidth -
            this.buttonRealWidth * buttonScale) / 2,
            this.validHeight / 8 * 2);
        this.addChild(this.startButton, 10);
        this.startButton.addTouchEventListener(function (sender, type) {
            if (ccui.Widget.TOUCH_ENDED === type) {
                gameState = STATE_RUNNING;
            }
        }, this);

        this.gen4MeButton = new ccui.Button(s_button_create, s_button_create_pressed);
        this.gen4MeButton.setAnchorPoint(0, 0);
        this.gen4MeButton.setScale(buttonScale);
        this.gen4MeButton.setPosition((this.validWidth -
            this.buttonRealWidth * buttonScale) / 2,
            this.validHeight / 8);
        this.addChild(this.gen4MeButton, 10);
        this.gen4MeButton.addTouchEventListener(function (sender, type) {
            if (ccui.Widget.TOUCH_ENDED === type) {
                window.location = "./create.html";
            }
        }, this);

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

    }
});