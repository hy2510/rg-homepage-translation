let quizDataArr;
let correctCount = 0;
let maxCorrectCount = 0;
let exampleArr = [];                        // 보기
let isCorrect = false;
let iceCreamIndex = -1;
let iceCreamImage0 = '';
let iceCreamImage1 = '';
let iceCreamImage2 = '';
let iceCreamClass0 = '';
let iceCreamClass1 = '';
let iceCreamClass2 = '';
let drake;

const sndCorrect = effectPhonics + "correct_dodo.mp3";                   // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectPhonics + "incorrect_dodo4.mp3";    // (08) (800 ~ 1000) 틀렸을 때 나는 소리 

$(document).ready(() => {
    lockScreen(true);
    step = 5;
    quizType = "A";
    currentActivity = "A5A";    // 제일 먼저 세팅해야함.
    
    focusCurrent(currentActivity);

    const imgArr = [
        "./images/dodo_d.png",
        "./images/sheila_correct.png",
        "./images/dodo_incorrect.png",
        "./images/dodo_correct.png"
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
    playBGM(sndBgmA5A);
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

        setWord();
        setExample();
        setDragEvent();
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

// 단어 세팅
const setWord = () => {
    $(".js-wrapper-word").append(quizData.Question.replace(/_/gi, ""));
}

// 단어 세팅
const setExample = () => {
    try {
        if (quizData.length < 1) {
            throw "No Example Data";
        }

        let numArr = [1, 2, 3, 4, 5, 6];
        numArr = shuffle(numArr);

        let appendHtml = "";

        exampleArr.push(quizData.Image1);
        exampleArr.push(quizData.Image2);
        exampleArr.push(quizData.Image3);

        exampleArr = shuffle(exampleArr);

        // 보기
        exampleArr.map((data, index) => {
            switch (index) {
                case 0:
                    appendHtml += "<div class='js-wrapper-ice-cream wrapper-ice-cream first ice" + numArr[index] + "' onclick='playClick(" + index + ")'>";

                    break;

                case 1:
                    appendHtml += "<div class='js-wrapper-ice-cream wrapper-ice-cream second ice" + numArr[index] + "' onclick='playClick(" + index + ")'>";
                    break;

                case 2:
                    appendHtml += "<div class='js-wrapper-ice-cream wrapper-ice-cream third ice" + numArr[index] + "' onclick='playClick(" + index + ")'>";
                    break;
            }

            appendHtml += "<img class='js-quiz-image' src='" + data + "' word-sound='" + data.replace('image', 'sound').replace('png', 'mp3') + "' index='" + index + "' />";
            appendHtml += "</div>";

            if (index == 0) {
                iceCreamClass0 = "wrapper-ice-cream ice" + numArr[index];
                iceCreamImage0 = "<img class='js-quiz-image' src='" + data + "' word-sound='" + data.replace('image', 'sound').replace('png', 'mp3') + "' index='" + index + "' />";
            } else if (index == 1) {
                iceCreamClass1 = "wrapper-ice-cream ice" + numArr[index];
                iceCreamImage1 = "<img class='js-quiz-image' src='" + data + "' word-sound='" + data.replace('image', 'sound').replace('png', 'mp3') + "' index='" + index + "' />";
            } else if (index == 2) {
                iceCreamClass2 = "wrapper-ice-cream ice" + numArr[index];
                iceCreamImage2 = "<img class='js-quiz-image' src='" + data + "' word-sound='" + data.replace('image', 'sound').replace('png', 'mp3') + "' index='" + index + "' />";
            }
        });

        $(".js-wrapper-example").append(appendHtml);

        // 콘
        $(".js-drop-target").eq(correctCount).removeClass("d-none").addClass("dot");
        playPronunce();

        lockScreen(false);
        //playWord(false);
    }
    catch (e) {
        alert("Set Example Error: " + e);
    }
}

// 드래그 & 드롭
const setDragEvent = () => {
    const dragElements = document.querySelector(".js-wrapper-example");
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
                    return true;
                }
            },
            accepts: (el, target) => {
                return target !== dragElements;
            }
        }
    )

    drake.on("drop", (el, target) => {
        // 오답시 아이스크림 회전 
        var style = document.createElement('style');
        style.type = 'text/css';
        if (correctCount == 0) {
            style.innerHTML = '@keyframes slipdown {to {transform: rotate(-60deg);transform-origin:180px 230px;}}';
        } else if (correctCount == 1) {
            style.innerHTML = '@keyframes slipdown {to {transform: rotate(-60deg);transform-origin:120px 230px;}}';
        } else if (correctCount == 2) {
            style.innerHTML = '@keyframes slipdown {to {transform: rotate(-60deg);transform-origin:120px 230px;}}';
            //style.innerHTML = '@keyframes slipdown {to {transform: rotate(-60deg);transform-origin:' + $("#leftp").val() + 'px ' + $("#topp").val() + 'px;}}';
        }
        document.getElementsByTagName('head')[0].appendChild(style);
        // ]]

        if (isWorking || isClick) {
            drake.cancel();

            return false;
        }
        else {
            isWorking = true;
            isClick = true;
            isCorrect = false;
            lockScreen(isWorking);

            const answer = el.children[0].getAttribute("src").replace(phonicsWordRoot, "").replace(".png", "");

            isCorrect = checkAnswer(answer);

            if (isCorrect) {
                correctAction();
                $(".js-drop-target > .js-wrapper-ice-cream").prop("onclick", null).off("click");
            }
            else {
                drake.cancel();
                incorrectAction();
                slipIceCream(el.children[0].getAttribute("index"));
            }
        }
    });
}

