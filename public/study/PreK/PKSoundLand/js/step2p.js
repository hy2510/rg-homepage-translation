var _letter;
var _pNum;
var _selected;
var _move = false;
var _cnt = 0;
var _try = 0;

$(document).ready(function () {
    getArgs();

    //sunnyfantest [
    //_pNum = 1;
    // ]

    PlayLandBGM("SOUND");

    _selected = (_pNum - 27) * 24 + 6;
    $('#divStart').css('display', 'block');
    $("#imgStart").bind('click', function (e) { Start(); });
    
    PlayDirection('SoundLand', 'EB-PK-S2.mp3', undefined);
});

// timer
var _tmArray;

// highlight array
var _h0Array;
var _h1Array;
var _h2Array;
var _letter;

//단어 MP3 주소
var _httpSoundAddress = "https://wcfresource.a1edu.com/Sound/BookReading/EB/";
var _httpAnswerSoundAddress = "../Content/Sound/SoundEffect/";

function LoadTest() {
    UnLockScreen();

    var a = 0;
    $('#divPannel1').css('display', 'none');

    SetStory();
    _letter = _soundland[_selected + _cnt].letter;
    _word = _soundland[_selected + _cnt].qword;
    playLetters(_letter, undefined);
}

function playLetters(pLetter, pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    var audio = $("#player");

    // 재생시간이 변경될 때 마다 함수 호출
    //$("#player").bind('timeupdate', highLight);
    var sndAddr = "https://wcfresource.a1edu.com/NewSystem/sound/PK/Phonetic/" + pLetter + ".mp3";
    audio.attr('src', sndAddr);
    audio.bind('ended', function () {
        audio.unbind('ended');

        if (_try == 2) {
            HideHighLight();
        } else if (_try == 3) {
            setScale($('#' + _h2Array[0]), 1.0);
        }

        _try++;

        for (a = 0; a < _h0Array.length; a++) {
            $('#' + _h0Array[a]).animate({
                'margin-top': "20px",
            }, 300);
        }

        if (_try == 1) {
            playLetters(_letter, undefined);
        } else if (_try == 2) {
            ShowHighLight();
            //playWord(_word, undefined);
            playLetters(_word, undefined);
        } else if (_try == 3) {
            setScale($('#' + _h2Array[0]), 1.4);
            //playImage(_word, undefined);
            playLetters(_word, undefined);
        } else {
            _try = 0;
            _cnt++;
            if (_cnt > 5) {
                _try = 4;
                $('#divPannel1').css('display', 'block');
            } else {
                LoadTest();
            }
        }

        if (pEndFun != undefined) {
            pEndFun();
        }
    });
    audio[0].pause();
    audio[0].load();
    audio[0].play();

    if (_try < 2) {
        for (a = 0; a < _h0Array.length; a++) {
            $('#' + _h0Array[a]).animate({
                'margin-top': "-=30px",
            }, 300);
        }
    }

    return false;
}

function playWord(pWord, pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    ShowHighLight();

    var audio = $("#player");

    var sndAddr = "https://wcfresource.a1edu.com/NewSystem/sound/PK/Phonetic/" + pWord + ".mp3";
    audio.attr('src', sndAddr);
    audio.bind('ended', function () {
        audio.unbind('ended');
        HideHighLight();
    });
    audio[0].pause();
    audio[0].load();
    audio[0].play();

    return false;
}

function playImage(pWord, pEndFun) {
    if (_snd != undefined && _snd != NaN) {
        _snd.Stop();
    }

    setScale($('#' + _h2Array[0]), 1.4);

    var audio = $("#player");

    var sndAddr = "https://wcfresource.a1edu.com/NewSystem/sound/PK/Phonetic/" + pWord + ".mp3";
    audio.attr('src', sndAddr);
    audio.bind('ended', function () {
        audio.unbind('ended');
        setScale($('#' + _h2Array[0]), 1.0);
    });
    audio[0].pause();
    audio[0].load();
    audio[0].play();

    return false;
}

function HideHighLight() {
    var i = 0;
    for (i = 0; i < _h0Array.length; i++) {
        $('#' + _h0Array[i]).css('background-color', 'transparent');
    }

    for (i = 0; i < _h1Array.length; i++) {
        $('#' + _h1Array[i]).css('background-color', 'transparent');
    }
}

function ShowHighLight() {
    var i = 0;

    for (i = 0; i < _h0Array.length; i++) {
        $('#' + _h0Array[i]).css('background-color', 'yellow');
    }

    for (i = 0; i < _h1Array.length; i++) {
        $('#' + _h1Array[i]).css('background-color', 'yellow');
    }
}

function imageGetBigger() {
    var i = 0;

    //
}

// 문장 배치
function SetStory() {
    var i = 0;
    var j = 0;

    //* 스토리 화면 동적생성
    var quizWord = _soundland[_selected + _cnt].qword;
    var quizLetr = _soundland[_selected + _cnt].letter;
    var addLetr = _soundland[_selected + _cnt].blank;
    var strRed;
    var strBlack;

    var spceDiv = '<div style="width:40px; height:60px; float:left; margin-top:3px;"></div>';
    var qlLength = 0;
    var qlMatchCnt = 0;
    var crntAlphebet;

    if (quizLetr.length > 1) {
        quizLetr = quizLetr.split("-").join("");
    }
    qlLength = quizLetr.length;

    _h0Array = new Array();
    _h1Array = new Array();
    _h2Array = new Array();

    var wordDiv = '';

    for (i = 0; i < quizWord.length; i++) {
        var idxCH = quizWord.indexOf(quizLetr);

        if (quizWord.substring(i, i + 1) == quizLetr[qlMatchCnt].toString() && i < idxCH + quizLetr.length && i >= idxCH) {
            qlMatchCnt++;
            if (qlLength == qlMatchCnt) {
                for (j = 0; j < qlLength; j++) {
                    var k = i - (qlMatchCnt - 1) + j;
                    wordDiv += '<div style="width:auto; height:auto; float:left; margin-top:20px; font-size:85px; font-weight:bold; color:red;"' + ' id="divR' + k.toString() + '">';
                    crntAlphebet = quizWord.substring(k, k + 1);
                    wordDiv += crntAlphebet;
                    wordDiv += '</div>';

                    _h0Array.push('divR' + k.toString());
                }
                qlMatchCnt = 0;
            }
        } else {
            wordDiv += '<div style="width:auto; height:auto; float:left; margin-top:20px; font-size:85px; font-weight:bold;"' + ' id="divB' + i.toString() + '">';
            crntAlphebet = quizWord.substring(i, i + 1);
            wordDiv += crntAlphebet;
            wordDiv += '</div>';

            qlMatchCnt = 0;

            _h1Array.push('divB' + i.toString());
        }
    }

    // 스페이스
    wordDiv += spceDiv;

    // 단어 이미지
    var word = _soundland[_selected + _cnt].qword;
    var code = _soundland[_selected].code;
    wordDiv += '<div style="width:auto; height:120px; float:left; margin-left:40px; margin-top:0px;"' + ' id="divW' + i.toString() + '">';
    wordDiv += '<img alt="" style="width:auto; height:130px; float:left;" src="' + 'img/quiz/' + code + '/EB-' + code + '-SC-' + word + '.png' + '" />';
    wordDiv += '</div>';
    _h2Array.push('divW' + i.toString());

    // 동적으로 생성된 단어들을 화면에 띄움
    $('#divWordsArray')[0].innerHTML = wordDiv;
}

function goStep2T() {
    goStep('step2a.html');
    //document.location.href = '/hp/M_EXRG/EBOOK/Level_PK/Step/Step2A.aspx';
}