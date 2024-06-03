import Heart from "../Objects/Common/Heart.js";
import ScoreBoard from "../Objects/Common/ScoreBoard.js";
import RewardBoard from "../Objects/Common/RewardBoard.js";
import SoundButton from "../Objects/Common/SoundButton.js";
import OuterExitButton from "../Objects/Common/OuterExitButton.js";

import Moon from "../Objects/Ghost/Moon.js"
import Ghost from "../Objects/Ghost/Ghost.js";
import Cannon from "../Objects/Ghost/Cannon.js";
import BulletGroup from "../Objects/Ghost/BulletGroup.js";

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

export default class GhostScene extends Phaser.Scene {
    constructor(data) {
        super(fontConfig)

        this.quizData = data.quizData;
        this.exampleData = data.exampleData;
        this.quizSoundArr;

        this.isClick = false;

        this.alphabetArr;
        this.beforeText = "";
        this.correctText = "";
        this.correctCount = 0;
        this.incorrectCount = 0;
        this.maxQuizCount = 0;

        this.scoreText;
        this.score;
        this.isPass;
        this.heartArr;

        this.deathCount = 0;

        this.moon;
        this.ghostManager;
        this.ghostes;

        this.cannon;
        this.line;
        this.angle;
        this.bulletGroup;

        this.pathFollower;

        this.shootingSound;
        this.correctSound;
        this.incorrectSound;
        this.bgm;
    }

    init() {
        // 정보 초기화
        this.isClick = false;

        this.alphabetArr = [];
        this.quizSoundArr = [];
        this.beforeText = "";
        this.correctText = "";
        this.correctCount = 0;
        this.incorrectCount = 0;
        this.maxQuizCount = 0;

        this.deathCount = 0;

        this.scoreText = "";
        this.score = 0;
        this.isPass = false;
        this.heartArr = [];

        this.moon = null;
        this.ghostManager = null;

        this.line = null;

        this.shootingSound = "";
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

        this.quizData.map(data => {
            this.load.image(data.Question, `https://wcfresource.a1edu.com/newsystem/image/dodoabc/phonics1/words/${data.Question}.png`);
        })

        this.exampleData.map(data => {
            this.alphabetArr.push(data.Example);
        })

        // 플러그인
        const commonUrl = "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/";
        const followerUrl = `${commonUrl}rexpathfollowerplugin.min.js`;
        const shakeUrl = `${commonUrl}rexshakepositionplugin.min.js`;

        this.load.plugin('rexpathfollowerplugin', followerUrl, true);
        this.load.plugin('rexshakepositionplugin', shakeUrl, true);

        // 배경
        this.load.image("bg", "./images/Ghost/bg_ghost.png");

        // 오디오
        this.load.audio("shootingSound", shooting);
        this.load.audio("correctSound", correct_ghost);
        this.load.audio("incorrectSound", incorrect_ghost);
        this.load.audio("bgm", sndBgmA1E);

        this.quizData.map(data => {
            this.load.audio(data.QuizNo, data.Sound1);
        });

        // 하트
        Heart.preload(this);

        // 스코어 보드
        ScoreBoard.preload(this);

        // 결과창
        RewardBoard.preload(this);

        // 달?
        Moon.preload(this);

        // 유령
        Ghost.preload(this);

        // 대포
        Cannon.preload(this);

        // 대포알
        BulletGroup.preload(this)

        // 사운드 버튼
        SoundButton.preload(this);

        // 나가기 버튼
        OuterExitButton.preload(this);
    }

    create() {
        this.maxQuizCount = this.quizData.length;
        this.questionSound = this.quizData[this.correctCount].Sound1;////

        // 배경 이미지
        this.add.image(0, 0, "bg").setOrigin(0);

        // 달?
        this.moon = new Moon({
            scene: this,
            x: 234,
            y: 541,
            img: this.quizData[0].Question
        });

        // 효과음, 배경음 생성
        this.shootingSound = this.sound.add('shootingSound');
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

        // 유령 경로 [
        // [] 내부의 주석 위 3줄, 아래 1줄 디버깅 용이므로 지우지 말것.
        //let graphics = this.add.graphics();
        //graphics.lineStyle(2, 0xffffff, 0.5);
        //graphics.fillStyle(0x00ff00, 0.5);

        this.path = new Phaser.Curves.Path(1280, 148)
            .lineTo(1220, 138)
            .lineTo(1040, 163)
            .lineTo(975, 203)
            .lineTo(750, 233)
            .lineTo(630, 198)
            .lineTo(430, 223)
            .lineTo(10, 148)
            .lineTo(0, 151)
            .lineTo(-125, 151);

        //this.path.draw(graphics, 128);
        // ] 유령 경로 end

        // 대포
        this.cannon = new Cannon({
            scene: this,
            x: 640,
            y: 700,
            img: "cannon"
        }).setDepth(3);

        // 총알
        this.bulletGroup = new BulletGroup(this);

        // 마우스 클릭시 대포 회전
        this.angle = 0;
        let graphics = this.add.graphics().setDefaultStyles({
            fillStyle: {
                color: 0xa0a0a0
            }
        });

        this.line = new Phaser.Geom.Line();

        this.input.on("pointerdown", pointer => {
            ////this.isClick = true;

            this.drawLine(pointer, graphics, this.line, this.angle)
        }, this)

        this.input.on("pointermove", pointer => {
            if (this.isClick && pointer.isDown) {
                this.drawLine(pointer, graphics, this.line, this.angle)
            }
            else {
                return false;
            }
        }, this)

        this.input.on("pointerup", pointer => {
            if (!this.isClick) {
                return false;
            }

            this.shootingSound.play();

            graphics.clear();
            this.bulletGroup.fireBullet(this.angle, this.cannon.x, this.cannon.y)
        }, this)
        // ] 총알 end

        // 유령 생성 [
        this.correctText = this.quizData[0].Question;

        this.ghostes = this.add.group({
            classType: Ghost,
            maxSize: -1,
        })

        this.ghostManager = this.time.addEvent({
            delay: 2000,
            callback: this.createGhost,
            callbackScope: this,
            loop: true,
            paused: false
        })
        // ] 유령 생성 end

        // 음원 재생 버튼
        this.soundButton = new SoundButton({
            scene: this,
            x: 70,
            y: 50,
            image: "soundImg",
            questionSound: this.quizSoundArr[this.correctCount]
        });

        // 사운드버튼 마우스오버시 대포 발사 비활성, 아웃시 활성
        this.soundButton.on("pointerover", () => { this.isClick = false; });
        this.soundButton.on("pointerout", () => { this.isClick = true; });

        // 음원 재생
        this.quizSoundArr[this.correctCount].play();
        this.bgm.play(bgmConfig);

        // 대포 발사기능 활성, 처음부터 활성상태로 두면 try again 클릭시 발사됨.
        setTimeout(() => { this.isClick = true; }, 1000);

        // EXIT 버튼
        this.outerExitButton = new OuterExitButton({
            scene: this,
            x: 1210,
            y: 50,
            image: "exitButton",
        }).setDepth(3);

    }

