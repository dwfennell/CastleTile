"use strict";
define(['d3'], function (d3) {

    function getFollowerCenterCoords(xStart, yStart, index, isInterior, isCloister) {
        var tileLength = gameSettings.tileLength;
        var edgeLength = tileLength * gameSettings.edgeSize;

        var xMid = xStart + (tileLength / 2);
        var yMid = yStart + (tileLength / 2);
        var xEnd = xStart + tileLength;
        var yEnd = yStart + tileLength;

        if (isCloister) {
            // Assume cloisters at center.
            return { x: xMid, y: yMid };
        }

        var interiorOffset = ((tileLength / 2) - edgeLength) / 2;
        var edgeOffset = edgeLength / 2;

        var interior = [
            [xMid, yMid + interiorOffset], // Bottom
            [xMid - interiorOffset, yMid], // Left 
            [xMid, yMid - interiorOffset], // Top
            [xMid + interiorOffset, yMid] // Right
        ];

        var edges = [
            [xMid, yEnd - edgeOffset], // Bottom
            [xStart + edgeOffset, yMid], // Left
            [xMid, yStart + edgeOffset], // Top
            [xEnd - edgeOffset, yMid] // Right
        ];

        return isInterior ? { x: interior[index][0], y: interior[index][1] } : { x: edges[index][0], y: edges[index][1] };
    }


    function drawFollower(container, xStart, yStart, tile, newFollower, index, isInterior, isCloister) {
        // Clear existing new followers.
        d3.selectAll("." + NEW_FOLLOWER_CLASS).remove();

        var followerLength = gameSettings.tileLength * gameSettings.followerSize;
        var halfFollowerLength = followerLength / 2;
        var cen = getFollowerCenterCoords(xStart, yStart, index, isInterior, isCloister);

        // Just a triangle. 
        var points = [
            [cen.x + halfFollowerLength, cen.y + halfFollowerLength], 
            [cen.x - halfFollowerLength, cen.y + halfFollowerLength],
            [cen.x, cen.y - halfFollowerLength]
        ];

        var followerClass = newFollower ? FOLLOWER_CLASS + " " + NEW_FOLLOWER_CLASS : FOLLOWER_CLASS;
        makePolygon(container, points, followerClass);
    }

    function paintTileDetails(container, xStartPix, yStartPix, tile, isNewPlacedTile, addClass, onClick) {
        if (!addClass) addClass = "";

        // Place follower click handlers. 
        // OnClick is passed down from the controller class; handles business logic. 
        function makeDetailClick(onClick, index, isInterior, isCloister) {
            if (isNewPlacedTile) {
                return function () {
                    drawFollower(container, xStartPix, yStartPix, tile, true, index, isInterior, isCloister);
                    onClick(index, isInterior, isCloister);
                };
            } else if (onClick) {
                return onClick;
            } else {
                return function () { };
            }
        }

        var tileLength = gameSettings.tileLength;
        var halfTileLength = tileLength / 2;
        var roadLength = gameSettings.roadSize * tileLength;
        var edgeLength = gameSettings.edgeSize * tileLength;
        var centerPoint = [xStartPix + halfTileLength, yStartPix + halfTileLength];

        // Draw roads.
        var roadClass = addClass + " road";
        if (tile.edges[0] === "r") {
            // bottom
            var xPix = xStartPix + (tileLength / 2) - (roadLength / 2);
            var yPix = yStartPix + tileLength - edgeLength;
            paintRectanglePixelCoords(container, xPix, yPix, roadLength, edgeLength, roadClass, makeDetailClick(onClick, 0, false));
        }
        if (tile.edges[1] === "r") {
            // left
            var xPix = xStartPix;
            var yPix = yStartPix + (tileLength / 2) - (roadLength / 2);
            paintRectanglePixelCoords(container, xPix, yPix, edgeLength, roadLength, roadClass, makeDetailClick(onClick, 1, false));
        }
        if (tile.edges[2] === "r") {
            // top
            var xPix = xStartPix + tileLength / 2 - roadLength / 2;
            paintRectanglePixelCoords(container, xPix, yStartPix, roadLength, edgeLength, roadClass, makeDetailClick(onClick, 2, false));
        }
        if (tile.edges[3] === "r") {
            // right
            var xPix = xStartPix + tileLength - edgeLength;
            var yPix = yStartPix + (tileLength / 2) - (roadLength / 2);
            paintRectanglePixelCoords(container, xPix, yPix, edgeLength, roadLength, roadClass, makeDetailClick(onClick, 3, false));
        }

        // Interior roads.
        if (tile.interior[0] === "r" || tile.interior[0] === "e") {
            // Bottom
            var xPix = xStartPix + halfTileLength - (roadLength / 2);
            var yPix = yStartPix + halfTileLength;
            paintRectanglePixelCoords(container, xPix, yPix, roadLength, halfTileLength - edgeLength, roadClass, makeDetailClick(onClick, 0, true));
        }
        if (tile.interior[1] === "r" || tile.interior[1] === "e") {
            // Left
            var xPix = xStartPix + edgeLength;
            var yPix = yStartPix + halfTileLength - roadLength / 2;
            paintRectanglePixelCoords(container, xPix, yPix, halfTileLength - edgeLength, roadLength, roadClass, makeDetailClick(onClick, 1, true));
        }
        if (tile.interior[2] === "r" || tile.interior[2] === "e") {
            // Top
            var xPix = xStartPix + halfTileLength - (roadLength / 2);
            var yPix = yStartPix + edgeLength;
            paintRectanglePixelCoords(container, xPix, yPix, roadLength, halfTileLength - edgeLength, roadClass, makeDetailClick(onClick, 2, true));
        }
        if (tile.interior[3] === "r" || tile.interior[3] === "e") {
            // Right
            var xPix = xStartPix + halfTileLength;
            var yPix = yStartPix + halfTileLength - roadLength / 2;
            paintRectanglePixelCoords(container, xPix, yPix, halfTileLength - edgeLength, roadLength, roadClass, makeDetailClick(onClick, 3, true));
        }

        // Draw cities.
        var cityClass = addClass + " city";
        if (tile.edges[0] === "c") {
            // Bottom
            var points = [
                [xStartPix, yStartPix + tileLength],
                [xStartPix + edgeLength, yStartPix + tileLength - edgeLength],
                [xStartPix + tileLength - edgeLength, yStartPix + tileLength - edgeLength],
                [xStartPix + tileLength, yStartPix + tileLength]
            ];

            makePolygon(container, points, cityClass, makeDetailClick(onClick, 0, false));
        }
        if (tile.edges[1] === "c") {
            // Left
            var points = [
                [xStartPix, yStartPix],
                [xStartPix + edgeLength, yStartPix + edgeLength],
                [xStartPix + edgeLength, yStartPix + tileLength - edgeLength],
                [xStartPix, yStartPix + tileLength]
            ];

            makePolygon(container, points, cityClass, makeDetailClick(onClick, 1, false));
        }
        if (tile.edges[2] === "c") {
            // Top
            var points = [
                [xStartPix, yStartPix],
                [xStartPix + edgeLength, yStartPix + edgeLength],
                [xStartPix + tileLength - edgeLength, yStartPix + edgeLength],
                [xStartPix + tileLength, yStartPix]
            ];

            makePolygon(container, points, cityClass, makeDetailClick(onClick, 2, false));
        }
        if (tile.edges[3] === "c") {
            // Right 
            var points = [
                [xStartPix + tileLength, yStartPix],
                [xStartPix + tileLength - edgeLength, yStartPix + edgeLength],
                [xStartPix + tileLength - edgeLength, yStartPix + tileLength - edgeLength],
                [xStartPix + tileLength, yStartPix + tileLength]
            ];

            makePolygon(container, points, cityClass, makeDetailClick(onClick, 3, false));
        }

        // Draw interior cities.
        if (tile.interior[0] === "c") {
            var points = [
                centerPoint,
                [xStartPix + tileLength - edgeLength, yStartPix + tileLength - edgeLength],
                [xStartPix + edgeLength, yStartPix + tileLength - edgeLength]
            ];
            makePolygon(container, points, cityClass, makeDetailClick(onClick, 0, true));
        }
        if (tile.interior[1] === "c") {
            var points = [
                centerPoint,
                [xStartPix + edgeLength, yStartPix + tileLength - edgeLength],
                [xStartPix + edgeLength, yStartPix + edgeLength]
            ];
            makePolygon(container, points, cityClass, makeDetailClick(onClick, 1, true));
        }
        if (tile.interior[2] === "c") {
            var points = [
                centerPoint,
                [xStartPix + tileLength - edgeLength, yStartPix + edgeLength],
                [xStartPix + edgeLength, yStartPix + edgeLength]
            ];
            makePolygon(container, points, cityClass, makeDetailClick(onClick, 2, true));
        }
        if (tile.interior[3] === "c") {
            var points = [
                centerPoint,
                [xStartPix + tileLength - edgeLength, yStartPix + tileLength - edgeLength],
                [xStartPix + tileLength - edgeLength, yStartPix + edgeLength]
            ];
            makePolygon(container, points, cityClass, makeDetailClick(onClick, 3, true));
        }

        if (tile.hasCloister) {
            paintCloister(container, xStartPix, yStartPix, addClass + " cloister", makeDetailClick(onClick, undefined, undefined, true));
        }

        if (tile.follower) {
            // If a tile has a follower on it, draw that follower.
            drawFollower(container, xStartPix, yStartPix, tile, false, tile.follower.positionIndex, tile.follower.isInterior, tile.follower.isCloister);
        }

        // TODO: Draw interior 'e' properly
        // TODO: Sheilds.
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

        if (onClick) {
            d3.selectAll("." + idClass).on("click", onClick);
        }
    }

    function paintTile(x, y, tile, isNewPlacedTile, onClick) {
        var xPix = x * gameSettings.tileLength;
        var yPix = y * gameSettings.tileLength;
        paintTilePixelCoords(boardContainer, xPix, yPix, tile, isNewPlacedTile, PLACED_TILE_CLASS, onClick);
    }

    function paintTilePixelCoords(container, x, y, tile, isNewPlacedTile, addClass, onClick) {
        if (!addClass) addClass = "";

        paintSquarePixelCoords(container, x, y, "tile " + addClass, onClick);
        paintTileDetails(container, x, y, tile, isNewPlacedTile, addClass, onClick);
    }

    function paintNewTile(tile, rotateCallback) {
        resetNewTile();
        paintTilePixelCoords(newTileContainer, 0, 0, tile, false, UNPLACED_TILE_CLASS, rotateCallback);
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
        d3.selectAll("." + FOLLOWER_CLASS).remove();
        d3.selectAll("." + gameSettings.availableSpaceIdentifier).remove();
    }

    // REWRITE WITH BETTER D3.
    function redrawBoard(placedTiles, newTileX, newTileY, newTileClick) {
        clearBoard();

        for (var i = 0; i < placedTiles.length; i++) {
            for (var j = 0; j < placedTiles[i].length; j++) {
                if (placedTiles[i][j] != null) {
                    if (newTileX === i && newTileY === j) {
                        // Newly placed tile, paint with follower callbacks.
                        paintTile(i, j, placedTiles[i][j], true, newTileClick);
                    } else {
                        paintTile(i, j, placedTiles[i][j]);
                    }
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
    var FOLLOWER_CLASS = "follower";
    var NEW_FOLLOWER_CLASS = "new-follower";

    return {
        init: init,
        resetNewTile: resetNewTile, 
        paintNewTile: paintNewTile,
        redrawBoard: redrawBoard,
        paintAvailableSpace: paintAvailableSpace,
        clearAvailableSpaces: clearAvailableSpaces
    };
});