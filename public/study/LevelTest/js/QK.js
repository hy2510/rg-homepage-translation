var crStep="K";
var gvStudyInfo=new Array();
var bagQz = new Array();
var bagRc = new Array();
var bagAnwr=new Array();

var crQzMax=0;
var crQzSeq=0;
var crAud="";
var crCorAnwr="";
var crUsrAnwr="";
var crAnwrCnt=0;
var crAnwrMax=1;
var isStepFinished=false;
var nxDetailId="";
var nxLevel="";
var crQzSet="";

var objTmr;
var crQzTime = 0;
var crTimeLimit = 20+1;

var crPrevKindCode =0;
var crKindSoundPath = "";
var isPlayKindSoundPath = true;

var SoundPathStart = new Array();
SoundPathStart.push("https://wcfresource.a1edu.com/NewSystem/sound/LevelTest/Direction/ATPOP.mp3");
SoundPathStart.push("https://wcfresource.a1edu.com/NewSystem/sound/LevelTest/Direction/PTPOP.mp3");
SoundPathStart.push("https://wcfresource.a1edu.com/NewSystem/sound/LevelTest/Direction/WTPOP.mp3");

var SoundPathTestKind = new Array();
SoundPathTestKind.push({"kind1":"https://wcfresource.a1edu.com/NewSystem/sound/LevelTest/Direction/ATD1.mp3","kind2":"https://wcfresource.a1edu.com/NewSystem/sound/LevelTest/Direction/ATD2.mp3","kind3":"https://wcfresource.a1edu.com/NewSystem/sound/LevelTest/Direction/ATD3.mp3"});
SoundPathTestKind.push({"kind1":"https://wcfresource.a1edu.com/NewSystem/sound/LevelTest/Direction/PTD1.mp3","kind2":"https://wcfresource.a1edu.com/NewSystem/sound/LevelTest/Direction/PTD2.mp3","kind3":"https://wcfresource.a1edu.com/NewSystem/sound/LevelTest/Direction/PTD3.mp3"});
SoundPathTestKind.push({"kind1":"https://wcfresource.a1edu.com/NewSystem/sound/LevelTest/Direction/WTD1.mp3","kind2":"https://wcfresource.a1edu.com/NewSystem/sound/LevelTest/Direction/WTD2.mp3","kind3":"https://wcfresource.a1edu.com/NewSystem/sound/LevelTest/Direction/WTD3.mp3"});

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
            retstr = sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }

    return retstr;
};

function doStart() {
	try{
        setupRef()
        gvMode=1;
        isStepFinished=false;
        crQzSeq=0;
		getStudyInfoNew();

        crKindSoundPath = "";
        crPrevKindCode =0;
        isPlayKindSoundPath=true;
	} catch (er) {
        //
	}
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

function getStudyInfoOnSucc(p1, p2, p3){
    if (p1!=""){
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

            if (gvStudyInfo.Level == null || gvStudyInfo.Level == '') {
                location.replace('QZ.aspx');
            }else{
                if (gvStudyInfo.Level == crStep) {
                    getQuiz();
                } else {
                    location.replace('Q'+gvStudyInfo.Level+'.aspx');
                }
            }
        }
    }
}

function getStudyInfoOnFail(p1, p2){
    alert('학습정보를 가져오는데 실패했습니다');

    return;
}

function getQuiz(){

}

