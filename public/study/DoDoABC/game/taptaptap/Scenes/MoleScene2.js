import Heart from "../Objects/Common/Heart.js";
import ScoreBoard from "../Objects/Common/ScoreBoard.js";
import RewardBoard from "../Objects/Common/RewardBoard.js";
import OuterExitButton from "../Objects/Common/OuterExitButton.js";

import Gino from "../Objects/Mole2/Gino.js";
import Mole from "../Objects/Mole2/Mole.js";

const fontConfig = {
    pack: {
        files: [{
            type: 'plugin',
            key: 'rexwebfontloaderplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexwebfontloaderplugin.min.js',
            start: true
        }]
    }
};

const MOLE_POSITION = [
    { x: 700, y: 250 },
    { x: 1050, y: 250 },
    { x: 700, y: 500 },
    { x: 1050, y: 500 },
]

export default class MoleScene extends Phaser.Scene {
    constructor(data) {
        super(fontConfig)

        this.quizData = data;

        this.isClick;

        this.scoreText;
        this.score;
        this.isPass;
        this.heartArr;
        this.deathCount;

        this.correctCount;
        this.correctText;

        this.exampleArr;
        this.audioArr;
        this.qusitionSound;

        this.questionArr;
        this.moles;
        this.moleManager;

        this.gino;

        this.molePopup;
        this.molePopdown;
        this.ginoPaper;
        this.correctSound;
        this.incorrectSound;
        this.bgm;
    }

    init() {
        this.input.setDefaultCursor('url(./images/Mole2/img_hammer.png), auto');

        this.isClick = false;

        this.scoreText = "";
        this.score = 0;
        this.isPass = "";
        this.heartArr = [];
        this.deathCount = 0;

        this.correctCount = 0;
        this.correctText = "";

        this.exampleArr = [];
        this.audioArr = [];
        this.qusitionSound = null;

        this.questionArr = [];
        this.moles = [];
        this.moleManager = null;

        this.gino = null;

        this.molePopup = "";
        this.molePopdown = "";
        this.ginoPaper = "";
        this.correctSound = "";
        this.incorrectSound = "";
        this.bgm = "";
    }

    preload() {
        this.plugins.get('rexwebfontloaderplugin').addToScene(this);

        this.load.rexWebFont({
            custom: {
                families: ['Sandoll Gyeokdonggulim'],
                urls: ['../../include/css/font.css']
            }
        })

        // 예제 데이터 넣어주기
        this.quizData.map(data => {
            this.exampleArr.push(data.Question);
            this.load.image(data.Question, data.Image1);
        })

        // 배경
        this.load.image("bg", "./images/Mole1/bg_taptaptap.png");

        // 오디오
        this.load.audio("molePopupSound", pop_up);
        this.load.audio("molePopdownSound", pop_down);
        this.load.audio("ginoPaper", paper);
        this.load.audio("correctSound", correct_mole2);
        this.load.audio("incorrectSound", incorrect_mole2);
        this.load.audio("bgm", sndBgmA1H);

        // 하트
        Heart.preload(this);

        // 스코어 보드
        ScoreBoard.preload(this);

        // 결과창
        RewardBoard.preload(this);

        // 지노
        Gino.preload(this);

        // 두더지
        Mole.preload(this);

        // 나가기 버튼
        OuterExitButton.preload(this);
    }

    create() {
        this.maxQuizCount = this.quizData.length;

        // 배경 이미지
        this.add.image(0, 0, "bg").setOrigin(0);

        // 효과음, 배경음 생성
        this.molePopup = this.sound.add("molePopupSound");
        this.molePopdown = this.sound.add("molePopdownSound");
        this.ginoPaper = this.sound.add("ginoPaper");
        this.correctSound = this.sound.add('correctSound');
        this.incorrectSound = this.sound.add('incorrectSound');
        this.bgm = this.sound.add('bgm');

        // 하트
        for (let i = 0; i < 5; i++) {
            let heart = new Heart({
                scene: this,
                x: (660 + (52 * i)),
                y: 51
            });

            this.heartArr.push(heart)
        }

        // 스코어 보드
        this.scoreText = new ScoreBoard({
            scene: this,
            x: 1035,
            y: 50,
            maxCount: this.maxQuizCount
        });

        this.gino = new Gino({
            scene: this,
            x: 250,
            y: 380,
            img: this.quizData[this.correctCount].Question
        });

        // 두더지 생성
        for (let i = 0; i < MOLE_POSITION.length; i++) {
            let mole = this.createMoles(MOLE_POSITION[i]);

            this.moles.push(mole);
        }

        this.correctText = this.quizData[this.correctCount].Question;

        this.moleManager = this.time.addEvent({
            delay: 3000,
            callback: this.checkAllMolesDown,
            callbackScope: this,
            loop: true
        });

        // EXIT 버튼
        this.outerExitButton = new OuterExitButton({
            scene: this,
            x: 1210,
            y: 50,
            image: "exitButton",
        });

        playBGM(sndBgmA1H);
    }

