(function () {
    'use strict';

    angular
        .module('app', ['ngRoute', 'ngMessages', 'ngSanitize', 'toastr' ,'satellizer', 'highcharts-ng'])
        .config(config)
        .run(run);

    function config($routeProvider, $authProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'components/home/home.view.html',
                controller: 'HomeCtrl',
                controllerAs: 'vm'
            })
            .when('/login', {
                templateUrl: 'components/login/login.view.html',
                controller: 'LoginCtrl',
                controllerAs: 'vm'
            })
            .when('/register', {
                templateUrl: 'components/register/register.view.html',
                controller: 'RegisterCtrl',
                controllerAs: 'vm'
            })
            .when('/about', {
                templateUrl: 'components/about/about.view.html',
                controller: 'AboutCtrl',
                controllerAs: 'vm'
            })
            .when('/help', {
                templateUrl: 'components/help/help.view.html',
                controller: 'HelpCtrl',
                controllerAs: 'vm'
            })
            .when('/activity', {
                templateUrl: 'components/activity/activity.view.html',
                controller: 'ActivityLogCtrl',
                controllerAs: 'vm'
            })
            .when('/achievements', {
                templateUrl: 'components/achievements/achievements.view.html',
                controller: 'AchievementCtrl',
                controllerAs: 'vm'
            })
            .when('/gear', {
                templateUrl: 'components/gear/gear.view.html',
                controller: 'GearCtrl',
                controllerAs: 'vm'
            })
            .when('/social', {
                templateUrl: 'components/social/social.view.html',
                controller: 'SocialCtrl',
                controllerAs: 'vm'
            })
            .otherwise({redirectTo: '/'});



        $authProvider.facebook({
            clientId: '1009093145865215'
        });

        $authProvider.google({
            clientId: '664613672592-cfog44p1k60pmnkbjatto449rgt74mgl.apps.googleusercontent.com'
        });

        /*
        $authProvider.instagram({
            clientId: '6ad0ab54caa24d559173c957bdcfaa58'
        });*/
    }


    function run($http, $window) {
        if ($window.localStorage['token']) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $window.localStorage['token'];
        }
        else if($window.localStorage['satellizer_token']) {
            $http.defaults.headers.common.Authorization = 'Bearer ' + $window.localStorage['satellizer_token'];
        }
    }

})();
