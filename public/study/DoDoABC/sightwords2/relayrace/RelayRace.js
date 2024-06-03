let quizDataArr;
let quizIndex = 0;

// 음원
const audCorrect = `${SIGHT_WORD_EFFECT_ROOT}/aud_correct_a5b.mp3`;
const audIncorrect = `${SIGHT_WORD_EFFECT_ROOT}/aud_incorrect_a5b.mp3`;
const audDrop = `${SIGHT_WORD_EFFECT_ROOT}/drop1.mp3`;
const audRunning = `${SIGHT_WORD_EFFECT_ROOT}/running2.mp3`;    // 달리기
const audCheers = `${SIGHT_WORD_EFFECT_ROOT}/cheers1.mp3`;      // 달리기 끝나고 치어스

const gapAfterDropSound = 700;      // 통나무 드롭 소리 후 정오 소리 날때까지 시간
const gapCheckAnswer = 500;         // 틀렸을경우 오답 소리 후 락 풀릴때까지 시간
const gapAfterTextComplete = 1500;  // 정답시 효과를 위한 시간 (달리기 전까지)
const gapLoadNext = 1000;           // 달리기 시간(달리기 효과 시간)

let drake;
let answerIndex = 0;

$(document).ready(() => {
    //setWorking(true);
    //lockScreen(isWorking);

    gsap.registerPlugin();

    step = 5;
    quizType = "B";
    currentActivity = `A${step}${quizType}`;

    const imgArr = [
        "./images/img_character_edmond_run.png",
        "./images/img_character_edmond_correct.png",
        "./images/img_character_edmond_baton.png",
        "./images/img_character_dodo_goal.png",
        "./images/img_character_edmond.png",
        "./images/img_character_edmond_incorrect.png",
        "./images/img_character_tori_run.png",
        "./images/img_character_tori_correct.png",
        "./images/img_character_tori_baton.png",
        "./images/img_character_tori.png",
        "./images/img_character_chello_correct.png",
        "./images/img_character_jack_correct.png",
        "./images/img_character_tori_incorrect.png",
        "./images/img_character_jack_run.png",
        "./images/img_character_dodo_run.png",
        "./images/img_character_chello_run.png",
        "./images/img_character_dodo_correct.png",
        "./images/img_character_chello_baton.png",
        "./images/img_character_jack_baton.png",
        "./images/img_character_dodo_baton.png",
        "./images/img_character_jack_incorrect.png",
        "./images/img_character_chello_incorrect.png",
        "./images/img_character_chello.png",
        "./images/img_character_jack.png",
        "./images/img_character_dodo.png",
        "./images/img_log_long.png",
        "./images/img_character_dodo_incorrect.png",
        "./images/img_board.png",
        "./images/img_log_short.png",
    ];

    doPreloadImages(imgArr, loadQuiz);
});

const loadQuiz = () => {
    loadQuizData(step, quizType, setData);
}

// 데이터 할당
const setData = data => {
    quizDataArr = data;

    setQuizData();
    playBGM(sndBgmA5B);
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
    try {
        $(".js-board").append(`<img src='${quizData.Image1}' />`);
        $(".js-characters").removeClass("edmond tori jack chello dodo run baton");

        switch (quizIndex) {
            case 0:
                $(".js-characters.left").addClass("edmond");
                $(".js-characters.right").addClass("tori");
                break;

            case 1:
                $(".js-characters.left").addClass("tori");
                $(".js-characters.right").addClass("jack");
                break;

            case 2:
                $(".js-characters.left").addClass("jack");
                $(".js-characters.right").addClass("chello");
                break;

            case 3:
                $(".js-characters.left").addClass("chello");
                $(".js-characters.right").addClass("dodo");
                break;
        }

        setExample();
    }
    catch (e) {
        alert(`Set Quiz Error: ${e}`);

        doLogout();
    }
}

const setExample = () => {
    let exampleHtml = "";
    let answerHtml = "";
    let upDownArr = ["up", "down"];
    let exampleData = [];

    // 예제 세팅
    upDownArr = shuffle(upDownArr);

    exampleData.push({ "index": 0, "example": quizData.Example1 });
    exampleData.push({ "index": 1, "example": quizData.Example2 });
    exampleData.push({ "index": 2, "example": quizData.Example3 });

    exampleData = shuffle(exampleData);

    // 왼쪽
    exampleHtml += `<div class="wrapper-example left ${upDownArr[0]}">`;
    exampleHtml += exampleData[0].example;
    exampleHtml += `</div>`;

    // 오른쪽
    exampleHtml += `<div class="wrapper-example right ${upDownArr[1]}">`;
    exampleHtml += exampleData[1].example;
    exampleHtml += `</div>`;

    $(".js-wrapper-examples").append(exampleHtml);

    // 답변 세팅
    for (let i = 0; i < 3; i++) {
        if (exampleData[2].index == i) {
            answerHtml += `<div class="wrapper-log checked">`;
            answerHtml += `<div class="wrapper-example">${exampleData[2].example}</div>`;
            answerHtml += `</div>`;
        }
        else {
            answerHtml += `<div class="wrapper-log dot">`;
            answerHtml += ``;
            answerHtml += `</div>`;
        }
    }

    $(".js-wrapper-logs").append(answerHtml);

    setDragEvent();
}

