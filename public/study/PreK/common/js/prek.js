var ua, event, _snd;;
var isMobile = false;
var isIOS = false;
var _round;
var _studyId;
var _usermode = 1;
var _pNum;
var _gvStudyId;
let homepageUrl;
let duplicateInterval;

let studySessionId = "";
var gvLanguage = "KOR"

// 뒤로가기 방지
// history.pushState(null, null, location.href);
// window.onpopstate = function () {
//     history.go(1);
//     //this.handleGoback();
// };
// window.history.forward(0);
// 앞으로가기 방지
//document.oncontextmenu = function () { return false; };

// 스크롤 막기 테스트
//let scrollPosition = 0;
//scrollPosition = window.pageYOffset;
//const body = document.querySelector('body'); // style이 에러메세지 일으킴
//body.style.top = `-${scrollPosition}px`;

//function scrollDisable() {
//    $('body').addClass('scrollDisable').on('scroll touchmove mousewheel', function (e) {
//        e.preventDefault();
//    });
//}

/* 스크롤 기능을 가능하게 해주는 클래스
function scrollAble() {
    $('body').removeClass('scrollDisable').off('scroll touchmove mousewheel');
}*/
//scrollDisable();
// scroll


// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
var keys = { 37: 1, 38: 1, 39: 1, 40: 1 };

function preventDefault(e) {
    e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

// modern Chrome requires { passive: false } when adding event
var supportsPassive = false;
try {
    window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
        get: function () { supportsPassive = true; }
    }));
} catch (e) { }

var wheelOpt = supportsPassive ? { passive: false } : false;
var wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';

// call this to Disable
function disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(wheelEvent, preventDefault, wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
}

// call this to Enable
function enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(wheelEvent, preventDefault, wheelOpt);
    window.removeEventListener('touchmove', preventDefault, wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
}



function freeze() {
    if ($("html").css("position") != "fixed") {
        var top = $("html").scrollTop() ? $("html").scrollTop() : $("body").scrollTop();
        if (window.innerWidth > $("html").width()) {
            $("html").css("overflow-y", "scroll");
        }
        $("html").css({ "width": "100%", "height": "100%", "position": "fixed", "top": -top });
    }
}

freeze();


$(document).ready(function () {
    ua = navigator.userAgent, event;
    event = (ua.match(/iPad/i)) ? "touchstart" : "click";
});

/* 화면초기화, 좌표 [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[ */

// 초기화시 화면크기에 맞춤
$(document).ready(function () {

    // device detection
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        isMobile = true;
    } else {
        isMobile = false;
    }

    var iDevices = [
    'iPad Simulator',
    'iPhone Simulator',
    'iPod Simulator',
    'iPad',
    'iPhone',
    'iPod'
    ];

    if (!!navigator.platform) {
        while (iDevices.length) {
            if (navigator.platform === iDevices.pop()) {
                isIOS = true;
            } else {
                isIOS = false;
            }
        }
    }

    var nTop = ($(window).height() - 660) / 2;

    if (!isMobile) {
        if ($(window).width() > 1600) {
            $("#divFrame").css('transform', 'scale(1.2)');
        } else if ($(window).width() <= 1600 && $(window).width() > 1280) {
            $("#divFrame").css('transform', 'scale(1.0)');
        } else if ($(window).width() <= 1280 && $(window).width() > 1024) {
            $("#divFrame").css('transform', 'scale(0.9)');
        } else if ($(window).width() <= 1024) {
            $("#divFrame").css('transform', 'scale(0.75)');
        }
    } else {
        //alert($(window).height() + ', ' + $(window).width());

        if ($(window).width() > 1600) {
            //alert('1')
            $("#divFrame").css('transform', 'scale(1.2)');
        } else if ($(window).width() <= 1600 && $(window).width() > 1280) {
            //alert('2')
            $("#divFrame").css('transform', 'scale(1.0)');
        } else if ($(window).width() <= 1280 && $(window).width() > 1024) {
            //alert('3')
            $("#divFrame").css('transform', 'scale(0.9)');
        } else if ($(window).width() <= 1024 && $(window).width() > 800) {
            //alert('4')
            $("#divFrame").css('transform', 'scale(0.7)');
        } else if ($(window).width() <= 800) {
            //alert('5')
            $("#divFrame").css('transform', 'scale(0.6)');
        }

        if (navigator.userAgent.toUpperCase().search('IPHONE') > 0) { nTop = nTop + 15; }
    }

    $("#divFrame").css('margin-top', nTop.toString() + 'px');
});


