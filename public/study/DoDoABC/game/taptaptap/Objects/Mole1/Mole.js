export default class Mole extends Phaser.GameObjects.Container {
    constructor(data) {
        let { scene, x, y, text } = data;

        let bg = new Phaser.GameObjects.Sprite(scene, 0, 0, "mole");
        let texture = new Phaser.GameObjects.Text(scene, -65, 85, text, {
            font: "42px Sandoll Gyeokdonggulim",
            fill: "#000",
            align: "center"
        }).setOrigin(0.475, 0.55)

        super(scene, x, y, [bg, texture]);

        this.scene = scene;
        this.bg = bg;
        this.texture = texture;

        this.isHide = true;

        this.question;
        this.process;

        // 애니메이션 생성 [
        this.bg.anims.create({
            key: "default",
            frames: this.bg.anims.generateFrameNumbers("moleDefault", { frames: [0] }),
            repeat: 0
        })

        this.bg.anims.create({
            key: "up",
            frames: this.bg.anims.generateFrameNumbers("moleDefault", { frames: [1, 2, 3, 4, 5, 6] }),
            repeat: 0,
            duration: 300
        })

        this.bg.anims.create({
            key: "down",
            frames: this.bg.anims.generateFrameNumbers("moleDefault", { frames: [6, 5, 4, 3, 2, 1, 0] }),
            repeat: 0
        })

        this.bg.anims.create({
            key: "correct",
            frames: this.bg.anims.generateFrameNumbers("moleCorrect", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 6, 7, 6, 7] }),
            repeat: 0
        })

        this.bg.anims.create({
            key: "incorrect",
            frames: this.bg.anims.generateFrameNumbers("moleIncorrect", { frames: [0, 1, 2, 3, 4, 5, 6, 7, 8] }),
            repeat: 0,
            duration: 500
        })

        this.bg.on('animationstart', frame => {
            let animation = frame.key;

            if (animation == "default") {
                this.isHide = true;
            }
            else if (animation == "correct" || animation == "incorrect") {
                this.isHide = false;
            }
            else if (animation == "down") {
                this.changeText("");
            }
        });

        this.bg.on('animationcomplete', frame => {
            let animation = frame.key;

            if (animation == "correct") {
                this.scene.correctSound.play();

                this.changeState("default");

                this.isHide = true;
                this.scene.isClick = false;

                this.changeText("");
            }
            else if (animation == "up") {
                this.scene.molePopup.play();

                this.isHide = false;

                this.changeText(this.question);

                this.addProcess();
            }
            else if (animation == "down") {
                this.scene.molePopdown.play();

                this.isHide = true;

                this.destroyProcess();
            }
            else if (animation == "incorrect") {
                this.scene.incorrectSound.play();

                this.scene.isClick = false;

                this.resumeProcess();
            }
        });
        // ] 애니메이션 생성 end

        this.bg.setInteractive();
        this.bg.input.hitArea.setTo(0, 40, 250, 209);

        this.bg.setInteractive().on("pointerdown", () => {
            // 게임이 끝난 경우에도 클릭되는 것 방지.
            if (this.scene.isPass != "") {
                return false;
            }

            if (this.scene.isClick || this.isHide) {
                return false;
            }

            // 망치로 내려찍는 순간이 딱 2초가 간신히 넘는 경우 방지. [
            let ms = this.process.getElapsed();

            if (ms >= 2000) {
                return false;
            }
            // ] 망치로 내려찍는 순간이 딱 2초가 간신히 넘는 경우 방지. end

            this.pauseProcess();

            this.scene.isClick = true;

            let clickNum = this.scene.moles.indexOf(this);

            if (this.question == this.scene.correctText) {
                this.scene.numArr = this.scene.numArr.filter(el => el != clickNum);

                this.scene.correctCount++;
                this.scene.scoreText.changeScore(this.scene.correctCount);

                this.changeState("correct");

                // 결과창
                if (this.scene.maxQuizCount == this.scene.correctCount) {

                    this.scene.isClick = false;
                    this.scene.isPass = "success";

                    this.scene.setReward();
                }
            }
            else {
                this.scene.heartArr[this.scene.deathCount].disableHeart();

                if (this.scene.deathCount < 4) {
                    this.scene.deathCount++;

                    this.changeState("incorrect");
                }
                else {
                    // 결과창
                    this.scene.isClick = false;
                    this.scene.isPass = "fail";

                    this.scene.setReward();
                }
            }
        })

        this.bg.anims.play("default");
        this.scene.add.existing(this);                              // 오브젝트 생성.
    }

    static preload(scene) {
        scene.load.spritesheet("moleDefault", "./images/Mole1/img_mole_default.png", { frameWidth: 370, frameHeight: 249 })
        scene.load.spritesheet("moleCorrect", "./images/Mole1/img_mole_correct.png", { frameWidth: 370, frameHeight: 249 })
        scene.load.spritesheet("moleIncorrect", "./images/Mole1/img_mole_incorrect.png", { frameWidth: 370, frameHeight: 249 })
    }

    changeState(key) {
        this.bg.anims.play(key);
    }

    changeText(str) {
        this.texture.setText(str);
    }

    addProcess() {
        this.process = this.scene.time.delayedCall(2000, this.changeState, ["down"], this);
    }

    pauseProcess() {
        this.process.paused = true;
    }

    resumeProcess() {
        this.process.paused = false;
    }

    destroyProcess() {
        this.process.destroy();
    }
}