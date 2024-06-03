
//audio
function gfPlayAudio(ischk,src) {
    try {
        var flag=0;
        if(ischk){
            if(isAudioPlaying) setTimeout(function(){gfPlayAudio(ischk,src);},100);
            else flag=1;
        }else{
            gfStopAudio();
            flag=1;
        }
        if(flag){
			if(isAudio(src)){
                $('#audio')[0].setAttribute('src', src); 
                $('#audio')[0].load();
                $('#audio')[0].play();
			}
        }
    } catch(er) {
        alert ("gfPlayAudio error : "+er);
    }
}

function gfDoAfterPlayAudio(ischk,src,act) {
    try {
        var flag=0;

        if(ischk){
            if (isAudioPlaying) {
                setTimeout(function () { gfDoAfterPlayAudio(ischk, src, act) }, 100);
            } else {
                flag = 1;
            }
        }else{
            gfStopAudio();
            flag=1;
        }

        if(flag){
			if(isAudio(src)){
				if($('#audio')[0].getAttribute('src')!=src){
				   $('#audio')[0].setAttribute('src', src); 
				   $('#audio')[0].load();
                }

				$('#audio')[0].play();
			}
            setTimeout(function(){gfDoLater(act);},1000);
        }
    } catch(er) {
        alert ("playAudio error : " + er);
    }
}

function gfCheckAudio () {
    var aud = $("#audio")[0];
    var tot = Math.ceil(aud.duration * 1000);
    var cur = Math.floor(aud.currentTime * 1000)+100;

    if (isNaN(tot) || cur == 0) {
        isAudioPlaying = false;
    } else {
        if (tot <= cur) {
            isAudioPlaying = false;
        } else {
            isAudioPlaying = true;
        }
    }
}

function gfStopAudio() {
    var a = $('#audio')[0];

    if ( typeof a != 'undefined' ) {
        a.pause();
        a.setAttribute('src','');
        if (a.duration) {
            a.currentTime = 0;
        }
    }

    isAudioPlaying=false;
    isAudioPaused=false;
}

function gfDoLater(js){
    try {
        gfCheckAudio();

        if (isAudioPlaying) {
            setTimeout(function () { gfDoLater(js); }, 500);
        } else {
            setTimeout(function () { eval(js) }, 1000);
        }
    } catch(er) {
        alert ("do After error :"+er);
    }
}

//popup
function gfPop(el) {
    try {
        var ispop=false;
        $(".pop").each(function() {
            if($(this).css("display")!="none"){
                $(this).css("display","none");
            }
        });
        
        var lang = (typeof gvStudyInfo == "undefined" || typeof gvStudyInfo.PopupGuide == 'undefined') ? 0 : gvStudyInfo.PopupGuide;
        
        if (lang == 1) {
            if (el.hasClass('kor')) {
                el.removeClass('kor').addClass('eng');
            }
        } else {
            if (el.hasClass('eng')) {
                el.removeClass('eng').addClass('kor');
            }
        }

        var w = parseInt(el.width());
        var h = parseInt(el.height());

        if (gvZoomRate < 100) {
            var r = (gvZoomRate / 100);
            var ori = 'top left';
            var val = 'scale('+r+','+r+')';

            el.css({
              '-webkit-transform-origin': ori,
              '-webkit-transform'       : val,
              '-moz-transform-origin'   : ori,
              '-moz-transform'          : val,
              '-ms-transform-origin'    : ori,
              '-ms-transform'           : val,
              '-o-transform-origin'     : ori,
              '-o-transform'            : val,
              'transform-origin'        : ori,
              'transform'               : val
            });
        }
        
        var dw=$(window).width();
        var dh = $(window).height();
        var rw = w * gvZoomRate / 100;
        var rh = h * gvZoomRate / 100;
        var pos_left = (dw - rw) / 2;
        var pos_top = (dh - rh) / 2;

        if(el.hasClass('at')){
            el.css({'left':pos_left+'px','top':'0px'});
        }else{
            el.css({'left':pos_left+'px','top':pos_top+'px'});
        }        
               
        el.fadeIn(500);
        $("#popBg").css("opacity", "0.7").fadeIn("normal"); 

        setTimeout(function() {
            if (el.find("input, a, button").length>0 ) 
				el.find("input, a, button").eq(0).focus();
        }, 100);
    } catch(e) {
        setTimeout(function() {
            if ( el.find("input, a, button").length>0 ) 
				el.find("input, a, button").eq(0).focus();
        }, 400);
    }
}
function gfPopClose(el) { 
    el.fadeOut(500, "swing"); 
    $("#popBg").fadeOut("normal"); 
}