function getQuizOnSucc(p1, p2, p3){
    try{
        if(p1!=""){
            var ar = $.parseJSON(p1);
            if(ar.length==0){
                alert ("테스트 문제를 가져오는데 실패했습니다.");

                return;
            }else{
                bagQz=ar;
            }
        }

        for(var i=0;i<bagQz.length;i++){
            if(bagQz[i].OX==null) {
                crQzSeq=i;
                break;
            }else{
                bagRc.push({'QuizId':bagQz[i].QuizId,'OX':bagQz[i].OX});
            }
        }
        
        crQzMax=bagQz.length;
        crQzSet=bagQz[0].QuizSet;
        
        $('#popStart .title').prop('class','title qzset'+crQzSet);
        $('#popStart .bt').eq(0).on('click touchstart',function(){
            gfPopClose($('#popStart'));
            setTimeout(function(){
                setQuiz();
            },500);
        });
        
        $('#btNext').on('click touchstart',function(){
            if(isPageWorking)return false;
        });
        $('#btAudio').on('click touchstart',function(){
            gfPlayAudio(0,crAud);
        });
        
        gfPlayAudio(0, SoundPathStart[crQzSet-1]);

        gfPop($('#popStart'));
    } catch(er) {
        alert(er.message);
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
        if(qzLevel !== 'K'){
            gvStudyInfo.Level = qzLevel
            sessionStorage.setItem("apiStudyInfo", JSON.stringify(gvStudyInfo));
            location.replace(`Q1.html`)
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
        crQzSet = bagQz[0].QuizSet;

        $('#popStart .title').prop('class', 'title qzset' + crQzSet);
        $('#popStart .bt').eq(0).on('click touchstart', function () {
            gfPopClose($('#popStart'));
            setTimeout(function () {
                setQuiz();
            }, 500);
        });

        $('#btNext').on('click touchstart', function () {
            if (isPageWorking) return false;
        });
        $('#btAudio').on('click touchstart', function () {
            gfPlayAudio(0, crAud);
        });

        gfPlayAudio(0, SoundPathStart[crQzSet - 1]);

        gfPop($('#popStart'));
    }).catch(error => {
        alert(error.message);
    })
}

function getQuizOnFail(p1, p2){
    alert("[ERROR] 문제를 가져오는데 실패했습니다.");
}

