requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app',
        data: '../data'
    }
});

requirejs(['app/board'],
function (board) {
    board.drawTile(0, 0);
});