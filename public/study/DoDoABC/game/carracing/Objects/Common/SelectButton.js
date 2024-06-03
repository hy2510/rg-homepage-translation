export default class SelectButton extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, x, y } = data;

        super(scene, x, y, "selectBtn");

        this.setInteractive({
            cursor: 'url(../../include/images/cursor_hover.png), pointer'
        });

        this.once("pointerdown", () => {
            this.scene.intro.fireCarKeyEvent();

            this.scene.selectSound.once("complete", () => {
                this.closeIntro();
            })

            this.scene.selectSound.play();
        })

        this.scene.add.existing(this);                              // 오브젝트 생성.
    }

    static preload(scene) {
        scene.load.image("selectBtn", "./images/Common/img_btn_select.png");
    }

    closeIntro() {
        this.scene.startGame();
    }
}