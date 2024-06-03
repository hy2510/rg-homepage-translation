export default class Acorn extends Phaser.GameObjects.Container {
    constructor(data) {
        let { scene, x, y, num, string } = data;

        // 도토리 배경
        let bg = new Phaser.GameObjects.Sprite(scene, 0, 0, `acorn${num}`);

        let fontSize = string.length == 2 ? "65px" : "50px";

        // 알파벳
        let question = new Phaser.GameObjects.Text(scene, 0, 0, string, {
            fontFamily: "Sandoll Gyeokdonggulim",
            fontSize: `${fontSize}`,
            fill: "#000",
            align: "center"
        })

        if (num % 2 == 1) {
            question.setOrigin(0.6, 0.2);
        }
        else {
            question.setOrigin(0.4, 0.2);
        }

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
        scene.load.image("acorn1", "./images/Acorn/img_acorn_01.png");
        scene.load.image("acorn2", "./images/Acorn/img_acorn_02.png");
        scene.load.image("acorn3", "./images/Acorn/img_acorn_03.png");
        scene.load.image("acorn4", "./images/Acorn/img_acorn_04.png");
    }

    preUpdate() {
        if (this.x <= -80 && !this.shake) {
            this.removeTween();
            this.destroyAcorn();
        }
    }

    removeTween() {
        this.body.enable = false;
        this.tween.remove();
    }

    destroyAcorn() {
        this.destroy();
    }

    fallingAcorn() {
        this.removeTween();

        this.tween = this.scene.tweens.add({
            targets: this,
            duration: 1000,
            ease: 'Linear',
            y: 600,
            alpha: 0,
            scale: 0.5,
            onComplete: this.afterFallingAcorn
        });
    }

    afterFallingAcorn(target) {
        let acorn = target.targets[0];

        acorn.removeTween();
        acorn.destroyAcorn();
    }

    shakeAcorn() {
        this.removeTween();

        this.shake = this.scene.plugins.get("rexshakepositionplugin").add(this);

        this.shake.shake();

        this.shake.on("complete", () => {
            this.scene.restartManager();
            this.destroyAcorn();
        })
    }
}