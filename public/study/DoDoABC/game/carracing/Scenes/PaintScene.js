import Intro from "../Objects/Common/Intro.js";
import Heart from "../Objects/Common/Heart.js";
import ScoreBoard from "../Objects/Common/ScoreBoard.js";
import Track from "../Objects/Paint/Track.js";
import Player from "../Objects/Paint/Player.js";
import Paint from "../Objects/Paint/Paint.js";
import RewardBoard from "../Objects/Common/RewardBoard.js";
import OuterExitButton from "../Objects/Common/OuterExitButton.js";
import UpButton from "../Objects/Common/UpButton.js";
import DownButton from "../Objects/Common/DownButton.js";
import QuestionText from "../Objects/Paint/QuestionText.js";
import FlowerEffect from "../Objects/Common/FlowerEffect.js";

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

export default class PaintScene extends Phaser.Scene {
    constructor(data) {
        super(fontConfig);

        this.level = data.level;

        this.audStart;
        this.audFinish;

        this.quizData = data.quizData;
        this.exampleArr = data.exampleData;
        this.quizSoundArr;
        this.questionArr;
        this.question;

        this.maxQuizCount;
        this.scoreText;
        this.score;
        this.correctCount;
        this.incorrectCount;
        this.heartArr;

        this.deathCount;

        this.examples;
        this.prePaintIndex;

        this.intro;
        this.player;
        this.carSpeed;
        this.character;
        this.characterFrames;

        this.track;

        this.audEngine;
        this.correctSound;
        this.incorrectSound;
        this.mouseoverSound;
        this.selectSound;

        this.successedSound;
        this.failedSound;

        this.engineBaroSound;
        this.engineGinoSound;
        this.engineRoroSound;

        this.bgm;
    }

    init() {
        this.audStart = null;
        this.audFinish = null;
        this.audEnding = null;

        this.questionArr = [];
        this.question = null;
        this.quizSoundArr = [];

        this.maxQuizCount = 0;
        this.scoreText = "";
        this.score = 0;
        this.correctCount = 0;
        this.incorrectCount = 0;
        this.heartArr = [];
        this.deathCount = 0;

        this.prePaintIndex = null;

        this.intro = null;
        this.player = null;
        this.carSpeed = 5;
        this.character = "gino";
        this.characterFrames = 3;

        this.track = null;

        this.audEngine = "";
        this.correctSound = "";
        this.incorrectSound = "";
        this.move = "";
        this.bgm = "";
        this.starting = "";
        this.finish = "";
        this.ending = "";
        this.mouseover = "";
        this.select = "";

        this.successedSound = "";
        this.failedSound = "";

        this.engineBaroSound = "";
        this.engineGinoSound = "";
        this.engineRoroSound = "";
    }

    preload() {
        this.plugins.get('rexwebfontloaderplugin').addToScene(this);

        this.load.rexWebFont({
            custom: {
                families: ['Sandoll Gyeokdonggulim'],
                urls: ['../../include/css/font.css']
            },
            testString: "IN",
            testInterval: 20
        })

        this.quizData.map(data => {
            this.questionArr.push(data.Question);
            this.load.image(data.Question, data.Image1);
            this.load.audio(data.QuizNo, data.Sound1);
        })

        // 배경
        this.load.image("bg", "./images/Common/bg_car_racing.png");
        this.load.image("board", "./images/Common/img_board.png");
        this.load.image("bgHeart", "./images/Common/img_wrapper_heart.png");

        // 오디오
        this.load.audio("audStart", starting);
        this.load.audio("audFinish", finish);
        this.load.audio("audEnding", ending);
        this.load.audio("audEngine", engine);
        this.load.audio("correctSound", correct_car);
        this.load.audio("incorrectSound", incorrect_car);
        this.load.audio("moveSound", move);
        this.load.audio("startingSound", starting);
        this.load.audio("mouseoverSound", mouseover);
        this.load.audio("selectSound", select);
        this.load.audio("bgm", sndBgmA1I);
        this.load.audio("bgmBaro", sndBgmBaro);
        this.load.audio("bgmRoro", sndBgmRoro);
        this.load.audio("bgmGino", sndBgmGino); 
        this.load.audio("bgmIntro", sndBgmIntro); 
        this.load.audio("successedSound", completed);
        this.load.audio("failedSound", failed); 
        this.load.audio("engineBaroSound", engineBaro);
        this.load.audio("engineRoroSound", engineRoro);
        this.load.audio("engineGinoSound", engineGino); 

        // 점수판
        ScoreBoard.preload(this);

        // 하트
        Heart.preload(this);

        // 트랙
        Track.preload(this);

        // 인트로 배경
        Intro.preload(this);

        // 우상단 나가기 버튼
        OuterExitButton.preload(this);

        // 위아래 버튼
        UpButton.preload(this);
        DownButton.preload(this);
        
        // 캐릭터
        Player.preload(this);

        // 그림
        Paint.preload(this);

        // 결과창
        RewardBoard.preload(this);

        // 꽃
        FlowerEffect.preload(this);
    }

