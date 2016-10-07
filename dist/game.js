/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
	var background_1 = __webpack_require__(1);
	var player_1 = __webpack_require__(2);
	var obstacles_1 = __webpack_require__(3);
	var score_1 = __webpack_require__(4);
	var extras_1 = __webpack_require__(5);
	var ScoutGame = (function () {
	    /**
	     * Initialises a new game.
	     */
	    function ScoutGame(id) {
	        var _this = this;
	        if (id === void 0) { id = "gameArea"; }
	        this.id = id;
	        /**
	         * Preload resources before the game starts.
	         */
	        this.preload = function () {
	            _this.game.load.physics("collision-shapes", "assets/shapes.json");
	            _this.game.load.audio("bg", "assets/bgmusic.mp3");
	            background_1.default.preload(_this.game);
	            player_1.default.preload(_this.game);
	            obstacles_1.default.preload(_this.game);
	            score_1.default.preload(_this.game);
	            extras_1.default.preload(_this.game);
	        };
	        /**
	         * Create game objects.
	         */
	        this.create = function () {
	            // remove the loading text
	            document.getElementById(_this.id).className = "";
	            // delete the cookie by setting the expiration to a point in "distant" past
	            document.cookie = "score=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
	            // play bg music
	            var music = _this.game.add.audio("bg", 1, true);
	            music.play();
	            // define "constants"
	            _this.speed = 100;
	            _this.speedUp = 10;
	            // system setup
	            _this.game.physics.startSystem(Phaser.Physics.P2JS);
	            _this.game.physics.p2.gravity.y = 1000;
	            // create game objects
	            _this.background = new background_1.default(_this.game, _this.speed);
	            _this.player = new player_1.default(_this.game);
	            _this.player.triggerDeath = _this.endGame;
	            _this.obstacles = new obstacles_1.default(_this.game, _this.speed);
	            _this.score = new score_1.default(_this.game);
	            _this.extras = new extras_1.default(_this.game);
	            // collisions:
	            var playerGroup = _this.game.physics.p2.createCollisionGroup();
	            var platformGroup = _this.game.physics.p2.createCollisionGroup();
	            var groundGroup = _this.game.physics.p2.createCollisionGroup();
	            var obstaclesGroup = _this.game.physics.p2.createCollisionGroup();
	            var extrasGroup = _this.game.physics.p2.createCollisionGroup();
	            _this.player.setColllisionGroup(playerGroup, [groundGroup, obstaclesGroup, extrasGroup]);
	            _this.player.Sprite.body.onBeginContact.add(function (body) {
	                if (extras_1.default.types.indexOf(body.sprite.key) >= 0) {
	                    _this.score.addScore(_this.extras.take(body));
	                }
	            }, _this); // take the extra!!
	            _this.obstacles.setColllisionGroup(obstaclesGroup, [playerGroup, groundGroup, extrasGroup]);
	            _this.background.setMovingColllisionGroup(groundGroup, [playerGroup, obstaclesGroup, extrasGroup]);
	            //this.background.setStillColllisionGroup(platformGroup, [ playerGroup ]);
	            _this.extras.setColllisionGroup(extrasGroup, [groundGroup, obstaclesGroup, playerGroup]);
	            // start increasing the speed
	            setTimeout(_this.changeSpeed, 5000);
	        };
	        /**
	         * Update all game instances
	         */
	        this.update = function () {
	            _this.background.update();
	            _this.obstacles.update();
	            _this.player.update(_this.game.time.elapsed);
	        };
	        /**
	         * Increase the pace of the game.
	         */
	        this.changeSpeed = function () {
	            _this.speed += _this.speedUp;
	            _this.obstacles.changeSpeed(_this.speed);
	            _this.background.changeSpeed(_this.speed);
	            setTimeout(_this.changeSpeed, 5000);
	        };
	        /**
	         * End the game.
	         */
	        this.endGame = function () {
	            _this.player.die(_this.score.getTotalScore());
	        };
	        this.game = new Phaser.Game("100%", "100%", Phaser.AUTO, id, {
	            preload: this.preload,
	            create: this.create,
	            update: this.update
	        });
	    }
	    return ScoutGame;
	})();
	exports.ScoutGame = ScoutGame;
	window.onload = function () {
	    var game = new ScoutGame();
	};


