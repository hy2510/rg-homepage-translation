let cranePosition = 0;
let craneAction = "";

let correctCount = 0;
let maxCorrectCount = 3;
let exampleArr = [];                        // 보기
let posPreCorrect = -1;
let posNowCorrect = -1;
// sound effect 
let sndAlphabet = letterSound;                                  // '애' 경로
let sndCorrect = effectAlphabet + "correct_3.mp3";                // (07) (800 ~ 1000) 맞췄을 때 나는 소리
let sndIncorrectBoing = effectAlphabet + "incorrect_dodo.mp3"; // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
let sndCraneMoving = effectAlphabet + "crane_moving.mp3";       // (21) (700) 찌이익~ 크레인 이동
let sndCraneClanking = effectAlphabet + "crane_clanking.mp3";   // (22) (500) 끼리리릭~ 크레인 집게 내려가는 소리
let sndThump = effectAlphabet + "thump.mp3";                    // (23) (500) 콩~ 물체 바닥에 부딪히는 소리
let chrLetter = '';

isWorking = true;
isClick = true;

$(document).ready(() => {
    lockScreen(true);
    currentActivity = 'A4A';
    step = 4;
    focusCurrent(currentActivity);

    // 깜빡임 방지를 위해 이미지 미리 로딩
    const imgArr = [
        "./images/img_btn_left_01.png",
        "./images/img_btn_left_02.png",
        "./images/img_btn_left_03.png",
        "./images/img_btn_ok_01.png",
        "./images/img_btn_ok_02.png",
        "./images/img_btn_ok_03.png",
        "./images/img_btn_right_01.png",
        "./images/img_btn_right_02.png",
        "./images/img_btn_right_03.png",
        "./images/img_dodo_correct.png",
        "./images/img_dodo_incorrect.png"
    ]

    doPreloadImages(imgArr, loadQuiz);

    let randomNum = Math.floor(Math.random() * (2));

    if (randomNum == 0) {
        $(".bg-letter-catcher").css("background", "url(images/bg_letter_catcher2.jpg)")
    } else {
        $(".bg-letter-catcher").css("background", "url(images/bg_letter_catcher.jpg)")
    }

    // 음원 딜레이 방지
    $("#preload1").attr('src', sndCraneMoving);
    $("#preload2").attr('src', sndCraneClanking);

    // 유저가 staff or review 일 때 메뉴에서 현재 학습 강조.
    $("." + currentActivity).addClass("on");
});

const loadQuiz = () => {
    loadQuizData(step, quizType, setData);
}

// 키보드 이벤트
$(document).on("keydown", (e) => {
    if (e.keyCode == 37 || e.keyCode == 39 || e.keyCode == 32 || e.keyCode == 13 || e.keyCode == 40) {
        if (isWorking || isClick) {
            return false;
        }
        else {
            isWorking = true;

            switch (e.keyCode) {
                case 37:            // left arrow
                    moveCrane("left");
                    break;

                case 39:            // right arrow
                    moveCrane("right");
                    break;

                case 32:            // spacebar
                case 13:            // enter
                case 40:            // down arrow
                    moveCrane("catch");
                    break;
            }
        }
    }
})

