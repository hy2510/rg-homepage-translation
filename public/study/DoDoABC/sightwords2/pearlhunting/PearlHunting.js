let quizDataArr;
let quizIndex = 0;

// 음원
//const audCorrect = `${SIGHT_WORD_EFFECT_ROOT}/aud_correct_a1a.mp3`;
const audCorrect = `${SIGHT_WORD_EFFECT_ROOT}/correct_dodo.mp3`;            // 정답
const audIncorrect = `${SIGHT_WORD_EFFECT_ROOT}/aud_incorrect_a3b.mp3`;     // 오답
const audBubbling = `${SIGHT_WORD_EFFECT_ROOT}/bubbling.mp3`;               // 버블 소리

$(document).ready(() => {
    setWorking(true);
    lockScreen(isWorking);

    gsap.registerPlugin();

    step = 3;
    quizType = "B";
    currentActivity = `A${step}${quizType}`;

    //getStudyStep();

    const imgArr = [
        "./images/img_character_dodo.png",
        "./images/img_character_dodo_incorrect.png",
        "./images/img_character_dodo_swim.png",
        "./images/img_character_dodo_pearl.png",
        "./images/img_character_goma.png",
        "./images/img_character_goma_correct.png",
        "./images/img_character_goma_incorrect.png",
        "./images/img_character_dodo_correct.png",
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
    playBGM(sndBgmA4B);
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
        $(".js-question").append(`<img src='${quizData.Image1}' />`);

        setExample();
    }
    catch (e) {
        alert(`Set Quiz Error: ${e}`);

        doLogout();
    }
}

const setExample = () => {
    let appendHtml = "";

    let shuffleArr = [
        quizData.Example1,
        quizData.Example2,
        quizData.Example3
    ];

    let shellColorArr = ["blue", "pink", "purple"];

    shuffleArr = shuffle(shuffleArr);
    shellColorArr = shuffle(shellColorArr);

    shuffleArr.map((el, i ) => {
        appendHtml += `<div class="example ${shellColorArr[i]}">`;
        appendHtml += ` <p class="txt-example">${el}</p >`;
        appendHtml += ` <img class="pearl" src="./images/img_pearl.png" />`;
        appendHtml += `</div>`;
    })

    $(".js-wrapper-examples").append(appendHtml);

    setTimeout(() => {
        playSound(quizData.Sound1, setClickEvent);
    }, 1000);
}

const setClickEvent = () => {
    $(".txt-example").on("click", function (e) {
        if (isWorking) return false;

        const answer = e.currentTarget.innerText;

        if (answer === quizData.Question) {
            switch ($(this).parent().index()) {
                case 0:
                    $(".example").eq(1).addClass("hide");
                    $(".example").eq(2).addClass("hide");
                    break;
                case 1:
                    $(".example").eq(0).addClass("hide");
                    $(".example").eq(2).addClass("hide");
                    break;
                case 2:
                    $(".example").eq(0).addClass("hide");
                    $(".example").eq(1).addClass("hide");
                    break;
            }

            // 정답을 맞추면 효과음 + 도도 고마 좋아함
            $(".js-wrapper-dodo").addClass("happy");
            $(".js-character-goma").addClass("correct");
            playSound(audCorrect, () => {
                $(".js-wrapper-dodo").removeClass("happy");
                $(".js-character-goma").removeClass("correct");
                playEffect1(quizDataArr[quizIndex].Sound1);
                correctAction($(this).parent().index());
            });
        }
        else {
            $(".js-wrapper-dodo").addClass("incorrect");
            $(".js-character-goma").addClass("incorrect");

            playSound(audIncorrect, incorrectAction);
        }

        setWorking(true);
        lockScreen(isWorking);
    })

    setWorking(false);
    lockScreen(isWorking);
}

const correctAction = correctIndex => {
    // 조개가 열리면 헤엄침
    //$(".example").on("animationend", () => {     // 이 코드로하면 animationend 두번 받음 (css에 open 동작정의 2개)
    $(".example .txt-example").on("animationend", () => {
        $(".js-wrapper-dodo").off("animationend");
        $(".js-wrapper-dodo").addClass("swim");
        playEffect1(audBubbling);
        
        switch (correctIndex) {
            case 0:
                gsap.timeline().to(".js-wrapper-dodo", {
                    duration: 0.9,
                    ease: "none",
                    scale: .8,
                    x: -400,
                    y: -285,
                    onComplete: moveDodo,
                    onCompleteParams: [correctIndex]
                })
                break;

            case 1:
                gsap.timeline().to(".js-wrapper-dodo", {
                    duration: 0.7,
                    ease: "none",
                    scale: .9,
                    x: -125,
                    y: -150,
                    onComplete: moveDodo,
                    onCompleteParams: [correctIndex]
                })
                break;

            case 2:
                gsap.timeline().to(".js-wrapper-dodo", {
                    duration: 0.9,
                    ease: "none",
                    x: -400,
                    y: -10,
                    onComplete: moveDodo,
                    onCompleteParams: [correctIndex]
                })
                break;
        }
    });

    $(".example").eq(correctIndex).addClass("open");
}

const moveDodo = correctIndex => {
    $(".js-wrapper-dodo").addClass("pearl reverse");
    $(".example").eq(correctIndex).addClass("remove");

    let moveDuration = 0;

    switch (correctIndex) {
        case 0:
            moveDuration = 1.3;
            break;

        case 1:
            moveDuration = 1.5;
            break;

        case 2:
            moveDuration = 1.7;
            break;
    }

    gsap.timeline().to(".js-wrapper-dodo", {
        duration: moveDuration,
        ease: "none",
        scale: 0.5,
        x: 280,
        y: -710,
        onComplete: loadNext
    })
}

const loadNext = () => {
    quizIndex++;

    if (quizIndex < quizDataArr.length) {
        $(".js-character-goma").removeClass("correct");
        $(".js-wrapper-examples").empty();
        $(".js-question").empty();
        gsap.set(".js-wrapper-dodo", { clearProps: true });
        $(".js-wrapper-dodo").removeClass("happy swim reverse pearl").attr("style", "");
        setQuizData();
    }
    else {
        popNext();
    }
}

const incorrectAction = () => {
    $(".js-wrapper-dodo").removeClass("incorrect");
    $(".js-character-goma").removeClass("incorrect");

    playQuestion();
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

    gsap.set(".js-wrapper-dodo", { clearProps: true });
    $(".js-wrapper-dodo").removeClass("happy swim reverse pearl").attr("style", "");
    $(".js-character-goma").removeClass("correct");
    $(".js-wrapper-examples").empty();
    $(".js-question").empty();

    setQuizData();
    playBGM(sndBgmA4B);

    hideNext();
}