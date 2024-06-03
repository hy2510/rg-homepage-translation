export default class Moon extends Phaser.GameObjects.Container {
    constructor(data) {
        let { scene, x, y, img } = data;

        let bg = new Phaser.GameObjects.Sprite(scene, 0, 0, "moon")
        let image = new Phaser.GameObjects.Image(scene, 0, 0, img);

        // 애니메이션 생성 [
        bg.anims.create({
            key: "default",
            frames: bg.anims.generateFrameNumbers("moon", { frames: [0, 0] }),
            repeat: 0
        })

        bg.anims.create({
            key: "correct",
            frames: bg.anims.generateFrameNumbers("moon", { frames: [1, 1] }),
            repeat: 0
        })

        bg.anims.create({
            key: "incorrect",
            frames: bg.anims.generateFrameNumbers("moon", { frames: [2, 2] }),
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
        scene.load.spritesheet("moon", "./images/Ghost/img_moon.png", { frameWidth: 340, frameHeight: 520 });
    }

    changeFrame(state) {
        this.bg.anims.play(state);
    }

    changeImage(img) {
        this.image.setTexture(img)
    }
}