const setDragEvent = () => {
    const exampleContainer = document.querySelector(".wrapper-examples");
    const dropTarget = Array.from(document.querySelectorAll(".wrapper-log"));

    drake = dragula(
        // 하단에 애들끼리만 이동가능.
        [exampleContainer].concat(dropTarget),
        // 옵션
        {
            revertOnSpill: true,            // 드래그한 대상을 바깥에 흘리면 다시 되돌아오도록
            moves: (el, source) => {
                if (isWorking) {
                    drake.cancel();

                    return false;
                }
                else {
                    if (source != exampleContainer) {
                        drake.cancel();

                        return false;
                    }
                    else {
                        return true;
                    }
                }
            },
            accepts: (el, target, source, sibling) => {
                if (target !== exampleContainer) {
                    if (target.classList.contains("selected") || target.classList.contains("checked")) {
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
    )

    drake.on("drop", (el, target, source, sibling) => {
        if (isWorking) {
            return false;
        }

        playSound(audDrop);

        setWorking(true);
        lockScreen(isWorking);

        target.classList.add("selected");
        target.classList.remove("dot");

        let answerCnt = 0;
        let userAnswer = "";

        answerIndex++;

        $(".wrapper-log").map((index, el) => {
            try {
                answerCnt += el.children.length;
                userAnswer += el.children[0].innerHTML + (index < 2 ? " " : "");
            }
            catch (e) {

            }
        })

        setTimeout(() => {
            if (answerCnt == 3) {
                if (userAnswer == quizData.CorrectText) {
                    correctAction();
                }
                else {
                    $(".js-characters").addClass("incorrect");
                    playSound(audIncorrect, incorrectAction);
                }
            }
            else {
                setTimeout(() => {
                    setWorking(false);
                    lockScreen(isWorking);
                }, gapCheckAnswer);
            }
        }, gapAfterDropSound);
    })

    playSound(quizDataArr[quizIndex].Sound1, afterPlayAudio);

    setWorking(false);
    lockScreen(isWorking);
}

const fireDragEvent = () => {
    drake.destroy();
}

const correctAction = () => {
    $(".js-characters").addClass("correct");
    $(".wrapper-log").addClass("hide");
    $(".js-wrapper-logs").append(`<div class="txt-complete">${quizData.CorrectText}</div>`)

    playSound(audCorrect, () => {
        playSound(quizDataArr[quizIndex].Sound1, () => {
            afterTextComplete();
        });
    });
}

const afterTextComplete = () => {
    $(".js-characters").removeClass("correct");
    //$(".txt-complete").html("");
    playEffect1(audRunning);
    $(".js-wrapper-characters").addClass("up");
    $(".js-characters.left").addClass("run");

    // 달리기
    gsap.timeline().to(".js-characters.left", {
        duration: .2,
        ease: "none",
        x: 70,
        y: -40
    }).to(".js-characters.left", {
        duration: 1.8,
        ease: "none",
        x: 1030,
        y: -40
    }).to(".js-characters.left", {
        duration: .1,
        ease: "none",
        x: 1070,
        y: 0,
        onComplete: touchBaton
    }).to(".js-characters.left", {
        duration: .8,
        ease: "none",
        x: 1500,
        y: 0
    })
}

const touchBaton = () => {
    $(".js-characters.right").addClass("baton");

    setTimeout(loadNext, gapLoadNext);
}

const loadNext = () => {
    quizIndex++;
    answerIndex = 0;
    $(".js-wrapper-img").empty();
    $(".js-wrapper-answer").empty();
    $(".js-wrapper-examples").empty();
    $(".js-characters").attr("style", "");

    gsap.set(".js-characters.left", { clearProps: true });

    fireDragEvent();

    if (quizIndex < quizDataArr.length) {
        $(".js-wrapper-characters").removeClass("up");  // 이 위치에 있어야 마지막 도도 피니시 때 도도 발이 통나무 뒤로 가지 않음
        $(".js-wrapper-logs").empty();
        setQuizData();
    }
    else {
        endingCredit();
    }
}

const endingCredit = () => {
    $(".js-characters").removeClass("edmond tori jack chello dodo run baton");
    $(".js-characters.left").addClass("dodo run");
    playEffect1(audRunning);

    // 달리기
    gsap.timeline().to(".js-characters.left", {
        duration: .2,
        ease: "none",
        x: 70,
        y: -30
    }).to(".js-characters.left", {
        duration: 1.8,
        ease: "none",
        x: 1030,
        y: -30
    }).to(".js-characters.left", {
        duration: .25,
        ease: "none",
        x: 1165,
        y: 0,
        onComplete: endRacing
    })
}

const endRacing = () => {
    playEffect1(audCheers);
    $(".js-characters.left").addClass("end");
    $(".js-wrapper-papers").addClass("end");
    $(".js-wrapper-balloons").addClass("end");

    setTimeout(popNext, 1500);
}

const incorrectAction = () => {
    $(".js-characters").removeClass("incorrect");

    setTimeout(() => {
        $(".wrapper-log").removeClass("selected");
        $(".wrapper-log").not(".checked").children().appendTo(".js-wrapper-examples");

        playSound(quizDataArr[quizIndex].Sound1, afterPlayAudio);
    }, 500)
}

const playQuestion = () => {
    setWorking(true);
    lockScreen(isWorking);

    playSound(quizData.Sound1, afterPlayAudio);
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
    answerIndex = 0;
    $(".js-wrapper-img").empty();
    $(".js-wrapper-answer").empty();
    $(".js-wrapper-logs").empty();
    $(".js-wrapper-examples").empty();
    $(".js-wrapper-characters").removeClass("up");
    $(".js-characters").attr("style", "");

    $(".js-wrapper-balloons").removeClass("end");
    $(".js-wrapper-papers").removeClass("end");
    $(".js-characters.left").removeClass("end");

    gsap.set(".js-characters.left", { clearProps: true });

    fireDragEvent();

    setQuizData();
    playBGM(sndBgmA5B);

    hideNext();
}
