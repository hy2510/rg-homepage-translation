// 절대경로로 해줘야 인식함
const DOMAINS = "../../include";

const fileList = [
    "/STT_EDU_ENG_DB/SELVY_STT_ENG2014_01.bin",
    "/STT_EDU_ENG_DB/SELVY_STT_ENG2014_02.bin",
    "/STT_EDU_ENG_DB/SELVY_STT_ENG2014_03.bin",
    "/STT_EDU_ENG_DB/SELVY_STT_ENG_M0.bin",
    "/STT_EDU_ENG_DB/SELVY_STT_ENG_M1.bin",
    "/STT_EDU_ENG_DB/SELVY_STT_ENG_M2.bin",
    "/STT_EDU_ENG_DB/SELVY_STT_ENG_M3.bin",
    "/STT_EDU_ENG_DB/SELVY_STT_ENG_M4.bin",
    "/STT_EDU_ENG_DB/SELVY_STT_ENG_M5.bin",
    "/STT_EDU_ENG_DB/SELVY_STT_ENG_M6.bin",
    "/STT_EDU_ENG_DB/SELVY_STT_ENG_M7.bin",
    "/STT_EDU_ENG_DB/PEF_DB.bin",
    "/STT_EDU_ENG_DB/g2p.dat",
    "/STT_EDU_ENG_DB/selvy_grade.dat",
];

var refrcg;
var userrcg;
var buffer;
var stt = "";
var userRcg = "";

let quizDataArr;
let correctCount = 0;
let maxCorrectCount = 0;
let exampleArr = [];                        // 보기
let questionIndex = 0;
let question = '';
let fileIdx = 0;

let filePath = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sightword/sentence/";
let fileData = [];
let fileMp3 = [];

let avgPronunciation;
let avgIntonation;
let avgTiming;

let recordingTime = 0;
const additionSec = 2.0;    // 사운드 길이가 1초이면 녹음 시간은 2초
const drawCircleRate = 10;
const passMark = 50;

let incorrectCnt = 0;

let quizLoaded = false; // 첫번째 에드몽 액션 구분

let recordArr = [
    { isPass: false, binaryRecord: "" },
    { isPass: false, binaryRecord: "" },
    { isPass: false, binaryRecord: "" },
    { isPass: false, binaryRecord: "" }
]

const sndCorrect = effectSightWords + "correct.mp3";            // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectSightWords + "incorrect.mp3";   // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
const sndFlying = effectSightWords + "flying.mp3";                // (12) (900 ~ 1000) 휘익~ 캐릭터가 날아가는 소리

$(document).ready(() => {
    lockScreen(true);
    step = 1;
    quizType = "A";
    currentActivity = "A1A";    // 제일 먼저 세팅해야함.
    
    focusCurrent(currentActivity);
    //hideSpeaker();
    playBGM(sndBgmA1A);

    // 유저가 staff or review 일 때 메뉴에서 현재 학습 강조.
    $("." + currentActivity).addClass("on");

    playSound(sndFlying);

    $(".js-speaker").attr("onclick", "playSentence();");
})

const edmondAppeared = () => {
    if (quizLoaded == false) {
        quizLoaded = true;
        //loadQuizData();
        loadQuizData(step, quizType, setData);
    } else {
        // todo
        alert('???');
    }
}

//$(".carousel").on('slide.bs.carousel', function (e) {
//    if (isWorking || isClick) {
//        return false;
//    }

//    isWorking = true;
//    isClick = true;

//    let index = e.to;

//    if (index == -1) return false;

//    questionIndex = index;

//    // 기존에 통과한 문제는 자유롭게.
//    if (!recordArr[questionIndex].isPass) {
//        $(".js-btn-play").addClass("disabled");
//        $(".carousel-control").addClass("disabled");
//    }

//    // 슬라이드 좌우 버튼
//    if (index <= 0) {
//        $(".carousel-control-prev").addClass("d-none");
//    }
//    else if (index >= maxCorrectCount - 1) {
//        $(".carousel-control-next").addClass("d-none");
//    }
//    else {
//        $(".carousel-control").removeClass("d-none");
//    }

//    $(".js-text-question").html(quizDataArr[index].Question);
//});

//$(".carousel").on('slid.bs.carousel', function (e) {
//    isWorking = false;
//    isClick = false;
//})

const setData = data => {
    // 비지니스 로직
    // 1. 퀴즈 데이터 담기.
    quizDataArr = data;
    maxCorrectCount = quizDataArr.length;
    
    // 2. 셀바스 api 연동
    // 셀바스
    if (localStorage.getItem('install') == 1) {
        SelvySTT_Edu_ENG_Init_async(() => {
            selvySetting();

            // initAudio 성공 시 setupQuiz 호출
            initAudio(setupQuiz);
        });
    }
    else {
        installDB();
    }
}

