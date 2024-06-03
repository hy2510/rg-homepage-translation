let quizDataArr;
let correctCount = 0;
let maxCorrectCount = 0;
let exampleArr = [];                        // 보기
let isCorrect = false;
let drake;

const sndCorrect = effectPhonics + "correct_girl.mp3";                   // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectPhonics + "incorrect_girl.mp3";    // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
const sndEating = effectPhonics + "eating.mp3";                     // (39) 햄버거 먹는 소리 (2000)

$(document).ready(() => {
    lockScreen(true);
    step = 3;
    quizType = "A";
    currentActivity = "A3A";    // 제일 먼저 세팅해야함.
    focusCurrent(currentActivity);

    const imgArr = [
        "./images/img_character_sheila.png",
        "./images/img_character_sheila_correct.png",
        "./images/img_character_sheila_incorrect.png",
        "./images/img_character_sheila_complete.png"
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
    playBGM(sndBgmA3A);
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
        setDragEvent();

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

        // 박스
        $(".js-text-example").html(quizData.Question.replace("_", ""));

        // 보기
        let appendHtml = "";

        exampleArr.map((data, index) => {
            appendHtml += '<div class="js-stuff stuff stuff' + index + ' stuff0' + (correctCount + 1) + '">';
            appendHtml += '<p class="js-text-alphabet text-alphabet">' + data + '</p>';
            appendHtml += '</div >';
        });

        $(".js-wrapper-example").append(appendHtml);
        $(".js-drop-target").removeClass("d-none");

        setTimeout(() => {
            playWord();
        }, 1000);
    }
    catch (e) {
        alert("Set Example Error: " + e);
    }
}

// 드래그 & 드롭
const setDragEvent = () => {
    const dragElements = document.querySelector(".js-wrapper-example");
    const dropTarget = document.querySelector(".js-drop-target");

    drake = dragula(
        // 하단에 애들끼리만 이동가능.
        [dragElements, dropTarget],
        // 옵션
        {
            revertOnSpill: true,            // 드래그한 대상을 바깥에 흘리면 다시 되돌아오도록
            moves: () => {
                if (isWorking || isClick) {
                    return false;
                }
                else {
                    return true;
                }
            },
            accepts: (el, target) => {
                return target !== document.querySelector(".js-wrapper-example");
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

            const answer = el.children[0].innerHTML;

            isCorrect = checkAnswer(answer);

            if (isCorrect) {
                stackStuff();

                correctAction();
            }
            else {
                drake.cancel();

                incorrectAction();

                $(".js-wrapper-example").effect("shake", { times: 4 }, 1000);
            }
        }
    });
}

// 정답 체크
const checkAnswer = strAnswer => {
    return (quizData.Example1 == strAnswer ? true : false);
}

// 정답 체크 후
const stackStuff = () => {
    correctCount++;

    $(".js-drop-target").children(".js-stuff").remove();
    $(".js-wrapper-plate").append("<img src='./images/img_burger_0" + correctCount + "_right.png' />");
}

const correctAction = () => {
    $(".js-drop-target").addClass("d-none");
    $(".js-sheila").addClass("correct");
    playEffect1(sndCorrect);
}

const incorrectAction = () => {
    $(".js-sheila").addClass("incorrect");
    setTimeout(() => { playEffect1(sndIncorrectBoing) }, 600)
}

const afterCharacterAction = () => {
    if (isCorrect) {
        if ($(".js-sheila").hasClass("complete")) {
            setTimeout(() => {
                popNext();
            });
        }
        else {
            if (correctCount < maxCorrectCount) {
                setTimeout(() => {
                    exampleArr = [];
                    $(".js-sheila").removeClass("correct");
                    $(".js-wrapper-example").children().remove();
                    drake.destroy();
                    setupQuiz();
                }, 1000)
            }
            else {
                $(".js-wrapper-plate").append("<img src='./images/img_burger_05_right.png' />");

                setTimeout(() => {
                    $(".js-drop-target").addClass("d-none");
                    eatBurger();
                }, 1000)
            }
        }
    }
    else {
        $(".js-sheila").removeClass("incorrect");

        playWord();
    }
}

const eatBurger = () => {
    $(".js-wrapper-plate").children().remove();
    $(".js-sheila").addClass("complete");
    playEffect1(sndEating);
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];
    drake.destroy();

    $(".js-sheila").removeClass("correct");
    $(".js-sheila").removeClass("complete");
    $(".js-drop-target").removeClass("d-none");
    $(".js-wrapper-example").children().remove();

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
        $(".js-sheila").addClass("characteract");
        $(".js-sheila").removeClass("characteract");
    }
}
