let quizDataArr;
let quizIndex = 0;
let letterArr = [];
let cursorIndex = 0;
let preCursorArr = [];

// 음원
const sndBgmA2B1 = `${SIGHT_WORD_BGM_ROOT}/bgm_sw2_a2b_01.mp3`;
const sndBgmA2B2 = `${SIGHT_WORD_BGM_ROOT}/bgm_sw2_a2b_02.mp3`;
const sndBgmA2B3 = `${SIGHT_WORD_BGM_ROOT}/bgm_sw2_a2b_03.mp3`;
const sndBgmA2B4 = `${SIGHT_WORD_BGM_ROOT}/bgm_sw2_a2b_04.mp3`;
const audClick = `${SIGHT_WORD_EFFECT_ROOT}/aud_click.mp3`;
const audBackspace = `${SIGHT_WORD_EFFECT_ROOT}/aud_backspace.mp3`;
const audWalking = `${SIGHT_WORD_EFFECT_ROOT}/aud_walking.mp3`;
const audCorrect = `${SIGHT_WORD_EFFECT_ROOT}/aud_correct_a2b.mp3`;
const audIncorrect = `${SIGHT_WORD_EFFECT_ROOT}/aud_incorrect_a2b.mp3`;
const audCorrectAll = `${SIGHT_WORD_EFFECT_ROOT}/correct_all.mp3`;
const audCamera = `${SIGHT_WORD_EFFECT_ROOT}/aud_camera.mp3`;

$(document).ready(() => {
    setWorking(true);
    lockScreen(isWorking);

    step = 2;
    quizType = "B";
    currentActivity = `A${step}${quizType}`;

    //getStudyStep();

    const imgArr = [
        "./images/bg_spelling_01.png",
        "./images/bg_spelling_02.png",
        "./images/bg_spelling_03.png",
        "./images/bg_spelling_04.png",

        "./images/img_character_dodo.png",
        "./images/img_dodo_walk.png",
        "./images/img_character_dodo_correct.png",
        "./images/img_character_dodo_incorrect.png",

        "./images/img_character_baro.png",
        "./images/img_baro_walk.png",
        "./images/img_character_baro_correct.png",
        "./images/img_character_baro_incorrect.png",

        "./images/img_character_jack.png",
        "./images/img_jack_walk.png",
        "./images/img_character_jack_correct.png",
        "./images/img_character_jack_incorrect.png",

        "./images/img_character_papa.png",
        "./images/img_papa_walk.png",
        "./images/img_character_papa_correct.png",
        "./images/img_character_papa_incorrect.png",

        "./images/img_character_edmond.png",
        "./images/img_character_edmond_correct.png",
        "./images/img_character_edmond_incorrect.png",

        "./images/btn_typing.png",
        "./images/btn_typing_active.png",
        "./images/btn_back.png",
        "./images/btn_back_active.png"
    ]

    doPreloadImages(imgArr, loadQuiz);
});

const loadQuiz = () => {
    loadQuizData(step, quizType, setData);
}

// 데이터 할당
const setData = data => {
    quizDataArr = data;

    setQuizData();
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

        $(".js-bg-spelling").removeClass("second third last");

        stopBGM();

        switch (quizIndex) {
            case 0:
                playBGM(sndBgmA2B1);
                bgmVolume(0.7);
                break;

            case 1:
                $(".js-bg-spelling").addClass("second");

                playBGM(sndBgmA2B2);
                bgmVolume(0.7);
                break;

            case 2:
                $(".js-bg-spelling").addClass("third");

                playBGM(sndBgmA2B3);
                bgmVolume(0.7);
                break;

            case 3:
                $(".js-bg-spelling").addClass("last");

                playBGM(sndBgmA2B4);
                bgmVolume(0.7);
                break
        }

        setQuiz();
    }
    catch (e) {
        alert(`Setup Quiz Error: ${e}`);

        doLogout();
    }
}

