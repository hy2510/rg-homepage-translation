let quizDataArr;
let exampleArr = [];                        // 보기
let correctCount = 0;
let maxCorrectCount = 0;
let isCorrect = false;
let drake;

const sndCorrect = effectPhonics + "correct_dodo2.mp3";                   // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectPhonics + "incorrect_dodo2.mp3";    // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
const sndTrainMoving = effectPhonics + "train_moving.mp3";          // (47) (2000) 기차

$(document).ready(() => {
    lockScreen(true);
    step = 4;
    quizType = "A";
    currentActivity = "A4A";    // 제일 먼저 세팅해야함.
    
    focusCurrent(currentActivity);

    const imgArr = [
        "./images/img_train_04.png",
        "./images/img_train_03.png",
        "./images/img_train_02.png",
        "./images/img_train_01.png"
    ];

    doPreloadImages(imgArr, loadQuiz);
    
    // 음원 딜레이 방지
    $("#preload1").attr('src', sndTrainMoving);

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
    //console.log(quizDataArr);
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
        setDragEvent();
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

// 예제 세팅
const setQuestion = () => {
    let appendHtml = "";

    switch (correctCount) {
        case 0:
            appendHtml += "<div class='js-wrapper-question wrapper-question first'>";
            break;

        case 1:
            appendHtml += "<div class='js-wrapper-question wrapper-question second'>";
            break;

        case 2:
            appendHtml += "<div class='js-wrapper-question wrapper-question third'>";
            break;
    }

    appendHtml += "<div id='target" + correctCount + "' class='js-drop-target drop-target dot'></div>";
    appendHtml += "<div class='text-question'>" + "" + "</div>" // 처음에 안보이게
    appendHtml += '<div class="circle"><div class="circle03"></div><div class="circle03"></div></div>';
    appendHtml += "</div>";

    //$(".js-drop-target").eq(correctCount).addClass("dot");
    //$(".js-drop-target").addClass("dot");

    let question = quizData.Question.replace(/_|[0-9]/g, ""); // _, 숫자제거
    $(".js-text-question").html(question);
    $(".js-wrapper-train-inner").prepend(appendHtml);
}

// 보기 세팅
const setExample = () => {
    exampleArr = [];

    exampleArr.push(quizData.Image1);
    exampleArr.push(quizData.Image2);
    exampleArr.push(quizData.Image3);

    exampleArr = shuffle(exampleArr);

    let appendHtml = "";

    exampleArr.map(data => {
        appendHtml += "<div class='js-wrapper-example wrapper-example'>"
        appendHtml += '<img class="img-example" src="' + data + '" onclick="playClick(\'' + data.replace('image', 'sound').replace('png', 'mp3') + '\')"/>';
        appendHtml += "</div>";
    });

    $(".js-wrapper-examples").append(appendHtml);

    setTimeout(() => {
        // again 시 동작하기 위해 timeout 해야함
        $(".js-wrapper-train-inner").addClass("move");
    }, 100);
    
    playSound(sndTrainMoving,
        function () {
            setTimeout(() => {
                playPronunce();

                isWorking = false;
                isClick = false;
                lockScreen(isWorking);

            }, 1000);
    });
}

// 드래그 이벤트
const setDragEvent = () => {
    const exampleContainer = Array.from(document.querySelectorAll('.js-wrapper-example'));
    const dropTarget = document.getElementById('target' + correctCount);

    drake = dragula(
        // 하단에 애들끼리만 이동가능.
        [dropTarget].concat(exampleContainer),
        // 옵션
        {
            revertOnSpill: true,            // 드래그한 대상을 바깥에 흘리면 다시 되돌아오도록
            moves: (el, source) => {
                if (isWorking) {
                    drake.cancel();

                    return false;
                }
                else {
                    if (source.id != "") {
                        drake.cancel();

                        return false;
                    }
                    else {
                        return true;
                    }
                }
            },
            accepts: (el, target) => {
                if (target.id == dropTarget.id) {
                    //console.log(target.childElementCount);
                    if (target.childElementCount > 1) {
                        return false;
                    }
                    else {
                        return true;
                    }
                }
                else {
                    return false;
                }
            }
        }
    );

    drake.on("drag", () => {
        isClick = true;
    });

    // 드롭 이벤트
    drake.on("drop", (el, target) => {
        if (target.id == "") {
            drake.cancel();

            isWorking = false;
        }
        else {
            isWorking = true;

            const answer = el.getAttribute("src").replace(phonics2WordRoot, "").replace(".png", "");

            isCorrect = checkAnswer(answer);

            if (isCorrect) {
                correctAction();
            }
            else {
                incorrectAction();
            }

        }
    });
}

// 기차 함수
const afterOuterTrainMove = () => {
    if (correctCount < maxCorrectCount) {
        setInit();

        setTimeout(() => {
            setupQuiz();
        }, 100);
    }
    else {
        popNext();
    }
}

const afterInnerTrainMove = () => {
    event.stopPropagation();

    $(".circle").addClass("d-none");
}

// 정답 체크
const checkAnswer = strAnswer => {
    return (quizData.CorrectText == strAnswer ? true : false);
}

// 정답 체크 후
const correctAction = () => {

    let question = quizData.Question.replace(/_|[0-9]/g, ""); // _, 숫자제거
    let splitCorrectText = quizData.CorrectText.split(question);
    let s1 = "<span>" + splitCorrectText[0] + "</span>";
    let s2 = "<span style ='color:#a50000'>" + question + "</span>";
    let s3 = "<span>" + splitCorrectText[1] + "</span>";

    if (correctCount == 0) {
        //$(".first .text-question").html(quizData.CorrectText);
        $(".first .text-question").html(s1 + s2 + s3);
    }
    else if (correctCount == 1) {
       // $(".second .text-question").html(quizData.CorrectText);
        $(".second .text-question").html(s1 + s2 + s3);
    }
    else if (correctCount == 2) {
        //$(".third .text-question").html(quizData.CorrectText);
        $(".third .text-question").html(s1 + s2 + s3);
    }
    else {
        //
    }
    
    $(".js-character-dodo").addClass("correct");
    $(".js-drop-target").removeClass("dot");

    playSound(sndCorrect,
        function () {
            playSound(quizData.Sound1,
                function () {
                    correctCount++;
                    playEffect1(sndTrainMoving);
                    $(".js-wrapper-train-outer").addClass("move");
                    $(".circle").removeClass("d-none");
                });
    });
}

const incorrectAction = () => {
    drake.cancel();
    $(".js-character-dodo").addClass("incorrect");
    $("#exampleContainer").eq(0).effect("shake", { times: 3 }, 600);

    playSound(sndIncorrectBoing,
        function () {
            playSound(quizData.Sound1,
                function () {
                    isWorking = false;
                    isClick = false;

                    setTimeout(() => {
                        $(".js-character-dodo").removeClass("incorrect");
                    }, 1000);
            });
    });
}

const playWord = () => {
    playSound(quizData.Sound1, function () { isWorking = false; isClick = false; lockScreen(isWorking); });
}

const playClick = (pIndex) => {
    //alert(pIndex);
    playEffect1(pIndex);
}

const playPronunce = () => {
    playEffect2(pronuncePhonics + quizData.Question + ".mp3");

    //playSound(pronuncePhonics + quizData.Question + ".mp3", function () {
    //    isWorking = false; isClick = false; lockScreen(false);
    //});
}

const setInit = () => {
    $(".js-wrapper-train-outer").removeClass("move");
    $(".js-wrapper-train-inner").removeClass("move");    
    $(".js-character-dodo").removeClass("correct");
    $(".js-wrapper-example").remove();
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];
    setInit();
    $(".js-wrapper-train-inner").children(".first").remove();
    $(".js-wrapper-train-inner").children(".second").remove();
    $(".js-wrapper-train-inner").children(".third").remove();
    setupQuiz();
    playBGM(sndBgmA4A);
    hideNext();
}
