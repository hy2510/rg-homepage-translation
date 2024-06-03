let quizDataArr;
let exampleArr = [];                        // 보기
let correctCount = 0;
let maxCorrectCount = 0;
let wordType = "sight";
let selectedIndex;
let prePos = -1;
let crntPos = -2;

const sndCorrect = effectSightWords + "correct_gino.mp3";                       // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectSightWords + "incorrect_boing_gino.mp3";        // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
const sndButtonPush = effectSightWords + "button_push.mp3";                     // (21) (600) 띠옹~ 선택하는 소리
const sndWhoosh3 = effectSightWords + "whoosh3.mp3";                            // (  ) (2500) 위이이잉~ 혜성 다가오는 소리

$(document).ready(() => {
    lockScreen(true);

    step = 2;
    quizType = "B";
    currentActivity = "A2B";    // 제일 먼저 세팅해야함.

    focusCurrent(currentActivity);

    const imgArr = [
        "./images/img_btn_left_02.png",
        "./images/img_btn_left_03.png",
        "./images/img_btn_ok_02.png",
        "./images/img_btn_ok_03.png",
        "./images/img_btn_right_02.png",
        "./images/img_btn_right_03.png",
        "./images/img_character_gino_correct.png",
        "./images/img_character_gino_incorrect.png"
    ];

    doPreloadImages(imgArr, loadQuiz);
});

const setData = data => {
    // 비지니스 로직
    // 1. 퀴즈 데이터 담기.
    quizDataArr = data;
    maxCorrectCount = quizDataArr.length;

    setupQuiz();
    playBGM(sndBgmA3B);

    // 음원 딜레이 방지
    $("#preload1").attr('src', sndButtonPush);
    $("#preload2").attr('src', sndWhoosh3);

    // 유저가 staff or review 일 때 메뉴에서 현재 학습 강조.
    $("." + currentActivity).addClass("on");
};

const loadQuiz = () => {
    loadQuizData(step, quizType, setData);
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
        selectedIndex = -1;

        setExample();

        setHoverEvent();
        setKeyboardEvent();
        setPanelEvent();
        setClickEvent();
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

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
            appendHtml += "<div class='js-wrapper-example wrapper-example'>";
            appendHtml += "<img class='js-img-planet img-planet' src='./images/img_planet_0" + (index + 1) + "_grey.png' onanimationend='afterPlanetAction()' />";
            appendHtml += "<img class='img-selected' src='./images/img_selected.png' />";
            appendHtml += "<p class='js-text-word text-word'>" + data + "</p>";
            appendHtml += "</div>";

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
    }
}

// 마우스 이벤트
const setHoverEvent = () => {
    $(".js-wrapper-example").on("mouseover", () => {
        if (isWorking || isClick) {
            return false;
        }
        else {
            $(".js-wrapper-example").removeClass("selected");

            const index = $(".js-wrapper-example").index(event.currentTarget);

            selectedIndex = index;

            $(".js-wrapper-example").eq(index).addClass("selected");
        }
    })
}

const fireHoverEvent = () => {
    $(".js-wrapper-example").off("mouseover");
}

// 키보드 이벤트
const setKeyboardEvent = () => {
    $(document).on("keydown", e => {
        e.stopPropagation();

        switch (e.keyCode) {
            // 좌측 화살표
            case 37:
                playEffect1(sndButtonPush);
                $(".js-wrapper-example").removeClass("selected");
                selectedIndex = selectedIndex - 1 < 0 ? 2 : selectedIndex - 1;
                $(".js-wrapper-example").eq(selectedIndex).addClass("selected");
                break;

            // 우측 화살표
            case 39:
                playEffect1(sndButtonPush);
                $(".js-wrapper-example").removeClass("selected");
                selectedIndex = selectedIndex + 1 > 2 ? 0 : selectedIndex + 1;
                $(".js-wrapper-example").eq(selectedIndex).addClass("selected");
                break;

            // 엔터, 스페이스
            case 13:
            case 32:
                playEffect1(sndButtonPush);
                if (selectedIndex > 2 || selectedIndex < 0) {
                    return false;
                }

                $(".js-wrapper-example").eq(selectedIndex).click();
                break;
        }
    })
}

