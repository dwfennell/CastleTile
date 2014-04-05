"use strict";
define(['app/tiles', 'app/board-drawing', 'app/settings', 'data/base-set', 'd3'], function (tiles, boardDraw, gameSettings, tileDefinitions, d3) {
    function selectSpace() {
        if (currentUnplacedTile) {
            placeTile(x, y, currentUnplacedTile);
            boardDraw.resetNewTile();
            currentUnplacedTile = null;

            boardDraw.clearAvailableSpaces();
        }
    }

    function setAvailableSpace(x, y) {
        var selectSpaceCallback = function selectSpaceCallback() {
            if (currentUnplacedTile) {
                placeTile(x, y, currentUnplacedTile);
                boardDraw.resetNewTile();
                currentUnplacedTile = null;
                boardDraw.clearAvailableSpaces();
            }
        }

        boardDraw.paintAvailableSpace(x, y, selectSpaceCallback);
    }

    function highlightAvailableSpaces(tile) {
        if (!tiles.placedTiles) return;

        for (var i = 0; i < tiles.placedTiles.length; i++) {
            for (var j = 0; j < tiles.placedTiles[i].length; j++) {
                var x = i,
                    y = j;

                var selectSpaceCallback = function selectSpaceCallback() {
                    if (currentUnplacedTile) {
                        placeTile(x, y, currentUnplacedTile);
                        boardDraw.resetNewTile();
                        currentUnplacedTile = null;
                        boardDraw.clearAvailableSpaces();
                    }
                }

                if (tiles.isSpaceAvailable(tile, i, j)) {
                    setAvailableSpace(i, j, selectSpaceCallback);
                }
            }
        }
    }

    function getNewTile() {
        if (!tiles.isMoreTiles()) {
            alert("No tiles left!");
            return;
        }

        currentUnplacedTile = isFirstTurn ? tiles.startingTile : tiles.pickTile();
    function isRoadClosed(x, y, edgeIndex) {
        //isClosed = 

        // isCLosedArray ... is a parallel array for road ended flags, when an 
        // end road is connected it flips the road it touches to "e=true", 
        // contuning to flip until it comes to an intersection. 
        // If the flipping stops without reaching an intersection, then isRoadClosed is TRUE . 

    }

    function isCityClosed(x, y, interiorIndex) {
        
        // city flips adacent city tiles's "city segment closed" flag to true. 
        // like roads, it keeps flipping until it finds an intersection. 

    }

    function scoreRoad(x, y, edgeIndex) {

    }

    function scoreCity(x, y, interiorIndex) {

    }

    function checkFeaturesComplete(tileArray, tile, newTileX, newTileY) {
        for (var i = 0; i < 4; i++) {
            if (tile.edges[i] === "e" && isRoadClosed(x, y, i)) {
                scoreRoad(x, y, i);
            } else if (tile.edges[i] == "c" && isCityClosed(x, y, i) {
                scoreCity(x, y, i);
            }
        }
    }


        var rotateAndPaint = function rotateAndPaint() {
            currentUnplacedTile = tiles.rotateTile(currentUnplacedTile);
            boardDraw.paintNewTile(currentUnplacedTile, rotateAndPaint);
            boardDraw.clearAvailableSpaces();
            highlightAvailableSpaces(currentUnplacedTile);
        };

        boardDraw.paintNewTile(currentUnplacedTile, rotateAndPaint);

        highlightAvailableSpaces(currentUnplacedTile);
        isFirstTurn = false;
    };

    function placeTile(x, y, tile) {
        tiles.updateTilesArray(tiles.placedTiles, x, y, tile);
        boardDraw.redrawBoard(tiles.placedTiles);
    }
    
    function init() {
        isFirstTurn = true;

        boardDraw.init(gameSettings);

        d3.select("#" + gameSettings.newTileButtonIdentifier)
            .on('click', getNewTile)
    }

    var isFirstTurn;
    var currentUnplacedTile;

    return {
        init: init
    };
});