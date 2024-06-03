let caseType = "small";                       // 대문자, 소문자 구별을 위한 변수

let characterIndex = 0;
let questionLetter = "";                    // 답
let exampleArr = [];                        // 보기

let sndCorrect = effectAlphabet + "correct.mp3";             // (07) (800 ~ 1000) 맞췄을 때 나는 소리
let sndIncorrectBoing = effectAlphabet + "incorrect_boing.mp3";         // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
let sndBoarding = effectAlphabet + "boarding.mp3"                       // (15) (1500) 우주선 문 여닫는 소리
let sndHammering = effectAlphabet + "hammering.mp3"                     // (16) (1500) 고치는 소리
let sndSpaceshipLaunching = effectAlphabet + "spaceshiplaunching.mp3"   // (18) (1500 2000) 우주선 날아가는 소리

$(document).ready(() => {
    lockScreen(true);
    step = 3;
    quizType = "A";
    currentActivity = "A3A";    // 제일 먼저 세팅해야함.
    focusCurrent(currentActivity);

    const imgArr = [
        "./images/img_baro_walking.png",
        "./images/img_character_millo.png",
        "./images/img_character_millo_01.png",
        "./images/img_chello_walking.png",
        "./images/img_millo_correct.png",
        "./images/img_millo_walking.png",
        "./images/img_space_ship_02.png",
        "./images/img_space_ship_03.png",
        "./images/img_space_ship_04.png",
        "./images/img_space_ship_05.png"
    ];

    doPreloadImages(imgArr, loadQuiz);

    // 음원 딜레이 방지
    $("#preload1").attr('src', sndBoarding);
    $("#preload2").attr('src', sndHammering);
    $("#preload3").attr('src', sndSpaceshipLaunching);

    // 유저가 staff or review 일 때 메뉴에서 현재 학습 강조.
    $("." + currentActivity).addClass("on");
});

const loadQuiz = () => {
    loadQuizData(step, quizType, setData);
}

