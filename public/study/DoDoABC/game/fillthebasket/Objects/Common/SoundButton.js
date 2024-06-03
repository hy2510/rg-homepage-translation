export default class SoundButton extends Phaser.GameObjects.Sprite {
    constructor(data) {
        //
        let { scene, x, y, questionSound } = data;

        super(scene, x, y, "soundImg");

        this.setDepth(4);
        
        this.questionSound = questionSound;

        this.setInteractive({
            cursor: 'url(../../include/images/cursor_hover.png), pointer'
        });

        this.on("pointerdown", () => {
            this.questionSound.play();
        });

        this.scene.add.existing(this);
    }

    static preload(scene) {
        scene.load.image("soundImg", "../../include/images/speaker01.png");
    }

}