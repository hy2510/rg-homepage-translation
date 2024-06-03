export default class Cannon extends Phaser.GameObjects.Image {
    constructor(data) {
        const { scene, x, y, img } = data;

        super(scene, x, y, img);
        this.scene = scene;
        this.setDepth(1)
        this.setAngle(-90);
        this.setOrigin(0.35, 0.5);

        this.scene.add.existing(this);
    }

    static preload(scene) {
        // 대포
        scene.load.image("cannon", "./images/Ghost/img_cannon.png");
    }
}