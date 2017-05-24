// TODO will be changed later
var width = 320;
var height = 568;

var game = new Phaser.Game(width, height, Phaser.AUTO, 'game');

var states = {
    preload: function() {
        this.preload = function() {
            // set black color background
            game.stage.backgroundColor = '#000000';
            // load assets
            game.load.crossOrigin = 'anonymous';    // TODO check whether necessary 
            game.load.image('bg', './assets/images/bg.png');
            // text indication for loading progress
            var progressText = game.add.text(game.world.centerX, game.world.centerY, '0%', {
                fontSize: '60px',
                fill: '#ffffff'
            });
            progressText.anchor.setTo(0.5, 0.5);
            game.load.onFileComplete.add(function(progress) {
                progressText.text = progress + '%';
            });
            game.load.onLoadComplete.add(onLoad);
            
            var deadLine = false;
            setTimeout(function() {
                deadLine = true;
            }, 100);
            function onLoad() {
                if (deadLine) {
                    game.state.start('wakeUp');
                } else {
                    setTimeout(onLoad, 1000);
                }
            }
        }
    },
    wakeUp: function() {
        this.create = function() {
            var bg = game.add.image(0, 0, 'bg');
            bg.width = game.world.width;
            bg.height = game.world.height;
        }
    },
    lab: function() {

    },
    drosophila: function() {

    },
    afterWork: function() {

    },
    homeFindClue: function() {

    },
    boss24: function() {

    },
    gameover: function() {

    }
};

// add stages
Object.keys(states).map(function(key) {
    game.state.add(key, states[key]);
});

// start the game
game.state.start('preload');