const setQuiz = () => {
    cursorIndex = 0;

    // 알파벳 배열에 담기
    let quizLetterArr = quizData.Question.split("");
    const includeArr = quizData.Question.toUpperCase().split("").concat(quizData.Question.toLowerCase().split(""));

    let smallLetterArr = Array.from({ length: 26 }, (v, i) => String.fromCharCode(i + 65));
    let bigLetterArr = Array.from({ length: 26 }, (v, i) => String.fromCharCode(i + 97));

    alphabetArr = [...smallLetterArr, ...bigLetterArr].filter(el => !includeArr.includes(el));
    // 알파벳 배열에 담기 end

    // 하단 키보드 세팅
    let inputHtml = "";
    let keyboardHtml = "";

    // 5글자 이하
    if (quizLetterArr.length < 5) {
        let exampleArr = [];
        const exampleNumArr = getRandomNums(6 - quizLetterArr.length);

        for (i in quizLetterArr) {
            inputHtml += `<div class="letters ${i == 0 ? 'cursor' : ''}">`;
            inputHtml += `<div class="text-shadow">${quizLetterArr[i]}</div>`;
            inputHtml += `<div class="text-selected"></div>`;
            inputHtml += `</div>`;
        }

        for (j in exampleNumArr) {
            exampleArr.push(alphabetArr[exampleNumArr[j]]);
        }

        exampleArr = exampleArr.concat(quizLetterArr);
        exampleArr = shuffle(exampleArr);

        for (k in exampleArr) {
            keyboardHtml += `<div class="btn-keyboard">${exampleArr[k]}</div>`;
        }
    }
    // 5글자 이상
    else {
        let exampleArr = [];
        const maskingNumArr = getMaskingNums(quizLetterArr.length, quizLetterArr.length - 4).sort(); // 미리 체크할 2글자
        const exampleNumArr = getRandomNums(quizLetterArr.length - 4);

        if (maskingNumArr[0] == 0) {
            if (maskingNumArr[1] == 1) {
                cursorIndex = 2;
            }
            else {
                cursorIndex = 1;
            }
        }
        else {
            cursorIndex = 0;
        }

        for (i in quizLetterArr) {
            inputHtml += `<div class="letters ${cursorIndex == parseInt(i) ? 'cursor' : ''}">`;
            inputHtml += `<div class="text-shadow">${quizLetterArr[i]}</div>`;

            if (maskingNumArr.includes(parseInt(i))) {
                inputHtml += `<div class="text-selected masking">${quizLetterArr[i]}</div>`;
            }
            else {
                inputHtml += `<div class="text-selected"></div>`;
            }

            inputHtml += `</div>`;
        }

        quizLetterArr = quizLetterArr.filter((el, i) => !maskingNumArr.includes(i));

        for (j in exampleNumArr) {
            exampleArr.push(alphabetArr[exampleNumArr[j]]);
        }

        exampleArr = exampleArr.concat(quizLetterArr);
        exampleArr = shuffle(exampleArr);

        for (k in exampleArr) {
            keyboardHtml += `<div class="btn-keyboard">${exampleArr[k]}</div>`;
        }
    }

    $(".js-input-spelling").append(inputHtml);
    $(".js-keyboard").append(keyboardHtml);

    setTimeout(() => {
        playSound(quizData.Sound1, setClickEvent);
    }, 1000);
}

const getRandomNums = n => {
    let randomArr = [];
    let start = 0;

    while (start < n) {
        let randomNum = Math.floor(Math.random() * alphabetArr.length);

        if (randomArr.includes(randomNum)) {
            randomNum = Math.floor(Math.random() * alphabetArr.length);
        }
        else {
            randomArr.push(randomNum);

            start++;
        }
    }

    return randomArr;
}

const getMaskingNums = (need, end) => {
    let randomArr = [];
    let start = 0;

    while (start < end) {
        let randomNum = Math.floor(Math.random() * need);

        if (randomArr.includes(randomNum)) {
            randomNum = Math.floor(Math.random() * need);
        }
        else {
            randomArr.push(randomNum);

            start++;
        }
    }

    return randomArr;
}

