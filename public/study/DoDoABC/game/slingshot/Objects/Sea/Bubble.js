export default class Bubble extends Phaser.GameObjects.Container {
    constructor(data) {
        let { scene, x, y, image } = data;
        
        let bg = new Phaser.GameObjects.Sprite(scene, 0, 0, "bubble");

        // 애니메이션 생성 [
        bg.anims.create({
            key: "default",
            frames: bg.anims.generateFrameNumbers("bubble", { frames: [0, 0] }),
            repeat: 0
        })

        bg.anims.create({
            key: "burst",
            frames: bg.anims.generateFrameNumbers("bubble", { frames: [0, 1, 2, 3, 4, 5, 6, 7] }),
            duration: 1000,
            repeat: 0
        })
        // ] 애니메이션 생성 end

        // 이미지
        let question = new Phaser.GameObjects.Image(scene, 0, 0, image);
        question.setScale(0.5);

        super(scene, x, y, [bg, question]);
        this.scene = scene;
        this.bg = bg;
        this.question = question;

        this.tween;
        this.pathFollower;
        this.shake;

        this.setSize(this.bg.width, this.bg.height);                // 배경 사이즈로

        this.pathFollower = this.scene.plugins.get('rexpathfollowerplugin').add(this, {
            path: this.scene.path,
        });

        this.tween = this.scene.tweens.add({
            targets: this.pathFollower,
            t: 1,
            ease: 'Linear',
            duration: 8000,
        });

        this.scene.physics.add.existing(this);                      // 충돌선
        this.body.isCircle = true;                                  // 충돌선 동그랗게

        this.scene.add.existing(this);                              // 오브젝트 생성.
    }

    static preload(scene) {
        scene.load.spritesheet("bubble", "./images/Sea/img_bubble.png", { frameWidth: 195, frameHeight: 195 });
    }

    preUpdate() {
        if (this.x <= -97.5 && !this.shake) {
            this.removeTween();
            this.destroyBubble();
        }
    }

    removeTween() {
        this.body.enable = false;
        this.tween.remove();
    }

    destroyBubble() {
        this.removeTween();
        this.destroy();
    }

    burstBubble() {
        this.removeTween();

        this.bg.on("animationcomplete", () => {
            this.afterBurstBubble();
        })

        this.bg.anims.play("burst");
    }

    afterBurstBubble() {
        this.scene.chello.changeFrame("default");
        this.removeTween();
        this.destroyBubble();
    }

    shakeBubble() {
        this.removeTween();

        this.shake = this.scene.plugins.get("rexshakepositionplugin").add(this);

        this.shake.shake();

        this.shake.on("complete", () => {
            this.scene.chello.changeFrame("default");

            this.scene.restartManager();
            this.destroyBubble();
        })
    }
}