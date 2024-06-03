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

let sound;
let audioDuration = 0;
let isDurationChange = true;
const wordAdditionSec = 2;    // 사운드 길이가 1초이면 녹음 시간은 2초
const sentenceAdditionSec = 1.8;

let quizDataArr;
let maxQuizCount = 0;
let exampleArr = [];                        // 보기
let quizIndex = 0;
let fileIdx = 0;

let filePath = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sightword/sentence/";
let fileData = [];
let fileMp3 = [];

let avgPronunciation;
let avgIntonation;
let avgTiming;

let isPass = false;
let recordCnt = 0;

const passMark = 50;

// 음원
const sndBgmA1A = `${SIGHT_WORD_BGM_ROOT}/bgm_sw2_a1a.mp3`;
const audLetterEnvelope = `${SIGHT_WORD_EFFECT_ROOT}/aud_envelope.mp3`;
const audDearDodo = `${SIGHT_WORD_EFFECT_ROOT}/aud_deardodo.mp3`;
const audPopEdmond = `${SIGHT_WORD_EFFECT_ROOT}/aud_pop_edmond.mp3`;
const audYourFriendEdmon = `${SIGHT_WORD_EFFECT_ROOT}/aud_yourfriendedmond.mp3`;
const audCastingSpell = `${SIGHT_WORD_EFFECT_ROOT}/aud_casting_spell.mp3`;
const audCorrect = `${SIGHT_WORD_EFFECT_ROOT}/aud_correct_a1a.mp3`;
const audIncorrect = `${SIGHT_WORD_EFFECT_ROOT}/aud_incorrect_a1a.mp3`;

let recordArr = [
    { isPass: false, binaryRecord: "" },
    { isPass: false, binaryRecord: "" },
    { isPass: false, binaryRecord: "" },
    { isPass: false, binaryRecord: "" },
    { isPass: false, binaryRecord: "" },
    { isPass: false, binaryRecord: "" },
    { isPass: false, binaryRecord: "" },
    { isPass: false, binaryRecord: "" }
]

$(document).ready(() => {
    lockScreen(true);
    hideSpeaker();

    step = 1;
    quizType = "A";
    currentActivity = `A${step}${quizType}`;   // 제일 먼저 세팅해야함.

    

    focusCurrent(currentActivity);

    // 유저가 staff or review 일 때 메뉴에서 현재 학습 강조.
    $("." + currentActivity).addClass("on");

    $(".js-btn-record").easyPieChart({
        barColor: '#ba00ff',
        trackColor: false,
        scaleColor: false,
        lineCap: 'butt',
        lineWidth: 6,
        size: 108, // 차트크기
        animate: {
            duration: audioDuration,
            enabled: true
        },
        onStop: function (from, to) {
            chart.disableAnimation();
            chart.update(0);

            stopRecord();
        }
    })

    const chart = window.chart = $('.js-btn-record').data('easyPieChart');

    const imgArr = [];

    doPreloadImages(imgArr, loadQuiz);
});

const loadQuiz = () => {
    loadQuizData(step, quizType, setData);
}

const setData = data => {
    // 비지니스 로직
    // 1. 퀴즈 데이터 담기.
    quizDataArr = data;
    maxQuizCount = quizDataArr.length;

    // 2. 셀바스 api 연동
    // 셀바스
    if (localStorage.getItem('install') == 1) {
        SelvySTT_Edu_ENG_Init_async(() => {
            selvySetting();
            // initAudio 성공 시 setupQuiz 호출
            initAudio(setLetterEvent);
        });
    }
    else {
        installDB();
    }
}

const setLetterEvent = () => {
    $(".js-area-letter").on("click", () => {
        openLetter();
    })

    playBGM(sndBgmA1A);
    playSound(audLetterEnvelope, null, 0);
    lockScreen(false);
}

const openLetter = () => {
    $(".js-letter-open").on("animationend", () => {
        afterOpenLetter();
    })

    $(".js-wrapper-gif").remove();
    $(".js-letter-open").removeClass("d-none");
}

const afterOpenLetter = () => {
    $(".js-letter-open").off("animationend");

    $(".js-letter-hand").on("animationend", () => {
        afterGribLetter();
    })

    $(".js-wrapper-letter").addClass("open");
    $(".js-letter-hand").removeClass("d-none");
}

