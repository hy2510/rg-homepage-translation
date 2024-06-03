let quizDataArr;
let correctCount = 0;
let maxCorrectCount = 0;
let exampleArr = [];                        // 보기
let isCorrect = true;
let selectedIdx = 0;

const sndCorrect = effectPhonics + "correct_dodopapa.mp3";                   // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectPhonics + "incorrect_dodo.mp3";    // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
const sndRaining = effectPhonics + "raining.mp3";                   // (43) (2500) 후두두두둑 비오는소리
const sndWalk1 = effectPhonics + "walk1.mp3";
const sndWalk2 = effectPhonics + "walk2.mp3";
const sndWalk3 = effectPhonics + "walk3.mp3";

$(document).ready(() => {
    lockScreen(true);
    step = 3;
    quizType = "A";
    currentActivity = "A3A";    // 제일 먼저 세팅해야함.
        
    focusCurrent(currentActivity);

    const imgArr = [
        "./images/dodo_d.png",
        "./images/dodo_correct.png",
        "./images/dodo_incorrect.png",
        "./images/dodo_walk.png",
        "./images/papa_d.png",
        "./images/papa_correct.png",
        "./images/papa_incorrect.png",
        "./images/cloud.png"
    ];

    doPreloadImages(imgArr, loadQuiz);    

    // 음원 딜레이 방지
    $("#preload1").attr('src', sndWalk1);
    $("#preload2").attr('src', sndWalk2);
    $("#preload3").attr('src', sndWalk3);
    $("#preload4").attr('src', sndRaining);

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
        setClickEvent();
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

        // 우산 색 [[
        let arrUmbrella = ['1', '2', '3'];
        arrUmbrella = shuffle(arrUmbrella);
        $(".umbrella-top").eq(0).css("background", "url(./images/umbrella0" + arrUmbrella[0] + ".png)");
        $(".umbrella-top").eq(1).css("background", "url(./images/umbrella0" + arrUmbrella[1] + ".png)");
        $(".umbrella-top").eq(2).css("background", "url(./images/umbrella0" + arrUmbrella[2] + ".png)");
        $(".umbrella-bottom").eq(0).css("background", "url(./images/umbrella1" + arrUmbrella[0] + ".png)");
        $(".umbrella-bottom").eq(1).css("background", "url(./images/umbrella1" + arrUmbrella[1] + ".png)");
        $(".umbrella-bottom").eq(2).css("background", "url(./images/umbrella1" + arrUmbrella[2] + ".png)");
        // ]]

        exampleArr.push(quizData.Example1);
        exampleArr.push(quizData.Example2);
        exampleArr.push(quizData.Example3);
        exampleArr = shuffle(exampleArr);

        exampleArr.map((data, index) => {
            $(".js-example").eq(index).html(data);
        });

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
    $(".js-umbrella").on("click", () => {
        if (isWorking || isClick) {
            return false;
        }
        else {
            isWorking = true;
            isClick = true;
            lockScreen(true);

            $this = event.currentTarget;
            const index = $(".js-umbrella").index($this);
            const answer = $(".js-example").eq(index).html();

            isCorrect = checkAnswer(answer);
            dodoWalk(index);
        }
    });
}

// 정답 체크
const checkAnswer = strAnswer => {
    return (quizData.CorrectText == strAnswer ? true : false);
}

// 정답 체크 후
const dodoWalk = (pIndex) => {
    $(".js-dodo").addClass("walk");

    if (pIndex == 0) {
        playEffect1(sndWalk3);
        $(".wrapper-cloud").animate({ left: 120 }, 2500);
        $(".js-dodo").animate({ left: 255}, 2400,
            function () {
                $(".js-dodo").removeClass("walk");
                afterWalk(pIndex);
            });
    } else if (pIndex == 1) {
        playEffect1(sndWalk2);
        $(".js-dodo").animate({ left: 586 }, 1400,
            function () {
                $(".js-dodo").removeClass("walk");
                afterWalk(pIndex);
            });
    } else if (pIndex == 2) {
        playEffect1(sndWalk1);
        $(".wrapper-cloud").animate({ left: 755 }, 1000);
        $(".js-dodo").animate({ left: 914 }, 1000,
            function () {
                $(".js-dodo").removeClass("walk");
                afterWalk(pIndex);
            });
    }
}

const afterWalk = (pIndex) => {
    stopEffect();

    if (isCorrect) {
        correctAction(pIndex);
    }
    else {
        incorrectAction(pIndex);
    }
}

const correctAction = (pIdx) => {
    selectedIdx = pIdx;
    $(".js-dodo").addClass("correct");
    playSound(sndCorrect, playCorrectAction);
}

const playCorrectAction = () => {
    playSound(sndRaining, playWord);
    $(".js-question").addClass("bigger");
    $(".js-papa").addClass("correct");
    $(".rain").eq(selectedIdx).removeClass("d-none");
}

const incorrectAction = (pIdx) => {
    selectedIdx = pIdx;

    setTimeout(() => {
        $(".js-dodo").addClass("incorrect");
    }, 1100);

    $(".js-papa").addClass("incorrect");
    //$(".js-dodo").addClass("incorrect");
    $(".rain").eq(selectedIdx).removeClass("d-none");
    playSound(sndIncorrectBoing, playIncorrectAction);
}

const playIncorrectAction = () => {
    playSound(sndRaining, playWord);

    setTimeout(() => {
        $(".puddle").eq(selectedIdx).removeClass("d-none");
    }, 1500);

    //$(".puddle").eq(selectedIdx).removeClass("d-none");
    //$(".rain").eq(selectedIdx).removeClass("d-none");
    $(".umbrella-top").eq(selectedIdx).addClass("incorrect");
}

const afterAction = () => {
    if (isCorrect == true) {
        correctCount++;
        setTimeout(() => {
            if (correctCount < maxCorrectCount) {
                exampleArr = [];
                setInit();
                setupQuiz();
                $(".js-question").removeClass("bigger");
            }
            else {
                setTimeout(() => {
                    popNext();
                });
            }
        }, 1000);
    }
    else {
        setInit();
    }
}

const playWord = () => {
    playSound(quizData.Sound1, function () {
        isWorking = false;
        isClick = false;
        lockScreen(false);
        //$(".js-card-back").html(quizData.CorrectText);
        afterAction();
    });
}

const setInit = () => {
    //
    $(".js-papa").removeClass("correct");
    $(".wrapper-cloud").css("left", "34%");
    $(".wrapper-cloud").css("animation", "wave 18s both infinite");
    $(".js-dodo").css("left", "1105px");
    $(".js-dodo").removeClass("walk correct incorrect");
    $(".js-papa").removeClass("correct incorrect");
    $(".puddle").addClass("d-none");
    $(".rain").addClass("d-none");
    $(".umbrella-top").removeClass("incorrect");
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];
    setInit();
    setupQuiz();
    playBGM(sndBgmA3A);
    hideNext();
}