function goToLogOut() {
    wsBRPK.GetCustomerUrl(onSuccLogOut, onFail);
}

function onSuccLogOut(p1, p2) {
    goLogOut(p1);
}

function onFail(p1, p2) {
    alert(p1);
}

function getArgs() {
    const apiStudyInfoString = sessionStorage.getItem("apiStudyInfo");
    const apiStudyInfo = JSON.parse(apiStudyInfoString)
    _pNum = apiStudyInfo.arg1
    _usermode = apiStudyInfo.arg2
    if (_usermode === "3") {
        _gvStudyId = "teacher123";
    } else {
        _gvStudyId = apiStudyInfo.arg3
    }
    if (_usermode === '3' || _usermode === '2') {
        $('#divBtn').css('display', 'block');
        _gvStudyId = "teacher123";
    } else {
        //_gvStudyId = getUrlParameter('arg3').toString().toLowerCase();
        //_gvStudyId = obj.study_id;
    }
}

function deprecated_getArgs() {
    //if (!isEmpty(getUrlParameter('arg1')) && !isEmpty(getUrlParameter('arg2')) && !isEmpty(getUrlParameter('arg3'))) {
    if (!isEmpty(getUrlParameter('arg1')) && !isEmpty(getUrlParameter('arg2'))) {
        
        _pNum = getUrlParameter('arg1').toString().toLowerCase();
        _usermode = getUrlParameter('arg2').toString().toLowerCase();
        
        if (_usermode == 3) {
            _gvStudyId = "teacher123";
        } else {
            _gvStudyId = getUrlParameter('arg3').toString().toLowerCase();
        }
    } else {
        var pkeStudyInfo;
        
        //pkeStudyInfo = sessionStorage.getItem("pkeStudyInfo");
        //pkeStudyInfo = sslStudyInfo;    

        //pkeStudyInfo = decodeURIComponent(sslStudyInfo);
        pkeStudyInfo = sslStudyInfo;    

        if (pkeStudyInfo == "") {
            alert("ERROR 01");
        } else {

            var obj = $.parseJSON(pkeStudyInfo);

            _pNum = obj.round;
            _usermode = obj.mode;        
            _gvStudyId = obj.study_id;
            homepageUrl = obj.url;
        }

    }

    if (_usermode == 3 || _usermode == 2) {
        $('#divBtn').css('display', 'block');
        _gvStudyId = "teacher123";
    } else {
        //_gvStudyId = getUrlParameter('arg3').toString().toLowerCase();
        //_gvStudyId = obj.study_id;
    }

    //wsBRPK.GetStudyInfo(onGetStudyInfo, onFail);
    
}

function onGetStudyInfo(p1) {
    if (p1 != '') {
        var obj = JSON.parse(p1);

        if (obj[0].StatusCode == '025008' && _usermode == 1) {
            _usermode = 2;
        }
    }
}

//function DisableToolTip(elements) {
//    for (var i = 0; i < elements.length; i++) {
//        var element = elements[i];
//        element.onmouseover = function () {
//            this.setAttribute("org_title", this.title);
//            this.title = "";
//        };
//        element.onmouseout = function () {
//            this.title = this.getAttribute("org_title");
//        };
//    }
//}

// 리사이즈시 화면크기에 맞춤
$(window).resize(function () {
    var isMobile = false; //initiate as false

    // device detection
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        isMobile = true;
    } else {
        isMobile = false;
    }

    if (!isMobile) {
        var nTop = ($(window).height() - 640) / 2;
        $("#divFrame").css('margin-top', '' + nTop.toString() + 'px');

        if ($(window).width() > 1600) {
            $("#divFrame").css('transform', 'scale(1.2)');
        } else if ($(window).width() <= 1600 && $(window).width() > 1280) {
            $("#divFrame").css('transform', 'scale(1.0)');
        } else if ($(window).width() <= 1280 && $(window).width() > 1024) {
            $("#divFrame").css('transform', 'scale(0.9)');
        } else if ($(window).width() <= 1024) {
            $("#divFrame").css('transform', 'scale(0.8)');
        } else if ($(window).width() <= 800) {
            $("#divFrame").css('transform', 'scale(0.65)');
        }
    } else {
        var nTop = ($(window).height() - 640) / 2;
        $("#divFrame").css('margin-top', '' + nTop.toString() + 'px');

        if ($(window).width() > 1600) {
            $("#divFrame").css('transform', 'scale(1.2)');
        } else if ($(window).width() <= 1600 && $(window).width() > 1280) {
            $("#divFrame").css('transform', 'scale(1.0)');
        } else if ($(window).width() <= 1280 && $(window).width() > 1024) {
            $("#divFrame").css('transform', 'scale(0.9)');
        } else if ($(window).width() <= 1024) {
            $("#divFrame").css('transform', 'scale(0.8)');
        } else if ($(window).width() <= 800) {
            $("#divFrame").css('transform', 'scale(0.65)');
        }
    }
});

