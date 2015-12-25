/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

export default class Player {

	/**
	 * Preload the assets needed by the instances of Player class.
	 */
	static preload(game: Phaser.Game) {
		game.load.spritesheet("scout-movement", "assets/player.png", 130, 200);
		game.load.audio("hop", "assets/hop.mp3");
		game.load.audio("jauvajs", "assets/jauvajs.mp3");
	}

	protected hopSound: any;
	protected jauvajsSound: any;

	// player sprite
	protected sprite: Phaser.Sprite;

	/**
	 * Public getter to the Phaser.Sprite instance.
	 */
	public get Sprite(): Phaser.Sprite {
		return this.sprite;
	}

	constructor(game: Phaser.Game) {
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
		this.sprite.animations.add("run", [ 0, 1, 2, 1, 0, 3 ], 7, true);
		this.sprite.animations.add("jump", [ 3 ], 0, false);

		// audio
		this.hopSound = game.add.audio("hop", 0.3, false);
		this.jauvajsSound = game.add.audio("jauvajs", 0.8, false);

		// rotation - make a spin
		this.rotation = 0;
		this.isInAir = true;
	}

	// input state
	protected handleInput: boolean;
	protected currentState: boolean;
	protected lastState: boolean;

	// jumping state - enable double jumps and visual effects
	protected canDoubleJump: boolean;
	protected rotation: number;
	protected isInAir: boolean;

	// trigger the death of the player
	public triggerDeath: () => void = () => {};

	/**
	 * Initialises all different input methods - keyboard, mouse and touch.
	 */
	protected initInput = (game: Phaser.Game) => {
		this.handleInput = true;
		this.lastState = false;
		this.currentState = false;
		game.input.keyboard.onDownCallback = this.onDown;
		game.input.keyboard.onUpCallback = this.onUp;
		game.input.touch.onTouchStart = this.onDown;
		game.input.touch.onTouchEnd = this.onUp;
		game.input.mouse.onMouseDown = this.onDown;
		game.input.mouse.onMouseUp = this.onUp;
	};

	/**
	 * Update the game state for the next frame.
	 * @param time	Elapsed time since last frame in milliseconds.
	 */
	update = (time: number) => {
		if (this.rotation < 360) {
			this.rotation += (360 / 500) * time;
			this.sprite.angle = this.rotation;
			this.sprite.body.angle = this.rotation;
		} else {
			this.sprite.angle = 0;
			this.sprite.body.angle = 0;
		}

		if (this.isInAir == true && this.isTouching()) {
			this.run(); // he has landed
		}

		if (this.sprite.body.x + this.sprite.width < 0) {
			this.triggerDeath();
		}
	};

	/**
	 * Device agnostic "down" (lmb release, key release, touch release).
	 * Player can use any key, finger... 
	 */
	protected onDown = (e: Event) => {
		e.preventDefault(); // prevent from default browser behavior caused by the key

		if (this.handleInput === false) {
			return; // the player has probably died
		}

		if (this.lastState == false && this.canJump()) {
			this.jump();
		}
		this.lastState = true;
	};

	/**
	 * Device agnostic "up" (lmb release, key release, touch release)
	 */
	protected onUp = () => {
		this.lastState = false;
	};

	/**
	 * Change state to running.
	 */
	protected run = () => {
		this.sprite.animations.play("run");
	};

	/**
	 * Change state tu jumping.
	 */
	protected jump = () => {
		this.sprite.animations.play("jump");
		this.sprite.body.velocity.y = -720;
		this.sprite.body.velocity.x = 50;
		this.isInAir = true;
		this.hopSound.play();
	};

	/**
	 * Player can jump only when he is standing on the ground.
	 */
	protected canJump = () => {
		if (this.isTouching()) {
			this.canDoubleJump = true;
			return true;
		}

		if (this.canDoubleJump) {
			this.canDoubleJump = false; // no "triple jumps"
			this.rotation = -360;
			return true;
		}

		return false;
	};

	protected isTouching = () => {
		return Math.abs(this.sprite.position.y - this.sprite.previousPosition.y) < 2;
	};

	/**
	 * Respond to the end of game.
	 */
	die = (score: number) => {
		if (this.handleInput === true) {
			this.jauvajsSound.play();
			setTimeout(() => {
				document.cookie = `score=${score.toString()}`;
				window.location.replace(`save-score.html`);
			}, 3000);
		}
		this.handleInput = false;
		this.sprite.body.fixedRotation = false;
	};

	setColllisionGroup = (group: Phaser.Physics.P2.CollisionGroup, collidesWith: Array<Phaser.Physics.P2.CollisionGroup>) => {
		this.sprite.body.setCollisionGroup(group);
		this.sprite.body.collides(collidesWith);
	};
}