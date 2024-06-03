export default class SpeakerButton extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, x, y } = data;

        super(scene, x, y, "speaker");
        this.scene = scene;

        this.setInteractive({
            cursor: 'url(../../include/images/cursor_hover.png), pointer'
        });

        this.on("pointerdown", () => {
            this.scene.quizSoundArr[this.scene.correctCount].play();
        })

        this.setDepth(3);
        this.scene.add.existing(this);
    }

    static preload(scene) {
        scene.load.image("speaker", "../../include/images/speaker01.png");
    }
}