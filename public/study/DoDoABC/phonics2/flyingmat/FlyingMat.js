let quizDataArr;
let exampleArr = [];                        // 보기
let correctCount = 0;
let maxCorrectCount = 0;
let isCorrect = false;
let drake;

const sndCorrect = effectPhonics + "correct_yeah.mp3";                   // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectPhonics + "incorrect_dodo2.mp3";    // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
const sndSelect = effectPhonics + "select.mp3";
const sndWhoosh = effectPhonics + "whoosh.mp3";                      // (12) (1000 ~ 1500) 씨~잉 양탄자 날아가는 소리
const sndArrive = effectPhonics + "arrive.mp3";                      // (  ) (1000 ~ 1500) 위이이이잉 양탄자 날아오는 소리
let characterNumArr = [0, 1, 2];

$(document).ready(() => {
    lockScreen(true);
    step = 2;
    quizType = "A";
    currentActivity = "A2A";    // 제일 먼저 세팅해야함.
    
    focusCurrent(currentActivity);

    const imgArr = [
        "./images/flying_mat0.png",
        "./images/flying_mat1.png",
        "./images/flying_mat2.png",
        "./images/img_character_dodo_incorrect.png"
    ];

    doPreloadImages(imgArr, loadQuiz);

    // 음원 딜레이 방지
    $("#preload1").attr('src', sndWhoosh);
    $("#preload2").attr('src', sndArrive);

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
    playBGM(sndBgmA2A);
    //console.log(quizDataArr);
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

        setQuestion();
        setExample();
        setClickEvent();
        createDodo();
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

// 퀴즈 세팅
const setQuestion = () => {
    let textBlankNum = quizData.Example1.length;
    let textBlank = "";

    for (let i = 0; i < textBlankNum; i++) {
        textBlank += "&#12288;";   // 　공백 유니코드(U+3000)
    }

    let appendHtml = "<img src='" + quizData.Image1 + "'/>";
    appendHtml += "<p>";
    appendHtml += quizData.Question.replace("_", "<span class='js-text-blank text-blank'>" + textBlank + "</span>");
    appendHtml += "</p>";

    $(".js-wrapper-question").empty();
    $(".js-wrapper-question").append(appendHtml);

    $(".js-text-blank").css("width", $(".js-text-blank").css("width").replace("px", "") - (textBlankNum * 20) + "px");  // 빈칸 넓이 줄임
}

// 보기 세팅
const setExample = () => {
    try {
        exampleArr = [];

        exampleArr.push(quizData.Example1);
        exampleArr.push(quizData.Example2);
        exampleArr.push(quizData.Example3);

        exampleArr = shuffle(exampleArr);

        characterNumArr = shuffle(characterNumArr);

        let appendHtml = "";    // for Example(cloud)
        let appendHtml2 = "";   // for flying-mat

        exampleArr.map((data, index) => {
            appendHtml += '<div class="wrapper-example character' + characterNumArr[index] + '">';
            /*appendHtml += '<div class="wrapper-cloud cloud' + (index) + '">' + data + '</div>';*/
            appendHtml += '<div onmouseover="this.style.color=\'#ff9000\';" onmouseout = "this.style.color=\'black\';" class="wrapper-cloud cloud' + (index) + '">' + data + '</div>';

            appendHtml += '<div class="js-drop-target drop-target"></div>';
            appendHtml += '</div >';
            appendHtml2 += '<div class="js-flying-going-mat js-wrapper-flying-mat' + characterNumArr[index] + ' wrapper-flying-mat' + characterNumArr[index] + ' c' + index + ' d-none" ></div>';
            $(".js-wrapper-flying-mat" + characterNumArr[index]).addClass("c" + index);
        });

        $(".js-wrapper-examples").empty();
        $(".js-wrapper-flying-going-mat").empty();
        $(".js-wrapper-examples").append(appendHtml);
        $(".js-wrapper-flying-going-mat").append(appendHtml2);

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
    $(".wrapper-cloud").on("click", () => {
        if (isWorking || isClick) {
            return false;
        }
        else {
            isWorking = true;
            isClick = true;
            lockScreen(true);

            $this = event.currentTarget;
            const index = $(".wrapper-cloud").index($this);
            const answer = $(".wrapper-cloud").eq(index).html();
            isCorrect = checkAnswer(answer);
            dodoFly(index);
        }
    });
}

// 정답 체크
const checkAnswer = strAnswer => {
    return (quizData.Example1 == strAnswer ? true : false);
}

// 정답 체크 후
const dodoFly = (pIndex) => {
    playEffect1(sndArrive);
    if (pIndex == 0) {
        $(".js-wrapper-mat").animate({ top: 345, left: 490 }, 1200,
            function () {
                afterFly(pIndex);
            });
    } else if (pIndex == 1) {
        $(".js-wrapper-mat").animate({ top: 125, left: 710 }, 1300,
            function () {
                afterFly(pIndex);
            });
    } else if (pIndex == 2) {
        $(".js-wrapper-mat").animate({ top: 265, left: 995 }, 1400,
            function () {
                afterFly(pIndex);
            });
    }
}

const afterFly = (pIndex) => {
    if (isCorrect) {
        correctAction(pIndex);
    }
    else {
        incorrectAction(pIndex);
    }
}

// 정답 체크 후
const correctAction = (pIndex) => {
    displayFlyingMat(pIndex);
}

const incorrectAction = index => {
    $(".wrapper-example").eq(index).addClass("incorrect");
    $(".character-dodo").addClass("incorrect");

    playSound(sndIncorrectBoing, function () {
        setTimeout(() => {
            setInit();
            playWord();
        }, 600);
    });
}

const afterAction = (pIndex) => {
    correctCount++;
    if (isCorrect) {
        if (correctCount < maxCorrectCount) {
            setTimeout(() => {
                setInit();
                setupQuiz();
            }, 1000)
        }
        else {
            setTimeout(() => {
                popNext();
            });
        }
    }
    else {
        setInit();
    }
}

const createDodo = () => {
    let appendHtml = '<div class="js-flying-mat flying-mat"><div class="character-dodo"></div></div >';
    $(".js-wrapper-mat").append(appendHtml);
}

const displayFlyingMat = (pIndex) => {
    $(".js-flying-mat").addClass("d-none");                                                 // drop된 도도-매트 안보이게
    $(".js-wrapper-flying-mat" + characterNumArr[pIndex]).removeClass("d-none");            // drop된 위치의 도도-캐릭터-매트 보이게
    $(".wrapper-example").eq(pIndex).removeClass("character" + characterNumArr[pIndex]);    // drop된 위치의 구름 뒤 캐릭터 안보이게

    playSound(sndCorrect,
        function () {
            playSound(quizData.Sound1, function () { flyingOut(pIndex); });                 // 단어음원 들려준 후 날아감
            $(".js-wrapper-question").empty();
            //$(".js-wrapper-question").append("<img src='" + quizData.Image1 + "' class='bigger'/><p class='js-te'>" + quizData.CorrectText + "</p>");
            
            $(".js-wrapper-question").append("<img src='" + quizData.Image1 + "' class='bigger'/>");
            let splitCorrectText = quizData.CorrectText.split(quizData.Example1);
            let s1 = "<span>" + splitCorrectText[0] + "</span>";
            let s2 = "<span style ='color:#a50000'>" + quizData.Example1 + "</span>";
            let s3 = "<span>" + splitCorrectText[1] + "</span>";
            $(".js-wrapper-question").append("<p class='js-te'>" +s1+s2+s3+ "</p>");
    });
}

const flyingOut = (pIndex) => {
    $(".js-wrapper-flying-mat" + characterNumArr[pIndex]);
    playEffect1(sndWhoosh);
    $(".js-wrapper-flying-mat" + characterNumArr[pIndex]).animate({ left: 1400 }, 2500,
        function () {
            afterAction();
        });
}

const playWord = () => {
    playSound(quizData.Sound1, function () {
        isWorking = false;
        isClick = false;
        lockScreen(isWorking);
    });
}

const setInit = () => {
    $(".character-dodo").removeClass("incorrect");
    $(".wrapper-example").removeClass("incorrect");
    $(".wrapper-mat").removeClass("d-none");
    $(".wrapper-mat").css("top", "230px");
    $(".wrapper-mat").css("left", "100px");
    lockScreen(true);
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];
    setInit();
    setupQuiz();
    playBGM(sndBgmA2A);
    hideNext();
}