// 정답 체크
const checkAnswer = strAnswer => {
    return (quizData.CorrectText == strAnswer ? true : false);
}

// 정답 체크 후
const correctAction = () => {
    //console.log('O');
    fillSignboard();
    playEffect1(sndCorrect);
    $(".js-character-dodo").addClass("correct");
    if (correctCount == 0) {
        playJack();
    }
    else if (correctCount == 1) {
        playBlanc();
    }

    setTimeout(() => {
        playWord(true);
    }, 1000);
}

const fillSignboard = () => {
    $(".js-drop-target").eq(correctCount).removeClass("dot");
    $(".js-wrapper-word").children().remove();

    let splitCorrectText = quizData.CorrectText.split(quizData.Question.replace(/_/gi, ""));
    let s1 = "<span>" + splitCorrectText[0] + "</span>";
    let s2 = "<span style ='color:#a50000'>" + quizData.Question.replace(/_/gi, "") + "</span>";
    let s3 = "<span>" + splitCorrectText[1] + "</span>";

    $(".js-wrapper-word").html(s1 + s2 + s3);
}

const incorrectAction = () => {
    //console.log('X');
    playEffect1(sndIncorrectBoing);
    $(".js-character-dodo").addClass("incorrect");
    setTimeout(() => {
        playPronunce();
    }, 1000);
}

const nextQuestion = () => {
    if (isCorrect) {
        setTimeout(() => {
            correctCount++;
            if (correctCount < maxCorrectCount) {
                setTimeout(() => {
                    drake.destroy();
                    quizData = [];
                    exampleArr = [];

                    $(".js-jack").removeClass("correct");
                    $(".js-blanc").removeClass("correct");
                    $(".js-wrapper-example").empty();
                    $(".js-character-dodo").removeClass("correct");
                    $(".js-wrapper-word").empty();

                    setupQuiz();
                }, 1000);
            }
            else {
                $(".js-wrapper-example").empty();
                $(".js-sheila-correct").removeClass("d-none");

                setTimeout(() => {
                    popNext();
                }, 1500);
            }
        }, 1000);
    }
    else {
        setTimeout(() => {
            $(".js-example").removeClass("incorrect click");
            $(".js-wrapper-character").removeClass("d-none");
            $(".js-character-dodo").removeClass("d-none");

            playWord(false);
        }, 1500);
    }
}

const playWord = (pNext) => {
    playSound(quizData.Sound1, function () {
        if (pNext) {
            afterAction();
            nextQuestion();
        }
        else {
            $(".js-character-dodo").removeClass("incorrect");
        }
    });
}

