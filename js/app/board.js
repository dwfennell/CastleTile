define(['app/tiles', 'app/settings', 'data/base-set', 'd3'], function (tiles, gameSettings, tileDefinitions, d3) {

    function paintTilePixelCoords(x, y, tile, container) {
        container.append("svg:rect")
            .attr("x", x)
            .attr("y", y)
            .attr("height", gameSettings.tileLength)
            .attr("width", gameSettings.tileLength)
            .attr("class", "tile");

        if (tile !== undefined) {
            container.append("text")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", ".85em")
                .attr("dx", ".1em")
                .text("e: " + tile.edges);
            container.append("text")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", "1.85em")
                .attr("dx", ".1em")
                .text("i: " + tile.interior);
        }
    }

    var boardContainer = d3.select("#board")
        .append("svg:svg")
        .attr("width", gameSettings.boardWidth)
        .attr("height", gameSettings.boardHeight);

    var newTileContainer = d3.select("#new-tile-entry")
               .append("svg:svg")
               .attr("width", gameSettings.tileLength)
               .attr("height", gameSettings.tileLength);

    var board = {
        paintTile:
            function (x, y, tile) {
                var xPix = x * gameSettings.tileLength;
                var yPix = y * gameSettings.tileLength;
                paintTilePixelCoords(xPix, yPix, tile, boardContainer);
            },

        paintNewTile:
            function (tile) {
                paintTilePixelCoords(0, 0, tile, newTileContainer);
            },

        pickTile: tiles.pickTile,
        startingTile: tiles.startingTile
    };
    
    return board;
});