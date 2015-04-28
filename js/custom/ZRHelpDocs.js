/**
 * Created by WebStorm.
 * User: kirubha-2911
 * Date: 4/9/15
 * Time: 1:06 PM
 * Project: ZRHelpDocs
 * File Name: ZRHelpDocs
 */

var ZRHelpDocs = angular.module("ZRHelpDocs", ["ngRoute", "ngSanitize"]);

ZRHelpDocs.config(function ($routeProvider) {

    $routeProvider
        .when("/", {
            templateUrl: "template/ZRHelpDocs.html",
            controller: "FormGenMainCtrl"
        });


});

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

}]);

$('body').on('click', function (event) {

    /*Left Menu Header Animation*/
    if ($(event.target).hasClass('fa-sort-up') || $(event.target).hasClass('fa-sort-down') || $(event.target).hasClass('menu-header')) {

        $('.menu-children').slideUp();

        if (!$(event.target).hasClass('mactive')) {
            if ($(event.target).hasClass('menu-header')) {
                $(event.target).addClass('mactive');
                $($(event.target)).next().slideDown();
            } else {
                $($(event.target)).parent().next().slideDown();
            }
        }

    }
});

$('.fa-sort-up,.fa-sort-down,.menu-header').on('click', function () {
    console.log("Test");
    $(this).parent().next();
});