/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />


export default class Background {

	static preload(game: Phaser.Game) {
		game.load.image("scenery", "assets/ramzova.png");
		game.load.image("rocks", "assets/obri-skaly.png");
		game.load.image("path", "assets/path.png");
		game.load.image("path2", "assets/path2.png");
		game.load.image("cloud-1", "assets/cloud-1.png");
		game.load.image("cloud-2", "assets/cloud-2.png");
		game.load.image("cloud-3", "assets/cloud-3.png");
		game.load.image("cloud-4", "assets/cloud-4.png");
	}

	protected gameHeight: number;
	protected gameWidth: number;
	protected paths: Array<Phaser.Sprite>;
	protected clouds: Array<Phaser.Sprite>;
	protected platform: Phaser.Sprite;

	/**
	 * @param	game			The game instance
	 * @param gameTime	Time in seconds (needed for background paralaxing)
	 */
	constructor(game: Phaser.Game, movementSpeed: number = 150, gameTime: number = 180) {
		this.gameWidth = game.width;
		this.gameHeight = game.height;

		this.createParallaxBg(game, gameTime, "scenery");
		this.createClouds(game);
		this.createParallaxBg(game, gameTime, "rocks");
		this.createMovingPath(game, movementSpeed);
	}

	public get PathY(): number {
		return this.platform.body.y - this.platform.height;
	}

	/**
	 * The background scenery of the game.
	 */
	protected createParallaxBg(game: Phaser.Game, gameTime: number, layerName: string) {
		const bg = game.add.sprite(0, 0, layerName);
		// scale to fit the screen horizontally
		const scaleFactor = this.gameHeight / bg.height;
		bg.scale.setTo(scaleFactor, scaleFactor);

		// calculate the moving speed of the background - so the end is reached
		// by the end of the game time
		// game.physics.p2.enable(bg, true);
		// bg.body.static = true;
		// bg.body.x = bg.width / 2;
		// bg.body.x = bg.height / 2;
		// const speed = (bg.width - this.gameWidth) / gameTime;
		// bg.body.velocity.x = -speed; // move left at constant pace
	}

	/**
	 * Creates four different clouds moving to the left.
	 */
	protected createClouds(game: Phaser.Game) {
		this.clouds = [];
		for (let i = 1; i <= 4; i++) {
			const cloud: Phaser.Sprite = game.add.sprite(this.getRandomCloudXPosition(), this.getRandomCloudYPosition(), `cloud-${i}`);
			// init physics for the clouds - move, but no gravity applied
			game.physics.p2.enable(cloud);
			cloud.body.static = true;
			this.scaleCloud(cloud);
			this.resetCloudPosition(cloud);
			this.resetCloudVelocity(cloud);
			this.clouds.push(cloud);
		}
	}

	/**
	 * Creates a visual moving path on which player the "runs".
	 */
	protected createMovingPath(game: Phaser.Game, speed: number) {
		this.paths = [];
		for (let i = 0; i < 4; i++) {
			const spriteName = "path" + (i % 2 == 0 ? "" : "2");
			const path = game.add.sprite(0, 0, spriteName);
			this.initPhysicsForPath(game, spriteName, path, speed);
			path.body.x = path.width / 2 + (i > 0 ? this.paths[i-1].body.x + this.paths[i-1].width / 2 : 0);
			path.body.y = this.gameHeight - path.height / 2; // adjust the position to the bottom
			this.paths.push(path);
		}

		// add invisible platform onto which the player reallly stands
		const platform: Phaser.Sprite = game.add.sprite(0, game.height - this.paths[0].height / 2);
		platform.scale.setTo(2*this.gameWidth, 1); // make it large enough for the obstacles to land on behind the viewport
		game.physics.p2.enable(platform);
		platform.renderable = false;
		platform.body.static = true;
		this.platform = platform;
	}

	protected initPhysicsForPath(game: Phaser.Game, name: string, path: Phaser.Sprite, speed) {
		game.physics.p2.enable(path);
		path.body.collideWorldBounds = false;
		path.body.kinematic = true;
		path.body.clearShapes();
		path.body.loadPolygon("collision-shapes", name);

		// move the paths to simulate running of the player
		path.body.velocity.x = -speed;
	}

	update() {
		for (const cloud of this.clouds) {
			if (cloud.position.x + cloud.width < 0) {
				this.resetCloudPosition(cloud);
				this.resetCloudVelocity(cloud);
				this.scaleCloud(cloud);
			}
		}

		for (let i = 0; i < this.paths.length; i++) {
			const path = this.paths[i];
			const prevPath = this.paths[(i - 1 + this.paths.length) % this.paths.length];
			if (path.body.x + path.width / 2 <= 0) {
				path.body.x = prevPath.position.x + prevPath.width / 2 + path.width / 2;
			}
		}
	}

	protected scaleCloud(cloud: Phaser.Sprite) {
		const scaleFactor = (this.gameHeight * (0.05 + 0.15 * Math.random())) / cloud.height;
		cloud.scale.setTo(scaleFactor, scaleFactor);
	}

	protected resetCloudPosition(cloud: Phaser.Sprite) {
		cloud.body.x = this.getRandomCloudXPosition();
		cloud.body.y = this.getRandomCloudYPosition();
	}

	protected getRandomCloudXPosition(): number {
		return this.gameWidth + this.gameWidth * Math.random();
	}

	protected getRandomCloudYPosition(): number {
		return (this.gameHeight / 2) * Math.random();
	}

	/**
	 * Cloud shoud cross the screen in between 20 to 60 seconds
	 */
	protected resetCloudVelocity(cloud: Phaser.Sprite) {
		const minVelocity = this.gameWidth / 60;
		const maxVelocity = this.gameHeight / 20;
		cloud.body.velocity.x = -(minVelocity + maxVelocity * Math.random()); // move to the left
	}

	public changeSpeed(speed: number) {
		for (const path of this.paths) {
			path.body.velocity.x = -speed;
			path.body.velocity.x = -speed;
		}
	}

	setMovingColllisionGroup = (group: Phaser.Physics.P2.CollisionGroup, collidesWith: Phaser.Physics.P2.CollisionGroup[]) => {
		for (const path of this.paths) {
			path.body.setCollisionGroup(group);
			path.body.collides(collidesWith);
		}
	};

	setStillColllisionGroup = (group: Phaser.Physics.P2.CollisionGroup, collidesWith: Phaser.Physics.P2.CollisionGroup[]) => {
		this.platform.body.setCollisionGroup(group);
		this.platform.body.collides(collidesWith);
	};
}