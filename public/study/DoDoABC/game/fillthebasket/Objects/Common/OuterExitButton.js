export default class OuterExitButton extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, x, y } = data;

        super(scene, x, y, "exitButton");
        this.scene = scene;

        this.setInteractive({
            cursor: 'url(../../include/images/cursor_hover.png), pointer'
        });

        this.on("pointerdown", () => {
            goDodo();
        })

        scene.add.existing(this);
    }

    static preload(scene) {
        scene.load.image("exitButton", "../../include/images/ico_exit.png");
        //scene.load.image("exitButton", "/HP/Study/DodoABC/Assets/Images/exit.svg");
    }
}