export default class QuestionText extends Phaser.GameObjects.Text {
    constructor(data) {
        let { scene, x, y, text } = data;

        const fontConfig = {
            fontFamily: "Sandoll Gyeokdonggulim",
            fontSize: "36px",
            fontStyle: "bold",
            color: "orange",
            align: "center",
            fixedWidth: 265
        };

        super(scene, x, y, text, fontConfig);

        this.scene = scene;

        this.setInteractive({
            cursor: 'url(../../include/images/cursor_hover.png), pointer'
        });

        this.on("pointerdown", () => {
            this.scene.quizSoundArr[this.scene.correctCount].play();
        })

        this.setDepth(4);
        this.scene.add.existing(this);                              // 오브젝트 생성.
    }
}