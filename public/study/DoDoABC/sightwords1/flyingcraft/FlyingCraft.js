let quizDataArr;
let exampleArr = [];                        // 보기
let correctCount = 0;
let maxCorrectCount = 0;
let isCorrect = false;
let moveStageCnt = 0;
let selectedIndex = -1;
let prePos = -1;
let crntPos = -2;

const sndCorrect = effectSightWords + "correct_gino.mp3";                        // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectSightWords + "incorrect_boing_gino.mp3";         // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
const sndCharacterRising = effectSightWords + "character_rising.mp3";       // (  ) (2500) 위이이잉~ 지노 우주선으로 올라가는 소리
const sndSpaceshipLaunching = effectSightWords + "spaceship_launching.mp3"; // (18) (4800) 우주선 날아가는 소리
let sndCrandMoving = [effectSightWords + "crane_moving0.mp3", effectSightWords + "crane_moving1.mp3", effectSightWords + "crane_moving2.mp3"];  // (22) (1000, 1300, 1500) 지이이잉~ 지노 이동 하는 소리 

$(document).ready(() => {
    lockScreen(true);
    step = 2;
    quizType = "A";
    currentActivity = "A2A";    // 제일 먼저 세팅해야함.

    
    focusCurrent(currentActivity);

    const imgArr = [
        "./images/bg_flying_craft.png",
        "./images/img_character_jino_correct.png",
        "./images/img_character_jino_incorrect.png",
        "./images/img_spacecraft_01.png",
        "./images/img_spacecraft_02.png",
        "./images/img_spacecraft_correct.png",
        "./images/img_spacecraft_up.png"
    ];

    doPreloadImages(imgArr, loadQuiz);

    // 음원 딜레이 방지
    $("#preload1").attr('src', sndCrandMoving[0]);
    $("#preload2").attr('src', sndCrandMoving[1]);
    $("#preload3").attr('src', sndCrandMoving[2]);

    // 유저가 staff or review 일 때 메뉴에서 현재 학습 강조.
    $("." + currentActivity).addClass("on");
});

const loadQuiz = () => {
    loadQuizData(step, quizType, setData);
}

const setData = data => {
    // 비지니스 로직
    // 1. 퀴즈 데이터 담기.
    quizDataArr = data;
    maxCorrectCount = quizDataArr.length;

    setupQuiz();
    playBGM(sndBgmA3A);
}

