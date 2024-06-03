let currentActivity = '';   // 각 Activity에서 세팅됨

let currentLand = 'sightwords2';

const sightWordsRoot = "https://wcfresource.a1edu.com/newsystem/image/dodoabc/sightword2/words/";
const SIGHT_WORD_EFFECT_ROOT = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sightword2/effect";
const SIGHT_WORD_BGM_ROOT = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sightword2/bgm";

const effectSightWords = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/sightword2/effect/";
const sndBgmA2A = `${SIGHT_WORD_BGM_ROOT}/bgm_sw2_a2a.mp3`;
const sndBgmA3A = `${SIGHT_WORD_BGM_ROOT}/bgm_sw2_a3a.mp3`;
const sndBgmA3B = `${SIGHT_WORD_BGM_ROOT}/bgm_sw2_a3b.mp3`;
const sndBgmA4A = `${SIGHT_WORD_BGM_ROOT}/bgm_sw2_a4a.mp3`;
const sndBgmA4B = `${SIGHT_WORD_BGM_ROOT}/bgm_sw2_a4b.mp3`;
const sndBgmA5A = `${SIGHT_WORD_BGM_ROOT}/bgm_sw2_a5a.mp3`;
const sndBgmA5B = `${SIGHT_WORD_BGM_ROOT}/bgm_sw2_a5b.mp3`;


$(document).ready(() => {
    $(".js-activity-a1b").css("display", "none");
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
    })
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
            goTo = "../dressingup/Default.html";
            break;

        case "A2B":
            goTo = "../spelling/Default.html";
            break;

        case "A3A":
            goTo = "../jumpleoni/Default.html";
            break;

        case "A3B":
            goTo = "../pearlhunting/Default.html";
            break;

        case "A4A":
            goTo = "../djblanc/Default.html";
            break;

        case "A4B":
            goTo = "../ginoplate/Default.html";
            break;

        case "A5A":
            goTo = "../milofactory/Default.html";
            break;

        case "A5B":
            goTo = "../relayrace/Default.html";
            break;
    }

    location.replace(goTo);
}

const nextActivity = (pStatusCode) => {
    //console.log(statuscode);
    //console.log('nextactivity : ' + pstatuscode);
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
                location.replace("../dressingup/Default.html");
            }
            else {
                location.replace("../spelling/Default.html");
            }
            break;

        case "025003":
            if (Math.floor(Math.random() * 100) % 2 == 0) {
                location.replace("../jumpleoni/Default.html");
            }
            else {
                location.replace("../pearlhunting/Default.html");
            }
            break;

        case "025004":
            if (Math.floor(Math.random() * 100) % 2 == 0) {
                location.replace("../djblanc/Default.html");
            }
            else {
                location.replace("../ginoplate/Default.html");
            }
            break;

        case "025005":
            if (Math.floor(Math.random() * 100) % 2 == 0) {
                location.replace("../milofactory/Default.html");
            }
            else {
                location.replace("../relayrace/Default.html");
            }
            break;

        case "025008":
            //popReward(0, { levelup : '',  newreadingunit : ''});
            popReward();
            break;
    }
}