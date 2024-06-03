export default class UpButton extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, x, y } = data;

        super(scene, x, y, "upBtn");
        this.scene = scene;

        this.setOrigin(0);
        this.setDepth(5);

        this.setInteractive({
            cursor: 'url(../../include/images/cursor_hover.png), pointer'
        });

        this.on("pointerdown", () => {
            if (!this.scene.player.isMove) {
                this.scene.player.movePosition("up");
            }
        })

        this.scene.add.existing(this);                              // 오브젝트 생성.
    }

    static preload(scene) {
        scene.load.image("upBtn", "./images/Common/img_btn_up.png");
    }
}