    // 두더지 생성
    createMoles(position) {
        let { x, y } = position;

        return new Mole({
            scene: this,
            x: x,
            y: y,
            text: ""
        })
    }

    // 예제
    createRandomQuestion() {
        let array = [];
        let n = Phaser.Math.Between(0, 3);

        for (let i = 0; i < 3; i++) {
            let randomNum = Phaser.Math.Between(0, this.exampleArr.length - 1);

            if (array.indexOf(this.exampleArr[randomNum]) == -1 && this.exampleArr[randomNum] != this.correctText) {
                array.push(this.exampleArr[randomNum]);
            }
            else {
                i--;
            }
        }

        array.splice(n, 0, this.correctText);

        return array;
    }

    moleUp() {
        this.questionArr = this.createRandomQuestion();

        const promises = this.questionArr.map((question, index) => {
            return new Promise(() => {
                this.moles[index].question = question;

                this.moles[index].texture.style._font = "42px Sandoll Gyeokdonggulim";
                if (this.questionArr[index].length >= 10) {
                    this.moles[index].texture.style._font = "36px Sandoll Gyeokdonggulim";
                } else if (this.questionArr[index].length >= 8) {
                    this.moles[index].texture.style._font = "40px Sandoll Gyeokdonggulim";
                }
                this.moles[index].changeState("up");
            })
        })

        Promise.all(promises);
    }

    playQuestionSound() {
        let imageName = this.gino.image.texture.key;

        this.correctText = this.quizData[this.correctCount].Question;
        this.questionSound = this.quizData[this.correctCount].Sound1;

        if (this.correctText != imageName) {
            this.gino.changeImage(this.correctText);
            this.ginoPaper.play();
        }

        playSound(this.questionSound, () => {
            this.moleUp();
        });
    }

    allMolesDefault() {
        const promises = this.moles.map(mole => {
            mole.changeState("default");
        });

        Promise.all(promises);
    }

    checkAllMolesDown() {
        let hideCnt = 0;

        this.moles.map(mole => {
            if (mole.isHide) {
                hideCnt++;
            }
            else {
                return false;
            }
        });

        if (hideCnt == 4) {
            this.playQuestionSound();
        }
        else {
            return false;
        }
    }

    // 결과창
    setReward() {
        this.input.setDefaultCursor('url(../../include/images/cursor.png), auto');

        this.time.removeEvent(this.moleManager);
        let order = "";
        // 통과 / 실패에 따른 분기
        if (this.isPass == "success") {
            // 유저 타입에 따른 분기
            if (userMode == "STUDENT") {
                const stepSaveEbDoDoAbcOnSucc = object => {
                    const endObj = object;
                    const point = endObj.rgpoint;

                    switch (point) {
                        case "1":
                            order = "First";
                            break
                        case "0.5":
                            order = "Second";
                            break;
                        case "0":
                            order = "Third";
                            break;
                    }
                    let rewardBoard = new RewardBoard({
                        scene: this,
                        isPass: this.isPass,
                        order: order,
                        endObj
                    });
                }

                saveStatus(stepSaveEbDoDoAbcOnSucc);
            }
            else {
                // 리뷰 / 선생님
                let rewardBoard = new RewardBoard({
                    scene: this,
                    isPass: this.isPass,
                    order: "First"
                });
            }
        }
        else {
            let rewardBoard = new RewardBoard({
                scene: this,
                isPass: this.isPass,
                order: order
            });
        }
    }
}