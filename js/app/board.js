"use strict";
define(['app/tiles', 'app/board-drawing', 'app/settings', 'data/base-set', 'd3'], function (tiles, boardDraw, gameSettings, tileDefinitions, d3) {

    // Game logic functions.

    function selectSpace() {
        if (currentUnplacedTile) {
            placeTile(x, y, currentUnplacedTile);
            boardDraw.resetNewTile();
            currentUnplacedTile = null;

            boardDraw.clearAvailableSpaceHighlights();
        }
    }

    function setAvailableSpace(x, y) {
        var selectSpaceCallback = function selectSpaceCallback() {
            if (currentUnplacedTile) {
                placeTile(x, y, currentUnplacedTile);
                boardDraw.resetNewTile();
                currentUnplacedTile = null;
                boardDraw.clearAvailableSpaceHighlights();
            }
        }
        
        boardDraw.paintSquare(x, y, gameSettings.availableSpaceIdentifier, selectSpaceCallback);
    }

    function highlightAvailableSpaces(tileArray, tile) {
        if (!tileArray) return;

        for (var i = 0; i < tileArray.length; i++) {
            for (var j = 0; j < tileArray[i].length; j++) {
                if (canPlaceTile(tileArray, i, j)) {
                    setAvailableSpace(i, j);
                }
            }
        }
    }

    function canPlaceTile(tileArray, x, y) {
        var tile = tileArray[x][y];

        if (tile !== null) {
            // Coordinates occupied.
            return false;
        }

        if (tileArray.length === 1 && tileArray[x].length === 1) {
            // First turn.
            return true;
        }

        // Are we connected to any tile at all? 
        var isTouchingATile = false;
        if (x > 0 && tileArray[x - 1][y] !== null) {
            isTouchingATile = true;
        } else if (x < tileArray.length - 1 && tileArray[x + 1][y] !== null) {
            isTouchingATile = true;
        } else if (y > 0 && tileArray[x][y - 1] !== null) {
            isTouchingATile = true;
        } else if (y < tileArray[x].length - 1 && tileArray[x][y + 1] !== null) {
            isTouchingATile = true;
        }

        // More here later. Need to check tile compatability.
        return isTouchingATile;
    }

    function getNewTile() {
        if (!tiles.isMoreTiles()) {
            alert("No tiles left!");
        }

        currentUnplacedTile = isFirstTurn ? tiles.startingTile : tiles.pickTile();

        var rotateAndPaint = function rotateAndPaint() {
            currentUnplacedTile = tiles.rotateTile(currentUnplacedTile);
            boardDraw.paintNewTile(currentUnplacedTile, rotateAndPaint);
        };

        boardDraw.paintNewTile(currentUnplacedTile, rotateAndPaint);

        highlightAvailableSpaces(tiles.placedTiles, currentUnplacedTile);
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