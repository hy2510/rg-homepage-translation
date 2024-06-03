let exampleArr = [];                        // 보기
let saveArr = [];                           // 보기 담아두는 배열
let correctCount = 0;
let maxCorrectCount = 3;
let selectedAlphabet = '';

// sound effect
let sndAlphabet = letterAlphabet;                               // '에이' 경로
let sndCorrect = effectAlphabet + "correct_2.mp3";              // (07) (800 ~ 1000) 맞췄을 때 나는 소리
let sndIncorrectBoing = effectAlphabet + "incorrect_all2.mp3"; // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
let sndFlipping = effectAlphabet + "flipping.mp3";              // (36) (400 ~ 500) 뒤집는 소리

$(document).ready(() => {
    $(".js-header-right").addClass("d-none");
    currentActivity = 'A3B';
    step = 3;
    quizType = "B";
    focusCurrent(currentActivity);
    hideSpeaker();

    const imgArr = [
        "./images/baro_correct.png",
        "./images/baro_incorrect.png",
        "./images/chello_correct.png",
        "./images/chello_incorrect.png",
        "./images/img_character_chello_correct.png",
        "./images/img_character_chello_incorrect.png",
        "./images/img_character_millo_correct.png",
        "./images/img_character_millo_incorrect.png",
        "./images/millo_correct.png",
        "./images/millo_incorrect.png",
        "./images/millo.png"
    ]

    doPreloadImages(imgArr, loadQuiz);

    // 음원 딜레이 방지
    $("#preload1").attr('src', sndFlipping);

    // 유저가 staff or review 일 때 메뉴에서 현재 학습 강조.
    $("." + currentActivity).addClass("on");
});

const loadQuiz = () => {
    loadQuizData(step, quizType, setData);
}

const setData = data => {
    // 비지니스 로직
    // 1. 퀴즈 데이터 담기.
    quizData = data[0];

    //console.log(quizData);

    // 2. 퀴즈 데이터 세팅
    // 퀴즈 타입이 알파벳인지 아닌지 판별s
    try {
        checkGetDataSuccess();
        checkStudyType();

        setExampleArr();

        if (exampleArr.length < 1) {
            throw "No Example Data";
        }

        setupQuiz();
        playBGM(sndBgmA3B);
    }
    catch (e) {
        alert("setData Error: " + e);

        doLogout();
    }
}

// 예제 담아두기
const setExampleArr = () => {
    exampleArr = [];

    exampleArr.push(quizData.Example1);
    exampleArr.push(quizData.Example1.toLowerCase());

    exampleArr.push(quizData.Example2);
    exampleArr.push(quizData.Example2.toLowerCase());

    exampleArr.push(quizData.Example3);
    exampleArr.push(quizData.Example3.toLowerCase());

    exampleArr = shuffle(exampleArr);
}

// 퀴즈 세팅 시작
const setupQuiz = () => {
    try {
        if (exampleArr.length < 1) {
            throw "No Example";
        }

        setAlphabet();

        setClickHandler();

        isClick = false;
        isWorking = false;

    }
    catch (e) {
        alert("setupQuiz Error: " + e);

        doLogout();
    }
}

const setAlphabet = () => {
    exampleArr.map((data, index) => {
        $(".js-card").eq(index).children(".front").html(data);
    })

    // 학습 시작후 잠시 카드를 보여줌
    setTimeout(() => {
        $(".js-container").addClass("selected");
        setTimeout(() => {
            $(".js-container").removeClass("selected");
        }, 2500);
    }, 500);
}

