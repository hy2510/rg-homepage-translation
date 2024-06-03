var crStep = "1";
var gvStudyInfo = new Array();
var bagQz = new Array();
var bagRc = new Array();
var bagAnwr = new Array();

var crQzMax = 0;
var crQzSeq = 0;
var crAud = "";
var crCorAnwr = "";
var crUsrAnwr = "";
var crAnwrCnt = 0;
var crAnwrMax = 1;
var isStepFinished = false;
var nxDetailId = "";
var nxLevel = "";
var crQzType = "";
var objTmr;
var crTimeLimit = 45;

var isLevelChanged = false;
var nowLevel = "";
var _lvl = getUrlParameter('lvl');

var levelTestYn = "";
var gvStorageStudyInfo = new Array();
var sslStudyInfo = new Array();
var crCorChk = 2;

function getUrlParameter(sParam) {
    var retstr;

    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            retstr =  sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }

    return retstr;
};

function doStart() {
    try {
        gvMode = 1;
        isStepFinished = false;
        crQzSeq = 0;
        crAnwrCnt = 0;
        getStudyInfoNew();
    } catch (er) { }
}

function getStudyInfo() {

}

function getStudyInfoNew() {
    // #####################################################################################
    // ################### sessionStorage apiStudyInfo 에서 값 가져오기 ####################
    // #####################################################################################
    const sessionStorageapiStudyInfo = sessionStorage.getItem("apiStudyInfo");
    if(!sessionStorageapiStudyInfo){
        swal("레벨 테스트 정보 조회 오류 1");
        return
    }
    const obj = JSON.parse(sessionStorageapiStudyInfo);
    gvStudyInfo = { ...obj }
    
    if(!gvStudyInfo.LevelTestId || !gvStudyInfo.LevelTestDetailId){
        swal("레벨 테스트 정보 조회 오류 2");
        return
    }
    getQuizNew();
}

function getStudyInfoOnSucc(p1, p2, p3) {
    if (p1 != "") {
        var ar = $.parseJSON(p1);

        if (ar.length == 0) {
            alert("테스트 정보를 가져오는데 실패했습니다.");

            return;
        } else {
            gvStudyInfo = ar[0];

            levelTestYn = gvStudyInfo.LevelTestYn;

            if (levelTestYn == "Y") {
                swal({ text: getLanguage("이미 테스트를 진행했습니다.") }).then(function () {  });
            }            

            nowLevel = gvStudyInfo.Level;

            if (gvStudyInfo.Level == null || gvStudyInfo.Level == '') {
                location.replace('QZ.aspx');
            } else {
                if (gvStudyInfo.Level == 'K') {
                    location.replace('QK.aspx');
                } else {
                    getQuiz();
                }
            }
        }
    }
}

function getStudyInfoOnFail(p1, p2) {

}

function getQuiz() {

}

function getQuizOnSucc(p1, p2, p3) {
    if (p1 != "") {
        var ar = $.parseJSON(p1);

        if (ar.length == 0) {
            alert("테스트 문제를 가져오는데 실패했습니다.");

            return;
        } else {
            bagQz = ar;
        }
    }

    for (var i = 0; i < bagQz.length; i++) {
        if (bagQz[i].OX == null) {
            crQzSeq = i;

            break;
        }
    }

    crQzMax = bagQz.length;
    crQzType = bagQz[0].QuizType;
    $('#boxMain .bg').prop('class', 'bg' + (crQzType == 'A' ? '' : ' b'));

    $('#popStart .bt').eq(0).on('click touchstart', function () {
        gfPopClose($('#popStart'));
        setTimeout(function () {
            setQuiz();
        }, 500);
    });

    $('#popLevel .bt').eq(0).on('click touchstart', function () {
        gfPopClose($('#popLevel'));
        setTimeout(function () {
            setQuiz();
        }, 500);
    });

    if (isLevelChanged == false) {
        gfPop($('#popStart'));
    } else {
        switch (nowLevel) {
            case "1":
                $("#popLevelbg").attr("src", "img/h/popup_level1.png");

                break;
            case "2":
                $("#popLevelbg").attr("src", "img/h/popup_level2.png");

                break;
            case "3":
                $("#popLevelbg").attr("src", "img/h/popup_level3.png");

                break;
            case "4":
                $("#popLevelbg").attr("src", "img/h/popup_level4.png");

                break;
            case "5":
                $("#popLevelbg").attr("src", "img/h/popup_level5.png");

                break;
            case "6":
                $("#popLevelbg").attr("src", "img/h/popup_level6.png");

                break;
            default:
                $("#popLevelbg").attr("src", "img/h/popup_level1.png");
        }

        gfPop($('#popLevel'));
    }
}