const playPronunce = () => {
    playSound(pronuncePhonics + quizData.Question + ".mp3", function () {
        //isWorking = false; isClick = false; lockScreen(false);
        isWorking = false; isClick = false; // 오답시 lockScreen이 풀리는 버그가 있음.
    });
}

const afterAction = () => {
    if (correctCount == 0) {
        hideJack();
    } else {
        hideBlanc();
    }
}

const playJack = () => {
    $(".js-jack").css("opacity", "1");
    $(".js-jackhand").removeClass("d-none");
    $(".js-jack").addClass("correct");
}

const hideJack = () => {
    $(".js-jack").removeClass("correct");
    setTimeout(() => {
        $(".js-jackhand").addClass("d-none");
        $(".js-jack").addClass("d-none");
    }, 800);
}

const playBlanc = () => {
    $(".js-blanc").css("opacity", "1");
    $(".js-blanchand").removeClass("d-none");
    $(".js-blanc").addClass("correct");
}

const hideBlanc = () => {
    $(".js-blanc").removeClass("correct");
    setTimeout(() => {
        $(".js-blanchand").addClass("d-none");
        $(".js-blanc").addClass("d-none");
    }, 800);
}

const playClick = (pIndex) => {
    playEffect1($(".js-quiz-image").eq(pIndex).attr("word-sound"));
}

const slipIceCream = (pIndex) => {
    if (pIndex == "0") {
        $(".js-wrapper-example > .first").addClass("d-none");
    } else if (pIndex == "1") {
        $(".js-wrapper-example > .second").addClass("d-none");
    } else if (pIndex == "2") {
        $(".js-wrapper-example > .third").addClass("d-none");
    }

    iceCreamIndex = pIndex;

    displaySlip();
}

const displayIceCream = () => {
    $(".js-character-dodo").removeClass("incorrect");
    $(".js-wrapper-example > .js-wrapper-ice-cream").removeClass("d-none");
    $(".js-slip").empty();
}

const displaySlip = () => {
    $(".js-slip").eq(correctCount).empty();
    if (iceCreamIndex == 0) {
        $(".js-slip").removeClass("ice0 ice1 ice2 ice3 ice4 ice5 ice6 ice7");
        $(".js-slip").eq(correctCount).addClass(iceCreamClass0);
        $(".js-slip").eq(correctCount).append(iceCreamImage0);
    } else if (iceCreamIndex == 1) {
        $(".js-slip").removeClass("ice0 ice1 ice2 ice3 ice4 ice5 ice6 ice7");
        $(".js-slip").eq(correctCount).addClass(iceCreamClass1);
        $(".js-slip").eq(correctCount).append(iceCreamImage1);
    } else if (iceCreamIndex == 2) {
        $(".js-slip").removeClass("ice0 ice1 ice2 ice3 ice4 ice5 ice6 ice7");
        $(".js-slip").eq(correctCount).addClass(iceCreamClass2);
        $(".js-slip").eq(correctCount).append(iceCreamImage2);
    }

    $(".js-slip").eq(correctCount).removeClass("d-none");
    $(".js-slip").eq(correctCount).addClass("slipdown");
    $(".js-drop-target").removeClass("dot");
}

const hideSlip = () => {
    $(".js-slip").addClass("d-none");
    displayIceCream();
}

const afterSlip = () => {
    $(".js-drop-target").eq(correctCount).addClass("dot");
    $(".js-wrapper-ice-cream").removeClass("dot");
    hideSlip();
    isWorking = false;
    isClick = false;
    lockScreen(false);
}

const resetAll = pStart => {
    correctCount = 0;
    drake.destroy();
    quizData = [];
    exampleArr = [];

    $(".js-jack").removeClass("correct d-none");
    $(".js-blanc").removeClass("correct d-none");
    $(".js-jack").css("opacity", "0.01");
    $(".js-blanc").css("opacity", "0.01");

    $(".js-sheila-correct").addClass("d-none");
    $(".js-wrapper-example").empty();
    $(".js-character-dodo").removeClass("correct");
    $(".js-wrapper-word").empty();
    $(".js-drop-target").empty();

    setupQuiz();
    playBGM(sndBgmA5A);
    hideNext();
}
