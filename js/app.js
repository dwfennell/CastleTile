requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app',
        data: '../data'
    }
});

requirejs(['app/board'],
function (board, tileSet) {
    board.paintTile(0, 0, board.pickTile());
    board.paintTile(1, 2, board.pickTile());
});