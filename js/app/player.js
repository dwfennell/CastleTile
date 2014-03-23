"use strict";
define([], function () {
    function addPoints(num) {
        points += num;
    }
    
    function hasFollower() {
        return availableFollowers > 0;
    }

    function placedFollower() {
        if (availableFollowers > 0) {
            availableFollowers += -1;
            return true;
        } else {
            return false;
        }
    }

    var points;
    var availableFollowers; 

    return {
        points: points,
        followers: availableFollowers,
        addPoints: addPoints,
        hasFollower: hasFollower,
        placedFollower: placedFollower
    };
});