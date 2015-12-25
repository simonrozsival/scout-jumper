/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

export default class Obstacles {

	static obstacleTypes = {
		"tree": "assets/tree.png",
		"tree2": "assets/tree2.png",
		"tent": "assets/tent.png",
		"teepee": "assets/teepee.png",
		"gate": "assets/gate.png"
	};

	static preload(game: Phaser.Game) {
		for (const asset in Obstacles.obstacleTypes) {
			game.load.image(asset, Obstacles.obstacleTypes[asset]);
		}
	}

	protected gameWidth: number;
	protected items: Array<Phaser.Sprite>;

	constructor(protected game: Phaser.Game, speed: number) {
		this.gameWidth = game.width;
		this.items = [];
		this.currentSpeed = speed;
		setTimeout(this.sendObstacle, 1000); // first obstacle comes after 4 seconds
	}

	update = () => {
		for (const item of this.items) {
			if (item.body.x + item.width/2 < 0) {
				this.items.splice(this.items.indexOf(item), 1); // remove the item from the list
				item.destroy();
			} else if (item.previousPosition.x > item.position.x) {
				item.body.x = item.previousPosition.x; // do not move obstacles backwards
			}
		}
	};

	sendObstacle = () => {
		const asset = [ "tree", "tree2", "tent", "teepee", "gate" ][Math.floor(Math.random() * 10 % 5)];
		const next: Phaser.Sprite = this.game.add.sprite(this.game.width, 0, asset);
		this.game.physics.p2.enable(next);
		next.body.clearShapes();
		next.body.mass = 10000;
		next.body.loadPolygon("collision-shapes", asset);
		next.body.x = this.gameWidth + next.width + 200;
		next.body.y = 0;
		next.body.collideWorldBounds = false;
		next.body.velocity.x = -this.currentSpeed;
		next.body.setCollisionGroup(this.collisionGroup);
		next.body.collides(this.collideWith);
		next.body.fixedRotation = true;
		next.body.friction = 1;
		this.items.push(next);

		setTimeout(this.sendObstacle, 1000 + 5000 * Math.random());
	};

	protected currentSpeed: number;
	protected collisionGroup: Phaser.Physics.P2.CollisionGroup;
	protected collideWith: Phaser.Physics.P2.CollisionGroup[];

	public changeSpeed(speed: number) {
		this.currentSpeed = speed;
		for (const item of this.items) {
			item.body.velocity.x = -speed;
		}
	}

	setColllisionGroup = (group: Phaser.Physics.P2.CollisionGroup, collidesWith: Phaser.Physics.P2.CollisionGroup[]) => {
		this.collisionGroup = group;
		this.collideWith = collidesWith;
	};

	collideWithPlayer = () => {
		// @todo play sound
	};

}