// 태블릿에서 스크롤되지 않도록
addEventListener('touchmove', function (e) {
    if (!$(e.target).hasClass("scrollable")) {
        e.preventDefault();
    }
});

//(function ($) {
//    $.fn.nodoubletapzoom = function () {
//        $(this).bind('touchstart', function preventZoom(e) {
//            var t2 = e.timeStamp
//              , t1 = $(this).data('lastTouch') || t2
//              , dt = t2 - t1
//              , fingers = e.originalEvent.touches.length;
//            $(this).data('lastTouch', t2);
//            if (!dt || dt > 500 || fingers > 1) return; // not double-tap

//            e.preventDefault(); // double tap - prevent the zoom
//            // also synthesize click events we just swallowed up
//            $(this).trigger('click').trigger('click');
//        });
//    };
//})(jQuery);
/* 화면초기화, 좌표 ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]] */


/* Audio, 오디오 [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[ */
var Sound = function (pObj, pFunStartPlay, pFunEndPlay) {
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
                alert('repeat must be bigger than 0');
                return undefined;
            } else if (this.repeat == 0) {
                this.infinity = true;
            }

            this.Play = function () {
                //audio.loop = true;

                audio.addEventListener('ended', function () {
                    repeat -= 1;

                    if (repeat > 0 || infinity) {
                        audio.play();
                    } else {
                        // Stop Sound
                        isplay = false;
                        if (pFunEndPlay != undefined) {
                            pFunEndPlay();
                        }
                    }
                });

                audio.addEventListener('timeupdate', function () {
                    if (isplay == false) {
                        // Play Sound
                        isplay = true;

                        if (pFunStartPlay != undefined) {
                            pFunStartPlay();
                        }
                    }
                });

                //sunnyfantest
                audio.play();
            }

            this.Stop = function () {
                audio.setAttribute('src', '');
                audio.addEventListener('timeupdate', null);

                audio.pause();
                if (audio.duration) {
                    audio.currentTime = 0;
                }

                isplay = false;
            }

            this.Pause = function () {
                alert('Pause');
            }
        }
    } catch (e) {
        alert(e);
    }

    return this;
};

function playSound(pStr, pFunEndPlay) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    var audio = $("#player");
    var sndAddr = "https://wcfresource.a1edu.com/NewSystem/sound/PK/Phonetic/" + pStr + ".mp3";
    audio.attr('src', sndAddr);
    audio[0].pause();
    audio[0].load();
    audio[0].play();
    return false;
}

function playLetter(pLetter, pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "https://wcfresource.a1edu.com/NewSystem/sound/words/" + pLetter + ".mp3",
        repeat: 1
    },
        undefined,
        pEndFun
    );

    _snd.Play();
}

function playPhonetic(pLetter, pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "https://wcfresource.a1edu.com/NewSystem/sound/PK/Phonetic/" + pLetter + ".mp3",
        repeat: 1
    },
        undefined,
        pEndFun
    );

    _snd.Play();
}

function playWord(pWord, pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "https://wcfresource.a1edu.com/NewSystem/sound/PK/Phonetic/" + pWord + ".mp3",
        repeat: 1
    },
        undefined,
        pEndFun
    );

    _snd.Play();
}

function playWord2(pWord, pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "https://wcfresource.a1edu.com/NewSystem/sound/Words/" + pWord + ".mp3",
        repeat: 1
    },
        undefined,
        pEndFun
    );

    _snd.Play();
}

