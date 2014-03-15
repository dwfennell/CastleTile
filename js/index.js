function makeBoard(width, height) {
    return d3.select("#rect-demo").
        append("svg:svg").
        attr("width", width).
        attr("height", height);
}

function drawTile(board, x, y) {
    board.append("svg:rect").
        attr("x", x * gameSettings.tileLength).
        attr("y", y * gameSettings.tileLength).
        attr("height", gameSettings.tileLength).
        attr("width", gameSettings.tileLength);
}

var gameSettings = {
    boardWidth: 600,
    boardHeight: 600,
    tileLength: 50
}

board = makeBoard(gameSettings.boardWidth, gameSettings.boardHeight);

drawTile(board, 0, 0);
drawTile(board, 2, 2);
drawTile(board, 1, 3);
drawTile(board, 0, 4);



