let quizDataArr;
let correctCount = 0;
let maxCorrectCount = 0;
let exampleArr = [];                        // 보기
let isCorrect = false;

const sndCorrect = effectPhonics + "correct_boy.mp3";                   // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectPhonics + "incorrect_boy.mp3";    // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
const sndSelect = effectPhonics + "select_button.mp3";
const sndFirecrack = effectPhonics + "firecrack.mp3";               // (38) (2000) 폭죽
const sndSparkling = effectPhonics + "sparkling.mp3";               // (36) (1500) 심지타는소리

$(document).ready(() => {
    lockScreen(true);
    step = 2;
    quizType = "B";
    currentActivity = "A2B";    // 제일 먼저 세팅해야함.
    focusCurrent(currentActivity);

    const imgArr = [
        "./images/img_firecracker_correct.png",
        "./images/img_firecracker_incorrect.png",
        "./images/img_firecracker_correct.png",
        "./images/img_firecracker_incorrect.png",
        "./images/img_character_correct.png",
        "./images/img_character_incorrect.png"
    ];

    doPreloadImages(imgArr, loadQuiz);

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
    lockScreen(true);

    // 2. 퀴즈 데이터 세팅
    // 퀴즈 타입이 알파벳인지 아닌지 판별
    try {
        quizData = quizDataArr[correctCount];

        checkGetDataSuccess();
        checkStudyType();

        isCorrect = false;

        setImage();
        setExample();
        setClickEvent();
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

// 이미지 세팅
const setImage = () => {
    $(".js-question").attr("src", quizData.Image1);
}

// 보기 세팅
const setExample = () => {
    try {
        if (quizData.length < 1) {
            throw "No Example Data";
        }

        exampleArr.push(quizData.Example1);
        exampleArr.push(quizData.Example2);
        exampleArr.push(quizData.Example3);

        exampleArr = shuffle(exampleArr);

        $(".js-card-back").html("");

        exampleArr.map((data, index) => {
            //console.log(data);
            $(".js-example").eq(index).html(data);
        });

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
    $(".js-handle").on("click", () => {
        if (isWorking || isClick) {
            return false;
        }
        else {
            isWorking = true;
            isClick = true;
            lockScreen(true);

            $this = event.currentTarget;
            const index = $(".js-handle").index($this);

            const answer = $(".js-example").eq(index).html();

            isCorrect = checkAnswer(answer);

            pushHandle(index);
        }
    });
}

// 정답 체크
const checkAnswer = strAnswer => {
    return (quizData.Example1 == strAnswer ? true : false);
}

// 정답 체크 후
const pushHandle = index => {
    $(".js-handle").eq(index).addClass("push");
    playEffect1(sndSelect);
}

const afterPushHandle = () => {
    setTimeout(() => {
        playEffect1(sndSparkling);
    }, 1000);

    if (isCorrect) {
        explode();
    }
    else {
        unexplode();
    }
}

const explode = () => {
    $(".js-firecracker").addClass("correct");
}

const unexplode = () => {
    $(".js-firecracker").addClass("incorrect");
}

const afterIgnite = () => {
    if (isCorrect) {
        successFireworks();
    }
    else {
        failedFireworks();
    }
}

const afterFirecrack = () => {
    $(".js-container").addClass("flip");
    playWord();
    setTimeout(() => {
        $(".js-card-back").addClass("bigger");
    }, 1000);
}

const successFireworks = () => {
    playEffect1(sndFirecrack);
    setTimeout(() => { afterFirecrack() }, 1000);

    correctCount++;
    $(".js-blanc").addClass("correct");
    $(".js-wrapper-fireworks").removeClass("d-none");

    setTimeout(() => {
        if (correctCount < maxCorrectCount) {
            exampleArr = [];

            $(".js-card-back").removeClass("bigger");
            $(".js-container").removeClass("flip");
            $(".js-blanc").removeClass("correct");
            $(".js-firecracker").removeClass("correct");
            $(".js-wrapper-fireworks").addClass("d-none");
            $(".js-handle").removeClass("push");

            setupQuiz();
        }
        else {
            setTimeout(() => {
                popNext();
            });
        }
    }, 5000);
}

const failedFireworks = () => {
    playEffect1(sndIncorrectBoing);
    $(".js-blanc").addClass("incorrect");

    setTimeout(() => {
        returnHandle();
        $(".js-blanc").removeClass("incorrect");
        $(".js-firecracker").removeClass("incorrect");

        playWord();
    }, 2000);
}

const returnHandle = () => {
    $(".js-handle").removeClass("push");
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];
    $(".js-card-back").removeClass("bigger");
    $(".js-container").removeClass("flip");
    $(".js-blanc").removeClass("correct");
    $(".js-firecracker").removeClass("correct");
    $(".js-wrapper-fireworks").addClass("d-none");
    $(".js-handle").removeClass("push");
    setupQuiz();
    playBGM(sndBgmA2B);
    hideNext();
}

const playWord = () => {
    playSound(quizData.Sound1, function () {
        isWorking = false;
        isClick = false;
        lockScreen(false);

        let splitCorrectText = quizData.Question.split(quizData.Example1);
        let s1 = "<span>" + splitCorrectText[0] + "</span>";
        let s2 = "<span style ='color:#a50000'>" + quizData.Example1 + "</span>";
        let s3 = "<span>" + splitCorrectText[1] + "</span>";

        $(".js-card-back").html(s1 + s2 + s3);

    });
}

const characterAction = () => {
    return;
    knockCnt++;

    if (knockCnt >= 3) {
        knockCnt = 0;
        $(".js-blanc").addClass("characteract");
        $(".js-blanc").removeClass("characteract");
    }
}