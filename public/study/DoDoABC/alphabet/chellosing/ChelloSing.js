let correctCount = 0;
let maxCorrectCount = 3;

let exampleArr = [];                        // 보기

// sound effect 
let sndAlphabet = letterSound;                                  // '애' 경로
let sndCorrect = effectAlphabet + "correct_chello.mp3";                // (07) (800 ~ 1000) 맞췄을 때 나는 소리
let sndIncorrectBoing = effectAlphabet + "incorrect_chello.mp3"; // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
let sndCrackling = effectAlphabet + "crackling.mp3";            // (25) (10000) 레코드판 지지직 소리

/* sndCorrect와 sndIncorrectBoing으로 대체하여 사용되지않음. 
let sndFailing = effectAlphabet + "failing.mp3";                // (26) (3000) 실패했을 때 자주 나오는 효과음
let sndSinging = effectAlphabet + "singing.mp3";                // (27) (3000) 신나는 노래소리와 함께 첼로(여자아이)가 노래하는 배경음 
*/

$(document).ready(() => {
    lockScreen(true);
    currentActivity = 'A4B';
    step = 4;
    quizType = "B";
    focusCurrent(currentActivity);

    // 깜빡임 방지를 위해 이미지 미리 로딩
    const imgArr = [
        "./images/bg_correct.png",
        "./images/bg_chello_sing_.png",
        "./images/bg_chello_sing.png",
        "./images/bg_incorrect.png",
        "./images/img_curtain_left.png",
        "./images/img_character_incorrect.png",
        "./images/img_curtain_left_open.png",
        "./images/img_curtain_left.png",
        "./images/img_character_correct.png"
    ]

    doPreloadImages(imgArr, loadQuiz);

    // 음원 딜레이 방지
    $("#preload1").attr('src', sndCrackling);
    $("#preload2").attr('src', sndIncorrectBoing);
    $("#preload4").attr('src', sndCorrect);

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

    // 2. 퀴즈 데이터 세팅
    // 퀴즈 타입이 알파벳인지 아닌지 판별
    try {
        checkGetDataSuccess();
        checkStudyType();

        setupQuiz();
        playBGM(sndBgmA4B);
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

// 퀴즈 세팅 시작
const setupQuiz = () => {
    isWorking = true;
    isClick = true;
    lockScreen(true);

    setExample();

    setClickEvent();

    $(".js-record").on("mouseenter",
        function (event) {
            playEffect1(sndCrackling);
        });

    $(".js-record").on("mouseleave",
        function (event) {
            stopEffect();
        });

    setTimeout(() => {
        let sndUrl = sndAlphabet + quizData.Example1.toLowerCase() + ".mp3";
        playSound(sndUrl,
            function () {
                playSound(sndUrl, function () {
                    isWorking = false;
                    isClick = false;
                    lockScreen(false);
                });
            });
    }, delaysec);

    // 사운드 실패시 문제 풀 수 있도록
    setTimeout(() => {
        isWorking = false;
        isClick = false;
        lockScreen(false);
    }, delaysec);
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
        exampleArr = alphabeExample(quizData.Example1.toUpperCase(), quizData.ExampleCount);

        if (exampleArr.length < 1) {
            throw "No Example Data";
        }

        exampleArr.map((data, index) => {
            $(".js-text-alphabet").eq(index).html(data.toLowerCase());
            $(".js-text-alphabet").eq(index).addClass("small" + data.toLowerCase());  // 알파벳 위치 보정
        })
    }
    catch (e) {
        alert("Set Example Error: " + e);
    }
}

// 클릭 이벤트
const setClickEvent = () => {
    $(".js-record").on("click", (e) => {
        if (isWorking || isClick) {
            return false;
        }
        else {
            isWorking = true;
            isClick = true;
            lockScreen(true);

            const $this = e.currentTarget;
            let isCorrect = false;

            const index = $(".js-record").index($this);
            const answer = $(".js-text-alphabet").eq(index).html().toLowerCase();

            isCorrect = checkAnswer(answer);

            openCurtain(isCorrect);
        }
    });
}

// 정답 체크
const checkAnswer = strAnswer => {
    let correctText = quizData.CorrectText.toLowerCase();

    lockScreen(true);
    stopEffect();

    return (correctText == strAnswer ? true : false);
}

// 정답 체크 후
const openCurtain = isCorrect => {
    if (isCorrect) {
        // O
        $(".js-wrapper-curtain-left").addClass("open"); $(".js-stage").addClass("correct");
        setTimeout(() => { playEffect1(sndCorrect); }, 1000);
    }
    else {
        // X
        $(".js-wrapper-curtain-left").addClass("open"); $(".js-stage").addClass("incorrect");
        setTimeout(() => { playEffect1(sndIncorrectBoing); }, 1000);
    }
}

const afterChelloSing = () => {
    if ($(".js-stage").hasClass("correct")) {
        correctCount++;

        if (correctCount < maxCorrectCount) {

            exampleArr.map((data, index) => {
                $(".js-text-alphabet").eq(index).removeClass("small" + data.toLowerCase());  // 알파벳 위치 보정
            })

            closeCurtain();
            setupQuiz();
        }
        else {
            popNext();
        }
    }
    else if ($(".js-stage").hasClass("incorrect")) {
        closeCurtain();
        setupQuiz();
    }
}

const afterCurtainFold = () => {
    //
}

const closeCurtain = () => {
    $(".js-wrapper-curtain-left").removeClass("open");
    $(".js-stage").removeClass("correct incorrect");
}

const resetAll = pStart => {
    correctCount = 0;
    closeCurtain();
    setupQuiz();
    hideNext();
    playBGM(sndBgmA4B);
}

const playQuestion = () => {
    playEffect1(quizData.Sound1);
}