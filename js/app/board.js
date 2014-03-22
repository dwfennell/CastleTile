define(['app/tiles', 'app/settings', 'data/base-set', 'd3'], function (tiles, gameSettings, tileDefinitions, d3) {
    function paintTilePixelCoords(x, y, tile, container, addClass) {
        if (!addClass)
            addClass = ""

        container.append("svg:rect")
            .attr("x", x)
            .attr("y", y)
            .attr("height", gameSettings.tileLength)
            .attr("width", gameSettings.tileLength)
            .attr("class", "tile " + addClass);

        if (tile !== undefined) {
            container.append("text")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", ".85em")
                .attr("dx", ".1em")
                .attr("class", addClass)
                .text("e: " + tile.edges);
            container.append("text")
                .attr("x", x)
                .attr("y", y)
                .attr("dy", "1.85em")
                .attr("dx", ".1em")
                .attr("class", addClass)
                .text("i: " + tile.interior);
        }
    }
    
    function paintTile (x, y, tile) {
        var xPix = x * gameSettings.tileLength;
        var yPix = y * gameSettings.tileLength;
        paintTilePixelCoords(xPix, yPix, tile, boardContainer);
    }

    function paintNewTile (tile) {
        d3.selectAll("unplaced-tile").remove();
        paintTilePixelCoords(0, 0, tile, newTileContainer, "unplaced-tile");
    }

    function getNewTile () {
        if (tiles.isMoreTiles()) {
            var currentUnplacedTile = isFirstTurn ? tiles.startingTile : tiles.pickTile();
            paintNewTile(currentUnplacedTile);
            isFirstTurn = false;
        } else {
            alert("No tiles left!");
        }
    };

    function init() {
        isFirstTurn = true;

        d3.select("#new-tile-button")
            .on('click', getNewTile)

        boardContainer = d3.select("#board")
            .append("svg:svg")
            .attr("width", gameSettings.boardWidth)
            .attr("height", gameSettings.boardHeight);

        newTileContainer = d3.select("#new-tile-entry")
            .append("svg:svg")
            .attr("width", gameSettings.tileLength)
            .attr("height", gameSettings.tileLength);
    }

    var isFirstTurn;
    var currentUnplacedTile;
    var boardContainer;
    var newTileContainer;

    return {
        init: init,
        paintTile: paintTile,
        paintNewTile: paintNewTile,
        pickTile: tiles.pickTile,
        startingTile: tiles.startingTile
    };
});