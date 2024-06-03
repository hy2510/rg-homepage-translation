export default class EdmondSuccess extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, x, y } = data;

        const frames = [0, 1, 2, 3, 4, 5];

        super(scene, x, y, "edmondSuccess");

        this.scene = scene;

        this.scene.anims.create({
            key: "edmondSuccess",
            frames: this.scene.anims.generateFrameNumbers("edmondSuccess", { frames: frames }),
            frameRate: 7,
            repeat: -1
        });

        this.scene.add.existing(this);
    } 

    static preload(scene) {
        scene.load.spritesheet("edmondSuccess", "./images/Common/img_edmond_success.png", { frameWidth: 230, frameHeight: 243 });
    }
}