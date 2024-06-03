import Heart from "../Objects/Common/Heart.js";
import ScoreBoard from "../Objects/Common/ScoreBoard.js";
import RewardBoard from "../Objects/Common/RewardBoard.js";
import SoundButton from "../Objects/Common/SoundButton.js";
import LeftButton from "../Objects/Common/LeftButton.js";
import RightButton from "../Objects/Common/RightButton.js";
import OuterExitButton from "../Objects/Common/OuterExitButton.js";
import Player from "../Objects/Winter/WinterPlayer.js";
import Snow from "../Objects/Winter/Snow.js";

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

export default class WinterScene extends Phaser.Scene {
    constructor(data) {
        super(fontConfig);

        this.quizData = data.quizData;
        this.quizSoundArr;

        this.incorrectBefore = "";
        this.correctBefore = "";
        this.incorrectCount = 0;

        this.correctText;
        this.correctCount;
        this.maxQuizCount;

        this.deathCount;

        this.dodo;

        this.platforms;

        this.scoreText;
        this.score;
        this.isPass;
        this.heartArr;

        this.snowManager;
        this.snows;
        this.imgArr;

        this.workingSound;
        this.correctSound;
        this.incorrectSound;
        this.bgm;
    }

    init() {
        // 정보 초기화
        this.quizSoundArr = [];
        this.correctText = "";
        this.correctCount = 0;
        this.maxQuizCount = 0;

        this.deathCount = 0;

        this.dodo = null;

        this.platforms = null;

        this.scoreText = "";
        this.score = 0;
        this.isPass = false;
        this.heartArr = [];

        this.snowManager = null;
        this.imgArr = [];

        this.workingSound = "";
        this.correctSound = "";
        this.incorrectSound = "";
        this.bgm = "";
    }

    // 이미지 로드
    preload() {
        this.plugins.get('rexwebfontloaderplugin').addToScene(this);

        this.load.rexWebFont({
            custom: {
                families: ['Sandoll Gyeokdonggulim'],
                urls: ['../../include/css/font.css']
            }
        })

        this.quizData.map(data => {
            this.load.image(data.Question, data.Image1);
            this.imgArr.push(data.Question);
        })

        // 배경
        this.load.image("bg", "./images/Winter/bg_winter.jpg");
        this.load.image("bottom", "./images/Winter/img_bottom.jpg"); // 바닥

        // 오디오
        this.load.audio("walkingSound", walking);
        this.load.audio("correctSound", correct_star);
        this.load.audio("incorrectSound", incorrect_star);
        this.load.audio("bgm", sndBgmA1C);

        this.quizData.map(data => {
            this.load.audio(data.QuizNo, data.Sound1);
        });

        // 하트
        Heart.preload(this);

        // 스코어 보드
        ScoreBoard.preload(this);

        // 결과창
        RewardBoard.preload(this);

        // 캐릭터
        Player.preload(this);

        // 눈
        Snow.preload(this);

        // 사운드 버튼
        SoundButton.preload(this);

        // 왼쪽 버튼
        LeftButton.preload(this);

        // 오른쪽 버튼
        RightButton.preload(this);

        // 나가기 버튼
        OuterExitButton.preload(this);
    }

    // 생성
    create() {
        this.quizData.map(data => {
            this.load.image(data.Question, data.Image1);
        })

        // 문제 초기 세팅
        this.maxQuizCount = this.quizData.length;
        this.correctText = this.quizData[this.correctCount].Question;

        // 배경 이미지
        this.add.image(0, 0, "bg").setOrigin(0);

        this.physics.world.gravity.y = 50;
        this.platforms = this.physics.add.staticGroup();
        this.snows = this.add.group({
            classType: Phaser.GameObjects.Container,
            maxSize: -1,
        })

        // 바닥 생성
        this.platforms.create(640, 700, 'bottom').refreshBody();

        // 효과음, 배경음 생성
        this.walkingSound = this.sound.add('walkingSound');
        this.walkingSound.loop = true;
        this.correctSound = this.sound.add('correctSound');
        this.incorrectSound = this.sound.add('incorrectSound');
        this.bgm = this.sound.add('bgm');

        for (let i = 0; i < this.quizData.length; i++) {
            this.quizSoundArr[i] = this.sound.add(this.quizData[i].QuizNo);
        }

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

        // 도도 생성
        this.dodo = new Player({
            scene: this,
            x: 1000,
            y: 584,
            image: "dodo"
        });

        // 눈 생성
        this.snowManager = this.time.addEvent({
            delay: 1500,
            callback: this.createSnow,
            callbackScope: this,
            loop: true,
            paused: false
        })

        // 음원 재생 버튼
        this.soundButton = new SoundButton({
            scene: this,
            x: 70,
            y: 50,
            image: "soundImg",
            questionSound: this.quizSoundArr[this.correctCount]
        });

        // 음원 재생
        this.quizSoundArr[this.correctCount].play();
        this.bgm.play(bgmConfig);

        // 왼쪽 이동 버튼
        this.leftButton = new LeftButton({
            scene: this,
            x: 100,
            y: 625,
            image: "leftButtonImg"
        });
        //this.leftButton.scale = 1.6;

        // 오른쪽 이동 버튼
        this.rightButton = new RightButton({
            scene: this,
            x: 1180,
            y: 625,
            image: "rightButtonImg"
        });
        //this.rightButton.scale = 1.6;

        // EXIT 버튼
        this.outerExitButton = new OuterExitButton({
            scene: this,
            x: 1210,
            y: 50,
            image: "exitButton",
        });
    }

