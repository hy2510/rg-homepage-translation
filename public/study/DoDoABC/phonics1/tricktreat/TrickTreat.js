let quizDataArr;
let exampleArr = [];                        // 보기
let correctCount = 0;
let maxCorrectCount = 0;
let isCorrect = false;

const sndCorrect = effectPhonics + "correct_dodo2.mp3";                   // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectPhonics + "incorrect_dodo3.mp3";    // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
const sndMove = effectPhonics + "move";
const sndGhost = effectPhonics + "ghost3.mp3";                      // (42) ghost (800)
const sndDoor = effectPhonics + "door_opening.mp3";                 // (41) door (800)
const sndCandy = effectPhonics + "candy.mp3";                       // (43) candy (800)

$(document).ready(() => {
    lockScreen(true);
    step = 3;
    quizType = "B";
    currentActivity = "A3B";    // 제일 먼저 세팅해야함.
    focusCurrent(currentActivity);

    const imgArr = [
        "./images/img_door_incorrect.png",
        "./images/img_character_dodo.png",
        "./images/img_character_dodo_walk.png",
        "./images/img_door_correct.png"
    ];

    doPreloadImages(imgArr, loadQuiz);

    // 음원 딜레이 방지
    $("#preload1").attr('src', sndMove + "1.mp3");
    $("#preload2").attr('src', sndMove + "2.mp3");
    $("#preload3").attr('src', sndMove + "3.mp3");
    $("#preload4").attr('src', sndDoor);
    $("#preload5").attr('src', sndCandy);

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
    playBGM(sndBgmA3B);
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

        checkGetDataSuccess();
        checkStudyType();

        isCorrect = false;

        setWord();
        setExample();
        setClickEvent();
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

// 단어 세팅
const setWord = () => {
    $(".js-wrapper-word").html(quizData.CorrectText);
}

// 예제 세팅
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

        exampleArr.map((data) => {
            appendHtml += '<div class="js-example example" onanimationend = "afterDoorOpen()" >';
            appendHtml += '<img src="' + data + '" />';
            appendHtml += '</div >';
        });

        $(".js-wrapper-examples").append(appendHtml);

        setTimeout(() => {
            playWord();
        }, 500);
    }
    catch (e) {
        alert("Set Example Error: " + e);
    }
}

// 클릭 이벤트
const setClickEvent = () => {
    $(".js-example").on("click", () => {
        if (isWorking || isClick) {
            return false;
        }
        else {
            isWorking = true;
            isClick = true;
            lockScreen(isWorking);

            $this = event.currentTarget;
            const index = $(".js-example").index($this);

            let answer = $(".js-example").eq(index).children()[0].getAttribute("src").replace(phonicsWordRoot, "").replace(".png", "");

            $(".js-example").eq(index).addClass("click");

            isCorrect = checkAnswer(answer);

            dodoWalk(index);
        }
    });
}

// 정답 체크 후
const checkAnswer = strAnswer => {
    return (quizData.CorrectText == strAnswer ? true : false);
}

const dodoWalk = index => {
    playEffect1(sndMove + (index + 1) + ".mp3");
    $(".js-wrapper-character").addClass("move" + (index + 1));
    $(".js-character-dodo").addClass("walk");
}

const afterDodoAction = () => {
    let clickIndex = 0;

    $(".js-example").map((index) => {
        if ($(".js-example").eq(index).hasClass("click")) {
            clickIndex = index;
        }
    });

    $(".js-wrapper-character").addClass("d-none");

    $(".js-wrapper-character").removeClass("move1 move2 move3");
    $(".js-character-dodo").removeClass("walk");

    if (isCorrect) {
        $(".js-example").eq(clickIndex).addClass("correct");
        setTimeout(() => {
            playSound(sndDoor, playCorrect);
        }, 1000);
    }
    else {
        $(".js-example").eq(clickIndex).addClass("incorrect");
        setTimeout(() => {
            playSound(sndDoor, playInCorrect);
        }, 1000);
    }
}

const afterDoorOpen = () => {
    if (isCorrect) {
        setTimeout(() => {
            playEffect1(quizData.Sound1);
            $(".js-wrapper-word").addClass("correct");

            correctCount++;
            if (correctCount < maxCorrectCount) {
                setTimeout(() => {
                    quizData = [];
                    exampleArr = [];
                    $(".js-example").removeClass("correct click");
                    $(".js-wrapper-character").removeClass("d-none");
                    $(".js-character-dodo").removeClass("walk");
                    $(".js-wrapper-examples").empty();
                    $(".js-wrapper-word").removeClass("correct");

                    setupQuiz();
                }, 1500);
            }
            else {
                setTimeout(() => {
                    popNext();
                }, 1000);
            }
        }, 1700);
    }
    else {
        setTimeout(() => {
            $(".js-example").removeClass("incorrect click");
            $(".js-wrapper-character").removeClass("d-none");
            $(".js-character-dodo").removeClass("d-none");

            playWord();
        }, 1500);
    }
}

const playCorrect = () => {
    playEffect1(sndCandy);
}

const playInCorrect = () => {
    playEffect1(sndGhost);
}

const playWord = () => {
    playSound(quizData.Sound1, function () { isWorking = false; isClick = false; lockScreen(isWorking); });
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];

    $(".js-example").removeClass("correct click");
    $(".js-wrapper-character").removeClass("d-none");
    $(".js-character-dodo").removeClass("walk");
    $(".js-wrapper-examples").empty();
    $(".js-wrapper-word").removeClass("correct");

    setupQuiz();
    playBGM(sndBgmA3B);
    hideNext();
}
