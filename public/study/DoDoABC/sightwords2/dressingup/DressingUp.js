let quizDataArr;
let quizIndex = 0;
let drake;
let targetType = "head";

// 음원
const audCorrect = `${SIGHT_WORD_EFFECT_ROOT}/aud_correct_a2a.mp3`;     // 정답 소리
const audIncorrect = `${SIGHT_WORD_EFFECT_ROOT}/aud_incorrect_a2a.mp3`; // 오답 소리
const audDrop = `${SIGHT_WORD_EFFECT_ROOT}/correct_all.mp3`;            // 드래그드롭 소리

$(document).ready(() => {
    setWorking(true);
    lockScreen(isWorking);

    step = 2;
    quizType = "A";
    currentActivity = `A${step}${quizType}`;

    //getStudyStep();

    const imgArr = [
        "./images/bg_mirror_head.png",
        "./images/bg_mirror_clothes.png",
        "./images/bg_mirror_shoes.png",
        "./images/bg_mirror_wand.png",
        "./images/img_twinkle_circle.png",
        "./images/img_twinkle_half.png"
    ]

    doPreloadImages(imgArr, loadQuiz);
});

const loadQuiz = () => {
    loadQuizData(step, quizType, setData);
}

// 데이터 할당
const setData = data => {
    $(".js-drop-dodo").addClass("d-none");
    quizDataArr = data;

    setQuizData();

    playBGM(sndBgmA2A);
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
        $(".js-bg-mirror").removeClass("head clothes shoes wand");

        switch (quizIndex) {
            case 0:
                targetType = "head";
                $(".js-bg-mirror").addClass("head");
                break;

            case 1:
                targetType = "clothes";
                $(".js-bg-mirror").addClass("clothes");
                break;

            case 2:
                targetType = "shoes";
                $(".js-bg-mirror").addClass("shoes");
                break;

            case 3:
                targetType = "wand";
                $(".js-bg-mirror").addClass("wand");
                break;
        }

        setExamples();

        //setWorking(false);
        //lockScreen(isWorking);
    }
    catch (e) {
        alert(`Set Quiz Error: ${e}`);

        doLogout();
    }
}

const setExamples = () => {
    $(".js-examples").empty();
    let shuffleArr = [0, 1, 2];
    shuffleArr = shuffle(shuffleArr);


    $(".js-examples").map((index, el) => {
        let appendHtml = "";
        const exampleVal = eval(`quizData.Example${shuffleArr[index] + 1}`);

        appendHtml += `<div class="img-twinkle d-none"></div>`;
        appendHtml += `<div>${exampleVal}</div>`;

        $(".js-examples")[index].innerHTML = appendHtml;
    })

    $(".js-wrapper-examples").on("animationend", () => {
        setClickEvent();

        playSound(quizData.Sound1, function () {
            setWorking(false);
            lockScreen(isWorking);
        });
    })

    setTimeout(() => {
        $(".js-wrapper-examples").addClass("open");
    }, 1000);
}

const afterPlaySound = () => {
    setClickEvent();
}

const setClickEvent = () => {
    $(".js-wrapper-examples").off("animationend");

    $(".js-examples").on("click", (e) => {
        if (isWorking)
            return false;

        setWorking(true);
        lockScreen(isWorking);

        const $this = e.currentTarget;
        const index = $(".js-examples").index($this);
        const selected = $(".js-examples").eq(index).children("div:eq(1)").html();

        $(".js-examples").eq(index).addClass("selected");

        if (selected == quizData.CorrectText) {
            fireClickEvent();
            correctAction();
        }
        else {
            incorrectAction();
        }
    })
}

const fireClickEvent = () => {
    $(".js-examples").off("click");
}

const correctAction = () => {
    $(".js-wrapper-face").addClass("correct");
    playSound(audCorrect, null);
    doExampleTwinkle();
}

const incorrectAction = () => {
    $(".js-wrapper-face").addClass("incorrect");
    playSound(audIncorrect, afterIncorrectAction);
}

const afterIncorrectAction = () => {
    setTimeout(() => {
        $(".js-examples").removeClass("selected");
        $(".js-wrapper-face").removeClass("incorrect");

        playSound(quizDataArr[quizIndex].Sound1, () => {
            setWorking(false);
            lockScreen(isWorking);
        })
    }, 1000);
}

