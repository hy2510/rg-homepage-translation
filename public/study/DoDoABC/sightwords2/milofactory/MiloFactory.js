let quizDataArr;
let quizIndex = 0;
let answerIndex = 0;

// 음원
const audCorrect = `${SIGHT_WORD_EFFECT_ROOT}/aud_correct_a5a.mp3`;
const audIncorrect = `${SIGHT_WORD_EFFECT_ROOT}/aud_incorrect_a5a.mp3`;
const audElectricShock = `${SIGHT_WORD_EFFECT_ROOT}/electric.mp3`;      // 감전
const audConveyorBelt = `${SIGHT_WORD_EFFECT_ROOT}/conveyorbelt1.mp3`;  // 컨베이어벨트 (1500 ~ 2000)
const audClick = `${SIGHT_WORD_EFFECT_ROOT}/select.mp3`;                // 클릭
const audTakedown = `${SIGHT_WORD_EFFECT_ROOT}/takedown4.mp3`;          // 로봇 착륙 & 문 열림 & 인형 등장 (3000 ~ 4000)
const audLight = `${SIGHT_WORD_EFFECT_ROOT}/lightning.mp3`;             // 빛 나오는 소리
    
$(document).ready(() => {
    setWorking(true);
    lockScreen(isWorking);

    gsap.registerPlugin();

    step = 5;
    quizType = "A";
    currentActivity = `A${step}${quizType}`;

    //getStudyStep();

    const imgArr = [];

    doPreloadImages(imgArr, loadQuiz);
});

const loadQuiz = () => {
    loadQuizData(step, quizType, setData);
}

// 데이터 할당
const setData = data => {
    quizDataArr = data;

    setQuizData();
    playBGM(sndBgmA4A);
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
        $(".js-wrapper-img").append(`<img src='${quizData.Image1}' />`);

        setExample();
    }
    catch (e) {
        alert(`Set Quiz Error: ${e}`);

        doLogout();
    }
}

const setExample = () => {
    let exampleData = [];

    exampleData.push({ "index": 0, "example": quizData.Example1 });
    exampleData.push({ "index": 1, "example": quizData.Example2 });
    exampleData.push({ "index": 2, "example": quizData.Example3 });

    exampleData = shuffle(exampleData);

    let exampleHtml = "";
    let answerHtml = "";

    switch (exampleData.length) {
        case 2:
            // 문제
            exampleHtml += `<div class="wrapper-example">`;
            exampleHtml += `<p class="txt-example">${exampleData[0].example}</p>`;
            exampleHtml += `</div>`;

            exampleHtml += `<div class="wrapper-example">`;
            exampleHtml += `<p class="txt-example">${exampleData[1].example}</p>`;
            exampleHtml += `</div>`;

            // 벨트
            answerHtml += `<div class='answer'></div>`
            answerHtml += `<div class='answer'></div>`
            answerHtml += `<div class='answer'></div>`

            break;

        case 3:
            // 문제
            exampleHtml += `<div class="wrapper-example">`;
            exampleHtml += `<p class="txt-example">${exampleData[0].example}</p>`;
            exampleHtml += `</div>`;

            exampleHtml += `<div class="wrapper-example">`;
            exampleHtml += `<p class="txt-example">${exampleData[1].example}</p>`;
            exampleHtml += `</div>`;

            // 벨트
            for (let i = 0; i < 3; i++) {
                if (exampleData[2].index == i) {
                    answerHtml += `<div class='answer selected'>${exampleData[2].example}</div>`
                }
                else {
                    answerHtml += `<div class='answer'></div>`
                }
            }

            break;
    }

    $(".js-wrapper-examples").append(exampleHtml);
    $(".js-wrapper-answer").append(answerHtml);

    runFactory();
}

const runFactory = () => {
    playEffect1(audConveyorBelt);
    $(".js-wrapper-rail").on("animationend", () => {
        $(".js-wrapper-rail").off("animationend");
        $(".js-wrapper-rail").removeClass("active");

        playSound(quizData.Sound1, setClickEvent);
    })

    $(".js-wrapper-rail").addClass("active");
    $(".js-road-top").addClass("first");
}

const setClickEvent = () => {
    $(".wrapper-example").off("click");
    $(".wrapper-example").on("click", function (e) {
        if (isWorking) return false;

        $(this).addClass("selected");

        const answer = $(this).children().html();

        if ($(".answer").eq(answerIndex).hasClass("selected")) {
            answerIndex++;
        }

        $(".answer").eq(answerIndex).html(answer);

        answerIndex++;
        playSound(audClick, checkFillExamples);
    })

    setWorking(false);
    lockScreen(isWorking);
}

const fireClickEvent = () => {
    $(".wrapper-example").off("click");
}

const checkFillExamples = () => {
    let answerCnt = 0;

    for (let i = 0; i < quizData.ExampleCount; i++) {
        if ($(".answer").eq(i).html() != "") {
            answerCnt++;
        }
    }

    if (answerCnt == quizData.ExampleCount) {
        setWorking(true);
        lockScreen(isWorking);

        checkCorrect();
    }
}

