export default class Chello extends Phaser.GameObjects.Container {
    constructor(data) {
        let { scene, x, y, text } = data;

        let bg = new Phaser.GameObjects.Sprite(scene, 0, 0, "chello");
        let question = new Phaser.GameObjects.Text(scene, 0, 60, text, {
            font: "65px Sandoll Gyeokdonggulim",
            fill: "#000",
        }).setOrigin(0.5);

        // 애니메이션 생성 [
        bg.anims.create({
            key: "default",
            frames: bg.anims.generateFrameNumbers("chello", { frames: [0, 0] }),
            repeat: 0
        })

        bg.anims.create({
            key: "incorrect",
            frames: bg.anims.generateFrameNumbers("chello", { frames: [1, 1] }),
            repeat: 0
        })

        bg.anims.create({
            key: "correct",
            frames: bg.anims.generateFrameNumbers("chello", { frames: [2, 2] }),
            repeat: 0
        })
        // ] 애니메이션 생성 end

        super(scene, x, y, [bg, question]);
        this.scene = scene;
        this.bg = bg;
        this.question = question;

        this.setSize(this.bg.width, this.bg.height);
        this.scene.add.existing(this);
    }

    static preload(scene) {
        scene.load.spritesheet("chello", "./images/Sea/img_chello.png", { frameWidth: 330, frameHeight: 243 });
    }

    changeFrame(state) {
        this.bg.anims.play(state);
    }

    changeQuestion(text) {
        console.log(this.question);
        this.question.setText(text);
    }

}