export default class CarBase extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, image, frameCnt } = data;

        super(scene, 0, 0, image);
        this.scene = scene;
        this.isClick = false;

        // 기본
        this.anims.create({
            key: "default",
            frames: this.anims.generateFrameNumbers(image, {
                start: 0,
                end: 0
            }),
            repeat: 0
        });

        // 선택됐을 때
        this.anims.create({
            key: "selected",
            frames: this.anims.generateFrameNumbers(image, {
                start: 1,
                end: frameCnt
            }),
            frameRate: 7,
            repeat: -1
        });

        this.scene.physics.world.enable(this);                          // 물리 추가

        // 캐릭터 내보내기
        this.scene.add.existing(this);
        this.play("default");
    }

    static preload(scene) {
        scene.load.spritesheet("ginoCar", "./images/Common/img_intro_car_01.png", { frameWidth: 280, frameHeight: 292 });
        scene.load.spritesheet("roroCar", "./images/Common/img_intro_car_02.png", { frameWidth: 280, frameHeight: 292 });
        scene.load.spritesheet("baroCar", "./images/Common/img_intro_car_03.png", { frameWidth: 280, frameHeight: 292 });
    }

    changeState(state) {
        this.play(state);
    }

    changeClickState(state) {
        this.isClick = state;
    }
}