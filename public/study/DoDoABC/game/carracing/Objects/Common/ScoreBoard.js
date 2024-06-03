export default class ScoreBoard extends Phaser.GameObjects.Container {
    constructor(data) {
        let { scene, x, y, maxCount } = data;

        const bg = new Phaser.GameObjects.Sprite(scene, 0, 0, "bgScore").setOrigin(0);

        const frontFontConfig = {
            fontFamily: "Sandoll Gyeokdonggulim",
            fontStyle: "bold",
            color: "blue",
            align: "right",
            fixedWidth: "25"
        };

        let frontText = new Phaser.GameObjects.Text(scene, 45, 36, "0", frontFontConfig);

        const backFontConfig = {
            fontFamily: "Sandoll Gyeokdonggulim",
            fontStyle: "bold",
            color: "#000",
            align: "center",
            fixedWidth: "45"
        };

        let backText = new Phaser.GameObjects.Text(scene, 75, 36, `${ maxCount }`, backFontConfig);

        super(scene, x, y, [bg, frontText, backText]);
        this.frontText = frontText;
        
        this.setDepth(3);
        this.scene.add.existing(this);                                          // 오브젝트 생성.
    }

    static preload(scene) {
        scene.load.image("bgScore", "./images/Common/img_wrapper_score.png");
    }

    changeScore(score) {
        this.frontText.setText(`${score}`);
    }
}