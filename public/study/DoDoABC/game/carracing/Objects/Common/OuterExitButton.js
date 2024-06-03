export default class OuterExitButton extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, x, y } = data;

        super(scene, x, y, "btnClose");
        this.scene = scene;

        this.setOrigin(0);

        this.setInteractive({
            cursor: 'url(../../include/images/cursor_hover.png), pointer'
        });

        this.once("pointerdown", () => {
            goDodo();
        })

        this.setDepth(6);
        this.scene.add.existing(this);                              // 오브젝트 생성.
    }

    static preload(scene) {
        scene.load.image("btnClose", "./images/Common/img_btn_close.png");
    }
}