/// <reference path="../node_modules/phaser/typescript/phaser.d.ts" />

export default class Score {

	static preload(game: Phaser.Game) {
		//game.load.bitmapFont()
	}

	protected score: number;
	protected text: Phaser.Text;

	constructor(game: Phaser.Game) {
		this.score = 0;
		this.text = game.add.text(20, 20, this.getScoreText(), { color: "white" });
	}

	protected getScoreText(): string {
		return `Skóre: ${this.score}`;
	}

	addScore = (score: number) => {
		this.score += score;
		this.text.setText(this.getScoreText());
	};

	getTotalScore = (): number => {
		return this.score;
	};

}