/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

export default class Extras {

	static types = [
		"feather",
		"beaver",
		"hat"
	];

	static scores = {
		"beaver": 5,
		"feather": 10,
		"hat": 20
	};

	static preload(game: Phaser.Game) {
		game.load.image("feather", "assets/feather.png");
		game.load.image("beaver", "assets/beaver.png");
		game.load.image("hat", "assets/hat.png");
		game.load.audio("mam-to", "assets/mam-to.mp3");
	}

	protected items: Array<Phaser.Sprite>;
	protected mamToSound: any;

	constructor(protected game: Phaser.Game) {
		this.items = [];
		this.currentSpeed = 300;
		this.mamToSound = game.add.audio("mam-to", 0.5, false);
		setTimeout(this.addExtra, 5000);
	}

	protected addExtra = () => {
		const item = Extras.types[Math.floor(Math.random() * 10 % Extras.types.length)];
		const next: Phaser.Sprite = this.game.add.sprite(this.game.width, 0, item);
		this.game.physics.p2.enable(next);
		next.body.clearShapes();
		next.body.loadPolygon("collision-shapes", item);
		next.body.x = this.game.width + next.width;
		next.body.y = 0;
		next.body.collideWorldBounds = false;
		next.body.velocity.x = -this.currentSpeed;
		next.body.setCollisionGroup(this.collisionGroup);
		next.body.collides(this.collideWith);
		next.body.restitution = 0.9;
		next.key = item;
		this.items.push(next);
		setTimeout(this.addExtra, 2000 + 5000 * Math.random());
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

	take = (extra: Phaser.Physics.P2.Body): number => {
		const score = Extras.scores[extra.sprite.key as string];
		this.mamToSound.play();
		extra.sprite.kill();
		return score;
	};
}