let myVideo;

$(document).ready(() => {
    currentActivity = 'Movie';
    getMovieData();
    getStudyInfo();
    myVideo = document.getElementById("introVideo");
    
    myVideo.ontimeupdate = function () {
        var percentage = (myVideo.currentTime / myVideo.duration) * 100;
        $(".js-custom-seekbar span").css("width", percentage + "%");
    };

    $(".js-custom-seekbar").on("click", function (e) {
        var offset = $(this).offset();
        var left = (e.pageX - offset.left);
        var totalWidth = $(".js-custom-seekbar").width();
        var percentage = (left / totalWidth);
        var vidTime = myVideo.duration * percentage;
        myVideo.currentTime = vidTime;
    });

    $(".js-header-right").addClass("d-none");

    focusCurrent("movie");
});

const getBookOnSucc = (data) => {
    bookInfo = $.parseJSON(data)[0];
    statusCode = bookInfo.StatusCode;
    //console.log(bookInfo);
}

const setMovie = async (data) => {
    movieData = await $.parseJSON(data)[0];
    
    $("#introVideo > source").attr("src", movieData.AnimationPath);

    setTimeout(() => {
        myVideo.load();
    }, 1500);

    myVideo.onended = function () {
        // 두번째부터는 자동 시작 안함
        myVideo.removeAttribute('autoplay');

        // poster 표시됨
        myVideo.load();

        cancelFullScreen();

        popNext();
    };

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

