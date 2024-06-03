const container = document.querySelector(".container"),
    mainVideo = container.querySelector("video"),
    videoTimeline = container.querySelector(".video-timeline"),
    progressBar = container.querySelector(".progress-bar"),
    volumeBtn = container.querySelector(".volume span"),
    volumeSlider = container.querySelector(".left input"),
    popup = container.querySelector(".pop-up"),
    popupExit = container.querySelector(".pop-up .exit"),
    popupSkip = container.querySelector(".pop-up .skip");

(currentVidTime = container.querySelector(".current-time")),
    (videoDuration = container.querySelector(".video-duration")),
    // 3초 뒤로 버튼
    (skipBackward = container.querySelector(".skip-backward")),
    // 3초 앞으로 버튼
    (skipForward = container.querySelector(".skip-forward")),
    // 재생, 일시정지 버튼
    (playPauseBtn = container.querySelector(".play-pause")),
    // 스피드 조절 버튼
    (speedBtn = container.querySelector(".playback-speed span")),
    // 스피드 조절 옵션
    (speedOptions = container.querySelector(".speed-options")),
    // 전체 화면 버튼
    (fullScreenBtn = container.querySelector(".fullscreen span")),
    // 나가기 팝업 실행 버튼
    (btnExit = container.querySelector(".control-menu .exit")),
    // 스킵 팝업 실행 버튼
    (btnSkip = container.querySelector(".control-menu .skip"))

let timer;
let myVideo;

const hideControls = () => {
    if (mainVideo.paused) return;

    timer = setTimeout(() => {
        container.classList.remove("show-controls");
    }, 3000);
};
hideControls();

container.addEventListener("mousemove", () => {
    container.classList.add("show-controls");
    clearTimeout(timer);
    hideControls();
});

const formatTime = (time) => {
    let seconds = Math.floor(time % 60),
        minutes = Math.floor(time / 60) % 60,
        hours = Math.floor(time / 3600);

    seconds = seconds < 10 ? `0${seconds}` : seconds;
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    hours = hours < 10 ? `0${hours}` : hours;

    if (hours == 0) {
        return `${minutes}:${seconds}`;
    }
    return `${hours}:${minutes}:${seconds}`;
};

videoTimeline.addEventListener("mousemove", (e) => {
    let timelineWidth = videoTimeline.clientWidth;
    let offsetX = e.offsetX;
    let percent = Math.floor((offsetX / timelineWidth) * mainVideo.duration);
    const progressTime = videoTimeline.querySelector("span");
    offsetX =
        offsetX < 20
            ? 20
            : offsetX > timelineWidth - 20
                ? timelineWidth - 20
                : offsetX;
    progressTime.style.left = `${offsetX}px`;
    progressTime.innerText = formatTime(percent);
});

videoTimeline.addEventListener("click", (e) => {
    event.preventDefault();

    let timelineWidth = videoTimeline.clientWidth;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
});

mainVideo.addEventListener("timeupdate", (e) => {
    let { currentTime, duration } = e.target;
    let percent = (currentTime / duration) * 100;
    progressBar.style.width = `${percent}%`;
    currentVidTime.innerText = formatTime(currentTime);
});

mainVideo.addEventListener("loadeddata", () => {
    videoDuration.innerText = formatTime(mainVideo.duration);
});

const draggableProgressBar = (e) => {
    let timelineWidth = videoTimeline.clientWidth;
    progressBar.style.width = `${e.offsetX}px`;
    mainVideo.currentTime = (e.offsetX / timelineWidth) * mainVideo.duration;
    currentVidTime.innerText = formatTime(mainVideo.currentTime);
};

volumeBtn.addEventListener("click", () => {
    event.preventDefault();

    if (!volumeBtn.classList.contains("img-volume-high")) {
        mainVideo.volume = 1.0;
        volumeBtn.classList.replace("img-volume-xmark", "img-volume-high");
    }
    else {
        mainVideo.volume = 0.0;
        volumeBtn.classList.replace("img-volume-high", "img-volume-xmark");
    }

    volumeSlider.value = mainVideo.volume;
});

