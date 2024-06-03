let currentActivity = '';   // 각 Activity에서 세팅됨
let currentLand = 'phonics2';
let letterWord = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/phonics2/words/";
let effectPhonics = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/phonics2/effect/";
let pronuncePhonics = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/phonics2/pronunce/";
let sndBgmA1A = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/phonics2/bgm/bgm_ph2_a1a.mp3";
let sndBgmA1B = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/phonics2/bgm/bgm_ph2_a1b.mp3";
let sndBgmA2A = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/phonics2/bgm/bgm_ph2_a2a.mp3";
let sndBgmA2B = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/phonics2/bgm/bgm_ph2_a2b.mp3";
let sndBgmA3A = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/phonics2/bgm/bgm_ph2_a3a.mp3";
let sndBgmA3B = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/phonics2/bgm/bgm_ph2_a3b.mp3";
let sndBgmA4A = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/phonics2/bgm/bgm_ph2_a4a.mp3";
let sndBgmA5A = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/phonics2/bgm/bgm_ph2_a5a.mp3";
let knockCnt = 0;

const phonics2WordRoot = "https://wcfresource.a1edu.com/newsystem/image/dodoabc/phonics2/words/";

$(document).ready(() => {
    const imgArr = [];

    doPreloadImages(imgArr, () => {
        $(".js-activity-a4b").css("display", "none");
        $(".js-activity-a5b").css("display", "none");
        $(".arrow").removeClass("d-none");

        if (currentActivity == "Movie") {
            let interval = setInterval(() => {
                if (video.currentTime >= 0.1) {
                    $(".arrow").css("display", "block");
                    clearInterval(interval);
                }
            }, 100);
        } else {
            setTimeout(() => {
                $(".arrow").css("display", "block");
            }, 800);
        }

        if ($("#introVideo").length <= 0) {
            $(".js-wrapper-header").css("opacity", "1");
        }
    })
})

const goActivity = (activity) => {
    let goTo;
    switch (activity) {
        case "Movie":
            goTo = "../movie/Default.html";
            break;

        case "A1A":
            goTo = "../toriacorns/Default.html";
            break;

        case "A1B":
            goTo = "../toriexplorer/Default.html";
            break;

        case "A2A":
            goTo = "../flyingmat/Default.html";
            break;

        case "A2B":
            goTo = "../forestgreenthumb/Default.html";
            break;

        case "A3A":
            goTo = "../umbrella/Default.html";
            break;

        case "A3B":
            goTo = "../forestdoor/Default.html";
            break;

        case "A4A":
            goTo = "../rhymingtrain/Default.html";
            break;

        case "A5A":
            goTo = "../icecream/Default.html";
            break;
    }

    location.replace(goTo);
}

const playQuestion = () => {
    if (currentActivity == 'A4A' || currentActivity == 'A5A') {
        playPronunce();
    }
    else {
        playEffect1(quizData.Sound1);
    }
}

const nextActivity = (pStatusCode) => {
    //console.log(statusCode);
    //console.log('nextActivity : ' + pStatusCode);
    switch (pStatusCode) {
        case "025001":

            if (currentActivity == "Movie") {
                if (Math.floor(Math.random() * 100) % 2 == 0) {
                    location.replace("../toriacorns/Default.html");
                }
                else {
                    location.replace("../toriexplorer/Default.html");
                }
            }
            else {
                location.replace("../movie/Default.html");
            }
            break;

        case "025002":
            if (Math.floor(Math.random() * 100) % 2 == 0) {
                location.replace("../flyingmat/Default.html");
            }
            else {
                location.replace("../forestgreenthumb/Default.html");
            }
            break;

        case "025003":
            if (Math.floor(Math.random() * 100) % 2 == 0) {
                location.replace("../umbrella/Default.html");
            }
            else {
                location.replace("../forestdoor/Default.html");
            }
            break;

        case "025004":
            location.replace("../rhymingtrain/Default.html");
            break;

        case "025005":
            location.replace("../icecream/Default.html");
            break;

        case "025008":
            popReward();
            break;
    }
}