const nextQuestion = () => {
    motionEdmondWaiting();
    incorrectCnt = 0;
    correctCount++;

    if (correctCount >= maxCorrectCount) {
        popNext();
    }
    else {
        setupQuiz();
    }
}

// 퀴즈 세팅 시작
const setupQuiz = () => {
    // 2. 퀴즈 데이터 세팅
    // 퀴즈 타입이 알파벳인지 아닌지 판별
    try {
        setInit();

        setExample();

        //$('.carousel').carousel();

        isWorking = false;
        isClick = false;

        //SelvySTT_Edu_ENG_Destroy();
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

// 문제 세팅
const setExample = () => {
    let innerHtml = '';
    question = quizDataArr[correctCount].Question;

    motionEdmondWaiting();

    if (quizDataArr[correctCount].Image1 == undefined || quizDataArr[correctCount].Image1 == NaN || quizDataArr[correctCount].Image1 == '') {
        // 문장만
        if (quizDataArr[correctCount].Question.indexOf(' ') >= 0) {
            innerHtml = `<p style="font-size:3.5rem;">${quizDataArr[correctCount].Question}</p>`;
        } else {
            innerHtml = `<p style="font-size:6.5rem;">${quizDataArr[correctCount].Question}</p>`;
        }
    } else {
        // 이미지 & 문장
        innerHtml = `<div><img src="${quizDataArr[correctCount].Image1}" alt=""/> <p style="font-size:3.0rem;">${quizDataArr[correctCount].Question}</p></div>`;
    }

    $(".js-frame").html(innerHtml);
    $(".js-btns").removeClass("d-none");
        
    // 문제별 평가 기준 세팅
    selvySetGrade();    

    // 문제 평가 레퍼런스 세팅
    loadReference(quizDataArr[correctCount].Sound1.replace('mp3', 'dat'));

    // 문제 음원 재생
    setTimeout(() => {
        playSentence();
    }, 1000);
}

const playSentence = () => {
    playSound(quizDataArr[correctCount].Sound1, function () {
        recordingTime = soundDuration * additionSec;
        
        isWorking = false; isClick = false;
        lockScreen(isWorking);
    });
}

const startRecord = () => {
    if (isWorking || isClick) {
        return false;
    }
    else {
        //console.log(`startRecord`);

        isWorking = true;
        isClick = true;
        lockScreen(isWorking);

        $('#divresult').empty();
        
        motionEdmondRecording();

        startRecording();
    }
}

function stopRecord() {
    $('#divresult').empty();

    var practiceStart = function (buffer) {
        var inptext = question.split(" ").join(";") + ";";
        recordArr[questionIndex].binaryRecord = buffer;

        //Practice mode must settext with Chunk mode.
        //alert(inptext);
        var ret = SelvySTT_Edu_ENG_SetText(F_ENG_CHUNK, inptext);

        if (ret == R_ENG_SUCCESS) {
            ret = SelvySTT_Edu_ENG_Recognition_Batch(buffer);

            if (ret == R_ENG_SUCCESS) {
                if (userrcg != null) {
                    userrcg.delete();
                    userrcg = null;
                }
                userrcg = Recognition_Result_ENG();
                SelvySTT_Edu_ENG_Get_Score(userrcg);

                var userEPD = SelvySTT_Edu_ENG_Get_Score_EPD_Buffer(userrcg);
                ret = SelvySTT_Edu_ENG_Assessment(refrcg, window.m_rec_buffer_ref, userrcg, userEPD);

                var txtresult = '';
                if (ret == R_ENG_SUCCESS) {
                    v = Assessment_Result_ENG();
                    SelvySTT_Edu_ENG_Get_Assessment_Result(v);
                    txtresult += '난이도 : ' + quizDataArr[correctCount].Example1 + ', 프로필 : ' + quizDataArr[correctCount].Example2 + '<br />';
                    txtresult += 'Spoken Word: ' + $('#userinputtext').val() + '<br />';
                    txtresult += 'Overall Score : ' + v.overall + '<br/>';

                    txtresult += 'Word_score : ';
                    for (var i = 0; i < userrcg.word_score.length; ++i) txtresult += userrcg.word_score[i] + '&nbsp;&nbsp;';
                    txtresult += '<br/>';

                    txtresult += '&nbsp;' + 'Pronunciation : ' + v.pronunciation_score + '<br/>';
                    txtresult += '&nbsp;' + 'Prosody : ' + v.prosody_score + '<br /> (Intonation: ' + v.intonation_score + ', <br /> Timing: ' + v.timing_score + ', <br />Loudness: ' + v.loudness_score + ')' + '<br/>';

                    txtresult += '&nbsp;&nbsp;' + 'Pronunciation : ';
                    for (var i = 0; i < v.word_cnt; ++i) txtresult += v.pronunciation[i] + '&nbsp;&nbsp;';
                    txtresult += '<br/>';

                    txtresult += '&nbsp;&nbsp;' + 'Intonation : ';
                    for (var i = 0; i < v.word_cnt; ++i) txtresult += v.intonation[i] + '&nbsp;&nbsp;';
                    txtresult += '<br/>';

                    txtresult += '&nbsp;&nbsp;' + 'Timing : ';
                    for (var i = 0; i < v.word_cnt; ++i) txtresult += v.timing[i] + '&nbsp;&nbsp;';
                    txtresult += '<br/>';

                    txtresult += '&nbsp;&nbsp;' + 'Loudness : ';
                    for (var i = 0; i < v.word_cnt; ++i) txtresult += v.loudness[i] + '&nbsp;&nbsp;';
                    txtresult += '<br/>';
                    $('#divresult').html(txtresult);

                    // 정답체크 후 동작
                    if (v.overall >= passMark) {
                        isCorrect = true;
                        correctAction();
                    }
                    else {
                        isCorrect = false;
                        incorrectAction();
                    }
                } else {
                    //alert("Assessment에 실패하였습니다.");
                    $('#divresult').html('<p>SelvySTT_Edu_ENG_Assessment: ' + ret + '</p>');
                    incorrectAction();
                    return;
                }
            } else {
                //alert("Recognition Batch Value is " + ret);
                $('#divresult').html('<p>SelvySTT_Edu_ENG_Recognition_Batch: ' + ret + '</p>');
                incorrectAction();
                return;
            }
        } else {
            //alert("Set Text Value is " + ret);
            $('#divresult').html('<p>SelvySTT_Edu_ENG_SetText: ' + ret + '</p>');
            incorrectAction();
            return;
        }
    }

    stopRecording(practiceStart);
}

const installDB = () => {
    let DBDeleteRequest = window.indexedDB.deleteDatabase("/STT_EDU_ENG_DB");

    DBDeleteRequest.onsuccess = function (event) {
        localStorage.removeItem("install");
        installDatabase();
    };
}

const installDatabase = () => {
    var idx = 0;
    var fileblob = [];

    var addData = function () {
        var db;
        var tstamp = new Date();
        var request = window.indexedDB.open("/STT_EDU_ENG_DB", 21);

        request.onerror = function (event) {
        };

        request.onsuccess = function (event) {
            db = request.result;
            db.close();
        };

        request.onupgradeneeded = function (event) {
            var db = event.target.result;
            var objectStore = db.createObjectStore("FILE_DATA");
            objectStore.createIndex("timestamp", "timestamp", { unique: false });
            var transaction = event.target.transaction;

            for (var i = 0; i < fileList.length; ++i) {
                transaction.objectStore("FILE_DATA").put({ "timestamp": tstamp, "mode": 33206, "contents": fileblob[i] }, fileList[i]);
            }

            localStorage.setItem("install", 1);

            SelvySTT_Edu_ENG_Init_async(() => {
                selvySetting();
                initAudio(setupQuiz);
            });
        }
    }

    var get_bin_fromFile = function (index) {
        var bin_data;
        var xhr = new XMLHttpRequest();
        var addr = DOMAINS.concat(fileList[index]);

        xhr.open("GET", addr, true);
        xhr.responseType = "arraybuffer"

        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status == 404) {
                    // ???
                }

                if (xhr.status === 200 || xhr.status == 0) {
                    fileblob.push(new Uint8Array(xhr.response));
                    index++;

                    if (index < fileList.length) {
                        get_bin_fromFile(index);
                    }
                    else {
                        addData();
                    }
                }
            }
        }
        xhr.send(null);
    }

    get_bin_fromFile(idx);
}

