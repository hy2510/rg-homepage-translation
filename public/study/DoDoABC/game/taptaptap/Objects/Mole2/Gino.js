export default class Gino extends Phaser.GameObjects.Container {
    constructor(data) {
        let { scene, x, y, img } = data;

        let bg = new Phaser.GameObjects.Sprite(scene, 0, 0, "gino")
        let image = new Phaser.GameObjects.Image(scene, 0, 0, img).setScale(0.7).setOrigin(0.5, 0.2);

        // 애니메이션 생성 [
        bg.anims.create({
            key: "default",
            frames: bg.anims.generateFrameNumbers("gino", { frames: [0, 0] }),
            repeat: 0
        })

        bg.anims.create({
            key: "correct",
            frames: bg.anims.generateFrameNumbers("gino", { frames: [2, 2] }),
            repeat: 0
        })

        bg.anims.create({
            key: "incorrect",
            frames: bg.anims.generateFrameNumbers("gino", { frames: [1, 1] }),
            repeat: 0
        })
        // ] 애니메이션 생성 end

        super(scene, x, y, [bg, image])
        this.scene = scene;
        this.bg = bg;
        this.image = image;

        this.scene.add.existing(this);
    }

    static preload(scene) {
        scene.load.spritesheet("gino", "./images/Mole2/img_gino.png", { frameWidth: 338, frameHeight: 354 });
    }

    changeFrame(state) {
        this.bg.anims.play(state);
    }

    changeImage(img) {
        this.image.setTexture(img)
    }
}