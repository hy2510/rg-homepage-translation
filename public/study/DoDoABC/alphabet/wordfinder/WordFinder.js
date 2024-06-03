let correctCount = 0;
let maxCorrectCount = 3;
let exampleArr = [];                        // 보기
let answerArr = [];
let drake;
let isCorrect;

// sound effect 
let sndCorrect = effectAlphabet + "correct_1.mp3";                    // (07) (800 ~ 1000) 맞췄을 때 나는 소리
let sndIncorrectBoing = effectAlphabet + "incorrect_boy.mp3";     // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
let sndObjectInserting = effectAlphabet + "object_inserting.mp3";   // (  ) (800 ~ 1000) 또그그르릉~ 회전하면서 들어가는 소리

$(document).ready(() => {
    lockScreen(true);
    currentActivity = 'A5B';
    step = 5;
    quizType = "B";
    focusCurrent(currentActivity);

    const imgArr = [
        "./images/img_character_baro_correct.png",
        "./images/img_character_baro_incorrect.png"
    ];

    doPreloadImages(imgArr, loadQuiz);

    // 음원 딜레이 방지
    $("#preload1").attr('src', sndObjectInserting);

    // 유저가 staff or review 일 때 메뉴에서 현재 학습 강조.
    $("." + currentActivity).addClass("on");
});

const loadQuiz = () => {
    loadQuizData(step, quizType, setData);
}

const setData = (data) => {
    // 비지니스 로직
    // 1. 퀴즈 데이터 담기.
    quizData = data[0];

    // 2. 퀴즈 데이터 세팅
    // 퀴즈 타입이 알파벳인지 아닌지 판별
    try {
        checkGetDataSuccess();
        checkStudyType();

        $(".js-text-alphabet").html(quizData.Question);

        setupQuiz();
        playBGM(sndBgmA5B);
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

// 퀴즈 세팅 시작
const setupQuiz = () => {
    setExample();
    setClickEvent();

    isClick = true;
    isWorking = true;
    lockScreen(isWorking);
}

// 보기 세팅
const setExample = () => {
    try {
        if (quizData.length < 1) {
            throw "No Example Data";
        }

        answerArr = quizData.CorrectText.split("|");

        let exampleNumArr = [0, 1, 2, 3, 4];
        exampleNumArr = shuffle(exampleNumArr);

        switch (correctCount) {
            case 0:
                exampleArr = quizData.Example1.split("|");
                break;

            case 1:
                exampleArr = quizData.Example2.split("|");
                break;

            case 2:
                exampleArr = quizData.Example3.split("|");
                break;
        }

        exampleArr.push(answerArr[correctCount]);

        exampleArr.map((data, index) => {
            let appendHTML = '<img class="js-example example example' + exampleNumArr[index] + '" src="' + (alphabetWordRoot + data) + '.png" />';

            $(".js-wrapper-example").append(appendHTML);
        });

        setTimeout(() => {
            playSound(letterWord + answerArr[correctCount] + ".mp3", function () { isWorking = false; isClick = false; lockScreen(isWorking); });
        }, 1000);
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
            const answer = $(".js-example").eq(index).attr("src").replace(alphabetWordRoot, "").replace(".png", "");

            isCorrect = checkAnswer(answer);

            if (isCorrect) {
                correctAction(index);
            }
            else {
                incorrectAction(index);
            }
        }
    })
}

// 정답 체크
const checkAnswer = strAnswer => {
    return (answerArr[correctCount] == strAnswer ? true : false);
}

// 정답 체크 후
const correctAction = index => {
    playEffect1(sndCorrect);
    correctBaroAction();
    setTimeout(() => {
        playEffect1(sndObjectInserting);
    }, 2600);
    $(".js-example").eq(index).addClass("correct" + (correctCount + 1));

}

const correctBaroAction = () => {
    $(".js-baro").addClass("correct");
}

const incorrectAction = index => {
    playEffect1(sndIncorrectBoing);
    incorrectBaroAction();
    $(".js-example").eq(index).effect("shake", { times: 4 }, 1000);
}

const incorrectBaroAction = () => {
    $(".js-baro").addClass("incorrect");
}

const afterBaroAction = () => {
    $(".js-baro").removeClass("correct incorrect");

    if (isCorrect) {
        const appendHtml = "<img src='" + (alphabetWordRoot + answerArr[correctCount]) + ".png' />"

        $(".drop-target").eq(correctCount).append(appendHtml);
        $(".js-wrapper-example").children().remove();
        correctCount++;

        if (correctCount < maxCorrectCount) {
            isCorrect = false;

            setupQuiz();
        }
        else {
            popNext();
        }
    }
    else {
        playSound(letterWord + answerArr[correctCount] + ".mp3", function () { isWorking = false; isClick = false; lockScreen(isWorking); });
    }
}

// 초기화
const resetAll = (pStart) => {
    if (pStart == true) {
    }

    correctCount = 0;
    isWorking = true;
    isClick = true;
    lockScreen(isWorking);

    $(".drop-target").empty();

    setupQuiz();
    hideNext();
}

const playQuestion = () => {
    playSound(letterWord + answerArr[correctCount] + ".mp3", function () { isWorking = false; isClick = false; lockScreen(isWorking); });
}