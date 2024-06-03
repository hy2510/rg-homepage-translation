export default class Star extends Phaser.GameObjects.Container {
    constructor(data) {
        let { scene, bg, letter } = data;

        // 별 배경
        let bgStar = new Phaser.GameObjects.Sprite(scene, 0, 0, bg);

        // 알파벳
        let text = new Phaser.GameObjects.Text(scene, 0, 0, letter, {
            fontFamily: "Sandoll Gyeokdonggulim",
            fontSize: "76px",
            fill: "#000",
            align: "center"
        }).setOrigin(0.5);

        super(scene, 0, 0, [bgStar, text])
        this.scene = scene;
        this.bg = bg;
        this.bgStar = bgStar;
        this.text = text;

        this.setSize(this.bgStar.width, this.bgStar.height);        // 배경 사이즈로
        this.scene.physics.add.existing(this);                      // 충돌선

        // 흔들리기
        scene.tweens.add({
            targets: this,
            x: "+=100",
            duration: 1000,
            yoyo: -1,
            repeat: -1
        })

        this.scene.add.existing(this);                              // 오브젝트 생성.
    }

    static preload(scene) {
        // 별
        scene.load.image("star1", "./images/Star/img_star_01.png");
        scene.load.image("star2", "./images/Star/img_star_02.png");
        scene.load.image("star3", "./images/Star/img_star_03.png");
        scene.load.image("star4", "./images/Star/img_star_04.png");
        scene.load.image("star5", "./images/Star/img_star_05.png");
    }
}