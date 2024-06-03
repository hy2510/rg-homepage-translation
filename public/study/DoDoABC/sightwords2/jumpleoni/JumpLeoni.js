let quizDataArr;
let quizIndex = 0;

// 음원
//const audCorrect = `${SIGHT_WORD_EFFECT_ROOT}/aud_correct_a1a.mp3`;
const audCorrect = `${SIGHT_WORD_EFFECT_ROOT}/correct_leoni.mp3`;
const audIncorrect = `${SIGHT_WORD_EFFECT_ROOT}/aud_incorrect_a3a.mp3`;
const audJump = `${SIGHT_WORD_EFFECT_ROOT}/jump1.mp3`;                      // 점프 효과음
const audEnter = `${SIGHT_WORD_EFFECT_ROOT}/object_inserting.mp3`;          // 굴뚝 들어가는 소리
const audWalking = `${SIGHT_WORD_EFFECT_ROOT}/aud_walking_leoni.mp3`;       // 앞으로 걸어가는 소리

$(document).ready(() => {
    setWorking(true);
    lockScreen(isWorking);

    gsap.registerPlugin(MotionPathPlugin);

    step = 3;
    quizType = "A";
    currentActivity = `A${step}${quizType}`;

    //getStudyStep();

    const imgArr = [
        "./images/bg_jump_leoni.png",
        "./images/img_character_leoni_walk.png",
        "./images/img_character_leoni_jump.png",
        "./images/img_character_leoni_incorrect.png",
        "./images/img_character_leoni_correct.png",
        "./images/img_character_leoni.png"
    ];

    doPreloadImages(imgArr, loadQuiz);
});

const loadQuiz = () => {
    loadQuizData(step, quizType, setData);
}

// 데이터 할당
const setData = data => {
    quizDataArr = data;

    gsap.registerPlugin(MotionPathPlugin);
    setQuizData();
    playBGM(sndBgmA3A);
}

// 퀴즈 세팅
const setQuizData = () => {
    try {
        quizData = quizDataArr[quizIndex]; // common.js let quizData 

        // 데이터 체크
        if (quizData == "undefined" || quizData.length < 1)
            throw "No Quiz Data Exception";

        checkGetDataSuccess();
        checkStudyType();
        // 데이터 체크 end

        setQuiz();
    }
    catch (e) {
        alert(`Setup Quiz Error: ${e}`);

        doLogout();
    }
}

const setQuiz = () => {
    $(".js-board").append(`<img src="${quizData.Image1}"/>`)

    let shuffleArr = [
        quizData.Example1,
        quizData.Example2,
        quizData.Example3
    ];

    shuffleArr = shuffle(shuffleArr);

    let appendHtml = "";

    shuffleArr.map(el => {
        appendHtml += `<div class="wrapper-example">`;
        appendHtml += ` <div class="wrapper-txt">`;
        appendHtml += `  <p class="txt-example">${el}</p >`;
        appendHtml += ` </div>`;
        appendHtml += ` <div class="pipe"></div>`;
        appendHtml += `</div>`;
    })

    $(".js-wrapper-examples").append(appendHtml);

    setTimeout(() => {
        playSound(quizData.Sound1, setClickEvent);
    }, 1000);
}

const setClickEvent = () => {
    $(".wrapper-example").on("click", function () {
        if (isWorking) return false;

        setWorking(true);
        lockScreen(isWorking);

        const answer = $(".txt-example").eq($(this).index()).html();

        if (answer === quizData.Question) {
            playSound(audCorrect);
            setTimeout(() => {
                correctAction($(this).index());
            }, 500)
        }
        else {
            $(".js-character-leoni").addClass("incorrect");
            playSound(audIncorrect, incorrectAction);
        }
    })

    setWorking(false);
    lockScreen(isWorking);
}

const correctAction = correctIndex => {
    $(".js-character-leoni").on("animationend", () => {
        event.preventDefault();
        event.stopPropagation();

        $(".js-character-leoni").off("animationend");
        $(".js-wrapper-leoni").on("transitionend", () => {
            event.preventDefault();
            event.stopPropagation();

            $(".js-wrapper-leoni").css("transition", "none");
            $(".js-wrapper-leoni").off("transitionend");
            $(".js-character-leoni").removeClass("walk happy");
           
            $(`.js-character-leoni`).removeClass("happy").addClass(`jump${correctIndex + 1}`);
            playSound(audJump, null);

            const duration = 1 + 0.2 * correctIndex;
            const timeLine = gsap.timeline();

            // 점프 후
            const afterJumpLeoni = () => {
                playSound(audEnter, null);
                const afterHide = () => {
                    $(".js-character-leoni").removeClass(`jump${correctIndex + 1}`);

                    loadNext();
                }

                setTimeout(() => {
                    timeLine.to(".js-wrapper-leoni", {
                        duration: 1.5,
                        ease: "none",
                        y: +280,
                        onComplete: afterHide
                    })
                }, 200)
            }

            // 점프
            timeLine.to(".js-wrapper-leoni", {
                duration: duration,
                ease: "none",
                motionPath: {
                    path: `#path${correctIndex + 1}`,
                    align: `#path${correctIndex + 1}`,
                    alignOrigin: [0.5, 0.97]
                },
                transformOrigin: "50% 97%",
                onComplete: afterJumpLeoni
            });

            $(`.wrapper-txt:eq(${correctIndex})`).addClass("hide");
        })

        $(".js-character-leoni").removeClass("walk");

        playSound(quizData.Sound1, null);

        // 걷기
        $(".js-wrapper-leoni").addClass("walk");
        $(".js-character-leoni").addClass("walk");
        $(`.wrapper-txt:not(:eq(${correctIndex}))`).addClass("hide");
        playEffect1(audWalking);
    })

    // 행복
    $(".js-character-leoni").addClass("happy");
}

const incorrectAction = () => {
    $(".js-character-leoni").removeClass("incorrect");
    playSound(quizData.Sound1, null);

    setTimeout(() => {
        setWorking(false);
        lockScreen(isWorking);
    }, 1500);
}

const loadNext = () => {
    quizIndex++;

    if (quizIndex < quizDataArr.length) {
        $(".js-wrapper-leoni").attr("style", "").removeClass("walk");
        $(".js-board").empty();
        $(".js-wrapper-examples").empty();

        switch (quizIndex) {
            case 1:
                $(".js-bg-jump-leoni").addClass("second");
                break;

            case 2:
                $(".js-bg-jump-leoni").addClass("third");
                break;

            case 3:
                $(".js-bg-jump-leoni").addClass("last");
                break;
        }

        setQuizData();
    }
    else {
        popNext();
    }
}

const playQuestion = () => {
    setWorking(true);
    lockScreen(isWorking);

    playSound(quizDataArr[quizIndex].Sound1, afterPlayAudio);
}

const afterPlayAudio = () => {
    setWorking(false);
    lockScreen(isWorking);
}
// 상태값 변경
const setWorking = state => {
    isWorking = state;
}

const resetAll = pStart => {
    quizIndex = 0;

    $(".js-wrapper-leoni").attr("style", "");
    $(".js-bg-jump-leoni").removeClass("second third last");
    $(".js-wrapper-leoni").removeClass("walk jump1 jump2 jump3 hide");
    $(".js-character-leoni").removeClass("jump");
    $(".js-board").empty();
    $(".js-wrapper-examples").empty();

    setQuizData();
    playBGM(sndBgmA3A);

    hideNext();
}