const afterGribLetter = () => {
    $(".js-letter-hand").off("animationend");

    playSound(audPopEdmond, () => {
        stopBGM();
        playDear();
    });

    $(".js-character-edmond").removeClass("d-none");
    $(".js-text-letter").removeClass("d-none");
}

const playDear = () => {
    playSound(audDearDodo, () => {
        $(".js-character-edmond").addClass("d-none");
        $(".js-text-letter").html("Your friend, EDMOND.");
        $(".js-text-letter").addClass("d-none");
        $(".js-letter-hand").addClass("d-none");

        setTimeout(() => {
            setupQuiz();
        }, 1000);
    });
}

const playBye = () => {
    $(".js-character-edmond").removeClass("d-none");
    playSound(audPopEdmond, null);

    playSound(audYourFriendEdmon, () => {
        $(".js-character-edmond").addClass("end");
        playSound(audCastingSpell, null);

        setTimeout(() => {
            $(".js-img-wand").removeClass("d-none");

            setTimeout(() => {
                popNext();
            }, 1500)
        }, 1100);
    })

    $(".js-wrapper-activity").addClass("d-none");
    $(".js-letter-hand").removeClass("d-none");
    $(".js-text-letter").removeClass("d-none");
}

// 퀴즈 세팅 시작
const setupQuiz = () => {
    // 2. 퀴즈 데이터 세팅
    // 퀴즈 타입이 알파벳인지 아닌지 판별
    try {
        setInit();
    }
    catch (e) {
        alert("Setup Quiz Error: " + e);

        doLogout();
    }
}

const setInit = () => {
    setWorking(true);
    lockScreen(isWorking);

    for (let i = 0; i < recordArr.length; i++) {
        recordArr[i].binaryRecord = "";
    }

    showSpeaker();
    setQuestion();
}

const setQuestion = () => {
    if (quizIndex < 4) {
        $(".js-text-question").html(quizDataArr[quizIndex].Question);
    }
    else {
        $(".js-wrapper-img").append(`<img src="${quizDataArr[quizIndex].Image1}" />`);
        $(".js-text-question").html(quizDataArr[quizIndex].Question).addClass("sentence");
    }

    // 문제별 평가 기준 세팅
    selvySetGrade();

    // 문제 평가 레퍼런스 세팅
    loadReference(quizDataArr[quizIndex].Sound1.replace('mp3', 'dat'));

    // 녹음 버튼 이벤트 바인딩
    $(".js-btn-record").off("click");
    $(".js-btn-record").on("click", () => {
        if (isWorking) {
            return false;
        }

        startRecord();
    })

    isDurationChange = true;

    // 음원 재생
    //playAudio(quizDataArr[quizIndex].Sound1, function () { afterPlayAudio(); startRecord(); });   // 문제 음원 재생 후 바로 녹음 시작
    playAudio(quizDataArr[quizIndex].Sound1, afterPlayAudio);   // 문제 음원만 재생

    $(".js-wrapper-activity").removeClass("d-none");
}

const playQuestion = () => {
    setWorking(true);
    lockScreen(isWorking);

    playAudio(quizDataArr[quizIndex].Sound1, afterPlayAudio);
}

const playAudio = (pSrc, pEndFun, loop = 1) => {
    setWorking(true);

    if (sound != undefined && sound != NaN) {
        sound.Stop();
    }

    if (pEndFun) {
        sound = SoundObj(
            {
                src: pSrc,
                repeat: loop,
            },
            undefined,
            pEndFun
        );
    }
    else {
        sound = SoundObj(
            {
                src: pSrc,
                repeat: 1,
            },
            undefined,
            () => {
                setWorking(false);
            }
        );
    }

    sound.Play();
};

const afterPlayAudio = () => {
    setWorking(false);

    $(".js-wrapper-btns").removeClass("d-none");
    lockScreen(isWorking);
}

const startRecord = () => {
    if (isWorking) {
        return false;
    }

    console.log("start recording");
    isDurationChange = true;
    setWorking(true);
    lockScreen(isWorking);

    startRecording();

    $(".btns").addClass("d-none");
    //$(".js-btn-record").css("animation-duration", `${audioDuration / 1000}s`);
    $(".js-btn-record").removeClass("d-none").addClass("recording");


    //console.log(audioDuration);
    //console.log(chart);
    recordCnt++;
    chart.options.animate.duration = audioDuration;
    chart.enableAnimation();
    chart.update(100);
}