volumeSlider.addEventListener("input", (e) => {
    event.preventDefault();

    mainVideo.volume = e.target.value;

    if (e.target.value == 0) {
        return volumeBtn.classList.replace("img-volume-high", "img-volume-xmark");
    }

    volumeBtn.classList.replace("img-volume-xmark", "img-volume-high");
});

speedOptions.querySelectorAll("li").forEach((option) => {
    option.addEventListener("click", () => {
        event.preventDefault();

        mainVideo.playbackRate = option.dataset.speed;
        speedOptions.querySelector(".active").classList.remove("active");
        option.classList.add("active");
    });
});

document.addEventListener("click", (e) => {
    event.preventDefault();

    if (e.target.tagName !== "SPAN" || e.target.className !== "img-speed") {
        speedOptions.classList.remove("show");
    }
});

fullScreenBtn.addEventListener("click", () => {
    event.preventDefault();

    container.classList.toggle("fullscreen");

    if (document.fullscreenElement) {
        fullScreenBtn.classList.replace("img-re-size", "img-full-size");

        return document.exitFullscreen();
    }

    fullScreenBtn.classList.replace("img-full-size", "img-re-size");
    container.requestFullscreen();
});

speedBtn.addEventListener("click", () => {
    event.preventDefault();

    speedOptions.classList.toggle("show")
});

// pipBtn.addEventListener("click", () => mainVideo.requestPictureInPicture());
skipBackward.addEventListener("click", () => {
    event.preventDefault();

    mainVideo.currentTime -= 3;
});

skipForward.addEventListener("click", () => {
    event.preventDefault();

    mainVideo.currentTime += 3
});

mainVideo.addEventListener(
    "play",
    () => playPauseBtn.classList.replace("img-play", "img-pause")
    // playPauseBtn.classList.replace("play", "pause")
);

mainVideo.addEventListener(
    "pause",
    () => playPauseBtn.classList.replace("img-pause", "img-play")
    // playPauseBtn.classList.replace("pause", "play")
);

playPauseBtn.addEventListener(
    "click",
    // () => (mainVideo.paused ? mainVideo.play() : mainVideo.pause())
    () => (mainVideo.paused ? videoPlayStart() : mainVideo.pause())
);

videoTimeline.addEventListener("mousedown", () => {
    event.preventDefault();

    videoTimeline.addEventListener("mousemove", draggableProgressBar)
});

document.addEventListener("mouseup", () => {
    event.preventDefault();

    videoTimeline.removeEventListener("mousemove", draggableProgressBar)
});

const videoPlayStart = () => {
    mainVideo.play();
    hideControls();
};

const mediaSkip = () => {
    let text = "영상 시청을 건너 뛰시겠어요?";
    if (confirm(text) == true) {
        // 학습으로 이동
    } else {
        // 창 닫기
    }
};

const exitStudy = () => {
    let text = "학습을 그만두시겠어요?";
    if (confirm(text) == true) {
        // 이전 페이지로 나가기
    } else {
        // 창 닫기
    }
};

btnExit.addEventListener("click", () => {
    goRoot();
});

btnSkip.addEventListener("click", () => {    
    saveStatus();
});

$(document).ready(() => {
    currentActivity = 'Movie';
    getMovieData(setMovie);
    //getStudyInfo(getBookOnSucc);
    myVideo = document.getElementById("introVideo");

    $(".js-header-right").addClass("d-none");

    $(".arrow_bar02").addClass("d-none");
    focusCurrent("movie");
})

//const getBookOnSucc = (data) => {
//    bookInfo = $.parseJSON(data)[0];
//    statusCode = bookInfo.StatusCode;
//}

const setMovie = data => {
    $("#introVideo > source").attr("src", data.AnimationPath);

    myVideo.onended = function () {
        // 두번째부터는 자동 시작 안함
        myVideo.removeAttribute('autoplay');

        // poster 표시됨
        myVideo.load();

        cancelFullScreen();

        popNext();
    };

    myVideo.load();
    myVideo.play();

    $(".wrapper-header").addClass("d-none");
    hideSpeaker();
}

const resetAll = (pStart) => {
    hideNext();
    myVideo.load();
    myVideo.play();
}

function cancelFullScreen() {
    if (document.mozFullScreen || document.webkitFullScreen) {
        if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        }
        else {
            document.webkitCancelFullScreen();
        }
    }
}

