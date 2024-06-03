export default class Tori extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, x, y } = data;

        super(scene, x, y, "tori")
        this.scene = scene;
        this.setOrigin(0.5);

        // 애니메이션 생성 [
        this.anims.create({
            key: "default",
            frames: this.anims.generateFrameNumbers("tori", { frames: [0, 1] }),
            repeat: -1,
            duration: 2000
        })

        this.anims.create({
            key: "incorrect",
            frames: this.anims.generateFrameNumbers("tori", { frames: [2] }),
            repeat: 0,
            duration: 1000
        })

        this.anims.create({
            key: "correct",
            frames: this.anims.generateFrameNumbers("tori", { frames: [3] }),
            repeat: 0,
            duration: 1000
        })
        // ] 애니메이션 생성 end

        this.on("animationcomplete-correct", () => {
            this.changeFrame("default");
        })

        this.on("animationcomplete-incorrect", () => {
            this.changeFrame("default");
        })

        this.scene.add.existing(this);
        this.anims.play("default");
    }

    static preload(scene) {
        scene.load.spritesheet("tori", "./images/Acorn/img_tori.png", { frameWidth: 332, frameHeight: 206 });
    }

    changeFrame(state) {
        this.anims.play(state);
    }
}