function getQuizNew() {
    getQuizData(gvStudyInfo.LevelTestDetailId).then(data=> {
        if(!data.ok){
            throw new Error('Network response was not ok');
        }
        return data.json()
    }).then(json => {
        let ar = json.quiz;

        if(ar.length === 0){
            throw new Error('테스트 문제를 가져오는데 실패했습니다.');
        }
        const qzLevel = ar[0].Level
        if(qzLevel === 'K'){
            gvStudyInfo.Level = qzLevel
            sessionStorage.setItem("apiStudyInfo", JSON.stringify(gvStudyInfo));
            location.replace(`QK.html`)
            return
        }

        bagQz = [...ar]
        for (let i = 0; i < bagQz.length; i++) {
            if (bagQz[i].OX == null) {
                crQzSeq = i;
                break;
            } else {
                bagRc.push({ 'QuizId': bagQz[i].QuizId, 'OX': bagQz[i].OX });
            }
        }
        crQzMax = bagQz.length;
        crQzType = bagQz[0].QuizType;

        $('#boxMain .bg').prop('class', 'bg' + (crQzType == 'A' ? '' : ' b'));

        $('#popStart .bt').eq(0).on('click touchstart', function () {
            gfPopClose($('#popStart'));
            setTimeout(function () {
                setQuiz();
            }, 500);
        });

        $('#popLevel .bt').eq(0).on('click touchstart', function () {
            gfPopClose($('#popLevel'));
            setTimeout(function () {
                setQuiz();
            }, 500);
        });

        if (isLevelChanged == false) {
            gfPop($('#popStart'));
        } else {
            switch (nowLevel) {
                case "1":
                    $("#popLevelbg").attr("src", "img/h/popup_level1.png");

                    break;
                case "2":
                    $("#popLevelbg").attr("src", "img/h/popup_level2.png");

                    break;
                case "3":
                    $("#popLevelbg").attr("src", "img/h/popup_level3.png");

                    break;
                case "4":
                    $("#popLevelbg").attr("src", "img/h/popup_level4.png");

                    break;
                case "5":
                    $("#popLevelbg").attr("src", "img/h/popup_level5.png");

                    break;
                case "6":
                    $("#popLevelbg").attr("src", "img/h/popup_level6.png");

                    break;
                default:
                    $("#popLevelbg").attr("src", "img/h/popup_level1.png");
            }

            gfPop($('#popLevel'));
        }
    }).catch(error => {
        alert(error.message);
    })
}

function getQuizOnFail(p1, p2) {

}

