let quizDataArr;
let exampleArr = [];                        // 보기
let correctCount = 0;
let maxCorrectCount = 0;
let isCorrect = false;

const sndCorrect = effectPhonics + "correct_boy3.mp3";                   // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectPhonics + "incorrect_boypapa.mp3";    // (08) (800 ~ 1000) 틀렸을 때 나는 소리
const sndCorrectAfter = effectPhonics + "laughing.mp3";
const sndIncorrectBoingAfter = effectPhonics + "angry_papa.mp3";

const sndWalk1 = effectPhonics + "walk1.mp3";
const sndWalk2 = effectPhonics + "walk2.mp3";
const sndWalk4 = effectPhonics + "walk4.mp3";

$(document).ready(() => {
    lockScreen(true);
    step = 3;
    quizType = "B";
    currentActivity = "A3B";    // 제일 먼저 세팅해야함.
    
    focusCurrent(currentActivity);

    const imgArr = [
        "./images/img_door_correct.png",
        "./images/img_door_incorrect.png",
        "./images/img_character_roro.png",
        "./images/img_character_roro_walk.png",
        "./images/img_character_roro_correct.png",
        "./images/img_character_roro_incorrect.png",
        "./images/bg_forest_door.png"
    ];

    doPreloadImages(imgArr, loadQuiz);

    // 음원 딜레이 방지
    $("#preload1").attr('src', sndWalk1);
    $("#preload2").attr('src', sndWalk2);
    $("#preload3").attr('src', sndWalk4);

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
    playBGM(sndBgmA3B);
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

        checkGetDataSuccess();
        checkStudyType();

        isCorrect = false;

        setWord();
        setExample();
        setClickEvent();
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

// 단어 세팅
const setWord = () => {
    let splitCorrectText = quizData.CorrectText.split(quizData.Question);
    let s1 = splitCorrectText[0];
    let s2 = "<span class='phonetic' style ='color:#a50000'>" + quizData.Question + "</span>";
    let s3 = splitCorrectText[1];

    $(".js-wrapper-word").html(s1+s2+s3);
}


// 예제 세팅
const setExample = () => {
    try {
        if (quizData.length < 1) {
            throw "No Example Data";
        }

        exampleArr.push(quizData.Image1);
        exampleArr.push(quizData.Image2);
        exampleArr.push(quizData.Image3);

        exampleArr = shuffle(exampleArr);

        // 보기
        let appendHtml = "";

        exampleArr.map((data) => {
            appendHtml += '<div class="js-example example" onanimationend="afterDoorOpen()" >';
            appendHtml += '<img src="' + data + '" />';
            appendHtml += '</div >';
        });

        $(".js-wrapper-examples").append(appendHtml);

        setTimeout(() => {
            playWord();
        }, 1000);
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

            let answer = $(".js-example").eq(index).children()[0].getAttribute("src").replace(phonics2WordRoot, "").replace(".png", "");

            $(".js-example").eq(index).addClass("click");

            isCorrect = checkAnswer(answer);

            roroWalk(index);
        }
    });
}

// 정답 체크 후
const checkAnswer = strAnswer => {
    return (quizData.CorrectText == strAnswer ? true : false);
}

// 정답 체크 후
const roroWalk = index => {
    if (index == 0) {
        playEffect1(sndWalk1);
    } else if (index == 1) {
        playEffect1(sndWalk2);
    } else {
        playEffect1(sndWalk4);
    }
    $(".js-wrapper-character").addClass("move" + (index + 1));
    $(".js-character-roro").addClass("walk");
}

const afterRoroAction = () => {
    let clickIndex = 0;

    $(".js-example").map((index) => {
        if ($(".js-example").eq(index).hasClass("click")) {
            clickIndex = index;
        }
    });

    $(".js-character-roro").removeClass("walk");

    if (isCorrect) {

        stopEffect();
        $(".js-example").eq(clickIndex).addClass("correct");
        $(".js-wrapper-character").removeClass("move1 move2 move3");
        $(".js-wrapper-character").addClass("d-none");

        playEffect1(sndCorrectAfter);
        playSound(sndCorrect);
    }
    else {

        stopEffect();
        $(".js-example").eq(clickIndex).addClass("incorrect");
        $(".js-wrapper-character").removeClass("move1 move2 move3");
        $(".js-wrapper-character").addClass("d-none");

        playEffect1(sndIncorrectBoingAfter);
        playSound(sndIncorrectBoing);
    }
}

const afterDoorOpen = () => {
    if (isCorrect) {
        setTimeout(() => {
            playSound(quizData.Sound1,
                function () {
                    correctCount++;

                    if (correctCount < maxCorrectCount) {
                        setTimeout(() => {
                            quizData = [];
                            exampleArr = [];
                            setInit();
                            setupQuiz();
                        }, 1000);
                    }
                    else {
                        popNext();
                    }
                });
            $(".js-wrapper-word").addClass("light");
            $(".js-wrapper-word span").addClass("light");
        }, 1500);
    }
    else {
        setTimeout(() => {
            $(".js-example").removeClass("incorrect click");
            $(".js-wrapper-character").removeClass("d-none");
            $(".js-character-roro").removeClass("d-none");
            playWord();
        }, 1000);
    }
}

const setInit = () => {
    $(".js-wrapper-word").removeClass("light");
    $(".js-example").removeClass("correct click");
    $(".js-wrapper-character").removeClass("d-none");
    $(".js-character-dodo").removeClass("walk");
    $(".js-wrapper-examples").empty();
}

const playWord = () => {
    playSound(quizData.Sound1, function () { isWorking = false; isClick = false; lockScreen(isWorking); });
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];
    setInit();
    setupQuiz();
    playBGM(sndBgmA3B);
    hideNext();
}

const characterAction = () => {
    return;
    knockCnt++;

    if (knockCnt >= 3) {
        knockCnt = 0;
        $(".js-character-roro").addClass("characteract");
        $(".js-character-roro").removeClass("characteract");
    }
}
