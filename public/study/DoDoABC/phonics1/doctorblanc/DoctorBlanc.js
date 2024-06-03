let quizDataArr;
let correctCount = 0;
let maxCorrectCount = 0;
let exampleArr = [];                        // 보기
let isCorrect = false;

const sndCorrect = effectPhonics + "correct.mp3";                   // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectPhonics + "incorrect_boing.mp3";    // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
const sndSelect = effectPhonics + "select.mp3";
const sndHealing = effectPhonics + "healing.mp3";                   // () (1600) 치유
const sndNooo = effectPhonics + "nooo.mp3";                         // '노오오오우~'


$(document).ready(() => {
    lockScreen(true);
    step = 2;
    quizType = "A";
    currentActivity = "A2A";    // 제일 먼저 세팅해야함.
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
    playBGM(sndBgmA2A);
}

// 퀴즈 세팅 시작
const setupQuiz = () => {
    isClick = true;
    isWorking = true;
    lockScreen(true);

    // 2. 퀴즈 데이터 세팅
    // 퀴즈 타입이 알파벳인지 아닌지 판별
    try {
        isCorrect = false;

        quizData = quizDataArr[correctCount];

        checkGetDataSuccess();
        checkStudyType();

        setImage();
        setWord();
        setExample();
        setClickEvent();

        isClick = false;
        isWorking = false;

    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

// 이미지 세팅
const setImage = () => {
    let appendHtml = "";

    appendHtml += "<img class='wrapper-img' src='" + quizData.Image1 + "' />"

    $(".js-img-question").append(appendHtml);
}

// 단어 세팅
const setWord = () => {
    let appendHtml = '';
    let res = quizData.Question.split("_");

    if (quizData.Question[0] == "_") {
        // case '_x'
        if (quizData.Example1.length == 1) {
            appendHtml += '<span class="one"></span>';
        } else if (quizData.Example1.length == 2) {
            appendHtml += '<span class="two"></span>';
        } else if (quizData.Example1.length == 3) {
            appendHtml += '<span class="three"></span>';
        }

        appendHtml += '<span>' + res[0] + '</span>';
    } else {
        if (res.length == 1) {
            // case 'x_'
            appendHtml += '<span>' + res[0] + '</span>';

            if (quizData.Example1.length == 1) {
                appendHtml += '<span class="one"></span>';
            } else if (quizData.Example1.length == 2) {
                appendHtml += '<span class="two"></span>';
            } else if (quizData.Example1.length == 3) {
                appendHtml += '<span class="three"></span>';
            }
        } else {
            // case 'x_x'
            appendHtml += '<span>' + res[0] + '</span>';

            if (quizData.Example1.length == 1) {
                appendHtml += '<span class="one"></span>';
            } else if (quizData.Example1.length == 2) {
                appendHtml += '<span class="two"></span>';
            } else if (quizData.Example1.length == 3) {
                appendHtml += '<span class="three"></span>';
            }

            appendHtml += '<span>' + res[1] + '</span>';
        }

    }

    $(".js-word").append(appendHtml);
}

// 보기 세팅
const setExample = () => {
    exampleArr = [];

    exampleArr.push(quizData.Example1);
    exampleArr.push(quizData.Example2);
    exampleArr.push(quizData.Example3);

    exampleArr = shuffle(exampleArr);

    let appendHtml = "";

    exampleArr.map((data) => {
        appendHtml += "<div class='js-pill pill' onanimationend='afterAction()'>" + data + "</div>";
    });

    $(".js-wrapper-pills").append(appendHtml);

    setTimeout(() => {
        playWord();
    }, 1000);
}

// 클릭 이벤트
const setClickEvent = () => {
    $(".js-pill").on("click", () => {
        if (isWorking || isClick) {
            return false;
        }
        else {
            isWorking = true;
            isClick = true;
            lockScreen(true);

            const $this = event.currentTarget;

            const index = $(".js-pill").index($this);
            const answer = $(".js-pill").eq(index).html();

            isCorrect = checkAnswer(answer);

            $(".js-character-blanc").addClass("up");
            eyesUp(index);
        }
    })
}

// 정답 체크
const checkAnswer = strAnswer => {
    let correctText = quizData.Example1.toLowerCase();

    return (correctText == strAnswer ? true : false);
}

// 정답 체크 후
const eyesUp = index => {
    if (isCorrect) {
        correctAction(index);
    }
    else {
        incorrectAction(index);
    }
}

const correctAction = index => {
    playEffect1(sndCorrect);
    $(".js-pill").eq(index).addClass("take");
}

const incorrectAction = index => {
    playEffect1(sndIncorrectBoing);
    //$(".js-pill").eq(index).addClass("shake");
    $(".js-pill").addClass("shake");
}

const afterAction = () => {
    $(".js-character-blanc").removeClass("up");

    if (isCorrect) {
        playEffect1(sndHealing);

        $(".js-word").children().remove();
        $(".js-word").append("<span style='float:left;'>" + quizData.CorrectText + "</span>");

        $(".js-character-blanc").addClass("correct");
        $(".js-character-jack").addClass("correct");
    }
    else {
        playWord();
        $(".js-character-blanc").addClass("incorrect");
        $(".js-character-jack").addClass("incorrect");
    }
}

const afterTakeMedication = () => {
    if (isCorrect) {
        correctCount++;

        if (correctCount < maxCorrectCount) {
            playWord();
            $(".wrapper-img").addClass("bigger");

            setTimeout(() => {
                $(".js-character-jack").removeClass("correct");
                $(".js-character-blanc").removeClass("correct");

                $(".js-img-question").children().remove();
                $(".js-word").children().remove();

                $(".js-wrapper-pills").children().remove();

                setupQuiz();
            }, 2500);

        }
        else {
            setTimeout(() => {
                popNext();
            });
        }
    }
    else {
        setTimeout(() => {
            $(".js-pill").removeClass("shake");
            $(".js-character-jack").removeClass("incorrect");
            $(".js-character-blanc").removeClass("incorrect");

            isClick = false;
            isWorking = false;
        }, 2000)
    }
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];

    $(".js-character-jack").removeClass("correct");
    $(".js-character-blanc").removeClass("correct");
    $(".js-img-question").children().remove();
    $(".js-word").children().remove();
    $(".js-wrapper-pills").children().remove();

    setupQuiz();
    playBGM(sndBgmA3A);
    hideNext();
}

const playWord = () => {
    playSound(quizData.Sound1, function () { isWorking = false; isClick = false; lockScreen(false); });
}

const characterAction = () => {
    return;
    knockCnt++;

    if (knockCnt >= 3) {
        knockCnt = 0;
        $(".js-character-blanc").addClass("characteract");
        playSound(sndNooo, function () { $(".js-character-blanc").removeClass("characteract"); });
    }
}