// 퀴즈 세팅 시작
const setupQuiz = () => {
    isClick = true;
    isWorking = true;
    lockScreen(isWorking);

    // 2. 퀴즈 데이터 세팅
    // 퀴즈 타입이 알파벳인지 아닌지 판별
    try {
        quizData = quizDataArr[correctCount];
        //console.log(quizData);

        checkGetDataSuccess();
        checkStudyType();

        isCorrect = false;

        setExample();
        setClickEvent();
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

// 예제 세팅
const setExample = () => {
    try {
        if (quizData.length < 1) {
            throw "No Example Data";
        }

        //console.log('setExample');

        moveStageCnt = 0;
        exampleArr = [];

        exampleArr.push(quizData.Example1);
        exampleArr.push(quizData.Example2);
        exampleArr.push(quizData.Example3);

        exampleArr = shuffle(exampleArr);

        // 보기
        let appendHtml = "";

        for (let i = 0; i < exampleArr.length; i++) {
            appendHtml += "<div class='js-wrapper-example wrapper-example'>"
            appendHtml += "<div class='js-example example'>";
            appendHtml += "<span>" + exampleArr[i] + "</span>";
            appendHtml += "</div>";
            appendHtml += "</div>";

            if (exampleArr[i] == quizData.CorrectText) {
                crntPos = i;
            }
        }

        if (prePos == crntPos) {
            setExample();
            return;
        } else {
            prePos = crntPos;
        }
        //exampleArr.map((data) => {
        //    appendHtml += "<div class='js-wrapper-example wrapper-example'>"
        //    appendHtml += "<div class='js-example example'>";
        //    appendHtml += "<span>" + data + "</span>";
        //    appendHtml += "</div>";
        //    appendHtml += "</div>";
        //});

        $(".js-wrapper-examples").append(appendHtml);

        setTimeout(() => {
            playQuestion();
        }, 1000);
    }
    catch (e) {
        alert("Set Example Error: " + e);
    }
}

// 클릭 이벤트
const setClickEvent = () => {
    $(".js-example").on("click", () => {
        if (isWorking || isClick) {
            return false;
        }
        else {
            isWorking = true;
            isClick = true;
            lockScreen(isWorking);

            $this = event.currentTarget;

            const index = $(".js-example").index($this);

            // 정답 체크
            const checkAnswer = () => {
                const answer = $(".js-example").eq(index).children().html();

                return (quizData.CorrectText == answer ? true : false);
            }

            isCorrect = checkAnswer();
            moveStage(index);
        }
    })
}

const moveStage = index => {
    selectedIndex = index;
    playEffect1(sndCrandMoving[index]);
    $(".js-wrapper-character").addClass("move" + (index + 1));
}

const afterMoveStage = () => {
    if (isCorrect) {
        if (moveStageCnt == 0) {
            playSound(sndCorrect, function () {
                playEffect1(sndCharacterRising)
                playEffect2(quizData.Sound1);
            });
            
            moveStageCnt = 1;
        }
        ////
        $(".js-character-jino").addClass("correct");
        $(".js-example span").eq(selectedIndex).addClass("correct");

        setTimeout(() => {
            getOnCraft();
           
        }, 4000);
    }
    else {
        incorrectAction();
    }
}

const getOnCraft = () => {
    // 지노를 우주선에 탑승시키는 이 함수가, 우주선이 떠나는 모션중에 실행되는것을 방지
    if ($(".js-wrapper-craft").hasClass("gone") == true) {
        return true;
    }

    $(".js-wrapper-examples").addClass("d-none");
    $(".js-craft").removeClass("d-none");

    if ($(".js-wrapper-character").hasClass("move1")) {
        $(".js-wrapper-craft").addClass("craft1");
    }
    else if ($(".js-wrapper-character").hasClass("move2")) {
        $(".js-wrapper-craft").addClass("craft2");
    }
    else if ($(".js-wrapper-character").hasClass("move3")) {
        $(".js-wrapper-craft").addClass("craft3");
    }

    $(".js-craft").removeClass("d-none");
    if (selectedIndex == 1) {
        $(".js-character-jino").addClass("up");
    }
    else {
        $(".js-character-jino").addClass("up2");
    }
}

const afterGetOnCraft = () => {
    playEffect1(sndSpaceshipLaunching);
    event.stopPropagation();

    $(".js-craft").addClass("d-none");
    $(".js-wrapper-craft").addClass("gone");
}

const afterGoneCraft = () => {
    $(".js-wrapper-example").remove();
    $(".js-wrapper-examples").removeClass("d-none");

    $(".js-craft").addClass("d-none");
    $(".js-wrapper-craft").removeClass("craft1 craft2 craft3 gone");

    setTimeout(() => {
        correctCount++;

        if (correctCount < maxCorrectCount) {
            $(".js-wrapper-character").removeClass("move1 move2 move3");
            $(".js-character-jino").removeClass("correct up up2");

            setupQuiz();
        }
        else {
            setTimeout(() => {
                popNext();
            }, 1000);
        }
    })
}

const incorrectAction = () => {
    $(".js-character-jino").addClass("incorrect");
    $(".wrapper-examples").effect("shake", { times: 4 }, 1000);
    playSound(sndIncorrectBoing,
        function () {
            playSound(quizData.Sound1,
                function () {
                    $(".js-character-jino").removeClass("incorrect");
                    $(".js-wrapper-character").removeClass("move1 move2 move3");
                    isClick = false;
                    isWorking = false;
                    lockScreen(isWorking);
                });
        });
}

const playQuestion = () => {
    playSound(quizData.Sound1, function () { isWorking = false; isClick = false; lockScreen(isWorking); });
}

const setInit = () => {
    prePos = -1;
    crntPos = -1;
    $(".js-wrapper-example").remove();
    $(".js-wrapper-examples").removeClass("d-none");
    $(".js-craft").addClass("d-none");
    $(".js-wrapper-craft").removeClass("craft1 craft2 craft3 gone");
    $(".js-wrapper-character").removeClass("move1 move2 move3");
    $(".js-character-jino").removeClass("correct up up2");
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];
    setInit();
    setupQuiz();
    playBGM(sndBgmA3A);
    hideNext();
}
