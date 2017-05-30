// TODO will be changed later
var width = 320;
var height = 568;

var game = new Phaser.Game(width, height, Phaser.AUTO, '#game');
var step;
var content;

var states = {
    preload: function() {
        this.preload = function() {
            // set black color background
            game.stage.backgroundColor = '#000000';
            // load assets
            game.load.crossOrigin = 'anonymous';    // TODO check whether necessary 
            game.load.image('infoBox', './assets/buttonLong_grey.png');
            game.load.image('mcqBox', './assets/buttonLong_beige.png');
            game.load.image('mcqChoice', './assets/buttonLong_brown.png');
            game.load.json('content', './assets/content.json');
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
                    game.state.start('startGame');
                } else {
                    setTimeout(onLoad, 1000);
                }
            }
        }
    },
    startGame: function() {
        this.create = function() {
            game.stage.backgroundColor = '#DDF0ED';
            var startText = game.add.text(game.world.centerX, game.world.centerY, '开始游戏', {
                font: 'Microsoft YaHei, STXihei, serif',
                fontSize: '50px',
                fill: '#05173B'
            });
            startText.anchor.setTo(0.5, 0.5);
            var temp = this.game.cache.getImage('infoBox');
            content = this.game.cache.getJSON('content');
            game.input.onTap.add(function() {
                step = 0;
                game.state.start('game');
            });
        }
    },
    game: function() {
        var box;
        var dialogText;
        var choices = [];
        this.create = function() {
            // game.stage.backgroundColor = '#DDF0ED';
            // boxType = (content[step]['type'] === 'info') ? 'infoBox' : 'mcqBox';
            box = game.add.sprite(game.world.centerX, game.world.centerY, 'infoBox');
            box.width = game.world.width * 0.8;
            box.height = game.world.height * 0.2;
            box.anchor.setTo(0.5, 0.5);
            dialogText = game.add.text(game.world.centerX, box.top + box.height/2, content[step]['text'], {
                font: 'Microsoft YaHei, STXihei, serif',
                fontSize: '15px',
                fill: '#05173B'
            });
            dialogText.anchor.setTo(0.5, 0.5);
            step = content[step]['next'];
            game.input.onTap.add(updateText, this);
        };
        function updateText(pointer) {
            if (content[step]['type'] === 'info') {
                box.loadTexture('infoBox');
                box.height = game.world.height * 0.08 * content[step]['line'];
                dialogText.setText(content[step]['text']);
                dialogText.y = box.top + box.height/2;
                step = content[step]['next'];
            } else if (content[step]['type'] === 'mcq') {
                box.loadTexture('mcqBox');
                box.height = game.world.height * 0.12 * content[step]['line'];
                dialogText.setText(content[step]['question']);
                dialogText.y = box.top + game.world.width * 0.16;
                var choiceY = box.top + game.world.width * 0.32;
                for (let n = 0; n < 3; n++) {
                    choices[n] =  game.add.sprite(game.world.centerX, choiceY, 'mcqChoice');
                    choices[n].width = game.world.width * 0.6;
                    choices[n].height = game.world.height * 0.08;
                    choices[n].anchor.setTo(0.5, 0.5);
                    var choiceText = game.add.text(choices[n].centerX, choices[n].centerY, content[step]['choices'][n], {
                        font: 'Microsoft YaHei, STXihei, serif',
                        fontSize: '15px',
                        fill: '#05173B'
                    });
                    choiceText.anchor.setTo(0.5, 0.5);
                    choiceY += game.world.width * 0.16;
                }
                step = content[step]['next'];
            } else {
                var chosen;
                if ((Math.abs(pointer.y - choices[0].y) < choices[0].height / 2) && (Math.abs(pointer.x - choices[0].x) < choices[0].width / 2)) {
                    chosen = 'a';
                } else if ((Math.abs(pointer.y - choices[1].y) < choices[1].height / 2) && (Math.abs(pointer.x - choices[1].x) < choices[1].width / 2)) {
                    chosen = 'b';
                } else if ((Math.abs(pointer.y - choices[2].y) < choices[2].height / 2) && (Math.abs(pointer.x - choices[2].x) < choices[2].width / 2)) {
                    chosen = 'c';
                } else { chosen = 'none' } // do nothing if not tap inside choice box
                if (chosen !== 'none') {
                    dialogText.setText("你选择了： " + chosen);
                    dialogText.y = box.top + game.world.width * 0.16;
                }
            }
        }
    },
    gameover: function() {
        console.log('gg');
    }
};

// add stages
Object.keys(states).map(function(key) {
    game.state.add(key, states[key]);
});

// start the game
game.state.start('preload');
