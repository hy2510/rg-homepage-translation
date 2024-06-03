import Heart from "../Objects/Common/Heart.js";
import ScoreBoard from "../Objects/Common/ScoreBoard.js";
import RewardBoard from "../Objects/Common/RewardBoard.js";
import OuterExitButton from "../Objects/Common/OuterExitButton.js";

import Mole from "../Objects/Mole1/Mole.js";

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
    { x: 350, y: 250 },
    { x: 700, y: 250 },
    { x: 1050, y: 250 },
    { x: 350, y: 500 },
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

        this.numArr;
        this.moles;
        this.moleManager;

        this.molePopup;
        this.molePopdown;
        this.correctSound;
        this.incorrectSound;
        this.bgm;
    }

    init() {
        this.input.setDefaultCursor('url(./images/Mole1/img_hammer.png), auto');

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

        this.numArr = [];
        this.moles = [];
        this.moleManager = null;

        this.molePopup = "";
        this.molePopdown = "";
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
        })

        // 배경
        this.load.image("bg", "./images/Mole1/bg_taptaptap.png");

        // 오디오
        this.load.audio("molePopupSound", pop_up);
        this.load.audio("molePopdownSound", pop_down);
        this.load.audio("correctSound", correct_mole);
        this.load.audio("incorrectSound", incorrect_mole);
        this.load.audio("bgm", sndBgmA1G);

        // 하트
        Heart.preload(this);

        // 스코어 보드
        ScoreBoard.preload(this);

        // 결과창
        RewardBoard.preload(this);

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
        this.correctSound = this.sound.add('correctSound');
        this.incorrectSound = this.sound.add('incorrectSound');
        this.bgm = this.sound.add('bgm');

        // bgm 오디오 설정
        let bgmConfig = {
            mute: false,
            volume: 0.2,
            rate: 1,
            detune: 0,
            seek: 0,
            loop: true,
            delay: 0
        }

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

        this.bgm.play(bgmConfig);
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

    // 랜덤한 숫자 3개
    createRandomNumbers() {
        let array = [];

        for (let i = 0; i < 3; i++) {
            let randomNum = Math.floor(Math.random() * 6);

            if (array.indexOf(randomNum) === -1 && this.moles[randomNum].isHide) {
                array.push(randomNum);
            }
            else {
                i--;
            }
        }

        return array;
    }

    // 예제
    createRandomQuestion() {
        let array = [];
        let correctNum = Phaser.Math.Between(0, 5);

        for (let i = 0; i < 2; i++) {
            let randomNum = Phaser.Math.Between(0, this.exampleArr.length - 1);

            if (array.indexOf(this.exampleArr[randomNum]) == -1 && this.exampleArr[randomNum] != this.correctText) {
                array.push(this.exampleArr[randomNum]);
            }
            else {
                i--;
            }
        }

        array.splice(correctNum, 0, this.correctText);

        return array;
    }

    moleUp() {
        this.numArr = this.createRandomNumbers();
        this.questionArr = this.createRandomQuestion();

        const promises = this.numArr.map((position, index) => {
            return new Promise(() => {
                this.moles[position].question = this.questionArr[index];

                this.moles[position].texture.style._font = "42px Sandoll Gyeokdonggulim";
                if (this.questionArr[index].length >= 10) {
                    this.moles[index].texture.style._font = "36px Sandoll Gyeokdonggulim";
                } else if (this.questionArr[index].length >= 8) {
                    this.moles[index].texture.style._font = "40px Sandoll Gyeokdonggulim";
                }
                this.moles[position].changeState("up");
            })
        })

        Promise.all(promises);
    }

    playQuestionSound() {
        this.correctText = this.quizData[this.correctCount].Question;
        this.questionSound = this.quizData[this.correctCount].Sound1;

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

        if (hideCnt == 6) {
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