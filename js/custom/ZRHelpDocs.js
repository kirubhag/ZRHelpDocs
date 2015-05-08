/**
 * Created by WebStorm.
 * User: kirubha-2911
 * Date: 4/9/15
 * Time: 1:06 PM
 * Project: ZRHelpDocs
 * File Name: ZRHelpDocs
 */

var ZRHelpDocs = angular.module("ZRHelpDocs", ["ngRoute", "ngSanitize"]);

ZRHelpDocs.server = {};

ZRHelpDocs.serverConfig = {
    mine: {
        host: "http://localhost",
        port: "8888"
    },
    local: {
        host: "http://192.168.237.223",
        port: "8888"
    },
    dev: {
        host: "http://192.168.239.61",
        port: "8888"
    }
};

ZRHelpDocs.server.local = "mine";

ZRHelpDocs.getMyHost = function () {

    var config;
    switch (ZRHelpDocs.server.local.toLocaleLowerCase()) {
        case "local":
            config = ZRHelpDocs.serverConfig.local;
            break;
        case "dev":
            config = ZRHelpDocs.serverConfig.dev;
            break;
        default:
            config = ZRHelpDocs.serverConfig.mine;
            break;
    }

    var host = config.host;
    var port = config.port;

    return host + ':' + port;
};

ZRHelpDocs.getBasePath = function () {
    return ZRHelpDocs.getMyHost() + "/ZRHelpDocs/#/";
};

/*Routing is handled here*/
ZRHelpDocs.config(function ($routeProvider) {

    $routeProvider
        .when("/", {
            templateUrl: "template/ZRHelpDocs.html",
            controller: "FormGenMainCtrl"
        }).when("/modal-box/confirm", {
            templateUrl: "template/Confirm.html",
            controller: "FormGenMainCtrl"
        }).when("/modal-box", {
            templateUrl: "template/Modal-box.html",
            controller: "FormGenMainCtrl"
        }).when("/alert-box", {
            templateUrl: "template/Alert-box.html",
            controller: "FormGenMainCtrl"
        });


});

ZRHelpDocs.changeHash = function (hash) {
    window.location.hash = (hash) ? "#/" + hash : window.location.hash
};

ZRHelpDocs.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});

ZRHelpDocs.controller("FormGenMainCtrl", ["$scope", "$location", "$log", "$http", "$sce", function ($scope, $location, $log, $http, $sce) {

    $('.logo').on('click', function () {
        window.location.href = ZRHelpDocs.getBasePath();
    });

    var ZRHelp = {};

    ZRHelp.AnimationDuration = 600;

    /*This will place the content at the middle of the screen*/
    ZRHelp.makeItMiddle = function (element, sw, sh) {
        var h = $(element).height();
        var w = $(element).width();
        var top = (( sh / 2) - (h / 2)) + 'px';//NO I18N
        var left = ((sw / 2) - (w / 2)) + 'px';//NO I18N
        $(element).css({top: top, left: left}).fadeIn('slow');
    };


    ZRHelp.init = function () {

        $('.menu-header').on('click', function () {
            if (!$(this).hasClass('mactive')) {
                $('.mactive').next().slideUp();
                $('.mactive').removeClass('mactive');

                $(this).next().slideDown();
                $(this).addClass('mactive');
                ZRHelpDocs.changeHash($(this).data('hashval'));
            } else {
                ZRHelpDocs.changeHash($(this).data('hashval'));
            }
        });

        $('.gallery-wrap').on('mouseover', function () {
            ZRHelp.makeItMiddle($(this).find('h4'), $(this).width(), $(this).height());
            $(this).find('.bg-trans').stop().animate({top: 0}, ZRHelp.AnimationDuration);
        });

        $('.gallery-wrap').on('mouseout', function () {
            ZRHelp.makeItMiddle($(this).find('h4'), $(this).width(), $(this).height());
            $(this).find('.bg-trans').stop().animate({top: "-400"}, ZRHelp.AnimationDuration);
            $(this).find('h4').fadeOut('slow');
        });
    };

    ZRHelp.init();
}]);