const selvySetting = () => {
    SelvySTT_Edu_ENG_Check_IndexedDB();
}

const selvySetGrade = () => {
    // 난이도 : 0: Reference Data, 1:Beginner, 2: Intermediate, 3: Advanced, 4: Expert
    SelvySTT_Edu_ENG_Set_Level(Number(quizDataArr[correctCount].Example1));

    //North American English: 0(Male), 1(Female), 2(Child), 3(All voice)
    //Korean English: 4(Male), 5(Female), 6(Child), 7(All voice)
    SelvySTT_Edu_ENG_Set_VoiceProfile(Number(quizDataArr[correctCount].Example2));
}

const loadReference = dat => {
    let file = dat;

    if (refrcg) {
        refrcg.delete();
        refrcg = null;
    }

    refrcg = Recognition_Result_ENG();

    let xhr = new XMLHttpRequest();

    xhr.open("GET", file);
    xhr.responseType = "blob";

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
            if (xhr.status === 200 || xhr.status == 0) {
                let fileBlob = xhr.response;
                let reader = new FileReader();

                reader.onloadend = function () {
                    SelvySTT_Edu_ENG_Load_From_Bytes(reader.result, refrcg, function () {
                        if (refrcg.word_cnt > 0) {
                            //alert("set dat");

                            $('#userinputtext').val(refrcg.result_string[0]);
                        }
                    });
                }

                reader.readAsArrayBuffer(fileBlob);
            }
        }
    }

    xhr.send(null);
}

