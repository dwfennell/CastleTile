define(['d3', 'app/settings', 'data/base-set'], function (d3, gameSettings, tileDefinitions) {
    
    function parseTiles(tileSet) {
        // We expect tileSet to be an array of tile objects formatted like: 
        //
        //  { 
        //      num: <int: number copies of this tile in the set>, 
        //      edges: <edge-of-tile code>,
        //      interior: <inside-of-tile code>,
        //      sheild: <boolean: does this tile have a sheild>
        //      isStartingTile: <boolean: is this the starting tile?>
        //  }

        var makeTile = function makeTile(input) {
            return {
                edges: input.edges,
                interior: input.interior,
                isStartingTile: input.isStartingTile,
                hasShield: input.shield
            };
        }

        var importedTiles = [];
        var startingTile;
        tileSet.tiles.forEach(function (tileDef) {
            for (var i = 0; i < tileDef.num; i++) {
                // tileDef.num determines how many tiles of this type are in the set.
                
                if (tileDef.isStartingTile === true) {
                    startingTile = makeTile(tileDef);
                } else {
                    importedTiles.push(makeTile(tileDef));
                }
            }
        });

        return { tiles: importedTiles, startingTile: startingTile };
    }

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

    
    // Populate tiles and startinTile.
    var tileData = parseTiles(tileDefinitions);
    var startingTile = tileData.startingTile;
    var tiles = tileData.tiles;

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

        pickTile:
            function () {
                d3.shuffle(tiles);
                tile = tiles.pop();

                console.log("Picked a tile! Edges:" + tile.edges + " , Interior: " + tile.interior + ". Tiles left: " + tiles.length);
                return tile;
            },
        startingTile: startingTile
    };
    
    return board;
});