export default class ExitButton extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, x, y, endObj } = data;

        super(scene, x, y, "exit");
        this.scene = scene;

        this.setInteractive({
            cursor: 'url(../../include/images/cursor_hover.png), pointer'
        });

        this.on("pointerdown", () => {
            showTodayGoal(endObj, scene);
        })

        scene.add.existing(this);
    }

    static preload(scene) {
        scene.load.image("exit", "./images/Common/img_btn_exit.png");
    }
}