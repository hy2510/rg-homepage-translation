let quizDataArr;
let exampleArr = [];                        // 보기
let correctCount = 0;
let maxCorrectCount = 0;
let isCorrect = false;

const sndCorrect = effectPhonics + "correct_papa.mp3";                    // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectPhonics + "incorrect_papa.mp3";     // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
const sndBang = effectPhonics + "bang.mp3";                          // (42) (1500) 탕탕탕 바닥 두드리는 소리
const ending = effectPhonics + "ending.mp3";                        // (08) (800 ~ 1000) 맨 마지막에 샤라랑~! 하면서 반짝거리는 숲 속? 소리 추가 
const sndObjectInserting = effectPhonics + "object_inserting_2.mp3";   // (28) (1500) 또로로로롱 나오는 (들어가는) 소리

$(document).ready(() => {
    lockScreen(true);

    step = 2;
    quizType = "B";
    currentActivity = "A2B";    // 제일 먼저 세팅해야함.

    
    focusCurrent(currentActivity);

    const imgArr = [
        "./images/bg_forest_greenthumb_01.jpg",
        "./images/bg_forest_greenthumb_02.jpg",
        "./images/bg_forest_greenthumb_03.jpg",
        "./images/bg_forest_greenthumb_04.jpg",
        "./images/bg_forest_greenthumb_05.jpg",
        "./images/img_character_papa.png",
        "./images/img_character_papa_correct.png",
        "./images/img_character_papa_correct2.png",
        "./images/img_character_papa_incorrect.png",
        "./images/img_character_papa_incorrect2.png"
    ];

    doPreloadImages(imgArr, loadQuiz);

    // 음원 딜레이 방지
    $("#preload1").attr('src', sndBang);
    $("#preload3").attr('src', sndObjectInserting);

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
    playBGM(sndBgmA2B);
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

        checkGetDataSuccess();
        checkStudyType();

        isCorrect = false;

        setQuestion();
        setExample();
        setClickEvent();
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

// 예제 세팅
const setQuestion = () => {
    $(".js-question").attr("src", quizData.Image1);
    setTimeout(() => {
       // $(".js-card-back").html(quizData.CorrectText);

        let splitCorrectText = quizData.CorrectText.split(quizData.Example1);
        let s1 = "<span>" + splitCorrectText[0] + "</span>";
        let s2 = "<span style ='color:#a50000'>" + quizData.Example1 + "</span>";
        let s3 = "<span>" + splitCorrectText[1] + "</span>";

        $(".js-card-back").html(s1 + s2 + s3);

    }, 1000);
}

// 보기 세팅
const setExample = () => {
    try {
        exampleArr = [];

        exampleArr.push(quizData.Example1);
        exampleArr.push(quizData.Example2);
        exampleArr.push(quizData.Example3);

        exampleArr = shuffle(exampleArr);

        $(".js-wrapper-pot").empty();

        for (let i = 0; i < exampleArr.length; i++) {
            let appendHtml = "";
            $(".js-wrapper-pot").eq(i).append("<span>" + exampleArr[i] + "</span>");
        }

        setTimeout(() => {
            playWord();
        }, 1000);
    }
    catch (e) {
        alert("Set Example Error: " + e);
    }
}

// 클릭 이벤트
const setClickEvent = () => {
    $(".js-wrapper-pot").on("click", () => {
        if (isWorking || isClick) {
            return false;
        }
        else {
            isClick = true;
            isWorking = true;
            lockScreen(isWorking);

            const $this = event.currentTarget;
            const index = $(".js-wrapper-pot").index($this);

            let answer = $(".js-wrapper-pot").eq(index).children(0).html();

            isCorrect = checkAnswer(answer);
            isCorrect ? correctPapa() : incorrectPapa();
        }
    })
}

// 정답 체크
const checkAnswer = strAnswer => {
    return (quizData.Example1 == strAnswer ? true : false);
}

// 정답 체크 후
const correctPapa = () => {
    //$(".js-container").addClass("flip");
    playSound(sndBang, function () { biggerPlant(); });
    $(".js-character-papa").addClass("correct");
}

const incorrectPapa = () => {
    playEffect1(sndIncorrectBoing);
    $(".js-character-papa").addClass("incorrect");

    if (correctCount == 0) {
        $(".js-wrapper-examples").effect("shake", { times: 4 }, 1000);
    } else {
        $(".js-div-img").css("opacity", "0.01");
        $(".incorrect-plant").removeClass("p0 p1 p2 p3 p4 p9");
        $(".incorrect-plant").addClass("p" + (correctCount - 1));
        $(".js-wrapper-incorrect").removeClass("d-none");
    }
}

const afterPapaAction = () => {
    if (isCorrect) {
        setTimeout(() => {
            $(".js-card-back").addClass("bigger");
            playSound(quizData.Sound1, function () { afterCorrectAction(); } );
        }, 3500);
    }
    else {
        afterIncorrectAction();
    }
}

// 정답 체크 후 액션
const afterCorrectAction = () => {
    correctCount++;

    if (correctCount < maxCorrectCount) {
        $(".js-character-papa").removeClass("correct");
        //$(".js-wrapper-question").removeClass("flip");        
        $(".js-card-back").removeClass("bigger");

        setTimeout(() => {
            $(".js-bg-forest-greenthumb").addClass("bg" + correctCount);
            $(".js-container").removeClass("flip");
            setupQuiz()
        }, 1000);
        
    }
    else {
        $(".js-bg-forest-greenthumb").addClass("bg" + correctCount);
        //$(".js-wrapper-flower").removeClass("d-none");
        playEffect1(ending);
        setTimeout(() => {
            popNext();
        }, 2000);
    }
}

const afterIncorrectAction = () => {
    playWord();
    $(".js-character-papa").removeClass("incorrect");
}

const gettingGrow = () => {
    playEffect1(sndObjectInserting);
    if ($(".wrapper-sprout").hasClass("bigger0")) {
        $(".wrapper-sprout").removeClass("bigger0");
        $(".wrapper-sprout").addClass("bigger1");
    } else if ($(".wrapper-sprout").hasClass("bigger1")) {
        $(".wrapper-sprout").removeClass("bigger1");
        $(".wrapper-sprout").addClass("bigger2");
    } else if ($(".wrapper-sprout").hasClass("bigger2")) {
        $(".wrapper-sprout").removeClass("bigger2");
        $(".wrapper-sprout").addClass("bigger3");
    } else if ($(".wrapper-sprout").hasClass("bigger3")) {
        $(".wrapper-sprout").removeClass("bigger3");
        $(".wrapper-sprout").addClass("bigger4");
    } else {
        $(".wrapper-sprout").addClass("bigger0");
    }
}

const rollingPlant = () => {
    if ($(".wrapper-sprout").hasClass("rolling0")) {
        $(".wrapper-sprout").removeClass("rolling0");
        $(".wrapper-sprout").addClass("rolling1");
    } else if ($(".wrapper-sprout").hasClass("rolling1")) {
        $(".wrapper-sprout").removeClass("rolling1");
        $(".wrapper-sprout").addClass("rolling2");
    } else if ($(".wrapper-sprout").hasClass("rolling2")) {
        $(".wrapper-sprout").removeClass("rolling2");
        $(".wrapper-sprout").addClass("rolling3");
    } else if ($(".wrapper-sprout").hasClass("rolling3")) {
        $(".wrapper-sprout").removeClass("rolling3");
        $(".wrapper-sprout").addClass("rolling4");
    } else {
        $(".wrapper-sprout").addClass("rolling0");
    }
}

const biggerPlant = () => {
    setTimeout(() => {
        $(".js-div-img").css("opacity", "1");
        $(".js-wrapper-incorrect").addClass("d-none");
        $(".incorrect-plant").removeClass("p0 p1 p2 p3 p4");
        $(".js-container").addClass("flip");
        gettingGrow();
    }, 1600);
}

const playWord = () => {
    playSound(quizData.Sound1, function () {
        isWorking = false;
        isClick = false;
        lockScreen(isWorking);

        $(".js-div-img").css("opacity", "1");
        $(".js-wrapper-incorrect").addClass("d-none");
        $(".incorrect-plant").removeClass("p0 p1 p2 p3 p4");
    });
}

const setInit = () => {
    $(".js-character-papa").removeClass("correct incorrect");
    $(".js-bg-forest-greenthumb").removeClass("bg0 bg1 bg2 bg3 bg4 bg5");
    //$(".js-bg-forest-greenthumb").addClass("bg" + correctCount);
    $(".js-container").removeClass("flip");
    $(".js-card-back").removeClass("bigger");
    //$(".js-wrapper-flower").addClass("d-none");
    $(".wrapper-sprout").removeClass("bigger0 bigger1 bigger2 bigger3 bigger4");
    $(".incorrect-plant").removeClass("p0 p1 p2 p3 p4");
    lockScreen(true);
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];
    setInit();
    setupQuiz();
    playBGM(sndBgmA2B);
    hideNext();
}

const characterAction = () => {
    return;
    knockCnt++;

    if (knockCnt >= 3) {
        knockCnt = 0;
        $(".js-character-papa").addClass("characteract");
        $(".js-character-papa").removeClass("characteract");
    }
}