function PlayFinish(pEndFun) {
    //if (_bgm != undefined && _bgm != NaN) {
    //    _bgm.Stop();
    //}

    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "https://wcfresource.a1edu.com/NewSystem/sound/PK/finish.mp3",
        repeat: 1
    },
        undefined,
        pEndFun
    );

    _snd.Play();
}

function PlayGoodJob(pEndFun) {
    //if (_bgm != undefined && _bgm != NaN) {
    //    _bgm.Stop();
    //}

    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "https://wcfresource.a1edu.com/NewSystem/sound/PK/GoodJob.mp3",
        repeat: 1
    },
        undefined,
        pEndFun
    );

    _snd.Play();
}

function PlayStart(pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "../Content/NewSystem/Sound/SoundEffect/start.mp3",
        repeat: 1
    },
        undefined,
        pEndFun
    );

    $('#imgStart').attr('src', '../common/img/start_d.png');

    _snd.Play();
}

var arrCorrect = ['correct1.mp3', 'correct2.mp3', 'correct3.mp3', 'correct4.mp3', 'correct5.mp3', 'correct6.mp3'];
function playCorrectDrag(pStartFun, pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    var randomValue = arrCorrect[Math.floor(arrCorrect.length * Math.random())];

    _snd = Sound({
        src: "../Content/NewSystem/Sound/SoundEffect/" + randomValue,
        repeat: 1
    },
        pStartFun,
        pEndFun
    );

    if (isMobile == true) {
        if (pEndFun != undefined && pEndFun != NaN) {
            setTimeout(pEndFun, 1000);
        }
    } else {
        _snd.Play();
    }
}

function playCorrect(pStartFun, pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    var randomValue = arrCorrect[Math.floor(arrCorrect.length * Math.random())];

    _snd = Sound({
        src: "../Content/NewSystem/Sound/SoundEffect/" + randomValue,
        repeat: 1
    },
        pStartFun,
        pEndFun
    );

    _snd.Play();
}

function playTryAgainDrag(pStartFun, pEndFun) {
    UnLockScreen();

    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "../Content/NewSystem/Sound/SoundEffect/tryagain.mp3",
        repeat: 1
    },
        pStartFun,
        pEndFun
    );

    if (isMobile == true) {
        if (pEndFun != undefined && pEndFun != NaN) {
            setTimeout(pEndFun, 1000);
        }
    } else {
        _snd.Play();
    }
}

function playTryAgain(pStartFun, pEndFun) {
    UnLockScreen();

    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "../Content/NewSystem/Sound/SoundEffect/tryagain.mp3",
        repeat: 1
    },
        pStartFun,
        pEndFun
    );

    _snd.Play();
}

/* Audio, 오디오 ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]] */


