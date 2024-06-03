import PopDodo from "./PopDodo.js";
import ExitButton from "./ExitButton.js";
import ContinueButton from "./ContinueButton.js";
import TryAgainButton from "./TryAgainButton.js";

export default class RewardBoard extends Phaser.GameObjects.Container {
    constructor(data) {
        const { scene, isPass, order, endObj } = data;

        const animation = isPass + order;

        // 배경색
        const bg = new Phaser.GameObjects.Rectangle(scene, 640, 360, 1280, 720, 0x000000, 0.5);

        // 배경
        //const bgRewardBoard = new Phaser.GameObjects.Sprite(scene, 640, 360, "rewardBoard").setOrigin(0.5);
        let bgRewardBoard = ""

        // 레벨
        const levelImg = new Phaser.GameObjects.Sprite(scene, 640, 130, `${isPass}Num${level}`).setOrigin(0.49, 0.45);

        // 도도        
        const popDodo = new PopDodo({
            scene: scene,
            image: "popDodo",
            animation: animation,
        });

        // 버튼 [
        if (isPass == "success") {
            // 통과
            bgRewardBoard = new Phaser.GameObjects.Sprite(scene, 640, 360, "rewardBoardSucc").setOrigin(0.5);

            const text = new Phaser.GameObjects.Text(scene, 640, 205, "Level Complete", {
                fontFamily: "Sandoll Gyeokdonggulim",
                fontSize: "32px",
                fontStyle: "bold",
                color: "#fff",
                align: "left"
            }).setOrigin(0.5);

            if (level < 20) {
                if (userMode == "STUDENT") {
                    // 레벨이 15 이하
                    // 좌측 버튼
                    const leftBtn = new ExitButton({
                        scene: scene,
                        x: 560,
                        y: 580,
                        endObj
                    });

                    // 우측 버튼
                    const rightBtn = new ContinueButton({
                        scene: scene,
                        x: 720,
                        y: 580
                    })

                    super(scene, 0, 0, [bg, bgRewardBoard, levelImg, text, popDodo, leftBtn, rightBtn]);
                }
                else {
                    const leftBtn = new ExitButton({
                        scene: scene,
                        x: 640,
                        y: 580,
                        endObj
                    });

                    super(scene, 0, 0, [bg, bgRewardBoard, levelImg, text, popDodo, leftBtn]);
                }

                this.setSize(1280, 720);                                            // 배경 사이즈로
                scene.add.existing(this).setDepth(5);                               // 충돌선
            }
            else {
                // 레벨 15
                // 좌측 버튼
                const leftBtn = new ExitButton({
                    scene: scene,
                    x: 640,
                    y: 580,
                    endObj,
                });

                super(scene, 0, 0, [bg, bgRewardBoard, levelImg, text, popDodo, leftBtn]);

                this.setSize(1280, 720);                                            // 배경 사이즈로
                scene.add.existing(this).setDepth(5);
            }
        }
        else if (isPass == "fail") {
            // 실패
            bgRewardBoard = new Phaser.GameObjects.Sprite(scene, 640, 360, "rewardBoardFail").setOrigin(0.5);

            const text = new Phaser.GameObjects.Text(scene, 640, 205, "Level Failed", {
                fontFamily: "Sandoll Gyeokdonggulim",
                fontSize: "32px",
                fontStyle: "bold",
                color: "#fff",
                align: "left"
            }).setOrigin(0.5);

            // 좌측 버튼
            const leftBtn = new ExitButton({
                scene: scene,
                x: 560,
                y: 580
            });

            // 우측 버튼
            const rightBtn = new TryAgainButton({
                scene: scene,
                x: 720,
                y: 580
            })

            super(scene, 0, 0, [bg, bgRewardBoard, levelImg, text, popDodo, leftBtn, rightBtn]);

            this.setSize(1280, 720);                                            // 배경 사이즈로
            scene.add.existing(this).setDepth(5);                               // 충돌선
        }
        // ] 버튼 end
    }

    static preload(scene) {
        // 배경
        scene.load.image("rewardBoardSucc", "./images/Common/bg_reward_success.png");
        scene.load.image("rewardBoardFail", "./images/Common/bg_reward_fail.png");

        // 레벨 [
        scene.load.image("successNum1", "./images/Common/img_num_01_success.png");
        scene.load.image("successNum2", "./images/Common/img_num_02_success.png");
        scene.load.image("successNum3", "./images/Common/img_num_03_success.png");
        scene.load.image("successNum4", "./images/Common/img_num_04_success.png");
        scene.load.image("successNum5", "./images/Common/img_num_05_success.png");
        scene.load.image("successNum6", "./images/Common/img_num_06_success.png");
        scene.load.image("successNum7", "./images/Common/img_num_07_success.png");
        scene.load.image("successNum8", "./images/Common/img_num_08_success.png");
        scene.load.image("successNum9", "./images/Common/img_num_09_success.png");
        scene.load.image("successNum10", "./images/Common/img_num_10_success.png");
        scene.load.image("successNum11", "./images/Common/img_num_11_success.png");
        scene.load.image("successNum12", "./images/Common/img_num_12_success.png");
        scene.load.image("successNum13", "./images/Common/img_num_13_success.png");
        scene.load.image("successNum14", "./images/Common/img_num_14_success.png");
        scene.load.image("successNum15", "./images/Common/img_num_15_success.png");
        scene.load.image("successNum16", "./images/Common/img_num_16_success.png");
        scene.load.image("successNum17", "./images/Common/img_num_17_success.png");
        scene.load.image("successNum18", "./images/Common/img_num_18_success.png");
        scene.load.image("successNum19", "./images/Common/img_num_19_success.png");
        scene.load.image("successNum20", "./images/Common/img_num_20_success.png");

        scene.load.image("failNum1", "./images/Common/img_num_01_fail.png");
        scene.load.image("failNum2", "./images/Common/img_num_02_fail.png");
        scene.load.image("failNum3", "./images/Common/img_num_03_fail.png");
        scene.load.image("failNum4", "./images/Common/img_num_04_fail.png");
        scene.load.image("failNum5", "./images/Common/img_num_05_fail.png");
        scene.load.image("failNum6", "./images/Common/img_num_06_fail.png");
        scene.load.image("failNum7", "./images/Common/img_num_07_fail.png");
        scene.load.image("failNum8", "./images/Common/img_num_08_fail.png");
        scene.load.image("failNum9", "./images/Common/img_num_09_fail.png");
        scene.load.image("failNum10", "./images/Common/img_num_10_fail.png");
        scene.load.image("failNum11", "./images/Common/img_num_11_fail.png");
        scene.load.image("failNum12", "./images/Common/img_num_12_fail.png");
        scene.load.image("failNum13", "./images/Common/img_num_13_fail.png");
        scene.load.image("failNum14", "./images/Common/img_num_14_fail.png");
        scene.load.image("failNum15", "./images/Common/img_num_15_fail.png");
        scene.load.image("failNum16", "./images/Common/img_num_16_fail.png");
        scene.load.image("failNum17", "./images/Common/img_num_17_fail.png");
        scene.load.image("failNum18", "./images/Common/img_num_18_fail.png");
        scene.load.image("failNum19", "./images/Common/img_num_19_fail.png");
        scene.load.image("failNum20", "./images/Common/img_num_20_fail.png");
        // ] 레벨 end

        // 도도
        PopDodo.preload(scene);

        // 버튼
        ExitButton.preload(scene);
        ContinueButton.preload(scene);
        TryAgainButton.preload(scene);
    }
}