let quizDataArr;
let exampleArr = [];                        // 보기
let correctCount = 0;
let maxCorrectCount = 0;
let wordType = "sight";

const sndWhoosh = effectSightWords + "whoosh.mp3";                     // (12) (1500) 샤라라랑 도도 날아가는 소리

$(document).ready(() => {
    lockScreen(true);
    step = 1;
    quizType = "A";
    currentActivity = "A1A";    // 제일 먼저 세팅해야함.
    
    focusCurrent(currentActivity);
    hideSpeaker();

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
    //console.log(quizDataArr);
    $(".wrapper-dodo-prev").addClass("flying");
    playEffect1(sndWhoosh);
}

// 인트로 후
const afterIntroPrev = () => {
    $(".wrapper-dodo-prev").removeClass("flying");
    $(".js-wrapper-intro-prev").addClass("d-none");
    $(".js-text-activity").html(capitalize(wordType) + " Words");
    $(".js-text-activity").removeClass("d-none");
    $(".js-wrapper-intro-next").removeClass("d-none");
}

const afterFadeText = () => {
    $(".js-text-activity").addClass("d-none");
    $(".js-wrapper-dodo-next").addClass("exit");
}

const afterIntroNext = () => {
    $(".js-wrapper-intro").addClass("d-none");

    $(".js-wrapper-intro-prev").removeClass("d-none");

    $(".js-wrapper-intro-next").addClass("d-none");
    $(".js-wrapper-dodo-next").removeClass("exit");

    setupQuiz();
}

// 퀴즈 세팅 시작
const setupQuiz = () => {
    isClick = true;
    isWorking = true;
    lockScreen(false);

    // 2. 퀴즈 데이터 세팅
    // 퀴즈 타입이 알파벳인지 아닌지 판별
    try {
        quizData = quizDataArr[correctCount];

        checkGetDataSuccess();
        checkStudyType();

        setQuestion();
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        //doLogout();
    }
}

// 예제 세팅
const setQuestion = () => {
    //console.log(quizData);
    let appendHtml = "";

    if (wordType == "sight") {
        appendHtml += "<div class='js-wrapper-sight-word wrapper-sight-word'>";
        appendHtml += quizData.Question;
        appendHtml += "<div class='box'></div>";
        appendHtml += "</div>";
    }
    else if (wordType == "main") {
        appendHtml += "<div class='js-wrapper-main-word wrapper-main-word'>";
        appendHtml += "<div><img src='" + quizData.Image1 + "'/></div>";
        appendHtml += "<div>" + quizData.Question + "</div>";
        appendHtml += "</div>";
    }

    $(".js-wrapper-word").append(appendHtml);
    $(".js-wrapper-word").removeClass("d-none");

    setSound();
}

// 음원 재생
const setSound = () => {
    // 해당 메서드에서 음원을 재생 후 글자 색을 변경 2초 후 다음 문제로 넘어간다.
    firstPlay();
}

// 첫번째 음원 재생
const firstPlay = () => {
    // play 함수 후 secondPlay 함수 호출
    playSound(quizData.Sound1, secondPlay);
}

// 두번째 음원 재생
const secondPlay = () => {
    // play 함수 후 콜백으로 afterPlaySound 호출
    setTimeout(() => {
        // 글자 노란색
        if (correctCount < 4) {
            $(".js-wrapper-" + wordType + "-word").addClass("highlight");
        }
        else {
            $(".js-wrapper-" + wordType + "-word").addClass("highlight");
        }

        if (quizData.Question.length >= 8) {
            $(".js-wrapper-" + wordType + "-word").addClass("smallHighlight");
        }
        
        playSound(quizData.Sound1, afterPlaySound);
    }, 1000);
}

// 음원 재생 후
const afterPlaySound = () => {
    correctCount++;

    wordType = correctCount < 4 ? "sight" : "main";

    // 노란색 변경 후 2초 뒤
    setTimeout(() => {
        $(".js-wrapper-word").addClass("d-none");

        removeWord();

        if (correctCount < 4) {
            setupQuiz();
        }
        else if (correctCount == 4) {
            wordType = "main";
            $(".wrapper-dodo-prev").addClass("flying");
            playEffect1(sndWhoosh);
            $(".js-wrapper-intro-prev").removeClass("d-none");
            $(".js-wrapper-intro").removeClass("d-none");
        }
        else if (correctCount > 4 && correctCount < 8) {
            setupQuiz();
        }
        else {
            $(".wrapper-dodo-prev").removeClass("flying");
            popNext();
        }
    }, 2000);
}

const removeWord = () => {
    $(".js-wrapper-word").children().remove();
}

const capitalize = str => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

const setInit = () => {
    wordType = "sight";
    $(".js-wrapper-intro").removeClass("d-none");
    $(".wrapper-dodo-prev").addClass("flying");
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];
    setInit();
    playEffect1(sndWhoosh);
    hideNext();
}
