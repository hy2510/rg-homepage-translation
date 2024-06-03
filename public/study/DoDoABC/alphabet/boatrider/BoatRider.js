let caseType = "big";                       // 대문자, 소문자 구별을 위한 변수

let questionLetter = "";                    // 답
let exampleArr = [];                        // 보기

// sound effect
let sndBigAlphabet = letterAlphabet + "big";                    // '빅에이' 경로
let sndSmallAlphabet = letterAlphabet + "small";                // '스몰에이' 경로
let sndAlphabet = letterAlphabet;                               // '에이' 경로
let sndCorrectBoing = effectAlphabet + "correct_1.mp3";         // (07) (800 ~ 1000) 맞췄을 때 나는 소리
let sndIncorrectBoing = effectAlphabet + "incorrect_baro.mp3"; // (08) (1000) 띠잉~ 틀렸을 때 나는 소리 
let sndSplash = effectAlphabet + "splash.mp3";                  // (11) (1500 ~ 2000) 처얼썩~ 바다 소리
let sndWhoosh = effectAlphabet + "whoosh.mp3";                  // (12) (900 ~ 1000) 휘익~ 캐릭터가 날아가는 소리
let sndSailing = effectAlphabet + "sailing.mp3";                // (14) (1200 ~ 1500) 씨잉~ 배가 앞으로 갈 때 나는 소리
let sndClinkingCoins = effectAlphabet + "clinking_coins.mp3";   // (15) (1200 ~ 1500) 쨍그렁~ 보물 짤그랑 소리

$(document).ready(() => {
    lockScreen(true);
    step = 2;
    quizType = "A";
    currentActivity = "A2A";    // 제일 먼저 세팅해야함.
    focusCurrent(currentActivity);

    // 깜빡임 방지를 위해 이미지 미리 로딩
    const imgArr = [
        "./images/img_character_01.png",
        "./images/img_character_02.png",
        "./images/img_character_correct.png",
        "./images/img_character_correct3.png",
        "./images/img_character_incorrect.png",
        "./images/img_character_incorrect3.png",
        "./images/img_character_jump_01.png",
        "./images/img_character_jump_02.png",
        "./images/img_character_jump_31.png",
        "./images/img_character_jump_32.png",
        "./images/img_character_rich.png",
        "./images/img_treasure.png"
    ]

    doPreloadImages(imgArr, loadQuiz);

    // 음원 딜레이 방지
    $("#preload1").attr('src', sndSplash);
    $("#preload2").attr('src', sndWhoosh);
    $("#preload3").attr('src', sndSailing);
    $("#preload4").attr('src', sndClinkingCoins);

    // 유저가 staff or review 일 때 메뉴에서 현재 학습 강조.
    $("." + currentActivity).addClass("on");
})

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
        playBGM(sndBgmA2A);
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

    setImage();
    setExample();
    setClickEvent();

    playEffect1(sndSplash);
    setTimeout(() => {
        playLetter();
    }, 1000);

}

// 이미지 세팅
const setImage = () => {
    switch (caseType) {
        case "big":
            $(".js-wrapper-boat").addClass("first");
            $(".js-wrapper-question-boat").addClass("first");
            $(".js-outer-img-cover").attr("src", "./images/img_cover_02.png");
            $(".js-left-img-cover").attr("src", "./images/img_cover_01.png");
            break;

        case "small":
            $(".js-wrapper-boat").addClass("second");
            $(".js-wrapper-question-boat").addClass("second");
            $(".js-outer-img-cover").attr("src", "./images/img_cover_03.png");
            $(".js-left-img-cover").attr("src", "./images/img_cover_02.png");
            break;

        case "both":
            $(".js-wrapper-boat").removeClass("second").addClass("third");
            $(".js-wrapper-question-boat").removeClass("second").addClass("third");
            $(".js-boat-cover").addClass("d-none");
            $(".js-left-img-cover").attr("src", "./images/img_cover_03.png");
            break;
    }
}