function gfPopAlert(msg, js) {
    try {
        //if (gvStudyInfo.PopupGuide == 1) {
        //    $("#popAlert .en").eq(0).css("display", "block");
        //    $("#popAlert .ko").eq(0).css("display", "none");
        //} else {
        //    $("#popAlert .en").eq(0).css("display", "none");
        //    $("#popAlert .ko").eq(0).css("display", "block");
        //}

        $("#popAlert .en").eq(0).css("display", "block");
        $("#popAlert .ko").eq(0).css("display", "none");

        $("#popAlert .box span").each(function(){
            if($(this).hasClass("msg_"+msg)) $(this).css("display","table-cell");
            else $(this).css("display","none");
        });

        $("#popAlert .bt").eq(0).one('click touchstart', function(){
            if(!/^(gfPop)/.test(js)) gfPopClose($("#popAlert"));
            if(js!="") eval(js);
        });

        gfPop($("#popAlert"));        

        $("#popAlert input, #popAlert button").eq(0).focus();
    } catch(er) {
        alert ("popAlert error : "+er);
    }
}

function gfPopAlertNew(msg, js) {
    try {
        if (gvStudyInfo.PopupGuide == 1) {
            $("#popAlertNew .en").eq(0).css("display", "block");
            $("#popAlertNew .ko").eq(0).css("display", "none");
        } else {
            $("#popAlertNew .en").eq(0).css("display", "none");
            $("#popAlertNew .ko").eq(0).css("display", "block");
        }

        $("#popAlertNew .box span").each(function () {
            if ($(this).hasClass("msg_" + msg)) $(this).css("display", "table-cell");
            else $(this).css("display", "none");
        });

        $("#popAlertNew .bt").eq(0).one('click touchstart', function () {
            if (!/^(gfPop)/.test(js)) gfPopClose($("#popAlertNew"));
            if (js != "") eval(js);
        });

        $("#idMapPopReviewInfoKR").eq(0).one('click touchstart', function () {
            if (!/^(gfPop)/.test(js)) gfPopClose($("#popAlertNew"));
            if (js != "") eval(js);
        });

        $("#idMapPopReviewInfoUS").eq(0).one('click touchstart', function () {
            if (!/^(gfPop)/.test(js)) gfPopClose($("#popAlertNew"));
            if (js != "") eval(js);
        });

        gfPop($("#popAlertNew"));

        $("#popAlertNew input, #popAlertNew button").eq(0).focus();
    } catch (er) {
        alert("popAlertNew error : " + er);
    }
}

function gfPopAsk(msg, js1, js2) {
    if (gvStudyInfo.PopupGuide == 1) {
        $("#popAsk .en").eq(0).css("display","block");
        $("#popAsk .ko").eq(0).css("display","none");
    } else {
        $("#popAsk .en").eq(0).css("display","none");
        $("#popAsk .ko").eq(0).css("display","block");
    }

    $("#popAsk .box span").each (function() {
        if ($(this).prop("class") == "msg_" + msg) {
            $(this).css("display", "block");
        } else {
            $(this).css("display", "none");
        }
    });

    $("#popAsk .bt button").eq(0).off('click touchstart');

    $("#popAsk .bt button").eq(0).on('click touchstart', function(){
        if (!/^(gfPop)/.test(js1)) {
            gfPopClose($("#popAsk"));
        }

        if (js1 != "") {
            eval(js1);
        }
    });    

    $("#popAsk .bt button").eq(1).off('click touchstart');

    $("#popAsk .bt button").eq(1).on('click touchstart', function(){
        if (!/^(gfPop)/.test(js2)) {
            gfPopClose($("#popAsk"));
        }

        if (js2 != "") {
            eval(js2);
        }
    });

    gfPop($("#popAsk"));

    $("#popAsk button").eq(0).focus();
}

function gfPopAct(el, js) {
    el.find('button').eq(0).one('click touchstart', function () {
        if (js != "") {
            eval(js);
        }

        gfPopClose(el);
    });

    gfPop(el);
    el.find('button').eq(0).focus();
}

var gaStack=new Array();

function gfAddStack(typ, js) {
    gaStack.push({ 'typ': typ, 'js': js });
}

function gfDoStack(){
    if(gaStack.length>0){
        eval(gaStack[0].js);
        gaStack.splice(0,1);
    }

    if(gaStack.length>0)gfDoLater('gfDoStack()');
}

