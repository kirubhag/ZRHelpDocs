//$Id$
var time = 10000;
var TEMPLATEPATH = "/crm/handlebar_templates/";//No I18N

Handlebars.getTemplate = function (folderName, fileName) {
    if (Handlebars.templates === undefined || Handlebars.templates[fileName] === undefined) {
        var url = (folderName != undefined && folderName.length != 0) ? TEMPLATEPATH + folderName + "/" + fileName + '.handlebars' : TEMPLATEPATH + fileName + '.handlebars';
        $.ajax({
            url: url,//No I18N
            dataType: "html",//No I18N
            success: function (data) {
                if (Handlebars.templates === undefined) {
                    Handlebars.templates = {};
                }
                Handlebars.templates[fileName] = Handlebars.compile(data);
            },
            async: false,
            cache: false
        });
    }
    return Handlebars.templates[fileName];
};


$(function(){
	$("body").on("keyup keydown blur", ".textareachk", function(){//No I18N
		var elem = $(this);
		var data = elem.attr("data-textarea");//No I18N
		var value = elem.val();
		value = (value != undefined) ? value.trim() : "";
		var valLen = value.replace(/\n/g, "\n\r").length;
		elem.removeAttr("placeholder");//No I18N
		if(data != undefined && data != null && data != "")
		{
			if(typeof data == "string"){
				data = JSON.parse(data);
			}
			var pastediv = $(data.pastediv);
			if(pastediv == undefined || pastediv == null || pastediv.length == 0){
				pastediv = $(this);
			}
			var errormaxClass = (data.errormaxclass != undefined) ? data.errormaxclass : "error-msg cB ml160";//No I18N
			var errorminClass = (data.errorminclass != undefined) ? data.errorminclass : "error-msg cB ml160";//No I18N
			var insertMethod = data.method;
			var maxLength = parseInt(data.maxlength);
			var minLength = parseInt(data.minlength);

			var remainingCount = parseInt(maxLength) - parseInt(valLen);
			var minCount = parseInt(maxLength - minLength);
			
			var errormaxContent = (data.errormaxcontent != undefined) ? data.errormaxcontent : I18n.getMsg("crm.label.error.maxchar", [remainingCount]);//No I18N
			var errorminContent = (data.errormincontent != undefined) ? data.errormincontent : I18n.getMsg("crm.label.error.minchar", [remainingCount]);//No I18N
			
			var disableBtn = data.disablebtn;
			var disableElem = $('#'+disableBtn);
			
			if(disableElem.length !=0){
				disableElem.removeClass("btn-disable");//No I18N
			}
			$('#maxerrordiv').remove();
			
			if(valLen >= maxLength){
				if(pastediv){
					var errorElem = Utils.createHTML({"name": "span", "attr": {"class": errormaxClass, "id": "maxerrordiv"}, "html": errormaxContent});    //No I18N
					if(insertMethod){
						if(insertMethod == "before"){
							pastediv.before(errorElem);
						}else if(insertMethod == "append"){//No I18N
							pastediv.append(errorElem);
						}else{
							pastediv.after(errorElem);
						}
					}else{
						pastediv.after(errorElem);
					}
					if(disableElem.length !=0){
						disableElem.addClass("btn-disable");//No I18N
					}
					var newVal = value.substring(0, maxLength);
					elem.val(newVal);
				}
			}else if(valLen > minCount){
				if(pastediv){
					var errorElem = Utils.createHTML({"name": "span", "attr": {"class": errorminClass, "id": "maxerrordiv"}, "html": errorminContent});    //No I18N
					if(insertMethod){
						if(insertMethod == "before"){
							pastediv.before(errorElem);
						}else if(insertMethod == "append"){//No I18N
							pastediv.append(errorElem);
						}else{
							pastediv.after(errorElem);
						}
					}else{
						pastediv.after(errorElem);
					}
				}
			}
		}
	});
});
var ZRCommonUtil = {
		ZCMODULEMAP:{"Leads":"Candidates", "Potentials":"Job Openings", "Accounts":"Clients", "Contacts":"Contacts", "Products":"Interviews", "Lead":"Candidate", "Potential":"Job Opening", "Account":"Client", "Contact":"Contact", "Product":"Interview"},//No I18N
		ZRMODULEMAP: {"Candidates": "Leads", "JobOpenings":"Potentials", "Interviews":"Products", "Clients":"Accounts", "Job Openings":"Potentials"},//NO I18N
		ISSOCIALNOTIFIED: false,
		init: function(type){
			if(type == 1) {
				ZRCommonUtil.ZCMODULEMAP.Accounts = "Departments";	//No I18N
				ZRCommonUtil.ZRMODULEMAP.Departments = "Accounts";		//No I18N
			}
		},
		zcModChangeUrl: function(url){ 
			if(url){//Recruit Change
				if(url.indexOf("=Candidates") > -1){
					url = url.replace("=Candidates","=Leads"); 
				}
				if(url.indexOf("=JobOpenings") > -1){
					url = url.replace("=JobOpenings","=Potentials");
				}
				if(url.indexOf("=Interviews") > -1){
					url = url.replace("=Interviews","=Products"); 
				}
				if(url.indexOf("=Clients") > -1){
					url = url.replace("=Clients","=Accounts");
				}
				if(url.indexOf("=Departments") > -1){
					url = url.replace("=Departments","=Accounts");
				}
			}
			return url;
		},
		zrModChangeUrl: function(url){
			if(url){//Recruit Change
				if(url.indexOf("=Leads") > -1){
					url = url.replace("=Leads","=Candidates");
				}
				if(url.indexOf("=Potentials") > -1){
					url = url.replace("=Potentials","=JobOpenings");
				}
				if(url.indexOf("=Products") > -1){
					url = url.replace("=Products","=Interviews");
				}
				if(url.indexOf("=Accounts") > -1){
					var replaceStr = "=" + ZRCommonUtil.ZCMODULEMAP.Accounts;	//No I18N
					url = url.replace("=Accounts", replaceStr);
				}
			}
			return url;
		},
		ajaxUpload: function(url, urlData, callbacks, dataType, synchronous, singleUpload){
			singleUpload = (singleUpload !=undefined && singleUpload != null) ? singleUpload : false;
			$.ajaxUpload(url, urlData, callbacks, dataType, synchronous, singleUpload);
		},
		ajaxFormSubmit: function(url, urlData, docForm, module, singleUpload)
		{
			/**Method modified for RECRUIT****************/
			
			var params = ZRCommonUtil.formData2Query(docForm, urlData, module, singleUpload);
			var queryParams = formData2QueryString(docForm, module);
			var args = "";
			if(queryParams != undefined)
			{
				args = queryParams;
				args += "&newModel=true";//No I18N
			}else{
				args = "newModel=true";//No I18N
			}
			if(module != undefined){
				url = url + "?module=" + module; //No I18N
			}
			var callbacks = {
					success: function(data){
						successCallback(data, url, module, args);
					},
					fail: function(xhr){
						alert(I18n.getMsg("crm.security.error.add.user"));
					}
			};
			singleUpload = (singleUpload !=undefined && singleUpload != null) ? singleUpload : false;
			ZRCommonUtil.ajaxUpload(url, params, callbacks, "html", false, singleUpload);//No I18N
			
			/**Modified method ends****************/
		},		
		formFile2Query: function(formName, data){
			if(data == undefined || data == null){
				data = {};
			}
			var inputElem = $('form[name='+formName+']').find("input[type=file]");
			$.each(inputElem, function(i, item){
				var elem = $(item);
				var name = elem[0].name;
				var fileArr = (data.hasOwnProperty(name)) ? data[name] : [];
				for(var el=0;el<elem.length;el++){
					fileArr.push(elem[el]);
				}
				data[name] = fileArr;
			});
			return data;
		},
		formData2Query: function(docForm, data, module)
		{
			if(data == undefined || data == null){
				data = {};
			}
			
			data[csrfParamName] = encodeURIComponent(csrfToken);
			data["newModel"] = "true";//No I18N
			var formElem;
			var labelchk="Home";//No I18N
			if(module!=undefined)
			{
				labelchk = module.toUpperCase().substring(0,(module.length-1))+"CF";//No I18N
			}

			var re=new RegExp("^"+labelchk);
			var re1=new RegExp("^comboValue");

			for (i = 0; i < docForm.elements.length; i++) {
				formElem = docForm.elements[i];
				var formName = formElem.name;
				var formValue = formElem.value;

				var ifCondnChkvar = (formName != 'module' && formName != 'gsitesList' && formName != 'gsitesName' && formName != 'isShareGsite' && formName != 'fieldname' && formName !='dateFields' && formName != 'fieldlabel' && formName != 'fielddatatype' && formName != 'picklistFields' && formName != 'fieldvalues'  && formName != 'mapValues' && formName != 'fieldName' && formName != 'fieldLabel' && formName != 'fieldDatatype' && formName != 'fieldUitype' && formName != 'fieldId' && formName != 'fieldTableName' && formName != 'fieldLen' && formName != 'dtPtn' && formName != "hdnRowStatus1" && formName != 'focusid' &&formName.indexOf('uiType_')<0 && formName != "" && formName != 'radiobtn' ); //No I18N

				if(module!=undefined){
					ifCondnChkvar = (formName != 'gsitesList' && formName != 'gsitesName' && formName != 'isShareGsite' && formName != 'fieldname' && formName !='dateFields' && formName != 'fieldlabel' && formName != 'fielddatatype' && formName != 'picklistFields' && formName != 'fieldvalues'  && formName != 'mapValues' && formName != 'fieldName' && formName != 'fieldLabel' && formName != 'fieldDatatype' && formName != 'fieldUitype' && formName != 'fieldId' && formName != 'fieldTableName' && formName != 'fieldLen' && formName != 'dtPtn' && formName != "hdnRowStatus1" && formName != 'focusid' && formName.indexOf('uiType_')<0 && !re.test( formName ) && !re1.test( formName ) && formName != ""); //No I18N
				}
				if(ifCondnChkvar)
				{
					switch (formElem.type) {
					// Text, select, password, textarea elements
					case 'text':
					case 'select-one':
					case 'password':
					case 'textarea':
						data[formName] = trimBoth(formValue);
						break;

					case 'hidden':
						data[formName] = formValue; //No need to trim the values of hidden element
						break;

					case 'checkbox':
					case 'radio':
						if ( formElem.checked )
						{
							if(docForm.name == "zloginForm") { 
								data[formName] = encodeURIComponent(formValue); 
							} else {
								data[formName] = formValue;
							}
						}
						break;
					case 'file':
						var currObj = getObj(formName);
						var elem = $(currObj);
						var fileArr = [];
						for(var el=0;el<elem.length;el++){
							fileArr.push(elem[el]);
						}
						data[formName] = fileArr;
						break;
					}
				}
			}
			return data;
		},
		ajaxGetMethod: function(urlval, dataval, asyncval, datatype, pastediv, successFunc, failureFunc){   
			$("#ajax_load_tab").show();
			$.ajax({
				type: "GET",//NO I18N
				url: urlval,
				dataType: datatype,
				data: dataval,
				async: asyncval, 
				success: function(data){
					$("#ajax_load_tab").hide();
					successFunc(data, pastediv);
				}, error: function(xhr){
					$("#ajax_load_tab").hide();
					if(xhr.status !==crmConstants.errorStatusCode){
						if(failureFunc){
							failureFunc(xhr, pastediv);
						}
					}
				}
			});    
		},
		ajaxPostMethod: function(urlval, dataval, asyncval, datatype, pastediv, successFunc, failureFunc){   
			dataval = ZRCommonUtil.convertStringToJson(dataval);
			var csrf_Token = ZRCommonUtil.getCookieValue('crmcsr');//No I18N
			if(csrf_Token && csrf_Token != null){
				dataval[csrfParamName] = csrf_Token;
			}
			$("#ajax_load_tab").show();
			$.ajax({
				type: "POST",//NO I18N
				url: urlval,
				dataType: datatype,
				data: dataval,
				async: asyncval, 
				success: function(data){
					$("#ajax_load_tab").hide();
					successFunc(data, pastediv);
				}, error: function(xhr){
					$("#ajax_load_tab").hide();
					if(xhr.status !== crmConstants.errorStatusCode){
						if(failureFunc){
							failureFunc(xhr, pastediv);
						}
					}
				}
			});    
		},
		successFunction: function(data, pastediv){
			if(pastediv){
				pastediv.hide().html(data).show();    
			}
		},
		failureFunction: function(xhr, pastediv){
			var data = xhr.responseText;
			var json = ZRCommonUtil.convertStringToJson(data);
			if(json && json.message){
				if(json.message === "failure"){
					data = I18n.getMsg("crm.security.error.add.user");
				}else if(json.message === "iamerror"){//No I18N
					data = ZRCommonUtil.iamErrorMessage(json.errorObj);
				}
			}
			if(pastediv){
				pastediv.hide().html(data).show();
			}else{
				alert(data);
			}
		},
		iamErrorMessage: function(json){
			var errorMessage = I18n.getMsg("crm.unable.to.process.request");
			var errorCode = json.errorCode;
			var maxLen = json.maxLen;
			if(errorCode === "XSS_DETECTED" || errorCode === "UNABLE_TO_PARSE_DATA_TYPE" || errorCode === "EXTRA_PARAM_FOUND" || errorCode === "MORE_THAN_MAX_OCCURANCE" || errorCode === "LESS_THAN_MIN_OCCURANCE"){//No I18N
				errorMessage = I18n.getMsg("crm.iam.error.xssdetected");
			}else if(errorCode === "MORE_THAN_MAX_LENGTH"){//No I18N
				errorMessage = I18n.getMsg("crm.iam.error.morethanmaxlength", [maxLen]);
			}else if(errorCode === "URL_RULE_NOT_CONFIGURED"){//No I18N
				errorMessage =  I18n.getMsg("crm.label.error.message1");
			}else if(errorCode === "FILE_SIZE_MORE_THAN_ALLOWED_SIZE"){//No I18N
				errorMessage = I18n.getMsg("zats.error.filesizeismore");
			}else if(errorCode === "PATTERN_NOT_MATCHED"){//No I18N
				errorMessage = I18n.getMsg("crm.alert.label.special.characters");
			}else if(errorCode === "POST_ONLY_URL"){//No I18N
				errorMessage = I18n.getMsg("crm.unable.to.process.request");
			}else if(errorCode === "LESS_THAN_MIN_LENGTH"){//No I18N
				errorMessage = I18n.getMsg("crm.iam.error.lessthanminlength");
			}else if(errorCode === "UNMATCHED_FILE_CONTENT_TYPE"){//No I18N
				errorMessage = I18n.getMsg("crm.label.invalid.attach.alert");
			}else{
				errorMessage = I18n.getMsg("crm.unable.to.process.request");
			}
			return errorMessage;
		},
		getCookieValue: function(cookieName)
		{
			var cookieStr = document.cookie.split(";");
			for(var i=0; i<cookieStr.length; i++)
			{
				var cName = cookieStr[i].split("=");
				if(cookieName.trim() == cName[0].trim())
				{
					return encodeURIComponent(cName[1]);
				}
			}
			return null;
		},
		fetchScrollData: function(elem){
			if(elem && elem.length !=0){
				if(elem.filter(':visible')){
					elem.unbind("scroll").bind("scroll", function(){//No I18N
						var $this = $(this);
						var data = $this.data("scrolldata");//No I18N
						data = (data) ? data : {};
						if(data && typeof data === "string"){
							data = JSON.parse(data);
						}
						var height = this.scrollHeight - $this.height(); // Get the height of the div
						var scroll = $this.scrollTop(); // Get the vertical scroll position
						var isScrolledToEnd = (scroll >= (height-10));
						var callee = data.callee;
						var func = "loadMoreData";//No I18N
						var loadVar = "ISLOADMORE";//No I18N
						var calleeObj = callee.split(".");
						if(calleeObj.length == 2){
							callee = calleeObj[0];
							func = calleeObj[1];
						}else if(calleeObj.length == 2){
							callee = calleeObj[0];
							func = calleeObj[1];
							loadVar = calleeObj[2];
						}else{
							callee = data.callee;
							func = "loadMoreData";//No I18N
							loadVar = "ISLOADMORE";//No I18N
						}
						if(isScrolledToEnd && (data && data.shownext && data.shownext === "true" && !window[callee][loadVar])){
							data.isAppend = "true";
							data.action = "more";
							window[callee][loadVar] = true;
							window[callee][func](data, function(){
								window[callee][loadVar] = false;
							});
						}
					});
				}
			}
		},
		windowScrollData: function(elem){
			if(elem && elem.length !==0){
				$(window).unbind("scroll").bind("scroll", function(){//No I18N
					if($(window).scrollTop() + $(window).height() === $(document).height()) {	
						var data = elem.data("scrolldata");//No I18N
						data = (data) ? data : {};
						if(data && typeof data === "string"){
							data = JSON.parse(data);
						}
						if(data && data.shownext && data.shownext === "true" && !window[data.callee].ISLOADMORE){//No I18N
							data.isAppend = "true";
							data.action = "more";
							window[data.callee].ISLOADMORE = true;
							window[data.callee].loadMoreData(data, function(){
								window[data.callee].ISLOADMORE = false;
							});
						}
					}	
				});
			}
		},
		autoComplete: function(target, dataVal){
			target.find('.ac-block').remove();//No I18N
			
			var autopopFun = function(ev, tgt){
				var params = $(tgt).data("lookup");
				var currObj=getObj(params.fldName);
				
				var fldId = params.fldId;
				var id = fldId;
				if(fldId.indexOf("property(") > -1)
				{
					try{
						var prop_pattern = /property\([a-z]+\:(.*[^)])+/i
							id = fldId.match(prop_pattern)[1].replace(/[^a-z]/ig,'');
					}catch(e){id=new Date().getTime();}		
				}
				var winName="Lookup"+id;//No I18N
				
				var url = "/crm/Search.do?searchmodule="+params.searchmodule+"&fldName="+params.fldName+"&fldId="+params.fldId+"&fldLabel="+params.fldLabel;//No I18N
				if(params.fldValue){
					url = url + "&fldValue="+params.fldValue;//No I18N
				}
				if(params.module){
					url = url + "&module="+params.module; //No I18N
				}
				if(params.potentialid){
					url = url + "&potentialId="+params.potentialid;//No I18N
				}
				if(params.productid){
					url = url + "&productId="+params.productid;//No I18N
				}
				if(params.leadid){
					url = url + "&leadId="+params.leadid;//No I18N
				}
				if(params.productId){
					url = url + "&productId="+params.productId;//No I18N
				}
				openPopUp("lookUpWin", currObj, url, winName, 900, 400,"menubar=no,toolbar=no,location=no,status=no,scrollbars=yes,resizable=yes");//No I18N
			};
			
			var classStr = (dataVal.classStr != undefined) ? dataVal.classStr: "w200";//No I18N
			var blockClass = (dataVal.blockClass != undefined) ? "ac-block " + dataVal.blockClass: "ac-block";//No I18N
			var inputid = dataVal.inputid;
			var inputname = (dataVal.inputname != undefined) ? dataVal.inputname : dataVal.inputid;
			var hiddenid = (dataVal.hiddenid != undefined) ? dataVal.hiddenid : dataVal.inputid+"-hidden";//No I18N
			var emptyId = dataVal.inputid+"-message";//No I18N
			var hiddenname = (dataVal.hiddenname != undefined) ? dataVal.hiddenname : hiddenid;
			var emptyMsg = (dataVal.emptymsg != undefined)? dataVal.emptymsg : I18n.getMsg("crm.potential.addnote.emptymessage");
			
			var clearFun = (dataVal.clearFun) ? dataVal.clearFun : function(ev, tgt, id, hidden, empty){
				$('#'+id).val("").data("selecteditem", "");//No I18N
				$('#'+hidden).val("");
				$('#'+empty).html("").hide();
			};
			
			var createElem = Utils.createHTML({"name":"div", "attr":{"class": blockClass}, "child": //No I18N
				[{"name":"input", "attr":{"type":"text","class":classStr, "id":inputid, "name":inputname}},//No I18N
				 {"name":"input", "attr":{"type":"hidden", "id":hiddenid, "name":hiddenname}},//No I18N
				 {"name":"img", "attr":{"src":"/crm/images/spacer.gif", "class":"OwnerNameLookup", "border":"0", "data-lookup":JSON.stringify(dataVal.lookup)}, "events":[{"name":"click", "fn":autopopFun}]},//No I18N
				 {"name":"img", "attr":{"src":"/crm/images/spacer.gif", "class":"clear_lookupfield", "style":"margin-top:9px;", "border":"0"}, "events":[{"name":"click", "fn":clearFun, "args":[inputid, hiddenid, emptyId]}]},//No I18N
				 {"name":"p", "attr":{"class":"cl fL f11", "style":"color:#900;display:none", "id":emptyId}, "html":"No results found"}//No I18N
			]});
			target.append(createElem);
			
			var urlData = dataVal.params;
			var elem = $("#"+inputid);
			var hiddenElem = $('#'+hiddenid);
			elem.focus();
			
			var minlength = (dataVal.minlength) ? dataVal.minlength : 3;
			var appendElem = (dataVal.appendselector) ? $(dataVal.appendselector) : elem.parent();
			var selectFun = (dataVal.selectFun) ? dataVal.selectFun : function( event, ui ) {
		    	elem.val( ui.item.label).data("selecteditem", ui.item);//No I18N
		    	hiddenElem.val(ui.item.value);
		    	return false;
		    };
		    var focusFun = (dataVal.focusFun) ? dataVal.focusFun : function( event, ui ) {
		    	if(event.which === 40 || event.which === 38){
		    		elem.val( ui.item.label).data("selecteditem", ui.item);//No I18N
		    		hiddenElem.val(ui.item.value);
		    		return false;
		    	}
		    };
		    var searchFun = (dataVal.searchFun) ? dataVal.searchFun : undefined;
		    var closeFun = (dataVal.closeFun) ? dataVal.closeFun : function( event, ui ) {
		    	$('#'+emptyId).html("").hide();
		    };
		    var openFun = (dataVal.openFun) ? dataVal.openFun : function( event, ui ) { 
		    	$('#'+emptyId).html("").hide();
		    	hiddenElem.val("");
		    };
		    var successFun = (dataVal.successFun) ? dataVal.successFun : undefined;
		    var changeFun = (dataVal.changeFun) ? dataVal.changeFun : undefined;
		    var renderFun = (dataVal.renderFun) ? dataVal.renderFun : function( ul, item ) {
		    	return $( "<li>" )
		    	.data( "item.autocomplete", item )//No I18N
		    	.append( $( "<a>" ).text( item.label ) )
		    	.appendTo( ul );
		    };
            var errorFun = (dataVal.errorFun) ? dataVal.errorFun : function(xhr){var data = xhr.responseText; $('#'+emptyId).html(I18n.getMsg("crm.security.error.add.user")).show();};
		    
			elem.autocomplete({
				source: function (request, response)
			    {
					urlData = (urlData === undefined || urlData === null)? {} : urlData;
					urlData["searchtxt"] = request.term;
			        $.ajax(
			        {
			            url: dataVal.url,
			            dataType: "json",//No I18N
			            data: urlData,
			            success: function (data) {
			            	if(successFun != undefined){
			            		successFun(data, response);
			            	}else{
			            		var json = ZRCommonUtil.convertStringToJson(data);
			            		if(json && json.message && json.message === "success"){
			            			var list = json.autoList;
			            			if(list != undefined){
			            				$('#'+emptyId).html("").hide();
			            				response(list);
			            			}else{
			            				$('#'+emptyId).html(emptyMsg).show();
			            			}
			            		}
			            	}
			            }, 
			            error: errorFun
			        });
			    },
			    select: selectFun,
			    focus: focusFun,
			    search: searchFun,
			    close: closeFun,
			    open: openFun,
			    change: changeFun,
			    minLength: minlength,
			    appendTo: appendElem,
			}).data( "ui-autocomplete" )._renderItem = renderFun;//No I18N
			
			elem.keyup(function(){
				var value = $(this).val();
				if(value === undefined || value === null || value === "null" || value.length === 0){
					clearFun(undefined, undefined, inputid, hiddenid, emptyId);
				}
			});
		},
		openDialog: function(divId,freezeClass){
			var elemId = $(divId);
			if(elemId && elemId.length !==0){
				var removeFreeze = (elemId.data("removefreeze") === false) ? false : true; //No I18N
				if(removeFreeze){
					$("#bg-light").remove();
					var oFreezeLayer = document.createElement("div");
					oFreezeLayer.id = "bg-light";
					oFreezeLayer.className = (freezeClass) ? freezeClass : "bg-dark";
					document.body.appendChild(oFreezeLayer);
				}
				ZRCommonUtil.elementPosition(elemId);//No I18N
			}
		},
		createModal: function(params){
			params = ZRCommonUtil.convertStringToJson(params);
			var modalClass = (params && params.modalclass) ? "modal-block " + params.modalclass : "modal-block w500";//No I18N
			var divId = (params && params.modalid) ? params.modalid : "modal-block";//No I18N
			var btnId = (divId) ? divId +"-btn" : "modal-block-btn";//No I18N
			var title = (params && params.title) ? params.title : "";//No I18N
			var description = (params && params.description) ? params.description : "";//No I18N
			var descClass = (params && params.descclass) ? params.descclass : "";//No I18N
			var content = (params && params.content) ? params.content : "";//No I18N
			var saveBtn = (params && params.savebtn) ? params.savebtn : I18n.getMsg("crm.button.save");//No I18N
			var cancelBtn = (params && params.cancelbtn) ? params.cancelbtn : I18n.getMsg("crm.button.cancel");//No I18N
			var saveBtnClass = (params && params.saveclass) ? params.saveclass : "primarybtn";//No I18N
			var cancelBtnClass = (params && params.cancelclass) ? params.cancelclass : "newgreybtn mL5";//No I18N
			var savefn = (params && params.savefn) ? params.savefn : undefined;
			var savearg = (params && params.savearg) ? params.savearg : [];
			var cancelfn = (params && params.cancelfn) ? params.cancelfn : function(ev, target){ 
				var closeDiv = $(target).parents(".modal-block").attr("id");
				ZRCommonUtil.closeDialog(ev, target, "#"+closeDiv); //No I18N
			};
			var closefn = (params && params.closefn) ? params.closefn : cancelfn;
			var cancelarg = (params && params.cancelarg) ? params.cancelarg : [];
			var callback = (params && params.callback) ? params.callback : undefined;
			var callbackarg = (params && params.callbackarg) ? params.callbackarg : undefined;
			var removefreeze = (params && params.removefreeze) ? params.removefreeze : true; 
			var dialog = (params && params.dialog) ? params.dialog : "remove";//No I18N
			
			var createElem = Utils.createHTML({"name":"div", "attr":{"class":modalClass, "id":divId, "data-removefreeze":removefreeze, "data-dialog":dialog}, "child"://No I18N
				[{"name":"a", "attr":{"href":"javascript:void(0)", "class":"close-modal"}, "html":"&times;", "events":[{"name":"click", "fn": closefn}]},//No I18N
				 {"name":"h2", "attr":{"class":"til"}, "html": title, "child"://No I18N
					 [{"name":"span", "attr":{"class":descClass}, "html":description}]//No I18N
				 },
				 {"name":"div", "html":content},//No I18N
				 {"name":"div", "attr":{"class":"btns-block mT20", "id":btnId}, "child"://No I18N
					 [{"name":"input", "attr":{"type":"button", "class":saveBtnClass, "value":saveBtn}, "events":[{"name":"click", "fn": savefn, "args":savearg}]},//No I18N
					  {"name":"input", "attr":{"type":"button", "class":cancelBtnClass, "value":cancelBtn}, "events":[{"name":"click", "fn": cancelfn, "args":cancelarg}]}]//No I18N
				 }]
			});
			$('body').append(createElem);//No I18N
			ZRCommonUtil.openDialog("#"+divId);//No I18N
			if(callback){
				callback(callbackarg);
			}
		},
		createInfoBox: function(params){
			params = ZRCommonUtil.convertStringToJson(params);
			var modalClass = (params && params.modalclass) ? "modal-block " + params.modalclass : "modal-block w350";//No I18N
			var divId = (params && params.modalid) ? params.modalid : "modal-block";//No I18N
			var title = (params && params.title) ? params.title : "";//No I18N
			var content = (params && params.content) ? params.content : "";//No I18N
			var titleClass = (params && params.titleclass) ? params.titleclass : (ZRCommonUtil.isEmpty(content)) ? "til msg" : "til";//No I18N
			var savefn = (params && params.savefn) ? params.savefn : function(ev, target){ 
				var closeDiv = $(target).parents(".modal-block").attr("id");
				ZRCommonUtil.closeDialog(ev, target, "#"+closeDiv); //No I18N
			};
			var savearg = (params && params.savearg) ? params.savearg : [];
			var saveBtnClass = (params && params.saveclass) ? params.saveclass : "newgreybtn mL5";//No I18N
			var saveBtn = (params && params.savebtn) ? params.savebtn : I18n.getMsg("Ok");//No I18N
			var callback = (params && params.callback) ? params.callback : undefined;
			var removefreeze = (params && params.removefreeze) ? params.removefreeze : true; 
			var dialog = (params && params.dialog) ? params.dialog : "remove";//No I18N
			
			var createElem = Utils.createHTML({"name":"div", "attr":{"class":modalClass, "id":divId, "data-removefreeze":removefreeze, "data-dialog":dialog}, "child": //No I18N
				[{"name":"h2", "attr":{"class":titleClass}, "html":title}, //No I18N
				 {"name":"div", "html":content},//No I18N
				 {"name":"div", "attr":{"class":"btns-block"}, "child"://No I18N
					 [{"name":"input", "attr":{"type":"button", "class":saveBtnClass, "value":saveBtn}, "events":[{"name":"click", "fn": savefn, "args":savearg}]}]//No I18N
				 }]
			});
			$('body').append(createElem);//No I18N
			ZRCommonUtil.openDialog("#"+divId);//No I18N
			if(callback){
				callback();
			}
		},
		createConfirmationBox: function(params){
			params = ZRCommonUtil.convertStringToJson(params);
			var modalClass = (params && params.modalclass) ? "modal-block " + params.modalclass : "modal-block w350";//No I18N
			var divId = (params && params.modalid) ? params.modalid : "modal-block";//No I18N
			var title = (params && params.title) ? params.title : "";//No I18N
			var content = (params && params.content) ? params.content : "";//No I18N
			var titleClass = (ZRCommonUtil.isEmpty(content)) ? "til msg" : "til";//No I18N
			var savefn = (params && params.savefn) ? params.savefn : function(ev, target){ 
				var closeDiv = $(target).parents(".modal-block").attr("id");
				ZRCommonUtil.closeDialog(ev, target, "#"+closeDiv); //No I18N
			};
			var savearg = (params && params.savearg) ? params.savearg : [];
			var saveBtnClass = (params && params.saveclass) ? params.saveclass : "redbtn";//No I18N
			var saveBtn = (params && params.savebtn) ? params.savebtn : I18n.getMsg("Delete");//No I18N
			var cancelBtn = (params && params.cancelbtn) ? params.cancelbtn : I18n.getMsg("crm.button.cancel");//No I18N
			var cancelBtnClass = (params && params.cancelclass) ? params.cancelclass : "newgreybtn mL5";//No I18N
			var cancelfn = (params && params.cancelfn) ? params.cancelfn : function(ev, target){ 
				var closeDiv = $(target).parents(".modal-block").attr("id");
				ZRCommonUtil.closeDialog(ev, target, "#"+closeDiv); //No I18N
			};
			var cancelarg = (params && params.cancelarg) ? params.cancelarg : [];
			var callback = (params && params.callback) ? params.callback : undefined;
			var removefreeze = (params && params.removefreeze) ? params.removefreeze : true; 
			var dialog = (params && params.dialog) ? params.dialog : "remove";//No I18N
			
			var createElem = Utils.createHTML({"name":"div", "attr":{"class":modalClass, "id":divId, "data-removefreeze":removefreeze, "data-dialog":dialog}, "child": //No I18N
				[{"name":"h2", "attr":{"class":titleClass}, "html":title}, //No I18N
				 {"name":"div", "html":content},//No I18N
				 {"name":"div", "attr":{"class":"btns-block"}, "child"://No I18N
					 [{"name":"input", "attr":{"type":"button", "class":saveBtnClass, "value":saveBtn}, "events":[{"name":"click", "fn": savefn, "args":savearg}]},//No I18N
					  {"name":"input", "attr":{"type":"button", "class":cancelBtnClass, "value":cancelBtn}, "events":[{"name":"click", "fn": cancelfn, "args":cancelarg}]}]//No I18N
				 }]
			});
			$('body').append(createElem);//No I18N
			ZRCommonUtil.openDialog("#"+divId);//No I18N
			if(callback){
				callback();
			}
		},
		openModal: function(divId){
			var elemId = $(divId);
			if(elemId && elemId.length !==0){
				var removeFreeze = (elemId.data("removefreeze") === false) ? false : true; //No I18N
				if(removeFreeze){
					$("#bg-light").remove();
					var oFreezeLayer = document.createElement("div");
					oFreezeLayer.id = "bg-light";
					oFreezeLayer.className = "bg-dark";
					document.body.appendChild(oFreezeLayer);
				}
				elemId.show();
			}
		},
		removeFreeze: function(){
			var scrid = document.getElementById('bg-light');
			if(scrid){
				document.body.removeChild(scrid);
			}
			var id = document.getElementById('bg-dark');
			if(id){
				document.body.removeChild(id);
			}
		},
		closeDialog: function(ev, target, divId){
			if(divId){
				var elem = $(divId);
				if(elem && elem.length !==0){
					var removeFreeze = (elem.data("removefreeze") === false) ? false : true; //No I18N
					if(removeFreeze){
						ZRCommonUtil.removeFreeze();
					}
					var isHide = (elem.data("dialog") === "hide") ? true : false; //No I18N
					if(isHide){
						elem.hide();
					}else{
						elem.remove();
					} 
				}  
			}
		},
		elementPosition: function(elem){
			var sTop=document.documentElement.scrollTop || document.body.scrollTop;
			var sLeft=document.documentElement.scrollLeft || document.body.scrollLeft;
			if(($(window).height()) > (elem.height())){
				elem.css({'display':'block','position' : 'absolute','left' : '50%','top' : '50%','margin-left' :-(elem.width()/2)+sLeft,'margin-top':-(elem.height()/2)+sTop});//No I18N
			}else{
				var tP=sTop+10;
				elem.css({'display':'block','position' : 'absolute','left' : '50%','top' : tP,'margin-left' :-(elem.width()/2)+sLeft,'margin-top':'0px'});//No I18N
			}
		},
		getPopoverPosition: function(targetElement){
			if(targetElement.length != 0){
				var positionData = ZRCommonUtil.convertStringToJson(targetElement.data("positiondata"));//No I18N
				var modalElem = $(positionData.modal);
				var pmodalElem = $(positionData.pmodal);
				var scrollElem = $(positionData.scroll);
				var placement = positionData.placement;
				placement = (placement)? placement : "left";//No I18N
				
				var pos = ZRCommonUtil.getPosition(targetElement);
				var actualWidth = (modalElem.length !=0) ? modalElem[0].offsetWidth : 0;
		        var actualHeight = (modalElem.length != 0) ? modalElem[0].offsetHeight : 0;
		        
	            var scrollElemTop = (scrollElem.length !=0) ? scrollElem[0].scrollTop : 0;
	            pos.top = pos.top - scrollElemTop;
	            
	            var pmodalTop = (pmodalElem.length != 0) ? ZRCommonUtil.getPosition(pmodalElem).top + 15 : 0;
		        var tp;
		        switch(placement){
		        	case 'bottom':
		        		pos.top = pos.top + pos.height;
		        		pos.left = pos.left + pos.width / 2 - actualWidth / 2;
		        		var arrowTop = actualWidth / 2 - pos.width / 2;
		        		tp = {top: (pos.top < 0) ? pmodalTop : (pmodalTop > pos.top) ? pmodalTop : pos.top, left: pos.left - 10, arrowPos:  (pos.top < 0) ? (arrowTop + pos.top - pmodalTop) : (pmodalTop > pos.top) ? (arrowTop - (pmodalTop - pos.top)): arrowTop};
		            break;
		          case 'top':
		        	  pos.top = pos.top - actualHeight;
		        	  pos.left = pos.left + pos.width / 2 - actualWidth / 2;
		        	  var arrowTop = actualWidth / 2 - pos.width / 2;		       
		        	  tp = {top: (pos.top < 0) ? pmodalTop: (pmodalTop > pos.top) ? pmodalTop : pos.top, left: pos.left - 10, arrowPos: (pos.top < 0) ? (arrowTop + pos.top - pmodalTop) : (pmodalTop > pos.top) ? (arrowTop - (pmodalTop - pos.top)): arrowTop};
		            break;
		          case 'left':
		        	  pos.top = pos.top + pos.height / 2 - actualHeight / 2;
		        	  pos.left = pos.left - actualWidth;
		        	  var arrowTop = actualHeight / 2 - pos.height / 2;
		        	  tp = {top: (pos.top < 0) ? pmodalTop: (pmodalTop > pos.top) ? pmodalTop : pos.top, left: pos.left - 10, arrowPos: (pos.top < 0) ? (arrowTop + pos.top - pmodalTop) : (pmodalTop > pos.top) ? (arrowTop - (pmodalTop - pos.top)): arrowTop};
		            break;
		          case 'right':
		        	  pos.top = pos.top + pos.height / 2 - actualHeight / 2;
		        	  pos.left = pos.left + pos.width;
		        	  var arrowTop = actualHeight / 2 - pos.height / 2;
		        	  tp = {top: (pos.top < 0) ? pmodalTop: (pmodalTop > pos.top) ? pmodalTop : pos.top, left: pos.left + 10, arrowPos: (pos.top < 0) ? (arrowTop + pos.top - pmodalTop) : (pmodalTop > pos.top) ? (arrowTop - (pmodalTop - pos.top)): arrowTop};
		            break;
		          case 'adjustable':
		        	  var diff = pos.top + actualHeight - $(window).height();
		        	  var arrowTop = actualHeight / 2 - pos.height / 2;
		        	  if(diff > 0){
		        		  pos.top =  pos.top  - diff;
		        		  arrowTop = diff;
		        	  }else{
		        		  pos.top = pos.top + pos.height / 2 - actualHeight / 2;
		        	  }
		        	  arrowTop = (pos.top < 0) ? (arrowTop + pos.top - pmodalTop) : (pmodalTop > pos.top) ? (arrowTop - (pmodalTop - pos.top)): arrowTop;
		        	  pos.left = pos.left - actualWidth;
		        	  tp = {top: (pos.top < 0) ? pmodalTop: (pmodalTop > pos.top) ? pmodalTop : pos.top, left: pos.left - 10, arrowPos: arrowTop};
		        	  break;
		          case 'rightadjustable':
		        	  var diff = pos.top + actualHeight - $(window).height();
		        	  var arrowTop = actualHeight / 2 - pos.height / 2;
		        	  if(diff > 0){
		        		  pos.top =  pos.top  - diff;
		        		  arrowTop = diff;
		        	  }else{
		        		  pos.top = pos.top + pos.height / 2 - actualHeight / 2;
		        	  }
		        	  arrowTop = (pos.top < 0) ? (arrowTop + pos.top - pmodalTop) : (pmodalTop > pos.top) ? (arrowTop - (pmodalTop - pos.top)): arrowTop;
		        	  pos.left = pos.left + pos.width;
		        	  tp = {top: (pos.top < 0) ? pmodalTop : (pmodalTop > pos.top) ? pmodalTop : pos.top, left: pos.left + 10, arrowPos: arrowTop};
		        	  break;	  
		        }
		        return tp;
			}
		},
		getPosition: function(element) {
			var htmlElem = element[0];
			var xPosition = findPosX(htmlElem);
			var yPosition = findPosY(htmlElem);
			return { "left": xPosition, "top": yPosition,  "width": htmlElem.offsetWidth, "height": htmlElem.offsetHeight };//No I18N
		},
		divPositionValue: function(divId)
		{       
		        var newValue = {};      
		        var windowHeight = $(window).height();
		        var windowWidth = $(window).width();
		        var scrollTop = $(document).scrollTop();
		        var scrollLeft = $(document).scrollLeft();
		        var divHeight = $(divId).height();
		        var divWidth = $(divId).width();
		                
		        var topPos = new Number(scrollTop)+(new Number(windowHeight)/2-new Number(divHeight)/2);
		        var leftPos = new Number(scrollLeft)+(new Number(windowWidth/2)-new Number(divWidth)/2);
		                
		        newValue["leftLen"] = (leftPos > 0 ? leftPos : 0)+'px';//No I18N
		        newValue["topLen"] = (topPos > 0 ? topPos : 0)+'px';//No I18N
		        return newValue;
		},
		setToCenterOfParent: function( obj, parentObj) 
		{
			var newValue = {};
			var height = $( obj ).height();
			var width = $( obj ).width();
			if ( parentObj == window ) {
				newValue['top'] = ( $( parentObj ).height() / 2 ) - ( height / 2 ) ;
				newValue['left'] = ( $( parentObj ).width() / 2 ) - ( width / 2 );
			}
			else {
				newValue['top'] = ( $( parentObj ).height() / 2 ) - ( height / 2 ) + $( parentObj ).position().top;
				newValue['left'] = ( $( parentObj ).width() / 2 ) - ( width / 2 ) + $( parentObj ).position().left;
			}
			return newValue;
		},
		trim: function(str){
			var value = "";
			if(str != undefined && str != null && str.length != 0){
				value = str.replace(/^\s+|\s+$/g,"");
			}
			return (value);
		},
		isEmpty: function(value) {
			if(typeof value == "string"){
				if(value && value != null && value != "null" && value.length !=0){
					return false;
				}
			}else if(typeof value == "object"){//No I18N
				return $.isEmptyObject(value);
			}else{
				if(value && value != null){
					return false;
				}
			}
			return true;
		},
		convertStringToJson: function(json){
			json = (json) ? json : {};
			if(json && typeof json === "string"){
				json = JSON.parse(json);
			}
			return json;
		},
		attachMoreUpload: function(ev, target, callbackFun){
			var fileElem = $(target);
			var name = fileElem.attr("name");//No I18N
			var attachDetail = fileElem.data("attachdetail");//No I18N
			if(typeof data == "string"){
				attachDetail = JSON.parse(data);
			}
			
			var fileList = $(fileElem)[0].files;
			if(fileList.length > 1){
				//Multiple file
				$.each(fileList, function(i, file){
					var fileName = file.name;
					if(callbackFun){
						callbackFun(fileName, attachDetail, name);
					}
				});
			}else{
				//Single file
				var file = fileList[0];
				var fileName = file.name;
				if(callbackFun){
					callbackFun(fileName, attachDetail, name);
				}
			}
		},
		constructAttachFile: function(fileName, attachDetail, inpName){
			var attachId = attachDetail.attachid;
			var count = attachDetail.count;
			var isBulk = attachDetail.isbulk;
			
			var newcount = parseInt(count)+1;
			var idStr = "theFile_inp_"+attachId+"_"+newcount;//No I18N
			
			fileName = ZRFileUtil.getFileName(fileName);
			if(!ZRCommonUtil.isEmpty(fileName)){
				var dotObj = ZRFileUtil.getAttachDotVal(fileName, "20");
				fileName = dotObj["dotVal"];
				var titleStr = dotObj["title"];
				
				if(isBulk && isBulk === "true"){
					var elem = Utils.createHTML({"name": "span", "attr": {"class": 'attach-file-list', "title": titleStr}, "html": fileName, "child": [{"name": "a", "attr": {"href": "javascript:void(0)"}, "events":[{"name":"click","fn":"ZRCommonUtil.removeAttachment", "args":[attachId, count]}], "html": "X"}]});//No I18N
					$('#theFile_label_'+attachId).append(elem);
					var attachElem = Utils.createHTML({"name":"span", "attr":{"id": idStr}, "child"://No I18N
						[{"name": "a", "attr":{"href":"javascript:void(0)", "class":"btn-browse cus-file"},"html":I18n.getMsg("crm.createform.section.attachmore"),"events":[{"name":"click", "fn":"ZRCommonUtil.triggerAttachClick"}]},//No I18N
						 {"name":"input", "attr":{"class":"file-hide", "style":"display:none", "data-attachdetail": '{"attachid":"'+attachId+'", "count":"'+newcount+'", "isbulk":"'+isBulk+'"}', "type":"file", "name":inpName}, "events":[{"name":"change", "fn":"ZRCommonUtil.attachMoreUpload", "args":[ZRCommonUtil.constructAttachFile]}]}]//No I18N
					});
					$('#theFile_'+attachId).append(attachElem);
					$('#'+idStr).siblings().hide();
				}else{
					var elem = Utils.createHTML({"name": "span", "attr": {"class": 'attach-file-list', "title": titleStr}, "html": fileName});//No I18N
					$('#theFile_label_'+attachId).html(elem);
				}
			}
		},
		removeAttachment: function(ev, target, attachId, count){
			$(target).parent().remove();
			$("#theFile_inp_"+attachId+"_"+count).remove();
			var childElem = $('#theFile_'+attachId).children();
			if(childElem.length == 1){
				childElem.children("a.cus-file").html(I18n.getMsg("crm.createform.section.browse"));//No I18N
			}
		},
		getDotVal: function(value, len){
			var obj = {};
			var dotVal = value;
			var objLen = parseInt(len);
			var titleStr = "";//No I18N
			if(value && value != null && value !="null"){
				if(value.length > objLen){
					dotVal = value.substring(0, objLen);
					dotVal = dotVal + "...";
					titleStr = value;
				}
			}
			obj["dotVal"] = dotVal;
			obj["title"] = titleStr;
			return obj;	
		},
		scrollTo: function(elem){
			$('html,body').animate({scrollTop: elem.offset().top}, 'slow');//No I18N
		},
		openSaveAdvSearch: function(){
			$('.attach-type-pop').remove();
			var createElem = Utils.createHTML({"name": "div", "attr":{"class":"attach-type-pop", "style":"display:none"}, "child"://No I18N
				[{"name": "a", "attr":{"class":"close-confirm", "href":"javascript:void(0);"}, "events":[{"name":"click", "fn":"ZRCommonUtil.closeDialog", "args":['.attach-type-pop']}], "html":"x"},//No I18N
				 {"name":"h4", "attr":{"class":"pop-heading"}, "html":I18n.getMsg("tab.candidates.advancesearch.search.savesearch")},//No I18N
				 {"name":"p", "child"://No I18N
					 [{"name":"label", "html":I18n.getMsg("tab.candidates.advancesearch.search.save")+":"},//No I18N
					  {"name":"input", "attr":{"id":"saveSearchName", "type":"text", "value":"", "class":"textareachk", "data-textarea":"{\"maxlength\": 100, \"minlength\": 50, \"disablebtn\": \"advance_search_add\"}"}}]//No I18N
				 },
				 {"name": "div", "attr":{"class":"btns-block mt50"}, "child"://No I18N
					 [{"name":"a", "attr":{"href":"javascript:void(0)", "class":"btn-click-here", "id":"advance_search_add"}, "html":I18n.getMsg("crm.button.add"), "events":[{"name":"click","fn":"ZRCommonUtil.saveAdvSearch"}]},//No I18N
					  {"name":"text", "html":" "+I18n.getMsg("or")+" "},//No I18N
					  {"name":"a", "attr":{"href":"javascript:void(0)"}, "events":[{"name":"click", "fn":"ZRCommonUtil.closeDialog", "args":['.attach-type-pop']}], "html":I18n.getMsg("Cancel")}]//No I18N
				 }]
			});
			$('#listviewButtonLayerDiv').after(createElem);
			ZRCommonUtil.openDialog('.attach-type-pop');//No I18N
			$('#saveSearchName').focus();
		},
		saveAdvSearch: function(){
			if(document.CreateCustomViewForm && document.CreateCustomViewForm.customviewname){
				var searchName = $('#saveSearchName').val();
				document.CreateCustomViewForm.customviewname.value = searchName;
			}
			if (!emptyCheck("customviewname",I18n.getMsg('tab.candidates.advancesearch.search.save'))){
				return;
			}
			if(document.CreateCustomViewForm){
				validate(false,true);
			}
		},
		parserOnClick: function(id){
			$('#'+id).click();
		},
		importXLSOnClick: function(){
			var values = $("#import_excel_file").val();
			$('#import_xls_filename').html(values).show();
		},
		showAdvSearchQuery: function(){
			if(document.CreateCustomViewForm && document.CreateCustomViewForm.startLimit){
				document.CreateCustomViewForm.startLimit.value = 1;
			}			
			$('#constructAdvSearchId').show();
			$('#ShowCustomViewDetails').hide();
			getElemById("searchbtn").disabled = false;//NO I18N
		},
		fetchRecList : function(startLimit, rangeValue, sortCol){
			//alert('startLimit='+startLimit+' rangeValue='+rangeValue);
			if(startLimit && startLimit!=null && startLimit!=undefined && startLimit!='' && startLimit!='null'){
				if(document.CreateCustomViewForm && document.CreateCustomViewForm.startLimit){
					document.CreateCustomViewForm.startLimit.value = startLimit;
				}else if(document.showcvdetails && document.showcvdetails.startLimit){
					document.showcvdetails.startLimit.value = startLimit;
				}
			}
			if(rangeValue && rangeValue!=null && rangeValue!=undefined && rangeValue!='' && rangeValue!='null'){
				if(document.CreateCustomViewForm && document.CreateCustomViewForm.range){
					document.CreateCustomViewForm.range.value = rangeValue;
				}else if(document.showcvdetails && document.showcvdetails.range){
					document.showcvdetails.range.value = rangeValue;
				}
			}
			if(sortCol && sortCol!=null && sortCol!=undefined && sortCol!='' && sortCol!='null'){
				if(document.CreateCustomViewForm && document.CreateCustomViewForm.sortColumnString){
					var oldSortCol = document.CreateCustomViewForm.sortColumnString.value;
					var oldSortOrder = document.CreateCustomViewForm.sortOrderString.value;
					if(oldSortCol && oldSortCol==sortCol){
						if(oldSortOrder && oldSortOrder=="sort_desc"){
							document.CreateCustomViewForm.sortOrderString.value = "sort_asc";//No I18N
						}else{
							document.CreateCustomViewForm.sortOrderString.value = "sort_desc";//No I18N
						}
					}
					document.CreateCustomViewForm.sortColumnString.value = sortCol;
				}else if(document.showcvdetails && document.showcvdetails.sortColumnString){
					var oldSortCol = document.showcvdetails.sortColumnString.value;
					var oldSortOrder = document.showcvdetails.sortOrderString.value;
					if(oldSortCol && oldSortCol==sortCol){
						if(oldSortOrder && oldSortOrder=="sort_desc"){
							document.showcvdetails.sortOrderString.value = "sort_asc";//No I18N
						}else{
							document.showcvdetails.sortOrderString.value = "sort_desc";//No I18N
						}
					}
					document.showcvdetails.sortColumnString.value = sortCol;
				}
			}
			var module = $("#module").val();
			if(!module){
				module = "Leads";//No I18N
			}
			if(document.CreateCustomViewForm){
				validate(true);
			}else{
				var postData = formData2QueryString(document.showcvdetails);
				doAjaxUpdate("advSearchResult","/crm/ShowSelectedCustomView.do?module="+module+"&isload=false",postData, undefined, true);//No I18N
			}
		},
		printPreviewDivContent : function(divId){
			var divContents = $("#"+divId).html();
            var printWindow = window.open('', '', 'height=400,width=800');
            printWindow.document.write('<html><head><title>DIV Contents</title>');//No I18N
            printWindow.document.write('</head><body >');
            printWindow.document.write("<link href='../css/crmcontemporary.css' rel='stylesheet' type='text/css'>");
			printWindow.document.write("<link href='../css/recruit-style.css' rel='stylesheet' type='text/css'>");
			printWindow.document.write("<div align='center'><input type='button' onclick='window.print()' value='Print Page' class='blueBtn' name='Print'> &nbsp; <input type='button' onclick='window.close()' value='Close' class='blueBtn' name='Close'></div>");
			printWindow.document.write("<div class='advance-search-result'>");
			printWindow.document.write(divContents);
			printWindow.document.write("</div>");
			printWindow.document.write("<div align='center'><input type='button' onclick='window.print()' value='Print Page' class='blueBtn' name='Print'> &nbsp; <input type='button' onclick='window.close()' value='Close' class='blueBtn' name='Close'></div>");
			printWindow.document.write('</body></html>');
            printWindow.document.close();
		},
		fetchNaviSearchDetail : function(obj){
			var isSearch = obj["isSearch"];
			if(isSearch && isSearch=="true"){
				var fetchRecordId = obj["id"];
				var naviDataArrLen = parseInt(0);
				var naviDataArrIter = "";
				if(naviDataArr && naviDataArr.trim()!=""){
					naviDataArrIter = naviDataArr.split(",");
					naviDataArrLen = naviDataArrIter.length;
				}
				var prevRecord = "0";
				var nextRecord = "0";
				if(naviDataArrLen==0){
					ZRCommonUtil.fetchNaviData(obj, naviDataArrIter, naviDataArrLen, prevRecord, nextRecord, 0);
					return;
				}
				for(var i=0;i<naviDataArrLen;i++){
					var tempId = naviDataArrIter[i];
					if(tempId && tempId!="undefined" && tempId != null && tempId!="null" && tempId.trim()!="" && fetchRecordId && fetchRecordId!="undefined" && fetchRecordId != null && fetchRecordId!="null" && fetchRecordId.trim()!="" && fetchRecordId == tempId){
						if(naviDataArrLen==i+1){
							ZRCommonUtil.fetchNaviData(obj, naviDataArrIter, naviDataArrLen, prevRecord, nextRecord, i);
						}else{
							if(i<naviDataArrLen-1){
								nextRecord = naviDataArrIter[i+1];
							}
							if(i>0){
								prevRecord = naviDataArrIter[i-1];
							}
							obj["nextRecord"] = ""+nextRecord;//No I18N
							obj["prevRecord"] = ""+prevRecord;//No I18N
							obj["isRecSearch"] = "true";//No I18N
						}
						break;
					}
				}
			}
		},
		fetchNaviData: function(obj, naviDataArrIter, naviDataArrLen, prevRecord, nextRecord, i){
			if(naviAdvDataUrl==undefined || naviAdvDataUrl==""){
				return;
			}
			var urlToFetch = naviAdvDataUrl+"?"+decodeURIComponent(naviAdvDataParams);
			var parsedUrlObj = Utils.parseUrl(urlToFetch);
			var paramsObj = parsedUrlObj["params"];
			
			var urlData = {};
			if(paramsObj!=undefined){
				paramsObj["startLimit"]=naviDataArrLen+1;
				paramsObj["range"]=100;
				paramsObj["module"]=obj["module"];
				
				if(paramsObj["sModules"]){
					paramsObj["sModules"]=obj["module"];
				}
				if(paramsObj["searchCategory"]){
					paramsObj["searchCategory"]="";//No I18N
				}
				paramsObj.fetchPkOnly="true";//No I18N
				naviAdvDataParams = "";
				for(var key in paramsObj){
					if(typeof(paramsObj[key]) && typeof(paramsObj[key])!=null && typeof(paramsObj[key])!="" && typeof(paramsObj[key])!="undefined"){
						urlData[key] = paramsObj[key];
					}
				}
			}else{
				urlData.startLimit = naviDataArrLen+1;
				urlData.range = "100";//No I18N
				urlData.module = obj.module;
				urlData.fetchPkOnly = "true";//No I18N
			}
			
			ZRCommonUtil.ajaxPostMethod(naviAdvDataUrl, urlData, false, "html", undefined, function(data){//No I18N
        		if(naviDataArr!=undefined && naviDataArr==""){
        			naviDataArr = data;
        		}else if(naviDataArr!=undefined && !naviDataArr.contains(data)){
        			naviDataArr = naviDataArr+","+data;
        		}
				if(naviDataArr && naviDataArr.trim()!=""){
					naviDataArrIter = naviDataArr.split(",");
					naviDataArrLen = naviDataArrIter.length;
				}
				if(i<naviDataArrLen-1){
					nextRecord = naviDataArrIter[i+1];
				}
				if(i>0){
					prevRecord = naviDataArrIter[i-1];
				}
				obj["nextRecord"] = ""+nextRecord;//No I18N
				obj["prevRecord"] = ""+prevRecord;//No I18N
				obj["isRecSearch"] = "true";//No I18N
			}, function(){});
		},
		triggerAttachClick: function(ev, target){
			$(target).next('.file-hide').click();
		},
		preventDefault: function(event) {
			event = event || window.event;
			if (event.preventDefault){
				event.preventDefault();
			}
			event.returnValue = false;  
		},
		showSuccessMessage: function(successMsg){
			getObj("bulkUpdateSuccess").innerHTML = successMsg;
            show("bulkUpdateSuccess");
            mailsetCenter("bulkUpdateSuccess");
            setTimeout(function(){hide("bulkUpdateSuccess");},1000);
		},
		openConfirmationAlert: function(params, callee, args, cancelCallee, cancelArgs){
			var removefreeze = (params && params.removefreeze) ? params.removefreeze : true;
			var dialog = (params && params.dialog) ? params.dialog : "remove";//No I18N
			var title = (params && params.title) ? params.title : I18n.getMsg("crm.image.delete.confirm");
			var content = (params && params.content) ? params.content : "";
			var yesBtn = (params && params.yesbutton) ? params.yesbutton : I18n.getMsg("crm.button.ok");
			var noBtn = (params && params.nobutton) ? params.nobutton : I18n.getMsg("crm.button.close");
			var yesBtnClass = (params && params.yesclass) ? params.yesclass : "btn-click-here";//No I18N
			var classname = (params && params.classname) ? "delete-confirm bsd "+ params.classname : "delete-confirm bsd";//NO I18n
			var headerTag = (params && params.headerTag) ? params.headerTag : "h4";//NO I18n
			var headerClass = (params && params.headerClass) ? params.headerClass : "delete-confirm-title";//NO I18n
			
			if(!cancelCallee){
				cancelCallee = "ZRCommonUtil.closeDialog";//NO I18n
				cancelArgs = ['.delete-confirm'];//NO I18n
			}
			
			var createElem = Utils.createHTML({"name":"div", "attr":{"class":classname, "data-removefreeze":removefreeze, "data-dialog":dialog}, "child": //No I18N
				[{"name":headerTag, "attr":{"class":headerClass}, "html": title}, //No I18N
				 {"name": "div", "html":content}, //No I18N
				 {"name":"div", "attr":{"class":"delete-btns-block"}, "child": //No I18N
					 [{"name":"a", "attr":{"class":yesBtnClass, "href":"javascript:void(0)", "style":"padding:5px 20px; margin-right:10px"}, "events":[{"name":"click", "fn": callee, "args":args}], "html":yesBtn+" "}, //No I18N
					  {"name":"a", "attr":{"href":"javascript:void(0)","class":"newgreybtn"}, "events":[{"name":"click", "fn":cancelCallee, "args":cancelArgs}], "html":noBtn}] //No I18N
				 }]
			});
			$("body").append(createElem);
			ZRCommonUtil.openDialog('.delete-confirm');//No I18N
		},
		applyNameSort: function(json, keyName){
			if(json && keyName){
				if(json.length <= 100){
					json.sort(function(a, b){
						var nameA=a[keyName].toLowerCase(), nameB=b[keyName].toLowerCase();
						if (nameA < nameB){//sort string ascending
							return -1;
						} 
						if (nameA > nameB){
							return 1;
						}	
						return 0 ;//default return value (no sorting)
					});
				}
			}
		},
		getPickListValue: function(params, callbackFun, errorFun){
			var urlData = "fieldid="+params.fieldid+"&mode=combovalue&module="+params.module;//No I18N
			ZRCommonUtil.ajaxGetMethod("/crm/getPicklistValue.do", urlData,  false, "html", undefined, function(json, pasteDiv){ //No I18N
				json = ZRCommonUtil.convertStringToJson(json);
				if(callbackFun){
					callbackFun(json);
				}
			}, function(xhr, pasteDiv){
				var json = ZRCommonUtil.convertStringToJson(xhr.responseText); 
				if(errorFun){
					errorFun(json);
				}
			});
		},
		massUpdate: function(params, callbackFun, errorFun){
			var urlData = {};
			urlData.module = params.module
			urlData.mode = "massupdate";//No I18N
			urlData.fieldid = params.fieldid;
			urlData.fieldvalue = params.fieldvalue;
			urlData.pkid = params.pkid;
			urlData.action = params.action;
			urlData.fromindex = params.fromindex;
			urlData.filterby = params.filterby;
			urlData.jobid = params.jobid;
			urlData.searchtxt = params.searchtxt;
			ZRCommonUtil.ajaxPostMethod("/crm/MassUpdateFieldValue.do", urlData,  false, "html", undefined, function(json, pasteDiv){ //No I18N
				json = ZRCommonUtil.convertStringToJson(json);
				if(callbackFun){
					callbackFun(json);
				}
			}, function(xhr, pasteDiv){ 
				if(errorFun){
					errorFun(xhr, pasteDiv);
				}else{
					ZRCommonUtil.failureFunction(xhr, pasteDiv);
				}
			});
		},
		getTemplateDetail: function(templateId, callbackFun, errorFun){
			var selectedClient = $('input[name="compose-client-list-hidden"]').val();
			var urlData = undefined;
			if(selectedClient){
				urlData = "templateid="+templateId+"&mode=getTemplateDetail&selectedClient="+selectedClient;//No I18N
			}else{
				urlData = "templateid="+templateId+"&mode=getTemplateDetail";//No I18N
			}
			
			ZRCommonUtil.ajaxGetMethod("/crm/GetTemplateDetail.do", urlData,  false, "html", undefined, function(json, pasteDiv){ //No I18N
				json = ZRCommonUtil.convertStringToJson(json);
				if(callbackFun){
					callbackFun(json);
				}
			}, function(xhr, pasteDiv){
				var json = ZRCommonUtil.convertStringToJson(xhr.reponseText);
				if(errorFun){
					errorFun(json);
				}
			});
		},
		setEditorDetail: function(type, params){
			var mode = (params && params.mode) ? params.mode : "1";
			var content = (params && params.content) ? params.content : "";
			var modVal = (mode != undefined && mode != null && mode == "1") ? "richtext" : "plaintext";//No I18N
			var editor = window[type];
			if(typeof editor !== "undefined"){ //No I18N
                editor.setContent(content);
                editor.setMode(modVal);
			}else{
				ZRCommonUtil.createEditor(type, params);
			}
		},
		createEditor: function(type, params){
			var idName = (params && params.id) ? params.id : "";
			var mode = (params && params.mode) ? params.mode : "1";
			var content = (params && params.content) ? params.content : "";
			var editorheight = (params && params.editorheight) ? params.editorheight : "";
			var onlyEditor = (params && params.onlyeditor) ? params.onlyeditor : false;
			var textarea = (params && params.textarea) ? params.textarea : "textarea_"+idName;//No I18N
			var input = (params && params.input) ? params.input : "input_"+idName;//No I18N
			var modVal = (mode != undefined && mode != null && mode == "1") ? "richtext" : "plaintext";//No I18N
			
			window[type] = undefined;
			var initobject = {id : idName, mode: modVal, content: content, editorheight:editorheight}; //No I18N
			window[type] = ZE.create(initobject);
			if(!onlyEditor && textarea != null && textarea.length !=0){
				var createElem_textarea = Utils.createHTML({"name":"textarea", "attr":{"style":"display:none", "name":textarea, "id":"textarea_"+type,"value":content}});//No I18N
				var createElem_input = Utils.createHTML({"name":"input", "attr":{"name":input, "type":"hidden", "id":"input_"+type}});//No I18N
				var divId = document.getElementById(idName);
				if(divId && divId!=undefined){
					divId.parentNode.appendChild(createElem_textarea);
					divId.parentNode.appendChild(createElem_input);
				}
			}
		},
		getEditorDetail: function(type){
			var editorObj = ZRCommonUtil.getEditorDetailAsJson(type);
			
			var contentId = document.getElementById("textarea_"+type);
			if(contentId && contentId!=undefined){
				contentId.value=editorObj.content;
			}
			var templateTypeId = document.getElementById("input_"+type);
			if(templateTypeId && templateTypeId!=undefined){
				templateTypeId.value=editorObj.type;
			}
			
			if(contentId.value == undefined || contentId.value == null || contentId.value.trim() == ""){
				 contentId.value = "<br>";//NO I18n
				 templateTypeId.value = "1";//NO I18n
			} 
		},
		getEditorDetailAsJson: function(type){
			var editorObj = {};
			var templateType = "1";
			var content = "";//No I18N
			var editor = window[type];

			var contentMode = "richtext";//No I18N
			if(typeof editor !== "undefined"){ //No I18N
				contentMode = editor.mode;
			}
			if(contentMode!==null && contentMode==="plaintext"){ //No I18N
				templateType = "2";
			}
			if(typeof editor !== "undefined"){ //No I18N
				content = editor.getContent();
			}
			editorObj.content = content;
			editorObj.type = templateType;
			return editorObj;
		},
		checkLength: function(fieldId,maxCount,message,errDiv){
			var tempBodyLen = $(fieldId).val().length;
			message = message.replace("$maxcount", maxCount);
			var errDivClass = "green";//NO I18n
			if(tempBodyLen >= maxCount){
				errDivClass = "red";//NO I18n
				message = message.replace("$count", maxCount);
			}else{
				message = message.replace("$count", tempBodyLen);
			}
			$(errDiv).attr("class",errDivClass).html(message);//NO I18n
			return false;
		},
		userActivityView: function(sIndex){
			var useractivityobj = document.getElementById("useractivitydrop");
			userid=useractivityobj.value;
			if(userid=="All"){
				userid = null;
			}
			var created = getObj("activity_createdtime").value ;
			var typefilter = getObj("activity_type").value ;
	        var userActivityUrl="/crm/ActivityLog.do?userid="+userid+"&createdtime="+created+"&activitytype="+typefilter+"&activityIndex="+sIndex;//No I18N
	    	new mR(userActivityUrl,function(t)
	         {
            	 var resText=t;
            	 if(sIndex=="0"){
            		 getObj("activityLogBlock").innerHTML="";
            		 getObj("activityLogBlock").innerHTML=getObj("activityLogBlock").innerHTML+resText;
            	 }else{
            		 getObj("activityLogBlock").innerHTML=getObj("activityLogBlock").innerHTML+resText;
            		 activitycntcheck ="0";
            	 }
	    	});
		},
		entityActivityView: function(entityID, sIndex,module,resumeId,popupActivity){
			var userActivityUrl="";
			if(resumeId && resumeId !== "null"){
				userActivityUrl = "/crm/DetailPageActivity.do?activityIndex="+sIndex+"&entityId="+entityID+"&module="+module+"&resumeId="+resumeId;//No I18N
			}else{
				userActivityUrl = "/crm/DetailPageActivity.do?activityIndex="+sIndex+"&entityId="+entityID+"&module="+module;//No I18N
			}
			
			if(popupActivity && popupActivity === "popupActivity"){
				userActivityUrl +="&activityType=popupActivity";//No I18N
			}
	    	new mR(userActivityUrl,function(t)
	         {
	    		var resText=t;
	    		if(popupActivity && popupActivity === "popupActivity"){//NO i18N
	    			 getObj("ass_cand_activity").innerHTML="";
	           		 getObj("ass_cand_activity").innerHTML=resText;
	    		}else{
	           		 getObj("activityDetails").innerHTML="";
	           		 getObj("activityDetails").innerHTML=resText;
	    		}
	    			
            	 
	    	});
		},
		showbulkactivity: function(pkid, module, page){
			var constructval;
			var historyval;
			if(page=="setup"){
				if(document.getElementById('setupcomment_'+pkid).style.display == "block"){
					document.getElementById('setupcomment_'+pkid).style.display = "none";
					return;
				}
			}else {
				if(document.getElementById('activitynote_'+pkid).style.display == "block"){
					document.getElementById('activitynote_'+pkid).style.display = "none";
					return;
				}
			}
			var url = "/crm/ShowBulkActivity.do";//No I18N
				ZRCommonUtil.ajaxGetMethod("/crm/ShowBulkActivity.do", "activityid="+pkid+"&module="+module,  true, "json", undefined, function(json, pasteDiv){ //No I18N
				var comments = "";
				if(json){
					$.each(json, function(i,item){
							var id = item.id;
							var value = item.value;
							//var historyval = item.historyvalue;
							var link = "";//No I18N
							if(page=="setup"){
								link = "<a  href='/crm/EntityInfo.do?module="+module+"&id="+id+"' target='_blank'>"+value+"</a>";//No I18N
							}else{
								link = "<a  href='/crm/EntityInfo.do?module="+module+"&id="+id+"' data-cid='detailView' data-params='{\"module\":\""+module+"\",\"id\":\""+id+"\",\"pfrom\":\"rel\",\"lookback\":\"true\"}'>"+value+"</a>";//No I18N
							}
							if(constructval==null){
								constructval= link;
							}else {
								constructval+= ", " + link;
							}
					});
				}
				//$('#setupcomment_'+pkid).removeClass("commentdetails");
				if(page=="setup"){
					$('#setupnote_'+pkid).html(constructval).toggle();
					//document.getElementById('setupnote_'+pkid).style.display = "block";
				}else {
					$('#activitynote_'+pkid).html(constructval).toggle();
					//document.getElementById('activitynote_'+pkid).style.display = "block";
				}
			}, function(xhr, pastediv){
			//	$('#dash_comment_show_'+pkid).html("<div class='redmessage'>"+xhr.responseText+"</div>");
				//document.getElementById('dash_comment_show_'+pkid).style.display = "block";
			});
		},recentcomments: function(id, page){
			if(page=="setup"){
				$('#setupcomment_'+id).toggle();
			}else{
				$('#activitycomment_'+id).toggle();
			}
		},
		setCheckboxValue: function(target){
			var tgt = $(target);
			if(tgt.is(":checked")){
				tgt.val("true");
			}else{
				tgt.val("false");
			}
		},
		unlockandqualifypopup: function(event){
	    var tgt = $(event.target);
	    var pkid = tgt.data("pkid");//No I18N
	    var listview = tgt.data("listview");//No I18N
	    var assPopOutView = tgt.data("asspopview");//NO I18n
	    var module = tgt.data("module");//No I18N
	    if(! listview){
	        listview = false;
	    }
	    
	    if(!assPopOutView){
	    	assPopOutView = false; 
	    }
	    var title;
	    var type;
	    var arrowclass = "qcRight";//No I18N
	    if(tgt.is("a.icon-disq") || tgt.is("a.icon-disq-active")){
	        title = I18n.getMsg("crm.leads.qualify");
	        type = "disq";//No I18N
	        arrowclass = "qcLeft";//No I18N
	    }else if(tgt.is("a.icon-lock") || tgt.is("a.icon-lock-active")){//No I18N
	        title = I18n.getMsg("crm.leads.unlock");
	        type = "lock";//No I18N
	        arrowclass = "qcLeft";//No I18N
	    }else if(tgt.is("input#Follow_btn.fbtn") || tgt.is("input#Follow_btn_asspop.fbtn") || tgt.is("input#Follow_btn_asspop") ){//No I18N
	        title = tgt.val();
	        type = tgt.data("type");//No I18N
	        arrowclass = "qcRight";//No I18N
	    }else if(tgt.is("input#Follow_btn")) {//No I18N
	    	title = tgt.val();
	    	type = tgt.data("type");	//No I18N
	    	arrowclass = "qcRight";//No I18N
	    }
	    $('.notes-block').remove();
	    var cancelFun = function(){
	        $('.notes-block').remove();
	    };
	    var createElem = Utils.createHTML({"name": "div", "attr":{"class": "notes-block"}, "child"://No I18N
	        [{"name": "div", "attr":{"class":"qcpopuparrow "+arrowclass}},//No I18N
	         {"name":"h6", "attr":{"class":"cmnt-heading"}, "html":title},//No I18N
	         {"name":"textarea", "attr":{"placeholder": I18n.getMsg("crm.potential.associate.popout.entercomments"), "class":"textareachk", "data-textarea":'{"maxlength": 6000, "minlength": 100, "method": "after"}', "id":"hot-comment", "value":""}, "html":""},//recruit changes //No I18N 
	         {"name":"input", "attr":{"type":"button", "class":"btn mR10", "data-pkid":pkid, "data-module":module, "data-listview":listview, "data-asspopview":assPopOutView,"data-type":type, "value":I18n.getMsg("crm.button.add")}, "events":[{"name":"click", "fn":"ZRCommonUtil.unlockandqualifyajax"}]},//No I18N
	         {"name":"a", "attr":{"class":"fbllink", "href":"javascript:void(0);"}, "events":[{"name":"click", "fn":cancelFun}], "html":I18n.getMsg("crm.button.cancel")}]//No I18N
	    });
	    $("body").append(createElem);
	    var pasteDiv = $('.notes-block');
	    var pos = (tgt) ? ZRCommonUtil.getPopoverPosition(tgt) : {};
	    if(pos){
	        pasteDiv.css({
	            "top": pos.top+"px", //No I18N
	            "left": pos.left+"px" //No I18N
	        });
	        if(listview){
	            pasteDiv.children("."+arrowclass).css({"top":pos.arrowPos+"px", "left":"-12px"});//No I18N
	        }else{
	            pasteDiv.children("."+arrowclass).css({"top":pos.arrowPos+"px", "right":"-12px"});//No I18N
	        }
	        
	    }
	},
	unlockandqualifyajax: function(event){
	    var tgt = $(event.target);
	    var type = tgt.data("type");//No I18N
	    var status ;
	    var typeid;
	    var module = tgt.data("module");//No I18N
	    if(module === "Leads"){
	    	if(type === "lock"){
		        status = "Hired";//No I18N
		        typeid = "#icon-lock-";//No I18N
		    }else if(type === "disq"){//No I18N
		        status = "Qualified";//No I18N
		        typeid = "#icon-disq-";//No I18N
		    }
	    }else if(module === "Potentials"){//No I18N
	    	if(type === "lock"){
		        status = "In-Progress";//No I18N
		        typeid = "#icon-lock-";//No I18N
		    }
	    }
	    var pkid = tgt.data("pkid")+"";//No I18N
	
	    var textarea = document.getElementById("hot-comment").value;
	    var listview = tgt.data("listview");//No I18N
	    var assPopOutView = tgt.data("asspopview");//NO I18n
	    var urlData = "module="+module+"&entityId="+pkid+"&comments="+textarea+"&status="+status+"&listview="+listview+"&action=open";//No I18N
	
	    ZRCommonUtil.ajaxGetMethod("/crm/UpdateResumeStatus.do", urlData,  false, "html", undefined, function(json){ //No I18N
	        json = ZRCommonUtil.convertStringToJson(json);
	        if(json && json.message && json.message == "success"){
	            $("#change-status-popup, .notes-block").hide();
	            if(assPopOutView){
	            	$(typeid+pkid).remove();
	            	$("li[data-candidateid="+pkid+"]").prepend('<input type="checkbox" class="allchk" data-resumeid="'+pkid+'">');
	            	$("#ass-cand-list-status-"+json.entityId).html(json.status);
	            	if($("li[data-candidateid="+pkid+"]").hasClass("active")){
		            	var jobId = $("input#Follow_btn_asspop").data("jobid");
		            	ZRAssociateUtil.loadAssociateDetail(jobId, pkid);
	            	}
	            }else if(listview){
	                var name = $("#listView_"+pkid).html();
	                var tdElem = $(typeid+pkid).parent();
	                tdElem.html('<input type="checkbox" value="'+pkid+'&&||'+name+'" name="chk">');
	            }else{
	            	var url = "/crm/ShowEntityInfo.do?id="+getObj("id").value+"&module="+getObj("module").value+"&cvid="+getObj("cvid").value+"&recordNum="+getObj("recordNum").value;//No I18N
	            	doAjaxUpdate("show",url);//No I18N
	            }
				ZRCommonUtil.showSuccessMessage(I18n.getMsg("crm.label.success.status"));
				clearShowCacheObj("tab_"+module);//No I18N
	        }
	    }, function(xhr){
	    	var json = xhr.responseText;
	    	json = ZRCommonUtil.convertStringToJson(json);
	        if(json && json.message && json.message === "failure"){
	            alert(I18n.getMsg("crm.error.changestatus"));
	        }else if(json && json.message && json.message === "FLEEMessageIAR"){//No I18N
	        	alert(I18n.getMsg(json.fmtkey_fleeMessage, [json.edition, json.featureLimitCount, json.featureType]));
	        }
	    });
	},
	recentstatuseditoverload: function(event, tgt, isRowExist, status){
		ZRCommonUtil.recentstatusedit(event.target, isRowExist, status);
	},
	recentstatusedit: function(obj, isRowExist, status, leadStatus){
	    var tgt = $(obj);
	    if(typeof isRowExist === "String"){
	        isRowExist = Boolean(isRowExist);
	    }
	    var pkid = tgt.data("pkid");//No I18N
	    var module = tgt.data("module");//No I18N
	    var pid, pname;
	    if(isRowExist){
	    	pid = $("#jo-id").val();
		    pname = $("#jo-name").val();
	    }
	    var title1 = I18n.getMsg("crm.potential.relatedlist.changestatus");
	    var title2 = I18n.getMsg("Potential");
	    var liStr = "";
	    ZRStatusUtil.loadChangeStatus({"module":module}, function(json){//No I18N
	        if(json && json.message && json.message === "success"){
	            
	            var statusList = json.statusList;
	            var fromIndex = json.fromIndex;
	            var toIndex = json.toIndex;
	            var startlimit = parseInt(fromIndex) + parseInt(toIndex);
	            for(var i=0;i<statusList.length;i++){
	                var statusObj = statusList[i];
	                var label = statusObj.label;
	                if(label !== undefined && label !== "-None-"){
	                    if(label === status){
	                        liStr = liStr + "<li class='statuseach' data-status='"+label+"'>"+label+"</li>";
	                    }else{
	                        liStr = liStr + "<li class='statuseach' data-status='"+label+"'>"+label+"</li>";
	                    }
	                }
	            }
	        }
	    });
	    $('.notes-block').remove();
	    var cancelFun = function(){
	        $('.notes-block').remove();
	    };
	    var mouseFun = function(){
	    	$('#detail_status_link').show();
	    };
	    lookup = function(){
	        var target = $("#change-status-JOauto");
	        $('.ac-block').remove();
	        var url = "/crm/GetAssociatedJobopening.do";//No I18N
	        var mode = "fetchAssociatedJobopening";//No I18N
	        var urlData = {fromindex:1, toindex: 15, resumeid: pkid, mode:mode};
	        var lookupData = {fldName:"relatedto-cs", fldId: "relatedto-cs-hidden", fldLabel:"relatedto-cs", searchmodule:"AssJob", leadid: pkid, module:"Potentials"};//No I18N
	        ZRCommonUtil.autoComplete(target, {url: url, params: urlData, inputid: "relatedto-cs", renderFun:function( ul, item ) { //No I18N
	            return $( "<li>" )
	            .data( "item.autocomplete", item ) //No I18N
	            .append( "<a>" + item.label + " (" +item.count+ ")" + "</a>" ) //No I18N
	            .appendTo( ul );
	        }, lookup: lookupData});//No I18N
	    };
	    var createElem = Utils.createHTML({"name": "div", "attr":{"class": "notes-block"}, "events":[{"name":"mouseover", "fn": mouseFun}], "child"://No I18N
	        [{"name": "div", "attr":{"class":"qcpopuparrow qcLeft", "id":"change-status-popup"}},//No I18N
	         {"name":"span", "html":title1},//No I18N
	         {"name":"div", "attr":{"class":"newfield"}, "child"://No I18N
	             [{"name":"p", "attr":{"class":"cs", "id":"change-status-select"}, "html": ""},//No I18N
	              {"name":"ul", "attr":{"class":"change-status-list","id":"change-status-list" ,"style":"top:50px; display:none", "data-isrowexist":isRowExist}, "html":liStr}]//No I18N
	         },
	         {"name":"span", "attr":{"id":"JO-lookup-name", "style":"display:none"}, "html":title2},//No I18N
	         {"name":"div", "attr":{"id":"change-status-JOauto"}},//No I18N
	         {"name":"textarea", "attr":{"placeholder": I18n.getMsg("crm.potential.associate.popout.entercomments"), "class":"textareachk mT10 fL", "data-textarea":'{"maxlength": 6000, "minlength": 100, "method": "after"}', "id":"change-status-comment", "value":""}, "html":""}, //recruit changes //No I18N
	         {"name":"div", "attr":{"class":"cB", "id":"unqualify-checkbox", "style":"display:none"}, "child": //No I18N
	             [{"name":"label", "attr":{"class":"gray2"}, "child":[{"name":"input", "attr":{"type":"checkbox", "id":"unqualify-checkbox-boolean"}}, {"name":"span", "attr":{"id":"unqualify-checkbox-value"}, "html":"Hire and Lock"}]}]//No I18N
	         },
	         {"name":"input", "attr":{"name":"submitButton","type":"button", "class":"btn mR10 mT10", "data-pkid":pkid, "data-isrowexist":isRowExist, "data-module":module, "value":I18n.getMsg("crm.button.update")}, "events":[{"name":"click", "fn":"ZRCommonUtil.changerecentstatus"}]},//No I18N
	         {"name":"a", "attr":{"class":"fbllink", "href":"javascript:void(0);"}, "events":[{"name":"click", "fn":cancelFun}], "html":I18n.getMsg("crm.button.cancel")}]//No I18N
	    });
	    if(module == "Products" && leadStatus!=undefined) {
	    	var box;
	    	for(var i=0; i< createElem.childNodes.length; i++){
	    		if(createElem.childNodes[i].id == "unqualify-checkbox") box = createElem.childNodes[i];
	    	}
	    	createElem.insertBefore(Utils.createHTML({"name":"div", "attr":{"id":"candidateAlso"}, "child": //NO I18N
	    		[{"name":"span","child": //NO I18N
	    			[{"name":"input", "attr":{"type":"checkbox", "id":"updateCandidateAlso", "class":"cB mR10 mT10"}}, //NO I18N
	    			 {"name":"span", "html": "&nbsp"+I18n.getMsg("crm.lead.change.status.also")} //NO I18N
	    		 ]},
	    		 {"name":"div", "child"://No I18N
		             [{"name":"p", "attr":{"class":"cs", "id":"change-lead-status-select", "style":"display:none;"}, "html": ""},//No I18N
		              {"name":"ul", "attr":{"class":"change-status-list", "id":"change-lead-status-list","style":"top:282px; display:none"}}]//No I18N
		         }
	    		 ]}), box); //NO I18N
	    }
	    $("body").append(createElem);
	    
	    if(isRowExist){
	        lookup();
	        $('div.ac-block img').css("margin", "6px 0 0 10px");
	        $('#relatedto-cs').css("width", "190px");
	        $("#JO-lookup-name").show();
	        $("#relatedto-cs-hidden").val(pid);
	        $("#relatedto-cs").val(pname);
	    }
	    $("#change-status-select").html("<span></span>"+status).data("status", status);//No I18N
	    if(module == "Products" && leadStatus!=undefined) {
	    	ZRCommonUtil.addCandidateStatusData(leadStatus);
	    }
	    var pasteDiv = $('.notes-block');
	    var pos = (tgt) ? ZRCommonUtil.getPopoverPosition(tgt) : {};
	    if(pos){
	        pasteDiv.css({
	            "top": pos.top+"px", //No I18N
	            "left": pos.left+"px" //No I18N
	        });
	        pasteDiv.children(".qcLeft").css({"top":pos.arrowPos+"px", "left":"-12px"});//No I18N
	    }
	},
	changerecentstatus: function(event){
	    var tgt = $(event.target);
	    var pkid = tgt.data("pkid");//No I18N
	    var module = tgt.data("module");//No I18N
	    var textarea = document.getElementById("change-status-comment").value;
	    var isunqal = document.getElementById("unqualify-checkbox-boolean").checked;
	    var pid = "";
	    var isrowexist = false;
	    if(tgt.data("isrowexist")){
	        pid = document.getElementById("relatedto-cs-hidden").value;
	        isrowexist = true;
	    }
	    var status = $("#change-status-select").data("status");
	    var name = $("#entityName").val();
	    var urlData = "module="+module+"&entityId="+pkid+"&comments="+textarea+"&status="+status+"&entityName="+name;//No I18N
	    if(pid){
	        urlData = urlData+"&potenId="+pid;//No I18N
	    }
	    var type;
	    var value1;
	    if(isunqal){
	        urlData = urlData+"&ischecked="+isunqal;//No I18N
	        
	        if(status === "Hired"){
	            value1 = I18n.getMsg('crm.leads.unlock');
	            type = "lock";//No I18N
	        }else{
	            value1 = I18n.getMsg('crm.leads.qualify');
	            type = "disq";//No I18N
	        }
	    }
	    var candidateAlsoBox = document.getElementById("updateCandidateAlso");
	    if(candidateAlsoBox && candidateAlsoBox.checked) {
	    	var leadStatus = $("#change-lead-status-select").data("status");
	    	urlData = urlData+"&candidateAlso=true&leadStatus="+leadStatus; //No I18N
	    }
	    ZRCommonUtil.ajaxGetMethod("/crm/UpdateResumeStatus.do", urlData,  false, "html", undefined, function(json){ //No I18N
	        json = ZRCommonUtil.convertStringToJson(json);
	        if(json && json.message && json.message == "success"){
	            $("#change-status-popup, .notes-block").hide();
	            if(module === "Leads"){
	            	if(tgt.data("isrowexist")){
	            		var value = $("#detail_status_area").html();
	            		var vals = value.split(":");
	         	        status = json.status;
	         	        vals[0] = json.joName;
	            		var result = vals[0] + " : " + status;
	            		$("#relatedto-cs-hidden").val(json.joId);
	            		$("#relatedto-cs").val(json.joName);
	            		$("#detail_status_area").html(result);
	            		$('#detail_status_link').html('<a class="cs-link" onclick=\'ZRCommonUtil.recentstatusedit(this, '+isrowexist+', "'+status+'");sE(event)\' data-module='+module+' data-pkid='+pkid+' data-positiondata=\'{"modal":".notes-block", "placement":"right"}\' href="javascript:;">'+I18n.getMsg("crm.button.change.status")+'</a>');
	            		$("#jo-id").val(json.joId);
	            		$("#jo-name").val(json.joName);
	            	}else{
	            		$("#detail_status_area").html(status);
	            		$('#detail_status_link').html('<a class="cs-link" onclick=\'ZRCommonUtil.recentstatusedit(this, '+isrowexist+', "'+status+'");sE(event)\' data-module='+module+' data-pkid='+pkid+' data-positiondata=\'{"modal":".notes-block", "placement":"right"}\' href="javascript:;">'+I18n.getMsg("crm.button.change.status")+'</a>');
	            	}
	            	if(isunqal){
	                	ZRCommonUtil.removeCandidateActions(pkid, module, type, value1);
	                }
	            }else if(module === "Products"){//No I18N
	                if(status === "Selected" || status === "Rejected"){
	                	$('#detail_status_link').remove();
	                }else{
	                	if(candidateAlsoBox) {
	                		var leadStatus = $("#change-lead-status-select").data("status");
	                		$('#detail_status_link').html('<a class="cs-link" onclick=\'ZRCommonUtil.recentstatusedit(this, '+isrowexist+', "'+status+'", "'+leadStatus+'");sE(event)\' data-module='+module+' data-pkid='+pkid+' data-positiondata=\'{"modal":".notes-block", "placement":"right"}\' href="javascript:;">'+I18n.getMsg("crm.button.change.status")+'</a>');
	                	} else {
	                		$('#detail_status_link').html('<a class="cs-link" onclick=\'ZRCommonUtil.recentstatusedit(this, '+isrowexist+', "'+status+'");sE(event)\' data-module='+module+' data-pkid='+pkid+' data-positiondata=\'{"modal":".notes-block", "placement":"right"}\' href="javascript:;">'+I18n.getMsg("crm.button.change.status")+'</a>');
	                	}
	                }
	                $("#detail_status_area").html(status);
	            }else if(module === "Potentials"){//No I18N
	            	$("#detail_status_area").html(status);
	            	$('#detail_status_link').html('<a class="cs-link" onclick=\'ZRCommonUtil.recentstatusedit(this, '+isrowexist+', "'+status+'");sE(event)\' data-module='+module+' data-pkid='+pkid+' data-positiondata=\'{"modal":".notes-block", "placement":"right"}\' href="javascript:;">'+I18n.getMsg("crm.button.change.status")+'</a>');
	            	var LOCKEDJOSTATUSARRAY = ["Filled", "Declined", "Cancelled"];//No I18N
	            	if($.inArray(status, LOCKEDJOSTATUSARRAY) > -1){
	            		var tdElem = $("#status_lock_spn").parent();
	                    tdElem.html('<span id="status_lock_spn" class="dB mt5"><input type="hidden" id="isJobopeningLocked" value="true"><input type="button" data-positiondata=\'{"modal":".notes-block", "placement":"left"}\' class="newgraybtn" id="Follow_btn" data-pkid='+pkid+' data-type="lock" data-module='+module+' name="Follow_btn" value="'+I18n.getMsg('crm.potentials.reopen')+'" onclick="ZRCommonUtil.unlockandqualifypopup(event)"> </span>');
	                    $("a[data-cid=addRecords], a.rellistNew, td.tableData div a.sl, span.sep, a#jbiUnPublish, div#relLink, a#createlink, div.normalDropDown, #detailddMenu a[name=mailmerge], #detail-tag-list div div a, #detail_status_link").remove();
						$("#detail-tag-list div div.tagsBlock span").attr("style","padding:0 13px 0 13px;");
						if($('.ca-status').length == 0){
							$('#associate_candidate_history').hide();
						}
	            	}
			    }
		        loadNotes(pkid);
	            ZRCommonUtil.showSuccessMessage(I18n.getMsg("crm.label.success.status"));
	            ZRCommonUtil.entityActivityView(pkid, '0', module);//No I18N
	            if(module === 'Leads' && tgt.data("isrowexist")){
	            	var personalityArr = $("#personalityArr").val();
		            personalityArr = personalityArr.split("||");
		            navigateRelatedList("/crm/NavigateByRecords.do?totalRecords=-1&fileName=/crm/RelatedList.do?action=relatedlist&previous_sort_column=null&previous_sort_order=null&module="+module+"&id="+pkid+"&mod_POTENTIALSPERSONALITY=true&toIndex=0&currentOption=10&next.x=x",personalityArr[10]);//No I18N
	            }
	            clearShowCacheObj("tab_"+module);//No I18N
	        }
	    }, function(xhr){
	    	var json = xhr.responseText;
	    	json = ZRCommonUtil.convertStringToJson(json);
	        if(json && json.message && json.message === "failure"){
	            alert(I18n.getMsg("crm.error.changestatus"));
	        }else if(json && json.message && json.message === "FLEEMessageIAR"){//No I18N
	        	alert(I18n.getMsg(json.fmtkey_fleeMessage, [json.edition, json.featureLimitCount, json.featureType]));
	        }
	    });
	}, 
		
		removeCandidateActions : function(pkid, module, type, value){
			var tdElem = $("#status_lock_spn").parent();
            tdElem.html('<span id="status_lock_spn" class="dB mt5"><input type="hidden" value="true" id="isCandidatesLocked"/><input type="button" data-positiondata=\'{"modal":".notes-block", "placement":"left"}\' class="newgraybtn" id="Follow_btn" data-pkid='+pkid+' data-type='+type+' data-module='+module+' name="Follow_btn" value="'+value+'" onclick="ZRCommonUtil.unlockandqualifypopup(event)"> </span>');
            $("#add-new-iw-link, #add-new-jo-link, #add-existing-jo-link").hide();
            $("input[data-cid=convert], a.rellistNew, td.tableData div a.sl, span.sep, #detailddMenu a[name=mailmerge], #detailddMenu a[name=Duplicate2], #singleGenerateFormattedResumeId, #candidateInvitationStatusId, div#relLink, #detail-tag-list div div a, a#createlink, div.normalDropDown, #detail_status_link").remove();
            $("#detail-tag-list div div.tagsBlock span").attr("style","padding:0 13px 0 13px;");
		},
		
		pasteDocumentUploadFile: function(){
			
			var value = $("#pasteresumearea").val();
			if(value.length==0){
				alert("Resume text fied cannot be empty"); // NO I18N
				return false;
			}
			var ulElem = $('ul.cand-tag-list');
			var liElem = ulElem.find(".active");
			var tagIdStr = "";
			for(var i=0;i<liElem.length;i++){
				var elem = $(liElem[i]);
				var tagLabel = elem.data("taglabel");//No I18N
				tagIdStr = (tagLabel && tagLabel.length !=0 ) ? tagLabel+";"+tagIdStr : tagIdStr;
			}
			var inpElem = $('#ass-cand-tag-text');
			var tagName = inpElem.val();
			tagIdStr = (tagName && tagName.length != 0) ? tagName+";"+tagIdStr : tagIdStr;
			if(tagIdStr.length > 0){
				document.pasteresumefile.taglist.value = tagIdStr;
			}
			var callbacks = {
					success:function(data){
						data = ZRCommonUtil.convertStringToJson(data);
						window.leadid = data.leadid;
						window.importstatus = data.status;
						window.action = data.action;
						ZRCommonUtil.resumeparser("Leads", "", "","",data.action);//NO I18N
					},
					fail:function(xhr){
						
					}
			};
			var formData = ZRCommonUtil.formData2Query(document.pasteresumefile);
			ZRCommonUtil.ajaxUpload("/crm/PasteResumeUpload.do", formData, callbacks, "json", false, false);//NO I18N
			return false;
		},  resumeParserUploadStatus: function(status, statusof){
			var actualurl = window.location;
			if(actualurl){
				actualurl = String(actualurl);
			}
			if(actualurl.indexOf("ImportParser") > -1  || actualurl.indexOf("generateFormattedResume") > -1){
				if(status != undefined && status == "false"){
					var state = History.getState().hash;
					if(state.indexOf("ImportParser") > -1){
						setTimeout(ajaxNew("/crm/ImportFromDocument.do?module=Leads&type=importfromdocument"), time);// No I18N
					}else if(statusof == "FormattedResume"){ // NO I18N
						setTimeout(ajaxNew("/crm/getFormattedResumeStatus.do?module=Leads&type=importfromdocument"), time);// No I18N
					}
				}
			}
		}, resumeparser: function(module, parserBusy, statusof,total,action){
			//var action = window.action;
			if((action != undefined && action  == "trialexpired")){ // NO I18N
				alert("To continue upload please upgrade");// NO I18N
				return;
			}
			if((action != undefined && action  == "singleparser")){ // NO I18N
				var leadidstr = window.leadid;
				var status = window.importstatus;
				if(status=== 3){
					alert("Already Exists. Hence skipped"); // NO I18N
					return;
				}
				
				if(leadidstr == undefined || leadidstr==null || leadidstr == "null"){
					alert("Please try agin"); /*** generalized error message need to be add by ramesh**/ // No I18N 
					ajaxNew('/crm/ImportFromDocument.do?module=Leads&type=importfromdocument');// No I18N
				}else{
					document.location.href = "/crm/EntityInfo.do?module="+ZRCommonUtil.ZCMODULEMAP[module]+"&id="+leadidstr;
				}
				return;
			}	
			if((action != undefined && action  == "pastedata")){
				ajaxNew('/crm/ImportFromDocument.do?module=Leads&paste=pasteparser'); // No I18N
			}
			if((action!=undefined && action=="limitExceeded")){
				$("#spaceExceeded").attr("style","");
				$("#dslimit").html(window.dslimitStr);
				$("#resume_parser_import_id").attr("value",I18n.getMsg("crm.lead.resume.ImportResumes"));
				$("#resume_parser_import_id").removeAttr('disabled');
			}
			if((action != undefined && action  == "parseddata")){
				ajaxNew('/crm/ImportFromDocument.do?module=Leads&type=importfromdocument'); // No I18N
			}
			if((action !=undefined && action == "uploadExceeded")) {
				$("#resume_parser_import_id").attr("value",I18n.getMsg("crm.lead.resume.ImportResumes"));
				$("#resume_parser_import_id").removeAttr('disabled');
			}
			if(total <= 6){
				time = 5000;
			}else{
				time = 10000;
			}
			setTimeout(function(){ZRCommonUtil.resumeParserUploadStatus(parserBusy,statusof);}, time);
				
		}, getParserValues : function(val)
		{
			$("#parser_test_result").hide();
			$("#parserfilelist").html(''); // No I18N
			if(val=="true"){
				$('#resumeparsermapping').hide();
				$('#parser_user_test_doc').show();
			}else{
				$('#parser_user_test_doc').hide();
				$('#resumeparsermapping').show();
			}
			document.body.scrollTop = 0;
		},parsermappingstatus : function(){
			var action = window.action;
			if(action != undefined && action  == "parsermapping"){ // NO I18N
				alert(I18n.getMsg("crm.setup.resumeparsermapping.changessuccessfullyupdated"));
			}else if(action != undefined && action  == "emptymapping"){ // NO I18N
				alert(I18n.getMsg("crm.setup.resumeparsermapping.emptymappingnotallowed"));
			}else if(action != undefined && action  == "parsertest"){ // NO I18N
				var iframe = getElemById("parsermappingframe");  //No I18N
			    var iframeElem = Utils.getIFrameDoc(iframe);
			    var iframeContent = $(iframeElem).find('body').html();
				$('#parser_test_result').html(iframeContent).show();//No I18N
			}

		},
		refreshRelatedList: function(personalityname){
			var personObj =$("#personalityArr").val();
			if(personObj != null && personObj != ""){
				var pArr = personObj.split("||");
                var listRelationId,pname=personalityname;//NO I18N
                for(var i=0;i<pArr.length;i++){
                	var temp=pArr[i].split("_");
                	if(temp[0]===pname){
                		pname=temp[0];
                		listRelationId=temp[1];
                		break;
                	}
                }
                if(typeof listRelationId!=="undefined"){
					var ajaxUrl = "/crm/RelatedList.do?action=relatedlist&module="+getObj("module").value+"&id="+getObj("id").value+"&cvid="+getObj("cvid").value+"&pname="+pname.toLocaleUpperCase();//No I18N
                    
					mR(ajaxUrl,function test(res){
                    	replacePersonality(res,listRelationId);
					});
                }
			}
		},
				publishInWebsite: function(elem, fieldId){
			var enable = "false";
			if($(elem).is(":checked")){
				enable = "true";
			}
			var urlData = {};
			urlData.fieldid = fieldId;
			urlData.isenable = enable;
			
			ZRCommonUtil.ajaxPostMethod("/crm/PublishInWebsite.do", urlData,  false, "json", undefined, function(json, pasteDiv){ //No I18N
				json = ZRCommonUtil.convertStringToJson(json);
				if(json && json.message && json.message === "success"){
					if(enable == "true"){
						$(elem).attr("checked", "true");
					}else{
						$(elem).removeAttr("checked");
					}
				}else{
					if(enable == "true"){
						$(elem).removeAttr("checked");
					}else{
						$(elem).attr("checked", "true");
					}
				}
			}, function(xhr, pasteDiv){
				alert(I18n.getMsg("crm.security.error.add.user"));
			});
		},
		addCandidateStatusData: function(leadStatus) {
			
			var liStr="";
			var status=leadStatus;
	    	ZRStatusUtil.loadChangeStatus({"module":"Leads"}, function(json){//No I18N
		        if(json && json.message && json.message === "success"){
		            
		            var statusList = json.statusList;
		            var fromIndex = json.fromIndex;
		            var toIndex = json.toIndex;
		            var startlimit = parseInt(fromIndex) + parseInt(toIndex);
		            for(var i=0;i<statusList.length;i++){
		                var statusObj = statusList[i];
		                var label = statusObj.label;
		                if(label !== undefined && label !== "-None-"){
		                    liStr = liStr + "<li class='statuseach' data-status='"+label+"'>"+label+"</li>";
		                }
		            }
		            $('#change-lead-status-select').html('<span></span>'+status).data("status",status);//No I18N
					var ulElem = $("#change-lead-status-list");
					ulElem.append(liStr);
					ulElem.data("scrolldata", '{"toindex": "'+toIndex+'", "fromindex":"'+startlimit+'", "shownext":"'+json.showNext+'", "module":"'+json.module+'", "mode":"'+json.mode+'", "pastediv":"#change-lead-status-list", "callee":"ZRCommonUtil"}');//No I18N
					ZRCommonUtil.fetchScrollData(ulElem);
		        }
		    });
		},
		htmlEscape: function(value)
		{
			if(value && value != null && value != "null"){
				value = value.replace(/"/g,'&quot;');
				value = value.replace(/'/g,"&#39;");
				value = value.replace(/</g,"&lt;");
				value = value.replace(/>/g,"&gt;");
			}
			return value;
		},
		getStaffingType: function()
		{
			/*Unsafe: Do NOT use the following method if ZRCommonUtil is not initialized. It will be initialized in footer.jsp*/
			var accModName = ZRCommonUtil.ZCMODULEMAP.Accounts;
			if(accModName == "Departments"){ //No I18
				return 1;
			}
			else {
				return 2;
			}
		},
		initiateSocialDataFetch : function()
		{
			var alreadyFetched = ZRCommonUtil.ISSOCIALNOTIFIED;
			if(!alreadyFetched){
				var urlData = {};
				urlData.action = "initiate_data_fetch";//No I18
				urlData.notifysocial = "true";//No I18
				ZRCommonUtil.ajaxGetMethod("/crm/SocialUserTab.do", urlData, undefined, undefined, undefined, function(resp){ //No I18N
					if(resp && resp === "true"){
						ZRCommonUtil.ISSOCIALNOTIFIED = true;
					}
				}, undefined);
			}
		},
		loadMigrationRequestForm: function()
		{
			ZRCommonUtil.ajaxPostMethod("/crm/MigrationRequestForm.do", "",  false, "html", undefined, function(data, pasteDiv){ //No I18N
				ZRCommonUtil.createModal({'title':'Submit Migration Request','content':data,'savefn':"ZRCommonUtil.validateMigrationRequestForm",'savebtn':'Submit'});//No I18N
			},function(xhr,pasteDiv){
				
			});
		},
		validateMigrationRequestForm: function()
		{
			var name = $('#mig_name');
			var email = $('#mig_email');
			if (email.val() == "" || email.val() == email.attr('placeholder'))
			{
				alert(I18n.getMsg("crm.migration.request.form.alert.email"));//No I18N
				email.focus();
				return false;
			}
			var phone = $('#mig_phone');
			var company = $('#mig_company');
			var country = $($('#mig_country'));
			var vendor = $('#mig_vendor');
			if (vendor.val() == "" || vendor.val() == vendor.attr('placeholder'))
			{
				alert(I18n.getMsg("crm.migration.request.form.alert.vendor"));//No I18N
				vendor.focus();
				return false;
			}
			var users = $('#mig_users');
			if (users.val() == "" || users.val() == users.attr('placeholder'))
			{
				alert(I18n.getMsg("crm.migration.request.form.alert.users"));//No I18N
				users.focus();
				return false;
			}
			var expected = $('#mig_expectedtime');
			var desc = $('#mig_description');
			
			var urlData = {};
			urlData.mig_name = name.val();
			urlData.mig_email = email.val();
			urlData.mig_phone = phone.val();
			urlData.mig_company = company.val();
			urlData.mig_country = country.val();
			urlData.mig_vendor = vendor.val();
			urlData.mig_users = users.val();
			urlData.mig_expected = expected.val();
			urlData.mig_desc = desc.val();
			
			ZRCommonUtil.ajaxPostMethod("/crm/SubmitMigrationRequestForm.do", urlData, false, "html", undefined, function(data,pasteDiv){//No I18N
				ZRCommonUtil.closeDialog(undefined,undefined,"#modal-block"); //No I18N

				ZRCommonUtil.showSuccessMessage(I18n.getMsg("crm.migration.request.form.alert.success"));//No I18N
				
			}, function(xhr,pasteDiv){
				alert(I18n.getMsg("crm.migration.request.form.alert.failure"));//No I18N
			});
		},
		setStartDateTime:function(calenderNode){
			if($(calenderNode).is($("input[name='property(Start DateTime)']"))){
				if($("input[name='property(End DateTime)']").length > 0){
					var time = $("input[id='Start DateTimedateTime']").val();
                	if(Crm.userDetails.TIME_FORMAT === "hh:mm a"){//24 hr format
                		time += " "+$("input[name='property(Start DateTimeampm)']").val();
                	}
                	var date = $(calenderNode).val();
                	ZRCommonUtil.setEndDateAndTime(date+" "+time);
				}
			}
		},
		setEndDateAndTime:function (startdate){
			var is24HrsFormat = false;
			if( Crm.userDetails.TIME_FORMAT === "HH:mm") {
				is24HrsFormat = true;
			}
			var dtObj = new Date(startdate);
			dtObj.setMinutes(dtObj.getMinutes()+60);
			var hr = trimBoth( $("input[id='End DateTimedateTime']").val().split(" ")[0]);
			var time = $("input[id='End DateTimedateTime']").timeEntry('getTime'); //NO I18N
			if(time){
				var meridiem = Utils.getMeridiem(time).toUpperCase();
				if( is24HrsFormat ) {
					dtObj.setHours(parseInt(hr.split(":")[0], 10));
				}else{
					dtObj.setHours(Utils.convertTimeTo24HoursFormat(parseInt(hr.split(":")[0], 10),meridiem));
				}
				dtObj.setMinutes(parseInt(hr.split(":")[1], 10));
			}
			if( is24HrsFormat ) {
				$("input[id='End DateTimedateTime']").val(Utils.formatTimeVal(dtObj.getHours()) + ":"+Utils.formatTimeVal(dtObj.getMinutes()));
				$("input[name='property(End DateTimehour)']").val( Utils.formatTimeVal(dtObj.getHours()));
				$("input[name='property(End DateTimeminute)']").val(Utils.formatTimeVal(dtObj.getMinutes()));
			} else {
				var timeObj = Utils.convertTo12HoursFormatTimeObj( dtObj );
				$("input[id='End DateTimedateTime']").val( timeObj.hrs + ":" + timeObj.mins);
				$("input[name='property(End DateTimehour)']").val( timeObj.hrs);
				$("input[name='property(End DateTimeminute)']").val( timeObj.mins);
				$("input[name='property(End DateTimeampm)']").val(timeObj.meridiem.toUpperCase());
				$("input[name='property(End DateTimeampm)']").next().html(I18n.getMsg(timeObj.meridiem.toUpperCase()));
			}
			$("input[name='property(End DateTime)']").val( crmCalendar.convertToUserDatePattern(dtObj.getDate()+" "+dtObj.getMonth()+" "+dtObj.getFullYear()) );//NO I18N
			$("input[name='property(End DateTime)']").data("dateObj",dtObj);//NO I18N
		},
		getPartialTemplate: function(folderName, templateName){
            if(templateName){
                return ZRCommonUtil.getTemplateContent(folderName, templateName); 
            }
        },
        getTemplateContent: function(folderName, templateName){
            if(templateName && templateName != null){
                return Handlebars.getTemplate(folderName, templateName); 
            }
        },
        replaceTemplateData: function(data, templateName, folderName){
            if(data && templateName){
                var template = ZRCommonUtil.getTemplateContent(folderName, templateName); 
                return template(data);
            }
        }
};
