export default class RightButton extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, x, y} = data;

        super(scene, x, y, "rightButtonImg");

        this.scene = scene;
        this.setDepth(4);

        this.setInteractive({
            cursor: 'url(../../include/images/cursor_hover.png), pointer'
        });


        this.on('pointerdown', (event) => {
            this.scene.dodo.key.right.isDown = true;
        });

        this.on('pointerup', (event) => {
            this.scene.dodo.key.right.isDown = false;
        });

        this.on('pointerout', (event) => {
            this.scene.dodo.key.right.isDown = false;
        });

        this.scene.add.existing(this);

    }

    static preload(scene) {
        scene.load.image("rightButtonImg", "./images/Common/right_button.png");
    }


}