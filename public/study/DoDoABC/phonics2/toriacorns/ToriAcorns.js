let quizDataArr;
let exampleArr = [];                        // 보기
let correctCount = 0;
let maxCorrectCount = 0;
let isCorrect = false;

let splitCorrectText = "";
let string1 = "";
let string2 = "";
let string3 = "";

const sndCorrect = effectPhonics + "correct_boy.mp3";                   // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectPhonics + "incorrect_boy.mp3";    // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
const sndObjectInserting = effectPhonics + "object_inserting.mp3";  // (28) (1500) 또그르르 들어가는 소리
const sndThump = effectPhonics + "thump.mp3";                       // (24) (1300) 띠옹 땡~ 머리에 도토리 떨어지는 소리

$(document).ready(() => {
    lockScreen(true);
    step = 1;
    quizType = "A";
    currentActivity = "A1A";    // 제일 먼저 세팅해야함.
    
    focusCurrent(currentActivity);

    const imgArr = [
        "./images/img_character_tori_correct.png",
        "./images/img_character_tori_incorrect.png"
    ];

    doPreloadImages(imgArr, loadQuiz);

    // 음원 딜레이 방지
    $("#preload1").attr('src', sndThump);
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
    playBGM(sndBgmA1A);
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
        setWord();

        setClickEvent();
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

// 예제 세팅
const setQuestion = () => {
    $(".js-img-question").attr("src", quizData.Image1);
}

const setExample = () => {
    try {
        exampleArr = [];

        exampleArr.push(quizData.Example1);
        exampleArr.push(quizData.Example2);
        exampleArr.push(quizData.Example3);

        exampleArr = shuffle(exampleArr);

        let appendHtml = "";

        exampleArr.map(data => {
            appendHtml += '<div class="js-acorn acorn swing" onanimationend="afterEnterdBag()">';
            appendHtml += '<p class="js-text-alphabet text-alphabet">' + data + '</p>';
            appendHtml += '</div >';
        });

        $(".js-wrapper-examples").append(appendHtml);

        setTimeout(() => {
            playWord();
        }, 1000);
    }
    catch (e) {
        alert("Set Example Error: " + e);
    }
}

const setWord = () => {
    $(".js-wrapper-word").empty();

    splitCorrectText = quizData.CorrectText.split(quizData.Example1);
    string1 = "<span>" + splitCorrectText[0] + "</span>";
    string3 = "<span>" + splitCorrectText[1] + "</span>";

    if (quizData.Example1.length == 1) {
        string2 = "<span class='js-text-blank text-blank'></span>";
    }
    else if (quizData.Example1.length == 2) {
        string2 = "<span class='js-text-blank text-blank two'></span>";
    }
    else if (quizData.Example1.length == 3) {
        string2 = "<span class='js-text-blank text-blank three'></span>";
    }

    $(".js-wrapper-word").append(string1 + string2 + string3);
}

// 클릭 이벤트
const setClickEvent = () => {
    $(".js-acorn").on("click", () => {
        if (isWorking || isClick) {
            return false;
        }
        else {
            isWorking = true;
            isClick = true;
            lockScreen(isWorking);

            $this = event.currentTarget;
            const index = $(".js-acorn").index($this);

            const answer = $(".js-acorn").eq(index).children().html();

            isCorrect = checkAnswer(answer);

            if (isCorrect) {
                correctAction(index)
            }
            else {
                incorrectAction();
            }
        }
    })
}

// 정답 체크
const checkAnswer = strAnswer => {
    return (quizData.Example1 == strAnswer ? true : false);
}

// 정답 체크 후
const correctAction = index => {
    playSound(sndObjectInserting, () => {
        playEffect1(sndCorrect);
    });

    $(".js-acorn").eq(index).addClass("drop");
}

const afterEnterdBag = () => {
    $(".js-wrapper-character-tori").addClass("correct");
    $(".js-wrapper-word").empty();

    string2 = `<span style="color:#a50000">${quizData.Example1}</span>`;

    $(".js-wrapper-word").append(string1 + string2 + string3);

}

const incorrectAction = () => {    
    playSound(sndThump, () => {
        playEffect1(sndIncorrectBoing);
    });

    shakeAcorns();

    $(".js-wrapper-character-tori").addClass("incorrect");
}

const shakeAcorns = () => {
    $(".js-acorn").addClass("shake");
}

const afterToriAction = () => {
    if (isCorrect) {
        $(".js-img-question").addClass("bigger");
        playSound(quizData.Sound1, function () {
            correctCount++;
            if (correctCount < maxCorrectCount) {
                $(".js-acorn").remove();
                $(".js-wrapper-word").empty();
                $(".js-wrapper-character-tori").removeClass("correct");
                $(".js-img-question").removeClass("bigger");
                $(".js-acorn").off("click");
                setupQuiz();
            }
            else {
                setTimeout(() => {
                    popNext();
                }, 1000);
            }
        });
    }
    else {
        setTimeout(() => {
            $(".js-wrapper-character-tori").removeClass("incorrect");
            $(".js-acorn").removeClass("shake");
            playWord();
        }, 1200)
    }
}

const playWord = () => {
    playSound(quizData.Sound1, function () { isWorking = false; isClick = false; lockScreen(isWorking); });
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];

    $(".js-acorn").remove();
    $(".js-wrapper-word").empty();
    $(".js-wrapper-character-tori").removeClass("correct");
    $(".js-img-question").removeClass("bigger");
    $(".js-acorn").off("click");

    setupQuiz();
    playBGM(sndBgmA1A);
    hideNext();
}

const characterAction = () => {
    return;
    knockCnt++;

    if (knockCnt >= 3) {
        knockCnt = 0;
        $(".character-tori").addClass("characteract");
        $(".character-tori").removeClass("characteract");
    }
}
