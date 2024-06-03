import GinoCar from "./GinoCar.js";
import RoroCar from "./RoroCar.js";
import BaroCar from "./BaroCar.js";
import SelectButton from "./SelectButton.js";

export default class SelectSpeed extends Phaser.GameObjects.Container {
    constructor(data) {
        let { scene, x, y } = data;

        // 배경
        let bg = new Phaser.GameObjects.Sprite(scene, 0, 0, `bgIntro`);

         // 인트로 자동차
        let ginoCar = new GinoCar({
            scene: scene,
            x: 315,
            y: 325
        });

        let roroCar = new RoroCar({
            scene: scene,
            x: 640,
            y: 325
        });

        let baroCar = new BaroCar({
            scene: scene,
            x: 965,
            y: 325
        });

        // select 버튼
        let selectBtn = new SelectButton({
            scene: scene,
            x: 640,
            y: 625
        })

        super(scene, x, y, [bg, ginoCar, roroCar, baroCar, selectBtn]);

        this.bg = bg;
        this.setSize(this.bg.width, this.bg.height);                // 배경 사이즈로
        this.bg.setOrigin(0);

        this.ginoCar = ginoCar;
        this.roroCar = roroCar;
        this.baroCar = baroCar;

        this.ginoCar.on("pointerdown", () => {
            this.removeClickState();
            this.ginoCar.isClick = true;
            this.ginoCar.changeState("selected");
            this.ginoCar.text.setColor("#fff");
            this.scene.carSpeed = 3;
            this.scene.character = "gino";
            this.scene.characterFrames = 7;
            this.scene.mouseoverSound.play();
        });

        this.roroCar.on("pointerdown", () => {
            this.removeClickState();
            this.roroCar.isClick = true;
            this.roroCar.changeState("selected");
            this.roroCar.text.setColor("#fff");
            this.scene.carSpeed = 5;
            this.scene.character = "roro";
            this.scene.characterFrames = 4;
            this.scene.mouseoverSound.play();
        });

        this.baroCar.on("pointerdown", () => {
            this.removeClickState();
            this.baroCar.isClick = true;
            this.baroCar.changeState("selected");
            this.baroCar.text.setColor("#fff");
            this.scene.carSpeed = 7;
            this.scene.character = "baro";
            this.scene.characterFrames = 8;
            this.scene.mouseoverSound.play();
        });

        this.scene.add.existing(this).setDepth(5);;
    }

    static preload(scene) {
        scene.load.image("bgIntro", "./images/Common/bg_intro.png");

        GinoCar.preload(scene);
        RoroCar.preload(scene);
        BaroCar.preload(scene);
        SelectButton.preload(scene);
    }

    removeClickState() {
        this.ginoCar.changeClickState(false);
        this.roroCar.changeClickState(false);
        this.baroCar.changeClickState(false);

        this.ginoCar.changeState("default");
        this.roroCar.changeState("default");
        this.baroCar.changeState("default");

        this.ginoCar.text.setColor("#b96612");
        this.roroCar.text.setColor("#b96612");
        this.baroCar.text.setColor("#b96612");
    }

    fireCarKeyEvent() {
        this.ginoCar.off("pointerdown");
        this.roroCar.off("pointerdown");
        this.baroCar.off("pointerdown");
    }
}