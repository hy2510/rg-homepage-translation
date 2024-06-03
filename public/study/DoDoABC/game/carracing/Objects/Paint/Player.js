export default class Character extends Phaser.Physics.Arcade.Sprite {
    constructor(data) {
        let { scene, character, frameCnt } = data;

        super(scene, -60, 170, character);
        this.scene = scene;
        this.isMove = true;

        // 캐릭터 애니메이션
        this.anims.create({
            key: "default",
            frames: this.anims.generateFrameNumbers(character, {
                start: 0,
                end: 0
            }),
            frameRate: 0
        });

        this.anims.create({
            key: "run",
            frames: this.anims.generateFrameNumbers(character, {
                start: 0,
                end: frameCnt
            }),
            frameRate: 10,
            repeat: -1
        })

        this.scene.physics.world.enable(this);                          // 물리 추가

        switch (character) {
            case "gino":
                this.body.setSize(190, 74);
                this.setOffset(70, 230);
                break;

            case "roro":
                this.body.setSize(185, 75);
                this.setOffset(110, 230);
                break;

            case "baro":
                this.body.setSize(185, 80);
                this.setOffset(95, 225);
                break;
        }

        this.setOrigin(0).setDepth(5);

        // 키보드 이벤트
        this.key = this.scene.input.keyboard.createCursorKeys();

        this.scene.add.existing(this);                                  // 오브젝트 생성.
        this.play("run");
    }

    static preload(scene) {
        scene.load.spritesheet("gino", "./images/Common/img_car_01.png", { frameWidth: 320, frameHeight: 335 });
        scene.load.spritesheet("roro", "./images/Common/img_car_02.png", { frameWidth: 370, frameHeight: 335 });
        scene.load.spritesheet("baro", "./images/Common/img_car_03.png", { frameWidth: 370, frameHeight: 335 });
    }

    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (!this.isMove) {
            if (this.key.up.isDown) {
                this.movePosition("up");
            }
            else if (this.key.down.isDown) {
                this.movePosition("down");
            }
        }
    }

    moveStartPosition() {
        this.setMoveState(true);

        // 자동차 엔진 소리
        this.scene.audEngine.play({
            mute: false,
            volume: 1,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        })

        this.scene.tweens.add({
            targets: this,
            x: "+=200",
            duration: 500,
            onComplete: this.doStart,
            onCompleteScope: this
        });
    }

    movePosition(state) {
        this.setMoveState(true);

        if (state == "up") {
            if (this.y <= 0) {
                this.setMoveState(false);
                return false
            }

            this.scene.move.play();

            this.scene.tweens.add({
                targets: this,
                y: "-=170",
                duration: 500,
                onComplete: this.afterMove,
                onCompleteScope: this
            });

        }
        else if (state == "down") {
            if (this.y >= 315) {
                this.setMoveState(false);
                return false
            }

            this.scene.move.play();

            this.scene.tweens.add({
                targets: this,
                y: "+=170",
                duration: 500,
                onComplete: this.afterMove,
                onCompleteScope: this
            });
        }
    }

    afterMove() {
        this.setMoveState(false);
    }

    moveFinishLine() {
        this.scene.track.stopTrack();
        this.scene.audFinish.play();

        this.scene.tweens.add({
            targets: this,
            x: "+=850",
            duration: 1000,
            onComplete: this.afterMoveFinishLine,
            onCompleteScope: this
        });
    }

    afterMoveFinishLine() {
        this.setMoveState(false);
        this.play("default");
        this.scene.audEngine.stop();
        this.scene.popReward(true);
    }

    setMoveState(state) {
        this.isMove = state;
    }

    doStart() {
        this.scene.track.activeTrack();
        this.scene.createExample();

        this.scene.quizSoundArr[this.scene.correctCount].play();

        this.setMoveState(false);
    }

    fireKeyEvent() {
        this.scene.input.keyboard.resetKeys();
        this.scene.input.keyboard.removeAllKeys();
    }
}