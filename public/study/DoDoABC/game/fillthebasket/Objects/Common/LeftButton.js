export default class LeftButton extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, x, y } = data;

        super(scene, x, y, "leftButtonImg");

        this.scene = scene;
        this.setDepth(4);

        this.setInteractive({
            cursor: 'url(../../include/images/cursor_hover.png), pointer'
        });


        this.on('pointerdown', (event) => {
            this.scene.dodo.key.left.isDown = true;
            
        });

        this.on('pointerup', (event) => {
            this.scene.dodo.key.left.isDown = false;
        });

        this.on('pointerout', (event) => {
            this.scene.dodo.key.left.isDown = false;
        });

        this.scene.add.existing(this);
    }

    static preload(scene) {
        scene.load.image("leftButtonImg", "./images/Common/left_button.png");
    }
}