function setQuiz() {
    try {
        isPageWorking = true;
        $('#elNum').html(crQzSeq + 1);
        $('#elAnswer').html('');

        var j = bagQz[crQzSeq];
        crAud = j.QuestionSoundPath;
        crCorAnwr = j.CorrectText;

        $('#elQuestion').html(j.Question.replace(/\n/gi, '<br/>'));

        bagAnwr = new Array();
        if (j.Example1 != null && j.Example1 != '') bagAnwr.push({ 'Example': j.Example1 });
        if (j.Example2 != null && j.Example2 != '') bagAnwr.push({ 'Example': j.Example2 });
        if (j.Example3 != null && j.Example3 != '') bagAnwr.push({ 'Example': j.Example3 });
        if (j.Example4 != null && j.Example4 != '') bagAnwr.push({ 'Example': j.Example4 });
        if (j.Example5 != null && j.Example5 != '') bagAnwr.push({ 'Example': j.Example5 });

        bagAnwr = shuffle(bagAnwr);

        $('#elLevel').css('display', 'block').html("Level " + j.Level);
        $('#num').css('display', 'block');

        if (gvMode == 3 || isTestMode == 1) {
            //$('#elLevel').css('display', 'block').html(j.Level);

            for (var i = 0; i < bagAnwr.length; i++) if (bagAnwr[i].Example == crCorAnwr) { var tmp = bagAnwr[i]; bagAnwr[i] = bagAnwr[0]; bagAnwr[0] = tmp; }
        }

        var anwr = '<table><tbody>';

        for (var i = 0; i < bagAnwr.length; i++) {
            anwr += '<tr>';
            anwr += '<td>';
            anwr += '<div class="n' + (i + 1) + '">';
            anwr += '<span class="chk"><img src="img/h/check.png"/></span>';
            anwr += '<span class="no"><img src="img/h/n' + (i + 1) + '.png"/></span>';
            anwr += '<span class="tx">' + bagAnwr[i].Example + '</span>';
            anwr += '</div>';
            anwr += '</td>';
            anwr += '</tr>';
        }

        anwr += '</tbody></table>';
        $('#elAnswer').html(anwr);

        $('#elAnswer td>div').on('click touchstart', function () {
            if (isPageWorking) return false;

            var idx = $('#elAnswer td>div').index($(this));
            $('#elAnswer td>div').each(function () {
                if ($(this).hasClass('chk')) $(this).removeClass('chk');
            });
            $('#elAnswer td>div').eq(idx).addClass('chk');
        }).on('dblclick', function () {
            $('#btNext').trigger('click');
        });

        $('#btNext').off('click touchstart').on('click touchstart', function () {
            if (isPageWorking) return false;

            chkAnswer();
        });

        var qh = $('#elQuestion').height();

        if (qh > 350) {
            $('#boxMain .question').css({ 'top': '100px', 'font-size': '0.875em' });
            $('#boxMain .answer').css({ 'bottom': '120px', 'font-size': '0.875em', 'padding-top': '2px' });
        } else if (qh > 300) {
            $('#boxMain .question').css({ 'top': '100px', 'font-size': '1em' });
            $('#boxMain .answer').css({ 'bottom': '90px', 'font-size': '1em' });
        } else {
            $('#boxMain .question').css({ 'top': '156px', 'font-size': '1em' });
            $('#boxMain .answer').css({ 'bottom': '250px', 'font-size': '1em' });
        }

        isPageWorking = false;
        setTimer();
    } catch (er) { }
}


function chkAnswer() {
    isPageWorking = true;
    var idx = -1;
    $('#elAnswer td>div').each(function () {
        if ($(this).hasClass('chk')) {
            idx = $('#elAnswer td>div').index($(this));

            return false;
        }
    });

    crUsrAnwr = "";

    if (idx > -1) {
        crUsrAnwr = bagAnwr[idx].Example;
    }

    crAnwrCnt++;
    savRecord();
}

function savRecord() {
    clearTimeout(objTmr);

    crCorChk = crCorAnwr==crUsrAnwr? '1': '2';
    bagRc.push({'QuizId':bagQz[crQzSeq].QuizId,'OX':crCorChk});

    if(crQzSeq==crQzMax-1){
        isStepFinished=true;
    }

    const record = {
      levelTestDetailId: gvStudyInfo.LevelTestDetailId,
      quizId: bagQz[crQzSeq].QuizId,
      quizNo: bagQz[crQzSeq].QuizNo,
      currentQuizNo: crQzSeq + 1,
      ox: crCorChk,
      correct: chkEx(crCorAnwr),
      studentAnswer:chkEx(crUsrAnwr),
      answerCount:crAnwrCnt,
      lastQuizYn: isStepFinished ? "Y" : "N"
    }

    saveRecord(record).then(data => {
        if(!data.ok){
            throw new Error('Network response was not ok');
        }
        return data.json()
    }).then(json => {
        if(json.code !== 0){
            throw new Error('레벨테스트 답안 제출 실패 - ' + json.code)
        }
        nxDetailId = '';
        nxLevel = '';
        if(json.next){
            nxDetailId = json.next.nextLevelTestDetailId
            nxLevel = json.next.level
        }
        goNext();
    }).catch(error => {
        swal(error.message)
    })
}

function savRecordOnSucc(p1, p2, p3) {
    if (p1 == "") {
        alert("savRecordOnSucc ERROR");

        return false;
    }

    var obj = $.parseJSON(p1);

    if (obj.length > 0) {
        var rt = obj[0];

        if (rt.ErrorNo == "-1") {
            alert(rt.ErrorMessage);

            return false;
        }

        if (rt.ErrorNo < 1000) {
            nxDetailId = rt.DetailId;
            nxLevel = rt.Level;
            goNext();
        } else {
            if (rt.ErrorNo == 1000 || rt.ErrorNo == 1001 || rt.ErrorNo == 1003) {
                alert("Err:" + rt.ErrorNo + ",Msg:" + rt.ErrorMessage);
            }
            else {
                alert("Error : Not Expected");
            }
        }
    }
}