const fireKeyboardEvent = () => {
    $(document).off("keydown");
}

// 버튼 이벤트
const setPanelEvent = () => {
    $(".js-btn").on("click", e => {
        const index = $(".js-btn").index(e.currentTarget);
        let evt;

        switch (index) {
            case 0:
                evt = $.Event("keydown", { keyCode: 37 });
                $(".btn-left").trigger(evt);
                break;

            case 1:
                evt = $.Event("keydown", { keyCode: 13, keyCode: 32 });
                $(".btn-ok").trigger(evt);
                break;

            case 2:
                evt = $.Event("keydown", { keyCode: 39 });
                $(".btn-right").trigger(evt);
                break;
        }
    })
}

const firePanelEvent = () => {
    $(".js-btn").off("click");
}

// 클릭 이벤트
const setClickEvent = () => {
    $(".js-wrapper-example").on("click", e => {
        if (isWorking || isClick) {
            return false;
        }
        else {
            isClick = true;
            isWorking = true;
            lockScreen(isWorking);

            const $this = e.currentTarget;
            const index = $(".js-wrapper-example").index($this);

            // 정답 체크
            const checkAnswer = () => {
                const answer = $(".js-text-word").eq(index).html();

                return (quizData.CorrectText == answer ? true : false);
            }

            const fillPlanet = index => {
                setTimeout(() => {
                    playEffect1(sndCorrect);
                }, 500);
                fireAllEvents();
                ////
                $(".js-wrapper-character").addClass("correct");
                $(".js-wrapper-example").eq(index).addClass("correct");
                $(".js-wrapper-example").not(".correct").addClass("invisible");
            }

            const lightPlanet = index => {
                setTimeout(() => {
                    playEffect1(sndIncorrectBoing);
                }, 500);
                $(".js-wrapper-character").addClass("incorrect");
                $(".js-wrapper-example").eq(index).addClass("incorrect");
            }

            isCorrect = checkAnswer();

            if (isCorrect) {
                fillPlanet(index);
            }
            else {
                lightPlanet(index);
            }
        }
    })
}

// 정답 체크 후
const afterPlanetAction = () => {
    if (isCorrect) {
        const afterMovePlanet = () => {
            $(".js-wrapper-example").on("animationend", () => {
                playSound(quizData.Sound1,
                    function () {
                        correctCount++;

                        if (correctCount < maxCorrectCount) {
                            setTimeout(() => {
                                $(".js-wrapper-character").removeClass("correct");
                                $(".js-wrapper-example").remove();
                                ////
                                setupQuiz();
                            }, 1000);
                        }
                        else {
                            setTimeout(() => {
                                popNext();
                            }, 1000);
                        }
                    });

            })
        }

        const movePlanet = () => {
            playEffect1(sndWhoosh3);
            event.stopPropagation();

            const $this = event.currentTarget
            const index = $(".js-img-planet").index($this);

            $(".js-wrapper-example").eq(index).addClass("move");
        }

        afterMovePlanet();
        movePlanet();
    }
    else {
        setTimeout(() => {
            playSound(quizData.Sound1,
                function () {
                    $(".js-wrapper-example").removeClass("incorrect");
                    $(".js-wrapper-character").removeClass("incorrect");
                    isWorking = false; isClick = false; lockScreen(isWorking);
                });
        }, 1000);
    }
}

const fireClickEvent = () => {
    playEffect1(sndButtonPush);
    $(".js-wrapper-example").off("click");
}

// 이벤트 해제
const fireAllEvents = () => {
    fireHoverEvent();
    fireKeyboardEvent();
    firePanelEvent();
    fireClickEvent();

    $(".js-wrapper-example").removeClass("selected");
}

const playQuestion = () => {
    playSound(quizData.Sound1, function () { isWorking = false; isClick = false; lockScreen(isWorking); });
}

const setInit = () => {
    prePos = -1;
    crntPos = -1;
    fireAllEvents();
    $(".js-wrapper-character").removeClass("correct");
    $(".js-wrapper-example").remove();
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];
    setInit();
    setupQuiz();
    playBGM(sndBgmA3B);
    hideNext();
}
