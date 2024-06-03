export default class Heart extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, x, y } = data;

        super(scene, x, y, "heart");

        this.setDepth(4);
        this.scene.add.existing(this);
    }

    static preload(scene) {
        scene.load.image("heart", "./images/Common/img_heart.png");
    }

    removeHeart() {
        this.setVisible(false);
    }
}