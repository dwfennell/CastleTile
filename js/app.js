requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app',
        data: '../data'
    }
});

requirejs(['app/board', 'data/base-set'],
function (board, tileSet) {
    board.drawTile(0, 0);
    board.drawTile(1, 3);
    
    board.addTiles(tileSet);

    var tile = board.pickTile();

});