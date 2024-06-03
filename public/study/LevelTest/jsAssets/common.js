//브라우저 체크
var isMobile = false;
var isIPAD = false;
var isIE = false;

// 운영관련 변수
var isPageWorking = false;
var isAudioPlaying = false;
var isAudioLoaded = false;
var isAudioDragging = false;

isMobile = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()));

function detectIE() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
        // IE 10 or older => return version number
        return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
    }
    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
        // IE 11 => return version number
        var rv = ua.indexOf('rv:');
        return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
    }
    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
        // IE 12 => return version number
        return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
    }
    // other browser
    return false;
}
isIE = detectIE();

$(document).ready(function () {
    //오디오 태그 생성 및 이벤트 적용
    $('body').append('<audio id="audio" type="audio/mpeg"></audio>');
});


function dummy(rtn) {
    if (!rtn) {
        return '&nbsp;';
    }
    return rtn.replace(/\n$/, '<br>&nbsp;').replace(/\n/g, '<br>');
}

// 숫자 앞에 0 채우기 (n:숫자, l:숫자를 포함한 문자열 길이 ******************************
function fillZero(n, l) {
    l -= n.toString().length;
    if (l > 0) {
        return new Array(l + (/\./.test(n) ? 2 : 1)).join('0') + n;
    }
    return n + '';
}

// 숫자를 라운드수로 바꾸기 *************************************************************
function getCircleNumber(n) {
    var rtn = '';
    if (n == 1) rtn = '①';
    else if (n == 2) rtn = '②';
    else if (n == 3) rtn = '③';
    else if (n == 4) rtn = '④';
    else if (n == 5) rtn = '⑤';
    return rtn;
}

// 문자를 라운드 문자로 바꾸기 *************************************************************
function getCircleChar(n) {
    var rtn = '';
    n = n + '';
    if (n == '1') rtn = '&#9312;';
    else if (n == '2') rtn = '&#9313;';
    else if (n == '3') rtn = '&#9314;';
    else if (n == '4') rtn = '&#9315;';
    else if (n == '5') rtn = '&#9316;';
    else if (n == '6') rtn = '&#9317;';
    else if (n == '7') rtn = '&#9318;';
    else if (n == '8') rtn = '&#9319;';
    else if (n == '9') rtn = '&#9320;';
    else if (n == '10') rtn = '&#9321;';
    else if (n == '11') rtn = '&#9322;';
    else if (n == '12') rtn = '&#9323;';
    else if (n == '13') rtn = '&#9324;';
    else if (n == '14') rtn = '&#9325;';
    else if (n == '15') rtn = '&#9326;';
    else if (n == '16') rtn = '&#9327;';
    else if (n == '17') rtn = '&#9328;';
    else if (n == '18') rtn = '&#9329;';
    else if (n == '19') rtn = '&#9330;';
    else if (n == '20') rtn = '&#9331;';
    else if (n == 'A') rtn = '&#9398;';
    else if (n == 'B') rtn = '&#9399;';
    else if (n == 'C') rtn = '&#9400;';
    else if (n == 'D') rtn = '&#9401;';
    else if (n == 'E') rtn = '&#9402;';
    else if (n == 'F') rtn = '&#9403;';
    else if (n == 'G') rtn = '&#9404;';
    else if (n == 'H') rtn = '&#9405;';
    else if (n == 'I') rtn = '&#9406;';
    else if (n == 'J') rtn = '&#9407;';
    else if (n == 'K') rtn = '&#9408;';
    else if (n == 'L') rtn = '&#9409;';
    else if (n == 'M') rtn = '&#9410;';
    else if (n == 'N') rtn = '&#9411;';
    else if (n == 'O') rtn = '&#9412;';
    else if (n == 'P') rtn = '&#9413;';
    else if (n == 'Q') rtn = '&#9414;';
    else if (n == 'R') rtn = '&#9415;';
    else if (n == 'S') rtn = '&#9416;';
    else if (n == 'T') rtn = '&#9417;';
    else if (n == 'U') rtn = '&#9418;';
    else if (n == 'V') rtn = '&#9419;';
    else if (n == 'W') rtn = '&#9420;';
    else if (n == 'X') rtn = '&#9421;';
    else if (n == 'Y') rtn = '&#9422;';
    else if (n == 'Z') rtn = '&#9423;';
    return rtn;
}


