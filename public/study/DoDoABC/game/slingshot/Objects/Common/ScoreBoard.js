export default class ScoreBoard extends Phaser.GameObjects.Container {
    constructor(data) {
        let { scene, x, y, maxCount } = data;

        let bgScoreBoard = new Phaser.GameObjects.Sprite(scene, 0, 0, "scoreBoard");
        let text = new Phaser.GameObjects.Text(scene, 0, 0, `Score: 0 / ${maxCount}`, {
            fontFamily: "Sandoll Gyeokdonggulim",
            fontSize: "16px",
            fontStyle: "bold",
            color: "#522902",
            align: "left"
        });
        text.setOrigin(0.5)

        super(scene, x, y, [bgScoreBoard, text]);
        this.scene = scene;
        this.bgScoreBoard = bgScoreBoard;
        this.maxCount = maxCount;
        this.text = text;

        this.setSize(this.bgScoreBoard.width, this.bgScoreBoard.height);        // 배경 사이즈로
        this.setDepth(4);
        this.scene.add.existing(this);                                          // 오브젝트 생성.
    }

    static preload(scene) {
        scene.load.image("scoreBoard", "./images/Common/img_wrapper_score.png");
    }

    changeScore(score) {
        this.text.setText(`Score: ${score} / ${this.maxCount}`);
    }
}