function stopRecord() {
    //console.log("stop record");
    var practiceStart = function (buffer) {
        var inptext = $('#userinputtext').val().split(" ").join(";") + ";";
        recordArr[quizIndex].binaryRecord = buffer;

        //Practice mode must settext with Chunk mode.
        //console.log(inptext);
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
                //console.log(userrcg);
                var userEPD = SelvySTT_Edu_ENG_Get_Score_EPD_Buffer(userrcg);
                ret = SelvySTT_Edu_ENG_Assessment(refrcg, window.m_rec_buffer_ref, userrcg, userEPD);
                var txtresult = '';

                //console.log(userrcg);

                if (ret == R_ENG_SUCCESS) {
                    v = Assessment_Result_ENG();
                    SelvySTT_Edu_ENG_Get_Assessment_Result(v);
                    //txtresult += '난이도 : ' + quizDataArr[quizIndex].Example1 + ', 프로필 : ' + quizDataArr[quizIndex].Example2 + '<br />';
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

                    if (v.overall >= passMark) {
                        isCorrect = true;
                        correctAction();
                    }
                    else {
                        isCorrect = false;
                        incorrectAction();
                    }
                } else {
                    //console.log('Assessment failed: ret(' + r + '), status(' + st + ')');
                    //alert("Assessment에 실패하였습니다.");
                    playBuffer(recordArr[quizIndex].binaryRecord, () => {
                        incorrectAction();
                    });
                    $('#divresult').html('<p>SelvySTT_Edu_ENG_Assessment: ret(' + r + '), status(' + st + ')</p>');
                }
            } else {
                //alert("Recognition Batch Value is " + ret);
                playBuffer(recordArr[quizIndex].binaryRecord, () => {
                    incorrectAction();
                });
                $('#divresult').html('<p>SelvySTT_Edu_ENG_Recognition_Batch: ' + ret + '</p>');
            }
        } else {
            //alert("Set Text Value is " + ret);
            playBuffer(recordArr[quizIndex].binaryRecord, () => {
                incorrectAction();
            });
            $('#divresult').html('<p>SelvySTT_Edu_ENG_SetText: ' + ret + '</p>');
        }
    }

    stopRecording(practiceStart);
}

// 정답 체크 후
const correctAction = () => {
    isDurationChange = false;
    isPass = true;
    $(".js-btn-record").removeClass("recording");
    $(".btns").removeClass("d-none");

    $(".js-btn-play").on("click", () => {
        playRecord();
    })

    $(".js-btn-next").on("click", () => {
        $(".wrapper-letter").removeClass("correct");
        goNext();
    })

    $(".wrapper-letter").addClass("correct");

    setWorking(false);
    lockScreen(isWorking);

    playSound(audCorrect, () => {
        $(".wrapper-letter").removeClass("correct");
    });
}

const incorrectAction = () => {
    isDurationChange = false;
    $(".js-btn-play").off("click");
    $(".js-btn-record").removeClass("recording");
    $(".js-btn-play").addClass("d-none");

    if (!recordArr[quizIndex].binaryRecord && recordArr[quizIndex].binaryRecord != "") {
        playBuffer(recordArr[quizIndex].binaryRecord, () => {
            playSound(audIncorrect, () => {
                $(".js-btn-record").removeClass("d-none");

                if (isPass || checkRecordCnt()) {
                    $(".js-btn-next").off("click")
                    $(".js-btn-next").on("click", () => {
                        $(".wrapper-letter").removeClass("correct");
                        goNext();
                    })

                    $(".js-btn-next").removeClass("d-none");
                }

                $(".wrapper-letter").removeClass("incorrect");

                setWorking(false);
                lockScreen(isWorking);
            });

            $(".wrapper-letter").addClass("incorrect");
        });
    }
    else {
        $(".wrapper-letter").addClass("incorrect");
        playSound(audIncorrect, null);

        setTimeout(() => {
            $(".js-btn-record").removeClass("d-none");

            if (isPass || checkRecordCnt()) {
                $(".js-btn-next").off("click")
                $(".js-btn-next").on("click", () => {
                    $(".wrapper-letter").removeClass("correct");
                    goNext();
                })

                $(".js-btn-next").removeClass("d-none");
            }

            $(".wrapper-letter").removeClass("incorrect");

            setWorking(false);
            lockScreen(isWorking);
        }, 1500)
    }
}