// 시간 표시 ****************************************************************************
function getTimerMS(sec) {
    if (isNaN(sec)) sec = 0;
    sec = parseInt(sec);
    if (sec > 0) {
        var mm = Math.floor(sec / 60);
        var ss = fillZero(Math.floor(sec % 60), 2);
        return mm + ':' + ss;
    } else {
        return '00:00';
    }
}

function getTimerS(sec) {
    if (isNaN(sec)) {
        sec = 0;
    }

    sec = parseInt(sec);

    if (sec > 0) {
        var ss = sec;
        return ss;
    } else {
        return '0';
    }
}

var gvZoomRate = 100;
function gfResizePageBook() {
    var dh = $(window).height();
    var dw = $(window).width();
    //var h = dh / 900;
    //var w = dw / 1230;
    var h = dh / 960;
    var w = dw / 1230;

    if (h < 1) {
        gvZoomRate = Math.ceil(h * 100);
    } else if (w < 1) {
        gvZoomRate = Math.ceil(w * 100);
    }

    if (gvZoomRate <= 100) {
        var pos_top = 0;
        var pos_left = (dw - 1230 * gvZoomRate / 100 + 60) / 2;
        var r = (gvZoomRate / 100);
        var ori = 'top left';
        var val = 'scale(' + r + ',' + r + ')';
        $('#outline').css({
            '-webkit-transform-origin': ori,
            '-webkit-transform': val,
            '-moz-transform-origin': ori,
            '-moz-transform': val,
            '-ms-transform-origin': ori,
            '-ms-transform': val,
            '-o-transform-origin': ori,
            '-o-transform': val,
            'transform-origin': ori,
            'transform': val,
            'position': 'absolute', 'top': pos_top + 'px', 'left': pos_left  + 'px'
        });
    }
}

function gfResizePage() {
    var dh = $(window).height();
    var dw = $(window).width();
    var h = dh / 920;
    var w = dw / 910;

    if (h < 1 || w < 1) {
        gvZoomRate = Math.ceil((h > w ? w : h) * 100);
    }

    if (gvZoomRate < 100) {
        var pos_top = 0;
        var pos_left = (dw - 910 * gvZoomRate / 100) / 2;

        var r = (gvZoomRate / 100);
        var ori = 'top left';
        var val = 'scale(' + r + ',' + r + ')';
        $('#outline').css({
            '-webkit-transform-origin': ori,
            '-webkit-transform': val,
            '-moz-transform-origin': ori,
            '-moz-transform': val,
            '-ms-transform-origin': ori,
            '-ms-transform': val,
            '-o-transform-origin': ori,
            '-o-transform': val,
            'transform-origin': ori,
            'transform': val,
            'position': 'absolute', 'top': pos_top + 'px', 'left': pos_left + 'px'
        });
    }
}

// 20181101 p북 위치조정 함수
//function gfResizePagePB() {
//    var dh = $(window).height();
//    var dw = $(window).width();
//    var h = dh / 840;
//    var w = dw / 1200;

//    if (h < 1 || w < 1) {
//        gvZoomRate = Math.ceil((h > w ? w : h) * 100);
//    }

//    if (gvZoomRate < 100) {
//        var pos_top = 0;
//        var pos_left = (dw - 1200 * gvZoomRate / 100) / 2;
//        var r = (gvZoomRate / 100);
//        var ori = 'top left';
//        var val = 'scale(' + r + ',' + r + ')';
//        $('#outline').css({
//            '-webkit-transform-origin': ori,
//            '-webkit-transform': val,
//            '-moz-transform-origin': ori,
//            '-moz-transform': val,
//            '-ms-transform-origin': ori,
//            '-ms-transform': val,
//            '-o-transform-origin': ori,
//            '-o-transform': val,
//            'transform-origin': ori,
//            'transform': val,
//            'position': 'absolute', 'top': pos_top + 'px', 'left': pos_left + 'px'
//        });
//    }
//}

