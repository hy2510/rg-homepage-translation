import ExitButton from "./ExitButton.js";
import ContinueButton from "./ContinueButton.js";
import TryAgainButton from "./TryAgainButton.js";
import EdmondSuccess from "./EdmondSuccess.js";
import EdmondFail from "./EdmondFail.js";

export default class RewardBoard extends Phaser.GameObjects.Container {
    constructor(data) {
        let { scene, passState, point, endObj } = data;

        // 공통
        const bg = new Phaser.GameObjects.Sprite(scene, 0, 0, "bgReward").setOrigin(0);
        const popup = new Phaser.GameObjects.Sprite(scene, 425, 0, `reward${passState}`).setOrigin(0);
        const levelText = new Phaser.GameObjects.Text(scene, 640, 208, `Level ${scene.level}`, {
            fontFamily: "Sandoll Gyeokdonggulim",
            fontSize: "15px",
            fontStyle: "bold",
            color: "#000",
            align: "center",
        });
        
        // 정답
        if (passState == "Success") {
            const edmond = new EdmondSuccess({
                scene: scene,
                x: 560,
                y: 270,
            }).setOrigin(0);
            const pointBg = new Phaser.GameObjects.Sprite(scene, 500, 300, "point");
            const pointText = new Phaser.GameObjects.Text(scene, 440, 285, `+ ${point} point`, {
                fontFamily: "Sandoll Gyeokdonggulim",
                fontSize: "25px",
                fontStyle: "bold",
                color: "red",
                align: "center",
            });
            
            if (scene.level < 15) {
                const exitButton = new ExitButton({
                    scene: scene,
                    x: 465,
                    y: 535,
                    endObj
                });
                const continueButton = new ContinueButton({
                    scene: scene,
                    x: 685,
                    y: 535
                });

                super(scene, 0, 0, [bg, popup, pointBg, pointText, edmond, levelText, exitButton, continueButton]);
            }
            else {
                const exitButton = new ExitButton({
                    scene: scene,
                    x: 570,
                    y: 535,
                    endObj
                });

                super(scene, 0, 0, [bg, popup, pointBg, pointText, edmond, levelText, exitButton]);
            }

            this.scene = scene;
            this.edmond = edmond;

            this.edmond.play(`edmond${passState}`);
        }
        // 오답
        else if (passState == "Fail") {
            const edmond = new EdmondFail({
                scene: scene,
                x: 560,
                y: 270
            }).setOrigin(0);
            const lightning1 = new Phaser.GameObjects.Sprite(scene, 515, 253, "lightning1").setOrigin(0);
            const lightning2 = new Phaser.GameObjects.Sprite(scene, 515, 253, "lightning2").setOrigin(0);
            const rain = new Phaser.GameObjects.Sprite(scene, 510, 255, "rain").setOrigin(0);
            const exitButton = new ExitButton({
                scene: scene,
                x: 465,
                y: 535,
                endObj
            });
            const tryAgainButton = new TryAgainButton({
                scene: scene,
                x: 685,
                y: 535
            })

            super(scene, 0, 0, [bg, popup, lightning1, lightning2, rain, edmond, levelText, exitButton, tryAgainButton]);

            this.scene = scene;
            this.edmond = edmond;
            this.lightning1 = lightning1;
            this.lightning2 = lightning2;
            this.rain = rain;

            this.scene.tweens.add({
                targets: this.lightning1,
                alpha: 0,
                duration: 900,
                repeat: -1
            });

            this.scene.tweens.add({
                targets: this.lightning2,
                alpha: 0,
                duration: 1000,
                repeat: -1
            });

            this.scene.tweens.add({
                targets: this.rain,
                alpha: 0,
                duration: 1500,
                repeat: -1
            });

            this.edmond.play(`edmond${passState}`);
        }

        this.setDepth(7);
        this.scene.add.existing(this);                              // 오브젝트 생성.
    }

    static preload(scene) {
        scene.load.image("bgReward", "./images/Common/bg_reward.png");

        ExitButton.preload(scene);
        ContinueButton.preload(scene);
        TryAgainButton.preload(scene);
        EdmondSuccess.preload(scene);
        EdmondFail.preload(scene);

        scene.load.image("btnTryAgain", "./images/Common/img_btn_try_again.png");

        scene.load.image("rewardFail", "./images/Common/img_wrapper_reward_fail.png");
        scene.load.image("rewardSuccess", "./images/Common/img_wrapper_reward_success.png");

        scene.load.image("rain", "./images/Common/img_rain.png");

        scene.load.image("point", "./images/Common/img_point.png");

        scene.load.image("lightning1", "./images/Common/img_lightning_01.png");
        scene.load.image("lightning2", "./images/Common/img_lightning_02.png");
    }
}