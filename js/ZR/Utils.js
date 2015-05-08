//$Id: $
//
/*****Prototypes*****/
//code snippet added for supporting index of in array in IE
if(!Array.prototype.indexOf){
	Array.prototype.indexOf = function(obj){
		for(var c=0; c<this.length; c++){
			if(this[c]==obj){
				return c;
			}
		}
		return -1;
	};
}
Array.prototype.removeElement = function(val) {
	for (i = 0; i < this.length; i++) {
		if (this[i] === val) {
			this.splice(i, 1);
			break;
		}
	}
}
String.prototype.trim = function() {
	var str = this;
	str = str.replace(/^\s*(.*)/, "$1");
	str = str.replace(/(.*?)\s*$/, "$1");
	return str;
};
jQuery.fn.removeAttributes = function() {
  return this.each(function() {
    var attributes = $.map(this.attributes, function(item) {
      return item.name;
    });
    var img = $(this);
    $.each(attributes, function(i, item) {
    img.removeAttr(item);
    });
  });
}
$.fn.outerHTML = function() {
	$t = $(this);
	if ('outerHTML' in $t[0]) {
		return $t[0].outerHTML;
	} else {
		var content = $t.wrap('<div></div>').parent().html();
		$t.unwrap();
		return content;
	}
}
/*jQuery(document).ready(function($) {
	Utils.initHistory();
});*/
/*****Prototypes*****/
var CJS = (function(){
	return{
		execScript : function(src, onLoad) {

			// single function that works with onload and onreadystatechange
			var func = function() {
				if ( this.readyState && this.readyState != "complete" && this.readyState != "loaded" ) {
					return; 
				}
				this.onload = this.onreadystatechange = null; // ensure callback is only called once
				onLoad(); 
			};

			// Add a SCRIPT element pointing to the (already cached) src so the JS gets executed.
			var se = document.createElement('script');
			se.onload = se.onreadystatechange = func;  // set this BEFORE setting .src
			se.src = src;
			var s1 = document.getElementsByTagName('script')[0];
			s1.parentNode.insertBefore(se, s1);
		}
	};	
	})();
