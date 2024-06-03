export default class FlowerEffect extends Phaser.GameObjects.Sprite {
    constructor(data) {
        let { scene, flowerType } = data;
        let x = 0, flowerImage = "";

        switch (flowerType) {
            case 0:
                x = 130;
                flowerImage = "flower1";
                break;

            case 1:
                x = 300;
                flowerImage = "flower2";
                break;

            case 2:
                x = 500;
                flowerImage = "flower3";
                break;

            case 3:
                x = 900;
                flowerImage = "flower4";
                break;

            case 4:
                x = 350;
                flowerImage = "flower5";
                break;

            case 5:
                x = 450;
                flowerImage = "flower6";
                break;

            case 6:
                x = 950;
                flowerImage = "flower7";
                break;

            case 7:
                x = 950;
                flowerImage = "flower8";
                break;

            case 8:
                x = 1050;
                flowerImage = "flower3";
                break;

            case 9:
                x = 1150;
                flowerImage = "flower4";
                break;

            case 10:
                x = 700;
                flowerImage = "flower5";
                break;


            case 11:
                x = 850;
                flowerImage = "flower6";
                break;
        }

        super(scene, x, -30, flowerImage);

        this.scene = scene;

        this.setOrigin(0.5);

        this.scene.tweens.addCounter({
            from: 0,
            to: 360,
            duration: 100000,
            repeat: -1,
            onUpdate: tween => {
                //this.setAngle(tween.getValue());
                this.scaleX = Math.sin(tween.getValue());
                this.scaleY = Math.cos(tween.getValue());
                this.rotation = tween.getValue();
            }
        })

        switch (flowerType) {
            case 0:
                this.scene.tweens.add({
                    targets: this,
                    x: "+=250",
                    y: 730,
                    duration: 5000,
                    repeat: -1
                })
                break;

            case 1:
                this.scene.tweens.add({
                    targets: this,
                    x: "-=250",
                    y: 730,
                    duration: 4000,
                    delat: 2000,
                    repeat: -1
                })
                break;

            case 2:
                this.scene.tweens.add({
                    targets: this,
                    x: "-=400",
                    y: 730,
                    duration: 3000,
                    delay: 3000,
                    repeat: -1
                })
                break;

            case 3:
                this.scene.tweens.add({
                    targets: this,
                    x: "-=400",
                    y: 730,
                    duration: 3500,
                    delay: 1000,
                    repeat: -1
                })
                break;

            case 4:
                this.scene.tweens.add({
                    targets: this,
                    x: "+=250",
                    y: 730,
                    duration: 3500,
                    delay: 2000,
                    repeat: -1
                })
                break;

            case 5:
                this.scene.tweens.add({
                    targets: this,
                    x: "+=250",
                    y: 730,
                    duration: 4000,
                    repeat: -1
                })
                break;

            case 6:
                this.scene.tweens.add({
                    targets: this,
                    x: "+=250",
                    y: 730,
                    duration: 6000,
                    delay: 3000,
                    repeat: -1
                })
                break;

            case 7:
                this.scene.tweens.add({
                    targets: this,
                    x: "-=350",
                    y: 730,
                    duration: 4000,
                    delay: 1000,
                    repeat: -1
                })
                break;

            case 8:
                this.scene.tweens.add({
                    targets: this,
                    x: "-=400",
                    y: 730,
                    duration: 4000,
                    delay: 3000,
                    repeat: -1
                })
                break;

            case 9:
                this.scene.tweens.add({
                    targets: this,
                    x: "-=400",
                    y: 730,
                    duration: 4000,
                    delay : 1500,
                    repeat: -1
                })
                break;

            case 10:
                this.scene.tweens.add({
                    targets: this,
                    x: "+=250",
                    y: 730,
                    duration: 4000,
                    delay: 2500,
                    repeat: -1
                })
                break;


            case 11:
                this.scene.tweens.add({
                    targets: this,
                    x: "+=250",
                    y: 730,
                    duration: 4000,
                    delay :1500,
                    repeat: -1
                })
                break;
        }

        this.setDepth(6);
        this.scene.add.existing(this);                              // 오브젝트 생성.
    }

    static preload(scene) {
        scene.load.image("flower1", "./images/Common/img_paper_01.png");
        scene.load.image("flower2", "./images/Common/img_paper_02.png");
        scene.load.image("flower3", "./images/Common/img_paper_03.png");
        scene.load.image("flower4", "./images/Common/img_paper_04.png");
        scene.load.image("flower5", "./images/Common/img_paper_05.png");
        scene.load.image("flower6", "./images/Common/img_paper_06.png");
        scene.load.image("flower7", "./images/Common/img_paper_07.png");
        scene.load.image("flower8", "./images/Common/img_paper_08.png");
    }
}