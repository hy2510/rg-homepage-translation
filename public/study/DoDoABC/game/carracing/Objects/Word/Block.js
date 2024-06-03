export default class Block extends Phaser.GameObjects.Container {
    constructor(data) {
        let { scene, color, line, question } = data;
        let y = 0;

        switch (line) {
            case 0:
                y = 230;
                break;

            case 1:
                y = 355
                break;

            case 2:
                y = 480;
                break;

            case 3:
                y = 605
                break;
        }

        const bg = new Phaser.GameObjects.Sprite(scene, 0, 0, color);

        const questionText = new Phaser.GameObjects.Text(scene, 0, 0, question, {
            fontFamily: "Sandoll Gyeokdonggulim",
            fontSize: "40px",
            fontStyle: "bold",
            color: "black",
            align: "center"
        }).setOrigin(0.5);

        super(scene, 1400, y, [bg, questionText]);
        this.scene = scene;
        this.bg = bg;
        this.questionText = questionText;

        this.setSize(this.bg.width, this.bg.height);

        this.setDepth(4);

        this.scene.physics.add.existing(this);                      // 충돌선
        this.scene.add.existing(this);                              // 오브젝트 생성.
    }

    static preload(scene) {
        scene.load.image("green", "./images/Word/img_box_word_green.png");
        scene.load.image("pink", "./images/Word/img_box_word_pink.png");
        scene.load.image("yellow", "./images/Word/img_box_word_yellow.png");
        scene.load.image("purple", "./images/Word/img_box_word_purple.png");
    }

    preUpdate(time, delta) {
        this.x -= this.scene.carSpeed;
    }

    destroyBlock() {
        this.destroy();
    }

    getTextValue() {
        return this.questionText._text;
    }
}