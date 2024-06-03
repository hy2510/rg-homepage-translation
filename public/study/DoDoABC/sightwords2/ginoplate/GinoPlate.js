let quizDataArr;
let quizIndex = 0;

// 음원
//const audCorrect = `${SIGHT_WORD_EFFECT_ROOT}/aud_correct_a1a.mp3`;
const audCorrect = `${SIGHT_WORD_EFFECT_ROOT}/correct_gino.mp3`;
const audIncorrect = `${SIGHT_WORD_EFFECT_ROOT}/aud_incorrect_a4b.mp3`;
const audEating = `${SIGHT_WORD_EFFECT_ROOT}/eating.mp3`;

$(document).ready(() => {
    setWorking(true);
    lockScreen(isWorking);

    step = 4;
    quizType = "B";
    currentActivity = `A${step}${quizType}`;

    //getStudyStep();

    const imgArr = [
        //"./images/img_table.png",
        //"./images/img_light_right_02.png",
        //"./images/img_light_right_01.png",
        //"./images/img_light_left_02.png",
        //"./images/img_light_left_01.png",
        //"./images/img_heart.png",
        //"./images/img_food_empty.png",
        "./images/img_character_gino_pizza.gif",
        "./images/img_character_gino_donut.gif",
        "./images/img_character_gino_burger.gif",
        "./images/img_character_ginno_cake.gif",
        "./images/img_character_gino_incorrect.png",
        "./images/img_character_gino_01.png",
        "./images/img_burp.png",
        "./images/gino_pizza.png",
        "./images/gino_hotcake.png",
        "./images/gino_hamburger.png",
        "./images/gino_donut.png",
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
        // 이미지
        $(".js-wrapper-quiz").append(`<img class="img-quiz" src="${quizData.Image1}" />`);

        // 보기
        const shuffle = Math.floor(Math.random() * 2);

        let appendHtml = "";

        if (shuffle) {
            appendHtml += `<div class="wrapper-example">`;
            appendHtml += `<p class="txt-example">${quizData.Example1}</p>`;
            appendHtml += `</div>`;

            appendHtml += `<div class="wrapper-example">`;
            appendHtml += `<p class="txt-example">${quizData.Example2}</p>`;
            appendHtml += `</div>`;
        }
        else {
            appendHtml += `<div class="wrapper-example">`;
            appendHtml += `<p class="txt-example">${quizData.Example2}</p>`;
            appendHtml += `</div>`;

            appendHtml += `<div class="wrapper-example">`;
            appendHtml += `<p class="txt-example">${quizData.Example1}</p>`;
            appendHtml += `</div>`;
        }

        $(".js-wrapper-examples").append(appendHtml);

        setTimeout(() => {
            playSound(quizData.Sound1, setClickEvent);
        }, 1000)
    }
    catch (e) {
        alert(`Set Quiz Error: ${e}`);

        doLogout();
    }
}

const setClickEvent = () => {
    $(".wrapper-example").on("click", function () {
        if (isWorking) return false;

        setWorking(true);
        lockScreen(isWorking);

        $(".wrapper-example").eq($(this).index()).addClass("selected");

        const answer = $(this).children().html();

        if (answer === quizData.Question) {
            correctAction($(this).index());
        }
        else {
            $(".js-character-gino").addClass("incorrect");
            playSound(audIncorrect, incorrectAction);
        }
    })

    setWorking(false);
    lockScreen(isWorking);
}

const fireClickEvent = () => {
    $(".wrapper-example").off("click");
}

const correctAction = correctIndex => {
    fireClickEvent();

    // 애니메이션
    const incorrectIndex = Math.abs(1 - correctIndex);

    $(".wrapper-example").eq(correctIndex).on("transitionend", () => {
        $(".wrapper-example").eq(correctIndex).off("transitionend");
    })

    $(".js-character-gino").removeClass("burger cake donut pizza eat");

    const setFood = () => {
        $(".js-character-gino").addClass("correct");
        $(".js-foods").eq(quizIndex + 1).addClass("appear");

        setTimeout(() => {
            playSound(quizData.Sound1, () => {
                hideFood();
                setTimeout(() => {
                    playEffect1(audEating);
                }, 900);               

                switch (quizIndex) {
                    case 0:
                        $(".js-character-gino").on("animationend", afterGinoAnimationEnd);
                        $(".js-character-gino").addClass("burger");
                        break;

                    case 1:
                        $(".js-character-gino").on("animationend", afterGinoAnimationEnd);
                        $(".js-character-gino").addClass("cake");
                        break;

                    case 2:
                        $(".js-character-gino").on("animationend", afterGinoAnimationEnd);
                        $(".js-character-gino").addClass("donut");
                        break;

                    case 3:
                        $(".js-character-gino").on("animationend", afterGinoAnimationEnd);
                        $(".js-character-gino").addClass("pizza");
                        break;
                }
            });
        }, 1500)
    }
    const hideFood = () => {
        $(".js-foods").removeClass("appear");
    }

    const afterGinoAnimationEnd = () => {
        $(".js-character-gino").off("animationend");

        $(".js-character-gino").on("animationend", () => {
            $(".js-character-gino").off("animationend");

            if (quizIndex == 3) {
                $(".js-burp").on("animationend", () => {
                    $(".js-burp").off("animationend");

                    popNext();
                })

                setTimeout(() => {
                    $(".js-burp").addClass("active"); 
                }, 700)

            }
            else {
                $(".js-heart").on("animationend", () => {
                    $(".js-heart").off("animationend");

                    loadNext();
                })

                $(".js-heart").addClass("active");  
            }          
        });

        if (quizIndex == 3) {
            $(".js-character-gino").addClass("lastEat");
        }
        else {
            $(".js-character-gino").addClass("eat");
        }
    }
    // 애니메이션 end

    playSound(audCorrect, null);

    setFood();

    $(".wrapper-example").eq(correctIndex).addClass("correct");
    $(".wrapper-example").eq(incorrectIndex).addClass("fade");
}

const incorrectAction = () => {
    $(".wrapper-example").removeClass("selected");
    $(".js-character-gino").removeClass("incorrect");
    playSound(quizData.Sound1, () => {
        setWorking(false);
        lockScreen(isWorking);
    });
}

const loadNext = () => {
    quizIndex++;

    $(".js-wrapper-quiz").empty();
    $(".js-wrapper-examples").empty();
    $(".js-character-gino").removeClass("correct burger cake donut pizza eat");
    $(".js-heart").removeClass("active");

    setQuizData();
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

    $(".js-wrapper-quiz").empty();
    $(".js-wrapper-examples").empty();
    $(".js-character-gino").removeClass("correct burger cake donut pizza eat lastEat");
    $(".js-heart").removeClass("active");
    $(".js-burp").removeClass("active"); 

    setQuizData();
    playBGM(sndBgmA3A);

    hideNext();
}