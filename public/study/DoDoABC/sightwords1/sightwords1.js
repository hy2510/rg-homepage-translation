let currentActivity = '';   // 각 Activity에서 세팅됨
let currentLand = 'sightwords';
let effectSightWords = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sightword/effect/";
let letterSightWords = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sightword/letter/";
let letterSound = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sightword/sound/";
let letterWord = "https://wcfresource.a1edu.com/newsystem/sound/words/";
let sndBgmA1A = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sightword/bgm/bgm_swd_a1a.mp3";
let sndBgmA2A = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sightword/bgm/bgm_swd_a2a.mp3";
let sndBgmA3A = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sightword/bgm/bgm_swd_a3a.mp3";
let sndBgmA3B = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sightword/bgm/bgm_swd_a3b.mp3";
let sndBgmA4A = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sightword/bgm/bgm_swd_a4a.mp3";
let sndBgmA4B = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sightword/bgm/bgm_swd_a4b.mp3";
let sndBgmA5A = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sightword/bgm/bgm_swd_a5a_dev.mp3";
let sndBgmA5B = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sightword/bgm/bgm_swd_a5b_dev.mp3";

const sightWordsRoot = "https://wcfresource.a1edu.com/newsystem/image/dodoabc/sightword/words/";

$(document).ready(() => {
    $(".js-activity-a1b").css("display", "none");
    //$(".js-activity-a2b").css("display", "none");
    $(".arrow").removeClass("d-none");

    const imgArr = [];

    doPreloadImages(imgArr, () => {
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
    });
})

const goActivity = (activity) => {
    let goTo;
    
    switch (activity) {
        case "Movie":
            goTo = "../movie/Default.html";
            break;

        case "A1A":
            goTo = "../listenandrepeat/Default.html";
            break;

        case "A2A":
            goTo = "../flyingcraft/Default.html";
            break;

        case "A2B":
            goTo = "../breathlifeinto/Default.html";
            break;

        case "A3A":
            goTo = "../leonigoinghome/Default.html";
            break;

        case "A3B":
            goTo = "../rescuethefriends/Default.html";
            break;

        case "A4A":
            goTo = "../patternsentences/Default.html";
            break;

        case "A4B":
            goTo = "../twinklingstars/Default.html";
            break;

        case "A5A":
            goTo = "../shootingstars/Default.html";
            break;

        case "A5B":
            goTo = "../shootingrockets/Default.html";
            break;
    }

    location.replace(goTo)
}

const nextActivity = (pStatusCode) => {
    //console.log(statusCode);
    //console.log('nextActivity : ' + pStatusCode);
    switch (pStatusCode) {
        case "025001":
            if (currentActivity == "Movie") {
                location.replace("../listenandrepeat/Default.html");
            }
            else {
                location.replace("../movie/Default.html");
            }
            break;

        case "025002":
            if (Math.floor(Math.random() * 100) % 2 == 0) {
                location.replace("../flyingcraft/Default.html");
            }
            else {
                location.replace("../breathlifeinto/Default.html");
            }
            break;

        case "025003":
            if (Math.floor(Math.random() * 100) % 2 == 0) {
                location.replace("../leonigoinghome/Default.html");
            }
            else {
                location.replace("../rescuethefriends/Default.html");
            }
            break;

        case "025004":
            if (Math.floor(Math.random() * 100) % 2 == 0) {
                location.replace("../patternsentences/Default.html");
            }
            else {
                location.replace("../twinklingstars/Default.html");
            }
            break;

        case "025005":
            if (Math.floor(Math.random() * 100) % 2 == 0) {
                location.replace("../shootingstars/Default.html");
            }
            else {
                location.replace("../shootingrockets/Default.html");
            }
            break;

        case "025008":
            popReward();
            break;
    }
}
