export default class CarBg extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene } = data;

        super(scene, 0, 0, "bgCar");
        this.scene = scene;
        this.isClick = false;

        // 기본
        this.anims.create({
            key: "default",
            frames: this.anims.generateFrameNumbers("bgCar", {
                frames: [0]
            }),
            repeat: 0
        });

        // 기본
        this.anims.create({
            key: "selected",
            frames: this.anims.generateFrameNumbers("bgCar", {
                frames: [1]
            }),
            repeat: 0
        });

        // 캐릭터 내보내기
        this.scene.add.existing(this);
        this.play("default");
    }

    static preload(scene) {
        scene.load.spritesheet("bgCar", "./images/Common/bg_intro_car.png", { frameWidth: 280, frameHeight: 292 });
    }

    changeState(state) {
        this.play(state);
    }

    changeClickState(state) {
        this.isClick = state;
    }
}