/* Animation, 애니메이션 [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[ */
var Animation = function AnimationDraw(pObj) {
    this.isplay = false;
    this.cartoon;
    this.ani;
    this.infinity = false;
    this.repeatCount = 0;

    try {
        if (pObj != undefined) {
            this.zindex = pObj.zindex;
            this.image = pObj.image;
            this.imgW = pObj.imgW;
            this.imgH = pObj.imgH;
            this.aniW = pObj.aniW;
            this.aniH = pObj.aniH;
            this.cx = pObj.left;
            this.cy = pObj.top;
            this.frame = pObj.frame;
            this.msec = pObj.msec;
            this.endfn = pObj.completed;
            this.container = pObj.container;
            this.repeat = pObj.repeat;
            this.onclick = pObj.onclick;
            this.tm = 0;

            if (this.frame == undefined) {
                alert('"frame" must be defined!');
                return undefined;
            }

            if (this.container == undefined) {
                alert('"container" must be defined!');
                return undefined;
            }

            if (this.repeat < 0) {
                alert('"repeat" must be bigger than 0');
                return undefined;
            } else if (this.repeat == 0) {
                this.infinity = true;
            } else {
                this.repeatCount = this.repeat;
            }

            // 컨테이너 생성
            //this.cartoon = $('<div class="cartoon" onclick="' + this.onclick + '" onmousedown="' + this.onclick + '"></div>').css({
            //this.cartoon = $('<div class="cartoon" onclick="' + this.clickfname + '"></div>').css({
            this.cartoon = $('<div class="cartoon">').css({
                width: this.aniW,
                height: this.aniH,
                left: this.cx,
                top: this.cy,
                position: 'absolute',
                overflow: 'hidden',
                zindex: 12,
                click: this.click
            }).appendTo($("#" + this.container)).click((this.onclick!=undefined) ? this.onclick : function () {});

            //this.cartoon.click(this.clickfname);

            // 애니메이션 이미지 컨테이너에 추가 추가
            this.ani = $('<img class="ani" src="' + this.image + '"/>').css({
                width: this.aniW,
                height: this.frame * this.aniH
            }).data('count', this.frame).appendTo(this.cartoon);

            this.Play = function (pObj) {
                (function animate() {
                    var count = pObj.ani.data('count');

                    if (count) {
                        var nth = pObj.frame - count;
                        var height = pObj.aniH;//this.ani.height() / this.frame;
                        pObj.ani.css({
                            'top': -(nth * height),
                            'position': 'absolute'
                        });

                        pObj.cartoon.css({
                            'height': height
                        })

                        pObj.ani.data("count", count - 1);

                        this.tm = setTimeout(animate, pObj.msec);
                    } else {
                        pObj.repeat -= 1;

                        if (pObj.infinity == true || pObj.repeat > 0) {
                            pObj.ani.data("count", pObj.frame);
                            this.tm = setTimeout(animate, 0);
                        } else {
                            if (pObj.endfn != undefined) {
                                (pObj.endfn)();
                            }
                        }
                    }
                })();
            }

            this.Stop = function (pObj) {
                // 타이머값이 고유하게 저장되지 않네... 음...
                //if (pObj.tm != undefined) {
                //    clearTimeout(pObj.tm);
                //}
                
                //this.infinity = false;
            }

            this.Replay = function (pInit) {
                if (pInit == true) {
                    this.repeat = this.repeatCount;
                    this.ani.data("count", this.frame);
                }

                this.cartoon.parent('.cartoon').remove();
                (this.Play)(this);
            }

            this.Show = function () {
                $('.cartoon').css('display', 'block');
            }

            this.Hide = function () {
                $('.cartoon').css('display', 'none');
            }

            this.Dispose = function () {
                //this.ani.parent().remove();
                if (this.tm != undefined) {
                    clearTimeout(this.tm);
                }

                this.cartoon.parent('.cartoon').remove();
            }

            this.Scale = function (pScale) {
                this.cartoon.css({
                    '-webkit-transform': 'scale(' + pScale + ')',
                    '-moz-transform': 'scale(' + pScale + ')',
                    '-ms-transform': 'scale(' + pScale + ')',
                    '-o-transform': 'scale(' + pScale + ')',
                    'transform': 'scale(' + pScale + ')'
                });
            }

        } else {
            return undefined;
        }
    } catch(e) {

    }

    return this;
}
/* Animation, 애니메이션 ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]] */


/* Text Slide, 애니메이션 [[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[[ */
var TextSlide = function(pObj) {
    this.isplay = false;
    this.cartoon;
    this.ani;
    this.infinity = false;
    this.repeatCount = 0;

    try {
        if (pObj != undefined) {
            this.zindex = pObj.zindex;
            this.divW = pObj.divW;
            this.divH = pObj.divH;
            this.txtW = pObj.txtW;
            this.txtH = pObj.txtH;
            this.speed = pObj.speed;
            this.value = pObj.value;
            this.cx = pObj.left;
            this.cy = pObj.top;
            this.msec = pObj.msec;
            this.endfn = pObj.completed;
            this.container = pObj.container;
            this.repeat = pObj.repeat;
            this.onclick = pObj.onclick;
            this.tm = 0;

            if (this.container == undefined) {
                alert('"container" must be defined!');
                return undefined;
            }

            if (this.repeat < 0) {
                alert('"repeat" must be bigger than 0');
                return undefined;
            } else if (this.repeat == 0) {
                this.infinity = true;
            } else {
                this.repeatCount = this.repeat;
            }

            // 컨테이너 생성
            this.cartoon = $('<div class="cartoon">').css({
                width: this.divW,
                height: this.divH,
                left: this.cx,
                top: this.cy,
                position: 'absolute',
                overflow: 'hidden',
                zindex: 12,
                click: this.click
            }).appendTo($("#" + this.container)).click((this.onclick != undefined) ? this.onclick : function () { });

            // input을 컨테이너에 추가 추가
            this.inp = $('<input class="textInput" value="' + this.value + '"/>').css({
                'width': this.txtW,
                'height': this.txtH,
                'left': this.divW,
                'font-size': 'xx-large',
                'color': 'white',
                'text-align': 'center',
                'border-width': '0px',
                'background': 'rgba(0, 0, 0, 0)'
            }).appendTo(this.cartoon);

            var cnt = 0;
            var wth = this.txtW;
            var spd = this.speed;
            var ini = this.divW;

            this.Slide = function (pObj) {
                (function txtSlide() {
                    if (cnt < wth) {
                        pObj.inp.css({
                            'left': -(cnt += spd),
                            'position': 'absolute'
                        });

                        this.tm = setTimeout(txtSlide, pObj.msec);
                    } else {
                        cnt = -ini;
                        this.tm = setTimeout(txtSlide, pObj.msec);
                        //pObj.repeat -= 1;

                        //if (pObj.infinity == true || pObj.repeat > 0) {
                        //    this.tm = setTimeout(txtSlide, 0);
                        //} else {
                        //    if (pObj.endfn != undefined) {
                        //        (pObj.endfn)();
                        //    }
                        //}
                    }
                })();
            }

            this.Stop = function () {
                // 타이머값이 고유하게 저장되지 않네... 음...
                //if (pObj.tm != undefined) {
                //    clearTimeout(this.tm);
                //}

                this.infinity = false;
            }

            this.Dispose = function () {
                //this.ani.parent().remove();
                if (this.tm != undefined) {
                    clearTimeout(this.tm);
                }

                this.cartoon.parent('.cartoon').remove();
            }
        } else {
            return undefined;
        }
    } catch (e) {

    }

    return this;
}
/* Text Slide, 애니메이션 ]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]]] */