const checkCorrect = () => {
    let userAnswer = "";

    for (let i = 0; i < quizData.ExampleCount; i++) {
        userAnswer += $(".answer").eq(i).html() + (i != quizData.ExampleCount - 1 ? " " : "");
    }

    if (userAnswer == quizData.CorrectText) {
        correctAction();
    }
    else {
        playSound(audIncorrect, incorrectAction);
    }
}

const correctAction = () => {
    //$(".js-character-milo").on("animationend", () => {
        //$(".txt-complete").off("animationend");
        //$(".js-character-milo").off("animationend");
        //$(".js-character-milo").removeClass("correct");

        //$(".js-road-top").on("animationend", () => {
        //    $(".js-road-top").off("animationend");

        //    $(".js-wrapper-rail").removeClass("active");

        //    $(".js-spotlight").on("animationend", () => {
        //        $(".js-spotlight").off("animationend");
        //        playEffect1(audTakedown);
        //        $(".js-robots").eq(quizIndex).addClass("descent");

        //        gsap.timeline().to($(".js-robots").eq(quizIndex), {
        //            duration: .5,
        //            ease: "ease",
        //            y: 500,
        //            onComplete: openBottom,
        //            onCompleteParams: [quizIndex]
        //        })
        //    });

        //    $(".js-lever").addClass("active");

        //    setTimeout(() => {
        //        playEffect1(audLight);
        //        $(".js-wrapper-robot").addClass("active");
        //    }, 500);
        //})

        //playEffect1(audConveyorBelt);
        //$(".js-wrapper-rail").addClass("active");
        //$(".js-road-top").addClass("second");
    //});

    $(".js-character-milo").addClass("correct");

    playSound(audCorrect, () => {
        playSound(quizData.Sound1, () => {
            $(".txt-complete").off("animationend");
            $(".js-character-milo").off("animationend");
            $(".js-character-milo").removeClass("correct");

            $(".js-road-top").on("animationend", () => {
                $(".js-road-top").off("animationend");

                $(".js-wrapper-rail").removeClass("active");

                $(".js-spotlight").on("animationend", () => {
                    $(".js-spotlight").off("animationend");
                    playEffect1(audTakedown);
                    $(".js-robots").eq(quizIndex).addClass("descent");

                    gsap.timeline().to($(".js-robots").eq(quizIndex), {
                        duration: .5,
                        ease: "ease",
                        y: 510,
                        onComplete: openBottom,
                        onCompleteParams: [quizIndex]
                    })
                });

                $(".js-lever").addClass("active");

                setTimeout(() => {
                    playEffect1(audLight);
                    $(".js-wrapper-robot").addClass("active");
                }, 500);
            })

            playEffect1(audConveyorBelt);

            $(".js-wrapper-rail").addClass("active");
            $(".js-road-top").addClass("second");
        });
    });
    //setTimeout(() => {
    //    $(".js-character-milo").addClass("correct");
    //}, 1500);
    //playEffect1(quizData.Sound1);
    $(".js-wrapper-answer").append(`<div class="txt-complete">${quizData.CorrectText}</div>`);
}

const openBottom = () => {
    $(".js-bottom").on("animationend", () => {
        $(".js-bottom").off("animationend");

        gsap.timeline().to($(".robots").eq(quizIndex), {
            duration: 2.5,
            ease: "none",
            y: 1000,
            onComplete: addItem
        })
    })

    $(".js-bottom").addClass("open");
}

const addItem = () => {
    $(".js-items").eq(quizIndex).on("animationend", () => {
        $(".js-items").eq(quizIndex).off("animationend");

        setTimeout(loadNext, 1000);
    })

    $(".js-wrapper-robot").removeClass("active");
    $(".items").eq(quizIndex).addClass("appear");
}

const incorrectAction = () => {
    $(".js-character-milo").addClass("incorrect");
    playEffect1(audElectricShock);

    setTimeout(() => {
        answerIndex = 0;
        $(".js-character-milo").removeClass("incorrect");
        $(".wrapper-example").removeClass("selected");
        $(".answer").not(".selected").empty();

        playSound(quizData.Sound1, () => {
            setWorking(false);
            lockScreen(isWorking);
        });
    }, 2000)
}

const loadNext = () => {
    quizIndex++;
    answerIndex = 0;

    fireClickEvent();
    $(".js-lever").removeClass("active");
    $(".js-road-top").removeClass("first second");
    $(".js-bottom").removeClass("open");
    $(".js-character-milo").removeClass("correct");
    $(".js-robots").removeClass("descent");
    $(".js-wrapper-img").empty();
    $(".js-wrapper-answer").empty();
    $(".js-wrapper-examples").empty();

    gsap.set(".js-robots", { clearProps: true });

    if (quizIndex < quizDataArr.length) {
        setQuizData();
    }
    else {
        popNext();
    }
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

    $(".js-items").removeClass("appear");

    setQuizData();
    playBGM(sndBgmA4A);

    hideNext();
}