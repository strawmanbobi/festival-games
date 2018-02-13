/**
 * Created by strawmanbobi on 2014-11-05.
 */

var STATE_NONE = -1;
var STATE_PREPARE = 0;
var STATE_COUNT_DOWN = 1;
var STATE_RUNNING = 2;
var STATE_FINISHED = 3;
var STATE_OVER = 4;

var gameStatus = STATE_NONE;
var gameGender = 0;

var g_imgURL = "";
var g_link = location.href;
var g_title = "光棍都来脱光光";
var g_desc = "光棍节，专门为还是“光棍”的你准备的“脱光”游戏！";
var g_hideOption = false;