function goStep(pUrl) {
    $('body').fadeOut(300);
    setTimeout(function () { window.location.replace(pUrl); }, 300);
    return false;
}

function goIndex() {
    //$('#imgExit').attr('src', '../common/img/exit_d.png');
    //$('body').fadeOut(300);
    //setTimeout(function () { window.location.replace('../index.aspx'); }, 300);
    wsBRPK.GetCustomerUrl(onSuccGoHome, onFail);
    return false;
}

function goHome(pUrl) {
    return false;
}

// Home 으로 이동 추가 시작 - 16-08-05 박현기
function goToHome() {
    onExitStudy()
}

function onSuccGoHome(p1, p2) {
    //goHome(p1);
}

function onFail() {
}
// Home 으로 이동 추가 끝 - 16-08-05 박현기

function goLogOut(pUrl) {
    onExitStudy()
    return false;
}

function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    let pValue = '';
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            pValue = sParameterName[1];
            if( pValue){
                break;
            }
        }
    }
    if(!pValue) {
        return '';
    }
    return pValue;
}

// studyid 비교, wsBRPK.GetCrntStudyID(onSuccGetCrntStudyID, onFail); 호출 후 발생
function onSuccGetCrntStudyID(p1, p2, p3) {
    if (p1.toLowerCase() != _gvStudyId.toLowerCase()) {
        alert('another login detected');
        goToHome();
    }
}

var _bgm;
//function PlayLandBGM(pLand) {
//    var sndSrc;
//    var urlLand;

//    if (pLand == "ALPHABET") {
//        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/AlphabetLand/bgm_alphabetland.mp3"
//    } else if (pLand == "SOUND") {
//        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/SongLand/bgm_songland.mp3"
//    } else if (pLand == "SONG") {
//        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/SongLand/bgm_songland.mp3"
//    } else if (pLand == "WORD") {
//        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/WordLand/bgm_wordland.mp3"
//    } else if (pLand == "PHONICS") {
//        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/PhonicsLand/bgm_phonicsland.mp3"
//    }

//    if (_bgm != undefined && _bgm != NaN) {
//        _bgm.Stop();
//    }

//    _bgm = Sound({
//        src: sndSrc,
//        repeat: 0
//    },
//        undefined,
//        undefined
//    );

//    _bgm.Play();
//}

//function PlayLandBGM(pLand) {
//    if (pLand == "ALPHABET") {
//        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/AlphabetLand/bgm_alphabetland_.mp3"
//    } else if (pLand == "SOUND") {
//        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/SongLand/bgm_songland.mp3"
//    } else if (pLand == "SONG") {
//        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/SongLand/bgm_songland.mp3"
//    } else if (pLand == "WORD") {
//        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/WordLand/bgm_wordland.mp3"
//    } else if (pLand == "PHONICS") {
//        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/PhonicsLand/bgm_phonicsland.mp3"
//    }

