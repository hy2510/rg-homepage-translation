let quizDataArr;
let correctCount = 0;
let maxCorrectCount = 0;
let exampleArr = [];                        // 보기
let isCorrect = false;
let isShaking = false;

const sndCorrect = effectPhonics + "correct_boy.mp3";                       // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectPhonics + "incorrect_boy.mp3";        // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
const sndPaperMoving = effectPhonics + "paper_moving.mp3";

$(document).ready(() => {
    lockScreen(true);
    step = 1;
    quizType = "A";
    currentActivity = "A1A";    // 제일 먼저 세팅해야함.
    focusCurrent(currentActivity);

    const imgArr = [
        "./images/img_character_jack.png",
        "./images/img_character_jack_correct.png",
        "./images/img_character_jack_incorrect.png"
    ];

    doPreloadImages(imgArr, loadQuiz);

    // 음원 딜레이 방지
    $("#preload1").attr('src', sndCorrect);
    $("#preload2").attr('src', sndIncorrectBoing);
    $("#preload3").attr('src', sndPaperMoving);

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
    //console.log("JackVote=" + data);
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

        setImage();
        setWord();
        setExample();
        setClickEvent();
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

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
        $(".js-text-blank").removeClass("d-none");
        $(".js-text-example").html(quizData.Question.replace("_", ""));

        // 보기
        let appendHtml = "";

        exampleArr.map((data, index) => {
            appendHtml += '<div class="js-paper paper" onanimationend = "afterPaperMove()" >';
            /*
            if (data == "b" || data == "d" || data == "f" || data == "h" || data == "k" || data == "l") {
                appendHtml += '<p class="js-text-alphabet text-alphabet lower">' + data + '</p>';
            }
            else {
                appendHtml += '<p class="js-text-alphabet text-alphabet">' + data + '</p>';
            } 
            */
            appendHtml += '<p class="js-text-alphabet text-alphabet">' + data + '</p>';
            appendHtml += '</div >';
        });

        $(".js-wrapper-paper").append(appendHtml);

        exampleArr.map((data, index) => {
            $(".js-text-alphabet").eq(index).addClass("small" + data.toLowerCase());  // 알파벳 위치 보정
        })

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
    $(".js-paper").on("click", () => {
        if (isWorking || isClick) {
            return false;
        }
        else {
            isWorking = true;
            isClick = true;
            lockScreen(isWorking);

            $this = event.currentTarget;
            const index = $(".js-paper").index($this);

            paperMove(index);
        }
    })
}

// 정답 체크
const checkAnswer = strAnswer => {
    return (quizData.Example1 == strAnswer ? true : false);
}

// 정답 체크 후
const paperMove = index => {
    const answer = $(".js-paper").eq(index).children().html();

    isCorrect = checkAnswer(answer);

    if (isCorrect) {
        $(".js-paper").eq(index).addClass("selected");
        playEffect1(sndPaperMoving);
    }
    else {
        $(".js-paper").eq(index).addClass("selected");
        playEffect1(sndPaperMoving);
    }
}

const afterPaperMove = () => {
    if (!isWorking || !isClick) {
        return false;
    }

    if (isCorrect) {
        $(".wrapper-word").children().remove();
        $(".wrapper-word").append("<span class='text-example'>" + quizData.Example1 + "</span><span class='js-text-example text-example correct'>" + quizData.Question.replace('_', '') + "</span>");

        playSound(sndCorrect, function () {
            $(".js-question").addClass("bigger");
            playSound(quizData.Sound1, openPaper);
        });

        $(".js-wrapper-flower").removeClass("d-none");
        $(".js-character").addClass("correct");
    }
    else {
        if (isShaking == true) {
            return;
        }

        isShaking = true;

        $(".js-character").addClass("incorrect");
        $(".js-paper").addClass("shake");
        playSound(sndIncorrectBoing, returnPaper);
    }
}

const returnPaper = () => {
    setTimeout(() => {
        $(".js-paper").removeClass("shake");
        $(".js-paper").removeClass("selected");
        $(".js-character").removeClass("correct incorrect");
        isShaking = false;
        playWord();
    }, 1000);
}

const openPaper = () => {
    if (isCorrect) {
        $(".js-question").removeClass("bigger");

        setTimeout(() => {
            $(".js-text-blank").html("");
            quizData = [];
            exampleArr = [];

            $(".js-wrapper-flower").addClass("d-none");
            $(".js-character").removeClass("correct");

            correctCount++;

            exampleArr.map((data, index) => {
                $(".js-text-alphabet").eq(index).removeClass("small" + data.toLowerCase());  // 알파벳 위치 보정
            })

            if (correctCount < maxCorrectCount) {
                $(".js-wrapper-paper").children().remove();
                setupQuiz();
            }
            else {
                setTimeout(() => {
                    popNext();
                });
            }
        }, 800);
    }
    else {
        returnPaper();
    }
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];

    $(".js-text-blank").removeClass("d-none");
    $(".js-text-blank").html("");
    $(".js-wrapper-flower").addClass("d-none");
    $(".js-character").removeClass("correct");
    $(".js-wrapper-paper").children().remove();

    setupQuiz();
    playBGM(sndBgmA1A);
    hideNext();
}

const setWord = () => {
    $(".wrapper-word").children().remove();
    $(".wrapper-word").removeClass("one two three");
    if (quizData.Example1.length == 1) {
        $(".wrapper-word").append("<span class='js-text-blank text-blank one'></span><span class='js-text-example text-example'>" + quizData.Question + "</span>");
    } else if (quizData.Example1.length == 2) {
        $(".wrapper-word").append("<span class='js-text-blank text-blank two'></span><span class='js-text-example text-example'>" + quizData.Question + "</span>");
    } else {
        $(".wrapper-word").append("<span class='js-text-blank text-blank three'></span><span class='js-text-example text-example'>" + quizData.Question + "</span>");
    }
}

const playWord = () => {
    playSound(quizData.Sound1, function () { isWorking = false; isClick = false; lockScreen(isWorking); });
}

const characterAction = () => {
    return;

    knockCnt++;

    if (knockCnt >= 3) {
        knockCnt = 0;
        $(".js-character").addClass("characteract");
        playSound(sndScreaming, function () { $(".js-character").removeClass("characteract"); });
    }
}
