let currentActivity = '';   // 각 Activity에서 세팅됨
let currentLand = 'songandchant';
let effectSightWords = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/effect/";
let letterSightWords = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/letter/";
let letterSound = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/sound/";
let letterWord = "https://wcfresource.a1edu.com/newsystem/sound/words/";
let sndBgmA1A = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/bgm/bgm_swd_a1a.mp3";
let sndBgmA1B = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/bgm/bgm_swd_a1b.mp3";
let sndBgmA2A = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/bgm/bgm_swd_a2a.mp3";
let sndBgmA2B = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/bgm/bgm_swd_a2b.mp3";
let sndBgmA3A = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/bgm/bgm_swd_a3a.mp3";
let sndBgmA3B = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/bgm/bgm_swd_a3b.mp3";
let sndBgmA4A = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/bgm/bgm_swd_a4a.mp3";
let sndBgmA4B = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/bgm/bgm_swd_a4b.mp3";
let sndBgmA5A = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/bgm/bgm_swd_a5a.mp3";
let sndBgmA5B = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sondandchant/bgm/bgm_swd_a5b.mp3";
let myVideo;
let quizDataArr;
let correctCount = 0;
let maxCorrectCount = 0;
let isCorrect = false;
let isRecorded = false;
let objScript;
let preMsec = -1;
let crntStatus = "sing";    // "record"
let bRecording = false;
let isNext = false;
let obj = '';

const sndCorrect = effectSightWords + "areyouready.mp3";                   // (07) (800 ~ 1000) 맞췄을 때 나는 소리
const sndIncorrectBoing = effectSightWords + "incorrect_boing.mp3";    // (08) (800 ~ 1000) 틀렸을 때 나는 소리 
const thumbnail = "https://wcfresource.a1edu.com/newsystem/image/dodoabc/songandchant/movie/thumbnail.jpg"

$(document).ready(() => {
    const imgArr = [];

    doPreloadImages(imgArr, () => {
        $(".js-activity-movie").css("display", "none");
        $(".js-activity-a1a").css("display", "none");
        $(".js-activity-a1b").css("display", "none");
        $(".js-activity-a2a").css("display", "none");
        $(".js-activity-a2b").css("display", "none");
        $(".js-activity-a3a").css("display", "none");
        $(".js-activity-a3b").css("display", "none");
        $(".js-activity-a4a").css("display", "none");
        $(".js-activity-a4b").css("display", "none");
        $(".js-activity-a5a").css("display", "none");
        $(".js-activity-a5b").css("display", "none");

        $(".header-left").html(`<div class="ico_exit button" style="width: 57px; height: 57px;" onclick="goDodo();"></div>`);

        if ($("#introVideo").length <= 0) {
            $(".js-wrapper-header").css("opacity", "1");
        }
    });

    getStudyInfo(getBookOnSucc);  // GetStudyInfo("EXEC [dbo].[sStudySetupInfoEbPreK] @pStudyId = '" + pStudyId + "', @pStudentHistoryId = '" + pStudentHistoryId + "' ");)
});

const getBookOnSucc = (data) => {
    if(!isValidateRound(data.Round)){
        throw Error('Round Invalid')
    }
    const user = ssStudyInfo.user     // STUDENT ("GUEST", "STAFF")
    if (user === "STUDENT") {
        nextActivity(data.StatusCode == "" ? "025001" : data.StatusCode);
    } else {
        nextActivity("025001");
    }
};

const startSongAndChant = () => {
    step = 1;
    quizType = "A";
    currentActivity = "A1A";    // 제일 먼저 세팅해야함.

    loadQuiz();

    hideSpeaker();

    myVideo = document.getElementById("vtVideo");

    myVideo.onended = function () {
        // 두번째부터는 자동 시작 안함

        myVideo.removeAttribute('autoplay');
        //$(".js-btn-next").removeClass("d-none");

        if (isNext) {
            $(".js-btn-next").removeClass("d-none");
        }

        if (isRecorded == true) {
            toggleRecord();
        }

        if (crntStatus == "sing") {
            myVideo['pause']();
            $(".js-wrapper-record2").removeClass("d-none");
        } else {
            //pop Excellent;   // todo
        }

    }

    myVideo.onloadeddata = function () {
        //$('#vtVideo')[0].play();
        myVideo['play']();
        drawButtons();
    };

    $(".js-btn-next").on("click", () => {
        myVideo.pause();
        $("#audioPlayer")[0].pause();

        studyEnd();
    });

    $(".js-btn-play").on("click", () => {
        togglePlay();
    });

    $(".js-btn-play").mouseover(function () {
        if (myVideo.paused) {
            $(".js-btn-play").attr("src", "./images/btn_play_hover.png");
        }
        else {
            $(".js-btn-play").attr("src", "./images/btn_pause_hover.png");
        }
    }).mouseout(function () {
        if (myVideo.paused) {
            $(".js-btn-play").attr("src", "./images/btn_play.png");
        }
        else {
            $(".js-btn-play").attr("src", "./images/btn_pause.png");
        }
    });

    $(".js-btn-record").on("click", () => {
        toggleRecord();
    })

    $(".js-btn-record").mouseover(function () {
        if (bRecording == true) {
            $(".js-btn-record").attr("src", "./images/btn_stop_hover.png");
        } else {
            $(".js-btn-record").attr("src", "./images/btn_record_hover.png");
        }
    }).mouseout(function () {
        if (bRecording == true) {
            $(".js-btn-record").attr("src", "./images/btn_stop.png");
        } else {
            $(".js-btn-record").attr("src", "./images/btn_record.png");
        }
    });

    drawButtons();
};

