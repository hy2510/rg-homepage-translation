import CarBg from "./CarBg.js";
import CarBase from "./CarBase.js";

export default class BaroCar extends Phaser.GameObjects.Container {
    constructor(data) {
        let { scene, x, y } = data;

        let bg = new CarBg({
            scene: scene
        })

        let img = new CarBase({
            scene: scene,
            image: "baroCar",
            frameCnt: 6
        })

        let text = new Phaser.GameObjects.Text(scene, 0, 84, "BARO", {
            fontFamily: "Sandoll Gyeokdonggulim",
            fontSize: "20px",
            color: "#b96612"
        });

        text.setOrigin(0.5);

        super(scene, x, y, [bg, img, text]);
        this.isClick = false;
        this.bg = bg;
        this.img = img;
        this.text = text;

        this.setSize(this.bg.width, this.bg.height);                // 배경 사이즈로       

        this.setInteractive({
            cursor: 'url(../../include/images/cursor_hover.png), pointer'
        });

        this.on("pointerover", () => {
            this.changeState("selected");
            this.text.setColor("#fff");
        });

        this.on("pointerout", () => {
            if (!this.isClick) {
                this.changeState("default");
                this.text.setColor("#b96612");
            }
        });

        this.scene.add.existing(this);                              // 오브젝트 생성.
    }

    static preload(scene) {
        CarBg.preload(scene);
        CarBase.preload(scene);
    }

    changeState(state) {
        this.bg.changeState(state);
        this.img.changeState(state);
    }

    changeClickState(state) {
        this.isClick = state;
    }
}