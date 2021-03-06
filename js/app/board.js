﻿"use strict";
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