// 정답 체크 후
const correctAction = () => {
    if (recordArr[questionIndex].binaryRecord == "") {
        return false;
    }
    else {
        //isWorking = true; isClick = true; lockScreen(isWorking);
        isWorking = false; isClick = false; lockScreen(isWorking);
        playEffect1(sndCorrect);
        motionEdmondCorrect();

        //playBuffer(recordArr[questionIndex].binaryRecord, () => {
        //    isWorking = false; isClick = false; lockScreen(isWorking);
        //    playEffect1(sndCorrect);
        //    motionEdmondCorrect();
        //});
    }
}

const incorrectAction = () => {
    motionEdmondIncorrect();
    
    playSound(sndIncorrectBoing, function () {
        playSentence();
    });

    incorrectCnt++;

    if (incorrectCnt >= 3) {
        isWorking = false;
        isClick = false;
        lockScreen(isWorking);
        $(".btn03_next").removeClass('d-none');
    }
}


const playRecord = () => {
    playBuffer(recordArr[questionIndex].binaryRecord);
}

const setInit = () => {
    isClick = true;
    isWorking = true;
    lockScreen(isWorking);
    stopAllSound();

    for (let i = 0; i < recordArr.length; i++) {
        recordArr[i].binaryRecord = "";
    }

    $(".js-speaker").removeClass("d-none");
    $(".js-btn_next").addClass("d-none");
    $(".js-edmon_d").removeClass("correct incorrect recording");
}

const resetAll = pStart => {
    correctCount = 0;
    quizData = [];
    exampleArr = [];

    setInit();

    setupQuiz();
    hideNext();
}

const motionEdmondRecording = () => {
    recordingOn();
    $(".btn01_record").addClass("active");
    $(".btn02_play").addClass('d-none');
    $(".btn03_next").addClass('d-none');
    //$("#path").css("animation", `dash ${recordingTime * additionSec / 1000}s linear`);
    //$("#path").addClass('svg1');
    $(".js-edmond").removeClass('edmond_d').removeClass('edmond_w').removeClass('edmond_correct').removeClass('edmond_incorrect').addClass('edmond_record'); 
}

const motionEdmondWaiting = () => {
    $(".btn01_record").removeClass("active");
    $(".btn02_play").addClass('d-none');
    $(".btn03_next").addClass('d-none');
    //$("#path").css("animation", `none`);
    //$("#path").removeClass('svg1');
    $(".js-edmond").removeClass('edmond_record').removeClass('edmond_correct').removeClass('edmond_d').removeClass('edmond_incorrect').addClass('edmond_w');
}

const motionEdmondCorrect = () => {
    $(".btn01_record").removeClass("active");
    $(".btn02_play").removeClass('d-none');
    $(".btn03_next").removeClass('d-none');
    //$("#path").css("animation", `none`);
    //$("#path").removeClass('svg1');
    $(".js-edmond").removeClass('edmond_record').removeClass('edmond_w').removeClass('edmond_d').removeClass('edmond_incorrect').addClass('edmond_correct');
}

const motionEdmondIncorrect = () => {
    $(".btn01_record").removeClass("active");
    $(".btn02_play").addClass('d-none');
    $(".btn03_next").addClass('d-none');
    //$("#path").css("animation", `none`);
    //$("#path").removeClass('svg1');
    $(".js-edmond").removeClass('edmond_record').removeClass('edmond_w').removeClass('edmond_d').removeClass('edmond_correct').addClass('edmond_incorrect');
}

const recordingOn = () => {
    const outline = document.querySelector("#c2");
    const outlineLength = outline.getTotalLength();
    outline.style.strokeDasharray = outlineLength;
    //console.log(`recordingOn`);
    outline.style.strokeDashoffset = -90;

    // duration : 초 * 100
    let duration = recordingTime / drawCircleRate;
    let elapsed = 0;
    animate(elapsed);

    function animate(offset) {
        setTimeout(() => {
            elapsed++;
            if (elapsed > duration) {
                stopRecord();
                elapsed = 0;
                $('.btn01_record').removeClass('active');
                outline.style.strokeDashoffset = 0;
                return;
            }

            animate((elapsed / duration) * outlineLength);
            //console.log(`elapsed : duration = ${elapsed} : ${duration}`);
        }, drawCircleRate);
        outline.style.strokeDashoffset = offset * (-1);
    }
}
