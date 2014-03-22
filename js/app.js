requirejs.config({
    baseUrl: 'js/lib',
    paths: {
        app: '../app',
        data: '../data'
    }
});

requirejs(['app/game'],
function (game) {
    game.start();
});