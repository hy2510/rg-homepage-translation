let quizDataArr;
let exampleArr = [];                        // 보기
let correctCount = 0;
let maxCorrectCount = 0;
let wordType = "sight";

const sndCorrect = effectSightWords + "correct.mp3";                        // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectSightWords + "incorrect.mp3";         // (08) (800 ~ 1000) 틀렸을 때 나는 소리 

$(document).ready(() => {
    lockScreen(true);

    step = 4;
    quizType = "B";
    currentActivity = "A4B";    // 제일 먼저 세팅해야함.

    
    focusCurrent(currentActivity);

    const imgArr = [];

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
    playBGM(sndBgmA4A);
    //console.log(data);
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

        motionGomaWaiting();

        setQuestion();
        setExample();
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }

    $('.blackcurtain').addClass("d-none");
    $('.wrapper-quiz').addClass("d-none");
    setTimeout(() => {
        lockScreen(false);
    }, 1000);
}

// 문제 세팅
const setQuestion = () => {
    try {
            if (quizData.length < 1) {
                throw "No Question Data";
            }

        $(".js-quiz").css(`background-image`, `url(${quizData.Image1}`);

        if (Math.floor(Math.random() * 100) % 2 == 0) {
            $(".js-example1")[0].innerText = quizData.Example1;
            $(".js-example2")[0].innerText = quizData.Example2;
        }
        else {
            $(".js-example2")[0].innerText = quizData.Example1;
            $(".js-example1")[0].innerText = quizData.Example2;
        }
    }
    catch (e) {
        alert("Set Question Error: " + e);
    }
}

// 보기 세팅
const setExample = () => {
    try {
        if (quizData.length < 1) {
            throw "No Question Data";
        }

        setTimeout(() => {
            playQuestion();
            motionGomaWaiting();
        }, 1200);
    }
    catch (e) {
        alert("Set Question Error: " + e);
    }
}

//정답 체크
const checkAnswer = (pNum) => {
    let answer = '';
    isClick = true;
    isWorking = true;
    lockScreen(isWorking);

    if (pNum == 1) {
        answer = $(".js-example1")[0].innerText;
    } else {
        answer = $(".js-example2")[0].innerText;
    }

    if (answer == quizData.Example1) {
        correctAction(pNum);
    } else {
        incorrectAction();
    }
}

const playQuestion = () => {
    playSound(quizData.Sound1, function () {
        isWorking = false;
        isClick = false;
        lockScreen(isWorking);
    });
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];
    setupQuiz();
    playBGM(sndBgmA5A);
    hideNext();
    $('.edmond_star').removeClass('star_appear');
    $('.leoni_star').removeClass('star_appear');
    $('.goma_star').removeClass('star_appear');
    $('.gino_star').removeClass('star_appear');
}

const correctAction = (pNum) => {
    lockScreen(true);

    motionGomaCorrect(pNum);

    setTimeout(() => {
        playEffect1(sndCorrect);
    }, 200);

    setTimeout(() => {
        playQuestion();
    }, 1700);

    setTimeout(() => {
    correctCount++;
        if (correctCount < maxCorrectCount) {
            setupQuiz();
        }
        else {
            // 끝
            setTimeout(() => {
                popNext();
            }, 2000);
        }
    }, 4500);
}

const incorrectAction = () => {
    lockScreen(true);
    motionGomaIncorrect();
    setTimeout(() => {
        playEffect1(sndIncorrectBoing);
        setTimeout(() => {
            playQuestion();
            motionGomaWaiting();
        }, 1000)
    }, 400);
}

const motionGomaWaiting = () => {
    $('.js-goma').removeClass('goma_correct').removeClass('goma_incorrect').addClass('goma_d');
    $('.js-box1').removeClass('q_gone').removeClass('q_correct');
    $('.js-box2').removeClass('q_gone').removeClass('q_correct');
}

const motionGomaCorrect = (pNum) => {
    $('.js-goma').removeClass('goma_d').removeClass('goma_incorrect').addClass('goma_correct');
    if (pNum == 1) {
        $('.js-box1').removeClass('q_gone').addClass('q_correct');
        $('.js-box2').removeClass('q_correct').addClass('q_gone');
    } else {
        $('.js-box2').removeClass('q_gone').addClass('q_correct');
        $('.js-box1').removeClass('q_correct').addClass('q_gone');
    }
    
    if (correctCount == 0) {
        $('.edmond_star').addClass('star_appear');
    } else if (correctCount == 1) {
        $('.leoni_star').addClass('star_appear');
    } else if (correctCount == 2) {
        $('.goma_star').addClass('star_appear');
    } else if (correctCount == 3) {
        $('.gino_star').addClass('star_appear');
    }
}

const motionGomaIncorrect = () => {
    $('.js-goma').removeClass('goma_d').removeClass('goma_correct').addClass('goma_incorrect');
    $('.js-box1').removeClass('q_gone').removeClass('q_correct');
    $('.js-box2').removeClass('q_gone').removeClass('q_correct');
}