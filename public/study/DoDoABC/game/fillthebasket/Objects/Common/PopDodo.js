export default class PopDodo extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, image, animation } = data;

        super(scene, 640, 400, image);
        this.scene = scene;
        this.animation = animation;

        this.setOrigin(0.5);

        // 첫번째 성공
        this.anims.create({
            key: "successFirst",
            frames: this.anims.generateFrameNumbers("popPoint01", {
                frames: [0, 1, 2, 3, 4, 5, 6]
            }),
            frameRate: 7,
            repeat: -1
        })

        // 두번째 성공
        this.anims.create({
            key: "successSecond",
            frames: this.anims.generateFrameNumbers("popPoint02", {
                frames: [0, 1, 2, 3, 4, 5, 6]
            }),
            frameRate: 7,
            repeat: -1
        })

        // 세번째 이상 성공
        this.anims.create({
            key: "successThird",
            frames: this.anims.generateFrameNumbers("popPoint03", {
                frames: [0, 1, 2, 3, 4, 5, 6]
            }),
            frameRate: 7,
            repeat: -1
        })

        // 실패
        this.anims.create({
            key: "fail",
            frames: this.anims.generateFrameNumbers("popFail", {
                frames: [0, 1]
            }),
            frameRate: 2,
            repeat: -1
        })

        // 캐릭터 내보내기
        this.scene.add.existing(this);
        this.play(this.animation);
    }

    static preload(scene) {
        scene.load.spritesheet("popFail", "./images/Common/img_pop_fail.png", { frameWidth: 336, frameHeight: 298 });
        scene.load.spritesheet("popPoint01", "./images/Common/img_pop_point_01.png", { frameWidth: 336, frameHeight: 298 });
        scene.load.spritesheet("popPoint02", "./images/Common/img_pop_point_02.png", { frameWidth: 336, frameHeight: 298 });
        scene.load.spritesheet("popPoint03", "./images/Common/img_pop_point_03.png", { frameWidth: 336, frameHeight: 298 });
    }
}