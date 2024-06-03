export default class ExitButton extends Phaser.GameObjects.Sprite {
    constructor(data) {
        //let { scene, x, y } = data;
        let { scene, x, y, endObj } = data;

        super(scene, x, y, "btnExit");
        this.scene = scene;

        this.setOrigin(0);

        this.setInteractive({
            cursor: 'url(../../include/images/cursor_hover.png), pointer'
        });

        this.once("pointerdown", () => {
            //goDodo();
            showTodayGoal(endObj, scene);
        })

        this.scene.add.existing(this);                              // 오브젝트 생성.
    }

    static preload(scene) {
        scene.load.image("btnExit", "./images/Common/img_btn_exit.png");
    }
}