    setQuestion() {
        // 1. 같은 숫자가 중복으로 나오는 경우 -> 다시 생성
        // 2. 오답이 3번 넘게 나온 경우 -> 정답을 내보내줌
        let randomNum = Phaser.Math.Between(0, this.alphabetArr.length - 1);

        while (true) {
            if (this.alphabetArr[randomNum] == this.beforeText) {
                randomNum = Phaser.Math.Between(0, this.alphabetArr.length - 1);
            }
            else {
                break;
            }
        }

        if (this.correctText == this.alphabetArr[randomNum]) {
            this.incorrectCount = 0;
        }
        else {
            this.incorrectCount++;
        }

        if (this.incorrectCount > 3) {
            this.alphabetArr.map((el, index) => {
                if (el == this.correctText) {
                    randomNum = index;
                }
            })

            this.incorrectCount = 0;
        }

        this.beforeText = this.alphabetArr[randomNum];

        return this.alphabetArr[randomNum];
    }

    createGhost() {
        let randomNum = Phaser.Math.Between(1, 4);
        const alphabet = this.setQuestion();

        let ghost = new Ghost({
            scene: this,
            x: 1280,
            y: 148,
            string: alphabet
        });

        this.ghostes.add(ghost);

        // 총알 - 유령 충돌 이벤트
        this.physics.add.overlap(this.bulletGroup, ghost, this.hitGhost, null, this)
    }

    drawLine(pointer, graphics, line) {
        graphics.clear();

        this.angle = Phaser.Math.Angle.BetweenPoints(this.cannon, pointer);

        this.cannon.rotation = this.angle;
        Phaser.Geom.Line.SetToAngle(line, this.cannon.x, this.cannon.y, this.angle, 1000);

        let points = Phaser.Geom.Line.BresenhamPoints(line, 20);

        for (let i = 0; i < points.length; i++) {
            let p = points[i];

            graphics.fillCircle(p.x - 2, p.y - 2, 4);
        }

        graphics.strokeLineShape(line).setDepth(3);
    }

    hitGhost(ghost, bullet) {
        bullet.body.enable = false;
        this.bulletGroup.killAndHide(bullet);

        const selectedText = ghost.question.text;

        //정답
        if (this.correctText == selectedText) {
            this.moon.changeFrame("correct");
            ghost.killGhost();
            this.scoreText.changeScore(++this.correctCount);

            this.correctSound.play();

            if (this.correctCount == this.maxQuizCount) {
                // 끝
                // 결과창
                this.isClick = false;
                this.isPass = "success";
                this.setReward();
            }
            else {
                this.correctText = this.quizData[this.correctCount].Question;
                this.moon.changeImage(this.quizData[this.correctCount].Question);

                setTimeout(() => { this.quizSoundArr[this.correctCount].play() }, 1000);
                this.soundButton.questionSound = this.quizSoundArr[this.correctCount];
            }
        }
        //오답
        else {
            ghost.removeTween();

            this.pauseManager();

            this.incorrectSound.play();
            setTimeout(() => { this.quizSoundArr[this.correctCount].play() }, 1000);

            if (this.deathCount < 4) {
                this.heartArr[this.deathCount].disableHeart()

                this.deathCount++;

                this.moon.changeFrame("incorrect");
                ghost.shakeGhost();
            }
            else {
                // 결과창
                this.isClick = false;
                this.isPass = "fail";
                this.setReward()
            }
        }
    }

    // 유령 생성 일시중지
    pauseManager() {
        this.ghostManager.paused = true;
    }

    // 유령 생성을 멈췄다가 다시 시작
    restartManager() {
        this.ghostManager.paused = false;
    }

    // 유령 생성 제거
    destroyManager() {
        this.ghostManager.destroy();
    }

    // 모든 유령 제거
    destroyAllGhostes() {
        this.destroyManager();

        this.ghostes.children.each(ghost => {
            ghost.removeTween();
        })

        this.ghostes.clear(this, true);
    }

    // 결과창
    setReward() {
        // 모든 유령 제거
        this.destroyAllGhostes();

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