    create() {
        // 효과음, 배경음 생성
        this.audStart = this.sound.add("audStart");
        this.audFinish = this.sound.add("audFinish");
        this.audEnding = this.sound.add("audEnding");
        this.audEngine = this.sound.add("audEngine");
        this.correctSound = this.sound.add('correctSound');
        this.incorrectSound = this.sound.add('incorrectSound');
        this.bgm = this.sound.add('bgm');
        this.move = this.sound.add("moveSound");
        this.mouseoverSound = this.sound.add("mouseoverSound")
        this.selectSound = this.sound.add("selectSound")
        this.successedSound = this.sound.add("successedSound");
        this.failedSound = this.sound.add("failedSound");

        playBGM(sndBgmIntro);

        this.startIntro();
    }

    update() {

    }

    startIntro() {
        this.intro = new Intro({
            scene: this,
            x: 0,
            y: 0
        })

        // 우상단 나가기 버튼
        new OuterExitButton({
            scene: this,
            x: 1175,
            y: 37
        })
    }

    startGame() {
        //console.log(this.quizData);
        // 문제 초기 세팅
        this.maxQuizCount = this.quizData.length;
        
        // for test [[[]]
        //this.maxQuizCount = 1;
        // ]]]

        this.correctText = this.quizData[this.correctCount].Question;

        // 효과음, 배경음 생성
        for (let i = 0; i < this.quizData.length; i++) {
            this.quizSoundArr[i] = this.sound.add(this.quizData[i].QuizNo);
        }

        this.quizSoundArr[0] = this.sound.add(this.quizData[0].QuizNo);

        // 배경 이미지
        this.bg = this.add.tileSprite(0, 0, 1280, 720, "bg").setOrigin(0).setScrollFactor(0).setDepth(1);
        this.add.image(30, 22, "board").setOrigin(0).setDepth(2);
        this.add.image(800, 79, "bgHeart").setDepth(2);

        this.question = new QuestionText({
            scene: this,
            x: 41,
            y: 50,
            text: this.correctText
        });

        // 하트
        for (let i = 0; i < 5; i++) {
            let heart = new Heart({
                scene: this,
                x: (675 + (63 * i)),
                y: 78
            });

            this.heartArr.push(heart)
        }

        // 스코어 보드
        this.scoreText = new ScoreBoard({
            scene: this,
            x: 1000,
            y: 37,
            maxCount: this.maxQuizCount
        });

        // 트랙        
        this.track = new Track({
            scene: this,
            x: 0,
            y: 151
        });

        // 캐릭터
        this.player = new Player({
            scene: this,
            character: this.character,
            frameCnt: this.characterFrames
        });

        // 위/ 아래 버튼
        // 위/ 아래 버튼
        this.upBtn = new UpButton({
            scene: this,
            x: 30,
            y: 405
        });
        this.downBtn = new DownButton({
            scene: this,
            x: 30,
            y: 530
        });

        // 인트로 씬 파괴
        this.intro.destroy();
        stopBGM();

        // 블럭
        this.examples = this.add.group({
            classType: Paint,
            maxSize: -1,
        });

        setTimeout(() => {
            this.player.moveStartPosition();
            this.audStart.play();
        }, 500);

        //console.log(this.character);

        if (this.character == "baro") {
            playBGM(sndBgmBaro);
        } else if (this.character == "roro") {
            playBGM(sndBgmRoro);
        }
        else {
            playBGM(sndBgmGino);
        }
    }