// 2018-10-24 2레벨 이상용 페이지 호출 함수 추가.
function gfResizePageBook2Lvl() {
    $('body').css('overflow', 'hidden');
    var dh = $(window).height();
    var dw = $(window).width();
    var slidertp = 0;
    //var h = dh / 850;
    var h = dh / 880;
    var w = dw / 1200;
    
    //if (window.outerHeight - window.innerHeight < 10) {
    //    // F11 full screen
    //    $('#boxTop').css('margin-top', '3em');
    //    slidertp = 55;
    //    gvBookZoomRate = gvBookZoomRate + 10;
    //} else {
    //    $('#boxTop').css('margin-top', '1em');
    //    slidertp = 15;
    //}

    if (window.outerHeight - window.innerHeight < 10) {
        // F11 full screen
        $('#boxTop').css('margin-top', '3em');
        slidertp = 30;
        gvBookZoomRate = gvBookZoomRate + 10;
    } else {
        slidertp = 15;
    }

    $('#bgSkin').css('height', window.innerHeight + 'px');
    //$('#bgSkin').css('width', window.innerHeight * 1920 / 984 + 'px');

    //$('#boxTop').css('margin-top', '2.em');

    if (h < 1 || w < 1) {
        gvZoomRate = Math.ceil((h > w ? w : h) * 100);
    } else {
        gvZoomRate = gvBookZoomRate;
    }

    if (gvZoomRate < 200) {
        var pos_top = 0;
        var pos_left = (dw - 1150 * gvZoomRate / 100) / 2;
        var r = (gvZoomRate / 100);
        var ori = 'top left';
        var val = 'scale(' + r + ',' + r + ')';
        gvScale = r;

        $('#outline').css({
            '-webkit-transform-origin': ori,
            '-webkit-transform': val,
            '-moz-transform-origin': ori,
            '-moz-transform': val,
            '-ms-transform-origin': ori,
            '-ms-transform': val,
            '-o-transform-origin': ori,
            '-o-transform': val,
            'transform-origin': ori,
            'transform': val,
            'position': 'absolute', 'top': pos_top + 'px', 'left': pos_left + 'px',
        });

        // for slider scale
        var sliderwidth = 1050 * r;
        var slidertop = 827 * r;
        var sliderleft = (dw - 1040 * gvZoomRate / 100) / 2;

        $('#dvslider').css('width', sliderwidth + 'px');
        $('#dvslider').css('left', sliderleft + 'px');

        // forcus for keydown
        $('.container').focus();
        $('#textinput').focus();

        // for debug [[
        if (crdebug == true) {
            $("#ScreenWidth").text(dw);
        }
        // ]]

        if (crdebug == true) {
            $('#dvslider').css('top', (slidertop + 15 + slidertp) + 'px');
        } else {
            $('#dvslider').css('top', slidertop + slidertp + 'px');
        }
    }
}

function gfResizePage2Lvl() {
    var dh = $(window).height();
    var dw = $(window).width();
    var h = dh / 900;
    var w = dw / 1200;

    if (h < 1 || w < 1) {
        gvZoomRate = Math.ceil((h > w ? w : h) * 100);
    }

    if (gvZoomRate < 100) {
        var pos_top = 0;
        var pos_left = (dw - 1200 * gvZoomRate / 100) / 2;

        var r = (gvZoomRate / 100);
        var ori = 'top left';
        var val = 'scale(' + r + ',' + r + ')';
        $('#outline').css({
            '-webkit-transform-origin': ori,
            '-webkit-transform': val,
            '-moz-transform-origin': ori,
            '-moz-transform': val,
            '-ms-transform-origin': ori,
            '-ms-transform': val,
            '-o-transform-origin': ori,
            '-o-transform': val,
            'transform-origin': ori,
            'transform': val,
            'position': 'absolute', 'top': pos_top + 'px', 'left': pos_left + 'px'
        });
    }
}

document.write('<script type="text/javascript" src="jsAssets/global_function.js?var=2018082100"></script>');
document.write('<script type="text/javascript" src="jsAssets/config.js?var=2"></script>');
document.write('<script type="text/javascript" src="jsAssets/language.js?var=20201020"></script>');

//if (!isMobile) {
//    $(window).resize(function () {
//        // gfResizePage();
//    });
//}

//if (isMobile) {
//    $(document).ready(function () {
//        $('body').css('overflow-y', 'scroll');
//    });
//}

function gfShuffelWord(word) {
    var shuffledWord = '';
    word = word.split('');
    while (word.length > 0) {
        shuffledWord += word.splice(word.length * Math.random() << 0, 1);
    }
    return shuffledWord;
}