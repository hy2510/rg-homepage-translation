let quizDataArr;
let exampleArr = [];                        // 보기
let imgArr = [];                        // 이미지
let correctCount = 0;                       // 현재 문제의 번호
let intervalCount;                          // 회상? 번호
let maxCorrectCount = 0;
let wordType = "sight";

//let drake;
const sndCorrect = effectSightWords + "correct_all.mp3";                        // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectSightWords + "incorrect_boing_all.mp3";         // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
let transImg = 'https://wcfresource.a1edu.com/newsystem/image/transparency.png';

$(document).ready(() => {
    lockScreen(true);
    $(".js-speaker").addClass("d-none"); //기본 스피커 버튼 삭제
    step = 5;
    quizType = "B";
    currentActivity = "A5B";    // 제일 먼저 세팅해야함.

    
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
    //console.log(data);
    setupQuiz();
    playBGM(sndBgmA5B);
}

// 퀴즈 세팅 시작
const setupQuiz = () => {
    isClick = true;
    isWorking = false;
    lockScreen(isWorking);

    // 2. 퀴즈 데이터 세팅
    // 퀴즈 타입이 알파벳인지 아닌지 판별
    try {
        quizData = quizDataArr[correctCount];
        //console.log(quizData);

        checkGetDataSuccess();
        checkStudyType();

        isCorrect = false;
        intervalCount = 0;

        setDropTarget();
        setExample();
        setClickEvent();

        isClick = false;
        isWorking = false;

    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

// drop target 세팅
const setDropTarget = () => {
    let appendHtml = "";

    // 1번
    appendHtml += "<div class='js-wrapper-drop-target wrapper-drop-target'>";
    appendHtml += "<div class='js-wrapper-character wrapper-character'>";
    appendHtml += "<div class='character character-goma'></div>";
    appendHtml += "</div>";

    appendHtml += "<div class='js-drop-target drop-target' onclick='cancelSelectedCard(this)'>";
    appendHtml += "<img class='img-twinkle' src='./images/img_box_star_02.png' />";
    appendHtml += "<img class='img-num' src='./images/img_num_01.png' />";
    appendHtml += "<img class='js-answer-container answer-container' src='https://wcfresource.a1edu.com/newsystem/image/transparency.png'/>"
    appendHtml += "</div>";
    appendHtml += "</div>";

    // 2번
    appendHtml += "<div class='js-wrapper-drop-target wrapper-drop-target'>";
    appendHtml += "<div class='js-wrapper-character wrapper-character'>";
    appendHtml += "<div class='character character-leoni'></div>";
    appendHtml += "</div>";

    appendHtml += "<div class='js-drop-target drop-target' onclick='cancelSelectedCard(this)'>";
    appendHtml += "<img class='img-twinkle' src='./images/img_box_star_02.png' />";
    appendHtml += "<img class='img-num' src='./images/img_num_02.png' />";
    appendHtml += "<img class='js-answer-container answer-container' src='https://wcfresource.a1edu.com/newsystem/image/transparency.png'/>"
    appendHtml += "</div>";
    appendHtml += "</div>";

    // 3번
    appendHtml += "<div class='js-wrapper-drop-target wrapper-drop-target'>";
    appendHtml += "<div class='js-wrapper-character wrapper-character'>";
    appendHtml += "<div class='character character-gino'></div>";
    appendHtml += "</div>";

    appendHtml += "<div class='js-drop-target drop-target' onclick='cancelSelectedCard(this)'>";
    appendHtml += "<img class='img-twinkle' src='./images/img_box_star_02.png' />";
    appendHtml += "<img class='img-num' src='./images/img_num_03.png' />";
    appendHtml += "<img class='js-answer-container answer-container' src='https://wcfresource.a1edu.com/newsystem/image/transparency.png'/>"
    appendHtml += "</div>";
    appendHtml += "</div>";

    $(".js-wrapper-drop-targets").append(appendHtml);
}

// 보기 세팅
const setExample = () => {
    try {
        if (quizData.length < 1) {
            throw "No Example Data";
        }
        
        let appendHtml1 = appendHtml2 = appendHtml3 = "";

        let playSound1 = "playSound(quizData.Sound1)";
        let playSound2 = "playSound(quizData.Sound2)";
        let playSound3 = "playSound(quizData.Sound3)";

        exampleArr = []; imgArr = []; soundArr = [];
        
        exampleArr.push(appendHtml1); imgArr.push(quizData.Image1); soundArr.push(playSound1);
        exampleArr.push(appendHtml2); imgArr.push(quizData.Image2); soundArr.push(playSound2);
        exampleArr.push(appendHtml3); imgArr.push(quizData.Image3); soundArr.push(playSound3);

        for (let i = 0; i < exampleArr.length; i++) {
            exampleArr[i] +=
                "<div class='js-wrapper-example wrapper-example'>" +
                "<div class='js-example-container example-container'>" +
                "<img class='js-img-example img-example' src='" + imgArr[i] + "' />" +
                "<div class='js-btn-speaker btn-speaker' onclick='" + soundArr[i] + "'></div>" +
                "</div>" +
                "</div>"
        }

        exampleArr = shuffle(exampleArr);

        for (let i = 0; i < exampleArr.length; i++) {
            $(".js-wrapper-examples").append(exampleArr[i]);
        }

    }
    catch (e) {
        alert("Set Example Error: " + e);

        doLogout();
    }
}

// 클릭이벤트
const setClickEvent = () => {
    
    // 하단 카드 클릭 이벤트.
    $(".js-img-example").on("click", function () {
        
        lockScreen(true);
        setTimeout(() => {
            lockScreen(false);
        }, 1000);

        let i = 0;
        const thisIndex = $(".wrapper-examples .js-img-example").index(this);
        const thisImgSrc = $('.js-img-example').eq(thisIndex).prop('src');
        $('.js-example-container').eq(thisIndex).addClass('d-none');

        for (i = 0; i <= 2; i++) {

            const conImgSrc = $('.js-answer-container').eq(i).prop('src');

            if (conImgSrc.indexOf('transparency') != -1) {
                $(".js-answer-container").eq(i).attr("src", thisImgSrc);
                $(".js-answer-container").eq(i).removeClass('d-none');
                break;
            }
        }
        if (i == 2) {

            isCorrect = checkAnswer();

            if (isCorrect) {
                correctAction();
            }
            else {
                incorrectAction();
            }
        }
    });
}

const checkAnswer = () => {

    const imgsrc1 = $('.js-answer-container').eq(0).prop('src');
    const imgsrc2 = $('.js-answer-container').eq(1).prop('src');
    const imgsrc3 = $('.js-answer-container').eq(2).prop('src');

    if (quizData.Image1 == imgsrc1 && quizData.Image2 == imgsrc2 && quizData.Image3 == imgsrc3) {
        return true;
    } else {
        return false;
    }
}

const correctAction = () => {

    lockScreen(true);
    $(".js-wrapper-character").addClass("correct");
    $(".js-wrapper-drop-targets").addClass("show");

    setTimeout(() => {
        playEffect1(sndCorrect);
    }, 200);

    // 다음 문제로
    const goNextQuestion = () => {
        const startReminiscence = () => {
            $(".js-wrapper-drop-target").addClass("shadow");
            $(".js-wrapper-drop-target").eq(intervalCount).removeClass("shadow");

            const afterAction = () => {
                intervalCount++;

                startReminiscence();
            }

            switch (intervalCount) {
                case 0:
                    $(".js-wrapper-example").eq(intervalCount).html(quizData.Example1);
                    playSound(quizData.Sound1, afterAction);
                    break;

                case 1:
                    $(".js-wrapper-example").eq(intervalCount).html(quizData.Example2);
                    $(".js-wrapper-example").eq(intervalCount - 1).html(" "); //이전 text를 지우기
                    playSound(quizData.Sound2, afterAction);
                    break;

                case 2:
                    $(".js-wrapper-example").eq(intervalCount).html(quizData.Example3);
                    $(".js-wrapper-example").eq(intervalCount - 1).html(" ");
                    playSound(quizData.Sound3, afterAction);
                    break;

                case 3:
                    correctCount++;

                    if (correctCount < maxCorrectCount) {
                        
                        $(".js-wrapper-drop-target").remove();
                        $(".js-wrapper-example").remove();
                        $(".js-wrapper-example").html("");
                        
                        setTimeout(() => {
                            setupQuiz();
                        })
                    }
                    else {
                        setTimeout(() => {
                            popNext();
                        }, 1000);
                    }
                    break;
            }
        }

        // 가기 전 
        const doReminiscence = () => {
            setTimeout(() => {
                $(".js-wrapper-character").removeClass("correct");
                $(".js-wrapper-drop-targets").removeClass("show");

                startReminiscence();
            }, 2000)
        }

        doReminiscence();
    }
    goNextQuestion()
}

const incorrectAction = () => {
    lockScreen(true);

    setTimeout(() => {
        playEffect1(sndIncorrectBoing);
    }, 200);

    $(".js-wrapper-drop-targets").addClass("show");

    for (let i = 0; i <= 2; i++) {
        if (imgArr[i] == $('.js-answer-container').eq(i).prop('src')) {
            $(".js-wrapper-character").eq(i).addClass("correct");
        } else {
            $(".js-wrapper-character").eq(i).addClass("incorrect");
        }
    }

    setTimeout(() => {

        $(".js-wrapper-character").removeClass("incorrect");
        $(".js-wrapper-character").removeClass("correct");
        $(".js-wrapper-drop-targets").removeClass("show");

        for (let i = 0; i <= 2; i++) {
            $('.js-example-container').eq(i).removeClass('d-none');
            $(".js-answer-container").eq(i).attr("src", transImg);
        }

        isClick = false;
        isWorking = false;
        lockScreen(false);
    }, 2000);
}

const cancelSelectedCard = (pthis) => {

    const thisIndex = $(".js-drop-target").index(pthis);
    const imgsrc = $('.js-answer-container').eq(thisIndex).prop('src');

    if (imgsrc.indexOf('transparency') != -1) {
        return true;
    } else {
        $(".js-answer-container").eq(thisIndex).attr("src", transImg);

        for (let i = 0; i <= 2; i++) {
            if (imgsrc == $('.js-img-example').eq(i).prop('src')) {
                $('.js-example-container').eq(i).removeClass('d-none');
                return true;
            }
        }
    }
}

const setInit = () => {
    $(".js-wrapper-example").remove();
    $(".js-example-container").remove();
    $(".js-wrapper-drop-target").remove();
    $(".js-wrapper-examples").removeClass("d-none");
}

const resetAll = pStart => {
    correctCount = 0;
    exampleArr = [];
    setInit();
    setupQuiz();
    playBGM(sndBgmA5B);
    hideNext();
}
