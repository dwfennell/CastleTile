"use strict";
define(['app/tiles', 'app/settings', 'data/base-set', 'd3'], function (tiles, gameSettings, tileDefinitions, d3) {

    // Drawing functions.
    
    function paintTileDetails(container, xStartPix, yStartPix, tile, addClass) {
        if (!addClass) addClass = "";

        var tileLength = gameSettings.tileLength;
        var roadLength = gameSettings.roadSize * tileLength;
        var edgeLength = gameSettings.edgeSize * tileLength;

        // TODO: rotate tile as necessary. 

        // Draw roads.
        var roadClass = addClass + " road";
        if (tile.edges[0] === "r") {
            // bottom
            var xPix = xStartPix + (tileLength / 2) - (roadLength / 2);
            var yPix = yStartPix + tileLength - edgeLength;
            paintRectanglePixelCoords(container, xPix, yPix, roadLength, edgeLength, roadClass);
        }
        if (tile.edges[1] === "r") {
            // left
            var xPix = xStartPix;
            var yPix = yStartPix + (tileLength / 2) - (roadLength / 2);
            paintRectanglePixelCoords(container, xPix, yPix, edgeLength, roadLength, roadClass);
        }
        if (tile.edges[2] === "r") {
            // right
            var xPix = xStartPix + tileLength - edgeLength;
            var yPix = yStartPix + (tileLength / 2) - (roadLength / 2);
            paintRectanglePixelCoords(container, xPix, yPix, edgeLength, roadLength, roadClass);
        }
        if (tile.edges[3] === "r") {
            // top
            var xPix = xStartPix + tileLength / 2 - roadLength / 2;
            paintRectanglePixelCoords(container, xPix, yStartPix, roadLength, edgeLength, roadClass);
        }

        // Draw cities.
        if (tile.edges[0] === "c") {
            // Bottom
            var points = [
                [xStartPix, yStartPix + tileLength],
                [xStartPix + edgeLength, yStartPix + tileLength - edgeLength],
                [xStartPix + tileLength - edgeLength, yStartPix + tileLength - edgeLength],
                [xStartPix + tileLength, yStartPix + tileLength]
            ];

            makePolygon(container, points, addClass + " city");
        }
        if (tile.edges[1] === "c") {
            // Left
            var points = [
                [xStartPix, yStartPix],
                [xStartPix + edgeLength, yStartPix + edgeLength],
                [xStartPix + edgeLength, yStartPix + tileLength - edgeLength],
                [xStartPix, yStartPix + tileLength]
            ];

            makePolygon(container, points, addClass + " city");
        }
        if (tile.edges[2] === "c") {
            // Right 
            var points = [
                [xStartPix + tileLength, yStartPix],
                [xStartPix + tileLength - edgeLength, yStartPix + edgeLength],
                [xStartPix + tileLength - edgeLength, yStartPix + tileLength - edgeLength],
                [xStartPix + tileLength, yStartPix + tileLength]
            ];

            makePolygon(container, points, addClass + " city");
        }
        if (tile.edges[3] === "c") {
            // Top
            var points = [
                [xStartPix, yStartPix],
                [xStartPix + edgeLength, yStartPix + edgeLength],
                [xStartPix + tileLength - edgeLength, yStartPix + edgeLength],
                [xStartPix + tileLength, yStartPix]
            ];

            makePolygon(container, points, addClass + " city");
        }

        // TODO: Draw tile interiors.
    }

    function makePolygon(container, points, addClass) {
        // Make a polygon.
        if (!addClass) addClass = "";

        var line = d3.svg.line()
            .x(function (d, i) { return d[0]; })
            .y(function (d, i) { return d[1]; });

        container.append("svg:path")
            .attr("d", line(points))
            .attr("class", addClass);
    }


    function paintTile (x, y, tile) {
        var xPix = x * gameSettings.tileLength;
        var yPix = y * gameSettings.tileLength;
        paintTilePixelCoords(boardContainer, xPix, yPix, tile, PLACED_TILE_CLASS);
    }

    function paintTilePixelCoords(container, x, y, tile, addClass) {
        if (!addClass) addClass = "";

        paintSquarePixelCoords(container, x, y, "tile " + addClass);

        paintTileDetails(container, x, y, tile, addClass);

        //if (tile !== undefined) {
        //    container.append("text")
        //        .attr("x", x)
        //        .attr("y", y)
        //        .attr("dy", ".85em")
        //        .attr("dx", ".1em")
        //        .attr("class", addClass)
        //        .text("e: " + tile.edges);
        //    container.append("text")
        //        .attr("x", x)
        //        .attr("y", y)
        //        .attr("dy", "1.85em")
        //        .attr("dx", ".1em")
        //        .attr("class", addClass)
        //        .text("i: " + tile.interior);
        //}
    }

    function paintNewTile (tile) {
        resetNewTile();
        paintTilePixelCoords(newTileContainer, 0, 0, tile, UNPLACED_TILE_CLASS);
    }

    function resetNewTile() {
        d3.selectAll("." + UNPLACED_TILE_CLASS).remove();
    }

    function paintRectanglePixelCoords(container, x, y, width, height, addClass, onClick) {
        if (!addClass) addClass = "";

        // Class to uniquely idenify this box.
        var idClass = "sqr-id" + squareId++;
        addClass += " " + idClass;

        container.append("svg:rect")
            .attr("x", x)
            .attr("y", y)
            .attr("height", height)
            .attr("width", width)
            .attr("class", addClass);

        // Add onClick callback.
        if (onClick) {
            d3.selectAll("." + idClass).on("click", onClick);
        }
    }

    function paintSquare(container, x, y, addClass, onClick) {
        paintSquarePixelCoords(container, x * gameSettings.tileLength, y * gameSettings.tileLength, addClass, onClick);
    }

    function paintSquarePixelCoords(container, x, y, addClass, onClick) {
        paintRectanglePixelCoords(container, x, y, gameSettings.tileLength, gameSettings.tileLength, addClass, onClick);
    }

    function clearBoard() {
        d3.selectAll("." + PLACED_TILE_CLASS).remove();
        d3.selectAll("." + AVAILABLE_SPACE_CLASS).remove();
    }
    

    // Game logic functions.

    function selectSpace() {
        if (currentUnplacedTile) {
            placeTile(x, y, currentUnplacedTile);
            resetNewTile();
            currentUnplacedTile = null;

            d3.selectAll("." + AVAILABLE_SPACE_CLASS).remove();
        }
    }

    function setAvailableSpace(x, y) {
        var selectSpaceCallback = function selectSpaceCallback() {
            if (currentUnplacedTile) {
                placeTile(x, y, currentUnplacedTile);
                resetNewTile();
                currentUnplacedTile = null;

                d3.selectAll("." + AVAILABLE_SPACE_CLASS).remove();
            }
        }
        
        paintSquare(boardContainer, x, y, AVAILABLE_SPACE_CLASS, selectSpaceCallback);
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
        isFirstTurn = false;
        if (!tiles.isMoreTiles()) {
            alert("No tiles left!");
        }

        currentUnplacedTile = isFirstTurn ? tiles.startingTile : tiles.pickTile();
        paintNewTile(currentUnplacedTile);
        highlightAvailableSpaces(placedTiles, currentUnplacedTile);
    };

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
        console.log("lastrowindex:" + lastRowIndex);
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

    // REWRITE WITH BETTER D3.
    function redrawBoard(placedTiles) {
        clearBoard();
        
        for (var i = 0; i < placedTiles.length; i++) {
            for (var j = 0; j < placedTiles[i].length; j++) {
                if (placedTiles[i][j] != null) {
                    paintTile(i, j, placedTiles[i][j]);
                }
            }
        }
    }

    function placeTile(x, y, tile) {
        updateTilesArray(placedTiles, x, y, tile);
        redrawBoard(placedTiles);
    }
    
    function init() {
        isFirstTurn = true;

        d3.select("#" + NEW_TILE_BUTTON_ID)
            .on('click', getNewTile)

        boardContainer = d3.select("#" + BOARD_ID)
            .append("svg:svg")
            .attr("width", gameSettings.boardWidth)
            .attr("height", gameSettings.boardHeight);

        newTileContainer = d3.select("#" + NEW_TILE_AREA_ID)
            .append("svg:svg")
            .attr("width", gameSettings.tileLength)
            .attr("height", gameSettings.tileLength);
    }

    var NEW_TILE_AREA_ID = "new-tile-entry";
    var NEW_TILE_BUTTON_ID = "new-tile-button";
    var BOARD_ID = "board";
    var AVAILABLE_SPACE_CLASS = "can-place";
    var UNPLACED_TILE_CLASS = "unplaced-tile";
    var PLACED_TILE_CLASS = "placed-tile";

    var isFirstTurn;
    var currentUnplacedTile;
    var boardContainer;
    var newTileContainer;

    var squareId = 1;
    var placedTiles = [
        [null]
    ];

    return {
        init: init
    };
});