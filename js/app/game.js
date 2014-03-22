"use strict";
define(['app/board'], function (board) {

    function start() {
        board.init();
    }

    return {
        start: start
    };
});