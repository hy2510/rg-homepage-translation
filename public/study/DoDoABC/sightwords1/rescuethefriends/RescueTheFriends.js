let quizDataArr;
let exampleArr = [];                        // 보기
let correctCount = 0;
let maxCorrectCount = 0;
let wordType = "sight";
let crntIndex = -1;
let prePos = -1;
let crntPos = -1;

const sndButtonPush = effectSightWords + "button_push.mp3";                 // (21) (600) 띠옹~ 선택하는 소리
const sndLaser = effectSightWords + "laser1.mp3";                           // (49) (1200) 지이잉~ 레이저총 소리
const sndBronekLaser = effectSightWords + "broken_laser.mp3";                // ( ) (1200) 띠이잉~ 고장난 레이저총 소리
const sndWhoosh3 = effectSightWords + "whoosh5.mp3";                        // (12) (1200) 휘이익~ 물체 날아가는 소리
const sndCastingSpell = effectSightWords + "casting_spell.mp3"              // (09) (2500) 띠리리링~ 성공 소리

$(document).ready(() => {
    lockScreen(true);
    step = 3;
    quizType = "B";
    currentActivity = "A3B";    // 제일 먼저 세팅해야함.

    
    focusCurrent(currentActivity);

    const imgArr = [
        "./images/img_character_edmon.png",
        "./images/img_character_leoni.png",
        "./images/img_character_leoni_correct.png",
        "./images/img_character_leoni_incorrect.png",
        "./images/img_character_leoni_shoot.png",
        "./images/img_loop.png",
        "./images/img_loop_edmon.png",
        "./images/img_loop_edmon_.png",
        "./images/img_loop_edmon_correct.png",
        "./images/img_loop_edmon_correct.png",
        "./images/img_loop_edmon_escape.png",
        "./images/img_loop_edmon_incorrect.png",
        "./images/img_beam.png"
    ];

    doPreloadImages(imgArr, loadQuiz);

    // 음원 딜레이 방지
    $("#preload1").attr('src', sndLaser);
    $("#preload2").attr('src', sndWhoosh3);
    $("#preload3").attr('src', sndCastingSpell);
    $("#preload3").attr('src', sndButtonPush);
    $("#preload4").attr('src', sndBronekLaser);

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
    playBGM(sndBgmA4B);
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
        //console.log(quizData);

        checkGetDataSuccess();
        checkStudyType();

        isCorrect = false;

        setQuestion();
        setExample();
        setClickEvent();
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

// 문제 세팅
const setQuestion = () => {
    try {
        if (quizData.Image1 == null || quizData.Image1 == undefined) {
            throw "No Question Data";
        }

        $(".js-wrapper-question").append("<img src='" + quizData.Image1 + "'/>");
    }
    catch (e) {
        alert("Set Example Error: " + e);

        doLogout();
    }
}

// 보기 세팅
const setExample = () => {
    try {
        if (quizData.length < 1) {
            throw "No Example Data";
        }

        exampleArr = [];

        exampleArr.push(quizData.Example1);
        exampleArr.push(quizData.Example2);
        exampleArr.push(quizData.Example3);

        exampleArr = shuffle(exampleArr);

        let appendHtml = "";

        exampleArr.map(data => {

            let fontSize = "4.2rem";
            // 기본 폰트크기 4.2 rem, 글자 길이에 따른 가변 크기
            if (data.length >= 10) { fontSize = "3.2rem" }
            else if (data.length >= 8) {fontSize = "3.4rem"}

            appendHtml += `<div class='js-wrapper-example wrapper-example' style ='font-size:${fontSize}'>${data}</div>`
        });

        $(".js-wrapper-examples").append(appendHtml);

        setTimeout(() => {
            playQuestion();
        }, 1000);
    }
    catch (e) {
        alert("Set Example Error: " + e);

        doLogout();
    }
}

// 클릭 이벤트
const setClickEvent = () => {
    $(".js-wrapper-example").on("click", e => {
        if (isWorking || isClick) {
            return false;
        }
        else {
            isWorking = true;
            isClick = true;

            crntIndex = $(".js-wrapper-example").index(e.currentTarget);
            $(".js-wrapper-example").eq(crntIndex).addClass("green");

            lockScreen(isWorking);

            playSound(sndButtonPush,
                function () {
                    afterButtonPush();
                });

            //정답 체크
            const checkAnswer = () => {
                const answer = e.currentTarget.outerText;
                return (quizData.CorrectText == answer ? true : false);
            }

            const shootBeam = () => {
                playEffect1(sndLaser);
                $(".js-character-leoni").addClass("shoot");
            }

            const unexplodedBeam = () => {
                playEffect1(sndBronekLaser);
                $(".js-wrapper-examples").effect("shake", { times: 4 }, 1000);
                $(".js-character-leoni").addClass("incorrect");
                $(".js-wrapper-monster").addClass("incorrect");
                // incorrect animation 3s 에 맞춤
                setTimeout(() => {
                    $(".js-wrapper-example").eq(crntIndex).removeClass("green");
                }, 3000);
            }

            const afterButtonPush = () => {
                isCorrect = checkAnswer();

                isCorrect = checkAnswer();

                if (isCorrect) {
                    shootBeam();
                }
                else {
                    unexplodedBeam();
                }
            }
        }
    })
}

const fireClickEvent = () => {
    $(".js-wrapper-example").off("click");
}

const afterShootBeam = () => {
    playEffect1(sndCastingSpell);
    $(".js-character-leoni").removeClass("shoot").addClass("correct");
    $(".js-wrapper-monster").addClass("correct");
}

const afterEscape = () => {
    // 이벤트버블링(부모에게로 이벤트 전이) 막기
    event.stopPropagation();
}

const afterRunMonster = () => {
    $(".js-character-leoni").removeClass("incorrect");
    $(".js-wrapper-monster").removeClass("incorrect");

    if (isCorrect == true) {
        correctCount++;

        if (correctCount < maxCorrectCount) {

            // 정답시 글자를 확대해보이는 애니메이션
            if ($('.js-wrapper-example').eq(crntIndex)[0].innerText.length >= 10) {
                $('.js-wrapper-example').eq(crntIndex).addClass("smallzoom");
            } else if ($('.js-wrapper-example').eq(crntIndex)[0].innerText.length >= 8) {
                $('.js-wrapper-example').eq(crntIndex).addClass("middlezoom");
            } else {
                $('.js-wrapper-example').eq(crntIndex).addClass("bigzoom");
            }

            playSound(quizData.Sound1,
                function () {
                    setTimeout(() => {
                        $(".js-character-leoni").removeClass("correct incorrect");
                        $(".js-wrapper-monster").removeClass("correct incorrect");
                        $(".js-wrapper-example").remove();
                        $(".js-wrapper-question").children().remove();

                        fireClickEvent();
                        setupQuiz();
                    }, 1000);
                });
        }
        else {
            setTimeout(() => {
                popNext();
            }, 1000);
        }
    }
    else {
        playQuestion();
    }
}

const playQuestion = () => {
    playSound(quizData.Sound1, function () { isWorking = false; isClick = false; lockScreen(isWorking); });
}

const setInit = () => {
    let crntIndex = -1;
    prePos = -1;
    crntPos = -1;

    $('.js-wrapper-example').removeClass("bigzoom");
    $('.js-wrapper-example').removeClass("middlezoom");
    $('.js-wrapper-example').removeClass("smallzoom");
    $(".js-character-leoni").removeClass("correct incorrect");
    $(".js-wrapper-monster").removeClass("correct incorrect");
    $(".js-wrapper-example").remove();
    $(".js-wrapper-question").children().remove();

    fireClickEvent();
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];
    setInit();
    setupQuiz();
    playBGM(sndBgmA4B);
    hideNext();
}