var Utils = {
	"getFromToIndexes" : function(recNum,currOption){//no i18n
		var quo = parseInt(parseInt(recNum)/parseInt(currOption));
		var indexes = [];
		indexes.push(quo*currOption+1);
		indexes.push((quo+1)*currOption);
		return indexes;
	},	
	"getTargetElem" : function(e){//No I18n
		if ( e ) {
		        return (e.target || e.srcElement);
		} else {
			return undefined;
		}
	},
	"set" : function(src,dest){ //no i18n
			for(var key in src) {
				dest[key] = src[key];
			}
			return dest;
	},
	"positionArrow" : function(currentElement, toId, ev, arrowElemId, posObj) {//No I18N
		var totViewPortWidth = (window.innerWidth) ? window.innerWidth : document.body.clientWidth;
		var totViewPortHeight = ((window.innerHeight) ? window.innerHeight : document.body.clientHeight);
		var elemToShow = $("#"+toId);
		var showElemWidth = elemToShow.outerWidth();
		var clientY = posObj.mouseclientY;
		var clientX = posObj.mouseclientX;
		var pageY = posObj.mousepageY;
		var pageX = posObj.mousepageX;
		var bottomSpc = totViewPortHeight - clientY;
		var topVal = 0;
		var left = 0;
		var arrowClass = "arrwLeft";  //No I18N
		var neededHeight = elemToShow.outerHeight();
		if ( (totViewPortWidth - clientX - 15) > showElemWidth) { //If true right side space available
			if ( bottomSpc > neededHeight ) {
				topVal = pageY - 60;
			} else {
				topVal = pageY - (neededHeight - bottomSpc + 30);
			}
			left = pageX+20;
			arrowClass = "arrwRight";  //No I18N
		} else {// else left side available
			left = pageX - elemToShow.outerWidth() - 20;
			if ( bottomSpc > neededHeight) {
				topVal = pageY - 60;
			} else {
				topVal = pageY - (neededHeight - bottomSpc + 30);
			}
			arrowClass = "arrwLeft";  //No I18N
		}
		elemToShow.css({"top": topVal , "left": left});//No I18n
		arrowElemId = arrowElemId ? arrowElemId : "posArrow";//No I18n
		$("#"+arrowElemId).attr({"class": arrowClass}).css({"left":"", "top": pageY - topVal - 8});  //No I18N
		elemToShow.show();
},
	
	"hideDiv"	: function (divId,complete){//No I18N
		elem = $('#'+divId);
		elem.hide();
		complete();
	},
    "URL" : function(url){//No I18N
        var paramObj={},params = [];
        var paramsArr = (params = url.split("?")[1]) ? params.split("&") : [];
        return {
            getParams:function(){
                      for(var param in paramsArr){
                          if(paramsArr.hasOwnProperty(param)){
                              sParam = paramsArr[param].split('=');
                              paramObj[sParam[0]]=decodeURIComponent((sParam[1] || "").replace(/\+/g,' '));
                          }
                      }
                      return paramObj;
                  }
        };
	},
"splitStringToObj":function(str){ //no i18n
		var paramStr = str;
		var obj = {};
		if(paramStr.length !== 0 && typeof paramStr == "string"){
			var paramArr = paramStr.split("&");
			for(var i=0;i<paramArr.length;i++){
				var ind = paramArr[i].indexOf("=");
				var key = paramArr[i].substring(0,ind);
				var value = paramArr[i].substring(ind+1);
				obj[decodeURIComponent(key)] = decodeURIComponent(value);
			}
		}else{
			obj = str;
		}
		return obj;
	},
    "checkErrorMsg" : 	function(txt){//No I18N
	    if(txt.indexOf("NAVMESG::::")>-1)
	    {
		    var key=txt.substring(txt.indexOf("NAVMESG::::")+11,txt.indexOf("::::NAVMESG"));
		    DWRutil.getJSAlertValueForKey(key,singularModule,loc, function(str){
			    alert(str);
		    });
		    document.getElementById('ajax_load_tab').style.display='none';
		    return true;
	    }
	    if (txt.indexOf("INVALIDTICKET:::")>-1)
	    {
		    document.getElementById('ajax_load_tab').style.display='none';
		    DWRutil.getJSAlertValueForKey("crm.project.error.portalownerchanged","",loc, function(str){//No I18N
			    alert(str);
		    });
		    return true;
	    }
	    if (txt.indexOf("NOPROJASSOCIATION:::")>-1)
	    {
		    document.getElementById('ajax_load_tab').style.display='none';
		    DWRutil.getJSAlertValueForKey("crm.project.nomoretoassociate","",loc, function(str){//No I18N
			    alert(str);
		    });
		    //alert('No more project to association');
		    return true;
	    }
	    if(txt.indexOf("SECURITY::::")>-1)
	    {
		    var errorContent = txt.split("SECURITY::::");
		    getObj("show").innerHTML = "";
		    getObj("show").innerHTML = errorContent[1];
		    document.getElementById('ajax_load_tab').style.display='none';
		    return true;
	    }
	    if(txt.indexOf("Why does my session expire")>-1 || txt.indexOf("Affordable for Medium Business") > -1)
	    {
		    DWRutil.getJSAlertValueForKey("crm.reauth.login.expired",singularModule,loc, function(str){//No I18N
			    alert(str);
		    });
		    document.location.href="/crm/ShowHomePage.do"
			    return true;
	    }
	    if ( txt.indexOf("CRM_ERROR_PAGE_500::::EXCEPTION") > -1) {
	    	 return true;
	    } 
	    return false;
    },
	"parseUrl"	:	function(url){//No I18N
		//var reg = /.*?\/(.*)?\/(.*)?\.do(\?(.*)?)?/;		
		//The above regex splits the url into this, For example We have a url as shown below 
		//url = "protocol://crm.zoho.com/crm/events/Calendar.do?param1=value1&param2=value2; 
		//the out put will be ["protocol://crm.zoho.com/crm/events/Calendar.do?param1=value1&param2=value2","/crm/events","Calendar","?param1=value1&param2=value2","param1=value1&param2=value2"]
		var idx = url.indexOf("?");
		if(idx <0){
			idx = url.length;
		}
		var action = url.substring(0,idx);
		action = action.replace(".do","");
		var lastIndex = url.lastIndexOf("/");
	       	action = action.substring(lastIndex+1);	
		var paramStr = url.substring(idx+1);
		var obj = {};
		//Recruit change
		var zrModMap = ZRCommonUtil.ZRMODULEMAP;
		if(paramStr.length != 0){
			var paramArr = paramStr.split("&");
			for(var i=0;i<paramArr.length;i++){
				var ind = paramArr[i].indexOf("=");
				var key = paramArr[i].substring(0,ind);
				var value = paramArr[i].substring(ind+1);
				//Recruit change
				value = zrModMap.hasOwnProperty(value) ? zrModMap[value] : value;
				obj[key] = value;
			}
		}
		/*var matchArr = reg.exec(url);
		var action;
		if(matchArr[2]){
			action = matchArr[2];
		}
		if(matchArr[4]){
			var paramStr = matchArr[4];
			var paramArr = paramStr.split("&");
			var obj = {};
			for(var i=0;i<paramArr.length;i++){
				var ind = paramArr[i].indexOf("=");
				var key = paramArr[i].substring(0,ind);
				var value = paramArr[i].substring(ind+1);
				obj[key] = value;
			}
		}*/
		return {"action": action,"params":obj};//No I18N
	},
	"executeFunctionByName"	:	function(functionName, context /*, args */) {//No I18N
		var args = Array.prototype.slice.call(arguments,2);//.splice(2);
		var namespaces = functionName.split(".");
		var func = namespaces.pop();
		for(var i = 0; i < namespaces.length; i++) {
			context = context[namespaces[i]];
		}
		return context[func].apply(context, args);
    },
    "clearTextSelection" : function() {//No I18N
        if (window.getSelection) {
            window.getSelection().removeAllRanges();
        } else if (document.getSelection) {
            var s = document.getSelection();
            if (s.collapse) s.collapse(true);
            if (s.removeAllRanges) s.removeAllRanges();
        } else if (document.selection) {
            document.selection.empty();
        }    
    },
    "triggerEvent"	:	function(eventType, Jelem){//No I18N
	    if(Jelem[0][eventType]){
		    Jelem[0][eventType]();
	    }
	    else{
		    Jelem.eq(0).trigger(eventType);
	    }
    },
    "urlCache" : {},//No I18N
    "globalId" : "",//No I18N
    "ajaxBackButton" : function(id, url, isOnMouseOver)//No I18N
	{
		//console.log(arguments);
		return;
		/*if(isOnMouseOver)
		{
			$('#'+id).unbind('click.putAjaxHistory').bind('click.putAjaxHistory', function(e) {
				Utils.urlCache[id] = url;
				Utils.globalId = id;
				$.history.load(id+"bck"); //No I18N
			});	
		}
		else
		{
			Utils.urlCache[id] = url;
			Utils.globalId = id;
			$.history.load(id+"bck"); //No I18N
		}*/
	 },
    //Use only for firefox and chrome. Don't use for IE    
    "getFirstChild" : function(el){//No I18N
        var firstChild = el.firstChild;
        while(firstChild != null && firstChild.nodeType == 3){ // skip TextNodes
            firstChild = firstChild.nextSibling;
        }
        return firstChild;
    },
    /*this method will update username, when user enter into any of the integration and if particular integration needs username*/
    "updateUsername" : function(callBackFn, service){//No I18N
        var asyncValue = true;
        if (service == 'meeting')
        {
            asyncValue = false;
        }
        $('#alertForShortUsername').hide();//No I18N
        $('#usernamePatternFailed').hide();//No I18N
        $('#usernameAlerts').hide().removeClass('green mt15 red');//No I18N
        var username = $('#username').val();//No I18N
        if (username.length < 6 || username.length > 30 || !/^[A-Za-z0-9_.]+$/.test(username))
        {
            $('#alertForShortUsername').show();//No I18N
            return false;
        }
        var posturl = "/crm/UpdateUsername.do?action=updateUsername"; //No I18N
	       var param = "username=" + escape(username) +"&"+csrfParamName+"="+encodeURIComponent(csrfToken)+"&"+"service="+service; //No I18N
        loadAjaxTab('','lightblue'); //No I18N
        $('#ajax_load_tab').show();//No I18N
        $.ajax({
            type: "POST",//No I18N
            url: posturl,
            data: param,
            async: asyncValue,
            dataType: "json",//No I18N
            success: function(data) {
		$('#ajax_load_tab').hide();//No I18N
                getObj('shownotes').style.display = 'none';//No I18N
                removeFreezeLayer();
                /*
                   USERNAME_UPDATED_SUCCESSFULLY = "1002";//No I18N
                   USERNAME_NOT_UPDATED = "1003";//No I18N
                   USERNAME_ALREADY_TAKEN = "1004" //No I18N
                   USERNAME_INVALID = "1005" //No I18N
                   USERNAME_CHECK_FAILURE = "1006"//No I18N
                   */
                /*if username was added successfully, then resend the request to zmailconfig.do */
                if(data.result == '1002')
                {
                    usernameNeeded = "";
                    callBackFn();
                }
                else if(data.result == '1004' || data.result == '1005')
                {
                    /*invalid users and username already taken, have to reenter the username*/
                    getObj('shownotes').style.display = '';
                    getObj('usernameAlerts').innerHTML = "\"" + username + "\" " +  getObj('usernameAlreadyTaken').innerHTML; 
                    $('#usernameAlerts').addClass("red mt15");//No I18N
                    $('#usernameAlerts').show();                //No I18N
                    freezeBackground();                       
                    mailsetCenter('shownotes');                  
                }
                else if(data.result == '1003')
                {
                    /*on failure*/
                    getObj('shownotes').innerHTML =  getObj('usernameUpdationFailedMsg').innerHTML;
                    $('#shownotes').addClass('newPopup p30 font17');//No I18N
                    getObj('shownotes').style.zIndex = 21;
                    getObj('shownotes').style.position = 'absolute';;
                    freezeBackground();
																				jQuery('#shownotes').show();//No I18N
                    mailsetCenter('shownotes');
                }
            },
            error: function(){
                       /*if username doesnt match the regex, then intimate to user regarding the issue.*/
                       $('#ajax_load_tab').hide();//No I18N
                       getObj('shownotes').style.display = 'none';
                       removeFreezeLayer();
                       getObj('shownotes').style.display = '';
                       getObj('usernamePatternFailed').style.display = '';
                       freezeBackground();                       
                       mailsetCenter('shownotes');            
                   }
        });
    },
    /*this method will check for whether username is needed for particular intergration (service like mail, projects etc)*/
    "checkUsernameNeeded" : function(callbackfn, service, cancelBtnCallbackfn){        //No I18N
        var posturl = "/crm/UpdateUsername.do"; //No I18N
        $.ajax({
            type: "POST",//No I18N
            url: posturl,
            data: "action=checkUsernameNeeded&service="+service,//No I18N
            success: function(data) {
                var tempdata = data.replace(/^\s+|\s+$/g,"");
                if(tempdata.length > 0){
                    getObj('shownotes').innerHTML =  data;
					$('#shownotes').addClass('newPopup p30 f17');//No I18N
					getObj('shownotes').style.zIndex = 100;
                    getObj('shownotes').style.position = 'absolute';
                    freezeBackground();
                    if (getObj("usernameUpdateBtn") != null && getObj("usernameUpdateBtn") != 'undefined')
        {
            getObj("usernameUpdateBtn").onclick = function() {
                Utils.updateUsername( callbackfn, service ); 
            };
        }
        /*call back function for cancel button, if needed.*/
        if (getObj("closeUpdateUsernameId") != null && cancelBtnCallbackfn != 'undefined' && getObj("closeUpdateUsernameId") != 'undefined')
        {
            getObj("closeUpdateUsernameId").onclick = function() {
                Utils.closeUpdateUsernameDiv( cancelBtnCallbackfn );
            };
        }
        $('#shownotes').show();//No I18N
        mailsetCenter('shownotes');                    
                }
                else
                {
                    usernameNotNeeded.push(service);
                    callbackfn();
                }
            }
        });
    },
				
    "checkUsernameAvailability" : function(){//No I18N
        var asyncValue = true;
        var username = $('#username').val();//No I18N
        $('#alertForShortUsername').hide();//No I18N
        $('#usernameAlerts').hide().removeClass('green mt15 red');//No I18N
        $('#usernamePatternFailed').hide();//No I18N
        if (username.length < 6 || username.length > 30 || !/^[A-Za-z0-9_.]+$/.test(username) )
        {
            $('#alertForShortUsername').show();//No I18N
            return false;
        }
        var posturl = "/crm/UpdateUsername.do?action=checkUsernameAvailability"; //No I18N
        var param = "username=" + escape(username);//No I18N
        loadAjaxTab('','lightblue'); //No I18N
        $('#ajax_load_tab').show();//No I18N
        $.ajax({
            type: "POST",//No I18N
            url: posturl,
            data: param,
            async: asyncValue,
            dataType: "json",//No I18N
            success: function(data) {
                /*
                   USERNAME_ALREADY_TAKEN = "1004" //No I18N
                   USERNAME_ALREADY_NOT_TAKEN = "1007" //No I18N
                   USERNAME_ALREADY_TAKEN_CHECK_FAILURE = "1008"                
                   */
                $('#ajax_load_tab').hide();//No I18N
                if(data.result == '1004')
        {
            getObj('usernameAlerts').innerHTML = "\"" + username + "\" " +  getObj('usernameAlreadyTaken').innerHTML; //No I18N
            $('#usernameAlerts').addClass("red mt15");//No I18N
            $('#usernameAlerts').show();             //No I18N 
        }
                else if(data.result == '1007')
                {     
                    getObj('usernameAlerts').innerHTML = "\"" + username + "\" " +   getObj('usernameAlreadyNotTaken').innerHTML; 
                    $('#usernameAlerts').addClass("green mt15");//No I18N
                    $('#usernameAlerts').show();      //No I18N
                }
                else if(data.result == '1008')
                {
                    $('#usernameAlreadyTakenError').show();            //No I18N      
                }
            },
            error: function(){
                       /*if username doesnt match the regex, then intimate to user regarding the issue.*/
                       $('#ajax_load_tab').hide();//No I18N
                       getObj('shownotes').style.display = 'none';//No I18N
                       removeFreezeLayer();
                       getObj('shownotes').style.display = '';//No I18N
                       getObj('usernamePatternFailed').style.display = '';//No I18N
                       freezeBackground();                       
                       mailsetCenter('shownotes');            //No I18N
                   }
        });
    },
    "showUserNameHints" : function() {//No I18N
        var objLeft = $('#usernameTable').get(0).offsetWidth + 8;
        $('#tempdiv').css({left:objLeft}).show();//No I18N
    },
    "setHTML" : function(content,doc){//No I18N
        doc.open();
								doc.domain = document.domain;
        doc.write(content);
        doc.close();
        if (doc.body) {
            doc.body.style.fontSize = '11px';  //No I18N
            doc.body.style.fontFamily = 'verdana,arial,helvetica,sans-serif'; //No I18N
        }
    },
    "getIFrameDoc" : function(iframe){//No I18N
        if (iframe.contentDocument) {
            return iframe.contentDocument; 
        } else if (iframe.contentWindow) {
            return iframe.contentWindow.document;
        } else if (iframe.document) {
            return iframe.document;
        } else {
            return null;
        }
    },
	"removeLocalStorageValue" :function(key){//No I18N
		if(typeof Storage != "undefined"){
			localStorage.removeItem(key);
		}else{
			this.deleteCookie(key);
		}
	},
	"setLocalStorage" :	function(key,value){//No I18N
		if(typeof Storage != "undefined"){
			localStorage.setItem(key,value);
		}else{
			set_cookie(key,value);
		}
	},
	"getLocalStorageValue"	: function(key){//No I18N
		var value = null;
		if(typeof Storage != "undefined"){
			value = localStorage.getItem(key);
		}else{
			value = get_cookie(key);
		}
		return value;
	},
    "closeUpdateUsernameDiv" : function(callbackFn){//No I18N
        $('#shownotes').hide(); 
        removeFreezeLayer();
        if ( typeof callbackFn != 'undefined' ){
            callbackFn();
        }
    },
    "isEmptyString" : function(val){//No I18N
        return (val == null || ( typeof val == "string" && val.trim().length == 0));//No I18N
    },
    "isValidPhoneNo" : function(phoneNo){//No I18N
var phoneReg = /^[0-9a-zA-Z!#%\*\^\(\)=\{\}\[\]\?`~_\-\.\$@\?\,\:\'\/\!\P{InBasicLatin}\s\+\|;]+$/;
	if(phoneNo == ""){
		return true;
	}
        return phoneReg.test(phoneNo);
    },
    "getMonthEnd" : function(month,year){//No I18N
	var monthEndArr = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
	if(month == 1){
        	monthEndArr[1] = ((year % 400 == 0) || ((year % 4 == 0) && (year % 100 !=0))) ? 29 : 28;
	}
	return monthEndArr[month];
    },
    "isValidTime" : function(hrs,mins){//No I18N
        var argLen = arguments.length;
		var reg = /\d*/g;
        for(var i=0;i<argLen;i++){
            if(!reg.test(arguments[i]))
                return false;
            if(i == 0 && arguments[i] > 23)return false;
            else if(i == 1 && arguments[i] > 59) return false;
        }
        return true;
    },
    "isFieldEmpty" : function(Jelement){//No I18N
        var type = Jelement.prop("type");//No I18N
	var val = this.getValue(Jelement);
        if(type == "text" && (Jelement.data("contentType") && Jelement.data("contentType").toLowerCase().indexOf("date") != -1)){
            //Should check whether it is date field so it will contain date format so exclude it 
            val = val.replace(Crm.userDetails.DATE_PATTERN,"");
        }
        else if(type == "radio"){
            var name = Jelement.attr("name");//No I18N
            val = Utils.getRadioValue(name);
        }
        else if(type == "checkbox"){
            val = (Jelement.is(":checked")) ? "true" : "false" ;//No I18N
        }
        else if(type == "combo" || type == "select-one"){
            val = val.replace(/-None-|none|None/g,"");
        }
        else{
			if(Jelement && Jelement.hasClass("bulk-multi")){
				var child = Jelement.children();
				val = "";
				$.each(child,function(i,item){
					var dataVal = $(item);
					dataVal = (dataVal && dataVal.hasClass("active")) ? dataVal.data("label") : "";// No i18n
					val = (val && val.length != 0) ? val+";"+dataVal : dataVal;
				});
			}
		}
        return Utils.isEmptyString(val);    
	},
	"getValue"	:	function(Jelem){//No I18N
		var type = Jelem.prop("type");//No I18N
		var val;
	        if(type == "text" || type == "combo" || type == "select-one" || type == "textarea" || type == "select-multiple"){
			val  = Jelem.val();
		}else if(type == "radio"){//No I18N
			var label = Jelem.attr("name");//No I18N
			val = $('input[name='+label+']:checked').val();
		}else if(type == "checkbox"){//No I18N
			val = (Jelem.is(":checked")) ? "1" : "" ;//No I18N
		}else{
			if(Jelem && Jelem.hasClass("bulk-multi")){
				var child = Jelem.children();
				val = [];
				$.each(child,function(i,item){
					var dataVal = $(item);
					(dataVal && dataVal.hasClass("active")) ? val.push(dataVal.data("label")) : "";// No i18n
				});
			}
		}
		return val;
    },
    "checkMaxLength" : function(Jelement,maxLength){//No I18N
        var type = Jelement.prop("type");//No I18N
        if(type == "text"){
            return (Jelement.val().length <= maxLength)
        }else if(type == "Integer" || type == "Long"){//No I18N
            return (Jelement.val().replace(/,/g,"").length <= maxLength);
        }
        return true;
    },
    "formatTimeVal"    :    function(val){//No I18N
        val = (val < 10)? ("0"+val) : val;
        return val;
    },
    convertTimeTo24HoursFormat      :       function(hrs,meridiem){
        meridiem = meridiem.toLowerCase();
        if(meridiem == "am"){  //No I18N
                return (hrs == 0)?12:(hrs == 12)?0:hrs;
        }else if(meridiem == "pm"){//No I18N
        		return (hrs == 12)?hrs:hrs+12;
        }
    },
    convertTimeTo12HoursFormat     :       function(hrs,meridiem){
        meridiem = meridiem.toLowerCase();
        if(meridiem == "pm"){
                return (hrs <= 12) ? hrs:hrs-12;
        }
        else if(meridiem == "am"){      
                return (hrs == 0)? 12 : hrs ;
        }       
    },    
	constructUrl				:	function(action,params){
		var url = action;
		var i=0;
		for(var key in params){
			if(i==0) { url+= "?"+key+"="+params[key]; }
			else { url += "&"+key+"="+params[key]; }
			i++;
		}
		return url;
	},
    getDateObject        :    function(strDate,time){
        var dateObj =    crmCalendar.getDateObjectFromGivenDateString(strDate);
        if(time.hrs){
            dateObj.setHours(time.hrs);
        }
        if(time.mins){
            dateObj.setMinutes(time.mins);
        }
        if(time.sec){
            dateObj.setSeconds(time.sec);
        }
        return dateObj;    
    },
    getTimeDiff : function(startDate, endDate) {
        var elapsed = (endDate.getTime() - startDate.getTime())/1000;
        var seconds=elapsed%60;
        var minutes=(elapsed%3600)/60;
        var hours=elapsed/3600;
        return {"hours": hours,"minutes":minutes,"seconds":seconds};//No I18N
    },
    getElementsByTagName    :    function(nodeName,elem){
        elem = (!elem)? document:elem;
        var children  = elem.childNodes;
        nodeName = nodeName.toLowerCase();
        var elementsArr = [];
        for(var i=0;i<children.length;i++){
            var kid = elem.childNodes[i];
            if(kid.nodeType == 3 && nodeName == "#text"){
                elementsArr.push(kid);
            }else if(kid.nodeName.toLowerCase() == nodeName){
                elementsArr.push(kid);
            }
            if(kid.hasChildNodes()){
                elementsArr.concat(this.getElementsByTagName(nodeName,elem));
            }
        }
        return elementsArr;    
    },
    getTimeArrayWithGivenInterval    :    function(calculateFromCurrTime,minDiff,dateObj,options){
        if(calculateFromCurrTime){
            var dateObj = new Date();
        }else if(!dateObj){
            var dateObj = new Date(2000,0,1,0,00,00);//default date
        }
        var minDiff = (!minDiff)?30:minDiff;
        var currDateObj = new Date(dateObj);
        var startDateObj = new Date(dateObj);
        var nextDayObj = new Date(currDateObj.setDate(currDateObj.getDate()+1));
        var nextDayCurrTime = nextDayObj.getTime();
//        dateObj.setMinutes(dateObj.getMinutes()+minDiff);
        var optionalVal ='' ;
        var allTimeArr = [];
        var timeJson = {};
        while(dateObj.getTime() < nextDayCurrTime){
            var mins = dateObj.getMinutes();
            var tfHour = dateObj.getHours();
            var hour = (Crm.userDetails.TIME_FORMAT === "HH:mm")? tfHour :  this.convertTimeTo12HoursFormat(tfHour, Utils.getMeridiem(dateObj) );//No I18N
            var timeDifInMin = 0;
    var meridiem = ( tfHour > 11 ) ? "PM" : "AM";//No I18n
            if(options == "meridiem" && Crm.userDetails.TIME_FORMAT !== "HH:mm"){
                optionalVal = ( tfHour > 11 ) ? I18n.getMsg("PM") : I18n.getMsg("AM");//No I18n
            }else if(options == "timeDiff"){//No I18n
                var timeDiff = this.getTimeDiff(startDateObj,dateObj);
                if(timeDiff["hours"] > 1){
                    optionalVal = timeDiff.hours +" "+I18n.getMsg("crm.workflow.scheduler.hours");//No I18n
                    timeDifInMin = timeDiff.hours * 60;
                }
                else if(timeDiff["hours"] == 1){
                	timeDifInMin = timeDiff.hours * 60;
                    optionalVal = timeDiff.hours +" "+I18n.getMsg("crm.workflow.scheduler.hour");//No I18n
                }
                else{
                    optionalVal = timeDiff.minutes +" " +I18n.getMsg("crm.workflow.scheduler.mins");//No I18n
                    timeDifInMin =timeDiff.minutes;
                }
            }
            var tKey = [{"name": "span", "html": Utils.formatTimeVal(hour)+":"+Utils.formatTimeVal(mins)+" ", "attr": {"diff":timeDifInMin,"hrs":(Crm.userDetails.TIME_FORMAT === "HH:mm")?tfHour:hour,"mins":Utils.formatTimeVal(mins),"meridiem":meridiem}}];//No I18n
	    if(optionalVal){
		    tKey.push( {"name": "span", "html": optionalVal, "attr": {"class":"color2 f10 pL5"}});  //No I18N
	    }
            dateObj.setMinutes(mins+minDiff);
            allTimeArr.push(tKey);
        }
        return allTimeArr;
    },
    showCustomConfirmMessage	:	function(id,msg, button){
	$("#"+id).remove();
	if($("#"+id).length === 0 ){
		var div = $("#confirmMsg1")[0].cloneNode(true);
		div.id = id;
		for(var i=0;i<msg.length;i++){
			$(div).find("#confirmMessage"+i).html(msg[i]);
		}
		for(var i=0;i<button.length;i++){
			$(div).find("#confirmButton"+i).val(button[i].val);
			if(button[i].fn){
				$(div).find("#confirmButton"+i).click(button[i].fn);
			}
		}
		document.body.appendChild(div)
	}else{
		div = $("#"+id)[0];
	}
	Utils.positionCenter(id);
	return div;
    },
    positionCenter	:	function(id){
	var sTop=document.documentElement.scrollTop || document.body.scrollTop;
	var sLeft=document.documentElement.scrollLeft || document.body.scrollLeft;
	if(($(window).height()) > ($('#'+id).height())){
	$('#'+id).css({'display':'block','position' : 'absolute','left' : '50%','top' : '50%','margin-left' :-($('#'+id).width()/2)+sLeft,'margin-top':-($('#'+id).height()/2)+sTop});//No I18N
	}else{
		var tP=sTop+10;
		$('#'+id).css({'display':'block','position' : 'absolute','left' : '50%','top' : tP,'margin-left' :-($('#'+id).width()/2)+sLeft,'margin-top':'0px'});//No I18N
	}
    },
    constructList    :    function(listItemArray,eachfunction,callBack){
        var div = $("<div>",{style:'z-index:1000;#padding-right:20px;display:none'});
        var ul = $("<ul>", {"class":"timeList"});
        div.append(ul);
        for(var i=0;i<listItemArray.length;i++){
            var cT = listItemArray[i];
            var li = $("<li>");
            ul.append(li);
            if(callBack){
                li.click( function() {
                    callBack(this);
                    div.hide();
                });
            }
	    if(cT.length){
            	for(j=0; j<cT.length; j++) {
                	li.append( Utils.createHTML(cT[j]) );    
            	}
	    }else{
		    li.append(Utils.createHTML(cT));
	    }
	    if(eachfunction){
		eachfunction(li);
	    }
        }
        return div[0];
    },
	"compareDate"	:	function(startDate,endDate){//No I18n
		var startTime = new Date(startDate).getTime();//In order to avoid milliseconds difference
		var endTime = new Date(endDate).getTime();
		var diff = endTime - startTime;
		return (diff >= 1000);
	},
	"isValidDate"	:	function(datepat,dateVal){//No I18n
		//var reg = /./;
		datepat = datepat.toLowerCase();
		datepat = datepat.replace(/'/g,'');

		var defReg = datepat.replace(/mm/i,'\\d{1,2}');
		defReg = defReg.replace(/dd/i,'\\d{1,2}');
		defReg = defReg.replace(/yyyy/i,'\\d{4}');
		defReg = new RegExp(defReg);

		if(!defReg.test(dateVal) || dateVal.match(defReg)[0] !== dateVal){
			return false;
		}

		var monthReg = datepat.replace(/mm/i,'(\\d{1,2})');
		monthReg = monthReg.replace(/dd/i,'\\d{1,2}');
		monthReg = monthReg.replace(/yyyy/i,'\\d{4}');
		re = new RegExp(monthReg);
		var dateArr = re.exec(dateVal);
		var month =  dateArr[1];

		var yearReg = datepat.replace(/yyyy/i,'(\\d{4})');
		yearReg  = yearReg.replace(/dd/i,'\\d{1,2}');
		yearReg  = yearReg.replace(/mm/i,'\\d{1,2}');
		re = new RegExp(yearReg);
		dateArr = re.exec(dateVal);
		var year =  dateArr[1];

		var dateReg = datepat.replace(/dd/i,'(\\d{1,2})');
		dateReg = dateReg.replace(/mm/i,'\\d{1,2}');
		dateReg = dateReg.replace(/yyyy/i,'\\d{4}');
		re = new RegExp(dateReg);
		dateArr = re.exec(dateVal);
		var date =  dateArr[1];

		if(month > 12 || month < 1){
			return false;
		}
		if(month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
			return (date <=  31);
		}
		else if(month == 2){
			if(year % 4 && !(year %100 || year %400)){
				return (date <= 29)
			}    
			return (date <=28);
		}
		else{
			return (date <=30);
		}
		return true;

	},
    //Validate date format along with the date of month. 
    /*"isValidDate" : function(fmt,dateVal){//No I18N
        if(dateVal == "")return true;
        var dateReg = /(^(\d{4})(-|\.|\/){1}(\d{2})(-|\.|\/){1}(\d{2})$)|(^(\d{2})(-|\.|\/){1}(\d{2})(-|\.|\/){1}(\d{4})$)/
        var datePattern = dateReg.exec(dateVal);
        var separator;
        if(!datePattern || !datePattern[0])return false;
        var month,date,year;
        fmt = fmt.toLowerCase();
        var userDateFormat =  Crm.userDetails.DATE_PATTERN.toLowerCase();
        userDateFormat = userDateFormat.replace(/'/g,'');//Not sure why this is required. Copied from old code, This is needed for hongkong locale.
        year = dateVal.substring(userDateFormat.indexOf('yyyy'),userDateFormat.lastIndexOf('y')+1)
        month = dateVal.substring(userDateFormat.indexOf('mm'),userDateFormat.lastIndexOf('m')+1)
        date = dateVal.substring(userDateFormat.indexOf('dd'),userDateFormat.lastIndexOf('d')+1)
        if(month == 1 || month == 3) return (date <=  31);
        if(month == 2){
            if(year % 4 && !(year %100 || year %400)){
                return (date <= 29)
            }    
            return (date <=28);
        }
	if(month > 12 || month < 1){
		return false;
	}
        return true;
    },*/
    //Validates the given emailid;
    "isValidEmail" : function(emailId){//No I18N
	if(emailId == "") { return true; }
        var  reg =/^[a-zA-Z0-9]([\w\-\.\+\']*)@([\w\-\.]*)(\.[a-zA-Z]{2,8}(\.[a-zA-Z]{2}){0,2})$/;
        return reg.test(emailId);
    },
    //Validates the web url
    "isValidWebUrl" : function(url){//No I18N
	if(url == "") { return true; }
        var httpProtocol = "http"; //No I18N
        var httpsProtocol = "https"; //No I18N
	var urlregex = new RegExp("^("+httpProtocol+":\\/\\/www.|"+httpsProtocol+":\\/\\/www.|ftp:\\/\\/www.|www.|"+httpProtocol+":\\/\\/|"+httpsProtocol+":\\/\\/|ftp:\\/\\/|){1}[a-zA-Z0-9-\x80-\xFF]+(\\.[a-zA-Z0-9-\\_\\#\\:\\;\\?]+)+(/[\\w-\\;\\-\\*\\._\\?\\,\\:\\'/\\\\\\+&amp;%\\$#\\=~@\x80-\xFF]*)*$");
        return urlregex.test(url);    
    },
    //Used to trim leading and trailing space. 
    "trim" : function(str){//No I18N
        var reg = /^\s+|\s+$/; 
        str = str.replace(reg,"");
        return str;
    },
    "removeEvent" : function(node,eventType,fn){//No I18N
        if(node.removeEventListener)
            node.removeEventListener(eventType,fn,false);
        else
            node.detachEvent("on"+eventType,fn);
        node.removeAttribute("on"+eventType);
        $(node).unbind(eventType,fn);
    },
    //Validate an integers length say len is 2 the value shoule be less than 100. 
    "isValidInteger" : function(val){//No I18N
        //Using Numbering value
        /*var k = 1;
          for(var j=0;j<len;j++)
          { 
          k+= '0';
          } 
          return val < k;*/
        //Using RegExp
        //check whether the value starts with a number
        //Remove all the comma chars and check whether the number is with the given limit
	if(val == "") { return true; }
        var re=/^\d+(,(\d)+)*$/ ; //Should not end with (,)
		//var reg = /\d+/g;
        return re.test(val);
    },
    "attachEvent": function(eventType,elemNode,fn){//No I18N
        $(elemNode)[eventType](function(){
            fn(event);
        });    
    },
    "inViewport":function (el) {//No I18N   
        var Jel = $(el);
        var win = $(window);
        var viewport = {
                top : win.scrollTop(),
                left : win.scrollLeft()
        };
        viewport.right = viewport.left + win.width();
        viewport.bottom = viewport.top + win.height();
        var bounds = Jel.offset();
        bounds.right = bounds.left + Jel.outerWidth();
        bounds.bottom = bounds.top + Jel.outerHeight();
                                    
        return (!(viewport.right < bounds.left || viewport.left > bounds.right || viewport.bottom < bounds.top || viewport.top > bounds.bottom));
	},
	"isValidNumber"	:	function(val,decimalLen){//No I18N
		var reg = /^-?(\d+)(\.)*(\d+)*$/; 
		var valArr = reg.exec(val);	
		if(!valArr)return false;	
		var baseVal = valArr[1];
		var decimalVal = valArr[3];
		if(decimalVal){
			if(decimalLen && decimalVal.length > decimalLen){
				return false;
			}
		}
		return true;
    },
    //Checks whether the given value is decimal, Also checks the length of the base value and decimal points. 
    "isValidDecimal" : function(val,baselen,decimallen){//No I18N
	if(val == "") { return true; }
	var reg = /^(\d+)?(\.)*(\d+)*$/; 
        var valArr = reg.exec(val);
        if(!valArr) return false;    
        var baseVal = valArr[1]; 
        var decimalVal = valArr[3]
        if(baseVal && (!Utils.isValidInteger(baseVal) || baseVal.length > baselen)){
                return false;
	}
        if( decimalVal && (!Utils.isValidInteger(decimalVal,decimallen) || decimalVal.length > decimallen)){
            return false;
        }
        return true;
    },
    "stopEvent" : function(e){//No I18N
        if(!e){var e = window.event;}
        e.cancelBubble = true;
        if(e.stopPropagation){ e.stopPropagation();}
    },
    "getTimeBasedOnUserTimeZone" : function(){//No I18N
        var d = new Date();
        var localTime = d.getTime();
        var localOffset = d.getTimezoneOffset() * 60000;
        var utc = localTime + localOffset;
        var offset  = (Crm.userDetails["TIME_ZONE"])?Crm.userDetails["TIME_ZONE"]:5.5;//No I18N
        return new Date(utc+(36000000*offset));
    },
    "createHTML" : function (obj){//No I18N
	    if(obj["name"] != "text"){
		    var elem = document.createElement(obj["name"]);
	    }else{
		    var textContent = (obj.content)?obj.content:(obj.html)?obj.html:(obj.textContent)?obj.textContent:"";//No I18N
		    var elem = document.createTextNode(textContent);
	    }
	    for(var key in obj){
		    if(/events|child|name|content|textContent/.test(key)){continue;}
		    $(elem)[key](obj[key]);
	    }
	    var eventArr = obj["events"];
	    if(eventArr){
	    	var func = function(ev){//Removed from inside the loop and added out to avoid codecheck
			    var args =[];
			    if($(this).data("args")){
			    	args = args.concat($(this).data("args"));//Array reference is deleted if we get the value from the data. So we are using a new instance.
			    }
			    var fn = $(this).data("fn");
			    if(typeof fn == "function"){
			    	args.unshift(ev,this);
				fn.apply(window,args);
			    }else{
			    	args.unshift(fn,window,ev,this);
			    	Utils.executeFunctionByName.apply("Utils",args);//No I18N
			    }
		    };
		    for(var i=0;i<eventArr.length;i++){
			    var eventObj = eventArr[i];
			    var eventName = eventObj.name;
			    var Jelem = $(elem);
			    Jelem.data("args",eventObj.args);//No I18N
			    Jelem.data("fn",eventObj.fn);//No I18N
			    Jelem[eventName](func);
		    }
	    }
	    if(obj["child"]){
		    var childArr = obj["child"];
		    for(var i=0;i<childArr.length;i++){
			    elem.appendChild(this.createHTML(childArr[i]));
		    }
	    }
	    return elem;

    },
    
"getNearestDateObjectWithGivenInterval" : function(dateObj, interval)//No I18n
{
    var dt = dateObj;
    if (!dt) {
        dt = new Date();
    }
    var min = dt.getMinutes();
    dt.setMinutes( Math.ceil(min / interval) * interval );
    return dt;
},
getTimeStringWithAmPm : function(dateObj)
{
    if (!dateObj) {
        dateObj = new Date();
    }
    var hr = dateObj.getHours();
    var amPm = Utils.getMeridiem(dateObj);
    var min = dateObj.getMinutes();
    var is24HoursFormat =  Crm.userDetails.TIME_FORMAT === "HH:mm";//No I18n
	if(!is24HoursFormat){
		hr = Utils.convertTimeTo12HoursFormat( hr,amPm );
	}
    if(hr < 10) {
        hr = "0" + hr;
    }
    if (min < 10){
        min = "0" + min;
    }
    return {"hrs":hr,"mins": min,"meridiem":amPm};//No I18N
},
 getSelectedNodeFromSelectBox	:	function(selectBox){
    var idx = selectBox.selectedIndex;
    return selectBox.childNodes[idx]; 
 },
 "getMeridiem" : function(dateObj){//No I18n
    var meridiem = "am"; //No I18N
    var hr = dateObj.getHours();
    if(hr >= 12){
        meridiem ="pm"; }//No I18N
    return meridiem;
},
	setPlaceHolder	:	function(Jelem, placeholderValue){
		if(!"placeholder" in Jelem[0] || ($.browser.msie && $.browser.versionNumber <= 9 )){
			var div = document.createElement("div");
			var Jdiv = $( div );
			Jdiv.css("display", "inline-block");//No I18N
			var Jspan = $(document.createElement("div"));
			Jspan.text(placeholderValue);
			Jspan.attr({"class":"color2 ", "style": "opacity:0.6"});//No I18N
			Jdiv.append(Jspan);
			Jdiv.append(Jelem);
			return Jdiv;
		}else{
			Jelem.attr("placeholder", placeholderValue);	//No I18N
		}
		return Jelem;
	},
	createSelectBox	   : function(optionsArray,isMultiSelect,callBackFn,selectAttrObj){
        var selectBox = document.createElement("select");
        $(selectBox).addClass("select");
        (selectAttrObj)?$(selectBox).attr(selectAttrObj):"";
        if(isMultiSelect){
            $(selectBox).attr("multiple","multiple");//No I18N
        }
        if(typeof optionsArray == "function"){
            var s =0;
            while(true){
                var option = document.createElement("option");
                var obj = optionsArray(s);
                if(!obj){
                    break;
                }else {
			var htmlContent = (obj.content)?obj.content:obj.html;
			  var setVal = (obj.value)?obj.value:htmlContent;
              $(option).html(htmlContent).val(setVal);
			var selected = (obj.defaultVal === "true") ? $(option).attr("selected","selected") :" ";//No I18N
			selectBox.appendChild(option);
                }
                s++;
            }
        }else{
            for(var s=0,optionsArrLen = optionsArray.length;s<optionsArrLen;s++){
                var option = document.createElement("option");
                var Joption = $(option);
                if(typeof optionsArray[s] == "object"){
                	if (optionsArray[s].attr) {
                		Joption.attr(optionsArray[s]["attr"]);
                	}
                	if(optionsArray[s]["default"] == "true"){
                		Joption.attr("selected","selected");//No I18N
                	}
			var htmlContent = (optionsArray[s].content)?optionsArray[s].content:optionsArray[s].html;
			var setVal = (optionsArray[s].value)? optionsArray[s].value:htmlContent;
            Joption.html(htmlContent).val(setVal);
                }else{ 
                	Joption.html(I18n.getMsg(optionsArray[s])).val(optionsArray[s]);
                }
                selectBox.appendChild(option);
            }
        }
		if(callBackFn){
			$(selectBox).change(function(){
				var selectedOption = this.getSelectedNode(this);
				callBackFn(selectedOption);
			});
		}
        return selectBox;
    },
    "cloneObject"	:	function(Obj){//No I18N
		/* Will do a deep copy of the given format Object.*/
		var newObj = {};
		for (var key in Obj) {
			var val = Obj[key];
			if (jQuery.isPlainObject(val)) {
				//if the value is one obj we have to clone that obj also.
				val = this.cloneObject(val);
			} else if(jQuery.isArray(val)) {
				var tempClone =[];
				for (j=0;j<val.length;j++) {
					if (jQuery.isPlainObject(val[j])) {
						tempClone.push(this.cloneObject(val[j]));
					} else {
						tempClone.push(val[j]);
					}
				}
				val = tempClone;
			}
			newObj[key] = val;
		}
		return newObj;
	},
 getDateInUserDatePattern	: function(newDate){
		if(!newDate){
			var newDate = new Date();
		}
		var newToDay = newDate.getDate();
		var newMonth = newDate.getMonth();
		var str=newToDay+" "+newMonth+" "+newDate.getFullYear();
		return crmCalendar.convertToUserDatePattern(str);
	},
	"getDateTimeStrInUserPtn" : function(dateObj) {//No I18n
		var dtStr = this.getDateInUserDatePattern(dateObj);
		var timeObj = this.convertTo12HoursFormatTimeObj(dateObj);
		return  dtStr+" "+timeObj.hrs+":"+timeObj.mins+" "+timeObj.meridiem;//No I18n
	},
	"convertTo12HoursFormatTimeObj" : function(dateObj) {//No I18n
    if (!dateObj) {
        dateObj = new Date();
    }
        var hr = dateObj.getHours();
    var amPm = this.getMeridiem(dateObj);
    var min = dateObj.getMinutes();
    hr = Utils.convertTimeTo12HoursFormat( hr, Utils.getMeridiem(dateObj) );    
    if(hr < 10) {
        hr = "0" + hr;
    }
    if (min < 10){
        min = "0" + min;
    }
    return {"hrs":hr,"mins": min,"meridiem":amPm};  //No I18N
},
"convertTo24HoursFormatTimeObj" : function(dateObj) {//No I18n
    if (!dateObj) {
        dateObj = new Date();
    }
        var hr = dateObj.getHours();
    var amPm = this.getMeridiem(dateObj);
    var min = dateObj.getMinutes();
    hr = Utils.convertTimeTo24HoursFormat( hr, Utils.getMeridiem(dateObj) );    
    if(hr < 10) {
        hr = "0" + hr;
    }
    if (min < 10){
        min = "0" + min;
    }
    return {"hrs":hr,"mins": min,"meridiem":amPm};  //No I18N
},
"getRadioValue" : function(name) {//No I18n
	return $("input[type='radio'][name='" + name + "']:checked").val();
},
"getTimeStrForAllDayReminder" : function() {//No I18n
	var dayStartsAt = Crm.calPreferences.DAYSTARTSAT.split(":");//No I18n
	var newDateObj = new Date();
	newDateObj.setHours(parseInt(dayStartsAt[0]) - 1);
	var dateJson = Utils.convertTo12HoursFormatTimeObj(newDateObj);
	var time = parseInt(dateJson.hrs);
	if ( time < 10) {
		dateJson.hrs = dateJson.hrs.substr(1);
	}
	return dateJson.hrs + " " + I18n.getMsg(dateJson.meridiem.toUpperCase()); //No I18n
},
"validateEmailsSepCama" : function(elemId) {//No I18n
	var emailIds = $("#"+elemId).val();
	if ( !emailIds ) {
		return true;
	} 
	var restr="^\w+(([\.!#$%&'\*+=?^_`{|}~-]\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$";//No I18n
	var re=new RegExp(restr);
	if ( emailIds != "" )
	{
		var emailArr = emailIds.split(",");
		for ( var k = 0; k < emailArr.length; k++) {
			var email = trimBoth(emailArr[k]);
			if ( !re.test(email) ) {
				var emailArr = emailIds.split(",");
				alert(I18n.getMsg("crm.email.comma"));
				$("#"+elemId).focus();
				return false;
			}	
		}
		/*if(emailArr.length > 10)
	    {
	        alert("<fmt:message key="crm.workflow.alert.addRecip.limitAlert"><fmt:param>" + 10 + "</fmt:param></fmt:message>");
	        return false;
	    }*/
	}
	return true;
},
"targetElement" : function(e) {//No I18n
		if ( e ) {
		return e.target? e.target: e.srcElement;
		} else {
			return undefined;
		}
	},
	"ShakeDivInfreeze" : function (divId,dir,dist,dur){ //no i18n
		if($("#FreezeLayer")){
			//$("#FreezeLayer").unbind('click'); //when freezeLayer is hidden
			$("#FreezeLayer").click(function(){
				if(!QuickActionSelObj&&(($(window).scrollTop()+$(window).height()-parseInt($("#"+divId).css("top")))<0||($(window).scrollTop()-(parseInt($("#qCreate").css("top"))+parseInt($("#qCreate").height())))>0)){ 				
					$.scrollTo("#"+divId,{axis:'y',duration:1000,offset:-80,onAfter:function(){Utils.shakeAnimation(divId,dir,dist);}}); //No I18N
				    }else{
				Utils.shakeAnimation(divId,dir,dist);
	}
			});	
}
	},
   "shakeAnimation" : function(divId,dir,dist){ //no i18n
	var tem = dist;
		for(var i = 0;i < 4;i++){
			tem = parseInt(tem *-1); 
			if(dir=="left"){ //no i18n
	            if(document.getElementById(divId).style.left.indexOf("%")!==-1){var at = parseInt(tem/10);
	                //var leftVal = parseInt(document.getElementById(divId).style.left)+at+"%";
	                $("#"+divId).animate({left:"+="+at+"%"},100);
	            }else{
			$("#"+divId).animate({left:"+="+tem},100);
	            }
			}else if(dir=="up"){ //no i18n
			$("#"+divId).animate({top:"+="+tem},100);
			}
		}
	},
	"isToday" : function(dateObj) {//NO I18n
		var todayDate = new Date();
		return ( dateObj.getDate() === todayDate.getDate() &&  dateObj.getMonth() === todayDate.getMonth() && dateObj.getFullYear() === todayDate.getFullYear());
	},
	"getDayDiff" : function(endDt, startDt) {//No I18n
		var endtStr = $.datepicker.formatDate("yy-mm-dd", endDt);//No I18n
		var days = 0;
		while ( true ) {
			var stdtStr = $.datepicker.formatDate("yy-mm-dd", startDt);//No I18n
			days ++;
			if ( stdtStr === endtStr) {
				break;
			} else {
				startDt.setDate(startDt.getDate() +1 );
			}
		}
		return days;
	}, 
	"handleDummyLayer" : function(hideOnClick, elemIdToFocus) {//No I18n
		if ( hideOnClick ) {
			hideMenu(event);
			Utils.removeDummyBackground();
		} else {
			if( !$("#Calendar").is(":visible") ) {
			//	$("#eventCreatePopup").effect( "shake", {"direction": 'right', "times":2}, 100 );
				Utils.shakeAnimation(elemIdToFocus,'left',30);//No I18n
			}
		}
		if ( $("#gotoDateContDiv").is(":visible") && $("#Calendar").is(":visible") ) {
			$("#Calendar").hide();
		}
	},
	"dummyBackground" : function(hideOnClick, elemIdToFocus) {//No I18n
		if($("#emptyLayer")[0]){return true;}
		var scrlTop = $(window).scrollTop();
		var wHt = $(window).height();
		var wWid = $(window).width();
		document.documentElement.style.overflow = 'hidden';//No I18n
		var dummyLayer = document.createElement("DIV");
		dummyLayer.id = "emptyLayer";
		dummyLayer.className = "emptyLayer";
		dummyLayer.onclick = function(){Utils.handleDummyLayer(hideOnClick, elemIdToFocus);};
		$(dummyLayer).css({"width":wWid,"height":wHt, "top": scrlTop }).appendTo('body');//No I18n
	},
	"removeDummyBackground" : function() {//No I18n
		//if (document.getElementById("emptyLayer")) {document.body.removeChild(document.getElementById("emptyLayer"));}//No I18n
		$("#emptyLayer").remove();
		if(!$("#FreezeLayer")[0]){		
	  	 	document.documentElement.style.overflow = '';//No I18n
		}
	},
	"isIE8OrBelow" : function() {//No I18n 
		return ($.browser.msie && $.browser.versionNumber <= 8);
	}
}/*To replace the line feed characters which breaks javascript execution*/
Utils.replaceLineFeeds 		= 	function(value){
	var escapeArray=["\\u2028","\\u2029"];//NO I18N
	for(var i=0;i<escapeArray.length;i++){
		var regexp=new RegExp(escapeArray[i],"g");
		value=value.replace(regexp,"");
	}
	return value;
}
/*Replacement pop up for insufficient page */
Utils.displayPermissionDenied		= 	function(Response){	

	var reason=I18n.getMsg("crm.security.error");
	if(typeof Response !== "undefined"){
		reason=$(Response.responseText).filter("#errorMsg").html();//NO I18N
		if(typeof reason === "undefined"){
			reason=I18n.getMsg("crm.security.error");
		}
	}
	$("#ajax_load_tab").hide();
	var dum='<div onclick="sE()" class="w500 p20"><div class="floatL "><img class="iconDenied" src="'+crmConstants.imgStaticPath+'/spacer.gif" alt=""></div><div class="floatL pL20 w430"><div class="f18">'+I18n.getMsg("crm.label.creator.noPermission")+'</div><div class="mT10">'+reason+'</div></div><br class="clearB"><div class="alignright mT20"><input type="button" class="newgraybtn" value="OK"';//NO I18N
	if(!(document.getElementById("iskanbanview") && document.getElementById("iskanbanview").value === "true")){
		dum=dum+'onclick="hide(\'popupnew\');removeFreezeLayer();document.getElementById(\'popupnew\').style.zIndex=30"></div></div>';//NO I18N
	}else{
		dum=dum+'onclick="hide(\'popupnew\');removeFreezeLayer();document.getElementById(\'popupnew\').style.zIndex=30;$(\'#FreezeLayer2\').remove()"></div></div>';//NO I18N
	}
	var popupnew=$("#popupnew")
	//RECRUIT CHANGE - increased z
	popupnew.html(dum).css("z-index","1200");//NO I18N
	mailsetCenter("popupnew");
	$("#Warningdiv").hide();	//To hide when we delete a contact
	freezeBackground();
},
Utils.popUpWithFreeze= function(htmlContent){
	var dum=htmlContent;
	var popupnew=$("#popupnew");
	popupnew.html(dum).css("z-index","200");//NO I18N
	mailsetCenter("popupnew");
	$("#Warningdiv").hide();	//To hide when we delete a contact
	freezeBackground();
	document.getElementById('ajax_load_tab').style.display='none';
	if($("#popupok").length>0){
		//document.activeElement = $("#popupok")[0];
		//document.activeElement.blur();
		document.getElementById("popupok").focus();
	}
	$("#popupnew").click(function(){
		sE(event);
	});
},
/*When the jquery chosen element is within an hidden element , its width will be reset to 0 , a bug in jquery chosen*/
Utils.handleHiddenChosen = function(json){
	json=(typeof json === "undefined")?{".chzn-container" : {"width":"350px"} ,".chzn-drop" : {"width":"350px"} }:json;//NO I18N
	for (var i in json){
		$(i).css(json[i]);
	}
};
Utils.checkForEmailRegeneration = function ( status )
{
    if (status != null && status != 'null' && status == 'true')
        {
            Utils.showLightBox('regenerationMsgDiv'); //No I18N
        }
};
Utils.showLightBox = function ( id )
{
    $('#ajax_load_tab').hide();//No I18N
    $('#' + id).addClass('newPopup p30');//No I18N
    getObj(id).style.zIndex = 21;
    getObj(id).style.position = 'absolute';
    freezeBackground();            
    $('#' + id).show();//No I18N
    mailsetCenter(id);        //No I18N            
};
Utils.saveAcceptableEmails = function ()
{    
    var acceptableEmails = document.getElementsByName( "acceptableEmails" );
    var emailsArr = new Array();
    var email_pattern = /^([A-Za-z0-9_\-\.\+])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    var tempEmailAddress = "";
    
    /* forming a param with the all the emails. */
    for ( var i = 0; i < acceptableEmails.length; i ++)
    {        
        tempEmailAddress = acceptableEmails[i].value.replace(/\s/g, '');
        /* checking a email pattern, if email is entered */
        if ( email_pattern.test( tempEmailAddress ) && tempEmailAddress.length  < 100 )
        {
                emailsArr.push( tempEmailAddress );
        }
        else if ( acceptableEmails[i].value != 'undefined' && tempEmailAddress.length ) 
        {
            alert( I18n.getMsg('bccdropbox.otheremail.addr.invalid') ) ;
            acceptableEmails[i].focus();
            return false;
        }
    }
    
    
    /* if none of the emails are entered and simply save button is clicked, then alert the user and return false. */
    if ( emailsArr.length == 0 )
    {
        alert( I18n.getMsg('bccdropbox.otheremail.addr.empty') ); 
        return false;
    }
    
    //alert (existing_acceptable_emails + "\n" + emailsArr);
    /*Check if there is a change between previous email id list and current one.*/
    if ( existing_acceptable_emails.toString() == emailsArr.toString() ){
        Utils.rearrangeEmailsInTextBox( emailsArr );
        Utils.showNHideSuccessMsg( 'bccAcceptableEmailsSuccessMsg' ); //No I18N
        return false;
    }
    
    /*Check any email id is repeated, if any email id repeated then return false. */
    if ( Utils.isEmailsRepeated( emailsArr ) == true )
    {
        return false;
    }
    
    var posturl = "/crm/BCCDropbox.do"; //No I18N
    var param = "action=saveAcceptableEmails&acceptableEmails="+encodeURIComponent( emailsArr.toString() )+"&"+csrfParamName+"="+encodeURIComponent(csrfToken);//No I18N
    
    $('#ajax_load_tab').show();//No I18N
    $.ajax({
          type: "POST",//No I18N
          url: posturl,
          data: param,//No I18N
          success: function(data) {
                        $('#ajax_load_tab').hide();//No I18N
                        
                        if (data == '100'){// on success
			    existing_acceptable_emails = emailsArr;// from here, existing_acceptable_emails will be updated to new emailsArr, which helps in second time validation.
                            Utils.rearrangeEmailsInTextBox( emailsArr );
                           Utils.showNHideSuccessMsg( 'bccAcceptableEmailsSuccessMsg' ); //No I18N
                        }
                        else if (data == '-1'){// sending request on empty email array by hacking javascript.
                            alert( I18n.getMsg('bccdropbox.otheremail.addr.err') );
                        }                        
                        else{
                            alert( I18n.getMsg('crm.security.error.add.user') );
                        }                        
        },
        error: function(){
                $('#ajax_load_tab').hide();//No I18N                
                alert( I18n.getMsg('crm.security.error.add.user') );
        }
    });
    
};
/*if any email ids in bcc acceptable emails list repated twice or more, then have to alert the user based on that.*/
Utils.isEmailsRepeated = function()
{
    var emailsArr = document.getElementsByName( "acceptableEmails" );
    var abbreviations = [ "st", "nd", "rd", "th", "th" ]; //No I18N
    
    for ( var i = 0; i < emailsArr.length; i++ )
    {
        for ( var j = i + 1; j < emailsArr.length; j++)
        {
            if ( typeof emailsArr[i].value != 'undefined'  &&  typeof emailsArr[j].value != 'undefined' && 
                    emailsArr[i].value.replace(/\s/g,'').length > 0  &&  emailsArr[j].value.replace(/\s/g,'').length > 0 && 
                    emailsArr[i].value == emailsArr[j].value )
            {
                alert ( ( i + 1 ) + abbreviations[i] + " and " +  ( j + 1 ) + abbreviations[j]  + " email address (" + emailsArr[i].value + ") is repeating. Please enter unique Email address in each fields.") //No I18N
                return true;    
            }
        }
    }
    return false;
};
/*if emails were entered in 1st and 4th text box fields in bcc others acceptable email ids list, then email ids will be rearragned in 1st and 2nd fields.*/
Utils.rearrangeEmailsInTextBox = function( emailsArr )
{
    var acceptableEmailsLen = document.getElementsByName( "acceptableEmails" ).length;
    
    for ( var i = 0; i < acceptableEmailsLen; i ++ )
    {
        if ( typeof emailsArr[i] === 'undefined'  || emailsArr[i].length == 0 )
        {
            $( '.addField:last-child' ).remove();
        }
        else
        {
            $( 'input[name="acceptableEmails"]:eq('+i+')' ).val( emailsArr[i] );
        }
    }
        
    if ( $('.addField').length < acceptableEmailsLen )
    {
        $('<td>' + $('#bccDummySpanForRefilling').html() + '</td>').appendTo('.addField:last-child'); //No I18N
    }
};
Utils.triggerBccEmailRegenration = function ( viewedUserId )
{
    var posturl = "/crm/BCCDropbox.do"; //No I18N
    var param = "action=triggerRegeneration&viewedUserId="+viewedUserId+"&"+csrfParamName+"="+encodeURIComponent(csrfToken);//No I18N
    
    $('#ajax_load_tab').show();//No I18N
    $.ajax({
          type: "POST",//No I18N
          url: posturl,
          data: param,//No I18N
          success: function(data) {
                        $('#ajax_load_tab').hide();//No I18N
                        
                        if (data == '100'){// on success
                            $('#triggerBccEmailReGen').hide();//No I18N
                            $('#AfterTriggerringBccEmailReGen').show();//No I18N
                            
                            setTimeout( function () {$('#AfterTriggerringBccEmailReGen').attr('style', '')}, 3000 );
                        }
                        else{
                            alert( I18n.getMsg('crm.security.error.add.user') );
                        }                        
        },
        error: function(){
                $('#ajax_load_tab').hide();//No I18N                
                alert( I18n.getMsg('crm.security.error.add.user') );
        }
    });
};
function attachDocsIntegCallBackFn(jsonResp)
{
    var jsonArr = jsonResp.docObj;
    var docIds = "";
    var docNames = "";
    var services = "";
    var sharedDocIds = "";
    var sharedDocNames = "";
    var sharedServices = "";
    $(jsonArr).each(function(i, value){
        if(value.isDocumentSharedToMe == "true")
        {
            if(value.service == "upload")
            {
                sharedDocIds = (sharedDocIds == "")?value.encryptedId:sharedDocIds + "," + value.encryptedId;
            }
            else
            {
                sharedDocIds = (sharedDocIds == "")?value.docId:sharedDocIds + "," + value.docId;
            }
            sharedDocNames = (sharedDocNames == "")?value.docName:sharedDocNames + "," + value.docName;
            sharedServices = (sharedServices == "")?value.service:sharedServices + "," + value.service;
        }
        else
        {
            docIds = (docIds == "")?value.docId:docIds + "," + value.docId;
            docNames = (docNames == "")?value.docName:docNames + "," + value.docName;
            services = (services == "")?value.service:services + "," + value.service;
        }
    });
    var url = "/crm/jsp/common/status.jsp"; //No I18N
    var idVal = (getObj("entId"))?getObj("entId").value:getObj("id").value;
    var params = "docIds="+docIds+"&docNames="+docNames+"&services="+services+"&id="+idVal+"&sharedDocIds="+sharedDocIds+"&sharedDocNames="+sharedDocNames+"&sharedServices="+sharedServices; //No I18N
    $.ajax({type:"POST", url: url, data:params, success: function(resp){ //No I18N
        var divObj = document.createElement("DIV");
        divObj.style.display="none";
        document.body.appendChild(divObj);
        divObj.innerHTML = resp;
        JSEvalScript(divObj);        
    }});    
}
Utils.updateSearchPattern = function ()
{
    var options = document.getElementsByName("srchPattern"); //No I18N
    var option_len = options.length;
    var selected_option = 0;
    
    for ( var i = 0; i < option_len; i ++ )
    {
        if ( options[i].checked == true )
        {
            selected_option = i + 1;
            
            if (  options[i].value == '3' && $('#createWhichModule').length  )
            {
                selected_option = $('#createWhichModule').val();//No I18N
            }
        }
    }
    
    var posturl = "/crm/BCCDropbox.do"; //No I18N
    var param = "action=updateSearchPattern&selectedOption="+selected_option+"&"+csrfParamName+"="+encodeURIComponent(csrfToken);//No I18N
    
    $('#ajax_load_tab').show();//No I18N
    $.ajax({
          type: "POST",//No I18N
          url: posturl,
          data: param,
          dataType: "json",//No I18N
          success: function(data) {
                        $('#ajax_load_tab').hide();//No I18N
                        
                        if (data.result == '100'){// on success
                            $('#bccDropboxChangePattern').hide();
                            removeFreezeLayer();
                            $('#searchPatternDiv span').html(data.resourceValue);
                            Utils.showNHideSuccessMsg( 'bccSPSuccessMsg' ); //No I18N
                        }
                        else{
                           alert( I18n.getMsg('crm.security.error.add.user') );
                        }                        
        },
        error: function(){
                $('#ajax_load_tab').hide();//No I18N                
                alert( I18n.getMsg('crm.security.error.add.user') );
        }
    });
    
};
/* to show the add another email address link. this another email address is used to add the bccDropbox acceptable email ids list.*/
Utils.addFields = function()
{
    var len = $('tr.addField').length; //No I18N
    if( $('tr.addField').length < 5 )
    {
        ($('tr.addField:eq('+(len-1)+')').clone()).appendTo("#bccDropboxEmailFields"); //No I18N
        $('tr.addField:eq('+(len-1)+')').find('td:last-child').remove();
        $('tr.addField:eq('+len+')').find('input:text').val('');
            
        if( $('tr.addField').length == 5 )
        {
            $('tr.addField:eq('+len+')').find('td:last-child').remove();
        }
    }
};

Utils.showRenegerationSuccessMsg = function()
{
    removeFreezeLayer();
    Utils.showNHideSuccessMsg( 'regenSuccessmsg' ); //No I18N
};
Utils.showNHideSuccessMsg = function ( successMsgDivId )
{
	$.scrollTo( '#basic', {axis:'y',duration:1000,offset:-50} ); //No I18N
	$('#'+successMsgDivId).show();
	
	$("#result").addClass("posRel");
	$('.sarr').hide();
	
	var pos = $("#result").width()/2-$("#succMsgTbl").width()/2;
	$("#succMsgTbl").css( 'left', pos );
	
	setTimeout( 'Utils.callBckAfterSuccessMsgDisp( "'+successMsgDivId+'" )', 3000 );
};

Utils.callBckAfterSuccessMsgDisp = function( successMsgDivId )
{
	$('#'+successMsgDivId).hide(); 
	$("#result").removeClass("posRel"); 
	$('.sarr').show();
};
Utils.removeValFromArray = function(array, val) {
	var res = [];
	if ( array.length === 0 ) {
		res = array;
	} else {
		var idx = array.indexOf(val);
		for (i=0; i<array.length; i++) {
			if ( i !== idx) {
				res.push(array[i]);
			}
		}
	}
	return res;
};
Utils.regenerateBCCEmailAddress = function ()
{
	var params = 'action=regenerate&'+csrfParamName+'='+encodeURIComponent(csrfToken); //No I18N
	loadThisPage('BCCDropbox','BCCDropbox.do','personal', Utils.showRenegerationSuccessMsg, params ); //No I18N
};
Utils.setCookie = function(c_name,Duration){	
	exdate = new Date();
	exdate.setDate(exdate.getDate()+Duration);
	document.cookie = c_name+"=Closed; expires="+exdate.toUTCString();
	};
Utils.updateCookie = function(cname,currvalue,isDelete){
	var openstr = this.getCookie(cname);
	var idTobeStored = currvalue;
	idTobeStored = idTobeStored.replace(/\./gi,'\\.');
	idTobeStored = new RegExp(idTobeStored);
	if((openstr==null)||(openstr=='')){
		if(!isDelete){
			openstr=currvalue;
		}
	}else{  
		if(openstr.search(idTobeStored)>-1 || isDelete){
			openstr = openstr.replace(idTobeStored,'','g');
			openstr = openstr.replace(/,{2,}/gi,',');
			openstr = openstr.replace(/^,/,'');
			openstr = openstr.replace(/,$/,'');
		}else{  
			openstr = openstr +','+ currvalue;
		}
	}
	if(openstr=='' || openstr==null){
		this.deleteCookie(cname);
	}else{
		this.setCookie(cname,openstr);
	}
}
Utils.deleteCookie = function( cookie_name )
{       
	var cookie_date = new Date( );  // current date & time
	cookie_date.setTime(cookie_date.getTime() - 1 );
	document.cookie = cookie_name += "=; expires=" + cookie_date.toGMTString();
}
Utils.getCookie = function(key)
{
var cook = document.cookie;
var c_start = cook.indexOf(" " + key + "=");
if (c_start == -1)
  {
  c_start = cook.indexOf(key + "=");
  }
if (c_start == -1)
  {
  cook = null;
  }
else
  {
  c_start = cook.indexOf("=", c_start) + 1;
  var c_end = cook.indexOf(";", c_start);
  if (c_end == -1)
  {
c_end = cook.length;
}
cook = unescape(cook.substring(c_start,c_end));
}
return cook;
};
Utils.getLength = function(obj) {
	return Utils.getKeys(obj).length;
	
};
Utils.getKeys = function(jsonObj) {
	var keys = [];
	if (!Object.keys) {
		    for (var i in jsonObj) {
		      if (jsonObj.hasOwnProperty(i)) {
		        keys.push(i);
}
		    }
	} else {
		keys = Object.keys(jsonObj);
	}
	return keys;
};