// 보기 세팅
const setExample = () => {
    try {
        exampleArr = extractExample(quizData.Example1, quizData.ExampleCount);

        $(".js-boat-cover").css("opacity", "0.001");

        if (exampleArr.length < 1) {
            throw "No Example Data";
        }

        switch (caseType) {
            case "big":
                $(".boats_wave").css("transform", "scale(0.9)");
                $(".text-alphabet").addClass("big");
                exampleArr.map((data, index) => {
                    $(".js-text-alphabet").eq(index).html(data);
                });
                break;

            case "small":
                $(".boats_wave").css("transform", "scale(0.9)");
                $(".text-alphabet").addClass("small");
                resetAll(false);

                exampleArr.map((data, index) => {
                    $(".js-text-alphabet").eq(index).html(data.toLowerCase());
                });
                break;

            case "both":
                $(".boats_wave").css("transform", "scale(1.3)");
                $(".text-alphabet").addClass("both");
                $(".js-question-character").addClass("both");
                resetAll(false);
                exampleArr.map((data, index) => {
                    $(".js-text-alphabet").eq(index).html(data + data.toLowerCase());
                });
                // for test
                //$(".js-text-alphabet").eq(0).html("Mm");
                //$(".js-text-alphabet").eq(1).html("Ww");
                //$(".js-text-alphabet").eq(2).html("Ii");
                break;
        }
    }
    catch (e) {
        alert("Set Example Error: " + e);
    }
}

// 문제 클릭 이벤트
const setClickEvent = () => {
    if (caseType == "both") {
        $(".js-wrapper-question-boat").on("click", (e) => {
            if (isWorking || isClick) {
                return false;
            }
            else {
                const $this = e.currentTarget;

                isWorking = true;
                isClick = true;

                let isCorrect = false;

                const index = $(".js-wrapper-question-boat").index($this);
                const answer = $(".js-wrapper-text-alphabet").eq(index).children("p").html();

                isCorrect = checkAnswer(answer);

                doCharacterJump(index, isCorrect);
            }
        });
    }
    else {
        $(".js-boat-cover").on("click", (e) => {
            if (isWorking || isClick) {
                return false;
            }
            else {
                const $this = e.currentTarget;

                isWorking = true;
                isClick = true;

                let isCorrect = false;

                const index = $(".js-boat-cover").index($this);
                const answer = $(".js-wrapper-text-alphabet").eq(index).children("p").html();

                $(".js-boat-cover").css("opacity", "1");
                if (index == 2) {
                    $(".js-boat-cover").eq(1).css("opacity", "0.001");
                }

                isCorrect = checkAnswer(answer);

                doCharacterJump(index, isCorrect);
            }
        });
    }
}

// 정답 체크
const checkAnswer = strAnswer => {
    let correctText = quizData.CorrectText;

    switch (caseType) {
        case "small":
            correctText = correctText.toLowerCase();
            break;

        case "both":
            correctText = correctText + correctText.toLowerCase();
            break;
    }

    return (correctText == strAnswer ? true : false);
}

// 캐릭터 점프
const doCharacterJump = (index, isCorrect) => {
    isWorking = true;

    $(".js-wrapper-boat").addClass("stop");
    $(".js-left-boat-cover").addClass("stop");

    $(".js-active-character").removeClass("d-none");

    switch (index) {
        case 0:
            if (caseType == "both") {
                $(".js-active-character").addClass("movet1");
            } else {
                $(".js-active-character").addClass("move1");
            }
            break;

        case 1:
            if (caseType == "both") {
                $(".js-active-character").addClass("movet2");
            } else {
                $(".js-active-character").addClass("move2");
            }
            break;

        case 2:
            if (caseType == "both") {
                $(".js-active-character").addClass("movet3");
            } else {
                $(".js-active-character").addClass("move3");
            }
            break;
    }

    playEffect1(sndWhoosh);

    $(".js-active-character").on("animationend", () => { afterCharacterJumped(index, isCorrect) });
}

// 캐릭터 점프 후
const afterCharacterJumped = (index, isCorrect) => {
    $(".js-active-character").off("animationend");
    $(".js-active-character").addClass("d-none");

    if (isCorrect) {
        doCorrectAction(index);
    }
    else {
        doIncorrectAction(index);
    }

    $(".js-question-character").eq(index).removeClass("d-none");
}

