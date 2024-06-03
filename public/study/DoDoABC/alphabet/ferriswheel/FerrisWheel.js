let correctCount = 0;
let maxCorrectCount = 3;
let exampleArr = [];                        // 보기
let answerArr = [];
let character = "";
let deg = 0;
let spin;
let index;
let drake;
let degRate = 0.72;

// sound effect 
const sndWord = letterWord;                                         // 단어 사운드 경로
const sndCorrect = effectAlphabet + "correct_5.mp3";                  // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectAlphabet + "incorrect_surprise.mp3";   // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
const sndWheek = effectAlphabet + "wheeek.mp3";                     // (08) (500 ~ 600) 문제오픈시 나는 소리
const wheel = effectAlphabet + "ferriswheel.mp3";	                // (08)  (1000) 문제가 완전히 끝나고 열차가 돌아갈 때 신나는 관람차 소리 
const imgWord = "https://wcfresource.a1edu.com/newsystem/image/dodoabc/alphabet/words/";    // 단어 이미지 경로
let imgCorrect = '';

let overTargetId;

$(document).ready(() => {
    lockScreen(true);
    currentActivity = 'A5A';
    step = 5;
    focusCurrent(currentActivity);

    // 깜빡임 방지를 위해 이미지 미리 로딩
    const imgArr = [
        "./images/img_character_baro_correct.png",
        "./images/img_character_baro.png",
        "./images/img_character_baro_incorrect.png",
        "./images/img_character_baro_walk.png",
        "./images/img_character_chello.png",
        "./images/img_character_chello_correct.png",
        "./images/img_character_chello_incorrect.png",
        "./images/img_character_chello_walk.png",
        "./images/img_character_millo_incorrect.png",
        "./images/img_character_millo_correct.png"
    ]

    doPreloadImages(imgArr, loadQuiz);

    // 음원 딜레이 방지
    $("#preload1").attr('src', sndWheek);

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

        $(".js-text-alphabet").html(quizData.Question);
        spin = setInterval(spinWheel, 100);

        setupQuiz();
        playBGM(sndBgmA5A);
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

// 퀴즈 세팅 시작
const setupQuiz = () => {
    setExample();
    setDragEvent();
    setTimeout(() => {
        playEffect1(sndWheek);
    }, 2000);

    $(".js-wrapper-question").addClass("open");

    setTimeout(() => {
        playSound(sndWord + answerArr[correctCount] + ".mp3", function () {
            isWorking = false;
            isClick = false;
            lockScreen(isWorking);
        });
    }, 3000);
}

// 보기 세팅
const setExample = () => {
    try {
        if (quizData.length < 1) {
            throw "No Example Data";
        }
        switch (correctCount) {
            case 0:
                imgCorrect = quizData.Image1;
                break;

            case 1:
                imgCorrect = quizData.Image2;
                break;

            case 2:
                imgCorrect = quizData.Image3;
                break;

        }

        answerArr = quizData.CorrectText.split("|");

        switch (correctCount) {
            case 0:
                exampleArr = quizData.Example1.split("|");
                break;

            case 1:
                exampleArr = quizData.Example2.split("|");
                break;

            case 2:
                exampleArr = quizData.Example3.split("|");
                break;
        }

        exampleArr.push(answerArr[correctCount]);
        exampleArr = shuffle(exampleArr);
        exampleArr.map((data, index) => {
            //let appendHTML = '<img class="question question' + index + '" src="' + (alphabetWordRoot + data) + '.png" />';
            let appendHTML = `<img class="question question${index}" src="${alphabetWordRoot + data}.png" onmousedown="playQuestionSound(${index});" />`;

            $(".js-wrapper-question").append(appendHTML)

            /* 그림 클릭시 음원 재생기능을 아래의 playQuestionSound() 함수로 대체함
            $(".question").on("click", (e) => {
                console.log(`"isWorking =" ${isWorking} "isClick =" ${isWorking}`);
                if (isWorking || isClick) {
                    return false;
                }
                else {
                    const $this = e.currentTarget;
                    index = $(".question").index($this);
                    playEffect1(sndWord + exampleArr[index] + ".mp3");

                    let ssrc = exampleArr[index];
                    console.log(`"sound =" ${ssrc} `);
                }
            });
            */
            //$(".js-wrapper-question").children("img").eq(index).attr("src",  + "");
        })
    }
    catch (e) {
        alert("Set Example Error: " + e);
    }
}

const playQuestionSound = (index) => {
    if (isWorking || isClick) {
        return false;
    }
    else {
        playEffect1(sndWord + exampleArr[index] + ".mp3");
    }
}


// 드래그 & 드롭
const setDragEvent = () => {
    const questionContainer = document.querySelector('.js-wrapper-question');
    const dropTarget = Array.from(document.querySelectorAll('.js-drop-target'));

    drake = dragula(
        // 하단에 애들끼리만 이동가능.
        [questionContainer].concat(dropTarget),
        // 옵션
        {
            revertOnSpill: true,            // 드래그한 대상을 바깥에 흘리면 다시 되돌아오도록
            moves: (el, source) => {
                if (isWorking) {
                    drake.cancel();

                    return false;
                }
                else {
                    if (source.id != "") {
                        drake.cancel();

                        return false;
                    }
                    else {
                        return true;
                    }
                }
            }
        }
    );

    drake.on("drag", () => {
        isClick = true;
    });

    // 드롭 이벤트
    drake.on("over", (el, target) => {
        overTargetId = target.id;
        $('#divresult').html('<p>over : ' + target.id + '</p>');
        isClick = false;
    });

    // 드롭 이벤트
    //drake.on("out", (el, target) => {
    //    overTargetId = "";
    //    $('#divresult').html('<p>out : ' + target.id + '</p>');
    //});

    // 드롭 이벤트
    drake.on("drop", (el, target) => {
        if (target.id == "") {
            drake.cancel();

            isWorking = false;
            lockScreen(isWorking);
        }
        else {
            // 오류수정 (1)
            $('#divresult').html('<p>drop : ' + target.id + ', ' + overTargetId + '</p>');
            if ((target.children.length > 1 && (target.id == "milloRoom" || target.id == "baroRoom" || target.id == "chelloRoom")) || overTargetId != target.id) {
                drake.cancel();

                isWorking = false;
                lockScreen(isWorking);
            }
            else {
                isWorking = true;
                lockScreen(isWorking);

                let isCorrect = false;

                const answer = el.getAttribute("src").replace(alphabetWordRoot, "").replace(".png", "");

                isCorrect = checkAnswer(answer);

                if (isCorrect) {
                    //$('#divresult').html('<p>drop : ' + target.id + '</p>');

                    playEffect1(sndCorrect);
                    $("#" + target.id).prev().children(".js-character").removeClass("d-none")
                    pleasureCharacter();

                    // 오류수정 (1) 관련
                    // drop시 target.children.length 가 0이 되는 경우가 있음 (이론상 1 base)
                    // 약간 멀리서 드롭하면 이미지가 박히지 않아서 추가로 같은걸 2번 넣어줌
                    $("#" + overTargetId).append('<img class="question question' + correctCount + '" src="' + imgCorrect + '" /><img class="question question' + correctCount + '" src="' + imgCorrect + '" />');
                }
                else {
                    playEffect1(sndIncorrectBoing);
                    drake.cancel();
                    dizzyWheel();
                }
            }
        }
    });
}

// 관람차 회전
const spinWheel = () => {
    deg += degRate;

    $(".js-bg-wheel").css({
        "transform": "rotate(" + deg + "deg)",
        "transition": ".1s linear"
    })

    $(".room").css({
        "transform": "rotate(-" + deg + "deg)",
        "transition": ".1s linear"
    })
}

// 정답 체크
const checkAnswer = strAnswer => {
    return (answerArr[correctCount] == strAnswer ? true : false);
}

// 정답 체크 후
const pleasureCharacter = () => {
    correctCount++;
    $(".js-character").addClass("correct");

    setTimeout(() => {
        afterPleasureCharacter();
    }, 1000);
}

const afterPleasureCharacter = () => {
    $(".js-wrapper-question").removeClass("open");
    $(".js-wrapper-question img").remove();

    setTimeout(() => {
        if (correctCount < maxCorrectCount) {
            $(".js-character").removeClass("correct");

            drake.destroy();

            playWord();

            setupQuiz();
        }
        else {
            playWord();
            playEffect1(wheel);
            degRate = 3.5;
            bgmVolume(0.3);
            setTimeout(() => {
                popNext();
            }, 1000);
        }
    }, 1000)
}

const dizzyWheel = () => {
    dizzyCharacter();

    $(".wrapper-room").effect("shake", "slow", () => {
        afterDizzyCharacter();
    });
}

const dizzyCharacter = () => {
    $(".js-character").addClass("incorrect");
}

const afterDizzyCharacter = () => {
    $(".js-character").removeClass("incorrect");

    isClick = false;
    isWorking = false;
    lockScreen(isWorking);
}

const resetCharacter = () => {
    $(".js-character").removeClass("correct incorrect");
}

// 초기화
const resetAll = (pStart) => {
    if (pStart == true) {
    }

    correctCount = 0;
    isWorking = true;
    isClick = true;
    lockScreen(isWorking);

    bgmVolume(0.1);
    degRate = 0.72;
    $(".js-wrapper-question").removeClass("open");
    $(".js-wrapper-question img").remove();

    $(".js-chello").addClass("d-none");
    $(".js-baro").addClass("d-none");
    $(".js-millo").addClass("d-none");
    $(".question").remove();

    drake.destroy();

    setupQuiz();
    hideNext();
    playBGM(sndBgmA5A);
}

const playWord = () => {
    playEffect1(sndWord + answerArr[correctCount - 1] + ".mp3");
}

const playQuestion = () => {
    playEffect1(sndWord + answerArr[correctCount] + ".mp3");
}