const setClickHandler = () => {
    $(".js-wrapper-card").on("click", (e) => {
        if (isWorking || isClick) {
            return false;
        }
        else {
            const $this = e.currentTarget;
            const index = $(".js-wrapper-card").index($this);

            if ($(".js-container").eq(index).hasClass("selected")) {
                return false;
            }
            else {
                playEffect1(sndFlipping);
                $(".js-container").eq(index).addClass("selected")
                saveArr.push(index);
            }

            if (saveArr.length == 2) {
                isWorking = true;
                isClick = true;
                lockScreen(isWorking);

                const firstAnswer = $(".js-card").eq(saveArr[0]).children(".front").html().toLowerCase();
                const secondAnswer = $(".js-card").eq(saveArr[1]).children(".front").html().toLowerCase();

                if (firstAnswer == secondAnswer) {
                    selectedAlphabet = firstAnswer.toLowerCase();

                    // 정답 처리
                    correctCount++;
                    $(".js-character-baro").addClass("correct");
                    $(".js-character-chello").addClass("correct");
                    $(".js-character-millo").addClass("correct");

                    setTimeout(() => {
                        if (correctCount == 1) {
                            $(".js-card").eq(saveArr[0]).children('.front').addClass("mint");
                            $(".js-card").eq(saveArr[1]).children('.front').addClass("mint");
                        } else if (correctCount == 2) {
                            $(".js-card").eq(saveArr[0]).children('.front').addClass("purple");
                            $(".js-card").eq(saveArr[1]).children('.front').addClass("purple");
                        } else {
                            $(".js-card").eq(saveArr[0]).children('.front').addClass("blue");
                            $(".js-card").eq(saveArr[1]).children('.front').addClass("blue");
                        }

                        playSound(sndCorrect, function () {
                            $(".js-character-baro").removeClass("incorrect correct");
                            $(".js-character-chello").removeClass("incorrect correct");
                            $(".js-character-millo").removeClass("incorrect correct");

                            saveArr = [];

                            playPhonics();
                        });

                    }, 500);
                }
                else {
                    $(".js-character-baro").addClass("incorrect");
                    $(".js-character-chello").addClass("incorrect");
                    $(".js-character-millo").addClass("incorrect");

                    // 오답 처리
                    isWorking = true;
                    isClick = true;

                    setTimeout(() => {
                        playSound(sndIncorrectBoing, function () {
                            $(".js-character-baro").removeClass("incorrect correct");
                            $(".js-character-chello").removeClass("incorrect correct");
                            $(".js-character-millo").removeClass("incorrect correct");
                            isWorking = false;
                            isClick = false;
                            lockScreen(isWorking);
                        });

                        $(".js-container").eq(saveArr[0]).removeClass("selected");
                        $(".js-container").eq(saveArr[1]).removeClass("selected");
                        saveArr = [];
                    }, 500);
                }
            }
        }
    })
}

const playPhonics = () => {
    playSound(sndAlphabet + selectedAlphabet.toLowerCase() + ".mp3", function () {
        isWorking = false;
        isClick = false;
        lockScreen(isWorking);

        if (correctCount >= maxCorrectCount) {
            popNext();
        }
    });
}

// 초기화
const resetAll = (pStart) => {
    if (pStart == true) {
    }

    correctCount = 0;
    isWorking = true;

    caseType = "small";
    $(".js-container").removeClass("selected")
    $(".js-card").children('.front').removeClass("mint purple blue");
    $(".js-wrapper-board").removeClass("d-none");
    $(".js-img-space-ship").attr("src", "./images/img_space_ship_01.png");
    $(".js-bg-dark").addClass("d-none");
    $(".js-gear").removeClass("shake d-none");
    $(".js-character-baro").removeClass("correct d-none");
    $(".js-character-chello").removeClass("correct d-none");
    $(".js-character-millo").removeClass("correct d-none");
    $(".js-wrapper-gear").removeClass("repair d-none");
    $(".js-img-space-ship").attr("src", "./images/img_space_ship_01.png").removeClass("take-off");

    setExampleArr();

    setTimeout(() => {
        setAlphabet();
    }, 1000);

    hideNext();

    isWorking = false;
    isClick = false;
    lockScreen(isWorking);

    playBGM(sndBgmA3B);
}
