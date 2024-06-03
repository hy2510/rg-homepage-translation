export default class EdmondFail extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, x, y } = data;

        const frames = [0, 1, 2, 3];

        super(scene, x, y, "edmondFail");

        this.scene = scene;

        this.scene.anims.create({
            key: "edmondFail",
            frames: this.scene.anims.generateFrameNumbers("edmondFail", { frames: frames }),
            frameRate: 7,
            repeat: -1
        });

        this.scene.add.existing(this);
    } 

    static preload(scene) {
        scene.load.spritesheet("edmondFail", "./images/Common/img_edmond_fail.png", { frameWidth: 230, frameHeight: 243 });
    }
}