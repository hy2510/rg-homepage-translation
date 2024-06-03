export default class Snow extends Phaser.GameObjects.Container {
    constructor(data) {
        let { scene, img } = data;

        let bgSnow = new Phaser.GameObjects.Sprite(scene, 0, 0, "snow");
        let innerImg = new Phaser.GameObjects.Sprite(scene, 0, 0, img);
        innerImg.setOrigin(0.5);
        innerImg.setScale(0.35);

        super(scene, 0, 0, [bgSnow, innerImg])
        this.scene = scene;
        this.bgSnow = bgSnow;
        this.innerImg = innerImg;

        this.setSize(this.bgSnow.width, this.bgSnow.height);        // 배경 사이즈로
        this.scene.physics.add.existing(this);                      // 충돌선

        // 흔들리기
        scene.tweens.add({
            targets: this,
            x: "+=100",
            duration: 1000,
            yoyo: -1,
            repeat: -1
        })

        this.scene.add.existing(this);                              // 오브젝트 생성.
    }

    static preload(scene) {
        // 눈
        scene.load.image("snow", "./images/Winter/img_snow.png");
    }
}