const playRecord = () => {
    if (isWorking) {
        return false;
    }

    setWorking(true);
    lockScreen(isWorking);

    //$(".js-btn-play").addClass("active");

    playBuffer(recordArr[quizIndex].binaryRecord, () => {
        //$(".js-btn-play").removeClass("active");

        if (isPass) {
            $(".js-btn-next").removeClass("d-none");
        }

        setWorking(false);
        lockScreen(isWorking);
    });
}

const goNext = () => {
    if (isWorking) {
        return false;
    }

    setWorking(true);
    lockScreen(isWorking);

    isPass = false;
    $(".js-btn-play").off("click");
    $(".js-btn-next").off("click");

    $(".btns").addClass("d-none");
    $(".js-btn-record").removeClass("d-none");

    quizIndex++;
    recordCnt = 0;

    if (quizIndex >= maxQuizCount) {
        playBye();
    }
    else {
        setQuestion();
    }
}

const checkRecordCnt = () => {
    return recordCnt > 2 ? true : false;
}

// 상태값 변경
const setWorking = state => {
    isWorking = state;
}

/********************** 셀바스 *************************/
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
                initAudio(setLetterEvent);
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
    SelvySTT_Edu_ENG_Set_Level(Number(quizDataArr[quizIndex].Example1));

    //North American English: 0(Male), 1(Female), 2(Child), 3(All voice)
    //Korean English: 4(Male), 5(Female), 6(Child), 7(All voice)
    SelvySTT_Edu_ENG_Set_VoiceProfile(Number(quizDataArr[quizIndex].Example2));
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

const SoundObj = (pObj, pFunStartPlay, pFunEndPlay) => {
    this.isplay = false;
    this.infinity = false;

    try {
        if (pObj != undefined) {
            this.audAtt = pObj;
            this.StartFun = pFunStartPlay;
            this.EndFun = pFunStartPlay;
            this.repeat = audAtt.repeat;
            this.audio = new Audio(audAtt.src);

            if (repeat < 0) {
                alert("repeat must be bigger than 0");

                return undefined;
            }
            else if (this.repeat == 0) {
                this.infinity = true;
            }

            this.Play = function () {
                audio.addEventListener("ended", function () {
                    repeat -= 1;

                    if (repeat > 0 || infinity) {
                        audio.play();
                    }
                    else {
                        // Stop Sound
                        isplay = false;

                        if (pFunEndPlay != undefined) {
                            pFunEndPlay();
                        }
                    }
                });

                audio.addEventListener("timeupdate", function () {
                    if (isDurationChange)
                        audioDuration = Math.ceil(audio.duration * 1000 * (quizIndex < 4 ? wordAdditionSec : sentenceAdditionSec));

                    //console.log(audioDuration);
                    if (isplay == false) {
                        // Play Sound
                        isplay = true;

                        if (pFunStartPlay != undefined) {
                            pFunStartPlay();
                        }
                    }
                });

                audio.volume = 1;
                audio.load();
                audio.play();
            };

            this.Stop = function () {
                audio.setAttribute("src", "");
                audio.addEventListener("timeupdate", null);
                audio.pause();

                if (audio.duration) {
                    audio.currentTime = 0;
                }

                isplay = false;
            };

            this.Pause = function () {
                alert("Pause");
            };
        }
    } catch (e) {
        alert(e);
    }

    return this;
};

const resetAll = pStart => {
    quizIndex = 0;

    $(".js-wrapper-img").empty();
    $(".js-text-question").removeClass("sentence");

    $(".js-text-letter").addClass("d-none");
    $(".js-letter-hand").addClass("d-none");
    $(".js-img-wand").addClass("d-none");
    $(".js-character-edmond").addClass("d-none").removeClass("end");

    $(".js-wrapper-activity").removeClass("d-none");

    setQuestion();
    playBGM(sndBgmA1A);

    hideNext();
}