function gfAlignMiddle(p,c,n){
    var ph=p.height();
    var ch=c.height();
    if (isNaN(n)) n = 0;

    if (ch == 0) {
        setTimeout(function(){gfAlignMiddle(p,c,n);},100);
    }  else {
        if (ph < ch) {
            c.css({ 'top': '0px' });
        } else {
            c.css({ 'top': ((ph - ch) / 2 + n) + 'px' });
        }
    }
}
function gfAlignCenter(p,c,n){
    var pw=p.width();
    var cw=c.width();

    if (isNaN(n)) {
        n = 0;
    }

    if(cw==0){
        setTimeout(function(){gfAlignCenter(p,c,n);},100);
    } else {
        if (pw < cw) {
            c.css({ 'left': '0px' });
        } else {
            c.css({ 'left': ((pw - cw) / 2 + n) + 'px' });
        }
    }
}

function gfTrimStr(s){
	var a = s.split(' ');
	var ret = "";

	for(var i=0; i<a.length; i++){
		a[i]=a[i].trim();

		if (a[i] != '') {
		    ret += (ret == '' ? '' : ' ') + a[i];
		}
	}
	return ret;
}

function getCharClass(chr){
    if(!isMobile){
        if($.inArray(chr, ['a','c','e','g','j','m','n','o','r','s','u','v','w','x','z'])>-1){
            return 'short';
        }else{
            return '';
        }
    }
}

(function($){
    $.fn.setCursorToTextEnd = function() {
        var $initialVal = this.val();
        this.val($initialVal);
    };
})(jQuery);

document.write ('<textarea id="errTxt" style="position:absolute;top:0px;left:0px;width:400px;height:100px;display:none;z-index:10000"></textarea>');

function showError(str) {
    if (str) {
        $('#errTxt').css('display', 'block');
    }

    $('#errTxt').val(str + $('#errTxt').val());
}

function shuffle(a) {
    var cur = a.length;
    var tmp;
    var rnd;

    while (0 !== cur) {
        rnd = Math.floor(Math.random() * cur); cur -= 1; tmp = a[cur]; a[cur] = a[rnd]; a[rnd] = tmp;
    }

    while (0 !== cur) {
        rnd = Math.floor(Math.random() * cur); cur -= 1; tmp = a[cur]; a[cur] = a[rnd]; a[rnd] = tmp;
    }

    return a;
}

function obj2Str(obj) {
    var str = '';

    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            str += p + '::' + obj[p] + '\n';
        }
    }

    return str;
}

function getSplit(str, c, n, v) {
    var rtn = ''; str += '';

    if (str != '') {
        var a = str.split(c); rtn = (a.length > n) ? a[n] : v;
    }

    return rtn;
}

function chkEx(str) {
    str = encodeURIComponent(str);
    return str;
}

function removeHtml(str) {
    var ret = str.replace(/&amp;/g, '&');
    return ret;
}

function fixStrData(str) {
    var ret = str.replace(/¡¯/g, "'");
    return ret;
}

function isNumeric(str) {
    return /^-{0,1}\d*\.{0,1}\d+$/.test(str);
}

function toInt(str, n) {
    try {
        if (!isNumeric(str)) {
            return n;
        }

        return parseInt(str);
    } catch (e) {
        return n;
    }
}

function isAudio(n){
    if (n == null || n == '') {
        return false;
    }

	var ext = n.split('.').pop().toLowerCase();

    if ($.inArray(ext, ['mp3', 'wav']) == -1) {
        return false;
    } else {
        return true;
    }
}

function isEmpty(str) {
    return (str == null || str == '');
}

function isJson(str) {
    str = typeof str !== "string"
        ? JSON.stringify(str)
        : str;

    try {
        str = JSON.parse(str);
    } catch (e) {
        return false;
    }

    if (typeof str === "object" && str !== null) {
        return true;
    }

    return false;
}

function gfSortQz(a, b) {
    return parseInt(a.QuizNo) - parseInt(b.QuizNo);
}

function getTimeStamp() {
    var d = new Date();
    var s = leadingZeros(d.getFullYear(), 4) + leadingZeros(d.getMonth() + 1, 2) + leadingZeros(d.getDate(), 2) + leadingZeros(d.getHours(), 2) + leadingZeros(d.getMinutes(), 2) + leadingZeros(d.getSeconds(), 2);

    return s;
}

function leadingZeros(n, digits) {
    var zero = '';
    n = n.toString();

    if (n.length < digits) {
        for (i = 0; i < digits - n.length; i++) {
            zero += '0';
    	}
    }

    return zero + n;
}
