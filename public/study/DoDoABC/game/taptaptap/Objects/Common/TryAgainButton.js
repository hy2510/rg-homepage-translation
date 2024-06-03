export default class TryAgainButton extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, x, y } = data;

        super(scene, x, y, "tryAgain");
        this.scene = scene;

        this.setInteractive({
            cursor: 'url(../../include/images/cursor_hover.png), pointer'
        });

        this.once("pointerdown", () => {
            scene.bgm.stop();
            scene.scene.stop();
            scene.registry.destroy();
            scene.events.off();
            scene.scene.restart();
        })

        scene.add.existing(this);
    }

    static preload(scene) {
        scene.load.image("tryAgain", "./images/Common/img_btn_try_again.png");
    }
}