/***/ },
/* 1 */
/***/ function(module, exports) {

	/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
	var Background = (function () {
	    /**
	     * @param	game			The game instance
	     * @param gameTime	Time in seconds (needed for background paralaxing)
	     */
	    function Background(game, movementSpeed, gameTime) {
	        var _this = this;
	        if (movementSpeed === void 0) { movementSpeed = 150; }
	        if (gameTime === void 0) { gameTime = 180; }
	        this.setMovingColllisionGroup = function (group, collidesWith) {
	            for (var _i = 0, _a = _this.paths; _i < _a.length; _i++) {
	                var path = _a[_i];
	                path.body.setCollisionGroup(group);
	                path.body.collides(collidesWith);
	            }
	        };
	        this.setStillColllisionGroup = function (group, collidesWith) {
	            _this.platform.body.setCollisionGroup(group);
	            _this.platform.body.collides(collidesWith);
	        };
	        this.gameWidth = game.width;
	        this.gameHeight = game.height;
	        this.createParallaxBg(game, gameTime, "scenery");
	        this.createClouds(game);
	        this.createParallaxBg(game, gameTime, "rocks");
	        this.createMovingPath(game, movementSpeed);
	    }
	    Background.preload = function (game) {
	        game.load.image("scenery", "assets/ramzova.png");
	        game.load.image("rocks", "assets/obri-skaly.png");
	        game.load.image("path", "assets/path.png");
	        game.load.image("path2", "assets/path2.png");
	        game.load.image("cloud-1", "assets/cloud-1.png");
	        game.load.image("cloud-2", "assets/cloud-2.png");
	        game.load.image("cloud-3", "assets/cloud-3.png");
	        game.load.image("cloud-4", "assets/cloud-4.png");
	    };
	    Object.defineProperty(Background.prototype, "PathY", {
	        get: function () {
	            return this.platform.body.y - this.platform.height;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * The background scenery of the game.
	     */
	    Background.prototype.createParallaxBg = function (game, gameTime, layerName) {
	        var bg = game.add.sprite(0, 0, layerName);
	        // scale to fit the screen horizontally
	        var scaleFactor = this.gameHeight / bg.height;
	        bg.scale.setTo(scaleFactor, scaleFactor);
	        // calculate the moving speed of the background - so the end is reached
	        // by the end of the game time
	        // game.physics.p2.enable(bg, true);
	        // bg.body.static = true;
	        // bg.body.x = bg.width / 2;
	        // bg.body.x = bg.height / 2;
	        // const speed = (bg.width - this.gameWidth) / gameTime;
	        // bg.body.velocity.x = -speed; // move left at constant pace
	    };
	    /**
	     * Creates four different clouds moving to the left.
	     */
	    Background.prototype.createClouds = function (game) {
	        this.clouds = [];
	        for (var i = 1; i <= 4; i++) {
	            var cloud = game.add.sprite(this.getRandomCloudXPosition(), this.getRandomCloudYPosition(), "cloud-" + i);
	            // init physics for the clouds - move, but no gravity applied
	            game.physics.p2.enable(cloud);
	            cloud.body.static = true;
	            this.scaleCloud(cloud);
	            this.resetCloudPosition(cloud);
	            this.resetCloudVelocity(cloud);
	            this.clouds.push(cloud);
	        }
	    };
	    /**
	     * Creates a visual moving path on which player the "runs".
	     */
	    Background.prototype.createMovingPath = function (game, speed) {
	        this.paths = [];
	        for (var i = 0; i < 4; i++) {
	            var spriteName = "path" + (i % 2 == 0 ? "" : "2");
	            var path = game.add.sprite(0, 0, spriteName);
	            this.initPhysicsForPath(game, spriteName, path, speed);
	            path.body.x = path.width / 2 + (i > 0 ? this.paths[i - 1].body.x + this.paths[i - 1].width / 2 : 0);
	            path.body.y = this.gameHeight - path.height / 2; // adjust the position to the bottom
	            this.paths.push(path);
	        }
	        // add invisible platform onto which the player reallly stands
	        var platform = game.add.sprite(0, game.height - this.paths[0].height / 2);
	        platform.scale.setTo(2 * this.gameWidth, 1); // make it large enough for the obstacles to land on behind the viewport
	        game.physics.p2.enable(platform);
	        platform.renderable = false;
	        platform.body.static = true;
	        this.platform = platform;
	    };
	    Background.prototype.initPhysicsForPath = function (game, name, path, speed) {
	        game.physics.p2.enable(path);
	        path.body.collideWorldBounds = false;
	        path.body.kinematic = true;
	        path.body.clearShapes();
	        path.body.loadPolygon("collision-shapes", name);
	        // move the paths to simulate running of the player
	        path.body.velocity.x = -speed;
	    };
	    Background.prototype.update = function () {
	        for (var _i = 0, _a = this.clouds; _i < _a.length; _i++) {
	            var cloud = _a[_i];
	            if (cloud.position.x + cloud.width < 0) {
	                this.resetCloudPosition(cloud);
	                this.resetCloudVelocity(cloud);
	                this.scaleCloud(cloud);
	            }
	        }
	        for (var i = 0; i < this.paths.length; i++) {
	            var path = this.paths[i];
	            var prevPath = this.paths[(i - 1 + this.paths.length) % this.paths.length];
	            if (path.body.x + path.width / 2 <= 0) {
	                path.body.x = prevPath.position.x + prevPath.width / 2 + path.width / 2;
	            }
	        }
	    };
	    Background.prototype.scaleCloud = function (cloud) {
	        var scaleFactor = (this.gameHeight * (0.05 + 0.15 * Math.random())) / cloud.height;
	        cloud.scale.setTo(scaleFactor, scaleFactor);
	    };
	    Background.prototype.resetCloudPosition = function (cloud) {
	        cloud.body.x = this.getRandomCloudXPosition();
	        cloud.body.y = this.getRandomCloudYPosition();
	    };
	    Background.prototype.getRandomCloudXPosition = function () {
	        return this.gameWidth + this.gameWidth * Math.random();
	    };
	    Background.prototype.getRandomCloudYPosition = function () {
	        return (this.gameHeight / 2) * Math.random();
	    };
	    /**
	     * Cloud shoud cross the screen in between 20 to 60 seconds
	     */
	    Background.prototype.resetCloudVelocity = function (cloud) {
	        var minVelocity = this.gameWidth / 60;
	        var maxVelocity = this.gameHeight / 20;
	        cloud.body.velocity.x = -(minVelocity + maxVelocity * Math.random()); // move to the left
	    };
	    Background.prototype.changeSpeed = function (speed) {
	        for (var _i = 0, _a = this.paths; _i < _a.length; _i++) {
	            var path = _a[_i];
	            path.body.velocity.x = -speed;
	            path.body.velocity.x = -speed;
	        }
	    };
	    return Background;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Background;


/***/ },
/* 2 */
/***/ function(module, exports) {

	/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
	var Player = (function () {
	    function Player(game) {
	        var _this = this;
	        // trigger the death of the player
	        this.triggerDeath = function () { };
	        /**
	         * Initialises all different input methods - keyboard, mouse and touch.
	         */
	        this.initInput = function (game) {
	            _this.handleInput = true;
	            _this.lastState = false;
	            _this.currentState = false;
	            game.input.keyboard.onDownCallback = _this.onDown;
	            game.input.keyboard.onUpCallback = _this.onUp;
	            game.input.touch.onTouchStart = _this.onDown;
	            game.input.touch.onTouchEnd = _this.onUp;
	            game.input.mouse.onMouseDown = _this.onDown;
	            game.input.mouse.onMouseUp = _this.onUp;
	        };
	        /**
	         * Update the game state for the next frame.
	         * @param time	Elapsed time since last frame in milliseconds.
	         */
	        this.update = function (time) {
	            if (_this.rotation < 360) {
	                _this.rotation += (360 / 500) * time;
	                _this.sprite.angle = _this.rotation;
	                _this.sprite.body.angle = _this.rotation;
	            }
	            else {
	                _this.sprite.angle = 0;
	                _this.sprite.body.angle = 0;
	            }
	            if (_this.isInAir == true && _this.isTouching()) {
	                _this.run(); // he has landed
	            }
	            if (_this.sprite.body.x + _this.sprite.width < 0) {
	                _this.triggerDeath();
	            }
	        };
	        /**
	         * Device agnostic "down" (lmb release, key release, touch release).
	         * Player can use any key, finger...
	         */
	        this.onDown = function (e) {
	            e.preventDefault(); // prevent from default browser behavior caused by the key
	            if (_this.handleInput === false) {
	                return; // the player has probably died
	            }
	            if (_this.lastState == false && _this.canJump()) {
	                _this.jump();
	            }
	            _this.lastState = true;
	        };
	        /**
	         * Device agnostic "up" (lmb release, key release, touch release)
	         */
	        this.onUp = function () {
	            _this.lastState = false;
	        };
	        /**
	         * Change state to running.
	         */
	        this.run = function () {
	            _this.sprite.animations.play("run");
	        };
	        /**
	         * Change state tu jumping.
	         */
	        this.jump = function () {
	            _this.sprite.animations.play("jump");
	            _this.sprite.body.velocity.y = -720;
	            _this.sprite.body.velocity.x = 30;
	            _this.isInAir = true;
	            _this.hopSound.play();
	        };
	        /**
	         * Player can jump only when he is standing on the ground.
	         */
	        this.canJump = function () {
	            if (_this.isTouching()) {
	                _this.canDoubleJump = true;
	                return true;
	            }
	            if (_this.canDoubleJump) {
	                _this.canDoubleJump = false; // no "triple jumps"
	                _this.rotation = -360;
	                return true;
	            }
	            return false;
	        };
	        this.isTouching = function () {
	            return Math.abs(_this.sprite.position.y - _this.sprite.previousPosition.y) < 2;
	        };
	        /**
	         * Respond to the end of game.
	         */
	        this.die = function (score) {
	            if (_this.handleInput === true) {
	                _this.jauvajsSound.play();
	                setTimeout(function () {
	                    document.cookie = "score=" + score.toString();
	                    window.location.replace("save-score.html");
	                }, 3000);
	            }
	            _this.handleInput = false;
	            _this.sprite.body.fixedRotation = false;
	        };
	        this.setColllisionGroup = function (group, collidesWith) {
	            _this.sprite.body.setCollisionGroup(group);
	            _this.sprite.body.collides(collidesWith);
	        };
	        // create the figure and enable P2 physics
	        this.sprite = game.add.sprite(game.width / 2, 0, "scout-movement");
	        // scale the player - 20% of the game height 
	        // const scaleFactor = (game.height / 5) / this.sprite.height;
	        // this.sprite.scale.setTo(scaleFactor, scaleFactor);
	        // apply physics and set the approx. shape of the body
	        game.physics.p2.enable(this.sprite); // @todo: remove debug mode
	        this.sprite.body.clearShapes();
	        this.sprite.body.loadPolygon("collision-shapes", "player");
	        this.sprite.body.fixedRotation = true;
	        this.sprite.body.dynamic = true;
	        // init input
	        this.initInput(game);
	        // init animations
	        this.sprite.animations.add("run", [0, 1, 2, 1, 0, 3], 7, true);
	        this.sprite.animations.add("jump", [3], 0, false);
	        // audio
	        this.hopSound = game.add.audio("hop", 0.3, false);
	        this.jauvajsSound = game.add.audio("jauvajs", 0.8, false);
	        // rotation - make a spin
	        this.rotation = 0;
	        this.isInAir = true;
	    }
	    /**
	     * Preload the assets needed by the instances of Player class.
	     */
	    Player.preload = function (game) {
	        game.load.spritesheet("scout-movement", "assets/player.png", 130, 200);
	        game.load.audio("hop", "assets/hop.mp3");
	        game.load.audio("jauvajs", "assets/jauvajs.mp3");
	    };
	    Object.defineProperty(Player.prototype, "Sprite", {
	        /**
	         * Public getter to the Phaser.Sprite instance.
	         */
	        get: function () {
	            return this.sprite;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    return Player;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Player;


/***/ },
/* 3 */
/***/ function(module, exports) {

	/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
	var Obstacles = (function () {
	    function Obstacles(game, speed) {
	        var _this = this;
	        this.game = game;
	        this.update = function () {
	            for (var _i = 0, _a = _this.items; _i < _a.length; _i++) {
	                var item = _a[_i];
	                if (item.body.x + item.width / 2 < 0) {
	                    _this.items.splice(_this.items.indexOf(item), 1); // remove the item from the list
	                    item.destroy();
	                }
	                else if (item.previousPosition.x > item.position.x) {
	                    item.body.x = item.previousPosition.x; // do not move obstacles backwards
	                }
	            }
	        };
	        this.sendObstacle = function () {
	            var asset = ["tree", "tree2", "tent", "teepee", "gate"][Math.floor(Math.random() * 10 % 5)];
	            var next = _this.game.add.sprite(_this.game.width, 0, asset);
	            _this.game.physics.p2.enable(next);
	            next.body.clearShapes();
	            next.body.mass = 100;
	            next.body.loadPolygon("collision-shapes", asset);
	            next.body.x = _this.gameWidth + next.width + 200;
	            next.body.y = 0;
	            next.body.collideWorldBounds = false;
	            next.body.velocity.x = -_this.currentSpeed;
	            next.body.setCollisionGroup(_this.collisionGroup);
	            next.body.collides(_this.collideWith);
	            next.body.fixedRotation = true;
	            next.body.friction = 1;
	            _this.items.push(next);
	            setTimeout(_this.sendObstacle, 1000 + 5000 * Math.random());
	        };
	        this.setColllisionGroup = function (group, collidesWith) {
	            _this.collisionGroup = group;
	            _this.collideWith = collidesWith;
	        };
	        this.collideWithPlayer = function () {
	            // @todo play sound
	        };
	        this.gameWidth = game.width;
	        this.items = [];
	        this.currentSpeed = speed;
	        setTimeout(this.sendObstacle, 1000); // first obstacle comes after 4 seconds
	    }
	    Obstacles.preload = function (game) {
	        for (var asset in Obstacles.obstacleTypes) {
	            game.load.image(asset, Obstacles.obstacleTypes[asset]);
	        }
	    };
	    Obstacles.prototype.changeSpeed = function (speed) {
	        this.currentSpeed = speed;
	        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
	            var item = _a[_i];
	            item.body.velocity.x = -speed;
	        }
	    };
	    Obstacles.obstacleTypes = {
	        "tree": "assets/tree.png",
	        "tree2": "assets/tree2.png",
	        "tent": "assets/tent.png",
	        "teepee": "assets/teepee.png",
	        "gate": "assets/gate.png"
	    };
	    return Obstacles;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Obstacles;


/***/ },
/* 4 */
/***/ function(module, exports) {

	/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
	var Score = (function () {
	    function Score(game) {
	        var _this = this;
	        this.addScore = function (score) {
	            _this.score += score;
	            _this.text.setText(_this.getScoreText());
	        };
	        this.getTotalScore = function () {
	            return _this.score;
	        };
	        this.score = 0;
	        this.text = game.add.text(20, 20, this.getScoreText(), { color: "white" });
	    }
	    Score.preload = function (game) {
	        //game.load.bitmapFont()
	    };
	    Score.prototype.getScoreText = function () {
	        return "Sk\u00F3re: " + this.score;
	    };
	    return Score;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Score;


/***/ },
/* 5 */
/***/ function(module, exports) {

	/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
	var Extras = (function () {
	    function Extras(game) {
	        var _this = this;
	        this.game = game;
	        this.addExtra = function () {
	            var item = Extras.types[Math.floor(Math.random() * 10 % Extras.types.length)];
	            var next = _this.game.add.sprite(_this.game.width, 0, item);
	            _this.game.physics.p2.enable(next);
	            next.body.clearShapes();
	            next.body.loadPolygon("collision-shapes", item);
	            next.body.x = _this.game.width + next.width;
	            next.body.y = 0;
	            next.body.collideWorldBounds = false;
	            next.body.velocity.x = -_this.currentSpeed;
	            next.body.setCollisionGroup(_this.collisionGroup);
	            next.body.collides(_this.collideWith);
	            next.body.restitution = 0.9;
	            next.key = item;
	            _this.items.push(next);
	            setTimeout(_this.addExtra, 2000 + 5000 * Math.random());
	        };
	        this.setColllisionGroup = function (group, collidesWith) {
	            _this.collisionGroup = group;
	            _this.collideWith = collidesWith;
	        };
	        this.take = function (extra) {
	            var score = Extras.scores[extra.sprite.key];
	            _this.mamToSound.play();
	            extra.sprite.kill();
	            return score;
	        };
	        this.items = [];
	        this.currentSpeed = 300;
	        this.mamToSound = game.add.audio("mam-to", 0.5, false);
	        setTimeout(this.addExtra, 5000);
	    }
	    Extras.preload = function (game) {
	        game.load.image("feather", "assets/feather.png");
	        game.load.image("beaver", "assets/beaver.png");
	        game.load.image("hat", "assets/hat.png");
	        game.load.audio("mam-to", "assets/mam-to.mp3");
	    };
	    Extras.prototype.changeSpeed = function (speed) {
	        this.currentSpeed = speed;
	        for (var _i = 0, _a = this.items; _i < _a.length; _i++) {
	            var item = _a[_i];
	            item.body.velocity.x = -speed;
	        }
	    };
	    Extras.types = [
	        "feather",
	        "beaver",
	        "hat"
	    ];
	    Extras.scores = {
	        "beaver": 5,
	        "feather": 10,
	        "hat": 20
	    };
	    return Extras;
	})();
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.default = Extras;


/***/ }
/******/ ]);