let quizDataArr;
let correctCount = 0;
let maxCorrectCount = 0;
let exampleArr = [];                        // 보기
let isCorrect = false;
let isShaking = false;

const sndCorrect = effectPhonics + "correct_boy.mp3";                   // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectPhonics + "incorrect_boy.mp3";    // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
const sndSelect = effectPhonics + "select_pumpkin.mp3";
const sndFlameBubbling = effectPhonics + "flamebubbling.mp3"

$(document).ready(() => {
    lockScreen(true);
    step = 1;
    quizType = "B";
    currentActivity = "A1B";    // 제일 먼저 세팅해야함.
    focusCurrent(currentActivity);

    const imgArr = [
        "./images/img_character_jack_correct.png",
        "./images/img_character_jack_correct.png",
        "./images/soup.png"
    ];

    doPreloadImages(imgArr, loadQuiz);

    // 음원 딜레이 방지
    $("#preload1").attr('src', sndCorrect);
    $("#preload2").attr('src', sndIncorrectBoing);
    //$("#preload3").attr('src', sndFlaming);
    $("#preload4").attr('src', sndFlameBubbling);

    // 유저가 staff or review 일 때 메뉴에서 현재 학습 강조.
    $("." + currentActivity).addClass("on");
});

const loadQuiz = () => {
    loadQuizData(step, quizType, setData);
}

const setData = data => {
    // 비지니스 로직
    // 1. 퀴즈 데이터 담기
    quizDataArr = data;
    maxCorrectCount = quizDataArr.length;
    setupQuiz();
    playBGM(sndBgmA1B);
}

