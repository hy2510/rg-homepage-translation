let quizDataArr;
let quizIndex = 0;

// 음원
const audCorrect = `${SIGHT_WORD_EFFECT_ROOT}/aud_correct_a4a.mp3`;
const audIncorrect = `${SIGHT_WORD_EFFECT_ROOT}/aud_incorrect_a4a.mp3`;

$(document).ready(() => {
    setWorking(true);
    lockScreen(isWorking);

    step = 4;
    quizType = "A";
    currentActivity = `A${step}${quizType}`;

    loadQuiz();
})

const loadQuiz = () => {
    loadQuizData(step, quizType, setData);
}


// 데이터 할당
const setData = data => {
    quizDataArr = data;

    let imgArr = ["./images/img_character_blanc_correct.png"];

    quizDataArr.map(el => {
        imgArr.push(el.Image1);
        imgArr.push(el.Image2);
    })

    playBGM(sndBgmA4A);
    doPreloadImages(imgArr, setQuizData);
}

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
    $(".js-question").html(quizData.Question);

    const shuffle = Math.floor(Math.random() * 2);

    let appendHtml = "";

    if (shuffle) {
        appendHtml += `<img class="img-examples" src="${quizData.Image2}"/>`;
        appendHtml += `<img class="img-examples" src="${quizData.Image1}"/>`;
    }
    else {
        appendHtml += `<img class="img-examples" src="${quizData.Image1}"/>`;
        appendHtml += `<img class="img-examples" src="${quizData.Image2}"/>`;
    }

    $(".js-wrapper-imgs").append(appendHtml);

    playSound(quizData.Sound1, setClickEvent);
}

const setClickEvent = () => {
    $(".img-examples").off("click");
    $(".img-examples").on("click", function () {
        if (isWorking) return false;

        setWorking(true);
        lockScreen(isWorking);

        $(".img-examples").eq($(this).index()).addClass("selected");

        if ($(this)[0].src == quizData.Image1) {
            playSound(audCorrect, correctAction($(this).index()));
        }
        else {
            incorrectAction();
        }
    })

    setWorking(false);
    lockScreen(isWorking);
}

const correctAction = correctIndex => {
    const incorrectIndex = Math.abs(1 - correctIndex);

    $(".img-examples").eq(correctIndex).on("transitionend", () => {
        $(".img-examples").eq(correctIndex).off("transitionend");

        playSound(quizData.Sound1, function () {
            setTimeout(loadNext, 1500);
        });
    })

    $(".img-examples").eq(incorrectIndex).on("transitionend", () => {
        $(".img-examples").eq(incorrectIndex).off("transitionend");
        
        $(".img-examples").eq(correctIndex).addClass("correct");
    })

    $(".img-examples").eq(incorrectIndex).addClass("fade");
    $(".js-wrapper-question").addClass("correct");
    $(".js-blanc-correct").addClass("correct");
    $(".js-notes").addClass("active");
}

const incorrectAction = () => {
    $(".js-blanc-incorrect").addClass("incorrect");

    playSound(audIncorrect, function () {
        $(".js-blanc-incorrect").removeClass("incorrect");
        $(".img-examples").removeClass("selected");

        playSound(quizData.Sound1, () => {
            setWorking(false);
            lockScreen(isWorking);
        });
    });
}

const loadNext = () => {
    quizIndex++;

    if (quizIndex < quizDataArr.length) {
        $(".js-question").html("");
        $(".js-wrapper-imgs").empty();
        $(".js-wrapper-question").removeClass("correct");
        $(".js-blanc-correct").removeClass("correct");
        $(".js-notes").removeClass("active");

        setQuizData();
    }
    else {
        setWorking(false);
        lockScreen(isWorking);

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

const setWorking = state => {
    isWorking = state;
}

const resetAll = pStart => {
    quizIndex = 0;

    $(".js-question").html("");
    $(".js-wrapper-imgs").empty();
    $(".js-wrapper-question").removeClass("correct");
    $(".js-blanc-correct").removeClass("correct");
    $(".js-notes").removeClass("active");

    setQuizData();
    playBGM(sndBgmA4A);

    hideNext();
}