    createExample() {
        const question = this.setQuestion();
        const lineNum = this.setLineNum();

        let paint = new Paint({
            scene: this,
            line: lineNum,
            question: question
        })

        this.examples.add(paint);

        // 캐릭터 - 그림 충돌 이벤트
        this.physics.add.overlap(this.player, paint, this.hitPaint, null, this);
    }

    setQuestion() {
        // 1. 같은 숫자가 중복으로 나오는 경우 -> 다시 생성
        // 2. 오답이 3번 넘게 나온 경우 -> 정답을 내보내줌
        let randomNum = Phaser.Math.Between(0, this.questionArr.length - 1);

        while (true) {
            if (this.questionArr[randomNum] == this.beforeText) {
                randomNum = Phaser.Math.Between(0, this.questionArr.length - 1);
            }
            else {
                break;
            }
        }

        if (this.correctText == this.questionArr[randomNum]) {
            this.incorrectCount = 0;
        }
        else {
            this.incorrectCount++;
        }

        if (this.incorrectCount > 3) {
            this.questionArr.map((el, index) => {
                if (el == this.correctText) {
                    randomNum = index;
                }
            })

            this.incorrectCount = 0;
        }

        this.beforeText = this.questionArr[randomNum];

        return this.questionArr[randomNum];
    }

    hitPaint(player, paint) {
        paint.body.enable = false;
        const paintValue = paint.getTextValue();
        paint.destroyPaint();

        if (paintValue == this.correctText) {
            this.question.destroy();
            this.correctCount++;
            this.correctText = this.questionArr[this.correctCount];
            this.scoreText.changeScore(this.correctCount);

            this.question = new QuestionText({
                scene: this,
                x: 41,
                y: 50,
                text: this.correctText
            });

            this.correctSound.play();

            if (this.correctCount < this.maxQuizCount) {
                setTimeout(() => {
                    this.correctText = this.quizData[this.correctCount].Question;
                    this.quizSoundArr[this.correctCount].play();
                }, 500);
            }
            else {
                this.audEnding.play();
                setTimeout(() => {
                    this.track.appearFinishLine();
                    this.dropFlowers();
                }, 600);
            }
        }
        else {
            this.incorrectSound.play();

            setTimeout(() => {
                this.deathCount++;
                this.heartArr[5 - this.deathCount].removeHeart();

                if (this.deathCount > 4) {
                    this.popReward(false);
                }
                else {
                    this.quizSoundArr[this.correctCount].play();
                }
            }, 500);
        }
    }

    setLineNum() {
        let randomNumArr = [0, 1, 2];
        let resultNum;

        if (this.prePaintIndex == null) {
            const randomNum = Phaser.Math.Between(0, 2);
            resultNum = randomNumArr[randomNum];
        }
        else {
            randomNumArr = randomNumArr.filter(el => {
                if (el != this.prePaintIndex) {
                    return true;
                }
            });

            const randomNum = Phaser.Math.Between(0, 1);

            resultNum = randomNumArr[randomNum];
        }

        this.prePaintIndex = resultNum;

        return resultNum;
    }

    dropFlowers() {
        for (let i = 0; i < 12; i++) {
            new FlowerEffect({
                scene: this,
                flowerType: i
            });
        }

        setTimeout(() => {
            for (let i = 0; i < 12; i++) {
                new FlowerEffect({
                    scene: this,
                    flowerType: i
                });
            }
        }, 2000);
    }

    popReward(state) {
        stopBGM();

        if (state) {
            this.successedSound.play();

            if (userMode == "STUDENT") {
                const stepSaveEbDoDoAbcOnSucc = object => {
                    const endObj = object;
                    const point = endObj.rgpoint;

                    switch (point) {
                        case "1":

                            break;

                        case "0.5":

                            break;

                        case "0":

                            break;
                    }

                    this.rewardBoard = new RewardBoard({
                        scene: this,
                        passState: "Success",
                        point: point,
                        isPass: "success",
                        endObj
                    })
                }

                saveStatus(stepSaveEbDoDoAbcOnSucc);
            }
            else {
                this.rewardBoard = new RewardBoard({
                    scene: this,
                    passState: "Success",
                    point: 1
                })
            }
        }
        else {
            this.audEngine.stop();
            this.failedSound.play();

            this.player.fireKeyEvent();
            this.examples.clear(this, true);
            this.track.stopTrack();

            this.rewardBoard = new RewardBoard({
                scene: this,
                passState: "Fail",
                point: 0
            })
        }
    }
}