const loadQuiz = () => {
    loadQuizData(step, quizType, setData);
}

const setData = data => {
    // 비지니스 로직
    // 1. 퀴즈 데이터 담기.
    quizDataArr = data;

    maxCorrectCount = quizDataArr.length;
    setupQuiz();
}

// 퀴즈 세팅 시작
const setupQuiz = () => {
    myVideo = document.getElementById("vtVideo");
    myVideo.volume = 1.0;
    quizData = quizDataArr[correctCount];

    myVideo.load();

    $('#vtVideo').attr('currentTime', 6000);
    $("#vtVideo").attr("poster", thumbnail);

    if (crntStatus == "sing") {
        $("#vtVideo > source").attr("src", quizData.Sound1);
    }
    else {
        $("#vtVideo > source").attr("src", quizData.Sound2);
    }
}

const drawButtons = () => {
    if (crntStatus == "sing") {
        if (myVideo.paused == true) {
            $(".js-btn-play").attr("src", "./images/btn_play.png");
        }
        else {
            $(".js-btn-play").attr("src", "./images/btn_pause.png");
        }
    }
    else {
        if (bRecording == true) {
            $(".js-btn-record").attr("src", "./images/btn_stop.png");
        }
        else {
            $(".js-btn-record").attr("src", "./images/btn_record.png");
        }
    }
}

function togglePlay() {
    isRecorded = "false";

    let method = "";
    if (myVideo.paused == true) {
        method = "play";
    } else if (myVideo.paused == false) {
        method = "pause";
    }

    myVideo[method]();

    if (method == "play") {
        $(".js-btn-play").attr("src", "./images/btn_pause_hover.png");
    }
    else {
        $(".js-btn-play").attr("src", "./images/btn_play_hover.png");
    }

    // 녹음한 노래와 영상을 동시에 플레이해준다
    if (crntStatus == "record") {
        recordPlay(method);
    }
}

function recordPlay(pMethod) {
    //console.log('recordPlay');
    if (pMethod == "play") {
        // todo : 레코딩 된 음원 플레이
        $("#audioPlayer")[0].play();
    }
    else {
        // todo : 레코딩 된 음원 플레이 중지
        $("#audioPlayer")[0].pause();
    }
}

function toggleRecord() {
    //bRecording 기본 false상태
    if (bRecording == true) {
        // todo - 녹음중이면 스탑, 스탑 상태면 녹음
        // stop
        bRecording = false;
        //console.log('bRecording true -> false');
        stopRecording();
        $(".js-btn-record").attr("src", "./images/btn_record.png");
        $(".js-control-record #fakePlay").addClass("d-none");
        $(".js-control-record .js-btn-play").removeClass("d-none");
        $(".js-btn-play").attr("src", "./images/btn_play.png");
        $(".js-script").empty();
    } else {
        // recording
        bRecording = true;
        isRecorded = true;
        $(".js-script").empty(); // 자막 비우가
        startRecording();
        myVideo.currentTime = 0; // 기존 myVideo는 paused 되어있는 상태.
        myVideo.play();
        $(".js-btn-record").attr("src", "./images/btn_stop.png");
        $(".js-btn-play").addClass("d-none");
        $("#fakePlay").removeClass("d-none");
    }
}

function startRecording() {
    let constraints = { audio: true, video: false };

    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
        audioContext = new AudioContext();
        gumStream = stream;
        input = audioContext.createMediaStreamSource(stream);
        rec = new Recorder(input, { numChannels: 1 })
        rec.record();
    });
}

function stopRecording() {
    // record의 stop. record data 저장 필요
    //console.log("stopRecording");

    myVideo.pause();
    myVideo.currentTime = 0;
    rec.stop();
    gumStream.getAudioTracks()[0].stop();
    rec.exportWAV(createWAVurl);
}

function createWAVurl(blob) {
    let url = URL.createObjectURL(blob);
    $("#audioPlayer").attr('src', url);
}

const goAgain = pStart => {
    $(".js-wrapper-record2").addClass("d-none");
    myVideo['play']();
    $(".js-script").empty();
}

const goRecord = () => {
    isNext = true;
    crntStatus = "record";
    myVideo.pause(); //play 화면의 영상 pause
    $(".js-wrapper-record2").removeClass("d-none");
    $(".js-record-skip").addClass("d-none");
    $(".next-popup2").addClass("d-none");
    $(".pop-sing").removeClass("d-none");
    //문제음원 Let's sing
    playEffect1(sndCorrect);

    setTimeout(() => {
        myVideo.removeAttribute('autoplay');
        $(".js-test-record").addClass("d-none"); // 개발용. 레코드 화면으로 넘어가기
        $(".js-wrapper-record2").addClass("d-none");
        $(".js-control-play").addClass("d-none");
        $(".js-control-record").removeClass("d-none");
        $(".js-script").empty();
        setupQuiz();
        toggleRecord();
    }, 2000);
}

const studyEnd = () => {
    const jsonStr = {
        step: step,
        study_end_yn: 'Y',
        isMobile: 'N'
    }
    isMobile ? jsonStr.isMobile = 'Y' : jsonStr.isMobile = 'N';

    saveStatus();
}

const nextActivity = (pStatusCode) => {
    if (pStatusCode != "025001") {
        popReward();
    } else {
        startSongAndChant();
    }
}