const setData = data => {
    // 비지니스 로직
    // 1. 퀴즈 데이터 담기.
    quizData = data[0];

    // 2. 퀴즈 데이터 세팅
    // 퀴즈 타입이 알파벳인지 아닌지 판별
    try {
        checkGetDataSuccess();
        checkStudyType();

        setupQuiz();
        playBGM(sndBgmA3A);
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

// 퀴즈 세팅 시작
const setupQuiz = () => {
    isClick = true;
    isWorking = true;
    lockScreen(true);

    setBoard();
    setExample();

    setClickEvent();
}

// 알파벳 보드
const setBoard = () => {
    let boardAlphabet = caseType == "big" ? quizData.Question.toLowerCase() : quizData.Question.toUpperCase();

    $(".js-text-board").html(boardAlphabet);

    for (let i = 0; i <= 2; i++) {
        $(".js-wrapper-gear").eq(i).hover(() => {
            $(".js-text-alphabet").eq(i).css('color', '#FFF200');
        }, () => {
            $(".js-text-alphabet").eq(i).css('color', 'black');
        });
    }
}

// 보기 세팅
const setExample = () => {
    try {
        playSound(quizData.Sound1, function () { isClick = false; isWorking = false; lockScreen(false); });

        exampleArr = extractExample(quizData.Example1, quizData.ExampleCount);

        if (exampleArr.length < 1) {
            throw "No Example Data";
        }

        switch (caseType) {
            case "big":
                $(".js-text-alphabet").css('top', '49%');
                exampleArr.map((data, index) => {
                    $(".js-text-alphabet").eq(index).html(data);                                // ex) A
                    $(".js-text-alphabet").eq(index).addClass("big" + data.toLowerCase());    // 알파벳 위치 보정
                    $(".js-gear-shadow").eq(index).removeClass("d-none");
                })
                break;

            case "small":
                exampleArr.map((data, index) => {
                    $(".js-text-alphabet").eq(index).html(data.toLowerCase());              // ex) a
                    $(".js-text-alphabet").eq(index).addClass("small" + data.toLowerCase());  // 알파벳 위치 보정
                    $(".js-gear-shadow").eq(index).removeClass("d-none");
                })
                break;
        }
    }
    catch (e) {
        alert("Set Example Error: " + e);
    }
}

// 문제 클릭 이벤트
const setClickEvent = () => {
    $(".js-gear").on("click", (e) => {
        if (isWorking || isClick) {
            return false;
        }
        else {
            isWorking = true;
            isClick = true;

            const $this = e.currentTarget;
            let isCorrect = false;

            const index = $(".js-gear").index($this);
            const answer = $(".js-gear").eq(index).children("p").html().toLowerCase();

            isCorrect = checkAnswer(answer);

            if (isCorrect) {
                repairSpaceShip(index);
            }
            else {
                bounceGear(index);
            }
        }
    })
}

// 정답 체크
const checkAnswer = strAnswer => {
    let correctText = quizData.CorrectText.toLowerCase();

    return (correctText == strAnswer ? true : false);
}

// 정답 체크 후
const repairSpaceShip = index => {
    playSound(sndCorrect);
    $(".js-wrapper-gear").eq(index).addClass("repair");
    $(".js-gear-shadow").eq(index).addClass("d-none");
    $(".js-character-millo").addClass("correct");
    playEffect1(sndHammering);
}

const afterRepairSpaceShip = () => {
    if (caseType == "small") {
        $(".js-character-baro").addClass("character-baro");
        playEffect1(sndBoarding);
    }
    else if (caseType == "big") {
        $(".js-character-chello").addClass("character-chello");
        playEffect1(sndBoarding);
    }
    else if (caseType == "end") {
        $(".js-img-space-ship").attr("src", "./images/img_space_ship_05.png").addClass("take-off");
        playEffect1(sndSpaceshipLaunching);
    }

    exampleArr.map((data, index) => {
        $(".js-text-alphabet").eq(index).removeClass("big" + data.toLowerCase());    // 알파벳 위치 보정
        $(".js-text-alphabet").eq(index).removeClass("small" + data.toLowerCase());    // 알파벳 위치 보정
    })
}

const afterBaroEntered = () => {
    caseType = "big";

    $(".js-img-space-ship").attr("src", "./images/img_space_ship_02.png");
    $(".js-character-millo").removeClass("correct");
    $(".js-wrapper-gear").removeClass("repair");

    setupQuiz();
}

const afterChelloEntered = () => {
    caseType = "end";

    $(".js-img-space-ship").attr("src", "./images/img_space_ship_03.png");
    $(".js-character-millo").removeClass("correct");

    $(".js-wrapper-board").addClass("d-none");
    $(".js-wrapper-gear").addClass("d-none");

    $(".js-character-millo").addClass("walking");
    playEffect1(sndBoarding);
}

const bounceGear = index => {
    playEffect1(sndIncorrectBoing);
    $(".js-gear").eq(index).effect("shake", () => {
        playSound(quizData.Sound1, function () { isClick = false; isWorking = false; lockScreen(false); });
    });
}

// 우주선 날아간 후
const afterTakeOff = () => {
    $(".js-text-end").html(quizData.CorrectText + quizData.Question);

    $(".js-bg-dark").removeClass("d-none");

    $(".js-text-end").animate({
        "font-size": "9em"
    }, 800, function () {
            playSound(quizData.Sound1, popNext);
    });
}

// 초기화
const resetAll = (pStart) => {
    if (pStart == true) {
        
    }

    isWorking = true;

    caseType = "small";
    $(".js-wrapper-board").removeClass("d-none");
    $(".js-img-space-ship").attr("src", "./images/img_space_ship_01.png");
    $(".js-bg-dark").addClass("d-none");
    $(".js-gear").removeClass("shake d-none");
    $(".js-character-baro").removeClass("character-baro d-none");
    $(".js-character-chello").removeClass("character-chello d-none");
    $(".js-character-millo").removeClass("walking correct d-none");
    $(".js-wrapper-gear").removeClass("repair d-none");
    $(".js-img-space-ship").attr("src", "./images/img_space_ship_01.png").removeClass("take-off");

    setupQuiz();
    hideNext();
    playBGM(sndBgmA3A);
}

const playQuestion = () => {
    playEffect1(quizData.Sound1);
}