function setQuiz() {
	try{
        gfStopAudio();

        isPageWorking=true;
        $('#elNum').html(crQzSeq+1);
        $('#elAnswer').html('');
        $('#elPicture').html('');
        $('#elQuestion').html('');

        var j=bagQz[crQzSeq];
        crAud = j.QuestionSoundPath;
        crCorAnwr=j.CorrectText;
        
        if (j.QuizType == "A") {
            $('#QuizType .type_a').eq(0).css('display', 'block');
            $('#QuizType .type_b').eq(0).css('display', 'none');
        } else {
            $('#QuizType .type_a').eq(0).css('display', 'none');
            $('#QuizType .type_b').eq(0).css('display', 'block');
        }
        
        //스타일 
        if(j.QuizSet=="1"){
            if(j.QuizKindCode==1) {
                $('#boxMain').prop('class','qzset1-1');
            } else if (j.QuizKindCode == 2) {
                $('#boxMain').prop('class','qzset1-2');            
            }else if(j.QuizKindCode==3){
                $('#boxMain').prop('class','qzset1-3');
            }
        }else if(j.QuizSet=="2"){
            if(j.QuizKindCode==1) {
                $('#boxMain').prop('class','qzset2-1')
            }else if(j.QuizKindCode==2) {
                $('#boxMain').prop('class','qzset2-2')
            }else if(j.QuizKindCode==3) {
                $('#boxMain').prop('class','qzset2-3')
            }
        }else if(j.QuizSet=="3"){
            if(j.QuizKindCode==1) {
                $('#boxMain').prop('class','qzset3-1')
            }else if(j.QuizKindCode==2) {
                $('#boxMain').prop('class','qzset3-2')
            }else if(j.QuizKindCode==3) {
                $('#boxMain').prop('class','qzset3-3')
            }
        }

        //지시음원
        if ( isPlayKindSoundPath ) {
            crKindSoundPath = "";

            if(crPrevKindCode!=j.QuizKindCode) {
                crPrevKindCode = j.QuizKindCode;
                if ( j.QuizKindCode==1 ) {
                    crKindSoundPath = SoundPathTestKind[j.QuizSet-1].kind1;
                } else if (j.QuizKindCode==2) {
                    crKindSoundPath = SoundPathTestKind[j.QuizSet-1].kind2;
                } else if ( j.QuizKindCode==3) {
                    crKindSoundPath = SoundPathTestKind[j.QuizSet-1].kind3;
                } else {
                    crKindSoundPath = "";
                }
            }
            
            if ( crKindSoundPath!="" ) {
                gfPlayAudio(0, crKindSoundPath);
                setTimeout(function(){
                    gfDoLater('setQuiz()');
                    isPlayKindSoundPath=false;
                },500);
                return;
            }
        } else {
            isPlayKindSoundPath=true;
        }

        //문제출제
        if(j.QuizSet=="1"){
            if(j.QuizKindCode==1) {

                $('#boxMain').prop('class','qzset1-1');
                bagAnwr=new Array();
                if(j.Example1!=null&&j.Example1!='')bagAnwr.push({'Example':j.Example1});
                if(j.Example2!=null&&j.Example2!='')bagAnwr.push({'Example':j.Example2});
                if(j.Example3!=null&&j.Example3!='')bagAnwr.push({'Example':j.Example3});
                if(j.Example4!=null&&j.Example4!='')bagAnwr.push({'Example':j.Example4});
                if(j.Example5!=null&&j.Example5!='')bagAnwr.push({'Example':j.Example5});
                bagAnwr=shuffle(bagAnwr);
                if(gvMode==3||isTestMode==1) for(var i=0;i<bagAnwr.length;i++) if(bagAnwr[i].Example==crCorAnwr){var tmp=bagAnwr[i];bagAnwr[i]=bagAnwr[0];bagAnwr[0]=tmp;}

                var anwr='<table><tbody><tr>';
                for(var i=0;i<bagAnwr.length;i++){
                    var n = i + 1;
                    anwr += '<th><div class="no"><img src="img/k/gi_check.png" class="chk"/><img src="img/k/num_a_' + n + '_off.png" class="off"/><img src="img/k/num_a_' + n + '_on.png" class="on"/></div></th><td><p>' + bagAnwr[i].Example + '</p></td>';
                }
                anwr+='</tr></tbody></table>';
                $('#elAnswer').html(anwr);
                
                $('#elAnswer .no').on('click touchstart',function(){
                    if(isPageWorking)return false;
                    var idx=$('#elAnswer .no').index($(this));
                    chkAnswer(idx);
                });
                $('#elAnswer td').on('click touchstart',function(){
                    if(isPageWorking)return false;
                    var idx=$('#elAnswer td').index($(this));
                    chkAnswer(idx);
                });

                gfPlayAudio(1, crAud);
                setTimeout(function () { isPageWorking = false }, 500);

            } else if (j.QuizKindCode == 2) {
                $('#boxMain').prop('class','qzset1-2');            
                $('#elQuestion').html(j.Question);

                bagAnwr=new Array();
                if(j.Example1!=null&&j.Example1!='')bagAnwr.push({'Example':j.Example1});
                if(j.Example2!=null&&j.Example2!='')bagAnwr.push({'Example':j.Example2});
                if(j.Example3!=null&&j.Example3!='')bagAnwr.push({'Example':j.Example3});
                if(j.Example4!=null&&j.Example4!='')bagAnwr.push({'Example':j.Example4});
                if(j.Example5!=null&&j.Example5!='')bagAnwr.push({'Example':j.Example5});
                bagAnwr=shuffle(bagAnwr);
                if(gvMode==3||isTestMode==1) for(var i=0;i<bagAnwr.length;i++) if(bagAnwr[i].Example==crCorAnwr){var tmp=bagAnwr[i];bagAnwr[i]=bagAnwr[0];bagAnwr[0]=tmp;}

                var anwr='<table><tbody><tr>';
                for(var i=0;i<bagAnwr.length;i++){
                    var n = i + 1;
                    anwr += '<th><div class="no"><img src="img/k/gi_check.png" class="chk"/><img src="img/k/num_a_' + n + '_off.png" class="off"/><img src="img/k/num_a_' + n + '_on.png" class="on"/></div></th>';
                    c = getCharClass(bagAnwr[i].Example);
                    anwr += '<td><p' + (c != '' ? ' class="' + c+'"' : '') + '>' + bagAnwr[i].Example + '</p></td>';
                }
                anwr+='</tr></tbody></table>';
                $('#elAnswer').html(anwr);
                
                $('#elAnswer .no').on('click touchstart',function(){
                    if(isPageWorking)return false;
                    var idx=$('#elAnswer .no').index($(this));
                    chkAnswer(idx);
                });
                $('#elAnswer td').on('click touchstart',function(){
                    if(isPageWorking)return false;
                    var idx=$('#elAnswer td').index($(this));
                    chkAnswer(idx);
                });

                gfPlayAudio(1, crAud);
                setTimeout(function () { isPageWorking = false }, 500);
            } else if(j.QuizKindCode == 3) {
                $('#boxMain').prop('class','qzset1-3');

                bagAnwr = new Array();
                if(j.Example1 != null && j.Example1 != '')bagAnwr.push({'Example':j.Example1,'ImagePath':j.ExampleImagePath1});
                if(j.Example2 != null && j.Example2 != '')bagAnwr.push({'Example':j.Example2,'ImagePath':j.ExampleImagePath2});
                if(j.Example3 != null && j.Example3 != '')bagAnwr.push({'Example':j.Example3,'ImagePath':j.ExampleImagePath3});
                if(j.Example4 != null && j.Example4 != '')bagAnwr.push({'Example':j.Example4,'ImagePath':j.ExampleImagePath4});
                if(j.Example5 != null && j.Example5 != '')bagAnwr.push({'Example':j.Example5,'ImagePath':j.ExampleImagePath5});
                bagAnwr = shuffle(bagAnwr);
                if(gvMode == 3 || isTestMode == 1) for(var i=0;i<bagAnwr.length;i++) if(bagAnwr[i].Example==crCorAnwr){var tmp=bagAnwr[i];bagAnwr[i]=bagAnwr[0];bagAnwr[0]=tmp;}

                var anwr='<table><tbody><tr>';
                for(var i=0;i<bagAnwr.length;i++){
                    var n = i + 1;
                    anwr += '<th><div class="no"><img src="img/k/gi_check.png" class="chk"/><img src="img/k/num_a_' + n + '_off.png" class="off"/><img src="img/k/num_a_' + n + '_on.png" class="on"/></div></th>';
                    anwr+='<td><img src="'+bagAnwr[i].ImagePath+'"/></td>';
                }
                anwr+='</tr></tbody></table>';
                $('#elAnswer').html(anwr);
                
                $('#elAnswer .no').on('click touchstart',function(){
                    var idx=$('#elAnswer .no').index($(this));
                    chkAnswer(idx);
                });
                $('#elAnswer td').on('click touchstart',function(){
                    var idx=$('#elAnswer td').index($(this));
                    chkAnswer(idx);
                });
                
                gfPlayAudio(1, crAud);
                setTimeout(function () { isPageWorking = false }, 500);
            }
        } else if(j.QuizSet == "2") {
            if(j.QuizKindCode==1) {
                $('#boxMain').prop('class','qzset2-1')
                crCorAnwr=j.CorrectText;
                var qtmp=crCorAnwr.replace(/-/gi,'')
                var qstr="";
                for(var i=0;i<qtmp.length;i++){
                    qstr+='<input disabled=true/>';
                }
                $('#elQuestion').html('<div class="pic"><img src="' + j.QuestionImagePath + '"/></div><div class="word"><div>'+j.Question.replace(/\[(\w*)\]/gi,qstr)+'</div></div>');

                bagAnwr=new Array();
                if(j.Example1!=null&&j.Example1!='')bagAnwr.push({'Example':j.Example1,'ImagePath':j.ExampleImagePath1});
                if(j.Example2!=null&&j.Example2!='')bagAnwr.push({'Example':j.Example2,'ImagePath':j.ExampleImagePath2});
                if(j.Example3!=null&&j.Example3!='')bagAnwr.push({'Example':j.Example3,'ImagePath':j.ExampleImagePath3});
                if(j.Example4!=null&&j.Example4!='')bagAnwr.push({'Example':j.Example4,'ImagePath':j.ExampleImagePath4});
                if(j.Example5!=null&&j.Example5!='')bagAnwr.push({'Example':j.Example5,'ImagePath':j.ExampleImagePath5});
                bagAnwr=shuffle(bagAnwr);
                if(gvMode==3||isTestMode==1) for(var i=0;i<bagAnwr.length;i++) if(bagAnwr[i].Example==crCorAnwr){var tmp=bagAnwr[i];bagAnwr[i]=bagAnwr[0];bagAnwr[0]=tmp;}

                var anwr='<table><tbody>';
                for(var i=0;i<bagAnwr.length;i++){
                    var n = i + 1;
                    anwr+='<tr>';
                    anwr+='<th><div class="no"><img src="img/k/gi_check.png" class="chk"/><img src="img/k/num_a_' + n + '_off.png" class="off"/><img src="img/k/num_a_' + n + '_on.png" class="on"/></div></th>';
                    anwr+='<td><p>'+bagAnwr[i].Example+'</p></td>';
                    anwr+='</tr>';
                }
                anwr+='</tbody></table>';
                $('#elAnswer').html(anwr);

                $('#elAnswer .no').on('click touchstart',function(){
                    if(isPageWorking)return false;
                    var idx=$('#elAnswer .no').index($(this));
                    chkAnswer(idx);
                });
                $('#elAnswer td').on('click touchstart',function(){
                    if(isPageWorking)return false;
                    var idx=$('#elAnswer td').index($(this));
                    chkAnswer(idx);
                });

                isPageWorking=false;

            }else if(j.QuizKindCode==2) {
                $('#boxMain').prop('class','qzset2-2')

                bagAnwr=new Array();
                if(j.Example1!=null&&j.Example1!='')bagAnwr.push({'Example':j.Example1});
                if(j.Example2!=null&&j.Example2!='')bagAnwr.push({'Example':j.Example2});
                if(j.Example3!=null&&j.Example3!='')bagAnwr.push({'Example':j.Example3});
                if(j.Example4!=null&&j.Example4!='')bagAnwr.push({'Example':j.Example4});
                if(j.Example5!=null&&j.Example5!='')bagAnwr.push({'Example':j.Example5});
                bagAnwr=shuffle(bagAnwr);
                if(gvMode==3||isTestMode==1) for(var i=0;i<bagAnwr.length;i++) if(bagAnwr[i].Example==crCorAnwr){var tmp=bagAnwr[i];bagAnwr[i]=bagAnwr[0];bagAnwr[0]=tmp;}

                var anwr='<table><tbody><tr>';
                for(var i=0;i<bagAnwr.length;i++){
                    var n = i + 1;
                    anwr += '<th><div class="no"><img src="img/k/gi_check.png" class="chk"/><img src="img/k/num_a_' + n + '_off.png" class="off"/><img src="img/k/num_a_' + n + '_on.png" class="on"/></div></th><td><p>' + bagAnwr[i].Example + '</p></td>';
                }
                anwr+='</tr></tbody></table>';
                $('#elAnswer').html(anwr);
                
                $('#elAnswer .no').on('click touchstart',function(){
                    if(isPageWorking)return false;
                    var idx=$('#elAnswer .no').index($(this));
                    chkAnswer(idx);
                });
                $('#elAnswer td').on('click touchstart',function(){
                    if(isPageWorking)return false;
                    var idx=$('#elAnswer td').index($(this));
                    chkAnswer(idx);
                });

                gfPlayAudio(1, crAud);
                setTimeout(function () { isPageWorking = false }, 500);

            }else if(j.QuizKindCode==3) {
                $('#boxMain').prop('class','qzset2-3')

                //$('#elQuestion').html(j.Question.replace(/\[(\w*)\]/gi,'<a>$1</a>'));
                $('#elQuestion').html(j.Question.replace(/\[(\w*)\]/gi, '<a>$1</a>'));

                bagAnwr=new Array();
                if(j.Example1!=null&&j.Example1!='')bagAnwr.push({'Example':j.Example1,'ImagePath':j.ExampleImagePath1});
                if (j.Example2 != null && j.Example2 != '') bagAnwr.push({ 'Example': j.Example2, 'ImagePath': j.ExampleImagePath2 });
                if (j.Example3 != null && j.Example3 != '') bagAnwr.push({ 'Example': j.Example3, 'ImagePath': j.ExampleImagePath3 });
                if (j.Example4 != null && j.Example4 != '') bagAnwr.push({ 'Example': j.Example4, 'ImagePath': j.ExampleImagePath4 });
                if (j.Example5 != null && j.Example5 != '') bagAnwr.push({ 'Example': j.Example5, 'ImagePath': j.ExampleImagePath5 });
                bagAnwr=shuffle(bagAnwr);
                if(gvMode==3||isTestMode==1) for(var i=0;i<bagAnwr.length;i++) if(bagAnwr[i].Example==crCorAnwr){var tmp=bagAnwr[i];bagAnwr[i]=bagAnwr[0];bagAnwr[0]=tmp;}

                var anwr='<table><tbody><tr>';
                for(var i=0;i<bagAnwr.length;i++){
                    var n = i + 1;
                    anwr += '<th><div class="no"><img src="img/k/gi_check.png" class="chk"/><img src="img/k/num_a_' + n + '_off.png" class="off"/><img src="img/k/num_a_' + n + '_on.png" class="on"/></div></th>';
                    anwr+='<td><p><img src="'+bagAnwr[i].ImagePath+'"/></p></td>';
                }
                anwr+='</tr></tbody></table>';
                $('#elAnswer').html(anwr);
                
                $('#elAnswer .no').on('click touchstart',function(){
                    if(isPageWorking)return false;
                    var idx=$('#elAnswer .no').index($(this));
                    chkAnswer(idx);
                });
                $('#elAnswer td').on('click touchstart',function(){
                    if(isPageWorking)return false;
                    var idx=$('#elAnswer td').index($(this));
                    chkAnswer(idx);
                });

                gfPlayAudio(1,crAud);
                setTimeout(function () { isPageWorking = false },500);

            }
        }else if(j.QuizSet=="3"){
            if(j.QuizKindCode==1) {
                $('#boxMain').prop('class','qzset3-1')
                crCorAnwr = j.CorrectText;

                $('#elQuestion').html('<img src="'+j.QuestionImagePath+'"/>');

                bagAnwr=new Array();
                if(j.Example1!=null&&j.Example1!='')bagAnwr.push({'Example':j.Example1,'ImagePath':j.ExampleImagePath1});
                if(j.Example2!=null&&j.Example2!='')bagAnwr.push({'Example':j.Example2,'ImagePath':j.ExampleImagePath2});
                if(j.Example3!=null&&j.Example3!='')bagAnwr.push({'Example':j.Example3,'ImagePath':j.ExampleImagePath3});
                if(j.Example4!=null&&j.Example4!='')bagAnwr.push({'Example':j.Example4,'ImagePath':j.ExampleImagePath4});
                if(j.Example5!=null&&j.Example5!='')bagAnwr.push({'Example':j.Example5,'ImagePath':j.ExampleImagePath5});
                bagAnwr=shuffle(bagAnwr);
                if(gvMode==3||isTestMode==1) for(var i=0;i<bagAnwr.length;i++) if(bagAnwr[i].Example==crCorAnwr){var tmp=bagAnwr[i];bagAnwr[i]=bagAnwr[0];bagAnwr[0]=tmp;}

                var anwr='<table><tbody>';
                for(var i=0;i<bagAnwr.length;i++){
                    var n = i + 1;
                    anwr+='<tr>';
                    anwr += '<th><div class="no"><img src="img/k/gi_check.png" class="chk"/><img src="img/k/num_a_' + n + '_off.png" class="off"/><img src="img/k/num_a_' + n + '_on.png" class="on"/></div></th>';
                    anwr+='<td><p>'+bagAnwr[i].Example+'</p></td>';
                    anwr+='</tr>';
                }
                anwr+='</tbody></table>';
                $('#elAnswer').html(anwr);

                $('#elAnswer .no').on('click touchstart',function(){
                    if(isPageWorking)return false;
                    var idx=$('#elAnswer .no').index($(this));
                    chkAnswer(idx);
                });
                $('#elAnswer td').on('click touchstart',function(){
                    if(isPageWorking)return false;
                    var idx=$('#elAnswer td').index($(this));
                    chkAnswer(idx);
                });

                isPageWorking=false;

            }else if(j.QuizKindCode==2) {
                $('#boxMain').prop('class','qzset3-2')

                bagAnwr=new Array();
                if(j.Example1!=null&&j.Example1!='')bagAnwr.push({'Example':j.Example1,'ImagePath':j.ExampleImagePath1});
                if(j.Example2!=null&&j.Example2!='')bagAnwr.push({'Example':j.Example2,'ImagePath':j.ExampleImagePath2});
                if(j.Example3!=null&&j.Example3!='')bagAnwr.push({'Example':j.Example3,'ImagePath':j.ExampleImagePath3});
                if(j.Example4!=null&&j.Example4!='')bagAnwr.push({'Example':j.Example4,'ImagePath':j.ExampleImagePath4});
                if(j.Example5!=null&&j.Example5!='')bagAnwr.push({'Example':j.Example5,'ImagePath':j.ExampleImagePath5});
                bagAnwr=shuffle(bagAnwr);
                if(gvMode==3||isTestMode==1) for(var i=0;i<bagAnwr.length;i++) if(bagAnwr[i].Example==crCorAnwr){var tmp=bagAnwr[i];bagAnwr[i]=bagAnwr[0];bagAnwr[0]=tmp;}

                var anwr='<table><tbody><tr>';
                for(var i=0;i<bagAnwr.length;i++){
                    var n = i + 1;
                    anwr += '<th><div class="no"><img src="img/k/gi_check.png" class="chk"/><img src="img/k/num_a_' + n + '_off.png" class="off"/><img src="img/k/num_a_' + n + '_on.png" class="on"/></div></th>';
                    anwr+='<td><img src="'+bagAnwr[i].ImagePath+'"/></td>';
                }
                anwr+='</tr></tbody></table>';
                $('#elAnswer').html(anwr);
                
                $('#elAnswer .no').on('click touchstart',function(){
                    if(isPageWorking)return false;
                    var idx=$('#elAnswer .no').index($(this));
                    chkAnswer(idx);
                });
                $('#elAnswer td').on('click touchstart',function(){
                    if(isPageWorking)return false;
                    var idx=$('#elAnswer td').index($(this));
                    chkAnswer(idx);
                });

                gfPlayAudio(1, crAud);
                setTimeout(function () { isPageWorking = false }, 500);

            }else if(j.QuizKindCode==3) {
                $('#boxMain').prop('class','qzset3-3')
                crCorAnwr=j.CorrectText;
                $('#elQuestion').html(j.Question.replace(/\[(\w*)\]/gi,'<input disabled=true/>'));
                $('#elPicture').html('<img src="' + j.QuestionImagePath + '"/>');

                bagAnwr=new Array();
                if(j.Example1!=null&&j.Example1!='')bagAnwr.push({'Example':j.Example1,'ImagePath':j.ExampleImagePath1});
                if(j.Example2!=null&&j.Example2!='')bagAnwr.push({'Example':j.Example2,'ImagePath':j.ExampleImagePath2});
                if(j.Example3!=null&&j.Example3!='')bagAnwr.push({'Example':j.Example3,'ImagePath':j.ExampleImagePath3});
                if(j.Example4!=null&&j.Example4!='')bagAnwr.push({'Example':j.Example4,'ImagePath':j.ExampleImagePath4});
                if(j.Example5!=null&&j.Example5!='')bagAnwr.push({'Example':j.Example5,'ImagePath':j.ExampleImagePath5});
                bagAnwr=shuffle(bagAnwr);
                if(gvMode==3||isTestMode==1) for(var i=0;i<bagAnwr.length;i++) if(bagAnwr[i].Example==crCorAnwr){var tmp=bagAnwr[i];bagAnwr[i]=bagAnwr[0];bagAnwr[0]=tmp;}

                var anwr='<table><tbody>';
                for(var i=0;i<bagAnwr.length;i++){
                    var n = i + 1;
                    anwr+='<tr>';
                    anwr += '<th><div class="no"><img src="img/k/gi_check.png" class="chk"/><img src="img/k/num_a_' + n + '_off.png" class="off"/><img src="img/k/num_a_' + n + '_on.png" class="on"/></div></th>';
                    anwr+='<td><p>'+bagAnwr[i].Example+'</p></td>';
                    anwr+='</tr>';
                }
                anwr+='</tbody></table>';
                $('#elAnswer').html(anwr);

                $('#elAnswer .no').on('click touchstart',function(){
                    if(isPageWorking)return false;
                    var idx=$('#elAnswer .no').index($(this));
                    chkAnswer(idx);
                });
                $('#elAnswer td').on('click touchstart',function(){
                    if(isPageWorking)return false;
                    var idx=$('#elAnswer td').index($(this));
                    chkAnswer(idx);
                });
                
                isPageWorking=false;
            }
        }

        setTimer();
    }
    catch (er) { }
}