const makeDragObject = () => {
    // 의상 세팅
    let appendHtml = "";

    // 1번
    appendHtml += `<div class='wrapper-${targetType} first'>`;
    appendHtml += `<img class="img-${targetType}" src='./images/img_${targetType}_01.png' /> `;
    appendHtml += `<div class="img-twinkle d-none"></div>`;
    if (targetType == "wand") {
        appendHtml += `<div class="img-drop blue"></div>`;
    }
    appendHtml += `</div>`;

    // 2번
    appendHtml += `<div class='wrapper-${targetType} second'>`;
    appendHtml += `<img class="img-${targetType}" src='./images/img_${targetType}_02.png' /> `;
    appendHtml += `<div class="img-twinkle d-none"></div>`;
    if (targetType == "wand") {
        appendHtml += `<div class="img-drop twinkle"></div>`;
    }
    appendHtml += `</div>`;

    // 3번
    appendHtml += `<div class='wrapper-${targetType} last'>`;
    appendHtml += `<img class="img-${targetType}" src='./images/img_${targetType}_03.png' /> `;
    appendHtml += `<div class="img-twinkle d-none"></div>`;
    if (targetType == "wand") {
        appendHtml += `<div class="img-drop flower"></div>`;
    }
    appendHtml += `</div>`;

    $(".js-bg-mirror").append(appendHtml);
    playEffect1(quizDataArr[quizIndex].Sound1);

    setDragEvent();
}

const setDragEvent = () => {
    const dragElements = document.querySelector(".js-bg-mirror");
    const dropTarget = document.querySelector(`.js-wrapper-dodo`);

    drake = dragula(
        // 하단에 애들끼리만 이동가능.
        [dragElements, dropTarget],
        // 옵션
        {
            revertOnSpill: true,            // 드래그한 대상을 바깥에 흘리면 다시 되돌아오도록
            moves: (el, source, handle) => {
                return source !== dropTarget;
            },
            accepts: (el, target) => {
                return target !== dragElements;
            }
        }
    )

    drake.on("drop", (el, target, source, sibling) => {
        $(".js-drop-dodo").addClass("d-none");
        setWorking(true);
        lockScreen(isWorking);
        playSound(audDrop, null);
        afterDropObj();
    });

    enableMirror();
}

const fireDragEvent = () => {
    drake.destroy();
}

const afterDropObj = () => {
    doTwinkle();
}

const enableMirror = () => {
    $(".js-bg-mirror").removeClass("disabled");

    //setWorking(false);
    lockScreen(false);
}

const disableMirror = () => {
    $(".js-bg-mirror").addClass("disabled");
}

const doTwinkle = () => {
    $(".img-twinkle").on("animationend", () => {
        afterTwinkle();
    });

    $(`.wrapper-${targetType}`).find(".img-twinkle").removeClass("d-none");
}

const doExampleTwinkle = () => {
    $(".img-twinkle").on("animationend", () => {
        setTimeout(() => {
            $(".js-drop-dodo").removeClass("d-none");
        }, 500)
        afterExampleTwinkle();
    });

    $(`.examples.selected`).find(".img-twinkle").removeClass("d-none");
}

const afterTwinkle = () => {

    $(".img-twinkle").addClass("d-none");

    if (quizIndex < quizDataArr.length - 1) {
        goNext();
    }
    else {
        shakeWand();
    }
}

const afterExampleTwinkle = () => {
    $(".img-twinkle").addClass("d-none");

    makeDragObject();
}

const goNext = () => {
    try {
        quizIndex++;

        if (quizIndex > quizDataArr.length - 1) throw "Quiz Index Over Error";

        $(".js-bg-mirror").empty();
        $(".js-wrapper-examples").removeClass("open");
        $(".js-examples").removeClass("selected");
        $(".js-wrapper-face").removeClass("correct");

        setTimeout(() => {
            fireDragEvent();
            setQuizData();
        }, 1000)
    }
    catch (e) {
        alert(e);

        doLogout();
    }
}

const shakeWand = () => {
    $(".img-drop").removeClass("drop");

    setTimeout(() => {
        setWorking(false);
        lockScreen(isWorking);

        popNext();
    }, 3000);
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
    blockScreen(state);
}

const blockScreen = (pLock) => {
    if (pLock) {
        $(".js-screen-block").removeClass("d-none");
    } else {
        $(".js-screen-block").addClass("d-none");
    }
}

const resetAll = pStart => {
    quizIndex = 0;

    $(".js-drop-dodo").addClass("d-none");
    $(".js-bg-mirror").empty();
    $(".js-wrapper-examples").removeClass("open");
    $(".js-examples").removeClass("selected");
    $(".js-wrapper-dodo").children().not("div.js-wrapper-face").remove();

    fireDragEvent();
    setQuizData();
    playBGM(sndBgmA2A);

    hideNext();
}