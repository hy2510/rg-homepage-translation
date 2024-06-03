let quizDataArr;
let exampleArr = [];                        // 보기
let correctCount = 0;
let maxCorrectCount = 0;
let isCorrect = false;

let splitCorrectText = "";
let string1 = "";
let string2 = "";
let string3 = "";

const sndCorrect = effectPhonics + "correct_boy2.mp3";                   // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectPhonics + "incorrect_boy.mp3";    // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
const sndWalk1 = effectPhonics + "walk1.mp3";                       // (  ) (900 ~ 1100) 뚜벅뚜벅 걷는소리
const sndWalk2 = effectPhonics + "walk2.mp3";                       // (  ) (1300 ~ 1400) 뚜벅뚜벅 걷는소리
const sndWalk3 = effectPhonics + "walk3.mp3";                       // (  ) (2400 ~ 2500) 뚜벅뚜벅 걷는소리
const sndShutter = effectPhonics + "shutter.mp3";                   // (41) (1100 ~ 1300) 후두두두둑 비오는소리

$(document).ready(() => {
    lockScreen(true);
    step = 1;
    quizType = "B";
    currentActivity = "A1B";    // 제일 먼저 세팅해야함.
    
    focusCurrent(currentActivity);

    const imgArr = [
        "./images/img_character_tori_correct.png",
        "./images/img_character_tori_incorrect.png",
        "./images/img_character_tori_walk.png",
        "./images/img_padding.png",
        "./images/img_take_picture.png",
        "./images/img_padding_walk.png"
    ];

    doPreloadImages(imgArr, loadQuiz);

    // 음원 딜레이 방지
    $("#preload1").attr('src', sndWalk1);
    $("#preload2").attr('src', sndWalk2);
    $("#preload3").attr('src', sndWalk3);
    $("#preload4").attr('src', sndShutter);

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
    playBGM(sndBgmA1B);
}

// 퀴즈 세팅 시작
const setupQuiz = () => {
    isClick = true;
    isWorking = true;
    lockScreen(isWorking);

    if (correctCount == 0) {
        $(".bg-tori-explorer").css("transition", "3s");             // 원래대로
    }

    // 2. 퀴즈 데이터 세팅
    // 퀴즈 타입이 알파벳인지 아닌지 판별
    try {
        quizData = quizDataArr[correctCount];
        //console.log(quizData);

        checkGetDataSuccess();
        checkStudyType();

        isCorrect = false;

        setImage();
        setWord();
        setExample();

        setClickEvent();
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

// 예제 세팅
const setImage = () => {
    let appendHtml = "<div class='js-wrapper-img wrapper-img'>";
    appendHtml += "<img class='js-img-question img-question' src='" + quizData.Image1 + "' />";
    appendHtml += "</div>";

    $(".js-wrapper-question").append(appendHtml);
}

const setWord = () => {
    let appendHtml = "<div class='js-wrapper-word wrapper-word'>";

    $(".js-wrapper-word").empty();

    splitCorrectText = quizData.CorrectText.split(quizData.Example1);
    string1 = "<span>" + splitCorrectText[0] + "</span>";
    string3 = "<span>" + splitCorrectText[1] + "</span>";

    if (quizData.Example1.length == 1) {
        string2 = "<span class='js-text-blank text-blank'></span>";
    }
    else if (quizData.Example1.length == 2) {
        string2 = "<span class='js-text-blank text-blank two'></span>";
    }
    else if (quizData.Example1.length == 3) {
        string2 = "<span class='js-text-blank text-blank three'></span>";
    }
    else if (quizData.Example1.length == 4) {
        string2 = "<span class='js-text-blank text-blank three'></span>";
    }
    else if (quizData.Example1.length == 5) {
        string2 = "<span class='js-text-blank text-blank three'></span>";
    }
    else if (quizData.Example1.length == 6) {
        string2 = "<span class='js-text-blank text-blank three'></span>";
    }

    //$(".js-wrapper-word").append(string1 + string2 + string3);

    $(".js-wrapper-question").append(appendHtml + string1 + string2 + string3);
}

const setExample = () => {
    try {
        exampleArr = [];

        exampleArr.push(quizData.Example1);
        exampleArr.push(quizData.Example2);
        exampleArr.push(quizData.Example3);

        exampleArr = shuffle(exampleArr);

        let appendHtml = "";

        exampleArr.map(data => {
            appendHtml += '<div class="js-example example">';
            appendHtml += '<p class="js-text-alphabet text-alphabet">' + data + '</p>';
            appendHtml += '</div >';
        });

        $(".js-wrapper-examples").append(appendHtml);

        playWord();
    }
    catch (e) {
        alert("Set Example Error: " + e);
    }
}

// 클릭 이벤트
const setClickEvent = () => {
    $(".js-example").on("click", () => {
        if (isWorking || isClick) {
            return false;
        }
        else {
            isWorking = true;
            isClick = true;
            lockScreen(isWorking);

            $this = event.currentTarget;
            const index = $(".js-example").index($this);

            const answer = $(".js-example").eq(index).children().html();

            isCorrect = checkAnswer(answer);

            if (isCorrect) {
                correctAction();
            }
            else {
                incorrectAction();
            }
        }
    })
}

// 정답 체크
const checkAnswer = strAnswer => {
    return (quizData.Example1 == strAnswer ? true : false);
}

// 정답 체크 후
const correctAction = () => {
    playSound(sndCorrect,
        function () {
            playWord();
            $(".js-img-question").addClass("bigger");
    });

    $(".js-wrapper-character-tori").addClass("correct");
    $(".js-wrapper-word").empty();

    string2 = `<span style="color:#a50000">${quizData.Example1}</span>`;

    $(".js-wrapper-word").append(string1 + string2 + string3);
}

const nextStep = () => {
    correctCount++;

    setTimeout(() => {
        $(".js-wrapper-question").children().remove();
        $(".js-wrapper-examples").children().remove();

        if (correctCount < maxCorrectCount) {
            toriWalk();
        }
        else {
            takePicture(true);
            setTimeout(() => {
                popNext();
            }, 4000);
        }
    }, 1500);
}

const incorrectAction = () => {
    $(".js-wrapper-character-tori").addClass("incorrect");
    playSound(sndIncorrectBoing, function () { playWord(); });
}

const toriWalk = () => {
    playEffect1(sndWalk3);

    $(".js-wrapper-character-tori").removeClass("correct").addClass("walk");

    switch (correctCount) {
        case 1:
            setButterflies(false);
            setGoggle(true);
            break;

        case 2:
            setGoggle(false);
            break;

        case 3:
            setPadding(true);
            break;
    }

    // 해당 부분 ontransitionend로 tag에 넣을시 bubbling으로 인해 2번 작동함으로 js로 사용.
    $(".js-bg-tori-explorer").one("transitionend", () => {
        $(".js-wrapper-character-tori").removeClass("walk");
        if (correctCount == 3) {
            $(".js-img-walk-padding").addClass("d-none");
            $(".js-img-item-padding").removeClass("d-none");
        }
        setupQuiz();
    });

    $(".js-bg-tori-explorer").addClass("scene0" + correctCount);
}

// 나비 on / off
const setButterflies = bool => {
    !bool ? $(".js-wrapper-butterflies").addClass("d-none") : $(".js-wrapper-butterflies").removeClass("d-none");
}

// 토리 고글
const setGoggle = bool => {   
    if (bool) {
        setTimeout(() => {
            !bool ? $(".js-img-item-goggle").addClass("d-none") : $(".js-img-item-goggle").removeClass("d-none");
            $(".js-wrapper-bubble").removeClass("d-none");
        }, 500);
    } else {
        setTimeout(() => {
            !bool ? $(".js-img-item-goggle").addClass("d-none") : $(".js-img-item-goggle").removeClass("d-none");
            $(".js-wrapper-bubble").addClass("d-none");
        }, 800);
    }
}

// 토리 패딩
const setPadding = bool => {
    setTimeout(() => {
        if (bool) {
            if ($(".js-wrapper-character-tori").hasClass("walk")) {
                //alert('3');
                $(".js-img-walk-padding").removeClass("d-none");
                $(".js-img-item-padding").addClass("d-none");
            }
        }
        else {
            //alert('1');
            $(".js-img-walk-padding").addClass("d-none");
            $(".js-img-item-padding").addClass("d-none");
        }
        //!bool ? $(".js-img-item-padding").addClass("d-none") : $(".js-img-item-padding").removeClass("d-none");
    }, 500);
}

const takePicture = bool => {
    setTimeout(() => {
        playEffect1(sndShutter);
    }, 2500);

    !bool ? $(".js-take-picture").addClass("d-none") : $(".js-take-picture").removeClass("d-none");
}

const playWord = () => {    
    playSound(quizData.Sound1, function () {
        isWorking = false;
        isClick = false;
        if (isCorrect == true) {
            lockScreen(true);
        }
        else {
            lockScreen(false);
        }
        $(".js-card-back").html(quizData.Question);
        $(".js-wrapper-character-tori").removeClass("incorrect");
    });
}

const setInit = () => {    
    $(".bg-tori-explorer").css("transition", "0.1s");           // 빨리 되돌리기
    $(".js-take-picture").addClass("d-none");
    $(".js-bg-tori-explorer").removeClass("scene00 scene01 scene02 scene03 scene04");
    $(".js-wrapper-character-tori").removeClass("correct incorrect");
    $(".js-img-question").removeClass("bigger");
    $(".js-wrapper-word").empty();
}


const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];
    setPadding(false);
    setInit();

    setTimeout(() => {
        setupQuiz();
        playBGM(sndBgmA1A);
        hideNext();
    }, 500);
}
