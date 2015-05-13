//$Id$
/**
 * Created by WebStorm.
 * User: kirubha-2911
 * Date: 3/16/15
 * Time: 2:47 PM
 * Project: webapps
 * File Name: ZRComponent.js
 */

var ZRComponent = (function () {

    /*Do not change this*/
    var ZRComponent = ZRComponent || {};
    var keys = [37, 38, 39, 40];
    var btnAlignClassArray = ['al', 'ac', 'ar'];//NO I18N
    var btnArrayClass = ["btn-primary", "btn-secondary", "btn-positive", "btn-negative"];//NO I18N
    var positionArray = ['top', 'middle', 'bottom', 'middletop', 'middlebottom'];//NO I18N

    var defaultModelBox = {
        modalClass: "model-box-wrap zrc-modal-block confirm wid400",//NO I18N
        btnClass: "zrc-btns-block ",//NO I18N
        btnAlign: "ar",//NO I18N
        position: 'middletop'//NO I18N
    };

    ZRComponent.init = function () {

        /*This is Model Box resize monitor*/
        $(window).resize(function () {
            if (ZRComponent.resizeMonitor && ZRComponent.popup !== undefined) {
                if (ZRComponent.popup.offsetTop > 0) {
                    ZRComponent.makeItMiddle($(window).width(), $(window).height());
                }
            }
        });
    };

    ZRComponent.AlertTypes = {
        "success": {//NO I18N
            "altClass": "alt-success",//NO I18N
            "iconClass": "fa-check-circle",//NO I18N
            "msg": I18n.getMsg("zrc.alert.label.success") + "!"//NO I18N
        }, //NO I18N
        "normal": {//NO I18N
            "altClass": "alt-normal",//NO I18N
            "iconClass": "fa-arrow-circle-right",//NO I18N
            "msg": I18n.getMsg("zrc.alert.label.normal") + "!"//NO I18N
        }, //NO I18N
        "info": {"altClass": "alt-info", "iconClass": "fa-info-circle", "msg": I18n.getMsg("crm.label.info") + "!"},//NO I18N
        "warning": {//NO I18N
            "altClass": "alt-warning",//NO I18N
            "iconClass": "fa-warning",//NO I18N
            "msg": I18n.getMsg("zrc.alert.label.warning") + "!"//NO I18N
        },//NO I18N
        "failure": {//NO I18N
            "altClass": "alt-failure",//NO I18N
            "iconClass": "fa-exclamation-circle",//NO I18N
            "msg": I18n.getMsg("zrc.alert.label.failure") + "!"//NO I18N
        },//NO I18N
        "success-box": {//NO I18N
            "altClass": "alt-success box",//NO I18N
            "iconClass": "fa-check-circle",//NO I18N
            "msg": I18n.getMsg("zrc.alert.label.success") + "!"//NO I18N
        }, //NO I18N
        "normal-box": {//NO I18N
            "altClass": "alt-normal box",//NO I18N
            "iconClass": "fa-arrow-circle-right",//NO I18N
            "msg": I18n.getMsg("zrc.alert.label.normal") + "!"//NO I18N
        }, //NO I18N
        "info-box": {//NO I18N
            "altClass": "alt-info box",//NO I18N
            "iconClass": "fa-info-circle",//NO I18N
            "msg": I18n.getMsg("zrc.alert.label.info") + "!"//NO I18N
        },//NO I18N
        "warning-box": {//NO I18N
            "altClass": "alt-warning box",//NO I18N
            "iconClass": "fa-warning",//NO I18N
            "msg": I18n.getMsg("zrc.alert.label.warning") + "!" //NO I18N
        },
        "failure-box": {//NO I18N
            "altClass": "alt-failure box",//NO I18N
            "iconClass": "fa-exclamation-circle",//NO I18N
            "msg": I18n.getMsg("zrc.alert.label.failure") + "!"//NO I18N
        },//NO I18N
        "success-modal": {//NO I18N
            "altClass": "alt-success boxp",//NO I18N
            "iconClass": "fa-check-circle",//NO I18N
            "msg": I18n.getMsg("zrc.alert.label.success") + "!"//NO I18N
        }, //NO I18N
        "normal-modal": {//NO I18N
            "altClass": "alt-normal boxp",//NO I18N
            "iconClass": "bg-none",//NO I18N
            "msg": I18n.getMsg("zrc.alert.label.normal") + "!"//NO I18N
        }, //NO I18N
        "info-modal": {//NO I18N
            "altClass": "alt-info boxp",//NO I18N
            "iconClass": "fa-info-circle",//NO I18N
            "msg": I18n.getMsg("zrc.alert.label.info") + "!"//NO I18N
        },//NO I18N
        "warning-modal": {//NO I18N
            "altClass": "alt-warning boxp",//NO I18N
            "iconClass": "fa-warning",//NO I18N
            "msg": I18n.getMsg("zrc.alert.label.warning") + "!"//NO I18N
        },//NO I18N
        "failure-modal": {//NO I18N
            "altClass": "alt-failure boxp",//NO I18N
            "iconClass": "fa-exclamation-circle",//NO I18N
            "msg": I18n.getMsg("zrc.alert.label.failure") + "!"//NO I18N
        }//NO I18N
    };

    ZRComponent.keydown = function (e) {
        if ($.inArray(e.keyCode, keys) !== -1) {
            ZRCommonUtil.preventDefault(e);
            return;
        }
    };

    ZRComponent.wheel = function (e) {
        ZRCommonUtil.preventDefault(e);
    };

    ZRComponent.disableScroll = function () {
        if (window.addEventListener) {
            window.addEventListener('DOMMouseScroll', ZRComponent.wheel, false);//NO I18N
        }
        window.onmousewheel = document.onmousewheel = ZRComponent.wheel;
        document.onkeydown = ZRComponent.keydown;
    };

    ZRComponent.enableScroll = function () {
        if (window.removeEventListener) {
            window.removeEventListener('DOMMouseScroll', ZRComponent.wheel, false);//NO I18N
        }
        window.onmousewheel = document.onmousewheel = document.onkeydown = null;
    };

    ZRComponent.hideModalBox = function (tgtId) {
        ZRComponent.enableScroll();
        var targetId = '#' + tgtId;
        if ($(targetId).css('bottom') != '0px') {
            $(targetId).css({top: "-300px"});
            $(targetId).parent().fadeOut(1200, function () {
                if ($(this).data('removedialog') === true) {
                    $(this).remove();
                }
            });
        } else {
            var box = $(targetId)[0];
            ZRComponent.popup = box;
            ZRComponent.popup.style.bottom = '';
            ZRComponent.popup.style.top = box.getBoundingClientRect().top + 'px';
            $(targetId).css({top: -300});
            $(targetId).parent().fadeOut(1200, function () {
                if ($(this).data('removedialog') === true) {
                    $(this).remove();
                }
            });
        }
    };

    /*Default Model Box Setting goes here.You can edit it as your wish*/

    ZRComponent.getDefaultModalBoxVal = function (attr) {
        return (typeof attr === 'string' && defaultModelBox[attr]) ? defaultModelBox[attr] : undefined;
    };

    ZRComponent.getBtnClass = function (arg) {
        return (arg >= 0 && arg <= btnArrayClass.length - 1) ? btnArrayClass[arg] : btnArrayClass[0];
    };

    ZRComponent.resizeMonitor = true;

    ZRComponent.ConstError = {
        Error1: "Pass only object as parameter to this function.",//NO I18N
        Error2: "Provide valid value for the width parameter.",//NO I18N
        Error3: "Modal box Html template already available in the page."//NO I18N
    };

    ZRComponent.generateModalBox = function (args, modalBox, ModalBoxType) {
        $('body').append(modalBox);//NO I18N
        ZRComponent.popup = $('#' + args.modalId)[0];
        ZRComponent.showModalBox(args);
    };

    ZRComponent.AnimationDuration = 100;

    /*This will place the content at the middle of the screen*/
    ZRComponent.makeItMiddle = function (sw, sh) {
        var h = ZRComponent.popup.offsetHeight;
        var w = ZRComponent.popup.offsetWidth;
        var top = (( sh / 2) - (h / 2)) + 'px';//NO I18N
        var left = ((sw / 2) - (w / 2)) + 'px';//NO I18N
        ZRComponent.popup.style.left = left;
        $(ZRComponent.popup).animate({top: top}, ZRComponent.AnimationDuration);
    };

    ZRComponent.showModalBox = function (args) {

        var position = args.position;
        ZRComponent.disableScroll();
        var targetId = '#' + args.modalId;
        $(targetId).parent().fadeIn('fast');
        if (position == 'top') {
            ZRComponent.resetPosition();
            $(ZRComponent.popup).animate({top: 0}, ZRComponent.AnimationDuration);
        }

        if (position == 'middle') {
            ZRComponent.resetPosition();
            ZRComponent.makeItMiddle($(window).width(), $(window).height());
        }

        if (position == 'middletop') {
            ZRComponent.resetPosition();
            ZRComponent.makeItMiddle($(window).width(), $(window).height());
            $(ZRComponent.popup).animate({top: 0}, ZRComponent.AnimationDuration);
        }

        if (position == 'middlebottom') {
            ZRComponent.resetPosition();
            ZRComponent.makeItMiddle($(window).width(), $(window).height());
            $(ZRComponent.popup).animate({top: $(window).height() - ZRComponent.popup.offsetHeight}, ZRComponent.AnimationDuration);
        }

        if (position == 'bottom') {
            ZRComponent.resetPosition();
            $(ZRComponent.popup).animate({top: $(window).height() - ZRComponent.popup.offsetHeight}, ZRComponent.AnimationDuration);
        }
    };

    ZRComponent.resetPosition = function () {
        $('.model-box-wrap').removeClass('hideAbove');
        ZRComponent.popup.style.top = '';
        ZRComponent.popup.style.left = '';
        ZRComponent.popup.style.bottom = '';
    };

    ZRComponent.closeFunction = function (ev, target, mId) {
        ZRComponent.hideModalBox(mId);
    };

    ZRComponent.createAlertDialog = function (args) {
        ZRComponent.disableScroll();
        args = (args && typeof args === 'object') ? args : {};//NO I18N
        var modalClass = (args && args.modalClass) ? 'model-box-wrap zrc-modal-block confirm ' + args.modalClass : ZRComponent.getDefaultModalBoxVal('modalClass');//NO I18N
        var modalId = (args && args.modalId) ? args.modalId : "zrc-modal-box-" + $('.model-box-wrap').length;//NO I18N
        var removeFreeze = (args && args.hasOwnProperty('removeFreeze') && args.removeFreeze === true) ? args.removeFreeze : false;//NO I18N
        var removeDialog = (args && args.hasOwnProperty('removeDialog')) ? args.removeDialog : true;//NO I18N
        var needFreezeClass = (removeFreeze === true) ? 'no-modal-freeze' : 'modal-freeze';//NO I18N
        var modalTitle = (args && args.title) ? args.title : I18n.getMsg('zr.component.modalbox.alert.title');//NO I18N
        var modalContent = (args && args.content) ? args.content : Utils.createHTML({
            "name": "p",//NO I18N
            "html": I18n.getMsg('zr.component.modalbox.alert.defaultcontent')//NO I18N
        });
        var btnAlignClass = (args && args.btnAlignClass) ? ($.inArray(args.btnAlignClass, btnAlignClassArray) !== -1) ? args.btnAlignClass : ZRComponent.getDefaultModalBoxVal('btnAlign') : ZRComponent.getDefaultModalBoxVal('btnAlign');//NO I18N
        btnAlignClass = ZRComponent.getDefaultModalBoxVal('btnClass') + btnAlignClass;//NO I18N
        var okButtonLabel = (args && args.okBtnLabel) ? args.okBtnLabel : I18n.getMsg('ok');//NO I18N
        var okButtonType = (args && args.okBtnClass) ? ZRComponent.getButtonClass(args.okBtnClass) : ZRComponent.getBtnClass(2);
        var okButtonFun = (args && args.okBtnFun) ? args.okBtnFun : ZRComponent.closeFunction;
        var okButtonArg = (args && args.okBtnArg) ? args.okBtnArg : [modalId];
        var closeFun = (args && args.closeFun && typeof args.closeFun === 'function') ? args.closefn : ZRComponent.closeFunction;//NO I18N
        var callback = (args && args.callback && typeof  args.callback === 'function') ? args.callback : undefined;//NO I18N
        var callbackArg = (args && args.callbackarg) ? args.callbackarg : undefined;
        args.position = (args && args.position && $.inArray(args.position, positionArray) != -1) ? args.position : ZRComponent.getDefaultModalBoxVal('position');
        args.modalId = modalId;

        var createElem = Utils.createHTML({
            "name": "div",//NO I18N
            "attr": {"class": needFreezeClass, "data-removefreeze": removeFreeze, "data-removedialog": removeDialog},//NO I18N
            "child"://No I18N
                [{
                    "name": "div",//NO I18N
                    "attr": {"class": modalClass, "id": modalId},//NO I18N
                    "child": [{//NO I18N
                        "name": "a",//NO I18N
                        "attr": {"href": "javascript:void(0)", "class": "zrc-close-modal"},//NO I18N
                        "html": "&times;",//NO I18N
                        "events": [{"name": "click", "fn": closeFun, "args": [modalId]}]//NO I18N
                    },//No I18N
                        {"name": "h2", "attr": {"class": "til"}, "html": modalTitle},//NO I18N
                        {"name": "div", "attr": {"class": "zrc-modal-content"}, "html": modalContent},//NO I18N
                        {
                            "name": "div", "attr": {"class": btnAlignClass}, "child"://No I18N
                            [{
                                "name": "input",//NO I18N
                                "attr": {"type": "button", "class": okButtonType, "value": okButtonLabel},//NO I18N
                                "events": [{"name": "click", "fn": okButtonFun, "args": okButtonArg}]//NO I18N
                            }]
                        }]
                }]
        });

        ZRComponent.generateModalBox(args, createElem, 'alert');//NO I18N
        if (callback) {
            callback(callbackArg);
        }
    };

    ZRComponent.browserAlertDialog = function (args) {
        args = (args && typeof args === 'object') ? args : {};//NO I18N

        args.title = I18n.getMsg('zr.component.modalbox.alert.title');//NO I18N
        args.content = Utils.createHTML({
            "name": "p",//NO I18N
            "html": I18n.getMsg('zr.component.modalbox.alert.defaultcontent')//NO I18N
        });
        args.position = positionArray[1];

        ZRComponent.createAlertDialog(args);
    };

    ZRComponent.getButtonClass = function (btnClass) {
        return (typeof parseInt(btnClass) === "number" && parseInt(btnClass) != NaN) ? ZRComponent.getBtnClass(btnClass) : btnClass;
    };

    ZRComponent.defaultButtonClick = function (ev, target, msg) {
        alert("yeah! - You can override this by your own callback.Msg: " + msg);//NO I18N
    };

    ZRComponent.createConfirmDialog = function (args) {
        ZRComponent.disableScroll();
        args = (args && typeof args === 'object') ? args : {};//NO I18N
        var modalClass = (args && args.modalClass) ? 'model-box-wrap zrc-modal-block confirm ' + args.modalClass : ZRComponent.getDefaultModalBoxVal('modalClass');//NO I18N
        var modalId = (args && args.modalId) ? args.modalId : "zrc-modal-box-" + $('.model-box-wrap').length;//NO I18N
        var removeFreeze = (args && args.hasOwnProperty('removeFreeze') && args.removeFreeze === true) ? args.removeFreeze : false;//NO I18N
        var removeDialog = (args && args.hasOwnProperty('removeDialog')) ? args.removeDialog : true;//NO I18N
        var needFreezeClass = (removeFreeze === true) ? 'no-modal-freeze' : 'modal-freeze';
        var modalTitle = (args && args.title) ? args.title : I18n.getMsg('zr.component.modalbox.confirm.title');
        var modalContent = (args && args.content) ? args.content : Utils.createHTML({
            "name": "p",//NO I18N
            "html": I18n.getMsg('zr.component.modalbox.alert.defaultcontent')//NO I18N
        });
        var btnAlignClass = (args && args.btnAlignClass) ? ($.inArray(args.btnAlignClass, btnAlignClassArray) !== -1) ? args.btnAlignClass : ZRComponent.getDefaultModalBoxVal('btnAlign') : ZRComponent.getDefaultModalBoxVal('btnAlign');//NO I18N
        btnAlignClass = ZRComponent.getDefaultModalBoxVal('btnClass') + btnAlignClass;//NO I18N
        var confirmButtonLabel = (args && args.confirmButtonLabel) ? args.confirmButtonLabel : I18n.getMsg('crm.button.ok');
        var confirmButtonClass = (args && args.confirmBtnClass) ? ZRComponent.getButtonClass(args.confirmBtnClass) : ZRComponent.getBtnClass(4);
        var confirmButtonFun = (args && args.confirmButtonFun) ? args.confirmButtonFun : ZRComponent.defaultButtonClick;
        var confirmButtonArg = (args && args.confirmButtonArg) ? args.confirmButtonArg : "Hi there..!!";//NO I18N

        var cancelButtonLabel = (args && args.cancelButtonLabel) ? args.cancelButtonLabel : I18n.getMsg('zr.component.modalbox.button.lable.cancel');
        var cancelButtonClass = (args && args.cancelBtnClass) ? ZRComponent.getButtonClass(args.cancelBtnClass) : ZRComponent.getBtnClass(1);
        var cancelButtonFun = (args && args.cancelButtonFun) ? args.cancelButtonFun : ZRComponent.closeFunction;
        var cancelButtonArg = (args && args.cancelButtonArg) ? args.cancelButtonArg : [modalId];

        var closeFun = (args && args.closeFn && typeof args.closeFn === 'function') ? args.closefn : ZRComponent.closeFunction;//NO I18N
        var callback = (args && args.callback && typeof  args.callback === 'function') ? args.callback : undefined;//NO I18N
        var callbackArg = (args && args.callbackArg) ? args.callbackArg : undefined;
        args.position = (args && args.position && $.inArray(args.position, positionArray) != -1) ? args.position : ZRComponent.getDefaultModalBoxVal('position');
        args.modalId = modalId;

        var createElem = Utils.createHTML({
            "name": "div", //NO I18N
            "attr": {"class": needFreezeClass, "data-removefreeze": removeFreeze, "data-removedialog": removeDialog},//NO I18N
            "child"://No I18N
                [{
                    "name": "div",//NO I18N
                    "attr": {"class": modalClass, "id": modalId},//NO I18N
                    "child": [{//NO I18N
                        "name": "a",//NO I18N
                        "attr": {"href": "javascript:void(0)", "class": "zrc-close-modal"},//NO I18N
                        "html": "&times;",//NO I18N
                        "events": [{"name": "click", "fn": closeFun, "args": [modalId]}]//NO I18N
                    },//No I18N
                        {"name": "h2", "attr": {"class": "til"}, "html": modalTitle},//NO I18N
                        {"name": "div", "attr": {"class": "zrc-modal-content"}, "html": modalContent},//NO I18N
                        {
                            "name": "div", "attr": {"class": btnAlignClass}, "child"://No I18N
                            [
                                {
                                    "name": "input",//NO I18N
                                    "attr": { //NO I18N
                                        "type": "button",//NO I18N
                                        "class": confirmButtonClass,//NO I18N
                                        "value": confirmButtonLabel //NO I18N
                                    },
                                    "events": [{"name": "click", "fn": confirmButtonFun, "args": confirmButtonArg}]//NO I18N
                                },
                                {
                                    "name": "input",//NO I18N
                                    "attr": {//NO I18N
                                        "type": "button",//NO I18N
                                        "class": cancelButtonClass + " marL15",//NO I18N
                                        "value": cancelButtonLabel//NO I18N
                                    },
                                    "events": [{"name": "click", "fn": cancelButtonFun, "args": cancelButtonArg}]//NO I18N
                                }
                            ]
                        }]
                }]
        });

        ZRComponent.generateModalBox(args, createElem, 'alert');//NO I18N
        if (callback) {
            callback(callbackArg);
        }

    };

    ZRComponent.browserConfirmDialog = function (args) {
        args = (args && typeof args === 'object') ? args : {};//NO I18N

        args.title = I18n.getMsg('zr.component.modalbox.confirm.title');//NO I18N
        args.content = Utils.createHTML({
            "name": "p",//NO I18N
            "html": I18n.getMsg('zr.component.modalbox.alert.defaultcontent')//NO I18N
        });
        args.position = positionArray[1];

        ZRComponent.createConfirmDialog(args);
    };

    ZRComponent.openAlertMessage = function (params) {
        params = ZRCommonUtil.convertStringToJson(params);
        ZRComponent.defaultCloseFun = function (ev, target, altId) {//No I18N
            hide(altId, 'alert-animate');
            ZRCommonUtil.removeFreeze();
        };
        ZRComponent.timerCloseFun = function () {
            $('.alt-cls').trigger('click');//No I18N
        };
        ZRComponent.defaultAlertTimeDuration = 2400;

        var script = document.createElement('script');
        var type = (params && params.hasOwnProperty('type')) ? params.type.toLowerCase() : "success";//No I18N
        var msgContent = 'zrc.alert.label.' + type.split('-').shift();//No I18N
        var typeClass = (params && params.hasOwnProperty('typeClass')) ? params.typeClass : "";//No I18N
        var typeObj = ZRComponent.AlertTypes[type];
        var altClass = (typeObj && typeObj.altClass) ? typeObj.altClass : "alt-success ";//No I18N
        altClass = altClass + ' ' + typeClass;
        var iconClass = (typeObj && typeObj.iconClass) ? typeObj.iconClass : "fa-check-circle";//No I18N
        var closeLabel = (params && params.hasOwnProperty('label')) ? params.label : (type.indexOf("-modal") != -1) ? "Ok" : "&times;";//No I18N
        var message = (params && params.hasOwnProperty('msg')) ? params.msg : (typeObj && typeObj.msg) ? I18n.getMsg(msgContent) : typeObj.msg; //No I18N
        var boldMsg = (params && params.hasOwnProperty('boldMsg')) ? params.boldMsg : (typeObj && typeObj.msg) ? typeObj.message : "";
        var altId = (params && params.hasOwnProperty('baseid')) ? params.baseid : "alert-message";//No I18N
        var cancelFun = (params && params.hasOwnProperty('cancelFun')) ? params.cancelFun : ZRComponent.defaultCloseFun;//No I18N
        var cancelFunArg = (params && params.hasOwnProperty('cancelFunArg')) ? params.cancelFunArg : altId;//No I18N
        var display = (params && params.hasOwnProperty('display')) ? params.display : (type.indexOf("-box") != -1) ? "top" : (type.indexOf("-modal") != -1) ? "freeze" : "inline";//No I18N
        var displayId = (params && params.hasOwnProperty('displayId')) ? params.displayId : "";//No I18N
        var timer = (params && params.hasOwnProperty('timer')) ? params.timer : false;//No I18N
        ZRComponent.defaultAlertTimeDuration = (params && params.hasOwnProperty('duration')) ? params.duration : ZRComponent.defaultAlertTimeDuration;//No I18N

        if (type == "normal-modal") {
            params.noAlertIcon = true;
        }

        script.type = 'text/javascript';
        script.innerText = 'setTimeout(ZRComponent.timerCloseFun, ZRComponent.defaultAlertTimeDuration);';

        var noCloseIcon = (params && params.hasOwnProperty('noCloseIcon') && params.noCloseIcon) ? "" : {//No I18N
            "name": "a",//No I18N
            "attr": {"href": "javascript:void(0)", "class": "alt-cls"},//No I18N
            "events": [{"name": "click", "fn": cancelFun, "args": [cancelFunArg]}],//No I18N
            "html": closeLabel//No I18N
        };
        var noAlertIcon = (params && params.hasOwnProperty('noAlertIcon') && params.noAlertIcon) ? "" : {//No I18N
            "name": "i",//No I18N
            "attr": {"class": "fa fa-fw " + iconClass}//No I18N
        };

        var createElem = Utils.createHTML({
            "name": "div", "attr": {"class": altClass, "id": altId}, "child": //No I18N
                [noAlertIcon, {//No I18N
                    "name": "b",//No I18N
                    "html": boldMsg//No I18N
                }, {"name": "text", "html": message}, noCloseIcon] //No I18N
        });
        $("#" + altId).remove();

        if (display == "freeze") {
            $('body').append(createElem);
            ZRCommonUtil.openDialog("#" + altId, 'zrc-freeze');
            $('#' + altId).css({'z-index': "10001"/*No I18N*/});
        } else if (display == "pop") { //No I18N
            $('body').append(createElem);
            mailsetCenter(altId);
            setTimeout(function () {
                hide(altId);
            }, ZRComponent.defaultAlertTimeDuration);
        } else if (display == "inline") {//No I18N
            $('#' + displayId).before(createElem).show();
        } else if (display == "top") { //No I18N
            $('body').append(createElem);
            var sLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
            $('#' + altId).css({
                position: 'absolute',//No I18N
                'left': '50%',//No I18N
                'top': '-5px',//No I18N
                'margin-left': -($('#' + altId).width() / 2) + sLeft,//No I18N
                'margin-top': "0px",//No I18N
                'z-index': "10001"//No I18N
            }).show();//No I18N
        }
        if (timer) {
            document.body.appendChild(script);
        }
    };

    ZRComponent.openSimpleModalBox = function (args) {
        ZRComponent.disableScroll();
        args = (args && typeof args === 'object') ? args : {};//NO I18N

        ZRComponent.defaultCloseFun = function (ev, target, altId) {//No I18N
            hide(altId, 'alert-animate');
            ZRCommonUtil.removeFreeze();
        };

        var modalClass = (args && args.modalClass) ? 'model-box-wrap zrc-modal-block ' + args.modalClass : ZRComponent.getDefaultModalBoxVal('modalClass');//NO I18N
        modalClass = modalClass.replace('confirm', '');
        var modalId = (args && args.modalId) ? args.modalId : "zrc-modal-box-" + $('.model-box-wrap').length;//NO I18N
        var removeFreeze = (args && args.hasOwnProperty('removeFreeze') && args.removeFreeze === true) ? args.removeFreeze : false;//NO I18N
        var removeDialog = (args && args.hasOwnProperty('removeDialog')) ? args.removeDialog : true;//NO I18N
        var needFreezeClass = (removeFreeze === true) ? 'no-modal-freeze' : 'modal-freeze';
        var title = (args && args.hasOwnProperty('title')) ? args.title : "Sample Modal";//No I18N
        var subTitle = (args && args.hasOwnProperty('subTitle')) ? args.subTitle : "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";//No I18N
        var modalContent = (args && args.content) ? args.content : Utils.createHTML({
            "name": "p",//NO I18N
            "html": I18n.getMsg('zr.component.modalbox.alert.defaultcontent')//NO I18N
        });
        var btnAlignClass = (args && args.btnAlignClass) ? ($.inArray(args.btnAlignClass, btnAlignClassArray) !== -1) ? args.btnAlignClass : ZRComponent.getDefaultModalBoxVal('btnAlign') : ZRComponent.getDefaultModalBoxVal('btnAlign');//NO I18N
        btnAlignClass = ZRComponent.getDefaultModalBoxVal('btnClass') + btnAlignClass;//NO I18N

        var saveBtnLabel = (args && args.saveBtnLabel) ? args.saveBtnLabel : I18n.getMsg('crm.button.ok');
        var saveBtnClass = (args && args.saveBtnClass) ? ZRComponent.getButtonClass(args.saveBtnClass) : ZRComponent.getBtnClass(4);
        var saveBtnFun = (args && args.saveBtnFun) ? args.saveBtnFun : ZRComponent.defaultButtonClick;
        var saveBtnArg = (args && args.saveBtnArg) ? args.saveBtnArg : "Hi there..!!";//NO I18N

        var cancelBtnLabel = (args && args.cancelBtnLabel) ? args.cancelBtnLabel : I18n.getMsg('zr.component.modalbox.button.lable.cancel');
        var cancelBtnClass = (args && args.cancelBtnClass) ? ZRComponent.getButtonClass(args.cancelBtnClass) : ZRComponent.getBtnClass(1);
        var cancelBtnFun = (args && args.cancelBtnFun) ? args.cancelBtnFun : ZRComponent.closeFunction;
        var cancelBtnArg = (args && args.cancelBtnArg) ? args.cancelBtnArg : [modalId];

        args.position = (args && args.position && $.inArray(args.position, positionArray) != -1) ? args.position : ZRComponent.getDefaultModalBoxVal('position');
        args.modalId = modalId;

        var createElem = Utils.createHTML({
            "name": "div",//NO I18N
            "attr": {"class": needFreezeClass, "data-removefreeze": removeFreeze, "data-removedialog": removeDialog},//NO I18N
            "child"://No I18N
                [{
                    "name": "div",//NO I18N
                    "attr": {"class": modalClass, "id": modalId},//NO I18N
                    "child": [{//NO I18N
                        "name": "a",//NO I18N
                        "attr": {"href": "javascript:void(0)", "class": "zrc-close-modal"},//NO I18N
                        "html": "&times;",//NO I18N
                        "events": [{"name": "click", "fn": cancelBtnFun, "args": [modalId]}]//NO I18N
                    },//No I18N
                        {
                            "name": "h2", "attr": {"class": "til"}, "html": title, "child": [{
                            "name": "span", "html": subTitle
                        }]
                        },//NO I18N
                        {"name": "div", "attr": {"class": "zrc-modal-content"}, "html": modalContent},//NO I18N
                        {
                            "name": "div", "attr": {"class": btnAlignClass}, "child"://No I18N
                            [{
                                "name": "input",//NO I18N
                                "attr": { //NO I18N
                                    "type": "button",//NO I18N
                                    "class": saveBtnClass,//NO I18N
                                    "value": saveBtnLabel //NO I18N
                                },
                                "events": [{"name": "click", "fn": saveBtnFun, "args": saveBtnArg}]//NO I18N
                            },
                                {
                                    "name": "input",//NO I18N
                                    "attr": {//NO I18N
                                        "type": "button",//NO I18N
                                        "class": cancelBtnClass + " marL15",//NO I18N
                                        "value": cancelBtnLabel//NO I18N
                                    },
                                    "events": [{"name": "click", "fn": cancelBtnFun, "args": cancelBtnArg}]//NO I18N
                                }]
                        }]
                }]
        });

        ZRComponent.generateModalBox(args, createElem, 'alert');//NO I18N
    };

    return ZRComponent;
})();

ZRComponent.init();