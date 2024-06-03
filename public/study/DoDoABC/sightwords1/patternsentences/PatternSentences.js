let quizDataArr;
let exampleArr = [];                        // 보기
let correctCount = 0;
let maxCorrectCount = 0;
let wordType = "sight";

const sndCorrect = effectSightWords + "correct.mp3";                        // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectSightWords + "incorrect.mp3";         // (08) (800 ~ 1000) 틀렸을 때 나는 소리 

$(document).ready(() => {
    lockScreen(true);

    step = 4;
    quizType = "A";
    currentActivity = "A4A";    // 제일 먼저 세팅해야함.

    
    focusCurrent(currentActivity);

    const imgArr = [];

    doPreloadImages(imgArr, loadQuiz);

    // 유저가 staff or review 일 때 메뉴에서 현재 학습 강조.
    $("." + currentActivity).addClass("on");
});

const loadQuiz = () => {
    loadQuizData(step, quizType, setData);
}

const setData = data => {
    // 비지니스 로직
    // 1. 퀴즈 데이터 담기.
    quizDataArr = data;
    maxCorrectCount = quizDataArr.length;

    setupQuiz();
    playBGM(sndBgmA5A);
    //console.log(data);
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
        //console.log(quizData);

        checkGetDataSuccess();
        checkStudyType();

        isCorrect = false;

        setQuestion();
        setExample();
        setClickEvent();
        
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
    $('.blackcurtain').addClass("d-none");
    $('.wrapper-quiz').addClass("d-none");
    setTimeout(() => {
        lockScreen(false);
    },1000);
}

// 문제 세팅
const setQuestion = () => {
    try {
        if (quizData.length < 1) {
            throw "No Question Data";
        }

        $(".js-wrapper-question").html(quizData.Question);
    }
    catch (e) {
        alert("Set Question Error: " + e);
    }
}

// 보기 세팅
const setExample = () => {
    try {
        if (quizData.length < 1) {
            throw "No Question Data";
        }

        exampleArr = [];

        exampleArr.push(quizData.Image1);
        exampleArr.push(quizData.Image2);
        exampleArr.push(quizData.Image3);

        exampleArr = shuffle(exampleArr);

        let appendHtml = "";

        exampleArr.map(data => {
            appendHtml += "<div class='js-wrapper-example wrapper-example'>";
            appendHtml += "<div class='js-wrapper-img wrapper-img'>";
            appendHtml += "<img src='" + data + "' />";
            appendHtml += "</div>"
            appendHtml += "<div class='wrapper-goma'><div class='goma'></div></div>";
            appendHtml += "</div>";

        });

        $(".js-wrapper-examples").append(appendHtml);
        $(".imgquiz").attr("src", quizData.Image1);

        setTimeout(() => {
            playQuestion();

        }, 1200);
    }
    catch (e) {
        alert("Set Question Error: " + e);
    }
}

// 클릭 이벤트
const setClickEvent = () => {
    $(".js-wrapper-img").on("click", e => {
        if (isWorking || isClick) {
            return false;
        }
        else {
            isClick = true;
            isWorking = true;
            lockScreen(isWorking);
            // 주황색 테두리
            e.currentTarget.classList.add("selected");

            //정답 체크
            const checkAnswer = () => {
                const answer = e.currentTarget.children[0].currentSrc;

                return (quizData.Image1 == answer ? true : false);
            }

            const correctAction = () => {
                e.currentTarget.classList.add("correct");
                //console.log(e.currentTarget.classList);

                setTimeout(() => {
                    playEffect1(sndCorrect);
                }, 200);

                setTimeout(() => {
                    setTimeout(() => {
                        playQuestion();
                    }, 1000);
                    $('.blackcurtain').removeClass("d-none");
                    $('.wrapper-quiz').removeClass("d-none");
                }, 800);

                setTimeout(() => {
                    correctCount++;

                    if (correctCount < maxCorrectCount) {
                        $(".js-wrapper-example").remove();
                        $('.blackcurtain').addClass("d-none");
                        $('.wrapper-quiz').addClass("d-none");

                        setupQuiz();
                    }
                    else {
                        // 끝
                        setTimeout(() => {
                            popNext();
                        }, 2000);
                    }
                }, 3800);
            }

            const incorrectAction = () => {
                lockScreen(true);
                e.currentTarget.classList.add("incorrect");
               
                setTimeout(() => {
                    playEffect1(sndIncorrectBoing);
                    setTimeout(() => {
                        playQuestion();
                    }, 250)
                }, 450)

                setTimeout(() => {
                    $(".js-wrapper-img").removeClass("selected incorrect");
                    isClick = false;
                    isWorking = false;
                    lockScreen(isWorking);
                }, 2000);
                
                
            }

            isCorrect = checkAnswer();

            if (isCorrect) {
                correctAction();
            }
            else {
                incorrectAction();
            }
        }
    })
}

const playQuestion = () => {
    playSound(quizData.Sound1, function () { isWorking = false; isClick = false; lockScreen(isWorking); });
}

const setInit = () => {
    prePos = -1;
    crntPos = -1;
    $(".js-wrapper-example").remove();
    $(".js-wrapper-examples").removeClass("d-none");
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];
    setInit();
    setupQuiz();
    playBGM(sndBgmA5A);
    hideNext();
}