function savRecordOnFail() {

}

function getTestResultRecord() {
    getTestResult(gvStudyInfo.LevelTestDetailId).then(data =>{
        if(!data.ok){
            throw new Error('Network response was not ok');
        }
        return data.json()
    }).then(json => {
        if(json.result.length === 0){
            throw new Error("테스트 결과를 가져오는데 실패했습니다.")
        }
        bagRc = [...json.result]
        setResult()
    }).catch(error => {
        swal(error.message)
    })
}

function getRecordOnSucc(p1, p2, p3) {
    if (p1 != "") {
        var ar = $.parseJSON(p1);

        if (ar.length == 0) {
            alert("테스트 결과를 가져오는데 실패했습니다.");

            return;
        } else {
            bagRc = ar;
            setResult();
        }
    }
}

function getRecordOnFail(p1, p2) {

}

function goNext() {
    try {
        if (isStepFinished) {
            if (!nxDetailId) {
                getTestResultRecord();
            } else {
                gvStudyInfo.LevelTestDetailId = nxDetailId
                sessionStorage.setItem("apiStudyInfo", JSON.stringify(gvStudyInfo));
                location.reload();
            }
        } else {
            setTimeout(function () {
                crQzSeq++;
                crAnwrCnt = 0;
                isPageWorking = false;
                setQuiz();
            }, 1000);
        }

    } catch (er) { }
}

function setResult() {
    try {
        if (bagRc.length > 0) {
            $('#popResult .lvl').eq(0).html(bagRc[0].ObtainLevelName);
            var anum = 0;
            var bnum = 0;
            var ahtm = "";
            var bhtm = "";

            for (var i = 0; i < bagRc.length; i++) {
                if (bagRc[i].QuizType == 'A') {
                    anum++;
                    ahtm += '<div><img src="img/h/result/' + (bagRc[i].OX == '1' ? 'corr' : 'incor') + '_' + fillZero(anum, 3) + '.jpg"/></div>';
                } else {
                    bnum++;
                    bhtm += '<div><img src="img/h/result/' + (bagRc[i].OX == '1' ? 'corr' : 'incor') + '_' + fillZero(bnum, 3) + '.jpg"/></div>';
                }
            }

            $('#popResult .part-a').eq(0).html('').append(ahtm);
            $('#popResult .part-b').eq(0).html('').append(bhtm);

            $('#popResult .bt').eq(0).on('click touchstart',function(){
                location.replace(REF.referer)
            });
            gfPop($('#popResult'));
        }
    } catch (er) { }
}

///////////////////////////////////////////////////////////////////////////////
//set timerlogout)
function setTimer() {
    try {
        clearTimeout(objTmr);
        crQzTime = crTimeLimit;
        ingTimer();
    } catch (e) {
        alert("setTimer : " + e.message);
    }
}

function ingTimer() {
    try {
        crQzTime--;
        var percent = 100 - Math.round(crQzTime / crTimeLimit * 100);
        $('div.timer').html('<div id="slice"' + (percent > 50 ? ' class="gt50"' : '') + '><div class="pie"></div>' + (percent > 50 ? '<div class="pie fill"></div>' : '') + '</div><div class="tx">' + crQzTime + '</div>');
        var deg = 360 / 100 * percent;
        $('#slice .pie').css({
            '-moz-transform': 'rotate(' + deg + 'deg)',
            '-webkit-transform': 'rotate(' + deg + 'deg)',
            '-o-transform': 'rotate(' + deg + 'deg)',
            'transform': 'rotate(' + deg + 'deg)'
        });

        if (crQzTime == 0) {
            isPageWorking = true;
            crUsrAnwr = "";

            // 답을 선택했으면 선택 값으로 저장 추가 시작 - 2021-01-11 박현기
            var idx = -1;
            $('#elAnswer td>div').each(function () {
                if ($(this).hasClass('chk')) {
                    idx = $('#elAnswer td>div').index($(this));

                    return false;
                }
            });
            if (idx > -1) {
                crUsrAnwr = bagAnwr[idx].Example;
            }
            crAnwrCnt++;
            // 답을 선택했으면 선택 값으로 저장 추가 끝

            savRecord();
        } else objTmr = setTimeout("ingTimer()", 1000);
    } catch (e) {
        alert("setTimer : " + e.message);
    }
}

function doBackgroundProcess() {
    setTimout(function () { doBackgroundProcess(); }, 100);
}