// 퀴즈 세팅 시작
const setupQuiz = () => {
    isClick = true;
    isWorking = true;
    lockScreen(true);

    $(".js-text-blank").html("");

    // 2. 퀴즈 데이터 세팅
    // 퀴즈 타입이 알파벳인지 아닌지 판별
    try {
        quizData = quizDataArr[correctCount];

        checkGetDataSuccess();
        checkStudyType();

        isCorrect = false;

        setImage();
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
    $(".js-question").attr("src", quizData.Image1);
}

// 보기 세팅
const setExample = () => {
    try {
        if (quizData.length < 1) {
            throw "No Example Data";
        }

        $(".wrapper-word").children().remove();
        $(".wrapper-word").append("<span class='js-text-blank text-blank one'></span><span class='js-text-example text-example'>" + quizData.Question.replace('_', '') + "</span>");

        exampleArr.push(quizData.Example1);
        exampleArr.push(quizData.Example2);
        exampleArr.push(quizData.Example3);

        exampleArr = shuffle(exampleArr);
        $(".js-wrapper-word").removeClass("d-none");
        $(".js-question-image").attr("src", quizData.Image1);

        // 박스 [[]]
        $(".js-text-blank").removeClass("one two three");
        if (quizData.Example1.length == 1) {
            $(".js-text-blank").addClass("one");
        } else if (quizData.Example1.length == 2) {
            $(".js-text-blank").addClass("two");
        } else {
            $(".js-text-blank").addClass("three");
        }

        $(".js-text-blank").removeClass("d-none");
        $(".js-text-example").html(quizData.Question.replace("_", ""));
        //console.log(quizData.Image1);
        // ]]

        // 보기
        let appendHtml = "";

        exampleArr.map((data, index) => {
            appendHtml += '<div class="js-pumpkin pumpkin" onanimationend = "afterAddPumpkin()" >';
            appendHtml += '<img class="js-pumpkin-img pumpkin-img" src="./images/img_pumpkin.png" />';
            if (data == "b" || data == "d" || data == "f" || data == "h" || data == "k" || data == "l") {
                appendHtml += '<p class="js-text-alphabet text-alphabet lower">' + data + '</p>';
            }
            else {
                appendHtml += '<p class="js-text-alphabet text-alphabet">' + data + '</p>';
            }
            appendHtml += '</div >';
        });

        $(".js-wrapper-example").append(appendHtml);

        setTimeout(() => {
            playSound(quizData.Sound1, function () {
                isWorking = false; isClick = false; lockScreen(false);
            });
        }, 1000);
    }
    catch (e) {
        alert("Set Example Error: " + e);
    }
}

// 클릭 이벤트
const setClickEvent = () => {
    $(".js-pumpkin").on("click", () => {
        if (isWorking || isClick) {
            return false;
        }
        else {
            isWorking = true;
            isClick = true;
            lockScreen(true);

            playEffect1(sndSelect);

            $this = event.currentTarget;
            const index = $(".js-pumpkin").index($this);

            const answer = $(".js-pumpkin").eq(index).children("p").html();

            isCorrect = checkAnswer(answer);

            addPumpkin(index);
        }
    });
}

// 정답 체크
const checkAnswer = strAnswer => {
    return (quizData.Example1 == strAnswer ? true : false);
}

// 정답 체크 후
const addPumpkin = index => {
    if (isCorrect) {
        $(".js-pumpkin").eq(index).addClass("correct");
    }
    else {
        $(".js-pumpkin").eq(index).addClass("incorrect");
    }
}

const afterAddPumpkin = () => {
    if (isCorrect) {
        afterCorrectAction();
    }
    else {
        afterIncorrectAction();
    }
}

const afterCorrectAction = () => {
    $(".js-jack").addClass("correct");
    $(".js-soup").addClass("soup02");

    $(".js-text-blank").addClass("d-none");
    $(".js-text-example").html(quizData.CorrectText);

    $(".wrapper-word").children().remove();
    $(".wrapper-word").append("<span class='text-example'>" + quizData.Example1 + "</span><span class='js-text-example text-example correct'>" + quizData.Question.replace('_', '') + "</span>");


    playEffect2(sndCorrect);

    setTimeout(() => {
        playEffect1(quizData.Sound1);
    }, 500)

    $(".js-question-image").addClass("bigger");

    playSound(sndFlameBubbling, function () {
        $(".js-text-blank").html(quizData.CorrectText);

        $(".js-text-blank").html("");
    });
}

const afterIncorrectAction = () => {
    if (isShaking == true) {
        return;
    }

    isShaking = true;

    $(".js-jack").addClass("incorrect");
    $(".js-pumpkin").addClass("shake");
    playSound(sndIncorrectBoing, function () { $(".js-pumpkin").removeClass("shake"); isShaking = false; });
}

const afterAction = () => {
    if (isCorrect) {
        setTimeout(() => {
            correctCount++;

            if (correctCount < maxCorrectCount) {
                setTimeout(() => {
                    exampleArr = [];
                    $(".js-jack").removeClass("correct");
                    $(".js-soup").removeClass("soup");
                    $(".js-soup").removeClass("soup02");
                    $(".js-pumpkin").remove();
                    $(".js-question-image").removeClass("bigger");

                    setupQuiz();
                }, 500);
            }
            else {
                setTimeout(() => {
                    popNext();
                }, 500);
            }
        }, 500);
    }
    else {
        setTimeout(() => {
            $(".js-jack").removeClass("incorrect");
            $(".js-pumpkin").removeClass("incorrect");

            isClick = false;
            isWorking = false;
            playSound(quizData.Sound1, function () { isWorking = false; isClick = false; lockScreen(false); });
        }, 500);
    }
}

const afterFire = () => {
    $(".js-soup").removeClass("soup02");
    $(".js-soup").addClass("soup");
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];

    $(".js-text-blank").removeClass("d-none");
    $(".js-jack").removeClass("correct");
    $(".js-soup").removeClass("soup");
    $(".js-soup").removeClass("soup02");
    $(".js-pumpkin").remove();
    $(".js-question-image").removeClass("bigger");

    setupQuiz();
    playBGM(sndBgmA1A);
    hideNext();
}

const characterAction = () => {
    return;
    knockCnt++;

    if (knockCnt >= 3) {
        knockCnt = 0;
        $(".js-jack").addClass("characteract");
        $(".js-jack").removeClass("characteract");
    }
}