//    var audio = new Audio();
//    audio.volume = 0.25;
//    audio.setAttribute('src', sndSrc);

//    audio.addEventListener('ended', function () {
//        audio.play();
//    });

//    audio.play();
//}

function PlayLandBGM(pLand) {
    if (pLand == "ALPHABET") {
        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/AlphabetLand/bgm_alphabetland_.mp3"
    } else if (pLand == "SOUND") {
        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/SongLand/bgm_songland.mp3"
    } else if (pLand == "SONG") {
        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/SongLand/bgm_songland.mp3"
    } else if (pLand == "WORD") {
        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/WordLand/bgm_wordland.mp3"
    } else if (pLand == "PHONICS") {
        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/PhonicsLand/bgm_phonicsland.mp3"
    }

    if (_bgm != undefined && _bgm != NaN) {
        _bgm.pause();
    }

    _bgm = new Audio();
    _bgm.volume = 0.25;
    _bgm.setAttribute('src', sndSrc);

    _bgm.addEventListener('ended', function () {
        _bgm.play();
    });

    _bgm.play();
}

function PlayLandMain(pLand) {
    if (pLand == "ALPHABET") {
        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/AlphabetLand/AL-Main.mp3"
    } else if (pLand == "SOUND") {
        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/SoundLand/SL-Main.mp3"
    } else if (pLand == "SONG") {
        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/SongLand/SL-Main.mp3"
    } else if (pLand == "WORD") {
        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/WordLand/WL-Main.mp3"
    } else if (pLand == "PHONICS") {
        sndSrc = "https://wcfresource.a1edu.com/newsystem/sound/PK/PhonicsLand/PL-Main.mp3"
    }

    if (_bgm != undefined && _bgm != NaN) {
        _bgm.pause();
    }

    _bgm = new Audio();
    _bgm.volume = 0.25;
    _bgm.setAttribute('src', sndSrc);

    _bgm.addEventListener('ended', function () {
        _bgm.addEventListener('ended', undefined);
        PlayLandBGM(pLand);
        //_bgm.play();
    });

    _bgm.play();
}

function StopLandBGM() {
    if (_bgm != undefined && _bgm != NaN) {
        _bgm.pause();
    }
    //_bgm.Dispose();
}

function PlayDirection(pLand, pDirection, pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "https://wcfresource.a1edu.com/NewSystem/sound/PK/" + pLand + "/" + pDirection,
        repeat: 1
    },
        undefined,
        pEndFun
    );

    _snd.Play();
}

function PlayEffect(pEffect, pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    _snd = Sound({
        src: "../Content/NewSystem/Sound/SoundEffect/" + pEffect,
        repeat: 1
    },
        undefined,
        pEndFun
    );

    _snd.Play();
}

function showClick() {
    $('#imgClick').css('display', 'block');
    setTimeout(function () { $('#imgClick').css('display', 'none') }, 300);
    setTimeout(function () { $('#imgClick').css('display', 'block') }, 600);
    setTimeout(function () { $('#imgClick').css('display', 'none') }, 900);
    setTimeout(function () { $('#imgClick').css('display', 'block') }, 1200);
    setTimeout(function () { $('#imgClick').css('display', 'none') }, 1500);
}

function showClick2() {
    $('#imgClick').addClass('clickMove');
    $('#imgClick').css('display', 'block');
}


function hideClick() {
    $('#imgClick').css('display', 'none');
}

function showDragUp() {
    $('#divDrag').css('display', 'block');
    $('#imgDragF1').animate({ 'left': '+=60px', 'top': '-=150px' }, { 'duration': 1200 }, { 'easing': 'linear' });
    setTimeout(function () {
        $('#imgDragF1').animate({ 'left': '-=60px', 'top': '+=150px' }, { 'duration': 50 }, { 'easing': 'linear' });
        $('#imgDragF1').animate({'left': '+=60px', 'top': '-=150px'}, { 'duration': 1200 }, { 'easing': 'linear' });
    }, 1300);
}

