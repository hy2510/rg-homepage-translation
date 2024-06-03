let currentActivity = '';   // 각 Activity에서 세팅됨
let currentLand = 'alphabet';
let effectAlphabet = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/alphabet/effect/";
let letterAlphabet = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/alphabet/letter/";
let letterSound = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/alphabet/sound/";
let letterWord = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/alphabet/words/";
let sndBgmA1A = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/alphabet/bgm/bgm_alp_a1a.mp3";
let sndBgmA2A = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/alphabet/bgm/bgm_alp_a2a.mp3";
let sndBgmA3A = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/alphabet/bgm/bgm_alp_a3a.mp3";
let sndBgmA3B = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/alphabet/bgm/bgm_alp_a3b.mp3";
let sndBgmA4A = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/alphabet/bgm/bgm_alp_a4a.mp3";
let sndBgmA4B = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/alphabet/bgm/bgm_alp_a4b.mp3";
let sndBgmA5A = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/alphabet/bgm/bgm_alp_a5a.mp3";
let sndBgmA5B = "https://wcfresource.a1edu.com/newsystem/sound/dodoabc/alphabet/bgm/bgm_alp_a5b.mp3";

const alphabetWordRoot = "https://wcfresource.a1edu.com/newsystem/image/dodoabc/alphabet/words/";

$(document).ready(() => {
    const imgArr = [];

    doPreloadImages(imgArr, () => {
        $(".js-activity-a1b").css("display", "none");
        $(".js-activity-a2b").css("display", "none");
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
            goTo = "../newalphabettracing/Default.html";
            break;

        case "A2A":
            goTo = "../boatrider/Default.html";
            break;

        case "A3A":
            goTo = "../millospaceship/Default.html";
            break;

        case "A3B":
            goTo = "../memoryactivity/Default.html";
            break;

        case "A4A":
            goTo = "../lettercatcher/Default.html";
            break;

        case "A4B":
            goTo = "../chellosing/Default.html";
            break;

        case "A5A":
            goTo = "../ferriswheel/Default.html";
            break;

        case "A5B":
            goTo = "../wordfinder/Default.html";
            break;
    }

    location.replace(goTo);
}

const nextActivity = (pStatusCode) => {
    switch (pStatusCode) {
        case "025001":
            if (currentActivity == "Movie") {
                location.replace("../newalphabettracing/Default.html");
            } else {
                location.replace("../movie/Default.html");
            }
            break;

        case "025002":
            location.replace("../boatrider/Default.html");
            break;

        case "025003":
            const checkArr = ['303', '306', '309', '312', '315', '318', '321', '324'];
            const book = ssStudyInfo.book.toString()
            if (checkArr.includes(book)) {
                location.replace("../memoryactivity/Default.html");
            } else {
                location.replace("../millospaceship/Default.html");
            }
            break;

        case "025004":
            if (Math.floor(Math.random() * 100) % 2 == 0) {
                location.replace("../lettercatcher/Default.html");
            }
            else {
                location.replace("../chellosing/Default.html");
            }
            break;

        case "025005":
            if (Math.floor(Math.random() * 100) % 2 == 0) {
                location.replace("../ferriswheel/Default.html");
            }
            else {
                location.replace("../wordfinder/Default.html");
            }
            break;

        case "025008":
            popReward();
            break;
    }
}
