let quizDataArr;
let correctCount = 0;
let maxCorrectCount = 0;
let exampleArr = [];                        // 보기
let isCorrect = false;
let drake;

const sndCorrect = effectPhonics + "correct_dodo2.mp3";                   // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectPhonics + "incorrect_dodo2.mp3";    // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
const sndObjectFloating = effectPhonics + "object_floating.mp3"     // (20) 기구 떠오르는 소리 (1000)
const sndGone = effectPhonics + "gone.mp3"                          // (  ) 날아 올라 사라지는 소리 (1200)

$(document).ready(() => {
    lockScreen(true);
    step = 4;
    quizType = "A";
    currentActivity = "A4A";    // 제일 먼저 세팅해야함.
    
    focusCurrent(currentActivity);

    const imgArr = [
        "./images/img_balloon_01.png",
        "./images/img_balloon_02.png",
        "./images/img_balloon_03.png",
        "./images/img_balloon_04.png",
        "./images/img_hot_air_balloon.png",
        "./images/img_character_dodo_correct.png",
        "./images/img_character_dodo_incorrect.png"
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
    playBGM(sndBgmA4A);
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

        setWord();
        setExample();
        setDragEvent();

        setTimeout(() => {
            playPronunce();
        }, 1000);
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

// 단어 세팅
const setWord = () => {
    let appendHtml = "";

    appendHtml += "<div class='wrapper-balloon word'>";
    appendHtml += "<div class='wrapper-word'>";
    appendHtml += "<p class='text-word'>" + quizData.Question.replace("_", "") + "</p>";
    appendHtml += "</div>";
    appendHtml += "</div>";

    $(".js-wrapper-balloons").append(appendHtml);
}

// 단어 세팅
const setCorrectWord = () => {
    let appendHtml = '';
    let res = quizData.Question.split("_");

    if (quizData.Question[0] == "_") {
        // case '_x'
        appendHtml = "<div><span class='text-correct'>" + quizData.Example1 + "</span><span class='text-correct correct'>" + quizData.Question.replace('_', '') + "</span></div>";
    } else {
        if (res.length == 1) {
            // case 'x_'
            appendHtml = "<div><span class='text-correct correct'>" + quizData.Question.replace('_', '') + "</span><span class='text-correct'>" + quizData.Example1 + "</span></div>";
        } else {
            // case 'x_x'
            appendHtml = "<div><span class='text-correct'>" + quizData.Example1 + "</span><span class='text-correct correct'>" + quizData.Question.replace('_', '') + "</span><span class='text-correct'>" + quizData.Example2 + "</span></div>";
        }

    }

    return appendHtml;
}

// 보기 세팅
const setExample = () => {
    try {
        if (quizData.length < 1) {
            throw "No Example Data";
        }

        exampleArr.push(quizData.Image1);
        exampleArr.push(quizData.Image2);
        exampleArr.push(quizData.Image3);

        exampleArr = shuffle(exampleArr);

        // 보기
        let appendHtml = "";
        exampleArr.map((data, index) => {
            switch (index) {
                case 0:
                    appendHtml += "<div class='wrapper-balloon first'>";
                    break;

                case 1:
                    appendHtml += "<div class='wrapper-balloon second'>";
                    break;

                case 2:
                    appendHtml += "<div class='wrapper-balloon third'>";
                    break;
            }
            appendHtml += "<div class='wrapper-img'" + " onclick='playClick(" + index + ")>";
            appendHtml += "<div class='wrapper-img'>";
            appendHtml += '<img class="img-example" src="' + data + '" onclick="playClick(\'' + data.replace('image', 'sound').replace('png', 'mp3') + '\')"/>';
            //appendHtml += "<img class='img-example' src='" + data + "' onclick='playClick(" + data.replace('image', 'sound').replace('png', 'mp3') + ")/>";
            appendHtml += "</div>";
            appendHtml += "</div>";
        });

        $(".js-wrapper-balloons").append(appendHtml);

        // 열기구
        $(".js-drop-target").eq(correctCount).removeClass("d-none").addClass("dot");
    }
    catch (e) {
        alert("Set Example Error: " + e);
    }
}

// 드래그 & 드롭
const setDragEvent = () => {
    const dragElements = document.querySelector(".js-wrapper-balloons");
    const dropTarget = document.querySelector(".dot");

    drake = dragula(
        // 하단에 애들끼리만 이동가능.
        [dragElements, dropTarget],
        // 옵션
        {
            revertOnSpill: true,            // 드래그한 대상을 바깥에 흘리면 다시 되돌아오도록
            moves: (el, source, handle) => {
                if (isWorking || isClick) {
                    return false;
                }
                else {
                    if (handle.classList.contains("text-word") ||
                        handle.classList.contains("wrapper-word") ||
                        handle.classList.contains("word") ||
                        handle.classList.contains("wrapper-balloon")
                    ) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
            },
            accepts: (el, target) => {
                return target !== dragElements;
            }
        }
    )

    drake.on("drop", (el, target) => {
        if (isWorking || isClick) {
            drake.cancel();

            return false;
        }
        else {
            isWorking = true;
            isClick = true;
            lockScreen(true);

            isCorrect = false;

            const answer = el.children[0].children[0].getAttribute("src").replace(phonicsWordRoot, "").replace(".png", "");

            isCorrect = checkAnswer(answer);

            if (isCorrect) {
                hangBalloon();
            }
            else {
                drake.cancel();

                incorrectAction();
            }
        }
    });
}

// 정답 체크
const checkAnswer = strAnswer => {
    return (quizData.CorrectText == strAnswer ? true : false);
}

// 정답 체크 후
const hangBalloon = () => {
    let correctText = quizData.CorrectText;
    let appendHtml = setCorrectWord();// "<span class='text-correct'>" + correctText + "</span>"

    $(".js-drop-target").eq(correctCount).removeClass("dot");
    $(".js-drop-target").eq(correctCount).find(".wrapper-img").append(appendHtml);

    correctAction();
}

const correctAction = () => {
    playSound(sndCorrect, function () {
        //playWord();
        playSound(quizData.Sound1, function () {
            afterDodoAction();
        });
    });
    $(".js-dodo").addClass("correct");
}

const incorrectAction = () => {
    playSound(sndIncorrectBoing, function () {
        playQuestion();
        $(".js-dodo").removeClass("incorrect");
    });
    $(".js-dodo").addClass("incorrect");
    $(".wrapper-balloon").eq(1).effect("shake", { times: 4 }, 1000);
    $(".wrapper-balloon").eq(2).effect("shake", { times: 4 }, 1000);
    $(".wrapper-balloon").eq(3).effect("shake", { times: 4 }, 1000);
}

const afterDodoAction = () => {
    $(".js-dodo").removeClass("correct incorrect");
    if (isCorrect) {
        correctCount++;

        if (correctCount < maxCorrectCount) {
            playEffect1(sndObjectFloating);

            exampleArr = [];

            $(".js-wrapper-balloons").children().remove();

            switch (correctCount) {
                case 1:
                    $(".js-wrapper-air-balloon").addClass("first");
                    $(".js-img-shadow").addClass("first");
                    break;

                case 2:
                    $(".js-wrapper-air-balloon").addClass("second");
                    $(".js-img-shadow").addClass("second");
                    break;
            }

            drake.destroy();
            setupQuiz();
        }
        else {
            playSound(sndObjectFloating, playGone);

            $(".js-wrapper-air-balloon").addClass("up");
            $(".js-img-shadow").addClass("up");
        }
    }
    else {
        isClick = false;
        isWorking = false;
        lockScreen(false);
    }
}
const afterBalloonFly = () => {
    //
}

const playGone = () => {
    playSound(sndGone, popNext);
}

const playClick = (pIndex) => {
    //alert(pIndex);
    playEffect1(pIndex);
}

//const playWord = () => {
//    playEffect1(quizData.Sound1);
//}

const playPronunce = () => {
    playSound(pronuncePhonics + quizData.Question + ".mp3", function () {
        isWorking = false; isClick = false; lockScreen(false);
    });
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];

    $(".js-drop-target").empty();
    $(".js-wrapper-air-balloon").removeClass("up");
    $(".js-img-shadow").removeClass("up");
    $(".js-dodo").removeClass("correct incorrect");
    $(".js-wrapper-balloons").children().remove();
    $(".js-wrapper-example").children().remove();
    drake.destroy();

    setupQuiz();
    playBGM(sndBgmA3A);
    hideNext();
}