const setClickEvent = () => {
    $(".btn-keyboard").on("click", e => {
        if (isWorking)
            return false;

        playSound(audClick, null);

        const $this = e.currentTarget;
        const index = $(".btn-keyboard").index($this);
        const selected = e.target.innerHTML;

        $(".btn-keyboard").eq(index).addClass("disabled");
        $(".cursor").children(".text-selected").html(selected);

        const cursorObj = {
            "index": index,
            "letter": selected
        };

        preCursorArr.push(cursorObj);

        afterClickEvent();
    })

    $(".js-btn-backspace").on("click", () => {
        if (isWorking)
            return false;

        if (preCursorArr.length < 1)
            return false;

        playSound(audBackspace, null);

        $(".letters").removeClass("cursor");

        $(".btn-keyboard").eq(preCursorArr[preCursorArr.length - 1].index).removeClass("disabled");
        preCursorArr.pop();

        while (true) {
            cursorIndex--;

            if (!$(".letters").eq(cursorIndex).children(".text-selected").hasClass("masking")) {
                break;
            }
        }

        $(".letters").eq(cursorIndex).children(".text-selected").empty();
        $(".letters").eq(cursorIndex).addClass("cursor");
    })

    setWorking(false);
    lockScreen(isWorking);
}

const afterClickEvent = () => {
    $(".letters").removeClass("cursor");

    while (true) {
        cursorIndex++;

        if (!$(".letters").eq(cursorIndex).children(".text-selected").hasClass("masking")) {
            break;
        }
    }

    if (cursorIndex >= quizData.Question.length) {
        setWorking(true);
        lockScreen(isWorking);

        setTimeout(() => {
            checkCorrect();
        }, 500);
    }
    else {
        $(".letters").eq(cursorIndex).addClass("cursor");
    }
}

const fireClickEvent = () => {
    $(".btn-keyboard, .js-btn-backspace").off("click");
}

const checkCorrect = () => {
    let answer = "";

    for (let i = 0; i < quizData.Question.length; i++) {
        answer += $(".letters").children(".text-selected").eq(i).html();
    }

    if (answer == quizData.Question) {
        fireClickEvent();
        //playSound(audCorrect, correctAction);
        correctAction();
    }
    else {
        setWorking(true);
        lockScreen(isWorking);
        $(".js-wrapper-characters").addClass("incorrect");
        playSound(audIncorrect, incorrectAction);
    }
}
const correctAction = () => {
    $(".js-wrapper-characters-left").on("animationend", () => {
        playEffect1(audCorrect);
        $(`.js-characters-left:lt(${quizIndex + 1})`).addClass("correct");
        $(`.js-characters-right`).eq(quizIndex).addClass("correct");

        setTimeout(() => {
            $(".js-wrapper-characters-left").off("animationend");

            quizIndex++;

            if (quizIndex < quizDataArr.length) {
                reset();

                $(".js-characters-left").removeClass("correct");
                $(".js-characters-right").removeClass("correct");

                $(".js-wrapper-characters").removeClass("walking");

                $(".js-input-spelling").empty();
                $(".js-keyboard").empty();

                setQuizData();
            }
            else {
                takePicture();
            }
        }, 2000);
    });

    // 한번 읽어준 후 걷기
    playSound(quizDataArr[quizIndex].Sound1, () => {
        playEffect1(audWalking);

        $(".js-wrapper-characters").addClass("walking");
    });
}

const takePicture = () => {
    $(".js-wrapper-pictures").removeClass("d-none");
    playEffect1(audCamera);
    setTimeout(popNext, 4100);
}

const incorrectAction = () => {
    reset();
    playSound(quizDataArr[quizIndex].Sound1, function () {
        setWorking(false);
        lockScreen(isWorking);
    });
}

const reset = () => {
    preCursorArr = [];

    cursorIndex = 0;

    while (true) {
        if (!$(".letters").eq(cursorIndex).children(".text-selected").hasClass("masking")) {
            break;
        }

        cursorIndex++;
    }

    $(".letters").eq(cursorIndex).addClass("cursor");

    $(".js-wrapper-characters").removeClass("incorrect");

    $(".text-selected").not(".masking").empty();
    $(".btn-keyboard").removeClass("disabled");
}

const resetAll = pStart => {
    quizIndex = 0;
    preCursorArr = [];
    cursorIndex = 0;

    $(".js-characters-left").removeClass("correct");
    $(".js-characters-right").removeClass("correct");

    $(".js-wrapper-characters").removeClass("walking");

    $(".js-input-spelling").empty();
    $(".js-keyboard").empty();

    $(".js-wrapper-pictures").addClass("d-none");
    
    setQuizData();
    playBGM(sndBgmA2B1);

    hideNext();
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