export default class Ghost extends Phaser.GameObjects.Container {
    constructor(data) {
        let { scene, x, y, string } = data;

        // 유령 배경
        let bg = new Phaser.GameObjects.Sprite(scene, 0, 0, "ghost");

        // 애니메이션 생성 [
        bg.anims.create({
            key: "default",
            frames: bg.anims.generateFrameNumbers("ghost", { frames: [0, 0] }),
            repeat: 0
        })

        bg.anims.create({
            key: "dead",
            frames: bg.anims.generateFrameNumbers("ghost", { frames: [1, 1] }),
            repeat: 0
        })
        // ] 애니메이션 생성 end

        // 알파벳
        let question = new Phaser.GameObjects.Text(scene, 0, 0, string, {
            fontFamily: "Sandoll Gyeokdonggulim",
            fontSize: "65px",
            fill: "#000",
            align: "center"
        })

        question.setOrigin(0.5, 0.15);

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
        this.scene.add.existing(this);                              // 오브젝트 생성.
    }

    static preload(scene) {
        scene.load.spritesheet("ghost", "./images/Ghost/img_ghost.png", { frameWidth: 249, frameHeight: 228 });
    }

    preUpdate() {
        if (this.x <= -124.5 && !this.shake) {
            this.removeTween();
            this.destroyGhost();
        }
    }

    removeTween() {
        this.body.enable = false;
        this.tween.remove();
    }

    destroyGhost() {
        this.destroy();
    }

    killGhost() {
        this.removeTween();

        this.bg.anims.play("dead");

        this.tween = this.scene.tweens.add({
            targets: this,
            duration: 1000,
            ease: 'Linear',
            alpha: 0,            
            onComplete: this.afterDeadGhost
        });
    }

    afterDeadGhost(target) {
        let ghost = target.targets[0];

        ghost.scene.moon.changeFrame("default");
        ghost.removeTween();
        ghost.destroyGhost();
    }

    shakeGhost() {
        this.removeTween();

        this.shake = this.scene.plugins.get("rexshakepositionplugin").add(this);

        this.shake.shake();

        this.shake.on("complete", () => {
            this.scene.moon.changeFrame("default");

            this.scene.restartManager();
            this.destroyGhost();
        })
    }
}