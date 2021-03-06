"use strict";
define(['d3'], function (d3) {

    // Drawing functions.
    function paintTileDetails(container, xStartPix, yStartPix, tile, addClass, onClick) {
        if (!addClass) addClass = "";

        var tileLength = gameSettings.tileLength;
        var roadLength = gameSettings.roadSize * tileLength;
        var edgeLength = gameSettings.edgeSize * tileLength;

        // Draw roads.

        var roadClass = addClass + " road";
        if (tile.edges[0] === "r") {
            // bottom
            var xPix = xStartPix + (tileLength / 2) - (roadLength / 2);
            var yPix = yStartPix + tileLength - edgeLength;
            paintRectanglePixelCoords(container, xPix, yPix, roadLength, edgeLength, roadClass, onClick);
        }
        if (tile.edges[1] === "r") {
            // left
            var xPix = xStartPix;
            var yPix = yStartPix + (tileLength / 2) - (roadLength / 2);
            paintRectanglePixelCoords(container, xPix, yPix, edgeLength, roadLength, roadClass, onClick);
        }
        if (tile.edges[2] === "r") {
            // top
            var xPix = xStartPix + tileLength / 2 - roadLength / 2;
            paintRectanglePixelCoords(container, xPix, yStartPix, roadLength, edgeLength, roadClass, onClick);
        }
        if (tile.edges[3] === "r") {
            // right
            var xPix = xStartPix + tileLength - edgeLength;
            var yPix = yStartPix + (tileLength / 2) - (roadLength / 2);
            paintRectanglePixelCoords(container, xPix, yPix, edgeLength, roadLength, roadClass, onClick);
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

            makePolygon(container, points, addClass + " city", onClick);
        }
        if (tile.edges[1] === "c") {
            // Left
            var points = [
                [xStartPix, yStartPix],
                [xStartPix + edgeLength, yStartPix + edgeLength],
                [xStartPix + edgeLength, yStartPix + tileLength - edgeLength],
                [xStartPix, yStartPix + tileLength]
            ];

            makePolygon(container, points, addClass + " city", onClick);
        }
        if (tile.edges[2] === "c") {
            // Top
            var points = [
                [xStartPix, yStartPix],
                [xStartPix + edgeLength, yStartPix + edgeLength],
                [xStartPix + tileLength - edgeLength, yStartPix + edgeLength],
                [xStartPix + tileLength, yStartPix]
            ];

            makePolygon(container, points, addClass + " city", onClick);
        }
        if (tile.edges[3] === "c") {
            // Right 
            var points = [
                [xStartPix + tileLength, yStartPix],
                [xStartPix + tileLength - edgeLength, yStartPix + edgeLength],
                [xStartPix + tileLength - edgeLength, yStartPix + tileLength - edgeLength],
                [xStartPix + tileLength, yStartPix + tileLength]
            ];

            makePolygon(container, points, addClass + " city", onClick);
        }

        // For now, just draw cities in triangles and roads to the center. 
        // Will need to get better than this later. Maybe change the encoding.

        // TODO: Draw interior 'e' properly
        // TODO: Sheilds.

        // Draw interior roads.
        var halfTileLength = tileLength / 2;
        if (tile.interior[0] === "r" || tile.interior[0] === "e") {
            // Bottom
            var xPix = xStartPix + halfTileLength - (roadLength / 2);
            var yPix = yStartPix + halfTileLength;
            paintRectanglePixelCoords(container, xPix, yPix, roadLength, halfTileLength - edgeLength, roadClass, onClick);
        }
        if (tile.interior[1] === "r" || tile.interior[1] === "e") {
            // Left
            var xPix = xStartPix + edgeLength;
            var yPix = yStartPix + halfTileLength - roadLength / 2;
            paintRectanglePixelCoords(container, xPix, yPix, halfTileLength - edgeLength, roadLength, roadClass, onClick);
        }
        if (tile.interior[2] === "r" || tile.interior[2] === "e") {
            // Top
            var xPix = xStartPix + halfTileLength - (roadLength / 2);
            var yPix = yStartPix + edgeLength;
            paintRectanglePixelCoords(container, xPix, yPix, roadLength, halfTileLength - edgeLength, roadClass, onClick);
        }
        if (tile.interior[3] === "r" || tile.interior[3] === "e") {
            // Right
            var xPix = xStartPix + halfTileLength;
            var yPix = yStartPix + halfTileLength - roadLength / 2;
            paintRectanglePixelCoords(container, xPix, yPix, halfTileLength - edgeLength, roadLength, roadClass, onClick);
        }

        // Draw interior cities.
        var centerPoint = [xStartPix + halfTileLength, yStartPix + halfTileLength];
        if (tile.interior[0] === "c") {
            var points = [
                centerPoint,
                [xStartPix + tileLength - edgeLength, yStartPix + tileLength - edgeLength],
                [xStartPix + edgeLength, yStartPix + tileLength - edgeLength]
            ];
            makePolygon(container, points, addClass + " city", onClick);
        }
        if (tile.interior[1] === "c") {
            var points = [
                centerPoint,
                [xStartPix + edgeLength, yStartPix + tileLength - edgeLength],
                [xStartPix + edgeLength, yStartPix + edgeLength]
            ];
            makePolygon(container, points, addClass + " city", onClick);
        }
        if (tile.interior[2] === "c") {
            var points = [
                centerPoint,
                [xStartPix + tileLength - edgeLength, yStartPix + edgeLength],
                [xStartPix + edgeLength, yStartPix + edgeLength]
            ];
            makePolygon(container, points, addClass + " city", onClick);
        }
        if (tile.interior[3] === "c") {
            var points = [
                centerPoint,
                [xStartPix + tileLength - edgeLength, yStartPix + tileLength - edgeLength],
                [xStartPix + tileLength - edgeLength, yStartPix + edgeLength]
            ];
            makePolygon(container, points, addClass + " city", onClick);
        }

        if (tile.hasCloister) {
            paintCloister(container, xStartPix, yStartPix, addClass + " cloister", onClick);
        }
        //if (tile.hasShield) {
        //    drawSheild();
        //}
    }

    function paintCloister(container, tileStartX, tileStartY, addClass, onClick) {
        if (!addClass) addClass = "";

        var cloisterLength = gameSettings.tileLength * gameSettings.cloisterSize;
        var xPix = tileStartX + (gameSettings.tileLength / 2) - (cloisterLength / 2);
        var yPix = tileStartY + (gameSettings.tileLength / 2) - (cloisterLength / 2);

        // Draw box.
        paintRectanglePixelCoords(container, xPix, yPix, cloisterLength, cloisterLength, addClass + " cloister", onClick);

        var points = [
            [xPix, yPix],
            [xPix + cloisterLength, yPix],
            [xPix + cloisterLength / 2, yPix - cloisterLength * 0.5]
        ];
        // Draw roof.
        makePolygon(container, points, addClass + " cloister-roof", onClick);
    }

    function makePolygon(container, points, addClass, onClick) {
        if (!addClass) addClass = "";

        var idClass = "sqr-id" + squareId++;
        addClass += " " + idClass;

        var line = d3.svg.line()
            .x(function (d, i) { return d[0]; })
            .y(function (d, i) { return d[1]; });

        container.append("svg:path")
            .attr("d", line(points))
            .attr("class", addClass);

         //Add onClick callback.
        if (onClick) {
            d3.selectAll("." + idClass).on("click", onClick);
        }
    }

    function paintTile(x, y, tile) {
        var xPix = x * gameSettings.tileLength;
        var yPix = y * gameSettings.tileLength;
        paintTilePixelCoords(boardContainer, xPix, yPix, tile, PLACED_TILE_CLASS);
    }

    function paintTilePixelCoords(container, x, y, tile, addClass, onClick) {
        if (!addClass) addClass = "";

        paintSquarePixelCoords(container, x, y, "tile " + addClass, onClick);
        paintTileDetails(container, x, y, tile, addClass, onClick);
    }

    function paintNewTile(tile, rotateCallback) {
        resetNewTile();
        paintTilePixelCoords(newTileContainer, 0, 0, tile, UNPLACED_TILE_CLASS, rotateCallback);
    }

    function resetNewTile() {
        d3.selectAll("." + UNPLACED_TILE_CLASS).remove();
    }

    function paintAvailableSpace(x, y, selectSpaceCallback) {
        paintSquare(boardContainer, x, y, AVAILABLE_SPACE_CLASS, selectSpaceCallback);
    }

    function clearAvailableSpaces() {
        d3.selectAll("." + AVAILABLE_SPACE_CLASS).remove();
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

    function paintSquareBoard(x, y, addClass, onClick) {
        paintSquare(boardContainer, x, y, addClass, onClick)
    }

    function paintSquare(container, x, y, addClass, onClick) {
        paintSquarePixelCoords(container, x * gameSettings.tileLength, y * gameSettings.tileLength, addClass, onClick);
    }

    function paintSquarePixelCoords(container, x, y, addClass, onClick) {
        paintRectanglePixelCoords(container, x, y, gameSettings.tileLength, gameSettings.tileLength, addClass, onClick);
    }

    function clearBoard() {
        d3.selectAll("." + PLACED_TILE_CLASS).remove();
        d3.selectAll("." + gameSettings.availableSpaceIdentifier).remove();
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

    function init(settings) {
        gameSettings = settings;
        squareId = 1;

        boardContainer = d3.select("#" + BOARD_ID)
            .append("svg:svg")
            .attr("width", gameSettings.boardWidth)
            .attr("height", gameSettings.boardHeight);

        newTileContainer = d3.select("#" + NEW_TILE_AREA_ID)
            .append("svg:svg")
            .attr("width", gameSettings.tileLength)
            .attr("height", gameSettings.tileLength);
    }

    var gameSettings;
    var boardContainer;
    var newTileContainer;
    var squareId;

    var NEW_TILE_AREA_ID = "new-tile-entry";
    var BOARD_ID = "board";
    var AVAILABLE_SPACE_CLASS = "can-place";
    var UNPLACED_TILE_CLASS = "unplaced-tile";
    var PLACED_TILE_CLASS = "placed-tile";

    return {
        init: init,
        paintTile: paintTile,
        resetNewTile: resetNewTile,
        paintNewTile: paintNewTile,
        clearBoard: clearBoard,
        redrawBoard: redrawBoard,
        paintAvailableSpace: paintAvailableSpace,
        clearAvailableSpaces: clearAvailableSpaces
    };
});