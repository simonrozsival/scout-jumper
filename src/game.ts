/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />
import Background from "./background";
import Player from "./player";
import Obstacles from "./obstacles";
import Score from "./score";
import Extras from "./extras";

export class ScoutGame {

	// the game
	protected game: Phaser.Game;

	// game constants
	protected speed: number;
	protected speedUp: number;

	// game objects
	protected background: Background;
	protected obstacles: Obstacles;
	protected player: Player;
	protected score: Score;
	protected extras: Extras;

	/**
	 * Initialises a new game.
	 */
	constructor(protected id: string = "gameArea") {
		this.game = new Phaser.Game("100%", "100%", Phaser.AUTO, id, {
			preload: this.preload,
			create: this.create,
			update: this.update
		});
	}

	/**
	 * Preload resources before the game starts.
	 */
	preload = () => {
		this.game.load.physics("collision-shapes", "assets/shapes.json");
		this.game.load.audio("bg", "assets/bgmusic.mp3");
		Background.preload(this.game);
		Player.preload(this.game);
		Obstacles.preload(this.game);
		Score.preload(this.game);
		Extras.preload(this.game);
	};

	/**
	 * Create game objects.
	 */
	create = () => {
		// remove the loading text
		document.getElementById(this.id).className = "";

		// delete the cookie by setting the expiration to a point in "distant" past
  	document.cookie = "score=; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

		// play bg music
		const music = this.game.add.audio("bg", 1, true);
		music.play();

		// define "constants"
		this.speed = 100;
		this.speedUp = 10;

		// system setup
		this.game.physics.startSystem(Phaser.Physics.P2JS);
		this.game.physics.p2.gravity.y = 1000;

		// create game objects
		this.background = new Background(this.game, this.speed);
		this.player = new Player(this.game);
		this.player.triggerDeath = this.endGame;
		this.obstacles = new Obstacles(this.game, this.speed);
		this.score = new Score(this.game);
		this.extras = new Extras(this.game);

		// collisions:
		const playerGroup = this.game.physics.p2.createCollisionGroup();
		const platformGroup = this.game.physics.p2.createCollisionGroup();
		const groundGroup = this.game.physics.p2.createCollisionGroup();
		const obstaclesGroup = this.game.physics.p2.createCollisionGroup();
		const extrasGroup = this.game.physics.p2.createCollisionGroup();
		this.player.setColllisionGroup(playerGroup, [ platformGroup, obstaclesGroup, extrasGroup ]);
		this.player.Sprite.body.onBeginContact.add((body) => {
			if (Extras.types.indexOf(body.sprite.key) >= 0) {
				this.score.addScore(this.extras.take(body));
			}
		}, this); // take the extra!!
		this.obstacles.setColllisionGroup(obstaclesGroup, [ playerGroup, groundGroup, extrasGroup ]);
		this.background.setMovingColllisionGroup(groundGroup, [ obstaclesGroup, extrasGroup ]);
		this.background.setStillColllisionGroup(platformGroup, [ playerGroup ]);
		this.extras.setColllisionGroup(extrasGroup, [ groundGroup, obstaclesGroup, playerGroup ]);

		// start increasing the speed
		setTimeout(this.changeSpeed, 5000);
	};

	/**
	 * Update all game instances
	 */
	update = () => {
		this.background.update();
		this.obstacles.update();
		this.player.update(this.game.time.elapsed);
	};

	/**
	 * Increase the pace of the game.
	 */
	changeSpeed = () => {
		this.speed += this.speedUp;
		this.obstacles.changeSpeed(this.speed);
		this.background.changeSpeed(this.speed);
		setTimeout(this.changeSpeed, 5000);
	};

	/**
	 * End the game. 
	 */
	endGame = () => {
		this.player.die(this.score.getTotalScore());
	};
}

window.onload = () => {
	const game = new ScoutGame();
};