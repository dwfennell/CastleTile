define(['app/board'], function (board) {

    function start() {
        board.init();
        board.paintTile(1, 1, board.pickTile());
    }

    return {
        start: start
    };
});