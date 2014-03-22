define(['data/base-set', 'd3'], function (tileDefinitions, d3) {

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

        var startingTile;
        tileSet.tiles.forEach(function (tileDef) {
            for (var i = 0; i < tileDef.num; i++) {
                // tileDef.num determines how many tiles of this type are in the set.

                if (tileDef.isStartingTile === true) {
                    startingTile = makeTile(tileDef);
                } else {
                    pile.push(makeTile(tileDef));
                }
            }
        });

        return startingTile;
    }

    function pickTile() {
        d3.shuffle(pile);
        var tile = pile.pop();
        console.log("Picked a tile! Edges:" + tile.edges + " , Interior: " + tile.interior + ". Tiles left: " + pile.length);
        return tile;
    }
    
    function isMoreTiles () {
        return pile.length > 0;
    }

    var pile = [];
    var startTile = parseTiles(tileDefinitions);

    return {
        pile: pile,
        startingTile: startTile,
        pickTile: pickTile,
        isMoreTiles: isMoreTiles
    };
});