function chkAnswer(idx) {
    if (isPageWorking) return false;
    isPageWorking=true;
    $('#elAnswer .no').each(function(){
        if($(this).hasClass('chk')) $(this).removeClass('chk');
    });
    $('#elAnswer .no').eq(idx).addClass('chk');
    crAnwrCnt++;
    crUsrAnwr=bagAnwr[idx].Example;
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

function savRecordOnSucc(p1,p2,p3) {
    if(p1 == "") {
        alert ("savRecordOnSucc ERROR");
        return false;
    }

    var obj = $.parseJSON(p1);
    if(obj.length > 0) {
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

function savRecordOnFail(){

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

function getRecordOnSucc(p1,p2,p3){
    if(p1!=""){
        var ar = $.parseJSON(p1);
        if(ar.length==0){
            alert ("테스트 결과를 가져오는데 실패했습니다.");

            return;
        }else{
            bagRc=ar;
            setResult();
        }
    }   
}

function getRecordOnFail(p1,p2){

}

function goNext(){
	try{	
        if(isStepFinished){
            if(!nxDetailId){
                getTestResultRecord();
            }else{
                gvStudyInfo.LevelTestDetailId = nxDetailId
                sessionStorage.setItem("apiStudyInfo", JSON.stringify(gvStudyInfo));
                location.reload();
            }
        } else {
            setTimeout(function(){
                crQzSeq++;
                crAnwrCnt=0;
                setQuiz();
            },1000);
        }
	}catch(er){
    }
}

function setResult(){
	try{		
        if(bagRc.length>0){
            $('#popResult .lvl').eq(0).html(bagRc[0].ObtainLevelName);
            var anum=0;
            var bnum=0;
            var ahtm="";
            var bhtm="";
            for(var i=0;i<bagRc.length;i++){
                if(bagRc[i].QuizType=='A'){
                    anum++;
                    ahtm+='<div><p class="chk'+(bagRc[i].OX==2?' x':'')+'"><img src="img/h/fail.png"/></p><span class="num">'+anum+'</span></div>';
                }else{
                    bnum++;
                    bhtm+='<div><p class="chk'+(bagRc[i].OX==2?' x':'')+'"><img src="img/h/fail.png"/></p><span class="num">'+bnum+'</span></div>';
                }
            }
            $('#popResult .part-a').eq(0).html('').append(ahtm);
            $('#popResult .part-b').eq(0).html('').append(bhtm);
            
            $('#popResult .bt').eq(0).on('click touchstart',function(){
                location.replace(REF.referer)
            });
            gfPop($('#popResult'));
        }
	}catch(er){}
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
        $('div.timer').html('<div id="slice"' + (percent > 50 ? ' class="gt50"' : '') + '><div class="pie"></div>' + (percent > 50 ? '<div class="pie fill"></div>' : '') + '</div><div class="tx">'+ crQzTime +'</div>');
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
            savRecord();
        } else objTmr = setTimeout("ingTimer()", 1000);
    } catch (e) {
        alert("setTimer : " + e.message);
    }
}

function doBackgroundProcess() {
	setTimout(function(){doBackgroundProcess();},100);
}