    update() {

    }

    setQuestionImage() {
        let randomNum = Phaser.Math.Between(0, this.imgArr.length - 1);

        while (true) {
            randomNum = Phaser.Math.Between(0, this.imgArr.length - 1);

            if (this.imgArr[randomNum] == this.correctText || this.incorrectBefore == this.imgArr[randomNum]) {
                randomNum = Phaser.Math.Between(0, this.imgArr.length - 1);
            }
            else {
                break;
            }
        }
        this.incorrectBefore = this.imgArr[randomNum];

        return this.imgArr[randomNum];
    }

    createSnow() {
        let img;
        let randomNum = Phaser.Math.Between(1, 3);

        while (this.correctBefore == randomNum) {
            randomNum = Phaser.Math.Between(2, 3);
        }

        this.correctBefore = randomNum;

        if (randomNum == 1 || this.incorrectCount >= 4 && this.correctBefore != 1) {
            img = this.correctText;
            this.incorrectCount = 0;
        }
        else {
            img = this.setQuestionImage();
            this.incorrectCount++;
        }

        let snow = new Snow({
            scene: this,
            img: img
        }).setRandomPosition(140, 0, 1000, 30).setDepth(1);

        this.snows.add(snow);

        // 충돌했을 시 발생하는 이벤트
        this.physics.add.overlap(snow, this.platforms, this.removeSnow, null, this);     // 눈 - 바닥
        this.physics.add.overlap(this.dodo, snow, this.collectSnow, null, this);         // 눈 - 도도
    }

    // 눈 제거
    removeSnow(snow, platforms) {
        snow.destroy();
    }

    // 도도 + 눈
    collectSnow(dodo, snow) {
        const reciveText = snow.innerImg.texture.key;

        //정답
        if (reciveText.toLowerCase() == this.correctText.toLowerCase()) {
            this.score++;
            this.scoreText.changeScore(this.score);

            this.correctSound.play();

            snow.destroy();

            if (this.score == this.maxQuizCount) {
                this.snowManager.destroy();

                this.dodo.fireKeyEvent();

                this.isPass = "success";
                this.setReward();
            }
            else {
                this.correctCount++;
                this.correctText = this.quizData[this.correctCount].Question;

                setTimeout(() => { this.quizSoundArr[this.correctCount].play() }, 1000);
                this.soundButton.questionSound = this.quizSoundArr[this.correctCount];
            }
        }
        //오답
        else {
            snow.destroy();

            this.incorrectSound.play();
            setTimeout(() => { this.quizSoundArr[this.correctCount].play() }, 1000);

            if (this.deathCount < 4) {
                this.heartArr[this.deathCount].disableHeart();
                this.deathCount++;
            }
            else {
                this.dodo.fireKeyEvent();

                this.heartArr[this.deathCount].disableHeart();

                this.snowManager.destroy();

                // 결과창
                this.isPass = "fail";
                this.setReward();
            }
        }
    }

    // 결과창
    setReward() {
        // 남은 눈 제거
        this.snows.clear(this, true);

        // 이동버튼 상호작용 해제
        this.leftButton.disableInteractive();
        this.rightButton.disableInteractive();

        let order = "";

        // 통과 / 실패에 따른 분기
        if (this.isPass == "success") {
            // 유저 타입에 따른 분기
            if (userMode == "STUDENT") {
                // 학생
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