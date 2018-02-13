/**
 * Created by strawmanbobi
 * 2018-02-04
 */

(function () {
    function BubbleModel(_row, _col, _scope) {
        this.row = _row;
        this.col = _col;
        this.scope = _scope;
        this.bubbleArray = [];

        for (var r = 0; r < this.row; r++) {
            var rowBubble = [];
            for (var c = 0; c < this.col; c++) {
                var rand = Math.floor(Math.random() * this.scope);
                rowBubble.push(rand);
            }
            this.bubbleArray.push(rowBubble);
        }
    }

    BubbleModel.prototype.findConnectedBubblesInner = function (row, col, arr, bubbles, bubbleType) {
        if (bubbles[row][col] === bubbleType) {
            bubbles[row][col] = -1;
            arr.push({'x': row, 'y': col});
            if (row - 1 >= 0) {
                this.findConnectedBubblesInner(row - 1, col, arr, bubbles, bubbleType);
            }
            if (row + 1 <= this.row - 1) {
                this.findConnectedBubblesInner(row + 1, col, arr, bubbles, bubbleType);
            }
            if (col - 1 >= 0) {
                this.findConnectedBubblesInner(row, col - 1, arr, bubbles, bubbleType);
            }
            if (col + 1 <= this.col - 1) {
                this.findConnectedBubblesInner(row, col + 1, arr, bubbles, bubbleType);
            }
        }
    };

    BubbleModel.prototype.findConnnectedBubbles = function (row, col) {
        var connected = [];
        if (row < 0 || row >= this.row) return connected;
        if (col < 0 || col >= this.col) return connected;
        if (this.bubbleArray[row][col] === -1) {
            return connected;
        }
        var bubbles = [];
        for (var i = 0; i < this.bubbleArray.length; i++) {
            var bubble = [];
            for (var j = 0; j < this.bubbleArray[i].length; j++) {
                bubble.push(this.bubbleArray[i][j])
            }
            bubbles.push(bubble);
        }
        this.findConnectedBubblesInner(row, col, connected, bubbles, bubbles[row][col]);
        return connected;
    };

    BubbleModel.prototype.removeConnectedBubble = function (row, col) {
        if (row < 0 || row >= this.row) return;
        if (col < 0 || col >= this.col) return;
        for (var i = row; i > 0; i--) {
            this.bubbleArray[i][col] = this.bubbleArray[i - 1][col];
        }
        this.bubbleArray[i][col] = -1;
    };

    BubbleModel.prototype.checkNullCol = function () {
        for (var i = this.col; i > 0; i--) {
            for (var j = 0; j < this.row; j++) {
                if (this.bubbleArray[j][i] !== -1) break;
            }
            if (j === this.row) {
                return i;
            }
        }
        return null;
    };

    BubbleModel.prototype.updateAndMove = function (nullCol) {
        for (var i = 0; i < this.row; i++) {
            for (var j = nullCol; j > 0; j--) {
                this.bubbleArray[i][j] = this.bubbleArray[i][j - 1];
            }
            this.bubbleArray[i][j] = -1;
        }
    };

    BubbleModel.prototype.checkHasConnected = function () {
        for (var i = 0; i < this.row; i++) {
            for (var j = 0; j < this.col - 1; j++) {
                if (this.bubbleArray[i][j] !== -1 &&
                    this.bubbleArray[i][j + 1] !== -1 &&
                    this.bubbleArray[i][j] === this.bubbleArray[i][j + 1]) {
                    return true;
                }
            }
        }
        for (var n = 0; n < this.col; n++) {
            for (var m = 0; m < this.row - 1; m++) {
                if (this.bubbleArray[m][n] !== -1 &&
                    this.bubbleArray[m + 1][n] !== -1 &&
                    this.bubbleArray[m][n] === this.bubbleArray[m + 1][n]) {
                    return true;
                }
            }
        }
        return false;
    };

    return this.BubbleModel = window.BubbleModel = BubbleModel;

})();