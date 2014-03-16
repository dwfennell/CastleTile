define(['d3', 'app/settings'], function (d3, gameSettings) {
    boardContainer = d3.select("#board")
        .append("svg:svg")
        .attr("width", gameSettings.boardWidth)
        .attr("height", gameSettings.boardHeight);

    board = {
        drawTile:
            function (x, y) {
                boardContainer.append("svg:rect")
                    .attr("x", x * gameSettings.tileLength)
                    .attr("y", y * gameSettings.tileLength)
                    .attr("height", gameSettings.tileLength)
                    .attr("width", gameSettings.tileLength)
                    .attr("class", "tile");
            },
        makeNewTileArea:
            function () {
                return d3.select("#new-tile-zone")
                    .append("svg:svg")
                    .attr("width", gameSettings.tileLength + 20)
                    .attr("height", gameSettings.tileLength + 20)
                    .on("click", function () { alert("woo"); })
            },
        newTile:
            function (newTileArea) {
                newTileArea.append("svg:rect")
                    .attr("x", x * gameSettings.tileLength)
                    .attr("y", y * gameSettings.tileLength)
                    .attr("height", gameSettings.tileLength)
                    .attr("width", gameSettings.tileLength)
                    .attr("class", "new-tile");
            }
    };
    
    return board;
});