// 정답에 따른 함수
const doCorrectAction = index => {
    if (caseType != "both") {
        $(".js-question-character").addClass("d-none");
        $(".js-wrapper-question-boat").eq(index).addClass("success");
    } else {
        $(".js-img-treasure").eq(index).removeClass("d-none");
        $(".js-wrapper-question-boat").eq(index).addClass("rich");
    }

    $(".js-boat-cover").css("opacity", "0.001");

    setTimeout(() => {
        if (caseType != "both") {
            playEffect1(sndSailing);
            playEffect2(sndCorrectBoing);
            $(".js-wrapper-question-boat").eq(index).addClass("correct");
        }
    }, 1500);

    playLetter2();

    if (caseType == "both") {
        setTimeout(() => {
            playEffect1(sndCorrectBoing);
            playSound(sndClinkingCoins, popNext);
        }, 1500);
    }
}

const doIncorrectAction = index => {
    $(".js-wrapper-question-boat").eq(index).removeClass("success");
    $(".js-wrapper-question-boat").eq(index).addClass("incorrect");

    playEffect1(sndIncorrectBoing);

    setTimeout(() => {
        $(".js-wrapper-question-boat").removeClass("incorrect");
        resetAll(false);

        playEffect1(sndSplash);
        playLetter();
    }, 1500)
}

// 배 이동 후
const afterBoatMoved = () => {
    switch (caseType) {
        case "big":
        case "small":
            caseType = caseType == "big" ? "small" : "both";

            setupQuiz();
            break;

        case "both":
            break;
    }
}

// 음원 재생
const playLetter = () => {
    if (caseType == "small") {
        // '스몰에이'            
        playSound(sndSmallAlphabet + quizData.Example1.toLowerCase() + ".mp3", function () { isWorking = false; isClick = false; lockScreen(false); });
    } else if (caseType == "big") {
        // '빅에이'
        playSound(sndBigAlphabet + quizData.Example1.toLowerCase() + ".mp3", function () { isWorking = false; isClick = false; lockScreen(false); });
    } else {
        playSound(sndAlphabet + quizData.Example1.toLowerCase() + ".mp3", function () { isWorking = false; isClick = false; lockScreen(false); });
    }
}

// 음원 재생2
const playLetter2 = () => {
    if (caseType == "small") {
        // '스몰에이'            
        playEffect1(sndSmallAlphabet + quizData.Example1.toLowerCase() + ".mp3");
    } else if (caseType == "big") {
        // '빅에이'
        playEffect1(sndBigAlphabet + quizData.Example1.toLowerCase() + ".mp3");
    } else {
        playEffect1(sndAlphabet + quizData.Example1.toLowerCase() + ".mp3");
    }
}

// 초기화
const resetAll = (pStart) => {
    // popNext에서 호출했으면 'big' 상태로
    if (pStart == true) {
        caseType = "big";
        $(".js-img-treasure").addClass("d-none");
        $(".js-wrapper-boat").removeClass("second third");
        $(".js-wrapper-question-boat").removeClass("second third rich");
        $(".js-wrapper-boat").addClass("first");
        $(".js-wrapper-question-boat").addClass("first");
        $(".text-alphabet").removeClass("both");
        $(".js-question-character").removeClass("both small");
        $(".js-question-character").addClass("big");
        $(".text-alphabet").addClass("big");

        setupQuiz();
        hideNext();
        playBGM(sndBgmA2A);
    }

    isWorking = true;

    $(".js-wrapper-boat").removeClass("stop");
    $(".js-left-boat-cover").removeClass("stop");
    $(".js-question-character").addClass("d-none");
    $(".js-wrapper-question-boat").removeClass("correct");
    $(".js-active-character").removeClass("move1 move2 move3");
    $(".js-active-character").removeClass("movet1 movet2 movet3");
}

const playQuestion = () => {
    if (caseType == "small") {
        // '스몰에이'            
        playSound(sndSmallAlphabet + quizData.Example1.toLowerCase() + ".mp3", function () { isWorking = false; isClick = false; lockScreen(false); });
    } else if (caseType == "big") {
        // '빅에이'
        playSound(sndBigAlphabet + quizData.Example1.toLowerCase() + ".mp3", function () { isWorking = false; isClick = false; lockScreen(false); });
    } else {
        playSound(sndAlphabet + quizData.Example1.toLowerCase() + ".mp3", function () { isWorking = false; isClick = false; lockScreen(false); });
    }
}