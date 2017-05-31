// TODO will be changed later
var _width = 320;
var _height = 568;

var _game = new Phaser.Game(_width, _height, Phaser.AUTO, '#game');
var content;
var _step;
var _HP;
var _HPWidth;
var _HPText;
var _SP;
var _SPWidth;
var _SPText;

var states = {
    preload: function() {
        this.preload = function() {
            // set black color background
            _game.stage.backgroundColor = '#000000';
            // load assets
            _game.load.crossOrigin = 'anonymous';    // TODO check whether necessary 
            _game.load.image('bg', './assets/bg.png');
            _game.load.image('infoBox', './assets/buttonLong_grey.png');
            _game.load.image('mcqBox', './assets/buttonLong_beige.png');
            _game.load.image('mcqChoice', './assets/buttonLong_brown.png');
            _game.load.json('content', './assets/content.json');
            // text indication for loading progress
            var progressText = _game.add.text(_game.world.centerX, _game.world.centerY, '0%', {
                fontSize: '60px',
                fill: '#ffffff'
            });
            progressText.anchor.setTo(0.5, 0.5);
            _game.load.onFileComplete.add(function(progress) {
                progressText.text = progress + '%';
            });
            _game.load.onLoadComplete.add(onLoad);
            
            var deadLine = false;
            setTimeout(function() {
                deadLine = true;
            }, 100);
            function onLoad() {
                if (deadLine) {
                    _game.state.start('startgame');
                } else {
                    setTimeout(onLoad, 1000);
                }
            }
        }
    },
    startgame: function() {
        this.create = function() {
            _game.stage.backgroundColor = '#DDF0ED';
            var startText = _game.add.text(_game.world.centerX, _game.world.centerY, '开始游戏', {
                font: 'Microsoft YaHei, STXihei, serif',
                fontSize: '50px',
                fill: '#05173B'
            });
            startText.anchor.setTo(0.5, 0.5);
            var temp = _game.cache.getImage('infoBox');
            content = _game.cache.getJSON('content');
            
            _step = "0a";
            _SPText = 50;
            _HPText = 100;
            _game.input.onTap.add(function() {
                _game.state.start('maingame');
            });
        }
    },
    maingame: function() {
        var box;
        var dialogText;
        var choices = [];
        this.create = function() {
            // health bar section
            var bmd = _game.add.bitmapData(280, 30);
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, 300, 80);
            bmd.ctx.fillStyle = '#00f910';
            bmd.ctx.fill();
            
            _HPWidth = new Phaser.Rectangle(0, 0, bmd.width, bmd.height);
            _HP = _game.add.sprite(_game.world.centerX - 300/2 + 10, _game.world.top + 10, bmd);
            _HP.cropEnabled = true;
            _HP.crop(_HPWidth);

            bmd = _game.add.bitmapData(280, 30);
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, 300, 80);
            bmd.ctx.fillStyle = '#ffffff';
            bmd.ctx.fill();

            _SPWidth = new Phaser.Rectangle(0, 0, bmd.width, bmd.height);
            _SP = _game.add.sprite(_game.world.centerX - 300/2 + 10, _game.world.top + 40, bmd);
            _SP.cropEnabled = true;
            _SP.crop(_SPWidth);

            // dialog box section
            box = _game.add.sprite(_game.world.centerX, _game.world.centerY, 'infoBox');
            box.width = _game.world.width * 0.8;
            box.height = _game.world.height * 0.2;
            box.anchor.setTo(0.5, 0.5);
            dialogText = _game.add.text(_game.world.centerX, box.top + box.height/2, content[_step]['text'], {
                font: 'Microsoft YaHei, STXihei, serif',
                fontSize: '15px',
                fill: '#05173B'
            });
            dialogText.anchor.setTo(0.5, 0.5);
            _step = content[_step]['next'];
            _game.input.onTap.add(updateText, this);
        };
        // modify health bar
        function cropLife(hpCrop, spCrop) {
            if (_HPText + hpCrop >= 100) {
                _HPText = 100;
            } else if (_HPText + hpCrop <= 0) {
                _HPText = 0;
            } else {
                _HPText += hpCrop
            }
            if (_SPText + spCrop >= 100) {
                _SPText = 100;
            } else if (_SPText + spCrop <= 0) {
                _SPText = 0;
            } else {
                _SPText += spCrop
            }
            _game.add.tween(_HPWidth).to( { width: (_HPWidth.width - (_width / 10)) }, 200, Phaser.Easing.Linear.None, true);
            _game.add.tween(_SPWidth).to( { width: (_SPWidth.width - (_width / 10)) }, 200, Phaser.Easing.Linear.None, true);
        }
        // watch and update health bar
        this.update = function() {
            _HP.updateCrop();
            _SP.updateCrop();
        };
        // update on tap
        function updateText(pointer) {
            if (_HPText <= 0) {
                _game.state.start('dead');
            }
            if (_SPText <= 0) {
                _game.state.start('breakup');
            }
            if (content[_step]['type'] === 'info') {
                box.loadTexture('infoBox');
                box.height = _game.world.height * 0.08 * content[_step]['line'];
                dialogText.setText(content[_step]['text']);
                dialogText.y = box.top + box.height/2;
                _step = content[_step]['next'];
            } else if (content[_step]['type'] === 'mcq') {
                box.loadTexture('mcqBox');
                box.height = _game.world.height * 0.12 * content[_step]['line'];
                dialogText.setText(content[_step]['question']);
                dialogText.y = box.top + _game.world.width * 0.16;
                var choiceY = box.top + _game.world.width * 0.32;
                for (let n = 0; n < 3; n++) {
                    choices[n] =  _game.add.sprite(_game.world.centerX, choiceY, 'mcqChoice');
                    choices[n].width = _game.world.width * 0.6;
                    choices[n].height = _game.world.height * 0.08;
                    choices[n].anchor.setTo(0.5, 0.5);
                    choices[n+3] = _game.add.text(choices[n].centerX, choices[n].centerY, content[_step]['choices'][n], {
                        font: 'Microsoft YaHei, STXihei, serif',
                        fontSize: '15px',
                        fill: '#05173B'
                    });
                    choices[n+3].anchor.setTo(0.5, 0.5);
                    choiceY += _game.world.width * 0.16;
                }
                _step = content[_step]['next'];
            } else if (content[_step]['type'] === 'asw') {
                var chosen;
                if ((Math.abs(pointer.y - choices[0].y) < choices[0].height / 2) && (Math.abs(pointer.x - choices[0].x) < choices[0].width / 2)) {
                    chosen = 'a';
                } else if ((Math.abs(pointer.y - choices[1].y) < choices[1].height / 2) && (Math.abs(pointer.x - choices[1].x) < choices[1].width / 2)) {
                    chosen = 'b';
                } else if ((Math.abs(pointer.y - choices[2].y) < choices[2].height / 2) && (Math.abs(pointer.x - choices[2].x) < choices[2].width / 2)) {
                    chosen = 'c';
                } else { chosen = 'none' } // do nothing if not tap inside choice box
                if (chosen !== 'none') {
                    for (var el in choices) { 
                        choices[el].destroy();
                    }
                    dialogText.setText("你选择了： " + chosen + '\n\n' + content[_step]['text'][chosen]);
                    dialogText.y = box.centerY;
                    console.log(content[_step]['effect'][chosen]);
                    if (content[_step]['effect'][chosen] !== 'nil') {
                        cropLife(content[_step]['effect'][chosen][0], content[_step]['effect'][chosen][1]);
                    } else {}
                    _step = content[_step]['next'][chosen];
                }
            } else {
                console.log("json file type error");
            }
        }
    },
    dead: function() {
        this.create = function() {
            var bg = _game.add.image(0, 0, 'bg');
            bg.width = _game.world.width;
            bg.height = _game.world.height;

            var resultText = _game.add.text(_game.world.centerX, _game.world.height * 0.3, '你死掉了', {
                font: 'Microsoft YaHei, STXihei, serif',
                fontSize: '20px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            resultText.anchor.setTo(0.5, 0.5);

            var remind = _game.add.text(_game.world.centerX, _game.world.height * 0.7, '点击任意位置再玩一次', {
                font: 'Microsoft YaHei, STXihei, serif',
                fontSize: '20px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            remind.anchor.setTo(0.5, 0.5);
            
            _game.input.onTap.add(function() {
                _game.state.start('startgame');
            });
        };
    },
    breakup: function() {
        this.create = function() {
            var bg = _game.add.image(0, 0, 'bg');
            bg.width = _game.world.width;
            bg.height = _game.world.height;

            var resultText = _game.add.text(_game.world.centerX, _game.world.height * 0.3, '会不会谈恋爱啊直男癌！\n阿宝跟你分手了', {
                font: 'Microsoft YaHei, STXihei, serif',
                fontSize: '20px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            resultText.anchor.setTo(0.5, 0.5);

            var remind = _game.add.text(_game.world.centerX, _game.world.height * 0.7, '点击任意位置再玩一次', {
                font: 'Microsoft YaHei, STXihei, serif',
                fontSize: '20px',
                fontWeight: 'bold',
                fill: '#f2bb15'
            });
            remind.anchor.setTo(0.5, 0.5);
            
            _game.input.onTap.add(function() {
                _game.state.start('startgame');
            });
        };
    }
};

// add stages
Object.keys(states).map(function(key) {
    _game.state.add(key, states[key]);
});

// start the _game
_game.state.start('preload');
