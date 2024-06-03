let quizDataArr;
let exampleArr = [];                        // 보기
let correctCount = 0;
let maxCorrectCount = 0;
let wordType = "sight";
let crntIndex = -1;
let prePos = -1;
let crntPos = -1;

const sndCorrect = effectSightWords + "correct_leoni.mp3";   
const sndIncorrectBoing = effectSightWords + "incorrect_boing_leoni.mp3";         // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
const sndButtonPush = effectSightWords + "button_push.mp3";                 // (21) (600) 띠옹~ 선택하는 소리
const sndWhoosh3 = effectSightWords + "whoosh4.mp3";                        // (12) (1200) 휘이익~ 물체 날아가는 소리
const sndCastingSpell = effectSightWords + "casting_spell.mp3"              // (09) (2500) 띠리리링~ 마술봉 반짝이는 소리

$(document).ready(() => {
    lockScreen(true);
    step = 3;
    quizType = "A";
    currentActivity = "A3A";    // 제일 먼저 세팅해야함.

    
    focusCurrent(currentActivity);

    const imgArr = [
        "./images/img_character_edmon.png",
        "./images/img_character_gino.png",
        "./images/img_character_goma.png",
        "./images/img_character_leoni.png",
        "./images/img_character_leoni_correct.png",
        "./images/img_character_leoni_incorrect.png",
        "./images/img_character_leoni_planet.png",
        "./images/img_planet.png",
        "./images/img_stone.png"
    ];

    doPreloadImages(imgArr, loadQuiz);
    
    // 음원 딜레이 방지
    $("#preload1").attr('src', sndButtonPush);
    $("#preload2").attr('src', sndWhoosh3);

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

        exampleArr.map((data, index) => {
            if (data.length >= 8) {
                appendHtml += "<div class='js-wrapper-example wrapper-example long'>" + data + "</div>";
            }
            else {
                appendHtml += "<div class='js-wrapper-example wrapper-example'>" + data + "</div>";
            }

            if (exampleArr[index] == quizData.CorrectText) {
                crntPos = index;
            }
        });

        if (prePos == crntPos) {
            setExample();
            return;
        } else {
            prePos = crntPos;
        }

        $(".js-wrapper-examples").empty();
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
                return (quizData.Question == answer ? true : false);
            }

            const approachHome = () => {
                playEffect1(sndWhoosh3);
                playEffect2(sndCorrect);
                correctCount++;
                $(".js-wrapper-planets").children(".planet" + correctCount).removeClass("d-none");
                $(".js-planet").not(".planet" + correctCount).addClass("d-none");
            }

            const leoniCrying = () => {
                playEffect1(sndIncorrectBoing);
                $(".js-wrapper-examples").effect("shake", { times: 4 }, 1000);
                setTimeout(() => {
                    $(".js-character-leoni").removeClass("incorrect");
                    playQuestion();
                    $(".js-wrapper-example").eq(crntIndex).removeClass("green");
                }, 2000);
            }

            const afterButtonPush = () => {
                isCorrect = checkAnswer();

                if (isCorrect) {
                    $(".js-character-leoni").addClass("correct");
                    approachHome();
                }
                else {
                    $(".js-character-leoni").addClass("incorrect");
                    leoniCrying();
                }
            }
        }
    });
}

const afterApproach = () => {
    $(".js-character-leoni").removeClass("correct");

    switch (correctCount) {
        case 1:
        case 2:
        case 3:
            $('.js-wrapper-example').eq(crntIndex).addClass("bigger");
            playSound(quizData.Sound1,
                function () {
                    $(".js-wrapper-example").remove();
                    $(".js-wrapper-question").children().remove();
                    setupQuiz();
            });
            break;

        case 4:
            $('.js-wrapper-example').eq(crntIndex).addClass("bigger");
            correctCount++; // "move" 후에 afterApproach() 또 호출되어 단어 읽어주는것 방지

            playSound(quizData.Sound1,
                function () {
                    $(".js-wrapper-character").addClass("move");
                });
            break;
    }
}

const afterGoingHome = () => {
    playEffect1(sndCastingSpell);
    $(".js-characters").removeClass("d-none");

    const endActivity = () => {
        setTimeout(() => {
            popNext();
        }, 1000);
    }

    setTimeout(() => {
        endActivity();
    }, 3000);
}

const playQuestion = () => {
    playSound(quizData.Sound1, function () { isWorking = false; isClick = false; lockScreen(isWorking); });
}

const setInit = () => {
    prePos = -1;
    crntPos = -1;
    
    $(".js-wrapper-character").removeClass("move");
    $(".js-wrapper-question").empty();
    $(".js-character-leoni").removeClass("move correct incorrect");
    $(".js-planet").addClass("d-none");
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];
    setInit();
    setupQuiz();
    playBGM(sndBgmA4A);
    hideNext();
}