function showDragDn() {
    $('#divDrag').css('display', 'block');
    $('#imgDragF2').animate({ 'left': '+=60px', 'top': '+=150px' }, { 'duration': 1200 }, { 'easing': 'linear' });
    setTimeout(function () {
        $('#imgDragF2').animate({ 'left': '-=60px', 'top': '-=150px' }, { 'duration': 50 }, { 'easing': 'linear' });
        $('#imgDragF2').animate({ 'left': '+=60px', 'top': '+=150px' }, { 'duration': 1200 }, { 'easing': 'linear' });
    }, 1300);
}

function hideDrag() {
    $('#divDrag').css('display', 'none');
}

/* Tools */
function isAlpha(pStr) {
    var chkString = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    for (i = 0; i < pStr.length; i++) {
        if (chkString.indexOf(pStr.substring(i, i + 1)) == -1)
            return false;
    }

    return true;
}

function setScale(pObj, pScale) {
    pObj.css('transform', 'scale(' + pScale + ')');
}

function ChoiceShuffle(pArr) {
    var currentIndex = pArr.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = pArr[currentIndex];
        pArr[currentIndex] = pArr[randomIndex];
        pArr[randomIndex] = temporaryValue;
    }

    return pArr;
}

function LockScreen() {
    $('#divLock').css('display', 'block');
}

function UnLockScreen() {
    $('#divLock').css('display', 'none');
}

function ShowNextQzBtn() {
    $('#divSpeaker').css('display', 'block');
    LockScreen();
}

function HideNextQzBtn() {
    $('#divSpeaker').css('display', 'none');
}

function hello() {
    alert('hello');
}

function getBrowserInfo() {
    var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
        return { name: 'IE', version: (tem[1] || '') };
    }
    if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR\/(\d+)/)
        if (tem != null) { return { name: 'Opera', version: tem[1] }; }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
    return {
        name: M[0],
        version: M[1]
    };
}

function IE10Under() {
    var retn = false;
    var ieInfo = getBrowserInfo();

    if ((ieInfo.name == 'IE' || ieInfo.name == 'MSIE') && (ieInfo.version == '10' || ieInfo.version == '9' || ieInfo.version == '8' || ieInfo.version == '7')) {
        retn = true;
    }

    return retn;
}
/*************************************************************/

// Alphabet Land Step 체크하여 바로가기 추가 - 16-04-29 박현기
function fnc_chkAlphabetLandStep() {
    var vScoreStep1 = document.getElementById("txtScoreStep1").value;
    var vScoreStep2 = document.getElementById("txtScoreStep2").value;
    var vScoreStep3 = document.getElementById("txtScoreStep3").value;

    if (_usermode == 1) {
        if (vScoreStep2 == "100") {
            goStep('step3p.html?arg1=' + getParam("arg1") + '&arg2=' + getParam("arg2") + '&arg3=' + getParam("arg3"));
            return false;
        } else if (vScoreStep1 == "100") {
            // Step2 Activity로 이동
            //alert("Step2(으)로 이동합니다.");

            if (GetOrder(_alphabet) % 2 == 1) {
                goStep('step2a.html?arg1=' + getParam("arg1") + '&arg2=' + getParam("arg2") + '&arg3=' + getParam("arg3"));
            } else {
                goStep('step2b.html?arg1=' + _pNum + '&arg2=' + _usermode + '&arg3=' + _gvStudyId);
            }

            return false;
        }
    }
}

var isEmpty = function (value) {
    if (value == "" || value == null || value == undefined || (value != null && typeof value == "object" && !Object.keys(value).length)) {
        return true;
    } else {
        return false;
    }
};

// StudyInfo
function fncGetStudyInfo() {
    alert("fncGetStudyInfo()");
}

// REF.StudyId 와 _gvStudyId 비교
function fncCheckStudyId() {
    var sessionStorageApiStudyInfo = sessionStorage.getItem("apiStudyInfo");

    //var obj = $.parseJSON(sessionStorageApiStudyInfo);
    var obj = JSON.parse(sessionStorageApiStudyInfo);
    var gvStorageStudyInfo = new Array();

    gvStorageStudyInfo.StudyId = obj.StudyId;

    var _usermode = getUrlParameter('arg2').toString().toLowerCase();
    var _gvStudyId = getUrlParameter('arg3').toString().toLowerCase();

    if (_usermode == "1") {
        if (gvStorageStudyInfo.StudyId.toLowerCase() != _gvStudyId.toLowerCase()) {
            alert('Another study detected!');
            //goToHome();
        } else {
            //alert("StudyId OK !");
        }
    }
}
