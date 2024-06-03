export default class DownButton extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, x, y } = data;

        super(scene, x, y, "downBtn");
        this.scene = scene;

        this.setOrigin(0);
        this.setDepth(5);

        this.setInteractive({
            cursor: 'url(../../include/images/cursor_hover.png), pointer'
        });

        this.on("pointerdown", () => {
            if (!this.scene.player.isMove) {
                this.scene.player.movePosition("down");
            }
        })

        this.scene.add.existing(this);                              // 오브젝트 생성.
    }

    static preload(scene) {
        scene.load.image("downBtn", "./images/Common/img_btn_down.png");
    }
}