const setData = data => {
    lockScreen(true);
    // 비지니스 로직
    // 1. 퀴즈 데이터 담기.
    quizData = data[0];

    chrLetter = quizData.Example1.toUpperCase();

    // 2. 퀴즈 데이터 세팅
    // 퀴즈 타입이 알파벳인지 아닌지 판별
    try {
        checkGetDataSuccess();
        checkStudyType();
        setupQuiz();
        playBGM(sndBgmA4A);
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

// 퀴즈 세팅 시작
const setupQuiz = () => {
    setExample();
    setSelectEvent();

    setTimeout(() => {
        $('.js-ball').removeClass("d-none");

        setTimeout(() => {
            playSound(sndAlphabet + quizData.Example1.toLowerCase() + ".mp3",
                function () {
                    isWorking = false;
                    isClick = false;
                    lockScreen(false);
                    $(".control-pannel").removeClass("d-none");
                });
        }, delaysec);
    }, delaysec);

    // 사운드 실패시 문제 풀 수 있도록
    setTimeout(() => {
        isWorking = false;
        isClick = false;
        lockScreen(false);
        $(".control-pannel").removeClass("d-none");
    }, delaysec);

    setTimeout(() => {
        $('.js-ball').removeClass("d-none");
    }, delaysec * 2);
}

const alphabeExample = (letter, answerCnt) => {
    let alphabetArr = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I",
        "J", "K", "L", "M", "N", "O", "P", "Q", "R",
        "S", "T", "U", "V", "W", "X", "Y", "Z"
    ];

    alphabetArr = alphabetArr.filter(alphabet => alphabet != letter);

    // K, C, Q 발음의 유사성으로 인하여 상호배제
    if (letter == "K") {
        alphabetArr.splice(alphabetArr.indexOf("C"), 1);
        alphabetArr.splice(alphabetArr.indexOf("Q"), 1);
    }
    else if (letter == "C") {
        alphabetArr.splice(alphabetArr.indexOf("K"), 1);
        alphabetArr.splice(alphabetArr.indexOf("Q"), 1);
    }
    else if (letter == "Q") {
        alphabetArr.splice(alphabetArr.indexOf("C"), 1);
        alphabetArr.splice(alphabetArr.indexOf("K"), 1);
    }

    alphabetArr = shuffle(alphabetArr).splice(0, answerCnt - 1);
    alphabetArr.push(letter);

    alphabetArr = shuffle(alphabetArr);

    return alphabetArr;
};

// 보기 세팅
const setExample = () => {
    try {
        exampleArr = alphabeExample(chrLetter, quizData.ExampleCount);

        if (exampleArr.length < 1) {
            throw "No Example Data";
        }

        for (let i = 0; i < exampleArr.length; i++) {
            if (exampleArr[i].toLowerCase() == quizData.CorrectText.toLowerCase()) {
                posNowCorrect = i;
                if (posPreCorrect == posNowCorrect) {
                    setExample();
                    return;
                } else {
                    posPreCorrect = posNowCorrect;
                }
            }

            $(".js-text-alphabet").eq(i).html(exampleArr[i].toLowerCase());
        }

        //exampleArr.map((data, index) => {
        //    if (data.toLowerCase() == quizData.CorrectText.toLowerCase()) {
        //        posNowCorrect = index;
        //        if (posPreCorrect == posNowCorrect) {
        //            setExample();
        //            return;
        //        } else {
        //            posPreCorrect = posNowCorrect;
        //        }
        //    }

        //    $(".js-text-alphabet").eq(index).html(data.toLowerCase());
        //})
    }
    catch (e) {
        alert("Set Example Error: " + e);
    }
}

// 클릭 이벤트- 상단에 keydown 이벤트에 트리거해줌.
const setSelectEvent = () => {
    $(".js-btn-left").on("click", () => {
        const leftKeyEvent = jQuery.Event("keydown", { keyCode: 37 });
        $(document).trigger(leftKeyEvent);
    });

    $(".js-btn-ok").on("click", () => {
        const spaceKeyEvent = jQuery.Event("keydown", { keyCode: 32 });
        $(document).trigger(spaceKeyEvent);
    });

    $(".js-btn-right").on("click", () => {
        const rightKeyEvent = jQuery.Event("keydown", { keyCode: 39 });
        $(document).trigger(rightKeyEvent);
    });
}

// 크레인 동작 함수.
const moveCrane = (action) => {
    switch (action) {
        case "left":
        case "right":
            craneAction = "move";

            $(".js-crane").removeClass("zone1 zone2 zone3 zone4 zone5");

            if (action == "left") {
                if (cranePosition == 1) {
                    craneAction = "";
                    cranePosition = 1;
                    isWorking = false;
                }
                else if (cranePosition < 1) {
                    craneAction = "";
                    cranePosition = 0;
                    isWorking = false;
                }
                else {
                    playEffect1(sndCraneMoving);
                    cranePosition--;
                }

            }
            else if (action == "right") {
                if (cranePosition >= 5) {
                    craneAction = "";
                    cranePosition = 5;

                    isWorking = false;
                }
                else {
                    playEffect1(sndCraneMoving);
                    cranePosition++;
                }
            }

            $(".js-crane").addClass("zone" + cranePosition);
            break;

        case "catch":
            if (cranePosition < 1) {
                isWorking = false;
                return false;
            }

            craneAction = "descend";

            playEffect1(sndCraneClanking);
            descendCrane(cranePosition);
            break;
    }
}

// 크레인 동작 후
const afterCraneAction = () => {
    //console.log(craneAction);
    switch (craneAction) {
        case "move":
            craneAction = "";
            isWorking = false;
            break;

        case "descend":
            afterDescendCrane();
            break;

        case "ascend":
            afterAscendCrane();
            break;

        case "correct":
            afterDoCorrectAction();
            break;
    }
}

// 크레인 내려가기
const descendCrane = () => {
    //craneAction = "descend";
    $(".js-wrapper-balls").addClass("stop");

    $(".js-crane").addClass("open");
    $(".js-crane").addClass("descend");
}

const afterDescendCrane = () => {
    //craneAction = "pick";
    $(".js-crane").addClass("catch").removeClass("open");
    ascendCrane();
}

// 크레인 올라가기
const ascendCrane = () => {
    craneAction = "ascend";

    $(".js-crane").removeClass("descend");
    $(".js-ball").eq(cranePosition - 1).addClass("ascend");
}

const afterAscendCrane = () => {
    const isCorrect = checkAnswer();

    if (isCorrect) {
        doCorrectAction();
    }
    else {
        $(".js-crane").addClass("open").removeClass("catch");

        doIncorrectAction();
    }
}

// 정답 체크
const checkAnswer = () => {
    const correctText = quizData.CorrectText.toLowerCase();
    const answer = $(".js-text-alphabet").eq(cranePosition - 1).html().toLowerCase();

    return (correctText == answer ? true : false);
}

// 정답
const doCorrectAction = () => {
    craneAction = "correct";
    $(".js-ball").eq(cranePosition - 1).addClass("left");

    setTimeout(() => {
        $(".left").css({ 'transform': 'scale(' + 1.4 + ')' }); // 정답 음원 재생시 정답 구슬이 커지는 효과
        playAlphabetSound();
    }, 1000);

    playSound(sndCorrect, function () {
        //setTimeout(() => {
        //playAlphabetSound();
        //}, 1000);
    });

    $(".js-crane").removeClass("zone1 zone2 zone3 zone4 zone5");
    $(".js-dodo").addClass("correct");
    correctCount++;
}

const playAlphabetSound = () => {
    $(".js-ball").eq(cranePosition - 1).addClass("bigger");
    playEffect1(sndAlphabet + quizData.Example1.toLowerCase() + ".mp3");
}

const afterDoCorrectAction = () => {
    $(".js-crane").removeClass("catch").addClass("open");
    $(".js-ball").eq(cranePosition - 1).addClass("drop");

    if (correctCount >= maxCorrectCount) {
        setTimeout(() => {
            popNext();
        }, 1000);
    }
    else {
        setTimeout(() => {
            resetAll(false);
        }, 3000);
    }
}

// 오답e
const doIncorrectAction = () => {
    setTimeout(() => {
        playEffect1(sndIncorrectBoing);
    }, 900);

    $(".dodo").addClass("incorrect");
    $(".js-ball").eq(cranePosition - 1).removeClass("ascend").addClass("incorrect");
    $(".js-dodo").addClass("incorrect");

    setTimeout(() => {
        $(".js-wrapper-smog img").eq(cranePosition - 1).removeClass("d-none");
    }, 800);
}

const afterDoIncorrectAction = () => {
    $(".js-wrapper-smog img").eq(cranePosition - 1).addClass("d-none");
    $(".js-ball").eq(cranePosition - 1).removeClass("incorrect");
    $(".js-wrapper-balls").removeClass("stop");
    $(".js-crane").removeClass("open");

    setTimeout(() => {
        isClick = false;
        isWorking = false;
        $(".js-dodo").removeClass("incorrect");
    }, 1000);
}

// 초기화
const resetAll = (pStart) => {
    if (pStart == true) {
        correctCount = 0;
    }
    cranePosition = 0;
    craneAction = "";
    $('.js-ball').addClass("d-none");
    $(".js-crane").removeClass("open catch pick");
    $(".js-ball").removeClass("ascend descend left drop correct incorrect");
    $(".js-wrapper-balls").removeClass("stop");
    $(".js-dodo").removeClass("correct incorrect");
    $(".js-ball").css({ 'transform': 'scale(' + 1.0 + ')' }); // 정답시 커진 구슬크기 초기화
    setupQuiz();
    hideNext();
    playBGM(sndBgmA4A);
}

const playQuestion = () => {
    playEffect1(quizData.Sound1);
}