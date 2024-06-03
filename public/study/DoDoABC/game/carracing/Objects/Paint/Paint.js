export default class Paint extends Phaser.GameObjects.Container {
    constructor(data) {
        let { scene, line, question } = data;
        let y = 0;

        switch (line) {
            case 0:
                y = 255;
                break;

            case 1:
                y = 422;
                break;

            case 2:
                y = 590;
                break;
        }

        const bg = new Phaser.GameObjects.Sprite(scene, 0, 0, "bubble");
        const imgQuestion = new Phaser.GameObjects.Sprite(scene, 0, 0, question);

        super(scene, 1400, y, [bg, imgQuestion]);
        this.scene = scene;
        this.bg = bg;
        this.question = question;
        this.imgQuestion = imgQuestion;

        this.setSize(this.bg.width, this.bg.height);
        this.imgQuestion.setScale(0.55);

        this.setDepth(4);

        this.scene.physics.add.existing(this);                      // 충돌선
        this.scene.add.existing(this);                              // 오브젝트 생성.
    }

    static preload(scene) {
        scene.load.image("bubble", "./images/Paint/img_bubble.png");
    }

    preUpdate(time, delta) {
        this.x -= this.scene.carSpeed;
    }

    destroyPaint() {
        this.destroy();
    }

    getTextValue() {
        return this.question;
    }
}