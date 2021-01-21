/// <reference path="../typings/angularjs/angular.d.ts" />
/// <reference path="modules/home/HomeCtrl.ts" />
declare var angular: ng.IAngularStatic;

var phonecatApp = angular.module('splinkr', ['ngRoute', 'ngMaterial'])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: 'modules/home/home.html',
                    controller: splinkr.ui.homeCtrl,
                    controllerAs: 'vm'
                }).
                //schedule
                when('/schedule', {
                    templateUrl: 'modules/schedule/schedule.html',
                    controller: splinkr.ui.scheduleCtrl,
                    controllerAs: 'vm'
                }).
                when('/settings', {
                    templateUrl: 'modules/settings/settings.html',
                    controller: splinkr.ui.settingsCtrl,
                    controllerAs: 'vm'
                }).
                otherwise({
                    redirectTo: '/'
                });
        }])
    .service('splinkrService', splinkr.service.splinkrService);