define(['d3', 'app/settings'], function (d3, gameSettings) {
    var boardContainer = d3.select("#board")
        .append("svg:svg")
        .attr("width", gameSettings.boardWidth)
        .attr("height", gameSettings.boardHeight);

    var tiles = [];

    var board = {
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
            },

        addTiles:
            function (tileSet) {
                // We expect tileSet to be an array of tile objects formatted like: 
                //
                //  { 
                //      num: <int: number copies of this tile in the set>, 
                //      edges: <edge-of-tile code>,
                //      interior: <inside-of-tile code>,
                //      sheild: <boolean: does this tile have a sheild>
                //      isStartingTile: <boolean: is this the starting tile?>
                //  }

                tileSet.tiles.forEach(function (tileDef) {
                    for (var i = 0; i < tileDef.num; i++) {
                        tiles.push(
                            {
                                edges: tileDef.edges,
                                interior: tileDef.interior,
                                isStartingTile: tileDef.isStartingTile,
                                hasShield: tileDef.hasShield
                            });
                    }
                });
            },

        pickTile:
            function () {
                d3.shuffle(tiles);
                tile = tiles.pop();

                console.log("Picked a tile! Edges:" + tile.edges + " , Interior: " + tile.interior + ". Tiles left: " + tiles.length);
                return tile;
            }
    };
    
    return board;
});