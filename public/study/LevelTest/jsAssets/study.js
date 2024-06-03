var gvStudyId = "";
var gvStudentId = "";
var gvStudentHistoryId = "";
var gvUrl = "";
var gvUserType = "";
var gvFirstStep = "";
var gvCustId = "";
var gvCustType = "";
var gvStudyInfo;
var gvMode = 1;
var gvSchoolUserYn = 'N';
var gvPrivateUserYn = 'N';
var gvCustLang = "";
var isStudyCompleted = false;
var gvBookInfo;
var gvLevelRoundId = 0;
var gvClassId = "";
let studySessionId = "";
let duplicateInterval = "";

var gvCrStep = "";
var gvLanguage = "KOR"

function getStudyInfo() {
    //try {
    //    jsonStr = decodeURIComponent(sslStudyInfo);

    //    if (jsonStr == "") {
    //        alert("ERROR");
    //    } else {
    //        var obj = $.parseJSON(jsonStr);

    //        if (obj != null && typeof obj == 'object') {
    //            gvStudyId = obj.study_id;
    //            gvStudentHistoryId = obj.student_history_id;
    //            gvUrl = obj.url;
    //            gvUserType = obj.user_type;
    //            gvFirstStep = obj.first_step + "";
    //            gvCustId = obj.cust_id;
    //            gvCustType = obj.cust_type;
    //            gvCustLang = obj.cust_lang;

    //            gvMode = (gvUserType.toLowerCase() == "staff") ? 3 : (gvUserType.toLowerCase() == "guest") ? 4 : 1;
    //            gvSchoolUserYn = $.inArray(gvCustType, ['002001', '002002', '002003']) > -1 ? 'Y' : 'N';
    //            gvPrivateUserYn = $.inArray(gvCustType, ['002008']) > -1 ? 'Y' : 'N';

    //            //if (obj.cust_lang == "ko-KR") { gvLanguage = "KOR"; }
    //            //if (obj.cust_lang == "zh-CN") { gvLanguage = "CHN"; }
    //            //if (obj.cust_lang == "jp-JP") { gvLanguage = "JPN"; }
    //            //if (obj.cust_lang == "vi-VN") { gvLanguage = "VTN"; }
    //            //if (obj.cust_lang == "id-ID") { gvLanguage = "INE"; }
    //            //if (obj.cust_lang == "en-US") { gvLanguage = "ENG"; }

    //            //gvSchoolUserYn = 'Y';

    //            // Test Mode  1:student(study) 2:student(completed) 3:teacher
    //            //gvMode = 3;
    //        }
    //    }
    //} catch (er) {
    //    alert(getLanguage("이전 고객사에서 완료한 학습입니다. 새로 과제를 추가하시거나 본사(1599-0533)로 연락주시기 바랍니다."));
    //}
}

function popLevelUp(lv) {
    $("#popLevelUp .lv").eq(0).html(lv);
    $("#popLevelUp .bt button").on('click touchstart', function () {

    });
    $('#audioLevelUp')[0].play();
    gfPop($("#popLevelUp"));
}

function doPrintLevelUp(pStudentId) {
    //http://rgreport.readinggate.com/LevelUpCertificateLibrary.aspx?args1=000172C2018000235&args2=000172&args3=20180401&args4=20180401&args5=Y
    //args1 : StudentId
    //args2 : CustomerId
    //args3 : StartDate
    //args4 : EndDate
    //args5 : 사이트에서 출력 여부(Y)

    var d = new Date();
    var yy = d.getYear();
    var mm = d.getMonth() + 1; // getMonth() is zero-based
    var dd = d.getDate();
    var strDate = [d.getFullYear(), (mm > 9 ? '' : '0') + mm, (dd > 9 ? '' : '0') + dd].join('');

    var w = window.open("http://ozreport.a1edu.com/OZ/LevelUpCertificate.aspx?args1=" + pStudentId + "&args2=" + gvCustId + "&args3=" + strDate + "&args4=" + strDate + "&args5=true&args6=Y", "POP_REPORT", "width=1000,height=700,top=50,left=100,directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no");
}

