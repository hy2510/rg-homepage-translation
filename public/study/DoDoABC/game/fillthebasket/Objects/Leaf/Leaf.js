export default class Leaf extends Phaser.GameObjects.Container {
    constructor(data) {
        let { scene, bg, letter } = data;

        let bgLeaf = new Phaser.GameObjects.Sprite(scene, 0, 0, bg);
        let text = new Phaser.GameObjects.Text(scene, 0, 0, letter, {
            fontFamily: "Sandoll Gyeokdonggulim",
            fontSize: "76px",
            fill: "#000000",
            align: "left"
        });
        text.setOrigin(0.5)

        super(scene, 0, 0, [bgLeaf, text])
        this.scene = scene;
        this.bg = bg;
        this.bgLeaf = bgLeaf;
        this.text = text;

        this.setSize(this.bgLeaf.width, this.bgLeaf.height);        // 배경 사이즈로
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
        // 낙엽
        scene.load.image("leaf1", "./images/Leaf/img_leaf_01.png");
        scene.load.image("leaf2", "./images/Leaf/img_leaf_02.png");
        scene.load.image("leaf3", "./images/Leaf/img_leaf_03.png");
        scene.load.image("leaf4", "./images/Leaf/img_leaf_04.png");
        scene.load.image("leaf5", "./images/Leaf/img_leaf_05.png");
    }
}