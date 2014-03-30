"use strict";
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
                hasShield: input.shield,
                hasCloister: input.cloister
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
        return tile;
    }
    
    function isMoreTiles () {
        return pile.length > 0;
    }

    function rotateTile(tile) {
        var e = tile.edges;
        var i = tile.interior;

        tile.edges = [e[3], e[0], e[1], e[2]].join("");
        tile.interior = [i[3], i[0], i[1], i[2]].join("");

        return tile;
    }

    function updateTilesArray(tileArray, x, y, tile) {
        function makeBlankRow() {
            if (tileArray && tileArray[0]) {
                var array = [];
                for (var i = 0; i < tileArray[0].length; i++) {
                    array[i] = null;
                }
                return array;
            } else {
                return [];
            }
        }

        tileArray[x][y] = tile;

        var isFirstRowEmpty = true;
        var isLastRowEmpty = true;
        var isFirstColEmpty = true;
        var isLastColEmpty = true;

        // If any space in the top row is non-empty add a new top row that is empty.
        for (var i = 0; i < tileArray[0].length; i++) {
            if (tileArray[0][i] !== null) {
                isFirstRowEmpty = false;
                break;
            }
        }

        // If any space in the last row is non-empty add a new bottom row that is empty.
        var lastRowIndex = tileArray.length - 1;
        for (var i = 0; i < tileArray[lastRowIndex].length; i++) {
            if (tileArray[lastRowIndex][i] !== null) {
                isLastRowEmpty = false;
                break;
            }
        }

        // If any space in the first or last columns are non-empty add a new respective empty columns.
        var lastColumnIndex = tileArray[0].length - 1
        for (var i = 0; i < tileArray.length; i++) {
            if (isFirstColEmpty && tileArray[i][0] !== null) {
                isFirstColEmpty = false;
            }
            if (isLastColEmpty && tileArray[i][lastColumnIndex] !== null) {
                isLastColEmpty = false;
            }
        }

        if (!isFirstColEmpty) {
            tileArray.forEach(function (entry) {
                entry.splice(0, 0, null);
            });
        }

        if (!isLastColEmpty) {
            tileArray.forEach(function (entry) {
                entry.push(null);
            });
        }

        if (!isFirstRowEmpty) {
            tileArray.splice(0, 0, makeBlankRow());
        }

        if (!isLastRowEmpty) {
            tileArray.push(makeBlankRow());
        }
    }


    var pile = [];
    var startTile = parseTiles(tileDefinitions);

    var placedTiles = [
        [null]
    ];

    return {
        pile: pile,
        startingTile: startTile,
        placedTiles: placedTiles,
        pickTile: pickTile,
        isMoreTiles: isMoreTiles,
        rotateTile: rotateTile,
        updateTilesArray: updateTilesArray
    };
});