function doPrintReport() {
    var w = window.open("http://ozreport.a1edu.com/OZ/ReadingAssessmentNew.aspx?args1=" + gvStudyId + "&args2=" + gvStudentHistoryId + "&args3=" + gvCustId, "POP_REPORT", "width=800,height=600,top=0,left=0");
    if (w != null) {
        w.focus();
    }

}

// Get Value By Code
function getStepByCode(cd) {
    try {
        var ret = "";

        if (cd == "025001") ret = "W";
        else if (cd == "025002") ret = "1";
        else if (cd == "025003") ret = "2";
        else if (cd == "025004") ret = "3";
        else if (cd == "025005") ret = "4";
        else if (cd == "025006") ret = "5";
        else if (cd == "025007") ret = "6";
        else if (cd == "025008") ret = "E";

        return ret;
    } catch (er) {
        alert("getStepByCode Error : " + er);
    }
}

function getSkinByCode(cd) {
    try {
        var ret = "";

        if (cd == "039001") ret = "PBL";
        else if (cd == "039002") ret = "PBH";
        else if (cd == "039004") ret = "EBK";
        else if (cd == "039005") ret = "EB1";
        else if (cd == "039006") ret = "EB2";
        else if (cd == "") ret = "LC";

        return ret;
    } catch (er) {
        alert("getSkinByCode Error : " + er);
    }
}

function getGenreByCode(cd) {
    try {
        var ret = "";

        if (cd == "015010") ret = "NF";
        else ret = "ETC";

        return ret;
    } catch (er) {
        alert("getSkinByCode Error : " + er);
    }
}

function getRewriteReasonByCode(cd) {
    var ret = "";

    if (cd == '077001') {
        ret = '내용 이해 불가';

        if (gvStudyInfo.PopupGuide == 1) ret = '글의 내용을 이해할 수 없어 첨삭지도가 어렵습니다.';
        else ret = 'Your writing is not clear for proofreading.';
    } else if (cd == '077002') {
        ret = '한글로 작성';

        if (gvStudyInfo.PopupGuide == 1) ret = '한글로 작성한 부분이 있습니다.';
        else ret = 'There are parts that are written in Korean.';
    } else if (cd == '077003') {
        ret = '이해할 수 없는 기호나 공백 사용';

        if (gvStudyInfo.PopupGuide == 1) ret = '이해할 수 없는 기호나 공백이 있어 첨삭 지도가 어렵습니다.';
        else ret = 'There are incomprehensible marks or blanks.';
    } else if (cd == '077004') {
        ret = '주제와 내용이 불일치';

        if (gvStudyInfo.PopupGuide == 1) ret = '주어진 주제와 작성한 내용이 서로 일치하지 않습니다.';
        else ret = 'Your writing is not relevant to the given topic.';
    } else if (cd == '077005') {
        ret = '샘플/학습내용 복사';

        if (gvStudyInfo.PopupGuide == 1) ret = '샘플 문장이나 학습 내용을 그대로 복사하여 제출하였습니다.';
        else ret = 'Some parts are copied from sample sentences or the story.';
    } else if (cd == '077006') {
        ret = '기타';

        if (gvStudyInfo.PopupGuide == 1) ret = '첨삭 지도를 하기에 부적절한 기타 요소들이 있습니다.';
        else ret = 'There are irrelevant contents in your writing.';
    }

    return ret;
}

function chkStudyEnding() {
    if (gvMode == 1) {
        var end = 0;

        if (gvStudyInfo.Step1OpenYn == 'Y') end = 1;
        if (gvStudyInfo.Step2OpenYn == 'Y') end = 2;
        if (gvStudyInfo.Step3OpenYn == 'Y') end = 3;
        if (gvStudyInfo.Step4OpenYn == 'Y') end = 4;
        if (gvStudyInfo.Step5OpenYn == 'Y') end = 5;
        if (gvStudyInfo.Step6OpenYn == 'Y') end = 6;

        var stp = getStepByCode(gvStudyInfo.StatusCode).toUpperCase();

        if (stp == "W" || stp == "E") {
            return false;
        } else {
            if (parseInt(stp) >= end) {
                doStudyEnding(); //각 학습 common.js에 위치

                return true;
            } else {
                return false;
            }
        }
    } else {
        return false;
    }
}
